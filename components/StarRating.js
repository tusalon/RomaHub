function StarRating({ value, total, verified }) {
  try {
    const stars = Math.round(Number(value || 0) * 10) / 10;
    const t = Number(total || 0);

    return (
      <div className="flex items-center gap-2" data-name="star-rating" data-file="components/StarRating.js">
        <div className="flex items-center gap-1" data-name="stars" data-file="components/StarRating.js">
          <div className="icon-star text-base text-[#F59E0B]" data-name="star-icon" data-file="components/StarRating.js"></div>
          <span className="text-sm font-semibold" data-name="star-value" data-file="components/StarRating.js">{stars.toFixed(1)}</span>
          <span className="text-xs text-[var(--text-muted)]" data-name="star-total" data-file="components/StarRating.js">({t})</span>
        </div>
        {verified ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(11,18,32,0.04)] border border-[var(--border)]" data-name="verified-pill" data-file="components/StarRating.js">
            <div className="icon-circle-check text-sm text-[var(--primary-color)]" data-name="verified-icon" data-file="components/StarRating.js"></div>
            <span className="text-[11px] text-[var(--text-muted)]" data-name="verified-text" data-file="components/StarRating.js">Reseñas verificadas</span>
          </span>
        ) : null}
      </div>
    );
  } catch (error) {
    console.error('StarRating component error:', error);
    return null;
  }
}