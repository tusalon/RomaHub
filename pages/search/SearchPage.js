function SearchPage({ query, onQueryChange }) {
  try {
    const toast = useToast();
    const [activeId, setActiveId] = React.useState(null);
    const [mobileMap, setMobileMap] = React.useState(false);

    const results = React.useMemo(() => {
      try {
        return MockData.searchBusinesses(query);
      } catch (e) {
        return [];
      }
    }, [query]);

    const provinceMapBusinesses = React.useMemo(() => {
      try {
        return MockData.searchBusinesses({ servicio: query?.servicio || '', ubicacion: '' });
      } catch (e) {
        return [];
      }
    }, [query?.servicio]);

    const normalize = (value) => String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const provinceCounts = React.useMemo(() => {
      try {
        const counts = provinceMapBusinesses.reduce((acc, business) => {
          const province = business.ubicacion?.provincia || business.ubicacion?.ciudad || '';
          if (!province) return acc;
          const key = normalize(province);
          if (!acc[key]) acc[key] = { name: province, count: 0 };
          acc[key].count += 1;
          return acc;
        }, {});
        return Object.values(counts).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      } catch (error) {
        console.error('SearchPage.provinceCounts error:', error);
        return [];
      }
    }, [provinceMapBusinesses]);

    React.useEffect(() => {
      try {
        if (!results.length) {
          toast?.push({ title: 'Sín resultados', message: 'Prueba con otra palabra o una ubicacion más general, por ejemplo La Habana.' });
        }
      } catch (error) {
        console.error('SearchPage useEffect error:', error);
      }
    }, [results.length]);

    const setQueryParam = (key, value) => {
      try {
        const next = { ...(query || {}), [key]: value };
        onQueryChange?.(next);
        const params = new URLSearchParams();
        if (next.servicio) params.set('servicio', next.servicio);
        if (next.ubicacion) params.set('ubicacion', next.ubicacion);
        window.history.replaceState({}, '', `search.html?${params.toString()}`);
      } catch (error) {
        console.error('SearchPage.setQueryParam error:', error);
      }
    };

    return (
      <div className="container-rr" data-name="search-page" data-file="pages/search/SearchPage.js">
        <div className="flex items-start justify-between gap-4" data-name="search-head" data-file="pages/search/SearchPage.js">
          <div data-name="search-titlewrap" data-file="pages/search/SearchPage.js">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-[-0.02em]" data-name="search-title" data-file="pages/search/SearchPage.js">Resultados</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1" data-name="search-sub" data-file="pages/search/SearchPage.js">
              Desliza los negocios activos y consulta su ubicación en el mapa.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2" data-name="search-meta" data-file="pages/search/SearchPage.js">
            <span className="chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="count" data-file="pages/search/SearchPage.js">
              {results.length} negocios
            </span>
          </div>
        </div>

        <div className="mt-5 surface-rr p-3 md:p-4" data-name="search-bar" data-file="pages/search/SearchPage.js">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-name="search-fields" data-file="pages/search/SearchPage.js">
            <div className="flex items-center gap-3" data-name="field-serv" data-file="pages/search/SearchPage.js">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="field-serv-iw" data-file="pages/search/SearchPage.js">
                <div className="icon-search text-xl text-[var(--primary-color)]" data-name="field-serv-i" data-file="pages/search/SearchPage.js"></div>
              </div>
              <div className="flex-1" data-name="field-serv-in" data-file="pages/search/SearchPage.js">
                <label className="block text-[11px] text-[var(--text-muted)] mb-1" data-name="lbl-serv" data-file="pages/search/SearchPage.js">Servicio o curso</label>
                <input className="input-rr" value={query?.servicio || ''} onChange={(e) => setQueryParam('servicio', e.target.value)} placeholder="Ej: Barbería, uñas acrílicas" data-name="inp-serv" data-file="pages/search/SearchPage.js" />
              </div>
            </div>

            <div className="flex items-center gap-3" data-name="field-ubi" data-file="pages/search/SearchPage.js">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="field-ubi-iw" data-file="pages/search/SearchPage.js">
                <div className="icon-map-pin text-xl text-[var(--primary-color)]" data-name="field-ubi-i" data-file="pages/search/SearchPage.js"></div>
              </div>
              <div className="flex-1" data-name="field-ubi-in" data-file="pages/search/SearchPage.js">
                <label className="block text-[11px] text-[var(--text-muted)] mb-1" data-name="lbl-ubi" data-file="pages/search/SearchPage.js">Provincia o zona</label>
                <input className="input-rr" value={query?.ubicacion || ''} onChange={(e) => setQueryParam('ubicacion', e.target.value)} placeholder="Ej: La Habana, Matanzas, Vedado" data-name="inp-ubi" data-file="pages/search/SearchPage.js" />
              </div>
            </div>
          </div>
          {provinceCounts.length ? (
            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1" data-name="province-quick-filters" data-file="pages/search/SearchPage.js">
              <button
                className={`chip-rr px-3 py-1.5 text-xs whitespace-nowrap ${query?.ubicacion ? 'text-[var(--text-muted)]' : 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]'}`}
                onClick={() => setQueryParam('ubicacion', '')}
                data-name="province-chip-all"
                data-file="pages/search/SearchPage.js"
              >
                Cuba
              </button>
              {provinceCounts.map((province) => {
                const active = normalize(query?.ubicacion) === normalize(province.name);
                return (
                  <button
                    key={province.name}
                    className={`chip-rr px-3 py-1.5 text-xs whitespace-nowrap ${active ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' : 'text-[var(--text-muted)]'}`}
                    onClick={() => setQueryParam('ubicacion', province.name)}
                    data-name="province-chip"
                    data-file="pages/search/SearchPage.js"
                  >
                    {province.name} ({province.count})
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="mt-5" data-name="horizontal-results" data-file="pages/search/SearchPage.js">
          <div className="flex items-center justify-between gap-3 mb-3" data-name="active-head" data-file="pages/search/SearchPage.js">
            <p className="text-sm font-semibold" data-name="active-title" data-file="pages/search/SearchPage.js">Negocios activos</p>
            <span className="md:hidden chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="count-mobile" data-file="pages/search/SearchPage.js">
              {results.length} negocios
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 snap-x snap-mandatory" data-name="cards" data-file="pages/search/SearchPage.js">
              {!results.length ? (
                <div className="surface-rr w-full p-6 text-center text-sm text-[var(--text-muted)]" data-name="empty-active-businesses" data-file="pages/search/SearchPage.js">
                  No hay negocios activos para mostrar.
                </div>
              ) : null}
              {results.map((b) => (
                <div key={b.id} className="min-w-[340px] max-w-[340px] snap-start" data-name="card-wrap" data-file="pages/search/SearchPage.js">
                  <BusinessCard
                    business={b}
                    onHover={(x) => setActiveId(x?.id || null)}
                    active={b.id === activeId}
                    data-name="card"
                    data-file="pages/search/SearchPage.js"
                  />
                </div>
              ))}
          </div>

          <div className="mt-4" data-name="map-area" data-file="pages/search/SearchPage.js">
            <div className="hidden lg:block surface-rr overflow-hidden h-[520px]" data-name="map-desktop" data-file="pages/search/SearchPage.js">
              <MapSplitView
                businesses={provinceMapBusinesses}
                selectedProvince={query?.ubicacion || ''}
                onProvinceSelect={(province) => setQueryParam('ubicacion', province)}
                data-name="map"
                data-file="pages/search/SearchPage.js"
              />
            </div>

            <div className="lg:hidden" data-name="map-mobile" data-file="pages/search/SearchPage.js">
              {mobileMap ? (
                <div className="surface-rr overflow-hidden h-[520px]" data-name="map-mobile-surface" data-file="pages/search/SearchPage.js">
                  <MapSplitView
                    businesses={provinceMapBusinesses}
                    selectedProvince={query?.ubicacion || ''}
                    onProvinceSelect={(province) => setQueryParam('ubicacion', province)}
                    data-name="map-m"
                    data-file="pages/search/SearchPage.js"
                  />
                </div>
              ) : null}

              <div className="fixed bottom-5 left-0 right-0 z-[65] flex justify-center px-4" data-name="map-toggle-wrap" data-file="pages/search/SearchPage.js">
                <button
                  className="btn-rr btn-primary-rr flex items-center gap-2 shadow-[0_18px_60px_rgba(11,18,32,0.22)]"
                  onClick={() => setMobileMap((v) => !v)}
                  data-name="map-toggle"
                  data-file="pages/search/SearchPage.js"
                >
                  <div className={`${mobileMap ? 'icon-list' : 'icon-map'} text-xl text-white`} data-name="map-toggle-i" data-file="pages/search/SearchPage.js"></div>
                  <span data-name="map-toggle-t" data-file="pages/search/SearchPage.js">{mobileMap ? 'Ver lista' : 'Ver mapa'}</span>
                </button>
              </div>
            </div>

        </div>
      </div>
      </div>
    );
  } catch (error) {
    console.error('SearchPage component error:', error);
    return null;
  }
}



