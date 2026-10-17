# Gemi fotoğrafları — ilk yerel arşiv grubu

İnceleme: 17 Ekim 2026. Dört AWM ekran kopyası kurum sayfasındaki indirme bağlantısından alındı; görüntüler açılarak incelendi. Her fotoğrafın yanındaki JSON dosyası kaynak ve indirme URL'sini, kayıt numarasını, kaynak tarihini, fotoğrafçıyı biliniyorsa adını, hak kanıtını, Türkçe açıklamayı, alt metni, boyutları ve SHA-256 özetini taşır. Toplu kayıt `manifest.json` içindedir. Tarihsel kaynak kataloğunun şeması değiştirilmedi.

- Bouvet, P00369.014: https://www.awm.gov.au/collection/C50930 . Kesin gün ve fotoğrafçı kayıtta belirtilmiyor. Geminin Çanakkale'de olduğu tanımı kurum künyesine dayanır; görseldeki kıyı ayrıca teşhis edilmedi. Batış anı diye kullanılmaz.
- Ocean, A02360: https://www.awm.gov.au/collection/C1004447 . Ocak 1915, Süveyş Kanalı; fotoğrafçı bilinmiyor. Geminin güvertesindeki mürettebatı gösterir, Çanakkale'deki batışı değil.
- AE2, H12541: https://www.awm.gov.au/collection/H12541 . Kayıt tarihi 1915; Büyük Avustralya Körfezi çekim yeri açıklamada ihtimalli. Donör G. Haggard, fotoğrafçı olarak atanmadı. Çanakkale çekimi diye etiketlenmez.
- Triumph'tan kurtulanlar, G00755: https://www.awm.gov.au/collection/C1010753 . Mayıs 1915, denizde; fotoğrafçı Ernest Brooks. Kurum açıklaması Lord Nelson'a yanaşmayı tanımlar; kesin çekim günü üretilmedi.

Hak durumu: Her dört nesnenin kendi kurum kaydı kamu malı olduğunu belirtiyor; sayfa altındaki genel telif metni nesneye ait bu alanla karıştırılmadı. Kurumun sunduğu kopyalar değiştirilmeden tutuldu. Künye ve görsel incelemesi, nesnenin tüm tarihsel iddialarının doğrulanması anlamına gelmez. Fotoğrafın görünen denizi veya kıyısı enkaz koordinatına dönüştürülmedi.

Irresistible için Library of Congress 94505518 adayı bulundu, ancak hem kurum sayfası hem JSON isteği 403 verdi. İndirilmedi; erişilmiş ve incelenmiş görsel olarak sayılmadı. Aday URL: https://www.loc.gov/item/94505518/ .

Beş yayımlanmış enkaz noktası ayrı araştırma dosyasında toplandı: `research/ux-audit/gemi-enkaz-konumlari-2026-10-17.geojson`. GeoJSON boylam/enlem sırasındadır; kaynak datum belirtmediğinden dönüşüm doğruluğu ile saha doğruluğu ayrıdır. Bouvet, Ocean, Goliath ve Triumph için mevcut açık konum sorunları kapanmadı; bu dosyaya tahmini yeni nokta eklenmedi.

Fotoğraflar ve konum derlemesi bu tur siteye eklenmedi; canlı yayın, commit veya push yapılmadı. Mevcut ham arşive ve scraper'a dokunulmadı.

## Devam çalışması

Arşiv altı görsele ulaştı. G00198 (Ernest Brooks, Mayıs 1915) kurtulanların grup fotoğrafıdır: https://www.awm.gov.au/collection/G00198 . P04411.002, E15 fotoğrafıdır: https://www.awm.gov.au/collection/C1068415 ; künye tarihi yaklaşık 18 Nisan 1915 olarak korunur. İkisinin de kurum künyesi, kamu malı alanı ve görüntüsü incelendi.

İlk dört fotoğraf yerel Donanma sayfasına kaynak ve açılır künye ile eklendi; images/ships/ kopyaları arşiv dosyalarıyla aynı özet değerine sahiptir. Altı kaydın published=false alanı canlı yayına çıkılmadığını gösterir; yerel kullanım sitePreparedPath alanındadır.

## Komutan portreleri

Arşiv sekiz kayda ulaştı. Mustafa Kemal A05319 (https://www.awm.gov.au/collection/A05319), kurum künyesinde 1915/Gelibolu olarak kayıtlıdır. Ian Hamilton A03549 (https://www.awm.gov.au/collection/C1007445) için çekim tarihi belirtilmez. Her iki portre indirilip görüntüsü incelendi ve yerel komutan sayfasına kaynaklı künye ile eklendi. Kurum kayıtlarının kamu malı alanı okundu. Görev ve olay tarihlerinin tümünü portreyle doğrulama iddiası yoktur. Canlı yayın yapılmadı.
