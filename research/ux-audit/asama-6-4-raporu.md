# Aşama 6.4 — Ana sayfaya yerel entegrasyon

16 Ekim 2026. Kullanıcının devam talebi üzerine prototipteki tipografi, renkler ve kısa giriş ana sayfaya uyarlandı. Commit, push ve Hostinger yayını yapılmadı.

## Sonuç

index.html içindeki giriş alanı Çanakkale Cephesi Dijital Atlası başlığı, kısa rehber metni, harita/kronoloji bağlantıları ve coğrafya alt yazısıyla yenilendi. Sayfa başlığı ve Open Graph başlığı yeni adla eşleştirildi. Stil adresi v=20261016a oldu.

Çalışan kontrol paneli ve zaman panelinin harita genişliğini korumak için prototipin yan yana hero düzeni birebir kopyalanmadı. Yeni giriş mevcut atlasın üstünde iki sütunlu bir başlık alanıdır. Mobilde tek sütuna geçer. Harita ilk mobil görünüm içinde başlar. Mevcut #map ve tüm kontrol kimlikleri yerinde; ikinci Leaflet örneği oluşturulmadı. js/app.js değiştirilmedi. Prototip ayrı kaldı.

css/style.css ekleri body.home altında kapsamlandı; olay sayfaları ve katalog düzeni etkilenmez. Giriş bölümündeki odak görünürlüğü ve bağlantılar düzenlendi. Ana sayfadaki açıklama ve kronoloji bağlantıları alt çizgiyle belirginleştirildi. Bu çalışma kontrast denetiminin tüm site için tamamlandığı anlamına gelmez.

## Kontroller

Yerel HTTP sunucusunda gerçek ana sayfa, asama-6-4-preview.html içindeki 1440 × 1000 masaüstü ve 375 × 812 mobil iframe boyutlarında kontrol edildi. Bunlar fiziksel cihaz testi değildir.

Masaüstünde başlık alanı, harita, arama/katman paneli ve zaman paneli birlikte görüntülendi. Mobilde başlık, iki bağlantı, Ara/Süzgeç/Katman araçları ve harita görünümü kontrol edildi. Gerçek tarayıcıda Kampanya seçimi zaman çubuğunu sefer olayına çevirdi; İleri düğmesi bir sonraki kayda geçti ve bilgi paneli güncellendi. Mobil Ara düğmesi arama alanını açtı; Nusret araması mevcut olay sonucunu getirdi.

node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js tests/prototype.test.js: 26 test başarılı.

python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network: 14 test başarılı.

Ekran görüntüleri: asama-6-4-desktop.png ve asama-6-4-mobile.png. Önizleme kontrol sayfası asama-6-4-preview.html. Yerel sunucu kontrol sonunda durduruldu.

## Korunan sınırlar ve sonraki adım

Scraper, ham arşiv, kaynak kataloğu, tarihsel veri dosyaları ve olay sayfaları değiştirilmedi. Olay veya koordinat eklenmedi. Önceden değişmiş tests/catalog.test.js ve tests/quality.test.js dosyalarına dokunulmadı.

Sıradaki yerel çalışma: olay sayfalarının mobil okuma düzeni ve haritaya dönüş akışı. Cursor kullanılacaksa bu iki konuda mevcut HTML/CSS/JS mimarisiyle sınırlı bir inceleme görevi verilebilir; bu turda başka bir araca görev gönderilmedi. Yayın ayrı bir açık onay gerektirir.
