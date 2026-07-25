class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Login ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <div className="container-rr py-16 text-center text-sm text-[var(--text-muted)]">Algo salio mal.</div>;
    }
    return this.props.children;
  }
}

function LoginApp() {
  try {
    return (
      <div className="min-h-screen bg-[var(--bg)]" data-name="login-app" data-file="login-app.js">
        <ToastProvider data-name="toast-provider" data-file="login-app.js">
          <Header data-name="header-wrap" data-file="login-app.js" />
          <main className="flex-1 pt-6 pb-16" data-name="main" data-file="login-app.js">
            <LoginBusinessPage data-name="login-business-page" data-file="login-app.js" />
          </main>
          <Footer data-name="footer" data-file="login-app.js" />
        </ToastProvider>
      </div>
    );
  } catch (error) {
    console.error('LoginApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <LoginApp />
  </ErrorBoundary>
);
