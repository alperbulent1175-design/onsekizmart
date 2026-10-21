# Açılış bağlantısı ve harita araçları — 20 Ekim 2026

## Sorun ve düzeltme

Geçerli olay, mevki veya zaman bağlantısı sayfa açıldıktan 350 ms sonra seçiliyor. Bu sırada kullanıcı Ara, Süzgeç veya Katman aracını açarsa bekleyen seçim kartı yenileyerek aracı kapatabiliyordu. Araç açılması artık bekleyen seçimin revizyonunu geçersiz kılar. Yalnız gerçek açılışta uygulanır; kapatma ve sistemsel closeTools çağrıları etkilenmez. Kullanıcı müdahalesi yoksa bağlantı seçimi ve saklanan harita görünümünün geri yüklenmesi devam eder. app.js önbellek sürümü 20261020c olarak güncellendi.

## Kontroller

- Gerçek consumeDeepLink ve bindDock işlevleriyle üç bağlantı türü × üç araç yarış testi; ayrıca müdahalesiz üç bağlantının seçimi ve görünüm geri yüklemesi.
- 150 JavaScript testi ve AGENTS.md kapsamındaki 18 Python testi geçti: toplam 168. JavaScript sözdizimi ve git diff --check temiz.
- Yerel tarayıcıda 320 ve 390 piksel iframe genişliğinde üç bağlantı × üç araç: 18 durumda açılış seçimi başlamadan araç açıldı. 700 ms sonra araç açık kaldı, odak ve mevcut seçim korundu, yatay taşma görülmedi.
- Üç müdahalesiz tarayıcı kontrolünde Bouvet, e-may19 ve dakika=600 bağlantıları başlangıç kaydından ilgili kayda geçti. Zaman parametresi mevcut yazılım anahtarıdır; tarihsel saat doğrulaması değildir.
- 390 × 844 gerçek tarayıcı görünümünde Bouvet araması üç sonuç verdi; görüntü kaydedildi. Geçici ekran boyutu kontrol sonunda sıfırlandı. Gerçek telefon/dokunma testi yapılmadı.

Sonuçlar: 2026-10-20-opening-tools.json. Tekrar çalıştırılabilir yerel kontrol: 2026-10-20-opening-tools.html. Görüntü: 2026-10-20-opening-tools.png.

Bu düzeltmede tarihsel veri, koordinat, kaynak kataloğu veya scraper değiştirilmedi. Commit, push ve yayın yapılmadı.
