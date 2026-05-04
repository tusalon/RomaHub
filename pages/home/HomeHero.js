function HomeHero({ initialParams }) {
  try {
    const businesses = MockData.listBusinesses();
    const totalBusinesses = businesses.length;
    const totalServices = businesses.reduce((sum, business) => {
      const count = (business.categoriasCatalogo || []).reduce((innerSum, section) => innerSum + (section.items?.length || 0), 0);
      return sum + count;
    }, 0);
    const featured = MockData.listWeeklyFeatured()[0] || businesses[0] || null;
    const categories = Array.from(new Set(businesses.map((business) => business.categoria).filter(Boolean))).slice(0, 8);

    return (
      <section className="pt-6 md:pt-10" data-name="home-hero" data-file="pages/home/HomeHero.js">
        <div className="container-rr" data-name="home-hero-inner" data-file="pages/home/HomeHero.js">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-10 items-center" data-name="home-hero-grid" data-file="pages/home/HomeHero.js">
            <div data-name="home-hero-copy" data-file="pages/home/HomeHero.js">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-color)]" data-name="hero-kicker" data-file="pages/home/HomeHero.js">
                RservasRoma Marketplace
              </p>

              <h1 className="mt-4 text-5xl md:text-7xl font-semibold tracking-tight leading-[0.96]" data-name="hero-title" data-file="pages/home/HomeHero.js">
                El centro de la belleza en Cuba.
              </h1>
              <p className="mt-5 text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-[680px]" data-name="hero-sub" data-file="pages/home/HomeHero.js">
                Salones, manicuristas, barberos y especialistas reunidos en una experiencia hecha para descubrir, comparar y reservar sin vueltas.
              </p>

              <div className="mt-8 max-w-[820px]" data-name="hero-search" data-file="pages/home/HomeHero.js">
                <SearchBar
                  initialServicio={initialParams?.servicio || ''}
                  initialUbicacion={initialParams?.ubicacion || ''}
                  compact={false}
                  data-name="hero-searchbar"
                  data-file="pages/home/HomeHero.js"
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3" data-name="hero-actions" data-file="pages/home/HomeHero.js">
                <button className="btn-rr btn-primary-rr flex items-center justify-center gap-2" onClick={() => Navigation.goToSearch('', '')} data-name="hero-explore" data-file="pages/home/HomeHero.js">
                  Explorar negocios
                  <div className="icon-arrow-right text-xl text-white" data-name="hero-explore-i" data-file="pages/home/HomeHero.js"></div>
                </button>
                <a className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" href="register.html" data-name="hero-list" data-file="pages/home/HomeHero.js">
                  Registrar mi negocio
                  <div className="icon-sparkles text-xl text-[var(--primary-color)]" data-name="hero-list-i" data-file="pages/home/HomeHero.js"></div>
                </a>
              </div>

              <div className="mt-7 grid grid-cols-3 max-w-[560px] border border-[var(--border)] rounded-lg overflow-hidden bg-white" data-name="hero-stats" data-file="pages/home/HomeHero.js">
                <div className="p-4 border-r border-[var(--border)]" data-name="stat-businesses" data-file="pages/home/HomeHero.js">
                  <p className="text-xl md:text-2xl font-semibold" data-name="stat-businesses-value" data-file="pages/home/HomeHero.js">{totalBusinesses}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1" data-name="stat-businesses-label" data-file="pages/home/HomeHero.js">negocios</p>
                </div>
                <div className="p-4 border-r border-[var(--border)]" data-name="stat-services" data-file="pages/home/HomeHero.js">
                  <p className="text-xl md:text-2xl font-semibold" data-name="stat-services-value" data-file="pages/home/HomeHero.js">{totalServices}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1" data-name="stat-services-label" data-file="pages/home/HomeHero.js">servicios</p>
                </div>
                <div className="p-4" data-name="stat-booking" data-file="pages/home/HomeHero.js">
                  <p className="text-xl md:text-2xl font-semibold" data-name="stat-booking-value">WA</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1" data-name="stat-booking-label" data-file="pages/home/HomeHero.js">reserva</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block" data-name="home-hero-showcase" data-file="pages/home/HomeHero.js">
              {featured ? (
                <button
                  className="surface-rr w-full overflow-hidden text-left shadow-[0_28px_90px_rgba(11,18,32,0.14)] hover:-translate-y-1 transition-transform duration-300"
                  onClick={() => Navigation.goToBusiness(featured.id)}
                  data-name="hero-feature-card"
                  data-file="pages/home/HomeHero.js"
                >
                  <div className="h-[260px] bg-white flex items-center justify-center p-12 border-b border-[var(--border)]" data-name="hero-feature-media" data-file="pages/home/HomeHero.js">
                    {featured.logoUrl ? (
                      <img loading="lazy" decoding="async" src={featured.logoUrl} alt={`Logo de ${featured.nombre}`} className="max-w-full max-h-full object-contain" data-name="hero-feature-logo" data-file="pages/home/HomeHero.js" />
                    ) : (
                      <div className="text-5xl font-semibold text-[var(--primary-color)]" data-name="hero-feature-initials" data-file="pages/home/HomeHero.js">{String(featured.nombre || 'N').trim().slice(0, 2).toUpperCase()}</div>
                    )}
                  </div>
                  <div className="p-5" data-name="hero-feature-body" data-file="pages/home/HomeHero.js">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-color)] font-semibold" data-name="hero-feature-kicker" data-file="pages/home/HomeHero.js">Destacado</p>
                    <p className="mt-2 text-xl font-semibold leading-tight" data-name="hero-feature-name" data-file="pages/home/HomeHero.js">{featured.nombre}</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]" data-name="hero-feature-meta" data-file="pages/home/HomeHero.js">{featured.categoria} ? {featured.ubicacion?.zona || featured.ubicacion?.ciudad}</p>
                    <div className="mt-5 flex items-center justify-between gap-3" data-name="hero-feature-bottom" data-file="pages/home/HomeHero.js">
                      <span className="text-sm text-[var(--text-muted)]" data-name="hero-feature-services" data-file="pages/home/HomeHero.js">{(featured.categoriasCatalogo?.[0]?.items || []).length} servicios</span>
                      <span className="btn-rr btn-primary-rr py-2 px-4 text-sm" data-name="hero-feature-open" data-file="pages/home/HomeHero.js">Ver perfil</span>
                    </div>
                  </div>
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2" data-name="hero-categories" data-file="pages/home/HomeHero.js">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border border-[var(--border)] bg-white text-sm hover:border-[rgba(216,27,96,0.35)] hover:text-[var(--primary-color)] transition-colors"
                onClick={() => Navigation.goToSearch(category, '')}
                data-name="hero-category"
                data-file="pages/home/HomeHero.js"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('HomeHero component error:', error);
    return null;
  }
}

