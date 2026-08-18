const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const babel = require('@babel/core');

const read = (...parts) => fs.readFileSync(path.join(__dirname, '..', ...parts), 'utf8');

const radarSource = read('components', 'RadarPrecios.js');
const homePage = read('pages', 'home', 'HomePage.js');
const buildScript = read('scripts', 'build.js');
const supabaseConfig = read('utils', 'supabase-config.js');

// --- El panel esta montado y viaja en el bundle -----------------------------
assert.match(homePage, /<RadarPreciosPanel/, 'el panel debe estar montado en la portada');
assert.match(
  homePage,
  /<HomeHero[\s\S]{0,200}<RadarPreciosPanel/,
  'el panel va arriba, justo debajo del hero'
);
assert.match(buildScript, /'components\/RadarPrecios\.js'/, 'el componente debe entrar al bundle');
assert.match(supabaseConfig, /window\.USD_CUP_TASA\s*=/, 'la tasa vive en la config publica');
assert.match(supabaseConfig, /window\.USD_CUP_TASA_FECHA\s*=/, 'la tasa lleva fecha');

// La tasa se muestra siempre: convertir sin decir a cuanto es el bug que este
// panel existe para no cometer.
assert.match(radarSource, /1 USD = /, 'la tasa usada debe verse en pantalla');
assert.match(radarSource, /USD_CUP_TASA_FECHA/, 'la fecha de la tasa debe verse en pantalla');

// --- La logica pura, ejercitada ---------------------------------------------
// El archivo trae JSX, asi que se transpila igual que en scripts/build.js
// antes de evaluarlo. Solo se ejercita el modulo RadarPrecios: el componente
// se declara pero nunca se renderiza aqui.
const radarPlano = babel.transformSync(radarSource, {
  presets: [[require.resolve('@babel/preset-react'), { pragma: 'React.createElement' }]],
  filename: 'RadarPrecios.js',
  babelrc: false,
  configFile: false
}).code;

function cargarRadar(tasa) {
  const sandbox = {
    window: { USD_CUP_TASA: tasa, USD_CUP_TASA_FECHA: '01/01/2026' },
    React: {},
    MockData: {},
    console
  };
  vm.createContext(sandbox);
  // `const` no cuelga del objeto global del contexto, asi que se devuelve como
  // ultima expresion del script.
  return vm.runInContext(`${radarPlano}\nRadarPrecios;`, sandbox);
}

function negocio(provincia, servicios) {
  return {
    ubicacion: { provincia },
    categoriasCatalogo: [{ tipo: 'servicios', items: servicios }]
  };
}

function servicio(nombre, precio, moneda) {
  return { nombre, precio, moneda };
}

const Radar = cargarRadar(440);

// Las variantes de un mismo servicio caen en una sola fila. Si esto se rompe,
// cada negocio genera su propia fila y el panel deja de decir nada.
const variantes = ['Uñas acrílicas', 'ACRILICO completo', 'uñas acrilicas', 'Acrílicas relleno x', 'acrilica'];
const agrupado = Radar.calcular(
  [negocio('La Habana', variantes.map((n) => servicio(n, 2000, 'CUP')))],
  '',
  'CUP'
);
assert.equal(agrupado.filas.length, 1, 'las variantes de acrilicas deben agruparse en una fila');
assert.equal(agrupado.filas[0].etiqueta, 'Uñas acrílicas');
assert.equal(agrupado.filas[0].muestra, 5);

// Un servicio con menos de MIN_MUESTRA precios no se publica.
const pocos = Radar.calcular(
  [negocio('La Habana', [servicio('Masaje', 1500, 'CUP'), servicio('Masaje relax', 1800, 'CUP')])],
  '',
  'CUP'
);
assert.equal(pocos.filas.length, 0, 'con menos de 5 datos no se publica el rango');
assert.equal(pocos.ocultas, 1, 'y se cuenta como oculto para decirlo en pantalla');

// El piso por moneda descarta los USD guardados como CUP. Sin esto, una
// "pedicura a 6 CUP" arrastra el rango y la portada publica un dato falso.
const conBasura = Radar.calcular(
  [negocio('La Habana', [
    servicio('Pedicure', 6, 'CUP'),
    servicio('Pedicura spa', 8, 'CUP'),
    ...Array.from({ length: 6 }, (_, i) => servicio('Pedicure', 900 + i * 100, 'CUP'))
  ])],
  '',
  'CUP'
);
assert.equal(conBasura.filas.length, 1);
assert.ok(conBasura.filas[0].min >= 100, 'los precios por debajo del piso CUP quedan fuera');
assert.equal(conBasura.filas[0].muestra, 6, 'solo cuentan los 6 precios plausibles');

// La conversion usa la tasa configurada, en los dos sentidos.
const enUsd = Radar.calcular(
  [negocio('La Habana', Array.from({ length: 5 }, () => servicio('Uñas en gel', 2200, 'CUP')))],
  '',
  'USD'
);
assert.equal(enUsd.filas[0].mediana, 5, '2200 CUP a 440 son 5 USD');

const desdeUsd = Radar.calcular(
  [negocio('La Habana', Array.from({ length: 5 }, () => servicio('Uñas en gel', 5, 'USD')))],
  '',
  'CUP'
);
assert.equal(desdeUsd.filas[0].mediana, 2200, '5 USD a 440 son 2200 CUP');
assert.equal(desdeUsd.origen.USD, 5, 'se cuenta cuantos precios venian en USD');

// Sin tasa configurada no se inventa una: los USD simplemente no entran.
const SinTasa = cargarRadar(null);
const sinTasa = SinTasa.calcular(
  [negocio('La Habana', Array.from({ length: 5 }, () => servicio('Uñas en gel', 5, 'USD')))],
  '',
  'CUP'
);
assert.equal(sinTasa.filas.length, 0, 'sin tasa no se convierte ni se adivina');

// El filtro de provincia deja fuera al resto del pais.
const mixto = [
  negocio('La Habana', Array.from({ length: 5 }, () => servicio('Uñas en gel', 2000, 'CUP'))),
  negocio('Granma', Array.from({ length: 5 }, () => servicio('Uñas en gel', 1000, 'CUP')))
];
assert.equal(Radar.calcular(mixto, '', 'CUP').filas[0].muestra, 10, 'sin filtro entra todo el pais');
assert.equal(Radar.calcular(mixto, 'Granma', 'CUP').filas[0].mediana, 1000, 'con filtro solo esa provincia');

// Solo se ofrecen provincias con datos suficientes para no mostrar un rango
// sacado de tres negocios como si fuera el precio de la provincia.
const provincias = Radar.provinciasDisponibles([
  ...Array.from({ length: 9 }, () => negocio('La Habana', [servicio('Uñas en gel', 2000, 'CUP')])),
  ...Array.from({ length: 3 }, () => negocio('Granma', [servicio('Uñas en gel', 1000, 'CUP')]))
]);
// Se comparan primitivos: los arrays creados dentro del vm son de otro realm
// y no pasan un deepStrictEqual contra un array de aqui.
assert.equal(provincias.length, 1, 'solo una provincia llega al minimo');
assert.equal(provincias[0].nombre, 'La Habana', 'Granma no llega al minimo');

console.log('OK: radar de precios, agrupacion, piso por moneda y conversion USD/CUP verificados');
