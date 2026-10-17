# ONSEKİZMART — Aşama 6.3

16 Ekim 2026. Yerel prototip geliştirmesi. Tasarım onayına sunulacak sürüm; ana siteye entegrasyon ve yayın yapılmadı.

## İnceleme ve tasarım

AGENTS.md, mevcut index.html, css/style.css, js/app.js ve prototip/ana-sayfa/ okundu. Ana atlasın kontrol paneli, katmanları, saat şeridi, kampanya kronolojisi ve seçili gün görünümü korunuyor. Ana sitenin bu üç dosyası değiştirilmedi.

Başlangıçta prototipin kronolojisi başka sayfaya bağlantıdan ibaretti. Harita olay seçimine bağlı değildi. Dar ekranda uzun giriş metni ve alt alta düğmeler coğrafyayı aşağıya itiyordu. Mobilde seçili olay ayrıntısının listenin üzerinde olması, seçim sonucunu bulmayı güçleştiriyordu. Menü düğmesindeyken Escape kapanışı yoktu. Harita görsellerinin yüklenememesi için kullanıcıya durum bildirimi yoktu.

Hero petrol, bronz ve krem paletiyle düzenlendi. Serif başlık, sade giriş metni ve iki kısa eylem düğmesi kullanıldı. Sağ bölümde gerçek Leaflet uydu haritası var; dekoratif veya üretilmiş tarihsel harita kullanılmadı. Gelibolu Yarımadası ve Çanakkale Boğazı masaüstü coğrafya alt yazısı olarak yer alıyor. Mobilde giriş kısaltıldı, düğmeler yan yana yerleştirildi ve harita yüksekliği görünüm alanına uyarlandı.

## İşlevler ve veri sınırı

Prototip js/data.js ve js/campaign.js dosyalarını yalnız okuyarak kullanıyor. Mevcut 28 olay kaydı gösteriliyor; sessiz aralıklar ve ayrı sayfası olmayan kayıt listeye alınmıyor. Olay başlığı veya tarihle Türkçe karakter duyarlı olmayan arama yapılabiliyor. Tümü, Deniz ve Kara süzgeçleri aramayla birlikte çalışıyor. Sonuç yoksa açıklama gösteriliyor.

Seçim ayrıntı başlığını odaklar; olay sayfası ve listeye dönüş bağlantıları sunulur. Harita varsa mevcut mevki koordinatıyla tek işaret gösterilir. Konum yoksa yeni nokta üretilmez. Liste ve ayrıntıdaki tarihler mevcut kayıttan gelir. Yeni tarihsel anlatı yazılmadı, doğrulama durumu yükseltilmedi. Kaynak kanıtının eksikliği görünür metinde belirtiliyor.

Başlangıç görünümü, uydu/yol katman seçimi ve yakınlaştırma çalışır. Tekerlekle yakınlaştırma kapalıdır; sayfa kaydırılırken haritanın istemeden yakınlaşması önlenir. Hareket azaltma tercihi gözetilir. Harita kütüphanesi yüklenmezse kronoloji ve olay bağlantıları çalışmaya devam eder. Görsel yükleme hatası ayrı bildirilir. Menü JavaScript yokken bağlantıları gösterir; JavaScript varken açılır/kapanır ve Escape ile odağı menü düğmesine geri verir.

## Yerel doğrulama

Gerçek prototip yerel HTTP sunucusunda açıldı. Tarayıcı panelinin dar genişliğine ek olarak asama-6-3-preview.html içindeki 1440 × 1000 masaüstü ve 375 × 812 mobil iframe görünümleri kullanıldı. Bunlar gerçek sayfayı çalıştırır; cihaz emülasyonu veya fiziksel telefon testi değildir.

Masaüstü: uydu görselleri, boğaz ve yarımada görünümü, tipografi, düğmeler ve katman kontrolleri gözle kontrol edildi.

Mobil: kısa hero, yan yana düğmeler ve harita görünümü kontrol edildi. Tarayıcıda ARIBURNU araması dört sonuç verdi. Arıburnu çıkarması seçimi ayrıntıyı güncelledi, odak başlığa geçti ve Haritada gör bağlantısı mevcut konumdaki işareti açtı.

Ekran görüntüleri: asama-6-3-desktop.png ve asama-6-3-mobile.png. Tarayıcı kontrolü dokunmatik cihaz hareketlerini ve tüm katman sağlayıcılarının kesinti davranışını kapsamıyor. Harita kütüphanesi yokluğu otomatik testte doğrulandı.

Testler:

- node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js tests/prototype.test.js — 26/26 başarılı. Bunun 22 testi zorunlu mevcut paket, dört testi yeni prototip testidir.
- python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network — 14/14 başarılı.

Yeni testler: haritasız kronoloji ve tüm üretilen olay bağlantılarının gerçek dosyaya ulaşması; Türkçe arama ve tür süzgeci; işaretlerin yalnız mevcut koordinatları kullanması; Escape ve odak dönüşü. Bunlar DOM/Leaflet taklitleriyle davranışı sınar; gerçek tarayıcı kontrolünün yerine geçmez.

## Tasarım onayından sonra kontrollü entegrasyon

Önce hero kompozisyonu ve mobil görünüm onaylanmalı. Ardından mevcut index.html üzerinde tek Leaflet haritası korunarak entegrasyon yapılmalı. Prototipin ikinci harita başlatıcısı ana sayfaya kopyalanmamalı. Mevcut #map, #control-dock, #panel, #layers, #tl-range, #mode-18, #mode-camp, #camp-list ve #event-list bağlantıları korunmalı. Harita kapsayıcısının boyutu değişince invalidateSize çağrısı doğrulanmalı.

Stiller ana sayfaya özgü bir kapsayıcı altında taşınmalı; olay ve kaynakça sayfalarına genel h1/hero kuralları yayılmamalı. Mevcut app.js olay seçimi, arama, oynatma, katman ve analitik davranışları kullanılmalı. Onaydan sonraki yerel kontrolde saat şeridi, kampanya geçişi, taraf süzgeci, katmanlar, arama, derin bağlantılar ve klavye akışı ayrıca denenmeli. Sayfa kopyaları veya tarihsel veri kaynakları çoğaltılmamalı.

Cursor ile yapılabilecek ayrı işler: onaylı stillerin ana sayfa kapsamına alınması; mevcut app.js ile mobil menü/odak davranışlarının eşleştirilmesi; entegrasyon sonrası farklı ekran genişliklerinde tarayıcı testlerinin otomasyonu. Bu işler henüz Cursor'a gönderilmedi.

## Değişiklik kapsamı

prototip/ana-sayfa/index.html, css/prototip.css ve js/prototip.js geliştirildi. tests/prototype.test.js eklendi. Bu rapor, görünüm kontrol sayfası ve iki ekran görüntüsü research/ux-audit/ altında tutuluyor.

Tur başında tests/catalog.test.js ve tests/quality.test.js zaten değişmişti; bu mevcut değişikliklere dokunulmadı. Scraper, ham arşiv, kaynak kataloğu, tarihsel veri dosyaları ve olay sayfaları değiştirilmedi. Commit, push ve Hostinger yayını yapılmadı.
