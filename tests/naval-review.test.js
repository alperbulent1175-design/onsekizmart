const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const report = JSON.parse(read('research/ux-audit/18-mart-iddia-incelemesi.json'));
const ctx = { window: {} };
vm.runInNewContext(read('js/data.js'), ctx);
test('31 saatli kaydın inceleme izi korunur, inceleme doğrulanmış etiketi değildir', () => {
  assert.equal(report.records.length, 31);
  assert.equal(report.records.length, ctx.window.OM.events.length);
  assert.equal(new Set(report.records.map(r => r.key)).size, 31);
  report.records.forEach((r, i) => {
    assert.equal(r.existingTime, ctx.window.OM.events[i].t);
    assert.equal(r.existingMinute, ctx.window.OM.events[i].m);
    assert.equal(r.title, ctx.window.OM.events[i].title);
    assert.equal(r.timeVerification, 'belge_karsilastirmasi_acik');
    assert.equal(r.textVerification, 'belge_karsilastirmasi_acik');
  });
});
test('Inflexible için belgesiz sayı ve ayrılış saati kaldırılır, yerine yeni kesin saat üretilmez', () => {
  const event = ctx.window.OM.events.find(e => e.title === 'Inflexible mayınlanır');
  assert.equal(event.t, '14:14'); assert.equal(event.m, 854);
  assert.doesNotMatch(event.text, /39 ölü|14.25/);
  assert.match(event.text, /belgeyle doğrulanmadı/);
  const before = report.records.find(r => r.title === event.title);
  assert.match(before.existingText, /39 ölü/);
  const note = read('olaylar/18-mart-deniz-muharebesi/index.html');
  assert.match(note, /inflexible-saat-incelemesi/);
  assert.match(note, /onay bekliyor/);
  assert.match(note, /bildirilme zamanını/);
  const source = report.sources[0];
  assert.match(source.url, /^https:\/\/transcribe.awm.gov.au\/transcription\/item\//);
  assert.ok(source.evidence); assert.equal(source.date, '2026-10-17');
  assert.notEqual(source.status, 'iddia_dogrulandi');
});


test('Bouvet sayıları olay, mevki ve gemi özetlerinde kesin değer olarak tekrarlanmaz', () => {
  const event = ctx.window.OM.events.find(e => e.place === 'bouvet');
  assert.equal(event.t, '13:54');
  assert.doesNotMatch(event.text, /639|47 kurtulan|1 dk 55/);
  assert.match(event.text, /özgün raporla karşılaştırma açık/);
  for (const id of ['bouvet', 'inflexible']) {
    const place = ctx.window.OM.places.find(p => p.id === id);
    assert.doesNotMatch(place.meta + place.short, /639|39 ölü|1 dakika 55/);
    const before = report.relatedBefore.places.find(p => p.id === id);
    assert.equal(place.lat, before.lat); assert.equal(place.lng, before.lng);
  }
  const navy = read('donanma/index.html');
  assert.doesNotMatch(navy, /639 denizci ölür|39 denizci ölür|47 kişiyi kurtarır/);
  assert.match(navy, /#bouvet-saat-incelemesi/);
  const proof = report.sources.find(s => s.id === 'awm-bouvet-description');
  assert.ok(proof.url && proof.evidence && proof.date && proof.status);
  assert.notEqual(proof.status, 'iddia_dogrulandi');
});


test('Ocean isabeti ve batışı ayrı inceleme kayıtlarıdır; tahliye ayrıntıları kesin sunulmaz', () => {
  const hit = ctx.window.OM.events.find(e => e.title === 'Ocean mayına çarpar');
  const sinking = ctx.window.OM.events.find(e => e.title === 'Ocean batar');
  assert.equal(hit.m, 1005); assert.equal(sinking.m, 1350);
  assert.match(hit.text, /farklı kesinliktedir/);
  assert.match(hit.text, /belgeyle doğrulanmadı/);
  assert.match(sinking.text, /kesinleştirilmedi/);
  assert.doesNotMatch(hit.text + sinking.text, /Colne|Chelmer|Jed|650/);
  const place = ctx.window.OM.places.find(p => p.id === 'ocean');
  const before = report.relatedBefore.places.find(p => p.id === 'ocean');
  assert.equal(place.lat, before.lat); assert.equal(place.lng, before.lng);
  assert.doesNotMatch(place.meta + place.short, /16.45|22.30|650/);
  assert.doesNotMatch(read('donanma/index.html'), /650 kişiyi tahliye eder|650 kişiyi birlikte tahliye eder/);
  assert.match(read('olaylar/18-mart-deniz-muharebesi/index.html'), /id="ocean-saat-incelemesi"/);
  for (const title of [hit.title, sinking.title]) {
    const row = report.records.find(r => r.title === title);
    assert.equal(row.sourceRefs.length, 2);
    row.sourceRefs.forEach(id => { const s = report.sources.find(s => s.id === id); assert.ok(s.url && s.evidence && s.date); assert.notEqual(s.status, 'iddia_dogrulandi'); });
  }
});
