function ShareBusiness({ businessId, businessName, compact = false }) {
  try {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const url = React.useMemo(() => {
      const target = new URL('business.html', window.location.href);
      target.search = new URLSearchParams({ id: String(businessId || '') }).toString();
      return target.toString();
    }, [businessId]);

    const copyLink = async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const input = document.createElement('textarea');
          input.value = url;
          input.style.position = 'fixed';
          input.style.opacity = '0';
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          input.remove();
        }
        setMessage('Enlace copiado');
        window.setTimeout(() => setMessage(''), 1800);
      } catch (error) {
        console.error('ShareBusiness.copyLink error:', error);
        setMessage('No se pudo copiar');
      }
    };

    const share = async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: businessName || 'RomaHub',
            text: `Mira ${businessName || 'este negocio'} en RomaHub`,
            url
          });
          return;
        }
        await copyLink();
      } catch (error) {
        if (error?.name !== 'AbortError') console.error('ShareBusiness.share error:', error);
      }
    };

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(url)}`;

    return (
      <div className="relative" data-name="share-business" data-file="components/ShareBusiness.js">
        <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
          <button type="button" className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" onClick={share}>
            <span className="icon-share-2 text-base"></span>
            Compartir
          </button>
          <button type="button" className="btn-rr btn-ghost-rr flex items-center justify-center gap-2" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
            <span className="icon-qr-code text-base"></span>
            QR
          </button>
        </div>
        {message ? <p className="mt-1 text-center text-[11px] text-green-700" role="status">{message}</p> : null}
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
