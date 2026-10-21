# Oynatma ve duraklatmada haritayı görünür tutma — 20 Ekim 2026

## Sorun ve değişiklik

Oynat, harita bölümünün başlangıcına kaydırıyordu. Kullanım rehberi açıkken bölümün başında rehber yer aldığı için gerçek harita görünmeyebiliyordu. Yerel 320 piksel kontrolde haritanın görünür yüksekliği sıfır; 390 piksel kontrolde yalnız 47 pikseldi. Harita üzerindeki Duraklat ise aşağıdaki ana Oynat düğmesine odaklanarak iki mobil genişlikte de haritayı görünüm dışına taşıyordu.

scrollToMap artık doğrudan mevcut #map öğesini, yoksa bölüm yedeğini hedefler. Üst menü boşluğu masaüstünde de uygulanır. Oynatma başlatılınca odak görünür Duraklat düğmesine geçer. Harita üzerindeki Duraklat, kaydırmadan haritaya odak verir; mevcut Leaflet tabindex değeri korunur. Harita öğesi yoksa ana oynatma düğmesi yedektir.

Oynatma şeridi gizlenirken odağın o şeritte olup olmadığı gizlemeden önce kontrol edilir. Yalnız bu durumda odak haritaya döner. Bu, Escape ve diğer durdurma yollarında odağın gizlenen düğmeden BODY'ye düşmesini önler. Şerit dışındaki kullanıcı odağına müdahale edilmez. Rehber kapatılmaz, seçili kayıt veya süzgeç değiştirilmez. app.js sürümü 20261020f, ana sayfanın CSS sürümü 20261020b.

## Doğrulama

- 163 JavaScript + AGENTS.md içindeki 18 Python = 181 test geçti. Sözdizimi ve git diff --check temiz.
- Kaydırma testleri map/bölüm/eksik hedef ve azaltılmış hareket seçeneklerini kapsar. Oynatma gerçek zamanlayıcı işleyicisiyle, Duraklat üç tabindex durumuyla ve eksik odak hedefleriyle denetlendi. Gerçek Escape işleyicisi + stopPlay + updateMapPlayback birlikte çalıştırılarak sahip olunan odağın döndüğü ve dış odağın taşınmadığı doğrulandı.
- 320×844, 390×844 ve 1280×900 iframe görünümlerinde rehber açık/kapalı: altı senaryo başarılı. Düzeltmeden sonra oynatmada harita üstü 76 pikseldeydi; mobilde 439 piksel, masaüstünde 732 piksel olan haritanın tamamı görünürdü. Duraklat sonrasında harita aynı yerde kaldı, odak map öğesindeydi, oynatma durmuştu. Seçili başlık ve rehberin açık/kapalı durumu korundu; yatay taşma görülmedi.
- 390×844 gerçek tarayıcı görünümünde rehber açıkken oynatma başlatıldı. Harita ve Duraklat düğmesi görünür, odak Duraklat üzerindeydi. Escape sonrasında oynatma şeridi gizlendi, odak haritaya geçti ve Leaflet tabindex=0 korundu. Escape'in mevcut kart kapatma davranışı nedeniyle sayfa yerleşimi değişti; haritanın tamamı görünür kaldı. Geçici ekran boyutu sonunda sıfırlandı. Gerçek telefon/dokunma testi yapılmadı.

Önce/sonra ölçümler ve Escape sonucu bu dizinde 2026-10-20-playback-viewport-before.json, playback-viewport-after.json ve playback-escape.json adlarında aynı tarih önekiyle saklandı. Tekrar çalıştırılabilir yerel kontrol: playback-viewport.html; güncel kaynakları ayrı URL ile denemek için ?run=final kullanılır. Görüntü: playback-visible.png.

Ön incelemede kaynak dizininin kapalı olması doğrulanmış hata sayılmadı. goPlace içindeki hızlı istek yarışı eski, mevcut HTML'de bulunmayan kaplara bağlı olduğundan bu turda değiştirilmedi.

Tarihsel veri, koordinat, kaynak kataloğu, scraper ve ham arşiv değiştirilmedi. Commit, push ve yayın yapılmadı.
