"""Build an offline research selection; never edits the input or source catalog."""
import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit


def identity(url):
    p = urlsplit(url)
    if p.scheme not in {'http', 'https'} or p.hostname not in {'www.canakkalecephesi.com', 'canakkalecephesi.com'}:
        return None
    return urlunsplit(('https', 'www.canakkalecephesi.com', p.path, '', ''))


def body_window(text):
    lines = text.splitlines()
    # Only unambiguous UI boundaries; retain the complete input elsewhere.
    starts = [i for i in range(len(lines)-3) if lines[i:i+4] == ['A', '+', 'A', '-']]
    start = starts[0]+4 if len(starts) == 1 else 0
    end = next((i for i in range(start, len(lines)) if lines[i].strip() in {'ÖNCEKİ KONU', 'SONRAKİ KONU', 'BENZER KONULAR', 'BİR YORUM YAZIN', 'Tweetle', 'ETİKETLER:', 'YAZARIN SON YAZILARI'}), len(lines))
    return '\n'.join(lines[start:end]).strip(), bool(starts), end < len(lines)


def classify(title, text):
    title = title.casefold()
    if any(t in title for t in ['muharebe tutanak', 'harp ceridesi', 'muharebe takrir']):
        return 'belge-aktarimlari'
    if any(t in title for t in ['tahliye', 'ateşkes', 'lağım', 'çıkarma', 'muharebeler', 'taarruz', 'tahkimat', 'mayın']):
        return 'olaylar-ve-harekat'
    if any(t in title for t in ['sağlık', 'hastalık', 'yaralanma', 'menzil', 'ikmal', 'tamir', 'hastane']):
        return 'saglik-ve-lojistik'
    if any(t in title for t in ['alay', 'tümen', 'kolordu', 'jandarma']):
        return 'birlikler'
    if any(t in title for t in ['günlük', 'hatır', 'rapor', 'belge', 'arşiv', 'nizamname', 'talim']):
        return 'kaynak-yayin-izleri'
    return 'diger-insan-incelemesi'


def collect(source, output):
    raw = source.read_bytes()
    seen, chosen, excluded = set(), [], {'duplicate': 0, 'notDatedArticle': 0, 'emptyBody': 0}
    for number, line in enumerate(raw.decode('utf-8-sig').splitlines(), 1):
        if not line.strip():
            continue
        page = json.loads(line)
        url = identity(page.get('canonical_url') or page.get('url', ''))
        if not url or not re.fullmatch(r'/index\.php/\d{4}/\d{2}/\d{2}/[^/]+/', urlsplit(url).path):
            excluded['notDatedArticle'] += 1
            continue
        if url in seen:
            excluded['duplicate'] += 1
            continue
        seen.add(url)
        title = next((h['text'] for h in page.get('headings', []) if h.get('level') == 'h1' and h.get('text')), page.get('title', '').split(' | ')[0])
        body, start, end = body_window(page.get('text', ''))
        if len(body) < 120:
            excluded['emptyBody'] += 1
            continue
        group = classify(title, body)
        ident = hashlib.sha256(url.encode()).hexdigest()[:12]
        chosen.append({'id': ident, 'title': title, 'sourceUrl': url, 'archiveLine': number,
                       'fetchedAtUtc': page.get('fetched_at_utc'), 'webPublicationDate': page.get('published_date'),
                       'reviewDate': '2026-10-17', 'group': group, 'groupStatus': 'otomatik_on_tasnif',
                       'evidenceText': ' '.join(body.split())[:220],
                       'bodyCharacters': len(body), 'bodyBoundaryStatus': 'arayuz_sinirlari_bulundu' if start and end else 'sinir_belirsiz',
                       'sourceSignals': sorted(set(re.findall(r'ATASE|BOA|BDH|CAB\s*\d+|ADM\s*\d+|WO\s*\d+|Kaynakça|KAYNAKÇA|Bibliyografya|https?://[^\s<>]+', body))),
                       'status': 'arastirma_adayi_ozgun_kaynak_dogrulamasi_bekliyor', 'historicalClaimVerified': False,
                       'textFile': f'ham/{ident}.txt'})
        (output/'ham').mkdir(parents=True, exist_ok=True)
        (output/'ham'/f'{ident}.txt').write_text(body, encoding='utf-8')
    output.mkdir(parents=True, exist_ok=True)
    result = {'reviewDate': '2026-10-17', 'inputFile': str(source), 'inputSha256': hashlib.sha256(raw).hexdigest(),
              'exclusions': excluded, 'selectedCandidates': len(chosen), 'records': chosen}
    (output/'secim.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    groups = sorted({r['group'] for r in chosen})
    index = '# Scraper araştırma derlemesi\n\n17 Ekim 2026. Bu dosya araştırma adayları dizinidir; tarihsel doğrulama veya yayın onayı değildir. Başlıklara göre ön tasnif yapılmıştır. Kaynak URL, arşiv satırı, kısa kanıt, erişim/inceleme tarihi ve durum secim.json içinde korunur. Tam çalışma metinleri ham/ altında Git dışındadır.\n\n'
    for group in groups:
        subset = [r for r in chosen if r['group'] == group]
        index += f'## {group} ({len(subset)})\n\n'
        index += '\n'.join(f'- [{r["title"]}]({r["sourceUrl"]}) · kayıt {r["id"]}' for r in subset)+'\n\n'
    (output/'DIZIN.md').write_text(index, encoding='utf-8')
    assert hashlib.sha256(source.read_bytes()).hexdigest() == result['inputSha256']
    print(json.dumps({'candidates': len(chosen), 'excluded': excluded, 'groups': {g: sum(r['group']==g for r in chosen) for g in groups}}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    collect(args.input, args.output)
