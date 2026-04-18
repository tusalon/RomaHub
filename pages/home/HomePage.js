function HomePage({ initialParams }) {
  try {
    const top = MockData.listTopRated();

    return (
      <div data-name="home-page" data-file="pages/home/HomePage.js">
        <HomeHero initialParams={initialParams} data-name="home-hero" data-file="pages/home/HomePage.js" />
        <IntrigueWall data-name="intrigue-wall" data-file="pages/home/HomePage.js" />
        <TopRatedCarousel items={top} data-name="top-rated" data-file="pages/home/HomePage.js" />

        <section className="mt-12" data-name="home-trust" data-file="pages/home/HomePage.js">
          <div className="container-rr" data-name="home-trust-inner" data-file="pages/home/HomePage.js">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-name="trust-grid" data-file="pages/home/HomePage.js">
              <div className="surface-rr p-5" data-name="trust-1" data-file="pages/home/HomePage.js">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="trust-1-iw" data-file="pages/home/HomePage.js">
                  <div className="icon-circle-check text-xl text-[var(--primary-color)]" data-name="trust-1-i" data-file="pages/home/HomePage.js"></div>
                </div>
                <p className="mt-4 text-sm font-semibold" data-name="trust-1-t" data-file="pages/home/HomePage.js">Reseña verificada</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="trust-1-d" data-file="pages/home/HomePage.js">
                  Cuando ves “Reseña verificada”, significa que el cliente confirmó su cita.
                </p>
              </div>

              <div className="surface-rr p-5" data-name="trust-2" data-file="pages/home/HomePage.js">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="trust-2-iw" data-file="pages/home/HomePage.js">
                  <div className="icon-crown text-xl text-[var(--primary-color)]" data-name="trust-2-i" data-file="pages/home/HomePage.js"></div>
                </div>
                <p className="mt-4 text-sm font-semibold" data-name="trust-2-t" data-file="pages/home/HomePage.js">Distinción VIP</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="trust-2-d" data-file="pages/home/HomePage.js">
                  Negocios VIP destacan con fotos premium, mejor posicionamiento y respuesta más rápida.
                </p>
              </div>

              <div className="surface-rr p-5" data-name="trust-3" data-file="pages/home/HomePage.js">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="trust-3-iw" data-file="pages/home/HomePage.js">
                  <div className="icon-award text-xl text-[var(--primary-color)]" data-name="trust-3-i" data-file="pages/home/HomePage.js"></div>
                </div>
                <p className="mt-4 text-sm font-semibold" data-name="trust-3-t" data-file="pages/home/HomePage.js">Negocio del Mes</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="trust-3-d" data-file="pages/home/HomePage.js">
                  Un badge con presencia: para negocios con calidad y consistencia.
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