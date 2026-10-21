# Kaynakça menüsü ve scriptsiz kullanım

21 Ekim 2026: Kaynakça eski ve eksik satır içi menü yerine ortak navigation.js kullanır. Menü başlangıçta gizli düğmeyle gelir; ortak kod hazır olunca etkinleşir. Katalog formu da apply tamamlandıktan sonra görünür olur. JavaScript kapalıysa çalışmayan arama yerine noscript açıklaması ve mevcut bütün kayıtlar sunulur.

390 px mobil tarayıcı kontrolü: menü data-enhanced=true, Esc ile aria-expanded=false; arama alanına kaydırıldığında üst menü sticky ve top=0. Scriptsiz HTML kontrol kopyasında 0 script, arama formu display=none, 41 kayıt ve 0 gizli kayıt görüldü. Bu kontrol kopyasında script etiketleri kaldırıldı, noscript içeriği div olarak gösterildi; tarayıcı JavaScript ayarı değiştirilmedi.

247 JavaScript + 25 Python testi başarılı. Fotoğraf üreticisi --check güncel; git diff --check hatasız. Katalog şeması ve tarihsel veriler değiştirilmedi. Ekran görüntüsü: 2026-10-21-catalog-menu-mobile.jpg. Commit, push ve yayın yapılmadı.
