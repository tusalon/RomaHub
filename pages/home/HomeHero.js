function HomeHero({ initialParams }) {
  try {
    const businesses = MockData.listBusinesses();
    const totalBusinesses = businesses.length;
    const rankingCount = MockData.listTopRated().length;
    const reservasHoy = MockData.getTodayReservations ? MockData.getTodayReservations() : 0;

    return (
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-2" data-name="home-hero" data-file="pages/home/HomeHero.js">
        <div className="hero-blob-rr top-[-160px] right-[-120px]" aria-hidden="true" data-name="hero-blob" data-file="pages/home/HomeHero.js"></div>
        <div className="container-rr relative grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-6 items-center" data-name="home-hero-inner" data-file="pages/home/HomeHero.js">
          <div className="max-w-3xl hero-anim-rr" data-name="home-hero-copy" data-file="pages/home/HomeHero.js">
            <p className="kicker-rr mb-5" data-name="hero-kicker" data-file="pages/home/HomeHero.js">
              El directorio de la belleza en Cuba
            </p>

            {/* Mismo patron de dos colores que la marca en el header (Roma en
                tinta oscura + Hub en rosa): aqui se reparte la frase, no las
                letras, para no depender de que el texto contenga esas
                palabras exactas. */}
            <h1 className="text-4xl md:text-6xl lg:text-[64px] font-black tracking-[-0.025em] leading-[1.02] text-[#111827]" data-name="hero-title" data-file="pages/home/HomeHero.js">
              La belleza de Cuba en{' '}
              <span className="relative inline-block text-[#e83387]" data-name="hero-title-accent" data-file="pages/home/HomeHero.js">
                un solo lugar.
                <svg
                  className="absolute left-0 -bottom-1 md:-bottom-2 w-full h-2 md:h-3 pointer-events-none"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  data-name="hero-title-underline"
                  data-file="pages/home/HomeHero.js"
                >
                  <path d="M2 9 C 50 2, 150 2, 198 9" stroke="#e83387" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.3" />
                </svg>
              </span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl" data-name="hero-sub" data-file="pages/home/HomeHero.js">
              Salones, manicuristas, barberos y especialistas de toda la isla. Mira sus servicios y precios, y reserva tu turno online.
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
              <a className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" href="crear-tienda.html" data-name="hero-store" data-file="pages/home/HomeHero.js">
                Abrir tienda gratis
                <div className="icon-shopping-bag text-xl text-[#e83387]" data-name="hero-store-i" data-file="pages/home/HomeHero.js"></div>
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

          <div className="relative mx-auto w-full max-w-[280px] lg:max-w-full" data-name="hero-visual" data-file="pages/home/HomeHero.js">
            <div className="relative rounded-[22px] lg:rounded-[28px] border border-[var(--border)] bg-white shadow-[0_16px_40px_rgba(17,24,39,0.12)] lg:shadow-[0_24px_60px_rgba(17,24,39,0.12)] overflow-hidden p-1.5 lg:p-2" data-name="hero-visual-frame" data-file="pages/home/HomeHero.js">
              <img
                loading="eager"
                decoding="async"
                src="https://tusalon.github.io/HouseofRservasRoma/assets/screenshots/cliente-calendario.jpg"
                alt="Clienta reservando turno desde su celular con Rservasroma"
                className="w-full rounded-[16px] lg:rounded-[20px] object-cover object-top"
                style={{ height: 'clamp(240px, 42vh, 520px)' }}
                data-name="hero-visual-img"
                data-file="pages/home/HomeHero.js"
              />
            </div>
            <div className="absolute -left-3 lg:-left-6 bottom-5 lg:bottom-8 surface-rr px-3 py-2 lg:px-4 lg:py-3 flex items-center gap-2 shadow-[0_12px_28px_rgba(17,24,39,0.14)]" data-name="hero-visual-badge" data-file="pages/home/HomeHero.js">
              <span className="text-base lg:text-lg" aria-hidden="true">📅</span>
              <div data-name="hero-visual-badge-copy" data-file="pages/home/HomeHero.js">
                {/* Cifra viva de la propia base de datos. Antes decia "+300
                    negocios activos", pero el directorio de abajo lista los que
                    tienen la suscripcion al dia: la clienta leia una promesa y
                    justo debajo contaba otra cifra distinta. */}
                <p className="text-xs lg:text-sm font-bold text-[#111827] leading-none" data-name="hero-visual-badge-title" data-file="pages/home/HomeHero.js">{totalBusinesses} negocios con reserva online</p>
                <p className="text-[10px] lg:text-[11px] text-[var(--text-muted)] mt-1" data-name="hero-visual-badge-sub" data-file="pages/home/HomeHero.js">agenda real, disponibilidad al dia</p>
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
