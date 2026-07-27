function Header({ currentParams }) {
  try {
    const page = Navigation.getCurrentPage();

    const [open, setOpen] = React.useState(false);
    const [savedCount, setSavedCount] = React.useState(() => window.RomaSaved?.count?.() || 0);

    React.useEffect(() => window.RomaSaved?.subscribe?.(() => setSavedCount(window.RomaSaved?.count?.() || 0)), []);

    const onGoHome = () => {
      try {
        Navigation.goHome();
      } catch (error) {
        console.error('Header.onGoHome error:', error);
      }
    };

    const onGoSearch = () => {
      try {
        const current = currentParams || Navigation.getSearchParams();
        const remembered = window.RomaSaved?.getSearch?.() || {};
        const q = current?.nombre || current?.servicio || current?.ubicacion ? current : remembered;
        Navigation.goToSearch(q?.servicio || '', q?.ubicacion || '', q?.nombre || '', q?.ofertas === true);
      } catch (error) {
        console.error('Header.onGoSearch error:', error);
      }
    };

    return (
      <header className="sticky top-0 z-[60] bg-white/95 backdrop-blur border-b border-[var(--border)]" data-name="header" data-file="components/Header.js">
        <div className="container-rr py-3" data-name="header-inner" data-file="components/Header.js">
          <div className="flex items-center gap-3" data-name="header-row" data-file="components/Header.js">
            <button className="flex items-center gap-2.5" onClick={onGoHome} data-name="brand" data-file="components/Header.js">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(232,51,135,0.20)]" data-name="brand-mark" data-file="components/Header.js">
                <img src="icons/icon-96x96.png" alt="RomaHub" className="w-full h-full object-cover" width="36" height="36" data-name="brand-mark-img" data-file="components/Header.js" />
              </div>
              <div className="leading-tight" data-name="brand-text" data-file="components/Header.js">
                <p className="text-sm font-bold tracking-tight text-[#111827]" data-name="brand-title" data-file="components/Header.js">
                  Roma<span className="text-[#e83387]">Hub</span>
                </p>
                <p className="text-[10px] text-[var(--text-muted)] tracking-wide uppercase" data-name="brand-sub" data-file="components/Header.js">by Rservasroma</p>
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
                Reservas
              </button>
              <a
                className={`btn-rr ${page === 'tienda.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
                href="tienda.html"
                data-name="nav-tienda"
                data-file="components/Header.js"
              >
                Tienda
              </a>
              <a
                className={`btn-rr flex items-center gap-2 ${page === 'favoritos.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
                href="favoritos.html"
                data-name="nav-favorites"
                data-file="components/Header.js"
              >
                <span className="icon-heart text-base"></span>
                Guardados{savedCount ? ` (${savedCount})` : ''}
              </a>
              <a
                className={`btn-rr ${page === 'register.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
                href="register.html"
                data-name="nav-register"
                data-file="components/Header.js"
              >
                Abrir tienda gratis
              </a>
              <a
                className={`btn-rr ${page === 'login.html' || page === 'panel.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
                href="login.html"
                data-name="nav-login"
                data-file="components/Header.js"
              >
                Acceso negocio
              </a>
            </div>

            <button
              className="ml-auto md:hidden w-11 h-11 rounded-xl border border-[var(--border)] bg-white flex items-center justify-center"
              onClick={() => setOpen((v) => !v)}
              data-name="nav-toggle"
              data-file="components/Header.js"
              aria-label="Abrir menú"
            >
              <div className="icon-menu text-xl text-[#e83387]" data-name="nav-toggle-icon" data-file="components/Header.js"></div>
            </button>
          </div>

          {open ? (
            <div className="md:hidden pt-3" data-name="header-mobile" data-file="components/Header.js">
              <div className="surface-rr p-3" data-name="header-mobile-panel" data-file="components/Header.js">
                <div className="grid grid-cols-1 gap-2" data-name="header-mobile-actions" data-file="components/Header.js">
                  <button className="btn-rr btn-ghost-rr w-full flex items-center justify-between" onClick={onGoHome} data-name="m-home" data-file="components/Header.js">
                    <span data-name="m-home-text" data-file="components/Header.js">Inicio</span>
                    <div className="icon-arrow-right text-xl text-[#e83387]" data-name="m-home-icon" data-file="components/Header.js"></div>
                  </button>
                  <button className={`btn-rr w-full flex items-center justify-between ${page === 'search.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`} onClick={onGoSearch} data-name="m-search" data-file="components/Header.js">
                    <span data-name="m-search-text" data-file="components/Header.js">Reservas</span>
                    <div className={`icon-calendar text-xl ${page === 'search.html' ? 'text-white' : 'text-[#e83387]'}`} data-name="m-search-icon" data-file="components/Header.js"></div>
                  </button>
                  <a className={`btn-rr w-full flex items-center justify-between ${page === 'tienda.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`} href="tienda.html" data-name="m-tienda" data-file="components/Header.js">
                    <span data-name="m-tienda-text" data-file="components/Header.js">Tienda</span>
                    <div className={`icon-shopping-bag text-xl ${page === 'tienda.html' ? 'text-white' : 'text-[#e83387]'}`} data-name="m-tienda-icon" data-file="components/Header.js"></div>
                  </a>
                  <a className={`btn-rr w-full flex items-center justify-between ${page === 'favoritos.html' ? 'btn-primary-rr' : 'btn-ghost-rr'}`} href="favoritos.html" data-name="m-favorites" data-file="components/Header.js">
                    <span data-name="m-favorites-text">Guardados{savedCount ? ` (${savedCount})` : ''}</span>
                    <div className={`icon-heart text-xl ${page === 'favoritos.html' ? 'text-white' : 'text-[#e83387]'}`}></div>
                  </a>
                  <a className="btn-rr btn-ghost-rr w-full flex items-center justify-between" href="register.html" data-name="m-register" data-file="components/Header.js">
                    <span data-name="m-register-text" data-file="components/Header.js">Abrir tienda gratis</span>
                    <div className="icon-arrow-right text-xl text-[#e83387]" data-name="m-register-icon" data-file="components/Header.js"></div>
                  </a>
                  <a className="btn-rr btn-ghost-rr w-full flex items-center justify-between" href="login.html" data-name="m-login" data-file="components/Header.js">
                    <span data-name="m-login-text" data-file="components/Header.js">Acceso negocio</span>
                    <div className="icon-log-in text-xl text-[#e83387]" data-name="m-login-icon" data-file="components/Header.js"></div>
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
