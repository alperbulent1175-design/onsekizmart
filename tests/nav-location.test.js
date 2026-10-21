const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/navigation.js'), 'utf8');
const start = source.indexOf('  function markCurrentNavigation(');
const script = source.slice(start, source.indexOf('  markCurrentNavigation(document', start));
function visit(page) {
  const links = ['/#harita', '/olaylar/', '/olaylar/#kara', '/komutanlar/', '/fotograf-arsivi/',
    'https://other.invalid/olaylar/', 'javascript:alert(1)'].map(href => ({ href, attributes: {}, setAttribute(key, value) { this.attributes[key] = value; } }));
  const ctx = { URL, window: { location: { href: 'https://onsekizmart.com' + page } } };
  vm.createContext(ctx); vm.runInContext(script, ctx);
  ctx.markCurrentNavigation({ querySelectorAll: () => links });
  return links;
}
test('menü dizinde sayfayı, ayrıntıda ait olduğu bölümü işaretler', () => {
  let links = visit('/olaylar/?q=Ariburnu#kara');
  assert.equal(links[1].attributes['aria-current'], 'page');
  assert.equal(links.filter(l => l.attributes['aria-current']).length, 1);
  links = visit('/olaylar/ariburnu-genel-taarruzu/?ref=test');
  assert.equal(links[1].attributes['aria-current'], 'location');
  links = visit('/komutanlar/mustafa-kemal/');
  assert.equal(links[3].attributes['aria-current'], 'location');
  assert.equal(visit('/fotograf-arsivi/')[4].attributes['aria-current'], 'page');
});
test('menü işareti benzer adlı yolu, saf çapayı veya dış hedefi seçmez', () => {
  for (const page of ['/', '/olaylar-baska/', '/bilinmeyen/']) {
    assert.equal(visit(page).filter(l => l.attributes['aria-current']).length, 0);
  }
});

test('aynı adrese giden Site ve alt sayfa arasında gerçek sayfa bağlantısı tek işaret alır', () => {
  const links = ['/kaynakca/', '/kaynakca/', '/sozluk/'].map(href => ({ href, attributes: { 'aria-current': 'page' },
    removeAttribute(key) { delete this.attributes[key]; }, setAttribute(key, value) { this.attributes[key] = value; } }));
  const ctx = { URL, window: { location: { href: 'https://onsekizmart.com/kaynakca/' } } };
  vm.createContext(ctx); vm.runInContext(script, ctx);
  ctx.markCurrentNavigation({ querySelectorAll: () => links });
  assert.equal(links[0].attributes['aria-current'], undefined);
  assert.equal(links[1].attributes['aria-current'], 'page');
  assert.equal(links[2].attributes['aria-current'], undefined);
  assert.equal(links.filter(link => link.attributes['aria-current']).length, 1);
});
