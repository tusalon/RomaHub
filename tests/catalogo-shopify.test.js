const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (...parts) => fs.readFileSync(path.join(__dirname, '..', ...parts), 'utf8');

const dataSource = read('data', 'mockData.js');
const catalogSource = read('pages', 'business', 'BusinessCatalog.js');
const tiendaSource = read('pages', 'tienda', 'TiendaPage.js');
const productCardSource = read('components', 'ProductCard.js');
const buildScript = read('scripts', 'build.js');

// a) Colecciones: productos y cursos ya no pierden su categoria al armar el catalogo.
const productosBlock = dataSource.slice(dataSource.indexOf("tipo: 'productos'"), dataSource.indexOf("tipo: 'cursos'"));
assert.match(productosBlock, /categoria: valueFrom\(item, \['categoria', 'subgrupo'\], ''\)/);
assert.match(catalogSource, /groupByCategoria/);

// b) Agotado: stock/cupos en 0 deshabilita la compra, en el catalogo del perfil
// y en las tarjetas del escaparate/tienda.
assert.match(catalogSource, /esCurso \? item\.cupos === 0 : Number\(item\.stock\) === 0/);
assert.match(catalogSource, /store-add-agotado/);
assert.match(productCardSource, /esCurso \? it\.cupos === 0 : it\.stock === 0/);
assert.match(productCardSource, /product-contact-agotado/);

// c) Orden y filtros en tienda.html, ademas de la busqueda y el tipo que ya habia.
assert.match(tiendaSource, /precio_asc/);
assert.match(tiendaSource, /precio_desc/);
assert.match(tiendaSource, /soloDisponibles/);

// d) Ficha de producto propia: existe la pagina y esta en el build.
assert.ok(fs.existsSync(path.join(__dirname, '..', 'producto.html')), 'falta producto.html');
assert.ok(fs.existsSync(path.join(__dirname, '..', 'pages', 'producto', 'ProductoPage.js')), 'falta ProductoPage.js');
assert.match(buildScript, /'producto\.bundle\.js':/);
assert.match(productCardSource, /producto\.html\?id=/);

console.log('OK: buenas practicas de catalogo (colecciones, agotado, orden, ficha) verificadas');
