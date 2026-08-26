const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (...parts) => fs.readFileSync(path.join(__dirname, '..', ...parts), 'utf8');

const createFn = read('supabase', 'functions', 'crear-tienda-externa', 'index.ts');
const security = read('supabase', 'functions', '_shared', 'romahub-security.ts');
const sql = read('sql', 'aprobacion-tiendas-romahub.sql');
const crearTiendaPage = read('pages', 'tienda', 'CrearTiendaPage.js');
const panelSource = read('pages', 'panel', 'BusinessPanelPage.js');

// El alta nace invisible: nadie ve una tienda sin revisar.
assert.match(createFn, /configurado:\s*false/);
assert.match(createFn, /romahub_estado:\s*"borrador"/);
assert.match(createFn, /esRubroBellezaValido\(categoria\)/);

assert.match(security, /export const RUBROS_BELLEZA/);
assert.match(security, /export function esRubroBellezaValido/);

// El formulario de alta usa la misma lista cerrada de rubros y avisa del filtro.
assert.match(crearTiendaPage, /RUBROS_BELLEZA/);
assert.match(crearTiendaPage, /RomaHub es solo para/);

// El RPC exige minimo de articulos y datos de perfil antes de mover a revision,
// y nadie salvo service_role puede aprobar/publicar directamente.
assert.match(sql, /create or replace function public\.enviar_tienda_a_revision/);
assert.match(sql, /v_total_activos < 3/);
assert.match(sql, /create or replace function public\.proteger_aprobacion_romahub/);
assert.match(sql, /auth\.role\(\)\) <> 'service_role'/);

// El panel no deja enviar a revision por debajo del minimo, y llama al RPC.
assert.match(panelSource, /const MINIMO_TIENDA_EXTERNA = 3/);
assert.match(panelSource, /totalActivosExterna >= MINIMO_TIENDA_EXTERNA/);
assert.match(panelSource, /rpc\/enviar_tienda_a_revision/);

console.log('OK: aprobacion de tiendas externas antes de publicarse verificada');
