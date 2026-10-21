# Fotoğraf görüntüleyicisi: klavye odağı

21 Ekim 2026: Alt bölümdeki kalıcı bağlantı veya görsel dosyası bağlantısındayken ok tuşuyla fotoğraf değiştirildiğinde odak ekran dışında kalabiliyordu. Geçiş artık yönüne uygun Önceki/Sonraki düğmesine odaklanır. Künye içindeki kaldırılan bağlantılar ve tekrar yükleme düğmesi için mevcut davranış korunur. Metin oluşturma sırasında ok tuşları işlenmez.

Çoklu fotoğraf görünümüne ok tuşları ve Esc açıklaması eklendi. Tek sonuçta gezinme açıklaması gizlenir. Kontroller açıklamayla aria-describedby üzerinden ilişkilidir.

Mobil 390 px tarayıcı kontrolünde alt dosya bağlantısından ArrowRight, H12541 kaydını seçti ve Sonraki fotoğraf düğmesine odaklandı; yatay taşma yok. Ekran görüntüsü: 2026-10-21-photo-keyboard-help-mobile.jpg.

239 JavaScript ve 25 Python testi başarılı; fotoğraf üreticisi --check güncel, git diff --check hatasız. Harita motionOn ve CSS prefers-reduced-motion kuralları incelendi; mevcut tercih desteği korundu. Tarihsel veri değiştirilmedi. Yayın yapılmadı.
