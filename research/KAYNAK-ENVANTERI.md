# Kaynak envanteri — bakılacak yer

2026-11-10T20:33:59+03:00

Bu not ikinci bir iş kuyruğu veya yeni katalog şeması değildir. Asıl bulma dizini harvest klasöründedir. Site kataloğunun 10 sütunu değişmez.

## Asıl dizin (harvest)

- `C:/Users/crawi/canakkale-harvest/KAYNAKLAR.md`
- `C:/Users/crawi/canakkale-harvest/kaynaklar-index.json`
- `C:/Users/crawi/canakkale-harvest/harvest_indirilen.csv`
- Kuyruk sayıları: `C:/Users/crawi/canakkale-harvest/harvest_kuyruk_ozet.json`
- Yenile: harvest klasöründe `python build_finding_aid.py`

## Bu projede zaten duran indeksler (çoğaltma)

| Ne | Yol | GitHub |
| --- | --- | --- |
| 26 kayıtlı keşif kataloğu | `kaynakca/index.html`, `research/gelibolu/katalog.json`, `kaynak-katalogu-2026-10-15.csv` | var |
| Anlatı kaynakları (27 / 73 sayfa) | `research/ux-audit/content-review.json` | var |
| 18 kronoloji kaynağı | `data/chronology-sources.json` | var |
| 44 fotoğraf künyesi | `research/photo-archive/2026-10-17/manifest.json` | JSON var; JPG yok |
| Drive dosya dizini | `research/drive-archive/2026-10-18/ARSIV-DIZINI.md` | notlar; `ham/` yok |
| Kanıt kayıt düzeni | `research/KANIT-KAYIT-DUZENI.md` | var |
| Yerel PDF/görüntü kopyaları | `archive/` | yok |
| Ham indirmeler | `research/**/ham/` | yok |

## Bu üretimdeki sayılar

- Harvest künye: **3904** · disk dosyası: **161** · DB’de yolu olan: **160** · diskte extra: **1**
- Harvest durum: `{"downloaded": 14, "error": 5, "large": 1, "new": 2308, "noise": 981, "research": 146, "review": 137, "weak": 312}`
- LoC **0** · Europeana **0**
- IWM **1295** (image 1165 / page 130 / document 0)
- AWM **761** (image 511 / page 231 / document 19)
- Site katalog 26 · belge_acildi **0** · iddia_dogrulandi **0**
- Content-review 29 kaynak / 73 sayfa · kronoloji 18 · fotoğraf 44
- `archive/` 21 · Drive öncelikli 15 · ham/ **2172** dosya
- Git: HEAD 1575 · origin/main 1314 · harvest dahil değil

## Okuma kuralı

Provenans (nerede bulundu, yerel yol, GitHub var mı) ile doğrulama (`belge_acildi` / `iddia_dogrulandi`) ayrıdır. Harvest indirilen dosyalar bu turda **açılmadı**.

## Yerel tarama işaretleri (9–10 Kasım 2026)

Çıkarım ≠ belge açıldı. `katalog.json` `belge_acildi=0` · `iddia_dogrulandi=0`.

| Küme | Durum | Yol |
| --- | --- | --- |
| Harvest metin PDF’leri (Anafartalar–Masefield vb.) | önceki turlarda pymupdf dizin | `research/source-review/*-2026-11-09/` |
| Drive metin katmanı 19 eser | önceki tur | `research/source-review/` Drive slug’ları |
| Aker 27. Alay OCR | 62/61/1; otomatik TR OCR, görüntü kontrolü gerekli | `research/source-review/aker-27-alay-ocr-2026-11-09/` |
| Drive Pages 16 | IWA ikili, dönüştürücü yok | `drive-leftover.json` |
| Drive DOC 2 | OLE, dönüştürücü yok | `drive-leftover.json` |
| Britannica / ATOM / çıkarma günü | değersiz tarama, OCR yok | `drive-leftover.json` |
| CWGC 697 | 12 taramalı sayfa, metin yok | `cwgc-gallipoli-1915-2026-11-09/` |
| IWM başlık dilimi | 30 liste sayfası, 242 künye, 0 thumb, 494 genel kaldı | harvest `iwm_title_fix.json` |
| IWM liste gürültüsü | 494 `Find an object` + 23 `photograph` → `noise` | harvest.db |
| IWM araştırma görselleri 10 Kasım | 15 + 9 nesne başlıklı JPEG | harvest `iwm_research_image_batch_2026-11-10.json`, `iwm_research_image_batch2_2026-11-10.json` |
| canakkalecephesi 3 yazı (2026) | dizin/alıntı, tam metin yok | `canakkalecephesi-delta-2026-11-09/` |

Ayrıntı: `research/source-review/archive-scan-2026-11-09/OKUMA.md`.
