const MockData = (() => {
  let businesses = [];
  let showcaseItems = [];
  let promotions = [];
  let loadPromise = null;
  let loadedFromSupabase = false;
  let loadError = null;
  let totalReservasHoy = 0;

  const defaultCoverUrl = '';
  const defaultLogoUrl = '';

  // RomaHub son paginas separadas (index/search/tienda/business...), asi que
  // cambiar de seccion recarga toda la app y volvia a pedirlo todo a Supabase:
  // de ahi el "Cargando negocios..." en cada clic. Guardamos el resultado ya
  // normalizado en sessionStorage para pintar al instante y refrescar detras.
  // Cambiar la version invalida caches que pudieron guardar solo los primeros
  // 1,000 servicios por el limite de filas de Supabase.
  const CACHE_KEY = 'romahub-negocios-v3';
  const CACHE_TTL_MS = 5 * 60 * 1000;

  function leerCache() {
    try {
      const crudo = sessionStorage.getItem(CACHE_KEY);
      if (!crudo) return null;
      const guardado = JSON.parse(crudo);
      if (!guardado || !Array.isArray(guardado.businesses)) return null;
      if (Date.now() - Number(guardado.guardadoEn || 0) > CACHE_TTL_MS) return null;
      return guardado;
    } catch (error) {
      return null;
    }
  }

  function guardarCache() {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        guardadoEn: Date.now(),
        businesses,
        showcaseItems,
        promotions,
        totalReservasHoy
      }));
    } catch (error) {
      // sessionStorage lleno o bloqueado: seguimos sin cache, no es critico.
    }
  }

  // Fotos de stock por categoria (mismas que usa rservasroma en
  // utils/hero-backgrounds.js). imagen_fondo_url casi siempre esta vacia en
  // negocios: el dueno solo elige una categoria (imagen_fondo_tipo) y
  // rservasroma resuelve la foto en su propio cliente, nunca llega a la BD.
  // Sin esto las tarjetas quedan en gris plano para el 100% de los negocios.
  const CATEGORY_COVER_PHOTOS = {
    unas: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=60&w=800&auto=format&fit=crop',
    belleza: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=60&w=800&auto=format&fit=crop',
    barberia: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=60&w=800&auto=format&fit=crop',
    peluqueria: 'https://images.unsplash.com/photo-1701976333339-1d41dad8138b?ixlib=rb-4.1.0&q=60&fm=jpg&crop=entropy&cs=srgb&w=800&auto=format&fit=crop',
    lashes: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?ixlib=rb-4.1.0&q=60&fm=jpg&crop=entropy&cs=srgb&w=800&auto=format&fit=crop'
  };

  function resolveCategoryCoverPhoto(fondoTipo, especialidad) {
    const tipo = String(fondoTipo || '').trim().toLowerCase();
    if (CATEGORY_COVER_PHOTOS[tipo]) return CATEGORY_COVER_PHOTOS[tipo];

    const texto = String(especialidad || '').toLowerCase();
    if (/barber/.test(texto)) return CATEGORY_COVER_PHOTOS.barberia;
    if (/pesta/.test(texto)) return CATEGORY_COVER_PHOTOS.lashes;
    if (/pelo|peluquer/.test(texto)) return CATEGORY_COVER_PHOTOS.peluqueria;
    if (/u[ñn]a|manicur|pedicur/.test(texto)) return CATEGORY_COVER_PHOTOS.unas;
    return CATEGORY_COVER_PHOTOS.belleza;
  }

  function getSupabaseConfig() {
    const url = window.SUPABASE_URL || window.supabaseUrl || '';
    const key = window.SUPABASE_ANON_KEY || window.supabaseAnonKey || '';
    if (!url || !key) return null;
    return { url: String(url).replace(/\/$/, ''), key };
  }

  function tiendaTablesEnabled() {
    try {
      return window.ENABLE_TIENDA_TABLES === true || window.localStorage?.getItem('enableTiendaTables') === 'true';
    } catch (error) {
      return window.ENABLE_TIENDA_TABLES === true;
    }
  }

  async function supabaseFetch(path, options = {}) {
    const config = getSupabaseConfig();
    if (!config) throw new Error('Supabase no configurado');

    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        'Cache-Control': 'no-cache',
        ...(options.headers || {})
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase ${path}: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  async function supabaseFetchAll(path, pageSize = 1000, maxRows = 10000) {
    const rows = [];
    for (let from = 0; from < maxRows; from += pageSize) {
      const page = await supabaseFetch(path, {
        headers: { Range: `${from}-${from + pageSize - 1}` }
      });
      rows.push(...page);
      if (page.length < pageSize) break;
    }
    return rows;
  }

  async function fetchOptionalTable(table, ids) {
    try {
      if (!ids.length) return [];
      const encodedIds = ids.map(encodeURIComponent).join(',');
      return await supabaseFetch(`${table}?negocio_id=in.(${encodedIds})&select=*`);
    } catch (error) {
      console.warn(`Tabla opcional no disponible: ${table}`, error);
      return [];
    }
  }

  async function optionalSupabaseFetch(path) {
    try {
      return await supabaseFetch(path);
    } catch (error) {
      console.warn('Consulta opcional no disponible:', path, error?.message || error);
      return [];
    }
  }

  async function optionalSupabaseFetchAll(path, pageSize = 1000, maxRows = 10000) {
    try {
      return await supabaseFetchAll(path, pageSize, maxRows);
    } catch (error) {
      console.warn('Consulta paginada opcional no disponible:', path, error?.message || error);
      return [];
    }
  }

  async function optionalSupabaseCount(path) {
    try {
      const config = getSupabaseConfig();
      if (!config) return 0;
      const response = await fetch(`${config.url}/rest/v1/${path}`, {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
          Prefer: 'count=exact',
          Range: '0-0'
        },
        cache: 'no-store'
      });
      if (!response.ok) return 0;
      const contentRange = response.headers.get('content-range') || '';
      const total = Number(contentRange.split('/').pop());
      return Number.isFinite(total) ? total : 0;
    } catch (error) {
      console.warn('Conteo opcional no disponible:', path, error?.message || error);
      return 0;
    }
  }

  async function supabaseInsert(path, payload) {
    const config = getSupabaseConfig();
    if (!config) throw new Error('Supabase no configurado');

    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      method: 'POST',
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase ${path}: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  function valueFrom(row, keys, fallback = '') {
    for (const key of keys) {
      if (row?.[key] != null && row[key] !== '') return row[key];
    }
    return fallback;
  }

  function boolFrom(row, keys, fallback = false) {
    const value = valueFrom(row, keys, fallback);
    return value === true || value === 'true' || value === 1 || value === '1';
  }

  function numberFrom(row, keys, fallback = 0) {
    const value = Number(valueFrom(row, keys, fallback));
    return Number.isFinite(value) ? value : fallback;
  }

  function normalizeExternalUrl(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://${raw}`;
  }

  function groupByBusiness(rows) {
    return (rows || []).reduce((acc, row) => {
      const id = row.negocio_id || row.negocioId || row.business_id;
      if (!id) return acc;
      if (!acc[id]) acc[id] = [];
      acc[id].push(row);
      return acc;
    }, {});
  }

  function businessIdSet(rows) {
    return new Set((rows || []).map((row) => row.negocio_id || row.negocioId || row.business_id).filter(Boolean));
  }

  function getReservationCreatedAt(row) {
    return row.created_at || row.fecha_creacion || row.fecha_registro || row.fecha || row.fecha_reserva || row.inicio;
  }

  function isActiveReservation(row) {
    const estado = normalizeText(row.estado || row.status || '');
    return !estado.includes('cancel');
  }

  function countWeeklyReservations(rows) {
    const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return (rows || []).reduce((acc, row) => {
      const id = row.negocio_id || row.negocioId || row.business_id;
      if (!id) return acc;
      const dateValue = getReservationCreatedAt(row);
      const time = dateValue ? new Date(dateValue).getTime() : Date.now();
      if (!Number.isFinite(time) || time < since || !isActiveReservation(row)) return acc;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
  }

  function getTodayStartIso() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return todayStart.toISOString();
  }

  function getWeekStartIso() {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    return weekStart.toISOString();
  }

  function buildCatalogSections({ servicios, productos, cursos }) {
    const sections = [];

    if (servicios?.length) {
      sections.push({
        tipo: 'servicios',
        titulo: 'Servicios',
        items: servicios.map((item) => ({
          id: String(item.id || valueFrom(item, ['nombre', 'titulo', 'servicio'], 'Servicio')),
          nombre: valueFrom(item, ['nombre', 'titulo', 'servicio'], 'Servicio'),
          categoria: valueFrom(item, ['categoria', 'subgrupo'], ''),
          orden: numberFrom(item, ['orden'], 0),
          duracionMin: numberFrom(item, ['duracion_min', 'duracionMin', 'duracion', 'minutos'], 60),
          precio: numberFrom(item, ['precio', 'precio_cup', 'monto'], 0),
          moneda: String(valueFrom(item, ['precio_moneda', 'moneda'], 'CUP')).toUpperCase(),
          descripcion: valueFrom(item, ['descripcion', 'description', 'detalle'], ''),
          destacado: boolFrom(item, ['destacado', 'recomendado'], false)
        }))
      });
    }

    if (productos?.length) {
      sections.push({
        tipo: 'productos',
        titulo: 'Productos',
        items: productos.map((item) => ({
          id: String(item.id || valueFrom(item, ['nombre', 'titulo', 'producto'], 'Producto')),
          nombre: valueFrom(item, ['nombre', 'titulo', 'producto'], 'Producto'),
          stock: numberFrom(item, ['stock', 'cantidad'], 0),
          precio: numberFrom(item, ['precio', 'precio_cup', 'monto'], 0),
          moneda: String(valueFrom(item, ['precio_moneda', 'moneda'], 'CUP')).toUpperCase(),
          descripcion: valueFrom(item, ['descripcion', 'description', 'detalle'], ''),
          imagen: valueFrom(item, ['imagen', 'imagen_url', 'foto_url'], '')
        }))
      });
    }

    if (cursos?.length) {
      sections.push({
        tipo: 'cursos',
        titulo: 'Cursos y Talleres',
        items: cursos.map((item) => ({
          id: String(item.id || valueFrom(item, ['nombre', 'titulo', 'curso'], 'Curso')),
          nombre: valueFrom(item, ['nombre', 'titulo', 'curso'], 'Curso'),
          fecha: valueFrom(item, ['fecha', 'fecha_inicio', 'created_at'], new Date().toISOString()),
          ubicacion: valueFrom(item, ['ubicacion', 'direccion', 'lugar'], ''),
          precio: numberFrom(item, ['precio', 'precio_cup', 'monto'], 0),
          moneda: String(valueFrom(item, ['precio_moneda', 'moneda'], 'CUP')).toUpperCase(),
          descripcion: valueFrom(item, ['descripcion', 'description', 'detalle'], ''),
          imagen: valueFrom(item, ['imagen', 'imagen_url', 'foto_url'], '')
        }))
      });
    }

    return sections;
  }

  function normalizeBusiness(row, relations, ratingData) {
    const id = String(row.id || row.negocio_id || row.uuid || '');
    const provincia = valueFrom(row, ['provincia', 'province'], '');
    const municipio = valueFrom(row, ['municipio'], '');
    const ciudad = valueFrom(row, ['ciudad', 'municipio', 'city'], provincia);
    const zona = valueFrom(row, ['zona', 'barrio', 'municipio'], ciudad);
    const direccion = valueFrom(row, ['direccion', 'ubicacion', 'address'], zona);
    const lat = numberFrom(row, ['lat', 'latitud', 'latitude'], 23.1136);
    const lng = numberFrom(row, ['lng', 'longitud', 'lon', 'longitude'], -82.3666);
    const telefono = valueFrom(row, ['whatsapp', 'telefono', 'phone'], '');
    const especialidad = valueFrom(row, ['categoria', 'tipo_negocio', 'rubro', 'especialidad'], 'Belleza');
    const coverUrlPropia = valueFrom(row, ['imagen_fondo_url', 'portada_url', 'cover_url', 'foto_portada', 'imagen_url'], '');
    const coverUrl = coverUrlPropia || resolveCategoryCoverPhoto(row.imagen_fondo_tipo, especialidad);
    const logoUrl = valueFrom(row, ['logo_url', 'logo', 'avatar_url'], defaultLogoUrl);
    const fotos = [coverUrl, logoUrl].filter(Boolean);
    const slug = valueFrom(row, ['slug'], '');
    const esTiendaExterna = boolFrom(row, ['es_tienda_externa'], false);
    const externalUrl = normalizeExternalUrl(valueFrom(row, ['reserva_url', 'booking_url', 'url_reserva', 'url_negocio', 'negocio_url', 'sitio_web', 'url', 'link'], ''));
    // Las tiendas externas tienen slug (para su propio perfil) pero NO tienen
    // agenda de citas en rservasroma: mandarlas ahi seria un enlace muerto.
    const reservaUrl = (slug && !esTiendaExterna)
      ? `https://tusalon.github.io/rservasroma/?s=${encodeURIComponent(slug)}`
      : externalUrl;

    const servicios = relations.servicios[id] || [];
    const productos = relations.productos[id] || [];
    const cursos = relations.cursos[id] || [];
    const promociones = relations.promociones?.[id] || [];
    const resenas = relations.resenas[id] || [];
    const descripcionNegocio = valueFrom(row, ['descripcion', 'description', 'mensaje_bienvenida'], '');
    const tieneServicios = servicios.length > 0;
    const tieneUbicacion = Boolean(provincia && municipio);
    const tienePrecioServicio = servicios.some((item) => numberFrom(item, ['precio', 'precio_cup', 'monto'], 0) > 0);
    const calidadPerfil = [
      tieneServicios,
      tieneUbicacion,
      Boolean(logoUrl),
      Boolean(coverUrlPropia),
      Boolean(descripcionNegocio),
      tienePrecioServicio
    ].filter(Boolean).length;

    // El rango de precio del negocio mezcla servicios+productos+cursos, que
    // pueden estar en monedas distintas (hay negocios con servicios en USD).
    // Se calcula solo sobre la moneda MAS FRECUENTE de ese negocio, para no
    // mostrar un rango "100 - 5000" mezclando CUP con USD bajo una sola
    // etiqueta enganosa.
    const preciosConMoneda = [...servicios, ...productos, ...cursos]
      .map((item) => ({
        valor: numberFrom(item, ['precio', 'precio_cup', 'monto'], null),
        moneda: String(valueFrom(item, ['precio_moneda', 'moneda'], 'CUP')).toUpperCase()
      }))
      .filter((p) => p.valor != null && Number.isFinite(p.valor) && p.valor > 0);

    const conteoMonedas = {};
    preciosConMoneda.forEach((p) => { conteoMonedas[p.moneda] = (conteoMonedas[p.moneda] || 0) + 1; });
    const monedaDominante = Object.keys(conteoMonedas).sort((a, b) => conteoMonedas[b] - conteoMonedas[a])[0]
      || String(valueFrom(row, ['whatsapp_moneda'], 'CUP')).toUpperCase();
    const precios = preciosConMoneda.filter((p) => p.moneda === monedaDominante).map((p) => p.valor);

    const rating = ratingData?.[id];
    const estrellas = rating ? rating.promedio : 0;
    const totalValoraciones = rating ? rating.total : 0;
    const enRanking = totalValoraciones >= 3;

    return {
      id,
      slug,
      nombre: valueFrom(row, ['nombre', 'name', 'titulo'], 'Negocio sin nombre'),
      categoria: especialidad,
      vip: boolFrom(row, ['vip', 'es_vip', 'premium'], false),
      verificado: enRanking,
      topRoma: boolFrom(row, ['top_roma', 'topRoma', 'destacado'], false),
      masReservado: boolFrom(row, ['mas_reservado', 'masReservado'], false),
      negocioDelMes: boolFrom(row, ['negocio_del_mes', 'negocioDelMes'], false),
      ubicacion: { provincia, municipio, ciudad, zona, direccion },
      ubicacionCorta: [municipio, provincia].filter(Boolean).join(', '),
      coordenadas: { lat, lng },
      rangoPrecio: {
        min: precios.length ? Math.min(...precios) : numberFrom(row, ['precio_min', 'precio_desde'], 0),
        max: precios.length ? Math.max(...precios) : numberFrom(row, ['precio_max', 'precio_hasta'], 0),
        moneda: monedaDominante
      },
      estrellas,
      totalValoraciones,
      totalResenas: totalValoraciones,
      enRanking,
      tieneServicios,
      tieneUbicacion,
      tienePrecioServicio,
      calidadPerfil,
      esTiendaExterna,
      // El diamante 💎 y la prioridad los tiene quien NO es tienda externa
      // (un negocio rservasroma con suscripción activa).
      esRservasroma: !esTiendaExterna,
      portadaUrl: coverUrl,
      portadaEsPropia: Boolean(coverUrlPropia),
      portadaPosicion: {
        x: Math.max(0, Math.min(100, numberFrom(row, ['imagen_fondo_pos_x'], 50))),
        y: Math.max(0, Math.min(100, numberFrom(row, ['imagen_fondo_pos_y'], 50)))
      },
      logoUrl,
      reservaUrl,
      fotos: fotos.length ? fotos : [logoUrl],
      whatsapp: telefono ? String(telefono).replace(/[^\d+]/g, '') : '',
      // El horario ya venia en la consulta pero se perdia aqui: es justo el
      // dato que la clienta busca antes de decidir si reserva.
      horario: valueFrom(row, ['horario_atencion', 'horario'], ''),
      descripcion: descripcionNegocio,
      promociones: promociones.map((item) => ({
        id: String(item.id || ''),
        negocioId: id,
        negocioNombre: valueFrom(row, ['nombre', 'name', 'titulo'], 'Negocio'),
        negocioWhatsapp: telefono ? String(telefono).replace(/[^\d+]/g, '') : '',
        negocioLogo: logoUrl,
        titulo: valueFrom(item, ['titulo'], 'Oferta especial'),
        descripcion: valueFrom(item, ['descripcion'], ''),
        tipo: valueFrom(item, ['tipo'], 'general'),
        itemId: valueFrom(item, ['item_id'], ''),
        precioAnterior: numberFrom(item, ['precio_anterior'], 0),
        precioPromocional: numberFrom(item, ['precio_promocional'], 0),
        moneda: String(valueFrom(item, ['moneda'], 'CUP')).toUpperCase(),
        imagen: valueFrom(item, ['imagen_url'], ''),
        fechaInicio: valueFrom(item, ['fecha_inicio'], ''),
        fechaFin: valueFrom(item, ['fecha_fin'], ''),
        activo: boolFrom(item, ['activo'], true)
      })),
      categoriasCatalogo: buildCatalogSections({ servicios, productos, cursos }),
      resenas: resenas.map((item, index) => ({
        id: String(item.id || `${id}-resena-${index}`),
        nombre: valueFrom(item, ['nombre', 'cliente_nombre', 'cliente'], 'Cliente'),
        estrellas: numberFrom(item, ['estrellas', 'rating', 'calificacion'], 5),
        verificada: boolFrom(item, ['verificada', 'verificado'], false),
        texto: valueFrom(item, ['texto', 'comentario', 'review'], ''),
        fecha: valueFrom(item, ['fecha', 'created_at'], new Date().toISOString())
      }))
    };
  }

  async function fetchVerifiedRatings() {
    try {
      const rows = await optionalSupabaseFetchAll(
        'reservas?valoracion_servicio=not.is.null&select=id,negocio_id,valoracion_servicio&order=negocio_id.asc,id.asc'
      );
      const grouped = {};
      (rows || []).forEach((row) => {
        const id = row.negocio_id;
        if (!id || !row.valoracion_servicio) return;
        if (!grouped[id]) grouped[id] = [];
        grouped[id].push(Number(row.valoracion_servicio));
      });
      const result = {};
      Object.entries(grouped).forEach(([id, vals]) => {
        const sum = vals.reduce((a, b) => a + b, 0);
        result[id] = {
          promedio: Math.round((sum / vals.length) * 10) / 10,
          total: vals.length
        };
      });
      return result;
    } catch (error) {
      console.warn('No se pudieron cargar valoraciones verificadas:', error?.message || error);
      return {};
    }
  }

  async function loadBusinesses(forceRefresh = false) {
    if (loadedFromSupabase && !forceRefresh) return businesses.slice();
    if (loadPromise && !forceRefresh) return loadPromise;

    // Con cache fresca se pinta de inmediato y se refresca por detras, para
    // que cambiar de seccion no muestre "Cargando..." otra vez.
    if (!forceRefresh) {
      const guardado = leerCache();
      if (guardado) {
        businesses = (guardado.businesses || []).map((business) => ({
          ...business,
          promociones: (business.promociones || []).filter(isPromotionCurrent)
        }));
        showcaseItems = guardado.showcaseItems || [];
        promotions = guardado.promotions || businesses.flatMap((business) => business.promociones || []);
        totalReservasHoy = guardado.totalReservasHoy || 0;
        loadedFromSupabase = true;
        loadError = null;
        setTimeout(() => { loadBusinesses(true).catch(() => {}); }, 0);
        return businesses.slice();
      }
    }

    loadPromise = (async () => {
      const config = getSupabaseConfig();
      if (!config) {
        businesses = [];
        loadError = 'Falta configurar SUPABASE_URL y SUPABASE_ANON_KEY.';
        throw new Error(loadError);
      }

      try {
        const CAMPOS_NEGOCIO = 'id,nombre,telefono,especialidad,slug,logo_url,imagen_fondo_url,imagen_fondo_tipo,imagen_fondo_pos_x,imagen_fondo_pos_y,mensaje_bienvenida,instagram,facebook,sitio_web,direccion,horario_atencion,configurado,plan,provincia,municipio,es_tienda_externa,whatsapp_moneda';
        const [rowsRserva, rowsExternas, ratingData] = await Promise.all([
          // Ya no exige suscripcion activa: el directorio muestra todo negocio
          // configurado, tenga o no suscripcion al dia. El diamante 💎 nunca
          // dependio de esto en el codigo (normalizeBusiness lo calcula solo
          // por es_tienda_externa), asi que quitar el filtro no le quita
          // significado. La curaduria de quien se ve ahora es manual, via el
          // propio campo "configurado" de cada negocio.
          supabaseFetchAll(`negocios?configurado=eq.true&select=${CAMPOS_NEGOCIO}&order=nombre.asc,id.asc`),
          // Tiendas externas: se identifican por el flag, no por suscripcion.
          optionalSupabaseFetchAll(`negocios?configurado=eq.true&es_tienda_externa=eq.true&select=${CAMPOS_NEGOCIO}&order=nombre.asc,id.asc`),
          fetchVerifiedRatings()
        ]);

        // Combinar sin duplicar: un negocio con suscripción manda sobre su
        // posible marca de externa (no debería pasar, pero por seguridad).
        const idsRserva = new Set((rowsRserva || []).map((r) => r.id));
        const rows = [
          ...(rowsRserva || []),
          ...(rowsExternas || []).filter((r) => !idsRserva.has(r.id))
        ];

        // Estas cinco consultas son independientes entre si: encadenarlas con
        // await sumaba cinco viajes de ida y vuelta antes de pintar nada, que
        // con internet lento es justo lo que hacia eterno el "Cargando...".
        // De la tabla reservas solo se piden las tres columnas que se usan
        // para contar: traer select=* exponia datos privados de las clientas
        // (nombre, WhatsApp, precios, notas de cobro) a cualquier visitante.
        const [
          reservasHoyCount,
          serviciosRows,
          reservasSemanaRows,
          productosTiendaRows,
          cursosTiendaRows,
          promocionesRows
        ] = await Promise.all([
          optionalSupabaseCount('reservas?created_at=gte.' + encodeURIComponent(getTodayStartIso()) + '&select=id'),
          optionalSupabaseFetchAll('servicios?activo=eq.true&select=id,negocio_id,nombre,precio,precio_moneda,categoria,orden&order=negocio_id.asc,orden.asc,nombre.asc,id.asc'),
          optionalSupabaseFetchAll('reservas?created_at=gte.' + encodeURIComponent(getWeekStartIso()) + '&select=id,negocio_id,created_at,estado&order=created_at.asc,id.asc'),
          tiendaTablesEnabled()
            ? optionalSupabaseFetchAll('productos?activo=eq.true&select=id,negocio_id,nombre,descripcion,precio,moneda,imagen_url,categoria,stock,activo,destacado,orden&order=negocio_id.asc,destacado.desc,orden.asc,nombre.asc,id.asc')
            : Promise.resolve([]),
          tiendaTablesEnabled()
            ? optionalSupabaseFetchAll('cursos?activo=eq.true&select=id,negocio_id,nombre,descripcion,precio,moneda,imagen_url,categoria,fecha,ubicacion,duracion,cupos,activo,destacado,orden&order=negocio_id.asc,destacado.desc,orden.asc,fecha.asc,nombre.asc,id.asc')
            : Promise.resolve([]),
          optionalSupabaseFetchAll('promociones_romahub?activo=eq.true&select=id,negocio_id,titulo,descripcion,tipo,item_id,precio_anterior,precio_promocional,moneda,imagen_url,fecha_inicio,fecha_fin,activo,created_at&order=created_at.desc,id.asc')
        ]);
        totalReservasHoy = reservasHoyCount;
        const tiendasIds = new Set([...businessIdSet(productosTiendaRows), ...businessIdSet(cursosTiendaRows)]);
        const reservasSemanaPorNegocio = countWeeklyReservations(reservasSemanaRows);

        const relations = {
          servicios: groupByBusiness(serviciosRows),
          productos: groupByBusiness(productosTiendaRows),
          cursos: groupByBusiness(cursosTiendaRows),
          promociones: groupByBusiness(promocionesRows),
          resenas: {}
        };

        businesses = (rows || [])
          .map((row) => {
            const business = normalizeBusiness(row, relations, ratingData);
            business.reservasSemana = reservasSemanaPorNegocio[business.id] || 0;
            business.detallesCargados = false;
            business.tieneTienda = tiendasIds.has(business.id);
            return business;
          })
          .filter((business) => business.id);

        // Escaparate: productos y cursos individuales de todos los negocios,
        // enriquecidos con el negocio dueño para poder enlazar a su perfil.
        const negocioPorId = {};
        businesses.forEach((negocio) => { negocioPorId[negocio.id] = negocio; });
        const enrichStoreItem = (item, tipo) => {
          const negocio = negocioPorId[item.negocio_id || item.negocioId];
          if (!negocio) return null;
          return {
            id: `${tipo}-${item.id}`,
            itemId: String(item.id),
            tipo,
            nombre: item.nombre || '',
            descripcion: item.descripcion || '',
            precio: Number(item.precio || 0),
            moneda: String(item.moneda || 'CUP').toUpperCase(),
            imagen: item.imagen_url || '',
            categoria: item.categoria || '',
            destacado: item.destacado === true,
            stock: item.stock,
            fecha: item.fecha || null,
            negocioId: negocio.id,
            negocioNombre: negocio.nombre,
            negocioSlug: negocio.slug,
            negocioLogo: negocio.logoUrl,
            negocioReservaUrl: negocio.reservaUrl,
            negocioWhatsapp: negocio.whatsapp,
            negocioEsRservasroma: negocio.esRservasroma,
            negocioEsTiendaExterna: negocio.esTiendaExterna
          };
        };
        showcaseItems = [
          ...(productosTiendaRows || []).map((item) => enrichStoreItem(item, 'producto')),
          ...(cursosTiendaRows || []).map((item) => enrichStoreItem(item, 'curso'))
        ].filter(Boolean);
        promotions = businesses.flatMap((business) => business.promociones || []);

        loadedFromSupabase = true;
        loadError = null;
        guardarCache();
        console.log(`RomaHub cargo ${businesses.length} negocios desde Supabase (${showcaseItems.length} productos/cursos, ${Object.keys(ratingData).length} con valoraciones verificadas)`);
        return businesses.slice();
      } catch (error) {
        businesses = [];
        loadError = 'No se pudieron cargar negocios desde Supabase.';
        console.error(loadError, error);
        throw error;
      }
    })();

    return loadPromise;
  }

  async function loadBusinessDetails(id, forceRefresh = false) {
    const negocioId = String(id || '');
    if (!negocioId) return null;

    const current = businesses.find((b) => b.id === negocioId);
    if (current?.detallesCargados && !forceRefresh) return current;

    const encodedId = encodeURIComponent(negocioId);
    const CAMPOS_DETALLE = 'id,nombre,telefono,especialidad,slug,logo_url,imagen_fondo_url,imagen_fondo_tipo,imagen_fondo_pos_x,imagen_fondo_pos_y,mensaje_bienvenida,instagram,facebook,sitio_web,direccion,horario_atencion,configurado,plan,provincia,municipio,es_tienda_externa,whatsapp_moneda';
    const [rowsRserva, rowsExterna, ratingData] = await Promise.all([
      // Mismo criterio que loadBusinesses: ya no exige suscripcion activa
      // para cargar el perfil, solo que este configurado.
      optionalSupabaseFetch(`negocios?id=eq.${encodedId}&configurado=eq.true&select=${CAMPOS_DETALLE}`),
      // Tienda externa: sin suscripción, por flag.
      optionalSupabaseFetch(`negocios?id=eq.${encodedId}&configurado=eq.true&es_tienda_externa=eq.true&select=${CAMPOS_DETALLE}`),
      fetchVerifiedRatings()
    ]);
    const rows = [...(rowsRserva || []), ...(rowsExterna || [])];
    const row = rows[0] || current || { id: negocioId };
    if (!rows[0] && !current) return null;
    const serviciosRows = await optionalSupabaseFetch(`servicios?activo=eq.true&negocio_id=eq.${encodedId}&select=id,negocio_id,nombre,duracion,precio,precio_moneda,descripcion,activo,imagen,categoria,orden&order=orden.asc,nombre.asc`);
    const resenasRows = await optionalSupabaseFetch(`resenas?negocio_id=eq.${encodedId}&select=*&order=fecha.desc&limit=50`);
    const productosRows = tiendaTablesEnabled()
      ? await optionalSupabaseFetch(`productos?activo=eq.true&negocio_id=eq.${encodedId}&select=id,negocio_id,nombre,descripcion,precio,moneda,imagen_url,categoria,stock,activo,destacado,orden&order=destacado.desc,orden.asc,nombre.asc&limit=200`)
      : [];
    const cursosRows = tiendaTablesEnabled()
      ? await optionalSupabaseFetch(`cursos?activo=eq.true&negocio_id=eq.${encodedId}&select=id,negocio_id,nombre,descripcion,precio,moneda,imagen_url,categoria,fecha,ubicacion,duracion,cupos,activo,destacado,orden&order=destacado.desc,orden.asc,fecha.asc,nombre.asc&limit=200`)
      : [];
    const promocionesRows = await optionalSupabaseFetch(`promociones_romahub?activo=eq.true&negocio_id=eq.${encodedId}&select=id,negocio_id,titulo,descripcion,tipo,item_id,precio_anterior,precio_promocional,moneda,imagen_url,fecha_inicio,fecha_fin,activo,created_at&order=created_at.desc,id.asc`);

    const detailed = normalizeBusiness(row, {
      servicios: groupByBusiness(serviciosRows),
      productos: groupByBusiness(productosRows),
      cursos: groupByBusiness(cursosRows),
      promociones: groupByBusiness(promocionesRows),
      resenas: groupByBusiness(resenasRows)
    }, ratingData);
    detailed.reservasSemana = current?.reservasSemana || 0;
    detailed.detallesCargados = true;

    const index = businesses.findIndex((b) => b.id === negocioId);
    if (index >= 0) {
      businesses[index] = detailed;
    } else {
      businesses.push(detailed);
    }

    return detailed;
  }

  // Los negocios rservasroma van primero; las tiendas externas, más abajo.
  function ordenNegocio(a, b) {
    if (a.tieneServicios !== b.tieneServicios) return a.tieneServicios ? -1 : 1;
    if (a.esRservasroma !== b.esRservasroma) return a.esRservasroma ? -1 : 1;
    if ((a.calidadPerfil || 0) !== (b.calidadPerfil || 0)) return (b.calidadPerfil || 0) - (a.calidadPerfil || 0);
    return String(a.nombre).localeCompare(String(b.nombre));
  }

  function listBusinesses() {
    return businesses.filter((business) => business.tieneServicios).sort(ordenNegocio);
  }

  function listUpcomingBusinesses(limit) {
    const list = businesses.filter((business) => !business.tieneServicios).sort(ordenNegocio);
    return limit ? list.slice(0, limit) : list;
  }

  function getLoadError() {
    return loadError;
  }

  function getTodayReservations() {
    return totalReservasHoy;
  }

  function listTopRated() {
    return businesses
      .slice()
      .filter((b) => b.tieneServicios && b.enRanking)
      .sort((a, b) => (b.estrellas - a.estrellas) || (b.totalValoraciones - a.totalValoraciones))
      .slice(0, 12);
  }

  function listWeeklyFeatured() {
    return businesses
      .slice()
      .filter((b) => b.tieneServicios)
      .sort((a, b) => (b.reservasSemana || 0) - (a.reservasSemana || 0) || a.nombre.localeCompare(b.nombre))
      .slice(0, 10);
  }

  function listRomaStores() {
    return businesses
      .filter((business) => business.tieneTienda)
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .slice(0, 12);
  }

  // Orden del escaparate: primero los productos de negocios rservasroma
  // (las tiendas externas van más abajo), y dentro de cada grupo los
  // destacados, luego los que tienen foto, y productos antes que cursos.
  function ordenarShowcase(items) {
    const peso = (item) => (item.destacado ? 0 : 2) + (item.imagen ? 0 : 1);
    return items.slice().sort((a, b) => {
      if (a.negocioEsRservasroma !== b.negocioEsRservasroma) return a.negocioEsRservasroma ? -1 : 1;
      const d = peso(a) - peso(b);
      if (d !== 0) return d;
      if (a.tipo !== b.tipo) return a.tipo === 'producto' ? -1 : 1;
      return String(a.nombre).localeCompare(String(b.nombre));
    });
  }

  function listShowcaseProducts(limit) {
    const items = ordenarShowcase(showcaseItems);
    return limit ? items.slice(0, limit) : items;
  }

  function getShowcaseCount() {
    return showcaseItems.length;
  }

  function listPromotions(limit) {
    const list = promotions
      .filter(isPromotionCurrent)
      .sort((a, b) => new Date(a.fechaFin).getTime() - new Date(b.fechaFin).getTime() || String(a.titulo).localeCompare(String(b.titulo)));
    return limit ? list.slice(0, limit) : list;
  }

  function isPromotionCurrent(item) {
    const now = Date.now();
    return item.activo !== false
      && (!item.fechaInicio || new Date(item.fechaInicio).getTime() <= now)
      && (!item.fechaFin || new Date(item.fechaFin).getTime() > now);
  }

  function listRomaReviews() {
    return businesses
      .flatMap((business) => (business.resenas || []).map((review) => ({ ...review, negocioNombre: business.nombre })))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 8);
  }

  async function addReview(negocioId, review) {
    const payload = {
      negocio_id: negocioId,
      nombre: review.nombre,
      estrellas: Number(review.estrellas),
      texto: review.texto,
      fecha: new Date().toISOString(),
      verificada: false
    };
    let inserted;
    try {
      inserted = await supabaseInsert('resenas', payload);
    } catch (error) {
      throw new Error('No se pudo guardar la resena.');
    }
    const created = inserted?.[0] || payload;
    const business = businesses.find((b) => b.id === negocioId);
    if (business) {
      const normalized = {
        id: String(created.id || `${negocioId}-${Date.now()}`),
        nombre: created.nombre || payload.nombre,
        estrellas: Number(created.estrellas || payload.estrellas),
        verificada: created.verificada === true,
        texto: created.texto || payload.texto,
        fecha: created.fecha || created.created_at || payload.fecha
      };
      business.resenas = [normalized, ...(business.resenas || [])];
    }
    return created;
  }

  async function addOrder(negocioId, order) {
    const payload = {
      negocio_id: negocioId,
      cliente_nombre: order.cliente_nombre,
      cliente_whatsapp: order.cliente_whatsapp,
      items: order.items || [],
      total: Number(order.total || 0),
      estado: 'enviado_whatsapp'
    };
    const inserted = await supabaseInsert('pedidos_whatsapp', payload);
    return inserted?.[0] || payload;
  }

  function getBusinessById(id) {
    const found = businesses.find((b) => b.id === id);
    return found || null;
  }

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  function matchesBusiness(b, query, includeCatalog = true) {
    const q = query || { nombre: '', servicio: '', ubicacion: '' };
    const nombre = normalizeText(q.nombre);
    const servicio = normalizeText(q.servicio);
    const ubicacion = normalizeText(q.ubicacion);

    const catalogTerms = includeCatalog
      ? (b.categoriasCatalogo || [])
        .flatMap((section) => [
          section.titulo,
          section.tipo,
          ...(section.items || []).flatMap((item) => [item.nombre, item.descripcion, item.categoria])
        ])
        .filter(Boolean)
        .concat((b.promociones || []).flatMap((item) => [item.titulo, item.descripcion, item.tipo]).filter(Boolean))
      : [];

    const hayNombre = !nombre || normalizeText(b.nombre).includes(nombre);

    const hayServicio = !servicio
      ? true
      : [b.categoria, b.descripcion, ...catalogTerms]
        .filter(Boolean)
        .some((t) => normalizeText(t).includes(servicio));

    const hayUbicacion = !ubicacion
      ? true
      : [b.ubicacion?.provincia, b.ubicacion?.municipio]
        .filter(Boolean)
        .some((t) => normalizeText(t).includes(ubicacion));

    const hayOferta = !q.ofertas || Boolean((b.promociones || []).length);

    return hayNombre && hayServicio && hayUbicacion && hayOferta;
  }

  function searchBusinesses(query) {
    const q = query || {};
    return businesses
      .filter((business) => (business.tieneServicios || (q.ofertas && (business.promociones || []).length)) && matchesBusiness(business, q))
      .sort(ordenNegocio);
  }

  function searchUpcomingBusinesses(query) {
    const q = query || {};
    if (!String(q.nombre || '').trim() || String(q.servicio || '').trim()) return [];
    return businesses
      .filter((business) => !business.tieneServicios && matchesBusiness(business, q, false))
      .sort(ordenNegocio);
  }

  return { listBusinesses, listUpcomingBusinesses, listTopRated, listWeeklyFeatured, listRomaStores, listShowcaseProducts, getShowcaseCount, listPromotions, listRomaReviews, searchBusinesses, searchUpcomingBusinesses, getBusinessById, loadBusinesses, loadBusinessDetails, getLoadError, getTodayReservations, addReview, addOrder };
})();
