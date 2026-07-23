function BusinessPanelPage() {
  try {
    const [negocioId, setNegocioId] = React.useState('');
    const [businessName, setBusinessName] = React.useState('');
    const [authLoading, setAuthLoading] = React.useState(true);
    const [tab, setTab] = React.useState('productos');
    const [items, setItems] = React.useState({ productos: [], cursos: [] });
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [uploadingImage, setUploadingImage] = React.useState(false);
    const fileInputRef = React.useRef(null);
    const [form, setForm] = React.useState({
      id: '',
      nombre: '',
      descripcion: '',
      precio: '',
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
          const session = window.RomaAuth?.getSession?.();
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

    React.useEffect(() => {
      if (negocioId) loadStore();
    }, [negocioId]);

    const resetForm = () => {
      setForm({
        id: '',
        nombre: '',
        descripcion: '',
        precio: '',
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

    const editItem = (item, type) => {
      setTab(type);
      setForm({
        id: item.id || '',
        nombre: item.nombre || '',
        descripcion: item.descripcion || '',
        precio: item.precio != null ? String(item.precio) : '',
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
        setSaving(true);

        const isProduct = tab === 'productos';
        const table = isProduct ? 'productos' : 'cursos';
        const payload = {
          negocio_id: negocioId,
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim() || null,
          precio: Number(form.precio || 0),
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

    if (authLoading) {
      return <div className="container-rr py-16 text-sm text-[var(--text-muted)]">Abriendo panel...</div>;
    }

    return (
      <div className="container-rr pt-6 md:pt-10" data-name="business-panel-page" data-file="pages/panel/BusinessPanelPage.js">
        <section className="surface-rr p-5 md:p-7" data-name="panel-hero" data-file="pages/panel/BusinessPanelPage.js">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5" data-name="panel-hero-row" data-file="pages/panel/BusinessPanelPage.js">
            <div data-name="panel-copy" data-file="pages/panel/BusinessPanelPage.js">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-color)]" data-name="panel-kicker" data-file="pages/panel/BusinessPanelPage.js">Panel de tienda</p>
              <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight" data-name="panel-title" data-file="pages/panel/BusinessPanelPage.js">Productos y cursos</h1>
              <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] max-w-[720px] leading-relaxed" data-name="panel-subtitle" data-file="pages/panel/BusinessPanelPage.js">
                {businessName}. Gestiona tu mini tienda. Sube fotos desde tu teléfono o computadora.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2" data-name="panel-actions" data-file="pages/panel/BusinessPanelPage.js">
              <span className="chip-rr px-3 py-2 text-xs text-[var(--text-muted)]" data-name="panel-id" data-file="pages/panel/BusinessPanelPage.js">ID: {negocioId || 'sin negocio'}</span>
              <a className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" href={`business.html?id=${encodeURIComponent(negocioId)}`} data-name="view-business" data-file="pages/panel/BusinessPanelPage.js">Ver ficha</a>
              <button className="btn-rr btn-ghost-rr" type="button" onClick={signOut} data-name="logout" data-file="pages/panel/BusinessPanelPage.js">Salir</button>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 items-start" data-name="store-grid" data-file="pages/panel/BusinessPanelPage.js">
          <form className="surface-rr p-5 md:p-6 space-y-3" onSubmit={saveItem} data-name="store-form" data-file="pages/panel/BusinessPanelPage.js">
            <div className="grid grid-cols-2 gap-2" data-name="store-tabs" data-file="pages/panel/BusinessPanelPage.js">
              <button type="button" className={`btn-rr ${isProduct ? 'btn-primary-rr' : 'btn-ghost-rr'}`} onClick={() => { setTab('productos'); resetForm(); }} data-name="tab-products" data-file="pages/panel/BusinessPanelPage.js">Producto</button>
              <button type="button" className={`btn-rr ${!isProduct ? 'btn-primary-rr' : 'btn-ghost-rr'}`} onClick={() => { setTab('cursos'); resetForm(); }} data-name="tab-courses" data-file="pages/panel/BusinessPanelPage.js">Curso</button>
            </div>

            <input className="input-rr" value={form.nombre} onChange={(e) => updateForm('nombre', e.target.value)} placeholder={isProduct ? 'Nombre del producto' : 'Nombre del curso'} data-name="item-name" data-file="pages/panel/BusinessPanelPage.js" />
            <textarea className="input-rr min-h-[92px] resize-y" value={form.descripcion} onChange={(e) => updateForm('descripcion', e.target.value)} placeholder="Descripción" data-name="item-description" data-file="pages/panel/BusinessPanelPage.js" />
            <div className="grid grid-cols-2 gap-2" data-name="price-category" data-file="pages/panel/BusinessPanelPage.js">
              <input className="input-rr" value={form.precio} onChange={(e) => updateForm('precio', e.target.value)} inputMode="decimal" placeholder="Precio CUP" data-name="item-price" data-file="pages/panel/BusinessPanelPage.js" />
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
                      <p className="text-xs text-[var(--text-muted)] mt-1" data-name="item-meta" data-file="pages/panel/BusinessPanelPage.js">{Format.formatPrecioCUP(item.precio)} · {item.activo === false ? 'Inactivo' : 'Activo'}</p>
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
      </div>
    );
  } catch (error) {
    console.error('BusinessPanelPage component error:', error);
    return null;
  }
}
