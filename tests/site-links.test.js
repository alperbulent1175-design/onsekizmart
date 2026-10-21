const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const publicFolders = ['donanma', 'fotograf-arsivi', 'gizlilik', 'hakkinda', 'iletisim',
  'inceleme-notlari', 'kaynak-politikasi', 'kaynakca', 'komutanlar', 'nasil-okunur', 'olaylar', 'sozluk', 'telif'];
function htmlFiles(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(folder, entry.name);
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

test('yayımlanan sayfalardaki yerel bağlantılar, görseller ve bölüm hedefleri mevcuttur', () => {
  const files = [path.join(root, 'index.html'), ...publicFolders.flatMap(name => htmlFiles(path.join(root, name)))];
  const pages = new Map(files.map(file => [file, fs.readFileSync(file, 'utf8')]));
  const issues = [];
  for (const [file, html] of pages) {
    for (const [, raw] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue;
      const current = new URL('https://atlas.invalid/' + path.relative(root, file).split(path.sep).join('/'));
      const url = new URL(raw.replace(/&amp;/g, '&'), current);
      let target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      const label = path.relative(root, file) + ' → ' + raw;
      if (!fs.existsSync(target)) { issues.push(label + ' (dosya yok)'); continue; }
      if (!url.hash || !pages.has(target)) continue;
      const anchor = decodeURIComponent(url.hash.slice(1));
      const destination = pages.get(target);
      const ids = [...destination.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
      // Fotoğraf görüntüleyicisi bu sanal çapayı kurum kayıt numarasından açar.
      const photos = [...destination.matchAll(/\bdata-photo-id="([^"]+)"/g)].map(match => 'foto-' + match[1]);
      if (!ids.includes(anchor) && !photos.includes(anchor)) issues.push(label + ' (bölüm yok)');
    }
  }
  assert.deepEqual(issues, []);
});

test('menüyü atlama bağlantısı bütün sayfalarda odaklanabilir içeriğe ulaşır', () => {
  const files = [path.join(root, 'index.html'), ...publicFolders.flatMap(name => htmlFiles(path.join(root, name)))];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const skips = [...html.matchAll(/<a\b[^>]*class="skip"[^>]*href="#([^"]+)"/g)];
    assert.ok(skips.length, path.relative(root, file) + ': atlama bağlantısı');
    for (const skip of skips) {
      const target = [...html.matchAll(/<(?:main|section)\b([^>]+)>/g)].find(([, attrs]) => attrs.includes('id="' + skip[1] + '"'));
      assert.ok(target && target[1].includes('tabindex="-1"'), path.relative(root, file) + ': hedef klavye odağı almalı');
    }
    if (file === path.join(root, 'index.html')) assert.ok(skips.some(match => match[1] === 'kronoloji'));
  }
});

test('fotoğraf bölüm bağlantıları JavaScript olmadan odaklanabilir gerçek hedeflere gider', () => {
  for (const folder of ['fotograf-arsivi', 'donanma', 'olaylar', 'komutanlar']) {
    for (const file of htmlFiles(path.join(root, folder))) {
      const html = fs.readFileSync(file, 'utf8');
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
      assert.equal(new Set(ids).size, ids.length, path.relative(root, file) + ': bölüm kimlikleri benzersiz olmalı');
      for (const [, attrs, photo] of html.matchAll(/<figure\b([^>]*data-photo-id="([^"]+)"[^>]*)>/g)) {
        assert.ok(attrs.includes('id="foto-' + photo.replace(/ /g, '-') + '"'), photo);
        assert.ok(attrs.includes('tabindex="-1"'), photo);
      }
    }
  }
});
