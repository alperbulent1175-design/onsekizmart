# Arama kartı ve bölüm yönlendirmesi — 21 Ekim 2026

Mobil aramada Arıburnu sonucunu Enter ile açarken odak kart başlığındaydı, ancak kart başlangıcı yaklaşık 783 pikselde kalıyordu. Kullanıcı kartı okumak için yeniden kaydırmak zorundaydı.

Arama seçimi artık ortak `focusSelectedPanel` yordamını kullanır. Seçimden sonra sonuç listesi kapanır, sorgu korunur, başlık odak alır ve kartın başlangıcı sabit menünün altına gelir. Tarayıcıdaki son kontrolde aynı kart başlangıcı yaklaşık 76 piksel oldu. Kapatma düğmesinin erişilebilir adı, mevki ve şematik hat kartlarını da kapsayan `Bilgi kartını kapat` olarak düzeltildi.

Alt sayfaların ortak gezinmesinde en yakın bölüm bağlantısı işaretlenir. Dizin sayfasında `aria-current="page"`, ayrıntı sayfasının ait olduğu üst bölümde `aria-current="location"` kullanılır. Olay sayfasında `Olaylar` işareti tarayıcıda görüldü. Saf çapalar, kök harita bağlantısı, dış adresler ve benzer başlayan başka yollar seçilmez. Bağlantı adresleri değiştirilmez.

234 JavaScript + 24 Python testi geçti. Arama işleyicisiyle gerçek odak/kaydırma yordamının birlikte çalışması ve bölüm seçimi sınırları test edildi. Tarihsel içerik, koordinatlar, katalog ve scraper değiştirilmedi. Commit, push ve yayın yapılmadı.

Görsel: `2026-10-21-search-card-position-mobile.jpg`.
