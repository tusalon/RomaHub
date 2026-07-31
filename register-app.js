class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Register ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6EEE6]" data-name="register-error" data-file="register-app.js">
          <div className="text-center max-w-md mx-auto px-6" data-name="register-error-inner" data-file="register-app.js">
            <h1 className="text-2xl font-semibold text-[var(--text)] mb-2" data-name="register-error-title" data-file="register-app.js">Algo salio mal</h1>
            <button onClick={() => window.location.reload()} className="btn-rr btn-primary-rr" data-name="register-error-reload" data-file="register-app.js">Recargar</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function RegisterApp() {
  try {
    return (
      <div className="min-h-screen bg-[var(--bg)]" data-name="register-app" data-file="register-app.js">
        <ToastProvider data-name="toast-provider" data-file="register-app.js">
          <Header data-name="header-wrap" data-file="register-app.js" />
          <main className="flex-1 pt-6 pb-16" data-name="main" data-file="register-app.js">
            <RegisterBusinessPage data-name="register-business-page" data-file="register-app.js" />
          </main>
          <Footer data-name="footer" data-file="register-app.js" />
        </ToastProvider>
      </div>
    );
  } catch (error) {
    console.error('RegisterApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <RegisterApp />
  </ErrorBoundary>
);
