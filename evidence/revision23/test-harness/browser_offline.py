#!/usr/bin/env python3
"""Native browser offline setup and a real HTTP control for Chromium CI."""
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import threading
import traceback
import uuid

from playwright.sync_api import Error as PlaywrightError, sync_playwright


def _override_chromium_network_state(page, offline):
    page._ygo_offline_requested_state = offline
    session = getattr(page, '_ygo_offline_cdp_session', None)
    if session is None:
        session = page.context.new_cdp_session(page)
        # Keep the native CDP session attached for the lifetime of this Page.
        page._ygo_offline_cdp_session = session
        session.send('Network.enable')
    return session.send('Network.overrideNetworkState', {
        'offline': offline, 'latency': 0,
        'downloadThroughput': -1, 'uploadThroughput': -1,
        'connectionType': 'none' if offline else 'ethernet',
    })


def new_offline_page(context):
    """Block real requests and retain Chromium's native offline renderer state."""
    context.set_offline(True)
    page = context.new_page()
    try:
        browser = context.browser
        if browser is not None and browser.browser_type.name == 'chromium':
            # Chromium 151 resets navigator state when navigation commits.
            # Keep native request blocking and apply the supported renderer
            # state override initially and after each main-frame commit.
            _override_chromium_network_state(page, True)

            def update_main_frame(frame):
                if frame == page.main_frame:
                    _override_chromium_network_state(page, page._ygo_offline_requested_state)

            page._ygo_offline_commit_handler = update_main_frame
            page.on('framenavigated', update_main_frame)
        assert page.evaluate('()=>navigator.onLine') is False, 'Browser did not enter native offline state'
        return page
    except Exception:
        page.close()
        raise


def _probe_control():
    """Require online -> real disconnected request -> restored online HTTP."""
    sentinel = b'<!doctype html><link rel="icon" href="data:,"><title>R23 offline control</title><p>r23-offline-control-v1</p>'
    requests = []
    checks = []
    report = {'schema': 'ygo-browser-offline-control/v1', 'pass': False, 'checks': checks}

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            requests.append(self.path)
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(sentinel)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(sentinel)

        def log_message(self, *args):
            pass

    def check(name, passed):
        checks.append({'name': name, 'pass': bool(passed)})
        assert passed, name

    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        with sync_playwright() as runtime:
            executable = os.environ.get('YGO_CHROMIUM') or runtime.chromium.executable_path
            report['executable'] = executable
            browser = runtime.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
            try:
                report['engineVersion'] = browser.version
                context = browser.new_context()
                try:
                    base = f'http://127.0.0.1:{server.server_port}/r23-control'
                    nonce = uuid.uuid4().hex
                    online_path = f'/r23-control?phase=online&nonce={nonce}'
                    blocked_path = f'/r23-control?phase=offline&nonce={nonce}'
                    restored_path = f'/r23-control?phase=restored&nonce={nonce}'
                    page = context.new_page()
                    response = page.goto(base + online_path[len('/r23-control'):], wait_until='domcontentloaded', timeout=15000)
                    check('online_control_returns_real_server_sentinel', response is not None and response.status == 200 and response.body() == sentinel)
                    report['onlineNavigator'] = page.evaluate('()=>navigator.onLine')
                    check('online_control_reached_server_once', requests == [online_path])
                    offline_page = new_offline_page(context)
                    report['navigatorBeforeOfflineRequest'] = offline_page.evaluate('()=>navigator.onLine')
                    disconnected_error = None
                    try:
                        offline_page.goto(base + blocked_path[len('/r23-control'):], wait_until='domcontentloaded', timeout=15000)
                    except PlaywrightError as error:
                        disconnected_error = str(error)
                    report['offlineNavigationError'] = disconnected_error
                    check('unintercepted_http_request_fails_with_internet_disconnected', disconnected_error is not None and 'net::ERR_INTERNET_DISCONNECTED' in disconnected_error)
                    check('blocked_request_never_reached_real_server', requests == [online_path])
                    # A rejected navigation can still be replacing its error
                    # document. Restore native state before evaluating again.
                    context.set_offline(False)
                    _override_chromium_network_state(offline_page, False)
                    response = offline_page.goto(base + restored_path[len('/r23-control'):], wait_until='domcontentloaded', timeout=15000)
                    check('restored_control_returns_real_server_sentinel', response is not None and response.status == 200 and response.body() == sentinel)
                    report['restoredNavigator'] = offline_page.evaluate('()=>navigator.onLine')
                    check('restored_document_reports_online', report['restoredNavigator'] is True)
                    check('exactly_two_real_server_requests_received', requests == [online_path, restored_path])
                    report['pass'] = all(row['pass'] for row in checks)
                finally:
                    context.close()
            finally:
                browser.close()
    except Exception:
        report['error'] = traceback.format_exc()
        report['pass'] = False
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
        report['serverRequests'] = requests
        report['serverRequestCount'] = len(requests)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--probe', '--control', dest='probe', action='store_true')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    if not args.probe:
        parser.error('use --probe to execute the real HTTP offline control')
    report = _probe_control()
    if args.output:
        args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print('R23_OFFLINE_CONTROL ' + json.dumps(report, ensure_ascii=False, separators=(',', ':')), flush=True)
    compact = dict(report)
    if 'error' in compact:
        compact['error'] = compact['error'][-1800:]
    text = json.dumps(compact, ensure_ascii=False, separators=(',', ':'))
    print('::warning title=R23_OFFLINE_CONTROL::' + text.replace('%', '%25').replace('\r', '%0D').replace('\n', '%0A'), flush=True)
    return 0 if report['pass'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
