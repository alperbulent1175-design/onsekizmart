const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
test('rapor aşaması eski oynatma dakikasından ayrılır ve kanıtsız saat gösterilmez', () => {
  const root = path.join(__dirname, '..');
  const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), ctx);
  vm.runInContext(app.slice(app.indexOf('  function navalTimeLabel('), app.indexOf('  function fillFromNaval(')), ctx);
  const records = ctx.window.OM.events.filter(e => e.sourceTime);
  assert.equal(records.length, 7);
  for (const record of records) {
    assert.match(ctx.navalTimeLabel(record), /^\d{2}:\d{2} ·/);
    assert.ok(record.sourceTime.url && record.sourceTime.evidenceText && record.sourceTime.documentDate);
    assert.match(record.sourceTime.timeSystem, /GMT\+2/);
    assert.match(record.sourceTime.limit, /karşılaştırma açık/);
  }
  const hit = records.find(e => e.place === 'inflexible');
  assert.equal(hit.m, 854);
  assert.equal(ctx.navalTimeLabel(hit), '16:11 · bildirim (rapor)');
  assert.equal(ctx.navalTimeLabel({t:'14:14',m:854}), 'Saat doğrulanmadı');
  assert.equal(ctx.navalTimeLabel({sourceTime:{...hit.sourceTime,time:'99:99'}}), 'Saat doğrulanmadı');
  assert.equal(ctx.navalTimeLabel({sourceTime:{...hit.sourceTime,evidenceText:''}}), 'Saat doğrulanmadı');
});
