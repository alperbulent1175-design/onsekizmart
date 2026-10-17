# Aşama 6.5 — Olay sayfalarında mobil okuma

16 Ekim 2026. Yerel geliştirme; commit, push veya yayın yapılmadı.

28 olay ayrıntı sayfasına event-page sınıfı ve başlık altında üç kısa geçiş eklendi: Haritada göster, Olay listesi, Kaynak notu. Harita bağlantıları mevcut sayfalardan aynen alındı. Metin altındaki mevcut harita bağlantısı korundu. Kaynakça başlığına klavye odağı alabilen kaynak-notu hedefi eklendi.

Ortak CSS içinde yalnız event-page kapsamındaki okuma boyutu, satır/paragraf aralığı ve bağlantılar düzenlendi. Mobilde tarih/taraf/mevki alanları tek sütunlu etiket-değer satırları oldu. İlk tarayıcı kontrolünde eski flex kuralının bu alanları sıkıştırdığı görüldü; açık display:grid kuralıyla düzeltildi ve tekrar kontrol edildi. Ana sayfa ve 28 olay sayfasının stil sürümü v=20261016b oldu.

28 sayfanın prose ve facts blokları Git HEAD ile karşılaştırıldı: hiçbir tarihsel anlatı, kaynak notu veya tarih/mevki metni değişmedi. Yeni üst harita bağlantısının her sayfanın önceki bağlantısıyla aynı olduğu doğrulandı. build_pages.py yalnız yasal sayfaları üretiyor; olay sayfalarının üreticisi olmadığı için değiştirilmedi.

Tarayıcıda gerçek Arıburnu sayfası 375 × 812 mobil ve 1440 × 1000 masaüstü iframe görünümlerinde çalıştırıldı. Kaynak notu bağlantısı Kaynakça başlığına odağı taşıdı. Haritada göster bağlantısı /?olay=ariburnu-cikarmasi#harita adresini açtı; mevcut derin bağlantı kodu Arıburnu kaydını seçti ve Kampanya moduna geçti. Bu kontroller fiziksel telefon testi değildir.

node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js tests/prototype.test.js: 26/26 başarılı.

python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network: 14/14 başarılı.

Görseller asama-6-5-mobile.png ve asama-6-5-desktop.png. Görünüm kontrol sayfası asama-6-5-preview.html. Yerel sunucu kontrol sonunda durduruldu.

Scraper, ham arşiv, kaynak kataloğu ve tarihsel veri dosyalarına dokunulmadı. Önceden mevcut çalışma değişiklikleri korundu. Sıradaki yerel iş olay dizininde mobil keşif ve gezinme akışını iyileştirmek olabilir.
