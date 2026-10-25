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
        note: [
          "Seddülbahir cephesinin Ege yakasındaki dere. İşaret derenin saha merkezidir."
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
        text: "25 Şubat’ta dış tabyalar susturulur. Seddülbahir ve Kumkale’ye tahrip timleri çıkar; kalıcı tutunma yoktur.",
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
          "passage": "1 March 1915",
          "eventDate": "1–17 Mart 1915",
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "İngiliz trol tekneleri geçidi temizleyemedi.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
        }
      },
      {
        id: "e-nusret",
        date: "8 Mart 1915",
        side: "osmanli",
        domain: "deniz",
        battle: false,
        title: "Nusret, Erenköy hattını döker",
        text: "7–8 Mart gecesi Nusret, Erenköy Koyu’na kıyıya paralel 26 mayın döker. Bu hat 18 Mart’ta belirleyici olur.",
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Kara harekâtı donanmanın başarısızlığına bağlandı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Mısır’daki birliklere hareket emri verildi.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
        "text": "Çıkarma gemileri Mondros’ta toplandı.",
        "place": null,
        "chronologySource": {
          "url": "https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline",
          "label": "DVA · tarihli kurum özeti",
          "passage": "20 April 1915",
          "eventDate": "20 Nisan 1915",
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Çıkarma gemileri Mondros’ta toplandı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
        }
      },
      {
        id: "e-seddul",
        date: "25 Nisan 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Seddülbahir çıkarması",
        text: "29. Tümen, Seddülbahir’de V, W, X, Y ve S kumsallarına çıkar. V kumsalı kale önü, W Tekke Koyu, S Morto tarafındadır. 9. Tümen güney kıyıyı karşılar.",
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
        text: "Fransız sefer kolu Kumkale’ye çıkar. Anadolu yakasındaki 11. Tümen sahasındadır. Kumkale’den geri çekilme ve Seddülbahir’e yeniden sevk ayrı aşamalardır; kaynak notu olay sayfasındadır.",
        place: "kumkale"
      },
      {
        id: "e-saros",
        date: "25 Nisan 1915",
        side: "itilaf",
        domain: "kara",
        battle: false,
        title: "Saros gösterişi",
        text: "Saros açıklarında gösteriş yapılır; büyük çıkarma yoktur. İşaret, Bolayır’daki 7. Tümen sahasının merkezidir, gemi mevzii değildir.",
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Gascon İskenderiye’ye ulaştı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "passage": "Görüntü4–5 / yaprak46–47; 9–10 Mayıs1915",
          "eventDate": "9–10 Mayıs 1915",
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "gunluk_goruntusu_ilgili_pasaj_okundu",
          "evidenceText": "Alınan Osmanlı siperi ertesi sabah bırakıldı.",
          "scope": "El yazılı günlük taramasında9–10Mayıs pasajları okundu.63sayfanın tümü okunmadı; karşı tarafın raporudur. Saat sistemi ayrıca kalibre edilmedi."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Joseph Slack, Quinn’s Post’ta kazı duydu.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "scope": "Fotoğrafın tarih ve açıklama alanları okundu; anlaşma metni değildir."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Patlamayı Osmanlı hücumu izledi; mevzi tutulamadı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Anzak ikmali için iskele tamamlandı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Anzak’ta kolera aşılamasına başlandı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Üçüncü Avustralya Genel Hastanesi Limni’ye ulaştı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
        text: "Suvla çıkarması 6 Ağustosta başladı. Yakın tepe kazanımları ile iç kesimdeki hedefler ayrılır; ayrıntılar ve kaynak kapsamı olay sayfasındadır.",
        place: "anafartalar"
      },
      {
        id: "e-conk",
        date: "6–10 Ağustos 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "Conkbayırı Muharebesi",
        text: "Conkbayırı el değiştirir. 10 Ağustos’ta Osmanlı karşı taarruzu tepeyi geri alır; taarruzu Mustafa Kemal yönetir. Kocaçimentepe alınamaz.",
        place: "conkbayiri"
      },
      {
        id: "e-barbaros",
        date: "8 Ağustos 1915",
        side: "both",
        domain: "deniz",
        battle: false,
        title: "Barbaros Hayreddin batar",
        text: "Barbaros Hayreddin, Marmara’da İngiliz denizaltısı E11 tarafından batırılır. 18 Mart Boğaz hattında değildir. Batış noktasının koordinatı bu haritaya konmadı.",
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "İngiliz ilerlemesi sınırlı kaldı.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
        }
      },
      {
        id: "e-anaf2",
        date: "21 Ağustos 1915",
        side: "both",
        domain: "kara",
        battle: true,
        title: "İkinci Anafartalar Muharebesi",
        text: "Suvla cephesinde İkinci Anafartalar (Yusufçuk Tepe) yapılır. Bomba Tepe çatışmaları 29 Ağustos’a kadar sürer. Sırtlar alınamaz.",
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Anzak su ikmali zarar gördü.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Kitchener çekilmeyi tavsiye etti.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Şiddetli yağışı tipi izledi.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Britanya hükümeti çekilmeyi onayladı; Seddülbahir bekletildi.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          "publicationDate": null,
          "accessDate": "2026-10-25",
          "status": "kurumsal_ozet_pasaji_okundu",
          "evidenceText": "Britanya hükümeti Seddülbahir’in tahliyesini emretti.",
          "scope": "İlgili tarihli giriş okundu; özgün harp belgesi incelenmedi."
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
          body: "24 Mart 1915’te kurulan 5. Ordu’nun komutanıdır. Kara savunmasının üst komutanlığıdır.",
          place: null,
          note: "Gelibolu’daki karargâh için ayrı bir nokta işaretlenmedi."
        },
        {
          name: "Esat Paşa (Bülkat)",
          role: "3. Kolordu Komutanı",
          body: "Yarımada tarafındaki 3. Kolordu’nun başındadır. Arıburnu kesimi bu kolordunun sahasındadır.",
          place: "kolordu-3"
        },
        {
          name: "Vehip Paşa (Kaçı)",
          role: "Güney Grubu Komutanı",
          body: "Temmuz 1915’te Seddülbahir cephesinin (Güney Grubu) komutanı olur.",
          place: "seddulbahir"
        },
        {
          name: "Mustafa Kemal",
          role: "19. Tümen, sonra Anafartalar Grubu",
          body: "25 Nisan 1915’te 19. Tümen komutanıdır. 8/9 Ağustos 1915 gecesi Anafartalar Grup Komutanlığına getirilir. 10 Ağustos Conkbayırı karşı taarruzu bu görevle anılır.",
          place: "tumen-19"
        },
        {
          name: "Cevat Bey (Çobanlı)",
          role: "Müstahkem Mevkii Komutanı",
          body: "18 Mart 1915’te Çanakkale Müstahkem Mevkii komutanıdır. Boğaz tabyaları ve mayın savunması bu komutanlıktadır.",
          place: "mustahkem-hq"
        },
        {
          name: "Selahattin Adil Bey",
          role: "Müstahkem Mevkii kurmay başkanı",
          body: "18 Mart’ta Cevat Bey’in kurmay başkanıdır.",
          place: "mustahkem-hq"
        },
        {
          name: "Halil Sami Bey",
          role: "9. Tümen Komutanı",
          body: "Seddülbahir–Kirte sahası 18 Mart’ta ve 25 Nisan çıkarmasının ilk günlerinde 9. Tümen’indir.",
          place: "tumen-9"
        },
        {
          name: "Rafet Bey",
          page: "/komutanlar/rafet-bey-bele/",
          role: "11. Tümen Komutanı",
          body: "Kumkale–Erenköy Anadolu kıyısı 11. Tümen sahasıdır. 25 Nisan Kumkale çıkarması bu kesime gelir.",
          place: "tumen-11"
        },
        {
          name: "Remzi Bey",
          role: "7. Tümen Komutanı",
          body: "Saros kıyıları ve Bolayır Kıstağı 7. Tümen sahasıdır. 25 Nisan’daki Saros gösterişi bu kesime yöneliktir.",
          place: "tumen-7"
        },
        {
          name: "Weber Paşa",
          role: "XV. Kolordu Komutanı",
          body: "Anadolu yakası, çıkarma günlerinde XV. Kolordu sahasıdır. Kumkale bu koldadır.",
          place: "kumkale"
        },
        {
          name: "Guido von Usedom",
          role: "Boğazlar genel müfettişi",
          body: "18 Mart’ta Alman danışma heyetinin başında, Müstahkem Mevkii gözetleme yerindedir.",
          place: "kilitbahir"
        },
        {
          name: "Johannes Merten",
          role: "Ağır topçu danışmanı",
          body: "18 Mart’ta Anadolu Hamidiye’de ağır top ateşinin idaresinde bulunur.",
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
          body: "Deniz kurmay başkanıdır. 18 Mart’tan sonra deniz taarruzunun yenilenmesinden yana olduğu kayıtlarda yer alır.",
          place: null
        },
        {
          name: "Émile Guépratte",
          role: "Fransız deniz tümeni",
          body: "18 Mart’ta B Hattı’ndaki Fransız zırhlılarının komutanıdır.",
          place: null
        },
        {
          name: "Ian Hamilton",
          role: "Akdeniz Sefer Kuvveti komutanı",
          body: "Kara harekâtının komutanıdır (Mart–Ekim 1915). 18 Mart deniz muharebesinin komutanı değildir. Ekim 1915’te geri çağrılır.",
          place: null
        },
        {
          name: "William Birdwood",
          role: "ANZAK komutanı",
          body: "Arıburnu’na çıkan Avustralya ve Yeni Zelanda Kolordusu’nun komutanıdır.",
          place: "ariburnu"
        },
        {
          name: "William Bridges",
          role: "1. Avustralya Tümeni Komutanı",
          body: "25 Nisan’da Arıburnu’na çıkan tümeninin komutanıdır. 15 Mayıs 1915’te ağır yaralanır.",
          place: "ariburnu"
        },
        {
          name: "Alexander Godley",
          role: "Yeni Zelanda ve Avustralya Tümeni Komutanı",
          body: "ANZAK’ın Arıburnu’ndaki diğer tümeninin komutanıdır.",
          place: "ariburnu"
        },
        {
          name: "Aylmer Hunter-Weston",
          role: "29. Tümen, sonra VIII. Kolordu",
          body: "25 Nisan’da Seddülbahir’e çıkan 29. Tümen’in komutanıdır. Sonra Seddülbahir cephesindeki VIII. Kolordu’yu komuta eder.",
          place: "seddulbahir"
        },
        {
          name: "Frederick Stopford",
          role: "IX. Kolordu Komutanı",
          body: "6–7 Ağustos 1915 Suvla çıkarmasını komuta eder. Ağustos 1915 içinde görevden alınır.",
          place: "anafartalar"
        },
        {
          name: "Albert d’Amade",
          role: "Fransız Sefer Kolordusu",
          body: "25 Nisan Kumkale çıkarmasının ve ardından Seddülbahir’deki Fransız kolunun komutanıdır. Mayıs 1915’te yerini Gouraud’ya bırakır.",
          place: "kumkale"
        },
        {
          name: "Henri Gouraud",
          role: "Fransız Sefer Kolordusu",
          body: "Mayıs 1915’te Fransız kolordusunun komutanı olur. Haziran 1915 sonunda Seddülbahir’de yaralanır.",
          place: "seddulbahir"
        },
        {
          name: "Charles Monro",
          role: "Akdeniz Sefer Kuvveti komutanı",
          body: "Ekim 1915 sonunda Hamilton’un yerine gelir. Tahliyeyi önerir.",
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
