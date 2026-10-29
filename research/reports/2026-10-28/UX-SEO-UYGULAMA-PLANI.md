# UX, içerik ve SEO uygulama sırası

28 Ekim 2026 kullanıcı kararı. Mevcut 88 sayfa ve HTML/CSS/JS/Leaflet yapısı korunur. Bu belge R01–R24 kuyruğunu tamamlar; öncelikleri veya bağımlılıkları kaldırmaz. Her çalışmada DEVAM.md içindeki son somut adımdan devam edilir.

## 1. İçerik güvenilirliği ve anlatım netliği — R03–R17
- Durum: devam ediyor. Birdwood kabulü ve Bridges mevcut incelemesi tamamlanan alt adımlardır; yeniden başlatılmaz. 29 Ekim olay sayfası kapsam/okuma geçişleri DEVAM.md’de kayıtlıdır. Güncel tek sonraki adım DEVAM.md son kaydından alınır.
- Kritik sayı, tarih, görev ve konum ilgili pasajla eşleştirilir veya açık belirsizlikle sunulur. Sonuçsuz kaynak erişimleri tekrarlanmaz.
- Olay sayfası pilotunda kısa cevap, amaç/hazırlık, gelişme, sonuç ve sonraki olay bağlantısı düzenlenir. Teknik inceleme dili okuyucu açıklamasına çevrilirken iddia düzeyindeki sınırlar korunur.
- Kabul: yeni metin dayanak ve kapsamını gösterir; desteklenmeyen kesinlik içermez. Genel R03 ve ilk sürüm kapıları ayrıca değerlendirilir.

## 2. Bilgiyi bulma ve geçişler — R18–R20
- Durum: bekliyor; ilgili bağımlılıklar ve birinci aşama pilotu sonrası.
- Menü ve site çapında arama; Türkçe adlar/eş anlamlılar; sonuç türü ve okuma/harita bağlantıları. Arama sonucu olmayan durumda anlamlı alternatifler.
- Harita–olay–kaynak dönüşünde seçili kayıt ve süzgeç korunur. Aynı hedefe giden yinelenen çağrılar azaltılır.
- Kabul: belirlenmiş görevler klavye ve dokunmayla tamamlanır; konum ve seçim kaybolmaz. Kullanıcı testi yapılmadan başarı oranı iddia edilmez.

## 3. Mobil harita ve erişilebilirlik — R19
- Durum: bekliyor. 320 piksel, tablet, yatay ekran, yüzde 200 metin, klavye/odak ve azaltılmış hareket denetlenir.
- Mobilde aynı anda tek araç paneli; açık kapatma/dönüş; ürün hedefi en az 44 piksel dokunma alanı. Sürükleme gerektiren işlemlere düğme alternatifi.
- Kabul: yatay taşma, örtülü odak ve odak kaybı olmadan temel görevlerin tamamlanması. Emülasyon fiziksel cihaz testi sayılmaz.

## 4. Tasarım sistemi ve mesaj — R20
- Durum: bekliyor. Mevcut lacivert, EB Garamond ve Source Sans 3 kimliği korunur; mono yalnız saat/koordinat gibi alanlarda kullanılır.
- Önce ana sayfa pilotu: açık değer önerisi, baskın keşif bağlantısı, ikincil okuma yolu; doğru künyeli mevcut görsel. Gövde 18 piksel, satır aralığı yaklaşık 1,65 ve 62–70 karakter okuma genişliği başlangıç adaylarıdır; ölçülerek uyarlanır.
- Kabul: ilk bakışta sitenin konusu ve başlangıç yolu anlaşılır; kontrast ve masaüstü/mobil görünüm denetlenir.

## 5. Performans, SEO ve editoryal döngü — R21–R23
- Durum: bekliyor. Önce ölçüm, sonra değişiklik; ölçülmemiş hız puanı verilmez.
- Mevcut canonical/sitemap/iç bağlantılar korunur. BreadcrumbList ve uygun Article alanları gerçek içerikle eşleştirilir. 1915 muharebesi güncel etkinlik olarak işaretlenmez.
- Dört haftalık döngü: olay anlatıları; komutan görevleri; sağlık/beslenme ve görsel künyeleri; arama sorguları/bozuk bağlantılar/mobil kabul. Kanıt yokken yayın kotası doldurulmaz.
- Kabul: önce/sonra ölçüm ve doğru metadata; sitemap sayısı indekslenme sayısı yapılmaz. Önceden tamamlanan Google/Bing kurulumu yeniden başlatılmaz.

## Çalışma ve yayın kuralı
Her parti DEVAM.md içinde kimlik, durum, değişiklik, kaynak, test, kabul koşulu ve sonraki tek somut adımı tutar. AGENTS.md testleri her değişiklik sonrası; ilgili kod değişikliğinde bütün JavaScript takımı; arayüz değişikliğinde masaüstü/mobil ve harita/süzgeç kontrolü gerekir. Yeni otomasyon oluşturulmaz. Commit/push/yayın için otomasyon kendi başına yetki üretmez; archive GitHub'a gönderilmez.
