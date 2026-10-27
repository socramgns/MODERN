
/* ===== BASE DE DATOS CDB UNIFICADA ===== */
window.YGO_DB_SOURCES=[{"file":"cards(3).cdb","updatedAt":1788933460344},{"file":"release-dabl.cdb","updatedAt":1788933460164},{"file":"prerelease-phhy.cdb","updatedAt":1788933460080},{"file":"release-ac02.cdb","updatedAt":1788933460076},{"file":"cards-unofficial(2).cdb","updatedAt":1788933459964},{"file":"prerelease-slf1.cdb","updatedAt":1788933459932},{"file":"prerelease-mp22.cdb","updatedAt":1788933459880},{"file":"fixMisc-unofficial.delta.cdb","updatedAt":1788933459832},{"file":"cards-unofficial.delta(2).cdb","updatedAt":1788933459812},{"file":"cards.delta(2).cdb","updatedAt":1788933459792},{"file":"cards-unofficial-new.delta.cdb","updatedAt":1788933459668},{"file":"cards-skills.delta(2).cdb","updatedAt":1788933459660},{"file":"cards-rush.delta(1).cdb","updatedAt":1788933459516},{"file":"cards-skills(2).cdb","updatedAt":1788933459468},{"file":"cards-skills-unofficial(3).cdb","updatedAt":1788933459468},{"file":"cards-rush(3).cdb","updatedAt":1788933459344},{"file":"cards-rush-prerelease.delta.cdb","updatedAt":1788933459328},{"file":"cards-deckmaster.cdb","updatedAt":1788933459232},{"file":"cards-skills-unofficial.delta(1).cdb","updatedAt":1788933459220}];
const YGO_DB_RAW=null;
const YGO_DB_TYPE={1:'Monstruo',2:'Mágica',4:'Trampa'};
const YGO_DB_ATTR={1:'TIERRA',2:'AGUA',4:'FUEGO',8:'VIENTO',16:'LUZ',32:'OSCURIDAD',64:'DIVINO'};
function classifyDBCard(name,desc,type){const t=(String(name||'')+' '+String(desc||'')).toLowerCase();if(/skill|habilidad/.test(t))return'Utility';if(/ash blossom|effect veiler|maxx|droll|nibiru|infinite impermanence|ghost ogre|ghost belle|veiler/.test(t))return'Hand Trap';if(/add (a |an |1 |2 )?.*(from|to).*deck|add .*deck|search/.test(t))return'Buscador';if(/special summon/.test(t))return'Extender';if(/negate|negated|cannot activate/.test(t))return'Interrupción';if(/destroy|banish|return .*hand|return .*field|send .*graveyard|shuffle .*deck/.test(t))return'Removal';if(/draw|recycle|add .*graveyard|shuffle.*graveyard/.test(t))return'Reciclador';if(/cannot be destroyed|cannot be targeted|unaffected|protect/.test(t))return'Protección';if(/otk|8000|direct attack/.test(t))return'OTK';return'Utility'}
let CARD_CATALOG=[];
Object.defineProperty(window,'CARD_CATALOG',{configurable:true,get:()=>CARD_CATALOG,set:v=>{CARD_CATALOG=Array.isArray(v)?v:[];try{CARD_DB_BY_NAME=new Map(CARD_CATALOG.map(c=>[String(c.name||'').toLowerCase(),c]))}catch(_){}}});
let CARD_DB_BY_NAME=new Map();
let embeddedDBPromise=null;
async function getEmbeddedDB(){
  if(Array.isArray(YGO_DB_RAW))return YGO_DB_RAW;
  if(embeddedDBPromise)return embeddedDBPromise;
  embeddedDBPromise=(async()=>{
    const el=document.getElementById('ygo-db-embedded');
    if(!el||!window.DecompressionStream)return [];
    try{
      const bin=atob((el.textContent||'').trim()),bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      const ds=new DecompressionStream('gzip'),stream=new Blob([bytes]).stream().pipeThrough(ds),text=await new Response(stream).text();
      const rows=JSON.parse(text);return Array.isArray(rows)?rows:[];
    }catch(e){console.warn('No se pudo descomprimir la base CDB embebida.',e);return []}
  })();
  return embeddedDBPromise;
}
function mergedCardDB(){return CARD_CATALOG}
const YGO_DB_NAME='YGO_CARD_DATABASE',YGO_DB_STORE='cards',YGO_DB_META='meta',YGO_DB_DECKS='deckEvaluations',YGO_DB_VERSION=4;
async function openYGOCardDB(){return new Promise((res,rej)=>{const r=indexedDB.open(YGO_DB_NAME,YGO_DB_VERSION);r.onupgradeneeded=()=>{const db=r.result;if(db.objectStoreNames.contains(YGO_DB_STORE)&&r.oldVersion<4)db.deleteObjectStore(YGO_DB_STORE);if(!db.objectStoreNames.contains(YGO_DB_STORE))db.createObjectStore(YGO_DB_STORE,{keyPath:'id'});if(!db.objectStoreNames.contains(YGO_DB_META))db.createObjectStore(YGO_DB_META,{keyPath:'key'});if(!db.objectStoreNames.contains(YGO_DB_DECKS))db.createObjectStore(YGO_DB_DECKS,{keyPath:'id'})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function decodeCDBType(bits){
  bits=Number(bits)||0;
  const MONSTER=0x1,SPELL=0x2,TRAP=0x4,NORMAL=0x10,EFFECT=0x20,FUSION=0x40,RITUAL=0x80,
        TRAPMONSTER=0x100,SPIRIT=0x200,UNION=0x400,GEMINI=0x800,TUNER=0x1000,SYNCHRO=0x2000,
        TOKEN=0x4000,QUICKPLAY=0x10000,CONTINUOUS=0x20000,EQUIP=0x40000,FIELD=0x80000,
        COUNTER=0x100000,FLIP=0x200000,TOON=0x400000,XYZ=0x800000,PENDULUM=0x1000000,
        SPSUMMON=0x2000000,LINK=0x4000000;
  if(bits&SPELL){
    if(bits&QUICKPLAY)return'Quick-Play Spell';
    if(bits&CONTINUOUS)return'Continuous Spell';
    if(bits&EQUIP)return'Equip Spell';
    if(bits&FIELD)return'Field Spell';
    if(bits&RITUAL)return'Ritual Spell';
    return'Normal Spell';
  }
  if(bits&TRAP){
    if(bits&COUNTER)return'Counter Trap';
    if(bits&CONTINUOUS)return'Continuous Trap';
    if(bits&TRAPMONSTER)return'Trap Monster';
    return'Normal Trap';
  }
  if(bits&MONSTER){
    if(bits&LINK)return'Link Monster';
    if(bits&XYZ)return'Xyz Monster';
    if(bits&SYNCHRO)return(bits&TUNER)?'Synchro Tuner Monster':'Synchro Monster';
    if(bits&FUSION)return'Fusion Monster';
    if(bits&RITUAL)return'Ritual Effect Monster';
    if(bits&TOKEN)return'Token';
    const labels=[];
    if(bits&PENDULUM)labels.push('Pendulum');
    if(bits&TUNER)labels.push('Tuner');
    if(bits&SPIRIT)labels.push('Spirit');
    if(bits&UNION)labels.push('Union');
    if(bits&GEMINI)labels.push('Gemini');
    if(bits&TOON)labels.push('Toon');
    if(bits&FLIP)labels.push('Flip');
    if((bits&NORMAL)&&!(bits&EFFECT))labels.push('Normal');
    else if(bits&EFFECT)labels.push('Effect');
    if(bits&SPSUMMON)labels.push('Special Summon');
    return(labels.length?labels.join(' ')+' ':'')+'Monster';
  }
  return'Carta';
}
function decodeCDBLevel(raw,bits){
  const packed=Number(raw)||0,base=packed&0xff;
  return{level:(bits&0x800000||bits&0x4000000)?0:base,rank:(bits&0x800000)?base:0,linkval:(bits&0x4000000)?base:0,scaleL:(packed>>>24)&0xff,scaleR:(packed>>>16)&0xff};
}
/* Alpha 1076 — conservación explícita de metadatos ausentes.
   Números desconocidos NO equivalen a cero. Solo dos cartas están contrastadas
   manualmente con la base oficial; el resto no se «certifica» por heurística. */
const YGO_VERIFIED_STATS_1076=Object.freeze({
  89631139:{atk:3000,def:2500,level:8,attribute:'LUZ',source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4007&ope=2&request_locale=en'},
  14558127:{atk:0,def:1800,level:3,attribute:'FUEGO',source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=12950&ope=2&request_locale=en'}
});
function applyStatsEvidence1076(rec,rawRow){
  const monster=Boolean((Number(rec.typeBits)||0)&1),hasFullRow=Array.isArray(rawRow)&&rawRow.length>=15;
  rec.metadataVersion=1076;
  rec.statsApplicable=monster;
  rec.metadataVerified=false;
  rec.metadataSource='';
  if(!monster){rec.statsKnown=null;rec.statsStatus='NO_APLICA';return rec}
  const good=(v)=>typeof v==='number'&&Number.isFinite(v);
  const levelType=(rec.typeBits&0x800000)?'rank':(rec.typeBits&0x4000000)?'linkval':'level';
  const levelNum=Number(rec[levelType]);
  const rawPresent=hasFullRow&&good(rawRow[8])&&good(rawRow[9])&&Number.isFinite(Number(rawRow[10]));
  const verified=YGO_VERIFIED_STATS_1076[rec.id];
  if(verified){rec.atk=verified.atk;rec.def=verified.def;rec.level=verified.level;
    rec.attribute=verified.attribute;rec.statsKnown=true;rec.metadataVerified=true;
    rec.metadataSource=verified.source;rec.statsStatus='KONAMI_VERIFICADO';return rec;}
  if(rawPresent){rec.statsKnown=true;
    const auxiliary=typeof rawRow[15]==='string'&&rawRow[15].startsWith('YGOPRODeck-v7:');
    rec.statsStatus=auxiliary?'FUENTE_SECUNDARIA_SIN_COTEJO_OFICIAL':'DATOS_CDB_SIN_COTEJO_OFICIAL';
    rec.metadataSource=auxiliary?rawRow[15]:String(rec.source||'');return rec;}
  // Legacy-compatible fields keep their shape, but null represents unknown.
  // A consumer that converts null to zero must NOT treat the resulting number
  // as certified; use statsKnown and metadataVerified as authority.
  rec.atk=null;rec.def=null;rec.level=null;rec.rank=null;rec.linkval=null;
  rec.scaleL=null;rec.scaleR=null;rec.statsKnown=false;
  rec.statsStatus='DATOS_DESCONOCIDOS';return rec;
}

function rebuildCatalog(rows){
  const byId=new Map();
  for(const x of rows||[]){
    const id=+x[0];if(!id)continue;
    const bits=Number(x[3])||0,type=decodeCDBType(bits),lv=decodeCDBLevel(x[10],bits);
    const rec={id,name:x[1]||'',desc:x[2]||'',type,frameType:type.toLowerCase().replace(/\s+/g,'-'),typeBits:bits,
      attribute:YGO_DB_ATTR[x[4]]||'—',race:+x[7]||0,atk:Number.isFinite(Number(x[8]))?Number(x[8]):0,
      def:Number.isFinite(Number(x[9]))?Number(x[9]):0,level:lv.level,rank:lv.rank,linkval:lv.linkval,
      scaleL:lv.scaleL,scaleR:lv.scaleR,setcode:String(x[11]||''),ot:+x[12]||0,alias:+x[13]||0,category:+x[14]||0,
      role:classifyDBCard(x[1]||'',x[2]||'',type),qty:1,sourceUpdatedAt:+x[5]||0,source:x[6]||''};
    // La base embebida compacta no trae Level/ATK/DEF. Para Xyz sólo se infiere el Rank cuando el texto declara explícitamente materiales de un Level concreto.
    if((bits&0x800000)&&!rec.rank){const m=String(rec.desc||'').match(/(?:^|\n)\s*\d+\+?\s+Level\s+(\d+)\s+monsters?/i);if(m)rec.rank=Number(m[1])||0;}
    applyStatsEvidence1076(rec,x);
    const old=byId.get(id);
    if(!old||rec.sourceUpdatedAt>old.sourceUpdatedAt||(rec.sourceUpdatedAt===old.sourceUpdatedAt&&String(rec.source).localeCompare(String(old.source))>0))byId.set(id,rec);
  }
  CARD_CATALOG=[...byId.values()].sort((a,b)=>a.name.localeCompare(b.name));
  CARD_DB_BY_NAME=new Map(CARD_CATALOG.map(c=>[c.name.toLowerCase(),c]));
  return CARD_CATALOG;
}
async function writeCatalogToDB(){const db=await openYGOCardDB();await new Promise((res,rej)=>{const tx=db.transaction(YGO_DB_STORE,'readwrite'),st=tx.objectStore(YGO_DB_STORE);st.clear();for(const c of CARD_CATALOG)st.put(c);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});await new Promise((res,rej)=>{const tx=db.transaction(YGO_DB_META,'readwrite');tx.objectStore(YGO_DB_META).put({key:'manifest',sources:window.YGO_DB_SOURCES,cardCount:CARD_CATALOG.length,updatedAt:Math.max(...window.YGO_DB_SOURCES.map(x=>x.updatedAt||0),0),source:'embedded+ProjectIgnis/BabelCDB',metadataVersion:1076,officialMetadataCorrections:2});tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});return CARD_CATALOG}
async function readCatalogFromDB(){
  const db=await openYGOCardDB();
  return await new Promise((resolve,reject)=>{
    const tx=db.transaction(YGO_DB_STORE,'readonly'),st=tx.objectStore(YGO_DB_STORE),out=[];
    const req=st.openCursor();
    req.onsuccess=()=>{const cur=req.result;if(cur){out.push(cur.value);cur.continue()}else resolve(out)};
    req.onerror=()=>reject(req.error);
  });
}
async function loadOfflineDB(){
  try{
    const cached=await readCatalogFromDB();
    if(cached.length===19617&&cached.every(c=>c&&c.metadataVersion===1076)){
      CARD_CATALOG=cached.sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
      try{if(window.YGOAlpha320Catalog?.mergeArray)CARD_CATALOG=window.YGOAlpha320Catalog.mergeArray(CARD_CATALOG)}catch(e){console.warn('Alpha320 merge cache',e)}
      try{if(window.YGOCanonicalMergeCatalog)CARD_CATALOG=window.YGOCanonicalMergeCatalog(CARD_CATALOG)}catch(e){console.warn('Alpha329 canonical merge cache',e)}
      window.CARD_CATALOG=CARD_CATALOG;
      CARD_DB_BY_NAME=new Map(CARD_CATALOG.map(c=>[String(c.name||'').toLowerCase(),c]));
      return CARD_CATALOG;
    }
  }catch(e){console.warn('No se pudo leer la base local cacheada.',e)}
  try{rebuildCatalog(await getEmbeddedDB());try{if(window.YGOAlpha320Catalog?.mergeArray){CARD_CATALOG=window.YGOAlpha320Catalog.mergeArray(CARD_CATALOG)}}catch(e){console.warn('Alpha320 merge embedded',e)}try{if(window.YGOCanonicalMergeCatalog)CARD_CATALOG=window.YGOCanonicalMergeCatalog(CARD_CATALOG)}catch(e){console.warn('Alpha329 canonical merge embedded',e)}window.CARD_CATALOG=CARD_CATALOG;CARD_DB_BY_NAME=new Map(CARD_CATALOG.map(c=>[String(c.name||'').toLowerCase(),c]));await writeCatalogToDB();return CARD_CATALOG}
  catch(e){console.warn('Base CDB local no disponible',e);return CARD_CATALOG}
}

async function saveDeckEvaluationDB(d){try{const db=await openYGOCardDB();await new Promise((res,rej)=>{const tx=db.transaction(YGO_DB_DECKS,'readwrite');tx.objectStore(YGO_DB_DECKS).put({id:d.id||d.name,name:d.name,score:d.score,v:Array.isArray(d.v)?d.v.slice(0,10):[],evaluation:d.evaluation||null,updatedAt:Date.now()});tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}catch(e){console.warn('No se pudo guardar evaluación en IndexedDB',e)}}
let deckState={main:[],extra:[],side:[],skills:[]},activeZone='main',savedComboLines=[];
Object.defineProperty(window,'deckState',{configurable:true,get:()=>deckState,set:v=>{if(v&&typeof v==='object'){deckState={main:Array.isArray(v.main)?v.main:[],extra:Array.isArray(v.extra)?v.extra:[],side:Array.isArray(v.side)?v.side:[],skills:Array.isArray(v.skills)?v.skills:[]};}else deckState={main:[],extra:[],side:[],skills:[]}}});
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function allCards(){return [...deckState.main,...deckState.extra,...deckState.side]}
function setDeckZone(z){activeZone=z;document.querySelectorAll('.deck-tab').forEach(b=>b.classList.toggle('active',b.dataset.zone===z));document.getElementById('zoneLabel').textContent=z==='main'?'MAIN DECK':z==='extra'?'EXTRA DECK':'SIDE DECK';if(window.renderDeck)window.renderDeck();}
function renderCatalog(){let q=(document.getElementById('cardSearch').value||'').toLowerCase(),t=document.getElementById('cardType').value,r=document.getElementById('cardRole').value;let a=CARD_CATALOG.filter(c=>(!q||[c.name,c.type,c.attribute,c.role].join(' ').toLowerCase().includes(q))&&(!t||c.type===t)&&(!r||c.role===r));document.getElementById('catalog').innerHTML=a.map((c,i)=>`<div class="card-item"><div><div class="card-name">${esc(c.name)}</div><div class="card-meta">${c.type} · ${c.attribute} · ${c.role}</div></div><span class="qty">${countCard(c.name)}</span><button class="icon-btn" onclick="addCatalogCard(${i})">＋</button></div>`).join('')||'<div class="tiny" style="padding:10px">No se encontraron cartas.</div>'}
function cardQty(c){const q=Number(c?.qty??1);return Number.isSafeInteger(q)&&q>0?Math.min(60,q):1}
function countCard(name){return allCards().filter(c=>c.name===name).reduce((n,c)=>n+cardQty(c),0)}
function addCatalogCard(i){let c=CARD_CATALOG[i];addCard({...c})}
function addCard(c){invalidateDeckAnalysis();let max=activeZone==='main'?3:3, zone=deckState[activeZone], existing=zone.find(x=>x.name===c.name);if(existing){if(existing.qty>=max){toast('Máximo 3 copias de una carta.');return}existing.qty++}else zone.push({...c,qty:1});refreshDeckUI();window.checkBanDeck?.();toast(`${c.name} añadida.`);const target=existing||zone[zone.length-1];window.hydrateCardOnline?.(target).then(()=>{refreshDeckUI();invalidateDeckAnalysis();try{evaluate()}catch(_){};});}
function changeQty(zone,i,d){invalidateDeckAnalysis();const z=deckState?.[zone];if(!z||!z[i])return;const c=z[i],next=cardQty(c)+Number(d||0);if(next<=0)z.splice(i,1);else c.qty=Math.min(3,Math.floor(next));refreshDeckUI();window.checkBanDeck?.()}
function removeCard(zone,i){invalidateDeckAnalysis();deckState[zone].splice(i,1);refreshDeckUI();window.checkBanDeck?.()}
function renderDeck(){let z=deckState[activeZone];document.getElementById('deckList').innerHTML=z.map((c,i)=>`<div class="card-item"><div><div class="card-name">${esc(c.name)}</div><div class="card-meta">${c.type||'Carta'} · ${c.role||'Utility'}</div></div><span class="qty">x${cardQty(c)}</span><div><button class="icon-btn" onclick="changeQty('${activeZone}',${i},1)">＋</button><button class="icon-btn" onclick="changeQty('${activeZone}',${i},-1)">−</button><button class="icon-btn" onclick="removeCard('${activeZone}',${i})">×</button></div></div>`).join('')||'<div class="tiny" style="padding:10px">Esta zona está vacía.</div>';document.getElementById('mainCount').textContent=`${deckState.main.reduce((n,c)=>n+cardQty(c),0)}/40–60`;document.getElementById('extraCount').textContent=`${deckState.extra.reduce((n,c)=>n+cardQty(c),0)}/15`;document.getElementById('sideCount').textContent=`${deckState.side.reduce((n,c)=>n+cardQty(c),0)}/15`}
function deckCount(zone){return (deckState?.[zone]||[]).reduce((n,c)=>n+cardQty(c),0)}
function countRole(role,zone='main'){return (deckState?.[zone]||[]).filter(c=>c.role===role).reduce((n,c)=>n+cardQty(c),0)}

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function flatMain(){return (deckState?.main||[]).flatMap(c=>Array(cardQty(c)).fill(c))}
function drawHand(){let a=flatMain();return a.length>=5?shuffle(a).slice(0,5):[]}
function handAnalysis(hand){let starter=hand.some(c=>c.role==='Starter'||c.role==='Buscador'),ext=hand.some(c=>c.role==='Extender'),inter=hand.some(c=>['Interrupción','Hand Trap','Floodgate','Removal'].includes(c.role));return {starter,ext,inter,playable:starter&&(ext||inter||hand.length>=5)}}
function showHand(h){document.getElementById('hand').innerHTML=h.length?h.map(c=>`<div class="hand-card"><b>${esc(c.name)}</b>${esc(c.role||'Utility')}</div>`).join(''):'<span class="muted">Necesitas al menos 5 cartas en Main Deck.</span>'}
function simulateHand(){let h=drawHand();showHand(h);if(!h.length){document.getElementById('simResult').textContent='Necesitas al menos 5 cartas en el Main Deck.';return}let a=handAnalysis(h);document.getElementById('simResult').innerHTML=`${a.starter?'<span class="ok">✓ Starter encontrado</span>':'<span class="bad">✕ Sin starter</span>'} · ${a.ext?'<span class="ok">Extender</span>':'<span class="muted">Sin extender</span>'} · ${a.inter?'<span class="ok">Interacción</span>':'<span class="warn">Sin interacción</span>'} · ${a.playable?'<span class="ok">MANO JUGABLE</span>':'<span class="bad">MANO DÉBIL</span>'}`}
let consistencyCacheKey='',consistencyCache=null;function deckFingerprint(){return ['main','extra','side'].map(z=>(deckState[z]||[]).map(c=>`${c.id||c.name}:${cardQty(c)}`).sort().join(',')).join('|')}function simulateMany(N=10){const a=flatMain();if(a.length<5){toast('Necesitas al menos 5 cartas en Main Deck.');return}const key=deckFingerprint();if(consistencyCacheKey===key&&consistencyCache){const r=consistencyCache;document.getElementById('starterRate').textContent=r.starter+'%';document.getElementById('playableRate').textContent=r.playable+'%';document.getElementById('interactionRate').textContent=r.inter+'%';document.getElementById('deadRate').textContent=r.dead+'%';document.getElementById('simResult').innerHTML=`Resultado único de <b>10 duelos</b>: <span class="ok">${r.playable}% jugables</span>, ${r.starter}% con starter y ${r.inter}% con interacción. No cambia hasta modificar una carta.`;return}const duels=10;let st=pl=it=dead=0;for(let i=0;i<duels;i++){let h=shuffle(a).slice(0,5),x=handAnalysis(h);st+=x.starter?1:0;pl+=x.playable?1:0;it+=x.inter?1:0;dead+=h.filter(c=>['Boss','OTK'].includes(c.role)).length>2?1:0}const r={starter:Math.round(st/duels*100),playable:Math.round(pl/duels*100),inter:Math.round(it/duels*100),dead:Math.round(dead/duels*100)};consistencyCacheKey=key;consistencyCache=r;document.getElementById('starterRate').textContent=r.starter+'%';document.getElementById('playableRate').textContent=r.playable+'%';document.getElementById('interactionRate').textContent=r.inter+'%';document.getElementById('deadRate').textContent=r.dead+'%';document.getElementById('simResult').innerHTML=`Resultado único de <b>10 duelos</b>: <span class="ok">${r.playable}% jugables</span>, ${r.starter}% con starter y ${r.inter}% con interacción. No cambia hasta modificar alguna carta del Deck.`}
let comboSelectedName='';
var comboLastAnalysis=[];
let comboVideoSteps=[],comboVideoTimers=[];
function comboCardUrl(c){const id=c?.id??c?.cardId;return id?`https://images.ygoprodeck.com/images/cards/${encodeURIComponent(id)}.jpg`:''}
function comboText(c){return String(c?.desc||c?.text||'').trim()}
function comboNorm(c){return `${c?.name||''} ${c?.role||''} ${comboText(c)} ${c?.archetype||''} ${c?.archetypes||''}`.toLowerCase()}
function comboFeatures(c){const d=comboNorm(c),role=String(c?.role||'').toLowerCase(),type=String(c?.type||'').toLowerCase();return{
  extra:/fusion|synchro|xyz|link|fusión|sincronía|xyz|link/.test(type)||/fusion|synchro|xyz|link|fusión|material/.test(d)&&/extra/.test(String(c?._zone||'')),
  starter:/normal summon|if this card is normal summoned|cuando esta carta es invocada|al invocar|special summon this card|invoca especialmente/.test(d)||['starter','iniciador'].includes(role),
  search:/add .*?(from|to) (your )?hand|add .*from your deck|search|añade.*mazo|añade.*mano|busca.*mazo/.test(d)||role==='buscador',
  special:/special summon|invoca especialmente|invocación especial/.test(d),
  extender:/special summon|summon.*from (your )?hand|summon.*from grave|invoca especialmente|invocación especial/.test(d)||role==='extender',
  grave:/graveyard|\bgy\b|cementerio/.test(d),send:/send .*to the grave|send .*from .*deck|manda.*cementerio|enviar.*cementerio/.test(d),draw:/\bdraw\b|roba|robar/.test(d),discard:/discard|descarta|descartar/.test(d),
  material:/fusion material|synchro material|xyz material|link material|material de fusión|material synchro|material xyz|material link/.test(d),tuner:/\btuner\b|cantante/.test(d),level:/\blevel\b|nivel/.test(d),
  negate:/negate|negated|niega|negado|anula/.test(d),removal:/destroy|banish|send.*field.*grave|bounce|destruye|destierra|devuelve.*mano/.test(d),interaction:/quick effect|during either player's turn|during your opponent's turn|efecto rápido|durante el turno de cualquier jugador|durante el turno del adversario/.test(d),
  recycle:/add .*graveyard|return .*graveyard|recicl|devuelve.*cementerio|recupera.*cementerio/.test(d),boss:/\bboss\b|\botk\b|2500|3000|4000/.test(d),role,type
}}
function comboRoleScore(c){const f=comboFeatures(c);let x=0;if(f.starter)x+=30;if(f.search)x+=22;if(f.extender)x+=18;if(f.special)x+=8;if(f.send||f.grave)x+=8;if(f.draw)x+=6;if(f.negate)x+=10;if(f.removal)x+=9;if(f.interaction)x+=9;if(f.recycle)x+=7;if(f.material)x+=5;if(f.tuner)x+=4;if(f.boss)x+=4;if(f.extra)x+=2;if(/starter|buscador|extender|interrupción|hand trap/i.test(String(f.role)))x+=5;return x} function comboFormatKey(){const active=document.querySelector('.fmt.active');const f=String(active?.dataset?.f||'TCG').toLowerCase();if(f.includes('master'))return'master';if(f.includes('ocg'))return'ocg';if(f.includes('duel links')&&f.includes('rush'))return'duelLinksRush';if(f.includes('duel links'))return'duelLinksSpeed';if(f.includes('time wizard'))return'timeWizard';if(f.includes('goat'))return'goat';if(f.includes('rush'))return'rush';if(f.includes('speed'))return'speedDuel';return'tcg'}
function comboFormatRules(){const k=comboFormatKey();const rules={tcg:{name:'TCG Advanced',main:[40,60],extra:[0,15],side:[0,15],extraTypes:true},ocg:{name:'OCG',main:[40,60],extra:[0,15],side:[0,15],extraTypes:true},master:{name:'Master Duel',main:[40,60],extra:[0,15],side:[0,0],extraTypes:true},duelLinksSpeed:{name:'Duel Links · SPEED',main:[20,30],extra:[0,8],side:[0,0],extraTypes:true},speedDuel:{name:'Speed Duel · TCG',main:[20,30],extra:[0,6],side:[0,6],extraTypes:true},duelLinksRush:{name:'Duel Links · RUSH',main:[30,60],extra:[0,15],side:[0,0],extraTypes:false},rush:{name:'Rush Duel',main:[40,60],extra:[0,15],side:[0,15],extraTypes:false},goat:{name:'GOAT Format',main:[40,60],extra:[0,15],side:[0,15],extraTypes:true},timeWizard:{name:'Time Wizard',main:[40,60],extra:[0,15],side:[0,15],extraTypes:true}};return rules[k]||rules.tcg}
function comboBanAllowed(c){try{const rule=window.banRuleForCard?.(c);if(!rule)return true;return (Number(c.qty)||1)<=Number(rule.max??3)}catch(e){return true}}
function comboMainExtraPool(){const main=(deckState.main||[]).map(c=>({...c,_zone:'main'}));const extra=(deckState.extra||[]).map(c=>({...c,_zone:'extra'}));return [...main,...extra].filter(c=>comboBanAllowed(c))}
function comboAllPools(){return ['main','extra','side'].flatMap(z=>(deckState[z]||[]).map(c=>({...c,_zone:z}))).filter(c=>comboBanAllowed(c))}
function comboAction(a,b){const A=comboFeatures(a),B=comboFeatures(b);if(A.starter&&(B.search||B.special))return'INICIA → ACCESO';if(A.starter&&B.extender)return'INICIA → EXTENSIÓN';if(A.send&&B.grave)return'ENVÍA → CEMENTERIO';if(A.special&&(B.material||B.extra))return'GENERA CUERPO → EXTRA';if(A.tuner&&(B.level||B.extra))return'AJUSTA NIVEL → EXTRA';if(A.search&&B.extender)return'BUSCA → EXTIENDE';if(B.negate||B.removal)return'DESARROLLO → INTERACCIÓN';return'RECURSO → CONTINUIDAD'}
function comboExplainLine(line){return line.map((c,i)=>i===0?'INICIO':comboAction(line[i-1],c)).join(' → ')}
function comboLineResult(line){const f=line.map(comboFeatures),out=[];if(f.some(x=>x.search))out.push('acceso');if(f.some(x=>x.extender||x.special))out.push('extensión');if(f.some(x=>x.extra||x.material))out.push('Extra Deck');if(f.some(x=>x.negate))out.push('interacción');if(f.some(x=>x.removal))out.push('removal');if(f.some(x=>x.recycle))out.push('recursión');return out.join(' · ')||'continuidad'}
function comboCardHtmlLarge(c){const u=comboCardUrl(c),n=esc(c?.name||'Carta'),zone=String(c?._zone||'main').toUpperCase(),effect=esc(comboText(c)||'Texto de efecto no disponible.');return `<div class="combo-visual-card">${u?`<img loading="lazy" src="${u}" alt="${n}" onerror="this.style.opacity=.2">`:'<div class="card-thumb-placeholder">'+n+'</div>'}<div><div class="cv-name">${n}</div><div class="cv-zone">${zone} · ${esc(c?.role||'Utility')}</div><div class="cv-effect">${effect}</div></div></div>`}
function comboCardHtmlSmall(c){
  const u=comboCardUrl(c),n=esc(c?.name||'Carta');
  return `<button class="combo-step" type="button" onclick='selectComboCard(${JSON.stringify(c?.name||'').replace(/'/g,'&#39;')})' title="${n}">${u?`<img loading="lazy" src="${u}" alt="${n}">`:'<span class="card-thumb-placeholder">'+n+'</span>'}<span><strong>${n}</strong><small>${esc(String(c?._zone||'main').toUpperCase())} · ${esc(c?.role||'Utility')}</small></span></button>`;
}
function renderComboDeckCards(){
  const host=document.getElementById('comboDeckCards');
  if(!host)return;
  const cards=comboAllPools();
  const summary=document.getElementById('comboDeckSummary');
  if(summary)summary.textContent=`${deckCount('main')} MAIN · ${deckCount('extra')} EXTRA · ${deckCount('side')} SIDE · ${cards.length} cartas elegibles`;
  host.innerHTML=cards.length?cards.map(c=>{
    const u=comboCardUrl(c),n=esc(c.name),q=cardQty(c);
    return `<div class="combo-card" role="button" tabindex="0" onclick='selectComboCard(${JSON.stringify(c.name).replace(/'/g,'&#39;')})' onkeydown='if(event.key==="Enter"||event.key===" ")selectComboCard(${JSON.stringify(c.name).replace(/'/g,'&#39;')})' title="${n}">${u?`<img loading="lazy" src="${u}" alt="${n}">`:'<div class="card-thumb-placeholder">'+n+'</div>'}<div class="combo-card-name">${n}</div><span class="combo-card-qty">x${q}</span><div class="combo-card-meta">${esc(String(c._zone||'main').toUpperCase())}</div></div>`;
  }).join(''):'<div class="result muted">Añade cartas al Deck para formar el ecosistema de combos.</div>';
}
function comboCardOptions(c){
  const t=String(c?.desc||c?.text||'').toLowerCase();
  const role=String(c?.role||'').toLowerCase();
  const opts=[];
  const add=(x)=>{if(x&&!opts.includes(x))opts.push(x)};
  if(/normal summon|normalmente invoca|normal summon this card/.test(t)||role.includes('starter'))add('Usarla como inicio del turno / starter.');
  if(/special summon|invocación especial|special summon this card/.test(t)||role.includes('extender'))add('Extender la jugada mediante una Invocación Especial.');
  if(/add .*from (your )?deck|add .* from the deck|añade .*deck|añadir .*deck|search/.test(t)||role.includes('buscador'))add('Buscar o añadir una carta desde el Deck.');
  if(/draw|roba|draw 1|draw cards/.test(t)||role.includes('robo'))add('Generar ventaja de cartas mediante robo.');
  if(/destroy|destroyed|destruye|destru|banish|destierra|return .*hand|return .*field/.test(t)||role.includes('removal'))add('Retirar una amenaza mediante destrucción, destierro o devolución.');
  if(/negate|negates|negación|niega|neg[a-z]* activation/.test(t)||role.includes('interrup'))add('Interrumpir una jugada o negar una activación/efecto.');
  if(/target|objetivo|target 1|elige 1/.test(t))add('Elegir un objetivo y aplicar el efecto correspondiente.');
  if(/graveyard|gy|cementerio|banished|desterr/.test(t)||role.includes('recicl'))add('Aprovechar o recuperar recursos del Cementerio/Destierro.');
  if(/material|xyz|synchro|fusion|link|tribute|tribut/.test(t)||role.includes('material'))add('Usarla como material o recurso para acceder al Extra Deck.');
  if(/protect|cannot be destroyed|cannot be targeted|proteger|no puede ser destru/.test(t)||role.includes('protección'))add('Proteger tus cartas, monstruos o recursos.');
  if(/otk|8000|damage|daño/.test(t)||role.includes('otk'))add('Convertir la ventaja en presión de daño / OTK.');
  if(!opts.length) add('Usarla según su texto de efecto y combinarla con las cartas compatibles de tu Deck.');
  if(/quick effect|efecto rápido/.test(t))add('Usar el Efecto Rápido como interacción durante la Cadena o el turno rival, si se cumplen sus condiciones.');
  if(/once per turn|una vez por turno/.test(t))add('Administrar el efecto por turno: comprobar si ya fue utilizado antes de intentar otra copia/activación.');
  if(/tribute|tribut/.test(t))add('Usarla como Tributo si el efecto o la Invocación lo exige.');
  if(/fusion|synchro|xyz|link|fusión|sincron|rango/.test(t))add('Abrir una ruta concreta al Extra Deck comprobando materiales y condiciones de Invocación.');
  return opts.slice(0,8);
}
function renderSelectedCardOptions(c){
  const host=document.getElementById('comboSelected'); if(!host||!c)return;
  const effect=String(c.desc||c.text||'Texto de efecto no disponible.');
  const opts=comboCardOptions(c);
  host.classList.remove('muted');
  host.innerHTML=`<div class="selected-card-action-head"><b>${esc(c.name)}</b><span>${esc(c._zone?String(c._zone).toUpperCase():'MAIN')} · ${esc(c.role||'Utility')}</span></div><div class="selected-card-action-effect"><b>EFECTO:</b><br>${esc(effect)}</div><div class="selected-card-options"><b>POSIBLES OPCIONES</b>${opts.map((x,i)=>`<div class="selected-option"><span>${i+1}</span><span>${esc(x)}</span></div>`).join('')}</div>`;
}
function selectComboCard(name){
  const c=comboAllPools().find(x=>String(x.name)===String(name))||allCards().find(x=>String(x.name)===String(name));
  if(!c)return;
  comboSelectedName=c.name;
  try{selectCardDetail(c.name)}catch{}
  const effect=document.getElementById('comboEffectText');if(effect)effect.textContent=latinSpanishCardText(c.desc||c.text||'Texto de efecto no disponible.');
  renderSelectedCardOptions(c);
  const status=document.getElementById('comboRuleStatus');if(status)status.innerHTML=`<b>${esc(c.name)}</b> · ${esc(comboFormatRules().name)} · ${comboBanAllowed(c)?'LEGAL / DISPONIBLE':'NO LEGAL EN EL FORMATO ACTIVO'}`;
  document.querySelectorAll('#comboDeckCards .combo-card').forEach(el=>el.classList.toggle('selected',(el.getAttribute('title')||'')===c.name));
}
function comboActionCardHtml(name,id,active=false){
 const c=allCards().find(x=>String(x.id||'')===String(id))||allCards().find(x=>String(x.name||'')===String(name))||{name:name||'Carta',id:id};
 const u=comboCardUrl(c); return `<div class="combo-action-card ${active?'active':''}">${u?`<img src="${u}" alt="${esc(c.name||name)}">`:`<div class="card-thumb-placeholder">${esc(c.name||name)}</div>`}<b>${esc(c.name||name)}</b></div>`;
}
function comboDuelSlot(label,items,cls='',activeName=''){const a=Array.isArray(items)?items:[];return `<div class="duel-zone ${cls}"><span class="duel-zone-label">${label}</span><div class="duel-slots">${[0,1,2,3,4].map(i=>`<div class="duel-slot">${a[i]?comboActionCardHtml(a[i],a[i]?.id,String(a[i]?.name||a[i])===String(activeName)):'<i>VACÍO</i>'}</div>`).join('')}</div></div>`}
function comboDuelBoardHtml(s,activeName=''){const src=s||{},fromState=Array.isArray(src?.zones)&&src.zones.length>=2,flat=x=>x?.card?{...x.card}:x,z=(p,n)=>fromState?(Array.isArray(src.zones?.[p]?.[n])?src.zones[p][n].map(flat):[]):[],snap=fromState?{hand:z(0,'hand'),monster:z(0,'monster'),spelltrap:z(0,'spelltrap'),gy:z(0,'gy'),banished:z(0,'banished'),deck:z(0,'deck').length,extra:z(0,'extra'),opponentHand:z(1,'hand'),opponentMonster:z(1,'monster'),opponentSpelltrap:z(1,'spelltrap'),opponentGy:z(1,'gy'),opponentBanished:z(1,'banished'),opponentDeck:z(1,'deck').length,opponentExtra:z(1,'extra'),lp:Array.isArray(src.lp)?src.lp:[8000,8000],turn:src.turn,phase:src.phase,chainDepth:Array.isArray(src.chain)?src.chain.length:0}:src,lp=Array.isArray(snap.lp)?snap.lp:[8000,8000],oppMon=snap.opponentMonster||snap.opponentMonsters||[],oppBack=snap.opponentSpelltrap||snap.opponentBackrow||[],oppHand=snap.opponentHand||[],oppGy=snap.opponentGy||[],oppBan=snap.opponentBanished||[],oppDeck=Number.isFinite(Number(snap.opponentDeck))?Number(snap.opponentDeck):'—',rivalKnown=oppMon.length||oppBack.length||oppHand.length||oppGy.length||oppBan.length||Number.isFinite(Number(snap.opponentDeck));return `<div class="combo-duel-board"><div class="duel-opponent"><div class="duel-row duel-meta"><b>RIVAL</b><span>LP ${Number(lp[1]??8000)}</span><span>DECK ${oppDeck}</span><span>MANO ${oppHand.length}</span><span>GY ${oppGy.length}</span><span>BAN ${oppBan.length}</span>${!rivalKnown?'<span>ESTADO RIVAL NO MODELADO</span>':''}</div>${comboDuelSlot('MONSTRUOS',oppMon,'opponent-monsters',activeName)}${comboDuelSlot('MÁGICAS / TRAMPAS',oppBack,'opponent-backrow',activeName)}</div><div class="duel-middle"><div class="duel-side-zone"><b>DECK</b><span>${Number(snap.deck||0)}</span><small>GY ${Array.isArray(snap.gy)?snap.gy.length:0} · BAN ${Array.isArray(snap.banished)?snap.banished.length:0}</small></div><div class="duel-center"><div class="duel-field-zone"><span>FIELD ZONE · T${Number(snap.turn||1)} · ${esc(String(snap.phase||'MAIN 1'))} · CADENA ${Number(snap.chainDepth||0)}</span></div>${comboDuelSlot('TUS MONSTRUOS',snap.monster,'player-monsters',activeName)}${comboDuelSlot('TUS MÁGICAS / TRAMPAS',snap.spelltrap,'player-backrow',activeName)}<div class="duel-field-zone"><span>EXTRA MONSTER ZONE / CAMPO</span></div></div><div class="duel-side-zone"><b>EXTRA</b><span>${Array.isArray(snap.extra)?snap.extra.length:0}</span></div></div><div class="duel-player"><div class="duel-row duel-meta"><b>TÚ</b><span>LP ${Number(lp[0]??8000)}</span><span>GY ${Array.isArray(snap.gy)?snap.gy.length:0}</span><span>BAN ${Array.isArray(snap.banished)?snap.banished.length:0}</span></div><div class="duel-hand"><b>MANO</b>${(snap.hand||[]).map(n=>comboActionCardHtml(n,n?.id,String(n?.name||n)===String(activeName))).join('')||'<i>Sin cartas</i>'}</div></div></div>`}
function comboBoardMiniHtml(s){return comboDuelBoardHtml(s)}
function comboVideoActionHtml(a,i){
 const n=esc(a?.card||'Carta'),type=esc(a?.actionType||'EFECTO'),effect=esc(translateCardText(a?.effectText||'',getCardDetailLanguage()));
 const result=esc(a?.result||'RESUELTA'),before=a?.before||{},after=a?.after||{};
 return `<div class="combo-video-action"><div class="combo-video-action-head"><b>PASO ${i+1} · ${n}</b><span>${type}</span></div><div class="combo-action-scene"><div class="combo-scene-side"><small>ANTES</small>${comboDuelBoardHtml(before,a?.card)}</div><div class="combo-scene-arrow">➜</div><div class="combo-scene-side"><small>DESPUÉS</small>${comboDuelBoardHtml(after,a?.card)}</div></div><div class="combo-video-action-body"><div class="combo-action-effect"><b>ACCIÓN DEL JUGADOR</b><p>${effect||'Ejecuta la acción indicada por la carta y comprueba sus condiciones.'}</p></div><div class="combo-action-result"><b>RESULTADO</b><p>${result}</p></div></div></div>`;
}
function renderComboLines(){
  const host=document.getElementById('comboLines');if(!host)return;
  const lines=(comboLastAnalysis||[]).slice(0,5);
  host.innerHTML=lines.length?lines.map((x,i)=>{const actions=x.actions||[];return `<article class="combo-line"><h4>COMBO ${i+1} · ${esc(x.line?.[0]?.name||'Línea principal')} <span class="line-score">${x.score}/100</span></h4><p><b>MANO INICIAL:</b> ${esc((x.simulation?.openingHand||[]).map(v=>v?.name||v).join(' · ')||'No registrada')}</p><div class="combo-action-list">${actions.map(comboVideoActionHtml).join('')}</div><p><b>ESTADO:</b> ${x.verified?'VERIFICADO':'NO VERIFICADO'} · <b>PASOS:</b> ${actions.length}</p></article>`}).join(''):'<div class="result muted">Analiza la baraja para mostrar los 5 mejores combos posibles.</div>';
}
function comboVideoCard(c,active){const u=comboCardUrl(c),n=esc(c?.name||'Carta');return `<div class="combo-video-step ${active?'active':''}">${u?`<img loading="lazy" src="${u}" alt="${n}">`:'<div class="card-thumb-placeholder">'+n+'</div>'}<b>${n}</b><small>${esc(String(c?._zone||'main').toUpperCase())}</small></div>`}
function renderComboVisualTop5(){
  const host=document.getElementById('comboVisualTop5');if(!host)return;
  const lines=(comboLastAnalysis||[]).slice(0,5);
  if(!lines.length){host.innerHTML='<div class="result muted">El TOP 5 aparecerá al analizar una baraja con al menos 5 cartas en Main Deck.</div>';renderComboEndBoard();return}
  host.innerHTML=lines.map((x,i)=>{const line=x.line||[],actions=x.actions||[];return `<article class="combo-video" data-video-index="${i}"><div class="combo-video-head"><b>VIDEO ${i+1} · ${esc(line[0]?.name||'Línea')}</b><span>${x.score}/100 · ${x.verified?'VERIFICADO':'NO VERIFICADO'}</span></div><div class="combo-video-opening"><b>MANO INICIAL</b><div class="combo-opening-cards">${(x.simulation?.openingHand||[]).map(v=>comboActionCardHtml(v?.name||v,v?.id,false)).join('')||'<span>—</span>'}</div></div><div class="combo-video-screen"><div class="combo-video-current" id="comboVideoCurrent${i}">${comboVideoActionHtml(actions[0],0)}</div></div><div class="combo-video-track"><div class="combo-video-progress" id="comboVideoProgress${i}"></div></div><div class="combo-video-controls"><button class="adv-btn gold" type="button" onclick="playComboVideo(${i})">▶ REPRODUCIR</button><button class="adv-btn" type="button" onclick="pauseComboVideo(${i})">Ⅱ PAUSA</button><button class="adv-btn" type="button" onclick="resetComboVideo(${i})">↺ REINICIAR</button><span id="comboVideoStep${i}">PASO 1 / ${actions.length}</span></div><div class="combo-video-sequence">${actions.map((a,j)=>`<button type="button" class="combo-video-thumb" onclick="seekComboVideo(${i},${j})" title="Paso ${j+1}">${comboVideoCard({name:a.card,id:a.cardId,_zone:'main'},j===0)}</button>`).join('')}</div><div class="combo-video-action-stack">${actions.map(comboVideoActionHtml).join('')}</div></article>`}).join('');
  renderComboEndBoard(lines);lines.forEach((_,i)=>paintComboVideo(i,0));
}
function renderComboEndBoard(lines){
  const host=document.getElementById('comboEndBoard');if(!host)return;
  const arr=(lines||comboLastAnalysis||[]).slice(0,5);
  if(!arr.length){host.innerHTML='';return}
  const resolveCard=v=>{
    if(v?.card)return v.card;
    const id=String(v?.id||'');
    const name=String(v?.name||v||'');
    const all=allCards();
    return all.find(c=>String(c?.id||'')===id)||all.find(c=>String(c?.name||'')===name)||{name:name||'Carta',id:id||null};
  };
  const img=c=>{const u=comboCardUrl(c);return u?`<img loading="lazy" src="${u}" alt="${esc(c?.name||'Carta')}">`:`<div class="card-thumb-placeholder">${esc(c?.name||'Carta')}</div>`};
  const card=v=>{const c=resolveCard(v);return `<div class="endboard-card">${img(c)}<b>${esc(c.name||'Carta')}</b></div>`};
  const zoneBlock=(label,items,limit=5)=>`<div style="margin-top:8px"><b style="display:block;color:#63dcff;font-size:8px;margin-bottom:4px">${label} · ${items.length}</b><div style="display:flex;gap:7px;flex-wrap:wrap">${items.slice(0,limit).map(card).join('')||'<span class="tiny muted">—</span>'}</div></div>`;
  host.innerHTML=`<div class="endboard-title"><b>END BOARD · ESTADO FINAL GUARDADO</b><span>Sin segunda simulación</span></div>`+
    arr.map((x,i)=>{const fb=x.simulation?.finalBoard||{};const mon=fb.monsters||[],back=fb.spelltrap||[],hand=fb.hand||[],gy=fb.gy||[],ban=fb.banished||[];
      return `<div class="combo-endboard-result" style="margin:0 0 12px;padding:10px;border:1px solid rgba(0,180,255,.22)"><b>COMBO ${i+1}</b> · ${esc(x.status||'')} · ${esc(String(x.actions?.length||0))} pasos`+
      zoneBlock('CAMPO · MONSTRUOS',mon)+zoneBlock('CAMPO · MÁGICAS/TRAMPAS',back)+zoneBlock('MANO FINAL',hand)+zoneBlock('CEMENTERIO',gy,8)+zoneBlock('DESTERRADAS',ban,8)+`</div>`}).join('');
}
function paintComboVideo(i,step){const x=(comboLastAnalysis||[])[i],actions=x?.actions||[],cur=Math.max(0,Math.min(actions.length-1,Number(step)||0));comboVideoSteps[i]=cur;const h=document.getElementById('comboVideoCurrent'+i),p=document.getElementById('comboVideoProgress'+i),s=document.getElementById('comboVideoStep'+i);if(h)h.innerHTML=comboVideoActionHtml(actions[cur],cur);if(p)p.style.width=(actions.length?((cur+1)/actions.length*100):0)+'%';if(s)s.textContent=`PASO ${cur+1} / ${actions.length}`;document.querySelectorAll(`[data-video-index="${i}"] .combo-video-thumb`).forEach((b,j)=>b.classList.toggle('active',j===cur));}
function playComboVideo(i){pauseComboVideo(i);const actions=comboLastAnalysis?.[i]?.actions||[];if(!actions.length)return;let s=Number.isInteger(comboVideoSteps[i])?comboVideoSteps[i]:0;paintComboVideo(i,s);comboVideoTimers[i]=setInterval(()=>{s++;if(s>=actions.length){paintComboVideo(i,actions.length-1);pauseComboVideo(i);return}paintComboVideo(i,s)},1400)}
function pauseComboVideo(i){if(comboVideoTimers[i]){clearInterval(comboVideoTimers[i]);delete comboVideoTimers[i]}}
function resetComboVideo(i){pauseComboVideo(i);paintComboVideo(i,0)}
function seekComboVideo(i,step){pauseComboVideo(i);paintComboVideo(i,step)}
function autoAnalyzeAllCombos(){renderComboDeckCards();if(!deckCount('main')||deckCount('main')<5){comboLastAnalysis=[];renderComboLines();renderComboVisualTop5();renderComboEndBoard();return []}return W.comboBuildCandidates?.()||[];}
function normalizedCardKind(c){
 const bits=Number(c?.typeBits)||0;
 if(bits&1)return 'monster';if(bits&2)return 'spell';if(bits&4)return 'trap';
 const type=String(c?.type||c?.frameType||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 if(/monster|monstruo/.test(type))return 'monster';
 if(/spell|magica|magia/.test(type))return 'spell';
 if(/trap|trampa/.test(type))return 'trap';
 return 'unknown';
}
window.normalizedCardKind=normalizedCardKind;
function renderComposition(){
 const counts={monster:0,spell:0,trap:0,unknown:0};let main=0;
 for(const card of (deckState?.main||[])){const qty=cardQty(card);main+=qty;counts[normalizedCardKind(card)]+=qty;}
 const metrics=[['TOTAL',main],['MONSTRUOS',counts.monster],['MÁGICAS',counts.spell],['TRAMPAS',counts.trap]];
 if(counts.unknown)metrics.push(['SIN CLASIFICAR',counts.unknown]);
 const host=document.getElementById('composition');if(host)host.innerHTML=metrics.map(([label,value])=>`<div class="metric"><b>${value}</b><span>${label}</span></div>`).join('');
 const roles=['Starter','Extender','Interrupción','Buscador','Removal','Boss','Hand Trap','Floodgate','Reciclador','OTK'];
 const bars=document.getElementById('roleBars');
 if(bars)bars.innerHTML=roles.map(role=>{const n=countRole(role),pct=main?Math.round(n/main*100):0;return `<div class="analysis-line"><span>${role}</span><div class="analysis-track"><div class="analysis-fill" style="width:${Math.min(100,pct)}%"></div></div><b>${n}</b></div>`}).join('');
 return {main,...counts};
}
function refreshDeckUI(){try{(window.renderDeck||renderDeck)?.()}catch(e){console.warn('Render mazo',e)}try{renderComposition?.()}catch(e){}try{window.YGOCanonical?.syncWeaknesses?.()}catch(e){}try{window.YGOCanonical?.renderScoreCards?.()}catch(e){}try{window.checkBanDeck?.()}catch(e){}try{clearTimeout(window.__ygoAutoAnalysisTimer);/* no automatic recalc from UI refresh */}catch(e){}}
function renderAllAdvanced(){refreshDeckUI();}
window.labTab=window.labTab||function(id,btn){document.querySelectorAll('.lab-panel').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.lab-tab').forEach(b=>b.classList.remove('active'));const panel=document.getElementById('lab-'+id);if(panel)panel.classList.add('active');if(btn)btn.classList.add('active');};
renderAllAdvanced();


function invalidateDeckAnalysis(){consistencyCacheKey='';consistencyCache=null;comboLastAnalysis=[];}
function latinSpanishCardText(text){const s=String(text||'').trim();return s||'Texto de efecto no disponible.';}

const CARD_DETAIL_LANG_KEY='ygoCardDetailLanguage';
const YGO_LANG_CODES={en:'en',fr:'fr',de:'de',pt:'pt',it:'it'};
const YGO_LOCALIZED_CACHE=new Map();
function getCardDetailLanguage(){try{return localStorage.getItem(CARD_DETAIL_LANG_KEY)||'es'}catch{return'es'}}
function setCardDetailLanguage(lang){try{localStorage.setItem(CARD_DETAIL_LANG_KEY,lang)}catch{};const active=window.__selectedCardDetailName;if(active)selectCardDetail(active)}
function localText(c,lang){const d=c||{};if(lang==='es')return d.desc_es||d.text_es||d.spanish_desc||'';if(lang==='en')return d.desc||d.text||'';return d[`desc_${lang}`]||d[`text_${lang}`]||''}
function localName(c,lang){const d=c||{};if(lang==='es')return d.name_es||d.spanish_name||'';if(lang==='en')return d.name||'';return d[`name_${lang}`]||d.localizedName||''}
async function fetchLocalizedCard(c,lang){if(!c||lang==='es'||lang==='en')return c;if(!YGO_LANG_CODES[lang])return c;const key=`${c.id||c.name}|${lang}`;if(YGO_LOCALIZED_CACHE.has(key))return YGO_LOCALIZED_CACHE.get(key);try{const url=`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${encodeURIComponent(c.id||'')}&language=${YGO_LANG_CODES[lang]}`;const r=await fetch(url,{cache:'force-cache'});if(!r.ok)return c;const j=await r.json();const hit=j?.data?.[0];if(hit){const merged={...c,name:hit.name||c.name,desc:hit.desc||c.desc,localizedName:hit.name,localizedDesc:hit.desc,language:lang};YGO_LOCALIZED_CACHE.set(key,merged);return merged}}catch(_){}return c}
function translateCardText(text,lang){return String(text||'').trim()}
function renderCardDetailLanguageSelect(){const l=getCardDetailLanguage();return `<div class="card-detail-language"><label>IDIOMA DEL TEXTO:</label><select aria-label="Idioma del texto de la carta" onchange="setCardDetailLanguage(this.value)"><option value="es" ${l==='es'?'selected':''}>Español</option><option value="en" ${l==='en'?'selected':''}>English</option><option value="fr" ${l==='fr'?'selected':''}>Français</option><option value="de" ${l==='de'?'selected':''}>Deutsch</option><option value="pt" ${l==='pt'?'selected':''}>Português</option><option value="it" ${l==='it'?'selected':''}>Italiano</option></select></div>`}
async function selectCardDetail(name){const base=allCards().find(x=>String(x.name)===String(name))||CARD_CATALOG.find(x=>String(x.name)===String(name));const host=document.getElementById('selectedCardDetail');if(!host||!base)return;window.__selectedCardDetailName=base.name;const lang=getCardDetailLanguage();const c=await fetchLocalizedCard(base,lang);const url=typeof imgFor==='function'?imgFor(c):comboCardUrl(c);const types=[c.type,c.attribute,c.race?String(c.race):''].filter(Boolean).join(' · ');const localizedEffect=localText(c,lang),verified=lang==='en'||!!localizedEffect,effect=localizedEffect||(lang==='es'&&base.desc?`[Texto fuente EN · traducción oficial ES no disponible]\n${base.desc}`:localText(base,'en')),shownName=localName(c,lang)||localName(base,lang)||c.name||base.name;const langLabel={es:'ESPAÑOL',en:'ENGLISH',fr:'FRANÇAIS',de:'DEUTSCH',pt:'PORTUGUÊS',it:'ITALIANO'}[lang]||lang.toUpperCase();host.innerHTML=`<div class="card-detail-title">CARTA SELECCIONADA · VISTA COMPLETA</div>${renderCardDetailLanguageSelect()}<div class="card-detail-content"><div class="card-detail-visual">${url?`<img class="card-detail-image" loading="lazy" src="${url}" alt="${esc(c.name)}">`:'<div class="card-detail-image-placeholder">Sin imagen</div>'}</div><div class="card-detail-data"><h3>${esc(shownName)}</h3><div class="card-detail-meta">${esc(types||'Carta')} · ${esc(c.role||'Utility')}</div><div class="card-detail-archetype">${esc((c.archetypes||[]).join(' · ')||c.archetype||'Sin arquetipo')}</div><div class="card-detail-effect"><b>TEXTO DE LA CARTA · ${langLabel}${verified?'':' · TEXTO LOCALIZADO NO DISPONIBLE'}</b><p>${esc(effect)}</p></div><div class="card-detail-stats">ATK ${Number(c.atk)||0} · DEF ${Number(c.def)||0} · NIVEL ${Number(c.level)||0}${c.race?' · '+esc(c.race):''}</div><div class="ygo-ruling-actions"><button class="adv-btn" type="button" onclick="openRulingSimulator(${JSON.stringify(base.name).replace(/</g,'\\u003c')})">⚖ SIMULAR RULING</button></div></div></div>`}

function scheduleAutoComboAnalysis(){clearTimeout(window.__comboTimer); /* intentionally user-triggered only */ return null}
let consistencyObservedKey='';const __oldRefreshDeckUI=refreshDeckUI;refreshDeckUI=function(){try{const now=deckFingerprint();if(consistencyObservedKey&&now!==consistencyObservedKey)invalidateDeckAnalysis();consistencyObservedKey=now}catch(e){}try{__oldRefreshDeckUI()}catch(e){}scheduleAutoComboAnalysis();}

// La selección de cartas del ecosistema ya dispara directamente el TOP 5 y el panel de detalle.

