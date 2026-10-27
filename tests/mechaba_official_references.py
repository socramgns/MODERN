#!/usr/bin/env python3
"""Tamper checks for scoped official OCG FAQ references, without network."""
from pathlib import Path
import copy
import importlib.util
import json
import shutil
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCOPE = 'TCG_REFERENCE_NOT_TCG_RULING_CERTIFICATION'
spec = importlib.util.spec_from_file_location('ygo_mechaba_reference_checks', ROOT / 'tools/mechaba_references.py')
references = importlib.util.module_from_spec(spec)
spec.loader.exec_module(references)
verify_bundle, load_references, sha = references.verify_bundle, references.load_references, references.sha


class MechabaReferenceTests(unittest.TestCase):
    def bundle(self):
        return json.loads((ROOT / 'src/data/mechaba-ruling-references.json').read_text())

    def fixture(self, folder):
        root = Path(folder)
        shutil.copytree(ROOT / 'src/data/official', root / 'src/data/official')
        shutil.copy2(ROOT / 'src/data/mechaba-ruling-references.json',
                     root / 'src/data/mechaba-ruling-references.json')
        return root

    def test_saved_primary_documents_and_original_quotes_match(self):
        checked = verify_bundle()
        self.assertTrue(checked['integrityPass'])
        self.assertEqual(checked['references'], 3)
        self.assertFalse(checked['sourceAuthenticatedInThisRun'])
        self.assertFalse(checked['officialTcgRulingCertified'])

    def test_loader_returns_rechecked_record_without_live_authentication(self):
        loaded = load_references(ROOT)
        self.assertTrue(loaded['storedBytesRechecked'])
        self.assertEqual(loaded['verifiedReferenceCount'], 3)
        self.assertEqual(loaded['scope'], SCOPE)
        self.assertFalse(loaded['sourceAuthenticatedInThisRun'])
        self.assertFalse(loaded['officialTcgRulingCertified'])
        self.assertEqual([entry['faqId'] for entry in loaded['references']], [16041, 22388, 23949])

    def test_semantic_principle_flags_cannot_silently_change(self):
        for flag in ['captureActivationLocationBeforeCosts',
                     'negationCanApplyAfterSourceChangesLocation',
                     'associatedBanishRequiresSourceAtItsActivationLocation']:
            with self.subTest(flag=flag):
                bundle = self.bundle()
                bundle[flag] = False
                with self.assertRaisesRegex(ValueError, 'PRINCIPLE_CONTEXT_INVALID'):
                    verify_bundle(bundle=bundle)

    def test_metadata_cannot_claim_portable_origin_authentication(self):
        with tempfile.TemporaryDirectory() as folder:
            root = self.fixture(folder)
            path = root / self.bundle()['references'][0]['metadataPath']
            metadata = json.loads(path.read_text())
            metadata['savedReceiptAuthenticatesOriginInLaterRuns'] = True
            path.write_text(json.dumps(metadata))
            with self.assertRaisesRegex(ValueError, 'CAPTURE_METADATA_MISMATCH'):
                verify_bundle(root)

    def test_capture_question_binding_cannot_change_with_a_matching_raw_hash(self):
        with tempfile.TemporaryDirectory() as folder:
            root = self.fixture(folder)
            path = root / self.bundle()['references'][0]['metadataPath']
            metadata = json.loads(path.read_text())
            metadata['faqId'] = 22388
            path.write_text(json.dumps(metadata))
            with self.assertRaisesRegex(ValueError, 'CAPTURE_METADATA_MISMATCH'):
                verify_bundle(root)

    def test_references_cover_field_cost_hand_cost_and_general_location_rule(self):
        bundle = self.bundle()
        ids = {entry['id'] for entry in bundle['references']}
        self.assertEqual(ids, {'mechaba-field-source-tributed-as-cost',
                               'mechaba-hand-source-sent-as-cost',
                               'mechaba-activation-location-general-principle'})
        self.assertTrue(bundle['captureActivationLocationBeforeCosts'])
        self.assertTrue(bundle['negationCanApplyAfterSourceChangesLocation'])
        self.assertTrue(bundle['associatedBanishRequiresSourceAtItsActivationLocation'])

    def test_altered_raw_bytes_fail_without_refreshing_the_receipt(self):
        with tempfile.TemporaryDirectory() as folder:
            root = self.fixture(folder)
            path = root / self.bundle()['references'][0]['documentPath']
            path.write_bytes(path.read_bytes() + b' altered')
            with self.assertRaisesRegex(ValueError, 'DOCUMENT_HASH_MISMATCH'):
                verify_bundle(root)

    def test_forged_quote_does_not_become_evidence_by_its_own_hash(self):
        bundle = self.bundle()
        quote = bundle['references'][0]['quotes'][0]
        quote['originalJapanese'] = '架空の引用・not in the official answer'
        quote['originalTextSha256'] = sha(quote['originalJapanese'].encode())
        with self.assertRaisesRegex(ValueError, 'QUOTE_NOT_WITNESSED'):
            verify_bundle(bundle=bundle)

    def test_stale_extracted_field_hash_is_rejected(self):
        bundle = self.bundle()
        bundle['references'][0]['fieldSha256']['answer_text'] = '0' * 64
        with self.assertRaisesRegex(ValueError, 'FIELD_TEXT_HASH_MISMATCH'):
            verify_bundle(bundle=bundle)

    def test_translation_cannot_replace_primary_japanese_citation(self):
        bundle = self.bundle()
        bundle['references'][0]['quotes'][0]['translationIsPrimaryEvidence'] = True
        with self.assertRaisesRegex(ValueError, 'TRANSLATION_SCOPE_INVALID'):
            verify_bundle(bundle=bundle)

    def test_ocg_source_cannot_be_relabelled_as_tcg_certification(self):
        bundle = self.bundle()
        bundle['references'][0]['formatAuthority'] = 'TCG'
        with self.assertRaisesRegex(ValueError, 'AUTHORITY_OR_LANGUAGE_INVALID'):
            verify_bundle(bundle=bundle)
        bundle = self.bundle()
        bundle['officialTcgRulingCertified'] = True
        with self.assertRaisesRegex(ValueError, 'SCOPE_OVERCLAIM'):
            verify_bundle(bundle=bundle)

    def test_local_receipt_does_not_authenticate_a_later_run(self):
        for flag in ['officialPoolVerified', 'competitiveCertified', 'universalCertified',
                     'savedReceiptAuthenticatesOriginInLaterRuns']:
            with self.subTest(flag=flag):
                bundle = self.bundle()
                bundle[flag] = True
                with self.assertRaisesRegex(ValueError, 'SCOPE_OVERCLAIM'):
                    verify_bundle(bundle=bundle)

    def test_faq_url_and_metadata_are_bound_to_the_captured_question(self):
        bundle = self.bundle()
        bundle['references'][0]['sourceUrl'] = bundle['references'][0]['sourceUrl'].replace('fid=16041', 'fid=22388')
        with self.assertRaisesRegex(ValueError, 'OFFICIAL_URL_CONTEXT_INVALID'):
            verify_bundle(bundle=bundle)

    def test_reference_paths_must_stay_inside_saved_evidence(self):
        bundle = self.bundle()
        bundle['references'][0]['documentPath'] = '../../elsewhere.html'
        with self.assertRaisesRegex(ValueError, 'PATH_ESCAPES_EVIDENCE'):
            verify_bundle(bundle=bundle)

    def test_missing_or_duplicate_faq_cannot_complete_the_reference_set(self):
        bundle = self.bundle()
        bundle['references'][2] = copy.deepcopy(bundle['references'][1])
        with self.assertRaisesRegex(ValueError, 'SET_INCOMPLETE_OR_DUPLICATED'):
            verify_bundle(bundle=bundle)


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(MechabaReferenceTests)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    report = {'schema': 'ygo-mechaba-reference-tests/v1', 'pass': result.wasSuccessful(),
              'total': result.testsRun, 'failures': len(result.failures),
              'errors': len(result.errors), 'networkUsed': False,
              'referenceBundleSha256': sha((ROOT / 'src/data/mechaba-ruling-references.json').read_bytes()),
              'scope': SCOPE, 'sourceAuthenticatedInThisRun': False}
    (ROOT / 'tests/mechaba-official-references-results.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report))
    raise SystemExit(0 if result.wasSuccessful() else 1)
