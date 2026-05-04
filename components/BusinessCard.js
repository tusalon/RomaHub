function BusinessCard({ business, onHover, active }) {
  try {
    const b = business;
    const border = active ? 'border-[rgba(216,27,96,0.35)] shadow-[0_16px_40px_rgba(216,27,96,0.10)]' : '';
    const serviceSection = (b.categoriasCatalogo || []).find((section) => section.tipo === 'servicios');
    const productSection = (b.categoriasCatalogo || []).find((section) => section.tipo === 'productos');
    const courseSection = (b.categoriasCatalogo || []).find((section) => section.tipo === 'cursos');
    const serviceCount = serviceSection?.items?.length || 0;
    const productCount = productSection?.items?.length || 0;
    const courseCount = courseSection?.items?.length || 0;
    const firstService = serviceSection?.items?.[0] || null;
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();

    const onOpen = () => {
      try {
        Navigation.goToBusiness(b.id);
      } catch (error) {
        console.error('BusinessCard.onOpen error:', error);
      }
    };

    const onContact = (e) => {
      try {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        const msg = encodeURIComponent(`Hola, quiero reservar en ${b.nombre}. Tienen disponibilidad?`);
        const wa = (b.whatsapp || '').replace(/\s+/g, '');
        const url = b.reservaUrl || `https://wa.me/${wa.replace('+', '')}?text=${msg}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('BusinessCard.onContact error:', error);
      }
    };

    const onKeyDown = (e) => {
      try {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      } catch (error) {
        console.error('BusinessCard.onKeyDown error:', error);
      }
    };

    return (
      <div
        className={`surface-rr w-full text-left overflow-hidden transition-shadow hover:shadow-[0_14px_34px_rgba(11,18,32,0.10)] ${border} cursor-pointer`}
        onMouseEnter={() => onHover?.(b)}
        onFocus={() => onHover?.(b)}
        onClick={onOpen}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        data-name="business-card"
        data-file="components/BusinessCard.js"
        aria-label={`Abrir perfil de ${b.nombre}`}
      >
        <div className="grid grid-cols-[96px_1fr] gap-4 p-3" data-name="business-card-inner" data-file="components/BusinessCard.js">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white border border-[var(--border)] p-2" data-name="photo" data-file="components/BusinessCard.js">
            {b.logoUrl ? (
              <img loading="lazy" decoding="async" src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-contain" data-name="photo-img" data-file="components/BusinessCard.js" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-[var(--primary-color)]" data-name="photo-initials" data-file="components/BusinessCard.js">{initials}</div>
            )}
            {b.vip ? (
              <div className="absolute top-2 left-2" data-name="vip" data-file="components/BusinessCard.js">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#1F2937] text-white text-[11px] border border-white/20" data-name="vip-chip" data-file="components/BusinessCard.js">
                  <div className="icon-crown text-sm text-[#F59E0B]" data-name="vip-icon" data-file="components/BusinessCard.js"></div>
                  VIP
                </span>
              </div>
            ) : null}
          </div>

          <div className="min-w-0" data-name="content" data-file="components/BusinessCard.js">
            <div className="flex items-start gap-3" data-name="top" data-file="components/BusinessCard.js">
              <div className="min-w-0" data-name="title" data-file="components/BusinessCard.js">
                <p className="text-base font-semibold leading-snug truncate" data-name="name" data-file="components/BusinessCard.js">{b.nombre}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 truncate" data-name="meta" data-file="components/BusinessCard.js">
                  {b.categoria} ? {b.ubicacion?.provincia || b.ubicacion?.zona}
                </p>
              </div>
              <div className="ml-auto hidden sm:flex flex-col items-end gap-1" data-name="top-right" data-file="components/BusinessCard.js">
                <div className="flex items-center gap-1" data-name="stars" data-file="components/BusinessCard.js">
                  <div className="icon-star text-base text-[#F59E0B]" data-name="star" data-file="components/BusinessCard.js"></div>
                  <span className="text-sm font-semibold" data-name="star-val" data-file="components/BusinessCard.js">{Number(b.estrellas).toFixed(1)}</span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)]" data-name="reviews" data-file="components/BusinessCard.js">{b.totalResenas} resenas</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2" data-name="badges" data-file="components/BusinessCard.js">
              {serviceCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="services-count" data-file="components/BusinessCard.js">{serviceCount} servicios</span> : null}
              {productCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="products-count" data-file="components/BusinessCard.js">Tienda</span> : null}
              {courseCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="courses-count" data-file="components/BusinessCard.js">Cursos</span> : null}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3" data-name="bottom" data-file="components/BusinessCard.js">
              <span className="text-xs text-[var(--text-muted)] truncate" data-name="price" data-file="components/BusinessCard.js">
                {firstService ? `${firstService.nombre} - ${Format.formatPrecioCUP(firstService.precio)}` : Format.formatRangoPrecio(b.rangoPrecio?.min, b.rangoPrecio?.max)}
              </span>

              <button
                type="button"
                className="btn-rr btn-primary-rr py-2 px-4 text-xs flex items-center gap-2 shadow-md"
                onClick={onContact}
                data-name="contact"
                data-file="components/BusinessCard.js"
                aria-label={`Reservar en ${b.nombre}`}
              >
                <div className="icon-message-circle text-base text-white" data-name="contact-i" data-file="components/BusinessCard.js"></div>
                Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BusinessCard component error:', error);
    return null;
  }
}


