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

    # --- Aşama 5.5: breadcrumb, yayın sayacı, konu navigasyonu ---

    NAV_SONRAKI = ["SONRAKİ KONU", "Kısa sonraki yazı başlığı", "İkinci kısa yazı başlığı"]
    NAV_ONCEKI = ["ÖNCEKİ KONU", "Kısa önceki yazı başlığı", "Diğer kısa yazı başlığı"]
    YAYIN_UCULU = ["26.12.2022", "0", "807"]
    YORUM_FORMU = ["BİR YORUM YAZIN", "Henüz yorum yapılmamış."]
    KIRINTI = ["Anasayfa", "»"]
    KISA_NAV_GOVDE = 8
    UZUN_KOMŞU = (
        "Çanakkale ihracat ve ikmal hatları üzerine yazılmış çok uzun bir sonraki yazı başlığı"
    )
    OCAK_KOMŞU = "9 Ocak 1916 Çanakkale Zaferi Kutlandı"

    def test_sentence_anasayfa_stays_body(self):
        cumle = "Bu yazının Anasayfa bağlantısı gövde cümlesinin içinde geçer ve kesilmez."
        govde = paragraphs("cumleana", 3) + [cumle] + paragraphs("cumleana2", 3)
        report = self.load(base(10) + [article("cumleana", govde=govde)])
        ornek = self.sample(report, "cumleana")
        self.assertEqual(ornek["ust_sinir_satiri"], 3)
        self.assertEqual(ornek["satir_kategorileri"][3 + 1 + 3], "korunacak_govde")
        self.assertEqual(ornek["sinir_guveni"], "yuksek")

    def test_lone_anasayfa_without_chevron_stays_body(self):
        govde = paragraphs("tekanasayfa", 3) + ["Anasayfa"] + paragraphs("tekanasayfa2", 3)
        report = self.load(base(10) + [article("tekanasayfa", govde=govde)])
        ornek = self.sample(report, "tekanasayfa")
        self.assertEqual(ornek["satir_kategorileri"][3 + 1 + 3], "korunacak_govde")
        self.assertNotEqual(ornek.get("ust_neden"), "breadcrumb")
        self.assertEqual(ornek["ust_sinir_satiri"], 3)

    def test_gun_ay_at_end_without_interface_stays_body(self):
        lines = base(10) + [
            article("martson", alt=[], govde=paragraphs("martson") + ["18 Mart 1915"]),
            article("mayisson", alt=[], govde=paragraphs("mayisson") + ["1 Mayıs 1915"]),
        ]
        report = self.load(lines)
        for key, baslik in (("martson", "18 Mart 1915"), ("mayisson", "1 Mayıs 1915")):
            ornek = self.sample(report, key)
            self.assertIsNone(ornek["alt_sinir_satiri"], key)
            self.assertEqual(ornek["satir_kategorileri"][-1], "korunacak_govde", baslik)
            self.assertNotIn("yayin_sayac", ornek.get("alt_on_bolge") or [])

    def test_bibliography_and_long_citation_before_tweetle_stay_body(self):
        kuye = (
            "Yazar Adı, Çanakkale üzerine uzun bir kaynak künyesi, yayınevi, yer ve sayfa "
            "bilgisi burada tek satırda durur ve gövde olarak korunmalıdır."
        )
        govde = paragraphs("kaynakca", 6) + ["Kaynakça", kuye]
        report = self.load(base(10) + [article("kaynakca", govde=govde)])
        ornek = self.sample(report, "kaynakca")
        kaynak_i = 3 + 1 + 6
        self.assertEqual(ornek["satir_kategorileri"][kaynak_i], "korunacak_govde")
        self.assertEqual(ornek["satir_kategorileri"][kaynak_i + 1], "korunacak_govde")
        self.assertEqual(ornek["satir_kategorileri"][kaynak_i + 2], "yuksek_guvenli_arayuz")
        self.assertEqual(ornek["alt_sinir_satiri"], kaynak_i + 3)
        self.assertGreater(len(kuye), clean.UZUN_SATIR_ESIGI)

    def test_footnote_and_atase_stay_body(self):
        govde = paragraphs("dipnot", 6) + ["Dipnot", "ATASE", "Arşiv kaydı gövde satırı olarak kalır."]
        report = self.load(base(10) + [article("dipnot", govde=govde)])
        ornek = self.sample(report, "dipnot")
        i = 3 + 1 + 6
        self.assertEqual(ornek["satir_kategorileri"][i:i + 3], ["korunacak_govde"] * 3)

    def test_repeated_long_quote_phase55_still_body(self):
        lines = base(10) + [
            article(f"alinti55{i}", govde=paragraphs(f"q55{i}", 3) + [ALINTI] + paragraphs(f"r55{i}", 3))
            for i in range(3)
        ]
        report = self.load(lines)
        for i in range(3):
            ornek = self.sample(report, f"alinti55{i}")
            alinti_i = 3 + 1 + 3
            self.assertEqual(ornek["satir_kategorileri"][alinti_i], "korunacak_govde")
            self.assertEqual(ornek["tekrarlanan_uzun_satir_korundu"], 1)

    def test_artillery_regiment_line_stays_body_without_next_topic(self):
        govde = paragraphs("topcu", 6) + ["9. Topçu Alayı"]
        report = self.load(base(10) + [article("topcu", govde=govde)])
        ornek = self.sample(report, "topcu")
        self.assertEqual(ornek["satir_kategorileri"][3 + 1 + 6], "korunacak_govde")
        self.assertNotIn("sonraki_konu", ornek.get("alt_on_bolge") or [])

    def test_lone_counter_or_numeric_date_in_mid_body_stay_body(self):
        lines = base(10) + [
            article("sayiorta", govde=paragraphs("s1", 3) + ["807"] + paragraphs("s2", 3)),
            article("tarihorta", govde=paragraphs("t1", 3) + ["26.12.2022"] + paragraphs("t2", 3)),
        ]
        report = self.load(lines)
        for key, offset in (("sayiorta", 3 + 1 + 3), ("tarihorta", 3 + 1 + 3)):
            ornek = self.sample(report, key)
            self.assertEqual(ornek["satir_kategorileri"][offset], "korunacak_govde", key)
            self.assertNotIn("yayin_sayac", ornek.get("alt_on_bolge") or [])

    def test_lone_chevron_stays_body(self):
        govde = paragraphs("okisaret", 3) + ["»"] + paragraphs("okisaret2", 3)
        report = self.load(base(10) + [article("okisaret", govde=govde)])
        ornek = self.sample(report, "okisaret")
        self.assertEqual(ornek["satir_kategorileri"][3 + 1 + 3], "korunacak_govde")
        self.assertNotEqual(ornek.get("ust_neden"), "breadcrumb")

    def test_lone_next_topic_without_interface_stays_body(self):
        report = self.load(base(10) + [
            article("sonrakitek", alt=[], govde=paragraphs("sonrakitek") + ["SONRAKİ KONU"]),
        ])
        ornek = self.sample(report, "sonrakitek")
        self.assertIsNone(ornek["alt_sinir_satiri"])
        self.assertEqual(ornek["satir_kategorileri"][-1], "korunacak_govde")
        self.assertEqual(ornek.get("alt_on_bolge") or [], [])

    def test_breadcrumb_lines_1_2_then_title_body_and_high_form(self):
        report = self.load(base(10) + [article("kirinti", ust=self.KIRINTI)])
        ornek = self.sample(report, "kirinti")
        self.assertEqual(ornek["ust_neden"], "breadcrumb")
        self.assertEqual(ornek["ust_sinir_satiri"], 2)
        self.assertEqual(ornek["satir_kategorileri"][:3], [
            "yuksek_guvenli_arayuz", "yuksek_guvenli_arayuz", "korunacak_govde",
        ])
        self.assertEqual(ornek["sinir_guveni"], "yuksek")
        alt = ornek["alt_sinir_satiri"]
        self.assertEqual(alt, 2 + 1 + 6 + 1)
        self.assertEqual(ornek["satir_kategorileri"][alt - 1], "yuksek_guvenli_arayuz")
        self.assertEqual(self.kat(ornek, "belirsiz_insan_incelemesi"), 0)

    def test_real_archive_title_then_breadcrumb_title_kept(self):
        report = self.load(base(10) + [
            article("gercekkonum", ust=[], govde=self.KIRINTI + paragraphs("gercekkonum")),
        ])
        ornek = self.sample(report, "gercekkonum")
        cats = ornek["satir_kategorileri"]
        self.assertEqual(ornek["ust_neden"], "breadcrumb")
        self.assertEqual(ornek["ust_sinir_satiri"], 3)
        self.assertEqual(cats[0], "korunacak_govde")
        self.assertEqual(cats[1:3], ["yuksek_guvenli_arayuz", "yuksek_guvenli_arayuz"])
        self.assertEqual(cats[3], "korunacak_govde")
        self.assertEqual(ornek["sinir_guveni"], "yuksek")
        govde_aralik = [i + 1 for i, k in enumerate(cats) if k == "korunacak_govde"]
        self.assertIn(1, govde_aralik)

    def test_date_counters_join_high_only_when_alt_already_high(self):
        alt = self.YAYIN_UCULU + self.YORUM_FORMU
        report = self.load(base(10) + [article("yayinyuksek", alt=alt)])
        ornek = self.sample(report, "yayinyuksek")
        triple_i = 3 + 1 + 6
        self.assertEqual(ornek["alt_on_bolge"], ["yayin_sayac"])
        self.assertEqual(ornek["satir_kategorileri"][triple_i:triple_i + 3], ["yuksek_guvenli_arayuz"] * 3)
        self.assertEqual(ornek["satir_kategorileri"][triple_i + 3], "yuksek_guvenli_arayuz")
        self.assertEqual(ornek["alt_sinir_satiri"], triple_i + 4)
        self.assertEqual(ornek["sinir_guveni"], "yuksek")
        self.assertEqual(self.kat(ornek, "belirsiz_insan_incelemesi"), 0)

    def test_date_counters_stay_uncertain_when_alt_uncertain_no_upgrade(self):
        alt = self.YAYIN_UCULU + self.YORUM_FORMU + [YORUM]
        report = self.load(base(10) + [article("yayinbelirsiz", alt=alt)])
        ornek = self.sample(report, "yayinbelirsiz")
        triple_i = 3 + 1 + 6
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")
        self.assertEqual(ornek["alt_on_bolge"], ["yayin_sayac"])
        self.assertEqual(ornek["satir_kategorileri"][triple_i:triple_i + 3],
                         ["belirsiz_insan_incelemesi"] * 3)
        self.assertEqual(ornek["satir_kategorileri"][triple_i + 3], "belirsiz_insan_incelemesi")
        self.assertIn("alt_blokta_uzun_satir", ornek["riskler"])
        self.assertEqual(self.kat(ornek, "yuksek_guvenli_arayuz"), 3)

    def test_next_topic_uncertain_tweetle_high_two_region(self):
        alt = self.NAV_SONRAKI + ALT
        report = self.load(base(10) + [
            article("ikibolge", govde=paragraphs("ikibolge", self.KISA_NAV_GOVDE), alt=alt),
        ])
        ornek = self.sample(report, "ikibolge")
        nav_i = 3 + 1 + self.KISA_NAV_GOVDE
        cats = ornek["satir_kategorileri"]
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")
        self.assertEqual(ornek["alt_on_bolge"], ["sonraki_konu"])
        self.assertEqual(cats[nav_i:nav_i + 3], ["belirsiz_insan_incelemesi"] * 3)
        self.assertEqual(cats[nav_i + 3], "yuksek_guvenli_arayuz")
        self.assertEqual(ornek["alt_sinir_satiri"], nav_i + 4)
        self.assertIn(
            (nav_i + 1, nav_i + 3, "belirsiz_insan_incelemesi"), ornek["bolgeler"]
        )
        self.assertTrue(any(
            b[0] == nav_i + 4 and b[2] == "yuksek_guvenli_arayuz" for b in ornek["bolgeler"]
        ))
        self.assertEqual(self.kat(ornek, "yuksek_guvenli_arayuz"), 3 + len(ALT))

    def test_previous_topic_symmetric_uncertain(self):
        alt = self.NAV_ONCEKI + ALT
        report = self.load(base(10) + [
            article("oncekibolge", govde=paragraphs("oncekibolge", self.KISA_NAV_GOVDE), alt=alt),
        ])
        ornek = self.sample(report, "oncekibolge")
        nav_i = 3 + 1 + self.KISA_NAV_GOVDE
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")
        self.assertEqual(ornek["alt_on_bolge"], ["onceki_konu"])
        self.assertEqual(ornek["satir_kategorileri"][nav_i:nav_i + 3],
                         ["belirsiz_insan_incelemesi"] * 3)
        self.assertEqual(ornek["satir_kategorileri"][nav_i + 3], "yuksek_guvenli_arayuz")
        self.assertEqual(ornek["alt_sinir_satiri"], nav_i + 4)

    def test_existing_high_comment_form_still_high(self):
        report = self.load(base(10))
        ornek = self.sample(report, "ortak0")
        self.assertEqual(ornek["sinir_guveni"], "yuksek")
        self.assertEqual(self.kat(ornek, "yuksek_guvenli_arayuz"), 7)
        self.assertEqual(self.kat(ornek, "belirsiz_insan_incelemesi"), 0)

    def test_existing_long_comment_still_uncertain(self):
        alt = ["Tweetle", "BENZER KONULAR", *BENZER, "BİR YORUM YAZIN", YORUM]
        report = self.load(base(10) + [article("yorum55", alt=alt)])
        ornek = self.sample(report, "yorum55")
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")
        self.assertEqual(self.kat(ornek, "belirsiz_insan_incelemesi"), len(alt))
        self.assertEqual(self.kat(ornek, "yuksek_guvenli_arayuz"), 3)

    def test_old_upper_and_new_breadcrumb_locked_in_same_file(self):
        lines = base(10) + [article("kirinti", ust=self.KIRINTI)]
        report = self.load(lines)
        eski = self.sample(report, "ortak0")
        self.assertEqual(eski["ust_sinir_satiri"], 3)
        self.assertEqual(eski["ust_neden"], "sablon")
        self.assertEqual(eski["satir_kategorileri"][:4], [
            "yuksek_guvenli_arayuz", "yuksek_guvenli_arayuz", "yuksek_guvenli_arayuz",
            "korunacak_govde",
        ])
        yeni = self.sample(report, "kirinti")
        self.assertEqual(yeni["ust_neden"], "breadcrumb")
        self.assertEqual(yeni["ust_sinir_satiri"], 2)
        self.assertEqual(yeni["satir_kategorileri"][:3], [
            "yuksek_guvenli_arayuz", "yuksek_guvenli_arayuz", "korunacak_govde",
        ])

    def test_breadcrumb_does_not_trigger_from_line_four(self):
        ust = ["Menü", "Kategoriler", "admin", "Anasayfa", "»"]
        report = self.load(base(10) + [article("derin", ust=ust)])
        ornek = self.sample(report, "derin")
        self.assertNotEqual(ornek.get("ust_neden"), "breadcrumb")
        self.assertNotEqual(ornek["satir_kategorileri"][3], "yuksek_guvenli_arayuz")

    def test_phase55_cli_does_not_print_body(self):
        govde = paragraphs("faz55", 2) + [BODY_MARK] + paragraphs("faz55b", 3)
        lines = base(10) + [
            article("faz55", ust=self.KIRINTI, govde=govde),
            article("ikibolge", govde=paragraphs("ikibolge", self.KISA_NAV_GOVDE),
                    alt=self.NAV_SONRAKI + ALT),
        ]
        report, out = self.run_main(lines)
        self.assertNotIn("GOVDEISARETI", out)
        self.assertNotIn("Kıyıdaki tabyalar", out)
        self.assertNotIn("anlatım paragrafı", out)
        self.assertNotIn("--output", out)
        self.assertIn("ust_neden: breadcrumb", out)
        self.assertIn("alt_on_bolge: sonraki_konu", out)

    def test_chevron_without_anasayfa_stays_body(self):
        ust = ["Birlikler", "»"]
        report = self.load(base(10) + [article("oksuz", ust=ust)])
        ornek = self.sample(report, "oksuz")
        self.assertNotEqual(ornek.get("ust_neden"), "breadcrumb")
        self.assertEqual(ornek["satir_kategorileri"][0], "korunacak_govde")
        self.assertEqual(ornek["satir_kategorileri"][1], "korunacak_govde")

    def test_next_topic_without_alt_headings_stays_body(self):
        report = self.load(base(10) + [
            article(
                "sonrakialtsiz",
                alt=[],
                govde=paragraphs("sonrakialtsiz") + ["SONRAKİ KONU", self.UZUN_KOMŞU],
            ),
        ])
        ornek = self.sample(report, "sonrakialtsiz")
        self.assertIsNone(ornek["alt_sinir_satiri"])
        self.assertEqual(ornek["satir_kategorileri"][-2], "korunacak_govde")
        self.assertEqual(ornek["satir_kategorileri"][-1], "korunacak_govde")
        self.assertEqual(ornek.get("alt_on_bolge") or [], [])

    def test_bibliography_in_next_topic_span_stays_body_not_high(self):
        alt = ["SONRAKİ KONU", "Kaynakça", *ALT]
        report = self.load(base(10) + [
            article("navkaynak", govde=paragraphs("navkaynak", self.KISA_NAV_GOVDE), alt=alt),
        ])
        ornek = self.sample(report, "navkaynak")
        nav_i = 3 + 1 + self.KISA_NAV_GOVDE
        cats = ornek["satir_kategorileri"]
        self.assertEqual(ornek.get("alt_on_bolge") or [], [])
        self.assertEqual(cats[nav_i], "korunacak_govde")
        self.assertEqual(cats[nav_i + 1], "korunacak_govde")
        self.assertNotEqual(cats[nav_i + 1], "yuksek_guvenli_arayuz")
        self.assertEqual(cats[nav_i + 2], "yuksek_guvenli_arayuz")

    def test_footnote_atase_in_next_topic_span_stay_body_not_high(self):
        lines = base(10) + [
            article(
                "navdipnot",
                govde=paragraphs("navdipnot", self.KISA_NAV_GOVDE),
                alt=["SONRAKİ KONU", "Dipnot", *ALT],
            ),
            article(
                "navatase",
                govde=paragraphs("navatase", self.KISA_NAV_GOVDE),
                alt=["SONRAKİ KONU", "ATASE", *ALT],
            ),
        ]
        report = self.load(lines)
        for key, etiket in (("navdipnot", "Dipnot"), ("navatase", "ATASE")):
            ornek = self.sample(report, key)
            nav_i = 3 + 1 + self.KISA_NAV_GOVDE
            cats = ornek["satir_kategorileri"]
            self.assertEqual(ornek.get("alt_on_bolge") or [], [], key)
            self.assertEqual(cats[nav_i], "korunacak_govde", etiket)
            self.assertEqual(cats[nav_i + 1], "korunacak_govde", etiket)
            self.assertNotEqual(cats[nav_i + 1], "yuksek_guvenli_arayuz", etiket)

    def test_second_chevron_after_recognized_breadcrumb_high(self):
        title = "Yazı ikinciok"
        govde = ["Anasayfa", "»", "Birlikler", "»", title, *paragraphs("ikinciok")]
        alt = self.YAYIN_UCULU + self.YORUM_FORMU
        report = self.load(base(10) + [
            article("ikinciok", ust=[], govde=govde, alt=alt, title=title),
        ])
        ornek = self.sample(report, "ikinciok")
        cats = ornek["satir_kategorileri"]
        self.assertEqual(ornek["ust_neden"], "breadcrumb")
        self.assertEqual(ornek["ust_sinir_satiri"], 5)
        self.assertEqual(cats[0], "korunacak_govde")
        self.assertEqual(cats[1:5], ["yuksek_guvenli_arayuz"] * 4)
        self.assertEqual(cats[5], "korunacak_govde")
        self.assertEqual(ornek["sinir_guveni"], "yuksek")
        self.assertEqual(ornek["alt_on_bolge"], ["yayin_sayac"])
        triple_i = 1 + 5 + 6
        self.assertEqual(cats[triple_i:triple_i + 3], ["yuksek_guvenli_arayuz"] * 3)
        self.assertEqual(cats[triple_i + 3], "yuksek_guvenli_arayuz")
        self.assertEqual(self.kat(ornek, "belirsiz_insan_incelemesi"), 0)

    def test_third_crumb_not_swallowed(self):
        title = "Yazı ucuncuok"
        govde = ["Anasayfa", "»", "Birlikler", "»", "Makaleler", "»", title, *paragraphs("ucuncuok")]
        report = self.load(base(10) + [
            article("ucuncuok", ust=[], govde=govde, title=title),
        ])
        ornek = self.sample(report, "ucuncuok")
        cats = ornek["satir_kategorileri"]
        self.assertEqual(ornek["ust_neden"], "breadcrumb")
        self.assertEqual(cats[0], "korunacak_govde")
        self.assertEqual(cats[1:5], ["yuksek_guvenli_arayuz"] * 4)
        self.assertEqual(cats[5], "korunacak_govde")
        self.assertEqual(cats[6], "korunacak_govde")
        self.assertEqual(cats[7], "korunacak_govde")

    def test_next_topic_long_neighbor_uncertain_tweetle_high(self):
        self.assertGreater(len(self.UZUN_KOMŞU), clean.KISA_SATIR_ESIGI)
        alt = ["SONRAKİ KONU", self.UZUN_KOMŞU, *ALT]
        report = self.load(base(10) + [
            article("uzunsonraki", govde=paragraphs("uzunsonraki", self.KISA_NAV_GOVDE), alt=alt),
        ])
        ornek = self.sample(report, "uzunsonraki")
        nav_i = 3 + 1 + self.KISA_NAV_GOVDE
        cats = ornek["satir_kategorileri"]
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")
        self.assertEqual(ornek["alt_on_bolge"], ["sonraki_konu"])
        self.assertEqual(cats[nav_i:nav_i + 2], ["belirsiz_insan_incelemesi"] * 2)
        self.assertEqual(cats[nav_i + 2], "yuksek_guvenli_arayuz")
        self.assertEqual(ornek["alt_sinir_satiri"], nav_i + 3)
        self.assertIn((nav_i + 1, nav_i + 2, "belirsiz_insan_incelemesi"), ornek["bolgeler"])

    def test_ocak_neighbor_not_high_with_next_topic(self):
        self.assertTrue(clean.KORUNAN_KALIPLAR["gun_ay"].search(self.OCAK_KOMŞU.lower()))
        govde = paragraphs("ocaknav", self.KISA_NAV_GOVDE) + ["9. Topçu Alayı"]
        alt = ["SONRAKİ KONU", self.OCAK_KOMŞU, *ALT]
        report = self.load(base(10) + [article("ocaknav", govde=govde, alt=alt)])
        ornek = self.sample(report, "ocaknav")
        nav_i = 3 + 1 + self.KISA_NAV_GOVDE
        cats = ornek["satir_kategorileri"]
        self.assertEqual(cats[nav_i], "korunacak_govde")
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")
        self.assertEqual(ornek["alt_on_bolge"], ["sonraki_konu"])
        self.assertEqual(cats[nav_i + 1], "belirsiz_insan_incelemesi")
        self.assertEqual(cats[nav_i + 2], "belirsiz_insan_incelemesi")
        self.assertNotEqual(cats[nav_i + 2], "yuksek_guvenli_arayuz")
        self.assertEqual(cats[nav_i + 3], "yuksek_guvenli_arayuz")

    def test_previous_topic_long_neighbor_symmetric(self):
        alt = ["ÖNCEKİ KONU", self.UZUN_KOMŞU, *ALT]
        report = self.load(base(10) + [
            article("uzunonceki", govde=paragraphs("uzunonceki", self.KISA_NAV_GOVDE), alt=alt),
        ])
        ornek = self.sample(report, "uzunonceki")
        nav_i = 3 + 1 + self.KISA_NAV_GOVDE
        cats = ornek["satir_kategorileri"]
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")
        self.assertEqual(ornek["alt_on_bolge"], ["onceki_konu"])
        self.assertEqual(cats[nav_i:nav_i + 2], ["belirsiz_insan_incelemesi"] * 2)
        self.assertNotEqual(cats[nav_i + 1], "yuksek_guvenli_arayuz")
        self.assertEqual(cats[nav_i + 2], "yuksek_guvenli_arayuz")

    # --- Aşama 5.5.2: tanınmış kırıntıda kategori sıklığı üst bloğu belirsizleştirmez ---

    KIRINTI_KUEYE = (
        "Yazar Adı, Çanakkale üzerine uzun bir kaynak künyesi, yayınevi, yer ve sayfa "
        "bilgisi burada tek satırda durur ve gövde olarak korunmalıdır."
    )
    TARIHSEL_GOVDE = (
        "18 Mart 1915 günü Boğaz önünde Bouvet, Irresistible ve Ocean battı; bu uzun "
        "tarihsel anlatım gövde satırı olarak kalmalı ve kırıntı gerekçesiyle kesilmemeli."
    )

    def kirinti_siklik_satirlari(self, kut0_govde=None, kut0_alt=None):
        # 15 makale: Birlikler %50+; Kütüphane %20–50 şablon; Makaleler/Manşet %20 altı.
        lines = [
            article(f"birlik{i}", ust=["Anasayfa", "»", "Birlikler", "»"])
            for i in range(10)
        ]
        for i in range(3):
            govde = kut0_govde if i == 0 and kut0_govde is not None else None
            alt = kut0_alt if i == 0 and kut0_alt is not None else ALT
            lines.append(article(
                f"kut{i}", ust=["Anasayfa", "»", "Kütüphane", "»"], govde=govde, alt=alt,
            ))
        lines.append(article("manset", ust=["Anasayfa", "»", "Manşet", "»"]))
        lines.append(article("makaleler", ust=["Anasayfa", "»", "Makaleler", "»"]))
        return lines

    def assert_yuksek_kirinti(self, ornek, etiket):
        cats = ornek["satir_kategorileri"]
        self.assertEqual(ornek["ust_neden"], "breadcrumb", etiket)
        self.assertEqual(ornek["ust_sinir_satiri"], 4, etiket)
        self.assertEqual(cats[:4], ["yuksek_guvenli_arayuz"] * 4, etiket)
        self.assertEqual(cats[4], "korunacak_govde", etiket)
        self.assertNotIn("ust_blok_dusuk_oran", ornek["riskler"], etiket)
        self.assertNotEqual(cats[2], "belirsiz_insan_incelemesi", etiket)

    def test_recognized_crumb_same_high_across_frequency_bands(self):
        report = self.load(self.kirinti_siklik_satirlari())
        self.assertEqual(report["sablon"]["makale_metinli"], 15)
        self.assertEqual(report["sablon"]["esik_kayit"], 3)
        self.assertEqual(report["sablon"]["yuksek_esik_kayit"], 8)
        for i in range(10):
            self.assert_yuksek_kirinti(self.sample(report, f"birlik{i}"), "Birlikler")
            self.assertEqual(self.sample(report, f"birlik{i}")["sinir_guveni"], "yuksek")
        for i in range(3):
            ornek = self.sample(report, f"kut{i}")
            self.assert_yuksek_kirinti(ornek, "Kütüphane")
            self.assertEqual(ornek["sinir_guveni"], "yuksek")
        for key, etiket in (("manset", "Manşet"), ("makaleler", "Makaleler")):
            ornek = self.sample(report, key)
            self.assert_yuksek_kirinti(ornek, etiket)
            self.assertEqual(ornek["sinir_guveni"], "yuksek")

    def test_recognized_crumb_high_when_comment_form_high_even_if_label_mid_rate(self):
        alt = self.YAYIN_UCULU + self.YORUM_FORMU
        report = self.load(self.kirinti_siklik_satirlari(kut0_alt=alt))
        ornek = self.sample(report, "kut0")
        self.assert_yuksek_kirinti(ornek, "Kütüphane")
        self.assertEqual(ornek["sinir_guveni"], "yuksek")
        self.assertEqual(ornek["alt_on_bolge"], ["yayin_sayac"])
        self.assertEqual(self.kat(ornek, "belirsiz_insan_incelemesi"), 0)

    def test_recognized_crumb_top_high_when_comments_uncertain(self):
        alt = [*ALT, YORUM]
        report = self.load(self.kirinti_siklik_satirlari(kut0_alt=alt))
        ornek = self.sample(report, "kut0")
        self.assert_yuksek_kirinti(ornek, "Kütüphane")
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")
        self.assertIn("alt_blokta_uzun_satir", ornek["riskler"])
        self.assertEqual(ornek["satir_kategorileri"][ornek["alt_sinir_satiri"] - 1],
                         "belirsiz_insan_incelemesi")

    def test_incomplete_breadcrumb_not_promoted_high(self):
        lines = base(10) + [
            article("tekanasayfaust", ust=["Anasayfa"]),
            article("anasayfasizok", ust=["»", "Birlikler", "»"]),
            article("kategoriok", ust=["Makaleler", "»"]),
            article("anasayfaetiket", ust=["Anasayfa", "Manşet", "»"]),
        ]
        report = self.load(lines)
        for key in ("tekanasayfaust", "anasayfasizok", "kategoriok", "anasayfaetiket"):
            ornek = self.sample(report, key)
            self.assertNotEqual(ornek.get("ust_neden"), "breadcrumb", key)
        tek = self.sample(report, "tekanasayfaust")
        self.assertEqual(tek["satir_kategorileri"][1], "korunacak_govde")
        oksuz = self.sample(report, "anasayfasizok")
        self.assertEqual(oksuz["satir_kategorileri"][:3], ["korunacak_govde"] * 3)
        kat = self.sample(report, "kategoriok")
        self.assertEqual(kat["satir_kategorileri"][:2], ["korunacak_govde"] * 2)
        eksik = self.sample(report, "anasayfaetiket")
        self.assertEqual(eksik["satir_kategorileri"][1], "korunacak_govde")
        self.assertEqual(eksik["satir_kategorileri"][2], "korunacak_govde")

    def test_third_crumb_not_swallowed_with_frequent_second_label(self):
        lines = self.kirinti_siklik_satirlari()
        title = "Yazı ucuncusik"
        govde = ["Anasayfa", "»", "Birlikler", "»", "Makaleler", "»", title, *paragraphs("ucuncusik")]
        lines.append(article("ucuncusik", ust=[], govde=govde, title=title))
        report = self.load(lines)
        self.assertEqual(report["sablon"]["makale_metinli"], 16)
        ornek = self.sample(report, "ucuncusik")
        cats = ornek["satir_kategorileri"]
        self.assertEqual(ornek["ust_neden"], "breadcrumb")
        self.assertEqual(cats[0], "korunacak_govde")
        self.assertEqual(cats[1:5], ["yuksek_guvenli_arayuz"] * 4)
        self.assertEqual(cats[5:8], ["korunacak_govde"] * 3)

    def test_crumb_keeps_title_bibliography_date_and_long_body(self):
        self.assertGreater(len(self.KIRINTI_KUEYE), clean.UZUN_SATIR_ESIGI)
        govde = paragraphs("kut0", 6) + [
            "Kaynakça", self.KIRINTI_KUEYE, "18 Mart 1915", self.TARIHSEL_GOVDE,
        ]
        report = self.load(self.kirinti_siklik_satirlari(kut0_govde=govde))
        ornek = self.sample(report, "kut0")
        cats = ornek["satir_kategorileri"]
        self.assert_yuksek_kirinti(ornek, "Kütüphane")
        self.assertEqual(cats[4], "korunacak_govde")
        kaynak_i = 4 + 1 + 6
        self.assertEqual(cats[kaynak_i], "korunacak_govde")
        self.assertEqual(cats[kaynak_i + 1], "korunacak_govde")
        self.assertEqual(cats[kaynak_i + 2], "korunacak_govde")
        self.assertEqual(cats[kaynak_i + 3], "korunacak_govde")
        self.assertNotEqual(cats[kaynak_i], "yuksek_guvenli_arayuz")
        self.assertEqual(cats[kaynak_i + 4], "yuksek_guvenli_arayuz")

    def test_lone_category_or_date_in_body_not_deletion_reason(self):
        lines = base(10) + [
            article("tekbirlik", govde=paragraphs("tb", 3) + ["Birlikler"] + paragraphs("tb2", 3)),
            article("tekkut", govde=paragraphs("tk", 3) + ["Kütüphane"] + paragraphs("tk2", 3)),
            article("tekok", govde=paragraphs("to", 3) + ["»"] + paragraphs("to2", 3)),
            article("tektarih", govde=paragraphs("tt", 3) + ["18 Mart 1915"] + paragraphs("tt2", 3)),
        ]
        report = self.load(lines)
        for key, offset in (
            ("tekbirlik", 3 + 1 + 3),
            ("tekkut", 3 + 1 + 3),
            ("tekok", 3 + 1 + 3),
            ("tektarih", 3 + 1 + 3),
        ):
            ornek = self.sample(report, key)
            self.assertEqual(ornek["satir_kategorileri"][offset], "korunacak_govde", key)
            self.assertNotEqual(ornek.get("ust_neden"), "breadcrumb", key)

    def test_template_run_mid_rate_line_still_uncertain(self):
        lines = [article(f"ortakmenu{i}") for i in range(10)]
        lines += [article(f"aramenu{i}", ust=["Anasayfa", "AraMenu", "admin"]) for i in range(3)]
        report = self.load(lines)
        self.assertEqual(report["sablon"]["makale_metinli"], 13)
        self.assertEqual(report["sablon"]["esik_kayit"], 3)
        self.assertEqual(report["sablon"]["yuksek_esik_kayit"], 7)
        ornek = self.sample(report, "aramenu0")
        self.assertEqual(ornek["ust_neden"], "sablon")
        self.assertIn("ust_blok_dusuk_oran", ornek["riskler"])
        self.assertEqual(ornek["satir_kategorileri"][:3], ["belirsiz_insan_incelemesi"] * 3)
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")

    def test_anasayfa_below_high_rate_crumb_still_uncertain(self):
        lines = [article(f"menusuz{i}", ust=["Kategoriler", "admin", "Menü"]) for i in range(10)]
        lines += [
            article(f"azana{i}", ust=["Anasayfa", "»", "Birlikler", "»"]) for i in range(3)
        ]
        report = self.load(lines)
        self.assertEqual(report["sablon"]["esik_kayit"], 3)
        self.assertEqual(report["sablon"]["yuksek_esik_kayit"], 7)
        ornek = self.sample(report, "azana0")
        self.assertEqual(ornek["ust_neden"], "breadcrumb")
        self.assertIn("ust_blok_dusuk_oran", ornek["riskler"])
        self.assertEqual(ornek["satir_kategorileri"][:4], ["belirsiz_insan_incelemesi"] * 4)
        self.assertEqual(ornek["sinir_guveni"], "belirsiz")


if __name__ == "__main__":
    unittest.main()
