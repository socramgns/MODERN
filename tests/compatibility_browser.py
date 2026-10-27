#!/usr/bin/env python3
"""Smoke-test delivered bytes in installed browser engines without policy changes.

Unavailable engines remain explicit pending coverage. Use --require-cross-browser
in an environment that is expected to provide a second engine.
"""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import argparse
import datetime as dt
import functools
import hashlib
import json
import os
import shutil
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
FILENAME = 'Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html'
PREPARATION_BLOCK = {
    'recordedDate': '2026-10-22',
    'command': 'PLAYWRIGHT_BROWSERS_PATH=/tmp/ygo-browsers python -m playwright install firefox',
    'result': 'DOWNLOAD_BLOCKED',
    'httpStatus': 403,
    'message': "Domain forbidden",
    'hosts': ['cdn.playwright.dev', 'playwright.download.prss.microsoft.com'],
    'scope': 'Observed workspace preparation attempt; this runner does not retry or bypass it.',
}


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def wait_ready(page):
    page.wait_for_function(
        'window.YGODataCatalog?.status().loaded && window.YGOUIState?.last && window.YGOComboWorkbench',
        timeout=60000,
    )
    page.evaluate('async()=>{await YGODataCatalog.ready;await YGOUIState.ready;await YGOComboWorkbench.ready;}')


def browser_run(browser, engine, url, build, fixture):
    tests = []
    details = {}
    errors = []

    def check(name, passed, detail=None):
        tests.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail

    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    response = page.goto(url, wait_until='domcontentloaded')
    served_hash = hashlib.sha256(response.body()).hexdigest() if response else None
    check('delivered_document_bytes_match_manifest', served_hash == build['htmlSha256'], served_hash)
    wait_ready(page)
    boot = page.evaluate('()=>({boot:__YGO_BOOT_HEALTH_1263(),catalog:YGODataCatalog.status(),build:YGO_BUILD_MANIFEST.buildId})')
    check('catalogue_and_engine_boot', boot['boot'].get('ready') is True and boot['catalog']['loaded'] is True
          and boot['build'] == build['buildId'], boot)

    page.locator('#ygoCausalFile').set_input_files({
        'name': 'Invoked_browser_compatibility.json',
        'mimeType': 'application/json',
        'buffer': json.dumps(fixture).encode(),
    })
    page.wait_for_function('YGOUIState.last?.counts.main===40 && YGOComboWorkbench.report().openingIds[0]===86120751', timeout=60000)
    imported = page.evaluate('()=>({counts:YGOUIState.last.counts,opening:YGOComboWorkbench.report().openingIds,name:document.getElementById("name").value})')
    check('physical_fixture_file_import', imported['counts']['main'] == 40 and imported['opening'] == fixture['openingIds'], imported)

    result = page.evaluate('async()=>{const r=await YGOComboWorkbench.run({maxDepth:14,maxStates:5000,maxMs:10000});return{pass:r.pass,count:r.lines?.length||0,goals:(r.lines||[]).map(l=>YGOComboWorkbench.goalMatches(l.state,r.goal)),replays:(r.lines||[]).map(l=>YGOComboEngine.replay(l,{deck:deckState}).pass),report:YGOComboWorkbench.report().competitiveScore};}')
    check('invoked_goal_with_fresh_replay', result['pass'] is True and result['count'] > 0
          and all(result['goals']) and all(result['replays']) and result['report'] is None, result)
    check('replay_results_rendered', page.locator('#ygoCausalResults article').count() > 0)

    transport = page.evaluate('async()=>{const before=YGOComboEngine.deckFingerprint(deckState),payload=YGOExports.compact();YGOUIState.validateSession(payload);const result=await YGOExports.importShared(payload);return{same:before===YGOComboEngine.deckFingerprint(deckState),error:result?.error||null,counts:YGOUIState.last.counts,format:document.querySelector(".fmt.active").dataset.f};}')
    check('json_shared_transport_roundtrip', transport['same'] is True and transport['error'] is None
          and transport['counts']['main'] == 40 and transport['format'] == 'TCG', transport)

    session = page.evaluate('()=>({saved:YGOUIState.saveSession(),fingerprint:YGOComboEngine.deckFingerprint(deckState),name:document.getElementById("name").value,context:YGOUIState.getFormatContext()})')
    check('session_write_confirmed', session['saved'].get('saved') is True, session['saved'])
    page.reload(wait_until='domcontentloaded')
    wait_ready(page)
    page.wait_for_function('YGOUIState.last?.counts.main===40', timeout=60000)
    restored = page.evaluate('()=>({fingerprint:YGOComboEngine.deckFingerprint(deckState),name:document.getElementById("name").value,context:YGOUIState.getFormatContext()})')
    check('session_reload_preserves_identity_and_context', restored == {key: session[key] for key in ['fingerprint', 'name', 'context']}, restored)

    page.set_viewport_size({'width': 390, 'height': 844})
    page.wait_for_timeout(100)
    mobile = page.evaluate('()=>({viewport:innerWidth,width:document.documentElement.scrollWidth})')
    check('mobile_layout_no_document_overflow', mobile['width'] <= mobile['viewport'] + 1, mobile)
    check('no_page_errors', not errors, errors)
    context.close()

    # Normal navigation only. A browser-policy rejection is reported as a
    # limitation; no flag, policy or alternate protocol is used to evade it.
    local = browser.new_context()
    filepage = local.new_page()
    file_result = {'status': 'NOT_EXECUTED', 'verified': False}
    try:
        filepage.goto((ROOT / build['output']).as_uri(), wait_until='domcontentloaded', timeout=30000)
        wait_ready(filepage)
        file_boot = filepage.evaluate('()=>({ready:__YGO_BOOT_HEALTH_1263().ready,catalog:YGODataCatalog.status().loaded})')
        file_result = {'status': 'VERIFIED' if file_boot['ready'] and file_boot['catalog'] else 'FAILED',
                       'verified': bool(file_boot['ready'] and file_boot['catalog']), 'detail': file_boot}
        check('direct_file_boot', file_result['verified'], file_boot)
    except Exception as error:
        message = str(error)
        blocked = 'ERR_BLOCKED_BY_ADMINISTRATOR' in message or 'NS_ERROR_DOM_BAD_URI' in message
        file_result = {'status': 'BLOCKED_BY_BROWSER_POLICY' if blocked else 'NOT_VERIFIED',
                       'verified': False, 'error': message[:2500]}
        if not blocked:
            check('direct_file_boot', False, file_result)
    finally:
        local.close()

    return {'engine': engine, 'status': 'PASSED' if all(t['pass'] for t in tests) else 'FAILED',
            'pass': all(t['pass'] for t in tests), 'tests': tests, 'details': details,
            'fileNavigation': file_result, 'pageErrors': errors}


def run(url, require_cross_browser=False):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    actual = hashlib.sha256(artifact.read_bytes()).hexdigest()
    if actual != build['htmlSha256']:
        raise RuntimeError('The delivered HTML differs from the build manifest')
    fixture = json.loads((ROOT / 'examples/Arquetipo_Invoked.json').read_text())
    records = []
    with sync_playwright() as playwright:
        for engine in ['chromium', 'firefox', 'webkit']:
            browser_type = getattr(playwright, engine)
            executable = shutil.which('chromium') if engine == 'chromium' else browser_type.executable_path
            if not executable or not Path(executable).is_file():
                reason = 'No installed executable was found. No installation was attempted by this run.'
                record = {'engine': engine, 'status': 'UNAVAILABLE', 'pass': None, 'tests': [], 'reason': reason}
                if engine == 'firefox':
                    record['workspacePreparation'] = PREPARATION_BLOCK
                records.append(record)
                continue
            try:
                args = ['--no-sandbox'] if engine == 'chromium' else []
                browser = browser_type.launch(executable_path=executable, headless=True, args=args)
                try:
                    records.append(browser_run(browser, engine, url, build, fixture))
                finally:
                    browser.close()
            except Exception as error:
                records.append({'engine': engine, 'status': 'FAILED', 'pass': False, 'tests': [], 'error': str(error)[:5000]})

    executed = [r for r in records if r['pass'] is not None]
    cross = len(executed) >= 2 and all(r['pass'] for r in executed)
    missing = [r['engine'] for r in records if r['status'] == 'UNAVAILABLE']
    passed = bool(executed) and all(r['pass'] for r in executed) and (cross or not require_cross_browser)
    return {'schema': 'ygo-browser-compatibility/v1', 'buildId': build['buildId'],
            'htmlSha256': actual, 'artifactMode': 'DELIVERED_BYTES',
            'executedAt': dt.datetime.now(dt.timezone.utc).isoformat(),
            'pass': passed, 'complete': not missing and all(r['pass'] for r in executed),
            'crossBrowserVerified': cross, 'executedEngines': [r['engine'] for r in executed],
            'pendingEngines': missing, 'browsers': records,
            'limitations': ['Passing installed engines does not close unavailable-engine coverage.',
                            'Browser-policy restrictions are reported and are not disabled.',
                            'This is a smoke regression, not complete compatibility coverage.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--require-cross-browser', action='store_true')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/compatibility-results.json')
    options = parser.parse_args()
    server = None
    try:
        url = options.url
        if not url:
            server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT / 'dist')))
            threading.Thread(target=server.serve_forever, daemon=True).start()
            url = f'http://127.0.0.1:{server.server_port}/{FILENAME}'
        started = time.monotonic()
        report = run(url, options.require_cross_browser)
        report['elapsedSeconds'] = round(time.monotonic() - started, 2)
        options.output.write_text(json.dumps(report, ensure_ascii=False, indent=2))
        print(json.dumps({key: report[key] for key in ['pass', 'complete', 'crossBrowserVerified', 'executedEngines', 'pendingEngines', 'elapsedSeconds']}, ensure_ascii=False))
        raise SystemExit(0 if report['pass'] else 1)
    finally:
        if server:
            server.shutdown()
            server.server_close()
