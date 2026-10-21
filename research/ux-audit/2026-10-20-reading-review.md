# Mobil olay okuması ve menü — 20 Ekim 2026

## Değişiklik
Mobil olay sayfalarındaki yapışkan gezinme şeridi ana menünün altında kalacak biçimde düzenlendi. Ortak stilin önbellek sürümü 28 olay sayfasında ve sayfa şablonunda yenilendi. 18 Mart açılış anlatısına olay-ozeti adlı, odaklanabilir bölüm hedefi eklendi. Dokuz kaynak bölümünden olay özetine dönüş bağlantısı var; eski kaynak dizini bağlantıları korunuyor.

## Tarayıcı kontrolü
Düzeltme öncesinde 320 px görünümde Harita ve Kronoloji, 390 px görünümde Harita bağlantısının merkezi event-actions şeridiyle örtülüyordu. Son kontrolde 320/390 px iframe içinde 10.000 pikselden fazla kaynak okuma kaydırması yapıldı. Şerit 64 px üst konumunda, katmanı 30; ana menü katmanı 40. Görünür menü bağlantılarının tamamında merkez nokta doğru bağlantıya ulaşıyor. Yatay taşma yok. Önce/sonra ölçümleri menu-before.json ve menu-after.json adlı aynı tarihli dosyalarda tutulur.

Bouvet kaynak notundaki Olay özetine dön bağlantısına tarayıcıda basıldı. Olayın özeti bölümü görüldü ve document.activeElement.id olay-ozeti oldu. Yeni dönüş bağlantılarının sayısı 9. Gerçek telefonda dokunma testi yapılmadı.

## İçerik ve test
Dış kaynak URL'leri ve q içindeki kanıt alıntıları değişiklik öncesi kayıtla birebir aynı. Yeni tarihsel iddia, koordinat, saat veya zayiat toplamı eklenmedi. Scraper, ham arşiv ve kaynak kataloğu değiştirilmedi.

138 JavaScript + AGENTS.md içindeki 18 Python = 156 test geçti. git diff --check temiz. Değişiklikler yerel; commit, push veya yayın yapılmadı.
