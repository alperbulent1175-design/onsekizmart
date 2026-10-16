import contextlib
import io
import json
import os
import re
import tempfile
import unittest
from pathlib import Path

import inventory_canakkale_content as inventory
import preview_canakkale_archive as preview
import quality_canakkale_archive as quality

BASE = "https://www.canakkalecephesi.com/"
BODY_MARK = "GOVDEISARETI_7f3a9c mayın döşendi"
HTML_MARK = "<div class='x'>HTMLISARETI_51be</div>"
EMAIL = "yorumcu.deneme@example.com"


def url(slug):
    return BASE + slug


def json_line(**fields):
    return json.dumps(fields, ensure_ascii=False)


def page(slug, title, **fields):
    return json_line(url=url(slug), title=title, **fields)


FOUR_CLASSES = [
    page("kilitbahir-kalesi/", "Kilitbahir Kalesi", text="a" * 600),
    page("attachment/resim-1/", "Resim 1", text=""),
    page("category/deniz/", "Deniz Arşivi"),
    page("kilitbahir-kalesi/?replytocom=5", "Kilitbahir Kalesi", text="b" * 10),
]

MIXED = [
    "",
    "{bu bozuk",
    json_line(title="URL yok"),
    json_line(url="javascript:alert(1)", title="Betik"),
    json_line(url=BASE, title="Kök sayfa"),
    page("bos", "| Çanakkale Cephesi"),
    page("normal", "Kilitbahir | Çanakkale Cephesi", text=BODY_MARK),
    page("normal", "Kilitbahir tekrar"),
    json_line(url=url("h1-yazi"), title="", headings=[{"level": "h1", "text": "Seddülbahir Çıkarması"}]),
    *FOUR_CLASSES,
    page("2015/03/18/bouvet-zirhlisi/", "Bouvet Zırhlısı"),
    page("2015/03/18/bouvet-zirhlisi/1-1/", "Ek"),
]


class InventoryCanakkaleContentTest(unittest.TestCase):
    def with_lines(self, lines, fn):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "girdi.jsonl"
            path.write_text("".join(line + "\n" for line in lines), encoding="utf-8")
            return fn(path, Path(tmp))

    def load(self, lines, limit=20):
        return self.with_lines(lines, lambda path, _: inventory.inventory_jsonl(path, limit))

    def run_main(self, lines, *extra):
        def run(path, _):
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                report = inventory.main(["--input", str(path), *extra])
            return report, out.getvalue()
        return self.with_lines(lines, run)

    def cls(self, report, name):
        return report["siniflar"][name]

    def test_class_order_matches_quality_classes(self):
        self.assertEqual(set(inventory.SINIF_SIRASI), set(quality.URL_SINIFLARI))

    def test_four_url_classes_reported_separately(self):
        report = self.load(FOUR_CLASSES)
        for name in inventory.SINIF_SIRASI:
            self.assertEqual(self.cls(report, name)["sayi"], 1, name)
        self.assertEqual(
            self.cls(report, "sorgu_parametreli_url")["ornekler"][0]["url"],
            url("kilitbahir-kalesi/?replytocom=5"),
        )

    def test_counts_match_preview_and_quality(self):
        def compare(path, _):
            inv = inventory.inventory_jsonl(path)
            pre = preview.preview_jsonl(path)
            qua = quality.quality_jsonl(path)
            return inv, pre, qua

        inv, pre, qua = self.with_lines(MIXED, compare)
        self.assertEqual(inv["okunan"], pre["okunan"])
        self.assertEqual(inv["aday"], pre["aday"])
        self.assertEqual(inv["atlanan"], pre["atlanan"])
        self.assertEqual(inv["hatalar"], pre["hatalar"])
        self.assertEqual(inv["aday"], qua["aday"])
        self.assertEqual(inv["atlanan"], qua["atlanan"])
        for name in quality.URL_SINIFLARI:
            self.assertEqual(
                self.cls(inv, name)["sayi"],
                qua["url_yapisi"]["siniflar"][name]["sayi"],
                name,
            )
        self.assertEqual(sum(c["sayi"] for c in inv["siniflar"].values()), inv["aday"])
        self.assertTrue(all(v > 0 for v in inv["atlanan"].values()))

    def test_length_buckets_and_boundaries(self):
        lengths = [1, 499, 500, 1999, 2000, 4999, 5000, 19999, 20000]
        lines = [page(f"makale-{n}", f"Makale {n}", text="x" * n) for n in lengths]
        lines.append(page("makale-eksik", "Makale eksik"))
        lines.append(page("makale-bos", "Makale boş", text=""))
        lines.append(page("makale-sayi", "Makale sayı", text=12))
        sinif = self.cls(self.load(lines), "olasi_makale")
        self.assertEqual(sinif["sayi"], 12)
        self.assertEqual(
            sinif["uzunluk"]["kovalar"],
            {
                "yok/boş": 3,
                "1-499": 2,
                "500-1999": 2,
                "2000-4999": 2,
                "5000-19999": 2,
                "20000+": 1,
            },
        )
        self.assertEqual(sinif["uzunluk"]["min"], 1)
        self.assertEqual(sinif["uzunluk"]["medyan"], 2000)
        self.assertEqual(sinif["uzunluk"]["max"], 20000)
        self.assertEqual(sinif["alan_ozeti"]["text"], {"var": 11, "dolu": 10})
        self.assertEqual(sinif["anahtarlar"]["text"]["tipler"], {"number": 1, "string": 10})

    def test_bucket_function_edges(self):
        cases = {None: "yok/boş", 0: "yok/boş", 499: "1-499", 500: "500-1999",
                 1999: "500-1999", 2000: "2000-4999", 19999: "5000-19999",
                 20000: "20000+"}
        for length, bucket in cases.items():
            self.assertEqual(inventory.uzunluk_kovasi(length), bucket, length)

    def test_text_length_mismatch_counted_as_info(self):
        lines = [
            page("uyusan", "Uyuşan", text="abcde", text_length=5),
            page("uyusmayan", "Uyuşmayan", text="abcde", text_length=9),
            page("metin-sayisi", "Metin sayısı", text="abcde", text_length="5"),
            page("metinsiz", "Metinsiz", text_length=3),
            page("alansiz", "Alansız", text="abc"),
        ]
        report = self.load(lines)
        self.assertEqual(
            self.cls(report, "olasi_makale")["text_length"],
            {"var": 4, "uyusan": 1, "uyusmayan": 1, "karsilastirilamadi": 2},
        )
        self.assertEqual(report["aday"], 5)

    def test_unexpected_key_discovered_without_printing_value(self):
        lines = [
            page("yorumlu", "Yorumlu yazı", text="abc",
                 yorumlar=[{"ad": "Yorumcu Adı", "metin": BODY_MARK}]),
            page("duz", "Düz yazı", text="abc", headings=[]),
        ]
        report, out = self.run_main(lines)
        sinif = self.cls(report, "olasi_makale")
        self.assertEqual(sinif["beklenmeyen_anahtarlar"], ["yorumlar"])
        self.assertEqual(
            sinif["anahtarlar"]["yorumlar"], {"var": 1, "dolu": 1, "tipler": {"array": 1}}
        )
        self.assertEqual(sinif["anahtarlar"]["headings"], {"var": 1, "dolu": 0, "tipler": {"array": 1}})
        self.assertIn("Beklenmeyen ek anahtarlar: yorumlar", out)
        self.assertNotIn("Yorumcu Adı", out)
        self.assertNotIn("GOVDEISARETI", out)

    def test_html_absent_reported_as_yok(self):
        report, out = self.run_main([page("yazi", "Yazı", text="abc")])
        self.assertEqual(self.cls(report, "olasi_makale")["alan_ozeti"]["html"], "yok")
        self.assertIn("HTML: yok", out)

    def test_html_present_only_counted(self):
        lines = [
            page("htmlli", "HTML'li", text="abc", html=HTML_MARK),
            page("htmlsiz", "HTML'siz", text="abc"),
        ]
        report, out = self.run_main(lines)
        html = self.cls(report, "olasi_makale")["alan_ozeti"]["html"]
        self.assertEqual(html["anahtarlar"], ["html"])
        self.assertEqual((html["var"], html["dolu"]), (1, 1))
        self.assertEqual(html["uzunluk"]["max"], len(HTML_MARK))
        self.assertNotIn("HTMLISARETI", out)
        self.assertNotIn("<div", out)
        self.assertNotIn("HTMLISARETI", repr(report))

    def test_tags_come_only_from_title(self):
        lines = [
            page("govdede-mayin", "Bir Hatıra Defteri Değil", text=BODY_MARK,
                 headings=[{"level": "h2", "text": "Mayın hattı"}],
                 internal_links=[{"url": url("mayin"), "text": "Mayın"}]),
            page("baslikta-mayin", "Mayın Hattı", text="sade metin"),
        ]
        sinif = self.cls(self.load(lines), "olasi_makale")
        etiketler = {o["url"]: o["etiketler"] for o in sinif["ornekler"]}
        self.assertEqual(etiketler[url("govdede-mayin")], [])
        self.assertEqual(etiketler[url("baslikta-mayin")], ["deniz"])
        self.assertEqual(sinif["etiketler"]["deniz"], 1)
        self.assertEqual(sinif["etiketsiz"], 1)

    def test_turkish_case_folding(self):
        self.assertEqual(inventory.on_etiketler("ZIRHLI GEMİLER"), ["deniz"])
        self.assertEqual(inventory.on_etiketler("SEDDÜLBAHİR"), ["yer"])
        self.assertEqual(inventory.on_etiketler("seddulbahir"), ["yer"])
        self.assertEqual(inventory.on_etiketler("Esat PAŞANIN Hatıratı"), ["kisi_biyografi", "kaynak_belge"])
        self.assertEqual(inventory.on_etiketler("ARIBURNU-KABATEPE"), ["yer"])
        self.assertEqual(inventory.on_etiketler("Boğazı geçen 57. Alay"), ["deniz", "kara"])
        self.assertEqual(inventory.on_etiketler("Bora Bora"), [])

    def test_stdout_has_no_body_html_or_email(self):
        lines = [
            page("yazi-bir", "İletişim " + EMAIL, text=BODY_MARK + " " + EMAIL,
                 html=HTML_MARK,
                 internal_links=[{"url": url("x"), "text": BODY_MARK}],
                 images=[{"url": url("a.jpg"), "alt": BODY_MARK}]),
            page("yazi-iki", "Telefon 0212 555 44 33", text="kısa"),
        ]
        report, out = self.run_main(lines)
        self.assertNotIn("GOVDEISARETI", out)
        self.assertNotIn("HTMLISARETI", out)
        self.assertNotIn(EMAIL, out)
        self.assertNotIn("@", out)
        self.assertNotIn("555 44 33", out)
        self.assertIn("[e-posta gizlendi]", out)
        self.assertIn("[numara gizlendi]", out)
        ornek = self.cls(report, "olasi_makale")["ornekler"][0]
        self.assertEqual(
            set(ornek),
            {"url", "baslik", "metin_uzunlugu", "headings", "internal_links", "images", "etiketler"},
        )
        self.assertEqual((ornek["internal_links"], ornek["images"]), (1, 1))

    def test_limit_cuts_samples_not_counts(self):
        lines = [page(f"makale-{i}", f"Makale {i}", text="x" * (i + 1)) for i in range(7)]
        full = self.load(lines, limit=20)
        cut = self.load(lines, limit=2)
        full_cls, cut_cls = self.cls(full, "olasi_makale"), self.cls(cut, "olasi_makale")
        self.assertEqual(len(full_cls["ornekler"]), 7)
        self.assertEqual(len(cut_cls["ornekler"]), 2)
        for key in ("sayi", "anahtarlar", "uzunluk", "etiketler", "etiketsiz", "alan_ozeti"):
            self.assertEqual(full_cls[key], cut_cls[key], key)

    def test_limit_validation(self):
        with self.assertRaises(ValueError):
            self.load([page("a-b-c", "A")], limit=0)
        with self.assertRaises(SystemExit), contextlib.redirect_stderr(io.StringIO()):
            self.run_main([page("a-b-c", "A")], "--limit", "0")

    def test_missing_file(self):
        missing = Path(tempfile.gettempdir()) / "yok_boyle_bir_dosya_inventory.jsonl"
        with self.assertRaises(FileNotFoundError):
            inventory.inventory_jsonl(missing)
        with self.assertRaises(SystemExit) as ctx:
            inventory.main(["--input", str(missing)])
        self.assertIn("Girdi dosyası bulunamadı", str(ctx.exception))

    def test_empty_file(self):
        def run(path, _):
            path.write_text("", encoding="utf-8")
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                report = inventory.main(["--input", str(path)])
            return report, out.getvalue()

        report, out = self.with_lines([], run)
        self.assertTrue(report["bos_dosya"])
        self.assertEqual(report["okunan"], 0)
        self.assertEqual(report["aday"], 0)
        self.assertIn("girdi dosyası boş", out)
        for name in inventory.SINIF_SIRASI:
            self.assertEqual(self.cls(report, name)["sayi"], 0)
            self.assertEqual(self.cls(report, name)["alan_ozeti"]["html"], "yok")

    def test_no_output_file_created(self):
        def run(path, tmp):
            before = sorted(os.listdir(tmp))
            cwd_before = sorted(os.listdir(os.getcwd()))
            content = path.read_bytes()
            with contextlib.redirect_stdout(io.StringIO()):
                inventory.main(["--input", str(path)])
            self.assertEqual(sorted(os.listdir(tmp)), before)
            self.assertEqual(sorted(os.listdir(os.getcwd())), cwd_before)
            self.assertEqual(path.read_bytes(), content)

        self.with_lines(MIXED, run)

    def test_header_note_and_no_verified_status(self):
        report, out = self.run_main(MIXED)
        self.assertEqual(out.splitlines()[0], inventory.BASLIK_NOTU)
        self.assertIn("Salt okunur envanter; tarihsel iddia çıkarılmadı; tüm kayıtlar insan_incelemesi_gerekli", out)
        self.assertIn("Ön etiketler (otomatik başlık eşleşmesi; doğrulanmadı)", out)
        self.assertIn("kanıtlamaz", out)
        self.assertNotIn("iddia_dogrulandi", out)
        self.assertNotIn("iddia_dogrulandi", repr(report))

    def test_date_in_title_produces_no_date_or_year_field(self):
        lines = [page("18-mart-1915-zaferi", "18 Mart 1915 Deniz Zaferi", text="abc")]
        report, out = self.run_main(lines)

        def keys(value):
            if isinstance(value, dict):
                for key, inner in value.items():
                    yield key
                    yield from keys(inner)
            elif isinstance(value, list):
                for inner in value:
                    yield from keys(inner)

        # published_date ve fetched_at_utc yalnızca varlık/doluluk özetidir.
        for meta in inventory.META_ALANLARI:
            self.assertEqual(self.cls(report, "olasi_makale")["alan_ozeti"][meta], "yok")
        for key in keys(report):
            if key in inventory.META_ALANLARI:
                continue
            self.assertIsNone(re.search(r"tarih|yil|yıl|year|date|olay", str(key)), key)
        for line in out.splitlines():
            if "1915" in line:
                self.assertTrue(
                    line.strip().startswith(("baslik:", "1. https://")), line
                )
        ornek = self.cls(report, "olasi_makale")["ornekler"][0]
        self.assertEqual(ornek["baslik"], "18 Mart 1915 Deniz Zaferi")
        self.assertEqual(ornek["etiketler"], ["deniz"])


if __name__ == "__main__":
    unittest.main()
