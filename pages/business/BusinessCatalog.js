function BusinessCatalog({ business }) {
  try {
    const b = business;
    const services = ((b.categoriasCatalogo || []).find((cat) => cat.tipo === 'servicios')?.items || [])
      .filter((item) => item && item.nombre);

    if (!services.length) {
      return (
        <div className="surface-rr p-5" data-name="empty" data-file="pages/business/BusinessCatalog.js">
          <p className="text-sm text-[var(--text-muted)]" data-name="empty-t" data-file="pages/business/BusinessCatalog.js">
            Este negocio aun no publico servicios.
          </p>
        </div>
      );
    }

    return (
      <div className="surface-rr overflow-hidden" data-name="business-catalog" data-file="pages/business/BusinessCatalog.js">
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
                <a className="mt-2 btn-rr btn-ghost-rr py-2 px-3 text-xs inline-flex items-center gap-2" href={b.reservaUrl || `https://wa.me/${String(b.whatsapp||'').replace('+','')}?text=${encodeURIComponent(`Hola, quiero reservar ${service.nombre} en ${b.nombre}.`)}`} target="_blank" rel="noreferrer" data-name="service-book" data-file="pages/business/BusinessCatalog.js">
                  Reservar
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('BusinessCatalog component error:', error);
    return null;
  }
}
