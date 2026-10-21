# Harita kontrol dili ve işaret adları — 20 Ekim 2026

## Değişiklik

Leaflet yakınlaştırma düğmeleri artık Yakınlaştır/Uzaklaştır, taban harita düğmesi Taban haritayı seç adını taşır. İşaretlerin erişilebilir adı simgedeki tek harf yerine mevcut veri kaydının tam adıdır. Yaklaşık konum ve doğrulama uyarıları adın içindeyse korunur. Katman yeniden açılırken ve seçili simge yenilenirken ad tekrar uygulanır.

Tarihsel veri, kaynak kataloğu ve koordinatlar değiştirilmedi. Scraper, commit, push ve yayın çalıştırılmadı. index.html uygulama sürümü 20261020i olarak güncellendi.

## Doğrulama

- Tüm 178 JavaScript testi ve AGENTS.md kapsamındaki 18 Python testi geçti; git diff --check temiz.
- Yerel tarayıcıda yakınlaştırma ve taban harita düğmelerinin Türkçe erişilebilir adları doğrulandı.
- İtilaf süzgecinde 19 kayıt ve 4 ortak kayıt mesajı korundu; görünür işaretlerin adları veri başlıklarıyla eşleşti.
- 390 piksel genişlikte Ocean işaretinde Enter kartı açtı ve panel başlığına odaklandı. Kapatınca odak tam adı taşıyan Ocean işaretine döndü. Yakınlaştırma düğmesi çalıştı.
- 390 ve 320 piksel genişliklerde yatay taşma yoktu; işaret adları korundu. Bu kontroller masaüstü tarayıcısında dar ekran benzetimidir; fiziksel telefon ve gerçek ekran okuyucu testi yapılmadı.

Görsel: 2026-10-20-map-accessibility-mobile.jpg
