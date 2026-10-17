# Oglander iki cilt: erişim ve ilk tarama raporu

İnceleme tarihi: 17 Ekim 2026.

İngilizce iki cildin erişilebilir taramaları indirildi ve metin katmanları tarandı. Türkçe ciltlerin katalog künyeleri doğrulandı; açık tam metinleri bu taramada bulunamadı. Bu çalışma kitapların tamamının insan tarafından okunup tarihsel iddialarının doğrulandığı anlamına gelmez.

## Erişilen nüshalar

- **İngilizce I. cilt:** 1935 yeniden basımı. Başlık ve baskı sayfaları görüntüden kontrol edildi. [Arşiv kaydı](https://archive.org/details/in.ernet.dli.2015.210687).
- **I. cildin harita/ek nüshası:** ayrı dosya olarak indirildi. [Arşiv kaydı](https://archive.org/details/in.ernet.dli.2015.210688).
- **İngilizce II. cilt:** 1932 başlık sayfası görüldü. Ana anlatı ve dizin için 33 PDF, ayrıca 11 sayfalık ön bölüm dosyası edinildi. [Arşiv kaydı](https://archive.org/details/gallipoli-v-2-pt-01-p-003-008).
- **Türkçe I. cilt:** TTK 516038, B/2519-1; Tahir Tunay çevirisi, 1939. [Katalog](https://kutuphane.ttk.gov.tr/details?id=516038&materialType=KT).
- **Türkçe II. cilt:** TTK 501217, B/4014-2; M. Hulûsi çevirisi, 1940. [Katalog](https://kutuphane.ttk.gov.tr/details?id=501217&materialType=KT).

Katalog künyeleri doğrudan nüsha incelemesi sayılmaz. Türkçe set kaydındaki genel 1939/Tahir Tunay bilgisinden ikinci cildin çevirmeni ve yılı çıkarılmadı. Nüshaların sayfa numaraları birbirine aktarılmadı.

## Tarama çıktısı

- 36 PDF dosyası, 1145 fiziksel PDF sayfası; toplam 79,382,286 bayt.
- 1077 sayfada boş olmayan metin katmanı; kalan sayfalar için resim/harita/boş sayfa ayrımı ayrıca incelenmeli.
- 42 araştırma başlığı ve 1759 sayfa-konu eşleşmesi.
- Komutanlar, gemiler, mevkiler, ateşkes, tahliye ve mevcut/kadro terimleri tarandı.
- 12 sayfa için görüntüden kontrol edilmiş künye veya basılı sayfa eşleştirmesi kaydedildi.

Bu sayılar kitabın basılı sayfa sayısı değildir: ek nüsha, ön sayfalar, haritalar ve tekrarlanan geçiş sayfaları da toplamın içindedir. Bir terimde sıfır eşleşme, o konunun kitapta bulunmadığını kanıtlamaz; yazım ve OCR hataları etkili olabilir.

## II. cildin açıklıkları

Ana PDF parçalarının adları 3–517 aralığına uzanır; bu tek başına kesintisiz/tam nüsha kanıtı değildir. Örneklemde 123 → 127 ve 329 → 333 geçişleri görüldü. Bunların arasındaki yaprakların boş/ayırıcı sayfa mı yoksa eksik içerik mi olduğu asıl nüshayla doğrulanmadı. Ön bölümün yalnız bazı sayfaları edinildi. İkinci cildin tam harita/ek takımı bu pakette yoktur.

II. cilt yükleyeninin üniversite arşivine atfı vardır; [STOU kaydı](https://repository.stou.ac.th/handle/123456789/1310) bu incelemede içerik göstermedi. Kaynak nüsha eşleştirmesi açık tutuldu.

## Atlas için kullanım

`konu-dizini.csv` aranan konuyu, cildi, dosyayı ve fiziksel PDF sayfasına giden URL'yi verir. Basılı sayfa alanı otomatik doldurulmadı. Görüntüden kontrol edilen basılı sayfalar ayrı `kunye-ve-sayfa-kontrolu.json` dosyasındadır.

Arama eşleşmeleri kanıt değildir. Seçilen pasaj görüntüden okunmalı, Türkçe özeti/çevirisi ve kanıt sınırı kaydedilmeli; Osmanlı tarafı kaynaklarıyla karşılaştırılmalıdır. Gerçek mevcut, muharip mevcut ve kuruluş kadrosu birbirine çevrilmez. Haritalardan doğrulanmamış koordinat üretilmedi.

Ana kaynak kataloğu ve site değiştirilmedi. Dört kaynak önerisi mevcut on sütunla ayrı CSV'de hazırlandı. Kitapların tam metinleri veya görselleri siteye yayımlanmadı.

## Dosya düzeni ve doğrulama

- `dosya-envanteri.json`: indirme URL'leri, arşivin MD5 değerleri, yerel SHA-256 değerleri ve PDF sayfa sayıları.
- `sayfa-dizini.json`: her PDF sayfasının tarama durumu; tam metin içermez.
- `konu-dizini.csv`: konu-sayfa eşleşmeleri; alıntı veya doğrulanmış olay iddiası içermez.
- `kunye-ve-sayfa-kontrolu.json`: görüntüden incelenmiş sayfalar ve nüsha açıklıkları.
- `turkce-baski-kayitlari.json`: Türkçe iki cildin katalog kanıtları.
- `katalog-onerileri.csv`: ana kataloğa henüz aktarılmamış dört satır.
- `ham/`: indirilen PDF'ler, metin kopyaları ve kontrol görüntüleri; Git dışında tutulur.

36 dosyanın özeti doğrulandı; 1.145 PDF sayfasının düşük çözünürlüklü görüntüleme kontrolü hata vermedi. Bu işlem insan okuması sayılmaz. Zorunlu 27 JavaScript ve 15 Python testi geçti. Ayrıntılar `dogrulama.json` ve `pdf-butunluk-kontrolu.json` dosyalarında.

## Atlas için ilk okuma sırası

Görüntüden incelenen içindekilerden 10 okuma adayı `atlas-okuma-adaylari.json` dosyasına kaydedildi. Arıburnu, Seddülbahir, Kumkale ve Kirte; ardından 19 Mayıs/ateşkes, Zığındere ve Ağustos hazırlıkları ele alınabilir. Bunlar yalnız bölüm girişleridir; doğrulanmış olay kanıtı değildir. Cevat için metinde görülen Jevad yazımı da arama dizinine alındı.
