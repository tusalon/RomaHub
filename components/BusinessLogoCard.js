function BusinessLogoCard({ business, onOpen }) {
  try {
    const b = business;
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();
    const productCount = ((b.categoriasCatalogo || []).find((section) => section.tipo === 'productos')?.items || []).length;
    const courseCount = ((b.categoriasCatalogo || []).find((section) => section.tipo === 'cursos')?.items || []).length;

    return (
      <button
        className="group surface-rr p-0 text-left overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(11,18,32,0.12)] focus:outline-none"
        onClick={() => onOpen?.(b)}
        data-name="business-logo-card"
        data-file="components/BusinessLogoCard.js"
      >
        <div className="relative h-28 bg-[#F9FAFB] flex items-center justify-center p-6" data-name="logo-card-media" data-file="components/BusinessLogoCard.js">
          {b.portadaUrl ? (
            <img loading="lazy" decoding="async" src={b.portadaUrl} alt={`Imagen de ${b.nombre}`} className="absolute inset-0 w-full h-full object-cover opacity-90" data-name="logo-card-cover" data-file="components/BusinessLogoCard.js" />
          ) : null}
          <div className="relative w-16 h-16 rounded-2xl border border-[var(--border)] bg-white overflow-hidden p-2 shadow-sm transition-transform duration-300 group-hover:scale-105" data-name="logo" data-file="components/BusinessLogoCard.js">
            {b.logoUrl ? (
              <img loading="lazy" decoding="async" src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-contain" data-name="logo-img" data-file="components/BusinessLogoCard.js" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#FF1493]" data-name="logo-initials" data-file="components/BusinessLogoCard.js">{initials}</div>
            )}
          </div>
          {b.enRanking ? (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(34,197,94,0.9)] text-white text-[10px] font-semibold shadow-sm" data-name="verified-badge" data-file="components/BusinessLogoCard.js">
              <span>&#10003;</span> Verificado
            </span>
          ) : (
            <span className="absolute top-3 right-3 chip-rr px-2.5 py-1 text-[11px] bg-white text-[var(--text-muted)]" data-name="new-badge" data-file="components/BusinessLogoCard.js">Nuevo</span>
          )}
        </div>

        <div className="p-4" data-name="logo-card-body" data-file="components/BusinessLogoCard.js">
          <p className="text-sm font-semibold leading-snug" data-name="name" data-file="components/BusinessLogoCard.js">{b.nombre}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1" data-name="category" data-file="components/BusinessLogoCard.js">{b.categoria} · {b.ubicacion?.provincia || b.ubicacion?.zona}</p>
          {(productCount || courseCount) ? (
            <div className="mt-3 flex flex-wrap gap-2" data-name="store-flags" data-file="components/BusinessLogoCard.js">
              {productCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="store-flag" data-file="components/BusinessLogoCard.js">Tienda</span> : null}
              {courseCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="course-flag" data-file="components/BusinessLogoCard.js">Cursos</span> : null}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3" data-name="logo-card-bottom" data-file="components/BusinessLogoCard.js">
            {b.estrellas > 0 ? (
              <div className="flex items-center gap-1.5" data-name="rating" data-file="components/BusinessLogoCard.js">
                <div className="icon-star text-base text-[#F59E0B]" data-name="rating-icon" data-file="components/BusinessLogoCard.js"></div>
                <span className="text-xs font-semibold" data-name="rating-val" data-file="components/BusinessLogoCard.js">{Number(b.estrellas).toFixed(1)}</span>
                <span className="text-xs text-[var(--text-muted)]" data-name="rating-total" data-file="components/BusinessLogoCard.js">({b.totalValoraciones || 0})</span>
              </div>
            ) : (
              <span className="text-xs text-[var(--text-muted)]" data-name="no-rating" data-file="components/BusinessLogoCard.js">Sin valoraciones</span>
            )}
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]" data-name="peek" data-file="components/BusinessLogoCard.js">
              <span data-name="peek-text" data-file="components/BusinessLogoCard.js">Ver perfil</span>
              <div className="icon-arrow-right text-base text-[#FF1493]" data-name="peek-icon" data-file="components/BusinessLogoCard.js"></div>
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
