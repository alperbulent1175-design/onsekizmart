const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function setup(url = 'https://example.invalid/olaylar/') {
  const elements = {};
  function el(text = '') {
    return { textContent: text, hidden: false, value: '', listeners: {},
      addEventListener(key, fn) { this.listeners[key] = fn; },
      focus() { this.focused = true; }
    };
  }
  ['events-tools', 'events-results', 'events-query', 'events-category', 'events-count', 'events-clear'].forEach(id => { elements[id] = el(); });
  elements['events-category'].value = 'all';
  const rows = [el('Arıburnu çıkarması 25 Nisan 1915'), el('Nusret 8 Mart 1915'), el('Arıburnu tahliyesi 19 Aralık 1915')];
  const subgroup = el();
  subgroup.querySelectorAll = () => [rows[0]];
  ['kara', 'deniz', 'tahliye'].forEach((id, index) => {
    const group = el();
    group.querySelectorAll = selector => selector === 'section' ? (index === 0 ? [subgroup] : []) : [rows[index]];
    elements[id] = group;
  });
  const document = { getElementById: id => elements[id] };
  const window = { location: new URL(url), listeners: {}, history: { state: { retained: true } },
    addEventListener(key, fn) { this.listeners[key] = fn; } };
  let writes = 0;
  window.history.replaceState = (state, title, next) => { writes++; window.location = new URL(next); window.history.state = state; };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/events-index.js'), 'utf8'), { document, window, URL, URLSearchParams });
  return { elements, rows, subgroup, window, writes: () => writes };
}

test('olay dizini Türkçe arama ile bölüm seçimini birleştirir', () => {
  const { elements: e, rows, subgroup } = setup();
  e['events-query'].value = 'ARIBURNU';
  e['events-query'].listeners.input();
  assert.deepEqual(rows.map(row => row.hidden), [false, true, false]);
  e['events-category'].value = 'deniz';
  e['events-category'].listeners.change();
  assert.ok(rows.every(row => row.hidden));
  assert.equal(subgroup.hidden, true);
  assert.match(e['events-count'].textContent, /bulunamadı/);
});

test('paylaşılan bağlantı Türkçe aramayı ve bölümü açılışta uygular', () => {
  const { elements: e, rows, writes } = setup('https://example.invalid/olaylar/?q=Ar%C4%B1burnu&bolum=kara');
  assert.equal(e['events-query'].value, 'Arıburnu');
  assert.equal(e['events-category'].value, 'kara');
  assert.deepEqual(rows.map(row => row.hidden), [false, true, true]);
  assert.equal(writes(), 0);
});

test('süzgeç değişimi diğer URL alanlarını ve geçmiş durumunu korur, temizleme yalnız kendi alanlarını kaldırır', () => {
  const { elements: e, window: w } = setup('https://example.invalid/olaylar/?ref=test#kirte');
  e['events-query'].value = ' Arıburnu ';
  e['events-query'].listeners.input();
  e['events-category'].value = 'tahliye';
  e['events-category'].listeners.change();
  assert.equal(w.location.searchParams.get('q'), 'Arıburnu');
  assert.equal(w.location.searchParams.get('bolum'), 'tahliye');
  assert.equal(w.location.searchParams.get('ref'), 'test');
  assert.equal(w.location.hash, '#kirte');
  assert.equal(w.history.state.retained, true);
  e['events-clear'].listeners.click();
  assert.equal(w.location.search, '?ref=test');
  assert.equal(w.location.hash, '#kirte');
});

test('geri dönüş ve sayfa önbelleğinden açılış URL durumunu uygular; geçersiz bölüm bütününü gösterir', () => {
  const { elements: e, rows, window: w, writes } = setup();
  w.location = new URL('https://example.invalid/olaylar/?q=Nusret&bolum=deniz');
  w.listeners.popstate();
  assert.deepEqual(rows.map(row => row.hidden), [true, false, true]);
  w.location = new URL('https://example.invalid/olaylar/?bolum=bilinmeyen');
  w.listeners.pageshow();
  assert.equal(e['events-category'].value, 'all');
  assert.equal(e['events-query'].value, '');
  assert.ok(rows.every(row => !row.hidden));
  assert.equal(writes(), 0);
});

test('geçmiş erişimi engellense de süzgeç ve temizleme çalışır', () => {
  const { elements: e, rows, window: w } = setup();
  w.history.replaceState = () => { throw new Error('Test-only history failure'); };
  e['events-query'].value = 'Nusret';
  assert.doesNotThrow(() => e['events-query'].listeners.input());
  assert.deepEqual(rows.map(row => row.hidden), [true, false, true]);
  assert.doesNotThrow(() => e['events-clear'].listeners.click());
  assert.ok(rows.every(row => !row.hidden));
});

test('olay dizini temizleme ile tüm kayıtları ve odağı geri getirir', () => {
  const { elements: e, rows, subgroup } = setup();
  e['events-query'].value = '<img src=x onerror=alert(1)>';
  e['events-query'].listeners.input();
  assert.ok(rows.every(row => row.hidden));
  e['events-clear'].listeners.click();
  assert.ok(rows.every(row => !row.hidden));
  assert.equal(subgroup.hidden, false);
  assert.equal(e['events-query'].focused, true);
  assert.equal(e['events-category'].value, 'all');
  assert.match(e['events-count'].textContent, /3 olay/);
});
