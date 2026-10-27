import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8766/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html'
out={'url':url,'pageErrors':[],'checks':{}}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page();page.on('pageerror',lambda e:out['pageErrors'].append(str(e)))
 page.goto(url,wait_until='domcontentloaded');page.evaluate('async()=>{await __YGO_ENGINE_READY;await YGODataCatalog.ready;}');page.wait_for_selector('#ygoSupportedSearch')
 result=page.evaluate("""async()=>{
 const allowed=window.CARD_CATALOG.filter(c=>(c.typeBits&17)===17&&!(c.typeBits&0x4000)&&c.level>=1&&c.level<=4&&c.statsKnown&&YGODataCatalog.poolEvidence(c,'tcg').eligible===true);
 const names=new Set();const cards=allowed.filter(c=>{const id=YGODataCatalog.canonicalIdentity(c.id).canonicalId;if(names.has(id))return false;names.add(id);return !window.BANLIST_PROFILES.tcg.data.some(b=>b.name.toUpperCase()===c.name.toUpperCase()&&b.max<3)}).slice(0,14);
 const ids=cards.flatMap((c,i)=>Array(i===13?1:3).fill(c.id));
 const text='#main\\n'+ids.join('\\n')+'\\n#extra\\n!side\\n';
 const imported=await window.YGOAlpha1048.importText1048(text,'Prueba real de monstruos Normales');
 return {cardCount:cards.length,cards:cards.map(c=>({id:c.id,name:c.name,level:c.level})),main:imported.main,error:imported.error,physical:window.YGOAlpha1263.physicalLegality1050(window.deckState),openingStable:JSON.stringify(YGOAlpha655.openingState655(0))===JSON.stringify(YGOAlpha655.openingState655(0))};
}""")
 out['import']=result;print('IMPORT',json.dumps(result,ensure_ascii=False)[:2500],flush=True)
 out['checks']['explicitAssumption']=page.evaluate('async()=>await YGOStable.searchSupported({})')
 data=page.evaluate("""async()=>{const r=await YGOStable.searchSupported({opponentPolicy:'PASS',maxDepth:3});window.__supportedAudit=r;return r}""")
 out['search']=data;print('SEARCH',json.dumps({k:v for k,v in data.items() if k!='candidates'},ensure_ascii=False),flush=True)
 out['checks']['replayTamper']=page.evaluate("""()=>{const line=structuredClone(window.__supportedAudit.candidates[0]);line.actions[0].after.lp[0]-=100;return YGOStable.replaySupported(line)}""")
 out['checks']['originalDeckUnchanged']=page.evaluate("()=>YGOAlpha1263.physicalLegality1050(deckState).counts.main===40")
 page.locator('#ygoSupportedPass').check();page.locator('#ygoSupportedStart').click();page.wait_for_function("document.querySelector('#ygoSupportedStatus').textContent.includes('estados examinados')")
 out['checks']['ui']={'status':page.locator('#ygoSupportedStatus').inner_text(),'lines':page.locator('#ygoSupportedResults details').count()}
 page.evaluate("()=>{window.deckState={main:[],extra:[],side:[]};window.dispatchEvent(new CustomEvent('ygo-ui-state-updated'))}")
 out['checks']['invalidated']=page.locator('#ygoSupportedResults details').count()==0
 b.close()
(Path(__file__).resolve().parent/'supported-search-results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print(json.dumps(out['checks'],ensure_ascii=False,indent=2))
assert not out['pageErrors'],out['pageErrors']
assert out['search']['candidateCount']>0 and all(x['replay']['pass'] for x in out['search']['candidates'])
assert out['checks']['explicitAssumption']['status']=='EXPLICIT_PASSING_OPPONENT_REQUIRED'
assert out['checks']['replayTamper']['pass'] is False
assert out['checks']['ui']['lines']>0 and out['checks']['invalidated']
