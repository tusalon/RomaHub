function BusinessPage({ business }) {
  try {
    const b = business;
    const [tab, setTab] = React.useState('portafolio');

    React.useEffect(() => {
      try {
        const url = new URL(window.location.href);
        const t = url.hash ? url.hash.replace('#', '') : '';
        if (t) setTab(t);
      } catch (error) {
        console.error('BusinessPage hash error:', error);
      }
    }, []);

    const changeTab = (t) => {
      try {
        setTab(t);
        window.history.replaceState({}, '', `business.html?id=${encodeURIComponent(b.id)}#${t}`);
        const sectionEl = document.getElementById(`tab-${t}`);
        if (sectionEl) sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (error) {
        console.error('BusinessPage.changeTab error:', error);
      }
    };

    return (
      <div data-name="business-page" data-file="pages/business/BusinessPage.js">
        <BusinessHeader business={b} data-name="business-header" data-file="pages/business/BusinessPage.js" />
        <BusinessTabs active={tab} onChange={changeTab} data-name="business-tabs" data-file="pages/business/BusinessPage.js" />

        <div className="container-rr mt-6" data-name="business-content" data-file="pages/business/BusinessPage.js">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start" data-name="business-grid" data-file="pages/business/BusinessPage.js">
            <div className="space-y-4" data-name="left" data-file="pages/business/BusinessPage.js">
              <section id="tab-portafolio" className={`surface-rr p-4 md:p-5 ${tab === 'portafolio' ? '' : 'hidden'}`} data-name="sec-portfolio" data-file="pages/business/BusinessPage.js">
                <div className="flex items-end justify-between gap-4 mb-4" data-name="sec-head" data-file="pages/business/BusinessPage.js">
                  <div data-name="sec-titlewrap" data-file="pages/business/BusinessPage.js">
                    <h2 className="text-lg font-semibold" data-name="sec-title" data-file="pages/business/BusinessPage.js">Portafolio</h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1" data-name="sec-sub" data-file="pages/business/BusinessPage.js">Grid tipo Instagram con enfoque minimal.</p>
                  </div>
                  <span className="chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="sec-chip" data-file="pages/business/BusinessPage.js">
                    {b.fotos?.length || 0} fotos
                  </span>
                </div>
                <MasonryGrid images={b.fotos || []} data-name="masonry" data-file="pages/business/BusinessPage.js" />
              </section>

              <section id="tab-catalogo" className={`surface-rr p-4 md:p-5 ${tab === 'catalogo' ? '' : 'hidden'}`} data-name="sec-catalog" data-file="pages/business/BusinessPage.js">
                <h2 className="text-lg font-semibold" data-name="catalog-title" data-file="pages/business/BusinessPage.js">Servicios y Productos</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1 mb-4" data-name="catalog-sub" data-file="pages/business/BusinessPage.js">
                  Categorías plegables con precios alineados para decidir rápido.
                </p>
                <BusinessCatalog business={b} mode="catalogo" data-name="catalog" data-file="pages/business/BusinessPage.js" />
              </section>

              <section id="tab-cursos" className={`surface-rr p-4 md:p-5 ${tab === 'cursos' ? '' : 'hidden'}`} data-name="sec-courses" data-file="pages/business/BusinessPage.js">
                <h2 className="text-lg font-semibold" data-name="courses-title" data-file="pages/business/BusinessPage.js">Cursos y Talleres</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1 mb-4" data-name="courses-sub" data-file="pages/business/BusinessPage.js">
                  Fechas, ubicaciones y precios en CUP con indicación de cupo.
                </p>
                <BusinessCatalog business={b} mode="cursos" data-name="courses" data-file="pages/business/BusinessPage.js" />
              </section>

              <section id="tab-resenas" className={`surface-rr p-4 md:p-5 ${tab === 'resenas' ? '' : 'hidden'}`} data-name="sec-reviews" data-file="pages/business/BusinessPage.js">
                <BusinessReviews business={b} data-name="reviews" data-file="pages/business/BusinessPage.js" />
              </section>
            </div>

            <aside className="hidden lg:block space-y-4 sticky top-[92px]" data-name="right" data-file="pages/business/BusinessPage.js">
              <div className="surface-rr p-5" data-name="sticky-card" data-file="pages/business/BusinessPage.js">
                <p className="text-sm font-semibold" data-name="sticky-title" data-file="pages/business/BusinessPage.js">Atajo rápido</p>
                <p className="text-sm text-[var(--text-muted)] mt-1" data-name="sticky-sub" data-file="pages/business/BusinessPage.js">
                  Ideal si vienes directo a reservar.
                </p>
                <div className="mt-4 space-y-2" data-name="sticky-actions" data-file="pages/business/BusinessPage.js">
                  <a
                    className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2"
                    href={`https://wa.me/${String(b.whatsapp||'').replace('+','')}?text=${encodeURIComponent(`Hola, quiero reservar en ${b.nombre}. ¿Tienen disponibilidad?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    data-name="sticky-wa"
                    data-file="pages/business/BusinessPage.js"
                  >
                    <div className="icon-message-circle text-xl text-white" data-name="sticky-wa-i" data-file="pages/business/BusinessPage.js"></div>
                    Contactar por WhatsApp
                  </a>
                  <button
                    className="btn-rr btn-ghost-rr w-full flex items-center justify-center gap-2"
                    onClick={() => Navigation.goToSearch(b.categoria, b.ubicacion?.zona || b.ubicacion?.ciudad || '')}
                    data-name="sticky-sim"
                    data-file="pages/business/BusinessPage.js"
                  >
                    <div className="icon-search text-xl text-[var(--primary-color)]" data-name="sticky-sim-i" data-file="pages/business/BusinessPage.js"></div>
                    Buscar similares
                  </button>
                </div>

                <div className="divider-rr my-5" data-name="sticky-div" data-file="pages/business/BusinessPage.js"></div>

                <div className="space-y-3" data-name="sticky-trust" data-file="pages/business/BusinessPage.js">
                  <div className="flex items-start gap-3" data-name="t1" data-file="pages/business/BusinessPage.js">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="t1-iw" data-file="pages/business/BusinessPage.js">
                      <div className="icon-circle-check text-xl text-[var(--primary-color)]" data-name="t1-i" data-file="pages/business/BusinessPage.js"></div>
                    </div>
                    <div data-name="t1-t" data-file="pages/business/BusinessPage.js">
                      <p className="text-sm font-semibold" data-name="t1-tt" data-file="pages/business/BusinessPage.js">Reseñas verificadas</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1" data-name="t1-dd" data-file="pages/business/BusinessPage.js">Más confianza al reservar.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3" data-name="t2" data-file="pages/business/BusinessPage.js">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="t2-iw" data-file="pages/business/Business/BusinessPage.js">
                      <div className="icon-award text-xl text-[var(--primary-color)]" data-name="t2-i" data-file="pages/business/BusinessPage.js"></div>
                    </div>
                    <div data-name="t2-t" data-file="pages/business/BusinessPage.js">
                      <p className="text-sm font-semibold" data-name="t2-tt" data-file="pages/business/BusinessPage.js">Badges visibles</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1" data-name="t2-dd" data-file="pages/business/BusinessPage.js">Top Roma, Más reservado, Negocio del Mes.</p>
                    </div>
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </div>

        <MobileWhatsAppBar whatsapp={b.whatsapp} nombre={b.nombre} data-name="wa" data-file="pages/business/BusinessPage.js" />
      </div>
    );
  } catch (error) {
    console.error('BusinessPage component error:', error);
    return null;
  }
}