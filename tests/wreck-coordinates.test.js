const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const ctx = { window: {} };
vm.runInNewContext(read('js/data.js'), ctx);
const report = JSON.parse(read('research/ux-audit/batik-koordinat-incelemesi.json'));

test('Irresistible noktasında ondalıklı dakika saniye veya ondalık derece sayılmaz', () => {
  const place = ctx.window.OM.places.find(p => p.id === 'irresistible');
  assert.ok(Math.abs(place.lat - (40 + 4.438 / 60)) < 1e-8);
  assert.ok(Math.abs(place.lng - (26 + 20.441 / 60)) < 1e-8);
  assert.equal(place.accuracy, 'yaklasik');
  assert.equal(place.coordinateSource.datum, 'belirtilmemis');
  assert.ok(place.coordinateSource.url && place.coordinateSource.evidenceText && place.coordinateSource.date);
  assert.notEqual(place.coordinateSource.status, 'iddia_dogrulandi');
  assert.match(place.uncertainty, /isabeti veya tahliye/);
});

test('Bouvet ve Ocean sayısal kaynak yokken taşınmaz', () => {
  for (const id of ['bouvet', 'ocean']) {
    const p = ctx.window.OM.places.find(p => p.id === id);
    const before = report.before.find(p => p.id === id);
    assert.equal(p.lat, before.lat); assert.equal(p.lng, before.lng);
    assert.match(p.uncertainty, /dayanağı tamamlanmadı/);
  }
});

test('Leaflet işareti güncel veri koordinatlarıyla ve enlem-boylam sırasıyla oluşturulur', () => {
  const app = read('js/app.js'); const calls = [];
  const c = { map: {}, groups: { enkaz: {} }, markers: {}, iconFor() {}, selectPlace() {},
    L: { marker(coords, opts) { calls.push({ coords: Array.from(coords), title: opts.title }); return { addTo() { return this; }, on() { return this; }, bindTooltip() {} }; } } };
  vm.createContext(c);
  const start = app.indexOf('  function addMarker(');
  vm.runInContext(app.slice(start, app.indexOf('  if (mapReady)', start)), c);
  for (const id of ['bouvet', 'irresistible', 'ocean']) {
    const p = ctx.window.OM.places.find(p => p.id === id); c.addMarker(p);
    assert.deepEqual(calls.at(-1).coords, [p.lat, p.lng]); assert.equal(calls.at(-1).title, p.name);
  }
});
