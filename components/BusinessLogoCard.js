function BusinessLogoCard({ business, onOpen }) {
  try {
    const b = business;
    const tier = b.vip ? 'VIP' : 'Free';

    return (
      <button
        className="group surface-rr p-5 text-left transition-transform duration-300 hover:-translate-y-1 hover:bg-[#FDF2F8] hover:shadow-[0_18px_55px_rgba(216,27,96,0.12)] focus:outline-none"
        onClick={() => onOpen?.(b)}
        data-name="business-logo-card"
        data-file="components/BusinessLogoCard.js"
      >
        <div className="flex items-start justify-between gap-4" data-name="logo-card-top" data-file="components/BusinessLogoCard.js">
          <div className="w-12 h-12 rounded-2xl border border-[var(--border)] bg-white overflow-hidden" data-name="logo" data-file="components/BusinessLogoCard.js">
            <img src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-cover" data-name="logo-img" data-file="components/BusinessLogoCard.js" />
          </div>
          <div className={`chip-rr px-3 py-1.5 text-xs ${b.vip ? 'bg-black text-white border-black/30' : 'bg-white text-[var(--text-muted)]'}`} data-name="tier" data-file="components/BusinessLogoCard.js">
            {tier}
          </div>
        </div>

        <div className="mt-4" data-name="logo-card-body" data-file="components/BusinessLogoCard.js">
          <p className="text-sm font-semibold leading-snug" data-name="name" data-file="components/BusinessLogoCard.js">{b.nombre}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1" data-name="category" data-file="components/BusinessLogoCard.js">{b.categoria} · {b.ubicacion?.zona}</p>

          <div className="mt-4 flex items-center justify-between gap-3" data-name="logo-card-bottom" data-file="components/BusinessLogoCard.js">
            <div className="flex items-center gap-2" data-name="rating" data-file="components/BusinessLogoCard.js">
              <div className="icon-star text-base text-[var(--primary-color)]" data-name="rating-icon" data-file="components/BusinessLogoCard.js"></div>
              <span className="text-xs font-semibold" data-name="rating-val" data-file="components/BusinessLogoCard.js">{Number(b.estrellas).toFixed(1)}</span>
              <span className="text-xs text-[var(--text-muted)]" data-name="rating-total" data-file="components/BusinessLogoCard.js">({b.totalReseñas})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" data-name="peek" data-file="components/BusinessLogoCard.js">
              <span data-name="peek-text" data-file="components/BusinessLogoCard.js">Ver detalles</span>
              <div className="icon-arrow-right text-base text-[var(--primary-color)]" data-name="peek-icon" data-file="components/BusinessLogoCard.js"></div>
            </div>
          </div>
        </div>
      </button>
    );
  } catch (error) {
    console.error('BusinessLogoCard component error:', error);
    return null;
  }
}