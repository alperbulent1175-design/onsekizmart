import builtins
import contextlib
import hashlib
import io
import json
import os
import re
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import inventory_canakkale_content as inventory
import preview_canakkale_archive as preview
import quality_canakkale_archive as quality
import quality_canakkale_text as text_quality

BASE = "https://www.canakkalecephesi.com/"
BODY_MARK = "GOVDEISARETI_c41e9b kıyı tabyası anlatıldı"
EMAIL = "sablon.iletisim@example.com"
MENU = ["Ana Sayfa", "Hakkımızda", "Deniz Harekâtı", "Kara Harekâtı",
        "Belgeler", "Haritalar", "Künye", "İletişim", "Arşiv", "Galeri"]


def url(slug):
    return BASE + slug


def json_line(**fields):
    return json.dumps(fields, ensure_ascii=False)


def page(slug, title, **fields):
    return json_line(url=url(slug), title=title, **fields)


def paragraphs(key, count=3):
    return [
        f"{key} için ayrıntılı anlatım paragrafı {j}: "
        + "Kıyıdaki tabyalar ve gözetleme noktaları uzun uzun anlatılır. " * 5
        for j in range(count)
    ]


def article(key, before=(), after=(), title=None, **fields):
    title = title or f"Yazı {key}"
    lines = [*before, title, *paragraphs(key), *after]
    return page(f"makale-{key}", title, text="\n".join(lines), **fields)


def plain_articles(count, prefix="duz"):
    return [article(f"{prefix}{i}") for i in range(count)]


MIXED = [
    "",
    "{bu bozuk",
    json_line(title="URL yok"),
    json_line(url=BASE, title="Kök sayfa"),
    page("bos", "| Çanakkale Cephesi"),
    article("normal"),
    page("makale-normal", "Yazı normal tekrar", text="x"),
    page("attachment/resim-1/", "Resim 1", text=""),
    page("category/deniz/", "Deniz Arşivi", text="kısa"),
    page("makale-normal/?replytocom=5", "Yazı normal", text="y" * 400),
    page("2015/03/18/bouvet-zirhlisi/", "Bouvet Zırhlısı", text="Bouvet Zırhlısı\n" + "z" * 400),
    page("2015/03/18/bouvet-zirhlisi/1-1/", "Ek", text="kısa"),
]


class QualityCanakkaleTextTest(unittest.TestCase):
    def with_lines(self, lines, fn):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "girdi.jsonl"
            path.write_text("".join(line + "\n" for line in lines), encoding="utf-8")
            return fn(path, Path(tmp))

    def load(self, lines, limit=100):
        return self.with_lines(lines, lambda path, _: text_quality.text_quality_jsonl(path, limit))

    def run_main(self, lines, *extra):
        def run(path, _):
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                report = text_quality.main(["--input", str(path), *extra])
            return report, out.getvalue()
        return self.with_lines(lines, run)

    def flags(self, report, key):
        target = url(f"makale-{key}")
        for ornek in report["makale"]["ornekler"]:
            if ornek["url"] == target:
                return set(ornek["isaretler"])
        return set()

    def count(self, report, name):
        return report["makale"]["isaretler"][name]["sayi"]

    def test_plain_articles_have_no_flags(self):
        report = self.load(plain_articles(6))
        self.assertEqual(report["makale"]["ornekler"], [])
        for name in text_quality.ISARETLER:
            self.assertEqual(self.count(report, name), 0, name)

    def test_short_text(self):
        lines = [
            page("makale-kisa", "Kısa", text="Kısa " + "a" * (text_quality.KISA_METIN_ESIGI - 6)),
            page("makale-sinir", "Sınır", text="Sınır " + "a" * (text_quality.KISA_METIN_ESIGI - 6)),
            page("makale-metinsiz", "Metinsiz"),
        ]
        report = self.load(lines)
        self.assertIn("asiri_kisa_metin", self.flags(report, "kisa"))
        self.assertNotIn("asiri_kisa_metin", self.flags(report, "sinir"))
        self.assertIn("asiri_kisa_metin", self.flags(report, "metinsiz"))
        self.assertEqual(report["makale"]["metin_yok"], 1)
        self.assertEqual(self.count(report, "asiri_kisa_metin"), 2)

    def test_template_line_flags_and_share(self):
        sablon = "Bu siteye abone olun ve yeni yazılardan haberdar olun"
        lines = [article(f"s{i}", after=[sablon]) for i in range(3)] + plain_articles(7)
        report = self.load(lines)
        self.assertTrue(report["sablon"]["etkin"])
        self.assertEqual(report["sablon"]["esik_kayit"], 2)
        self.assertEqual(report["sablon"]["en_sik"], [{"satir": sablon, "kayit": 3}])
        self.assertEqual(self.count(report, "yinelenen_sablon_satiri"), 3)
        for i in range(3):
            self.assertIn("yinelenen_sablon_satiri", self.flags(report, f"s{i}"))
        self.assertEqual(self.flags(report, "duz0"), set())
        ornek = report["makale"]["ornekler"][0]
        self.assertEqual(ornek["sablon_satiri"], 1)
        self.assertGreater(ornek["sablon_payi"], 0)
        self.assertLess(ornek["sablon_payi"], 0.1)
        self.assertEqual(report["makale"]["sablon_payi"]["min"], 0.0)

    def test_template_threshold_ratio(self):
        sablon = "Paylaşmak için tıklayın ve yorum bırakın lütfen"
        below = [article(f"a{i}", after=[sablon]) for i in range(3)] + plain_articles(17)
        report = self.load(below)
        self.assertEqual(report["sablon"]["esik_kayit"], 4)
        self.assertEqual(report["sablon"]["satir_sayisi"], 0)
        self.assertEqual(self.count(report, "yinelenen_sablon_satiri"), 0)
        at = [article(f"a{i}", after=[sablon]) for i in range(4)] + plain_articles(16)
        self.assertEqual(self.count(self.load(at), "yinelenen_sablon_satiri"), 4)

    def test_template_rule_silent_on_small_dataset(self):
        sablon = "Bu siteye abone olun ve yeni yazılardan haberdar olun"
        small = [article(f"k{i}", after=[sablon]) for i in range(2)] + plain_articles(2)
        report, out = self.run_main(small)
        self.assertFalse(report["sablon"]["etkin"])
        self.assertEqual(self.count(report, "yinelenen_sablon_satiri"), 0)
        self.assertIn("Kural çalışmadı", out)
        single = [article("tek", after=[sablon])] + plain_articles(5)
        self.assertEqual(self.count(self.load(single), "yinelenen_sablon_satiri"), 0)

    def test_repeated_start_and_end_blocks(self):
        bas = ["Ortak giriş satırı bir", "Ortak giriş satırı iki", "Ortak giriş satırı üç"]
        son = ["Ortak kapanış bir", "Ortak kapanış iki", "Ortak kapanış üç"]
        lines = [
            article("b1", before=bas), article("b2", before=bas),
            article("e1", after=son), article("e2", after=son),
            article("tekil"),
        ]
        report = self.load(lines)
        for key in ("b1", "b2"):
            self.assertIn("yinelenen_baslangic", self.flags(report, key))
            self.assertNotIn("yinelenen_son", self.flags(report, key))
        for key in ("e1", "e2"):
            self.assertIn("yinelenen_son", self.flags(report, key))
            self.assertNotIn("yinelenen_baslangic", self.flags(report, key))
        self.assertEqual(self.flags(report, "tekil") & {"yinelenen_baslangic", "yinelenen_son"}, set())
        self.assertEqual(self.count(report, "yinelenen_baslangic"), 2)
        self.assertEqual(self.count(report, "yinelenen_son"), 2)

    def test_menu_positive_with_link_texts(self):
        links = [{"url": url(f"m{i}"), "text": text} for i, text in enumerate(MENU[:5])]
        report = self.load([article("menulu", before=MENU, internal_links=links)])
        self.assertIn("olasi_menu", self.flags(report, "menulu"))

    def test_menu_negative_cases(self):
        links = [{"url": url(f"m{i}"), "text": text} for i, text in enumerate(MENU[:5])]
        uzun = paragraphs("liste", count=15)
        uzun_links = [{"url": url(f"u{i}"), "text": text} for i, text in enumerate(uzun)]
        lines = [
            article("linksiz", before=MENU),
            # Altı menü satırı ile kısa başlık satırı yedi kısa satır eder; eşik sekiz.
            article("az-kisa", before=MENU[:6], internal_links=links),
            page("makale-paragraf", "Paragraflar", text="\n".join(["Paragraflar", *uzun]),
                 internal_links=uzun_links),
        ]
        report = self.load(lines)
        for key in ("linksiz", "az-kisa", "paragraf"):
            self.assertNotIn("olasi_menu", self.flags(report, key), key)

    def test_footer_positive_and_negative(self):
        uzun_telif = (
            "Bu yazıda alıntılanan belgelerin telif durumu, all rights reserved ibaresi "
            "ve arşiv kullanım koşulları ayrıntılı biçimde tartışılmaktadır; ayrıca kaynak gösterilir."
        )
        lines = [
            article("telif", after=["© 2024 Çanakkale Cephesi", "Tüm hakları saklıdır."]),
            article("wp", after=["Proudly powered by WordPress"]),
            article("uzun-telif", after=[uzun_telif]),
            article("bastaki-telif", before=["© Bir alıntı"] + paragraphs("dolgu", count=12)),
        ]
        report = self.load(lines)
        self.assertIn("olasi_altbilgi", self.flags(report, "telif"))
        self.assertIn("olasi_altbilgi", self.flags(report, "wp"))
        self.assertNotIn("olasi_altbilgi", self.flags(report, "uzun-telif"))
        self.assertNotIn("olasi_altbilgi", self.flags(report, "bastaki-telif"))

    def test_comment_positive_and_negative(self):
        govde = (
            "Bu belge üzerine bir yorum yapmak gerekirse, tarihçiler soruları yanıtla"
            "maya ve cevapla ilgili tartışmalara uzun süre devam etti."
        )
        lines = [
            article("yanit", after=["Bir yanıt yazın"]),
            article("sayili", after=["3 Yorum"]),
            article("says", after=["Mehmet says:"]),
            article("cevapla", after=["Cevapla"]),
            article("govde-yorum", after=[govde]),
            article("baslikta-yorum", after=["Tarihî yorum"]),
        ]
        report = self.load(lines)
        for key in ("yanit", "sayili", "says", "cevapla"):
            self.assertIn("olasi_yorum", self.flags(report, key), key)
        self.assertNotIn("olasi_yorum", self.flags(report, "govde-yorum"))
        self.assertNotIn("olasi_yorum", self.flags(report, "baslikta-yorum"))

    def test_title_missing_from_text_is_info(self):
        lines = [
            page("makale-yok", "Seddülbahir Çıkarması", text="\n".join(paragraphs("yok"))),
            page("makale-var", "SEDDÜLBAHİR ÇIKARMASI", text="\n".join(["Seddülbahir çıkarması", *paragraphs("var")])),
        ]
        report = self.load(lines)
        self.assertEqual(self.flags(report, "yok"), {"metin_baslik_icermiyor"})
        self.assertEqual(self.flags(report, "var"), set())

    def test_detail_only_for_article_class(self):
        lines = [
            article("detay"),
            page("attachment/resim-1/", "Resim 1", text="kısa"),
            page("category/deniz/", "Deniz Arşivi", text="kısa"),
            page("makale-detay/?replytocom=5", "Yazı detay", text="kısa"),
        ]
        report, out = self.run_main(lines)
        for name in ("olasi_ek_sayfasi", "belirsiz", "sorgu_parametreli_url"):
            sinif = report["siniflar"][name]
            self.assertEqual(set(sinif), {"sayi", "isaretler"})
            self.assertEqual(sinif["sayi"], 1)
            self.assertEqual(sinif["isaretler"]["asiri_kisa_metin"], 1)
            self.assertIn(f"== {name}: 1 kayıt (yalnızca özet) ==", out)
        self.assertEqual(report["makale"]["ornekler"], [])
        self.assertIn("== olasi_makale: 1 kayıt (ayrıntılı) ==", out)
        self.assertNotIn("attachment/resim-1", out)
        self.assertNotIn("category/deniz", out)
        self.assertNotIn("replytocom", out)

    def test_counts_match_preview_quality_inventory(self):
        def compare(path, _):
            return (
                text_quality.text_quality_jsonl(path),
                preview.preview_jsonl(path),
                quality.quality_jsonl(path),
                inventory.inventory_jsonl(path),
            )

        txt, pre, qua, inv = self.with_lines(MIXED, compare)
        self.assertEqual(txt["okunan"], pre["okunan"])
        self.assertEqual(txt["aday"], pre["aday"])
        self.assertEqual(txt["atlanan"], pre["atlanan"])
        self.assertEqual(txt["hatalar"], pre["hatalar"])
        self.assertEqual(txt["atlanan"], qua["atlanan"])
        for name in quality.URL_SINIFLARI:
            self.assertEqual(txt["siniflar"][name]["sayi"], qua["url_yapisi"]["siniflar"][name]["sayi"], name)
            self.assertEqual(txt["siniflar"][name]["sayi"], inv["siniflar"][name]["sayi"], name)
        self.assertEqual(txt["makale"]["sayi"], txt["siniflar"]["olasi_makale"]["sayi"])
        self.assertEqual(sum(c["sayi"] for c in txt["siniflar"].values()), txt["aday"])
        self.assertFalse(txt["okuma"]["dosya_degisti"])

    def test_unique_body_mark_not_in_stdout(self):
        lines = [
            page("makale-isaretli", "İşaretli", text="kısa " + BODY_MARK,
                 internal_links=[{"url": url("x"), "text": BODY_MARK}]),
            *plain_articles(5),
        ]
        report, out = self.run_main(lines)
        self.assertIn("isaretli", out)
        self.assertNotIn("GOVDEISARETI", out)
        self.assertNotIn("GOVDEISARETI", repr(report))
        self.assertNotIn("Kıyıdaki tabyalar", out)

    def test_email_masked_in_template_lines_and_titles(self):
        sablon = f"Bize yazın: {EMAIL} adresinden ulaşabilirsiniz"
        lines = [article(f"e{i}", after=[sablon]) for i in range(3)] + plain_articles(5)
        lines.append(page("makale-baslik", "İletişim " + EMAIL, text="kısa"))
        report, out = self.run_main(lines)
        self.assertNotIn(EMAIL, out)
        self.assertNotIn("@", out)
        self.assertNotIn(EMAIL, repr(report["sablon"]))
        self.assertIn("[e-posta gizlendi]", out)
        self.assertEqual(report["sablon"]["en_sik"][0]["satir"],
                         "Bize yazın: [e-posta gizlendi] adresinden ulaşabilirsiniz")

    def test_template_line_truncated_to_60_chars(self):
        sablon = "Uzun şablon satırı " + "x" * 100
        lines = [article(f"t{i}", after=[sablon]) for i in range(3)] + plain_articles(3)
        satir = self.load(lines)["sablon"]["en_sik"][0]["satir"]
        self.assertEqual(satir, sablon[:text_quality.SABLON_GOSTERIM_UZUNLUGU] + "…")

    def test_limit_cuts_samples_not_counts(self):
        lines = [page(f"makale-k{i}", f"Kısa {i}", text=f"Kısa {i}") for i in range(7)]
        full = self.load(lines, limit=20)
        cut = self.load(lines, limit=2)
        self.assertEqual(len(full["makale"]["ornekler"]), 7)
        self.assertEqual(len(cut["makale"]["ornekler"]), 2)
        for key in ("sayi", "isaretler", "metin_yok", "sablon_payi"):
            self.assertEqual(full["makale"][key], cut["makale"][key], key)
        self.assertEqual(full["siniflar"], cut["siniflar"])
        self.assertEqual(full["sablon"], cut["sablon"])

    def test_limit_validation(self):
        with self.assertRaises(ValueError):
            self.load([article("a")], limit=0)
        with self.assertRaises(SystemExit), contextlib.redirect_stderr(io.StringIO()):
            self.run_main([article("a")], "--limit", "0")
        with self.assertRaises(SystemExit), contextlib.redirect_stderr(io.StringIO()):
            self.run_main([article("a")], "--limit", "iki")

    def test_input_required(self):
        with self.assertRaises(SystemExit), contextlib.redirect_stderr(io.StringIO()):
            text_quality.main([])

    def test_missing_file(self):
        missing = Path(tempfile.gettempdir()) / "yok_boyle_bir_dosya_text_quality.jsonl"
        with self.assertRaises(FileNotFoundError):
            text_quality.text_quality_jsonl(missing)
        with self.assertRaises(SystemExit) as ctx:
            text_quality.main(["--input", str(missing)])
        self.assertIn("Girdi dosyası bulunamadı", str(ctx.exception))

    def test_empty_file(self):
        def run(path, _):
            path.write_text("", encoding="utf-8")
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                report = text_quality.main(["--input", str(path)])
            return report, out.getvalue()

        report, out = self.with_lines([], run)
        self.assertTrue(report["bos_dosya"])
        self.assertEqual((report["okunan"], report["aday"]), (0, 0))
        self.assertIn("girdi dosyası boş", out)
        self.assertIn("işaret yok", out)
        self.assertFalse(report["sablon"]["etkin"])

    def test_broken_json_counted_and_reported(self):
        report, out = self.run_main(["{bozuk", article("saglam"), "[1, 2]"])
        self.assertEqual(report["atlanan"]["bozuk_json"], 1)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 1)
        self.assertEqual(report["hatalar"], ["satır 1: bozuk_json"])
        self.assertEqual(report["aday"], 1)
        self.assertIn("satır 1: bozuk_json", out)

    def test_no_output_file_and_input_unchanged(self):
        def run(path, tmp):
            before = sorted(os.listdir(tmp))
            cwd_before = sorted(os.listdir(os.getcwd()))
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            with contextlib.redirect_stdout(io.StringIO()):
                text_quality.main(["--input", str(path)])
            self.assertEqual(sorted(os.listdir(tmp)), before)
            self.assertEqual(sorted(os.listdir(os.getcwd())), cwd_before)
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), digest)

        self.with_lines(MIXED + plain_articles(6), run)

    def test_file_opened_read_only_utf8_twice(self):
        real_open = builtins.open
        calls = []

        def spy(*args, **kwargs):
            calls.append((args[1:], kwargs))
            return real_open(*args, **kwargs)

        with mock.patch.object(text_quality, "open", spy, create=True):
            report = self.load(plain_articles(2))
        self.assertEqual(calls, [(("r",), {"encoding": "utf-8"})] * 2)
        self.assertEqual(report["okuma"]["gecis"], 2)

    def test_change_between_passes_warns(self):
        def run(path, tmp):
            other = tmp / "degisik.jsonl"
            other.write_text("".join(l + "\n" for l in plain_articles(4)), encoding="utf-8")
            real_open = builtins.open
            paths = iter([path, other])

            def swap(_source, *args, **kwargs):
                return real_open(next(paths), *args, **kwargs)

            out = io.StringIO()
            with mock.patch.object(text_quality, "open", swap, create=True), \
                    contextlib.redirect_stdout(out):
                report = text_quality.main(["--input", str(path)])
            return report, out.getvalue()

        report, out = self.with_lines(plain_articles(3), run)
        self.assertTrue(report["okuma"]["dosya_degisti"])
        self.assertIn(text_quality.DEGISIM_UYARISI, out)
        self.assertIn("1. geçiş okunan satır: 3; 2. geçiş okunan satır: 4", out)

    def test_header_note_and_no_verified_status(self):
        report, out = self.run_main(MIXED)
        self.assertEqual(
            out.splitlines()[0],
            "Salt okunur metin kalitesi raporu; içerik/çıkarım kalitesi ölçülür, "
            "tarihsel doğruluk değil; tüm kayıtlar insan_incelemesi_gerekli",
        )
        self.assertIn("çıkarım riski", out)
        self.assertIn("tarihsel hata değildir", out)
        self.assertNotIn("temiz görünüyor", out)
        self.assertNotIn("iddia_dogrulandi", out)
        self.assertNotIn("iddia_dogrulandi", repr(report))

    def test_date_in_text_produces_no_date_or_year_field(self):
        metin = "Deniz harekâtı\n18 Mart 1915 günü Bouvet, Irresistible ve Ocean battı.\n" + "\n".join(paragraphs("tarih"))
        lines = [page("makale-deniz-harekati", "Deniz harekâtı", text=metin, published_date="2015-03-18")]
        report, out = self.run_main(lines)

        def keys(value):
            if isinstance(value, dict):
                for key, inner in value.items():
                    yield key
                    yield from keys(inner)
            elif isinstance(value, list):
                for inner in value:
                    yield from keys(inner)

        for key in keys(report):
            self.assertIsNone(re.search(r"tarih|yil|yıl|year|date|olay", str(key)), key)
        self.assertNotIn("1915", out)
        self.assertNotIn("2015", out)
        self.assertNotIn("1915", repr(report))


if __name__ == "__main__":
    unittest.main()
