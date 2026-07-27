function RecentOrdersPage() {
  try {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    const loadOrders = React.useCallback(async () => {
      try {
        setLoading(true);
        setError('');
        const rows = await window.RomaOrders.list();
        setOrders(rows);
      } catch (loadError) {
        console.error('RecentOrdersPage.loadOrders error:', loadError);
        setError('No pudimos actualizar tus pedidos. Revisa tu conexión e inténtalo nuevamente.');
      } finally {
        setLoading(false);
      }
    }, []);

    React.useEffect(() => {
      loadOrders();
      return window.RomaOrders.subscribe(loadOrders);
    }, [loadOrders]);

    const statusInfo = (value) => {
      const status = value === 'enviado_whatsapp' ? 'nuevo' : String(value || 'nuevo');
      const options = {
        nuevo: {
          label: 'Pedido enviado',
          description: 'El negocio recibió tu solicitud. Escríbele por WhatsApp para confirmar disponibilidad, entrega y forma de pago.',
          tone: 'bg-pink-50 text-[var(--primary-color)] border-pink-200',
          step: 0
        },
        contactado: {
          label: 'Negocio contactado',
          description: 'El negocio ya comenzó a atender tu pedido. Continúa los detalles directamente por WhatsApp.',
          tone: 'bg-blue-50 text-blue-700 border-blue-200',
          step: 1
        },
        completado: {
          label: 'Pedido completado',
          description: 'El negocio marcó este pedido como completado.',
          tone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          step: 2
        },
        cancelado: {
          label: 'Pedido cancelado',
          description: 'Este pedido fue marcado como cancelado. Puedes contactar al negocio si necesitas más información.',
          tone: 'bg-red-50 text-red-700 border-red-200',
          step: -1
        }
      };
      return options[status] || options.nuevo;
    };

    const formattedDate = (value) => {
      try {
        return new Intl.DateTimeFormat('es-CU', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }).format(new Date(value));
      } catch (dateError) {
        return '';
      }
    };

    const totalsFor = (order) => {
      const totals = (Array.isArray(order.items) ? order.items : []).reduce((result, item) => {
        const currency = String(item.moneda || 'CUP').toUpperCase();
        const subtotal = Number(item.subtotal != null ? item.subtotal : Number(item.precio || 0) * Number(item.cantidad || 1));
        result[currency] = (result[currency] || 0) + (Number.isFinite(subtotal) ? subtotal : 0);
        return result;
      }, {});
      return Object.entries(totals).map(([currency, amount]) => Format.formatPrecioCUP(amount, currency)).join(' + ');
    };

    const whatsappLink = (order) => {
      let phone = String(order.negocio_whatsapp || '').replace(/\D/g, '');
      if (phone.length === 8) phone = `53${phone}`;
      const shortId = String(order.id || '').slice(0, 8).toUpperCase();
      const message = `Hola, quiero consultar el pedido ${shortId ? `#${shortId}` : ''} que hice en RomaHub.`;
      return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : '';
    };

    const clearHistory = () => {
      if (!window.confirm('¿Quitar el historial de pedidos de este dispositivo? Esta acción no cancela los pedidos.')) return;
      window.RomaOrders.clear();
      setOrders([]);
    };

    const OrderTimeline = ({ order }) => {
      const current = statusInfo(order.estado);
      if (current.step < 0) {
        return (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <span className="icon-circle-x text-lg"></span>
            Pedido cancelado
          </div>
        );
      }
      const steps = ['Enviado', 'Contactado', 'Completado'];
      return (
        <div className="mt-5 grid grid-cols-3" aria-label={`Progreso: ${current.label}`}>
          {steps.map((label, index) => {
            const reached = index <= current.step;
            return (
              <div key={label} className="relative text-center">
                {index ? <span className={`absolute top-3 right-1/2 w-full h-0.5 ${index <= current.step ? 'bg-emerald-400' : 'bg-gray-200'}`}></span> : null}
                <span className={`relative z-10 mx-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${reached ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 bg-white text-gray-300'}`}>
                  {reached ? <span className="icon-check text-xs"></span> : null}
                </span>
                <span className={`mt-2 block text-[10px] sm:text-xs font-semibold ${reached ? 'text-emerald-700' : 'text-[var(--text-muted)]'}`}>{label}</span>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div data-name="recent-orders-page" data-file="pages/orders/RecentOrdersPage.js">
        <section className="border-b border-[var(--border)] bg-[var(--bg-muted)]">
          <div className="container-rr py-8 md:py-12">
            <p className="kicker-rr">Seguimiento sencillo</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight">Mis pedidos</h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-[var(--text-muted)] leading-relaxed">Consulta si el negocio recibió, atendió o completó tus pedidos de RomaHub. No necesitas crear una cuenta.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip-rr px-3 py-2 text-xs text-[var(--primary-color)]">{orders.length} pedidos en este dispositivo</span>
              <span className="chip-rr px-3 py-2 text-xs text-[var(--text-muted)] flex items-center gap-1"><span className="icon-shield"></span> Acceso privado</span>
            </div>
          </div>
        </section>

        <div className="container-rr py-7 md:py-10">
          {loading ? (
            <div className="surface-rr p-8 text-center text-sm text-[var(--text-muted)]">Actualizando tus pedidos...</div>
          ) : error ? (
            <div className="surface-rr p-7 text-center">
              <span className="icon-triangle-alert text-4xl text-[var(--primary-color)]"></span>
              <p className="mt-3 text-sm font-semibold">No pudimos cargar tus pedidos</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{error}</p>
              <button type="button" className="mt-5 btn-rr btn-primary-rr" onClick={loadOrders}>Volver a intentar</button>
            </div>
          ) : orders.length ? (
            <React.Fragment>
              <div className="flex items-center justify-between gap-3 mb-4">
                <p className="text-sm text-[var(--text-muted)]">Los estados los actualiza cada negocio.</p>
                <button type="button" className="text-xs font-semibold text-[var(--primary-color)]" onClick={clearHistory}>Quitar historial</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {orders.map((order) => {
                  const current = statusInfo(order.estado);
                  const waLink = whatsappLink(order);
                  const itemList = Array.isArray(order.items) ? order.items : [];
                  return (
                    <article key={order.id} className="surface-rr p-5 md:p-6" data-name="tracked-order">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl border border-[var(--border)] bg-white overflow-hidden shrink-0 flex items-center justify-center">
                          {order.negocio_logo ? <img src={order.negocio_logo} alt="" className="w-full h-full object-contain p-1.5" loading="lazy" /> : <span className="icon-store text-xl text-[var(--primary-color)]"></span>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h2 className="text-base font-semibold truncate">{order.negocio_nombre}</h2>
                              <p className="mt-1 text-xs text-[var(--text-muted)]">Pedido #{String(order.id || '').slice(0, 8).toUpperCase()} · {formattedDate(order.created_at)}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${current.tone}`}>{current.label}</span>
                          </div>
                        </div>
                      </div>

                      <OrderTimeline order={order} />
                      <p className="mt-4 text-xs text-[var(--text-muted)] leading-relaxed">{current.description}</p>

                      <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
                        {itemList.map((item, index) => (
                          <div key={`${item.id || item.nombre}-${index}`} className="flex items-start justify-between gap-3 text-sm">
                            <span className="min-w-0">{item.nombre} <span className="text-[var(--text-muted)]">×{Number(item.cantidad || 1)}</span></span>
                            <span className="font-semibold shrink-0">{Format.formatPrecioCUP(Number(item.subtotal != null ? item.subtotal : Number(item.precio || 0) * Number(item.cantidad || 1)), item.moneda || 'CUP')}</span>
                          </div>
                        ))}
                        <div className="pt-2 flex items-center justify-between gap-3 font-bold">
                          <span>Total</span>
                          <span className="text-[var(--primary-color)]">{totalsFor(order) || Format.formatPrecioCUP(order.total || 0)}</span>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {waLink ? <a className="btn-rr btn-primary-rr flex items-center justify-center gap-2" href={waLink} target="_blank" rel="noopener noreferrer"><span className="icon-message-circle text-lg"></span> Consultar por WhatsApp</a> : null}
                        <a className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" href={`business.html?id=${encodeURIComponent(order.negocio_id || '')}`}><span className="icon-store text-lg"></span> Ver negocio</a>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                <span className="icon-shield text-xl text-blue-700 mt-0.5"></span>
                <p className="text-xs text-blue-800 leading-relaxed"><strong>Tu privacidad:</strong> este dispositivo guarda solamente códigos aleatorios para encontrar tus pedidos. Tu nombre y WhatsApp no se muestran aquí ni se usan para buscar el historial.</p>
              </div>
            </React.Fragment>
          ) : (
            <div className="surface-rr p-8 md:p-10 text-center max-w-2xl mx-auto">
              <span className="icon-shopping-bag text-5xl text-[var(--primary-color)]"></span>
              <h2 className="mt-4 text-xl font-semibold">Todavía no tienes pedidos guardados</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">Cuando proceses una compra por WhatsApp desde RomaHub, aparecerá aquí automáticamente para que puedas seguirla.</p>
              <a href="tienda.html" className="mt-6 btn-rr btn-primary-rr inline-flex items-center gap-2">Explorar productos y cursos <span className="icon-arrow-right"></span></a>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('RecentOrdersPage component error:', error);
    return null;
  }
}
