class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Panel ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]">Algo salio mal.</div>;
    }
    return this.props.children;
  }
}

function PanelApp() {
  try {
    return (
      <div className="min-h-screen bg-[var(--bg)]" data-name="panel-app" data-file="panel-app.js">
        <ToastProvider data-name="toast-provider" data-file="panel-app.js">
          <Header data-name="header-wrap" data-file="panel-app.js" />
          <main className="flex-1 pb-16" data-name="main" data-file="panel-app.js">
            <BusinessPanelPage data-name="business-panel-page" data-file="panel-app.js" />
          </main>
          <Footer data-name="footer" data-file="panel-app.js" />
        </ToastProvider>
      </div>
    );
  } catch (error) {
    console.error('PanelApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <PanelApp />
  </ErrorBoundary>
);
