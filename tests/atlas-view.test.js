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

test('depolama kapalıysa görünüm kaydı kaynak sayfasına geçişi engellemez', () => {
  const { ctx } = setup();
  ctx.window.sessionStorage.setItem = () => { throw Error('storage disabled'); };
  assert.doesNotThrow(() => ctx.saveAtlasView('/?olay=test#harita'));
  assert.equal(ctx.readAtlasView('/?olay=test#harita'), null);
});

test('haritaya dönüş arama metnini geri getirir; yeni yazılan aramayı ezmez', () => {
  const { ctx, stored, set } = setup();
  const input = { value: 'Mecidiye' };
  let rendered = 0, closed = 0;
  ctx.document.getElementById = id => id === 'q' ? input : null;
  ctx.renderSearch = () => { rendered++; };
  ctx.closeSearchResults = () => { closed++; };
  ctx.qStatus = {};
  ctx.saveAtlasView('/?olay=test#harita');
  const saved = stored(); assert.equal(saved.query, 'Mecidiye');
  input.value = ''; ctx.restoreAtlasView();
  assert.equal(input.value, 'Mecidiye'); assert.equal(rendered, 1); assert.equal(closed, 1);
  assert.equal(ctx.searchPicked, true);
  set(saved); input.value = 'Kumkale'; ctx.restoreAtlasView();
  assert.equal(input.value, 'Kumkale'); assert.equal(rendered, 1);
  for (const query of [42, {}, 'x'.repeat(501)]) {
    set({ ...saved, query }); assert.equal(ctx.readAtlasView('/?olay=test#harita'), null);
  }
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

test('mevki bağlantısının seçimi dönüş görünümünden sonra ikinci işlem bırakmaz', () => {
  const { ctx } = setup(); const pending = [];
  ctx.URLSearchParams = URLSearchParams;
  ctx.window.location.search = '?mevki=test-place';
  ctx.window.setTimeout = callback => pending.push(callback);
  ctx.findCampByKey = () => null; ctx.findPlace = () => ({});
  ctx.panelRevision = 0; ctx.scrollToMap = () => {};
  const opened = [];
  ctx.selectPlace = () => { assert.fail('Mevki bağlantısı olay seçimine dönüşmemeli'); };
  ctx.openPlace = (id, fly) => { ctx.selected = id; opened.push(fly); if (fly) ctx.view = [[40.9, 26.9], 13]; };
  ctx.setSide = () => { ctx.selected = 'initial-naval-event'; };
  ctx.setDomain = () => { ctx.selected = 'initial-campaign-event'; };
  ctx.map.invalidateSize = () => {};
  const start = source.indexOf('  function consumeDeepLink()');
  vm.runInContext(source.slice(start, source.indexOf('  function bindDock()', start)), ctx);
  ctx.saveAtlasView('/?mevki=test-place#harita');
  ctx.consumeDeepLink(); assert.equal(pending.length, 1);
  pending.shift()();
  assert.deepEqual(ctx.view, [[40.1, 26.2], 12]);
  assert.equal(ctx.selected, 'test-place');
  assert.deepEqual(opened, [true, false]);
  assert.equal(pending.length, 0);
});

for (const kind of ['olay', 'dakika']) {
  test(kind + ' bağlantısında süzgeç geri yükleme seçili kaydı ezmez', () => {
    const { ctx } = setup(); const pending = [];
    const event = { id: 'e-test', title: 'Test olayı', m: 450 };
    ctx.URLSearchParams = URLSearchParams;
    ctx.window.location.search = kind === 'olay' ? '?olay=test' : '?dakika=450&deniz=test';
    ctx.window.setTimeout = callback => pending.push(callback);
    ctx.findCampByKey = () => kind === 'olay' ? event : null;
    ctx.findPlace = () => null;
    ctx.D = { events: [event] }; ctx.slugify = () => 'test';
    ctx.panelRevision = 0; ctx.mode = 'naval'; ctx.range = {};
    ctx.revealDock = () => {};
    ctx.map.invalidateSize = () => {};
    ctx.setSide = () => { ctx.selected = 'wrong-side-event'; };
    ctx.setDomain = () => { ctx.selected = 'wrong-domain-event'; };
    ctx.focusCampEvent = ev => { ctx.selected = ev.id; ctx.view = [[40.9, 26.9], 13]; };
    ctx.showTime = (minute, fly, ev) => { assert.equal(minute, 450); ctx.selected = ev.id; ctx.view = [[40.8, 26.8], 14]; };
    const start = source.indexOf('  function consumeDeepLink()');
    vm.runInContext(source.slice(start, source.indexOf('  function bindDock()', start)), ctx);
    ctx.saveAtlasView('/' + ctx.window.location.search + '#harita');
    ctx.consumeDeepLink();
    assert.equal(pending.length, 1); pending.shift()();
    assert.equal(ctx.selected, event.id);
    assert.deepEqual(ctx.view, [[40.1, 26.2], 12]);
    assert.equal(pending.length, 0);
  });
}
