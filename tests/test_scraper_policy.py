"""Local policy checks for the desktop scraper; no network requests."""
import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'tools/canakkalecephesi/scrape_canakkalecephesi.py'


@unittest.skipUnless(SCRIPT.exists(), 'Desktop scraper is an optional external tool')
class ScraperPolicyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location('desktop_scraper', SCRIPT)
        cls.scraper = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.scraper)

    def test_comment_urls_share_article_identity(self):
        url = 'https://www.canakkalecephesi.com/index.php/2022/12/26/ornek/'
        self.assertEqual(self.scraper.norm(url + '?replytocom=15&utm_source=x'), url)

    def test_profiles_attachments_and_accounts_are_not_content(self):
        base = 'https://www.canakkalecephesi.com'
        for path in ['/index.php/2022/12/26/ornek/profil/admin.html',
                     '/index.php/2022/12/26/ornek/image-1/', '/wp-content/a.jpg',
                     '/index.php/uyelik/', '/index.php/icerik-ekle/']:
            self.assertFalse(self.scraper.content_url(base + path), path)
        self.assertTrue(self.scraper.content_url(base + '/index.php/2022/12/26/ornek/'))
        self.assertTrue(self.scraper.content_url(base + '/index.php/category/makaleler/'))
        self.assertFalse(self.scraper.content_url('https://example.com/'))
