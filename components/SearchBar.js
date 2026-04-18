function SearchBar({ initialServicio, initialUbicacion, compact }) {
  try {
    const toast = useToast();
    const [servicio, setServicio] = React.useState(initialServicio || '');
    const [ubicacion, setUbicacion] = React.useState(initialUbicacion || '');
    const [focus, setFocus] = React.useState(false);

    React.useEffect(() => {
      try {
        setServicio(initialServicio || '');
        setUbicacion(initialUbicacion || '');
      } catch (error) {
        console.error('SearchBar sync error:', error);
      }
    }, [initialServicio, initialUbicacion]);

    const sugerenciasServicio = [
      'Uñas Acrílicas',
      'Barbería',
      'Estética Facial',
      'Peinados',
      'Maquillaje',
      'Cursos y Talleres'
    ];

    const sugerenciasUbicacion = [
      'La Habana',
      'Vedado',
      'Miramar',
      'Habana Vieja',
      'Centro Habana'
    ];

    const ejecutarBusqueda = () => {
      try {
        if (!servicio && !ubicacion) {
          toast?.push({ title: 'Escribe algo', message: 'Puedes buscar por “Uñas Acrílicas” o por una zona, por ejemplo “Vedado”.' });
          return;
        }
        Navigation.goToSearch(servicio, ubicacion);
      } catch (error) {
        console.error('SearchBar.ejecutarBusqueda error:', error);
      }
    };

    const suggestionChips = (items, onPick) => (
      <div className="flex flex-wrap gap-2 mt-3" data-name="suggestions" data-file="components/SearchBar.js">
        {items.map((s) => (
          <button
            key={s}
            className="chip-rr px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--primary-color)] hover:bg-[rgba(11,18,32,0.05)] transition-colors"
            onClick={() => onPick(s)}
            data-name="suggestion-chip"
            data-file="components/SearchBar.js"
          >
            {s}
          </button>
        ))}
      </div>
    );

    return (
      <div className={`${compact ? 'w-full' : 'w-full max-w-[820px] mx-auto'}`} data-name="searchbar" data-file="components/SearchBar.js">
        <div className={`surface-rr p-3 md:p-4 ${focus ? 'subtle-glow-rr' : ''} transition-shadow`} data-name="searchbar-surface" data-file="components/SearchBar.js">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center" data-name="searchbar-grid" data-file="components/SearchBar.js">
            <div className="flex items-center gap-3" data-name="field-servicio" data-file="components/SearchBar.js">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="field-servicio-icon" data-file="components/SearchBar.js">
                <div className="icon-search text-xl text-[var(--primary-color)]" data-name="field-servicio-icon-i" data-file="components/SearchBar.js"></div>
              </div>
              <div className="min-w-0 flex-1" data-name="field-servicio-input" data-file="components/SearchBar.js">
                <label className="block text-[11px] text-[var(--text-muted)] mb-1" data-name="label-servicio" data-file="components/SearchBar.js">Servicio o curso</label>
                <input
                  className="w-full text-sm bg-transparent outline-none"
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                  placeholder="Ej: Uñas Acrílicas, Barbería"
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  data-name="input-servicio"
                  data-file="components/SearchBar.js"
                />
              </div>
            </div>

            <div className="flex items-center gap-3" data-name="field-ubicacion" data-file="components/SearchBar.js">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)]" data-name="field-ubicacion-icon" data-file="components/SearchBar.js">
                <div className="icon-map-pin text-xl text-[var(--primary-color)]" data-name="field-ubicacion-icon-i" data-file="components/SearchBar.js"></div>
              </div>
              <div className="min-w-0 flex-1" data-name="field-ubicacion-input" data-file="components/SearchBar.js">
                <label className="block text-[11px] text-[var(--text-muted)] mb-1" data-name="label-ubicacion" data-file="components/SearchBar.js">Ubicación</label>
                <input
                  className="w-full text-sm bg-transparent outline-none"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Ej: Vedado, La Habana"
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  data-name="input-ubicacion"
                  data-file="components/SearchBar.js"
                />
              </div>
            </div>

            <button
              className="btn-rr btn-primary-rr w-full md:w-auto flex items-center justify-center gap-2"
              onClick={ejecutarBusqueda}
              data-name="btn-buscar"
              data-file="components/SearchBar.js"
            >
              <span data-name="btn-buscar-text" data-file="components/SearchBar.js">Buscar</span>
              <div className="icon-arrow-right text-xl text-white" data-name="btn-buscar-icon" data-file="components/SearchBar.js"></div>
            </button>
          </div>

          {!compact ? (
            <div className="mt-4" data-name="searchbar-suggestions" data-file="components/SearchBar.js">
              <p className="text-xs text-[var(--text-muted)]" data-name="suggestions-title" data-file="components/SearchBar.js">
                Ideas rápidas para empezar
              </p>
              {suggestionChips(sugerenciasServicio, (s) => setServicio(s))}
              {suggestionChips(sugerenciasUbicacion, (s) => setUbicacion(s))}
            </div>
          ) : null}
        </div>
      </div>
    );
  } catch (error) {
    console.error('SearchBar component error:', error);
    return null;
  }
}