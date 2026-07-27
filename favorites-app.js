class FavoritesErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Favorites ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) return <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]">No se pudieron abrir tus guardados.</div>;
    return this.props.children;
  }
}

function FavoritesApp() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ToastProvider>
        <Header />
        <main className="flex-1"><FavoritesPage /></main>
        <Footer />
      </ToastProvider>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FavoritesErrorBoundary><FavoritesApp /></FavoritesErrorBoundary>);
