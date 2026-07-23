function RegisterBusinessPage() {
  try {
    const ROMA_WHATSAPP = '5354066204';
    const provincias = [
      'Pinar del Río',
      'Artemisa',
      'La Habana',
      'Mayabeque',
      'Matanzas',
      'Cienfuegos',
      'Villa Clara',
      'Sancti Spíritus',
      'Ciego de Ávila',
      'Camagüey',
      'Las Tunas',
      'Holguín',
      'Granma',
      'Santiago de Cuba',
      'Guantánamo',
      'Isla de la Juventud'
    ];

    const [form, setForm] = React.useState({
      plan: 'VIP',
      tipo: 'Mixto',
      nombreNegocio: '',
      propietaria: '',
      whatsapp: '',
      email: '',
      provincia: '',
      municipio: '',
      direccion: '',
      categoria: '',
      instagram: '',
      descripcion: '',
      quiereTienda: true,
      quiereCursos: false
    });
    const [errors, setErrors] = React.useState({});
    const [sent, setSent] = React.useState(false);

    const update = (field, value) => {
      try {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
      } catch (error) {
        console.error('RegisterBusinessPage.update error:', error);
      }
    };

    const validate = () => {
      const next = {};
      if (!form.nombreNegocio.trim()) next.nombreNegocio = 'Escribe el nombre del negocio.';
      if (!form.propietaria.trim()) next.propietaria = 'Escribe el nombre de contacto.';
      if (!/^[0-9]{8}$/.test(form.whatsapp.trim())) next.whatsapp = 'El WhatsApp debe tener 8 dígitos.';
      if (!form.provincia) next.provincia = 'Selecciona una provincia.';
      if (!form.categoria.trim()) next.categoria = 'Escribe la categoría principal.';
      setErrors(next);
      return Object.keys(next).length === 0;
    };

    const buildMessage = () => {
      const lines = [
        'Hola, quiero registrar mi negocio en RomaHub.',
        '',
        `Plan solicitado: ${form.plan}`,
        `Tipo de negocio: ${form.tipo}`,
        `Nombre del negocio: ${form.nombreNegocio}`,
        `Propietaria/contacto: ${form.propietaria}`,
        `WhatsApp del negocio: ${form.whatsapp}`,
        `Correo: ${form.email || 'No informado'}`,
        `Provincia: ${form.provincia}`,
        `Municipio o zona: ${form.municipio || 'No informado'}`,
        `Dirección: ${form.direccion || 'No informada'}`,
        `Categoría principal: ${form.categoria}`,
        `Instagram/Facebook: ${form.instagram || 'No informado'}`,
        `Quiere tienda: ${form.quiereTienda ? 'Sí' : 'No'}`,
        `Quiere cursos: ${form.quiereCursos ? 'Sí' : 'No'}`,
        '',
        `Descripción: ${form.descripcion || 'No informada'}`
      ];
      return lines.join('\n');
    };

    const submit = (event) => {
      try {
        event.preventDefault();
        if (!validate()) return;
        setSent(true);
        const text = encodeURIComponent(buildMessage());
        window.open(`https://wa.me/${ROMA_WHATSAPP}?text=${text}`, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('RegisterBusinessPage.submit error:', error);
      }
    };

    const FieldError = ({ name }) => {
      try {
        return errors[name] ? <p className="mt-1 text-xs text-red-600" data-name="field-error" data-file="pages/register/RegisterBusinessPage.js">{errors[name]}</p> : null;
      } catch (error) {
        console.error('RegisterBusinessPage.FieldError error:', error);
        return null;
      }
    };

    return (
      <div data-name="register-business-page" data-file="pages/register/RegisterBusinessPage.js">
        <section className="pt-6 md:pt-10" data-name="register-hero" data-file="pages/register/RegisterBusinessPage.js">
          <div className="container-rr" data-name="register-hero-inner" data-file="pages/register/RegisterBusinessPage.js">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-10 items-start" data-name="register-grid" data-file="pages/register/RegisterBusinessPage.js">
              <div data-name="register-copy" data-file="pages/register/RegisterBusinessPage.js">
                <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-color)]" data-name="register-kicker" data-file="pages/register/RegisterBusinessPage.js">
                  RomaHub para negocios
                </p>
                <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.98]" data-name="register-title" data-file="pages/register/RegisterBusinessPage.js">
                  Aparece en el directorio de belleza de Cuba.
                </h1>
                <p className="mt-5 text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-[700px]" data-name="register-subtitle" data-file="pages/register/RegisterBusinessPage.js">
                  Solicita tu entrada, organiza tu perfil y prepara tu tienda para vender productos, cursos o servicios con cierre directo por WhatsApp.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3" data-name="register-benefits" data-file="pages/register/RegisterBusinessPage.js">
                  {[
                    ['icon-map-pin', 'Mapa por provincia', 'Aparece donde tus clientes te buscan.'],
                    ['icon-shopping-bag', 'Mini tienda', 'Productos y cursos listos para carrito.'],
                    ['icon-star', 'Perfil verificado', 'Una presencia seria dentro de RomaHub.']
                  ].map((item) => (
                    <div key={item[1]} className="surface-rr p-4" data-name="register-benefit" data-file="pages/register/RegisterBusinessPage.js">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--secondary-color)]" data-name="benefit-icon-wrap" data-file="pages/register/RegisterBusinessPage.js">
                        <div className={`${item[0]} text-xl text-[var(--primary-color)]`} data-name="benefit-icon" data-file="pages/register/RegisterBusinessPage.js"></div>
                      </div>
                      <p className="mt-3 text-sm font-semibold" data-name="benefit-title" data-file="pages/register/RegisterBusinessPage.js">{item[1]}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed" data-name="benefit-desc" data-file="pages/register/RegisterBusinessPage.js">{item[2]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="surface-rr p-5 md:p-6" data-name="register-summary" data-file="pages/register/RegisterBusinessPage.js">
                <p className="text-sm font-semibold" data-name="summary-title" data-file="pages/register/RegisterBusinessPage.js">Planes</p>
                <div className="mt-4 space-y-3" data-name="summary-plans" data-file="pages/register/RegisterBusinessPage.js">
                  <button
                    type="button"
                    onClick={() => update('plan', 'VIP')}
                    className={`w-full text-left rounded-lg border p-4 transition-colors ${form.plan === 'VIP' ? 'border-[var(--primary-color)] bg-[var(--secondary-color)]' : 'border-[var(--border)] bg-white'}`}
                    data-name="plan-vip"
                    data-file="pages/register/RegisterBusinessPage.js"
                  >
                    <p className="text-sm font-semibold" data-name="plan-vip-title" data-file="pages/register/RegisterBusinessPage.js">VIP RomaHub</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed" data-name="plan-vip-desc" data-file="pages/register/RegisterBusinessPage.js">
                      Perfil completo, reservas, tienda, cursos, reseñas y mayor visibilidad.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => update('plan', 'Basico')}
                    className={`w-full text-left rounded-lg border p-4 transition-colors ${form.plan === 'Basico' ? 'border-[var(--primary-color)] bg-[var(--secondary-color)]' : 'border-[var(--border)] bg-white'}`}
                    data-name="plan-basic"
                    data-file="pages/register/RegisterBusinessPage.js"
                  >
                    <p className="text-sm font-semibold" data-name="plan-basic-title" data-file="pages/register/RegisterBusinessPage.js">Tienda + mapa</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed" data-name="plan-basic-desc" data-file="pages/register/RegisterBusinessPage.js">
                      Ubicación en el mapa, datos de contacto y tienda simple con carrito por WhatsApp.
                    </p>
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mt-10" data-name="register-form-section" data-file="pages/register/RegisterBusinessPage.js">
          <div className="container-rr" data-name="register-form-container" data-file="pages/register/RegisterBusinessPage.js">
            <form className="surface-rr p-5 md:p-8" onSubmit={submit} data-name="register-form" data-file="pages/register/RegisterBusinessPage.js">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-name="form-head" data-file="pages/register/RegisterBusinessPage.js">
                <div data-name="form-head-copy" data-file="pages/register/RegisterBusinessPage.js">
                  <h2 className="text-2xl font-semibold tracking-tight" data-name="form-title" data-file="pages/register/RegisterBusinessPage.js">Datos del negocio</h2>
                  <p className="mt-2 text-sm text-[var(--text-muted)]" data-name="form-subtitle" data-file="pages/register/RegisterBusinessPage.js">
                    Al enviar, abriremos WhatsApp con la solicitud lista para revisar.
                  </p>
                </div>
                {sent ? (
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100" data-name="sent-badge" data-file="pages/register/RegisterBusinessPage.js">
                    <div className="icon-check text-lg text-green-700" data-name="sent-icon" data-file="pages/register/RegisterBusinessPage.js"></div>
                    Solicitud preparada
                  </span>
                ) : null}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" data-name="form-grid" data-file="pages/register/RegisterBusinessPage.js">
                <label className="block" data-name="field-business" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Nombre del negocio</span>
                  <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.nombreNegocio} onChange={(e) => update('nombreNegocio', e.target.value)} placeholder="Ej. Gordis Nails" />
                  <FieldError name="nombreNegocio" />
                </label>

                <label className="block" data-name="field-owner" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Propietaria o contacto</span>
                  <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.propietaria} onChange={(e) => update('propietaria', e.target.value)} placeholder="Nombre de la persona responsable" />
                  <FieldError name="propietaria" />
                </label>

                <label className="block" data-name="field-whatsapp" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">WhatsApp del negocio</span>
                  <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="8 dígitos" inputMode="numeric" />
                  <FieldError name="whatsapp" />
                </label>

                <label className="block" data-name="field-email" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Correo para acceso</span>
                  <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="correo@ejemplo.com" type="email" />
                </label>

                <label className="block" data-name="field-province" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Provincia</span>
                  <select className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.provincia} onChange={(e) => update('provincia', e.target.value)}>
                    <option value="">Seleccionar provincia</option>
                    {provincias.map((province) => <option key={province} value={province}>{province}</option>)}
                  </select>
                  <FieldError name="provincia" />
                </label>

                <label className="block" data-name="field-city" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Municipio o zona</span>
                  <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.municipio} onChange={(e) => update('municipio', e.target.value)} placeholder="Ej. Playa, Centro Habana, Cardenas" />
                </label>

                <label className="block md:col-span-2" data-name="field-address" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Dirección visible</span>
                  <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.direccion} onChange={(e) => update('direccion', e.target.value)} placeholder="Dirección o referencia pública" />
                </label>

                <label className="block" data-name="field-category" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Categoría principal</span>
                  <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.categoria} onChange={(e) => update('categoria', e.target.value)} placeholder="Uñas, barbería, pestañas, cursos..." />
                  <FieldError name="categoria" />
                </label>

                <label className="block" data-name="field-social" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Instagram o Facebook</span>
                  <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@usuario o enlace" />
                </label>

                <label className="block md:col-span-2" data-name="field-description" data-file="pages/register/RegisterBusinessPage.js">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Descripción corta</span>
                  <textarea className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm min-h-[110px]" value={form.descripcion} onChange={(e) => update('descripcion', e.target.value)} placeholder="Cuenta que ofrece tu negocio y que lo diferencia."></textarea>
                </label>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3" data-name="form-options" data-file="pages/register/RegisterBusinessPage.js">
                {['Servicios', 'Productos', 'Cursos', 'Mixto'].map((type) => (
                  <button key={type} type="button" onClick={() => update('tipo', type)} className={`rounded-lg border px-4 py-3 text-sm font-medium ${form.tipo === type ? 'border-[var(--primary-color)] bg-[var(--secondary-color)] text-[var(--primary-color)]' : 'border-[var(--border)] bg-white text-[var(--text)]'}`} data-name="type-button" data-file="pages/register/RegisterBusinessPage.js">
                    {type}
                  </button>
                ))}
                <label className="rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm flex items-center gap-3" data-name="option-store" data-file="pages/register/RegisterBusinessPage.js">
                  <input type="checkbox" checked={form.quiereTienda} onChange={(e) => update('quiereTienda', e.target.checked)} />
                  Quiero tienda
                </label>
                <label className="rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm flex items-center gap-3" data-name="option-courses" data-file="pages/register/RegisterBusinessPage.js">
                  <input type="checkbox" checked={form.quiereCursos} onChange={(e) => update('quiereCursos', e.target.checked)} />
                  Vendo cursos
                </label>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-end" data-name="form-actions" data-file="pages/register/RegisterBusinessPage.js">
                <a className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" href="index.html" data-name="cancel-register" data-file="pages/register/RegisterBusinessPage.js">
                  Volver
                </a>
                <button className="btn-rr btn-primary-rr flex items-center justify-center gap-2" type="submit" data-name="submit-register" data-file="pages/register/RegisterBusinessPage.js">
                  Enviar solicitud por WhatsApp
                  <div className="icon-send text-xl text-white" data-name="submit-icon" data-file="pages/register/RegisterBusinessPage.js"></div>
                </button>
              </div>
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
