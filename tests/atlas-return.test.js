const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/navigation.js'), 'utf8');
function visit(value) {
  const link = { href: '/?olay=default#harita', textContent: 'Haritada göster' };
  vm.runInNewContext(source, { URL, URLSearchParams,
    window: { location: { href: 'https://onsekizmart.com/olaylar/test/', origin: 'https://onsekizmart.com', search: '?atlasaDon=' + encodeURIComponent(value) } },
    document: { querySelectorAll: () => [link], getElementById: () => null } });
  return link;
}
test('olay sayfası haritadan seçilen kayda geri döner', () => {
  for (const url of ['/?olay=test#harita', '/?mevki=test#harita', '/?dakika=450&deniz=first#harita']) {
    const link = visit(url);
    assert.equal(link.href, url);
    assert.equal(link.textContent, 'Seçili kayda dön');
  }
});
test('dış adres, bilinmeyen parametre ve bozuk dönüş varsayılan bağlantıyı değiştirmez', () => {
  for (const url of ['', '//evil.example/', 'javascript:alert(1)', '/?olay=#harita', '/?olay=a&olay=b#harita', '/?redirect=https://evil.example#harita', '/?dakika=NaN#harita', '/?mevki=a#other', '/?olay=a&mevki=b#harita']) {
    assert.equal(visit(url).href, '/?olay=default#harita', url);
  }
});
