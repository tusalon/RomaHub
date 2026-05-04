function MapSplitView({ businesses, selectedProvince, onProvinceSelect }) {
  try {
    const list = (businesses || []).filter((business) => business.ubicacion?.provincia);
    const normalize = (value) => String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const selected = normalize(selectedProvince);
    const provinceCounts = list.reduce((acc, business) => {
      const province = business.ubicacion?.provincia;
      if (!province) return acc;
      const key = normalize(province);
      if (!acc[key]) acc[key] = { name: province, count: 0 };
      acc[key].count += 1;
      return acc;
    }, {});
    const provinces = Object.values(provinceCounts).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return (
      <div className="relative w-full h-full overflow-hidden bg-[#F7FBF8]" data-name="map-coming-soon" data-file="components/MapSplitView.js">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #F9FAFB 0%, #F3FFF8 48%, #FFF7FC 100%)' }} data-name="map-soon-bg" data-file="components/MapSplitView.js"></div>
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(11,18,32,0.08) 1px, transparent 0)', backgroundSize: '26px 26px' }} data-name="map-soon-texture" data-file="components/MapSplitView.js"></div>

        <div className="relative z-10 h-full flex flex-col justify-center p-5 md:p-8" data-name="map-soon-content" data-file="components/MapSplitView.js">
          <div className="surface-rr bg-white/94 backdrop-blur p-5 md:p-7 max-w-[620px] mx-auto text-center" data-name="map-soon-card" data-file="components/MapSplitView.js">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--primary-color)] flex items-center justify-center shadow-[0_16px_44px_rgba(216,27,96,0.22)]" data-name="map-soon-logo" data-file="components/MapSplitView.js">
              <img src="icons/icon-72x72.png" alt="" className="w-10 h-10 object-contain rounded-xl" data-name="map-soon-logo-img" data-file="components/MapSplitView.js" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-color)]" data-name="map-soon-kicker" data-file="components/MapSplitView.js">Próximas actualizaciones</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight" data-name="map-soon-title" data-file="components/MapSplitView.js">Mapa de negocios por provincia</h2>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed" data-name="map-soon-copy" data-file="components/MapSplitView.js">
              Estamos preparando una vista de mapa más clara para ubicar salones, cursos y tiendas de belleza en Cuba sin hacer pesada la carga de la web.
            </p>

            {provinces.length ? (
              <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar pb-1 justify-start md:justify-center" data-name="map-soon-provinces" data-file="components/MapSplitView.js">
                {provinces.slice(0, 8).map((province) => {
                  const active = selected && normalize(province.name) === selected;
                  return (
                    <button
                      key={province.name}
                      className={`chip-rr px-3 py-1.5 text-xs whitespace-nowrap ${active ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' : 'text-[var(--text-muted)]'}`}
                      onClick={() => onProvinceSelect?.(province.name)}
                      data-name="map-soon-province"
                      data-file="components/MapSplitView.js"
                    >
                      {province.name} ({province.count})
                    </button>
                  );
                })}
              </div>
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
