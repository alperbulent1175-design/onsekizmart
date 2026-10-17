const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function setup(href = 'https://onsekizmart.com/fotograf-arsivi/') {
  const handlers = {};
  const input = { value: '', addEventListener(type, fn) { handlers[type] = fn; } };
  const select = { value: '', addEventListener(type, fn) { handlers[type] = fn; } };
  const form = { hidden: true, querySelector(s) { return s === 'input' ? input : select; }, addEventListener(type, fn) { handlers[type] = fn; } };
  const status = {}, empty = {};
  const sections = [['gemiler', 'Ocean Süveyş A02360'], ['komutanlar', 'Mustafa Kemal A05319']].map(([category, text]) => {
    const card = { textContent: text, hidden: false };
    return { card, getAttribute() { return category; }, querySelectorAll() { return [card]; } };
  });
  const document = { getElementById(id) { return { 'photo-search': form, 'photo-results': status, 'photo-empty': empty }[id]; }, querySelectorAll() { return sections; } };
  const window = { location: { href }, history: { state: { preserve: true }, replaceState(state, title, url) { window.location.href = url; } }, addEventListener(type, fn) { handlers[type] = fn; } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/photo-search.js'), 'utf8'), { document, window, URL });
  return { input, select, form, status, empty, sections, handlers, window };
}
test('Türkçe arama ve kategori birlikte uygulanır; boş sonuç açıkça bildirilir', () => {
  const s = setup();
  s.input.value = 'SÜVEYŞ a02360'; s.handlers.input();
  assert.equal(s.sections[0].card.hidden, false);
  assert.equal(s.sections[1].hidden, true);
  s.select.value = 'komutanlar'; s.handlers.change();
  assert.equal(s.empty.hidden, false);
  assert.equal(s.status.textContent, '0 / 2 fotoğraf gösteriliyor.');
});
test('paylaşılan bağlantı aramayı açar; değişiklik diğer parametre ve bölüm bağını korur', () => {
  const s = setup('https://onsekizmart.com/fotograf-arsivi/?q=S%C3%BCvey%C5%9F&tur=gemiler&ref=atlas#gemiler');
  assert.equal(s.status.textContent, '1 / 2 fotoğraf gösteriliyor.');
  s.input.value = 'Kemal'; s.select.value = 'komutanlar'; s.handlers.change();
  const url = new URL(s.window.location.href);
  assert.equal(url.searchParams.get('q'), 'Kemal');
  assert.equal(url.searchParams.get('tur'), 'komutanlar');
  assert.equal(url.searchParams.get('ref'), 'atlas');
  assert.equal(url.hash, '#gemiler');
  s.window.location.href = 'https://onsekizmart.com/fotograf-arsivi/?q=Ocean&tur=gecersiz';
  s.handlers.popstate();
  assert.equal(s.input.value, 'Ocean'); assert.equal(s.select.value, '');
  assert.equal(s.status.textContent, '1 / 2 fotoğraf gösteriliyor.');
});
test('temizleme aramayı ve türü sıfırlayıp tüm fotoğrafları geri getirir', () => {
  const s = setup();
  s.input.value = 'bulunmayan'; s.select.value = 'komutanlar'; s.handlers.change();
  s.handlers.reset();
  assert.equal(s.input.value, ''); assert.equal(s.select.value, '');
  assert.equal(s.status.textContent, '2 / 2 fotoğraf gösteriliyor.');
  assert.equal(s.empty.hidden, true);
  assert.ok(s.sections.every(x => !x.hidden && !x.card.hidden));
});
