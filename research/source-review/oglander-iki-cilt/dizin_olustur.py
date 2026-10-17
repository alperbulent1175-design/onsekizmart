"""İndirilmiş nüshalarda yerel OCR araması yapar; eşleşmeleri kanıt saymaz."""
import csv
import hashlib
import json
from pathlib import Path
import re
import unicodedata

import pymupdf

ROOT = Path(__file__).resolve().parent
TOPICS = {
    'komutan-carden': ['carden'], 'komutan-de-robeck': ['de robeck', 'de-robeck', 'derobeck'],
    'komutan-hamilton': ['hamilton'], 'komutan-birdwood': ['birdwood'],
    'komutan-godley': ['godley'], 'komutan-gouraud': ['gouraud'],
    'komutan-stopford': ['stopford'], 'komutan-monro': ['monro'],
    'komutan-liman': ['liman von sanders', 'liman pasha'],
    'komutan-esat': ['essad', 'essat', 'esad'], 'komutan-vehip': ['wehib', 'vehib'],
    'komutan-cevat': ['djevad', 'djevat', 'jevad'],
    'komutan-weber': ['weber'], 'komutan-merten': ['merten'],
    'komutan-usedom': ['usedom'], 'komutan-halil-sami': ['halil sami', 'halil samy'],
    'komutan-mustafa-kemal': ['mustafa kemal', 'mustapha kemal'],
    'komutan-damade': ["d'amade", 'd amade'], 'komutan-guepratte': ['guepratte'],
    'komutan-hunter-weston': ['hunter-weston', 'hunter weston'],
    'gemi-bouvet': ['bouvet'], 'gemi-irresistible': ['irresistible'],
    'gemi-ocean': ['ocean'], 'gemi-triumph': ['triumph'],
    'gemi-goliath': ['goliath'], 'gemi-majestic': ['majestic'],
    'gemi-ae2': ['ae2', 'ae 2'], 'gemi-e15': ['e15', 'e 15'],
    'gemi-nusret': ['nusret', 'nusrat'], 'gemi-barbaros': ['barbarossa', 'barbaros'],
    'mevki-kumkale': ['kum kale', 'kum kaleh'],
    'mevki-kirte': ['krithia'], 'mevki-kerevizdere': ['kereves dere', 'kereviz dere'],
    'mevki-zigindere': ['gully ravine'], 'mevki-kanlisirt': ['lone pine'],
    'mevki-conkbayiri': ['chunuk bair'], 'mevki-anafartalar': ['anafarta', 'ana farta', 'suvla'],
    'mevki-saros': ['bulair', 'saros'], 'ateskes': ['armistice'],
    'tahliye': ['evacuation'], 'muharip-mevcut-arama': ['effectives', 'fighting strength'],
    'kurulus-kadrosu-arama': ['establishment'],
}


def fold(text):
    text = unicodedata.normalize('NFKD', text.casefold())
    text = ''.join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r'(?<=\w)-\s+(?=\w)', '', text)
    return re.sub(r'\s+', ' ', text)


def main():
    inventory = json.loads((ROOT / 'dosya-envanteri.json').read_text(encoding='utf-8'))
    if inventory['errors']:
        raise ValueError('İndirme hataları çözülmeden dizin hazırlanmaz')
    patterns = {key: re.compile(r'(?<!\w)(?:' + '|'.join(re.escape(fold(t)) for t in terms) + r')(?!\w)')
                for key, terms in TOPICS.items()}
    pages, hits = [], []
    counts = {key: 0 for key in TOPICS}
    for record in inventory['files']:
        path = (ROOT / record['localFile']).resolve()
        if not path.is_relative_to((ROOT / 'ham').resolve()):
            raise ValueError('Ham araştırma klasörü dışındaki dosya')
        if hashlib.sha256(path.read_bytes()).hexdigest() != record['sha256']:
            raise ValueError('Dosya özeti değişmiş: ' + path.name)
        with pymupdf.open(path) as doc:
            if len(doc) != record['pdfPages']:
                raise ValueError('PDF sayfa sayısı uyuşmuyor')
            for number, page in enumerate(doc, 1):
                text = fold(page.get_text())
                matches = [key for key, pattern in patterns.items() if pattern.search(text)]
                url = record['downloadUrl'] + '#page=' + str(number)
                pages.append(dict(volume=record['volume'], file=record['localFile'], pdfPage=number,
                                  printedPage=None, sourceUrl=url, textCharacters=len(text), topics=matches,
                                  reviewed=inventory['reviewed'], status='otomatik_ocr_taramasi_kanit_dogrulamasi_degil'))
                for key in matches:
                    counts[key] += 1
                    hits.append(dict(konu=key, cilt=record['volume'], dosya=record['localFile'],
                                     pdf_sayfasi=number, basili_sayfa='', kaynak_url=url,
                                     inceleme_tarihi=inventory['reviewed'], durum='arama_eslesmesi_kanit_degil'))
    report = dict(reviewed=inventory['reviewed'], files=len(inventory['files']), pdfPages=len(pages),
                  textPages=sum(p['textCharacters'] > 0 for p in pages), topicCount=len(TOPICS),
                  pageTopicMatches=len(hits), topicPageCounts=counts, verifiedHistoricalClaimsAdded=0)
    for name, value in [('sayfa-dizini.json', dict(summary=report, pages=pages)), ('dizin-kontrolu.json', report)]:
        (ROOT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    with (ROOT / 'konu-dizini.csv').open('w', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=['konu', 'cilt', 'dosya', 'pdf_sayfasi', 'basili_sayfa',
                                                   'kaynak_url', 'inceleme_tarihi', 'durum'])
        writer.writeheader()
        writer.writerows(hits)
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()
