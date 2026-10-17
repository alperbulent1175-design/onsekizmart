"""İncelenmiş fotoğraf künyelerinden statik galeriler üretir; ağ isteği yapmaz."""
import argparse
import hashlib
import html
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
LEDGER = Path('research/photo-archive/2026-10-17/manifest.json')
START = '<!-- photo-archive:start -->'
END = '<!-- photo-archive:end -->'
GROUPS = [('gemiler', 'Gemiler'), ('denizciler', 'Denizciler'), ('komutanlar', 'Komutanlar'), ('olaylar', 'Olaylar ve mevkiler')]
CC_BY_SA_DE = 'https://creativecommons.org/licenses/by-sa/3.0/de/'


def rights_label(record):
    if record['rightsStatus'] == 'kurum_kaydinda_kamu_mali':
        return 'kurum kaydında kamu malı'
    if (record['rightsStatus'] == 'acik_lisans_cc_by_sa_3_0_de'
            and record.get('license') == 'CC-BY-SA-3.0-DE'
            and record.get('rightsUrl') == CC_BY_SA_DE
            and record.get('rightsEvidenceUrl')
            and record.get('imageChangesTr') == 'Dosya değiştirilmeden kullanıldı.'):
        return 'CC BY-SA 3.0 Almanya · ' + record['imageChangesTr'].rstrip('.')
    raise ValueError('Kullanım koşulları tamamlanmamış görsel: ' + record['id'])


def safe_path(root, relative):
    candidate = (root / relative).resolve()
    if not candidate.is_relative_to(root.resolve()):
        raise ValueError('Çalışma alanı dışındaki yol: ' + relative)
    return candidate


def category(record):
    if record.get('category'):
        return record['category']
    if record.get('person') or record.get('people'):
        return 'komutanlar'
    return 'denizciler' if record.get('ship') in ['triumph', 'goliath-triumph-majestic'] else 'gemiler'


def figure(record, related=None):
    e = html.escape
    src = '/' + record['sitePreparedPath']
    date = record.get('dateLabelTr') or record.get('sourceDate') or 'Belirtilmemiş'
    maker = record.get('maker') or 'Belirtilmemiş'
    if maker == 'Unknown':
        maker = 'Bilinmiyor'
    date = {'January 1915': 'Ocak 1915', 'May 1915': 'Mayıs 1915', 'c 18 April 1915': 'Yaklaşık 18 Nisan 1915', '17 October 1915': '17 Ekim 1915'}.get(date, date)
    context = record.get('contextNoteTr', 'Fotoğrafın künyesi, sayfadaki bütün tarihsel iddiaları ve kesin enkaz konumunu doğrulamaz.')
    links = ''
    if related:
        links = '<p>İlgili sayfalar: ' + ' · '.join(f'<a href="/{e(page.removesuffix("index.html"))}">{e(title)}</a>' for page, title in related) + '</p>'
    rights_evidence = ''
    if record.get('rightsEvidenceUrl'):
        rights_evidence = f' · <a href="{e(record["rightsEvidenceUrl"])}">Görsele ait lisans kaydı</a>'
    return f'''<figure class="naval-photo" data-photo-id="{e(record['id'])}">
<a href="{e(src)}" aria-label="{e(record['id'])} fotoğrafını tam boy aç"><img src="{e(src)}" width="{record['width']}" height="{record['height']}" loading="lazy" decoding="async" alt="{e(record['altTr'])}"></a>
<figcaption><p>{e(record['captionTr'])}</p><p><a href="{e(record['sourceUrl'])}">{e(record['credit'])} · Kaynak kaydı</a></p>
<details><summary>Fotoğraf künyesi</summary><p>Kurumun tarih alanı: {e(date)}. Fotoğrafçı/üretici: {e(maker)}.</p><p>Kullanım: {e(rights_label(record))}. <a href="{e(record.get('rightsUrl') or record['sourceUrl'])}">Kullanım bilgisi</a>{rights_evidence}.</p><p>İnceleme: {e(record['visualReviewDate'])} · Kurum künyesi ve görüntü incelendi. {e(context)}</p></details>{links}</figcaption></figure>'''


def gallery(records, archive=False, titles=None):
    if archive:
        parts = []
        for key, label in GROUPS:
            selected = [r for r in records if category(r) == key]
            if selected:
                parts.append(f'<section class="naval-photos" aria-labelledby="{key}"><h2 id="{key}" tabindex="-1">{label}</h2><div class="naval-photo-grid">' + '\n'.join(figure(r, [(p, titles[p]) for p in r.get('localUses', []) if p != 'fotograf-arsivi/index.html']) for r in selected) + '</div></section>')
        return START + '\n' + '\n'.join(parts) + '\n' + END
    grid = 'naval-photo-grid' + (' naval-photo-grid--single' if len(records) == 1 else '')
    return START + '\n<section class="naval-photos" aria-labelledby="fotograf-arsivi"><h2 id="fotograf-arsivi" tabindex="-1">Fotoğraf arşivinden</h2><p>Çekim tarihi ve bağlamı görsel açıklamasındadır; bir mevki görüntüsü olay anı olarak sunulmaz.</p><div class="' + grid + '">' + '\n'.join(figure(r) for r in records) + '</div></section>\n' + END


def coverage(root, records, reviewed):
    candidate_file = root / LEDGER.parent / 'candidates.json'
    candidates = json.loads(candidate_file.read_text(encoding='utf-8'))['records'] if candidate_file.exists() else []
    pages = []
    for kind in ['komutanlar', 'olaylar']:
        for path in sorted((root / kind).glob('*/index.html')):
            relative = path.relative_to(root).as_posix()
            title = re.search(r'<h1[^>]*>(.*?)</h1>', path.read_text(encoding='utf-8'), re.S)
            if not title:
                raise ValueError('Sayfa başlığı bulunamadı: ' + relative)
            ids = [r['id'] for r in records if relative in r.get('localUses', [])]
            pages.append(dict(page=relative, title=html.unescape(re.sub('<[^>]+>', '', title[1])),
                              photoIds=ids, status='yerel_gorsel_var' if ids else 'uygun_gorsel_bekliyor',
                              candidates=[c for c in candidates if c['page'] == relative]))
    counts = {kind: dict(total=sum(p['page'].startswith(kind + '/') for p in pages),
                         withPhotos=sum(p['page'].startswith(kind + '/') and bool(p['photoIds']) for p in pages))
              for kind in ['komutanlar', 'olaylar']}
    navy = root / 'donanma/index.html'
    cards = []
    if navy.exists():
        for sid, body in re.findall(r'<article class="ship-card" id="([^"]+)">(.*?)</article>', navy.read_text(encoding='utf-8'), re.S):
            ship = re.sub(r'-(18|sonra)$', '', sid)
            ids = [r['id'] for r in records if r.get('ship') == ship and 'donanma/index.html' in r.get('localUses', [])]
            title = re.search('<h3>(.*?)</h3>', body, re.S)
            cards.append(dict(id=sid, title=html.unescape(title[1]), photoIds=ids,
                              status='gorsel_kaydi_var' if ids else 'gemiyi_teshis_eden_gorsel_bekliyor'))
    return dict(reviewed=reviewed, photos=len(records), counts=counts, pages=pages, navyCards=cards)


def plan(root):
    ledger = json.loads((root / LEDGER).read_text(encoding='utf-8'))
    records = ledger['records']
    ids = set()
    pages = {}
    copies = {}
    for r in records:
        if r['id'] in ids:
            raise ValueError('Tekrarlanan kayıt: ' + r['id'])
        ids.add(r['id'])
        for field in ['sourceUrl', 'credit', 'rightsEvidence', 'evidenceText', 'accessed', 'visualReviewDate', 'captionTr', 'altTr', 'sha256']:
            if not r.get(field):
                raise ValueError(r['id'] + ': eksik ' + field)
        if r['verificationStatus'] != 'kurum_kunyesi_ve_gorsel_incelendi':
            raise ValueError('İncelemesi/kullanımı tamamlanmamış görsel: ' + r['id'])
        rights_label(r)
        if any(urlparse(r.get(key) or r['sourceUrl']).scheme != 'https' or not urlparse(r.get(key) or r['sourceUrl']).netloc for key in ['sourceUrl', 'rightsUrl', 'rightsEvidenceUrl']) or category(r) not in dict(GROUPS):
            raise ValueError('Geçersiz kaynak veya grup: ' + r['id'])
        if not r['sitePreparedPath'].startswith('images/'):
            raise ValueError('Görsel hedefi images/ altında olmalı')
        target = safe_path(root, r['sitePreparedPath'])
        archive = safe_path(root, str(LEDGER.parent / r['localFile']))
        source = archive if archive.exists() else target
        data = source.read_bytes()
        if hashlib.sha256(data).hexdigest() != r['sha256']:
            raise ValueError('Dosya özeti eşleşmiyor: ' + r['id'])
        if not isinstance(r['width'], int) or not isinstance(r['height'], int) or min(r['width'], r['height']) < 1:
            raise ValueError('Geçersiz boyut: ' + r['id'])
        copies[target] = data
        for page in r.get('localUses', []):
            if not page.endswith('/index.html') or not page.startswith(('olaylar/', 'komutanlar/', 'donanma/', 'fotograf-arsivi/')):
                raise ValueError('Geçersiz sayfa: ' + page)
            pages.setdefault(page, []).append(r)
    outputs = {}
    titles = {}
    for page in pages:
        heading = re.search(r'<h1[^>]*>(.*?)</h1>', safe_path(root, page).read_text(encoding='utf-8'), re.S)
        if not heading:
            raise ValueError('Sayfa başlığı bulunamadı: ' + page)
        titles[page] = html.unescape(re.sub('<[^>]+>', '', heading[1]))
    for page, selected in pages.items():
        target = safe_path(root, page)
        text = target.read_text(encoding='utf-8')
        is_archive = page == 'fotograf-arsivi/index.html'
        block = gallery(selected, is_archive, titles)
        if (START in text) != (END in text) or text.count(START) > 1 or text.count(END) > 1:
            raise ValueError('Galeri sınırları bozuk: ' + page)
        if START in text:
            text = re.sub(re.escape(START) + '.*?' + re.escape(END), lambda _: block, text, flags=re.S)
        else:
            old = r'<section class="naval-photos"[^>]*>.*?</section>'
            if re.search(old, text, re.S):
                first = True
                def replace(_):
                    nonlocal first
                    result = block if first else ''
                    first = False
                    return result
                text = re.sub(old, replace, text, flags=re.S)
            else:
                match = re.search(r'<h2(?: id="kaynak-notu"[^>]*)?>Kaynakça</h2>', text)
                if not match:
                    raise ValueError('Galeri ekleme yeri bulunamadı: ' + page)
                text = text[:match.start()] + block + '\n' + text[match.start():]
        if '/css/photo-archive.css?' not in text:
            text = text.replace('</head>', '<link rel="stylesheet" href="/css/photo-archive.css?v=20261017d">\n</head>')
        if '/js/photo-archive.js?' not in text:
            text = text.replace('</body>', '<script src="/js/photo-archive.js?v=20261017b" defer></script>\n</body>')
        if not is_archive and 'class="photo-jump"' not in text:
            text = text.replace('</h1>', '</h1>\n<p class="photo-jump"><a href="#fotograf-arsivi">Fotoğrafları ve künyelerini gör</a> · <a href="/fotograf-arsivi/">Tüm fotoğraf arşivi</a></p>', 1)
        if not is_archive:
            text = re.sub(r'(<a href="#fotograf-arsivi">)\d+ fotoğrafı', lambda m: m[1] + str(len(selected)) + ' fotoğrafı', text)
        if is_archive:
            text = re.sub(r'Gemiler, denizciler[^<]*: \d+ fotoğraf\.', f'Gemiler, denizciler, komutanlar ve olaylar: {len(selected)} fotoğraf.', text)
        outputs[target] = text.encode('utf-8')
    outputs.update(copies)
    outputs[root / LEDGER.parent / 'coverage.json'] = (json.dumps(coverage(root, records, ledger.get('reviewed')), ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    return outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    outputs = plan(ROOT)  # Bütün kayıtlar doğrulanmadan hiçbir dosya yazılmaz.
    changed = [p for p, data in outputs.items() if not p.exists() or p.read_bytes() != data]
    if args.check:
        print(f'{len(changed)} güncel olmayan fotoğraf çıktısı')
        return int(bool(changed))
    for path in changed:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(outputs[path])
    print(f'{len(changed)} fotoğraf çıktısı güncellendi')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
