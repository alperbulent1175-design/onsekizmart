/* Çanakkale kara harekâtı ve deniz öncesi, Şubat 1915 – Ocak 1916.
   Yalnız adı konmuş muharebeler ve kesin tarihli olaylar.
   Koordinatlar bilinen mevki merkezleridir; siper hattı değildir.
   Zayiat toplamı, alıntı ve gizli emir yoktur. */
(function () {
  if (!window.OM) return;

  window.OM.campaign = {
    places: [
      {
        id: "ariburnu",
        type: "kampanya",
        name: "Arıburnu (Anzak Koyu)",
        lat: 40.240522,
        lng: 26.281153,
        meta: "25 Nisan 1915 çıkarması · günümüzdeki kıyı ziyaret noktası",
        accuracy: "yaklasik",
        uncertainty: "Alan Başkanlığının Anzak Koyu kıyı ziyaret noktasıyla eşleştirildi. Koyun geometrik merkezi, ilk sandalların karaya çıktığı yer veya 1915 siper hattının kesin koordinatı değildir.",
        coordinateSource: {
          url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/diger-ziyaret-noktalari/anzak-koyu",
          label: "Alan Başkanlığı · Anzak Koyu",
          bibliography: "Çanakkale Savaşları Gelibolu Tarihi Alan Başkanlığı, Anzak Koyu, Diğer Ziyaret Noktaları, kurumsal ziyaret rehberi.",
          locator: "Anzak Koyu başlığı altındaki Ziyaret Noktasına Git bağlantısı.",
          sourceKind: "Güncel kurumsal ziyaret rehberi",
          eventDate: null,
          eventDateNote: "Güncel kıyı ziyaret noktası için yer dayanağıdır; ilk çıkarma veya siper çizgisinin kesin noktası değildir.",
          documentDate: null,
          documentDateNote: "Sayfanın hazırlanma tarihi ve özgün bir 1915 belgesinin düzenlenme tarihi ayrıca belirlenmedi.",
          publicationDate: null,
          publicationDateNote: "İncelenen sayfada ilk yayım tarihi belirlenmedi; altbilgideki telif yılı yayım tarihi sayılmadı.",
          accessDate: "2026-10-20",
          metadataReviewDate: "2026-11-03",
          readingScope: "20 Ekim ziyaret hedefi karşılaştırması korundu; 3 Kasım özel sayfa başlığı ve ziyaret bağlantısının varlığı kontrol edildi. Sayısal hedef yeniden ölçülmedi; 1915 mevzi tespiti yapılmadı. Diğer tarihsel anlatılar bu künye kontrolünde doğrulanmadı.",
          evidenceText: "Ziyaret Noktasına Git: destination=40.240522, 26.281153",
          date: "2026-10-20",
          status: "kurumsal_ziyaret_noktasi_karsilastirildi",
          datum: "belirtilmemis"
        },
        note: [
          "İşaret, kurumun yayımladığı Anzak Koyu kıyı ziyaret noktasıdır; ilk çıkarma veya siper çizgisi değildir.",
          "Çıkarma, Kabatepe’nin kuzeyinde bu koya yapılmıştır.",
          "Kıyıdaki Osmanlı birliği 9. Tümen’den 27. Alay’dır. 19. Tümen aynı gün sırtlara yetişir."
        ]
      },
      {
        id: "conkbayiri",
        type: "kampanya",
        name: "Conkbayırı",
        lat: 40.250658,
        lng: 26.308544,
        meta: "6–10 Ağustos 1915 · günümüzdeki anıt çevresi",
        accuracy: "yaklasik",
        uncertainty: "Alan Başkanlığının Conkbayırı Atatürk Zafer Anıtı ziyaret noktasıdır. Muharebe sahasını temsil eder; 1915 siperlerinin veya taarruz başlangıcının kesin koordinatı değildir.",
        coordinateSource: {
          url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/sehitlikveanitlar/conkbayiri-ataturk-zafer-aniti",
          label: "Alan Başkanlığı · Conkbayırı Atatürk Zafer Anıtı",
          bibliography: "Çanakkale Savaşları Gelibolu Tarihi Alan Başkanlığı, Conkbayırı Atatürk Zafer Anıtı, Şehitlikler ve Anıtlar, kurumsal ziyaret rehberi.",
          locator: "Conkbayırı Atatürk Zafer Anıtı başlığı altındaki Ziyaret Noktasına Git bağlantısı.",
          sourceKind: "Güncel kurumsal ziyaret rehberi",
          eventDate: null,
          eventDateNote: "Güncel anıt çevresi için yer dayanağıdır; 1915 siperinin, hücumun veya komuta noktasının kesin konumu değildir.",
          documentDate: null,
          documentDateNote: "Sayfanın hazırlanma tarihi ve özgün bir 1915 belgesinin düzenlenme tarihi ayrıca belirlenmedi.",
          publicationDate: null,
          publicationDateNote: "İncelenen sayfada ilk yayım tarihi belirlenmedi; altbilgideki telif yılı yayım tarihi sayılmadı.",
          accessDate: "2026-10-20",
          metadataReviewDate: "2026-11-03",
          readingScope: "20 Ekim ziyaret hedefi karşılaştırması korundu; 3 Kasım özel sayfa başlığı ve ziyaret bağlantısının varlığı kontrol edildi. Sayısal hedef yeniden ölçülmedi; 1915 mevzi tespiti yapılmadı. Diğer tarihsel anlatılar bu künye kontrolünde doğrulanmadı.",
          evidenceText: "Ziyaret Noktasına Git: destination=40.250658, 26.308544",
          date: "2026-10-20",
          status: "kurumsal_ziyaret_noktasi_karsilastirildi",
          datum: "belirtilmemis"
        },
        note: [
          "İşaret, kurumun güncel anıt ziyaret noktasıyla eşleştirilmiştir; tarihsel siper noktası değildir.",
          "6–10 Ağustos muharebelerinin merkezidir. 10 Ağustos’ta Osmanlı karşı taarruzu tepeyi geri alır.",
          "Sırtın kuzeyindeki Kocaçimentepe’ye ulaşılamaz. Ayrı bir işaret konmadı."
        ]
      },
      {
        id: "kanlisirt",
        type: "kampanya",
        name: "Kanlısırt",
        lat: 40.2304,
        lng: 26.2873,
        meta: "6–9 Ağustos 1915 · plato",
        accuracy: "yaklasik",
        uncertainty: "Plato için temsili noktadır; sayısal kaynak eşleştirmesi tamamlanmadı. Kurumun Kanlısırt Kitabesi ziyaret noktası bütün muharebe alanının merkezi yerine kullanılmadı.",
        coordinateReview: {
          url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/sehitlikveanitlar/kanlisirt-kitabesi",
          label: "Alan Başkanlığı · Kanlısırt Kitabesi",
          evidenceText: "Kitabe, Kanlısırt’ın doğu ucunda yer alır.",
          bibliography: "Çanakkale Savaşları Gelibolu Tarihi Alan Başkanlığı, Kanlısırt Kitabesi, Şehitlikler ve Anıtlar, kurumsal ziyaret sayfası.",
          locator: "Kanlısırt Kitabesi başlığının ilk anlatı cümlesi: kitabenin Kanlısırt’ın doğu ucunda bulunması.",
          sourceKind: "Kurumsal yer ve anıt anlatımı",
          eventDate: null,
          eventDateNote: "Kitabenin yer anlatımıdır; bir muharebenin tarihi veya platonun tamamının sayısal sınırı değildir.",
          documentDate: null,
          documentDateNote: "Bu bölüm özgün bir 1915 belgesinin düzenlenme tarihini vermez.",
          publicationDate: null,
          publicationDateNote: "İncelenen özel sayfada ilk yayım tarihi belirlenmedi; altbilgideki telif yılı yayım tarihi sayılmadı.",
          accessDate: "2026-10-20",
          metadataReviewDate: "2026-11-03",
          readingScope: "20 Ekim plato–kitabe ayrımı korundu; 3 Kasım başlık ve ilk yer cümlesi yeniden okundu. Kitabenin ziyaret hedefi bütün plato yerine geçirilmedi; mevcut sayısal nokta doğrulanmadı. Diğer olay, saat ve zayiat anlatıları bu künye incelemesinde doğrulanmadı.",
          date: "2026-10-20",
          status: "anlatim_incelendi_nokta_dogrulanmadi"
        },
        note: [
          "Arıburnu cephesinin güney platosu. İşaret, Kanlısırt mevkiidir.",
          "Muharebe 6 Ağustos 1915’te başlar ve birkaç gün sürer."
        ]
      },
      {
        id: "anafartalar",
        type: "kampanya",
        name: "Anafartalar / Suvla",
        lat: 40.302,
        lng: 26.252,
        meta: "6–7 Ağustos çıkarması · temsili saha noktası",
        accuracy: "yaklasik",
        uncertainty: "Geniş bir harekât sahasını temsil eder. Geometrik merkez, çıkarma noktası veya komuta mevzii olarak sayısal doğrulaması tamamlanmadı.",
        coordinateReview: {
          url: "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/map-australian-locations",
          label: "DVA Anzac Portal · Gallipoli haritaları",
          evidenceText: "Suvla Bay to the north of Anzac Cove",
          bibliography: "Australian Government, Department of Veterans’ Affairs, Anzac Portal, Maps of Australian locations on Gallipoli 1915, haritalar ve coğrafi açıklamalar.",
          locator: "Genel Gelibolu haritasının konum listesi: Suvla Bay ile Anzac Cove arasındaki kuzey–güney ilişkisi.",
          sourceKind: "Kurumsal tarihî coğrafya açıklaması",
          eventDate: null,
          eventDateNote: "Haritalar seferin farklı dönemlerini gösterir; bu yer ilişkisi tek bir muharebe günü veya saha merkezi belirlemez.",
          documentDate: null,
          documentDateNote: "Açıklama, özgün bir askerî haritanın çizim veya raporun düzenlenme tarihi olarak kullanılmadı.",
          publicationDate: null,
          publicationDateNote: "İncelenen harita açıklamasında ilk yayım tarihi ayrıca belirlenmedi.",
          accessDate: "2026-10-20",
          metadataReviewDate: "2026-11-03",
          readingScope: "20 Ekim bölgesel ilişki incelemesi korundu; 3 Kasım başlık ve ilgili konum maddesi yeniden okundu. Harita görüntüsünden koordinat türetilmedi; Anafartalar saha merkezi doğrulanmadı. Kirte künyesi aynı sayfanın başka pasajıdır; bağımsız ikinci kaynak değildir.",
          evidenceLanguage: "en",
          translation: "Anzak Koyu’nun kuzeyindeki Suvla Koyu",
          date: "2026-10-20",
          status: "anlatim_incelendi_nokta_dogrulanmadi"
        },
        note: [
          "İşaret, Suvla Koyu ile Anafarta köyleri arasındaki saha için temsili bir noktadır; tek bir siper veya doğrulanmış saha merkezi değildir.",
          "Çıkarma 6–7 Ağustos gecesi koyadır. Birinci Anafartalar 9 Ağustos, İkinci Anafartalar 21 Ağustos’tadır."
        ]
      },
      {
        id: "kirte",
        type: "kampanya",
        name: "Kirte (Alçıtepe köyü)",
        lat: 40.0714,
        lng: 26.2036,
        meta: "Birinci, İkinci, Üçüncü Kirte",
        accuracy: "yaklasik",
        uncertainty: "Köy çevresi için temsili noktadır; tarihsel köy sınırı, tepe zirvesi veya hücum hattı olarak sayısal kaynak eşleştirmesi tamamlanmadı.",
        coordinateReview: {
          url: "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/map-australian-locations",
          label: "DVA Anzac Portal · Seddülbahir harita açıklaması",
          evidenceText: "Achi Baba, the hill above Krithia",
          bibliography: "Australian Government, Department of Veterans’ Affairs, Anzac Portal, Maps of Australian locations on Gallipoli 1915, haritalar ve coğrafi açıklamalar.",
          locator: "Seddülbahir/Cape Helles haritasının konum listesi: Krithia ve Achi Baba ayrı maddeleri.",
          sourceKind: "Kurumsal tarihî coğrafya açıklaması",
          eventDate: null,
          eventDateNote: "Köy ile tepenin coğrafi ayrımı için okunmuştur; muharebe veya köy sınırının tespit tarihi değildir.",
          documentDate: null,
          documentDateNote: "Açıklama, özgün bir askerî haritanın çizim veya raporun düzenlenme tarihi olarak kullanılmadı.",
          publicationDate: null,
          publicationDateNote: "İncelenen harita açıklamasında ilk yayım tarihi ayrıca belirlenmedi.",
          accessDate: "2026-10-20",
          metadataReviewDate: "2026-11-03",
          readingScope: "20 Ekim köy–tepe ayrımı korundu; 3 Kasım başlık ve ilgili iki konum maddesi yeniden okundu. Köy çevresindeki nokta tepe zirvesi veya hücum hattı yapılmadı; sayısal doğrulama yoktur. Anafartalar künyesi aynı sayfanın başka pasajıdır; bağımsız ikinci kaynak değildir.",
          evidenceLanguage: "en",
          translation: "Kirte’nin yukarısındaki tepe: Achi Baba",
          date: "2026-10-20",
          status: "anlatim_incelendi_nokta_dogrulanmadi"
        },
        note: [
          "İşaret, Kirte köyü çevresini temsil eder; köyün tarihsel sınırı veya gerisindeki tepenin zirvesi değildir.",
          "Üç Kirte muharebesi bu köye ve gerisindeki sırta yöneliktir."
        ]
      },
      {
        id: "zigindere",
        type: "kampanya",
        name: "Zığındere",
        lat: 40.066,
        lng: 26.175,
        meta: "28 Haziran – 5 Temmuz 1915",
        accuracy: "yaklasik",
        uncertainty: "Dere çevresi için temsili noktadır; koordinatın belgeyle eşleştirilmesi tamamlanmadı. Saha merkezi veya tarihsel siper noktası olarak okunmamalıdır.",
        note: [
          "İşaret, dere çevresi için temsili bir noktadır; doğrulanmış saha merkezi, dere yatağı veya tarihsel siper noktası değildir."
        ]
      },
      {
        id: "kerevizdere",
        type: "kampanya",
        name: "Kerevizdere",
        lat: 40.065,
        lng: 26.228,
        meta: "12–13 Temmuz 1915",
        accuracy: "yaklasik",
        uncertainty: "Dere ve muharebe sahası için temsili noktadır. Saha merkezi, dere yatağı veya siper hattı olarak sayısal doğrulaması tamamlanmadı. Fransız toplarının ziyaret kaydı bu noktanın koordinat kanıtı değildir.",
        coordinateReview: {
          url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/diger-ziyaret-noktalari/fransiz-toplari",
          label: "Alan Başkanlığı · Fransız Topları",
          evidenceText: "özellikle Kerevizdere ve Zığındere Muharebeleri’nde kullanılan",
          bibliography: "Çanakkale Savaşları Gelibolu Tarihi Alan Başkanlığı, Fransız Topları, Diğer Ziyaret Noktaları, kurumsal ziyaret sayfası.",
          locator: "Fransız Topları başlığının ikinci anlatı paragrafı: Kerevizdere ve Zığındere muharebelerinin adlandırılması.",
          sourceKind: "Kurumsal ziyaret ve muharebe anlatısı",
          eventDate: null,
          eventDateNote: "Muharebe adlarına değinen pasajdır; belirli bir günün ateş, yerleştirme veya terk saati verilmiş sayılmaz.",
          documentDate: null,
          documentDateNote: "Sayfa özgün bir topçu raporunun düzenlenme tarihini belirtmez.",
          publicationDate: null,
          publicationDateNote: "İncelenen özel sayfada ilk yayım tarihi belirlenmedi; altbilgideki telif yılı yayım tarihi sayılmadı.",
          accessDate: "2026-10-20",
          metadataReviewDate: "2026-11-03",
          readingScope: "20 Ekim saha–ziyaret noktası ayrımı korundu; 3 Kasım başlık ve ilgili adlandırma pasajı yeniden okundu. Topların ziyaret kaydı dere yatağı, bütün muharebe sahası veya siper hattı için sayısal kanıt yapılmadı. Diğer tarih, silah adı ve kayıp anlatıları ayrıca doğrulanmadı.",
          date: "2026-10-20",
          status: "anlatim_incelendi_nokta_dogrulanmadi"
        },
        note: [
          "İşaret, Kerevizdere muharebe sahasını temsil eder; doğrulanmış geometrik merkez veya kesin dere yatağı değildir."
        ]
      },
      {
        id: "morto",
        type: "kampanya",
        name: "Morto Koyu",
        lat: 40.064,
        lng: 26.19,
        uncertainty: "Bu temsilî noktanın koyun merkeziyle sayısal eşleştirmesi tamamlanmadı. Fransız Mezarlığı için yayımlanan güncel ziyaret koordinatı koyun merkezi veya Goliath enkazının konumu değildir; bu kayda aktarılmadı.",
        meta: "13 Mayıs 1915 · Goliath",
        note: [
          "Seddülbahir’in Boğaz tarafındaki koy.",
          "13 Mayıs 1915’te HMS Goliath burada, Muavenet-i Milliye’nin torpiliyle batmıştır."
        ]
      }
    ],

    events: [
      {
        id: "e-subat19",
        date: "19 Şubat 1915",
        side: "both",
        domain: "deniz",
        battle: false,
        title: "Dış tabyaların bombardımanı",
        text: "Amiral Carden’ın filosu Seddülbahir ve Kumkale’deki giriş tabyalarını bombardıman eder. Boğaz geçilmez.",
        place: "seddulbahir"
      },
      {
        id: "e-subat25",
        date: "25 Şubat – 4 Mart 1915",
        side: "both",
        domain: "ikisi",
        battle: false,
        title: "Giriş tabyaları ve kısa çıkarmalar",
        text: "DVA kronolojisi, 25 Şubat bombardımanını, 26 Şubat–3 Mart tahrip çıkarmalarını ve 4 Mart’ta Seddülbahir’deki timlerin tahliyesini ayrı aşamalar olarak anlatır.",
        place: "kumkale"
      },
      {
        "id": "e-mart-sessiz-1",
        "date": "1–17 Mart 1915",
        "side": "itilaf",
        "domain": "deniz",
        "battle": false,
        "title": "Mayın tarama girişimleri",
        "text": "İngiliz trol tekneleri geçidi temizleyemedi.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "1 March 1915 başlığı altındaki 1–17 Mart tarih aralığı",
          "eventDate": "1–17 Mart 1915",
          "publicationDate": "2024",
          "accessDate": "2026-11-01",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "İngiliz trol tekneleri geçidi temizleyemedi.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-nusret",
        date: "8 Mart 1915",
        side: "osmanli",
        domain: "deniz",
        battle: false,
        title: "Nusret, Erenköy hattını döker",
        text: "Nusret’in Erenköy mayın dökümü 8 Mart kaydıyla ele alınır. Kurum anlatıları 26 mayın verir; ceride ve günlük aktarımlarındaki sayı farkı olay sayfasında açıklanır.",
        place: "nusret"
      },
      {
        "id": "e-mart-sessiz-2",
        "date": "13 Mart 1915",
        "side": "itilaf",
        "domain": "kara",
        "battle": false,
        "title": "Hamilton’a talimat",
        "text": "Kara harekâtı donanmanın başarısızlığına bağlandı.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "13 March 1915",
          "eventDate": "13 Mart 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-29",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Kara harekâtı donanmanın başarısızlığına bağlandı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        },
        cardenBirakma: "16 Mart 1915",
        robeckGorev: "17 Mart 1915",
        komutaDurumu: "insan_incelemesi_gerekli"
      },
      {
        id: "e-mart18",
        date: "18 Mart 1915",
        side: "both",
        domain: "deniz",
        battle: true,
        title: "18 Mart Deniz Muharebesi",
        text: "De Robeck’in filosu Boğaz’a girer. Bouvet, Irresistible ve Ocean batar; Inflexible ve Gaulois ağır yara alır. Boğaz geçilmez. İlgili kayıtlar haritanın 18 Mart görünümündedir; saat denetimi sürüyor.",
        place: "bouvet",
        navalMinute: 834
      },
      {
        "id": "e-mart-nisan",
        "date": "1 Nisan 1915",
        "side": "itilaf",
        "domain": "kara",
        "battle": false,
        "title": "ANZAK sevk emri",
        "text": "Mısır’daki birliklere hareket emri verildi.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "1 April 1915",
          "eventDate": "1 Nisan 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-28",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Mısır’daki ANZAK Kolordusu cepheye hareket emri aldı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-e15",
        date: "17 Nisan 1915",
        side: "both",
        domain: "deniz",
        battle: false,
        title: "E15 Boğaz’da karaya oturur",
        text: "E15, 17 Nisan 1915’te Boğaz geçişi sırasında karaya oturdu. Karaya oturma ile daha sonraki tahrip işlemi ayrı aşamalardır.",
        place: "dardanos"
      },
      {
        "id": "e-nisan-sessiz",
        "date": "20 Nisan 1915",
        "side": "itilaf",
        "domain": "ikisi",
        "battle": false,
        "title": "Mondros’ta çıkarma hazırlığı",
        "text": "Çıkarma hazırlığı için gemiler Limni’deki Mondros Limanı’nda toplandı.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "20 April 1915",
          "eventDate": "20 Nisan 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-29",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Çıkarma hazırlığı için gemiler Limni’deki Mondros Limanı’nda toplandı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-seddul",
        date: "25 Nisan 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Seddülbahir çıkarması",
        text: "AWM anlatısı, İngiliz 29. Tümeni’nin Seddülbahir görevini ve beş kumsala çıkışı açıklar. Kıyıya çıkış, planlanan ilerlemenin tamamlanması değildir; Osmanlı birliklerinin kumsal bazındaki dağılımı için belge karşılaştırması açıktır.",
        place: "seddulbahir"
      },
      {
        id: "e-ari",
        date: "25 Nisan 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Arıburnu çıkarması",
        text: "ANZAK birlikleri ilk sırtlara çıktı; daha uzak harekât hedeflerine ulaşılamadı. Çıkarma ile bütün hedeflere ulaşmak ayrı aşamalardır; kaynak notu olay sayfasındadır.",
        place: "ariburnu"
      },
      {
        id: "e-kumkale",
        date: "25 Nisan 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Kumkale oyalama çıkarması",
        text: "Fransız sefer kolu Kumkale’ye çıkar. Anadolu yakasında gerçekleşir; savunmaya katılan birliklerin kapsamı kaynak notunda ayrılır. Kumkale’den geri çekilme ve Seddülbahir’e yeniden sevk ayrı aşamalardır; kaynak notu olay sayfasındadır.",
        place: "kumkale"
      },
      {
        id: "e-saros",
        date: "25 Nisan 1915",
        side: "itilaf",
        domain: "kara",
        battle: false,
        title: "Saros gösterişi",
        text: "Deniz raporunun çıkarma planında Saros–Bolayır kesimi için gösteri harekâtı yer alır. Harita işareti temsili bir birlik noktasıdır; gemi mevzii veya doğrulanmış saha merkezi değildir.",
        place: "tumen-7"
      },
      {
        id: "e-nisan2627",
        date: "26–27 Nisan 1915",
        side: "both",
        domain: "kara",
        battle: false,
        title: "Çıkarma sonrasındaki günler",
        text: "Bu tarih aralığında çatışmaların sürmesi, atlasın ayrı bir muharebe kartı bulundurmamasıyla çelişmez.",
        place: "seddulbahir"
      },
      {
        id: "e-kirte1",
        date: "28 Nisan 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Birinci Kirte Muharebesi",
        text: "Seddülbahir’deki İtilaf kuvveti Kirte’ye ilerler. Köy ve gerisindeki sırt alınamaz.",
        place: "kirte"
      },
      {
        "id": "e-nisan-mayis",
        "date": "29 Nisan 1915",
        "side": "itilaf",
        "domain": "deniz",
        "battle": false,
        "title": "Yaralılar Mısır’a ulaşıyor",
        "text": "Gascon İskenderiye’ye ulaştı.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "29 April 1915",
          "eventDate": "29 Nisan 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Gascon İskenderiye’ye ulaştı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-kirte2",
        date: "6–8 Mayıs 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "İkinci Kirte Muharebesi",
        text: "İtilaf kuvveti Kirte’ye yeniden yüklenir. Hedef alınamaz.",
        place: "kirte"
      },
      {
        "id": "e-mayis-sessiz-1",
        "date": "9–10 Mayıs 1915",
        "side": "both",
        "domain": "kara",
        "battle": true,
        "title": "Quinn’s Post siper baskını",
        "text": "Alınan Osmanlı siperi ertesi sabah bırakıldı.",
        "place": "ariburnu",
        "chronologySource": {
          "url": "https://www.awm.gov.au/collection/C1342882",
          "label": "AWM4 23/32/7 · 15. Tabur günlüğü",
          "passage": "Görüntü 4–5 / yaprak 46–47; 9–10 Mayıs 1915",
          "eventDate": "9–10 Mayıs 1915",
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "gunluk_goruntusu_ilgili_pasaj_okundu",
          "evidenceText": "Alınan Osmanlı siperi ertesi sabah bırakıldı.",
          "scope": "Avustralya 15. Taburunun el yazılı günlük taramasında 9–10 Mayıs pasajları okundu. 63 sayfanın tümü okunmadı; Osmanlı emir/raporlarıyla tam karşılaştırma yapılmadı. Saat sistemi ayrıca kalibre edilmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Australian War Memorial, Australian Imperial Force unit war diaries, 1914–18 War; 15th Infantry Battalion, AWM4 23/32/7, May 1915; dijital kayıt C1342882, RCDIG1004304.",
          "publicationDateNote": "Mayıs 1915 günlük belge dönemidir; taramanın veya dijital katalog kaydının yayım tarihi ayrıca doğrulanmadı."
        }
      },
      {
        id: "e-goliath",
        date: "13 Mayıs 1915",
        side: "both",
        domain: "deniz",
        battle: false,
        title: "Goliath batar",
        text: "Muavenet-i Milliye, Morto Koyu’nda HMS Goliath’ı torpiller. Gemi batar. 18 Mart ana muharebe listesinde yoktur.",
        place: "morto"
      },
      {
        "id": "e-mayis-sessiz-2",
        "date": "17 Mayıs 1915",
        "side": "itilaf",
        "domain": "kara",
        "battle": false,
        "title": "Yeraltından kazma sesleri",
        "text": "Joseph Slack, Quinn’s Post’ta kazı duydu.",
        "place": "ariburnu",
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "17 May 1915",
          "eventDate": "17 Mayıs 1915",
          "publicationDate": "2024",
          "accessDate": "2026-11-02",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Joseph Slack, Quinn’s Post’ta kazı duydu.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-may19",
        date: "19 Mayıs 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Arıburnu genel taarruzu",
        text: "Osmanlı kuvvetleri Arıburnu cephesine genel taarruz yapar. Hat kırılmaz.",
        place: "ariburnu"
      },
      {
        "id": "e-mayis-sessiz-3",
        "date": "22 Mayıs 1915",
        "side": "both",
        "domain": "kara",
        "battle": false,
        "title": "Ateşkes görüşmeleri",
        "text": "Kemal Ohri, Birdwood karargâhında görüşmelere katıldı.",
        "place": "ariburnu",
        "chronologySource": {
          "url": "https://www.awm.gov.au/collection/C45317",
          "label": "AWM · H02318 fotoğraf kaydı",
          "passage": "22 May 1915",
          "eventDate": "22 Mayıs 1915",
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "fotograf_katalog_aciklamasi_okundu",
          "evidenceText": "Kemal Ohri, Birdwood karargâhında görüşmelere katıldı.",
          "scope": "Fotoğrafın tarih ve açıklama alanları okundu; anlaşma metni değildir.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Australian War Memorial, H02318, siyah beyaz fotoğraf; dijital katalog kaydı C45317, Butler ve Ohri’nin Osmanlı hatlarına dönüşü.",
          "publicationDateNote": "22 Mayıs 1915 fotoğrafın çekim tarihidir; dijital katalog kaydının yayım tarihi ayrıca doğrulanmadı. Bu kontrolde fotoğrafçı belirlenmedi."
        }
      },
      {
        id: "e-ateskes",
        date: "24 Mayıs 1915",
        side: "both",
        domain: "kara",
        battle: false,
        title: "Arıburnu gömme ateşkesi",
        text: "İki taraf Arıburnu’nda ölüleri gömmek için ateşkes yapar. Bu bir muharebe değildir.",
        place: "ariburnu"
      },
      {
        id: "e-triumph",
        date: "25 Mayıs 1915",
        side: "itilaf",
        domain: "deniz",
        battle: false,
        title: "Triumph batar",
        text: "Alman denizaltısı U-21, HMS Triumph’u Arıburnu açıklarında batırır. Gemi 18 Mart’ta filodadır; o gün batmamıştır.",
        place: "ariburnu"
      },
      {
        id: "e-majestic",
        date: "27 Mayıs 1915",
        side: "itilaf",
        domain: "deniz",
        battle: false,
        title: "Majestic batar",
        text: "U-21, HMS Majestic’i Seddülbahir açıklarında batırır. Gemi 18 Mart’ta C Hattı’ndadır; o gün batmamıştır.",
        place: "seddulbahir"
      },
      {
        "id": "e-mayis-haziran",
        "date": "29 Mayıs 1915",
        "side": "both",
        "domain": "kara",
        "battle": true,
        "title": "Quinn’s Post lağım taarruzu",
        "text": "Patlamayı Osmanlı hücumu izledi; mevzi tutulamadı.",
        "place": "ariburnu",
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "29 May 1915",
          "eventDate": "29 Mayıs 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Patlamayı Osmanlı hücumu izledi; mevzi tutulamadı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-kirte3",
        date: "4 Haziran 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Üçüncü Kirte Muharebesi",
        text: "Seddülbahir cephesinde Kirte’ye üçüncü büyük taarruz yapılır. Köy alınamaz.",
        place: "kirte"
      },
      {
        "id": "e-haziran-sessiz",
        "date": "19 Haziran 1915",
        "side": "itilaf",
        "domain": "ikisi",
        "battle": false,
        "title": "Watson İskelesi tamamlandı",
        "text": "Anzak ikmali için iskele tamamlandı.",
        "place": "ariburnu",
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "19 June 1915",
          "eventDate": "19 Haziran 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Anzak ikmali için iskele tamamlandı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-zigin",
        date: "28 Haziran – 5 Temmuz 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Zığındere Muharebesi",
        text: "Seddülbahir cephesinin Ege yakasında, Zığındere boyunca muharebe edilir.",
        place: "zigindere"
      },
      {
        "id": "e-temmuz-sessiz",
        "date": "7 Temmuz 1915",
        "side": "itilaf",
        "domain": "kara",
        "battle": false,
        "title": "Kolera aşılaması",
        "text": "Anzak’ta kolera aşılamasına başlandı.",
        "place": "ariburnu",
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "7 July 1915",
          "eventDate": "7 Temmuz 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Anzak’ta kolera aşılamasına başlandı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-kereviz",
        date: "12–13 Temmuz 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Kerevizdere Muharebesi",
        text: "Bu kart 12–13 Temmuz Kerevizdere aşamasını kapsar; 21–22 Haziran muharebesi ayrı bir aşamadır. Kaynaklardaki adlandırma farkı olay sayfasında açıklanır.",
        place: "kerevizdere"
      },
      {
        "id": "e-temmuz-agustos",
        "date": "29 Temmuz 1915",
        "side": "itilaf",
        "domain": "kara",
        "battle": false,
        "title": "Hastane ekibi Limni’de",
        "text": "Üçüncü Avustralya Genel Hastanesi Limni’ye ulaştı.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "29 July 1915",
          "eventDate": "29 Temmuz 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Üçüncü Avustralya Genel Hastanesi Limni’ye ulaştı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-kanli",
        date: "6–9 Ağustos 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Kanlısırt Muharebesi",
        text: "Arıburnu cephesinin güney platosunda Kanlısırt muharebesi başlar ve birkaç gün sürer.",
        place: "kanlisirt"
      },
      {
        id: "e-suvla",
        date: "6–7 Ağustos 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Anafartalar / Suvla çıkarması",
        text: "Suvla çıkarması 6 Ağustosta başladı. Yakın tepe kazanımları ile iç kesimdeki hedefler ayrılır. 6–7 Ağustos çıkarma gecesi, IX. Kolordu komuta günü ve 15 Ağustos devri birleştirilmedi; ayrıntılar olay sayfasındadır.",
        place: "anafartalar"
      },
      {
        id: "e-conk",
        date: "6–10 Ağustos 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Conkbayırı Muharebesi",
        text: "DVA anlatısı zirveye çıkış ile Osmanlı karşı taarruzunu ayırır. Bakanlık kronolojisi Mustafa Kemal’in Conkbayırı hücumunu 10 Ağustos’a kaydeder; bu kesit, geniş Sarıbayır harekâtıyla aynı tarih kapsamı değildir.",
        place: "conkbayiri"
      },
      {
        id: "e-barbaros",
        date: "8 Ağustos 1915",
        side: "both",
        domain: "deniz",
        battle: false,
        title: "Barbaros Hayreddin batar",
        text: "Barbaros Hayreddin, Marmara’da İngiliz denizaltısı E11 tarafından batırılır. Bu batış 18 Mart muharebesine ait değildir; o günkü kesin konumu için gemi jurnali karşılaştırması gerekir. Batış noktasının koordinatı bu haritaya konmadı.",
        place: null
      },
      {
        id: "e-anaf1",
        date: "9 Ağustos 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Birinci Anafartalar Muharebesi",
        text: "Suvla önünde Osmanlı karşı taarruzu (Birinci Anafartalar). Çıkarma kuvveti sırtlara yerleşemez.",
        place: "anafartalar"
      },
      {
        "id": "e-agustos-sessiz",
        "date": "15 Ağustos 1915",
        "side": "both",
        "domain": "kara",
        "battle": true,
        "title": "Kireçtepe taarruzu",
        "text": "İngiliz ilerlemesi sınırlı kaldı.",
        "place": "anafartalar",
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "15 August 1915",
          "eventDate": "15 Ağustos 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "İngiliz ilerlemesi sınırlı kaldı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-anaf2",
        date: "21 Ağustos 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "İkinci Anafartalar Muharebesi",
        text: "Bakanlık kronolojisi İkinci Anafartalar’ı 21 Ağustos’a kaydeder. Yusufçuk Tepe ile Bomba Tepe’nin farklı mevkileri ve çatışma takvimleri, aynı muharebenin tek süresi gibi birleştirilmez.",
        place: "anafartalar"
      },
      {
        "id": "e-sonbahar",
        "date": "8 Ekim 1915",
        "side": "both",
        "domain": "ikisi",
        "battle": false,
        "title": "Sonbahar fırtınası",
        "text": "Anzak su ikmali zarar gördü.",
        "place": "ariburnu",
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "8 October 1915",
          "eventDate": "8 Ekim 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Anzak su ikmali zarar gördü.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        "id": "e-kitchener-tahliye",
        "date": "22 Kasım 1915",
        "side": "itilaf",
        "domain": "kara",
        "battle": false,
        "title": "Tahliye tavsiyesi",
        "text": "Kitchener çekilmeyi tavsiye etti.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "22 November 1915",
          "eventDate": "22 Kasım 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Kitchener çekilmeyi tavsiye etti.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        "id": "e-kasim-firtina",
        "date": "27–28 Kasım 1915",
        "side": "both",
        "domain": "kara",
        "battle": false,
        "title": "Yağmur ve kar fırtınası",
        "text": "Şiddetli yağışı tipi izledi.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "27 November 1915",
          "eventDate": "27–28 Kasım 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Şiddetli yağışı tipi izledi.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        "id": "e-aralik-onay",
        "date": "7 Aralık 1915",
        "side": "itilaf",
        "domain": "ikisi",
        "battle": false,
        "title": "Arıburnu–Suvla tahliye onayı",
        "text": "Britanya hükümeti çekilmeyi onayladı; Seddülbahir bekletildi.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "7 December 1915",
          "eventDate": "7 Aralık 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Britanya hükümeti çekilmeyi onayladı; Seddülbahir bekletildi.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-tahliye-ari",
        date: "19–20 Aralık 1915",
        side: "itilaf",
        domain: "kara",
        battle: false,
        title: "Arıburnu tahliyesi",
        text: "Arıburnu tahliyesi aşamalıydı; tarih kartı son geceyi gösterir. Son birlikler 20 Aralık sabahının erken saatlerinde ayrıldı.",
        place: "ariburnu"
      },
      {
        id: "e-tahliye-suvla",
        date: "19–20 Aralık 1915",
        side: "itilaf",
        domain: "kara",
        battle: false,
        title: "Anafartalar tahliyesi",
        text: "Suvla tahliyesinin son aşaması. Mustafa Kemal’in cepheden ayrılış kaydı 10 Aralıktır; tahliye gecesinin komutanı olarak sunulmaz.",
        place: "anafartalar"
      },
      {
        "id": "e-aralik-ocak",
        "date": "27 Aralık 1915",
        "side": "itilaf",
        "domain": "ikisi",
        "battle": false,
        "title": "Seddülbahir tahliye emri",
        "text": "Britanya hükümeti Seddülbahir’in tahliyesini emretti.",
        "place": "seddulbahir",
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "27 December 1915",
          "eventDate": "27 Aralık 1915",
          "publicationDate": "2024",
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Britanya hükümeti Seddülbahir’in tahliyesini emretti.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi.",
          "metadataAccessDate": "2026-11-02",
          "bibliography": "Department of Veterans’ Affairs (DVA), Timeline of Australians and the Gallipoli Campaign, Anzac Portal; ilgili tarihli web girişi.",
          "publicationDateNote": "Kurumun önerdiği kaynak künyesi 2024 yılını verir; son güncelleme 6 Aralık 2024. İlk yayım tarihi ayrıca belirlenmedi. 2 Kasım 2026 kontrolü başlık/künye alanlarınadır; ilgili olay pasajının önceki erişim tarihi korunur."
        }
      },
      {
        id: "e-tahliye-sedd",
        date: "8–9 Ocak 1916",
        side: "itilaf",
        domain: "kara",
        battle: false,
        title: "Seddülbahir tahliyesi",
        text: "Seddülbahir boşaltılır. Çanakkale kara harekâtı biter.",
        place: "seddulbahir"
      }
    ],

    command: {
      osmanli: [
        {
          name: "Liman von Sanders",
          role: "5. Ordu Komutanı",
          armyFormedBean: "24 Mart 1915",
          armyFormedAwm: "25 Mart 1915",
          travelToDardanelles: "25 Mart 1915",
          actualStartResolved: false,
          commandDatesResolved: false,
          body: "5. Ordu’nun kara savunma üst komutanıdır. Kuruluş, atama ve fiilî başlama birleştirilmedi; özgün emir görülmedi.",
          place: null,
          note: "Gelibolu’daki karargâh için ayrı bir nokta işaretlenmedi."
        },
        {
          name: "Esat Paşa (Bülkat)",
          role: "3. Kolordu, sonra Kuzey Grubu",
          corpsStartArticle: "başlangıçta 3’üncü Kolordu Komutanı",
          tekirdagAppointmentArticle: "2 Aralık 1913",
          northGroupArticle: "4/5 Mayıs 1915",
          departureArticle: "14 Ekim 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "Yarımada tarafındaki 3. Kolordu’nun başındadır. Madde kolordu ile Kuzey Grubu’nu ayırır; 4/5 Mayıs grup teşkili özgün emir değildir. 14 Ekim cepheden ayrılış 1. Ordu teslim günü yapılmadı.",
          place: "kolordu-3"
        },
        {
          name: "Vehip Paşa (Kaçı)",
          role: "Güney Grubu Komutanı",
          julyStartArticle8: "8 Temmuz 1915",
          julyStartArticle9: "9 Temmuz 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "Temmuz 1915’te Seddülbahir cephesinin (Güney Grubu) komutanı olur. Makalenin 8 Temmuz ve 9 Temmuz göreve başlama ifadeleri birleştirilmedi; özgün atama görülmedi.",
          place: "seddulbahir"
        },
        {
          name: "Mustafa Kemal",
          role: "19. Tümen, sonra Anafartalar Grubu",
          nightOrder8: "8 Ağustos 1915",
          hqArrival9: "9 Ağustos 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "25 Nisan 1915’te 19. Tümen komutanıdır. Anafartalar Grup görevinde 8 Ağustos gece emir kaydı ile 9 Ağustos karargâh ve birlik emri birleştirilmedi; özgün atama görülmedi. 10 Ağustos Conkbayırı karşı taarruzu teslim günü değildir.",
          place: "tumen-19"
        },
        {
          name: "Cevat Bey (Çobanlı)",
          role: "Müstahkem Mevkii Komutanı",
          roleOn18March: "18 Mart 1915",
          appointmentArticle: "10 Ağustos 1914",
          promotionArticle: "29 Kasım 1914",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "18 Mart 1915’te Çanakkale Müstahkem Mevkii komutanıdır; bu gün atama günü değildir. Ansiklopedi atamayı 10 Ağustos 1914, mirliva terfisini 29 Kasım 1914 olarak aktarır; özgün emir görülmedi. Boğaz tabyaları ve mayın savunması bu komutanlıktadır.",
          place: "mustahkem-hq"
        },
        {
          name: "Selahattin Adil Bey",
          role: "Müstahkem Mevkii kurmay başkanı",
          roleOn18March: "18 Mart 1915",
          appointmentArticle: "15 Ağustos 1914",
          divisionAppointmentArticle: "28 Nisan 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "18 Mart’ta Cevat Bey’in kurmay başkanıdır; bu gün atama günü değildir. Ansiklopedi kurmay atamasını 15 Ağustos 1914, 12. Tümen atamasını 28 Nisan 1915 olarak aktarır; özgün emir görülmedi.",
          place: "mustahkem-hq"
        },
        {
          name: "Halil Sami Bey",
          role: "9. Tümen Komutanı",
          appointmentArticleMonth: "Eylül 1914",
          juneExpression12: "12 Haziran 1915",
          juneExpression13: "13 Haziran 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "Seddülbahir–Kirte sahası 18 Mart’ta ve 25 Nisan çıkarmasının ilk günlerinde 9. Tümen’indir. Ansiklopedi atamayı Eylül 1914 ayı içinde tarihler; 12 ve 13 Haziran ifadeleri birleştirilmedi. Özgün emir görülmedi.",
          place: "tumen-9"
        },
        {
          name: "Rafet Bey",
          page: "/komutanlar/rafet-bey-bele/",
          role: "11. Tümen Komutanı",
          landingSector25April: "25 Nisan 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "Anadolu kıyısındaki 11. Tümen görevi, Kumkale’de fiilen muharebe eden bütün birliklerin kimliği yerine kullanılamaz; 25 Nisan birlik karşılaştırması Kumkale kaynak notundadır. Alkan savunma dağılımı 11. Tümen adını verir; atama günü yoktur. Özgün emir görülmedi.",
          place: "tumen-11"
        },
        {
          name: "Remzi Bey",
          role: "7. Tümen Komutanı",
          alkanRoleRecord: "Albay Ali Remzi komutasındaki 7. Tümen",
          sarosDemonstration: "25 Nisan 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "Saros kıyıları ve Bolayır Kıstağı 7. Tümen sahasıdır. 25 Nisan’daki Saros gösterişi bu kesime yöneliktir; atama günü değildir. Alkan rol kaydı atama günü değildir. Özgün emir görülmedi.",
          place: "tumen-7"
        },
        {
          name: "Weber Paşa",
          page: "/komutanlar/weber-pasa/",
          role: "XV. Kolordu, sonra Güney Grubu",
          xvCorpsArticle: "15’inci Kolordu komutanı",
          beanAsiaticCommand: "XV Army Corps Asiatic side",
          southGroupArticle: "5 Mayıs 1915",
          vehipStart8: "8 Temmuz 1915",
          vehipStart9: "9 Temmuz 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "Anadolu yakasındaki XV. Kolordu ile sonraki Güney Grubu ayrıdır. 5 Mayıs aktarımı 4/5 Mayıs Esat kaydıyla birleştirilmedi. Vehip’in 8 ve 9 Temmuz kayıtları Weber bitiş günü değildir. Özgün emir görülmedi.",
          place: "kumkale"
        },
        {
          name: "Guido von Usedom",
          role: "Sahil topçu ve torpil müfettişi (madde kaydı)",
          inspectorateArticle: "Sahil Topçu ve Torpil Birlikleri Müfettişi",
          marchObservationProven: false,
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "Müfettişlik kaydı atama günü değildir. 18 Mart gözetleme yeri bu maddeden kanıtlanmaz. Özel Komutanlık ile müfettişlik ayrı durur; özgün emir görülmedi.",
          place: "kilitbahir"
        },
        {
          name: "Johannes Merten",
          role: "Genel Karargâhın Çanakkale Boğazı temsilcisi (aktarım)",
          representationArticle: "Çanakkale Boğazı temsilciliğine",
          marchFireControlProven: false,
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "Temsilcilik kaydı atama günü değildir. 18 Mart Anadolu Hamidiye ateş idaresi bu maddeden kanıtlanmaz. Usedom müfettişliğiyle aynı makam değildir; özgün emir görülmedi.",
          place: "anadolu-hamidiye"
        }
      ],
      itilaf: [
        {
          name: "Sackville Carden",
          role: "Deniz komutanı, Şubat – 16 Mart 1915",
          commandLeft: "16 Mart 1915",
          commandDatesResolved: false,
          body: "Şubat bombardımanlarını yönetir. 16 Mart 1915’te sağlık nedeniyle komutayı bırakır. De Robeck’in görev satırı sitede 17 Mart 1915’tir; iki tarih birleştirilmedi.",
          place: null
        },
        {
          name: "John de Robeck",
          role: "Deniz komutanı, 17 Mart 1915’ten",
          commandFrom: "17 Mart 1915",
          cardenLeft: "16 Mart 1915",
          commandDatesResolved: false,
          body: "18 Mart taarruzunu yönetir. Kara çıkarması boyunca deniz kuvvetlerinin başındadır. Görev satırı 17 Mart 1915’tir; Carden’ın bıraktığı gün 16 Mart 1915 olarak durur.",
          place: null
        },
        {
          name: "Roger Keyes",
          role: "De Robeck’in kurmay başkanı",
          meeting17March: "17 Mart 1915",
          photo17October: "17 Ekim 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "17 Mart toplantı listesi varlık kaydıdır; kurmaylık başlangıcı değildir. Rapor Chief of Staff rol kaydıdır. 17 Ekim fotoğrafı görev sonu yapılmadı; özgün emir görülmedi.",
          place: null
        },
        {
          name: "Émile Guépratte",
          role: "Fransız deniz tümeni",
          meeting17March: "17 Mart 1915",
          lineB18March: "18 Mart 1915",
          tenedos20May: "20 Mayıs 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "17 Mart filo komuta kaydı 18 Mart B Hattı düzeninin yerine geçmez. 20 Mayıs Tenedos görüşmesi teslim günü değildir; özgün emir görülmedi.",
          place: null
        },
        {
          name: "Ian Hamilton",
          role: "Akdeniz Sefer Kuvveti komutanı",
          commandRecall: "16 Ekim 1915",
          commandLeftTheatre: "17 Ekim 1915",
          monroAssumed: "28 Ekim 1915",
          commandDatesResolved: false,
          body: "Kara harekâtının komutanıdır (Mart–Ekim 1915). 18 Mart deniz muharebesinin komutanı değildir. 16 Ekim geri çağırma kaydı, 17 Ekim Imbros ayrılışı ve Monro’nun 28 Ekim komuta kaydı birleştirilmedi.",
          place: null
        },
        {
          name: "William Birdwood",
          role: "ANZAK komutanı",
          anzacCorpsArticle: "led the ANZAC corps on Gallipoli",
          temporaryAifSeparate: true,
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "ANZAK harekât komutası ile Bridges sonrası geçici AIF idaresi ayrı durur. Kolordu kaydı atama günü değildir; özgün emir görülmedi.",
          place: "ariburnu"
        },
        {
          name: "William Bridges",
          role: "1. Avustralya Tümeni Komutanı",
          wounded15May: "15 Mayıs 1915",
          died18May: "18 Mayıs 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "15 Mayıs yaralanması ile 18 Mayıs ölüm ayrı günlerdir. Yaralanma görev sonu veya atama günü yapılmadı; özgün emir görülmedi.",
          place: "ariburnu"
        },
        {
          name: "Alexander Godley",
          role: "Yeni Zelanda ve Avustralya Tümeni Komutanı",
          landing25April: "25 Nisan 1915",
          laterMonthsProven: false,
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "25 Nisan tümen kaydı sonraki aylardaki aynı komutayı belgelemez. Yaşam tarihleri görev başlangıcı veya bitişi değildir; özgün emir görülmedi.",
          place: "ariburnu"
        },
        {
          name: "Aylmer Hunter-Weston",
          role: "29. Tümen, sonra VIII. Kolordu",
          landingDivisionRole: "25 Nisan 1915",
          viiiCorpsRole28June: "28 Haziran 1915",
          leftPeninsula17July: "17 Temmuz 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "Çıkarma aşamasında 29. Tümen komutanıdır. Sonraki VIII. Kolordu görevi ayrıdır; 17 Temmuz ayrılışı resmî bitiş değildir. Yaralanma veya tahliye günü atama ya da görev sonu yapılmadı; özgün atama görülmedi.",
          place: "seddulbahir"
        },
        {
          name: "Frederick Stopford",
          role: "IX. Kolordu Komutanı",
          hellesTemporaryEnd: "24 Temmuz 1915",
          suvlaLanding: "6–7 Ağustos 1915",
          ixHandoverEvening: "15 Ağustos 1915",
          originalAppointmentSeen: false,
          commandDatesResolved: false,
          body: "IX. Kolordu komutanıdır. Temmuzdaki geçici Helles görevi, 6–7 Ağustos Suvla çıkarması ve 15 Ağustos akşamı IX. Kolordu devri birleştirilmedi; özgün atama görülmedi.",
          place: "anafartalar"
        },
        {
          name: "Albert d’Amade",
          role: "Fransız Sefer Kolordusu",
          farewellVisit: "12 Mayıs 1915",
          gouraudIntroduced: "14 Mayıs 1915",
          commandDatesResolved: false,
          body: "25 Nisan Kumkale ve ardından Seddülbahir Fransız kolu. 12 Mayıs veda ziyareti, 14 Mayıs Gouraud ile dönüş ve kıyıyı terk aynı gün değildir.",
          place: "kumkale"
        },
        {
          name: "Henri Gouraud",
          role: "Fransız Sefer Kolordusu",
          arrived: "14 Mayıs 1915",
          commandFrom: "14 Mayıs 1915",
          damadeShoreDepartureDated: false,
          commandDatesResolved: false,
          body: "26 Ağustos 1915 raporunda 14 Mayıs varış ve komuta kaydı vardır. d’Amade’ın kıyıyı terki bu kayıttan ayrı durur. Haziran sonunda yaralanır.",
          place: "seddulbahir"
        },
        {
          name: "Charles Monro",
          role: "Akdeniz Sefer Kuvveti komutanı",
          commandInstruction: "20 Ekim 1915",
          commandFrom: "28 Ekim 1915",
          hamiltonRecall: "16 Ekim 1915",
          commandDatesResolved: false,
          body: "Yayımlanmış raporda 28 Ekim 1915 komuta kaydı vardır. 20 Ekim talimatı ve Hamilton’un 16 Ekim geri çağrılması aynı gün değildir. Tahliyeyi önerir.",
          place: null
        }
      ]
    },

    navy: {
      osmanli: [
        {
          name: "Nusret",
          type: "Mayın gemisi",
          march: "7–8 Mart gecesi Erenköy hattını döker. 18 Mart’ta batmaz.",
          later: "Kara harekâtı boyunca mayın gemisi olarak kalır.",
          place: "nusret"
        },
        {
          name: "Barbaros Hayreddin",
          type: "Ön-dretnot",
          march: "18 Mart konumu için gemi jurnali karşılaştırması gerekir; İtilaf taarruz filosuyla karıştırılmamalıdır.",
          later: "8 Ağustos 1915’te Marmara’da E11 tarafından batırılır.",
          place: null
        },
        {
          name: "Turgut Reis",
          type: "Ön-dretnot",
          march: "18 Mart konumu için gemi jurnali karşılaştırması gerekir; İtilaf taarruz filosuyla karıştırılmamalıdır.",
          later: "Çanakkale harekâtı sırasında batmaz.",
          place: null
        },
        {
          name: "Mesudiye",
          type: "Eski zırhlı",
          march: "18 Mart kadrosunda yoktur.",
          later: "13 Aralık 1914’te HMS B11 tarafından Sarısığlar’da batırılmıştır.",
          place: null
        },
        {
          name: "Muavenet-i Milliye",
          type: "Muhrip",
          march: "18 Mart ana muharebe hattında değildir.",
          later: "13 Mayıs 1915’te Morto Koyu’nda HMS Goliath’ı batırır.",
          place: "morto"
        }
      ],
      later: [
        {
          name: "HMS Goliath",
          type: "Ön-dretnot",
          note: "18 Mart’ın 18 ana gemilik listesinde yoktur. 13 Mayıs 1915, Morto Koyu, Muavenet-i Milliye.",
          place: "morto"
        },
        {
          name: "HMS Triumph",
          type: "Ön-dretnot",
          note: "18 Mart’ta filodadır ve o gün batmaz. 25 Mayıs 1915, Arıburnu açığı, Alman U-21.",
          place: "ariburnu"
        },
        {
          name: "HMS Majestic",
          type: "Ön-dretnot",
          note: "18 Mart’ta C Hattı’ndadır ve o gün batmaz. 27 Mayıs 1915, Seddülbahir açığı, U-21.",
          place: "seddulbahir"
        }
      ]
    },

    sources: [
      "Tarih çerçevesi: 19 Şubat 1915 dış tabya bombardımanı – 9 Ocak 1916 Seddülbahir tahliyesi.",
      "Osmanlı tarafı için Genelkurmay ATASE’nin yayımlanmış Çanakkale özetlerindeki sefer düzeni ve muharebe adları.",
      "İtilaf tarafı için Australian War Memorial ve Imperial War Museum kronolojilerindeki çıkarma, muharebe ve tahliye tarihleri.",
      "Konumlar kayıt bazında incelenir. Bir ziyaret noktası, enkaz konumu, tarihsel isabet yeri ve şematik hat aynı tür kanıt değildir.",
      "Zayiat toplamı yazılmamıştır; yayımlanmış sayılar kaynağa göre değişir. Alıntı ve gizli emir uydurulmamıştır."
    ]
  };
})();
