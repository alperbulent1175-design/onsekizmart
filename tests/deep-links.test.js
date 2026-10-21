const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

function visit(search, hash = '') {
  const notice = { hidden: true, scrollIntoView() { this.scrolled = true; } };
  const message = { textContent: '' };
  const selected = [];
  const heading = {};
  const nodes = { 'deep-link-notice': notice, 'deep-link-message': message, 'deep-link-heading': heading };
  const context = {
    URLSearchParams, panelRevision: 0, map: null, restoreAtlasView() {},
    D: { events: [{ m: 450, title: 'first' }, { m: 450, title: 'second' }] }, mode: 'naval', range: { value: '' },
    slugify: value => value,
    showTime: (minute, fly, event) => selected.push(event ? event.title : minute), revealDock() {},
    window: { location: { search, hash }, setTimeout: fn => fn() },
    document: { getElementById: id => nodes[id] || null },
    findCampByKey: key => key.replace(/^event-/, '') === 'test-event' ? { id: 'test-event' } : null,
    findPlace: key => key === 'test-place' ? { id: 'test-place' } : null,
    focusCampEvent: event => selected.push(event.id),
    scrollToMap() {}, openPlace: id => selected.push(id)
  };
  vm.runInNewContext(source.slice(source.indexOf('  function consumeDeepLink()'), source.indexOf('  function bindDock()')) + '\nconsumeDeepLink();', context);
  return { notice, message, selected, heading };
}

test('bilinmeyen ve boş olay/mevki bağlantısı kayıt seçmeden açıklanır', () => {
  for (const [query, hash] of [['?olay=missing', ''], ['?mevki=missing', ''], ['?olay=', ''], ['?mevki=', ''], ['', '#event-missing']]) {
    const result = visit(query, hash);
    assert.equal(result.notice.hidden, false);
    assert.equal(result.notice.scrolled, true);
    assert.match(result.message.textContent, /kayıt seçilmedi/);
    assert.equal(result.selected.length, 0);
  }
});

test('paylaşılan zaman yalnız mevcut bir kronoloji kaydını açar', () => {
  const valid = visit('?dakika=450');
  assert.equal(valid.notice.hidden, true);
  assert.equal(valid.selected[0], 450);
  for (const value of ['451', '', '-1', 'NaN', '450.5', '450x', '99999']) {
    const invalid = visit('?dakika=' + value);
    assert.equal(invalid.notice.hidden, false);
    assert.equal(invalid.selected.length, 0);
  }
});

test('aynı dakikadaki kayıtlar paylaşım bağlantısında ayrılır', () => {
  assert.equal(visit('?dakika=450&deniz=first').selected[0], 'first');
  assert.equal(visit('?dakika=450&deniz=second').selected[0], 'second');
  const invalid = visit('?dakika=450&deniz=missing');
  assert.equal(invalid.notice.hidden, false);
  assert.equal(invalid.selected.length, 0);
});

test('aynı saatli kayıt seçimi, ileri/geri ve başa dönüşte kaybolmaz', () => {
  const events = [{ m: 450, title: 'first', side: 'both' }, { m: 450, title: 'second', side: 'both' }, { m: 500, title: 'third', side: 'both' }];
  let shown;
  const ctx = {
    D: { events }, mode: 'naval', sideFilter: 'both', range: { value: '450', setAttribute() {} },
    clock: {}, tlEvent: { replaceChildren() {} }, minsToClock: value => String(value),
    eventsAt: m => events.filter(e => e.m <= m),
    document: { createTextNode: value => value }, textEl: (tag, text) => text,
    fillFromNaval: event => { shown = event; }, paintCurrent() {}, stopPlay() {}
  };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function showTime('), source.indexOf('  function sideLabel(')) + '\n' + source.slice(source.indexOf('  function stepTime('), source.indexOf('  document.getElementById("tl-both")', source.indexOf('  function stepTime('))), ctx);
  ctx.showTime(450, false, events[0]);
  assert.equal(shown, events[0]);
  ctx.stepTime(1); assert.equal(shown, events[1]);
  ctx.stepTime(1); assert.equal(shown, events[2]);
  ctx.stepTime(1); assert.equal(shown, events[0]);
  ctx.stepTime(-1); assert.equal(shown, events[2]);
  ctx.showTime(450, false); assert.equal(shown, events[1]);
  ctx.showTime(450, false, events[2]); assert.equal(shown, events[1]);
});

test('zaman çubuğu klavyede gerçek kayıtları izler; aynı dakika, uçlar ve taraf seçimi korunur', () => {
  const events = [{ m: 450, title: 'first', side: 'both' }, { m: 450, title: 'second', side: 'itilaf' }, { m: 500, title: 'third', side: 'turk' }];
  let keydown, shown, stopped = 0, prevented = 0;
  const ctx = { mode: 'naval', sideFilter: 'both', navalSelection: events[0], panelRevision: 0,
    range: { value: '450', addEventListener(type, fn) { if (type === 'keydown') keydown = fn; } },
    navalEvents(side) { return events.filter(e => side === 'both' || e.side === 'both' || e.side === side); },
    stopPlay() { stopped++; }, showTime(m, fly, event) { assert.equal(fly, true); shown = event; ctx.navalSelection = event; } };
  vm.createContext(ctx);
  const start = source.indexOf('  range.addEventListener("keydown"');
  vm.runInContext(source.slice(start, source.indexOf('  function refreshCampRange()', start)), ctx);
  const press = (key, extra = {}) => keydown({ key, preventDefault() { prevented++; }, ...extra });
  press('ArrowRight'); assert.equal(shown, events[1]); assert.equal(ctx.range.value, '450');
  press('ArrowUp'); assert.equal(shown, events[2]); assert.equal(ctx.range.value, '500');
  press('ArrowRight'); assert.equal(shown, events[2]);
  press('Home'); assert.equal(shown, events[0]); press('ArrowLeft'); assert.equal(shown, events[0]);
  press('End'); assert.equal(shown, events[2]); press('ArrowDown'); assert.equal(shown, events[1]);
  ctx.sideFilter = 'turk'; press('Home'); press('ArrowRight'); assert.equal(shown, events[2]);
  const before = stopped;
  for (const property of ['defaultPrevented', 'isComposing', 'ctrlKey', 'altKey', 'metaKey', 'shiftKey']) press('ArrowRight', { [property]: true });
  press('Tab'); ctx.mode = 'camp'; press('Home'); assert.equal(stopped, before);
  ctx.mode = 'naval'; ctx.navalEvents = () => []; press('End'); assert.equal(stopped, before + 1);
  assert.equal(prevented, stopped); assert.equal(ctx.panelRevision, stopped);
});

test('geçerli bağlantılar ve sıradan bölüm bağlantıları uyarı üretmez', () => {
  for (const [query, hash, expected] of [['?olay=test-event', '', 'test-event'], ['?mevki=test-place', '', 'test-place'], ['', '#event-test-event', 'test-event'], ['', '#harita', undefined]]) {
    const result = visit(query, hash);
    assert.equal(result.notice.hidden, true);
    assert.equal(result.selected[0], expected);
  }
});

test('geçersiz olay sessizce başka mevkiye düşmez ve URL girdisi mesaja basılmaz', () => {
  const result = visit('?olay=%3Cimg%20src=x%3E&mevki=test-place');
  assert.equal(result.selected.length, 0);
  assert.equal(result.notice.hidden, false);
  assert.equal(result.message.textContent.includes('<img'), false);
});

test('yinelenen veya karışık kayıt parametreleri ilk kaydı sessizce seçmez', () => {
  const cases = [
    ['?olay=test-event&olay=test-event', ''], ['?olay=missing&olay=test-event', ''],
    ['?mevki=test-place&mevki=missing', ''], ['?dakika=450&dakika=500', ''],
    ['?dakika=450&deniz=first&deniz=second', ''],
    ['?olay=test-event&mevki=test-place', ''], ['?olay=test-event&dakika=450', ''],
    ['?mevki=test-place&deniz=first', ''], ['?mevki=test-place', '#event-test-event'],
    ['?olay=missing', '#event-test-event'], ['?olay=', '#event-test-event'],
    ['?olay=test-event', '#event-missing']
  ];
  for (const [query, hash] of cases) {
    const result = visit(query, hash);
    assert.equal(result.selected.length, 0, query + hash);
    assert.equal(result.notice.hidden, false, query + hash);
    assert.match(result.message.textContent, /birden fazla veya çelişkili/);
    assert.equal(result.heading.textContent, 'Bağlantıdaki seçim belirsiz');
  }
});

test('aynı olayı gösteren eski çapa ve sorgu korunur; tek başına deniz anahtarı açıklanır', () => {
  const valid = visit('?olay=test-event&ref=koru', '#event-test-event');
  assert.equal(valid.notice.hidden, true); assert.equal(valid.selected[0], 'test-event');
  const invalid = visit('?deniz=first');
  assert.equal(invalid.notice.hidden, false); assert.equal(invalid.selected.length, 0);
  assert.match(invalid.message.textContent, /zaman kaydı/);
});
