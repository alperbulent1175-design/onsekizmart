"""Yayın öncesi içerik tutarlılığı; yalnız yerel statik dosyalar."""
from pathlib import Path
import json
import re
from build_content_review import ROOT, SOURCES, REVIEWS, main, write

# Üretim betiği yeniden çalıştırılabilir; katalog durumlarını yükseltmez.
main()

# Kimlik eşleştirmesi kurulamadığı için Refet Bele biyografisi 11. Tümene taşınmaz.
paths = list((ROOT/'komutanlar').glob('**/index.html'))+[ROOT/'js/campaign.js',ROOT/'js/data.js']
for p in paths:
    s=p.read_text(encoding='utf-8').replace('Rafet Bey (Bele)','Rafet Bey')
    if p.parent.name=='rafet-bey-bele':
        s=re.sub(r'<div><dt>(?:Doğum|Ölüm)</dt><dd>.*?</dd></div>\s*','',s)
        s=s.replace('<div class="prose"><p>Kumkale', '<div class="prose"><p>11. Tümen komutanının Bele soyadıyla eşleştirmesi doğrulanmadı; başka bir kişiye ait olabilecek doğum ve ölüm alanları kaldırıldı.</p><p>Kumkale')
    write(p,s)

# Komutan sayfaları: kaynaklandırılan görev özeti öne, eski ayrıntılar açıkça beklemede.
for r in REVIEWS:
    if not r['path'].startswith('komutanlar/'): continue
    p=ROOT/r['path']/'index.html'
    s=p.read_text(encoding='utf-8')
    if p.parent.name not in ('john-de-robeck','sackville-carden','ian-hamilton','rafet-bey-bele'):
        s=re.sub(r'<div class="prose">.*?</div>', '<div class="prose"><p>'+r['summary']+' <a href="#inceleme-baslik">Kaynak ve kanıt kapsamı</a>.</p></div>',s,count=1,flags=re.S)
    if 'id="kimlik-notu"' not in s:
        s=s.replace('<dl class="facts">','<p class="accuracy" id="kimlik-notu">Kimlik ve görev alanları çalışma kaydıdır; aşağıdaki kaynak notu hangi bilgilerin desteklendiğini belirtir. Eksik alanlar tahminle doldurulmadı.</p>\n<dl class="facts">')
    if p.parent.name=='johannes-merten':
        s=s.replace('Anadolu Hamidiye ağır topçu idaresi','Başkomutanlık Çanakkale temsilcisi')
    write(p,s)

# Önceki turda kaynaklandırılan paragrafları koru, aynı sayfalardaki kanıtsız giriş tekrarlarını çıkar.
for slug in ['ariburnu-cikarmasi','seddulbahir-cikarmasi','birinci-kirte-muharebesi','ikinci-kirte-muharebesi','ucuncu-kirte-muharebesi']:
    p=ROOT/'olaylar'/slug/'index.html'
    s=p.read_text(encoding='utf-8')
    def trim(m):
        text=m.group(1)
        start=text.find('<h2>')
        return '<div class="prose">'+(text[start:] if start>=0 else text)+'</div>'
    s=re.sub(r'<div class="prose">(.*?)</div>',trim,s,count=1,flags=re.S)
    write(p,s)

p=ROOT/'olaylar/18-mart-deniz-muharebesi/index.html'
s=p.read_text(encoding='utf-8')
copy='''<div class="prose"><p>18 Mart 1915 deniz taarruzunda Bouvet, Irresistible ve Ocean battı; Inflexible ve Gaulois hasar gördü. Ocean’ın mayın isabeti hakkındaki kaynaklar farklı kesinlikte anlatır. Gaulois için raporda geçen Drepano konumu, başka bir ada adıyla kanıtsız eşleştirilmez. <a href="#kaynak-notu">Gemi kayıtları ve kanıt metinleri</a>.</p>
<p>Nusret’in Erenköy hattı ayrı bir olaydır; tarih ve mayın sayısı için <a href="/olaylar/nusret-erenkoy-hattini-doker/">Nusret kaynak notuna</a> bakınız. Haritadaki saatler ve gemi konumları tam belge karşılaştırması tamamlanmış kayıtlar değildir.</p>
<p>Carden’ın 16 Mart 1915 ayrılış kaydı ile de Robeck’in 17 Mart 1915 görev kaydı ayrı tutulur. İki tarih tek bir devir günü olarak birleştirilmedi; bu ayrım için <a href="/komutanlar/john-de-robeck/">komuta kaynak notu</a> bulunur.</p></div>'''
s=re.sub(r'<div class="prose">.*?</div>',copy,s,count=1,flags=re.S)
write(p,s)

# Kronolojinin boşlukları tarihsel sessizlik kanıtı değildir.
p=ROOT/'js/campaign.js'
s=p.read_text(encoding='utf-8')
pattern=r'(id: "(?P<id>e-[^"]+)".*?)(?=\n      \},?)'
def event(m):
    block=m[0]
    if 'quiet: true' in block:
        block=re.sub(r'title: "[^"]*"','title: "Bu aralık için ayrıntılı olay kaydı eklenmedi"',block)
        if m['id']=='e-mart-sessiz-2':
            text='Carden’ın komutayı bıraktığı gün sitede 16 Mart 1915, de Robeck’in görev satırı 17 Mart 1915’tir. İki tarih tek belgeyle birleştirilmedi. Bu aralık notu çatışma olmadığı anlamına gelmez.'
        else:
            text='Bu aralık atlasın seçilmiş olayları arasındaki bir boşluktur; çatışma veya adı konmuş muharebe olmadığı anlamına gelmez. Ayrıntılı kayıt ve kaynak karşılaştırması bekliyor.'
        block=re.sub(r'text: "[^"]*"','text: "'+text+'"',block)
    return block
s=re.sub(pattern,event,s,flags=re.S)
updates={
'e-ari':'ANZAK birlikleri ilk sırtlara çıktı; daha uzak harekât hedeflerine ulaşılamadı. Çıkarma ile bütün hedeflere ulaşmak ayrı aşamalardır; kaynak notu olay sayfasındadır.',
'e-nisan2627':'Çıkarma sonrasındaki günler','e-kereviz':'Bu kart 12–13 Temmuz Kerevizdere aşamasını kapsar; 21–22 Haziran muharebesi ayrı bir aşamadır. Kaynaklardaki adlandırma farkı olay sayfasında açıklanır.',
'e-suvla':'Suvla çıkarması 6 Ağustosta başladı. Yakın tepe kazanımları ile iç kesimdeki hedefler ayrılır; ayrıntılar ve kaynak kapsamı olay sayfasındadır.',
'e-e15':'E15, 17 Nisan 1915’te Boğaz geçişi sırasında karaya oturdu. Karaya oturma ile daha sonraki tahrip işlemi ayrı aşamalardır.',
'e-tahliye-ari':'Arıburnu tahliyesi aşamalıydı; tarih kartı son geceyi gösterir. Son birlikler 20 Aralık sabahının erken saatlerinde ayrıldı.',
'e-tahliye-suvla':'Suvla tahliyesinin son aşaması. Mustafa Kemal’in cepheden ayrılış kaydı 10 Aralıktır; tahliye gecesinin komutanı olarak sunulmaz.'}
for ident,text in updates.items():
    if ident=='e-nisan2627':
        s=re.sub(r'(id: "e-nisan2627".*?title: ")[^"]*',lambda m:m[1]+text,s,flags=re.S)
        s=re.sub(r'(id: "e-nisan2627".*?text: ")[^"]*',lambda m:m[1]+'Bu tarih aralığında çatışmaların sürmesi, atlasın ayrı bir muharebe kartı bulundurmamasıyla çelişmez.',s,flags=re.S)
    else: s=re.sub(r'(id: "'+ident+r'".*?text: ")[^"]*',lambda m:m[1]+text,s,flags=re.S)
s=s.replace('Çıkarma denize dökülmez, iç kesime de yayılamaz.','İlk sırtlara çıkış ile daha uzak hedeflere ulaşmak ayrı değerlendirilir.')
s=s.replace('18 Mart Boğaz taarruz hattında değildir. Marmara ihtiyatındadır.','18 Mart konumu için gemi jurnali karşılaştırması gerekir; İtilaf taarruz filosuyla karıştırılmamalıdır.')
write(p,s)

# Donanma metnindeki unsupported toplu sayılar ve ada eşleştirmeleri çıkarılır.
p=ROOT/'donanma/index.html'
s=p.read_text(encoding='utf-8')
s=s.replace('yaklaşık 20–25 silahlı trawlerden oluşur','mayın taramada kullanılan teknelerden oluşur; tekne sayısı bu incelemede doğrulanmadı')
s=re.sub(r'16–17 Mart rutin taramalarında teller hattın üzerinden geçer, mayınlara takılmaz\.', 'Günlere göre tarama sonuçları için görev raporları gerekir.', s)
s=s.replace('Sabah uçuşları parlama, bulanıklık ve sığlık nedeniyle askıdaki mayınları göremez. Erenköy’deki gizli hat görülmeden kalır.', 'Keşif uçuşlarının saatleri ve mayınların neden görülemediği, bu sayfada belge kanıtıyla kesinleştirilmedi.')
s=s.replace('Tavşan Adası','rapor çevrimyazısındaki Drepano Adası')
s=s.replace('Marmara ihtiyatındadır.', 'Gün içindeki kesin konumu için gemi jurnali karşılaştırması gerekir.')
write(p,s)

# Yeni notlara tüm yayın sayfalarından ulaşılabilir; prototip/katalog/ham arşiv değişmez.
import sys
sys.path.insert(0, str(ROOT))
from build_pages import published_pages, write_sitemap
for p in published_pages(ROOT):
    s=p.read_text(encoding='utf-8')
    if '/inceleme-notlari/">İçerik incelemesi' not in s:
        s=s.replace('<nav class="foot-links" aria-label="Alt">','<nav class="foot-links" aria-label="Alt">\n      <a href="/inceleme-notlari/">İçerik incelemesi</a>')
    s=re.sub(r'/css/style.css\?v=[^"\s]+','/css/style.css?v=20261017b',s)
    if p==ROOT/'index.html':
        for name in ['app','campaign','data','model']:
            s=re.sub(r'js/'+name+r'\.js\?v=[^"\s]+','js/'+name+'.js?v=20261017b',s)
        s=s.replace('Saat çubuğu 18 Mart 1915 günüdür.', 'Saat çubuğu 18 Mart 1915 günüdür; saatlerin belge karşılaştırması tamamlanmadı.')
    write(p,s)
write_sitemap(ROOT)
print('Tutarlılık düzenlemeleri ve site haritası tamamlandı.')
