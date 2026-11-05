# Test, tarayıcı ve yayın deneyimi

## Yerel doğrulama

Her değişiklik sonrası mevcut AGENTS.md zorunlu kontrolleri:

```powershell
node --test tests/atlas.test.js tests/quality.test.js tests/catalog.test.js
python -m unittest tests.test_build_pages tests.test_import_catalog tests.test_catalog_network
```

R01 veya ilgili JavaScript/HTML/veri değişikliğinde bütün JavaScript test dosyalarını çalıştır. PowerShell glob genişletmesine güvenmek yerine Python `glob.glob('tests/*.test.js')` listesini `subprocess.run(['node','--test',*files])` ile geçmek çalıştı. Güncel dosya sayısını/test sonucunu çıktıdan al; 297 gibi geçmiş toplamı sabit kabul ölçütü yapma. Seçili takımın geçmesini bütün takımın başarısı diye sunma. Yayın hazırlığı testleri zorunlu Python seçkisinden ayrıdır.

UTF-8 Türkçe çıktı için gerektiğinde `PYTHONIOENCODING=utf-8` kullan. Loglar kaynak/tarih altındaki araştırma raporlarında tutulabilir; sonuç, kapsam ve başarısızlıklar DEVAM'a yazılır. Test çıktısı tarihsel doğrulama değildir.

Katalog `import_catalog.py` sütunları değişmez: `id`, `kurum`, `baslik`, `kayit_no`, `tarih`, `kayit_turu`, `url`, `konu`, `erisim_durumu`, `notlar`. İddia-kanıt ayrıntılarını ayrı kayıtlarla tut.

## Tarayıcı kabulü

Oturumda mevcut bilgisayar/tarayıcı aracını ve güncel skill belgelerini kullan. Geçmiş CUA tutamaçlarını, tarayıcı/sekme kimliklerini veya portu var sayma; yerel sunucuyu doğrula. Önceki kontrollerde `http://127.0.0.1:8765` kullanıldı.

- 1280 viewportta 1265 içerik, 320 viewportta 305 içerik görülmesi kaydırma çubuğundan olabilir. `clientWidth` ile `scrollWidth` karşılaştır; eşitliği gerçek ölçümle kaydet.
- Viewport değişiminden sonraki ayrı gözlemle boyutu doğrula. Reset geçmiş tabanın ne olduğunu garanti etmez. Ekran görüntüsü başka kart/üst bölümü gösteriyorsa hedef metni görselden okudum deme; gerekirse kaydır ve yeniden kontrol et.
- Donanma araması: “Gemi veya grup ara”, “Yalnız gemi veya grup adında ara”, “Sonuçlara git”, “Temizle”. Tam metin ve yalnız ad araması farklı sonuç sayıları verir. Mevcut seçimi oku; körlemesine Space ile tersine çevirme. Araçtaki setChecked tıklamasının değişmemesi tek başına site hatası değildir.
- Bağlantıda Enter önceki kontrollerde güvenilir çalıştı. Navigasyon sonucunu ayrı gözlemde hedef URL/başlık/panel ile doğrula. Deneme yapmak tamamlamak değildir.
- “Haritada göster” bağlantısında Leaflet varlığı, doğru seçili panel ve gemi kartına dönüşte arama/çapa bağlamını denetle. Mevki işareti enkaz noktası olmayabilir; panel başlığı gemiden farklı grup adı olabilir.
- Arayüz görüntüsü, DOM metni ve fiziksel cihaz/ekran okuyucu kabulünü ayrı kaydet. Geçici sekmeleri kapat, viewportu geri al; araç giderse son işlemi olmuş sayma ve açık koşulu yaz.

## Yalnız açık yayın talebinde

Canlı hedef önceki yayınlarda `onsekizmart.com`, Hostinger statik barındırmaydı. Güncel hedef ve hesap/site eşleşmesini yeniden doğrula. Mevcut Hostinger/deploy skill'lerini oku; desteklenen dağıtım aracını kullan. Bu dosya bir yayın yetkisi değildir.

- Repo kökünü yükleme. Mevcut `prepare_release` envanter/sayfa kapsamı yordamını inceleyip izole paket oluştur. Mevcut 88 sayfa ile paket kümesini karşılaştır; dosya toplamı sürüme bağlıdır.
- Ham `archive/`, araştırma PDF'leri, yerel aday görseller, geçici ekranlar ve ilgisiz projeleri dışarıda tut. Çalışma ağacı kirli olabilir; kullanıcının diğer dosyalarını toplu ekleme/değiştirme.
- Önceki sunucu dosyaları ve manifestle geri dönüş hazırlığı yap. `.htaccess` gibi yapılandırmayı koru; HTTP ile okunamayan dosyayı canlı hash kontrolünden geçti sayma.
- Kullanıcı commit/push/yayın istediyse izinli kapsamda uygula, canlı değişen genel dosyaları HTTP ve içerik/hash ile doğrula. Commit, push, deployment ve canlı kabulü ayrı raporla.
- Son kayıtlı yayın e6d23e886a1ce0a0aae40bfac581828c2defd6e9 (29 Ekim 2026): 88 sayfa/162 paket dosyası; 161 genel dosya HTTP200 ve SHA256 eşleşmesi. Bu tarihsel anlık görüntüdür, güncel canlı durum kanıtı değildir.
- Eski `.git` yazma veya ağ izinlerini kalıcı kabul etme. Sandbox izniyle kullanıcı yayın yetkisi farklıdır; gerekli araç iznini kullan, reddi dolanma.

SEO: sitemap'in 88 URL içermesi veya Google/Bing'e işlenmesi indekslenme değildir. İndeks iddiası gerçek konsol kanıtına; performans puanı ölçüme dayanır. Önceden tamamlanan kurulumları sırf yeni tur diye tekrarlama.
