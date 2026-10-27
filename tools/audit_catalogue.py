#!/usr/bin/env python3
"""Audit primary-source coverage and preserved legacy IDs without rewriting them.

The optional HTTPS capture records retrieved bytes and TLS checks. It does not
equate a declared URL, a matching name, or a transport receipt with official
passcode identity or universal ruling certification.
"""
from __future__ import annotations

import argparse
import collections
import datetime as dt
import hashlib
import json
import re
import sqlite3
import ssl
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OFFICIAL_HOSTS = {"db.yugioh-card.com", "www.db.yugioh-card.com", "yugioh-card.com", "www.yugioh-card.com", "konami.com", "www.konami.com"}


def digest(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", value).lower())


def category(row: list) -> tuple[str, str]:
    source, bits, name = str(row[6]), int(row[3]), str(row[1])
    if bits & 0x4000:
        return "NON_DECK_TOKEN_OR_PLACEHOLDER", "A generated Token or database placeholder is not an unresolved deck card."
    if re.search(r"deckmaster|placeholder", source + " " + name, re.I):
        return "NONSTANDARD_DATABASE_ASSET", "Special database asset outside the ordinary TCG/OCG deck pool."
    if "unofficial" in source.lower():
        return "EXCLUDED_UNOFFICIAL_LEGACY", "The preserved source explicitly identifies unofficial/anime/custom content."
    if "skills" in source.lower():
        return "SEPARATE_SKILL_ASSET", "Requires a separate Skill/format engine."
    if "prerelease" in source.lower():
        return "OBSOLETE_PRERELEASE_PASSCODE_REVIEW", "A temporary prerelease ID must not be silently replaced by a later printed passcode."
    return "PRIMARY_SOURCE_IDENTITY_REVIEW", "A standard source ID lacks a pinned exact-passcode match."


def build_report(root: Path = ROOT) -> dict:
    manifest = json.loads((root / "src/data/catalog-manifest.json").read_text())
    raw = (root / "src/data/cards.json").read_bytes()
    if digest(raw) != manifest["cardsSha256"]:
        raise ValueError("The catalogue does not match its saved manifest")
    by_id = {int(row[0]): row for row in json.loads(raw)}
    candidates: dict[str, list] = collections.defaultdict(list)
    cache_checks = []
    primary_records = None
    for source in manifest["sources"]:
        if source["file"] != "cards.cdb":
            continue
        path = root / ".cache/catalog" / (manifest["sourceCommit"] + "-" + source["file"])
        if not path.exists():
            cache_checks.append({"file": source["file"], "status": "CACHE_NOT_PRESENT", "sourceHash": source["sha256"]})
            continue
        content = path.read_bytes()
        if digest(content) != source["sha256"]:
            raise ValueError("Pinned CDB checksum mismatch: " + source["file"])
        with sqlite3.connect("file:" + str(path.resolve()) + "?mode=ro", uri=True) as connection:
            if connection.execute("PRAGMA quick_check").fetchone()[0] != "ok":
                raise ValueError("Invalid cached CDB: " + source["file"])
            primary_records = list(connection.execute(
                "SELECT t.id,t.name,d.ot,d.alias,d.type FROM texts t JOIN datas d ON d.id=t.id"))
            for card_id, name, ot, alias, type_bits in primary_records:
                candidates[normalize(name)].append({"id": card_id, "name": name, "ot": ot,
                    "source": source["file"], "sourceSha256": source["sha256"],
                    "sourceCommit": source["commit"], "alreadyInCatalogue": card_id in by_id})
        cache_checks.append({"file": source["file"], "status": "SHA256_AND_SQLITE_PASS", "sourceHash": source["sha256"]})

    rows = []
    unknown_monsters = set(manifest["unknownMonsterIds"])
    for missing in manifest["unmatchedLegacyRows"]:
        row = by_id[int(missing["id"])]
        classification, reason = category(row)
        exact = [candidate for candidate in candidates.get(normalize(row[1]), []) if candidate["id"] != row[0]]
        rows.append({**missing, "classification": classification, "classificationReason": reason,
            "typeBits": row[3], "monsterStatsUnknown": row[0] in unknown_monsters,
            "ordinaryTcgIdentityReady": False, "migrationCandidates": exact,
            "migrationPolicy": "EXACT_NORMALIZED_NAME_CANDIDATE_ONLY_NO_PASSCODE_REWRITE",
            "preserved": True})
    counts = dict(collections.Counter(row["classification"] for row in rows))
    standard_review = [row for row in rows if row["classification"] == "PRIMARY_SOURCE_IDENTITY_REVIEW"]
    prerelease_review = [row for row in rows if row["classification"] == "OBSOLETE_PRERELEASE_PASSCODE_REVIEW"]
    primary_missing = (None if primary_records is None else
                       sorted(card_id for card_id, *_ in primary_records if card_id not in by_id))
    primary_coverage = {"source": "cards.cdb", "sourceCommit": manifest["sourceCommit"],
        "checkedAgainstCachedSource": primary_records is not None,
        "sourceRecordCount": None if primary_records is None else len(primary_records),
        "representedPasscodes": None if primary_records is None else len(primary_records) - len(primary_missing),
        "missingPasscodes": primary_missing,
        "completeTechnicalSnapshot": primary_records is not None and not primary_missing,
        "officialAvailabilityVerified": False,
        "scope": "PINNED_SECONDARY_TECHNICAL_PASSCODES_INCLUDING_ALTERNATIVE_IDENTITIES"}
    return {"schema": "ygo-catalogue-hygiene/v1", "catalogueHash": manifest["cardsSha256"],
        "sourceCommit": manifest["sourceCommit"], "cardCount": manifest["cardCount"],
        "unmatchedCount": len(rows), "unknownMonsterCount": len(unknown_monsters),
        "classifications": counts, "unknownMonsterByClassification": dict(collections.Counter(row["classification"] for row in rows if row["monsterStatsUnknown"])),
        "primaryStandardUnmatchedCount": len(standard_review),
        "prereleaseIdentityReviewCount": len(prerelease_review),
        "exactNameMigrationCandidates": sum(bool(row["migrationCandidates"]) for row in rows),
        "cacheChecks": cache_checks, "primarySourceCoverage": primary_coverage, "rows": rows,
        "limitations": ["Name candidates do not prove passcode equivalence or release availability.",
            "Excluding unofficial assets does not complete the game-rules engine.",
            "Zero unmatched retained primary IDs does not establish that every primary-source identity is present.",
            "Full technical snapshot coverage does not establish official release availability or implemented effects.",
            "A technical CDB source is not an official ruling authority."],
        "officialIdentityCertified": False, "universalCertified": False}


def capture_official(url: str, card_id: int, output: Path, root: Path = ROOT) -> dict:
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != "https" or parsed.hostname not in OFFICIAL_HOSTS or parsed.username or parsed.password:
        raise ValueError("A direct official HTTPS URL without user information is required")
    if parsed.hostname.endswith("konami.com") and not parsed.path.startswith("/yugioh"):
        raise ValueError("Use an official Yu-Gi-Oh path")
    manifest = json.loads((root / "src/data/catalog-manifest.json").read_text())
    rows = json.loads((root / "src/data/cards.json").read_text())
    if not any(row[0] == card_id for row in rows):
        raise ValueError("Card ID is not present in the current catalogue")
    request = urllib.request.Request(url, headers={"User-Agent": "YGO-Official-Evidence-Capture/1"})
    with urllib.request.urlopen(request, context=ssl.create_default_context(), timeout=30) as response:
        final_url = response.geturl()
        final = urllib.parse.urlsplit(final_url)
        if final.scheme != "https" or final.hostname not in OFFICIAL_HOSTS:
            raise ValueError("Redirect left the official HTTPS authorities")
        if response.status != 200:
            raise ValueError("Official source returned HTTP " + str(response.status))
        content = response.read(8 * 1024 * 1024 + 1)
        if len(content) > 8 * 1024 * 1024:
            raise ValueError("Official evidence exceeds 8 MiB")
        charset = response.headers.get_content_charset() or "utf-8"
        text = content.decode(charset, errors="strict")
        content_type = response.headers.get_content_type()
    artifact = {"schema": "ygo-provenance-evidence/v1", "catalogueHash": manifest["cardsSha256"],
        "cardId": card_id, "authorityUrl": final_url,
        "document": {"content": text, "sha256": digest(text.encode()), "contentType": content_type,
            "originalBytesSha256": digest(content)},
        "reviewedAt": None, "reviewer": {"name": "", "method": "OFFICIAL_DOCUMENT_FIELD_REVIEW"},
        "fields": {}, "retrieval": {"method": "HTTPS_TLS_VALIDATED", "requestedUrl": url,
            "finalUrl": final_url, "retrievedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
            "documentSha256": digest(text.encode()), "transportVerifiedBy": "tools/audit_catalogue.py"},
        "status": "RETRIEVED_REQUIRES_FIELD_REVIEW", "independentlyVerified": False,
        "limitations": ["TLS retrieval and document hash do not prove which passcode or fields the document identifies.",
            "Fill field witnesses and reviewer/date before importing. The browser does not authenticate an external receipt."]}
    output.write_text(json.dumps(artifact, ensure_ascii=False, indent=2))
    return artifact


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist/catalogue-audit.json")
    parser.add_argument("--capture-official", help="Optional direct official HTTPS document URL")
    parser.add_argument("--card-id", type=int)
    args = parser.parse_args()
    if args.capture_official:
        if not args.card_id:
            parser.error("--card-id is required with --capture-official")
        value = capture_official(args.capture_official, args.card_id, args.output)
        print(json.dumps({"output": str(args.output), "status": value["status"]}))
        return
    report = build_report()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({key: report[key] for key in ["unmatchedCount", "classifications", "unknownMonsterByClassification", "primaryStandardUnmatchedCount", "prereleaseIdentityReviewCount", "exactNameMigrationCandidates", "primarySourceCoverage"]}))


if __name__ == "__main__":
    main()
