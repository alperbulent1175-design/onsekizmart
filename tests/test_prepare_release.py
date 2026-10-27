import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from contextlib import redirect_stderr
from io import StringIO

from prepare_release import inventory, compare, page_coverage, verify_inventory, main


class ReleaseInventoryTests(unittest.TestCase):
    def test_comparison_source_cannot_be_overwritten(self):
        with tempfile.TemporaryDirectory() as directory:
            frozen = Path(directory) / "frozen.json"
            frozen.write_text("[]", encoding="utf-8")
            for option in ('--verify', '--previous'):
                with patch('sys.argv', ['prepare_release.py', '--output', str(frozen), option, str(frozen)]):
                    with redirect_stderr(StringIO()), self.assertRaises(SystemExit) as result:
                        main()
                    self.assertEqual(result.exception.code, 2)
                    self.assertEqual(frozen.read_text(encoding='utf-8'), '[]')

    def test_new_pages_included_without_copying_old_manifest(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name in ["index.html", "olaylar/new/index.html", "archive/private/index.html",
                         "tmp/scratch/index.html", "research/raw/index.html", "js/app.js",
                         "images/.private/secret.jpg", "images/raw.pdf", ".env", "favicon.svg",
                         "vendor/leaflet/LICENSE", "vendor/leaflet/leaflet.js.map"]:
                p = root / name
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text("sample", encoding="utf-8")
            paths = {r["path"] for r in inventory(root)}
            self.assertEqual(paths, {"index.html", "olaylar/new/index.html", "js/app.js", "favicon.svg",
                                     "vendor/leaflet/LICENSE", "vendor/leaflet/leaflet.js.map"})

    def test_changes_and_removals_are_distinct(self):
        old = [{"path": "old", "sha256": "a"}, {"path": "same", "sha256": "a"}]
        new = [{"path": "new", "sha256": "b"}, {"path": "same", "sha256": "b"}]
        self.assertEqual(compare(new, old), {"added": ["new"], "changed": ["same"], "removed": ["old"]})

    def test_sitemap_reports_missing_new_page_and_obsolete_url(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "sitemap.xml").write_text('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
                '<url><loc>https://onsekizmart.com/</loc></url>'
                '<url><loc>https://onsekizmart.com/removed/</loc></url></urlset>', encoding="utf-8")
            report = page_coverage(root, [{"path": "index.html"}, {"path": "olaylar/new/index.html"}])
            self.assertEqual(report["status"], "mismatch")
            self.assertEqual(report["pages_missing_from_sitemap"], ["https://onsekizmart.com/olaylar/new/"])
            self.assertEqual(report["sitemap_without_page"], ["https://onsekizmart.com/removed/"])

    def test_frozen_inventory_detects_edits_additions_and_missing_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "index.html").write_text("first", encoding="utf-8")
            (root / "robots.txt").write_text("first", encoding="utf-8")
            frozen = inventory(root)
            self.assertEqual(verify_inventory(root, frozen)["status"], "matched")
            (root / "index.html").write_text("edited", encoding="utf-8")
            (root / "robots.txt").unlink()
            (root / "favicon.svg").write_text("new", encoding="utf-8")
            result = verify_inventory(root, frozen)
            self.assertEqual(result["status"], "mismatch")
            self.assertEqual(result["changed"], ["index.html"])
            self.assertEqual(result["added"], ["favicon.svg"])
            self.assertEqual(result["removed"], ["robots.txt"])
