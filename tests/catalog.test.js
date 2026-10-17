const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const allowed = new Set([
  "bulundu",
  "metadata_kontrol_edildi",
  "belge_acildi",
  "iddia_dogrulandi",
  "insan_incelemesi_gerekli"
]);

test("katalog kimliği, adresi ve durumu sınırlıdır", () => {
  const data = JSON.parse(fs.readFileSync(path.join(root, "research/gelibolu/katalog.json"), "utf8"));
  const ids = new Set();
  assert.ok(data.kayitlar.length > 0);
  for (const row of data.kayitlar) {
    assert.ok(row.id && row.baslik && row.kurum);
    assert.ok(allowed.has(row.durum));
    assert.equal(row.iddia_destegi, false);
    assert.equal(row.durum === "iddia_dogrulandi", false);
    assert.equal(ids.has(row.id), false);
    ids.add(row.id);
    if (row.url) {
      assert.match(row.url, /^https?:\/\//);
      assert.equal(/\s/.test(row.url), false);
    }
  }
});

test("kaynakça türü, bağlantıyı ve durumu gösterir", () => {
  const page = fs.readFileSync(path.join(root, "kaynakca/index.html"), "utf8");
  const data = JSON.parse(fs.readFileSync(path.join(root, "research/gelibolu/katalog.json"), "utf8"));
  assert.equal(page.includes("iddia_dogrulandi"), false);
  for (const row of data.kayitlar) {
    assert.ok(page.includes(`id="${row.id}"`));
    assert.ok(page.includes(`data-status="${row.durum}"`));
    assert.ok(page.includes(row.kayit_turu));
    if (row.url) assert.ok(page.includes(`href="${row.url}"`));
  }
});

test("devam künyeleri bağlantı ve durum taşır, iddia doğrulamaz", () => {
  const data = JSON.parse(fs.readFileSync(path.join(root, "research/gelibolu/arsiv/devam/tarama.json"), "utf8"));
  const page = fs.readFileSync(path.join(root, "kaynakca/index.html"), "utf8");
  const ids = new Set();
  assert.equal(data.belge_acildi, 0);
  assert.equal(data.iddia_dogrulandi, 0);
  assert.ok(data.kayitlar.length > 0);
  for (const row of data.kayitlar) {
    assert.equal(ids.has(row.id), false);
    ids.add(row.id);
    assert.ok(allowed.has(row.durum));
    assert.equal(row.iddia_destegi, false);
    assert.notEqual(row.durum, "belge_acildi");
    assert.notEqual(row.durum, "iddia_dogrulandi");
    assert.match(row.url, /^https:\/\/www\.iwm\.org\.uk\/collections\/item\/object\/\d+$/);
    assert.ok(page.includes(`id="${row.id}"`));
    assert.ok(page.includes(`data-status="${row.durum}"`));
    assert.ok(page.includes(`href="${row.url}"`));
    assert.equal(page.includes(row.baslik), true);
  }
  const devam = page.slice(page.indexOf("<!-- DEVAM:BAS -->"), page.indexOf("<!-- DEVAM:SON -->"));
  assert.equal(devam.includes("<script"), false);
  assert.equal(devam.includes("innerHTML"), false);
});

test("16 ve 17 Mart tek güne indirilmez", () => {
  const page = fs.readFileSync(path.join(root, "komutanlar/john-de-robeck/index.html"), "utf8");
  const campaign = fs.readFileSync(path.join(root, "js/campaign.js"), "utf8");
  for (const text of [page, campaign]) {
    assert.ok(text.includes("16 Mart 1915"));
    assert.ok(text.includes("17 Mart 1915"));
    assert.ok(text.includes("birleştirilmedi"));
  }
  assert.ok(campaign.includes('cardenBirakma: "16 Mart 1915"'));
  assert.ok(campaign.includes('robeckGorev: "17 Mart 1915"'));
  assert.ok(campaign.includes('komutaDurumu: "insan_incelemesi_gerekli"'));
});

test("kaynakça süzgeci mevcut kartları süzer ve veri basmaz", () => {
  const page = fs.readFileSync(path.join(root, "kaynakca/index.html"), "utf8");
  ["katalog-q", "katalog-kurum", "katalog-tur", "katalog-durum", "katalog-temizle"].forEach((id) => {
    assert.ok(page.includes(`id="${id}"`), id);
  });
  assert.equal(page.includes("innerHTML"), false);
  assert.match(page, /getAttribute\("data-status"\)/);
  assert.match(page, /createElement\("option"\)/);
  assert.match(page, /opt\.textContent = pair\.label/);
  const devam = page.slice(page.indexOf("<!-- DEVAM:BAS -->"), page.indexOf("<!-- DEVAM:SON -->"));
  assert.equal(devam.includes("<script"), false);
  const start = page.indexOf("function foldCatalog");
  const end = page.indexOf("function readCards");
  assert.ok(start > 0 && end > start);
  const api = new Function(
    page.slice(start, end) + "\nreturn { foldCatalog: foldCatalog, catalogMatch: catalogMatch };"
  )();
  assert.equal(api.foldCatalog("Üst veri"), api.foldCatalog("ust veri"));
  const item = {
    text: api.foldCatalog("Australian War Memorial Gallipoli"),
    institution: "Australian War Memorial",
    kind: "Dijital dosya",
    status: "bulundu"
  };
  assert.equal(api.catalogMatch(item, "gallipoli", "", "", ""), true);
  assert.equal(api.catalogMatch(item, "", "Imperial War Museums", "", ""), false);
  assert.equal(api.catalogMatch(item, "", "Australian War Memorial", "Dijital dosya", "bulundu"), true);
  assert.equal(api.catalogMatch(item, "", "", "", "insan_incelemesi_gerekli"), false);
  assert.equal(api.catalogMatch(item, "yokboyle", "", "", ""), false);
});

test("yayımlanan sayfalarda GA4 etiketi tektir", () => {
  function walk(dir, out) {
    for (const name of fs.readdirSync(dir)) {
      if (name === ".git" || name === "tests" || name === "node_modules" || name === "research" || name === "prototip" || name === "archive") continue;
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) walk(full, out);
      else if (name === "index.html") out.push(full);
    }
    return out;
  }
  const pages = walk(root, []);
  assert.ok(pages.length > 0);
  const id = "G-MKGGXNVR7V";
  for (const file of pages) {
    const html = fs.readFileSync(file, "utf8");
    const ids = html.match(/G-[A-Z0-9]+/g) || [];
    assert.deepEqual(ids, [id, id], file);
    assert.equal((html.match(/googletagmanager\.com\/gtag\/js\?id=G-MKGGXNVR7V/g) || []).length, 1, file);
    assert.equal((html.match(/gtag\('config', 'G-MKGGXNVR7V'\)/g) || []).length, 1, file);
  }
});
