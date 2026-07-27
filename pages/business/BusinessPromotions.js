function BusinessPromotions({ business, selectedPromotionId = '' }) {
  try {
    const promotions = business?.promociones || [];

    React.useEffect(() => {
      if (!selectedPromotionId) return;
      const timer = window.setTimeout(() => {
        document.getElementById(`promotion-${selectedPromotionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
      return () => window.clearTimeout(timer);
    }, [selectedPromotionId, business?.id]);

    if (!promotions.length) return null;

    return (
      <section className="mb-4" aria-labelledby="business-promotions-title" data-name="business-promotions">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="kicker-rr">Por tiempo limitado</p>
            <h2 id="business-promotions-title" className="mt-1 text-xl md:text-2xl font-semibold">Ofertas de {business.nombre}</h2>
          </div>
          <span className="chip-rr px-3 py-1.5 text-xs text-[var(--primary-color)]">{promotions.length} {promotions.length === 1 ? 'oferta' : 'ofertas'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {promotions.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} compact={true} highlighted={String(promotion.id) === String(selectedPromotionId)} />)}
        </div>
      </section>
    );
  } catch (error) {
    console.error('BusinessPromotions component error:', error);
    return null;
  }
}
