"""Behavior checks on the generated standalone HTML, with a temporary local server."""
import functools,json,threading
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class QuietHandler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
handler=functools.partial(QuietHandler,directory=str(ROOT/'dist'))
server=ThreadingHTTPServer(('127.0.0.1',0),handler)
thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  page=browser.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'http://127.0.0.1:{server.server_port}/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html',wait_until='domcontentloaded')
  page.wait_for_function("window.__YGO_ENGINE_BOOT?.status==='READY' && window.CARD_CATALOG?.length>=19000",timeout=60000)
  result=page.evaluate('''async()=>{
   const ash=window.CARD_CATALOG.find(c=>Number(c.id)===14558127),normal=window.CARD_CATALOG.find(c=>Number(c.id)===89631139),E=window.YGOExactRulesEngine,P=window.YGOProbability;
   const sem=E.semantic(ash),prob=E.probabilityModel([{...ash,qty:3},{...normal,qty:37}]);
   const before=localStorage.getItem('ygo.alpha984.competitive.corpus.v1');
   const duplicate=await YGOAlpha1263.calibrationImport1047(Array.from({length:50},(_,i)=>({id:'same',score:i,label:i,format:'TCG',source:'audit'})));
   return{sem:{starter:sem.starter,extender:sem.extender,ss:sem.ss,interaction:sem.interaction},starterProbability:prob.starter.at5,interactionProbability:prob.interaction.at5,deckCopies:prob.meta?.deckCopies,
    duplicate,datasetPreserved:before===localStorage.getItem('ygo.alpha984.competitive.corpus.v1'),definitions:P.definitions,template:YGOAlpha984.calibrationTemplate984(),checks:{
    ashNotStarter:sem.starter===0&&sem.extender===0&&sem.ss===0,ashRemainsInteraction:sem.interaction===1,starterProbabilityZero:prob.starter.at5===0,physicalCopies:prob.meta?.deckCopies===40,
    correctInteraction:Math.abs(prob.interaction.at5-.33755060728744846)<1e-12,duplicatesRejected:duplicate.pass===false&&duplicate.status==='DATASET_REJECTED',templateAvailable:typeof YGOAlpha984.calibrationTemplate984==='function'}};
  }''')
  result['pageErrors']=errors;result['checks']['noPageErrors']=not errors
  result['pass']=all(result['checks'].values())
  (ROOT/'tests/probability-browser-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
  print(json.dumps({'pass':result['pass'],'checks':result['checks'],'sem':result['sem'],'duplicateStatus':result['duplicate']['status']},ensure_ascii=False,indent=2))
  assert result['pass'];browser.close()
finally:server.shutdown();server.server_close()
