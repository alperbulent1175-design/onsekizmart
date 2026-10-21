# Fotoğraf bağlantısını kopyalama

21 Ekim 2026: Fotoğraf görüntüleyicisine Fotoğraf bağlantısını kopyala düğmesi eklendi. Paylaşılan adres görsel dosyası yerine arşivdeki fotoğrafı, künyesiyle birlikte açar. Clipboard API kullanılır; erişim yoksa mevcut Bu fotoğrafa bağlantı üzerinden kopyalama açıklanır. Pano içeriği okunmaz.

İşlem sürerken düğme devre dışıdır. Fotoğraf değişikliği veya görüntüleyicinin kapanması bekleyen mesajın yeni kayda yazılmasını engeller. Düğmeden ok tuşuyla geçiş odağı uygun gezinme düğmesine taşır.

390 px tarayıcı kontrolünde düğme başarı mesajını gösterdi; yüksekliği 44 px, yatay taşma yok. Otomatik testler Clipboard API'ye gönderilen tam adresi, erişim hatasını ve geciken işlemi doğrular. 243 JavaScript ve 25 Python testi başarılı. Fotoğraf üreticisi --check güncel; git diff --check hatasız.

Ekran görüntüsü: 2026-10-21-photo-copy-mobile.jpg. Tarihsel kayıtlar ve koordinatlar değiştirilmedi. Commit, push veya yayın yapılmadı.
