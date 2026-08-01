function TiendaPage() {
  try {
    const tiendas = MockData.listRomaStores();
    const articulos = MockData.listShowcaseProducts();
    const negocioId = new URLSearchParams(window.location.search).get('negocio') || '';
    const tiendaActual = tiendas.find((tienda) => String(tienda.id) === String(negocioId)) || null;
    const [busqueda, setBusqueda] = React.useState('');
    const [tipo, setTipo] = React.useState('todos');

    const normalizar = (texto) => String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const conteosPorTienda = React.useMemo(() => articulos.reduce((resultado, articulo) => {
      const id = String(articulo.negocioId || '');
      if (!resultado[id]) resultado[id] = { productos: 0, cursos: 0, total: 0 };
      if (articulo.tipo === 'curso') resultado[id].cursos += 1;
      else resultado[id].productos += 1;
      resultado[id].total += 1;
      return resultado;
    }, {}), [articulos]);

    const tiendasFiltradas = React.useMemo(() => {
      const consulta = normalizar(busqueda).trim();
      if (!consulta) return tiendas;
      return tiendas.filter((tienda) => normalizar([
        tienda.nombre,
        tienda.categoria,
        tienda.ubicacionCorta,
        tienda.ubicacion?.provincia,
        tienda.ubicacion?.municipio
      ].filter(Boolean).join(' ')).includes(consulta));
    }, [tiendas, busqueda]);

    const articulosTienda = React.useMemo(() => articulos.filter(
      (articulo) => String(articulo.negocioId) === String(negocioId)
    ), [articulos, negocioId]);

    const articulosFiltrados = React.useMemo(() => {
      let lista = articulosTienda;
      if (tipo !== 'todos') lista = lista.filter((articulo) => articulo.tipo === tipo);
      const consulta = normalizar(busqueda).trim();
      if (consulta) {
        lista = lista.filter((articulo) => normalizar([
          articulo.nombre,
          articulo.categoria,
          articulo.descripcion
        ].filter(Boolean).join(' ')).includes(consulta));
      }
      return lista;
    }, [articulosTienda, tipo, busqueda]);

    const StoreCard = ({ tienda }) => {
      const conteos = conteosPorTienda[String(tienda.id)] || { productos: 0, cursos: 0, total: 0 };
      const iniciales = String(tienda.nombre || 'T').trim().slice(0, 2).toUpperCase();
      const href = `tienda.html?negocio=${encodeURIComponent(tienda.id)}`;

      return (
        <article className="surface-rr card-lift-rr overflow-hidden flex flex-col" data-name="store-card" data-file="pages/tienda/TiendaPage.js">
          <a href={href} className="group block" aria-label={`Entrar a la tienda ${tienda.nombre}`}>
            <div className="relative h-36 sm:h-40 overflow-hidden bg-[var(--bg-muted)]">
              {tienda.portadaUrl ? (
                <img
                  loading="lazy"
                  decoding="async"
                  src={tienda.portadaUrl}
                  alt={`Portada de ${tienda.nombre}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: `${tienda.portadaPosicion?.x ?? 50}% ${tienda.portadaPosicion?.y ?? 50}%` }}
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${tienda.esRservasroma ? 'bg-[#261D29] text-white' : 'bg-white/95 text-[var(--primary-color)]'}`}>
                {tienda.esRservasroma ? '💎 VIP RservasRoma' : 'Tienda gratis'}
              </span>
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-green-700 shadow-sm">Tienda activa</span>
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl border-2 border-white bg-white overflow-hidden shadow-md shrink-0 -mt-9 relative z-10">
                  {tienda.logoUrl ? (
                    <img src={tienda.logoUrl} alt={`Logo de ${tienda.nombre}`} className="w-full h-full object-contain" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-extrabold text-[var(--primary-color)] bg-[var(--secondary-color)]">{iniciales}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-[#261D29] leading-snug truncate">{tienda.nombre}</h2>
                  <p className="mt-1 text-xs text-[var(--text-muted)] truncate">{[tienda.categoria, tienda.ubicacionCorta].filter(Boolean).join(' · ')}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {conteos.productos ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]">{conteos.productos} {conteos.productos === 1 ? 'producto' : 'productos'}</span> : null}
                {conteos.cursos ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]">{conteos.cursos} {conteos.cursos === 1 ? 'curso' : 'cursos'}</span> : null}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-sm font-bold text-[var(--primary-color)]">
                <span>Ver productos</span>
                <span className="icon-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1"></span>
              </div>
            </div>
          </a>
        </article>
      );
    };

    const Chip = ({ id, children }) => (
      <button
        type="button"
        onClick={() => setTipo(id)}
        className={`btn-rr py-2 px-4 text-sm whitespace-nowrap ${tipo === id ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
        data-name={`filtro-${id}`}
        data-file="pages/tienda/TiendaPage.js"
      >
        {children}
      </button>
    );

    if (negocioId && !tiendaActual) {
      return (
        <section className="container-rr py-16 text-center" data-name="store-not-found" data-file="pages/tienda/TiendaPage.js">
          <div className="surface-rr p-8 max-w-lg mx-auto">
            <span className="icon-store text-4xl text-[var(--primary-color)] opacity-50"></span>
            <h1 className="mt-3 text-2xl font-semibold">Esta tienda todavía no está disponible</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Puede estar preparando su primer producto o curso.</p>
            <a href="tienda.html" className="mt-5 btn-rr btn-primary-rr inline-flex">Ver tiendas activas</a>
          </div>
        </section>
      );
    }

    if (tiendaActual) {
      const conteos = conteosPorTienda[String(tiendaActual.id)] || { productos: 0, cursos: 0, total: 0 };
      return (
        <div data-name="store-detail" data-file="pages/tienda/TiendaPage.js">
          <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-muted)]">
            <div className="container-rr py-6 md:py-9">
              <a href="tienda.html" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary-color)] hover:underline">
                <span className="icon-arrow-left"></span>
                Todas las tiendas
              </a>

              <div className="mt-5 surface-rr overflow-hidden">
                <div className="relative h-40 md:h-52 bg-[var(--bg-muted)]">
                  {tiendaActual.portadaUrl ? (
                    <img src={tiendaActual.portadaUrl} alt={`Portada de ${tiendaActual.nombre}`} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: `${tiendaActual.portadaPosicion?.x ?? 50}% ${tiendaActual.portadaPosicion?.y ?? 50}%` }} />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"></div>
                  <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold shadow-sm">Tienda activa</span>
                </div>

                <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white bg-white overflow-hidden shadow-lg shrink-0 -mt-14 relative z-10">
                    {tiendaActual.logoUrl ? <img src={tiendaActual.logoUrl} alt={`Logo de ${tiendaActual.nombre}`} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-xl font-extrabold text-[var(--primary-color)] bg-[var(--secondary-color)]">{String(tiendaActual.nombre).trim().slice(0, 2).toUpperCase()}</div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl md:text-3xl name-rr">{tiendaActual.nombre}</h1>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${tiendaActual.esRservasroma ? 'bg-[#261D29] text-white' : 'bg-[var(--secondary-color)] text-[var(--primary-color)]'}`}>{tiendaActual.esRservasroma ? '💎 VIP' : 'Tienda gratis'}</span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{[tiendaActual.categoria, tiendaActual.ubicacionCorta].filter(Boolean).join(' · ')}</p>
                    {tiendaActual.descripcion ? <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)] max-w-2xl">{tiendaActual.descripcion}</p> : null}
                  </div>
                  <a href={`business.html?id=${encodeURIComponent(tiendaActual.id)}`} className="btn-rr btn-ghost-rr inline-flex items-center justify-center gap-2 shrink-0">Ver perfil completo <span className="icon-arrow-right"></span></a>
                </div>
              </div>
            </div>
          </section>

          <section className="container-rr py-6 md:py-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
              <div>
                <p className="kicker-rr">Catálogo de la tienda</p>
                <h2 className="mt-1 text-2xl font-semibold">Productos y cursos</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{conteos.total} {conteos.total === 1 ? 'artículo disponible' : 'artículos disponibles'}</p>
              </div>
              <input className="input-rr w-full lg:max-w-sm" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar dentro de esta tienda..." />
            </div>

            <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <Chip id="todos">Todo ({conteos.total})</Chip>
              <Chip id="producto">Productos ({conteos.productos})</Chip>
              <Chip id="curso">Cursos ({conteos.cursos})</Chip>
            </div>

            {articulosFiltrados.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" data-name="store-products-grid">
                {articulosFiltrados.map((articulo) => <ProductCard key={`${articulo.tipo}-${articulo.id}`} item={articulo} />)}
              </div>
            ) : (
              <div className="surface-rr p-8 text-center">
                <span className="icon-search text-4xl text-[var(--primary-color)] opacity-40"></span>
                <p className="mt-3 text-sm font-semibold">No encontramos productos con ese filtro</p>
                <button type="button" className="mt-4 btn-rr btn-ghost-rr" onClick={() => { setBusqueda(''); setTipo('todos'); }}>Limpiar filtros</button>
              </div>
            )}
          </section>
        </div>
      );
    }

    return (
      <div data-name="stores-directory" data-file="pages/tienda/TiendaPage.js">
        <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-muted)]">
          <div className="hero-blob-rr top-[-140px] right-[-100px]" aria-hidden="true"></div>
          <div className="container-rr relative py-8 md:py-12">
            <p className="kicker-rr mb-2">Marketplace de belleza</p>
            <h1 className="h-section-rr">Tiendas de belleza de toda Cuba</h1>
            <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-xl">Primero elige una tienda. Dentro encontrarás sus productos, cursos, precios y contacto directo por WhatsApp.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <input className="input-rr flex-1" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar tienda, categoría o ubicación..." />
              <a href="register.html" className="btn-rr btn-primary-rr inline-flex items-center justify-center gap-2 whitespace-nowrap">Abrir tienda gratis <span className="icon-arrow-right text-lg"></span></a>
            </div>
          </div>
        </section>

        <section className="container-rr py-6 md:py-8">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="kicker-rr">Elige dónde comprar</p>
              <h2 className="mt-1 text-2xl font-semibold">Tiendas activas</h2>
            </div>
            <span className="text-sm text-[var(--text-muted)]">{tiendasFiltradas.length} {tiendasFiltradas.length === 1 ? 'tienda' : 'tiendas'}</span>
          </div>

          {tiendasFiltradas.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-name="stores-grid">
              {tiendasFiltradas.map((tienda) => <StoreCard key={tienda.id} tienda={tienda} />)}
            </div>
          ) : (
            <div className="surface-rr p-8 text-center">
              <span className="icon-store text-4xl text-[var(--primary-color)] opacity-40"></span>
              <p className="mt-3 text-sm font-semibold">No encontramos una tienda con ese nombre</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Prueba con otra palabra, categoría, provincia o municipio.</p>
              <button type="button" className="mt-4 btn-rr btn-ghost-rr" onClick={() => setBusqueda('')}>Limpiar búsqueda</button>
            </div>
          )}
        </section>
      </div>
    );
  } catch (error) {
    console.error('TiendaPage component error:', error);
    return null;
  }
}
