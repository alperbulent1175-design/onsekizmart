# Yerel arama ve kaynak gezinmesi kontrolü — 19 Ekim 2026

Bu çalışma 0fa9c5d yayını sonrasındaki yerel değişiklikleri kapsar; yeni commit, push veya yayın yapılmadı.

Donanma: 30 statik kart korunur. Türkçe harf katlama, bütün kart metni/yalnız ad araması, sonuç sayacı, boş durum, temizleme, paylaşılan q/ad bağlantısı, gizli kart ve bölüm bağlantılarına erişim, önceki aramaya dönüş eklendi. Yeni sekme tıklamaları mevcut aramayı değiştirmez. JavaScript olmadan kartlar gizlenmez. Davranışlar otomatik testle kontrol edildi. Önceki yerel tarayıcı denemelerinde Türkçe arama, boş sonuç, gizli Ocean kartı ve klavyeyle yalnız ad araması denendi.

Kaynak dizinleri: 18 Mart 9, 19 Mayıs 9, 24 Mayıs 5 bağlantı. Ayrıntı içindeki hedef paragrafına doğrudan gidildiğinde kapalı emir açıklamasının açıldığı tarayıcıda görüldü. Başlıklara ve dizine dönüşte klavye odağı kontrol edildi. Tarihsel paragraflar, kaynak URL’leri ve doğrulama durumları bu gezinme çalışmasında değiştirilmedi.

Dar ekran: aynı kökenli 320 px iframe içinde üç sayfanın her birinde kullanılabilir içerik genişliği ve kaydırma genişliği 305 px; yatay taşma yok. 23 dizin bağlantısında eksik hedef yok. En küçük ölçülen bağlantı yüksekliği yaklaşık 65 px. Bu kontrol gerçek telefon veya tüm tarayıcı/dokunma testi değildir.

Son test: 104 JavaScript + 17 Python = 121 geçti. Scraper, ham arşiv ve katalog şeması değiştirilmedi.


## Olay listesi ve rehber — ek kontrol

Olay araması sıra bağımsız çoklu kelimeleri ve bölüm seçimini birlikte uygular. Gizlenen bölüm bağlantıları yeniden açılır; aynı bağlantıya tekrar basma ve geçmiş dönüşündeki süzgeç durumu otomatik testle kontrol edildi. Olay listesinden ayrıntıya gidiş, 19 Mayıs’tan Sonraki kayıt ile 24 Mayıs’a geçiş ve aynı aramaya dönüş bağlantısı yerel tarayıcıda kontrol edildi. Önceki/Sonraki kayıt arama sonuçlarıyla sınırlı değildir; atlasın kayıt sırasını izler. Bu sınır rehberde belirtildi.

Olay listesindeki arama hedefinin sabit menü altında kalması scroll-margin ile düzeltildi. 320/390 px iframe ölçümlerinde içerik genişliği 305/375 px ile kaydırma genişliğine eşitti; arama alanı 48 px, bölüm bağlantıları yaklaşık 47 px yüksekliğinde ölçüldü. Gerçek telefon testi yapılmadı.

Son kontrol: 110 JavaScript + 17 Python = 127 test geçti. Yeni çalışma yereldedir; commit/push/yayın yapılmadı.


## Harita araması — son kontrol

390 px iframe içinde Inflexible araması dört farklı kayıt türü döndürdü. Mevki satırından seçim doğru olay panelini açtı ve odak panel-title öğesine geçti. Panel kapatıldığında panel kapandı, sonuçlar gizli kaldı ve odak görünür tool-search düğmesine döndü. Bu sonuç yerel tarayıcı kontrolüdür; gerçek telefon/dokunma testi değildir.

Harita aramasında çoklu kelimeler sıra bağımsız eşleştirilir. X işaretinin açıklaması arama ve rehberle tutarlı biçimde Batış / hasar olarak sunulur. 67 sayfanın statik bölüm hedefleri otomatik kalite testine dahil edildi. Fotoğraf üreticisi yalnız HTML satır sonu farklarını yok sayar; görsel dosyası karşılaştırması byte düzeyinde kalır. Üretici kontrolü güncel fotoğraf çıktısı ve 28 olay sayfasında sıfır yeniden üretim farkı verdi.

Son test sonucu: 113 JavaScript + 18 Python = 131 geçti. 0fa9c5d sonrasındaki geliştirmeler hâlâ yereldir; yeni commit, push veya yayın yapılmadı.

## Harita kartında belge kanıtı
Gaulois, Irresistible ve Ocean için açılır kanıt bölümü eklendi. Metin DOM textContent ile oluşturulur; bağlantılar safeUrl denetiminden geçer. Eksik kanıtlar gösterilmez. Masaüstünde Ocean bölümünün açılması ve arşiv/görüntü bağlantıları tarayıcıda doğrulandı. 320/390 piksel iframe yerleşim kontrolünde yatay taşma yok; özet 46,4 px, bağlantılar en az 44 px. Gerçek telefonda dokunma testi yapılmadı. 115 JS + 18 Python testi başarılı. Yerel değişiklik; yayın yapılmadı.

## Gecikmeli açılış seçimi düzeltmesi
Açılış bağlantısının 350 ms gecikmeli işlemi, arada seçilmiş veya kapatılmış kartı yeniden oluşturmamalı. Panel revizyonu ile eski işlem iptal edilir; olay, mevki ve dakika bağlantıları için yarış durumu test edildi. Dar ekran kontrolü 1350 ms sonra ölçüldü: 320/390 px açık belge bölümü korunuyor, yatay taşma yok. 118 JS + 18 Python = 136 test başarılı. Gerçek telefon testi yapılmadı; yayın yok.

## Belge okurken oynatmayı durdurma
Kanıt bölümü açıldığında oynatma durur; kapatmak yeniden başlatmaz. Bekleyen goPlace kaydırma seçimi daha yeni kartı veya belge incelemesini ezmez. 320/390 px tarayıcı iframe kontrolünde başlangıçta oynatma true, 3300 ms sonra false; başlık korunuyor, kanıt bölümü açık, oynatma şeridi gizli, yatay taşma yok. Gerçek telefon testi yapılmadı. 120 JS + 18 Python = 138 test başarılı. Yayın yok.

## Harita işaretinde klavye erişimi
İşaret seçimi kart başlığına odaklanır, kapanınca güncel işarete döner. Enter/boşluk için yakalama aşamasında tek seçim uygulanır; tekrar ve değiştirici tuşlar ele alınır, haritanın diğer kontrolleri etkilenmez. Tarayıcıda Ocean işareti: Enter -> panel-title; Escape -> aynı işaret; boşluk -> panel-title doğrulandı. 122 JS + 18 Python = 140 test başarılı. Yerel, yayın yok.

## Kanıt pasajlarının Türkçe çevirisi
Gaulois, Irresistible ve Ocean narrativeSource kayıtlarına atlas çevirisi eklendi. Kartta Türkçe çeviri ile İngilizce özgün ifade ayrı etiketlenir; özgün alıntı ve kaynak statüsü değişmedi. 320/390 px iframe kontrolünde kanıt bölümü açık, yatay taşma yok. 122 JS + 18 Python testi başarılı. Kaynak kataloğu şeması ve koordinatlar değişmedi. Yayın yapılmadı.

## Inflexible belge kartı
Önceden görüntüden incelenen AWM daktilo sayfası 42 için anlatı kanıtı karta eklendi; özgün kısa pasaj, atlas çevirisi, bağlam, inceleme tarihi ve erişim bağlantıları ayrı sunulur. Bildirim zamanı kesin isabet zamanı sayılmaz. Koordinat, kronoloji anahtarı ve zayiat değiştirilmedi. 320/390 px iframe kontrolünde açık bölüm korunuyor, taşma yok. 123 JS + 18 Python = 141 test başarılı. Yerel, yayın yok.

## Kart kaynak açıklaması tutarlılığı
Geçerli anlatı kanıtı gösterilen kartta genel kurum çerçevesi ve belge numarası yok açıklaması yerine pasajın kapsamını açıklayan metin kullanılır. Pasaj desteği kartın tüm iddialarını, kesin saatleri veya harita koordinatını doğrulamaz. Kanıtı olmayan kartların mevcut kaynak uyarısı korunur. Her iki durum davranış testiyle denetlendi. 124 JS + 18 Python = 142 test başarılı. Yerel, yayın yok.

## Koordinat kaynağının kapsamı
Irresistible kartında yayındaki özgün koordinat yazımı, konum inceleme tarihi ve yayın karşılaştırması görünür. Kaynak datum belirtmiyor; saha ölçümü ve metre kesinliği iddia edilmez. İsabet/tahliye yeri ile enkaz ayrımı korunur. Sayısal koordinatlar değiştirilmedi. 125 JS + 18 Python = 143 test başarılı. Yerel, yayın yok.

## Eksik kanıt ve kaynak statüsü denetimi
Daktilo kanıtı yalnız daktilo_kopyasi_goruntuden_okundu statüsü ve dolu künye/kanıt/tarih/sınır ile gösterilir. Katalog veya bekleyen statü daktilo incelendi açıklaması üretemez. Eksik konum kaynağı açıkça eksik olarak belirtilir, boş künye undefined göstermez. 127 JS + 18 Python = 145 test başarılı. Yerel, yayın yok.

## Uzun anlatıda bölüm dizinine dönüş
19 Mayıs sayfasında 8, 24 Mayıs sayfasında 6 bölüm sonuna doğal bağlantı eklendi. Anlatı dizini anlati-bolumleri kimliği ve tabindex=-1 ile hedeflenir. Tarihsel metinler değişmedi. 320 px iframe kontrolünde 14 bağlantının hedefi var, min 44 px, yatay taşma yok. Mevcut tüm statik hedef denetimleri ve 127 JS + 18 Python = 145 test başarılı. Yerel, yayın yok.

## Anlatı hedeflerinde klavye odağı
19 ve 24 Mayıs sayfalarında kimliği olup tabindex bulunmayan h2/h3 başlıklarına tabindex=-1 eklendi. Doğal bağlantı davranışı korundu. Tarayıcıda 24 Mayıs bölüm dizininden Enter ile gorusmeden-ateskese başlığına odak, Bölüm dizinine dön bağlantısından Enter ile anlati-bolumleri odağı doğrulandı. Tarihsel metin ve JS değişmedi. 127 JS + 18 Python = 145 test başarılı. Yayın yok.

## Fotoğraf yükleme durumu
Görüntüleyici yükleme mesajı ve aria-busy içerir; yükleme sırasında eski görüntü gizlenir, hata durumunda kaynak/künye erişimi korunur. Kapatınca yükleme durumu temizlenir. 36 sayfada görsel JS/CSS sürümleri güncellendi, üretici varsayılanı eşitlendi. Yükleme/başarı/hata/yeniden deneme davranışı test edildi. Tarayıcıda A05615 açıldı, künyesi göründü; Escape sonrası özgün fotoğraf bağlantısına odak döndü. Gerçek yavaş ağ testi yapılmadı. 128 JS + 18 Python = 146 test, fotoğraf üretici kontrolü 0 güncel olmayan çıktı. Yerel, yayın yok.

## Fotoğraf yeniden yükleme
Yükleme hatasında 44 px yeniden yükleme düğmesi eklenir. Aynı fotoğraf yeniden istenir, künye korunur ve gizlenen yeniden dene düğmesi yerine Kapat düğmesine odak verilir. 320/390 px iframe kontrolünde bilerek eksik görsel isteği oluşturuldu; yeniden denemeyle özgün A05615 başarıyla yüklendi, dialog açık kaldı, taşma yok. Odak birim testinde denetlendi; çoklu iframe ölçümü yalnız etkin çerçevenin odağını gösterir. 128 JS + 18 Python = 146 test ve üretici kontrolü başarılı. Yerel, yayın yok.

## Fotoğraf değişiminde odak
Künye içindeki bağlantı veya hata sonrası tekrar düğmesi odaktayken fotoğraf değişirse odak ilgili Önceki/Sonraki kontrolüne aktarılır. Mevcut kontrol veya Kapat odağı korunur. Birim testinde iki yön ve dört odak durumu denetlendi. Tarayıcıda A02360 kaynak bağlantısında sağ ok -> H12541 ve Sonraki düğmesi odağı doğrulandı. 129 JS + 18 Python = 147 test ve fotoğraf üretici kontrolü başarılı. Yerel, yayın yok.

## Gizlenen veya bulunamayan fotoğraf bağlantısı
Fotoğraf bağlantısı görünür kaydı bulamazsa sessizce kalmak yerine açıklama gösterilir. Bilinen ancak filtrelenmiş kayıt için yalnız o kimlikle arşiv araması bağlantısı; bilinmeyen/bozuk kimlik için genel arşiv araması bağlantısı sunulur. Filtre otomatik sıfırlanmaz. Tarayıcıda q=zzzz + A02360 uyarısı ve arşivde bul -> doğru A02360 dialogu doğrulandı. 130 JS + 18 Python = 148 test, üretici kontrolü 0 eski çıktı. Yerel, yayın yok.

## Fotoğraf uyarısı ve süzgeç eşitlemesi
Arama/görsel türü/sıfırlama ve geri dönüş sonrası fotoğraf bağlantısı uyarısı güncellenir. Görünür hâle gelen fotoğrafın gizlenmiş uyarısı kaldırılır; arama değişimi dialog açmaz, odağı almaz ve sayfayı kaydırmaz. Tarayıcıda q=zzzz -> A02360: uyarı kalktı, 1/44 sonuç, odak aramada kaldı. 131 JS + 18 Python = 149 test ve fotoğraf üretici kontrolü başarılı. Yerel, yayın yok.

## Görüntüleyicide künye okunabilirliği
Künye 16 px ve 1.65 satır aralığıyla sunulur; künye bağlantıları ve summary en az 44 px dokunma alanına sahip. Tüm 36 fotoğraf sayfasında stil sürümü yenilendi, üreticinin varsayılan stili eşitlendi. 320/390 px iframe kontrolünde 5 görünür hedefin minimum yüksekliği 44 px; yatay taşma yok. Gerçek telefon testi yapılmadı. 131 JS + 18 Python = 149 test ve üretici kontrolü başarılı. Yerel, yayın yok.

## Görüntüleyicide tarayıcı kısayolları
Alt/Ctrl/Meta/Shift ile ok tuşları ve önceden işlenmiş olaylar fotoğraf değiştirme tarafından yakalanmaz. Düzenleme alanlarında ok tuşları korunur. Tek fotoğrafta gezinme uygulanmaz; yalın sol/sağ ok önceki/sonraki fotoğrafı açar. Davranış testleriyle denetlendi. 132 JS + 18 Python = 150 test ve üretici kontrolü başarılı. Yerel, yayın yok.

## Kronoloji süzgecinde seçim açıklaması
Kara kronolojisi süzgeci seçili kaydı koruduğunda, dışarıda bırakıp ilk uygun kaydı seçtiğinde veya sonuç kalmadığında role=status mesajı gösterilir. Yeni olay seçimi ve görünüm değişimi eski mesajı temizler. 320/390 px iframe kontrolünde 19 Mayıs -> kara korunuyor; deniz -> Dış tabyaların bombardımanı ilk uygun kaydı açıklanıyor, taşma yok. 132 JS + 18 Python = 150 test başarılı. Tarihsel kayıtlar değişmedi. Yerel, yayın yok.

## Kronoloji sonuç sayısı
Liste süzgeci gösterilen/toplam kayıt sayısını ve quiet aralık notu sayısını açıklar. Boş sonuçta Tümü/Temizle yönlendirmesi sunulur. Liste aria-describedby ile sonuç açıklamasına bağlanır. 320/390 px iframe kontrolünde deniz süzgeci 11/44 kayıt, 2 aralık notu ve 11 gerçek DOM satırı eşleşti; taşma yok. 132 JS + 18 Python = 150 test başarılı. Tarihsel veri değişmedi. Yerel, yayın yok.

## Zaman çubuğunda elle seçim
Zaman çubuğu input olayı önce oynatmayı durdurur, ardından seçilen deniz veya cephe kronolojisi kaydını açar. Oynatma zamanlayıcısının normal ilerleyişi değişmedi. İki görünümde çağrı sırası ve seçilen kayıt davranış testiyle doğrulandı. Okuma rehberi güncellendi. 133 JS + 18 Python = 151 test başarılı. Yerel, yayın yok.

## Mevki dönüşünde zamanlama
Açılıştaki mevki seçimi 350 ms işleminde doğrudan yapılır; goPlace içindeki ikinci 250 ms gecikme kullanılmaz. Böylece 500 ms görünüm geri yüklemesinden sonra bekleyen mevki seçimi görünümü yeniden değiştirmez. Testte seçim -> kayıtlı merkez/yakınlık geri yükleme -> bekleyen seçim yok sırası doğrulandı. Önceki kullanıcı müdahalesini koruyan panel revizyonu denetimi devam ediyor. 134 JS + 18 Python = 152 test başarılı. Yerel, yayın yok.

## Atlasa dönüşte tek işlem sırası
Bağımsız 500 ms görünüm geri yükleme zamanlayıcısı kaldırıldı. Geçerli olay/mevki/dakika bağlantısı seçildikten sonra aynı callback içinde kayıtlı görünüm geri yüklenir. Arada yeni seçim olduysa hem eski bağlantı seçimi hem görünüm geri yüklemesi atlanır. Üç bağlantı türü için müdahale sonrası geri yükleme olmaması ve müdahalesiz seçim sonrası bir kez geri yükleme test edildi. 134 JS + 18 Python = 152 test başarılı. Yerel, yayın yok.

## Geniş regresyon kontrolü
JavaScript testlerinin tamamı: 134 başarılı. Python discover ile test_*.py dosyalarının tamamı: 280 başarılı. Toplam 414 test başarılı. Fotoğraf üretici --check: 0 güncel olmayan çıktı. git diff --check: hata yok. Bu turda ürün kodu değiştirilmedi; sonuçlar mevcut yerel değişiklikleri doğrular. Scraper işlemi başlatılmadı, commit/push/yayın yapılmadı. Gerçek cihaz ve canlı ortamda son yerel değişikliklerin kontrolü ayrıca gereklidir.

## Harita arama sorgusunun korunması
Sonuç seçimi ilk arama metnini seçilen kayıt adıyla değiştirmez. Karttan aramaya dönünce aşağı/yukarı ok aynı sorgunun sonuçlarını tekrar açar; Escape kapatır. Seçim durum mesajı ve kart başlığı odağı korunur. Davranış testleriyle denetlendi. 136 JS + 18 Python = 154 test başarılı. Yerel, yayın yok.

## Arama kısayolları ve geri dönüş kontrolü
Arama alanı/sonuç listesindeki değiştirilmiş ok tuşları ve IME composing olayları sonuç gezinmesini tetiklemez. 390 px iframe tarayıcı akışında inflexible sorgusu -> sonuç -> kart başlığı -> kapat -> arama -> aşağı ok: sorgu korunuyor, dört sonuç yeniden açılıyor, odak ilk sonuçta. 136 JS + 18 Python = 154 test başarılı. Yerel, yayın yok.

## Harita karo hatasında odak
Karo yüklemesi düzelip uyarı kaldırılırken odak uyarı içindeyse Başlangıç görünümü düğmesine döner. Odak başka yerdeyse değiştirilmez. Kütüphane yükleme hatasında kronoloji ve olay listesi erişiminin korunduğu mevcut testler de başarılı. Yeni odak testi iki durumu denetler. 137 JS + 18 Python = 155 test başarılı. Gerçek ağ kesintisi testi yapılmadı. Yerel, yayın yok.

## Karo hatasında alternatif taban
Karo hata uyarısına etkin tabana göre Yol haritasını dene/Uydu görüntüsünü dene düğmesi eklendi. Mevcut iki sağlayıcı arasında geçer, diğer atlas katmanlarını değiştirmez. Testte uydu -> yol -> uydu ve olay katmanının korunması doğrulandı. Merkez/yakınlık değiştiren işlem kullanılmaz. 138 JS + 18 Python = 156 test başarılı. Gerçek sağlayıcı kesintisi testi yapılmadı. Yerel, yayın yok.

## Harita hatasında okumaya devam
Kütüphane hata paneline Kaynakça, karo hata uyarısına Olay listesi ve Kaynakça bağlantıları eklendi. Rehber, karo hatası ile kütüphane hatasını ve yeniden deneme davranışını ayrı açıklar; alternatif haritanın da internet gerektirdiğini belirtir. 138 JS + 18 Python = 156 test başarılı. Yayın yok.
