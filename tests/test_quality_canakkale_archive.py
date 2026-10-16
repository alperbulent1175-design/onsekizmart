import contextlib
import io
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import preview_canakkale_archive as preview
import quality_canakkale_archive as quality

BASE = "https://www.canakkalecephesi.com/"
ROOT = BASE
BODY = "GOVDE 18 Mart 1915 kopyalanmamali"


def url(slug):
    return BASE + slug


def json_line(**fields):
    return json.dumps(fields, ensure_ascii=False)


def h1(text, level=1):
    return {"level": level, "text": text}


MIXED = [
    "",
    "{bu bozuk",
    json_line(title="URL yok"),
    json_line(url="javascript:alert(1)", title="Betik"),
    json_line(url=ROOT, title="Kök sayfa"),
    json_line(url=url("bos"), title="| Çanakkale Cephesi"),
    json_line(url=url("normal"), title="Kilitbahir | Çanakkale Cephesi",
              published_date="2015-03-18T10:00:00", text=BODY),
    json_line(url=url("normal"), title="Kilitbahir tekrar"),
    json_line(url=url("h1"), title="| Çanakkale Cephesi",
              headings=[h1("Seddülbahir Çıkarması")], published_date=""),
    json_line(url=url("parca"),
              title="Kabatepe Çıkarması | Kabatepe Çıkarması | Çanakkale Cephesi",
              published_date="18.03.2015"),
    json_line(url=url("bora"), title="Bora Bora | Çanakkale Cephesi",
              published_date="2019"),
    json_line(url=url("blok"),
              title="Anafartalar Muharebesi Anafartalar Muharebesi | Çanakkale Cephesi"),
    json_line(url=url("kisa"), title="Ece | Çanakkale Cephesi", published_date=1915),
    json_line(url=url("ayni-1"), title="Kilitbahir Kalesi | Çanakkale Cephesi"),
    json_line(url=url("ayni-2"), title="KİLİTBAHİR KALESİ"),
    json_line(url=url("farkli"), title="Kabatepe | Çanakkale Cephesi",
              headings=[h1("Bambaşka Bir Konu")]),
    json_line(url=url("koru"), title="Bora Bora Adası | Çanakkale Cephesi",
              headings=[h1("Bora Bora Adası")]),
]


class QualityCanakkaleArchiveTest(unittest.TestCase):
    def with_lines(self, lines, fn, name="girdi.jsonl"):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / name
            path.write_text("".join(line + "\n" for line in lines), encoding="utf-8")
            return fn(path, Path(tmp))

    def load(self, lines, limit=20):
        return self.with_lines(lines, lambda path, _: quality.quality_jsonl(path, limit))

    def flag(self, report, name):
        return report["bayraklar"][name]

    def flag_urls(self, report, name):
        return [row["url"] for row in report["bayraklar"][name]["ornekler"]]

    def test_all_skip_reasons_counted(self):
        report = self.load(MIXED)
        self.assertEqual(report["okunan"], len(MIXED))
        self.assertEqual(
            report["atlanan"],
            {
                "bos_satir": 1,
                "bozuk_json": 1,
                "gecersiz_veya_eksik_url": 2,
                "kok_sayfa": 1,
                "eksik_baslik": 1,
                "yinelenen_url": 1,
            },
        )
        self.assertEqual(report["aday"], 10)
        self.assertEqual(report["hatalar"], ["satır 2: bozuk_json"])
        self.assertEqual(
            report["aday"] + sum(report["atlanan"].values()), report["okunan"]
        )

    def test_counts_match_preview(self):
        def run(path, _):
            return quality.quality_jsonl(path), preview.preview_jsonl(path)

        for lines in (MIXED, [], ["", "  "], MIXED[::-1]):
            q, p = self.with_lines(lines, run)
            self.assertEqual(q["okunan"], p["okunan"])
            self.assertEqual(q["aday"], p["aday"])
            self.assertEqual(q["atlanan"], p["atlanan"])
            self.assertEqual(q["hatalar"], p["hatalar"])

    def test_title_source_distribution(self):
        report = self.load(MIXED)
        self.assertEqual(report["baslik_kaynagi"], {"html": 9, "h1": 1})
        self.assertEqual(self.flag_urls(report, "h1_kaynakli"), [url("h1")])
        row = self.flag(report, "h1_kaynakli")["ornekler"][0]
        self.assertEqual(row["ham_title"], "| Çanakkale Cephesi")
        self.assertEqual(row["ham_h1"], "Seddülbahir Çıkarması")
        self.assertEqual(row["baslik"], "Seddülbahir Çıkarması")

    def test_segment_repeat_flag(self):
        report = self.load(MIXED)
        self.assertEqual(self.flag_urls(report, "parca_tekrari_silindi"), [url("parca")])
        row = self.flag(report, "parca_tekrari_silindi")["ornekler"][0]
        self.assertEqual(
            row["ham_title"], "Kabatepe Çıkarması | Kabatepe Çıkarması | Çanakkale Cephesi"
        )
        self.assertEqual(row["baslik"], "Kabatepe Çıkarması")

    def test_single_word_repeat_is_kept_and_flagged(self):
        report = self.load(MIXED)
        self.assertEqual(self.flag(report, "tek_kelime_tekrari_silindi")["sayi"], 0)
        self.assertEqual(
            self.flag_urls(report, "tek_kelime_tekrari_korundu"),
            [url("bora"), url("koru")],
        )
        row = self.flag(report, "tek_kelime_tekrari_korundu")["ornekler"][0]
        self.assertEqual(row["ham_title"], "Bora Bora | Çanakkale Cephesi")
        self.assertEqual(row["baslik"], "Bora Bora")
        self.assertNotIn(url("bora"), self.flag_urls(report, "parca_tekrari_silindi"))

    def test_evraka_is_kept(self):
        report = self.load([json_line(url=url("evraka"), title="EVRAKA EVRAKA")])
        self.assertEqual(self.flag(report, "tek_kelime_tekrari_silindi")["sayi"], 0)
        row = self.flag(report, "tek_kelime_tekrari_korundu")["ornekler"][0]
        self.assertEqual(row["baslik"], "EVRAKA EVRAKA")

    def test_multi_word_repeat_flag_is_separate(self):
        report = self.load(MIXED)
        self.assertEqual(
            self.flag_urls(report, "cok_kelime_tekrari_silindi"),
            [url("parca"), url("blok")],
        )
        self.assertEqual(
            report["kelime_tekrari_ozeti"],
            {"yalnizca_kelime_tekrari": 1, "yalnizca_tek_kelime_tekrari": 0},
        )

    def test_separator_single_word_repeat_is_kept_and_flagged(self):
        titles = {
            "gelibolu-cizgi": ("Gelibolu – Gelibolu", "Gelibolu – Gelibolu"),
            "gelibolu-tire": ("Gelibolu - Gelibolu | Çanakkale Cephesi", "Gelibolu - Gelibolu"),
            "gelibolu-buyuk": ("GELİBOLU – Gelibolu", "GELİBOLU – Gelibolu"),
            "ariburnu": ("Arıburnu | Arıburnu", "Arıburnu | Arıburnu"),
            "ariburnu-site": (
                "Arıburnu | Arıburnu | Çanakkale Cephesi", "Arıburnu | Arıburnu"
            ),
            "ariburnu-bitisik": ("Arıburnu|Arıburnu", "Arıburnu|Arıburnu"),
            "evraka": ("EVRAKA EVRAKA", "EVRAKA EVRAKA"),
        }
        lines = [json_line(url=url(slug), title=title) for slug, (title, _) in titles.items()]
        lines.append(json_line(url=url("ariburnu-h1"), title="| Çanakkale Cephesi",
                               headings=[h1("Arıburnu | Arıburnu")]))
        lines.append(json_line(url=url("site"), title="Gelibolu | Çanakkale Cephesi"))
        report = self.load(lines)
        self.assertEqual(report["aday"], len(titles) + 2)
        korundu = [url(slug) for slug in titles] + [url("ariburnu-h1")]
        self.assertEqual(self.flag_urls(report, "tek_kelime_tekrari_korundu"), korundu)
        for row in self.flag(report, "tek_kelime_tekrari_korundu")["ornekler"]:
            slug = row["url"][len(BASE):]
            if slug in titles:
                self.assertEqual(row["baslik"], titles[slug][1])
        self.assertEqual(self.flag(report, "tek_kelime_tekrari_silindi")["sayi"], 0)
        self.assertEqual(self.flag(report, "parca_tekrari_silindi")["sayi"], 0)
        self.assertEqual(self.flag(report, "cok_kelime_tekrari_silindi")["sayi"], 0)
        self.assertEqual(
            report["kelime_tekrari_ozeti"],
            {"yalnizca_kelime_tekrari": 0, "yalnizca_tek_kelime_tekrari": 0},
        )

    def test_two_word_segment_block_is_flagged_as_multi_word(self):
        report = self.load([
            json_line(url=url("ab"), title="Gelibolu | Arıburnu | Gelibolu | Arıburnu"),
        ])
        row = self.flag(report, "parca_tekrari_silindi")["ornekler"][0]
        self.assertEqual(row["baslik"], "Gelibolu | Arıburnu")
        self.assertEqual(self.flag_urls(report, "cok_kelime_tekrari_silindi"), [url("ab")])
        self.assertEqual(self.flag(report, "tek_kelime_tekrari_silindi")["sayi"], 0)
        self.assertEqual(self.flag(report, "tek_kelime_tekrari_korundu")["sayi"], 0)

    def test_single_word_deletion_regression_is_caught(self):
        # Mapper gelecekte tek kelimeyi yeniden silerse bayrak bunu göstermeli.
        for ham, baslik in (
            ("Gelibolu – Gelibolu", "Gelibolu"),
            ("Arıburnu | Arıburnu | Çanakkale Cephesi", "Arıburnu"),
            ("EVRAKA EVRAKA", "EVRAKA"),
        ):
            found = quality._tekrar_bayraklari(ham, baslik)
            self.assertIn("tek_kelime_tekrari_silindi", found, ham)
            self.assertNotIn("tek_kelime_tekrari_korundu", found, ham)
        self.assertEqual(
            quality._tekrar_bayraklari("Gelibolu | Çanakkale Cephesi", "Gelibolu"), set()
        )

    def test_full_title_repeat_with_author_is_flagged(self):
        single = "Türk Mayıncılığının Hızlı Dönüşümü – Hüseyin ARABACI"
        lines = [
            json_line(url=url("mayin-bosluk"), title=f"{single} {single} | Çanakkale Cephesi"),
            json_line(url=url("mayin-cizgi"), title=f"{single} | {single} – Çanakkale Cephesi"),
        ]
        report = self.load(lines)
        for row in self.flag(report, "cok_kelime_tekrari_silindi")["ornekler"]:
            self.assertEqual(row["baslik"], single)
        self.assertEqual(
            self.flag_urls(report, "cok_kelime_tekrari_silindi"),
            [url("mayin-bosluk"), url("mayin-cizgi")],
        )
        self.assertEqual(self.flag(report, "tek_kelime_tekrari_silindi")["sayi"], 0)
        self.assertEqual(
            self.flag_urls(report, "ayni_baslik_farkli_url"),
            [url("mayin-bosluk"), url("mayin-cizgi")],
        )
        self.assertEqual(report["aday"], 2)

    def test_short_title_flag(self):
        report = self.load(MIXED)
        self.assertIn(url("kisa"), self.flag_urls(report, "kisa_baslik"))
        self.assertNotIn(url("bora"), self.flag_urls(report, "kisa_baslik"))
        self.assertNotIn(url("normal"), self.flag_urls(report, "kisa_baslik"))
        for row in self.flag(report, "kisa_baslik")["ornekler"]:
            self.assertLess(len(row["baslik"]), quality.KISA_BASLIK_ESIGI)

    def test_same_title_different_url_flag(self):
        report = self.load(MIXED)
        self.assertEqual(
            self.flag_urls(report, "ayni_baslik_farkli_url"),
            [url("ayni-1"), url("ayni-2")],
        )
        self.assertNotIn(url("normal"), self.flag_urls(report, "ayni_baslik_farkli_url"))

    def test_h1_differs_from_html_flag(self):
        report = self.load(MIXED)
        self.assertEqual(self.flag_urls(report, "h1_html_farkli"), [url("farkli")])

    def test_publication_year_distribution(self):
        report = self.load(MIXED)
        self.assertEqual(
            report["yayin_yili"]["aciklama"],
            "Yayın yılı (web sayfası metaverisi; olay tarihi değildir)",
        )
        self.assertEqual(
            report["yayin_yili"]["dagilim"],
            {"2015": 1, "2019": 1, "bilinmiyor": 6, "gecersiz": 2},
        )
        for value, expected in {
            "2015-03-18": "2015",
            " 2015/03 ": "2015",
            "20150318": "gecersiz",
            "18.03.2015": "gecersiz",
            "Mart 2015": "gecersiz",
            None: "bilinmiyor",
            "  ": "bilinmiyor",
            1915: "gecersiz",
        }.items():
            self.assertEqual(quality.yayin_yili(value), expected, value)

    def test_year_not_moved_to_date_or_event_field(self):
        report = self.load([
            json_line(url=url("olay"), title="Örnek sayfa",
                      published_date="1915-03-18", text=BODY),
        ])
        self.assertEqual(report["yayin_yili"]["dagilim"], {"1915": 1})
        rest = {key: value for key, value in report.items() if key != "yayin_yili"}
        blob = json.dumps(rest, ensure_ascii=False)
        self.assertNotIn("1915", blob)
        self.assertNotIn("tarih", blob)
        self.assertNotIn(BODY, json.dumps(report, ensure_ascii=False))

    def test_limit_trims_examples_not_counts(self):
        lines = [
            json_line(url=url(f"bora-{i}"), title=f"Bora{i} Bora{i}") for i in range(5)
        ]
        full = self.load(lines)
        short = self.load(lines, limit=2)
        for report in (full, short):
            self.assertEqual(report["aday"], 5)
            self.assertEqual(self.flag(report, "tek_kelime_tekrari_korundu")["sayi"], 5)
            self.assertEqual(
                report["url_yapisi"]["siniflar"]["olasi_makale"]["sayi"], 5
            )
        self.assertEqual(len(self.flag(full, "tek_kelime_tekrari_korundu")["ornekler"]), 5)
        self.assertEqual(len(self.flag(short, "tek_kelime_tekrari_korundu")["ornekler"]), 2)
        self.assertEqual(
            len(short["url_yapisi"]["siniflar"]["olasi_makale"]["ornekler"]), 2
        )
        self.assertEqual(full["kelime_tekrari_ozeti"], short["kelime_tekrari_ozeti"])
        self.assertEqual(full["yayin_yili"], short["yayin_yili"])

    def test_limit_must_be_positive(self):
        def run(path, _):
            for bad in (0, -1, True, "3"):
                with self.assertRaises(ValueError):
                    quality.quality_jsonl(path, limit=bad)
            with contextlib.redirect_stderr(io.StringIO()):
                for bad in ("0", "-1", "x"):
                    with self.assertRaises(SystemExit):
                        quality.main(["--input", str(path), "--limit", bad])
                with self.assertRaises(SystemExit):
                    quality.main([])

        self.with_lines([], run)

    def test_missing_file_is_a_clear_error(self):
        with tempfile.TemporaryDirectory() as tmp:
            missing = Path(tmp) / "yok.jsonl"
            with self.assertRaises(FileNotFoundError) as caught:
                quality.quality_jsonl(missing)
            self.assertIn("bulunamadı", str(caught.exception))
            with self.assertRaises(SystemExit) as exited:
                quality.main(["--input", str(missing)])
            self.assertIn("bulunamadı", str(exited.exception))
            self.assertEqual(os.listdir(tmp), [])

    def test_empty_file_reports_clearly(self):
        def run(path, _):
            buffer = io.StringIO()
            with contextlib.redirect_stdout(buffer):
                report = quality.main(["--input", str(path)])
            return report, buffer.getvalue()

        report, printed = self.with_lines([], run)
        self.assertTrue(report["bos_dosya"])
        self.assertEqual(report["okunan"], 0)
        self.assertEqual(report["aday"], 0)
        self.assertEqual(report["yayin_yili"]["dagilim"], {})
        self.assertIn("girdi dosyası boş", printed)

    def test_writes_no_output_file_and_opens_read_only(self):
        def run(path, directory):
            seen = []
            real_open = open

            def spy(file, *args, **kwargs):
                seen.append((args[0] if args else kwargs.get("mode", "r"),
                             kwargs.get("encoding")))
                return real_open(file, *args, **kwargs)

            buffer = io.StringIO()
            with mock.patch("builtins.open", spy), contextlib.redirect_stdout(buffer):
                quality.main(["--input", str(path), "--limit", "3"])
            self.assertEqual(seen, [("r", "utf-8")])
            self.assertEqual(os.listdir(directory), ["girdi.jsonl"])
            return buffer.getvalue()

        printed = self.with_lines(MIXED, run)
        self.assertIn("Yayın yılı (web sayfası metaverisi; olay tarihi değildir)", printed)
        self.assertIn("tek_kelime_tekrari_silindi: 0", printed)
        self.assertIn("tek_kelime_tekrari_korundu: 2", printed)
        self.assertIn("yalnızca inceleme içindir", printed)
        self.assertIn("URL yapısı (sezgi; içerik türü değildir)", printed)

    def test_no_iddia_dogrulandi_anywhere(self):
        def run(path, _):
            buffer = io.StringIO()
            with contextlib.redirect_stdout(buffer):
                report = quality.main(["--input", str(path)])
            return report, buffer.getvalue()

        report, printed = self.with_lines(MIXED, run)
        self.assertNotIn("iddia_dogrulandi", json.dumps(report, ensure_ascii=False))
        self.assertNotIn("iddia_dogrulandi", printed)
        source = Path(quality.__file__).read_text(encoding="utf-8")
        self.assertNotIn("iddia_dogrulandi", source)


URL_LINES = [
    json_line(url=url("anafartalar/attachment/harita/"), title="Harita"),
    json_line(url=url("wp-content/uploads/2015/03/harita.jpg"), title="Harita dosyası"),
    json_line(url=url("anafartalar/harita-jpg/"), title="harita-jpg"),
    json_line(url=url("kilitbahir-kalesi/?replytocom=123"), title="Kilitbahir Kalesi"),
    json_line(url=url("kilitbahir-kalesi/"), title="Kilitbahir Kalesi | Çanakkale Cephesi"),
    json_line(url=url("anafartalar/attachment/foto/?replytocom=9"), title="Foto"),
    json_line(url=url("category/muharebeler/"), title="Muharebeler"),
    json_line(url=url("tag/bouvet/"), title="Bouvet etiketi"),
    json_line(url=url("conkbayiri-taarruzu.html"), title="Conkbayırı Taarruzu"),
    json_line(url=url("2015/03/"), title="Mart arşivi"),
]


class UrlStructureTest(unittest.TestCase):
    def with_lines(self, lines, fn):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "girdi.jsonl"
            path.write_text("".join(line + "\n" for line in lines), encoding="utf-8")
            return fn(path, Path(tmp))

    def load(self, lines, limit=20):
        return self.with_lines(lines, lambda path, _: quality.quality_jsonl(path, limit))

    def test_url_class_rules(self):
        cases = {
            url("anafartalar/attachment/harita/"): "olasi_ek_sayfasi",
            url("attachment/123"): "olasi_ek_sayfasi",
            url("wp-content/uploads/2015/03/harita.jpg"): "olasi_ek_sayfasi",
            url("harita.JPEG"): "olasi_ek_sayfasi",
            url("anafartalar/harita-jpg/"): "olasi_ek_sayfasi",
            url("anafartalar/harita_png-2/"): "olasi_ek_sayfasi",
            url("img-1234/"): "olasi_ek_sayfasi",
            url("dsc01234"): "olasi_ek_sayfasi",
            url("image-12/"): "olasi_ek_sayfasi",
            url("kilitbahir-kalesi/?replytocom=123"): "sorgu_parametreli_url",
            url("anafartalar/attachment/foto/?replytocom=9"): "sorgu_parametreli_url",
            url("kilitbahir-kalesi/"): "olasi_makale",
            url("kilitbahir"): "olasi_makale",
            url("2015/03/18/seddulbahir-cikarmasi/"): "olasi_makale",
            url("conkbayiri-taarruzu.html"): "olasi_makale",
            url("ari%C3%A7burnu-cikarmasi/"): "olasi_makale",
            url("category/muharebeler/"): "belirsiz",
            url("tag/bouvet/"): "belirsiz",
            url("author/admin/"): "belirsiz",
            url("page/2/"): "belirsiz",
            url("muharebeler/page/3/"): "belirsiz",
            url("feed/"): "belirsiz",
            url("2015/03/"): "belirsiz",
            url("belge.pdf"): "belirsiz",
            url("a/b/c/d/uzun-yol"): "belirsiz",
            url("h1"): "belirsiz",
            url("sayfa#bolum"): "olasi_makale",
        }
        for address, expected in cases.items():
            self.assertEqual(quality.url_sinifi(address), expected, address)

    def test_query_wins_over_attachment(self):
        address = url("anafartalar/attachment/foto/?replytocom=9")
        self.assertEqual(quality.url_sinifi(address), "sorgu_parametreli_url")
        self.assertEqual(quality.URL_SINIF_KURALLARI[0][0], "sorgu_parametreli_url")

    def test_class_counts_and_examples(self):
        report = self.load(URL_LINES, limit=1)
        yapi = report["url_yapisi"]
        self.assertEqual(yapi["aciklama"], "URL yapısı (sezgi; içerik türü değildir)")
        counts = {ad: sinif["sayi"] for ad, sinif in yapi["siniflar"].items()}
        self.assertEqual(
            counts,
            {
                "olasi_makale": 2,
                "olasi_ek_sayfasi": 3,
                "sorgu_parametreli_url": 2,
                "belirsiz": 3,
            },
        )
        self.assertEqual(sum(counts.values()), report["aday"])
        for sinif in yapi["siniflar"].values():
            self.assertEqual(len(sinif["ornekler"]), 1)
        self.assertEqual(
            yapi["siniflar"]["olasi_ek_sayfasi"]["ornekler"][0]["url"],
            url("anafartalar/attachment/harita/"),
        )

    def test_classification_does_not_change_counts(self):
        def run(path, _):
            return quality.quality_jsonl(path), preview.preview_jsonl(path)

        for lines in (URL_LINES, URL_LINES + MIXED, MIXED + URL_LINES):
            q, p = self.with_lines(lines, run)
            self.assertEqual(q["okunan"], p["okunan"])
            self.assertEqual(q["aday"], p["aday"])
            self.assertEqual(q["atlanan"], p["atlanan"])
            total = sum(s["sayi"] for s in q["url_yapisi"]["siniflar"].values())
            self.assertEqual(total, q["aday"])
        q, _ = self.with_lines(URL_LINES, run)
        self.assertEqual(q["aday"], len(URL_LINES))
        self.assertEqual(sum(q["atlanan"].values()), 0)

    def test_same_title_query_variant_both_counted(self):
        report = self.load(URL_LINES)
        self.assertEqual(report["aday"], len(URL_LINES))
        same = [row["url"] for row in report["bayraklar"]["ayni_baslik_farkli_url"]["ornekler"]]
        self.assertEqual(
            same, [url("kilitbahir-kalesi/?replytocom=123"), url("kilitbahir-kalesi/")]
        )
        extra = report["url_yapisi"]["sorgusuz_url_de_var"]
        self.assertEqual(extra["sayi"], 1)
        self.assertEqual(extra["ornekler"][0]["url"], url("kilitbahir-kalesi/?replytocom=123"))
        alone = self.load([json_line(url=url("tek/?replytocom=5"), title="Tek")])
        self.assertEqual(alone["url_yapisi"]["sorgusuz_url_de_var"]["sayi"], 0)
        self.assertEqual(
            alone["url_yapisi"]["siniflar"]["sorgu_parametreli_url"]["sayi"], 1
        )

    def test_url_class_reads_only_url(self):
        page_url = url("kilitbahir-kalesi/")
        a = self.load([json_line(url=page_url, title="IMG-1234.jpg",
                                 headings=[h1("attachment")], text="foto.jpg")])
        self.assertEqual(a["url_yapisi"]["siniflar"]["olasi_makale"]["sayi"], 1)

    def test_no_output_file_and_no_verified_status(self):
        def run(path, directory):
            buffer = io.StringIO()
            with contextlib.redirect_stdout(buffer):
                report = quality.main(["--input", str(path), "--limit", "2"])
            self.assertEqual(os.listdir(directory), ["girdi.jsonl"])
            return report, buffer.getvalue()

        report, printed = self.with_lines(URL_LINES, run)
        self.assertIn("olasi_ek_sayfasi: 3", printed)
        self.assertIn("sorgusuz_url_de_var: 1", printed)
        self.assertIn("içerik türü değildir", printed)
        self.assertNotIn("iddia_dogrulandi", printed)
        self.assertNotIn("iddia_dogrulandi", json.dumps(report, ensure_ascii=False))


WP_DATED_CASES = {
    "index.php/2023/03/13/tarihsel-surecinde-canakkale-bogaz-savunmasi/": "olasi_makale",
    "index.php/2022/12/26/19uncu-piyade-alayi/?replytocom=1536": "sorgu_parametreli_url",
    "index.php/2022/12/26/makale/1-1/": "olasi_ek_sayfasi",
    "index.php/2022/12/26/makale/1-2/": "olasi_ek_sayfasi",
    "index.php/2022/12/26/makale/2-1/": "olasi_ek_sayfasi",
    "index.php/2022/12/26/makale/kapak2-1/": "olasi_ek_sayfasi",
    "index.php/2022/12/26/makale/attachment/1/": "olasi_ek_sayfasi",
    "index.php/2022/12/26/makale/image_750x_622e5a09b364e/": "olasi_ek_sayfasi",
    "index.php/2022/12/26/makale/12/": "olasi_ek_sayfasi",
    "index.php/2022/12/26/makale/img-1234/": "olasi_ek_sayfasi",
    "index.php/2022/12/26/makale/harita-jpg/": "olasi_ek_sayfasi",
    "index.php/2022/12/26/img-1234/": "olasi_ek_sayfasi",
    "index.php/category/tarih/": "belirsiz",
    "index.php/tag/x/": "belirsiz",
    "index.php/author/y/": "belirsiz",
    "index.php/page/2/": "belirsiz",
    "index.php/feed/": "belirsiz",
    "index.php/wp-json/": "belirsiz",
    "index.php/2022/12/26/makale/feed/": "belirsiz",
    "index.php/2022/": "belirsiz",
    "index.php/2022/12/": "belirsiz",
    "index.php/2022/12/26/": "belirsiz",
    "index.php/2022/12/26/makale/baska-yazi/": "belirsiz",
    "index.php/2022/12/26/a/b/c/": "belirsiz",
    "index.php/2022/12/26/ab/": "belirsiz",
    "index.php/2022/12/26/19uncu-piyade-alayi/": "olasi_makale",
    "index.php/2022/12/26/57-alay/": "olasi_makale",
    "index.php/2022/12/26/kapak2-1/": "olasi_makale",
    "index.php/2022/12/26/makale.html": "olasi_makale",
    "index.php/9999/99/99/ornek-yazi/": "olasi_makale",
    "index.php/202/12/26/x-yazi/": "belirsiz",
    "index.php/2022/1/26/x-yazi/": "belirsiz",
    "202/12/26/x-yazi/": "olasi_makale",
    "2022/12/26/makale-slug/": "olasi_makale",
    "2022/12/26/makale-slug/1-1/": "olasi_ek_sayfasi",
    "index.php/hakkimizda/": "belirsiz",
    "index.php": "belirsiz",
    "eski/index.php/2022/12/26/makale-slug/": "belirsiz",
    "hakkimizda/": "olasi_makale",
    "57-alay/": "olasi_makale",
    "kapak2-1/": "olasi_makale",
}


class WordPressDatedPathTest(unittest.TestCase):
    with_lines = UrlStructureTest.with_lines

    def test_dated_path_classes(self):
        for path, expected in WP_DATED_CASES.items():
            self.assertEqual(quality.url_sinifi(url(path)), expected, path)

    def test_index_php_prefix_only_at_start(self):
        self.assertEqual(
            quality.url_sinifi(url("index.php/2022/12/26/makale-slug/")), "olasi_makale"
        )
        self.assertEqual(
            quality.url_sinifi(url("Index.PHP/2022/12/26/makale-slug/")), "olasi_makale"
        )
        self.assertEqual(
            quality.url_sinifi(url("index.php/index.php/2022/12/26/makale-slug/")), "belirsiz"
        )

    def test_rule_order_is_documented(self):
        siniflar = [ad for ad, _ in quality.URL_SINIF_KURALLARI]
        self.assertEqual(
            siniflar,
            [
                "sorgu_parametreli_url",
                "olasi_ek_sayfasi",
                "belirsiz",
                "olasi_makale",
                "olasi_ek_sayfasi",
                "belirsiz",
                "belirsiz",
                "olasi_makale",
                "belirsiz",
            ],
        )
        self.assertIn("takvim denetlenmez", quality.URL_ONEK_NOTU)

    def test_dated_jsonl_counts_match_preview(self):
        def run(path, _):
            buffer = io.StringIO()
            with contextlib.redirect_stdout(buffer):
                report = quality.main(["--input", str(path)])
            return report, preview.preview_jsonl(path), buffer.getvalue()

        dated = "index.php/2022/12/26/19uncu-piyade-alayi/"
        lines = [
            json_line(url=url(dated), title="19. Piyade Alayı | Çanakkale Cephesi",
                      published_date="2022-12-26T10:00:00"),
            json_line(url=url("index.php/2023/03/13/bogaz-savunmasi/"),
                      title="Boğaz Savunması", published_date="2023-03-13"),
            json_line(url=url(dated + "1-1/"), title="1-1"),
            json_line(url=url(dated + "kapak2-1/"), title="kapak2-1"),
            json_line(url=url(dated + "?replytocom=1536"), title="19. Piyade Alayı"),
            json_line(url=url("index.php/category/tarih/"), title="Tarih"),
            json_line(url=url("index.php/2022/12/26/"), title="26 Aralık arşivi"),
            json_line(url=url(dated), title="Yinelenen"),
            "",
        ]
        report, p, printed = self.with_lines(lines, run)
        yapi = report["url_yapisi"]
        counts = {ad: sinif["sayi"] for ad, sinif in yapi["siniflar"].items()}
        self.assertEqual(
            counts,
            {
                "olasi_makale": 2,
                "olasi_ek_sayfasi": 2,
                "sorgu_parametreli_url": 1,
                "belirsiz": 2,
            },
        )
        self.assertEqual(sum(counts.values()), report["aday"])
        self.assertEqual(report["aday"], 7)
        self.assertEqual(report["aday"], p["aday"])
        self.assertEqual(report["okunan"], p["okunan"])
        self.assertEqual(report["atlanan"], p["atlanan"])
        self.assertEqual(report["atlanan"]["yinelenen_url"], 1)
        self.assertEqual(report["atlanan"]["bos_satir"], 1)
        self.assertEqual(yapi["sorgusuz_url_de_var"]["sayi"], 1)
        self.assertEqual(
            yapi["sorgusuz_url_de_var"]["ornekler"][0]["url"], url(dated + "?replytocom=1536")
        )
        self.assertEqual(
            report["yayin_yili"]["dagilim"], {"2022": 1, "2023": 1, "bilinmiyor": 5}
        )
        self.assertIn("URL yapısı (sezgi; içerik türü değildir)", printed)
        self.assertIn("olasi_makale: 2", printed)


if __name__ == "__main__":
    unittest.main()
