/* 18 Mart 1915 — Çanakkale Deniz Muharebesi
   Mevki koordinatları açık kaynak haritalar, batık kayıtları ve tabya konumlarına
   dayanır; birlik sahaları sektör merkezleridir, siper hattı değildir. */
window.OM = {
  center: [40.09, 26.32],
  defaultZoom: 11,
  disclaimer:
    "Noktaların sayısal konum dayanakları ayrı ayrı incelenir. Mayın ve filo çizgileri şematiktir; sapmaları için ölçülmüş bir sınır yoktur. Birlik noktaları sorumluluk sahasını temsil eder.",

  layers: [
    { id: "tabya", label: "Tabyalar", color: "#c45c4a" },
    { id: "birlik", label: "Birlikler", color: "#6b8f71" },
    { id: "gemi", label: "İtilaf gemileri", color: "#6a8caf" },
    { id: "enkaz", label: "Batış / hasar", color: "#d4af37" },
    { id: "komuta", label: "Komuta", color: "#e8d5a3" },
    { id: "mayin", label: "Mayın hatları · şema", color: "#e0b84a" },
    { id: "filo", label: "Filo hatları", color: "#8fa4c4" }
  ],

  places: [
    {
      id: "mustahkem-hq",
      type: "komuta",
      name: "Çanakkale Müstahkem Mevkii Karargâhı",
      lat: 40.1492,
      lng: 26.3778,
      meta: "Kilitbahir · Miralay Cevat Bey (Çobanlı)",
      short: "Boğaz savunmasının sevk ve idare merkezi. Kurmay Başkan: Yarbay Selahattin Adil Bey.",
      note: [
        "Karargâh personel mevcudu, alarm ve gözetleme saatleri ile ateş emrinin kapsamı için tarihli belge karşılaştırması açık. Eski sayısal taslak araştırma kaydında korunur."
      ]
    },
    {
      id: "kilitbahir",
      type: "tabya",
      name: "Kilitbahir Kalesi",
      lat: 40.146554,
      lng: 26.380381,
      accuracy: "yaklasik",
      uncertainty: "Alan Başkanlığının güncel kale ziyaret noktasıyla eşleştirildi. Kalenin bulunduğu alanı temsil eder; 1915 komuta veya gözetleme yerinin kesin koordinatı değildir.",
      coordinateSource: {
        url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/kilitbahir-kalesi",
        label: "Alan Başkanlığı · Kilitbahir Kalesi",
        evidenceText: "Ziyaret Noktasına Git: destination=40.146554, 26.380381",
        date: "2026-10-20",
        status: "kurumsal_ziyaret_noktasi_karsilastirildi",
        datum: "belirtilmemis"
      },
      meta: "Rumeli · Boğaz’ın kilidi",
      short: "Alan Başkanlığı kalenin inşasını 1462–63 olarak aktarır. Kale alanı, 18 Mart 1915 komuta ve gözetleme yerinin kesin noktası olarak doğrulanmadı.",
      note: [
        "Boğaz’ın en dar yerinde, Çimenlik (Kale-i Sultaniye) ile karşılıklı durur; adı ‘denizin kilidi’ anlamına gelir.",
        "Cevat Bey, Selahattin Adil Bey ve Amiral Usedom muharebeyi buradaki gözetleme yerinden yönetti.",
        "13.54’te Bouvet’nin Erenköy Koyu’nda havaya uçuşu buradan bizzat izlendi; Nusret hattının işe yaradığı teyit edildi."
      ]
    },
    {
      id: "mecidiye",
      type: "tabya",
      name: "Rumeli Mecidiye Tabyası",
      lat: 40.141532,
      lng: 26.37561,
      accuracy: "yaklasik",
      uncertainty: "Alan Başkanlığının güncel tabya ve şehitlik ziyaret noktasıyla eşleştirildi. Tabya alanını temsil eder; 1915 top, vinç veya mühimmat yerinin kesin koordinatı değildir.",
      coordinateSource: {
        url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/rumeli-mecidiye-tabyasi-ve-sehitligi",
        label: "Alan Başkanlığı · Rumeli Mecidiye Tabyası ve Şehitliği",
        evidenceText: "Ziyaret Noktasına Git: destination=40.141532, 26.37561",
        date: "2026-10-20",
        status: "kurumsal_ziyaret_noktasi_karsilastirildi",
        datum: "belirtilmemis"
      },
      meta: "Kilitbahir güneyi · Seyit Onbaşı",
      short: "Alan Başkanlığı, Rumeli Mecidiye’de top platformlarının ve aksamın isabet aldığını aktarır. Hasarın diğer tabyalarla sıralaması ve kesin isabet sayısı doğrulanmadı.",
      hits: "Belge karşılaştırması açık",
      note: [
        "Cevat Paşa’nın 14.45’te atla Mecidiye ve Namazgâh’a gittiği eski taslak anlatı belgeyle eşleştirilmedi; karargâha dönüş aktarımıyla aynı hareket sayılmaz.",
        "Hedef alınma ve elle yükleme saatleri, personel kayıplarının kapsamı ve atışlarla gemilerin mayınlı sulara yönelmesi arasında ileri sürülen ilişki için belge karşılaştırması açık."
      ]
    },
    {
      id: "namazgah",
      type: "tabya",
      name: "Namazgâh Tabyası",
      lat: 40.145371,
      lng: 26.379579,
      accuracy: "yaklasik",
      uncertainty: "Alan Başkanlığının güncel Namazgâh Tabyası ziyaret noktasıyla eşleştirildi. Tabya alanını temsil eder; 1915 harekât merkezi veya top yerlerinin kesin koordinatı değildir.",
      coordinateSource: {
        url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/namazgah-tabyasi",
        label: "Alan Başkanlığı · Namazgâh Tabyası",
        evidenceText: "Ziyaret Noktasına Git: destination=40.145371, 26.379579",
        date: "2026-10-20",
        status: "kurumsal_ziyaret_noktasi_karsilastirildi",
        datum: "belirtilmemis"
      },
      meta: "Kilitbahir · 4. Ağır Topçu Alayı karargâhı",
      short: "Alan Başkanlığı Namazgâh’ı 4. Ağır Topçu Alayı karargâhı olarak tanımlar. Yapı ve silah sayıları kurum aktarımıdır; eski 40–50 isabet tahmini belgeyle eşleştirilmedi.",
      hits: "Belge karşılaştırması açık",
      note: [
        "Alan Başkanlığı 26 bonet ile 16 kıyı topunu ayrı ayrı anlatır; bunlardan ikisinin deniz muharebesinde aktif kullanıldığını aktarır. Bonet, top ve ateşe katılan top sayıları aynı ölçü değildir; tarihli özgün silah cetveliyle karşılaştırma açıktır.",
        "Hedef alınma saati, hasarlı top sayısı ve komuta teftişinin ayrıntıları için tarihli harekât ve hasar kayıtlarının karşılaştırması açık."
      ]
    },
    {
      id: "rumeli-hamidiye",
      type: "tabya",
      name: "Rumeli Hamidiye Tabyası",
      lat: 40.142829,
      lng: 26.377707,
      accuracy: "yaklasik",
      uncertainty: "Alan Başkanlığının güncel Rumeli Hamidiye Tabyası harita hedefiyle eşleştirildi. Tabya alanını temsil eder; 1915 top platformlarının kesin koordinatı değildir. Ziyaret bağlantısı, alanın şu anda ziyarete açık olduğunu göstermez.",
      coordinateSource: {
        url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/rumeli-hamidiye-tabyasi",
        label: "Alan Başkanlığı · Rumeli Hamidiye Tabyası",
        evidenceText: "Ziyaret Noktasına Git: destination=40.142829, 26.377707",
        date: "2026-10-20",
        status: "kurumsal_ziyaret_noktasi_karsilastirildi",
        datum: "belirtilmemis"
      },
      claimReview: {
        url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/rumeli-hamidiye-tabyasi",
        label: "Alan Başkanlığı · Rumeli Hamidiye Tabyası",
        evidenceText: "döşeme raylarının kırılması ve nişan tertibatının hasar görmüş olması nedeniyle müttefik gemilerine hiç ateş edememiştir",
        date: "2026-10-20",
        status: "kaynak_celiskisi_tespit_edildi",
        limit: "Bu kurum anlatısı, eski atlas kartındaki gün boyu ateş edildiği cümlesiyle çelişir. Özgün batarya ceridesi ve hasar raporu karşılaştırılmadı; kartın diğer sayı, isabet ve teçhizat ayrıntıları doğrulanmış sayılmaz."
      },
      meta: "Namazgâh ile Mecidiye arası · kurum anlatımında iki top platformu",
      short: "Tabyanın ateş faaliyetine ilişkin eski atlas anlatısı, Alan Başkanlığının açıklamasıyla çelişiyor. Kaynak karşılaştırması sürüyor.",
      hits: "Belge karşılaştırması açık",
      note: [
        "1896, II. Abdülhamit. Namazgâh ile Mecidiye arasında, 2 adet 355/35 mm uzun namlulu Krupp.",
        "Boğaz’daki beş 355 mm’lik topun ikisi buradaydı (ikisi Anadolu Hamidiye, biri Çimenlik).",
        "Gün boyu ateşe devam edildiği şeklindeki eski ifade kesin bilgi olarak kaldırıldı. Alan Başkanlığı, mekanizma hasarı nedeniyle ateş edilemediğini aktarır; özgün batarya raporu karşılaştırması açıktır."
      ]
    },
    {
      id: "cimenlik",
      type: "tabya",
      name: "Çimenlik Tabyası (Kale-i Sultaniye)",
      lat: 40.146395,
      lng: 26.399161,
      accuracy: "yaklasik",
      uncertainty: "Kültür Bakanlığı Kültür Portalı sayfasındaki Çimenlik Kalesi harita işaretiyle eşleştirildi. Kale alanını temsil eder; 1915 tabya toplarının, karargâhın veya mermi isabetinin kesin koordinatı değildir.",
      coordinateSource: {
        url: "https://www.kulturportali.gov.tr/turkiye/canakkale/gezilecekyer/cimenlik-kalesi",
        label: "Kültür Bakanlığı · Çimenlik Kalesi",
        evidenceText: "center: [40.146395,26.399161]; ÇİMENLİK KALESİ işareti myMap.getCenter() üzerinde oluşturulur.",
        date: "2026-10-20",
        status: "kurumsal_ziyaret_noktasi_karsilastirildi",
        datum: "belirtilmemis"
      },
      meta: "Anadolu · Çanakkale merkez",
      short: "Queen Elizabeth’in ilk atış saati ve hedef eşleştirmesinin belge karşılaştırması açık. Ayrıntılar 18 Mart kaynak notunda açıklanır.",
      hits: "Belge karşılaştırması açık",
      note: [
        "Önceki 11.00 ilk atış, menzil ve hedef anlatısı doğrulanmış bilgi olarak kullanılmaz; rapordaki hedef numarası bu mevkiyle eşleştirilmedi.",
        "Kültür Portalı, kuzey surunda patlamadan kalan mermiyi Queen Elizabeth’e bağlar; ilgili pasaj kalibre vermez. Eski 355 mm tanımı bu kaynakla doğrulanmadı; nesne envanteri ve hasar raporu karşılaştırması açıktır.",
        "Amiral Merten sabah Anadolu yakasında Çimenlik ve Hamidiye’nin mekanik durumunu ve cephane vinçlerini denetletti."
      ]
    },
    {
      id: "anadolu-hamidiye",
      type: "tabya",
      name: "Anadolu Hamidiye Tabyası",
      lat: 40.138566,
      lng: 26.404352,
      accuracy: "yaklasik",
      uncertainty: "Alan Başkanlığının güncel Anadolu Hamidiye Tabyası ziyaret noktasıyla eşleştirildi. Tabya ve müze alanını temsil eder; 1915 top platformu, cephanelik veya ateş idare yerinin kesin koordinatı değildir.",
      coordinateSource: {
        url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/anadolu-hamidiye-tabyasi",
        label: "Alan Başkanlığı · Anadolu Hamidiye Tabyası",
        evidenceText: "Ziyaret Noktasına Git: destination=40.138566, 26.404352",
        date: "2026-10-20",
        status: "kurumsal_ziyaret_noktasi_karsilastirildi",
        datum: "belirtilmemis"
      },
      meta: "Anadolu · 355/240 mm donatım aktarımı, 17–18 Mart 1915",
      short: "Anadolu yakasındaki ağır topçu mevkii. 17–18 Mart donatımına ilişkin ansiklopedi aktarımı kaynak notunda ayrılır; belirli gemilere isabetlerin bu tabyaya aidiyeti ayrıca incelenir.",
      hits: "Belge karşılaştırması açık",
      note: [
        "Belirli gemilere ateş açma saatleri, hasarlı top sayısı ve cephanelik hasarının ayrıntıları için belge karşılaştırması açık. Donatım aktarımı ile fiilî ateş ve hasar kayıtları aynı kanıt değildir."
      ]
    },
    {
      id: "dardanos",
      type: "tabya",
      name: "Dardanos Tabyası (Hasan-Mevsuf)",
      lat: 40.085728,
      lng: 26.371181,
      meta: "Anadolu yakası · konum incelemesi açık",
      short: "İşaret tabya çevresini temsil eder. Rasat yerinin konumu, isabet saati ve olay ayrıntıları için belge karşılaştırması sürüyor.",
      accuracy: "yaklasik",
      uncertainty: "Tabya alanı için temsili noktadır; şehitlik, top mevzii ve rasat yerinin kesin noktaları olarak doğrulanmadı. Restorasyon kaydındaki yer adı sayısal koordinat kanıtı değildir.",
      coordinateReview: {
        url: "https://www.kulturportali.gov.tr/turkiye/canakkale/ilprojeleri/troia-antik-kenti-cevre-duzenleme-uygulamalari",
        label: "Kültür Portalı · Hasan Mevsuf Şehitliği Tabya ve Bataryalarının Restorasyonu",
        evidenceText: "İlimiz, Merkez Çınarlı Köyünde bulunan Hasan Mevsuf Şehitliği",
        date: "2026-10-20",
        status: "anlatim_incelendi_nokta_dogrulanmadi"
      },
      hits: "Belge karşılaştırması açık",
      note: [
        "Teknik donanım: 15 cm’lik hızlı ateşli Krupp toplar. Mayın hatlarını koruma ve filonun daralmaya ilerlemesini engellemede kilit rol.",
        "11.30’dan itibaren Dardanos, Mesudiye ve Şevket bataryaları ile seyyar obüsler, henüz ağır tabyalar suskunken sürpriz atışlara başladı.",
        "Dardanos için eski 60–80 isabet tahmini, 17.15 saati ve 30,5 cm mermi anlatısı belgeyle eşleştirilmedi. 3’üncü Ağır Topçu Alayı maddesindeki 115 mermi sarfı, bataryaya gelen isabet sayısı değildir; ayrıntı 18 Mart olay sayfasının Dardanos kaynak notundadır.",
        "Cevat Paşa’nın teklifi ve Harbiye Nezareti onayıyla adı ‘Hasan-Mevsuf Bataryası’ olarak değiştirildi.",
        "17 Nisan 1915’te karaya oturan HMS E15 denizaltısının kulesine ilk isabeti de bu tabya verdi."
      ]
    },
    {
      id: "seddulbahir",
      type: "tabya",
      name: "Seddülbahir",
      lat: 40.042881,
      lng: 26.188885,
      accuracy: "yaklasik",
      uncertainty: "Alan Başkanlığının güncel Seddülbahir Kalesi ziyaret noktasıyla eşleştirildi. Kale çevresini temsil eder; bütün çıkarma kumsallarının, birlik mevzilerinin veya 1915 gözetleme postasının kesin koordinatı değildir.",
      coordinateSource: {
        url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/kaleler-ve-tabyalar/seddulbahir-kalesi",
        label: "Alan Başkanlığı · Seddülbahir Kalesi",
        evidenceText: "Ziyaret Noktasına Git: destination=40.042881, 26.188885",
        date: "2026-10-20",
        status: "kurumsal_ziyaret_noktasi_karsilastirildi",
        datum: "belirtilmemis"
      },
      meta: "Gelibolu güney ucu · giriş tabyası",
      short: "Boğaz ağzının Rumeli yakasındaki giriş mevkii. Filonun yaklaşma bildiriminin kesin saati belgeyle eşleştirilmedi.",
      note: [
        "09.30’da Kumkale, Seddülbahir ve Dardanos gözetleme postaları, müttefik filosunun üç hat halinde yaklaştığını Müstahkem Mevkii’ye bildirdi.",
        "10.00’da öncü muhripler eşliğinde A Hattı, Seddülbahir–Kumkale çizgisini aştı.",
        "19 Şubat ve 25 Şubat bombardımanlarında giriş tabyaları ilk yıpratmanın hedefiydi. 9. Tümen’in sahil koruma sahasına girer."
      ]
    },
    {
      id: "kumkale",
      type: "tabya",
      name: "Kumkale",
      lat: 40.0103,
      lng: 26.1975,
      meta: "Anadolu giriş · 25 Nisan birlikleri ayrıca incelenir",
      accuracy: "yaklasik",
      uncertainty: "Kumkale çevresi için temsili noktadır; kalenin, gözetleme postasının veya çıkarma kumsalının kesin koordinatı doğrulanmadı. Günümüzdeki köy ve şehitlik, kale noktası yerine kullanılmadı.",
      coordinateReview: {
        url: "https://canakkale.ktb.gov.tr/TR-70518/kaleler.html",
        label: "Çanakkale İl Kültür ve Turizm Müdürlüğü · Kaleler",
        evidenceText: "Kumkale Köyü kale yapısına 3 km. uzaklıktadır.",
        date: "2026-10-20",
        status: "anlatim_incelendi_nokta_dogrulanmadi"
      },
      short: "Boğaz ağzının Anadolu kapısı. Sabah alarmının diğer ucu.",
      note: [
        "Kumkale gözetleme postası 08.45’te büyük filonun Boğaz ağzına ilerlediğini rapor etti.",
        "Anadolu kıyısındaki genel görev sahası, 25 Nisan’da Kumkale’de fiilen muharebe eden birliklerle aynı alan değildir. 31’inci Alay ve 3’üncü Tümen aktarımı Kumkale olay sayfasında ayrı incelenir.",
        "25 Şubat’ta giriş tabyalarının susturulması ve tahrip timlerinin karaya çıkarılması sırasında yoğun bombardıman gördü."
      ]
    },
    {
      id: "mesudiye",
      type: "tabya",
      name: "Mesudiye / Yıldız / Baykuş — toplu kayıt",
      lat: 40.0965,
      lng: 26.362,
      meta: "Batarya adları · eşleştirme incelemesi açık",
      short: "Bu toplu kayıttaki batarya adları ve mevziler ayrı belgelerle eşleştiriliyor. Tek işaret, ortak veya kesin bir batarya konumu olarak doğrulanmadı.",
      accuracy: "yaklasik",
      uncertainty: "Kurum kaydında Baykuş (Mesudiye) adlandırması geçer; Yıldız ile ilişkisi ve ayrı mevzilerin sayısal konumları bu kaynakla doğrulanmaz. Mesudiye Topu ziyaret noktası, tarihsel batarya veya gemi batığı konumu yerine kullanılmadı.",
      coordinateReview: {
        url: "https://canakkaletarihialan.gov.tr/tr/ziyaret/diger-ziyaret-noktalari/mesudiye-topu",
        label: "Alan Başkanlığı · Mesudiye Topu",
        evidenceText: "Mesudiye Zırhlısı’ndan sökülen toplar; Baykuş (Mesudiye) bataryası olarak",
        date: "2026-10-20",
        status: "anlatim_incelendi_nokta_dogrulanmadi"
      },
      hits: "Belge karşılaştırması açık",
      note: [
        "11.30’da Mesudiye ve Şevket bataryaları ile seyyar obüsler, ağır tabyalar henüz suskunken İngiliz zırhlılarına karşılık vermeye başladı.",
        "15.10’da Dardanos ve Baykuş bataryaları ile seyyar havanlar, Boğaz ortasında sabit hedef haline gelen zırhlılara mermi yağdırdı.",
        "Seyyar bataryaların asimetrik üstünlüğü: yer değiştirebildikleri için gözetleme yaptırtmadı, personeli şarapnelle biçti ve gemileri mayın hatlarına sürükledi."
      ]
    },
    {
      id: "tavsan",
      type: "enkaz",
      name: "Gaulois — konum doğrulaması açık",
      lat: 40.0038,
      lng: 26.152,
      uncertainty: "Drepano adının Tavşan Adası ile eşleştirilmesi ve bu harita noktası doğrulanmadı. Yaklaşık gösterimdir; kesin karaya oturma yeri değildir.",
      narrativeSource: {
        url: "https://transcribe.awm.gov.au/transcription/item/rcdig1066703-5",
        imageUrl: "https://transcribe.awm.gov.au/sites/default/files/transcription-images/2025-01/43824-rcdig1066703-page65.jpg",
        label: "AWM RCDIG1066703 · daktilo sayfası 47",
        evidenceText: "Gaulois grounded on North of Drepano Island.",
        translation: "Gaulois, Drepano Adası’nın kuzeyinde karaya oturdu.",
        date: "2026-10-19",
        status: "daktilo_kopyasi_goruntuden_okundu",
        limit: "Özgün imzalı raporla karşılaştırma açık; kesin saat veya koordinat doğrulanmaz. Platform çevrimyazısı onay bekliyor."
      },
      meta: "Karaya oturma kaydı · yer ve saat incelemede",
      short: "AWM’deki daktilo kopyasında Drepano’nun kuzeyinde karaya oturma kaydı okunur. Kesin saat, ada eşleştirmesi ve harita noktası doğrulanmadı.",
      note: [
        "Önceki 12.28 isabet ve 14.35 karaya oturma saatlerinin belge karşılaştırması tamamlanmadı.",
        "19 Ekim 2026: AWM RCDIG1066703, daktilo sayfası 47 görüntüden okundu. İmzalı özgün raporla karşılaştırma açık; ayrıntılar Gaulois kaynak notundadır."
      ]
    },
    {
      id: "bouvet",
      type: "enkaz",
      name: "Bouvet — yaklaşık gösterim",
      lat: 40.01917,
      lng: 26.27167,
      uncertainty: "Bu işaret için incelenmiş sayısal enkaz koordinatı dayanağı tamamlanmadı. Yaklaşık gösterimdir; kesin batış veya enkaz noktası sayılmaz.",
      narrativeSource: {
        url: "https://transcribe.awm.gov.au/transcription/item/rcdig1066703-5",
        imageUrl: "https://transcribe.awm.gov.au/sites/default/files/transcription-images/2025-01/43822-rcdig1066703-page63.jpg",
        label: "AWM RCDIG1066703 · daktilo sayfası 45",
        evidenceText: "only 66 survivors were picked up.",
        translation: "Yalnızca 66 kişi kurtarıldı.",
        context: "Bu, rapordaki kurtarma bildirimidir; kesinleşmiş kurtulan toplamı veya eksiksiz personel cetveli değildir. Farklı kaynaklardaki sayılar 18 Mart kaynak notunda ayrı değerlendirilir.",
        date: "2026-10-19",
        status: "daktilo_kopyasi_goruntuden_okundu",
        limit: "İmzalı özgün rapor ve nihai personel listeleriyle karşılaştırma açık; kesin zayiat toplamı veya koordinat doğrulanmaz. Platform çevrimyazısı onay bekliyor."
      },
      meta: "18 Mart 1915 · saat ve kayıp ayrıntıları incelemede",
      short: "Bouvet’nin batışı AWM’deki harekât raporunun daktilo kopyasında anlatılır. Kurtarma bildirimi, kesinleşmiş personel toplamı sayılmaz.",
      note: [
        "19 Ekim 2026: AWM RCDIG1066703, daktilo sayfası 45 görüntüden okundu. Raporda 13:54 kaydı bulunur; özgün raporla karşılaştırma açık.",
        "Denizden kurtarılanlar, önceden karada bulunan personel ve sonraki yayınların toplamları ayrı değerlendirilir. Kesin zayiat toplamı için personel listelerinin karşılaştırılması açık."
      ]
    },
    {
      id: "inflexible",
      type: "enkaz",
      name: "HMS Inflexible — yaklaşık hasar gösterimi",
      lat: 40.0435,
      lng: 26.292,
      uncertainty: "Bu harita noktası için incelenmiş sayısal konum dayanağı tamamlanmadı. Hasar anlatısının kaynak desteği, kesin mayın isabeti yerini doğrulamaz; enkaz noktası olarak okunmamalıdır.",
      narrativeSource: {
        url: "https://transcribe.awm.gov.au/transcription/item/rcdig1066703-4",
        imageUrl: "https://transcribe.awm.gov.au/sites/default/files/transcription-images/2025-01/43819-rcdig1066703-page60.jpg",
        label: "AWM RCDIG1066703 · daktilo sayfası 42",
        evidenceText: "reported shortly after 4.p.m.",
        translation: "Saat 16.00’dan kısa süre sonra bildirdi.",
        context: "Pasaj Inflexible’ın mayına çarptığını bildirmesine ilişkindir. Bildirimin zamanı, mayına çarpma anını ayrıca doğrulamaz.",
        date: "2026-10-19",
        status: "daktilo_kopyasi_goruntuden_okundu",
        limit: "Özgün imzalı raporla karşılaştırma açık; kesin isabet saati veya koordinat doğrulanmaz. Platform çevrimyazısı onay bekliyor.",
        publishedComparison: {
          "url": "https://www.thegazette.co.uk/London/issue/31322",
          "label": "The London Gazette · 2 Mayıs 1919 · sayı 31322",
          "date": "2026-10-20",
          "status": "resmi_yayin_goruntusu_incelendi",
          "evidenceText": "4.11.—“Inflexible” reported",
          "translation": "16.11 — Inflexible bildirdi.",
          "context": "Basılı 5503, mayın isabetinin bildirimini bu saatte kaydeder. İsabet anı ayrıca belirlenmez. Raporun yerel saatleri GMT’den iki saat ileridir.",
          "limit": "Resmî yayımdaki rapor incelendi; imzalı asıl nüsha değildir. AWM daktilo kopyasıyla bağımsız iki tanıklık sayılmaz. Kartın tamamını veya harita koordinatını doğrulamaz."
        }
      },
      meta: "18 Mart 1915 · saat ve zayiat incelemede",
      short: "Inflexible ağır hasar alarak Boğaz’dan çıkar. Kesin saat ve zayiat için belge karşılaştırması tamamlanmadı.",
      note: [
        "Önceki 14:14, 14:25 ve 39 ölü ifadelerinin belge karşılaştırması açık. Bildirim saati, isabetin kesin saati yerine kullanılamaz.",
        "Kaynaklar ve inceleme sınırları 18 Mart Deniz Muharebesi sayfasındadır."
      ]
    },
    {
      id: "irresistible",
      type: "enkaz",
      name: "HMS Irresistible — enkaz konumu",
      lat: 40.073966667,
      lng: 26.340683333,
      accuracy: "yaklasik",
      uncertainty: "2023 yayınının enkaz noktasıdır; mayın isabeti veya tahliye yerini ayrıca doğrulamaz. Kaynak datum belirtmiyor; metre düzeyinde kesinlik iddiası yok.",
      coordinateSource: {
        url: "https://acikerisim.comu.edu.tr/bitstreams/1196b458-36ad-41bc-ab41-87c8517b49b9/download",
        label: "Kedioğlu ve Öz (2023), s. 76 · enkaz koordinatı",
        evidenceText: "40°04.438 N, 26°20.441 E",
        date: "2026-10-17",
        status: "yayin_koordinati_karsilastirildi",
        datum: "belirtilmemis"
      },
      narrativeSource: {
        url: "https://transcribe.awm.gov.au/transcription/item/rcdig1066703-5",
        imageUrl: "https://transcribe.awm.gov.au/sites/default/files/transcription-images/2025-01/43824-rcdig1066703-page65.jpg",
        label: "AWM RCDIG1066703 · daktilo sayfası 47",
        evidenceText: "No trace of either ship could be found",
        translation: "İki gemiden de hiçbir iz bulunamadı.",
        date: "2026-10-19",
        status: "daktilo_kopyasi_goruntuden_okundu",
        limit: "Özgün imzalı raporla karşılaştırma açık; kesin saat veya koordinat doğrulanmaz. Platform çevrimyazısı onay bekliyor.",
        publishedComparison: {
          "url": "https://www.thegazette.co.uk/London/issue/31322",
          "label": "The London Gazette · 2 Mayıs 1919 · sayı 31322",
          "date": "2026-10-20",
          "status": "resmi_yayin_goruntusu_incelendi",
          "evidenceText": "at 4.50 p.m.",
          "translation": "Saat 16.50’de.",
          "context": "Basılı 5503–5504, Wear’in Irresistible’dan alınan personelle Queen Elizabeth’e dönüşünü anlatır. Tahliyenin başlangıcı veya batış anı değildir. Raporun yerel saatleri GMT’den iki saat ileridir.",
          "limit": "Resmî yayımdaki rapor incelendi; imzalı asıl nüsha değildir. AWM daktilo kopyasıyla bağımsız iki tanıklık sayılmaz. Kartın tamamını veya harita koordinatını doğrulamaz."
        }
      },
      meta: "18 Mart 1915 · isabet, tahliye ve batış saatleri incelemede",
      short: "Irresistible için isabet, tahliye ve batış ayrı kayıtlardır. Kesin saat ve tahliye sayılarının belge karşılaştırması tamamlanmadı.",
      note: [
        "Enkaz koordinatı, geminin isabet aldığı veya tahliye edildiği konumu ayrıca doğrulamaz.",
        "Önceki 16.11, 16.32 ve 19.30 saat anahtarları bağlantılar için korunur; doğrulanmış olay saatleri değildir.",
        "19 Ekim 2026: AWM daktilo sayfası 47’de gece aramasında iki geminin bulunamadığı anlatılır. Bu kayıt kesin batış anını göstermez; kaynak bağlantısı tahliye ve batış ayrımı bölümündedir."
      ]
    },
    {
      id: "ocean",
      type: "enkaz",
      name: "HMS Ocean — yaklaşık gösterim",
      lat: 40.0315,
      lng: 26.2788,
      uncertainty: "Bu işaret için incelenmiş sayısal enkaz koordinatı dayanağı tamamlanmadı. Yaklaşık gösterimdir; kesin batış veya enkaz noktası sayılmaz.",
      narrativeSource: {
        url: "https://transcribe.awm.gov.au/transcription/item/rcdig1066703-5",
        imageUrl: "https://transcribe.awm.gov.au/sites/default/files/transcription-images/2025-01/43824-rcdig1066703-page65.jpg",
        label: "AWM RCDIG1066703 · daktilo sayfası 47",
        evidenceText: "No trace of either ship could be found",
        translation: "İki gemiden de hiçbir iz bulunamadı.",
        date: "2026-10-19",
        status: "daktilo_kopyasi_goruntuden_okundu",
        limit: "Özgün imzalı raporla karşılaştırma açık; kesin saat veya koordinat doğrulanmaz. Platform çevrimyazısı onay bekliyor.",
        publishedComparison: {
          "url": "https://www.thegazette.co.uk/London/issue/31322",
          "label": "The London Gazette · 2 Mayıs 1919 · sayı 31322",
          "date": "2026-10-20",
          "status": "resmi_yayin_goruntusu_incelendi",
          "evidenceText": "about 7.30 p.m.",
          "translation": "Yaklaşık saat 19.30’da.",
          "context": "Basılı 5503’te bu saat Ocean’ın nihai terk edilmesine ilişkindir; batış saati değildir. Basılı 5504’te gece araması sonuçsuzdur. Raporun yerel saatleri GMT’den iki saat ileridir.",
          "limit": "Resmî yayımdaki rapor incelendi; imzalı asıl nüsha değildir. AWM daktilo kopyasıyla bağımsız iki tanıklık sayılmaz. Kartın tamamını veya harita koordinatını doğrulamaz."
        }
      },
      meta: "18 Mart 1915 · isabet ve batış saatleri incelemede",
      short: "Ocean 18 Mart’ta battı. Mayın isabeti anlatıları farklı kesinliktedir; ayrıntılı saat ve tahliye bilgisi doğrulanmadı.",
      note: [
        "AWM A02360 açıklaması mayınla batışı kesin anlatır; DVA Anzac Portal aynı ayrıntıyı ihtimalli ifade eder.",
        "16:45, tahliye sayısı ve gemi görevleri için belge karşılaştırması tamamlanmadı. 22:30 kaydı özgün gemi raporuyla kesinleştirilmedi.",
        "19 Ekim 2026: AWM daktilo sayfası 47’de Ocean ve Irresistible’ın gece aramasında bulunamadığı anlatılır. Kesin batış anı gözlenmiş sayılmaz; belge bağlantısı 18 Mart kaynak notundadır."
      ]
    },
    {
      id: "kolordu-3",
      type: "birlik",
      name: "3. Kolordu Komutanlığı",
      lat: 40.4102,
      lng: 26.6708,
      meta: "Gelibolu · Mirliva Esat Paşa (Bülkat)",
      short: "Savunma üst komutanlığı. Tarihli mevcut cetveliyle karşılaştırma açık; kuruluş kadrosu ile fiilen görevdeki personel sayısı eşitlenmez.",
      note: [
        "Bünyesindeki tüm tümenlerle toplam piyade gücü. Çanakkale Boğazı çevresi, Gelibolu Yarımadası ve Saros Körfezi’nden Anadolu kıyılarına uzanan genel savunma sahası.",
        "18 Mart bir deniz muharebesidir; kara tümenleri henüz çıkarma beklemektedir. 5. Ordu 24 Mart’ta ihdas edilecektir."
      ]
    },
    {
      id: "tumen-19",
      type: "birlik",
      name: "19. Tümen — genel ihtiyat",
      lat: 40.1842,
      lng: 26.3575,
      meta: "Maydos (Eceabat) · Yarbay Mustafa Kemal",
      short: "Birliğin bağlı alayları ve o günkü görev dağılımı için tarihli kuruluş ve harekât kayıtlarının karşılaştırması sürüyor.",
      strength: "Belge karşılaştırması açık",
      note: [
        "Görev bölgesi: Maydos (Eceabat), Seddülbahir gerisi ve Kilitbahir geçiş hattı.",
        "18 Mart’ta kara çıkarması yoktur; tümen, donanma taarruzu sırasında yarımadanın stratejik ihtiyatıdır. Nisan çıkarmalarında bu konuşlanma belirleyici olacaktır."
      ]
    },
    {
      id: "tumen-9",
      type: "birlik",
      name: "9. Tümen",
      lat: 40.068,
      lng: 26.208,
      meta: "Seddülbahir–Alçıtepe–Krithia · Miralay Halil Sami Bey",
      short: "Birliğin bağlı alayları ve o günkü görev dağılımı için tarihli kuruluş ve harekât kayıtlarının karşılaştırması sürüyor.",
      strength: "Belge karşılaştırması açık",
      note: [
        "Gelibolu Yarımadası güney ucu (Seddülbahir, Alçıtepe, Krithia) ve Boğaz kıyı şeridinin doğrudan sahil koruma görevi.",
        "Giriş tabyaları ve gözetleme postaları bu tümenin sahasıyla örtüşür."
      ]
    },
    {
      id: "tumen-7",
      type: "birlik",
      name: "7. Tümen",
      lat: 40.516,
      lng: 26.762,
      meta: "Saros–Bolayır · Miralay Remzi Bey",
      short: "Birliğin bağlı alayları ve o günkü görev dağılımı için tarihli kuruluş ve harekât kayıtlarının karşılaştırması sürüyor.",
      strength: "Belge karşılaştırması açık",
      note: [
        "Saros Körfezi kıyıları ve Bolayır Kıstağı. Trakya yönünden gelebilecek amfibi kuşatma tehdidine karşı kuzey savunması.",
        "Haritada Boğaz’dan uzak görünmesinin nedeni budur: kıstağı tutmazsa yarımada kesilir."
      ]
    },
    {
      id: "tumen-11",
      type: "birlik",
      name: "11. Tümen",
      lat: 40.028,
      lng: 26.232,
      meta: "Kumkale–Erenköy–Yeniköy · Miralay Rafet Bey",
      short: "Birliğin bağlı alayları ve o günkü görev dağılımı için tarihli kuruluş ve harekât kayıtlarının karşılaştırması sürüyor.",
      strength: "Belge karşılaştırması açık",
      note: [
        "Anadolu Yakası kıyı şeridi: Kumkale, Erenköy, Yeniköy, Beşige Koyu yamaçları.",
        "Nusret’in mayın döktüğü Erenköy Koyu bu tümenin sahasındadır; kıyı projektörleri ve sahra topçusu gece operasyonunu perdeledi."
      ]
    },
    {
      id: "nusret",
      type: "komuta",
      name: "Mayın ve Deniz Savunma Grubu",
      lat: 40.035,
      lng: 26.282,
      meta: "Binbaşı Nazmi Bey · Nusret: Yzb. Tophaneli Hakkı",
      short: "Boğaz’daki mayın savunması ve Nusret hattı. Personel mevcudunun belge karşılaştırması tamamlanmadı.",
      note: [
        "Nusret’in Erenköy Koyu’ndaki kıyıya paralel 26 mayınlık hattı Alan Başkanlığı anlatısında yer alır. Bu haritadaki çizginin yön açısı ve uç noktaları sayısal belgeyle doğrulanmadı.",
        "Müttefikler mayınların kıyıları birleştiren enlemesine hatlar olacağını varsayıyordu; bu koyu ‘manevra havuzu’ sayıp taramaya öncelik vermedi.",
        "8–18 Mart arasında hiçbir gemi bu mayınlara çarpmadı. Zırhlılar 18 Mart’taki tam ölçekli U dönüşünde ölümcül temasa girdi."
      ]
    },
    {
      id: "ark-royal",
      type: "gemi",
      name: "HMS Ark Royal (deniz uçağı gemisi)",
      lat: 39.96,
      lng: 26.08,
      meta: "Keşif ve atış tanzimi",
      short: "18 Mart raporunda deniz uçağından bataryaların durumuna ilişkin bildirimler vardır. Bu kayıtlar, Ark Royal uçaklarının Erenköy mayınlarını arama kapsamını veya tespit edememe nedenini tek başına açıklamaz.",
      note: [
        "Parlama, bulanıklık ve sığlık açıklaması ile 16–17 Mart tarama tellerinin bu hattan geçtiği iddiası için belge karşılaştırması açık. Hava keşfi ile denizden mayın taraması farklı faaliyetlerdir."
      ]
    }
  ],

  lines: [
    {
      id: "nusret-hat",
      type: "mayin",
      name: "Nusret gizli hattı (26 mayın)",
      color: "#e0b84a",
      dash: "8 10",
      weight: 4,
      latlngs: [
        [40.0085, 26.262],
        [40.014, 26.2665],
        [40.01917, 26.27167],
        [40.0255, 26.276],
        [40.032, 26.2805],
        [40.0382, 26.2875],
        [40.0445, 26.2935],
        [40.051, 26.299]
      ],
      note: "Alan Başkanlığının deniz muharebeleri anlatısı Erenköy Koyu’nda kıyıya paralel 26 mayınlık hattı aktarır. Bu çizginin uç noktaları, uzunluğu ve mayın aralıkları sayısal belgeyle doğrulanmadı. Çizgi üzerindeki köşeler tek tek mayın değildir."
    },
    {
      id: "hat-a",
      type: "filo",
      name: "A Hattı — İngiliz zırhlıları",
      color: "#8fa4c4",
      dash: "14 8",
      weight: 3,
      latlngs: [
        [40.068, 26.238],
        [40.06, 26.252],
        [40.053, 26.266],
        [40.046, 26.28]
      ],
      note: "Queen Elizabeth, Inflexible, Agamemnon, Lord Nelson. Şematik grup gösterimidir; çizginin belirli bir andaki filo konumu ve tabyalara mesafesi belgeyle eşleştirilmedi."
    },
    {
      id: "hat-b",
      type: "filo",
      name: "B Hattı — Fransız zırhlıları",
      color: "#c4a574",
      dash: "14 8",
      weight: 3,
      latlngs: [
        [40.082, 26.268],
        [40.075, 26.28],
        [40.068, 26.292],
        [40.061, 26.304]
      ],
      note: "Suffren, Bouvet, Gaulois, Charlemagne. Raporda ilk B Hattı olarak anılırlar; ilerleme emri ile fiilî çatışma ayrı aşamalardır. Bu grup notu kesin atış mesafesi vermez."
    },
    {
      id: "hat-c",
      type: "filo",
      name: "C Hattı — ihtiyat / destek",
      color: "#7a8aa0",
      dash: "6 8",
      weight: 2,
      latlngs: [
        [40.052, 26.22],
        [40.044, 26.236],
        [40.036, 26.252],
        [40.028, 26.266]
      ],
      note: "Vengeance, Irresistible, Albion, Ocean, Majestic, Swiftsure. Destek grubunun şematik gösterimidir; emir, ileri geçiş ve her geminin fiilî konumu ayrı kayıtlardır. Bu çizgi kesin hareket saati vermez."
    }
  ],

  mineReview: {
    url: "https://canakkaletarihialan.gov.tr/en/canakkale-battles/naval-battles",
    label: "Alan Başkanlığı · Deniz muharebeleri",
    evidenceText: "26 mines, parallel to the shore in Erenköy Bay",
    date: "2026-10-20",
    status: "anlati_incelendi_geometri_dogrulanmadi",
    limit: "Kaynak hattın varlığını ve genel yönünü anlatır; bu haritadaki sayısal çizgi geometrisini doğrulamaz. Enlemesine çizgilerin sırası, uç noktaları ve aralıkları da belgeyle eşleştirilmedi."
  },

  mineLines: [
    { name: "Enlemesine hat 1", a: [40.078, 26.332], b: [40.072, 26.378] },
    { name: "Enlemesine hat 2", a: [40.086, 26.338], b: [40.08, 26.384] },
    { name: "Enlemesine hat 3", a: [40.094, 26.344], b: [40.088, 26.39] },
    { name: "Enlemesine hat 4", a: [40.102, 26.35], b: [40.096, 26.396] },
    { name: "Enlemesine hat 5", a: [40.11, 26.354], b: [40.104, 26.4] },
    { name: "Enlemesine hat 6", a: [40.118, 26.358], b: [40.112, 26.404] },
    { name: "Enlemesine hat 7", a: [40.126, 26.362], b: [40.12, 26.408] },
    { name: "Enlemesine hat 8", a: [40.132, 26.366], b: [40.126, 26.41] },
    { name: "Enlemesine hat 9", a: [40.138, 26.37], b: [40.132, 26.412] },
    { name: "Enlemesine hat 10", a: [40.144, 26.374], b: [40.138, 26.414] }
  ],

  events: [
    { t: "07:30", m: 450, side: "turk", place: "mustahkem-hq", title: "Karargâh güne başlar", text: "Cevat Bey gece devriyeleri ve mayın hatlarının durum raporlarını alır. Selahattin Adil Bey cerideleri açtırır." },
    { t: "08:30", m: 510, side: "itilaf", place: "ark-royal", title: "Donanma intikali", text: "Amiral de Robeck komutasındaki armada Limni, İmroz ve Bozcaada’dan Boğaz ağzına toplanır. Hava açık, deniz sakin." },
    { t: "08:45", m: 525, side: "turk", place: "seddulbahir", title: "İlk yaklaşma raporu", text: "Kumkale ve Seddülbahir dış gözetleme postaları büyük filonun Boğaz ağzına ilerlediğini bildirir." },
    { t: "09:00", m: 540, side: "turk", place: "mustahkem-hq", title: "Genel muharebe alarmı", text: "Tüm kıyı bataryaları, seyyar obüsler ve mayın gruplarına alarm. Cephanelikler açılır, telefon hatları sürekli açık tutulur." },
    { t: "09:00", m: 540, side: "itilaf", place: null, title: "Savaş düzeni ve telsiz sessizliği", text: "A Hattı İngiliz, B Hattı Fransız, C Hattı ihtiyat. Mürettebat muharebe istasyonlarına geçer." },
    { t: "09:30", m: 570, side: "turk", place: "kilitbahir", title: "Gözetleme tepesine intikal", text: "Cevat Bey’in gözetleme faaliyeti bu kayıtta ele alınır. Gözetleme yerine geçişin saati ve ateş açma mesafesine ilişkin emir belgeyle eşleştirilmedi." },
    { t: "10:00", m: 600, side: "itilaf", place: "seddulbahir", title: "Boğaz girişinin geçilmesi", text: "Öncü muhripler ve mayın tarayıcılar eşliğinde A Hattı Seddülbahir–Kumkale çizgisini aşar. Queen Elizabeth en önde." },
    { t: "10:30", m: 630, side: "itilaf", place: null, title: "İlk atış emri", text: "Filonun merkez tabyalara yönelik taarruz başlangıcı ele alınır. Bu kartın kesin emir saati, atış mesafesi ve bayrak işareti ayrıntısı belgeyle eşleştirilmedi; Queen Elizabeth’in rapordaki ateşe başlama kaydı ayrı gösterilir." },
    { t: "11:00", m: 660, side: "itilaf", place: "cimenlik", title: "Queen Elizabeth’in ateşe başlaması", text: "Queen Elizabeth için raporun ateşe başlama kaydı 11.25’tir; bütün filonun ilk atışı sayılmaz.", sourceTime: {"time": "11:25", "kind": "ateşe başlama", "url": "https://www.naval-history.net/WW1Battle1503Dardanelles2.htm", "eventDate": "1915-03-18", "documentDate": "1915-03-24", "accessDate": "2026-10-25", "status": "rapor_cevrimyazisi_okundu", "evidenceText": "opened fire", "timeSystem": "Raporda GMT+2 yerel saat; günümüz Türkiye saati değildir.", "limit": "Yayımlanmış raporun çevrimyazısı okundu; bu saat yalnız belirtilen aşamaya aittir. Özgün gemi jurnaliyle karşılaştırma açık."} },
    { t: "11:00", m: 660, side: "turk", place: "dardanos", title: "Seyyar bataryalara serbest atış", text: "Seyyar bataryalar ve Dardanos’un ateşe katılması inceleniyor. Cevat Bey’e atfedilen serbest atış emrinin özgün metni, muhatabı ve iletim saati henüz belgeyle eşleştirilmedi." },
    { t: "11:30", m: 690, side: "turk", place: "mesudiye", title: "İlk Türk karşılığı", text: "Çeliker’in sonraki anlatısı, merkez tabyaları menzil nedeniyle susarken Dardanos ve Mesudiye’nin karşılık verebildiğini belirtir. Bu pasaj bütün Osmanlı bataryalarının ilk ateş anını veya Şevket bataryasının aynı anda ateşe başladığını doğrulamaz." },
    { t: "11:35", m: 695, side: "itilaf", place: null, title: "Agamemnon ve Inflexible isabet alır", text: "Şarapnel ve HE mermileri güvertelere isabet eder; telsiz antenleri ve gözetleme kuleleri hasar görür." },
    { t: "12:00", m: 720, side: "itilaf", place: null, title: "Fransız B Hattı hücum emri", text: "Fransız hattına ilerleme emri 12.06’da verildi; mevziye varış ayrı aşamadır.", sourceTime: {"time": "12:06", "kind": "emir", "url": "https://www.naval-history.net/WW1Battle1503Dardanelles2.htm", "eventDate": "1915-03-18", "documentDate": "1915-03-24", "accessDate": "2026-10-25", "status": "rapor_cevrimyazisi_okundu", "evidenceText": "were ordered", "timeSystem": "Raporda GMT+2 yerel saat; günümüz Türkiye saati değildir.", "limit": "Yayımlanmış raporun çevrimyazısı okundu; bu saat yalnız belirtilen aşamaya aittir. Özgün gemi jurnaliyle karşılaştırma açık."} },
    { t: "12:00", m: 720, side: "turk", place: "anadolu-hamidiye", title: "Ağır tabyalara ateş", text: "Merkez tabyaların ateşe katılması ele alınır. Cevat Bey’e atfedilen emrin metni, iletim saati ve Fransız gemilerinin o andaki mesafesi için belge karşılaştırması tamamlanmadı." },
    { t: "12:20", m: 740, side: "both", place: "anadolu-hamidiye", title: "Göğüs göğüse düello", text: "Gemi ve kıyı bataryaları arasındaki karşılıklı ateş ele alınır. Suffren’in kesin isabet sayısı ve tabyaların tek tek ateş durumu bu kayıt için belgeyle eşleştirilmedi; Gaulois’nın hasar ve karaya oturma aşamaları ayrıca incelenir." },
    { t: "13:45", m: 825, side: "itilaf", place: null, title: "Saf değişimi", text: "Raporda Fransız hattına 13.43’te çekilme emri verilir. Yeni hattın ileri geçişi 14.32’de kaydedilir; emir ile hareket ayrı aşamalardır.", sourceTime: {"time": "13:43", "kind": "çekilme emri", "url": "https://www.naval-history.net/WW1Battle1503Dardanelles2.htm", "eventDate": "1915-03-18", "documentDate": "1915-03-24", "accessDate": "2026-10-25", "status": "rapor_cevrimyazisi_okundu", "evidenceText": "ordered out", "timeSystem": "Raporda GMT+2 yerel saat; günümüz Türkiye saati değildir.", "limit": "Yalnız belirtilen rapor aşaması okundu; özgün gemi jurnaliyle karşılaştırma açık."} },
    { t: "13:54", m: 834, side: "both", place: "bouvet", title: "Bouvet mayına çarpar", text: "Bouvet için rapordaki patlama kaydı 13.54’tür; batışın iki dakika içinde gerçekleştiği anlatılır. Bu saat raporun gözlemidir; özgün raporla karşılaştırma açık; kesin kayıp toplamı ayrıca araştırılıyor.", sourceTime: {"time": "13:54", "kind": "patlama kaydı", "url": "https://www.naval-history.net/WW1Battle1503Dardanelles2.htm", "eventDate": "1915-03-18", "documentDate": "1915-03-24", "accessDate": "2026-10-25", "status": "rapor_cevrimyazisi_okundu", "evidenceText": "1.54", "timeSystem": "Raporda GMT+2 yerel saat; günümüz Türkiye saati değildir.", "limit": "Yalnız belirtilen rapor aşaması okundu; özgün gemi jurnaliyle karşılaştırma açık."} },
    { t: "14:14", m: 854, side: "itilaf", place: "inflexible", title: "Inflexible’ın mayın isabeti bildirimi", text: "Inflexible’ın mayın isabeti bildirim saati 16.11’dir; isabetin kesin anı değildir.", sourceTime: {"time": "16:11", "kind": "bildirim", "url": "https://www.naval-history.net/WW1Battle1503Dardanelles2.htm", "eventDate": "1915-03-18", "documentDate": "1915-03-24", "accessDate": "2026-10-25", "status": "rapor_cevrimyazisi_okundu", "evidenceText": "reported", "timeSystem": "Raporda GMT+2 yerel saat; günümüz Türkiye saati değildir.", "limit": "Yayımlanmış raporun çevrimyazısı okundu; bu saat yalnız belirtilen aşamaya aittir. Özgün gemi jurnaliyle karşılaştırma açık."} },
    { t: "14:35", m: 875, side: "itilaf", place: "tavsan", title: "Gaulois karaya oturtulur", text: "Karaya oturma anlatısı rapor çevrimyazısında bulunur. Kesin saat, hasar ayrıntıları ve Drepano–Tavşan eşleştirmesi belgeyle doğrulanmadı." },
    { t: "14:45", m: 885, side: "turk", place: "mecidiye", title: "Cevat Bey’in hareketlerine ilişkin kayıtlar", text: "Cevat Paşa’nın karargâha dönüşü ve komutayı yürütmesi inceleniyor. Mecidiye ve Namazgâh’a atla gidiş anlatısı ile bu hareketin saati belgeyle eşleştirilmedi." },
    { t: "15:15", m: 915, side: "turk", place: "mecidiye", title: "Seyit Onbaşı ve elle yükleme", text: "Vinçler enkaz altında. Seyit Onbaşı ve Niğdeli Ali mermileri elle yükler. Dönüm noktası: tabyalar susturulamaz." },
    { t: "16:11", m: 971, side: "itilaf", place: "irresistible", title: "Irresistible mayına çarpar", text: "İsabet saati ve hasar ayrıntılarının belge karşılaştırması tamamlanmadı. Enkaz noktası isabet yeri olarak alınamaz." },
    { t: "16:32", m: 992, side: "itilaf", place: "irresistible", title: "Wear tahliye edilenlerle döner", text: "Wear tahliye edilenlerle 16.50’de Queen Elizabeth’e döndü; bu tahliyeye başlama veya Irresistible’ın batış saati değildir.", sourceTime: {"time": "16:50", "kind": "dönüş", "url": "https://www.naval-history.net/WW1Battle1503Dardanelles2.htm", "eventDate": "1915-03-18", "documentDate": "1915-03-24", "accessDate": "2026-10-25", "status": "rapor_cevrimyazisi_okundu", "evidenceText": "returned", "timeSystem": "Raporda GMT+2 yerel saat; günümüz Türkiye saati değildir.", "limit": "Yayımlanmış raporun çevrimyazısı okundu; bu saat yalnız belirtilen aşamaya aittir. Özgün gemi jurnaliyle karşılaştırma açık."} },
    { t: "16:45", m: 1005, side: "itilaf", place: "ocean", title: "Ocean mayına çarpar", text: "Filo raporu Ocean’ın mayın isabetini 18.05 olarak verir. Jed’in 17.55 ve Colne’un 18.00 tahliye kayıtlarıyla saat farkı çözülmedi; gemi saatleri kendiliğinden eşitlenmez. Bu saat batış zamanı değildir.", sourceTime: {"time": "18:05", "kind": "isabet kaydı", "url": "https://www.naval-history.net/WW1Battle1503Dardanelles2.htm", "eventDate": "1915-03-18", "documentDate": "1915-03-24", "accessDate": "2026-10-25", "status": "rapor_cevrimyazisi_okundu", "evidenceText": "6.5", "timeSystem": "Raporda GMT+2 yerel saat; günümüz Türkiye saati değildir.", "limit": "Yalnız belirtilen rapor aşaması okundu; özgün gemi jurnaliyle karşılaştırma açık."} },
    { t: "17:00", m: 1020, side: "both", place: "mustahkem-hq", title: "B hattına çekilme emri", text: "24 Mart tarihli rapor, Irresistible’ın mayın isabeti öğrenilince B hattına 16.50’de çekilme emri verildiğini kaydeder. Bu, bütün filonun Boğaz’dan çıkış saati değildir; eski Signal No. 12 numarası bu pasajla doğrulanmaz.", sourceTime: {"time": "16:50", "kind": "B hattına çekilme emri", "url": "https://www.naval-history.net/WW1Battle1503Dardanelles2.htm", "eventDate": "1915-03-18", "documentDate": "1915-03-24", "accessDate": "2026-10-26", "status": "rapor_cevrimyazisi_okundu", "evidenceText": "4.50. - ... orders were given for line \"B\" to withdraw.", "timeSystem": "Raporda GMT+2 yerel saat; günümüz Türkiye saati değildir.", "limit": "B hattına emir aşamasıdır; bütün filonun çıkışı veya Signal No. 12 numarası değildir. Özgün rapor ve sinyal defteriyle karşılaştırma açık."} },
    { t: "17:15", m: 1035, side: "turk", place: "dardanos", title: "Dardanos rasat yeri şehit düşer", text: "Dardanos’taki gözetleme ve irtibat mevkiine ilişkin kayıp anlatısı ele alınır. İsabet eden merminin kalibresi, hangi gemiden atıldığı, personel listesi ve komutanın görevi devralma sırası için belge karşılaştırması tamamlanmadı." },
    { t: "17:45", m: 1065, side: "both", place: "seddulbahir", title: "Filo Ege’ye çıkar", text: "Filonun kesin çıkış saati, sırası ve son atış anlatısının belge karşılaştırması tamamlanmadı." },
    { t: "18:00", m: 1080, side: "itilaf", place: null, title: "Vengeance’ın ateşi kesmesi ve çıkışı", text: "Vengeance’ın 18 Mart seyir günlüğü, geminin akşam 6.29’da ateşi kesip Boğaz dışına yöneldiğini kaydeder. Bu tek geminin kaydıdır; bütün filonun veya Osmanlı bataryalarının ateşi aynı anda kestiğini göstermez.", sourceTime: {"time": "18:29", "kind": "Vengeance’ın ateşi kesmesi", "url": "https://oldweather.s3.amazonaws.com/ADM%2053-67111/ADM%2053-67111-034_1.jpg", "eventDate": "1915-03-18", "documentDate": "1915-03-18", "accessDate": "2026-10-26", "status": "gunluk_goruntusu_ilgili_satir_okundu", "evidenceText": "6.29 Ceased fire - procd out of Dardanelles", "timeSystem": "Günlükteki PM 6.29, 18.29 olarak yazıldı. GMT veya günümüz Türkiye saatine dönüşüm yapılmadı.", "limit": "Yalnız Vengeance’ın ateşi kesip çıkışa yönelmesi; bütün filonun veya Osmanlı bataryalarının son atışı değildir. Diğer günlüklerle karşılaştırma açık."} },
    { t: "18:15", m: 1095, side: "turk", place: "mustahkem-hq", title: "Zafer raporu", text: "Günün sonucuna ilişkin raporlama bu kayıtta ele alınır. Cevat Bey’den Enver Paşa’ya gönderildiği ileri sürülen telgrafın özgün metni, gönderim saati ve bu telgrafa atfedilen gemi sayısı belgeyle eşleştirilmedi. Kutlama telgrafları aynı günün harekât raporu yerine kullanılamaz." },
    { t: "19:30", m: 1170, side: "itilaf", place: "irresistible", title: "Irresistible batar", text: "Kesin batış saati doğrulanmadı. Geminin terk edilmesi ve gece aramasında bulunamaması, batış anının gözlemlendiği anlamına gelmez." },
    { t: "22:30", m: 1350, side: "itilaf", place: "ocean", title: "Ocean batar", text: "Ocean’ın 18 Mart’ta batışı kaynak notunda ele alınır. Bu kaydın 22:30 saati özgün gemi raporuyla kesinleştirilmedi; gece arama ve tespit anlatısı için belge incelemesi açık." }
  ],

  units: [
    { name: "Çanakkale Müstahkem Mevkii", cmd: "Miralay Cevat Bey (Çobanlı); Kurmay: Yarbay Selahattin Adil Bey", n: "Gerçek mevcut ve kuruluş kadrosu için tarihli cetvel incelemesi açık", area: "Her iki yaka tabyaları, seyyar bataryalar, mayın ve projektörler", place: "mustahkem-hq" },
    { name: "3. Kolordu", cmd: "Mirliva Esat Paşa (Bülkat)", n: "Gerçek mevcut ve kuruluş kadrosu için tarihli cetvel incelemesi açık", area: "Boğaz çevresi, Gelibolu, Saros’tan Anadolu kıyısına", place: "kolordu-3" },
    { name: "19. Tümen (ihtiyat)", cmd: "Yarbay Mustafa Kemal", n: "Gerçek mevcut ve kuruluş kadrosu için tarihli cetvel incelemesi açık", area: "Maydos, Seddülbahir gerisi, Kilitbahir geçişi", place: "tumen-19" },
    { name: "9. Tümen", cmd: "Miralay Halil Sami Bey", n: "Gerçek mevcut ve kuruluş kadrosu için tarihli cetvel incelemesi açık", area: "Seddülbahir, Alçıtepe, Krithia ve güney kıyı", place: "tumen-9" },
    { name: "7. Tümen", cmd: "Miralay Remzi Bey", n: "Gerçek mevcut ve kuruluş kadrosu için tarihli cetvel incelemesi açık", area: "Saros kıyıları ve Bolayır Kıstağı", place: "tumen-7" },
    { name: "11. Tümen", cmd: "Miralay Rafet Bey", n: "Gerçek mevcut ve kuruluş kadrosu için tarihli cetvel incelemesi açık", area: "Kumkale, Erenköy, Yeniköy, Beşige", place: "tumen-11" },
    { name: "Mayın ve Deniz Savunma", cmd: "Binbaşı Nazmi Bey; Nusret: Yzb. Tophaneli Hakkı", n: "Gerçek mevcut ve kuruluş kadrosu için tarihli cetvel incelemesi açık", area: "Boğaz mayın savunması; hat mevcudu ve personel kapsamı ayrı incelenir", place: "nusret" }
  ],

  // Eski gemi tablosu araştırma kaydında: R03-unused-ships.json
  ships: [],

  support: [],

  // Kaynak pasajı bulunmayan eski nicelikler ve personel listeleri site verisinden çıkarıldı.
  // Araştırma izi: research/reports/2026-10-26/R03-unused-numeric-inventory.json
  ammo: [],
  spend: {},
  fortHits: [],
  dardanosPeople: { cmd: [], fallen: [] },

  // Eski destek/komutan taslakları: R03-unused-support-commanders.json
  commanders: []
};
