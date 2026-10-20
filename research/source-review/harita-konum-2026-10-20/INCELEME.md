# Konum ve mayın çizgisi incelemesi — 20 Ekim 2026

31 nokta ile 14 çizgi envantere alındı. Sayısal geçerlilik, benzersiz kimlikler, önceki koordinatlar, değişim mesafesi ve kaynak durumu `konum-denetimi.json` içinde kayıt bazında saklanır. Geçerli enlem/boylam aralığı tarihsel doğruluk anlamına gelmez.

## Sonuç

- Irresistible: önceki incelemede kaynaklanan derece/ondalıklı dakika dönüşümü korundu. Yayımlanmış enkaz noktasıdır; mayın isabeti, tahliye ve WGS84 datum doğrulaması değildir.
- Conkbayırı: Alan Başkanlığının Atatürk Zafer Anıtı sayfasındaki `Ziyaret Noktasına Git` bağlantısı `destination=40.250658, 26.308544` içeriyor. Önceki `[40.2417,26.304]` yerine bu nokta kullanıldı. Değişim yaklaşık 1068 m. Kart günümüzdeki anıt çevresini temsil ettiğini açıkça belirtir; 1915 siperinin koordinatı olarak sunulmaz.
- Kıyı incelemesi devamında Kilitbahir, Rumeli Mecidiye, Seddülbahir, Namazgâh ve Rumeli Hamidiye için kurumsal ziyaret noktaları eşleştirildi. Sayısal kaynak dayanağı bulunan nokta sayısı 7 oldu; 24 noktanın kaynak paketi hâlâ tamamlanmadı. Bu sonuç diğer noktaların tümünün yanlış olduğunu göstermez.
- Nusret ve 10 enlemesine mayın çizgisi: sayısal geometri doğrulanmadı. Çizgiler taşınmadı; köşe noktaları mayın konumu olarak sunulmadı. Çizim numaraları tarihî hat numarası olarak doğrulanmış değildir.
- Nusret mevcut şemasının hesaplanan uzunluğu yaklaşık 5698 m. Bu yalnız mevcut yazılım geometrisinin uzunluğudur; tarihî mayın döküm uzunluğu değildir. Önceki 100–150 m aralık ifadesinin dayanağı bulunmadığından kaldırıldı. Önceki genel birkaç yüz metrelik sapma sınırı da ölçülmüş bir hata payı olmadığından kaldırıldı.
- Mayın grubu kartındaki kaynaklandırılmamış `11 hat + Erenköy` ve personel sayısı ifadeleri kaldırıldı. Yerlerine sayısal doğrulamanın tamamlanmadığı açıklandı; yeni bir toplam üretilmedi.

## İncelenen kaynaklar ve sınırlar

1. [Alan Başkanlığı, deniz muharebeleri](https://canakkaletarihialan.gov.tr/en/canakkale-battles/naval-battles): Erenköy'de kıyıya paralel 26 mayınlık hat anlatısı okundu. Sayısal uç noktalar verilmedi. `mineReview` yalnız bu anlatı kapsamını kaydeder; geometriyi doğrulamaz.
2. [Alan Başkanlığı, Conkbayırı Atatürk Zafer Anıtı](https://canakkaletarihialan.gov.tr/tr/ziyaret/sehitlikveanitlar/conkbayiri-ataturk-zafer-aniti): metin ve ziyaret bağlantısı incelendi. Harita hedefi güncel anıt noktasıdır. Google yönlendirme sayfasının ayrıca açılmış olduğu iddia edilmez.
3. [Corbett, Naval Operations II, 18 Mart planı](https://www.naval-history.net/WW1Book-RN2-230.JPG): görüntü incelendi. Lejant gemi konumlarını yaklaşık olarak tanımlar. Bu harita ile sayısal datum dönüşümü veya yeni mayın koordinatı üretilmedi. Plandaki mayın sayıları başka kaynaklardaki toplamlarla sessizce birleştirilmedi.
4. [AWM Eren Keui, G7432G1S65VIII48](https://www.awm.gov.au/collection/C1235200): katalog ve bir sayfalık Osmanlıca harita görüntüsü incelendi. Datum/pafta dönüşümü yapılmadı. Harita mayın döküm koordinat çizelgesi sayılmadı.
5. [HGM, Çanakkale Tarihi Alan Haritası 2022](https://www.harita.gov.tr/uploads/files/products/canakkale-tarihi-alan-haritasi-2022.pdf): pafta görüntüsü ve adlandırmalar coğrafi bağlam için incelendi. Morto Koyu kaydının yeniden incelenmesi önceliklidir; mezarlık veya anıt koordinatı koyun merkezine ya da Goliath batığına aktarılmadı.
6. [AWM LIB52015](https://www.awm.gov.au/collection/LIB52015): yalnız katalog okundu; başlık Ocak 1916 durumunu gösterir. Sayısal görüntüsü incelenmiş veya 18 Mart 1915 hattı doğrulanmış sayılmadı.

İndirilen dört harita ve edinim özetleri gitignored `ham/` klasöründedir. Ham dosyalar yayına veya GitHub'a eklenmedi. Katalog şeması ve ham arşiv değiştirilmedi. Scraper çalıştırılmadı.

## Yerel uygulama ve doğrulama

- Mayın çizgileri kaynak bağlantısı, inceleme tarihi ve açık sınırları gösteren kartı açar. Filo çizgileri de şema olarak etiketlenir.
- Çizgiler Tab ile erişilebilir; Enter/Boşluk kartı açar. Kapatınca aynı çizgiye odak döner. Katman kapatılıp açılınca etiket ve klavye davranışı korunur. Kart açılışı oynatmayı durdurur ve eski nokta vurgusunu temizler.
- Rehberde `#konum-denetimi` bölümü ve haritada bu bölüme bağlantı eklendi.
- 183 JavaScript + 18 zorunlu Python testi = 201 test geçti. `git diff --check` temiz.
- Yerel tarayıcı: Conkbayırı kaynak kartı, Nusret Enter ile açılışı, enlemesine çizginin Boşluk ile açılışı, kapatma sonrası odak ve mayın katmanının yeniden açılması denendi. 320 ve 390 pikselde yatay taşma yoktu. Gerçek telefon, ekran okuyucu veya sahada GPS testi yapılmadı.
- Görsel: `research/ux-audit/2026-10-20-mine-line-review-mobile.jpg`.

## Kıyı noktaları devam incelemesi

Alan Başkanlığının üç ayrı kale/tabya sayfası HTTP 200 ile okundu. Her birinin Ziyaret Noktasına Git bağlantısındaki sayısal hedef, uygulama kaydıyla ayrı karşılaştırıldı. Kaynaklar ve önceki/yeni koordinatlar `kiyi-nokta-karsilastirmasi.json` içindedir.

- Kilitbahir: `[40.147656,26.379565]` → `[40.146554,26.380381]`; yaklaşık 141 m.
- Rumeli Mecidiye: `[40.14355,26.3842]` → `[40.141532,26.37561]`; yaklaşık 764 m.
- Seddülbahir: `[40.0447,26.178]` → `[40.042881,26.188885]`; yaklaşık 948 m.

Bu mesafeler eski ve yeni yazılım noktası arasındadır; ölçüm doğruluğu ya da hata payı değildir. Kaynak datum belirtmez. Sayısal hedefler güncel ziyaret noktalarıdır; 1915 komuta yeri, top/vinç konumu veya bütün çıkarma kumsalları doğrulanmış sayılmaz. Kayıtlardaki diğer tarihsel iddiaların doğrulama statüleri yükseltilmedi.

Fransız Mezarlığı ziyaret bağlantısındaki `[40.058054,26.210546]` Morto Koyu merkezine veya Goliath batığına taşınmadı. Koy kaydına bu ayrımı belirten belirsizlik notu eklendi.

Üç yeni sayfa tarayıcıda gerçek atlas bağlantılarıyla açıldı ve kaynak kartları okundu. Rumeli Mecidiye 390 piksel genişlikte Enter ile açıldı, kart başlığına odaklandı; yatay taşma yoktu. Görsel: `research/ux-audit/2026-10-20-coastal-coordinate-mobile.jpg`. 183 JavaScript ve zorunlu 18 Python testi geçti; `git diff --check` temiz.

## Namazgâh ve Rumeli Hamidiye devam incelemesi

[Namazgâh](https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/namazgah-tabyasi) sayfasındaki harita hedefi `[40.145371,26.379579]`; önceki noktaya göre yaklaşık 143 m farklıdır. [Rumeli Hamidiye](https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/rumeli-hamidiye-tabyasi) hedefi `[40.142829,26.377707]`; önceki noktaya göre yaklaşık 369 m farklıdır. İki bağlantı da 20 Ekim 2026 tarihinde HTTP 200 ile okunan kurum sayfalarından alındı. Kaynak ve önceki/yeni noktalar `namazgah-hamidiye-karsilastirmasi.json` içindedir.

Rumeli Hamidiye'nin eski atlas kartında gün boyu ateş edildiği yazıyordu. Kurum sayfası mekanizma hasarı nedeniyle ateş edilemediğini aktarır. Eski kesin cümle kaldırıldı; kurum aktarımı, kısa kanıt ve özgün rapor incelemesinin açık olduğu ayrı `claimReview` alanında kaydedildi. Konum kaynağı tarihsel ateş iddiasının kanıtı gibi kullanılmaz. Tabya kartının kalan sayı ve teçhizat ayrıntılarının statüsü yükseltilmedi. Harita hedefi, alanın ziyarete açık olduğunu göstermez.

Yerel tarayıcıda Rumeli Hamidiye kartındaki çelişki bölümü açıldı; kaynak bağlantısı ve açık inceleme sınırları görüldü. 390 pikselde yatay taşma yoktu. Görsel: `research/ux-audit/2026-10-20-hamidiye-conflict-mobile.jpg`. 184 JavaScript ve 18 zorunlu Python testi: 202 test geçti.

İlk harita sürümü `d2af876` commit'iyle GitHub'a gönderildi ve daha önce canlıya alındı. Namazgâh/Hamidiye devam değişiklikleri bu notun hazırlanması sırasında henüz yayımlanmadı. 24 noktanın kaynak eşleştirmesi ile tarihli mayın krokisinin sayısal dönüşümü açık iştir; tamamlanmış gösterilmez.
