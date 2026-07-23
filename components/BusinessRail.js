function BusinessRail({ title, subtitle, items, badge, emptyText }) {
  try {
    const list = items || [];
    const ref = React.useRef(null);

    const scrollBy = (dir) => {
      try {
        const el = ref.current;
        if (!el) return;
        el.scrollBy({ left: Math.round(el.clientWidth * 0.82) * dir, behavior: 'smooth' });
      } catch (error) {
        console.error('BusinessRail.scrollBy error:', error);
      }
    };

    return (
      <section className="mt-10" data-name="business-rail" data-file="components/BusinessRail.js">
        <div className="container-rr" data-name="business-rail-inner" data-file="components/BusinessRail.js">
          <div className="flex items-end justify-between gap-4 mb-4" data-name="business-rail-head" data-file="components/BusinessRail.js">
            <div data-name="business-rail-copy" data-file="components/BusinessRail.js">
              {badge ? <span className="kicker-rr block mb-2" data-name="business-rail-badge" data-file="components/BusinessRail.js">{badge}</span> : null}
              <h2 className="text-2xl md:text-[26px] font-extrabold tracking-[-0.02em]" data-name="business-rail-title" data-file="components/BusinessRail.js">{title}</h2>
              {subtitle ? <p className="text-sm text-[var(--text-muted)] mt-1" data-name="business-rail-subtitle" data-file="components/BusinessRail.js">{subtitle}</p> : null}
            </div>
            <div className="hidden md:flex items-center gap-2" data-name="business-rail-controls" data-file="components/BusinessRail.js">
              <button className="w-10 h-10 rounded-lg border border-[var(--border)] bg-white flex items-center justify-center hover:bg-[#F9FAFB]" onClick={() => scrollBy(-1)} aria-label="Anterior" data-name="business-rail-prev" data-file="components/BusinessRail.js">
                <div className="icon-chevron-left text-xl text-[var(--primary-color)]" data-name="business-rail-prev-i" data-file="components/BusinessRail.js"></div>
              </button>
              <button className="w-10 h-10 rounded-lg border border-[var(--border)] bg-white flex items-center justify-center hover:bg-[#F9FAFB]" onClick={() => scrollBy(1)} aria-label="Siguiente" data-name="business-rail-next" data-file="components/BusinessRail.js">
                <div className="icon-chevron-right text-xl text-[var(--primary-color)]" data-name="business-rail-next-i" data-file="components/BusinessRail.js"></div>
              </button>
            </div>
          </div>

          <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar pb-3 snap-x snap-mandatory" data-name="business-rail-track" data-file="components/BusinessRail.js">
            {list.length ? list.map((business, index) => (
              <div key={business.id} className="min-w-[250px] md:min-w-[290px] max-w-[290px] snap-start" data-name="business-rail-item" data-file="components/BusinessRail.js">
                <div className="relative" data-name="business-rail-card-wrap" data-file="components/BusinessRail.js">
                  {index < 3 ? (
                    <span className="absolute z-10 left-3 top-3 inline-flex w-8 h-8 items-center justify-center rounded-lg bg-black text-white text-xs font-semibold shadow-sm" data-name="business-rail-rank" data-file="components/BusinessRail.js">{index + 1}</span>
                  ) : null}
                  <BusinessLogoCard business={business} onOpen={(b) => Navigation.goToBusiness(b.id)} data-name="business-rail-card" data-file="components/BusinessRail.js" />
                </div>
              </div>
            )) : (
              <div className="surface-rr p-5 text-sm text-[var(--text-muted)]" data-name="business-rail-empty" data-file="components/BusinessRail.js">{emptyText || 'No hay negocios para mostrar.'}</div>
            )}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('BusinessRail component error:', error);
    return null;
  }
}
