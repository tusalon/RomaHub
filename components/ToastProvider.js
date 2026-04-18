const ToastContext = React.createContext(null);

function ToastProvider({ children }) {
  try {
    const [toasts, setToasts] = React.useState([]);

    const push = React.useCallback((toast) => {
      try {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const t = { id, type: toast?.type || 'info', title: toast?.title || 'Listo', message: toast?.message || '' };
        setToasts((prev) => [t, ...prev].slice(0, 3));
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((x) => x.id !== id));
        }, 3200);
      } catch (error) {
        console.error('ToastProvider.push error:', error);
      }
    }, []);

    const api = React.useMemo(() => ({ push }), [push]);

    return (
      <ToastContext.Provider value={api} data-name="toast-provider" data-file="components/ToastProvider.js">
        <div data-name="toast-provider-inner" data-file="components/ToastProvider.js">
          {children}
          <div className="fixed top-4 right-4 z-[70] space-y-2 w-[320px] max-w-[calc(100vw-32px)]" data-name="toast-stack" data-file="components/ToastProvider.js">
            {toasts.map((t) => (
              <div key={t.id} className="card-rr px-4 py-3" data-name="toast" data-file="components/ToastProvider.js">
                <div className="flex items-start gap-3" data-name="toast-row" data-file="components/ToastProvider.js">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--secondary-color)] shrink-0" data-name="toast-icon-wrap" data-file="components/ToastProvider.js">
                    <div className="icon-info text-xl text-[var(--primary-color)]" data-name="toast-icon" data-file="components/ToastProvider.js"></div>
                  </div>
                  <div className="min-w-0" data-name="toast-content" data-file="components/ToastProvider.js">
                    <p className="text-sm font-medium" data-name="toast-title" data-file="components/ToastProvider.js">{t.title}</p>
                    {t.message ? (
                      <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed" data-name="toast-message" data-file="components/ToastProvider.js">{t.message}</p>
                    ) : null}
                  </div>
                  <button
                    className="ml-auto text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors"
                    onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                    data-name="toast-close"
                    data-file="components/ToastProvider.js"
                    aria-label="Cerrar"
                  >
                    <div className="icon-x text-lg" data-name="toast-close-icon" data-file="components/ToastProvider.js"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ToastContext.Provider>
    );
  } catch (error) {
    console.error('ToastProvider component error:', error);
    return children || null;
  }
}

function useToast() {
  try {
    const ctx = React.useContext(ToastContext);
    return ctx;
  } catch (error) {
    console.error('useToast error:', error);
    return null;
  }
}