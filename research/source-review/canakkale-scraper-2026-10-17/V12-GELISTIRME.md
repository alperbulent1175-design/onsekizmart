# Scraper 1.2 ve fotoğraf arşivi geliştirmesi

17 Ekim 2026. Masaüstündeki scrape_canakkalecephesi.py güncellendi; önceki sürüm scrape_canakkalecephesi_v1_backup.py olarak korundu.

- replytocom parametresi çıkarılır; yorum adresleri yazı kimliğini çoğaltmaz.
- Eski 404/410 adresleri varsayılan olarak atlanır; yalnız açık --retry-missing seçeneği yeniden denetler.
- Profil, üyelik, içerik düzenleme ve medya dosyaları tarama dışıdır.
- Tarihli WordPress yazısına eklenen görsel ek sayfası yolları atlanır. Bu yol kuralı kimi alt içerikleri de dışarıda bırakabilir; sitenin eksiksiz arşivlendiği iddiası yoktur.
- robots.txt, alan adı sınırı, bekleme ve 403/429 durma davranışı korundu.

20 URL sınırı ve 3 saniye beklemeyle iki çalıştırma denendi. İkisinde de sunucu robots.txt isteğinde bağlantıyı kapattı; içerik taraması başlamadı. Engeli aşma veya durmadan yeniden deneme yapılmadı. Yeni sayfa yok. Günlükler masaüstü scraper runs/v12-run.log ve runs/v12-retry.log dosyalarında.

Başlangıçtaki 531 benzersiz URL, önceki 538 ham kaydın yeni normalleştirmeyle sayılmasıdır; yedi kayıt silindiği anlamına gelmez. Ham pages.jsonl değiştirilmedi.

Yerel sitede fotoğraf araması Esc tuşuyla metni temizler ve seçili türü korur. Açıklayıcı yardım metni ve URL/filtre durumunu doğrulayan test eklendi. 35 JavaScript, 23 Python testi geçti. Scraper testleri masaüstü aracını bulamazsa atlanır; bu bilgisayarda ikisi de çalışıp geçti. Bu tur tarayıcı görsel incelemesi yapılmadı.

Commit, push ve canlı yayın yapılmadı.
