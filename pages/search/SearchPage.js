const SEARCH_PAGE_SIZE = 24;
const UPCOMING_PREVIEW_SIZE = 6;

function SearchPage({ query, onQueryChange }) {
  try {
    const toast = useToast();
    const [activeId, setActiveId] = React.useState(null);
    const [visibleCount, setVisibleCount] = React.useState(SEARCH_PAGE_SIZE);

    const results = React.useMemo(() => {
      try {
        return MockData.searchBusinesses(query);
      } catch (error) {
        console.error('SearchPage.results error:', error);
        return [];
      }
    }, [query]);

    const upcomingResults = React.useMemo(() => {
      try {
        return MockData.searchUpcomingBusinesses(query);
      } catch (error) {
        console.error('SearchPage.upcomingResults error:', error);
        return [];
      }
    }, [query]);

    const provinceMapBusinesses = React.useMemo(() => {
      try {
        return MockData.searchBusinesses({ nombre: query?.nombre || '', servicio: query?.servicio || '', ubicacion: '' });
      } catch (error) {
        console.error('SearchPage.provinceBusinesses error:', error);
        return [];
      }
    }, [query?.nombre, query?.servicio]);

    const visibleResults = results.slice(0, visibleCount);
    const visibleUpcoming = upcomingResults.slice(0, UPCOMING_PREVIEW_SIZE);
    const hasMore = visibleResults.length < results.length;

    const normalize = (value) => String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const provinceCounts = React.useMemo(() => {
      try {
        const counts = provinceMapBusinesses.reduce((acc, business) => {
          const province = business.ubicacion?.provincia || '';
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
      setVisibleCount(SEARCH_PAGE_SIZE);
    }, [query?.nombre, query?.servicio, query?.ubicacion]);

    React.useEffect(() => {
      try {
        if (!results.length && !upcomingResults.length) {
          toast?.push({ title: 'Sin resultados', message: 'Prueba con otro nombre, servicio, provincia o municipio.' });
        }
      } catch (error) {
        console.error('SearchPage useEffect error:', error);
      }
    }, [results.length, upcomingResults.length]);

    const setQueryParam = (key, value) => {
      try {
        const next = { ...(query || {}), [key]: value };
        onQueryChange?.(next);
        const params = new URLSearchParams();
        if (next.nombre) params.set('nombre', next.nombre);
        if (next.servicio) params.set('servicio', next.servicio);
        if (next.ubicacion) params.set('ubicacion', next.ubicacion);
        const suffix = params.toString();
        window.history.replaceState({}, '', suffix ? `search.html?${suffix}` : 'search.html');
      } catch (error) {
        console.error('SearchPage.setQueryParam error:', error);
      }
    };

    return (
      <div className="container-rr" data-name="search-page" data-file="pages/search/SearchPage.js">
        <div className="flex items-start justify-between gap-4" data-name="search-head" data-file="pages/search/SearchPage.js">
          <div data-name="search-titlewrap" data-file="pages/search/SearchPage.js">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-[-0.02em]" data-name="search-title" data-file="pages/search/SearchPage.js">Explorar negocios</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1" data-name="search-sub" data-file="pages/search/SearchPage.js">
              Encuentra negocios que ya publicaron sus servicios y están listos para atenderte.
            </p>
          </div>
          <span className="hidden md:inline-flex chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="count" data-file="pages/search/SearchPage.js">
            {results.length} {results.length === 1 ? 'negocio disponible' : 'negocios disponibles'}
          </span>
        </div>

        <div className="mt-5 surface-rr p-3 md:p-4" data-name="search-bar" data-file="pages/search/SearchPage.js">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" data-name="search-fields" data-file="pages/search/SearchPage.js">
            <div className="flex items-center gap-3" data-name="field-name" data-file="pages/search/SearchPage.js">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" aria-hidden="true" data-name="field-name-iw" data-file="pages/search/SearchPage.js">
                <div className="icon-store text-xl text-[var(--primary-color)]" data-name="field-name-i" data-file="pages/search/SearchPage.js"></div>
              </div>
              <div className="flex-1" data-name="field-name-in" data-file="pages/search/SearchPage.js">
                <label className="block text-[11px] text-[var(--text-muted)] mb-1" htmlFor="filtro-nombre-negocio" data-name="lbl-name" data-file="pages/search/SearchPage.js">Nombre del negocio</label>
                <input id="filtro-nombre-negocio" className="input-rr" value={query?.nombre || ''} onChange={(e) => setQueryParam('nombre', e.target.value)} placeholder="Ej: Salón Divina" autoComplete="off" data-name="inp-name" data-file="pages/search/SearchPage.js" />
              </div>
            </div>

            <div className="flex items-center gap-3" data-name="field-serv" data-file="pages/search/SearchPage.js">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" aria-hidden="true" data-name="field-serv-iw" data-file="pages/search/SearchPage.js">
                <div className="icon-search text-xl text-[var(--primary-color)]" data-name="field-serv-i" data-file="pages/search/SearchPage.js"></div>
              </div>
              <div className="flex-1" data-name="field-serv-in" data-file="pages/search/SearchPage.js">
                <label className="block text-[11px] text-[var(--text-muted)] mb-1" htmlFor="filtro-servicio" data-name="lbl-serv" data-file="pages/search/SearchPage.js">Servicio</label>
                <input id="filtro-servicio" className="input-rr" value={query?.servicio || ''} onChange={(e) => setQueryParam('servicio', e.target.value)} placeholder="Ej: Uñas acrílicas" autoComplete="off" data-name="inp-serv" data-file="pages/search/SearchPage.js" />
              </div>
            </div>

            <div className="flex items-center gap-3" data-name="field-ubi" data-file="pages/search/SearchPage.js">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" aria-hidden="true" data-name="field-ubi-iw" data-file="pages/search/SearchPage.js">
                <div className="icon-map-pin text-xl text-[var(--primary-color)]" data-name="field-ubi-i" data-file="pages/search/SearchPage.js"></div>
              </div>
              <div className="flex-1" data-name="field-ubi-in" data-file="pages/search/SearchPage.js">
                <label className="block text-[11px] text-[var(--text-muted)] mb-1" htmlFor="filtro-ubicacion" data-name="lbl-ubi" data-file="pages/search/SearchPage.js">Provincia o municipio</label>
                <input id="filtro-ubicacion" className="input-rr" value={query?.ubicacion || ''} onChange={(e) => setQueryParam('ubicacion', e.target.value)} placeholder="Ej: La Habana o Matanzas" autoComplete="off" data-name="inp-ubi" data-file="pages/search/SearchPage.js" />
              </div>
            </div>
          </div>

          {provinceCounts.length ? (
            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1" aria-label="Filtrar por provincia" data-name="province-quick-filters" data-file="pages/search/SearchPage.js">
              <button className={`chip-rr px-3 py-1.5 text-xs whitespace-nowrap ${query?.ubicacion ? 'text-[var(--text-muted)]' : 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]'}`} onClick={() => setQueryParam('ubicacion', '')} data-name="province-chip-all" data-file="pages/search/SearchPage.js">
                Cuba
              </button>
              {provinceCounts.map((province) => {
                const active = normalize(query?.ubicacion) === normalize(province.name);
                return (
                  <button key={province.name} className={`chip-rr px-3 py-1.5 text-xs whitespace-nowrap ${active ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' : 'text-[var(--text-muted)]'}`} onClick={() => setQueryParam('ubicacion', province.name)} data-name="province-chip" data-file="pages/search/SearchPage.js">
                    {province.name} ({province.count})
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <section className="mt-6" aria-labelledby="negocios-disponibles" data-name="active-results" data-file="pages/search/SearchPage.js">
          <div className="flex items-center justify-between gap-3 mb-4" data-name="active-head" data-file="pages/search/SearchPage.js">
            <h2 id="negocios-disponibles" className="text-lg font-semibold" data-name="active-title" data-file="pages/search/SearchPage.js">Negocios disponibles</h2>
            <span className="md:hidden chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)]" data-name="count-mobile" data-file="pages/search/SearchPage.js">{results.length}</span>
          </div>

          {!results.length ? (
            <div className="surface-rr w-full p-6 text-center text-sm text-[var(--text-muted)]" data-name="empty-active-businesses" data-file="pages/search/SearchPage.js">
              No encontramos negocios con servicios publicados para esta búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" data-name="cards" data-file="pages/search/SearchPage.js">
              {visibleResults.map((business) => (
                <div key={business.id} className="reveal-card-rr min-w-0" data-name="card-wrap" data-file="pages/search/SearchPage.js">
                  <BusinessCard business={business} onHover={(item) => setActiveId(item?.id || null)} active={business.id === activeId} data-name="card" data-file="pages/search/SearchPage.js" />
                </div>
              ))}
            </div>
          )}

          {hasMore ? (
            <div className="mt-6 flex justify-center" data-name="load-more-wrap" data-file="pages/search/SearchPage.js">
              <button className="btn-rr btn-ghost-rr px-6" onClick={() => setVisibleCount((count) => count + SEARCH_PAGE_SIZE)} data-name="load-more" data-file="pages/search/SearchPage.js">
                Cargar más negocios
              </button>
            </div>
          ) : null}
        </section>

        {visibleUpcoming.length ? (
          <section className="mt-10" aria-labelledby="negocios-proximamente" data-name="upcoming-results" data-file="pages/search/SearchPage.js">
            <div className="mb-4" data-name="upcoming-head" data-file="pages/search/SearchPage.js">
              <span className="kicker-rr block mb-2" data-name="upcoming-kicker" data-file="pages/search/SearchPage.js">Próximamente</span>
              <h2 id="negocios-proximamente" className="text-lg font-semibold" data-name="upcoming-title" data-file="pages/search/SearchPage.js">También encontramos este nombre</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1" data-name="upcoming-copy" data-file="pages/search/SearchPage.js">Estos negocios todavía están preparando sus servicios y no aparecen en el directorio disponible.</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" data-name="upcoming-cards" data-file="pages/search/SearchPage.js">
              {visibleUpcoming.map((business) => (
                <div key={business.id} className="min-w-0" data-name="upcoming-card-wrap" data-file="pages/search/SearchPage.js">
                  <BusinessCard business={business} upcoming={true} data-name="upcoming-card" data-file="pages/search/SearchPage.js" />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  } catch (error) {
    console.error('SearchPage component error:', error);
    return null;
  }
}

