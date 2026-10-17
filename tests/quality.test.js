const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");

function load(file) {
  vm.runInThisContext(fs.readFileSync(path.join(root, file), "utf8"), { filename: file });
}

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git" || name === "tests" || name === "node_modules" || name === "prototip" || name === "research" || name === "archive") continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

test("kaynak çerçevesi iddiayı belgelemiş sayılmaz ve html kaçırılır", () => {
  delete global.window;
  load("js/model.js");
  const model = global.OMModel;
  model.catalog.forEach((src) => {
    assert.equal(src.claimSupport, false);
    assert.equal(src.scope, "kurum");
    assert.equal(src.page, null);
    assert.equal(src.documentNo, null);
    assert.notEqual(src.verification, "sayfa");
  });
  assert.equal(model.escapeHtml('<img src=x onerror=alert(1)>'), "&lt;img src=x onerror=alert(1)&gt;");
  assert.equal(model.escapeHtml('"&\''), "&quot;&amp;&#39;");
  assert.equal(model.safeUrl("javascript:alert(1)"), "");
  assert.equal(model.safeUrl("//evil.example/a"), "");
  assert.equal(model.safeUrl("/olaylar/18-mart-deniz-muharebesi/"), "/olaylar/18-mart-deniz-muharebesi/");
  assert.equal(model.safeUrl("https://www.awm.gov.au/"), "https://www.awm.gov.au/");
});

test("saat sırası bozulmaz ve kampanya tarihleri 1915-1916 aralığındadır", () => {
  global.window = {};
  load("js/data.js");
  load("js/campaign.js");
  let prev = -1;
  global.window.OM.events.forEach((ev) => {
    assert.ok(ev.m >= prev, ev.t);
    prev = ev.m;
    assert.match(ev.t, /^\d{2}:\d{2}$/);
  });
  const events = global.window.OM.campaign.events;
  events.forEach((ev) => assert.match(ev.date, /1915|1916/));
  assert.match(events[0].date, /1915/);
  assert.match(events[events.length - 1].date, /1916/);
});

test("site haritası, başlıklar ve iç bağlantılar yayımlanan dosyalarla örtüşür", () => {
  const htmlFiles = walk(root, []).filter((file) => file.endsWith(`${path.sep}index.html`) || file.endsWith(".html"));
  const pages = htmlFiles.filter((file) => path.basename(file) === "index.html");
  const titles = new Map();
  const canonicals = [];
  for (const file of pages) {
    const html = fs.readFileSync(file, "utf8");
    const title = html.match(/<title>([^<]+)<\/title>/);
    const desc = html.match(/<meta name="description" content="([^"]*)">/);
    const canon = html.match(/<link rel="canonical" href="([^"]+)">/);
    assert.ok(title, file);
    assert.ok(desc && desc[1].trim(), file);
    assert.ok(canon, file);
    assert.match(html, /property="og:title"/);
    assert.match(html, /property="og:url" content="([^"]+)"/);
    const og = html.match(/property="og:url" content="([^"]+)"/);
    assert.equal(og[1], canon[1], file);
    assert.equal(titles.has(title[1]), false, title[1]);
    titles.set(title[1], file);
    canonicals.push(canon[1]);
    const rel = path.relative(root, file).split(path.sep).join("/");
    const expect = rel === "index.html"
      ? "https://onsekizmart.com/"
      : "https://onsekizmart.com/" + rel.slice(0, -"index.html".length);
    assert.equal(canon[1], expect, file);
  }
  const xml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  assert.doesNotThrow(() => new DOMParserPolyfill(xml));
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(new Set(locs).size, locs.length);
  assert.deepEqual(locs.slice().sort(), canonicals.slice().sort());
  assert.equal(xml.includes("page-shell"), false);
  const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
  assert.match(robots, /Sitemap: https:\/\/onsekizmart\.com\/sitemap\.xml/);
  for (const file of htmlFiles) {
    if (path.basename(file) === "page-shell.html") continue;
    const html = fs.readFileSync(file, "utf8");
    const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (!ref.startsWith("/") || ref.startsWith("//")) continue;
      const clean = ref.split("#")[0].split("?")[0];
      const target = clean === "/" || clean === ""
        ? path.join(root, "index.html")
        : path.join(root, decodeURIComponent(clean).replace(/^\//, ""));
      const resolved = fs.existsSync(target) && fs.statSync(target).isDirectory()
        ? path.join(target, "index.html")
        : target;
      assert.ok(fs.existsSync(resolved), `${file} -> ${ref}`);
    }
  }
});

function DOMParserPolyfill(xml) {
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.equal((xml.match(/<url>/g) || []).length, (xml.match(/<\/url>/g) || []).length);
  assert.equal(xml.includes("<html"), false);
}

test("harita kütüphanesi yokken kronoloji çizilir ve arama metni html olmaz", () => {
  const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  assert.match(app, /function bootMap/);
  assert.match(app, /function showMapError/);
  assert.match(app, /tileerror/);
  assert.doesNotMatch(app, /innerHTML\s*=\s*[^;\n]*\+/);
  assert.match(app, /name\.textContent = p \? p\.name : label/);

  function makeEl(id) {
    const el = {
      id,
      hidden: false,
      className: "",
      value: id === "tl-range" ? "450" : "",
      inert: false,
      children: [],
      parentNode: null,
      dataset: {},
      textContent: "",
      innerHTML: "",
    };
    el.classList = { toggle() { return true; }, add() {}, remove() {}, contains() { return false; } };
    el.setAttribute = (key, value) => { el[key] = value; };
    el.getAttribute = (key) => {
      if (key === "data-date" && id === "secilmis") return "18 Mart 1915";
      if (key === "aria-pressed") return "false";
      return el[key] || "";
    };
    el.appendChild = (child) => { child.parentNode = el; el.children.push(child); return child; };
    el.replaceChildren = (...nodes) => { el.children = []; nodes.forEach((node) => node && el.appendChild(node)); };
    el.removeChild = (child) => { el.children = el.children.filter((item) => item !== child); };
    el.addEventListener = () => {};
    el.querySelector = () => null;
    el.querySelectorAll = () => [];
    el.closest = () => null;
    el.focus = () => {};
    el.scrollIntoView = () => {};
    return el;
  }
  const cache = {};
  global.document = {
    getElementById(id) { return cache[id] || (cache[id] = makeEl(id)); },
    createElement() { return makeEl("el"); },
    querySelector(sel) { return cache[sel] || (cache[sel] = makeEl(sel)); },
    querySelectorAll() { return []; },
    createTextNode(text) { return { nodeType: 3, textContent: String(text), children: [] }; },
    addEventListener() {},
  };
  global.window = global;
  global.window.addEventListener = () => {};
  global.window.matchMedia = () => ({ matches: false, addEventListener() {} });
  global.window.location = { search: "", hash: "", reload() {} };
  global.L = undefined;
  load("js/data.js");
  load("js/campaign.js");
  load("js/model.js");
  load("js/app.js");
  const map = document.getElementById("map");
  assert.equal(map.children[0].className, "map-fallback");
  assert.match(map.children[0].children[0].textContent, /Harita kütüphanesi yüklenemedi/);
  assert.match(map.children[0].children[0].textContent, /Kronoloji ve olay listesi kullanılabilir/);
  assert.equal(document.getElementById("map-reset").disabled, true);
  assert.ok(document.getElementById("camp-list").children.length > 10);
  assert.ok(document.getElementById("event-list").children.length > 5);
  const injected = document.getElementById("event-list").children.some((li) => /<script/i.test(li.textContent || ""));
  assert.equal(injected, false);
});

test("iletişim notu göndermez ve erişilebilirlik kuralları durur", () => {
  const html = fs.readFileSync(path.join(root, "iletisim/index.html"), "utf8");
  const source = fs.readFileSync(path.join(root, "build_pages.py"), "utf8");
  assert.match(html, /data-mailto="iletisim@onsekizmart\.com"/);
  assert.match(html, /href="mailto:iletisim@onsekizmart\.com"/);
  assert.match(html, />iletisim@onsekizmart\.com</);
  assert.match(source, /data-mailto="iletisim@onsekizmart\.com"/);
  assert.match(source, /href="mailto:iletisim@onsekizmart\.com"/);
  assert.match(html, /id="contact-copy"/);
  assert.match(html, /Bir sunucuya gönderilmez/);
  assert.match(html, /Bir sunucuya gönderilmedi/);
  assert.match(html, /Yazışma adresi tanımlı değil/);
  assert.match(html, /kendi posta programınızı açar/);
  assert.match(html, /for="contact-page"/);
  assert.match(html, /for="contact-event"/);
  assert.match(html, /name="kaynak"/);
  assert.match(html, /name="not"/);
  assert.doesNotMatch(html, /type="submit"/);
  assert.doesNotMatch(html, /başarıyla gönderildi/);
  assert.doesNotMatch(html, /yazışma adresi yoktur/);
  const css = fs.readFileSync(path.join(root, "css/style.css"), "utf8");
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width: 860px/);
  assert.match(css, /\.map-fallback/);
  assert.match(css, /overflow-x: auto/);
});

test("yayın sayfalarında analytics kimliği bir kez kurulur", () => {
  const id = "G-MKGGXNVR7V";
  const loader = `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`;
  const config = `gtag('config', '${id}')`;
  function occurrences(text, needle) {
    return text.split(needle).length - 1;
  }
  const htmlFiles = walk(root, []).filter((file) => file.endsWith(".html"));
  const published = htmlFiles.filter((file) => path.basename(file) === "index.html");
  assert.ok(published.length > 10);
  for (const file of published) {
    const html = fs.readFileSync(file, "utf8");
    if (html.includes('content="noindex')) continue;
    assert.equal(occurrences(html, loader), 1, file);
    assert.equal(occurrences(html, config), 1, file);
    assert.equal(occurrences(html, id), 2, file);
    assert.equal(html.includes("GTM-"), false, file);
    assert.ok(html.indexOf(loader) < html.indexOf("</head>"), file);
  }
  const shell = fs.readFileSync(path.join(root, "page-shell.html"), "utf8");
  assert.equal(occurrences(shell, loader), 1);
  assert.equal(occurrences(shell, config), 1);
  const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  assert.equal(app.includes("page_view"), false);
  assert.equal(app.includes("G-MKGGXNVR7V"), false);
  assert.equal(app.includes("search_used"), false);
  assert.equal(app.includes("source_open"), false);
  assert.equal(app.includes("related_page_open"), false);
  assert.equal((app.match(/window\.gtag\(/g) || []).length, 1);
  assert.match(app, /typeof window\.gtag !== "function"/);
  assert.equal((app.match(/map_event_select/g) || []).length, 1);
  assert.equal((app.match(/timeline_play/g) || []).length, 1);
  assert.equal((app.match(/filter_used/g) || []).length, 1);
});

 test("karo kesintisi uyarısı başarıya kadar kalır ve yalnız açık katman yeniden denenir", () => {
  const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  const nodes = [];
  function element() {
    return { children: [], parentNode: null, setAttribute() {},
      appendChild(child) { child.parentNode = this; this.children.push(child); return child; },
      removeChild(child) { this.children = this.children.filter(x => x !== child); child.parentNode = null; },
      addEventListener(name, fn) { this[name] = fn; }
    };
  }
  const frame = element();
  function layer() {
    return { events: {}, redraws: 0, on(name, fn) { this.events[name] = fn; }, redraw() { this.redraws++; this.events.loading(); } };
  }
  const active = layer(), inactive = layer();
  const ctx = { tileWarned: false, tileNote: null, map: { hasLayer: l => l === active }, tiles: { uydu: inactive, yol: active },
    document: { querySelector: () => frame, getElementById: () => frame, createElement() { const el = element(); nodes.push(el); return el; }, createTextNode: text => ({ textContent: text }) }
  };
  vm.createContext(ctx);
  vm.runInContext(app.slice(app.indexOf("  function clearTileWarning()"), app.indexOf("  function bootMap()")), ctx);
  ctx.watchTiles(active); ctx.watchTiles(inactive);
  inactive.events.tileerror();
  assert.equal(frame.children.length, 0);
  active.events.loading(); active.events.tileerror(); active.events.tileerror(); active.events.load();
  assert.equal(frame.children.length, 1);
  const retry = nodes.find(n => n.textContent === "Karoları yeniden dene");
  retry.click();
  assert.equal(active.redraws, 1);
  assert.equal(inactive.redraws, 0);
  assert.equal(frame.children.length, 1);
  active.events.tileerror(); active.events.load();
  assert.equal(frame.children.length, 1);
  retry.click(); active.events.load();
  assert.equal(frame.children.length, 0);
  assert.equal(ctx.tileWarned, false);
});

test("atlas araması boş sonucu bildirir, ok tuşları ve Escape ile odağı korur", () => {
  const source = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  let focused;
  function el() {
    return { children: [], handlers: {}, hidden: false, value: "", textContent: "",
      setAttribute(key, value) { this[key] = value; }, addEventListener(key, fn) { this.handlers[key] = fn; },
      appendChild(child) { this.children.push(child); }, focus() { focused = this; },
      querySelectorAll() { return this.children.map(li => li.children[0]); },
      set innerHTML(value) { this.children = []; }
    };
  }
  const q = el(), results = el(), status = el(), title = el(), more = el();
  const ctx = { document: { getElementById: id => ({ q, 'q-results': results, 'q-status': status, 'panel-title': title, 'q-more': more }[id]), createElement: el },
    foldTr: value => value.toLowerCase(), allPlaces: () => [{ id: 'a', name: 'Arıburnu' }],
    D: { events: [] }, selectPlace() {}, revealDock() {}, mode: 'naval' };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  var q = document.getElementById("q");'), source.indexOf('  var clock = document.getElementById("clock");')), ctx);
  function key(target, name, item) {
    let prevented = false;
    target.handlers.keydown({ key: name, target: item, preventDefault() { prevented = true; }, stopPropagation() {} });
    return prevented;
  }
  q.value = 'z'; q.handlers.input(); assert.match(status.textContent, /en az 2/);
  q.value = 'zz'; q.handlers.input(); assert.match(status.textContent, /Sonuç bulunamadı/); assert.equal(results.hidden, true);
  q.value = 'ar'; q.handlers.input(); assert.match(status.textContent, /1 sonuç/);
  const hit = results.children[0].children[0];
  assert.equal(hit.children[0].textContent, 'Arıburnu');
  assert.equal(hit.children[1].textContent, 'Mevki · Harita');
  assert.equal(key(q, 'ArrowDown'), true); assert.equal(focused, hit);
  key(results, 'ArrowUp', hit); assert.equal(focused, q);
  key(results, 'Escape', hit); assert.equal(results.hidden, true); assert.equal(q['aria-expanded'], 'false'); assert.equal(focused, q);
  q.handlers.input(); hit.handlers.click(); assert.equal(focused, title); assert.equal(results.hidden, true); assert.match(status.textContent, /Seçildi/);
  ctx.allPlaces = () => Array.from({ length: 10 }, (_, i) => ({ id: 'test-' + i, name: 'Arama ' + i }));
  ctx.D.campaign = { events: [
    { id: 'test-gap', title: 'Arama boşluğu', text: '', date: '', quiet: true },
    { id: 'test-event', title: 'Arama olayı', text: '', date: '' }
  ] };
  q.value = 'ar'; q.handlers.input();
  assert.equal(results.children.length, 8);
  assert.match(status.textContent, /11 eşleşme bulundu; ilk 8/);
  assert.equal(more.hidden, false); assert.equal(more.textContent, '3 sonuç daha göster');
  more.handlers.click();
  assert.equal(results.children.length, 11); assert.equal(more.hidden, true);
  assert.equal(focused, results.children[8].children[0]);
  assert.match(status.textContent, /11 sonuç gösteriliyor/);
  assert.equal(results.children[10].children[0].children[1].textContent, 'Cephe kronolojisi · Olay');
  q.handlers.input(); assert.equal(results.children.length, 8); assert.equal(more.hidden, false);
  key(q, 'Escape'); assert.equal(more.hidden, true);
  q.value = 'z'; q.handlers.input(); assert.equal(more.hidden, true);

});

test("bilgi paneli kapanınca odak görünür arama kontrolüne döner", () => {
  const source = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  for (const compact of [false, true]) {
    let focused, owned = true;
    const q = { focus() { focused = 'q'; } }, tool = { focus() { focused = 'tool-search'; } };
    const panel = { classList: { remove() {} }, contains: () => owned };
    const ctx = { activeId: 'a', paintIcons() {}, window: { matchMedia: () => ({ matches: compact }) },
      document: { activeElement: {}, getElementById: id => ({ panel, q, 'tool-search': tool, 'dock-empty': {} }[id]) } };
    vm.createContext(ctx);
    vm.runInContext(source.slice(source.indexOf('  function closePanel()'), source.indexOf('  function selectPlace(')), ctx);
    ctx.closePanel();
    assert.equal(focused, compact ? 'tool-search' : 'q');
    assert.equal(panel.inert, true);
    owned = false; focused = undefined; ctx.closePanel(); assert.equal(focused, undefined);
  }
});

test("yeni kayıt seçimi daraltılmış kontrol panelini açar", () => {
  const source = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  let collapsed = true, resizes = 0;
  const button = { setAttribute(key, value) { this[key] = value; } };
  const ctx = { document: { body: { classList: { contains: () => collapsed, remove: () => { collapsed = false; } } }, getElementById: () => button },
    map: { invalidateSize() { resizes++; } }, motionOn: () => false, setTimeout: fn => fn() };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function revealDock()'), source.indexOf('  function fillPanel(')), ctx);
  ctx.revealDock();
  assert.equal(collapsed, false); assert.equal(button['aria-expanded'], 'true'); assert.equal(button.textContent, 'Gizle'); assert.equal(resizes, 1);
  ctx.revealDock(); assert.equal(resizes, 1);
});

test("araç yerleşimi değişince odak gizli panel veya düğmede kalmaz", () => {
  const source = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  let focused, closes = 0, reveals = 0;
  const input = { focus() { focused = input; } }, trigger = { focus() { focused = trigger; } };
  const content = { contains: item => item === input, querySelector: () => input };
  const ctx = { document: { activeElement: input, getElementById: id => ({ 'search-pop': content, 'tool-search': trigger }[id]) },
    closeTools() { closes++; }, revealDock() { reveals++; } };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function syncToolLayout('), source.indexOf('  function revealDock()')), ctx);
  ctx.syncToolLayout(true); assert.equal(focused, trigger);
  ctx.document.activeElement = trigger; ctx.syncToolLayout(false);
  assert.equal(focused, input); assert.equal(reveals, 1); assert.equal(closes, 2);
  focused = null; ctx.document.activeElement = {}; ctx.syncToolLayout(true); assert.equal(focused, null);
});
