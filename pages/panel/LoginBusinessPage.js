function LoginBusinessPage() {
  try {
    const [whatsapp, setWhatsapp] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
      const session = window.RomaAuth?.getSession?.();
      if (!session) return;
      window.RomaAuth.getBusinessAccess()
        .then((access) => {
          if (access?.negocio_id) {
            localStorage.setItem('negocioId', access.negocio_id);
            window.location.href = 'panel.html';
          }
        })
        .catch(() => window.RomaAuth?.signOut?.());
    }, []);

    const updateWhatsApp = (value) => {
      setWhatsapp(String(value || '').replace(/\D/g, '').slice(0, 8));
      setError('');
    };

    const submit = async (event) => {
      try {
        event.preventDefault();
        setError('');
        if (!whatsapp.trim() || !password.trim()) {
          setError('Escribe WhatsApp y contraseña para continuar.');
          return;
        }
        if (!window.RomaAuth) throw new Error('No se cargó el acceso de Supabase.');

        setLoading(true);
        await window.RomaAuth.signInWithWhatsApp(whatsapp, password);
        const access = await window.RomaAuth.getBusinessAccess();
        if (!access?.negocio_id) {
          window.RomaAuth.signOut();
          throw new Error('Esta cuenta todavía no tiene un negocio asignado.');
        }
        localStorage.setItem('negocioId', access.negocio_id);
        window.location.href = 'panel.html';
      } catch (err) {
        console.error('LoginBusinessPage.submit error:', err);
        setError(err.message || 'No se pudo iniciar sesión.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <section className="pt-6 md:pt-10" data-name="login-business-page" data-file="pages/panel/LoginBusinessPage.js">
        <div className="container-rr" data-name="login-container" data-file="pages/panel/LoginBusinessPage.js">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-10 items-start" data-name="login-grid" data-file="pages/panel/LoginBusinessPage.js">
            <div data-name="login-copy" data-file="pages/panel/LoginBusinessPage.js">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-color)]" data-name="login-kicker" data-file="pages/panel/LoginBusinessPage.js">
                Panel de negocios
              </p>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.98]" data-name="login-title" data-file="pages/panel/LoginBusinessPage.js">
                Gestiona tu espacio en RomaHub.
              </h1>
              <p className="mt-5 text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-[700px]" data-name="login-subtitle" data-file="pages/panel/LoginBusinessPage.js">
                Entra con el WhatsApp de tu negocio para mantener productos, cursos y datos públicos al día.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3" data-name="login-benefits" data-file="pages/panel/LoginBusinessPage.js">
                {[
                  ['icon-store', 'Perfil', 'Datos, fotos y contacto.'],
                  ['icon-shopping-bag', 'Tienda', 'Productos, cursos y carrito.'],
                  ['icon-map-pin', 'Ubicación', 'Provincia y datos públicos.']
                ].map((item) => (
                  <div key={item[1]} className="surface-rr p-4" data-name="login-benefit" data-file="pages/panel/LoginBusinessPage.js">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--secondary-color)]" data-name="benefit-icon-wrap" data-file="pages/panel/LoginBusinessPage.js">
                      <div className={`${item[0]} text-xl text-[var(--primary-color)]`} data-name="benefit-icon" data-file="pages/panel/LoginBusinessPage.js"></div>
                    </div>
                    <p className="mt-3 text-sm font-semibold" data-name="benefit-title" data-file="pages/panel/LoginBusinessPage.js">{item[1]}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed" data-name="benefit-desc" data-file="pages/panel/LoginBusinessPage.js">{item[2]}</p>
                  </div>
                ))}
              </div>
            </div>

            <form className="surface-rr p-5 md:p-6" onSubmit={submit} data-name="login-form" data-file="pages/panel/LoginBusinessPage.js">
              <h2 className="text-xl font-semibold tracking-tight" data-name="form-title" data-file="pages/panel/LoginBusinessPage.js">Acceso de negocio</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed" data-name="form-subtitle" data-file="pages/panel/LoginBusinessPage.js">
                Usa los 8 dígitos del WhatsApp y la contraseña asignada.
              </p>

              <label className="block mt-5" data-name="whatsapp-field" data-file="pages/panel/LoginBusinessPage.js">
                <span className="text-xs font-semibold text-[var(--text-muted)]">WhatsApp</span>
                <div className="mt-1 flex rounded-lg border border-[var(--border)] bg-white overflow-hidden" data-name="whatsapp-input-wrap" data-file="pages/panel/LoginBusinessPage.js">
                  <span className="px-4 py-3 text-sm font-semibold text-[var(--primary-color)] border-r border-[var(--border)] bg-[var(--secondary-color)]" data-name="country-prefix" data-file="pages/panel/LoginBusinessPage.js">+53</span>
                  <input className="min-w-0 flex-1 px-4 py-3 text-sm outline-none" type="tel" inputMode="numeric" autoComplete="tel" value={whatsapp} onChange={(e) => updateWhatsApp(e.target.value)} placeholder="54066204" data-name="whatsapp-input" data-file="pages/panel/LoginBusinessPage.js" />
                </div>
              </label>

              <label className="block mt-4" data-name="password-field" data-file="pages/panel/LoginBusinessPage.js">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Contraseña</span>
                <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Contraseña del negocio" data-name="password-input" data-file="pages/panel/LoginBusinessPage.js" />
              </label>

              {error ? <p className="mt-3 text-xs text-red-600" data-name="login-error" data-file="pages/panel/LoginBusinessPage.js">{error}</p> : null}

              <button className="mt-5 btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" type="submit" disabled={loading} data-name="login-submit" data-file="pages/panel/LoginBusinessPage.js">
                {loading ? 'Entrando...' : 'Entrar al panel'}
                <div className="icon-arrow-right text-xl text-white" data-name="login-submit-icon" data-file="pages/panel/LoginBusinessPage.js"></div>
              </button>

              <a className="mt-3 btn-rr btn-ghost-rr w-full flex items-center justify-center gap-2" href="register.html" data-name="register-link" data-file="pages/panel/LoginBusinessPage.js">
                Registrar mi negocio
              </a>
            </form>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('LoginBusinessPage component error:', error);
    return null;
  }
}
