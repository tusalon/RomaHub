function BusinessReviews({ business }) {
  try {
    const b = business;
    const [reviews, setReviews] = React.useState(b.resenas || []);
    const [rating, setRating] = React.useState(5);
    const [name, setName] = React.useState('');
    const [text, setText] = React.useState('');
    const [saving, setSaving] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const submitReview = async (event) => {
      try {
        event.preventDefault();
        setMessage('');
        if (!name.trim() || !text.trim()) {
          setMessage('Escribe tu nombre y tu reseña.');
          return;
        }

        setSaving(true);
        const created = await MockData.addReview(b.id, {
          nombre: name.trim(),
          estrellas: rating,
          texto: text.trim()
        });
        const review = {
          id: String(created.id || `${b.id}-${Date.now()}`),
          nombre: created.nombre || name.trim(),
          estrellas: Number(created.estrellas || rating),
          texto: created.texto || text.trim(),
          fecha: created.fecha || created.created_at || new Date().toISOString(),
          verificada: created.verificada === true
        };
        setReviews((current) => [review, ...current]);
        setName('');
        setText('');
        setRating(5);
        setMessage('Gracias. Tu reseña ya fue enviada.');
      } catch (error) {
        console.error('BusinessReviews.submitReview error:', error);
        setMessage(error.message || 'No se pudo guardar la reseña.');
      } finally {
        setSaving(false);
      }
    };

    const average = reviews.length
      ? reviews.reduce((sum, review) => sum + Number(review.estrellas || 0), 0) / reviews.length
      : Number(b.estrellas || 0);

    return (
      <section className="mt-4" data-name="business-reviews" data-file="pages/business/BusinessReviews.js">
        <div className="surface-rr p-4 md:p-5" data-name="review-form-card" data-file="pages/business/BusinessReviews.js">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4" data-name="reviews-head" data-file="pages/business/BusinessReviews.js">
            <div data-name="reviews-copy" data-file="pages/business/BusinessReviews.js">
              <h2 className="text-lg font-semibold" data-name="reviews-title" data-file="pages/business/BusinessReviews.js">Valorar este negocio</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1" data-name="reviews-sub" data-file="pages/business/BusinessReviews.js">{reviews.length} reseñas · {average.toFixed(1)} estrellas</p>
            </div>
            <StarRating value={average} total={reviews.length} verified={false} data-name="reviews-stars" data-file="pages/business/BusinessReviews.js" />
          </div>

          <form className="mt-5 grid gap-3" onSubmit={submitReview} data-name="review-form" data-file="pages/business/BusinessReviews.js">
            <div className="flex gap-2" data-name="rating-buttons" data-file="pages/business/BusinessReviews.js">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center ${value <= rating ? 'bg-[#F59E0B] border-[#F59E0B] text-white' : 'bg-white border-[var(--border)] text-[var(--text-muted)]'}`}
                  onClick={() => setRating(value)}
                  aria-label={`${value} estrellas`}
                  data-name="rating-button"
                  data-file="pages/business/BusinessReviews.js"
                >
                  <div className="icon-star text-lg" data-name="rating-button-icon" data-file="pages/business/BusinessReviews.js"></div>
                </button>
              ))}
            </div>
            <input className="input-rr" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" data-name="review-name-input" data-file="pages/business/BusinessReviews.js" />
            <textarea className="input-rr min-h-[104px] resize-y" value={text} onChange={(e) => setText(e.target.value)} placeholder="Cuenta como fue tu experiencia" data-name="review-text-input" data-file="pages/business/BusinessReviews.js"></textarea>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3" data-name="review-submit-row" data-file="pages/business/BusinessReviews.js">
              <button className="btn-rr btn-primary-rr w-full sm:w-auto" type="submit" disabled={saving} data-name="review-submit" data-file="pages/business/BusinessReviews.js">
                {saving ? 'Enviando...' : 'Enviar reseña'}
              </button>
              {message ? <p className="text-sm text-[var(--text-muted)]" data-name="review-message" data-file="pages/business/BusinessReviews.js">{message}</p> : null}
            </div>
          </form>
        </div>

        {reviews.length ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" data-name="reviews-grid" data-file="pages/business/BusinessReviews.js">
            {reviews.slice(0, 6).map((review) => (
              <ReviewCard key={review.id} review={review} data-name="review" data-file="pages/business/BusinessReviews.js" />
            ))}
          </div>
        ) : null}
      </section>
    );
  } catch (error) {
    console.error('BusinessReviews component error:', error);
    return null;
  }
}
