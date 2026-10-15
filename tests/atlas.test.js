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
