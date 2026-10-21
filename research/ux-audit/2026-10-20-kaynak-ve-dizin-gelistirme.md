# Kaynak kartları ve dizinlerde okuma akışı — 20 Ekim 2026

## Yapılanlar

- Inflexible, Irresistible ve Ocean kartlarına Gazette resmî yayım karşılaştırması eklendi. Daktilo kopyası ayrı statüsüyle korunur. Belirli pasajın desteği bütün kartın veya koordinatın doğrulanması sayılmaz.
- Kaynak karşılaştırmasında URL, tarih, kanıt, çeviri, kapsam ve doğrulama durumu zorunludur. Geçersiz takvim tarihleri, eksik alanlar ve tehlikeli URL’ler gösterilmez.
- 18 Mart sayfasının kaynak uyarısı, desteklenen pasajları ve açık kalanları açıklar; saat/konum/zayiat konularına doğrudan bağlantılar verir. Eski meta açıklamasındaki ayrıntılı komuta anlatısı yerine sayfanın içeriğini tarif eden açıklama kullanılır.
- Donanma aramasına Sonuçlara git eklendi. Enter ilk görünür karta; boş sonuçta sonuç açıklamasına odak verir. Adla arama ve temizleme korundu.
- Komutan dizinindeki 25 kayıtta ad/görev araması, taraf süzgeci, sonuç sayısı, boş sonuç açıklaması, temizleme ve arama bağlantısı eklendi. Ayrıntı sayfasından arama metnine ve tarafa dönüş korunur. Dış adresler, bilinmeyen parametreler ve yinelenen parametreler dönüş hedefi olamaz.
- Genel .sub stilinin içerik alt başlıklarını gizlemesi giderildi; açılır menü stili .nav kapsamına alındı. Osmanlı/İtilaf görev alt başlıkları artık normal belge akışında görünür.

## Yerel doğrulama

Mobil 320 ve 390 piksel ile masaüstü 1440 pikselde kontrol edildi. 320 pikselde komutan sayfasının belge genişliği ve kaydırma genişliği aynı: 305 piksel. Arama düğmeleri yaklaşık 51 piksel yükseklikte. COBANLI ve emile guepratte sorguları, taraf seçimi, sıfır sonuç, temizleme, Enter ve Cevat ayrıntısından aramaya dönüş sınandı. JavaScript olmadan 25 bağlantının gizlenmediği kontrol edilir.

Son otomatik kontrol: 212 JavaScript + 18 Python = 230 test. Yerel arşiv, scraper ve kaynak kataloğu şeması değiştirilmedi. Commit, push ve canlı yayın yapılmadı.

## Performans incelemesinin sınırı

web-perf becerisine göre mevcut araçlar araştırıldı; performans izi/Lighthouse/ağ isteği ölçüm aracı yok. Kaynak incelemesinde ana görselin boyutları ve öncelik bilgisi, ertelenmiş betikler ve yazı tipi yükleme düzeni kontrol edildi. Gerçek LCP, INP, CLS veya Lighthouse puanı ölçülmedi; tahminî hız kazancı iddia edilmedi ve ölçümsüz bir performans değişikliği yapılmadı.

## Yayın hazırlığı

Yeni js/commanders-search.js dosyası sonraki yayın paketine dahil edilmelidir. Komutan sayfalarının gezinme betiği ve stil sürümleri güncellendi. Kaynak kartları için ana sayfanın veri ve uygulama sürümleri güncellendi. Bu rapor bir yayın talimatı değildir.
