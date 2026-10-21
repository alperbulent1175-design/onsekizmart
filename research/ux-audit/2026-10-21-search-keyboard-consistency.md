# Dizin aramaları ve bağlantı bütünlüğü — 21 Ekim 2026

Olay, komutan ve donanma aramasında Esc yalnız arama metnini temizler. Bölüm, taraf veya yalnız adlarda arama seçimi korunur; sonuçlar, URL ve ayrıntı sayfasından dönüş bağlantıları yeniden hesaplanır. Boş alanda Esc engellenmez. Değiştirici tuşlu, önceden engellenmiş veya metin bileşimi sırasında gelen olaylar işlenmez. Fotoğraf aramasına da aynı korumalar eklendi.

Fotoğraf bağlantısı aramayla gizlendiğinde gösterilen uyarının Esc sonrası eski durumda kaldığı gerçek tarayıcıda görüldü: A02360 görünürken uyarı hâlâ görünüyordu. Arama alanındaki işlem forma ulaştığında uyarı artık yeniden değerlendirilir. Son kontrolde uyarı gizli, fotoğraf görünür, görüntüleyici kapalı ve odak arama alanındaydı. Otomatik açılma veya kaydırma eklenmedi.

Mobil 390 × 844 kontrolleri: İtilaf tarafı seçili komutan araması 13/25, yalnız adlarda donanma araması 30/30, kara bölümü olay araması 16 sonuçla metin temizlendikten sonra korundu. Komutan sayfası belge genişliği 375 piksel; yatay taşma görülmedi.

67 yayımlanan HTML sayfasındaki yerel dosya ve bölüm bağlantıları tarandı; eksik hedef bulunmadı. `tests/site-links.test.js` bu denetimi tekrarlar; fotoğraf görüntüleyicisinin sanal çapalarını gerçek `data-photo-id` kayıtlarıyla eşleştirir.

Doğrulama: 224 JavaScript ve 24 Python testi geçti. Tarihsel veri, koordinat, kaynak kataloğu ve scraper değiştirilmedi. Bu çalışma commit edilmedi, gönderilmedi veya yayımlanmadı. Canlı sürüm e85f205 olarak kaldı.
