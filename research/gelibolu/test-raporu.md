# Test raporu

Tarih: 15 Ekim 2026

Paketteki eski rapor 7 testi geçtiğini yazar. O sonuç bu turun sonucu değildir.

Bu turda, değişikliklerden önce, aynı makinede:

- `node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js`: 15 geçti, 0 kaldı.
- `python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network`: 13 geçti, 0 kaldı.

Değişikliklerden sonra:

- `node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js`: 18 geçti, 0 kaldı. Süre 921 ms.
- `python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network -v`: 14 geçti, 0 kaldı. Süre 0,050 s.

Ağ birim testi canlı istek atmaz. Kayıtlı `erisim-denemesi.json` dosyasına bakar. Bu yüzden geçmesi, bugünkü AWM HTTP 429 denemesinin başarılı olduğu anlamına gelmez. O üç adres açılmadı ve geçmiş sayılmadı. IWM-001 ile IWM-002 önceki denemede 404 kaldı.

`python import_catalog.py` katalog bloğunu CSV’den, devam bloğunu `arsiv/devam/tarama.json` dosyasından yeniden yazdı. İkinci çalıştırmada kaynakçada katalog ve devam işareti birer tane kaldı.

Testlerin geçmesi tarihî iddiaların doğrulandığı anlamına gelmez. `iddia_dogrulandi` verilen kayıt yoktur. `belge_acildi` verilen kayıt yoktur.
