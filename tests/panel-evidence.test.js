const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const app = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
function node(tag, text) { return { tag, textContent: text || '', children: [], listeners: {}, setAttribute(key, value) { this[key] = value; }, addEventListener(type, callback) { this.listeners[type] = callback; }, appendChild(child) { this.children.push(child); } }; }
function allText(element) { return [element.textContent || '', ...(element.children || []).map(allText)].join(' '); }
let stopped = 0;
const context = {
  panelRevision: 0,
  stopPlay() { stopped++; },
  document: { createElement: tag => node(tag) }, textEl: node,
  Model: { safeUrl(value) { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } } }
};
vm.createContext(context);
vm.runInContext(app.slice(app.indexOf('  function narrativeEvidence('), app.indexOf('  function fillPanel(')), context);
const data = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8'), data);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/campaign.js'), 'utf8'), data);
test('belge kanıtı gerçek kayıtlarda görünür; sayısal konum kanıtına dönüştürülmez', () => {
  for (const id of ['tavsan', 'irresistible', 'ocean', 'inflexible', 'bouvet']) {
    const place = data.window.OM.places.find(p => p.id === id);
    const evidence = context.narrativeEvidence(place);
    assert.equal(evidence.tag, 'details');
    assert.equal(evidence.children[0].tag, 'summary');
    assert.ok(evidence.children.some(n => n.textContent === 'Türkçe çeviri (atlas): ' + place.narrativeSource.translation));
    assert.equal(evidence.children.find(n => n.tag === 'blockquote').lang, 'en');
    assert.equal(evidence.children.find(n => n.tag === 'blockquote').textContent, place.narrativeSource.evidenceText);
    assert.ok(evidence.children.some(n => n.textContent.includes('koordinat doğrulanmaz')));
    assert.equal(evidence.children.filter(n => n.tag === 'a').length, place.narrativeSource.publishedComparison ? 3 : 2);
  }
});
test('eksik veya güvenli olmayan kanıt bağlantıları gösterilmez; kanıt metni HTML olarak işlenmez', () => {
  const source = { ...data.window.OM.places.find(p => p.id === 'ocean').narrativeSource };
  assert.equal(context.narrativeEvidence({ narrativeSource: { ...source, url: 'javascript:alert(1)' } }), null);
  assert.equal(context.narrativeEvidence({ narrativeSource: { ...source, date: '' } }), null);
  assert.equal(context.narrativeEvidence({}), null);
  const evidence = context.narrativeEvidence({ narrativeSource: { ...source, evidenceText: '<img onerror=alert(1)>', imageUrl: 'javascript:alert(1)' } });
  assert.equal(evidence.children.find(n => n.tag === 'blockquote').textContent, '<img onerror=alert(1)>');
  assert.equal(evidence.children.filter(n => n.tag === 'a').length, 2);
});

test('resmî yayım karşılaştırması kendi durumu ve sınırlarıyla görünür; eski kopyayı değiştirmez', () => {
  for (const id of ['inflexible', 'irresistible', 'ocean']) {
    const place = data.window.OM.places.find(p => p.id === id);
    const original = JSON.stringify(place);
    const source = place.narrativeSource.publishedComparison;
    const details = context.narrativeEvidence(place);
    assert.ok(allText(details).includes('Ek kontrol: resmî yayımın incelenme tarihi · 2026-10-20'));
    assert.ok(allText(details).includes(source.context));
    assert.ok(allText(details).includes('bağımsız iki tanıklık sayılmaz'));
    assert.equal(details.children.find(n => n.href === source.url).textContent, source.label);
    assert.equal(JSON.stringify(place), original);
    assert.equal(place.narrativeSource.status, 'daktilo_kopyasi_goruntuden_okundu');
  }
});

test('eksik, güvensiz veya tarih ve durumu geçersiz yayım kaydı kanıt olarak sunulmaz', () => {
  const source = data.window.OM.places.find(p => p.id === 'ocean').narrativeSource;
  for (const patch of [{ url: 'javascript:alert(1)' }, { date: '2026-02-30' }, { date: 'dün' },
    { status: 'iddia_dogrulandi' }, { context: '' }, { evidenceText: '' }, { limit: '' }]) {
    const details = context.narrativeEvidence({ narrativeSource: { ...source,
      publishedComparison: { ...source.publishedComparison, ...patch } } });
    assert.ok(!allText(details).includes('Ek kontrol: resmî yayım'));
    assert.equal(details.children.filter(n => n.tag === 'a').length, 2);
  }
  assert.equal(context.narrativeEvidence({ narrativeSource: { ...source, date: '2026-02-30' } }), null);
});

for (const query of ['?mevki=ocean', '?olay=test', '?dakika=450']) {
  test('gecikmeli açılış bağlantısı yeni seçimi veya kapanmış kartı ezmez: ' + query, () => {
    const pending = []; let selected = 0, restored = 0;
    const ev = { m: 450, title: 'Test', id: 'test' };
    const ctx = { panelRevision: 1, URLSearchParams, restoreAtlasView() { restored++; },
      window: { location: { search: query, hash: '#harita' }, setTimeout: cb => pending.push(cb) },
      document: { getElementById: () => null }, findCampByKey: () => ev, findPlace: () => ({}),
      scrollToMap() {}, openPlace() { selected++; }, focusCampEvent() { selected++; }, showTime() { selected++; },
      D: { events: [ev] }, slugify: () => 'test', map: null, mode: 'naval', range: {}, revealDock() {}
    };
    vm.createContext(ctx);
    vm.runInContext(app.slice(app.indexOf('  function consumeDeepLink()'), app.indexOf('  function bindDock()')), ctx);
    ctx.consumeDeepLink();
    assert.equal(pending.length, 1);
    ctx.panelRevision++;
    pending.shift()();
    assert.equal(selected, 0);
    assert.equal(restored, 0);
    ctx.consumeDeepLink(); pending.shift()();
    assert.equal(selected, 1);
    assert.equal(restored, 1);
  });
}

test('kanıt bölümünü açmak oynatmayı durdurur; kapatmak yeniden başlatmaz', () => {
  stopped = 0;
  const place = data.window.OM.places.find(p => p.id === 'ocean');
  const details = context.narrativeEvidence(place);
  details.open = true; details.listeners.toggle();
  assert.equal(stopped, 1);
  details.open = false; details.listeners.toggle();
  assert.equal(stopped, 1);
});

test('kaydırma sonrası bekleyen mevki seçimi daha yeni kartı ezmez', () => {
  let pending, selected = '';
  const ctx = { panelRevision: 2, stopPlay() {}, scrollToMap() {}, motionOn: () => true,
    setTimeout: cb => { pending = cb; }, selectPlace: id => { selected = id; } };
  vm.createContext(ctx);
  vm.runInContext(app.slice(app.indexOf('  function goPlace('), app.indexOf('  function openLoose(')), ctx);
  ctx.goPlace('ocean'); ctx.panelRevision++; pending();
  assert.equal(selected, '');
  ctx.goPlace('tavsan'); pending();
  assert.equal(selected, 'tavsan');
});

test('Inflexible kanıtı bildirim ile isabet anını ayırır ve incelenmiş görüntüye bağlanır', () => {
  const place = data.window.OM.places.find(p => p.id === 'inflexible');
  const review = JSON.parse(fs.readFileSync(path.join(__dirname, '../research/source-review/18-mart-gazette-2026-10-19/review.json'), 'utf8'));
  assert.equal(place.narrativeSource.imageUrl, review.image_url);
  assert.equal(place.narrativeSource.evidenceText, review.evidence);
  const details = context.narrativeEvidence(place);
  assert.ok(details.children.some(n => n.textContent.includes('mayına çarpma anını ayrıca doğrulamaz')));
  assert.equal(place.lat, 40.0435); assert.equal(place.lng, 26.292);
});

test('panel kaynak açıklaması incelenmiş pasajı genel kurum kaydından ayırır', () => {
  for (const hasEvidence of [true, false]) {
    const body = node('div'); body.replaceChildren = () => { body.children = []; };
    const panel = { classList: { add() {} } };
    const nodes = { panel, 'panel-title': {}, 'panel-meta': {}, 'panel-body': body };
    const ctx = { panelRevision: 0, document: { getElementById: id => nodes[id], createElement: node },
      textEl: node, findPlace: () => ({}), narrativeEvidence: () => hasEvidence ? node('details') : null,
      Model: {}, localHref: value => value || '', closeTools() {} };
    vm.createContext(ctx);
    const start = app.indexOf('  function claimConflictEvidence(');
    vm.runInContext(app.slice(start, app.indexOf('  function paintCurrent(', start)), ctx);
    ctx.fillPanel({ placeId: 'ocean', source: 'Kurum çerçevesi. Sayfa ve belge numarası yok.' });
    const text = body.children.map(child => child.textContent).join(' ');
    if (hasEvidence) {
      assert.match(text, /yalnız belirtilen pasajı destekler/);
      assert.match(text, /harita koordinatını doğrulamaz/);
      assert.doesNotMatch(text, /Sayfa ve belge numarası yok/);
    } else assert.match(text, /Sayfa ve belge numarası yok/);
  }
});

test('enkaz konum kaynağı yayın kanıtını gösterir, saha ölçümü sayılmaz', () => {
  const place = data.window.OM.places.find(p => p.id === 'irresistible');
  const body = node('div'); body.replaceChildren = () => { body.children = []; };
  const nodes = { panel: { classList: { add() {} } }, 'panel-title': {}, 'panel-meta': {}, 'panel-body': body };
  const ctx = { panelRevision: 0, document: { getElementById: id => nodes[id], createElement: node },
    textEl: node, findPlace: () => place, narrativeEvidence: () => null,
    Model: context.Model, localHref: value => value || '', closeTools() {} };
  vm.createContext(ctx);
  const start = app.indexOf('  function claimConflictEvidence(');
  vm.runInContext(app.slice(start, app.indexOf('  function paintCurrent(', start)), ctx);
  ctx.fillPanel({ placeId: 'irresistible', accuracy: place.uncertainty });
  const text = allText(body);
  assert.ok(text.includes(place.coordinateSource.evidenceText));
  assert.match(text, /sahada yeniden ölçüm yapılmış sayılmaz/);
  assert.match(text, /isabeti veya tahliye yerini ayrıca doğrulamaz/);
  assert.match(text, /datum/);
});

test('yalnız uygun inceleme statüsü ve dolu künye ile daktilo kanıtı gösterilir', () => {
  const source = data.window.OM.places.find(p => p.id === 'ocean').narrativeSource;
  for (const status of ['katalog_kaydi', 'iddia_dogrulandi', 'bekliyor', '']) {
    assert.equal(context.narrativeEvidence({ narrativeSource: { ...source, status } }), null);
  }
  for (const key of ['evidenceText', 'date', 'limit', 'label']) {
    assert.equal(context.narrativeEvidence({ narrativeSource: { ...source, [key]: '   ' } }), null);
  }
});

test('eksik koordinat kaydı karşılaştırıldı açıklaması üretmez', () => {
  const body = node('div'); body.replaceChildren = () => { body.children = []; };
  const nodes = { panel: { classList: { add() {} } }, 'panel-title': {}, 'panel-meta': {}, 'panel-body': body };
  const ctx = { panelRevision: 0, document: { getElementById: id => nodes[id], createElement: node }, textEl: node,
    findPlace: () => ({ coordinateSource: { url: 'https://example.org/record', evidenceText: ' ', status: 'yayin_koordinati_karsilastirildi' } }),
    narrativeEvidence: () => null, Model: context.Model, localHref: value => value || '', closeTools() {} };
  vm.createContext(ctx);
  const start = app.indexOf('  function claimConflictEvidence(');
  vm.runInContext(app.slice(start, app.indexOf('  function paintCurrent(', start)), ctx);
  ctx.fillPanel({ placeId: 'test' });
  const text = allText(body);
  assert.match(text, /konum doğrulaması tamamlanmadı/);
  assert.doesNotMatch(text, /karşılaştırıldı|undefined/);
});

test('mayın anlatısı İngilizce pasajı ve çeviriyi gösterir; geometri veya kesin tarih kanıtı sayılmaz', () => {
  const source = data.window.OM.mineReview, details = context.mineNarrativeEvidence(source), text = allText(details);
  assert.equal(details.children[0].textContent, 'Mayın anlatısının kaynağını göster');
  assert.equal(details.children.find(n => n.tag === 'blockquote').lang, 'en');
  assert.equal(details.children.find(n => n.tag === 'a').href, source.url);
  assert.ok(text.includes(source.translation)); assert.ok(text.includes(source.readingScope));
  assert.match(text, /çizgi geometrisi doğrulanmadı/);
  assert.match(text, /Enlemesine şematik hatların numarası ve mayın sayısı bu pasajdan çıkarılamaz/);
  stopped = 0; details.open = true; details.listeners.toggle(); assert.equal(stopped, 1);
  for (const patch of [{url: 'javascript:alert(1)'},{status: 'iddia_dogrulandi'},{date: '2026-02-30'},{accessDate: '2026-11-03'},{metadataReviewDate: 'dün'},{eventDate: '1915-03-08'},{translation: ''},{bibliography: ''}]) {
    assert.equal(context.mineNarrativeEvidence({...source,...patch}), null);
  }
});

test('18 kronoloji kartı künye yılını, pasaj erişimini ve inceleme kapsamını ayırır', () => {
  const records = data.window.OM.campaign.events.filter(e => e.chronologySource);
  assert.equal(records.length, 18);
  for (const event of records) {
    const source = event.chronologySource, details = context.chronologyEvidence(source), text = allText(details);
    assert.equal(details.children[0].textContent, 'Bu olayın kaynak künyesini göster');
    assert.equal(details.children.find(n => n.tag === 'a').href, source.url);
    for (const field of ['bibliography','passage','evidenceText','eventDate','accessDate','metadataAccessDate','publicationDateNote','scope']) assert.ok(text.includes(source[field]), event.id + ':' + field);
    assert.match(text, /doğrudan alıntı değil/); assert.match(text, /bütün ayrıntılarının doğrulandığı anlamına gelmez/);
  }
});

test('geçersiz künye, güvenli olmayan adres veya doğrulandı etiketi kronoloji kanıtı üretmez', () => {
  const source = data.window.OM.campaign.events.find(e => e.chronologySource).chronologySource;
  for (const patch of [{url: 'javascript:alert(1)'},{status: 'iddia_dogrulandi'},{accessDate: '2026-02-30'},{metadataAccessDate: ''},{publicationDate: '2026-02-30'},{publicationDate: undefined},{publicationDateNote: ''},{bibliography: ''}]) assert.equal(context.chronologyEvidence({...source,...patch}), null);
  const details = context.chronologyEvidence(source);
  stopped = 0; details.open = true; details.listeners.toggle(); assert.equal(stopped, 1);
});

test('kaynak çelişkisi özgün belge doğrulaması sayılmaz; açmak oynatmayı durdurur', () => {
  const place = data.window.OM.places.find(p => p.id === 'rumeli-hamidiye');
  const details = context.claimConflictEvidence(place);
  assert.equal(details.children[0].textContent, 'Anlatıdaki kaynak çelişkisi');
  assert.ok(details.children.some(n => /özgün belge karşılaştırması açık/.test(n.textContent)));
  assert.equal(details.children.find(n => n.tag === 'blockquote').textContent, place.claimReview.evidenceText);
  assert.equal(details.children.find(n => n.tag === 'a').href, place.claimReview.url);
  stopped = 0; details.open = true; details.listeners.toggle(); assert.equal(stopped, 1);
  details.open = false; details.listeners.toggle(); assert.equal(stopped, 1);
  for (const field of ['url', 'evidenceText', 'date', 'label', 'limit']) {
    assert.equal(context.claimConflictEvidence({ claimReview: { ...place.claimReview, [field]: '' } }), null);
  }
  assert.equal(context.claimConflictEvidence({ claimReview: { ...place.claimReview, url: 'javascript:alert(1)' } }), null);
  assert.equal(context.claimConflictEvidence({ claimReview: { ...place.claimReview, status: 'iddia_dogrulandi' } }), null);
});

test('çelişki künyesi kurumsal aktarımı tarihsiz özgün belge gibi sunmaz', () => {
  const place = data.window.OM.places.find(p => p.id === 'rumeli-hamidiye'), source = place.claimReview;
  const text = allText(context.claimConflictEvidence(place));
  for (const field of ['bibliography','locator','readingScope','eventDateNote','documentDateNote','publicationDateNote']) assert.ok(text.includes(source[field]), field);
  for (const patch of [{eventDate: '1915-03-18'},{documentDate: ''},{accessDate: '2026-11-03'},{metadataReviewDate: '2026-02-30'},{bibliography: ''}]) {
    const result = allText(context.claimConflictEvidence({claimReview: {...source,...patch}}));
    assert.ok(!result.includes('Künye kontrolü:')); assert.ok(result.includes(source.evidenceText));
  }
});

test('konum kanıtı kapalı başlar, kaynak ve sınırlar korunur; açmak oynatmayı durdurur', () => {
  const place = data.window.OM.places.find(p => p.id === 'anadolu-hamidiye');
  const details = context.coordinateEvidence(place);
  assert.equal(details.children[0].textContent, 'Konum dayanağını göster');
  assert.ok(!details.open);
  assert.ok(allText(details).includes(place.coordinateSource.evidenceText));
  assert.match(allText(details), /tarihsel siper veya birlik mevzii doğrulanmış sayılmaz/);
  assert.match(allText(details), /datum/);
  assert.equal(details.children.find(n => n.tag === 'a').href, place.coordinateSource.url);
  stopped = 0; details.open = true; details.listeners.toggle(); assert.equal(stopped, 1);
  details.open = false; details.listeners.toggle(); assert.equal(stopped, 1);
  assert.equal(context.coordinateEvidence({}), null);
  assert.equal(context.coordinateEvidence({ coordinateSource: { ...place.coordinateSource, url: 'javascript:alert(1)' } }), null);
});

test('coğrafi anlatım incelemesi sayısal koordinat kanıtı gibi etiketlenmez', () => {
  for (const id of ['kanlisirt', 'anafartalar', 'kirte', 'kerevizdere']) {
    const place = data.window.OM.campaign.places.find(p => p.id === id);
    assert.equal(place.coordinateSource, undefined);
    const details = context.coordinateEvidence(place);
    assert.equal(details.children[0].textContent, 'Konum incelemesini göster');
    assert.match(allText(details), /İncelenen kaynak:.*Kaynakta okunan (özgün )?ifade:/);
    assert.match(allText(details), /sayısal noktayı doğrulamaz/);
    assert.doesNotMatch(allText(details), /Konum dayanağı:|Konum kaynağı:|karşılaştırıldı/);
    assert.equal(context.coordinateEvidence({ coordinateReview: { ...place.coordinateReview, url: 'javascript:alert(1)' } }), null);
    const incomplete = context.coordinateEvidence({ coordinateReview: { ...place.coordinateReview, date: '' } });
    assert.match(allText(incomplete), /konum doğrulaması tamamlanmadı/);
    assert.doesNotMatch(allText(incomplete), /coğrafi anlatımı incelendi/);
  }
});

test('İngilizce konum anlatımı özgün dili ve ayrı Türkçe çevirisiyle gösterilir', () => {
  for (const id of ['kirte', 'anafartalar']) {
    const place = data.window.OM.campaign.places.find(p => p.id === id);
    const details = context.coordinateEvidence(place);
    const quote = details.children.find(n => n.tag === 'blockquote');
    assert.equal(quote.lang, 'en');
    assert.equal(quote.textContent, place.coordinateReview.evidenceText);
    assert.ok(allText(details).includes('Türkçe çeviri (atlas): ' + place.coordinateReview.translation));
    const withoutTranslation = context.coordinateEvidence({ coordinateReview: { ...place.coordinateReview, translation: ' ' } });
    assert.doesNotMatch(allText(withoutTranslation), /Türkçe çeviri/);
    const escaped = context.coordinateEvidence({ coordinateReview: { ...place.coordinateReview, translation: '<img onerror=alert(1)>' } });
    assert.ok(escaped.children.some(n => n.tag === 'p' && n.textContent.endsWith('<img onerror=alert(1)>')));
  }
});

test('kart üst bilgisi tekrar eden tarih ve tarafı kaldırır; farklı tarih aralığını korur', () => {
  const body = node('div'); body.replaceChildren = () => { body.children = []; };
  const nodes = { panel: { classList: { add() {} } }, 'panel-title': {}, 'panel-meta': {}, 'panel-body': body };
  const ctx = { panelRevision: 0, document: { getElementById: id => nodes[id], createElement: node },
    textEl: node, findPlace: () => null, narrativeEvidence: () => null,
    Model: context.Model, localHref: value => value || '', closeTools() {} };
  vm.createContext(ctx);
  const start = app.indexOf('  function claimConflictEvidence(');
  vm.runInContext(app.slice(start, app.indexOf('  function paintCurrent(', start)), ctx);
  ctx.fillPanel({ date: '6–9 Ağustos 1915', side: 'İki taraf', meta: '6–9 Ağustos 1915 · plato' });
  assert.equal(nodes['panel-meta'].textContent, '6–9 Ağustos 1915 · İki taraf · plato');
  ctx.fillPanel({ date: '18 Mart 1915', side: 'Osmanlı', meta: 'Osmanlı · 1915–1916 · komuta' });
  assert.equal(nodes['panel-meta'].textContent, '18 Mart 1915 · Osmanlı · 1915–1916 · komuta');
  ctx.fillPanel({ meta: ' · plato · ' });
  assert.equal(nodes['panel-meta'].textContent, 'plato');
});

test('haritadaki kart okuma düğmesi güncel başlığı açar; kart kapanınca gizlenir', () => {
  const body = node('div'); body.replaceChildren = () => { body.children = []; };
  let open = false, focused = 0, stopped = 0, click;
  const panel = { contains: () => false, classList: { add() { open = true; }, remove() { open = false; }, contains: () => open }, scrollIntoView() {} };
  const reader = { hidden: true, setAttribute(key, value) { this[key] = value; }, addEventListener(type, fn) { click = fn; } };
  const title = { setAttribute() {}, focus() { focused++; } };
  const nodes = { panel, 'panel-title': title, 'panel-meta': {}, 'panel-body': body, 'map-read-selection': reader };
  const ctx = { panelRevision: 0, document: { activeElement: {}, getElementById: id => nodes[id], createElement: node },
    textEl: node, findPlace: () => null, narrativeEvidence: () => null, paintIcons() {},
    Model: context.Model, localHref: value => value || '', closeTools() {}, stopPlay() { stopped++; } };
  vm.createContext(ctx);
  let start = app.indexOf('  function claimConflictEvidence(');
  vm.runInContext(app.slice(start, app.indexOf('  function paintCurrent(', start)), ctx);
  start = app.indexOf('  function focusSelectedPanel(');
  vm.runInContext(app.slice(start, app.indexOf('  function goPlace(', start)), ctx);
  start = app.indexOf('  function closePanel()');
  vm.runInContext(app.slice(start, app.indexOf('  function selectPlace(', start)), ctx);
  start = app.indexOf('  var mapReadSelection =');
  vm.runInContext(app.slice(start, app.indexOf('  showTime(450, false);', start)), ctx);
  ctx.fillPanel({ title: 'Birinci kayıt' });
  assert.equal(reader.hidden, false); assert.equal(reader['aria-label'], 'Seçili kartı oku: Birinci kayıt');
  ctx.fillPanel({ title: 'İkinci kayıt' }); const revision = ctx.panelRevision; click();
  assert.equal(reader['aria-label'], 'Seçili kartı oku: İkinci kayıt');
  assert.equal(focused, 1); assert.equal(stopped, 1); assert.equal(panel.returnFocusTarget, reader);
  assert.equal(ctx.panelRevision, revision + 1);
  ctx.closePanel(); assert.equal(reader.hidden, true); assert.equal(panel.inert, true);
});

test('olay kartından mevki kartına dönüş açık isteğe bağlıdır; konumsuz kayıtta gösterilmez', () => {
  const body = node('div'); body.replaceChildren = () => { body.children = []; };
  const nodes = { panel: { classList: { add() {} } }, 'panel-title': {}, 'panel-meta': {}, 'panel-body': body };
  const place = { id: 'mecidiye', name: 'Rumeli Mecidiye Tabyası' };
  let selected, focused = 0;
  const ctx = { panelRevision: 0, document: { getElementById: id => nodes[id], createElement: node }, textEl: node,
    findPlace: id => id === place.id ? place : null, narrativeEvidence: () => null,
    selectMarkerPlace: id => { selected = id; }, focusSelectedPanel: () => { focused++; },
    Model: context.Model, localHref: value => value || '', closeTools() {} };
  vm.createContext(ctx);
  const start = app.indexOf('  function claimConflictEvidence(');
  vm.runInContext(app.slice(start, app.indexOf('  function paintCurrent(', start)), ctx);
  ctx.fillPanel({ placeId: place.id, showPlaceReturn: true });
  const button = body.children.find(n => n.tag === 'button');
  assert.equal(button.textContent, 'Mevki kartını aç: ' + place.name);
  button.listeners.click(); assert.equal(selected, place.id); assert.equal(focused, 1);
  for (const spec of [{ placeId: place.id }, { showPlaceReturn: true }]) {
    ctx.fillPanel(spec); assert.ok(!body.children.some(n => n.tag === 'button'));
  }
});

test('kayıt bağlantısı doğru adresle kopyalanır; izin yoksa bağlantı ve kart korunur', async () => {
  for (const result of ['success', 'denied', 'unavailable']) {
    const body = node('div'); body.replaceChildren = () => { body.children = []; };
    const nodes = { panel: { classList: { add() {} } }, 'panel-title': {}, 'panel-meta': {}, 'panel-body': body };
    let copied, stops = 0;
    const ctx = { panelRevision: 0, URL, window: { location: { href: 'https://onsekizmart.com/' } },
      navigator: result === 'unavailable' ? {} : { clipboard: { async writeText(value) { if (result === 'denied') throw Error('denied'); copied = value; } } },
      document: { getElementById: id => nodes[id], createElement: node }, textEl: node,
      findPlace: () => null, narrativeEvidence: () => null, stopPlay() { stops++; },
      Model: context.Model, localHref: value => value && value.startsWith('/?') ? value : '', closeTools() {} };
    vm.createContext(ctx);
    const start = app.indexOf('  function claimConflictEvidence(');
    vm.runInContext(app.slice(start, app.indexOf('  function paintCurrent(', start)), ctx);
    ctx.fillPanel({ title: 'Seçili kayıt', shareHref: '/?mevki=mecidiye#harita' });
    const button = body.children.find(n => n.textContent === 'Bağlantıyı kopyala');
    await button.listeners.click();
    const status = body.children.find(n => n.role === 'status');
    assert.equal(button.disabled, false); assert.equal(status.hidden, false); assert.equal(stops, 1);
    assert.equal(nodes['panel-title'].textContent, 'Seçili kayıt');
    if (result === 'success') { assert.equal(copied, 'https://onsekizmart.com/?mevki=mecidiye#harita'); assert.match(status.textContent, /kopyalandı/); }
    else assert.match(status.textContent, /kopyalanamadı.*Bu kayda bağlantı/);
    assert.ok(body.children.some(n => n.tag === 'a' && n.href === '/?mevki=mecidiye#harita'));
  }
});

test('geçersiz tarih veya kaynak türüne uymayan statü konum doğrulaması üretmez', () => {
  const numeric = data.window.OM.places.find(p => p.id === 'anadolu-hamidiye').coordinateSource;
  const review = data.window.OM.campaign.places.find(p => p.id === 'kirte').coordinateReview;
  const cases = [
    ...['2026-02-30', '2026-13-01', '20.10.2026', '2026-1-1', ' '].map(date => ({ coordinateSource: { ...numeric, date } })),
    { coordinateSource: { ...numeric, status: 'iddia_dogrulandi' } },
    { coordinateSource: { ...numeric, status: review.status } },
    { coordinateReview: { ...review, status: numeric.status } }
  ];
  for (const place of cases) {
    const text = allText(context.coordinateEvidence(place));
    assert.match(text, /geçersiz; konum doğrulaması tamamlanmadı/);
    assert.doesNotMatch(text, /karşılaştırıldı|coğrafi anlatımı incelendi|Konum inceleme tarihi:/);
  }
  assert.match(allText(context.coordinateEvidence({ coordinateReview: { ...review, date: '2024-02-29' } })), /coğrafi anlatımı incelendi/);
});


test('beş AWM daktilo kaydı bağlam, erişim ve bilinmeyen belge/yayım tarihlerini ayırır', () => {
  const records = data.window.OM.places.filter(p => p.narrativeSource);
  assert.equal(records.length, 5);
  assert.equal(new Set(records.map(p => p.narrativeSource.witnessGroup)).size, 1);
  for (const place of records) {
    const source = place.narrativeSource, text = allText(context.narrativeEvidence(place));
    assert.equal(source.eventDate, '1915-03-18'); assert.equal(source.accessDate, '2026-10-19');
    assert.equal(source.documentDate, null); assert.equal(source.publicationDate, null);
    for (const key of ['bibliography','locator','eventScope','documentDateNote','publicationDateNote','readingScope']) assert.ok(text.includes(source[key]), place.id + ':' + key);
    assert.match(text, /Bean koleksiyonunda saklanan/); assert.match(text, /Belge tarihi: ayrıca belirlenmedi/);
    assert.match(text, /Yayım tarihi: ayrıca belirlenmedi/); assert.match(text, /Görüntünün incelendiği tarih: 2026-10-19/);
  }
});

test('daktilo kanıtı eksik künye veya tarih ayrımıyla gösterilmez; ek kontrol tarihi yayım tarihi yapılmaz', () => {
  const source = data.window.OM.places.find(p => p.id === 'ocean').narrativeSource;
  for (const changes of [{bibliography: ''},{locator: ' '},{eventDate: '1915-02-30'},{accessDate: '2026-10-20'},{documentDate: '1915-03-99'},{publicationDate: undefined},{publicationDateNote: ''},{readingScope: ''}]) {
    assert.equal(context.narrativeEvidence({narrativeSource: {...source, ...changes}}), null);
  }
  const text = allText(context.narrativeEvidence({narrativeSource: source}));
  assert.match(text, /resmî yayımın incelenme tarihi · 2026-10-20/);
  assert.doesNotMatch(text, /resmî yayım · 2026-10-20/);
});


test('üç Gazette karşılaştırması 18Mart olayını,24Mart raporu,26Mart üst yazısı ve1919yayımını ayrı gösterir', () => {
  const places = data.window.OM.places.filter(p => p.narrativeSource && p.narrativeSource.publishedComparison);
  assert.equal(places.length, 3);
  for (const place of places) {
    const comparison = place.narrativeSource.publishedComparison, text = allText(context.narrativeEvidence(place));
    assert.equal(comparison.eventDate, '1915-03-18'); assert.equal(comparison.documentDate, '1915-03-24');
    assert.equal(comparison.coverLetterDate, '1915-03-26'); assert.equal(comparison.publicationDate, '1919-05-02');
    assert.equal(comparison.accessDate, '2026-10-20'); assert.equal(comparison.metadataReviewDate, '2026-11-03');
    assert.equal(comparison.witnessGroup, place.narrativeSource.witnessGroup);
    assert.match(text, /Rapor: 1915-03-24 · Üst yazı: 1915-03-26 · Resmî yayım: 1919-05-02/);
    for (const field of ['bibliography','locator','eventStage','documentDateNote','readingScope']) assert.ok(text.includes(comparison[field]), place.id + ':' + field);
    assert.match(text, /bağımsız iki tanıklık sayılmaz/);
  }
});

test('eksik veya tutarsız yayım tarihi ve tanık zinciri ek kontrolü doğrulanmış gibi göstermez', () => {
  const source = data.window.OM.places.find(p => p.id === 'inflexible').narrativeSource;
  for (const patch of [{publicationDate: null},{documentDate: '1915-02-30'},{accessDate: '2026-11-03'},{locator: ''},{bibliography: ''},{eventStage: ''},{metadataReviewDate: 'dün'},{witnessGroup: 'farklı-tanık'}]) {
    const result = context.narrativeEvidence({narrativeSource: {...source,publishedComparison: {...source.publishedComparison,...patch}}});
    assert.ok(!allText(result).includes('Ek kontrol: resmî yayım'));
    assert.ok(allText(result).includes(source.evidenceText));
  }
});


test('Kilitbahir konum künyesi güncel ziyaret dayanağını 1915 olay tarihine çevirmeden gösterir', () => {
  const place = data.window.OM.places.find(p => p.id === 'kilitbahir'), source = place.coordinateSource;
  const text = allText(context.coordinateEvidence(place));
  assert.equal(place.lat, 40.146554); assert.equal(place.lng, 26.380381);
  assert.equal(source.eventDate, null); assert.equal(source.documentDate, null); assert.equal(source.publicationDate, null);
  assert.equal(source.accessDate, '2026-10-20'); assert.equal(source.metadataReviewDate, '2026-11-03');
  for (const field of ['bibliography','locator','sourceKind','eventDateNote','documentDateNote','publicationDateNote','readingScope']) assert.ok(text.includes(source[field]), field);
  assert.match(text, /jeodezik referans sistemini/); assert.match(text, /1915 mevzi tespiti yapılmadı/);
});

test('eksik konum künyesi yeni tarih alanlarını kanıtlaştırmaz; mevcut incelenmiş ziyaret dayanağı korunur', () => {
  const place = data.window.OM.places.find(p => p.id === 'kilitbahir');
  for (const patch of [{publicationDate: undefined},{documentDate: '1915-02-30'},{accessDate: '2026-11-03'},{bibliography: ''},{metadataReviewDate: 'dün'}]) {
    const text = allText(context.coordinateEvidence({...place, coordinateSource: {...place.coordinateSource,...patch}}));
    assert.ok(!text.includes('Künye kontrolü:'));
    assert.ok(text.includes(place.coordinateSource.evidenceText));
  }
});

test('kampanyanın dört coğrafi künyesi nokta doğrulamasını ve iki dildeki pasajları karıştırmaz', () => {
  const places = data.window.OM.campaign.places.filter(p => p.coordinateReview);
  assert.equal(places.length, 4);
  for (const place of places) {
    const source = place.coordinateReview, text = allText(context.coordinateEvidence(place));
    assert.equal(source.status, 'anlatim_incelendi_nokta_dogrulanmadi');
    assert.equal(source.eventDate, null); assert.equal(source.documentDate, null); assert.equal(source.publicationDate, null);
    assert.equal(source.accessDate, source.date);
    for (const field of ['bibliography','locator','readingScope']) assert.ok(text.includes(source[field]), place.id + ':' + field);
    assert.ok(text.includes(source.evidenceText));
    if (source.evidenceLanguage === 'en') {
      assert.ok(text.includes(source.translation));
      assert.equal(context.coordinateEvidence(place).children.find(n => n.tag === 'blockquote').lang, 'en');
      assert.match(text, /bağımsız ikinci kaynak değildir/);
    }
    assert.match(text, /haritadaki sayısal noktayı doğrulamaz/);
  }
});

test('üç coğrafi anlatım künyesi sayısal nokta doğrulamasına dönüşmez', () => {
  const places = data.window.OM.places.filter(p => p.coordinateReview);
  assert.equal(places.length, 3);
  for (const place of places) {
    const source = place.coordinateReview, text = allText(context.coordinateEvidence(place));
    assert.equal(source.status, 'anlatim_incelendi_nokta_dogrulanmadi');
    assert.equal(source.eventDate, null); assert.equal(source.documentDate, null);
    assert.equal(source.accessDate, source.date); assert.equal(source.metadataReviewDate, '2026-11-03');
    for (const field of ['bibliography','locator','readingScope','publicationDateNote']) assert.ok(text.includes(source[field]), place.id + ':' + field);
    assert.match(text, /sayısal|koordinat/i);
  }
  const portal = places.find(p => p.id === 'dardanos').coordinateReview;
  assert.equal(portal.publicationDate, '2013-02-25'); assert.equal(portal.modifiedDate, '2019-04-03');
});

test('altı Alan Başkanlığı ziyaret künyesi güncel gezi noktası ve bilinmeyen yayım tarihini açık tutar', () => {
  const places = data.window.OM.places.filter(p => p.coordinateSource && p.coordinateSource.bibliography && p.coordinateSource.sourceKind === 'Güncel kurumsal ziyaret rehberi');
  assert.equal(places.length, 6);
  for (const place of places) {
    const source = place.coordinateSource, text = allText(context.coordinateEvidence(place));
    assert.equal(source.eventDate, null); assert.equal(source.documentDate, null); assert.equal(source.publicationDate, null);
    assert.equal(source.accessDate, '2026-10-20'); assert.equal(source.metadataReviewDate, '2026-11-03');
    assert.ok(text.includes(source.bibliography)); assert.ok(text.includes(source.locator));
    assert.match(text, /tarihlenmiş tek bir muharebe olayını göstermez/);
    assert.match(text, /telif yılı yayım tarihi sayılmadı/);
    assert.equal(source.status, 'kurumsal_ziyaret_noktasi_karsilastirildi');
  }
});

test('portal eklenme tarihi ile modern enkaz araştırmasının yayım yılı ölçüm veya muharebe tarihi yapılmaz', () => {
  const castle = data.window.OM.places.find(p => p.id === 'cimenlik'), wreck = data.window.OM.places.find(p => p.id === 'irresistible');
  assert.equal(castle.coordinateSource.publicationDate, '2014-07-18');
  assert.equal(castle.coordinateSource.modifiedDate, '2022-02-28');
  assert.equal(wreck.coordinateSource.publicationDate, null); assert.equal(wreck.coordinateSource.publicationYear, '2023');
  for (const place of [castle,wreck]) {
    const source = place.coordinateSource, text = allText(context.coordinateEvidence(place));
    assert.equal(source.eventDate, null); assert.equal(source.documentDate, null);
    assert.ok(text.includes(source.bibliography)); assert.ok(text.includes(source.locator));
    assert.ok(text.includes(source.publicationDateNote)); assert.ok(text.includes(source.readingScope));
    assert.match(text, /datum/);
  }
  assert.match(allText(context.coordinateEvidence(wreck)), /zayiat ve batış saati anlatısı doğrulanmış sayılmaz/);
  assert.match(allText(context.coordinateEvidence(wreck)), /Yayım tarihi: 2023 \(gün ve ay belirlenmedi\)/);
});
