# Katalogda boş bölüm başlıkları

21 Ekim 2026: Aramada eşleşmesi kalmayan katalog listesinin başlığı ve ona ait açıklama görünmeye devam ediyordu. Filtre uygulandığında boş liste ve yalnız o listeye ait H2/prose açıklaması gizlenir; arama temizlenince geri gelir. Başlık-açıklama yapısı eşleşmiyorsa ilgisiz öğeler gizlenmez. HTML başlangıçta tüm kayıtları ve başlıkları içerir; JavaScript olmayan kullanım korunur.

390 px tarayıcı kontrolü: AWM-001 aramasında katalog-devam, başlığı ve açıklaması gizli; temizlemede üçü de görünür ve 41 kayıt mevcut. Otomatik test boş/dolu geçişi ile ilgisiz önceki öğenin korunmasını kapsar.

249 JavaScript + 25 Python testi başarılı. Fotoğraf üreticisi --check güncel; git diff --check hatasız. Ekran görüntüsü: 2026-10-21-catalog-empty-sections-mobile.jpg. Tarihsel kayıt ve şema değişmedi; commit, push ve yayın yapılmadı.
