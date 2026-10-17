const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { entries, render } = require('../build_event_navigation');
const root = path.join(__dirname, '..');
test('28 olay sayfası mevcut atlas sırasındaki komşularına bağlanır', () => {
  const list = entries();
  assert.equal(list.length, 28);
  list.forEach((entry, index) => {
    const html = fs.readFileSync(path.join(root, entry.href, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
    assert.equal(html.split('<!-- atlas-event-navigation:start -->').length, 2);
    assert.ok(html.includes(render(list, index)));
    assert.ok(html.indexOf('id="kaynak-notu"') < html.indexOf('<!-- atlas-event-navigation:start -->'));
    for (const neighbor of [list[index - 1], list[index + 1]].filter(Boolean))
      assert.ok(fs.existsSync(path.join(root, neighbor.href, 'index.html')));
  });
});
test('ilk ve son kayıtta döngü veya olmayan komşu bağlantısı üretilmez', () => {
  const list = entries();
  assert.doesNotMatch(render(list, 0), /Önceki kayıt/);
  assert.doesNotMatch(render(list, list.length - 1), /Sonraki kayıt/);
  assert.match(render(list, 0), /kesin saat sırasını göstermez/);
});
test('gezinti başlıklarında işaretleme metin olarak kaçırılır', () => {
  const html = render([{ title: '<img onerror="test">', href: '/olaylar/test/' }, { title: 'B', href: '/olaylar/b/' }], 1);
  assert.doesNotMatch(html, /<img/); assert.match(html, /&lt;img/);
});
