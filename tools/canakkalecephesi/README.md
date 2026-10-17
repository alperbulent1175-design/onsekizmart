# canakkalecephesi.com araştırma tarayıcısı

Bu paket yalnızca `canakkalecephesi.com` alan adındaki sayfaların özel araştırma arşivini oluşturmak için hazırlanmıştır.

## Kurulum
Python 3.10+ önerilir.

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
python -m pip install -r requirements.txt
```

## Önce küçük test
```bash
python scrape_canakkalecephesi.py --max-pages 10 --delay 3 --out test_archive
```

Daha kapsamlı tarama (erişim koşulları izin veriyorsa):
```bash
python scrape_canakkalecephesi.py --max-pages 200 --delay 2 --out archive
```

## Çıktılar
- `pages.jsonl`: sayfa URL'si, başlık, tarih metaverisi, metin, ara başlıklar, site içi bağlantılar ve görsel adresleri.
- `url_inventory.txt`: keşfedilen URL listesi.
- `crawl_report.csv`: HTTP durumları ve hata raporu.

## Erişim ve kullanım
- `robots.txt` kontrol edilir; yasaklanan URL'ler atlanır.
- HTTP 403 veya 429 alınırsa araç durur; CAPTCHA, giriş duvarı, rate limit veya erişim kontrolü aşılmaya çalışılmaz.
- Yalnızca canakkalecephesi.com alan adı kabul edilir; diğer siteler taranmaz.
- Araç tarihî iddiaları doğrulamaz. Birlik mevcudu gibi bilgiler daha sonra özgün cümle, tarih, URL ve yazının kendi kaynakçasıyla ilişkilendirilerek insan kontrolünden geçirilmelidir.
- Arşivde tutmakla içeriği yeniden yayımlamak aynı şey değildir. Yeniden yayımdan önce telif ve kullanım izinlerini kontrol edin.

## Sürüm 1.2

Önceki 404/410 adresleri varsayılan olarak atlanır; yeniden deneme için `--retry-missing` kullanılır. Yorum parametreleri tek yazıya indirgenir. Profil, üyelik, medya ve tarihli görsel ek sayfaları tarama dışında kalır. Kuyruğun tükenmesi sitenin eksiksiz arşivlendiği anlamına gelmez. Ham arşiv GitHub ve canlı yayın paketine alınmaz.
