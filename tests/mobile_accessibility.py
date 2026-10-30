#!/usr/bin/env python3
"""Mobile viewport, touch and keyboard tasks over the delivered HTML bytes.

Device settings and enlarged text are emulated. This does not claim that a
physical phone, its file picker or assistive technology was tested.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from expanded_examples_browser import execute_step, report
from release5_browser import load_example, ready

ROOT = Path(__file__).resolve().parents[1]
PANEL_SELECTOR = ','.join('#' + value for value in [
    'ygoCausalWorkbench', 'ygoAdvancedWorkbench', 'ygoCardCoverage',
    'ygoFormatEditor', 'ygoDataQuality', 'ygoDrawContinuation',
])


def open_controls(page):
    for panel in ['ygoCausalWorkbench', 'ygoAdvancedWorkbench', 'ygoCardCoverage',
                  'ygoFormatEditor', 'ygoDataQuality', 'ygoDrawContinuation']:
        host = page.locator('#' + panel)
        if not host.count():
            continue
        if host.evaluate('(el)=>el.tagName==="DETAILS"&&!el.open'):
            host.locator(':scope > summary').click()
        for item in host.locator('details').all():
            if item.get_attribute('open') is None:
                item.locator(':scope > summary').click()


def layout(page):
    return page.evaluate('''selector=>{
      const hosts=[...document.querySelectorAll(selector)];
      const controls=[...new Set(hosts.flatMap(host=>[...host.querySelectorAll('button,input,select')]))]
        .filter(el=>el.getClientRects().length&&!el.closest('details:not([open])'));
      const rectangles=controls.map(el=>{const checkbox=el.type==='checkbox',target=checkbox?el.closest('label'):el;
        const r=(target||el).getBoundingClientRect();return{id:el.id||el.getAttribute('aria-label')||el.type,
          width:r.width,height:r.height,left:r.left,right:r.right,checkboxLabel:checkbox};});
      return{viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,
        count:rectangles.length,shortTargets:rectangles.filter(r=>r.height<43.5),
        outsideViewport:rectangles.filter(r=>r.left < -1 || r.right > innerWidth+1)};
    }''', PANEL_SELECTOR)


def resize_text(page, scale):
    if scale == 1:
        page.evaluate('''()=>{for(const el of document.querySelectorAll('[data-ygo-mobile-font-before]')){
          const old=JSON.parse(el.getAttribute('data-ygo-mobile-font-before'));
          if(old.value)el.style.setProperty('font-size',old.value,old.priority);else el.style.removeProperty('font-size');
          el.removeAttribute('data-ygo-mobile-font-before');}}''')
        return
    page.evaluate('''({selector,scale})=>{
      const tags='button,input,select,textarea,p,label,summary,li,td,th,h3,h4,legend,span';
      const els=[...new Set([...document.querySelectorAll(selector)].flatMap(host=>[...host.querySelectorAll(tags)]))];
      const sizes=els.map(el=>parseFloat(getComputedStyle(el).fontSize));
      els.forEach((el,i)=>{el.setAttribute('data-ygo-mobile-font-before',JSON.stringify({
        value:el.style.getPropertyValue('font-size'),priority:el.style.getPropertyPriority('font-size')}));
        el.style.setProperty('font-size',String(sizes[i]*scale)+'px','important');});
    }''', {'selector': PANEL_SELECTOR, 'scale': scale})


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    html_hash = hashlib.sha256(html).hexdigest()
    assert html_hash == build['htmlSha256']
    target = url or 'https://ygo-mobile-delivery.test/Analizador_YuGiOh.html'
    checks, details, browsers = [], {}, []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    with sync_playwright() as runtime:
        for engine, device in [('chromium', 'Pixel 7'), ('webkit', 'iPhone 13')]:
            browser = None
            errors, blocked = [], []
            try:
                browser_type = getattr(runtime, engine)
                executable = (os.environ.get('YGO_CHROMIUM') or shutil.which('chromium')
                              or shutil.which('google-chrome')) if engine == 'chromium' else browser_type.executable_path
                browser = browser_type.launch(
                    executable_path=executable, headless=True,
                    args=['--no-sandbox'] if engine == 'chromium' else [])
                preset = runtime.devices.get(device, {})
                context = browser.new_context(
                    viewport={'width': 390, 'height': 844}, device_scale_factor=2,
                    is_mobile=True, has_touch=True, accept_downloads=True,
                    user_agent=preset.get('user_agent'))

                def deliver(route):
                    if route.request.url == target:
                        route.fulfill(status=200, content_type='text/html; charset=utf-8', body=html)
                    else:
                        blocked.append(route.request.url)
                        route.abort()

                context.route('**/*', deliver)
                page = context.new_page()
                page.on('pageerror', lambda error: errors.append(str(error)))
                response = page.goto(target, wait_until='domcontentloaded')
                ready(page)
                page.evaluate('''async()=>{await YGOFormatEditor.ready;
                  if(window.YGODataQuality?.ready)await YGODataQuality.ready;
                  if(window.YGODrawContinuationWorkbench?.ready)await YGODrawContinuationWorkbench.ready;}''')
                check(engine + '_mobile_boot_uses_manifest_bound_bytes', response is not None
                      and hashlib.sha256(response.body()).hexdigest() == html_hash
                      and page.evaluate('()=>YGO_BUILD_MANIFEST.buildId') == build['buildId'])
                touch = page.evaluate('''()=>({touch:navigator.maxTouchPoints,
                  coarse:matchMedia('(pointer:coarse)').matches,width:innerWidth})''')
                check(engine + '_context_reports_a_coarse_pointer', touch['coarse'] is True, touch)
                initial = load_example(page, 'invoked')
                check(engine + '_example_load_is_physical_and_has_no_autoplay',
                      initial['scenario'] is None and initial['current']['zones'][0]['hand']
                      and initial['competitiveScore'] is None)
                page.locator('#ygoExampleSelect').focus()
                page.keyboard.press('Tab')
                focus = page.evaluate('''()=>{const el=document.activeElement,c=getComputedStyle(el);
                  return{id:el.id,outline:c.outlineStyle,width:parseFloat(c.outlineWidth)}}''')
                check(engine + '_example_load_is_reachable_by_keyboard_with_visible_focus',
                      focus['id'] == 'ygoExampleLoad' and focus['outline'] != 'none'
                      and focus['width'] >= 2, focus)
                page.keyboard.press('Enter')
                page.wait_for_function('''()=>!document.getElementById('ygoExampleLoad').disabled
                  && YGOAdvancedWorkbench.report().scenario===null''')
                open_controls(page)
                labels = page.evaluate('''()=>['ygoDuelActions','ygoDuelActionFilter','ygoFormatFile',
                  'ygoExampleSelect'].map(id=>{const el=document.getElementById(id);
                    return{id,named:!!el&&(!!el.labels?.length||!!el.getAttribute('aria-label'))}})''')
                check(engine + '_primary_inputs_have_programmatic_labels', all(x['named'] for x in labels), labels)
                current = execute_step(page, 'NORMAL_SUMMON', sourceCard=86120751)
                current = execute_step(page, 'ALEISTER_SEARCH')
                check(engine + '_registered_steps_keep_a_fresh_replay_on_mobile',
                      len(current['scenario']['actions']) == 2
                      and current['scenario']['replay']['pass'] is True
                      and any(x['card']['id'] == 74063034 for x in current['current']['zones'][0]['hand']))
                before = report(page)
                for width in ([390, 320] if engine == 'chromium' else [390]):
                    page.set_viewport_size({'width': width, 'height': 844})
                    normal = layout(page)
                    check(f'{engine}_{width}px_controls_have_44px_touch_targets',
                          normal['count'] >= 15 and not normal['shortTargets'], normal)
                    check(f'{engine}_{width}px_controls_remain_inside_the_viewport',
                          normal['documentWidth'] <= normal['viewport'] + 1
                          and not normal['outsideViewport'], normal)
                resize_text(page, 2)
                enlarged = layout(page)
                check(engine + '_twofold_text_enlargement_keeps_controls_in_view',
                      enlarged['count'] >= 15 and not enlarged['shortTargets']
                      and not enlarged['outsideViewport']
                      and enlarged['documentWidth'] <= enlarged['viewport'] + 1, enlarged)
                check(engine + '_viewport_and_text_changes_preserve_the_live_scenario', report(page) == before)
                resize_text(page, 1)
                page.set_viewport_size({'width': 390, 'height': 844})
                page.locator('#ygoDuelActionFilter').fill('Invocación')
                pages = page.locator('#ygoDuelActionPage')
                pagination = pages.evaluate('(el)=>({count:el.options.length,disabled:el.disabled,index:el.selectedIndex})')
                if pagination['count'] > 1:
                    pages.select_option(index=0)
                check(engine + '_single_action_page_is_disabled_or_multiple_pages_are_selectable',
                      pagination['count'] >= 1
                      and (not pagination['disabled'] if pagination['count'] > 1
                           else pagination['disabled'] and pagination['index'] == 0), pagination)
                page.locator('#ygoDuelActionFilter').fill('')
                check(engine + '_action_filter_and_page_controls_do_not_execute_a_step', report(page) == before)
                serialized = page.evaluate('()=>YGOAlpha330.serializeYDK(deckState).text')
                page.locator('#ygoFormatExportYdk').evaluate('''el=>{
                  window.__ygoMobileExportTouches=[];
                  el.addEventListener('touchstart',event=>window.__ygoMobileExportTouches.push({
                    trusted:event.isTrusted,touches:event.targetTouches.length}),{passive:true});}''')
                with page.expect_download() as pending:
                    page.locator('#ygoFormatExportYdk').tap()
                downloaded = pending.value
                text = Path(downloaded.path()).read_text()
                touches = page.evaluate('()=>window.__ygoMobileExportTouches')
                check(engine + '_export_tap_emits_a_trusted_browser_touch_event',
                      any(item['trusted'] and item['touches'] > 0 for item in touches), touches)
                lines = lambda value: [x.strip() for x in value.splitlines()
                                       if x.strip() and not x.startswith('#created')]
                check(engine + '_touch_export_preserves_every_ydk_card_and_zone',
                      lines(serialized) == lines(text), {'filename': downloaded.suggested_filename,
                                                       'bytes': len(text.encode())})
                check(engine + '_touch_export_preserves_the_live_scenario', report(page) == before)
                check(engine + '_mobile_tasks_raise_no_javascript_page_errors', not errors, errors)
                browsers.append({'engine': engine, 'version': browser.version,
                    'emulatedDevice': device, 'executablePath': executable, 'executed': True,
                    'touchCapabilityMetadata': touch,
                    'externalRequestsBlocked': len(blocked)})
                context.close()
            except Exception as error:
                check(engine + '_mobile_tasks_complete', False, str(error))
                browsers.append({'engine': engine, 'emulatedDevice': device,
                                 'executed': browser is not None, 'error': str(error)})
            finally:
                if browser is not None:
                    browser.close()
    check('mobile_tasks_leave_the_delivered_artifact_unchanged',
          hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash)
    return {'schema': 'ygo-mobile-accessibility/v1', 'pass': all(x['pass'] for x in checks),
        'buildId': build['buildId'], 'htmlSha256': html_hash,
        'artifactMode': 'DELIVERED_BYTES', 'sourceInjection': False,
        'checks': checks, 'details': details, 'browsers': browsers,
        'executedEngines': [x['engine'] for x in browsers if x['executed']],
        'textResizeEmulation': 'Twofold computed font sizes in registered workbenches; presentation overrides only.',
        'limitations': ['Device, viewport, coarse pointer and text enlargement are emulated; no physical phone was tested.',
            'Touch capability metadata differs between desktop-engine ports; the export task requires a trusted browser touch event.',
            'The native OS file picker and assistive technology were not tested.',
            'These functional tasks do not establish complete WCAG conformance or universal mobile compatibility.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/mobile-accessibility-results.json')
    args = parser.parse_args()
    start = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - start, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'executedEngines': result['executedEngines'],
                      'elapsedSeconds': result['elapsedSeconds']}))
    raise SystemExit(0 if result['pass'] else 1)
