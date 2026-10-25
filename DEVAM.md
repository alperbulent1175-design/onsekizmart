# Atlas kalıcı çalışma kuyruğu
25 Ekim 2026 — 11.40 UTC otomasyon çalışması

Her çalışmada bu dosya, AGENTS.md ve ayrıntılı rapor birlikte okunmalıdır. Öncelik sırası P0 → P1 → P2 → P3, aynı düzeyde R kimliği; bağımlılıklar korunur.

## Bu partinin sonucu
- R01 tamamlandı. Önceki 10 başarısızlık yeniden üretildi. tests/side-filter.test.js gerçek navalTimeLabel işlevini artık test ortamına yüklüyor; 44 sabiti yerine temizleme sonrasında bütün gerçek kampanya kayıtlarının aynen döndüğü denetleniyor. Uygulama veya tarihsel veri değiştirilmedi.
- Bütün JavaScript testleri: 258/258 başarılı, 0 başarısız. Zorunlu 32 JavaScript testi bu koşuya dahildir. Python: 18/18 başarılı. Çıktı research/reports/2026-10-25/javascript-test-output-after-R01.txt. Çıktıyı terminale yazdıran Python kodunda cp1254 simge yazdırma hatası oldu; test çıktısı dosyaya eksiksiz kaydedildi ve sonucu ayrıca okundu.
- Yerel gerçek tarayıcı: İtilaf seçilince Donanma intikali kartı ve 19 kayıt; Süzgeci temizle sonrası 31 kayıt ve aynı uyumlu seçili kart görüldü. Arayüz değişmedi; mobil odak/katman davranışı mevcut otomatik testlerle de geçti.
- Ardından R02 yerel hazırlığına geçildi: sitemap içindeki 88 sayfanın varlık ve SHA256 envanteri R02-page-inventory.json içine yazıldı. Bu dosya tam yayın paketi değildir. CSS/JS/görsel bağımlılıkları ve geri dönüş dosyaları hâlâ hazırlanmalı. Canlıya hiçbir dosya gönderilmedi.

## İş durumları
- R01 · P0 · tamamlandı — Tüm test takımını yeniden güvenilir hâle getir
- R02 · P0 · tamamlandı (25 Ekim açık kullanıcı talebiyle yayınlandı) — Canlı ve yerel sürüm farkını kapat
- R03 · P0 · devam ediyor — Kanıtsız sayısal iddiaları bütün sitede tara
- R04 · P1 · bekliyor — 24 açık saat kaydını tek tek değerlendir
- R05 · P1 · bekliyor — Rapor saatlerini gemi günlükleriyle karşılaştır
- R06 · P1 · bekliyor — Ateş kes kartını kanıtın kapsamına daralt
- R07 · P1 · bekliyor — Batık, isabet ve tahliye noktalarını ayır
- R08 · P1 · bekliyor — Mayın ve filo çizgilerinin geometrisini doğrula
- R09 · P1 · bekliyor — 18 yeni olay sayfasını derinleştir
- R10 · P1 · bekliyor — Osmanlı ve İtilaf kaynak dengesini kur
- R11 · P1 · bekliyor — 19–24 Mayıs olay zincirini tamamla
- R12 · P1 · bekliyor — İddia ile kanıt bağlantısını tutarlılaştır
- R13 · P1 · bekliyor — Kaynak durumlarını okuyucu diline çevir
- R14 · P2 · bekliyor — 25 komutan sayfasını görev-tarih kapsamıyla gözden geçir
- R15 · P2 · bekliyor — Sağlık ve tahliye sayılarını sonuç kayıtlarıyla tamamla
- R16 · P2 · bekliyor — İki tarafın beslenmesini fiilî dağıtımla karşılaştır
- R17 · P2 · bekliyor — Görsel arşivini olaylarla sistemli eşleştir
- R18 · P2 · bekliyor — Harita-okuma-kronoloji geçişini sadeleştir
- R19 · P2 · bekliyor — Gerçek mobil ve erişilebilirlik denetimi yap
- R20 · P2 · bekliyor — Ana sayfanın öğrenme yolunu güçlendir
- R21 · P2 · bekliyor — Performansı ölç ve bütçe belirle
- R22 · P2 · bekliyor — 88 yerel URL ile canlı indekslenmeyi ayır
- R23 · P2 · bekliyor — Tekrarlanabilir yayın ve geri dönüş süreci kur
- R24 · P3 · bekliyor — Araştırmayı kabul ölçütleriyle yönet

## 12.00 UTC partisi
- R02 yerel hazırlığı tamamlandı: R02-local-release-manifest.json 158 dosya içeriyor (önceki 140 + yeni 18 olay sayfası). sitemap sayfaları ve mevcut HTML/CSS kaynak bağlantıları tarandı. Ham arşiv, araştırma kayıtları ve özel dizinler listeye alınmadı. Kök .htaccess bulunmadığından önceki doğrulanmış yayın stage kopyası kaynak olarak açıkça yazıldı; sessizce atlanmadı.
- Geri dönüş envanteri R02-rollback-inventory.json: önceki dbf9197 snapshotunun 140/140 dosyası manifest hashleriyle eşleşiyor. Yeni 18 adres önceki sürümde yok; geri dönüşte bunların ayrı ele alınması gerekir. Bu yerel snapshot kontrolü, mevcut canlı sunucunun yeniden yedeği alındığı anlamına gelmez. Yayından önce canlı durum ve değişen dosyalar yeniden kontrol edilmelidir. Commit/push/deploy yapılmadı. R02 genel kabul ölçütünün canlı kısmı yeni açık yayın talebine bağlıdır.
- Sonraki yapılabilir iş R03'e geçildi. R03-numeric-claims.json: js/data.js içinde 253 sayı içeren metin parçası çıkarıldı. Bu sayı hatalı iddia sayısı değildir; tarihler, kalibreler, saatler, personel ve başka sayılar tek tek ayrıştırılacak. Koordinatlar ve eski oynatma anahtarları bu tarama dışında.
- Önemli kapsam düzeltmesi: ammo/spend/fortHits/dardanosPeople içindeki eski sayıları doğrudan yayımlanmış tablo saymak doğru değil. 88 sayfalık yerel HTML kümesinde ammo-rows, fort-rows, dardanos-cmd/dardanos-fallen, ship-rows, support-cards, unit-rows hedeflerinin hiçbiri yok. R03-render-targets.json bunu kaydediyor. js/app.js içindeki koşullu üreticiler şu an bu hedeflerde çalışmıyor. Statik donanma sayfası kendi üretilmiş içeriğiyle ayrıca denetlenmeli. Gizli veri kayıtları doğrulanmış sayılmaz ve gelecekte yanlışlıkla açılma riski ayrıca izlenir.
- Mevki kartı openPlace çoğunlukla short gösteriyor; note dizisinin tamamını göstermiyor. Dolayısıyla note içindeki kesin saatleri doğrudan ekranda görünüyor diye raporlamak hatalı olur. Öte yandan olay text ve gemi statik sayfalarındaki sayılar ayrı olarak görünür olabilir. Kaynak statüsü korunarak iz sürülecek.
- Araştırma kapsamı: bu partide yeni tarihsel belge okunmadı ve hiçbir tarihsel iddia doğrulandı yapılmadı. Kaynaklar yerel js/data.js, js/app.js, sitemap.xml, mevcut yayın manifesti ve snapshot dosyalarıdır.

## Sıradaki somut hedef
R03: 253 metin parçasını görünür olay/short/gemi statik içeriği ile kullanılmayan veri olarak ayır; ilk olarak 18 Mart olay text alanındaki sayısal iddiaları research/ux-audit/18-mart-iddia-incelemesi.json ve ilgili belge incelemeleriyle eşleştir. Kanıtı olmayan sayıyı doğrulanmış etikete yükseltme. R02 canlı işlemi beklenirken durma. R01 tamamlandı, yeniden başlatma.

## Sınırlar
Commit/push/deploy/scraper/dışarı mesaj yok. Katalog şeması korunur. Önceki rapordaki 248/258 sonucu tarihli ilk denetimdir; güncel test sonucu burada 258/258 olarak kaydedildi.

## Açık kullanıcı yayın talebi — 25 Ekim 2026
Kullanıcı commit, push ve yayın istedi. 158 dosyalık paket hazırlandı; önceki 139 kamuya açık dosya canlıdan yeniden indirildi ve önceki manifest hashlerinin 139/139 ile eşleştiği görüldü. .htaccess kamuya açık değildir; önceki doğrulanmış yerel snapshot kullanıldı. Son testler 258 JavaScript + 18 Python başarılı. R02 canlı gönderim/doğrulama devam ediyor. Otomasyonun genel yayın yasağı sonraki izinsiz çalışmalar için korunur.

## Yayın tamamlandı — 25 Ekim 2026
- İçerik commit: ed54829; GitHub main gönderisi başarılı. Hostinger hosting_deploy onsekizmart.com için static/deployed döndü.
- 158 dosyalık paketin 157 kamuya açık dosyası canlıdan tekrar indirildi: 157/157 SHA256 eşleşti; .htaccess kamuya açık olmadığından HTTP hash kontrolüne dahil değil. verification.json yerel deployment dizininde.
- Canlı tarayıcıda ana sayfanın 7 rapor saati ve yeni olay sayfası bağlantısı görüldü; Mayın tarama girişimleri sayfası tıklanarak açıldı, özet/kanıt/erişim/durum alanları mevcut. Önceki canlıdan alınan geri dönüş kopyası korunuyor.
- R02 tamamlandı. Otomasyonda sıradaki iş R03 sayısal iddia denetimidir; bu kullanıcı izni sonraki otomatik yayınlara genellenmez.

## R03 yerel geliştirme partisi — 25 Ekim 2026
- R03 sürüyor; tamamı bitmedi. 253 sayı içeren metin parçasına görünürlük kapsamı eklendi. İlk envanter, düzeltme öncesi metinlerin kaydı olarak korunuyor.
- Altı görünür 18 Mart olay metninde belgesiz kesin mesafe/isabet/kalibre/süre anlatısı daraltıldı: Gözetleme tepesine intikal, İlk atış emri, Ağır tabyalara ateş, Göğüs göğüse düello, Dardanos rasat yeri şehit düşer, Ateş kes. Eski metin ve yeni metin R03-naval-visible-review.json içinde; kaynak/kanıt bulunmayan iddia doğrulanmadı. Yeni sayı, koordinat veya kesin saat eklenmedi. Kayıt başlığı, eski t/m ve bağlantı anahtarları korundu.
- Naval-History üzerindeki 18 Mart rapor çevrimyazısının 11.25–16.50 aralığı web üzerinden tekrar incelendi (URL R03-naval-visible-review.json içinde). Yedi mevcut rapor saati korunuyor. Bu aktarım Osmanlı emirlerinin özgün görüntüsü sayılmadı; bütün sayfanın bütün belgeleri okunmuş değildir.
- Mevki kartının ilgili 18 Mart düğmelerinde sabit Saat doğrulanmadı yerine aynı navalTimeLabel işlevi kullanılıyor. Bilinen rapor saati doğru aşamayla gösterilir; belgesiz kayıtta belirsizlik sürer. Test artık her düğmeyi kendi kaydının gerçek kaynak etiketiyle karşılaştırıyor.
- Yerel gerçek tarayıcıda /?mevki=bouvet#harita açıldı: ilgili düğme 13:54 · patlama kaydı (rapor) gösteriyor. Yeni metinler yerel DOM'da görüldü. Bu partide ayrı mobil boyut doğrulaması henüz yapılmadı; mobil tarayıcı kontrolü sonraki somut denetimdir. Test ortamı mobil odak/katman regresyonları başarılı.
- Test: 259/259 JavaScript ve 18/18 zorunlu Python başarılı. Çıktı R03-test-output.txt. Commit/push/yayın yapılmadı; bu değişiklikler yereldedir. R02 önceki sürüm için tamamlanmış kalır; yeni değişikliklerden sonraki yayın manifesti yeniden hesaplanmalıdır.
- Sonraki: mobil Bouvet/mevki-olay geçişini doğrula; ardından görünür places.short ve statik donanma sayısal iddialarını kanıt pasajlarına bağla. Genel Ateş kes kaydı için Vengeance tek gemi pasajını ayrı kanıt bölümünde sunma işi R06 kapsamındadır; genel filo saati olarak kullanma. R03 bitmeden bütün kuyruğu tamamlandı sayma.

## R03 12.21 UTC partisi — Queen Elizabeth teknik bilgi kapsamı
- R03 sürüyor. Donanma statik sayfasındaki Queen Elizabeth kartı incelendi. 330 mm zırh değerinin hangi zırh bölümü/tarih için olduğu bu kartta belgelenmemişti; sayı yerine açık teknik belge denetimi durumu yazıldı. Top sayısı da aynı fotoğraf kaydından türetilmedi.
- Yeni doğrudan okunan kaynak: https://collection.nam.ac.uk/detail.php?acc=1965-10-209-9 — NAM. 1965-10-209-9, Church service on HMS Queen Elizabeth, 1915. Katalog açıklaması baş taraftaki 15 inç topları belirtir. 15×25,4=381 mm yalnız birim dönüşümüdür. Kartta bunun kanıt/sınır/olay-yayın-erişim tarihleriyle açıklaması eklendi. Bu özgün teknik plan veya 18 Mart ateş saati doğrulaması değildir.
- İkinci katalog https://collection.nam.ac.uk/detail.php?acc=1978-11-157-5-40 doğrudan açıldı; başlıktaki HMS Elizabeth adlandırması nedeniyle ayrı kaynak olarak site iddiasına bağlanmadı. İki fotoğraf kaydının görüntüleri ve mükerrerliği bu tur incelenmedi. Her ikisinde kurum Out of Copyright yazıyor; fotoğrafçı ve kesin çekim günü belirtilmiyor. Siteye yeni fotoğraf eklenmedi.
- Kayıt research/reports/2026-10-25/R03-queen-elizabeth-calibre.json. Kaynak kataloğunun 10 sütunu değiştirilmedi. Fotoğraf açıklaması bütün gemi teknik cetvelini doğrulamış sayılmadı.
- Yeni anlamlı regresyon testi kalibre pasajı/top adedi/zırh kapsamını ayırır. 260/260 JavaScript ve 18/18 Python başarılı; R03-test-output-calibre.txt. Commit/push/deploy/scraper yapılmadı.
- Sonraki somut hedef: ayrı mobil tarayıcı doğrulaması hâlâ açık; diğer gemilerin görünür teknik değerlerini aynı gemi/tarih/bölüm ayrımıyla kaynaklandır. R03 henüz tamamlanmış değildir. Tek bir kalibre kaydı 253 metin envanterinin tamamına genellenmez.

## R03 donanma saat tutarlılığı — 25 Ekim 2026
- Yeni somut yayımlanmış çelişki bulundu: Lord Nelson/Agamemnon kartlarında 11.05 kesin atış anlatısı, mevcut 18 Mart raporuyla uyumsuzdu. Lord Nelson 13–14 km, Agamemnon 11.35 hasar, Suffren 12.15/9.000 m/14 isabet ayrıntıları da aynı pasajda dayanak bulmuyor. Üç kart kaynak kapsamına daraltıldı.
- Doğrudan tekrar okunan belge aktarımı: https://www.naval-history.net/WW1Battle1503Dardanelles2.htm — 18 Mart eki 10.30–12.47 girişleri, özellikle 11.25/11.36/12.06/12.32. Queen Elizabeth sonrasındaki Agamemnon→Lord Nelson→Inflexible sırası açık; tek tek gemilere ayrı dakika üretilmedi. Suffren için emir ile ateş alışverişine girme ayrıldı. Olay 18 Mart 1915, rapor 24 Mart 1915, erişim 25 Ekim 2026; saat GMT+2 yerel. Özgün gemi jurnalleri karşılaştırması açık. R03-navy-report-consistency.json eski/yeni metin ve kanıt özetlerini saklar.
- Inflexible teknik değer araması IWM/NAM odaklı denendi; bu tur uygun özgün teknik belge bulunmadı. Aynı adlı 1780/1876 gemileri ve tarihsiz internet özetleri 1907 gemisine kanıt yapılmadı. Sonuçsuz arama tekrarına girmeden somut saat çelişkisine geçildi.
- Mobil denetim için UISight durum sorgusu Chromium kurulu değil yanıtı verdi; yeni büyük tarayıcı kurulumu yapılmadı. Bu, sitenin hatası veya tüm tarayıcı araçlarının yokluğu değildir. Mevcut IAB ile mobil viewport yolunun belgelenmesi/denetimi hâlâ açık; mobil kontrol yapılmış diye raporlanmaz.
- 261/261 JavaScript + 18/18 Python başarılı. R03-navy-test-output.txt. Değişiklikler yerel, commit/push/yayın yok. R03 genel kabul ölçütü tamamlanmadı.
- Sıradaki: mevcut IAB üzerinden mobil görünümü denetle; statik donanma kartlarının kalan sayısal teknik iddiaları için gemi/yıl/zırh bölümü ayrımlı kaynak araştırmasına devam et. Eski kaynaklı saat etiketlerini yeniden Saat doğrulanmadı durumuna düşürme.

## R03 12.41 UTC partisi — mobil kontrol ve kart içi tutarlılık
- Önceki Suffren düzeltmesinin eksik kaldığı bulundu: anlatıdan çıkarılan 14 isabet, Akıbet özet alanında hâlâ duruyordu. Bu alan da belge denetimi durumuna çevrildi; tüm kartta aynı belgesiz sayının tekrarını engelleyen regresyon testi eklendi. Bu düzeltme önceki işi tamamlar; sayı yanlışlığına dair yeni tarihsel kanıt iddiası değildir.
- Açık kalan mobil kontrol mevcut IAB ile yapıldı. Belgeli viewport API: C:/Users/crawi/.codex/plugins/cache/openai-bundled/browser/26.1016.61520/docs/capabilities/browser/viewport.md; capability.set({width,height}) ve reset(). Yeni tarayıcı indirmek gerekmiyor. Sonraki çalışmada bu yolu kullan, UISight Chromium kurulumu engelini tekrar döndürme.
- 375×812 dış viewport istendi; DOM içerik genişliği 360, scrollWidth 360. /?mevki=bouvet#harita kartında ilgili düğme 13:54 patlama kaydı (rapor) gösterdi; düğmeye basınca OLAY kartı ve aynı kaynak saati açıldı, başlık odaklandı. 320×740 dış viewportta donanma/#suffren açıldı; DOM içerik genişliği ve scrollWidth 305/305, yatay taşma yok. Suffren yeni Akıbet metni ile 12.06 emir/12.32 çatışma ayrımı DOM'da doğrulandı. Dar görünüm testleri fiziksel telefon testi olarak sunulmaz. Viewport reset edildi; kullanıcının canlı sekmesi değiştirilmedi.
- 262/262 JavaScript + 18/18 Python başarılı. R03-mobile-consistency-tests.txt. Uygulama mimarisi ve katalog şeması değişmedi; commit/push/yayın yok.
- R03 halen sürüyor. Sıradaki somut kaynak işi: donanma girişindeki yaklaşık 60 deniz unsuru ve 18 ana hat kapsamını rapordaki gemi listesi/tarih ile eşleştir; 18 Mart ana hat ile bütün seferin katılımcı listesini karıştırma. Sonra diğer gemilerin teknik sayılarını gemi/yıl/zırh bölümü temelinde incele.

## R03 13.01 UTC partisi — filo sayısı ve görev kapsamı
- Donanma sayfasındaki yaklaşık 60 deniz unsuru ve bütün 18 kartın ana muharebe hattı olduğu anlatısı dayanak/kapsam tamamlanmadığı için çıkarıldı. Kartlar silinmedi; başlık gemi kayıtları olarak daraltıldı. Yeni toplam kuvvet sayısı üretilmedi.
- Naval-History çevrimyazısında doğrudan okunan pasajlar: 10.30 A Hattı, 12.06 Fransız emri, 14.32 yeni ileri hat/destek ve gece sonu Canopus/Cornwallis giriş devriyesi. Canopus ve Cornwallis kartları bu dar görev kaydıyla güncellendi; Prince George iskele kanadı kaydı ayrı anlatıldı. Bütün günün görevleri veya bütün seferin tam listesi sayılmadı. Kaynak URL/kanıt özeti/olay-belge-erişim tarihleri R03-fleet-scope.json içinde.
- Kaynak zincirinin tarih sınırı ayrıca kontrol edildi: üst yazı 26 Mart 1915, ekteki harekât raporunun son imzası 24 Mart 1915. Dolayısıyla önceki yedi sourceTime documentDate=24 Mart alanı korunuyor; üst yazı tarihine körlemesine çevrilmedi. Tüm son sayfa/17-18 Mart ekleri bu denetimde gerekli pasaj düzeyinde okundu, sayfadaki diğer bütün savaş belgeleri okunmuş değildir.
- 263/263 JavaScript ve 18/18 Python başarılı; R03-fleet-tests.txt. Yerel geliştirme; commit/push/deploy/scraper yok. Arayüzün yeni açıklama alanı için dar ekran kontrolü sonraki partide önce yapılmalı.
- Sonraki hedef: donanmadaki destek kartlarında kalan sayısal mevcutları (muhrip/trol sayıları) tarihli listelerle eşleştir; tarih kapsamı olmayan toplamları ana muharebe gücü sayma. R03 tamamlanmadı; R04 ancak R03 kabul ölçütü uygun kapsamda sonuçlandığında sıradaki ana iş olacak.

## R03 13.21 UTC partisi — muhrip ve tarama görevlerinin kapsamı
- Doğrudan incelenen kaynak Naval-History 17–18 Mart muhrip ve mayın tarama ekleri (rapor sonları 24 Mart 1915; erişim 25 Ekim 2026). URL/kanıt özeti/kapsam R03-support-scope.json içinde. İlgili ekler okundu; tüm filo cetveli veya gemi jurnalleri okunmuş sayılmadı.
- Muhripler kartındaki kaynaksız 16 İngiliz ve Fransız toplamı çıkarıldı. Gece tarama koruması, gündüz tarama, tahliye ve gece araması ayrı anlatılıyor. Raporda adı geçenler eksiksiz gün toplamına dönüştürülmedi.
- Tarama kartı daha önce genel/belirsiz anlatıydı; şimdi raporun gece ve gündüz ayrımı, donanım açabilen iki çiftin toplam mevcut olmadığı ve mayın bulunmadığı bildiriminden geçidin güvenli olduğu sonucunun çıkmayacağı açıklanıyor. Yeni koordinat veya toplam tekne sayısı atanmadı. Çevrimyazı özgün rapor görüntüsü sayılmadı.
- Yerel masaüstü DOM'da yeni metin/kaynak alanları görüldü. 320×740 dış viewportta içerik/scrollWidth 305/305 ve yeni kapsam açıklaması mevcut; yatay taşma yok. Viewport reset edildi. Yeni tarayıcı kurulmadı ve kullanıcının canlı sekmesi değiştirilmedi.
- 264/264 JavaScript + 18/18 Python başarılı, R03-support-tests.txt. Commit/push/deploy/scraper yok. R03 sürüyor.
- Sonraki somut hedef: aynı donanma sayfasında hâlâ 13.45 ileri hat geçişi anlatan Irresistible özet/Albion/Vengeance/Swiftsure/Majestic kartlarını 14.32 fiilî geçiş ve 13.43 emir ayrımıyla düzelt; üst bilgi ve anlatı tekrarlarını birlikte denetle. Ayrıca korumalı kruvazörler grubundaki Henri IV sınıflandırması/18 Mart kapsamı açık araştırma olarak tutulmalı, kanıtsız sınıf doğrulanmamalı.

## R03 13.41 UTC partisi — ileri hat geçişi
- Raporun 13.43 Fransız çekilme emri ile 14.32 yeni ileri hat geçişi pasajları web üzerinden doğrudan tekrar okundu. Vengeance/Irresistible/Albion/Ocean ileri hat, Swiftsure/Majestic destek olarak ayrı yazılmış. URL, olay/rapor/erişim tarihi, kanıt özeti ve önceki/yeni anlatılar R03-advance-line.json içinde. İmzalı asıl günlüklerin incelendiği iddia edilmedi.
- Albion/Vengeance/Swiftsure/Majestic anlatılarındaki 13.45 geçişi kaldırıldı. Irresistible ve Ocean kısa görev alanları da aynı 14.32 rapor kaydına bağlandı; Swiftsure/Majestic özetlerindeki destek ayrımı ve Majestic Mayıs kartındaki tekrar tutarlılaştırıldı. Rapordaki geçiş saati her geminin ayrı ateşe başlama saati yapılmadı. Harita/oynatma anahtarları değişmedi.
- 265/265 JavaScript ve 18/18 Python başarılı; R03-advance-tests.txt. Kaynak kataloğu ve mevcut mimari korunuyor. Commit/push/yayın/scraper yok. Bu partide ayrıca yeni ekran boyutu QA yapılmadı; paragraf değişikliği önceki destek görünümü denetimini otomatik olarak yeni içerik için kanıt saymaz.
- R03 halen devam ediyor. Sonraki: ileri hat kartlarını dar ekranda ayrıca kontrol et; ardından kruvazör destek grubundaki Henri IV ve 18 Mart görev kapsamını özgün Fransız/kurum kaydıyla araştır. Kalan teknik sayıları kaynaklandırmadan R03 tamamlandı yapılmaz.

## R03 16.21 UTC partisi — Henri IV sınıfı
- Son tamamlanmış kayıttan sürdürüldü; aradaki heartbeat saatlerinde yapılmamış iş yapılmış gibi kaydedilmedi. R01/R02 yeniden başlatılmadı.
- İki SHD PDF envanteri web açılışında zaman aşımı verdi; arama parçaları okunmuş PDF sayılmadı. Erişim sınırları R03-henri-iv-classification.json içinde. Aynı erişim sorunu tekrar tekrar denenmedi.
- Doğrudan açılıp okunan alternatif kurumsal kayıt: https://inventaire-patrimoine.normandie.fr/dossier/IM50000725 . Description Henri IV için cuirasse der; Statut bolumu gardes-cotes cuirasses olarak niteler. Kayıt yazım yılı 2010; erişim 25 Ekim 2026. Henri IV'ü korumalı kruvazörlerle aynı sınıfa koyan donanma grup anlatısı düzeltildi. 18 Mart görevi veya konumu bu sınıf kaydından türetilmedi. Geminin tarihsel mevcuduna yeni koordinat/saat eklenmedi.
- Kurumsal kaynak da körlemesine aktarılmadı: tarihçe kısmı 1916 hizmeti ile 1912 söküme satışı birlikte yazıyor; bunlar görünür çelişki olarak araştırma kaydına alındı, siteye aktarılmadı. Teknik sayılar ve görsel hakları doğrulanmadığı için alınmadı. Özgün görev günlüğü incelenmiş sayılmadı.
- 266/266 JavaScript ve 18/18 Python başarılı; R03-henri-tests.txt. Yeni regresyon testi sınıf ile görev/tarih iddiasını ayırır. Commit/push/deploy/scraper yok.
- R03 sürüyor. Sonraki: ileri hat/kruvazör kartlarının son metinlerini masaüstü ve dar ekranda kontrol et (önceki boyut denetimleri yeni metinlere otomatik kanıt sayılmaz); sonra kalan gemi teknik değerleri için özgün plan/katalog pasajlarını incele. Henri IV 18 Mart görevi ayrı açık sorudur; sınıf sonucu bu soruyu çözmüş sayılmaz.

## R03 16.41 UTC partisi — son metinlerin arayüz doğrulaması
- İleri hat ve Henri IV sınıf açıklamalarının son yerel sürümü gerçek IAB DOM üzerinden kontrol edildi. Masaüstü içerik/scrollWidth 1265/1265. 320×740 dış viewportta içerik/scrollWidth 305/305; yatay taşma yok. Albion kartında 14.32 ve kruvazör kartında Henri IV'ün sınıf grubuna dahil edilmediği açıklaması mevcut. Viewport reset edildi; kullanıcının canlı sekmesi değiştirilmedi.
- Küçük tutarlılık düzeltmesi: kruvazör kartının eski Bayrak alanı Britanya ve Fransa diyordu; anlatıdan Henri IV ayrıldıktan sonra bu özet de Britanya ve Henri IV'ün gruba dahil olmadığı kapsamıyla eşleştirildi. Yeni tarihsel iddia/sayı/koordinat eklenmedi. Bu partide yeni tarihsel belge okunmadı; öncekiler yeniden okunmuş gibi kaydedilmedi.
- R03 sürüyor; sonraki somut kaynak işi 178 mm gibi tek değerle verilen zırhın bölümü (kemer/taret) ve tarihini özgün teknik plan/kurum kaydıyla ayırmak. Genel zırh alanının geminin her bölümünde aynı olduğu varsayılmamalı. Bir sonraki aşamada bunu bütün gemiler için otomatik doğrulanmış sayma.
- Commit/push/deploy/scraper yok. Son test sonucu bu partinin test çıktılarıyla kaydedilir.

## R03 17.01 UTC partisi — Inflexible zırhının kapsamı
- RMG 1907 gemi planı araması NPB4538 ve NPB4607 ipuçlarını verdi; iki doğrudan sayfa açılışı cache miss oldu. Bunlar okunmuş özgün plan sayılmadı. NPB4538 arama parçasındaki Inflexible başlığı/Invincible vessel etiketi uyuşmazlığı kaydedildi; aynı adlı 1876 gemisine ait sonuçlar dışarıda tutuldu. R03-inflexible-armour-scope.json kaynak denemelerini ve sınırları tutar. Satın alma veya görsel indirme yapılmadı.
- Yerel Inflexible kartında 178 mm değeri hangi zırh bölümü ve tarihe ait olduğunun doğrulanmadığı açıklamasıyla sunuluyor; tek sayının bütün gemi koruması olmadığı açıklandı. Yeni zırh kalınlığı uydurulmadı. Kanıt ve kaynak boş alanları iddia doğrulaması sayılmadı.
- R03 sürüyor. Sonraki: bu kısa teknik uyarının mobil görünümünü kontrol et; erişimi tekrar aynı RMG URL'lerinde zorlamak yerine ayrı teknik plan arşivine veya erişilebilir başka önemli sayısal iddiaya geç. Kullanılmayan veri alanları canlı gösterimle karıştırılmamalı. Commit/push/deploy/scraper yok.

## R03 17.21 UTC partisi — Nusret mayın sayısı
- Erişilemeyen teknik plan sayfaları tekrarlanmadı; önemli görünür başka sayısal iddiaya geçildi. AWM C1068416/P04411.003 katalog açıklaması doğrudan açılıp 7/8 Mart ve 26 mayın ilgili pasajları okundu. URL/kanıt/olay-fotoğraf-yayın-erişim ayrımı R03-nusret-mine-count.json içinde. Kaynak statüsü katalog açıklamasıdır, özgün imzalı rapor görüntüsü değildir.
- Nusret kartı 26 mayını hat mevcudu olarak açıklıyor; personel/zayiat/stokla karıştırmıyor. Mayın döşeme anı olmayan fotoğrafın sınırı ve harita çizgisinin ayrıca doğrulanması gerektiği belirtiliyor. Eski 8–18 Mart hiçbir gemi çarpmadı iddiası bu pasajla belgelenmediğinden kesin anlatımdan çıkarıldı. Koordinatlar ve geometri değişmedi.
- Aynı katalogdaki Irresistible 19.30/Ocean22.30 kesin batış anlatıları diğer raporlarla açık çelişki nedeniyle alınmadı. Kaynağın tek bir yararlı pasajı bütün açıklamasını doğrulanmış yapmaz.
- R03 sürüyor; Inflexible uyarısının ve yeni Nusret paragrafının masaüstü/mobil kontrolü sonraki QA hedefi. Sonraki araştırma özgün Osmanlı mayın raporu veya bağımsız tarihli mayın cetveli; aynı AWM metnini tekrar okuyarak bağımsız kanıt sayısını artırma. Commit/push/yayın/scraper yok.

## R03 kullanıcı devam partisi — Nusret kurumsal karşılaştırma ve bekleyen QA
- Öncelik gerekçesi: görünür 26 mayın iddiasının mevcut AWM katalog zincirini başka erişilebilir kurum anlatısıyla karşılaştırmak ve önceki iki kart değişikliğinin bekleyen dar ekran kontrolünü tamamlamak.
- Tarihi Alan Başkanlığı Deniz Savaşları sayfasının ilgili 7/8 Mart–Erenköy–26 mayın pasajı doğrudan okundu. Bu kurumsal özet Nusret kartına kaynak, olay/erişim tarihi ve yayın tarihinin belirtilmediği notuyla eklendi. AWM ile kaynak zinciri bağımsızlığı kanıtlanmadığından iki bağımsız birincil belge sayılmadı. Özgün cetvel veya koordinat doğrulaması yapılmadı. Kaynak/kanıt/sınırlar R03-nusret-institution-comparison.json içinde.
- MSB haber açılışı yönlendirme döngüsü verdi; arama parçası okunmuş tam belge sayılmadı. Aynı erişim engeli tekrar denenmedi.
- Yerel donanma sayfası gerçek IAB DOM kontrolü: masaüstü içerik/scrollWidth 1265/1265; 320×740 dış viewportta 305/305, yatay taşma yok. Nusret kaynak sınırı ve Inflexible zırh bölümü/tarih açıklaması her iki boyutta mevcut. Viewport reset edildi; kullanıcının canlı sekmesine dokunulmadı.
- Değişen dosyalar: donanma/index.html, bu devam kaydı ve iki yerel araştırma/test çıktısı. 268/268 JavaScript ve 18/18 Python başarılı; git diff --check temiz. R03-nusret-comparison-tests.txt. Commit/push/yayın/scraper yok.
- Durum: R03 devam ediyor; genel kabul ölçütü tamamlanmadı. Sıradaki somut hedef: Nusret özgün Osmanlı mayın cetveli/raporunun erişilebilir yayımlanmış görüntüsünü bulmak; erişilemezse engeli kaydedip kalan görünür gemi teknik iddialarının kaynak eşleştirmesine geçmek. Aynı kurumsal özetleri tekrar okuyarak birincil kanıt sayısını artırma.

## Kullanıcı önceliği — sözlük geliştirmesi
- Kullanıcının açık sözlük talebi, devam eden R03 araştırmasının önüne alındı. R03 tamamlandı sayılmadı ve otomasyon çoğaltılmadı.
- Tamamlanan kapsam: eski 7 maddelik sözlük 5 konuda 40 maddeye genişletildi. Birlik/personel, saha, deniz, sağlık/iaşe ve belge/harita okuma terimleri; kadro–mevcut–zayiat, isabet–terk–batış ve çevrimyazı–görüntü ayrımları eklendi. İaşe/istihkak/ikmal doğrudan mevcut cephede-beslenme sayfasına bağlandı.
- Gerçek geliştirme: Türkçe harfleri sadeleştiren ve eş anlamlıları kapsayan arama, konu süzgeci, sonuç sayısı/boş sonuç, iki süzgeci sıfırlayan temizleme ve Escape, URL üzerinden arama/konu geri yükleme, terim bağlantıları ve gizli terime bağlantıda süzgeçlerin açılması. JS olmadan tüm terimler okunur; çalışmayan kontroller gösterilmez. Canlı sonuç duyurusu ve etiketler mevcut.
- Kaynak araştırması: AWM ANZAC acronym açılım/kolordu pasajı (güncelleme 16 Şubat 2026), Unit and Commander’s War Diaries Background/Content (14 Ekim 2024), Official Histories tür açıklaması (13 Şubat 2023), National WWI Museum Trench Warfare genel siper açıklaması doğrudan okundu. Önceki Tarihi Alan Nusret pasajı kaynak sınırıyla korundu. URL, kısa kanıt, tarih ve durum glossary-development.json ve sayfanın kaynak notlarında. Özgün günlük görüntüsü veya bütün eser okunmuş sayılmadı; Batı Cephesi siper ölçüleri Çanakkale’ye taşınmadı. Genel tanımlar atlas kullanım açıklamasıdır; iddia_dogrulandi statüsü verilmedi.
- Dosyalar: sozluk/index.html; yeni css/glossary.css, js/glossary.js, tests/glossary.test.js; yerel araştırma ve QA çıktıları. Katalog şeması ve HTML/CSS/JS/Leaflet mimarisi korundu.
- Kabul kontrolü: gerçek IAB'de firka -> Tümen 1/40; deniz süzgeci ile boş sonuç; temizle -> 40/40 ve iki alan sıfır. Paylaşılan ?q=iase&konu=yasam -> 1/40 ve beslenme bağlantısı; gizli #tumen -> 40/40 ile görünür hedef. Masaüstü içerik/scrollWidth 1265/1265; 375 dış viewportta 360/360; 320 dış viewportta 305/305, yatay taşma yok. Masaüstü/mobil ekran görüntüleri glossary-desktop.png ve glossary-mobile.png. Viewport reset edildi, kullanıcının canlı sekmesi değişmedi. Fiziksel telefon testi yapılmış sayılmaz.
- Son doğrulama: bütün 272 JavaScript testi ve 18 Python testi başarılı, git diff --check temiz; glossary-tests.txt. Sözlük talebinin bu kapsamı tamamlandı. Commit/push/yayın yapılmadı.
- Sonraki somut hedef: kullanıcı yeni yönlendirme vermezse R03 kaldığı Nusret özgün cetvel/rapor ve gemi teknik kaynak eşleştirmesine dön; sözlükte gelecekte yeni kaynaklı terimler gerektiğinde aynı kaynak/kapsam düzenini koru.

## Sözlük devam — alfabetik dizin ve bağlantı sürekliliği
- 40 terimin tamamına Türkçe sıralı A–Z dizini eklendi; yerel HTML details/nav yapısı JavaScript olmadan da açılır. Nasıl okunur sayfasından kadro, fiilî/muharip mevcut, zayiat ve koordinat maddelerine doğrudan geçiş eklendi.
- Gerçek hata düzeltmesi: aynı #terim bağlantısı üzerinde arama yapıp hedefi gizledikten sonra yeniden aynı bağlantıya basmak hashchange üretmiyordu. Normal tıklama artık hedefi görünür yapar, kaydırır ve odağı verir; Ctrl/yeni sekme davranışına müdahale edilmez. Başlangıçta süzgeç yüzünden gizlenen hedef de açılırken kaydırılır.
- Kabul kontrolü: gerçek IAB’de #tumen üzerinde iaşe arandı (1/40), dizindeki Tümen bağlantısına basınca 40/40, hedef görünür ve odak tumen. Masaüstü 1265/1265, 320×740 dış viewportta 305/305; açık dizinde yatay taşma yok. Screenshot glossary-directory-mobile.png. Viewport reset edildi. İlk role=button seçimi HTML summary ile eşleşmedi; gerçek summary öğesiyle kontrol tamamlandı, ürün arızası olarak kaydedilmedi.
- 273/273 JavaScript ve 18/18 Python testi başarılı, git diff --check temiz; glossary-directory-tests.txt. Yeni regresyon aynı hash ve Ctrl tıklamasını kapsar. Tarihsel iddia veya kaynak doğrulama statüsü eklenmedi. Dosyalar: sozluk/index.html, js/glossary.js, css/glossary.css, nasil-okunur/index.html, tests/glossary.test.js. Commit/push/yayın yok.
- Bu sözlük iyileştirmesi tamamlandı; genel R03 araştırması açık kalır.

## Kullanıcı isteğiyle commit, push ve canlı yayın — sözlük/donanma
- İçerik commit 10e4abd main dalına kaydedildi ve origin/main GitHub gönderisi tamamlandı. Sözlük, terim dizini, bağlantı düzeltmesi, Nasıl okunur geçişleri ve bekleyen R03 donanma kapsam düzeltmeleri dahil. archive, yerel QA görüntüleri ve deployment klasörü gönderilmedi.
- Son testler: 273/273 JavaScript, 18/18 Python, git diff --check temiz. Ana sayfanın app/data URL sürümleri 20261025k yapıldı; önceki önbelleğe takılmaması sağlandı.
- Hostinger listesi: onsekizmart.com, u522023586, etkin other/statik site. hosting_deploy statik yerel stage ile deployed döndü. 160 dosyalık paket; .htaccess dışındaki 159 public dosyanın tamamı canlı SHA256 ile eşleşti. .htaccess HTTP üzerinden doğrulanabilir dosya sayılmadı; son doğrulanmış stage yapılandırması korundu.
- Geri dönüş: research/deployment/2026-10-25-glossary-release/before içinde önceki yayının 157 public dosyası indirildi ve önceki manifestle eşleşti; .htaccess önceki doğrulanmış yapılandırma kopyasıdır. Aynı klasörde stage, manifest, before/after-manifest, test çıktısı ve live-glossary.png bulunur. Bu klasör gitignore kapsamında yerelde tutuldu.
- Canlı IAB kontrolü: https://onsekizmart.com/sozluk/?q=firka 1/40 ve Tümen; Süzgeci temizle 40/40. Mevcut kullanıcı sekmesi değiştirilmedi. Genel R03 kaynak araştırması halen açık; yayın tamamlanması tarihsel araştırmanın bittiği anlamına gelmez.
