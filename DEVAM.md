# Atlas kalıcı çalışma kuyruğu
25 Ekim 2026 — 11.40 UTC otomasyon çalışması

Her çalışmada bu dosya, AGENTS.md ve ayrıntılı rapor birlikte okunmalıdır. Öncelik sırası P0 → P1 → P2 → P3, aynı düzeyde R kimliği; bağımlılıklar korunur.

## Bu partinin sonucu
- R01 tamamlandı. Önceki 10 başarısızlık yeniden üretildi. tests/side-filter.test.js gerçek navalTimeLabel işlevini artık test ortamına yüklüyor; 44 sabiti yerine temizleme sonrasında bütün gerçek kampanya kayıtlarının aynen döndüğü denetleniyor. Uygulama veya tarihsel veri değiştirilmedi.
- Bütün JavaScript testleri: 258/258 başarılı, 0 başarısız. Zorunlu 32 JavaScript testi bu koşuya dahildir. Python: 18/18 başarılı. Çıktı research/reports/2026-10-25/javascript-test-output-after-R01.txt. Çıktıyı terminale yazdıran Python kodunda cp1254 simge yazdırma hatası oldu; test çıktısı dosyaya eksiksiz kaydedildi ve sonucu ayrıca okundu.
- Yerel gerçek tarayıcı: İtilaf seçilince Donanma intikali kartı ve 19 kayıt; Süzgeci temizle sonrası 31 kayıt ve aynı uyumlu seçili kart görüldü. Arayüz değişmedi; mobil odak/katman davranışı mevcut otomatik testlerle de geçti.
- Ardından R02 yerel hazırlığına geçildi: sitemap içindeki 88 sayfanın varlık ve SHA256 envanteri R02-page-inventory.json içine yazıldı. Bu dosya tam yayın paketi değildir. CSS/JS/görsel bağımlılıkları ve geri dönüş dosyaları hâlâ hazırlanmalı. Canlıya hiçbir dosya gönderilmedi.

## İş durumları
- R01 · P0 · tamamlandı — Tüm test takımını yeniden güvenilir hâle getir
- R02 · P0 · yerel hazırlık tamamlandı; yayın ve canlı doğrulama engelli — Canlı ve yerel sürüm farkını kapat
- R03 · P0 · devam ediyor — Kanıtsız sayısal iddiaları bütün sitede tara
- R04 · P1 · bekliyor — 24 açık saat kaydını tek tek değerlendir
- R05 · P1 · bekliyor — Rapor saatlerini gemi günlükleriyle karşılaştır
- R06 · P1 · bekliyor — Ateş kes kartını kanıtın kapsamına daralt
- R07 · P1 · bekliyor — Batık, isabet ve tahliye noktalarını ayır
- R08 · P1 · bekliyor — Mayın ve filo çizgilerinin geometrisini doğrula
- R09 · P1 · bekliyor — 18 yeni olay sayfasını derinleştir
- R10 · P1 · bekliyor — Osmanlı ve İtilaf kaynak dengesini kur
- R11 · P1 · bekliyor — 19–24 Mayıs olay zincirini tamamla
- R12 · P1 · bekliyor — İddia ile kanıt bağlantısını tutarlılaştır
- R13 · P1 · bekliyor — Kaynak durumlarını okuyucu diline çevir
- R14 · P2 · bekliyor — 25 komutan sayfasını görev-tarih kapsamıyla gözden geçir
- R15 · P2 · bekliyor — Sağlık ve tahliye sayılarını sonuç kayıtlarıyla tamamla
- R16 · P2 · bekliyor — İki tarafın beslenmesini fiilî dağıtımla karşılaştır
- R17 · P2 · bekliyor — Görsel arşivini olaylarla sistemli eşleştir
- R18 · P2 · bekliyor — Harita-okuma-kronoloji geçişini sadeleştir
- R19 · P2 · bekliyor — Gerçek mobil ve erişilebilirlik denetimi yap
- R20 · P2 · bekliyor — Ana sayfanın öğrenme yolunu güçlendir
- R21 · P2 · bekliyor — Performansı ölç ve bütçe belirle
- R22 · P2 · bekliyor — 88 yerel URL ile canlı indekslenmeyi ayır
- R23 · P2 · bekliyor — Tekrarlanabilir yayın ve geri dönüş süreci kur
- R24 · P3 · bekliyor — Araştırmayı kabul ölçütleriyle yönet

## 12.00 UTC partisi
- R02 yerel hazırlığı tamamlandı: R02-local-release-manifest.json 158 dosya içeriyor (önceki 140 + yeni 18 olay sayfası). sitemap sayfaları ve mevcut HTML/CSS kaynak bağlantıları tarandı. Ham arşiv, araştırma kayıtları ve özel dizinler listeye alınmadı. Kök .htaccess bulunmadığından önceki doğrulanmış yayın stage kopyası kaynak olarak açıkça yazıldı; sessizce atlanmadı.
- Geri dönüş envanteri R02-rollback-inventory.json: önceki dbf9197 snapshotunun 140/140 dosyası manifest hashleriyle eşleşiyor. Yeni 18 adres önceki sürümde yok; geri dönüşte bunların ayrı ele alınması gerekir. Bu yerel snapshot kontrolü, mevcut canlı sunucunun yeniden yedeği alındığı anlamına gelmez. Yayından önce canlı durum ve değişen dosyalar yeniden kontrol edilmelidir. Commit/push/deploy yapılmadı. R02 genel kabul ölçütünün canlı kısmı yeni açık yayın talebine bağlıdır.
- Sonraki yapılabilir iş R03'e geçildi. R03-numeric-claims.json: js/data.js içinde 253 sayı içeren metin parçası çıkarıldı. Bu sayı hatalı iddia sayısı değildir; tarihler, kalibreler, saatler, personel ve başka sayılar tek tek ayrıştırılacak. Koordinatlar ve eski oynatma anahtarları bu tarama dışında.
- Önemli kapsam düzeltmesi: ammo/spend/fortHits/dardanosPeople içindeki eski sayıları doğrudan yayımlanmış tablo saymak doğru değil. 88 sayfalık yerel HTML kümesinde ammo-rows, fort-rows, dardanos-cmd/dardanos-fallen, ship-rows, support-cards, unit-rows hedeflerinin hiçbiri yok. R03-render-targets.json bunu kaydediyor. js/app.js içindeki koşullu üreticiler şu an bu hedeflerde çalışmıyor. Statik donanma sayfası kendi üretilmiş içeriğiyle ayrıca denetlenmeli. Gizli veri kayıtları doğrulanmış sayılmaz ve gelecekte yanlışlıkla açılma riski ayrıca izlenir.
- Mevki kartı openPlace çoğunlukla short gösteriyor; note dizisinin tamamını göstermiyor. Dolayısıyla note içindeki kesin saatleri doğrudan ekranda görünüyor diye raporlamak hatalı olur. Öte yandan olay text ve gemi statik sayfalarındaki sayılar ayrı olarak görünür olabilir. Kaynak statüsü korunarak iz sürülecek.
- Araştırma kapsamı: bu partide yeni tarihsel belge okunmadı ve hiçbir tarihsel iddia doğrulandı yapılmadı. Kaynaklar yerel js/data.js, js/app.js, sitemap.xml, mevcut yayın manifesti ve snapshot dosyalarıdır.

## Sıradaki somut hedef
R03: 253 metin parçasını görünür olay/short/gemi statik içeriği ile kullanılmayan veri olarak ayır; ilk olarak 18 Mart olay text alanındaki sayısal iddiaları research/ux-audit/18-mart-iddia-incelemesi.json ve ilgili belge incelemeleriyle eşleştir. Kanıtı olmayan sayıyı doğrulanmış etikete yükseltme. R02 canlı işlemi beklenirken durma. R01 tamamlandı, yeniden başlatma.

## Sınırlar
Commit/push/deploy/scraper/dışarı mesaj yok. Katalog şeması korunur. Önceki rapordaki 248/258 sonucu tarihli ilk denetimdir; güncel test sonucu burada 258/258 olarak kaydedildi.

## Açık kullanıcı yayın talebi — 25 Ekim 2026
Kullanıcı commit, push ve yayın istedi. 158 dosyalık paket hazırlandı; önceki 139 kamuya açık dosya canlıdan yeniden indirildi ve önceki manifest hashlerinin 139/139 ile eşleştiği görüldü. .htaccess kamuya açık değildir; önceki doğrulanmış yerel snapshot kullanıldı. Son testler 258 JavaScript + 18 Python başarılı. R02 canlı gönderim/doğrulama devam ediyor. Otomasyonun genel yayın yasağı sonraki izinsiz çalışmalar için korunur.
