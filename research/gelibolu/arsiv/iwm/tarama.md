# IWM taraması

Tarih: 15 Ekim 2026. Bu, aynı günkü katalog denemesinin yeniden bakışıdır. Imperial War Museums koleksiyonu taranmış değildir. Görseller repoya konmadı. `iddia_dogrulandi` ve `belge_acildi` verilmedi. Koordinat yazılmadı.

## Sayılar

| Sonuç | Adet |
| --- | --- |
| Yeniden denenen bilinen adres | 6 |
| HTTP 200, fişi açılan | 30 |
| HTTP 404, geçmiş sayılmayan | 2 (IWM-001, IWM-002) |
| Künye açık, kitap metni kapalı | 3 |
| Film künyesi okundu, film oynatılmadı | 1 |

Bilinen altı adresten dördü açıldı (IWM-003, IWM-004, IWM-005, IWM-006). Ek aramadan 26 fiş açıldı. 30, bu ikisinin toplamıdır.

## Alanlar sayfadan ne kadar doldu

Açılan 30 fiş üzerinden:

- Birlik veya gemi adı: 26 fiş. Bunun 20'sinde gemi, tümen, alay veya tabur adı var. 6'sında yalnız ordu veya donanma etiketi var. 4 fişte birlik adı yok.
- Komutan adı ve sayfadaki görev: 4 fiş. Hayat cümlesi 2 fişte (Houchemi; Irvine için yalnızca "killed on 27 April"). Sanatçı ve fotoğrafçı komutan sayılmadı.
- Muharebe: başlık veya tanımda gün, saat ya da ay aralığı ile birlikte bir hareket yazan 13 fiş. Biri Falkland 1914 fotoğrafıdır, Gelibolu dışıdır. Yalnız üretim tarihi, yalnız yıl veya yalnız "Gallipoli 1915-1916" etiketi bu 13'e konmadı.
- Kayıp tamsayısı: 0. HU 103301 "over 600 of her crew" yazar; tek sayı değildir ve doğrulanmış zayiat sayılmaz. Diğer 29 fişte sayı `null` ve "bu turda okunmadı".

Q 112876 künyesi Major Irvine'in 27 Nisan'da öldüğünü ve Sapper Reynolds için "the first to fall" der. Toplam sayı yoktur. ART 2452 kumda bir ceset tasvir eder; bu da sayı değildir.

## Bilinen adresler

IWM-001 `object/205248958` ve IWM-002 `object/205248554` yine HTTP 404. "Q 13823" araması 17 kayıt getirdi, katalog numarası tam Q 13823 olan satır yok. "Q 13339" araması 16 kayıt getirdi, tam numara yok. Yakın numaralar açılmadı. İkisi `insan_incelemesi_gerekli` kaldı ve geçmiş sayılmadı.

IWM-003 açıldı. Başlık "A Party of Wounded, May 1915". Katalog numarası sayfada Art.IWM ART 4323. Tanım: yaralı askerler gemide, güverte altında. HMS Manica, RNAS, RNVR, British Army ve Australian Army ilişkili. Komutan yok. Kayıp sayısı yok. Lisans: IWM Non-Commercial Licence, atıf © The rights holder. Durum: `metadata_kontrol_edildi`.

IWM-004 açıldı. HU 103302. Tanım: HMS Agamemnon'un 9.2 inç topları Gelibolu yarımadasına ateş ediyor. Yer: Dardanelles straits. Gün ve kayıp sayısı yok. Atıf: Image: IWM (HU 103302). Durum: `metadata_kontrol_edildi`.

IWM-005 açıldı. LBY 14434. Liman von Sanders ve E. H. Schulz, The Engineer School, Fort Humphreys, Virginia, 1931. 58 sayfa. Sayfa "This media is not currently available online" der. Metin açılmadı. Sanders sayfada Author'dur; komuta görevi veya hayat yazmaz. Durum: `insan_incelemesi_gerekli`.

IWM-006 açıldı. LBY 12 / 1623. Wesley Olson, University of Western Australia Press, Crawley, 2006. xix, 396 sayfa. Medya çevrimiçi değil. İlişkili ad: Anzac. Durum: `insan_incelemesi_gerekli`.

## Anahtarlar

Sayım, arama sayfasının kendi "Showing" satırıdır. İlk dilimin ötesi açılmadı.

| Anahtar | Sayım | Açılan |
| --- | --- | --- |
| Gallipoli 1915 | 1-30 / 1934 | Q 50483, SP 682A, Q 112876 |
| Dardanelles | 1-30 / 1384 | Q 102523, ART 2453, LBY 12520 |
| Cape Helles | 1-30 / 276 | ART 4328, ART 1927, Q 68351 |
| Suvla | 1-30 / 223 | ART 2452, ART 2326, Q 67944 |
| Anzac | 1-30 / 487 | ART 4276, Q 97341, ART 269 |
| Ottoman Army | 1-30 / 1517 | Q 67944, UNI 12391, IWM 1062-02a |
| naval operations | 1-30 / 5499 | Süzmesiz ilk 30 Kore ve 1955. Açılmadı. |
| Bouvet | 1-8 / 8 | Q 22256, HU 103301, SP 682A |
| Irresistible | 1-27 / 27 | Q 21399, Q 74909, Q 75252 |
| Ocean | 1-30 / 2885 | Süzmesiz ilk 30, 1952 uçak gemisi. Açılmadı. |

"naval operations" anahtarına Birinci Dünya Savaşı süzgeci konunca sayım 1-30 / 915 oldu. Bu dilimden Q 109141 ve Q 109146 açıldı. Q 102523 aynı başlıkla Dardanelles aramasında da duruyordu.

"Ocean" anahtarına aynı süzgeç konunca sayım 1-30 / 293 oldu. Q 74918 "Battleship HMS Ocean" açıldı. Q 50992 de açıldı; sayfa von Spee filosunu ve 8 Aralık 1914 Falkland muharebesini yazar, HMS Ocean veya Gelibolu yazmaz.

Anzac ilk sayfasındaki 1953 Tobruk ve HMAS Sydney başlıkları açılmadı. Ottoman Army ilk sayfasındaki Sina, Filistin, fünye ve sözlü tarih başlıkları açılmadı.

## Açılan fişlerden okunanlar

Yer adları sayfadaki gibidir. "Edirne Vilayet" ibaresi düzeltimedi.

- Q 50483, Graham C N (Lt), üretim 1915-04-25. İngiliz savaş ve nakliye gemileri Cape Helles açıklarında. Tek gemi adı yok.
- SP 682A, üretim 1915-03-18. Fransız zırhlısı Bouvet mayından sonra batıyor. Kayıp sayısı yok. Surgeon Parkes gemi portreleri.
- Q 112876, Joyner, 25 Nisan 1915 saat 8, Anzac Cove. 4th Battalion, 26th (Jacob's) Indian Mountain Battery, 1st Infantry Brigade. Colonel H N MacLaurin, Major F D Irvine, Captain D M King (Orderly Officer), Lieutenant R G Hamilton (Brigade Signal Officer). Irvine için "killed on 27 April". Sapper R Reynolds için "the first to fall during the war".
- Q 102523, Crookshank, üretim 1915-03-18. Agamemnon'un fore topundan, Prince George'a üç mermilik salvo; biri doğrudan isabet. Başlık February-March 1915. Üç mermi kayıp sayısı değildir.
- ART 2453, Wilkinson. Balon gemisi Hector, Dardanelles kıyısı açığı, 1915. İlişkili satır ayrıca "HMS Hector, Armed Merchant Cruiser, (1924)" der. İkisi de sayfada bırakıldı.
- LBY 12520, Ellis Ashmead-Bartlett, Hutchinson, London. Tanım: "Presented by the author, dated 1928". 287 sayfa. Metin okunmadı. `insan_incelemesi_gerekli`.
- ART 4328. HMS Swiftsure, Cape Helles ve V Beach, 17 Mayıs 1915, 15.10. Türk karşılığı diye suda birkaç düşüş. İlişkili satırda HMS Thankerton, 1955, de var; 1915 birliği sayılmadı.
- ART 1927. British Army, 29th Division. Gully Ravine, Cape Helles. Gün yok.
- Q 68351. British Army kampları, V Beach, Cape Helles çıkarmaları, Nisan 1915.
- ART 2452. 7 Ağustos 1915, C Beach, Suvla Bay. British Army, 10th Division. İlişkili ad: Battle of the Landing at Suvla. Açıkta bir destroyer, adı yok. Kumda bir ceset tasviri var, sayı yok.
- ART 2326. 21 Ağustos 1915, Salt Lake, Suvla Bay. British Army, 2nd Mounted Division. Battle of Scimitar Hill 1915. Ağır ateş; sayı yok.
- Q 67944, üretim 1915-12-19. "Suvla Bay evacuation order. Orders given to Lieutenant Flower". Emir metni dökülmedi. British Army ve Ottoman Army etiketi var. Bu fotoğraf fişidir.
- ART 4276. Landing at Anzac Cove, 25 Nisan 1915, 17.15. ANZAC piyadesi taşıyan nakliye, savaş gemileri ve mavnalar. HMS Manica ilişkili listededir.
- Q 97341. Ari Burnu Cemetery, dört ahşap mezar işareti. Birlik, komutan ve kayıp sayısı yok. Dört işaret toplam zayiat değildir.
- ART 269. Başlık: Suvla Bay, Samothrace, Barking Gully, ANZAC. Başka tarif yok.
- UNI 12391. Muzalim-l-Sani (Second Lieutenant) Abedine Houchemi, 2nd Turkish Infantry Regiment. Sayfa: alay İngiliz çıkarmaları sırasında Gelibolu Yarımadası'nda bulundu, sonra Suriye'ye gitti; Houchemi firar etti ve İtilaf birliklerine teslim oldu.
- IWM 1062-02a. 1915, Osmanlı ordusu geçidi, "probably not far from Constantinople". 77 mm toplar, Alman çavuşlar. "about a division in size" kuvvet tahminidir, kayıp değildir. Film oynatılmadı. Gelibolu diye yazmıyor.
- Q 109141. February-March 1915. The Graphic resmi: Fransız-İngiliz filosu Dardanelles tabyalarını bombalıyor. Gemi adı yok.
- Q 109146. HMS Queen Elizabeth, Dardanelles, aynı ay aralığı.
- Q 21399. Sayfa hem IRRESISTIBLE hem IRRESISTABLE yazar. "Mined and then sunk by Turkish guns in the Dardanelles, 18 March 1915." Fotoğraf üretim tarihi 1914. Mürettebat sayısı yok.
- Q 74909 ve Q 75252. Yalnız "Battleship HMS Irresistible". Yer, batış ve tarih yok. Örgüt etiketindeki "(1898)" muharebe tarihi sayılmadı.
- Q 22256. Bouvet, c.1900, seyir halinde. Bu sayfada batış yok.
- HU 103301. 18 Mart 1915. Bouvet sağ kalanları Agamemnon'a çıkıyor. "struck a Turkish mine and sank with the loss of over 600 of her crew."
- Q 74918. Yalnız "Battleship HMS Ocean". Hasar, batış, yer ve tarih yok.

Bouvet, Irresistible ve Ocean fişleri yan yana konup batış sırası çıkarılmadı. Aynı cümle bir fotoğrafta varken öbüründe yoktur.

## Lisans

Non-Commercial Licence yazan sayfalarda düşük çözünürlük, özel ve ticari olmayan kullanım içindir. Atıf ya "Image: IWM (...)" ya da "© The rights holder" biçimindedir. Dosya kopyalanmadı. IWM-005 ve IWM-006 medyası çevrimiçi olmadığı için görsel lisansı da okunmadı.

## Taranmayan boşluk

1934, 1384, 5499, 2885 ve 1517 gibi sayımların ilk sayfasından sonrası yok. Irresistible'da 24 başlık, Bouvet'de 5 başlık açılmadı. Ocean'ın 1915 batış künyesi bulunamadı. Q 13823 ve Q 13339 yerine kayıt konmadı. Üç kitabın metni, Q 67944 emrinin metni ve IWM 1062-02a filmi açılmadı. Özel evrak, harp ceridesi, Inflexible ve Gaulois bu turda aranmadı. Aynı günün devam turu bunları ayrıca aradı: `research/gelibolu/arsiv/devam/`. O tur da görseli ve mektubu açmadı.
