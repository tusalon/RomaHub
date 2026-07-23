const MockData = (() => {
  let businesses = [];
  let loadPromise = null;
  let loadedFromSupabase = false;
  let loadError = null;
  let totalReservasHoy = 0;

  const defaultCoverUrl = '';
  const defaultLogoUrl = '';

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

  async function supabaseFetch(path) {
    const config = getSupabaseConfig();
    if (!config) throw new Error('Supabase no configurado');

    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase ${path}: ${response.status} ${errorText}`);
    }

    return response.json();
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
          nombre: valueFrom(item, ['nombre', 'titulo', 'servicio'], 'Servicio'),
          duracionMin: numberFrom(item, ['duracion_min', 'duracionMin', 'duracion', 'minutos'], 60),
          precio: numberFrom(item, ['precio', 'precio_cup', 'monto'], 0),
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
    const coverUrl = valueFrom(row, ['imagen_fondo_url', 'portada_url', 'cover_url', 'foto_portada', 'imagen_url'], '');
    const logoUrl = valueFrom(row, ['logo_url', 'logo', 'avatar_url'], defaultLogoUrl);
    const fotos = [coverUrl, logoUrl].filter(Boolean);
    const slug = valueFrom(row, ['slug'], '');
    const externalUrl = normalizeExternalUrl(valueFrom(row, ['reserva_url', 'booking_url', 'url_reserva', 'url_negocio', 'negocio_url', 'sitio_web', 'url', 'link'], ''));
    const reservaUrl = slug
      ? `https://tusalon.github.io/rservasroma/?s=${encodeURIComponent(slug)}`
      : externalUrl;

    const servicios = relations.servicios[id] || [];
    const productos = relations.productos[id] || [];
    const cursos = relations.cursos[id] || [];
    const resenas = relations.resenas[id] || [];

    const precios = [...servicios, ...productos, ...cursos]
      .map((item) => numberFrom(item, ['precio', 'precio_cup', 'monto'], null))
      .filter((value) => value != null && Number.isFinite(value) && value > 0);

    const rating = ratingData?.[id];
    const estrellas = rating ? rating.promedio : 0;
    const totalValoraciones = rating ? rating.total : 0;
    const enRanking = totalValoraciones >= 3;

    return {
      id,
      slug,
      nombre: valueFrom(row, ['nombre', 'name', 'titulo'], 'Negocio sin nombre'),
      categoria: valueFrom(row, ['categoria', 'tipo_negocio', 'rubro', 'especialidad'], 'Belleza'),
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
        max: precios.length ? Math.max(...precios) : numberFrom(row, ['precio_max', 'precio_hasta'], 0)
      },
      estrellas,
      totalValoraciones,
      totalResenas: totalValoraciones,
      enRanking,
      portadaUrl: coverUrl,
      logoUrl,
      reservaUrl,
      fotos: fotos.length ? fotos : [logoUrl],
      whatsapp: telefono ? String(telefono).replace(/[^\d+]/g, '') : '',
      descripcion: valueFrom(row, ['descripcion', 'description', 'mensaje_bienvenida'], ''),
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
      const rows = await optionalSupabaseFetch(
        'reservas?valoracion_servicio=not.is.null&select=negocio_id,valoracion_servicio&limit=10000'
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

    loadPromise = (async () => {
      const config = getSupabaseConfig();
      if (!config) {
        businesses = [];
        loadError = 'Falta configurar SUPABASE_URL y SUPABASE_ANON_KEY.';
        throw new Error(loadError);
      }

      try {
        const [rows, ratingData] = await Promise.all([
          supabaseFetch('negocios?configurado=eq.true&suscripciones.estado=eq.activa&select=id,nombre,telefono,especialidad,slug,logo_url,imagen_fondo_url,mensaje_bienvenida,instagram,facebook,sitio_web,direccion,horario_atencion,configurado,plan,provincia,municipio,suscripciones!inner(estado)&order=nombre.asc'),
          fetchVerifiedRatings()
        ]);

        totalReservasHoy = await optionalSupabaseCount('reservas?created_at=gte.' + encodeURIComponent(getTodayStartIso()) + '&select=id');
        const serviciosRows = await optionalSupabaseFetch('servicios?activo=eq.true&select=id,negocio_id,nombre,duracion,precio,descripcion,activo,imagen,categoria&order=nombre.asc&limit=5000');
        const reservasSemanaRows = await optionalSupabaseFetch('reservas?created_at=gte.' + encodeURIComponent(getWeekStartIso()) + '&select=*&limit=5000');
        const productosTiendaRows = tiendaTablesEnabled()
          ? await optionalSupabaseFetch('productos?activo=eq.true&select=id,negocio_id,nombre,descripcion,precio,imagen_url,categoria,stock,activo,destacado,orden&order=destacado.desc,orden.asc,nombre.asc&limit=5000')
          : [];
        const cursosTiendaRows = tiendaTablesEnabled()
          ? await optionalSupabaseFetch('cursos?activo=eq.true&select=id,negocio_id,nombre,descripcion,precio,imagen_url,categoria,fecha,ubicacion,duracion,cupos,activo,destacado,orden&order=destacado.desc,orden.asc,fecha.asc,nombre.asc&limit=5000')
          : [];
        const tiendasIds = new Set([...businessIdSet(productosTiendaRows), ...businessIdSet(cursosTiendaRows)]);
        const reservasSemanaPorNegocio = countWeeklyReservations(reservasSemanaRows);

        const relations = {
          servicios: groupByBusiness(serviciosRows),
          productos: groupByBusiness(productosTiendaRows),
          cursos: groupByBusiness(cursosTiendaRows),
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
        loadedFromSupabase = true;
        loadError = null;
        console.log(`RomaHub cargo ${businesses.length} negocios desde Supabase (${Object.keys(ratingData).length} con valoraciones verificadas)`);
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
    const [rows, ratingData] = await Promise.all([
      optionalSupabaseFetch(`negocios?id=eq.${encodedId}&configurado=eq.true&suscripciones.estado=eq.activa&select=id,nombre,telefono,especialidad,slug,logo_url,imagen_fondo_url,mensaje_bienvenida,instagram,facebook,sitio_web,direccion,horario_atencion,configurado,plan,provincia,municipio,suscripciones!inner(estado)`),
      fetchVerifiedRatings()
    ]);
    const row = rows?.[0] || current || { id: negocioId };
    if (!rows?.[0] && !current) return null;
    const serviciosRows = await optionalSupabaseFetch(`servicios?activo=eq.true&negocio_id=eq.${encodedId}&select=id,negocio_id,nombre,duracion,precio,descripcion,activo,imagen,categoria&order=nombre.asc`);
    const resenasRows = await optionalSupabaseFetch(`resenas?negocio_id=eq.${encodedId}&select=*&order=fecha.desc&limit=50`);
    const productosRows = tiendaTablesEnabled()
      ? await optionalSupabaseFetch(`productos?activo=eq.true&negocio_id=eq.${encodedId}&select=id,negocio_id,nombre,descripcion,precio,imagen_url,categoria,stock,activo,destacado,orden&order=destacado.desc,orden.asc,nombre.asc&limit=200`)
      : [];
    const cursosRows = tiendaTablesEnabled()
      ? await optionalSupabaseFetch(`cursos?activo=eq.true&negocio_id=eq.${encodedId}&select=id,negocio_id,nombre,descripcion,precio,imagen_url,categoria,fecha,ubicacion,duracion,cupos,activo,destacado,orden&order=destacado.desc,orden.asc,fecha.asc,nombre.asc&limit=200`)
      : [];

    const detailed = normalizeBusiness(row, {
      servicios: groupByBusiness(serviciosRows),
      productos: groupByBusiness(productosRows),
      cursos: groupByBusiness(cursosRows),
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

  function listBusinesses() {
    return businesses.slice();
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
      .filter((b) => b.enRanking)
      .sort((a, b) => (b.estrellas - a.estrellas) || (b.totalValoraciones - a.totalValoraciones))
      .slice(0, 12);
  }

  function listWeeklyFeatured() {
    return businesses
      .slice()
      .sort((a, b) => (b.reservasSemana || 0) - (a.reservasSemana || 0) || a.nombre.localeCompare(b.nombre))
      .slice(0, 10);
  }

  function listRomaStores() {
    return businesses
      .filter((business) => business.tieneTienda)
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .slice(0, 12);
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

  function searchBusinesses(query) {
    const q = query || { servicio: '', ubicacion: '' };
    const servicio = normalizeText(q.servicio);
    const ubicacion = normalizeText(q.ubicacion);

    return businesses.filter((b) => {
      const catalogTerms = (b.categoriasCatalogo || [])
        .flatMap((section) => [
          section.titulo,
          section.tipo,
          ...(section.items || []).flatMap((item) => [item.nombre, item.descripcion, item.categoria])
        ])
        .filter(Boolean);

      const hayServicio = !servicio
        ? true
        : [b.nombre, b.categoria, b.descripcion, ...catalogTerms]
          .filter(Boolean)
          .some((t) => normalizeText(t).includes(servicio));

      const hayUbicacion = !ubicacion
        ? true
        : [b.ubicacion?.provincia, b.ubicacion?.ciudad, b.ubicacion?.zona, b.ubicacion?.direccion]
          .filter(Boolean)
          .some((t) => normalizeText(t).includes(ubicacion));

      return hayServicio && hayUbicacion;
    });
  }

  return { listBusinesses, listTopRated, listWeeklyFeatured, listRomaStores, listRomaReviews, searchBusinesses, getBusinessById, loadBusinesses, loadBusinessDetails, getLoadError, getTodayReservations, addReview, addOrder };
})();
