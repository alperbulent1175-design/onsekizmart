import json
import tempfile
import unittest
from pathlib import Path

import import_catalog as catalog


def row(**extra):
    base = {
        "id": "A-1",
        "kurum": "Kurum",
        "baslik": "Başlık",
        "kayit_no": "",
        "tarih": "1915",
        "kayit_turu": "Katalog",
        "url": "https://example.test/a",
        "konu": "Konu",
        "erisim_durumu": "Açık katalog",
        "notlar": "Not",
    }
    base.update(extra)
    return base


class ImportCatalogTest(unittest.TestCase):
    def test_schema_and_status(self):
        data = catalog.convert([row(), row(id="A-2", url="")])
        self.assertEqual(data["kayitlar"][0]["durum"], "bulundu")
        self.assertEqual(data["kayitlar"][1]["durum"], "insan_incelemesi_gerekli")
        self.assertFalse(any(item["iddia_destegi"] for item in data["kayitlar"]))
        for item in data["kayitlar"]:
            self.assertIn(item["durum"], catalog.STATUSES)
            self.assertTrue(item["baslik"])

    def test_duplicate_id_and_bad_url(self):
        with self.assertRaises(ValueError):
            catalog.convert([row(), row()])
        with self.assertRaises(ValueError):
            catalog.convert([row(baslik="  ")])
        with self.assertRaises(ValueError):
            catalog.convert([row(url="javascript:alert(1)")])

    def test_shared_url_is_flagged(self):
        data = catalog.convert(
            [row(), row(id="A-2", baslik="İkinci", url="https://example.test/a")]
        )
        self.assertTrue(all(item["url_paylasilan"] for item in data["kayitlar"]))

    def test_access_upgrade_is_limited(self):
        data = catalog.convert(
            [
                row(),
                row(id="A-2", url="https://example.test/b"),
                row(id="A-3", url="https://example.test/a", baslik="Paylaşılan"),
            ]
        )
        access = [
            {"id": "A-1", "http": 200, "govde_eslesti": True},
            {"id": "A-2", "http": 404, "govde_eslesti": False},
            {"id": "A-3", "http": 200, "govde_eslesti": True},
        ]
        updated = catalog.apply_access(data, access)
        by_id = {item["id"]: item["durum"] for item in updated["kayitlar"]}
        self.assertEqual(by_id["A-1"], "bulundu")
        self.assertEqual(by_id["A-2"], "insan_incelemesi_gerekli")
        self.assertEqual(by_id["A-3"], "bulundu")
        unique = catalog.convert([row(id="B-1", url="https://example.test/only")])
        upgraded = catalog.apply_access(
            unique, [{"id": "B-1", "http": 200, "govde_eslesti": True}]
        )
        self.assertEqual(upgraded["kayitlar"][0]["durum"], "metadata_kontrol_edildi")
        shell_only = catalog.apply_access(
            unique, [{"id": "B-1", "http": 200, "govde_eslesti": False}]
        )
        self.assertEqual(shell_only["kayitlar"][0]["durum"], "bulundu")

    def test_idempotent_render(self):
        data = catalog.convert([row(baslik="<script>alert(1)</script>")])
        first = catalog.render_block(data)
        second = catalog.render_block(data)
        self.assertEqual(first, second)
        self.assertIn("&lt;script&gt;", first)
        self.assertNotIn("<script>alert", first)
        blob = json.dumps(data, ensure_ascii=False, sort_keys=True)
        again = json.dumps(catalog.convert([row(baslik="<script>alert(1)</script>")]), ensure_ascii=False, sort_keys=True)
        self.assertEqual(blob, again)

    def test_devam_render_escapes_and_repeats(self):
        payload = {
            "kayitlar": [
                {
                    "id": "X-1",
                    "kurum": "Kurum",
                    "baslik": "<script>alert(1)</script>",
                    "kayit_no": "Q 1",
                    "kayit_turu": "Künye",
                    "url": "https://example.test/item",
                    "durum": "metadata_kontrol_edildi",
                    "notlar": "Not",
                }
            ]
        }
        first = catalog.render_devam(payload)
        second = catalog.render_devam(payload)
        self.assertEqual(first, second)
        self.assertIn("&lt;script&gt;", first)
        self.assertNotIn("<script>alert", first)
        self.assertIn('data-status="metadata_kontrol_edildi"', first)
        self.assertIn('href="https://example.test/item"', first)

    def test_snapshot_roundtrip(self):
        snapshot = Path("research/gelibolu/kaynak-katalogu-2026-10-15.csv")
        if not snapshot.is_file():
            self.skipTest("anlık kopya henüz yok")
        rows = catalog.read_rows(snapshot)
        self.assertEqual(catalog.convert(rows), catalog.convert(rows))
        with tempfile.TemporaryDirectory() as folder:
            copy = Path(folder) / "a.csv"
            copy.write_bytes(snapshot.read_bytes())
            self.assertEqual(catalog.convert(catalog.read_rows(copy)), catalog.convert(rows))


if __name__ == "__main__":
    unittest.main()
