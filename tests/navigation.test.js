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
  vm.runInNewContext(script, { document, window });
  return { button, panel, link, document, media, resize: () => resize() };
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
