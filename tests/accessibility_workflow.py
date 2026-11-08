#!/usr/bin/env python3
"""Offline keyboard/naming tasks over exact delivered HTML bytes.

The retained image-preview shell has no retained public opener. Its focus
infrastructure is exercised with an explicitly identified presentation fixture;
this is not evidence of a complete card-preview or assistive-technology flow.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import time

from playwright.sync_api import sync_playwright
from release5_browser import load_example, ready

ROOT = Path(__file__).resolve().parents[1]


def contrast(foreground, background):
    def luminance(value):
        channels = [int(x) / 255 for x in re.findall(r'\d+', value)[:3]]
        assert len(channels) == 3
        linear = [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in channels]
        return sum(a * b for a, b in zip(linear, [.2126, .7152, .0722]))
    high, low = sorted([luminance(foreground), luminance(background)], reverse=True)
    return (high + .05) / (low + .05)


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    digest = hashlib.sha256(html).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-keyboard-delivery.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    with sync_playwright() as runtime:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = runtime.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)

        def deliver(route):
            if route.request.url == target:
                route.fulfill(status=200, content_type='text/html; charset=utf-8', body=html)
            else:
                blocked.append(route.request.url)
                route.abort()

        context.route('**/*', deliver)
        context.set_offline(True)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(target, wait_until='domcontentloaded')
        ready(page)
        page.wait_for_function('()=>window.YGOAccessibility&&document.querySelector(".fmt").hasAttribute("aria-pressed")')
        check('keyboard_tasks_boot_exact_delivered_bytes_offline', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>YGO_BUILD_MANIFEST.buildId') == build['buildId']
              and page.evaluate('()=>navigator.onLine===false'))
        check('presentation_module_keeps_uncertainty_explicit', page.evaluate('''()=>
          YGOAccessibility.completeAccessibilityCertified===false
          &&YGOAccessibility.assistiveTechnologyTested===false
          &&YGOAccessibility.physicalDevicesTested===false'''))

        labels = page.evaluate('''()=>['name','arch','date','archAutoMode','cardSearch','cardType',
          'cardRole','dbSearch','dbRole','dbArchetype','dbFunction','banSearch','banFilter'].map(id=>{
          const element=document.getElementById(id);return{id,named:!!element&&(
            [...element.labels||[]].some(label=>label.textContent.trim())
            ||!!element.getAttribute('aria-label')?.trim()
            ||!!element.getAttribute('aria-labelledby')?.split(/\\s+/).some(id=>document.getElementById(id)?.textContent.trim()))};})''')
        check('legacy_deck_catalog_and_restriction_controls_have_names', all(row['named'] for row in labels), labels)
        page.keyboard.press('Tab')
        check('first_keyboard_stop_is_the_visible_skip_link', page.evaluate('''()=>{
          const link=document.querySelector('.ygo-skip-links a'),rect=link.getBoundingClientRect();
          return document.activeElement===link&&rect.top>=0&&rect.bottom<innerHeight;}'''))
        page.keyboard.press('Enter')
        check('skip_link_moves_focus_to_deck_data', page.evaluate('()=>document.activeElement.id==="ygoMainContent"'))
        check('all_skip_link_destinations_are_focusable_existing_sections', page.evaluate('''()=>
          [...document.querySelectorAll('.ygo-skip-links a')].every(link=>{
            const target=document.getElementById(link.hash.slice(1));
            return target&&target.getAttribute('tabindex')==='-1';})'''))

        page.locator('#name').focus()
        focus = page.locator('#name').evaluate('''element=>{const style=getComputedStyle(element);
          return{style:style.outlineStyle,width:parseFloat(style.outlineWidth),color:style.outlineColor,
            foreground:style.color,background:style.backgroundColor};}''')
        check('legacy_name_input_has_visible_keyboard_focus', focus['style'] == 'solid' and focus['width'] >= 3, focus)
        check('name_input_text_and_focus_meet_sampled_contrast_thresholds',
              contrast(focus['foreground'], focus['background']) >= 4.5
              and contrast(focus['color'], focus['background']) >= 3,
              {'textRatio': round(contrast(focus['foreground'], focus['background']), 2),
               'focusRatio': round(contrast(focus['color'], focus['background']), 2),
               'scope': 'Only this opaque sampled input; not a complete contrast audit.'})
        page.locator('.formats .fmt[data-f="OCG"]').focus()
        page.keyboard.press('Space')
        page.wait_for_function('()=>document.querySelector(".formats .fmt[data-f=OCG]").getAttribute("aria-pressed")==="true"')
        check('format_selection_exposes_exactly_one_pressed_button', page.evaluate('''()=>
          document.querySelectorAll('.formats .fmt[aria-pressed="true"]').length===1
          &&document.querySelector('.formats .fmt[aria-pressed="true"]').dataset.f==='OCG' ''')
              and page.locator('.formats').get_attribute('role') == 'group')
        page.locator('.formats .fmt[data-f="TCG"]').focus()
        page.keyboard.press('Enter')
        page.wait_for_function('()=>document.querySelector(".formats .fmt[data-f=TCG]").getAttribute("aria-pressed")==="true"')
        check('format_selection_can_return_to_tcg_with_keyboard', page.locator('.fmt.active').get_attribute('data-f') == 'TCG')

        page.locator('.deck-tabs [data-zone="extra"]').focus()
        page.keyboard.press('Enter')
        page.wait_for_function('()=>document.querySelector(".deck-tab[data-zone=extra]").getAttribute("aria-pressed")==="true"')
        check('deck_zone_buttons_expose_selection_and_controlled_list', page.evaluate('''()=>
          document.querySelectorAll('.deck-tabs [aria-pressed="true"]').length===1
          &&document.querySelector('.deck-tab[data-zone=extra]').getAttribute('aria-controls')==='deckList'
          &&document.getElementById('zoneLabel').textContent.includes('EXTRA')'''))
        page.locator('.deck-tabs [data-zone="main"]').focus()
        page.keyboard.press('Enter')
        page.wait_for_function('()=>document.querySelector(".deck-tab[data-zone=main]").getAttribute("aria-pressed")==="true"')
        check('deck_zone_can_return_to_main_with_keyboard', page.locator('.deck-tab.active').get_attribute('data-zone') == 'main')
        page.locator('.lab-tabs .lab-tab').nth(1).focus()
        page.keyboard.press('Space')
        page.wait_for_function('()=>document.querySelector(".lab-tabs .lab-tab:nth-child(2)").getAttribute("aria-pressed")==="true"')
        check('laboratory_buttons_expose_selection_and_controlled_panel',
              page.locator('#lab-ban').is_visible()
              and page.locator('.lab-tabs .lab-tab').nth(1).get_attribute('aria-controls') == 'lab-ban'
              and page.locator('.lab-tabs [aria-pressed="true"]').count() == 1)
        page.locator('.lab-tabs .lab-tab').first.focus()
        page.keyboard.press('Enter')
        page.wait_for_function('()=>document.querySelector(".lab-tabs .lab-tab").getAttribute("aria-pressed")==="true"')
        check('laboratory_can_return_to_catalog_with_keyboard', page.locator('#lab-db').is_visible())
        page.locator('#dbSearch').focus()
        check('legacy_catalog_search_has_global_visible_focus', page.locator('#dbSearch').evaluate('''element=>{
          const style=getComputedStyle(element);return style.outlineStyle==='solid'&&parseFloat(style.outlineWidth)>=3;}'''))
        check('toast_exposes_a_polite_atomic_status',
              page.locator('#toast').get_attribute('role') == 'status'
              and page.locator('#toast').get_attribute('aria-live') == 'polite'
              and page.locator('#toast').get_attribute('aria-atomic') == 'true')

        initial = load_example(page, 'invoked')
        check('keyboard_fixture_starts_from_a_physical_unplayed_example',
              initial['scenario'] is None and initial['competitiveScore'] is None
              and bool(initial['current']['zones'][0]['hand']))
        baseline = page.evaluate('()=>JSON.stringify(YGOAdvancedWorkbench.report())')

        def open_preview_fixture():
            # Presentation-only compatibility fixture for the retained modal shell.
            # No card engine, action handler, source script or dataset is injected.
            page.locator('#ygoExampleLoad').focus()
            page.evaluate('''()=>{
              const image=document.getElementById('v12ModalImg');
              image.src=document.querySelector('.header img').src;
              image.alt='Imagen incorporada para comprobar el diálogo';
              document.getElementById('v12Modal').classList.add('open');}''')
            page.wait_for_function('()=>document.getElementById("v12Modal").getAttribute("aria-hidden")==="false"&&document.activeElement===document.querySelector("#v12Modal button.close")')

        open_preview_fixture()
        modal = page.locator('#v12Modal')
        check('retained_preview_shell_exposes_a_named_modal_dialog',
              modal.get_attribute('role') == 'dialog' and modal.get_attribute('aria-modal') == 'true'
              and page.locator('#' + modal.get_attribute('aria-labelledby')).inner_text() == 'Vista ampliada de la carta')
        check('preview_close_control_is_a_named_native_button', page.locator('#v12Modal button.close').get_attribute('aria-label') == 'Cerrar vista ampliada de la carta'
              and page.locator('#v12Modal button.close').get_attribute('type') == 'button')
        check('preview_opens_with_focus_inside_and_background_inert', page.evaluate('''()=>{
          const modal=document.getElementById('v12Modal');return modal.contains(document.activeElement)
            &&document.getElementById('name').closest('[inert]')!==null
            &&!modal.closest('[inert]');}'''))
        page.keyboard.press('Tab')
        check('preview_tab_wraps_inside_the_dialog', page.locator('#v12Modal button.close').evaluate('(element)=>document.activeElement===element'))
        page.keyboard.press('Shift+Tab')
        check('preview_shift_tab_wraps_inside_the_dialog', page.locator('#v12Modal button.close').evaluate('(element)=>document.activeElement===element'))
        page.evaluate('()=>document.getElementById("name").focus()')
        check('inert_background_cannot_steal_preview_focus', page.locator('#v12Modal button.close').evaluate('(element)=>document.activeElement===element'))
        page.keyboard.press('Escape')
        page.wait_for_function('()=>document.getElementById("v12Modal").getAttribute("aria-hidden")==="true"')
        check('preview_escape_restores_original_focus_and_background', page.evaluate('''()=>
          document.activeElement.id==='ygoExampleLoad'
          &&!document.getElementById('name').closest('[inert]')
          &&!document.querySelector('.ygo-skip-links').inert'''))
        open_preview_fixture()
        page.keyboard.press('Enter')
        page.wait_for_function('()=>!document.getElementById("v12Modal").classList.contains("open")')
        check('preview_native_close_button_works_with_enter', page.locator('#ygoExampleLoad').evaluate('(element)=>document.activeElement===element'))
        open_preview_fixture()
        modal.click(position={'x': 2, 'y': 2})
        page.wait_for_function('()=>document.getElementById("v12Modal").getAttribute("aria-hidden")==="true"')
        check('preview_backdrop_closes_and_restores_focus', page.locator('#ygoExampleLoad').evaluate('(element)=>document.activeElement===element'))
        open_preview_fixture()
        page.evaluate('()=>document.getElementById("v12Modal").classList.remove("open")')
        page.wait_for_function('()=>document.getElementById("v12Modal").getAttribute("aria-hidden")==="true"')
        check('legacy_class_removal_also_restores_focus', page.locator('#ygoExampleLoad').evaluate('(element)=>document.activeElement===element'))
        check('keyboard_and_modal_tasks_preserve_the_physical_scenario', page.evaluate('()=>JSON.stringify(YGOAdvancedWorkbench.report())') == baseline)
        check('keyboard_tasks_raise_no_uncaught_page_errors', not errors, errors)
        version = browser.version
        context.close()
        browser.close()
    check('keyboard_tasks_leave_the_delivered_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-accessibility-workflow/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'engine': 'chromium', 'engineVersion': version, 'externalRequestsBlocked': blocked,
            'presentationFixture': 'The retained preview shell is opened by its existing class; no retained public opener is asserted.',
            'completeAccessibilityCertified': False, 'assistiveTechnologyTested': False,
            'physicalDevicesTested': False,
            'limitations': ['Keyboard and naming tasks cover the listed controls and modal infrastructure only.',
                'The sampled opaque input contrast does not establish a complete text, graphic or focus-contrast audit.',
                'No screen reader, native OS file picker or physical device was tested.',
                'The preview fixture does not establish a complete publicly triggered card-preview workflow.',
                'Criterion C30 remains pending; these tasks do not certify complete WCAG conformance.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/accessibility-workflow-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']],
                      'elapsedSeconds': result['elapsedSeconds']}))
    raise SystemExit(0 if result['pass'] else 1)
