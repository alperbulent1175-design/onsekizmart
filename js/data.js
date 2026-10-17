/* 18 Mart 1915 — Çanakkale Deniz Muharebesi
   Mevki koordinatları açık kaynak haritalar, batık kayıtları ve tabya konumlarına
   dayanır; birlik sahaları sektör merkezleridir, siper hattı değildir. */
window.OM = {
  center: [40.09, 26.32],
  defaultZoom: 11,
  disclaimer:
    "Mevkiler tarihî kaynaklara göre yaklaşık işaretlenmiştir. Batık ve mayın hattı noktaları birkaç yüz metre sapabilir; birlikler sorumluluk sahasının merkezidir.",

  layers: [
    { id: "tabya", label: "Tabyalar", color: "#c45c4a" },
    { id: "birlik", label: "Birlikler", color: "#6b8f71" },
    { id: "gemi", label: "İtilaf gemileri", color: "#6a8caf" },
    { id: "enkaz", label: "Batış / hasar", color: "#d4af37" },
    { id: "komuta", label: "Komuta", color: "#e8d5a3" },
    { id: "mayin", label: "Mayın hatları", color: "#e0b84a" },
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
        "Henüz 5. Ordu kurulmadığı için (24 Mart 1915) Boğaz savunması doğrudan 3. Kolordu ve Müstahkem Mevkii bünyesindeki birliklerle icra edildi.",
        "Mevcut: yaklaşık 18.000–20.000 (topçu, istihkâm, mayın ve muhabere personeli).",
        "Sorumluluk: her iki yakadaki ağır/hafif kıyı tabyaları, seyyar bataryalar, mayın hatları ve projektör mevkileri.",
        "07.30’da Cevat Bey gece devriye ve mayın hat raporlarını aldı. 09.00’da genel muharebe alarmı verildi. 09.30’da Kilitbahir yamaçlarındaki Muharebe Gözetleme Yeri’ne çıkıldı.",
        "Kesin ateş disiplini: İngiliz gemileri merkez tabyaların etkili menziline (~10.000 m) girmeden karşı ateş açılmayacak, cephane israf edilmeyecek, tabyalar erkenden ifşa edilmeyecekti."
      ]
    },
    {
      id: "kilitbahir",
      type: "tabya",
      name: "Kilitbahir Kalesi",
      lat: 40.147656,
      lng: 26.379565,
      meta: "Rumeli · Boğaz’ın kilidi",
      short: "Fatih’in 1462–63’te inşa ettirdiği kale. 18 Mart günü gözetleme ve komuta tepesi.",
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
      lat: 40.14355,
      lng: 26.3842,
      meta: "Kilitbahir güneyi · Seyit Onbaşı",
      short: "Günün en ağır hasarını alan merkez tabya. Vinçler çöktü; mermiler elle yüklendi.",
      hits: "80–100 isabet",
      note: [
        "11.05’te Agamemnon’un ilk hedeflerinden biriydi. Öğleden sonra Rumeli Mecidiye, Namazgâh ve Anadolu Hamidiye duman ve alev içinde kaldı.",
        "Kışla binası yıkıldı, cephane yolları çöktü, vinçler tahrip oldu; personelin büyük kısmı şehit veya gazi oldu. Telefon irtibatı koptu.",
        "15.15 sularında tabya büyük oranda tahrip olmasına rağmen ayakta kalan personel (Seyit Onbaşı ve Niğdeli Ali dâhil) enkaz altından çıkarılan mermileri elle yükleyerek ateşe devam etti.",
        "Cevat Bey 14.45’te at sırtında Mecidiye ve Namazgâh’a teftişe indi; krizi sahada yönetti.",
        "Bu atışlar İngiliz zırhlılarının manevra alanını daralttı ve onları kıyıya daha yakın, mayınlı sulara itti."
      ]
    },
    {
      id: "namazgah",
      type: "tabya",
      name: "Namazgâh Tabyası",
      lat: 40.14605,
      lng: 26.37815,
      meta: "Kilitbahir · 4. Ağır Topçu Alayı karargâhı",
      short: "Boğaz’ın en dar noktasına kurulan ilk ve en büyük tabya. 40–50 isabet aldı; bonetler dayandı.",
      hits: "40–50 isabet",
      note: [
        "Baron de Tott’un önerisiyle inşa edilen merkez tabya. 26 bonet; 16 kıyı topundan ikisi uzun menzilli olarak muharebede aktif kullanıldı.",
        "12.15’te Suffren ve Gaulois doğrudan Rumeli Mecidiye ve Namazgâh’ı hedef aldı.",
        "Geniş alana yayıldığı için çok sayıda isabet aldı; toprak bonetler büyük oranda dayandı, 1 top hasar gördü.",
        "Cevat Bey öğleden sonra burayı da teftiş etti; ayakta kalan toplarla ateşin sürdürülmesini organize etti."
      ]
    },
    {
      id: "rumeli-hamidiye",
      type: "tabya",
      name: "Rumeli Hamidiye Tabyası",
      lat: 40.1449,
      lng: 26.3811,
      meta: "Namazgâh ile Mecidiye arası · 2×355 mm Krupp",
      short: "Boğaz’ın en ağır namlularından ikisi. Toprak siperler hasar gördü; toplar ateşe devam etti.",
      hits: "25–30 isabet",
      note: [
        "1896, II. Abdülhamit. Namazgâh ile Mecidiye arasında, 2 adet 355/35 mm uzun namlulu Krupp.",
        "Boğaz’daki beş 355 mm’lik topun ikisi buradaydı (ikisi Anadolu Hamidiye, biri Çimenlik).",
        "Toprak siperler ve taret çevreleri hasar gördü ancak toplar gün boyunca atışa devam edebildi."
      ]
    },
    {
      id: "cimenlik",
      type: "tabya",
      name: "Çimenlik Tabyası (Kale-i Sultaniye)",
      lat: 40.1477,
      lng: 26.3995,
      meta: "Anadolu · Çanakkale merkez",
      short: "Fatih’in karşılık kalesi. 11.00’de Queen Elizabeth’in ilk 381 mm’lik mermilerinin hedefi.",
      hits: "30–40 isabet",
      note: [
        "11.00: Queen Elizabeth, 14.000 m’den ilk 381 mm’lik mermilerini Rumeli Çimenlik/Kilitbahir istikametine ateşledi. Inflexible da Çimenlik ve Hamidiyeleri hedef aldı.",
        "Kale surları ve iç avlu ağır isabetler aldı. Bir adet 355 mm’lik patlamamış İngiliz mermisi kale duvarında saplanmış halde kaldı.",
        "Amiral Merten sabah Anadolu yakasında Çimenlik ve Hamidiye’nin mekanik durumunu ve cephane vinçlerini denetletti."
      ]
    },
    {
      id: "anadolu-hamidiye",
      type: "tabya",
      name: "Anadolu Hamidiye Tabyası",
      lat: 40.1398,
      lng: 26.4072,
      meta: "Anadolu · 355 mm ve 240 mm Krupp",
      short: "Fransız filosunun göğüs göğüse girdiği ağır batarya. Suffren ve Gaulois’ya isabetlerin kaynağı.",
      hits: "40–50 isabet",
      note: [
        "12.15’te Bouvet doğrudan Anadolu Hamidiyeleri, Suffren ve Gaulois Rumeli tabyalarını hedef aldı. Türk kıyı bataryaları (Hamidiye, Mecidiye, Dardanos, Namazgâh) tüm namlularla ateşe başladı.",
        "Amiral Johannes Merten bizzat burada ateş idaresinde bulundu; 355 mm ve 240 mm Krupp’ların namlu yükselişi ve tapalarını yönetti.",
        "Inflexible ve Suffren tarafından yoğun hedef alındı. 2 büyük top geçici devre dışı kaldı; bir cephanelik isabet alarak infilak etti.",
        "16.18’den sonra mayınlanan Irresistible’a ve 16.45’ten sonra Ocean’a tüm ağır namlular odaklandı."
      ]
    },
    {
      id: "dardanos",
      type: "tabya",
      name: "Dardanos Tabyası (Hasan-Mevsuf)",
      lat: 40.085728,
      lng: 26.371181,
      meta: "Kepez–İntepe · 15 cm Krupp seri ateş",
      short: "Orta savunma kuşağının ileri karakolu. 17.15’te rasat yeri vuruldu; komuta kademesi şehit düştü.",
      hits: "60–80 isabet",
      note: [
        "Teknik donanım: 15 cm’lik hızlı ateşli Krupp toplar. Mayın hatlarını koruma ve filonun daralmaya ilerlemesini engellemede kilit rol.",
        "11.30’dan itibaren Dardanos, Mesudiye ve Şevket bataryaları ile seyyar obüsler, henüz ağır tabyalar suskunken sürpriz atışlara başladı.",
        "Gün boyu ~60–80 isabet; siperler savruldu, telefon kabloları koptu. Yüzbaşı Hasan Hulusi ve Teğmen Mehmet Mevsuf 17.15’te 30,5 cm’lik mermiyle şehit oldu.",
        "Cevat Paşa’nın teklifi ve Harbiye Nezareti onayıyla adı ‘Hasan-Mevsuf Bataryası’ olarak değiştirildi.",
        "17 Nisan 1915’te karaya oturan HMS E15 denizaltısının kulesine ilk isabeti de bu tabya verdi."
      ]
    },
    {
      id: "seddulbahir",
      type: "tabya",
      name: "Seddülbahir",
      lat: 40.0447,
      lng: 26.178,
      meta: "Gelibolu güney ucu · giriş tabyası",
      short: "Boğaz ağzının Rumeli kapısı. 08.45’te filonun yaklaştığını bildiren dış gözetleme postası.",
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
      meta: "Anadolu giriş · 11. Tümen sahası",
      short: "Boğaz ağzının Anadolu kapısı. Sabah alarmının diğer ucu.",
      note: [
        "Kumkale gözetleme postası 08.45’te büyük filonun Boğaz ağzına ilerlediğini rapor etti.",
        "11. Tümen (Miralay Rafet Bey) Anadolu kıyı şeridini (Kumkale, Erenköy, Yeniköy, Beşige Koyu) tutuyordu.",
        "25 Şubat’ta giriş tabyalarının susturulması ve tahrip timlerinin karaya çıkarılması sırasında yoğun bombardıman gördü."
      ]
    },
    {
      id: "mesudiye",
      type: "tabya",
      name: "Mesudiye / Yıldız / Baykuş bataryaları",
      lat: 40.0965,
      lng: 26.362,
      meta: "Kepez–Dardanos hattı · seyyar ve sahil",
      short: "Yerleri tam tespit edilemediği için isabetler çevreye düştü; mevziler çabuk toparlandı.",
      hits: "20–30’ar isabet",
      note: [
        "11.30’da Mesudiye ve Şevket bataryaları ile seyyar obüsler, ağır tabyalar henüz suskunken İngiliz zırhlılarına karşılık vermeye başladı.",
        "15.10’da Dardanos ve Baykuş bataryaları ile seyyar havanlar, Boğaz ortasında sabit hedef haline gelen zırhlılara mermi yağdırdı.",
        "Seyyar bataryaların asimetrik üstünlüğü: yer değiştirebildikleri için gözetleme yaptırtmadı, personeli şarapnelle biçti ve gemileri mayın hatlarına sürükledi."
      ]
    },
    {
      id: "tavsan",
      type: "enkaz",
      name: "Tavşan (Drepano) Adası — Gaulois",
      lat: 40.0038,
      lng: 26.152,
      meta: "Boğaz ağzı · karaya oturtma",
      short: "Gaulois, baş bodoslamasındaki yırtık nedeniyle batmamak için buraya baştan kara ettirildi.",
      note: [
        "12.28: Kilitbahir’den atılan ağır mermi Gaulois’nın sancak baş bodoslamasını deldi; su altı kompartımanları doldu.",
        "14.35: Batma tehlikesi üzerine Çanakkale Boğazı ağzındaki Tavşan (Drepano) Adası kıyısına baştan kara ettirildi."
      ]
    },
    {
      id: "bouvet",
      type: "enkaz",
      name: "Bouvet — yaklaşık gösterim",
      lat: 40.01917,
      lng: 26.27167,
      uncertainty: "Bu işaret için incelenmiş sayısal enkaz koordinatı dayanağı tamamlanmadı. Yaklaşık gösterimdir; kesin batış veya enkaz noktası sayılmaz.",
      meta: "18 Mart 1915 · saat ve kayıp ayrıntıları incelemede",
      short: "Bouvet’nin mayına çarpıp batışı AWM koleksiyon açıklamasında anlatılır. Kesin batış süresi ve zayiat sayısı doğrulanmadı.",
      note: [
        "AWM P04411.003 koleksiyon açıklamasında mayın isabeti için 13:54 verilir; özgün gemi raporuyla karşılaştırma açık.",
        "Önceki 1 dakika 55 saniye, 639 kayıp ve 47 kurtulan ifadeleri bu kaynakla doğrulanmaz. İnceleme sınırları 18 Mart kaynak notundadır."
      ]
    },
    {
      id: "inflexible",
      type: "enkaz",
      name: "HMS Inflexible — mayın isabeti",
      lat: 40.0435,
      lng: 26.292,
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
      meta: "Erenköy Koyu · 16.11 · ~19.30’da battı",
      short: "Makine dairesi doldu; Wear ~600 kişiyi tahliye etti. Akıntıda sürüklenerek akşam battı.",
      note: [
        "16.11: Hamidiye menzilinden çıkmak için Erenköy’e manevra yaparken sancak makine dairesinin altından mayına çarptı.",
        "16.14: Gemi 7° sancağa yattı, makineler durdu, kumandasız sürüklendi. Türk sahra topçusu Dardanos ve Hamidiye’den sabit hedefe yüklendi.",
        "Wear muhribi ~600 mürettebatı tahliye etti; kaptan ve 10 gönüllü kaldı. Ocean yedekleme halatlarını bağlayamadı.",
        "17.25’te kalan çekirdek mürettebat da indi. Terk edilen zırhlı saat 19.30 sularında battı."
      ]
    },
    {
      id: "ocean",
      type: "enkaz",
      name: "HMS Ocean — yaklaşık gösterim",
      lat: 40.0315,
      lng: 26.2788,
      uncertainty: "Bu işaret için incelenmiş sayısal enkaz koordinatı dayanağı tamamlanmadı. Yaklaşık gösterimdir; kesin batış veya enkaz noktası sayılmaz.",
      meta: "18 Mart 1915 · isabet ve batış saatleri incelemede",
      short: "Ocean 18 Mart’ta battı. Mayın isabeti anlatıları farklı kesinliktedir; ayrıntılı saat ve tahliye bilgisi doğrulanmadı.",
      note: [
        "AWM A02360 açıklaması mayınla batışı kesin anlatır; DVA Anzac Portal aynı ayrıntıyı ihtimalli ifade eder.",
        "16:45, tahliye sayısı ve gemi görevleri için belge karşılaştırması tamamlanmadı. 22:30 kaydı özgün gemi raporuyla kesinleştirilmedi.",
        "Kaynaklar ve inceleme sınırları 18 Mart Deniz Muharebesi sayfasındaki Ocean bölümündedir."
      ]
    },
    {
      id: "kolordu-3",
      type: "birlik",
      name: "3. Kolordu Komutanlığı",
      lat: 40.4102,
      lng: 26.6708,
      meta: "Gelibolu · Mirliva Esat Paşa (Bülkat)",
      short: "Genel savunma üst komutanlığı. ~50.000–55.000; Yarımada, Saros ve Anadolu kıyısı.",
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
      short: "57., 72., 77. Piyade ve 39. Topçu Alayı. Olası çıkarmaya karşı acil müdahale yedeği.",
      strength: "~12.000–14.000",
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
      short: "25., 26., 27. Piyade Alayları. Yarımada güney ucu ve Boğaz kıyı şeridi koruma/gözetleme.",
      strength: "~12.000–13.000",
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
      short: "19., 20., 21. Piyade Alayları. Trakya yönünden amfibi kuşatmaya karşı kuzey kalkanı.",
      strength: "~11.000–12.000",
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
      short: "33., 126., 127. Piyade Alayları. Anadolu yakası kıyı şeridi ve Beşige Koyu yamaçları.",
      strength: "~11.000–12.000",
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
      short: "Boğaz’daki 11 hat + Erenköy gizli hattı. ~400–500 denizci ve mayın personeli.",
      note: [
        "Nusret, 7–8 Mart gecesi 26 mayını Erenköy Koyu’na kıyıya paralel (kuzey–güney) döktü.",
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
      short: "Boğaz üzerindeki keşif uçuşları Erenköy’deki gizli mayınları tespit edemedi.",
      note: [
        "Sabah keşif uçakları Türk bataryalarını ve olası mayın hatlarını kontrol etti; parlama, bulanıklık ve sığlık nedeniyle askıdaki mayınlar görülemedi.",
        "16–17 Mart rutin taramalarında teller hattın üzerinden geçmesine rağmen mayınlara takılmadı."
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
      note: "7–8 Mart gecesi kıyıya paralel döküldü. Hattın gemi kayıplarıyla ilişkisi kaynak notlarında ele alınır; Ocean için mayın isabeti anlatıları farklı kesinliktedir. Aralık ~100–150 m."
    },
    {
      id: "hat-a",
      type: "filo",
      name: "A Hattı — İngiliz zırhlıları (~10.30)",
      color: "#8fa4c4",
      dash: "14 8",
      weight: 3,
      latlngs: [
        [40.068, 26.238],
        [40.06, 26.252],
        [40.053, 26.266],
        [40.046, 26.28]
      ],
      note: "Queen Elizabeth, Inflexible, Agamemnon, Lord Nelson. Merkez tabyalara ~13–14 km. Amiral de Robeck, Queen Elizabeth sancak gemisi."
    },
    {
      id: "hat-b",
      type: "filo",
      name: "B Hattı — Fransız zırhlıları (~12.15)",
      color: "#c4a574",
      dash: "14 8",
      weight: 3,
      latlngs: [
        [40.082, 26.268],
        [40.075, 26.28],
        [40.068, 26.292],
        [40.061, 26.304]
      ],
      note: "Suffren, Bouvet, Gaulois, Charlemagne (Amiral Guépratte). A Hattı’nın boşluklarından geçerek ~9.000 m’ye sokuldular."
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
      note: "Vengeance, Irresistible, Albion, Ocean, Majestic, Swiftsure. 13.45’te hasarlı Fransız hattının yerine ön safa sürüleceklerdi."
    }
  ],

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
    { t: "09:30", m: 570, side: "turk", place: "kilitbahir", title: "Gözetleme tepesine intikal", text: "Cevat Bey telemetre ve dürbünle Boğaz girişini bizzat takip eder. Ateş disiplini teyit edilir: 10.000 m’den önce ateş yok." },
    { t: "10:00", m: 600, side: "itilaf", place: "seddulbahir", title: "Boğaz girişinin geçilmesi", text: "Öncü muhripler ve mayın tarayıcılar eşliğinde A Hattı Seddülbahir–Kumkale çizgisini aşar. Queen Elizabeth en önde." },
    { t: "10:30", m: 630, side: "itilaf", place: null, title: "İlk atış emri", text: "Filo merkez tabyalara 13–14 km’de konuşlanır. De Robeck bayrak çekerek genel taarruzu başlatır." },
    { t: "11:00", m: 660, side: "itilaf", place: "cimenlik", title: "Queen Elizabeth’in ilk 381 mm’lik salvosu", text: "14.000 m’den Kilitbahir ve Çimenlik istikametine ilk dev mermiler. 11.05’te Lord Nelson, Agamemnon ve Inflexible katılır." },
    { t: "11:00", m: 660, side: "turk", place: "dardanos", title: "Seyyar bataryalara serbest atış", text: "Cevat Bey seyyar obüsler ve Dardanos’a izin verir; ağır merkez tabyaları menzil için bekletilir." },
    { t: "11:30", m: 690, side: "turk", place: "mesudiye", title: "İlk Türk karşılığı", text: "Ağır tabyalar henüz menzil dışındadır. Dardanos, Mesudiye, Şevket ve seyyar obüsler sürpriz atışlara başlar." },
    { t: "11:35", m: 695, side: "itilaf", place: null, title: "Agamemnon ve Inflexible isabet alır", text: "Şarapnel ve HE mermileri güvertelere isabet eder; telsiz antenleri ve gözetleme kuleleri hasar görür." },
    { t: "12:00", m: 720, side: "itilaf", place: null, title: "Fransız B Hattı hücum emri", text: "De Robeck, tabyaların yeterince yıpratıldığını düşünerek Guépratte’a ileri sürme emri verir. 12.06’da Fransızlar ön safa çıkar." },
    { t: "12:00", m: 720, side: "turk", place: "anadolu-hamidiye", title: "Ağır tabyalara ateş", text: "Fransızlar 9.000 m’ye sokulunca Cevat Bey Hamidiye, Mecidiye ve Namazgâh’a tam güçle ateş emri verir." },
    { t: "12:20", m: 740, side: "both", place: "anadolu-hamidiye", title: "Göğüs göğüse düello", text: "Hamidiye, Mecidiye, Dardanos ve Namazgâh tüm namlularla ateşler. Suffren 14 isabet alır; Gaulois su almaya başlar." },
    { t: "13:45", m: 825, side: "itilaf", place: null, title: "Saf değişimi", text: "Hasarlı Fransız hattı geri çekilir; Ocean, Irresistible, Albion, Vengeance, Swiftsure, Majestic ön safa geçecektir." },
    { t: "13:54", m: 834, side: "both", place: "bouvet", title: "Bouvet mayına çarpar", text: "Bouvet mayına çarparak batar. AWM koleksiyon açıklaması 13:54 saatini verir; özgün raporla karşılaştırma açık. Kesin batış süresi ve zayiat sayıları doğrulanmadı." },
    { t: "14:14", m: 854, side: "itilaf", place: "inflexible", title: "Inflexible mayınlanır", text: "Inflexible ağır hasar alarak Boğaz’dan çıkar. Bu kayıttaki 14:14 saati belgeyle doğrulanmadı; bildirim saatiyle karşılaştırma ve zayiat incelemesi açık. Ayrıntı 18 Mart kaynak notundadır." },
    { t: "14:35", m: 875, side: "itilaf", place: "tavsan", title: "Gaulois karaya oturtulur", text: "Baş bodoslamadaki yırtık nedeniyle Tavşan Adası’na baştan kara ettirilir." },
    { t: "14:45", m: 885, side: "turk", place: "mecidiye", title: "Cevat Bey sahaya iner", text: "Mecidiye irtibatı kesilince at sırtında Mecidiye ve Namazgâh’a gider. Selahattin Adil karargâhı ayakta tutar." },
    { t: "15:15", m: 915, side: "turk", place: "mecidiye", title: "Seyit Onbaşı ve elle yükleme", text: "Vinçler enkaz altında. Seyit Onbaşı ve Niğdeli Ali mermileri elle yükler. Dönüm noktası: tabyalar susturulamaz." },
    { t: "16:11", m: 971, side: "itilaf", place: "irresistible", title: "Irresistible mayına çarpar", text: "Makineler durur, 7° yatar, akıntıda sürüklenir. Dardanos ve Hamidiye sabit hedefe yüklenir." },
    { t: "16:32", m: 992, side: "itilaf", place: "irresistible", title: "Wear tahliyesi", text: "Yoğun ateş altında ~600 kişi tahliye edilir. Ocean yedekleme halatı bağlayamaz." },
    { t: "16:45", m: 1005, side: "itilaf", place: "ocean", title: "Ocean mayına çarpar", text: "Ocean için mayın isabeti anlatıları farklı kesinliktedir. Bu kaydın 16:45 saati, hasar mekanizması ve tahliye ayrıntıları belgeyle doğrulanmadı. Kaynak karşılaştırması 18 Mart sayfasındadır." },
    { t: "17:00", m: 1020, side: "both", place: "mustahkem-hq", title: "Signal No. 12 — genel çekilme", text: "De Robeck Queen Elizabeth’ten çekilme flaması çeker. Cevat Bey kaçışı tespit eder; Dardanos’tan Hasan Hulusi son durumu rapor eder." },
    { t: "17:15", m: 1035, side: "turk", place: "dardanos", title: "Dardanos rasat yeri şehit düşer", text: "Çekilen bir zırhlıdan 30,5 cm’lik mermi gözetleme/telefon mevkiine isabet eder. Hasan Hulusi, Mehmet Mevsuf, İsmet ve Feyzi şehit. Yüzbaşı Muhittin ateşi sürdürür." },
    { t: "17:45", m: 1065, side: "both", place: "seddulbahir", title: "Filo Ege’ye çıkar", text: "Queen Elizabeth liderliğindeki filo Seddülbahir–Kumkale gerisine ulaşır. Türk bataryaları taciz atışını menzil bitene kadar sürdürür." },
    { t: "18:00", m: 1080, side: "turk", place: "mustahkem-hq", title: "Ateş kes", text: "Son taciz atışları biter. 7 saatlik bombardıman yerini duman ve sessizliğe bırakır." },
    { t: "18:15", m: 1095, side: "turk", place: "mustahkem-hq", title: "Zafer raporu", text: "Cevat Bey Enver Paşa’ya telgraf çeker: 3 büyük zırhlı batırıldı, çok sayıda gemi ağır hasarlı, Boğaz geçilemedi." },
    { t: "19:30", m: 1170, side: "itilaf", place: "irresistible", title: "Irresistible batar", text: "Terk edilen zırhlı karanlıkta batar. Gece torpidolama planına gerek kalmaz." },
    { t: "22:30", m: 1350, side: "itilaf", place: "ocean", title: "Ocean batar", text: "Ocean’ın 18 Mart’ta batışı kaynak notunda ele alınır. Bu kaydın 22:30 saati özgün gemi raporuyla kesinleştirilmedi; gece arama ve tespit anlatısı için belge incelemesi açık." }
  ],

  units: [
    { name: "Çanakkale Müstahkem Mevkii", cmd: "Miralay Cevat Bey (Çobanlı); Kurmay: Yarbay Selahattin Adil Bey", n: "~18.000–20.000", area: "Her iki yaka tabyaları, seyyar bataryalar, mayın ve projektörler", place: "mustahkem-hq" },
    { name: "3. Kolordu", cmd: "Mirliva Esat Paşa (Bülkat)", n: "~50.000–55.000", area: "Boğaz çevresi, Gelibolu, Saros’tan Anadolu kıyısına", place: "kolordu-3" },
    { name: "19. Tümen (ihtiyat)", cmd: "Yarbay Mustafa Kemal", n: "~12.000–14.000", area: "Maydos, Seddülbahir gerisi, Kilitbahir geçişi", place: "tumen-19" },
    { name: "9. Tümen", cmd: "Miralay Halil Sami Bey", n: "~12.000–13.000", area: "Seddülbahir, Alçıtepe, Krithia ve güney kıyı", place: "tumen-9" },
    { name: "7. Tümen", cmd: "Miralay Remzi Bey", n: "~11.000–12.000", area: "Saros kıyıları ve Bolayır Kıstağı", place: "tumen-7" },
    { name: "11. Tümen", cmd: "Miralay Rafet Bey", n: "~11.000–12.000", area: "Kumkale, Erenköy, Yeniköy, Beşige", place: "tumen-11" },
    { name: "Mayın ve Deniz Savunma", cmd: "Binbaşı Nazmi Bey; Nusret: Yzb. Tophaneli Hakkı", n: "~400–500", area: "11 enlemesine hat + Erenköy gizli hattı", place: "nusret" }
  ],

  ships: [
    { n: 1, name: "HMS Queen Elizabeth", flag: "Britanya", cls: "Süper-dretnot", armor: "330 mm", guns: "8×381 mm", fate: "Sancak gemisi; çekilmeyi yönetti" },
    { n: 2, name: "HMS Inflexible", flag: "Britanya", cls: "Muharebe kruvazörü", armor: "178 mm", guns: "8×305 mm", fate: "Ağır hasarla çekildi; saat ve zayiat incelemede" },
    { n: 3, name: "HMS Lord Nelson", flag: "Britanya", cls: "Yarı-dretnot", armor: "305 mm", guns: "4×305 + 10×234 mm", fate: "Hat’ta kaldı" },
    { n: 4, name: "HMS Agamemnon", flag: "Britanya", cls: "Yarı-dretnot", armor: "305 mm", guns: "4×305 + 10×234 mm", fate: "Güverte ve telsiz hasarı" },
    { n: 5, name: "HMS Irresistible", flag: "Britanya", cls: "Ön-dretnot", armor: "229 mm", guns: "4×305 + 12×152 mm", fate: "16.11 mayın; ~19.30 battı" },
    { n: 6, name: "HMS Ocean", flag: "Britanya", cls: "Ön-dretnot", armor: "152 mm", guns: "4×305 + 12×152 mm", fate: "18 Mart’ta battı; isabet ve batış saatleri incelemede" },
    { n: 7, name: "HMS Albion", flag: "Britanya", cls: "Ön-dretnot", armor: "152 mm", guns: "4×305 + 12×152 mm", fate: "Ön hatta dövüştü" },
    { n: 8, name: "HMS Vengeance", flag: "Britanya", cls: "Ön-dretnot", armor: "152 mm", guns: "4×305 + 12×152 mm", fate: "C / ön hat" },
    { n: 9, name: "HMS Canopus", flag: "Britanya", cls: "Ön-dretnot", armor: "152 mm", guns: "4×305 + 12×152 mm", fate: "Destek" },
    { n: 10, name: "HMS Swiftsure", flag: "Britanya", cls: "Ön-dretnot", armor: "178 mm", guns: "4×254 + 14×190 mm", fate: "3. filo" },
    { n: 11, name: "HMS Triumph", flag: "Britanya", cls: "Ön-dretnot", armor: "178 mm", guns: "4×254 + 14×190 mm", fate: "Kanat / seyyar obüs baskısı" },
    { n: 12, name: "HMS Majestic", flag: "Britanya", cls: "Ön-dretnot", armor: "229 mm", guns: "4×305 + 12×152 mm", fate: "C Hattı" },
    { n: 13, name: "HMS Prince George", flag: "Britanya", cls: "Ön-dretnot", armor: "229 mm", guns: "4×305 + 12×152 mm", fate: "Kanat koruma" },
    { n: 14, name: "HMS Cornwallis", flag: "Britanya", cls: "Ön-dretnot", armor: "178 mm", guns: "4×305 + 12×152 mm", fate: "Destek" },
    { n: 15, name: "Suffren", flag: "Fransa", cls: "Ön-dretnot", armor: "300 mm", guns: "4×305 + 10×164 mm", fate: "14 direkt isabet; yangın" },
    { n: 16, name: "Bouvet", flag: "Fransa", cls: "Ön-dretnot", armor: "400 mm", guns: "2×305 + 2×274 mm", fate: "18 Mart’ta battı; saat ve zayiat incelemede" },
    { n: 17, name: "Gaulois", flag: "Fransa", cls: "Ön-dretnot", armor: "370 mm", guns: "4×305 + 10×138 mm", fate: "Tavşan Adası’na oturtuldu" },
    { n: 18, name: "Charlemagne", flag: "Fransa", cls: "Ön-dretnot", armor: "370 mm", guns: "4×305 + 10×138 mm", fate: "B Hattı, çekildi" }
  ],

  support: [
    { name: "Korumalı kruvazörler", detail: "HMS Dublin, Dartmouth, Amethyst, Sapphire; Fransız Henri IV" },
    { name: "Muhripler", detail: "16 İngiliz ve Fransız muhribi (Wear, Colne, Jed, Chelmer vb.) — tarama koruması, perdeleme, tahliye" },
    { name: "Mayın tarama", detail: "Kuzey Denizi trol teknelerinden dönüştürülmüş ~20–25 silahlı trawler" },
    { name: "Deniz uçağı", detail: "HMS Ark Royal — keşif ve atış tanzimi; gizli hattı göremedi" }
  ],

  ammo: [
    { k: "Toplam namlu", tr: "~170–190 (sabit + seyyar)", al: "~270–300 (18 zırhlının ana/ikincil)" },
    { k: "Ağır kalibre", tr: "~80 (210–355 mm Krupp)", al: "~70 (305–381 mm deniz topu)" },
    { k: "Orta / hafif", tr: "~100 (120–150 mm obüs ve sahra)", al: "~200 (102–234 mm seri)" },
    { k: "Menzil", tr: "Krupp 11–14 km; seyyar 6–8 km", al: "Queen Elizabeth 20+ km; diğer 13–16 km" },
    { k: "Ateş hızı", tr: "Düşük–orta; el doldurma, vinç", al: "Yüksek; hidrolik taret, asansör" },
    { k: "Stok", tr: "Kritik; gün sonunda 2–3 salvo", al: "Ambarlar dolu; ikmal sorunu yok" },
    { k: "Mayın", tr: "~400 (10 enlemesine + 26 paralel)", al: "Zayıf trol taraması, ters akıntı" }
  ],

  spend: {
    alliedDay: "3.000–3.500 (ağır + orta)",
    alliedMonth: "19 Şubat–18 Mart toplamı 20.000+",
    turkDay: "2.000–2.200 (ağır ~800, seyyar ~1.200–1.400)",
    hitsOnForts: "Doğrudan tabya sahasına ~400–500 isabet (%15’ten az)",
    why: "Toprak bonetler HE etkisini emdi. Duman, toz ve şarapnel atış tanzimini bozdu."
  },

  fortHits: [
    { name: "Rumeli Mecidiye", loc: "Kilitbahir", n: "80–100", d: "Kışla yıkıldı, vinçler çöktü, personel zayiatı en yüksek" },
    { name: "Dardanos", loc: "Erenköy açığı", n: "60–80", d: "Siper ve komuta yeri yerle bir; Hasan ve Mevsuf şehit" },
    { name: "Anadolu Hamidiye", loc: "Çanakkale", n: "40–50", d: "2 top geçici devre dışı; cephanelik infilakı" },
    { name: "Namazgâh", loc: "Kilitbahir", n: "40–50", d: "Bonetler dayandı; 1 top hasarlı" },
    { name: "Çimenlik", loc: "Çanakkale", n: "30–40", d: "Sur ve avlu; patlamamış 355 mm mermi duvarda" },
    { name: "Rumeli Hamidiye", loc: "Kilitbahir güneyi", n: "25–30", d: "Siper hasarı; toplar ateşe devam" },
    { name: "Mesudiye / Yıldız / Baykuş", loc: "Her iki yaka", n: "20–30’ar", d: "Çevre isabetleri; mevziler toparlandı" }
  ],

  dardanosPeople: {
    cmd: [
      { r: "Grup / tabur komutanı", n: "Yüzbaşı (veya Binbaşı) Rodoslu Mithat Bey" },
      { r: "Batarya komutanı", n: "Üsteğmen Kilitbahirli Hasan Hulusi Efendi — 18 Mart şehit" },
      { r: "Rasat zabiti", n: "Teğmen Trablusgarplı Mehmet Mevsuf Efendi — 18 Mart şehit" },
      { r: "Telefon / irtibat", n: "İhtiyat Zâbiti Abdülkadir Kemali Efendi (Öğütçü)" },
      { r: "Batarya zabiti", n: "Mülâzım Tevfik Efendi (yaralı); İhtiyat Mülâzımı İrfan Efendi" },
      { r: "Komutayı devralan", n: "Yüzbaşı Muhittin Bey" }
    ],
    fallen: [
      "Telefon Çavuşu İsmet (İsmail) Efendi — İstanbul",
      "Telefon Çavuşu Feyzi Çavuş — İstanbul",
      "Top Çavuşu Mustafa Çavuş (Dursun oğlu) — İnebolu / Kastamonu",
      "Onbaşı Halil İbrahim — Balıkesir / Bigadiç",
      "Er Halil oğlu Ali — Çanakkale / Ezine",
      "Er Mehmet oğlu Hasan — Bursa / İnegöl",
      "Er İsmail oğlu Ahmet — Kastamonu / Cide",
      "Er Halil oğlu Mustafa — Balıkesir / Havran",
      "Er Hüseyin oğlu Ahmet — Konya / Bozkır",
      "Er Mehmet oğlu Abdullah — Manisa / Kırkağaç",
      "Er Recep oğlu Mustafa — Çanakkale / Biga"
    ]
  },

  commanders: [
    { name: "Cevat Bey (Çobanlı)", role: "Müstahkem Mevkii Komutanı", body: "Ateş disiplinini dayattı, Bouvet batışını gözetleme yerinden izledi, Mecidiye krizine atla indi, akşam Enver Paşa’ya zafer telgrafını çekti." },
    { name: "Selahattin Adil Bey", role: "Kurmay Başkanı", body: "Telefon ağını ayakta tuttu, seyyar batarya tanzimini yönetti, Cevat sahadayken karargâhı kesti, resmi harp raporunu kaleme aldı." },
    { name: "Guido von Usedom", role: "Boğazlar Genel Müfettişi", body: "Alman heyetini denetledi, telemetre kalibrasyonunu teyit etti, İstanbul’a ve Liman von Sanders’a teknik raporu yazdı." },
    { name: "Johannes Merten", role: "Tahkimat / ağır topçu danışmanı", body: "Anadolu Hamidiye’de 355 ve 240 mm Krupp atışını idare etti; Suffren ve Gaulois isabetlerinde, ardından Irresistible–Ocean bombardımanında rol aldı." },
    { name: "John de Robeck", role: "Müttefik filolar komutanı", body: "Üç hatlı taarruzu yönetti. Bouvet şokuna rağmen C Hattı’nı sürdü; 17.00’de Signal No. 12 ile çekildi." },
    { name: "Émile Guépratte", role: "Fransız filosu", body: "B Hattı’nı 9.000 m’ye soktu; Suffren ağır hasar, Bouvet battı, Gaulois karaya oturtuldu." }
  ]
};
