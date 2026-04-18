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
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" data-name="error-state" data-file="business-app.js">
          <div className="text-center max-w-md mx-auto px-6" data-name="error-state-inner" data-file="business-app.js">
            <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--secondary-color)] mb-5" data-name="error-icon" data-file="business-app.js">
              <div className="icon-triangle-alert text-2xl text-[var(--primary-color)]" data-name="error-icon-i" data-file="business-app.js"></div>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text)] mb-2" data-name="error-title" data-file="business-app.js">Algo salió mal</h1>
            <p className="text-sm text-[var(--text-muted)] mb-6" data-name="error-desc" data-file="business-app.js">Lo sentimos, ocurrió un error inesperado. Puedes recargar la página.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-rr btn-primary-rr"
              data-name="error-reload"
              data-file="business-app.js"
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

function BusinessApp() {
  try {
    const businessId = (() => {
      try {
        const url = new URL(window.location.href);
        return url.searchParams.get('id') || 'roma-001';
      } catch (error) {
        console.error('Error leyendo id:', error);
        return 'roma-001';
      }
    })();

    const business = MockData.getBusinessById(businessId);

    return (
      <div className="min-h-screen bg-[var(--bg)]" data-name="business-app" data-file="business-app.js">
        <ToastProvider data-name="toast-provider" data-file="business-app.js">
          <Header currentParams={null} data-name="header-wrap" data-file="business-app.js" />
          <main className="pt-0 pb-24" data-name="main" data-file="business-app.js">
            <BusinessPage business={business} data-name="business-page" data-file="business-app.js" />
          </main>
          <Footer data-name="footer" data-file="business-app.js" />
        </ToastProvider>
      </div>
    );
  } catch (error) {
    console.error('BusinessApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <BusinessApp />
  </ErrorBoundary>
);