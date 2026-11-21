#!/usr/bin/env python3
"""Review exact-passcode SQLite evidence, then explicitly produce a detached copy.

No network requests, passcode migrations, name joins or writes to the shipped
catalogue are performed. A local source hash verifies bytes, not publication
authority. Keep the original CDB and its acquisition receipt with the package.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import re
import sqlite3
import tempfile
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[4]
SCHEMA = "ygo-exact-id-data-review/v1"
LIMIT = 32 * 1024 * 1024
FIELDS = ((8, "atk"), (9, "defOrLinkMarkers"), (10, "packedLevel"))


def require(condition, message):
    if not condition:
        raise ValueError(message)


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result and key not in {"__proto__", "constructor", "prototype"},
                "DUPLICATE_OR_RESERVED_JSON_KEY")
        result[key] = value
    return result


def parse(raw):
    require(len(raw) <= LIMIT, "TRANSPORT_TOO_LARGE")
    return json.loads(raw, object_pairs_hook=unique_object,
                      parse_constant=lambda _: (_ for _ in ()).throw(ValueError("NONFINITE_JSON")))


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def integer(value):
    return type(value) is int


def finite(value):
    return type(value) in (int, float) and math.isfinite(value)


def validate_provenance(provenance):
    require(set(provenance) == {"sha256", "url", "revision", "reviewer", "reason"}, "SOURCE_PROVENANCE_FIELDS")
    require(re.fullmatch(r"[a-f0-9]{64}", provenance["sha256"] or ""), "SOURCE_SHA256_REQUIRED")
    url = urlsplit(provenance["url"])
    require(url.scheme == "https" and url.hostname and not url.username and not url.password
            and len(provenance["url"]) <= 2048 and not any(c.isspace() for c in provenance["url"]), "SOURCE_HTTPS_URL_REQUIRED")
    for key, minimum, maximum in (("revision", 1, 240), ("reviewer", 1, 120), ("reason", 10, 4000)):
        value = provenance[key]
        require(isinstance(value, str) and minimum <= len(value.strip()) <= maximum and value == value.strip(), "SOURCE_REVIEW_TEXT_INVALID:" + key)


def build_review(catalogue, manifest_file, source_file, provenance):
    validate_provenance(provenance)
    raw = catalogue.read_bytes()
    manifest_raw = manifest_file.read_bytes()
    manifest, rows = parse(manifest_raw), parse(raw)
    require(digest(raw) == manifest["cardsSha256"], "ORIGINAL_CATALOGUE_SHA256_MISMATCH")
    require(isinstance(rows, list) and len(rows) == manifest["cardCount"], "ORIGINAL_CATALOGUE_COUNT_MISMATCH")
    require(all(isinstance(row, list) and len(row) >= 15 and integer(row[0]) and row[0] > 0 for row in rows), "ORIGINAL_ROW_INVALID")
    by_id = {row[0]: row for row in rows}
    require(len(by_id) == len(rows), "ORIGINAL_DUPLICATE_ID")
    unresolved = sorted(row["id"] for row in manifest["unmatchedLegacyRows"])
    require(len(unresolved) == len(set(unresolved)) and all(integer(i) and i in by_id for i in unresolved), "ORIGINAL_UNRESOLVED_IDS_INVALID")
    source_raw = source_file.read_bytes()
    require(len(source_raw) <= LIMIT and digest(source_raw) == provenance["sha256"], "SOURCE_BYTES_SHA256_MISMATCH")
    require(source_raw.startswith(b"SQLite format 3\0"), "SQLITE_SOURCE_REQUIRED")
    matches = {}
    # Query the very bytes just hashed. Reopening a mutable pathname after
    # hashing would permit a source replacement between verification and SQL.
    with sqlite3.connect(":memory:") as db:
        db.deserialize(source_raw)
        db.execute("PRAGMA query_only=ON")
        db.execute("PRAGMA trusted_schema=OFF")
        require(db.execute("PRAGMA quick_check").fetchall() == [("ok",)], "SQLITE_INTEGRITY_FAILURE")
        # Fixed query only. No source SQL, triggers, extensions or writable DB.
        records = db.execute("SELECT d.id,t.name,d.type,d.atk,d.def,d.level FROM datas d JOIN texts t ON t.id=d.id").fetchall()
        seen = set()
        for card_id, name, bits, atk, defense, packed in records:
            require(integer(card_id) and card_id > 0 and card_id not in seen, "SOURCE_ID_INVALID_OR_DUPLICATE")
            seen.add(card_id)
            require(isinstance(name, str) and bool(name.strip()) and integer(bits) and bits > 0, "SOURCE_RECORD_INVALID")
            if card_id in unresolved:
                matches[card_id] = {"id": card_id, "name": name, "typeBits": bits, "atk": atk, "defOrLinkMarkers": defense, "packedLevel": packed}
    incidents, patches = [], []
    for card_id in unresolved:
        original = by_id[card_id]
        evidence = matches.get(card_id)
        missing = [name for index, name in FIELDS if original[3] & 1 and not finite(original[index])]
        record = {"id": card_id, "originalName": original[1], "originalSource": original[6], "missingFields": missing,
                  "sourceRecord": evidence, "disposition": "NO_EXACT_ID_SOURCE_RECORD"}
        if evidence:
            record["disposition"] = "EXACT_ID_RECORD_REQUIRES_PRIMARY_IDENTITY_REVIEW"
            if evidence["typeBits"] != original[3]:
                record["disposition"] = "TYPE_CONFLICT_PRESERVE_ORIGINAL"
            elif original[3] & 1:
                conflicts = [name for index, name in FIELDS if finite(original[index]) and evidence[name] is not None and original[index] != evidence[name]]
                if conflicts:
                    record.update(disposition="KNOWN_VALUE_CONFLICT_PRESERVE_ORIGINAL", conflictingFields=conflicts)
                else:
                    for index, name in FIELDS:
                        value = evidence[name]
                        # -2 / -1 are retained technical markers, zero is a
                        # known value. SQL NULL never becomes a numerical zero.
                        maximum = 0xffffffff if index == 10 else 0x7fffffff
                        minimum = 0 if index == 10 or index == 9 and original[3] & 0x4000000 else -2
                        if name in missing and integer(value) and minimum <= value <= maximum:
                            patches.append({"id": card_id, "field": name, "column": index, "before": original[index], "after": value,
                                            "sourcePasscode": card_id, "sourceSha256": provenance["sha256"]})
        incidents.append(record)
    body = {"schema": SCHEMA, "binding": {"catalogueSha256": digest(raw), "manifestSha256": digest(manifest_raw), "sourceCommit": manifest["sourceCommit"], "cardCount": len(rows)},
            "source": {**provenance, "bytes": len(source_raw), "records": len(records), "sqliteQuickCheck": "ok",
                       "role": "LOCAL_EXACT_ID_SECONDARY_TECHNICAL_CDB", "urlAuthenticatedByThisCommand": False},
            "records": incidents, "patches": patches,
            "counts": {"unresolvedIdentities": len(unresolved), "exactSourceMatches": len(matches), "fieldsSupportedForDetachedCopy": len(patches)},
            "policy": "EXACT_PASSCODE_SAME_TYPE_MISSING_STATS_ONLY_DETACHED_COPY", "originalCatalogueChanged": False,
            "activeDeckChanged": False, "officialIdentityCertified": False, "officialAvailabilityVerified": False, "criteriaClosed": []}
    return {**body, "reviewFingerprint": digest(canonical(body))}, rows


def atomic_new_json(path, value, protected):
    target = path.resolve()
    require(target not in {p.resolve() for p in protected}, "ORIGINAL_OR_SOURCE_OUTPUT_FORBIDDEN")
    # Prevent an evidence copy from silently replacing any application input.
    require(not target.is_relative_to(ROOT / "src"), "OUTPUT_MUST_BE_OUTSIDE_APPLICATION_SOURCE")
    require(not target.exists(), "OUTPUT_ALREADY_EXISTS")
    target.parent.mkdir(parents=True, exist_ok=True)
    handle, temporary = tempfile.mkstemp(prefix=".reviewed-data-", dir=target.parent)
    try:
        with os.fdopen(handle, "wb") as stream:
            stream.write(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False).encode() + b"\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.link(temporary, target)  # Atomic, never overwrite a concurrent file.
    finally:
        Path(temporary).unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ("prepare", "apply-copy"):
        sub = commands.add_parser(name)
        sub.add_argument("--catalogue", type=Path, default=ROOT / "src/data/cards.json")
        sub.add_argument("--manifest", type=Path, default=ROOT / "src/data/catalog-manifest.json")
        sub.add_argument("--source", type=Path, required=True)
        sub.add_argument("--output", type=Path, required=True)
        if name == "prepare":
            for flag in ("sha256", "url", "revision", "reviewer", "reason"):
                sub.add_argument("--" + flag, required=True)
        else:
            sub.add_argument("--review", type=Path, required=True)
            sub.add_argument("--accept-review", required=True)
    args = parser.parse_args()
    protected = [args.catalogue, args.manifest, args.source]
    if args.command == "prepare":
        provenance = {key: getattr(args, key) for key in ("sha256", "url", "revision", "reviewer", "reason")}
        review, _ = build_review(args.catalogue, args.manifest, args.source, provenance)
        atomic_new_json(args.output, review, protected)
        print(json.dumps({"pass": True, "status": "REVIEW_PREPARED_NO_CHANGES_APPLIED", "reviewFingerprint": review["reviewFingerprint"], "counts": review["counts"]}))
    else:
        imported = parse(args.review.read_bytes())
        require(imported.get("schema") == SCHEMA, "REVIEW_SCHEMA_INVALID")
        provenance = {key: imported["source"][key] for key in ("sha256", "url", "revision", "reviewer", "reason")}
        expected, rows = build_review(args.catalogue, args.manifest, args.source, provenance)
        require(canonical(imported) == canonical(expected), "REVIEW_CONTENT_OR_BINDING_MISMATCH")
        require(args.accept_review == expected["reviewFingerprint"], "EXPLICIT_REVIEW_FINGERPRINT_REQUIRED")
        require(expected["patches"], "EMPTY_REVIEW_NO_SUPPORTED_CHANGES")
        by_id = {row[0]: row for row in rows}
        for patch in expected["patches"]:
            by_id[patch["id"]][patch["column"]] = patch["after"]
        value = {"schema": "ygo-reviewed-catalogue-copy/v1", "cards": rows, "sourceReview": expected,
                 "scope": "DETACHED_REVIEWED_TECHNICAL_DATA_COPY_REQUIRES_RELEASE_REVIEW", "fieldsAppliedToCopy": len(expected["patches"]),
                 "originalCatalogueChanged": False, "activeDeckChanged": False, "officialIdentityCertified": False, "criteriaClosed": []}
        atomic_new_json(args.output, value, protected + [args.review])
        print(json.dumps({"pass": True, "status": "DETACHED_COPY_CREATED", "fieldsAppliedToCopy": len(expected["patches"]), "originalCatalogueChanged": False, "activeDeckChanged": False}))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, TypeError, OSError, sqlite3.Error) as error:
        raise SystemExit(str(error))
