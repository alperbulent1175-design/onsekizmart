# Tablet harita yakınlaştırma kontrolleri

21 Ekim 2026: Önceki 44 px zoom düğmesi kuralı yalnız 860 px ve altındaydı. 900 px görünümde düğmeler 30×30 px ölçüldü. Leaflet zoom kontrolleri tüm genişliklerde 44×44 px yapıldı; düğmenin içinde belirgin klavye odak çerçevesi eklendi. Vendor dosyası, harita koordinatları ve zoom sınırları değiştirilmedi.

900×900 tarayıcı kontrolü: düğme 44×44 px; Enter ile yakınlaştırma sonrası ölçek 5 km'den 2 km'ye geçti. Odak düğmede kaldı ve çerçeve görünürdü. 251 JavaScript + 25 Python testi başarılı. Fotoğraf üreticisi --check güncel; git diff --check hatasız.

Ekran görüntüsü: 2026-10-21-map-zoom-tablet.jpg. Bu değişiklik 8630c7e yayınından sonradır; henüz commit, push veya yayın yapılmadı.
