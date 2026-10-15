# Teslim raporu — 15 Ekim 2026

Bu tur yerel kod ve testtir. Commit yok. Push yok. Deploy yok. Search Console hesabı yok. GA4 Realtime hesabı yok. Tarih, künye, koordinat ve zayiat uydurulmadı.

## A Özet

Depo açıldığında `main` dalı `origin/main` önündeydi (1 commit) ve çalışma ağacı temizdi. İstenen Node ve Python testleri değişiklikten önce de geçti. Kanıtlı üç küçük iş yapıldı: ana sayfaya `main` işareti, saat düğmelerinin erişilebilir adının görünür metinle uyumu, `app.js` içinde tek GA4 olay yardımcısı. 16 Mart ile 17 Mart birleştirilmedi. Kaynak durumları topluca yükseltilmedi. Site haritası yeniden üretilmedi. İletişim dosyalarına dokunulmadı.

## B Değişen dosyalar

Bu turda değişenler:

- `index.html` — içerik `main` içine alındı (`page-main` sınıfı yok, genişlik kuralı değişmedi). `tl-prev` erişilebilir adı `Geri, önceki olay`, `tl-next` adı `İleri, sonraki olay`. `app.js` önbellek sorgu dizesi `v=20261015f` iken `v=20261015g` oldu.
- `js/app.js` — tek `track` yardımcısı ve üç olay.
- `tests/quality.test.js` — `app.js` içinde `gtag` yazısını bütünüyle yasaklayan satır, yeni sözleşmeyle değiştirildi: `page_view` yok, ölçüm kimliği yok, `window.gtag(` bir kez, üç olay adı birer kez, `search_used` / `source_open` / `related_page_open` yok.

Dokunulmayanlar: `iletisim/index.html`, `build_pages.py` içindeki `CONTACT_BODY`, `gizlilik/index.html`, `sitemap.xml`, tarihî metinler, katalog durumları.

Rapor dosyası: `research/handover/teslim-raporu.md`.

## C Test sonuçları

Değişiklikten önce, 15 Ekim 2026 akşamı:

`node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js`

22 test, 22 geçti, 0 kaldı, `duration_ms` 1277.4508.

`python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network`

14 test, 0.125 s, OK.

GA yardımcı eklendikten sonra aynı Node komutu: 22 geçti, 0 kaldı, `duration_ms` 1034.4806. Aynı Python komutu `-v` ile: 14 test, 0.130 s, OK.

Ana sayfadaki `main` ve düğme adından sonra son koşu:

`node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js` — 22 test, 22 geçti, 0 kaldı, `duration_ms` 771.7443.

`python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network` — 14 test, 0.093 s, OK.

Kırmızı kalmadı. Sitemap ve canonical testleri geçtiği için site haritası yeniden yazılmadı.

## D Tarihsel doğruluk

Metin değiştirilmedi.

John de Robeck sayfası iki tarihi ayrı tutuyor: Carden’ın komutayı bıraktığı gün 16 Mart 1915, görev satırı 17 Mart 1915. Sayfa, iki tarihin bu turda açılmış bir belgeyle birleştirilmediğini yazıyor. `tests/catalog.test.js` içindeki «16 ve 17 Mart tek güne indirilmez» geçti.

18 Mart kampanya cümlesi duruyor: «Bouvet, Irresistible ve Ocean batar; Inflexible ve Gaulois ağır yara alır.» Yeni zayiat sayısı yazılmadı. Ian Hamilton cümlesi duruyor: «18 Mart deniz muharebesinin komutanı değildir.» İlgili Node testi geçti.

Kaynak durumları (`bulundu`, `metadata_kontrol_edildi`, `belge_acildi`, `iddia_dogrulandi`, `insan_incelemesi_gerekli`) topluca yükseltilmedi.

## E GA4

Kimlik `G-MKGGXNVR7V`. Değiştirilmedi. İkinci `gtag('config', ...)` eklenmedi. `page_view` olayı üretilmedi.

Kod sayımı, değişiklikten önce: 65 `index.html`. Her birinde kimlik dizgesi 2 kez (yükleyici adresi ve config), `gtag('config', 'G-MKGGXNVR7V')` 1 kez, yükleyici 1 kez. `page-shell.html` aynı kalıpta; yayımlanan sayfa değildir. Bu 66 dosyada aykırı sayım 0. `js/app.js` o anda `gtag` ve `page_view` içermiyordu.

Canlı ana sayfa, `https://onsekizmart.com/`, HTTP 200. `Content-Length` 12307. `Last-Modified: Thu, 15 Oct 2026 14:54:31 GMT`. Gövde 12307 bayt. Kimlik 2 kez, config 1 kez, yükleyici 1 kez, `page_view` 0, `GTM-` 0. Canlı betik hâlâ `js/app.js?v=20261015f`.

Olaylar yalnızca `js/app.js` içinde, dağınık kopya olmadan:

- `track`, `typeof window.gtag !== "function"` ise döner. `window.gtag(` bir kez çağrılır.
- `map_event_select` bir kez tanımlı. Parametre `item_type`: `yer` (yer seçimi) veya `olay` (olay seçimi). Arama metni gönderilmez.
- `timeline_play` bir kez tanımlı. Yalnızca oynatma başlayınca; duraklatmada yok. Parametre `mode`: `naval` veya `camp`.
- `filter_used` bir kez tanımlı. Parametre `filter_value`, sabit listedeki düşük kardinalite simgesi: `both`, `turk`, `itilaf`, `all`, `deniz`, `kara`, `tabya`, `birlik`, `gemi`, `enkaz`, `komuta`, `mayin`, `filo`, `kampanya`. Değer değişmediyse gönderilmez.
- `search_used`, `source_open` ve `related_page_open` yok.
- Kişisel veri, arama cümlesi, koordinat ve e-posta parametresi yok.
- Kaynakça sayfasındaki süzgeç `app.js` dışındaki satır içi betiktir. Bu turda ona olay bağlanmadı; arama kutusu metin sızdırmasın diye de `search_used` yok.
- Şematik hat tıklaması yer veya olay kaydı değildir; olay göndermez.

Realtime doğrulanmadı çünkü GA4 hesabı yok. Search Console doğrulanmadı çünkü o hesap da yok.

## F SEO ve erişilebilirlik

Sitemap ve canonical testleri geçti. `sitemap.xml` yeniden üretilmedi.

Lighthouse 13.5.0, bir kez, mobil, canlı ana sayfa. `fetchTime` `2026-10-15T15:56:24.426Z`. `finalUrl` `https://onsekizmart.com/`. Bu ölçüm yayımlanmış sayfadır; bu turdaki yerel `main` ve düğme adı o skora dahil değildir.

JSON skorları: performans 0.55, erişilebilirlik 0.95, en iyi uygulamalar 0.96, SEO 1. Görünen metrikler: First Contentful Paint 4.4 s (skor 0.17), Largest Contentful Paint 8.0 s (skor 0.03), Total Blocking Time 350 ms (skor 0.73), Cumulative Layout Shift 0 (skor 1), Speed Index 5.5 s (skor 0.54), Time to Interactive 8.0 s (skor 0.43).

Lighthouse’un işaretlediği ve yerelde düzeltilen iki küçük erişilebilirlik maddesi:

- `tl-prev` görünür metni «Geri», eski erişilebilir adı «Önceki olay» idi. Yeni ad «Geri, önceki olay». `tl-next` için «İleri, sonraki olay».
- Canlı ana sayfada `main` yoktu. Yerel ana sayfada üst menü ile altbilgi arasındaki içerik `main` içine alındı. `page-main` sınıfı verilmedi; o sınıf iç sayfa genişliğini kısıtlar.

Düzeltilmeyenler: bağlantı rengi ile çevre metin kontrastı. Lighthouse, `p.accuracy > a` için 1.3:1 (`#f4f1e9` / `#d8d5cb`) ve kronoloji paragrafındaki bağlantı için 1.35:1 (`#f4f1e9` / `#d8d0c2`) ölçtü. Kodda `--gold-2` ve `--cream` ikisi de `#F4F1E9`. Paleti değiştirmek bu turun küçük bir kırma düzeltmesi değildir. Performans kalemleri (LCP, engelleyici istek, kullanılmayan JavaScript) de bu turda ele alınmadı.

## G Açık işler

- 16 Mart ve 17 Mart ayrı duruyor. Açılmamış kartlar kapanmadan tek tarihe indirilmeyecek. `research/gelibolu/sonraki-adimlar.md` bunu açık iş olarak tutuyor.
- AWM aramalarında HTTP 429 kaydı duruyor. Yeni AWM fişi bu turda açılmadı.
- Kaynak durumları yükseltilmedi. `belge_acildi` ve `iddia_dogrulandi` verilmedi.
- GA olayları yerelde. Canlı betik hâlâ `v=20261015f`. Realtime görülmedi.
- Kaynakça süzgeci olay göndermiyor.
- Bağlantı kontrastı ve LCP bu turda bırakıldı.
- İletişim adresi işi bu turun işi değildir. Aşağıda kodda ve canlı yanıtta görülen yazılıdır; tamamlandı denmez.

## H Canlı yayın

Kod: üç dosya yerelde değişti, commit edilmedi.

Test: son Node koşusu 22/22, son Python koşusu 14/14. Ayrıntı C bölümünde.

Commit: bu turda yok. Tur başında çalışma ağacı temizdi. Yerel `main`, `origin/main` önünde 1 commit idi: `872b2b7` («Iletisim sayfasina iletisim@onsekizmart.com adresini yaz...»). O commit bu turda oluşturulmadı. Push yok.

Yayın: yok. Hostinger deploy yok.

Canlı doğrulama: ana sayfa HTTP 200, GA sayımı E bölümünde. İletişim sayfası ayrıca istendi: `https://onsekizmart.com/iletisim/` HTTP 200, `Content-Length` 7189, `Last-Modified: Thu, 15 Oct 2026 15:50:56 GMT`. Yanıtta `iletisim@onsekizmart.com`, `mailto:` bağlantısı, meta cümlesi «form bir sunucuya gönderilmez» ve betikte «Form bir sunucuya gönderilmedi.» görüldü. «başarıyla gönderildi» sayımı 0. Bu sayfayı bu tur yazmadı ve yayınlamadı.

Yerel iletişim kodu, dokunulmadan okundu. `iletisim/index.html` ve `build_pages.py` içindeki `CONTACT_BODY` adresi, `mailto` bağlantısını ve `data-mailto="iletisim@onsekizmart.com"` değerini taşıyor. Metin, notun sunucuya gitmediğini ve bağlantının posta programını açtığını söylüyor. `type="submit"` yok. Gizlilik sayfasındaki cümle duruyor: sayfa görüntülemeleri GA4 ile ölçülür. O dosya da değiştirilmedi.
