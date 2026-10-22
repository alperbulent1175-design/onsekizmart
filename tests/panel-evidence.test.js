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
    assert.ok(allText(details).includes('Ek kontrol: resmî yayım · 2026-10-20'));
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
