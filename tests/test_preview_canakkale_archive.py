import contextlib
import io
import json
import os
import tempfile
import unittest
from unittest import mock
from pathlib import Path

import map_canakkale_aday as mapper
import preview_canakkale_archive as preview

PAGE = "https://www.canakkalecephesi.com/ornek-sayfa"
ROOT = "https://www.canakkalecephesi.com/"
BODY = "GOVDE kopyalanmamali XYZ"


def json_line(**fields):
    return json.dumps(fields, ensure_ascii=False)


class PreviewCanakkaleArchiveTest(unittest.TestCase):
    def with_lines(self, lines, fn, name="girdi.jsonl"):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / name
            payload = []
            for line in lines:
                payload.append(line if line.endswith("\n") else line + "\n")
            path.write_text("".join(payload), encoding="utf-8")
            return fn(path, Path(tmp))

    def load(self, lines, limit=20):
        return self.with_lines(
            lines, lambda path, directory: preview.preview_jsonl(path, limit=limit)
        )

    def assert_balanced(self, report):
        self.assertEqual(
            set(report),
            {"okunan", "aday", "atlanan", "adaylar", "hatalar"},
        )
        self.assertEqual(
            set(report["atlanan"]),
            {
                "bos_satir",
                "bozuk_json",
                "gecersiz_veya_eksik_url",
                "kok_sayfa",
                "eksik_baslik",
                "yinelenen_url",
            },
        )
        self.assertEqual(
            report["aday"] + sum(report["atlanan"].values()),
            report["okunan"],
        )

    def test_two_valid_rows(self):
        first = PAGE
        second = "https://www.canakkalecephesi.com/ikinci"
        report = self.load(
            [
                json_line(url=first, title="Birinci", text=BODY),
                json_line(url=second, title="İkinci"),
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["okunan"], 2)
        self.assertEqual(report["aday"], 2)
        self.assertEqual(len(report["adaylar"]), 2)
        self.assertEqual(report["adaylar"][0]["url"], first)
        self.assertEqual(report["adaylar"][0]["baslik"], "Birinci")
        self.assertEqual(report["adaylar"][1]["url"], second)
        self.assertEqual(report["adaylar"][1]["baslik"], "İkinci")
        self.assertEqual(
            report["adaylar"][0]["durum_notu"], "insan_incelemesi_gerekli"
        )
        self.assertIn("doğrulanamadı", report["adaylar"][0]["erisim_durumu"])
        expected = mapper.candidate_from_page({"url": first, "title": "Birinci"})
        self.assertEqual(report["adaylar"][0]["id"], expected["id"])
        self.assertNotIn(BODY, json.dumps(report, ensure_ascii=False))
        self.assertEqual(sum(report["atlanan"].values()), 0)

    def test_missing_url_is_skipped(self):
        report = self.load(
            [
                json_line(title="Başlık var"),
                "{}",
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 0)
        self.assertEqual(report["adaylar"], [])
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 2)
        self.assertEqual(report["atlanan"]["eksik_baslik"], 0)
        self.assertEqual(report["atlanan"]["kok_sayfa"], 0)

    def test_javascript_url_is_skipped(self):
        report = self.load(
            [json_line(url="javascript:alert(1)", title="Betik")]
        )
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 0)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 1)
        self.assertEqual(report["atlanan"]["kok_sayfa"], 0)

    def test_root_page_is_skipped(self):
        report = self.load([json_line(url=ROOT, title="Kök sayfa")])
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 0)
        self.assertEqual(report["atlanan"]["kok_sayfa"], 1)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 0)

    def test_published_date_is_not_written_to_tarih(self):
        report = self.load(
            [
                json_line(
                    url=PAGE,
                    title="Örnek sayfa",
                    published_date="1915-03-18",
                    text=BODY,
                )
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 1)
        row = report["adaylar"][0]
        self.assertEqual(row["tarih"], "")
        for value in row.values():
            self.assertNotIn("1915-03-18", str(value))

    def test_empty_title_is_skipped(self):
        report = self.load(
            [
                json_line(url=PAGE, title=""),
                json_line(
                    url="https://www.canakkalecephesi.com/bosluk", title="   "
                ),
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 0)
        self.assertEqual(report["atlanan"]["eksik_baslik"], 2)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 0)

    def test_site_name_title_uses_h1_or_is_skipped(self):
        report = self.load(
            [
                json_line(
                    url=PAGE,
                    title="| Çanakkale Cephesi",
                    headings=[{"level": 1, "text": "Seddülbahir"}],
                ),
                json_line(
                    url="https://www.canakkalecephesi.com/h1-yok",
                    title=". | Çanakkale Cephesi",
                ),
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 1)
        self.assertEqual(report["adaylar"][0]["baslik"], "Seddülbahir")
        self.assertEqual(
            report["atlanan"]["eksik_baslik"]
            + report["atlanan"]["gecersiz_veya_eksik_url"],
            1,
        )

    def test_site_name_title_counted_as_missing_title(self):
        report = self.load(
            [
                json_line(
                    url="https://www.canakkalecephesi.com/h1-yok",
                    title="| Çanakkale Cephesi",
                )
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 0)
        self.assertEqual(report["atlanan"]["eksik_baslik"], 1)

    def test_site_name_title_with_valid_h1_is_counted(self):
        report = self.load(
            [
                json_line(
                    url=PAGE,
                    title="| Çanakkale Cephesi",
                    headings=[{"level": 1, "text": "Arıburnu"}],
                )
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 1)
        self.assertEqual(report["adaylar"][0]["baslik"], "Arıburnu")
        self.assertEqual(sum(report["atlanan"].values()), 0)

    def test_site_name_title_with_invalid_h1_is_missing_title(self):
        report = self.load(
            [
                json_line(
                    url=PAGE,
                    title="| Çanakkale Cephesi",
                    headings=[
                        {"level": 1, "text": " | Çanakkale Cephesi"},
                        {"level": 1, "text": "..."},
                        {"level": 2, "text": "Alt başlık sayılmaz"},
                    ],
                )
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 0)
        self.assertEqual(report["atlanan"]["eksik_baslik"], 1)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 0)

    def test_invalid_url_with_invalid_title_is_url_reason(self):
        report = self.load(
            [
                json_line(title="| Çanakkale Cephesi"),
                json_line(url="javascript:alert(1)", title=""),
                json_line(url=ROOT, title="| Çanakkale Cephesi"),
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 0)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 2)
        self.assertEqual(report["atlanan"]["kok_sayfa"], 1)
        self.assertEqual(report["atlanan"]["eksik_baslik"], 0)

    def test_non_object_json_is_url_reason(self):
        report = self.load(["[1, 2]", '"metin"'])
        self.assert_balanced(report)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 2)
        self.assertEqual(report["atlanan"]["bozuk_json"], 0)

    def test_mapper_mismatch_is_a_clear_error(self):
        with mock.patch.object(mapper, "candidate_from_page", return_value=None):
            with self.assertRaises(RuntimeError) as caught:
                self.load([json_line(url=PAGE, title="Geçerli")])
        self.assertIn("satır 1", str(caught.exception))

    def test_duplicate_url_counted_once(self):
        report = self.load(
            [
                json_line(url=PAGE, title="İlk"),
                json_line(url=PAGE, title="İkinci"),
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 1)
        self.assertEqual(report["atlanan"]["yinelenen_url"], 1)
        self.assertEqual(len(report["adaylar"]), 1)
        self.assertEqual(report["adaylar"][0]["baslik"], "İlk")
        self.assertEqual(report["adaylar"][0]["url"], PAGE)

    def test_broken_json_does_not_stop(self):
        report = self.load(
            [
                "{bu bozuk",
                json_line(
                    url="https://www.canakkalecephesi.com/sonraki",
                    title="Sonraki",
                ),
            ]
        )
        self.assert_balanced(report)
        self.assertEqual(report["okunan"], 2)
        self.assertEqual(report["atlanan"]["bozuk_json"], 1)
        self.assertEqual(report["hatalar"], ["satır 1: bozuk_json"])
        self.assertEqual(report["aday"], 1)
        self.assertEqual(report["adaylar"][0]["baslik"], "Sonraki")

    def test_empty_file_reports_zero_candidates(self):
        report = self.load([])
        self.assert_balanced(report)
        self.assertEqual(report["okunan"], 0)
        self.assertEqual(report["aday"], 0)
        self.assertEqual(report["adaylar"], [])
        self.assertEqual(report["hatalar"], [])

    def test_blank_lines_only_reports_zero_candidates(self):
        report = self.load(["", "", "   "])
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 0)
        self.assertEqual(report["adaylar"], [])
        self.assertEqual(report["okunan"], 3)
        self.assertEqual(report["atlanan"]["bos_satir"], 3)

    def test_missing_file_is_a_clear_error(self):
        with tempfile.TemporaryDirectory() as tmp:
            missing = Path(tmp) / "yok.jsonl"
            with self.assertRaises(FileNotFoundError) as caught:
                preview.preview_jsonl(missing)
            self.assertIn("bulunamadı", str(caught.exception))
            with contextlib.redirect_stderr(io.StringIO()):
                with self.assertRaises(SystemExit) as exited:
                    preview.main(["--input", str(missing)])
            self.assertIn("bulunamadı", str(exited.exception))
            self.assertEqual(os.listdir(tmp), [])
            self.assertFalse(missing.exists())

    def test_limit_trims_list_not_count(self):
        lines = [
            json_line(url="https://www.canakkalecephesi.com/bir", title="Bir"),
            json_line(url="https://www.canakkalecephesi.com/iki", title="İki"),
            json_line(url="https://www.canakkalecephesi.com/uc", title="Üç"),
        ]
        report = self.load(lines, limit=2)
        self.assert_balanced(report)
        self.assertEqual(report["okunan"], 3)
        self.assertEqual(report["aday"], 3)
        self.assertEqual(len(report["adaylar"]), 2)
        self.assertEqual(
            [row["baslik"] for row in report["adaylar"]],
            ["Bir", "İki"],
        )
        self.assertEqual(
            [row["url"] for row in report["adaylar"]],
            [
                "https://www.canakkalecephesi.com/bir",
                "https://www.canakkalecephesi.com/iki",
            ],
        )

    def test_default_limit_lists_twenty(self):
        lines = [
            json_line(
                url=f"https://www.canakkalecephesi.com/sayfa-{index}",
                title=f"Sayfa {index}",
            )
            for index in range(25)
        ]
        report = self.load(lines)
        self.assert_balanced(report)
        self.assertEqual(report["aday"], 25)
        self.assertEqual(len(report["adaylar"]), 20)

        def run(path, directory):
            buffer = io.StringIO()
            with contextlib.redirect_stdout(buffer):
                returned = preview.main(["--input", str(path)])
            return returned, buffer.getvalue()

        returned, printed = self.with_lines(lines, run)
        self.assertEqual(returned["aday"], 25)
        self.assertEqual(len(returned["adaylar"]), 20)
        self.assertIn("Geçerli aday: 25", printed)
        self.assertIn("https://www.canakkalecephesi.com/sayfa-0", printed)
        self.assertNotIn("https://www.canakkalecephesi.com/sayfa-20", printed)

    def test_writes_no_output_file(self):
        def run(path, directory):
            before = set(os.listdir(directory))
            preview.preview_jsonl(path)
            buffer = io.StringIO()
            with contextlib.redirect_stdout(buffer):
                preview.main(["--input", str(path), "--limit", "5"])
            after = set(os.listdir(directory))
            self.assertEqual(before, {"girdi.jsonl"})
            self.assertEqual(after, before)
            text = buffer.getvalue()
            self.assertIn(PAGE, text)
            self.assertIn("Örnek başlık", text)
            self.assertIn("insan_incelemesi_gerekli", text)

        self.with_lines([json_line(url=PAGE, title="Örnek başlık")], run)

    def test_report_has_no_iddia_dogrulandi(self):
        report = self.load([json_line(url=PAGE, title="Örnek sayfa")])
        self.assert_balanced(report)
        blob = json.dumps(report, ensure_ascii=False)
        self.assertNotIn("iddia_dogrulandi", blob)
        self.assertNotIn("iddia_dogrulandi", report["adaylar"][0])
        self.assertEqual(
            report["adaylar"][0]["durum_notu"], "insan_incelemesi_gerekli"
        )
        self.assertIn("doğrulanamadı", report["adaylar"][0]["erisim_durumu"])

    def test_opens_read_only(self):
        def run(path, directory):
            seen_modes = []
            real_open = open

            def spy(file, *args, **kwargs):
                if args:
                    mode = args[0]
                else:
                    mode = kwargs.get("mode", "r")
                seen_modes.append(mode)
                return real_open(file, *args, **kwargs)

            with mock.patch("builtins.open", spy):
                preview.preview_jsonl(path)
            self.assertEqual(seen_modes, ["r"])

        self.with_lines([json_line(url=PAGE, title="Örnek")], run)

    def test_cli_requires_input(self):
        with contextlib.redirect_stderr(io.StringIO()):
            with self.assertRaises(SystemExit):
                preview.main([])

    def test_limit_must_be_positive(self):
        def run(path, directory):
            with self.assertRaises(ValueError):
                preview.preview_jsonl(path, limit=0)
            with self.assertRaises(ValueError):
                preview.preview_jsonl(path, limit=-2)
            with contextlib.redirect_stderr(io.StringIO()):
                with self.assertRaises(SystemExit):
                    preview.main(["--input", str(path), "--limit", "0"])
                with self.assertRaises(SystemExit):
                    preview.main(["--input", str(path), "--limit", "-1"])

        self.with_lines([], run)


if __name__ == "__main__":
    unittest.main()
