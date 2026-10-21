# Konum ve mayın çizgisi incelemesi — 20 Ekim 2026

31 nokta ile 14 çizgi envantere alındı. Sayısal geçerlilik, benzersiz kimlikler, önceki koordinatlar, değişim mesafesi ve kaynak durumu `konum-denetimi.json` içinde kayıt bazında saklanır. Geçerli enlem/boylam aralığı tarihsel doğruluk anlamına gelmez.

## Sonuç

- Irresistible: önceki incelemede kaynaklanan derece/ondalıklı dakika dönüşümü korundu. Yayımlanmış enkaz noktasıdır; mayın isabeti, tahliye ve WGS84 datum doğrulaması değildir.
- Conkbayırı: Alan Başkanlığının Atatürk Zafer Anıtı sayfasındaki `Ziyaret Noktasına Git` bağlantısı `destination=40.250658, 26.308544` içeriyor. Önceki `[40.2417,26.304]` yerine bu nokta kullanıldı. Değişim yaklaşık 1068 m. Kart günümüzdeki anıt çevresini temsil ettiğini açıkça belirtir; 1915 siperinin koordinatı olarak sunulmaz.
- Kıyı incelemesi devamında Kilitbahir, Rumeli Mecidiye, Seddülbahir, Namazgâh, Rumeli Hamidiye, Anadolu Hamidiye, Çimenlik ve Anzak Koyu için kurumsal noktalar eşleştirildi. Sayısal kaynak dayanağı bulunan nokta sayısı 10 oldu; 21 noktanın kaynak paketi hâlâ tamamlanmadı. Bu sonuç diğer noktaların tümünün yanlış olduğunu göstermez.
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

## Anadolu yakası ve mobil okuma devam incelemesi

[Anadolu Hamidiye](https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/anadolu-hamidiye-tabyasi) sayfasındaki güncel harita hedefi `[40.138566,26.404352]` ile eşleştirildi; önceki noktadan yaklaşık 278 m farklıdır. [Kültür Portalı Çimenlik Kalesi](https://www.kulturportali.gov.tr/turkiye/canakkale/gezilecekyer/cimenlik-kalesi) sayfasında harita merkezinin `[40.146395,26.399161]` olduğu ve Çimenlik işaretinin aynı merkezde üretildiği doğrudan sayfanın harita tanımından okundu. Önceki noktadan yaklaşık 148 m farklıdır. Koordinatlar yalnız görünür harita kaydının yorumuyla değiştirilmedi; sayısal dayanak kaynakta bulundu. İki sayfa HTTP 200 ile 20 Ekim 2026'da okundu.

Kaynaklar ve önceki/yeni değerler `anadolu-yakasi-karsilastirmasi.json` içindedir. Valiliğin Dardanos şehitliği haberi incelendi; tabya/rasat yerinin sayısal koordinatını vermediği için yeni bir Dardanos noktası atanmadı. Dışarıdaki kaynaksız koordinatlar kullanılmadı.

Mobil panelde konum kanıtının ayrıntıları kapalı başlayan «Konum dayanağını göster» bölümüne taşındı. Yaklaşık konum ve kapsam notu açıkta kalır. Kaynak URL'si, kanıt metni, inceleme tarihi, datum belirsizliği ve tarihsel mevzi sınırı silinmedi. Bölümü açmak oynatmayı durdurur, kapatmak yeniden başlatmaz. Var olan enkaz kaynakları da aynı düzende korunur.

Yerel tarayıcıda iki kartın kaynakları açıldı. Anadolu Hamidiye'de ayrıntıların başlangıçta kapalı olduğu, belirsizlik notunun görünür kaldığı ve 320/390 pikselde taşma olmadığı doğrulandı. Görsel: `research/ux-audit/2026-10-20-coordinate-details-mobile.jpg`. 186 JavaScript ve 18 zorunlu Python = 204 test geçti. Yeni tutarlılık testi tüm kurumsal noktaların kaynak metnindeki sayısal hedef ile harita koordinatını karşılaştırır.

## Arıburnu çıkarma sahası devam incelemesi

[Anzak Koyu kurum kaydının](https://canakkaletarihialan.gov.tr/tr/ziyaret/diger-ziyaret-noktalari/anzak-koyu) ziyaret hedefi `[40.240522,26.281153]`; önceki `[40.2406,26.2772]` noktasından yaklaşık 336 m farklıdır. Bağlantı 20 Ekim 2026'da doğrudan kurum sayfasından okundu. Nokta günümüzdeki kıyı ziyaret yerini temsil eder; geometrik koy merkezi, ilk sandalların çıktığı yer veya tarihsel siper diye sunulmaz. Önceki kesin koy merkezi ifadesi kaldırıldı.

[Zığındere Nuri Yamut Anıtı](https://canakkaletarihialan.gov.tr/tr/ziyaret/sehitlikveanitlar/zigindere-nuri-yamut-aniti) ve [Sargıyeri Şehitliği](https://canakkaletarihialan.gov.tr/tr/ziyaret/sehitlikveanitlar/sargiyeri-sehitligi) metinleri okundu. Belirli anıt/şehitlik noktaları bütün vadi merkezi yerine geçirilmedi. Kumkale için il müdürlüğü kale anlatısının arama kaydı görüldü; tam sayfa erişimi zaman aşımına uğradığından sayısal kaynak varmış gibi kaydedilmedi.

Kaynak, önceki/yeni nokta ve kullanılmayan adayların sınırları `cikarma-sahalari-karsilastirmasi.json` içindedir. Arıburnu kartı 390 pikselde açıldı, konum kanıtı ve kapsam açıklaması görüldü. Kapalı kara katmanı karttaki düğmeyle açıldı ve tam adlı işaret görünür oldu; taşma yoktu. Görsel: `research/ux-audit/2026-10-20-ariburnu-coordinate-mobile.jpg`. 186 JavaScript + 18 Python = 204 test geçti.

İlk harita sürümü `d2af876` commit'iyle GitHub'a gönderildi ve daha önce canlıya alındı. Namazgâh/Hamidiye devam değişiklikleri `3018dd1` ile GitHub'a gönderildi; henüz yayımlanmadı. Anadolu yakası, Arıburnu ve mobil okuma değişiklikleri yereldedir. 21 noktanın kaynak eşleştirmesi ile tarihli mayın krokisinin sayısal dönüşümü açık iştir; tamamlanmış gösterilmez.

## Kanlısırt ve Anafartalar kapsam ayrımı

Kanlısırt Kitabesi kurum kaydı kitabenin platonun doğu ucunda olduğunu belirtir. Harita hedefi `[40.228903,26.290935]` kitabenindir; mevcut plato noktası yerine geçirilmedi. DVA Anzac Portal harita açıklaması Suvla, Anzak Koyu ve Anafarta köylerinin bölgesel ilişkisini açıklar; atlasın sayısal saha merkezini doğrulamaz. İki tam sayfa 20 Ekim 2026 tarihinde okundu. Kaynak URL, kısa kanıt, tarih ve inceleme statüsü ayrı `coordinateReview` alanına alındı. Anafartalar kartındaki kesin saha merkezi ifadesi temsili nokta olarak düzeltildi. Konum incelemesi panelde açılabilir; sayısal konum dayanağıyla karıştırılmaz. Noktalar değişmedi; 10 sayısal kaynak / 21 açık nokta ve 0 doğrulanmış hat geometrisi sayıları korundu.

## Kirte ve Kerevizdere kapsam incelemesi

DVA Anzac Portal harita açıklaması Kirte ile gerisindeki Achi Baba tepesini ayrı adlandırır. Alan Başkanlığı Fransız Topları kaydı Kerevizdere muharebelerine değinir; top ziyaret noktası bütün dere veya muharebe sahası merkezi değildir. İki tam sayfa 20 Ekim 2026 tarihinde okundu. Kirte köy çevresi ve Kerevizdere saha işareti için sayısal konum doğrulaması yapılmış sayılmadı; koordinatlar değiştirilmedi. Açıklamalar temsili kapsamı belirtir. Kaynak URL, kısa kanıt, tarih ve durum `kirte-kerevizdere-karsilastirmasi.json` ile kartlardaki `coordinateReview` alanındadır. Fevzi Çakmak Anıtı sayfası da okundu; anıt noktası Kirte köyü yerine geçirilmedi.

Coğrafi anlatım incelemelerinde “İncelenen kaynak” ve “Kaynakta okunan ifade” etiketleri kullanılır; sayısal dayanak etiketleri kullanılmaz. Yeni davranış testi dört inceleme kaydında bu ayrımı ve güvenli URL/eksik tarih davranışını kontrol eder. 187 JavaScript + 18 Python = 205 test geçti. 10 sayısal kaynak / 21 açık nokta ve 0 doğrulanmış hat geometrisi sayıları değişmedi.

## Kaynak kartlarında Türkçe okuma

Anafartalar ve Kirte coğrafi inceleme kartlarındaki İngilizce kısa kanıtlar değiştirilmeden korundu; `lang=en` ile özgün alıntı olarak gösterilir. Atlasın Türkçe çevirisi ayrı etiketle verilir. Çeviri yeni koordinat veya tarihsel doğrulama sayılmaz; önceki inceleme tarihi ve statüsü korunur. Boş çeviri gösterilmez, içerik HTML olarak işlenmez. 191 JavaScript ve 18 Python = 209 test geçti.

## Kumkale yeniden erişim

İl Kültür ve Turizm Müdürlüğünün Kaleler sayfası 20 Ekim 2026 tarihinde doğrudan HTTP 200 ile indirildi ve Kumkale bölümü okundu. Önceki zaman aşımı kaydı geçmiş denemeyi belirtir; yeni erişim `kumkale-devam-incelemesi.json` içindedir. Kale ile bugünkü köy ve şehitlik aynı nokta değildir. Kaynak metni sayısal konum vermediğinden mevcut koordinat taşınmadı; anlatım incelemesi olarak kartta gösterildi. Sayısal kaynak sayısı 10, açık nokta sayısı 21 olarak kaldı. Ham sayfa yalnız yerel araştırma klasöründedir.

## Dardanos devam incelemesi

Kültür Portalı Hasan Mevsuf Şehitliği Tabya ve Bataryalarının Restorasyonu kaydı 20 Ekim 2026 tarihinde tam sayfa okundu. URL yolunda Troia ifadesi bulunmasına rağmen sayfanın gerçek başlığı ve açıklaması Hasan Mevsuf alanına aittir; künye başlığa göre kaydedildi. Yer anlatımı sayısal koordinat, top veya rasat noktası vermez. Koordinat değiştirilmedi. Kart özetindeki kaynağı tamamlanmamış kesin isabet saati kaldırıldı; eski taslak notların durumu yükseltilmedi. Araştırma kaydı `dardanos-devam-incelemesi.json` içindedir.

## Mesudiye / Yıldız / Baykuş toplu kaydı

Alan Başkanlığı Mesudiye Topu sayfası 20 Ekim 2026 tarihinde tam metin okundu. Baykuş (Mesudiye) adlandırması, mevcut başlıktaki isimlerin üç ayrı batarya olarak kesin sunulamayacağını gösterir; Yıldız ilişkisi bu kaynakta açıklanmaz. Başlık toplu kayıt olarak belirtildi. Özetteki kaynağı tamamlanmamış isabet ve toparlanma anlatımı kaldırıldı. Sergilenen topun ziyaret noktası tarihsel batarya veya gemi batığı yerine kullanılmadı. Koordinat ve kaynak statüsü yükseltilmedi. İnceleme `mesudiye-adlandirma-incelemesi.json` içindedir.
