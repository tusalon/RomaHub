class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Producto ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6EEE6]" data-name="producto-error" data-file="producto-app.js">
          <div className="text-center max-w-md mx-auto px-6" data-name="producto-error-inner" data-file="producto-app.js">
            <h1 className="text-2xl font-semibold text-[var(--text)] mb-2" data-name="producto-error-title" data-file="producto-app.js">Algo salio mal</h1>
            <button onClick={() => window.location.reload()} className="btn-rr btn-primary-rr" data-name="producto-error-reload" data-file="producto-app.js">Recargar</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProductoApp() {
  try {
    const [dataReady, setDataReady] = React.useState(false);
    const [dataError, setDataError] = React.useState('');

    React.useEffect(() => {
      let mounted = true;
      MockData.loadBusinesses()
        .catch((error) => {
          const message = MockData.getLoadError() || error.message;
          if (!message.includes('SUPABASE_URL')) console.error('ProductoApp.loadBusinesses error:', error);
          if (mounted) setDataError(MockData.getLoadError() || error.message);
        })
        .finally(() => {
          if (mounted) setDataReady(true);
        });
      return () => { mounted = false; };
    }, []);

    return (
      <div className="min-h-screen bg-[var(--bg)]" data-name="producto-app" data-file="producto-app.js">
        <ToastProvider data-name="toast-provider" data-file="producto-app.js">
          <Header data-name="header-wrap" data-file="producto-app.js" />
          <main className="flex-1" data-name="main" data-file="producto-app.js">
            {!dataReady ? (
              <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]" data-name="producto-loading" data-file="producto-app.js">Cargando producto...</div>
            ) : dataError ? (
              <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]" data-name="producto-error-msg" data-file="producto-app.js">{dataError}</div>
            ) : (
              <ProductoPage data-name="producto-page" data-file="producto-app.js" />
            )}
          </main>
          <Footer data-name="footer" data-file="producto-app.js" />
        </ToastProvider>
      </div>
    );
  } catch (error) {
    console.error('ProductoApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ProductoApp />
  </ErrorBoundary>
);
