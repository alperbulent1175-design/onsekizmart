# Aşama 6.8 — İç sayfa gezinmesi ve yükleme düzeni

16 Ekim 2026. Yerel geliştirme; commit, push ve yayın yapılmadı.

Ortak mobil menü 34 ek iç sayfaya ve page-shell.html şablonuna taşındı. Komutanlar, donanma, rehber, sözlük ve yasal/iletişim sayfaları aynı navigation.js dosyasını kullanıyor. site-nav sınıfı, betik yokken bağlantıları görünür bırakır ve işlevsiz Menü düğmesini gizler. Kaynakça sayfası ve kaynak kataloğu bu kapsama alınmadı. Ana atlas kendi mevcut menü başlatıcısını kullanmaya devam eder.

34 sayfanın main blokları Git HEAD ile karşılaştırıldı ve birebir eşit bulundu. İletişim formunun içerik/betik bloğu, tarihsel bilgiler, kaynak notları ve kayıtlar değişmedi. Şablon güncellendiği için sonradan üretilecek yasal sayfalarda aynı menü bağlantısı korunur; sayfa üreticisi çalıştırılmadı.

Ana sayfanın beş sıralı harici betiğine defer eklendi: Leaflet, data.js, campaign.js, model.js ve app.js. Betiklerin HTML içindeki sırası aynı kaldı. Analytics'in async etiketi değiştirilmedi. Bu, betik indirmelerinin paralel yapılmasına olanak tanır; ölçülmüş milisaniye kazanımı iddia edilmez. Stil sürümü etkilenen yeni sayfalarda v=20261016e oldu.

## Kontroller

Komutan sayfası 375 × 812 iframe boyutunda tarayıcıda açıldı. Menü açıldı; Escape kapattı ve odak düğmeye döndü. Görsel: asama-6-8-menu.png. Önizleme: asama-6-8-preview.html.

Ana sayfa yeni betik yükleme düzeniyle açıldı; harita işaretleri ve başlangıç paneli oluştu. Kampanya moduna geçiş ve İleri düğmesiyle zaman çubuğu/bilgi panelinin güncellenmesi gerçek tarayıcıda doğrulandı.

node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js tests/prototype.test.js tests/navigation.test.js tests/events-index.test.js — 30/30 başarılı.

python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network — 14/14 başarılı.

## Performans incelemesinin sınırı

web-perf becerisi izlendi. Kullanılabilir araçlar arasında performans izi, ağ istek listesi veya Lighthouse ölçümü bulunmadı. Bu nedenle LCP, CLS, INP, TBT, FCP ve Lighthouse skoru ölçülmedi; önce/sonra hız kıyaslaması yapılmadı. Kod incelemesi betik sırasını ve yükleme özniteliklerini kapsıyor. Yeni bağımlılık veya ölçüm aracı kurulmadı. Sunucu sıkıştırması/önbelleği ve gerçek telefon performansı açık doğrulama işleri olarak kalıyor.

Scraper, ham arşiv, kaynak kataloğu ve tarihsel veri dosyalarına dokunulmadı. Yerel kontrol sunucusu sonunda durduruldu. Yayın için ayrıca açık kullanıcı onayı gerekir.
