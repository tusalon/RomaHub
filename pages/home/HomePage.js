function HomePage({ initialParams }) {
  try {
    const top = MockData.listTopRated();
    const featured = MockData.listWeeklyFeatured();
    const reviews = MockData.listRomaReviews();

    return (
      <div data-name="home-page" data-file="pages/home/HomePage.js">
        <HomeHero initialParams={initialParams} data-name="home-hero" data-file="pages/home/HomePage.js" />
        <BusinessRail
          title="Destacados"
          subtitle=""
          badge="Mas reservados esta semana"
          items={featured}
          data-name="weekly-featured"
          data-file="pages/home/HomePage.js"
        />
        <AllBusinessesSection data-name="all-businesses-section" data-file="pages/home/HomePage.js" />
        <BusinessRail
          title="Mejor valorados"
          subtitle=""
          badge="Clientes felices"
          items={top}
          emptyText="Aun no hay resenas publicas."
          data-name="top-rated"
          data-file="pages/home/HomePage.js"
        />
        <RomaReviewsRail reviews={reviews} data-name="roma-reviews" data-file="pages/home/HomePage.js" />

        <section className="mt-12" data-name="home-trust" data-file="pages/home/HomePage.js">
          <div className="container-rr" data-name="home-trust-inner" data-file="pages/home/HomePage.js">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-name="trust-grid" data-file="pages/home/HomePage.js">
              <div className="surface-rr p-5" data-name="trust-1" data-file="pages/home/HomePage.js">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="trust-1-iw" data-file="pages/home/HomePage.js">
                  <div className="icon-circle-check text-xl text-[var(--primary-color)]" data-name="trust-1-i" data-file="pages/home/HomePage.js"></div>
                </div>
                <p className="mt-4 text-sm font-semibold" data-name="trust-1-t" data-file="pages/home/HomePage.js">Resena verificada</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="trust-1-d" data-file="pages/home/HomePage.js">
                  Cuando ves "Resena verificada", significa que el cliente confirmo su cita.
                </p>
              </div>

              <div className="surface-rr p-5" data-name="trust-2" data-file="pages/home/HomePage.js">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="trust-2-iw" data-file="pages/home/HomePage.js">
                  <div className="icon-crown text-xl text-[var(--primary-color)]" data-name="trust-2-i" data-file="pages/home/HomePage.js"></div>
                </div>
                <p className="mt-4 text-sm font-semibold" data-name="trust-2-t" data-file="pages/home/HomePage.js">Distincion VIP</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="trust-2-d" data-file="pages/home/HomePage.js">
                  Negocios VIP destacan con fotos premium, mejor posicionamiento y respuesta mas rapida.
                </p>
              </div>

              <div className="surface-rr p-5" data-name="trust-3" data-file="pages/home/HomePage.js">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="trust-3-iw" data-file="pages/home/HomePage.js">
                  <div className="icon-award text-xl text-[var(--primary-color)]" data-name="trust-3-i" data-file="pages/home/HomePage.js"></div>
                </div>
                <p className="mt-4 text-sm font-semibold" data-name="trust-3-t" data-file="pages/home/HomePage.js">Perfil premium</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed" data-name="trust-3-d" data-file="pages/home/HomePage.js">
                  Una ficha clara, elegante y lista para convertir visitas en reservas.
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

