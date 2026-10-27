#!/usr/bin/env python3
"""Historical Fusion Deck and independent Skill transport/persistence checks."""
import argparse
import functools
import hashlib
import json
import os
import re
import shutil
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self,*_args):
        pass

def fixtures():
    rows=json.loads((ROOT/'src/data/cards.json').read_text())
    normal=[];fusion=[];families=set()
    for row in rows:
        bits=int(row[3]);alias=int(row[13] or row[0]);source=row[6]
        if source!='cards.cdb' or not int(row[12])&2 or alias in families:
            continue
        if bits&17==17 and not bits&(0x4000|0x1000000|0x40|0x2000|0x800000|0x4000000) and len(normal)<14:
            normal.append(row[0]);families.add(alias)
        elif bits&0x40 and len(fusion)<18:
            fusion.append(row[0]);families.add(alias)
    skill=next(row[0] for row in rows if row[6]=='cards-skills.cdb' and int(row[3])&0x8000000)
    main=[{'id':card,'qty':3 if i<13 else 1} for i,card in enumerate(normal)]
    goat={'schema':'ygo-format-deck/v1','name':'GOAT transport fixture · pool not authenticated','fmt':'GOAT','formatContext':{'format':'goat','historicalDate':'2005-04-01'},'deckState':{'main':main,'extra':[{'id':card,'qty':1} for card in fusion],'side':[],'skills':[]}}
    dl_main=[{'id':card,'qty':3 if i<6 else 2} for i,card in enumerate(normal[:7])]
    dl={'schema':'ygo-format-deck/v1','name':'Duel Links independent Skill fixture','fmt':'Duel Links','formatContext':{'format':'duelLinksSpeed','extraDeckLimit':0},'deckState':{'main':dl_main,'extra':[],'side':[],'skills':[]}}
    return goat,dl,skill

def ready(page):
    page.wait_for_function('window.YGOUIState?.last && window.YGOFormatEditor && document.getElementById("ygoFormatEditor")',timeout=60000)
    page.evaluate('async()=>{await YGOFormatEditor.ready;await YGOUIState.ready;await YGODataCatalog.ready;}')

def run(url,source_inject=False):
    build=json.loads((ROOT/'dist/build-manifest.json').read_text())
    checks=[];details={};errors=[];goat,dl,skill=fixtures()
    def check(name,passed,detail=None):
        checks.append({'name':name,'pass':bool(passed)})
        if detail is not None:details[name]=detail
        print(name,'PASS' if passed else 'FAIL',flush=True)
    html=None
    if source_inject:
        html=(ROOT/build['output']).read_text()
        for name in ['ui-state','exports']:
            pattern=r'<script data-ygo-stable-module="'+name+r'">[\s\S]*?</script>'
            html,count=re.subn(pattern,lambda _: '<script data-ygo-stable-module="'+name+'">\n'+(ROOT/f'src/app/{name}.js').read_text()+'\n</script>',html)
            assert count==1,(name,count)
        if 'data-ygo-stable-module="format-editor"' not in html:
            insertion='<script data-ygo-stable-module="format-editor">\n'+(ROOT/'src/app/format-editor.js').read_text()+'\n</script>\n'
            html=html.replace('<script data-ygo-stable-module="exports">',insertion+'<script data-ygo-stable-module="exports">')
    with sync_playwright() as pw:
        executable=os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser=pw.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox'])
        context=browser.new_context(accept_downloads=True,viewport={'width':1440,'height':1000})
        if html is not None:context.route(url,lambda route:route.fulfill(status=200,content_type='text/html',body=html))
        page=context.new_page();page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto(url,wait_until='domcontentloaded');ready(page)
        if not source_inject:
            actual=page.evaluate('()=>YGO_BUILD_MANIFEST.buildId')
            check('delivered_build_identity',actual==build['buildId'])
        page.locator('#ygoFormatFile').set_input_files({'name':'goat-18-fusions.json','mimeType':'application/json','buffer':json.dumps(goat).encode()})
        page.wait_for_function('YGOUIState.last.counts.extra===18 && YGOUIState.last.format==="GOAT"')
        imported=page.evaluate('()=>({value:YGOFormatEditor.export(),ui:YGOUIState.last,main:deckState.main.reduce((n,c)=>n+c.qty,0),extra:deckState.extra.reduce((n,c)=>n+c.qty,0),title:document.getElementById("extraCount").textContent})')
        check('goat_import_keeps_18_real_fusions_without_truncation',imported['main']==40 and imported['extra']==18 and imported['value']['fmt']=='GOAT' and 'sin límite' in imported['title'])
        check('json_import_preserves_deck_name',imported['value']['name']==goat['name'])
        check('goat_historical_pool_stays_pending',any(x['reason']=='HISTORICAL_POOL_SNAPSHOT_REQUIRED' for x in imported['ui']['formatsAudit']['pending']) and not imported['ui']['formatsAudit']['certified'])
        check('extended_interface_constraints_removed',imported['ui']['formatsAudit']['interfaceFullySupported'] is True and imported['ui']['formatsAudit']['interfaceConstraints']==[])
        check('unvalidated_historical_score_is_unknown',imported['ui']['evaluation'] is None)
        rejected=page.evaluate('''value=>{const before=JSON.stringify(YGOFormatEditor.export());const bad=structuredClone(value);bad.fmt='TCG';bad.formatContext={format:'tcg'};let error=null;try{YGOUIState.validateSession(bad)}catch(e){error=e.message}return{error,unchanged:before===JSON.stringify(YGOFormatEditor.export())}}''',goat)
        check('tcg_extra_limit_stays_15_and_current_state_preserved',bool(rejected['error']) and rejected['unchanged'],rejected['error'])
        engineering=page.evaluate('''value=>{const bad=structuredClone(value);bad.deckState.extra=Array.from({length:17},()=>({id:value.deckState.extra[0].id,qty:60}));let error=null;try{YGOUIState.validateSession(bad)}catch(e){error=e.message}return error}''',goat)
        check('historical_transport_safety_cap_1000_is_enforced',bool(engineering),engineering)
        unknown=page.evaluate('''async()=>{const before=JSON.stringify(YGOFormatEditor.export());const bad=YGOFormatEditor.export();bad.deckState.extra[0].id=999999999999;let error=null;try{await YGOFormatEditor.import(bad)}catch(e){error=e.message}return{error,unchanged:before===JSON.stringify(YGOFormatEditor.export())}}''')
        check('unknown_passcode_rejected_transactionally',bool(unknown['error']) and unknown['unchanged'])
        with page.expect_download() as pending:page.locator('#ygoFormatExportJson').click()
        target=ROOT/'tests/format-interface-export.json';pending.value.save_as(str(target));download=json.loads(target.read_text())
        check('json_download_keeps_historical_deck_and_context',sum(c['qty'] for c in download['deckState']['extra'])==18 and download['formatContext']==goat['formatContext'])
        with page.expect_download() as pending:page.locator('#ygoFormatExportYdk').click()
        ydk_path=ROOT/'tests/format-interface-export.ydk';pending.value.save_as(str(ydk_path));ydk=ydk_path.read_text()
        ydk_result=page.evaluate('async value=>await YGOFormatEditor.importText(value,{name:"GOAT YDK roundtrip"})',ydk)
        check('ydk_roundtrip_keeps_all_historical_extra_copies',ydk_result['counts']['main']==40 and ydk_result['counts']['extra']==18)
        saved=page.evaluate('()=>{const r=YGOFormatEditor.saveNamed();return{r,library:YGOFormatEditor.library(),saved:JSON.parse(localStorage.getItem(YGOFormatEditor.storageKey)),session:YGOUIState.saveSession()}}')
        check('format_library_and_session_save_extended_deck',saved['r']['saved'] and saved['session']['saved'] and sum(c['qty'] for c in saved['saved'][0]['deck']['deckState']['extra'])==18)
        compact=page.evaluate('()=>YGOExports.compact()')
        page.reload(wait_until='domcontentloaded');ready(page)
        restored=page.evaluate('()=>({value:YGOFormatEditor.export(),ui:YGOUIState.last,session:document.getElementById("ygoSessionStatus").textContent})')
        check('session_restores_goat_fusion_deck_over_15',restored['ui']['counts']['extra']==18 and restored['ui']['format']=='GOAT' and 'recuperada' in restored['session'].lower())
        shared=page.evaluate('''async value=>{await YGOExports.importShared(value);return{value:YGOFormatEditor.export(),ui:YGOUIState.last}}''',compact)
        check('shared_import_preserves_historical_zones',shared['ui']['counts']['extra']==18 and shared['value']['formatContext']==goat['formatContext'])
        check('session_and_shared_transport_preserve_roundtrip_name',restored['value']['name']=='GOAT YDK roundtrip' and shared['value']['name']==compact['name'])
        page.locator('#ygoFormatFile').set_input_files({'name':'duel-links.json','mimeType':'application/json','buffer':json.dumps(dl).encode()})
        page.wait_for_function('YGOUIState.last.counts.main===20 && YGOUIState.last.format==="Duel Links"')
        page.locator('#ygoFormatEditor details').first.locator('summary').click()
        page.locator('#ygoFormatSkill').select_option(str(skill));page.locator('#ygoFormatAddSkill').click()
        page.wait_for_function('YGOUIState.last.counts.skills===1')
        skill_state=page.evaluate('()=>({value:YGOFormatEditor.export(),ui:YGOUIState.last,composition:document.getElementById("composition").innerText})')
        check('skill_selector_places_skill_outside_main',skill_state['ui']['counts']['main']==20 and skill_state['ui']['counts']['skills']==1 and all(c['id']!=skill for c in skill_state['value']['deckState']['main']))
        refreshed_skill=page.evaluate('()=>{renderDeck();renderComposition();YGOUIState.sync();return{raw:deckState.skills.length,counts:YGOUIState.last.counts}}')
        check('ordinary_refresh_preserves_independent_skill',refreshed_skill['raw']==1 and refreshed_skill['counts']['skills']==1 and refreshed_skill['counts']['main']==20)
        check('skill_rules_and_digital_pool_remain_pending',{'SKILL_CONSTRUCTION_EFFECTS_REQUIRE_CONTEXT','DIGITAL_POOL_SNAPSHOT_REQUIRED'}<=set(x['reason'] for x in skill_state['ui']['formatsAudit']['pending']))
        blocked=page.evaluate('''async id=>{const before=JSON.stringify(YGOFormatEditor.export());let error=null;try{await YGOFormatEditor.setEntry('main',id,1)}catch(e){error=e.message}return{error,unchanged:before===JSON.stringify(YGOFormatEditor.export())}}''',skill)
        check('skill_cannot_be_added_to_main_by_editor',bool(blocked['error']) and blocked['unchanged'])
        doubled=page.evaluate('''()=>{const before=JSON.stringify(YGOFormatEditor.export()),v=YGOFormatEditor.export();v.deckState.skills[0].qty=2;let error=null;try{YGOUIState.validateSession(v)}catch(e){error=e.message}return{error,unchanged:before===JSON.stringify(YGOFormatEditor.export())}}''')
        check('two_active_skills_rejected_without_mutation',bool(doubled['error']) and doubled['unchanged'])
        tcg_skill=page.evaluate('''()=>{const v=YGOFormatEditor.export();v.fmt='TCG';v.formatContext={format:'tcg'};let error=null;try{YGOUIState.validateSession(v)}catch(e){error=e.message}return error}''')
        check('tcg_does_not_acquire_skill_zone_capacity',bool(tcg_skill))
        cannot_ydk=page.evaluate('()=>{try{YGOFormatEditor.export({type:"ydk"});return null}catch(e){return e.message}}')
        check('ydk_export_rejects_silent_skill_loss',bool(cannot_ydk) and 'JSON' in cannot_ydk)
        skill_compact=page.evaluate('()=>YGOExports.compact()')
        check('compact_share_payload_includes_skill_zone',len(skill_compact['deckState']['skills'])==1 and skill_compact['deckState']['skills'][0]['id']==skill)
        skill_saved=page.evaluate('()=>({named:YGOFormatEditor.saveNamed(),session:YGOUIState.saveSession()})')
        check('skill_deck_named_and_session_save',skill_saved['named']['saved'] and skill_saved['session']['saved'])
        page.reload(wait_until='domcontentloaded');ready(page)
        after=page.evaluate('()=>({ui:YGOUIState.last,value:YGOFormatEditor.export()})')
        check('session_restores_independent_skill',after['ui']['counts']['main']==20 and after['ui']['counts']['skills']==1 and after['value']['deckState']['skills'][0]['id']==skill)
        check('skill_session_keeps_name_and_format_context',after['value']['name']==dl['name'] and after['value']['formatContext']==dl['formatContext'])
        skill_shared=page.evaluate('async value=>{await YGOExports.importShared(value);return{value:YGOFormatEditor.export(),counts:YGOUIState.last.counts}}',skill_compact)
        check('shared_import_restores_independent_skill_and_context',skill_shared['counts']['main']==20 and skill_shared['counts']['skills']==1 and skill_shared['value']['formatContext']==dl['formatContext'] and skill_shared['value']['deckState']['skills'][0]['id']==skill)
        recovered=page.evaluate('async id=>await YGOFormatEditor.loadNamed(id)',saved['r']['id'])
        check('named_library_switch_restores_historical_context_and_no_skill',recovered['counts']['extra']==18 and recovered['counts']['skills']==0 and recovered['format']=='goat')
        check('named_library_preserves_historical_deck_name',page.evaluate('()=>YGOFormatEditor.export().name')=='GOAT YDK roundtrip')
        diagnostic=page.evaluate('''async value=>{const v=structuredClone(value);v.fmt='TCG';v.formatContext={format:'tcg'};v.deckState.extra=[];v.deckState.main[0].qty=4;return await YGOFormatEditor.import(v)}''',goat)
        check('diagnostic_four_copies_remain_invalid_not_masked',diagnostic['counts']['main']==41 and any(x['reason']=='ALIAS_FAMILY_OVER_THREE' for x in diagnostic['audit']['errors']) and diagnostic['audit']['constructionValid'] is False)
        details['pageErrors']=errors;check('no_page_errors',not errors,errors)
        browser.close()
    return{'schema':'ygo-format-interface-validation/v1','pass':all(x['pass'] for x in checks),'buildId':build['buildId'],'htmlSha256':hashlib.sha256((ROOT/build['output']).read_bytes()).hexdigest(),'artifactMode':'SOURCE_INJECTED_DEVELOPMENT' if source_inject else 'DELIVERED_BYTES','checks':checks,'details':details,'limitations':['Provided historical and digital pool membership is not authenticated by transport tests.','YDK lacks a portable independent Skill zone; JSON preserves it.']}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--url');parser.add_argument('--source-inject',action='store_true');parser.add_argument('--output',type=Path,default=ROOT/'tests/format-interface-results.json');args=parser.parse_args();server=None
    try:
        url=args.url
        if not url:
            server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html'
        started=time.monotonic();result=run(url,args.source_inject);result['elapsedSeconds']=round(time.monotonic()-started,2);args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({'pass':result['pass'],'checks':len(result['checks']),'failed':[x['name'] for x in result['checks'] if not x['pass']],'artifactMode':result['artifactMode'],'seconds':result['elapsedSeconds']}));raise SystemExit(0 if result['pass'] else 1)
    finally:
        if server:server.shutdown();server.server_close()
