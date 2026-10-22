"""Yerel AWM taramasını sayfa bulmak için hazırlar; OCR doğrulaması yapmaz."""
from pathlib import Path
import hashlib
import json
import argparse
import pymupdf
from PIL import Image, ImageDraw

root = Path(__file__).parent / 'ham'
parser = argparse.ArgumentParser()
parser.add_argument('--file', choices=['RCDIG0000114', 'RCDIG0000091'], default='RCDIG0000114')
args = parser.parse_args()
source = root / (args.file + '.pdf')
prefix = '' if args.file == 'RCDIG0000114' else args.file + '-'
doc = pymupdf.open(source)
texts = [p.get_text() for p in doc]
metadata = {'file': source.name, 'pages': len(doc),
            'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'text_characters': sum(map(len, texts)),
            'note': 'Metin katmanı ve küçük resim incelemesi tam okuma değildir.'}
(root / (prefix + 'inventory.json')).write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding='utf-8')
for start in range(0, len(doc), 12):
    sheet = Image.new('RGB', (1200, 1700), 'white')
    draw = ImageDraw.Draw(sheet)
    for offset in range(12):
        number = start + offset
        if number >= len(doc):
            break
        pix = doc[number].get_pixmap(matrix=pymupdf.Matrix(.65, .65), alpha=False)
        im = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
        im.thumbnail((390, 390))
        x, y = (offset % 3) * 400, (offset // 3) * 425
        sheet.paste(im, (x, y + 25))
        draw.text((x + 10, y + 5), f'PDF {number + 1}', fill='black')
    sheet.save(root / f'{prefix}contact-{start+1:03}.jpg')
print(json.dumps(metadata))
