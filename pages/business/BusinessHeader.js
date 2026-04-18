function BusinessHeader({ business }) {
  try {
    const b = business;

    return (
      <section data-name="business-header" data-file="pages/business/BusinessHeader.js">
        <div className="relative h-[240px] md:h-[320px] bg-[#F9FAFB]" data-name="cover" data-file="pages/business/BusinessHeader.js">
          <img src={b.portadaUrl} alt={`Portada de ${b.nombre}`} className="w-full h-full object-cover" data-name="cover-img" data-file="pages/business/BusinessHeader.js" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#D81B60]/22 via-black/10 to-transparent" data-name="cover-grad" data-file="pages/business/BusinessHeader.js"></div>
        </div>

        <div className="-mt-14 md:-mt-16" data-name="overlap" data-file="pages/business/BusinessHeader.js">
          <div className="container-rr" data-name="overlap-inner" data-file="pages/business/BusinessHeader.js">
            <div className="card-rr p-5 md:p-6" data-name="header-card" data-file="pages/business/BusinessHeader.js">
              <div className="flex flex-col md:flex-row md:items-center gap-4" data-name="header-row" data-file="pages/business/BusinessHeader.js">
                <div className="flex items-start gap-4 min-w-0" data-name="left" data-file="pages/business/BusinessHeader.js">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl overflow-hidden bg-white border border-[var(--border)] shrink-0" data-name="logo" data-file="pages/business/BusinessHeader.js">
                    <img src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-cover" data-name="logo-img" data-file="pages/business/BusinessHeader.js" />
                  </div>
                  <div className="min-w-0" data-name="title" data-file="pages/business/BusinessHeader.js">
                    <div className="flex flex-wrap items-center gap-2" data-name="title-row" data-file="pages/business/BusinessHeader.js">
                      <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate" data-name="name" data-file="pages/business/BusinessHeader.js">{b.nombre}</h1>
                      {b.vip ? <Badge type="vip" text="VIP" data-name="vip" data-file="pages/business/BusinessHeader.js" /> : null}
                      {b.topRoma ? <Badge type="top" text="🌟 Top Roma" data-name="top" data-file="pages/business/BusinessHeader.js" /> : null}
                      {b.masReservado ? <Badge type="reservado" text="Más reservado" data-name="res" data-file="pages/business/BusinessHeader.js" /> : null}
                      {b.negocioDelMes ? <Badge type="mes" text="Negocio del Mes" data-name="mes" data-file="pages/business/BusinessHeader.js" /> : null}
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-1" data-name="meta" data-file="pages/business/BusinessHeader.js">
                      {b.categoria} · {b.ubicacion?.zona} · {b.ubicacion?.ciudad}
                    </p>
                    <div className="mt-3" data-name="rating" data-file="pages/business/BusinessHeader.js">
                      <StarRating value={b.estrellas} total={b.totalReseñas} verified={b.verificado} data-name="stars" data-file="pages/business/BusinessHeader.js" />
                    </div>
                  </div>
                </div>

                <div className="md:ml-auto w-full md:w-auto" data-name="right" data-file="pages/business/BusinessHeader.js">
                  <div className="surface-rr p-4" data-name="addr" data-file="pages/business/BusinessHeader.js">
                    <div className="flex items-start gap-3" data-name="addr-row" data-file="pages/business/BusinessHeader.js">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="addr-iw" data-file="pages/business/BusinessHeader.js">
                        <div className="icon-map-pin text-xl text-[var(--primary-color)]" data-name="addr-i" data-file="pages/business/BusinessHeader.js"></div>
                      </div>
                      <div className="min-w-0" data-name="addr-t" data-file="pages/business/BusinessHeader.js">
                        <p className="text-xs text-[var(--text-muted)]" data-name="addr-l" data-file="pages/business/BusinessHeader.js">Ubicación</p>
                        <p className="text-sm font-medium leading-snug" data-name="addr-v" data-file="pages/business/BusinessHeader.js">{b.ubicacion?.direccion}</p>
                      </div>
                    </div>
                    <div className="divider-rr my-4" data-name="addr-div" data-file="pages/business/BusinessHeader.js"></div>
                    <div className="flex items-center justify-between gap-3" data-name="addr-price" data-file="pages/business/BusinessHeader.js">
                      <span className="text-xs text-[var(--text-muted)]" data-name="addr-price-l" data-file="pages/business/BusinessHeader.js">Rango de precio</span>
                      <span className="text-sm font-semibold" data-name="addr-price-v" data-file="pages/business/BusinessHeader.js">{Format.formatRangoPrecio(b.rangoPrecio?.min, b.rangoPrecio?.max)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2" data-name="header-ctas" data-file="pages/business/BusinessHeader.js">
                <a className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" href={`https://wa.me/${String(b.whatsapp||'').replace('+','')}?text=${encodeURIComponent(`Hola, quiero reservar en ${b.nombre}. ¿Tienen disponibilidad?`)}`} target="_blank" rel="noreferrer" data-name="cta-wa" data-file="pages/business/BusinessHeader.js">
                  <div className="icon-message-circle text-xl text-white" data-name="cta-wa-i" data-file="pages/business/BusinessHeader.js"></div>
                  Reservar por WhatsApp
                </a>
                <button className="btn-rr btn-ghost-rr w-full flex items-center justify-center gap-2" onClick={() => Navigation.goToSearch(b.categoria, b.ubicacion?.zona || b.ubicacion?.ciudad || '')} data-name="cta-sim" data-file="pages/business/BusinessHeader.js">
                  <div className="icon-search text-xl text-[var(--primary-color)]" data-name="cta-sim-i" data-file="pages/business/BusinessHeader.js"></div>
                  Ver similares
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('BusinessHeader component error:', error);
    return null;
  }
}