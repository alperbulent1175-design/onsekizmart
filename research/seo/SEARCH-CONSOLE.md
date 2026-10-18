# Google Search Console site haritası hazırlığı

Kontrol tarihi: 18 Ekim 2026.

## Gönderilecek adres

https://onsekizmart.com/sitemap.xml

Search Console’da onsekizmart.com mülkünü seçin. Mülk doğrulanmamışsa önce Google’ın sunduğu yöntemle sahipliği doğrulayın; doğrulama anahtarı bu projede üretilmedi. “Site haritaları” bölümünde yeni site haritası alanına `sitemap.xml` yazıp gönderin (alan tam adres istiyorsa yukarıdaki adresi kullanın). Ardından okuma durumunu ve Sayfa dizine ekleme raporunu takip edin. Search Console açıldı; tarayıcıda oturum olmadığı için tanıtım ve giriş ekranı görüntülendi. Gönderim henüz yapılmadı; mülk erişimi giriş yapılmadan doğrulanamadı.

## Kontrol sonucu

- 67 sayfa: HTTP 200, yönlendirme yok, beklenen canonical mevcut.
- Bu sayfalarda kontrol edilen meta ve HTTP başlıklarında noindex bulunmadı.
- robots.txt HTTP 200 ve Sitemap bildirimi doğru.
- Canlı sitemap.xml HTTP 200, application/xml; 67 adres yerel listeyle aynı.
- Ayrıntılı kontrol: `2026-10-18-live-check.json`.
- 27 JavaScript ve 17 Python testi geçti.

## Yerel güncelleme

Yalnız site haritasını üretmek için proje klasöründe:

```powershell
python build_pages.py --sitemap-only
```

Bu komut sayfaları yeniden oluşturmaz. Prototip, araştırma ve arşiv klasörleri listeye alınmaz; canonical uyumsuzluğu üretimi durdurur. Dosya kopyalama zamanını içerik güncellemesi sanmamak için lastmod üretilmez. Google’ın kullanmadığı priority ve changefreq alanları da kaldırıldı. Yerel sadeleştirme henüz canlıya aktarılmadı; mevcut canlı harita gönderilebilir durumdadır. Yayın sonrası aynı adres yeniden kontrol edilmelidir.

Site haritası göndermek dizine eklenme garantisi değildir.

Resmî rehber: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
