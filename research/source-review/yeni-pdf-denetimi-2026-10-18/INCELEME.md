# Dört yeni PDF önerisi: erişim denetimi

İnceleme tarihi: 2026-10-18. Kullanıcının bildirdiği künyeler araştırma girdisidir. Doğrudan HTTP denemeleri `erisim.json` içinde tutuldu. Bir erişim hatası eserin var olmadığını veya başka yerde bulunamayacağını kanıtlamaz.

1. **Lağım:** bildirilen Burhan Sayılır, 2006, sayı 4, 1–24 künyesi bu kontrolde doğrulanmadı. `https://dergipark.org.tr/tr/download/article-file/294436` HTTP 404 döndürdü. İletilen yayın sayfası da web aracıyla açılamadı. Bu yüzden künye ile PDF eşleşmesi kurulamadı.
2. **Sağlık:** Murat Çulcu adına verilen `https://isamveri.org/pdfdrg/D00371/2011_1/2011_1_CULCUM.pdf` HTTP 404 döndürdü. Yazar, dergi ve bildirilen Akbaş/Kilia/hastane gemisi kapsamı doğrulanmadı. Önceki Hasan Mert dosyasından dosya adı örüntüsüyle yeni makale üretilemez.
3. **Deniz:** `https://www.dzkk.tsk.tr/data/uploads/files/yayinlar/deniz_tarihi_dergisi.pdf` isteğinde SSLError oluştu. Sertifika doğrulaması kapatılmadı; içerik okunmadı. Sayı, tarih, yazar ve sayfa verilmediği için genel dergi dosya adından önerilen makale çıkarılmadı. Goliath için Koyundere ve AE2 için batış mekanizması önceki kaynak uyarılarıyla birlikte açık tutulur.
4. **Tahliye:** `https://dergipark.org.tr/tr/download/article-file/294480` HTTP 404 döndürdü. İletilen yayın sayfası web aracıyla açılamadı. Başlık, sayı 18 ve 85–112 aralığı doğrulanmış künye sayılmadı; yazar da kullanıcı girdisinde eksik.

## Alternatif lağım araştırma izi

ÇOMÜ'nün `https://canakkalesavaslari.comu.edu.tr/canakkale-savaslarinda-lagim-muharebeleri.html` sayfası “Çanakkale Savaşları’nda Lağım Muharebeleri” başlıklı metin için erişim adayıdır. Daha önceki Murat Karataş DergiPark kaydı ve 45082 numaralı PDF ile aynı/başka yayın olup olmadığı ayrı kontrol edilmelidir; kullanıcının Sayılır künyesiyle otomatik birleştirilmez.

Mevcut Karataş kaynak incelemesi: `../olay-orgusu-2026-10-17/kaynaklar.json`. Kaynak URL: https://dergipark.org.tr/tr/pub/canakkalearastirmalari/article/52797 . Bu kaynak için yayın yılı/dergi sayı yılı farkı önceki notlarda açık bırakılmıştır.

## Kayıt sonucu

Dört öneri de henüz doğrulanmış tam metin değildir. Ana kataloğa veya siteye ithal edilmedi. Ham arşiv ve scraper değiştirilmedi. Sonraki adım belgeye özgü geçerli yayın kaydı ve PDF bulmaktır; erişim denemeleri katalog doğrulaması yerine geçmez.
