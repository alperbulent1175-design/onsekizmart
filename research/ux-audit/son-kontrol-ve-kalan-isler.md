# Son kontrol ve kalan işler

Tarih: 16 Ekim 2026. İncelenen sürüm yerel çalışma ağacıdır. Bu dosya önceki geliştirme notlarından sonra başvurulacak tek öncelik listesidir. Canlı site kontrol edilmedi; commit, push ve yayın yapılmadı.

## Son durum — canlı yayın yapıldı

16 Ekim 2026 tarihinde kullanıcının tüm geliştirmeleri canlıda görme talebi üzerine bu yerel sürüm onsekizmart.com üzerinde yayımlandı. Aşağıdaki önceki tur notlarında geçen «yayın yapılmadı» ifadeleri kendi yazıldıkları aşamaya aittir. 75 dosyanın tamamı canlı içerikle eşleşti; temel canlı akışlar kontrol edildi. Ayrıntı research/deployment/2026-10-16-live/yayin-raporu.md dosyasında. Commit ve push yapılmadı. Tarihsel kanıtlar, fiziksel cihaz ve performans ölçümü açık iş olarak kalıyor.

## Bu kontrolde tamamlananlar

- 65 yayımlanabilir index.html sayfasının yerel href/src hedefleri ve HTML bölüm kimlikleri tarandı: eksik dosya veya bölüm hedefi bulunmadı. Araştırma, prototip, archive ve node_modules bu sayıya dahil değildir. Dış kaynak URL’lerinin HTTP durumu bu taramanın kapsamında değildir.
- Ana sayfa mobil menüsüne Escape ile kapanma ve odak dönüşü eklendi. Menü açıkken Escape atlasın seçili olay panelini gereksiz yere kapatmaz.
- Ana sayfanın arama/süzgeç/katman paneli Escape ile kapanınca odak ilgili araç düğmesine döner. Mobil aramada bu davranış gerçek tarayıcıda doğrulandı.
- Ortak menü masaüstüne geçerken odağı gizli Menü düğmesine taşımıyor. Mobil görünüm geri geldiğinde gizlenecek bağlantı odağı düğmeye aktarılıyor. Yeni otomatik regresyon testi eklendi.
- Yerel mobil tarayıcıda menü kapanışı, kampanya geçişi, sonraki olay ve Nusret araması yeniden kontrol edildi. Bu kontrol 375 × 812 iframe görünümündedir, fiziksel telefon testi değildir.
- Zorunlu Node paketleri ve ilave davranış testleri: 31/31 başarılı. Python paketleri: 15/15 başarılı.

Komutlar:

```
node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js tests/prototype.test.js tests/navigation.test.js tests/events-index.test.js
python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network
```

Düzeltmeler js/app.js, js/navigation.js ve tests/navigation.test.js içinde. index.html içindeki app.js sürümü v=20261016f oldu. Görsel kanıt son-kontrol-mobile.png.

## Son geliştirme — kaynak durumu ve yayın sınırları

56 içerik sayfasına ve ana kronolojiye görünür belge doğrulama uyarısı eklendi. Uyarı mevcut kaynak notlarına dayanır; hiçbir iddia doğrulanmış olarak yükseltilmedi. 56 sayfanın prose/facts/roster blokları Git HEAD ile karşılaştırıldı ve değişmediği doğrulandı. Kaynak notları ve kaynak kataloğu aynen duruyor. Mobil görünüm gerçek tarayıcıda kontrol edildi; görsel asama-6-9-source-notice.png.

build_pages.py içindeki yayın sayfası taraması artık archive, research, prototip ve node_modules dizinlerini açıkça dışlar. Dizin içeriği değiştirilmedi, site haritası yeniden yazılmadı. Üretici yalnız okunarak doğrulandı: 65 sitemap girdisi. Yeni test, noindex etiketi olmasa bile bu özel dizinlerin dışarıda kaldığını geçici test dosyalarıyla sınar. Bu koruma bir Hostinger paketleme filtresi değildir; yayın paketi ayrıca incelenmelidir.

JavaScript engellenmiş sandbox iframe içinde gerçek olay dizini açıldı. Mobil gezinme bağlantıları ve olay kartları erişilebilir kaldı; çalışmayacak arama denetimleri ve Menü düğmesi gizlendi. Yerel kontrol dosyası research/ux-audit/no-script-check.html. Bu test harita karo/CDN kesintisi veya fiziksel telefon testinin yerine geçmez.

Son koşu: 31 Node ve 15 Python testi başarılı. Scraper çalıştırılmadı; tarihsel veri, koordinat ve katalog durumu değiştirilmedi. Commit, push ve yayın yapılmadı.

## Harita kullanım akışı — son geliştirme

Ana haritanın üstüne JavaScript gerektirmeyen details/summary kullanım rehberi eklendi. Arama, zaman görünümü, katmanlar ve ayrıntı sayfasına geçiş açıklanıyor. Ayrıntılı kullanım rehberi ve kronoloji bağlantıları mevcut. nasil-okunur/index.html mevcut denetimlerle eşleştirildi; klavye kullanımı ve işaret harfleri açıklandı. Yeni tarihsel iddia veya koordinat yazılmadı.

Başlangıç görünümü düğmesi mevcut OM.center ve OM.defaultZoom değerlerini kullanır. Seçili olay, zaman, süzgeç ve katman durumları değiştirilmez. Harita yokken devre dışıdır; buna ilişkin mevcut haritasız çalışma testine kontrol eklendi. Harita üzerinde tekerlek hareketiyle istemeden yakınlaşma kapatıldı; yakınlaştırma düğmeleri korunuyor.

375 × 812 iframe görünümünde gerçek ana sayfada rehber açılışı kontrol edildi. Kampanya modu ve bir sonraki olay seçildikten sonra Başlangıç görünümü çalıştırıldı: mod Kampanya, zaman çubuğu 1 ve seçili bilgi başlığı aynı kaldı; görünüm dönüşü durum mesajı oluştu. Görsel map-guide-mobile.png. Fiziksel cihaz veya dokunma jesti ölçümü değildir.

Değişen uygulama dosyaları: index.html, js/app.js, css/style.css ve nasil-okunur/index.html. Ana sayfa stil/betik sürümü v=20261016h. Testler 31 Node ve 15 Python başarılı. Yerel sunucu kontrol sonunda durduruldu. Commit, push ve yayın yapılmadı.

## Öncelikli tek açık iş listesi

### 1. Belge düzeyinde tarihsel kanıtlar — açık

Mevcut araştırma kataloğunda 26 satır var: 15 bulundu, 6 metadata_kontrol_edildi, 5 insan_incelemesi_gerekli. iddia_destegi=true olan satır yok. Bunlar katalog durumu sayımlarıdır; yanlış iddia sayısı değildir. Katalog salt okunur incelendi ve değiştirilmedi.

Saatli kronoloji ve anlatılarda kesin saatler, sayılar, zayiat ve emir ayrıntıları mevcut. Kurum çerçevesi uyarısının bulunması bu ayrıntıları tek tek doğrulamaz. Her iddia için belge URL’si, kanıt metni, tarih ve doğrulama durumu eşleştirilmelidir. Bu çalışmada iddiaların doğru/yanlış olduğu yeniden araştırılmadı; yalnız mevcut kanıt eksikleri saptandı. Kaynaklar açılmadan doğrulama durumu yükseltilmemeli.

16 Mart Carden ayrılışı ile 17 Mart de Robeck görev kaydı ayrı kalmalı. Önceki araştırma listesindeki Nusret mayın sayısı, Ocean kaydı ve çelişkili zayiat ifadeleri belge incelemesiyle kapatılmalı. Ayrıntılı araştırma dayanağı research/gelibolu/sonraki-adimlar.md ve research/ux-audit/historical-data-issues.md dosyalarıdır. Scraper çalıştırılmadı; yeni koordinat veya tarihsel kayıt üretilmedi.

Kapanış koşulu: iddia-belge eşleştirmesi tamamlanmış ve kaynak eksikleri kullanıcıya görünür olmalı. Kaynak kataloğu şeması korunmalı.

### 2. Fiziksel telefon ve yardımcı teknoloji testi — açık

Gerçek Android/iOS cihazda harita sürükleme/yakınlaştırma, dikey-yatay geçiş, sanal klavye açıkken arama, menü, saat çubuğu ve olaydan haritaya dönüş denenmeli. Ekran okuyucuyla gezinme ve odak sırası ayrıca kontrol edilmeli. Masaüstü iframe kontrolü bunların yerine geçmez.

Kapanış koşulu: cihaz/tarayıcı bilgisiyle sonuç kaydı ve engelleyici sorun kalmaması.

### 3. Performans ölçümü — açık

16 Ekim 2026 Lighthouse mobil laboratuvar ölçümü tamamlandı: canlı performans 55, erişilebilirlik 100; son yerel sürüm performans 52, erişilebilirlik 100. Toplam hız kazanımı doğrulanmadı. Yazı tipi yüklemesi ve ön bağlantı değişiklikleri yerelde tutuldu. Brotli ve statik dosya önbelleği canlıda doğrulandı. INP saha ölçümü ve fiziksel cihaz testi açık. Ayrıntılar: research/performance/2026-10-16/olcum-raporu.md.

Kapanış koşulu: aynı ortamda ölçüm kaydı; varsa başarısızlıkların kanıtına göre iyileştirme. Rastgele CSS/JS silinmemeli.

### 4. Ağ kesintileri ve dış bağlantılar — açık

Mevcut otomatik paket harita kütüphanesi yokken atlasın ve prototip kronolojisinin davranışını kapsar. Gerçek tarayıcıda karoların kısmi kesintisi, yazı tipi/CDN kesintisi ve yavaş bağlantı kombinasyonları henüz kapsamlı denenmedi. Dış belge bağlantıları bu turda topluca istenmedi. Kaynakça sayfasının kendi eski menü kodu, kataloğa dokunmama sınırı nedeniyle korunuyor; gezinme tutarlılığı ayrı bir arayüz işi olarak ele alınabilir.

Kapanış koşulu: hata mesajları, yeniden deneme ve kronolojiye geçiş davranışlarının kayıtlı testleri.

### 5. Yayın öncesi kullanıcı incelemesi — açık

Yeni hero mevcut kontrol panellerini korumak için prototipteki yan yana düzenden farklı olarak ana haritanın üstüne uyarlandı. Bu yerel son görünüm kullanıcı tarafından incelenmeli. Prototip ve araştırma/QA dosyaları yayın paketine yanlışlıkla dahil edilmemeli; archive/ GitHub’a gönderilmemeli. Harita sağlayıcı atıfları ve mevcut analitik tekilliği korunmalı.

Kapanış koşulu: incelenmiş dosya listesi ve ayrıca açık commit/push/yayın onayı. Mevcut devam talebi yayın onayı olarak yorumlanmadı.

## Sonuç

Yerel bağlantı taraması ve mevcut otomatik paketler başarılı. Üç odak/menü davranışı düzeltildi. Bu durum tarihsel doğrulamanın, fiziksel cihaz testinin veya performans ölçümünün tamamlandığı anlamına gelmez. Sıradaki en önemli iş belge düzeyindeki iddia doğrulama planıdır; kaynak kataloğu ve scraper sınırları korunmalıdır.


## 16 Ekim 2026 — karo kesintisi davranışı

Karo yeniden denemesi yalnız açık taban katmanına uygulanıyor. Uyarı başarısız yeniden denemede kalıyor; hatasız yükleme tamamlandığında kaldırılıyor. Kapalı katmanın hatası uyarı üretmiyor. Uyarı harita çerçevesi içinde tutuldu; sonraki bölüme taşmıyor.

32 Node ve 15 Python testi başarılı. Yeni davranış testi hata, tekrarlı hata, başarısız yeniden deneme, başarılı yükleme ve kapalı katmanı kapsıyor. Tarayıcıda research/ux-audit/network-check/ fixture'ı yalnız Esri adresini yerel bulunamayan bir adrese yönlendirerek kesintiyi benzetti; işaretler, kontroller ve kronoloji kaldı. Yeniden deneme sonrası uyarının kaldığı doğrulandı. Başarılı toparlanma otomatik olay testiyle doğrulandı; gerçek ağın düzelmesi ayrıca tarayıcıda denenmedi. Görsel: network-check/karo-kesintisi.png. Fiziksel telefon, font/CDN kesintisi ve yavaş ağ kombinasyonları açık. Fixture yayın kapsamı dışında. Scraper, arşiv, katalog ve tarihsel veri değiştirilmedi. Commit, push veya yayın yapılmadı.

## 16 Ekim 2026 — JavaScript ve Leaflet kesintileri

Ana sayfaya JavaScript kapalıyken görünen harita/kronoloji açıklamaları ve olay listesi/rehber bağlantıları eklendi. Bu durumda boş harita, zaman çubuğu, arama ve boş dinamik listeler gizleniyor. Ana sayfa mobil menü bağlantıları, menü kodu bağlanana kadar görünür; çalışmayan Menü düğmesi gösterilmiyor. Geçiş bağlantısı #harita bölümüne yöneliyor; bu hedef JavaScript olmadan da mevcut.

Tarayıcıda 375×900 sandbox iframe içinde betikler kapatıldı. Menü bağlantıları ve fallback metni görünür; Olay listesine git bağlantısı /olaylar/ sayfasını açtı. Görsel network-check/no-script-home.png. Ayrı no-leaflet.html fixture'ında yalnız Leaflet betiği bulunamayan yerel adrese yönlendirildi: hata mesajı ve yeniden deneme düğmesi geldi; camp-list ve event-list dolu kaldı. Bu testler fiziksel telefon/dokunma testi değildir. Gerçek font/CDN yavaşlığı ve ağın toparlanma kombinasyonları açık.

Değişen uygulama dosyaları: index.html, css/style.css, js/app.js. 32 Node ve 15 Python testi başarılı. Yerel kontrol sunucusu durduruldu. Araştırma fixture'ları yayın kapsamı dışında. Tarihsel veri, kaynak kataloğu, scraper ve arşiv değiştirilmedi. Commit, push veya yayın yapılmadı.

## 16 Ekim 2026 — arama ve klavye

Ana atlas aramasına sonuç sayısı, iki karakter yönlendirmesi ve boş sonuç mesajı eklendi (role=status). Yukarı/aşağı oklar arama alanı ve sonuç düğmeleri arasında geçiyor; Escape önce sonuçları kapatıyor ve sonuç içinden arama alanına dönüyor. Seçimden sonra odak kapanan sonuç düğmesinde kalmak yerine seçili kaydın başlığına geçiyor. Başlangıç/oynatma işlemleri odağı taşımıyor.

Yeni otomatik test boş sonuç, kısa sorgu, sonuç sayısı, ok tuşları, Escape ve seçim odağını kapsıyor. 33 Node ve 15 Python testi geçti. Masaüstü tarayıcıda zzzz boş mesajı, Arıburnu için 8 sonuç, ArrowDown ve Enter sonrası panel-title odağı doğrulandı. Görseller search-empty.png ve search-keyboard.png. Bu tur fiziksel telefon, ekran okuyucu veya olay sayfasından dönüş akışı ayrıca denenmedi; açık iş olarak kalıyor. Kaynaklar/veriler değiştirilmedi. Commit, push ve yayın yapılmadı.

## 16 Ekim 2026 — olaydan haritaya dönüş ve panel odağı

Masaüstü bilgi panelinin flex ile sıkışması önlendi: panel kendi içindeki dar bir kaydırma alanı yerine kontrol sütununun kaydırmasını kullanıyor. Panel içindeki odak kapanışta gizli/inert içerikte bırakılmıyor; 1099 piksel ve altında Ara düğmesine, geniş görünümde arama alanına dönüyor. Odak panel dışında olduğunda taşınmıyor.

Yeni test geniş/dar görünüm ve panel dışındaki odağın korunmasını kapsıyor. 34 Node ve 15 Python testi geçti. 375×900 iframe içinde Arıburnu olay sayfasındaki Haritada göster bağlantısı tıklandı: Arıburnu çıkarması paneli ve Kampanya modu seçildi. Panel metni, kaynak uyarısı ve ayrıntı bağlantısı görünür. Kapatma düğmesi odağı Ara düğmesine döndürdü. Görseller mobile-event-return.png ve mobile-event-panel.png. Fixture network-check/mobile-event-return.html yayın kapsamı dışında. Bu, fiziksel telefon veya ekran okuyucu testi değildir. Masaüstü panel CSS değişikliği bu tur ayrıca görsel ölçülmedi; otomatik paket geçti.

Tarihsel bilgi, koordinat, katalog, arşiv ve scraper değiştirilmedi. Yerel sunucu durduruldu. Commit, push ve yayın yapılmadı.

## 16 Ekim 2026 — daraltılmış masaüstü paneli

Harita işareti, hat veya arama/kronoloji kaydı seçildiğinde daraltılmış kontrol paneli açılıyor. Düğmenin metni ve aria-expanded değeri eşzamanlı güncelleniyor; Leaflet boyutu yenileniyor. Otomatik zaman akışının fillPanel çağrıları paneli zorla açmıyor. Yeni birim testi yeniden açmayı, erişilebilir düğme durumunu ve zaten açıkken gereksiz boyut yenilememeyi kapsıyor. Arama testinin bağımlılık taklidi yeni yardımcı işleve uyarlandı.

35 Node ve 15 Python testi başarılı. Masaüstü tarayıcıda Gizle ile panel daraltıldı, Kilitbahir işareti tıklandı; panel açıldı ve ilgili mevcut saat kaydı seçildi. Kontrol sütunu kaydırılarak başlık, metin, yaklaşık konum/kaynak uyarısı ve ayrıntı bağlantısı okundu. Önceki masaüstü panel CSS düzeltmesinin görsel kontrolü de bu tur tamamlandı. Görsel desktop-panel-reopen.png. Tarihsel içerik/koordinatlar/katalog/arşiv/scraper değiştirilmedi. Commit, push veya yayın yapılmadı. Yerel sunucu durduruldu.

## 16 Ekim 2026 — menü ve görünüm geçişleri

Ana sayfa menüsü dış tıklamayla ve 860 piksel eşiği geçilince kapanıyor. Dar görünüme geçişte gizlenecek menü bağlantısındaki odak Menü düğmesine döner; geniş görünümde görünür bağlantıdaki odak korunur. Ara/Süzgeç/Katman araçlarının 1099 piksel eşiği geçilince açık durumları temizlenir. Gizlenen içerikte odak varsa araç düğmesine; geniş görünümde gizlenen araç düğmesindeyse ilgili giriş/kontrol üzerine aktarılır. Gerekirse daraltılmış masaüstü sütunu açılır.

37 Node ve 15 Python testi başarılı. Yeni testler ana sayfa menüsü dış tıklama/ekran geçişi ile araç odağının iki yönde aktarılmasını ve ilgisiz odağın korunmasını kapsıyor. Tarayıcıda 375/1200 piksel iframe geçişi, açık aramanın kapanması, menü açma ve dış tıklamayla kapatma doğrulandı. Fixture düğmeleri dış belgedeki odağı aldığından tarayıcı kontrolü odak aktarımını kanıtlamaz; bu davranış otomatik testte doğrulandı. Fiziksel cihaz ve ekran okuyucu testi açık. Görsel mobile-menu-resize.png. Fixture network-check/resize-home.html yayın kapsamı dışında.

Tarihsel veriler, koordinatlar, katalog, scraper ve arşiv değiştirilmedi. Commit, push veya yayın yapılmadı. Yerel sunucu durduruldu.

## 16 Ekim 2026 — kaynak doğrulama kapısı

js/model.js içindeki yalnız sayfa/belge numarasına dayanan yükseltme kaldırıldı. Kayıt düzeyindeki isteğe bağlı evidence verisi; recordId, kaynak kimliği, gösterilen ifadeyle birebir claim eşleşmesi, evidenceText, geçerli YYYY-MM-DD tarih ve açık iddia_dogrulandi durumu gerektiriyor. Kaynak ayrıca belge kapsamlı ve claimSupport=true olmalı; sayfa/belge numarası dolu, mutlak HTTP(S) belge bağlantısı kanıtla aynı olmalı. Ana alan adı/kök adres, göreli adres, güvensiz protokol ve kullanıcı bilgisi içeren adres reddediliyor. Bu yapısal denetim URL'yi açmaz veya kanıtın tarihsel doğruluğunu kendiliğinden belirlemez; insanın belge incelemesi hâlâ gerekir. Kök sorgu adresli gerçek belge sağlayıcısı için istisna tanımlanmadı; gerekirse kanıtlı ve dar bir uyarlama gerekir.

Katalog satırları/şeması, import_catalog.py, tarihsel metinler ve koordinatlar değiştirilmedi. Yeni tarihsel kanıt eklenmedi, mevcut hiçbir kayıt yükseltilmedi. Yeni alanlar kaynak kataloğunda değil, uygulama kaydına bağlanabilecek isteğe bağlı kanıt nesneleridir. Mevcut kaynaklar kurum çerçevesi olarak kalır. Ana sayfanın model betiği önbellek sürümü yenilendi.

Yeni tests/evidence.test.js yalnız yazılım denemesi için example.invalid adresli, açıkça kurmaca test nesneleri kullanıyor; bunlar sitede veya tarihsel katalogda yer almıyor. Dört yeni test: numaralarla yanlış yükseltmeme; tam kanıtın kayıt/metin bağının korunması; 21 eksik/geçersiz durumun reddi; mevcut atlas ve katalog durumunun korunması. Toplam 41 Node ve 15 Python testi başarılı. Commit, push veya yayın yapılmadı.

Öncelikli sonraki içerik işi: mevcut kesin tarih/saat, mayın sayısı, batış/zayiat ve komuta ifadelerini belge düzeyinde eşleştirmek. Teknik kapı kapanmış olsa da ayrıntılı eksik listesindeki tarihsel doğrulama maddesi açıktır.

## 16 Ekim 2026 — 18 Mart sayfası kaynak notları

18 Mart olay sayfasına önceki yerel araştırmada bulunan IWM HU 103301 ve Q 21399 fotoğraf künyelerinin doğrudan bağlantıları ve kısa alıntıları eklendi. Kaynak: research/gelibolu/arsiv/iwm/tarama.json, önceki araştırma tarihi 15 Ekim 2026. Bu tur web aracında her iki kurum URL'si 403 verdi; yeni belge doğrulaması yapılmış sayılmadı. Sayfada önceki kayıt/yeniden erişim ayrımı ve kanıt sınırları yazıldı. Ocean/Inflexible/Gaulois, Nusret, komuta tarihleri ve saatli kronoloji için açık belge ihtiyaçları ayrı listelendi. Genel kaynak paragrafı eklenen künyelerle çelişmeyecek biçimde düzenlendi.

Önceki turda 16 Mart Carden ayrılışı ile 17 Mart de Robeck görev kaydı ayrıldı; yeni atama tarihi üretilmedi. Bu tur tarihsel olay/koordinat veya kesin sayı eklenmedi. Katalog, scraper, ham arşiv ve eski araştırma kayıtları değiştirilmedi. Kurum sayfaları erişilemediği için yeni iddia_dogrulandi etiketi verilmedi. 41 Node ve 15 Python testi başarılı. Yerel tarayıcıda kaynak notu okunabilirliği kontrol edildi; görsel 18-mart-kaynak-notu.png. Commit, push veya yayın yapılmadı; yerel sunucu durduruldu.

## 16 Ekim 2026 — Ocean ve Inflexible kaynak karşılaştırması

Bu tur doğrudan açılan kaynaklar: AWM A02360 (https://www.awm.gov.au/collection/C1004447) ve DVA Anzac Portal Dardanelles strategy and naval operations (https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/dardanelles-strategy). AWM fotoğraf künyesi Ocean için mayınla batış ve 18 Mart 1915 diyor. Fotoğrafın Ocak 1915/Süveyş bilgisi olay tarihiyle karıştırılmadı. DVA Nusret bölümünde Ocean mayın isabetini ihtimalli, Inflexible ağır hasar ve Boğaz'dan çıkışını kesin anlatıyor. Bu fark 18 Mart sayfasında bağlantı, kısa kanıt alıntısı, inceleme tarihi ve kaynak-metni-incelendi durumu ile gösterildi. Ocean hakkındaki kesin yedekleme/gece batış cümlesi bu kaynaklarla kanıtlanmadığından daha sınırlı, kaynak notuna bağlı ifadeyle değiştirildi. Saatli atlas verisi değiştirilmedi; o akışın ayrıntıları ayrıca açık.

Sayfanın tamamı veya veri modeli doğrulanmış etiketine yükseltilmedi. Gaulois için bu tur uygun doğrudan kanıt bulunmadı. Önceki araştırmanın 'Ocean kaydı bulunamadı' sonucu tarihli geçmiş kayıttır; yeni bulgu bu raporda, eski arşiv/katalog değiştirilmeden kaydediliyor. Görsel ocean-kaynak-notu.png. 41 Node ve 15 Python testi başarılı. Yerel kaynak bölümü tarayıcıda kontrol edildi. Scraper çalıştırılmadı; katalog, koordinat ve ham arşiv değişmedi. Commit/push/yayın yapılmadı; yerel sunucu durduruldu.

## 16 Ekim 2026 — Gaulois rapor çevrimyazısı

Naval-History.Net WW1Battle1503Dardanelles2.htm sayfasında 17–18 Mart raporunun hasarlı gemiler bölümü açılarak okundu. Sonunda de Robeck/24 Mart 1915 verilen aktarım Gaulois için Drepano kuzeyi ve top ateşi hasarı diyor. Kaynak bir rapor çevrimyazısıdır; orijinal belge görüntüsü veya Gazette sayfasıyla karşılaştırma yapılmadı. Sayfaya doğrudan bağlantı, kısa alıntı, erişim tarihi ve bu sınır eklendi. Mevcut Tavşan Adası/karaya oturtma anlatımı kaynaktaki Drepano adıyla ve rapora atıfla daraltıldı. Drepano/Tavşan ad eşleştirmesi veya harita koordinatı bu işlemle doğrulanmadı; koordinatlar ve atlas verileri değişmedi. Tam doğrulama etiketi verilmedi.

41 Node ve 15 Python testi başarılı. Yerel kaynak bölümü tarayıcıda kontrol edildi; görsel gaulois-kaynak-notu.png. Katalog, scraper ve ham arşiv değiştirilmedi. Commit, push veya yayın yapılmadı; yerel sunucu durduruldu.

## 16–17 Ekim 2026 — Nusret içeriği

16 Ekimde AWM C1068416/P04411.003 ve Tarihi Alan Başkanlığının 8 Mart 2025 tarihli Nusrat tören haberi açıldı. Tarih/sayı için doğrudan bağlantı, kısa alıntı ve kaynak türü Nusret sayfasına eklendi. AWM içinde aktarılan Reeder raporu özgün belgeyle karşılaştırılmış sayılmadı. Desteksiz kuzey–güney ifadesi kaldırıldı; kıyıya paralel anlatısı kaynaklandırıldı. Tekrarlı ve bu tur belgelenmeyen geniş anlatım, kapsamı belirtilen daha kısa metne dönüştürüldü. 18 Mart sayfasından Nusret kaynak notuna bağlantı eklendi. Mevcut koordinatlar/hat geometrisi, katalog, scraper ve ham arşiv değişmedi. Tam doğrulama etiketi verilmedi. 41 Node ve 15 Python testi geçti. Yerel kaynak notunun tarayıcı görüntüsü nusret-kaynak-notu.png; görsel kayıt 17 Ekimde tamamlandı. Commit/push/yayın yapılmadı.

## 17 Ekim 2026 — Arıburnu çıkarma anlatısı

AWM Dawn of the Legend/The landing ve A hard and bloody day sayfaları doğrudan açıldı. Kurum sergi anlatıları ilk sırtlara çıkış ile uzak harekât hedeflerini ayırıyor; kıyıya bakan savunma hattında tutunmayı anlatıyor. Arıburnu sayfasındaki iç kesime yayılamama ve sırta sahip olmama genellemeleri bu ayrımı koruyacak biçimde daraltıldı. Tekrarlı son paragraf yerine aşamaları ayıran açıklama ve 18 Mart/Seddülbahir geçişleri eklendi; ihtiyattdır yazımı düzeltildi. İki kaynak URL'si, kısa kanıt alıntıları, 17 Ekim inceleme tarihi ve sergi-metni-incelendi/harp-ceridesi-açık durumu sayfada görünüyor. 27./57. alay hareketleri ve komuta ayrıntıları bu kaynaklarla tümüyle doğrulanmadı; açık ihtiyaçlar belirtildi.

41 Node ve 15 Python testi başarılı. Son yerel kaynak bölümü tarayıcıda kontrol edildi; görsel ariburnu-kaynak-notu.png. Mevcut harita/olay bağlantıları korundu. Yeni sayı veya koordinat eklenmedi; katalog, scraper, ham arşiv ve atlas verileri değiştirilmedi. Commit, push veya yayın yapılmadı; yerel sunucu durduruldu.

## 17 Ekim 2026 — Seddülbahir çıkarma içeriği

AWM The British landings sergi metni ve bağlantılı H10284/C318260 fotoğraf kaydı doğrudan açılarak okundu. Beş kumsal, 29. Tümen görevi ve V'de River Clyde anlatısı kaynak URL'si/kısa kanıt/inceleme tarihi ile sayfaya bağlandı. Tekrarlı son paragraftaki bütün kumsalların aynı akşam birleşmiş tek hat oluşturduğu genellemesi kaldırıldı; kıyıya çıkış ve harekât hedefleri ayrıldı. Arıburnu ve Kumkale bağlantıları eklendi. H10284 kaydının 6 Mayıs tarihli olması açıkça belirtildi; 25 Nisan ilk anı gibi kullanılmadı, görsel indirilmedi.

S/X/Y gelişmeleri, Osmanlı birlik dağılımı, Fransız geçiş takvimi/komuta değişiklikleri açık kaldı; sayfa tümüyle doğrulanmış yapılmadı. 41 Node ve 15 Python testi geçti. Yerel kaynak bölümü tarayıcıda kontrol edildi; görsel seddulbahir-kaynak-notu.png. Katalog, scraper, ham arşiv ve koordinatlar değiştirilmedi. Commit/push/yayın yapılmadı; yerel sunucu durduruldu.

## 17 Ekim 2026 — Kumkale zaman ayrımı

National Army Museum Gallipoli campaign ve Corbett Naval Operations II çevrimyazısı doğrudan açılarak okundu. Oyalama amacı kaynaklandı; çevrimyazının 27 Nisan bağlamındaki önceki gece çekilme anlatısı not edildi. Kumkale sayfasındaki bir-gün/26-Nisan-tam-geçiş genellemeleri çıkarma başlangıcı, geri çekilme ve yeniden karaya çıkış aşamalarına ayrıldı. Bağlantılı Seddülbahir metni ve js/campaign.js Kumkale özeti de aynı kesin-ertesi-gün iddiasını taşımayacak şekilde düzeltildi; ana sayfa campaign önbellek sürümü yenilendi. Tarih kartı başlangıç olarak kaldı; yeni saat/koordinat/mevcut/zayiat üretilmedi. SHD envanter PDF'si açılamadı, kanıt olarak eklenmedi.

Kaynak URL'leri, kısa alıntılar, tarih ve inceleme sınırları sayfada. Fransız birliklerinin tek tek varış takvimi ve Osmanlı tümen dağılımı açık kaldı; tam doğrulama etiketi yok. 41 Node ve 15 Python testi başarılı. Yerel tarayıcı kontrolü ve kumkale-kaynak-notu.png kaydı tamamlandı. Katalog, scraper ve ham arşiv değişmedi. Commit/push/yayın yapılmadı; yerel sunucu durduruldu.

## 17 Ekim 2026 — Birinci Kirte içeriği

NAM First Battle of Krithia kronolojisi ve NZHistory Stalemate/Battle of Krithia bölümü doğrudan açıldı. Tarih/hedef/sonuç, URL/kısa kanıt/tarih/inceleme durumu ile sayfaya bağlandı. Kumkale'den Fransız geçişinin kesin 26 Nisan cümlesi kaldırılarak önceki kaynak notuna bağlantı verildi. Gün sonu hattının 25 Nisanla aynı olduğu genellemesi daraltıldı; tekrarlı kumsal-kol anlatımı yerine hedef/sonuç ve önceki-sonraki olay bağlantıları eklendi. Osmanlı birliklerinin ayrıntılı hareketleri ve emirler açık kaldı. Aramada AWM E84355 tarih alanı 2015 göründüğünden doğrulama için seçilmedi; kayıt uydurma tarihle düzeltilmedi, bu kaynak sayfaya eklenmedi.

41 Node ve 15 Python testi başarılı. Yerel kaynak bölümü tarayıcıda kontrol edildi; birinci-kirte-kaynak-notu.png kaydedildi. Mevcut koordinatlar, katalog, scraper ve ham arşiv değişmedi. Tam doğrulama etiketi verilmedi. Commit/push/yayın yapılmadı; yerel sunucu durduruldu.

## 17 Ekim 2026 — İkinci Kirte içeriği

AWM E84361 ve DVA early-battles metni doğrudan açıldı. 6–8 Mayıs aralığı, 6 Mayıs başlangıcı ve 8 Mayıstaki Yeni Zelanda/Avustralya katılım aşamaları ayrı ele alındı. Arada muharebe yok/cephe yerinden oynamaz genellemeleri ve her akşam aynı sipere dönüldüğünü söyleyen tekrarlı paragraf kaldırıldı. Kaynaklar sınırlı ilerleme ile hedeflere ulaşamama ayrımını destekliyor. İki URL, kısa kanıtlar, tarih ve kurum-metni-incelendi/ceride-açık durumu sayfaya eklendi. NZHistory yeniden açma denemesi hata verdi; NSW Anzac Memorial bot doğrulaması istedi. Bu sayfalar yeni kanıt gibi kullanılmadı, engeller aşılmadı.

41 Node ve 15 Python testi başarılı. Yerel kaynak bölümü tarayıcıda kontrol edildi; ikinci-kirte-kaynak-notu.png kaydedildi. Osmanlı dağılımı/komuta emirleri açık kaldı; mevcut, zayiat ve koordinat eklenmedi. Katalog/scraper/ham arşiv değişmedi. Commit/push/yayın yapılmadı; yerel sunucu durduruldu.

## 17 Ekim 2026 — Üçüncü Kirte içeriği

AWM E84365 ve NAM third-battle-krithia sayfaları doğrudan açılıp okundu. 4 Haziran başlangıcı ile izleyen karşı saldırılar ayrıldı. Son-büyük-taarruz genellemesi üç Kirte adlandırmasının sırasıyla sınırlandı; tekrar paragrafı hedef/sonuç ve Zığındere/Kerevizdere geçişleriyle değiştirildi. İki URL/kısa kanıt/tarih/kurum-metni-incelendi durumu eklendi. Ayrıntılı mevzi ve komuta kayıtları açık kaldı. 41 Node ve 15 Python testi başarılı. Yerel kaynak bölümü kontrol edildi; ucuncu-kirte-kaynak-notu.png kaydedildi. Katalog/scraper/ham arşiv ve koordinatlar değişmedi; tam doğrulama etiketi yok. Commit/push/yayın yapılmadı; yerel sunucu durduruldu.


## 17 Ekim 2026 — Zığındere içeriği

- Tekrarlanan ve kanıtsız dere tabanı/siper/komuta anlatısı, NAM kronolojisi ve NAM. 1984-07-41-2 koleksiyon açıklamasına dayalı kısa metinle değiştirildi.
- Doğrudan URL, kısa kanıt alıntısı, inceleme tarihi ve doğrulama sınırı eklendi. Sınırlı kazanım ile hattın hiç değişmediği iddiası ayrıldı.
- İlgili olay bağlantıları ve harita bağlantısı korundu; yeni koordinat, mevcut veya zayiat eklenmedi. Katalog, scraper ve ham arşiv değiştirilmedi.
- 41 Node ve 15 Python testi geçti; tarayıcıda görsel kontrol bu adımda yapılmadı. Commit, push veya yayın yapılmadı.


## 17 Ekim 2026 — Toplu içerik incelemesi ve canlı yayın

55 tarihsel sayfa inceleme dizinine alındı; 27 kaynak notu ve doğrulama sınırları eklendi. Kerevizdere aşamaları, tahliye komutası, Rafet kimliği ve kronoloji boşlukları düzeltildi. 44 Node + 15 Python testi geçti. Açık kullanıcı yayın izniyle 72 dosya güncellendi; 76/76 yayın dosyası HTTP ve özet eşleşmesiyle doğrulandı. Ayrıntılar: research/deployment/2026-10-17-content/yayin-raporu.md. Bu, bütün ayrıntıların harp ceridesiyle doğrulandığı anlamına gelmez. Commit/push yapılmadı.


## 17 Ekim 2026 — Geçersiz bağlantı ve arama kapsamı

Geçersiz/boş olay veya mevki parametresi ve bilinmeyen event hash bağlantısı, artık kayıt bulunamadı mesajı ve olay listesi/başlangıç bağlantıları gösteriyor. Kullanıcı girdisi HTML veya mesaj içeriği olarak yansıtılmıyor. Geçersiz olayın sessizce geçerli başka bir mevkiye düşmesi engellendi. Geçerli derin bağlantı davranışı korundu.

Arama tüm eşleşmeleri sayıyor; ekranda en çok sekiz düğme gösterilirken gerçek toplam ve daraltma önerisi bildiriliyor. Aralık notları olay aramasından çıkarıldı. Olay dizinindeki eski büyük-muharebe-yok açıklaması önceki kaynak incelemesiyle tutarlı hale getirildi.

47 Node ve 15 Python testi geçti. Yerel gerçek tarayıcıda geçersiz bağlantı mesajı, Arıburnu kaydı ve 1915 sorgusunda 33 eşleşme/8 düğme doğrulandı. İncelenen dar görünümde yatay taşma yoktu; konsol hata kaydı boştu. Ekran görüntüsü servisi yakalama hatası verdi; bu tur için görsel kayıt üretilemedi. Fiziksel telefon veya ekran okuyucu testi yapılmadı.

Değişiklikler yerel. Commit, push veya yeni yayın yapılmadı. Kaynak kataloğu, scraper, ham arşiv ve tarihsel koordinatlar değiştirilmedi.


## 17 Ekim 2026 — Paylaşılabilir olay listesi

Olay listesinin q ve bolum parametreleri arama/bölüm seçimini açılışta uygular. Yazma ve seçim replaceState ile adresi günceller; her tuş için ayrı geçmiş kaydı açılmaz. Temizle yalnız bu iki parametreyi kaldırır, diğer parametreler, hash ve mevcut history.state korunur. popstate/pageshow bağlantı durumunu yeniden uygular. Geçmiş erişimi başarısız olsa da süzgeç çalışır. Arayüze kısa paylaşım açıklaması eklendi; yeni JS/CSS sürüm parametreleri ayarlandı.

51 Node ve 15 Python testi geçti. Gerçek yerel tarayıcıda Arıburnu/Tahliye bağlantısı 1 kayıt açtı; olay sayfasından Geri ile aynı liste korundu. Temizle 28 olayı ve arama odağını geri getirdi. Kirte/Kara seçimi URLye yazıldı ve 3 kayıt gösterdi. 390 pikselde belge genişliği 375; yatay taşma yok. Görüntü yakalama servisi hata verdiği için ekran görüntüsü kaydedilemedi. Fiziksel telefon/ekran okuyucu testi yapılmadı.

Bu geliştirmeler yerel; commit, push ve yayın yapılmadı. Tarihsel içerik, koordinatlar, katalog, scraper ve ham arşiv değiştirilmedi.


## 17 Ekim 2026 — Atlas kaydı ve zaman bağlantıları

Seçili panelde kampanya olayı ve bağımsız mevki kartı için Bu kayda bağlantı; deniz kronolojisi için Bu zamana bağlantı eklendi. Bağlantılar olay/mevki kimliği veya dakika parametresini taşır. Deniz kronolojisinde aynı dakikada birden fazla kayıt olabildiğinden zaman bağlantısı tek olay kimliği gibi etiketlenmez. Yeni dakika parametresi yalnız mevcut zaman kayıtlarını kabul eder; geçersiz sayısal değer kayıt uydurmadan açıklanır. Genel adres geçmişi, süzgeçler, yakınlaştırma ve katmanlar bu bağlantıya dahil değildir.

52 Node + 15 Python testi geçti. Yerel tarayıcıda dakika=510 ile 08:30, olay=e-ari ile Arıburnu çıkarması ve mevki=kolordu-3 ile bağımsız 3. Kolordu kartı açıldı; paneldeki bağlantıların adresleri doğrulandı. Ark Royal gibi saatli kaydı olan mevkilerin önceki davranışı korundu: ilgili kronoloji kaydı açılır. Konsol hata listesi boş. Ekran görüntüsü servisi yakalama hatası verdi, görsel kaydedilemedi.

Commit, push veya yayın yapılmadı; değişiklikler yerel. Tarihsel veri, koordinat, kaynak kataloğu, scraper ve ham arşiv değiştirilmedi.


## 17 Ekim 2026 — Aynı saatli kronoloji kayıtları

showTime, seçilen kayıt nesnesini aynı dakika ve etkin süzgeç içinde doğrulayarak açıyor. Liste ve arama seçimleri artık aynı dakikanın son kaydıyla ezilmiyor. İleri/geri ve oynatma görünür kayıt sırasını izliyor; aynı saatli kayıtlar atlanmıyor. Görünüm ve taraf değişiminde geçerli seçim korunuyor. Zaman çubuğuyla genel dakika seçiminin önceki son-kayıt davranışı sürüyor.

Deniz kaydının paylaşım bağlantısı dakika yanında başlıktan üretilen deniz anahtarını taşıyor; mevcut dakika bağlantıları çalışmaya devam ediyor. Tanınmayan dakika/başlık çifti sessizce başka kayıt açmıyor. Başlık değişirse eski başlık anahtarı bulunamadı durumuna düşebilir; mevcut veriye yeni tarihsel kimlik eklenmedi.

54 Node ve 15 Python testi geçti. Gerçek yerel tarayıcıda iki 09:00 kaydı arasında ileri/geri, tam kayıt paylaşım adresi ve Kampanya→18 Mart geçişinde seçimin korunması doğrulandı; konsol hata kaydı boş. Ekran görüntüsü servisi yakalama hatası verdi, yeni görüntü kaydedilemedi.

Değişiklikler yerel. Commit, push veya yayın yapılmadı. Tarihsel kayıtlar, koordinatlar, kaynak kataloğu, scraper ve ham arşiv değiştirilmedi.


## 17 Ekim 2026 — Oynatma ve süzgeçte seçim tutarlılığı

Önceki stepTime düzenlemesinin zamanlayıcıdan da stopPlay çağırarak ilk adımda oynatmayı durdurması düzeltildi. Zamanlayıcı adımları oynatmayı sürdürür; elle ileri/geri seçimi durdurur. Gerçek Oynat düğmesi zamanlayıcı bağlantısını ve ardışık adımları kapsayan regresyon testleri eklendi.

Kampanya seçimi nesne kimliğiyle izlenir; süzgeç sonrası hâlâ listede olan olay korunur. Çıkarılan olay yerine ilk görünür olay seçilir. Boş kampanya veya seçilen deniz saatinden önce kayıt bulunmaması halinde eski panel kapanır. Görünüm değişimi kampanya seçimini yeniden eşler.

58 Node ve 15 Python testi geçti. Yerel gerçek tarayıcıda oynatma birden fazla adım boyunca sürdü (12:00 görünümünde aria-pressed=true); elle seçimle durdu. Arıburnu kaydı seçilip Kara süzgeci değiştirildiğinde aynı kayıt korundu. Konsol hata listesi boş. Görsel yakalama servisi hata verdiği için ekran görüntüsü kaydedilemedi. Fiziksel cihaz/ekran okuyucu kontrolü yapılmadı.

Değişiklikler yerel; commit, push ve yayın yapılmadı. Tarihsel veri, kaynak kataloğu, koordinatlar, scraper ve ham arşiv değiştirilmedi.


## 17 Ekim 2026 — Elle seçim ve arka plan oynatması

Harita işareti, arama sonucu ve kronoloji listesinden elle seçim artık oynatmayı durdurur; zamanlayıcı seçilen kartı bir sonraki adımda değiştirmez. Bağımsız kart ve kampanya odağı girişleri de aynı davranışı izler. Sayfa gizlenince veya sayfadan ayrılınca oynatma durur; geri dönmek kendiliğinden başlatmaz. Ana sayfa uygulama önbellek sürümü 20261017h oldu.

60 Node ve 15 Python testi geçti. Yeni testler gerçek mevki seçim işlevini ve visibilitychange/pagehide dinleyicilerini yürütür. Bu tur yeni görsel veya gerçek tarayıcı kontrolü yapılmadı.

Değişiklikler yerel; commit, push ve yayın yapılmadı. Tarihsel içerik, koordinatlar, kaynak kataloğu, scraper ve ham arşiv değiştirilmedi.


## 17 Ekim 2026 — Arama ve taraf süzgeci tutarlılığı

Genel arama tüm taraflardan sonuç getirirken seçili taraf süzgeci, showTime içinde aramadan seçilen deniz olayını eleyebiliyordu. Arama artık seçili kayıt dışarıda kalıyorsa tarafı İki taraf olarak açar ve tam seçilen nesneyi gösterir. Zaten görünür kayıtlar için süzgeç korunur. focusNavalEvent yalnız mevcut veri dizisindeki kayıt nesnelerini kabul eder.

Haritada mevki seçimi ise etkin taraf süzgeci içindeki olaylara bakar; o mevkide görünür olay yoksa farklı bir olay göstermek yerine mevcut mevki kartını açar. Bu işlem taraf süzgecini değiştirmez. Ana sayfa uygulama sürümü 20261017i oldu.

62 Node ve 15 Python testi geçti; iki yeni davranış yürütülen regresyon testleriyle denetlendi. Bu tur gerçek tarayıcı ve görsel kontrolü yapılmadı. Tarihsel veri, koordinat, kaynak kataloğu, scraper ve ham arşiv değiştirilmedi. Commit, push ve yayın yapılmadı.


## 17 Ekim 2026 — Salt okunur tarama kuyruğu kontrolü

Scraper'a dokunmama sınırı korunarak plan_canakkale_crawl.py eklendi. Arşiv, URL envanteri ve son HTTP raporunu okuyup önceki 404/410 adreslerini öneriden ayırır; --retry-missing bunları yeniden öneriye alır. Son yanıt esas alınır, geçici hatalar elenmez. Araç ağ isteği yapmaz, dosyaya yazmaz; mevcut scraper kuyruğunu veya kaynak katalog şemasını değiştirmez. Medya/profil/diğer sayımı URL biçimine dayanır, makale veya tarihsel doğruluk sınıflaması değildir.

Kullanım: python plan_canakkale_crawl.py --archive C:/Users/crawi/Desktop/canakkalecephesi_scraper/archive

Mevcut 506 arşiv URL'si, 1199 arşivlenmemiş bilinen URL, bunların 282'sinde son durum 404/410 ve 917 öneri adayı saptandı. 1199 sayısı önceki çalıştırmanın 1014 kalan kuyruk sayısından farklıdır: bu inceleme o çalıştırmada denenip arşivlenmeyen adresleri de içerir. Öneride 515 medya, 44 profil, 358 diğer adres var; diğer adresler makale olarak doğrulanmış değildir.

62 JavaScript ve 21 Python testi geçti. Altı yeni test: başarısız/HTML olmayan kayıtların ayrılması, son yanıt önceliği, arşiv dosyalarının hash ile değişmezliği, bozuk satırlar, alan adı sınırı ve eksik rapor şeması. Scraper kodu, ham arşiv, katalog ve site içeriği değiştirilmedi. Yeni ağ taraması, commit, push veya yayın yapılmadı.


## 17 Ekim 2026 — Araç ve olay kartı kapatma sırası

Escape açık arama/süzgeç/katman aracını kapatıp odağı kendi düğmesine döndürür; seçili olay kartını ve oynatmayı aynı basışta kapatmaz. Açık araç yokken Escape oynatmayı durdurup kartı kapatır. Kartın kapatma düğmesi de oynatmayı durdurur; zamanlayıcı kartı sonraki adımda yeniden açmaz. Menü önceliği ve panel kapanışındaki mevcut odak dönüşü korundu. Uygulama sürümü 20261017j oldu.

64 JavaScript ve 21 Python testi geçti. Yeni yürütme testleri üç araç için Escape sırasını ve kart kapatma düğmesi bağlantısını kapsıyor. Bu tur gerçek tarayıcı veya fiziksel mobil cihaz kontrolü yapılmadı. Tarihsel veri, koordinat, scraper, ham arşiv ve katalog değiştirilmedi. Commit, push ve yayın yapılmadı.


## 17 Ekim 2026 — Kronolojiden seçili karta klavye geçişi

18 Mart ve kampanya listelerinde elle olay seçimi sonrasında açık kart başlığı programatik odak alır; panel en yakın görünür alana kaydırılır. Kampanya liste seçiminde önceki haritaya kaydırma bastırılarak iki kaydırmanın yarışması önlenir. Başlık normal Tab sırasına eklenmez. Kapalı/inert karta odak verilmez. Azaltılmış hareket tercihinde kaydırma animasyonsuzdur. Otomatik oynatma, çubuk, filtre ve derin bağlantılara yeni odak çağrısı eklenmedi. Uygulama sürümü 20261017k.

65 JavaScript ve 21 Python testi geçti; yeni test odak, kaydırma tercihi ve kapalı karta odak vermeme davranışını yürütür. Gerçek tarayıcı, ekran okuyucu ve fiziksel mobil test bu tur yapılmadı. Tarihsel veri, koordinatlar, scraper, ham arşiv ve katalog değişmedi. Commit, push veya yayın yapılmadı.


## 17 Ekim 2026 — Olay listesinden karta ve listeye odak dönüşü

Elle liste seçimi kartta açan düğmeyi saklar. Kartın içinden kapatma veya Escape sonrasında düğme hâlâ bağlı, etkin ve görünürse odak o düğmeye döner. Liste süzülmüş veya yeniden çizilmişse ya da düğme gizli/inert ise mevcut görünür arama kontrolü kullanılır. Yeni kart doldurulduğunda önceki dönüş hedefi temizlenir; farklı seçime eski düğme taşınmaz. Otomatik oynatmaya yeni odak taşıma eklenmedi. Uygulama sürümü 20261017l.

66 JavaScript ve 21 Python testi geçti; yeni test görünür, kaldırılmış, gizli, inert, devre dışı ve yerleşimde bulunmayan düğme durumlarını yürütüyor. Gerçek tarayıcı ve ekran okuyucu kontrolü bu tur yapılmadı. Tarihsel veri, kaynak kataloğu, scraper ve arşiv değişmedi. Commit, push veya yayın yapılmadı.


## 17 Ekim 2026 — Atlas aramasında kalan sonuçlara erişim

İlk sekiz eşleşmeden sonra kalan sayıyı gösteren sonuç artırma düğmesi eklendi. Her basışta en fazla sekiz ek sonuç açılır ve odak yeni grubun ilk kaydına taşınır. Tüm sonuçlar açılınca düğme gizlenir. Yeni sorgu sınırı sekize döndürür; Escape veya kayıt seçimi sonuçlarla birlikte artırma düğmesini kapatır. Sessiz aralık notlarının aramaya dahil edilmemesi ve metnin güvenli textContent ile üretilmesi korundu. Uygulama sürümü 20261017m.

66 JavaScript ve 21 Python testi geçti. Mevcut arama davranış testi 11 eşleşmede 8→11 açılmasını, odak dönüşünü, yeni sorguda sıfırlamayı ve Escape/kısa sorguda düğmenin kapanmasını kapsayacak şekilde genişletildi. Bu tur gerçek tarayıcı veya fiziksel cihaz kontrolü yapılmadı. Tarihsel veri, scraper, ham arşiv ve katalog değişmedi. Commit, push ve yayın yapılmadı.


## 17 Ekim 2026 — Gerçek tarayıcı kontrolü ve kart geçişi düzeltmesi

Yerel gerçek tarayıcıda 1915 araması 33 eşleşme, ilk 8 sonuç verdi; artırma ile 16 ve dar ekranda 24 sonuç açıldı, yeni grubun ilk sonucu odak aldı. Yatay taşma yoktu. Kart liste geçişindeki yumuşak kaydırma sırasında hızlı ikinci tıklamanın üst menüye denk gelebildiği gözlendi. focusSelectedPanel kaydırması instant/start yapıldı; panel için üst menü yüksekliği +12px kaydırma payı eklendi. Oynatma akışına yeni odak değişimi eklenmedi.

İlk yeniden yükleme tarayıcı önbelleğinden eski m sürümünü gösterdi; benzersiz kontrol sorgusuyla n sürümü ve yeni CSS yüklendiği DOM üzerinden doğrulandı. 390x844 görünümde panel üstü 75.9px, menü altı 64px ölçüldü. Kart başlığı odak aldı; kapatma paneli kapatıp event-e-ari düğmesine döndürdü. 1440x1000 görünümde de aynı akış ve taşma kontrolü geçti. Konsol hata kaydı boş. Fiziksel telefon/ekran okuyucu testi yapılmadı.

66 JavaScript ve 21 Python testi geçti. Ana uygulama sürümü 20261017n, ana sayfa CSS sürümü 20261017f. Tarihsel veri, koordinat, scraper, arşiv ve katalog değiştirilmedi. Commit, push ve yayın yapılmadı.


## 17 Ekim 2026 — Arama sonuçlarında kayıt türü

Sonuç başlığının altında mevcut veri türünden türetilen Tabya/Birlik/Gemi/Enkaz/Komuta/Mevki · Harita, 18 Mart · Saatli kayıt ve Kampanya · Olay etiketleri eklendi. Bunlar doğrulama rozeti değildir; yeni tarihsel hüküm veya sınıflandırma verisi yazılmadı. Başlık ve etiket güvenli textContent ile oluşturulur. Ana uygulama sürümü 20261017o, ana CSS sürümü 20261017g.

66 JavaScript ve 21 Python testi geçti. Eski btn.textContent varsayımı yeni başlık span yapısına güncellendi; yürütülen arama testi mevki/kampanya etiketlerini de denetler. Yerel gerçek tarayıcıda 390x844 görünümde Nusret araması dört farklı kayıt getirdi; enkaz, komuta, saatli kayıt ve kampanya etiketleri görüldü, yatay taşma yoktu. Kampanya sonucu seçilince Nusret kartı açıldı ve başlık odak aldı. Konsol hata kaydı boş. Fiziksel cihaz/ekran okuyucu testi yapılmadı. Tarihsel veri, scraper, ham arşiv ve katalog değiştirilmedi. Commit, push veya yayın yapılmadı.


## 17 Ekim 2026 — Türkçe görünüm adı ve Oynat ile haritaya geçiş

Kullanıcı isteğiyle ana sayfa düğmesi, yardım metni, arama etiketi ve kullanım rehberindeki Kampanya ifadesi Cephe kronolojisi yapıldı. Teknik veri anahtarları, dosya adları ve katalog/kaynak künyeleri korunur. Oynat başlatıldığında mevcut scrollToMap çağrılır; duraklatmada kaydırma yapılmaz. Rehber buna göre güncellendi. Ana uygulama sürümü 20261017p.

66 JavaScript ve 21 Python testi geçti. Gerçek Oynat zamanlayıcı testi başlatmada tek kaydırma ve duraklatmada ek kaydırma olmamasını denetler. Gerçek yerel tarayıcıda 390x844 görünümde Cephe kronolojisi seçilip Oynat basıldı: oynatma açık kaldı, harita bölümü üstü 75.8px oldu, yatay taşma ve görünür kampanya sözcüğü yoktu. Konsol hata kaydı boş. Fiziksel cihaz testi yapılmadı. Tarihsel bilgi, koordinat, scraper, ham arşiv ve katalog değişmedi. Commit, push veya yayın yapılmadı.


## 17 Ekim 2026 — Harita üzerinde oynatma bilgisi ve duraklatma

Yalnız oynatma sırasında map-frame üzerinde zaman, seçili olay adı ve Duraklat düğmesi gösterilir. Başlık ve zaman mevcut panel/saat metninden textContent ile alınır; tarihsel veri eklenmez. Başlatmada ve her otomatik adım sonunda yenilenir; stopPlay ile gizlenir. Şeritte Duraklat ana düğmeyle aynı durdurma işlevini çağırır, gizlenen düğmeden odağı ana Oynat düğmesine verir. Harita katman/zoom kontrolleri için iki yanda alan bırakıldı. Ana JS sürümü 20261017r, CSS 20261017h.

68 JavaScript ve 21 Python testi geçti. İki yeni test şerit metin/görünürlük davranışını ve Duraklat düğmesinin durdurma/odak bağlantısını yürütür. Yerel gerçek tarayıcıda 390x844 görünümde oynatma ilerledi; 09:00 Savaş düzeni ve telsiz sessizliği şerit ve panelde aynıydı. Şerit görünür alanda, 267px genişlikteydi; yatay taşma yoktu. Duraklat sonrası şerit gizli, ana düğme aria-pressed=false, odak tl-play idi. Konsol hata listesi boş. Fiziksel cihaz/ekran okuyucu testi yapılmadı. Tarihsel kayıtlar, koordinat, scraper, arşiv ve katalog değişmedi. Commit, push veya yayın yapılmadı.


## 17 Ekim 2026 — Seçili işaretin kapalı katmanını açıklama

Seçili mevkinin katmanı kapalıysa bilgi kartında açıklama ve Katmanı göster düğmesi üretilir. Açma yalnız ilgili grubu ekler, katman düğmesinin aria-pressed durumunu eşler ve mevcut harita durum alanında bildirir. Uyarı düğmesinden açıldığında gizlenen düğmenin odağı başlığa taşınır. Diğer katmanlar otomatik açılmaz. Katman görünürken ve harita yokken uyarı eklenmez. Ana uygulama sürümü 20261017s, CSS 20261017i.

69 JavaScript ve 21 Python testi geçti; yeni test kapalı katmanın seçimle otomatik açılmamasını, düğmeyle tek grubu açmayı, katman kontrolü/durum bildirimi eşleşmesini ve haritasız durumu yürütür. Gerçek tarayıcı ve fiziksel cihaz kontrolü bu tur yapılmadı. Tarihsel kayıt, koordinat, scraper, ham arşiv ve kaynak kataloğu değişmedi. Commit, push ve yayın yapılmadı.


## 17 Ekim 2026 — Katman uyarısının açık kayda bağlanması

Katman uyarısı genel activeId yerine panelin kendi selectedPlaceId değerini kullanır. Deniz olayı, cephe kronolojisi olayı ve mevki kartı mevcut mevki kimliğini iletir; ayrı noktası olmayan kart değeri sıfırlar. Kart kapanınca kimlik temizlenir; inert kart için uyarı üretilmez. Önceki harita seçimine ait uyarının başka karta sızması engellendi. Uygulama sürümü 20261017t.

69 JavaScript ve 21 Python testi geçti. Mevcut katman testi eski activeId varlığında noktası olmayan kartı, inert kartı ve tekrar görünür kartı da kapsıyor. Gerçek yerel tarayıcıda 390x844 görünümde Arıburnu açıkken Kara harekâtı katmanı kapatıldı; uyarı belirdi, kontrol false oldu. Katmanı göster ile uyarı kalktı, kontrol true oldu ve odak panel-title idi. Yatay taşma ve konsol hatası görülmedi. Fiziksel cihaz/ekran okuyucu testi yapılmadı. Tarihsel veri, koordinat, kaynak kataloğu, scraper ve arşiv değişmedi. Commit, push ve yayın yapılmadı.


## 17 Ekim 2026 — Olay sayfaları arasında statik gezinme

28 olay sayfasının kaynak bölümünden sonra Önceki kayıt, Tüm olaylar ve Sonraki kayıt bağlantıları eklendi. Mevcut campaign.events sırası ve uygulamanın mevcut adres üretimi kullanılır; sessiz aralık notları ayrı sayfa olarak eklenmez. Aynı günün kayıtlarının kesin saat sırası olmadığı açıklanır. İlk/son sayfada olmayan komşu üretilmez. Bağlantılar statik HTML'dir, JavaScript gerektirmez. build_event_navigation.js yalnız işaretli gezinme bölümünü ve bu sayfaların CSS sürümünü günceller; tüm hedefleri yazmadan önce doğrular. İkinci çalıştırma 0 değişiklik verdi. Kaynak ve ana olay metinleri korunur. Olay sayfaları CSS sürümü 20261017k.

73 JavaScript ve 21 Python testi geçti. Üç yeni test bütün 28 sayfada bağlantı/komşu varlığı ve kaynak bölümünün önce gelmesini, sınır kayıtları ve metin kaçırmayı denetler. Yerel gerçek tarayıcıda 390x844 görünümde Arıburnu gezinmesi kontrol edildi; Sonraki kayıt ile Kumkale sayfası açıldı, kaynak başlığı korundu, yatay taşma ve konsol hatası yoktu. Fiziksel cihaz/ekran okuyucu testi yapılmadı. Yeni tarihsel iddia, koordinat, scraper veya katalog değişikliği yok. Commit, push ve yayın yapılmadı.


## 17 Ekim 2026 — T01 başlangıcı: 18 Mart iddia incelemesi

31 deniz kronolojisi kaydının eski saat, dakika ve metni ayrı JSON inceleme listesine alındı. Bu liste kaynak kataloğu değildir ve şemasını değiştirmez. Bütün kayıtlar belge karşılaştırması açık durumunda; birinin kısmi incelenmesi diğerlerini doğrulamaz. İlk özel inceleme Inflexible kaydıdır.

AWM Transcribe RCDIG1066703-4 sayfası açıldı, metindeki 42 işaretli bölüm okundu. Tekrar erişimde web aracı zaman aşımı verdi; doğrudan HTTP 200 sayfasında ilgili metin ve Awaiting approval durumu yeniden okundu. Kaynak URL, kısa kanıt, tarih ve sınırlar inceleme JSON'una ve 18 Mart kaynak notuna kaydedildi. Özgün belge görüntüsü karşılaştırılmadı. Mayın isabetinin 16:00 sonrasında bildirilmesi, atlasın 14:14 kaydını doğrudan doğrulamaz/yanlışlamaz; bildirim/isabet ve saat sistemi ayrımı açık. Yeni kesin saat atanmadı.

Kısa anlatımdaki belgesiz 39 ölü ve 14:25 ayrılış ifadeleri çıkarıldı. Mevcut ağır hasar/Boğaz'dan çıkış özeti önceki DVA kaynak notu kapsamıyla korundu. Saatin doğrulanmadığı açıklaması eklendi; eski metin inceleme izinde tutulur. Ana sayfa veri sürümü 20261017c oldu. Koordinat, mevcut kaynak kataloğu veya doğrulama statüsü yükseltmesi yok.

75 JavaScript testi geçti. Tam Python keşif paketinde 267 test, ayrıca zorunlu 15 Python testi başarılı. Gezinme testinin CRLF/LF farkını normalleştirmesi düzeltildi; bağlantı ve içerik denetimi korunuyor. Bu tur gerçek tarayıcı kontrolü yapılmadı. Scraper/ham arşiv değişmedi. Commit, push ve yeni yayın yapılmadı; düzeltmeler yerel. T01 tamamlanmadı.


## 17 Ekim 2026 — T01: Bouvet ve tekrar eden gemi ayrıntıları

AWM C1068416/P04411.003 koleksiyon açıklaması yeniden açıldı; Bouvet paragrafı okundu. 13:54 anlatısı kurum metninde mevcut; özgün gemi raporuyla karşılaştırma tamamlanmadı. Bu sayfa Nusret fotoğrafının açıklamasıdır; fotoğraf Bouvet batışının saatli görsel kanıtı olarak kullanılmaz. IWM HU103301 adresi tekrar HTTP403 verdi; önceki alıntı yeniden doğrulanmış yapılmadı.

Bouvet saatli metnindeki 1 dakika 55 saniye, 639 kayıp, 47 kurtulan ve Cevat Bey teyidi bu kaynakla belgelenmediği için kısa anlatımdan çıkarıldı. Aynı iddiaların mevki ve gemi özetlerindeki kesin sunumu da kaldırıldı. Önceki Inflexible düzeltmesinin mevki/donanma kopyaları tamamlandı. Donanmadaki ayrıntılı iki paragraf sınırlı kaynak açıklamalarına bağlandı. Yeni sayı, saat veya koordinat atanmadı. Eski alanlar/iki donanma parçası inceleme JSON'unda korunur; kaynak URL, tarih, kanıt özeti ve durum eklenir. Katalog şeması/statüleri değişmez.

76 JavaScript ve 267 Python testi geçti. Yeni test tekrar eden kesin sayıların kaldırılmasını, konumların korunmasını ve kaynak durumunun yükseltilmemesini kapsar. Gerçek tarayıcı kontrolü bu tur yapılmadı. Ana sayfa veri sürümü 20261017d. Scraper/ham arşiv değişmedi; commit, push veya yayın yapılmadı. İki kayıt için kısmi inceleme yapıldı; 31 kaydın bütünü veya bu iki kaydın bütün iddiaları doğrulanmış değildir.


## 17 Ekim 2026 — T01: Ocean isabet, tahliye ve batış kayıtları

AWM A02360/C1004447 ve DVA Dardanelles strategy metinleri yeniden açılıp okundu. Mayınla batışı kesin anlatan fotoğraf künyesiyle ihtimalli anlatan kurum metni arasındaki fark korundu. Fotoğrafın Ocak 1915/Süveyş bağlamı olay günüyle karıştırılmaz. Önceki özgün alıntılar tekrar çoğaltılmadı; inceleme JSON'una URL, kanıt özeti, tarih, durum ve sınırlar eklendi.

Ocean isabet ve batış kartlarında kesin saat/hasar/tahliye/gece tespit ayrıntıları yerine açık inceleme durumu gösterilir. Mevki ve gemi özetleri, donanma ayrıntısı ve destek muhrip anlatımındaki Ocean tahliye sayısı aynı sınıra getirildi. Nusret hattında Ocean isabetini koşulsuz kesinleştiren kısa tekrar da kaynak farkına bağlandı. Eski mevki/gemi alanları ve donanma metin parçaları inceleme izinde korunur. Başlık/zaman anahtarları eski bağlantıları korumak için aynı kaldı; doğrulanmış saat etiketi değildir. Koordinat değişmedi.

77 JavaScript ve 267 Python testi geçti. Yeni Ocean testi isabet/batış ayrımını, eski zaman anahtarlarının korunmasını, belgesiz tahliye ayrıntılarının kesin özetlerden kalkmasını, koordinatların ve kaynak durumunun korunmasını denetler. Bu tur gerçek tarayıcı kontrolü yapılmadı. Ana sayfa veri sürümü 20261017e. Katalog, scraper ve ham arşiv değişmedi; commit, push ve yayın yapılmadı. 31 saatli kaydın dördünde kısmi inceleme bulunuyor; T01 açık.


## 17 Ekim 2026 — Batık koordinatlarının kaynak ve harita kontrolü

Kullanıcı batış koordinatlarının kontrolünü istedi. Irresistible için araştırma yayınıyla yaklaşık 6km fark bulundu; yerel işaret yayımlanmış enkaz koordinatına taşındı. Datum belirsizliği, enkaz/isabet ayrımı ve konum kaynağı kartta açıklanır. Bouvet/Ocean sayısal dayanak tamamlanmadığı için taşınmadı, doğrulanmamış yaklaşık gösterim olarak etiketlendi. Majestic koordinatı bulundu fakat ayrı tarih/katman entegrasyonu açık; mevcut Seddülbahir mevkii yanlış biçimde taşınmadı. Diğer olayların mevcut mevki bağlantıları ve eksikleri raporlandı. Ayrıntı: batik-koordinat-incelemesi.md/json.

80 JavaScript ve 267 Python testi geçti. Yerel gerçek Leaflet haritasında Irresistible işareti, kaynak bağlantısı ve belirsizlik metni kontrol edildi. İşaretin DOM/karo üzerinden geri hesaplanan coğrafi konumu hedefle çizim hassasiyeti içinde eşleşti; konsol hatası yok. Bu saha ölçümü değildir. Ana veri sürümü 20261017f, uygulama 20261017v. Katalog, scraper ve ham arşiv değişmedi; commit, push ve yayın yapılmadı.
