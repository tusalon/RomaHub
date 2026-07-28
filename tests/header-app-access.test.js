const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'components', 'Header.js'), 'utf8');
const destination = 'https://tusalon.github.io/HouseofRservasRoma/';

assert.equal(source.split(destination).length - 1, 2);
assert.match(source, /data-name="nav-get-app"/);
assert.match(source, /data-name="m-get-app"/);
assert.match(source, /Quiero la app/);
assert.match(source, /Quiero tener la app/);
assert.match(source, /target="_blank"/);
assert.match(source, /rel="noopener noreferrer"/);

console.log('OK: acceso superior a House of RservasRoma verificado');
