import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from audit_numeric_claims import Blocks, apply_reviews

class NumericAuditTests(unittest.TestCase):
    def test_technical_mine_and_supply_quantities_are_prioritized(self):
        # These previously remained digit candidates but missed quantity triage.
        for text in ["400 mm kemer", "12 inç", "26 mayınlık hat", "36 torpil",
                     "80–100 isabet", "9.000 metre", "750 gram", "iki kilogram",
                     "14½ inç taret", "2¼ inç levha", "3¾ inç koruma",
                     "20 askerin tahliyesi", "20 askeri tahliye etti", "50 ölü", "50 ölünün kaydı"]:
            with self.subTest(text=text):
                parser = Blocks()
                parser.feed('<p>' + text + '</p>')
                self.assertEqual(len(parser.rows), 1)
                self.assertTrue(parser.rows[0]["quantity_candidate"])
                self.assertEqual(parser.rows[0]["review_status"], "unreviewed_candidate")

    def test_dates_and_collection_numbers_are_not_quantity_proof(self):
        for text in ["18 Mart 1915", "P04411.003", "cilt 23/4/84", "9. Tümen",
                     "1940 ölüm tarihi", "1860, ölümü 1929", "1915 askerî görev",
                     "16.11, mayın isabetinin bildirildiği saat"]:
            with self.subTest(text=text):
                parser = Blocks()
                parser.feed('<p>' + text + '</p>')
                self.assertFalse(parser.rows[0]["quantity_candidate"])

    def test_tables_written_numbers_and_scripts(self):
        parser = Blocks()
        parser.feed('<td>2 yatak <a href="https://example.test">kaynak</a></td><p>İki asker</p><script>999 asker</script>')
        self.assertEqual(len(parser.rows), 2)
        self.assertTrue(all(row["quantity_candidate"] for row in parser.rows))
        self.assertEqual(parser.rows[0]["links"], ["https://example.test"])
        self.assertTrue(all(row["review_status"] == "unreviewed_candidate" for row in parser.rows))

    def test_changed_text_is_not_reviewed_and_verification_is_rejected(self):
        review = {"page":"a", "tag":"td", "text_sha256":"old", "review_status":"context_checked", "review_note":"scope read"}
        result = apply_reviews({"blocks":[{"page":"a", "tag":"td", "text_sha256":"new", "review_status":"unreviewed_candidate"}]}, [review])
        self.assertEqual(result["blocks"][0]["review_status"], "unreviewed_candidate")
        self.assertEqual(result["stale_reviews"], [review])
        with self.assertRaises(ValueError):
            apply_reviews({"blocks":[]}, [dict(review, review_status="iddia_dogrulandi")])

    def test_review_source_cannot_be_overwritten(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder)/"reviews.json"
            source.write_text("[]", encoding="utf-8")
            run = subprocess.run([sys.executable, str(Path(__file__).resolve().parents[1]/"audit_numeric_claims.py"), "--reviews", str(source), "--output", str(source)], capture_output=True)
            self.assertEqual(run.returncode, 2)
            self.assertEqual(source.read_text(encoding="utf-8"), "[]")
