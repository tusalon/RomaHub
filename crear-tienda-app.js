class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CrearTienda ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]">Algo salio mal.</div>;
    }
    return this.props.children;
  }
}

function CrearTiendaApp() {
  try {
    return (
      <div className="min-h-screen bg-[var(--bg)]" data-name="crear-tienda-app" data-file="crear-tienda-app.js">
        <ToastProvider data-name="toast-provider" data-file="crear-tienda-app.js">
          <Header data-name="header-wrap" data-file="crear-tienda-app.js" />
          <main className="pt-6 pb-16" data-name="main" data-file="crear-tienda-app.js">
            <CrearTiendaPage data-name="crear-tienda-page" data-file="crear-tienda-app.js" />
          </main>
          <Footer data-name="footer" data-file="crear-tienda-app.js" />
        </ToastProvider>
      </div>
    );
  } catch (error) {
    console.error('CrearTiendaApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <CrearTiendaApp />
  </ErrorBoundary>
);
