#!/usr/bin/env python3
"""Refresh retained metadata and import the pinned primary BabelCDB catalogue.

Uses verified HTTPS and read-only SQLite. Existing passcodes and names are kept;
technical data and effect text are replaced only for a matching passcode. The
All passcodes in cards.cdb are included, including its alternative passcodes;
new unofficial, Rush and Skill records are not added automatically. The manifest
records source bytes, name changes, unsupported legacy rows, additions and pool
semantics. This is technical provenance, not an official Konami ruling audit.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
import sqlite3
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPOSITORY = "https://github.com/ProjectIgnis/BabelCDB.git"
FILES = ["cards.cdb", "cards-rush.cdb", "cards-skills.cdb",
         "cards-unofficial.cdb", "cards-skills-unofficial.cdb"]
RAW = "https://raw.githubusercontent.com/ProjectIgnis/BabelCDB/{commit}/{name}"
QUERY = """SELECT d.id,t.name,t.desc,d.type,d.attribute,d.race,d.atk,d.def,
                  d.level,d.setcode,d.ot,d.alias,d.category
           FROM datas d JOIN texts t ON t.id=d.id"""


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def norm(value: str) -> str:
    import unicodedata
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", value).lower())


def download(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "YGO-Catalog-Refresh/1"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--commit", help="Full 40-character BabelCDB commit; default: resolve master")
    parser.add_argument("--cache-dir", type=Path, default=ROOT / ".cache" / "catalog")
    parser.add_argument("--input", type=Path, default=ROOT / "src/data/cards.json")
    parser.add_argument("--output", type=Path, default=ROOT / "src/data/cards.json")
    parser.add_argument("--manifest", type=Path, default=ROOT / "src/data/catalog-manifest.json",
                        help="Read and replace this manifest; useful for isolated refreshes")
    parser.add_argument("--offline", action="store_true",
                        help="Require the pinned cache; never resolve a branch or download a source")
    args = parser.parse_args()
    commit = args.commit
    if not commit:
        if args.offline:
            parser.error("--offline requires a full --commit")
        result = subprocess.run(["git", "ls-remote", REPOSITORY, "refs/heads/master"],
                                check=True, capture_output=True, text=True)
        commit = result.stdout.split()[0]
    if not re.fullmatch(r"[a-f0-9]{40}", commit or ""):
        raise SystemExit("A full BabelCDB commit is required")
    fetched_at = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
    now_ms = int(fetched_at.timestamp() * 1000)
    original_bytes = args.input.read_bytes()
    rows = json.loads(original_bytes)
    if (not isinstance(rows, list) or
            any(not isinstance(row, list) or len(row) < 7 or
                not isinstance(row[0], int) or isinstance(row[0], bool) or row[0] <= 0
                for row in rows) or len({row[0] for row in rows}) != len(rows)):
        raise SystemExit("Input catalogue must have unique passcodes")
    previous_path = args.manifest
    previous = json.loads(previous_path.read_text()) if previous_path.exists() else {}
    # Idempotent refresh of the same immutable snapshot retains timestamps.
    if previous.get("sourceCommit") == commit:
        fetched_at = dt.datetime.fromisoformat(previous["retrievedAt"].replace("Z", "+00:00"))
        now_ms = int(fetched_at.timestamp() * 1000)
    sources, records, canonical_names = [], {}, {}
    expected_sources = {entry["file"]: entry["sha256"] for entry in previous.get("sources", [])}
    priority = {"cards.cdb": 100, "cards-rush.cdb": 90, "cards-skills.cdb": 80,
                "cards-unofficial.cdb": 30, "cards-skills-unofficial.cdb": 20}
    selected_priority = {}
    args.cache_dir.mkdir(parents=True, exist_ok=True)
    for filename in FILES:
        url = RAW.format(commit=commit, name=filename)
        path = args.cache_dir / (commit + "-" + filename)
        if path.exists():
            content = path.read_bytes()
            expected = expected_sources.get(filename) if previous.get("sourceCommit") == commit else None
            if expected and digest(content) != expected:
                if args.offline:
                    raise SystemExit("Pinned cache checksum mismatch: " + filename)
                content = download(url)
                if digest(content) != expected:
                    raise SystemExit("Pinned source no longer matches saved checksum: " + filename)
                path.write_bytes(content)
        else:
            if args.offline:
                raise SystemExit("Pinned cache is missing: " + filename)
            content = download(url)
            if not content.startswith(b"SQLite format 3\x00"):
                raise SystemExit("Invalid SQLite source: " + filename)
            path.write_bytes(content)
        with sqlite3.connect("file:" + str(path.resolve()) + "?mode=ro", uri=True) as connection:
            if connection.execute("PRAGMA quick_check").fetchone()[0] != "ok":
                raise SystemExit("SQLite integrity failed: " + filename)
            records_in_file = list(connection.execute(QUERY))
        sources.append({"file": filename, "url": url, "sha256": digest(content),
                        "bytes": len(content), "records": len(records_in_file),
                        "commit": commit, "authority": "SECONDARY_TECHNICAL_PROJECT_IGNIS"})
        for row in records_in_file:
            card_id = row[0]
            if priority[filename] <= selected_priority.get(card_id, -1):
                continue
            selected_priority[card_id] = priority[filename]
            records[card_id] = (row, filename)
            canonical_names[card_id] = row[1]

    missing, renamed, output = [], {}, []
    for old in rows:
        card_id, old_name = int(old[0]), old[1]
        found = records.get(card_id)
        if found:
            row, filename = found
            _, current_name, description, type_bits, attribute, race, atk, defense, level, setcode, ot, alias, category = row
            output.append([card_id, old_name, description, type_bits, attribute, now_ms, filename,
                           race, atk, defense, level, str(setcode), ot, alias, category])
            if current_name != old_name:
                renamed[str(card_id)] = {"canonicalName": current_name, "legacyNames": [old_name],
                                         "source": filename, "passcodeMatched": True}
        else:
            # Preserve the legacy row. Missing data are null, never invented zeroes.
            output.append((old + [None] * 15)[:15])
            missing.append({"id": card_id, "name": old_name, "source": old[6],
                            "reason": "PASSCODE_NOT_IN_PINNED_BABELCDB_SNAPSHOT"})

    # Diagnostic comparison only: the embedded list's official accuracy is not inferred.
    restricted_missing = []
    canonical_module = ROOT / "src/modules/085-ygo-alpha-1216-canonical-release.js"
    if canonical_module.exists():
        text = canonical_module.read_text()
        marker = "const KONAMI_TCG1125=Object.freeze("
        if marker in text:
            regulation, _ = json.JSONDecoder().raw_decode(text.split(marker, 1)[1])
            base_names = {norm(name) for row in output for name in [row[1], canonical_names.get(row[0], row[1])]}
            source_names = {}
            for card_id, (record, source) in records.items():
                if source == "cards.cdb":
                    source_names.setdefault(norm(record[1]), []).append({"id": card_id, "name": record[1]})
            for name in [name for value in regulation.values() for name in value]:
                if norm(name) not in base_names:
                    restricted_missing.append({"name": name,
                                               "sourceCandidates": source_names.get(norm(name), []),
                                               "status": "NOT_IN_RETAINED_CATALOGUE"})
    # Add only exact-name matches from the pinned official-card technical CDB.
    # The original catalogue remains intact; no fuzzy identity is accepted.
    retained_ids = {int(row[0]) for row in output}
    added_restricted = []
    for gap in restricted_missing:
        for candidate in gap["sourceCandidates"]:
            card_id = int(candidate["id"])
            if card_id in retained_ids:
                continue
            row, filename = records[card_id]
            _, name, description, type_bits, attribute, race, atk, defense, level, setcode, ot, alias, category = row
            output.append([card_id,name,description,type_bits,attribute,now_ms,filename,
                           race,atk,defense,level,str(setcode),ot,alias,category])
            retained_ids.add(card_id)
            added_restricted.append({"id":card_id,"name":name,"matchedRestrictedName":gap["name"],"source":filename})
    if added_restricted:
        present_names = {norm(name) for row in output for name in [row[1],canonical_names.get(row[0],row[1])]}
        restricted_missing = [gap for gap in restricted_missing if norm(gap["name"]) not in present_names]

    # Import every exact identity from the primary technical source. Other CDBs
    # may enrich retained identities but must not silently add custom/anime,
    # Rush or Skill assets to this expansion. Record additions, not migrations:
    # an old prerelease passcode and its possible successor remain separate.
    primary_records = {card_id: row for card_id, (row, filename) in records.items()
                       if filename == "cards.cdb"}
    expansion_baseline = previous.get("retainedBeforePrimaryExpansion") or {
        "cardCount": len(output),
        "orderedPasscodesSha256": digest(json.dumps([row[0] for row in output],
                                                   separators=(",", ":")).encode())}
    previous_additions = {int(entry["id"]): entry
                          for entry in previous.get("addedPrimarySourceMatches", [])}
    for card_id in sorted(primary_records):
        if card_id in retained_ids:
            continue
        row = primary_records[card_id]
        _, name, description, type_bits, attribute, race, atk, defense, level, setcode, ot, alias, category = row
        output.append([card_id, name, description, type_bits, attribute, now_ms, "cards.cdb",
                       race, atk, defense, level, str(setcode), ot, alias, category])
        retained_ids.add(card_id)
        previous_additions.setdefault(card_id, {"id": card_id, "name": name,
            "source": "cards.cdb", "firstSourceCommit": commit,
            "reason": "EXACT_PASSCODE_FROM_PINNED_PRIMARY_TECHNICAL_SOURCE"})
    primary_missing = sorted(set(primary_records) - retained_ids)
    unknown_monsters = [row[0] for row in output if (int(row[3]) & 1) and
                        not (isinstance(row[8], (int, float)) and isinstance(row[9], (int, float)))]
    alias_map = {str(row[0]): int(row[13]) for row in output if isinstance(row[13], int) and row[13] > 0}
    source_families = {}
    for row in output:
        source_families[row[6]] = source_families.get(row[6], 0) + 1
    encoded = json.dumps(output, ensure_ascii=False, separators=(",", ":")).encode()
    manifest = {
        "schemaVersion": 2,
        "rowSchema": ["id", "name", "desc", "typeBits", "attribute", "sourceUpdatedAt", "source",
                      "race", "atk", "def", "packedLevel", "setcode", "ot", "alias", "category"],
        "sourceRepository": REPOSITORY, "sourceCommit": commit,
        "retrievedAt": fetched_at.isoformat().replace("+00:00", "Z"),
        "cataloguePolicy": "RETAIN_ORIGINAL_PASSCODES_AND_INCLUDE_PINNED_PRIMARY_TECHNICAL_SOURCE",
        "cardCount": len(output), "matchedSourceCount": len(output) - len(missing),
        "unknownSourceCount": len(missing), "unknownMonsterCount": len(unknown_monsters),
        "unknownMonsterIds": unknown_monsters,
        "metadataAuthority": "SECONDARY_TECHNICAL_PROJECT_IGNIS_NOT_OFFICIAL_RULING_CERTIFICATION",
        "cardsSha256": digest(encoded), "sources": sources, "sourceFamilies": source_families,
        "canonicalNames": renamed, "aliases": alias_map,
        "unmatchedLegacyRows": missing, "restrictedNamesNotInRetainedCatalogue": restricted_missing,
        "addedRestrictedSourceMatches": added_restricted or previous.get("addedRestrictedSourceMatches", []),
        "retainedBeforePrimaryExpansion": expansion_baseline,
        "addedPrimarySourceMatches": [previous_additions[card_id] for card_id in sorted(previous_additions)],
        "primarySourceCoverage": {"source": "cards.cdb", "sourceCommit": commit,
            "recordCount": len(primary_records), "representedPasscodes": len(primary_records) - len(primary_missing),
            "missingPasscodes": primary_missing, "completeTechnicalSnapshot": not primary_missing,
            "officialAvailabilityVerified": False,
            "scope": "PINNED_SECONDARY_TECHNICAL_PASSCODES_INCLUDING_ALTERNATIVE_IDENTITIES"},
        "poolFlagSource": "https://raw.githubusercontent.com/edo9300/edopro/master/gframe/data_manager.h",
        "poolFlags": {"OCG": 1, "TCG": 2, "ANIME": 4, "ILLEGAL": 8, "VIDEO_GAME": 16,
                      "CUSTOM": 32, "SPEED": 64, "PRERELEASE": 256, "RUSH": 512,
                      "LEGEND": 1024, "HIDDEN": 4096},
        "limitations": ["A technical database source is not a Konami identity or ruling certification.",
                        "No release dates or digital card pools are invented.",
                        "Legacy passcodes absent from the immutable source snapshot remain unsupported.",
                        "All primary-source passcodes are included; this does not certify release availability or implemented card effects.",
                        "Alternative passcodes are not a count of distinct card names or alias families.",
                        "New unofficial, Rush and Skill identities are not imported automatically."]
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(encoded)
    previous_path.parent.mkdir(parents=True, exist_ok=True)
    previous_path.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")))
    print(json.dumps({"cardCount": len(output), "sourceMatched": len(output) - len(missing),
                      "unknownMonsters": len(unknown_monsters), "aliases": len(alias_map),
                      "canonicalNameChanges": len(renamed), "restrictedMissing": len(restricted_missing),
                      "primarySourceRecords": len(primary_records), "primarySourceMissing": len(primary_missing),
                      "primarySourceAdded": len(previous_additions),
                      "commit": commit, "sha256": manifest["cardsSha256"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
