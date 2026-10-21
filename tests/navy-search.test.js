const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('gemi araması Türkçe harfleri, boş sonucu, temizlemeyi ve gizli karta bağlantıyı yönetir', () => {
  function node(extra = {}) {
    return Object.assign({ value: '', handlers: {}, addEventListener(name, fn) { this.handlers[name] = fn; },
      appendChild(child) { (this.children ||= []).push(child); }, setAttribute(key, value) { this[key] = value; }, focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; } }, extra);
  }
  const share = node();
  const nameOnly = node({ checked: false });
  const form = node({ hidden: true }), input = node(), clear = node(), status = node();
  const cards = [node({ id: 'muavenet', textContent: 'Muavenet-i Milliye Osmanlı' }), node({ id: 'ocean', textContent: 'HMS Ocean Britanya' })];
  const oceanMap = node({ href: '/?mevki=ocean#harita' });
  cards.forEach(card => { card.querySelectorAll = () => card.id === 'ocean' ? [oceanMap] : []; });
  cards.forEach(card => { card.querySelector = () => ({ textContent: card.id === 'ocean' ? 'HMS Ocean' : 'Muavenet-i Milliye' }); });
  const elements = { 'navy-search-link': share, 'navy-name-only': nameOnly, 'navy-search': form, 'navy-query': input, 'navy-clear': clear, 'navy-results': status };
  const groups = cards.map((card, i) => node({ querySelectorAll: () => [card], querySelector: () => ({ id: 'group-' + i }) }));
  const win = node(), location = { origin: 'https://onsekizmart.com', hash: '', href: 'https://onsekizmart.com/donanma/?ref=koru', search: '?ref=koru' };
  win.location = location;
  win.history = { state: null, replaceState(state, title, value) {
    location.href = value; const parsed = new URL(value); location.search = parsed.search;
  } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/navy-search.js'), 'utf8'), {
    document: { createElement: () => node(), getElementById: id => elements[id], querySelectorAll: selector => selector === '.ship-card' ? cards : groups }, window: win, location, URLSearchParams, URL
  });
  assert.equal(form.hidden, false);
  assert.equal(cards[0].children[0].href, '#navy-search');
  location.hash = '#navy-search'; win.handlers.hashchange(); assert.ok(input.focused); input.focused = false;
  assert.match(status.textContent, /2 \/ 2/);
  input.value = 'Britanya'; input.handlers.input(); assert.equal(cards[1].hidden, false);
  nameOnly.checked = true; nameOnly.handlers.change(); assert.ok(cards.every(card => card.hidden));
  input.value = 'ocean'; input.handlers.input(); assert.equal(cards[1].hidden, false);
  assert.match(status.textContent, /Yalnız adlarda/);
  assert.equal(share.href, '/donanma/?q=ocean&ad=1#navy-search');
  assert.equal(new URL(oceanMap.href, location.href).searchParams.get('donanmayaDon'), '/donanma/?q=ocean&ad=1#ocean');
  assert.equal(new URL(location.href).searchParams.get('q'), 'ocean');
  assert.equal(new URL(location.href).searchParams.get('ad'), '1');
  assert.equal(new URL(location.href).searchParams.get('ref'), 'koru');
  nameOnly.checked = false; nameOnly.handlers.change();

  input.value = 'MİLLİYE osmanli'; input.handlers.input();
  assert.equal(cards[0].hidden, false); assert.equal(cards[1].hidden, true);
  input.value = 'bulunmayan'; input.handlers.input();
  assert.ok(groups[1].hidden);
  assert.ok(cards.every(card => card.hidden)); assert.match(status.textContent, /Eşleşen kayıt yok/);
  location.hash = '#ocean'; win.handlers.hashchange();
  assert.equal(input.value, ''); assert.equal(cards[1].hidden, false); assert.ok(cards[1].scrolled);
  input.value = 'bulunmayan'; input.handlers.input();
  win.handlers.click({ target: { closest: () => ({ getAttribute: () => '#ocean' }) } });
  assert.equal(input.value, ''); assert.equal(cards[1].hidden, false);
  win.handlers.click({ target: {} });
  input.value = 'bulunmayan'; input.handlers.input();
  win.handlers.click({ ctrlKey: true, target: { closest: () => ({ getAttribute: () => '#ocean' }) } });
  assert.equal(input.value, 'bulunmayan'); assert.equal(cards[1].hidden, true);
  location.hash = '#%E0%A4%A'; assert.doesNotThrow(() => win.handlers.hashchange());

  input.value = 'Ocean'; input.handlers.input();
  assert.equal(groups[0].hidden, true); assert.equal(groups[1].hidden, false);
  location.hash = '#group-0'; win.handlers.hashchange();
  assert.ok(groups.every(group => !group.hidden));
  input.value = 'Ocean'; input.handlers.input(); clear.handlers.click();
  assert.ok(input.focused); assert.ok(cards.every(card => !card.hidden)); assert.ok(clear.disabled);
  assert.equal(share.href, '/donanma/#navy-search');
  let prevented = false; form.handlers.submit({ preventDefault() { prevented = true; } }); assert.ok(prevented);
  assert.ok(cards[0].focused); assert.ok(cards[0].scrolled);
  cards[0].focused = false;
  input.value = 'Ocean'; input.handlers.input();
  form.handlers.submit({ preventDefault() {} });
  assert.ok(cards[1].focused); assert.equal(cards[0].focused, false);
  input.value = 'bulunmayan'; input.handlers.input();
  form.handlers.submit({ preventDefault() {} });
  assert.ok(status.focused); assert.ok(status.scrolled); assert.equal(status.tabindex, '-1');
  location.search = '?q=OCEAN&ad=1'; location.hash = '#navy-search';
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/navy-search.js'), 'utf8'), {
    document: { createElement: () => node(), getElementById: id => elements[id], querySelectorAll: selector => selector === '.ship-card' ? cards : groups }, window: win, location, URLSearchParams, URL
  });
  assert.equal(input.value, 'OCEAN'); assert.ok(nameOnly.checked);
  assert.equal(cards[0].hidden, true); assert.equal(cards[1].hidden, false);
  location.hash = '#muavenet'; win.handlers.hashchange();
  assert.equal(input.value, ''); assert.equal(cards[0].hidden, false);
  location.hash = '#navy-search'; win.handlers.hashchange();
  assert.equal(input.value, 'OCEAN'); assert.ok(nameOnly.checked);
  assert.equal(cards[0].hidden, true); assert.equal(cards[1].hidden, false);
  assert.equal(share.href, '/donanma/?q=OCEAN&ad=1#navy-search');
  location.hash = '#muavenet'; win.handlers.hashchange();
  input.value = 'MİLLİYE'; input.handlers.input();
  location.hash = '#navy-search'; win.handlers.hashchange();
  assert.equal(input.value, 'MİLLİYE');
  input.value = ''; input.handlers.input();
  assert.ok(nameOnly.checked); assert.equal(clear.disabled, false);
  clear.handlers.click();
  assert.equal(nameOnly.checked, false); assert.ok(clear.disabled);
  assert.equal(new URL(location.href).searchParams.has('q'), false);
  assert.equal(new URL(location.href).searchParams.has('ad'), false);
  assert.ok(cards.every(card => !card.hidden));
  location.search = '?q=Ocean&ad=1'; location.hash = '#navy-search';
  win.handlers.popstate();
  assert.equal(input.value, 'Ocean'); assert.equal(nameOnly.checked, true);
  assert.equal(cards[0].hidden, true); assert.equal(cards[1].hidden, false);
});


test('JavaScript olmadan bütün gemi kartları ve bölüm bağlantıları erişilebilir kalır', () => {
  const html = fs.readFileSync(path.join(__dirname, '../donanma/index.html'), 'utf8');
  const cards = [...html.matchAll(/<article\b([^>]*class="ship-card"[^>]*)>/g)];
  assert.equal(cards.length, 30);
  assert.ok(cards.every(([, attrs]) => !/\bhidden\b|aria-hidden/.test(attrs)));
  assert.doesNotMatch(html, /<section data-navy-group[^>]*hidden/);
  assert.match(html, /<form[^>]*id="navy-search"[^>]*hidden/);
  for (const id of ['bouvet', 'irresistible', 'ocean', 'inflexible', 'gaulois']) {
    assert.ok(html.includes('href="#' + id + '"'));
    assert.ok(html.includes('id="' + id + '"'));
  }
});
