# Çanakkale Cephesi Dijital Atlası — Durum ve çalışma raporu
25 Ekim 2026 · Yerel proje ve araştırma kayıtları denetimi

## Değerlendirme
Site çalışan bir dijital atlas temelini kurmuş durumda. En büyük eksik yeni bir tasarım sistemi değil; tarihsel iddiaların kanıt derinliği, canlı–yerel sürüm tutarlılığı ve bütün test takımının güvenilirliği. Bu nedenle yeni dekoratif tasarımdan önce doğruluk ve yayın kalitesine ağırlık verilmelidir. Mevcut HTML/CSS/JS/Leaflet mimarisi korunmalıdır.

Bu rapor tam tarihsel doğrulama, tam güvenlik taraması, gerçek cihaz laboratuvarı veya performans ölçümü değildir. İnceleme; proje dosyaları, kaynak notları, testler ve daha önce doğrudan okunan belge kayıtlarına dayanır. Tamamlanma yüzdesi verilmedi: bütün işlerin tanımlı ve ağırlıklandırılmış bir paydası henüz yoktur.

## Bugünkü somut durum
- Ana kronoloji 47 kayıt içeriyor.31 ayrı 18 Mart kaydı var;7 sinde belirli rapor aşamasının saati yerelde gösteriliyor,24 ünde aynı düzeyde saat dayanağı atanmadı.
- Yerelde 46 olay sayfası ve 25 komutan sayfası var.46 olay sayfasının 18 i son çalışmada hazırlanmış kısa kaynaklı yeni sayfalar. Sayfa sayısı, tüm ayrıntıların tarihsel olarak doğrulandığı anlamına gelmez.
- Yerel site haritasında 88 URL var. Bunlar Google indeks sayısı değildir.
- Canlı dosyada 4 sourceTime alanı okundu; yerel veride 7 var.18 yeniolay sayfası ve saatleri önce gösteren düzen henüz yayımlanmadı. Son tamamlanan yayın dbf9197; bu rapor yeni yayın yapmadı.
- Kaynaklar arasında kurum anlatıları, kitap içindeki belge aktarımları, daktilo kopyaları ve özgün günlük taramaları var. Bunlar aynı kanıt düzeyi değildir.
- Harita işaretlerinin önemli bölümü yaklaşık veya temsili; mayın çizgileri şematik. Bu açıklamalar kaldırılmamalı.
- Fotoğraf arşivi, sağlık/tahliye ve beslenme anlatıları mevcut. Yerel fotoğraf adayları yayımlanan görsellerle aynı küme değildir.

## Test denetimi: önemli düzeltme
Önceki 129 sonucu seçili 111 JavaScript+18 Python testine aitti ve bu seçki tekrar geçti. Bütün JavaScript dosyaları ayrıca çalıştırıldı:258 testin 248 i geçti,10 u başarısız. Dokuzunda navalTimeLabel yardımcı işlevi test ortamında tanımlı değil; birinde eski 44 beklentisi yeni 47 kayıtla uyuşmuyor. Bunlar ağırlıkla test ortamı/kapsam güncellemesi gerektiriyor; canlı kullanıcı akışında 10 ayrı hata var sonucu çıkarılamaz. Yine de geniş takım geçmeden sürümün bütünü başarılı diye raporlanmamalıdır. Ham çıktı aynı dizindeki javascript-test-output.txt içinde.

Zorunlu AGENTS denetimi:32 JavaScript ve 18 Python testi geçti. Performans puanı,Google indeks sonucu veya bütün Python testlerinin geçtiği iddia edilmedi.

## Okuyucunun sitede bulması gereken anlatı
Okuyucu önce cephenin neden açıldığını ve coğrafyanın rolünü anlamalı; deniz harekâtından çıkarmalara, siper savaşına, Ağustos mücadelelerine ve tahliyeye kesintisiz geçebilmelidir. Her olay sayfası şu soruları yanıtlamalıdır: Ne zaman ve nerede oldu? Tarafların amacı neydi? Hangi emir veya hazırlık yapıldı? Sahada ne yaşandı? Sonuç neyi değiştirdi? Bir sonraki olayla bağlantısı ne? Hangi cümle hangi belgeyle destekleniyor? Ne hâlâ bilinmiyor?

İdeal sayfa düzeni: kısa giriş; tarih/mevki/taraf kutusu; neden–gelişme–sonuç anlatısı; doğru tarihli hakları açık görsel; haritada göster bağlantısı; belge/pasaj/kanıt açıklaması; ihtilaflar; önceki/sonraki olay. Sayfalar sadece aynı uyarı ve genel kurum bağlantısının tekrarından oluşmamalıdır.

## Öncelikli iş listesi
P0: sonraki yayın öncesi çözülmesi gerekenler. P1: atlasın tarihsel güvenilirliği ve ana anlatısı. P2: içerik kapsamı,kullanım ve işletim olgunluğu. P3: sürdürülebilir araştırma düzeni. Küçük/orta/büyük ifadeleri iş paketi büyüklüğüdür; kesin süre veya teslim taahhüdü değildir.


### R01 · P0 · Tüm test takımını yeniden güvenilir hâle getir

**Mevcut durum:** Geniş koşuda 258 JavaScript testinden 10 u başarısız. Dokuzu navalTimeLabel bağımlılığını yüklemeyen test ortamına, biri eski 44 kayıt beklentisine işaret ediyor. Bu sonuç doğrudan canlıda 10 hata olduğu anlamına gelmez.

**Yapılacak:** side-filter.test.js ortamına gerçek yardımcı işlevi dahil et;44 sabitini 47 veriyle tutarlı kapsam denetimine dönüştür. Süzgeç ve Temizle akışını gerçek tarayıcıda tekrar denetle.

**Bitti sayılma ölçütü:** 258 JavaScript testinin tamamı ve zorunlu 18 Python testi geçmeli; kaynak veri ve kullanıcı davranışı için anlamlı beklentiler korunmalı.

**Dayanak:** tests/side-filter.test.js; research/reports/2026-10-25/javascript-test-output.txt

**Büyüklük / bağımlılık:** Küçük / Yok


### R02 · P0 · Canlı ve yerel sürüm farkını kapat

**Mevcut durum:** Canlı dosyada 4 kaynaklı saat alanı okundu; yerelde 7 var.18 yeni olay sayfası ve kaynaklı saatleri önce gösteren düzen henüz yayımlanmadı.

**Yapılacak:** Yeni 18 sayfayı içeren yayın listesi hazırla; önceki 140 dosyalık paketi tek başına kullanma. Yalnız açık yayın talebinden sonra commit/push/yayın uygula.

**Bitti sayılma ölçütü:** Ana sayfa,7 saat etiketi,18 yeni adres ve sitemap canlıda içerik/hash kontrolünden geçmeli; ham arşiv dışarıda kalmalı.

**Dayanak:** js/data.js; data/chronology-events.json; research/deployment/2026-10-25-naval-time-release/verification.json

**Büyüklük / bağımlılık:** Küçük / R01 ve açık yayın talebi


### R03 · P0 · Kanıtsız sayısal iddiaları bütün sitede tara

**Mevcut durum:** Saatler dışında js/data.js içinde namlu, cephane, tabya isabeti ve personel gibi sayısal taslaklar da bulunuyor. Bu raporda hepsinin yanlış olduğu söylenmiyor; iddia bazında kanıtları yeniden denetlenmeli.

**Yapılacak:** Her sayıyı gösterildiği sayfa, kapsam, tarih, birim ve kaynakla listele. Kanıtsız olanı kesin bilgi biçiminden çıkar. Kuruluş kadrosu, gerçek mevcut, muharip mevcut ve zayiatı ayır.

**Bitti sayılma ölçütü:** Yayımlanan her kritik sayı belge pasajına bağlanmalı veya açıkça tahmin/aktarılmış iddia olarak işaretlenmeli.

**Dayanak:** js/data.js ammo/spend/fortHits/dardanosPeople; AGENTS.md

**Büyüklük / bağımlılık:** Büyük / Yok


### R04 · P1 · 24 açık saat kaydını tek tek değerlendir

**Mevcut durum:** 31 deniz kaydının 7 sinde rapordaki belirli aşama saati gösteriliyor.24 kayıt için aynı düzeyde saat dayanağı atanmadı. İlk dört kartın eski taslak saatleri doğrulanmış sayılmaz.

**Yapılacak:** Önce Osmanlı alarm/ateş emirleri, komuta hareketleri, SignalNo 12, son atış ve zafer raporunu araştır. Bulunamayan saati uydurma; gerekirse olay anlatısını daralt.

**Bitti sayılma ölçütü:** Her kart için desteklenen iddia, açık soru, belge tarihi, saat sistemi ve kanıt görünür olmalı. Kesin saat bulunamayan kart belirsizliğini korumalı.

**Dayanak:** research/source-review/18-mart-saat-2026-10-25/INCELEME.md; js/data.js events

**Büyüklük / bağımlılık:** Büyük / R03


### R05 · P1 · Rapor saatlerini gemi günlükleriyle karşılaştır

**Mevcut durum:** 7 saat aynı 24 Mart rapor aktarımındaki aşamalardır; imzalı bütün gemi raporlarının bağımsız doğrulaması değildir.16.11 bildirim,16.50 dönüş olarak ayrıldı.

**Yapılacak:** Özgün rapor yayımı ve Inflexible/Wear/Ocean/Irresistible günlüklerini ilgili gün düzeyinde karşılaştır. GMT+2 açıklamasını diğer belgelere otomatik uygulama.

**Bitti sayılma ölçütü:** Emir, isabet, bildirim, tahliye ve batış ayrı alanlarda; kaynaklar arası farkın nedeni veya çözülememesi açık.

**Dayanak:** js/data.js sourceTime; olaylar/18-mart-deniz-muharebesi/index.html

**Büyüklük / bağımlılık:** Büyük / R04


### R06 · P1 · Ateş kes kartını kanıtın kapsamına daralt

**Mevcut durum:** Vengeance 18 Martgünlüğünde 6.29 PM ateşi kesme/çıkış kaydı görüntüden okundu. Bu bütün filonun veya Osmanlı bataryalarının son atışı değildir.

**Yapılacak:** Karttaki genel 7 saatbombardıman cümlesini ayrı kanıtla denetle. Tek gemi kaydı kullanılacaksa kapsamını adında/metninde belirt; eski bağlantıyı koru.

**Bitti sayılma ölçütü:** Kullanıcı 18.29 u genel filo ateşkesi sanmamalı. Gemi günlüğü türü rapor çevrimyazısı türünden ayrı gösterilmeli.

**Dayanak:** research/source-review/18-mart-saat-2026-10-25/VENGEANCE-18-MART-ATES-KESME.md

**Büyüklük / bağımlılık:** Orta / R05


### R07 · P1 · Batık, isabet ve tahliye noktalarını ayır

**Mevcut durum:** Irresistible için enkaz noktası dayanağı var; datum belirtilmemiş. Bouvet/Ocean sayısal konum dayanakları tamamlanmış değil. Enkaz noktası isabet noktası yerine kullanılamaz.

**Yapılacak:** Her gemide olay türü, koordinat biçimi, datum, kurum kaydı ve yaklaşık alan gerekçesini kaydet. Yeni sayısal konum yalnız belgeyle değişsin.

**Bitti sayılma ölçütü:** Her işaret neyi gösterdiğini söylemeli; dayanağı olmayan nokta kesin batık yeri gibi görünmemeli.

**Dayanak:** research/ux-audit/batik-koordinat-incelemesi.json; tests/wreck-coordinates.test.js

**Büyüklük / bağımlılık:** Büyük / R03


### R08 · P1 · Mayın ve filo çizgilerinin geometrisini doğrula

**Mevcut durum:** Mevcut çizgiler şematik. Hattın tarihsel anlatısı ile çizginin sayısal geometrisi ayrı kanıtlardır.

**Yapılacak:** Özgün tarihli haritayı ölçek/nirengi/datum bilgisiyle incele; yeterli değilse şematik gösterimi koru. Sayısallaştırma yöntemi ve hata payını belgeye bağla.

**Bitti sayılma ölçütü:** Kesinlik etiketi, kaynak ve şema açıklaması hem masaüstü hem mobilde okunmalı; çizgi tarihsel kesin rota sanılmamalı.

**Dayanak:** js/data.js mineLines/fleetLines; tests/map-geometry.test.js

**Büyüklük / bağımlılık:** Büyük / R07


### R09 · P1 · 18 yeni olay sayfasını derinleştir

**Mevcut durum:** 46 olay sayfasının 18 i yeni, kısa kaynaklı sayfalardır. Ayrı sayfa bulunması kapsamlı muharebe monografisinin tamamlandığı anlamına gelmez.

**Yapılacak:** Her sayfaya neden, hazırlık, gelişme, sonuç ve sonraki olaya geçiş ekle; her tarihsel paragrafı somut pasajla destekle. Yeni veri yokken şablonu aynı sözlerle uzatma.

**Bitti sayılma ölçütü:** Okuyucu ne olduğunu, neden önemli olduğunu ve sonra ne değiştiğini anlayabilmeli; belirsizlikleri ayrıca görebilmeli.

**Dayanak:** data/chronology-events.json; build_pages.py chronology_event_pages

**Büyüklük / bağımlılık:** Büyük / R03


### R10 · P1 · Osmanlı ve İtilaf kaynak dengesini kur

**Mevcut durum:** Yeni kısa kronoloji kayıtlarının çoğu DVA kurum özetine dayanıyor. Tek kurumun çok sayıda bağlantısı bağımsız kanıt sayısı değildir.

**Yapılacak:** Osmanlı ceride/emir aktarımlarını, Britanya günlüklerini ve Fransız birlik belgelerini seçilmiş olaylara bağla. Aynı kaynağı aktaran eserlerin zincirini izle.

**Bitti sayılma ölçütü:** Tarafların amaçları, sahadaki karşılaşma ve sonuçları birlikte anlatılmalı; görüş ile kesin olgu ayrılmalı.

**Dayanak:** research/source-review/chronology-2026-10-25/ARGENT-KAYNAK-ZINCIRI.md; borlat-kullanici-pdf-2026-10-18/TAM-OKUMA.md

**Büyüklük / bağımlılık:** Büyük / R09


### R11 · P1 · 19–24 Mayıs olay zincirini tamamla

**Mevcut durum:** Taarruz, durdurma, mevzide kalma/geri hareket, görüşmeler ve defin aynı olay değildir. Mevcut araştırma dosyaları bu ayrımları içeriyor; sayfalara dengeli aktarım sürmeli.

**Yapılacak:** Birlik raporlarında emrin yazılması, iletilmesi ve uygulanmasını ayır; kesin zayiat cetvelleri olmadan tek toplam üretme.22 Mayısgörüşme görselini 24 Mayısdefin görseli diye kullanma.

**Bitti sayılma ölçütü:** 19 Mayıstan 24 Mayısa neden-sonuç zinciri, kaynak pasajları ve saat sınırlarıyla takip edilebilmeli.

**Dayanak:** research/source-review/borlat-kullanici-pdf-2026-10-18/TAM-OKUMA.md; ateskes-kimlik-2026-10-23

**Büyüklük / bağımlılık:** Büyük / R10


### R12 · P1 · İddia ile kanıt bağlantısını tutarlılaştır

**Mevcut durum:** Genel model kataloğunda kurum çerçeveleri var; kurum ana sayfası tek iddiayı doğrulamıyor. Ayrı sourceTime/chronologySource alanları ve inceleme notları birlikte kullanılıyor.

**Yapılacak:** Mevcut 10 sütunlu katalog şemasını değiştirmeden ayrı iddia-kanıt kayıt düzeni belirle. Her kanıt için tam künye, sayfa/yaprak, URL, kısa pasaj, olay/yayın/erişim tarihi ve kapsam tut.

**Bitti sayılma ölçütü:** Olaydan kanıta ve kanıttan ilgili anlatıya dönülebilmeli; iddia_dogrulandi yalnız açık koşullarla kullanılmalı.

**Dayanak:** js/model.js; import_catalog.py; data/chronology-sources.json

**Büyüklük / bağımlılık:** Orta / R03


### R13 · P1 · Kaynak durumlarını okuyucu diline çevir

**Mevcut durum:** Genel belge doğrulaması uyarıları farklı destek düzeylerini aynı biçimde gösterebiliyor. Rapor saati, kopya görüntüsü ve özgün günlük aynı kanıt türü değil.

**Yapılacak:** Kısa durum etiketi ve açılabilir gerekçe kullan:bu cümle neye dayanıyor, neyi söylemiyor? Teknik durum kodlarını ana anlatının önüne koyma.

**Bitti sayılma ölçütü:** Okuyucu desteklenen genel sonuç ile açık kalan dakika/konumu ayırt edebilmeli; uyarı yorgunluğu azaltılmalı.

**Dayanak:** js/app.js; olaylar/18-mart-deniz-muharebesi/index.html; kaynak-politikasi/index.html

**Büyüklük / bağımlılık:** Orta / R12


### R14 · P2 · 25 komutan sayfasını görev-tarih kapsamıyla gözden geçir

**Mevcut durum:** 25 komutan sayfası bulunuyor; sayfa sayısı biyografilerin bütün ayrıntılarının doğrulandığını göstermez.

**Yapılacak:** Görev başlangıç/bitişi, rütbe, bağlı birlik ve olay bağlarını tarihli belgeyle denetle. Carden 16 Mart/deRobeck 17 Mart ayrımını koru; ad benzerliğinden kimlik üretme.

**Bitti sayılma ölçütü:** Her olayda doğru tarihte doğru görev gösterilmeli; belgesiz doğum/ölüm veya görev dönemi eklenmemeli.

**Dayanak:** komutanlar/; tests/content-review.test.js; js/campaign.js

**Büyüklük / bağımlılık:** Büyük / R10


### R15 · P2 · Sağlık ve tahliye sayılarını sonuç kayıtlarıyla tamamla

**Mevcut durum:** Sağlık anlatısı mevcut; kapasite, hizmet, sevk ve benzersiz kişi sayıları için açıklığa kavuşmayan alanlar var.

**Yapılacak:** Hilâl-iAhmerkapasite farkları; Kilya/Akbaş tarihli sevk; Reşitpaşa hastane seferi; kabul/ölüm/yenidensevk zincirlerini ayrı incele. Aynı hastayı birden çok hizmette sayma.

**Bitti sayılma ölçütü:** Her sayı tanımlı kapsam ve tarihle verilmeli; belge görüntüsü ile akademik aktarım ayrı işaretlenmeli.

**Dayanak:** research/source-review/saglik-2026-10-24/DEVAM.md; saglik-ve-tahliye/index.html

**Büyüklük / bağımlılık:** Büyük / R12


### R16 · P2 · İki tarafın beslenmesini fiilî dağıtımla karşılaştır

**Mevcut durum:** Osmanlı, Anzak, Hamilton kantini ve Fransız su/yemek anlatıları var; Britanya/Fransız birlikleri için tarihli fiilî dağıtım kayıtları eksik.

**Yapılacak:** Talep, sevk, teslim, pişirme ve tüketimi ayrı incele. Erzak cetveli ile bir askerin öğününü aynı veri sayma; tek günü tümorduya genelleme.

**Bitti sayılma ölçütü:** Karşılaştırma aynı tarih/birlik/ikmal aşamasında yapılmalı; yokluk veya bolluk klişesi kaynak yerine geçmemeli.

**Dayanak:** cephede-beslenme/index.html; research/source-review/saglik-2026-10-24/DEVAM.md

**Büyüklük / bağımlılık:** Büyük / R15


### R17 · P2 · Görsel arşivini olaylarla sistemli eşleştir

**Mevcut durum:** Yayımlanan fotoğraflar ve yerel aday manifestleri ayrı. Her aday yayıma hazır veya benzersiz çekim değildir.

**Yapılacak:** Olay/komutan/gemi başına uygun görsel seç; tarih, yer, fotoğrafçı, hak, kurum no ve mükerrerliği denetle. Sonraki gezi fotoğrafını 1915 muharebe anı diye sunma.

**Bitti sayılma ölçütü:** Her yayımlanan görselde tam künye, kısa bağlam, hak ve alternatif metin bulunmalı; belirsiz haklı aday yayımlanmamalı.

**Dayanak:** research/photo-archive/2026-10-24/adaylar.json; fotograf-arsivi/index.html

**Büyüklük / bağımlılık:** Büyük / R09 ve R14


### R18 · P2 · Harita-okuma-kronoloji geçişini sadeleştir

**Mevcut durum:** Harita, olay sayfası ve kaynak dönüşleri çalışıyor; yeni 18 sayfanın tüm akışlarda aynı deneyime kavuşması gerekiyor.

**Yapılacak:** Önceki/sonraki olay, kronolojiye dönüş ve seçili kartı açma yollarını tutarlı yap. Zaman anahtarı ile tarihsel saati arayüzde ayır.

**Bitti sayılma ölçütü:** Kullanıcı konumunu ve seçili kaydı kaybetmeden anlatıdan haritaya, haritadan belgeye dönebilmeli.

**Dayanak:** js/app.js; build_event_navigation.js; tests/deep-links.test.js

**Büyüklük / bağımlılık:** Orta / R01 ve R09


### R19 · P2 · Gerçek mobil ve erişilebilirlik denetimi yap

**Mevcut durum:** 375 ve 1265 CSSpiksel denetimleri var; bu bütün telefon/tarayıcı ve klavye kombinasyonlarının test edildiği anlamına gelmez.

**Yapılacak:** 320 piksel,tablet,yatayekran,%200 metin,klavye,ekranokuyucu,azaltılmışhareket ve harita hareketlerini denetle. Panel kapama,odak dönüşü ve dokunma hedeflerini kontrol et.

**Bitti sayılma ölçütü:** Yatay taşma/odak kaybı olmamalı; bütün temel işlemler dokunma ve klavyeyle yapılabilmeli.

**Dayanak:** research/ux-audit/2026-10-25-times-first-mobile.png; tests/navigation.test.js; tests/tool-focus.test.js

**Büyüklük / bağımlılık:** Orta / R18


### R20 · P2 · Ana sayfanın öğrenme yolunu güçlendir

**Mevcut durum:** Hero,harita,kronoloji mevcut. Kullanıcı sırf uzun kayıt listesine bakarak bütün cephenin akışını kavrayamayabilir.

**Yapılacak:** Deniz harekâtı→çıkarmalar→siper savaşı→Ağustos→tahliye için kısa kaynaklı girişler ve okumaya başlama yolları hazırla. Dekoratif yeni hero üretimini doğruluk işlerinin önüne alma.

**Bitti sayılma ölçütü:** İlk kez gelen okuyucu nereden başlayacağını ve sonraki adımı anlayabilmeli.

**Dayanak:** index.html; prototip/ana-sayfa/; olaylar/index.html

**Büyüklük / bağımlılık:** Orta / R09


### R21 · P2 · Performansı ölç ve bütçe belirle

**Mevcut durum:** Bu denetimde güncel Lighthouse/CoreWebVitals ölçümü yapılmadı; hız puanı veya gerçek kullanıcı metriği verilmiyor.

**Yapılacak:** Mobil ağda ana sayfa,görselarşiv ve uzunolaysayfasını ölç. İlk harita/görsel yükü,gecikmeli yükleme,font,önbellek ve karo kesintisini değerlendir.

**Bitti sayılma ölçütü:** Önce/sonra ölçümleri saklanmalı; işlevi bozmadan ilk içerik ve etkileşim iyileşmeli.

**Dayanak:** index.html; css/; js/; vendor/; tests/vendor.test.js

**Büyüklük / bağımlılık:** Orta / R19


### R22 · P2 · 88 yerel URL ile canlı indekslenmeyi ayır

**Mevcut durum:** Yerel sitemap 88 URL içeriyor. Sitemap bulunması Google’ın tüm sayfaları indekslediğini kanıtlamaz.

**Yapılacak:** Yayın sonrasıcanonical,robots,sitemap,404 ve içbağlantıları kontrol et; SearchConsole erişimi varsa gerçek indeks/kapsama verisini incele. Yeni 18 olaysayfasının canlı URLlerini teyit et.

**Bitti sayılma ölçütü:** Tekcanonical,geçerli sitemap ve tutarlı içbağlantılar; indekslenme iddiası yalnız SearchConsolekanıtıyla.

**Dayanak:** sitemap.xml; robots.txt; tests/site-links.test.js; tests/quality.test.js

**Büyüklük / bağımlılık:** Orta / R02


### R23 · P2 · Tekrarlanabilir yayın ve geri dönüş süreci kur

**Mevcut durum:** Son yayınlarda dosya hash doğrulaması yapıldı. Ancak önceki manifesti kopyalamak yeni sayfaları atlama riski taşıyor.

**Yapılacak:** Yayın dosyalarını tek açık liste/üreticiyle topla; ham arşiv,araştırmaPDFleri ve yerelgörselleri dışla. Önceki sürümün güvenli kopyası ve geri dönüş adımlarını belgeleyip prova et.

**Bitti sayılma ölçütü:** Yerel sayfa kümesi ile paket kümesi eşleşmeli; her yayın sonrası değişen tümURLler doğrulanmalı.

**Dayanak:** research/deployment/; build_pages.py published_pages; AGENTS.md

**Büyüklük / bağımlılık:** Orta / R01


### R24 · P3 · Araştırmayı kabul ölçütleriyle yönet

**Mevcut durum:** Çok sayıda okuma notu birikti. Her yeni not okuyucuya yeni bilgi kattığı anlamına gelmiyor.

**Yapılacak:** Olay başına açık soru,başvurulan kaynak,erişim engeli ve sonraki farklı adımı tut. Yeni kanıtı sayfaya dönüştür;sonuçsuz sorguyu otomatik tekrar etme.

**Bitti sayılma ölçütü:** Her parti ya somut bir iddiayı çözer,ya kullanılabilir anlatı ekler,ya belgelenmiş engelle farklı önceliğe geçer.

**Dayanak:** research/source-review/chronology-2026-10-25/DEVAM.md; research/source-review/

**Büyüklük / bağımlılık:** Orta / R12


## Araştırma için pratik belge talepleri
1. **18Mart:**18Mart1915tarihli filo/gemi/Osmanlı kıyı bataryası kayıtlarının tam künye ve ilgili yaprakları. İstenilen, yalnız olay özetleyenPDFdeğil; olay saati ile bildirim saatini ayırabilecek belge.
2. **19–24Mayıs:**tümen/alay ceridesinin tarihli emir ve sonuç bölümleri; başlangıçmevcudu,zayiat kategorisi ve rapor kapsamı belirtilmiş cetveller. Anlaşma metni ile görüşme anlatısı ayrı.
3. **Harita:**dönem seyir/harekât haritalarının ölçek,datum,nirengi ve kayıt numarası. Günümüz batık tespitiyle1915isabet yeri aynı veri değildir.
4. **Sağlık:**Kızılay belgelerinin özgün görüntüsü ve okunabilir çevriyazısı; kapasiteler ile hasta kabul/sevk cetvellerinin ayrı sayfaları.
5. **İaşe:**belirli birlik,gün ve yere ait teslim/dağıtım/pişirme kayıtları. Nizamname veya planlanan istihkak gerçek öğün yerine konmamalı.
6. **Görseller:**tekil kurum kaydı,orijinal açıklama,tarih/yer/fotoğrafçı,hak metni ve yüksek çözünürlüklü dosyaya kurum bağlantısı. Kaynağı olmayan albüm yeniden paylaşımı yeterli değil.

PDF bulmak yararlı; fakat önce eser/kurum,yazar,yıl,baskı ve sayfa aralığı doğrulanmalıdır. Bütün kitap okunmadıysa ilgili bölümün okunduğu söylenir. Aynı iddiayı birbirinden aktaran üç yayın üç bağımsız tanıklık değildir. Açık erişimin bulunmaması belgenin yokluğu veya otomatik bir telif gerekçesi olarak yazılmamalıdır.

## Uygulama sırası
**İlk parti:**R01testler → R03kritik taslak iddialar → R06Ateşkes kartının kapsamı → R02/R23kontrollü yayın hazırlığı.

**İkinci parti:**R04–R05saat araştırması veR07–R08harita kesinliği; aynı anda kaynak zinciriR12.

**Üçüncü parti:**R09–R11olay anlatıları veiki taraflı belge dengesi;R14komutanlar;R15–R17sağlık,iaşe,görseller.

**Sonraki parti:**R18–R22okuma akışı,mobil,performans veSEO. Bunların kritik bir işlev/erişilebilirlik hatası saptanırsa ilgili iş ön sıraya alınır.

## Korunacak sınırlar
Commit,push,yayın veya scraper bu rapor görevinin parçası değildir. Ham archivevearaştırma görüntüleri GitHuba gönderilmez. Kaynak kataloğunun10sütunu değiştirilmez. Tarihsel boşluk tahmini saat,sayı,koordinat veya yapay tarihsel fotoğrafla doldurulmaz. Aktif otomasyon yeni kopyalar oluşturmadan araştırmaya devam edebilir;geliştirme,yayın ve doğrulama durumları notlarda ayrı tutulmalıdır.


## 26 Ekim kullanıcı kararı — ilk sürüm bitiş kapsamı
Mevcut 88 sayfayı tamamlamayı öncele. Ayrıntılı kabul kapıları ve kaldığı yerden devam protokolü: [İlk sürüm bitiş listesi](ILK-SURUM-BITIS-LISTESI.md). Bu ek R01–R24 sırasını değiştirmez; tamamlanmış işlerin baştan başlatılmasını önler.
