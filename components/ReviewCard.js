function ReviewCard({ review }) {
  try {
    const r = review;

    return (
      <div className="surface-rr p-5" data-name="review-card" data-file="components/ReviewCard.js">
        <div className="flex items-start gap-3" data-name="review-head" data-file="components/ReviewCard.js">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="review-avatar" data-file="components/ReviewCard.js">
            <div className="icon-user text-xl text-[var(--primary-color)]" data-name="review-avatar-i" data-file="components/ReviewCard.js"></div>
          </div>
          <div className="min-w-0" data-name="review-title" data-file="components/ReviewCard.js">
            <p className="text-sm font-semibold" data-name="review-name" data-file="components/ReviewCard.js">{r.nombre}</p>
            <div className="mt-1 flex items-center gap-2" data-name="review-meta" data-file="components/ReviewCard.js">
              <div className="flex items-center gap-1" data-name="review-stars" data-file="components/ReviewCard.js">
                <div className="icon-star text-base text-[var(--primary-color)]" data-name="review-star" data-file="components/ReviewCard.js"></div>
                <span className="text-sm font-semibold" data-name="review-star-val" data-file="components/ReviewCard.js">{Number(r.estrellas).toFixed(1)}</span>
              </div>
              <span className="text-xs text-[var(--text-muted)]" data-name="review-date" data-file="components/ReviewCard.js">{r.fecha}</span>
              {r.verificada ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(11,18,32,0.04)] border border-[var(--border)]" data-name="review-verified" data-file="components/ReviewCard.js">
                  <div className="icon-circle-check text-sm text-[var(--primary-color)]" data-name="review-verified-i" data-file="components/ReviewCard.js"></div>
                  <span className="text-[11px] text-[var(--text-muted)]" data-name="review-verified-t" data-file="components/ReviewCard.js">Reseña verificada</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed" data-name="review-text" data-file="components/ReviewCard.js">
          {r.texto}
        </p>
      </div>
    );
  } catch (error) {
    console.error('ReviewCard component error:', error);
    return null;
  }
}