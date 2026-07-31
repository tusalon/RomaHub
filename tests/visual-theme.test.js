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

console.log('OK: apariencia RomaHub "Elegancia calida de evento" verificada');
