function BusinessPage({ business }) {
  try {
    const b = business;
    const initials = String(b.nombre || 'N').trim().slice(0, 2).toUpperCase();
    const catalog = b.categoriasCatalogo || [];
    const hasStore = Boolean((catalog.find((section) => section.tipo === 'productos')?.items || []).length || (catalog.find((section) => section.tipo === 'cursos')?.items || []).length);
    const [cart, setCart] = React.useState([]);
    const [customer, setCustomer] = React.useState({ nombre: '', whatsapp: '', direccion: '', nota: '' });
    const [cartMessage, setCartMessage] = React.useState('');
    const [sendingOrder, setSendingOrder] = React.useState(false);
    const total = cart.reduce((sum, entry) => sum + (Number(entry.precio || 0) * entry.qty), 0);

    const addToCart = (item, type) => {
      try {
        const id = `${type}-${item.id || item.nombre}`;
        setCart((prev) => {
          const found = prev.find((entry) => entry.id === id);
          if (found) return prev.map((entry) => entry.id === id ? { ...entry, qty: entry.qty + 1 } : entry);
          return [...prev, { id, type, nombre: item.nombre, precio: Number(item.precio || 0), qty: 1 }];
        });
      } catch (error) {
        console.error('BusinessPage.addToCart error:', error);
      }
    };

    const removeFromCart = (id) => {
      try {
        setCart((prev) => prev.filter((entry) => entry.id !== id));
      } catch (error) {
        console.error('BusinessPage.removeFromCart error:', error);
      }
    };

    const updateCustomer = (field, value) => {
      try {
        setCustomer((current) => ({ ...current, [field]: value }));
      } catch (error) {
        console.error('BusinessPage.updateCustomer error:', error);
      }
    };

    const processCart = async () => {
      try {
        if (!cart.length) return;
        setCartMessage('');
        const nombre = customer.nombre.trim();
        const whatsappCliente = customer.whatsapp.replace(/\D/g, '');
        const direccion = customer.direccion.trim();
        const nota = customer.nota.trim();
        if (nombre.length < 2) {
          setCartMessage('Escribe tu nombre para procesar el pedido.');
          return;
        }
        if (!/^\d{8,15}$/.test(whatsappCliente)) {
          setCartMessage('Escribe un WhatsApp válido, solo números.');
          return;
        }
        setSendingOrder(true);
        const lines = [
          `Hola, quiero hacer un pedido en ${b.nombre}.`,
          '',
          ...cart.map((entry) => `- ${entry.nombre} x${entry.qty}: ${Format.formatPrecioCUP(entry.precio * entry.qty)}`),
          '',
          `Total: ${Format.formatPrecioCUP(total)}`,
          '',
          `Cliente: ${nombre}`,
          `WhatsApp: ${whatsappCliente}`,
          direccion ? `Direccion o referencia: ${direccion}` : '',
          nota ? `Nota: ${nota}` : ''
        ].filter(Boolean);

        try {
          await MockData.addOrder(b.id, {
            cliente_nombre: nombre,
            cliente_whatsapp: whatsappCliente,
            items: cart.map((entry) => ({
              id: entry.id,
              tipo: entry.type,
              nombre: entry.nombre,
              precio: entry.precio,
              cantidad: entry.qty,
              subtotal: entry.precio * entry.qty
            })),
            total
          });
        } catch (error) {
          console.warn('No se pudo guardar el pedido antes de WhatsApp:', error);
        }

        const wa = String(b.whatsapp || '').replace('+', '').replace(/\D/g, '');
        if (!wa) {
          setCartMessage('Este negocio no tiene WhatsApp configurado.');
          return;
        }
        window.location.href = `https://wa.me/${wa}?text=${encodeURIComponent(lines.join('\n'))}`;
      } catch (error) {
        console.error('BusinessPage.processCart error:', error);
        setCartMessage('No se pudo procesar el pedido.');
      } finally {
        setSendingOrder(false);
      }
    };

    const renderCartCard = () => (
      <div className="surface-rr p-5" data-name="cart-card" data-file="pages/business/BusinessPage.js">
        <div className="flex items-center justify-between gap-3" data-name="cart-head" data-file="pages/business/BusinessPage.js">
          <p className="text-sm font-semibold" data-name="cart-title" data-file="pages/business/BusinessPage.js">Carrito</p>
          <span className="text-xs text-[var(--text-muted)]" data-name="cart-count" data-file="pages/business/BusinessPage.js">{cart.length} items</span>
        </div>
        {cart.length ? (
          <div className="mt-4 space-y-3" data-name="cart-items" data-file="pages/business/BusinessPage.js">
            {cart.map((entry) => (
              <div key={entry.id} className="flex items-start justify-between gap-3" data-name="cart-item" data-file="pages/business/BusinessPage.js">
                <div className="min-w-0" data-name="cart-item-copy" data-file="pages/business/BusinessPage.js">
                  <p className="text-sm font-medium leading-snug" data-name="cart-item-name" data-file="pages/business/BusinessPage.js">{entry.nombre}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1" data-name="cart-item-meta" data-file="pages/business/BusinessPage.js">x{entry.qty} - {Format.formatPrecioCUP(entry.precio * entry.qty)}</p>
                </div>
                <button type="button" className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center" onClick={() => removeFromCart(entry.id)} aria-label="Quitar" data-name="cart-remove" data-file="pages/business/BusinessPage.js">
                  <div className="icon-x text-base text-[var(--primary-color)]" data-name="cart-remove-icon" data-file="pages/business/BusinessPage.js"></div>
                </button>
              </div>
            ))}
            <div className="divider-rr" data-name="cart-divider" data-file="pages/business/BusinessPage.js"></div>
            <div className="flex items-center justify-between" data-name="cart-total" data-file="pages/business/BusinessPage.js">
              <span className="text-sm text-[var(--text-muted)]" data-name="cart-total-label" data-file="pages/business/BusinessPage.js">Total</span>
              <span className="text-base font-semibold" data-name="cart-total-value" data-file="pages/business/BusinessPage.js">{Format.formatPrecioCUP(total)}</span>
            </div>
            <div className="space-y-2" data-name="cart-form" data-file="pages/business/BusinessPage.js">
              <input
                className="input-rr text-sm"
                value={customer.nombre}
                onChange={(e) => updateCustomer('nombre', e.target.value)}
                placeholder="Tu nombre"
                data-name="cart-customer-name"
                data-file="pages/business/BusinessPage.js"
              />
              <input
                className="input-rr text-sm"
                value={customer.whatsapp}
                onChange={(e) => updateCustomer('whatsapp', e.target.value)}
                inputMode="tel"
                placeholder="Tu WhatsApp"
                data-name="cart-customer-whatsapp"
                data-file="pages/business/BusinessPage.js"
              />
              <input
                className="input-rr text-sm"
                value={customer.direccion}
                onChange={(e) => updateCustomer('direccion', e.target.value)}
                placeholder="Direccion o referencia"
                data-name="cart-customer-address"
                data-file="pages/business/BusinessPage.js"
              />
              <textarea
                className="input-rr text-sm min-h-[72px] resize-y"
                value={customer.nota}
                onChange={(e) => updateCustomer('nota', e.target.value)}
                placeholder="Nota opcional"
                data-name="cart-customer-note"
                data-file="pages/business/BusinessPage.js"
              />
            </div>
            {cartMessage ? <p className="text-xs text-[var(--text-muted)] leading-relaxed" data-name="cart-message" data-file="pages/business/BusinessPage.js">{cartMessage}</p> : null}
            <button type="button" className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" onClick={processCart} disabled={sendingOrder} data-name="cart-process" data-file="pages/business/BusinessPage.js">
              {sendingOrder ? 'Preparando...' : 'Procesar por WhatsApp'}
              <div className="icon-message-circle text-xl text-white" data-name="cart-process-icon" data-file="pages/business/BusinessPage.js"></div>
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed" data-name="cart-empty" data-file="pages/business/BusinessPage.js">
            Agrega productos o cursos para armar el pedido.
          </p>
        )}
      </div>
    );

    return (
      <div data-name="business-page" data-file="pages/business/BusinessPage.js">
        <BusinessHeader business={b} data-name="business-header" data-file="pages/business/BusinessPage.js" />

        <div className="container-rr mt-5 md:mt-7" data-name="business-content" data-file="pages/business/BusinessPage.js">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start" data-name="business-grid" data-file="pages/business/BusinessPage.js">
            <div data-name="left" data-file="pages/business/BusinessPage.js">
              <BusinessCatalog business={b} onAddToCart={addToCart} data-name="catalog" data-file="pages/business/BusinessPage.js" />
              {hasStore ? <div className="lg:hidden mt-4" data-name="mobile-cart" data-file="pages/business/BusinessPage.js">
                {renderCartCard()}
              </div> : null}
              <BusinessReviews business={b} data-name="reviews" data-file="pages/business/BusinessPage.js" />
            </div>

            <aside className="hidden lg:block sticky top-[92px]" data-name="right" data-file="pages/business/BusinessPage.js">
              <div className="surface-rr p-5" data-name="contact-card" data-file="pages/business/BusinessPage.js">
                <div className="flex items-center gap-3" data-name="contact-top" data-file="pages/business/BusinessPage.js">
                  <div className="w-12 h-12 rounded-lg border border-[var(--border)] bg-white overflow-hidden p-1.5" data-name="contact-logo" data-file="pages/business/BusinessPage.js">
                    {b.logoUrl ? (
                      <img loading="lazy" decoding="async" src={b.logoUrl} alt={`Logo de ${b.nombre}`} className="w-full h-full object-contain" data-name="contact-logo-img" data-file="pages/business/BusinessPage.js" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[var(--primary-color)]" data-name="contact-logo-initials" data-file="pages/business/BusinessPage.js">{initials}</div>
                    )}
                  </div>
                  <div className="min-w-0" data-name="contact-copy" data-file="pages/business/BusinessPage.js">
                    <p className="text-sm font-semibold truncate" data-name="contact-name" data-file="pages/business/BusinessPage.js">{b.nombre}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate" data-name="contact-area" data-file="pages/business/BusinessPage.js">{b.ubicacion?.zona || b.ubicacion?.ciudad}</p>
                  </div>
                </div>

                <div className="divider-rr my-4" data-name="contact-div" data-file="pages/business/BusinessPage.js"></div>

                <a
                  className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2"
                  href={b.reservaUrl || `https://wa.me/${String(b.whatsapp||'').replace('+','')}?text=${encodeURIComponent(`Hola, quiero reservar en ${b.nombre}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-name="sticky-wa"
                  data-file="pages/business/BusinessPage.js"
                >
                  <div className="icon-message-circle text-xl text-white" data-name="sticky-wa-i" data-file="pages/business/BusinessPage.js"></div>
                  Reservar
                </a>
              </div>
              {hasStore ? <div className="mt-4" data-name="desktop-cart" data-file="pages/business/BusinessPage.js">
                {renderCartCard()}
              </div> : null}
            </aside>
          </div>
        </div>

        <MobileWhatsAppBar whatsapp={b.whatsapp} nombre={b.nombre} reservaUrl={b.reservaUrl} data-name="wa" data-file="pages/business/BusinessPage.js" />
      </div>
    );
  } catch (error) {
    console.error('BusinessPage component error:', error);
    return null;
  }
}

