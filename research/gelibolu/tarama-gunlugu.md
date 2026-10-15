# Kurum ve konu tarama günlüğü

Tarih: 15 Ekim 2026

Dört kurumun arşivi taranmış değildir. Arama motoru özeti kullanılmadı. `belge_acildi` ve `iddia_dogrulandi` verilmedi.

## Paket kataloğu

Özgün CSV `gelibolu-kaynak-arsivi/kaynak-katalogu.csv` içindedir. Projedeki tarihli kopya `kaynak-katalogu-2026-10-15.csv`. Dönüşüm `import_catalog.py` ile yeniden üretildi. 26 satır, dört kurum: Alan Başkanlığı 6, Australian War Memorial 13, Imperial War Museums 6, ATASE 1. ATASE satırının adresi yoktur.

İlk adres denemesi `erisim-denemesi.json` içindedir. IWM-001 ve IWM-002 HTTP 404 kaldı. Paylaşılan kitap listesi ayrı belge açılmış sayılmadı.

## Aynı gün okunan önceki taramalar

Bu tur başlamadan repoda duran dosyalar okundu. Onlar da bütün arşiv demez.

- `arsiv/alan-baskanligi/`: arşiv, yayın listesi, CASA aramaları ve 13 künye. Kitap PDF’i ve dijital görüntü açılmamış. ATASE kataloğu yok.
- `arsiv/awm/`: katalogdaki 13 adres ve 14 ek fiş. Bir ek adres 404. Dijital sayfa ve PDF okunmamış.
- `arsiv/iwm/`: bilinen altı adresten dördü ve ek fişler. IWM-001 ile IWM-002 404. Görsel indirilmemiş.
- `arsiv/saha/`: site metninin indeksi. Yeni doğrulama değildir.

## Bu turun yeni açışları

Ayrıntı `arsiv/devam/`. Inflexible, Gaulois ve de Robeck arandı.

- 15 IWM künye sayfası HTTP 200. Görsel, mektup ve ses açılmadı.
- Nusret aramasında nesne kartı yok. Sayfa sıfır kayıt yazmıyor.
- AWM’de üç arama HTTP 429. Bu turda AWM fişi eklenmedi.
- MSB arşiv adresi 302. Askerî arşiv sitesi giriş ekranı. ATASE belgesi yok.

Inflexible aramasının ilk sayfası 30 / 94. Gaulois 17 kartın tümü açılmadı. John de Robeck 13 karttan 2’si açıldı.
