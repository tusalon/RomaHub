function CrearTiendaPage() {
  try {
    const PROVINCIAS = window.CUBA_PROVINCIAS || [];

    const [form, setForm] = React.useState({
      nombre: '', whatsapp: '', provincia: '', municipio: '', categoria: '', descripcion: '', logo_url: ''
    });
    const [subiendoLogo, setSubiendoLogo] = React.useState(false);
    const [enviando, setEnviando] = React.useState(false);
    const [error, setError] = React.useState('');
    const [credenciales, setCredenciales] = React.useState(null);
    const logoInputRef = React.useRef(null);

    const set = (campo, valor) => { setForm((f) => ({ ...f, [campo]: valor })); setError(''); };

    const onLogo = async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      try {
        setSubiendoLogo(true);
        setError('');
        if (!window.RomaUpload) throw new Error('No se cargó el subidor de imágenes.');
        const url = await window.RomaUpload.subirImagenProducto(file, form.nombre || 'logo-tienda');
        set('logo_url', url);
      } catch (err) {
        setError(err.message || 'No se pudo subir el logo.');
      } finally {
        setSubiendoLogo(false);
      }
    };

    const enviar = async (e) => {
      e.preventDefault();
      setError('');
      const whatsapp = form.whatsapp.replace(/\D/g, '');
      if (form.nombre.trim().length < 2) return setError('Escribe el nombre de tu tienda.');
      if (!/^\d{8}$/.test(whatsapp)) return setError('Escribe los 8 dígitos de tu WhatsApp cubano.');
      if (!form.provincia) return setError('Elige tu provincia.');

      try {
        setEnviando(true);
        const config = { url: String(window.SUPABASE_URL || '').replace(/\/$/, ''), key: window.SUPABASE_ANON_KEY };
        const res = await fetch(`${config.url}/functions/v1/crear-tienda-externa`, {
          method: 'POST',
          headers: { apikey: config.key, Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, whatsapp })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'No se pudo crear la tienda. Intenta de nuevo.');
        setCredenciales({ ...data.acceso, negocioId: data.tienda?.negocio_id, slug: data.tienda?.slug, nombre: data.tienda?.nombre });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError(err.message || 'No se pudo crear la tienda.');
      } finally {
        setEnviando(false);
      }
    };

    const copiar = (texto) => {
      try { navigator.clipboard?.writeText(texto); } catch (e) { /* silencioso */ }
    };

    // ── Pantalla final: credenciales ──
    if (credenciales) {
      return (
        <section className="container-rr pt-6 md:pt-10 max-w-lg" data-name="crear-tienda-ok" data-file="pages/tienda/CrearTiendaPage.js">
          <div className="surface-rr p-6 md:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(31,134,84,0.1)] flex items-center justify-center mx-auto">
              <div className="icon-circle-check text-3xl text-[#1F8654]"></div>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">¡Tu tienda está lista!</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
              Guarda estos datos: son tu acceso para entrar y subir productos. <b>No los pierdas.</b>
            </p>

            <div className="mt-6 space-y-3 text-left">
              <div className="surface-rr p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] font-bold">Usuario (tu WhatsApp)</p>
                  <p className="text-lg font-bold">{credenciales.usuario}</p>
                </div>
                <button type="button" className="btn-rr btn-ghost-rr py-2 px-3 text-xs shrink-0" onClick={() => copiar(credenciales.usuario)}>Copiar</button>
              </div>
              <div className="surface-rr p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] font-bold">Contraseña</p>
                  <p className="text-lg font-bold font-mono tracking-wider">{credenciales.password}</p>
                </div>
                <button type="button" className="btn-rr btn-ghost-rr py-2 px-3 text-xs shrink-0" onClick={() => copiar(credenciales.password)}>Copiar</button>
              </div>
            </div>

            <a className="mt-6 btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" href="login.html">
              Entrar a mi tienda
              <div className="icon-arrow-right text-xl text-white"></div>
            </a>
            <a className="mt-3 inline-block text-xs text-[var(--text-muted)] hover:text-[var(--primary-color)]" href={`business.html?id=${encodeURIComponent(credenciales.negocioId || '')}`}>
              Ver mi tienda pública
            </a>

            <div className="mt-6 pt-6 border-t border-[var(--border)] text-left" data-name="crear-tienda-upsell" data-file="pages/tienda/CrearTiendaPage.js">
              <p className="text-xs font-bold text-[#261D29]">💎 Un paso más: reservas online</p>
              <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
                Tu tienda vende por WhatsApp. Con Rservasroma también puedes tener agenda propia para que tus clientas reserven turno solas, con recordatorios automáticos. 15 días de prueba gratis.
              </p>
              <a
                className="mt-3 btn-rr btn-ghost-rr w-full flex items-center justify-center gap-2 text-xs"
                href={`https://wa.me/15154650340?text=${encodeURIComponent(`Hola, acabo de crear mi tienda "${credenciales.nombre || ''}" en RomaHub y quiero saber cómo activar Rservasroma.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preguntar por Rservasroma
                <div className="icon-arrow-right text-base text-[var(--primary-color)]"></div>
              </a>
            </div>
          </div>
        </section>
      );
    }

    // ── Formulario ──
    return (
      <section className="container-rr pt-6 md:pt-10 max-w-lg" data-name="crear-tienda" data-file="pages/tienda/CrearTiendaPage.js">
        <p className="kicker-rr mb-2">Abre tu tienda gratis</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">Vende en RomaHub</h1>
        <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
          Crea tu tienda en un minuto y empieza a vender productos y cursos por WhatsApp. Sin cuenta, sin costo.
        </p>

        <form className="mt-6 surface-rr p-5 md:p-6 space-y-4" onSubmit={enviar} data-name="crear-tienda-form" data-file="pages/tienda/CrearTiendaPage.js">
          <div className="flex items-center gap-3" data-name="logo-uploader" data-file="pages/tienda/CrearTiendaPage.js">
            <div className="w-16 h-16 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] overflow-hidden flex items-center justify-center shrink-0">
              {subiendoLogo ? (
                <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] border-t-[var(--primary-color)] animate-spin"></div>
              ) : form.logo_url ? (
                <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="icon-image text-2xl text-[var(--text-muted)]"></div>
              )}
            </div>
            <div className="flex-1">
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={onLogo} />
              <button type="button" className="btn-rr btn-ghost-rr w-full text-xs py-2" onClick={() => logoInputRef.current?.click()} disabled={subiendoLogo}>
                {subiendoLogo ? 'Subiendo...' : form.logo_url ? 'Cambiar logo' : 'Subir logo (opcional)'}
              </button>
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Nombre de tu tienda</span>
            <input className="input-rr mt-1" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej: Insumos Yamila" maxLength={80} />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-muted)]">WhatsApp (8 dígitos)</span>
            <div className="mt-1 flex rounded-[var(--radius-md)] border border-[var(--border)] bg-white overflow-hidden">
              <span className="px-3 py-3 text-sm font-semibold text-[var(--primary-color)] border-r border-[var(--border)] bg-[var(--bg-muted)]">+53</span>
              <input className="flex-1 min-w-0 px-3 py-3 text-sm outline-none" type="tel" inputMode="numeric" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="55554444" />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Provincia</span>
              <select
                className="input-rr mt-1 bg-white"
                value={form.provincia}
                onChange={(e) => {
                  // Cambiar de provincia invalida el municipio elegido antes.
                  const provincia = e.target.value;
                  const municipios = (window.CUBA_MUNICIPIOS && window.CUBA_MUNICIPIOS[provincia]) || [];
                  const sigueValido = municipios.some((m) => m === form.municipio);
                  setForm((f) => ({ ...f, provincia, municipio: sigueValido ? f.municipio : '' }));
                  setError('');
                }}
              >
                <option value="">Elige...</option>
                {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Municipio</span>
              <select
                className="input-rr mt-1 bg-white disabled:opacity-60"
                value={form.municipio}
                onChange={(e) => set('municipio', e.target.value)}
                disabled={!form.provincia}
              >
                <option value="">{form.provincia ? 'Elige...' : 'Primero la provincia'}</option>
                {(window.getMunicipiosDeProvincia ? window.getMunicipiosDeProvincia(form.provincia, form.municipio) : []).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-muted)]">¿Qué vendes? (categoría)</span>
            <input className="input-rr mt-1" value={form.categoria} onChange={(e) => set('categoria', e.target.value)} placeholder="Ej: Esmaltes e insumos, Cursos de uñas..." maxLength={60} />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Descripción corta (opcional)</span>
            <textarea className="input-rr mt-1 min-h-[72px] resize-y" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} placeholder="Una línea sobre tu tienda" maxLength={400} />
          </label>

          {error ? <p className="text-sm text-red-600 leading-relaxed">{error}</p> : null}

          <button type="submit" className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" disabled={enviando || subiendoLogo}>
            {enviando ? 'Creando tu tienda...' : 'Crear mi tienda gratis'}
            {!enviando ? <div className="icon-arrow-right text-xl text-white"></div> : null}
          </button>

          <p className="text-[11px] text-[var(--text-muted)] text-center leading-relaxed">
            Al crear tu tienda recibirás un usuario y contraseña para entrar. Podrás subir hasta 40 productos.
          </p>
        </form>
      </section>
    );
  } catch (error) {
    console.error('CrearTiendaPage component error:', error);
    return null;
  }
}
