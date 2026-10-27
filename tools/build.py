#!/usr/bin/env python3
"""Build the standalone HTML from auditable source, data and SHA-256 manifest."""
from pathlib import Path
import base64
import gzip
import hashlib
import importlib.util
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def digest(data):
    return hashlib.sha256(data).hexdigest()


def packed(value):
    raw = json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode()
    return base64.b64encode(gzip.compress(raw, compresslevel=9, mtime=0)).decode()


def js_json(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def official_context(root=ROOT):
    """Recheck saved bytes and table; never reauthenticate a saved receipt."""
    path = root / 'src/data/official-context-verification.json'
    if not path.exists():
        return None
    saved = json.loads(path.read_text())
    if saved.get('schema') != 'ygo-official-context-verification/v1' or saved.get('pass') is not True:
        raise ValueError('Invalid saved official comparison')
    if (saved.get('scope') != 'DATED_TCG_RESTRICTION_NAMES_LIMITS_AND_DATE_ONLY'
            or saved.get('format') != 'tcg' or saved.get('tableEquivalent') is not True):
        raise ValueError('Invalid scope of saved official comparison')
    for flag in ['currentListProven', 'officialPoolVerified', 'officialRulingsVerified',
                 'officialPasscodesVerified', 'competitiveCertified']:
        if saved.get(flag) is not False:
            raise ValueError('The dated restriction comparison cannot certify ' + flag)
    data_root = (root / 'src/data/official').resolve()
    paths = []
    for key in ['documentPath', 'receiptPath']:
        target = (root / saved[key]).resolve()
        if not target.is_relative_to(data_root):
            raise ValueError('Saved official evidence must remain in its source directory')
        paths.append(target)
    document, receipt = paths[0].read_bytes(), json.loads(paths[1].read_text())
    if digest(document) != saved['documentSha256']:
        raise ValueError('Saved official document hash mismatch')
    specification = importlib.util.spec_from_file_location('ygo_build_official_comparison', ROOT / 'tools/verify_official.py')
    verifier = importlib.util.module_from_spec(specification)
    specification.loader.exec_module(verifier)
    snapshot = verifier.embedded_snapshot(root)
    if snapshot['sha256'] != saved['embeddedTableSha256']:
        raise ValueError('The embedded restriction table changed after comparison')
    comparison = verifier.review_document(document, receipt, snapshot, as_of=saved['asOfDate'])
    if (comparison['pass'] is not True or comparison['documentEffectiveDate'] != saved['effectiveDate']
            or comparison['sourceUrl'] != saved['sourceUrl']
            or comparison['documentCounts'] != saved['restrictionCounts']):
        raise ValueError('Saved official comparison no longer matches its evidence')
    return {**saved, 'storedBytesRecheckedAtBuild': True,
            'retrievalAuthenticatedInThisBuild': False}


def rule_references(root=ROOT):
    """Validate fixed documentary references while preserving their jurisdiction."""
    if not (root / 'src/data/mechaba-ruling-references.json').exists():
        return None
    specification = importlib.util.spec_from_file_location('ygo_build_rule_references', ROOT / 'tools/mechaba_references.py')
    verifier = importlib.util.module_from_spec(specification)
    specification.loader.exec_module(verifier)
    saved = verifier.load_references(root)
    return {**saved, 'storedBytesRecheckedAtBuild': True,
            'retrievalAuthenticatedInThisBuild': False}


def build():
    manifest = json.loads((ROOT / "manifest.json").read_text())
    cards_bytes = (ROOT / "src/data/cards.json").read_bytes()
    cards = json.loads(cards_bytes)
    source_names = [row["path"] for row in manifest["modules"]] + [f"src/scripts/script-{number:02d}.js" for number in manifest["scripts"]]
    count_compilation = subprocess.run(
        ["node", str(ROOT / "tools/catalog_counts.cjs")],
        input=json.dumps({"count": len(cards), "sources": {name: (ROOT / name).read_text() for name in source_names}}),
        text=True, capture_output=True, check=True,
    )
    compiled = json.loads(count_compilation.stdout)
    chunks = []
    for row in manifest["modules"]:
        chunks.append({"id": row["id"], "order": row["order"], "code": compiled["sources"][row["path"]]})
    assert len({c["id"] for c in chunks}) == len(chunks), "Duplicate module identity"
    integrity = {
        "canonicalId": manifest["canonicalId"],
        "algorithm": "SHA-256", "chunkCount": len(chunks),
        "sha256": {c["id"]: digest(c["code"].encode()) for c in chunks},
    }
    bundle = {"version": manifest["version"], "format": manifest["format"], "chunks": chunks, "integrity": integrity}
    source_files = [ROOT / "manifest.json"] + sorted((ROOT / "tools").rglob("*")) + sorted((ROOT / "src").rglob("*"))
    source_hash = hashlib.sha256()
    for path in source_files:
        if path.is_file() and "__pycache__" not in path.parts:
            source_hash.update(str(path.relative_to(ROOT)).encode() + b"\0" + path.read_bytes() + b"\0")
    catalog_path = ROOT / "src/data/catalog-manifest.json"
    catalog_manifest = json.loads(catalog_path.read_text()) if catalog_path.exists() else {"cardCount": len(cards), "enrichmentStatus": "PENDING"}
    verification = official_context()
    references = rule_references()
    build_manifest = {
        "version": manifest["version"], "revision": manifest["revision"],
        "canonicalId": manifest["canonicalId"], "moduleCount": len(chunks),
        "catalogCardCount": len(cards), "buildId": source_hash.hexdigest(),
        "catalogueSizePinsCompiled": sum(compiled["replacements"].values()),
        "dataHashes": {"cards": digest(cards_bytes)},
        "catalogSha256": digest(cards_bytes), "dataVersion": digest(cards_bytes),
        "scope": {"primaryFormat": "TCG", "ranking": "STRUCTURAL_PROVISIONAL", "search": "DECLARED_BOUNDED_SCOPE", "universalCertified": False},
        "officialContextVerification": verification,
        "ruleReferences": references,
    }
    html = (ROOT / "src/template.html").read_text()
    for number in manifest["scripts"]:
        html = html.replace(f"@@SCRIPT_{number:02d}@@", compiled["sources"][f"src/scripts/script-{number:02d}.js"])
    html = html.replace("@@SCRIPT_03@@", packed(cards)).replace("@@SCRIPT_05@@", packed(bundle))
    header = "window.YGO_BUILD_MANIFEST=" + js_json(build_manifest) + ";\nwindow.YGO_CATALOG_MANIFEST=" + js_json(catalog_manifest) + ";\nwindow.YGO_OFFICIAL_CONTEXT_VERIFICATION=" + js_json(verification) + ";\nwindow.YGO_RULE_REFERENCES=" + js_json(references) + ";"
    html = html.replace("@@BUILD_MANIFEST@@", header)
    extensions = []
    for path in manifest["extensions"]:
        content = (ROOT / path).read_text()
        if re.search(r"</script\s*>", content, re.I):
            raise ValueError(f"Unsafe inline script terminator in {path}")
        extensions.append(f'<script data-ygo-stable-module="{Path(path).stem}">\n{content}\n</script>')
    html = html.replace("@@APP_EXTENSIONS@@", "\n".join(extensions))
    if re.search(r"@@[A-Z_0-9]+@@", html):
        raise ValueError("Unresolved build token")
    output = ROOT / manifest["output"]
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(".html.tmp")
    temporary.write_text(html)
    temporary.replace(output)
    report = {**build_manifest, "htmlSha256": digest(output.read_bytes()), "bytes": output.stat().st_size, "output": str(output.relative_to(ROOT))}
    (output.parent / "build-manifest.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps(report, ensure_ascii=False))
    return report


if __name__ == "__main__":
    build()
