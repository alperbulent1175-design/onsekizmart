"""Belirlenmiş Oglander dosyalarını indirir ve yerel araştırma envanteri kurar.

Siteyi/kaynak kataloğunu değiştirmez. Ham dosyalar Git dışında kalan ham/ içindedir.
"""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import quote

import pymupdf
import requests

ROOT = Path(__file__).resolve().parent
REVIEWED = '2026-10-17'
V1 = 'in.ernet.dli.2015.210687'
V1_EXTRA = 'in.ernet.dli.2015.210688'
V2 = 'gallipoli-v-2-pt-01-p-003-008'


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def acquire(item, metadata):
    volume, identifier, filename = item
    meta = metadata[identifier]
    expected = next(f for f in meta['files'] if f['name'] == filename)
    if expected.get('private'):
        raise ValueError('Dosya açık erişimli değil: ' + filename)
    target = ROOT / 'ham' / volume / filename
    target.parent.mkdir(parents=True, exist_ok=True)
    source_url = 'https://archive.org/download/' + identifier + '/' + quote(filename)
    urls = [source_url] + ['https://' + meta[key] + meta['dir'] + '/' + quote(filename)
                           for key in ['d1', 'd2'] if meta.get(key) and meta.get('dir')]
    data = target.read_bytes() if target.exists() else b''
    used_url = source_url
    errors = []
    if hashlib.md5(data).hexdigest() != expected['md5']:
        for url in urls:
            try:
                response = requests.get(url, timeout=45)
                response.raise_for_status()
                data = response.content
                if (not data.startswith(b'%PDF-') or len(data) != int(expected['size'])
                        or hashlib.md5(data).hexdigest() != expected['md5']):
                    raise ValueError('Kaynağın boyutu/özetiyle eşleşmiyor')
                target.write_bytes(data)
                used_url = url
                break
            except (requests.RequestException, ValueError) as exc:
                errors.append(type(exc).__name__ + ': ' + url)
        else:
            raise RuntimeError('; '.join(errors))
    with pymupdf.open(target) as doc:
        texts = [page.get_text() for page in doc]
    (target.parent / (target.stem + '.txt')).write_text('\n\f\n'.join(texts), encoding='utf-8')
    record = dict(volume=volume, identifier=identifier, sourceUrl='https://archive.org/details/' + identifier,
                  downloadUrl=source_url, retrievalUrl=used_url, localFile=target.relative_to(ROOT).as_posix(),
                  sha256=hashlib.sha256(data).hexdigest(), sourceMd5=expected['md5'], bytes=len(data),
                  pdfPages=len(texts), textPages=sum(bool(t.strip()) for t in texts), reviewed=REVIEWED,
                  status='dosya_ve_ocr_taramasi_tamam_sayfa_gorseli_orneklem_incelemesi_acik')
    match = re.search(r'Pt(\d{2})p(\d{3})-(\d{3})', filename)
    if match:
        record.update(part=int(match[1]), declaredPrintedRange=[int(match[2]), int(match[3])],
                      rangeStatus='dosya_adindan_alindi_sayfa_sayfa_dogrulanmadi')
    return record


def main():
    metadata = {}
    for identifier in [V1, V1_EXTRA, V2]:
        response = requests.get('https://archive.org/metadata/' + identifier, timeout=30)
        response.raise_for_status()
        metadata[identifier] = response.json()
    parts = sorted(f['name'] for f in metadata[V2]['files']
                   if re.fullmatch(r'GallipoliV2Pt\d{2}p\d{3}-\d{3}_text\.pdf', f['name']))
    if len(parts) != 33:
        raise ValueError('Beklenen 33 bölümlük dosya listesi değişmiş; yeniden inceleme gerekli')
    items = [('I', V1, '2015.210687.Military-Operations_text.pdf'),
             ('I-ek', V1_EXTRA, '2015.210688.Military-Operations_text.pdf')]
    items += [('II', V2, name) for name in parts] + [('II-on-sayfalar', V2, 'GallipoliV2Pt34.pdf')]
    records, errors = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        jobs = {pool.submit(acquire, item, metadata): item for item in items}
        for future in concurrent.futures.as_completed(jobs):
            try:
                record = future.result()
                records.append(record)
                print('OK', record['volume'], Path(record['localFile']).name, record['pdfPages'], flush=True)
            except Exception as exc:
                errors.append(dict(item=jobs[future], error=str(exc)))
                print('ERROR', jobs[future][2], flush=True)
            write_json(ROOT / 'dosya-envanteri.json', dict(reviewed=REVIEWED,
                       files=sorted(records, key=lambda r: r['localFile']), errors=errors,
                       completeBooksConfirmed=False, catalogImported=False, sitePublished=False))
    print('FILES', len(records), 'PDF PAGES', sum(r['pdfPages'] for r in records), 'ERRORS', len(errors))
    return int(bool(errors))


if __name__ == '__main__':
    raise SystemExit(main())
