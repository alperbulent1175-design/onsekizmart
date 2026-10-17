# Aşama 6.6 — Olay dizininde arama

16 Ekim 2026. Yerel geliştirme; commit, push ve yayın yapılmadı.

Olay dizinine başlık veya tarihle arama, Deniz/Kara/Tahliye bölüm seçimi, Temizle düğmesi ve canlı sonuç sayımı eklendi. Arama ve bölüm seçimi birlikte çalışır. Türkçe karakterler sadeleştirilerek aranır. Sonuç vermeyen alt bölüm başlıkları gizlenir. Temizle tüm kayıtları geri getirir ve odağı aramaya taşır.

js/events-index.js mevcut kartları okuyup gizler/gösterir. Yeni tarihsel kayıt veya koordinat oluşturmaz. Denetimler betik çalışana kadar gizlidir; JavaScript olmadan mevcut liste kullanılabilir. Arama metni bir sunucuya veya analitik olaya gönderilmez. Tarihsel anlatı ve kaynakça notları değişmedi. Kart ve prose bloklarının Git HEAD ile birebir eşitliği kontrol edildi.

Değişenler: olaylar/index.html, css/style.css; yeni js/events-index.js. CSS olay dizinine özgü events-index sınıfıyla sınırlandı; olay dizini stil adresi v=20261016c. Diğer sayfaların işlev kodları değiştirilmedi.

Yerel tarayıcıda 375 × 812 mobil ve 1440 × 1000 masaüstü iframe görünümü kontrol edildi. ARIBURNU araması dört sonuç verdi; Deniz seçimiyle birleşince boş sonuç bildirildi. Temizle 28 kaydı geri getirdi ve odağı aramaya taşıdı. Mobilde arama tam genişlikte, bölüm seçimi ve temizleme yan yana yerleştirildi. Fiziksel telefon testi yapılmadı. Görseller: asama-6-6-mobile.png ve asama-6-6-desktop.png. Yerel görünüm kontrolü: asama-6-6-preview.html.

Testler:

- node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js tests/prototype.test.js — 26/26 başarılı.
- python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network — 14/14 başarılı.

Mevcut otomatik paket yeni dizin süzgecini doğrudan kapsamıyor; süzgecin etkileşimleri gerçek tarayıcıda kontrol edildi. JavaScript sözdizimi ayrıca kontrol edildi.

Scraper, arşiv, kaynak kataloğu ve tarihsel veri dosyaları korunuyor. Önceden mevcut çalışma değişikliklerine dokunulmadı. Yerel sunucu kontrol sonunda durduruldu.
