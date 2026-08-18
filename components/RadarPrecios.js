// Radar de precios: que se esta cobrando de verdad, por servicio y provincia.
//
// Dos trampas de los datos reales que este componente resuelve, y que hay que
// tener presentes antes de tocarlo:
//
// 1. Los precios llegan en monedas distintas (hay negocios con toda su lista
//    en USD). No se pueden promediar sin convertir, y no se puede convertir
//    sin decir a que tasa. La tasa vive en utils/supabase-config.js y se
//    muestra siempre en pantalla.
// 2. Hay precios en USD guardados con moneda CUP ("pedicura: 6 CUP"). Sin un
//    piso por moneda esos valores arrastran el rango hacia abajo y la pagina
//    publica un dato falso.
const RadarPrecios = (() => {
  // Piso por moneda. Un servicio a 6 CUP no existe: es un precio en USD mal
  // etiquetado. Ver nota 2 arriba.
  const PISO = { CUP: 100, USD: 1 };

  // Minimo de negocios distintos para mostrar una fila. Por debajo de esto el
  // rango no representa nada y confunde mas de lo que informa.
  const MIN_MUESTRA = 5;

  // Minimo de negocios con servicios para ofrecer una provincia en el filtro.
  const MIN_NEGOCIOS_PROVINCIA = 8;

  // Los nombres los escribe cada negocio a mano ("Unas acrilicas", "ACRILICO
  // completo", "acrilicas"). Sin agrupar, cada variante seria su propia fila.
  const GRUPOS = [
    { etiqueta: 'Uñas acrílicas', patron: /acril|acrl/ },
    { etiqueta: 'Uñas en gel', patron: /\bgel\b|gelish|semiperman/ },
    { etiqueta: 'Esmaltado común', patron: /esmalt|pintad|comun/ },
    { etiqueta: 'Relleno', patron: /rellen|mantenim/ },
    { etiqueta: 'Manicure', patron: /manicur|manos/ },
    { etiqueta: 'Pedicure', patron: /pedicur|pies/ },
    { etiqueta: 'Retiro', patron: /retir|remov/ },
    { etiqueta: 'Pestañas', patron: /pestan|lash/ },
    { etiqueta: 'Cejas', patron: /ceja|brow/ },
    { etiqueta: 'Corte de pelo', patron: /corte|pelad|barb/ },
    { etiqueta: 'Peinado', patron: /peinad|recogid/ },
    { etiqueta: 'Tinte', patron: /tinte|mech/ },
    { etiqueta: 'Maquillaje', patron: /maquillaj|makeup/ },
    { etiqueta: 'Masaje', patron: /masaj/ },
    { etiqueta: 'Limpieza facial', patron: /facial|cutis/ }
  ];

  function sinAcentos(texto) {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function grupoDe(nombre) {
    const t = sinAcentos(nombre);
    if (!t) return null;
    const encontrado = GRUPOS.find((g) => g.patron.test(t));
    return encontrado ? encontrado.etiqueta : null;
  }

  function tasaUsdCup() {
    const valor = Number(window.USD_CUP_TASA);
    return Number.isFinite(valor) && valor > 0 ? valor : null;
  }

  function convertir(valor, desde, hacia, tasa) {
    if (desde === hacia) return valor;
    if (!tasa) return null;
    if (desde === 'USD' && hacia === 'CUP') return valor * tasa;
    if (desde === 'CUP' && hacia === 'USD') return valor / tasa;
    return null;
  }

  // Rango robusto p10-p90: un precio absurdo no debe definir la escala.
  function rango(valores) {
    const v = valores.slice().sort((a, b) => a - b);
    const n = v.length;
    return {
      min: v[Math.max(0, Math.floor(n * 0.10))],
      max: v[Math.min(n - 1, Math.floor(n * 0.90))],
      mediana: v[Math.floor(n / 2)]
    };
  }

  // Recorre los negocios y devuelve, por grupo de servicio, los precios ya
  // convertidos a `moneda`, mas el conteo de en que moneda venian de origen.
  function calcular(negocios, provincia, moneda) {
    const tasa = tasaUsdCup();
    const porGrupo = {};
    const origen = { CUP: 0, USD: 0, otras: 0 };
    let negociosConDato = 0;

    negocios.forEach((negocio) => {
      if (provincia && negocio.ubicacion?.provincia !== provincia) return;

      const seccion = (negocio.categoriasCatalogo || []).find((s) => s.tipo === 'servicios');
      if (!seccion?.items?.length) return;

      let aporto = false;
      seccion.items.forEach((item) => {
        const bruto = Number(item.precio);
        if (!Number.isFinite(bruto) || bruto <= 0) return;

        const monedaItem = String(item.moneda || 'CUP').toUpperCase();
        if (monedaItem === 'CUP' || monedaItem === 'USD') origen[monedaItem]++;
        else { origen.otras++; return; }

        if (bruto < (PISO[monedaItem] || 0)) return;

        const grupo = grupoDe(item.nombre);
        if (!grupo) return;

        const valor = convertir(bruto, monedaItem, moneda, tasa);
        if (valor == null) return;

        if (!porGrupo[grupo]) porGrupo[grupo] = [];
        porGrupo[grupo].push(valor);
        aporto = true;
      });
      if (aporto) negociosConDato++;
    });

    const filas = Object.keys(porGrupo)
      .filter((g) => porGrupo[g].length >= MIN_MUESTRA)
      .map((g) => Object.assign({ etiqueta: g, muestra: porGrupo[g].length }, rango(porGrupo[g])))
      .sort((a, b) => b.mediana - a.mediana);

    const ocultas = Object.keys(porGrupo).filter((g) => porGrupo[g].length < MIN_MUESTRA).length;
    return { filas, ocultas, origen, negociosConDato, tasa };
  }

  function provinciasDisponibles(negocios) {
    const conteo = {};
    negocios.forEach((negocio) => {
      const prov = negocio.ubicacion?.provincia;
      if (!prov) return;
      const seccion = (negocio.categoriasCatalogo || []).find((s) => s.tipo === 'servicios');
      if (!seccion?.items?.length) return;
      conteo[prov] = (conteo[prov] || 0) + 1;
    });
    return Object.keys(conteo)
      .filter((p) => conteo[p] >= MIN_NEGOCIOS_PROVINCIA)
      .sort((a, b) => conteo[b] - conteo[a])
      .map((p) => ({ nombre: p, total: conteo[p] }));
  }

  function formatear(valor, moneda) {
    if (moneda === 'USD') {
      return valor >= 10 ? String(Math.round(valor)) : valor.toFixed(1).replace('.0', '');
    }
    return Math.round(valor).toLocaleString('es-ES');
  }

  return { calcular, provinciasDisponibles, formatear, tasaUsdCup, MIN_MUESTRA };
})();

function RadarPreciosPanel() {
  try {
    const [provincia, setProvincia] = React.useState('');
    const [moneda, setMoneda] = React.useState('CUP');

    const negocios = MockData.listBusinesses();
    const provincias = React.useMemo(() => RadarPrecios.provinciasDisponibles(negocios), [negocios]);
    const datos = React.useMemo(
      () => RadarPrecios.calcular(negocios, provincia, moneda),
      [negocios, provincia, moneda]
    );

    // Sin tasa configurada no se puede mostrar USD: antes que inventar un
    // numero, se desactiva el boton y se dice por que.
    const hayTasa = Boolean(datos.tasa);
    React.useEffect(() => {
      if (!hayTasa && moneda === 'USD') setMoneda('CUP');
    }, [hayTasa, moneda]);

    if (!datos.filas.length) return null;

    const escala = Math.max.apply(null, datos.filas.map((f) => f.max)) || 1;
    const pct = (valor) => Math.min(100, Math.max(0, (valor / escala) * 100));
    const totalPrecios = datos.origen.CUP + datos.origen.USD;
    const pctUsd = totalPrecios ? Math.round((datos.origen.USD / totalPrecios) * 100) : 0;
    const ambito = provincia || 'toda Cuba';

    return (
      <section className="section-rr" aria-labelledby="radar-precios-title" data-name="radar-precios" data-file="components/RadarPrecios.js">
        <div className="container-rr" data-name="radar-inner" data-file="components/RadarPrecios.js">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6" data-name="radar-head" data-file="components/RadarPrecios.js">
            <div data-name="radar-head-text" data-file="components/RadarPrecios.js">
              <p className="kicker-rr" data-name="radar-kicker" data-file="components/RadarPrecios.js">Radar de precios</p>
              <h2 id="radar-precios-title" className="mt-1 h-section-rr" data-name="radar-title" data-file="components/RadarPrecios.js">
                Lo que se cobra en {ambito}
              </h2>
              <p className="mt-2 sub-section-rr" data-name="radar-sub" data-file="components/RadarPrecios.js">
                Rangos reales de {datos.negociosConDato} negocios con servicios publicados. La marca es el precio del medio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0" data-name="radar-controls" data-file="components/RadarPrecios.js">
              <label className="sr-only" htmlFor="radar-provincia">Provincia</label>
              <select
                id="radar-provincia"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                className="surface-rr px-4 py-2.5 text-sm font-medium bg-[var(--card)] border border-[var(--border)] rounded-xl"
                data-name="radar-provincia"
                data-file="components/RadarPrecios.js"
              >
                <option value="">Toda Cuba</option>
                {provincias.map((p) => (
                  <option key={p.nombre} value={p.nombre}>{p.nombre} ({p.total})</option>
                ))}
              </select>

              <div className="inline-flex rounded-xl border border-[var(--border)] overflow-hidden" role="group" aria-label="Moneda" data-name="radar-moneda" data-file="components/RadarPrecios.js">
                {['CUP', 'USD'].map((codigo) => (
                  <button
                    key={codigo}
                    type="button"
                    onClick={() => setMoneda(codigo)}
                    disabled={codigo === 'USD' && !hayTasa}
                    aria-pressed={moneda === codigo}
                    title={codigo === 'USD' && !hayTasa ? 'Falta configurar la tasa de cambio' : ''}
                    className={`px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      moneda === codigo
                        ? 'bg-[var(--primary-color)] text-white'
                        : 'bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                    data-name={`radar-moneda-${codigo}`}
                    data-file="components/RadarPrecios.js"
                  >
                    {codigo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-rr p-5 sm:p-7" data-name="radar-card" data-file="components/RadarPrecios.js">
            <ul className="flex flex-col gap-5" data-name="radar-list" data-file="components/RadarPrecios.js">
              {datos.filas.map((fila) => (
                <li key={fila.etiqueta} data-name="radar-row" data-file="components/RadarPrecios.js">
                  <div className="flex items-baseline justify-between gap-3 mb-2" data-name="radar-row-head" data-file="components/RadarPrecios.js">
                    <span className="text-sm sm:text-base font-semibold" data-name="radar-row-name" data-file="components/RadarPrecios.js">
                      {fila.etiqueta}
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-soft)] tabular-nums" data-name="radar-row-range" data-file="components/RadarPrecios.js">
                      {RadarPrecios.formatear(fila.min, moneda)} – {RadarPrecios.formatear(fila.max, moneda)}
                      <span className="ml-1 text-xs font-medium text-[var(--text-muted)]">{moneda}</span>
                    </span>
                  </div>

                  <div className="relative h-3 rounded-full bg-[var(--bg-muted)]" data-name="radar-track" data-file="components/RadarPrecios.js">
                    <div
                      className="absolute inset-y-0 rounded-full bg-[var(--primary-color)]"
                      style={{ left: `${pct(fila.min)}%`, width: `${Math.max(2, pct(fila.max) - pct(fila.min))}%` }}
                      data-name="radar-fill"
                      data-file="components/RadarPrecios.js"
                    ></div>
                    <div
                      className="absolute -top-1 w-1 h-5 rounded-full bg-[var(--coral)]"
                      style={{ left: `${pct(fila.mediana)}%` }}
                      title={`Precio del medio: ${RadarPrecios.formatear(fila.mediana, moneda)} ${moneda}`}
                      data-name="radar-median"
                      data-file="components/RadarPrecios.js"
                    ></div>
                  </div>

                  <p className="mt-1.5 text-xs text-[var(--text-muted)]" data-name="radar-row-n" data-file="components/RadarPrecios.js">
                    Precio del medio {RadarPrecios.formatear(fila.mediana, moneda)} {moneda} · {fila.muestra} servicios publicados
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-[var(--border)] flex flex-col gap-2 text-xs text-[var(--text-muted)] leading-relaxed" data-name="radar-nota" data-file="components/RadarPrecios.js">
              {hayTasa ? (
                <p data-name="radar-tasa" data-file="components/RadarPrecios.js">
                  <span className="font-semibold text-[var(--text-soft)]">Cómo se calcula:</span>{' '}
                  {pctUsd > 0
                    ? `${pctUsd}% de estos precios los publicó el negocio en USD y aquí se muestran convertidos.`
                    : 'Todos estos precios se publicaron en la moneda que estás viendo.'}{' '}
                  Tasa usada: <span className="font-semibold text-[var(--text-soft)]">1 USD = {Math.round(datos.tasa).toLocaleString('es-ES')} CUP</span>
                  {window.USD_CUP_TASA_FECHA ? ` · actualizada el ${window.USD_CUP_TASA_FECHA}` : ''}.
                </p>
              ) : (
                <p data-name="radar-tasa-falta" data-file="components/RadarPrecios.js">
                  Solo se muestran los precios publicados en CUP. Falta configurar la tasa de cambio para convertir los que están en USD.
                </p>
              )}
              <p data-name="radar-metodo" data-file="components/RadarPrecios.js">
                El rango deja fuera el 10% más barato y el 10% más caro, para que un precio suelto no distorsione. Solo aparecen servicios con {RadarPrecios.MIN_MUESTRA} o más precios publicados
                {datos.ocultas > 0 ? ` (${datos.ocultas} ${datos.ocultas === 1 ? 'servicio quedó' : 'servicios quedaron'} fuera por tener menos datos)` : ''}.
                Son rangos del conjunto: nunca el precio de un negocio en particular.
              </p>
            </div>
          </div>

        </div>
      </section>
    );
  } catch (error) {
    console.error('RadarPreciosPanel component error:', error);
    return null;
  }
}
