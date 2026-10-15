import json
import unittest
from pathlib import Path

import import_catalog as catalog


class CatalogNetworkRecordTest(unittest.TestCase):
    def test_recorded_attempts_do_not_promote_failures(self):
        access_path = Path("research/gelibolu/erisim-denemesi.json")
        catalog_path = Path("research/gelibolu/katalog.json")
        self.assertTrue(access_path.is_file(), "erişim denemesi yok")
        access = json.loads(access_path.read_text(encoding="utf-8"))["denemeler"]
        data = json.loads(catalog_path.read_text(encoding="utf-8"))
        by_id = {row["id"]: row for row in data["kayitlar"]}
        self.assertEqual({row["id"] for row in access}, set(by_id))
        for attempt in access:
            row = by_id[attempt["id"]]
            http = attempt["http"]
            if http in (404, 410) or (http is None and attempt.get("hata") not in ("", "adres_yok")):
                self.assertEqual(row["durum"], "insan_incelemesi_gerekli")
            if row["durum"] == "metadata_kontrol_edildi":
                self.assertEqual(http, 200)
                self.assertTrue(attempt.get("govde_eslesti"))
                self.assertFalse(row["url_paylasilan"])
            self.assertNotIn(row["durum"], ("belge_acildi", "iddia_dogrulandi"))
        rebuilt = catalog.apply_access(catalog.convert(catalog.read_rows(catalog.SNAPSHOT)), access)
        self.assertEqual(
            [row["durum"] for row in rebuilt["kayitlar"]],
            [row["durum"] for row in data["kayitlar"]],
        )


if __name__ == "__main__":
    unittest.main()
