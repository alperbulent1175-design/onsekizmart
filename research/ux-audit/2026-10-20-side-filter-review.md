# Taraf süzgeci ve kaynak uyarısı incelemesi — 20 Ekim 2026

Kapsam: yerel HTML/CSS/JS/Leaflet sürümü. Commit, push, yayın ve scraper çalıştırılmadı. Ham arşiv, tarihsel kaynak kataloğu, tarihsel veri ve koordinatlar bu düzeltme kapsamında değiştirilmedi. Çalışma ağacında önceden bulunan içerik değişiklikleri korundu.

## Bulgular

- İtilaf içeriği mevcut: 18 Mart listesinde 15 İtilaf, 12 Osmanlı ve 4 ortak kayıt. Süzgeç toplamları iki taraf 31, Osmanlı 16, İtilaf 19.
- Taraf seçimi listelere uygulanıyor, harita işaretlerine uygulanmıyordu. Mevki kayıtlarında taraf alanı yok; mevkiyi bir tarafa atamak yerine olayların mevcut `place` bağlantıları kullanılmalı.
- Başlangıç gösterim konumunda İtilaf kaydı bulunmadığından seçim paneli kapanıyordu. İçerik yokmuş izlenimi oluşuyordu.
- Temizle taraf ve deniz/kara seçimlerini sıfırlıyor fakat görünür sonuç mesajı vermiyordu. Ortak olay korununca düğmenin etkisi anlaşılmıyordu.
- Mobilde taraf değiştirmek bilgi kartını yenilerken süzgeç panelini de kapatıyor, sonuç bilgisini gizliyordu.
- Genel aramadan süzgeç dışındaki bir mevki seçildiğinde harita işareti gizli kalabiliyor, önceki taraf düğmesi seçili görünebiliyordu.
- Olaylar dizinindeki genel uyarı, olay sayfalarında bulunan kısmi belge incelemesini yeterince anlatmıyordu. Kaynakça bulunması, bütün iddiaların tek tek doğrulandığı anlamına gelmiyor.

## Değişiklikler

- Seçilen tarafın olaylarıyla ilişkili noktalar süzülür. Ortak olaylar iki seçimde de kalır. Noktalar olay konumudur; İtilaf olayının geçtiği yer Osmanlı tabyası olabilir. Hatlar bağlam için korunur.
- Önceki gösterim konumunda uygun kayıt yoksa ilk uygun kayıt açılır; 18 Mart/cephe görünümü dönüşünde de aynı kural uygulanır. Eski dakika anahtarları değiştirilmedi ve doğrulanmış saat diye sunulmadı.
- Kayıt sayısı, ortak kayıt kapsamı ve temizleme sonucu görünür olarak bildirilir. Arama ve katman tercihi ayrı kalır; harita merkezi/yakınlığı filtre değişiminden etkilenmez.
- Mobil süzgeç, taraf seçimi ve temizleme sırasında açık kalır; basılan düğmenin odağı korunur.
- Aramadan süzgeç dışı mevki açılırsa süzgeçler açıklamayla sıfırlanır ve doğrudan istenen mevki açılır.
- Olaylar dizini ve ana sayfa uyarıları kaynak incelemesinin kısmi olduğunu açıklar. Hiçbir doğrulama durumu yükseltilmedi. Olay sayfalarındaki kanıtlar ve açık kalan sorular korunur.

## Doğrulama

- 177 JavaScript testi ve zorunlu 18 Python testi: toplam 195 test geçti.
- Yeni 11 davranış testi gerçek atlas verisi ve uygulama fonksiyonlarıyla taraf değişimi, ortak kayıt, görünüm dönüşü, marker üyeliği, temizleme, mobil odak, genel arama ve boş sonuç akışlarını kapsar.
- Tarayıcıda 320, 390 ve 1280 piksel iframe genişliklerinde 12'şer kontrol: 36/36 geçti. Sonuçlar `2026-10-20-side-filter-results.json` dosyasında.
- Ayrı gerçek düğme etkileşimlerinde masaüstü İtilaf/Temizle, 390 piksel görünümde panel/odak/Temizle ve süzgeç dışı 19. Tümen araması kontrol edildi. Mobil kontrol masaüstü tarayıcının dar ekran benzetimidir; fiziksel telefon testi değildir.
- `git diff --check` temiz.

İlgili kanıt: `2026-10-20-side-filter-mobile.png`. Tarayıcı matrisi: `2026-10-20-side-filter.html`.
