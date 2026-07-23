function SearchBar({ initialServicio, initialUbicacion, compact }) {
  try {
    const toast = useToast();
    const [provincia, setProvincia] = React.useState(initialUbicacion || '');
    const [focus, setFocus] = React.useState(false);
    const provincias = [
      'La Habana',
      'Artemisa',
      'Mayabeque',
      'Matanzas',
      'Villa Clara',
      'Cienfuegos',
      'Sancti Spíritus',
      'Ciego de Ávila',
      'Camagüey',
      'Las Tunas',
      'Holguín',
      'Granma',
      'Santiago de Cuba',
      'Guantánamo',
      'Pinar del Río',
      'Isla de la Juventud'
    ];

    React.useEffect(() => {
      try {
        setProvincia(initialUbicacion || '');
      } catch (error) {
        console.error('SearchBar sync error:', error);
      }
    }, [initialUbicacion]);

    const ejecutarBusqueda = () => {
      try {
        if (!provincia) {
          toast?.push({ title: 'Selecciona una provincia', message: 'Elige dónde quieres ver negocios activos.' });
          return;
        }
        Navigation.goToSearch('', provincia);
      } catch (error) {
        console.error('SearchBar.ejecutarBusqueda error:', error);
      }
    };

    return (
      <div className={`${compact ? 'w-full' : 'w-full max-w-[760px] mx-auto'}`} data-name="searchbar" data-file="components/SearchBar.js">
        <div className={`surface-rr bg-white p-2 md:p-2 ${focus ? 'subtle-glow-rr' : ''} transition-shadow`} data-name="searchbar-surface" data-file="components/SearchBar.js">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-stretch" data-name="searchbar-grid" data-file="components/SearchBar.js">
            <div className="flex items-center gap-3 px-3 py-3" data-name="field-provincia" data-file="components/SearchBar.js">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(11,18,32,0.04)]" data-name="field-provincia-icon" data-file="components/SearchBar.js">
                <div className="icon-map-pin text-xl text-[var(--primary-color)]" data-name="field-provincia-icon-i" data-file="components/SearchBar.js"></div>
              </div>
              <div className="min-w-0 flex-1" data-name="field-provincia-input" data-file="components/SearchBar.js">
                <label className="block text-[11px] text-[var(--text-muted)] mb-1" data-name="label-provincia" data-file="components/SearchBar.js">Provincia</label>
                <select
                  className="w-full text-sm bg-transparent outline-none"
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  data-name="select-provincia"
                  data-file="components/SearchBar.js"
                >
                  <option value="">Selecciona provincia</option>
                  {provincias.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>

            <button
              className="btn-rr btn-primary-rr w-full md:w-auto flex items-center justify-center gap-2 md:px-7"
              onClick={ejecutarBusqueda}
              data-name="btn-buscar"
              data-file="components/SearchBar.js"
            >
              <span data-name="btn-buscar-text" data-file="components/SearchBar.js">Ver negocios</span>
              <div className="icon-arrow-right text-xl text-white" data-name="btn-buscar-icon" data-file="components/SearchBar.js"></div>
            </button>
          </div>

          {!compact ? (
            <div className="mt-4 px-1" data-name="searchbar-suggestions" data-file="components/SearchBar.js">
              <p className="text-xs text-[var(--text-muted)]" data-name="suggestions-title" data-file="components/SearchBar.js">
                Provincias populares
              </p>
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1" data-name="province-suggestions" data-file="components/SearchBar.js">
                {provincias.slice(0, 8).map((item) => (
                  <button
                    key={item}
                    className={`px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors ${provincia === item ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' : 'border-[var(--border)] bg-white text-[var(--text-muted)] hover:text-[var(--primary-color)] hover:border-[rgba(255,20,147,0.35)]'}`}
                    onClick={() => setProvincia(item)}
                    data-name="suggestion-chip"
                    data-file="components/SearchBar.js"
                  >
                    {item}
                  </button>
                ))}
              </div>
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
