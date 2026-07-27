// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" data-name="error-state" data-file="search-app.js">
          <div className="text-center max-w-md mx-auto px-6" data-name="error-state-inner" data-file="search-app.js">
            <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] mb-5" data-name="error-icon" data-file="search-app.js">
              <div className="icon-triangle-alert text-2xl text-[var(--primary-color)]" data-name="error-icon-i" data-file="search-app.js"></div>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text)] mb-2" data-name="error-title" data-file="search-app.js">Algo salió mal</h1>
            <p className="text-sm text-[var(--text-muted)] mb-6" data-name="error-desc" data-file="search-app.js">Lo sentimos, ocurrió un error inesperado. Puedes recargar la página.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-rr btn-primary-rr"
              data-name="error-reload"
              data-file="search-app.js"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function SearchApp() {
  try {
    const [dataReady, setDataReady] = React.useState(false);
    const [dataError, setDataError] = React.useState('');
    const [query, setQuery] = React.useState(() => {
      try {
        const current = Navigation.getSearchParams();
        return current.nombre || current.servicio || current.ubicacion || current.ofertas
          ? current
          : (window.RomaSaved?.getSearch?.() || current);
      } catch (e) {
        return { nombre: '', servicio: '', ubicacion: '', ofertas: false };
      }
    });

    React.useEffect(() => {
      let mounted = true;
      MockData.loadBusinesses()
        .catch((error) => {
          const message = MockData.getLoadError() || error.message;
          if (!message.includes('SUPABASE_URL')) console.error('SearchApp.loadBusinesses error:', error);
          if (mounted) setDataError(MockData.getLoadError() || error.message);
        })
        .finally(() => {
          if (mounted) setDataReady(true);
        });
      return () => {
        mounted = false;
      };
    }, []);

    React.useEffect(() => {
      try {
        const onPop = () => {
          try {
            setQuery(Navigation.getSearchParams());
          } catch (error) {
            console.error('Error al actualizar busqueda:', error);
          }
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
      } catch (error) {
        console.error('SearchApp useEffect error:', error);
      }
    }, []);

    return (
      <div className="min-h-screen bg-[var(--bg)]" data-name="search-app" data-file="search-app.js">
        <ToastProvider data-name="toast-provider" data-file="search-app.js">
          <Header currentParams={query} data-name="header-wrap" data-file="search-app.js" />
          <main className="flex-1 pt-4 pb-16" data-name="main" data-file="search-app.js">
            {dataError ? (
              <DataSourceError message={dataError} data-name="data-source-error" data-file="search-app.js" />
            ) : dataReady ? (
              <SearchPage query={query} onQueryChange={setQuery} data-name="search-page" data-file="search-app.js" />
            ) : (
              <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]" data-name="loading" data-file="search-app.js">Cargando negocios...</div>
            )}
          </main>
          <Footer data-name="footer" data-file="search-app.js" />
        </ToastProvider>
      </div>
    );
  } catch (error) {
    console.error('SearchApp component error:', error);
    return null;
  }
}

function DataSourceError({ message }) {
  try {
    return (
      <div className="container-rr py-16" data-name="data-source-error" data-file="search-app.js">
        <div className="surface-rr max-w-[680px] mx-auto p-6 md:p-8 text-center" data-name="data-source-error-card" data-file="search-app.js">
          <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] mb-5" data-name="data-source-error-icon" data-file="search-app.js">
            <div className="icon-database-zap text-2xl text-[var(--primary-color)]" data-name="data-source-error-icon-i" data-file="search-app.js"></div>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--text)]" data-name="data-source-error-title" data-file="search-app.js">Base de datos no conectada</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed" data-name="data-source-error-desc" data-file="search-app.js">{message}</p>
          <p className="text-xs text-[var(--text-muted)] mt-4" data-name="data-source-error-help" data-file="search-app.js">
            Configura window.SUPABASE_URL y window.SUPABASE_ANON_KEY en utils/supabase-config.js.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DataSourceError component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <SearchApp />
  </ErrorBoundary>
);
