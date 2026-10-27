#!/usr/bin/env python3
"""Capture official HTTPS documents and compare a dated restriction snapshot.

A URL, an external transport receipt, or matching counts never authenticates a
local document. This tool does not mutate card data, lists, pools or rulings.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import ssl
import subprocess
import tempfile
import unicodedata
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
MAX_BYTES = 8 * 1024 * 1024
HOSTS = {"db.yugioh-card.com", "www.db.yugioh-card.com", "yugioh-card.com",
         "www.yugioh-card.com", "img.yugioh-card.com", "konami.com", "www.konami.com"}
PROBE_URLS = [
    "https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?request_locale=en",
    "https://www.yugioh-card.com/en/limited/",
    "https://www.yugioh-card.com/en/downloads/rulebook/SD_RuleBook_EN_10.pdf",
]
STATUS = {"forbidden": 0, "prohibited": 0, "prohibida": 0,
          "limited": 1, "limitada": 1, "semi-limited": 2,
          "semi limited": 2, "semilimitada": 2, "unlimited": 3,
          "not limited": 3, "sin limite": 3}


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def timestamp() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat()


def normalized(value: object) -> str:
    """Keep meaningful punctuation and symbols, unlike fuzzy name matching."""
    text = unicodedata.normalize("NFKC", str(value)).casefold()
    text = text.translate(str.maketrans({"’": "'", "‘": "'", "“": '"', "”": '"'}))
    return re.sub(r"\s+", " ", text).strip()


def valid_url(url: str) -> str:
    parsed = urllib.parse.urlsplit(url)
    if (parsed.scheme != "https" or parsed.hostname not in HOSTS
            or parsed.username or parsed.password or parsed.port not in [None, 443]
            or parsed.fragment):
        raise ValueError("OFFICIAL_HTTPS_URL_REQUIRED")
    if parsed.hostname in {"konami.com", "www.konami.com"} and not parsed.path.startswith("/yugioh/"):
        raise ValueError("OFFICIAL_YUGIOH_PATH_REQUIRED")
    if parsed.hostname == "img.yugioh-card.com" and not parsed.path.startswith("/en/downloads/"):
        raise ValueError("OFFICIAL_ASSET_DOWNLOAD_PATH_REQUIRED")
    return url


class OfficialRedirects(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        valid_url(newurl)  # Validate before any redirected request is sent.
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch(url: str) -> tuple[bytes, dict]:
    valid_url(url)
    opener = urllib.request.build_opener(
        urllib.request.HTTPSHandler(context=ssl.create_default_context()), OfficialRedirects())
    request = urllib.request.Request(url, headers={"User-Agent": "YGO-Official-Snapshot-Review/1"})
    with opener.open(request, timeout=20) as response:
        valid_url(response.geturl())
        if response.status != 200:
            raise ValueError("HTTP_STATUS_" + str(response.status))
        data = response.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise ValueError("DOCUMENT_EXCEEDS_8_MIB")
        receipt = {"requestedUrl": url, "sourceUrl": response.geturl(),
                   "retrievedAt": timestamp(), "contentType": response.headers.get_content_type(),
                   "charset": response.headers.get_content_charset() or "utf-8",
                   "sha256": sha(data), "bytes": len(data),
                   "transport": "DIRECT_HTTPS_TLS_VALIDATED_IN_THIS_PROCESS"}
    return data, receipt


class Tables(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows = []
        self.visible = []
        self.row = None
        self.cell = None
        self.hidden = 0

    def handle_starttag(self, tag, attrs):
        if tag in ["script", "style"]:
            self.hidden += 1
        if self.hidden:
            return
        if tag == "tr":
            self.row = []
        elif tag in ["td", "th"] and self.row is not None:
            self.cell = []
        elif tag in ["br", "p", "div", "section", "h1", "h2", "h3"]:
            self.visible.append(" ")
            if self.cell is not None:
                self.cell.append(" ")

    def handle_endtag(self, tag):
        if tag in ["script", "style"] and self.hidden:
            self.hidden -= 1
            return
        if self.hidden:
            return
        if tag in ["td", "th"] and self.cell is not None and self.row is not None:
            self.row.append(re.sub(r"\s+", " ", "".join(self.cell)).strip())
            self.cell = None
        elif tag == "tr" and self.row is not None:
            self.rows.append(self.row)
            self.row = None
        if tag in ["tr", "p", "div", "section", "h1", "h2", "h3"]:
            self.visible.append(" ")

    def handle_data(self, data):
        if not self.hidden:
            self.visible.append(data)
            if self.cell is not None:
                self.cell.append(data)


class NeuronSections(HTMLParser):
    """Read the current Neuron list's explicit sections without running scripts.

    Counts and dates are checked inside each section; status-update decorations
    are never interpreted as a card's current restriction.
    """
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
            "meta", "param", "source", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {"tag": "root", "attrs": {}, "children": [], "closed": True}
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = {"tag": tag, "attrs": dict(attrs), "children": [], "closed": tag in self.VOID}
        self.stack[-1]["children"].append(node)
        if tag not in self.VOID:
            if len(self.stack) >= 256:
                raise ValueError("DOCUMENT_NESTING_EXCEEDS_LIMIT")
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index]["tag"] == tag:
                self.stack[index]["closed"] = True
                self.stack = self.stack[:index]
                break

    def handle_data(self, data):
        if not any(node["tag"] in {"script", "style"} for node in self.stack):
            self.stack[-1]["children"].append(data)


def descendants(node):
    for child in node["children"]:
        if isinstance(child, dict):
            yield child
            yield from descendants(child)


def node_text(node):
    if isinstance(node, str):
        return node
    if node["tag"] in {"script", "style"}:
        return ""
    return re.sub(r"\s+", " ", " ".join(node_text(child) for child in node["children"])).strip()


def has_class(node, name):
    return name in str(node["attrs"].get("class", "")).split()


def parse_neuron_sections(data: bytes, effective_date: str, charset="utf-8") -> list[dict]:
    parser = NeuronSections()
    parser.feed(data.decode(charset, errors="strict"))
    parser.close()
    expected = {"list_forbidden": (0, "Forbidden List"),
                "list_limited": (1, "Limited List"),
                "list_semi_limited": (2, "Semi-Limited List"),
                "list_release_of_restricted": (3, "No Longer on the List")}
    sections = {}
    for node in descendants(parser.root):
        identity = node["attrs"].get("id")
        if identity in expected:
            if identity in sections:
                raise ValueError("DUPLICATE_NEURON_SECTION:" + identity)
            sections[identity] = node
    if set(sections) != set(expected):
        raise ValueError("COMPLETE_NEURON_SECTIONS_REQUIRED")
    date = dt.date.fromisoformat(iso_date(effective_date))
    date_label = date.strftime("%m/%d/%Y")
    out, seen_cids = [], set()
    for identity, (maximum, label) in expected.items():
        section = sections[identity]
        if not section["closed"]:
            raise ValueError("UNCLOSED_NEURON_SECTION:" + identity)
        nodes = list(descendants(section))
        titles = [node for node in nodes if node["tag"] == "h3"]
        if len(titles) != 1:
            raise ValueError("NEURON_SECTION_TITLE_REQUIRED:" + identity)
        title = re.fullmatch(re.escape(label) + r":\s*(\d+) Card\(s\)", node_text(titles[0]))
        if not title:
            raise ValueError("NEURON_SECTION_TITLE_MISMATCH:" + identity)
        dates = re.findall(r"Status Updated\s+(\d{2}/\d{2}/\d{4})", node_text(section))
        if dates != [date_label]:
            raise ValueError("NEURON_SECTION_DATE_MISMATCH:" + identity)
        rows = [node for node in nodes if has_class(node, "t_row")]
        if len(rows) != int(title[1]) or len(rows) > 5000:
            raise ValueError("NEURON_SECTION_COUNT_MISMATCH:" + identity)
        for row in rows:
            if not row["closed"]:
                raise ValueError("UNCLOSED_NEURON_CARD_ROW")
            row_nodes = list(descendants(row))
            card_nodes = [node for node in row_nodes if has_class(node, "card_name")]
            if len(card_nodes) != 1:
                raise ValueError("NEURON_SINGLE_CARD_NAME_REQUIRED")
            card_nodes = list(descendants(card_nodes[0]))
            names = [node for node in card_nodes if node["tag"] == "span" and has_class(node, "name")]
            links = [node for node in card_nodes if node["tag"] == "input" and has_class(node, "link_value")]
            if len(names) != 1 or len(links) != 1 or not node_text(names[0]):
                raise ValueError("NEURON_CARD_IDENTITY_REQUIRED")
            match = re.fullmatch(r"/yugiohdb/card_search\.action\?ope=2&cid=(\d+)", links[0]["attrs"].get("value", ""))
            if not match or match[1] in seen_cids:
                raise ValueError("NEURON_UNIQUE_CARD_CID_REQUIRED")
            seen_cids.add(match[1])
            out.append({"name": node_text(names[0]), "max": maximum})
    return checked_rows(out)


def document_text(data: bytes, content_type: str, charset: str = "utf-8") -> tuple[str, Tables | None]:
    if data.startswith(b"%PDF-") or content_type == "application/pdf":
        executable = shutil.which("pdftotext")
        if not executable:
            raise ValueError("PDFTOTEXT_REQUIRED_FOR_PDF_REVIEW")
        with tempfile.TemporaryDirectory(prefix="ygo-official-") as directory:
            path = Path(directory) / "document.pdf"
            path.write_bytes(data)
            result = subprocess.run([executable, "-layout", str(path), "-"],
                                    check=True, capture_output=True, timeout=20)
            text = result.stdout.decode("utf-8", errors="strict")
            if not text.strip():
                raise ValueError("PDF_HAS_NO_EXTRACTABLE_TEXT")
            return text, None
    text = data.decode(charset, errors="strict")
    if content_type in ["text/html", "application/xhtml+xml"] or re.search(r"<(?:html|table)\b", text, re.I):
        parser = Tables()
        parser.feed(text)
        parser.close()
        return re.sub(r"\s+", " ", "".join(parser.visible)).strip(), parser
    return text, None


def parse_html_rows(parser: Tables) -> list[dict]:
    name_column = status_column = None
    out = []
    for row in parser.rows:
        headers = [normalized(cell) for cell in row]
        possible_name = next((i for i, value in enumerate(headers)
                              if value in ["card name", "name", "nombre de carta"]), None)
        possible_status = next((i for i, value in enumerate(headers)
                                if value in ["advanced format", "advanced", "status", "estado"]), None)
        if possible_name is not None and possible_status is not None:
            name_column, status_column = possible_name, possible_status
            continue
        if name_column is None or status_column is None or len(row) <= max(name_column, status_column):
            continue
        name, label = row[name_column].strip(), normalized(row[status_column])
        if not name:
            continue
        # Blank/unknown cells must not silently become "Unlimited".
        if label not in STATUS:
            raise ValueError("UNRECOGNIZED_TABLE_STATUS:" + row[status_column])
        out.append({"name": name, "max": STATUS[label], "witness": " | ".join(row)})
    if not out:
        raise ValueError("NO_RECOGNIZED_RESTRICTION_TABLE")
    return out


def checked_rows(rows: list[dict], text: str | None = None) -> list[dict]:
    if not isinstance(rows, list) or not rows or len(rows) > 5000:
        raise ValueError("NONEMPTY_RESTRICTION_ROWS_REQUIRED_WITHIN_LIMIT")
    out, seen = [], set()
    for row in rows:
        name, maximum = str(row.get("name", "")).strip(), row.get("max")
        if not name or type(maximum) is not int or maximum not in [0, 1, 2, 3]:
            raise ValueError("INVALID_RESTRICTION_ROW")
        key = normalized(name)
        if key in seen:
            raise ValueError("DUPLICATE_RESTRICTION_IDENTITY:" + name)
        seen.add(key)
        if text is not None:
            witness = str(row.get("witness", "")).strip()
            if not witness or normalized(witness) not in normalized(text):
                raise ValueError("ROW_WITNESS_NOT_IN_DOCUMENT:" + name)
            if key not in normalized(witness):
                raise ValueError("ROW_WITNESS_DOES_NOT_IDENTIFY_CARD:" + name)
            remainder = normalized(witness).replace(key, "", 1)
            labels = sorted(STATUS, key=len, reverse=True)
            pattern = r"(?<!\w)(?:" + "|".join(re.escape(label) for label in labels) + r")(?!\w)"
            found = {STATUS[match.group()] for match in re.finditer(pattern, remainder)}
            if found != {maximum}:
                raise ValueError("ROW_WITNESS_DOES_NOT_IDENTIFY_LIMIT:" + name)
        out.append({"name": name, "max": maximum})
    return out


def iso_date(value: str) -> str:
    try:
        parsed = dt.date.fromisoformat(str(value))
    except (ValueError, TypeError):
        raise ValueError("ISO_EFFECTIVE_DATE_REQUIRED") from None
    if str(parsed) != value:
        raise ValueError("ISO_EFFECTIVE_DATE_REQUIRED")
    return value


def witnessed_date(value: str, witness: str, text: str) -> str:
    iso_date(value)
    if not witness or normalized(witness) not in normalized(text):
        raise ValueError("EFFECTIVE_DATE_WITNESS_NOT_IN_DOCUMENT")
    target = dt.date.fromisoformat(value)
    forms = [value, target.strftime("%d/%m/%Y"), target.strftime("%m/%d/%Y"),
             target.strftime("%B %d, %Y"), target.strftime("%B ") + str(target.day) + target.strftime(", %Y"),
             str(target.day) + target.strftime(" %B %Y")]
    if not any(normalized(form) in normalized(witness) for form in forms):
        raise ValueError("EFFECTIVE_DATE_NOT_BOUND_TO_WITNESS")
    return value


def embedded_snapshot(root: Path = ROOT) -> dict:
    source = (root / "src/modules/085-ygo-alpha-1216-canonical-release.js").read_text()
    match = re.search(r"const KONAMI_TCG1125=Object\.freeze\((\{[^\n]+\})\);", source)
    if not match:
        raise ValueError("EMBEDDED_TCG_TABLE_NOT_FOUND")
    table = json.loads(match[1])
    rows = [{"name": name, "max": int(maximum)} for maximum, names in table.items() for name in names]
    # This is the embedded application's asserted date, not external verification.
    return {"format": "tcg", "effectiveDate": "2026-10-19", "data": checked_rows(rows),
            "source": "EMBEDDED_APPLICATION_CLAIM", "sha256": sha(match[1].encode())}


def compare_rows(snapshot: dict, rows: list[dict]) -> dict:
    a = {normalized(row["name"]): row for row in checked_rows(snapshot["data"])}
    b = {normalized(row["name"]): row for row in checked_rows(rows)}
    # Explicitly unlimited rows are optional in published restriction tables.
    keys = {key for key, row in a.items() if row["max"] < 3} | {key for key, row in b.items() if row["max"] < 3}
    absent_a, absent_b, changed = [], [], []
    for key in sorted(keys):
        old, new = a.get(key), b.get(key)
        if old is None:
            absent_a.append(new)
        elif new is None:
            absent_b.append(old)
        elif old["max"] != new["max"]:
            changed.append({"name": old["name"], "snapshotMax": old["max"], "documentMax": new["max"]})
    # A source explicitly contradicting a saved unlimited row is also detected.
    for key in sorted((set(a) & set(b)) - keys):
        if a[key]["max"] != b[key]["max"]:
            changed.append({"name": a[key]["name"], "snapshotMax": a[key]["max"], "documentMax": b[key]["max"]})
    counts = lambda values: {str(n): sum(row["max"] == n for row in values) for n in range(4)}
    return {"rowsMatch": not absent_a and not absent_b and not changed,
            "missingFromSnapshot": absent_a, "missingFromDocument": absent_b,
            "differentLimits": changed, "snapshotCounts": counts(a.values()),
            "documentCounts": counts(b.values()), "namesMatchedWithoutFuzzySubstitution": True}


def review_document(data: bytes, metadata: dict, snapshot: dict, *,
                    fresh_receipt: dict | None = None, as_of: str | None = None) -> dict:
    if len(data) > MAX_BYTES or not data:
        raise ValueError("DOCUMENT_EMPTY_OR_EXCEEDS_8_MIB")
    valid_url(str(metadata.get("sourceUrl", "")))
    if metadata.get("sha256") != sha(data):
        raise ValueError("DOCUMENT_HASH_MISMATCH")
    if metadata.get("format") != "tcg" or snapshot.get("format") != "tcg":
        raise ValueError("TCG_FORMAT_CONTEXT_REQUIRED")
    if metadata.get("complete") is not True:
        raise ValueError("COMPLETE_DOCUMENT_TABLE_DECLARATION_REQUIRED")
    text, parser = document_text(data, str(metadata.get("contentType", "text/plain")),
                                 str(metadata.get("charset", "utf-8")))
    effective = witnessed_date(str(metadata.get("effectiveDate", "")),
                              str(metadata.get("dateWitness", "")), text)
    snapshot_date = iso_date(str(snapshot.get("effectiveDate", "")))
    today = iso_date(as_of or str(dt.datetime.now(dt.timezone.utc).date()))
    if effective > today:
        raise ValueError("DOCUMENT_NOT_YET_EFFECTIVE")
    if parser is not None:
        if re.search(rb"id\s*=\s*['\"]list_forbidden['\"]", data):
            rows, extraction = parse_neuron_sections(data, effective, str(metadata.get("charset", "utf-8"))), "RECOGNIZED_NEURON_SECTIONS"
        else:
            rows, extraction = checked_rows(parse_html_rows(parser)), "RECOGNIZED_HTML_TABLE"
    else:
        reviewer = metadata.get("reviewer") or {}
        if not isinstance(reviewer.get("name"), str) or len(reviewer["name"].strip()) < 2:
            raise ValueError("REVIEWER_NAME_REQUIRED_FOR_TEXT_ROWS")
        try:
            reviewed = dt.datetime.fromisoformat(str(reviewer.get("reviewedAt", "")).replace("Z", "+00:00"))
            if reviewed.tzinfo is None or reviewed > dt.datetime.now(dt.timezone.utc):
                raise ValueError
        except (ValueError, TypeError):
            raise ValueError("VALID_REVIEW_TIMESTAMP_REQUIRED_FOR_TEXT_ROWS") from None
        rows, extraction = checked_rows(metadata.get("rows"), text), "REVIEWER_ROWS_WITH_DOCUMENT_WITNESSES"
    difference = compare_rows(snapshot, rows)
    date_match = effective == snapshot_date
    authenticated = bool(fresh_receipt and fresh_receipt.get("transport") == "DIRECT_HTTPS_TLS_VALIDATED_IN_THIS_PROCESS"
                         and fresh_receipt.get("sha256") == sha(data)
                         and fresh_receipt.get("sourceUrl") == metadata["sourceUrl"])
    match = difference["rowsMatch"] and date_match
    structured = extraction in {"RECOGNIZED_HTML_TABLE", "RECOGNIZED_NEURON_SECTIONS"}
    status = ("OFFICIAL_DOCUMENT_TABLE_MATCH" if authenticated and structured
              else "LOCAL_DOCUMENT_TABLE_MATCH_SOURCE_UNAUTHENTICATED") if match else "SNAPSHOT_DISCREPANCIES"
    return {"schema": "ygo-official-document-comparison/v1", "pass": match, "status": status,
            "executedAt": timestamp(), "format": "tcg", "asOfDate": today,
            "snapshotEffectiveDate": snapshot_date, "documentEffectiveDate": effective,
            "dateMatch": date_match, "sourceUrl": metadata["sourceUrl"],
            "documentSha256": sha(data), "snapshotSha256": sha(json.dumps(snapshot, sort_keys=True).encode()),
            "extraction": extraction, "transportAuthenticatedInThisRun": authenticated,
            "officialTableCompared": authenticated and structured,
            "currentListProven": False, "officialLegalityCertified": False,
            "officialIdentityCertified": False, "universalCertified": False, **difference,
            "limitations": ["A local source URL or external receipt does not authenticate document origin.",
                            "A complete-table assertion is supplied by the reviewer; PDF/text rows require exact witnesses.",
                            "Matching table names and limits do not authenticate passcodes, card availability, rulings or all formats.",
                            "A dated matching publication does not prove it is the latest effective list."]}


def probe(urls: list[str]) -> dict:
    attempts = []
    for url in urls:
        entry = {"url": valid_url(url), "attemptedAt": timestamp()}
        try:
            data, receipt = fetch(url)
            entry.update({"retrieved": True, "receipt": receipt, "bytes": len(data)})
        except (urllib.error.URLError, ValueError, TimeoutError, ssl.SSLError) as error:
            entry.update({"retrieved": False, "errorType": type(error).__name__, "error": str(error)})
        attempts.append(entry)
    return {"schema": "ygo-official-source-verification/v1", "executedAt": timestamp(),
            "attempts": attempts, "retrievedDocuments": sum(row["retrieved"] for row in attempts),
            "officialSnapshotVerified": False, "officialPoolVerified": False,
            "status": "DOCUMENTS_RETRIEVED_REQUIRE_REVIEW" if any(row["retrieved"] for row in attempts) else "OFFICIAL_SOURCE_ACCESS_BLOCKED",
            "limitations": ["Access failures do not validate or invalidate the embedded table.",
                            "No catalogue data, passcodes, banlists or pools are changed by probing.",
                            "No alternate transport, proxy bypass or fabricated certification is used."]}


def write(value: dict, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("probe", help="Attempt normal official HTTPS retrieval; never bypass rejection")
    p.add_argument("--url", action="append")
    p.add_argument("--output", type=Path, default=ROOT / "dist/official-verification.json")
    c = sub.add_parser("capture", help="Save raw official bytes and a metadata template for review")
    c.add_argument("url")
    c.add_argument("--document", type=Path, required=True)
    c.add_argument("--metadata", type=Path, required=True)
    v = sub.add_parser("compare", help="Compare a complete, witnessed local document with the embedded or supplied snapshot")
    v.add_argument("--document", type=Path, required=True)
    v.add_argument("--metadata", type=Path, required=True)
    v.add_argument("--snapshot", type=Path)
    v.add_argument("--as-of")
    v.add_argument("--output", type=Path, required=True)
    live = sub.add_parser("compare-url", help="Fetch and compare an official HTML table in one process")
    live.add_argument("url")
    live.add_argument("--effective-date", required=True)
    live.add_argument("--date-witness", required=True)
    live.add_argument("--complete-table", action="store_true", required=True)
    live.add_argument("--snapshot", type=Path)
    live.add_argument("--as-of")
    live.add_argument("--document", type=Path, help="Preserve the exact original bytes compared in this process")
    live.add_argument("--metadata", type=Path, help="Preserve this run's receipt and review inputs; not portable authentication")
    live.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        if args.command == "probe":
            result = probe(args.url or PROBE_URLS)
            write(result, args.output)
            print(json.dumps({"status": result["status"], "retrievedDocuments": result["retrievedDocuments"], "output": str(args.output)}))
            return 0
        if args.command == "capture":
            data, receipt = fetch(args.url)
            args.document.parent.mkdir(parents=True, exist_ok=True)
            args.document.write_bytes(data)
            metadata = {**receipt, "schema": "ygo-restriction-document-review/v1", "format": "tcg",
                        "effectiveDate": "", "dateWitness": "", "complete": False,
                        "rows": [], "reviewer": {"name": "", "reviewedAt": ""},
                        "status": "CAPTURED_REQUIRES_DOCUMENT_REVIEW", "originReceiptIsNotPortableAuthentication": True}
            write(metadata, args.metadata)
            print(json.dumps({"status": metadata["status"], "sha256": receipt["sha256"]}))
            return 0
        if args.command == "compare-url":
            data, receipt = fetch(args.url)
            metadata = {**receipt, "format": "tcg", "effectiveDate": args.effective_date,
                        "dateWitness": args.date_witness, "complete": args.complete_table}
            if receipt["contentType"] not in ["text/html", "application/xhtml+xml"]:
                raise ValueError("LIVE_COMPARISON_REQUIRES_RECOGNIZED_HTML_TABLE")
            snapshot = json.loads(args.snapshot.read_text()) if args.snapshot else embedded_snapshot()
            result = review_document(data, metadata, snapshot, fresh_receipt=receipt, as_of=args.as_of)
            if args.document:
                args.document.parent.mkdir(parents=True, exist_ok=True)
                args.document.write_bytes(data)
            if args.metadata:
                write({**metadata, "originReceiptIsNotPortableAuthentication": True}, args.metadata)
            write(result, args.output)
            print(json.dumps({"pass": result["pass"], "status": result["status"], "output": str(args.output)}))
            return 0 if result["pass"] else 1
        if args.document.stat().st_size > MAX_BYTES:
            raise ValueError("DOCUMENT_EXCEEDS_8_MIB")
        data = args.document.read_bytes()
        metadata = json.loads(args.metadata.read_text())
        snapshot = json.loads(args.snapshot.read_text()) if args.snapshot else embedded_snapshot()
        result = review_document(data, metadata, snapshot, as_of=args.as_of)
        write(result, args.output)
        print(json.dumps({"pass": result["pass"], "status": result["status"], "output": str(args.output)}))
        return 0 if result["pass"] else 1
    except (OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError) as error:
        print(json.dumps({"pass": False, "status": "SOURCE_REVIEW_FAILED", "error": str(error)}))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
