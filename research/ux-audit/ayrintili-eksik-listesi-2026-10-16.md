# ONSEKİZMART — ayrıntılı eksik listesi

İnceleme: 16 Ekim 2026. Dayanak: mevcut yerel kod, prototip, araştırma ve yayın kayıtları; yeniden çalıştırılan 37 Node ve 15 Python testi. Bu incelemede yeni tarihsel belge araştırması, fiziksel cihaz testi veya canlı dosya indirmesi yapılmadı. Uygulama kodu değiştirilmedi. Bu liste çalışan özellikleri yok sayan bir yeniden yapım planı değildir.

## P0 — tarihsel güvenilirlik

1. İddia-belge eşleştirmesi eksik (doğrulandı). Araştırma kataloğunda 26 kayıt var: 15 bulundu, 6 metadata_kontrol_edildi, 5 insan_incelemesi_gerekli; iddia_destegi=true yok. Bu sayılar yanlış iddia sayısı değildir. Kesin saat, mevcut, zayiat, emir ve konum ifadeleri için belge URL’si, kanıt metni, tarih ve doğrulama durumu eşleştirilmeli. Gerçek mevcut, muharip mevcut ve kuruluş kadrosu ayrı ele alınmalı. Kapanış: her iddia için izlenebilir dayanak veya açık doğrulanmamış durum. Katalog şeması değiştirilmeyecek.

2. Kaynak doğrulama kapısı eksik (kodda doğrulandı). js/model.js hasPageCitation yalnız page ve documentNo alanlarını denetliyor; belge URL’si, kanıt metni, tarih, claimSupport ve kurum ana sayfası ayrımı denetlenmiyor. Mevcut üç çerçeve kaynağında numaralar boş olduğu için şu anda bu kapı onları doğrulamıyor. Ancak gelecekte iki alanın doldurulması tek başına verification=sayfa üretebilir. Kapanış: numara eklemek doğrulanmış etiket için yeterli olmamalı; olumsuz senaryolar test edilmeli. Kaynak kataloğuna müdahale etmeden uygulamanın doğrulama kuralı ayrı ele alınabilir.

3. Bilinen araştırma boşlukları açık. research/gelibolu/sonraki-adimlar.md ve historical-data-issues.md: 16 Mart Carden ayrılışı/17 Mart de Robeck görevi, Nusret mayın sayısının belge dayanağı, Ocean kaydı ve farklı zayiat ifadeleri. Bu dosyalar araştırma kuyruğudur; burada sonuçları doğru/yanlış diye yeniden hükme bağlamadık. Kapanış: ilgili belge gerçekten açılmalı, kanıt kaydedilmeli; yakın kayıt numarası veya kurum ana sayfası boşluğu doldurmamalı.

## P1 — performans

4. Yükleme hızı hedefe ulaşmadı (ölçüldü). 16 Ekim tekil mobil Lighthouse: canlı 55, FCP 4,6 sn, LCP 7,9 sn, TBT 328 ms. Daha sonraki yerel font değişikliği koşusu 52, LCP 8,3 sn, TBT 500 ms, CLS 0,023. Ortamlar farklı; hız kazanımı doğrulanmadı. Bu ölçüm son menü/panel değişikliklerinden öncedir. Kapanış: aynı koşullarda tekrarlı son sürüm ölçümü ve ölçülebilir iyileştirme.

5. Harita ve dış kaynak maliyeti açık. LCP öğesi harita karosu; Leaflet/analitik CPU maliyeti ve karo çözünürlük uyarısı var. Google Fonts, Leaflet CDN, Esri ve OSM ağ bağımlılıkları sürüyor. Çalışan özellikleri sırf puan için silmeden yükleme sırası/ilk görünüm maliyeti değerlendirilmeli. INP saha ölçümü yok. Brotli ve CSS/JS önbelleği önceki canlı kontrolde doğrulandı; bunları eksik diye tekrar kurmak gerekmiyor.

## P1 — gerçek kullanım testleri

6. Fiziksel Android/iOS testi yapılmadı. Harita sürükleme/pinch, dikey-yatay geçiş, sanal klavye açık arama, tarayıcı adres çubuğunun boyut değişimi, uzun bilgi paneli ve küçük yatay ekran denenmeli. Iframe kontrolleri fiziksel telefon kanıtı değildir.

7. Yardımcı teknoloji testi yapılmadı. NVDA/VoiceOver/TalkBack ile menü, sonuç sayısı, kayıt seçimi, panel kapanışı, zaman çubuğu ve haritayı atlayarak metne erişim denenmeli. Lighthouse erişilebilirlik 100 olması bu testi kapatmaz. Yeni odak geçişlerinin çoğu taklit DOM testleriyle korunuyor; tümü gerçek ekran okuyucuyla doğrulanmış değil.

8. Ağ toparlanması kısmen testli. Leaflet yokluğu ve karo hatası tarayıcıda benzetildi; başarılı karo toparlanması olay testinde doğrulandı. Kısmi karolar, bağlantının gidip gelmesi, katman değişimi sırasında geç gelen hatalar, Google Fonts/CDN CSS kesintisi ve yavaş ağ kombinasyonları açık. Tam çevrimdışı atlas yok; bu ayrı ürün tercihidir.

## P1 — hero ve görsel bütünlük

9. Coğrafya merkezli hero hedefi kısmen karşılandı. Ana sayfada başlık/eylemler üstte, mevcut Leaflet harita altta; prototipte metin ve harita yan yana. Yeni başlık yerleşimi mevcut özellikleri koruyor, fakat prototipin bütün coğrafi kompozisyonu ana sayfaya taşınmış değil. Müze kalitesi için Gelibolu silueti/harita çerçevesi, coğrafi vurgu, boşluk ve tipografi son tasarım turu gerekiyor. Yeni tarihsel görüntü veya harita ancak mevcut doğru veri/kullanım hakkıyla kullanılmalı; ikinci çalışan atlas eklenmemeli.

10. Sayfalar arası son görsel kontrol açık. Ana sayfa, olay dizini, uzun olay, komutan, donanma ve rehberlerde 320–430 piksel, tablet, geniş ekran, %200 yakınlaştırma ve uzun başlık kontrolü tamamlanmalı. Son masaüstü panel sıkışması düzeltildi; bütün sayfalar için aynı kapsamda görsel regresyon kaydı yok.

## P2 — atlas gezinmesi

11. Seçili görünümün paylaşımı eksik (kod incelemesi). Gelen ?olay=/ ?mevki= bağlantıları tüketiliyor; normal seçimde URL güncellemesi, seçili saat/filtre/görünümün paylaşılabilir kaydı, popstate/hashchange eşitlemesi bulunmuyor. Kapanış: kullanıcı paylaşım/geri düğmesi beklentisi netleştirilip mevcut derin bağlantılar korunarak uygulanmalı. Bu bir ek işlevdir; mevcut bağlantıların hepsi bozuk demek değildir.

12. Geçersiz olay bağlantısında açıklama eksik. consumeDeepLink eşleşmeyen olay anahtarında başlangıç görünümünde kalabiliyor; aranan olayın bulunamadığını söylemiyor. Kapanış: bulunamayan kaydı açık mesaj ve olay listesi bağlantısıyla anlatmak; kayıt uydurmamak.

13. Arama kapsamı ve sonuç sunumu geliştirilebilir. Ana arama yer/olay metinlerini tarıyor; sonuç üst sınırı 8. Kullanıcı daha fazla eşleşme olup olmadığını veya tür ayrımını net görmüyor. Olay dizini araması ayrı. Komutan/gemi ayrıntılarını kapsayan birleşik site araması yok. Kapanış: önce mevcut 8 sonuç sınırını açıklamak, tür etiketleri ve olay listesine devam bağlantısı; birleşik arama sonradan değerlendirilebilir.

14. Kronolojide bilgi yoğunluğu yüksek. Uzun liste, saatli akış ve sefer modları birlikte. Mevcut süzgeçler çalışıyor; tarih aralığına hızlı geçiş veya metinsel kronoloji araması ürün geliştirme önerisi. Statik olay dizini JavaScript olmadan okunuyor, ana dinamik kronoloji ise açıklama ve olay listesi bağlantısı gösteriyor. JavaScript olmadan tam kronoloji ayrı bir geliştirmedir.

15. Kaynakça gezinmesi ortak davranıştan ayrışıyor. Kaynakça eski menü kodunu taşıyor; diğer iç sayfalar js/navigation.js kullanıyor. Kataloğa dokunmama sınırı korunarak yalnız arayüz kodu için ayrı kontrol gerekiyor. Bu tur kaynakça menüsüne yeniden tarayıcı testi yapılmadı.

## P2 — tamamlanmamış içerik ve ürün kararları

16. Belge/görsel arşivi üründe yok. js/model.js archive.documents boş; site de bu sürümde belge arşivi olmadığını söylüyor. Belge görüntüleyici, hak/izin bilgisi, künye ve olayla ilişkilendirme olmadan arşiv tamamlandı sayılamaz. Ham archive/ klasörünü doğrudan yayımlamak çözüm değildir; kullanıcı sınırı korunmalı.

17. İletişim gönderim servisi değil. Mevcut not hazırlama/kopyalama ve posta programına geçiş kasıtlı davranış; sunucu formu yok. E-postanın teslim/alım süreci ayrıca doğrulanmış değil. Düzeltme gönderimi takibi isteniyorsa ayrı gereksinim; mevcut özelliği çalışmıyor diye sınıflandırmamak gerekir.

18. Paylaşım önizlemesi sınırlı. Ana sayfa Open Graph başlık/açıklama/adres taşıyor; og:image tanımı yok. Hakları belli paylaşım görseli ve farklı platformlarda kart görünümü kontrolü yapılabilir. Temel canonical/sitemap/iç bağlantı kontrolleri zaten geçiyor.

## P1/P2 — test, bakım ve yayın

19. Otomatik gerçek tarayıcı regresyon paketi eksik. 37 Node ve 15 Python testi başarılı; önemli etkileşimlerin bir bölümü taklit DOM ve elle tarayıcı kontrolüyle doğrulanıyor. Sonuç seçimi→panel→kapatma, olay→harita, görünüm geçişi, ağ kesintisi/toparlanma için tekrarlanabilir tarayıcı senaryoları gerekli. Lighthouse son sürüm için tekrar alınmalı. Fiziksel cihaz sonucu otomasyonla var sayılmamalı.

20. CSS ve ana JS bakım yükü arttı. style.css içinde zaman içinde eklenmiş örtüşen medya kuralları, app.js içinde çok sayıda arayüz sorumluluğu var. Kanıtlı görsel regresyonlar hazırlandıktan sonra aynı statik mimari içinde sadeleştirme yapılabilir; toplu yeniden yazım gerekmiyor. Prototip, yerel ve yayın sürümü farklı işlevler taşıyor; raporlarda hangisinin ölçüldüğü belirtilmeli.

21. Son düzeltmeler yayın kaydından sonra yerelde. 16 Ekim yayın manifestiyle SHA karşılaştırmasında index.html, css/style.css, js/app.js farklı. Bu, kayıtlı son yayına göre farktır; bu tur canlı yeniden indirilmedi. Son font, hata, JavaScript kapalı görünüm, arama/odak ve menü düzeltmelerinin yeni yayın paketi hazırlanmalı. Açık yayın onayı olmadan gönderilmemeli.

22. Yayın kontrolü kapatılmalı. Son paket listesi/özetleri, önceki sürüm yedeği, geri dönüş yöntemi ve yayın sonrası gerçek URL kontrolü güncellenmeli. research/prototip/tests/archive yayın dışında kalmalı. Çalışma ağacında çok sayıda eski değişiklik var; bunların hepsini yeni fark veya yeni hata sanmamak gerekir. Commit/push/yayın ayrı yetki gerektirir.

## Önerilen uygulama sırası

Önce kaynak doğrulama kapısını güçlendirmek ve iddia-belge iş listesini hazırlamak; bunun yanında gerçek cihaz/ekran okuyucu testlerini yürütmek. Ardından aynı ortamda performans iyileştirmesi ve hero tasarımını tamamlamak. Sonra paylaşılabilir atlas durumu, geçersiz bağlantı açıklaması ve arama/kronoloji ergonomisi. Son olarak tüm kritik akışların regresyonu ve kontrollü yayın paketi.

Cursor'a verilebilecek sınırları net görevler: mevcut şemaya dokunmadan kaynak kapısı için olumsuz testler; atlas durum URL'si ve geri/ileri davranışı; gerçek tarayıcı regresyon senaryoları; ekran görüntüsü karşılaştırmasıyla CSS sadeleştirmesi. Tarihsel hüküm üretme, scraper çalıştırma, ham arşivi yayımlama veya otomatik deploy görevi verilmemeli.

## Kapanmış işleri yeniden açmamak için

Leaflet harita/katmanlar, 18 Mart ve Kampanya akışı, olay dizini süzgeci, temel Türkçe arama, mobil menü, boş arama mesajı, klavye sonuç gezinmesi, panel kapanış odağı, daraltılmış panelden yeni kayıt seçimi, JavaScript/Leaflet yokluğunda alternatif bağlantılar ve karo hata uyarısı mevcut. Eksikler bu tabanın üstüne tamamlanmalı.

## Güncelleme — kaynak kapısının teknik düzeltmesi

16 Ekim 2026: 2. maddedeki otomatik doğrulama açığı js/model.js içinde kayıt/ifade düzeyinde kanıt denetimiyle giderildi; 41 Node ve 15 Python testi başarılı. Tarihsel doğrulama (1 ve 3) hâlâ açık. Katalog şeması ve mevcut kaynak satırları değişmedi, mevcut iddialar yükseltilmedi. Ayrıntı: son-kontrol-ve-kalan-isler.md son bölüm.
