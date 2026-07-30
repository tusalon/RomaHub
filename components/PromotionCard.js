function PromotionCard({ promotion, compact = false, highlighted = false }) {
  try {
    const p = promotion || {};
    const endDate = p.fechaFin ? new Date(p.fechaFin) : null;
    const validEndDate = endDate && !Number.isNaN(endDate.getTime());
    const profileHref = `business.html?id=${encodeURIComponent(p.negocioId || '')}&promo=${encodeURIComponent(p.id || '')}`;
    const image = p.imagen || p.negocioLogo || '';
    const typeLabel = ({ servicio: 'Servicio', producto: 'Producto', curso: 'Curso' })[p.tipo] || 'Oferta';

    React.useEffect(() => {
      if (!p.id || !p.negocioId) return;
      window.RomaAnalytics?.track?.({
        negocioId: p.negocioId,
        evento: 'promocion_vista',
        itemTipo: 'promocion',
        itemId: p.id,
        itemNombre: p.titulo
      }, { oncePerDay: true });
    }, [p.id, p.negocioId]);

    const trackClick = () => {
      window.RomaAnalytics?.track?.({
        negocioId: p.negocioId,
        evento: 'promocion_click',
        itemTipo: 'promocion',
        itemId: p.id,
        itemNombre: p.titulo
      });
    };

    const contact = (event) => {
      const rawWhatsapp = String(p.negocioWhatsapp || '').replace(/\D/g, '');
      const whatsapp = rawWhatsapp.length === 8 ? `53${rawWhatsapp}` : rawWhatsapp;
      if (!whatsapp) return;
      event.preventDefault();
      trackClick();
      const text = encodeURIComponent(`Hola, vi la oferta “${p.titulo}” de ${p.negocioNombre} en RomaHub. Quiero más información.`);
      window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer');
    };

    return (
      <article id={`promotion-${p.id}`} className={`surface-rr overflow-hidden h-full flex flex-col card-lift-rr ${highlighted ? 'ring-2 ring-[var(--primary-color)] ring-offset-2' : ''}`} data-name="promotion-card">
        <a href={profileHref} onClick={trackClick} className={`relative block overflow-hidden bg-[var(--bg-muted)] ${compact ? 'h-32' : 'h-44'}`}>
          {image ? <img src={image} alt={p.titulo || 'Oferta'} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
          <span className="absolute top-3 left-3 rounded-full bg-[var(--primary-color)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">{typeLabel}</span>
          {validEndDate ? <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-[#2A1620] shadow-sm">Hasta {endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span> : null}
          <div className="absolute left-3 right-3 bottom-3 text-white">
            <p className="text-xs font-medium opacity-90 truncate">{p.negocioNombre}</p>
            <h3 className="mt-1 text-lg font-extrabold leading-tight line-clamp-2">{p.titulo}</h3>
          </div>
        </a>
        <div className="p-4 flex flex-col flex-1">
          {p.descripcion ? <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">{p.descripcion}</p> : null}
          {(p.precioPromocional > 0 || p.precioAnterior > 0) ? (
            <div className="mt-3 flex items-baseline gap-2">
              {p.precioPromocional > 0 ? <span className="text-xl font-extrabold text-[var(--primary-color)]">{Format.formatPrecioCUP(p.precioPromocional, p.moneda)}</span> : null}
              {p.precioAnterior > 0 ? <span className="text-xs text-[var(--text-muted)] line-through">{Format.formatPrecioCUP(p.precioAnterior, p.moneda)}</span> : null}
            </div>
          ) : null}
          <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
            <a href={profileHref} onClick={trackClick} className="btn-rr btn-ghost-rr py-2.5 text-xs text-center">Ver negocio</a>
            {p.negocioWhatsapp ? (
              <a href={profileHref} onClick={contact} className="btn-rr btn-primary-rr py-2.5 text-xs text-center">Pedir oferta</a>
            ) : (
              <a href={profileHref} onClick={trackClick} className="btn-rr btn-primary-rr py-2.5 text-xs text-center">Ver oferta</a>
            )}
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error('PromotionCard component error:', error);
    return null;
  }
}
