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

assert.match(functionSource, /RSERVAS_BUSINESS_EXISTS/);
assert.match(functionSource, /ROMAHUB_STORE_EXISTS/);
assert.match(functionSource, /telefono\.eq\.\$\{encodeURIComponent\(whatsapp\)\}/);
assert.match(functionSource, /skip_negocio_autocreate:\s*true/);
assert.match(functionSource, /roma_account_type:\s*"external_store"/);

assert.match(migrationSource, /create or replace function public\.handle_new_user\(\)/i);
assert.match(migrationSource, /@whatsapp\.rservasroma\.local/i);
assert.match(migrationSource, /skip_negocio_autocreate/i);
assert.match(migrationSource, /on conflict \(id\) do nothing/i);
assert.match(migrationSource, /set search_path = ''/i);

console.log('OK: prevencion de negocios duplicados verificada');
