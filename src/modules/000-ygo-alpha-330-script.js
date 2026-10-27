
(() => {
'use strict';
const W=window,D=document,VERSION='Alpha 330',ZONES=['main','extra','side'];
const clampInt=v=>Math.max(0,Math.floor(Number(v)||0));
const rawQty=c=>Math.max(1,clampInt(c?.qty)||1);
const zoneCount=(state,z)=>(state?.[z]||[]).reduce((n,c)=>n+rawQty(c),0);
const esc330=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function catalogById(){
 const m=new Map();
 for(const c of Array.isArray(W.CARD_CATALOG)?W.CARD_CATALOG:[]){const id=String(c?.id??c?.[0]??'');if(id)m.set(id,Array.isArray(c)?{id:Number(c[0]),name:c[1]||'Carta desconocida',desc:c[2]||'',type:c[3]||'Carta',attribute:c[4]||'—'}:c)}
 return m;
}
function parseYDK330(text){
 const out={main:[],extra:[],side:[]},idx=catalogById();let zone='main';
 for(const raw of String(text??'').replace(/^\uFEFF/,'').replace(/\r/g,'').split('\n')){
   const line=raw.trim();if(!line)continue;const low=line.toLowerCase();
   if(low==='#main'){zone='main';continue}
   if(low==='#extra'){zone='extra';continue}
   if(low==='!side'||low==='#side'){zone='side';continue}
   if(line.startsWith('#')||line.startsWith('!')||!/^[0-9]+$/.test(line))continue;
   const base=idx.get(line),old=out[zone].find(c=>String(c.id)===line);
   if(old){old.qty=rawQty(old)+1;continue}
   out[zone].push(base?{...base,qty:1}:{id:Number(line),name:'Carta desconocida',desc:'',type:'Carta',attribute:'—',qty:1,unknown:true});
 }
 return out;
}
function rawCountsFromParsed(parsed){
 const m=new Map();
 for(const z of ZONES)for(const c of parsed?.[z]||[])m.set(`${z}:${String(c?.id??'')}`,rawQty(c));
 return m;
}
function restoreRawQuantities(parsed){
 const counts=rawCountsFromParsed(parsed),state=W.deckState||{};
 for(const z of ZONES)for(const c of state[z]||[]){const q=counts.get(`${z}:${String(c?.id??'')}`);if(q)c.qty=q}
 return state;
}
function duplicateViolations(state=W.deckState||{}){
 const issues=[];
 for(const z of ZONES)for(const c of state[z]||[]){const q=rawQty(c);if(q>3)issues.push({zone:z,id:c?.id,name:c?.name||`Carta ${c?.id||''}`,qty:q,max:3})}
 return issues;
}
function validateDeck330(state=W.deckState||{}){
 let base={errors:[],warnings:[],counts:{}};
 try{if(typeof W.validateDeck243==='function'&&W.validateDeck243!==validateDeck330)base=W.validateDeck243(state)||base}catch(_){ }
 const errors=Array.isArray(base.errors)?[...base.errors]:[];
 const seen=new Set(errors);
 for(const x of duplicateViolations(state)){const msg=`${x.name}: más de 3 copias (${x.qty})`;if(!seen.has(msg)){errors.push(msg);seen.add(msg)}}
 const counts=Object.fromEntries(ZONES.map(z=>[z,zoneCount(state,z)]));
 if(counts.main>60&&!errors.some(x=>/Main Deck supera 60/.test(x)))errors.push('Main Deck supera 60');
 if(counts.extra>15&&!errors.some(x=>/Extra Deck supera 15/.test(x)))errors.push('Extra Deck supera 15');
 if(counts.side>15&&!errors.some(x=>/Side Deck supera 15/.test(x)))errors.push('Side Deck supera 15');
 return {...base,errors,counts,legal:errors.length===0,playable:errors.length===0&&counts.main>=40&&counts.main<=60};
}
function ydkLinesForZone(state,z){
 const lines=[],skipped=[];
 for(const c of state?.[z]||[]){const id=String(c?.id??c?.passcode??'').trim(),q=rawQty(c);if(!/^\d+$/.test(id)){skipped.push(c?.name||'Carta sin ID');continue}for(let i=0;i<q;i++)lines.push(id)}
 return {lines,skipped};
}
function serializeYDK330(state=W.deckState||{}){
 const a=ydkLinesForZone(state,'main'),b=ydkLinesForZone(state,'extra'),c=ydkLinesForZone(state,'side');
 const text=['#created by Calculadora_de_Barajas_YuGiOh Alpha 330','#main',...a.lines,'#extra',...b.lines,'!side',...c.lines,''].join('\r\n');
 return {text,skipped:[...a.skipped,...b.skipped,...c.skipped],counts:{main:a.lines.length,extra:b.lines.length,side:c.lines.length}};
}
function safeDeckFilename(){
 const base=(D.getElementById('name')?.value||'Baraja_YuGiOh').trim()||'Baraja_YuGiOh';
 return base.replace(/[\\/:*?"<>|]+/g,'_').replace(/\s+/g,'_').slice(0,100)+'.ydk';
}
function exportYDK330(){
 const pack=serializeYDK330(W.deckState||{}),total=pack.counts.main+pack.counts.extra+pack.counts.side;
 if(!total){W.toast?.('No hay cartas para exportar.');return null}
 const blob=new Blob([pack.text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=D.createElement('a');
 a.href=url;a.download=safeDeckFilename();a.style.display='none';D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 const msg=pack.skipped.length?`YDK exportado; ${pack.skipped.length} carta(s) sin ID no pudieron incluirse.`:`YDK exportado: ${pack.counts.main} Main · ${pack.counts.extra} Extra · ${pack.counts.side} Side.`;
 W.toast?.(msg);return pack;
}
function patchVisualQuantityGlobals(){
 // Los editores normales siguen limitando las altas a 3; esta lectura sin clamp permite mostrar una importación ilegal tal como vino.
 W.cardQty=rawQty;
 const oldChange=W.changeQty;
 W.changeQty=function(zone,i,d){
   const arr=W.deckState?.[zone],c=arr?.[i];if(!c)return;
   const cur=rawQty(c),delta=Math.trunc(Number(d)||0);
   if(delta>0&&cur>=3){W.toast?.('Máximo 3 copias de una carta.');return}
   if(delta<0&&cur>3){c.qty=Math.max(1,cur-1);try{W.renderDeck?.();W.checkBanDeck?.()}catch(_){ }return}
   if(typeof oldChange==='function')return oldChange(zone,i,d);
 };
 const oldRender=W.renderDeck;
 W.renderDeck=function(){
   if(typeof oldRender==='function')oldRender();
   try{
     const state=W.deckState||{},active=W.activeZone||globalThis.activeZone||'main';
     const list=D.getElementById('deckList');
     if(list){for(const [i,c] of (state[active]||[]).entries()){const row=list.children?.[i],q=row?.querySelector?.('.qty');if(q){q.textContent='x'+rawQty(c);q.classList.toggle('alpha330-illegal-qty',rawQty(c)>3)}}}
     const mc=D.getElementById('mainCount'),ec=D.getElementById('extraCount'),sc=D.getElementById('sideCount');
     if(mc)mc.textContent=`${zoneCount(state,'main')}/40–60`;if(ec)ec.textContent=`${zoneCount(state,'extra')}/15`;if(sc)sc.textContent=`${zoneCount(state,'side')}/15`;
   }catch(_){ }
 };
}
function annotateImportedLegality(){
 const issues=duplicateViolations(),node=D.getElementById('mainYdkStatus');
 try{W.checkBanDeck?.()}catch(_){ }
 if(issues.length&&node){node.className='main-ydk-status bad';node.textContent=`BARAJA ILEGAL · ${issues.map(x=>`${x.name}: ${x.qty} copias`).join(' · ')}. Se conservaron las cantidades reales del archivo para que puedas corregirlas.`}
}
function installImport330(){
 const originalImportText=W.YDK?.importText||W.importText;
 W.__YGO330_BASE_IMPORT_TEXT=W.__YGO330_BASE_IMPORT_TEXT||originalImportText;
 function importText330(text,name='Baraja importada'){
   const raw=parseYDK330(text),total=ZONES.reduce((n,z)=>n+zoneCount(raw,z),0);if(!total){const n=D.getElementById('mainYdkStatus');if(n){n.className='main-ydk-status bad';n.textContent='El archivo no contiene cartas válidas.'}return null}
   let result=null;
   if(typeof W.__YGO330_BASE_IMPORT_TEXT==='function')result=W.__YGO330_BASE_IMPORT_TEXT(text,name);
   else {W.deckState=raw;try{W.renderDeck?.()}catch(_){ }}
   restoreRawQuantities(raw);try{W.renderDeck?.();W.checkBanDeck?.();W.calculate?.(true)}catch(_){ }
   annotateImportedLegality();
   // La hidratación heredada es asíncrona. Reaplicar las cantidades no modifica datos de carta; sólo restaura la evidencia del archivo.
   setTimeout(()=>{restoreRawQuantities(raw);try{W.renderDeck?.();W.checkBanDeck?.()}catch(_){ }annotateImportedLegality()},900);
   return result;
 }
 async function importFile330(file){
   if(!file)return null;if(!/\.(ydk|txt)$/i.test(file.name||'')){W.toast?.('Selecciona un archivo .YDK o .TXT.');return null}
   const text=typeof file.text==='function'?await file.text():await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=()=>reject(r.error||new Error('No se pudo leer el archivo'));r.readAsText(file,'UTF-8')});
   return importText330(text,file.name);
 }
 const old=D.getElementById('ydkMainFile');if(old){const input=old.cloneNode(true);old.replaceWith(input);input.addEventListener('change',async()=>{const f=input.files?.[0];try{await importFile330(f)}catch(e){const n=D.getElementById('mainYdkStatus');if(n){n.className='main-ydk-status bad';n.textContent='No se pudo importar la baraja: '+(e?.message||e)}}finally{input.value=''}})}
 W.parseYDK=parseYDK330;W.importText=importText330;W.YDK={...(W.YDK||{}),parse:parseYDK330,importText:importText330,importFile:importFile330,importMainCalculator:importFile330,serialize:serializeYDK330,export:exportYDK330};
}
function installExportButton(){
 if(D.getElementById('alpha330ExportYDK'))return;
 const boxes=[...D.querySelectorAll('.quick-info-box')],box=boxes.find(x=>/EXPORTAR RESULTADO/i.test(x.textContent||''));if(!box)return;
 const btn=D.createElement('button');btn.id='alpha330ExportYDK';btn.className='action';btn.type='button';btn.textContent='▣  Baraja .YDK';btn.addEventListener('click',exportYDK330);box.appendChild(btn);
}
function selfTest330(){
 const sample='#main\n89631139\n89631139\n89631139\n89631139\n#extra\n84013237\n!side\n14558127\n14558127\n',p=parseYDK330(sample),q=p.main.find(c=>String(c.id)==='89631139')?.qty||0,s=serializeYDK330(p),round=parseYDK330(s.text),rq=round.main.find(c=>String(c.id)==='89631139')?.qty||0,v=validateDeck330(p);
 return {version:VERSION,parsePreservesFour:q===4,exportRoundTrip:rq===4,detectsIllegalCopy:v.errors.some(x=>/más de 3 copias/.test(x)),counts:s.counts,pass:q===4&&rq===4&&v.errors.some(x=>/más de 3 copias/.test(x))};
}
function boot330(){
 patchVisualQuantityGlobals();installImport330();installExportButton();
 W.exportYDK=exportYDK330;W.serializeYDK=serializeYDK330;W.validateDeck330=validateDeck330;W.YGOAlpha330={VERSION,parseYDK:parseYDK330,serializeYDK:serializeYDK330,exportYDK:exportYDK330,validateDeck:validateDeck330,duplicateViolations,selfTest:selfTest330};
 W.__YGO330_TEST=null;
 try{W.renderDeck?.();W.checkBanDeck?.()}catch(_){ }
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot330,{once:true});else boot330();
})();
