const MockData = (() => {
  const businesses = [
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
      totalReseñas: 212,
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
      reseñas: [
        { id: 'r1', nombre: 'Camila', estrellas: 5, verificada: true, texto: 'Atención impecable y un acabado súper fino. Se nota el nivel.', fecha: '2026-03-22' },
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
      totalReseñas: 154,
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
      reseñas: [
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
      totalReseñas: 98,
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
      reseñas: [
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
      totalReseñas: 41,
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
      reseñas: [
        { id: 'r8', nombre: 'Yusniel', estrellas: 5, verificada: false, texto: 'Muy buena explicación y práctica real.', fecha: '2026-01-23' }
      ]
    }
  ];

  function listBusinesses() {
    return businesses.slice();
  }

  function listTopRated() {
    return businesses
      .slice()
      .filter((b) => b.totalReseñas >= 40)
      .sort((a, b) => b.estrellas - a.estrellas)
      .slice(0, 8);
  }

  function getBusinessById(id) {
    const found = businesses.find((b) => b.id === id);
    return found || businesses[0];
  }

  function searchBusinesses(query) {
    const q = query || { servicio: '', ubicacion: '' };
    const servicio = String(q.servicio || '').toLowerCase();
    const ubicacion = String(q.ubicacion || '').toLowerCase();

    return businesses.filter((b) => {
      const hayServicio = !servicio
        ? true
        : [b.nombre, b.categoria, b.descripcion]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(servicio));

      const hayUbicacion = !ubicacion
        ? true
        : [b.ubicacion?.ciudad, b.ubicacion?.zona, b.ubicacion?.direccion]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(ubicacion));

      return hayServicio && hayUbicacion;
    });
  }

  return { listBusinesses, listTopRated, searchBusinesses, getBusinessById };
})();