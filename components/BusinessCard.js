function BusinessCard({ business, onHover, active, upcoming = false }) {
  try {
    const b = business;
    const border = active ? 'border-[rgba(104,24,49,0.35)] shadow-[0_16px_40px_rgba(104,24,49,0.10)]' : '';
    const serviceSection = (b.categoriasCatalogo || []).find((section) => section.tipo === 'servicios');
    const productSection = (b.categoriasCatalogo || []).find((section) => section.tipo === 'productos');
    const courseSection = (b.categoriasCatalogo || []).find((section) => section.tipo === 'cursos');
    const services = serviceSection?.items || [];
    const featuredServices = services.slice(0, 2);
    const serviceCount = services.length;
    const productCount = productSection?.items?.length || 0;
    const courseCount = courseSection?.items?.length || 0;
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();
    const profileHref = `business.html?id=${encodeURIComponent(b.id)}`;
    const favoriteEntry = window.RomaSaved?.businessEntry?.(b);
    const activePromotion = (b.promociones || [])[0] || null;
    const offerOnly = !b.tieneServicios && Boolean(activePromotion);
    const offerHref = activePromotion ? `business.html?id=${encodeURIComponent(b.id)}&promo=${encodeURIComponent(activePromotion.id)}` : profileHref;
    const description = String(b.descripcion || (upcoming
      ? 'Este negocio está preparando su catálogo para mostrarte todo lo que ofrece.'
      : 'Conoce sus servicios, precios y disponibilidad antes de reservar.')).trim();
    const schedule = typeof b.horario === 'string' ? b.horario.trim() : '';
    const locationLabel = String(b.ubicacionCorta || b.ubicacion?.zona || '').trim();
    const onOfferClick = () => activePromotion && window.RomaAnalytics?.track?.({
      negocioId: b.id,
      evento: 'promocion_click',
      itemTipo: 'promocion',
      itemId: activePromotion.id,
      itemNombre: activePromotion.titulo
    });

    const onContact = (e) => {
      try {
        e?.preventDefault?.();
        const msg = encodeURIComponent(`Hola, quiero reservar en ${b.nombre}. Tienen disponibilidad?`);
        const wa = (b.whatsapp || '').replace(/\s+/g, '');
        const url = b.reservaUrl || `https://wa.me/${wa.replace('+', '')}?text=${msg}`;
        window.RomaAnalytics?.track?.({ negocioId: b.id, evento: 'reserva_click' });
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('BusinessCard.onContact error:', error);
      }
    };

    return (
      <article
        className={`surface-rr card-lift-rr w-full h-full text-left overflow-hidden flex flex-col ${border}`}
        onMouseEnter={() => onHover?.(b)}
        data-name="business-card"
        data-file="components/BusinessCard.js"
      >
        <a href={profileHref} className="relative block h-32 sm:h-36 overflow-hidden bg-gradient-to-br from-[#FDEDE5] via-[#F6EEE6] to-[#F6EEE6]" data-name="business-cover-link" data-file="components/BusinessCard.js">
          {b.portadaUrl ? (
            <img loading="lazy" decoding="async" src={b.portadaUrl} alt={`Portada de ${b.nombre}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]" style={{ objectPosition: `${b.portadaPosicion?.x ?? 50}% ${b.portadaPosicion?.y ?? 50}%` }} data-name="photo-cover" data-file="components/BusinessCard.js" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-[var(--primary-color)]/30" aria-hidden="true" data-name="cover-placeholder" data-file="components/BusinessCard.js">{initials}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" aria-hidden="true"></div>

          {b.vip ? (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#261D29]/90 text-white text-[11px] font-bold border border-white/30 shadow-sm" data-name="vip-chip" data-file="components/BusinessCard.js">
              <span className="icon-crown text-sm text-[#F59E0B]" aria-hidden="true"></span>
              VIP
            </span>
          ) : null}
          {upcoming ? (
            <span className="absolute top-3 right-3 inline-flex px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-[var(--primary-color)] shadow-sm" data-name="upcoming-badge" data-file="components/BusinessCard.js">
              {b.esTiendaExterna ? 'Configurando tienda' : 'Próximamente'}
            </span>
          ) : null}

          <div className="absolute -bottom-px left-4 w-14 h-14 rounded-2xl border-[3px] border-white bg-white overflow-hidden shadow-md" data-name="photo-logo-badge" data-file="components/BusinessCard.js">
            {b.logoUrl ? (
              <img loading="lazy" decoding="async" src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-contain" data-name="photo-img" data-file="components/BusinessCard.js" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-xs font-bold text-[var(--primary-color)] bg-[var(--secondary-color)]" data-name="photo-initials" data-file="components/BusinessCard.js">{initials}</span>
            )}
          </div>
        </a>

        <div className="p-4 pt-5 flex flex-col flex-1" data-name="content" data-file="components/BusinessCard.js">
          <div className="flex items-start gap-3" data-name="top" data-file="components/BusinessCard.js">
            <div className="min-w-0 flex-1" data-name="title" data-file="components/BusinessCard.js">
              <a href={profileHref} className="text-lg name-rr leading-snug flex items-center gap-1 hover:text-[var(--primary-color)]" data-name="name" data-file="components/BusinessCard.js">
                <span className="truncate">{b.nombre}</span>
                {b.esRservasroma ? <span className="shrink-0 text-sm" title="Negocio verificado Rservasroma" data-name="diamond-badge" data-file="components/BusinessCard.js">💎</span> : null}
              </a>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-muted)]" data-name="meta" data-file="components/BusinessCard.js">
                <span className="icon-map-pin text-sm text-[var(--primary-color)] shrink-0" aria-hidden="true"></span>
                <span className="truncate">{[b.categoria, locationLabel].filter(Boolean).join(' · ')}</span>
              </p>
            </div>

            {!upcoming ? (
              <div className="shrink-0 flex items-center gap-2" data-name="top-actions" data-file="components/BusinessCard.js">
                <div className="text-right" data-name="rating" data-file="components/BusinessCard.js">
                  {b.estrellas > 0 ? (
                    <React.Fragment>
                      <div className="flex items-center justify-end gap-1">
                        <span className="icon-star text-sm text-[#F59E0B]" aria-hidden="true"></span>
                        <span className="text-sm font-bold">{Number(b.estrellas).toFixed(1)}</span>
                      </div>
                      <span className="block text-[10px] text-[var(--text-muted)]">{b.totalValoraciones || 0} valoraciones</span>
                    </React.Fragment>
                  ) : (
                    <span className="hidden sm:block text-[10px] text-[var(--text-muted)] whitespace-nowrap">Sin valoraciones</span>
                  )}
                </div>
                {favoriteEntry ? <FavoriteButton entry={favoriteEntry} className="shrink-0 w-9 h-9" /> : null}
              </div>
            ) : favoriteEntry ? <FavoriteButton entry={favoriteEntry} className="shrink-0 w-9 h-9" /> : null}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-2 min-h-[40px]" data-name="business-description" data-file="components/BusinessCard.js">
            {description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2" data-name="badges" data-file="components/BusinessCard.js">
            {upcoming ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--primary-color)]" data-name="services-pending" data-file="components/BusinessCard.js">{b.esTiendaExterna ? 'Preparando catálogo' : 'Preparando servicios'}</span> : null}
            {serviceCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="services-count" data-file="components/BusinessCard.js">{serviceCount} servicios</span> : null}
            {productCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="products-count" data-file="components/BusinessCard.js">{productCount} productos</span> : null}
            {courseCount ? <span className="chip-rr px-2.5 py-1 text-[11px] text-[var(--text-muted)]" data-name="courses-count" data-file="components/BusinessCard.js">{courseCount} cursos</span> : null}
            {(b.promociones || []).length ? <span className="chip-rr px-2.5 py-1 text-[11px] font-bold text-[var(--primary-color)] bg-[var(--secondary-color)]" data-name="promotions-count">Oferta activa</span> : null}
          </div>

          {schedule ? (
            <p className="mt-3 flex items-start gap-2 text-xs text-[var(--text-muted)]" data-name="business-schedule" data-file="components/BusinessCard.js">
              <span className="icon-clock text-sm text-[var(--primary-color)] shrink-0" aria-hidden="true"></span>
              <span className="line-clamp-1">{schedule}</span>
            </p>
          ) : null}

          {featuredServices.length && !upcoming ? (
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-3" data-name="featured-services" data-file="components/BusinessCard.js">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.04em] text-[var(--text-soft)]">Servicios destacados</span>
                {serviceCount > featuredServices.length ? <span className="text-[10px] text-[var(--text-muted)]">+{serviceCount - featuredServices.length} más</span> : null}
              </div>
              {featuredServices.map((service, index) => (
                <div key={service.id || `${service.nombre}-${index}`} className={`flex items-center justify-between gap-3 py-1.5 ${index ? 'border-t border-[var(--border)]' : ''}`} data-name="featured-service" data-file="components/BusinessCard.js">
                  <span className="min-w-0 text-xs text-[var(--text-soft)] truncate">{service.nombre}</span>
                  <span className="shrink-0 text-xs font-bold text-[var(--primary-color)]">{Format.formatPrecioCUP(service.precio, service.moneda)}</span>
                </div>
              ))}
            </div>
          ) : activePromotion && !upcoming ? (
            <a href={offerHref} onClick={onOfferClick} className="mt-4 rounded-xl border border-[rgba(104,24,49,0.20)] bg-[var(--secondary-color)] px-3.5 py-3 hover:border-[rgba(104,24,49,0.45)]" data-name="featured-offer" data-file="components/BusinessCard.js">
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.04em] text-[var(--primary-color)]">Oferta destacada</span>
              <span className="mt-1 block text-sm font-semibold truncate">{activePromotion.titulo}</span>
            </a>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] px-3.5 py-3 text-xs text-[var(--text-muted)]" data-name="catalog-status" data-file="components/BusinessCard.js">
              {b.esTiendaExterna ? 'Este negocio aún no tiene productos publicados.' : 'Este negocio aún está preparando sus servicios.'}
            </div>
          )}

          <div className="mt-auto pt-4 flex items-center gap-2 border-t border-[var(--border)]" data-name="bottom" data-file="components/BusinessCard.js">
            <a href={profileHref} className="btn-rr btn-ghost-rr flex-1 py-2.5 px-3 text-xs text-center whitespace-nowrap" data-name="profile" data-file="components/BusinessCard.js">
              Ver perfil
            </a>

            {upcoming ? null : offerOnly ? (
              <a href={offerHref} onClick={onOfferClick} className="btn-rr btn-primary-rr flex-1 py-2.5 px-3 text-xs text-center whitespace-nowrap" data-name="view-offer" data-file="components/BusinessCard.js">
                Ver oferta
              </a>
            ) : (
              <button
                type="button"
                className="btn-rr btn-primary-rr flex-1 py-2.5 px-3 text-xs flex items-center justify-center gap-2 shadow-md"
                onClick={onContact}
                data-name="contact"
                data-file="components/BusinessCard.js"
                aria-label={`Reservar en ${b.nombre}`}
              >
                <span className="icon-message-circle text-base text-white" aria-hidden="true"></span>
                Reservar
              </button>
            )}
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error('BusinessCard component error:', error);
    return null;
  }
}
