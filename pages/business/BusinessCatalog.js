function BusinessCatalog({ business, onAddToCart }) {
  try {
    const b = business;
    const sections = b.categoriasCatalogo || [];
    const services = (sections.find((cat) => cat.tipo === 'servicios')?.items || [])
      .filter((item) => item && item.nombre);
    const products = (sections.find((cat) => cat.tipo === 'productos')?.items || [])
      .filter((item) => item && item.nombre);
    const courses = (sections.find((cat) => cat.tipo === 'cursos')?.items || [])
      .filter((item) => item && item.nombre);
    const hasStore = products.length || courses.length;

    if (!services.length && !hasStore) {
      return (
        <div className="surface-rr p-5" data-name="empty" data-file="pages/business/BusinessCatalog.js">
          <p className="text-sm text-[var(--text-muted)]" data-name="empty-t" data-file="pages/business/BusinessCatalog.js">
            Este negocio aún no publicó servicios, productos ni cursos.
          </p>
        </div>
      );
    }

    const StoreCard = ({ item, type }) => {
      try {
        const esCurso = type === 'curso';
        return (
          <div className="surface-rr overflow-hidden flex flex-col" data-name="store-card" data-file="pages/business/BusinessCatalog.js">
            <div className="relative aspect-square bg-[#F3F4F6]" data-name="store-image" data-file="pages/business/BusinessCatalog.js">
              {item.imagen ? (
                <img loading="lazy" decoding="async" src={item.imagen} alt={item.nombre} className="absolute inset-0 w-full h-full object-cover" data-name="store-img" data-file="pages/business/BusinessCatalog.js" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center" data-name="store-fallback" data-file="pages/business/BusinessCatalog.js">
                  <div className={`${esCurso ? 'icon-graduation-cap' : 'icon-shopping-bag'} text-3xl text-[var(--primary-color)] opacity-40`}></div>
                </div>
              )}
              {esCurso ? <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#111827] text-white text-[10px] font-bold" data-name="store-type" data-file="pages/business/BusinessCatalog.js">Curso</span> : null}
            </div>
            <div className="p-3 flex flex-col flex-1" data-name="store-copy" data-file="pages/business/BusinessCatalog.js">
              <p className="text-sm font-bold text-[#111827] leading-snug line-clamp-2" data-name="store-name" data-file="pages/business/BusinessCatalog.js">{item.nombre}</p>
              {item.descripcion ? <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed line-clamp-2" data-name="store-description" data-file="pages/business/BusinessCatalog.js">{item.descripcion}</p> : null}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]" data-name="store-meta" data-file="pages/business/BusinessCatalog.js">
                {esCurso && item.ubicacion ? <span data-name="course-place" data-file="pages/business/BusinessCatalog.js">{item.ubicacion}</span> : null}
                {type === 'producto' && Number(item.stock) > 0 ? <span data-name="product-stock" data-file="pages/business/BusinessCatalog.js">Stock: {item.stock}</span> : null}
              </div>
              <p className="mt-2 text-base font-extrabold text-[var(--primary-color)]" data-name="store-price" data-file="pages/business/BusinessCatalog.js">{Format.formatPrecioCUP(item.precio)}</p>
              <button type="button" className="mt-3 btn-rr btn-primary-rr w-full py-2 text-xs inline-flex items-center justify-center gap-1.5" onClick={() => onAddToCart?.(item, type)} data-name="store-add" data-file="pages/business/BusinessCatalog.js">
                <div className="icon-shopping-bag text-sm text-white"></div>
                {esCurso ? 'Agregar curso' : 'Agregar'}
              </button>
            </div>
          </div>
        );
      } catch (error) {
        console.error('BusinessCatalog.StoreCard error:', error);
        return null;
      }
    };

    return (
      <div className="space-y-4" data-name="business-catalog-wrap" data-file="pages/business/BusinessCatalog.js">
        {services.length ? (
          <div className="surface-rr overflow-hidden" data-name="business-services" data-file="pages/business/BusinessCatalog.js">
            <div className="p-4 md:p-5 border-b border-[var(--border)]" data-name="catalog-head" data-file="pages/business/BusinessCatalog.js">
              <h2 className="text-lg font-semibold" data-name="catalog-title" data-file="pages/business/BusinessCatalog.js">Servicios</h2>
            </div>

            <div className="divide-y divide-[var(--border)]" data-name="service-list" data-file="pages/business/BusinessCatalog.js">
              {services.map((service, index) => (
                <div key={`${service.nombre}-${index}`} className="p-4 md:p-5 flex items-start justify-between gap-4 hover:bg-[#F9FAFB]" data-name="service-row" data-file="pages/business/BusinessCatalog.js">
                  <div className="min-w-0" data-name="service-copy" data-file="pages/business/BusinessCatalog.js">
                    <p className="text-sm md:text-base font-semibold leading-snug" data-name="service-name" data-file="pages/business/BusinessCatalog.js">{service.nombre}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]" data-name="service-meta" data-file="pages/business/BusinessCatalog.js">
                      {service.duracionMin ? <span data-name="service-duration" data-file="pages/business/BusinessCatalog.js">{service.duracionMin} min</span> : null}
                      {service.destacado ? <span className="chip-rr px-2 py-0.5" data-name="service-featured" data-file="pages/business/BusinessCatalog.js">Recomendado</span> : null}
                    </div>
                    {service.descripcion ? (
                      <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed" data-name="service-description" data-file="pages/business/BusinessCatalog.js">{service.descripcion}</p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right" data-name="service-price-wrap" data-file="pages/business/BusinessCatalog.js">
                    <p className="text-sm md:text-base font-semibold whitespace-nowrap" data-name="service-price" data-file="pages/business/BusinessCatalog.js">{Format.formatPrecioCUP(service.precio)}</p>
                    <a className="mt-2 btn-rr btn-ghost-rr py-2 px-3 text-xs inline-flex items-center gap-2" href={b.reservaUrl || `https://wa.me/${String(b.whatsapp||'').replace('+','')}?text=${encodeURIComponent(`Hola, quiero reservar ${service.nombre} en ${b.nombre}.`)}`} target="_blank" rel="noopener noreferrer" data-name="service-book" data-file="pages/business/BusinessCatalog.js">
                      Reservar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {products.length ? (
          <div data-name="business-products" data-file="pages/business/BusinessCatalog.js">
            <div className="flex items-center gap-2 mb-3" data-name="products-head" data-file="pages/business/BusinessCatalog.js">
              <h2 className="text-lg font-semibold" data-name="products-title" data-file="pages/business/BusinessCatalog.js">Productos</h2>
              <span className="chip-rr px-2 py-0.5 text-[11px] text-[var(--text-muted)]" data-name="products-count" data-file="pages/business/BusinessCatalog.js">{products.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-name="products-list" data-file="pages/business/BusinessCatalog.js">
              {products.map((item, index) => <StoreCard key={`${item.id || item.nombre}-${index}`} item={item} type="producto" />)}
            </div>
          </div>
        ) : null}

        {courses.length ? (
          <div data-name="business-courses" data-file="pages/business/BusinessCatalog.js">
            <div className="flex items-center gap-2 mb-3" data-name="courses-head" data-file="pages/business/BusinessCatalog.js">
              <h2 className="text-lg font-semibold" data-name="courses-title" data-file="pages/business/BusinessCatalog.js">Cursos</h2>
              <span className="chip-rr px-2 py-0.5 text-[11px] text-[var(--text-muted)]" data-name="courses-count" data-file="pages/business/BusinessCatalog.js">{courses.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-name="courses-list" data-file="pages/business/BusinessCatalog.js">
              {courses.map((item, index) => <StoreCard key={`${item.id || item.nombre}-${index}`} item={item} type="curso" />)}
            </div>
          </div>
        ) : null}
      </div>
    );
  } catch (error) {
    console.error('BusinessCatalog component error:', error);
    return null;
  }
}
