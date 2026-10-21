const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/photo-archive.js'), 'utf8');

test('fotoğraf paylaşımı güvenli yerel bağlantıyı kopyalar ve pano hatasını açıklar', async () => {
  for (const mode of ['success', 'denied', 'unavailable']) {
    const writes = [];
    const ctx = { copyRevision: 0, copy: {}, copyStatus: {}, URL,
      location: { href: 'https://onsekizmart.com/fotograf-arsivi/' },
      permalink: { href: '/fotograf-arsivi/?q=A02360#foto-A02360' },
      navigator: mode === 'unavailable' ? {} : { clipboard: { async writeText(address) { writes.push(address); if (mode === 'denied') throw Error('denied'); } } } };
    vm.createContext(ctx);
    const start = source.indexOf('  async function copyPhotoLink()');
    vm.runInContext(source.slice(start, source.indexOf('  var keyboardHelp', start)), ctx);
    await ctx.copyPhotoLink();
    assert.equal(ctx.copy.disabled, false); assert.equal(ctx.copyStatus.hidden, false);
    assert.match(ctx.copyStatus.textContent, mode === 'success' ? /kopyalandı/ : /Bu fotoğrafa bağlantı/);
    if (mode !== 'unavailable') assert.deepEqual(writes, ['https://onsekizmart.com/fotograf-arsivi/?q=A02360#foto-A02360']);
  }
});

test('bekleyen pano işlemi fotoğraf değişince yeni kayda başarı mesajı yazmaz', async () => {
  let finish;
  const ctx = { copyRevision: 0, copy: {}, copyStatus: {}, URL,
    location: { href: 'https://onsekizmart.com/' }, permalink: { href: '/fotograf-arsivi/?q=A02360#foto-A02360' },
    navigator: { clipboard: { writeText: () => new Promise(resolve => { finish = resolve; }) } } };
  vm.createContext(ctx);
  const start = source.indexOf('  async function copyPhotoLink()');
  vm.runInContext(source.slice(start, source.indexOf('  var keyboardHelp', start)), ctx);
  const pending = ctx.copyPhotoLink(); assert.equal(ctx.copy.disabled, true);
  ctx.copyRevision++; ctx.copyStatus.textContent = ''; ctx.copyStatus.hidden = true; ctx.copy.disabled = false;
  finish(); await pending;
  assert.equal(ctx.copyStatus.textContent, ''); assert.equal(ctx.copyStatus.hidden, true); assert.equal(ctx.copy.disabled, false);
});
test('fotoğraf bağlantısı yalnız mevcut ve görünür kayıt kimliğini açar', () => {
  const visible = { parentElement: { getAttribute: () => 'P00369.014' }, closest: () => null };
  const hidden = { parentElement: { getAttribute: () => 'A02360' }, closest: () => ({ hidden: true }) };
  const bundesarchiv = { parentElement: { getAttribute: () => 'Bild 183-H29994' }, closest: () => null };
  const ctx = { links: [visible, hidden, bundesarchiv] };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function photoFromHash('), source.indexOf('  links.forEach(')), ctx);
  assert.equal(ctx.photoFromHash('#foto-P00369.014'), visible);
  assert.equal(ctx.photoFromHash('#foto-P00369%2E014'), visible);
  assert.equal(ctx.photoFromHash('#foto-Bild%20183-H29994'), bundesarchiv);
  assert.equal(ctx.photoFromHash('#foto-Bild-183-H29994'), bundesarchiv);
  for (const hash of ['#foto-A02360', '#foto-missing', '#foto-%E0%A4', '#foto-', '#gemiler', '#foto-javascript:alert(1)'])
    assert.equal(ctx.photoFromHash(hash), null, hash);
});

test('fotoğraf yüklemesi ve hatası eski görüntüyü yeni künyeyle göstermez', () => {
  const handlers = {};
  const image = { hidden: false, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(k, fn) { handlers[k] = fn; } };
  const loading = { hidden: true }, error = { hidden: true };
  let retryClick, focused = 0;
  const retry = { hidden: true, addEventListener(type, fn) { retryClick = fn; } };
  image.removeAttribute = () => {};
  const link = { href: '/images/test.jpg', parentElement: { getAttribute: () => 'TEST', querySelector: () => null }, querySelector: () => ({ alt: 'Test fotoğrafı' }) };
  const related = ['/olaylar/test/', '/komutanlar/test/', '/donanma/', 'https://www.awm.gov.au/collection/test', '/kaynakca/', '/?mevki=test#harita'].map(href => ({ href }));
  const ctx = { image, loading, error, retry, close: { focus() { focused++; } }, activeLinks: [link], URL, location: { href: 'https://onsekizmart.com/', origin: 'https://onsekizmart.com' },
    heading: {}, permalink: {}, fileLink: { setAttribute(key, value) { this[key] = value; } }, copy: {}, copyRevision: 0, copyStatus: {}, dialog: {}, caption: { replaceChildren() {}, querySelectorAll: selector => selector === 'a[href]' ? related : [] }, controls: {}, keyboardHelp: {}, status: {} };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function photoReturnHref('), source.indexOf('  close.addEventListener(')), ctx);
  assert.equal(ctx.show(0), true);
  assert.equal(ctx.fileLink.href, '/images/test.jpg');
  assert.match(ctx.fileLink['aria-label'], /TEST/);
  const other = { ...link, href: '/images/other.jpg', parentElement: { getAttribute: () => 'OTHER', querySelector: () => null } };
  ctx.activeLinks.push(other); assert.equal(ctx.show(1), true);
  assert.equal(ctx.fileLink.href, '/images/other.jpg'); assert.match(ctx.fileLink['aria-label'], /OTHER/);
  assert.equal(ctx.show(0), true);
  for (const item of related.slice(0, 3)) assert.equal(new URL(item.href, ctx.location.href).searchParams.get('fotografaDon'), '/fotograf-arsivi/?q=TEST#foto-TEST');
  assert.equal(related[3].href, 'https://www.awm.gov.au/collection/test');
  assert.equal(related[4].href, '/kaynakca/'); assert.equal(related[5].href, '/?mevki=test#harita');
  assert.equal(image.hidden, true); assert.equal(loading.hidden, false); assert.equal(image.attrs['aria-busy'], 'true');
  handlers.load();
  assert.equal(image.hidden, false); assert.equal(loading.hidden, true); assert.equal(image.attrs['aria-busy'], 'false');
  ctx.show(0); handlers.error();
  assert.equal(image.hidden, true); assert.equal(error.hidden, false); assert.equal(loading.hidden, true);
  assert.equal(retry.hidden, false);
  retryClick();
  assert.equal(focused, 1);
  assert.equal(retry.hidden, true);
  assert.equal(error.hidden, true); assert.equal(loading.hidden, false);
});

test('fotoğraf değişince kaldırılan künye bağlantısı veya gizlenen tekrar düğmesi odağı kaybetmez', () => {
  for (const where of ['caption', 'retry', 'permalink', 'fileLink', 'copy', 'next', 'close']) {
    for (const delta of [-1, 1]) {
      let focused = '', selected;
      const retry = {};
      const permalink = {}, fileLink = {}, copy = {};
      const active = ({retry, permalink, fileLink, copy})[where] || {};
      const ctx = { caption: { contains: () => where === 'caption' }, document: { activeElement: active }, retry, permalink, fileLink, copy,
        previous: { focus() { focused = 'previous'; } }, next: { focus() { focused = 'next'; } },
        index: 0, activeLinks: [{}, {}], show(i) { selected = i; return true; } };
      vm.createContext(ctx);
      const start = source.indexOf('  function step(');
      vm.runInContext(source.slice(start, source.indexOf("  image.addEventListener('load'", start)), ctx);
      ctx.step(delta);
      assert.equal(selected, 1);
      assert.equal(focused, ['caption', 'retry', 'permalink', 'fileLink', 'copy'].includes(where) ? (delta < 0 ? 'previous' : 'next') : '');
    }
  }
});

test('gizlenen ve bulunamayan fotoğraf bağlantıları farklı açıklama ve güvenli arşiv yolu üretir', () => {
  const ctx = { links: [{ parentElement: { getAttribute: () => 'A02360' } }] };
  vm.createContext(ctx);
  const start = source.indexOf('  function photoLinkMessage(');
  vm.runInContext(source.slice(start, source.indexOf('  function updatePhotoLinkNotice(', start)), ctx);
  const known = ctx.photoLinkMessage('#foto-A02360');
  assert.match(known.text, /gizlenmiş olabilir/);
  assert.equal(known.href, '/fotograf-arsivi/?q=A02360#foto-A02360');
  for (const hash of ['#foto-missing', '#foto-%E0%A4', '#foto-', '#foto-javascript:alert(1)']) {
    const result = ctx.photoLinkMessage(hash);
    assert.match(result.text, /bulunamadı/);
    assert.equal(result.href, '/fotograf-arsivi/#photo-search');
  }
  assert.equal(ctx.photoLinkMessage('#olaylar'), null);
});

test('fotoğrafın görünürlüğü değişince uyarı güncellenir, fotoğraf açılmaz ve sayfa kaymaz', () => {
  let visible = null, scrolled = 0, opened = 0;
  const notice = { hidden: false, replaceChildren() {}, appendChild() {}, scrollIntoView() { scrolled++; } };
  const ctx = { location: { hash: '#foto-A02360' }, linkNotice: notice,
    photoFromHash: () => visible, photoLinkMessage: () => ({ text: 'Gizli', label: 'Bul', href: '/fotograf-arsivi/' }),
    document: { createTextNode: text => text }, el: () => ({}), openPhoto() { opened++; } };
  vm.createContext(ctx);
  const start = source.indexOf('  function updatePhotoLinkNotice(');
  vm.runInContext(source.slice(start, source.indexOf('  var searchForm =', start)), ctx);
  ctx.updatePhotoLinkNotice(false); assert.equal(notice.hidden, false);
  visible = {}; ctx.updatePhotoLinkNotice(false); assert.equal(notice.hidden, true);
  assert.equal(scrolled, 0); assert.equal(opened, 0);
  ctx.openLinkedPhoto(); assert.equal(opened, 1);
});

test('arama alanının Esc işlemi fotoğraf bağlantısı uyarısını kaydırmadan günceller', () => {
  const handlers = {}; let updates = [];
  const ctx = { document: { getElementById: () => ({ addEventListener(type, fn) { handlers[type] = fn; } }) },
    window: { addEventListener() {} }, updatePhotoLinkNotice(scroll) { updates.push(scroll); }, openLinkedPhoto() {} };
  vm.createContext(ctx);
  const start = source.indexOf('  var searchForm =');
  vm.runInContext(source.slice(start, source.lastIndexOf('})();')), ctx);
  handlers.keydown({ key: 'a' }); assert.deepEqual(updates, []);
  handlers.keydown({ key: 'Escape' }); assert.deepEqual(updates, [false]);
});

test('fotoğraf ok tuşları tarayıcı kısayollarını veya düzenleme alanlarını engellemez', () => {
  let handler, steps = [], prevented = 0;
  const ctx = { dialog: { addEventListener(type, fn) { handler = fn; } }, activeLinks: [{}, {}], step(delta) { steps.push(delta); } };
  vm.createContext(ctx);
  const start = source.indexOf("  dialog.addEventListener('keydown'");
  vm.runInContext(source.slice(start, source.indexOf("  dialog.addEventListener('close'", start)), ctx);
  const base = { key: 'ArrowLeft', preventDefault() { prevented++; }, target: { closest: () => null } };
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'defaultPrevented', 'isComposing']) handler({ ...base, [modifier]: true });
  handler({ ...base, target: { closest: () => ({}) } });
  assert.equal(prevented, 0); assert.deepEqual(steps, []);
  handler(base); handler({ ...base, key: 'ArrowRight' });
  assert.deepEqual(steps, [-1, 1]); assert.equal(prevented, 2);
  ctx.activeLinks = [{}]; handler(base); assert.equal(prevented, 2);
});
