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


test('olay listesinden dönüş aramayı korur ve dış hedefleri reddeder', () => {
  function visitList(value) {
    const link = { href: '/olaylar/#kara', textContent: 'Olay listesi' };
    vm.runInNewContext(source, { URL, URLSearchParams,
      window: { location: { href: 'https://onsekizmart.com/olaylar/test/', origin: 'https://onsekizmart.com', search: '?listeyeDon=' + encodeURIComponent(value) } },
      document: { querySelectorAll: () => [link], getElementById: () => null } });
    return link;
  }
  const valid = '/olaylar/?q=Ar%C4%B1burnu&bolum=kara#events-tools';
  assert.equal(visitList(valid).href, valid);
  assert.equal(visitList(valid).textContent, 'Arama sonuçlarına dön');
  for (const invalid of ['https://evil.example/', '//evil.example/', '/olaylar/test/#events-tools', '/olaylar/?q=a&q=b#events-tools', '/olaylar/?bolum=bilinmeyen#events-tools', '/olaylar/?redirect=x#events-tools', '/olaylar/#other']) {
    assert.equal(visitList(invalid).href, '/olaylar/#kara');
  }
});


test('önceki ve sonraki kayıtlar aramaya dönüşü taşır, dış hedef ve harita bağlantısı korunur', () => {
  const back = '/olaylar/?q=Ar%C4%B1burnu&bolum=kara#events-tools';
  const list = { href: '/olaylar/', textContent: 'Liste' };
  const next = { href: '/olaylar/sonraki/?ref=koru#icerik', textContent: 'Sonraki kayıt' };
  const outside = { href: 'https://evil.example/olaylar/test/', textContent: 'Dış hedef' };
  const map = { href: '/?olay=test#harita', textContent: 'Haritada göster' };
  vm.runInNewContext(source, { URL, URLSearchParams,
    window: { location: { href: 'https://onsekizmart.com/olaylar/test/', origin: 'https://onsekizmart.com', search: '?listeyeDon=' + encodeURIComponent(back) } },
    document: { querySelectorAll: selector => selector.includes('a[rel=') ? [next, outside, map] : [list], getElementById: () => null } });
  const url = new URL(next.href, 'https://onsekizmart.com');
  assert.equal(url.searchParams.get('listeyeDon'), back);
  assert.equal(url.searchParams.get('ref'), 'koru'); assert.equal(url.hash, '#icerik');
  assert.equal(next.textContent, 'Sonraki kayıt');
  assert.equal(outside.href, 'https://evil.example/olaylar/test/');
  assert.equal(map.href, '/?olay=test#harita');
  assert.equal(list.href, back);
});
