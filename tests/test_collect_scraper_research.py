import json
from pathlib import Path
import tempfile
import unittest
from collect_scraper_research import body_window, collect, identity


class CollectionTests(unittest.TestCase):
    def test_boundaries_keep_bibliography_before_ui(self):
        text = 'Başlık\nA\n+\nA\n-\nAnlatı\nKaynakça\nATASE belge\nTweetle\nÖteki yazı'
        body, start, end = body_window(text)
        self.assertEqual(body, 'Anlatı\nKaynakça\nATASE belge')
        self.assertTrue(start and end)
        self.assertIsNone(identity('https://example.com/'))

    def test_input_preserved_and_repeats_not_counted_twice(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            url = 'https://www.canakkalecephesi.com/index.php/2022/12/26/ornek/'
            page = {'url': url, 'title': 'Örnek', 'text': 'A\n+\nA\n-\n' + 'Kaynaklı anlatı. '*20 + '\nÖNCEKİ KONU\nYan yazı'}
            source = root/'input.jsonl'
            raw = '\n'.join(json.dumps(p) for p in [page, dict(page, url=url+'?replytocom=1'), dict(page, url=url+'image/')])
            source.write_text(raw, encoding='utf-8')
            collect(source, root/'out')
            result = json.loads((root/'out/secim.json').read_text(encoding='utf-8'))
            self.assertEqual(result['selectedCandidates'], 1)
            self.assertEqual(source.read_text(encoding='utf-8'), raw)
            self.assertFalse(result['records'][0]['historicalClaimVerified'])
