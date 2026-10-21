const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const nav = fs.readFileSync(path.join(root, 'js/navigation.js'), 'utf8');
const photos = fs.readFileSync(path.join(root, 'js/photo-archive.js'), 'utf8');
function visit(back, duplicate = false) {
  const main = { firstChild: {}, inserted: [], insertBefore(node) { this.inserted.push(node); } };
  const next = { href: '/olaylar/next/' };
  const commander = { href: '/komutanlar/test/' };
  const page = new URL('https://onsekizmart.com/olaylar/test/');
  page.searchParams.set('fotografaDon', back);
  if (duplicate) page.searchParams.append('fotografaDon', back);
  vm.runInNewContext(nav, { URL, URLSearchParams, window: { location: page }, document: {
    querySelector: () => main, querySelectorAll: selector => selector === '.page-main a[href]' ? [next] : selector === '.page-main a[href^="/komutanlar/"]' ? [commander] : [], getElementById: () => null,
    createElement: () => ({ children: [], appendChild(node) { this.children.push(node); } })
  } });
  main.inserted.next = next;
  main.inserted.commander = commander;
  return main.inserted;
}
test('fotoğraftan ilgili sayfaya dönüş aynı fotoğrafı, sorguyu ve görsel türünü korur', () => {
  const back = '/fotograf-arsivi/?q=Ocean&tur=gemiler#foto-A02360';
  const inserted = visit(back);
  assert.equal(inserted.length, 1); assert.equal(inserted[0].id, 'photo-context-return');
  assert.equal(inserted[0].children[0].href, back);
  assert.equal(inserted[0].children[0].textContent, 'Fotoğrafa dön');
  assert.equal(new URL(inserted.next.href, 'https://onsekizmart.com').searchParams.get('fotografaDon'), back);
  const commander = new URL(inserted.commander.href, 'https://onsekizmart.com');
  assert.equal(commander.searchParams.get('fotografaDon'), back);
  const eventBack = new URL(commander.searchParams.get('olayaDon'), 'https://onsekizmart.com');
  assert.equal(eventBack.pathname, '/olaylar/test/'); assert.equal(eventBack.searchParams.get('fotografaDon'), back);
  assert.equal(visit('/fotograf-arsivi/#foto-Bild%20183-H29994').length, 1);
});
test('fotoğraf dönüşü dış adres, tekrar, bilinmeyen tür ve bozuk kimliği kabul etmez', () => {
  for (const back of ['//evil.invalid/', 'https://evil.invalid/fotograf-arsivi/#foto-A',
    '/fotograf-arsivi/baska/#foto-A', '/fotograf-arsivi/?q=a&q=b#foto-A',
    '/fotograf-arsivi/?tur=bilinmeyen#foto-A', '/fotograf-arsivi/?redirect=evil#foto-A',
    '/fotograf-arsivi/#foto-%ZZ', '/fotograf-arsivi/#foto-%3Cscript%3E',
    '/fotograf-arsivi/?q=' + 'a'.repeat(201) + '#foto-A']) assert.equal(visit(back).length, 0, back);
  assert.equal(visit('/fotograf-arsivi/#foto-A', true).length, 0);
});
test('görüntüleyici yalnız arşiv sorgusunu taşır; olay sayfasından fotoğraf kimliğine döner', () => {
  const ctx = { URL, location: new URL('https://onsekizmart.com/fotograf-arsivi/?q=Ocean&tur=gemiler&ref=atlas') };
  vm.createContext(ctx);
  const start = photos.indexOf('  function photoReturnHref(');
  vm.runInContext(photos.slice(start, photos.indexOf('  function show(', start)), ctx);
  assert.equal(ctx.photoReturnHref('A02360'), '/fotograf-arsivi/?q=Ocean&tur=gemiler#foto-A02360');
  ctx.location = new URL('https://onsekizmart.com/olaylar/test/');
  assert.equal(ctx.photoReturnHref('Bild 183-H29994'), '/fotograf-arsivi/?q=Bild+183-H29994#foto-Bild-183-H29994');
  assert.equal(ctx.photoReturnHref('<img>'), '');
});
