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

    const StoreItem = ({ item, type }) => {
      try {
        const label = type === 'curso' ? 'Agregar curso' : 'Agregar';
        return (
          <div className="p-4 md:p-5 grid grid-cols-[72px_1fr_auto] gap-3 items-start hover:bg-[#F9FAFB]" data-name="store-row" data-file="pages/business/BusinessCatalog.js">
            <div className="w-[72px] h-[72px] rounded-lg bg-white border border-[var(--border)] overflow-hidden flex items-center justify-center" data-name="store-image" data-file="pages/business/BusinessCatalog.js">
              {item.imagen ? (
                <img loading="lazy" decoding="async" src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" data-name="store-img" data-file="pages/business/BusinessCatalog.js" />
              ) : (
                <div className="icon-shopping-bag text-2xl text-[var(--primary-color)]" data-name="store-fallback" data-file="pages/business/BusinessCatalog.js"></div>
              )}
            </div>
            <div className="min-w-0" data-name="store-copy" data-file="pages/business/BusinessCatalog.js">
              <p className="text-sm md:text-base font-semibold leading-snug" data-name="store-name" data-file="pages/business/BusinessCatalog.js">{item.nombre}</p>
              {item.descripcion ? <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed" data-name="store-description" data-file="pages/business/BusinessCatalog.js">{item.descripcion}</p> : null}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]" data-name="store-meta" data-file="pages/business/BusinessCatalog.js">
                {type === 'curso' && item.ubicacion ? <span data-name="course-place" data-file="pages/business/BusinessCatalog.js">{item.ubicacion}</span> : null}
                {type === 'producto' && Number(item.stock) > 0 ? <span data-name="product-stock" data-file="pages/business/BusinessCatalog.js">Stock: {item.stock}</span> : null}
              </div>
            </div>
            <div className="shrink-0 text-right" data-name="store-actions" data-file="pages/business/BusinessCatalog.js">
              <p className="text-sm md:text-base font-semibold whitespace-nowrap" data-name="store-price" data-file="pages/business/BusinessCatalog.js">{Format.formatPrecioCUP(item.precio)}</p>
              <button type="button" className="mt-2 btn-rr btn-primary-rr py-2 px-3 text-xs inline-flex items-center gap-2" onClick={() => onAddToCart?.(item, type)} data-name="store-add" data-file="pages/business/BusinessCatalog.js">
                {label}
              </button>
            </div>
          </div>
        );
      } catch (error) {
        console.error('BusinessCatalog.StoreItem error:', error);
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
          <div className="surface-rr overflow-hidden" data-name="business-products" data-file="pages/business/BusinessCatalog.js">
            <div className="p-4 md:p-5 border-b border-[var(--border)]" data-name="products-head" data-file="pages/business/BusinessCatalog.js">
              <h2 className="text-lg font-semibold" data-name="products-title" data-file="pages/business/BusinessCatalog.js">Productos</h2>
            </div>
            <div className="divide-y divide-[var(--border)]" data-name="products-list" data-file="pages/business/BusinessCatalog.js">
              {products.map((item, index) => <StoreItem key={`${item.id || item.nombre}-${index}`} item={item} type="producto" />)}
            </div>
          </div>
        ) : null}

        {courses.length ? (
          <div className="surface-rr overflow-hidden" data-name="business-courses" data-file="pages/business/BusinessCatalog.js">
            <div className="p-4 md:p-5 border-b border-[var(--border)]" data-name="courses-head" data-file="pages/business/BusinessCatalog.js">
              <h2 className="text-lg font-semibold" data-name="courses-title" data-file="pages/business/BusinessCatalog.js">Cursos</h2>
            </div>
            <div className="divide-y divide-[var(--border)]" data-name="courses-list" data-file="pages/business/BusinessCatalog.js">
              {courses.map((item, index) => <StoreItem key={`${item.id || item.nombre}-${index}`} item={item} type="curso" />)}
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
