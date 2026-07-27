class OrdersErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Orders ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) return <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]">No se pudieron abrir tus pedidos.</div>;
    return this.props.children;
  }
}

function OrdersApp() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ToastProvider>
        <Header />
        <main className="flex-1"><RecentOrdersPage /></main>
        <Footer />
      </ToastProvider>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<OrdersErrorBoundary><OrdersApp /></OrdersErrorBoundary>);
