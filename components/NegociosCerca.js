function NegociosCerca({ negocioActual, listo }) {
  try {
    const b = negocioActual;
    if (!b) return null;

    // Patron de los directorios de reservas: al final de una ficha se ofrecen
    // alternativas de la misma zona, para que la clienta que no se decidio no
    // se vaya del sitio. Se prioriza mismo municipio, luego misma provincia y,
    // si el negocio no tiene ubicacion cargada, misma categoria.
    const { cercanos, criterio } = React.useMemo(() => {
      try {
        const norm = (v) => String(v || '').trim();
        const todos = MockData.listBusinesses().filter((otro) => otro.id !== b.id);
        const municipio = norm(b.ubicacion?.municipio);
        const provincia = norm(b.ubicacion?.provincia);

        const puntuar = (otro) => {
          if (municipio && norm(otro.ubicacion?.municipio) === municipio) return 3;
          if (provincia && norm(otro.ubicacion?.provincia) === provincia) return 2;
          if (b.categoria && otro.categoria === b.categoria) return 1;
          return 0;
        };

        const puntuados = todos
          .map((otro) => ({ otro, puntos: puntuar(otro) }))
          .filter((entrada) => entrada.puntos > 0)
          .sort((x, y) => y.puntos - x.puntos || x.otro.nombre.localeCompare(y.otro.nombre))
          .slice(0, 8);

        // El titulo tiene que describir lo que de verdad se esta listando: si
        // no hay nadie del mismo municipio y se cae a "misma categoria", poner
        // "otros negocios en X" seria mentirle a la clienta.
        const mejor = puntuados.length ? puntuados[0].puntos : 0;
        const criterio = mejor === 3
          ? { tipo: 'municipio', etiqueta: municipio }
          : mejor === 2
            ? { tipo: 'provincia', etiqueta: provincia }
            : { tipo: 'categoria', etiqueta: norm(b.categoria) };

        return { cercanos: puntuados.map((entrada) => entrada.otro), criterio };
      } catch (error) {
        console.error('NegociosCerca.cercanos error:', error);
        return { cercanos: [], criterio: null };
      }
    }, [b.id, b.categoria, b.ubicacion?.municipio, b.ubicacion?.provincia, listo]);

    if (!cercanos.length) return null;

    const titulo = criterio && criterio.etiqueta
      ? (criterio.tipo === 'categoria'
        ? `Otros negocios de ${criterio.etiqueta}`
        : `Otros negocios en ${criterio.etiqueta}`)
      : 'Otros negocios parecidos';

    return (
      <section className="mt-10" data-name="negocios-cerca" data-file="components/NegociosCerca.js">
        <div className="mb-4" data-name="cerca-head" data-file="components/NegociosCerca.js">
          <span className="kicker-rr block mb-2" data-name="cerca-badge" data-file="components/NegociosCerca.js">Tambien te puede servir</span>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-[-0.02em] text-[#111827]" data-name="cerca-title" data-file="components/NegociosCerca.js">
            {titulo}
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x" data-name="cerca-track" data-file="components/NegociosCerca.js">
          {cercanos.map((otro) => (
            <a
              key={otro.id}
              className="min-w-[190px] w-[190px] snap-start surface-rr card-lift-rr overflow-hidden block"
              href={`business.html?id=${encodeURIComponent(otro.id)}`}
              data-name="cerca-card"
              data-file="components/NegociosCerca.js"
            >
              <div className="relative h-24 bg-[#F3F4F6] overflow-hidden" data-name="cerca-media" data-file="components/NegociosCerca.js">
                {otro.portadaUrl ? (
                  <img loading="lazy" decoding="async" src={otro.portadaUrl} alt={`Imagen de ${otro.nombre}`} className="w-full h-full object-cover" data-name="cerca-img" data-file="components/NegociosCerca.js" />
                ) : null}
              </div>
              <div className="p-3" data-name="cerca-body" data-file="components/NegociosCerca.js">
                <p className="text-sm font-bold text-[#111827] leading-snug line-clamp-2 flex items-center gap-1" data-name="cerca-nombre" data-file="components/NegociosCerca.js">
                  <span className="truncate">{otro.nombre}</span>
                  {otro.esRservasroma ? <span className="shrink-0" title="Verificado · reserva online" data-name="cerca-diamante" data-file="components/NegociosCerca.js">💎</span> : null}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)] truncate" data-name="cerca-meta" data-file="components/NegociosCerca.js">
                  {[otro.categoria, otro.ubicacionCorta].filter(Boolean).join(' · ')}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error('NegociosCerca component error:', error);
    return null;
  }
}
