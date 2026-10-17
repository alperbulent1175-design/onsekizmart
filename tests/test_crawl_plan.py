import csv
import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from plan_canakkale_crawl import inspect_queue, valid_url

BASE = "https://www.canakkalecephesi.com/"


class CrawlPlanTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.folder = Path(self.temp.name)
        (self.folder / "pages.jsonl").write_text(json.dumps({"url": BASE + "saved/", "internal_links": [{"url": BASE + "new/"}]}) + "\n", encoding="utf-8")
        (self.folder / "url_inventory.txt").write_text("\n".join(BASE + p for p in ["saved/", "gone/", "new/", "media/", "error/"]), encoding="utf-8")
        self.rows = [("gone/", "404", "Arşivlenmedi"), ("media/", "200", "HTML değil"), ("error/", "ERROR", "timeout")]
        self.write_report()

    def write_report(self):
        with (self.folder / "crawl_report.csv").open("w", encoding="utf-8-sig", newline="") as f:
            w = csv.writer(f)
            w.writerow(["url", "status", "title", "note"])
            w.writerows((BASE + u, status, "", note) for u, status, note in self.rows)

    def test_failed_urls_and_non_html_excluded(self):
        r = inspect_queue(self.folder)
        self.assertEqual(r["arsivlenmis_url"], 1)
        self.assertEqual(r["bekleyen_url"], 4)
        self.assertEqual(r["aday_url"], 2)
        self.assertIn(BASE + "error/", r["ornek_adresler"])
        self.assertEqual(inspect_queue(self.folder, True)["aday_url"], 3)

    def test_latest_response_wins(self):
        self.rows.append(("gone/", "503", "Arşivlenmedi"))
        self.write_report()
        self.assertEqual(inspect_queue(self.folder)["onceki_404_410"], 0)

    def test_no_files_modified(self):
        before = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in self.folder.iterdir()}
        inspect_queue(self.folder)
        after = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in self.folder.iterdir()}
        self.assertEqual(before, after)

    def test_malformed_archive_reported(self):
        with (self.folder / "pages.jsonl").open("a", encoding="utf-8") as f:
            f.write("broken\n[]\n")
        self.assertEqual(inspect_queue(self.folder)["bozuk_arsiv_satiri"], 2)

    def test_domain_boundary(self):
        for u in [None, "https://evil.test/", "https://www.canakkalecephesi.com.evil.test/", "https://a:b@www.canakkalecephesi.com/", "file:///archive", "https://[broken/"]:
            self.assertIsNone(valid_url(u))

    def test_bad_report_schema_is_not_silent(self):
        (self.folder / "crawl_report.csv").write_text("url,title\n", encoding="utf-8")
        with self.assertRaises(ValueError):
            inspect_queue(self.folder)


if __name__ == "__main__":
    unittest.main()
