const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
test('yeni kronoloji kayıtları tarihli kanıt ve çalışan kaynak hedefi taşır', () => {
  const ctx = { window: { OM: {} } };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), ctx);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'js/campaign.js'), 'utf8'), ctx);
  const events = ctx.window.OM.campaign.events;
  assert.equal(events.filter(e => e.quiet).length, 0);
  const additions = events.filter(e => e.chronologySource);
  assert.equal(additions.length, 18);
  const notes = JSON.parse(fs.readFileSync(path.join(root, 'data/chronology-sources.json'), 'utf8'));
  const html = fs.readFileSync(path.join(root, 'kronoloji-kaynaklari/index.html'), 'utf8');
  for (const event of additions) {
    const source = event.chronologySource;
    assert.ok(source.evidenceText && source.passage && source.accessDate);
    assert.equal(source.eventDate, event.date);
    assert.ok(new URL(source.url).pathname !== '/');
    assert.notEqual(source.status, 'iddia_dogrulandi');
    assert.ok(notes.some(note => note.id === event.id && note.source.url === source.url));
    assert.ok(html.includes('id="' + event.id + '"'));
    assert.ok(event.place == null || ctx.window.OM.places.concat(ctx.window.OM.campaign.places).some(p => p.id === event.place));
  }
  const decisions = ['e-kitchener-tahliye', 'e-aralik-onay', 'e-tahliye-ari', 'e-aralik-ocak', 'e-tahliye-sedd'];
  const positions = decisions.map(id => events.findIndex(e => e.id === id));
  assert.ok(positions.every((n, i) => n >= 0 && (i === 0 || n > positions[i - 1])));
});
