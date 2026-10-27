#!/usr/bin/env python3
"""Reject stale or overclaimed documentary evidence before publishing HTML."""
from pathlib import Path
import importlib.util
import json
import shutil
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('ygo_build_checks', ROOT / 'tools/build.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class OfficialBuildTests(unittest.TestCase):
    def make_root(self, folder):
        root = Path(folder)
        (root / 'src/data').mkdir(parents=True)
        (root / 'src/modules').mkdir()
        shutil.copytree(ROOT / 'src/data/official', root / 'src/data/official')
        shutil.copy2(ROOT / 'src/data/official-context-verification.json', root / 'src/data/official-context-verification.json')
        shutil.copy2(ROOT / 'src/modules/085-ygo-alpha-1216-canonical-release.js', root / 'src/modules/085-ygo-alpha-1216-canonical-release.js')
        return root

    def test_exact_saved_bytes_revalidate_without_portable_origin_authentication(self):
        result = build.official_context(ROOT)
        self.assertTrue(result['pass'])
        self.assertTrue(result['storedBytesRecheckedAtBuild'])
        self.assertFalse(result['retrievalAuthenticatedInThisBuild'])
        self.assertFalse(result['currentListProven'])
        self.assertEqual(result['restrictedNamesCompared'], 255)

    def test_altered_document_bytes_fail_before_compilation(self):
        with tempfile.TemporaryDirectory() as folder:
            root = self.make_root(folder)
            document = root / 'src/data/official/tcg-2026-10-19.html'
            document.write_bytes(document.read_bytes() + b' altered')
            with self.assertRaisesRegex(ValueError, 'document hash mismatch'):
                build.official_context(root)

    def test_altered_embedded_table_invalidates_the_comparison(self):
        with tempfile.TemporaryDirectory() as folder:
            root = self.make_root(folder)
            module = root / 'src/modules/085-ygo-alpha-1216-canonical-release.js'
            source = module.read_text()
            source = source.replace('const KONAMI_TCG1125=Object.freeze({', 'const KONAMI_TCG1125=Object.freeze({"99":[],', 1)
            module.write_text(source)
            with self.assertRaisesRegex(ValueError, 'table changed'):
                build.official_context(root)

    def test_retrieval_metadata_alone_cannot_change_the_scope(self):
        for flag in ['currentListProven', 'officialPoolVerified', 'officialRulingsVerified',
                     'officialPasscodesVerified', 'competitiveCertified']:
            with self.subTest(flag=flag), tempfile.TemporaryDirectory() as folder:
                root = self.make_root(folder)
                path = root / 'src/data/official-context-verification.json'
                data = json.loads(path.read_text()); data[flag] = True
                path.write_text(json.dumps(data))
                with self.assertRaisesRegex(ValueError, 'cannot certify'):
                    build.official_context(root)

    def test_evidence_paths_cannot_escape_source_directory(self):
        with tempfile.TemporaryDirectory() as folder:
            root = self.make_root(folder)
            path = root / 'src/data/official-context-verification.json'
            data = json.loads(path.read_text()); data['documentPath'] = '../outside.html'
            path.write_text(json.dumps(data))
            with self.assertRaisesRegex(ValueError, 'must remain'):
                build.official_context(root)


if __name__ == '__main__':
    unittest.main(verbosity=2)
