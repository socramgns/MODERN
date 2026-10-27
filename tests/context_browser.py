#!/usr/bin/env python3
"""Persisted format context, stale causal results and document UI regressions."""
import argparse
import functools
import hashlib
import json
import os
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

def ready(page):
    page.wait_for_function('window.YGOStableRelease?.status().ready && window.YGOComboWorkbench && window.YGOUIState?.last',timeout=60000)
    page.evaluate('async()=>{await YGOComboWorkbench.ready;await YGOUIState.ready;await YGODataCatalog.ready;}')

def run(url):
    build=json.loads((ROOT/'dist/build-manifest.json').read_text())
    fixture=json.loads((ROOT/'examples/Arquetipo_Invoked.json').read_text())
    blue=json.loads((ROOT/'examples/Arquetipo_BlueEyes.json').read_text())
    checks=[];details={};errors=[]
    def check(name,passed,detail=None):
        checks.append({'name':name,'pass':bool(passed)})
        if detail is not None:
            details[name]=detail
        print(name,'PASS' if passed else 'FAIL',flush=True)
    with sync_playwright() as pw:
        executable=os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser=pw.chromium.launch(headless=True,executable_path=executable,args=['--no-sandbox'])
        browser_context=browser.new_context(accept_downloads=True)
        page=browser_context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(url,wait_until='domcontentloaded');ready(page)
        delivered=page.evaluate('()=>YGO_BUILD_MANIFEST')
        html_hash=hashlib.sha256((ROOT/build['output']).read_bytes()).hexdigest()
        check('delivered_build_identity',delivered['buildId']==build['buildId'] and html_hash==build['htmlSha256'])
        loaded=page.evaluate('async f=>{const r=await YGOComboWorkbench.loadScenario(f);return{r,counts:YGOUIState.last.counts,fp:YGOComboEngine.deckFingerprint(deckState)}}',fixture)
        check('real_40_card_fixture_loaded',loaded['r']['pass'] and loaded['counts']['main']==40)
        expected_context={'format':'tcg','asOfDate':'2026-10-22','event':{'tag':'regression'}}
        stored=page.evaluate('''value=>{const before=YGOUIState.contextVersion;YGOUIState.setFormatContext(value);YGOUIState.sync();const result=YGOUIState.saveSession();return{before,after:YGOUIState.contextVersion,result,context:YGOUIState.getFormatContext(),saved:JSON.parse(localStorage.getItem(YGOUIState.sessionKey))};}''',expected_context)
        check('format_context_increments_version_and_saves',stored['after']>stored['before'] and stored['result']['saved'] and stored['saved']['formatContext']==expected_context,{'context':stored['context'],'version':stored['after']})
        page.reload(wait_until='domcontentloaded');ready(page)
        restored=page.evaluate('()=>({context:YGOUIState.getFormatContext(),counts:YGOUIState.last.counts,fp:YGOComboEngine.deckFingerprint(deckState),saved:JSON.parse(localStorage.getItem(YGOUIState.sessionKey))})')
        check('format_context_and_deck_survive_reload',restored['context']==expected_context and restored['counts']['main']==40 and restored['fp']==loaded['fp'],restored['context'])
        compact=page.evaluate('()=>YGOExports.compact()')
        encoded=page.evaluate('value=>YGOExports.encode(value)',compact)
        decoded=page.evaluate('value=>YGOExports.decode(value)',encoded)
        check('compact_payload_preserves_context',compact['formatContext']==expected_context and decoded==compact)
        shared_result=page.evaluate('''async value=>{YGOUIState.setFormatContext({format:'tcg'});YGOUIState.sync();await YGOExports.importShared(value);return{context:YGOUIState.getFormatContext(),fp:YGOComboEngine.deckFingerprint(deckState),counts:YGOUIState.last.counts};}''',compact)
        check('import_shared_restores_context',shared_result['context']==expected_context and shared_result['fp']==loaded['fp'] and shared_result['counts']['main']==40)
        shared_context=browser.new_context();other=shared_context.new_page();other.on('pageerror',lambda e:errors.append(str(e)))
        other.goto(url+'#baraja='+encoded,wait_until='domcontentloaded');ready(other)
        other.wait_for_function('YGOUIState.getFormatContext().event?.tag==="regression" && YGOUIState.last.counts.main===40',timeout=30000)
        actual_shared=other.evaluate('()=>({context:YGOUIState.getFormatContext(),fp:YGOComboEngine.deckFingerprint(deckState)})')
        check('shared_url_restores_context_in_fresh_browser',actual_shared['context']==expected_context and actual_shared['fp']==loaded['fp'])
        shared_context.close()
        result=page.evaluate('''async f=>{await YGOComboWorkbench.loadScenario(f);const r=await YGOComboWorkbench.run({maxMs:8000});return{r,version:YGOUIState.contextVersion,report:YGOComboWorkbench.report()};}''',fixture)
        check('causal_lines_bind_to_format_context_version',result['r']['pass'] and len(result['r']['lines'])>0 and all(l['context']['formatContextVersion']==result['version'] for l in result['r']['lines']))
        invalidated=page.evaluate('''()=>{const before=YGOUIState.contextVersion;YGOUIState.setFormatContext({format:'tcg',asOfDate:'2026-10-22',event:{tag:'changed-context'}});YGOUIState.sync();return{before,after:YGOUIState.contextVersion,report:YGOComboWorkbench.report(),articles:document.querySelectorAll('#ygoCausalResults article').length};}''')
        check('context_change_invalidates_traces_and_hand',invalidated['after']>invalidated['before'] and invalidated['report']['search'] is None and invalidated['report']['strategy'] is None and invalidated['report']['simulation'] is None and invalidated['report']['openingIds']==[] and invalidated['articles']==0)
        cancelled=page.evaluate('''async f=>{await YGOComboWorkbench.loadScenario(f);const pending=YGOComboWorkbench.run({maxDepth:14,maxStates:5000,maxMs:30000});await new Promise(r=>setTimeout(r,0));YGOUIState.setFormatContext({format:'tcg',event:{tag:'changed-during-search'}});YGOUIState.sync();const result=await pending;return{result,report:YGOComboWorkbench.report(),busy:document.getElementById('ygoCausalStart').disabled};}''',blue)
        check('context_change_cancels_running_search',cancelled['result'].get('status')=='CANCELLED_OR_STALE' and cancelled['report']['search'] is None and not cancelled['busy'],cancelled['result'].get('status'))
        mismatch=page.evaluate('''async f=>{const snapshot=structuredClone(BANLIST_PROFILES.tcg);const prior=YGOFormats.snapshotIdentity(snapshot,'tcg'),originalDate=snapshot.date;const row=snapshot.data[0];row.max=Number(row.max)===0?1:0;YGOUIState.setFormatContext({format:'tcg',snapshot});YGOUIState.sync();await YGOComboWorkbench.loadScenario(f);let error=null,result=null;try{result=await YGOComboWorkbench.run()}catch(e){error=String(e.message||e)}return{prior,changed:YGOFormats.snapshotIdentity(snapshot,'tcg'),sameDate:snapshot.date===originalDate,error,result,report:YGOComboWorkbench.report(),profileUnchanged:YGOFormats.snapshotIdentity(BANLIST_PROFILES.tcg,'tcg')===prior};}''',fixture)
        check('changed_snapshot_same_date_blocks_causal_search',mismatch['sameDate'] and mismatch['prior']!=mismatch['changed'] and mismatch['profileUnchanged'] and mismatch['error'] and 'snapshot TCG incorporado' in mismatch['error'] and mismatch['report']['search'] is None,mismatch['error'])
        page.locator('#ygoStableRelease > details').first.locator('summary').click()
        page.locator('[data-action=format-reset]').click()
        reset=page.evaluate('()=>({context:YGOUIState.getFormatContext(),status:document.querySelector("[data-stable-message]").textContent})')
        check('reset_button_restores_incorporated_context',reset['context']=={'format':'tcg'} and 'Restablecido' in reset['status'],reset)
        after_reset=page.evaluate('''async f=>{await YGOComboWorkbench.loadScenario(f);return await YGOComboWorkbench.run({maxMs:8000})}''',fixture)
        check('causal_search_works_after_context_reset',after_reset['pass'] and len(after_reset.get('lines',[]))>0)
        # The document UI must reject an official-looking URL and an empty
        # template. A local technical specimen is accepted only as a review of
        # the supplied bytes, with no origin or official certification claim.
        page.locator('[data-provenance-card]').fill('89631139')
        with page.expect_download() as pending:
            page.locator('[data-action=provenance-template]').click()
        template_path=ROOT/'tests/context-provenance-template.json';pending.value.save_as(str(template_path))
        template=json.loads(template_path.read_text())
        check('document_template_download_is_not_evidence',template['schema']=='ygo-provenance-evidence/v1' and template['cardId']==89631139 and template['document']['content']=='' and template['independentlyVerified'] is False)
        page.locator('[data-input=provenance]').set_input_files({'name':'empty-template.json','mimeType':'application/json','buffer':json.dumps(template).encode()})
        page.wait_for_function('document.querySelector("[data-stable-message]").textContent.includes("Documentos rechazados")')
        check('empty_document_template_rejected_in_ui',page.evaluate('()=>YGOProvenance.status().reviewedArtifacts===0'))
        url_only={'schema':'ygo-provenance-evidence/v1','catalogueHash':template['catalogueHash'],'cardId':89631139,'authorityUrl':'https://www.yugioh-card.com/en/'}
        page.locator('[data-input=provenance]').set_input_files({'name':'url-only.json','mimeType':'application/json','buffer':json.dumps(url_only).encode()})
        page.wait_for_function('document.querySelector("[data-stable-message]").textContent.includes("DOCUMENT_CONTENT_REQUIRED")')
        check('official_url_alone_rejected_in_ui',page.evaluate('()=>YGOProvenance.status().reviewedArtifacts===0'))
        specimen=page.evaluate('''async()=>{const c=YGODataCatalog.lookup(89631139),content='Technical regression specimen: '+(c.canonicalName||c.name)+'. ATK '+c.atk+'.';return{schema:'ygo-provenance-evidence/v1',catalogueHash:YGO_CATALOG_MANIFEST.cardsSha256,cardId:89631139,authorityUrl:'https://raw.githubusercontent.com/ProjectIgnis/BabelCDB/'+YGO_CATALOG_MANIFEST.sourceCommit+'/cards.cdb',document:{content,sha256:await YGOProvenance.sha256(content),contentType:'text/plain'},reviewedAt:new Date(Date.now()-5000).toISOString(),reviewer:{name:'Browser regression specimen',method:'TECHNICAL_SOURCE_FIELD_REVIEW'},fields:{name:{value:c.canonicalName||c.name,witness:c.canonicalName||c.name},atk:{value:c.atk,witness:'ATK '+c.atk}}};}''')
        page.locator('[data-input=provenance]').set_input_files({'name':'technical-specimen.json','mimeType':'application/json','buffer':json.dumps(specimen).encode()})
        page.wait_for_function('YGOProvenance.status().reviewedArtifacts===1')
        reviewed=page.evaluate('()=>({saved:YGOProvenance.export(),message:document.querySelector("[data-stable-message]").textContent})')
        review=reviewed['saved']['reviews'][0]
        check('document_import_binds_bytes_without_official_claim',review['status']=='TECHNICAL_DOCUMENT_FIELDS_REVIEWED' and review['documentSha256']==specimen['document']['sha256'] and review['officialIdentityCertified'] is False and review['independentlyVerified'] is False and 'no queda autenticado' in reviewed['message'])
        browser_context.close();browser.close()
    check('no_javascript_page_errors',not errors,errors)
    return{'schema':'ygo-context-browser-validation/v1','artifactMode':'DELIVERED_BYTES','buildId':build['buildId'],'htmlSha256':html_hash,'executedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'pass':all(c['pass'] for c in checks),'checks':checks,'details':details,'limitations':['Causal paths require the incorporated TCG snapshot.','Document review compares supplied bytes and citations; origin is not authenticated.']}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--url');parser.add_argument('--output',type=Path,default=ROOT/'tests/context-browser-results.json');args=parser.parse_args();server=None
    try:
        url=args.url
        if not url:
            server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
            url=f'http://127.0.0.1:{server.server_port}/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html'
        started=time.monotonic();result=run(url);result['elapsedSeconds']=round(time.monotonic()-started,2)
        args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({'pass':result['pass'],'checks':len(result['checks']),'failed':[c['name'] for c in result['checks'] if not c['pass']],'seconds':result['elapsedSeconds']},ensure_ascii=False));raise SystemExit(0 if result['pass'] else 1)
    finally:
        if server:server.shutdown();server.server_close()
