# Mobil menü ve içerik odağı — 21 Ekim 2026

## Tarayıcıda gözlenen sorunlar

- Mobil menünün son bağlantısından Tab ile çıkıldığında odak içerikteki bağlantıya geçtiği hâlde menü açık kalıyordu.
- 844 × 390 görünümünde komutan dizini menüsü 698 piksel yüksekliğindeydi; ekranın altındaki seçenekler menünün kendi içinde kaydırılamıyordu.
- Ana sayfa menüsünden kronolojiye geçince etkin öğe `body` oluyordu. Bazı alt sayfalarda `İçeriğe geç` hedefi de odak alamıyordu.

## Düzeltmeler

Mobilde odak menü ve Menü düğmesinin dışına çıkınca menü kapanır; yeni odak korunur. Ana sayfa ve ortak gezinme betiği aynı davranır. Masaüstü gezinmesi bu kurala dahil edilmez.

Geliştirilmiş açık mobil menünün yüksekliği ekran yüksekliğiyle sınırlandı; taşan bağlantılar menünün içinde kaydırılır. JavaScript çalışmadığında görünen normal gezinme bu sınırdan etkilenmez.

Bütün `İçeriğe geç` hedefleri ve ana sayfanın harita/kronoloji bölümleri `tabindex="-1"` ile odak alabilir. Normal Tab sırasına yeni durak eklenmez. Sayfa şablonu da güncellendi.

## Doğrulama

- 390 × 844: hem ana sayfa hem olay dizininde son menü bağlantısından Tab ile çıkış menüyü kapattı; içerik bağlantısı odakta kaldı.
- Menüden kronolojiye geçişte odak `kronoloji`, komutan dizinindeki atlama bağlantısında `icerik` oldu.
- 844 × 390: menü yaklaşık 326 piksel yüksekliğe indi, `overflow-y: auto` oldu; son bağlantıya odaklanınca bağlantı ekranın içinde göründü. Menü düğmesi üstte kaldı.
- 67 HTML sayfasının atlama bağlantılarını kapsayan test eklendi. 226 JavaScript + 24 Python testi geçti. Fotoğraf arşivi üretilmiş çıktısı güncel; `git diff --check` temiz.
- Görsel: `2026-10-21-menu-landscape.jpg`.

Tarihsel içerik, koordinatlar, katalog ve scraper değiştirilmedi. Commit, push veya yayın yapılmadı; canlı sürüm e85f205 olarak kaldı.
