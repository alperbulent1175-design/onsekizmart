# Komutan ve donanma listelerinde geçmiş dönüşü

21 Ekim 2026: popstate sonrasında gizli bölüm veya kart için reveal çalıştırılması, URL'deki aramayı temizleyebiliyordu. Geçmiş dönüşü artık URL'deki süzgeci uygular; ardından gelen aynı adrese ait hashchange yeniden bölüm açmaz. Doğrudan bölüm bağlantısı tıklamaları için mevcut açma davranışı korunur. pageshow ile tarayıcının geri getirdiği form değerleri URL ile yeniden eşleştirilir.

Mobil 390 px tarayıcı kontrolü: emile/itilaf aramasından Émile Guépratte ayrıntısına gidilip Geri kullanıldığında aynı arama ve taraf, 1/25 sonuçla korundu. Gizli bölüm hash'i içeren geçmiş adresi ve pageshow düzeltmesi otomatik testlerde doğrulandı. 244 JavaScript + 25 Python testi başarılı. Fotoğraf üreticisi --check güncel; git diff --check hatasız.

Ekran görüntüsü: 2026-10-21-search-history-mobile.jpg. Tarihsel içerik değiştirilmedi. Commit, push veya yayın yapılmadı.
