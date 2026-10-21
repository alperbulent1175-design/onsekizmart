const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('olay aramasının URL metni 200 karakterle sınırlanır ve güvenli dönüş üretir', () => {
  const { elements: e, rows } = setup('https://example.invalid/olaylar/?q=' + encodeURIComponent('ş'.repeat(201)) + '&bolum=kara');
  assert.equal(e['events-query'].value, 'ş'.repeat(200));
  const back = new URL(new URL(rows[0].link.href, 'https://example.invalid').searchParams.get('listeyeDon'), 'https://example.invalid');
  assert.equal(back.searchParams.get('q'), 'ş'.repeat(200));
  assert.equal(back.searchParams.get('bolum'), 'kara');
  const html = fs.readFileSync(path.join(__dirname, '../olaylar/index.html'), 'utf8');
  assert.match(html, /<input[^>]*id="events-query"[^>]*maxlength="200"/);
});

function setup(url = 'https://example.invalid/olaylar/') {
  const elements = {};
  function el(text = '') {
    return { textContent: text, hidden: false, value: '', listeners: {},
      addEventListener(key, fn) { this.listeners[key] = fn; },
      focus(options) { this.focused = true; this.focusOptions = options; },
      scrollIntoView(options) { this.scrolled = options; }
    };
  }
  ['events-tools', 'events-results', 'events-query', 'events-category', 'events-count', 'events-clear'].forEach(id => { elements[id] = el(); });
  elements['events-category'].value = 'all';
  const rows = [el('Arıburnu çıkarması 25 Nisan 1915'), el('Nusret 8 Mart 1915'), el('Arıburnu tahliyesi 19 Aralık 1915')];
  rows.forEach((row, i) => { row.link = { href: '/olaylar/kayit-' + i + '/' }; row.querySelector = () => row.link; });
  const subgroup = el();
  subgroup.id = "kirte";
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

test('Esc olay aramasını temizlerken bölümü ve dönüş bağlantısını korur', () => {
  const { elements: e, rows, window: w } = setup('https://example.invalid/olaylar/?q=bulunmayan&bolum=kara&ref=koru');
  const input = e['events-query']; input.focus();
  let prevented = 0;
  const escape = { key: 'Escape', preventDefault() { prevented++; } };
  input.listeners.keydown({ ...escape, defaultPrevented: true });
  input.listeners.keydown({ ...escape, ctrlKey: true });
  assert.equal(input.value, 'bulunmayan');
  input.listeners.keydown(escape);
  assert.equal(prevented, 1); assert.equal(input.value, ''); assert.equal(e['events-category'].value, 'kara');
  assert.deepEqual(rows.map(r => r.hidden), [false, true, true]);
  assert.equal(w.location.searchParams.get('q'), null); assert.equal(w.location.searchParams.get('ref'), 'koru');
  assert.equal(new URL(rows[0].link.href, w.location.href).searchParams.get('listeyeDon'), '/olaylar/?bolum=kara#events-tools');
});

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


test('olay araması tarih ve ad kelimelerini sıra bağımsız birleştirir', () => {
  const { elements: e, rows } = setup();
  e['events-query'].value = '  1915   NİSAN ariburnu  ';
  e['events-query'].listeners.input();
  assert.deepEqual(rows.map(row => row.hidden), [false, true, true]);
  e['events-query'].value = 'Arıburnu 1915'; e['events-query'].listeners.input();
  assert.deepEqual(rows.map(row => row.hidden), [false, true, false]);
  e['events-category'].value = 'tahliye'; e['events-category'].listeners.change();
  assert.deepEqual(rows.map(row => row.hidden), [true, true, false]);
  e['events-query'].value = 'Arıburnu olmayan'; e['events-query'].listeners.input();
  assert.ok(rows.every(row => row.hidden));
});


test('gizlenen bölüme bağlantı aramayı temizler ve ilgili ana bölümü gösterir', () => {
  const { elements: e, rows, subgroup, window: w } = setup('https://example.invalid/olaylar/?ref=koru');
  e['events-query'].value = 'Nusret'; e['events-query'].listeners.input();
  assert.ok(e.kara.hidden);
  w.location.hash = '#kirte'; w.listeners.hashchange();
  assert.equal(e['events-query'].value, ''); assert.equal(e['events-category'].value, 'kara');
  assert.equal(subgroup.hidden, false); assert.deepEqual(rows.map(row => row.hidden), [false, true, true]);
  assert.equal(w.location.searchParams.get('q'), null);
  assert.equal(w.location.searchParams.get('bolum'), 'kara');
  assert.equal(w.location.searchParams.get('ref'), 'koru');
  w.location.hash = '#deniz'; w.listeners.hashchange();
  assert.deepEqual(rows.map(row => row.hidden), [true, false, true]);
  w.location.hash = '#%E0%A4%A'; assert.doesNotThrow(() => w.listeners.hashchange());
});


test('aynı bölüm bağlantısı gizli hedefi açar; geçmiş dönüşündeki arama korunur', () => {
  const { elements: e, rows, window: w } = setup('https://example.invalid/olaylar/#deniz');
  e['events-query'].value = 'Arıburnu'; e['events-query'].listeners.input();
  w.listeners.click({ target: { closest: () => ({ getAttribute: () => '#deniz' }) } });
  assert.equal(e['events-query'].value, ''); assert.equal(rows[1].hidden, false);
  w.location = new URL('https://example.invalid/olaylar/?q=Arıburnu#deniz');
  w.listeners.popstate(); w.listeners.hashchange();
  assert.equal(e['events-query'].value, 'Arıburnu');
  assert.deepEqual(rows.map(row => row.hidden), [false, true, false]);
  w.listeners.click({ ctrlKey: true, target: { closest: () => ({ getAttribute: () => '#deniz' }) } });
  assert.equal(e['events-query'].value, 'Arıburnu');
});


test('olay ayrıntı bağlantısı arama ve bölümü liste dönüşüne taşır', () => {
  const { elements: e, rows } = setup();
  e['events-query'].value = 'Arıburnu'; e['events-query'].listeners.input();
  e['events-category'].value = 'kara'; e['events-category'].listeners.change();
  const link = new URL(rows[0].link.href, 'https://example.invalid');
  const back = new URL(link.searchParams.get('listeyeDon'), 'https://example.invalid');
  assert.equal(back.pathname, '/olaylar/'); assert.equal(back.searchParams.get('q'), 'Arıburnu');
  assert.equal(back.searchParams.get('bolum'), 'kara'); assert.equal(back.hash, '#events-tools');
  e['events-clear'].listeners.click();
  assert.equal(new URL(rows[0].link.href, 'https://example.invalid').searchParams.get('listeyeDon'), '/olaylar/#events-tools');
});

test('canlı olay araması ve bölüm değişimi odağı ya da okuma konumunu taşımaz', () => {
  const { elements: e, rows } = setup();
  e['events-query'].focus();
  e['events-query'].value = 'Arıburnu'; e['events-query'].listeners.input();
  e['events-category'].value = 'kara'; e['events-category'].listeners.change();
  assert.deepEqual(rows.map(row => row.hidden), [false, true, true]);
  for (const target of [e['events-results'], e['events-count']]) {
    assert.equal(target.focused, undefined);
    assert.equal(target.scrolled, undefined);
  }
  assert.equal(e['events-query'].focused, true);
});

test('form gönderimi güncel arama sonucuna gider ve sorgu, dönüş ile geçmiş bağlamını korur', () => {
  const { elements: e, rows, window: w, writes } = setup('https://example.invalid/olaylar/?ref=koru#events-tools');
  e['events-query'].value = 'Arıburnu';
  e['events-category'].value = 'kara';
  let prevented = 0;
  e['events-tools'].listeners.submit({ preventDefault() { prevented++; } });
  assert.equal(prevented, 1);
  assert.deepEqual(rows.map(row => row.hidden), [false, true, true]);
  assert.equal(e['events-results'].focused, true);
  assert.equal(e['events-results'].focusOptions.preventScroll, true);
  assert.equal(e['events-results'].scrolled.block, 'start');
  assert.equal(e['events-count'].focused, undefined);
  assert.equal(w.location.searchParams.get('q'), 'Arıburnu');
  assert.equal(w.location.searchParams.get('bolum'), 'kara');
  assert.equal(w.location.searchParams.get('ref'), 'koru');
  assert.equal(w.location.hash, '#events-tools');
  assert.equal(w.history.state.retained, true);
  const beforeRepeat = writes();
  e['events-tools'].listeners.submit({ preventDefault() { prevented++; } });
  assert.equal(writes(), beforeRepeat);
  const destination = new URL(rows[0].link.href, w.location.href);
  const back = new URL(destination.searchParams.get('listeyeDon'), w.location.href);
  assert.equal(back.searchParams.get('q'), 'Arıburnu');
  assert.equal(back.searchParams.get('bolum'), 'kara');
  assert.equal(back.hash, '#events-tools');
});

test('boş sonuç gönderimi açıklamaya odaklanır; temizleme yeniden arama alanını açar', () => {
  const { elements: e, rows } = setup();
  e['events-query'].value = 'yazılım testi eşleşmeyen sorgu';
  e['events-tools'].listeners.submit({ preventDefault() {} });
  assert.ok(rows.every(row => row.hidden));
  assert.equal(e['events-results'].focused, undefined);
  assert.equal(e['events-count'].focused, true);
  assert.equal(e['events-count'].focusOptions.preventScroll, true);
  assert.equal(e['events-count'].scrolled.block, 'start');
  assert.match(e['events-count'].textContent, /Eşleşen olay bulunamadı/);
  e['events-clear'].listeners.click();
  assert.ok(rows.every(row => !row.hidden));
  assert.equal(e['events-query'].focused, true);
  assert.equal(e['events-query'].value, '');
});
