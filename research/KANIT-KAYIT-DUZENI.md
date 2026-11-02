# İddia ve kanıt kayıt düzeni

R12 · 2 Kasım 2026 · Durum: uygulama sürüyor. Bu belge tarihsel kanıt veya yeni doğrulama değildir.

## Katalogdan ayrı katmanlar

`import_catalog.py` kaynak kataloğunun 10 sütunu korunur: id, kurum, baslik, kayit_no, tarih, kayit_turu, url, konu, erisim_durumu, notlar. Kurum çerçevesi tek başına iddia kanıtı değildir. Aşağıdaki alanlar bu sütunlara eklenmez.

- `data/chronology-events.json` içindeki `chronologySource`: olayın kısa kaynak özetinin kaydı. `data/chronology-sources.json` içindeki aynı kimlikli `source` merkez kaynak notu kopyasıdır; üretici ayrışmayı reddeder. Bunlar `iddia_dogrulandi` etiketi taşımaz. Ek anlatı bölümlerinin kaynakları ayrıca kendi URL ve sourceNote alanlarındadır.
- `js/data.js` içindeki `sourceTime`: yalnız belirtilen gemi/olay aşamasının zamanı. eventDate olay, documentDate rapor/belge tarihi, accessDate erişimdir. timeSystem ve limit olmadan saatleri günümüz Türkiye saatine veya başka aşamaya taşıma. Bu katman otomatik olarak doğrulanmış iddia üretmez.
- Kayıt düzeyindeki isteğe bağlı `evidence`: `js/model.js` tarafından denetlenir. Buradaki koşulların geçmesi yalnız yazılı iddia–belge eşleşmesini ifade eder; belgenin gerçekten okunması ve tarihsel değerlendirme insan/araştırma işidir. Alanları doldurmak araştırmanın yerini tutmaz.

## Kayıt düzeyinde doğrulama koşulları

`recordId` ilgili kayıt kimliğiyle, `claim` okuyucuda gösterilen metinle birebir aynı olmalıdır. Metin değişince önceki kanıt yeniden değerlendirilir. `sourceId`, kaydın kaynak listesinde bulunmalıdır. `status` yalnız gerekçeli araştırma sonrasında `iddia_dogrulandi` olabilir.

Zorunlu alanlar: belgeye giden güvenli tam `url`, kısa gerçek pasaj veya açıkça tanımlanmış kanıt özeti `evidenceText`, tam künye `bibliography`, incelenen kapsam ve açık koşullar `scope`, olay tarihi/aralığı `eventDate`, ISO gün biçiminde gerçek erişim tarihi `accessDate`, kaynak yayın tarihi/edisyonu `publicationDate`. Yayın tarihi bilinmiyorsa `publicationDate: null` ve neden doğrulanmadığını açıklayan `publicationDateNote` gerekir; olay tarihi bu alanı doldurmak için kullanılmaz. Eski belirsiz `date` alanı tek başına yeterli değildir.

Modeldeki ilgili belge kaydı ayrıca `scope: belge`, `claimSupport: true`, sayfa/yaprak `page`, belge/nesne numarası `documentNo` ve kanıtla aynı belge URL’sini taşımalıdır. Web kaynağında tarihli bölüm veya nesne numarası konumlayıcı olabilir; uydurma basılı sayfa üretme. Mevcut kaynak çerçevelerine sırf koşulu geçirmek için sahte sayfa/belge numarası verme.

`bibliography` tarihsel tam künyedir; `scope` bütün eser okunmadıysa seçili pasajı açıklar. Özgün tarama ile yayımlanmış çevriyazı, ikincil aktarım ve kurum özeti aynı doğrulama düzeyi sayılmaz. Talimatın yazılması/iletilmesi/teslimi/icrası, isabet/bildirim/terk/batış ve sayı kategorileri ayrı tutulur.

## Okuyucu geçişi ve mevcut sınır

18 kısa olay sayfasından merkezdeki aynı kimlikli kaynak notuna ve merkez notundan olayın `kaynak-notu` başlığına dönülebilir. Kaynak notunda kısa kanıt özeti, olay/yayın/erişim tarihleri, durum ve kapsam görünür. Yerel bağlantı geçmesi tarihsel iddianın doğrulandığı anlamına gelmez.

18 temel kronoloji kaydına künye alanı ve ayrı metadataAccessDate eklendi. 16 DVA kaydında kurumun önerdiği künye yılı 2024 ve son güncelleme 6 Aralık 2024 ayrı açıklanır; ilk yayın ayrıca belirlenmedi. İki AWM kaydının dijital yayın tarihi doğrulanmadı. Künye kontrol tarihi, olay pasajının eski accessDate değerinin yerine geçmez. 36 ek anlatı kaynağının serbest kaynak notlarıyla alan eşlemesi tamamlandı;diğer katmanların kapsam kabulü sürüyor. Modelin mevcut gerçek atlas kayıtları çerçeve durumunda kalır; yeni doğrulandı etiketi verilmedi. Genel R12 kabulü bu belgenin yazılmasıyla kapatılmadı.


## Ek anlatı kaydı

`narrativeSections[].sourceRecord`, mevcut serbest sourceNote yanında isteğe bağlı yapılandırılmış kayıttır. claim ve url bölüm metni/URL ile birebir eşleşmezse üretim durur. bibliography, locator, eventDate, recordDate, publicationDate, digitalPublicationDate, accessDate, evidenceText, scope ve status ayrı tutulur. recordDate, olayın tarihi veya özgün belgenin tarihi olduğuna otomatik hükmetmez; yayımlanmış günlük başlığı olabilir. İlk iki Hamilton kaydında 12–13 Mart olay, 15 Mart kayıt başlığı, 1920 basım, 2006 dijital aktarım açıkça ayrıdır. Bu kayıtlar iddia_dogrulandi değildir. Kaynak ayrıntısı yerinde açılıp ilgili anlatı başlığına dönülebilir. 36 ek kaynak notundan Hamilton I/II’ye ait 8, DVA’ya ait 5, sağlık yayınlarına ait 2 ve Quinn’e ait 7, Watson kataloğu ve kolera hazırlığına ait 2, Limni hastanesine ait 2, Kireçtepe’ye ait 3 ve Monro raporuna ait 1 ve sonbahar/tahliye bağlamına ait son 6 kayıt yapılandırıldı;36/36eknot tamam. Genel kabul için sourceTime ve diğer katmanların alan/geri dönüş envanteri açık. Web kaynağında sourceType:web kitap basımı yerine kaynak yayımı etiketini kullanır. publicationDate/digitalPublicationDate null ise açık belirsizlik gösterilir; publicationDateNote gerekçeyi, metadataAccessDate ayrı künye kontrolünü taşır.

Arşiv (`sourceType: archive`) ve makale (`sourceType: article`) kayıtları kaynak yayımı etiketi kullanır. `witnessGroup` aynı günlük veya aktarım zincirinin pasajlarını bağımsız tanık diye saymayı önlemek için araştırma kimliğidir; tek başına doğrulama veya bağımsızlık ölçüsü değildir.


## Deniz saati kanıtının panelde gösterimi
Dokuz `sourceTime` kaydında `bibliography`, `locator`, `publicationDate`, `publicationDateNote` ve `witnessGroup` bulunur. Harita olay kartındaki “Bu saat kaydının kanıtı” ayrıntısı kısa pasajı, olay/belge/yayın/erişim tarihlerini ve incelenen belge/aktarım bağlantısını gösterir. 1919 resmî basım yılı1915belge tarihi değildir;çevrimyazının ilk web yayımı ayrıca bilinmeyebilir. Vengeance yaprağının yayım tarihi null+gerekçedir. Bunlar yeni doğrulama etiketi üretmez;önceki saat aşamaları ve dakika bağlantı anahtarları korunur. İlgili18Mart anlatısına geçiş `atlasaDon` ile aynı harita kaydına döner. Beş `narrativeSource` kaydının tarih/künye alanları ve diğer katmanların kabulü henüz denetlenmemiştir.
