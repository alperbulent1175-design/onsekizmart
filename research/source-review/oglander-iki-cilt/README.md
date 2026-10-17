# Oglander araştırma paketi

[Okuma ve erişim raporu](OKUMA-RAPORU.md) kapsamı ve eksikleri açıklar.

Bu paket, belirlenmiş açık kitap dosyaları üzerinde yerel araştırma içindir. Projenin scraper'ını, ham arşivini, tarihsel kaynak kataloğunu veya siteyi değiştirmez. Otomatik yayın yapmaz.

`python research/source-review/oglander-iki-cilt/tarama_hazirla.py` yalnız üç sabit Internet Archive kaydındaki belirlenmiş PDF listesini alır; mevcut dosyayı özet değeri doğruysa yeniden indirmez. Sunucu hatasında Internet Archive üstverisinin verdiği iki alternatif sunucuyu kullanır. İndirilen dosyalar `ham/` altında kalır.

`python research/source-review/oglander-iki-cilt/dizin_olustur.py` ağ isteği yapmadan, dosya özetlerini kontrol ederek konu/sayfa dizinlerini üretir. İnceleme tarihi, kayıtların mevcut 17 Ekim 2026 araştırma grubuna aittir; yeniden çalıştırma yeni bir insan incelemesi sayılmaz.

Tam metin araştırma kopyaları `ham/` içinde Git dışında tutulur. Açık erişim veya platformdaki telif etiketi, tam metin çeviriyi/görselleri yeniden yayımlama hakkının bağımsız doğrulaması sayılmaz. Olay iddiaları, sayılar ve koordinatlar bu dizinden otomatik olarak doğrulanmış duruma geçirilmez.
