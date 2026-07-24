function ReportarNegocio({ negocioId, negocioNombre }) {
  try {
    const MOTIVOS = ['Spam o publicidad falsa', 'Contenido inapropiado', 'Posible estafa', 'Producto o negocio falso', 'Otro'];
    const [abierto, setAbierto] = React.useState(false);
    const [motivo, setMotivo] = React.useState('');
    const [detalle, setDetalle] = React.useState('');
    const [enviando, setEnviando] = React.useState(false);
    const [enviado, setEnviado] = React.useState(false);
    const [error, setError] = React.useState('');

    const cerrar = () => {
      setAbierto(false);
      setTimeout(() => { setEnviado(false); setMotivo(''); setDetalle(''); setError(''); }, 250);
    };

    const enviar = async () => {
      if (!motivo) { setError('Elige un motivo.'); return; }
      try {
        setEnviando(true);
        setError('');
        const url = String(window.SUPABASE_URL || '').replace(/\/$/, '');
        const res = await fetch(`${url}/rest/v1/reportes_tienda`, {
          method: 'POST',
          headers: {
            apikey: window.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ negocio_id: negocioId, motivo, detalle: detalle.trim() || null })
        });
        if (!res.ok) throw new Error('No se pudo enviar el reporte.');
        setEnviado(true);
      } catch (err) {
        setError(err.message || 'No se pudo enviar el reporte. Intenta de nuevo.');
      } finally {
        setEnviando(false);
      }
    };

    return (
      <div data-name="reportar-negocio" data-file="components/ReportarNegocio.js">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--primary-color)] inline-flex items-center gap-1"
          data-name="reportar-btn"
          data-file="components/ReportarNegocio.js"
        >
          <div className="icon-flag text-sm"></div>
          Reportar este negocio
        </button>

        {abierto ? (
          <div
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={cerrar}
            role="dialog"
            aria-modal="true"
            data-name="reportar-modal-backdrop"
            data-file="components/ReportarNegocio.js"
          >
            <div className="surface-rr bg-white p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()} data-name="reportar-modal" data-file="components/ReportarNegocio.js">
              {enviado ? (
                <div className="text-center py-3">
                  <div className="w-12 h-12 rounded-2xl bg-[rgba(34,197,94,0.1)] flex items-center justify-center mx-auto">
                    <div className="icon-circle-check text-2xl text-[#22C55E]"></div>
                  </div>
                  <p className="mt-3 text-sm font-semibold">Gracias por avisarnos</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">Vamos a revisar {negocioNombre}.</p>
                  <button type="button" className="mt-4 btn-rr btn-ghost-rr w-full text-sm py-2" onClick={cerrar}>Cerrar</button>
                </div>
              ) : (
                <React.Fragment>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-sm font-bold">Reportar "{negocioNombre}"</p>
                    <button type="button" onClick={cerrar} className="text-[var(--text-muted)] hover:text-[var(--primary-color)] text-lg leading-none" aria-label="Cerrar">✕</button>
                  </div>
                  <div className="space-y-2">
                    {MOTIVOS.map((m) => (
                      <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="motivo-reporte" checked={motivo === m} onChange={() => setMotivo(m)} />
                        {m}
                      </label>
                    ))}
                  </div>
                  <textarea
                    className="input-rr mt-3 text-sm min-h-[70px] resize-y"
                    placeholder="Cuéntanos qué pasó (opcional)"
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                    maxLength={400}
                  />
                  {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
                  <button type="button" className="mt-3 btn-rr btn-primary-rr w-full text-sm py-2" onClick={enviar} disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar reporte'}
                  </button>
                </React.Fragment>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  } catch (error) {
    console.error('ReportarNegocio component error:', error);
    return null;
  }
}
