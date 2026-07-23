function ProductShowcase({ items, title, badge, subtitle, verTodosHref }) {
  try {
    const list = items || [];
    if (!list.length) return null;

    return (
      <section className="mt-12" data-name="product-showcase" data-file="components/ProductShowcase.js">
        <div className="container-rr" data-name="showcase-inner" data-file="components/ProductShowcase.js">
          <div className="flex items-end justify-between gap-3 mb-5" data-name="showcase-head" data-file="components/ProductShowcase.js">
            <div data-name="showcase-copy" data-file="components/ProductShowcase.js">
              {badge ? <span className="kicker-rr block mb-2" data-name="showcase-badge" data-file="components/ProductShowcase.js">{badge}</span> : null}
              <h2 className="text-2xl md:text-[26px] font-extrabold tracking-[-0.02em]" data-name="showcase-title" data-file="components/ProductShowcase.js">{title}</h2>
              {subtitle ? <p className="text-sm text-[var(--text-muted)] mt-1" data-name="showcase-subtitle" data-file="components/ProductShowcase.js">{subtitle}</p> : null}
            </div>
            {verTodosHref ? (
              <a className="btn-rr btn-ghost-rr py-2 px-4 text-sm whitespace-nowrap shrink-0" href={verTodosHref} data-name="showcase-all" data-file="components/ProductShowcase.js">Ver todo</a>
            ) : null}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" data-name="showcase-grid" data-file="components/ProductShowcase.js">
            {list.map((item) => (
              <ProductCard key={item.id} item={item} data-name="showcase-item" data-file="components/ProductShowcase.js" />
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('ProductShowcase component error:', error);
    return null;
  }
}
