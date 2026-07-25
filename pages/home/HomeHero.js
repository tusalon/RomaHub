function HomeHero({ initialParams }) {
  try {
    const businesses = MockData.listBusinesses();
    const totalBusinesses = businesses.length;
    const reservasHoy = MockData.getTodayReservations ? MockData.getTodayReservations() : 0;
    // La cara de RomaHub debe mostrar RomaHub, no una captura prestada de
    // Rservasroma (la app de reservas de otro producto). En vez de una
    // imagen fija que hay que retocar a mano cada vez, se renderiza un
    // negocio real y vivo de la propia base de datos: nunca queda
    // desactualizada y siempre es 100% cierta.
    const featured = MockData.listWeeklyFeatured()[0] || businesses[0] || null;
    const featuredEsTendencia = Boolean(featured?.reservasSemana > 0);

    return (
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-2" data-name="home-hero" data-file="pages/home/HomeHero.js">
        <div className="hero-blob-rr top-[-160px] right-[-120px]" aria-hidden="true" data-name="hero-blob" data-file="pages/home/HomeHero.js"></div>
        <div className="container-rr relative grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-6 items-center" data-name="home-hero-inner" data-file="pages/home/HomeHero.js">
          <div className="max-w-3xl hero-anim-rr" data-name="home-hero-copy" data-file="pages/home/HomeHero.js">
            {/* Insignia honesta de apertura: RomaHub de verdad acaba de
                lanzarse, asi que decirlo no es una afirmacion exagerada.
                Nada de urgencia falsa ("solo por tiempo limitado") porque
                el directorio gratis no tiene fecha de vencimiento. */}
            <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full bg-[rgba(232,51,135,0.08)] border border-[rgba(232,51,135,0.18)]" data-name="hero-launch-badge" data-file="pages/home/HomeHero.js">
              <span aria-hidden="true">🎉</span>
              <span className="text-xs font-bold text-[#e83387]" data-name="hero-launch-badge-text" data-file="pages/home/HomeHero.js">Recién inaugurado</span>
            </div>

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
              {/* Antes esto era un segundo boton rosa del mismo tamano que
                  "Ver negocios" de arriba, justo debajo — dos CTAs primarios
                  pegados compiten entre si y parecen el mismo boton repetido.
                  Como enlace de texto queda claro que es la ruta alterna
                  (sin elegir provincia), no una accion igual de importante. */}
              <button
                className="mt-3 text-sm font-semibold text-[var(--text-muted)] hover:text-[#e83387] transition-colors inline-flex items-center gap-1.5"
                onClick={() => Navigation.goToSearch('', '')}
                data-name="hero-explore"
                data-file="pages/home/HomeHero.js"
              >
                o mira el directorio completo sin filtrar
                <div className="icon-arrow-right text-base" data-name="hero-explore-i" data-file="pages/home/HomeHero.js"></div>
              </button>
            </div>

            {/* Las clientas y los negocios son dos publicos distintos: antes
                "Registrar negocio" y "Abrir tienda" tenian el mismo peso
                visual que la busqueda de arriba, como si fueran la misma
                prioridad. Agrupados y etiquetados queda claro que es una
                invitacion aparte, para quien tiene un salon. */}
            <div className="mt-6 surface-rr p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between" data-name="hero-business-cta" data-file="pages/home/HomeHero.js">
              <div data-name="hero-business-copy" data-file="pages/home/HomeHero.js">
                <p className="text-sm font-bold text-[#111827]" data-name="hero-business-title" data-file="pages/home/HomeHero.js">¿Tienes un salón o negocio de belleza?</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5" data-name="hero-business-sub" data-file="pages/home/HomeHero.js">Aparece en RomaHub gratis, sin cuenta ni compromiso.</p>
              </div>
              <div className="flex gap-2 shrink-0" data-name="hero-business-actions" data-file="pages/home/HomeHero.js">
                <a className="btn-rr btn-ghost-rr text-sm py-2 px-4 flex items-center gap-1.5" href="register.html" data-name="hero-list" data-file="pages/home/HomeHero.js">
                  Registrar negocio
                  <div className="icon-sparkles text-base text-[#e83387]" data-name="hero-list-i" data-file="pages/home/HomeHero.js"></div>
                </a>
                <a className="btn-rr btn-ghost-rr text-sm py-2 px-4 flex items-center gap-1.5" href="crear-tienda.html" data-name="hero-store" data-file="pages/home/HomeHero.js">
                  Abrir tienda
                  <div className="icon-shopping-bag text-base text-[#e83387]" data-name="hero-store-i" data-file="pages/home/HomeHero.js"></div>
                </a>
              </div>
            </div>

            <div className="mt-7 flex gap-1" data-name="hero-stats" data-file="pages/home/HomeHero.js">
              <div className="px-4 py-3 rounded-l-xl border border-[var(--border)] bg-white" data-name="stat-businesses" data-file="pages/home/HomeHero.js">
                <p className="text-xl md:text-2xl font-bold text-[#111827]" data-name="stat-businesses-value" data-file="pages/home/HomeHero.js"><span className="countup-rr" data-target={totalBusinesses}>{totalBusinesses}</span></p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5" data-name="stat-businesses-label" data-file="pages/home/HomeHero.js">negocios</p>
              </div>
              {/* "en el ranking" mostraba 0: todavia no hay valoraciones
                  verificadas cargadas, y mas abajo en esta misma pagina la
                  seccion de Ranking ya se oculta cuando no hay datos (ver
                  HomePage.js). Poner un 0 grande en el hero de apertura
                  contradice esa misma regla. Se cambia por un dato que si
                  es verdad ahora: RomaHub no cobra por aparecer. */}
              <div className="px-4 py-3 border border-[var(--border)] bg-white" data-name="stat-free" data-file="pages/home/HomeHero.js">
                <p className="text-xl md:text-2xl font-bold text-[#e83387]" data-name="stat-free-value" data-file="pages/home/HomeHero.js">Gratis</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5" data-name="stat-free-label" data-file="pages/home/HomeHero.js">para negocios</p>
              </div>
              <div className="px-4 py-3 rounded-r-xl border border-[var(--border)] bg-white" data-name="stat-today" data-file="pages/home/HomeHero.js">
                <p className="text-xl md:text-2xl font-bold text-[#111827]" data-name="stat-today-value" data-file="pages/home/HomeHero.js"><span className="countup-rr" data-target={Number(reservasHoy || 0)}>{Number(reservasHoy || 0)}</span></p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5" data-name="stat-today-label" data-file="pages/home/HomeHero.js">reservas hoy</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[300px] lg:max-w-full" data-name="hero-visual" data-file="pages/home/HomeHero.js">
            {featured ? (
              <a
                className="group block relative rounded-[22px] lg:rounded-[28px] border border-[var(--border)] bg-white shadow-[0_16px_40px_rgba(17,24,39,0.12)] lg:shadow-[0_24px_60px_rgba(17,24,39,0.12)] overflow-hidden"
                href={`business.html?id=${encodeURIComponent(featured.id)}`}
                data-name="hero-visual-frame"
                data-file="pages/home/HomeHero.js"
              >
                <div className="relative h-[220px] lg:h-[300px] bg-[#F3F4F6] overflow-hidden" data-name="hero-visual-cover" data-file="pages/home/HomeHero.js">
                  {featured.portadaUrl ? (
                    <img
                      loading="eager"
                      decoding="async"
                      src={featured.portadaUrl}
                      alt={`Imagen de ${featured.nombre}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      data-name="hero-visual-img"
                      data-file="pages/home/HomeHero.js"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" data-name="hero-visual-gradient" data-file="pages/home/HomeHero.js"></div>

                  {featured.esRservasroma ? (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-bold text-[#111827] shadow-sm" data-name="hero-visual-diamond" data-file="pages/home/HomeHero.js">
                      💎 Verificado
                    </span>
                  ) : null}

                  {/* Se etiqueta con la razon real de por que se muestra este
                      negocio: si tuvo reservas esta semana, esa cifra en vivo;
                      si no, un texto honesto sin inventar actividad. */}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-bold text-[#e83387] shadow-sm" data-name="hero-visual-kicker" data-file="pages/home/HomeHero.js">
                    {featuredEsTendencia ? `🔥 ${featured.reservasSemana} reservas esta semana` : '✨ Negocio del directorio'}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5" data-name="hero-visual-identity" data-file="pages/home/HomeHero.js">
                    <div className="w-10 h-10 rounded-xl border-2 border-white bg-white overflow-hidden shadow-sm shrink-0 flex items-center justify-center" data-name="hero-visual-logo" data-file="pages/home/HomeHero.js">
                      {featured.logoUrl ? (
                        <img loading="lazy" decoding="async" src={featured.logoUrl} alt={`Logo de ${featured.nombre}`} className="w-full h-full object-contain" data-name="hero-visual-logo-img" data-file="pages/home/HomeHero.js" />
                      ) : (
                        <span className="text-sm font-bold text-[#e83387]" data-name="hero-visual-logo-initials" data-file="pages/home/HomeHero.js">
                          {String(featured.nombre || 'N').trim().slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0" data-name="hero-visual-name-wrap" data-file="pages/home/HomeHero.js">
                      <p className="text-white text-sm font-bold leading-tight truncate" data-name="hero-visual-name" data-file="pages/home/HomeHero.js">{featured.nombre}</p>
                      <p className="text-white/80 text-[11px] leading-tight truncate" data-name="hero-visual-cat" data-file="pages/home/HomeHero.js">{[featured.categoria, featured.ubicacionCorta].filter(Boolean).join(' · ')}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between gap-3" data-name="hero-visual-footer" data-file="pages/home/HomeHero.js">
                  {featured.estrellas > 0 ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#111827]" data-name="hero-visual-rating" data-file="pages/home/HomeHero.js">
                      <span className="icon-star text-base text-[#F59E0B]" aria-hidden="true"></span>
                      {Number(featured.estrellas).toFixed(1)}
                      <span className="text-xs font-normal text-[var(--text-muted)]">({featured.totalValoraciones})</span>
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]" data-name="hero-visual-rating" data-file="pages/home/HomeHero.js">Nuevo en el directorio</span>
                  )}
                  <span className="text-xs font-bold text-[#e83387] inline-flex items-center gap-1" data-name="hero-visual-cta" data-file="pages/home/HomeHero.js">
                    Ver perfil
                    <div className="icon-arrow-right text-sm" aria-hidden="true"></div>
                  </span>
                </div>
              </a>
            ) : null}

            {/* Ya no va superpuesta sobre la tarjeta (flujo normal, no
                position:absolute): antes calculaba un offset fijo asumiendo
                una imagen de alto fijo, pero ahora la tarjeta tiene foto +
                pie con rating/nombre de largo variable, y medido en el
                navegador el offset fijo si se metia encima del texto del
                pie. En flujo normal nunca puede solaparse, sin importar
                cuanto mida el nombre del negocio destacado. */}
            <div className="mt-3 mx-2 lg:mx-4 surface-rr px-3 py-2 lg:px-4 lg:py-3 flex items-center gap-2 shadow-[0_12px_28px_rgba(17,24,39,0.14)]" data-name="hero-visual-badge" data-file="pages/home/HomeHero.js">
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
