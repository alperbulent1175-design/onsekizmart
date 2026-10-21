# Olay aramasının uzunluğu ve Türkçe dönüş bağlantısı

21 Ekim 2026: Olay aramasının girişine maxlength=200 eklendi. URL'den okunan q aynı sınıra kırpılır. Olay listesine dönüş doğrulayıcısında kodlanmış URL sınırı 4000'e çıkarıldı; çözülen q için 200 karakter sınırı ayrıca uygulanır. Böylece 200 Türkçe karakterin yüzde kodlaması geçerli dönüş bağlamını düşürmez. Dış hedef, yinelenen parametre ve bilinmeyen bölüm kontrolleri korunur.

245 JavaScript ve 25 Python testi başarılı. Testler 201 karakterin girişte kırpılmasını, 200 Türkçe karakterin dönüşte kabulünü ve 201 karakterli dönüşün reddini kapsar. Mobil 390 px tarayıcı kontrolünde Arıburnu/Kara araması 3 sonuç, maxlength 200 gösterdi. Ekran görüntüsü: 2026-10-21-event-query-mobile.jpg.

Fotoğraf üreticisi --check güncel. Tarihsel içerik ve koordinat değiştirilmedi. Commit, push veya yayın yapılmadı.
