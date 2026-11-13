#!/usr/bin/env python3
"""Offline delivered-byte witnesses for Faith's mandatory Flip and saved replay."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from blue_eyes_browser import import_scenario
from expanded_examples_browser import report
from release5_browser import load_example, ready
from release8_browser import cards, undo_to

ROOT = Path(__file__).resolve().parents[1]
FAITH, INVOCATION, BLUE_EYES = 31560081, 74063034, 89631139


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-release22.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def actions(page, kind):
        return page.evaluate('kind=>YGOAdvancedWorkbench.actions().filter(a=>a.type===kind)', kind)

    def step(page, kind, **criteria):
        page.locator('#ygoDuelActionFilter').fill(kind)
        chosen = page.evaluate('''({kind,criteria})=>YGOAdvancedWorkbench.actions().map((action,index)=>({action,index}))
          .find(({action:a})=>a.type===kind&&Object.entries(criteria).every(([key,value])=>{
            if(key==='noResponse')return !a.response&&!a.responseUid&&!(a.counterResponses||[]).length;
            return JSON.stringify(a[key])===JSON.stringify(value);
          }))||null''', {'kind': kind, 'criteria': criteria})
        assert chosen is not None, 'No rendered action: ' + kind + ' ' + str(criteria)
        option = page.locator('#ygoDuelActions option[value="' + str(chosen['index']) + '"]')
        assert option.count() == 1, 'Reviewed Flip action is absent from the rendered page'
        label = option.inner_text()
        previous = len((report(page).get('scenario') or {}).get('actions', []))
        page.locator('#ygoDuelActions').select_option(str(chosen['index']))
        page.locator('#ygoDuelStep').click()
        page.wait_for_function('n=>YGOAdvancedWorkbench.report().scenario?.actions.length===n', arg=previous + 1)
        value = report(page)
        assert value['scenario']['replay']['pass'] is True
        return value, label

    def export_report(page, filename):
        with page.expect_download() as pending:
            page.locator('#ygoAdvancedExport').click()
        value = json.loads(Path(pending.value.path()).read_text())
        (ROOT / 'tests' / filename).write_text(json.dumps(value, ensure_ascii=False) + '\n')
        return value

    def import_report(page, value, accepted, name):
        page.locator('#ygoAdvancedImport').set_input_files({
            'name': name, 'mimeType': 'application/json', 'buffer': json.dumps(value).encode()})
        prefix = 'Informe reanudado:' if accepted else 'No completado:'
        page.wait_for_function('prefix=>document.getElementById("ygoAdvancedImport").value===""&&document.getElementById("ygoAdvancedStatus").textContent.startsWith(prefix)', arg=prefix)
        return report(page)

    with sync_playwright() as runtime:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = runtime.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(accept_downloads=True, viewport={'width': 1440, 'height': 1000})

        def deliver(route):
            if route.request.url == target:
                route.fulfill(status=200, content_type='text/html; charset=utf-8', body=document)
            else:
                blocked.append(route.request.url)
                route.abort()

        context.route('**/*', deliver)
        context.set_offline(True)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(target, wait_until='domcontentloaded')
        ready(page)
        check('release22_runs_manifest_bound_bytes_offline', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn',
                        'synchro', 'azure', 'spirit-reborn', 'wolf-reborn', 'albaz', 'hayabusa', 'faith-flip']
        check('twenty_two_visible_examples_preserve_all_previous_ids',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        try:
            initial = load_example(page, 'faith-flip')
            faith = cards(initial, 0, 'monster', FAITH)[0]
            invocation = cards(initial, 0, 'gy', INVOCATION)[0]
            uid, spell_uid = faith['uid'], invocation['uid']
            check('faith_example_starts_as_an_unplayed_declared_set_field',
                  initial['scenario'] is None and faith['faceUp'] is False and faith['position'] == 'DEFENSE'
                  and faith['summonTurn'] == 1 and initial['current']['turn'] == 2
                  and initial['current']['normalSummonAvailable'][0] is True
                  and initial['current']['context']['initialHistoryCertified'] is False
                  and initial['goalProgress']['achieved'] is False)
            guide = page.locator('#ygoExampleInstructions').inner_text()
            check('the_visible_guide_explains_mandatory_target_recovery_and_partial_damage_step',
                  'efecto FLIP es obligatorio' in guide and 'no se paga coste' in guide
                  and 'no se baraja' in guide and 'Damage Step ni SEGOC general' in guide
                  and 'provisional' in guide)
            flipped, label = step(page, 'DUEL_FLIP_SUMMON', player=0, sourceUid=uid)
            field = cards(flipped, 0, 'monster', FAITH)[0]
            check('visible_flip_preserves_the_copy_and_normal_summon_budget',
                  'Invocar por Volteo' in label and field['uid'] == uid and field['faceUp'] is True
                  and field['position'] == 'ATTACK' and field['summonType'] == 'FLIP'
                  and flipped['current']['normalSummonAvailable'][0] is True)
            check('only_the_mandatory_faith_resolution_can_continue_after_flip',
                  page.evaluate('()=>YGOAdvancedWorkbench.actions().every(a=>a.type==="DUEL_FLIP_FAITH_RECOVER")')
                  and len(actions(page, 'DUEL_FLIP_FAITH_RECOVER')) == 1
                  and 'efecto FLIP obligatorio pendiente' in page.locator('#ygoDuelBoard').inner_text()
                  and flipped['goalProgress']['achieved'] is False)
            check('a_field_only_goal_remains_pending_until_the_flip_is_resolved',
                  page.evaluate('''()=>{const st=YGOAdvancedWorkbench.report().current,g={requiredFieldIds:[31560081]};
                    return !YGORecommendations.goalMatches(st,g)&&!YGORecommendations.goalProgress(st,g).achieved
                      &&YGORecommendations.goalProgress(st,g).requirements.some(r=>r.key==='pendingResolution'&&!r.fulfilled);}'''))
            pending = export_report(page, 'release22-pending-flip-report.json')
            recovered, label = step(page, 'DUEL_FLIP_FAITH_RECOVER', player=0, sourceUid=uid, targetUid=spell_uid, noResponse=True)
            check('faith_recovers_the_same_targeted_gy_copy_to_the_hand',
                  'Recuperar Magia' in label and 'sin coste' in label
                  and cards(recovered, 0, 'hand', INVOCATION)[0]['uid'] == spell_uid
                  and cards(recovered, 0, 'gy', INVOCATION) == []
                  and cards(recovered, 0, 'monster', FAITH)[0]['uid'] == uid)
            event_types = [row['type'] for row in recovered['scenario']['actions'][-1]['events']]
            check('recovery_is_revealed_without_deck_search_or_shuffle',
                  'FAITH_RECOVER_SPELL' in event_types and 'CONFIRM_CARDS' in event_types
                  and not any('SEARCH' in event or 'SHUFFLE' in event for event in event_types)
                  and recovered['scenario']['actions'][-1]['paid'] == [])
            check('the_two_action_goal_replays_with_provisional_competitive_scoring',
                  recovered['goalProgress']['achieved'] is True
                  and len(recovered['scenario']['actions']) == 2
                  and recovered['scenario']['replay']['pass'] is True and recovered['competitiveScore'] is None)
            completed = export_report(page, 'release22-recovered-flip-report.json')
            restored = import_report(page, pending, True, 'faith-pending.json')
            check('import_reexecutes_the_flip_and_restores_its_mandatory_pending_target',
                  restored['current'] == pending['current'] and len(actions(page, 'DUEL_FLIP_FAITH_RECOVER')) == 1
                  and cards(restored, 0, 'gy', INVOCATION)[0]['uid'] == spell_uid
                  and restored['goalProgress']['achieved'] is False)
            restored = import_report(page, completed, True, 'faith-completed.json')
            check('completed_export_reimports_with_identical_physical_state',
                  restored['current'] == completed['current'] and restored['scenario']['replay']['pass'] is True)
            tampered = copy.deepcopy(completed)
            tampered['scenario']['actions'][1]['targetUid'] = uid
            rejected = import_report(page, tampered, False, 'faith-forged-target.json')
            check('a_changed_target_is_rejected_without_replacing_the_accepted_state',
                  rejected['current'] == completed['current'] and rejected['scenario']['actions'] == completed['scenario']['actions'])
            undone = undo_to(page, 1)
            check('undoing_the_recovery_restores_the_unresolved_flip',
                  undone['current'] == pending['current'] and undone['goalProgress']['achieved'] is False
                  and len(actions(page, 'DUEL_FLIP_FAITH_RECOVER')) == 1)
            load_example(page, 'faith-flip')
            search = page.evaluate('''async()=>YGOComboWorkbench.run({maxDepth:2,maxStates:120,maxMs:3000,maxTurns:1})''')
            lines = [line for line in search.get('lines', []) if [a['type'] for a in line['actions']] == ['DUEL_FLIP_SUMMON', 'DUEL_FLIP_FAITH_RECOVER']]
            check('the_search_contains_a_complete_two_action_flip_recovery_line',
                  bool(lines) and all(not line['state'].get('pendingTriggers')
                                      and not line['state'].get('duel', {}).get('battlePacket') for line in lines))
            page.locator('#ygoDuelFromLine').click()
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario?.actions.length===2')
            from_search = report(page)
            check('continuing_a_search_result_replays_both_mandatory_actions',
                  from_search['scenario']['replay']['pass'] is True
                  and from_search['goalProgress']['achieved'] is True
                  and cards(from_search, 0, 'hand', INVOCATION)[0]['uid'] == spell_uid)
        except Exception as error:
            check('the_visible_flip_recovery_export_and_search_route_completes', False, str(error))
        try:
            value = page.evaluate('()=>YGOScenarioExamples.get("faith-flip")')
            value['setup']['placements'] = value['setup']['placements'][:1]
            import_scenario(page, value)
            initial = report(page)
            uid = cards(initial, 0, 'monster', FAITH)[0]['uid']
            step(page, 'DUEL_FLIP_SUMMON', player=0, sourceUid=uid)
            null_actions = actions(page, 'DUEL_FLIP_FAITH_RECOVER')
            check('without_a_legal_spell_the_obligatory_resolution_is_still_visible',
                  len(null_actions) == 1 and null_actions[0]['targetUid'] is None
                  and page.evaluate('()=>YGOAdvancedWorkbench.actions().every(a=>a.type==="DUEL_FLIP_FAITH_RECOVER")'))
            finished, label = step(page, 'DUEL_FLIP_FAITH_RECOVER', player=0, sourceUid=uid, targetUid=None, noResponse=True)
            check('the_no_target_effect_resolves_without_a_decline_or_fabricated_recovery',
                  'sin objetivo legal' in label and cards(finished, 0, 'hand', INVOCATION) == []
                  and not finished['current']['pendingTriggers']
                  and any(event['type'] == 'FAITH_RECOVERY_NO_TARGET' for event in finished['scenario']['actions'][-1]['events'])
                  and finished['scenario']['replay']['pass'] is True)
        except Exception as error:
            check('the_visible_no_target_route_completes', False, str(error))
        try:
            value = page.evaluate('()=>YGOScenarioExamples.get("faith-flip")')
            value['setup'].update({'activePlayer': 1, 'phase': 'BATTLE'})
            value['setup']['placements'].append({
                'player': 1, 'from': 'deck', 'cardId': BLUE_EYES, 'zone': 'monster',
                'zoneIndex': 0, 'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1})
            import_scenario(page, value)
            initial = report(page)
            uid = cards(initial, 0, 'monster', FAITH)[0]['uid']
            spell_uid = cards(initial, 0, 'gy', INVOCATION)[0]['uid']
            attacker_uid = cards(initial, 1, 'monster', BLUE_EYES)[0]['uid']
            attacked, _ = step(page, 'DUEL_ATTACK', player=1, attackerUid=attacker_uid, targetUid=uid)
            packet = attacked['current']['duel']['battlePacket']
            check('a_real_opponent_attack_reveals_faith_and_keeps_her_on_field_for_the_flip',
                  packet['stage'] == 'AFTER_DAMAGE_CALCULATION' and packet['targetUid'] == uid
                  and cards(attacked, 0, 'monster', FAITH)[0]['faceUp'] is True
                  and cards(attacked, 0, 'gy', FAITH) == []
                  and attacked['current']['lp'] == [8000, 8000]
                  and attacked['current']['activePlayer'] == 1)
            check('the_attack_budget_is_spent_before_the_defenders_mandatory_flip',
                  page.evaluate('''uid=>{const s=YGOAdvancedWorkbench.report().current,b=YGODuelPhases.attackBudget(s,uid);
                    return b.spent===1&&b.remaining===0;}''', attacker_uid)
                  and page.evaluate('()=>YGOAdvancedWorkbench.actions().every(a=>a.type==="DUEL_FLIP_FAITH_RECOVER"&&a.player===0)')
                  and 'Batalla pendiente después del cálculo de daño' in page.locator('#ygoDuelBoard').inner_text())
            battle_pending = export_report(page, 'release22-pending-battle-report.json')
            resolved, _ = step(page, 'DUEL_FLIP_FAITH_RECOVER', player=0, sourceUid=uid, targetUid=spell_uid, noResponse=True)
            check('battle_faith_recovers_before_the_same_copy_is_sent_to_the_graveyard',
                  cards(resolved, 0, 'hand', INVOCATION)[0]['uid'] == spell_uid
                  and cards(resolved, 0, 'gy', FAITH)[0]['uid'] == uid
                  and cards(resolved, 0, 'monster', FAITH) == []
                  and not resolved['current']['duel'].get('battlePacket')
                  and not resolved['current']['pendingTriggers']
                  and resolved['scenario']['replay']['pass'] is True)
            events = resolved['scenario']['actions'][-1]['events']
            recovery_index = next(i for i, event in enumerate(events) if event['type'] == 'FAITH_RECOVER_SPELL')
            departure_indices = [i for i, event in enumerate(events)
                                 if event['type'] == 'DESTROYED_BY_BATTLE' and event.get('uid') == uid and event.get('destination') == 'gy']
            check('the_record_orders_recovery_before_one_final_battle_departure',
                  len(departure_indices) == 1 and recovery_index < departure_indices[0]
                  and any(event['type'] == 'BATTLE_PACKET_COMPLETED' for event in events))
            battle_completed = export_report(page, 'release22-recovered-battle-report.json')
            resumed = import_report(page, battle_pending, True, 'faith-battle-pending.json')
            check('import_reconstructs_the_physical_attack_and_deferred_battle_packet',
                  resumed['current'] == battle_pending['current']
                  and cards(resumed, 0, 'monster', FAITH)[0]['uid'] == uid
                  and resumed['scenario']['replay']['pass'] is True
                  and len(actions(page, 'DUEL_FLIP_FAITH_RECOVER')) == 1)
            step(page, 'DUEL_FLIP_FAITH_RECOVER', player=0, sourceUid=uid, targetUid=spell_uid, noResponse=True)
            check('a_resumed_battle_reaches_the_same_final_state_and_fresh_replay',
                  report(page)['current'] == battle_completed['current']
                  and report(page)['scenario']['replay']['pass'] is True)
        except Exception as error:
            check('the_visible_deferred_battle_and_saved_resume_route_completes', False, str(error))
        try:
            value = page.evaluate('()=>YGOScenarioExamples.get("faith-flip")')
            value['opponentDeck']['extra'].append({'id': 75286621, 'qty': 1})
            value['context'].update({'opponentPolicy': 'RESPONSES_EXPLICIT',
                                     'responseTypes': ['MECHABA'], 'responsePolicy': 'CHOICE_BRANCHES'})
            value['setup'].update({'activePlayer': 1, 'phase': 'BATTLE'})
            value['setup']['placements'].append({
                'player': 1, 'from': 'extra', 'cardId': 75286621, 'zone': 'monster',
                'zoneIndex': 0, 'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1})
            import_scenario(page, value)
            initial = report(page)
            uid = cards(initial, 0, 'monster', FAITH)[0]['uid']
            spell_uid = cards(initial, 0, 'gy', INVOCATION)[0]['uid']
            mechaba_uid = cards(initial, 1, 'monster', 75286621)[0]['uid']
            step(page, 'DUEL_ATTACK', player=1, attackerUid=mechaba_uid, targetUid=uid)
            candidates = [a for a in actions(page, 'DUEL_FLIP_FAITH_RECOVER')
                          if a.get('response', {}).get('type') == 'MECHABA' and not a.get('counterResponses')]
            assert candidates, 'No reviewed Mechaba response after damage calculation'
            response_choice = candidates[0]['response']
            cost_uid = response_choice['costUid']
            negated, label = step(page, 'DUEL_FLIP_FAITH_RECOVER', player=0, sourceUid=uid,
                                  targetUid=spell_uid, response=response_choice)
            check('the_visible_damage_step_mechaba_response_pays_a_physical_monster',
                  'responde Mechaba' in label and any(row['uid'] == cost_uid for row in negated['current']['zones'][1]['gy'])
                  and any(payment['uid'] == cost_uid for payment in negated['scenario']['actions'][-1]['paid']))
            check('mechaba_negates_and_banishes_the_field_faith_before_battle_cleanup',
                  cards(negated, 0, 'banished', FAITH)[0]['uid'] == uid
                  and cards(negated, 0, 'gy', FAITH) == []
                  and cards(negated, 0, 'gy', INVOCATION)[0]['uid'] == spell_uid
                  and cards(negated, 0, 'hand', INVOCATION) == []
                  and not negated['current']['duel'].get('battlePacket')
                  and not negated['current']['pendingTriggers']
                  and negated['scenario']['replay']['pass'] is True)
            events = negated['scenario']['actions'][-1]['events']
            check('battle_cleanup_does_not_send_the_banished_faith_to_the_graveyard_again',
                  not any(event['type'] == 'DESTROYED_BY_BATTLE' and event.get('uid') == uid and event.get('destination') == 'gy' for event in events)
                  and any(event['type'] == 'BATTLE_PACKET_COMPLETED' for event in events))
            exported = export_report(page, 'release22-mechaba-battle-report.json')
            resumed = import_report(page, exported, True, 'faith-mechaba-battle.json')
            check('the_mechaba_battle_export_reexecutes_cost_banish_and_cleanup',
                  resumed['current'] == exported['current'] and resumed['scenario']['replay']['pass'] is True
                  and resumed['competitiveScore'] is None)
        except Exception as error:
            check('the_visible_mechaba_damage_step_route_completes', False, str(error))
        check('release22_raises_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('release22_leaves_the_compiled_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release22-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['The initial set and graveyard are explicit assumptions; prior play is not reconstructed.',
                            'Faith recovers only reviewed own-graveyard Spell targets; no general FLIP catalogue is inferred.',
                            'This GUI witness covers manual Flip, no-target resolution, search, deferred battle, Mechaba negation, export and replay; other response combinations are checked separately.',
                            'General Damage Step, SEGOC, physical devices and competitive calibration remain outside this GUI witness.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release22-browser-results.json')
    args = parser.parse_args()
    start = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - start, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']]}))
    raise SystemExit(0 if result['pass'] else 1)
