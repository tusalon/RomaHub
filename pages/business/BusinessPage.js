function BusinessPage({ business }) {
  try {
    const b = business;
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();

    return (
      <div data-name="business-page" data-file="pages/business/BusinessPage.js">
        <BusinessHeader business={b} data-name="business-header" data-file="pages/business/BusinessPage.js" />

        <div className="container-rr mt-5 md:mt-7" data-name="business-content" data-file="pages/business/BusinessPage.js">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start" data-name="business-grid" data-file="pages/business/BusinessPage.js">
            <div data-name="left" data-file="pages/business/BusinessPage.js">
              <BusinessCatalog business={b} data-name="catalog" data-file="pages/business/BusinessPage.js" />
              <BusinessReviews business={b} data-name="reviews" data-file="pages/business/BusinessPage.js" />
            </div>

            <aside className="hidden lg:block sticky top-[92px]" data-name="right" data-file="pages/business/BusinessPage.js">
              <div className="surface-rr p-5" data-name="contact-card" data-file="pages/business/BusinessPage.js">
                <div className="flex items-center gap-3" data-name="contact-top" data-file="pages/business/BusinessPage.js">
                  <div className="w-12 h-12 rounded-lg border border-[var(--border)] bg-white overflow-hidden p-1.5" data-name="contact-logo" data-file="pages/business/BusinessPage.js">
                    {b.logoUrl ? (
                      <img src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-contain" data-name="contact-logo-img" data-file="pages/business/BusinessPage.js" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[var(--primary-color)]" data-name="contact-logo-initials" data-file="pages/business/BusinessPage.js">{initials}</div>
                    )}
                  </div>
                  <div className="min-w-0" data-name="contact-copy" data-file="pages/business/BusinessPage.js">
                    <p className="text-sm font-semibold truncate" data-name="contact-name" data-file="pages/business/BusinessPage.js">{b.nombre}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate" data-name="contact-area" data-file="pages/business/BusinessPage.js">{b.ubicacion?.zona || b.ubicacion?.ciudad}</p>
                  </div>
                </div>

                <div className="divider-rr my-4" data-name="contact-div" data-file="pages/business/BusinessPage.js"></div>

                <a
                  className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2"
                  href={b.reservaUrl || `https://wa.me/${String(b.whatsapp||'').replace('+','')}?text=${encodeURIComponent(`Hola, quiero reservar en ${b.nombre}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  data-name="sticky-wa"
                  data-file="pages/business/BusinessPage.js"
                >
                  <div className="icon-message-circle text-xl text-white" data-name="sticky-wa-i" data-file="pages/business/BusinessPage.js"></div>
                  Reservar
                </a>
              </div>
            </aside>
          </div>
        </div>

        <MobileWhatsAppBar whatsapp={b.whatsapp} nombre={b.nombre} reservaUrl={b.reservaUrl} data-name="wa" data-file="pages/business/BusinessPage.js" />
      </div>
    );
  } catch (error) {
    console.error('BusinessPage component error:', error);
    return null;
  }
}
