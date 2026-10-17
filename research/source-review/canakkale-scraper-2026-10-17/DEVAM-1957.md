# 19:57 devam turu ve yerel site geliştirmesi

17 Ekim 2026. Kullanıcı isteğiyle mevcut scraper son çalışma kopyasında çalıştırıldı. 20 URL denendi, tamamı 404; yeni sayfa yok. Toplam 538 arşiv kaydı korundu; pages.jsonl SHA-256 özeti başlangıçla aynı. Çalışma günlüğü: C:/Users/crawi/Desktop/canakkalecephesi_scraper/runs/20261017-195707/run.log.

Bu tur eski eksik profil ve medya adreslerinin tekrar denenmesi sorununu yeniden gösterdi. Kuyruk sayısı yeni makale sayısı değildir. Yeni bir tarama turundan önce scraperın eski 404/410 ve profil adreslerini atlama davranışı geliştirilmelidir. Bu turda scraper kodu değiştirilmedi.

Yerel fotoğraf arşivinde bölüm bağlantılarına arama ifadesiyle eşleşen görsel sayıları eklendi. Sayılar kategori filtresinden bağımsız olarak diğer bölümlerdeki eşleşmeleri gösteriyor; etkin kategori aria-current ile belirtiliyor. Türkçe arama, sıfırlama ve geri gezinmeyle güncelleme testi eklendi. Fotoğraf arama JavaScript ve merkezi sayfanın önbellek sürümü yenilendi.

34 JavaScript ve 21 Python testi geçti. Bu tur tarayıcıyla görsel kontrol yapılmadı. Commit, push ve canlı yayın yok.
