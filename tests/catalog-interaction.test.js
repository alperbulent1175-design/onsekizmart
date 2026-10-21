const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const page = fs.readFileSync(path.join(__dirname, '../kaynakca/index.html'), 'utf8');

test('katalogdan aramaya dönüş süzgeci korur ve yeni sekme kısayollarını engellemez', () => {
  let click, prevented = 0, focused = 0, scrolled = 0, added;
  const input = { value: 'gallipoli', focus() { focused++; } };
  const form = { scrollIntoView() { scrolled++; } };
  const ctx = { document: { createElement: () => ({ addEventListener(type, fn) { click = fn; } }) } };
  vm.createContext(ctx);
  const start = page.indexOf('  function addCatalogSearchReturns(');
  vm.runInContext(page.slice(start, page.indexOf('  var form =', start)), ctx);
  ctx.addCatalogSearchReturns([{ el: { appendChild(link) { added = link; } } }], form, input);
  assert.equal(added.href, '#katalog-filtre');
  const event = { button: 0, preventDefault() { prevented++; } };
  for (const key of ['defaultPrevented', 'ctrlKey', 'metaKey', 'shiftKey', 'altKey']) click({ ...event, [key]: true });
  click({ ...event, button: 1 });
  assert.equal(focused + scrolled + prevented, 0);
  click(event); assert.equal(focused, 1); assert.equal(scrolled, 1); assert.equal(prevented, 1);
  assert.equal(input.value, 'gallipoli');
});

test('katalogda eşleşmeyen bölümün başlığı ve açıklaması gizlenir, kayıt dönünce açılır', () => {
  const heading = { tagName: 'H2' };
  const intro = { tagName: 'DIV', classList: { contains: value => value === 'prose' }, previousElementSibling: heading };
  const row = { tagName: 'LI', hidden: true };
  const list = { children: [row], previousElementSibling: intro };
  const unrelated = { tagName: 'P' };
  const other = { children: [{ tagName: 'LI', hidden: false }], previousElementSibling: unrelated };
  const ctx = { document: { getElementById: id => id === 'katalog' ? list : other } };
  vm.createContext(ctx);
  const start = page.indexOf('  function updateCatalogSections()');
  vm.runInContext(page.slice(start, page.indexOf('  function linkedRecord()', start)), ctx);
  ctx.updateCatalogSections();
  assert.equal(list.hidden, true); assert.equal(heading.hidden, true); assert.equal(intro.hidden, true);
  assert.equal(other.hidden, false); assert.equal(unrelated.hidden, undefined);
  row.hidden = false; ctx.updateCatalogSections();
  assert.equal(list.hidden, false); assert.equal(heading.hidden, false); assert.equal(intro.hidden, false);
});

test('katalog kayıt kimliği, kurum künyesi ve metni birlikte aranır', () => {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(page.slice(page.indexOf('  function foldCatalog'), page.indexOf('  var form =')), ctx);
  const li = { id: 'AWM-001', tagName: 'LI', textContent: 'Gallipoli Australian War Memorial',
    getAttribute: () => 'metadata_kontrol_edildi',
    getElementsByTagName: () => [{}, { textContent: 'Australian War Memorial · Dijital seri · Üst veri kontrol edildi' }] };
  const [item] = ctx.readCards([{ children: [li] }]);
  assert.equal(ctx.catalogMatch(item, ctx.foldCatalog('awm-001 gallipoli'), '', '', ''), true);
  assert.equal(ctx.catalogMatch(item, ctx.foldCatalog('AWM-002'), '', '', ''), false);
  assert.equal(item.status, 'metadata_kontrol_edildi');
  assert.equal(item.el, li);
});

test('katalog Enter ile ilk görünür kayda, boş sonuçta sayaca odaklanır; Esc süzgeçleri korur', () => {
  let focused;
  function node(value = '') {
    return { value, handlers: {}, addEventListener(type, fn) { this.handlers[type] = fn; },
      setAttribute(key, value) { this[key] = value; }, focus() { focused = this; }, scrollIntoView() { this.scrolled = true; } };
  }
  const firstLink = node(), secondLink = node();
  const items = [
    { text: 'australian gallipoli', institution: 'AWM', kind: 'Fotoğraf', status: 'bulundu', el: node() },
    { text: 'gallipoli rapor', institution: 'AWM', kind: 'Rapor', status: 'bulundu', el: node() }
  ];
  items[0].el.querySelector = () => firstLink; items[1].el.querySelector = () => secondLink;
  const q = node(), inst = node(), kind = node(), status = node(), count = node(), form = node(), clear = node();
  form.hidden = true;
  const window = { location: { href: 'https://atlas.invalid/kaynakca/?q=rapor&ref=koru#AWM-001' }, handlers: {},
    addEventListener(type, fn) { this.handlers[type] = fn; }, history: { state: { retained: true }, replaceState(state, title, href) { window.location.href = href; } } };
  items[0].el.id = 'AWM-001'; items[1].el.id = 'AWM-002';
  const notice = node(), reveal = node();
  let initialScrolls = 0;
  notice.scrollIntoView = () => { assert.equal(form.hidden, false); initialScrolls++; };
  const elements = { 'katalog-temizle': clear, 'katalog-baglanti-uyarisi': notice, 'katalog-kaydi-goster': reveal };
  const ctx = { items, q, inst, kind, status, count, form, window, URL, document: { getElementById: id => elements[id] } };
  vm.createContext(ctx);
  vm.runInContext(page.slice(page.indexOf('  function foldCatalog'), page.indexOf('  function readCards')), ctx);
  const start = page.indexOf('  function apply()');
  vm.runInContext(page.slice(start, page.indexOf('})();', start)), ctx);
  assert.equal(form.hidden, false);
  assert.equal(initialScrolls, 1);
  const submit = () => form.handlers.submit({ preventDefault() {} });
  q.value = 'RAPOR gallipoli'; kind.value = 'Rapor'; inst.value = 'AWM'; status.value = 'bulundu';
  submit(); assert.equal(focused, secondLink); assert.equal(items[0].el.hidden, true); assert.ok(items[1].el.scrolled);
  let address = new URL(window.location.href);
  assert.equal(address.searchParams.get('q'), 'RAPOR gallipoli'); assert.equal(address.searchParams.get('kurum'), 'AWM');
  assert.equal(address.searchParams.get('ref'), 'koru'); assert.equal(address.hash, '#AWM-001');
  q.value = 'bulunmayan'; submit(); assert.equal(focused, count); assert.match(count.textContent, /kayıt yok/);
  q.focus(); let prevented = 0;
  const escape = { key: 'Escape', preventDefault() { prevented++; } };
  q.handlers.keydown({ ...escape, isComposing: true }); assert.equal(q.value, 'bulunmayan');
  q.handlers.keydown(escape); assert.equal(q.value, ''); assert.equal(kind.value, 'Rapor');
  assert.equal(inst.value, 'AWM'); assert.equal(status.value, 'bulundu'); assert.equal(focused, q);
  assert.equal(items[0].el.hidden, true); assert.equal(items[1].el.hidden, false); assert.equal(prevented, 1);
  clear.handlers.click(); assert.equal(kind.value + inst.value + status.value, '');
  assert.ok(items.every(item => !item.el.hidden)); assert.equal(focused, q);
  address = new URL(window.location.href);
  for (const key of ['q', 'kurum', 'tur', 'durum']) assert.equal(address.searchParams.has(key), false);
  assert.equal(address.searchParams.get('ref'), 'koru');
  window.location.href = 'https://atlas.invalid/kaynakca/?q=rapor&kurum=AWM&tur=Rapor&durum=bulundu';
  window.handlers.popstate(); assert.equal(q.value, 'rapor'); assert.equal(kind.value, 'Rapor');
  assert.equal(items[0].el.hidden, true); assert.equal(items[1].el.hidden, false);
  q.value = 'stale'; window.handlers.pageshow(); assert.equal(q.value, 'rapor');
  window.location.href = 'https://atlas.invalid/kaynakca/?q=a&q=b&kurum=bilinmeyen&tur=Rapor&tur=Fotoğraf&durum=uydurma';
  window.handlers.popstate(); assert.equal(q.value + inst.value + kind.value + status.value, '');
  window.location.href = 'https://atlas.invalid/kaynakca/?q=' + 'a'.repeat(201);
  window.handlers.pageshow(); assert.equal(q.value.length, 200);
  window.location.href = 'https://atlas.invalid/kaynakca/?q=rapor#AWM-001';
  window.handlers.popstate(); window.handlers.hashchange();
  assert.equal(notice.hidden, false); assert.equal(q.value, 'rapor');
  reveal.handlers.click();
  assert.equal(q.value, ''); assert.equal(notice.hidden, true); assert.equal(focused, items[0].el);
  assert.equal(items[0].el.tabindex, '-1'); assert.equal(items[0].el.hidden, false);
  assert.equal(new URL(window.location.href).hash, '#AWM-001');
  window.location.href = 'https://atlas.invalid/kaynakca/?q=rapor#%E0%A4';
  assert.doesNotThrow(() => window.handlers.hashchange()); assert.equal(notice.hidden, true);
  window.history.replaceState = () => { throw Error('restricted'); };
  q.value = 'rapor'; assert.doesNotThrow(() => q.handlers.input()); assert.equal(items[1].el.hidden, false);
});

test('kaynakça ortak menüyü kullanır; JavaScript olmadan katalog görünür, arama gizlidir', () => {
  assert.match(page, /<form[^>]*id="katalog-filtre"[^>]*hidden/);
  assert.match(page, /<button[^>]*id="nav-toggle"[^>]*hidden/);
  assert.match(page, /<script src="\/js\/navigation\.js\?v=[^"]+" defer><\/script>/);
  assert.doesNotMatch(page, /var b = document\.getElementById\("nav-toggle"\)/);
  assert.match(page, /<noscript>[^]*Bütün kayıtları aşağıdaki listeden okuyabilirsiniz/);
  assert.doesNotMatch(page, /<ul[^>]*id="katalog(?:-devam)?"[^>]*hidden/);
});
