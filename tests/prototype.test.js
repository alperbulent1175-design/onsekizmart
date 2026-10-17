const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function boot(withMap = false) {
  class Element {
    constructor() {
      this.children = [];
      this.attributes = {};
      this.listeners = {};
      this.hidden = false;
      this.value = '';
      this.textContent = '';
      const classes = new Set();
      this.classList = {
        contains: value => classes.has(value),
        remove: value => classes.delete(value),
        toggle(value) {
          if (classes.has(value)) { classes.delete(value); return false; }
          classes.add(value); return true;
        }
      };
    }
    appendChild(child) { this.children.push(child); return child; }
    setAttribute(key, value) { this.attributes[key] = value; }
    getAttribute(key) { return this.attributes[key]; }
    addEventListener(key, listener) { this.listeners[key] = listener; }
    focus() { this.focused = true; }
    fire(key, event = {}) { this.listeners[key]?.(event); }
  }
  const elements = new Map();
  const filters = ['all', 'deniz', 'kara'].map(value => {
    const element = new Element(); element.setAttribute('data-domain', value); return element;
  });
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new Element());
      return elements.get(id);
    },
    createElement: () => new Element(),
    querySelectorAll: () => filters,
    addEventListener(key, fn) { this[key] = fn; }
  };
  const positions = [];
  const markers = [];
  const map = {
    setView(position) { positions.push(Array.from(position)); return this; },
    invalidateSize() {}, removeLayer() {}, remove() {}
  };
  const window = { matchMedia: () => ({ matches: true }), setTimeout: fn => fn(), location: { reload() {} } };
  const context = vm.createContext({ window, document });
  if (withMap) context.L = {
    map: () => map,
    tileLayer: () => ({ on() {}, addTo() {} }),
    control: { layers: () => ({ addTo() {} }) },
    circleMarker(position) {
      markers.push(Array.from(position));
      return { addTo() { return this; }, bindPopup() { return this; } };
    }
  };
  ['js/data.js', 'js/campaign.js', 'prototip/ana-sayfa/js/prototip.js'].forEach(file => {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  });
  return { document, elements, filters, positions, markers, data: window.OM };
}

test('prototip harita kütüphanesi yokken kronoloji ve tüm olay bağlantılarını korur', () => {
  const { document: doc, data } = boot();
  const events = data.campaign.events.filter(ev => !ev.quiet && ev.id !== 'e-nisan2627');
  const rows = doc.getElementById('prototype-events').children;
  assert.equal(rows.length, events.length);
  assert.match(doc.getElementById('map-status').textContent, /kullanılabilir/);
  rows.forEach(row => {
    row.children[0].fire('click');
    const href = doc.getElementById('detail-page').href;
    assert.ok(fs.existsSync(path.resolve(root, 'prototip/ana-sayfa', href)), href);
    assert.match(doc.getElementById('detail-status').textContent, /doğrulama tamamlanmadı/);
    assert.equal(doc.getElementById('detail-map').hidden, true);
  });
});

test('prototip Türkçe aramayı tür süzgeciyle birleştirir ve boş sonuç bildirir', () => {
  const { document: doc, filters } = boot();
  const search = doc.getElementById('event-search');
  const rows = doc.getElementById('prototype-events').children;
  search.value = 'ARIBURNU'; search.fire('input');
  const visible = rows.filter(row => !row.hidden);
  assert.ok(visible.length > 0);
  visible.forEach(row => assert.match(row.children[0].children[1].textContent, /Arıburnu/));
  filters[1].fire('click');
  assert.equal(rows.filter(row => !row.hidden).length, 0);
  assert.match(doc.getElementById('event-count').textContent, /bulunamadı/);
  search.value = '<img src=x onerror=alert(1)>'; search.fire('input');
  assert.equal(rows.filter(row => !row.hidden).length, 0);
});

test('prototip işaretleri yalnız mevcut atlas koordinatlarından alır', () => {
  const { document: doc, positions, markers, data } = boot(true);
  assert.deepEqual(positions[0], Array.from(data.center));
  const places = data.places.concat(data.campaign.places);
  const events = data.campaign.events.filter(ev => !ev.quiet && ev.id !== 'e-nisan2627');
  doc.getElementById('prototype-events').children.forEach((row, index) => {
    const before = markers.length;
    row.children[0].fire('click');
    const place = places.find(item => item.id === events[index].place);
    if (place && Number.isFinite(place.lat) && Number.isFinite(place.lng)) {
      assert.deepEqual(markers.at(-1), [place.lat, place.lng]);
    } else {
      assert.equal(markers.length, before);
      assert.equal(doc.getElementById('detail-map').hidden, true);
    }
  });
});

test('mobil menü Escape ile kapanır ve odağı düğmeye geri verir', () => {
  const { document: doc } = boot();
  const toggle = doc.getElementById('nav-toggle');
  toggle.fire('click');
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  doc.keydown({ key: 'Escape' });
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(toggle.focused, true);
});
