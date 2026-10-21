# Atlas aramasında kesintileri önleme — 20 Ekim 2026

## Bulgular ve değişiklik

Masaüstünde arama alanı doğrudan kullanılabiliyor. Araç düğmesinin oynatmayı durdurması bu yolu kapsamıyordu. Yerel tarayıcıda oynatma açıkken Bouvet yazıldı; 3,3 saniye sonra sorgu ve üç sonuç açık kalmasına rağmen kart Karargâh güne başlar kaydından Donanma intikali kaydına geçmişti. Dolayısıyla sorun sonuçların kapanması değil, arama sırasında kart ve haritanın otomatik değişmesiydi.

Arama alanına odaklanma, yazma, temizleme, daha fazla sonuç gösterme ve işlenen ok tuşları ortak beginSearchInteraction üzerinden oynatmayı durdurup bekleyen açılış seçimini geçersiz kılıyor. Sonuçları programmatik olarak çizmek aynı etkiyi üretmiyor. Arama sonucunu seçme ve yeni bir oynatma başlatma yolları korunuyor. app.js önbellek sürümü 20261020d.

## Doğrulama

- 154 JavaScript + AGENTS.md içindeki 18 Python = 172 test geçti. JavaScript sözdizimi ve git diff --check temiz.
- Yeni testler gerçek stopPlay işleviyle zamanlayıcının temizlenmesini, düğme/oynatma durumunu ve sorgu/sonuç davranışını denetliyor. Sekiz arama işlemi × üç bağlantı türü için bekleyen seçimin, kaydırmanın ve görünüm geri yüklemesinin uygulanmadığı doğrulandı. Programmatik çizim, değiştirici tuşlar ve müdahalesiz açılışlar ayrı kontrol edildi.
- Düzeltme sonrası aynı masaüstü tarayıcı kontrolünde oynatma arama başında durdu; 3,3 saniye sonra kart, sorgu, üç sonuç ve q odağı korundu. Oynatma şeridi gizli ve yatay taşma yoktu. Önce/sonra sonuçları desktop-search-before.json ve desktop-search-after.json dosyalarında.
- 1280 piksel iframe genişliğinde üç bağlantı türü arama sırasında denendi; başlangıç kaydı korundu. Üç müdahalesiz kontrol doğru kayda geçti. Altı senaryo başarılı: search-opening.json. Dakika parametresi yazılım anahtarıdır; tarihsel saat doğrulaması sayılmaz.
- Ana sayfada gerçek klavye akışı denendi: Bouvet araması → aşağı ok → Enter. Bouvet kartı açıldı, odak panel-title öğesine geçti, sorgu korundu ve sonuçlar kapandı; oynatma kapalı kaldı.

Kontrol dosyaları ve görüntü bu notla aynı dizinde 2026-10-20 önekiyle saklandı. Bu turda tarihsel veriler, koordinatlar, kaynak kataloğu ve scraper değiştirilmedi. Commit, push ve yayın yapılmadı.
