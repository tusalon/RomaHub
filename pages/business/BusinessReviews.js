function BusinessReviews({ business }) {
  try {
    const b = business;
    const reviews = b.reseñas || [];
    const verifiedCount = reviews.filter((r) => r.verificada).length;

    return (
      <div data-name="business-reviews" data-file="pages/business/BusinessReviews.js">
        <div className="surface-rr p-5" data-name="reviews-summary" data-file="pages/business/BusinessReviews.js">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between" data-name="sum-row" data-file="pages/business/BusinessReviews.js">
            <div data-name="sum-left" data-file="pages/business/BusinessReviews.js">
              <p className="text-sm font-semibold" data-name="sum-title" data-file="pages/business/BusinessReviews.js">Reseñas</p>
              <p className="text-sm text-[var(--text-muted)] mt-1" data-name="sum-sub" data-file="pages/business/BusinessReviews.js">
                {verifiedCount} de {reviews.length} son “Reseña Verificada”.
              </p>
            </div>
            <div className="flex items-center gap-2" data-name="sum-right" data-file="pages/business/BusinessReviews.js">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="sum-iw" data-file="pages/business/BusinessReviews.js">
                <div className="icon-star text-xl text-[var(--primary-color)]" data-name="sum-i" data-file="pages/business/BusinessReviews.js"></div>
              </div>
              <div data-name="sum-score" data-file="pages/business/BusinessReviews.js">
                <p className="text-lg font-semibold" data-name="sum-score-v" data-file="pages/business/BusinessReviews.js">{Number(b.estrellas).toFixed(1)}</p>
                <p className="text-xs text-[var(--text-muted)]" data-name="sum-score-t" data-file="pages/business/BusinessReviews.js">{b.totalReseñas} reseñas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" data-name="reviews-grid" data-file="pages/business/BusinessReviews.js">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} data-name="review" data-file="pages/business/BusinessReviews.js" />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('BusinessReviews component error:', error);
    return null;
  }
}