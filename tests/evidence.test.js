const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function setup() {
  const ctx = { window: {}, URL, Date };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/model.js'), 'utf8'), ctx);
  return ctx.window.OMModel;
}
function fixture(model) {
  // Deliberately fictional software fixture, never a historical source or published record.
  model.catalog.push({ id: 'test-only', scope: 'belge', claimSupport: true, page: 'test-page', documentNo: 'test-document', url: 'https://example.invalid/test-document' });
  return { id: 'test-record', text: 'Test statement', sourceIds: ['test-only'], evidence: [{ recordId: 'test-record', sourceId: 'test-only', claim: 'Test statement', url: 'https://example.invalid/test-document', evidenceText: 'Test evidence', date: '2026-10-16', status: 'iddia_dogrulandi' }] };
}

test('künye numaraları ve önceden yazılmış doğrulama etiketi kanıt yerine geçmez', () => {
  const model = setup();
  model.catalog.forEach(src => { src.page = 'test-page'; src.documentNo = 'test-document'; });
  const record = model.annotate({ id: 'test-record', text: 'Test statement', sourceIds: ['awm'], verification: 'sayfa' });
  assert.equal(record.verification, 'cerceve');
});

test('tam kayıt kanıtı metin değişince veya başka kayda taşınınca geçersiz olur', () => {
  const model = setup();
  const record = fixture(model);
  assert.equal(model.annotate(record).verification, 'sayfa');
  record.text = 'Changed test statement';
  assert.equal(model.annotate(record).verification, 'cerceve');
  record.text = 'Test statement'; record.id = 'another-test-record';
  assert.equal(model.annotate(record).verification, 'cerceve');
});

test('eksik kanıt, geçersiz tarih, ana sayfa ve güvensiz URL doğrulama üretmez', () => {
  const changes = [
    r => { delete r.evidence; }, r => { r.evidence = []; },
    r => { r.evidence = [null]; },
    r => { r.evidence[0].evidenceText = '  '; },
    r => { r.evidence[0].date = ''; }, r => { r.evidence[0].date = '2026-02-30'; },
    r => { r.evidence[0].status = 'metadata_kontrol_edildi'; },
    r => { r.evidence[0].sourceId = 'unknown'; },
    r => { r.sourceIds = ['awm']; },
    r => { r.evidence[0].url = 'https://example.invalid/'; },
    r => { r.evidence[0].url = 'https://example.invalid/?document=test'; },
    r => { r.evidence[0].url = 'javascript:alert(1)'; },
    r => { r.evidence[0].url = '/test-document'; },
    r => { r.evidence[0].url = 'https://user:password@example.invalid/test-document'; },
    r => { r.evidence[0].url = 'https://example.invalid/another-document'; },
    (r, m) => { m.byId('test-only').scope = 'kurum'; },
    (r, m) => { m.byId('test-only').claimSupport = false; },
    (r, m) => { m.byId('test-only').documentNo = null; },
    (r, m) => { m.byId('test-only').documentNo = '  '; },
    (r, m) => { m.byId('test-only').page = '  '; },
    (r, m) => { m.byId('test-only').url = 'https://example.invalid/'; },
  ];
  changes.forEach((change, i) => {
    const model = setup(), record = fixture(model); change(record, model);
    assert.equal(model.annotate(record).verification, 'cerceve', 'invalid case ' + i);
  });
});

test('mevcut katalog ve atlas kayıtları değiştirilmeden çerçeve durumunda kalır', () => {
  const ctx = { window: {}, URL, Date };
  ['data', 'campaign', 'model'].forEach(name => vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/' + name + '.js'), 'utf8'), ctx));
  const model = ctx.window.OMModel, data = ctx.window.OM;
  const before = JSON.stringify(model.catalog);
  [...data.places, ...data.events, ...data.campaign.events].forEach(record => assert.equal(model.annotate(record).verification, 'cerceve'));
  assert.equal(JSON.stringify(model.catalog), before);
});
