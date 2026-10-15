# Test raporu

Tarih: 15 Ekim 2026. Sayılar bu komutların çıktısıdır.

## Başlangıç

`node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js`

- tests 19, pass 19, fail 0, duration_ms 853.6306

`python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network`

- Ran 14 tests in 0.076s, OK

## Bu turdan sonra

Aynı Node komutu:

- tests 22, pass 22, fail 0, cancelled 0, skipped 0, todo 0, duration_ms 776.9827

Eklenen iki test `tests/catalog.test.js` içindedir: kaynakça süzgeci mevcut kartları süzer ve veri basmaz; yayımlanan sayfalarda GA4 etiketi tektir. Üçüncü yeni ad, `tests/quality.test.js` içindeki «yayın sayfalarında analytics kimliği bir kez kurulur» testidir. Onu bu tur yazmadı; eşzamanlı analytics çalışması ekledi. Mevcut testler zayıflatılmadı.

Aynı Python komutu:

- Ran 14 tests in 0.116s, OK

## Yerel tarayıcı

Sunucu: `python -m http.server 8765`. İş bitince kapatıldı.

Masaüstü ana sayfa, iç genişlik 1920. `scrollWidth` 1905, `clientWidth` 1905, sayfa taşması yok. `#map`, `#layers`, `#q`, `#q-results`, `#clock`, `#mode-18`, `#mode-camp`, `#tl-play`, `#panel`, `#camp-list`, `#event-list`, `#nav-toggle` duruyor. Osmanlı süzgeci basılı hale geldi.

Masaüstü kaynakça: durum `insan_incelemesi_gerekli` ve metin «de Robeck» birlikte 1 kart bıraktı, Colonel Henry Edward William De Robeck. Sayım «1 kayıt görünüyor.» Temizleyince arama ve durum boşaldı, 41 kartın tümü geri geldi.

375 px ana sayfa: `clientWidth` 375, `scrollWidth` 375. Harita dışındaki öğelerde sağ kenar taşması yok. Harita içindeki bir işaretin sınır kutusu 862 px’e uzanıyor; bu, harita katmanının kendi düzlemidir ve sayfa kaydırması açmıyor. Ara düğmesi açıldı. Menü, Ara, Süzgeç ve Katman görünüyor.

375 px kaynakça: kurum Imperial War Museums, 21 kart, «21 kayıt görünüyor.» `scrollWidth` 375. Sağ kenarı 375’i aşan öğe yok.

Ekran görüntüleri gerçek sayfadan alındı: `home-desktop.png`, `home-375.png`, `kaynakca-desktop-filter.png`, `kaynakca-desktop-card.png`, `kaynakca-375.png`.
