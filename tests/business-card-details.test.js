const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'components', 'BusinessCard.js'), 'utf8');

assert.match(source, /const featuredServices = services\.slice\(0, 2\)/);
assert.match(source, /data-name="business-description"/);
assert.match(source, /data-name="business-schedule"/);
assert.match(source, /Servicios destacados/);
assert.match(source, /Format\.formatPrecioCUP\(service\.precio, service\.moneda\)/);
assert.match(source, /data-name="profile"/);
assert.match(source, /Ver perfil/);
assert.match(source, /Reservar/);
assert.match(source, /h-32 sm:h-36/);

console.log('OK: tarjetas de negocios con vista previa ampliada verificadas');
