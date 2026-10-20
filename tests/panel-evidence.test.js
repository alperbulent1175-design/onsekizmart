const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const app = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
function node(tag, text) { return { tag, textContent: text || '', children: [], listeners: {}, addEventListener(type, callback) { this.listeners[type] = callback; }, appendChild(child) { this.children.push(child); } }; }
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
    assert.equal(evidence.children.filter(n => n.tag === 'a').length, 2);
  }
});
test('eksik veya güvenli olmayan kanıt bağlantıları gösterilmez; kanıt metni HTML olarak işlenmez', () => {
  const source = { ...data.window.OM.places.find(p => p.id === 'ocean').narrativeSource };
  assert.equal(context.narrativeEvidence({ narrativeSource: { ...source, url: 'javascript:alert(1)' } }), null);
  assert.equal(context.narrativeEvidence({ narrativeSource: { ...source, date: '' } }), null);
  assert.equal(context.narrativeEvidence({}), null);
  const evidence = context.narrativeEvidence({ narrativeSource: { ...source, evidenceText: '<img onerror=alert(1)>', imageUrl: 'javascript:alert(1)' } });
  assert.equal(evidence.children.find(n => n.tag === 'blockquote').textContent, '<img onerror=alert(1)>');
  assert.equal(evidence.children.filter(n => n.tag === 'a').length, 1);
});

for (const query of ['?mevki=ocean', '?olay=test', '?dakika=450']) {
  test('gecikmeli açılış bağlantısı yeni seçimi veya kapanmış kartı ezmez: ' + query, () => {
    const pending = []; let selected = 0, restored = 0;
    const ev = { m: 450, title: 'Test', id: 'test' };
    const ctx = { panelRevision: 1, URLSearchParams, restoreAtlasView() { restored++; },
      window: { location: { search: query, hash: '#harita' }, setTimeout: cb => pending.push(cb) },
      document: { getElementById: () => null }, findCampByKey: () => ev, findPlace: () => ({}),
      scrollToMap() {}, selectPlace() { selected++; }, focusCampEvent() { selected++; }, showTime() { selected++; },
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
  const ctx = { panelRevision: 2, scrollToMap() {}, motionOn: () => true,
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
  const text = body.children.map(child => child.textContent).join(' ');
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
  const text = body.children.map(child => child.textContent).join(' ');
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
