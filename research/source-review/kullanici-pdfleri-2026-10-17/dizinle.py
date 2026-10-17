"""Kullanıcının verdiği beş PDF için yerel, ağsız araştırma dizini."""
import hashlib
import json
import pathlib
import re
import unicodedata

import pymupdf

ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = pathlib.Path(__file__).resolve().parent
INPUT = ROOT / '.codex-remote-attachments/01a145a6-78ab-7811-8335-98fbe597d278/407a7791-1fb4-410d-b6e5-9fbc0a0e2c0d'
TOPICS = ['Anafarta', 'Arıburnu', 'Seddülbahir', 'Kumkale', 'Bolayır', 'Kireçtepe', 'Conkbayırı', 'Zığındere', 'Kerevizdere', 'Mustafa Kemal', 'Esat', 'Vehip', 'Liman', 'Birdwood', 'Hamilton', 'Carden', 'Robeck', 'Bouvet', 'Irresistible', 'Ocean', 'Nusret', 'fotoğraf', 'tahliye', 'mütareke', 'zayiat', 'mevcut', 'kuruluş']

def fold(text):
    text = unicodedata.normalize('NFKD', text.casefold().replace('ı', 'i'))
    return ''.join(c for c in text if not unicodedata.combining(c))

def main():
    records, hits = [], []
    for file in sorted(INPUT.glob('*.pdf')):
        number = int(file.name.split('-')[0])
        doc = pymupdf.open(file)
        texts = [page.get_text() for page in doc]
        ocr_file = OUT / 'ham/rusen-ocr/metin.json'
        used_ocr = number == 5 and ocr_file.exists()
        if used_ocr:
            ocr = json.loads(ocr_file.read_text(encoding='utf-8-sig'))
            assert [p['pdfPage'] for p in ocr] == list(range(1, len(doc)+1))
            texts = [p['text'] for p in ocr]
        clean = [re.sub(r'Levent\s+Şahverdi\s+Arşivi', '', t, flags=re.I).strip() for t in texts]
        # Watermark-only extraction is not evidence of a searchable book.
        usable = sum(len(t) > 100 for t in clean)
        (OUT / 'ham').mkdir(exist_ok=True)
        (OUT / 'ham' / f'{number}-metin.txt').write_text('\n\n'.join(f'[PDF SAYFASI {i+1}]\n{t}' for i, t in enumerate(clean)), encoding='utf-8')
        pages = []
        for i, text in enumerate(clean):
            topics = [] if number == 1 else [term for term in TOPICS if fold(term) in fold(text)]
            pages.append({'pdfPage': i+1, 'characters': len(text), 'topics': topics})
            for topic in topics:
                hits.append({'fileId': number, 'topic': topic, 'pdfPage': i+1, 'printedPage': None,
                             'sourceUrl': None, 'sourceLocalUri': file.as_uri() + f'#page={i+1}',
                             'reviewDate': '2026-10-17', 'status': 'otomatik_metin_eslesmesi_iddia_dogrulamasi_degil'})
        records.append({'id': number, 'file': str(file), 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(),
                        'pdfPages': len(doc), 'substantialTextPages': usable, 'pageIndex': pages,
                        'textMethod': 'windows_turkce_ocr' if used_ocr else 'pdf_metin_katmani',
                        'readingStatus': 'tum_metin_cikarildi_secilmis_bolumler_incelendi',
                        'sourceUrl': None, 'externalSourceVerified': False, 'published': False})
    assert len(records) == 5
    (OUT / 'dosya-ve-konu-dizini.json').write_text(json.dumps({'reviewDate': '2026-10-17', 'files': records, 'topicMatches': hits, 'historicalClaimsPromoted': 0}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'files': len(records), 'pages': sum(r['pdfPages'] for r in records), 'matches': len(hits), 'usableTextPages': {r['id']: r['substantialTextPages'] for r in records}}))

if __name__ == '__main__':
    main()
