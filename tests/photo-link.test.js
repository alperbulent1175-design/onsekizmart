const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/photo-archive.js'), 'utf8');
test('fotoğraf bağlantısı yalnız mevcut ve görünür kayıt kimliğini açar', () => {
  const visible = { parentElement: { getAttribute: () => 'P00369.014' }, closest: () => null };
  const hidden = { parentElement: { getAttribute: () => 'A02360' }, closest: () => ({ hidden: true }) };
  const ctx = { links: [visible, hidden] };
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('  function photoFromHash('), source.indexOf('  links.forEach(')), ctx);
  assert.equal(ctx.photoFromHash('#foto-P00369.014'), visible);
  assert.equal(ctx.photoFromHash('#foto-P00369%2E014'), visible);
  for (const hash of ['#foto-A02360', '#foto-missing', '#foto-%E0%A4', '#foto-', '#gemiler', '#foto-javascript:alert(1)'])
    assert.equal(ctx.photoFromHash(hash), null, hash);
});
