const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const app = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
const tools = [
  ['is-search-open', 'search-pop', 'tool-search'],
  ['is-filter-open', 'filter-pop', 'tool-filter'],
  ['is-layer-open', 'layers', 'tool-layers']
];

function setup(compact = true) {
  const classes = new Set();
  const nodes = {}, inputs = {};
  const document = {
    activeElement: {},
    body: { classList: {
      contains: key => classes.has(key),
      add: (...keys) => keys.forEach(key => classes.add(key)),
      remove: (...keys) => keys.forEach(key => classes.delete(key))
    } },
    getElementById: id => nodes[id] || null
  };
  for (const [, contentId, triggerId] of tools) {
    inputs[contentId] = { focus() { document.activeElement = this; } };
    nodes[contentId] = { contains: element => element === inputs[contentId] };
    nodes[triggerId] = {
      attributes: {}, listeners: {}, visible: true, blocked: false, disabled: false,
      setAttribute(key, value) { this.attributes[key] = value; },
      addEventListener(type, handler) { this.listeners[type] = handler; },
      closest() { return this.blocked ? {} : null; },
      getClientRects() { return this.visible ? [{}] : []; },
      focus(options) { this.focusOptions = options; document.activeElement = this; }
    };
  }
  nodes.q = inputs['search-pop'];
  const ctx = {
    document, window: { matchMedia: () => ({ matches: compact, addEventListener() {} }) },
    panelRevision: 0, playing: true, stops: 0, stopPlay() { ctx.playing = false; ctx.stops++; },
    clearFilters() {}, stepTime() {}
  };
  vm.createContext(ctx);
  vm.runInContext(app.slice(app.indexOf('  function closeTools('), app.indexOf('  function syncToolLayout(')), ctx);
  vm.runInContext(app.slice(app.indexOf('  function bindDock('), app.indexOf('  bindNav();')), ctx);
  return { ctx, nodes, inputs, document, classes };
}

function pendingLink(ctx, search) {
  const callbacks = [], selected = [];
  let restored = 0;
  Object.assign(ctx, {
    URLSearchParams, map: null, mode: 'naval', range: { value: '' },
    D: { events: [{ m: 450, title: 'test-naval-record' }] },
    slugify: value => value,
    findCampByKey: key => key === 'test-event' ? { id: key } : null,
    findPlace: key => key === 'test-place' ? { id: key } : null,
    focusCampEvent: event => { selected.push(event.id); ctx.closeTools(); },
    selectPlace: id => { selected.push(id); ctx.closeTools(); },
    showTime: minute => { selected.push(minute); ctx.closeTools(); },
    scrollToMap() {}, revealDock() {}, restoreAtlasView() { restored++; }
  });
  ctx.window.location = { search, hash: '' };
  ctx.window.setTimeout = callback => callbacks.push(callback);
  vm.runInContext(app.slice(app.indexOf('  function consumeDeepLink()'), app.indexOf('  function bindDock()')), ctx);
  ctx.consumeDeepLink();
  assert.equal(callbacks.length, 1);
  return { selected, restored: () => restored, finish: () => callbacks.forEach(callback => callback()) };
}

test('dar ekranda kapanan aracın içindeki odak görünür tetikleyiciye döner', () => {
  for (const [openClass, contentId, triggerId] of tools) {
    const { ctx, nodes, inputs, document, classes } = setup();
    classes.add(openClass);
    document.activeElement = inputs[contentId];
    ctx.closeTools();
    assert.equal(document.activeElement, nodes[triggerId]);
    assert.equal(nodes[triggerId].focusOptions.preventScroll, true);
    assert.equal(classes.size, 0);
    tools.forEach(([, , id]) => assert.equal(nodes[id].attributes['aria-expanded'], 'false'));
  }
});

test('masaüstünde veya odak aracın dışındayken kapanış odağı taşımaz', () => {
  for (const [compact, inside] of [[false, true], [true, false]]) {
    const { ctx, inputs, document, classes } = setup(compact);
    classes.add('is-filter-open');
    const active = inside ? inputs['filter-pop'] : {};
    document.activeElement = active;
    ctx.closeTools();
    assert.equal(document.activeElement, active);
    assert.equal(classes.size, 0);
  }
});

test('gizli, etkisiz veya devre dışı araç düğmesine odak verilmez', () => {
  for (const change of [{ visible: false }, { blocked: true }, { disabled: true }]) {
    const { ctx, nodes, inputs, document, classes } = setup();
    Object.assign(nodes['tool-filter'], change);
    classes.add('is-filter-open');
    document.activeElement = inputs['filter-pop'];
    ctx.closeTools();
    assert.equal(document.activeElement, inputs['filter-pop']);
    assert.equal(classes.size, 0);
  }
});

test('arama, süzgeç veya katman açılması oynatmayı durdurur; kapatılması yeniden başlatmaz', () => {
  for (const [openClass, , triggerId] of tools) {
    const { ctx, nodes, document, classes } = setup();
    ctx.bindDock();
    nodes[triggerId].focus();
    nodes[triggerId].listeners.click();
    assert.equal(ctx.playing, false);
    assert.equal(ctx.stops, 1);
    assert.equal(classes.has(openClass), true);
    assert.equal(nodes[triggerId].attributes['aria-expanded'], 'true');
    assert.equal(document.activeElement, triggerId === 'tool-search' ? nodes.q : nodes[triggerId]);
    nodes[triggerId].focus();
    nodes[triggerId].listeners.click();
    assert.equal(classes.has(openClass), false);
    assert.equal(ctx.playing, false);
    assert.equal(ctx.stops, 1);
  }
});

test('kullanıcının açtığı araç bekleyen olay, mevki veya zaman bağlantısıyla kapanmaz', () => {
  for (const query of ['?olay=test-event', '?mevki=test-place', '?dakika=450']) {
    for (const [openClass, , triggerId] of tools) {
      const { ctx, nodes, document, classes } = setup();
      ctx.bindDock();
      const pending = pendingLink(ctx, query);
      nodes[triggerId].focus();
      nodes[triggerId].listeners.click();
      const active = document.activeElement;
      pending.finish();
      assert.deepEqual(pending.selected, [], query + ' / ' + triggerId);
      assert.equal(pending.restored(), 0);
      assert.equal(classes.has(openClass), true);
      assert.equal(nodes[triggerId].attributes['aria-expanded'], 'true');
      assert.equal(document.activeElement, active);
    }
  }
});

test('kullanıcı araya girmediğinde açılış bağlantısı seçilir ve harita görünümü geri yüklenir', () => {
  for (const [query, expected] of [['?olay=test-event', 'test-event'], ['?mevki=test-place', 'test-place'], ['?dakika=450', 450]]) {
    const { ctx, classes } = setup();
    ctx.bindDock();
    const pending = pendingLink(ctx, query);
    pending.finish();
    assert.deepEqual(pending.selected, [expected]);
    assert.equal(pending.restored(), 1);
    assert.equal(classes.size, 0);
  }
});
