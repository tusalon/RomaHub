function BusinessLogoCard({ business, onOpen }) {
  try {
    const b = business;
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();
    const productCount = ((b.categoriasCatalogo || []).find((section) => section.tipo === 'productos')?.items || []).length;
    const courseCount = ((b.categoriasCatalogo || []).find((section) => section.tipo === 'cursos')?.items || []).length;
    const favoriteEntry = window.RomaSaved?.businessEntry?.(b);

    return (
      <article className="relative h-full" data-name="business-logo-card-wrap">
        {favoriteEntry ? <FavoriteButton entry={favoriteEntry} className="absolute top-3 right-3 z-20" /> : null}
        <button
          className="group surface-rr card-lift-rr p-0 text-left overflow-hidden focus:outline-none w-full h-full"
          onClick={() => onOpen?.(b)}
          data-name="business-logo-card"
          data-file="components/BusinessLogoCard.js"
        >
        <div className="relative h-36 overflow-hidden bg-[#F6EEE6]" data-name="logo-card-media" data-file="components/BusinessLogoCard.js">
          {b.portadaUrl ? (
            <img loading="lazy" decoding="async" src={b.portadaUrl} alt={`Imagen de ${b.nombre}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" style={{ objectPosition: `${b.portadaPosicion?.x ?? 50}% ${b.portadaPosicion?.y ?? 50}%` }} data-name="logo-card-cover" data-file="components/BusinessLogoCard.js" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" data-name="logo-card-gradient" data-file="components/BusinessLogoCard.js"></div>

          {b.enRanking ? (
            <span className="absolute top-3 right-14 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1F8654] text-white text-[10px] font-bold shadow-[0_4px_12px_rgba(31,134,84,0.35)]" data-name="verified-badge" data-file="components/BusinessLogoCard.js">
              <span>&#10003;</span> Bien valorado
            </span>
          ) : (
            <span className="absolute top-3 right-14 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-semibold text-[var(--text-muted)] shadow-sm" data-name="new-badge" data-file="components/BusinessLogoCard.js">Nuevo</span>
          )}

          {b.estrellas > 0 ? (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-bold shadow-sm" data-name="rating-pill" data-file="components/BusinessLogoCard.js">
              <div className="icon-star text-sm text-[#F59E0B]" data-name="rating-pill-icon" data-file="components/BusinessLogoCard.js"></div>
              {Number(b.estrellas).toFixed(1)}
            </span>
          ) : null}
        </div>

        <div className="px-4 pb-4" data-name="logo-card-body" data-file="components/BusinessLogoCard.js">
          <div className="w-14 h-14 rounded-2xl border-[3px] border-white bg-white overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.15)] -mt-8 relative z-10 transition-transform duration-300 group-hover:scale-105" data-name="logo" data-file="components/BusinessLogoCard.js">
            {b.logoUrl ? (
              <img loading="lazy" decoding="async" src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-contain" data-name="logo-img" data-file="components/BusinessLogoCard.js" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#681831] bg-[var(--secondary-color)]" data-name="logo-initials" data-file="components/BusinessLogoCard.js">{initials}</div>
            )}
          </div>

          <p className="mt-2.5 text-sm font-bold text-[#261D29] leading-snug line-clamp-2 flex items-center gap-1" data-name="name" data-file="components/BusinessLogoCard.js">
            <span className="truncate">{b.nombre}</span>
            <InsigniaTienda tipo={b.insignia} data-name="diamond-badge" data-file="components/BusinessLogoCard.js" />
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1" data-name="category" data-file="components/BusinessLogoCard.js">{[b.categoria, b.ubicacionCorta || b.ubicacion?.zona].filter(Boolean).join(' · ')}</p>

          {(productCount || courseCount) ? (
            <div className="mt-3 flex flex-wrap gap-2" data-name="store-flags" data-file="components/BusinessLogoCard.js">
              {productCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="store-flag" data-file="components/BusinessLogoCard.js">Tienda</span> : null}
              {courseCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="course-flag" data-file="components/BusinessLogoCard.js">Cursos</span> : null}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3" data-name="logo-card-bottom" data-file="components/BusinessLogoCard.js">
            {b.estrellas > 0 ? (
              <span className="text-xs text-[var(--text-muted)]" data-name="rating-total" data-file="components/BusinessLogoCard.js">{b.totalValoraciones} {b.totalValoraciones === 1 ? 'valoracion' : 'valoraciones'}</span>
            ) : (
              <span className="text-xs text-[var(--text-muted)]" data-name="no-rating" data-file="components/BusinessLogoCard.js">Sin valoraciones</span>
            )}
            <div className="flex items-center gap-1 text-xs font-semibold text-[#681831]" data-name="peek" data-file="components/BusinessLogoCard.js">
              <span data-name="peek-text" data-file="components/BusinessLogoCard.js">Ver perfil</span>
              <div className="icon-arrow-right text-base transition-transform duration-300 group-hover:translate-x-0.5" data-name="peek-icon" data-file="components/BusinessLogoCard.js"></div>
            </div>
          </div>
        </div>
        </button>
      </article>
    );
  } catch (error) {
    console.error('BusinessLogoCard component error:', error);
    return null;
  }
}
