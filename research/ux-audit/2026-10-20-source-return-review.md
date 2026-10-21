# Kaynak incelemesinden seçili harita kaydına dönüş — 20 Ekim 2026

## Sonuç
Harita kartındaki Kanıt metinleri ve açık kalanlar bağlantısı, artık ayrıntı bağlantısıyla aynı dönüş bağlamını taşır. Mevcut sorgu ve bölüm çapası URL API ile korunur; atlasaDon parametresi yinelenmez. Yalnız aynı kökenli yerel hedeflere dönüş parametresi eklenir. Tıklama sırasında mevcut saveAtlasView mekanizması çalışır. Gezinme yerel tarayıcı davranışıyla sürer; kısayollar engellenmez. Genel inceleme-notlari sayfasına Haritaya dön bağlantısı eklendi; geçerli bağlam varsa mevcut navigation.js bunu Seçili kayda dön olarak günceller.

## Tarayıcı kontrolü
- Bouvet mevki seçimi açıldı; harita bir kademe yakınlaştırıldı. Karttaki kanıt bağlantısı 18 Mart sayfasında bouvet-saat-incelemesi başlığına gitti ve odak başlıkta görüldü. Seçili kayda dön bağlantısı aynı dakika/deniz anahtarını taşıdı. Dönüşte Bouvet mayına çarpar kartı ve Harita görünümü ve süzgeçler geri yüklendi durumu görüldü.
- 19 Mayıs Arıburnu genel taarruzu kronoloji kaydından genel inceleme sayfasına gidildi. Dönüş düğmesi aynı olay anahtarını taşıdı; yüksekliği yaklaşık 47,3 px. Geri dönüldüğünde aynı kronoloji kartı ve görünümün yüklendiği durum metni görüldü.

Bu kontroller aynı sekmede yapıldı. Yeni sekmede seçim URL ile taşınır; görünümün aktarılması tarayıcının sekmeye özgü sessionStorage davranışına bağlıdır. Gerçek telefon testi yapılmadı.

## Otomatik kontroller
Mevcut sorgu ve kaynak çapası, yinelenen dönüş parametresinin değiştirilmesi, mevki/olay/deniz kayıtları, dış hedefler ve ters eğik çizgili adresler, tarayıcı kısayolları, iptal edilmiş tıklamalar, genel inceleme yedeği ve kapalı depolama davranışları test edilir. Önceki harita görünümü doğrulama, süre sınırı ve bir kez tüketme kontrolleri korunur.

144 JavaScript + AGENTS.md içindeki 18 Python = 162 test geçti. Tarihsel metin, saat, koordinat, zayiat ve kaynak kataloğu değiştirilmedi. Scraper çalıştırılmadı. Değişiklikler yerel; commit, push veya yayın yapılmadı.
