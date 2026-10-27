#!/usr/bin/env python3
"""Verify primary-source expansion, retained identities and an offline refresh."""
from pathlib import Path
import hashlib
import importlib.util
import json
import sqlite3
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


def sha(value):
    return hashlib.sha256(value).hexdigest()


class CatalogueExpansionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.raw = (ROOT / 'src/data/cards.json').read_bytes()
        cls.rows = json.loads(cls.raw)
        cls.manifest = json.loads((ROOT / 'src/data/catalog-manifest.json').read_text())
        cls.by_id = {row[0]: row for row in cls.rows}
        cls.commit = cls.manifest['sourceCommit']
        cls.cache = ROOT / '.cache/catalog'
        source = cls.cache / (cls.commit + '-cards.cdb')
        expected = next(row['sha256'] for row in cls.manifest['sources'] if row['file'] == 'cards.cdb')
        if sha(source.read_bytes()) != expected:
            raise ValueError('Primary snapshot checksum mismatch')
        with sqlite3.connect('file:' + str(source) + '?mode=ro', uri=True) as db:
            cls.source = {row[0]: row for row in db.execute(
                'SELECT d.id,t.name,t.desc,d.type,d.attribute,d.race,d.atk,d.def,'
                'd.level,d.setcode,d.ot,d.alias,d.category FROM datas d JOIN texts t USING(id)')}
        specification = importlib.util.spec_from_file_location('catalogue_expansion_audit', ROOT / 'tools/audit_catalogue.py')
        cls.audit = importlib.util.module_from_spec(specification)
        specification.loader.exec_module(cls.audit)

    def refresh(self, folder, rows=None, manifest=None, cache=None):
        folder = Path(folder)
        input_path, manifest_path = folder / 'cards.json', folder / 'manifest.json'
        input_path.write_bytes(self.raw if rows is None else json.dumps(rows, separators=(',', ':')).encode())
        manifest_path.write_text(json.dumps(self.manifest if manifest is None else manifest, separators=(',', ':')))
        result = subprocess.run(['python3', str(ROOT / 'tools/update_catalog.py'), '--offline',
            '--commit', self.commit, '--cache-dir', str(cache or self.cache),
            '--input', str(input_path), '--output', str(input_path), '--manifest', str(manifest_path)],
            capture_output=True, text=True)
        return result, input_path, manifest_path

    def test_all_primary_snapshot_passcodes_are_present(self):
        self.assertEqual(set(self.source) - set(self.by_id), set())
        coverage = self.manifest['primarySourceCoverage']
        self.assertEqual(coverage['recordCount'], len(self.source))
        self.assertEqual(coverage['representedPasscodes'], len(self.source))
        self.assertEqual(coverage['missingPasscodes'], [])
        self.assertTrue(coverage['completeTechnicalSnapshot'])
        self.assertFalse(coverage['officialAvailabilityVerified'])

    def test_primary_metadata_matches_the_immutable_source(self):
        for card_id, source in self.source.items():
            row = self.by_id[card_id]
            self.assertEqual(row[2:5], list(source[2:5]), card_id)
            self.assertEqual(row[6], 'cards.cdb', card_id)
            self.assertEqual(row[7:11], list(source[5:9]), card_id)
            self.assertEqual(row[11:], [str(source[9]), *source[10:]], card_id)

    def test_retained_passcodes_and_order_are_not_rewritten(self):
        baseline = self.manifest['retainedBeforePrimaryExpansion']
        original_prefix = self.rows[:baseline['cardCount']]
        self.assertEqual(sha(json.dumps([row[0] for row in original_prefix], separators=(',', ':')).encode()),
                         baseline['orderedPasscodesSha256'])
        self.assertEqual(len(self.by_id), len(self.rows))
        for entry in self.manifest['unmatchedLegacyRows']:
            self.assertEqual(self.by_id[entry['id']][1], entry['name'])
            self.assertTrue(all(value is None for value in self.by_id[entry['id']][7:]))

    def test_addition_ledger_uses_exact_primary_ids_and_names(self):
        additions = self.manifest['addedPrimarySourceMatches']
        self.assertGreater(len(additions), 0)
        self.assertEqual([entry['id'] for entry in additions], sorted({entry['id'] for entry in additions}))
        baseline_ids = {row[0] for row in self.rows[:self.manifest['retainedBeforePrimaryExpansion']['cardCount']]}
        for entry in additions:
            self.assertNotIn(entry['id'], baseline_ids)
            self.assertEqual(entry['name'], self.source[entry['id']][1])
            self.assertEqual(self.by_id[entry['id']][1], entry['name'])
            self.assertEqual(entry['source'], 'cards.cdb')
            self.assertEqual(entry['firstSourceCommit'], self.commit)

    def test_alternative_passcodes_keep_their_real_alias(self):
        for card_id, source in self.source.items():
            self.assertEqual(self.by_id[card_id][13], source[11])
            if source[11]:
                self.assertEqual(self.manifest['aliases'][str(card_id)], source[11])
        added_aliases = [entry for entry in self.manifest['addedPrimarySourceMatches']
                         if self.by_id[entry['id']][13]]
        self.assertTrue(added_aliases)

    def test_known_missing_cards_are_now_available_with_stats(self):
        for card_id, expected in [(43227, 'Magnum the Reliever'), (324483, 'Ultimate Flame Swordsman'),
                                  (342673, 'Dark Magician the Magician of Black Magic')]:
            self.assertEqual(self.by_id[card_id][1], expected)
            self.assertIsInstance(self.by_id[card_id][8], int)
            self.assertIsInstance(self.by_id[card_id][9], int)

    def test_new_unofficial_rush_and_skill_records_are_not_auto_added(self):
        before = {row[0] for row in self.rows[:self.manifest['retainedBeforePrimaryExpansion']['cardCount']]}
        primary = set(self.source)
        excluded = set()
        for source in self.manifest['sources']:
            if source['file'] == 'cards.cdb':
                continue
            path = self.cache / (self.commit + '-' + source['file'])
            self.assertEqual(sha(path.read_bytes()), source['sha256'])
            with sqlite3.connect('file:' + str(path) + '?mode=ro', uri=True) as db:
                excluded.update(card_id for card_id, in db.execute('SELECT id FROM datas')
                                if card_id not in before and card_id not in primary)
        self.assertTrue(excluded)
        self.assertFalse(excluded & set(self.by_id))

    def test_hygiene_audit_checks_missing_primary_ids_separately(self):
        report = self.audit.build_report(ROOT)
        coverage = report['primarySourceCoverage']
        self.assertTrue(coverage['checkedAgainstCachedSource'])
        self.assertEqual(coverage['sourceRecordCount'], len(self.source))
        self.assertTrue(coverage['completeTechnicalSnapshot'])
        self.assertEqual(coverage['missingPasscodes'], [])
        self.assertFalse(coverage['officialAvailabilityVerified'])
        self.assertFalse(report['officialIdentityCertified'])

    def test_offline_refresh_is_byte_identical_including_ledger(self):
        with tempfile.TemporaryDirectory(prefix='ygo-catalog-idempotence-') as folder:
            result, cards, manifest = self.refresh(folder)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(cards.read_bytes(), self.raw)
            self.assertEqual(json.loads(manifest.read_bytes()), self.manifest)
            first_cards, first_manifest = cards.read_bytes(), manifest.read_bytes()
            second, cards, manifest = self.refresh(folder, json.loads(first_cards), json.loads(first_manifest))
            self.assertEqual(second.returncode, 0, second.stderr)
            self.assertEqual(cards.read_bytes(), first_cards)
            self.assertEqual(manifest.read_bytes(), first_manifest)

    def test_refresh_from_retained_baseline_adds_every_missing_primary_id(self):
        additions = {entry['id'] for entry in self.manifest['addedPrimarySourceMatches']}
        baseline = [row for row in self.rows if row[0] not in additions]
        previous = {key: value for key, value in self.manifest.items()
                    if key not in {'addedPrimarySourceMatches', 'retainedBeforePrimaryExpansion', 'primarySourceCoverage'}}
        with tempfile.TemporaryDirectory(prefix='ygo-catalog-expansion-') as folder:
            result, cards, manifest = self.refresh(folder, baseline, previous)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(cards.read_bytes(), self.raw)
            self.assertEqual(json.loads(manifest.read_bytes()), self.manifest)

    def test_missing_cache_fails_offline_without_replacing_inputs(self):
        with tempfile.TemporaryDirectory(prefix='ygo-catalog-no-cache-') as folder:
            empty = Path(folder) / 'cache'
            result, cards, manifest = self.refresh(folder, cache=empty)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Pinned cache is missing', result.stderr)
            self.assertEqual(cards.read_bytes(), self.raw)
            self.assertEqual(json.loads(manifest.read_bytes()), self.manifest)

    def test_corrupt_cache_is_rejected_without_network_fallback(self):
        with tempfile.TemporaryDirectory(prefix='ygo-catalog-corrupt-') as folder:
            cache = Path(folder) / 'cache'
            cache.mkdir()
            (cache / (self.commit + '-cards.cdb')).write_bytes(b'not the pinned source')
            result, cards, manifest = self.refresh(folder, cache=cache)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Pinned cache checksum mismatch', result.stderr)
            self.assertEqual(cards.read_bytes(), self.raw)

    def test_duplicate_input_identity_is_rejected_before_writes(self):
        with tempfile.TemporaryDirectory(prefix='ygo-catalog-duplicate-') as folder:
            result, cards, manifest = self.refresh(folder, [self.rows[0], self.rows[0]])
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('unique passcodes', result.stderr)
            self.assertEqual(len(json.loads(cards.read_bytes())), 2)


if __name__ == '__main__':
    unittest.main(verbosity=2)
