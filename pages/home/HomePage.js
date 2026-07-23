function HomePage({ initialParams }) {
  try {
    const top = MockData.listTopRated();
    const featured = MockData.listWeeklyFeatured();
    const showcase = MockData.listShowcaseProducts(8);
    const allBusinesses = MockData.listBusinesses();

    const provinceCounts = React.useMemo(() => {
      const counts = {};
      allBusinesses.forEach((b) => {
        const prov = b.ubicacion?.provincia || '';
        if (!prov) return;
        if (!counts[prov]) counts[prov] = 0;
        counts[prov]++;
      });
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    }, [allBusinesses]);

    return (
      <div data-name="home-page" data-file="pages/home/HomePage.js">
        <HomeHero initialParams={initialParams} data-name="home-hero" data-file="pages/home/HomePage.js" />

        {top.length > 0 ? (
          <BusinessRail
            title="Ranking"
            subtitle=""
            badge="Mejor valorados por clientas verificadas"
            items={top}
            emptyText="Aun no hay valoraciones verificadas."
            data-name="top-rated"
            data-file="pages/home/HomePage.js"
          />
        ) : null}

        <section className="mt-10" data-name="province-directory" data-file="pages/home/HomePage.js">
          <div className="container-rr" data-name="province-dir-inner" data-file="pages/home/HomePage.js">
            <span className="kicker-rr block mb-2" data-name="prov-badge" data-file="pages/home/HomePage.js">Directorio por provincia</span>
            <h2 className="text-2xl md:text-[26px] font-extrabold tracking-[-0.02em]" data-name="prov-title" data-file="pages/home/HomePage.js">Explora por provincia</h2>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" data-name="prov-grid" data-file="pages/home/HomePage.js">
              {provinceCounts.map((prov) => (
                <button
                  key={prov.name}
                  className="surface-rr p-4 text-left hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group"
                  onClick={() => Navigation.goToSearch('', prov.name)}
                  data-name="prov-card"
                  data-file="pages/home/HomePage.js"
                >
                  <div className="flex items-center gap-2 mb-2" data-name="prov-head" data-file="pages/home/HomePage.js">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(232,51,135,0.08)]" data-name="prov-icon-wrap" data-file="pages/home/HomePage.js">
                      <div className="icon-map-pin text-base text-[#e83387]" data-name="prov-icon" data-file="pages/home/HomePage.js"></div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold group-hover:text-[#e83387] transition-colors" data-name="prov-name" data-file="pages/home/HomePage.js">{prov.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1" data-name="prov-count" data-file="pages/home/HomePage.js">{prov.count} {prov.count === 1 ? 'negocio' : 'negocios'}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <BusinessRail
          title="Mas reservados"
          subtitle=""
          badge="Los mas activos esta semana"
          items={featured}
          data-name="weekly-featured"
          data-file="pages/home/HomePage.js"
        />

        <AllBusinessesSection data-name="all-businesses-section" data-file="pages/home/HomePage.js" />

        <ProductShowcase
          title="Marketplace"
          badge="Productos y cursos"
          subtitle="Compra directo por WhatsApp con el negocio."
          items={showcase}
          verTodosHref="search.html"
          data-name="marketplace-showcase"
          data-file="pages/home/HomePage.js"
        />

        <section className="mt-12" data-name="home-trust" data-file="pages/home/HomePage.js">
          <div className="container-rr" data-name="home-trust-inner" data-file="pages/home/HomePage.js">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-name="trust-grid" data-file="pages/home/HomePage.js">
              <div className="surface-rr card-lift-rr p-5" data-name="trust-1" data-file="pages/home/HomePage.js">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(34,197,94,0.08)]" data-name="trust-1-iw" data-file="pages/home/HomePage.js">
                  <div className="icon-circle-check text-xl text-[#22C55E]" data-name="trust-1-i" data-file="pages/home/HomePage.js"></div>
                </div>
                <p className="mt-4 text-sm font-semibold" data-name="trust-1-t" data-file="pages/home/HomePage.js">Valoraciones verificadas</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="trust-1-d" data-file="pages/home/HomePage.js">
                  Solo puntuan clientas que completaron su visita. Cero valoraciones inventadas.
                </p>
              </div>

              <div className="surface-rr card-lift-rr p-5" data-name="trust-2" data-file="pages/home/HomePage.js">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,51,135,0.08)]" data-name="trust-2-iw" data-file="pages/home/HomePage.js">
                  <div className="icon-trophy text-xl text-[#e83387]" data-name="trust-2-i" data-file="pages/home/HomePage.js"></div>
                </div>
                <p className="mt-4 text-sm font-semibold" data-name="trust-2-t" data-file="pages/home/HomePage.js">Ranking competitivo</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="trust-2-d" data-file="pages/home/HomePage.js">
                  Los negocios con mejor servicio suben en el ranking. Minimo 3 valoraciones para competir.
                </p>
              </div>

              <div className="surface-rr card-lift-rr p-5" data-name="trust-3" data-file="pages/home/HomePage.js">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,51,135,0.08)]" data-name="trust-3-iw" data-file="pages/home/HomePage.js">
                  <div className="icon-map-pin text-xl text-[#e83387]" data-name="trust-3-i" data-file="pages/home/HomePage.js"></div>
                </div>
                <p className="mt-4 text-sm font-semibold" data-name="trust-3-t" data-file="pages/home/HomePage.js">Toda Cuba</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="trust-3-d" data-file="pages/home/HomePage.js">
                  Encuentra negocios por provincia. RomaHub crece en toda la isla.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('HomePage component error:', error);
    return null;
  }
}
