const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(read('js/data.js') + '\n' + read('js/campaign.js'), ctx);
const data = ctx.window.OM;

test('harita sayıları geçerlidir; nokta koordinatı ile çizgi köşesi ayrı tutulur', () => {
  const points = [...data.places, ...data.campaign.places];
  assert.equal(new Set(points.map(p => p.id)).size, points.length);
  const check = ([lat, lng]) => {
    assert.ok(Number.isFinite(lat) && lat >= -90 && lat <= 90);
    assert.ok(Number.isFinite(lng) && lng >= -180 && lng <= 180);
  };
  points.forEach(p => check([p.lat, p.lng]));
  data.lines.forEach(line => { assert.ok(line.latlngs.length >= 2); line.latlngs.forEach(check); });
  data.mineLines.forEach(line => { check(line.a); check(line.b); });
});

test('Conkbayırı güncel kurumsal ziyaret noktasıdır; tarihsel siper diye doğrulanmaz', () => {
  const p = data.campaign.places.find(p => p.id === 'conkbayiri');
  const source = p.coordinateSource;
  const coords = source.evidenceText.match(/destination=([\d.]+), ([\d.]+)/);
  assert.equal(p.lat, Number(coords[1]));
  assert.equal(p.lng, Number(coords[2]));
  assert.equal(source.status, 'kurumsal_ziyaret_noktasi_karsilastirildi');
  assert.match(source.url, /canakkaletarihialan.gov.tr\/tr\/ziyaret\/.+/);
  assert.match(source.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(p.accuracy, 'yaklasik');
  assert.match(p.uncertainty, /1915 siperlerinin/);
  assert.match(p.meta, /günümüzdeki anıt/);
});

test('mayın anlatısının kanıtı sayısal çizgi doğrulamasına dönüştürülmez', () => {
  assert.equal(data.mineReview.status, 'anlati_incelendi_geometri_dogrulanmadi');
  assert.ok(data.mineReview.url && data.mineReview.evidenceText && data.mineReview.date);
  assert.match(data.mineReview.limit, /sayısal çizgi geometrisini doğrulamaz/);
  const line = data.lines.find(line => line.id === 'nusret-hat');
  assert.match(line.note, /uç noktaları, uzunluğu ve mayın aralıkları/);
  assert.doesNotMatch(line.note, /100.?150/);
  assert.doesNotMatch(data.disclaimer, /birkaç yüz metre/);
});

test('mayın çizgisi kartı oynatmayı durdurur ve eski işaret seçimini temizler', () => {
  const source = read('js/app.js');
  let shown, stops = 0, focused = 0, painted = 0;
  const c = { D: data, activeId: 'ocean', stopPlay() { stops++; }, revealDock() {},
    fillPanel(spec) { shown = spec; }, paintIcons() { painted++; }, focusSelectedPanel() { focused++; } };
  vm.createContext(c);
  vm.runInContext(source.slice(source.indexOf('  function showMapLine('), source.indexOf('  function sourceText(')), c);
  c.showMapLine(data.mineLines[0], true);
  assert.equal(c.activeId, null);
  assert.equal(stops, 1); assert.equal(focused, 1); assert.equal(painted, 1);
  assert.match(shown.text, /tarihî hat numarası olarak doğrulanmadı/);
  assert.match(shown.source, /çizgi geometrisi doğrulanmadı/);
  assert.equal(shown.sourceUrl, data.mineReview.url);
  assert.equal(shown.reviewHref, '/nasil-okunur/#konum-denetimi');
  c.showMapLine(data.lines.find(line => line.id === 'nusret-hat'));
  assert.match(shown.accuracy, /köşeleri mayın veya gemi koordinatı değildir/);
  c.showMapLine(data.lines.find(line => line.id === 'hat-a'));
  assert.equal(shown.sourceUrl, '');
  assert.match(shown.meta, /Filo/);
});

test('çizgi klavyeyle açılır; katman yeniden açılırken etiket ve tek etkinleştirme korunur', () => {
  const source = read('js/app.js');
  const element = { setAttribute(k, v) { this[k] = v; } };
  const handlers = {};
  const layer = { getElement: () => element, on(name, callback) { handlers[name] = callback; } };
  let opened = 0, returned;
  const c = { showMapLine(line, transverse, trigger) { opened++; returned = trigger; assert.equal(transverse, true); } };
  vm.createContext(c);
  vm.runInContext(source.slice(source.indexOf('  function bindMapLine('), source.indexOf('  function sourceText(')), c);
  c.bindMapLine(layer, data.mineLines[0], true);
  assert.equal(element['aria-label'], 'Enlemesine hat 1 · şematik gösterim');
  assert.equal(element.tabindex, '0');
  assert.equal(element.role, 'button');
  const key = (value, extra = {}) => element.onkeydown({ key: value, preventDefault() {}, stopPropagation() {}, ...extra });
  key('Enter'); assert.equal(opened, 1); assert.equal(returned, element);
  key('Enter', { repeat: true }); key('ArrowRight'); key(' ', { ctrlKey: true });
  assert.equal(opened, 1);
  handlers.add(); key(' '); assert.equal(opened, 2);
  handlers.click(); assert.equal(opened, 3);
});
