# Atlas ajan kuralları

## Mimari

Mevcut HTML, CSS, JS ve Leaflet mimarisini koru. Next.js veya CMS ekleme.

## Tarih

Tarihsel bilgi, sayı, künye, koordinat veya zayiat uydurma.

Gerçek mevcut, muharip mevcut ve kuruluş kadrosunu ayır.

Her tarihsel iddiada kaynak URL'si, kanıt metni, tarih ve doğrulama durumu bulunmalı. Bunlar yoksa iddiayı doğrulanmış sayma.

16 Mart 1915 Carden ayrılışı ile 17 Mart 1915 de Robeck görev kaydını ayrı tut.

18 Mart 1915'te batan gemiler Bouvet, Irresistible ve Ocean'dır.

Kurum ana sayfasını doğrulanmış belge sayma.

Kaynak durumunu kanıt olmadan `iddia_dogrulandi` yapma.

## Katalog ve yayın

Mevcut kaynak kataloğu şemasını değiştirme. `import_catalog.py` sütunları: `id`, `kurum`, `baslik`, `kayit_no`, `tarih`, `kayit_turu`, `url`, `konu`, `erisim_durumu`, `notlar`.

Kullanıcı istemeden canlı siteyi yayımlama.

Kullanıcı istemeden scraper çalıştırma.

`archive/` içeriğini GitHub'a gönderme.

## Test

Her değişiklik sonrası:

```
node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js
python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network
```
