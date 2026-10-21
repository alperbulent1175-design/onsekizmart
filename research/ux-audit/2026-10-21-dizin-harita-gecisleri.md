# Dizinler, fotoğraf araması ve harita dönüşü — 21 Ekim 2026

## Tamamlanan değişiklikler

Donanmada Temizle metinle birlikte yalnız adlarda arama seçeneğini de sıfırlar. Metin boş ama bu seçenek açıkken düğme erişilebilir kalır. Arama adres çubuğuna işlenir; yenileme ve tarayıcı geçmişinden geri/ileri dönüşlerde arama yeniden uygulanır. Komutan araması da popstate geçişinde URL’deki metin ve tarafla eşleşir.

Goliath, Triumph ve Majestic kartlarının harita düğmeleri açılan saha/mevki kartını adlandırır. Bu bağlantıların enkaz koordinatı göstermediği ayrıca yazıldı. Tarihsel koordinat değiştirilmedi.

Donanma kartının harita bağlantısına aynı kartı ve aramayı koruyan yerel dönüş bağlamı eklenir. Haritada yalnız bu bağlantının mevkii seçiliyken Gemi kartına dön gösterilir. Farklı mevki, dış adres, bilinmeyen/yinelenen parametre veya bozuk ad seçeneği dönüş bağlantısı üretmez. Goliath → Morto → Goliath akışı, q=Goliath ve yalnız adlarda arama seçeneğiyle gerçek tarayıcıda sınandı. Uygulama kartının placeId alanıyla uyum, tarayıcı denemesinde düzeltilip teste alındı.

Fotoğraf aramasında Enter/Sonuçlara git ilk görünür görselin bağlantısına, eşleşme yoksa boş sonuç açıklamasına odak verir. İlk görsele gitmek büyütücüyü kendiliğinden açmaz. Fotoğrafta Enter büyütücüyü açar; Escape kapanınca odak aynı bağlantıya döner. Yeni düğme arşiv sayfasına eklendi, fotoğraf üreticisiyle çıktı tutarlılığı korundu.

## Doğrulama

215 JavaScript testi ve 24 Python testi geçti: toplam 239. Python grubuna zorunlu üç grubun yanında fotoğraf üreticisinin 6 testi dahildir. build_photo_archive.py --check: 0 güncel olmayan çıktı.

A02360 ile mobil sonuç, Enter ile büyütme, Escape ile kapatma ve odağın geri gelmesi, boş sonuç ve Tüm fotoğrafları göster sınandı. 320 pikselde belge/kaydırma genişliği 305/305; iki arama düğmesi yaklaşık 47 piksel yüksekliğinde ve ekran sınırları içinde. Tarayıcı hata günlüğünde hata yok.

Önizleme sunucusu ortam yenilenince kapanmıştı; yalnız 127.0.0.1 adresine bağlı sunucu yeniden başlatıldı. Hata sayfasında kalan eski sekme yerine aynı tarayıcıda yeni yerel test sekmesi açıldı. Canlı site değiştirilmedi.

Kaynak kataloğu, scraper, ham tarihsel arşiv ve tarihsel veri koordinatları bu çalışmada değiştirilmedi. Commit, push veya yayın yapılmadı.
