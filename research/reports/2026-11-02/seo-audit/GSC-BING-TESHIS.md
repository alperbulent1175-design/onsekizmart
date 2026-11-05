# Onsekizmart.com — GSC ve Bing teşhisi

İnceleme:2Kasım2026. Kullanıcı site kapsamını Onsekizmart.com olarak doğruladı. Bu rapor hesapların canlı ekranları,Windsor GSC çekimi ve dört canlıHTTP kontrolüne dayanır. Site kodu veya konsol ayarları değiştirilmedi.

## Sonuç

Google siteyi tarıyor ve bazı gerçek içerikleri dizine alıyor;görünürlük henüz çok düşük. Somut teknik açık,harita–anlatı dönüş bağlamının taranabilir parametreli URL kombinasyonları üretmesi ve www sürümünün ayrıca200sunması. Bing’de sitemap kabul edilmiş ama örneklenen iki anaURL taranmamış. Bing canlı ana sayfa testi ise erişim/dizine alınabilirlik engeli göstermedi. Bundan kesin algoritmik ceza veya robots engeli çıkarılamaz.

## Rakamlar ve kapsam

|Kaynak|Dönem|Sonuç|
|---|---|---|
|GSC performans|1–31Ekim talebi;dönen günlük satırlar14–31Ekim|137gösterim,0tıklama,%0CTR,ağırlıklı ortalama konum12,01|
|GSC cihaz|Aynı dönem|Mobil83,masaüstü52,tablet2gösterim|
|Bing performans|Ekranda2Ağustos–1Kasım|0gösterim,0tıklama|
|GSC dizin|Ekranın son güncellemesi23Ekim|156dizinde,1175hariç:1100alternatif canonical,2yönlendirme,73taranmış/dizinde değil|
|Google sitemap|Son okuma2Kasım|Başarılı,88keşfedilenURL|
|Bing sitemap|Son tarama27Ekim|Success,88keşfedilenURL|

156dizindekiURL /88sitemap adresi aynı kapsam değildir. 88/88güncel sayfanın dizinde olduğu bu sayılardan hesaplanamaz. BingSiteExplorer indexed görünümü veri sunmadı;bu ekran tek başına tüm sitenin kesin0indeksli sayfası bulunduğu iddiasına çevrilmedi.

GSC sayfa kırılımında64URL satırı var:17www,9parametreli. Sayfa kırılımı toplam157gösterim;site düzeyi137gösterimle aynı toplama değildir. Sorgu kırılımı29satır/50gösterimdir;tüm sorguların eksiksiz listesi sayılmadı.

Örnek görünür içerikler:John deRobeck15gösterim/konum10,13;ana sayfa11/9,91;HalilSami9/9,00. Bunlar az sayıda gözlem;başlık/snippet başarısızlığını kanıtlamaz.18–24Ekim94,25–31Ekim32gösterimdir;yaklaşık%66düşüş var ama bu küçük ve erken örneklemden ceza veya tek bir sebep çıkarılamaz.2Kasım yayınının performans etkisi bu dönemle ölçülemez.

## Doğru çalışanlar

- John deRobeck URL denetimi:Google’da mevcut,29Ekim son tarama,Googlebot akıllı telefon,tarama/getirme/dizine izin başarılı.Kullanıcının canonical’ı ile Google’ın seçtiğiURL aynı.
- Mevcut Google ve BingHTTPS sitemap’leri88adresle kabul edilmiş.Google’ın2011gönderimli eskiHTTP-www sitemap hatası güncelHTTPS sitemap hatası değildir.
- HTTPana sayfa301ileHTTPS’e gider;robots.txtAllow:/;doğru sitemap bildirimi var.
- Parametreli18Mart örneği200ve temiz non-www canonical verir.www ana sayfa200verir ama canonical non-www’dir.
-1100“doğru standart etikete sahip alternatif” kaydı tek başına bozuk içerik değildir;Google’ın kopyaları ayırabildiğini de gösterir.

## Sorunlar ve yanlış yorumlar

1. URL çoğalması somut. GSC’nin ilk10alternatif ve ilk10taranmış/dizine alınmamış örneği `atlasaDon`, `olayaDon`, `donanmayaDon` gibi dönüş bağlamları taşıyor. Örneğinbir makaleye gidilirken önceki harita bağlamı,sonra başka makale/komutan dönüş adresinin içine tekrar eklenebiliyor. `js/app.js:855`, `js/navigation.js:127` ve145bunu açıklıyor.73kaydı73ayrı güncel makale sanmak yanlış;yalnız10örnek incelendi,diğer63hakkında kesin hüküm yok.
2. www birleştirmesi eksik. https://www.onsekizmart.com/200sunuyor. Canonical doğru olsa da tercih edilenHTTPSnon-www adrese kalıcı yönlendirme iç bağlantılarla birlikte daha tutarlı olur.
3. Bing’de keşif taramaya dönüşmemiş. Ana sayfa ve18MartURL’si“Discovered but not crawled”. Ana sayfanın2017keşif tarihi eski alan adı geçmişidir;ceza kanıtı değildir.2Kasım canlı testte“URL can be indexed by Bing”ve“No SEO/GEO issues found”görülmesi gerçek indeks kaydıyla karıştırılmamalı. Markupinsights yükleme hatası yapılandırılmış verinin geçersizliği kanıtı değildir.
4. Trafik zayıf ama sebebi kesinleşmedi.137gösterim/0tıklama gerçek durum;bu örneklem tüm içeriklerin kötü olduğunu veya bir ceza bulunduğunu söylemeye yetmez. Ortalama12konum bütün sorgularda12.sıra demek değildir.

## Düzeltme sırası ve kabul ölçütü

1. ÖnceURLüretimini düzelt:normal iç bağlantıların href’leri temiz canonical adresler olsun;aynı sekmede geri dönüş bağlamı sessionStorage veya uygun fragment üzerinden korunsun. Açık paylaşım eylemi için gerekli durum adresleri ayrı korunabilir. Bütün dönüş parametrelerini körlemesine silmek harita/komutan/anlatı deneyimini bozar. Kabul:masaüstü/mobil harita→anlatı→komutan→geri akışı çalışırken normal link taraması yeni iç içe query kombinasyonları üretmez;eskipaylaşım linkleri açılır.
2. www→HTTPSnon-www301/308yönlendirmesi ekle. Yol ve gerekli sorgu korunmalı;yönlendirme döngüsü olmamalı;eski adreslere gelen ziyaretçiler aynı içeriğe ulaşmalı. Canonical/sitemap/içlink aynı hostu göstermeli.
3. Bing’de temiz ana sayfa ve önemli içerikleri tek seferlik indeks isteğiyle ele al;canlı uygunluk ve sitemap zaten doğrulandığından sürekli yeniden sitemap göndermekten kaçın. IndexNow uygulanacaksa yalnız gerçek eklenen/değişen canonicalURL’ler için tasarlanmalı. Bu incelemede hiçbir indeks isteği gönderilmedi. Sonraki karşılaştırmadaaynı ikiURL’nin tarama tarihi/dizin durumu ve7/28günlük performansı kaydedilmeli.İndeksleme garantisi yok.
4. Ardından sayfa/sorgu niyetini iyileştir:öncelik gerçek tarihsel soruyu yanıtlayanJohn deRobeck,HalilSami,18Mart sayfaları;başlık ve açıklama sayfanın sağladığı cevabı doğru özetlesin.Yeni içerik yığını üretmek yerine mevcut88sayfada çalış. Sonuçları değişiklikten sonraki karşılaştırılabilir28günle değerlendir;küçük örneklemdeCTRtek başına başarı kararı olmasın.

Robots.txtile dönüş parametrelerini hemen engellemek veya toplu noindex eklemek önerilmiyor;önce taranabilirlinkkaynağı azaltılmalı vecanonical işaretinin görülebilmesi korunmalı. Alternatifcanonical kayıtlarını“düzeltildi”yapmak için temiz içerikler silinmemeli. Bu inceleme kod/yayın onayı veya genelR22tamamlanması değildir.

## Kaynak ve kayıtlar

- GSC: https://search.google.com/search-console?resource_id=sc-domain%3Aonsekizmart.com
- Bing: https://www.bing.com/webmasters/?siteUrl=https%3A%2F%2Fonsekizmart.com%2F
- Googlecanonical: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Googleindexraporu: https://support.google.com/webmasters/answer/7440203
- Googlemetrikleri: https://support.google.com/webmasters/answer/7042828
- Sitemapgaranti değildir: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- BingURLinceleme: https://www.bing.com/webmasters/help/URL-Inspection-55a30305

Ham GSC verisi:gsc-october-raw.json. Bulgular:gsc-bing-findings.json. CanlıHTTP:live-http-diagnostics.json. Konsolların tarih ve kapsam sınırları yukarıda ayrıldı.
