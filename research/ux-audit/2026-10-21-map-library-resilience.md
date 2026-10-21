# Harita kütüphanesi ve hata durumu — 21 Ekim 2026

Leaflet 1.9.4 dosyaları yerel `vendor/leaflet-1.9.4/` dizinine alındı. Sürüm ve mimari değişmedi. Ana sayfadaki JS/CSS bütünlük değerleri korundu; dosyalar bu değerlerle birebir eşleşiyor. Npm paketinin SHA-512 bütünlüğü de indirme sırasında kontrol edildi. Lisans, kaynak adresleri ve dosya SHA-256 değerleri `SOURCE.json` ile saklandı. Resmî açıklama: https://leafletjs.com/download.html

Bu değişiklik yalnızca kütüphane dosyalarının dış sunucu bağımlılığını kaldırır. Harita karoları ve dış yazı tipi servisleri ağ bağlantısı gerektirmeye devam eder. Çevrimdışı atlas veya ölçülmüş performans kazanımı iddiası yoktur.

Kütüphane yüklenmediğinde katman ve sıfırlama araçları devre dışı kalır. Harita bölgesi erişilebilir bir hata açıklaması ve kronoloji, olay listesi, kaynakça bağlantıları sunar. Arama sonuçları harita yerine açılabilen mevki kartını belirtir. Kronoloji ve olay kayıtları korunur.

## Tarayıcı kontrolü

- Mobil 390 × 844: yerel Leaflet betiğiyle harita açıldı, katman aracı çalıştı; konsolda hata görülmedi.
- Güncel ana sayfanın yalnızca Leaflet betiği çıkarılmış yerel deneme kopyasında hata açıklaması ve devre dışı katman aracı doğrulandı; bölgenin rolü `region` oldu.
- Deneme kopyası `2026-10-21-map-library-failure.html` yalnızca yerel QA içindir; yayın paketine alınmamalıdır.
- Sağlıklı harita görüntüsü: `2026-10-21-local-leaflet-mobile.jpg`.

## Yayın hazırlığı

İleride izin verilen yayında `vendor/leaflet-1.9.4/` dizini JS, CSS, images ve lisansıyla birlikte pakete alınmalı. Eski sabit dosya listesinden üretilmiş bir paket yeni bağımlılığı içermez. Bu çalışma kapsamında commit, push veya yayın yapılmadı.
