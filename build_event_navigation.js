// Mevcut atlas kayıt sırasından statik gezinme üretir; tarihsel veri yazmaz.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const START = '<!-- atlas-event-navigation:start -->';
const END = '<!-- atlas-event-navigation:end -->';
function escape(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function entries() {
  const ctx = { window: { OM: {} } };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'js/campaign.js'), 'utf8'), ctx);
  const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
  vm.runInContext(app.slice(app.indexOf('  function slugify('), app.indexOf('  function findCampByKey(')), ctx);
  const list = Array.from(ctx.window.OM.campaign.events).filter(e => ctx.eventPageHref(e));
  return list.map(e => ({ title: e.title, date: e.date, href: ctx.eventPageHref(e) }));
}
function render(list, index) {
  function link(item, label, relation) {
    return item ? '<a rel="' + relation + '" href="' + escape(item.href) + '"><span>' + label + '</span><strong>' + escape(item.title) + '</strong>' +
      (item.date ? '<small>' + escape(item.date) + '</small>' : '') + '</a>' : '';
  }
  return START + '\n<nav class="event-navigation" aria-label="Olay kayıtları arasında gezinme">\n' +
    '<p class="event-reading-return"><a href="#icerik">Sayfanın başına dön</a></p>\n' +
    '<p class="event-record-position">Atlas kaydı ' + (index + 1) + ' / ' + list.length + '</p>\n' +
    '<p>Atlasın kayıt sırasına göre ilerleyin. Aynı gündeki kayıtlar kesin saat sırasını göstermez.</p>\n<div>' +
    link(list[index - 1], 'Önceki kayıt', 'prev') + link(list[index + 1], 'Sonraki kayıt', 'next') +
    '</div>\n<p class="event-all-records"><a href="/olaylar/">Tüm olayları listele</a></p>\n</nav>\n' + END;
}
function build() {
  const list = entries();
  if (new Set(list.map(e => e.href)).size !== list.length) throw new Error('Tekrarlı olay adresi');
  // Önce bütün dosyaları doğrula; eksik hedef varsa yazmaya başlama.
  const pages = list.map((e, i) => {
    const file = path.join(root, e.href, 'index.html');
    const original = fs.readFileSync(file, 'utf8');
    if (!original.includes('</main>')) throw new Error('Ana içerik yok: ' + file);
    const block = render(list, i);
    const start = original.indexOf(START), end = original.indexOf(END);
    if ((start < 0) !== (end < 0) || (start >= 0 && end < start)) throw new Error('Eksik gezinme işareti');
    let updated = start < 0 ? original.replace('</main>', block + '\n</main>')
      : original.slice(0, start) + block + original.slice(end + END.length);
    // Preserve each page's current stylesheet version when rebuilding navigation.
    updated = updated.replace('<main class="page-main" id="icerik">', '<main class="page-main" id="icerik" tabindex="-1">');
    return { file, original, updated };
  });
  let changed = 0;
  pages.forEach(p => { if (p.updated !== p.original) { fs.writeFileSync(p.file, p.updated); changed++; } });
  return { pages: pages.length, changed };
}
module.exports = { entries, render, build };
if (require.main === module) console.log(JSON.stringify(build()));
