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
  const unicode = '/olaylar/?q=' + encodeURIComponent('ş'.repeat(200)) + '&bolum=kara#events-tools';
  assert.equal(visitList(unicode).href, unicode);
  assert.equal(visitList('/olaylar/?q=' + 'a'.repeat(201) + '#events-tools').href, '/olaylar/#kara');
  for (const invalid of ['https://evil.example/', '//evil.example/', '/olaylar/test/#events-tools', '/olaylar/?q=a&q=b#events-tools', '/olaylar/?bolum=bilinmeyen#events-tools', '/olaylar/?redirect=x#events-tools', '/olaylar/#other']) {
    assert.equal(visitList(invalid).href, '/olaylar/#kara');
  }
});

test('komutan sayfasından güvenli arama dönüşü korunur; dış hedef ve bozuk süzgeç reddedilir', () => {
  function visitCommanders(value) {
    const link = { href: '/komutanlar/#osmanli', textContent: 'Komutanlar listesine dön' };
    vm.runInNewContext(source, { URL, URLSearchParams,
      window: { location: { href: 'https://onsekizmart.com/komutanlar/test/', origin: 'https://onsekizmart.com', search: '?komutanlaraDon=' + encodeURIComponent(value) } },
      document: { querySelectorAll: () => [link], getElementById: () => null } });
    return link;
  }
  const valid = '/komutanlar/?q=Cevat&taraf=osmanli#commanders-search';
  assert.equal(visitCommanders(valid).href, valid);
  assert.equal(visitCommanders(valid).textContent, 'Komutan aramasına dön');
  const unicode = '/komutanlar/?q=' + encodeURIComponent('ş'.repeat(200)) + '#commanders-search';
  assert.equal(visitCommanders(unicode).href, unicode);
  for (const invalid of ['https://evil.example/', '//evil.example/', '/komutanlar/test/#commanders-search',
    '/komutanlar/?q=a&q=b#commanders-search', '/komutanlar/?taraf=bilinmeyen#commanders-search',
    '/komutanlar/?redirect=x#commanders-search', '/komutanlar/#other', '/komutanlar/?q=' + 'a'.repeat(201) + '#commanders-search']) {
    assert.equal(visitCommanders(invalid).href, '/komutanlar/#osmanli');
  }
});

test('olaydan komutana geçiş liste ve harita dönüşünü taşır; dış hedefleri değiştirmez', () => {
  const list = '/olaylar/?q=Ariburnu&bolum=kara#events-tools';
  const map = '/?olay=e-may19#harita';
  const params = new URLSearchParams({ listeyeDon: list, atlasaDon: map });
  const commander = { href: '/komutanlar/esat-pasa-bulkat/#inceleme-baslik' };
  const outside = { href: 'https://evil.example/komutanlar/test/' };
  const handlers = {};
  const window = { addEventListener(type, fn) { handlers[type] = fn; }, location: { href: 'https://onsekizmart.com/olaylar/ariburnu-genel-taarruzu/?' + params + '#kaynak-notu', origin: 'https://onsekizmart.com', search: '?' + params } };
  vm.runInNewContext(source, { URL, URLSearchParams,
    window,
    document: { querySelectorAll: selector => selector === '.page-main a[href^="/komutanlar/"]' ? [commander, outside] : [], getElementById: () => null } });
  const target = new URL(commander.href, 'https://onsekizmart.com');
  assert.equal(target.hash, '#inceleme-baslik');
  const back = new URL(target.searchParams.get('olayaDon'), 'https://onsekizmart.com');
  assert.equal(back.pathname, '/olaylar/ariburnu-genel-taarruzu/');
  assert.equal(back.hash, '#kaynak-notu');
  assert.equal(back.searchParams.get('listeyeDon'), list); assert.equal(back.searchParams.get('atlasaDon'), map);
  assert.equal(outside.href, 'https://evil.example/komutanlar/test/');
  for (const event of ['hashchange', 'pageshow']) {
    window.location.href = 'https://onsekizmart.com/olaylar/ariburnu-genel-taarruzu/?' + params + '#48-alay-emirleri';
    handlers[event]();
    const updated = new URL(commander.href, window.location.href);
    const returned = new URL(updated.searchParams.get('olayaDon'), window.location.href);
    assert.equal(returned.hash, '#48-alay-emirleri');
    assert.equal(returned.searchParams.get('listeyeDon'), list);
    assert.equal(returned.searchParams.get('atlasaDon'), map);
    assert.equal(updated.hash, '#inceleme-baslik');
    assert.equal(outside.href, 'https://evil.example/komutanlar/test/');
  }
});

test('komutanın olay dönüşü yalnız yerel olay ve doğrulanmış iç dönüş adreslerini kabul eder', () => {
  function visitEventBack(value) {
    const inserted = [];
    const back = { parentNode: { insertBefore(node) { inserted.push(node); } } };
    vm.runInNewContext(source, { URL, URLSearchParams,
      window: { location: { href: 'https://onsekizmart.com/komutanlar/test/', origin: 'https://onsekizmart.com', search: '?olayaDon=' + encodeURIComponent(value) } },
      document: { querySelector: () => back, querySelectorAll: () => [], getElementById: () => null,
        createElement: tag => ({ tag, children: [], appendChild(child) { this.children.push(child); } }) } });
    return inserted;
  }
  const good = '/olaylar/18-mart-deniz-muharebesi/#kaynak-notu';
  const result = visitEventBack(good);
  assert.equal(result.length, 1); assert.equal(result[0].children[0].href, good);
  assert.equal(result[0].children[0].textContent, 'Okuduğunuz olaya dön');
  for (const bad of ['https://evil.example/', '//evil.example/', '/olaylar/', '/komutanlar/test/',
    '/olaylar/test/?redirect=x', '/olaylar/test/?olayaDon=x', '/olaylar/test/?atlasaDon=https%3A%2F%2Fevil.example',
    '/olaylar/test/?listeyeDon=%2Folaylar%2F%3Fbolum%3Dbilinmeyen%23events-tools']) {
    assert.equal(visitEventBack(bad).length, 0, bad);
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
    document: { querySelectorAll: selector => selector === '.page-main a[href]' ? [next, outside, map] : [list], getElementById: () => null } });
  const url = new URL(next.href, 'https://onsekizmart.com');
  assert.equal(url.searchParams.get('listeyeDon'), back);
  assert.equal(url.searchParams.get('ref'), 'koru'); assert.equal(url.hash, '#icerik');
  assert.equal(next.textContent, 'Sonraki kayıt');
  assert.equal(outside.href, 'https://evil.example/olaylar/test/');
  assert.equal(map.href, '/?olay=test#harita');
  assert.equal(list.href, back);
});

const app = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
function readingPanel(spec, search = '') {
  function element(tag) {
    return { tag, children: [], listeners: {},
      setAttribute(key, value) { this[key] = value; },
      appendChild(child) { this.children.push(child); },
      replaceChildren() { this.children = []; },
      addEventListener(type, handler) { this.listeners[type] = handler; } };
  }
  const body = element('div');
  const saved = [];
  const nodes = { panel: { classList: { add() {} } }, 'panel-title': {}, 'panel-meta': {}, 'panel-body': body };
  const ctx = { URL, URLSearchParams, panelRevision: 0,
    window: { location: { href: 'https://onsekizmart.com/?mevki=bouvet#harita', origin: 'https://onsekizmart.com', search } },
    document: { getElementById: id => nodes[id], createElement: element },
    textEl(tag, text) { return { ...element(tag), textContent: text }; },
    findPlace: () => null, narrativeEvidence: () => null, closeTools() {},
    saveAtlasView(target) { saved.push(target); }
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/model.js'), 'utf8'), ctx);
  ctx.Model = ctx.window.OMModel;
  vm.runInContext(app.slice(app.indexOf('  function localHref('), app.indexOf('  function fillCells(')), ctx);
  vm.runInContext(app.slice(app.indexOf('  function claimConflictEvidence('), app.indexOf('  function paintCurrent(')), ctx);
  ctx.fillPanel(spec);
  return { links: body.children.filter(n => n.tag === 'a'), saved };
}

test('haritadan gemi kartına dönüş aynı mevki ve güvenli arama bağlamıyla sınırlıdır', () => {
  const back = '/donanma/?q=Goliath&ad=1#goliath';
  const params = new URLSearchParams({ mevki: 'morto', donanmayaDon: back });
  const links = readingPanel({ placeId: 'morto' }, '?' + params).links;
  assert.equal(links.find(link => link.textContent === 'Gemi kartına dön').href, back);
  assert.ok(!readingPanel({ placeId: 'bouvet' }, '?' + params).links.some(link => link.textContent === 'Gemi kartına dön'));
  for (const invalid of ['https://evil.example/', '//evil.example/', '/donanma/test/#goliath',
    '/donanma/?q=a&q=b#goliath', '/donanma/?ad=2#goliath', '/donanma/?redirect=x#goliath', '/donanma/']) {
    params.set('donanmayaDon', invalid);
    assert.ok(!readingPanel({ placeId: 'morto' }, '?' + params).links.some(link => link.textContent === 'Gemi kartına dön'), invalid);
  }
});

test('kanıt ve ayrıntı bağlantıları sorguyu ve bölüm çapasını koruyarak aynı kayda dönüş taşır', () => {
  const target = '/?dakika=834&deniz=bouvet-mayina-carpar#harita';
  const result = readingPanel({ shareHref: target,
    reviewHref: '/olaylar/18-mart-deniz-muharebesi/?inceleme=1&atlasaDon=eski#bouvet-saat-incelemesi',
    href: '/olaylar/18-mart-deniz-muharebesi/?inceleme=2#kaynak-notu' });
  result.links.slice(0, 2).forEach((link, i) => {
    const destination = new URL(link.href, 'https://onsekizmart.com');
    assert.equal(destination.searchParams.get('inceleme'), String(i + 1));
    assert.deepEqual(destination.searchParams.getAll('atlasaDon'), [target]);
    assert.equal(destination.hash, i === 0 ? '#bouvet-saat-incelemesi' : '#kaynak-notu');
    link.listeners.click({ defaultPrevented: false, preventDefault() { assert.fail('Yerel gezinme engellenmemeli'); } });
  });
  assert.deepEqual(result.saved, [target, target]);
});

test('kanıt sayfasından dönüş mevki, olay ve aynı dakikadaki deniz kaydını ayırt eder', () => {
  for (const target of ['/?mevki=bouvet#harita', '/?olay=e-may19#harita', '/?dakika=834&deniz=bouvet-mayina-carpar#harita']) {
    const review = readingPanel({ reviewHref: '/olaylar/18-mart-deniz-muharebesi/#bouvet-saat-incelemesi', shareHref: target }).links[0];
    const destination = new URL(review.href, 'https://onsekizmart.com');
    const back = visit(destination.searchParams.get('atlasaDon'));
    assert.equal(back.href, target);
    assert.equal(back.textContent, 'Seçili kayda dön');
  }
});

test('dış hedeflere veya tarayıcının dış adrese dönüştürdüğü yollara dönüş bilgisi eklenmez', () => {
  for (const href of ['https://example.invalid/kaynak/#belge', '//example.invalid/kaynak/', '/\\example.invalid/kaynak/']) {
    const detail = readingPanel({ href, shareHref: '/?mevki=bouvet#harita' }).links.find(link => link.textContent === 'Ayrıntı');
    assert.equal(detail.href, href);
    assert.equal(detail.listeners.click, undefined);
  }
  for (const shareHref of ['', 'https://example.invalid/', '/\\example.invalid/']) {
    const reviewHref = '/olaylar/18-mart-deniz-muharebesi/#bouvet-saat-incelemesi';
    const review = readingPanel({ reviewHref, shareHref }).links[0];
    assert.equal(review.href, reviewHref);
    assert.equal(review.listeners.click, undefined);
  }
});

test('kanıt bağlantısı tarayıcı kısayollarını engellemez ve iptal edilmiş tıklama görünümü değiştirmez', () => {
  const target = '/?mevki=bouvet#harita';
  const result = readingPanel({ reviewHref: '/olaylar/18-mart-deniz-muharebesi/#bouvet-saat-incelemesi', shareHref: target });
  const link = result.links[0];
  const href = link.href;
  for (const modifier of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey']) {
    link.listeners.click({ [modifier]: true, defaultPrevented: false, preventDefault() { assert.fail('Tarayıcı kısayolu engellenmemeli'); } });
    assert.equal(link.href, href);
  }
  assert.equal(result.saved.length, 4);
  link.listeners.click({ defaultPrevented: true });
  assert.equal(result.saved.length, 4);
});

test('genel inceleme yedeğinde haritaya dönüş için görünür bağlantı bulunur', () => {
  const page = fs.readFileSync(path.join(__dirname, '../inceleme-notlari/index.html'), 'utf8');
  assert.match(page, /class="btn event-map-action" href="\/#harita">Haritaya dön/);
  const review = readingPanel({ shareHref: '/?olay=e-may19#harita' }).links[0];
  const destination = new URL(review.href, 'https://onsekizmart.com');
  assert.equal(destination.pathname, '/inceleme-notlari/');
  assert.equal(visit(destination.searchParams.get('atlasaDon')).href, '/?olay=e-may19#harita');
});

function readingPage(href, destinations = {}) {
  const origin = 'https://onsekizmart.com';
  const location = new URL(href, origin);
  const link = (href, textContent) => ({ href, textContent });
  const next = link(destinations.next || '/olaylar/ariburnu-gomme-ateskesi/?ref=koru#icerik', 'Sonraki kayıt');
  const previous = link('/olaylar/goliath-batar/', 'Önceki kayıt');
  const related = link('/olaylar/ariburnu-gomme-ateskesi/#kaynak-notu', '24 Mayıs gömme ateşkesi');
  const list = link('/olaylar/', 'Olay listesi');
  const map = link('/?olay=ariburnu-genel-taarruzu#harita', 'Haritada göster');
  const ownMap = link('/?olay=ariburnu-gomme-ateskesi#harita', 'Haritada göster');
  const self = link(location.pathname + '?ref=yerel#icerik', 'Bu kayıt');
  const untouched = ['#kaynak-notu', '/olaylar/#kara',
    '/kaynakca/', 'https://example.invalid/olaylar/kayit/', '//example.invalid/olaylar/kayit/',
    '/\\example.invalid/olaylar/kayit/', 'javascript:alert(1)'].map(href => link(href, 'Özgün metin'));
  vm.runInNewContext(source, { URL, URLSearchParams, window: { location },
    document: { getElementById: () => null, querySelectorAll(selector) {
      if (selector === '.page-main a[href]') return [next, previous, related, list, map, ownMap, self, ...untouched];
      if (selector === '.event-map-action') return [map];
      return [list];
    } }
  });
  return { next, previous, related, list, map, ownMap, self, untouched };
}

test('olay komşuları ve metin içi olay bağlantıları seçili harita kaydına dönüşü taşır', () => {
  for (const target of ['/?olay=e-may19#harita', '/?mevki=bouvet#harita', '/?dakika=834&deniz=bouvet-mayina-carpar#harita']) {
    const page = readingPage('/olaylar/ariburnu-genel-taarruzu/?atlasaDon=' + encodeURIComponent(target));
    for (const item of [page.next, page.previous, page.related]) {
      const url = new URL(item.href, 'https://onsekizmart.com');
      assert.deepEqual(url.searchParams.getAll('atlasaDon'), [target]);
      const following = readingPage(url.href);
      assert.equal(following.map.href, target);
      assert.equal(following.map.textContent, 'Seçili kayda dön');
    }
    assert.equal(new URL(page.next.href, 'https://onsekizmart.com').searchParams.get('ref'), 'koru');
    assert.equal(new URL(page.next.href, 'https://onsekizmart.com').hash, '#icerik');
    assert.equal(new URL(page.related.href, 'https://onsekizmart.com').hash, '#kaynak-notu');
    assert.equal(page.next.textContent, 'Sonraki kayıt');
    assert.equal(page.related.textContent, '24 Mayıs gömme ateşkesi');
  }
});

test('okuma boyunca harita seçimi ve liste araması birlikte korunur; eski parametreler çoğalmaz', () => {
  const target = '/?olay=e-may19#harita';
  const back = '/olaylar/?q=Ar%C4%B1burnu&bolum=kara#events-tools';
  const first = readingPage('/olaylar/ariburnu-genel-taarruzu/?atlasaDon=' + encodeURIComponent(target) + '&listeyeDon=' + encodeURIComponent(back), {
    next: '/olaylar/ariburnu-gomme-ateskesi/?atlasaDon=eski&atlasaDon=diger&listeyeDon=eski#icerik'
  });
  const second = readingPage(first.next.href, { next: '/olaylar/triumph-batar/' });
  const third = readingPage(second.next.href);
  for (const page of [first, second, third]) {
    assert.equal(page.map.href, target);
    assert.equal(page.list.href, back);
    assert.equal(page.list.textContent, 'Arama sonuçlarına dön');
  }
  for (const item of [first.next, first.related, second.next]) {
    const url = new URL(item.href, 'https://onsekizmart.com');
    assert.deepEqual(url.searchParams.getAll('atlasaDon'), [target]);
    assert.deepEqual(url.searchParams.getAll('listeyeDon'), [back]);
  }
});

test('okuma bağlamı sayfa içi çapalara, dış hedeflere veya mevcut olayın harita bağlantısına eklenmez', () => {
  const page = readingPage('/olaylar/ariburnu-genel-taarruzu/?atlasaDon=' + encodeURIComponent('/?olay=e-may19#harita'));
  assert.deepEqual(page.untouched.map(link => link.href), ['#kaynak-notu', '/olaylar/#kara', '/kaynakca/', 'https://example.invalid/olaylar/kayit/', '//example.invalid/olaylar/kayit/',
    '/\\example.invalid/olaylar/kayit/', 'javascript:alert(1)']);
  assert.equal(page.ownMap.href, '/?olay=ariburnu-gomme-ateskesi#harita');
  assert.equal(page.ownMap.textContent, 'Haritada göster');
});

test('iki dönüş bilgisinden yalnız geçerli olanı olay bağlantılarına taşınır', () => {
  const target = '/?mevki=bouvet#harita', back = '/olaylar/?bolum=kara#events-tools';
  for (const [map, list, expectedMap, expectedList] of [[target, '//example.invalid/', target, null], ['//example.invalid/', back, null, back]]) {
    const page = readingPage('/olaylar/ariburnu-genel-taarruzu/?atlasaDon=' + encodeURIComponent(map) + '&listeyeDon=' + encodeURIComponent(list));
    const next = new URL(page.related.href, 'https://onsekizmart.com');
    assert.equal(next.searchParams.get('atlasaDon'), expectedMap);
    assert.equal(next.searchParams.get('listeyeDon'), expectedList);
  }
});

test('dönüş bilgisi olmayan veya bütünüyle geçersiz olan sayfada olay bağlantıları değişmez', () => {
  for (const query of ['', '?atlasaDon=' + encodeURIComponent('//example.invalid/') + '&listeyeDon=' + encodeURIComponent('/olaylar/?redirect=x#events-tools')]) {
    const page = readingPage('/olaylar/ariburnu-genel-taarruzu/' + query);
    assert.equal(page.next.href, '/olaylar/ariburnu-gomme-ateskesi/?ref=koru#icerik');
    assert.equal(page.related.href, '/olaylar/ariburnu-gomme-ateskesi/#kaynak-notu');
    assert.equal(page.list.href, '/olaylar/');
    assert.equal(page.map.textContent, 'Haritada göster');
  }
});

test('aynı olayı yeniden açan bağlantı dönüş bilgisini korurken mevcut sayfa içi çapa değişmez', () => {
  const target = '/?olay=e-may19#harita', back = '/olaylar/?bolum=tahliye#events-tools';
  for (const slug of ['ariburnu-tahliyesi', 'anafartalar-tahliyesi', 'seddulbahir-tahliyesi']) {
    const href = '/olaylar/' + slug + '/?atlasaDon=' + encodeURIComponent(target) + '&listeyeDon=' + encodeURIComponent(back);
    const page = readingPage(href);
    const self = new URL(page.self.href, 'https://onsekizmart.com');
    assert.equal(self.searchParams.get('atlasaDon'), target);
    assert.equal(self.searchParams.get('listeyeDon'), back);
    assert.equal(self.searchParams.get('ref'), 'yerel');
    assert.equal(self.hash, '#icerik');
    assert.equal(page.untouched[0].href, '#kaynak-notu');
    const reopened = readingPage(self.href);
    assert.equal(reopened.map.href, target);
    assert.equal(reopened.list.href, back);
  }
});
