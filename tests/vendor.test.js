const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const folder = path.join(root, 'vendor/leaflet-1.9.4');

test('yerel Leaflet mevcut sürümün doğrulanmış JS ve CSS dosyalarıdır', () => {
  const expected = { 'leaflet.js': '20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
    'leaflet.css': 'p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=' };
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const [name, hash] of Object.entries(expected)) {
    const bytes = fs.readFileSync(path.join(folder, name));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('base64'), hash);
    assert.ok(html.includes('/vendor/leaflet-1.9.4/' + name));
    assert.ok(html.includes('sha256-' + hash));
  }
  assert.doesNotMatch(html, /https:\/\/unpkg\.com/);
});

test('Leaflet lisansı, kaynak izi, harita simgeleri ve dosya bütünlüğü korunur', () => {
  const record = JSON.parse(fs.readFileSync(path.join(folder, 'SOURCE.json'), 'utf8'));
  assert.equal(record.version, '1.9.4'); assert.equal(record.license, 'BSD-2-Clause');
  assert.equal(record.tarball, 'https://registry.npmjs.org/leaflet/-/leaflet-1.9.4.tgz');
  assert.match(fs.readFileSync(path.join(folder, 'LICENSE'), 'utf8'), /Copyright.*Volodymyr Agafonkin/);
  for (const [name, info] of Object.entries(record.files)) {
    const data = fs.readFileSync(path.join(folder, name));
    assert.equal(data.length, info.bytes);
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'), info.sha256);
  }
  const css = fs.readFileSync(path.join(folder, 'leaflet.css'), 'utf8');
  for (const [, image] of css.matchAll(/url\((images\/[^)]+)\)/g)) assert.ok(fs.existsSync(path.join(folder, image)), image);
});
