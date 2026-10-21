# Betiksiz fotoğraf bağlantıları — 21 Ekim 2026

Fotoğraf bağlantılarının `#foto-…` hedefleri önceden yalnız görüntüleyici tarafından çözülüyordu. Kartlara artık gerçek ve odaklanabilir bölüm kimlikleri eklenir. Boşluklu kayıt numaralarında fiziksel bölüm kimliği boşluk yerine tire kullanır; kurum kayıt numarası ve künyesi değiştirilmez.

Görüntüleyici eski boşluklu/kodlanmış adresleri ve yeni fiziksel adresleri birlikte tanır. Yeni paylaşım ve dönüş adresleri fiziksel hedefi kullanır. Üretici, kayıt kimliğini ve bölüm kimliği çakışmalarını yazmadan önce denetler. 36 galeri çıktısı üreticiden güncellendi; görsel dosyaları ve kaynak künyeleri aynı kaldı.

Betikleri ve yazı tipi onload işleyicisi çıkarılmış yerel deneme kopyasında ikinci bir sorun görüldü: geliştirme betiği çalışmadığında açık mobil gezinme yaklaşık 748 piksel yüksekliğinde sabit kalarak içeriği örtüyordu. Geliştirilmemiş mobil menü artık normal sayfa akışındadır. Normal JavaScript görünümünde sabit menü korunur.

## Tarayıcı doğrulaması

- Betiksiz deneme kopyasında script ve dialog sayısı sıfırdı. A02360 hedefi odak aldı ve kaydırma tamamlanınca kart yaklaşık 84 pikselde göründü. Menü `static` olarak yukarıda kaldı.
- Normal arşivde hem `#foto-Bild-183-H29994` hem eski `#foto-Bild%20183-H29994`, Bild 183-H29994 görüntüleyicisini açtı. Normal menü `sticky` kaldı.
- Yerel deneme HTML'i yayın dosyası değildir. Gerçek tarayıcıda JavaScript kapatılmadı; betiksiz kopya kullanıldı.
- 239 JavaScript + 25 Python testi geçti. Gerçek fotoğraf hedefleri, benzersiz kimlikler, eski adres uyumluluğu ve üreticideki çakışma reddi denetlendi. Üretilmiş galeri çıktıları güncel.

Tarihsel iddia, koordinat, kaynak kataloğu ve scraper değiştirilmedi. Commit, push veya yayın yapılmadı. Görsel: `2026-10-21-photo-native-anchor-mobile.jpg`.
