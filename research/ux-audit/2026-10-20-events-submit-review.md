# Olay aramasından sonuçlara geçiş — 20 Ekim 2026

## Kullanım ve değişiklik

Olay dizini yazarken süzüyordu ancak Enter, sonuçlara geçiş sağlamıyordu. 390×844 yerel tarayıcı kontrolünde Enter sonrası odak events-query üzerinde kaldı; sonuç alanı ekranın 833. pikselinden başlıyordu.

Arama araçları anlamlı bir arama formuna dönüştürüldü. Mobil klavye için enterkeyhint=search ve görünür Sonuçlara git düğmesi eklendi. Form gönderimi mevcut canlı aramayı uygulayıp eşleşen sonuç bölgesine odak ve kaydırma verir. Eşleşme yoksa gizli veya boş bir olaya değil, mevcut Eşleşen olay bulunamadı açıklamasına odaklanır. Yazma ve bölüm değiştirme odağı taşımaz. Temizle ayrı bir type=button öğesi olarak kalır ve arama alanına döner.

Form gönderimi ayrı bir hash/geçmiş kaydı üretmez. Mevcut URL güncellemesi, diğer sorgu parametreleri ve listeyeDon içindeki #events-tools korunur. Kaydırma açık bir smooth seçeneği dayatmaz; mevcut azaltılmış hareket kuralını devralır. Sonuç bölgesi ve boş sonuç açıklaması üst menü boşluğunu hesaba katar.

Telefonlarda iki eylem tek satırdadır; tablet genişliklerinde eylemler alanları sıkıştırmamak için ayrı satıra alınır. Olay dizininde CSS sürümü 20261020d, events-index.js sürümü 20261020a. Mevcut HTML/CSS/JS mimarisi korunur.

## Doğrulama

- 166 JavaScript + AGENTS.md içindeki 18 Python = 184 test geçti. Sözdizimi ve git diff --check temiz.
- Üç yeni davranış testi canlı aramada odak/konumun korunmasını, form gönderimiyle sonuçlara geçişi, sorgu/geçmiş/dönüş bağlamını, tekrar gönderimde ek URL yazılmamasını ve boş sonuçtan temizlemeyi doğrular.
- Gerçek 390×844 tarayıcıda Arıburnu + Kara araması Enter ile sonuçlara geçti. Sonraki Tab ilk görünür olay bağlantısına ulaştı. Boş sorgu açıklamaya odaklandı; Temizle 28 mevcut olay bağlantısını geri getirip arama alanına döndü. Fiziksel telefon veya sanal klavye testi yapılmadı.
- 320, 390, 601, 768 ve 1280 piksel iframe genişliklerinde eşleşen/boş arama: on senaryo başarılı. Sonuç hedefi sabit üst menünün altında görünürdü. Gönderim URL'yi ayrıca değiştirmedi; #events-tools ve ref parametresi korundu. Temizle tüm kayıtları, boş sorguyu ve Tüm bölümler seçimini geri getirdi. Düğmeler 48–51 piksel yüksekliğinde; yatay taşma yoktu.
- Güncel 390×844 form görüntüsü kaydedildi ve geçici ekran boyutu sıfırlandı. JavaScript olmadan araçların başlangıçtaki hidden durumu ve statik olay bağlantıları korunur; ayrı bir scriptsiz tarayıcı denemesi bu turda yapılmadı.

Önce/sonra ve ekran matrisi bu dizindeki 2026-10-20-events-submit-before.json, events-submit-after.json ve events-submit-matrix.json adlarında aynı tarih önekiyle saklandı. Yerel kontrol: events-submit.html; görünüm: events-submit.png.

Tarihsel içerik, olay sırası, kaynak kataloğu, koordinatlar, scraper ve ham arşiv değiştirilmedi. Commit, push ve yayın yapılmadı.
