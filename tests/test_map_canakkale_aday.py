import hashlib
import json
import unittest

import import_catalog
import map_canakkale_aday as mapper

PAGE_URL = "https://www.canakkalecephesi.com/ornek-sayfa"
PAGE_TITLE = "Örnek sayfa başlığı"
BODY = "GOVDE 16 Mart Bouvet Mustafa Kemal kopyalanmamali"


def sample_page(**extra):
    page = {
        "url": PAGE_URL,
        "title": PAGE_TITLE,
        "canonical_url": PAGE_URL,
        "published_date": "1915-03-18",
        "fetched_at_utc": "2026-10-16T00:08:00Z",
        "headings": ["16 Mart", "Bouvet", "Mustafa Kemal"],
        "text": BODY,
        "internal_links": ["https://www.canakkalecephesi.com/16-mart-bouvet"],
        "images": ["bouvet.jpg", "mustafa-kemal.jpg"],
        "text_length": 128,
    }
    page.update(extra)
    return page


def without_title(candidate):
    copied = {key: value for key, value in candidate.items() if key != "baslik"}
    return json.dumps(copied, ensure_ascii=False)


class MapCanakkaleAdayTest(unittest.TestCase):
    def test_valid_page_stays_unverified(self):
        candidate = mapper.candidate_from_page(sample_page())
        self.assertIsNotNone(candidate)
        self.assertEqual(list(candidate.keys()), list(import_catalog.COLUMNS))
        self.assertNotIn("iddia_destegi", candidate)
        self.assertNotIn("iddia_dogrulandi", candidate)
        self.assertEqual(candidate["kurum"], "canakkalecephesi.com")
        self.assertEqual(candidate["baslik"], PAGE_TITLE)
        self.assertEqual(candidate["kayit_no"], "")
        self.assertEqual(candidate["tarih"], "")
        self.assertEqual(candidate["kayit_turu"], "Web sayfası")
        self.assertEqual(candidate["url"], PAGE_URL)
        self.assertEqual(candidate["konu"], "")
        self.assertEqual(
            candidate["erisim_durumu"],
            "Ham arşiv kopyası; içerik doğrulanamadı",
        )
        self.assertIn(f"teknik_kimlik={candidate['id']}", candidate["notlar"])
        self.assertIn("arşiv kayıt numarası değildir", candidate["notlar"])
        converted = import_catalog.convert([candidate])
        statuses = {item["durum"] for item in converted["kayitlar"]}
        self.assertEqual(converted["kayitlar"][0]["durum"], "insan_incelemesi_gerekli")
        self.assertFalse(converted["kayitlar"][0]["iddia_destegi"])
        self.assertNotIn("iddia_dogrulandi", statuses)

    def test_missing_url_is_none(self):
        self.assertIsNone(mapper.candidate_from_page({"title": PAGE_TITLE}))
        self.assertIsNone(mapper.candidate_from_page({"url": "", "title": PAGE_TITLE}))
        self.assertIsNone(mapper.candidate_from_page({"url": "   ", "title": PAGE_TITLE}))
        self.assertIsNone(mapper.candidate_from_page({"url": None, "title": PAGE_TITLE}))

    def test_invalid_url_is_none(self):
        self.assertIsNone(
            mapper.candidate_from_page(
                {"url": "javascript:alert(1)", "title": PAGE_TITLE}
            )
        )
        self.assertIsNone(
            mapper.candidate_from_page({"url": "data:text/html,x", "title": PAGE_TITLE})
        )

    def test_root_page_is_none(self):
        roots = [
            "https://www.canakkalecephesi.com/",
            "https://www.canakkalecephesi.com",
            "https://www.canakkalecephesi.com/?",
            "https://www.canakkalecephesi.com/?q=1",
            "https://www.canakkalecephesi.com/#frag",
            "https://www.canakkalecephesi.com/?q=1#frag",
        ]
        for url in roots:
            self.assertIsNone(
                mapper.candidate_from_page({"url": url, "title": PAGE_TITLE}),
                url,
            )
        kept = mapper.candidate_from_page(
            {
                "url": "https://www.canakkalecephesi.com/ornek-sayfa?q=1",
                "title": PAGE_TITLE,
            }
        )
        self.assertIsNotNone(kept)
        self.assertEqual(
            kept["url"], "https://www.canakkalecephesi.com/ornek-sayfa?q=1"
        )

    def test_published_date_is_not_event_date(self):
        candidate = mapper.candidate_from_page(
            sample_page(published_date="1915-03-18")
        )
        self.assertEqual(candidate["tarih"], "")
        self.assertIn("yayin_metasi=1915-03-18", candidate["notlar"])
        self.assertNotIn("1915-03-18", candidate["tarih"])

    def test_missing_title_is_none(self):
        self.assertIsNone(mapper.candidate_from_page({"url": PAGE_URL}))
        self.assertIsNone(mapper.candidate_from_page({"url": PAGE_URL, "title": ""}))
        self.assertIsNone(mapper.candidate_from_page({"url": PAGE_URL, "title": "   "}))
        self.assertIsNone(mapper.candidate_from_page({"url": PAGE_URL, "title": None}))

    def test_same_page_same_id(self):
        first = mapper.candidate_from_page(sample_page())
        second = mapper.candidate_from_page(sample_page())
        expected = "CC-" + hashlib.sha256(PAGE_URL.encode("utf-8")).hexdigest()[:12]
        self.assertEqual(first["id"], second["id"])
        self.assertEqual(first["id"], expected)
        self.assertRegex(first["id"], r"^CC-[0-9a-f]{12}$")

    def test_body_is_not_copied(self):
        candidate = mapper.candidate_from_page(sample_page())
        blob = without_title(candidate)
        for word in ("16 Mart", "Bouvet", "Mustafa Kemal", BODY):
            self.assertNotIn(word, blob)
            self.assertNotIn(word.lower(), blob.lower())
        self.assertNotIn(BODY, candidate["notlar"])
        self.assertNotIn("bouvet.jpg", blob.lower())
        self.assertNotIn("16-mart-bouvet", blob.lower())

    def test_note_fields_follow_metadata_only(self):
        candidate = mapper.candidate_from_page(
            sample_page(
                canonical_url="https://www.canakkalecephesi.com/ornek-sayfa/",
                fetched_at_utc="2026-10-16T00:08:00Z",
                text_length=128,
            )
        )
        notes = candidate["notlar"]
        self.assertIn("cekim=2026-10-16T00:08:00Z", notes)
        self.assertIn("uzunluk=128", notes)
        self.assertIn(
            "kanonik=https://www.canakkalecephesi.com/ornek-sayfa/",
            notes,
        )
        self.assertIn("yayin_metasi=1915-03-18", notes)
        bare = mapper.candidate_from_page({"url": PAGE_URL, "title": PAGE_TITLE})
        self.assertNotIn("cekim=", bare["notlar"])
        self.assertNotIn("uzunluk=", bare["notlar"])
        self.assertNotIn("kanonik=", bare["notlar"])
        self.assertNotIn("yayin_metasi=", bare["notlar"])

    def test_candidates_from_pages_keeps_first_url(self):
        pages = [
            sample_page(url="https://www.canakkalecephesi.com/bir", title="Bir"),
            {"url": "javascript:void(0)", "title": "Geçersiz"},
            {"url": "https://www.canakkalecephesi.com/", "title": "Kök"},
            sample_page(url="https://www.canakkalecephesi.com/iki", title="İki"),
            sample_page(url="https://www.canakkalecephesi.com/bir", title="Bir tekrar"),
        ]
        result = mapper.candidates_from_pages(pages)
        self.assertEqual([item["baslik"] for item in result], ["Bir", "İki"])
        self.assertEqual(
            [item["url"] for item in result],
            [
                "https://www.canakkalecephesi.com/bir",
                "https://www.canakkalecephesi.com/iki",
            ],
        )

    def test_convert_accepts_candidate(self):
        candidate = mapper.candidate_from_page(sample_page())
        converted = import_catalog.convert([candidate])
        self.assertEqual(len(converted["kayitlar"]), 1)
        record = converted["kayitlar"][0]
        self.assertEqual(record["id"], candidate["id"])
        self.assertEqual(record["durum"], "insan_incelemesi_gerekli")
        self.assertFalse(record["iddia_destegi"])
        self.assertNotEqual(record["durum"], "iddia_dogrulandi")


if __name__ == "__main__":
    unittest.main()
