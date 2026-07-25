class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Tienda ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" data-name="tienda-error" data-file="tienda-app.js">
          <div className="text-center max-w-md mx-auto px-6" data-name="tienda-error-inner" data-file="tienda-app.js">
            <h1 className="text-2xl font-semibold text-[var(--text)] mb-2" data-name="tienda-error-title" data-file="tienda-app.js">Algo salio mal</h1>
            <button onClick={() => window.location.reload()} className="btn-rr btn-primary-rr" data-name="tienda-error-reload" data-file="tienda-app.js">Recargar</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function TiendaApp() {
  try {
    const [dataReady, setDataReady] = React.useState(false);
    const [dataError, setDataError] = React.useState('');

    React.useEffect(() => {
      let mounted = true;
      MockData.loadBusinesses()
        .catch((error) => {
          const message = MockData.getLoadError() || error.message;
          if (!message.includes('SUPABASE_URL')) console.error('TiendaApp.loadBusinesses error:', error);
          if (mounted) setDataError(MockData.getLoadError() || error.message);
        })
        .finally(() => {
          if (mounted) setDataReady(true);
        });
      return () => { mounted = false; };
    }, []);

    return (
      <div className="min-h-screen bg-[var(--bg)]" data-name="tienda-app" data-file="tienda-app.js">
        <ToastProvider data-name="toast-provider" data-file="tienda-app.js">
          <Header data-name="header-wrap" data-file="tienda-app.js" />
          <main className="flex-1" data-name="main" data-file="tienda-app.js">
            {!dataReady ? (
              <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]" data-name="tienda-loading" data-file="tienda-app.js">Cargando tienda...</div>
            ) : dataError ? (
              <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]" data-name="tienda-error-msg" data-file="tienda-app.js">{dataError}</div>
            ) : (
              <TiendaPage data-name="tienda-page" data-file="tienda-app.js" />
            )}
          </main>
          <Footer data-name="footer" data-file="tienda-app.js" />
        </ToastProvider>
      </div>
    );
  } catch (error) {
    console.error('TiendaApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <TiendaApp />
  </ErrorBoundary>
);
