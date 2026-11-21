#!/usr/bin/env python3
"""Physical R23 UI witnesses over the final delivered HTML, without injection.

Declared fields are assumptions. Every claimed cost, summon, chain, destruction
and transfer below comes from rendered controls and is freshly replayed. The
manual-evidence fixture tests transport semantics; it is not a device witness.
"""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from browser_offline import new_offline_page
from blue_eyes_browser import import_scenario
from expanded_examples_browser import report
from release5_browser import load_example, ready
from release8_browser import cards

ROOT = Path(__file__).resolve().parents[1]
NORMALS = [23771716, 47372349, 97127906, 70924884, 64428736, 99785935,
           17968114, 42431843, 43230671, 89904598, 85639257, 75889523, 48202661, 15025844]
FISH, MONKEY, BLUE = 23771716, 47372349, 89631139
SPARK, MECHABA, ROAR, BALELYNX = 83994433, 75286621, 51339637, 14812471
FAITH, INVOCATION = 31560081, 74063034
MOYE, LONGYUAN, CHIXIAO, LIBRARIAN = 20001443, 93490856, 69248256, 90953320
CORN = 51735257
GOLDRIVER, STEELEN, SILVERD, VOLFLAME, METAL_FUSION = 33256280, 60473572, 7868571, 69351984, 73594093
LEGACY_IDS = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
              'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn',
              'synchro', 'azure', 'spirit-reborn', 'wolf-reborn', 'albaz', 'hayabusa', 'faith-flip']
R24_IDS = ['branded-priority', 'tenyi-priority', 'salamangreat-priority', 'metalfoes-priority']
NEW_IDS = ['priority-chain', 'simultaneous-triggers', 'xyz-corn', 'pendulum-metalfoes',
           'draw-sequences', 'damage-step']


def deck(main=(), extra=()):
    counts = {}
    for card_id in main:
        counts[card_id] = counts.get(card_id, 0) + 1
    left = 40 - sum(counts.values())
    for card_id in NORMALS:
        if not left:
            break
        if card_id not in counts:
            counts[card_id] = min(3, left)
            left -= counts[card_id]
    assert left == 0 and all(1 <= quantity <= 3 for quantity in counts.values())
    extras = {}
    for card_id in extra:
        extras[card_id] = extras.get(card_id, 0) + 1
    return {'main': [{'id': n, 'qty': q} for n, q in counts.items()],
            'extra': [{'id': n, 'qty': q} for n, q in extras.items()], 'side': []}


def copies(value):
    return [row['id'] for row in value['main'] for _ in range(row['qty'])]


def opening(value, wanted, reserved):
    available = copies(value)
    for card_id in reserved:
        available.remove(card_id)
    result = list(wanted)
    for card_id in result:
        available.remove(card_id)
    for card_id in available:
        if len(result) == 5:
            break
        result.append(card_id)
    assert len(result) == 5
    return result


def monster(player, card_id, slot=0, extra=False, **more):
    return {'player': player, 'from': 'extra' if extra else 'deck', 'cardId': card_id,
            'zone': 'monster', 'zoneIndex': slot, 'faceUp': True,
            'position': 'ATTACK', 'summonTurn': 1, **more}


def fixture(page, own_main=(), own_extra=(), rival_main=(), rival_extra=(),
            own_hand=(), rival_hand=(), placements=(), phase='MAIN 1', modes=False, goal=None):
    own, rival = deck(own_main, own_extra), deck(rival_main, rival_extra)
    hands = []
    for player, value, wanted in [(0, own, own_hand), (1, rival, rival_hand)]:
        reserved = [p['cardId'] for p in placements if p['player'] == player and p['from'] == 'deck']
        hands.append(opening(value, wanted, reserved))
    remain = []
    for value, hand in zip([own, rival], hands):
        current = copies(value)
        for card_id in hand:
            current.remove(card_id)
        remain.append(current)
    context = page.evaluate('()=>YGOScenarioExamples.get("invoked").context')
    context.update(duelMode=True, opponentPolicy='PASS', responseTypes=[], manualBothPlayers=True,
                   priorityMode=bool(modes), triggerOrderMode=bool(modes), damageStepMode=bool(modes))
    return {'schema': 'ygo-archetype-fixture/v1', 'name': 'R23 physical UI witness',
            'description': 'Declared initial fields; subsequent controls produce the witnessed history.',
            'deck': own, 'opponentDeck': rival, 'openingIds': hands[0],
            'opponentOpeningIds': hands[1], 'remainingDeckIds': remain[0],
            'opponentRemainingDeckIds': remain[1], 'context': context,
            'setup': {'turn': 2, 'activePlayer': 0, 'phase': phase, 'placements': list(placements)},
            'goal': goal or {'ownLpAtLeast': 8000}}


def locate(value, uid):
    for player, zones in enumerate(value['current']['zones']):
        for zone, rows in zones.items():
            for item in rows:
                if item['uid'] == uid:
                    return player, zone, item
    return None


def events(value):
    return [event for action in (value.get('scenario') or {}).get('actions', []) for event in action['events']]


def run(url=None, evidence_dir=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    evidence_dir = evidence_dir or ROOT / 'tests'
    evidence_dir.mkdir(parents=True, exist_ok=True)
    target = url or 'https://ygo-release23.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked, exports = [], {}, [], [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def section(name, function):
        try:
            function()
        except Exception as error:
            print(name, type(error).__name__ + ':', str(error), flush=True)
            check(name + '_completes', False, str(error))

    def open_details(page, selector):
        panel = page.locator(selector)
        if not panel.evaluate('(el)=>el.open'):
            panel.locator(':scope > summary').click()

    def actions(page, kind=None):
        return page.evaluate('kind=>YGOAdvancedWorkbench.actions().filter(a=>!kind||a.type===kind)', kind)

    def step(page, kind, **criteria):
        page.locator('#ygoDuelActionFilter').fill(kind)
        choice = page.evaluate('''({kind,criteria})=>{
          const state=YGOAdvancedWorkbench.report().current;
          return YGOAdvancedWorkbench.actions().map((action,index)=>({action,index})).find(({action:a})=>
            a.type===kind&&Object.entries(criteria).every(([key,value])=>{
              if(key==='sourceCard')return YGOComboEngine.helpers.baseId(YGOComboEngine.helpers.locate(state,a.sourceUid)?.item)===value;
              if(key==='noResponse')return !a.response&&!a.responseUid&&!(a.counterResponses||[]).length;
              return JSON.stringify(a[key])===JSON.stringify(value);
            }))||null;}''', {'kind': kind, 'criteria': criteria})
        assert choice is not None, 'Missing rendered action ' + kind + ': ' + json.dumps(criteria)
        option = page.locator('#ygoDuelActions option[value="' + str(choice['index']) + '"]')
        assert option.count() == 1, 'Action absent from the visible selector: ' + kind
        label = option.inner_text()
        previous = len((report(page).get('scenario') or {}).get('actions', []))
        page.locator('#ygoDuelActions').select_option(str(choice['index']))
        page.locator('#ygoDuelStep').click()
        page.wait_for_function('''n=>(YGOAdvancedWorkbench.report().scenario?.actions.length||0)===n+1
          ||document.getElementById('ygoAdvancedStatus').textContent.startsWith('Transición rechazada:')''', arg=previous)
        result = report(page)
        assert len(result['scenario']['actions']) == previous + 1, page.locator('#ygoAdvancedStatus').inner_text()
        assert result['scenario']['replay']['pass'] is True
        return result, label

    def export_report(page, suffix):
        with page.expect_download() as pending:
            page.locator('#ygoAdvancedExport').click()
        value = json.loads(Path(pending.value.path()).read_text())
        path = evidence_dir / ('release23-' + suffix + '-export.json')
        path.write_text(json.dumps(value, ensure_ascii=False) + '\n')
        exports.append(str(path))
        assert value['scenario']['replay']['pass'] is True
        return value

    def import_report(page, value, accepted, name):
        page.locator('#ygoAdvancedImport').set_input_files({'name': name, 'mimeType': 'application/json',
                                                        'buffer': json.dumps(value).encode()})
        prefix = 'Informe reanudado:' if accepted else 'No completado:'
        page.wait_for_function('prefix=>document.getElementById("ygoAdvancedImport").value===""&&document.getElementById("ygoAdvancedStatus").textContent.startsWith(prefix)', arg=prefix)
        return report(page)

    def settle_chain(page):
        for _ in range(32):
            current = report(page)['current']
            chain = current.get('duel', {}).get('priorityChain')
            if not chain:
                return report(page)
            assert not current.get('duel', {}).get('triggerOrder'), 'Choose the pending trigger order explicitly'
            step(page, 'PRIORITY_RESOLVE' if chain['stage'] == 'RESOLVE' else 'PRIORITY_PASS')
        raise AssertionError('Priority chain did not settle within its witness budget')

    with sync_playwright() as runtime:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = runtime.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)

        def deliver(route):
            if route.request.url == target:
                route.fulfill(status=200, content_type='text/html; charset=utf-8', body=document)
            else:
                blocked.append(route.request.url)
                route.abort()

        context.route('**/*', deliver)
        page = new_offline_page(context)
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(target, wait_until='domcontentloaded')
        ready(page)
        page.evaluate('''async()=>{await YGORulesWorkbench.ready;await YGODataQuality.ready;await YGOFormatEditor.ready;}''')
        check('release23_boots_the_exact_delivered_document_offline', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        ids = page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(x=>x.value)')
        check('thirty_two_visible_examples_preserve_all_twenty_eight_previous_identifiers',
              ids[:28] == LEGACY_IDS + ['priority-chain', 'simultaneous-triggers', 'xyz-corn',
                  'pendulum-metalfoes', 'damage-step', 'draw-sequences'] and ids[28:] == R24_IDS, ids)
        check('registered_extended_rule_modules_and_manual_review_api_are_present', page.evaluate('''()=>
          !!(window.YGOPriorityChain&&window.YGOTriggerOrder&&window.YGODamageStep&&window.YGOXyzSummon
            &&window.YGOPendulumSummon&&window.YGODrawSequences
            &&window.YGOAccessibility?.validateManualEvidence&&window.YGODataQuality?.reviewLedger)'''))

        def example_and_mode_controls():
            for example_id in NEW_IDS:
                initial = load_example(page, example_id)
                assert initial['scenario'] is None and initial['competitiveScore'] is None
                assert initial['current']['context']['initialHistoryCertified'] is False
                assert sum(len(zone) for zone in initial['current']['zones'][0].values()) >= 40
            check('new_examples_load_physical_unplayed_states_with_explicit_initial_assumptions', True)
            initial = load_example(page, 'invoked')
            check('lightweight_lab_snapshot_is_independent_and_does_not_claim_a_replay', page.evaluate('''()=>{
              const before=JSON.stringify(YGOAdvancedWorkbench.report()),snapshot=YGOAdvancedWorkbench.snapshot();
              const shape=snapshot.schema==='ygo-advanced-snapshot/v1'
                &&!('scenario'in snapshot)&&!('actions'in snapshot)&&!('replay'in snapshot);
              snapshot.current.lp[0]=1;snapshot.initial.lp[0]=2;snapshot.context.format='altered';
              return shape&&JSON.stringify(YGOAdvancedWorkbench.report())===before;
            }'''))
            open_details(page, '#ygoRulesWorkbench')
            before = json.dumps(report(page), sort_keys=True)
            page.locator('#ygoRulesDamage').check()
            check('damage_mode_selection_enables_required_priority_and_trigger_modes_without_playing',
                  all(page.locator('#' + name).is_checked() for name in ['ygoRulesPriority', 'ygoRulesTriggers', 'ygoRulesDamage'])
                  and json.dumps(report(page), sort_keys=True) == before)
            page.locator('#ygoRulesApply').click()
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().current?.context.damageStepMode===true')
            applied = report(page)
            check('apply_rules_restarts_the_declared_scenario_and_preserves_the_opening',
                  applied['scenario'] is None and applied['current']['context']['priorityMode'] is True
                  and applied['current']['context']['triggerOrderMode'] is True
                  and applied['current']['zones'][0]['hand'] == initial['current']['zones'][0]['hand']
                  and 'reiniciado' in page.locator('#ygoRulesStatus').inner_text())
        section('examples_and_mode_controls', example_and_mode_controls)

        def priority_flow():
            spec = fixture(page, own_main=[ROAR], own_extra=[SPARK, BALELYNX], rival_main=[BLUE],
                rival_extra=[MECHABA], rival_hand=[BLUE], placements=[monster(0, SPARK, 0, True),
                    monster(0, BALELYNX, 5, True), monster(1, MECHABA, 5, True),
                    {'player': 0, 'from': 'deck', 'cardId': ROAR, 'zone': 'spelltrap', 'zoneIndex': 0, 'faceUp': False, 'setTurn': 1}],
                goal={'requiredFieldIds': [SPARK]})
            spec['context']['priorityMode'] = True
            import_scenario(page, spec)
            initial = report(page)
            spark = cards(initial, 0, 'monster', SPARK)[0]['uid']
            cost = cards(initial, 1, 'hand', BLUE)[0]['uid']
            step(page, 'PRIORITY_ACTIVATE', effectId='STARDUST_SPARK_PROTECTION', sourceUid=spark, targetUid=spark)
            pending, label = step(page, 'PRIORITY_ACTIVATE', effectId='MECHABA_NEGATE', costUid=cost)
            check('priority_cost_is_paid_immediately_while_both_links_remain_unresolved',
                  locate(pending, cost)[1] == 'gy' and len(pending['current']['duel']['priorityChain']['links']) == 2
                  and not cards(pending, 0, 'monster', SPARK)[0].get('sparkProtection')
                  and 'Mechaba' in label)
            check('priority_board_names_the_next_player_and_unsettled_goal_is_false',
                  'Prioridad: jugador 1' in page.locator('#ygoDuelBoard').inner_text()
                  and pending['goalProgress']['achieved'] is False
                  and page.locator('#ygoCausalPolicy').is_disabled())
            saved = export_report(page, 'priority-paid-pending')
            page.locator('#ygoDuelUndo').click()
            check('undo_returns_the_same_paid_cost_only_by_reverting_its_activation', locate(report(page), cost)[1] == 'hand')
            restored = import_report(page, saved, True, 'priority-paid-pending.json')
            check('pending_chain_import_reexecutes_the_actual_cost_and_restores_its_actor',
                  locate(restored, cost)[1] == 'gy' and len(restored['current']['duel']['priorityChain']['links']) == 2)
            before = json.dumps(report(page), sort_keys=True)
            forged = copy.deepcopy(saved)
            forged['scenario']['actions'][1]['paid'][0]['uid'] = 'NONEXISTENT_PHYSICAL_COST'
            import_report(page, forged, False, 'forged-priority-cost.json')
            check('forged_chain_cost_import_is_rejected_without_replacing_the_lab', json.dumps(report(page), sort_keys=True) == before)
            check('atomic_legacy_effect_cannot_bypass_an_open_priority_chain', page.evaluate('''()=>{
              const s=YGOAdvancedWorkbench.report().current,source=s.zones[0].monster.find(x=>x.card.id===83994433);
              return YGOComboEngine.execute(s,{type:'STARDUST_SPARK_PROTECTION',player:0,sourceUid:source.uid,targetUid:source.uid}).pass===false;}'''))
            step(page, 'PRIORITY_ACTIVATE', effectId='SALAMANGREAT_ROAR')
            completed = settle_chain(page)
            resolved = [event['effectId'] for event in events(completed) if event['type'] == 'PRIORITY_LINK_RESOLVED']
            check('three_real_links_resolve_lifo_and_keep_the_negated_mechaba_cost_paid',
                  resolved == ['SALAMANGREAT_ROAR', 'MECHABA_NEGATE', 'STARDUST_SPARK_PROTECTION']
                  and locate(completed, cost)[1] == 'gy' and cards(completed, 1, 'gy', MECHABA)
                  and cards(completed, 0, 'gy', ROAR)
                  and cards(completed, 0, 'monster', SPARK)[0]['sparkProtection']['remaining'] == 1
                  and completed['goalProgress']['achieved'] is True)
            export_report(page, 'priority-resolved')
        section('priority_chain_flow', priority_flow)

        def simultaneous_flow():
            spec = fixture(page, own_main=[MOYE, LONGYUAN, 56465981], own_extra=[CHIXIAO, LIBRARIAN],
                rival_extra=[LIBRARIAN], own_hand=[MOYE, LONGYUAN, FISH, FISH, FISH], modes=True,
                placements=[monster(0, LIBRARIAN, 5, True), monster(1, LIBRARIAN, 5, True)],
                goal={'requiredFieldIds': [CHIXIAO]})
            import_scenario(page, spec)
            initial = report(page)
            assert cards(initial, 0, 'deck', 56465981), 'The declared opening must leave a real Swordsoul search target in Deck'
            longyuan = cards(initial, 0, 'hand', LONGYUAN)[0]['uid']
            step(page, 'NORMAL_SUMMON', sourceCard=MOYE)
            step(page, 'TRIGGER_ORDER_ACTIVATE', effectId='TRIGGER_MOYE_TOKEN', revealUid=longyuan)
            settle_chain(page)
            pending, _ = step(page, 'SYNCHRO_CHIXIAO')
            choices = actions(page)
            check('real_synchro_orders_turn_player_mandatory_effects_before_other_groups',
                  all(a['player'] == 0 and a.get('effectId') == 'TRIGGER_TG_HYPER_LIBRARIAN_DRAW'
                      and a['type'] == 'TRIGGER_ORDER_ACTIVATE' for a in choices)
                  and pending['goalProgress']['achieved'] is False)
            step(page, 'TRIGGER_ORDER_ACTIVATE', player=0, effectId='TRIGGER_TG_HYPER_LIBRARIAN_DRAW')
            check('opponent_mandatory_group_gets_its_own_real_activation_choice',
                  all(a['player'] == 1 and a.get('effectId') == 'TRIGGER_TG_HYPER_LIBRARIAN_DRAW' for a in actions(page)))
            step(page, 'TRIGGER_ORDER_ACTIVATE', player=1, effectId='TRIGGER_TG_HYPER_LIBRARIAN_DRAW')
            step(page, 'TRIGGER_ORDER_DECLINE', effectId='TRIGGER_CHIXIAO_SEARCH')
            step(page, 'TRIGGER_ORDER_ACTIVATE', effectId='TRIGGER_MOYE_DRAW')
            completed = settle_chain(page)
            activation = [e for e in events(completed) if e['type'] == 'TRIGGER_ORDER_ACTIVATED'][-3:]
            check('optional_decline_is_explicit_and_the_two_players_draw_in_resolved_order',
                  [e['player'] for e in activation] == [0, 1, 0]
                  and len(completed['current']['zones'][0]['hand']) == 6
                  and len(completed['current']['zones'][1]['hand']) == 6
                  and completed['current']['deckOrderKnown'] == [True, True]
                  and completed['goalProgress']['achieved'] is True
                  and any(e['type'] == 'TRIGGER_ORDER_DECLINED' for e in events(completed)))
            export_report(page, 'simultaneous-both-players')
        section('simultaneous_trigger_flow', simultaneous_flow)

        def xyz_flow():
            spec = fixture(page, own_main=[FISH, FISH], own_extra=[CORN], rival_main=[MONKEY, BLUE],
                placements=[monster(0, FISH, 0), monster(0, FISH, 1), monster(1, MONKEY, 0), monster(1, BLUE, 1)],
                goal={'opponentLpAtMost': 7000})
            import_scenario(page, spec)
            initial = report(page)
            material_ids = [x['uid'] for x in cards(initial, 0, 'monster', FISH)]
            rival = cards(initial, 1, 'monster', MONKEY)[0]['uid']
            summoned, _ = step(page, 'DUEL_XYZ_SUMMON', sourceCard=CORN, destination=0, position='DEFENSE')
            corn = cards(summoned, 0, 'monster', CORN)[0]['uid']
            check('xyz_summon_attaches_two_distinct_real_materials_without_sending_them_to_gy',
                  {x['uid'] for x in summoned['current']['zones'][0]['overlay']} == set(material_ids)
                  and all(x['overlayHostUid'] == corn for x in summoned['current']['zones'][0]['overlay'])
                  and not cards(summoned, 0, 'gy', FISH)
                  and cards(summoned, 0, 'monster', CORN)[0]['properSummonType'] == 'XYZ'
                  and 'Materiales Xyz' in page.locator('#ygoDuelBoard').inner_text())
            completed, _ = step(page, 'XYZ_CORN_SEND', sourceUid=corn, targetUid=rival, costUid=material_ids[0])
            check('corn_detaches_a_physical_cost_sends_the_target_and_inflicts_exactly_one_thousand',
                  locate(completed, material_ids[0])[1] == 'gy' and locate(completed, rival)[:2] == (1, 'gy')
                  and completed['current']['lp'] == [8000, 7000]
                  and len(completed['current']['zones'][0]['overlay']) == 1
                  and not any(a['type'] == 'XYZ_CORN_SEND' for a in actions(page)))
            export_report(page, 'xyz-detached-cost')
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='END')
            step(page, 'DUEL_NEXT_TURN')
            step(page, 'DUEL_DRAW_FOR_TURN')
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='STANDBY')
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='MAIN 1')
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='BATTLE')
            blue = cards(report(page), 1, 'monster', BLUE)[0]['uid']
            departed, _ = step(page, 'DUEL_ATTACK', player=1, attackerUid=blue, targetUid=corn)
            check('xyz_host_battle_departure_sends_remaining_material_to_its_physical_owner',
                  locate(departed, corn)[:2] == (0, 'gy')
                  and all(locate(departed, uid)[:2] == (0, 'gy') for uid in material_ids)
                  and departed['current']['zones'][0]['overlay'] == [])
            saved = export_report(page, 'xyz-host-departure')
            restored = import_report(page, saved, True, 'xyz-host-departure.json')
            check('xyz_history_import_reexecutes_attachment_detachment_and_host_cleanup', restored['current'] == departed['current'])
        section('xyz_physical_material_flow', xyz_flow)

        def pendulum_flow():
            spec = fixture(page, own_main=[GOLDRIVER, STEELEN, SILVERD, VOLFLAME, METAL_FUSION],
                own_hand=[GOLDRIVER, STEELEN, SILVERD, VOLFLAME, FISH],
                goal={'requiredFieldIds': [SILVERD, FISH, STEELEN]})
            import_scenario(page, spec)
            initial = report(page)
            own_uid = lambda card_id: cards(initial, 0, 'hand', card_id)[0]['uid']
            gold, steelen, silver, flame, fish = [own_uid(n) for n in [GOLDRIVER, STEELEN, SILVERD, VOLFLAME, FISH]]
            step(page, 'DUEL_ACTIVATE_PENDULUM_SCALE', sourceUid=gold, column=0)
            step(page, 'DUEL_ACTIVATE_PENDULUM_SCALE', sourceUid=steelen, column=4)
            moved, _ = step(page, 'METALFOES_SCALE_SET', sourceUid=gold, targetUid=steelen, column=1)
            check('a_real_scale_effect_moves_the_same_pendulum_copy_to_faceup_extra_and_sets_from_deck',
                  locate(moved, steelen)[1] == 'extra' and locate(moved, steelen)[2]['extraFaceUp'] is True
                  and cards(moved, 0, 'spelltrap', METAL_FUSION)[0]['faceUp'] is False
                  and moved['current']['deckOrderKnown'][0] is False
                  and 'Extra boca arriba' in page.locator('#ygoDuelBoard').inner_text())
            step(page, 'DUEL_ACTIVATE_PENDULUM_SCALE', sourceUid=flame, column=4)
            panel = page.locator('#ygoPendulumGroup').locator('xpath=..')
            if not panel.evaluate('(el)=>el.open'):
                panel.locator(':scope > summary').click()
            for uid, destination in [(silver, 0), (fish, 1), (steelen, 5)]:
                row = page.locator('#ygoPendulumGroup [data-uid="' + uid + '"]')
                assert row.count() == 1, 'Physical Pendulum candidate not visible: ' + uid
                row.locator('[data-pendulum-pick]').check()
                row.locator('[data-pendulum-zone]').select_option(str(destination))
                row.locator('[data-pendulum-position]').select_option('DEFENSE')
            before_steps = len(report(page)['scenario']['actions'])
            page.locator('#ygoPendulumSummonGroup').click()
            page.wait_for_function('n=>YGOAdvancedWorkbench.report().scenario.actions.length===n+1', arg=before_steps)
            completed = report(page)
            group = [e for e in events(completed) if e['type'] == 'PENDULUM_SUMMON'][-1]
            check('manual_pendulum_group_simultaneously_summons_hand_and_witnessed_faceup_extra_copies',
                  group['simultaneous'] is True and {x['uid'] for x in group['summons']} == {silver, fish, steelen}
                  and all(locate(completed, uid)[1] == 'monster' for uid in [silver, fish, steelen])
                  and next(item for item in group['summons'] if item['uid'] == steelen)['from'] == 'extra'
                  and completed['scenario']['replay']['pass'] is True
                  and completed['goalProgress']['achieved'] is True)
            check('a_second_pendulum_summon_is_not_offered_in_the_same_turn',
                  not actions(page, 'DUEL_PENDULUM_SUMMON')
                  and page.evaluate('()=>YGOPendulumSummon.candidates(YGOAdvancedWorkbench.report().current).length') == 0)
            saved = export_report(page, 'pendulum-physical-group')
            restored = import_report(page, saved, True, 'pendulum-physical-group.json')
            check('pendulum_report_replays_the_real_extra_transition_and_single_group_budget', restored['current'] == completed['current'])
        section('pendulum_group_flow', pendulum_flow)

        def pendulum_no_destination_flow():
            # The declared initial board fills all main zones. Scale activations
            # remain real actions; no state, candidate or selector is injected.
            spec = fixture(page,
                own_main=[GOLDRIVER, VOLFLAME, SILVERD, FISH, FISH, FISH, MONKEY, BLUE],
                own_hand=[GOLDRIVER, VOLFLAME, SILVERD],
                placements=[monster(0, card_id, slot) for slot, card_id
                            in enumerate([FISH, FISH, FISH, MONKEY, BLUE])])
            import_scenario(page, spec)
            initial = report(page)
            gold = cards(initial, 0, 'hand', GOLDRIVER)[0]['uid']
            flame = cards(initial, 0, 'hand', VOLFLAME)[0]['uid']
            step(page, 'DUEL_ACTIVATE_PENDULUM_SCALE', sourceUid=gold, column=0)
            step(page, 'DUEL_ACTIVATE_PENDULUM_SCALE', sourceUid=flame, column=4)
            candidates = page.evaluate('()=>YGOPendulumSummon.candidates(YGOAdvancedWorkbench.report().current)')
            check('pendulum_candidates_without_legal_destinations_do_not_gain_fallback_zones',
                  bool(candidates) and all(row['destinations'] == [] for row in candidates)
                  and page.locator('#ygoPendulumGroup [data-pendulum-zone]').count() == 0
                  and page.locator('#ygoPendulumGroup [data-pendulum-pick]').count() == 0
                  and 'zona de destino legal' in page.locator('#ygoPendulumGroup').inner_text()
                  and not actions(page, 'DUEL_PENDULUM_SUMMON'))
        section('pendulum_no_destination_flow', pendulum_no_destination_flow)

        def damage_flow():
            spec = fixture(page, own_main=[BLUE], own_extra=[MECHABA], rival_main=[FAITH, INVOCATION],
                own_hand=[FISH], modes=True, phase='BATTLE', placements=[monster(0, BLUE), monster(0, MECHABA, 5, True),
                    monster(1, FAITH, 0, faceUp=False, position='DEFENSE'),
                    {'player': 1, 'from': 'deck', 'cardId': INVOCATION, 'zone': 'gy'}])
            import_scenario(page, spec)
            initial = report(page)
            attacker, faith = cards(initial, 0, 'monster', BLUE)[0]['uid'], cards(initial, 1, 'monster', FAITH)[0]['uid']
            cost, spell = cards(initial, 0, 'hand', FISH)[0]['uid'], cards(initial, 1, 'gy', INVOCATION)[0]['uid']
            declared, _ = step(page, 'DUEL_DECLARE_ATTACK', attackerUid=attacker, targetUid=faith)
            check('explicit_attack_consumes_its_budget_before_damage_and_blocks_atomic_attack_bypass',
                  declared['current']['duel']['attackDeclarations'][attacker]['count'] == 1
                  and declared['current']['lp'] == [8000, 8000]
                  and not actions(page, 'DUEL_ATTACK') and declared['goalProgress']['achieved'] is False)
            stages, pending_checked, negation_chosen = set(), False, False
            for _ in range(60):
                current = report(page)
                state = current['current']
                damage = state.get('duel', {}).get('damageStep')
                if not damage:
                    break
                stages.add(damage['stage'])
                if state.get('duel', {}).get('triggerOrder'):
                    if not pending_checked:
                        check('faith_stays_on_field_after_calculation_until_its_mandatory_activation',
                              damage['stage'] == 'AFTER_DAMAGE_CALCULATION' and locate(current, faith)[1] == 'monster'
                              and any(x['uid'] == faith for x in damage['destroyVictims'])
                              and all(a['type'] == 'TRIGGER_ORDER_ACTIVATE' for a in actions(page)))
                        saved = export_report(page, 'damage-faith-pending')
                        restored = import_report(page, saved, True, 'damage-faith-pending.json')
                        assert restored['current'] == current['current']
                        pending_checked = True
                    step(page, 'TRIGGER_ORDER_ACTIVATE', effectId='TRIGGER_FAITH_RECOVER', targetUid=spell)
                elif state.get('duel', {}).get('priorityChain'):
                    chain = state['duel']['priorityChain']
                    eligible = [a for a in actions(page, 'PRIORITY_ACTIVATE') if a.get('effectId') == 'MECHABA_NEGATE' and a.get('costUid') == cost]
                    if eligible and not negation_chosen:
                        paid, _ = step(page, 'PRIORITY_ACTIVATE', effectId='MECHABA_NEGATE', costUid=cost)
                        assert locate(paid, cost)[:2] == (0, 'gy') and locate(paid, faith)[1] == 'monster'
                        negation_chosen = True
                    else:
                        step(page, 'PRIORITY_RESOLVE' if chain['stage'] == 'RESOLVE' else 'PRIORITY_PASS')
                else:
                    step(page, 'DUEL_ADVANCE_DAMAGE_STEP')
            else:
                raise AssertionError('Damage windows did not finish within their witness budget')
            completed = settle_chain(page)
            check('six_visible_damage_stages_finish_after_registered_negation_and_physical_cleanup',
                  len(stages) == 6 and pending_checked and negation_chosen
                  and locate(completed, faith)[:2] == (1, 'banished')
                  and locate(completed, spell)[:2] == (1, 'gy')
                  and locate(completed, cost)[:2] == (0, 'gy')
                  and not completed['current']['duel'].get('damageStep')
                  and not any(e['type'] == 'DESTROYED_BY_BATTLE' and e.get('uid') == faith for e in events(completed)))
            export_report(page, 'damage-mechaba-resolved')
        section('explicit_damage_step_flow', damage_flow)

        def probability_flow():
            load_example(page, 'draw-sequences')
            details_node = page.locator('#ygoRulesWorkbench')
            if not details_node.evaluate('(el)=>el.open'):
                details_node.locator(':scope > summary').click()
            baseline = json.dumps(report(page), sort_keys=True)
            # Start a real tree, reject a concurrent import through the public
            # API and cancel the original owner. The UI remains the normal
            # unmodified document throughout this concurrency witness.
            page.locator('#ygoSequenceDomain').select_option('ALL_REGISTERED')
            page.locator('#ygoSequenceDraws').fill('3')
            page.locator('#ygoSequenceNodes').fill('5000')
            page.locator('#ygoSequenceDepth').fill('90')
            page.locator('#ygoSequenceStart').click()
            page.wait_for_function('()=>YGORulesWorkbench.isBusy&&YGOAdvancedWorkbench.isBusy')
            busy = page.evaluate('''async()=>{
              const fileDisabled=document.getElementById('ygoSequenceFile').disabled;
              const mutationsDisabled=['ygoRulesApply','ygoDuelStep','ygoDuelInitialize','ygoAdvancedImport']
                .every(id=>document.getElementById(id).disabled);
              let importRejected=false;
              try{await YGORulesWorkbench.verifyFile();}catch(_){importRejected=true;}
              const ownershipPreserved=YGORulesWorkbench.isBusy&&YGOAdvancedWorkbench.isBusy
                &&!document.getElementById('ygoSequenceStop').disabled;
              let stepRejected=false;
              try{await YGOAdvancedWorkbench.step(YGOAdvancedWorkbench.actions()[0]);}catch(_){stepRejected=true;}
              return{fileDisabled,mutationsDisabled,importRejected,ownershipPreserved,stepRejected};
            }''')
            check('busy_import_cannot_steal_analysis_ownership_or_enable_live_mutations',
                  all(busy.values()), busy)
            page.locator('#ygoSequenceStop').click()
            page.wait_for_function('()=>!YGORulesWorkbench.isBusy&&!YGOAdvancedWorkbench.isBusy')
            check('cancelled_draw_tree_keeps_the_live_scenario_and_releases_its_controls',
                  json.dumps(report(page), sort_keys=True) == baseline
                  and page.evaluate('()=>YGORulesWorkbench.lastReport===null')
                  and page.locator('#ygoSequenceStop').is_disabled()
                  and page.locator('#ygoSequenceStart').is_enabled()
                  and page.locator('#ygoSequenceFile').is_enabled())
            page.locator('#ygoSequenceDomain').select_option('PHASES_AND_DRAWS')
            page.locator('#ygoSequenceDraws').fill('2')
            page.locator('#ygoSequenceNodes').fill('1200')
            page.locator('#ygoSequenceDepth').fill('72')
            page.locator('#ygoSequenceStart').click()
            page.wait_for_function('()=>!YGORulesWorkbench.isBusy&&!!YGORulesWorkbench.lastReport', timeout=45000)
            value = page.evaluate('()=>YGORulesWorkbench.lastReport')
            summary = value['summary']
            f = lambda row: int(row['numerator']) / int(row['denominator'])
            text = page.locator('#ygoSequenceResults').inner_text()
            check('two_chronological_hypothetical_draw_events_keep_exact_probability_and_unknown_mass',
                  value['requestedDrawEvents'] == 2 and summary['chanceNodes'] >= 2
                  and abs(f(summary['successWeight']) - 1 / 3) < 1e-12
                  and abs(f(summary['successWeight']) + f(summary['failureWeight']) + f(summary['unknownWeight']) - 1) < 1e-12
                  and f(summary['unknownWeight']) == 0 and summary['opponentDecisionNodes'] > 0)
            check('probability_values_are_rendered_from_the_actual_summary_and_never_as_a_win_rate',
                  '1/3' in text and 'sin dato' not in text and '33,333' in text
                  and value['winRate'] is None and value['competitiveScore'] is None
                  and value['observedDraw'] is False and value['observedReplayAllowed'] is False)
            check('draw_analysis_does_not_change_the_live_scenario_or_reveal_real_future_order', json.dumps(report(page), sort_keys=True) == baseline)
            with page.expect_download() as pending:
                page.locator('#ygoSequenceExport').click()
            saved = json.loads(Path(pending.value.path()).read_text())
            assert saved == value
            path = evidence_dir / 'release23-draw-sequences-export.json'
            path.write_text(json.dumps(saved, ensure_ascii=False) + '\n')
            exports.append(str(path))
            page.locator('#ygoSequenceFile').set_input_files({'name': 'draw-sequences.json', 'mimeType': 'application/json', 'buffer': json.dumps(saved).encode()})
            page.wait_for_function('()=>!YGORulesWorkbench.isBusy&&document.getElementById("ygoRulesStatus").textContent.startsWith("Informe verificado")')
            check('hypothetical_export_is_freshly_verified_separately_from_observed_replay',
                  page.evaluate('()=>YGORulesWorkbench.lastReport.hypothetical===true')
                  and json.dumps(report(page), sort_keys=True) == baseline)
            bad = copy.deepcopy(saved)
            bad['summary']['successWeight']['numerator'] = '999'
            page.locator('#ygoSequenceFile').set_input_files({'name': 'forged-draw-weight.json', 'mimeType': 'application/json', 'buffer': json.dumps(bad).encode()})
            page.wait_for_function('()=>!YGORulesWorkbench.isBusy&&document.getElementById("ygoRulesStatus").textContent.includes("no coincide")')
            check('forged_probability_mass_is_rejected_without_replacing_the_valid_hypothesis_or_lab',
                  page.evaluate('()=>YGORulesWorkbench.lastReport') == saved
                  and json.dumps(report(page), sort_keys=True) == baseline)
        section('chronological_probability_flow', probability_flow)

        def review_flow():
            baseline = page.evaluate('()=>JSON.stringify(deckState)')
            ledger = page.evaluate('()=>YGODataQuality.reviewLedger()')
            incident = ledger['records'][0]
            before_card = page.evaluate('id=>JSON.stringify(YGODataCatalog.lookup(id))', incident['id'])
            panel = page.locator('#ygoDataReviewLedger')
            if not panel.evaluate('(el)=>el.open'):
                panel.locator(':scope > summary').click()
            page.locator('#ygoDataReviewIncident').select_option(incident['key'])
            page.locator('#ygoDataReviewStatus').select_option('PRESERVE_UNRESOLVED')
            page.locator('#ygoDataReviewReviewer').fill('R23 GUI preservation test')
            page.locator('#ygoDataReviewNote').fill('Prueba de transporte: conservar la identidad y sus datos pendientes sin aplicar cambios.')
            page.locator('#ygoDataReviewSave').click()
            page.wait_for_function('()=>YGODataQuality.reviewLedger().counts.decisionsRecorded===1')
            with page.expect_download() as pending:
                page.locator('#ygoDataReviewExport').click()
            saved = json.loads(Path(pending.value.path()).read_text())
            check('review_ledger_records_a_note_without_resolving_identity_stats_or_migration',
                  saved['counts']['decisionsRecorded'] == 1 and saved['counts']['identitiesResolved'] == 0
                  and saved['counts']['statisticsFilled'] == 0 and saved['counts']['migrationsApplied'] == 0
                  and saved['changesApplied'] is False and saved['criteriaClosed'] == []
                  and page.evaluate('()=>JSON.stringify(deckState)') == baseline
                  and page.evaluate('id=>JSON.stringify(YGODataCatalog.lookup(id))', incident['id']) == before_card)
            page.locator('#ygoDataReviewClear').click()
            page.wait_for_function('()=>YGODataQuality.reviewLedger().counts.decisionsRecorded===0')
            page.locator('#ygoDataReviewFile').set_input_files({'name': 'catalogue-review.json', 'mimeType': 'application/json', 'buffer': json.dumps(saved).encode()})
            page.wait_for_function('()=>document.getElementById("ygoDataReviewFile").value===""&&YGODataQuality.reviewLedger().counts.decisionsRecorded===1')
            check('review_ledger_import_preserves_catalogue_and_active_deck', page.evaluate('()=>JSON.stringify(deckState)') == baseline
                  and page.evaluate('id=>JSON.stringify(YGODataCatalog.lookup(id))', incident['id']) == before_card)
            source_panel = page.locator('#ygoFormatEvidence')
            if not source_panel.evaluate('(el)=>el.open'):
                source_panel.locator(':scope > summary').click()
            with page.expect_download() as pending:
                page.locator('#ygoFormatEvidenceExport').click()
            dated = json.loads(Path(pending.value.path()).read_text())
            page.locator('#ygoFormatEvidenceFile').set_input_files({'name': 'dated-context.json', 'mimeType': 'application/json', 'buffer': json.dumps(dated).encode()})
            page.wait_for_function('()=>document.getElementById("ygoFormatEvidenceFile").value===""&&document.getElementById("ygoFormatEditorStatus").textContent.startsWith("Contexto declarado validado")')
            with page.expect_download() as pending:
                page.locator('#ygoFormatEvidenceReport').click()
            evidence = json.loads(Path(pending.value.path()).read_text())
            check('dated_format_context_round_trip_keeps_deck_and_official_verification_pending',
                  dated['authority'] == 'USER_DECLARED_DATED_CONTEXT' and dated['currentListProven'] is False
                  and evidence['officiallyCertified'] is False and evidence['activeDeckChanged'] is False
                  and page.evaluate('()=>JSON.stringify(deckState)') == baseline
                  and 'disponibilidad' in page.locator('#ygoFormatEvidenceSummary').inner_text())
            template = page.evaluate('()=>YGOAccessibility.manualTemplate()')
            check('manual_evidence_template_keeps_physical_and_assistive_claims_unexecuted',
                  template['buildId'] == build['buildId'] and template['performedByReporter'] is False
                  and template['environment']['physicalDeviceConfirmed'] is False
                  and all(row['result'] == 'NOT_RUN' for row in template['flows'])
                  and page.evaluate('()=>YGOAccessibility.completeAccessibilityCertified===false&&YGOAccessibility.physicalDevicesTested===false'))
        section('data_format_and_manual_evidence_flow', review_flow)

        check('release23_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        context.close()
        browser.close()
    check('release23_tasks_leave_the_compiled_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release23-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details, 'exports': exports,
            'engine': 'chromium', 'engineVersion': version, 'externalRequestsBlocked': len(blocked),
            'physicalDevicesTested': False, 'assistiveTechnologyTested': False,
            'competitiveCertified': False,
            'limitations': ['Declared initial fields are assumptions; only subsequent rendered-control transitions are replay witnesses.',
                'Probabilities are conditional hypothetical goal bounds under the declared action domain and information assumptions.',
                'Viewport, browser automation and manual-report schema checks do not certify physical devices or real assistive technology.',
                'Review notes and dated format contexts do not authenticate official identity, current availability or restrictions.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release23-browser-results.json')
    parser.add_argument('--evidence-dir', type=Path)
    args = parser.parse_args()
    started = time.monotonic()
    result = run(args.url, args.evidence_dir)
    result['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']],
                      'artifactMode': result['artifactMode'], 'elapsedSeconds': result['elapsedSeconds']}))
    raise SystemExit(0 if result['pass'] else 1)
