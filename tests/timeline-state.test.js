const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

test('kampanya süzgeci kayıt görünür kaldıkça kimliğini korur, dışarıda kalınca ilk kaydı seçer', () => {
  const a = { date: 'test-a', title: 'A' }, b = { date: 'test-b', title: 'B' };
  let list = [a, b], shown, closed = 0;
  const filterStatus = {};
  const ctx = { mode: 'camp', campIndex: 1, campSelection: b,
    campEvents: () => list, range: { setAttribute() {} }, clock: {},
    tlEvent: { replaceChildren() {} }, textEl: () => ({}),
    document: { createTextNode: () => ({}), getElementById: () => filterStatus }, fillFromCamp: ev => { shown = ev; },
    paintCurrent() {}, closePanel: () => { closed++; }
  };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function showCamp('), source.indexOf('  function stopPlay(')) + '\n' + source.slice(source.indexOf('  function refreshCampRange('), source.indexOf('  function setSide(')), ctx);
  list = [b]; ctx.refreshCampRange();
  assert.equal(shown, b); assert.equal(ctx.range.value, '0');
  assert.match(filterStatus.textContent, /korunuyor: B/);
  list = [a]; ctx.refreshCampRange();
  assert.equal(shown, a); assert.equal(ctx.campSelection, a);
  assert.match(filterStatus.textContent, /İlk uygun kayıt gösteriliyor: A/);
  list = []; ctx.refreshCampRange();
  assert.equal(ctx.campSelection, null); assert.equal(closed, 1);
  assert.match(filterStatus.textContent, /Seçili kart kapatıldı/);
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
  let click, tick, scrolls = 0, focused = 0;
  const calls = [];
  const button = { setAttribute() {} };
  const pause = { focus(options) { assert.equal(options.preventScroll, true); focused++; } };
  const ctx = { playing: false, playTimer: null, updateMapPlayback() {}, trackPlay() {}, scrollToMap() { scrolls++; }, clearInterval() {},
    setInterval(fn) { tick = fn; return 1; }, stepTime: (...args) => calls.push(args),
    document: { getElementById: id => id === "tl-play" ? { addEventListener(name, fn) { click = fn; } } : id === 'map-playback-pause' ? pause : null } };
  vm.createContext(ctx);
  const start = source.indexOf('  var playbackSpeed = ');
  vm.runInContext(source.slice(start, source.indexOf('  var mapPause = ', start)), ctx);
  click.call(button); tick(); tick();
  assert.deepEqual(calls, [[1, true], [1, true]]);
  assert.equal(scrolls, 1);
  assert.equal(focused, 1);
  click.call(button); assert.equal(scrolls, 1);
  assert.equal(ctx.playing, false);
  assert.equal(focused, 1);
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

test('belge denetimi açık deniz kaydı saat gibi sunulmaz; seçim ve oynatma konumu korunur', () => {
  const event = { m: 854, t: '14:14', title: 'İncelenen kayıt', text: 'Araştırma notu' };
  let shown, rendered;
  const attributes = {};
  const ctx = { sideFilter: 'both', clock: {}, range: { setAttribute(k, v) { attributes[k] = v; } },
    tlEvent: { replaceChildren(...nodes) { rendered = nodes.join(' '); } }, eventsAt: () => [event],
    textEl: (tag, text) => text, document: { createTextNode: text => text },
    fillFromNaval(ev) { shown = ev; }, paintCurrent() {}, closePanel() {} };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function showTime('), source.indexOf('  function sideLabel(')), ctx);
  ctx.showTime(854, false, event);
  assert.equal(shown, event);
  assert.equal(ctx.navalMinute, 854);
  assert.equal(ctx.navalSelection, event);
  assert.match(rendered, /Saat doğrulanmadı/);
  assert.doesNotMatch(rendered + ctx.clock.textContent + attributes['aria-valuetext'], /14:14/);
  assert.match(attributes['aria-valuetext'], /İncelenen kayıt/);
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

test('süzgeç dışı mevki seçimi süzgeci açıklayarak temizler ve doğrudan mevki kartını açar', () => {
  let place, shown = false, notice;
  const ctx = { mode: 'naval', sideFilter: 'turk', D: { events: [{ place: 'test', m: 450, side: 'itilaf' }] },
    stopPlay() {}, findPlace: () => ({}), revealDock() {}, trackMapSelect() {},
    openPlace(id) { place = id; }, showTime() { shown = true; },
    clearFilters() { ctx.sideFilter = 'both'; }, updateFilterStatus(text) { notice = text; } };
  vm.createContext(ctx);
  const start = source.indexOf('  function selectPlace(');
  vm.runInContext(source.slice(start, source.indexOf('  function addMarker(', start)), ctx);
  ctx.selectPlace('test', true);
  assert.equal(place, 'test'); assert.equal(shown, false); assert.equal(ctx.sideFilter, 'both');
  assert.match(notice, /Seçilen mevki süzgecin dışındaydı/);
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
    ctx.panelRevision = 0;
    ctx.closePanel();
    assert.equal(focused, state === 'visible' ? 'trigger' : 'search');
    assert.equal(panel.returnFocusTarget, null);
  }
});


test('harita oynatma şeridi mevcut olay ve zamanı gösterir, duraklatınca gizlenir', () => {
  const nodes = { 'map-playback': { contains: () => false }, 'map-playback-time': {}, 'map-playback-title': {}, 'panel-title': { textContent: 'Seçilen olay' } };
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


test('haritadaki Duraklat odağı kaydırmadan haritada tutar ve Leaflet tabindex değerini korur', () => {
  for (const initialTabindex of [null, '0', '-1']) {
    let click, stops = 0, focused = 0, writes = 0;
    const attributes = initialTabindex === null ? {} : { tabindex: initialTabindex };
    const host = { hasAttribute: name => Object.hasOwn(attributes, name),
      setAttribute(name, value) { attributes[name] = value; writes++; },
      focus(options) { focused++; assert.equal(options.preventScroll, true); } };
    const nodes = { map: host, 'map-playback-pause': { addEventListener(name, fn) { click = fn; } },
      'tl-play': { focus() { assert.fail('Harita varken odak zaman çubuğuna gitmemeli'); } } };
    const ctx = { stopPlay() { stops++; }, document: { getElementById: id => nodes[id] } };
    vm.createContext(ctx);
    vm.runInContext(source.slice(source.indexOf('  function focusPlaybackMap()'), source.indexOf('  function updateMapPlayback()')), ctx);
    const start = source.indexOf('  var mapPause = ');
    vm.runInContext(source.slice(start, source.indexOf('  document.addEventListener("visibilitychange"', start)), ctx);
    click(); assert.equal(stops, 1); assert.equal(focused, 1);
    assert.equal(attributes.tabindex, initialTabindex === null ? '-1' : initialTabindex);
    assert.equal(writes, initialTabindex === null ? 1 : 0);
  }
});

test('harita öğesi yoksa Duraklat ana düğmeye kaydırmadan döner; odak hedefi yoksa hata vermez', () => {
  for (const hasPlay of [true, false]) {
    let click, stops = 0, focused = 0;
    const nodes = { 'map-playback-pause': { addEventListener(name, fn) { click = fn; } } };
    if (hasPlay) nodes['tl-play'] = { focus(options) { focused++; assert.equal(options.preventScroll, true); } };
    const ctx = { stopPlay() { stops++; }, document: { getElementById: id => nodes[id] || null } };
    vm.createContext(ctx);
    vm.runInContext(source.slice(source.indexOf('  function focusPlaybackMap()'), source.indexOf('  function updateMapPlayback()')), ctx);
    const start = source.indexOf('  var mapPause = ');
    vm.runInContext(source.slice(start, source.indexOf('  document.addEventListener("visibilitychange"', start)), ctx);
    assert.doesNotThrow(() => click());
    assert.equal(stops, 1); assert.equal(focused, hasPlay ? 1 : 0);
  }
});

test('haritaya kaydırma rehber yerine haritayı hedefler, bölüm yedeğini ve hareket tercihini korur', () => {
  for (const motion of [true, false]) for (const available of ['map', 'stage', 'none']) {
    const calls = [];
    const nodes = { harita: { scrollIntoView(options) { calls.push(['stage', options]); } } };
    if (available === 'map') nodes.map = { scrollIntoView(options) { calls.push(['map', options]); } };
    if (available === 'none') delete nodes.harita;
    const ctx = { document: { getElementById: id => nodes[id] || null }, motionOn: () => motion };
    vm.createContext(ctx);
    const start = source.indexOf('  function scrollToMap()');
    vm.runInContext(source.slice(start, source.indexOf('  function focusSelectedPanel(', start)), ctx);
    assert.doesNotThrow(() => ctx.scrollToMap());
    assert.equal(calls.length, available === 'none' ? 0 : 1);
    if (calls.length) {
      assert.equal(calls[0][0], available);
      assert.equal(calls[0][1].behavior, motion ? 'smooth' : 'auto');
      assert.equal(calls[0][1].block, 'start');
    }
  }
});

test('Escape ile gizlenen oynatma düğmesindeki odak haritaya döner; dış odak taşınmaz', () => {
  for (const ownsFocus of [true, false]) {
    let keydown, focused = 0, closed = 0, cleared = 0;
    const pause = {}, outside = {}, strip = { hidden: false, contains: target => target === pause };
    const host = { hasAttribute: () => true, focus(options) {
      assert.equal(options.preventScroll, true); focused++; document.activeElement = host;
    } };
    const nodes = { map: host, 'map-playback': strip, 'tl-play': { setAttribute() {} } };
    const document = { activeElement: ownsFocus ? pause : outside,
      body: { classList: { contains: () => false } }, getElementById: id => nodes[id] || null,
      addEventListener(type, handler) { keydown = handler; } };
    const ctx = { document, playing: true, playTimer: 17, clock: {}, clearInterval() { cleared++; },
      closePanel() { closed++; }, closeTools() {} };
    vm.createContext(ctx);
    vm.runInContext(source.slice(source.indexOf('  function focusPlaybackMap()'), source.indexOf('  function setMode(')), ctx);
    const start = source.indexOf('  document.addEventListener("keydown", function (e) {');
    vm.runInContext(source.slice(start, source.indexOf('  var q = ', start)), ctx);
    keydown({ key: 'Escape' });
    assert.equal(ctx.playing, false); assert.equal(ctx.playTimer, null);
    assert.equal(strip.hidden, true); assert.equal(cleared, 1); assert.equal(closed, 1);
    assert.equal(focused, ownsFocus ? 1 : 0);
    assert.equal(document.activeElement, ownsFocus ? host : outside);
  }
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
    document: { getElementById: id => id === 'tl-speed' ? speed : id === 'map-playback-pause' ? null : button } };
  vm.createContext(ctx);
  const start = source.indexOf('  var playbackSpeed = ');
  vm.runInContext(source.slice(start, source.indexOf('  var mapPause = ', start)), ctx);
  change(); assert.equal(delays.length, 0);
  click.call(button); assert.deepEqual(delays, [5000]);
  speed.value = '8000'; change(); assert.deepEqual(delays, [5000, 8000]); assert.equal(clears, 1);
  speed.value = '0'; change(); assert.equal(delays[2], 2400);
  click.call(button); const count = delays.length; change(); assert.equal(delays.length, count);
});

test('harita işareti seçimi kart başlığına ve geri dönüş için güncel işarete bağlanır', () => {
  let click, focused, selected;
  const markerElement = { id: 'marker-ocean' };
  const marker = { addTo() { return this; }, on(name, callback) { assert.equal(name, 'click'); click = callback; return this; },
    bindTooltip() {}, getElement: () => markerElement };
  const ctx = { L: { marker: () => marker }, groups: { enkaz: {} }, markers: {}, iconFor() {},
    selectPlace(id, fly) { selected = [id, fly]; }, focusSelectedPanel(trigger) { focused = trigger; } };
  vm.createContext(ctx);
  const start = source.indexOf('  function addMarker(');
  const end = source.indexOf('\n  }', start) + 4;
  vm.runInContext(source.slice(start, end), ctx);
  ctx.addMarker({ id: 'ocean', name: 'Ocean', lat: 40, lng: 26, type: 'enkaz' });
  click();
  assert.deepEqual(selected, ['ocean', false]);
  assert.equal(focused, markerElement);
  assert.equal(ctx.markers.ocean, marker);
});

test('harita işaretinde Enter ve boşluk bir kez seçer; diğer kontroller etkilenmez', () => {
  let selected = 0, focused = 0, prevented = 0, stopped = 0;
  const target = { closest: () => ({}) };
  const ctx = { markers: { ocean: { getElement: () => target } },
    selectPlace(id) { assert.equal(id, 'ocean'); selected++; }, focusSelectedPanel(el) { assert.equal(el, target); focused++; } };
  vm.createContext(ctx);
  const start = source.indexOf('  function activateMarkerKey(');
  vm.runInContext(source.slice(start, source.indexOf('  document.addEventListener("keydown", activateMarkerKey', start)), ctx);
  const event = { target, preventDefault() { prevented++; }, stopImmediatePropagation() { stopped++; } };
  for (const key of ['Enter', ' ']) ctx.activateMarkerKey({ ...event, key });
  assert.equal(selected, 2); assert.equal(focused, 2); assert.equal(prevented, 2); assert.equal(stopped, 2);
  ctx.activateMarkerKey({ ...event, key: 'Enter', repeat: true });
  ctx.activateMarkerKey({ ...event, key: 'Enter', ctrlKey: true });
  ctx.activateMarkerKey({ ...event, key: 'Tab' });
  ctx.activateMarkerKey({ ...event, key: ' ', target: { closest: () => ({}) } });
  assert.equal(selected, 2); assert.equal(prevented, 3);
});

test('zaman çubuğuna elle müdahale oynatmayı durdurup seçilen kaydı gösterir', () => {
  for (const mode of ['camp', 'naval']) {
    let input; const calls = [];
    const ctx = { mode, range: { value: '3', addEventListener(type, handler) { input = handler; } },
      stopPlay() { calls.push('stop'); }, showCamp(i, fly) { calls.push(['camp', i, fly]); }, showTime(m, fly) { calls.push(['naval', m, fly]); } };
    vm.createContext(ctx);
    const start = source.indexOf('  range.addEventListener("input"');
    vm.runInContext(source.slice(start, source.indexOf('  function refreshCampRange(', start)), ctx);
    input();
    assert.deepEqual(calls, ['stop', [mode, 3, true]]);
  }
});
