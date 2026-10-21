# Yerel değişikliklerin toplu kontrolü — 18 Ekim 2026

Bu kayıt yayımlanmamış yerel çalışma içindir. Commit, push veya Hostinger yayını yapılmadı.

## Tamamlanan çalışma

- Ana sayfaya mevcut künyeli Zığındere görseli ve üç başlangıç bağlantısı eklendi. Çekim tarihi ile muharebe tarihi ayrımı görünür bırakıldı.
- 18 Mart saat göstergesi, kayıt başlıkları ve panel tarihi belge denetimi tamamlanmamış saatleri kesin zaman olarak göstermiyor. Eski dakika anahtarları bağlantı ve oynatma uyumluluğu için korundu. Gösterim sırası kesin tarihsel sıra değildir.
- Beş olay sayfasında kısa bakış düzeni, Kumkale'de dört bölüm ve içindekiler oluşturuldu. Mevcut paragraflar ve kaynaklar korundu.
- Harita panelinden ayrıntıya geçişte seçili kayda dönüş bağlantısı taşınıyor. Aynı bağlantıya dönüşte merkez, yakınlık, taraf/alan süzgeçleri, işaret katmanları ve uydu/yol tercihi sekme oturumundaki geçici kayıttan yükleniyor. Kayıt 30 dakikadan sonra uygulanmıyor.
- Kullanım rehberi ve gizlilik sayfası bu davranışları açıklıyor. Gizlilik metninin üretici betikteki karşılığı da güncellendi.

## Kontrol sonucu

17 JavaScript test dosyasında 94 test; zorunlu üç Python modülünde 17 test geçti. Toplam 111 test, sıfır hata. İç bağlantı ve site haritası, fotoğraf kaynak/bütünlük kayıtları, kanıt durumları, menü/odak, oynatma, dönüş adresi ve görünüm doğrulama kontrolleri bu çalıştırmaya dahil.

Önceki yerel tarayıcı kontrollerinde masaüstü ana sayfa ve olay düzeni görüntüden incelendi. Seçili kayda dönüş, taraf ve işaret katmanı korunması tarayıcıda denendi. Uydu/yol tercihinin geri yüklenmesi otomatik testle kontrol edildi. Bu kontroller gerçek telefon veya bütün tarayıcılar üzerinde test yapıldığı anlamına gelmez.

## Kalan öncelikler

1. Mobil giriş yüksekliği, sabit olay bağlantıları ve harita panelini gerçek dar ekran/telefon üzerinde görsel ve dokunma görevleriyle denetlemek.
2. 18 Mart metinlerinde hâlâ bulunan kesin emir, saat, mesafe ve sayı anlatılarını iddia bazında belgeye bağlamak. Saat etiketinin değiştirilmesi bu metinleri doğrulamaz.
3. Girişteki arazi fotoğrafını tamamlayacak, kaynak ve kullanım hakkı belirli bir Gelibolu–Boğaz genel coğrafya görselini değerlendirmek. Mevcut fotoğraf genel coğrafya haritası değildir.
4. Kısa bakış düzenini kalan olay sayfalarına, içerik yeterliliğini ayrı değerlendirerek yaymak. Kaynaksız boşluklar yeni anlatıyla doldurulmayacak.

Scraper, ham arşiv ve kaynak kataloğu şeması bu çalışmada değiştirilmedi.
