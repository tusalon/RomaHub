const Format = (() => {
  function formatPrecioCUP(value) {
    try {
      const n = Number(value);
      if (Number.isNaN(n)) return '—';
      return `${Math.round(n).toLocaleString('es-ES')} CUP`;
    } catch (error) {
      console.error('Format.formatPrecioCUP error:', error);
      return '—';
    }
  }

  function formatRangoPrecio(min, max) {
    try {
      if (min == null && max == null) return '—';
      if (min != null && max != null) return `${Format.formatPrecioCUP(min)} – ${Format.formatPrecioCUP(max)}`;
      return min != null ? Format.formatPrecioCUP(min) : Format.formatPrecioCUP(max);
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

  return { formatPrecioCUP, formatRangoPrecio, clampText };
})();