const MockData = (() => {
  const fallbackBusinesses = [
    {
      id: 'roma-001',
      nombre: 'Gordis Nails Boutique',
      categoria: 'Uñas Acrílicas',
      vip: true,
      verificado: true,
      topRoma: true,
      masReservado: false,
      negocioDelMes: true,
      ubicacion: { ciudad: 'La Habana', zona: 'Vedado', direccion: 'Calle 23, Vedado, Plaza' },
      coordenadas: { lat: 23.1291, lng: -82.3790 },
      rangoPrecio: { min: 800, max: 3500 },
      estrellas: 4.9,
      totalResenas: 212,
      portadaUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1520975958221-17f0d4a12a4a?auto=format&fit=crop&w=256&q=80',
      fotos: [
        'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1610992015732-2449b0b2b8f5?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1605034313761-73ea4a8f35a1?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1605034313761-73ea4a8f35a1?auto=format&fit=crop&w=1200&q=70'
      ],
      whatsapp: '+5355550101',
      descripcion: 'Boutique minimalista de uñas, diseño premium y protocolos higiénicos.',
      categoriasCatalogo: [
        {
          tipo: 'servicios',
          titulo: 'Manos',
          items: [
            { nombre: 'Uñas acrílicas + diseño natural', duracionMin: 90, precio: 1800, destacado: true },
            { nombre: 'Relleno acrílico', duracionMin: 60, precio: 1400 },
            { nombre: 'Esmaltado semipermanente', duracionMin: 45, precio: 900 }
          ]
        },
        {
          tipo: 'servicios',
          titulo: 'Pies',
          items: [
            { nombre: 'Pedicura spa', duracionMin: 55, precio: 1200 },
            { nombre: 'Reconstrucción de uña', duracionMin: 30, precio: 650 }
          ]
        },
        {
          tipo: 'productos',
          titulo: 'Productos',
          items: [
            { nombre: 'Aceite de cutícula (15 ml)', stock: 12, precio: 350 },
            { nombre: 'Crema de manos premium', stock: 6, precio: 500 }
          ]
        },
        {
          tipo: 'cursos',
          titulo: 'Cursos y Talleres',
          items: [
            { nombre: 'Taller: diseño minimalista', fecha: '2026-05-04T10:00:00.000Z', ubicacion: 'Vedado, La Habana', precio: 4500 },
            { nombre: 'Curso completo: acrílico desde cero', fecha: '2026-05-18T09:30:00.000Z', ubicacion: 'Vedado, La Habana', precio: 12000 }
          ]
        }
      ],
      resenas: [
        { id: 'r1', nombre: 'Camila', estrellas: 5, verificada: true, texto: 'Atención impecable y un acabado super fino. Se nota el nivel.', fecha: '2026-03-22' },
        { id: 'r2', nombre: 'Dayana', estrellas: 5, verificada: true, texto: 'Higiene top y diseño minimalista tal cual lo quería.', fecha: '2026-03-10' },
        { id: 'r3', nombre: 'Roxana', estrellas: 4, verificada: false, texto: 'Muy buen servicio, solo esperé un poquito, pero valió la pena.', fecha: '2026-02-18' }
      ]
    },
    {
      id: 'roma-002',
      nombre: 'Barbería Malecón',
      categoria: 'Barbería',
      vip: false,
      verificado: true,
      topRoma: false,
      masReservado: true,
      negocioDelMes: false,
      ubicacion: { ciudad: 'La Habana', zona: 'Centro Habana', direccion: 'San Lázaro, Centro Habana' },
      coordenadas: { lat: 23.1375, lng: -82.3701 },
      rangoPrecio: { min: 350, max: 1500 },
      estrellas: 4.7,
      totalResenas: 154,
      portadaUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1600&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1520975732134-340aee8f36d4?auto=format&fit=crop&w=256&q=80',
      fotos: [
        'https://images.unsplash.com/photo-1520975911267-56c7b0199c4f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1520975682030-1a7d1b93e2a3?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=900&q=80'
      ],
      whatsapp: '+5355550202',
      descripcion: 'Cortes clásicos y modernos, ritual de barba y ambiente limpio frente al mar.',
      categoriasCatalogo: [
        {
          tipo: 'servicios',
          titulo: 'Cortes',
          items: [
            { nombre: 'Corte clásico', duracionMin: 35, precio: 500, destacado: true },
            { nombre: 'Fade premium', duracionMin: 45, precio: 700 }
          ]
        },
        {
          tipo: 'servicios',
          titulo: 'Barba',
          items: [
            { nombre: 'Ritual de barba', duracionMin: 30, precio: 600 },
            { nombre: 'Perfilado', duracionMin: 20, precio: 350 }
          ]
        }
      ],
      resenas: [
        { id: 'r4', nombre: 'Ernesto', estrellas: 5, verificada: true, texto: 'Profesionales, rápidos y con un estilo bien moderno.', fecha: '2026-03-05' },
        { id: 'r5', nombre: 'Luis', estrellas: 4, verificada: true, texto: 'Buen trato. El fade quedó perfecto.', fecha: '2026-02-14' }
      ]
    },
    {
      id: 'roma-003',
      nombre: 'Roma Skin Studio',
      categoria: 'Estética Facial',
      vip: true,
      verificado: true,
      topRoma: false,
      masReservado: true,
      negocioDelMes: false,
      ubicacion: { ciudad: 'La Habana', zona: 'Miramar', direccion: '5ta Avenida, Playa' },
      coordenadas: { lat: 23.1100, lng: -82.4370 },
      rangoPrecio: { min: 1200, max: 7500 },
      estrellas: 4.8,
      totalResenas: 98,
      portadaUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1600&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=256&q=60',
      fotos: [
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1556228579-0d85b1a4d571?auto=format&fit=crop&w=900&q=70'
      ],
      whatsapp: '+5355550303',
      descripcion: 'Piel luminosa con protocolos clínicos y un espacio ultra-limpio.',
      categoriasCatalogo: [
        {
          tipo: 'servicios',
          titulo: 'Facial',
          items: [
            { nombre: 'Limpieza profunda + hidratación', duracionMin: 70, precio: 2500, destacado: true },
            { nombre: 'Peeling suave', duracionMin: 45, precio: 1800 }
          ]
        },
        {
          tipo: 'productos',
          titulo: 'Productos',
          items: [
            { nombre: 'Sérum iluminador', stock: 4, precio: 3200 },
            { nombre: 'Protector solar premium', stock: 9, precio: 2100 }
          ]
        }
      ],
      resenas: [
        { id: 'r6', nombre: 'Melany', estrellas: 5, verificada: true, texto: 'Me dejó la piel increíble y el espacio es súper limpio.', fecha: '2026-03-29' },
        { id: 'r7', nombre: 'Ana', estrellas: 4, verificada: false, texto: 'Muy buena atención, me gustó el protocolo paso a paso.', fecha: '2026-03-12' }
      ]
    },
    {
      id: 'roma-004',
      nombre: 'Academia Roma Pro',
      categoria: 'Cursos y Talleres',
      vip: false,
      verificado: false,
      topRoma: false,
      masReservado: false,
      negocioDelMes: false,
      ubicacion: { ciudad: 'La Habana', zona: 'Habana Vieja', direccion: 'Obispo, Habana Vieja' },
      coordenadas: { lat: 23.1400, lng: -82.3500 },
      rangoPrecio: { min: 3000, max: 15000 },
      estrellas: 4.5,
      totalResenas: 41,
      portadaUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=256&q=60',
      fotos: [
        'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1584697964192-5f5f5b1cdb4b?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=70'
      ],
      whatsapp: '+5355550404',
      descripcion: 'Talleres para elevar tu técnica y convertir tu talento en un negocio.',
      categoriasCatalogo: [
        {
          tipo: 'cursos',
          titulo: 'Cursos y Talleres',
          items: [
            { nombre: 'Taller: barbería moderna', fecha: '2026-06-06T10:00:00.000Z', ubicacion: 'Habana Vieja', precio: 6000 },
            { nombre: 'Curso: manicure profesional', fecha: '2026-06-20T09:00:00.000Z', ubicacion: 'Habana Vieja', precio: 11000 }
          ]
        }
      ],
      resenas: [
        { id: 'r8', nombre: 'Yusniel', estrellas: 5, verificada: false, texto: 'Muy buena explicación y práctica real.', fecha: '2026-01-23' }
      ]
    }
  ];

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

  async function loadOptionalBusinessProvinces() {
    const rows = await optionalSupabaseFetch('negocios?select=id,provincia&limit=1000');
    return (rows || []).reduce((acc, row) => {
      if (row.id && row.provincia) acc[row.id] = row.provincia;
      return acc;
    }, {});
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

  function countTodayReservations(rows) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const startTime = todayStart.getTime();
    return (rows || []).reduce((acc, row) => {
      const dateValue = getReservationCreatedAt(row);
      const time = dateValue ? new Date(dateValue).getTime() : NaN;
      if (!Number.isFinite(time) || time < startTime || !isActiveReservation(row)) return acc;
      return acc + 1;
    }, 0);
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

  function normalizeBusiness(row, relations) {
    const id = String(row.id || row.negocio_id || row.uuid || '');
    const provincia = valueFrom(row, ['provincia', 'province'], 'La Habana');
    const ciudad = valueFrom(row, ['ciudad', 'municipio', 'city'], provincia);
    const zona = valueFrom(row, ['zona', 'barrio', 'municipio'], ciudad);
    const direccion = valueFrom(row, ['direccion', 'ubicacion', 'address'], zona);
    const lat = numberFrom(row, ['lat', 'latitud', 'latitude'], 23.1136);
    const lng = numberFrom(row, ['lng', 'longitud', 'lon', 'longitude'], -82.3666);
    const telefono = valueFrom(row, ['whatsapp', 'telefono', 'phone'], '');
    const coverUrl = valueFrom(row, ['imagen_fondo_url', 'portada_url', 'cover_url', 'foto_portada', 'imagen_url'], '');
    const logoUrl = valueFrom(row, ['logo_url', 'logo', 'avatar_url'], defaultLogoUrl);
    const reservaUrl = normalizeExternalUrl(valueFrom(row, ['reserva_url', 'booking_url', 'url_reserva', 'url_negocio', 'negocio_url', 'sitio_web', 'url', 'link'], ''));
    const fotos = [coverUrl, logoUrl].filter(Boolean);

    const servicios = relations.servicios[id] || [];
    const productos = relations.productos[id] || [];
    const cursos = relations.cursos[id] || [];
    const resenas = relations.resenas[id] || [];

    const precios = [...servicios, ...productos, ...cursos]
      .map((item) => numberFrom(item, ['precio', 'precio_cup', 'monto'], null))
      .filter((value) => value != null && Number.isFinite(value) && value > 0);

    return {
      id,
      nombre: valueFrom(row, ['nombre', 'name', 'titulo'], 'Negocio sin nombre'),
      categoria: valueFrom(row, ['categoria', 'tipo_negocio', 'rubro', 'especialidad'], 'Belleza'),
      vip: boolFrom(row, ['vip', 'es_vip', 'premium'], false),
      verificado: boolFrom(row, ['verificado', 'verificada', 'configurado'], false),
      topRoma: boolFrom(row, ['top_roma', 'topRoma', 'destacado'], false),
      masReservado: boolFrom(row, ['mas_reservado', 'masReservado'], false),
      negocioDelMes: boolFrom(row, ['negocio_del_mes', 'negocioDelMes'], false),
      ubicacion: { provincia, ciudad, zona, direccion },
      coordenadas: { lat, lng },
      rangoPrecio: {
        min: precios.length ? Math.min(...precios) : numberFrom(row, ['precio_min', 'precio_desde'], 0),
        max: precios.length ? Math.max(...precios) : numberFrom(row, ['precio_max', 'precio_hasta'], 0)
      },
      estrellas: numberFrom(row, ['estrellas', 'rating', 'calificacion'], resenas.length ? 4.8 : 0),
      totalResenas: numberFrom(row, ['total_resenas', 'totalResenas', 'reviews_count'], resenas.length),
      portadaUrl: coverUrl,
      logoUrl,
      reservaUrl,
      fotos: fotos.length ? fotos : [logoUrl],
      whatsapp: telefono ? String(telefono).replace(/[^\d+]/g, '') : '',
      descripcion: valueFrom(row, ['descripcion', 'description', 'mensaje_bienvenida'], 'Negocio disponible para reseñas.'),
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
        const rows = await supabaseFetch('negocios?configurado=eq.true&suscripciones.estado=eq.activa&select=id,nombre,telefono,especialidad,slug,logo_url,imagen_fondo_url,mensaje_bienvenida,instagram,facebook,sitio_web,direccion,horario_atencion,configurado,plan,suscripciones!inner(estado)&order=nombre.asc');
        const serviciosRows = await supabaseFetch('servicios?activo=eq.true&select=id,negocio_id,nombre,duracion,precio,descripcion,activo,imagen,categoria');
        const provincias = await loadOptionalBusinessProvinces();
        const resenasRows = await optionalSupabaseFetch('resenas?select=*&limit=500');
        const productosRows = await optionalSupabaseFetch('productos?activo=eq.true&select=id,negocio_id,nombre,descripcion,precio,imagen,categoria,stock,activo&limit=1000');
        const cursosRows = await optionalSupabaseFetch('cursos?activo=eq.true&select=id,negocio_id,nombre,descripcion,precio,imagen,fecha,ubicacion,activo&limit=1000');
        const reservasRows = await optionalSupabaseFetch('reservas?select=*&limit=2000');
        const reservasSemana = countWeeklyReservations(reservasRows);
        totalReservasHoy = countTodayReservations(reservasRows);

        const relations = {
          servicios: groupByBusiness(serviciosRows),
          productos: groupByBusiness(productosRows),
          cursos: groupByBusiness(cursosRows),
          resenas: groupByBusiness(resenasRows)
        };

        businesses = (rows || [])
          .map((row) => {
            const business = normalizeBusiness({ ...row, provincia: provincias[row.id] || row.provincia }, relations);
            business.reservasSemana = reservasSemana[business.id] || 0;
            return business;
          })
          .filter((business) => business.id);
        loadedFromSupabase = true;
        loadError = null;
        console.log(`Marketplace cargó ${businesses.length} negocios desde Supabase`);
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
      .filter((b) => (b.totalResenas || b.totalResenas || 0) > 0)
      .sort((a, b) => (b.estrellas - a.estrellas) || ((b.totalResenas || b.totalResenas || 0) - (a.totalResenas || a.totalResenas || 0)))
      .slice(0, 8);
  }

  function listWeeklyFeatured() {
    const gordis = (business) => normalizeText(business.nombre).includes('gordis');
    return businesses
      .slice()
      .sort((a, b) => {
        if (gordis(a) && !gordis(b)) return -1;
        if (!gordis(a) && gordis(b)) return 1;
        return (b.reservasSemana || 0) - (a.reservasSemana || 0) || a.nombre.localeCompare(b.nombre);
      })
      .slice(0, 10);
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
      throw new Error('No se pudo guardar la reseña porque Supabase no tiene disponible la tabla pública reseñas para insertar.');
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
      business.totalResenas = business.resenas.length;
      business.estrellas = business.resenas.reduce((sum, item) => sum + Number(item.estrellas || 0), 0) / business.resenas.length;
    }
    return created;
  }

  function getBusinessById(id) {
    const found = businesses.find((b) => b.id === id);
    return found || null;
  }

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
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

  return { listBusinesses, listTopRated, listWeeklyFeatured, listRomaReviews, searchBusinesses, getBusinessById, loadBusinesses, getLoadError, getTodayReservations, addReview };
})();




