# Eski Word metinlerinin okunması ve Pages dönüşümü

İnceleme: 18 Ekim 2026. Kaynak dosyalar değiştirilmedi. İki eski DOC’un mantıksal gövde metinleri ve devamındaki dipnot/üst-alt bilgi metinleri okundu. Sayfa düzeni ve gömülü görseller incelenmedi; basılı sayfa numarası üretilmedi. Word gövdesi dosyanın mantıksal parça tablosundan çıkarıldı; Bouvet dosyasındaki sıkıştırılmış karakter parçalarında Türkçe kod sayfası varsayımı var. Otomatik çıkarım özgün belge görüntüsüyle yapılmış karşılaştırma değildir.

## 57. Piyade Alay sancağı hakkında

[Drive kaydı](https://drive.google.com/file/d/1-otpsDDKVdv_3T0SCKg2hs6QxpP11mEu/view). Gövde sonunda Dr. Zekeriya Türkmen imzası var. 9.775 karakterlik mantıksal metin okundu; 22 paragraf ayıracı dilimi, boşluk ve alan kodları dahil. Dosya adının aksine temel konu 57. Alay sancağı ve alayın tümünün şehit olduğu iddiasıdır.

Metin mevcut, şehit ve kayıp sayılarını ayrı veriyor; fakat bu yerel nüshadan özgün cetvelin tarihi ve bütün kategorileri kontrol edilemedi. Bu sayılar atlasa kesin mevcut veya zayiat olarak eklenmedi. Müzedeki sancakların kimlikleri ve sancağın imha edilmiş olması için kullanılan ihtimal dili korundu. Yazarın kayıt bulamaması imhanın kanıtı değildir.

En yararlı iz: Zekeriya Türkmen’in *19 ncu Tümen Ceridesine Göre Çanakkale Muharebeleri’nde İlk Gün* çalışmasına, Askerî Tarih Araştırmaları Dergisi özel sayı 16, Ağustos 2010, s.215–265 atfı. O makalenin aslı bu tur incelenmedi. Metindeki Gmail alan bağlantıları özgün arşiv belgesi bağlantısı sayılmadı.

## Yenilginin Adı Bouvet

[Drive kaydı](https://drive.google.com/file/d/1RIJdEHt-kMyHhvXjLaLY51uCR1F9le51/view). Gövde sonunda Ünal Karıncalı imzası var; yayın yeri ve yılı doğrulanmadı. 44.739 gövde karakteri, 1.087 dipnot karakteri ve 41 üst-alt bilgi karakteri olarak bildirilen bölümler ile kapanış ayıracı okundu. Gövde 327 paragraf ayıracı dilimi içerir; çoğu görsel yerleşimine ilişkin boş dilimdir. Fotoğraf altyazıları okundu, fotoğraflar incelenmedi.

En değerli araştırma izi, 19 Mart 1915 Hamburg çıkışlı tebrik telgrafı için verilen **Millî Saraylar Hazine-i Hassa Arşivi Evrak III/80** atfıdır. Metinde saat, gönderen ve muhatap aktarılıyor. Özgün telgraf görüntüsü veya kurum katalog kaydı bu tur açılmadı. Bouvet’nin anılması batış nedeni, batık koordinatı ya da aynı gün yalnız bir geminin battığı sonucunu vermez.

Metnin diğer bölümleri çok sayıda kontrol gerektiriyor: 1806 tarihiyle yıldönümü hesabının uyuşmaması; Vengeance milliyeti; Nusret için 17/18 Mart gecesi; kaynağı belirtilmeyen Churchill sözleri; Seyit–Ocean nedenselliği; Bouvet altyazısında 1918; Mayıs gemi batışlarının sırası; Mondros için metin içinde değişen 29/30 Ekim tarihleri. Bunlar doğrulanmış bilgi olarak kullanılmadı. Carden’in 16 Mart ayrılışı ve de Robeck’in 17 Mart görev kaydı ayrı tutuluyor. 18 Mart’ta batan Bouvet, Irresistible ve Ocean listesi değiştirilmedi.

## Pages dosyalarında dönüşüm sonucu

16 farklı dosyanın 14’ünden gövde metni çıkarıldı. Bu, on dört dosyanın tamamının okunduğu veya bütün metin nesnelerinin çözüldüğü anlamına gelmez. İki dosyada eski tablo yapısı desteklenmedi: *Çanakkale Cephesi’nde İdari Faaliyetler ve Lojistik Hizmetleri* ile *Rütbeler*. Bunların tam dönüşümü açık.

*Çanakkale’de Atatürk (Özet)* dosyasından çıkarılan 20 paragraf ve *Simpson and His Donkey* dosyasından çıkarılan 10 paragraf okundu; ilk sayfa önizlemeleri metinle karşılaştırıldı. Üst-alt bilgi ve bağlantı listeleri boş. Ancak paketteki diğer metin nesneleri ve görseller için kapsam kontrolü açık olduğundan bu iki dosya da tamamlanmış dosya sayısına eklenmedi.

Atatürk özetindeki Aralık tahliyesi bütün yarımadanın tahliyesi gibi okunmamalı. Özetin olayları tek cümleye indirmesi, ayrıntılı komuta/saat kanıtı sağlamaz. Simpson metnindeki eşeğin adının değişik kayıtlarda farklı geçtiği uyarısı korunmalı; hayvanın niyetini anlatan cümleler belgeyle kanıtlanmış olay gibi aktarılmamalı. Bu belgelerdeki tarihler ve hikâyeler bağımsız doğrulanmadı.

## Yöntem ve kapsam

Word çözümü için [Microsoft MS-DOC metin çıkarma açıklaması](https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-doc/01d5d8c4-cf9c-4ef9-80fd-439e763cfe01) izlendi. Pages için [python-pages 0.1.0](https://pypi.org/project/python-pages/0.1.0/) salt okunur kullanıldı; geliştiricinin alfa sürüm ve uyumluluk sınırları dikkate alındı. Kaynaklar dış dönüşüm servisine gönderilmedi. Araçlar ve çıkarılan ham metinler yalnız yerel, Git tarafından yok sayılan `ham/` içinde.

19 yeni kaynak/kontrol kaydı eklendi; toplam 178. Güncel okuma: önceki 20 PDF / 329 sayfa, 5 DOCX ve bu tur 2 eski DOC metni. Önceki Borlat 321 sayfa bu toplamdan ayrı. Pages tam kapsam kontrolleri, 12 çıkarılmış gövdenin okunması, iki tablo dönüşümü, 32 görselin künye/hak incelemesi ve Semiz sürüm karşılaştırması sürüyor.

Kaynak kataloğu şeması ve canlı site değiştirilmedi. Scraper, commit, push ve yayın yapılmadı.
