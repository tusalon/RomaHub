const Navigation = (() => {
  function getCurrentPage() {
    try {
      const path = window.location.pathname || '';
      const file = path.split('/').pop() || 'index.html';
      return file === '' ? 'index.html' : file;
    } catch (error) {
      console.error('Navigation.getCurrentPage error:', error);
      return 'index.html';
    }
  }
  function getSearchParams() {
    try {
      const url = new URL(window.location.href);
      const servicio = (url.searchParams.get('servicio') || '').trim();
      const ubicacion = (url.searchParams.get('ubicacion') || '').trim();
      return {
        servicio,
        ubicacion
      };
    } catch (error) {
      console.error('Navigation.getSearchParams error:', error);
      return {
        servicio: '',
        ubicacion: ''
      };
    }
  }
  function goToSearch(servicio, ubicacion) {
    try {
      const s = (servicio || '').trim();
      const u = (ubicacion || '').trim();
      const params = new URLSearchParams();
      if (s) params.set('servicio', s);
      if (u) params.set('ubicacion', u);
      window.location.href = `search.html?${params.toString()}`;
    } catch (error) {
      console.error('Navigation.goToSearch error:', error);
    }
  }
  function goHome(sectionId) {
    try {
      if (!sectionId) {
        window.location.href = 'index.html';
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        window.location.href = `index.html#${sectionId}`;
      }
    } catch (error) {
      console.error('Navigation.goHome error:', error);
    }
  }
  function goToBusiness(businessId) {
    try {
      const id = encodeURIComponent(businessId);
      window.location.href = `business.html?id=${id}`;
    } catch (error) {
      console.error('Navigation.goToBusiness error:', error);
    }
  }
  return {
    getCurrentPage,
    getSearchParams,
    goToSearch,
    goHome,
    goToBusiness
  };
})();
const Format = (() => {
  function formatPrecioCUP(value) {
    try {
      const n = Number(value);
      if (Number.isNaN(n)) return '—';
      return `${Math.round(n).toLocaleString('es-ES')} CUP`;
    } catch (error) {
      console.error('Format.formatPrecioCUP error:', error);
      return '—';
    }
  }
  function formatRangoPrecio(min, max) {
    try {
      if (min == null && max == null) return '—';
      if (min != null && max != null) return `${Format.formatPrecioCUP(min)} – ${Format.formatPrecioCUP(max)}`;
      return min != null ? Format.formatPrecioCUP(min) : Format.formatPrecioCUP(max);
    } catch (error) {
      console.error('Format.formatRangoPrecio error:', error);
      return '—';
    }
  }
  function clampText(text, max) {
    try {
      const t = String(text || '');
      if (t.length <= max) return t;
      return `${t.slice(0, max - 1)}…`;
    } catch (error) {
      console.error('Format.clampText error:', error);
      return '';
    }
  }
  return {
    formatPrecioCUP,
    formatRangoPrecio,
    clampText
  };
})();
const MockData = (() => {
  const fallbackBusinesses = [{
    id: 'roma-001',
    nombre: 'Gordis Nails Boutique',
    categoria: 'Uñas Acrílicas',
    vip: true,
    verificado: true,
    topRoma: true,
    masReservado: false,
    negocioDelMes: true,
    ubicacion: {
      ciudad: 'La Habana',
      zona: 'Vedado',
      direccion: 'Calle 23, Vedado, Plaza'
    },
    coordenadas: {
      lat: 23.1291,
      lng: -82.3790
    },
    rangoPrecio: {
      min: 800,
      max: 3500
    },
    estrellas: 4.9,
    totalReseñas: 212,
    portadaUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1520975958221-17f0d4a12a4a?auto=format&fit=crop&w=256&q=80',
    fotos: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1610992015732-2449b0b2b8f5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1605034313761-73ea4a8f35a1?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1605034313761-73ea4a8f35a1?auto=format&fit=crop&w=1200&q=70'],
    whatsapp: '+5355550101',
    descripcion: 'Boutique minimalista de uñas, diseño premium y protocolos higiénicos.',
    categoriasCatalogo: [{
      tipo: 'servicios',
      titulo: 'Manos',
      items: [{
        nombre: 'Uñas acrílicas + diseño natural',
        duracionMin: 90,
        precio: 1800,
        destacado: true
      }, {
        nombre: 'Relleno acrílico',
        duracionMin: 60,
        precio: 1400
      }, {
        nombre: 'Esmaltado semipermanente',
        duracionMin: 45,
        precio: 900
      }]
    }, {
      tipo: 'servicios',
      titulo: 'Pies',
      items: [{
        nombre: 'Pedicura spa',
        duracionMin: 55,
        precio: 1200
      }, {
        nombre: 'Reconstrucción de uña',
        duracionMin: 30,
        precio: 650
      }]
    }, {
      tipo: 'productos',
      titulo: 'Productos',
      items: [{
        nombre: 'Aceite de cutícula (15 ml)',
        stock: 12,
        precio: 350
      }, {
        nombre: 'Crema de manos premium',
        stock: 6,
        precio: 500
      }]
    }, {
      tipo: 'cursos',
      titulo: 'Cursos y Talleres',
      items: [{
        nombre: 'Taller: diseño minimalista',
        fecha: '2026-05-04T10:00:00.000Z',
        ubicacion: 'Vedado, La Habana',
        precio: 4500
      }, {
        nombre: 'Curso completo: acrílico desde cero',
        fecha: '2026-05-18T09:30:00.000Z',
        ubicacion: 'Vedado, La Habana',
        precio: 12000
      }]
    }],
    reseñas: [{
      id: 'r1',
      nombre: 'Camila',
      estrellas: 5,
      verificada: true,
      texto: 'Atención impecable y un acabado súper fino. Se nota el nivel.',
      fecha: '2026-03-22'
    }, {
      id: 'r2',
      nombre: 'Dayana',
      estrellas: 5,
      verificada: true,
      texto: 'Higiene top y diseño minimalista tal cual lo quería.',
      fecha: '2026-03-10'
    }, {
      id: 'r3',
      nombre: 'Roxana',
      estrellas: 4,
      verificada: false,
      texto: 'Muy buen servicio, solo esperé un poquito, pero valió la pena.',
      fecha: '2026-02-18'
    }]
  }, {
    id: 'roma-002',
    nombre: 'Barbería Malecón',
    categoria: 'Barbería',
    vip: false,
    verificado: true,
    topRoma: false,
    masReservado: true,
    negocioDelMes: false,
    ubicacion: {
      ciudad: 'La Habana',
      zona: 'Centro Habana',
      direccion: 'San Lázaro, Centro Habana'
    },
    coordenadas: {
      lat: 23.1375,
      lng: -82.3701
    },
    rangoPrecio: {
      min: 350,
      max: 1500
    },
    estrellas: 4.7,
    totalReseñas: 154,
    portadaUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1600&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1520975732134-340aee8f36d4?auto=format&fit=crop&w=256&q=80',
    fotos: ['https://images.unsplash.com/photo-1520975911267-56c7b0199c4f?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1520975682030-1a7d1b93e2a3?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=900&q=80'],
    whatsapp: '+5355550202',
    descripcion: 'Cortes clásicos y modernos, ritual de barba y ambiente limpio frente al mar.',
    categoriasCatalogo: [{
      tipo: 'servicios',
      titulo: 'Cortes',
      items: [{
        nombre: 'Corte clásico',
        duracionMin: 35,
        precio: 500,
        destacado: true
      }, {
        nombre: 'Fade premium',
        duracionMin: 45,
        precio: 700
      }]
    }, {
      tipo: 'servicios',
      titulo: 'Barba',
      items: [{
        nombre: 'Ritual de barba',
        duracionMin: 30,
        precio: 600
      }, {
        nombre: 'Perfilado',
        duracionMin: 20,
        precio: 350
      }]
    }],
    reseñas: [{
      id: 'r4',
      nombre: 'Ernesto',
      estrellas: 5,
      verificada: true,
      texto: 'Profesionales, rápidos y con un estilo bien moderno.',
      fecha: '2026-03-05'
    }, {
      id: 'r5',
      nombre: 'Luis',
      estrellas: 4,
      verificada: true,
      texto: 'Buen trato. El fade quedó perfecto.',
      fecha: '2026-02-14'
    }]
  }, {
    id: 'roma-003',
    nombre: 'Roma Skin Studio',
    categoria: 'Estética Facial',
    vip: true,
    verificado: true,
    topRoma: false,
    masReservado: true,
    negocioDelMes: false,
    ubicacion: {
      ciudad: 'La Habana',
      zona: 'Miramar',
      direccion: '5ta Avenida, Playa'
    },
    coordenadas: {
      lat: 23.1100,
      lng: -82.4370
    },
    rangoPrecio: {
      min: 1200,
      max: 7500
    },
    estrellas: 4.8,
    totalReseñas: 98,
    portadaUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1600&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=256&q=60',
    fotos: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1556228579-0d85b1a4d571?auto=format&fit=crop&w=900&q=70'],
    whatsapp: '+5355550303',
    descripcion: 'Piel luminosa con protocolos clínicos y un espacio ultra-limpio.',
    categoriasCatalogo: [{
      tipo: 'servicios',
      titulo: 'Facial',
      items: [{
        nombre: 'Limpieza profunda + hidratación',
        duracionMin: 70,
        precio: 2500,
        destacado: true
      }, {
        nombre: 'Peeling suave',
        duracionMin: 45,
        precio: 1800
      }]
    }, {
      tipo: 'productos',
      titulo: 'Productos',
      items: [{
        nombre: 'Sérum iluminador',
        stock: 4,
        precio: 3200
      }, {
        nombre: 'Protector solar premium',
        stock: 9,
        precio: 2100
      }]
    }],
    reseñas: [{
      id: 'r6',
      nombre: 'Melany',
      estrellas: 5,
      verificada: true,
      texto: 'Me dejó la piel increíble y el espacio es súper limpio.',
      fecha: '2026-03-29'
    }, {
      id: 'r7',
      nombre: 'Ana',
      estrellas: 4,
      verificada: false,
      texto: 'Muy buena atención, me gustó el protocolo paso a paso.',
      fecha: '2026-03-12'
    }]
  }, {
    id: 'roma-004',
    nombre: 'Academia Roma Pro',
    categoria: 'Cursos y Talleres',
    vip: false,
    verificado: false,
    topRoma: false,
    masReservado: false,
    negocioDelMes: false,
    ubicacion: {
      ciudad: 'La Habana',
      zona: 'Habana Vieja',
      direccion: 'Obispo, Habana Vieja'
    },
    coordenadas: {
      lat: 23.1400,
      lng: -82.3500
    },
    rangoPrecio: {
      min: 3000,
      max: 15000
    },
    estrellas: 4.5,
    totalReseñas: 41,
    portadaUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=256&q=60',
    fotos: ['https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1584697964192-5f5f5b1cdb4b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=70'],
    whatsapp: '+5355550404',
    descripcion: 'Talleres para elevar tu técnica y convertir tu talento en un negocio.',
    categoriasCatalogo: [{
      tipo: 'cursos',
      titulo: 'Cursos y Talleres',
      items: [{
        nombre: 'Taller: barbería moderna',
        fecha: '2026-06-06T10:00:00.000Z',
        ubicacion: 'Habana Vieja',
        precio: 6000
      }, {
        nombre: 'Curso: manicure profesional',
        fecha: '2026-06-20T09:00:00.000Z',
        ubicacion: 'Habana Vieja',
        precio: 11000
      }]
    }],
    reseñas: [{
      id: 'r8',
      nombre: 'Yusniel',
      estrellas: 5,
      verificada: false,
      texto: 'Muy buena explicación y práctica real.',
      fecha: '2026-01-23'
    }]
  }];
  let businesses = [];
  let loadPromise = null;
  let loadedFromSupabase = false;
  let loadError = null;
  const defaultCoverUrl = '';
  const defaultLogoUrl = '';
  function getSupabaseConfig() {
    const url = window.SUPABASE_URL || window.supabaseUrl || '';
    const key = window.SUPABASE_ANON_KEY || window.supabaseAnonKey || '';
    if (!url || !key) return null;
    return {
      url: String(url).replace(/\/$/, ''),
      key
    };
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
  function countWeeklyReservations(rows) {
    const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return (rows || []).reduce((acc, row) => {
      const id = row.negocio_id || row.negocioId || row.business_id;
      if (!id) return acc;
      const dateValue = row.fecha || row.created_at || row.fecha_reserva || row.inicio;
      const time = dateValue ? new Date(dateValue).getTime() : Date.now();
      if (!Number.isFinite(time) || time < since) return acc;
      const estado = normalizeText(row.estado || row.status || '');
      if (estado.includes('cancel')) return acc;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
  }
  function buildCatalogSections({
    servicios,
    productos,
    cursos
  }) {
    const sections = [];
    if (servicios?.length) {
      sections.push({
        tipo: 'servicios',
        titulo: 'Servicios',
        items: servicios.map(item => ({
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
        items: productos.map(item => ({
          nombre: valueFrom(item, ['nombre', 'titulo', 'producto'], 'Producto'),
          stock: numberFrom(item, ['stock', 'cantidad'], 0),
          precio: numberFrom(item, ['precio', 'precio_cup', 'monto'], 0)
        }))
      });
    }
    if (cursos?.length) {
      sections.push({
        tipo: 'cursos',
        titulo: 'Cursos y Talleres',
        items: cursos.map(item => ({
          nombre: valueFrom(item, ['nombre', 'titulo', 'curso'], 'Curso'),
          fecha: valueFrom(item, ['fecha', 'fecha_inicio', 'created_at'], new Date().toISOString()),
          ubicacion: valueFrom(item, ['ubicacion', 'direccion', 'lugar'], ''),
          precio: numberFrom(item, ['precio', 'precio_cup', 'monto'], 0)
        }))
      });
    }
    return sections;
  }
  function normalizeBusiness(row, relations) {
    const id = String(row.id || row.negocio_id || row.uuid || '');
    const ciudad = valueFrom(row, ['ciudad', 'municipio', 'provincia'], 'La Habana');
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
    const precios = [...servicios, ...productos, ...cursos].map(item => numberFrom(item, ['precio', 'precio_cup', 'monto'], null)).filter(value => value != null && Number.isFinite(value) && value > 0);
    return {
      id,
      nombre: valueFrom(row, ['nombre', 'name', 'titulo'], 'Negocio sin nombre'),
      categoria: valueFrom(row, ['categoria', 'tipo_negocio', 'rubro', 'especialidad'], 'Belleza'),
      vip: boolFrom(row, ['vip', 'es_vip', 'premium'], false),
      verificado: boolFrom(row, ['verificado', 'verificada', 'configurado'], false),
      topRoma: boolFrom(row, ['top_roma', 'topRoma', 'destacado'], false),
      masReservado: boolFrom(row, ['mas_reservado', 'masReservado'], false),
      negocioDelMes: boolFrom(row, ['negocio_del_mes', 'negocioDelMes'], false),
      ubicacion: {
        ciudad,
        zona,
        direccion
      },
      coordenadas: {
        lat,
        lng
      },
      rangoPrecio: {
        min: precios.length ? Math.min(...precios) : numberFrom(row, ['precio_min', 'precio_desde'], 0),
        max: precios.length ? Math.max(...precios) : numberFrom(row, ['precio_max', 'precio_hasta'], 0)
      },
      estrellas: numberFrom(row, ['estrellas', 'rating', 'calificacion'], resenas.length ? 4.8 : 0),
      totalReseñas: numberFrom(row, ['total_resenas', 'totalResenas', 'reviews_count'], resenas.length),
      portadaUrl: coverUrl,
      logoUrl,
      reservaUrl,
      fotos: fotos.length ? fotos : [logoUrl],
      whatsapp: telefono ? String(telefono).replace(/[^\d+]/g, '') : '',
      descripcion: valueFrom(row, ['descripcion', 'description', 'mensaje_bienvenida'], 'Negocio disponible para reservas.'),
      categoriasCatalogo: buildCatalogSections({
        servicios,
        productos,
        cursos
      }),
      reseñas: resenas.map((item, index) => ({
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
        const resenasRows = await optionalSupabaseFetch('resenas?select=*&limit=500');
        const reservasRows = await optionalSupabaseFetch('reservas?select=*&limit=2000');
        const reservasSemana = countWeeklyReservations(reservasRows);
        const relations = {
          servicios: groupByBusiness(serviciosRows),
          productos: {},
          cursos: {},
          resenas: groupByBusiness(resenasRows)
        };
        businesses = (rows || []).map(row => {
          const business = normalizeBusiness(row, relations);
          business.reservasSemana = reservasSemana[business.id] || 0;
          return business;
        }).filter(business => business.id);
        loadedFromSupabase = true;
        loadError = null;
        console.log(`✅ Marketplace cargó ${businesses.length} negocios desde Supabase`);
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
  function listTopRated() {
    return businesses.slice().filter(b => b.totalReseñas > 0).sort((a, b) => b.estrellas - a.estrellas || b.totalReseñas - a.totalReseñas).slice(0, 8);
  }
  function listWeeklyFeatured() {
    const gordis = business => normalizeText(business.nombre).includes('gordis');
    return businesses.slice().sort((a, b) => {
      if (gordis(a) && !gordis(b)) return -1;
      if (!gordis(a) && gordis(b)) return 1;
      return (b.reservasSemana || 0) - (a.reservasSemana || 0) || a.nombre.localeCompare(b.nombre);
    }).slice(0, 10);
  }
  function listRomaReviews() {
    return businesses.flatMap(business => (business.reseñas || []).map(review => ({
      ...review,
      negocioNombre: business.nombre
    }))).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 8);
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
      throw new Error('No se pudo guardar la reseña porque Supabase no tiene disponible la tabla publica resenas para insertar.');
    }
    const created = inserted?.[0] || payload;
    const business = businesses.find(b => b.id === negocioId);
    if (business) {
      const normalized = {
        id: String(created.id || `${negocioId}-${Date.now()}`),
        nombre: created.nombre || payload.nombre,
        estrellas: Number(created.estrellas || payload.estrellas),
        verificada: created.verificada === true,
        texto: created.texto || payload.texto,
        fecha: created.fecha || created.created_at || payload.fecha
      };
      business.reseñas = [normalized, ...(business.reseñas || [])];
      business.totalReseñas = business.reseñas.length;
      business.estrellas = business.reseñas.reduce((sum, item) => sum + Number(item.estrellas || 0), 0) / business.reseñas.length;
    }
    return created;
  }
  function getBusinessById(id) {
    const found = businesses.find(b => b.id === id);
    return found || null;
  }
  function normalizeText(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function searchBusinesses(query) {
    const q = query || {
      servicio: '',
      ubicacion: ''
    };
    const servicio = normalizeText(q.servicio);
    const ubicacion = normalizeText(q.ubicacion);
    return businesses.filter(b => {
      const hayServicio = !servicio ? true : [b.nombre, b.categoria, b.descripcion].filter(Boolean).some(t => normalizeText(t).includes(servicio));
      const hayUbicacion = !ubicacion ? true : [b.ubicacion?.ciudad, b.ubicacion?.zona, b.ubicacion?.direccion].filter(Boolean).some(t => normalizeText(t).includes(ubicacion));
      return hayServicio && hayUbicacion;
    });
  }
  return {
    listBusinesses,
    listTopRated,
    listWeeklyFeatured,
    listRomaReviews,
    searchBusinesses,
    getBusinessById,
    loadBusinesses,
    getLoadError,
    addReview
  };
})();
const ToastContext = React.createContext(null);
function ToastProvider({
  children
}) {
  try {
    const [toasts, setToasts] = React.useState([]);
    const push = React.useCallback(toast => {
      try {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const t = {
          id,
          type: toast?.type || 'info',
          title: toast?.title || 'Listo',
          message: toast?.message || ''
        };
        setToasts(prev => [t, ...prev].slice(0, 3));
        window.setTimeout(() => {
          setToasts(prev => prev.filter(x => x.id !== id));
        }, 3200);
      } catch (error) {
        console.error('ToastProvider.push error:', error);
      }
    }, []);
    const api = React.useMemo(() => ({
      push
    }), [push]);
    return React.createElement(ToastContext.Provider, {
      value: api,
      "data-name": "toast-provider",
      "data-file": "components/ToastProvider.js"
    }, React.createElement("div", {
      "data-name": "toast-provider-inner",
      "data-file": "components/ToastProvider.js"
    }, children, React.createElement("div", {
      className: "fixed top-4 right-4 z-[70] space-y-2 w-[320px] max-w-[calc(100vw-32px)]",
      "data-name": "toast-stack",
      "data-file": "components/ToastProvider.js"
    }, toasts.map(t => React.createElement("div", {
      key: t.id,
      className: "card-rr px-4 py-3",
      "data-name": "toast",
      "data-file": "components/ToastProvider.js"
    }, React.createElement("div", {
      className: "flex items-start gap-3",
      "data-name": "toast-row",
      "data-file": "components/ToastProvider.js"
    }, React.createElement("div", {
      className: "w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--secondary-color)] shrink-0",
      "data-name": "toast-icon-wrap",
      "data-file": "components/ToastProvider.js"
    }, React.createElement("div", {
      className: "icon-info text-xl text-[var(--primary-color)]",
      "data-name": "toast-icon",
      "data-file": "components/ToastProvider.js"
    })), React.createElement("div", {
      className: "min-w-0",
      "data-name": "toast-content",
      "data-file": "components/ToastProvider.js"
    }, React.createElement("p", {
      className: "text-sm font-medium",
      "data-name": "toast-title",
      "data-file": "components/ToastProvider.js"
    }, t.title), t.message ? React.createElement("p", {
      className: "text-xs text-[var(--text-muted)] mt-1 leading-relaxed",
      "data-name": "toast-message",
      "data-file": "components/ToastProvider.js"
    }, t.message) : null), React.createElement("button", {
      className: "ml-auto text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors",
      onClick: () => setToasts(prev => prev.filter(x => x.id !== t.id)),
      "data-name": "toast-close",
      "data-file": "components/ToastProvider.js",
      "aria-label": "Cerrar"
    }, React.createElement("div", {
      className: "icon-x text-lg",
      "data-name": "toast-close-icon",
      "data-file": "components/ToastProvider.js"
    }))))))));
  } catch (error) {
    console.error('ToastProvider component error:', error);
    return children || null;
  }
}
function useToast() {
  try {
    const ctx = React.useContext(ToastContext);
    return ctx;
  } catch (error) {
    console.error('useToast error:', error);
    return null;
  }
}
function Header({
  currentParams
}) {
  try {
    const page = Navigation.getCurrentPage();
    const [open, setOpen] = React.useState(false);
    const onGoHome = () => {
      try {
        Navigation.goHome();
      } catch (error) {
        console.error('Header.onGoHome error:', error);
      }
    };
    const onGoSearch = () => {
      try {
        const q = currentParams || Navigation.getSearchParams();
        Navigation.goToSearch(q?.servicio || '', q?.ubicacion || '');
      } catch (error) {
        console.error('Header.onGoSearch error:', error);
      }
    };
    return React.createElement("header", {
      className: "sticky top-0 z-[60] bg-white/95 backdrop-blur border-b border-[var(--border)]",
      "data-name": "header",
      "data-file": "components/Header.js"
    }, React.createElement("div", {
      className: "container-rr py-3",
      "data-name": "header-inner",
      "data-file": "components/Header.js"
    }, React.createElement("div", {
      className: "flex items-center gap-3",
      "data-name": "header-row",
      "data-file": "components/Header.js"
    }, React.createElement("button", {
      className: "flex items-center gap-3",
      onClick: onGoHome,
      "data-name": "brand",
      "data-file": "components/Header.js"
    }, React.createElement("div", {
      className: "w-10 h-10 rounded-lg overflow-hidden border border-[rgba(216,27,96,0.18)] bg-white flex items-center justify-center",
      "data-name": "brand-mark",
      "data-file": "components/Header.js"
    }, React.createElement("img", {
      src: "https://app.trickle.so/storage/public/images/usr_1dec1efb58008001/55d88a3b-fbdf-46a8-bc34-5c6dac55ec46.png",
      alt: "Logo de Rservas.Roma",
      className: "w-full h-full object-cover",
      "data-name": "brand-mark-img",
      "data-file": "components/Header.js"
    })), React.createElement("div", {
      className: "leading-tight",
      "data-name": "brand-text",
      "data-file": "components/Header.js"
    }, React.createElement("p", {
      className: "text-sm font-semibold tracking-tight text-[#1F2937]",
      "data-name": "brand-title",
      "data-file": "components/Header.js"
    }, "Rservas.Roma"), React.createElement("p", {
      className: "text-xs text-[var(--text-muted)]",
      "data-name": "brand-sub",
      "data-file": "components/Header.js"
    }, "Marketplace"))), React.createElement("div", {
      className: "hidden md:flex items-center gap-2 ml-auto",
      "data-name": "header-actions-desktop",
      "data-file": "components/Header.js"
    }, React.createElement("button", {
      className: `btn-rr ${page === 'index.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`,
      onClick: onGoHome,
      "data-name": "nav-home",
      "data-file": "components/Header.js"
    }, "Inicio"), React.createElement("button", {
      className: `btn-rr ${page === 'search.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`,
      onClick: onGoSearch,
      "data-name": "nav-search",
      "data-file": "components/Header.js"
    }, "Explorar"), React.createElement("a", {
      className: "btn-rr btn-ghost-rr",
      href: "search.html",
      "data-name": "nav-demo",
      "data-file": "components/Header.js"
    }, "Negocios")), React.createElement("button", {
      className: "ml-auto md:hidden w-11 h-11 rounded-lg border border-[var(--border)] bg-white flex items-center justify-center",
      onClick: () => setOpen(v => !v),
      "data-name": "nav-toggle",
      "data-file": "components/Header.js",
      "aria-label": "Abrir men\xFA"
    }, React.createElement("div", {
      className: "icon-menu text-xl text-[var(--primary-color)]",
      "data-name": "nav-toggle-icon",
      "data-file": "components/Header.js"
    }))), open ? React.createElement("div", {
      className: "md:hidden pt-3",
      "data-name": "header-mobile",
      "data-file": "components/Header.js"
    }, React.createElement("div", {
      className: "surface-rr p-3",
      "data-name": "header-mobile-panel",
      "data-file": "components/Header.js"
    }, React.createElement("div", {
      className: "grid grid-cols-1 gap-2",
      "data-name": "header-mobile-actions",
      "data-file": "components/Header.js"
    }, React.createElement("button", {
      className: "btn-rr btn-ghost-rr w-full flex items-center justify-between",
      onClick: onGoHome,
      "data-name": "m-home",
      "data-file": "components/Header.js"
    }, React.createElement("span", {
      "data-name": "m-home-text",
      "data-file": "components/Header.js"
    }, "Inicio"), React.createElement("div", {
      className: "icon-arrow-right text-xl text-[var(--primary-color)]",
      "data-name": "m-home-icon",
      "data-file": "components/Header.js"
    })), React.createElement("button", {
      className: "btn-rr btn-primary-rr w-full flex items-center justify-between",
      onClick: onGoSearch,
      "data-name": "m-search",
      "data-file": "components/Header.js"
    }, React.createElement("span", {
      "data-name": "m-search-text",
      "data-file": "components/Header.js"
    }, "Explorar"), React.createElement("div", {
      className: "icon-arrow-right text-xl text-white",
      "data-name": "m-search-icon",
      "data-file": "components/Header.js"
    })), React.createElement("a", {
      className: "btn-rr btn-ghost-rr w-full flex items-center justify-between",
      href: "search.html",
      "data-name": "m-demo",
      "data-file": "components/Header.js"
    }, React.createElement("span", {
      "data-name": "m-demo-text",
      "data-file": "components/Header.js"
    }, "Negocios"), React.createElement("div", {
      className: "icon-external-link text-xl text-[var(--primary-color)]",
      "data-name": "m-demo-icon",
      "data-file": "components/Header.js"
    }))))) : null));
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
function Footer() {
  try {
    const year = 2026;
    return React.createElement("footer", {
      className: "border-t border-[var(--border)] bg-white",
      "data-name": "footer",
      "data-file": "components/Footer.js"
    }, React.createElement("div", {
      className: "container-rr py-10",
      "data-name": "footer-inner",
      "data-file": "components/Footer.js"
    }, React.createElement("div", {
      className: "flex flex-col md:flex-row md:items-center gap-4 justify-between",
      "data-name": "footer-row",
      "data-file": "components/Footer.js"
    }, React.createElement("div", {
      className: "space-y-2",
      "data-name": "footer-brand",
      "data-file": "components/Footer.js"
    }, React.createElement("p", {
      className: "text-sm font-semibold",
      "data-name": "footer-title",
      "data-file": "components/Footer.js"
    }, "Rservas.Roma Marketplace"), React.createElement("p", {
      className: "text-xs text-[var(--text-muted)] leading-relaxed",
      "data-name": "footer-sub",
      "data-file": "components/Footer.js"
    }, "Belleza y servicios en Cuba. Reserva por WhatsApp y descubre negocios VIP con rese\xF1as verificadas.")), React.createElement("div", {
      className: "flex items-center gap-2",
      "data-name": "footer-legal",
      "data-file": "components/Footer.js"
    }, React.createElement("span", {
      className: "text-xs text-[var(--text-muted)]",
      "data-name": "footer-copy",
      "data-file": "components/Footer.js"
    }, "\xA9 ", year, " Rservas.Roma"), React.createElement("span", {
      className: "text-xs text-[var(--text-muted)]",
      "data-name": "footer-dot",
      "data-file": "components/Footer.js"
    }, "\u2022"), React.createElement("a", {
      className: "text-xs text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors",
      href: "index.html#muro",
      "data-name": "footer-muro",
      "data-file": "components/Footer.js"
    }, "Muro de la Intriga")))));
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}
function Badge({
  type,
  text
}) {
  try {
    const styles = (() => {
      if (type === 'vip') return {
        bg: 'bg-[#1F2937]',
        fg: 'text-white',
        icon: 'icon-crown',
        iconColor: 'text-[#F59E0B]'
      };
      if (type === 'top') return {
        bg: 'bg-white',
        fg: 'text-[#1F2937]',
        icon: 'icon-star',
        iconColor: 'text-[#F59E0B]'
      };
      if (type === 'reservado') return {
        bg: 'bg-white',
        fg: 'text-[#1F2937]',
        icon: 'icon-flame',
        iconColor: 'text-[var(--primary-color)]'
      };
      if (type === 'mes') return {
        bg: 'bg-white',
        fg: 'text-[#1F2937]',
        icon: 'icon-award',
        iconColor: 'text-[var(--primary-color)]'
      };
      return {
        bg: 'bg-white',
        fg: 'text-[#1F2937]',
        icon: 'icon-info',
        iconColor: 'text-[var(--primary-color)]'
      };
    })();
    return React.createElement("span", {
      className: `inline-flex items-center gap-2 px-3 py-1.5 chip-rr ${styles.bg} ${styles.fg}`,
      "data-name": "badge",
      "data-file": "components/Badge.js"
    }, React.createElement("span", {
      className: "inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(255,255,255,0.14)]",
      "data-name": "badge-ic-wrap",
      "data-file": "components/Badge.js"
    }, React.createElement("div", {
      className: `${styles.icon} text-sm ${styles.iconColor || 'text-[var(--primary-color)]'}`,
      "data-name": "badge-ic",
      "data-file": "components/Badge.js"
    })), React.createElement("span", {
      className: "text-xs font-medium",
      "data-name": "badge-text",
      "data-file": "components/Badge.js"
    }, text));
  } catch (error) {
    console.error('Badge component error:', error);
    return null;
  }
}
function StarRating({
  value,
  total,
  verified
}) {
  try {
    const stars = Math.round(Number(value || 0) * 10) / 10;
    const t = Number(total || 0);
    return React.createElement("div", {
      className: "flex items-center gap-2",
      "data-name": "star-rating",
      "data-file": "components/StarRating.js"
    }, React.createElement("div", {
      className: "flex items-center gap-1",
      "data-name": "stars",
      "data-file": "components/StarRating.js"
    }, React.createElement("div", {
      className: "icon-star text-base text-[#F59E0B]",
      "data-name": "star-icon",
      "data-file": "components/StarRating.js"
    }), React.createElement("span", {
      className: "text-sm font-semibold",
      "data-name": "star-value",
      "data-file": "components/StarRating.js"
    }, stars.toFixed(1)), React.createElement("span", {
      className: "text-xs text-[var(--text-muted)]",
      "data-name": "star-total",
      "data-file": "components/StarRating.js"
    }, "(", t, ")")), verified ? React.createElement("span", {
      className: "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(11,18,32,0.04)] border border-[var(--border)]",
      "data-name": "verified-pill",
      "data-file": "components/StarRating.js"
    }, React.createElement("div", {
      className: "icon-circle-check text-sm text-[var(--primary-color)]",
      "data-name": "verified-icon",
      "data-file": "components/StarRating.js"
    }), React.createElement("span", {
      className: "text-[11px] text-[var(--text-muted)]",
      "data-name": "verified-text",
      "data-file": "components/StarRating.js"
    }, "Rese\xF1as verificadas")) : null);
  } catch (error) {
    console.error('StarRating component error:', error);
    return null;
  }
}
function Accordion({
  items
}) {
  try {
    const [open, setOpen] = React.useState(() => {
      try {
        return items?.length ? items[0].key : null;
      } catch (e) {
        return null;
      }
    });
    return React.createElement("div", {
      className: "space-y-3",
      "data-name": "accordion",
      "data-file": "components/Accordion.js"
    }, (items || []).map(it => {
      const isOpen = open === it.key;
      return React.createElement("div", {
        key: it.key,
        className: "surface-rr overflow-hidden",
        "data-name": "accordion-item",
        "data-file": "components/Accordion.js"
      }, React.createElement("button", {
        className: "w-full flex items-center justify-between gap-3 px-4 py-4 hover:bg-[rgba(11,18,32,0.03)] transition-colors",
        onClick: () => setOpen(v => v === it.key ? null : it.key),
        "data-name": "accordion-trigger",
        "data-file": "components/Accordion.js",
        "aria-expanded": isOpen
      }, React.createElement("div", {
        className: "min-w-0 text-left",
        "data-name": "accordion-trigger-left",
        "data-file": "components/Accordion.js"
      }, React.createElement("p", {
        className: "text-sm font-semibold",
        "data-name": "accordion-title",
        "data-file": "components/Accordion.js"
      }, it.title), it.subtitle ? React.createElement("p", {
        className: "text-xs text-[var(--text-muted)] mt-1",
        "data-name": "accordion-sub",
        "data-file": "components/Accordion.js"
      }, it.subtitle) : null), React.createElement("div", {
        className: `w-10 h-10 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-center`,
        "data-name": "accordion-iconwrap",
        "data-file": "components/Accordion.js"
      }, React.createElement("div", {
        className: `${isOpen ? 'icon-chevron-up' : 'icon-chevron-down'} text-xl text-[var(--primary-color)]`,
        "data-name": "accordion-icon",
        "data-file": "components/Accordion.js"
      }))), isOpen ? React.createElement("div", {
        className: "px-4 pb-4",
        "data-name": "accordion-panel",
        "data-file": "components/Accordion.js"
      }, React.createElement("div", {
        className: "divider-rr mb-4",
        "data-name": "accordion-divider",
        "data-file": "components/Accordion.js"
      }), React.createElement("div", {
        className: "space-y-2",
        "data-name": "accordion-list",
        "data-file": "components/Accordion.js"
      }, (it.rows || []).map((row, idx) => React.createElement("div", {
        key: `${it.key}-${idx}`,
        className: "flex items-start gap-3 py-2",
        "data-name": "accordion-row",
        "data-file": "components/Accordion.js"
      }, React.createElement("div", {
        className: "w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] shrink-0",
        "data-name": "row-icwrap",
        "data-file": "components/Accordion.js"
      }, React.createElement("div", {
        className: `${row.icon} text-xl text-[var(--primary-color)]`,
        "data-name": "row-icon",
        "data-file": "components/Accordion.js"
      })), React.createElement("div", {
        className: "min-w-0 flex-1",
        "data-name": "row-main",
        "data-file": "components/Accordion.js"
      }, React.createElement("p", {
        className: "text-sm font-medium leading-snug",
        "data-name": "row-title",
        "data-file": "components/Accordion.js"
      }, row.title), row.meta ? React.createElement("p", {
        className: "text-xs text-[var(--text-muted)] mt-1",
        "data-name": "row-meta",
        "data-file": "components/Accordion.js"
      }, row.meta) : null), React.createElement("div", {
        className: "text-right",
        "data-name": "row-right",
        "data-file": "components/Accordion.js"
      }, React.createElement("p", {
        className: "text-sm font-semibold tabular-nums",
        "data-name": "row-price",
        "data-file": "components/Accordion.js"
      }, row.price), row.note ? React.createElement("p", {
        className: "text-[11px] text-[var(--text-muted)] mt-1",
        "data-name": "row-note",
        "data-file": "components/Accordion.js"
      }, row.note) : null))))) : null);
    }));
  } catch (error) {
    console.error('Accordion component error:', error);
    return null;
  }
}
function MasonryGrid({
  images
}) {
  try {
    const imgs = images || [];
    const cols = [imgs.filter((_, i) => i % 3 === 0), imgs.filter((_, i) => i % 3 === 1), imgs.filter((_, i) => i % 3 === 2)];
    return React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-3 gap-3",
      "data-name": "masonry",
      "data-file": "components/MasonryGrid.js"
    }, cols.map((column, ci) => React.createElement("div", {
      key: `col-${ci}`,
      className: "space-y-3",
      "data-name": "masonry-col",
      "data-file": "components/MasonryGrid.js"
    }, column.map((src, idx) => React.createElement("div", {
      key: `${ci}-${idx}`,
      className: "surface-rr overflow-hidden",
      "data-name": "masonry-item",
      "data-file": "components/MasonryGrid.js"
    }, React.createElement("img", {
      src: src,
      alt: "Foto del portafolio",
      className: "w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-300",
      "data-name": "masonry-img",
      "data-file": "components/MasonryGrid.js"
    }))))));
  } catch (error) {
    console.error('MasonryGrid component error:', error);
    return null;
  }
}
function ReviewCard({
  review
}) {
  try {
    const r = review;
    return React.createElement("div", {
      className: "surface-rr p-5",
      "data-name": "review-card",
      "data-file": "components/ReviewCard.js"
    }, React.createElement("div", {
      className: "flex items-start gap-3",
      "data-name": "review-head",
      "data-file": "components/ReviewCard.js"
    }, React.createElement("div", {
      className: "w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]",
      "data-name": "review-avatar",
      "data-file": "components/ReviewCard.js"
    }, React.createElement("div", {
      className: "icon-user text-xl text-[var(--primary-color)]",
      "data-name": "review-avatar-i",
      "data-file": "components/ReviewCard.js"
    })), React.createElement("div", {
      className: "min-w-0",
      "data-name": "review-title",
      "data-file": "components/ReviewCard.js"
    }, React.createElement("p", {
      className: "text-sm font-semibold",
      "data-name": "review-name",
      "data-file": "components/ReviewCard.js"
    }, r.nombre), React.createElement("div", {
      className: "mt-1 flex items-center gap-2",
      "data-name": "review-meta",
      "data-file": "components/ReviewCard.js"
    }, React.createElement("div", {
      className: "flex items-center gap-1",
      "data-name": "review-stars",
      "data-file": "components/ReviewCard.js"
    }, React.createElement("div", {
      className: "icon-star text-base text-[var(--primary-color)]",
      "data-name": "review-star",
      "data-file": "components/ReviewCard.js"
    }), React.createElement("span", {
      className: "text-sm font-semibold",
      "data-name": "review-star-val",
      "data-file": "components/ReviewCard.js"
    }, Number(r.estrellas).toFixed(1))), React.createElement("span", {
      className: "text-xs text-[var(--text-muted)]",
      "data-name": "review-date",
      "data-file": "components/ReviewCard.js"
    }, r.fecha), r.verificada ? React.createElement("span", {
      className: "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(11,18,32,0.04)] border border-[var(--border)]",
      "data-name": "review-verified",
      "data-file": "components/ReviewCard.js"
    }, React.createElement("div", {
      className: "icon-circle-check text-sm text-[var(--primary-color)]",
      "data-name": "review-verified-i",
      "data-file": "components/ReviewCard.js"
    }), React.createElement("span", {
      className: "text-[11px] text-[var(--text-muted)]",
      "data-name": "review-verified-t",
      "data-file": "components/ReviewCard.js"
    }, "Rese\xF1a verificada")) : null))), React.createElement("p", {
      className: "mt-4 text-sm text-[var(--text-muted)] leading-relaxed",
      "data-name": "review-text",
      "data-file": "components/ReviewCard.js"
    }, r.texto));
  } catch (error) {
    console.error('ReviewCard component error:', error);
    return null;
  }
}
function MobileWhatsAppBar({
  whatsapp,
  nombre,
  reservaUrl
}) {
  try {
    const onWhatsApp = () => {
      try {
        const wa = String(whatsapp || '').replace(/\s+/g, '');
        const msg = encodeURIComponent(`Hola, quiero reservar en ${nombre}. ¿Me ayudas con disponibilidad y precios?`);
        const url = reservaUrl || `https://wa.me/${wa.replace('+', '')}?text=${msg}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('MobileWhatsAppBar.onWhatsApp error:', error);
      }
    };
    return React.createElement("div", {
      className: "fixed bottom-0 left-0 right-0 z-[70] md:hidden",
      "data-name": "wa-bar",
      "data-file": "components/MobileWhatsAppBar.js"
    }, React.createElement("div", {
      className: "bg-white/85 backdrop-blur border-t border-[var(--border)] p-3",
      "data-name": "wa-bar-inner",
      "data-file": "components/MobileWhatsAppBar.js"
    }, React.createElement("button", {
      className: "btn-rr btn-primary-rr w-full flex items-center justify-center gap-2 shadow-md",
      onClick: onWhatsApp,
      "data-name": "wa-btn",
      "data-file": "components/MobileWhatsAppBar.js"
    }, React.createElement("div", {
      className: "icon-message-circle text-xl text-white",
      "data-name": "wa-icon",
      "data-file": "components/MobileWhatsAppBar.js"
    }), React.createElement("span", {
      "data-name": "wa-text",
      "data-file": "components/MobileWhatsAppBar.js"
    }, "Reservar"))));
  } catch (error) {
    console.error('MobileWhatsAppBar component error:', error);
    return null;
  }
}
function BusinessHeader({
  business
}) {
  try {
    const b = business;
    const hasCover = Boolean(b.portadaUrl);
    const services = (b.categoriasCatalogo || []).find(section => section.tipo === 'servicios')?.items || [];
    const firstPrice = services[0] ? Format.formatPrecioCUP(services[0].precio) : Format.formatRangoPrecio(b.rangoPrecio?.min, b.rangoPrecio?.max);
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();
    return React.createElement("section", {
      className: "bg-white border-b border-[var(--border)]",
      "data-name": "business-header",
      "data-file": "pages/business/BusinessHeader.js"
    }, React.createElement("div", {
      className: "container-rr py-5 md:py-7",
      "data-name": "header-wrap",
      "data-file": "pages/business/BusinessHeader.js"
    }, React.createElement("div", {
      className: "grid grid-cols-1 lg:grid-cols-[220px_1fr_auto] gap-5 items-center",
      "data-name": "header-grid",
      "data-file": "pages/business/BusinessHeader.js"
    }, React.createElement("div", {
      className: "relative h-[180px] lg:h-[160px] rounded-lg overflow-hidden border border-[var(--border)] bg-[#F9FAFB]",
      "data-name": "brand-media",
      "data-file": "pages/business/BusinessHeader.js"
    }, hasCover ? React.createElement("img", {
      src: b.portadaUrl,
      alt: `Imagen de ${b.nombre}`,
      className: "w-full h-full object-cover",
      "data-name": "cover-img",
      "data-file": "pages/business/BusinessHeader.js"
    }) : React.createElement("div", {
      className: "w-full h-full flex items-center justify-center p-8",
      "data-name": "logo-only",
      "data-file": "pages/business/BusinessHeader.js"
    }, b.logoUrl ? React.createElement("img", {
      src: b.logoUrl,
      alt: `Logo de ${b.nombre}`,
      className: "max-w-full max-h-full object-contain",
      "data-name": "logo-only-img",
      "data-file": "pages/business/BusinessHeader.js"
    }) : React.createElement("div", {
      className: "text-4xl font-semibold text-[var(--primary-color)]",
      "data-name": "logo-only-initials",
      "data-file": "pages/business/BusinessHeader.js"
    }, initials)), React.createElement("div", {
      className: "absolute left-3 bottom-3 w-16 h-16 rounded-lg overflow-hidden bg-white border border-white shadow-sm p-2",
      "data-name": "logo",
      "data-file": "pages/business/BusinessHeader.js"
    }, b.logoUrl ? React.createElement("img", {
      src: b.logoUrl,
      alt: `Logo de ${b.nombre}`,
      className: "w-full h-full object-contain",
      "data-name": "logo-img",
      "data-file": "pages/business/BusinessHeader.js"
    }) : React.createElement("div", {
      className: "w-full h-full flex items-center justify-center text-lg font-semibold text-[var(--primary-color)]",
      "data-name": "logo-initials",
      "data-file": "pages/business/BusinessHeader.js"
    }, initials))), React.createElement("div", {
      className: "min-w-0",
      "data-name": "header-copy",
      "data-file": "pages/business/BusinessHeader.js"
    }, React.createElement("div", {
      className: "flex flex-wrap items-center gap-2",
      "data-name": "title-row",
      "data-file": "pages/business/BusinessHeader.js"
    }, React.createElement("h1", {
      className: "text-2xl md:text-3xl font-semibold tracking-tight leading-tight",
      "data-name": "name",
      "data-file": "pages/business/BusinessHeader.js"
    }, b.nombre), b.vip ? React.createElement(Badge, {
      type: "vip",
      text: "VIP",
      "data-name": "vip",
      "data-file": "pages/business/BusinessHeader.js"
    }) : null), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)] mt-2",
      "data-name": "meta",
      "data-file": "pages/business/BusinessHeader.js"
    }, b.categoria, " \xB7 ", b.ubicacion?.zona || b.ubicacion?.ciudad), b.ubicacion?.direccion ? React.createElement("p", {
      className: "text-sm text-[var(--text-muted)] mt-1",
      "data-name": "address",
      "data-file": "pages/business/BusinessHeader.js"
    }, b.ubicacion.direccion) : null, React.createElement("div", {
      className: "mt-4 flex flex-wrap gap-2",
      "data-name": "quick-facts",
      "data-file": "pages/business/BusinessHeader.js"
    }, React.createElement("span", {
      className: "chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]",
      "data-name": "services-count",
      "data-file": "pages/business/BusinessHeader.js"
    }, services.length, " servicios"), React.createElement("span", {
      className: "chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]",
      "data-name": "first-price",
      "data-file": "pages/business/BusinessHeader.js"
    }, "Desde ", firstPrice))), React.createElement("div", {
      className: "w-full lg:w-[230px]",
      "data-name": "header-action",
      "data-file": "pages/business/BusinessHeader.js"
    }, React.createElement("a", {
      className: "btn-rr btn-primary-rr w-full flex items-center justify-center gap-2",
      href: b.reservaUrl || `https://wa.me/${String(b.whatsapp || '').replace('+', '')}?text=${encodeURIComponent(`Hola, quiero reservar en ${b.nombre}. Tienen disponibilidad?`)}`,
      target: "_blank",
      rel: "noreferrer",
      "data-name": "cta-wa",
      "data-file": "pages/business/BusinessHeader.js"
    }, React.createElement("div", {
      className: "icon-message-circle text-xl text-white",
      "data-name": "cta-wa-i",
      "data-file": "pages/business/BusinessHeader.js"
    }), "Reservar")))));
  } catch (error) {
    console.error('BusinessHeader component error:', error);
    return null;
  }
}
function BusinessTabs({
  active,
  onChange
}) {
  try {
    const tabs = [{
      key: 'portafolio',
      label: 'Portafolio',
      icon: 'icon-image'
    }, {
      key: 'catalogo',
      label: 'Servicios y Productos',
      icon: 'icon-list'
    }, {
      key: 'cursos',
      label: 'Cursos y Talleres',
      icon: 'icon-calendar'
    }, {
      key: 'resenas',
      label: 'Reseñas',
      icon: 'icon-message-square'
    }];
    return React.createElement("div", {
      className: "container-rr mt-5",
      "data-name": "business-tabs",
      "data-file": "pages/business/BusinessTabs.js"
    }, React.createElement("div", {
      className: "surface-rr p-2",
      "data-name": "tabs-surface",
      "data-file": "pages/business/BusinessTabs.js"
    }, React.createElement("div", {
      className: "flex gap-2 overflow-x-auto no-scrollbar",
      "data-name": "tabs-row",
      "data-file": "pages/business/BusinessTabs.js"
    }, tabs.map(t => {
      const isActive = active === t.key;
      return React.createElement("button", {
        key: t.key,
        className: `btn-rr py-2.5 px-4 whitespace-nowrap flex items-center gap-2 relative ${isActive ? 'btn-primary-rr' : 'btn-ghost-rr'}`,
        onClick: () => onChange?.(t.key),
        "data-name": "tab",
        "data-file": "pages/business/BusinessTabs.js"
      }, React.createElement("div", {
        className: `${t.icon} text-xl ${isActive ? 'text-white' : 'text-[var(--primary-color)]'}`,
        "data-name": "tab-i",
        "data-file": "pages/business/BusinessTabs.js"
      }), React.createElement("span", {
        className: "text-sm font-medium",
        "data-name": "tab-t",
        "data-file": "pages/business/BusinessTabs.js"
      }, t.label));
    }))));
  } catch (error) {
    console.error('BusinessTabs component error:', error);
    return null;
  }
}
function BusinessCatalog({
  business
}) {
  try {
    const b = business;
    const services = ((b.categoriasCatalogo || []).find(cat => cat.tipo === 'servicios')?.items || []).filter(item => item && item.nombre);
    if (!services.length) {
      return React.createElement("div", {
        className: "surface-rr p-5",
        "data-name": "empty",
        "data-file": "pages/business/BusinessCatalog.js"
      }, React.createElement("p", {
        className: "text-sm text-[var(--text-muted)]",
        "data-name": "empty-t",
        "data-file": "pages/business/BusinessCatalog.js"
      }, "Este negocio aun no publico servicios."));
    }
    return React.createElement("div", {
      className: "surface-rr overflow-hidden",
      "data-name": "business-catalog",
      "data-file": "pages/business/BusinessCatalog.js"
    }, React.createElement("div", {
      className: "p-4 md:p-5 border-b border-[var(--border)]",
      "data-name": "catalog-head",
      "data-file": "pages/business/BusinessCatalog.js"
    }, React.createElement("h2", {
      className: "text-lg font-semibold",
      "data-name": "catalog-title",
      "data-file": "pages/business/BusinessCatalog.js"
    }, "Servicios")), React.createElement("div", {
      className: "divide-y divide-[var(--border)]",
      "data-name": "service-list",
      "data-file": "pages/business/BusinessCatalog.js"
    }, services.map((service, index) => React.createElement("div", {
      key: `${service.nombre}-${index}`,
      className: "p-4 md:p-5 flex items-start justify-between gap-4 hover:bg-[#F9FAFB]",
      "data-name": "service-row",
      "data-file": "pages/business/BusinessCatalog.js"
    }, React.createElement("div", {
      className: "min-w-0",
      "data-name": "service-copy",
      "data-file": "pages/business/BusinessCatalog.js"
    }, React.createElement("p", {
      className: "text-sm md:text-base font-semibold leading-snug",
      "data-name": "service-name",
      "data-file": "pages/business/BusinessCatalog.js"
    }, service.nombre), React.createElement("div", {
      className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]",
      "data-name": "service-meta",
      "data-file": "pages/business/BusinessCatalog.js"
    }, service.duracionMin ? React.createElement("span", {
      "data-name": "service-duration",
      "data-file": "pages/business/BusinessCatalog.js"
    }, service.duracionMin, " min") : null, service.destacado ? React.createElement("span", {
      className: "chip-rr px-2 py-0.5",
      "data-name": "service-featured",
      "data-file": "pages/business/BusinessCatalog.js"
    }, "Recomendado") : null), service.descripcion ? React.createElement("p", {
      className: "text-sm text-[var(--text-muted)] mt-2 leading-relaxed",
      "data-name": "service-description",
      "data-file": "pages/business/BusinessCatalog.js"
    }, service.descripcion) : null), React.createElement("div", {
      className: "shrink-0 text-right",
      "data-name": "service-price-wrap",
      "data-file": "pages/business/BusinessCatalog.js"
    }, React.createElement("p", {
      className: "text-sm md:text-base font-semibold whitespace-nowrap",
      "data-name": "service-price",
      "data-file": "pages/business/BusinessCatalog.js"
    }, Format.formatPrecioCUP(service.precio)), React.createElement("a", {
      className: "mt-2 btn-rr btn-ghost-rr py-2 px-3 text-xs inline-flex items-center gap-2",
      href: b.reservaUrl || `https://wa.me/${String(b.whatsapp || '').replace('+', '')}?text=${encodeURIComponent(`Hola, quiero reservar ${service.nombre} en ${b.nombre}.`)}`,
      target: "_blank",
      rel: "noreferrer",
      "data-name": "service-book",
      "data-file": "pages/business/BusinessCatalog.js"
    }, "Reservar"))))));
  } catch (error) {
    console.error('BusinessCatalog component error:', error);
    return null;
  }
}
function BusinessReviews({
  business
}) {
  try {
    const b = business;
    const [reviews, setReviews] = React.useState(b.reseñas || []);
    const [rating, setRating] = React.useState(5);
    const [name, setName] = React.useState('');
    const [text, setText] = React.useState('');
    const [saving, setSaving] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const submitReview = async event => {
      try {
        event.preventDefault();
        setMessage('');
        if (!name.trim() || !text.trim()) {
          setMessage('Escribe tu nombre y tu reseña.');
          return;
        }
        setSaving(true);
        const created = await MockData.addReview(b.id, {
          nombre: name.trim(),
          estrellas: rating,
          texto: text.trim()
        });
        const review = {
          id: String(created.id || `${b.id}-${Date.now()}`),
          nombre: created.nombre || name.trim(),
          estrellas: Number(created.estrellas || rating),
          texto: created.texto || text.trim(),
          fecha: created.fecha || created.created_at || new Date().toISOString(),
          verificada: created.verificada === true
        };
        setReviews(current => [review, ...current]);
        setName('');
        setText('');
        setRating(5);
        setMessage('Gracias. Tu reseña ya fue enviada.');
      } catch (error) {
        console.error('BusinessReviews.submitReview error:', error);
        setMessage(error.message || 'No se pudo guardar la reseña.');
      } finally {
        setSaving(false);
      }
    };
    const average = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.estrellas || 0), 0) / reviews.length : Number(b.estrellas || 0);
    return React.createElement("section", {
      className: "mt-4",
      "data-name": "business-reviews",
      "data-file": "pages/business/BusinessReviews.js"
    }, React.createElement("div", {
      className: "surface-rr p-4 md:p-5",
      "data-name": "review-form-card",
      "data-file": "pages/business/BusinessReviews.js"
    }, React.createElement("div", {
      className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
      "data-name": "reviews-head",
      "data-file": "pages/business/BusinessReviews.js"
    }, React.createElement("div", {
      "data-name": "reviews-copy",
      "data-file": "pages/business/BusinessReviews.js"
    }, React.createElement("h2", {
      className: "text-lg font-semibold",
      "data-name": "reviews-title",
      "data-file": "pages/business/BusinessReviews.js"
    }, "Valorar este negocio"), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)] mt-1",
      "data-name": "reviews-sub",
      "data-file": "pages/business/BusinessReviews.js"
    }, reviews.length, " rese\xF1as \xB7 ", average.toFixed(1), " estrellas")), React.createElement(StarRating, {
      value: average,
      total: reviews.length,
      verified: false,
      "data-name": "reviews-stars",
      "data-file": "pages/business/BusinessReviews.js"
    })), React.createElement("form", {
      className: "mt-5 grid gap-3",
      onSubmit: submitReview,
      "data-name": "review-form",
      "data-file": "pages/business/BusinessReviews.js"
    }, React.createElement("div", {
      className: "flex gap-2",
      "data-name": "rating-buttons",
      "data-file": "pages/business/BusinessReviews.js"
    }, [1, 2, 3, 4, 5].map(value => React.createElement("button", {
      key: value,
      type: "button",
      className: `w-10 h-10 rounded-lg border flex items-center justify-center ${value <= rating ? 'bg-[#F59E0B] border-[#F59E0B] text-white' : 'bg-white border-[var(--border)] text-[var(--text-muted)]'}`,
      onClick: () => setRating(value),
      "aria-label": `${value} estrellas`,
      "data-name": "rating-button",
      "data-file": "pages/business/BusinessReviews.js"
    }, React.createElement("div", {
      className: "icon-star text-lg",
      "data-name": "rating-button-icon",
      "data-file": "pages/business/BusinessReviews.js"
    })))), React.createElement("input", {
      className: "input-rr",
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "Tu nombre",
      "data-name": "review-name-input",
      "data-file": "pages/business/BusinessReviews.js"
    }), React.createElement("textarea", {
      className: "input-rr min-h-[104px] resize-y",
      value: text,
      onChange: e => setText(e.target.value),
      placeholder: "Cuenta como fue tu experiencia",
      "data-name": "review-text-input",
      "data-file": "pages/business/BusinessReviews.js"
    }), React.createElement("div", {
      className: "flex flex-col sm:flex-row sm:items-center gap-3",
      "data-name": "review-submit-row",
      "data-file": "pages/business/BusinessReviews.js"
    }, React.createElement("button", {
      className: "btn-rr btn-primary-rr w-full sm:w-auto",
      type: "submit",
      disabled: saving,
      "data-name": "review-submit",
      "data-file": "pages/business/BusinessReviews.js"
    }, saving ? 'Enviando...' : 'Enviar reseña'), message ? React.createElement("p", {
      className: "text-sm text-[var(--text-muted)]",
      "data-name": "review-message",
      "data-file": "pages/business/BusinessReviews.js"
    }, message) : null))), reviews.length ? React.createElement("div", {
      className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4",
      "data-name": "reviews-grid",
      "data-file": "pages/business/BusinessReviews.js"
    }, reviews.slice(0, 6).map(review => React.createElement(ReviewCard, {
      key: review.id,
      review: review,
      "data-name": "review",
      "data-file": "pages/business/BusinessReviews.js"
    }))) : null);
  } catch (error) {
    console.error('BusinessReviews component error:', error);
    return null;
  }
}
function BusinessPage({
  business
}) {
  try {
    const b = business;
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();
    return React.createElement("div", {
      "data-name": "business-page",
      "data-file": "pages/business/BusinessPage.js"
    }, React.createElement(BusinessHeader, {
      business: b,
      "data-name": "business-header",
      "data-file": "pages/business/BusinessPage.js"
    }), React.createElement("div", {
      className: "container-rr mt-5 md:mt-7",
      "data-name": "business-content",
      "data-file": "pages/business/BusinessPage.js"
    }, React.createElement("div", {
      className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start",
      "data-name": "business-grid",
      "data-file": "pages/business/BusinessPage.js"
    }, React.createElement("div", {
      "data-name": "left",
      "data-file": "pages/business/BusinessPage.js"
    }, React.createElement(BusinessCatalog, {
      business: b,
      "data-name": "catalog",
      "data-file": "pages/business/BusinessPage.js"
    }), React.createElement(BusinessReviews, {
      business: b,
      "data-name": "reviews",
      "data-file": "pages/business/BusinessPage.js"
    })), React.createElement("aside", {
      className: "hidden lg:block sticky top-[92px]",
      "data-name": "right",
      "data-file": "pages/business/BusinessPage.js"
    }, React.createElement("div", {
      className: "surface-rr p-5",
      "data-name": "contact-card",
      "data-file": "pages/business/BusinessPage.js"
    }, React.createElement("div", {
      className: "flex items-center gap-3",
      "data-name": "contact-top",
      "data-file": "pages/business/BusinessPage.js"
    }, React.createElement("div", {
      className: "w-12 h-12 rounded-lg border border-[var(--border)] bg-white overflow-hidden p-1.5",
      "data-name": "contact-logo",
      "data-file": "pages/business/BusinessPage.js"
    }, b.logoUrl ? React.createElement("img", {
      src: b.logoUrl,
      alt: `Logo de ${b.nombre}`,
      className: "w-full h-full object-contain",
      "data-name": "contact-logo-img",
      "data-file": "pages/business/BusinessPage.js"
    }) : React.createElement("div", {
      className: "w-full h-full flex items-center justify-center text-sm font-semibold text-[var(--primary-color)]",
      "data-name": "contact-logo-initials",
      "data-file": "pages/business/BusinessPage.js"
    }, initials)), React.createElement("div", {
      className: "min-w-0",
      "data-name": "contact-copy",
      "data-file": "pages/business/BusinessPage.js"
    }, React.createElement("p", {
      className: "text-sm font-semibold truncate",
      "data-name": "contact-name",
      "data-file": "pages/business/BusinessPage.js"
    }, b.nombre), React.createElement("p", {
      className: "text-xs text-[var(--text-muted)] truncate",
      "data-name": "contact-area",
      "data-file": "pages/business/BusinessPage.js"
    }, b.ubicacion?.zona || b.ubicacion?.ciudad))), React.createElement("div", {
      className: "divider-rr my-4",
      "data-name": "contact-div",
      "data-file": "pages/business/BusinessPage.js"
    }), React.createElement("a", {
      className: "btn-rr btn-primary-rr w-full flex items-center justify-center gap-2",
      href: b.reservaUrl || `https://wa.me/${String(b.whatsapp || '').replace('+', '')}?text=${encodeURIComponent(`Hola, quiero reservar en ${b.nombre}.`)}`,
      target: "_blank",
      rel: "noreferrer",
      "data-name": "sticky-wa",
      "data-file": "pages/business/BusinessPage.js"
    }, React.createElement("div", {
      className: "icon-message-circle text-xl text-white",
      "data-name": "sticky-wa-i",
      "data-file": "pages/business/BusinessPage.js"
    }), "Reservar"))))), React.createElement(MobileWhatsAppBar, {
      whatsapp: b.whatsapp,
      nombre: b.nombre,
      reservaUrl: b.reservaUrl,
      "data-name": "wa",
      "data-file": "pages/business/BusinessPage.js"
    }));
  } catch (error) {
    console.error('BusinessPage component error:', error);
    return null;
  }
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return React.createElement("div", {
        className: "min-h-screen flex items-center justify-center bg-[#F9FAFB]",
        "data-name": "error-state",
        "data-file": "business-app.js"
      }, React.createElement("div", {
        className: "text-center max-w-md mx-auto px-6",
        "data-name": "error-state-inner",
        "data-file": "business-app.js"
      }, React.createElement("div", {
        className: "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] mb-5",
        "data-name": "error-icon",
        "data-file": "business-app.js"
      }, React.createElement("div", {
        className: "icon-triangle-alert text-2xl text-[var(--primary-color)]",
        "data-name": "error-icon-i",
        "data-file": "business-app.js"
      })), React.createElement("h1", {
        className: "text-2xl font-semibold text-[var(--text)] mb-2",
        "data-name": "error-title",
        "data-file": "business-app.js"
      }, "Algo sali\xF3 mal"), React.createElement("p", {
        className: "text-sm text-[var(--text-muted)] mb-6",
        "data-name": "error-desc",
        "data-file": "business-app.js"
      }, "Lo sentimos, ocurri\xF3 un error inesperado. Puedes recargar la p\xE1gina."), React.createElement("button", {
        onClick: () => window.location.reload(),
        className: "btn-rr btn-primary-rr",
        "data-name": "error-reload",
        "data-file": "business-app.js"
      }, "Recargar")));
    }
    return this.props.children;
  }
}
function BusinessApp() {
  try {
    const [dataReady, setDataReady] = React.useState(false);
    const [dataError, setDataError] = React.useState('');
    const businessId = (() => {
      try {
        const url = new URL(window.location.href);
        return url.searchParams.get('id') || 'roma-001';
      } catch (error) {
        console.error('Error leyendo id:', error);
        return 'roma-001';
      }
    })();
    React.useEffect(() => {
      let mounted = true;
      MockData.loadBusinesses().catch(error => {
        const message = MockData.getLoadError() || error.message;
        if (!message.includes('SUPABASE_URL')) console.error('BusinessApp.loadBusinesses error:', error);
        if (mounted) setDataError(MockData.getLoadError() || error.message);
      }).finally(() => {
        if (mounted) setDataReady(true);
      });
      return () => {
        mounted = false;
      };
    }, []);
    const business = MockData.getBusinessById(businessId);
    return React.createElement("div", {
      className: "min-h-screen bg-[var(--bg)]",
      "data-name": "business-app",
      "data-file": "business-app.js"
    }, React.createElement(ToastProvider, {
      "data-name": "toast-provider",
      "data-file": "business-app.js"
    }, React.createElement(Header, {
      currentParams: null,
      "data-name": "header-wrap",
      "data-file": "business-app.js"
    }), React.createElement("main", {
      className: "pt-0 pb-24",
      "data-name": "main",
      "data-file": "business-app.js"
    }, dataError ? React.createElement(DataSourceError, {
      message: dataError,
      "data-name": "data-source-error",
      "data-file": "business-app.js"
    }) : !dataReady ? React.createElement("div", {
      className: "container-rr py-16 text-center text-sm text-[var(--text-muted)]",
      "data-name": "loading",
      "data-file": "business-app.js"
    }, "Cargando negocio...") : business ? React.createElement(BusinessPage, {
      business: business,
      "data-name": "business-page",
      "data-file": "business-app.js"
    }) : React.createElement(BusinessNotFound, {
      businessId: businessId,
      "data-name": "business-not-found",
      "data-file": "business-app.js"
    })), React.createElement(Footer, {
      "data-name": "footer",
      "data-file": "business-app.js"
    })));
  } catch (error) {
    console.error('BusinessApp component error:', error);
    return null;
  }
}
function DataSourceError({
  message
}) {
  try {
    return React.createElement("div", {
      className: "container-rr py-16",
      "data-name": "data-source-error",
      "data-file": "business-app.js"
    }, React.createElement("div", {
      className: "surface-rr max-w-[680px] mx-auto p-6 md:p-8 text-center",
      "data-name": "data-source-error-card",
      "data-file": "business-app.js"
    }, React.createElement("div", {
      className: "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] mb-5",
      "data-name": "data-source-error-icon",
      "data-file": "business-app.js"
    }, React.createElement("div", {
      className: "icon-database-zap text-2xl text-[var(--primary-color)]",
      "data-name": "data-source-error-icon-i",
      "data-file": "business-app.js"
    })), React.createElement("h1", {
      className: "text-2xl font-semibold text-[var(--text)]",
      "data-name": "data-source-error-title",
      "data-file": "business-app.js"
    }, "Base de datos no conectada"), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)] mt-2 leading-relaxed",
      "data-name": "data-source-error-desc",
      "data-file": "business-app.js"
    }, message), React.createElement("p", {
      className: "text-xs text-[var(--text-muted)] mt-4",
      "data-name": "data-source-error-help",
      "data-file": "business-app.js"
    }, "Configura window.SUPABASE_URL y window.SUPABASE_ANON_KEY en utils/supabase-config.js.")));
  } catch (error) {
    console.error('DataSourceError component error:', error);
    return null;
  }
}
function BusinessNotFound({
  businessId
}) {
  try {
    return React.createElement("div", {
      className: "container-rr pt-14 md:pt-20",
      "data-name": "business-not-found",
      "data-file": "business-app.js"
    }, React.createElement("div", {
      className: "surface-rr max-w-[620px] mx-auto p-6 md:p-8 text-center",
      "data-name": "business-not-found-card",
      "data-file": "business-app.js"
    }, React.createElement("div", {
      className: "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] mb-5",
      "data-name": "business-not-found-icon",
      "data-file": "business-app.js"
    }, React.createElement("div", {
      className: "icon-search-x text-2xl text-[var(--primary-color)]",
      "data-name": "business-not-found-icon-i",
      "data-file": "business-app.js"
    })), React.createElement("h1", {
      className: "text-2xl font-semibold text-[var(--text)]",
      "data-name": "business-not-found-title",
      "data-file": "business-app.js"
    }, "Negocio no encontrado"), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)] mt-2 leading-relaxed",
      "data-name": "business-not-found-desc",
      "data-file": "business-app.js"
    }, "No encontramos un perfil publicado para el ID ", businessId ? `"${businessId}"` : 'solicitado', ". Puede que el enlace haya cambiado o que el negocio ya no este disponible."), React.createElement("div", {
      className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-3",
      "data-name": "business-not-found-actions",
      "data-file": "business-app.js"
    }, React.createElement("button", {
      className: "btn-rr btn-primary-rr w-full sm:w-auto flex items-center justify-center gap-2",
      onClick: () => Navigation.goToSearch('', ''),
      "data-name": "business-not-found-search",
      "data-file": "business-app.js"
    }, "Explorar negocios", React.createElement("div", {
      className: "icon-arrow-right text-xl text-white",
      "data-name": "business-not-found-search-i",
      "data-file": "business-app.js"
    })), React.createElement("button", {
      className: "btn-rr btn-ghost-rr w-full sm:w-auto",
      onClick: () => Navigation.goHome(),
      "data-name": "business-not-found-home",
      "data-file": "business-app.js"
    }, "Volver al inicio"))));
  } catch (error) {
    console.error('BusinessNotFound component error:', error);
    return null;
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ErrorBoundary, null, React.createElement(BusinessApp, null)));