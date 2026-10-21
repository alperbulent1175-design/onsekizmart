# Olaylar arasında okurken dönüşü koruma — 20 Ekim 2026

## Sorun ve değişiklik

Haritadan açılmış 19 Mayıs sayfasında seçili kayda dönüş vardı. Önceki/sonraki kayıtlar atlasaDon bilgisini taşımıyor, içerikteki 24 Mayıs bağlantıları ise hem harita hem liste araması bağlamını kaybediyordu. Tarayıcıdaki önce kontrolünde ikinci sayfanın düğmesi Haritada göster durumuna dönmüş ve 24 Mayıs kaydına yönelmişti.

navigation.js artık doğrulanmış atlasaDon ve listeyeDon bilgilerini ana içerikteki aynı kökene ait olay sayfası bağlantılarına birlikte taşır. Mevcut sorgu ve bölüm çapaları korunur; dönüş parametreleri .set ile tekilleştirilir. Dış adreslere, harita bağlantılarına, liste köküne ve aynı sayfadaki mevcut sorguyu koruyan çapalara bilgi eklenmez. Aynı olayı querysiz veya farklı query ile yeniden açan bağlantılar da dönüş bilgisini taşır. Böylece üç tahliye sayfasındaki kendi olayına giden bağlantılar bağlamı silemez.

## Doğrulama

- 160 JavaScript + AGENTS.md içindeki 18 Python = 178 test geçti. Sözdizimi ve git diff --check temiz.
- Altı yeni test harita olay/mevki/deniz kaydı ayrımını, önceki/sonraki ve metin içi bağlantıları, üç sayfa boyunca iki dönüş bağlamını, eski parametrelerin tekilleştirilmesini, geçersiz/dış hedefleri, saf çapaları ve aynı olayı yeniden açmayı denetler. İlgili 22 test bağımsız ikinci incelemede de geçti.
- Gerçek harita akışı: 19 Mayıs seçimi, bir kademe yakınlaştırma, Ayrıntı, Sonraki kayıt ile 24 Mayıs ve Seçili kayda dön. Arıburnu genel taarruzu kartı geri geldi; Harita görünümü ve süzgeçler geri yüklendi durumu görüldü.
- Gerçek liste akışı: Arıburnu araması + Kara bölümü, 19 Mayıs ayrıntısı, metin içindeki 24 Mayıs bağlantısı ve Arama sonuçlarına dön. Arıburnu sorgusu, Kara bölümü ve üç olay sonucu geri geldi.
- Arıburnu tahliyesi sayfasındaki kendi olayına giden bağlantıya basıldı; harita ve liste dönüşleri korundu.
- 320 ve 390 piksel iframe genişliğinde Sonraki kayıt ve metin içi bağlantı yolları ayrı ayrı denendi. Dört tam turda iki bağlam taşındı, 24 Mayıs sayfasındaki dönüş doğru kaldı ve haritada ilk 19 Mayıs kartı yeniden açıldı. Yatay taşma görülmedi. Gerçek telefon/dokunma testi yapılmadı.
- 390 × 844 tarayıcı görünümünde iki dönüş bağlantısı birlikte doğrulandı ve görüntü kaydedildi. Görsel kontrolünde eski yerel HTML önbelleği fark edilip sayfa yenilendi; güncel navigation.js?v=20261020a ve yeni bağlantılar ayrıca okundu. Geçici ekran boyutu kontrol sonunda sıfırlandı.

66 sayfa/şablonda yalnız gezinme betiğinin önbellek sürümü güncellendi. Sürüm alanı dışındaki dosya içerikleri SHA256 karşılaştırmasında aynıdır. Bu turda tarihsel metin, sayı, koordinat, kaynak kataloğu veya scraper değiştirilmedi. Commit, push ve yayın yapılmadı.

Kanıtlar bu dizindeki 2026-10-20-reading-context-before.json, reading-context-after.json, reading-context-mobile.json, reading-context-cache.json ve reading-context.png dosyalarında aynı tarih önekiyle bulunur. Mobil kontrol sayfası tekrar yerelde çalıştırılabilir.
