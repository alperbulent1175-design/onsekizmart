"""Elle okunan kaynakların yayın notlarını üretir; ağ/scraper/katalog işlemi yapmaz."""
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[2]
DATE = '2026-10-17'
SOURCES = {}
REVIEWS = []

def source(key, title, url, evidence, scope, kind='Kurum metni okundu; özgün harp belgesiyle karşılaştırma açık'):
    SOURCES[key] = dict(id=key, title=title, url=url, evidence=evidence, scope=scope, reviewed=DATE, status=kind)

source('dva-timeline', 'DVA — Timeline of Australians and the Gallipoli Campaign',
       'https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/timeline',
       'The British submarine E15 was driven ashore by a strong current',
       '19/25 Şubat, 26 Şubat–3 Mart, 4 Mart ve 17 Nisan başlıkları okundu. Nusret tarihi ve mayın sayısı bu kronolojiden alınmadı; ilgili sayfadaki ayrı kanıtlar esas alındı.')
source('naval-reports', 'London Gazette raporlarının Naval-History.net çevrimyazısı',
       'https://www.naval-history.net/WW1Battle1503Dardanelles2.htm',
       'a demonstration in force / my Chief of Staff',
       '1 Temmuz 1915 deniz raporunun çıkarma planı Saros gösterisini; 20 Mayıs kara raporu ve deniz raporları komuta görevlerini anlatır. Çevrimyazı okundu; özgün gazete taraması karşılaştırılmadı. Aynı dosyada farklı tarihli raporlar bulunur.',
       'Birincil rapor çevrimyazısı okundu; özgün tarama karşılaştırması açık')
source('awm-may-ships', 'AWM — G00197 / C1003295, kurtulanların fotoğraf kaydı',
       'https://www.awm.gov.au/collection/C1003295',
       'Triumph sunk by U21 on 25 May 1915, and Majestic sunk by U21 on 27 May 1915',
       'Açıklamada Goliath için 13 Mayıs/Muavenet; Triumph için 25 Mayıs/U21; Majestic için 27 Mayıs/U21 verilir. Fotoğraf Mayıs 1915 tarihlidir; üç ayrı batış anının fotoğrafı değildir.',
       'Koleksiyon açıklaması okundu; gemi jurnalleriyle karşılaştırma açık')
source('awm-truce', 'AWM — H03947, ateşkeste gömme ekipleri',
       'https://www.awm.gov.au/collection/H03947',
       'Australian burial parties burying Australian and Turkish dead during the armistice.',
       'Tarih alanı 24 Mayıs 1915. Görsel açıklaması gömme faaliyetini destekler; ateşkesin bütün şartları veya saatleri için emir belgesi değildir.',
       'Fotoğraf künyesi ve açıklaması okundu; ateşkes protokolü karşılaştırması açık')
source('awm-may19', 'AWM — The landing, eğitim anlatısı',
       'https://www.awm.gov.au/learn/schools/resources/understanding-gallipoli/landing',
       'The Turks made a particularly heavy attack on 19 May',
       '19 Mayıs saldırısı ve püskürtülmesi için kullanıldı. Metnin başka biyografik ve sayısal ifadeleri bu incelemeye aktarılmadı.')
source('csa-barbaros', 'Gökhan Atmaca — Barbaros Hayreddin Zırhlısı, Çanakkale Savaşları Ansiklopedisi',
       'https://canakkalesavaslariansiklopedisi.com/barbaros-hayreddin-zirhlisi/',
       'gemi 8 Ağustos 1915’te İngiliz denizaltısı E-11 tarafından batırılmıştır.',
       'Batış tarihi ve denizaltı kimliği; Mart hareketleri ayrıca okunur. Kaynaktaki koordinat, personel ve mühimmat sayıları haritaya aktarılmadı.',
       'Araştırma maddesi okundu; atıf verdiği arşiv belgeleri tek tek açılmadı')
source('csa-kereviz1', 'Ahmet Diriker — Birinci Kerevizdere Muharebesi',
       'https://canakkalesavaslariansiklopedisi.com/birinci-kerevizdere-muharebesi/',
       '21-22 Haziran 1915 tarihinde gerçekleşen Birinci Kerevizdere',
       'Haziran aşaması için kullanıldı. Madde, aynı olayın Fransız kaynaklarında farklı sıra numarasıyla adlandırıldığını belirtir.',
       'Araştırma maddesi okundu; atıf verilen harp kayıtları karşılaştırılmadı')
source('csa-kereviz2', 'Ahmet Diriker — İkinci Kerevizdere Muharebesi',
       'https://canakkalesavaslariansiklopedisi.com/ikinci-kerevizdere-muharebesi/',
       '12 -13 Temmuz 1915 tarihinde gerçekleşen bu muharebe',
       'Temmuz aşaması, adlandırma farklılığı ve sınırlı ilerleme/Osmanlı savunmasının tutunması ayrımı için kullanıldı. Ayrıntılı siper geometrisi çıkarılmadı.',
       'Araştırma maddesi okundu; atıf verilen harp kayıtları karşılaştırılmadı')
source('ktb-1915', 'Kültür ve Turizm Bakanlığı — 1915 kronolojisi',
       'https://www.ktb.gov.tr/TR-96322/1915.html',
       'I. Anafartalar Zaferi kazanıldı. / II. Anafartalar Zaferi / Mustafa Kemal, Çanakkale Cephesi\'nden ayrıldı.',
       '8–9 Ağustos ataması, 9/10/21 Ağustos ve 10 Aralık ayrılış satırları okundu. Atama, muharebe ve cepheden ayrılış farklı kayıtlardır. Diğer tarih satırları için toplu doğrulama yapılmadı.')
source('dva-suvla', 'DVA — Landing at Suvla Bay 6 to 15 August 1915',
       'https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/august-offensive/suvla-bay',
       'British troops quickly secured the closest hills after the landing.',
       '6 Ağustos başlangıcı, Stopford ve 15 Ağustos görevden alınması; yakın tepeler ile iç kesimdeki hedefler ayrılır. Kaynak başlığının kapsamı ilk çıkarma gecesinden geniştir.')
source('dva-sari', 'DVA — Battle of Sari Bair 6 to 21 August 1915',
       'https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/august-offensive/sari-bair',
       'The New Zealanders reached the summit',
       'Sarıbayır harekâtının geniş kapsamı ile Conkbayırı kesiti aynı tarih aralığı değildir. Zirveye çıkış, el değiştirme ve sonraki karşı saldırılar ayrı değerlendirilir.')
source('dva-august', 'DVA — August Offensive on Gallipoli 6 to 29 August 1915',
       'https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/august-offensive',
       'At Lone Pine, the Australians achieved a measure of success',
       'Kanlısırt yerel sonucu, Ağustos harekâtının genel sonucundan ayrılır. Bağlantılı Lone Pine başlığı 6–10 Ağustos kapsamını kullanır; sitedeki 6–9 Ağustos aralığı kesin tek bitiş olarak sunulmaz.')
source('nam-general', 'National Army Museum — Gallipoli campaign',
       'https://www.nam.ac.uk/explore/gallipoli', '',
       'Trapped bölümü Scimitar Hill ve Hill 60 girişimlerinin başarısızlığını anlatır. İki mevkiyi aynı nokta saymak için kullanılmadı. Önceki sayfalarda bulunan kısa alıntı burada tekrarlanmadı.')
source('dva-evacuation', 'DVA — Evacuation from Gallipoli 1915',
       'https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli/evacuations-from-anzac',
       'The last party left in the early hours of 20 December from North Beach at Anzac.',
       'Arıburnu/Suvla tahliyesinin aşamaları, son gece, North Beach ve Ocak Helles çekilişi. Ekim komuta değişimi ve Monro önerisi de metinde bulunur.')
source('belleten-alkan', 'Necmettin Alkan — Alman Kaynaklarına Göre Çanakkale Savaşı ve Zaferi, Belleten 80/289 (2016)',
       'https://belleten.gov.tr/tam-metin/279/tur',
       'Albay Ali Remzi komutasındaki 7. Tümen',
       'Savunma dağılımı bölümünde Remzi/7. Tümen, Halil Sami/9. Tümen, Mustafa Kemal/19. Tümen ve Rafet/11. Tümen yer alır. Rafet kaydı tek başına Bele soyadını kanıtlamaz.',
       'Araştırma makalesi okundu; atıf verilen özgün belgeler tek tek karşılaştırılmadı')
source('csa-33', 'Çanakkale Savaşları Ansiklopedisi — 33’üncü Piyade Alayı',
       'https://canakkalesavaslariansiklopedisi.com/33uncu-piyade-alayi/',
       'Tuğgeneral Erich Weber’in komutanı olduğu 15’inci Kolorduda',
       'Anadolu yakasında 11. Tümen ve Weber/15. Kolordu bağı için kullanıldı. Birlik sayıları ile personel kimlikleri bu maddeden genişletilmedi.',
       'Araştırma maddesi okundu; atıf verilen özgün belgeler karşılaştırılmadı')
source('atam-vehip', 'Abdullah İlgazi, Mustafa Bıyıklı — Mehmet Vehip (Kaçi) Paşa’nın Çanakkale Muharebelerindeki Yeri ve Önemi, ATAM 28/82 (2012)',
       'https://atamdergi.gov.tr/tam-metin/225/tur',
       '8 Temmuz’da, yarımadaya gelerek yeni görevine başlayan Vehip Paşa',
       'Güney Grubunda Weber’den Vehip’e geçiş ve göreve başlama incelendi. Bu kayıt Ocak 1916 komutasını kendiliğinden kanıtlamaz.',
       'Araştırma makalesi okundu; aktarılan emirlerin özgün taraması karşılaştırılmadı')
source('csa-cevat', 'Selçuk Osmanoğlu — Cevat (Çobanlı) Paşa',
       'https://canakkalesavaslariansiklopedisi.com/cevat-cobanli-pasa/',
       'Miralay Cevat Bey ve Kurmay Başkanı Selahattin Adil Bey',
       'Müstahkem Mevkii ve kurmay başkanı ilişkisi, savunma planı; 29 Kasım 1914 mirliva terfisi maddede bulunur. Gün içindeki bütün saatler bu maddeyle doğrulanmış sayılmadı.',
       'Araştırma maddesi okundu; özgün özlük ve emir belgeleri karşılaştırılmadı')
source('csa-esat', 'Levent Ünal — Esad (Bülkat) Paşa',
       'https://canakkalesavaslariansiklopedisi.com/esad-bulkat-pasa/',
       'Çanakkale Cephesi’nde Esat Paşa başlangıçta 3’üncü Kolordu Komutanı',
       'Kolordu komutanlığı ve cephenin zaman içinde değişen sorumlulukları incelendi. Nisan görev dağılımı Aralık ayına otomatik taşınmadı.',
       'Araştırma maddesi okundu; özgün emirlerle karşılaştırma açık')
source('csa-halil', 'Zekeriya Türkmen — Halil Sami Bey',
       'https://canakkalesavaslariansiklopedisi.com/halil-sami-bey/',
       '9’uncu Tümen Komutanlığına Eylül 1914’de atanmıştır.',
       'Tümen görevi ve 1915 Haziranındaki görevden ayrılma süreci. Ölüm tarihi maddede kesin değildir; kesin ölüm bilgisi üretilmedi.',
       'Araştırma maddesi okundu; özlük belgesi taraması karşılaştırılmadı')
source('csa-navy', 'Çanakkale Savaşları Ansiklopedisi — Türk Donanması',
       'https://canakkalesavaslariansiklopedisi.com/turk-donanmasi/',
       'Amiral Usedom, Sahil Topçu ve Torpil Birlikleri Müfettişi',
       'Merten ve Usedom görevleri için araştırma metnindeki ifade incelendi; 18 Martta kesin gözetleme yeri veya tek tek top idaresi kanıtı değildir.',
       'Araştırma maddesi okundu; özgün arşiv belgesi karşılaştırması açık')
source('awm-birdwood', 'AWM — William Birdwood, Dawn of the Legend',
       'https://www.awm.gov.au/visit/exhibitions/dawn/legend/birdwood',
       'led the ANZAC corps on Gallipoli',
       'Kolordu komutanlığı desteklenir; her günün komuta devri ayrı belge gerektirir.')
source('awm-bridges', 'AWM — Burning Bridges',
       'https://www.awm.gov.au/wartime/50/pederson_bridge',
       'At Anzac on 15 May 1915',
       'Yazının girişinde 1. Avustralya Tümeni komutanı Bridges’in ağır yaralanması anlatılır. Yaralanma ile ölüm tarihi aynı olay değildir.')
source('nz-godley', 'Manatū Taonga / NZHistory — Alexander Godley',
       'https://nzhistory.govt.nz/media/photo/alexander-godley',
       'he was in charge of the New Zealand and Australian Division',
       '25 Nisan tümen görevi için kullanıldı; sonraki tüm aylarda aynı komuta görevinin sürdüğünü kanıtlamaz.')
source('dva-overview', 'DVA — Gallipoli Campaign 1915',
       'https://anzacportal.dva.gov.au/wars-and-missions/ww1/where-australians-served/gallipoli',
       'Led by General Aylmer Hunter-Weston, the British 29th Division',
       'Hunter-Weston/29. Tümen bağlantısı metinde bulunur. Sonraki kolordu görevi için ayrıca dönem raporları gerekir.',
       'Kurum metni okundu; özgün harp belgesiyle karşılaştırma açık')
source('french-army', 'Fransız Kara Kuvvetleri TerreMag — Les Dardanelles, 1915 : une leçon utile',
       'https://www.terremag.defense.gouv.fr/histoire/les-dardanelles-1915-une-lecon-utile',
       'commandées par le général d’Amade',
       'Fransız sefer kuvveti ve d’Amade bağlantısı; kuvvet sayıları veya ayrıntılı takvim aktarılmadı.',
       'Arama dizinindeki kurum özeti okundu; tam sayfa isteği zaman aşımına uğradı, özgün harekât belgesi açılmadı')
source('nam-gouraud', 'National Army Museum — Gallipoli campaign, Fransız kolordusu komutanı görsel açıklaması',
       'https://www.nam.ac.uk/explore/gallipoli',
       'commander of the French Corps in the Dardanelles',
       'Gouraud’nun genel görevi; başlangıç günü ve yaralanma ayrıntısı bu görsel açıklamasından çıkarılmaz.')

def review(path, refs, summary, limits, rewrite=False):
    REVIEWS.append(dict(path=path, sources=refs.split(), summary=summary, open=limits, rewrite=rewrite, reviewed=DATE,
                        status='Kısmi kaynak desteği; tüm ayrıntılar doğrulanmadı'))

E='olaylar/'
C='komutanlar/'
review(E+'dis-tabyalarin-bombardimani/', 'dva-timeline', '19 Şubat 1915’te dış tabyalara deniz bombardımanı başladı.', 'Atış saatleri, hasar miktarı ve birlik dağılımı.', True)
review(E+'giris-tabyalari-ve-kisa-cikarmalar/', 'dva-timeline', '25 Şubat bombardımanını, 26 Şubat–3 Mart tahrip çıkarmaları ve 4 Marttaki geri çekilme izledi.', 'Günlere göre birlikler ve bütün tabyaların durumu.', True)
review(E+'e15-bogazda-karaya-oturur/', 'dva-timeline', 'E15, 17 Nisan 1915’te Boğaz geçişi sırasında karaya oturdu.', 'Karaya oturma, personelin durumu ve denizaltının sonradan tahribi ayrı aşamalardır.', True)
review(E+'ariburnu-genel-taarruzu/', 'awm-may19', 'AWM anlatısında 19 Mayıs Osmanlı taarruzunun püskürtüldüğü belirtilir.', 'Bütün siperlerin 25 Nisan akşamıyla aynı kaldığı iddiası ve birliklerin günlük dağılımı doğrulanmadı.', True)
review(E+'ariburnu-gomme-ateskesi/', 'awm-truce', '24 Mayıs 1915 kaydı, ateşkeste iki tarafın ölülerinin gömülmesini belgelendirir.', 'Kesin saatler, ateşkes şartları ve bütün cephe boyunca uygulama için protokol gerekir.', True)
review(E+'goliath-batar/', 'awm-may-ships', 'Goliath’ın batışı, 13 Mayıs 1915 ve Muavenet kaydıyla ilişkilidir.', 'Batış saati, torpido sayısı ve kayıp dökümü.', True)
review(E+'triumph-batar/', 'awm-may-ships', 'Triumph’un batışı 25 Mayıs 1915’te U21 saldırısı olarak kaydedilir.', 'Kesin enkaz koordinatı ve kayıplar.', True)
review(E+'majestic-batar/', 'awm-may-ships', 'Majestic’in batışı 27 Mayıs 1915’te U21 saldırısı olarak kaydedilir.', 'Kesin enkaz koordinatı ve kayıplar.', True)
review(E+'barbaros-hayreddin-batar/', 'csa-barbaros', 'Barbaros Hayreddin, 8 Ağustos 1915’te E-11 tarafından batırıldı.', 'Mart konumu, seyir ayrıntıları ve kayıplar için özgün jurnal gerekir. Yeni enkaz noktası eklenmedi.', True)
review(E+'saros-gosterisi/', 'naval-reports', 'Çıkarma planında Bolayır yakınındaki Saros Körfezi için bir gösteri harekâtı bulunur.', 'Gösteri, kıyıya hiç kimsenin çıkmadığı anlamına gelmez; ana çıkarma ile keşif hareketleri ayrılmalıdır.', True)
review(E+'kerevizdere-muharebesi/', 'csa-kereviz1 csa-kereviz2', 'Bu sayfanın tarih kartı 12–13 Temmuz 1915 aşamasını kapsar. Kerevizdere’de 21–22 Haziran muharebesi de vardır.', 'Temmuz harekâtı ilk Kerevizdere çatışması değildir. Türk, Fransız ve İngiliz kaynaklarında adlandırmalar değişebilir.', True)
review(E+'anafartalar-suvla-cikarmasi/', 'dva-suvla', 'Suvla çıkarması 6 Ağustosta başladı. Kaynak, ilk yakın tepe kazanımlarını iç kesimdeki hedeflerden ayırır.', '6–7 Ağustos çıkarma gecesi ile 6–15 Ağustos harekât kapsamı farklıdır.', True)
review(E+'birinci-anafartalar-muharebesi/', 'ktb-1915', 'Kültür ve Turizm Bakanlığı kronolojisi Birinci Anafartalar’ı 9 Ağustos 1915’te verir.', 'Grup ataması 8–9 Ağustos kaydıdır; birlik hareketleri ve emir saatleri ayrıca incelenmelidir.', True)
review(E+'ikinci-anafartalar-muharebesi/', 'ktb-1915 nam-general', 'İkinci Anafartalar için 21 Ağustos 1915 kaydı bulunur.', 'Yusufçuk Tepe ile Bomba Tepe aynı mevki veya aynı süreli muharebe gibi birleştirilmedi.', True)
review(E+'conkbayiri-muharebesi/', 'ktb-1915 dva-sari', 'Conkbayırı zirvesine çıkış ve Osmanlı karşı taarruzu ayrı aşamalardır; kronolojide 10 Ağustos ayrı kayıttır.', '6–10 Ağustos kesiti ile daha geniş Sarıbayır harekâtının tarih kapsamı ayrılır.', True)
review(E+'kanlisirt-muharebesi/', 'dva-august', 'Kanlısırt’taki yerel İtilaf kazanımı, Ağustos harekâtının genel başarısızlığıyla aynı sonuç değildir.', 'Tarih kartı 6–9 Ağustos kullanır; bağlantılı DVA Lone Pine başlığı 6–10 Ağustos kapsamındadır. Kesin tek bitiş günü olarak sunulmaz.', True)
review(E+'ariburnu-tahliyesi/', 'dva-evacuation ktb-1915', 'Arıburnu çekilişi aşamalıydı; son birlikler 20 Aralık sabahının erken saatlerinde ayrıldı.', 'Yalnız son gece bütün tahliye süresi değildir. Aralık komuta dağılımı Nisan görevlerinden türetilmez.', True)
review(E+'anafartalar-tahliyesi/', 'dva-evacuation ktb-1915', 'Suvla tahliyesi Aralık ayında tamamlandı; Seddülbahir çekilişi Ocak ayındaki ayrı aşamadır.', 'Mustafa Kemal 10 Aralıkta cepheden ayrılmıştır; tahliye gecesinin komutanı olarak sunulmaz.', True)
review(E+'seddulbahir-tahliyesi/', 'dva-evacuation', 'Seddülbahir’deki son çekiliş 8–9 Ocak 1916 aşamasıdır.', 'Nisanda kullanılan bütün kumsalların Ocakta da tahliye noktası olduğu iddia edilmez; Ocak komuta dağılımı ayrıca belgelenmelidir.', True)

commander_data = [
('albert-damade','naval-reports','d’Amade, Çanakkale’ye gönderilen Fransız sefer kuvvetiyle ilişkilidir.'),
('alexander-godley','nz-godley','Godley, çıkarma sırasında Yeni Zelanda ve Avustralya Tümeni komutanıdır.'),
('aylmer-hunter-weston','dva-overview naval-reports','Hunter-Weston, çıkarma aşamasında 29. Tümen komutanıdır.'),
('cevat-bey-cobanli','csa-cevat','Cevat Paşa’nın görevi Çanakkale Müstahkem Mevkii komutanlığıdır.'),
('charles-monro','dva-evacuation','Monro, Hamilton’dan sonra komutayı aldı ve tahliyeyi önerdi.'),
('emile-guepratte','naval-reports','Guépratte, Fransız deniz filosunun komutanı olarak raporda geçer.'),
('esat-pasa-bulkat','csa-esat','Esat Paşa’nın Çanakkale görevi başlangıçta 3. Kolordu komutanlığıdır.'),
('frederick-stopford','dva-suvla','Stopford, Suvla harekâtını komuta etti; kaynak 15 Ağustosta görevden alındığını belirtir.'),
('guido-von-usedom','csa-navy','Usedom’un görevi sahil topçu ve torpil birlikleri müfettişliği olarak aktarılır.'),
('halil-sami-bey','csa-halil','Halil Sami Bey, 9. Tümen komutanı olarak görev yaptı.'),
('henri-gouraud','nam-gouraud','Gouraud, Çanakkale’deki Fransız kolordusunun komutanıdır.'),
('ian-hamilton','nam-general dva-evacuation','Hamilton, kara harekâtının komutanıdır. 18 Mart deniz muharebesinin komutanı değildir.'),
('johannes-merten','csa-navy','Merten, Başkomutanlığın Çanakkale temsilcisi olarak aktarılır.'),
('john-de-robeck','naval-reports','De Robeck’in deniz komutanlığı dönem raporlarında görülür.'),
('liman-von-sanders','belleten-alkan','Liman von Sanders, Beşinci Ordu savunma düzeninin başındadır.'),
('mustafa-kemal','ktb-1915 belleten-alkan','Mustafa Kemal’in 19. Tümen ve Anafartalar Grubu görevleri farklı aşamalardır.'),
('rafet-bey-bele','belleten-alkan csa-33','Kaynaklarda 11. Tümen komutanı Rafet Bey adı geçer; Bele soyadıyla kimlik eşleştirmesi bu kayıtlardan kurulamaz.'),
('remzi-bey','belleten-alkan','Makalede Ali Remzi Bey, 7. Tümen komutanı olarak anılır.'),
('roger-keyes','naval-reports','Keyes, deniz komutanının kurmay başkanı olarak raporlarda geçer.'),
('sackville-carden','naval-reports','Carden’ın raporu Şubat–Mart deniz harekâtını anlatır.'),
('selahattin-adil-bey','csa-cevat','Selahattin Adil Bey, Müstahkem Mevkii kurmay başkanı olarak anılır.'),
('vehip-pasa-kaci','atam-vehip','Vehip Paşa’nın Güney Grubu görevi Temmuzda başlar; makale 8 Temmuzda göreve başlamayı aktarır.'),
('weber-pasa','csa-33 atam-vehip','Weber’in Anadolu yakasındaki kolordu görevi ile sonraki Güney Grubu görevi ayrı aşamalardır.'),
('william-birdwood','awm-birdwood','Birdwood, Gelibolu’da ANZAK Kolordusunu komuta etti.'),
('william-bridges','awm-bridges','Bridges, 1. Avustralya Tümeni komutanıydı; 15 Mayısta ağır yaralandı.'),
]
for slug, refs, summary in commander_data:
    review(C+slug+'/', refs, summary, 'Doğum/ölüm alanları, görevlerin kesin başlangıç ve bitiş günleri ile günlük hareketler bu notla topluca doğrulanmış sayılmaz.')

review('donanma/', 'naval-reports awm-may-ships csa-barbaros', '18 Mart kayıpları ile sonraki aylardaki gemi batışları ayrı olaylar olarak incelenir.', 'Zırh, top donanımı, isabet, cephane ve zayiat değerlerinin her biri ayrı teknik kayıt gerektirir.')
review('sozluk/', 'dva-august', 'Terimler, sitedeki kullanım bağlamını açıklamak içindir.', 'Birlik büyüklükleri sabit personel sayısı değildir. Gerçek mevcut, muharip mevcut ve kuruluş kadrosu ayrı kavramlardır.')

def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding='utf-8', newline='\r\n')

def esc(s):
    return html.escape(s, quote=True)

def main():
    # Önceki anlatıyı yayın dışındaki çalışma notunda sakla; ham arşive dokunma.
    previous = ROOT/'research/ux-audit/content-review-before.json'
    if not previous.exists():
        write(previous, json.dumps({r['path']: (ROOT/r['path']/'index.html').read_text(encoding='utf-8') for r in REVIEWS}, ensure_ascii=False, indent=2))
    for r in REVIEWS:
        p = ROOT/r['path']/'index.html'
        s = p.read_text(encoding='utf-8')
        ident = r['path'].strip('/').replace('/', '-')
        note = '<section class="content-review prose" aria-labelledby="inceleme-baslik">\n<h2 id="inceleme-baslik">Kaynak incelemesi</h2>\n'
        note += '<p><strong>17 Ekim 2026 · Kısmi kaynak desteği</strong></p>\n'
        note += '<p>'+esc(r['summary'])+'</p>\n<ul>\n'
        for key in r['sources']:
            src = SOURCES[key]
            note += '<li><a href="'+esc(src['url'])+'">'+esc(src['title'])+'</a> · <a href="/inceleme-notlari/#'+key+'">Kanıt metni ve inceleme sınırı</a></li>\n'
        note += '</ul>\n<p><strong>Açık kalanlar:</strong> '+esc(r['open'])+'</p>\n</section>\n'
        if 'class="content-review prose"' in s:
            s=re.sub(r'<section class="content-review prose".*?</section>\s*', '', s, flags=re.S)
        if r['rewrite']:
            s = re.sub(r'<div class="prose">.*?</div>', '<div class="prose"><p>'+esc(r['summary'])+' <a href="#inceleme-baslik">Kaynak incelemesine bakınız.</a></p><p>'+esc(r['open'])+'</p><p>Mevcut harita işareti yaklaşık bir mevki veya saha merkezidir; günlük cephe çizgisi ya da kesin enkaz konumu değildir.</p></div>', s, count=1, flags=re.S)
            desc = r['summary']+' Kaynaklar ve doğrulama sınırları.'
            s=re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*(">)', lambda m:m[1]+esc(desc)+m[2],s)
        s=s.replace('</main>',note+'</main>')
        s=s.replace('Bu sayfada eser cildi, belge numarası ve sayfa işli değildir. Ayrıntı bu yüzden doğrulanmış kayıt olarak işaretlenmez.', 'Yukarıdaki özel kaynak notları dışındaki ayrıntılar için eser/belge/sayfa eşleştirmesi tamamlanmadı; bu ayrıntılar doğrulanmış kayıt olarak işaretlenmez.')
        write(p,s)

    # Önceki turlarda doğrudan kaynak eklenmiş olayların notlarını da dizine al.
    done = {r['path'] for r in REVIEWS}
    for p in sorted((ROOT/'olaylar').glob('*/index.html')):
        path=p.parent.relative_to(ROOT).as_posix()+'/'
        if path in done: continue
        s=p.read_text(encoding='utf-8')
        REVIEWS.append(dict(path=path, sources=[], summary='Önceki içerik incelemesinin doğrudan kaynakları ve kanıt alıntıları olay sayfasındadır.',
                            open='Sayfadaki açık kalanlar bölümü geçerlidir; tam belge doğrulaması yapılmış sayılmaz.',reviewed=DATE,status='Sayfaya özgü kaynak notu mevcut'))

    template=(ROOT/'page-shell.html').read_text(encoding='utf-8')
    body='<p class="kicker">Kaynak ve kapsam</p><h1>İçerik inceleme notları</h1>\n<div class="prose"><p>Son inceleme: <time datetime="2026-10-17">17 Ekim 2026</time>. Bu sayfa olay, komutan ve donanma anlatılarının hangi kaynaklarla karşılaştırıldığını gösterir. Bir kaynağın okunması, bütün sayfanın doğrulanması değildir. Kurum anlatısı, koleksiyon açıklaması ve özgün savaş belgesi aynı tür kanıt sayılmaz.</p><p>Kaynak kataloğunun şeması ve kayıt durumları değiştirilmedi. Saatler, mevcutlar, zayiat, kişi kimlikleri ve koordinatlar için kanıtı tamamlanmayan ayrıntılar açık tutuldu. Harita çizgileri yaklaşık veya şematiktir.</p><p><a href="#sayfalar">Sayfalara göre kapsam</a> · <a href="#kanitlar">Kanıt metinleri</a> · <a href="/kaynak-politikasi/">Kaynak politikası</a></p></div>\n<h2 id="sayfalar">Sayfalara göre kapsam</h2><div class="prose"><ul>\n'
    for r in sorted(REVIEWS,key=lambda x:x['path']):
        s=(ROOT/r['path']/'index.html').read_text(encoding='utf-8')
        title=re.search(r'<h1>(.*?)</h1>',s).group(1)
        body+='<li><a href="/'+r['path']+'">'+title+'</a> — '+esc(r['status'])+'.</li>\n'
    body+='</ul></div><h2 id="kanitlar">Kanıt metinleri ve sınırlar</h2>\n'
    for key, src in SOURCES.items():
        body+='<section class="prose" aria-labelledby="'+key+'"><h3 id="'+key+'">'+esc(src['title'])+'</h3><p><a href="'+esc(src['url'])+'">Kaynağı aç</a></p><p><strong>İnceleme: '+DATE+' · '+esc(src['status'])+'.</strong></p>'
        body+='<p>'+esc(src['scope'])+'</p>'
        if src['evidence']:
            lang = 'en' if key.startswith(('awm','dva','nz','nam','naval')) else ('fr' if key=='french-army' else 'tr')
            parts = src['evidence'].split(' / ')
            body += '<p>Kanıt metni'+(' (ayrı bölümler)' if len(parts)>1 else '')+': '+ ' · '.join('<q lang="'+lang+'">'+esc(x)+'</q>' for x in parts)+'</p>'
        else: body+='<p>Kanıt bölümü: <em>Trapped</em>; olay sayfasındaki önceki alıntı korunur.</p>'
        body+='</section>\n'
    out=template.replace('TITLE','İçerik inceleme notları').replace('DESC','Olay, komutan ve donanma içeriklerinin kaynakları, kanıt metinleri ve açık doğrulama ihtiyaçları.').replace('CANON','https://onsekizmart.com/inceleme-notlari/').replace('BODY',body)
    write(ROOT/'inceleme-notlari/index.html',out)
    write(ROOT/'research/ux-audit/content-review.json',json.dumps(dict(reviewed=DATE,scope='Tarihsel anlatı sayfaları; kayıt düzeyi tam doğrulama değildir',sources=list(SOURCES.values()),pages=REVIEWS),ensure_ascii=False,indent=2))
    print(f'{len(REVIEWS)} sayfa, {len(SOURCES)} kaynak notu hazırlandı.')

if __name__=='__main__': main()
