"""Exercise verified bundle initialization, real search, cancellation and worker tests.
Run against a served build: python3 tests/worker_probe.py URL [OUTPUT.json]
"""
import argparse,json,time
from pathlib import Path
from playwright.sync_api import sync_playwright

def run(url):
 out={'url':url,'tests':{},'pageErrors':[]}
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=browser.new_page();page.on('pageerror',lambda e:out['pageErrors'].append(str(e)))
  page.goto(url,wait_until='domcontentloaded')
  page.wait_for_function("window.__YGO_ENGINE_BOOT && ['READY','READY_WITH_ERRORS'].includes(window.__YGO_ENGINE_BOOT.status)",timeout=60000)
  page.evaluate('async()=>{await window.YGOAlpha984?.ensureCatalog984?.()}')
  def check(name,code):
   start=time.monotonic()
   try:result=page.evaluate(code)
   except Exception as error:result={'error':str(error)}
   out['tests'][name]={'elapsedMs':round((time.monotonic()-start)*1000),'result':result}
   print(name,json.dumps(result,ensure_ascii=False)[:4000],flush=True)
  check('workerSelf',"()=>window.YGOAlpha1263.isolatedSelf1080()")
  check('parserSelf',"async()=>await window.YGOAlpha1263.safeRegression1092({testIds:['664-parser','668','1092-parser'],eachTimeoutMs:10000})")
  check('loadFixture',"""async()=>{const entry=Object.entries(YGOAlpha357.fixtureCatalog(true).entries).find(([id,e])=>id==='core:blueEyes');if(!entry)return{error:'fixture absent'};const deck=entry[1].fixture;const ids=z=>(deck[z]||[]).flatMap(c=>Array(c.qty??1).fill(c.id));const text='#main\\n'+ids('main').join('\\n')+'\\n#extra\\n'+ids('extra').join('\\n')+'\\n!side\\n'+ids('side').join('\\n')+'\\n';const result=await YGOAlpha1048.importText1048(text,'Worker regression');return{error:result?.error,main:result?.main,extra:result?.extra}}""")
  check('boundedSearch',"async()=>await window.YGOAlpha1263.searchIsolated1080({maxTotalMs:2000,maxDepth:2,maxStates:80,maxActionBranches:16,maxSlices:5})")
  check('cancelDuringInit',"""async()=>{const controller=new AbortController();const job=window.YGOAlpha1263.searchIsolated1080({signal:controller.signal,maxTotalMs:5000,maxDepth:4});setTimeout(()=>controller.abort(),20);return await job}""")
  check('staleDeck',"""async()=>{const original=window.deckState;const job=window.YGOAlpha1263.searchIsolated1080({maxTotalMs:5000,maxDepth:4});setTimeout(()=>{window.deckState={main:[],extra:[],side:[]}},20);const result=await job;window.deckState=original;return result}""")
  browser.close()
 results={name:row['result'] for name,row in out['tests'].items()}
 assert not out['pageErrors'],out['pageErrors']
 assert results['workerSelf']['pass'] is True,results['workerSelf']
 assert results['parserSelf']['pass'] is True,results['parserSelf']
 assert results['loadFixture'].get('main')==41 and not results['loadFixture'].get('error'),results['loadFixture']
 assert results['boundedSearch'].get('status') not in ['WORKER_ENGINE_ERROR','WORKER_ERROR','HARD_TIMEOUT'],results['boundedSearch']
 assert 'CANCEL' in results['cancelDuringInit'].get('status',''),results['cancelDuringInit']
 assert any(word in results['staleDeck'].get('status','') for word in ['STALE','CANCEL']),results['staleDeck']
 out['pass']=True
 return out
if __name__=='__main__':
 args=argparse.ArgumentParser();args.add_argument('url');args.add_argument('output',nargs='?',default='/tmp/worker-results.json');ns=args.parse_args();result=run(ns.url);Path(ns.output).write_text(json.dumps(result,ensure_ascii=False,indent=2))
