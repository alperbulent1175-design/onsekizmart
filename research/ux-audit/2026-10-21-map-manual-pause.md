# Haritaya elle müdahale oynatmayı durdurur

21 Ekim 2026: Harita üzerinde birincil pointerdown ve Leaflet gezinme tuşları oynatmayı durdurur, bekleyen açılış seçimini panelRevision ile geçersiz kılar ve devam eden harita animasyonunu durdurur. Native harita eylemi engellenmez. Ctrl/Alt/Meta kısayolları, metin birleşimi ve Tab işlenmez. Leaflet'in programatik flyTo/move olaylarına bağlanılmadığı için oynatmanın kendi hareketi duraklatma sayılmaz.

390 px tarayıcı kontrolünde oynatma başladı ve otomatik adımlarda aria-pressed=true kaldı. Yakınlaştırma düğmesinde Enter sonrasında false oldu; map-view-status elle inceleme için duraklatıldığını bildirdi. Tekrar başlatma ardından Uzaklaştır düğmesine tıklama da oynatmayı durdurdu. Yeni test birincil/ikincil pointer, gezinme tuşları, modifier ve kompozisyon durumlarını kapsar.

252 JavaScript + 25 Python testi başarılı. Fotoğraf üreticisi --check güncel; git diff --check hatasız. Ekran görüntüsü: 2026-10-21-map-manual-pause-mobile.jpg. Tarihsel veri değişmedi. 8630c7e yayınından sonraki yerel değişiklik; commit, push ve yayın yapılmadı.
