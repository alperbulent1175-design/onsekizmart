# Paylaşılan kayıtlar ve zaman çubuğu — 21 Ekim 2026

## Bağlantı seçimi

Yinelenen olay/mevki/dakika/deniz parametreleri veya farklı kayıt türlerini karıştıran istekler artık ilk bulunan kaydı sessizce seçmez. Kullanıcıya `Bağlantıdaki seçim belirsiz` açıklaması ve olay listesi/başlangıç haritası bağlantıları gösterilir. Mesaj, ham URL girdisini içermez.

Eski olay çapası ile sorgu aynı olayı gösteriyorsa kabul edilir. Sorgudaki geçersiz olay, geçerli başka bir çapaya sessizce düşmez. Dakika olmadan verilen deniz kayıt anahtarı açıklanır. Normal kayıt, mevki, zaman ve yönlendirme parametreleriyle çalışan bağlantılar korunur. Tarayıcıda olay ve mevkiyi birlikte isteyen bağlantının mobil uyarısı görüldü.

## Klavye ile zaman çubuğu

Tarayıcıdaki önce kontrolünde sağ ok iç değeri 450'den 451'e artırıyor, aynı kart açık kalıyordu. Deniz görünümünde yön tuşları artık süzgeçteki gerçek kayıt sırasını izler. Home ilk, End son kaydı seçer; uçlarda başa/sona sarılmaz. Aynı eski dakika değerini taşıyan iki ayrı kayıt da tek tek seçilebilir. Eski URL/dakika değerleri ve fare/dokunma davranışı değişmedi. Dakika alanları tarihsel saat doğrulaması sayılmaz.

Klavye işlemi oynatmayı durdurur, odağı zaman çubuğunda tutar ve bekleyen eski açılış işleminin yeni seçimi ezmesini engeller. Değiştirici tuşlar, metin bileşimi ve önceden işlenmiş olaylar engellenmez. Cephe kronolojisinin yerel sürgü davranışı korunur. Kullanım rehberi ve erişilebilir açıklama güncellendi.

## Kontroller

- Tarayıcıda sağ ok bir sonraki kaydı açtı; End ve tekrar sağ ok son kaydı korudu. Odak `tl-range` üzerinde kaldı.
- Yinelenen parametre, karışık kayıt, aynı olaylı eski çapa, tek başına deniz anahtarı, aynı dakika, taraf seçimi, boş liste ve klavye sınırları test edildi.
- 231 JavaScript + 24 Python testi geçti.
- Görsel: `2026-10-21-timeline-keyboard-mobile.jpg`.

Tarihsel içerik, koordinatlar, katalog ve scraper değiştirilmedi. Commit, push veya yayın yapılmadı; canlı sürüm e85f205.
