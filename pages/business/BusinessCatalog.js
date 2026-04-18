function BusinessCatalog({ business, mode }) {
  try {
    const b = business;

    const sections = React.useMemo(() => {
      try {
        const cats = b.categoriasCatalogo || [];

        const toRows = (cat) => {
          const tipo = cat.tipo;
          if (tipo === 'servicios') {
            return (cat.items || []).map((x) => ({
              icon: 'icon-scissors',
              title: x.destacado ? `${x.nombre} (Recomendado)` : x.nombre,
              meta: `${x.duracionMin} min`,
              price: Format.formatPrecioCUP(x.precio),
              note: null
            }));
          }
          if (tipo === 'productos') {
            return (cat.items || []).map((x) => ({
              icon: 'icon-shopping-bag',
              title: x.nombre,
              meta: `Stock: ${x.stock}`,
              price: Format.formatPrecioCUP(x.precio),
              note: null
            }));
          }
          if (tipo === 'cursos') {
            return (cat.items || []).map((x) => ({
              icon: 'icon-calendar',
              title: x.nombre,
              meta: `${new Date(x.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' })} · ${x.ubicacion}`,
              price: Format.formatPrecioCUP(x.precio),
              note: 'Cupo limitado'
            }));
          }
          return [];
        };

        const filtered = cats.filter((c) => {
          if (mode === 'catalogo') return c.tipo !== 'cursos';
          if (mode === 'cursos') return c.tipo === 'cursos';
          return true;
        });

        return filtered.map((c, idx) => ({
          key: `${c.tipo}-${c.titulo}-${idx}`,
          title: c.titulo,
          subtitle:
            c.tipo === 'servicios'
              ? 'Duración y precio alineados'
              : c.tipo === 'productos'
                ? 'Stock y precio en CUP'
                : 'Fecha, ubicación y precio',
          rows: toRows(c)
        }));
      } catch (e) {
        return [];
      }
    }, [b, mode]);

    if (!sections.length) {
      return (
        <div className="surface-rr p-5" data-name="empty" data-file="pages/business/BusinessCatalog.js">
          <p className="text-sm text-[var(--text-muted)]" data-name="empty-t" data-file="pages/business/BusinessCatalog.js">
            Este negocio aún no publicó su catálogo.
          </p>
        </div>
      );
    }

    return (
      <div data-name="business-catalog" data-file="pages/business/BusinessCatalog.js">
        <Accordion items={sections} data-name="accordion" data-file="pages/business/BusinessCatalog.js" />
      </div>
    );
  } catch (error) {
    console.error('BusinessCatalog component error:', error);
    return null;
  }
}