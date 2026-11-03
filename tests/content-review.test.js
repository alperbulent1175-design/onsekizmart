const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

test('tüm olay ve komutan sayfaları inceleme kapsamında ve kanıt bağlantıları geçerli', () => {
  const review = JSON.parse(read('research/ux-audit/content-review.json'));
  const covered = new Set(review.pages.map(p => p.path));
  const ledger = read('inceleme-notlari/index.html');
  const chronology = JSON.parse(read('data/chronology-sources.json'));
  const supportLabels = {
    kurumsal_ozet_pasaji_okundu: ['Kurum özetine dayanan anlatı', 'Kesin saatler ve ayrıntılı konumlar'],
    gunluk_goruntusu_ilgili_pasaj_okundu: ['Günlük pasajına dayanan anlatı', 'Tek birliğin deneyimi'],
    fotograf_katalog_aciklamasi_okundu: ['Fotoğraf katalog açıklamasına dayanan anlatı', 'Görüşmelerin bütün seyri']
  };
  for (const folder of ['olaylar', 'komutanlar']) {
    for (const dir of fs.readdirSync(path.join(root, folder), { withFileTypes: true }).filter(x => x.isDirectory())) {
      const url = `${folder}/${dir.name}/`;
      assert.ok(covered.has(url), url);
      const page = read(url + 'index.html');
      if (url === 'olaylar/18-mart-deniz-muharebesi/') {
        assert.match(page, /Kaynak incelemesi: desteklenen pasajlar ve açık kalanlar/);
        assert.match(page, /her ayrıntının doğrulandığı anlamına gelmez/);
        assert.match(page, /Kesin batış saatleri, zayiat toplamları ve bazı harita noktaları için inceleme sürüyor/);
      } else if (review.pages.find(p => p.path === url).readerSupport) {
        const support = review.pages.find(p => p.path === url).readerSupport;
        for (const text of [support.label, support.summary, ...support.reasons]) assert.ok(page.includes(text), url + ': destek ve sınır metni');
        assert.ok(page.includes('<details class="source-support-reason">'), url);
        assert.ok(page.includes('href="#kaynak-notu">İncelenen pasajları ve açık kalanları oku'), url);
        assert.doesNotMatch(page, /Belge doğrulaması tamamlanmadı/);
        assert.equal(support.presentationReviewDate, '2026-11-03');
        assert.ok(support.sourceRefs.every(href => new URL(href).pathname !== '/'), url);
      } else if (/href="\/kronoloji-kaynaklari\/#([^"]+)"/.test(page)) {
        const id = page.match(/href="\/kronoloji-kaynaklari\/#([^"]+)"/)[1];
        const record = chronology.find(row => row.id === id);
        assert.ok(record, url);
        const labels = supportLabels[record.source.status];
        assert.ok(labels, id);
        for (const label of labels) assert.ok(page.includes(label), url + ': ' + label);
        assert.doesNotMatch(page, /Belge doğrulaması tamamlanmadı/);
      } else {
        assert.match(page, /Belge doğrulaması tamamlanmadı/);
      }
      assert.ok(page.includes('Kanıt metni ve inceleme sınırı') || page.includes('<q>'), url);
    }
  }
  for (const source of review.sources) {
    assert.ok(new URL(source.url).pathname !== '/');
    assert.ok(source.status && source.reviewed && source.scope);
    assert.notEqual(source.status, 'iddia_dogrulandi');
    assert.ok(ledger.includes(`id="${source.id}"`), source.id);
  }
});

test('kronoloji boşlukları muharebe olmadığı iddiasına dönüştürülmez', () => {
  const ctx = { window: {} };
  for (const file of ['js/data.js', 'js/campaign.js']) vm.runInNewContext(read(file), ctx);
  for (const event of ctx.window.OM.campaign.events.filter(x => x.quiet)) {
    assert.doesNotMatch(event.title + event.text, /adı konmuş.*(?:yok|değildir)|cephe yerinden oynamaz/i);
    assert.match(event.text, /anlamına gelmez/);
  }
});

test('kanıtsız Bele eşleştirmesi ve ona bağlı hayat tarihleri geri gelmez', () => {
  for (const file of ['js/data.js', 'js/campaign.js', 'komutanlar/index.html', 'komutanlar/rafet-bey-bele/index.html', 'inceleme-notlari/index.html']) {
    assert.equal(read(file).includes('Rafet Bey (Bele)'), false, file);
  }
  const person = read('komutanlar/rafet-bey-bele/index.html');
  assert.doesNotMatch(person, /<dt>(?:Doğum|Ölüm)<\/dt>/);
  assert.match(person, /eşleştirmesi doğrulanmadı/);
});
