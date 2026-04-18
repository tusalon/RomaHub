function IntrigueWall() {
  try {
    const all = MockData.listBusinesses();
    const [active, setActive] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const openCard = (b) => {
      try {
        setActive(b);
        setOpen(true);
      } catch (error) {
        console.error('IntrigueWall.openCard error:', error);
      }
    };

    const closeCard = () => {
      try {
        setOpen(false);
        window.setTimeout(() => setActive(null), 220);
      } catch (error) {
        console.error('IntrigueWall.closeCard error:', error);
      }
    };

    React.useEffect(() => {
      try {
        const onKey = (e) => {
          if (e.key === 'Escape') closeCard();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      } catch (error) {
        console.error('IntrigueWall useEffect error:', error);
      }
    }, []);

    const DetailPanel = ({ business }) => {
      try {
        if (!business) return null;

        return (
          <div
            className={`fixed inset-0 z-[80] ${open ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            data-name="intrigue-overlay"
            data-file="pages/home/IntrigueWall.js"
          >
            <div className="absolute inset-0 bg-black/20" onClick={closeCard} data-name="intrigue-backdrop" data-file="pages/home/IntrigueWall.js"></div>

            <div className="absolute inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center p-4" data-name="intrigue-modal-wrap" data-file="pages/home/IntrigueWall.js">
              <div
                className={`card-rr w-full md:max-w-[980px] overflow-hidden transform ${open ? 'translate-y-0 md:scale-100' : 'translate-y-4 md:scale-[0.98]'} transition-transform duration-300`}
                data-name="intrigue-modal"
                data-file="pages/home/IntrigueWall.js"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]" data-name="intrigue-grid" data-file="pages/home/IntrigueWall.js">
                  <div className="relative h-[260px] md:h-full bg-[#F9FAFB]" data-name="intrigue-photo" data-file="pages/home/IntrigueWall.js">
                    <img src={business.portadaUrl} alt={`Portada de ${business.nombre}`} className="w-full h-full object-cover" data-name="intrigue-photo-img" data-file="pages/home/IntrigueWall.js" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2" data-name="intrigue-badges" data-file="pages/home/IntrigueWall.js">
                      {business.topRoma ? <Badge type="top" text="🌟 Top Roma" data-name="badge-top" data-file="pages/home/IntrigueWall.js" /> : null}
                      {business.masReservado ? <Badge type="reservado" text="Más reservado" data-name="badge-reservado" data-file="pages/home/IntrigueWall.js" /> : null}
                      {business.negocioDelMes ? <Badge type="mes" text="Negocio del Mes" data-name="badge-mes" data-file="pages/home/IntrigueWall.js" /> : null}
                    </div>
                    <button className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur border border-[var(--border)] flex items-center justify-center hover:bg-white transition-colors" onClick={closeCard} data-name="intrigue-close" data-file="pages/home/IntrigueWall.js" aria-label="Cerrar">
                      <div className="icon-x text-xl text-[var(--primary-color)]" data-name="intrigue-close-icon" data-file="pages/home/IntrigueWall.js"></div>
                    </button>
                  </div>

                  <div className="p-5 md:p-7" data-name="intrigue-body" data-file="pages/home/IntrigueWall.js">
                    <div className="flex items-start gap-4" data-name="intrigue-head" data-file="pages/home/IntrigueWall.js">
                      <div className="w-14 h-14 rounded-3xl border border-[var(--border)] bg-white overflow-hidden shrink-0" data-name="intrigue-logo" data-file="pages/home/IntrigueWall.js">
                        <img src={business.logoUrl} alt={`Logo de ${business.nombre}`} className="w-full h-full object-cover" data-name="intrigue-logo-img" data-file="pages/home/IntrigueWall.js" />
                      </div>
                      <div className="min-w-0" data-name="intrigue-titlewrap" data-file="pages/home/IntrigueWall.js">
                        <p className="text-lg md:text-xl font-semibold leading-tight" data-name="intrigue-name" data-file="pages/home/IntrigueWall.js">{business.nombre}</p>
                        <p className="text-sm text-[var(--text-muted)] mt-1" data-name="intrigue-meta" data-file="pages/home/IntrigueWall.js">
                          {business.categoria} · {business.ubicacion?.zona} · {business.ubicacion?.ciudad}
                        </p>
                      </div>
                      {business.vip ? (
                        <span className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs border border-black/30" data-name="intrigue-vip" data-file="pages/home/IntrigueWall.js">
                          <div className="icon-crown text-base text-white" data-name="intrigue-vip-i" data-file="pages/home/IntrigueWall.js"></div>
                          VIP
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4" data-name="intrigue-rating" data-file="pages/home/IntrigueWall.js">
                      <StarRating value={business.estrellas} total={business.totalReseñas} verified={business.verificado} data-name="intrigue-stars" data-file="pages/home/IntrigueWall.js" />
                    </div>

                    <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed" data-name="intrigue-desc" data-file="pages/home/IntrigueWall.js">
                      {business.descripcion}
                    </p>

                    <div className="mt-5 surface-rr p-4" data-name="intrigue-mini" data-file="pages/home/IntrigueWall.js">
                      <div className="flex items-start gap-3" data-name="intrigue-loc" data-file="pages/home/IntrigueWall.js">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="intrigue-loc-iw" data-file="pages/home/IntrigueWall.js">
                          <div className="icon-map-pin text-xl text-[var(--primary-color)]" data-name="intrigue-loc-i" data-file="pages/home/IntrigueWall.js"></div>
                        </div>
                        <div className="min-w-0" data-name="intrigue-loc-t" data-file="pages/home/IntrigueWall.js">
                          <p className="text-xs text-[var(--text-muted)]" data-name="intrigue-loc-l" data-file="pages/home/IntrigueWall.js">Ubicación</p>
                          <p className="text-sm font-medium leading-snug" data-name="intrigue-loc-v" data-file="pages/home/IntrigueWall.js">
                            {business.ubicacion?.direccion}
                          </p>
                        </div>
                      </div>
                      <div className="divider-rr my-4" data-name="intrigue-div" data-file="pages/home/IntrigueWall.js"></div>
                      <div className="flex items-center justify-between gap-3" data-name="intrigue-price" data-file="pages/home/IntrigueWall.js">
                        <span className="text-xs text-[var(--text-muted)]" data-name="intrigue-price-l" data-file="pages/home/IntrigueWall.js">Rango de precio</span>
                        <span className="text-sm font-semibold" data-name="intrigue-price-v" data-file="pages/home/IntrigueWall.js">{Format.formatRangoPrecio(business.rangoPrecio?.min, business.rangoPrecio?.max)}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-2" data-name="intrigue-ctas" data-file="pages/home/IntrigueWall.js">
                      <button
                        className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2"
                        onClick={() => Navigation.goToBusiness(business.id)}
                        data-name="intrigue-open"
                        data-file="pages/home/IntrigueWall.js"
                      >
                        <span data-name="intrigue-open-t" data-file="pages/home/IntrigueWall.js">Ver perfil</span>
                        <div className="icon-arrow-right text-xl text-white" data-name="intrigue-open-i" data-file="pages/home/IntrigueWall.js"></div>
                      </button>
                      <button
                        className="btn-rr btn-ghost-rr w-full flex items-center justify-center gap-2"
                        onClick={() => Navigation.goToSearch(business.categoria, business.ubicacion?.zona || business.ubicacion?.ciudad || '')}
                        data-name="intrigue-related"
                        data-file="pages/home/IntrigueWall.js"
                      >
                        <div className="icon-search text-xl text-[var(--primary-color)]" data-name="intrigue-related-i" data-file="pages/home/IntrigueWall.js"></div>
                        <span data-name="intrigue-related-t" data-file="pages/home/IntrigueWall.js">Buscar similares</span>
                      </button>
                    </div>

                    <p className="mt-4 text-xs text-[var(--text-muted)]" data-name="intrigue-note" data-file="pages/home/IntrigueWall.js">
                      Tip: toca “Esc” para cerrar. Transiciones suaves por diseño.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } catch (error) {
        console.error('IntrigueWall.DetailPanel error:', error);
        return null;
      }
    };

    return (
      <section className="mt-12" id="muro" data-name="intrigue-wall" data-file="pages/home/IntrigueWall.js">
        <div className="container-rr" data-name="intrigue-wall-inner" data-file="pages/home/IntrigueWall.js">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-name="intrigue-wall-head" data-file="pages/home/IntrigueWall.js">
            <div data-name="intrigue-wall-titlewrap" data-file="pages/home/IntrigueWall.js">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight" data-name="intrigue-wall-title" data-file="pages/home/IntrigueWall.js">El Muro de la Intriga</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1 max-w-[700px]" data-name="intrigue-wall-sub" data-file="pages/home/IntrigueWall.js">
                Un grid de logos con pistas sutiles. Pasa el cursor, mira lo justo, y abre cuando sientas curiosidad.
              </p>
            </div>
            <a className="btn-rr btn-ghost-rr inline-flex items-center justify-center gap-2 w-full md:w-auto" href="search.html" data-name="intrigue-wall-cta" data-file="pages/home/IntrigueWall.js">
              <span data-name="intrigue-wall-cta-t" data-file="pages/home/IntrigueWall.js">Ver resultados</span>
              <div className="icon-arrow-right text-xl text-[var(--primary-color)]" data-name="intrigue-wall-cta-i" data-file="pages/home/IntrigueWall.js"></div>
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-name="intrigue-grid" data-file="pages/home/IntrigueWall.js">
            {all.map((b) => (
              <BusinessLogoCard key={b.id} business={b} onOpen={openCard} data-name="intrigue-item" data-file="pages/home/IntrigueWall.js" />
            ))}
          </div>
        </div>

        <DetailPanel business={active} data-name="intrigue-panel" data-file="pages/home/IntrigueWall.js" />
      </section>
    );
  } catch (error) {
    console.error('IntrigueWall component error:', error);
    return null;
  }
}