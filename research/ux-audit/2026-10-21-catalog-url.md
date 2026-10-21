# Paylaşılabilir katalog süzgeçleri

21 Ekim 2026: Kaynakça araması q/kurum/tur/durum parametrelerine yazılır. Her tuşta yeni geçmiş kaydı açılmaz; replaceState kullanılır. Diğer parametreler ve hash korunur. Başlangıç, popstate ve pageshow sırasında URL'deki seçimler uygulanır. Kurum/tür/durum yalnız mevcut katalog değerlerinden seçilir; yinelenen parametreler uygulanmaz. q en fazla 200 karakterdir. History erişimi engellense de filtre çalışır.

390 px tarayıcı kontrolü: gallipoli ve Australian War Memorial seçimi sayfa adresine yazıldı. Yeniden yüklemede aynı değerler ve 1 kayıt geri geldi. Otomatik testler URL yazımı, temizleme, bilinmeyen/yinelenen değerler, pageshow/popstate ve history hatasını kapsar.

247 JavaScript + 25 Python testi başarılı; fotoğraf üreticisi --check güncel, git diff --check hatasız. Katalog şeması ve kayıtların doğrulama durumları değiştirilmedi. Ekran görüntüsü: 2026-10-21-catalog-url-mobile.jpg. Commit, push veya yayın yapılmadı.
