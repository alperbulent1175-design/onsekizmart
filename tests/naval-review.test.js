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
test('deniz olay paneli denetimi açık anlatıyı taslak olarak sunar ve özgün kaydı korur', () => {
  const app = read('js/app.js');
  const event = { title: 'İnceleme kaydı', t: '07:30', m: 450, place: null, text: 'Belgeyle eşleştirilecek anlatı.' };
  let panel;
  const context = { fillPanel: value => { panel = value; }, sideLabel: () => '', sourceText: () => 'Kaynak incelemesi açık',
    slugify: () => 'inceleme-kaydi', paintIcons() {}, flyToPlace() {}, paintCurrent() {} };
  vm.createContext(context);
  vm.runInContext(app.slice(app.indexOf('  function navalReviewHref('), app.indexOf('  function fillFromCamp(')), context);
  context.fillFromNaval(event, false);
  assert.equal(panel.text, 'İncelenen taslak: ' + event.text);
  assert.equal(event.text, 'Belgeyle eşleştirilecek anlatı.');
  assert.match(panel.date, /Saat doğrulanmadı/);
  assert.doesNotMatch(panel.date, /07:30/);
  for (const title of ['Queen Elizabeth’in ilk 381 mm’lik salvosu', 'Signal No. 12 — genel çekilme', 'Filo Ege’ye çıkar']) {
    const record = ctx.window.OM.events.find(e => e.title === title);
    context.findPlace = id => ({ id, name: id });
    context.accuracyText = () => '';
    context.fillFromNaval(record, false);
    assert.equal(panel.reviewHref, '/olaylar/18-mart-deniz-muharebesi/#queen-elizabeth-saat-incelemesi');
    assert.ok(panel.shareHref.includes('dakika=' + record.m));
  }
  context.fillFromNaval(event, false);

  assert.equal(panel.reviewHref, '/olaylar/18-mart-deniz-muharebesi/#kaynak-notu');
  context.findPlace = id => ({ id, name: id });
  context.accuracyText = () => 'Konum incelemesi açık';
  const anchors = { ocean: 'tahliye-batis-ayrimi', irresistible: 'tahliye-batis-ayrimi',
    bouvet: 'bouvet-saat-incelemesi', inflexible: 'inflexible-saat-incelemesi', gaulois: 'gaulois-kaynak' };
  for (const [place, anchor] of Object.entries(anchors)) {
    context.fillFromNaval({ ...event, place }, false);
    assert.equal(panel.reviewHref, '/olaylar/18-mart-deniz-muharebesi/#' + anchor);
    assert.ok(read('olaylar/18-mart-deniz-muharebesi/index.html').includes('id="' + anchor + '"'));
  }
});
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
  assert.equal(event.sourceTime.time, '16:11');
  assert.equal(event.sourceTime.kind, 'bildirim');
  assert.match(event.text, /isabetin kesin anı değildir/);
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
    if (id === 'inflexible') {
      assert.match(place.name, /yaklaşık hasar/);
      assert.match(place.uncertainty, /sayısal konum dayanağı tamamlanmadı/);
      assert.match(place.uncertainty, /enkaz noktası olarak okunmamalıdır/);
    }
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
  assert.equal(hit.sourceTime.time, '18:05');
  assert.equal(hit.sourceTime.kind, 'isabet kaydı');
  assert.match(hit.text, /batış zamanı değildir/);
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


test('doğrudan gemi seçimi olay paneliyle aynı kanıt bölümünü açar; diğer mevkiler genel incelemeyi korur', () => {
  const app = read('js/app.js');
  let panel, selected, focused = 0;
  const context = {
    D: { events: ctx.window.OM.events },
    findPlace: id => ({ id, name: id }),
    fillPanel: spec => { panel = spec; },
    textEl: (tag, textContent) => ({ tag, textContent, addEventListener(type, handler) { this.activate = handler; } }),
    focusNavalEvent: event => { selected = event; }, focusSelectedPanel() { focused++; },
    paintIcons() {}, flyToPlace() {}, updateSelectedLayerNotice() {},
    accuracyText: () => '', sourceText: () => '', sideLabel: () => ''
  };
  vm.createContext(context);
  vm.runInContext(app.slice(app.indexOf('  function navalReviewHref('), app.indexOf('  function fillFromNaval(')), context);
  vm.runInContext(app.slice(app.indexOf('  function openPlace('), app.indexOf('  function closePanel(')), context);
  for (const id of ['bouvet', 'inflexible', 'tavsan', 'ocean', 'irresistible']) {
    context.openPlace(id, false);
    assert.equal(panel.reviewHref, context.navalReviewHref(id));
    assert.equal(panel.shareHref, '/?mevki=' + id + '#harita');
    const events = ctx.window.OM.events.filter(event => event.place === id);
    const buttons = panel.extra.filter(node => node.tag === 'button');
    assert.equal(buttons.length, events.length);
    buttons.forEach((button, index) => {
      assert.ok(button.textContent.includes(context.navalTimeLabel(events[index])));
      button.activate(); assert.equal(selected, events[index]);
    });
  }
  assert.ok(focused > 0);
  context.openPlace('baska-mevki', false);
  assert.equal(panel.reviewHref, '');
  context.findPlace = id => ({ id, name: id, short: 'Belge karşılaştırması süren anlatı.',
    coordinateSource: { status: 'kurumsal_ziyaret_noktasi_karsilastirildi' }, verification: 'cerceve' });
  context.openPlace('mecidiye', false);
  assert.equal(panel.text, 'Taslak mevki notu: Belge karşılaştırması süren anlatı.');
  context.findPlace = id => ({ id, name: id, note: ['İncelenecek mevki anlatımı.'] });
  context.openPlace('baska-mevki', false);
  assert.equal(panel.text, 'Taslak mevki notu: İncelenecek mevki anlatımı.');
});


test('Gaulois ada eşleştirmesi kesin sunulmaz; mevcut nokta ve bağlantı anahtarları korunur', () => {
  const place = ctx.window.OM.places.find(p => p.id === 'tavsan');
  assert.equal(place.lat, 40.0038); assert.equal(place.lng, 26.152);
  assert.match(place.uncertainty, /eşleştirilmesi.*doğrulanmadı/);
  assert.doesNotMatch(place.name, /Tavşan \(Drepano\)/);
  const event = ctx.window.OM.events.find(e => e.title === 'Gaulois karaya oturtulur');
  assert.equal(event.m, 875); assert.equal(event.place, 'tavsan');
  assert.match(event.text, /belgeyle doğrulanmadı/);
  const navy = read('donanma/index.html').split('id="gaulois"')[1].split('</article>')[0];
  assert.match(navy, /#gaulois-kaynak/);
  assert.doesNotMatch(navy, /12.28’de|14.35’te|Tavşan \(Drepano\)/);
});


test('Irresistible enkaz koordinatı korunur; tahliye ve batış saatleri kesin sunulmaz', () => {
  const place = ctx.window.OM.places.find(p => p.id === 'irresistible');
  assert.equal(place.lat, 40.073966667); assert.equal(place.lng, 26.340683333);
  assert.ok(place.coordinateSource.url && place.coordinateSource.evidenceText);
  assert.doesNotMatch(place.meta + place.short, /600|19.30|16.11/);
  const events = ctx.window.OM.events.filter(e => e.place === 'irresistible');
  assert.deepEqual(Array.from(events, e => e.m), [971, 992, 1170]);
  assert.doesNotMatch(events.map(e => e.text).join(' '), /600|7°/);
  const navy = read('donanma/index.html').split('id="irresistible"')[1].split('</article>')[0];
  assert.match(navy, /#tahliye-batis-ayrimi/);
  assert.doesNotMatch(navy, /600|19.30|16.11/);
});


test('donanma kartları belge denetimini görünür tutar ve incelenen gemilere hızlı ulaşılır', () => {
  const navy = read('donanma/index.html');
  const reviewed = new Set(['bouvet', 'irresistible', 'ocean', 'inflexible', 'gaulois']);
  const cards = [...navy.matchAll(/<article class="ship-card" id="([^"]+)">([\s\S]*?)<\/article>/g)];
  assert.ok(cards.length > reviewed.size);
  for (const [, id, body] of cards) {
    if (reviewed.has(id)) {
      assert.ok(navy.includes('href="#' + id + '"'));
      assert.match(body, /href="\/olaylar\/18-mart-deniz-muharebesi\/#/);
    } else assert.match(body, /Ayrıntılı belge denetimi açık/);
  }
});


test('Queen Elizabeth saat farkı açıklanır; filo başlangıcına ve yeni saate genellenmez', () => {
  const note = read('olaylar/18-mart-deniz-muharebesi/index.html');
  assert.match(note, /id="queen-elizabeth-saat-incelemesi"/);
  assert.match(note, /bütün filonun ilk atış saati olarak genellenmez/);
  const card = read('donanma/index.html').split('id="queen-elizabeth"')[1].split('</article>')[0];
  assert.match(card, /#queen-elizabeth-saat-incelemesi/);
  assert.doesNotMatch(card, /11.00’de|17.00’de|17.45’te/);
  const event = ctx.window.OM.events.find(e => e.title === 'Queen Elizabeth’in ilk 381 mm’lik salvosu');
  assert.equal(event.m, 660);
  assert.equal(event.sourceTime.time, '11:25');
  assert.equal(event.sourceTime.kind, 'ateşe başlama');
  assert.match(event.sourceTime.limit, /karşılaştırma açık/);
});


test('Çimenlik özeti rapordaki hedef numarasını kanıtsız eşleştirmez', () => {
  const place = ctx.window.OM.places.find(p => p.id === 'cimenlik');
  assert.doesNotMatch(place.short, /11.00’de|ilk 381/);
  assert.match(place.note[0], /eşleştirilmedi/);
  assert.equal(place.lat, 40.146395); assert.equal(place.lng, 26.399161);
  assert.match(place.coordinateSource.url, /kulturportali.gov.tr\/turkiye\/canakkale\/gezilecekyer\/cimenlik-kalesi/);
  assert.match(place.uncertainty, /mermi isabetinin kesin koordinatı değildir/);
});


test('kaynakla eslestirilmeyen 18 Mart sayilari kesin anlatimda kalmaz', () => {
  const changes = JSON.parse(read('research/reports/2026-10-25/R03-naval-visible-review.json')).records;
  assert.equal(changes.length, 6);
  for (const row of changes) {
    const event = ctx.window.OM.events.find(e => e.title === row.title);
    assert.equal(event.text, row.revisedText);
    assert.equal(row.claimVerified, false);
    assert.equal(row.sourceUrl, null);
    assert.match(event.text, /belge/);
  }
  const texts = changes.map(r => r.revisedText).join(' ');
  assert.doesNotMatch(texts, /10.000|13–14 km|9.000|14 isabet|30,5 cm|7 saatlik/);
});


test('Queen Elizabeth kalibresi katalog pasajina baglanir, top adedi ve zirh ayni kaynaktan turetilmez', () => {
 const body = read('donanma/index.html').split('id="queen-elizabeth"')[1].split('</article>')[0];
 assert.match(body, /1965-10-209-9/);
 assert.match(body, /381 mm \(15 inç\)/);
 assert.doesNotMatch(body, /<dd>330 mm<\/dd>|<dd>8×381 mm<\/dd>/);
 assert.match(body, /toplam top sayısını, zırh kalınlığını/);
 const record=JSON.parse(read('research/reports/2026-10-25/R03-queen-elizabeth-calibre.json'));
 assert.equal(record.conversion.resultMm,15*25.4);
 assert.equal(record.publicationDate,null);
 assert.notEqual(record.status,'iddia_dogrulandi');
});


test('donanma kartlari eski kesin dakikalari tekrar etmez; emir ve atese katilma ayrilir', () => {
 const rows=JSON.parse(read('research/reports/2026-10-25/R03-navy-report-consistency.json'));
 for(const row of rows){
  const body=read('donanma/index.html').split('id="'+row.ship+'"')[1].split('</article>')[0];
  assert.ok(body.includes(row.revisedText));
  assert.ok(body.includes(row.url));
  assert.ok(row.evidenceText && row.accessDate && row.documentDate);
  assert.notEqual(row.status,'iddia_dogrulandi');
 }
 const lord=rows.find(x=>x.ship==='lord-nelson').revisedText;
 assert.match(lord,/ayrı bir kesin dakika verilmez/);
 assert.match(rows.find(x=>x.ship==='suffren').revisedText,/Emir ile fiilî çatışma aynı an değildir/);
});


test('Suffren ozet alani kanitsiz kesin isabet sayisini anlatinin yaninda tekrar etmez', () => {
 const body=read('donanma/index.html').split('id="suffren"')[1].split('</article>')[0];
 assert.doesNotMatch(body,/14 direkt isabet|14 isabet/);
 assert.match(body,/Kesin isabet ve hasar dökümünün belge karşılaştırması sürüyor/);
});


test('gemi kart sayisi eszamanli taarruz mevcudu sayilmaz, devriye ayri anlatilir', () => {
 const navy=read('donanma/index.html');
 assert.doesNotMatch(navy,/yaklaşık 60 deniz unsuru|Aşağıdaki 18 gemi ana muharebe hattıdır|18 ana muharebe gemisi/);
 for(const id of ['canopus','cornwallis'])assert.match(navy.split('id="'+id+'"')[1].split('</article>')[0],/devriyede/);
 const record=JSON.parse(read('research/reports/2026-10-25/R03-fleet-scope.json'));
 assert.equal(record.documentDate,'1915-03-24');assert.equal(record.coverLetterDate,'1915-03-26');
 assert.ok(record.url && record.evidenceText && record.accessDate);
});


test('muhrip ve tarama gorev kayitlari toplam kadro ve gecit emniyeti sayilmaz', () => {
 const navy=read('donanma/index.html');
 const destroyers=navy.split('id="muhripler"')[1].split('</article>')[0];
 assert.doesNotMatch(destroyers,/16 İngiliz ve Fransız/);
 assert.match(destroyers,/eksiksiz toplamını vermez/);
 const sweep=navy.split('id="tarama"')[1].split('</article>')[0];
 assert.match(sweep,/toplam tekne mevcudu değildir/);
 assert.match(sweep,/bütün geçidin güvenli olduğunun kanıtı sayılmaz/);
 const records=JSON.parse(read('research/reports/2026-10-25/R03-support-scope.json'));
 records.forEach(r=>assert.ok(r.url&&r.evidenceText&&r.documentDate&&r.accessDate));
});


test('ileri hat emri ve gecisi donanma ozetleriyle anlatilarda tutarlidir', () => {
 const navy=read('donanma/index.html'); assert.doesNotMatch(navy,/13\.45/);
 for(const id of ['albion','vengeance','swiftsure','majestic-18','irresistible','ocean']){
 const body=navy.split('id="'+id+'"')[1].split('</article>')[0];assert.match(body,/14\.32/);
 }
 for(const id of ['swiftsure','majestic-18'])assert.match(navy.split('id="'+id+'"')[1].split('</article>')[0],/destek/);
});


test('Henri IV korumali kruvazor grubuna konulmaz, sinif kaydi gorev tarihi yapilmaz', () => {
 const body=read('donanma/index.html').split('id="kruvazorler"')[1].split('</article>')[0];
 assert.doesNotMatch(body,/Sapphire ile Fransız Henri IV sayılır/);
 assert.match(body,/Henri IV bu sınıf listesine dahil edilmez/);
 assert.match(body,/IM50000725/);
 assert.match(body,/18 Mart’taki konumunu veya görevini kanıtlamaz/);
 const r=JSON.parse(read('research/reports/2026-10-25/R03-henri-iv-classification.json'));
 assert.equal(r.eventDate,null);assert.ok(r.url&&r.evidenceText&&r.accessDate);
});


test('Inflexible tek zirh degeri tum gemi korumasi diye okunmaz', () => {
 const body=read('donanma/index.html').split('id="inflexible"')[1].split('</article>')[0];
 assert.match(body,/178 mm — bu değerin ait olduğu zırh bölümü ve tarih/);
 assert.doesNotMatch(body,/<dd>178 mm<\/dd>/);
 const r=JSON.parse(read('research/reports/2026-10-25/R03-inflexible-armour-scope.json'));
 assert.equal(r.claimVerified,false);assert.equal(r.evidenceText,null);
});


test('Nusret mayin sayisi dogru kapsamda katalog pasajina baglanir', () => {
 const body=read('donanma/index.html').split('id="nusret"')[1].split('</article>')[0];
 assert.match(body,/26 mayın/);assert.match(body,/C1068416/);
 assert.match(body,/Fotoğrafın kendisi bu geceki döşeme anını göstermez/);
 assert.doesNotMatch(body,/hiçbir gemi çarpmaz/);
 const r=JSON.parse(read('research/reports/2026-10-25/R03-nusret-mine-count.json'));
 assert.ok(r.url&&r.evidenceText&&r.accessDate);assert.equal(r.publicationDate,null);
});
