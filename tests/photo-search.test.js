const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function setup(href = 'https://onsekizmart.com/fotograf-arsivi/') {
  const handlers = {};
  const input = { value: '', focus() { this.focused = true; }, addEventListener(type, fn) { handlers[type] = fn; } };
  const select = { value: '', addEventListener(type, fn) { handlers[type] = fn; } };
  const form = { hidden: true, querySelector(s) { return s === 'input' ? input : select; }, addEventListener(type, fn) { handlers[type] = fn; } };
  const status = {}, empty = {};
  const sections = [['gemiler', 'Ocean Süveyş A02360'], ['komutanlar', 'Mustafa Kemal A05319'], ['olaylar', 'Kanlısırt A02599']].map(([category, text]) => {
    const card = { textContent: text, hidden: false };
    return { card, getAttribute() { return category; }, querySelectorAll() { return [card]; } };
  });
  const sectionLinks = sections.map(section => ({ textContent: section.getAttribute(), attributes: {}, getAttribute(name) { return name === 'href' ? '#' + section.getAttribute() : this.attributes[name]; }, setAttribute(name, value) { this.attributes[name] = value; }, removeAttribute(name) { delete this.attributes[name]; }, addEventListener(type, fn) { this[type] = fn; } }));
  const navigation = { querySelectorAll() { return sectionLinks; } };
  const document = { getElementById(id) { return { 'photo-search': form, 'photo-results': status, 'photo-empty': empty, 'photo-sections': navigation }[id]; }, querySelectorAll() { return sections; } };
  const window = { location: { href }, history: { state: { preserve: true }, replaceState(state, title, url) { window.location.href = url; } }, addEventListener(type, fn) { handlers[type] = fn; } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/photo-search.js'), 'utf8'), { document, window, URL });
  return { input, select, form, status, empty, sections, handlers, window, sectionLinks };
}
test('Türkçe arama ve kategori birlikte uygulanır; boş sonuç açıkça bildirilir', () => {
  const s = setup();
  s.input.value = 'SÜVEYŞ a02360'; s.handlers.input();
  assert.equal(s.sections[0].card.hidden, false);
  assert.equal(s.sections[1].hidden, true);
  s.select.value = 'komutanlar'; s.handlers.change();
  assert.equal(s.empty.hidden, false);
  assert.equal(s.status.textContent, '0 / 3 fotoğraf gösteriliyor.');
});
test('paylaşılan bağlantı aramayı açar; değişiklik diğer parametre ve bölüm bağını korur', () => {
  const s = setup('https://onsekizmart.com/fotograf-arsivi/?q=S%C3%BCvey%C5%9F&tur=gemiler&ref=atlas#gemiler');
  assert.equal(s.status.textContent, '1 / 3 fotoğraf gösteriliyor.');
  s.input.value = 'Kemal'; s.select.value = 'komutanlar'; s.handlers.change();
  const url = new URL(s.window.location.href);
  assert.equal(url.searchParams.get('q'), 'Kemal');
  assert.equal(url.searchParams.get('tur'), 'komutanlar');
  assert.equal(url.searchParams.get('ref'), 'atlas');
  assert.equal(url.hash, '#gemiler');
  s.window.location.href = 'https://onsekizmart.com/fotograf-arsivi/?q=Ocean&tur=gecersiz';
  s.handlers.popstate();
  assert.equal(s.input.value, 'Ocean'); assert.equal(s.select.value, '');
  assert.equal(s.status.textContent, '1 / 3 fotoğraf gösteriliyor.');
});
test('temizleme aramayı ve türü sıfırlayıp tüm fotoğrafları geri getirir', () => {
  const s = setup();
  s.input.value = 'bulunmayan'; s.select.value = 'komutanlar'; s.handlers.change();
  s.handlers.reset();
  assert.equal(s.input.value, ''); assert.equal(s.select.value, '');
  assert.equal(s.status.textContent, '3 / 3 fotoğraf gösteriliyor.');
  assert.equal(s.empty.hidden, true);
  assert.ok(s.sections.every(x => !x.hidden && !x.card.hidden));
  assert.equal(s.input.focused, true);
});

test('bölüm değişimi aramayı korur, sayaç ile gösterilen sonuç tutarlıdır', () => {
  const s = setup('https://onsekizmart.com/fotograf-arsivi/?tur=olaylar');
  s.input.value = 'Ocean'; s.handlers.input();
  assert.equal(s.sectionLinks[0].textContent, 'gemiler (1)');
  s.sectionLinks[0].click();
  assert.equal(s.input.value, 'Ocean'); assert.equal(s.select.value, 'gemiler');
  assert.equal(s.sections[0].hidden, false);
  assert.equal(s.status.textContent, '1 / 3 fotoğraf gösteriliyor.');
  s.sectionLinks[2].click();
  assert.equal(s.input.value, 'Ocean'); assert.equal(s.empty.hidden, false);
  assert.equal(s.status.textContent, '0 / 3 fotoğraf gösteriliyor.');
  s.sectionLinks[0].click({ ctrlKey: true });
  assert.equal(s.select.value, 'olaylar');
  s.handlers.reset(); assert.equal(s.empty.hidden, true);
});

test('bölüm sayıları aramaya göre değişir ve etkin tür geri gezinmede güncellenir', () => {
  const s = setup('https://onsekizmart.com/fotograf-arsivi/?tur=olaylar');
  assert.equal(s.sectionLinks[2].getAttribute('aria-current'), 'true');
  s.input.value = 'Ocean'; s.handlers.input();
  assert.equal(s.sectionLinks[0].textContent, 'gemiler (1)');
  assert.equal(s.sectionLinks[2].textContent, 'olaylar (0)');
  s.handlers.reset();
  assert.equal(s.sectionLinks[2].getAttribute('aria-current'), undefined);
  assert.equal(s.sectionLinks[0].textContent, 'gemiler (1)');
});

test('Escape arama metnini temizlerken seçili kategoriyi ve diğer URL alanlarını korur', () => {
  const s = setup('https://onsekizmart.com/fotograf-arsivi/?q=bulunmayan&tur=olaylar&ref=atlas');
  let prevented = false;
  s.handlers.keydown({ key: 'Escape', preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(s.input.value, '');
  assert.equal(s.select.value, 'olaylar');
  assert.equal(s.empty.hidden, true);
  assert.equal(new URL(s.window.location.href).searchParams.get('q'), null);
  assert.equal(new URL(s.window.location.href).searchParams.get('ref'), 'atlas');
});


test('bölüm bağlantısı yeni sekmede de aramayı ve hedef türü doğru yükler', () => {
  const s = setup('https://onsekizmart.com/fotograf-arsivi/?q=Ocean&tur=olaylar&ref=atlas');
  const target = new URL(s.sectionLinks[0].href, 'https://onsekizmart.com');
  assert.equal(target.searchParams.get('q'), 'Ocean');
  assert.equal(target.searchParams.get('tur'), 'gemiler');
  assert.equal(target.searchParams.get('ref'), 'atlas'); assert.equal(target.hash, '#gemiler');
  s.sectionLinks[0].click({ ctrlKey: true }); assert.equal(s.select.value, 'olaylar');
  const next = setup(target.href);
  assert.equal(next.input.value, 'Ocean'); assert.equal(next.select.value, 'gemiler');
  assert.equal(next.status.textContent, '1 / 3 fotoğraf gösteriliyor.');
  next.input.value = ''; next.handlers.input();
  assert.equal(new URL(next.sectionLinks[0].href, 'https://onsekizmart.com').searchParams.get('q'), null);
});


test('bölüm bağlantısı önceki geçmiş kaydını değiştirmeden tarayıcı gezinmesine bırakılır', () => {
  const original = 'https://onsekizmart.com/fotograf-arsivi/?q=Ocean&tur=olaylar#olaylar';
  const s = setup(original);
  s.sectionLinks[0].click({ button: 0 });
  assert.equal(s.window.location.href, original);
  assert.equal(s.select.value, 'gemiler');
  s.window.location.href = new URL(s.sectionLinks[0].href, original).href;
  s.handlers.pageshow(); assert.equal(s.select.value, 'gemiler');
  s.window.location.href = original; s.handlers.popstate();
  assert.equal(s.select.value, 'olaylar'); assert.equal(s.input.value, 'Ocean');
  assert.equal(s.empty.hidden, false);
});
