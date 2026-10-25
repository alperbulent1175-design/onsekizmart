const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function setup(href = 'https://onsekizmart.com/sozluk/') {
  const node = extra => Object.assign({ value: '', hidden: false, handlers: {},
    addEventListener(event, fn) { this.handlers[event] = fn; },
    focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; }, getAttribute(name) { return this[name] || ''; }
  }, extra);
  const entries = [node({ id: 'iase', textContent: 'İaşe Beslenme', 'data-aliases': 'erzak' }),
    node({ id: 'tumen', textContent: 'Tümen Birlik', 'data-aliases': 'fırka division' })];
  const groups = entries.map((entry, i) => node({ 'data-category': i ? 'birlik' : 'yasam', querySelectorAll: () => [entry] }));
  const ids = Object.fromEntries(['search', 'query', 'category', 'clear', 'results'].map(key => ['glossary-' + key, node()]));
  const win = node({ location: new URL(href) });
  win.history = { state: null, replaceState(state, title, url) { win.location = new URL(url); } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/glossary.js'), 'utf8'), {
    document: { getElementById: id => ids[id], querySelectorAll: selector => selector === '.glossary-group' ? groups : entries },
    window: win, URL, URLSearchParams
  });
  return { entries, groups, ids, win, input: ids['glossary-query'], category: ids['glossary-category'] };
}

test('sözlük Türkçe yazımı ve eş anlamlıları arar; konu ve boş sonuç birlikte temizlenir', () => {
  const { input, category, entries, groups, ids, win } = setup('https://onsekizmart.com/sozluk/?ref=koru');
  assert.equal(ids['glossary-search'].hidden, false);
  input.value = 'İASE'; input.handlers.input();
  assert.equal(entries[0].hidden, false); assert.equal(entries[1].hidden, true);
  input.value = 'firka'; input.handlers.input(); assert.equal(entries[1].hidden, false);
  category.value = 'yasam'; category.handlers.change();
  assert.ok(entries.every(entry => entry.hidden)); assert.ok(groups.every(group => group.hidden));
  assert.match(ids['glossary-results'].textContent, /Eşleşen terim yok/);
  ids['glossary-clear'].handlers.click();
  assert.ok(entries.every(entry => !entry.hidden)); assert.equal(category.value, '');
  assert.equal(ids['glossary-clear'].disabled, true); assert.equal(input.focused, true);
  assert.equal(win.location.search, '?ref=koru');
});

test('sözlük araması paylaşılır, geri gezinmede geri yüklenir; gizli terim ve konu bağlantısı açılır', () => {
  const { input, category, entries, groups, win } = setup('https://onsekizmart.com/sozluk/?q=erzak&konu=yasam');
  assert.equal(input.value, 'erzak'); assert.equal(category.value, 'yasam');
  assert.equal(entries[1].hidden, true);
  win.location.hash = '#tumen'; win.handlers.hashchange();
  assert.equal(entries[1].hidden, false); assert.equal(entries[1].focused, true);
  assert.equal(input.value, ''); assert.equal(category.value, '');
  input.value = 'iaşe'; input.handlers.input();
  assert.equal(win.location.searchParams.get('q'), 'iaşe');
  win.location.hash = '#konu-birlik'; win.handlers.hashchange(); assert.ok(groups.every(group => !group.hidden));
  win.location = new URL('https://onsekizmart.com/sozluk/?q=division&konu=birlik'); win.handlers.popstate();
  assert.equal(input.value, 'division'); assert.equal(category.value, 'birlik'); assert.equal(entries[0].hidden, true);
  win.location.hash = '#%E0%A4%A'; assert.doesNotThrow(() => win.handlers.hashchange());
});

test('sözlük Escape ile iki süzgeci sıfırlar, yazı birleştirme sırasında müdahale etmez', () => {
  const { input, category, entries } = setup();
  input.value = 'yok'; category.value = 'birlik'; input.handlers.input();
  let prevented = false;
  input.handlers.keydown({ key: 'Escape', isComposing: true, preventDefault() { prevented = true; } });
  assert.equal(prevented, false); assert.equal(input.value, 'yok');
  input.handlers.keydown({ key: 'Escape', preventDefault() { prevented = true; } });
  assert.equal(prevented, true); assert.equal(input.value, ''); assert.equal(category.value, '');
  assert.ok(entries.every(entry => !entry.hidden));
});

test('aynı terim bağlantısı aramayla gizlenen hedefi yeniden açar; yeni sekme tıklamasına müdahale etmez', () => {
  const { input, entries, win } = setup('https://onsekizmart.com/sozluk/#tumen');
  input.value = 'erzak'; input.handlers.input();
  const target = { closest: () => ({ getAttribute: () => '#tumen' }) };
  win.handlers.click({ target, ctrlKey: true });
  assert.equal(entries[1].hidden, true); assert.equal(input.value, 'erzak');
  win.handlers.click({ target, button: 0 });
  assert.equal(entries[1].hidden, false); assert.equal(entries[1].focused, true);
  assert.equal(entries[1].scrolled, true); assert.equal(input.value, '');
});

test('sözlük JS olmadan tüm tanımları ve kaynak kapsamını sunar; yerel bağlantı kimlikleri vardır', () => {
  const html = fs.readFileSync(path.join(__dirname, '../sozluk/index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
  assert.equal((html.match(/class="glossary-entry"/g) || []).length, 40);
  assert.doesNotMatch(html, /class="glossary-entry"[^>]*\bhidden\b/);
  assert.match(html, /id="glossary-results" role="status"/);
  assert.match(html, /özgün günlük görüntüsü bu çalışmada incelenmedi/);
  assert.match(html, /14 Ekim 2024/);
  assert.match(html, /toplam zayiat yalnız ölü sayısı olarak aktarılmaz/);
});
