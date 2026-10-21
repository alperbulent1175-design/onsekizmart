# Esc tuşunun alanlar arasında paylaşımı

21 Ekim 2026: Ana sayfa ve alt sayfa genel Esc işleyicileri artık defaultPrevented, isComposing ve Alt/Ctrl/Meta/Shift durumlarını dikkate alır. Başka bir alanın işlediği tuş ve değiştiricili kısayollar menüyü veya harita kartını kapatmaz.

Ana sayfada normal Esc sırası menü, açık araç ve bilgi kartı olarak korunur. Eklenen test bu sırayı ve değiştiricili tuşların yan etkisizliğini doğrular.

390 px tarayıcı kontrolü: ana sayfa ve fotoğraf arşivinde açık menü Shift+Escape ile açık kaldı; normal Escape ile kapandı. 241 JavaScript ve 25 Python testi başarılı. Fotoğraf üreticisi --check güncel; git diff --check hatasız. Ekran görüntüsü: 2026-10-21-menu-escape-mobile.jpg.

Tarihsel veri değiştirilmedi; commit, push ve yayın yapılmadı.
