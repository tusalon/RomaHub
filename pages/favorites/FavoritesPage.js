function FavoritesPage() {
  try {
    const readState = () => ({
      favorites: window.RomaSaved?.listFavorites?.() || [],
      recent: window.RomaSaved?.listRecent?.() || [],
      search: window.RomaSaved?.getSearch?.() || { nombre: '', servicio: '', ubicacion: '' }
    });
    const [state, setState] = React.useState(readState);

    React.useEffect(() => window.RomaSaved?.subscribe?.(() => setState(readState())), []);

    const businesses = state.favorites.filter((entry) => entry.type === 'negocio');
    const storeItems = state.favorites.filter((entry) => entry.type !== 'negocio');
    const hasSearch = Boolean(state.search.nombre || state.search.servicio || state.search.ubicacion);
    const searchLabel = [state.search.servicio, state.search.ubicacion, state.search.nombre].filter(Boolean).join(' · ');

    const SavedBusiness = ({ entry, recent = false }) => (
      <article className="surface-rr overflow-hidden flex flex-col" data-name={recent ? 'recent-business-card' : 'favorite-business-card'}>
        <a href={entry.href} className="relative h-32 bg-[var(--bg-muted)] block overflow-hidden">
          {entry.image ? <img src={entry.image} alt={entry.nombre} className="absolute inset-0 w-full h-full object-cover" loading="lazy" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          {entry.logo ? <img src={entry.logo} alt="" className="absolute left-3 bottom-3 w-12 h-12 rounded-xl border-2 border-white bg-white object-contain shadow-sm" loading="lazy" /> : null}
        </a>
        <div className="p-4 flex items-start gap-3">
          <a href={entry.href} className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold truncate">{entry.nombre}</h2>
            <p className="mt-1 text-xs text-[var(--text-muted)] truncate">{entry.subtitle || 'Negocio de belleza'}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary-color)]">Ver perfil <span className="icon-arrow-right"></span></span>
          </a>
          {!recent ? <FavoriteButton entry={entry} /> : null}
        </div>
      </article>
    );

    const SavedStoreItem = ({ entry }) => (
      <article className="surface-rr overflow-hidden flex flex-col" data-name="favorite-store-card">
        <a href={entry.href} className="relative aspect-square bg-[var(--bg-muted)] block overflow-hidden">
          {entry.image ? <img src={entry.image} alt={entry.nombre} className="absolute inset-0 w-full h-full object-cover" loading="lazy" /> : <span className="absolute inset-0 flex items-center justify-center icon-shopping-bag text-4xl text-[var(--primary-color)] opacity-40"></span>}
          <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-[#111827] text-white text-[10px] font-bold capitalize">{entry.type}</span>
        </a>
        <div className="p-3 flex flex-col flex-1">
          <div className="flex items-start gap-2">
            <a href={entry.href} className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold line-clamp-2">{entry.nombre}</h2>
              <p className="mt-1 text-xs text-[var(--text-muted)] truncate">{entry.negocioNombre}</p>
            </a>
            <FavoriteButton entry={entry} className="shrink-0" />
          </div>
          <p className="mt-auto pt-3 text-base font-extrabold text-[var(--primary-color)]">{Format.formatPrecioCUP(entry.precio, entry.moneda)}</p>
          <a href={entry.href} className="mt-3 btn-rr btn-primary-rr py-2 text-xs text-center">Ver detalle</a>
        </div>
      </article>
    );

    return (
      <div data-name="favorites-page">
        <section className="border-b border-[var(--border)] bg-[var(--bg-muted)]">
          <div className="container-rr py-8 md:py-12">
            <p className="kicker-rr">Tu espacio</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight">Guardados en RomaHub</h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-[var(--text-muted)] leading-relaxed">Vuelve rápidamente a tus negocios, productos y cursos favoritos. Se guardan solamente en este dispositivo.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip-rr px-3 py-2 text-xs text-[var(--primary-color)]">{state.favorites.length} guardados</span>
              <span className="chip-rr px-3 py-2 text-xs text-[var(--text-muted)]">Sin crear una cuenta</span>
            </div>
          </div>
        </section>

        <div className="container-rr py-7 md:py-10 space-y-10">
          {hasSearch ? (
            <section className="surface-rr p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-name="last-search">
              <div>
                <p className="kicker-rr">Continúa donde estabas</p>
                <h2 className="mt-1 text-lg font-semibold">Tu última búsqueda</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{searchLabel}</p>
              </div>
              <button type="button" className="btn-rr btn-primary-rr shrink-0" onClick={() => Navigation.goToSearch(state.search.servicio, state.search.ubicacion, state.search.nombre)}>Continuar búsqueda</button>
            </section>
          ) : null}

          <section aria-labelledby="favorite-businesses-title">
            <div className="flex items-end justify-between gap-3 mb-4">
              <div>
                <p className="kicker-rr">Favoritos</p>
                <h2 id="favorite-businesses-title" className="mt-1 text-2xl font-semibold">Negocios guardados</h2>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{businesses.length}</span>
            </div>
            {businesses.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{businesses.map((entry) => <SavedBusiness key={entry.key} entry={entry} />)}</div>
            ) : (
              <div className="surface-rr p-7 text-center">
                <span className="icon-heart text-4xl text-[var(--primary-color)]"></span>
                <p className="mt-3 text-sm font-semibold">Todavía no guardaste ningún negocio</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Pulsa el corazón cuando encuentres uno que te guste.</p>
                <a href="search.html" className="mt-5 btn-rr btn-primary-rr inline-flex">Explorar negocios</a>
              </div>
            )}
          </section>

          {storeItems.length ? (
            <section aria-labelledby="favorite-store-title">
              <div className="flex items-end justify-between gap-3 mb-4">
                <div>
                  <p className="kicker-rr">Para comprar después</p>
                  <h2 id="favorite-store-title" className="mt-1 text-2xl font-semibold">Productos y cursos</h2>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{storeItems.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{storeItems.map((entry) => <SavedStoreItem key={entry.key} entry={entry} />)}</div>
            </section>
          ) : null}

          <section aria-labelledby="recent-title">
            <div className="flex items-end justify-between gap-3 mb-4">
              <div>
                <p className="kicker-rr">Historial local</p>
                <h2 id="recent-title" className="mt-1 text-2xl font-semibold">Vistos recientemente</h2>
              </div>
              {state.recent.length ? <button type="button" className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary-color)]" onClick={() => window.RomaSaved?.clearRecent?.()}>Limpiar</button> : null}
            </div>
            {state.recent.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{state.recent.map((entry) => <SavedBusiness key={entry.key} entry={entry} recent={true} />)}</div>
            ) : (
              <div className="surface-rr p-6 text-sm text-[var(--text-muted)]">Los negocios que visites aparecerán aquí para que puedas encontrarlos otra vez.</div>
            )}
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error('FavoritesPage component error:', error);
    return null;
  }
}
