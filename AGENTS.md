# Atlas ajan kuralları

## Verimli çalışma — 1 Kasım 2026 kullanıcı kararı

- Bu projede varsayılan çalışma kısa yanıt, düşük düşünme düzeyi ve tek ajandır. Zor tarihsel kaynak çelişkilerinde doğruluğun gerektirdiği incelemeyi yap; tasarruf için kanıt veya zorunlu test atlama.
- İlk oturumda başlangıç belgelerini oku. Aynı sohbette sonraki çalışmalarda AGENTS.md, DEVAM.md son bölüm ve ilgili dosyalarla başla; sabit yol haritası/bitiş/UX belgelerini hash ile kontrol et. Hash değişmediyse `research/agent-context-cache.json` özetini kullan; değiştiyse ilgili belgeyi yeniden oku ve önbelleği güncelle. Yeni açık kullanıcı talebi önceliklidir.
- Büyük raporları, JSON aday listelerini ve beceri kataloğunu topluca tekrar dökme. `rg`, seçili JSON alanları ve dar satır aralıkları kullan; rutin araç çıktısını yaklaşık 1500 token altında tut. Kesilen çıktıyı okunmuş sayma; gerekli pasajı ayrıca al.
- Bağımsız okumaları tek çağrıda grupla; bağımlı işleri sırayla yap. Kaynak aramasını açık soruya göre daralt; bilinen erişim engelini koşul değişmeden yeniden deneme.
- Değişiklikleri anlamlı bir partide tamamla, gerekli testleri sonra bir kez çalıştır. Tam logu dosyada tut, yalnız sonuç/başarısızlıkları oku. Yeni değişiklik, hata veya belirsizlik yoksa testleri tekrar etme.
- DEVAM.md'ye kısa bir parti kaydı yaz: kimlik/durum, değişiklik, kaynak sınırı, test, kabul/engel ve tek sonraki adım. Eski kayıtları tekrar kopyalama; yalnız kayıt/log güncellemesi sonrasında sonsuz test–kayıt döngüsü oluşturma.
- Arayüzde yalnız değişen akışı ve gerekli masaüstü/mobil/harita/süzgeç kontrollerini yap; küçük metin değişikliği için bütün siteyi yeniden gezme. Ekran görüntüsünü yalnız görsel kabul gerekiyorsa al.
- Alt ajan, yeni sohbet veya ek otomasyon açma; kullanıcı özellikle isterse değerlendir. Yayın/scraper yetkisi ve tarihsel doğrulama kuralları korunur.
- Atlas becerisi: `C:/Users/crawi/.codex/skills/canakkale-atlas/SKILL.md`. İlgili destek belgesini gerektiğinde oku; aynı beceriyi aynı sohbette tekrar yükleme. Güncel iş durumu DEVAM.md'dir.

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
