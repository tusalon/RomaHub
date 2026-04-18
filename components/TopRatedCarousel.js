function TopRatedCarousel({ items }) {
  try {
    const list = items || [];
    const ref = React.useRef(null);

    const scrollBy = (dir) => {
      try {
        const el = ref.current;
        if (!el) return;
        const amount = Math.round(el.clientWidth * 0.85) * dir;
        el.scrollBy({ left: amount, behavior: 'smooth' });
      } catch (error) {
        console.error('TopRatedCarousel.scrollBy error:', error);
      }
    };

    return (
      <section className="mt-10" data-name="top-rated" data-file="components/TopRatedCarousel.js" id="mejor-calificados">
        <div className="container-rr" data-name="top-rated-inner" data-file="components/TopRatedCarousel.js">
          <div className="flex items-end justify-between gap-4 mb-5" data-name="top-rated-head" data-file="components/TopRatedCarousel.js">
            <div data-name="top-rated-titlewrap" data-file="components/TopRatedCarousel.js">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-balance" data-name="top-rated-title" data-file="components/TopRatedCarousel.js">Mejor calificados</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1" data-name="top-rated-sub" data-file="components/TopRatedCarousel.js">
                Negocios con reseñas consistentes y estilo boutique.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2" data-name="top-rated-controls" data-file="components/TopRatedCarousel.js">
              <button className="w-11 h-11 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-center hover:bg-[rgba(11,18,32,0.04)] transition-colors" onClick={() => scrollBy(-1)} data-name="prev" data-file="components/TopRatedCarousel.js" aria-label="Anterior">
                <div className="icon-chevron-left text-xl text-[var(--primary-color)]" data-name="prev-i" data-file="components/TopRatedCarousel.js"></div>
              </button>
              <button className="w-11 h-11 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-center hover:bg-[rgba(11,18,32,0.04)] transition-colors" onClick={() => scrollBy(1)} data-name="next" data-file="components/TopRatedCarousel.js" aria-label="Siguiente">
                <div className="icon-chevron-right text-xl text-[var(--primary-color)]" data-name="next-i" data-file="components/TopRatedCarousel.js"></div>
              </button>
            </div>
          </div>

          <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar pb-2" data-name="top-rated-track" data-file="components/TopRatedCarousel.js">
            {list.map((b) => (
              <div key={b.id} className="min-w-[260px] md:min-w-[320px]" data-name="top-rated-item" data-file="components/TopRatedCarousel.js">
                <button
                  className="card-rr w-full overflow-hidden text-left hover:shadow-[0_22px_70px_rgba(11,18,32,0.12)] transition-shadow"
                  onClick={() => Navigation.goToBusiness(b.id)}
                  data-name="top-rated-card"
                  data-file="components/TopRatedCarousel.js"
                >
                  <div className="relative h-[170px] bg-[#F9FAFB]" data-name="top-rated-photo" data-file="components/TopRatedCarousel.js">
                    <img src={b.fotos?.[0]} alt={`Foto de ${b.nombre}`} className="w-full h-full object-cover" data-name="top-rated-img" data-file="components/TopRatedCarousel.js" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2" data-name="top-rated-badges" data-file="components/TopRatedCarousel.js">
                      {b.topRoma ? <Badge type="top" text="🌟 Top Roma" data-name="badge-top" data-file="components/TopRatedCarousel.js" /> : null}
                      {b.negocioDelMes ? <Badge type="mes" text="Negocio del Mes" data-name="badge-mes" data-file="components/TopRatedCarousel.js" /> : null}
                    </div>
                    {b.vip ? (
                      <div className="absolute top-3 right-3" data-name="vip-pin" data-file="components/TopRatedCarousel.js">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs border border-black/30" data-name="vip" data-file="components/TopRatedCarousel.js">
                          <div className="icon-crown text-base text-white" data-name="vip-i" data-file="components/TopRatedCarousel.js"></div>
                          VIP
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="p-4" data-name="top-rated-body" data-file="components/TopRatedCarousel.js">
                    <p className="text-sm font-semibold" data-name="top-rated-name" data-file="components/TopRatedCarousel.js">{b.nombre}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1" data-name="top-rated-meta" data-file="components/TopRatedCarousel.js">{b.categoria} · {b.ubicacion?.zona}</p>
                    <div className="mt-3 flex items-center justify-between gap-3" data-name="top-rated-bottom" data-file="components/TopRatedCarousel.js">
                      <div className="flex items-center gap-2" data-name="top-rated-rating" data-file="components/TopRatedCarousel.js">
                        <div className="icon-star text-base text-[#F59E0B]" data-name="star" data-file="components/TopRatedCarousel.js"></div>
                        <span className="text-sm font-semibold" data-name="val" data-file="components/TopRatedCarousel.js">{Number(b.estrellas).toFixed(1)}</span>
                        <span className="text-xs text-[var(--text-muted)]" data-name="count" data-file="components/TopRatedCarousel.js">({b.totalReseñas})</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]" data-name="price" data-file="components/TopRatedCarousel.js">
                        {Format.formatRangoPrecio(b.rangoPrecio?.min, b.rangoPrecio?.max)}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>

          <div className="md:hidden flex items-center gap-2 mt-4" data-name="top-rated-controls-mobile" data-file="components/TopRatedCarousel.js">
            <button className="btn-rr btn-ghost-rr w-full flex items-center justify-center gap-2" onClick={() => scrollBy(-1)} data-name="prev-m" data-file="components/TopRatedCarousel.js">
              <div className="icon-chevron-left text-xl text-[var(--primary-color)]" data-name="prev-mi" data-file="components/TopRatedCarousel.js"></div>
              <span data-name="prev-mt" data-file="components/TopRatedCarousel.js">Anterior</span>
            </button>
            <button className="btn-rr btn-ghost-rr w-full flex items-center justify-center gap-2" onClick={() => scrollBy(1)} data-name="next-m" data-file="components/TopRatedCarousel.js">
              <span data-name="next-mt" data-file="components/TopRatedCarousel.js">Siguiente</span>
              <div className="icon-chevron-right text-xl text-[var(--primary-color)]" data-name="next-mi" data-file="components/TopRatedCarousel.js"></div>
            </button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('TopRatedCarousel component error:', error);
    return null;
  }
}