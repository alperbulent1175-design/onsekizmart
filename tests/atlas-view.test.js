const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
const fragment = source.slice(source.indexOf('  function saveAtlasView('), source.indexOf('  function fillPanel('));
function setup() {
  let stored = null;
  const enabled = new Set();
  const ctx = { Date, groups: { tabya: { addTo() { enabled.add(this); } }, birlik: { addTo() { enabled.add(this); } } },
    tiles: { uydu: { addTo() { enabled.add(this); } }, yol: { addTo() { enabled.add(this); } } },
    sideFilter: 'turk', campDomain: 'kara', localHref: x => x, updateSelectedLayerNotice() {},
    window: { location: { pathname: '/', search: '?olay=test', hash: '#harita' }, sessionStorage: {
      setItem(k, v) { stored = v; }, getItem() { return stored; }, removeItem() { stored = null; } } },
    map: { getCenter: () => ({ lat: 40.1, lng: 26.2 }), getZoom: () => 12, hasLayer: g => enabled.has(g),
      removeLayer(g) { enabled.delete(g); }, stop() { ctx.stopped = true; }, setView(center, zoom) { ctx.view = [Array.from(center), zoom]; } },
    setSide(s) { ctx.side = s; }, setDomain(d) { ctx.domain = d; }, document: { querySelector: () => null, getElementById: () => null } };
  enabled.add(ctx.groups.tabya); enabled.add(ctx.tiles.uydu);
  vm.createContext(ctx); vm.runInContext(fragment, ctx);
  return { ctx, set: value => { stored = JSON.stringify(value); }, stored: () => JSON.parse(stored) };
}
test('aynı kayda dönüş yakınlık, merkez, taraf ve katmanları geri yükler', () => {
  const { ctx } = setup();
  ctx.saveAtlasView('/?olay=test#harita');
  ctx.restoreAtlasView();
  assert.deepEqual(ctx.view, [[40.1, 26.2], 12]);
  assert.equal(ctx.side, 'turk'); assert.equal(ctx.domain, 'kara'); assert.equal(ctx.stopped, true);
  assert.equal(ctx.readAtlasView('/?olay=test#harita'), null);
});
test('başka kayıt, süresi dolmuş veya bozuk görünüm uygulanmaz', () => {
  const { ctx, stored, set } = setup();
  ctx.saveAtlasView('/?olay=test#harita'); const valid = stored();
  assert.equal(ctx.readAtlasView('/?olay=other#harita'), null);
  for (const change of [{ zoom: 99 }, { lat: 91 }, { lng: '26' }, { side: 'unknown' }, { domain: 'unknown' }, { base: 'unknown' }, { layers: ['unknown'] }, { savedAt: Date.now() - 1800001 }]) {
    set({ ...valid, ...change }); assert.equal(ctx.readAtlasView('/?olay=test#harita'), null);
  }
  ctx.window.sessionStorage.getItem = () => { throw Error('disabled'); };
  assert.equal(ctx.readAtlasView('/?olay=test#harita'), null);
});
test('uydu ve yol tercihi geri gelir, diğer taban katmanı kapanır', () => {
  for (const base of ['uydu', 'yol']) {
    const { ctx } = setup();
    const other = base === 'yol' ? 'uydu' : 'yol';
    ctx.map.removeLayer(ctx.tiles[other]); ctx.tiles[base].addTo(ctx.map);
    ctx.saveAtlasView('/?olay=test#harita');
    ctx.map.removeLayer(ctx.tiles[base]); ctx.tiles[other].addTo(ctx.map);
    ctx.restoreAtlasView();
    assert.equal(ctx.map.hasLayer(ctx.tiles[base]), true);
    assert.equal(ctx.map.hasLayer(ctx.tiles[other]), false);
    assert.equal(ctx.map.hasLayer(ctx.groups.tabya), true);
  }
});
