const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const dir = path.join(root, 'research/photo-archive/2026-10-17');
const records = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')).records;
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

test('fotoğraf arşivi dosyaları künye ve bütünlük kaydını korur', () => {
  assert.equal(new Set(records.map(r => r.id)).size, records.length);
  for (const r of records) {
    for (const field of ['sourceUrl', 'downloadUrl', 'accessed', 'credit', 'rightsEvidence', 'rightsStatus', 'evidenceText']) assert.ok(r[field], `${r.id}: ${field}`);
    const archived = path.join(dir, r.localFile);
    const media = fs.existsSync(archived) ? archived : path.join(root, r.sitePreparedPath);
    assert.equal(hash(media), r.sha256, r.id);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, r.localFile + '.json'), 'utf8')), r);
    if (r.originalCopy) {
      assert.match(r.originalCopy.downloadUrl, /^https:\/\//);
      assert.match(r.originalCopy.sha256, /^[a-f0-9]{64}$/);
      const original = path.join(dir, r.originalCopy.localFile);
      if (fs.existsSync(original)) {
        assert.equal(hash(original), r.originalCopy.sha256, `${r.id}: yüksek çözünürlüklü asıl kopya`);
        assert.equal(fs.statSync(original).size, r.originalCopy.bytes, r.id);
      }
    }
  }
});

test('sitede kullanılan kopyalar incelenmiş görsel ve kaynak kaydıyla eşleşir', () => {
  for (const r of records.filter(r => r.sitePreparedPath)) {
    assert.equal(r.verificationStatus, 'kurum_kunyesi_ve_gorsel_incelendi', r.id);
    assert.ok(r.altTr && r.visualReviewDate, r.id);
    assert.equal(hash(path.join(root, r.sitePreparedPath)), r.sha256, r.id);
    const pages = r.localUses || [r.sitePreparedPage + 'index.html'];
    for (const page of pages) {
      const text = fs.readFileSync(path.join(root, page), 'utf8');
      assert.ok(text.includes(r.sourceUrl), `${page}: kaynak`);
      assert.ok(text.includes(r.localFile), `${page}: fotoğraf`);
      assert.ok(text.includes(r.altTr), `${page}: alt metin`);
    }
  }
});
