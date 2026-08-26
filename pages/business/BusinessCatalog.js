function BusinessCatalog({ business, onAddToCart, selectedItemId = '', mostrar = 'todo' }) {
  try {
    const b = business;
    const sections = b.categoriasCatalogo || [];
    const services = (sections.find((cat) => cat.tipo === 'servicios')?.items || [])
      .filter((item) => item && item.nombre);
    const products = (sections.find((cat) => cat.tipo === 'productos')?.items || [])
      .filter((item) => item && item.nombre);
    const courses = (sections.find((cat) => cat.tipo === 'cursos')?.items || [])
      .filter((item) => item && item.nombre);
    const hasStore = products.length || courses.length;
    const mostrarServicios = mostrar === 'todo' || mostrar === 'servicios';
    const mostrarTienda = mostrar === 'todo' || mostrar === 'tienda';

    // Agrupa por el texto libre "categoria" que ya trae cada servicio/
    // producto/curso (mismo campo que la duena llena en su panel). Sin
    // categoria asignada, todo cae en un solo grupo con el titulo por
    // defecto y no se pinta subtitulo.
    const groupByCategoria = (items, defaultTitle) => items.reduce((groups, item) => {
      const title = String(item.categoria || '').trim() || defaultTitle;
      let group = groups.find((g) => g.title === title);
      if (!group) {
        group = { title, items: [] };
        groups.push(group);
      }
      group.items.push(item);
      return groups;
    }, []);
    const serviceGroups = groupByCategoria(services, 'Servicios');
    const productGroups = groupByCategoria(products, 'Productos');
    const courseGroups = groupByCategoria(courses, 'Cursos');

    if (!services.length && !hasStore) {
      return (
        <div className="surface-rr p-5" data-name="empty" data-file="pages/business/BusinessCatalog.js">
          <p className="text-sm text-[var(--text-muted)]" data-name="empty-t" data-file="pages/business/BusinessCatalog.js">
            Este negocio aún no publicó servicios, productos ni cursos.
          </p>
        </div>
      );
    }

    const StoreCard = ({ item, type }) => {
      try {
        const esCurso = type === 'curso';
        const agotado = esCurso ? item.cupos === 0 : Number(item.stock) === 0;
        const selected = String(item.id || '') === String(selectedItemId || '');
        const favoriteEntry = window.RomaSaved?.catalogEntry?.(item, type, b);
        const addItem = () => {
          window.RomaAnalytics?.track?.({ negocioId: b.id, evento: 'producto_visto', itemTipo: type, itemId: item.id, itemNombre: item.nombre }, { oncePerDay: true });
          onAddToCart?.(item, type);
        };
        return (
          <div id={`catalog-item-${item.id}`} className={`surface-rr overflow-hidden flex flex-col scroll-mt-28 transition-shadow ${selected ? 'ring-2 ring-[var(--primary-color)] shadow-lg' : ''}`} data-name="store-card" data-file="pages/business/BusinessCatalog.js">
            <div className="relative aspect-square bg-[#F6EEE6]" data-name="store-image" data-file="pages/business/BusinessCatalog.js">
              {favoriteEntry ? <FavoriteButton entry={favoriteEntry} className="absolute top-2 right-2 z-20" /> : null}
              {item.imagen ? (
                <img loading="lazy" decoding="async" src={item.imagen} alt={item.nombre} className={`absolute inset-0 w-full h-full object-cover ${agotado ? 'opacity-50 grayscale' : ''}`} data-name="store-img" data-file="pages/business/BusinessCatalog.js" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center" data-name="store-fallback" data-file="pages/business/BusinessCatalog.js">
                  <div className={`${esCurso ? 'icon-graduation-cap' : 'icon-shopping-bag'} text-3xl text-[var(--primary-color)] opacity-40`}></div>
                </div>
              )}
              {esCurso ? <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#261D29] text-white text-[10px] font-bold" data-name="store-type" data-file="pages/business/BusinessCatalog.js">Curso</span> : null}
              {agotado ? <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/80 text-white text-[10px] font-bold" data-name="store-agotado" data-file="pages/business/BusinessCatalog.js">Agotado</span> : selected ? <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-white text-[10px] font-bold text-[var(--primary-color)] shadow-sm">Tu selección</span> : null}
            </div>
            <div className="p-3 flex flex-col flex-1" data-name="store-copy" data-file="pages/business/BusinessCatalog.js">
              <p className="text-sm font-bold text-[#261D29] leading-snug line-clamp-2" data-name="store-name" data-file="pages/business/BusinessCatalog.js">{item.nombre}</p>
              {item.descripcion ? <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed line-clamp-2" data-name="store-description" data-file="pages/business/BusinessCatalog.js">{item.descripcion}</p> : null}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]" data-name="store-meta" data-file="pages/business/BusinessCatalog.js">
                {esCurso && item.ubicacion ? <span data-name="course-place" data-file="pages/business/BusinessCatalog.js">{item.ubicacion}</span> : null}
                {type === 'producto' && Number(item.stock) > 0 ? <span data-name="product-stock" data-file="pages/business/BusinessCatalog.js">Stock: {item.stock}</span> : null}
              </div>
              <p className="mt-2 text-base font-extrabold text-[var(--primary-color)]" data-name="store-price" data-file="pages/business/BusinessCatalog.js">{Format.formatPrecioCUP(item.precio, item.moneda)}</p>
              {agotado ? (
                <span className="mt-3 btn-rr w-full py-2 text-xs inline-flex items-center justify-center bg-[var(--bg-muted)] text-[var(--text-muted)] cursor-not-allowed" data-name="store-add-agotado" data-file="pages/business/BusinessCatalog.js">Agotado</span>
              ) : (
                <button type="button" className="mt-3 btn-rr btn-primary-rr w-full py-2 text-xs inline-flex items-center justify-center gap-1.5" onClick={addItem} data-name="store-add" data-file="pages/business/BusinessCatalog.js">
                  <div className="icon-shopping-bag text-sm text-white"></div>
                  {esCurso ? 'Agregar curso' : 'Agregar'}
                </button>
              )}
            </div>
          </div>
        );
      } catch (error) {
        console.error('BusinessCatalog.StoreCard error:', error);
        return null;
      }
    };

    const StoreGrid = ({ groups, type }) => (
      <React.Fragment>
        {groups.map((group) => (
          <div key={group.title} className="mb-4 last:mb-0" data-name="store-group" data-file="pages/business/BusinessCatalog.js">
            {(groups.length > 1) ? (
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]" data-name="store-group-title" data-file="pages/business/BusinessCatalog.js">{group.title}</h3>
            ) : null}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-name="store-group-items" data-file="pages/business/BusinessCatalog.js">
              {group.items.map((item, index) => <StoreCard key={`${item.id || item.nombre}-${index}`} item={item} type={type} />)}
            </div>
          </div>
        ))}
      </React.Fragment>
    );

    return (
      <div className="space-y-4" data-name="business-catalog-wrap" data-file="pages/business/BusinessCatalog.js">
        {mostrarServicios && services.length ? (
          <div className="surface-rr overflow-hidden" data-name="business-services" data-file="pages/business/BusinessCatalog.js">
            <div className="p-4 md:p-5 border-b border-[var(--border)]" data-name="catalog-head" data-file="pages/business/BusinessCatalog.js">
              <h2 className="text-lg font-semibold" data-name="catalog-title" data-file="pages/business/BusinessCatalog.js">Servicios</h2>
            </div>

            <div data-name="service-list" data-file="pages/business/BusinessCatalog.js">
              {serviceGroups.map((group) => (
                <div key={group.title} data-name="service-group" data-file="pages/business/BusinessCatalog.js">
                  {(serviceGroups.length > 1 || group.title !== 'Servicios') ? (
                    <div className="px-4 md:px-5 py-2.5 bg-[#F6EEE6] border-b border-[var(--border)]" data-name="service-group-title-wrap" data-file="pages/business/BusinessCatalog.js">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]" data-name="service-group-title" data-file="pages/business/BusinessCatalog.js">{group.title}</h3>
                    </div>
                  ) : null}
                  <div className="divide-y divide-[var(--border)]" data-name="service-group-items" data-file="pages/business/BusinessCatalog.js">
                    {group.items.map((service, index) => (
                      <div key={service.id || `${service.nombre}-${index}`} className="p-4 md:p-5 flex items-start justify-between gap-4 hover:bg-[#F6EEE6]" data-name="service-row" data-file="pages/business/BusinessCatalog.js">
                        <div className="min-w-0" data-name="service-copy" data-file="pages/business/BusinessCatalog.js">
                          <p className="text-sm md:text-base font-semibold leading-snug" data-name="service-name" data-file="pages/business/BusinessCatalog.js">{service.nombre}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]" data-name="service-meta" data-file="pages/business/BusinessCatalog.js">
                            {service.duracionMin ? <span data-name="service-duration" data-file="pages/business/BusinessCatalog.js">{service.duracionMin} min</span> : null}
                            {service.destacado ? <span className="chip-rr px-2 py-0.5" data-name="service-featured" data-file="pages/business/BusinessCatalog.js">Recomendado</span> : null}
                          </div>
                          {service.descripcion ? (
                            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed" data-name="service-description" data-file="pages/business/BusinessCatalog.js">{service.descripcion}</p>
                          ) : null}
                        </div>
                        <div className="shrink-0 text-right" data-name="service-price-wrap" data-file="pages/business/BusinessCatalog.js">
                          <p className="text-sm md:text-base font-semibold whitespace-nowrap" data-name="service-price" data-file="pages/business/BusinessCatalog.js">{Format.formatPrecioCUP(service.precio, service.moneda)}</p>
                          <a className="mt-2 btn-rr btn-ghost-rr py-2 px-3 text-xs inline-flex items-center gap-2" href={b.reservaUrl || `https://wa.me/${String(b.whatsapp||'').replace('+','')}?text=${encodeURIComponent(`Hola, quiero reservar ${service.nombre} en ${b.nombre}.`)}`} target="_blank" rel="noopener noreferrer" onClick={() => window.RomaAnalytics?.track?.({ negocioId: b.id, evento: 'reserva_click', itemTipo: 'servicio', itemId: service.id, itemNombre: service.nombre })} data-name="service-book" data-file="pages/business/BusinessCatalog.js">
                            Reservar
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {mostrarTienda && products.length ? (
          <div data-name="business-products" data-file="pages/business/BusinessCatalog.js">
            <div className="flex items-center gap-2 mb-3" data-name="products-head" data-file="pages/business/BusinessCatalog.js">
              <h2 className="text-lg font-semibold" data-name="products-title" data-file="pages/business/BusinessCatalog.js">Productos</h2>
              <span className="chip-rr px-2 py-0.5 text-[11px] text-[var(--text-muted)]" data-name="products-count" data-file="pages/business/BusinessCatalog.js">{products.length}</span>
            </div>
            <StoreGrid groups={productGroups} type="producto" />
          </div>
        ) : null}

        {mostrarTienda && courses.length ? (
          <div data-name="business-courses" data-file="pages/business/BusinessCatalog.js">
            <div className="flex items-center gap-2 mb-3" data-name="courses-head" data-file="pages/business/BusinessCatalog.js">
              <h2 className="text-lg font-semibold" data-name="courses-title" data-file="pages/business/BusinessCatalog.js">Cursos</h2>
              <span className="chip-rr px-2 py-0.5 text-[11px] text-[var(--text-muted)]" data-name="courses-count" data-file="pages/business/BusinessCatalog.js">{courses.length}</span>
            </div>
            <StoreGrid groups={courseGroups} type="curso" />
          </div>
        ) : null}
      </div>
    );
  } catch (error) {
    console.error('BusinessCatalog component error:', error);
    return null;
  }
}
