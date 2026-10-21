const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/commanders-search.js'), 'utf8');

test('Esc komutan aramasını temizlerken tarafı, paylaşımı ve odağı korur', () => {
  const ctx = setup('?q=bulunmayan&taraf=itilaf&ref=koru');
  ctx.query.focus();
  let prevented = 0;
  const escape = { key: 'Escape', preventDefault() { prevented++; } };
  ctx.query.handlers.keydown({ ...escape, isComposing: true });
  assert.equal(ctx.query.value, 'bulunmayan');
  ctx.query.handlers.keydown(escape);
  assert.equal(ctx.query.value, ''); assert.equal(ctx.side.value, 'itilaf');
  assert.equal(ctx.document.activeElement, ctx.query); assert.equal(prevented, 1);
  assert.deepEqual(ctx.entries.map(e => e.row.hidden), [true, true, false]);
  assert.equal(new URL(ctx.window.location.href).searchParams.get('ref'), 'koru');
  assert.equal(ctx.elements['commanders-search-link'].href, '/komutanlar/?taraf=itilaf#commanders-search');
  ctx.query.handlers.keydown(escape); assert.equal(prevented, 1);
});

function setup(search = '', hash = '') {
  function node(props = {}) {
    return Object.assign({ hidden: false, value: '', handlers: {},
      addEventListener(key, fn) { this.handlers[key] = fn; },
      getAttribute(key) { return this[key]; },
      focus() { document.activeElement = this; },
      scrollIntoView() { this.scrolled = true; } }, props);
  }
  const entries = [
    { id: 'osmanli', name: 'Cevat Bey Çobanlı Müstahkem Mevkii' },
    { id: 'osmanli', name: 'Mustafa Kemal 19. Tümen' },
    { id: 'itilaf', name: 'Émile Guépratte Fransız deniz tümeni' }
  ].map((record, i) => ({ ...record, link: node({ href: '/komutanlar/test-' + i + '/' }), row: node({ textContent: record.name }) }));
  entries.forEach(entry => { entry.row.querySelector = () => entry.link; });
  const groups = {};
  for (const id of ['osmanli', 'itilaf']) {
    const rows = entries.filter(entry => entry.id === id).map(entry => entry.row);
    const list = node({ previousElementSibling: node({ tagName: 'H3' }), querySelectorAll: () => rows });
    groups[id] = node({ list, querySelectorAll: () => [list] });
  }
  const elements = { ...groups };
  for (const id of ['commanders-search', 'commanders-query', 'commanders-side', 'commanders-clear', 'commanders-results', 'commanders-search-link']) elements[id] = node();
  const document = { activeElement: null, getElementById: id => elements[id] };
  const location = { origin: 'https://onsekizmart.com', href: 'https://onsekizmart.com/komutanlar/' + search + hash, search, hash };
  const window = node({ location, history: { state: null, replaceState(state, title, value) {
    location.href = value; const u = new URL(value); location.search = u.search; location.hash = u.hash;
  } } });
  vm.runInNewContext(source, { document, window, URL, URLSearchParams });
  return { entries, elements, document, window, groups,
    query: elements['commanders-query'], side: elements['commanders-side'], status: elements['commanders-results'],
    edit(value, side) { elements['commanders-query'].value = value; if (side) elements['commanders-side'].value = side; elements['commanders-query'].handlers.input(); },
    submit() { elements['commanders-search'].handlers.submit({ preventDefault() {} }); } };
}

test('komutan araması Türkçe ve aksanlı adları, görevleri ve çok sözcüğü bulur', () => {
  const ctx = setup();
  assert.match(ctx.status.textContent, /3 \/ 3/);
  ctx.edit('COBANLI mevkii');
  assert.deepEqual(ctx.entries.map(entry => entry.row.hidden), [false, true, true]);
  ctx.submit(); assert.equal(ctx.document.activeElement, ctx.entries[0].link); assert.ok(ctx.entries[0].row.scrolled);
  ctx.edit('emile guepratte');
  assert.deepEqual(ctx.entries.map(entry => entry.row.hidden), [true, true, false]);
  assert.equal(ctx.groups.osmanli.hidden, true);
  assert.equal(ctx.groups.osmanli.list.hidden, true);
  assert.equal(ctx.groups.osmanli.list.previousElementSibling.hidden, true);
});

test('taraf süzgeci, boş sonuç, temizleme ve paylaşılabilir arama adresi tutarlı kalır', () => {
  const ctx = setup('?q=deniz&taraf=itilaf');
  assert.equal(ctx.side.value, 'itilaf'); assert.match(ctx.status.textContent, /1 \/ 3/);
  ctx.edit('Cevat', 'itilaf'); ctx.submit();
  assert.equal(ctx.document.activeElement, ctx.status); assert.ok(ctx.status.scrolled);
  assert.match(ctx.status.textContent, /Eşleşen komutan bulunamadı/);
  assert.equal(ctx.elements['commanders-search-link'].href, '/komutanlar/?q=Cevat&taraf=itilaf#commanders-search');
  assert.equal(new URL(ctx.entries[0].link.href, ctx.window.location.href).searchParams.get('komutanlaraDon'), '/komutanlar/?q=Cevat&taraf=itilaf#commanders-search');
  assert.match(ctx.window.location.search, /q=Cevat/);
  ctx.elements['commanders-clear'].handlers.click();
  assert.equal(ctx.query.value, ''); assert.equal(ctx.side.value, 'all');
  assert.ok(ctx.entries.every(entry => !entry.row.hidden)); assert.ok(ctx.elements['commanders-clear'].disabled);
  assert.equal(ctx.document.activeElement, ctx.query);
});

test('gizli taraf bölümüne normal bağlantı açılır; değiştirici tuşlu tıklama süzgeci bozmaz', () => {
  const ctx = setup('?q=Cevat');
  const event = { target: { closest: () => ({ getAttribute: () => '#itilaf' }) } };
  ctx.window.handlers.click({ ...event, ctrlKey: true });
  assert.equal(ctx.query.value, 'Cevat');
  ctx.window.handlers.click(event);
  assert.equal(ctx.query.value, ''); assert.equal(ctx.side.value, 'itilaf'); assert.equal(ctx.groups.itilaf.hidden, false);
  assert.ok(ctx.groups.itilaf.scrolled);
  ctx.window.location.hash = '#%E0%A4%A'; assert.doesNotThrow(() => ctx.window.handlers.hashchange());
});

test('JavaScript olmadan 25 komutan bağlantısı ve taraf başlıkları görünür kalır', () => {
  const html = fs.readFileSync(path.join(__dirname, '../komutanlar/index.html'), 'utf8');
  assert.equal([...html.matchAll(/<li><a href="\/komutanlar\/[^/]+\/"/g)].length, 25);
  assert.match(html, /<form[^>]*id="commanders-search"[^>]*hidden/);
  assert.doesNotMatch(html, /<section id="(?:osmanli|itilaf)"[^>]*hidden/);
  assert.doesNotMatch(html, /<li[^>]*hidden/);
});

test('tarayıcı geçmişi değişince arama ve taraf URL ile yeniden eşleşir', () => {
  const ctx = setup('?q=Cevat');
  ctx.edit('Mustafa', 'osmanli');
  ctx.window.location.search = '?q=emile&taraf=itilaf';
  ctx.window.location.hash = '#commanders-search';
  ctx.window.handlers.popstate();
  assert.equal(ctx.query.value, 'emile'); assert.equal(ctx.side.value, 'itilaf');
  assert.deepEqual(ctx.entries.map(entry => entry.row.hidden), [true, true, false]);
  assert.equal(ctx.document.activeElement, ctx.query);
});

test('geçmişte gizli bölüm hash değeri aramayı temizlemez; önbellekten dönüş URL ile eşleşir', () => {
  const ctx = setup('?q=Cevat');
  ctx.window.location.search = '?q=Cevat&taraf=osmanli';
  ctx.window.location.hash = '#itilaf';
  ctx.window.location.href = 'https://onsekizmart.com/komutanlar/?q=Cevat&taraf=osmanli#itilaf';
  ctx.window.handlers.popstate(); ctx.window.handlers.hashchange();
  assert.equal(ctx.query.value, 'Cevat'); assert.equal(ctx.side.value, 'osmanli');
  assert.equal(ctx.groups.itilaf.hidden, true);
  assert.equal(ctx.document.activeElement, null);
  ctx.query.value = 'eski form değeri'; ctx.side.value = 'itilaf';
  ctx.window.handlers.pageshow();
  assert.equal(ctx.query.value, 'Cevat'); assert.equal(ctx.side.value, 'osmanli');
  assert.deepEqual(ctx.entries.map(e => e.row.hidden), [false, true, true]);
});
