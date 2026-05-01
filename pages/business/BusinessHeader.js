function BusinessHeader({ business }) {
  try {
    const b = business;
    const hasCover = Boolean(b.portadaUrl);
    const services = (b.categoriasCatalogo || []).find((section) => section.tipo === 'servicios')?.items || [];
    const firstPrice = services[0] ? Format.formatPrecioCUP(services[0].precio) : Format.formatRangoPrecio(b.rangoPrecio?.min, b.rangoPrecio?.max);
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();

    return (
      <section className="bg-white border-b border-[var(--border)]" data-name="business-header" data-file="pages/business/BusinessHeader.js">
        <div className="container-rr py-5 md:py-7" data-name="header-wrap" data-file="pages/business/BusinessHeader.js">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_auto] gap-5 items-center" data-name="header-grid" data-file="pages/business/BusinessHeader.js">
            <div className="relative h-[180px] lg:h-[160px] rounded-lg overflow-hidden border border-[var(--border)] bg-[#F9FAFB]" data-name="brand-media" data-file="pages/business/BusinessHeader.js">
              {hasCover ? (
                <img src={b.portadaUrl} alt={`Imagen de ${b.nombre}`} className="w-full h-full object-cover" data-name="cover-img" data-file="pages/business/BusinessHeader.js" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8" data-name="logo-only" data-file="pages/business/BusinessHeader.js">
                  {b.logoUrl ? (
                    <img src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="max-w-full max-h-full object-contain" data-name="logo-only-img" data-file="pages/business/BusinessHeader.js" />
                  ) : (
                    <div className="text-4xl font-semibold text-[var(--primary-color)]" data-name="logo-only-initials" data-file="pages/business/BusinessHeader.js">{initials}</div>
                  )}
                </div>
              )}
              <div className="absolute left-3 bottom-3 w-16 h-16 rounded-lg overflow-hidden bg-white border border-white shadow-sm p-2" data-name="logo" data-file="pages/business/BusinessHeader.js">
                {b.logoUrl ? (
                  <img src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-contain" data-name="logo-img" data-file="pages/business/BusinessHeader.js" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-[var(--primary-color)]" data-name="logo-initials" data-file="pages/business/BusinessHeader.js">{initials}</div>
                )}
              </div>
            </div>

            <div className="min-w-0" data-name="header-copy" data-file="pages/business/BusinessHeader.js">
              <div className="flex flex-wrap items-center gap-2" data-name="title-row" data-file="pages/business/BusinessHeader.js">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight" data-name="name" data-file="pages/business/BusinessHeader.js">{b.nombre}</h1>
                {b.vip ? <Badge type="vip" text="VIP" data-name="vip" data-file="pages/business/BusinessHeader.js" /> : null}
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2" data-name="meta" data-file="pages/business/BusinessHeader.js">
                {b.categoria} · {b.ubicacion?.zona || b.ubicacion?.ciudad}
              </p>
              {b.ubicacion?.direccion ? (
                <p className="text-sm text-[var(--text-muted)] mt-1" data-name="address" data-file="pages/business/BusinessHeader.js">{b.ubicacion.direccion}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2" data-name="quick-facts" data-file="pages/business/BusinessHeader.js">
                <span className="chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="services-count" data-file="pages/business/BusinessHeader.js">{services.length} servicios</span>
                <span className="chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="first-price" data-file="pages/business/BusinessHeader.js">Desde {firstPrice}</span>
              </div>
            </div>

            <div className="w-full lg:w-[230px]" data-name="header-action" data-file="pages/business/BusinessHeader.js">
              <a className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" href={b.reservaUrl || `https://wa.me/${String(b.whatsapp||'').replace('+','')}?text=${encodeURIComponent(`Hola, quiero reservar en ${b.nombre}. Tienen disponibilidad?`)}`} target="_blank" rel="noreferrer" data-name="cta-wa" data-file="pages/business/BusinessHeader.js">
                <div className="icon-message-circle text-xl text-white" data-name="cta-wa-i" data-file="pages/business/BusinessHeader.js"></div>
                Reservar
              </a>
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
