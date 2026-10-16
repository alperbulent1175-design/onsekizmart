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

import map_canakkale_aday as mapper
import preview_canakkale_clean_text as clean
import review_canakkale_text as review

BASE = "https://www.canakkalecephesi.com/"
UST = ["Anasayfa", "Kategoriler", "admin"]
ALT = ["Tweetle", "BENZER KONULAR", "BİR YORUM YAZIN", "Henüz yorum yapılmamış."]
ALT_PAYLAS = ["Paylaş", "Bunu paylaş:", "Henüz yorum yapılmamış."]
TARIHLI_UST = ["Anasayfa", "18 Mart 1915", "Kategoriler", "admin"]
ADMIN_UST = ["Anasayfa", "Yazan: admin ve misafir yazar notu", "Kategoriler", "admin"]
GIZLI = "GIZLIGOVDE_51c3e9 pencere dışında kalması gereken satır"
SON_PARAGRAF = (
    "SONPARAGRAF_ISARETI makalenin son paragrafı burada biter ve hemen ardından "
    "paylaşım başlığı gelir."
)
EMAIL = "sentetik.okur@example.com"
NUMARA = "05551234567"
KAYNAKLAR = [
    f"Sentetik kaynak satırı {j}: yazar adı, kitap adı, yayınevi ve sayfa bilgisi burada "
    "uzun bir künye satırı olarak yer alır ve kaynakça bölümünün parçası sayılır."
    for j in range(3)
]
LABEL_GOVDE = "[KORUNACAK GÖVDE]"
LABEL_ARAYUZ = "[YÜKSEK GÜVENLİ ARAYÜZ]"
LABEL_BELIRSIZ = "[BELİRSİZ – İNSAN İNCELEMESİ]"


def url(slug):
    return BASE + slug


def kimlik(slug):
    return mapper.candidate_from_page({"url": url(slug), "title": "x"})["id"]


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


def yorum(key):
    return f"Okuyucu yorumu {key}: bu yazıda anlatılan tabyaları ziyaret ettim ve çok etkilendim."


def article(key, ust=UST, govde=None, alt=ALT, title=None):
    title = title or f"Yazı {key}"
    govde = paragraphs(key) if govde is None else govde
    return page(f"makale-{key}", title, text="\n".join([*ust, title, *govde, *alt]))


def ortam():
    # 12 yüksek güvenli (3 uzunluk x 2 alt başlık x 2) ve 6 belirsiz makale.
    lines = []
    for count, boy in ((4, "k"), (10, "o"), (25, "u")):
        for harf, alt in (("t", ALT), ("p", ALT_PAYLAS)):
            for i in range(2):
                key = f"y{boy}{harf}{i}"
                govde = paragraphs(key, count)
                if key == "yut0":
                    govde = paragraphs(key, 10) + [GIZLI] + paragraphs(key + "b", 14)
                if key == "yot0":
                    govde = paragraphs(key, 9) + [SON_PARAGRAF]
                lines.append(article(key, govde=govde, alt=alt))
    for count, boy in ((4, "k"), (10, "o")):
        for harf, alt in (("t", ALT), ("p", ALT_PAYLAS)):
            key = f"b{boy}{harf}"
            lines.append(article(key, govde=paragraphs(key, count), alt=alt + [yorum(key)]))
    lines.append(article("btarih", ust=TARIHLI_UST))
    lines.append(article("badmin", ust=ADMIN_UST))
    return lines


class ReviewTextTest(unittest.TestCase):
    def with_lines(self, lines, fn):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "girdi.jsonl"
            path.write_text("".join(line + "\n" for line in lines), encoding="utf-8")
            return fn(path, Path(tmp))

    def samples(self, lines, limit=20):
        return self.with_lines(lines, lambda path, _: review.review_samples_jsonl(path, limit))

    def record(self, lines, **kwargs):
        return self.with_lines(lines, lambda path, _: review.review_record_jsonl(path, **kwargs))

    def run_main(self, lines, *extra):
        def run(path, tmp):
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                report = review.main(["--input", str(path), *extra])
            return report, out.getvalue(), str(tmp)
        return self.with_lines(lines, run)

    def main_error(self, lines, *extra):
        def run(path, _):
            with self.assertRaises(SystemExit) as ctx, \
                    contextlib.redirect_stderr(io.StringIO()) as err, \
                    contextlib.redirect_stdout(io.StringIO()):
                review.main(["--input", str(path), *extra])
            return str(ctx.exception.code), err.getvalue()
        return self.with_lines(lines, run)

    def shown(self, report):
        return {item["no"]: item for item in report["gosterim"] if "no" in item}

    def line_of(self, out, needle):
        matches = [line for line in out.splitlines() if needle in line]
        self.assertEqual(len(matches), 1, needle)
        return matches[0]

    # --- sınır senaryoları ---

    def test_last_body_paragraph_before_bottom_heading_kept(self):
        report, out, _ = self.run_main(ortam(), "--id", kimlik("makale-yot0"))
        kayit = report["kayit"]
        self.assertEqual(kayit["sinir_guveni"], "yuksek")
        alt = kayit["alt_sinir_satiri"]
        satirlar = self.shown(report)
        self.assertEqual(satirlar[alt - 1]["kategori"], "korunacak_govde")
        self.assertEqual(satirlar[alt]["kategori"], "yuksek_guvenli_arayuz")
        self.assertTrue(satirlar[alt - 1]["metin"].startswith("SONPARAGRAF_ISARETI"))
        line = self.line_of(out, "SONPARAGRAF_ISARETI")
        self.assertIn(LABEL_GOVDE, line)
        self.assertTrue(line.strip().startswith(str(alt - 1)))
        self.assertIn(f"{alt} {LABEL_ARAYUZ} Tweetle", out)
        self.assertIn(f"önerilen gövde aralığı: satır 4–{alt - 1}", out)

    def test_long_bibliography_before_interface_kept(self):
        govde = paragraphs("kaynak", 6) + ["Kaynakça", *KAYNAKLAR]
        lines = ortam() + [article("kaynakca", govde=govde)]
        report = self.record(lines, kayit_id=kimlik("makale-kaynakca"), baglam=5)
        kayit = report["kayit"]
        satirlar = self.shown(report)
        alt = kayit["alt_sinir_satiri"]
        for no in range(alt - 4, alt):
            self.assertEqual(satirlar[no]["kategori"], "korunacak_govde", no)
        self.assertEqual(satirlar[alt - 4]["metin"], "Kaynakça")
        self.assertEqual(kayit["kategoriler"]["korunacak_govde"]["satir"], 1 + 6 + 4)

    def test_bibliography_after_heading_never_high_confidence(self):
        alt = ["Tweetle", "Kaynakça", *KAYNAKLAR[:2], "BENZER KONULAR", "BİR YORUM YAZIN"]
        lines = ortam() + [article("kaynakalt", alt=alt)]
        report = self.record(lines, kayit_id=kimlik("makale-kaynakalt"), baglam=6)
        kayit = report["kayit"]
        self.assertEqual(kayit["sinir_guveni"], "belirsiz")
        self.assertIn("alt_blokta_korunan_satir", kayit["riskler"])
        for item in self.shown(report).values():
            if item["metin"] == "Kaynakça" or item["metin"].startswith("Sentetik kaynak"):
                self.assertNotEqual(item["kategori"], "yuksek_guvenli_arayuz")
                self.assertEqual(item["kategori"], "belirsiz_insan_incelemesi")

    def test_comment_lines_uncertain_and_labelled(self):
        report, out, _ = self.run_main(ortam(), "--id", kimlik("makale-bkt"))
        self.assertEqual(report["kayit"]["sinir_guveni"], "belirsiz")
        self.assertIn("alt_blokta_uzun_satir", report["kayit"]["riskler"])
        alt = report["kayit"]["alt_sinir_satiri"]
        for no, item in self.shown(report).items():
            if no >= alt:
                self.assertEqual(item["kategori"], "belirsiz_insan_incelemesi")
        self.assertIn(LABEL_BELIRSIZ, self.line_of(out, "Okuyucu yorumu bkt"))
        self.assertIn(f"{alt} {LABEL_BELIRSIZ} Tweetle", out)

    def test_uncertain_top_with_date(self):
        report, out, _ = self.run_main(ortam(), "--id", kimlik("makale-btarih"))
        kayit = report["kayit"]
        self.assertEqual(kayit["sinir_guveni"], "belirsiz")
        self.assertIn("ust_blokta_korunan_satir", kayit["riskler"])
        self.assertEqual(kayit["ust_sinir_satiri"], 4)
        satirlar = self.shown(report)
        for no in range(1, 5):
            self.assertEqual(satirlar[no]["kategori"], "belirsiz_insan_incelemesi", no)
        self.assertEqual(satirlar[5]["kategori"], "korunacak_govde")
        self.assertIn(LABEL_BELIRSIZ, self.line_of(out, "18 Mart 1915"))

    def test_uncertain_top_with_admin_interruption(self):
        report = self.record(ortam(), kayit_id=kimlik("makale-badmin"))
        kayit = report["kayit"]
        self.assertEqual(kayit["sinir_guveni"], "belirsiz")
        self.assertEqual(kayit["riskler"], ["ust_blok_kesintili"])
        satirlar = self.shown(report)
        self.assertEqual(satirlar[1]["kategori"], "yuksek_guvenli_arayuz")
        for no in (2, 3, 4):
            self.assertEqual(satirlar[no]["kategori"], "belirsiz_insan_incelemesi", no)
        alt = kayit["alt_sinir_satiri"]
        self.assertEqual(satirlar[alt]["kategori"], "yuksek_guvenli_arayuz")

    # --- clean_text_preview_jsonl ile eşitlik ---

    def test_results_match_clean_text_preview(self):
        extra = [
            article("kaynakca", govde=paragraphs("kaynak", 6) + ["Kaynakça", *KAYNAKLAR]),
            article("duz", ust=[], alt=[]),
            page("makale-kisa", "Kısa", text="\n".join([*UST, "Kısa", *ALT])),
            page("makale-bos", "Boş metin"),
            article(
                "ikibolge",
                govde=paragraphs("ikibolge", 8),
                alt=["SONRAKİ KONU", "Kısa sonraki yazı başlığı", "İkinci kısa yazı başlığı", *ALT],
            ),
        ]
        lines = ortam() + extra

        def check(path, _):
            cln = clean.clean_text_preview_jsonl(path, limit=1000)
            rev = review.review_samples_jsonl(path, limit=1000)
            self.assertEqual(rev["makale"]["guven"], cln["makale"]["guven"])
            self.assertEqual(rev["sablon"], cln["sablon"])
            self.assertEqual(len(rev["ornekler"]), len(cln["makale"]["ornekler"]))
            bekl = {o["url"]: o for o in cln["makale"]["ornekler"]}
            for ornek in rev["ornekler"]:
                hedef = bekl[ornek["url"]]
                for key in ("sinir_guveni", "ust_sinir_satiri", "alt_sinir_satiri",
                            "kategoriler", "riskler", "toplam_satir", "toplam_karakter",
                            "metin_uzunlugu", "oneri", "satir_kategorileri", "bolgeler",
                            "ust_neden", "alt_on_bolge"):
                    self.assertEqual(ornek[key], hedef[key], (ornek["url"], key))
                tek = review.review_record_jsonl(path, url=ornek["url"], baglam=10)
                self.assertEqual(tek["kayit"]["kategoriler"], hedef["kategoriler"])
                self.assertEqual(tek["kayit"]["sinir_guveni"], hedef["sinir_guveni"])
                self.assertEqual(tek["kayit"]["satir_kategorileri"], hedef["satir_kategorileri"])
                for no, item in self.shown(tek).items():
                    self.assertEqual(item["kategori"], hedef["satir_kategorileri"][no - 1], no)
            return cln

        cln = self.with_lines(lines, check)
        self.assertGreater(cln["makale"]["guven"]["yuksek"], 0)
        self.assertGreater(cln["makale"]["guven"]["belirsiz"], 0)
        self.assertGreater(cln["makale"]["guven"]["sinir_bulunamadi"], 0)

    def test_bottom_uncertainty_risks_known_to_clean(self):
        self.assertTrue(review._ALT_BELIRSIZLIK <= set(clean.RISKLER))

    # --- dengeli örnekleme ---

    def test_equal_share_and_odd_limit(self):
        even = self.samples(ortam(), limit=6)
        self.assertEqual(even["secim"]["gruplar"]["yuksek"]["secilen"], 3)
        self.assertEqual(even["secim"]["gruplar"]["belirsiz"]["secilen"], 3)
        odd = self.samples(ortam(), limit=7)
        self.assertEqual(odd["secim"]["gruplar"]["belirsiz"]["secilen"], 4)
        self.assertEqual(odd["secim"]["gruplar"]["yuksek"]["secilen"], 3)
        self.assertEqual([o["sira"] for o in odd["ornekler"]], list(range(1, 8)))

    def test_short_group_passes_share(self):
        cikar = ("makale-bo", "makale-btarih", "makale-badmin")
        lines = [l for l in ortam() if not any(c in l for c in cikar)]
        report = self.samples(lines, limit=8)
        gruplar = report["secim"]["gruplar"]
        self.assertEqual(gruplar["belirsiz"]["toplam"], 2)
        self.assertEqual(gruplar["belirsiz"]["secilen"], 2)
        self.assertEqual(gruplar["yuksek"]["secilen"], 6)
        self.assertEqual(len(report["ornekler"]), 8)

    def test_no_boundary_group_represented(self):
        lines = ortam() + [article("duz", ust=[], alt=[])]
        report = self.samples(lines, limit=6)
        gruplar = report["secim"]["gruplar"]
        self.assertEqual(gruplar["sinir_bulunamadi"]["secilen"], 1)
        self.assertEqual(gruplar["belirsiz"]["secilen"], 3)
        self.assertEqual(gruplar["yuksek"]["secilen"], 2)

    def test_share_allocation(self):
        self.assertEqual(review._paylar({"belirsiz": 10, "yuksek": 10, "sinir_bulunamadi": 0}, 7),
                         {"belirsiz": 4, "yuksek": 3, "sinir_bulunamadi": 0})
        self.assertEqual(review._paylar({"belirsiz": 69, "yuksek": 200, "sinir_bulunamadi": 0}, 20),
                         {"belirsiz": 10, "yuksek": 10, "sinir_bulunamadi": 0})
        self.assertEqual(review._paylar({"belirsiz": 2, "yuksek": 10, "sinir_bulunamadi": 0}, 8),
                         {"belirsiz": 2, "yuksek": 6, "sinir_bulunamadi": 0})
        self.assertEqual(review._paylar({"belirsiz": 5, "yuksek": 5, "sinir_bulunamadi": 1}, 6),
                         {"belirsiz": 3, "yuksek": 2, "sinir_bulunamadi": 1})
        self.assertEqual(review._paylar({"belirsiz": 1, "yuksek": 2, "sinir_bulunamadi": 0}, 20),
                         {"belirsiz": 1, "yuksek": 2, "sinir_bulunamadi": 0})

    def test_strata_diversity(self):
        report = self.samples(ortam(), limit=12)
        yuksek = report["secim"]["gruplar"]["yuksek"]
        self.assertEqual(yuksek["secilen"], 6)
        for boy in review.UZUNLUK_SINIFLARI:
            self.assertGreater(yuksek["uzunluk"][boy]["secilen"], 0, boy)
        self.assertGreater(yuksek["basliklar"]["Tweetle"]["secilen"], 0)
        self.assertGreater(yuksek["basliklar"]["Paylaş"]["secilen"], 0)
        belirsiz = [o for o in report["ornekler"] if o["sinir_guveni"] == "belirsiz"]
        self.assertGreaterEqual(len({tuple(o["riskler"]) for o in belirsiz}), 3)
        self.assertGreaterEqual(len({review._uzunluk_sinifi(o) for o in belirsiz}), 2)
        first = [review._uzunluk_sinifi(o) for o in report["ornekler"][6:9]]
        self.assertEqual(first, list(review.UZUNLUK_SINIFLARI))

    def test_reproducible_and_order_independent(self):
        lines = ortam()
        a = self.samples(lines, limit=9)
        b = self.samples(lines, limit=9)
        shuffled = lines[::-1]
        shuffled = shuffled[7:] + shuffled[:7]
        c = self.samples(shuffled, limit=9)
        ids = [o["kimlik"] for o in a["ornekler"]]
        self.assertEqual(ids, [o["kimlik"] for o in b["ornekler"]])
        self.assertEqual(ids, [o["kimlik"] for o in c["ornekler"]])
        self.assertEqual(a["secim"], c["secim"])
        _, out1, _ = self.run_main(lines, "--limit", "9")
        _, out2, _ = self.run_main(shuffled, "--limit", "9")
        self.assertEqual(out1, out2)

    def test_limit_cuts_samples_not_totals(self):
        full = self.samples(ortam(), limit=50)
        cut = self.samples(ortam(), limit=2)
        self.assertEqual(len(full["ornekler"]), 18)
        self.assertEqual(len(cut["ornekler"]), 2)
        self.assertEqual(full["makale"], cut["makale"])
        self.assertEqual(full["sablon"], cut["sablon"])
        for grup in review.GRUP_SIRASI:
            for alan in ("uzunluk", "basliklar", "riskler"):
                toplam = {k: v["toplam"] for k, v in full["secim"]["gruplar"][grup][alan].items()}
                kesik = {k: v["toplam"] for k, v in cut["secim"]["gruplar"][grup][alan].items()}
                self.assertEqual(toplam, kesik, (grup, alan))
            self.assertEqual(full["secim"]["gruplar"][grup]["toplam"],
                             cut["secim"]["gruplar"][grup]["toplam"])

    def test_sample_report_fields_and_method(self):
        report, out, _ = self.run_main(ortam(), "--limit", "4")
        ornek = report["ornekler"][0]
        for key in ("sira", "kimlik", "url", "baslik", "toplam_satir", "toplam_karakter",
                    "ust_sinir_satiri", "alt_sinir_satiri", "alt_sinir_basligi",
                    "sinir_guveni", "riskler", "kategoriler"):
            self.assertIn(key, ornek)
        self.assertRegex(ornek["kimlik"], r"^CC-[0-9a-f]{12}$")
        self.assertIn("Seçim yöntemi:", out)
        self.assertIn("sha256", out)
        self.assertIn("belirsiz: toplam 6, seçilen 2", out)
        self.assertIn("yuksek: toplam 12, seçilen 2", out)
        self.assertIn("alt sınır başlığı:", out)
        self.assertIn("önerilen gövde aralığı: satır 4–", out)
        self.assertEqual(out.splitlines()[0], review.ORNEK_NOTU)

    def test_default_mode_prints_no_body(self):
        report, out, _ = self.run_main(ortam(), "--limit", "50")
        self.assertIn(kimlik("makale-yut0"), out)
        self.assertNotIn("GIZLIGOVDE", out)
        self.assertNotIn("SONPARAGRAF", out)
        self.assertNotIn("Kıyıdaki tabyalar", out)
        self.assertNotIn("Okuyucu yorumu", out)
        self.assertNotIn("GIZLIGOVDE", repr(report))
        self.assertNotIn("Kıyıdaki tabyalar", repr(report))

    def test_command_hint_has_no_absolute_path(self):
        report, out, tmp = self.run_main(ortam(), "--limit", "5")
        hints = [l.strip() for l in out.splitlines() if "incelemek için:" in l]
        self.assertEqual(len(hints), 5)
        for hint, ornek in zip(hints, report["ornekler"]):
            self.assertEqual(
                hint,
                f"incelemek için: python review_canakkale_text.py --input <dosya> --id {ornek['kimlik']}",
            )
            self.assertIsNone(re.search(r"[A-Za-z]:[\\/]|(^|\s)/[^\s]", hint.split(": ", 1)[1]))
        self.assertNotIn(tmp, out)
        self.assertNotIn("girdi.jsonl", out)

    # --- tek kayıt görüntüleme ---

    def test_record_shows_only_windows(self):
        report, out, _ = self.run_main(ortam(), "--id", kimlik("makale-yut0"))
        kayit = report["kayit"]
        self.assertEqual(kayit["toplam_satir"], 33)
        self.assertEqual((kayit["ust_sinir_satiri"], kayit["alt_sinir_satiri"]), (3, 30))
        self.assertEqual(report["pencereler"], [(1, 6), (27, 33)])
        self.assertEqual(report["gosterilen_satir"], 13)
        self.assertEqual(report["gosterilmeyen_satir"], 20)
        self.assertNotIn("GIZLIGOVDE", out)
        self.assertNotIn("GIZLIGOVDE", repr(report))
        self.assertIn("… (20 satır gösterilmedi)", out)
        numbered = [l for l in out.splitlines() if re.match(r"^\s+\d+ \[", l)]
        self.assertEqual(len(numbered), 13)
        self.assertEqual(out.splitlines()[0], review.KAYIT_NOTU)
        for soru in ("Üst sınırdan sonra gerçek makale başlıyor mu?",
                     "Alt sınırdan önce kaynakça ya da son paragraf kesilmiş mi?",
                     "Belirsiz satırlar yorum mu, arayüz mü, içerik mi?"):
            self.assertIn(soru, out)

    def test_context_limit(self):
        report = self.record(ortam(), kayit_id=kimlik("makale-yut0"), baglam=10)
        self.assertEqual(report["pencereler"], [(1, 13), (20, 33)])
        self.assertNotIn("GIZLIGOVDE", repr(report))
        for value in (11, 0, True, "3"):
            with self.assertRaises(ValueError):
                self.record(ortam(), kayit_id=kimlik("makale-yut0"), baglam=value)
        hedef = kimlik("makale-yut0")
        for value in ("11", "0", "iki"):
            code, err = self.main_error(ortam(), "--id", hedef, "--baglam", value)
            self.assertIn("baglam", err)
        code, err = self.main_error(ortam(), "--baglam", "3")
        self.assertIn("--baglam yalnızca --url ya da --id", err)
        code, err = self.main_error(ortam(), "--id", hedef, "--limit", "3")
        self.assertIn("--limit yalnızca örnekleme", err)

    def test_window_merge(self):
        self.assertEqual(review._pencereler(14, 3, 11, 3), [(1, 6), (8, 14)])
        self.assertEqual(review._pencereler(14, 3, 10, 3), [(1, 14)])
        self.assertEqual(review._pencereler(40, None, None, 3), [(1, 3), (38, 40)])
        self.assertEqual(review._pencereler(2, None, None, 3), [(1, 2)])
        self.assertEqual(review._pencereler(0, None, None, 3), [])

    def test_select_by_url_and_id(self):
        hedef = url("makale-yot0")
        a = self.record(ortam(), url=hedef)
        b = self.record(ortam(), kayit_id=kimlik("makale-yot0"))
        self.assertEqual(a["kayit"], b["kayit"])
        self.assertEqual(a["kayit"]["url"], hedef)
        report, out, _ = self.run_main(ortam(), "--url", "  " + hedef + " ")
        self.assertEqual(report["kayit"]["kimlik"], kimlik("makale-yot0"))

    def test_url_and_id_together_error(self):
        with self.assertRaises(ValueError):
            self.record(ortam(), url=url("makale-yot0"), kayit_id=kimlik("makale-yot0"))
        code, err = self.main_error(
            ortam(), "--url", url("makale-yot0"), "--id", kimlik("makale-yot0")
        )
        self.assertIn("--url ve --id birlikte verilemez", err)
        with self.assertRaises(ValueError):
            self.record(ortam())

    def test_record_not_found_and_bad_id(self):
        code, _ = self.main_error(ortam(), "--id", "CC-000000000000")
        self.assertIn("Kayıt bulunamadı: id=CC-000000000000", code)
        code, _ = self.main_error(ortam(), "--url", url("yok-boyle-sayfa"))
        self.assertIn("Kayıt bulunamadı", code)
        code, _ = self.main_error(ortam(), "--id", "CC-XYZ")
        self.assertIn("--id CC-", code)

    def test_record_not_article(self):
        lines = ortam() + [page("category/deniz/", "Deniz Arşivi", text="\n".join(UST + ALT))]
        code, _ = self.main_error(lines, "--url", url("category/deniz/"))
        self.assertIn("olasi_makale değil", code)

    def test_email_masked_and_long_line_truncated(self):
        uzun = "Uzun satır başı " + "x" * 300 + " KUYRUKISARETI"
        govde = [f"İletişim için {EMAIL} adresine ya da {NUMARA} numarasına yazılabilir.", uzun]
        govde += paragraphs("eposta", 5)
        report, out, _ = self.run_main(ortam() + [article("eposta", govde=govde)],
                                       "--id", kimlik("makale-eposta"))
        self.assertNotIn(EMAIL, out)
        self.assertNotIn("@", out)
        self.assertNotIn(NUMARA, out)
        self.assertIn("[e-posta gizlendi]", out)
        self.assertIn("[numara gizlendi]", out)
        self.assertNotIn("KUYRUKISARETI", out)
        satir = self.shown(report)[6]["metin"]
        self.assertTrue(satir.startswith("Uzun satır başı "))
        kalan = len(uzun) - review.SATIR_GOSTERIM_UZUNLUGU
        self.assertTrue(satir.endswith(f"… (+{kalan} karakter)"))
        self.assertEqual(len(satir), review.SATIR_GOSTERIM_UZUNLUGU + len(f"… (+{kalan} karakter)"))

    # --- hata durumları ---

    def test_missing_file(self):
        missing = Path(tempfile.gettempdir()) / "yok_boyle_bir_dosya_review_text.jsonl"
        with self.assertRaises(FileNotFoundError):
            review.review_samples_jsonl(missing)
        with self.assertRaises(FileNotFoundError):
            review.review_record_jsonl(missing, kayit_id="CC-000000000000")
        for extra in ([], ["--id", "CC-000000000000"]):
            with self.assertRaises(SystemExit) as ctx:
                review.main(["--input", str(missing), *extra])
            self.assertIn("Girdi dosyası bulunamadı", str(ctx.exception))

    def test_empty_file(self):
        report, out, _ = self.run_main([])
        self.assertTrue(report["bos_dosya"])
        self.assertEqual(report["ornekler"], [])
        self.assertIn("girdi dosyası boş", out)
        self.assertIn("örnek yok", out)
        code, _ = self.main_error([], "--id", "CC-000000000000")
        self.assertIn("girdi dosyası boş", code)

    def test_broken_json_reported(self):
        lines = ["{bozuk", *ortam(), "[1, 2]"]
        report, out, _ = self.run_main(lines)
        self.assertEqual(report["atlanan"]["bozuk_json"], 1)
        self.assertEqual(report["atlanan"]["gecersiz_veya_eksik_url"], 1)
        self.assertEqual(report["hatalar"], ["satır 1: bozuk_json"])
        self.assertIn("satır 1: bozuk_json", out)
        self.assertEqual(report["makale"]["sayi"], 18)
        report, out, _ = self.run_main(lines, "--id", kimlik("makale-yot0"))
        self.assertIn("satır 1: bozuk_json", out)

    # --- salt okunurluk ---

    def test_no_new_file_and_input_hash_unchanged(self):
        def run(path, tmp):
            before = sorted(os.listdir(tmp))
            cwd_before = sorted(os.listdir(os.getcwd()))
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            with contextlib.redirect_stdout(io.StringIO()):
                review.main(["--input", str(path)])
                review.main(["--input", str(path), "--id", kimlik("makale-yut0"), "--baglam", "10"])
            self.assertEqual(sorted(os.listdir(tmp)), before)
            self.assertEqual(sorted(os.listdir(os.getcwd())), cwd_before)
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), digest)

        self.with_lines(ortam(), run)

    def test_file_opened_read_only_utf8_twice(self):
        real_open = builtins.open
        calls = []

        def spy(*args, **kwargs):
            calls.append((args[1:], kwargs))
            return real_open(*args, **kwargs)

        with mock.patch.object(review, "open", spy, create=True):
            self.samples(ortam())
            self.record(ortam(), kayit_id=kimlik("makale-yut0"))
        self.assertEqual(calls, [(("r",), {"encoding": "utf-8"})] * 4)

    def test_change_between_passes_warns(self):
        def run(path, tmp):
            other = tmp / "degisik.jsonl"
            other.write_text("".join(l + "\n" for l in ortam()[:-1]), encoding="utf-8")
            real_open = builtins.open
            paths = iter([path, other])

            def swap(_source, *args, **kwargs):
                return real_open(next(paths), *args, **kwargs)

            out = io.StringIO()
            with mock.patch.object(review, "open", swap, create=True), \
                    contextlib.redirect_stdout(out):
                report = review.main(["--input", str(path)])
            return report, out.getvalue()

        report, out = self.with_lines(ortam(), run)
        self.assertTrue(report["okuma"]["dosya_degisti"])
        self.assertIn(review.DEGISIM_UYARISI, out)

    def test_cli_has_no_write_or_approve_option(self):
        out = io.StringIO()
        with self.assertRaises(SystemExit), contextlib.redirect_stdout(out):
            review.main(["--help"])
        text = out.getvalue()
        for option in ("--input", "--limit", "--url", "--id", "--baglam"):
            self.assertIn(option, text)
        for option in ("--output", "--write", "--approve", "--apply"):
            self.assertNotIn(option, text)
            self.main_error(ortam(), option, "x")

    def test_no_verified_status(self):
        report, out, _ = self.run_main(ortam(), "--limit", "50")
        self.assertNotIn("iddia_dogrulandi", out)
        self.assertNotIn("iddia_dogrulandi", repr(report))
        report, out, _ = self.run_main(ortam(), "--id", kimlik("makale-btarih"), "--baglam", "10")
        self.assertNotIn("iddia_dogrulandi", out)
        self.assertNotIn("iddia_dogrulandi", repr(report))
        self.assertIn("insan_incelemesi_gerekli", out)

    # --- Aşama 5.5: etiket uyumu, iki bölgeli alt ---

    def test_breadcrumb_after_title_labels_keep_title(self):
        lines = ortam() + [
            article("gercekkonum", ust=[], govde=["Anasayfa", "»"] + paragraphs("gercekkonum")),
        ]
        report, out, _ = self.run_main(lines, "--id", kimlik("makale-gercekkonum"), "--baglam", "5")
        kayit = report["kayit"]
        cats = kayit["satir_kategorileri"]
        self.assertEqual(cats[0], "korunacak_govde")
        self.assertEqual(cats[1:3], ["yuksek_guvenli_arayuz", "yuksek_guvenli_arayuz"])
        satirlar = self.shown(report)
        self.assertEqual(satirlar[1]["kategori"], "korunacak_govde")
        self.assertIn(f"1 {LABEL_GOVDE} Yazı gercekkonum", out)
        self.assertIn(f"2 {LABEL_ARAYUZ} Anasayfa", out)
        self.assertIn(f"3 {LABEL_ARAYUZ} »", out)
        self.assertEqual(kayit["alt_sinir_basligi"], "Tweetle")
        self.assertIn("satır 1, 4–", out)

    def test_two_region_bottom_record_uncertain_tweetle_high(self):
        alt = ["SONRAKİ KONU", "Kısa sonraki yazı başlığı", "İkinci kısa yazı başlığı", *ALT]
        lines = ortam() + [article("ikibolge", govde=paragraphs("ikibolge", 8), alt=alt)]
        report, out, _ = self.run_main(lines, "--id", kimlik("makale-ikibolge"), "--baglam", "8")
        kayit = report["kayit"]
        self.assertEqual(kayit["sinir_guveni"], "belirsiz")
        self.assertEqual(kayit["alt_sinir_basligi"], "Tweetle")
        self.assertEqual(kayit["alt_on_bolge"], ["sonraki_konu"])
        alt_no = kayit["alt_sinir_satiri"]
        satirlar = self.shown(report)
        self.assertEqual(satirlar[alt_no - 3]["kategori"], "belirsiz_insan_incelemesi")
        self.assertEqual(satirlar[alt_no - 3]["metin"], "SONRAKİ KONU")
        self.assertEqual(satirlar[alt_no]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[alt_no]["metin"], "Tweetle")
        self.assertIn(f"{alt_no - 3} {LABEL_BELIRSIZ} SONRAKİ KONU", out)
        self.assertIn(f"{alt_no} {LABEL_ARAYUZ} Tweetle", out)
        self.assertIn("sinir_guveni: belirsiz", out)

    def test_previous_topic_labels_symmetric(self):
        alt = ["ÖNCEKİ KONU", "Kısa önceki yazı başlığı", "Diğer kısa yazı başlığı", *ALT]
        lines = ortam() + [article("oncekibolge", govde=paragraphs("oncekibolge", 8), alt=alt)]
        report = self.record(lines, kayit_id=kimlik("makale-oncekibolge"), baglam=8)
        kayit = report["kayit"]
        alt_no = kayit["alt_sinir_satiri"]
        satirlar = self.shown(report)
        self.assertEqual(kayit["sinir_guveni"], "belirsiz")
        self.assertEqual(kayit["alt_on_bolge"], ["onceki_konu"])
        self.assertEqual(satirlar[alt_no - 3]["kategori"], "belirsiz_insan_incelemesi")
        self.assertEqual(satirlar[alt_no]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(kayit["alt_sinir_basligi"], "Tweetle")

    def test_date_counters_high_labels_when_form_high(self):
        alt = ["26.12.2022", "0", "807", "BİR YORUM YAZIN", "Henüz yorum yapılmamış."]
        lines = ortam() + [article("yayinyuksek", alt=alt)]
        report, out, _ = self.run_main(lines, "--id", kimlik("makale-yayinyuksek"), "--baglam", "6")
        kayit = report["kayit"]
        alt_no = kayit["alt_sinir_satiri"]
        satirlar = self.shown(report)
        self.assertEqual(kayit["sinir_guveni"], "yuksek")
        self.assertEqual(kayit["alt_sinir_basligi"], "BİR YORUM YAZIN")
        self.assertEqual(kayit["alt_on_bolge"], ["yayin_sayac"])
        self.assertEqual(satirlar[alt_no - 3]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[alt_no - 3]["metin"], "26.12.2022")
        self.assertEqual(satirlar[alt_no]["kategori"], "yuksek_guvenli_arayuz")
        self.assertIn(f"{alt_no - 3} {LABEL_ARAYUZ} 26.12.2022", out)

    def test_date_counters_uncertain_when_comments_long_no_upgrade(self):
        alt = ["26.12.2022", "0", "807", "BİR YORUM YAZIN", "Henüz yorum yapılmamış.", yorum("uzun")]
        lines = ortam() + [article("yayinbelirsiz", alt=alt)]
        report = self.record(lines, kayit_id=kimlik("makale-yayinbelirsiz"), baglam=6)
        kayit = report["kayit"]
        alt_no = kayit["alt_sinir_satiri"]
        satirlar = self.shown(report)
        self.assertEqual(kayit["sinir_guveni"], "belirsiz")
        self.assertEqual(satirlar[alt_no - 3]["kategori"], "belirsiz_insan_incelemesi")
        self.assertEqual(satirlar[alt_no]["kategori"], "belirsiz_insan_incelemesi")
        self.assertEqual(self.kat_review(kayit, "yuksek_guvenli_arayuz"), 3)

    def kat_review(self, kayit, ad):
        return kayit["kategoriler"][ad]["satir"]

    def test_second_chevron_labels_keep_titles(self):
        title = "Yazı ikinciok"
        govde = ["Anasayfa", "»", "Birlikler", "»", title, *paragraphs("ikinciok")]
        alt = ["26.12.2022", "0", "807", "BİR YORUM YAZIN", "Henüz yorum yapılmamış."]
        lines = ortam() + [article("ikinciok", ust=[], govde=govde, alt=alt, title=title)]
        report, out, _ = self.run_main(lines, "--id", kimlik("makale-ikinciok"), "--baglam", "6")
        kayit = report["kayit"]
        cats = kayit["satir_kategorileri"]
        satirlar = self.shown(report)
        self.assertEqual(cats[0], "korunacak_govde")
        self.assertEqual(cats[1:5], ["yuksek_guvenli_arayuz"] * 4)
        self.assertEqual(cats[5], "korunacak_govde")
        self.assertEqual(satirlar[1]["kategori"], "korunacak_govde")
        self.assertEqual(satirlar[2]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[4]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[5]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[6]["kategori"], "korunacak_govde")
        self.assertIn(f"1 {LABEL_GOVDE} {title}", out)
        self.assertIn(f"2 {LABEL_ARAYUZ} Anasayfa", out)
        self.assertIn(f"4 {LABEL_ARAYUZ} Birlikler", out)
        self.assertIn(f"5 {LABEL_ARAYUZ} »", out)
        self.assertIn(f"6 {LABEL_GOVDE} {title}", out)
        for bas, son, ad in kayit["bolgeler"]:
            for no in range(bas, son + 1):
                if no in satirlar:
                    self.assertEqual(satirlar[no]["kategori"], ad, no)

    def test_long_next_topic_labels_uncertain_not_high(self):
        komsu = (
            "Çanakkale ihracat ve ikmal hatları üzerine yazılmış çok uzun bir sonraki yazı başlığı"
        )
        alt = ["SONRAKİ KONU", komsu, *ALT]
        lines = ortam() + [article("uzunsonraki", govde=paragraphs("uzunsonraki", 8), alt=alt)]
        report, out, _ = self.run_main(lines, "--id", kimlik("makale-uzunsonraki"), "--baglam", "8")
        kayit = report["kayit"]
        alt_no = kayit["alt_sinir_satiri"]
        satirlar = self.shown(report)
        self.assertEqual(kayit["sinir_guveni"], "belirsiz")
        self.assertEqual(kayit["alt_on_bolge"], ["sonraki_konu"])
        self.assertEqual(satirlar[alt_no - 2]["kategori"], "belirsiz_insan_incelemesi")
        self.assertEqual(satirlar[alt_no - 2]["metin"], "SONRAKİ KONU")
        self.assertEqual(satirlar[alt_no - 1]["kategori"], "belirsiz_insan_incelemesi")
        self.assertNotEqual(satirlar[alt_no - 1]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[alt_no]["kategori"], "yuksek_guvenli_arayuz")
        self.assertIn(f"{alt_no - 2} {LABEL_BELIRSIZ} SONRAKİ KONU", out)
        self.assertIn(f"{alt_no} {LABEL_ARAYUZ} Tweetle", out)
        for bas, son, ad in kayit["bolgeler"]:
            for no in range(bas, son + 1):
                if no in satirlar:
                    self.assertEqual(satirlar[no]["kategori"], ad, no)

    def test_ocak_neighbor_label_not_high(self):
        komsu = "9 Ocak 1916 Çanakkale Zaferi Kutlandı"
        govde = paragraphs("ocaknav", 8) + ["9. Topçu Alayı"]
        alt = ["SONRAKİ KONU", komsu, *ALT]
        lines = ortam() + [article("ocaknav", govde=govde, alt=alt)]
        report = self.record(lines, kayit_id=kimlik("makale-ocaknav"), baglam=8)
        kayit = report["kayit"]
        satirlar = self.shown(report)
        alt_no = kayit["alt_sinir_satiri"]
        self.assertEqual(kayit["sinir_guveni"], "belirsiz")
        self.assertEqual(satirlar[alt_no - 1]["metin"], komsu)
        self.assertEqual(satirlar[alt_no - 1]["kategori"], "belirsiz_insan_incelemesi")
        self.assertNotEqual(satirlar[alt_no - 1]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[alt_no]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[alt_no - 3]["metin"], "9. Topçu Alayı")
        self.assertEqual(satirlar[alt_no - 3]["kategori"], "korunacak_govde")

    def test_previous_topic_long_neighbor_labels(self):
        komsu = (
            "Çanakkale ihracat ve ikmal hatları üzerine yazılmış çok uzun bir sonraki yazı başlığı"
        )
        alt = ["ÖNCEKİ KONU", komsu, *ALT]
        lines = ortam() + [article("uzunonceki", govde=paragraphs("uzunonceki", 8), alt=alt)]
        report = self.record(lines, kayit_id=kimlik("makale-uzunonceki"), baglam=8)
        kayit = report["kayit"]
        satirlar = self.shown(report)
        alt_no = kayit["alt_sinir_satiri"]
        self.assertEqual(kayit["sinir_guveni"], "belirsiz")
        self.assertEqual(kayit["alt_on_bolge"], ["onceki_konu"])
        self.assertEqual(satirlar[alt_no - 2]["kategori"], "belirsiz_insan_incelemesi")
        self.assertEqual(satirlar[alt_no - 1]["kategori"], "belirsiz_insan_incelemesi")
        self.assertEqual(satirlar[alt_no]["kategori"], "yuksek_guvenli_arayuz")

    def test_line_labels_require_bolgeler_match(self):
        kayit = {
            "toplam_satir": 2,
            "satir_kategorileri": ["korunacak_govde", "yuksek_guvenli_arayuz"],
            "kategoriler": {
                "yuksek_guvenli_arayuz": {"satir": 1, "karakter": 1},
                "belirsiz_insan_incelemesi": {"satir": 0, "karakter": 0},
                "korunacak_govde": {"satir": 1, "karakter": 4},
            },
            "bolgeler": [(1, 1, "korunacak_govde"), (2, 2, "belirsiz_insan_incelemesi")],
        }
        with self.assertRaises(RuntimeError):
            review._satir_kategorileri(kayit, ["govde", "x"])

    # --- Aşama 5.5.2: açık bölgelerden kırıntı etiketi ---

    def kirinti_siklik_satirlari(self):
        lines = [
            article(f"birlik{i}", ust=["Anasayfa", "»", "Birlikler", "»"])
            for i in range(10)
        ]
        lines += [
            article(f"kut{i}", ust=["Anasayfa", "»", "Kütüphane", "»"])
            for i in range(3)
        ]
        lines.append(article("manset", ust=["Anasayfa", "»", "Manşet", "»"]))
        lines.append(article("makaleler", ust=["Anasayfa", "»", "Makaleler", "»"]))
        return lines

    def assert_shown_matches_bolgeler(self, kayit, satirlar):
        for bas, son, ad in kayit["bolgeler"]:
            for no in range(bas, son + 1):
                if no in satirlar:
                    self.assertEqual(satirlar[no]["kategori"], ad, no)

    def test_mid_rate_crumb_labels_come_from_bolgeler(self):
        kuye = (
            "Yazar Adı, Çanakkale üzerine uzun bir kaynak künyesi, yayınevi, yer ve sayfa "
            "bilgisi burada tek satırda durur ve gövde olarak korunmalıdır."
        )
        lines = self.kirinti_siklik_satirlari()
        lines[10] = article(
            "kut0",
            ust=["Anasayfa", "»", "Kütüphane", "»"],
            govde=paragraphs("kut0", 6) + ["Kaynakça", kuye, "18 Mart 1915"],
        )
        report, out, _ = self.run_main(lines, "--id", kimlik("makale-kut0"), "--baglam", "8")
        kayit = report["kayit"]
        cats = kayit["satir_kategorileri"]
        satirlar = self.shown(report)
        self.assertEqual(kayit["ust_neden"], "breadcrumb")
        self.assertEqual(cats[:4], ["yuksek_guvenli_arayuz"] * 4)
        self.assertEqual(cats[4], "korunacak_govde")
        self.assertEqual(satirlar[1]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[3]["kategori"], "yuksek_guvenli_arayuz")
        self.assertEqual(satirlar[3]["metin"], "Kütüphane")
        self.assertEqual(satirlar[5]["kategori"], "korunacak_govde")
        self.assertIn(f"1 {LABEL_ARAYUZ} Anasayfa", out)
        self.assertIn(f"3 {LABEL_ARAYUZ} Kütüphane", out)
        self.assertIn(f"5 {LABEL_GOVDE} Yazı kut0", out)
        kaynak_i = 5 + 6
        self.assertEqual(cats[kaynak_i], "korunacak_govde")
        self.assertEqual(cats[kaynak_i + 1], "korunacak_govde")
        self.assertEqual(cats[kaynak_i + 2], "korunacak_govde")
        self.assertNotEqual(cats[kaynak_i], "yuksek_guvenli_arayuz")
        self.assertEqual(kayit["sinir_guveni"], "yuksek")
        self.assert_shown_matches_bolgeler(kayit, satirlar)

    def test_crumb_labels_same_high_for_all_four_categories(self):
        lines = self.kirinti_siklik_satirlari()
        for key, etiket in (
            ("birlik0", "Birlikler"),
            ("kut0", "Kütüphane"),
            ("manset", "Manşet"),
            ("makaleler", "Makaleler"),
        ):
            report = self.record(lines, kayit_id=kimlik(f"makale-{key}"), baglam=5)
            kayit = report["kayit"]
            satirlar = self.shown(report)
            self.assertEqual(kayit["ust_neden"], "breadcrumb", etiket)
            self.assertEqual(kayit["satir_kategorileri"][:4], ["yuksek_guvenli_arayuz"] * 4, etiket)
            self.assertEqual(kayit["satir_kategorileri"][4], "korunacak_govde", etiket)
            self.assertEqual(satirlar[3]["metin"], etiket)
            self.assertEqual(satirlar[3]["kategori"], "yuksek_guvenli_arayuz", etiket)
            self.assertEqual(satirlar[5]["kategori"], "korunacak_govde", etiket)
            self.assertEqual(kayit["sinir_guveni"], "yuksek", etiket)
            self.assert_shown_matches_bolgeler(kayit, satirlar)


if __name__ == "__main__":
    unittest.main()
