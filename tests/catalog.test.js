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
