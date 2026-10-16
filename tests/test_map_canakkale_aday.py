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


SLUG_URL = "https://www.canakkalecephesi.com/seddulbahir-cikarmasi"


def h1(text, level=1):
    return {"level": level, "text": text}


def title_page(title, headings=None, **extra):
    page = {"url": SLUG_URL, "title": title}
    if headings is not None:
        page["headings"] = headings
    page.update(extra)
    return page


class NormalizeTitleTest(unittest.TestCase):
    def test_site_name_only_without_h1_is_skipped(self):
        for title in (
            "| Çanakkale Cephesi",
            "Çanakkale Cephesi",
            " |  çanakkale   cephesi ",
            "– ÇANAKKALE CEPHESİ",
            "- Canakkale Cephesi",
        ):
            page = title_page(title)
            self.assertEqual(mapper.normalize_title(page), "", title)
            self.assertIsNone(mapper.candidate_from_page(page), title)

    def test_dot_and_site_name_is_skipped(self):
        for title in (". | Çanakkale Cephesi", " . |Çanakkale Cephesi", "…", "|"):
            page = title_page(title, headings=[])
            self.assertEqual(mapper.normalize_title(page), "", title)
            self.assertIsNone(mapper.candidate_from_page(page), title)

    def test_falls_back_to_valid_h1(self):
        page = title_page(
            "| Çanakkale Cephesi",
            headings=[
                h1("Önsöz", level=2),
                h1("Çanakkale Cephesi"),
                h1(" . "),
                h1("Seddülbahir | Çanakkale Cephesi"),
                h1("İkinci H1"),
            ],
        )
        self.assertEqual(mapper.normalize_title(page), "Seddülbahir")
        candidate = mapper.candidate_from_page(page)
        self.assertEqual(candidate["baslik"], "Seddülbahir")
        self.assertIn("baslik_kaynagi=h1", candidate["notlar"])

    def test_dot_title_falls_back_to_h1(self):
        page = title_page(". | Çanakkale Cephesi", headings=[h1("Seddülbahir")])
        self.assertEqual(mapper.candidate_from_page(page)["baslik"], "Seddülbahir")

    def test_h1_repeat_rules(self):
        page = title_page("| Çanakkale Cephesi", headings=[h1("Arıburnu Arıburnu")])
        self.assertEqual(mapper.normalize_title(page), "Arıburnu Arıburnu")
        page = title_page("", headings=[h1("Arıburnu | Arıburnu")])
        self.assertEqual(mapper.normalize_title(page), "Arıburnu | Arıburnu")
        page = title_page(
            "| Çanakkale Cephesi", headings=[h1("Arıburnu | Arıburnu | Çanakkale Cephesi")]
        )
        self.assertEqual(mapper.normalize_title(page), "Arıburnu | Arıburnu")
        self.assertIn("baslik_kaynagi=h1", mapper.candidate_from_page(page)["notlar"])
        page = title_page(
            "", headings=[h1("Anafartalar Muharebesi | Anafartalar Muharebesi")]
        )
        self.assertEqual(mapper.normalize_title(page), "Anafartalar Muharebesi")
        page = title_page(
            "| Çanakkale Cephesi",
            headings=[h1("Arıburnu Çıkarması Arıburnu Çıkarması")],
        )
        self.assertEqual(mapper.normalize_title(page), "Arıburnu Çıkarması")

    def test_html_title_wins_over_h1(self):
        page = title_page(
            "Kilitbahir | Çanakkale Cephesi", headings=[h1("Başka başlık")]
        )
        candidate = mapper.candidate_from_page(page)
        self.assertEqual(candidate["baslik"], "Kilitbahir")
        self.assertNotIn("baslik_kaynagi", candidate["notlar"])

    def test_repeated_title_is_collapsed(self):
        cases = {
            "Anafartalar Muharebesi Anafartalar Muharebesi": "Anafartalar Muharebesi",
            "Anafartalar Muharebesi Anafartalar Muharebesi | Çanakkale Cephesi": (
                "Anafartalar Muharebesi"
            ),
            "Anafartalar Muharebesi | Anafartalar Muharebesi | Çanakkale Cephesi": (
                "Anafartalar Muharebesi"
            ),
            "Anafartalar Muharebesi – Anafartalar Muharebesi": "Anafartalar Muharebesi",
            "Anafartalar Muharebesi - ANAFARTALAR MUHAREBESİ": "Anafartalar Muharebesi",
            "Bölüm | Alt başlık | Bölüm | Alt başlık": "Bölüm | Alt başlık",
            "Anafartalar Muharebesi | Anafartalar Muharebesi | Gelibolu": (
                "Anafartalar Muharebesi | Gelibolu"
            ),
        }
        for title, expected in cases.items():
            self.assertEqual(mapper.normalize_title(title_page(title)), expected, title)

    def test_two_word_block_of_single_word_segments_is_halved(self):
        # "A | B" bloğu toplamda iki kelimedir; tekrar eden blok silinir.
        cases = {
            "Gelibolu | Arıburnu | Gelibolu | Arıburnu": "Gelibolu | Arıburnu",
            "Gelibolu – Arıburnu – Gelibolu – Arıburnu | Çanakkale Cephesi": (
                "Gelibolu – Arıburnu"
            ),
            "Gelibolu|Arıburnu|Gelibolu|Arıburnu": "Gelibolu|Arıburnu",
            "Arıburnu | Arıburnu | Arıburnu | Arıburnu": "Arıburnu | Arıburnu",
        }
        for title, expected in cases.items():
            self.assertEqual(mapper.normalize_title(title_page(title)), expected, title)

    def test_single_word_segment_repeat_is_kept(self):
        cases = {
            "Gelibolu – Gelibolu": "Gelibolu – Gelibolu",
            "Gelibolu - Gelibolu": "Gelibolu - Gelibolu",
            "Gelibolu — Gelibolu": "Gelibolu — Gelibolu",
            "GELİBOLU – Gelibolu": "GELİBOLU – Gelibolu",
            "Arıburnu | Arıburnu": "Arıburnu | Arıburnu",
            "Arıburnu|Arıburnu": "Arıburnu|Arıburnu",
            "Arıburnu | Arıburnu | Çanakkale Cephesi": "Arıburnu | Arıburnu",
            "Arıburnu | Arıburnu – Çanakkale Cephesi": "Arıburnu | Arıburnu",
            "Anafartalar | Anafartalar | Çanakkale Cephesi": "Anafartalar | Anafartalar",
            "Anafartalar | ANAFARTALAR": "Anafartalar | ANAFARTALAR",
            "Gelibolu | Gelibolu | Arıburnu": "Gelibolu | Gelibolu | Arıburnu",
        }
        for title, expected in cases.items():
            self.assertEqual(mapper.normalize_title(title_page(title)), expected, title)

    def test_separator_is_kept_as_written(self):
        cases = {
            "Gelibolu|Arıburnu": "Gelibolu|Arıburnu",
            "Gelibolu |Arıburnu | Çanakkale Cephesi": "Gelibolu |Arıburnu",
            "Gelibolu – Arıburnu — Kabatepe - Çanakkale Cephesi": (
                "Gelibolu – Arıburnu — Kabatepe"
            ),
        }
        for title, expected in cases.items():
            self.assertEqual(mapper.normalize_title(title_page(title)), expected, title)

    def test_site_suffix_is_not_a_repeat(self):
        self.assertEqual(
            mapper.normalize_title(title_page("Gelibolu | Çanakkale Cephesi")), "Gelibolu"
        )
        for title in (
            "Çanakkale Cephesi | Çanakkale Cephesi",
            "Çanakkale Cephesi – Çanakkale Cephesi",
        ):
            page = title_page(title)
            self.assertEqual(mapper.normalize_title(page), "", title)
            self.assertIsNone(mapper.candidate_from_page(page), title)

    def test_single_word_repeat_is_kept(self):
        cases = {
            "EVRAKA EVRAKA": "EVRAKA EVRAKA",
            "EVRAKA EVRAKA | Çanakkale Cephesi": "EVRAKA EVRAKA",
            "Bora Bora": "Bora Bora",
            "Bora Bora – Çanakkale Cephesi": "Bora Bora",
            "Bora Bora Adası": "Bora Bora Adası",
            "Bora Bora Adası | Çanakkale Cephesi": "Bora Bora Adası",
        }
        for title, expected in cases.items():
            self.assertEqual(mapper.normalize_title(title_page(title)), expected, title)

    def test_full_title_repeat_with_author_is_halved(self):
        single = "Türk Mayıncılığının Hızlı Dönüşümü – Hüseyin ARABACI"
        for title in (
            f"{single} {single}",
            f"{single} {single} | Çanakkale Cephesi",
            f"{single} {single} – Çanakkale Cephesi",
            f"{single} | {single}",
            f"{single} | {single} | Çanakkale Cephesi",
            f"{single} | {single} – Çanakkale Cephesi",
            f"{single} – Çanakkale Cephesi",
            single,
        ):
            result = mapper.normalize_title(title_page(title))
            self.assertEqual(result, single, title)
            self.assertIn(" – ", result, title)
            self.assertIn("Hüseyin ARABACI", result, title)

    def test_partial_or_non_repeats_are_kept(self):
        for title in (
            "Conkbayırı ve Conkbayırı Taarruzu",
            "Anafartalar Muharebesi ve Anafartalar Muharebesi Sonrası",
            "Kilitbahir Kalesi Kilitbahir",
            "Seddülbahir Çıkarması Seddülbahir Çıkarması Sonrası",
            "Bir İki Bir İki Üç",
            "Arıburnu-Kabatepe Arıburnu",
        ):
            self.assertEqual(mapper.normalize_title(title_page(title)), title, title)
        self.assertEqual(
            mapper.normalize_title(title_page("Anafartalar Muharebesi Anafartalar Muharebesi")),
            "Anafartalar Muharebesi",
        )

    def test_title_repeat_keeps_id_url_and_date(self):
        single = "Türk Mayıncılığının Hızlı Dönüşümü – Hüseyin ARABACI"
        page = title_page(
            f"{single} {single} | Çanakkale Cephesi", published_date="2015-03-18"
        )
        candidate = mapper.candidate_from_page(page)
        self.assertEqual(candidate["baslik"], single)
        self.assertEqual(candidate["url"], SLUG_URL)
        self.assertEqual(
            candidate["id"],
            "CC-" + hashlib.sha256(SLUG_URL.encode("utf-8")).hexdigest()[:12],
        )
        self.assertEqual(candidate["tarih"], "")
        self.assertIn("yayin_metasi=2015-03-18", candidate["notlar"])
        record = import_catalog.convert([candidate])["kayitlar"][0]
        self.assertEqual(record["durum"], "insan_incelemesi_gerekli")

    def test_site_suffix_is_removed(self):
        cases = {
            "Kilitbahir | Çanakkale Cephesi": "Kilitbahir",
            "Kilitbahir|Çanakkale Cephesi": "Kilitbahir",
            "Kilitbahir – Çanakkale Cephesi": "Kilitbahir",
            "Kilitbahir — Çanakkale Cephesi": "Kilitbahir",
            "Kilitbahir - çanakkale cephesi": "Kilitbahir",
            "Kilitbahir | ÇANAKKALE CEPHESİ ": "Kilitbahir",
            "  | Kilitbahir. |  Çanakkale Cephesi  ": "Kilitbahir",
            "Arıburnu-Kabatepe | Çanakkale Cephesi": "Arıburnu-Kabatepe",
            "Çanakkale Cephesi Komutanları | Çanakkale Cephesi": (
                "Çanakkale Cephesi Komutanları"
            ),
            "Kim kazandı? | Çanakkale Cephesi": "Kim kazandı?",
        }
        for title, expected in cases.items():
            self.assertEqual(mapper.normalize_title(title_page(title)), expected, title)

    def test_title_and_h1_both_invalid_is_skipped(self):
        page = title_page(
            ". | Çanakkale Cephesi",
            headings=[h1("Çanakkale Cephesi"), h1("|"), h1(None), "Düz metin"],
        )
        self.assertEqual(mapper.normalize_title(page), "")
        self.assertIsNone(mapper.candidate_from_page(page))
        self.assertEqual(mapper.candidates_from_pages([page]), [])

    def test_title_is_not_built_from_slug_or_body(self):
        page = title_page(
            "| Çanakkale Cephesi",
            headings=[h1("Seddülbahir Çıkarması", level=2), {"text": "Seviyesiz"}],
            canonical_url="https://www.canakkalecephesi.com/seddulbahir-cikarmasi/",
            text="Seddülbahir Çıkarması gövde metni",
            internal_links=["https://www.canakkalecephesi.com/seddulbahir"],
            images=["seddulbahir-cikarmasi.jpg"],
        )
        self.assertEqual(mapper.normalize_title(page), "")
        self.assertIsNone(mapper.candidate_from_page(page))

    def test_status_and_date_rules_kept_with_h1(self):
        page = title_page(
            "| Çanakkale Cephesi",
            headings=[h1("Seddülbahir")],
            published_date="1915-04-25",
        )
        candidate = mapper.candidate_from_page(page)
        self.assertEqual(list(candidate.keys()), list(import_catalog.COLUMNS))
        self.assertEqual(candidate["tarih"], "")
        self.assertEqual(candidate["url"], SLUG_URL)
        self.assertEqual(
            candidate["id"],
            "CC-" + hashlib.sha256(SLUG_URL.encode("utf-8")).hexdigest()[:12],
        )
        self.assertEqual(
            candidate["erisim_durumu"], "Ham arşiv kopyası; içerik doğrulanamadı"
        )
        self.assertIn("yayin_metasi=1915-04-25", candidate["notlar"])
        self.assertNotIn("iddia_destegi", candidate)
        self.assertNotIn("iddia_dogrulandi", candidate)
        record = import_catalog.convert([candidate])["kayitlar"][0]
        self.assertEqual(record["durum"], "insan_incelemesi_gerekli")
        self.assertFalse(record["iddia_destegi"])

    def test_non_dict_page_is_empty(self):
        self.assertEqual(mapper.normalize_title(None), "")
        self.assertEqual(mapper.normalize_title("Başlık"), "")


if __name__ == "__main__":
    unittest.main()
