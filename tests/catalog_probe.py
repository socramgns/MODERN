#!/usr/bin/env python3
"""Regression checks of source data and the real catalogue application layer."""
from pathlib import Path
import hashlib
import json
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]


class CatalogueTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.raw = (ROOT / "src/data/cards.json").read_bytes()
        cls.rows = json.loads(cls.raw)
        cls.manifest = json.loads((ROOT / "src/data/catalog-manifest.json").read_text())
        cls.by_id = {row[0]: row for row in cls.rows}

    def test_restricted_names_resolved_from_real_source(self):
        self.assertEqual(self.manifest["restrictedNamesNotInRetainedCatalogue"], [])
        added = self.manifest["addedRestrictedSourceMatches"]
        self.assertEqual(len(added), 36)
        self.assertEqual(len({row["matchedRestrictedName"] for row in added}), 35)
        for row in added:
            self.assertIn(row["id"], self.by_id)
            self.assertEqual(self.by_id[row["id"]][6], "cards.cdb")

    def test_compiler_updates_numeric_pins_only(self):
        value = {"count": 19653, "sources": {"probe.js": "// 19617\nconst n=19617, s='19617', r=/19617/;"}}
        result = subprocess.run(["node", str(ROOT/"tools/catalog_counts.cjs")], input=json.dumps(value), text=True, capture_output=True, check=True)
        compiled = json.loads(result.stdout)
        self.assertEqual(compiled["sources"]["probe.js"], "// 19617\nconst n=19653, s='19617', r=/19617/;")
        self.assertEqual(compiled["replacements"]["probe.js"], 1)

    def test_schema_count_identity_and_hash(self):
        self.assertEqual(len(self.rows), self.manifest["cardCount"])
        self.assertEqual(len(self.rows), len(self.by_id))
        self.assertTrue(all(len(row) == 15 for row in self.rows))
        self.assertEqual(hashlib.sha256(self.raw).hexdigest(), self.manifest["cardsSha256"])

    def test_real_metadata_and_zero_are_preserved(self):
        self.assertEqual(self.by_id[89631139][8:11], [3000,2500,8])
        self.assertEqual(self.by_id[14558127][8:11], [0,1800,3])
        self.assertEqual(self.by_id[11091375][8:11], [1900,1600,4])
        self.assertEqual(self.by_id[43096270][8:11], [2000,100,4])

    def test_missing_sources_remain_explicit(self):
        missing = self.manifest["unmatchedLegacyRows"]
        self.assertEqual(len(missing), self.manifest["unknownSourceCount"])
        for entry in missing:
            row = self.by_id[entry["id"]]
            self.assertEqual(row[1], entry["name"])
            self.assertTrue(all(value is None for value in row[7:]))
        self.assertEqual(self.manifest["matchedSourceCount"] + len(missing), len(self.rows))

    def test_aliases_come_from_cdb_data(self):
        for key, alias in self.manifest["aliases"].items():
            self.assertEqual(self.by_id[int(key)][13], alias)
        self.assertEqual(self.manifest["aliases"]["81439174"], 81439173)

    def test_sources_pinned_and_identified(self):
        commit = self.manifest["sourceCommit"]
        self.assertRegex(commit, r"^[0-9a-f]{40}$")
        for source in self.manifest["sources"]:
            self.assertIn(commit, source["url"])
            self.assertRegex(source["sha256"], r"^[0-9a-f]{64}$")
            self.assertEqual(source["authority"], "SECONDARY_TECHNICAL_PROJECT_IGNIS")

    def test_runtime_alias_pool_and_unknown_handling(self):
        program = r"""
const fs = require('fs'), vm = require('vm');
const root = process.argv[1];
const rows = JSON.parse(fs.readFileSync(root+'/src/data/cards.json'));
const manifest = JSON.parse(fs.readFileSync(root+'/src/data/catalog-manifest.json'));
const window = {YGO_CATALOG_MANIFEST:manifest,
 CARD_CATALOG:rows.map(r=>({id:r[0],name:r[1],typeBits:r[3],source:r[6]})),
 getEmbeddedDB:async()=>rows,dispatchEvent:()=>{},__YGO_ENGINE_READY:Promise.resolve()};
vm.runInNewContext(fs.readFileSync(root+'/src/app/catalog.js','utf8'),
 {window,CustomEvent:class{constructor(t,o){this.type=t;this.detail=o.detail}},console});
window.YGODataCatalog.ready.then(()=>{
 const api=window.YGODataCatalog;
 const testDeck={main:[{id:81439173,qty:2},{id:81439174,qty:2}],extra:[],side:[]};
 const unknown=api.lookup(999999999999);
 const outcome={status:api.status(),
  familyA:api.canonicalIdentity(81439173),familyB:api.canonicalIdentity(81439174),
  ash:api.lookup(14558127),dragon:api.lookup(89631139),
  tcg:api.poolEvidence(14558127,'tcg'),digital:api.poolEvidence(14558127,'master'),
  unknown:api.poolEvidence(999999999999,'tcg'),audit:api.auditDeck(testDeck,{format:'tcg',banlist:[]}),
  foolish:api.resolveName('Foolish Burial',{format:'tcg'})};
 console.log(JSON.stringify(outcome));
}).catch(e=>{console.error(e);process.exitCode=1});
"""
        process = subprocess.run(["node", "-e", program, str(ROOT)], text=True,
                                 capture_output=True, check=True)
        data = json.loads(process.stdout)
        self.assertTrue(data["status"]["loaded"])
        self.assertEqual(data["status"]["sourceMatched"], self.manifest["matchedSourceCount"])
        self.assertEqual(data["familyA"]["canonicalId"], data["familyB"]["canonicalId"])
        self.assertTrue(data["foolish"]["pass"])
        self.assertEqual(data["ash"]["atk"], 0)
        self.assertTrue(data["ash"]["statsKnown"])
        self.assertTrue(data["tcg"]["eligible"])
        self.assertIsNone(data["digital"]["eligible"])
        self.assertIsNone(data["unknown"]["eligible"])
        self.assertFalse(data["audit"]["pass"])
        self.assertTrue(any(error["reason"] == "ALIAS_FAMILY_OVER_THREE" for error in data["audit"]["errors"]))
        self.assertFalse(data["status"]["officialMetadataCertified"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
