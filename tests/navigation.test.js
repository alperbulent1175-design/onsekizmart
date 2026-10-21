const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function setup(home = false) {
  const open = new Set();
  const panel = {
    listeners: {}, attributes: {},
    classList: {
      contains: key => open.has(key), remove: key => open.delete(key),
      toggle(key) { if (open.has(key)) { open.delete(key); return false; } open.add(key); return true; }
    },
    addEventListener(key, fn) { this.listeners[key] = fn; },
    setAttribute(key, value) { this.attributes[key] = value; },
    contains: target => target === panel || target === link
  };
  const button = {
    listeners: {}, attributes: {}, hidden: true,
    addEventListener(key, fn) { this.listeners[key] = fn; },
    setAttribute(key, value) { this.attributes[key] = value; },
    contains: target => target === button,
    focus() { document.activeElement = button; }
  };
  const link = { closest: () => link };
  const document = {
    listeners: {}, activeElement: null,
    getElementById: id => id === 'nav-panel' ? panel : button,
    addEventListener(key, fn) { this.listeners[key] = fn; }
  };
  let resize;
  const media = { matches: true, addEventListener: (key, fn) => { resize = fn; } };
  const window = { matchMedia: () => media };
  const source = fs.readFileSync(path.join(__dirname, home ? '../js/app.js' : '../js/navigation.js'), 'utf8');
  const script = home ? source.slice(source.indexOf('  function bindNav()'), source.indexOf('  function consumeDeepLink()')) + '\nbindNav();' : source;
  const context = { document, window, panelRevision: 0, stops: 0, stopPlay() { context.stops++; } };
  vm.runInNewContext(script, context);
  return { button, panel, link, document, media, context, resize: () => resize() };
}

test('olay menüsü açılır, Escape kapatır ve odağı geri verir', () => {
  const { button, panel, document } = setup();
  assert.equal(button.hidden, false);
  button.listeners.click();
  assert.equal(panel.classList.contains('is-open'), true);
  document.listeners.keydown({ key: 'Escape' });
  assert.equal(button.attributes['aria-expanded'], 'false');
  assert.equal(document.activeElement, button);
});

test('menü işlenmiş, birleşim veya değiştiricili Escape tuşuna müdahale etmez', () => {
  const { button, panel, document } = setup();
  button.listeners.click();
  for (const key of ['defaultPrevented', 'isComposing', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
    document.listeners.keydown({ key: 'Escape', [key]: true });
    assert.equal(panel.classList.contains('is-open'), true, key);
    assert.equal(document.activeElement, null, key);
  }
  document.listeners.keydown({ key: 'Escape' });
  assert.equal(panel.classList.contains('is-open'), false);
});

test('atlas Escape sırası menü, araç ve karttır; işlenmiş tuş değişiklik yapmaz', () => {
  const source = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
  const start = source.indexOf('  document.addEventListener("keydown", function (e) {');
  let handler, focused = '', stopped = 0, closed = 0, toolsClosed = 0;
  const open = new Set(['is-open']), body = new Set(['is-search-open']);
  const nav = { classList: { contains: k => open.has(k), remove: k => open.delete(k) } };
  const ctx = { document: {
    addEventListener(type, fn) { handler = fn; },
    getElementById(id) { return id === 'nav-panel' ? nav : { setAttribute() {}, focus() { focused = id; } }; },
    body: { classList: { contains: k => body.has(k) } }
  }, stopPlay() { stopped++; }, closePanel() { closed++; }, closeTools() { toolsClosed++; body.clear(); } };
  vm.runInNewContext(source.slice(start, source.indexOf('  var q =', start)), ctx);
  for (const key of ['defaultPrevented', 'isComposing', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey']) handler({ key: 'Escape', [key]: true });
  assert.equal(open.has('is-open'), true); assert.equal(focused, '');
  assert.equal(stopped + closed + toolsClosed, 0);
  handler({ key: 'Escape' }); assert.equal(focused, 'nav-toggle'); assert.equal(closed, 0);
  handler({ key: 'Escape' }); assert.equal(focused, 'tool-search'); assert.equal(toolsClosed, 1); assert.equal(closed, 0);
  handler({ key: 'Escape' }); assert.equal(stopped, 1); assert.equal(closed, 1);
});

test('mobil menüden Tab ile çıkış menüyü kapatır, hedef odağını değiştirmez', () => {
  for (const home of [false, true]) {
    const { button, panel, link, document, media } = setup(home);
    button.listeners.click();
    document.activeElement = link; document.listeners.focusin({ target: link });
    assert.equal(panel.classList.contains('is-open'), true);
    document.activeElement = button; document.listeners.focusin({ target: button });
    assert.equal(panel.classList.contains('is-open'), true);
    const outside = {};
    document.activeElement = outside; document.listeners.focusin({ target: outside });
    assert.equal(panel.classList.contains('is-open'), false);
    assert.equal(button.attributes['aria-expanded'], 'false');
    assert.equal(document.activeElement, outside);
    button.listeners.click(); media.matches = false;
    document.listeners.focusin({ target: outside });
    assert.equal(panel.classList.contains('is-open'), true);
    assert.equal(document.activeElement, outside);
  }
});

test('bağlantı, dış tıklama ve ekran geçişi menü durumunu kapatır', () => {
  const { button, panel, link, document, resize } = setup();
  button.listeners.click();
  panel.listeners.click({ target: link });
  assert.equal(panel.classList.contains('is-open'), false);
  button.listeners.click();
  document.activeElement = link;
  document.listeners.click({ target: {} });
  assert.equal(document.activeElement, button);
  assert.equal(button.attributes['aria-expanded'], 'false');
  button.listeners.click();
  resize();
  assert.equal(panel.classList.contains('is-open'), false);
});

test('masaüstüne geçişte odak gizli Menü düğmesine taşınmaz', () => {
  const { button, link, document, media, resize } = setup();
  button.listeners.click();
  document.activeElement = link;
  media.matches = false;
  resize();
  assert.equal(document.activeElement, link);
  assert.equal(button.attributes['aria-expanded'], 'false');
  media.matches = true;
  resize();
  assert.equal(document.activeElement, button);
});

test('ana sayfa menüsü dış tıklama ve ekran geçişinde odağı korur', () => {
  const { button, panel, link, document, media, resize } = setup(true);
  button.listeners.click(); document.activeElement = link;
  document.listeners.click({ target: {} });
  assert.equal(button.attributes['aria-expanded'], 'false');
  assert.equal(document.activeElement, button);
  button.listeners.click(); document.activeElement = link; media.matches = false; resize();
  assert.equal(document.activeElement, link);
  assert.equal(panel.classList.contains('is-open'), false);
  media.matches = true; resize(); assert.equal(document.activeElement, button);
  button.listeners.click(); panel.listeners.click({ target: link });
  assert.equal(button.attributes['aria-expanded'], 'false');
});

test('ana sayfada bölüme atlamak bekleyen kayıt açılışını ve oynatmayı geçersiz kılar', () => {
  const { document, context } = setup(true);
  const target = { closest: () => ({ getAttribute: () => '#kronoloji' }) };
  document.listeners.click({ target, button: 0 });
  assert.equal(context.panelRevision, 1); assert.equal(context.stops, 1);
  for (const property of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey', 'defaultPrevented']) document.listeners.click({ target, [property]: true });
  document.listeners.click({ target, button: 1 });
  document.listeners.click({ target: { closest: () => ({ getAttribute: () => '#harita' }) } });
  assert.equal(context.panelRevision, 1); assert.equal(context.stops, 1);
});
