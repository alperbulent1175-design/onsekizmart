# ONSEKİZMART — Güncel yapılacaklar

17 Ekim 2026. Esas alınan sürüm: 26cd6af; GitHub ve canlı yayın tamamlandı. Dayanak: mevcut dosyalar, önceki eksik listesi, içerik inceleme kayıtları ve son yayın raporu. Bu tur yeni tarihsel araştırma, ağ taraması, hız ölçümü veya cihaz testi yapılmadı. Liste eksiklerin güncel ayrımıdır; önerilen yeni özellikler mevcut hata olarak sunulmaz.

## Tamamlanan ve yeniden yapılmayacak işler

- HTML/CSS/JS ve Leaflet yapısı korunuyor.
- Cephe kronolojisi adı, haritaya kaydıran Oynat, harita üstü olay/zaman/duraklatma şeridi ve 2,4/5/8 saniye bekleme seçenekleri mevcut.
- Türkçe arama, kayıt türleri, ek sonuçları sekizerli açma, boş sonuç ve klavye gezinmesi mevcut.
- Kart açılış/kapanış odağı, aynı saatteki kayıtların ayrılması, filtrede seçimin korunması, arka planda oynatmanın durması mevcut.
- Kapalı katman açıklaması ve ilgili katmanı açma düğmesi mevcut.
- Kayıt paylaşım bağlantıları, geçersiz kayıt açıklaması ve olay dizini arama/filtre bağlantıları mevcut.
- 28 olay sayfasında statik önceki/sonraki kayıt ve liste bağlantısı mevcut.
- 55 tarihsel içerik sayfası inceleme kapsamında; kaynak notları yayımlandı. Bu, bütün iddiaların doğrulandığı anlamına gelmiyor.
- Son yayın öncesi 73 JavaScript ve 267 Python testi geçti. 76/76 canlı dosya özetle doğrulandı; eski sürüm yedeklendi. Bunlar önceki tur sonuçlarıdır, bu tur yeniden ölçülmedi.

## P0 — Tarihsel güvenilirlik

- [ ] T01 — 18 Mart saatli anlatısını iddia düzeyinde denetle.
  Kesin saat, emir, kişi hareketi, isabet ve zayiat ifadelerini ayrı listele. Her biri için doğrudan kaynak URL'si, kısa kanıt metni, inceleme tarihi ve doğrulama durumu bulundur. Dayanak bulunamayan ayrıntı doğrulanmış gibi sunulmasın; yeni sayı veya saat üretilmesin.
  Bitiş: saatli kayıtlardaki önemli iddiaların her biri kanıt veya açık belirsizlik durumuyla izlenebilir.

- [ ] T02 — Komutan ve birlik bilgilerinin açık kalanlarını tamamla.
  Görev başlangıç/bitişi, biyografik tarihler, komuta zinciri ve birlik dağılımını belgelendir. Gerçek mevcut, muharip mevcut ve kuruluş kadrosunu ayır. Carden 16 Mart/de Robeck 17 Mart ayrımını koru. Rafet Bey için kaldırılan kanıtsız soyadı eşleştirmesi geri gelmesin.
  Bitiş: sayfa bazındaki açık kalanlar kayıt kayıt kapanır; kurum ana sayfası belge yerine sayılmaz.

- [ ] T03 — Coğrafi işaret ve hatların dayanağını denetle.
  Günümüz tabanı, mevki merkezi, yaklaşık nokta ve şematik hat ayrımlarını açık tut. Kesin konum isteyen iddialar için harita/belge dayanağı ara; dayanak olmadan koordinat değiştirme veya ekleme.
  Bitiş: işaret türünün anlamı ve doğrulama sınırı kullanıcıya açık, konum değişiklikleri belgeli.

- [ ] T04 — Kaynak notlarının tutarlılığını denetle.
  Sayfaya özgü yeni kanıtlarla eski genel kaynak açıklamalarının çelişip çelişmediğini kontrol et. Kurum anlatısı, koleksiyon künyesi, çevrimyazı ve özgün belge ayrımını koru. Önceki Ocean/Nusret incelemelerini yok sayarak aynı araştırmayı baştan açma.
  Bitiş: olay sayfası, inceleme dizini ve doğrulama etiketi aynı kapsamı anlatır. Katalog şeması ve kayıt durumları kanıtsız değişmez.

## P1 — Kullanılabilirlik ve görsel tamamlama

- [ ] T05 — Kullanım rehberini son özelliklere göre tamamla.
  Bekleme süresi seçimi, harita üstündeki Duraklat, kapalı katman uyarısı, aramada ek sonuçlar ve kayıt paylaşımını açıkla. Görünüm ile katman ayrımını düzelt: Cephe kronolojisi bir zaman görünümüdür.
  Bitiş: rehberdeki adlar/düğmeler canlıyla eşleşir; açıklanan her akış denenir.

- [ ] T06 — Hero alanının son tasarım turunu yap.
  Gelibolu coğrafyasını mevcut verilerle öne çıkar; tipografi, boşluk, başlık ve haritaya giriş bütünlüğünü tamamla. İkinci atlas ekleme. Kaynaksız tarihsel görüntü veya uydurma coğrafya kullanma.
  Bitiş: masaüstü, tablet ve mobil örnekler aynı tasarım dilinde; mevcut harita/arama/oynatma korunur.

- [ ] T07 — Gerçek Android ve iPhone testi yap.
  Harita sürükleme/yakınlaştırma, yatay ekran, sanal klavye, adres çubuğu, uzun kart, oynatma şeridi ve bekleme seçimini dene.
  Bitiş: cihaz/tarayıcı, işlem ve sonuç kaydı var. Tarayıcı dar ekran benzetimi fiziksel test yerine yazılmaz.

- [ ] T08 — Ekran okuyucu ve yakınlaştırma testi yap.
  NVDA/VoiceOver/TalkBack ile menü, arama sonuçları, liste→kart→liste, zaman çubuğu, şerit ve katman açıklamasını dene. %200 yakınlaştırma ve 320 piksel genişlik kontrolü ekle.
  Bitiş: odak kaybı, gereksiz tekrar veya okunamayan kontrol kalmaz; test ortamı raporlanır.

- [ ] T09 — Kaynakça menüsünü ortak gezinmeyle uyumlu hale getir.
  Kaynakça hâlâ ayrı menü kodu taşıyor. Katalog içeriğini değiştirmeden ortak menü davranışını değerlendir ve klavye/ekran geçişiyle doğrula.
  Bitiş: kaynakça ve diğer sayfalarda Menü/Escape/odak davranışı tutarlı.

- [ ] T10 — Farklı sayfa türlerinde görsel son kontrol yap.
  Ana sayfa, olay dizini, uzun olay, komutan, donanma, kaynakça ve rehberde uzun başlıklar, dar ekran ve geniş ekranı kontrol et. Oynatma şeridinin harita kontrollerini kapatmadığını da denetle.
  Bitiş: seçilmiş ekran boyutları için tekrarlanabilir karşılaştırma kaydı var.

## P1 — Hız ve dayanıklılık

- [ ] T11 — Son canlı sürümün hızını yeniden ölç.
  Önceki Lighthouse değerleri 16 Ekim sürümüne ait; güncel sonuç gibi kullanılmasın. Aynı koşullarda birden fazla koşuyla ilk görünüm, büyük içerik çizimi, etkileşim engelleme ve yerleşim kaymasını karşılaştır.
  Bitiş: yeni başlangıç ölçümü ve uygulanan değişikliğin aynı ortamda karşılaştırması var; tek puan artışı kanıt sayılmaz.

- [ ] T12 — Harita ve dış kaynak yükünü ölçüme göre azalt.
  Harita karoları, yazı tipleri, Leaflet ve analitik yükünü incele. Çalışan özellikleri sırf puan için kaldırma; yükleme sırasını ve ilk görünüm maliyetini iyileştir.
  Bitiş: ölçülen iyileşme, harita/arama/kronoloji regresyonu olmadan doğrulanır.

- [ ] T13 — Ağ kesintisi ve toparlanma senaryolarını tamamla.
  Kısmi karo kaybı, katman değişirken geç gelen hata, yavaş ağ, yazı tipi/CDN kesintisi ve bağlantının geri gelmesini dene. Tam çevrimdışı atlas ayrı ürün kararıdır.
  Bitiş: metin içerikleri erişilebilir, hata mesajı doğru, yeniden deneme/toparlanma tutarlı.

## P2 — Sonraki ürün geliştirmeleri

- [ ] T14 — Atlas görünümünün paylaşımını genişlet.
  Mevcut kayıt bağlantıları çalışıyor. Ek olarak taraf, görünüm, katman ve harita konumunun URL'de taşınmasını; tarayıcı Geri/İleri eşitlemesini değerlendir.
  Bitiş: eski bağlantılar korunur, paylaşım aynı görünümü açar ve tarayıcı geçmişi beklenen şekilde çalışır.

- [ ] T15 — Kronolojide hızlı bulmayı geliştir.
  Tarih aralığına geçiş veya liste içi aramayı değerlendir. Aynı gündeki kayıt sırası kesin saat iddiasına dönüşmesin; aralık notları olay sayfası gibi sunulmasın.
  Bitiş: uzun listede hedef kayda daha az işlemle ulaşılır, mevcut taraf/deniz/kara seçimi korunur.

- [ ] T16 — Komutan ve donanmayı kapsayan aramayı değerlendir.
  Mevcut atlas araması harita ve olay kayıtlarını tarıyor. Komutan sayfası/gemi ayrıntısı için birleşik arama ayrı geliştirmedir.
  Bitiş: türler ve hedef sayfalar belli, tekrarlı sonuçlar yönetilmiş; mevcut arama bozulmaz.

- [ ] T17 — Paylaşım önizleme görseli hazırla.
  Ana sayfada og:image yok. Kullanım hakkı belli, coğrafi/historik iddia uydurmayan bir paylaşım görseli ve uygun başlık/açıklama hazırla.
  Bitiş: gerçek paylaşım kartları denenir, görsel hakları kayda geçer.

- [ ] T18 — Olay ve komutan görselleri için kaynak/kullanım kaydı oluştur.
  Kullanıcı fotoğraf ve görsel belgeleri sonraki aşama olarak istedi. Her adayda özgün kayıt URL'si, kurum/koleksiyon, kayıt numarası, başlık, fotoğrafçı/üretici (biliniyorsa), çekim/üretim tarihi ve belirsizliği, inceleme tarihi, kullanım hakkı açıklamasının bağlantısı, gerekli atıf, ilgili olay/komutan ve eşleştirme gerekçesi tutulmalı. Hak durumu ile tarihsel ilişki doğrulaması ayrı olmalı. Ana sayfa, arama küçük resmi veya scraper görsel adresi tek başına kanıt değildir. Mevcut kaynak kataloğu şeması değiştirilmeyecek.
  Bitiş: ilk yayımlanacak grubun her görselinde izlenebilir künye, kullanım koşulu ve açık ilişki durumu var. Ham archive/ doğrudan yayımlanmaz.

- [ ] T22 — Olay sayfalarına kaynaklı fotoğraf ve görsel belgeler ekle.
  Olayın kendisini gösteren fotoğraf; aynı mevkinin farklı tarihteki görüntüsü; harita, kroki veya belge taraması ayrı açıklanmalı. Temsilî veya daha sonraki görüntü olay anı gibi sunulmasın. Görsel açıklaması yalnız kaynağın desteklediğini söylesin. Görsel belgenin varlığı, olay sayfasındaki bütün iddiaları doğrulanmış yapmaz.
  Bitiş: hakları uygun ve ilişkisi incelenmiş küçük bir örnek grup olay sayfalarında kaynak bağlantısı, künye, açıklama ve alternatif metinle çalışır; ardından diğer olaylara genişletilir.

- [ ] T23 — Komutan sayfalarına doğrulanmış portre ve ilgili belgeler ekle.
  Benzer isimli kişiler karıştırılmasın; kişi kimliği koleksiyon kaydıyla eşleştirilsin. Portre tarihi, üniforma/rütbe ve görev dönemi biliniyorsa kaynağa göre açıklansın; bilinmiyorsa açık bırakılsın. Sonraki yıllara ait portre 1915'te çekilmiş gibi sunulmasın. Yapay zekâ üretimi veya sonradan renklendirilmiş görüntü özgün tarihsel fotoğraf olarak gösterilmesin.
  Bitiş: her yayımlanan portrede kimlik eşleştirmesi, tarih/belirsizlik, kaynak ve kullanım koşulları kontrol edilmiş; doğrulanamayan kişi görseli eklenmemiş.

- [ ] T24 — Erişilebilir ve hızlı görsel inceleme arayüzü geliştir.
  Küçük görselden büyütmeye geçiş, belge yakınlaştırma, klavyeyle açma/kapatma ve odağın geri dönmesini sağla. Mobilde okunabilir açıklama ve kaynak bağlantısı göster. Alternatif metin yaz; özgün belge taramasını koruyarak gösterim için uygun boyutlu kopyalar hazırla. Boyutları önceden ayır, ekran altındaki görselleri gerektiğinde yükle; sayfa kayması ve gereksiz büyük indirmeleri önle.
  Bitiş: ilk olay/komutan örnekleri mobil, klavye ve ağ koşullarında denenmiş; görsel eklendikten sonra hız ve yerleşim karşılaştırması yapılmış. Mevcut HTML/CSS/JS mimarisi korunur.

## Bakım ve çalışma düzeni

- [ ] T19 — Gerçek tarayıcı regresyon senaryolarını tekrarlanabilir hale getir.
  Arama→ek sonuç→kart→kapatma; oynatma→hız→duraklatma; filtre; katman; geçersiz bağlantı; olay→harita; olaylar arası gezinme akışlarını kapsa.
  Bitiş: kritik akışlar yeni değişikliklerde aynı şekilde yeniden denenebilir.

- [ ] T20 — CSS/JS sadeleştirmesini görsel güvenceyle yap.
  Statik mimariyi koruyarak örtüşen stilleri ve arayüz sorumluluklarını aşamalı düzenle. Önce görsel karşılaştırma ve kritik akış güvencesi sağla.
  Bitiş: davranış/tasarım aynı, tekrar azalmış; kapsamlı yeniden yazım yok.

- [ ] T21 — Scraper tekrar deneme politikasını ayrı kapsamda ele al.
  Son turda 200 denemeden 15 yeni sayfa kaydı çıktı; hepsi yeni makale değildir. Ayrı salt okunur kontrol aracı 404/410 tekrarlarını ve medya/profil adreslerini ayırabiliyor, fakat scraper davranışı değişmedi.
  Bitiş: ayrı scraper geliştirme yetkisiyle tekrar deneme/ek sayfa politikası tanımlanır ve test edilir; ham arşiv korunur. Bu liste scraper çalıştırma veya kodunu değiştirme izni değildir.

## Uygulama sırası

1. T01–T04: tarihsel iddiaların güvenilirlik çalışması. En riskli sayı/saat/emir ifadelerinden başla.
2. T05 ve T09: rehber ve ortak menü uyumu; küçük, sınırları belli kullanım düzeltmeleri.
3. T07–T08 ve T10–T13: gerçek kullanım, hız, ağ ve görsel kontroller.
4. T06: ölçümlerle birlikte son hero tasarımı.
5. T18 → T22–T24: kaynak ve hak kontrolünden sonra olay fotoğrafları, komutan portreleri ve görsel belge sunumu. Önce küçük bir örnek grup, sonra kapsamı genişlet.
6. T14–T17: görünüm paylaşımı, arama ve paylaşım önizlemesi.
7. T19–T20 bütün adımlara eşlik eder; T21 ayrı scraper kapsamıdır.

Cursor'a devredilebilecek somut işler: tekrarlanabilir tarayıcı senaryoları, katalog içeriğine dokunmadan kaynakça menüsü, ekran görüntüsü karşılaştırmasıyla CSS düzenlemesi ve eski bağlantıları koruyan görünüm paylaşımı. Tarihsel hüküm, koordinat üretme veya otomatik yayın görevi verilmez.

Bu tur yalnız yapılacaklar belgesi hazırlandı; site kodu değiştirilmedi, testler yeniden çalıştırılmadı, commit/push/yayın yapılmadı. Son yayın onayı tamamlanan yayın içindir; bu liste kendiliğinden yeni yayın başlatmaz.

Görsel aşaması güncellemesi: kullanıcı isteğiyle 17 Ekim 2026 tarihinde T18 genişletildi ve T22–T24 eklendi. Bu aşamada görsel araştırması/indirmesi veya yayın yapılmadı.

T01 ilerleme — 17 Ekim 2026: 31 saatli kayıt mevcut saat/metinleriyle ayrı inceleme listesine alındı (18-mart-iddia-incelemesi.json). İlk ayrıntılı kontrol Inflexible kaydında başladı: onay bekleyen AWM çevrimyazısındaki bildirim zamanı ile atlas saati arasındaki karşılaştırma ihtiyacı not edildi. Kayıttaki belgesiz 39 ölü ve 14:25 ayrılış ifadeleri kaldırıldı; yeni kesin saat/sayı atanmadı. T01 tamamlanmadı; kalan kayıtların ve bu kaydın özgün belgelerle incelemesi açık.

T01 ikinci adım — Bouvet: AWM koleksiyon açıklamasındaki saat desteği kaydedildi; kesin batış süresi/kayıp/kurtulan sayıları ve teyit anlatısı belgelenmediğinden kısa metinden çıkarıldı. Bouvet ve Inflexible için mevki/donanma tekrarları aynı belirsizlik durumuna getirildi; eski içerik inceleme izinde korundu. 31 kaydın ikisinde kısmi kaynak incelemesi başladı; T01 açık.

T01 üçüncü adım — Ocean: isabet ve batış kartları ayrı incelendi. AWM/DVA metinlerinin mayın isabetini farklı kesinlikte anlatması yeniden kaydedildi. Saatler, tahliye sayısı ve gemi görevleri doğrulanmış gibi sunulmuyor; olay/mevki/donanma tekrarları düzenlendi. Dört saatli kayıtta kısmi inceleme var; T01 tamamlanmadı.
