const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (...parts) => fs.readFileSync(path.join(__dirname, '..', ...parts), 'utf8');
const theme = read('styles', 'tailwind-input.css');
const globalStyles = read('styles', 'global.css');
const index = read('index.html');
const manifest = read('manifest.webmanifest');
const serviceWorker = read('sw.js');

assert.match(theme, /--primary-color:\s*#B50063/);
assert.match(theme, /--secondary-color:\s*#E2E8F5/);
assert.match(theme, /--text-soft:\s*#594047/);
assert.match(theme, /font-family:\s*'Hanken Grotesk'/);
assert.match(globalStyles, /RomaHub Elite/);
assert.match(globalStyles, /data-name="home-hero"/);
assert.match(index, /family=Hanken\+Grotesk/);
assert.match(index, /styles\/tailwind\.css\?v=elite-1/);
assert.match(index, /styles\/global\.css\?v=elite-1/);
assert.match(manifest, /"theme_color":\s*"#B50063"/);
assert.match(serviceWorker, /romahub-elite-v1/);

console.log('OK: apariencia RomaHub Elite verificada');
