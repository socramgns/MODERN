#!/usr/bin/env python3
"""Recheck unresolved IDs against all five already pinned CDB files, offline.

This supplements audit_catalogue.py, whose name-candidate oracle reads only the
primary CDB. No source is downloaded, no catalogue or deck is modified, and a
matching candidate name never supplies statistics for a different passcode.
"""
from __future__ import annotations

import argparse
import collections
import hashlib
import json
import math
import sqlite3
from pathlib import Path

from audit_catalogue import build_report, category

ROOT = Path(__file__).resolve().parents[1]
FILES = frozenset({"cards.cdb", "cards-rush.cdb", "cards-skills.cdb",
                   "cards-unofficial.cdb", "cards-skills-unofficial.cdb"})


def digest(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def unique_ids(values: list, label: str) -> set[int]:
    require(isinstance(values, list), label + " must be a list")
    require(all(type(value) is int and value > 0 for value in values),
            label + " must contain positive integer passcodes")
    require(len(set(values)) == len(values), label + " contains duplicates")
    return set(values)


def build_audit(root: Path = ROOT) -> dict:
    manifest_bytes = (root / "src/data/catalog-manifest.json").read_bytes()
    manifest = json.loads(manifest_bytes)
    content = (root / "src/data/cards.json").read_bytes()
    require(digest(content) == manifest["cardsSha256"], "Catalogue SHA-256 mismatch")
    rows = json.loads(content)
    require(isinstance(rows, list) and all(isinstance(row, list) and len(row) >= 15
                                         for row in rows), "Invalid catalogue rows")
    catalogue_ids = unique_ids([row[0] for row in rows], "Catalogue")
    require(len(rows) == manifest["cardCount"], "Catalogue count mismatch")
    by_id = {row[0]: row for row in rows}
    legacy = manifest["unmatchedLegacyRows"]
    unresolved = unique_ids([row["id"] for row in legacy], "Unresolved IDs")
    require(unresolved <= catalogue_ids, "Unresolved ID absent from catalogue")
    require(len(unresolved) == manifest["unknownSourceCount"], "Unresolved count mismatch")
    sources = manifest["sources"]
    require(len(sources) == len(FILES) and {s["file"] for s in sources} == FILES,
            "Exactly the five pinned source files are required")
    checks, source_ids = [], set()
    for source in sorted(sources, key=lambda item: item["file"]):
        require(source["commit"] == manifest["sourceCommit"], "Source commit mismatch")
        path = root / ".cache/catalog" / (manifest["sourceCommit"] + "-" + source["file"])
        raw = path.read_bytes()  # A missing source is a failure, never a skipped check.
        require(digest(raw) == source["sha256"], "Source SHA-256 mismatch: " + source["file"])
        require(len(raw) == source["bytes"], "Source byte count mismatch: " + source["file"])
        with sqlite3.connect(path.resolve().as_uri() + "?mode=ro", uri=True) as db:
            require(db.execute("PRAGMA quick_check").fetchone()[0] == "ok",
                    "SQLite integrity failure: " + source["file"])
            ids = unique_ids([row[0] for row in db.execute("SELECT id FROM datas")],
                             source["file"])
            joined_count = db.execute("SELECT COUNT(*) FROM texts t JOIN datas d ON d.id=t.id").fetchone()[0]
            require(len(ids) == joined_count == source["records"],
                    "Source record count mismatch: " + source["file"])
        source_ids.update(ids)
        matches = sorted(unresolved & ids)
        checks.append({"file": source["file"], "url": source["url"],
                       "sourceCommit": source["commit"], "sha256": source["sha256"],
                       "bytes": len(raw), "records": len(ids), "sqliteQuickCheck": "ok",
                       "exactUnresolvedMatches": matches})
    actual_unresolved = catalogue_ids - source_ids
    require(actual_unresolved == unresolved, "Exact unresolved IDs disagree with pinned sources")
    require(len(catalogue_ids & source_ids) == manifest["matchedSourceCount"],
            "Matched catalogue count mismatch")
    unknown = unique_ids(manifest["unknownMonsterIds"], "Unknown-stat IDs")
    def finite(value):
        return type(value) in (int, float) and math.isfinite(value)
    actual_unknown = {row[0] for row in rows if row[3] & 1
                      and not all(finite(value) for value in row[8:11])}
    require(actual_unknown == unknown and len(unknown) == manifest["unknownMonsterCount"],
            "Unknown-stat IDs/count disagree with catalogue")
    require(unknown <= unresolved, "An unknown-stat ID exists in a pinned source; review required")
    # Reuse the established primary-SQLite oracle. Name matches remain candidate
    # IDs only; no value is copied from them into a legacy catalogue row.
    oracle = build_report(root)
    proposals = [row for row in oracle["rows"] if row["migrationCandidates"]]
    require((len(unresolved), len(unknown), len(proposals)) == (98, 51, 32),
            "The R21 review baseline changed; review the scope explicitly")
    entries = []
    for card_id in sorted(unresolved):
        row = by_id[card_id]
        classification, _ = category(row)
        prior = next(item for item in oracle["rows"] if item["id"] == card_id)
        fields = [("atk", row[8]),
                  ("linkMarkers" if row[3] & 0x4000000 else "def", row[9]),
                  ("packedLevel", row[10])]
        entries.append({"id": card_id, "name": row[1], "declaredLegacySource": row[6],
                        "classification": classification,
                        "absentByExactIdFromAllPinnedSources": True,
                        "unknownStatFields": [key for key, value in fields if not finite(value)]
                            if row[3] & 1 else [],
                        "candidateIdsForReviewOnly": [x["id"] for x in prior["migrationCandidates"]],
                        "resolution": "PRESERVED_UNRESOLVED_NO_FIELDS_REPLACED"})
    return {"schema": "ygo-unresolved-source-audit/v1", "pass": True,
            "scope": "OFFLINE_EXACT_ID_NEGATIVE_CHECK_OF_FIVE_PINNED_SECONDARY_CDB_SOURCES",
            "catalogueHash": manifest["cardsSha256"], "manifestSha256": digest(manifest_bytes),
            "sourceCommit": manifest["sourceCommit"], "cardCount": len(rows),
            "counts": {"sourceFilesChecked": len(checks), "unresolvedIds": len(unresolved),
                       "unknownMonsterStats": len(unknown), "migrationProposals": len(proposals),
                       "candidatePasscodes": sum(len(row["migrationCandidates"]) for row in proposals)},
            "classifications": dict(sorted(collections.Counter(x["classification"] for x in entries).items())),
            "unknownStatsByDeclaredSource": dict(sorted(collections.Counter(by_id[x][6] for x in unknown).items())),
            "allUnknownStatIdsAreUnresolved": True, "sourceChecks": checks, "rows": entries,
            "catalogueChanged": False, "deckChanged": False, "statisticsTransferredByName": False,
            "officialIdentityCertified": False, "officialAvailabilityVerified": False,
            "criteriaClosed": [], "competitiveScoreStatus": "PROVISIONAL_BY_USER_REQUEST",
            "limitations": [
                "Absence is proven only for exact IDs in the five pinned technical sources, not every database or official printing.",
                "The legacy source declarations are preserved; missing legacy source files are not authenticated by another CDB.",
                "Name candidates do not prove identity equivalence; unknown legacy statistics remain unknown.",
                "C27, C28 and C29 remain pending. No official card pools, Skills, unlocks or Legend rules are added."]}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist/unresolved-source-audit.json")
    args = parser.parse_args()
    report = build_audit()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"pass": True, "output": str(args.output), **report["counts"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
