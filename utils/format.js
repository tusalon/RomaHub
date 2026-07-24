const Format = (() => {
  function formatPrecio(value, moneda) {
    try {
      const n = Number(value);
      if (Number.isNaN(n)) return '—';
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
      if (min == null && max == null) return '—';
      if (min != null && max != null) return `${formatPrecio(min, moneda)} – ${formatPrecio(max, moneda)}`;
      return min != null ? formatPrecio(min, moneda) : formatPrecio(max, moneda);
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
