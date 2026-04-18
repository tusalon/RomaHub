function SearchPage({ query, onQueryChange }) {
  try {
    const toast = useToast();
    const [activeId, setActiveId] = React.useState(null);
    const [mobileMap, setMobileMap] = React.useState(false);

    const results = React.useMemo(() => {
      try {
        const list = MockData.searchBusinesses(query);
        const withPos = list.map((b, idx) => {
          const baseX = 16 + (idx * 19) % 70;
          const baseY = 18 + (idx * 23) % 64;
          return { ...b, _mapX: baseX, _mapY: baseY };
        });
        return withPos;
      } catch (e) {
        return [];
      }
    }, [query]);

    React.useEffect(() => {
      try {
        if (!results.length) {
          toast?.push({ title: 'Sin resultados', message: 'Prueba con otra palabra o una ubicación más general, por ejemplo “La Habana”.' });
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
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight" data-name="search-title" data-file="pages/search/SearchPage.js">Resultados</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1" data-name="search-sub" data-file="pages/search/SearchPage.js">
              Lista limpia a la izquierda y mapa interactivo a la derecha.
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
                <input className="input-rr" value={query?.servicio || ''} onChange={(e) => setQueryParam('servicio', e.target.value)} placeholder="Ej: Barbería, Uñas Acrílicas" data-name="inp-serv" data-file="pages/search/SearchPage.js" />
              </div>
            </div>

            <div className="flex items-center gap-3" data-name="field-ubi" data-file="pages/search/SearchPage.js">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="field-ubi-iw" data-file="pages/search/SearchPage.js">
                <div className="icon-map-pin text-xl text-[var(--primary-color)]" data-name="field-ubi-i" data-file="pages/search/SearchPage.js"></div>
              </div>
              <div className="flex-1" data-name="field-ubi-in" data-file="pages/search/SearchPage.js">
                <label className="block text-[11px] text-[var(--text-muted)] mb-1" data-name="lbl-ubi" data-file="pages/search/SearchPage.js">Ubicación</label>
                <input className="input-rr" value={query?.ubicacion || ''} onChange={(e) => setQueryParam('ubicacion', e.target.value)} placeholder="Ej: Vedado, La Habana" data-name="inp-ubi" data-file="pages/search/SearchPage.js" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-4 min-h-[640px]" data-name="split" data-file="pages/search/SearchPage.js">
          <div className="order-2 lg:order-1" data-name="left" data-file="pages/search/SearchPage.js">
            <div className="space-y-3" data-name="cards" data-file="pages/search/SearchPage.js">
              {results.map((b) => (
                <BusinessCard
                  key={b.id}
                  business={b}
                  onHover={(x) => setActiveId(x?.id || null)}
                  active={b.id === activeId}
                  data-name="card"
                  data-file="pages/search/SearchPage.js"
                />
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2" data-name="right" data-file="pages/search/SearchPage.js">
            <div className="hidden lg:block surface-rr overflow-hidden h-[640px]" data-name="map-desktop" data-file="pages/search/SearchPage.js">
              <MapSplitView
                businesses={results}
                activeId={activeId}
                onSelect={(b) => setActiveId(b?.id || null)}
                data-name="map"
                data-file="pages/search/SearchPage.js"
              />
            </div>

            <div className="lg:hidden" data-name="map-mobile" data-file="pages/search/SearchPage.js">
              {mobileMap ? (
                <div className="surface-rr overflow-hidden h-[520px]" data-name="map-mobile-surface" data-file="pages/search/SearchPage.js">
                  <MapSplitView
                    businesses={results}
                    activeId={activeId}
                    onSelect={(b) => setActiveId(b?.id || null)}
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

