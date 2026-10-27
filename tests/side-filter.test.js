const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
function fragment(start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `Application functions found: ${start}`);
  return source.slice(from, to);
}

function setup() {
  const data = { window: {} };
  vm.createContext(data);
  for (const file of ['data.js', 'campaign.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), data);
  }
  const D = data.window.OM;
  const places = D.places.concat(D.campaign.places);
  const nodes = new Map();
  const enabledLayers = new Set();
  const groups = {};
  for (const type of new Set(D.layers.map(layer => layer.id).concat('kampanya'))) {
    const members = new Set();
    groups[type] = {
      members,
      hasLayer: marker => members.has(marker),
      addLayer: marker => members.add(marker),
      removeLayer: marker => members.delete(marker),
      addTo(map) { enabledLayers.add(this); }
    };
    enabledLayers.add(groups[type]);
  }
  const markers = {};
  places.forEach(place => {
    markers[place.id] = { id: place.id };
    groups[place.type].addLayer(markers[place.id]);
  });
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, {
      textContent: '', attributes: {}, hidden: false,
      setAttribute(name, value) { this.attributes[name] = value; },
      replaceChildren(...children) { this.textContent = children.join(''); }
    });
    return nodes.get(id);
  }
  const ctx = {
    D, markers, groups, panelRevision: 0,
    mode: 'naval', sideFilter: 'both', campSide: 'all', campDomain: 'all',
    navalMinute: 450, navalSelection: D.events[0], campIndex: 0, campSelection: null,
    range: Object.assign(node('tl-range'), { value: '450' }), clock: node('clock'), tlEvent: node('tl-event'),
    map: {
      hasLayer: layer => enabledLayers.has(layer),
      removeLayer: layer => enabledLayers.delete(layer),
      setView() { throw Error('Changing a filter must preserve the map view'); },
      flyTo() { throw Error('Changing a filter must not move the map'); }
    },
    allPlaces: () => places,
    document: { getElementById: node, querySelectorAll: () => [], createTextNode: text => text },
    textEl: (tag, text) => text,
    trackFilter() {}, renderEvents() {}, renderCampList() {}, paintCurrent() {},
    stopPlay() { ctx.stops = (ctx.stops || 0) + 1; },
    fillFromNaval(event, fly) { assert.equal(fly, false); ctx.shown = event; },
    fillFromCamp(event, fly) { assert.equal(fly, false); ctx.shown = event; },
    closePanel() { ctx.closed = (ctx.closed || 0) + 1; }
  };
  vm.createContext(ctx);
  vm.runInContext(fragment('  function navalTimeLabel(', '  function fillFromNaval(') + '\n' +
    fragment('  function navalEvents(', '  function focusPlaybackMap(') + '\n' +
    fragment('  function refreshCampRange(', '  function stepTime('), ctx);
  return { ctx, node, enabledLayers, places };
}

test('İtilaf seçimi başlangıçtaki Osmanlı kaydını ilk uygun İtilaf kaydıyla değiştirir', () => {
  const { ctx, node } = setup();
  assert.equal(ctx.navalSelection.side, 'turk');
  ctx.setSide('itilaf');
  assert.equal(ctx.range.value, '510');
  assert.equal(ctx.navalMinute, 510);
  assert.equal(ctx.shown, ctx.D.events.find(event => event.side === 'itilaf'));
  assert.equal(ctx.navalSelection.side, 'itilaf');
  assert.match(node('side-filter-status').textContent, /ilk kayıt açıldı/);
  assert.match(node('side-filter-status').textContent, /İtilaf: 20 kayıt/);
  assert.equal(node('tl-itilaf').attributes['aria-pressed'], 'true');
  assert.equal(node('tl-turk').attributes['aria-pressed'], 'false');
  assert.equal(ctx.panelRevision, 1);
});

test('ortak olay iki taraf seçiminde de aynı kayıt olarak korunur ve kapsamı açıklanır', () => {
  const { ctx, node } = setup();
  const shared = ctx.D.events.find(event => event.side === 'both');
  ctx.range.value = String(shared.m);
  ctx.navalSelection = shared;
  for (const side of ['itilaf', 'turk']) {
    ctx.setSide(side);
    assert.equal(ctx.navalSelection, shared);
    assert.equal(ctx.shown, shared);
    assert.equal(ctx.range.value, String(shared.m));
    assert.match(node('side-filter-status').textContent, /4 ortak kayıt bu seçime dahildir/);
  }
});

test('cephede İtilaf seçildikten sonra 18 Marta dönüş ilk uygun deniz kaydını açar', () => {
  const { ctx, node } = setup();
  ctx.hint = null;
  ctx.applyDateLayers = () => {};
  vm.runInContext(fragment('  function setMode(', '  range.addEventListener("input"'), ctx);
  ctx.setMode('camp');
  ctx.setSide('itilaf');
  assert.equal(ctx.navalMinute, 450);
  ctx.setMode('naval');
  assert.equal(ctx.mode, 'naval');
  assert.equal(ctx.range.value, '510');
  assert.equal(ctx.shown.side, 'itilaf');
  assert.match(node('side-filter-status').textContent, /İtilaf: 20 kayıt/);
});

test('harita işaretleri olay konumlarından süzülür; İtilaf olayının tabya konumu korunur', () => {
  const { ctx, places, enabledLayers } = setup();
  const originalData = JSON.stringify(ctx.D);
  const originalLayers = new Set(enabledLayers);
  ctx.setSide('itilaf');
  const eventPlaces = new Set(ctx.D.events.filter(event => ['itilaf', 'both'].includes(event.side)).map(event => event.place));
  for (const place of places) {
    assert.equal(ctx.groups[place.type].hasLayer(ctx.markers[place.id]), eventPlaces.has(place.id), place.id);
  }
  assert.equal(ctx.groups.tabya.hasLayer(ctx.markers.cimenlik), true);
  assert.equal(ctx.groups.birlik.hasLayer(ctx.markers['tumen-19']), false);
  assert.deepEqual(enabledLayers, originalLayers);
  assert.equal(JSON.stringify(ctx.D), originalData, 'No allegiance or geographical data is invented');
});

test('Süzgeci temizle tarafı ve alanı sıfırlar, seçili uyumlu kaydı ve kapalı katmanı korur', () => {
  const { ctx, node, enabledLayers, places } = setup();
  ctx.setSide('itilaf');
  ctx.campDomain = 'kara';
  const selected = ctx.navalSelection;
  const position = ctx.range.value;
  enabledLayers.delete(ctx.groups.gemi);
  const before = new Set(enabledLayers);
  ctx.clearFilters();
  assert.equal(ctx.sideFilter, 'both');
  assert.equal(ctx.campSide, 'all');
  assert.equal(ctx.campDomain, 'all');
  assert.equal(ctx.navalSelection, selected);
  assert.equal(ctx.range.value, position);
  assert.deepEqual(enabledLayers, before);
  for (const place of places) assert.equal(ctx.groups[place.type].hasLayer(ctx.markers[place.id]), true);
  assert.match(node('side-filter-status').textContent, /Süzgeçler temizlendi/);
  assert.match(node('side-filter-status').textContent, /İki taraf: 31 kayıt/);
});

test('cephe taraf ve kara süzgeçleri birlikte çalışır, temizleme mevcut ortak olayı korur', () => {
  const { ctx, node } = setup();
  ctx.mode = 'camp';
  const selected = ctx.D.campaign.events.find(event => event.side === 'both' && event.domain === 'kara');
  ctx.campSelection = selected;
  ctx.setSide('itilaf');
  ctx.setDomain('kara');
  const expected = ctx.D.campaign.events.filter(event => ['itilaf', 'both'].includes(event.side) && ['kara', 'ikisi'].includes(event.domain));
  assert.deepEqual(Array.from(ctx.campEvents()), Array.from(expected));
  assert.equal(ctx.shown, selected);
  const eventPlaces = new Set(expected.map(event => event.place));
  for (const place of ctx.allPlaces()) assert.equal(ctx.groups[place.type].hasLayer(ctx.markers[place.id]), eventPlaces.has(place.id), place.id);
  ctx.clearFilters();
  assert.equal(ctx.campSelection, selected);
  assert.deepEqual(Array.from(ctx.campEvents()), Array.from(ctx.D.campaign.events));
  assert.match(node('timeline-filter-status').textContent, /korunuyor/);
  assert.ok(node('side-filter-status').textContent.includes(`İki taraf: ${ctx.D.campaign.events.length} kayıt`));
});

test('uygun deniz kaydı yoksa eski kart yerine boş durum ve sıfır sonuç gösterilir', () => {
  const { ctx, node } = setup();
  ctx.D.events = ctx.D.events.filter(event => event.side === 'turk');
  ctx.setSide('itilaf');
  assert.equal(ctx.navalSelection, null);
  assert.equal(ctx.closed, 1);
  assert.match(ctx.tlEvent.textContent, /gösterilecek kayıt yok/);
  assert.match(node('side-filter-status').textContent, /İtilaf: 0 kayıt/);
  for (const place of ctx.allPlaces()) assert.equal(ctx.groups[place.type].hasLayer(ctx.markers[place.id]), false);
});

test('mobilde taraf seçimi ve temizleme açık süzgeci ve basılan düğmenin odağını korur', () => {
  for (const controlId of ['tl-itilaf', 'filter-clear']) {
    const { ctx, node } = setup();
    const classes = new Set(['is-filter-open']);
    ctx.document.body = { classList: {
      contains: name => classes.has(name),
      add: name => classes.add(name),
      remove: (...names) => names.forEach(name => classes.delete(name))
    } };
    ctx.window = { matchMedia: () => ({ matches: true }) };
    const control = node(controlId);
    const toggle = node('tool-filter');
    for (const target of [control, toggle]) {
      target.isConnected = true;
      target.closest = () => null;
      target.getClientRects = () => [{}];
      target.focus = options => {
        assert.equal(options.preventScroll, true);
        ctx.document.activeElement = target;
      };
    }
    node('filter-pop').contains = target => target === control;
    node('search-pop').contains = () => false;
    node('layers').contains = () => false;
    ctx.document.activeElement = control;
    vm.runInContext(fragment('  function closeTools(', '  function syncToolLayout('), ctx);
    let panelClosedTools = false;
    ctx.fillFromNaval = () => {
      ctx.closeTools();
      panelClosedTools = !classes.has('is-filter-open');
      assert.equal(ctx.document.activeElement, toggle);
    };
    if (controlId === 'filter-clear') {
      ctx.sideFilter = 'itilaf';
      ctx.campSide = 'itilaf';
      ctx.clearFilters();
      assert.match(node('side-filter-status').textContent, /Süzgeçler temizlendi/);
    } else {
      ctx.setSide('itilaf');
      assert.match(node('side-filter-status').textContent, /İtilaf: 20 kayıt/);
    }
    assert.equal(panelClosedTools, true, 'The real panel-closing path was exercised');
    assert.equal(classes.has('is-filter-open'), true);
    assert.equal(toggle.attributes['aria-expanded'], 'true');
    assert.equal(ctx.document.activeElement, control);
  }
});

test('kapalı süzgeç programlı taraf değişimiyle açılmaz ve başka öğenin odağını almaz', () => {
  const { ctx } = setup();
  const classes = new Set();
  let focuses = 0;
  ctx.document.body = { classList: { contains: name => classes.has(name), add: name => classes.add(name) } };
  const originalFocus = { focus() { focuses++; } };
  ctx.document.activeElement = originalFocus;
  ctx.setSide('itilaf');
  assert.equal(classes.size, 0);
  assert.equal(ctx.document.activeElement, originalFocus);
  assert.equal(focuses, 0);
});

test('aramadan süzgeç dışı mevki seçmek tarafı veya kara alanını açıp istenen mevkiyi gösterir', () => {
  for (const mode of ['naval', 'camp']) {
    const { ctx, node, places } = setup();
    ctx.mode = mode;
    if (mode === 'naval') ctx.setSide('itilaf');
    else ctx.setDomain('kara');
    const place = places.find(item => item.id === (mode === 'naval' ? 'tumen-19' : 'nusret'));
    assert.equal(ctx.groups[place.type].hasLayer(ctx.markers[place.id]), false);
    ctx.findPlace = id => places.find(item => item.id === id);
    ctx.revealDock = () => {};
    ctx.trackMapSelect = () => {};
    let opened;
    ctx.openPlace = (id, fly) => { opened = { id, fly }; };
    vm.runInContext(fragment('  function selectPlace(', '  function addMarker('), ctx);
    const originalData = JSON.stringify(ctx.D);
    ctx.selectPlace(place.id, true);
    assert.deepEqual(opened, { id: place.id, fly: true });
    assert.equal(ctx.sideFilter, 'both');
    assert.equal(ctx.campSide, 'all');
    assert.equal(ctx.campDomain, 'all');
    assert.equal(ctx.groups[place.type].hasLayer(ctx.markers[place.id]), true);
    assert.match(node('side-filter-status').textContent, /Seçilen mevki süzgecin dışındaydı; tüm kayıtlar açıldı/);
    assert.equal(JSON.stringify(ctx.D), originalData);
  }
});

test('İtilaf olayının tabya mevkiini seçmek geçerli taraf süzgecini sıfırlamaz', () => {
  const { ctx, node, places } = setup();
  ctx.setSide('itilaf');
  ctx.findPlace = id => places.find(item => item.id === id);
  ctx.revealDock = () => {};
  ctx.trackMapSelect = () => {};
  ctx.openPlace = () => assert.fail('The matching Allied event should be selected');
  vm.runInContext(fragment('  function selectPlace(', '  function addMarker('), ctx);
  ctx.selectPlace('cimenlik', false);
  assert.equal(ctx.sideFilter, 'itilaf');
  assert.equal(ctx.navalSelection.place, 'cimenlik');
  assert.equal(ctx.navalSelection.side, 'itilaf');
  assert.equal(node('tl-itilaf').attributes['aria-pressed'], 'true');
});
