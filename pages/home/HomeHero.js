function HomeHero({ initialParams }) {
  try {
    const businesses = MockData.listBusinesses();
    const totalBusinesses = businesses.length;
    const rankingCount = MockData.listTopRated().length;
    const reservasHoy = MockData.getTodayReservations ? MockData.getTodayReservations() : 0;

    return (
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-2" data-name="home-hero" data-file="pages/home/HomeHero.js">
        <div className="hero-blob-rr top-[-160px] right-[-120px]" aria-hidden="true" data-name="hero-blob" data-file="pages/home/HomeHero.js"></div>
        <div className="container-rr relative" data-name="home-hero-inner" data-file="pages/home/HomeHero.js">
          <div className="max-w-3xl hero-anim-rr" data-name="home-hero-copy" data-file="pages/home/HomeHero.js">
            <p className="kicker-rr mb-5" data-name="hero-kicker" data-file="pages/home/HomeHero.js">
              El directorio de la belleza en Cuba
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-[64px] font-black tracking-[-0.025em] leading-[1.02] text-[#111827]" data-name="hero-title" data-file="pages/home/HomeHero.js">
              La belleza de Cuba en un solo lugar.
            </h1>
            <p className="mt-5 text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl" data-name="hero-sub" data-file="pages/home/HomeHero.js">
              Descubre salones, manicuristas, barberos y especialistas rankeados por valoraciones reales de clientas verificadas.
            </p>

            <div className="mt-8 max-w-[760px]" data-name="hero-search" data-file="pages/home/HomeHero.js">
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
                Ver directorio completo
                <div className="icon-arrow-right text-xl text-white" data-name="hero-explore-i" data-file="pages/home/HomeHero.js"></div>
              </button>
              <a className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" href="register.html" data-name="hero-list" data-file="pages/home/HomeHero.js">
                Registrar mi negocio
                <div className="icon-sparkles text-xl text-[#e83387]" data-name="hero-list-i" data-file="pages/home/HomeHero.js"></div>
              </a>
            </div>

            <div className="mt-7 flex gap-1" data-name="hero-stats" data-file="pages/home/HomeHero.js">
              <div className="px-4 py-3 rounded-l-xl border border-[var(--border)] bg-white" data-name="stat-businesses" data-file="pages/home/HomeHero.js">
                <p className="text-xl md:text-2xl font-bold text-[#111827]" data-name="stat-businesses-value" data-file="pages/home/HomeHero.js"><span className="countup-rr" data-target={totalBusinesses}>{totalBusinesses}</span></p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5" data-name="stat-businesses-label" data-file="pages/home/HomeHero.js">negocios</p>
              </div>
              <div className="px-4 py-3 border border-[var(--border)] bg-white" data-name="stat-ranked" data-file="pages/home/HomeHero.js">
                <p className="text-xl md:text-2xl font-bold text-[#e83387]" data-name="stat-ranked-value" data-file="pages/home/HomeHero.js"><span className="countup-rr" data-target={rankingCount}>{rankingCount}</span></p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5" data-name="stat-ranked-label" data-file="pages/home/HomeHero.js">en el ranking</p>
              </div>
              <div className="px-4 py-3 rounded-r-xl border border-[var(--border)] bg-white" data-name="stat-today" data-file="pages/home/HomeHero.js">
                <p className="text-xl md:text-2xl font-bold text-[#111827]" data-name="stat-today-value" data-file="pages/home/HomeHero.js"><span className="countup-rr" data-target={Number(reservasHoy || 0)}>{Number(reservasHoy || 0)}</span></p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5" data-name="stat-today-label" data-file="pages/home/HomeHero.js">reservas hoy</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('HomeHero component error:', error);
    return null;
  }
}
