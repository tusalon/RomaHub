function LoginBusinessPage() {
  try {
    const SUPPORT_WHATSAPP = '15154650340';
    const [mode, setMode] = React.useState('login');
    const [whatsapp, setWhatsapp] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [recoveryCode, setRecoveryCode] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [website, setWebsite] = React.useState('');
    const [nextRecoveryCode, setNextRecoveryCode] = React.useState('');
    const [copied, setCopied] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
      window.RomaAuth?.ensureSession?.()
        .then((session) => {
          if (!session) return null;
          return window.RomaAuth.getBusinessAccess();
        })
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

    const openMode = (nextMode) => {
      setMode(nextMode);
      setError('');
      setNextRecoveryCode('');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    };

    const submitLogin = async (event) => {
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
        console.error('LoginBusinessPage.submitLogin error:', err);
        setError(err.message || 'No se pudo iniciar sesión.');
      } finally {
        setLoading(false);
      }
    };

    const submitRecovery = async (event) => {
      try {
        event.preventDefault();
        setError('');
        if (!/^\d{8}$/.test(whatsapp)) throw new Error('Escribe los 8 dígitos de tu WhatsApp.');
        if (String(recoveryCode || '').replace(/[^A-Za-z0-9]/g, '').length !== 16) throw new Error('Escribe el código de recuperación completo.');
        if (newPassword.length < 10 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) throw new Error('La nueva contraseña debe tener al menos 10 caracteres, letras y números.');
        if (newPassword !== confirmPassword) throw new Error('Las contraseñas no coinciden.');
        if (!window.RomaAuth) throw new Error('No se cargó el acceso de Supabase.');

        setLoading(true);
        const result = await window.RomaAuth.recoverAccess({ whatsapp, recoveryCode, newPassword, website });
        setNextRecoveryCode(result.codigo_recuperacion || '');
        setPassword('');
        setRecoveryCode('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        console.error('LoginBusinessPage.submitRecovery error:', err);
        setError(err.message || 'No se pudo recuperar el acceso.');
      } finally {
        setLoading(false);
      }
    };

    const copyRecoveryCode = async () => {
      try {
        await navigator.clipboard?.writeText(nextRecoveryCode);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch (err) {
        console.error('LoginBusinessPage.copyRecoveryCode error:', err);
      }
    };

    return (
      <section className="pt-6 md:pt-10" data-name="login-business-page" data-file="pages/panel/LoginBusinessPage.js">
        <div className="container-rr" data-name="login-container" data-file="pages/panel/LoginBusinessPage.js">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-10 items-start" data-name="login-grid" data-file="pages/panel/LoginBusinessPage.js">
            <div data-name="login-copy" data-file="pages/panel/LoginBusinessPage.js">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-color)]" data-name="login-kicker" data-file="pages/panel/LoginBusinessPage.js">Panel de negocios</p>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.98]" data-name="login-title" data-file="pages/panel/LoginBusinessPage.js">Gestiona tu espacio en RomaHub.</h1>
              <p className="mt-5 text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-[700px]" data-name="login-subtitle" data-file="pages/panel/LoginBusinessPage.js">Entra con el WhatsApp de tu negocio para mantener perfil, productos, cursos y datos públicos al día.</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3" data-name="login-benefits" data-file="pages/panel/LoginBusinessPage.js">
                {[
                  ['icon-store', 'Perfil', 'Fotos, descripción y contacto.'],
                  ['icon-shopping-bag', 'Tienda', 'Productos, cursos y pedidos.'],
                  ['icon-shield-check', 'Acceso seguro', 'Recuperación sin guardar contraseñas.']
                ].map((item) => (
                  <div key={item[1]} className="surface-rr p-4" data-name="login-benefit" data-file="pages/panel/LoginBusinessPage.js">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--secondary-color)]" data-name="benefit-icon-wrap" data-file="pages/panel/LoginBusinessPage.js"><div className={`${item[0]} text-xl text-[var(--primary-color)]`} data-name="benefit-icon" data-file="pages/panel/LoginBusinessPage.js"></div></div>
                    <p className="mt-3 text-sm font-semibold" data-name="benefit-title" data-file="pages/panel/LoginBusinessPage.js">{item[1]}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed" data-name="benefit-desc" data-file="pages/panel/LoginBusinessPage.js">{item[2]}</p>
                  </div>
                ))}
              </div>
            </div>

            {mode === 'login' ? (
              <form className="surface-rr p-5 md:p-6" onSubmit={submitLogin} data-name="login-form" data-file="pages/panel/LoginBusinessPage.js">
                <h2 className="text-xl font-semibold tracking-tight" data-name="form-title" data-file="pages/panel/LoginBusinessPage.js">Acceso de negocio</h2>
                <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed" data-name="form-subtitle" data-file="pages/panel/LoginBusinessPage.js">Usa los 8 dígitos del WhatsApp y la contraseña asignada.</p>

                <label className="block mt-5" htmlFor="login-whatsapp" data-name="whatsapp-field" data-file="pages/panel/LoginBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">WhatsApp</span>
                  <div className="mt-1 flex rounded-lg border border-[var(--border)] bg-white overflow-hidden" data-name="whatsapp-input-wrap" data-file="pages/panel/LoginBusinessPage.js">
                    <span className="px-4 py-3 text-sm font-semibold text-[var(--primary-color)] border-r border-[var(--border)] bg-[var(--secondary-color)]" data-name="country-prefix" data-file="pages/panel/LoginBusinessPage.js">+53</span>
                    <input id="login-whatsapp" className="min-w-0 flex-1 px-4 py-3 text-sm outline-none" type="tel" inputMode="numeric" autoComplete="tel" value={whatsapp} onChange={(e) => updateWhatsApp(e.target.value)} placeholder="54066204" data-name="whatsapp-input" data-file="pages/panel/LoginBusinessPage.js" />
                  </div>
                </label>

                <label className="block mt-4" htmlFor="login-password" data-name="password-field" data-file="pages/panel/LoginBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Contraseña</span>
                  <input id="login-password" className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Contraseña del negocio" data-name="password-input" data-file="pages/panel/LoginBusinessPage.js" />
                </label>

                {error ? <p className="mt-3 text-xs text-red-600" role="alert" data-name="login-error" data-file="pages/panel/LoginBusinessPage.js">{error}</p> : null}

                <button className="mt-5 btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" type="submit" disabled={loading} data-name="login-submit" data-file="pages/panel/LoginBusinessPage.js">{loading ? 'Entrando...' : 'Entrar al panel'}<div className="icon-arrow-right text-xl text-white" data-name="login-submit-icon" data-file="pages/panel/LoginBusinessPage.js"></div></button>
                <button className="mt-3 w-full text-sm font-semibold text-[var(--primary-color)] hover:underline" type="button" onClick={() => openMode('recovery')} data-name="forgot-password" data-file="pages/panel/LoginBusinessPage.js">Olvidé mi contraseña</button>
                <a className="mt-3 btn-rr btn-ghost-rr w-full flex items-center justify-center gap-2" href="register.html" data-name="register-link" data-file="pages/panel/LoginBusinessPage.js">Crear mi negocio gratis</a>
              </form>
            ) : (
              <form className="surface-rr p-5 md:p-6" onSubmit={submitRecovery} data-name="recovery-form" data-file="pages/panel/LoginBusinessPage.js">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary-color)]">Recuperación segura</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">Crea una nueva contraseña</h2>

                {nextRecoveryCode ? (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4" data-name="recovery-success" data-file="pages/panel/LoginBusinessPage.js">
                    <p className="text-sm font-bold text-green-800">Contraseña actualizada</p>
                    <p className="mt-1 text-xs text-green-700 leading-relaxed">Guarda tu nuevo código de recuperación. El código anterior ya no funciona.</p>
                    <div className="mt-3 rounded-lg bg-white border border-green-200 p-3 flex items-center justify-between gap-3">
                      <code className="text-sm font-bold tracking-wider text-[#261D29]" data-name="new-recovery-code">{nextRecoveryCode}</code>
                      <button type="button" className="btn-rr btn-ghost-rr py-2 px-3 text-xs" onClick={copyRecoveryCode}>{copied ? 'Copiado' : 'Copiar'}</button>
                    </div>
                    <button type="button" className="mt-4 btn-rr btn-primary-rr w-full" onClick={() => openMode('login')}>Volver e iniciar sesión</button>
                  </div>
                ) : (
                  <React.Fragment>
                    <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">Usa el código que recibiste al crear tu negocio. RomaHub no guarda tu contraseña.</p>

                    <label className="block mt-5" htmlFor="recovery-whatsapp">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">WhatsApp</span>
                      <input id="recovery-whatsapp" className="input-rr mt-1" type="tel" inputMode="numeric" value={whatsapp} onChange={(e) => updateWhatsApp(e.target.value)} placeholder="54066204" />
                    </label>
                    <label className="block mt-4" htmlFor="recovery-code">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">Código de recuperación</span>
                      <input id="recovery-code" className="input-rr mt-1 font-mono uppercase" value={recoveryCode} onChange={(e) => { setRecoveryCode(e.target.value.toUpperCase().slice(0, 19)); setError(''); }} placeholder="ABCD-EFGH-JKLM-NPQR" autoComplete="one-time-code" />
                    </label>
                    <label className="block mt-4" htmlFor="new-password">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">Nueva contraseña</span>
                      <input id="new-password" className="input-rr mt-1" type="password" autoComplete="new-password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(''); }} placeholder="10 caracteres, letras y números" />
                    </label>
                    <label className="block mt-4" htmlFor="confirm-password">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">Repite la contraseña</span>
                      <input id="confirm-password" className="input-rr mt-1" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} />
                    </label>
                    <label className="hidden" aria-hidden="true"><span>Sitio web</span><input tabIndex="-1" aria-hidden="true" autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>

                    {error ? <p className="mt-3 text-xs text-red-600" role="alert" data-name="recovery-error">{error}</p> : null}
                    <button className="mt-5 btn-rr btn-primary-rr w-full" type="submit" disabled={loading} data-name="recovery-submit">{loading ? 'Verificando...' : 'Cambiar contraseña'}</button>
                    <button className="mt-3 btn-rr btn-ghost-rr w-full" type="button" onClick={() => openMode('login')}>Volver al acceso</button>
                    <p className="mt-4 text-xs text-[var(--text-muted)] leading-relaxed text-center">¿Tu cuenta es anterior y no tiene código? <a className="font-bold text-[var(--primary-color)] underline" href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent('Hola, necesito recuperar el acceso de mi negocio en RomaHub.')}`} target="_blank" rel="noopener noreferrer">Solicita ayuda</a>.</p>
                  </React.Fragment>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('LoginBusinessPage component error:', error);
    return null;
  }
}
