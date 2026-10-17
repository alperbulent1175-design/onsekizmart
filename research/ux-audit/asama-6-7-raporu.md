# Aşama 6.7 — Mobil menü ve davranış testleri

16 Ekim 2026. Yerel geliştirme. Commit, push ve yayın yok.

Olay dizini ve 28 olay sayfasındaki tekrar eden menü betikleri js/navigation.js altında birleştirildi. Ana atlasın js/app.js dosyasına dokunulmadı; diğer sayfalara yaygınlaştırma bu turun kapsamına alınmadı.

Escape açık menüyü kapatır ve odağı Menü düğmesine geri getirir. Bağlantı seçimi, dış tıklama ve mobil/masaüstü sınırının geçilmesi menüyü kapatır. Menü içindeki odak kapanırken gizli bir bağlantıda bırakılmaz. Betik yüklenmezse menü bağlantıları mobilde görünür, işlevsiz Menü düğmesi gizlidir. Etkilenen sayfaların stil sürümü v=20261016d oldu.

Yeni tests/navigation.test.js menü açma/kapama, Escape, odak dönüşü, dış tıklama ve ekran geçişini sınar. tests/events-index.test.js Türkçe arama, bölümle birleşen süzme, boş sonuç, alt başlıkların gizlenmesi ve temizleme sonrası odak dönüşünü sınar. Testlerde DOM taklitleri kullanılır.

node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js tests/prototype.test.js tests/navigation.test.js tests/events-index.test.js — 30/30 başarılı.

python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network — 14/14 başarılı.

375 × 812 iframe görünümündeki gerçek Arıburnu sayfasında Menü açılması ve Escape ile kapanması tarayıcıda doğrulandı; odak Menü düğmesine döndü. Görsel asama-6-7-menu.png. Fiziksel telefon testi ve betik yüklenmeme senaryosunun gerçek tarayıcı testi yapılmadı.

29 sayfadaki prose, facts ve roster blokları Git HEAD ile karşılaştırıldı: tarihsel metinler, kaynak notları ve kayıtlar korunuyor. Scraper, arşiv ve kaynak kataloğu değiştirilmedi. Yerel sunucu kontrol sonunda durduruldu.

Açık kalan genel işler: komutan/donanma/rehber sayfalarının aynı mobil gezinme davranışına alınması; gerçek cihaz ve performans ölçümleri. Tarihsel kaynak doğrulama eksikleri bu arayüz çalışmasıyla kapanmış sayılmadı. Canlı yayın ayrıca açık kullanıcı onayı bekler.
