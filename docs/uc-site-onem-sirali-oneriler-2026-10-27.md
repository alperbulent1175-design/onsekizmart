# Üç site için önem sıralı araştırma ve uygulama önerileri

27 Ekim 2026 · Araştırma özeti. Tek yürütme durumu GOREV-DURUMU.json içinde kalır. Bu belge yeni bir görev durumu değildir.

## Karar

Önce doğrulanmış işlev/doğruluk ve görevi engelleyen erişilebilirlik; sonra değerli URLlerde gerçek indeksleme engeli; ardından ölçülmüş performans, arama niyeti ve dönüşüm. Yeni içerik veya genel kozmetik düzenleme bunların önüne geçmez. Yakın dönem büyüme odağı WhatSizeToBuy; EuroRailTimes için arama akışı ve değerli rota içeriği; PiggyMath için güvenilir odaklı araç kümesi.

## Araştırmanın kapsamı ve kanıt yaşı

- Bağlı GSC yeniden çekimi: 26 Eylül–23 Ekim 2026, aynı28gün. Mülk/gün toplamları: WhatSizeToBuy193tıklama/15.860gösterim (%1,22); EuroRailTimes1/193 (%0,52); PiggyMath0/94. Sayfa satırları mülk toplamı yerine toplanmadı. Bu aralık24–27Ekim yayınlarının etkisini göstermez.
- İndeks raporu:26Ekim okunmuş, verinin rapor tarihi23Ekim. Euro191indeksli/2735hariç; Size709/933; Piggy106/67. Hariç sayının tümü hata değildir.
- Bing sorgu veri bağlantısı bu araştırmada bir denemede zaman aşımına uğradı.26Ekim tarayıcıdan kaydedilmiş tavsiyeler kullanıldı; güncel28gün Bing performansı çekilmiş gibi sunulmadı.
- Yeni HTTP örneklemi: üç ana sayfa ve robots.txt200; ana sayfalar selfcanonical; robots sitenin tümünü engellemiyor. Bu, bütün URLler/altyapı/güvenlik/hız için geçer not değildir. Piggy title metninde UTF8ile çözümlerken bozuk karakter görüldü; sunucucharseti/tarayıcı doğrulanmadan hata sayılmadı.
- Görsel bulgular25–27Ekim tarihli gerçek360/390/1440 örneklerden alınmıştır; ölçülmeyen sayfa/erişilebilirlik kapsamı açık. Bu araştırmada tüm site yeniden görsel taranmadı.

## Önem sırasına göre işler

### 1. Konut hesaplayıcısındaki giriş kuralları ve hata açıklaması

**P1 · PiggyMath · İşlev / erişilebilirlik · Doğrulanmış hata**

**Kanıt ve etki:** Varsayılan 4.800 vergi/sigorta girdisi step=250 nedeniyle native olarak geçersiz; negatif örnek girdide ilişkili açıklama yok.

**Yapılacak:** Tam tutar girişini koru; geçerli varsayılanlar, açık sınırlar ve alanla bağlı hata/normalleştirme açıklaması oluştur. Kaydırıcı farkını aynı incelemede ele al.

**Bitiş ölçütü:** Varsayılan + tam tutar + negatif/sınır örnekleri; sonuç değişmezliği ve 360/390/1440 klavye/ekran kanıtı.

**Mevcut kuyruk:** U01 / PM-UI-01.

### 2. Arama–seçim–yolcu öncesi hata evrelerini ayır

**P1 · EuroRailTimes · Akış / altyapı · Kontrol adayı**

**Kanıt ve etki:** Tarihsel hata olaylarının nedeni ve tekil kullanıcı karşılığı kesin değil; önceki motor/Continue düzeltmeleri tamam.

**Yapılacak:** Hata kodu, evre, sağlayıcı süresi ve tekrar tetiklemeyi güvenli fixture ve mevcut kayıtlarla doğrula. Gerçek rezervasyon oluşturma.

**Bitiş ölçütü:** Bir olay bir hata/evre anlamına geliyor; güvenli boş/başarısız/tekrar deneme durumları anlaşılır.

**Mevcut kuyruk:** M02 / ER-UI-02.

### 3. Talep alan karşılaştırmalarda chart–fit ve cinsiyet ayrımı

**P1 · WhatSizeToBuy · İçerik / ürün doğruluğu · Kontrol adayı**

**Kanıt ve etki:** Aynı dönemde Clarks→Skechers 7, ASICS→Skechers 6, Clarks→Nike 6 Google tıklaması; kalan karşılaştırma ve marka motoru kapsamı açık.

**Yapılacak:** İlk tıklama alan 10 sayfayı mevcut tamamlanan envanterle karşılaştır; kadın/erkek/unisex, US/UK/EU ve cm kaynağını doğrula. Kaynaksız kesin ofseti düzelt.

**Bitiş ölçütü:** Her öneri doğru chart/varyant kaynağına bağlı; etiket eşdeğerliği kalıp garantisi gibi sunulmuyor.

**Mevcut kuyruk:** S02/S03 / WS-C-01/02.

### 4. İndeks dışında kalan önemli URL örneklerini kök nedene göre ayır

**P1 · EuroRailTimes · GSC / teknik SEO · Kontrol adayı**

**Kanıt ve etki:** 23 Ekim GSC:191 indeksli;1758 crawled-not-indexed,284 discovered,449 tarihsel404. Bunların tümü güncel hata değil.

**Yapılacak:** Talep/özgün fayda taşıyan küçük rota ve rehber grubunda HTTP, Google canonical, robots, sitemap, iç link ve içerik değerini karşılaştır.404 için canlı kırık iç link kanıtı ara.

**Bitiş ölçütü:** Önemli URLlerde gerçek engel giderilmiş; kasıtlı kaldırılmış sayfa/noindex korunmuş; kabul edilmiş istek tekrarlanmamış.

**Mevcut kuyruk:** G01/G02 / SEO-01.

### 5. Keşfedilmiş sayfaların iç bağlantı ve canonical tutarlılığı

**P1 · WhatSizeToBuy · GSC / teknik SEO · Kontrol adayı**

**Kanıt ve etki:** 23 Ekim:709 indeksli;410 discovered-not-indexed,73 crawled-not-indexed;301 noindexin bir kısmı bilinçli.

**Yapılacak:** Önce talep alan model/karşılaştırma şablonlarında canonical–sitemap–hub bağlarını denetle; 410 sayfayı topluca açma.

**Bitiş ölçütü:** Seçili değerli URLler tutarlı200/selfcanonical ve anlamlı hub bağlantısı taşır; noindex kararları açıklanabilir.

**Mevcut kuyruk:** G02 / SEO-01.

### 6. Temsilî tasarım ve temel görev matrisini tamamla

**P1 · Üç site · Görsel / erişilebilirlik · Kontrol adayı**

**Kanıt ve etki:** 360/390/1440 bazı örneklerde ölçüldü; bütün ana sayfa/araç/içerik hücreleri tamam değil.

**Yapılacak:** Her sitede ana sayfa+araç/sonuç+içerik; mobil menü/tablo/alan/sonuç/ana eylem, klavye odağı, etiket ve kontrastı tamamla. Mevcut iyi marka tasarımını koru.

**Bitiş ölçütü:** Her hücre tarihli ölçüm ve incelenmiş ekranla kapanır; normal metin4.5:1,büyük3:1,gereken kontrol sınırı3:1; genel WCAG iddiası yok.

**Mevcut kuyruk:** U01 / UI-01/02/03.

### 7. Kalan rota ve rehberlerde doğruluk; Bing talebine göre dar seçim

**P1 · EuroRailTimes · İçerik / rota faydası · Kontrol adayı**

**Kanıt ve etki:** Paris Nightjet/çeviri/Vienna düzeltmeleri büyük ölçüde tamam; kalan genel rota/fiyat/pass adayları açık.

**Yapılacak:** Tamamlanan paketleri dışla; sonraki az sayıda rotada istasyon, aktarma, hizmet tarihi, alternatif ve bilet koşullarını birincil kaynakla doğrula.

**Bitiş ölçütü:** Görünür metin/meta/JSON-LD/runtime tutarlı; tarihli kapsam ve gerçek arama yolu var; fiyat/servis garantisi yok.

**Mevcut kuyruk:** E01/E02 / ER-C-01/02.

### 8. Vergi yılı ve araç sınır durumlarını araç bazında doğrula

**P1 · PiggyMath · İçerik / hesap · Kontrol adayı**

**Kanıt ve etki:** SE/quarterly düzeltmeleri tamam; kalan gig/hane araçları ve2027 veri durumu açık.

**Yapılacak:** 1099,1099vsW2,quarterly/side-income kümesinde resmi kural, yıl, toplam/ek vergi, rezerv/IRS ödemesi ayrımını test et.

**Bitiş ölçütü:** Anlamlı sınır/regresyon örnekleri kaynaklı; açıklama doğru; tahmini2027 verisi kesinleşmiş gibi sunulmuyor.

**Mevcut kuyruk:** P01 / PM-C-01/02.

### 9. Sürümleme ve önbellek nedeniyle düzeltmelerin eski kalmasını önle

**P2 · Üç site · Altyapı / yayın · Doğrulanmış dağıtım sorunu**

**Kanıt ve etki:** Piggy menü dosyası HTTPde yeni iken kalıcı tarayıcı oturumunda eski kaldı; asset max-age604800. Diğer cache beklemeleri kayıtlı.

**Yapılacak:** Sonraki anlamlı ortak betik yayınında içerik hashli/sürüm değişen asset stratejisini değerlendir; HTML referans kapsamını ve geri dönüşü planla. Zamanı dolmamış kontrolleri tekrarlama.

**Bitiş ölçütü:** Yeni HTML yeni asset sürümünü ister; eski oturum/yeni oturum ve rollback testi belgeli. Menüyü yeniden yayımlamak çözüm sayılmaz.

**Mevcut kuyruk:** U01/U02 / yayımlama altyapısı.

### 10. LCP, INP ve CLS başlangıç ölçümünü yap

**P2 · Üç site · Performans / görsel kayma · Ölçüm adayı**

**Kanıt ve etki:** Güncel temsilî tam performans ölçüm grubu yok; HTTP200 veya küçükHTML hız kanıtı değil.

**Yapılacak:** Her sitede3temsilci URL; mobil laboratuvar ölçümü ve varsa CrUX/GSC alan verisi ayrı. Hero görseli, font, reklam alanı, uzunJS ve etkileşimleri ölç.

**Bitiş ölçütü:** Alan hedefi LCP≤2.5s,INP≤200ms,CLS≤0.1; verisiz yerde alan başarısı ilan edilmez; değişiklik önce/sonra ölçülür.

**Mevcut kuyruk:** U02 / PERF-01.

### 11. İlk10organik sayfada beden özetinden doğru satıcıya geçiş

**P2 · WhatSizeToBuy · Satın alma yolu / görsel · Kontrol adayı**

**Kanıt ve etki:** D’Lites/990v6/JungleMoc dar kapsamı tamam; ilk10tam değil. Amazon son kayıt8tıklama0sipariş; satış kaybı nedeni kanıtlanmış değil.

**Yapılacak:** Kalan sayfalarda gerçek model/cinsiyet/varyant ve ürün mü arama mı hedefi açık olsun; mobilde sonuçtan sonra ilgili tek ana eylem. Bölgesel hesap yoksa yeni tag/otomatik yönlendirme yok.

**Bitiş ölçütü:** Hedef/kapsam açıklaması doğru, tagler korunmuş, CTA görünür; affiliate_click satış sayılmıyor.

**Mevcut kuyruk:** M03 / WS-M-01.

### 12. Bingdeki26uzun başlık ve46kısa metayı yarara göre değerlendir

**P2 · EuroRailTimes · Bing / başlık-meta · Kontrol adayı**

**Kanıt ve etki:** 26Ekim Bing kayıtları; sayı otomatik hata düzeltme emri değil.

**Yapılacak:** Önce trafik/niyet taşıyan URLlerde benzersiz başlık, açık rota/operatör kapsamı ve doğru snippet yaz; URL örneklerini canlıyla karşılaştır.

**Bitiş ölçütü:** Görünür içerikle uyumlu title/H1/meta; sırf karakter sayısı için anlam/varyant kaybı yok.

**Mevcut kuyruk:** C01/G02 / SEO-02.

### 13. Az sayıdaki değerli URLyi keşfedilebilir kıl; IndexNow durumunu doğrula

**P2 · PiggyMath · GSC / Bing / içerik kümesi · Kontrol adayı**

**Kanıt ve etki:** 23Ekim106indeksli,5discovered,1crawled,59noindex; Bing IndexNow öneriyor. Dönem0/94Google.

**Yapılacak:** Önce bu6URLnin amacını denetle.1099başlangıç→karşılaştırma→quarterly akışını hub/linklerle birleştir. IndexNow mevcut mu ve başarılı mı kontrol et; kabul edilen gönderimi tekrarlama.

**Bitiş ölçütü:** Bilinçli59noindex korunur; seçili araçlar hubdan erişilir; IndexNow kanıtı var. Yeni sayfa çoğaltma yok.

**Mevcut kuyruk:** G01/G02/C01/M04.

### 14. İki başlık/meta uyarısını ve görselin anlamını doğrula

**P2 · WhatSizeToBuy · Bing / snippet · Kontrol adayı**

**Kanıt ve etki:** Bing2uzunbaşlık/2kısameta/1altuyarısı; Moab3görseli dekoratif kategorihero.

**Yapılacak:** Talep/konum anlamlıysa başlık/meta örneği iyileştir; dekoratif görsele sahte ürün altı yazma.

**Bitiş ölçütü:** İçerik ve işlevine uygun alternatif metin; ölçülmeyen CTR kazancı iddiası yok.

**Mevcut kuyruk:** C01/G02 / SEO-02.

### 15. Görev başarısını ve gerçek geliri ayrı ölç

**P2 · Üç site · Ölçüm / altyapı · Kontrol adayı**

**Kanıt ve etki:** Google/Bing tıklama,GA4oturum,affiliateevent,booking/komisyon farklı ölçüler.

**Yapılacak:** Euroarama→sonuç→seçim/hata; Piggyhesapbaşlangıç→sonuç→ilgiliaraç; Sizebedensonuç→satıcıtıklama. Hassas gelir/vergi/yolcu girdisi taşımadan tetik tekilliğini doğrula.

**Bitiş ölçütü:** Olay tanımı ve kontrol kanıtı var; partneronayı/netkomisyon ayrı; farklı dönemler karıştırılmıyor.

**Mevcut kuyruk:** M01/M02/M03/M04 / MEASURE-01.

### 16. GEL-NYC veP-6000pilotunu mevcut içerikten sonra değerlendir

**P2 · WhatSizeToBuy · Yeni içerik · Talep/fayda adayı**

**Kanıt ve etki:** 530veKayano14tamam; GEL-NYC kaynak hazırlığı var,P6000eksik.

**Yapılacak:** Tam model/sürüm ve resmi bölgeselchart kaynaklı, mevcut sayfalardan farklı karar faydası varsa ekle. Talep sinyalini varsayma.

**Bitiş ölçütü:** Özgün kapsam, doğru varyant, hub/sitemap, mobil/HTTPkanıtı; otomatik çoğaltma yok.

**Mevcut kuyruk:** C02 / WS-C-03.

### 17. Kaynaklanabilir araç ve rehberlerle doğal referans kazan

**P3 · Üç site · Tanıtım / büyüme · Tasarım ve büyüme tercihi**

**Kanıt ve etki:** Bing inboundlink önerisi bağlantı satın alma gereği değil.

**Yapılacak:** Önce alıntılanabilir hesap yöntemi, kaynaklı rehber ve kullanışlı örnekler; sonra uygun kanallar için içerik planı. Reklam/AdSense pilotunu ana görev ölçümlerinden sonra ele al.

**Bitiş ölçütü:** Bağlantı satın alma/sahte uzmanlık yok; trafik veya gelir garantisi yok. Dış mesaj/sözleşme ayrıca yetki ister.

**Mevcut kuyruk:** C01/M01/M04.

## Uygulama sırası ve sınırlar

İlk grup:1–6; içerik ve tasarım beraber ilerler. Sonraki grup:7–11; performans ölçümü bütün içerik işlerinin bitmesini beklemez.12–16 ilk grupları engellemeden küçük, ölçülebilir paketlerdir.17 sağlam temel ve yeterli ölçümden sonra.

Yayımlanan Piggy menüsünün canlı tarayıcı kabulü ve ES rota önbellek kontrolü kayıtlı sürelerini korur. Beklerken bağımsız iş yapılır; tamamlanmış dosya tekrar yayımlanmaz. Statik dosya sürümleme kalıcı iyileştirme olarak ayrıca değerlendirilir.

Tamamlanmış harita/ortak motor/Continue, SE/quarterly düzeltmeleri, Nikechart kapsamı,530/Kayano14ve dar D’Lites/JungleMoc/990v6 işleri yeniden yapılacak listesi değildir.44kalan karşılaştırma envanteri güncel JSON ile uzlaştırılarak seçilir; tarihsel notların eski sayımları esas alınmaz.

Kasıtlı noindex kaldırılmaz; eski404ler ilgisiz anasayfaya yönlendirilmez. Kabul edilmiş GSC/IndexNow/sitemap gönderimleri tekrarlanmaz. Gerçek booking/order/payment, yeni ticari koşul, yoğun reklam veya dış mesaj bu araştırmanın parçası değildir.

## Kaynaklar

Yerel kanıtlar: gsc-summary.json; public-http-sample.json; ../search-bing-audit-2026-10-26/findings.json; ../site-improvement-program-2026-10-24/GOREV-DURUMU.json; ../indexing-followup-2026-10-24/indexing-requests.json; ../design-baseline-2026-10-25/affordability-label-errors-2026-10-27.json; ../piggy-menu-keyboard-release-2026-10-27/YAYIN-NOTLARI.md.

- [Google teknik indeksleme koşulları](https://developers.google.com/search/docs/essentials/technical): erişilebilir200/indexlenebilir içerik gereklidir; indeks garantisi değildir.
- [Google URL Inspection açıklaması](https://support.google.com/webmasters/answer/9012289?hl=en): kayıtlı indeks görünümü ve canlı test farklıdır; canonical seçimi/indeks sonucunu canlı test garanti etmez.
- [Google tarama sorunları](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors): değerli içerik, taranabilir bağlantı ve doğru sitemap; aynı sitemapın sık tekrar gönderilmesi çözüm değil.
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a): açık yapı, doğru başlık/meta ve görünür içerikle tutarlı yapılandırılmış veri.
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals): LCP2.5sn,INP200ms,CLS0.1 hedefleri. Laboratuvar ve alan verisi ayrılır.

