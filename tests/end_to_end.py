#!/usr/bin/env python3
"""Test delivered bytes, full application flows, downloads and offline startup."""
import argparse,hashlib,json,time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]

def run(url,output):
 build=json.loads((ROOT/'dist/build-manifest.json').read_text());tests=[];errors=[];details={}
 def record(name,passed,detail=None):
  tests.append({'name':name,'pass':bool(passed)});details[name]=detail
  print(name,'PASS' if passed else 'FAIL',flush=True)
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(url,wait_until='domcontentloaded')
  page.wait_for_function('window.YGOStableRelease?.status().ready && window.YGOUIState?.last && window.YGODataCatalog?.status().loaded',timeout=60000)
  initial=page.evaluate('()=>({health:__YGO_BOOT_HEALTH_1263(),catalog:YGODataCatalog.status(),build:YGO_BUILD_MANIFEST})')
  record('delivered_build_and_integrity',initial['build']['buildId']==build['buildId'] and initial['health']['ready'] and initial['health']['hashesChecked']==88,initial)
  record('catalogue_metadata_enrichment',initial['catalog']['sourceMatched']>=19555 and initial['catalog']['knownMonsterStats']>11000 and initial['catalog']['unknownMonsterStats']<=51,{'known':initial['catalog']['knownMonsterStats'],'unknown':initial['catalog']['unknownMonsterStats']})
  runtime=page.evaluate('async()=>await YGOStableRelease.runChecks()')
  record('included_rule_suites',runtime['pass'],{'count':len(runtime['tests']),'failed':[x['name'] for x in runtime['tests'] if not x['pass']]})
  fixtures=page.evaluate("""()=>Object.entries(YGOAlpha357.fixtureCatalog(true).entries).filter(([id,e])=>e?.fixture&&!e.aliasOf&&e.ok!==false).slice(0,10).map(([id,e])=>{const ids=z=>(e.fixture[z]||[]).flatMap(c=>Array(c.qty??1).fill(c.id));const identity=z=>{const counts=new Map();for(const id of ids(z))counts.set(Number(id),(counts.get(Number(id))||0)+1);return [...counts].sort((a,b)=>a[0]-b[0])};return{id,label:e.label,expected:ids('main').length,expectedDeck:Object.fromEntries(['main','extra','side'].map(z=>[z,identity(z)])),text:'#main\\n'+ids('main').join('\\n')+'\\n#extra\\n'+ids('extra').join('\\n')+'\\n!side\\n'+ids('side').join('\\n')+'\\n'}})""")
  rows=[]
  for fixture in fixtures:
   page.locator('#ydkMainFile').set_input_files({'name':fixture['id'].replace(':','-')+'.ydk','mimeType':'text/plain','buffer':fixture['text'].encode()})
   # Imports are asynchronous. Equal Main sizes do not identify the new deck;
   # wait for every zone's exact copies and an evaluation of the current state.
   page.wait_for_function("""expected=>{const identity=z=>{const counts=new Map();for(const c of deckState[z]||[]){const id=Number(c.id);counts.set(id,(counts.get(id)||0)+Number(c.qty??1))}return [...counts].sort((a,b)=>a[0]-b[0])};return ['main','extra','side'].every(z=>JSON.stringify(identity(z))===JSON.stringify(expected[z]))&&YGOUIState.getEvaluation()!==null}""",arg=fixture['expectedDeck'],timeout=30000)
   snapshot=page.evaluate("""()=>({counts:YGOUIState.last.counts,composition:[...document.querySelectorAll('#composition .metric b')].map(x=>Number(x.textContent)),evaluation:YGOUIState.getEvaluation(),probabilityCopies:YGOUIState.last.probabilities?.meta?.deckCopies})""")
   passed=snapshot['counts']['main']==fixture['expected'] and snapshot['composition'][0]==sum(snapshot['composition'][1:]) and snapshot['probabilityCopies']==fixture['expected'] and sum(snapshot['evaluation']['stats'])==snapshot['evaluation']['total']
   rows.append({'id':fixture['id'],'pass':passed,**snapshot})
  record('ten_distinct_deck_imports',len(rows)==10 and all(r['pass'] for r in rows),rows)
  preservation=page.evaluate("""async()=>{const before=JSON.stringify(deckState);const r=await YGOApp.ydk.importText('#main\\ninvalid\\n#extra\\n!side\\n','Inválida');return{rejected:!!r.error,preserved:before===JSON.stringify(deckState)}}""")
  record('invalid_import_is_transactional',preservation['rejected'] and preservation['preserved'],preservation)
  # Download fidelity is meaningful even for diagnostic decks: no card may disappear.
  serialized=page.evaluate('()=>YGOAlpha330.serializeYDK(deckState)')
  with page.expect_download() as pending:page.locator('#alpha330ExportYDK').click()
  downloaded=pending.value;downloaded.save_as(str(ROOT/'tests/export-roundtrip.ydk'))
  export_text=(ROOT/'tests/export-roundtrip.ydk').read_text()
  expected_lines=[x.strip() for x in serialized['text'].splitlines() if x.strip() and not x.startswith('#created')]
  actual_lines=[x.strip() for x in export_text.splitlines() if x.strip() and not x.startswith('#created')]
  record('ydk_download_preserves_cards',expected_lines==actual_lines,{'bytes':len(export_text),'name':downloaded.suggested_filename,'expectedLines':expected_lines,'actualLines':actual_lines})
  with page.expect_download() as pending:page.locator('[data-action=analysis]').click()
  pending.value.save_as(str(ROOT/'tests/export-analysis.json'));analysis=json.loads((ROOT/'tests/export-analysis.json').read_text())
  record('json_export_records_scope',analysis['schema']=='ygo-analysis/v1' and analysis['status']['build']['buildId']==build['buildId'] and analysis['status']['score']['competitiveCertified'] is False)
  with page.expect_download() as pending:page.locator('button[onclick="exportImage()"]').click()
  pending.value.save_as(str(ROOT/'tests/export-analysis.png'))
  image=(ROOT/'tests/export-analysis.png').read_bytes();record('png_export',image.startswith(b'\x89PNG\r\n\x1a\n') and len(image)>10000,{'bytes':len(image)})
  page.emulate_media(media='print');pdf=page.pdf(format='A4',print_background=True);(ROOT/'tests/export-analysis.pdf').write_bytes(pdf);page.emulate_media(media='screen')
  record('print_pdf_render',pdf.startswith(b'%PDF') and len(pdf)>10000,{'bytes':len(pdf)})
  compact=page.evaluate('()=>YGOExports.compact()');fragment=page.evaluate('()=>YGOExports.encode(YGOExports.compact())')
  shared=browser.new_context();other=shared.new_page();other.on('pageerror',lambda e:errors.append(str(e)))
  other.goto(url+'#baraja='+fragment,wait_until='domcontentloaded');other.wait_for_function('window.YGOUIState?.last?.counts.main>0 && window.YGOUIState?.last?.evaluation',timeout=60000)
  restored=other.evaluate('()=>YGOExports.compact()');record('shared_link_restores_deck_and_format',restored['deckState']==compact['deckState'] and restored['fmt']==compact['fmt'],{'main':sum(c['qty'] for c in restored['deckState']['main'])});shared.close()
  current_evidence={'schema':'ygo-analyzer-e2e/v1','buildId':build['buildId'],'htmlSha256':build['htmlSha256'],'runner':'Playwright/Chromium','tests':[{'name':'probe','pass':True}]}
  evidence=page.evaluate('value=>({correct:YGOStableRelease.importEvidence(value),stale:YGOStableRelease.validateEvidence({...value,buildId:"other-build"})})',current_evidence)
  record('external_evidence_bound_to_build',evidence['correct']['pass'] and not evidence['stale']['pass'])
  page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(150)
  layout=page.evaluate('()=>({width:innerWidth,scroll:document.documentElement.scrollWidth})');record('mobile_has_no_horizontal_overflow',layout['scroll']<=layout['width'],layout)
  # Managed Chromium forbids file: navigation here. Exercise the exact standalone
  # bytes with the document fulfilled locally while the browser is offline.
  offline=browser.new_context();offline.route(url,lambda route:route.fulfill(status=200,content_type='text/html; charset=utf-8',body=(ROOT/build['output']).read_bytes()));offline.set_offline(True)
  filepage=offline.new_page();filepage.on('pageerror',lambda e:errors.append(str(e)))
  filepage.goto(url,wait_until='domcontentloaded');filepage.wait_for_function('window.YGOStableRelease?.status().ready && window.YGODataCatalog?.status().loaded',timeout=60000)
  offline_state=filepage.evaluate('()=>({health:__YGO_BOOT_HEALTH_1263(),catalog:YGODataCatalog.status(),api:typeof YGOStable.searchSupported})')
  record('standalone_bytes_offline',offline_state['health']['ready'] and offline_state['catalog']['loaded'] and offline_state['api']=='function',{'transport':'Document bytes fulfilled locally, browser network offline','fileNavigation':'Not validated: managed Chromium blocks file: URLs with ERR_BLOCKED_BY_ADMINISTRATOR'})
  offline.close();context.close();browser.close()
 record('no_javascript_page_errors',not errors,errors)
 report={'schema':'ygo-analyzer-e2e/v1','runner':'Playwright/Chromium','executedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'buildId':build['buildId'],'htmlSha256':hashlib.sha256((ROOT/build['output']).read_bytes()).hexdigest(),'pass':all(t['pass'] for t in tests),'tests':tests,'details':details,'scope':'Functional scoped product; not universal rules or competitive-ranking certification.'}
 output.write_text(json.dumps(report,ensure_ascii=False,indent=2));return report
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:8766/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html');parser.add_argument('--output',type=Path,default=ROOT/'dist/test-evidence.json');args=parser.parse_args()
 result=run(args.url,args.output);print(json.dumps({'pass':result['pass'],'tests':len(result['tests'])}));raise SystemExit(0 if result['pass'] else 1)
