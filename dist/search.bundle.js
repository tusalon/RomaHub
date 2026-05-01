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
function SearchBar({
  initialServicio,
  initialUbicacion,
  compact
}) {
  try {
    const toast = useToast();
    const [servicio, setServicio] = React.useState(initialServicio || '');
    const [ubicacion, setUbicacion] = React.useState(initialUbicacion || '');
    const [focus, setFocus] = React.useState(false);
    React.useEffect(() => {
      try {
        setServicio(initialServicio || '');
        setUbicacion(initialUbicacion || '');
      } catch (error) {
        console.error('SearchBar sync error:', error);
      }
    }, [initialServicio, initialUbicacion]);
    const sugerenciasServicio = ['Unas', 'Barberia', 'Cejas y pestanas', 'Peinados', 'Maquillaje', 'Masajes'];
    const sugerenciasUbicacion = ['La Habana', 'Vedado', 'Miramar', 'Habana Vieja', 'Centro Habana'];
    const ejecutarBusqueda = () => {
      try {
        if (!servicio && !ubicacion) {
          toast?.push({
            title: 'Escribe algo',
            message: 'Busca por servicio o por una zona, por ejemplo Vedado.'
          });
          return;
        }
        Navigation.goToSearch(servicio, ubicacion);
      } catch (error) {
        console.error('SearchBar.ejecutarBusqueda error:', error);
      }
    };
    const suggestionChips = (items, onPick) => React.createElement("div", {
      className: "flex flex-wrap gap-2 mt-3",
      "data-name": "suggestions",
      "data-file": "components/SearchBar.js"
    }, items.map(s => React.createElement("button", {
      key: s,
      className: "px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-xs text-[var(--text-muted)] hover:text-[var(--primary-color)] hover:border-[rgba(216,27,96,0.35)] transition-colors",
      onClick: () => onPick(s),
      "data-name": "suggestion-chip",
      "data-file": "components/SearchBar.js"
    }, s)));
    return React.createElement("div", {
      className: `${compact ? 'w-full' : 'w-full max-w-[900px] mx-auto'}`,
      "data-name": "searchbar",
      "data-file": "components/SearchBar.js"
    }, React.createElement("div", {
      className: `surface-rr bg-white p-2 md:p-2 ${focus ? 'subtle-glow-rr' : ''} transition-shadow`,
      "data-name": "searchbar-surface",
      "data-file": "components/SearchBar.js"
    }, React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-0 md:gap-2 items-stretch",
      "data-name": "searchbar-grid",
      "data-file": "components/SearchBar.js"
    }, React.createElement("div", {
      className: "flex items-center gap-3 px-3 py-3 md:border-r border-[var(--border)]",
      "data-name": "field-servicio",
      "data-file": "components/SearchBar.js"
    }, React.createElement("div", {
      className: "w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(11,18,32,0.04)]",
      "data-name": "field-servicio-icon",
      "data-file": "components/SearchBar.js"
    }, React.createElement("div", {
      className: "icon-search text-xl text-[var(--primary-color)]",
      "data-name": "field-servicio-icon-i",
      "data-file": "components/SearchBar.js"
    })), React.createElement("div", {
      className: "min-w-0 flex-1",
      "data-name": "field-servicio-input",
      "data-file": "components/SearchBar.js"
    }, React.createElement("label", {
      className: "block text-[11px] text-[var(--text-muted)] mb-1",
      "data-name": "label-servicio",
      "data-file": "components/SearchBar.js"
    }, "Servicio"), React.createElement("input", {
      className: "w-full text-sm bg-transparent outline-none",
      value: servicio,
      onChange: e => setServicio(e.target.value),
      placeholder: "Unas, barberia, maquillaje",
      onFocus: () => setFocus(true),
      onBlur: () => setFocus(false),
      onKeyDown: e => {
        if (e.key === 'Enter') ejecutarBusqueda();
      },
      "data-name": "input-servicio",
      "data-file": "components/SearchBar.js"
    }))), React.createElement("div", {
      className: "flex items-center gap-3 px-3 py-3",
      "data-name": "field-ubicacion",
      "data-file": "components/SearchBar.js"
    }, React.createElement("div", {
      className: "w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(11,18,32,0.04)]",
      "data-name": "field-ubicacion-icon",
      "data-file": "components/SearchBar.js"
    }, React.createElement("div", {
      className: "icon-map-pin text-xl text-[var(--primary-color)]",
      "data-name": "field-ubicacion-icon-i",
      "data-file": "components/SearchBar.js"
    })), React.createElement("div", {
      className: "min-w-0 flex-1",
      "data-name": "field-ubicacion-input",
      "data-file": "components/SearchBar.js"
    }, React.createElement("label", {
      className: "block text-[11px] text-[var(--text-muted)] mb-1",
      "data-name": "label-ubicacion",
      "data-file": "components/SearchBar.js"
    }, "Ubicacion"), React.createElement("input", {
      className: "w-full text-sm bg-transparent outline-none",
      value: ubicacion,
      onChange: e => setUbicacion(e.target.value),
      placeholder: "Vedado, La Habana",
      onFocus: () => setFocus(true),
      onBlur: () => setFocus(false),
      onKeyDown: e => {
        if (e.key === 'Enter') ejecutarBusqueda();
      },
      "data-name": "input-ubicacion",
      "data-file": "components/SearchBar.js"
    }))), React.createElement("button", {
      className: "btn-rr btn-primary-rr w-full md:w-auto flex items-center justify-center gap-2 md:px-7",
      onClick: ejecutarBusqueda,
      "data-name": "btn-buscar",
      "data-file": "components/SearchBar.js"
    }, React.createElement("span", {
      "data-name": "btn-buscar-text",
      "data-file": "components/SearchBar.js"
    }, "Buscar"), React.createElement("div", {
      className: "icon-arrow-right text-xl text-white",
      "data-name": "btn-buscar-icon",
      "data-file": "components/SearchBar.js"
    }))), !compact ? React.createElement("div", {
      className: "mt-4 px-1",
      "data-name": "searchbar-suggestions",
      "data-file": "components/SearchBar.js"
    }, React.createElement("p", {
      className: "text-xs text-[var(--text-muted)]",
      "data-name": "suggestions-title",
      "data-file": "components/SearchBar.js"
    }, "Populares ahora"), suggestionChips(sugerenciasServicio, s => setServicio(s)), suggestionChips(sugerenciasUbicacion, s => setUbicacion(s))) : null));
  } catch (error) {
    console.error('SearchBar component error:', error);
    return null;
  }
}
function BusinessCard({
  business,
  onHover,
  active
}) {
  try {
    const b = business;
    const border = active ? 'border-[rgba(216,27,96,0.35)] shadow-[0_16px_40px_rgba(216,27,96,0.10)]' : '';
    const serviceSection = (b.categoriasCatalogo || []).find(section => section.tipo === 'servicios');
    const serviceCount = serviceSection?.items?.length || 0;
    const firstService = serviceSection?.items?.[0] || null;
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();
    const onOpen = () => {
      try {
        Navigation.goToBusiness(b.id);
      } catch (error) {
        console.error('BusinessCard.onOpen error:', error);
      }
    };
    const onContact = e => {
      try {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        const msg = encodeURIComponent(`Hola, quiero reservar en ${b.nombre}. Tienen disponibilidad?`);
        const wa = (b.whatsapp || '').replace(/\s+/g, '');
        const url = b.reservaUrl || `https://wa.me/${wa.replace('+', '')}?text=${msg}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('BusinessCard.onContact error:', error);
      }
    };
    const onKeyDown = e => {
      try {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      } catch (error) {
        console.error('BusinessCard.onKeyDown error:', error);
      }
    };
    return React.createElement("div", {
      className: `surface-rr w-full text-left overflow-hidden transition-shadow hover:shadow-[0_14px_34px_rgba(11,18,32,0.10)] ${border} cursor-pointer`,
      onMouseEnter: () => onHover?.(b),
      onFocus: () => onHover?.(b),
      onClick: onOpen,
      onKeyDown: onKeyDown,
      role: "button",
      tabIndex: 0,
      "data-name": "business-card",
      "data-file": "components/BusinessCard.js",
      "aria-label": `Abrir perfil de ${b.nombre}`
    }, React.createElement("div", {
      className: "grid grid-cols-[96px_1fr] gap-4 p-3",
      "data-name": "business-card-inner",
      "data-file": "components/BusinessCard.js"
    }, React.createElement("div", {
      className: "relative w-24 h-24 rounded-lg overflow-hidden bg-white border border-[var(--border)] p-2",
      "data-name": "photo",
      "data-file": "components/BusinessCard.js"
    }, b.logoUrl ? React.createElement("img", {
      src: b.logoUrl,
      alt: `Logo de ${b.nombre}`,
      className: "w-full h-full object-contain",
      "data-name": "photo-img",
      "data-file": "components/BusinessCard.js"
    }) : React.createElement("div", {
      className: "w-full h-full flex items-center justify-center text-xl font-semibold text-[var(--primary-color)]",
      "data-name": "photo-initials",
      "data-file": "components/BusinessCard.js"
    }, initials), b.vip ? React.createElement("div", {
      className: "absolute top-2 left-2",
      "data-name": "vip",
      "data-file": "components/BusinessCard.js"
    }, React.createElement("span", {
      className: "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#1F2937] text-white text-[11px] border border-white/20",
      "data-name": "vip-chip",
      "data-file": "components/BusinessCard.js"
    }, React.createElement("div", {
      className: "icon-crown text-sm text-[#F59E0B]",
      "data-name": "vip-icon",
      "data-file": "components/BusinessCard.js"
    }), "VIP")) : null), React.createElement("div", {
      className: "min-w-0",
      "data-name": "content",
      "data-file": "components/BusinessCard.js"
    }, React.createElement("div", {
      className: "flex items-start gap-3",
      "data-name": "top",
      "data-file": "components/BusinessCard.js"
    }, React.createElement("div", {
      className: "min-w-0",
      "data-name": "title",
      "data-file": "components/BusinessCard.js"
    }, React.createElement("p", {
      className: "text-base font-semibold leading-snug truncate",
      "data-name": "name",
      "data-file": "components/BusinessCard.js"
    }, b.nombre), React.createElement("p", {
      className: "text-xs text-[var(--text-muted)] mt-1 truncate",
      "data-name": "meta",
      "data-file": "components/BusinessCard.js"
    }, b.categoria, " \xB7 ", b.ubicacion?.zona)), React.createElement("div", {
      className: "ml-auto hidden sm:flex flex-col items-end gap-1",
      "data-name": "top-right",
      "data-file": "components/BusinessCard.js"
    }, React.createElement("div", {
      className: "flex items-center gap-1",
      "data-name": "stars",
      "data-file": "components/BusinessCard.js"
    }, React.createElement("div", {
      className: "icon-star text-base text-[#F59E0B]",
      "data-name": "star",
      "data-file": "components/BusinessCard.js"
    }), React.createElement("span", {
      className: "text-sm font-semibold",
      "data-name": "star-val",
      "data-file": "components/BusinessCard.js"
    }, Number(b.estrellas).toFixed(1))), React.createElement("span", {
      className: "text-[11px] text-[var(--text-muted)]",
      "data-name": "reviews",
      "data-file": "components/BusinessCard.js"
    }, b.totalReseñas, " rese\xF1as"))), React.createElement("div", {
      className: "mt-3 flex flex-wrap gap-2",
      "data-name": "badges",
      "data-file": "components/BusinessCard.js"
    }, serviceCount ? React.createElement("span", {
      className: "chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]",
      "data-name": "services-count",
      "data-file": "components/BusinessCard.js"
    }, serviceCount, " servicios") : null), React.createElement("div", {
      className: "mt-4 flex items-center justify-between gap-3",
      "data-name": "bottom",
      "data-file": "components/BusinessCard.js"
    }, React.createElement("span", {
      className: "text-xs text-[var(--text-muted)] truncate",
      "data-name": "price",
      "data-file": "components/BusinessCard.js"
    }, firstService ? `${firstService.nombre} - ${Format.formatPrecioCUP(firstService.precio)}` : Format.formatRangoPrecio(b.rangoPrecio?.min, b.rangoPrecio?.max)), React.createElement("button", {
      type: "button",
      className: "btn-rr btn-primary-rr py-2 px-4 text-xs flex items-center gap-2 shadow-md",
      onClick: onContact,
      "data-name": "contact",
      "data-file": "components/BusinessCard.js",
      "aria-label": `Reservar en ${b.nombre}`
    }, React.createElement("div", {
      className: "icon-message-circle text-base text-white",
      "data-name": "contact-i",
      "data-file": "components/BusinessCard.js"
    }), "Reservar")))));
  } catch (error) {
    console.error('BusinessCard component error:', error);
    return null;
  }
}
function MapSplitView({
  businesses,
  activeId,
  onSelect
}) {
  try {
    const list = businesses || [];
    const active = list.find(b => b.id === activeId) || null;
    const MapPin = ({
      business
    }) => {
      try {
        const b = business;
        const size = b.vip ? 'w-12 h-12' : 'w-10 h-10';
        const ring = b.vip ? 'ring-2 ring-[#F59E0B]/60' : 'ring-1 ring-[rgba(31,41,55,0.14)]';
        const scale = b.id === activeId ? 'scale-110' : 'scale-100';
        const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();
        return React.createElement("button", {
          className: `absolute ${size} ${ring} rounded-2xl bg-white flex items-center justify-center shadow-[0_18px_55px_rgba(11,18,32,0.16)] transform ${scale} transition-transform`,
          style: {
            left: `${b._mapX}%`,
            top: `${b._mapY}%`,
            translate: '-50% -50%'
          },
          onClick: () => onSelect?.(b),
          "data-name": "map-pin",
          "data-file": "components/MapSplitView.js",
          "aria-label": `Pin de ${b.nombre}`
        }, React.createElement("div", {
          className: "w-7 h-7 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1",
          "data-name": "map-pin-inner",
          "data-file": "components/MapSplitView.js"
        }, b.logoUrl ? React.createElement("img", {
          src: b.logoUrl,
          alt: `Logo de ${b.nombre}`,
          className: "w-full h-full object-contain",
          "data-name": "map-pin-logo",
          "data-file": "components/MapSplitView.js"
        }) : React.createElement("span", {
          className: "text-[10px] font-semibold text-[var(--primary-color)]",
          "data-name": "map-pin-initials",
          "data-file": "components/MapSplitView.js"
        }, initials)));
      } catch (error) {
        console.error('MapSplitView.MapPin error:', error);
        return null;
      }
    };
    return React.createElement("div", {
      className: "relative w-full h-full",
      "data-name": "map-split-view",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("div", {
      className: "absolute inset-0 bg-[#F9FAFB]",
      "data-name": "map-bg",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("div", {
      className: "absolute inset-0",
      "data-name": "map-grid",
      "data-file": "components/MapSplitView.js",
      style: {
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(11,18,32,0.12) 1px, transparent 0)',
        backgroundSize: '22px 22px'
      }
    }), React.createElement("div", {
      className: "absolute top-4 left-4 right-4",
      "data-name": "map-hint",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("div", {
      className: "surface-rr p-3 flex items-center gap-3",
      "data-name": "map-hint-inner",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("div", {
      className: "w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]",
      "data-name": "map-hint-iw",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("div", {
      className: "icon-map text-xl text-[var(--primary-color)]",
      "data-name": "map-hint-i",
      "data-file": "components/MapSplitView.js"
    })), React.createElement("div", {
      className: "min-w-0",
      "data-name": "map-hint-text",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("p", {
      className: "text-sm font-semibold",
      "data-name": "map-hint-title",
      "data-file": "components/MapSplitView.js"
    }, "Mapa interactivo"), React.createElement("p", {
      className: "text-xs text-[var(--text-muted)]",
      "data-name": "map-hint-sub",
      "data-file": "components/MapSplitView.js"
    }, "Pins VIP m\xE1s grandes. Toca para ver una tarjeta m\xEDnima.")))), React.createElement("div", {
      className: "absolute inset-0",
      "data-name": "map-pins",
      "data-file": "components/MapSplitView.js"
    }, list.map(b => React.createElement(MapPin, {
      key: b.id,
      business: b,
      "data-name": "pin",
      "data-file": "components/MapSplitView.js"
    }))), active ? React.createElement("div", {
      className: "absolute bottom-4 left-4 right-4",
      "data-name": "map-card",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("div", {
      className: "card-rr p-4",
      "data-name": "map-card-inner",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("div", {
      className: "flex items-start gap-3",
      "data-name": "map-card-row",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("div", {
      className: "w-12 h-12 rounded-2xl overflow-hidden border border-[var(--border)] bg-white p-1.5",
      "data-name": "map-card-logo",
      "data-file": "components/MapSplitView.js"
    }, active.logoUrl ? React.createElement("img", {
      src: active.logoUrl,
      alt: `Logo de ${active.nombre}`,
      className: "w-full h-full object-contain",
      "data-name": "map-card-logo-img",
      "data-file": "components/MapSplitView.js"
    }) : React.createElement("div", {
      className: "w-full h-full flex items-center justify-center text-sm font-semibold text-[var(--primary-color)]",
      "data-name": "map-card-initials",
      "data-file": "components/MapSplitView.js"
    }, String(active.nombre || 'N').trim().slice(0, 2).toUpperCase())), React.createElement("div", {
      className: "min-w-0",
      "data-name": "map-card-content",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("p", {
      className: "text-sm font-semibold truncate",
      "data-name": "map-card-name",
      "data-file": "components/MapSplitView.js"
    }, active.nombre), React.createElement("p", {
      className: "text-xs text-[var(--text-muted)] truncate mt-1",
      "data-name": "map-card-meta",
      "data-file": "components/MapSplitView.js"
    }, active.categoria, " \xB7 ", active.ubicacion?.zona), React.createElement("div", {
      className: "mt-2 flex items-center justify-between gap-3",
      "data-name": "map-card-bottom",
      "data-file": "components/MapSplitView.js"
    }, React.createElement("span", {
      className: "text-xs text-[var(--text-muted)]",
      "data-name": "map-card-price",
      "data-file": "components/MapSplitView.js"
    }, Format.formatRangoPrecio(active.rangoPrecio?.min, active.rangoPrecio?.max)), React.createElement("button", {
      className: "btn-rr btn-primary-rr py-2 px-3 text-xs flex items-center gap-2",
      onClick: () => Navigation.goToBusiness(active.id),
      "data-name": "map-card-open",
      "data-file": "components/MapSplitView.js"
    }, "Ver perfil", React.createElement("div", {
      className: "icon-arrow-right text-base text-white",
      "data-name": "map-card-open-i",
      "data-file": "components/MapSplitView.js"
    })))), React.createElement("button", {
      className: "ml-auto text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors",
      onClick: () => onSelect?.(null),
      "data-name": "map-card-close",
      "data-file": "components/MapSplitView.js",
      "aria-label": "Cerrar"
    }, React.createElement("div", {
      className: "icon-x text-lg",
      "data-name": "map-card-close-i",
      "data-file": "components/MapSplitView.js"
    }))))) : null));
  } catch (error) {
    console.error('MapSplitView component error:', error);
    return null;
  }
}
function SearchPage({
  query,
  onQueryChange
}) {
  try {
    const toast = useToast();
    const [activeId, setActiveId] = React.useState(null);
    const [mobileMap, setMobileMap] = React.useState(false);
    const mapBounds = {
      north: 23.1550,
      south: 23.0950,
      east: -82.3300,
      west: -82.4550
    };
    const toMapPosition = coordenadas => {
      try {
        const lat = Number(coordenadas?.lat);
        const lng = Number(coordenadas?.lng);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return {
          _mapX: 50,
          _mapY: 50
        };
        const rawX = (lng - mapBounds.west) / (mapBounds.east - mapBounds.west) * 100;
        const rawY = (mapBounds.north - lat) / (mapBounds.north - mapBounds.south) * 100;
        const clamp = value => Math.max(8, Math.min(92, value));
        return {
          _mapX: clamp(rawX),
          _mapY: clamp(rawY)
        };
      } catch (error) {
        console.error('SearchPage.toMapPosition error:', error);
        return {
          _mapX: 50,
          _mapY: 50
        };
      }
    };
    const results = React.useMemo(() => {
      try {
        const list = MockData.searchBusinesses(query);
        const withPos = list.map(b => ({
          ...b,
          ...toMapPosition(b.coordenadas)
        }));
        return withPos;
      } catch (e) {
        return [];
      }
    }, [query]);
    React.useEffect(() => {
      try {
        if (!results.length) {
          toast?.push({
            title: 'Sin resultados',
            message: 'Prueba con otra palabra o una ubicación más general, por ejemplo “La Habana”.'
          });
        }
      } catch (error) {
        console.error('SearchPage useEffect error:', error);
      }
    }, [results.length]);
    const setQueryParam = (key, value) => {
      try {
        const next = {
          ...(query || {}),
          [key]: value
        };
        onQueryChange?.(next);
        const params = new URLSearchParams();
        if (next.servicio) params.set('servicio', next.servicio);
        if (next.ubicacion) params.set('ubicacion', next.ubicacion);
        window.history.replaceState({}, '', `search.html?${params.toString()}`);
      } catch (error) {
        console.error('SearchPage.setQueryParam error:', error);
      }
    };
    return React.createElement("div", {
      className: "container-rr",
      "data-name": "search-page",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: "flex items-start justify-between gap-4",
      "data-name": "search-head",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      "data-name": "search-titlewrap",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("h1", {
      className: "text-xl md:text-2xl font-semibold tracking-tight",
      "data-name": "search-title",
      "data-file": "pages/search/SearchPage.js"
    }, "Resultados"), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)] mt-1",
      "data-name": "search-sub",
      "data-file": "pages/search/SearchPage.js"
    }, "Desliza los negocios activos y consulta su ubicacion en el mapa.")), React.createElement("div", {
      className: "hidden md:flex items-center gap-2",
      "data-name": "search-meta",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("span", {
      className: "chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]",
      "data-name": "count",
      "data-file": "pages/search/SearchPage.js"
    }, results.length, " negocios"))), React.createElement("div", {
      className: "mt-5 surface-rr p-3 md:p-4",
      "data-name": "search-bar",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-3",
      "data-name": "search-fields",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: "flex items-center gap-3",
      "data-name": "field-serv",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: "w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]",
      "data-name": "field-serv-iw",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: "icon-search text-xl text-[var(--primary-color)]",
      "data-name": "field-serv-i",
      "data-file": "pages/search/SearchPage.js"
    })), React.createElement("div", {
      className: "flex-1",
      "data-name": "field-serv-in",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("label", {
      className: "block text-[11px] text-[var(--text-muted)] mb-1",
      "data-name": "lbl-serv",
      "data-file": "pages/search/SearchPage.js"
    }, "Servicio o curso"), React.createElement("input", {
      className: "input-rr",
      value: query?.servicio || '',
      onChange: e => setQueryParam('servicio', e.target.value),
      placeholder: "Ej: Barber\xEDa, U\xF1as Acr\xEDlicas",
      "data-name": "inp-serv",
      "data-file": "pages/search/SearchPage.js"
    }))), React.createElement("div", {
      className: "flex items-center gap-3",
      "data-name": "field-ubi",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: "w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]",
      "data-name": "field-ubi-iw",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: "icon-map-pin text-xl text-[var(--primary-color)]",
      "data-name": "field-ubi-i",
      "data-file": "pages/search/SearchPage.js"
    })), React.createElement("div", {
      className: "flex-1",
      "data-name": "field-ubi-in",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("label", {
      className: "block text-[11px] text-[var(--text-muted)] mb-1",
      "data-name": "lbl-ubi",
      "data-file": "pages/search/SearchPage.js"
    }, "Ubicaci\xF3n"), React.createElement("input", {
      className: "input-rr",
      value: query?.ubicacion || '',
      onChange: e => setQueryParam('ubicacion', e.target.value),
      placeholder: "Ej: Vedado, La Habana",
      "data-name": "inp-ubi",
      "data-file": "pages/search/SearchPage.js"
    }))))), React.createElement("div", {
      className: "mt-5",
      "data-name": "horizontal-results",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: "flex items-center justify-between gap-3 mb-3",
      "data-name": "active-head",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("p", {
      className: "text-sm font-semibold",
      "data-name": "active-title",
      "data-file": "pages/search/SearchPage.js"
    }, "Negocios activos"), React.createElement("span", {
      className: "md:hidden chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]",
      "data-name": "count-mobile",
      "data-file": "pages/search/SearchPage.js"
    }, results.length, " negocios")), React.createElement("div", {
      className: "flex gap-3 overflow-x-auto no-scrollbar pb-3 snap-x snap-mandatory",
      "data-name": "cards",
      "data-file": "pages/search/SearchPage.js"
    }, !results.length ? React.createElement("div", {
      className: "surface-rr w-full p-6 text-center text-sm text-[var(--text-muted)]",
      "data-name": "empty-active-businesses",
      "data-file": "pages/search/SearchPage.js"
    }, "No hay negocios activos para mostrar.") : null, results.map(b => React.createElement("div", {
      key: b.id,
      className: "min-w-[340px] max-w-[340px] snap-start",
      "data-name": "card-wrap",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement(BusinessCard, {
      business: b,
      onHover: x => setActiveId(x?.id || null),
      active: b.id === activeId,
      "data-name": "card",
      "data-file": "pages/search/SearchPage.js"
    })))), React.createElement("div", {
      className: "mt-4",
      "data-name": "map-area",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: "hidden lg:block surface-rr overflow-hidden h-[520px]",
      "data-name": "map-desktop",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement(MapSplitView, {
      businesses: results,
      activeId: activeId,
      onSelect: b => setActiveId(b?.id || null),
      "data-name": "map",
      "data-file": "pages/search/SearchPage.js"
    })), React.createElement("div", {
      className: "lg:hidden",
      "data-name": "map-mobile",
      "data-file": "pages/search/SearchPage.js"
    }, mobileMap ? React.createElement("div", {
      className: "surface-rr overflow-hidden h-[520px]",
      "data-name": "map-mobile-surface",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement(MapSplitView, {
      businesses: results,
      activeId: activeId,
      onSelect: b => setActiveId(b?.id || null),
      "data-name": "map-m",
      "data-file": "pages/search/SearchPage.js"
    })) : null, React.createElement("div", {
      className: "fixed bottom-5 left-0 right-0 z-[65] flex justify-center px-4",
      "data-name": "map-toggle-wrap",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("button", {
      className: "btn-rr btn-primary-rr flex items-center gap-2 shadow-[0_18px_60px_rgba(11,18,32,0.22)]",
      onClick: () => setMobileMap(v => !v),
      "data-name": "map-toggle",
      "data-file": "pages/search/SearchPage.js"
    }, React.createElement("div", {
      className: `${mobileMap ? 'icon-list' : 'icon-map'} text-xl text-white`,
      "data-name": "map-toggle-i",
      "data-file": "pages/search/SearchPage.js"
    }), React.createElement("span", {
      "data-name": "map-toggle-t",
      "data-file": "pages/search/SearchPage.js"
    }, mobileMap ? 'Ver lista' : 'Ver mapa')))))));
  } catch (error) {
    console.error('SearchPage component error:', error);
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
        "data-file": "search-app.js"
      }, React.createElement("div", {
        className: "text-center max-w-md mx-auto px-6",
        "data-name": "error-state-inner",
        "data-file": "search-app.js"
      }, React.createElement("div", {
        className: "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] mb-5",
        "data-name": "error-icon",
        "data-file": "search-app.js"
      }, React.createElement("div", {
        className: "icon-triangle-alert text-2xl text-[var(--primary-color)]",
        "data-name": "error-icon-i",
        "data-file": "search-app.js"
      })), React.createElement("h1", {
        className: "text-2xl font-semibold text-[var(--text)] mb-2",
        "data-name": "error-title",
        "data-file": "search-app.js"
      }, "Algo sali\xF3 mal"), React.createElement("p", {
        className: "text-sm text-[var(--text-muted)] mb-6",
        "data-name": "error-desc",
        "data-file": "search-app.js"
      }, "Lo sentimos, ocurri\xF3 un error inesperado. Puedes recargar la p\xE1gina."), React.createElement("button", {
        onClick: () => window.location.reload(),
        className: "btn-rr btn-primary-rr",
        "data-name": "error-reload",
        "data-file": "search-app.js"
      }, "Recargar")));
    }
    return this.props.children;
  }
}
function SearchApp() {
  try {
    const [dataReady, setDataReady] = React.useState(false);
    const [dataError, setDataError] = React.useState('');
    const [query, setQuery] = React.useState(() => {
      try {
        return Navigation.getSearchParams();
      } catch (e) {
        return {
          servicio: '',
          ubicacion: ''
        };
      }
    });
    React.useEffect(() => {
      let mounted = true;
      MockData.loadBusinesses().catch(error => {
        const message = MockData.getLoadError() || error.message;
        if (!message.includes('SUPABASE_URL')) console.error('SearchApp.loadBusinesses error:', error);
        if (mounted) setDataError(MockData.getLoadError() || error.message);
      }).finally(() => {
        if (mounted) setDataReady(true);
      });
      return () => {
        mounted = false;
      };
    }, []);
    React.useEffect(() => {
      try {
        const onPop = () => {
          try {
            setQuery(Navigation.getSearchParams());
          } catch (error) {
            console.error('Error al actualizar búsqueda:', error);
          }
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
      } catch (error) {
        console.error('SearchApp useEffect error:', error);
      }
    }, []);
    return React.createElement("div", {
      className: "min-h-screen bg-[var(--bg)]",
      "data-name": "search-app",
      "data-file": "search-app.js"
    }, React.createElement(ToastProvider, {
      "data-name": "toast-provider",
      "data-file": "search-app.js"
    }, React.createElement(Header, {
      currentParams: query,
      "data-name": "header-wrap",
      "data-file": "search-app.js"
    }), React.createElement("main", {
      className: "pt-4 pb-16",
      "data-name": "main",
      "data-file": "search-app.js"
    }, dataError ? React.createElement(DataSourceError, {
      message: dataError,
      "data-name": "data-source-error",
      "data-file": "search-app.js"
    }) : dataReady ? React.createElement(SearchPage, {
      query: query,
      onQueryChange: setQuery,
      "data-name": "search-page",
      "data-file": "search-app.js"
    }) : React.createElement("div", {
      className: "container-rr py-16 text-center text-sm text-[var(--text-muted)]",
      "data-name": "loading",
      "data-file": "search-app.js"
    }, "Cargando negocios...")), React.createElement(Footer, {
      "data-name": "footer",
      "data-file": "search-app.js"
    })));
  } catch (error) {
    console.error('SearchApp component error:', error);
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
      "data-file": "search-app.js"
    }, React.createElement("div", {
      className: "surface-rr max-w-[680px] mx-auto p-6 md:p-8 text-center",
      "data-name": "data-source-error-card",
      "data-file": "search-app.js"
    }, React.createElement("div", {
      className: "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] mb-5",
      "data-name": "data-source-error-icon",
      "data-file": "search-app.js"
    }, React.createElement("div", {
      className: "icon-database-zap text-2xl text-[var(--primary-color)]",
      "data-name": "data-source-error-icon-i",
      "data-file": "search-app.js"
    })), React.createElement("h1", {
      className: "text-2xl font-semibold text-[var(--text)]",
      "data-name": "data-source-error-title",
      "data-file": "search-app.js"
    }, "Base de datos no conectada"), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)] mt-2 leading-relaxed",
      "data-name": "data-source-error-desc",
      "data-file": "search-app.js"
    }, message), React.createElement("p", {
      className: "text-xs text-[var(--text-muted)] mt-4",
      "data-name": "data-source-error-help",
      "data-file": "search-app.js"
    }, "Configura window.SUPABASE_URL y window.SUPABASE_ANON_KEY en utils/supabase-config.js.")));
  } catch (error) {
    console.error('DataSourceError component error:', error);
    return null;
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ErrorBoundary, null, React.createElement(SearchApp, null)));