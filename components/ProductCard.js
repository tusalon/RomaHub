function ProductCard({ item }) {
  try {
    const it = item;
    const esCurso = it.tipo === 'curso';
    const itemId = String(it.itemId || it.id || '').replace(/^(producto|curso)-/, '');
    const detailUrl = `business.html?id=${encodeURIComponent(it.negocioId)}&item=${encodeURIComponent(itemId)}&tipo=${encodeURIComponent(it.tipo)}`;
    const whatsapp = String(it.negocioWhatsapp || '').replace(/\D/g, '');
    const whatsappCompleto = whatsapp.length === 8 ? `53${whatsapp}` : whatsapp;
    const contactUrl = whatsappCompleto
      ? `https://wa.me/${whatsappCompleto}?text=${encodeURIComponent(`Hola, vi ${it.nombre} en RomaHub y quiero ${esCurso ? 'más información' : 'comprarlo'}.`)}`
      : detailUrl;
    const analyticsItem = {
      negocioId: it.negocioId,
      itemTipo: esCurso ? 'curso' : 'producto',
      itemId,
      itemNombre: it.nombre
    };
    const favoriteEntry = window.RomaSaved?.showcaseEntry?.(it);
    const trackView = () => window.RomaAnalytics?.track?.({ ...analyticsItem, evento: 'producto_visto' }, { oncePerDay: true });
    const trackContact = () => {
      if (whatsappCompleto) window.RomaAnalytics?.track?.({ ...analyticsItem, evento: 'whatsapp_click' });
    };

    return (
      <article
        className="relative reveal-card-rr group surface-rr card-lift-rr overflow-hidden flex flex-col"
        data-name="product-card"
        data-file="components/ProductCard.js"
      >
        {favoriteEntry ? <FavoriteButton entry={favoriteEntry} className="absolute top-2.5 right-2.5 z-20" /> : null}
        <a href={detailUrl} onClick={trackView} className="relative aspect-square overflow-hidden bg-[#F2ECEF] block" data-name="product-media" data-file="components/ProductCard.js" aria-label={`Ver ${it.nombre} en ${it.negocioNombre}`}>
          {it.imagen ? (
            <img loading="lazy" decoding="async" src={it.imagen} alt={it.nombre} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-name="product-img" data-file="components/ProductCard.js" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" data-name="product-noimg" data-file="components/ProductCard.js">
              <div className={`${esCurso ? 'icon-graduation-cap' : 'icon-shopping-bag'} text-4xl text-[var(--primary-color)] opacity-40`} data-name="product-noimg-icon" data-file="components/ProductCard.js"></div>
            </div>
          )}
          {esCurso ? (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#2A1620] text-white text-[10px] font-bold shadow-sm" data-name="product-type" data-file="components/ProductCard.js">Curso</span>
          ) : null}
          {it.destacado ? (
            <span className="absolute top-14 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold text-[#F59E0B] shadow-sm" data-name="product-featured" data-file="components/ProductCard.js">
              <div className="icon-star text-xs text-[#F59E0B]"></div> Destacado
            </span>
          ) : null}
        </a>

        <div className="p-3 flex flex-col flex-1" data-name="product-body" data-file="components/ProductCard.js">
          <p className="text-sm font-bold text-[#2A1620] leading-snug line-clamp-2" data-name="product-name" data-file="components/ProductCard.js">{it.nombre}</p>
          <p className="mt-1 text-base font-extrabold text-[var(--primary-color)]" data-name="product-price" data-file="components/ProductCard.js">{Format.formatPrecioCUP(it.precio, it.moneda)}</p>

          <div className="mt-auto pt-3 flex items-center gap-2" data-name="product-business" data-file="components/ProductCard.js">
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-white border border-[var(--border)] shrink-0" data-name="product-biz-logo" data-file="components/ProductCard.js">
              {it.negocioLogo ? (
                <img loading="lazy" decoding="async" src={it.negocioLogo} alt={it.negocioNombre} className="w-full h-full object-contain" data-name="product-biz-img" data-file="components/ProductCard.js" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-[var(--primary-color)] bg-[var(--secondary-color)]" data-name="product-biz-initials" data-file="components/ProductCard.js">{String(it.negocioNombre || 'N').trim().slice(0, 1).toUpperCase()}</div>
              )}
            </div>
            <span className="text-xs text-[var(--text-muted)] truncate" data-name="product-biz-name" data-file="components/ProductCard.js">{it.negocioNombre}</span>
            {it.negocioEsRservasroma ? <span className="text-xs shrink-0" title="Negocio verificado Rservasroma" data-name="diamond-badge" data-file="components/ProductCard.js">💎</span> : null}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2" data-name="product-actions" data-file="components/ProductCard.js">
            <a className="btn-rr btn-primary-rr py-2 px-2 text-xs flex items-center justify-center gap-1" href={contactUrl} onClick={whatsappCompleto ? trackContact : trackView} target={whatsappCompleto ? '_blank' : undefined} rel={whatsappCompleto ? 'noopener noreferrer' : undefined} data-name="product-contact">
              <span className="icon-message-circle text-sm text-white"></span>
              {esCurso ? 'Me interesa' : 'Comprar'}
            </a>
            <a className="btn-rr btn-ghost-rr py-2 px-2 text-xs flex items-center justify-center" href={detailUrl} onClick={trackView} data-name="product-detail">Ver detalle</a>
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error('ProductCard component error:', error);
    return null;
  }
}
