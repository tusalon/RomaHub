function ShareBusiness({ businessId, businessName, compact = false, ownerMode = false }) {
  try {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const url = React.useMemo(() => {
      const target = new URL('business.html', window.location.href);
      target.search = new URLSearchParams({ id: String(businessId || '') }).toString();
      return target.toString();
    }, [businessId]);
    const promotionalText = React.useMemo(() => (
      `✨ Descubre ${businessName || 'mi negocio'} en RomaHub. Mira nuestros servicios, productos y cursos, y contáctanos directamente.\n\n${url}`
    ), [businessName, url]);
    const trackShared = () => window.RomaAnalytics?.track?.({ negocioId: businessId, evento: 'compartir' });

    const writeClipboard = async (value) => {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
      }
      const input = document.createElement('textarea');
      input.value = value;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    };

    const copyLink = async () => {
      try {
        await writeClipboard(url);
        trackShared();
        setMessage('Enlace copiado');
        window.setTimeout(() => setMessage(''), 1800);
      } catch (error) {
        console.error('ShareBusiness.copyLink error:', error);
        setMessage('No se pudo copiar');
      }
    };

    const copyPromotion = async () => {
      try {
        await writeClipboard(promotionalText);
        trackShared();
        setMessage('Texto promocional copiado');
        window.setTimeout(() => setMessage(''), 2200);
      } catch (error) {
        console.error('ShareBusiness.copyPromotion error:', error);
        setMessage('No se pudo copiar el texto');
      }
    };

    const shareOnWhatsApp = () => {
      try {
        trackShared();
        window.open(`https://wa.me/?text=${encodeURIComponent(promotionalText)}`, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('ShareBusiness.shareOnWhatsApp error:', error);
      }
    };

    const share = async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: businessName || 'RomaHub',
            text: `Descubre ${businessName || 'este negocio'} en RomaHub`,
            url
          });
          trackShared();
          return;
        }
        await copyLink();
      } catch (error) {
        if (error?.name !== 'AbortError') console.error('ShareBusiness.share error:', error);
      }
    };

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(url)}`;
    const toggleQr = () => {
      setOpen((value) => {
        if (!value) trackShared();
        return !value;
      });
    };

    return (
      <div className="relative" data-name="share-business" data-file="components/ShareBusiness.js">
        <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
          <button type="button" className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" onClick={share}>
            <span className="icon-share-2 text-base"></span>
            Compartir
          </button>
          <button type="button" className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" onClick={toggleQr} aria-expanded={open}>
            <span className="icon-qr-code text-base"></span>
            QR
          </button>
        </div>
        {ownerMode ? (
          <div className="mt-2 space-y-2" data-name="owner-promotion-tools">
            <button type="button" className="btn-rr btn-primary-rr w-full flex items-center justify-center gap-2" onClick={shareOnWhatsApp}>
              <span className="icon-message-circle text-base text-white"></span>
              Promocionar por WhatsApp
            </button>
            <button type="button" className="btn-rr btn-ghost-rr w-full flex items-center justify-center gap-2" onClick={copyPromotion}>
              <span className="icon-copy text-base"></span>
              Copiar texto promocional
            </button>
            <p className="rounded-xl bg-[var(--bg-muted)] p-3 text-xs text-[var(--text-muted)] leading-relaxed whitespace-pre-line" data-name="promotion-preview">{promotionalText}</p>
          </div>
        ) : null}
        {message ? <p className="mt-2 text-center text-[11px] font-semibold text-green-700" role="status" aria-live="polite">{message}</p> : null}
        {open ? (
          <div className="absolute z-40 right-0 mt-2 w-[280px] max-w-[85vw] rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl text-center" data-name="share-qr">
            <p className="text-sm font-semibold">Escanea para abrir el negocio</p>
            <img src={qrUrl} alt={`Código QR de ${businessName || 'este negocio'}`} className="mt-3 w-[220px] max-w-full aspect-square mx-auto rounded-lg border border-[var(--border)]" loading="lazy" />
            <button type="button" className="mt-3 btn-rr btn-primary-rr w-full py-2.5 text-xs" onClick={copyLink}>Copiar enlace</button>
          </div>
        ) : null}
      </div>
    );
  } catch (error) {
    console.error('ShareBusiness component error:', error);
    return null;
  }
}
