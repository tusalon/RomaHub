function MapSplitView({ businesses, activeId, onSelect }) {
  try {
    const list = businesses || [];
    const active = list.find((b) => b.id === activeId) || null;

    const MapPin = ({ business }) => {
      try {
        const b = business;
        const size = b.vip ? 'w-12 h-12' : 'w-10 h-10';
        const ring = b.vip ? 'ring-2 ring-[#F59E0B]/60' : 'ring-1 ring-[rgba(31,41,55,0.14)]';
        const scale = b.id === activeId ? 'scale-110' : 'scale-100';

        return (
          <button
            className={`absolute ${size} ${ring} rounded-2xl bg-white flex items-center justify-center shadow-[0_18px_55px_rgba(11,18,32,0.16)] transform ${scale} transition-transform`}
            style={{ left: `${b._mapX}%`, top: `${b._mapY}%` }}
            onClick={() => onSelect?.(b)}
            data-name="map-pin"
            data-file="components/MapSplitView.js"
            aria-label={`Pin de ${b.nombre}`}
          >
            <div className="w-7 h-7 rounded-xl bg-[#D81B60] flex items-center justify-center overflow-hidden" data-name="map-pin-inner" data-file="components/MapSplitView.js">
              <img
                src="https://app.trickle.so/storage/public/images/usr_1dec1efb58008001/55d88a3b-fbdf-46a8-bc34-5c6dac55ec46.png"
                alt="Rservas.Roma"
                className="w-full h-full object-cover"
                data-name="map-pin-logo"
                data-file="components/MapSplitView.js"
              />
            </div>
          </button>
        );
      } catch (error) {
        console.error('MapSplitView.MapPin error:', error);
        return null;
      }
    };

    return (
      <div className="relative w-full h-full" data-name="map-split-view" data-file="components/MapSplitView.js">
        <div className="absolute inset-0 bg-[#F9FAFB]" data-name="map-bg" data-file="components/MapSplitView.js">
          <div className="absolute inset-0" data-name="map-grid" data-file="components/MapSplitView.js"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(11,18,32,0.12) 1px, transparent 0)',
              backgroundSize: '22px 22px'
            }}
          ></div>

          <div className="absolute top-4 left-4 right-4" data-name="map-hint" data-file="components/MapSplitView.js">
            <div className="surface-rr p-3 flex items-center gap-3" data-name="map-hint-inner" data-file="components/MapSplitView.js">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="map-hint-iw" data-file="components/MapSplitView.js">
                <div className="icon-map text-xl text-[var(--primary-color)]" data-name="map-hint-i" data-file="components/MapSplitView.js"></div>
              </div>
              <div className="min-w-0" data-name="map-hint-text" data-file="components/MapSplitView.js">
                <p className="text-sm font-semibold" data-name="map-hint-title" data-file="components/MapSplitView.js">Mapa interactivo</p>
                <p className="text-xs text-[var(--text-muted)]" data-name="map-hint-sub" data-file="components/MapSplitView.js">
                  Pins VIP más grandes. Toca para ver una tarjeta mínima.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute inset-0" data-name="map-pins" data-file="components/MapSplitView.js">
            {list.map((b) => (
              <MapPin key={b.id} business={b} data-name="pin" data-file="components/MapSplitView.js" />
            ))}
          </div>

          {active ? (
            <div className="absolute bottom-4 left-4 right-4" data-name="map-card" data-file="components/MapSplitView.js">
              <div className="card-rr p-4" data-name="map-card-inner" data-file="components/MapSplitView.js">
                <div className="flex items-start gap-3" data-name="map-card-row" data-file="components/MapSplitView.js">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[var(--border)] bg-white" data-name="map-card-logo" data-file="components/MapSplitView.js">
                    <img src={active.logoUrl} alt={`Logo de ${active.nombre}`} className="w-full h-full object-cover" data-name="map-card-logo-img" data-file="components/MapSplitView.js" />
                  </div>
                  <div className="min-w-0" data-name="map-card-content" data-file="components/MapSplitView.js">
                    <p className="text-sm font-semibold truncate" data-name="map-card-name" data-file="components/MapSplitView.js">{active.nombre}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate mt-1" data-name="map-card-meta" data-file="components/MapSplitView.js">{active.categoria} · {active.ubicacion?.zona}</p>
                    <div className="mt-2 flex items-center justify-between gap-3" data-name="map-card-bottom" data-file="components/MapSplitView.js">
                      <span className="text-xs text-[var(--text-muted)]" data-name="map-card-price" data-file="components/MapSplitView.js">
                        {Format.formatRangoPrecio(active.rangoPrecio?.min, active.rangoPrecio?.max)}
                      </span>
                      <button
                        className="btn-rr btn-primary-rr py-2 px-3 text-xs flex items-center gap-2"
                        onClick={() => Navigation.goToBusiness(active.id)}
                        data-name="map-card-open"
                        data-file="components/MapSplitView.js"
                      >
                        Ver perfil
                        <div className="icon-arrow-right text-base text-white" data-name="map-card-open-i" data-file="components/MapSplitView.js"></div>
                      </button>
                    </div>
                  </div>
                  <button
                    className="ml-auto text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors"
                    onClick={() => onSelect?.(null)}
                    data-name="map-card-close"
                    data-file="components/MapSplitView.js"
                    aria-label="Cerrar"
                  >
                    <div className="icon-x text-lg" data-name="map-card-close-i" data-file="components/MapSplitView.js"></div>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  } catch (error) {
    console.error('MapSplitView component error:', error);
    return null;
  }
}