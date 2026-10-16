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
import preview_canakkale_clean_text as clean
import quality_canakkale_archive as quality
import quality_canakkale_text as text_quality

BASE = "https://www.canakkalecephesi.com/"
BODY_MARK = "GOVDEISARETI_7d20af kıyı tabyası anlatıldı"
EMAIL = "sablon.iletisim@example.com"
UST = ["Anasayfa", "Kategoriler", "admin"]
ALT = ["Tweetle", "BENZER KONULAR", "BİR YORUM YAZIN", "Henüz yorum yapılmamış."]
ALINTI = (
    "Ey bu topraklar için toprağa düşmüş asker, bu uzun alıntı birçok yazıda aynen tekrar "
    "edilen gerçek bir anma metni olarak gövdenin ortasında yer alır ve korunmalıdır."
)
BENZER = [
    "Seddülbahir tabyalarında geçen günlere dair uzun bir benzer yazı başlığı",
    "Kilitbahir kıyısındaki gözetleme noktaları üzerine başka bir yazı",
]
YORUM = "Okuyucu yorumu: bu yazıda anlatılan tabyaları ziyaret ettim ve çok etkilendim."


def url(slug):
    return BASE + slug


def json_line(**fields):
    return json.dumps(fields, ensure_ascii=False)


def page(slug, title, **fields):
    return json_line(url=url(slug), title=title, **fields)


def paragraphs(key, count=6):
    return [
        f"{key} için ayrıntılı anlatım paragrafı {j}: "
        + "Kıyıdaki tabyalar ve gözetleme noktaları uzun uzun anlatılır. " * 4
        for j in range(count)
    ]


def article(key, ust=UST, govde=None, alt=ALT, title=None, **fields):
    title = title or f"Yazı {key}"
    govde = paragraphs(key) if govde is None else govde
    return page(f"makale-{key}", title, text="\n".join([*ust, title, *govde, *alt]), **fields)


def base(count, prefix="ortak"):
    return [article(f"{prefix}{i}") for i in range(count)]


MIXED = [
    "",
    "{bu bozuk",
    json_line(title="URL yok"),
    json_line(url=BASE, title="Kök sayfa"),
    page("bos", "| Çanakkale Cephesi"),
    article("normal"),
    page("makale-normal", "Yazı normal tekrar", text="x"),
    page("attachment/resim-1/", "Resim 1", text="\n".join(UST + ALT)),
    page("category/deniz/", "Deniz Arşivi", text="kısa"),
    page("makale-normal/?replytocom=5", "Yazı normal", text="y" * 400),
    page("2015/03/18/bouvet-zirhlisi/", "Bouvet Zırhlısı", text="Bouvet Zırhlısı\n" + "z" * 400),
]


class CleanTextPreviewTest(unittest.TestCase):
    def with_lines(self, lines, fn):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "girdi.jsonl"
            path.write_text("".join(line + "\n" for line in lines), encoding="utf-8")
            return fn(path, Path(tmp))

    def load(self, lines, limit=100):
        return self.with_lines(lines, lambda path, _: clean.clean_text_preview_jsonl(path, limit))

    def run_main(self, lines, *extra):
        def run(path, _):
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                report = clean.main(["--input", str(path), *extra])
            return report, out.getvalue()
        return self.with_lines(lines, run)

    def sample(self, report, key):
        target = url(f"makale-{key}")
        for ornek in report["makale"]["ornekler"]:
            if ornek["url"] == target:
                return ornek
        self.fail(f"örnek yok: {key}")

    def kat(self, ornek, ad):
        return ornek["kategoriler"][ad]["satir"]

    def test_clear_boundaries_high_confidence_and_line_numbers(self):
        report = self.load(base(10))
        self.assertTrue(report["sablon"]["etkin"])
        self.assertEqual(report["sablon"]["yuksek_esik_kayit"], 5)
        ornek = self.sample(report, "ortak0")
        self.assertEqual(ornek["sinir_guveni"], "yuksek")
        self.assertEqual(ornek["ust_sinir_satiri"], 3)
        self.assertEqual(ornek["alt_sinir_satiri"], 11)
        self.assertEqual(ornek["toplam_satir"], 14)
        self.assertEqual(self.kat(ornek, "yuksek_guvenli_arayuz"), 7)
        self.assertEqual(self.kat(ornek, "belirsiz_insan_incelemesi"), 0)
        self.assertEqual(self.kat(ornek, "korunacak_govde"), 7)
        self.assertEqual(
            sum(k["karakter"] for k in ornek["kategoriler"].values()), ornek["toplam_karakter"]
        )
        self.assertEqual(ornek["riskler"], [])
        self.assertEqual(ornek["oneri"], clean.ONERI_VAR)
        self.assertEqual(report["makale"]["guven"], {"yuksek": 10, "belirsiz": 0, "sinir_bulunamadi": 0})
        self.assertEqual(report["makale"]["oneri_dusunulebilir"], 10)
        self.assertGreater(report["makale"]["govde_payi"]["medyan"], 0.5)
        self.assertGreater(report["makale"]["arayuz_payi"]["medyan"], 0)
        basliklar = report["makale"]["alt_sinir_basliklari"]
        self.assertEqual(basliklar, [{"satir": "Tweetle", "kayit": 10}])

    def test_short_text_and_short_body_no_recommendation(self):
        kisa_govde = [f"Kısa gövde satırı {j}: tabyalar hakkında kısa bir not düşülmüştür burada." for j in range(3)]
        lines = base(8) + [
            page("makale-kisa", "Kısa", text="\n".join([*UST, "Kısa", *ALT])),
            article("kisagovde", govde=kisa_govde),
        ]
        report = self.load(lines)
        kisa = self.sample(report, "kisa")
        self.assertIn("kisa_metin", kisa["riskler"])
        self.assertIn("kisa_govde", kisa["riskler"])
        self.assertEqual(kisa["oneri"], clean.ONERI_YOK)
        govde = self.sample(report, "kisagovde")
        self.assertGreaterEqual(govde["metin_uzunlugu"], clean.KISA_METIN_ESIGI)
        self.assertLess(govde["kategoriler"]["korunacak_govde"]["karakter"], clean.KISA_METIN_ESIGI)
        self.assertEqual(govde["sinir_guveni"], "yuksek")
        self.assertIn("kisa_govde", govde["riskler"])
        self.assertNotIn("kisa_metin", govde["riskler"])
        self.assertEqual(govde["oneri"], clean.ONERI_YOK)

    def test_repeated_long_quote_in_body_kept(self):
        lines = base(10) + [
            article(f"alinti{i}", govde=paragraphs(f"q{i}", 3) + [ALINTI] + paragraphs(f"r{i}", 3))
            for i in range(3)
        ]
        report = self.load(lines)
        self.assertGreater(len(ALINTI), clean.UZUN_SATIR_ESIGI)
        for i in range(3):
            ornek = self.sample(report, f"alinti{i}")
            self.assertEqual(ornek["sinir_guveni"], "yuksek")
            self.assertEqual(self.kat(ornek, "korunacak_govde"), 8)
            self.assertEqual(ornek["tekrarlanan_uzun_satir_korundu"], 1)
            self.assertIn("tekrarlanan_uzun_satir_korundu", ornek["riskler"])
        self.assertEqual(report["makale"]["riskler"]["tekrarlanan_uzun_satir_korundu"], 3)

    def test_generic_lines_in_body_kept_and_do_not_set_boundary(self):
        cumle = "Sitenin admin paneli, Anasayfa düzeni ve Bir yorum yazın kutusu üzerine bir not."
        govde = paragraphs("orta", 3) + [cumle, "admin", "Anasayfa", "BİR YORUM YAZIN"] + paragraphs("orta2", 3)
        report = self.load(base(10) + [article("orta", govde=govde)])
        ornek = self.sample(report, "orta")
        self.assertEqual(ornek["sinir_guveni"], "yuksek")
        self.assertEqual(ornek["ust_sinir_satiri"], 3)
        self.assertEqual(ornek["alt_sinir_satiri"], 3 + 1 + 10 + 1)
        self.assertEqual(self.kat(ornek, "korunacak_govde"), 11)

    def test_person_name_line_in_body_kept(self):
        lines = base(10) + [
            article(f"kisi{i}", govde=paragraphs(f"k{i}", 3) + ["Mustafa Kemal"] + paragraphs(f"m{i}", 3))
            for i in range(3)
        ]
        report = self.load(lines)
        for i in range(3):
            ornek = self.sample(report, f"kisi{i}")
            self.assertEqual(ornek["sinir_guveni"], "yuksek")
            self.assertEqual(self.kat(ornek, "korunacak_govde"), 8)
            self.assertEqual(ornek["alt_sinir_satiri"], 3 + 1 + 7 + 1)

    def test_tweetle_mid_text_not_bottom_boundary(self):
        govde = paragraphs("tw", 2) + ["Tweetle"] + paragraphs("tw2", 6)
        report = self.load(base(10) + [article("tweet", govde=govde, alt=[])])
        ornek = self.sample(report, "tweet")
        self.assertIsNone(ornek["alt_sinir_satiri"])
        self.assertEqual(ornek["ust_sinir_satiri"], 3)
        self.assertEqual(self.kat(ornek, "korunacak_govde"), 10)
        self.assertEqual(ornek["sinir_guveni"], "yuksek")

    def test_bottom_with_long_non_template_lines_uncertain(self):
        alt = ["Tweetle", "BENZER KONULAR", *BENZER, "BİR YORUM YAZIN", YORUM]
        report = self.load(base(10) + [article("benzer", alt=alt)])
        ornek = self.sample(report, "benzer")
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")
        self.assertEqual(ornek["alt_blok_uzun_satir"], 3)
        self.assertIn("alt_blokta_uzun_satir", ornek["riskler"])
        self.assertEqual(self.kat(ornek, "belirsiz_insan_incelemesi"), len(alt))
        self.assertEqual(self.kat(ornek, "yuksek_guvenli_arayuz"), 3)
        self.assertEqual(ornek["oneri"], clean.ONERI_YOK)
        self.assertEqual(report["makale"]["riskler"]["alt_blokta_uzun_satir"], 1)

    def test_protected_line_in_top_block_uncertain(self):
        tarihli = ["Anasayfa", "18 Mart 1915", "Kategoriler", "admin"]
        kaynakli = ["Anasayfa", "Kaynak:", "Kategoriler", "admin"]
        lines = base(10) + [article("tarihli", ust=tarihli)] + [
            article(f"kaynak{i}", ust=kaynakli) for i in range(3)
        ]
        report = self.load(lines)
        tarih = self.sample(report, "tarihli")
        self.assertEqual(tarih["sinir_guveni"], "belirsiz")
        self.assertIn("ust_blok_kesintili", tarih["riskler"])
        self.assertIn("ust_blokta_korunan_satir", tarih["riskler"])
        self.assertEqual(self.kat(tarih, "belirsiz_insan_incelemesi"), 4)
        self.assertEqual(tarih["ust_sinir_satiri"], 4)
        self.assertEqual(tarih["oneri"], clean.ONERI_YOK)
        for i in range(3):
            kaynak = self.sample(report, f"kaynak{i}")
            self.assertEqual(kaynak["sinir_guveni"], "belirsiz")
            self.assertIn("ust_blokta_korunan_satir", kaynak["riskler"])
            self.assertNotIn("ust_blok_kesintili", kaynak["riskler"])
            self.assertEqual(self.kat(kaynak, "belirsiz_insan_incelemesi"), 4)
            self.assertEqual(kaynak["oneri"], clean.ONERI_YOK)
        satirlar = [s["satir"] for s in report["makale"]["ust_blok_satirlari"]]
        self.assertNotIn("Kaynak:", satirlar)
        self.assertNotIn("18 Mart 1915", satirlar)

    def test_no_boundary_record(self):
        report = self.load(base(10) + [article("duz", ust=[], alt=[])])
        ornek = self.sample(report, "duz")
        self.assertEqual(ornek["sinir_guveni"], "sinir_bulunamadi")
        self.assertIsNone(ornek["ust_sinir_satiri"])
        self.assertIsNone(ornek["alt_sinir_satiri"])
        self.assertEqual(self.kat(ornek, "korunacak_govde"), ornek["toplam_satir"])
        self.assertEqual(ornek["oneri"], clean.ONERI_YOK)
        self.assertEqual(report["makale"]["guven"]["sinir_bulunamadi"], 1)

    def test_fewer_than_five_articles_no_high_boundary(self):
        report, out = self.run_main(base(4))
        self.assertFalse(report["sablon"]["etkin"])
        self.assertEqual(report["makale"]["guven"], {"yuksek": 0, "belirsiz": 0, "sinir_bulunamadi": 4})
        self.assertEqual(report["makale"]["oneri_dusunulebilir"], 0)
        for ornek in report["makale"]["ornekler"]:
            self.assertEqual(ornek["kategoriler"]["yuksek_guvenli_arayuz"]["satir"], 0)
        self.assertIn("Kural çalışmadı", out)

    def test_other_classes_out_of_scope(self):
        metin = "\n".join(UST + ["Ek"] + ALT)
        lines = base(6) + [
            page("attachment/resim-1/", "Resim 1", text=metin),
            page("category/deniz/", "Deniz Arşivi", text=metin),
            page("makale-ortak0/?replytocom=5", "Yazı", text=metin),
        ]
        report, out = self.run_main(lines)
        self.assertEqual(report["kapsam_disi"], 3)
        self.assertEqual(report["makale"]["sayi"], 6)
        self.assertEqual(len(report["makale"]["ornekler"]), 6)
        self.assertEqual(sum(report["makale"]["guven"].values()), 6)
        self.assertIn("Kapsam dışı", out)
        self.assertNotIn("attachment/resim-1", out)
        self.assertNotIn("category/deniz", out)
        self.assertNotIn("replytocom", out)

    def test_counts_match_other_tools(self):
        def compare(path, _):
            return (
                clean.clean_text_preview_jsonl(path),
                text_quality.text_quality_jsonl(path),
                preview.preview_jsonl(path),
                quality.quality_jsonl(path),
                inventory.inventory_jsonl(path),
            )

        cln, txt, pre, qua, inv = self.with_lines(MIXED + base(6), compare)
        for key in ("okunan", "aday", "atlanan", "hatalar"):
            self.assertEqual(cln[key], txt[key], key)
            self.assertEqual(cln[key], pre[key], key)
        self.assertEqual(cln["atlanan"], qua["atlanan"])
        for name in quality.URL_SINIFLARI:
            self.assertEqual(cln["siniflar"][name], txt["siniflar"][name]["sayi"], name)
            self.assertEqual(cln["siniflar"][name], qua["url_yapisi"]["siniflar"][name]["sayi"], name)
            self.assertEqual(cln["siniflar"][name], inv["siniflar"][name]["sayi"], name)
        self.assertEqual(cln["sablon"]["satir_sayisi"], txt["sablon"]["satir_sayisi"])
        self.assertEqual(cln["sablon"]["esik_kayit"], txt["sablon"]["esik_kayit"])
        self.assertEqual(sum(cln["siniflar"].values()), cln["aday"])
        self.assertEqual(cln["makale"]["sayi"] + cln["kapsam_disi"], cln["aday"])
        self.assertFalse(cln["okuma"]["dosya_degisti"])

    def test_unique_body_mark_not_in_stdout(self):
        govde = paragraphs("isaret", 2) + [BODY_MARK] + paragraphs("isaret2", 3)
        report, out = self.run_main(base(6) + [article("isaretli", govde=govde)])
        self.assertIn("isaretli", out)
        self.assertNotIn("GOVDEISARETI", out)
        self.assertNotIn("GOVDEISARETI", repr(report))
        self.assertNotIn("Kıyıdaki tabyalar", out)
        self.assertNotIn("anlatım paragrafı", out)

    def test_email_masked(self):
        ust = ["Anasayfa", f"İletişim: {EMAIL}", "Kategoriler"]
        lines = [article(f"e{i}", ust=ust) for i in range(6)]
        lines.append(page("makale-baslik", "İletişim " + EMAIL, text="kısa"))
        report, out = self.run_main(lines)
        self.assertNotIn(EMAIL, out)
        self.assertNotIn("@", out)
        self.assertNotIn(EMAIL, repr(report["makale"]["ust_blok_satirlari"]))
        self.assertIn("[e-posta gizlendi]", out)

    def test_limit_cuts_samples_not_counts(self):
        full = self.load(base(7), limit=20)
        cut = self.load(base(7), limit=2)
        self.assertEqual(len(full["makale"]["ornekler"]), 7)
        self.assertEqual(len(cut["makale"]["ornekler"]), 2)
        for key in full["makale"]:
            if key != "ornekler":
                self.assertEqual(full["makale"][key], cut["makale"][key], key)
        self.assertEqual(full["siniflar"], cut["siniflar"])
        self.assertEqual(full["sablon"], cut["sablon"])

    def test_limit_validation(self):
        with self.assertRaises(ValueError):
            self.load(base(1), limit=0)
        with self.assertRaises(SystemExit), contextlib.redirect_stderr(io.StringIO()):
            self.run_main(base(1), "--limit", "0")
        with self.assertRaises(SystemExit), contextlib.redirect_stderr(io.StringIO()):
            self.run_main(base(1), "--limit", "iki")

    def test_input_required(self):
        with self.assertRaises(SystemExit), contextlib.redirect_stderr(io.StringIO()):
            clean.main([])

    def test_missing_file(self):
        missing = Path(tempfile.gettempdir()) / "yok_boyle_bir_dosya_clean_text.jsonl"
        with self.assertRaises(FileNotFoundError):
            clean.clean_text_preview_jsonl(missing)
        with self.assertRaises(SystemExit) as ctx:
            clean.main(["--input", str(missing)])
        self.assertIn("Girdi dosyası bulunamadı", str(ctx.exception))

    def test_empty_file(self):
        def run(path, _):
            path.write_text("", encoding="utf-8")
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                report = clean.main(["--input", str(path)])
            return report, out.getvalue()

        report, out = self.with_lines([], run)
        self.assertTrue(report["bos_dosya"])
        self.assertEqual((report["okunan"], report["aday"]), (0, 0))
        self.assertIn("girdi dosyası boş", out)
        self.assertIn("örnek yok", out)
        self.assertFalse(report["sablon"]["etkin"])

    def test_broken_json_counted_and_reported(self):
        report, out = self.run_main(["{bozuk", article("saglam"), "[1, 2]"])
        self.assertEqual(report["atlanan"]["bozuk_json"], 1)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 1)
        self.assertEqual(report["hatalar"], ["satır 1: bozuk_json"])
        self.assertEqual(report["aday"], 1)
        self.assertIn("satır 1: bozuk_json", out)

    def test_no_new_file_and_input_hash_unchanged(self):
        def run(path, tmp):
            before = sorted(os.listdir(tmp))
            cwd_before = sorted(os.listdir(os.getcwd()))
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            with contextlib.redirect_stdout(io.StringIO()):
                clean.main(["--input", str(path)])
            self.assertEqual(sorted(os.listdir(tmp)), before)
            self.assertEqual(sorted(os.listdir(os.getcwd())), cwd_before)
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), digest)

        self.with_lines(MIXED + base(6), run)

    def test_file_opened_read_only_utf8_twice(self):
        real_open = builtins.open
        calls = []

        def spy(*args, **kwargs):
            calls.append((args[1:], kwargs))
            return real_open(*args, **kwargs)

        with mock.patch.object(clean, "open", spy, create=True):
            report = self.load(base(2))
        self.assertEqual(calls, [(("r",), {"encoding": "utf-8"})] * 2)
        self.assertEqual(report["okuma"]["gecis"], 2)

    def test_change_between_passes_warns(self):
        def run(path, tmp):
            other = tmp / "degisik.jsonl"
            other.write_text("".join(l + "\n" for l in base(4)), encoding="utf-8")
            real_open = builtins.open
            paths = iter([path, other])

            def swap(_source, *args, **kwargs):
                return real_open(next(paths), *args, **kwargs)

            out = io.StringIO()
            with mock.patch.object(clean, "open", swap, create=True), \
                    contextlib.redirect_stdout(out):
                report = clean.main(["--input", str(path)])
            return report, out.getvalue()

        report, out = self.with_lines(base(3), run)
        self.assertTrue(report["okuma"]["dosya_degisti"])
        self.assertIn(clean.DEGISIM_UYARISI, out)
        self.assertIn("1. geçiş okunan satır: 3; 2. geçiş okunan satır: 4", out)

    def test_cli_has_no_output_or_write_option(self):
        out = io.StringIO()
        with self.assertRaises(SystemExit), contextlib.redirect_stdout(out):
            clean.main(["--help"])
        self.assertIn("--input", out.getvalue())
        self.assertNotIn("--output", out.getvalue())
        self.assertNotIn("--write", out.getvalue())
        for option in ("--output", "--write"):
            with self.assertRaises(SystemExit), contextlib.redirect_stderr(io.StringIO()):
                self.run_main(base(1), option, "temiz.jsonl")

    def test_header_note_and_no_verified_status(self):
        report, out = self.run_main(MIXED + base(6))
        self.assertEqual(
            out.splitlines()[0],
            "Salt okunur temizleme önizlemesi; hiçbir metin değiştirilmedi veya yazılmadı; "
            "metin temizliği tarihsel doğrulama değildir; tüm kayıtlar insan_incelemesi_gerekli",
        )
        self.assertNotIn("iddia_dogrulandi", out)
        self.assertNotIn("iddia_dogrulandi", repr(report))

    def test_no_date_field_and_dates_not_printed(self):
        ust = ["Anasayfa", "18 Mart 1915", "Kategoriler", "admin"]
        govde = ["18 Mart 1915 günü Bouvet, Irresistible ve Ocean battı."] + paragraphs("tarih")
        lines = base(6) + [article("deniz", ust=ust, govde=govde, published_date="2015-03-18")]
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
