function MobileWhatsAppBar({ whatsapp, nombre }) {
  try {
    const onWhatsApp = () => {
      try {
        const wa = String(whatsapp || '').replace(/\s+/g, '');
        const msg = encodeURIComponent(`Hola, quiero reservar en ${nombre}. ¿Me ayudas con disponibilidad y precios?`);
        const url = `https://wa.me/${wa.replace('+', '')}?text=${msg}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('MobileWhatsAppBar.onWhatsApp error:', error);
      }
    };

    return (
      <div className="fixed bottom-0 left-0 right-0 z-[70] md:hidden" data-name="wa-bar" data-file="components/MobileWhatsAppBar.js">
        <div className="bg-white/85 backdrop-blur border-t border-[var(--border)] p-3" data-name="wa-bar-inner" data-file="components/MobileWhatsAppBar.js">
          <button
            className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2 shadow-md"
            onClick={onWhatsApp}
            data-name="wa-btn"
            data-file="components/MobileWhatsAppBar.js"
          >
            <div className="icon-message-circle text-xl text-white" data-name="wa-icon" data-file="components/MobileWhatsAppBar.js"></div>
            <span data-name="wa-text" data-file="components/MobileWhatsAppBar.js">Contactar por WhatsApp</span>
          </button>
          <p className="mt-2 text-[11px] text-[var(--text-muted)] text-center" data-name="wa-note" data-file="components/MobileWhatsAppBar.js">
            Respuesta típica: 5–20 min según disponibilidad.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('MobileWhatsAppBar component error:', error);
    return null;
  }
}