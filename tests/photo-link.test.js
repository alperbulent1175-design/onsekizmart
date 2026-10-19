const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/photo-archive.js'), 'utf8');
test('fotoğraf bağlantısı yalnız mevcut ve görünür kayıt kimliğini açar', () => {
  const visible = { parentElement: { getAttribute: () => 'P00369.014' }, closest: () => null };
  const hidden = { parentElement: { getAttribute: () => 'A02360' }, closest: () => ({ hidden: true }) };
  const ctx = { links: [visible, hidden] };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function photoFromHash('), source.indexOf('  links.forEach(')), ctx);
  assert.equal(ctx.photoFromHash('#foto-P00369.014'), visible);
  assert.equal(ctx.photoFromHash('#foto-P00369%2E014'), visible);
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
  const ctx = { image, loading, error, retry, close: { focus() { focused++; } }, activeLinks: [link], URL, location: { href: 'https://onsekizmart.com/', origin: 'https://onsekizmart.com' },
    heading: {}, permalink: {}, dialog: {}, caption: { replaceChildren() {}, querySelectorAll: () => [] }, controls: {}, status: {} };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function show('), source.indexOf('  close.addEventListener(')), ctx);
  assert.equal(ctx.show(0), true);
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
  for (const where of ['caption', 'retry', 'next', 'close']) {
    for (const delta of [-1, 1]) {
      let focused = '', selected;
      const retry = {};
      const active = where === 'retry' ? retry : {};
      const ctx = { caption: { contains: () => where === 'caption' }, document: { activeElement: active }, retry,
        previous: { focus() { focused = 'previous'; } }, next: { focus() { focused = 'next'; } },
        index: 0, activeLinks: [{}, {}], show(i) { selected = i; return true; } };
      vm.createContext(ctx);
      const start = source.indexOf('  function step(');
      vm.runInContext(source.slice(start, source.indexOf("  image.addEventListener('load'", start)), ctx);
      ctx.step(delta);
      assert.equal(selected, 1);
      assert.equal(focused, ['caption', 'retry'].includes(where) ? (delta < 0 ? 'previous' : 'next') : '');
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

test('fotoğraf ok tuşları tarayıcı kısayollarını veya düzenleme alanlarını engellemez', () => {
  let handler, steps = [], prevented = 0;
  const ctx = { dialog: { addEventListener(type, fn) { handler = fn; } }, activeLinks: [{}, {}], step(delta) { steps.push(delta); } };
  vm.createContext(ctx);
  const start = source.indexOf("  dialog.addEventListener('keydown'");
  vm.runInContext(source.slice(start, source.indexOf("  dialog.addEventListener('close'", start)), ctx);
  const base = { key: 'ArrowLeft', preventDefault() { prevented++; }, target: { closest: () => null } };
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'defaultPrevented']) handler({ ...base, [modifier]: true });
  handler({ ...base, target: { closest: () => ({}) } });
  assert.equal(prevented, 0); assert.deepEqual(steps, []);
  handler(base); handler({ ...base, key: 'ArrowRight' });
  assert.deepEqual(steps, [-1, 1]); assert.equal(prevented, 2);
  ctx.activeLinks = [{}]; handler(base); assert.equal(prevented, 2);
});
