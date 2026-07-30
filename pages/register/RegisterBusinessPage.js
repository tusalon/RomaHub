function RegisterBusinessPage() {
  try {
    const ROMA_WHATSAPP = '15154650340';
    const provincias = window.CUBA_PROVINCIAS || [];

    const [form, setForm] = React.useState({
      nombre: '',
      whatsapp: '',
      provincia: '',
      website: ''
    });
    const [enviando, setEnviando] = React.useState(false);
    const [error, setError] = React.useState('');
    const [cuentaExistente, setCuentaExistente] = React.useState(false);
    const [credenciales, setCredenciales] = React.useState(null);
    const [copiado, setCopiado] = React.useState('');

    const actualizar = (campo, valor) => {
      try {
        setForm((actual) => ({ ...actual, [campo]: valor }));
        setError('');
        setCuentaExistente(false);
      } catch (err) {
        console.error('RegisterBusinessPage.actualizar error:', err);
      }
    };

    const actualizarWhatsApp = (valor) => {
      actualizar('whatsapp', String(valor || '').replace(/\D/g, '').slice(0, 8));
    };

    const copiar = async (tipo, texto) => {
      try {
        await navigator.clipboard?.writeText(String(texto || ''));
        setCopiado(tipo);
        window.setTimeout(() => setCopiado(''), 1800);
      } catch (err) {
        console.error('RegisterBusinessPage.copiar error:', err);
      }
    };

    const enviar = async (event) => {
      try {
        event.preventDefault();
        setError('');
        setCuentaExistente(false);

        const nombre = form.nombre.trim();
        const whatsapp = form.whatsapp.replace(/\D/g, '');
        if (nombre.length < 2) {
          setError('Escribe el nombre de tu negocio.');
          return;
        }
        if (!/^\d{8}$/.test(whatsapp)) {
          setError('Escribe los 8 dígitos de tu WhatsApp cubano.');
          return;
        }
        if (!form.provincia) {
          setError('Selecciona la provincia de tu negocio.');
          return;
        }

        const url = String(window.SUPABASE_URL || '').replace(/\/$/, '');
        const key = window.SUPABASE_ANON_KEY || '';
        if (!url || !key) throw new Error('El registro no está disponible en este momento.');

        setEnviando(true);
        const response = await fetch(`${url}/functions/v1/crear-tienda-externa`, {
          method: 'POST',
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre,
            whatsapp,
            provincia: form.provincia,
            municipio: '',
            categoria: '',
            descripcion: '',
            logo_url: '',
            website: form.website
          })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const mensaje = data.error || 'No se pudo crear tu negocio. Intenta de nuevo.';
          setCuentaExistente(response.status === 409 || /ya tiene|registrad|existe/i.test(mensaje));
          throw new Error(mensaje);
        }

        setCredenciales({
          usuario: data.acceso?.usuario || whatsapp,
          password: data.acceso?.password || '',
          recoveryCode: data.acceso?.codigo_recuperacion || '',
          negocioId: data.tienda?.negocio_id || '',
          nombre: data.tienda?.nombre || nombre
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('RegisterBusinessPage.enviar error:', err);
        setError(err.message || 'No se pudo crear tu negocio. Intenta de nuevo.');
      } finally {
        setEnviando(false);
      }
    };

    if (credenciales) {
      return (
        <section className="container-rr pt-8 md:pt-12 pb-12 max-w-2xl" data-name="register-success" data-file="pages/register/RegisterBusinessPage.js">
          <div className="surface-rr p-6 md:p-9 text-center" data-name="register-success-card" data-file="pages/register/RegisterBusinessPage.js">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto" data-name="success-icon-wrap" data-file="pages/register/RegisterBusinessPage.js">
              <div className="icon-circle-check text-3xl text-green-600" data-name="success-icon" data-file="pages/register/RegisterBusinessPage.js"></div>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-green-700" data-name="success-kicker" data-file="pages/register/RegisterBusinessPage.js">Negocio creado</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-[#2A1620]" data-name="success-title" data-file="pages/register/RegisterBusinessPage.js">
              ¡{credenciales.nombre} ya está en RomaHub!
            </h1>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed max-w-lg mx-auto" data-name="success-sub" data-file="pages/register/RegisterBusinessPage.js">
              Guarda estos datos o haz una captura ahora. La contraseña y el código de recuperación se muestran una sola vez y RomaHub no guarda una copia legible.
            </p>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-3 text-left" data-name="success-credentials" data-file="pages/register/RegisterBusinessPage.js">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4" data-name="credential-user" data-file="pages/register/RegisterBusinessPage.js">
                <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] font-bold">Usuario (tu WhatsApp)</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-lg font-extrabold text-[#2A1620]">{credenciales.usuario}</p>
                  <button type="button" className="btn-rr btn-ghost-rr py-2 px-3 text-xs" onClick={() => copiar('usuario', credenciales.usuario)}>
                    {copiado === 'usuario' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4" data-name="credential-password" data-file="pages/register/RegisterBusinessPage.js">
                <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] font-bold">Contraseña</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-lg font-extrabold font-mono tracking-wider text-[#2A1620]">{credenciales.password}</p>
                  <button type="button" className="btn-rr btn-ghost-rr py-2 px-3 text-xs" onClick={() => copiar('password', credenciales.password)}>
                    {copiado === 'password' ? 'Copiada' : 'Copiar'}
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4" data-name="credential-recovery" data-file="pages/register/RegisterBusinessPage.js">
                <p className="text-[11px] uppercase tracking-wide text-amber-800 font-bold">Código de recuperación</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-base font-extrabold font-mono tracking-wide text-[#2A1620] break-all">{credenciales.recoveryCode}</p>
                  <button type="button" className="btn-rr btn-ghost-rr py-2 px-3 text-xs" onClick={() => copiar('recovery', credenciales.recoveryCode)}>
                    {copiado === 'recovery' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center" data-name="success-actions" data-file="pages/register/RegisterBusinessPage.js">
              <a className="btn-rr btn-primary-rr flex items-center justify-center gap-2" href="login.html" data-name="success-login" data-file="pages/register/RegisterBusinessPage.js">
                Entrar a mi negocio
                <div className="icon-arrow-right text-xl text-white"></div>
              </a>
              <a className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" href={`business.html?id=${encodeURIComponent(credenciales.negocioId)}`} data-name="success-public" data-file="pages/register/RegisterBusinessPage.js">
                Ver mi negocio público
              </a>
            </div>

            <div className="mt-7 pt-6 border-t border-[var(--border)] text-left" data-name="success-next" data-file="pages/register/RegisterBusinessPage.js">
              <p className="text-sm font-bold text-[#2A1620]">Tu próximo paso</p>
              <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
                Entra al panel para escribir la descripción, organizar tu perfil y comenzar a publicar productos o cursos.
              </p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <div className="pb-12" data-name="register-business-page" data-file="pages/register/RegisterBusinessPage.js">
        <section className="relative overflow-hidden pt-7 md:pt-12" data-name="register-hero" data-file="pages/register/RegisterBusinessPage.js">
          <div className="hero-blob-rr top-[-150px] right-[-120px]" aria-hidden="true"></div>
          <div className="container-rr relative grid grid-cols-1 lg:grid-cols-[1fr_430px] gap-8 lg:gap-12 items-start" data-name="register-grid" data-file="pages/register/RegisterBusinessPage.js">
            <div className="max-w-2xl" data-name="register-copy" data-file="pages/register/RegisterBusinessPage.js">
              <p className="kicker-rr mb-4" data-name="register-kicker" data-file="pages/register/RegisterBusinessPage.js">RomaHub para negocios</p>
              <h1 className="text-4xl md:text-6xl font-black tracking-[-0.025em] leading-[1.02] text-[#2A1620]" data-name="register-title" data-file="pages/register/RegisterBusinessPage.js">
                Abre gratis tu negocio en <span className="text-[var(--primary-color)]">RomaHub.</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl" data-name="register-subtitle" data-file="pages/register/RegisterBusinessPage.js">
                Si tienes un salón, vendes productos o impartes cursos de belleza, crea tu espacio y llega a personas de toda Cuba. Los pedidos llegan directamente a tu WhatsApp.
              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3" data-name="register-benefits" data-file="pages/register/RegisterBusinessPage.js">
                {[
                  ['1', 'Escribe lo básico', 'Nombre, WhatsApp y provincia.'],
                  ['2', 'Recibe tu acceso', 'Usuario, contraseña y código privado.'],
                  ['3', 'Completa tu perfil', 'Sube fotos, productos y cursos.']
                ].map((item) => (
                  <div key={item[0]} className="surface-rr p-4" data-name="register-benefit" data-file="pages/register/RegisterBusinessPage.js">
                    <div className="w-9 h-9 rounded-full bg-[var(--secondary-color)] text-[var(--primary-color)] flex items-center justify-center text-sm font-extrabold">{item[0]}</div>
                    <p className="mt-3 text-sm font-bold text-[#2A1620]">{item[1]}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">{item[2]}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[rgba(181,0,99,0.20)] bg-[rgba(181,0,99,0.06)] p-5" data-name="rservasroma-note" data-file="pages/register/RegisterBusinessPage.js">
                <div className="flex items-start gap-3">
                  <span className="text-xl" aria-hidden="true">💎</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-[#2A1620]">¿Ya usas Rservasroma?</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
                      No te registres otra vez. En tu panel de administración ve a <b>Configuración → Tienda</b>. Allí encontrarás el usuario y la contraseña para entrar a RomaHub, y tu negocio aparecerá como VIP.
                    </p>
                    <a className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--primary-color)]" href="login.html">
                      Ya tengo mis datos de acceso
                      <div className="icon-arrow-right text-base"></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <form className="surface-rr p-5 md:p-6 lg:sticky lg:top-24" onSubmit={enviar} data-name="register-form" data-file="pages/register/RegisterBusinessPage.js">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary-color)]">Gratis y en un minuto</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#2A1620]" data-name="form-title" data-file="pages/register/RegisterBusinessPage.js">Crea tu negocio</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">Solo te pedimos lo necesario para comenzar.</p>

              <label className="block mt-5" htmlFor="registro-nombre" data-name="field-name" data-file="pages/register/RegisterBusinessPage.js">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Nombre del negocio</span>
                <input id="registro-nombre" className="input-rr mt-1" value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} placeholder="Ej: Bella Nails" maxLength={80} autoComplete="organization" />
              </label>

              <label className="block mt-4" htmlFor="registro-whatsapp" data-name="field-whatsapp" data-file="pages/register/RegisterBusinessPage.js">
                <span className="text-xs font-semibold text-[var(--text-muted)]">WhatsApp del negocio</span>
                <div className="mt-1 flex rounded-[var(--radius-md)] border border-[var(--border)] bg-white overflow-hidden">
                  <span className="px-4 py-3 text-sm font-semibold text-[var(--primary-color)] border-r border-[var(--border)] bg-[var(--bg-muted)]">+53</span>
                  <input id="registro-whatsapp" className="min-w-0 flex-1 px-4 py-3 text-sm outline-none" type="tel" inputMode="numeric" autoComplete="tel" value={form.whatsapp} onChange={(e) => actualizarWhatsApp(e.target.value)} placeholder="55554444" />
                </div>
              </label>

              <label className="block mt-4" htmlFor="registro-provincia" data-name="field-province" data-file="pages/register/RegisterBusinessPage.js">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Provincia</span>
                <select id="registro-provincia" className="input-rr mt-1 bg-white" value={form.provincia} onChange={(e) => actualizar('provincia', e.target.value)}>
                  <option value="">Selecciona tu provincia</option>
                  {provincias.map((provincia) => <option key={provincia} value={provincia}>{provincia}</option>)}
                </select>
              </label>

              <label className="hidden" aria-hidden="true" htmlFor="registro-website">
                Sitio web
                <input id="registro-website" tabIndex="-1" autoComplete="off" value={form.website} onChange={(e) => actualizar('website', e.target.value)} />
              </label>

              {error ? (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3" role="alert" data-name="register-error" data-file="pages/register/RegisterBusinessPage.js">
                  <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                  {cuentaExistente ? (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      <a className="text-xs font-bold text-red-700 underline" href="login.html">Entrar a mi negocio</a>
                      <a className="text-xs font-bold text-red-700 underline" href={`https://wa.me/${ROMA_WHATSAPP}?text=${encodeURIComponent('Hola, necesito ayuda para recuperar el acceso de mi negocio en RomaHub.')}`} target="_blank" rel="noopener noreferrer">Pedir ayuda</a>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <button className="mt-5 btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" type="submit" disabled={enviando} data-name="register-submit" data-file="pages/register/RegisterBusinessPage.js">
                {enviando ? 'Creando tu negocio...' : 'Crear mi negocio gratis'}
                {!enviando ? <div className="icon-arrow-right text-xl text-white"></div> : null}
              </button>

              <p className="mt-3 text-[11px] text-[var(--text-muted)] text-center leading-relaxed">
                Recibirás un usuario, una contraseña y un código privado de recuperación. No necesitas tener Rservasroma.
              </p>
              <p className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)] text-center">
                ¿Ya creaste tu negocio? <a className="font-bold text-[var(--primary-color)]" href="login.html">Entrar</a>
              </p>
            </form>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('RegisterBusinessPage component error:', error);
    return null;
  }
}
