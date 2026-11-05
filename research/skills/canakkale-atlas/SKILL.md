---
name: canakkale-atlas
description: Çanakkale Cephesi Dijital Atlası için kaynak temelli tarih araştırmasını, mevcut 88 sayfanın yerel geliştirmesini ve kabul kontrollerini kaldığı yerden sürdür. Bu projeye ait içerik, donanma, kronoloji, harita, kaynak ve yayın hazırlığı çalışmalarında kullan.
---

# Çanakkale Cephesi Dijital Atlası

Çalışma alanı: `C:/Users/crawi/Desktop/onsekizmart-atlas`. Mevcut HTML/CSS/JavaScript/Leaflet mimarisini ve kaynak kataloğunun şemasını koru. Next.js/CMS veya yeni paralel iş kuyruğu ekleme. Kullanıcının güncel talebi bu skill'den önce gelir.

## Her çalışmada başlangıç

1 Kasım verimlilik kararı: aynı sohbette değişmeyen plan belgelerini tekrar tam dökme. Proje AGENTS.md verimli çalışma bölümünü ve hashleri doğrulanmış `research/agent-context-cache.json` özetini kullan; belge değişirse ilgili kısmı yeniden oku. Güncel iş ve tek sonraki adım DEVAM.md son kaydındadır. Kısa çıktı/tek ajan varsayılanı kanıt ve zorunlu test koşullarını azaltmaz.

Şunları projeden oku; skill içindeki geçmiş bilgiyi güncel dosyaların yerine koyma:

1. `AGENTS.md`, `DEVAM.md` son kayıtları, ilgili mevcut site/veri ve son araştırma notları.
2. `research/reports/2026-10-25/ATLAS-DURUM-VE-YOL-HARITASI.md` ve aynı dizindeki `roadmap.json`.
3. `research/reports/2026-10-25/ILK-SURUM-BITIS-LISTESI.md`.
4. `research/reports/2026-10-28/UX-SEO-UYGULAMA-PLANI.md`.

R01–R24 kalıcı kuyruğunda P0→P1→P2→P3, aynı öncelikte kimlik sırası ve bağımlılıkları izle. `DEVAM.md` son somut adımından en yüksek öncelikli yapılabilir işe devam et. R01'in eski on başarısızlığı çözülmüştür; yalnız yeni gerçek başarısızlık varsa yeniden değerlendir. Bir iş bitince çalışma süresi elveriyorsa sıradakine geç. Engel varsa neden ve çözüm koşulunu kaydet, bağımsız işe devam et; aynı sonuçsuz sorguyu tekrar üretme.

İlk sürüm mevcut 88 sayfadır. Yeni sayfa yerine mevcut kritik iddiaları, anlatıları, harita/saat kapsamını ve kaynak erişimini tamamla. Sayfa sayısı, test başarısı veya birkaç kart düzeltmesi genel paketi tamamlamaz. Sekiz bitiş kapısını yalnız kabul kanıtlarıyla kapat; ölçülmemiş yüzde/bitiş tarihi verme.

## Araştırmayı okuyucuya dönüştür

- Tarihsel bilgi, sayı, künye, koordinat veya zayiat üretme. Kanıt yeterliyse anlaşılır yerel okuyucu metnine/işleyen arayüze aktar; yalnız araştırma notuyla yetinme.
- İddia bazında URL, kısa gerçek kanıt, sayfa/yaprak/giriş, olay tarihi, belge/rapor tarihi, yayın tarihi, erişim tarihi, doğrulama durumu ve okuma kapsamını ayrı tut. Bilinmeyen alanı `null` veya açık belirsizlik bırak.
- Gerçek pasajı incele. Özgün görüntü, çevrimyazı, akademik aktarım, katalog açıklaması ve kurum özetini birbirinin yerine kullanma. Bütün eser okunmadıysa seçili sayfa/bölüm okunduğunu belirt.
- Kurum ana sayfası tek iddianın kanıtı değildir. Aynı kaynağı aktaran iki eser iki bağımsız tanıklık değildir. Kaynak durumunu kanıtsız `iddia_dogrulandi` yapma.
- Arama sonucunda bulunamaması olayın yaşanmadığını göstermez. Eski taslak sayıyı belirsizlik cümlesi yanında tutmak gerekiyorsa gerekçesini değerlendir; dayanağı yoksa sayıyı kaldırıp boşluğu açıkla.
- Kartın `dt/dd`, alt açıklaması, harita paneli, veri dosyası ve bağlantılı anlatısını birlikte karşılaştır. Bir alanda düzeltilen kesinlik başka alanda kalabilir. Eski hash/pending listeleri güncel kabul kaydıyla uzlaştır; bunu yeni tarihsel doğrulama diye sunma.

İddia türüne göre [tarihsel ayrımlar ve önceki inceleme yolları](references/history.md) dosyasını oku. Önceden çözülmüş kapsamları sırf aday listesinde kaldı diye yeniden açma.

## UX ve kabul

UX planı R01–R24 sırasını değiştirmez. Önce içerik güvenilirliği, kısa cevap ve neden–gelişme–sonuç; sonra bulunabilirlik/bağlamlı geçişler, mobil/klavye, mevcut lacivert-serিফ kimliğinde hiyerarşi, en son ölçülmüş performans ve SEO. Yeni dekoratif tasarımı kritik doğruluğun önüne alma.

Arayüz değişirse masaüstü ve 320 piksel dar ekranı, yatay taşmayı, çalışan Leaflet haritayı, arama/süzgeç/temizle ve seçili kayda dönüşü kontrol et. DOM varlığını görsel okunabilirlik yerine; emülasyonu fiziksel cihaz/ekran okuyucu testi yerine yazma. Tamamlanmayan kontrolü açık bırak.

[Test, tarayıcı ve yayın deneyimi](references/operations.md) ilgili araç çalışmasında okunmalıdır. Araç adları, sekme kimlikleri ve yetenekler oturuma bağlıdır; geçmiş tutamaçları var sayma.

## Çalışma kaydı ve yetki

Her partide `DEVAM.md` içine iş kimliği, durum (`bekliyor/devam ediyor/tamamlandı/engelli`), değişen dosya/iddia, kaynak ve kapsam, gerçek test sonuçları, kabul koşulu ve sonraki tek somut adımı yaz. Dar alt adım kabulü ile bütün R paketinin durumunu ayır. Eski JSON kabul alanını güncellemek yeni UI testi değildir.

Araştırma ve yerel geliştirme için yeni komut/onay bekleme. Bu skill commit/push/deploy, scraper veya dış mesaj yetkisi üretmez. Yayın gerektiren kısmı açık yeni kullanıcı talebine bağlı kaydet; diğer yerel işleri sürdür. Kullanıcı açık yayın talebi verirse somut hazırlığı tamamlayıp yetkili kapsamda uygula. `archive/` içeriğini GitHub'a gönderme; yeni otomasyon oluşturma veya çoğaltma.

Dinamik son durum yalnız başlangıç yardımıdır: [1 Kasım 2026 anlık görüntüsü](references/handoff-2026-11-01.md). Her zaman daha yeni `DEVAM.md` kaydı önceliklidir.
