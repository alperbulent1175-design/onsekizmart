# İncelenmiş fotoğraf arşivi

İnceleme tarihi: 17 Ekim 2026. Yerel grupta 44 benzersiz fotoğraf vardır. Kaynaklar, kanıt özetleri, çekim tarihleri, hak alanları ve kullanılan sayfalar `manifest.json` içindedir; her fotoğrafın `.jpg.json` dosyası aynı kaydı taşır.

- [Çalışma raporu](CALISMA-RAPORU.md): kapsam, tamamlananlar ve açık kalanlar.
- `coverage.json`: 25 komutan, 28 olay sayfası ve Donanma kartlarının görsel durumu; üretici tarafından güncellenir.
- `candidates.json`: kullanılmayan adaylar ve kullanılmama nedenleri. Bu dosya doğrulanmış görsel envanteri değildir.

## Yerel sayfaları güncelleme

Proje kökünde `python build_photo_archive.py` galerileri incelenmiş kayıtlardan üretir. `python build_photo_archive.py --check` çıktılar güncelse sıfır durum kodu döndürür. İşlem ağ isteği, scraper, commit, push veya canlı yayın içermez.

Dosya özeti, kaynak, hak alanı ve görsel inceleme durumu doğrulanmadan çıktı yazılmaz. Desteklenen açık lisansın kanıtı, atfı ve değişiklik bilgisi eksikse de işlem durur. Ham araştırma kopyası bulunmayan temiz Git kopyasında `images/` dosyası aynı özetle doğrulanarak kullanılır. Yeni görsel önce açılıp incelenmeli; manifest ve yan künye dosyası aynı tutulmalıdır.

## Kullanım sınırı

42 AWM görselinin kendi kayıtlarında kamu malı alanı okundu. Bundesarchiv Bild 183-R36163 ve Bild 183-H29994, kurumun Commons’a sağladığı kopyadaki CC BY-SA 3.0 Almanya lisansıyla ayrı tutulur; atıf, lisans kaydı, lisans bağlantısı ve değiştirilmediği bilgisi künyede görünür. Kamu malı olarak işaretlenmedi. Kurumun indirme kopyası korunur; kırpma, renklendirme, filigran silme ve yapay iyileştirme yapılmadı. Sayfa altındaki genel telif metni nesnenin hak alanıyla karıştırılmadı. Hak durumu belirsiz kayıtlar siteye aktarılmadı.

Fotoğraf künyesinin incelenmesi bütün tarihsel iddiaların doğrulandığı anlamına gelmez. Çekim günü bilinmiyorsa üretilmez. Sonraki yıllara ait portreler ve muharebe sonrası görüntüler açıkça etiketlenir. Hiçbir görselden enkaz koordinatı çıkarılmadı.

`published` alanı eski araştırma iş akışından kalmıştır; gerçek yayın durumu için dağıtım raporuna bakılır. Önceki dokuz fotoğrafın yayını `research/deployment/2026-10-17-photo-archive/` altında kayıtlıdır. Bu çalışmadaki yeni görseller henüz yereldir. Ham araştırma `.jpg` dosyaları GitHub gönderim listesine alınmaz; sitede kullanılan `images/` kopyaları ve künyeler ayrı tutulur. Tarihsel kaynak kataloğu değiştirilmedi.

Bild 183-H29994 kaydındaki `originalCopy` alanı yüksek çözünürlüklü asıl dosyanın yolunu ve özetini tutar; site, kaynağın sağladığı 1280 piksel kopyayı kullanır. Monro adayı, kullanım metinlerinin incelemesi açık olduğu için yalnız aday envanterindedir.
