const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

function setup() {
  let focused;
  function node() {
    return { children: [], handlers: {}, hidden: false, value: '', textContent: '',
      setAttribute(key, value) { this[key] = value; },
      addEventListener(key, handler) { this.handlers[key] = handler; },
      appendChild(child) { this.children.push(child); },
      focus() { if (focused === this) return; focused = this; this.handlers.focus?.(); },
      querySelectorAll() { return this.children.map(child => child.children[0]); },
      set innerHTML(value) { this.children = []; }
    };
  }
  const q = node(), results = node(), more = node(), clear = node(), status = node(), play = node();
  const nodes = { q, 'q-results': results, 'q-more': more, 'q-clear': clear, 'q-status': status, 'tl-play': play };
  const callbacks = [], selected = [], cleared = [];
  let restored = 0, scrolled = 0;
  const ctx = {
    document: { getElementById: id => nodes[id] || null, createElement: node },
    window: { location: { search: '', hash: '' }, setTimeout: callback => callbacks.push(callback) },
    URLSearchParams, panelRevision: 0, playing: true, playTimer: 17, map: null,
    updateMapPlayback() { ctx.playbackHidden = !ctx.playing; }, clearInterval: id => cleared.push(id),
    D: { events: [{ m: 450, title: 'test-naval-record', text: '', t: '' }] },
    allPlaces: () => Array.from({ length: 10 }, (_, i) => ({ id: 'test-' + i, name: 'Test record ' + i })),
    foldTr: value => value.toLowerCase(), slugify: value => value,
    mode: 'naval', range: { value: '' }, revealDock() {},
    findPlace: key => key === 'test-place' ? { id: key } : null,
    findCampByKey: key => key === 'test-event' ? { id: key } : null,
    openPlace: id => selected.push(id), focusCampEvent: event => selected.push(event.id),
    showTime: minute => selected.push(minute), restoreAtlasView() { restored++; },
    scrollToMap() { scrolled++; }
  };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function stopPlay('), source.indexOf('  function setMode(')), ctx);
  vm.runInContext(source.slice(source.indexOf('  var q = document.getElementById("q");'), source.indexOf('  var clock = document.getElementById("clock");')), ctx);
  vm.runInContext(source.slice(source.indexOf('  function consumeDeepLink()'), source.indexOf('  function bindDock()')), ctx);
  q.value = 'test record';
  ctx.renderSearch();
  function key(target, value, extra = {}) {
    target.handlers.keydown({ key: value, target: results.children[0]?.children[0], preventDefault() {}, stopPropagation() {}, ...extra });
  }
  return { ctx, q, results, more, clear, status, play, cleared, selected,
    restored: () => restored, scrolled: () => scrolled, focused: () => focused, key,
    pending(query) { ctx.window.location.search = query; ctx.consumeDeepLink(); assert.equal(callbacks.length, 1); },
    finish() { callbacks.forEach(callback => callback()); }
  };
}

const interactions = {
  focus: state => state.q.focus(),
  input: state => state.q.handlers.input(),
  clear: state => state.clear.handlers.click(),
  more: state => state.more.handlers.click(),
  inputDown: state => state.key(state.q, 'ArrowDown'),
  inputUp: state => state.key(state.q, 'ArrowUp'),
  resultDown: state => state.key(state.results, 'ArrowDown'),
  resultUp: state => state.key(state.results, 'ArrowUp')
};

test('arama etkileşimi gerçek oynatma zamanlayıcısını durdurur ve arama davranışını korur', () => {
  for (const [name, interact] of Object.entries(interactions)) {
    const state = setup();
    interact(state);
    assert.equal(state.ctx.playing, false, name);
    assert.equal(state.ctx.playTimer, null);
    assert.deepEqual(state.cleared, [17]);
    assert.equal(state.play['aria-pressed'], 'false');
    assert.equal(state.play.textContent, 'Oynat');
    assert.equal(state.ctx.playbackHidden, true);
    assert.ok(state.ctx.panelRevision > 0);
    assert.equal(state.q.value, name === 'clear' ? '' : 'test record');
    assert.equal(state.results.children.length, name === 'clear' ? 0 : name === 'more' ? 11 : 8);
    if (name === 'more') assert.equal(state.focused(), state.results.children[8].children[0]);
    if (name === 'clear') assert.equal(state.focused(), state.q);
  }
});

test('arama başladığında bekleyen olay, mevki ve zaman bağlantıları araya girmez', () => {
  for (const query of ['?olay=test-event', '?mevki=test-place', '?dakika=450']) {
    for (const [name, interact] of Object.entries(interactions)) {
      const state = setup();
      state.pending(query);
      interact(state);
      state.finish();
      assert.deepEqual(state.selected, [], query + ' / ' + name);
      assert.equal(state.restored(), 0);
      assert.equal(state.scrolled(), 0);
    }
  }
});

test('programmatik sonuç çizimi ve işlenmeyen klavye girdileri oynatmayı etkilemez', () => {
  const state = setup();
  state.ctx.renderSearch();
  for (const name of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'isComposing', 'defaultPrevented']) {
    state.key(state.q, 'ArrowDown', { [name]: true });
    state.key(state.results, 'ArrowDown', { [name]: true });
  }
  state.key(state.q, 'Tab');
  state.key(state.results, 'ArrowDown', { target: {} });
  assert.equal(state.ctx.playing, true);
  assert.equal(state.ctx.panelRevision, 0);
  assert.deepEqual(state.cleared, []);
});

test('arama etkileşimi yokken geçerli açılış bağlantıları çalışmaya devam eder', () => {
  for (const [query, expected] of [['?olay=test-event', 'test-event'], ['?mevki=test-place', 'test-place'], ['?dakika=450', 450]]) {
    const state = setup();
    state.pending(query);
    state.ctx.renderSearch();
    state.finish();
    assert.deepEqual(state.selected, [expected]);
    assert.equal(state.restored(), 1);
  }
});

test('arama alanında Enter sonuçlara geçirir; Home ve End listede gezinir, kayıt kendiliğinden seçilmez', () => {
  const state = setup();
  state.key(state.q, 'Enter');
  assert.equal(state.focused(), state.results.children[0].children[0]);
  state.key(state.results, 'End');
  assert.equal(state.focused(), state.results.children[7].children[0]);
  state.key(state.results, 'Home');
  assert.equal(state.focused(), state.results.children[0].children[0]);
  assert.deepEqual(state.selected, []);
  state.q.value = 'yok'; state.ctx.renderSearch();
  assert.doesNotThrow(() => state.key(state.q, 'Enter'));
  assert.deepEqual(state.selected, []);
});

test('seçimden sonra aramaya dönmek metni ve sonuçları korur; Escape kapattığını yeniden açmaz', () => {
  const state = setup();
  state.ctx.selectPlace = () => {};
  state.results.children[0].children[0].handlers.click();
  assert.equal(state.results.hidden, true);
  state.q.focus();
  assert.equal(state.q.value, 'test record');
  assert.equal(state.results.hidden, false);
  assert.equal(state.results.children.length, 8);
  state.key(state.results, 'Escape');
  assert.equal(state.results.hidden, true);
  assert.equal(state.focused(), state.q);
  state.key(state.q, 'ArrowDown');
  assert.equal(state.results.hidden, false);
});

test('harita yoksa arama mevki kartını vaat eder; çalışan haritada harita etiketi korunur', () => {
  const state = setup();
  assert.match(state.results.children[0].children[0].children[1].textContent, /Mevki kartı/);
  state.ctx.map = {};
  state.ctx.renderSearch();
  assert.match(state.results.children[0].children[0].children[1].textContent, /Harita/);
  assert.doesNotMatch(state.results.children[0].children[0].children[1].textContent, /Mevki kartı/);
});
