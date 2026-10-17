# Batık koordinatları ve atlas karşılaştırması

İnceleme: 17 Ekim 2026. Mevcut atlas verileri, yayımlanmış araştırma metni ve haritalar karşılaştırıldı. Batış anı, mayın/torpido isabeti, terk/tahliye yeri ve bugünkü enkaz ayrı konumlardır. Birinin koordinatı diğerlerini doğrulamaz. Bu çalışma hidrografik ölçüm değildir.

## 18 Mart gemileri

- Irresistible: Önceki atlas noktası 40.038200 K, 26.287500 D. Kedioğlu ve Öz (2023), basılı s.76, enkaz konumunu derece/ondalıklı dakika biçiminde verir. Ondalık karşılığı 40.073967 K, 26.340683 D. İki noktanın haversine uzaklığı yaklaşık 6,0 km. Yerel atlas işareti yayımlanmış enkaz noktasına taşındı. Kaynak datum belirtmiyor; metre düzeyinde saha doğruluğu ilan edilmedi. Başlık ve kart açıklaması enkaz konumunu isabet/tahliye yerinden ayırır; konum kaynağına doğrudan bağlantı eklendi.
- Bouvet: Mevcut 40.019170 K, 26.271670 D noktası korundu. Ayhan Aktar'ın 2017 makalesindeki Map 1 ve koordinat kaynağını anlatan dipnot incelendi. Açık sayısal koordinat tablosu bulunmadı; harita pikselinden koordinat uydurulmadı. Başka sitelerdeki kaynaksız sayılar atlas doğrulaması sayılmadı. Kart açıkça doğrulanmamış yaklaşık gösterim olarak düzenlendi.
- Ocean: Mevcut 40.031500 K, 26.278800 D noktası korundu. İncelenen kaynaklarda bu noktanın kesin enkaz yeri olduğunu destekleyen kullanılabilir açık sayısal dayanak bulunamadı. Aynı adlı farklı gemilerin koordinatları ve ikincil site sayıları kullanılmadı. Kart açıkça doğrulanmamış yaklaşık gösterim olarak düzenlendi.

## Diğer olay sayfalarındaki batan gemiler

- Majestic: Aynı saha araştırmasının basılı s.81'inde enkaz koordinatı var; derece/ondalıklı dakika dönüşümü 40.044117 K, 26.165150 D. Mevcut olay haritada Seddülbahir mevkisine bağlı; kale/mevki işareti enkaz diye taşınmadı. Ayrı enkaz işaretinin tarih/katman düzeniyle entegrasyonu açık.
- Goliath: Mevcut olay haritada Morto Koyu mevkiine bağlı. Koy merkezi enkaz koordinatı değildir. Bu incelemede kullanılabilir sayısal birincil dayanak doğrulanmadı.
- Triumph: Mevcut olay Arıburnu mevkiine bağlı. Nautilus NA004 seferinin metni araştırmayı doğruluyor, ancak sayfada açık sayısal enkaz koordinatı yok. Ayrı bir enkaz noktası türetilmedi.
- Barbaros Hayreddin: Mevcut olayda ayrı harita noktası yok; doğrulanmış koordinat bulunmadan yeni işaret eklenmedi.

## Kaynaklar ve inceleme izi

1. Çetin Kedioğlu ve M. İdil Öz (2023), Current condition of the Dardanelles Campaign shipwrecks from a diver’s point of view and technical diving requirements, TÜDAV yayın no.69, s.73–98. ÇOMÜ açık erişim kopyası: https://acikerisim.comu.edu.tr/bitstreams/1196b458-36ad-41bc-ab41-87c8517b49b9/download . İlgili s.76 ve s.81 sayfaları metin ve görüntü olarak incelendi; s.74 yöntem bölümü okundu. Kanıt yazımları ve durum ayrı JSON kaydındadır.
2. Güncel TÜDAV kitap PDF'si: https://www.tudav.org/images/Kitaplar/shipwrecks-of-the-gallipoli-campaign-and-protection-of-marine-biodiversity_53833.pdf . Eski wp-content adresi doğrudan istekte 404 verdi; güncel kitap sayfasından yeni PDF bulundu. Genel batık haritası da görüntü olarak kontrol edildi.
3. Ayhan Aktar (2017), Who Sank the Battleship Bouvet on 18 March 1915?, DOI 10.1080/07292473.2017.1356591. https://honesthistory.net.au/wp/wp-content/uploads/Aktar-A.-Who-Sank-the-Battleship-Bouvet-on-18-March-1915-The-Problems-of-Imported-Historiography-in-Turkey.pdf . Map 1 basılı s.6; koordinat kaynağı dipnotu basılı s.13. Batış nedeni tartışmasından bu koordinat incelemesinde yeni hüküm çıkarılmadı.
4. Nautilus/Ocean Exploration Trust, NA004: https://nautiluslive.org/cruise/na004 . Sefer metni okundu; sayısal koordinat doğrulaması yerine kullanılmadı.

## Haritaya aktarım kontrolü

Leaflet işaret üretimi testi üç geminin güncel veri koordinatlarını enlem-boylam sırasıyla aldığını doğruluyor. Yerel gerçek tarayıcıda Irresistible açıldı; yeni başlık, belirsizlik açıklaması ve PDF kaynak bağlantısı görüldü. Ekrandaki işaret çapası ve Esri karo indislerinden Web Mercator geri hesabı 40.073999 K, 26.340752 D verdi; hedef koordinatla çizim yuvarlaması içinde uyumlu. Bu yöntem ekrana aktarımı denetler, tarihsel doğruluk veya saha ölçümünü değil. Konsol hata listesi boştu.

80 JavaScript ve 267 Python testi geçti. Koordinat değişikliği yalnız kaynak bulunan Irresistible içindir. Diğer sayfalar için yanlış kesinlik verilmedi. Tarihsel kaynak kataloğu şeması, scraper ve ham arşiv değiştirilmedi. PDF'ler/görüntüleri yalnız geçici araştırma alanında incelendi, siteye görsel olarak eklenmedi. Yeni commit, push veya canlı yayın yapılmadı.
