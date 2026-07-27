const Format = (() => {
  function formatPrecio(value, moneda) {
    try {
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0) return 'Consultar precio';
      const codigo = String(moneda || 'CUP').toUpperCase();
      return `${Math.round(n).toLocaleString('es-ES')} ${codigo}`;
    } catch (error) {
      console.error('Format.formatPrecio error:', error);
      return '—';
    }
  }

  // Alias historico: mismo formateador, ahora acepta la moneda real del
  // item (CUP, USD, EUR, MXN...) en vez de asumir siempre CUP.
  function formatPrecioCUP(value, moneda) {
    return formatPrecio(value, moneda);
  }

  function formatRangoPrecio(min, max, moneda) {
    try {
      const minValido = Number.isFinite(Number(min)) && Number(min) > 0 ? Number(min) : null;
      const maxValido = Number.isFinite(Number(max)) && Number(max) > 0 ? Number(max) : null;
      if (minValido == null && maxValido == null) return 'Consultar precio';
      if (minValido != null && maxValido != null) {
        if (minValido === maxValido) return formatPrecio(minValido, moneda);
        return `${formatPrecio(minValido, moneda)} – ${formatPrecio(maxValido, moneda)}`;
      }
      return formatPrecio(minValido ?? maxValido, moneda);
    } catch (error) {
      console.error('Format.formatRangoPrecio error:', error);
      return '—';
    }
  }

  function clampText(text, max) {
    try {
      const t = String(text || '');
      if (t.length <= max) return t;
      return `${t.slice(0, max - 1)}…`;
    } catch (error) {
      console.error('Format.clampText error:', error);
      return '';
    }
  }

  return { formatPrecio, formatPrecioCUP, formatRangoPrecio, clampText };
})();
