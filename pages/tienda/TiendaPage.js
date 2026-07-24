function TiendaPage() {
  try {
    const todos = MockData.listShowcaseProducts();
    const [busqueda, setBusqueda] = React.useState('');
    const [tipo, setTipo] = React.useState('todos');

    const normalizar = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    const filtrados = React.useMemo(() => {
      let lista = todos;
      if (tipo !== 'todos') lista = lista.filter((i) => i.tipo === tipo);
      const q = normalizar(busqueda).trim();
      if (q) {
        lista = lista.filter((i) =>
          normalizar(i.nombre).includes(q) ||
          normalizar(i.categoria).includes(q) ||
          normalizar(i.negocioNombre).includes(q)
        );
      }
      return lista;
    }, [todos, tipo, busqueda]);

    const totalProductos = todos.filter((i) => i.tipo === 'producto').length;
    const totalCursos = todos.filter((i) => i.tipo === 'curso').length;

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

    return (
      <div data-name="tienda-page" data-file="pages/tienda/TiendaPage.js">
        <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-muted)]" data-name="tienda-hero" data-file="pages/tienda/TiendaPage.js">
          <div className="hero-blob-rr top-[-140px] right-[-100px]" aria-hidden="true"></div>
          <div className="container-rr relative py-8 md:py-12" data-name="tienda-hero-inner" data-file="pages/tienda/TiendaPage.js">
            <p className="kicker-rr mb-2">Marketplace de belleza</p>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] leading-tight text-[#111827]" data-name="tienda-title" data-file="pages/tienda/TiendaPage.js">
              Productos y cursos de toda Cuba
            </h1>
            <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-xl" data-name="tienda-sub" data-file="pages/tienda/TiendaPage.js">
              Esmaltes, insumos, herramientas y formación — directo de los negocios, sin intermediarios. Compras por WhatsApp con el negocio.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl" data-name="tienda-search" data-file="pages/tienda/TiendaPage.js">
              <input
                className="input-rr flex-1"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto, curso o negocio..."
                data-name="tienda-input"
                data-file="pages/tienda/TiendaPage.js"
              />
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1" data-name="tienda-filtros" data-file="pages/tienda/TiendaPage.js">
              <Chip id="todos">Todo ({todos.length})</Chip>
              <Chip id="producto">Productos ({totalProductos})</Chip>
              <Chip id="curso">Cursos ({totalCursos})</Chip>
            </div>
          </div>
        </section>

        <section className="container-rr py-6 md:py-8" data-name="tienda-grid-wrap" data-file="pages/tienda/TiendaPage.js">
          {filtrados.length ? (
            <React.Fragment>
              <p className="text-sm text-[var(--text-muted)] mb-4" data-name="tienda-count" data-file="pages/tienda/TiendaPage.js">
                {filtrados.length} {filtrados.length === 1 ? 'resultado' : 'resultados'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" data-name="tienda-grid" data-file="pages/tienda/TiendaPage.js">
                {filtrados.map((item) => (
                  <ProductCard key={item.id} item={item} data-name="tienda-item" data-file="pages/tienda/TiendaPage.js" />
                ))}
              </div>
            </React.Fragment>
          ) : (
            <div className="surface-rr p-8 text-center" data-name="tienda-vacia" data-file="pages/tienda/TiendaPage.js">
              <div className="icon-shopping-bag text-4xl text-[var(--primary-color)] opacity-40"></div>
              <p className="mt-3 text-sm font-semibold" data-name="tienda-vacia-t" data-file="pages/tienda/TiendaPage.js">
                {busqueda || tipo !== 'todos' ? 'No encontramos nada con ese filtro' : 'Todavía no hay productos publicados'}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed max-w-sm mx-auto" data-name="tienda-vacia-d" data-file="pages/tienda/TiendaPage.js">
                {busqueda || tipo !== 'todos'
                  ? 'Prueba con otra palabra o quita los filtros.'
                  : '¿Vendes productos o das cursos? Abre tu tienda gratis y aparece aquí.'}
              </p>
              {!busqueda && tipo === 'todos' ? (
                <a className="mt-5 btn-rr btn-primary-rr inline-flex items-center gap-2" href="crear-tienda.html" data-name="tienda-vacia-cta" data-file="pages/tienda/TiendaPage.js">
                  Abrir mi tienda gratis
                  <div className="icon-arrow-right text-xl text-white"></div>
                </a>
              ) : null}
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
