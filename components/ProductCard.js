function ProductCard({ item }) {
  try {
    const it = item;
    const esCurso = it.tipo === 'curso';

    const abrirNegocio = () => {
      try {
        Navigation.goToBusiness(it.negocioId);
      } catch (error) {
        console.error('ProductCard.abrirNegocio error:', error);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirNegocio(); }
    };

    return (
      <div
        className="group surface-rr card-lift-rr overflow-hidden cursor-pointer flex flex-col"
        onClick={abrirNegocio}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        data-name="product-card"
        data-file="components/ProductCard.js"
        aria-label={`${it.nombre} — ${it.negocioNombre}`}
      >
        <div className="relative aspect-square overflow-hidden bg-[#F3F4F6]" data-name="product-media" data-file="components/ProductCard.js">
          {it.imagen ? (
            <img loading="lazy" decoding="async" src={it.imagen} alt={it.nombre} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-name="product-img" data-file="components/ProductCard.js" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" data-name="product-noimg" data-file="components/ProductCard.js">
              <div className={`${esCurso ? 'icon-graduation-cap' : 'icon-shopping-bag'} text-4xl text-[var(--primary-color)] opacity-40`} data-name="product-noimg-icon" data-file="components/ProductCard.js"></div>
            </div>
          )}
          {esCurso ? (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#111827] text-white text-[10px] font-bold shadow-sm" data-name="product-type" data-file="components/ProductCard.js">Curso</span>
          ) : null}
          {it.destacado ? (
            <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold text-[#F59E0B] shadow-sm" data-name="product-featured" data-file="components/ProductCard.js">
              <div className="icon-star text-xs text-[#F59E0B]"></div> Destacado
            </span>
          ) : null}
        </div>

        <div className="p-3 flex flex-col flex-1" data-name="product-body" data-file="components/ProductCard.js">
          <p className="text-sm font-bold text-[#111827] leading-snug line-clamp-2" data-name="product-name" data-file="components/ProductCard.js">{it.nombre}</p>
          <p className="mt-1 text-base font-extrabold text-[var(--primary-color)]" data-name="product-price" data-file="components/ProductCard.js">{Format.formatPrecioCUP(it.precio)}</p>

          <div className="mt-auto pt-3 flex items-center gap-2" data-name="product-business" data-file="components/ProductCard.js">
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-white border border-[var(--border)] shrink-0" data-name="product-biz-logo" data-file="components/ProductCard.js">
              {it.negocioLogo ? (
                <img loading="lazy" decoding="async" src={it.negocioLogo} alt={it.negocioNombre} className="w-full h-full object-contain" data-name="product-biz-img" data-file="components/ProductCard.js" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-[var(--primary-color)] bg-[var(--secondary-color)]" data-name="product-biz-initials" data-file="components/ProductCard.js">{String(it.negocioNombre || 'N').trim().slice(0, 1).toUpperCase()}</div>
              )}
            </div>
            <span className="text-xs text-[var(--text-muted)] truncate" data-name="product-biz-name" data-file="components/ProductCard.js">{it.negocioNombre}</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProductCard component error:', error);
    return null;
  }
}
