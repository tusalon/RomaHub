function HomeHero({ initialParams }) {
  try {
    return (
      <section className="pt-10 md:pt-16" data-name="home-hero" data-file="pages/home/HomeHero.js">
        <div className="container-rr" data-name="home-hero-inner" data-file="pages/home/HomeHero.js">
          <div className="max-w-[920px] mx-auto text-center" data-name="home-hero-content" data-file="pages/home/HomeHero.js">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 chip-rr text-xs text-[var(--text-muted)] bg-[#FDF2F8]" data-name="hero-chip" data-file="pages/home/HomeHero.js">
              <div className="icon-shield text-base text-[var(--primary-color)]" data-name="hero-chip-icon" data-file="pages/home/HomeHero.js"></div>
              <span data-name="hero-chip-text" data-file="pages/home/HomeHero.js">Reseñas verificadas y negocios destacados en Cuba</span>
            </div>

            <h1 className="mt-6 text-3xl md:text-5xl font-semibold tracking-tight text-balance" data-name="hero-title" data-file="pages/home/HomeHero.js">
              Tu próxima cita se siente <span className="italic" data-name="hero-italic" data-file="pages/home/HomeHero.js">premium</span>.
            </h1>
            <p className="mt-4 text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-[740px] mx-auto" data-name="hero-sub" data-file="pages/home/HomeHero.js">
              Busca un servicio, una academia o un estudio en tu zona. Explora con calma: el Muro de la Intriga está diseñado para que descubras lo mejor sin ruido.
            </p>

            <div className="mt-8" data-name="hero-search" data-file="pages/home/HomeHero.js">
              <SearchBar
                initialServicio={initialParams?.servicio || ''}
                initialUbicacion={initialParams?.ubicacion || ''}
                compact={false}
                data-name="hero-searchbar"
                data-file="pages/home/HomeHero.js"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-muted)]" data-name="hero-meta" data-file="pages/home/HomeHero.js">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(11,18,32,0.03)] border border-[var(--border)]" data-name="meta-1" data-file="pages/home/HomeHero.js">
                <div className="icon-clock text-base text-[var(--primary-color)]" data-name="meta-1-i" data-file="pages/home/HomeHero.js"></div>
                Respuesta rápida por WhatsApp
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(11,18,32,0.03)] border border-[var(--border)]" data-name="meta-2" data-file="pages/home/HomeHero.js">
                <div className="icon-sparkles text-base text-[var(--primary-color)]" data-name="meta-2-i" data-file="pages/home/HomeHero.js"></div>
                VIP: experiencia boutique
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(11,18,32,0.03)] border border-[var(--border)]" data-name="meta-3" data-file="pages/home/HomeHero.js">
                <div className="icon-circle-check text-base text-[var(--primary-color)]" data-name="meta-3-i" data-file="pages/home/HomeHero.js"></div>
                “Reseña verificada” de clientes reales
              </span>
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