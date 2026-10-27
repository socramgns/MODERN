#!/usr/bin/env python3
"""Behavioral regression for the UI's shared state and diagnostic persistence."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]

def run(url):
 results={}
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  context=browser.new_context();page=context.new_page();errors=[]
  page.on('pageerror',lambda err:errors.append(str(err)))
  page.goto(url,wait_until='domcontentloaded')
  page.wait_for_function('window.YGOUIState && window.YGOUIState.last && window.CARD_CATALOG?.length === window.YGO_BUILD_MANIFEST.catalogCardCount',timeout=60000)
  fixture=page.evaluate("""()=>{const entries=Object.values(YGOAlpha357.fixtureCatalog(true).entries);const d=entries.find(e=>e?.fixture&&!e.aliasOf&&e.ok!==false).fixture;const lines=z=>(d[z]||[]).flatMap(c=>Array(c.qty??c.count??1).fill(c.id??c.cardId??c.card?.id)).join('\\n');return '#main\\n'+lines('main')+'\\n#extra\\n'+lines('extra')+'\\n!side\\n'+lines('side')+'\\n'}""")
  page.locator('#ydkMainFile').set_input_files({'name':'ui-regression.ydk','mimeType':'text/plain','buffer':fixture.encode()})
  page.wait_for_function('window.YGOUIState.last?.counts.main === 40 && window.YGOUIState.last?.evaluation?.total >= 0')
  state=page.evaluate("""()=>({last:YGOUIState.last,composition:[...document.querySelectorAll('#composition .metric b')].map(x=>Number(x.textContent)),score:document.getElementById('score').textContent,starter:document.getElementById('starterRate').textContent,playable:document.getElementById('playableRate').textContent})""")
  assert state['composition'][0]==40,state
  assert sum(state['composition'][1:])==40,state
  assert state['last']['evaluation']['total']==sum(state['last']['evaluation']['stats']),state
  assert state['playable']=='—',state
  if state['last']['probabilities'].get('meta'):
   assert state['last']['probabilities']['meta']['deckCopies']==40,state
  for name,metric in state['last']['probabilities'].items():
   if isinstance(metric,dict) and isinstance(metric.get('cards'),(int,float)):
    assert 0<=metric['cards']<=40,(name,metric)
  results['import_composition']=state
  ordinary=page.evaluate("""async()=>{
   const blocked=new Set((BANLIST_PROFILES.tcg?.data||[]).filter(c=>Number(c.max??3)<3).map(c=>String(c.name).toLowerCase()));const seen=new Set(),selected=[];
   for(const c of CARD_CATALOG){if((Number(c.typeBits)&17)!==17||(Number(c.typeBits)&0x4000)||Number(c.level)<1||Number(c.level)>4||YGODataCatalog.poolEvidence(c,'tcg').eligible!==true||/unofficial|rush|skills|deckmaster|prerelease/i.test(c.source||'')||blocked.has(String(c.name).toLowerCase())||seen.has(String(c.name).toLowerCase()))continue;seen.add(String(c.name).toLowerCase());selected.push(c);if(selected.length===14)break;}
   if(selected.length<14)throw Error('No normal monster corpus for test');
   const ids=selected.flatMap((c,i)=>Array(i===13?1:3).fill(String(c.id)));const r=await YGOApp.ydk.importText('#main\\n'+ids.join('\\n')+'\\n#extra\\n!side\\n','Cuarenta normales: prueba de conservación');await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const ok=saveDeck(),saved=JSON.parse(localStorage.getItem('ygoDecksV2')).at(-1);return{r,ok,saved,ids,shown:document.getElementById('tier').textContent};
  }""")
  assert not ordinary['r'].get('error') and ordinary['ok'] is True,ordinary
  assert ordinary['saved']['evaluation']['legal'] is not False,ordinary
  page.evaluate("""()=>document.querySelector('.fmt[data-f="OCG"]').click()""")
  ordinary_loaded=page.evaluate("""async id=>{const ok=await loadDeck(id);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return{ok,format:document.querySelector('.fmt.active').dataset.f,ids:deckState.main.flatMap(c=>Array(c.qty??1).fill(String(c.id))),counts:YGOUIState.last.counts}}""",ordinary['saved']['id'])
  assert ordinary_loaded['ok'] is True and ordinary_loaded['format']=='TCG',ordinary_loaded
  assert sorted(ordinary_loaded['ids'])==sorted(ordinary['ids']),ordinary_loaded
  assert page.evaluate('()=>YGOUIState.saveSession().saved') is True
  page.reload(wait_until='domcontentloaded')
  page.wait_for_function('window.YGOUIState?.last?.counts.main===40 && window.YGOUIState?.last?.evaluation?.total>=0',timeout=60000)
  assert page.evaluate('()=>document.getElementById("name").value')=='Cuarenta normales: prueba de conservación'
  results['ordinary_roundtrip_and_session']={'saved':ordinary['saved'],'loaded':ordinary_loaded}
  result=page.evaluate("""async()=>await YGOApp.ydk.importText('#main\\n'+Array(4).fill('89631139').join('\\n')+'\\n#extra\\n!side\\n','Cuatro copias: diagnóstico')""")
  assert not result.get('error'),result
  page.wait_for_function('YGOUIState.last?.counts.main===4 && YGOUIState.last?.evaluation?.total>=0')
  saved=page.evaluate("""()=>{const ok=saveDeck();const entries=JSON.parse(localStorage.getItem('ygoDecksV2'));return{ok,last:entries.at(-1),shownTier:document.getElementById('tier').textContent,composition:document.getElementById('composition').innerText}}""")
  assert saved['ok'] is True,saved
  assert saved['last']['deckState']['main'][0]['qty']==4,saved
  assert saved['last']['evaluation']['tier']==saved['shownTier'],saved
  assert saved['last']['evaluation']['legal'] is False,saved
  loaded=page.evaluate("""async id=>{const ok=await loadDeck(id);return{ok,qty:deckState.main[0].qty,tier:document.getElementById('tier').textContent,legal:document.documentElement.dataset.scoreLegal}}""",saved['last']['id'])
  assert loaded['ok'] is True and loaded['qty']==4 and loaded['legal']=='0',loaded
  results['diagnostic_roundtrip']={'saved':saved,'loaded':loaded}
  page.wait_for_function('YGOUIState.last?.evaluation?.total>=0')
  saved_session=page.evaluate('()=>YGOUIState.saveSession()')
  assert saved_session['saved'] is True,saved_session
  page.reload(wait_until='domcontentloaded')
  page.wait_for_function('window.YGOUIState?.last?.counts.main===4 && window.YGOUIState?.last?.evaluation?.total>=0',timeout=60000)
  restored=page.evaluate("""()=>({qty:deckState.main[0].qty,legal:document.documentElement.dataset.scoreLegal,message:document.getElementById('ygoSessionStatus')?.textContent,name:document.getElementById('name').value,state:YGOUIState.last})""")
  assert restored['qty']==4 and restored['legal']=='0',restored
  assert 'recuperada' in restored['message'].lower(),restored
  results['session_restore']=restored
  page.evaluate("""()=>{deckState.main[0].qty=3;window.renderDeck()}""")
  page.wait_for_function("window.YGOUIState.last?.counts.main===3 && document.getElementById('score').textContent.includes('—')")
  stale=page.evaluate("""()=>({evaluation:YGOUIState.getEvaluation(),score:document.getElementById('score').textContent,mode:document.documentElement.dataset.scoreAuthority,saved:saveDeck()})""")
  assert stale['evaluation'] is None and stale['saved'] is False,stale
  results['stale_score_rejected']=stale
  results['pageErrors']=errors
  assert not errors,errors
  browser.close()
 return results

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:8766/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html');args=parser.parse_args()
 result=run(args.url)
 path=ROOT/'tests/ui-results.json';path.write_text(json.dumps(result,ensure_ascii=False,indent=2))
 print(json.dumps({'pass':True,'checks':list(result),'evidence':str(path)},ensure_ascii=False))
