const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const functionSource = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'functions', 'crear-tienda-externa', 'index.ts'),
  'utf8'
);
const migrationSource = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'migrations', '202607280003_prevent_auth_placeholder_duplicates.sql'),
  'utf8'
);
const freeStoreMigrationSource = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'migrations', '202607280004_external_stores_free.sql'),
  'utf8'
);
const technicalAccountsMigrationSource = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'migrations', '202608130001_skip_placeholder_for_technical_accounts.sql'),
  'utf8'
);

assert.match(functionSource, /RSERVAS_BUSINESS_EXISTS/);
assert.match(functionSource, /ROMAHUB_STORE_EXISTS/);
assert.match(functionSource, /telefono\.eq\.\$\{encodeURIComponent\(whatsapp\)\}/);
assert.match(functionSource, /skip_negocio_autocreate:\s*true/);
assert.match(functionSource, /roma_account_type:\s*"external_store"/);
assert.match(functionSource, /plan:\s*"gratuito"/);
assert.match(functionSource, /estado:\s*"activo"/);

assert.match(migrationSource, /create or replace function public\.handle_new_user\(\)/i);
assert.match(migrationSource, /@whatsapp\.rservasroma\.local/i);
assert.match(migrationSource, /skip_negocio_autocreate/i);
assert.match(migrationSource, /on conflict \(id\) do nothing/i);
assert.match(migrationSource, /set search_path = ''/i);

// La ultima version del trigger tiene que seguir cubriendo lo de 202607280003
// y ademas saltarse RomaCrece (@auth.romahub.app) y los dominios de prueba.
assert.match(technicalAccountsMigrationSource, /create or replace function public\.handle_new_user\(\)/i);
assert.match(technicalAccountsMigrationSource, /@whatsapp\.rservasroma\.local/i);
assert.match(technicalAccountsMigrationSource, /@auth\.romahub\.app/i);
assert.match(technicalAccountsMigrationSource, /like '%\.test'/i);
assert.match(technicalAccountsMigrationSource, /like '%\.local'/i);
assert.match(technicalAccountsMigrationSource, /skip_negocio_autocreate/i);
assert.match(technicalAccountsMigrationSource, /on conflict \(id\) do nothing/i);
assert.match(technicalAccountsMigrationSource, /set search_path = ''/i);

assert.match(freeStoreMigrationSource, /set plan = 'gratuito'/i);
assert.match(freeStoreMigrationSource, /negocio\.es_tienda_externa = true/i);
assert.match(freeStoreMigrationSource, /estado = 'activo'/i);

console.log('OK: prevencion de negocios duplicados verificada');
