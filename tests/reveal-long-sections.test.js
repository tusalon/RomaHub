const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'utils', 'reveal.js'), 'utf8');

assert.match(source, /threshold:\s*0,/);
assert.doesNotMatch(source, /threshold:\s*0\.12/);

console.log('OK: listas extensas se revelan al entrar en pantalla');
