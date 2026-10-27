import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from audit_numeric_claims import Blocks, apply_reviews

class NumericAuditTests(unittest.TestCase):
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
