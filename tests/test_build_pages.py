# -*- coding: utf-8 -*-
import os
import json
import sys
import tempfile
import unittest
from unittest.mock import patch
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import build_pages

SHELL = """<!DOCTYPE html>
<html lang="tr"><head>
<title>TITLE · Çanakkale 1915</title>
<meta name="description" content="DESC">
<link rel="canonical" href="CANON">
</head><body><main>
BODY
</main></body></html>
"""


class BuildPagesTests(unittest.TestCase):
    def test_kronoloji_destek_etiketleri_kaynak_turunu_ve_acik_kapsami_ayirir(self):
        institution = build_pages.chronology_support_notice('kurumsal_ozet_pasaji_okundu')
        diary = build_pages.chronology_support_notice('gunluk_goruntusu_ilgili_pasaj_okundu')
        photo = build_pages.chronology_support_notice('fotograf_katalog_aciklamasi_okundu')
        self.assertIn('Kurum özetine dayanan anlatı', institution)
        self.assertIn('Kesin saatler ve ayrıntılı konumlar', institution)
        self.assertIn('Günlük pasajına dayanan anlatı', diary)
        self.assertIn('Tek birliğin deneyimi', diary)
        self.assertIn('Fotoğraf katalog açıklamasına dayanan anlatı', photo)
        self.assertIn('Görüşmelerin bütün seyri', photo)
        unknown = build_pages.chronology_support_notice('iddia_dogrulandi')
        self.assertIn('Kaynak incelemesi açık', unknown)
        self.assertNotIn('iddia_dogrulandi', unknown)

    def test_beslenme_ureticisi_yayimlanmis_kanit_bolumlerini_korur(self):
        body = build_pages.PAGES['cephede-beslenme/index.html'][3]
        self.assertIn('id="fransiz-subay-kahvaltisi"', body)
        self.assertIn('HighRes_39020025956171.pdf#page=71', body)
        self.assertIn('RCDIG0000330.pdf#page=28', body)
        self.assertIn('RCDIG0000330.pdf#page=38', body)


    def test_arsiv_kayit_tarihi_yayin_tarihi_yapilmaz(self):
        body = build_pages.chronology_event_pages(ROOT)['olaylar/quinns-post-siper-baskini/index.html'][3]
        self.assertIn('Kaynağın yayımı: ayrıca doğrulanmadı', body)
        self.assertIn('Kaynağın yayımı: Kasım 2025', body)
        self.assertNotIn('Kitabın basımı:', body)
        self.assertIn('üç bağımsız tanık sayılmaz', body)
        self.assertIn('özgün emir görülmedi', body)

    def test_web_kaniti_kitap_basimi_ve_bilinmeyen_dijital_tarih_uydurmaz(self):
        body = build_pages.chronology_event_pages(ROOT)['olaylar/mayin-tarama-girisimleri/index.html'][3]
        self.assertIn('Kaynağın yayımı: ayrıca doğrulanmadı', body)
        self.assertIn('Kaynağın yayımı: 2024', body)
        self.assertIn('İlk web yayımı: ayrıca doğrulanmadı', body)
        self.assertNotIn('Kitabın basımı:', body)
        self.assertNotIn('İlk web yayımı: None', body)
        self.assertIn('Künye alanlarının kontrolü: 2026-11-02', body)

    def test_ek_anlati_metni_degisince_eski_kanit_kullanilmaz(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "data").mkdir()
            events = json.loads((ROOT / "data/chronology-events.json").read_text(encoding="utf-8"))
            event = next(row for row in events if row['id'] == 'e-mart-sessiz-2')
            event['narrativeSections'][0]['text'] = 'Changed statement, old evidence'
            (root / "data/chronology-events.json").write_text(json.dumps(events), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, event['id']):
                build_pages.chronology_event_pages(root)

    def test_ek_anlati_kayit_ve_yayin_tarihleri_ayri_gosterilir(self):
        body = build_pages.chronology_event_pages(ROOT)['olaylar/hamiltona-talimat/index.html'][3]
        self.assertIn('Kaydın başlığı: 15 Mart 1915', body)
        self.assertIn('Kitabın basımı: 1920', body)
        self.assertIn('Dijital aktarımın yayımı: 2006-09-19', body)
        self.assertIn('href="#anlati-1"', body)
        self.assertIn('Yayımlanmış aktarımın ilgili bölümü okundu', body)

    def test_kronoloji_kaynak_notu_eski_kanitla_uretilmez(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "data").mkdir()
            for name in ("chronology-events.json", "chronology-sources.json"):
                (root / "data" / name).write_bytes((ROOT / "data" / name).read_bytes())
            notes = json.loads((root / "data/chronology-sources.json").read_text(encoding="utf-8"))
            notes[0]["source"]["evidenceText"] = "Eski ve farklı iddia"
            (root / "data/chronology-sources.json").write_text(json.dumps(notes), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, notes[0]["id"]):
                build_pages.chronology_source_page(root)

    def test_kronoloji_kaynak_tarihleri_kayit_bazinda_gorunur(self):
        body = build_pages.chronology_source_page(ROOT)["kronoloji-kaynaklari/index.html"][3]
        notes = json.loads((ROOT / "data/chronology-sources.json").read_text(encoding="utf-8"))
        for note in notes:
            source = note["source"]
            self.assertIn("Erişim: " + source["accessDate"], body)
            self.assertIn("Olay tarihi: " + source["eventDate"], body)
        self.assertIn("Kaynağın yayın tarihi: ayrıca doğrulanmadı", body)
        self.assertNotIn("erişim tarihi 25 Ekim 2026", body)

    def test_kaynak_durumu_okuyucu_dilinde_ve_bilinmeyen_durum_acik_kalir(self):
        self.assertEqual(build_pages.source_status_label("gunluk_goruntusu_ilgili_pasaj_okundu"),
                         "Günlük görüntüsünün ilgili bölümü okundu")
        self.assertEqual(build_pages.source_status_label("iddia_dogrulandi"), "Kaynak incelemesi açık")
        for page in build_pages.chronology_event_pages(ROOT).values():
            self.assertNotIn("gunluk_goruntusu_ilgili_pasaj_okundu", page[3])
            self.assertNotIn("Belge doğrulaması tamamlanmadı", page[3])
            self.assertRegex(page[3], r'<aside class="verification-notice"><strong>(Kurum özetine|Günlük pasajına|Fotoğraf katalog açıklamasına) dayanan anlatı</strong>')


    def test_kok_betigin_klasorudur(self):
        self.assertEqual(build_pages.project_root(), ROOT)
        source = (ROOT / "build_pages.py").read_text(encoding="utf-8")
        self.assertNotIn("C:\\Users", source)

    def test_sablon_yoksa_anlasilir_hata(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(FileNotFoundError) as caught:
                build_pages.build_pages(tmp, {})
            self.assertIn("Sayfa şablonu yok", str(caught.exception))

    def test_yer_tutucu_yoksa_hata(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "page-shell.html").write_text("<html><body>BODY</body></html>", encoding="utf-8")
            pages = {"hakkinda/index.html": ("Hakkında", "A", "https://onsekizmart.com/hakkinda/", "<h1>Hakkında</h1>")}
            with self.assertRaises(ValueError) as caught:
                build_pages.build_pages(root, pages)
            self.assertIn("TITLE", str(caught.exception))

    def test_ikinci_calistirma_dosyayi_yeniden_yazmaz_ve_yeni_url_eklenir(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "page-shell.html").write_text(SHELL, encoding="utf-8")
            (root / "page-shell.html").write_text(SHELL, encoding="utf-8")
            pages = {
                "hakkinda/index.html": (
                    "Hakkında",
                    "Açıklama",
                    "https://onsekizmart.com/hakkinda/",
                    "<h1>Hakkında</h1>",
                )
            }
            self.assertEqual(len(build_pages.build_pages(root, pages)), 1)
            self.assertEqual(build_pages.build_pages(root, pages), [])
            (root / "sitemap.xml").write_text(
                "<urlset><url><loc>https://onsekizmart.com/hakkinda/</loc></url></urlset>",
                encoding="utf-8",
            )
            pages["gizlilik/index.html"] = (
                "Gizlilik",
                "Veri",
                "https://onsekizmart.com/gizlilik/",
                "<h1>Gizlilik</h1>",
            )
            build_pages.build_pages(root, pages)
            xml = build_pages.render_sitemap(build_pages.sitemap_entries(root))
            self.assertEqual(xml.count("https://onsekizmart.com/hakkinda/"), 1)
            self.assertIn("https://onsekizmart.com/gizlilik/", xml)
            self.assertNotIn("page-shell", xml)
            ET.fromstring(xml)
            build_pages.write_sitemap(root)
            again = (root / "sitemap.xml").read_text(encoding="utf-8")
            self.assertEqual(again.count("<loc>"), again.count("</loc>"))
            self.assertEqual(len(ET.fromstring(again).findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url")), 2)

    def test_kopyalama_tarihi_son_guncelleme_olarak_yazilmaz(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "page-shell.html").write_text(SHELL, encoding="utf-8")
            pages = {
                "index.html": (
                    "Ana",
                    "Giriş",
                    "https://onsekizmart.com/",
                    "<h1>Ana</h1>",
                )
            }
            build_pages.build_pages(root, pages)
            page = root / "index.html"
            stamp = datetime(2020, 1, 2, 12, 0, tzinfo=timezone.utc).timestamp()
            os.utime(page, (stamp, stamp))
            xml = build_pages.render_sitemap(build_pages.sitemap_entries(root))
            self.assertIn("<loc>https://onsekizmart.com/</loc>", xml)
            self.assertNotIn("<lastmod>", xml)
            self.assertNotIn("<priority>", xml)
            self.assertNotIn("<changefreq>", xml)

    def test_yalniz_sitemap_ozel_duzenlenmis_sayfayi_korur(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            page = root / "index.html"
            content = '<link rel="canonical" href="https://onsekizmart.com/"><h1>Özel içerik</h1>'
            page.write_text(content, encoding="utf-8")
            before = page.read_bytes()
            with patch.object(build_pages, "project_root", return_value=root), \
                 patch.object(sys, "argv", ["build_pages.py", "--sitemap-only"]), \
                 patch.object(build_pages, "build_pages") as builder, \
                 patch("builtins.print"):
                self.assertEqual(build_pages.main(), 0)
                builder.assert_not_called()
            self.assertEqual(page.read_bytes(), before)
            self.assertIn("https://onsekizmart.com/", (root / "sitemap.xml").read_text(encoding="utf-8"))

    def test_xml_adresindeki_ozel_karakter_korunur(self):
        url = "https://onsekizmart.com/?a=1&b=2"
        xml = build_pages.render_sitemap([url])
        loc = ET.fromstring(xml).find("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
        self.assertEqual(loc.text, url)

    def test_ayni_canonical_hata(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "olaylar").mkdir()
            (root / "olaylar" / "index.html").write_text(
                '<link rel="canonical" href="https://onsekizmart.com/olaylar/">',
                encoding="utf-8",
            )
            (root / "kopya").mkdir()
            (root / "kopya" / "index.html").write_text(
                '<link rel="canonical" href="https://onsekizmart.com/olaylar/">',
                encoding="utf-8",
            )
            with self.assertRaises(ValueError) as caught:
                build_pages.sitemap_entries(root)
            self.assertTrue(
                "uyuşmuyor" in str(caught.exception) or "Mükerrer" in str(caught.exception)
            )

    def test_ozel_klasorler_noindex_olmasa_da_yayin_listesine_girmez(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "index.html").write_text(
                '<link rel="canonical" href="https://onsekizmart.com/">', encoding="utf-8")
            for folder in ("archive", "research", "prototip", "node_modules"):
                private = root / folder / "sample"
                private.mkdir(parents=True)
                (private / "index.html").write_text("<h1>Private fixture</h1>", encoding="utf-8")
            self.assertEqual(build_pages.published_pages(root), [root / "index.html"])
            entries = build_pages.sitemap_entries(root)
            self.assertEqual(entries, ["https://onsekizmart.com/"])


class PhotoOutputComparisonTests(unittest.TestCase):
    def test_only_html_line_endings_are_ignored(self):
        import build_photo_archive
        with tempfile.TemporaryDirectory() as folder:
            page = Path(folder) / "index.html"
            page.write_bytes(b"<p>same</p>\r\n")
            self.assertTrue(build_photo_archive.output_matches(page, b"<p>same</p>\n"))
            self.assertFalse(build_photo_archive.output_matches(page, b"<p>changed</p>\n"))
            image = Path(folder) / "image.jpg"
            image.write_bytes(b"image\r\n")
            self.assertFalse(build_photo_archive.output_matches(image, b"image\n"))
            self.assertFalse(build_photo_archive.output_matches(Path(folder) / "missing.html", b""))


if __name__ == "__main__":
    unittest.main()
