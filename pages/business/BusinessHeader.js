function BusinessHeader({ business }) {
  try {
    const b = business;
    const hasCover = Boolean(b.portadaUrl);
    const catalog = b.categoriasCatalogo || [];
    const services = catalog.find((section) => section.tipo === 'servicios')?.items || [];
    const products = catalog.find((section) => section.tipo === 'productos')?.items || [];
    const courses = catalog.find((section) => section.tipo === 'cursos')?.items || [];
    const firstPrice = services[0] ? Format.formatPrecioCUP(services[0].precio, services[0].moneda) : Format.formatRangoPrecio(b.rangoPrecio?.min, b.rangoPrecio?.max, b.rangoPrecio?.moneda);
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();

    return (
      <section className="bg-white border-b border-[var(--border)]" data-name="business-header" data-file="pages/business/BusinessHeader.js">
        <div className="container-rr py-5 md:py-7" data-name="header-wrap" data-file="pages/business/BusinessHeader.js">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_auto] gap-5 items-center" data-name="header-grid" data-file="pages/business/BusinessHeader.js">
            <div className="relative h-[180px] lg:h-[160px] rounded-lg overflow-hidden border border-[var(--border)] bg-[#F9FAFB]" data-name="brand-media" data-file="pages/business/BusinessHeader.js">
              {hasCover ? (
                <img
                  loading="lazy"
                  decoding="async"
                  src={b.portadaUrl}
                  alt={`Imagen de ${b.nombre}`}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `${b.portadaPosicion?.x ?? 50}% ${b.portadaPosicion?.y ?? 50}%` }}
                  data-name="cover-img"
                  data-file="pages/business/BusinessHeader.js"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8" data-name="logo-only" data-file="pages/business/BusinessHeader.js">
                  {b.logoUrl ? (
                    <img loading="lazy" decoding="async" src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="max-w-full max-h-full object-contain" data-name="logo-only-img" data-file="pages/business/BusinessHeader.js" />
                  ) : (
                    <div className="text-4xl font-semibold text-[var(--primary-color)]" data-name="logo-only-initials" data-file="pages/business/BusinessHeader.js">{initials}</div>
                  )}
                </div>
              )}
              <div className="absolute left-3 bottom-3 w-16 h-16 rounded-lg overflow-hidden bg-white border border-white shadow-sm p-2" data-name="logo" data-file="pages/business/BusinessHeader.js">
                {b.logoUrl ? (
                  <img loading="lazy" decoding="async" src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-contain" data-name="logo-img" data-file="pages/business/BusinessHeader.js" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-[var(--primary-color)]" data-name="logo-initials" data-file="pages/business/BusinessHeader.js">{initials}</div>
                )}
              </div>
            </div>

            <div className="min-w-0" data-name="header-copy" data-file="pages/business/BusinessHeader.js">
              <div className="flex flex-wrap items-center gap-2" data-name="title-row" data-file="pages/business/BusinessHeader.js">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight" data-name="name" data-file="pages/business/BusinessHeader.js">{b.nombre}</h1>
                {b.esRservasroma ? <span className="text-xl" title="Verificado · reserva online" data-name="diamond-badge" data-file="pages/business/BusinessHeader.js">💎</span> : null}
                {b.vip ? <Badge type="vip" text="VIP" data-name="vip" data-file="pages/business/BusinessHeader.js" /> : null}
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2" data-name="meta" data-file="pages/business/BusinessHeader.js">
                {[b.categoria, b.ubicacionCorta || b.ubicacion?.zona || b.ubicacion?.ciudad].filter(Boolean).join(' · ')}
              </p>
              {b.descripcion ? (
                <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed max-w-[720px]" data-name="business-description" data-file="pages/business/BusinessHeader.js">{b.descripcion}</p>
              ) : null}
              {b.ubicacion?.direccion ? (
                <p className="text-sm text-[var(--text-muted)] mt-1 flex items-start gap-1.5" data-name="address" data-file="pages/business/BusinessHeader.js">
                  <span className="icon-map-pin text-base text-[var(--primary-color)] shrink-0" aria-hidden="true" data-name="address-i" data-file="pages/business/BusinessHeader.js"></span>
                  <span data-name="address-text" data-file="pages/business/BusinessHeader.js">{b.ubicacion.direccion}</span>
                </p>
              ) : null}
              {/* El horario va aqui y no en la columna lateral: esa columna es
                  hidden lg:block, y en el movil es justo donde mas falta hace. */}
              {b.horario ? (
                <p className="text-sm text-[var(--text-muted)] mt-1 flex items-start gap-1.5" data-name="horario" data-file="pages/business/BusinessHeader.js">
                  <span className="icon-clock text-base text-[var(--primary-color)] shrink-0" aria-hidden="true" data-name="horario-i" data-file="pages/business/BusinessHeader.js"></span>
                  <span data-name="horario-text" data-file="pages/business/BusinessHeader.js">{b.horario}</span>
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2" data-name="quick-facts" data-file="pages/business/BusinessHeader.js">
                {services.length ? <span className="chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="services-count" data-file="pages/business/BusinessHeader.js">{services.length} servicios</span> : <span className="chip-rr px-3 py-1.5 text-xs text-[var(--primary-color)]" data-name="services-upcoming" data-file="pages/business/BusinessHeader.js">Próximamente · preparando servicios</span>}
                {products.length ? <span className="chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="products-count" data-file="pages/business/BusinessHeader.js">{products.length} productos</span> : null}
                {courses.length ? <span className="chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="courses-count" data-file="pages/business/BusinessHeader.js">{courses.length} cursos</span> : null}
                {services.length ? <span className="chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="first-price" data-file="pages/business/BusinessHeader.js">Desde {firstPrice}</span> : null}
              </div>
            </div>

            <div className="w-full lg:w-[230px] space-y-2" data-name="header-action" data-file="pages/business/BusinessHeader.js">
              {!b.esTiendaExterna && services.length ? (
                <a className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" href={b.reservaUrl || `https://wa.me/${String(b.whatsapp||'').replace('+','')}?text=${encodeURIComponent(`Hola, quiero reservar en ${b.nombre}. Tienen disponibilidad?`)}`} target="_blank" rel="noopener noreferrer" data-name="cta-wa" data-file="pages/business/BusinessHeader.js">
                  <div className="icon-message-circle text-xl text-white" data-name="cta-wa-i" data-file="pages/business/BusinessHeader.js"></div>
                  Reservar
                </a>
              ) : null}
              <ShareBusiness businessId={b.id} businessName={b.nombre} compact={true} />
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('BusinessHeader component error:', error);
    return null;
  }
}
