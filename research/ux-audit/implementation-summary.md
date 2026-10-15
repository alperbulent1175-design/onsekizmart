# Uygulama özeti

Tarih: 15 Ekim 2026. Commit yok. Deploy yok.

## Zaten yayında

Canlı `https://onsekizmart.com/` bu turun başında `1c5bfcf` ile örtüşüyordu. Ana sayfada `control-dock`, `atlas-grid`, `#map` ve `#mode-18` vardı. Stil `style.css?v=20261015j`, betik `app.js?v=20261015f`. Kaynakça kataloğu ve iletişimdeki «Bir sunucuya gönderilmez» cümlesi yayındaydı. Canlıda `G-MKGGXNVR7V` yoktu.

## Bu turda eklenen

- Kaynakça sayfasına istemci tarafı metin araması, kurum, tür ve durum süzgeci. Mevcut kartlar gizlenir; yeni kayıt yazılmaz. Durum değeri karttaki `data-status` özniteliğidir. Etiket, kartta zaten yazan cümledir. Süzgeç temizlenir.
- Katalog kartlarına dar ekranda satır kıran blok düzeni. Kaynakça stil adresi `style.css?v=20261015k`.
- `tests/catalog.test.js` içine süzgeç testi ve, etiket bütün `index.html` sayfalarında tek olduğu için, GA4 tekillik testi.
- `research/ux-audit/` altındaki bu notlar ve gerçek sayfa görüntüleri.

## Doğrulanan, değiştirilmeyen

İletişim formu sunucuya gitmez. `data-mailto` boştur. Düğme `type="submit"` değildir. Kopyalama paketi sayfa adresini, olay adını, isteğe bağlı kaynağı ve düzeltme notunu zaten taşır. E-posta uydurulmadı. Forma dokunulmadı.

Olay sayfalarındaki kurum çerçevesi cümlesi duruyor: eser cildi, belge numarası ve sayfa işli değildir; ayrıntı doğrulanmış kayıt sayılmaz. Cümle yeniden yazılmadı.

## Doğrulanmayan tarihler

Carden’ın komutayı bıraktığı gün sitede 16 Mart 1915, de Robeck’in görev satırı 17 Mart 1915’tir. Durum `insan_incelemesi_gerekli`. Bu tur yeni belge açmadı ve iki günü birleştirmedi. Ayrıntı `historical-data-issues.md` içindedir.

## Analytics

`G-MKGGXNVR7V` bloğu bu turda yazılmadı, silinmedi, ikinci kez eklenmedi ve kimliği değiştirilmedi. Kaynakça başlığı düzenlenirken okunan `gtag` bloğu yerinde kaldı. Eşzamanlı çalışma aynı bloğu diğer yayın sayfalarına eklemişti; o dosyalar silinmedi.

## Yapılmadı

Harita kümeleme yapılmadı. Lighthouse ölçülmedi. Olay sayfaları tek bir veri kaynağından yeniden üretilmedi.
