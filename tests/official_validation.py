#!/usr/bin/env python3
"""Synthetic document regressions; these fixtures are not official evidence."""
from pathlib import Path
import copy
import datetime as dt
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("verify_official", ROOT / "tools/verify_official.py")
V = importlib.util.module_from_spec(spec)
spec.loader.exec_module(V)


class OfficialDocumentTests(unittest.TestCase):
    def setUp(self):
        self.html = ("<html><h1>Synthetic test document</h1>"
                     "<p>Effective from October 19, 2026</p><table>"
                     "<tr><th>Card Name</th><th>Advanced Format</th></tr>"
                     "<tr><td>Card A</td><td>Forbidden</td></tr>"
                     "<tr><td>Card B</td><td>Limited</td></tr></table></html>").encode()
        self.snapshot = {"format": "tcg", "effectiveDate": "2026-10-19", "data": [
            {"name": "CARD A", "max": 0}, {"name": "CARD B", "max": 1},
            {"name": "CARD C", "max": 3}]}
        self.metadata = {"sourceUrl": "https://www.yugioh-card.com/en/limited/",
                         "format": "tcg", "effectiveDate": "2026-10-19",
                         "dateWitness": "Effective from October 19, 2026",
                         "complete": True, "contentType": "text/html",
                         "sha256": V.sha(self.html)}

    def review(self, data=None, metadata=None, snapshot=None):
        return V.review_document(data or self.html, metadata or self.metadata,
                                 snapshot or self.snapshot, as_of="2026-10-22")

    def test_urls_require_exact_official_tls_authority(self):
        for url in ["http://www.yugioh-card.com/en/limited/",
                    "https://www.yugioh-card.com.evil.example/en/limited/",
                    "https://user:secret@www.yugioh-card.com/en/limited/",
                    "https://www.yugioh-card.com:444/en/limited/",
                    "https://www.konami.com/games/", "https://127.0.0.1/a",
                    "https://img.yugioh-card.com/private/unknown.pdf",
                    "https://img.yugioh-card.com.evil.example/en/downloads/rules.pdf",
                    "https://www.yugioh-card.com/en/limited/#fragment"]:
            with self.subTest(url=url), self.assertRaises(ValueError):
                V.valid_url(url)
        self.assertEqual(V.valid_url("https://www.konami.com/yugioh/rushduel/"),
                         "https://www.konami.com/yugioh/rushduel/")
        self.assertEqual(V.valid_url("https://img.yugioh-card.com/en/downloads/rulebook/SD_RuleBook_EN_10.pdf"),
                         "https://img.yugioh-card.com/en/downloads/rulebook/SD_RuleBook_EN_10.pdf")

    def test_official_redirect_is_validated_before_following(self):
        with self.assertRaises(ValueError):
            V.OfficialRedirects().redirect_request(None, None, 302, "", {}, "https://evil.example/a")

    def test_local_exact_table_match_does_not_authenticate_source(self):
        result = self.review()
        self.assertTrue(result["pass"])
        self.assertFalse(result["transportAuthenticatedInThisRun"])
        self.assertFalse(result["officialTableCompared"])
        self.assertFalse(result["officialIdentityCertified"])
        self.assertFalse(result["currentListProven"])
        self.assertEqual(result["status"], "LOCAL_DOCUMENT_TABLE_MATCH_SOURCE_UNAUTHENTICATED")

    def test_omitted_explicitly_unlimited_rows_are_not_missing_restrictions(self):
        result = self.review()
        self.assertEqual(result["missingFromDocument"], [])
        self.assertEqual(result["documentCounts"], {"0": 1, "1": 1, "2": 0, "3": 0})

    def test_matching_counts_with_wrong_card_names_fail(self):
        data = self.html.replace(b"Card A", b"Card D")
        metadata = {**self.metadata, "sha256": V.sha(data)}
        result = self.review(data, metadata)
        self.assertFalse(result["pass"])
        self.assertEqual(result["snapshotCounts"]["0"], result["documentCounts"]["0"])
        self.assertEqual(result["missingFromSnapshot"][0]["name"], "Card D")
        self.assertEqual(result["missingFromDocument"][0]["name"], "CARD A")

    def test_changed_limit_detected_even_when_name_matches(self):
        data = self.html.replace(b"<td>Limited</td>", b"<td>Semi-Limited</td>")
        result = self.review(data, {**self.metadata, "sha256": V.sha(data)})
        self.assertFalse(result["pass"])
        self.assertEqual(result["differentLimits"], [{"name": "CARD B", "snapshotMax": 1, "documentMax": 2}])

    def test_changed_bytes_cannot_reuse_document_hash(self):
        with self.assertRaisesRegex(ValueError, "DOCUMENT_HASH_MISMATCH"):
            self.review(self.html + b"changed")

    def test_different_snapshot_date_fails_even_with_identical_rows(self):
        result = self.review(snapshot={**self.snapshot, "effectiveDate": "2026-10-01"})
        self.assertFalse(result["pass"])
        self.assertTrue(result["rowsMatch"])
        self.assertFalse(result["dateMatch"])

    def test_effective_date_must_be_in_witness_and_document(self):
        for metadata in [{**self.metadata, "dateWitness": "October 19, 2026 absent"},
                         {**self.metadata, "effectiveDate": "2026-10-18"}]:
            with self.subTest(metadata=metadata), self.assertRaises(ValueError):
                self.review(metadata=metadata)

    def test_future_document_is_not_effective(self):
        with self.assertRaisesRegex(ValueError, "DOCUMENT_NOT_YET_EFFECTIVE"):
            V.review_document(self.html, self.metadata, self.snapshot, as_of="2026-10-18")

    def test_empty_and_unrecognized_table_cannot_be_unlimited(self):
        for data in [b"<table></table>", self.html.replace(b"Forbidden", b"Unknown")]:
            with self.subTest(data=data), self.assertRaises(ValueError):
                self.review(data, {**self.metadata, "sha256": V.sha(data)})

    def test_duplicate_normalized_names_are_rejected(self):
        with self.assertRaisesRegex(ValueError, "DUPLICATE_RESTRICTION_IDENTITY"):
            V.checked_rows([{"name": "Card A", "max": 0}, {"name": " card  a ", "max": 1}])

    def test_names_keep_meaningful_punctuation_and_symbols(self):
        self.assertNotEqual(V.normalized("CUPSY★YUMMY"), V.normalized("CUPSY☆YUMMY"))
        self.assertNotEqual(V.normalized("Card-A"), V.normalized("Card A"))
        self.assertEqual(V.normalized("Harpie’s Feather Duster"), V.normalized("HARPIE'S FEATHER DUSTER"))

    def test_script_contents_do_not_supply_document_witnesses(self):
        data = self.html.replace(b"<p>Effective from October 19, 2026</p>",
                                 b"<script>Effective from October 19, 2026</script>")
        with self.assertRaisesRegex(ValueError, "EFFECTIVE_DATE_WITNESS_NOT_IN_DOCUMENT"):
            self.review(data, {**self.metadata, "sha256": V.sha(data)})

    def text_review(self, line="Card A Forbidden"):
        data = ("Synthetic text fixture\nEffective from October 19, 2026\n" + line).encode()
        metadata = {**self.metadata, "contentType": "text/plain", "sha256": V.sha(data),
                    "rows": [{"name": "Card A", "max": 0, "witness": line}],
                    "reviewer": {"name": "Regression reviewer",
                                 "reviewedAt": "2026-10-20T00:00:00Z"}}
        snapshot = {**self.snapshot, "data": [{"name": "CARD A", "max": 0}]}
        return data, metadata, snapshot

    def test_plaintext_review_requires_exact_row_witness_and_reviewer(self):
        data, metadata, snapshot = self.text_review()
        result = self.review(data, metadata, snapshot)
        self.assertTrue(result["pass"])
        self.assertEqual(result["extraction"], "REVIEWER_ROWS_WITH_DOCUMENT_WITNESSES")
        for bad in [{**metadata, "rows": [{"name": "Card A", "max": 0, "witness": "Forbidden"}]},
                    {**metadata, "rows": [{"name": "Card A", "max": 0, "witness": "Card A Forbidden absent"}]},
                    {**metadata, "reviewer": {}},
                    {**metadata, "reviewer": {"name": "Regression reviewer", "reviewedAt": "2999-01-01T00:00:00Z"}}]:
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                self.review(data, bad, snapshot)

    def test_semilimited_witness_does_not_prove_limited_status(self):
        data, metadata, snapshot = self.text_review("Card A Semi-Limited")
        metadata["rows"][0]["max"] = 1
        with self.assertRaisesRegex(ValueError, "ROW_WITNESS_DOES_NOT_IDENTIFY_LIMIT"):
            self.review(data, metadata, snapshot)

    def test_card_name_containing_forbidden_does_not_supply_its_status(self):
        data, metadata, snapshot = self.text_review("Forbidden Card Limited")
        metadata["rows"] = [{"name": "Forbidden Card", "max": 1, "witness": "Forbidden Card Limited"}]
        snapshot["data"] = [{"name": "Forbidden Card", "max": 1}]
        self.assertTrue(self.review(data, metadata, snapshot)["pass"])

    def test_external_transport_receipt_cannot_authenticate_local_document(self):
        metadata = {**self.metadata, "transport": "DIRECT_HTTPS_TLS_VALIDATED_IN_THIS_PROCESS",
                    "independentlyVerified": True, "officialIdentityCertified": True}
        result = self.review(metadata=metadata)
        self.assertFalse(result["transportAuthenticatedInThisRun"])
        self.assertFalse(result["officialIdentityCertified"])

    @unittest.skipUnless(V.shutil.which("pdftotext"), "pdftotext not installed")
    def test_pdf_raw_hash_and_extracted_row_witnesses_are_bound(self):
        # An explicit synthetic one-page PDF proves the extraction path only.
        stream = (b"BT /F1 12 Tf 40 780 Td (Synthetic PDF fixture) Tj 0 -20 Td "
                  b"(Effective from October 19, 2026) Tj 0 -20 Td (Card A Forbidden) Tj ET")
        objects = [b"<< /Type /Catalog /Pages 2 0 R >>",
                   b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
                   b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
                   b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
                   b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream"]
        data = b"%PDF-1.4\n"
        offsets = [0]
        for index, value in enumerate(objects, 1):
            offsets.append(len(data))
            data += str(index).encode() + b" 0 obj\n" + value + b"\nendobj\n"
        start = len(data)
        data += b"xref\n0 6\n0000000000 65535 f \n"
        data += b"".join(f"{offset:010d} 00000 n \n".encode() for offset in offsets[1:])
        data += b"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + str(start).encode() + b"\n%%EOF\n"
        _, metadata, snapshot = self.text_review()
        metadata.update(contentType="application/pdf", sha256=V.sha(data))
        result = self.review(data, metadata, snapshot)
        self.assertTrue(result["pass"])
        self.assertEqual(result["documentSha256"], V.sha(data))
        self.assertFalse(result["transportAuthenticatedInThisRun"])
        metadata["sha256"] = V.sha(b"extracted text is not the original PDF")
        with self.assertRaisesRegex(ValueError, "DOCUMENT_HASH_MISMATCH"):
            self.review(data, metadata, snapshot)

    def test_live_process_receipt_proves_only_retrieved_table_scope(self):
        # This is a synthetic receipt for a unit test, not evidence from Konami.
        receipt = {"sourceUrl": self.metadata["sourceUrl"], "sha256": V.sha(self.html),
                   "transport": "DIRECT_HTTPS_TLS_VALIDATED_IN_THIS_PROCESS"}
        result = V.review_document(self.html, self.metadata, self.snapshot,
                                   fresh_receipt=receipt, as_of="2026-10-22")
        self.assertTrue(result["officialTableCompared"])
        self.assertFalse(result["currentListProven"])
        self.assertFalse(result["officialLegalityCertified"])
        self.assertFalse(result["universalCertified"])

    def neuron_fixture(self):
        # Minimal synthetic Neuron layout; not a retrieved official document.
        blocks = []
        sections = [("list_forbidden", "Forbidden List", "Card A", 1),
                    ("list_limited", "Limited List", "Card B", 2),
                    ("list_semi_limited", "Semi-Limited List", None, None),
                    ("list_release_of_restricted", "No Longer on the List", None, None)]
        for identity, title, name, cid in sections:
            row = (f'<div class="t_row c_simple"><div class="card_name flex_1">'
                   f'<span class="name">{name}</span><input class="link_value" '
                   f'value="/yugiohdb/card_search.action?ope=2&amp;cid={cid}"></div></div>') if name else ''
            blocks.append(f'<div id="{identity}" class="list_set"><div class="top">'
                          f'<h3>{title}: {int(name is not None)} Card(s)</h3>'
                          f'<span>Status Updated 10/19/2026</span></div>{row}</div>')
        data = ('<html><h1>Synthetic Neuron fixture</h1>' + ''.join(blocks) + '</html>').encode()
        metadata = {**self.metadata, "sourceUrl": "https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?request_locale=en",
                    "sha256": V.sha(data), "dateWitness": "Status Updated 10/19/2026"}
        return data, metadata

    def test_neuron_sections_match_without_authenticating_local_file(self):
        data, metadata = self.neuron_fixture()
        result = self.review(data, metadata)
        self.assertTrue(result["pass"])
        self.assertEqual(result["extraction"], "RECOGNIZED_NEURON_SECTIONS")
        self.assertFalse(result["officialTableCompared"])
        self.assertFalse(result["currentListProven"])

    def test_neuron_requires_all_four_complete_sections(self):
        data, metadata = self.neuron_fixture()
        data = data.replace(b'list_semi_limited', b'unknown_section')
        with self.assertRaisesRegex(ValueError, "COMPLETE_NEURON_SECTIONS_REQUIRED"):
            self.review(data, {**metadata, "sha256": V.sha(data)})

    def test_neuron_checks_each_section_date_and_count(self):
        original, metadata = self.neuron_fixture()
        for data, message in [(original.replace(b'Forbidden List: 1', b'Forbidden List: 2'), "COUNT_MISMATCH"),
                              (original.replace(b'10/19/2026', b'10/18/2026', 1), "DATE_MISMATCH")]:
            with self.subTest(message=message), self.assertRaisesRegex(ValueError, message):
                self.review(data, {**metadata, "sha256": V.sha(data)})

    def test_neuron_duplicate_sections_and_cids_are_rejected(self):
        original, metadata = self.neuron_fixture()
        for data, message in [(original.replace(b'</html>', b'<div id="list_limited"></div></html>'), "DUPLICATE_NEURON_SECTION"),
                              (original.replace(b'cid=2', b'cid=1'), "UNIQUE_CARD_CID_REQUIRED")]:
            with self.subTest(message=message), self.assertRaisesRegex(ValueError, message):
                self.review(data, {**metadata, "sha256": V.sha(data)})

    def test_neuron_status_updates_do_not_change_section_limit(self):
        data, metadata = self.neuron_fixture()
        data = data.replace(b'</h3>', b'</h3><p>Newly Limited Limited -&gt; Forbidden</p>', 1)
        self.assertTrue(self.review(data, {**metadata, "sha256": V.sha(data)})["pass"])

    def test_neuron_rejects_truncated_or_ambiguous_card_rows(self):
        original, metadata = self.neuron_fixture()
        for data in [original.replace(b'<span class="name">Card A</span>', b'<span class="name">Card A</span><span class="name">Card X</span>'),
                     original[:original.index(b'<div id="list_release_of_restricted"')] + b'<div id="list_release_of_restricted"><h3>No Longer on the List: 0 Card(s)</h3>Status Updated 10/19/2026']:
            with self.subTest(data=data[-80:]), self.assertRaises(ValueError):
                self.review(data, {**metadata, "sha256": V.sha(data)})

    def test_neuron_live_receipt_scope_remains_limited_to_table(self):
        data, metadata = self.neuron_fixture()
        receipt = {"sourceUrl": metadata["sourceUrl"], "sha256": V.sha(data),
                   "transport": "DIRECT_HTTPS_TLS_VALIDATED_IN_THIS_PROCESS"}
        result = V.review_document(data, metadata, self.snapshot, fresh_receipt=receipt, as_of="2026-10-26")
        self.assertTrue(result["officialTableCompared"])
        self.assertEqual(result["status"], "OFFICIAL_DOCUMENT_TABLE_MATCH")
        self.assertFalse(result["officialIdentityCertified"])
        self.assertFalse(result["officialLegalityCertified"])

    def test_embedded_table_is_loaded_as_claim_not_authentication(self):
        snapshot = V.embedded_snapshot()
        self.assertEqual(snapshot["source"], "EMBEDDED_APPLICATION_CLAIM")
        self.assertEqual(snapshot["effectiveDate"], "2026-10-19")
        self.assertGreater(len(snapshot["data"]), 100)
        self.assertTrue(any(row["name"] == "BRANDED FUSION" and row["max"] == 1 for row in snapshot["data"]))

    def test_cli_comparison_is_nonmutating_and_reports_discrepancies(self):
        before = V.sha((ROOT / "src/data/cards.json").read_bytes())
        with tempfile.TemporaryDirectory(prefix="ygo-official-test-") as directory:
            folder = Path(directory)
            (folder / "document.html").write_bytes(self.html)
            (folder / "metadata.json").write_text(json.dumps(self.metadata))
            (folder / "snapshot.json").write_text(json.dumps(self.snapshot))
            command = [sys.executable, str(ROOT / "tools/verify_official.py"), "compare",
                       "--document", str(folder / "document.html"), "--metadata", str(folder / "metadata.json"),
                       "--snapshot", str(folder / "snapshot.json"), "--as-of", "2026-10-22",
                       "--output", str(folder / "report.json")]
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            report = json.loads((folder / "report.json").read_text())
            self.assertFalse(report["transportAuthenticatedInThisRun"])
            changed = copy.deepcopy(self.snapshot)
            changed["data"][0]["max"] = 1
            (folder / "snapshot.json").write_text(json.dumps(changed))
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            report = json.loads((folder / "report.json").read_text())
            self.assertEqual(report["status"], "SNAPSHOT_DISCREPANCIES")
        self.assertEqual(before, V.sha((ROOT / "src/data/cards.json").read_bytes()))


if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(OfficialDocumentTests)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    report = {"schema": "ygo-official-verifier-regression/v1", "pass": result.wasSuccessful(),
              "testsRun": result.testsRun, "errors": len(result.errors), "failures": len(result.failures),
              "fixtureScope": "SYNTHETIC_TEST_DOCUMENTS_NOT_OFFICIAL_EVIDENCE",
              "officialSnapshotVerified": False}
    (ROOT / "tests/official-validation-results.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report))
    raise SystemExit(0 if result.wasSuccessful() else 1)
