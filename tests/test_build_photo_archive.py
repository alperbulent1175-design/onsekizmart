import copy
import json
import tempfile
import unittest
from pathlib import Path

import build_photo_archive as photos


class PhotoBuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.records = copy.deepcopy(json.loads((photos.ROOT / photos.LEDGER).read_text(encoding='utf-8'))['records'][:2])
        for record in self.records:
            for name in [record['sitePreparedPath'], *record['localUses']]:
                dest = self.root / name
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes((photos.ROOT / name).read_bytes())
        self.save()

    def save(self):
        ledger = self.root / photos.LEDGER
        ledger.parent.mkdir(parents=True, exist_ok=True)
        ledger.write_text(json.dumps({'records': self.records}), encoding='utf-8')

    def test_clean_checkout_uses_site_copies_and_build_is_repeatable(self):
        outputs = photos.plan(self.root)
        for path, data in outputs.items():
            path.write_bytes(data)
        self.assertEqual(outputs, photos.plan(self.root))
        archive = outputs[self.root / 'fotograf-arsivi/index.html'].decode()
        self.assertEqual(archive.count('data-photo-id='), 2)
        for record in self.records:
            self.assertIn('id="foto-' + record['id'].replace(' ', '-') + '" tabindex="-1"', archive)
        self.assertIn('İlgili sayfalar:', archive)
        self.assertIn('2 fotoğraf.', archive)
        report = json.loads(outputs[self.root / photos.LEDGER.parent / 'coverage.json'])
        self.assertEqual(report['photos'], 2)
        self.assertEqual(report['counts']['olaylar']['withPhotos'], 1)
        self.assertEqual(report['pages'][0]['photoIds'], [r['id'] for r in self.records])

    def test_unreviewed_rights_and_duplicates_are_rejected_without_writes(self):
        for field, value in [('rightsStatus', 'belirsiz'), ('verificationStatus', 'inceleme_acik'), ('id', self.records[1]['id'])]:
            with self.subTest(field=field):
                original = self.records[0][field]
                self.records[0][field] = value
                self.save()
                with self.assertRaises(ValueError):
                    photos.plan(self.root)
                self.records[0][field] = original

    def test_corrupt_image_is_rejected(self):
        (self.root / self.records[0]['sitePreparedPath']).write_bytes(b'corrupt')
        with self.assertRaisesRegex(ValueError, 'Dosya özeti'):
            photos.plan(self.root)

    def test_photo_anchor_collision_is_rejected_before_writing(self):
        self.records[0]['id'] = 'Bild 183-test'
        self.records[1]['id'] = 'Bild-183-test'
        self.save()
        with self.assertRaisesRegex(ValueError, 'bölüm kimliği'):
            photos.plan(self.root)

    def test_unsafe_paths_and_rights_links_are_rejected(self):
        for field, value in [('sitePreparedPath', 'images/../../outside.jpg'), ('rightsUrl', 'javascript:alert(1)')]:
            with self.subTest(field=field):
                original = self.records[0].get(field)
                self.records[0][field] = value
                self.save()
                with self.assertRaises(ValueError):
                    photos.plan(self.root)
                if original is None:
                    self.records[0].pop(field)
                else:
                    self.records[0][field] = original

    def test_broken_gallery_boundary_does_not_silently_leave_stale_photos(self):
        page = self.root / 'fotograf-arsivi/index.html'
        page.write_text(page.read_text(encoding='utf-8').replace(photos.END, ''), encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'Galeri sınırları'):
            photos.plan(self.root)

    def test_licensed_photo_keeps_attribution_license_and_change_notice(self):
        record = self.records[0]
        record.update(rightsStatus='acik_lisans_cc_by_sa_3_0_de', license='CC-BY-SA-3.0-DE',
                      rightsUrl=photos.CC_BY_SA_DE, rightsEvidenceUrl='https://example.org/object/1',
                      imageChangesTr='Dosya değiştirilmeden kullanıldı.')
        self.save()
        photos.plan(self.root)
        figure = photos.figure(record)
        self.assertIn(record['credit'], figure)
        self.assertIn(photos.CC_BY_SA_DE, figure)
        self.assertIn('Görsele ait lisans kaydı', figure)
        self.assertIn('Dosya değiştirilmeden kullanıldı.', figure)
        self.assertNotIn('kamu malı', figure)
        for field in ['license', 'rightsUrl', 'rightsEvidenceUrl', 'imageChangesTr']:
            with self.subTest(field=field):
                original = record.pop(field)
                self.save()
                with self.assertRaises(ValueError):
                    photos.plan(self.root)
                record[field] = original


if __name__ == '__main__':
    unittest.main()
