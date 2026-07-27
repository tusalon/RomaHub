function BusinessPanelPage() {
  try {
    const [negocioId, setNegocioId] = React.useState('');
    const [businessName, setBusinessName] = React.useState('');
    const [esTiendaExterna, setEsTiendaExterna] = React.useState(false);
    const LIMITE_TIENDA_EXTERNA = 40;
    const [authLoading, setAuthLoading] = React.useState(true);
    const [section, setSection] = React.useState('perfil');
    const [tab, setTab] = React.useState('productos');
    const [items, setItems] = React.useState({ productos: [], cursos: [] });
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [uploadingImage, setUploadingImage] = React.useState(false);
    const [profileUpload, setProfileUpload] = React.useState('');
    const fileInputRef = React.useRef(null);
    const logoInputRef = React.useRef(null);
    const coverInputRef = React.useRef(null);
    const [presentation, setPresentation] = React.useState({
      nombre: '',
      whatsapp: '',
      categoria: '',
      provincia: '',
      municipio: '',
      descripcion: '',
      coverUrl: '',
      logoUrl: '',
      coverX: 50,
      coverY: 50
    });
    const [presentationSaving, setPresentationSaving] = React.useState(false);
    const [presentationMessage, setPresentationMessage] = React.useState('');
    const [services, setServices] = React.useState([]);
    const [servicesLoading, setServicesLoading] = React.useState(false);
    const [servicesSaving, setServicesSaving] = React.useState(false);
    const [servicesMessage, setServicesMessage] = React.useState('');
    const [stats, setStats] = React.useState({
      periodo_dias: 30,
      visitas: 0,
      whatsapp: 0,
      reservas: 0,
      contactos: 0,
      productos_vistos: 0,
      compartidos: 0,
      conversion_pct: 0,
      dias: [],
      top_items: []
    });
    const [statsLoading, setStatsLoading] = React.useState(false);
    const [statsMessage, setStatsMessage] = React.useState('');
    const [form, setForm] = React.useState({
      id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      moneda: 'CUP',
      imagen_url: '',
      categoria: '',
      stock: '',
      fecha: '',
      ubicacion: '',
      duracion: '',
      cupos: '',
      activo: true,
      destacado: false
    });

    const supabaseRequest = async (path, options = {}) => {
      if (!window.RomaAuth) throw new Error('No se cargó el acceso de Supabase.');
      return window.RomaAuth.request(path, options, { requireAuth: true });
    };

    const goToLogin = () => {
      window.location.href = 'login.html';
    };

    React.useEffect(() => {
      const initPanel = async () => {
        try {
          setAuthLoading(true);
          setMessage('');
          const session = await window.RomaAuth?.ensureSession?.();
          if (!session) {
            goToLogin();
            return;
          }

          const access = await window.RomaAuth.getBusinessAccess();
          if (!access?.negocio_id) {
            window.RomaAuth.signOut();
            goToLogin();
            return;
          }

          localStorage.setItem('negocioId', access.negocio_id);
          setNegocioId(access.negocio_id);
          setBusinessName(access.negocios?.nombre || 'Tu negocio');
          setEsTiendaExterna(access.negocios?.es_tienda_externa === true);
          setPresentation({
            nombre: access.negocios?.nombre || '',
            whatsapp: String(access.negocios?.telefono || '').replace(/\D/g, '').replace(/^53/, '').slice(-8),
            categoria: access.negocios?.especialidad || '',
            provincia: access.negocios?.provincia || '',
            municipio: access.negocios?.municipio || '',
            descripcion: access.negocios?.mensaje_bienvenida || '',
            coverUrl: access.negocios?.imagen_fondo_url || '',
            logoUrl: access.negocios?.logo_url || '',
            coverX: Math.max(0, Math.min(100, Number(access.negocios?.imagen_fondo_pos_x ?? 50))),
            coverY: Math.max(0, Math.min(100, Number(access.negocios?.imagen_fondo_pos_y ?? 50)))
          });
        } catch (error) {
          console.error('BusinessPanelPage.initPanel error:', error);
          setMessage(error.message || 'No se pudo abrir el panel.');
          window.RomaAuth?.signOut?.();
        } finally {
          setAuthLoading(false);
        }
      };

      initPanel();
    }, []);

    const loadStore = async () => {
      try {
        setLoading(true);
        setMessage('');
        if (!negocioId) return;
        const encoded = encodeURIComponent(negocioId);
        const [productos, cursos] = await Promise.all([
          supabaseRequest(`productos?negocio_id=eq.${encoded}&select=*&order=destacado.desc,orden.asc,nombre.asc`),
          supabaseRequest(`cursos?negocio_id=eq.${encoded}&select=*&order=destacado.desc,orden.asc,fecha.asc,nombre.asc`)
        ]);
        setItems({ productos: productos || [], cursos: cursos || [] });
      } catch (error) {
        console.error('BusinessPanelPage.loadStore error:', error);
        setMessage(error.message || 'No se pudo cargar la tienda.');
      } finally {
        setLoading(false);
      }
    };

    const loadServices = async () => {
      try {
        setServicesLoading(true);
        setServicesMessage('');
        if (!negocioId) return;
        const encoded = encodeURIComponent(negocioId);
        const rows = await supabaseRequest(`servicios?negocio_id=eq.${encoded}&select=id,nombre,categoria,orden,activo&order=orden.asc,nombre.asc`);
        setServices((rows || []).map((service, index) => ({
          ...service,
          categoria: service.categoria || '',
          orden: Number.isFinite(Number(service.orden)) ? Number(service.orden) : index
        })));
      } catch (error) {
        console.error('BusinessPanelPage.loadServices error:', error);
        setServicesMessage(error.message || 'No se pudieron cargar los servicios.');
      } finally {
        setServicesLoading(false);
      }
    };

    const loadStats = async () => {
      try {
        if (!negocioId) return;
        setStatsLoading(true);
        setStatsMessage('');
        const data = await supabaseRequest('rpc/mis_estadisticas_romahub', {
          method: 'POST',
          body: JSON.stringify({ p_negocio_id: negocioId, p_dias: 30 })
        });
        if (data && typeof data === 'object') setStats((current) => ({ ...current, ...data }));
      } catch (error) {
        console.error('BusinessPanelPage.loadStats error:', error);
        setStatsMessage(error.message || 'No se pudieron cargar las estadísticas.');
      } finally {
        setStatsLoading(false);
      }
    };

    React.useEffect(() => {
      if (negocioId) {
        loadStore();
        loadServices();
        loadStats();
      }
    }, [negocioId]);

    const resetForm = () => {
      setForm({
        id: '',
        nombre: '',
        descripcion: '',
        precio: '',
        moneda: 'CUP',
        imagen_url: '',
        categoria: '',
        stock: '',
        fecha: '',
        ubicacion: '',
        duracion: '',
        cupos: '',
        activo: true,
        destacado: false
      });
    };

    const updateForm = (field, value) => {
      setForm((current) => ({ ...current, [field]: value }));
    };

    const positionCoverFromPointer = (event) => {
      if (!presentation.coverUrl) return;
      if (event.type === 'pointermove' && event.buttons !== 1) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      if (event.type === 'pointerdown') event.currentTarget.setPointerCapture?.(event.pointerId);
      const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
      setPresentation((current) => ({ ...current, coverX: x, coverY: y }));
    };

    const savePresentation = async (event) => {
      try {
        event.preventDefault();
        setPresentationMessage('');
        if (!negocioId) throw new Error('No se encontró el negocio.');
        setPresentationSaving(true);
        const saved = await supabaseRequest('rpc/guardar_mi_perfil_romahub', {
          method: 'POST',
          body: JSON.stringify({
            p_negocio_id: negocioId,
            p_nombre: presentation.nombre.trim(),
            p_whatsapp: presentation.whatsapp.replace(/\D/g, ''),
            p_especialidad: presentation.categoria.trim(),
            p_provincia: presentation.provincia,
            p_municipio: presentation.municipio,
            p_mensaje_bienvenida: presentation.descripcion.trim(),
            p_logo_url: presentation.logoUrl,
            p_imagen_fondo_url: presentation.coverUrl,
            p_imagen_fondo_pos_x: Number(presentation.coverX),
            p_imagen_fondo_pos_y: Number(presentation.coverY)
          })
        });
        if (saved && typeof saved === 'object') {
          setPresentation((current) => ({
            ...current,
            nombre: saved.nombre || current.nombre,
            whatsapp: String(saved.telefono || current.whatsapp).replace(/\D/g, '').replace(/^53/, '').slice(-8),
            categoria: saved.especialidad || '',
            provincia: saved.provincia || '',
            municipio: saved.municipio || '',
            descripcion: saved.mensaje_bienvenida || '',
            logoUrl: saved.logo_url || '',
            coverUrl: saved.imagen_fondo_url || '',
            coverX: Number(saved.imagen_fondo_pos_x ?? current.coverX),
            coverY: Number(saved.imagen_fondo_pos_y ?? current.coverY)
          }));
          setBusinessName(saved.nombre || businessName);
        }
        sessionStorage.removeItem('romahub-negocios-v2');
        setPresentationMessage('Perfil actualizado correctamente.');
      } catch (error) {
        console.error('BusinessPanelPage.savePresentation error:', error);
        setPresentationMessage(error.message || 'No se pudo actualizar el perfil.');
      } finally {
        setPresentationSaving(false);
      }
    };

    const updateServiceCategory = (serviceId, value) => {
      setServices((current) => current.map((service) => (
        service.id === serviceId ? { ...service, categoria: value } : service
      )));
    };

    const moveService = (index, direction) => {
      setServices((current) => {
        const target = index + direction;
        if (target < 0 || target >= current.length) return current;
        const next = current.slice();
        const selected = next[index];
        next[index] = next[target];
        next[target] = selected;
        return next.map((service, order) => ({ ...service, orden: order }));
      });
    };

    const saveServices = async () => {
      try {
        setServicesMessage('');
        if (!negocioId) throw new Error('No se encontró el negocio.');
        setServicesSaving(true);
        await supabaseRequest('rpc/organizar_mis_servicios', {
          method: 'POST',
          body: JSON.stringify({
            p_negocio_id: negocioId,
            p_servicios: services.map((service, index) => ({
              id: service.id,
              categoria: String(service.categoria || '').trim(),
              orden: index
            }))
          })
        });
        setServices((current) => current.map((service, index) => ({ ...service, orden: index })));
        sessionStorage.removeItem('romahub-negocios-v2');
        setServicesMessage('Orden y grupos guardados correctamente.');
      } catch (error) {
        console.error('BusinessPanelPage.saveServices error:', error);
        setServicesMessage(error.message || 'No se pudo guardar la organización.');
      } finally {
        setServicesSaving(false);
      }
    };

    const editItem = (item, type) => {
      setSection('tienda');
      setTab(type);
      setForm({
        id: item.id || '',
        nombre: item.nombre || '',
        descripcion: item.descripcion || '',
        precio: item.precio != null ? String(item.precio) : '',
        moneda: item.moneda || 'CUP',
        imagen_url: item.imagen_url || '',
        categoria: item.categoria || '',
        stock: item.stock != null ? String(item.stock) : '',
        fecha: item.fecha ? String(item.fecha).slice(0, 16) : '',
        ubicacion: item.ubicacion || '',
        duracion: item.duracion || '',
        cupos: item.cupos != null ? String(item.cupos) : '',
        activo: item.activo !== false,
        destacado: item.destacado === true
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const saveItem = async (event) => {
      try {
        event.preventDefault();
        setMessage('');
        if (!negocioId) throw new Error('Falta negocio_id.');
        if (!form.nombre.trim()) throw new Error('Escribe el nombre.');

        // Aviso amable antes de que lo bloquee el trigger de la base de datos
        // (esa es la barrera real; esto solo evita el error crudo de Postgres).
        if (!form.id && esTiendaExterna) {
          const totalActivos = (items.productos || []).filter((p) => p.activo !== false).length
            + (items.cursos || []).filter((c) => c.activo !== false).length;
          if (totalActivos >= LIMITE_TIENDA_EXTERNA) {
            setMessage(`Llegaste al máximo de ${LIMITE_TIENDA_EXTERNA} productos/cursos activos para tiendas gratis. Oculta alguno para publicar uno nuevo.`);
            return;
          }
        }

        setSaving(true);

        const isProduct = tab === 'productos';
        const table = isProduct ? 'productos' : 'cursos';
        const payload = {
          negocio_id: negocioId,
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim() || null,
          precio: Number(form.precio || 0),
          moneda: ['CUP', 'USD', 'EUR', 'MXN'].includes(form.moneda) ? form.moneda : 'CUP',
          imagen_url: form.imagen_url.trim() || null,
          categoria: form.categoria.trim() || null,
          activo: form.activo,
          destacado: form.destacado
        };

        if (isProduct) {
          payload.stock = Number(form.stock || 0);
        } else {
          payload.fecha = form.fecha ? new Date(form.fecha).toISOString() : null;
          payload.ubicacion = form.ubicacion.trim() || null;
          payload.duracion = form.duracion.trim() || null;
          payload.cupos = form.cupos === '' ? null : Number(form.cupos);
        }

        if (form.id) {
          await supabaseRequest(`${table}?id=eq.${encodeURIComponent(form.id)}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
          });
        } else {
          await supabaseRequest(table, {
            method: 'POST',
            body: JSON.stringify(payload)
          });
        }

        setMessage('Guardado correctamente.');
        resetForm();
        await loadStore();
      } catch (error) {
        console.error('BusinessPanelPage.saveItem error:', error);
        setMessage(error.message || 'No se pudo guardar.');
      } finally {
        setSaving(false);
      }
    };

    const onPickImage = async (event) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      try {
        setMessage('');
        setUploadingImage(true);
        if (!window.RomaUpload) throw new Error('No se cargó el subidor de imágenes.');
        const url = await window.RomaUpload.subirImagenProducto(file, form.nombre || 'producto');
        updateForm('imagen_url', url);
      } catch (error) {
        console.error('BusinessPanelPage.onPickImage error:', error);
        setMessage(error.message || 'No se pudo subir la imagen.');
      } finally {
        setUploadingImage(false);
      }
    };

    const onPickProfileImage = async (event, type) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file || !esTiendaExterna) return;
      try {
        setPresentationMessage('');
        setProfileUpload(type);
        if (!window.RomaUpload?.subirImagenPerfil) throw new Error('No se cargó el subidor de imágenes.');
        const url = await window.RomaUpload.subirImagenPerfil(file, presentation.nombre || businessName, type);
        setPresentation((current) => ({
          ...current,
          [type === 'portada' ? 'coverUrl' : 'logoUrl']: url,
          ...(type === 'portada' ? { coverX: 50, coverY: 50 } : {})
        }));
        setPresentationMessage('Imagen lista. Pulsa “Guardar perfil” para publicarla.');
      } catch (error) {
        console.error('BusinessPanelPage.onPickProfileImage error:', error);
        setPresentationMessage(error.message || 'No se pudo subir la imagen.');
      } finally {
        setProfileUpload('');
      }
    };

    const toggleActive = async (item, type) => {
      try {
        const table = type === 'productos' ? 'productos' : 'cursos';
        await supabaseRequest(`${table}?id=eq.${encodeURIComponent(item.id)}`, {
          method: 'PATCH',
          body: JSON.stringify({ activo: item.activo === false })
        });
        await loadStore();
      } catch (error) {
        console.error('BusinessPanelPage.toggleActive error:', error);
        setMessage(error.message || 'No se pudo cambiar el estado.');
      }
    };

    const signOut = () => {
      window.RomaAuth?.signOut?.();
      goToLogin();
    };

    const currentItems = items[tab] || [];
    const isProduct = tab === 'productos';
    const serviceCategoryOptions = Array.from(new Set(
      services.map((service) => String(service.categoria || '').trim()).filter(Boolean)
    ));
    const totalActivosExterna = (items.productos || []).filter((p) => p.activo !== false).length
      + (items.cursos || []).filter((c) => c.activo !== false).length;
    const municipios = window.getMunicipiosDeProvincia?.(presentation.provincia, presentation.municipio) || [];
    const hasCatalog = services.some((service) => service.activo !== false) || totalActivosExterna > 0;
    const profileTasks = [
      { id: 'descripcion', label: 'Descripción clara', done: presentation.descripcion.trim().length >= 40, section: 'perfil' },
      { id: 'logo', label: 'Logo o foto del negocio', done: Boolean(presentation.logoUrl), section: 'perfil' },
      { id: 'portada', label: 'Foto de portada', done: Boolean(presentation.coverUrl), section: 'perfil' },
      { id: 'ubicacion', label: 'Provincia y municipio', done: Boolean(presentation.provincia && presentation.municipio), section: 'perfil' },
      { id: 'whatsapp', label: 'WhatsApp de contacto', done: /^\d{8}$/.test(presentation.whatsapp), section: 'perfil' },
      { id: 'catalogo', label: 'Algo para ofrecer', done: hasCatalog, section: esTiendaExterna ? 'tienda' : 'perfil' }
    ];
    const completedTasks = profileTasks.filter((task) => task.done).length;
    const profileProgress = Math.round((completedTasks / profileTasks.length) * 100);
    const nextTask = profileTasks.find((task) => !task.done);
    const statsDays = Array.isArray(stats.dias) ? stats.dias : [];
    const maxDailyValue = Math.max(1, ...statsDays.map((day) => Math.max(Number(day.visitas || 0), Number(day.contactos || 0))));
    const statsInsight = Number(stats.visitas || 0) === 0
      ? 'Comparte tu enlace o QR para comenzar a traer visitas y medir qué funciona.'
      : Number(stats.contactos || 0) === 0
        ? 'Ya tienes visitas. Refuerza la descripción, la portada y el llamado a reservar o comprar.'
        : Number(stats.conversion_pct || 0) < 5
          ? 'Hay interés, pero pocas personas contactan. Revisa precios, descripción y WhatsApp.'
          : 'Tu perfil está convirtiendo visitas en contactos. Mantén el catálogo actualizado y sigue compartiéndolo.';

    if (authLoading) {
      return <div className="container-rr py-16 text-sm text-[var(--text-muted)]">Abriendo panel...</div>;
    }

    return (
      <div className="container-rr pt-6 md:pt-10" data-name="business-panel-page" data-file="pages/panel/BusinessPanelPage.js">
        <section className="surface-rr p-5 md:p-7" data-name="panel-hero" data-file="pages/panel/BusinessPanelPage.js">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5" data-name="panel-hero-row" data-file="pages/panel/BusinessPanelPage.js">
            <div data-name="panel-copy" data-file="pages/panel/BusinessPanelPage.js">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-color)]" data-name="panel-kicker" data-file="pages/panel/BusinessPanelPage.js">Panel de tienda</p>
              <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight" data-name="panel-title" data-file="pages/panel/BusinessPanelPage.js">Gestiona tu presencia en RomaHub</h1>
              <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] max-w-[720px] leading-relaxed" data-name="panel-subtitle" data-file="pages/panel/BusinessPanelPage.js">
                {businessName}. Ajusta cómo se ve tu perfil y organiza tu catálogo desde un solo lugar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2" data-name="panel-actions" data-file="pages/panel/BusinessPanelPage.js">
              <span className="chip-rr px-3 py-2 text-xs text-[var(--text-muted)]" data-name="panel-id" data-file="pages/panel/BusinessPanelPage.js">ID: {negocioId || 'sin negocio'}</span>
              {esTiendaExterna ? (
                <span className={`chip-rr px-3 py-2 text-xs ${totalActivosExterna >= LIMITE_TIENDA_EXTERNA ? 'text-red-600' : 'text-[var(--text-muted)]'}`} data-name="panel-limite" data-file="pages/panel/BusinessPanelPage.js">
                  {totalActivosExterna}/{LIMITE_TIENDA_EXTERNA} activos
                </span>
              ) : null}
              <a className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" href={`business.html?id=${encodeURIComponent(negocioId)}`} data-name="view-business" data-file="pages/panel/BusinessPanelPage.js">Ver ficha</a>
              <ShareBusiness businessId={negocioId} businessName={businessName} compact={true} />
              <button className="btn-rr btn-ghost-rr" type="button" onClick={signOut} data-name="logout" data-file="pages/panel/BusinessPanelPage.js">Salir</button>
            </div>
          </div>
        </section>

        <section className="mt-5 surface-rr p-5 md:p-6" aria-label="Progreso del perfil" data-name="profile-progress" data-file="pages/panel/BusinessPanelPage.js">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="kicker-rr">Tu escaparate</p>
                  <h2 className="mt-1 text-xl font-semibold">Perfil {profileProgress}% listo</h2>
                </div>
                <span className="text-sm font-bold text-[var(--primary-color)]">{completedTasks}/{profileTasks.length}</span>
              </div>
              <div className="mt-3 h-2.5 rounded-full bg-[var(--bg-muted)] overflow-hidden" role="progressbar" aria-valuenow={profileProgress} aria-valuemin="0" aria-valuemax="100">
                <div className="h-full rounded-full bg-[var(--primary-color)] transition-all" style={{ width: `${profileProgress}%` }}></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {profileTasks.map((task) => (
                  <span key={task.id} className={`chip-rr px-3 py-2 text-xs flex items-center gap-1.5 ${task.done ? 'text-green-700 bg-green-50' : 'text-[var(--text-muted)]'}`}>
                    <span className={task.done ? 'icon-circle-check' : 'icon-circle'}></span>
                    {task.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:w-[260px] shrink-0 rounded-xl bg-[var(--bg-muted)] p-4">
              {nextTask ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Siguiente paso</p>
                  <p className="mt-1 text-sm font-semibold">Completa: {nextTask.label}</p>
                  <button type="button" className="mt-3 btn-rr btn-primary-rr w-full py-2.5 text-sm" onClick={() => setSection(nextTask.section)}>
                    Completar ahora
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-green-700">Tu perfil está listo para recibir clientas.</p>
                  <a className="mt-3 btn-rr btn-primary-rr w-full py-2.5 text-sm flex items-center justify-center" href={`business.html?id=${encodeURIComponent(negocioId)}`}>Ver y compartir</a>
                </>
              )}
            </div>
          </div>
        </section>

        <nav className="mt-5 surface-rr p-2 grid grid-cols-1 sm:grid-cols-3 gap-2" aria-label="Secciones del panel" data-name="panel-sections" data-file="pages/panel/BusinessPanelPage.js">
          <button
            type="button"
            className={`btn-rr ${section === 'perfil' ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
            onClick={() => setSection('perfil')}
            data-name="section-profile"
            data-file="pages/panel/BusinessPanelPage.js"
          >
            Perfil y servicios
          </button>
          <button
            type="button"
            className={`btn-rr ${section === 'tienda' ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
            onClick={() => setSection('tienda')}
            data-name="section-store"
            data-file="pages/panel/BusinessPanelPage.js"
          >
            Productos y cursos
          </button>
          <button
            type="button"
            className={`btn-rr ${section === 'estadisticas' ? 'btn-primary-rr' : 'btn-ghost-rr'}`}
            onClick={() => { setSection('estadisticas'); loadStats(); }}
            data-name="section-stats"
            data-file="pages/panel/BusinessPanelPage.js"
          >
            Estadísticas
          </button>
        </nav>

        {section === 'perfil' ? (
          <section className="mt-5 grid grid-cols-1 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 items-start" data-name="profile-services-grid" data-file="pages/panel/BusinessPanelPage.js">
            <form className="surface-rr p-5 md:p-6 space-y-5" onSubmit={savePresentation} data-name="presentation-form" data-file="pages/panel/BusinessPanelPage.js">
              <div data-name="presentation-head" data-file="pages/panel/BusinessPanelPage.js">
                <p className="kicker-rr">Perfil público</p>
                <h2 className="mt-2 text-xl font-semibold">La cara de tu negocio</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
                  Completa tus datos y acomoda la portada. Así te encontrarán y contactarán desde toda Cuba.
                </p>
              </div>

              {esTiendaExterna ? (
                <div className="space-y-4" data-name="external-business-fields" data-file="pages/panel/BusinessPanelPage.js">
                  <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-3" data-name="logo-uploader">
                    <div className="w-16 h-16 rounded-xl border border-[var(--border)] bg-white overflow-hidden flex items-center justify-center shrink-0">
                      {profileUpload === 'logo' ? <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] border-t-[var(--primary-color)] animate-spin"></div> : presentation.logoUrl ? (
                        <img src={presentation.logoUrl} alt={`Logo de ${businessName}`} className="w-full h-full object-cover" />
                      ) : <div className="icon-store text-xl text-[var(--primary-color)]"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">Logo o foto del negocio</p>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">Usa una imagen cuadrada y fácil de reconocer.</p>
                      <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickProfileImage(e, 'logo')} />
                      <button type="button" className="mt-2 btn-rr btn-ghost-rr py-2 px-3 text-xs" onClick={() => logoInputRef.current?.click()} disabled={Boolean(profileUpload)}>
                        {profileUpload === 'logo' ? 'Subiendo...' : presentation.logoUrl ? 'Cambiar logo' : 'Subir logo'}
                      </button>
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-xs font-semibold text-[var(--text-muted)]">Nombre del negocio</span>
                    <input className="input-rr mt-1" value={presentation.nombre} onChange={(e) => setPresentation((current) => ({ ...current, nombre: e.target.value.slice(0, 100) }))} maxLength={100} required />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">WhatsApp</span>
                      <div className="mt-1 flex rounded-[var(--radius-md)] border border-[var(--border)] bg-white overflow-hidden">
                        <span className="px-3 py-3 text-sm font-semibold text-[var(--primary-color)] border-r border-[var(--border)] bg-[var(--bg-muted)]">+53</span>
                        <input className="min-w-0 flex-1 px-3 py-3 text-sm outline-none" value={presentation.whatsapp} onChange={(e) => setPresentation((current) => ({ ...current, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 8) }))} inputMode="numeric" pattern="[0-9]{8}" required />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">Especialidad</span>
                      <input className="input-rr mt-1" value={presentation.categoria} onChange={(e) => setPresentation((current) => ({ ...current, categoria: e.target.value.slice(0, 80) }))} placeholder="Ej. Uñas, peluquería, cosmética" maxLength={80} />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">Provincia</span>
                      <select className="input-rr mt-1 bg-white" value={presentation.provincia} onChange={(e) => setPresentation((current) => ({ ...current, provincia: e.target.value, municipio: '' }))} required>
                        <option value="">Selecciona</option>
                        {(window.CUBA_PROVINCIAS || []).map((provincia) => <option key={provincia} value={provincia}>{provincia}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">Municipio</span>
                      <select className="input-rr mt-1 bg-white" value={presentation.municipio} onChange={(e) => setPresentation((current) => ({ ...current, municipio: e.target.value }))} disabled={!presentation.provincia} required>
                        <option value="">Selecciona</option>
                        {municipios.map((municipio) => <option key={municipio} value={municipio}>{municipio}</option>)}
                      </select>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4" data-name="rservas-profile-note" data-file="pages/panel/BusinessPanelPage.js">
                  <div className="icon-info text-xl text-blue-700 mt-0.5"></div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Tus datos principales vienen de Rservasroma</p>
                    <p className="mt-1 text-xs text-blue-800 leading-relaxed">Para cambiar nombre, WhatsApp, logo, provincia o municipio ve a Rservasroma → Editar negocio. Aquí puedes escribir la descripción, centrar la portada y organizar tus servicios.</p>
                  </div>
                </div>
              )}

              <div data-name="cover-position-editor" data-file="pages/panel/BusinessPanelPage.js">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Foto de portada</span>
                  {esTiendaExterna ? (
                    <>
                      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickProfileImage(e, 'portada')} />
                      <button type="button" className="btn-rr btn-ghost-rr py-2 px-3 text-xs" onClick={() => coverInputRef.current?.click()} disabled={Boolean(profileUpload)}>
                        {profileUpload === 'portada' ? 'Subiendo...' : presentation.coverUrl ? 'Cambiar portada' : 'Subir portada'}
                      </button>
                    </>
                  ) : null}
                </div>
                <div
                  className={`relative aspect-video rounded-xl overflow-hidden border border-[var(--border)] bg-[#F3F4F6] ${presentation.coverUrl ? 'cursor-crosshair touch-none' : ''}`}
                  onPointerDown={positionCoverFromPointer}
                  onPointerMove={positionCoverFromPointer}
                  data-name="cover-preview"
                  data-file="pages/panel/BusinessPanelPage.js"
                >
                  {profileUpload === 'portada' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-muted)] text-[var(--text-muted)]">
                      <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-[var(--primary-color)] animate-spin"></div>
                      <p className="mt-2 text-sm">Subiendo portada...</p>
                    </div>
                  ) : presentation.coverUrl ? (
                    <img
                      src={presentation.coverUrl}
                      alt={`Vista previa de la portada de ${businessName}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: `${presentation.coverX}% ${presentation.coverY}%` }}
                      onDragStart={(e) => e.preventDefault()}
                      data-name="cover-preview-image"
                      data-file="pages/panel/BusinessPanelPage.js"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-[var(--text-muted)]" data-name="cover-empty" data-file="pages/panel/BusinessPanelPage.js">
                      <div className="icon-image text-3xl opacity-50"></div>
                      <p className="mt-2 text-sm">Este negocio todavía no tiene foto de portada.</p>
                    </div>
                  )}
                  {presentation.coverUrl ? <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5"></div> : null}
                </div>

                <div className="mt-4 space-y-4" data-name="cover-controls" data-file="pages/panel/BusinessPanelPage.js">
                  <label className="block" data-name="cover-x-label" data-file="pages/panel/BusinessPanelPage.js">
                    <span className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
                      Posición horizontal <output>{Math.round(presentation.coverX)}%</output>
                    </span>
                    <input
                      className="mt-2 w-full accent-[var(--primary-color)]"
                      type="range"
                      min="0"
                      max="100"
                      value={presentation.coverX}
                      onChange={(e) => setPresentation((current) => ({ ...current, coverX: Number(e.target.value) }))}
                      disabled={!presentation.coverUrl}
                      aria-label="Posición horizontal de la portada"
                      data-name="cover-x"
                      data-file="pages/panel/BusinessPanelPage.js"
                    />
                  </label>
                  <label className="block" data-name="cover-y-label" data-file="pages/panel/BusinessPanelPage.js">
                    <span className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
                      Posición vertical <output>{Math.round(presentation.coverY)}%</output>
                    </span>
                    <input
                      className="mt-2 w-full accent-[var(--primary-color)]"
                      type="range"
                      min="0"
                      max="100"
                      value={presentation.coverY}
                      onChange={(e) => setPresentation((current) => ({ ...current, coverY: Number(e.target.value) }))}
                      disabled={!presentation.coverUrl}
                      aria-label="Posición vertical de la portada"
                      data-name="cover-y"
                      data-file="pages/panel/BusinessPanelPage.js"
                    />
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--primary-color)] hover:underline"
                    onClick={() => setPresentation((current) => ({ ...current, coverX: 50, coverY: 50 }))}
                    disabled={!presentation.coverUrl}
                    data-name="cover-center"
                    data-file="pages/panel/BusinessPanelPage.js"
                  >
                    Volver a centrar
                  </button>
                </div>
              </div>

              <label className="block" data-name="business-description-label" data-file="pages/panel/BusinessPanelPage.js">
                <span className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
                  Descripción del negocio <span>{presentation.descripcion.length}/600</span>
                </span>
                <textarea
                  className="input-rr mt-2 min-h-[132px] resize-y"
                  value={presentation.descripcion}
                  onChange={(e) => setPresentation((current) => ({ ...current, descripcion: e.target.value.slice(0, 600) }))}
                  placeholder="Cuenta qué hace especial a tu negocio, qué servicios ofrece y qué pueden esperar tus clientas."
                  maxLength={600}
                  data-name="business-description"
                  data-file="pages/panel/BusinessPanelPage.js"
                />
              </label>

              {presentationMessage ? <p className="text-sm text-[var(--text-muted)] leading-relaxed" data-name="presentation-message" data-file="pages/panel/BusinessPanelPage.js">{presentationMessage}</p> : null}

              <button type="submit" className="btn-rr btn-primary-rr w-full" disabled={presentationSaving} data-name="save-presentation" data-file="pages/panel/BusinessPanelPage.js">
                {presentationSaving ? 'Guardando...' : 'Guardar perfil'}
              </button>
            </form>

            <div className="surface-rr overflow-hidden" data-name="services-organizer" data-file="pages/panel/BusinessPanelPage.js">
              <div className="p-5 md:p-6 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-start justify-between gap-3" data-name="services-organizer-head" data-file="pages/panel/BusinessPanelPage.js">
                <div data-name="services-organizer-copy" data-file="pages/panel/BusinessPanelPage.js">
                  <p className="kicker-rr">Catálogo</p>
                  <h2 className="mt-2 text-xl font-semibold">Orden y subgrupos</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
                    Usa las flechas para ordenar. Escribe el mismo subgrupo en varios servicios para mostrarlos juntos; el primero de cada grupo define el orden de los grupos.
                  </p>
                </div>
                <button type="button" className="btn-rr btn-ghost-rr shrink-0" onClick={loadServices} disabled={servicesLoading} data-name="reload-services" data-file="pages/panel/BusinessPanelPage.js">
                  Actualizar
                </button>
              </div>

              <datalist id="service-category-options">
                {serviceCategoryOptions.map((category) => <option key={category} value={category} />)}
              </datalist>

              {servicesLoading ? (
                <p className="p-5 text-sm text-[var(--text-muted)]">Cargando servicios...</p>
              ) : services.length ? (
                <div className="divide-y divide-[var(--border)]" data-name="services-sort-list" data-file="pages/panel/BusinessPanelPage.js">
                  {services.map((service, index) => (
                    <div key={service.id} className="p-4 md:p-5 grid grid-cols-[36px_1fr_auto] gap-3 items-center" data-name="service-sort-row" data-file="pages/panel/BusinessPanelPage.js">
                      <div className="w-9 h-9 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]" data-name="service-position" data-file="pages/panel/BusinessPanelPage.js">{index + 1}</div>
                      <div className="min-w-0" data-name="service-sort-copy" data-file="pages/panel/BusinessPanelPage.js">
                        <p className="text-sm font-semibold truncate" data-name="service-sort-name" data-file="pages/panel/BusinessPanelPage.js">{service.nombre}</p>
                        <input
                          className="input-rr mt-2 py-2 text-xs"
                          value={service.categoria || ''}
                          onChange={(e) => updateServiceCategory(service.id, e.target.value.slice(0, 80))}
                          placeholder="Subgrupo (ej. Manicura)"
                          list="service-category-options"
                          maxLength={80}
                          aria-label={`Subgrupo de ${service.nombre}`}
                          data-name="service-category"
                          data-file="pages/panel/BusinessPanelPage.js"
                        />
                      </div>
                      <div className="flex flex-col gap-1" data-name="service-sort-actions" data-file="pages/panel/BusinessPanelPage.js">
                        <button type="button" className="w-9 h-9 rounded-lg border border-[var(--border)] hover:border-[var(--primary-color)] disabled:opacity-30" onClick={() => moveService(index, -1)} disabled={index === 0} aria-label={`Subir ${service.nombre}`} title="Subir" data-name="service-up" data-file="pages/panel/BusinessPanelPage.js">
                          <span className="icon-chevron-up text-base"></span>
                        </button>
                        <button type="button" className="w-9 h-9 rounded-lg border border-[var(--border)] hover:border-[var(--primary-color)] disabled:opacity-30" onClick={() => moveService(index, 1)} disabled={index === services.length - 1} aria-label={`Bajar ${service.nombre}`} title="Bajar" data-name="service-down" data-file="pages/panel/BusinessPanelPage.js">
                          <span className="icon-chevron-down text-base"></span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-5 text-sm text-[var(--text-muted)]">Este negocio todavía no tiene servicios para organizar.</p>
              )}

              <div className="p-5 md:p-6 border-t border-[var(--border)]" data-name="services-organizer-footer" data-file="pages/panel/BusinessPanelPage.js">
                {servicesMessage ? <p className="mb-3 text-sm text-[var(--text-muted)] leading-relaxed" data-name="services-message" data-file="pages/panel/BusinessPanelPage.js">{servicesMessage}</p> : null}
                <button type="button" className="btn-rr btn-primary-rr w-full" onClick={saveServices} disabled={servicesSaving || servicesLoading || !services.length} data-name="save-services-order" data-file="pages/panel/BusinessPanelPage.js">
                  {servicesSaving ? 'Guardando...' : 'Guardar orden y subgrupos'}
                </button>
              </div>
            </div>
          </section>
        ) : section === 'estadisticas' ? (
          <section className="mt-5 space-y-4" data-name="stats-section" data-file="pages/panel/BusinessPanelPage.js">
            <div className="surface-rr p-5 md:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4" data-name="stats-head">
              <div>
                <p className="kicker-rr">Resultados en RomaHub</p>
                <h2 className="mt-2 text-2xl font-semibold">Qué hacen las clientas en tu perfil</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">Últimos {stats.periodo_dias || 30} días. Medimos acciones, no datos personales de las visitantes.</p>
              </div>
              <button type="button" className="btn-rr btn-ghost-rr shrink-0" onClick={loadStats} disabled={statsLoading}>
                {statsLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>

            {statsMessage ? <div className="surface-rr p-4 text-sm text-red-600">{statsMessage}</div> : null}

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3" data-name="stats-cards">
              {[
                { label: 'Visitas al perfil', value: stats.visitas, icon: 'icon-eye' },
                { label: 'Contactos', value: stats.contactos, icon: 'icon-message-circle' },
                { label: 'Intentos de reserva', value: stats.reservas, icon: 'icon-calendar-check' },
                { label: 'Productos vistos', value: stats.productos_vistos, icon: 'icon-shopping-bag' },
                { label: 'Veces compartido', value: stats.compartidos, icon: 'icon-share-2' }
              ].map((metric) => (
                <article key={metric.label} className="surface-rr p-4 md:p-5" data-name="stats-card">
                  <div className="w-10 h-10 rounded-xl bg-[var(--secondary-color)] flex items-center justify-center">
                    <span className={`${metric.icon} text-lg text-[var(--primary-color)]`}></span>
                  </div>
                  <p className="mt-4 text-2xl md:text-3xl font-extrabold text-[#111827]">{Number(metric.value || 0).toLocaleString('es-ES')}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)] leading-snug">{metric.label}</p>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] gap-4 items-stretch">
              <article className="surface-rr p-5 md:p-6" data-name="weekly-chart">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Actividad de los últimos 7 días</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">Rosa: visitas · Oscuro: contactos</p>
                  </div>
                  <span className="chip-rr px-3 py-1.5 text-xs text-[var(--primary-color)]">{Number(stats.conversion_pct || 0)}% conversión</span>
                </div>
                <div className="mt-6 grid grid-cols-7 gap-2 h-44 items-end" aria-label="Actividad diaria">
                  {statsDays.map((day) => {
                    const visitas = Number(day.visitas || 0);
                    const contactos = Number(day.contactos || 0);
                    const label = new Date(`${day.fecha}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '').slice(0, 3);
                    return (
                      <div key={day.fecha} className="h-full flex flex-col justify-end items-center gap-2" title={`${day.fecha}: ${visitas} visitas, ${contactos} contactos`}>
                        <div className="h-[118px] w-full flex items-end justify-center gap-1 border-b border-[var(--border)]">
                          <span className="w-2.5 sm:w-4 rounded-t bg-[var(--primary-color)] min-h-[2px]" style={{ height: visitas ? `${Math.max(8, (visitas / maxDailyValue) * 100)}%` : '2px' }}></span>
                          <span className="w-2.5 sm:w-4 rounded-t bg-[#111827] min-h-[2px]" style={{ height: contactos ? `${Math.max(8, (contactos / maxDailyValue) * 100)}%` : '2px' }}></span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] capitalize">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="surface-rr p-5 md:p-6" data-name="top-items">
                <p className="text-sm font-semibold">Productos y cursos con más interés</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Según aperturas y selecciones.</p>
                {Array.isArray(stats.top_items) && stats.top_items.length ? (
                  <div className="mt-4 divide-y divide-[var(--border)]">
                    {stats.top_items.map((item, index) => (
                      <div key={`${item.tipo}-${item.nombre}`} className="py-3 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center text-xs font-bold text-[var(--primary-color)]">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{item.nombre}</p>
                          <p className="text-[11px] text-[var(--text-muted)] capitalize">{item.tipo}</p>
                        </div>
                        <span className="text-sm font-bold">{Number(item.vistas || 0)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl bg-[var(--bg-muted)] p-4 text-sm text-[var(--text-muted)] leading-relaxed">Todavía no hay suficientes vistas de productos o cursos.</div>
                )}
              </article>
            </div>

            <article className="surface-rr p-5 md:p-6 border-l-4 border-l-[var(--primary-color)]" data-name="stats-recommendation">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--primary-color)]">Recomendación para crecer</p>
              <p className="mt-2 text-sm md:text-base font-semibold leading-relaxed">{statsInsight}</p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">Las estadísticas comienzan a registrarse desde esta actualización; no incluyen visitas anteriores.</p>
            </article>
          </section>
        ) : (
        <section className="mt-5 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 items-start" data-name="store-grid" data-file="pages/panel/BusinessPanelPage.js">
          <form className="surface-rr p-5 md:p-6 space-y-3" onSubmit={saveItem} data-name="store-form" data-file="pages/panel/BusinessPanelPage.js">
            <div className="grid grid-cols-2 gap-2" data-name="store-tabs" data-file="pages/panel/BusinessPanelPage.js">
              <button type="button" className={`btn-rr ${isProduct ? 'btn-primary-rr' : 'btn-ghost-rr'}`} onClick={() => { setTab('productos'); resetForm(); }} data-name="tab-products" data-file="pages/panel/BusinessPanelPage.js">Producto</button>
              <button type="button" className={`btn-rr ${!isProduct ? 'btn-primary-rr' : 'btn-ghost-rr'}`} onClick={() => { setTab('cursos'); resetForm(); }} data-name="tab-courses" data-file="pages/panel/BusinessPanelPage.js">Curso</button>
            </div>

            <input className="input-rr" value={form.nombre} onChange={(e) => updateForm('nombre', e.target.value)} placeholder={isProduct ? 'Nombre del producto' : 'Nombre del curso'} data-name="item-name" data-file="pages/panel/BusinessPanelPage.js" />
            <textarea className="input-rr min-h-[92px] resize-y" value={form.descripcion} onChange={(e) => updateForm('descripcion', e.target.value)} placeholder="Descripción" data-name="item-description" data-file="pages/panel/BusinessPanelPage.js" />
            <div className="grid grid-cols-2 gap-2" data-name="price-category" data-file="pages/panel/BusinessPanelPage.js">
              <div className="flex gap-1.5" data-name="item-price-wrap" data-file="pages/panel/BusinessPanelPage.js">
                <input className="input-rr flex-1 min-w-0" value={form.precio} onChange={(e) => updateForm('precio', e.target.value)} inputMode="decimal" placeholder="Precio" data-name="item-price" data-file="pages/panel/BusinessPanelPage.js" />
                <select className="input-rr w-[84px] shrink-0 bg-white" value={form.moneda} onChange={(e) => updateForm('moneda', e.target.value)} data-name="item-moneda" data-file="pages/panel/BusinessPanelPage.js">
                  <option value="CUP">CUP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
              <input className="input-rr" value={form.categoria} onChange={(e) => updateForm('categoria', e.target.value)} placeholder="Categoría" data-name="item-category" data-file="pages/panel/BusinessPanelPage.js" />
            </div>
            <div className="flex items-center gap-3" data-name="item-image-uploader" data-file="pages/panel/BusinessPanelPage.js">
              <div className="w-16 h-16 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] overflow-hidden flex items-center justify-center shrink-0" data-name="item-image-preview" data-file="pages/panel/BusinessPanelPage.js">
                {uploadingImage ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] border-t-[var(--primary-color)] animate-spin" data-name="item-image-spinner" data-file="pages/panel/BusinessPanelPage.js"></div>
                ) : form.imagen_url ? (
                  <img src={form.imagen_url} alt="Foto del producto" className="w-full h-full object-cover" data-name="item-image-thumb" data-file="pages/panel/BusinessPanelPage.js" />
                ) : (
                  <div className="icon-image text-xl text-[var(--text-muted)]" data-name="item-image-empty" data-file="pages/panel/BusinessPanelPage.js"></div>
                )}
              </div>
              <div className="flex-1 min-w-0" data-name="item-image-actions" data-file="pages/panel/BusinessPanelPage.js">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} data-name="item-image-input" data-file="pages/panel/BusinessPanelPage.js" />
                <button type="button" className="btn-rr btn-ghost-rr w-full text-xs py-2" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} data-name="item-image-pick" data-file="pages/panel/BusinessPanelPage.js">
                  {uploadingImage ? 'Subiendo...' : form.imagen_url ? 'Cambiar foto' : 'Subir foto'}
                </button>
                {form.imagen_url ? (
                  <button type="button" className="mt-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--primary-color)]" onClick={() => updateForm('imagen_url', '')} data-name="item-image-clear" data-file="pages/panel/BusinessPanelPage.js">Quitar foto</button>
                ) : null}
              </div>
            </div>

            {isProduct ? (
              <input className="input-rr" value={form.stock} onChange={(e) => updateForm('stock', e.target.value)} inputMode="numeric" placeholder="Stock" data-name="item-stock" data-file="pages/panel/BusinessPanelPage.js" />
            ) : (
              <div className="space-y-2" data-name="course-fields" data-file="pages/panel/BusinessPanelPage.js">
                <input className="input-rr" type="datetime-local" value={form.fecha} onChange={(e) => updateForm('fecha', e.target.value)} data-name="item-date" data-file="pages/panel/BusinessPanelPage.js" />
                <input className="input-rr" value={form.ubicacion} onChange={(e) => updateForm('ubicacion', e.target.value)} placeholder="Ubicación" data-name="item-place" data-file="pages/panel/BusinessPanelPage.js" />
                <div className="grid grid-cols-2 gap-2" data-name="course-extra" data-file="pages/panel/BusinessPanelPage.js">
                  <input className="input-rr" value={form.duracion} onChange={(e) => updateForm('duracion', e.target.value)} placeholder="Duración" data-name="item-duration" data-file="pages/panel/BusinessPanelPage.js" />
                  <input className="input-rr" value={form.cupos} onChange={(e) => updateForm('cupos', e.target.value)} inputMode="numeric" placeholder="Cupos" data-name="item-seats" data-file="pages/panel/BusinessPanelPage.js" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm" data-name="checks" data-file="pages/panel/BusinessPanelPage.js">
              <label className="surface-rr p-3 flex items-center gap-2" data-name="active-check" data-file="pages/panel/BusinessPanelPage.js">
                <input type="checkbox" checked={form.activo} onChange={(e) => updateForm('activo', e.target.checked)} />
                Activo
              </label>
              <label className="surface-rr p-3 flex items-center gap-2" data-name="featured-check" data-file="pages/panel/BusinessPanelPage.js">
                <input type="checkbox" checked={form.destacado} onChange={(e) => updateForm('destacado', e.target.checked)} />
                Destacado
              </label>
            </div>

            {message ? <p className="text-sm text-[var(--text-muted)] leading-relaxed" data-name="panel-message" data-file="pages/panel/BusinessPanelPage.js">{message}</p> : null}

            <div className="grid grid-cols-2 gap-2" data-name="form-actions" data-file="pages/panel/BusinessPanelPage.js">
              <button type="button" className="btn-rr btn-ghost-rr" onClick={resetForm} data-name="clear-form" data-file="pages/panel/BusinessPanelPage.js">Limpiar</button>
              <button type="submit" className="btn-rr btn-primary-rr" disabled={saving} data-name="save-item" data-file="pages/panel/BusinessPanelPage.js">{saving ? 'Guardando...' : form.id ? 'Actualizar' : 'Publicar'}</button>
            </div>
          </form>

          <div className="surface-rr overflow-hidden" data-name="store-list" data-file="pages/panel/BusinessPanelPage.js">
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between gap-3" data-name="list-head" data-file="pages/panel/BusinessPanelPage.js">
              <div data-name="list-copy" data-file="pages/panel/BusinessPanelPage.js">
                <h2 className="text-lg font-semibold" data-name="list-title" data-file="pages/panel/BusinessPanelPage.js">{isProduct ? 'Productos publicados' : 'Cursos publicados'}</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1" data-name="list-count" data-file="pages/panel/BusinessPanelPage.js">{currentItems.length} elementos</p>
              </div>
              <button className="btn-rr btn-ghost-rr" type="button" onClick={loadStore} data-name="reload-list" data-file="pages/panel/BusinessPanelPage.js">Actualizar</button>
            </div>

            {loading ? (
              <p className="p-5 text-sm text-[var(--text-muted)]" data-name="loading-list" data-file="pages/panel/BusinessPanelPage.js">Cargando tienda...</p>
            ) : currentItems.length ? (
              <div className="divide-y divide-[var(--border)]" data-name="items-list" data-file="pages/panel/BusinessPanelPage.js">
                {currentItems.map((item) => (
                  <div key={item.id} className="p-4 md:p-5 grid grid-cols-[56px_1fr_auto] gap-3 items-start" data-name="store-row" data-file="pages/panel/BusinessPanelPage.js">
                    <div className="w-14 h-14 rounded-lg border border-[var(--border)] bg-white overflow-hidden flex items-center justify-center" data-name="item-thumb" data-file="pages/panel/BusinessPanelPage.js">
                      {item.imagen_url ? <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" loading="lazy" decoding="async" data-name="item-img" data-file="pages/panel/BusinessPanelPage.js" /> : <div className="icon-shopping-bag text-xl text-[var(--primary-color)]" data-name="item-fallback" data-file="pages/panel/BusinessPanelPage.js"></div>}
                    </div>
                    <div className="min-w-0" data-name="item-copy" data-file="pages/panel/BusinessPanelPage.js">
                      <p className="text-sm font-semibold leading-snug" data-name="item-title" data-file="pages/panel/BusinessPanelPage.js">{item.nombre}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1" data-name="item-meta" data-file="pages/panel/BusinessPanelPage.js">{Format.formatPrecioCUP(item.precio, item.moneda)} · {item.activo === false ? 'Inactivo' : 'Activo'}</p>
                      {item.descripcion ? <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2" data-name="item-desc" data-file="pages/panel/BusinessPanelPage.js">{item.descripcion}</p> : null}
                    </div>
                    <div className="flex flex-col gap-2" data-name="item-actions" data-file="pages/panel/BusinessPanelPage.js">
                      <button type="button" className="btn-rr btn-ghost-rr py-2 px-3 text-xs" onClick={() => editItem(item, tab)} data-name="edit-item" data-file="pages/panel/BusinessPanelPage.js">Editar</button>
                      <button type="button" className="btn-rr btn-ghost-rr py-2 px-3 text-xs" onClick={() => toggleActive(item, tab)} data-name="toggle-item" data-file="pages/panel/BusinessPanelPage.js">{item.activo === false ? 'Activar' : 'Ocultar'}</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-5 text-sm text-[var(--text-muted)]" data-name="empty-list" data-file="pages/panel/BusinessPanelPage.js">No hay elementos en esta sección.</p>
            )}
          </div>
        </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('BusinessPanelPage component error:', error);
    return null;
  }
}
