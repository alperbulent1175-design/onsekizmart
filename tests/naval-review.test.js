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
  for (const title of ['Queen Elizabeth’in ateşe başlaması', 'Filo Ege’ye çıkar']) {
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
    assert.equal(r.currentTitle || r.title, ctx.window.OM.events[i].title);
    assert.equal(r.timeVerification, 'belge_karsilastirmasi_acik');
    assert.equal(r.textVerification, 'belge_karsilastirmasi_acik');
  });
});
test('Inflexible için belgesiz sayı ve ayrılış saati kaldırılır, yerine yeni kesin saat üretilmez', () => {
  const event = ctx.window.OM.events.find(e => e.title === 'Inflexible’ın mayın isabeti bildirimi');
  assert.equal(event.t, '14:14'); assert.equal(event.m, 854);
  assert.doesNotMatch(event.text, /39 ölü|14.25/);
  assert.equal(event.sourceTime.time, '16:11');
  assert.equal(event.sourceTime.kind, 'bildirim');
  assert.match(event.text, /isabetin kesin anı değildir/);
  const before = report.records.find(r => (r.currentTitle || r.title) === event.title);
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
  assert.match(hit.text, /saat farkı çözülmedi/);
  assert.equal(hit.sourceTime.time, '18:05');
  assert.equal(hit.sourceTime.kind, 'isabet kaydı');
  assert.match(hit.text, /batış zamanı değildir/);
  assert.match(sinking.text, /kesinleştirilmedi/);
  assert.doesNotMatch(hit.text + sinking.text, /650/);
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
  context.openPlace('anadolu-hamidiye', false);
  assert.equal(panel.reviewHref, '/olaylar/18-mart-deniz-muharebesi/#anadolu-hamidiye-donatim');
  context.openPlace('namazgah', false);
  assert.equal(panel.reviewHref, '/olaylar/18-mart-deniz-muharebesi/#namazgah-sayi-kapsami');
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
  const event = ctx.window.OM.events.find(e => e.title === 'Queen Elizabeth’in ateşe başlaması');
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
    const event = ctx.window.OM.events.find(e => e.title === (row.currentTitle || row.title));
    assert.equal(event.text, row.currentText || row.revisedText);
    assert.equal(row.claimVerified, false);
    assert.equal(row.sourceUrl, null);
    assert.match(row.revisedText, /belge/);
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
 assert.doesNotMatch(body,/178 mm/);
 assert.match(body,/kemer, taret ve güverte bölümleri için tarihli kalınlık belgesi henüz eşleştirilmedi/);
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

test('Nazmi gunluk atfi akademik sayfa goruntusu ile gunluk aslini ayirir', () => {
 const body=read('donanma/index.html').split('id="nusret"')[1].split('</article>')[0];
 assert.match(body,/45159#page=11/);
 assert.match(body,/05.30 ifadesi/);
 assert.match(body,/döküşün tamamlandığı veya geminin geri döndüğü kesin saat olarak kullanılmaz/);
 assert.match(body,/2010 baskısının sayfası henüz karşılaştırılmadı/);
 const record=JSON.parse(read('research/reports/2026-10-25/R03-nazmi-citation-chain.json'));
 assert.equal(record.chain.viewed,false);
 assert.equal(record.chain.cited_page,40);
 assert.equal(record.event_date,'1915-03-08');
});

test('Bouvet zirhi bolum ve yayin donemiyle verilir, 1915 cetveli sayilmaz', () => {
 const body=read('donanma/index.html').split('id="bouvet"')[1].split('</article>')[0];
 assert.doesNotMatch(body,/<dd>400 mm<\/dd>/);
 assert.match(body,/su hattı kemeri 8–16 inç/);
 assert.match(body,/büyük top taretleri 14½ inç/);
 assert.match(body,/1915 donatım cetveli karşılaştırılmadı/);
 const record=JSON.parse(read('research/reports/2026-10-25/R03-bouvet-armour.json'));
 assert.equal(record.publication_date,'1898-10');
 assert.equal(record.event_date,null);
 assert.ok(record.url&&record.evidence_quote&&record.access_date);
});

test('kaynak eslestirmesi olmayan donanma teknik degerleri taslak olarak gorunur', () => {
 const html=read('donanma/index.html');
 const inventory=JSON.parse(read('research/reports/2026-10-25/R03-visible-naval-technical-inventory.json'));
 for(const row of inventory.records.filter(row=>row.status==='taslak_teknik_deger_belge_eslestirmesi_acik')) {
   const id=row.page.split('#')[1];
   const body=html.split('id="'+id+'"')[1].split('</article>')[0];
   const cell=body.split('<dt>'+row.field+'</dt><dd>')[1].split('</dd>')[0];
   assert.match(cell,/Taslak teknik değer; belge eşleştirmesi açık/);
   assert.equal(row.claim_verified,false);
 }
});

test('Fransiz top envanteri ozgun plan veya 1915 toplam silah cetveli sayilmaz', () => {
 const html=read('donanma/index.html');
 for(const id of ['gaulois','charlemagne','bouvet']) {
   const body=html.split('id="'+id+'"')[1].split('</article>')[0];
   assert.match(body,/578_1699_1975.pdf#page=156/);
   assert.match(body,/listelenen planların kendisi ve 1915 donatım cetveli görülmedi/);
   const armament=body.split('<dt>Ana silah</dt><dd>')[1].split('</dd>')[0];
   assert.match(armament,/Taslak teknik değer/);
 }
 const record=JSON.parse(read('research/reports/2026-10-25/R03-french-artillery-inventory.json'));
 assert.equal(record.event_date,null);assert.equal(record.publication_date,'2005-01-01');
});

test('zafer raporu belgesiz telgraf alintisi ve kesin saat uretmez', () => {
 const event=ctx.window.OM.events.find(event=>event.title==='Zafer raporu');
 assert.ok(event);
 assert.match(event.text,/özgün metni, gönderim saati/);
 assert.doesNotMatch(event.text,/telgraf çeker: 3 büyük zırhlı/);
 assert.equal(event.sourceTime,undefined);
 assert.match(read('olaylar/18-mart-deniz-muharebesi/index.html'),/id="zafer-raporu-kaynagi"/);
});

test('Charlemagne rapor asamalari menzil veya tum gemilerin ilk atisi sayilmaz', () => {
 const body=read('donanma/index.html').split('id="charlemagne"')[1].split('</article>')[0];
 assert.match(body,/12.06/);assert.match(body,/13.25/);
 assert.match(body,/hedef numaraları, Osmanlı tabya adlarıyla ayrıca eşleştirilmelidir/);
 assert.doesNotMatch(body,/yaklaşık 9.000 m’ye sokulur/);
 assert.doesNotMatch(read('js/data.js'),/A Hattı’nın boşluklarından geçerek ~9.000 m’ye sokuldular/);
});

test('Hunter Weston ayrilis gunu resmi gorev bitis gunune cevrilmez', () => {
 const html=read('komutanlar/aylmer-hunter-weston/index.html');
 assert.match(html,/17 Temmuz’da/);
 assert.match(html,/Ayrılış günü ile resmî görevin sona erdiği gün aynı kabul edilmez/);
 assert.match(html,/günlük sayfalarının görüntüleri incelenmedi/);
 const record=JSON.parse(read('research/reports/2026-10-25/R03-hunter-command-period.json'));
 assert.equal(record.sources[1].document_date,'1915-12-11');
 assert.equal(record.sources[1].event_date,'1915-07-17');
});

test('Stopford gecici Helles ve IX Kolordu gorevleri ayri donemlerde sunulur', () => {
 const html=read('komutanlar/frederick-stopford/index.html');
 assert.match(html,/24 Temmuz’da/);
 assert.match(html,/15 Ağustos akşamı/);
 assert.match(html,/Bu geçici görev, Ağustostaki IX. Kolordu komutasıyla aynı görev değildir/);
 assert.match(html,/imzalı asıl, atama emirleri ve günlük hareket kayıtları görülmedi/);
});

test('Dardanos sarf sayisi gelen isabet olarak sunulmaz', () => {
 const html=read('olaylar/18-mart-deniz-muharebesi/index.html');
 assert.match(html,/id="dardanos-sarf-isabet"/);
 assert.match(html,/115 mermi sarf/);
 assert.match(html,/bataryaya düşen mermi veya isabet sayısı değildir/);
 assert.match(html,/özgün ceride görüntüleri/);
 const place=ctx.window.OM.places.find(p=>p.id==='dardanos');
 assert.doesNotMatch(place.note.join(' '),/17.15’te 30,5 cm/);
});

test('B hatti cekilme emri tum filo cikisi veya sinyal numarasi sayilmaz', () => {
 const ev=ctx.window.OM.events.find(e=>e.title==='B hattına çekilme emri');
 assert.ok(ev);assert.equal(ev.sourceTime.time,'16:50');assert.equal(ev.m,1020);
 const app=read('js/app.js');const scope={};vm.createContext(scope);
 vm.runInContext(app.slice(app.indexOf('  function navalReviewHref('),app.indexOf('  function navalTimeLabel(')),scope);
 assert.equal(scope.navalReviewHref(ev.place,ev.title),'/olaylar/18-mart-deniz-muharebesi/#b-hatti-cekilme-emri');
 assert.match(ev.sourceTime.kind,/B hattına/);assert.match(ev.text,/bütün filonun/);
 assert.equal(ctx.window.OM.events.some(e=>e.title==='Signal No. 12 — genel çekilme'),false);
 assert.match(read('olaylar/18-mart-deniz-muharebesi/index.html'),/id="b-hatti-cekilme-emri"/);
});

test('ilk karsilik sonraki anlatidan kesin emir veya toplu saat uretmez', () => {
 for(const title of ['Seyyar bataryalara serbest atış','İlk Türk karşılığı']) {
  const ev=ctx.window.OM.events.find(e=>e.title===title);assert.ok(ev);assert.equal(ev.sourceTime,undefined);
 }
 const order=ctx.window.OM.events.find(e=>e.title==='Seyyar bataryalara serbest atış');
 assert.match(order.text,/özgün metni, muhatabı ve iletim saati/);
 assert.doesNotMatch(order.text,/Cevat Bey seyyar obüsler ve Dardanos’a izin verir/);
 const html=read('olaylar/18-mart-deniz-muharebesi/index.html');assert.match(html,/id="ilk-karsilik-kapsami"/);assert.match(html,/s.444/);
});

test('Cevat karargaha donus aktarimi atli tabya teftisine ve kesin saate cevrilmez', () => {
 const ev=ctx.window.OM.events.find(e=>e.title==='Cevat Bey’in hareketlerine ilişkin kayıtlar');
 assert.equal(ev.sourceTime,undefined);assert.equal(ev.m,885);
 assert.doesNotMatch(ev.text,/at sırtında Mecidiye ve Namazgâh’a gider/);
 const page=read('olaylar/18-mart-deniz-muharebesi/index.html');
 assert.match(page,/id="cevat-hareket-kapsami"/);assert.match(page,/Bouvet saatinden hesaplanmadı/);
});

test('Nusret 36 metin aktarimi goruntuyle dogrulanmis toplam yapilmaz', () => {
 const html=read('donanma/index.html').split('id="nusret"')[1].split('</article>')[0];
 assert.match(html,/Mayın sayısında yeni karşılaştırma ihtiyacı/);
 assert.match(html,/5f36799bf308a.pdf#page=139/);
 assert.match(html,/iki bağımsız birincil kanıt sayılmaz/);
 assert.match(html,/Tarama görüntüsü görülmediğinden/);
 assert.match(html,/yeni kesin sayı olarak kullanılmaz/);
 const e=JSON.parse(read('research/reports/2026-10-26/R03-atbd132-nusret-discrepancy.json'));assert.equal(e.claim_verified,false);
});

test('platform sayisi faal top sayisina ve kalibresiz nesne kesin kalibreye cevrilmez', () => {
 const places=ctx.window.OM.places;
 assert.match(places.find(p=>p.id==='rumeli-hamidiye').meta,/kurum anlatımında iki top platformu/);
 assert.doesNotMatch(places.find(p=>p.id==='cimenlik').note.join(' '),/Bir adet 355 mm’lik patlamamış/);
 assert.match(read('olaylar/18-mart-deniz-muharebesi/index.html'),/id="tabya-teknik-kapsami"/);
});

test('Namazgah yapi silah ve aktif silah sayilari ayri kalir', () => {
 const p=ctx.window.OM.places.find(p=>p.id==='namazgah');
 assert.doesNotMatch(p.short,/40–50 isabet aldı/);
 assert.match(p.note[0],/Bonet, top ve ateşe katılan top/);
 assert.match(read('olaylar/18-mart-deniz-muharebesi/index.html'),/id="namazgah-sayi-kapsami"/);
});

test('Kumkale bolge sorumlulugu fiili muharebe birligi yerine kullanilmaz', () => {
 const page=read('olaylar/kumkale-oyalama-cikarmasi/index.html');
 assert.doesNotMatch(page,/11. Tümen kesiminde çatışma olur|Kumkale yine 11. Tümen sahasındadır/);
 assert.match(page,/id="kumkale-birlik-kapsami"/);assert.match(page,/31’inci ve 39’uncu/);
 assert.doesNotMatch(read('js/campaign.js'),/Anadolu yakasındaki 11. Tümen sahasındadır/);
});

test('Kaynaklandirilmamis eski nicelikler ve sahis listeleri tekrar yayina tasinmaz', () => {
 const d=ctx.window.OM;
 assert.equal(d.ammo.length,0);assert.equal(d.fortHits.length,0);
 assert.equal(Object.keys(d.spend).length,0);
 assert.equal(d.dardanosPeople.cmd.length,0);assert.equal(d.dardanosPeople.fallen.length,0);
});

test('Eski destek ve komutan taslaklari kaynakli kampanya kayitlari yerine kullanilmaz', () => {
 assert.equal(ctx.window.OM.support.length,0);
 assert.equal(ctx.window.OM.commanders.length,0);
});

test('Eski kaynaksiz gemi cetveli donanma kartlarina geri donmez', () => {
 assert.equal(ctx.window.OM.ships.length,0);
 assert.match(read('donanma/index.html'),/id="bouvet"/);
 assert.match(read('donanma/index.html'),/Taslak teknik değer; belge eşleştirmesi açık/);
});

test('Kaynaklandirilmamis kolordu mevcudu ve yaklasma saati kartta kesin verilmez', () => {
 const places=ctx.window.OM.places;
 assert.doesNotMatch(places.find(p=>p.id==='kolordu-3').short,/50.000|55.000/);
 assert.match(places.find(p=>p.id==='kolordu-3').short,/kuruluş kadrosu/);
 assert.doesNotMatch(places.find(p=>p.id==='seddulbahir').short,/08.45/);
});

test('Nusret kronolojisi cozulmemis mayin sayisini kesinlestirmez', () => {
 assert.doesNotMatch(read('js/campaign.js'),/paralel 26 mayın döker/);
 assert.match(read('olaylar/nusret-erenkoy-hattini-doker/index.html'),/id="nusret-sayi-karsilastirmasi"/);
 assert.match(read('olaylar/nusret-erenkoy-hattini-doker/index.html'),/36 burada yeni kesin toplam değildir/);
});

test('Ocean rapor saati gunluklerdeki tahliye farkini gizlemez', () => {
 const ev=ctx.window.OM.events.find(e=>e.title==='Ocean mayına çarpar');
 assert.equal(ev.sourceTime.time,'18:05');
 assert.match(ev.text,/Jed’in 17.55 ve Colne’un 18.00/);
 const app=read('js/app.js');const sandbox={};
 vm.runInNewContext(app.slice(app.indexOf('  function navalReviewHref('),app.indexOf('  function navalTimeLabel(')),sandbox);
 assert.match(sandbox.navalReviewHref('ocean',ev.title),/#colne-ocean-saat-farki$/);
});

test('Lord Nelson ve Agamemnon donaniminda donem yayini 1915 cetveli sayilmaz', () => {
 const html=read('donanma/index.html');
 for(const id of ['lord-nelson','agamemnon']) {
  const body=html.split('id="'+id+'"')[1].split('</article>')[0];
  assert.match(body,/1906 yayını: 4×12 inç \+ 10×9,2 inç/);
  assert.match(body,/su hattı kemeri gemi ortasında 12 inç/);
  assert.match(body,/1915 için: Taslak/);
  assert.match(body,/#lord-nelson-1906-teknik/);
  assert.doesNotMatch(body,/<dt>Zırh<\/dt><dd>305 mm/);
 }
 const source=JSON.parse(read('research/reports/2026-10-26/R03-lord-nelson-1906.json'));
 assert.equal(source.publication_date,'1906-10');assert.equal(source.event_date,null);
});

test('Irresistible zirh parcalari ve donem top sayisi 1915e genellenmez', () => {
 const body=read('donanma/index.html').split('id="irresistible"')[1].split('</article>')[0];
 assert.match(body,/1902 yayını: 4×12 inç Vickers Mark IX/);
 assert.match(body,/zırhlı başlığı 8 inç/);
 assert.match(body,/çevreleyen koruma 12 inç/);
 assert.match(body,/eşdeğer koruma anlatısı fiziksel levha kalınlığına çevrilmedi/);
 assert.match(body,/1915 için: Taslak/);
 assert.doesNotMatch(body,/<dt>Zırh<\/dt><dd>229 mm/);
});
