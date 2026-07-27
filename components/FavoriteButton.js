function FavoriteButton({ entry, showLabel = false, className = '' }) {
  try {
    const [saved, setSaved] = React.useState(() => window.RomaSaved?.isFavorite?.(entry) || false);
    const key = entry?.key || `${entry?.type || ''}:${entry?.id || ''}`;

    React.useEffect(() => {
      setSaved(window.RomaSaved?.isFavorite?.(entry) || false);
      return window.RomaSaved?.subscribe?.(() => setSaved(window.RomaSaved?.isFavorite?.(entry) || false));
    }, [key]);

    const onToggle = (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      const added = window.RomaSaved?.toggle?.(entry);
      setSaved(Boolean(added));
      if (added && entry?.negocioId) {
        window.RomaAnalytics?.track?.({
          negocioId: entry.negocioId,
          evento: 'favorito',
          itemTipo: entry.type === 'negocio' ? '' : entry.type,
          itemId: entry.id,
          itemNombre: entry.nombre
        }, { oncePerDay: true });
      }
    };

    const action = saved ? 'Quitar de guardados' : 'Guardar';
    return (
      <button
        type="button"
        className={`${showLabel ? 'btn-rr px-3 py-2' : 'w-10 h-10 rounded-full'} inline-flex items-center justify-center gap-2 border shadow-sm transition-colors ${saved ? 'is-favorite border-[var(--primary-color)] bg-[var(--primary-color)] text-white' : 'border-[var(--border)] bg-white/95 text-[var(--primary-color)] hover:border-[var(--primary-color)]'} ${className}`}
        onClick={onToggle}
        aria-pressed={saved}
        aria-label={`${action} ${entry?.nombre || 'elemento'}`}
        title={action}
        data-name="favorite-button"
        data-favorite-key={key}
      >
        <span className="icon-heart text-lg" aria-hidden="true"></span>
        {showLabel ? <span>{saved ? 'Guardado' : 'Guardar'}</span> : null}
      </button>
    );
  } catch (error) {
    console.error('FavoriteButton component error:', error);
    return null;
  }
}
