function ProductoPage() {
  try {
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id') || '';
    const tipoParam = params.get('tipo') || '';
    const articulos = MockData.listShowcaseProducts();
    const item = articulos.find((a) => String(a.itemId) === String(productoId) && (!tipoParam || a.tipo === tipoParam)) || null;

    if (!item) {
      return (
        <div className="container-rr pt-14 md:pt-20" data-name="producto-not-found" data-file="pages/producto/ProductoPage.js">
          <div className="surface-rr max-w-[620px] mx-auto p-6 md:p-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] mb-5">
              <div className="icon-search-x text-2xl text-[var(--primary-color)]"></div>
            </div>
            <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">Puede que el enlace haya cambiado o que ya no este disponible.</p>
            <a href="tienda.html" className="mt-6 btn-rr btn-primary-rr inline-flex items-center justify-center gap-2">Ver tiendas</a>
          </div>
        </div>
      );
    }

    const esCurso = item.tipo === 'curso';
    const agotado = esCurso ? item.cupos === 0 : item.stock === 0;
    const whatsapp = String(item.negocioWhatsapp || '').replace(/\D/g, '');
    const whatsappCompleto = whatsapp.length === 8 ? `53${whatsapp}` : whatsapp;
    const contactUrl = whatsappCompleto
      ? `https://wa.me/${whatsappCompleto}?text=${encodeURIComponent(`Hola, vi ${item.nombre} en RomaHub y quiero ${esCurso ? 'más información' : 'comprarlo'}.`)}`
      : null;
    const relacionados = articulos
      .filter((a) => a.negocioId === item.negocioId && a.id !== item.id)
      .slice(0, 8);

    const track = (evento) => window.RomaAnalytics?.track?.({
      negocioId: item.negocioId,
      evento,
      itemTipo: item.tipo,
      itemId: item.itemId,
      itemNombre: item.nombre
    }, evento === 'producto_visto' ? { oncePerDay: true } : undefined);

    React.useEffect(() => { track('producto_visto'); }, [item.id]);

    return (
      <div className="container-rr pt-6 md:pt-10 pb-16" data-name="producto-page" data-file="pages/producto/ProductoPage.js">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
          <div className="surface-rr overflow-hidden">
            <div className="relative aspect-square bg-[#F6EEE6]">
              {item.imagen ? (
                <img src={item.imagen} alt={item.nombre} className={`absolute inset-0 w-full h-full object-cover ${agotado ? 'opacity-50 grayscale' : ''}`} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`${esCurso ? 'icon-graduation-cap' : 'icon-shopping-bag'} text-6xl text-[var(--primary-color)] opacity-40`}></div>
                </div>
              )}
              {esCurso ? <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#261D29] text-white text-[10px] font-bold">Curso</span> : null}
              {agotado ? <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-white text-xs font-bold">Agotado</span> : null}
            </div>
          </div>

          <div>
            <a href={`business.html?id=${encodeURIComponent(item.negocioId)}`} className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-[var(--border)] shrink-0">
                {item.negocioLogo ? <img src={item.negocioLogo} alt={item.negocioNombre} className="w-full h-full object-contain" /> : null}
              </div>
              <span className="text-sm font-semibold group-hover:text-[var(--primary-color)]">{item.negocioNombre}</span>
              <InsigniaTienda tipo={item.negocioInsignia} />
            </a>

            <h1 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">{item.nombre}</h1>
            {item.categoria ? <p className="mt-1 text-sm text-[var(--text-muted)]">{item.categoria}</p> : null}
            <p className="mt-3 text-3xl font-extrabold text-[var(--primary-color)]">{Format.formatPrecioCUP(item.precio, item.moneda)}</p>

            {!esCurso && item.stock > 0 ? <p className="mt-2 text-sm text-[var(--text-muted)]">Stock: {item.stock}</p> : null}
            {esCurso && item.ubicacion ? <p className="mt-2 text-sm text-[var(--text-muted)]">📍 {item.ubicacion}</p> : null}

            {item.descripcion ? <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed">{item.descripcion}</p> : null}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {agotado ? (
                <span className="btn-rr py-3 flex-1 flex items-center justify-center bg-[var(--bg-muted)] text-[var(--text-muted)] cursor-not-allowed">Agotado</span>
              ) : contactUrl ? (
                <a className="btn-rr btn-primary-rr py-3 flex-1 flex items-center justify-center gap-2" href={contactUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click')}>
                  <span className="icon-message-circle text-lg text-white"></span>
                  {esCurso ? 'Me interesa' : 'Comprar por WhatsApp'}
                </a>
              ) : null}
              <a className="btn-rr btn-ghost-rr py-3 flex-1 flex items-center justify-center gap-2" href={`business.html?id=${encodeURIComponent(item.negocioId)}`}>
                Ver tienda completa
              </a>
            </div>
          </div>
        </div>

        {relacionados.length ? (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Más de {item.negocioNombre}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {relacionados.map((relacionado) => <ProductCard key={`${relacionado.tipo}-${relacionado.id}`} item={relacionado} />)}
            </div>
          </div>
        ) : null}
      </div>
    );
  } catch (error) {
    console.error('ProductoPage component error:', error);
    return null;
  }
}
