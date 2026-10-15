# Başlangıç ölçümü

Tarih: 15 Ekim 2026. Ölçüm, kaynakça süzgeci eklenmeden önce alındı. Sayılar bu komutların çıktısıdır.

## Git

- `HEAD`: `1c5bfcf19953ae5e4b4bfce91f993c88407644de`
- Son ileti: Ana sayfadaki arama, süzgeç ve zaman kontrollerini haritanın yanına taşı. Ortak stil önbelleğini yenile ki iç sayfalar da aynı yerleşimi kullansın.
- `git status --short`: boş. Ölçüm anında kaydedilmemiş değişiklik yoktu.

## Node

Komut: `node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js`

- tests: 19
- pass: 19
- fail: 0
- cancelled: 0
- skipped: 0
- todo: 0
- duration_ms: 853.6306

Geçen adlar: kaynak modeli sayfa numarası uydurmaz ve belgesiz görseli yayımlamaz; 18 Mart kaydı varsa boş durum mesajı üretilmez; olayı olmayan bir gün sahte olay üretmez; aralık notu olay sayılmaz, konum yaklaşık veya şematik işaretlenir; ana sayfa 18 Mart için boş kayıt cümlesi taşımaz ve kontroller durur; kayıt sayfası özetten sonra kaynak çerçevesini gösterir; 18 Mart’ta batan üç gemi durur ve Hamilton deniz komutanı yazılmaz; boş hayat alanları doldurulmaz; mobil düzen ve katman düğmesi kuralları durur; çalışma alanı üç bölümlü, daraltılabilir ve türkçe arama katlar; katalog kimliği, adresi ve durumu sınırlıdır; kaynakça türü, bağlantıyı ve durumu gösterir; devam künyeleri bağlantı ve durum taşır, iddia doğrulamaz; 16 ve 17 Mart tek güne indirilmez; kaynak çerçevesi iddiayı belgelemiş sayılmaz ve html kaçırılır; saat sırası bozulmaz ve kampanya tarihleri 1915-1916 aralığındadır; site haritası, başlıklar ve iç bağlantılar yayımlanan dosyalarla örtüşür; harita kütüphanesi yokken kronoloji çizilir ve arama metni html olmaz; iletişim notu göndermez ve erişilebilirlik kuralları durur.

## Python

Komut: `python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network`

- Ran 14 tests in 0.076s
- OK
- Dosyalardaki test yöntemleri: `test_build_pages` 6, `test_import_catalog` 7, `test_catalog_network` 1. Toplam 14.

## Canlı ile yerel

Canlı istekler 15 Ekim 2026’da `Invoke-WebRequest` ile alındı. Üçü de HTTP 200.

| Yer | CSS | app.js | GA `G-MKGGXNVR7V` | Not |
| --- | --- | --- | --- | --- |
| Canlı ana sayfa | `style.css?v=20261015j` | `app.js?v=20261015f` | yok | `#map`, `#mode-18`, `control-dock`, `atlas-grid` var |
| Canlı kaynakça | `style.css?v=20261015j` | yok | yok | `#katalog` var, `#katalog-q` yok |
| Canlı iletişim | `style.css?v=20261015j` | yok | yok | «Bir sunucuya gönderilmez» var |
| Yerel `1c5bfcf` | aynı sürüm dizgileri | aynı | depoda `gtag` eşleşmesi yok | Kaynakça süzgeci bu ölçümde yoktu |

Google Analytics etiketi bu ölçümde ne canlıda ne yerelde vardı. Başka bir çalışma ekliyorsa bu dosya onu silmez.

Ölçümden sonra, kaynakça süzgeci yazılmadan hemen önce dosyalar yeniden okundu. `G-MKGGXNVR7V` o anda 65 `index.html` sayfasının hepsinde vardı: bir `gtag/js` adresi ve bir `gtag('config', 'G-MKGGXNVR7V')`. Bu tur o bloğu yazmadı.
