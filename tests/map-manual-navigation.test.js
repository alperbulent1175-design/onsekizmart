const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
const start = source.indexOf('  function bindManualMapNavigation(');
const script = source.slice(start, source.indexOf('  if (mapReady) bindManualMapNavigation', start));

test('hızlı mevki seçiminde son istek kazanır ve oynatma tıklama anında durur', () => {
  const pending = [], selected = [];
  let stops = 0;
  const ctx = { panelRevision: 0, stopPlay() { stops++; }, scrollToMap() {},
    motionOn: () => true, setTimeout(fn) { pending.push(fn); },
    selectPlace(id) { selected.push(id); ctx.panelRevision++; } };
  vm.createContext(ctx);
  const index = source.indexOf('  function goPlace(');
  vm.runInContext(source.slice(index, source.indexOf('  function openLoose(', index)), ctx);
  ctx.goPlace('first');
  ctx.goPlace('second');
  assert.equal(stops, 2);
  assert.deepEqual(selected, []);
  pending.forEach(fn => fn());
  assert.deepEqual(selected, ['second']);
});

test('harita rehberi açılırken oynatma ve bekleyen seçim durur; kapanış yeniden başlatmaz', () => {
  let toggle, stops = 0;
  const ctx = { panelRevision: 4, stopPlay() { stops++; } };
  vm.createContext(ctx);
  const index = source.indexOf('  function bindMapGuide(');
  vm.runInContext(source.slice(index, source.indexOf("  bindMapGuide(document", index)), ctx);
  const guide = { open: false, addEventListener(type, fn) { assert.equal(type, 'toggle'); toggle = fn; } };
  ctx.bindMapGuide(guide);
  toggle(); assert.equal(stops, 0); assert.equal(ctx.panelRevision, 4);
  guide.open = true; toggle(); assert.equal(stops, 1); assert.equal(ctx.panelRevision, 5);
  guide.open = false; toggle(); assert.equal(stops, 1); assert.equal(ctx.panelRevision, 5);
  assert.doesNotThrow(() => ctx.bindMapGuide(null));
});

test('başlangıç görünümü bekleyen olay, mevki veya zaman açılışıyla geri alınmaz', () => {
  for (const search of ['?olay=test-event', '?mevki=test-place', '?dakika=450&deniz=test']) {
    const pending = [], selections = [], views = [];
    let reset;
    const event = { id: 'test-event', m: 450, title: 'test' };
    const ctx = { URLSearchParams, panelRevision: 0, mapReady: true, motionOn: () => false,
      D: { center: [40, 26], defaultZoom: 11, events: [event] },
      map: { stop() {}, setView(center, zoom) { views.push([Array.from(center), zoom]); } },
      stopPlay() {}, findCampByKey: key => key === 'test-event' ? event : null, findPlace: () => ({}), slugify: value => value,
      focusCampEvent() { selections.push('event'); }, openPlace() { selections.push('place'); }, showTime() { selections.push('time'); },
      window: { location: { search, hash: '#harita' }, setTimeout(fn) { pending.push(fn); } },
      document: { getElementById: id => id === 'map-reset' ? { addEventListener(type, fn) { reset = fn; } } : {} } };
    vm.createContext(ctx);
    let index = source.indexOf('  var resetView = ');
    vm.runInContext(source.slice(index, source.indexOf('  var activeId = ', index)), ctx);
    index = source.indexOf('  function consumeDeepLink()');
    vm.runInContext(source.slice(index, source.indexOf('  function bindDock()', index)), ctx);
    ctx.consumeDeepLink(); assert.equal(pending.length, 1);
    reset(); pending.forEach(fn => fn());
    assert.deepEqual(selections, [], search);
    assert.deepEqual(views, [[[40, 26], 11]], search);
  }
});

test('elle harita gezinmesi oynatmayı ve bekleyen açılışı keser; native hareketi engellemez', () => {
  let stops = 0, mapStops = 0;
  const status = {}, handlers = {};
  const ctx = { panelRevision: 3, playing: true, stopPlay() { stops++; ctx.playing = false; },
    map: { stop() { mapStops++; } }, document: { getElementById: () => status } };
  vm.createContext(ctx); vm.runInContext(script, ctx);
  ctx.bindManualMapNavigation({ addEventListener(type, fn, capture) { assert.equal(capture, true); handlers[type] = fn; } });
  assert.equal(stops, 0); // Programmatic flyTo/zoom events do not invoke these DOM handlers.
  handlers.pointerdown({ button: 2 }); assert.equal(stops, 0);
  handlers.pointerdown({ button: 0 }); assert.equal(stops, 1); assert.equal(mapStops, 1);
  assert.equal(ctx.panelRevision, 4); assert.match(status.textContent, /duraklatıldı/);
  const base = { key: 'ArrowRight', preventDefault() { assert.fail('Native harita tuşu engellenmemeli'); } };
  for (const modifier of ['defaultPrevented', 'isComposing', 'altKey', 'ctrlKey', 'metaKey']) handlers.keydown({ ...base, [modifier]: true });
  handlers.keydown({ ...base, key: 'Tab' }); assert.equal(stops, 1);
  for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', '=', 'Enter', ' ']) handlers.keydown({ ...base, key });
  assert.equal(stops, 10); assert.equal(mapStops, 10); assert.equal(ctx.panelRevision, 13);
  handlers.keydown({ ...base, shiftKey: true }); assert.equal(stops, 11);
  assert.doesNotThrow(() => ctx.bindManualMapNavigation(null));
});
