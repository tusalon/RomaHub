function Header({ currentParams }) {
  try {
    const page = Navigation.getCurrentPage();

    const [open, setOpen] = React.useState(false);

    const onGoHome = () => {
      try {
        Navigation.goHome('muro');
      } catch (error) {
        console.error('Header.onGoHome error:', error);
      }
    };

    const onGoSearch = () => {
      try {
        const q = currentParams || Navigation.getSearchParams();
        Navigation.goToSearch(q?.servicio || '', q?.ubicacion || '');
      } catch (error) {
        console.error('Header.onGoSearch error:', error);
      }
    };

    return (
      <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur border-b border-[var(--border)]" data-name="header" data-file="components/Header.js">
        <div className="container-rr py-4" data-name="header-inner" data-file="components/Header.js">
          <div className="flex items-center gap-3" data-name="header-row" data-file="components/Header.js">
            <button className="flex items-center gap-3" onClick={onGoHome} data-name="brand" data-file="components/Header.js">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-[rgba(216,27,96,0.25)] bg-gradient-to-r from-[#D81B60] to-[#F48FB1] flex items-center justify-center" data-name="brand-mark" data-file="components/Header.js">
                <img
                  src="https://app.trickle.so/storage/public/images/usr_1dec1efb58008001/55d88a3b-fbdf-46a8-bc34-5c6dac55ec46.png"
                  alt="Logo de Rservas.Roma"
                  className="w-full h-full object-cover"
                  data-name="brand-mark-img"
                  data-file="components/Header.js"
                />
              </div>
              <div className="leading-tight" data-name="brand-text" data-file="components/Header.js">
                <p className="text-sm font-semibold tracking-tight text-[#1F2937]" data-name="brand-title" data-file="components/Header.js">Rservas.Roma</p>
                <p className="text-xs text-[var(--text-muted)]" data-name="brand-sub" data-file="components/Header.js">Marketplace</p>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-2 ml-auto" data-name="header-actions-desktop" data-file="components/Header.js">
              <button
                className={`btn-rr ${page === 'index.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
                onClick={onGoHome}
                data-name="nav-home"
                data-file="components/Header.js"
              >
                Inicio
              </button>
              <button
                className={`btn-rr ${page === 'search.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
                onClick={onGoSearch}
                data-name="nav-search"
                data-file="components/Header.js"
              >
                Explorar
              </button>
              <a
                className="btn-rr btn-ghost-rr"
                href="business.html?id=roma-001"
                data-name="nav-demo"
                data-file="components/Header.js"
              >
                Ver demo
              </a>
            </div>

            <button
              className="ml-auto md:hidden w-11 h-11 rounded-2xl border border-[var(--border)] bg-white flex items-center justify-center"
              onClick={() => setOpen((v) => !v)}
              data-name="nav-toggle"
              data-file="components/Header.js"
              aria-label="Abrir menú"
            >
              <div className="icon-menu text-xl text-[var(--primary-color)]" data-name="nav-toggle-icon" data-file="components/Header.js"></div>
            </button>
          </div>

          {open ? (
            <div className="md:hidden pt-3" data-name="header-mobile" data-file="components/Header.js">
              <div className="surface-rr p-3" data-name="header-mobile-panel" data-file="components/Header.js">
                <div className="grid grid-cols-1 gap-2" data-name="header-mobile-actions" data-file="components/Header.js">
                  <button className="btn-rr btn-ghost-rr w-full flex items-center justify-between" onClick={onGoHome} data-name="m-home" data-file="components/Header.js">
                    <span data-name="m-home-text" data-file="components/Header.js">Inicio</span>
                    <div className="icon-arrow-right text-xl text-[var(--primary-color)]" data-name="m-home-icon" data-file="components/Header.js"></div>
                  </button>
                  <button className="btn-rr btn-primary-rr w-full flex items-center justify-between" onClick={onGoSearch} data-name="m-search" data-file="components/Header.js">
                    <span data-name="m-search-text" data-file="components/Header.js">Explorar</span>
                    <div className="icon-arrow-right text-xl text-white" data-name="m-search-icon" data-file="components/Header.js"></div>
                  </button>
                  <a className="btn-rr btn-ghost-rr w-full flex items-center justify-between" href="business.html?id=roma-001" data-name="m-demo" data-file="components/Header.js">
                    <span data-name="m-demo-text" data-file="components/Header.js">Ver demo</span>
                    <div className="icon-external-link text-xl text-[var(--primary-color)]" data-name="m-demo-icon" data-file="components/Header.js"></div>
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}