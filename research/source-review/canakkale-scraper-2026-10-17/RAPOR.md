# Çanakkale Cephesi scraper çalıştırması

17 Ekim 2026. Kullanıcı isteğiyle mevcut scraper kodu değiştirilmeden çalıştırıldı.

- 40 URL denendi; durumlar: {'200': 32, '404': 5, '302': 3}.
- 32 yeni URL kaydı; kopya arşiv toplamı 538 URL.
- Kanonik URL ve tarihli yol biçimine göre 7 yeni makale adayı. Bu sayı içerik türünün veya tarihsel doğruluğun insan tarafından onaylandığı anlamına gelmez.
- Yorum parametreli tekrarlar, kategori, etiket, üyelik ve yazar dizini sayfaları da ham sonuçlara girdi. Bunlar ayrı tarihsel makale sayılmadı.
- Eski arşivin tüm dosyaları SHA-256 karşılaştırmasıyla değişmemiş durumda. Yeni kopya, önceki pages.jsonl baytlarını başta aynen koruyor.
- İstek arası bekleme 3 saniye, zaman aşımı 20 saniye. Scraper robots.txt kontrolünü yaptı; erişim kısıtlaması aşılmadı.
- Ham arşiv ve yeni 32 kaydın fark dosyası proje dışında: `C:\Users\crawi\Desktop\canakkalecephesi_scraper\runs\20261017-194212`.
- Asıl `archive/` yerine ayrı çalışma kopyası kullanıldı. Sonraki devamda bu çalışma kopyası kullanılmalı; yeni kayıtları kaybetmemek için eski arşivden yeniden başlanmamalı.
- Ana kaynak kataloğuna aktarım, tarihsel iddia doğrulaması, commit, push veya canlı yayın yapılmadı.
- 27 JavaScript, 73 Python testi geçti; Python grubunda zorunlu 15 test ile tarama planı/envanter/kalite testleri var.

## Yeni makale adayları

- https://www.canakkalecephesi.com/index.php/2022/12/26/kurmay-yarbay-mustafa-kemal-ataturk/
- https://www.canakkalecephesi.com/index.php/2022/12/26/nar-cicegim-can-cicegim/
- https://www.canakkalecephesi.com/index.php/2022/12/26/ordunun-duasi/
- https://www.canakkalecephesi.com/index.php/2022/12/26/orduya-selam/
- https://www.canakkalecephesi.com/index.php/2022/12/26/siperlerde/
- https://www.canakkalecephesi.com/index.php/2022/12/26/turk-zaferini-kanlariyla-yaza-yaza-ilerleyen-bu-kahramanlar/
- https://www.canakkalecephesi.com/index.php/2022/12/26/yaralandiniz-binbasim/
