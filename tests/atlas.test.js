const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");

function load(file) {
  vm.runInThisContext(fs.readFileSync(path.join(root, file), "utf8"), { filename: file });
}

test("kaynak modeli sayfa numarası uydurmaz ve belgesiz görseli yayımlamaz", () => {
  load("js/model.js");
  const model = global.OMModel;
  assert.ok(model.catalog.length >= 3);
  model.catalog.forEach((src) => {
    assert.equal(src.page, null);
    assert.equal(src.documentNo, null);
  });
  assert.equal(model.publishable({ title: "Fotoğraf", date: "1915", rights: "bilinmiyor" }), false);
  assert.equal(model.publishable({ title: "Fotoğraf", date: "1915", rights: "izinli" }), true);
  assert.equal(model.archive.documents.length, 0);
});

test("18 Mart kaydı varsa boş durum mesajı üretilmez", () => {
  global.window = {};
  load("js/data.js");
  load("js/campaign.js");
  load("js/model.js");
  const events = global.window.OM.campaign.events;
  const state = global.OMModel.dayMessage(events, "18 Mart 1915");
  assert.equal(state.status, "olay");
  assert.equal(state.events[0].title, "18 Mart Deniz Muharebesi");
  assert.equal(global.OMModel.eventsOnDate(events, "18 Mart 1915").some((ev) => ev.quiet), false);
});

test("olayı olmayan bir gün sahte olay üretmez", () => {
  const state = global.OMModel.dayMessage(global.window.OM.campaign.events, "15 Ekim 1915");
  assert.equal(state.status, "kayit-yok");
  assert.match(state.text, /olay kaydı yok/);
  assert.match(state.text, /Sahte olay eklenmedi/);
});

test("aralık notu olay sayılmaz, konum yaklaşık veya şematik işaretlenir", () => {
  const model = global.OMModel;
  const quiet = global.window.OM.campaign.events.find((ev) => ev.quiet);
  model.annotate(quiet);
  assert.equal(quiet.recordStatus, "aralik-notu");
  assert.equal(quiet.verification, "cerceve");
  const place = global.window.OM.places[0];
  model.annotate(place);
  assert.equal(place.accuracy, "yaklasik");
  assert.notEqual(place.verification, "sayfa");
  const mine = global.window.OM.mineLines[0];
  mine.schematic = true;
  model.annotate(mine);
  assert.equal(mine.accuracy, "sema");
});

test("ana sayfa 18 Mart için boş kayıt cümlesi taşımaz ve kontroller durur", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.equal(html.includes("doğrulanmış kayıt eklenmedi"), false);
  assert.match(html, /data-date="18 Mart 1915"/);
  assert.match(html, /id="day-body"/);
  assert.match(html, /id="day-empty"/);
  ["/#harita", "/#kronoloji", "/olaylar/", "/komutanlar/", "/donanma/", "/kaynakca/"].forEach((href) => {
    assert.ok(html.includes(`href="${href}"`), href);
  });
  ["id=\"q\"", "id=\"tl-range\"", "id=\"layers\"", "id=\"camp-list\"", "id=\"nav-toggle\"", "id=\"mode-18\"", "id=\"mode-camp\""].forEach((id) => {
    assert.ok(html.includes(id), id);
  });
  assert.match(html, /js\/model\.js/);
});

test("kayıt sayfası özetten sonra kaynak çerçevesini gösterir", () => {
  const html = fs.readFileSync(path.join(root, "komutanlar/mustafa-kemal/index.html"), "utf8");
  const html18 = fs.readFileSync(path.join(root, "olaylar/18-mart-deniz-muharebesi/index.html"), "utf8");
  assert.match(html, /Doğum/);
  assert.match(html, /doğrulanmış kayıt olarak işaretlenmez/);
  assert.ok(html.indexOf("<h1>") < html.indexOf("<h2>Kaynakça</h2>"));
  assert.match(html18, /<h1>18 Mart Deniz Muharebesi<\/h1>/);
  assert.match(html18, /doğrulanmış kayıt olarak işaretlenmez/);
});

test("18 Mart’ta batan üç gemi durur ve Hamilton deniz komutanı yazılmaz", () => {
  global.window = {};
  load("js/data.js");
  load("js/campaign.js");
  const ev = global.window.OM.campaign.events.find((item) => item.title === "18 Mart Deniz Muharebesi");
  assert.match(ev.text, /Bouvet, Irresistible ve Ocean batar/);
  assert.equal(ev.text.includes("Yavuz"), false);
  assert.equal(ev.text.includes("Midilli"), false);
  assert.equal(ev.text.includes("Mesudiye"), false);
  const navy = fs.readFileSync(path.join(root, "donanma/index.html"), "utf8");
  assert.match(navy, /Yavuz Sultan Selim ile Midilli bu muharebenin gemi listesinde yoktur/);
  assert.match(navy, /Mesudiye, Osmanlı bayrağı taşıyan eski bir zırhlıdır\. 18 Mart kadrosunda yoktur/);
  const hamilton = fs.readFileSync(path.join(root, "komutanlar/ian-hamilton/index.html"), "utf8");
  assert.match(hamilton, /18 Mart deniz muharebesinin komutanı değildir/);
});

test("boş hayat alanları doldurulmaz", () => {
  function facts(file) {
    return fs.readFileSync(path.join(root, file), "utf8");
  }
  assert.match(facts("komutanlar/mustafa-kemal/index.html"), /<dt>Doğum<\/dt><dd>1881, Selanik<\/dd>/);
  assert.equal(facts("komutanlar/vehip-pasa-kaci/index.html").includes("<dt>Doğum</dt>"), false);
  assert.equal(facts("komutanlar/remzi-bey/index.html").includes("<dt>Doğum</dt>"), false);
  assert.equal(facts("komutanlar/remzi-bey/index.html").includes("<dt>Ölüm</dt>"), false);
  assert.equal(facts("komutanlar/johannes-merten/index.html").includes("<dt>Doğum</dt>"), false);
  assert.equal(facts("komutanlar/johannes-merten/index.html").includes("<dt>Ölüm</dt>"), false);
  assert.match(facts("komutanlar/halil-sami-bey/index.html"), /<dt>Ölüm<\/dt><dd>1925<\/dd>/);
  assert.match(facts("komutanlar/selahattin-adil-bey/index.html"), /<dt>Ölüm<\/dt><dd>27 Şubat 1961<\/dd>/);
  assert.match(facts("komutanlar/albert-damade/index.html"), /<dt>Doğum<\/dt><dd>24 Aralık 1856<\/dd>/);
  assert.match(facts("komutanlar/albert-damade/index.html"), /<dt>Ölüm<\/dt><dd>11 Kasım 1941<\/dd>/);
  assert.match(facts("komutanlar/william-bridges/index.html"), /<dt>Ölüm<\/dt><dd>18 Mayıs 1915<\/dd>/);
  assert.match(facts("komutanlar/roger-keyes/index.html"), /<dt>Doğum<\/dt><dd>4 Ekim 1872, Pencap<\/dd>/);
  assert.match(facts("komutanlar/charles-monro/index.html"), /<dt>Doğum<\/dt><dd>15 Haziran 1860, denizde<\/dd>/);
});

test("mobil düzen ve katman düğmesi kuralları durur", () => {
  const css = fs.readFileSync(path.join(root, "css/style.css"), "utf8");
  const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  assert.match(css, /@media \(max-width: 860px\)/);
  assert.match(css, /\.nav-toggle/);
  assert.match(app, /data-layer/);
  assert.match(app, /applyDateLayers/);
  assert.match(app, /Aralık notu/);
  assert.match(app, /şematik gösterim/);
});

test("çalışma alanı üç bölümlü, daraltılabilir ve türkçe arama katlar", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "css/style.css"), "utf8");
  const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  ["id=\"map\"", "id=\"layers\"", "id=\"q\"", "id=\"q-results\"", "id=\"clock\"", "id=\"mode-18\"", "id=\"mode-camp\"", "id=\"tl-play\"", "id=\"naval-side\"", "id=\"tl-both\"", "id=\"tl-turk\"", "id=\"tl-itilaf\"", "id=\"tl-range\"", "id=\"tl-hint\"", "id=\"tl-event\"", "id=\"panel\"", "id=\"panel-title\"", "id=\"panel-meta\"", "id=\"panel-close\"", "id=\"panel-body\"", "id=\"camp-filters\"", "id=\"camp-list\"", "id=\"kron-filters\"", "id=\"event-list\"", "id=\"nav-toggle\"", "id=\"nav-panel\""].forEach((id) => {
    assert.ok(html.includes(id), id);
  });
  assert.match(html, /id="tl-prev"/);
  assert.match(html, /id="tl-next"/);
  assert.match(html, /id="filter-clear"/);
  assert.match(html, /id="dock-toggle"/);
  assert.match(html, /id="tool-search"/);
  assert.match(html, /min="450"/);
  assert.match(html, /max="1350"/);
  assert.match(html, /class="atlas-grid"/);
  assert.match(css, /body\.home \.atlas-grid/);
  assert.match(css, /grid-template-columns:\s*minmax\(240px,\s*300px\)/);
  assert.match(css, /is-dock-collapsed/);
  assert.match(css, /is-search-open/);
  assert.match(css, /max-width:\s*430px/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(app, /function foldTr/);
  assert.match(app, /function stepTime/);
  assert.match(app, /function clearFilters/);
  assert.match(app, /Duraklat/);
  assert.match(app, /btn\.textContent = p\.name/);
  const start = app.indexOf("function foldTr");
  const end = app.indexOf("\n  function ", start + 10);
  const foldTr = new Function(app.slice(start, end) + "\nreturn foldTr;")();
  assert.equal(foldTr("Çanakkale"), foldTr("canakkale"));
  assert.equal(foldTr("İstanbul"), "istanbul");
  assert.equal(foldTr("Işık"), foldTr("ışık"));
  assert.equal(foldTr("Şişe"), "sise");
  assert.equal(foldTr("Ağaç"), "agac");
  assert.equal(foldTr("çiğ"), "cig");
});
