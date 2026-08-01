const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (...parts) => fs.readFileSync(path.join(__dirname, '..', ...parts), 'utf8');
const theme = read('styles', 'tailwind-input.css');
const globalStyles = read('styles', 'global.css');
const index = read('index.html');
const manifest = read('manifest.webmanifest');
const serviceWorker = read('sw.js');

assert.match(theme, /--primary-color:\s*#681831/);
assert.match(theme, /--coral:\s*#FF675C/);
assert.match(theme, /--serif:\s*'Fraunces'/);
assert.match(theme, /font-family:\s*'Fraunces'/);
assert.match(globalStyles, /Elegancia calida de evento/);
assert.match(globalStyles, /data-name="home-hero"/);
assert.doesNotMatch(index, /fonts\.googleapis\.com/);
assert.match(index, /fonts\/Fraunces-variable\.woff2/);
assert.match(index, /styles\/tailwind\.css\?v=warm-1/);
assert.match(index, /styles\/global\.css\?v=warm-1/);
assert.match(manifest, /"theme_color":\s*"#681831"/);
assert.match(serviceWorker, /romahub-warm-v1/);
assert.ok(fs.existsSync(path.join(__dirname, '..', 'fonts', 'Fraunces-variable.woff2')), 'falta fonts/Fraunces-variable.woff2');

// --- Escala editorial ---
// La escala vive en variables, no repetida a mano en cada componente.
assert.match(theme, /--fs-display:\s*clamp\(/);
assert.match(theme, /--fs-section:\s*clamp\(/);
assert.match(theme, /--space-section:\s*clamp\(/);
assert.match(theme, /\.h-section-rr\s*\{/);
assert.match(theme, /\.sub-section-rr\s*\{/);

// El archivo de Fraunces que servimos solo trae el eje wght de 400 a 600:
// pedir 700/800/900 no da mas negrita, el navegador lo recorta a 600 y la
// jerarquia declarada deja de existir en pantalla. Estos dos asserts evitan
// que vuelva a colarse un font-extrabold sobre un titulo serif.
assert.match(theme, /font-weight:\s*400\s+600/, 'el @font-face debe declarar el rango real 400-600');
const rolesSerif = theme.match(/\.(h-display-rr|h-section-rr|name-rr|num-rr)\s*\{[^}]*\}/g) || [];
assert.equal(rolesSerif.length, 4, 'faltan roles serif: h-display / h-section / name / num');
rolesSerif.forEach((bloque) => {
  const peso = bloque.match(/font-weight:\s*(\d+)/);
  assert.ok(peso, `${bloque.slice(0, 20)}... no declara font-weight`);
  assert.ok(
    Number(peso[1]) >= 400 && Number(peso[1]) <= 600,
    `peso ${peso[1]} fuera del rango 400-600 que trae la fuente: el navegador lo recortaria a 600`
  );
});

// Los titulos de seccion usan el rol compartido, no el viejo string repetido.
const componentes = ['components', 'pages'].flatMap((dir) => {
  const base = path.join(__dirname, '..', dir);
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (
    e.isDirectory() ? walk(path.join(d, e.name)) : (e.name.endsWith('.js') ? [path.join(d, e.name)] : [])
  ));
  return walk(base);
});
const conEstiloViejo = componentes.filter((f) => /text-2xl md:text-\[26px\]/.test(fs.readFileSync(f, 'utf8')));
assert.equal(conEstiloViejo.length, 0, `titulos con la escala vieja copiada a mano: ${conEstiloViejo.join(', ')}`);

// Ningun h1/h2/h3 puede pedir font-bold (700), font-extrabold (800) ni
// font-black (900): son los unicos que reciben la serif (ver el @layer base) y
// la fuente se queda en 600, asi que los tres se recortan por igual. Ojo con
// font-bold: 700 parece inofensivo y miente lo mismo que 900.
// En un <p> o un <div> si valen, porque esos van con la sans del sistema, que
// tiene esos pesos de verdad — por eso el filtro es solo sobre h1/h2/h3.
const raiz = path.join(__dirname, '..');
const titulosQueMienten = [];
componentes.forEach((f) => {
  const src = fs.readFileSync(f, 'utf8');
  (src.match(/<h[123]\b[^>]*>/g) || []).forEach((tag) => {
    if (/font-(bold|extrabold|black)/.test(tag)) {
      titulosQueMienten.push(`${path.relative(raiz, f)}: ${tag.slice(0, 70)}`);
    }
  });
});
assert.equal(
  titulosQueMienten.length,
  0,
  `titulos serif pidiendo un peso que la fuente no tiene (se veran en 600):\n  ${titulosQueMienten.join('\n  ')}`
);

console.log('OK: apariencia RomaHub "Elegancia calida de evento" verificada');
console.log('OK: escala editorial y techo de peso 400-600 verificados');
