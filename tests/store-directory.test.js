const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (...parts) => fs.readFileSync(path.join(__dirname, '..', ...parts), 'utf8');

const storePage = read('pages', 'tienda', 'TiendaPage.js');
const dataSource = read('data', 'mockData.js');
const panelSource = read('pages', 'panel', 'BusinessPanelPage.js');
const businessHeader = read('pages', 'business', 'BusinessHeader.js');

assert.match(storePage, /MockData\.listRomaStores\(\)/);
assert.match(storePage, /searchParams|URLSearchParams/);
assert.match(storePage, /get\('negocio'\)/);
assert.match(storePage, /articulo\.negocioId/);
assert.match(storePage, /Primero elige una tienda/);
assert.match(storePage, /Ver productos/);
assert.match(storePage, /Catálogo de la tienda/);

assert.match(dataSource, /function listRomaStores\(limit\)/);
assert.match(dataSource, /business\.esTiendaExterna && business\.tieneTienda/);
assert.match(panelSource, /const isPublicReady = esTiendaExterna \? romahubEstado === 'aprobada' : isDirectoryReady/);
assert.match(panelSource, /Las clientas pueden encontrar tu tienda y entrar para ver tus productos o cursos/);
assert.match(businessHeader, /Tienda activa/);
assert.match(businessHeader, /Configurando tienda/);

console.log('OK: directorio de tiendas y catalogos separados verificados');
