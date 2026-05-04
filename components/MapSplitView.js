function MapSplitView({ businesses, selectedProvince, onProvinceSelect }) {
  try {
    const list = businesses || [];
    const provinces = [
      { name: 'Pinar del Rio', x: 9, y: 50 },
      { name: 'Artemisa', x: 19, y: 48 },
      { name: 'La Habana', x: 25, y: 44 },
      { name: 'Mayabeque', x: 30, y: 48 },
      { name: 'Matanzas', x: 38, y: 50 },
      { name: 'Cienfuegos', x: 47, y: 59 },
      { name: 'Villa Clara', x: 50, y: 50 },
      { name: 'Sancti Spiritus', x: 58, y: 56 },
      { name: 'Ciego de Avila', x: 66, y: 55 },
      { name: 'Camaguey', x: 74, y: 58 },
      { name: 'Las Tunas', x: 83, y: 61 },
      { name: 'Holguin', x: 89, y: 57 },
      { name: 'Granma', x: 86, y: 70 },
      { name: 'Santiago de Cuba', x: 93, y: 72 },
      { name: 'Guantanamo', x: 97, y: 68 },
      { name: 'Isla de la Juventud', x: 29, y: 72 }
    ];

    const normalize = (value) => String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const selected = normalize(selectedProvince);
    const counts = list.reduce((acc, business) => {
      const province = business.ubicacion?.provincia || business.ubicacion?.ciudad || 'La Habana';
      acc[normalize(province)] = (acc[normalize(province)] || 0) + 1;
      return acc;
    }, {});

    const activeProvince = provinces.find((province) => normalize(province.name) === selected)
      || provinces.find((province) => counts[normalize(province.name)] > 0)
      || provinces[2];

    return (
      <div className="relative w-full h-full bg-[#F9FAFB]" data-name="map-split-view" data-file="components/MapSplitView.js">
        <div className="absolute inset-0" data-name="map-texture" data-file="components/MapSplitView.js"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(11,18,32,0.10) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        ></div>

        <div className="absolute top-4 left-4 right-4 z-10" data-name="map-hint" data-file="components/MapSplitView.js">
          <div className="surface-rr p-3 flex items-center gap-3" data-name="map-hint-inner" data-file="components/MapSplitView.js">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--secondary-color)]" data-name="map-hint-iw" data-file="components/MapSplitView.js">
              <div className="icon-map text-xl text-[var(--primary-color)]" data-name="map-hint-i" data-file="components/MapSplitView.js"></div>
            </div>
            <div className="min-w-0" data-name="map-hint-text" data-file="components/MapSplitView.js">
              <p className="text-sm font-semibold" data-name="map-hint-title" data-file="components/MapSplitView.js">Mapa de Cuba</p>
              <p className="text-xs text-[var(--text-muted)]" data-name="map-hint-sub" data-file="components/MapSplitView.js">
                Toca una provincia para filtrar negocios activos.
              </p>
            </div>
          </div>
        </div>

        <svg viewBox="0 0 1000 520" className="absolute inset-x-4 top-[92px] bottom-[120px] w-[calc(100%-2rem)] h-[calc(100%-212px)]" role="img" aria-label="Mapa de Cuba" data-name="cuba-map-svg" data-file="components/MapSplitView.js">
          <path
            d="M52 245 C120 195 196 182 270 199 C340 215 392 196 465 208 C550 222 620 260 700 272 C786 284 860 270 942 305 C872 340 786 342 702 328 C625 316 570 285 495 278 C420 272 355 300 276 282 C196 264 122 282 52 245 Z"
            fill="#EAF7F0"
            stroke="#0B1220"
            strokeOpacity="0.18"
            strokeWidth="5"
            data-name="cuba-main"
            data-file="components/MapSplitView.js"
          />
          <path
            d="M235 378 C275 352 318 355 355 382 C318 405 271 406 235 378 Z"
            fill="#EAF7F0"
            stroke="#0B1220"
            strokeOpacity="0.18"
            strokeWidth="4"
            data-name="cuba-isla"
            data-file="components/MapSplitView.js"
          />
        </svg>

        <div className="absolute inset-x-4 top-[92px] bottom-[120px]" data-name="province-pins" data-file="components/MapSplitView.js">
          {provinces.map((province) => {
            const key = normalize(province.name);
            const count = counts[key] || 0;
            const isSelected = selected && key === selected;
            const isActiveFallback = !selected && activeProvince.name === province.name;
            const active = isSelected || isActiveFallback;

            return (
              <button
                key={province.name}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-transform ${active ? 'scale-110 z-20' : 'scale-100 z-10'} ${count ? '' : 'opacity-45'}`}
                style={{ left: `${province.x}%`, top: `${province.y}%` }}
                onClick={() => onProvinceSelect?.(province.name)}
                data-name="province-pin"
                data-file="components/MapSplitView.js"
                aria-label={`Filtrar por ${province.name}`}
              >
                <span className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-[0_12px_34px_rgba(11,18,32,0.16)] border ${active ? 'bg-[var(--primary-color)] border-[var(--primary-color)] text-white' : 'bg-white border-[var(--border)] text-[var(--primary-color)]'}`} data-name="province-pin-mark" data-file="components/MapSplitView.js">
                  <span className="text-xs font-semibold" data-name="province-pin-logo" data-file="components/MapSplitView.js">RR</span>
                </span>
                <span className="px-2 py-1 rounded-full bg-white/95 border border-[var(--border)] text-[10px] font-medium whitespace-nowrap shadow-sm" data-name="province-pin-label" data-file="components/MapSplitView.js">
                  {province.name} - {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="absolute left-4 right-4 bottom-4 z-20" data-name="province-summary" data-file="components/MapSplitView.js">
          <div className="card-rr p-4 flex items-center justify-between gap-3" data-name="province-summary-card" data-file="components/MapSplitView.js">
            <div className="min-w-0" data-name="province-summary-copy" data-file="components/MapSplitView.js">
              <p className="text-sm font-semibold truncate" data-name="province-summary-title" data-file="components/MapSplitView.js">{activeProvince.name}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1" data-name="province-summary-sub" data-file="components/MapSplitView.js">
                {counts[normalize(activeProvince.name)] || 0} negocios activos en esta provincia.
              </p>
            </div>
            {selected ? (
              <button
                className="btn-rr btn-ghost-rr py-2 px-3 text-xs"
                onClick={() => onProvinceSelect?.('')}
                data-name="province-clear"
                data-file="components/MapSplitView.js"
              >
                Ver Cuba
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('MapSplitView component error:', error);
    return null;
  }
}

