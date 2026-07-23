function RomaReviewsRail({ reviews }) {
  try {
    const list = reviews || [];
    if (!list.length) return null;

    return (
      <section className="mt-12" data-name="roma-reviews" data-file="components/RomaReviewsRail.js">
        <div className="container-rr" data-name="roma-reviews-inner" data-file="components/RomaReviewsRail.js">
          <div className="mb-4" data-name="roma-reviews-head" data-file="components/RomaReviewsRail.js">
            <span className="kicker-rr block mb-2" data-name="roma-reviews-badge" data-file="components/RomaReviewsRail.js">Comunidad</span>
            <h2 className="text-2xl md:text-[26px] font-extrabold tracking-[-0.02em]" data-name="roma-reviews-title" data-file="components/RomaReviewsRail.js">Lo que dicen las clientas</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 snap-x snap-mandatory" data-name="roma-reviews-track" data-file="components/RomaReviewsRail.js">
            {list.map((review) => (
              <div key={review.id} className="min-w-[280px] md:min-w-[360px] snap-start" data-name="roma-review-item" data-file="components/RomaReviewsRail.js">
                <div className="surface-rr p-5 h-full" data-name="roma-review-card" data-file="components/RomaReviewsRail.js">
                  <div className="flex items-center justify-between gap-3" data-name="roma-review-top" data-file="components/RomaReviewsRail.js">
                    <div data-name="roma-review-person" data-file="components/RomaReviewsRail.js">
                      <p className="text-sm font-semibold" data-name="roma-review-name" data-file="components/RomaReviewsRail.js">{review.nombre}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1" data-name="roma-review-business" data-file="components/RomaReviewsRail.js">{review.negocioNombre}</p>
                    </div>
                    <div className="flex items-center gap-1" data-name="roma-review-stars" data-file="components/RomaReviewsRail.js">
                      <div className="icon-star text-base text-[#F59E0B]" data-name="roma-review-star" data-file="components/RomaReviewsRail.js"></div>
                      <span className="text-sm font-semibold" data-name="roma-review-score" data-file="components/RomaReviewsRail.js">{Number(review.estrellas).toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed line-clamp-4" data-name="roma-review-text" data-file="components/RomaReviewsRail.js">{review.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('RomaReviewsRail component error:', error);
    return null;
  }
}
