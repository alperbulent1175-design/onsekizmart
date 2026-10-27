# R23 — yerel yayın hazırlığı
26 Ekim 2026 · Durum: devam ediyor; yayın yetkisi bekleyen kısım engelli.

`prepare_release.py` yalnız dosya listesi, boyut ve SHA256 üretir. Commit, bağlantı, yükleme ve silme yapmaz. Sayfalar güncel `published_pages` kümesinden gelir; araştırma/arşiv/tmp/prototip/ek dosyaları dışarıda kalır. Genel varlık dizinlerine eklenen dosyaların hak ve içerik incelemesi ayrıca gerekir; envanter yayına uygunluk onayı değildir.

Yerel prova: 161 dosya, 88 HTML sayfası. Son yayın listesine göre iki data JSON eklendi, 13 dosya değişti. `.htaccess` eski yayında var, yerelde yok: sunucudan silinmemeli; eski kopyası ve sunucunun güncel yapılandırması karşılaştırılmadan tam ayna eşitleme yapılmamalı. `removed` alanı yalnız farktır, silme emri değildir.

Geri dönüş hazırlığı: önceki yerel `research/deployment/2026-10-25-glossary-release/before` alanı son yayından ÖNCEKİ kopyadır; güncel sunucu yedeği sayılamaz. Yeni yayın yetkisi geldiğinde değişecek her uzak dosyanın yeni yedeği alınmalı, hash listesi ve yedek kapsamı doğrulanmalı. Eksik/başarısız yedek varsa yayın durmalı. Geri dönüş, bu yeni yedekten yalnız değiştirilen dosyaları geri yükleyip hash kontrolü gerektirir; yeni dosyaların kaldırılması ayrıca açık yayın planında listelenmeli. Bu partide uzak yedek alınmadı ve geri yükleme yapılmadı.

Kabul henüz tam değil: yerel listeleme ve fark provası tamam; uzak dosya karşılaştırması, güncel yedek ve gerçek geri dönüş provası açık. Bu yüzden R23 tamamlandı sayılmaz.


## Dondurulmuş listenin yeniden kontrolü
`--verify` seçeneği önceden üretilmiş dosya listesini güncel dosyalarla karşılaştırır. İçerik değişikliği, yeni dosya ve kayıp dosyayı ayrı bildirir; fark varsa çıkış kodu 1 olur. Dosyaları onarmaz, kopyalamaz veya uzak sisteme bağlanmaz. Yeni çıktı, dondurulmuş listenin üstüne yazılmamalıdır; ayrı bir kontrol dosyası kullanın.

26 Ekim yerel prova: `R23-current-inventory.json` ve `R23-frozen-check.json` 161 dosyada eşleşti; 88 sayfa sitemap ile eşleşti. Bu yalnız yerel bütünlük kontrolüdür, sunucunun aynı sürümü çalıştırdığı anlamına gelmez. Sonraki içerik değişikliğinde yeniden kontrol veya bilinçli yeni liste gerekir.

Karşılaştırma kaynağını koruma: --output ile --verify veya --previous aynı dosyayı gösterirse araç işlem yapmadan hata verir. Dondurulmuş veya önceki liste yeni sonuçla ezilmez.
