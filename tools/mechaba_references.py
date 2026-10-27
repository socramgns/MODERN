#!/usr/bin/env python3
"""Validate saved Mechaba FAQ evidence without authenticating a local URL.

These references are official Japanese OCG publications. Their explanatory
Spanish translations are not primary evidence or TCG ruling certification.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import parse_qs, urlsplit
import copy
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
SCOPE = 'TCG_REFERENCE_NOT_TCG_RULING_CERTIFICATION'


def sha(value):
    return hashlib.sha256(value).hexdigest()


class FaqFields(HTMLParser):
    """Extract only the two named official FAQ fields, preserving BR breaks."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.active = None
        self.depth = 0
        self.buffers = {}

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if self.active:
            if tag == 'div':
                self.depth += 1
            if tag == 'br':
                self.buffers[self.active].append('\n')
        elif tag == 'div' and attributes.get('id') in {'question_text', 'answer_text'}:
            self.active = attributes['id']
            self.depth = 1
            if self.active in self.buffers:
                raise ValueError('DUPLICATE_FAQ_FIELD')
            self.buffers[self.active] = []

    def handle_endtag(self, tag):
        if self.active and tag == 'div':
            self.depth -= 1
            if not self.depth:
                self.active = None

    def handle_data(self, value):
        if self.active:
            self.buffers[self.active].append(value)

    def text(self, field):
        if field not in self.buffers:
            raise ValueError('FAQ_FIELD_MISSING')
        return '\n'.join(line.strip() for line in ''.join(self.buffers[field]).splitlines()).strip()


def verify_bundle(root=ROOT, bundle=None):
    """Validate integrity and exact witnesses; do not infer live origin trust."""
    bundle = copy.deepcopy(bundle) if bundle is not None else json.loads(
        (root / 'src/data/mechaba-ruling-references.json').read_text())
    if (bundle.get('schema') != 'ygo-mechaba-ruling-references/v1'
            or bundle.get('scope') != SCOPE or bundle.get('officialCardCid') != 12849
            or bundle.get('technicalCardId') != 75286621):
        raise ValueError('REFERENCE_BUNDLE_CONTEXT_INVALID')
    for flag in ['officialTcgRulingCertified', 'officialPoolVerified',
                 'competitiveCertified', 'universalCertified',
                 'savedReceiptAuthenticatesOriginInLaterRuns']:
        if bundle.get(flag) is not False:
            raise ValueError('REFERENCE_SCOPE_OVERCLAIM')
    if (bundle.get('principle') != 'SAME_ACTIVATION_LOCATION_FOR_ASSOCIATED_BANISH'
            or bundle.get('captureActivationLocationBeforeCosts') is not True
            or bundle.get('negationCanApplyAfterSourceChangesLocation') is not True
            or bundle.get('associatedBanishRequiresSourceAtItsActivationLocation') is not True):
        raise ValueError('REFERENCE_PRINCIPLE_CONTEXT_INVALID')
    references = bundle.get('references')
    if (not isinstance(references, list) or len(references) != 3
            or {entry.get('faqId') for entry in references} != {16041, 22388, 23949}):
        raise ValueError('REFERENCE_SET_INCOMPLETE_OR_DUPLICATED')
    directory = (root / 'src/data/official').resolve()

    def local_path(value):
        if not isinstance(value, str):
            raise ValueError('REFERENCE_PATH_INVALID')
        path = (root / value).resolve()
        if not path.is_relative_to(directory):
            raise ValueError('REFERENCE_PATH_ESCAPES_EVIDENCE')
        return path

    for entry in references:
        if (entry.get('formatAuthority') != 'OCG' or entry.get('language') != 'ja'
                or entry.get('scope') != SCOPE or entry.get('officialCardCid') != 12849):
            raise ValueError('REFERENCE_AUTHORITY_OR_LANGUAGE_INVALID')
        url = urlsplit(entry.get('sourceUrl', ''))
        query = parse_qs(url.query)
        if (url.scheme != 'https' or url.hostname not in {'www.db.yugioh-card.com', 'db.yugioh-card.com'}
                or url.username or url.password or url.path != '/yugiohdb/faq_search.action'
                or query.get('ope') != ['5'] or query.get('fid') != [str(entry['faqId'])]
                or query.get('request_locale') != ['ja']):
            raise ValueError('REFERENCE_OFFICIAL_URL_CONTEXT_INVALID')
        document = local_path(entry['documentPath']).read_bytes()
        metadata = json.loads(local_path(entry['metadataPath']).read_text())
        if sha(document) != entry['rawSha256'] or sha(document) != metadata['rawSha256']:
            raise ValueError('REFERENCE_DOCUMENT_HASH_MISMATCH')
        if (metadata.get('schema') != 'ygo-official-faq-capture/v1'
                or metadata.get('httpStatus') != 200 or metadata.get('bytes') != len(document)
                or metadata.get('requestedUrl') != entry['sourceUrl']
                or metadata.get('resolvedUrl') != entry['sourceUrl']
                or metadata.get('faqId') != entry['faqId'] or metadata.get('officialCardCid') != 12849
                or metadata.get('formatAuthority') != 'OCG' or metadata.get('language') != 'ja'
                or metadata.get('savedReceiptAuthenticatesOriginInLaterRuns') is not False):
            raise ValueError('REFERENCE_CAPTURE_METADATA_MISMATCH')
        parser = FaqFields()
        decoded = document.decode('utf-8')
        parser.feed(decoded)
        fields = {key: parser.text(key) for key in ['question_text', 'answer_text']}
        if 'cid=12849' not in decoded or '召喚獣メルカバー' not in fields['answer_text']:
            raise ValueError('REFERENCE_NOT_BOUND_TO_MECHABA')
        if {key: sha(value.encode()) for key, value in fields.items()} != entry['fieldSha256']:
            raise ValueError('REFERENCE_FIELD_TEXT_HASH_MISMATCH')
        if not isinstance(entry.get('quotes'), list) or not entry['quotes']:
            raise ValueError('REFERENCE_QUOTE_REQUIRED')
        for quote in entry['quotes']:
            original = quote.get('originalJapanese')
            if (quote.get('field') not in fields or not isinstance(original, str) or not original
                    or original not in fields[quote['field']]
                    or sha(original.encode()) != quote.get('originalTextSha256')):
                raise ValueError('REFERENCE_QUOTE_NOT_WITNESSED')
            if (quote.get('translationIsPrimaryEvidence') is not False
                    or not isinstance(quote.get('explanatorySpanish'), str)
                    or not quote['explanatorySpanish'].strip()):
                raise ValueError('REFERENCE_TRANSLATION_SCOPE_INVALID')
    return {'integrityPass': True, 'references': len(references), 'scope': SCOPE,
            'sourceAuthenticatedInThisRun': False, 'officialTcgRulingCertified': False}


def load_references(root=ROOT):
    """Return the rechecked record; no network or portable receipt trust."""
    root = Path(root)
    bundle = json.loads((root / 'src/data/mechaba-ruling-references.json').read_text())
    checked = verify_bundle(root, bundle)
    return {**bundle, 'storedBytesRechecked': True,
            'verifiedReferenceCount': checked['references'],
            'sourceAuthenticatedInThisRun': False}
