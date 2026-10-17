const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

test('kampanya süzgeci kayıt görünür kaldıkça kimliğini korur, dışarıda kalınca ilk kaydı seçer', () => {
  const a = { date: 'test-a', title: 'A' }, b = { date: 'test-b', title: 'B' };
  let list = [a, b], shown, closed = 0;
  const ctx = { mode: 'camp', campIndex: 1, campSelection: b,
    campEvents: () => list, range: { setAttribute() {} }, clock: {},
    tlEvent: { replaceChildren() {} }, textEl: () => ({}),
    document: { createTextNode: () => ({}) }, fillFromCamp: ev => { shown = ev; },
    paintCurrent() {}, closePanel: () => { closed++; }
  };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function showCamp('), source.indexOf('  function stopPlay(')) + '\n' + source.slice(source.indexOf('  function refreshCampRange('), source.indexOf('  function setSide(')), ctx);
  list = [b]; ctx.refreshCampRange();
  assert.equal(shown, b); assert.equal(ctx.range.value, '0');
  list = [a]; ctx.refreshCampRange();
  assert.equal(shown, a); assert.equal(ctx.campSelection, a);
  list = []; ctx.refreshCampRange();
  assert.equal(ctx.campSelection, null); assert.equal(closed, 1);
  assert.match(ctx.tlEvent.textContent, /olay yok/);
});

test('oynatma adımı oynatmayı durdurmaz; kullanıcı adımı durdurur', () => {
  const events = [{ m: 450, side: 'both' }, { m: 450, side: 'both' }, { m: 500, side: 'both' }];
  let stops = 0;
  const ctx = { mode: 'naval', sideFilter: 'both', D: { events }, navalSelection: events[0], range: { value: '450' },
    stopPlay() { stops++; }, showTime(m, fly, event) { ctx.navalSelection = event; } };
  vm.createContext(ctx);
  const start = source.indexOf('  function stepTime(');
  vm.runInContext(source.slice(start, source.indexOf('  document.getElementById("tl-both")', start)), ctx);
  ctx.stepTime(1, true); assert.equal(stops, 0); assert.equal(ctx.navalSelection, events[1]);
  ctx.stepTime(1, true); assert.equal(stops, 0); assert.equal(ctx.navalSelection, events[2]);
  ctx.stepTime(-1); assert.equal(stops, 1);
});

test('Oynat düğmesinin gerçek zamanlayıcısı sonraki adımları oynatma olarak çağırır', () => {
  let click, tick, scrolls = 0;
  const calls = [];
  const button = { setAttribute() {} };
  const ctx = { playing: false, playTimer: null, updateMapPlayback() {}, trackPlay() {}, scrollToMap() { scrolls++; }, clearInterval() {},
    setInterval(fn) { tick = fn; return 1; }, stepTime: (...args) => calls.push(args),
    document: { getElementById: id => id === "tl-play" ? { addEventListener(name, fn) { click = fn; } } : null } };
  vm.createContext(ctx);
  const start = source.indexOf('  var playbackSpeed = ');
  vm.runInContext(source.slice(start, source.indexOf('  var mapPause = ', start)), ctx);
  click.call(button); tick(); tick();
  assert.deepEqual(calls, [[1, true], [1, true]]);
  assert.equal(scrolls, 1);
  click.call(button); assert.equal(scrolls, 1);
  assert.equal(ctx.playing, false);
});

test('deniz süzgecinde önceki kayıt yoksa eski panel kapatılır', () => {
  let closed = false;
  const ctx = { sideFilter: 'both', clock: {}, range: { setAttribute() {} }, tlEvent: { replaceChildren() {} },
    minsToClock: () => 'test', eventsAt: () => [], textEl: () => ({}),
    document: { createTextNode: () => ({}) }, paintCurrent() {}, closePanel() { closed = true; } };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function showTime('), source.indexOf('  function sideLabel(')), ctx);
  ctx.showTime(450, false);
  assert.equal(closed, true); assert.equal(ctx.navalSelection, null);
});


test('arka plana geçiş oynatmayı durdurur, görünür olma kendiliğinden başlatmaz', () => {
  let visibility, pagehide, stops = 0;
  const ctx = { document: { hidden: false, addEventListener(name, fn) { assert.equal(name, 'visibilitychange'); visibility = fn; } },
    window: { addEventListener(name, fn) { assert.equal(name, 'pagehide'); pagehide = fn; } },
    stopPlay() { stops++; } };
  vm.createContext(ctx);
  const start = source.indexOf('  document.addEventListener("visibilitychange"');
  vm.runInContext(source.slice(start, source.indexOf('  showTime(450, false);', start)), ctx);
  visibility(); assert.equal(stops, 0);
  ctx.document.hidden = true; visibility(); assert.equal(stops, 1);
  ctx.document.hidden = false; visibility(); assert.equal(stops, 1);
  pagehide(); assert.equal(stops, 2);
});

test('haritadan elle mevki seçimi oynatmayı durdurur ve kaydı açar', () => {
  const event = { place: 'test', m: 450 };
  let stops = 0, shown;
  const ctx = { stopPlay() { stops++; }, findPlace: () => ({}), revealDock() {}, trackMapSelect() {},
    mode: 'naval', sideFilter: 'both', D: { events: [event] }, range: {}, showTime(m, fly, ev) { shown = ev; } };
  vm.createContext(ctx);
  const start = source.indexOf('  function selectPlace(');
  vm.runInContext(source.slice(start, source.indexOf('  function addMarker(', start)), ctx);
  ctx.selectPlace('test', true);
  assert.equal(stops, 1); assert.equal(shown, event);
});


test('arama kaydı karşı taraf süzgecini açar ve tam seçilen kaydı gösterir', () => {
  const event = { m: 450, side: 'itilaf' };
  let shown, resets = 0, stops = 0;
  const ctx = { D: { events: [event] }, mode: 'camp', sideFilter: 'turk', range: {},
    stopPlay() { stops++; }, setSide(side) { ctx.sideFilter = side; resets++; },
    setMode(mode) { ctx.mode = mode; }, revealDock() {},
    showTime(m, fly, ev) { shown = ev; assert.equal(m, 450); assert.equal(fly, true); } };
  vm.createContext(ctx);
  const start = source.indexOf('  function focusNavalEvent(');
  vm.runInContext(source.slice(start, source.indexOf('  function focusCampEvent(', start)), ctx);
  ctx.focusNavalEvent(event, true);
  assert.equal(shown, event); assert.equal(resets, 1); assert.equal(stops, 1);
  assert.equal(ctx.mode, 'naval'); assert.equal(ctx.range.value, '450');
  ctx.focusNavalEvent(event, true); assert.equal(resets, 1);
  ctx.focusNavalEvent({ m: 450, side: 'itilaf' }, true); assert.equal(stops, 2);
});

test('mevki seçimi süzgeç dışı olay yerine mevki kartını açar', () => {
  let place, shown = false;
  const ctx = { mode: 'naval', sideFilter: 'turk', D: { events: [{ place: 'test', m: 450, side: 'itilaf' }] },
    stopPlay() {}, findPlace: () => ({}), revealDock() {}, trackMapSelect() {},
    openPlace(id) { place = id; }, showTime() { shown = true; } };
  vm.createContext(ctx);
  const start = source.indexOf('  function selectPlace(');
  vm.runInContext(source.slice(start, source.indexOf('  function addMarker(', start)), ctx);
  ctx.selectPlace('test', true);
  assert.equal(place, 'test'); assert.equal(shown, false); assert.equal(ctx.sideFilter, 'turk');
});


test('Escape önce açık aracı kapatır; ikinci Escape paneli ve oynatmayı kapatır', () => {
  for (const openClass of ['is-search-open', 'is-filter-open', 'is-layer-open']) {
    let handler, active = openClass, closed = 0, stopped = 0, focused = 0;
    const ctx = { closeTools() { active = ''; }, closePanel() { closed++; }, stopPlay() { stopped++; },
      document: { addEventListener(name, fn) { handler = fn; },
        body: { classList: { contains: name => name === active } },
        getElementById: id => id === 'nav-panel' ? null : { focus() { focused++; } } } };
    vm.createContext(ctx);
    const start = source.indexOf('  document.addEventListener("keydown", function (e) {');
    vm.runInContext(source.slice(start, source.indexOf('  var q = ', start)), ctx);
    handler({ key: 'Enter' }); assert.equal(focused, 0);
    handler({ key: 'Escape' });
    assert.equal(focused, 1); assert.equal(closed, 0); assert.equal(stopped, 0);
    handler({ key: 'Escape' });
    assert.equal(closed, 1); assert.equal(stopped, 1);
  }
});

test('kartı kapatma düğmesi oynatmayı da durdurur', () => {
  let click, closed = 0, stopped = 0;
  const ctx = { document: { getElementById: () => ({ addEventListener(name, fn) { click = fn; } }) },
    stopPlay() { stopped++; }, closePanel() { closed++; } };
  vm.createContext(ctx);
  const start = source.indexOf('  document.getElementById("panel-close").addEventListener');
  vm.runInContext(source.slice(start, source.indexOf('  document.getElementById("panel-body").addEventListener', start)), ctx);
  click(); assert.equal(stopped, 1); assert.equal(closed, 1);
});


test('elle liste seçimi kart başlığına odaklanır ve hareket tercihine uyar', () => {
  for (const motion of [false, true]) {
    let focused = 0, scrolled, tabindex;
    const panel = { inert: false, classList: { contains: () => true }, scrollIntoView(options) { scrolled = options; } };
    const title = { setAttribute(name, value) { tabindex = [name, value]; },
      focus(options) { focused++; assert.equal(options.preventScroll, true); } };
    const ctx = { document: { getElementById: id => id === 'panel' ? panel : title }, motionOn: () => motion };
    vm.createContext(ctx);
    const start = source.indexOf('  function focusSelectedPanel(');
    vm.runInContext(source.slice(start, source.indexOf('  function goPlace(', start)), ctx);
    ctx.focusSelectedPanel();
    assert.deepEqual(tabindex, ['tabindex', '-1']); assert.equal(focused, 1);
    assert.equal(scrolled.block, 'start'); assert.equal(scrolled.behavior, 'instant');
    panel.inert = true; ctx.focusSelectedPanel(); assert.equal(focused, 1);
  }
});


test('kart kapanınca geçerli liste düğmesine döner, kaldırılan veya gizli düğmede aramaya düşer', () => {
  for (const state of ['visible', 'removed', 'hidden', 'inert', 'disabled', 'no-rect']) {
    let focused;
    const trigger = { isConnected: state !== 'removed', disabled: state === 'disabled',
      closest: () => ['hidden', 'inert'].includes(state) ? {} : null,
      getClientRects: () => state === 'no-rect' ? [] : [{}], focus() { focused = 'trigger'; } };
    const panel = { returnFocusTarget: trigger, contains: () => true, classList: { remove() {} } };
    const ctx = { document: { activeElement: {}, getElementById: id => id === 'panel' ? panel : id === 'tool-search' ? { focus() { focused = 'search'; } } : null },
      window: { matchMedia: () => ({ matches: true }) }, paintIcons() {} };
    vm.createContext(ctx);
    const start = source.indexOf('  function closePanel()');
    vm.runInContext(source.slice(start, source.indexOf('  function selectPlace(', start)), ctx);
    ctx.closePanel();
    assert.equal(focused, state === 'visible' ? 'trigger' : 'search');
    assert.equal(panel.returnFocusTarget, null);
  }
});


test('harita oynatma şeridi mevcut olay ve zamanı gösterir, duraklatınca gizlenir', () => {
  const nodes = { 'map-playback': {}, 'map-playback-time': {}, 'map-playback-title': {}, 'panel-title': { textContent: 'Seçilen olay' } };
  const ctx = { playing: true, clock: { textContent: 'Seçilen zaman' }, document: { getElementById: id => nodes[id] } };
  vm.createContext(ctx);
  const start = source.indexOf('  function updateMapPlayback()');
  vm.runInContext(source.slice(start, source.indexOf('  function stopPlay()', start)), ctx);
  ctx.updateMapPlayback();
  assert.equal(nodes['map-playback'].hidden, false);
  assert.equal(nodes['map-playback-title'].textContent, 'Seçilen olay');
  assert.equal(nodes['map-playback-time'].textContent, 'Seçilen zaman');
  ctx.playing = false; ctx.updateMapPlayback(); assert.equal(nodes['map-playback'].hidden, true);
});


test('haritadaki Duraklat düğmesi oynatmayı durdurup ana düğmeye odak verir', () => {
  let click, stops = 0, focused = 0;
  const ctx = { stopPlay() { stops++; }, document: { getElementById: id => id === 'map-playback-pause' ? { addEventListener(name, fn) { click = fn; } } : { focus() { focused++; } } } };
  vm.createContext(ctx);
  const start = source.indexOf('  var mapPause = ');
  vm.runInContext(source.slice(start, source.indexOf('  document.addEventListener("visibilitychange"', start)), ctx);
  click(); assert.equal(stops, 1); assert.equal(focused, 1);
});


test('kapalı seçili katman açıklanır ve yalnız ilgili katman düğmeyle açılır', () => {
  let on = false, added = 0, note, status = {}, pressed;
  const panel = { selectedPlaceId: 'test', inert: false };
  const body = { appendChild(node) { note = node; } };
  const group = { addTo() { on = true; added++; } };
  const ctx = { activeId: 'test', findPlace: () => ({ type: 'gemi', name: 'Test gemisi' }), groups: { gemi: group },
    map: { hasLayer: () => on }, textEl(tag, text) { return { tag, textContent: text, children: [], appendChild(n) { this.children.push(n); }, addEventListener(name, fn) { this.click = fn; }, contains: () => false, remove() { note = null; } }; },
    document: { activeElement: {}, getElementById(id) { return ({ panel, 'selected-layer-note': note, 'panel-body': body, 'map-view-status': status, layers: { querySelector: () => ({ setAttribute(k, v) { pressed = v; } }) } })[id]; } } };
  vm.createContext(ctx);
  const start = source.indexOf('  function updateSelectedLayerNotice()');
  vm.runInContext(source.slice(start, source.indexOf('  function paintIcons()', start)), ctx);
  ctx.updateSelectedLayerNotice(); assert.ok(note); assert.equal(added, 0);
  note.children[1].click(); assert.equal(added, 1); assert.equal(pressed, 'true');
  assert.equal(note, null); assert.match(status.textContent, /Test gemisi/);
  ctx.updateSelectedLayerNotice(); assert.equal(note, null);
  on = false; ctx.activeId = 'old-marker'; panel.selectedPlaceId = null;
  ctx.updateSelectedLayerNotice(); assert.equal(note, null);
  panel.selectedPlaceId = 'test'; panel.inert = true;
  ctx.updateSelectedLayerNotice(); assert.equal(note, null);
  panel.inert = false; ctx.updateSelectedLayerNotice(); assert.ok(note);
  ctx.map = null; ctx.updateSelectedLayerNotice(); assert.equal(note, null);
});


test('bekleme süresi değişimi tek zamanlayıcıyı yeniler, dururken başlatmaz', () => {
  let change, click, clears = 0;
  const delays = [];
  const speed = { value: '5000', addEventListener(name, fn) { change = fn; } };
  const button = { setAttribute() {}, addEventListener(name, fn) { click = fn; } };
  const ctx = { playing: false, playTimer: null, updateMapPlayback() {}, scrollToMap() {}, trackPlay() {},
    clearInterval() { clears++; }, setInterval(fn, delay) { delays.push(delay); return delays.length; },
    document: { getElementById: id => id === 'tl-speed' ? speed : button } };
  vm.createContext(ctx);
  const start = source.indexOf('  var playbackSpeed = ');
  vm.runInContext(source.slice(start, source.indexOf('  var mapPause = ', start)), ctx);
  change(); assert.equal(delays.length, 0);
  click.call(button); assert.deepEqual(delays, [5000]);
  speed.value = '8000'; change(); assert.deepEqual(delays, [5000, 8000]); assert.equal(clears, 1);
  speed.value = '0'; change(); assert.equal(delays[2], 2400);
  click.call(button); const count = delays.length; change(); assert.equal(delays.length, count);
});
