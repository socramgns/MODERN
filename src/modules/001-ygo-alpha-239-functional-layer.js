
(()=>{
'use strict';
const W=window,D=document;
const esc235=W.esc||((x)=>String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])));
const norm238=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const API238='https://db.ygoprodeck.com/api/v7/';
const LANG238={es:{label:'Español',code:null},en:{label:'English',code:'en'},fr:{label:'Français',code:'fr'},de:{label:'Deutsch',code:'de'},pt:{label:'Português',code:'pt'},it:{label:'Italiano',code:'it'}};
W.isExtra=W.isExtra||function(c){return /Fusion|Synchro|XYZ|Xyz|Link Monster/i.test(String(c?.type||''))};
let ARCHES240=[];
const ARCH_CARD_CACHE238=new Map();
const LOCALIZED238=new Map();
let currentLang238=(()=>{try{return localStorage.getItem('ygoDeckLanguage')||'es'}catch(_){return'es'}})();

function setLangStorage238(v){currentLang238=LANG238[v]?v:'es';try{localStorage.setItem('ygoDeckLanguage',currentLang238)}catch(_){}}
function cardKey238(c){return String(c?.id??c?.cardId??c?.name??'')}
function displayName238(c){if(!c)return'Carta';if(currentLang238==='es')return c.name_es||c.spanish_name||c._localizedName||c.localizedName||c.name||'Carta';return c._localizedName||c.localizedName||c.name||'Carta'}
function displayDesc238(c){if(!c)return '';if(currentLang238==='es')return c.desc_es||c.text_es||c.spanish_desc||(c.desc?`[Texto fuente EN · traducción oficial ES no disponible]\n${c.desc}`:'Texto oficial en español no disponible.');return c?._localizedDesc||c?.localizedDesc||c?.desc||''}

async function localizedCard238(c,lang=currentLang238){
  if(!c||!LANG238[lang]||lang==='es')return c;
  const key=cardKey238(c)+'|'+lang;
  if(LOCALIZED238.has(key))return LOCALIZED238.get(key);
  if(!c.id)return c;
  try{
    const url=API238+'cardinfo.php?id='+encodeURIComponent(c.id)+'&language='+LANG238[lang].code;
    const r=await fetch(url,{cache:'force-cache'});
    if(!r.ok)throw Error('HTTP '+r.status);
    const j=await r.json(),hit=j?.data?.[0];
    if(hit){
      const v={...c,_localizedName:hit.name||c.name,_localizedDesc:hit.desc||c.desc,_language:lang};
      LOCALIZED238.set(key,v);
      return v;
    }
  }catch(_){}
  LOCALIZED238.set(key,c);
  return c;
}
async function localizeAll238(){
  if(currentLang238==='es'){const cards=typeof W.allCards==='function'?W.allCards():[];for(const c of cards){if(!c)continue;c._localizedName=c.name_es||c.spanish_name||c.name;c._localizedDesc=c.desc_es||c.text_es||c.spanish_desc||(c.desc?`[Texto fuente EN · traducción oficial ES no disponible]\n${c.desc}`:'');c._language='es';c._localizedOfficial=!!(c.desc_es||c.text_es||c.spanish_desc||c.name_es||c.spanish_name)}return;}
  const cards=typeof W.allCards==='function'?W.allCards():[];
  const uniq=[...new Map(cards.filter(Boolean).map(c=>[cardKey238(c),c])).values()];
  // Use batched ID requests instead of one request per card; this avoids rate-limit pressure and localizes the whole visible deck.
  const ids=uniq.map(c=>String(c.id||'')).filter(id=>/^\d+$/.test(id));
  const chunks=[];for(let i=0;i<ids.length;i+=40)chunks.push(ids.slice(i,i+40));
  for(const chunk of chunks){
    try{
      const url=API238+'cardinfo.php?id='+encodeURIComponent(chunk.join(','))+'&language='+LANG238[currentLang238].code;
      const r=await fetch(url,{cache:'force-cache'});if(!r.ok)continue;
      const j=await r.json();const byId=new Map((j?.data||[]).map(v=>[String(v.id),v]));
      for(const c of uniq){const hit=byId.get(String(c.id));if(hit){c._localizedName=hit.name||c.name;c._localizedDesc=hit.desc||c.desc;c._language=currentLang238;LOCALIZED238.set(cardKey238(c)+'|'+currentLang238,c)}}
    }catch(_){}
  }
  // Fallback for cards without numeric IDs or when a batch endpoint is unavailable.
  for(const c of uniq){if(!c._localizedName)try{const v=await localizedCard238(c,currentLang238);if(v&&v!==c){c._localizedName=v._localizedName;c._localizedDesc=v._localizedDesc;c._language=currentLang238}}catch(_){} }
}
function refreshDisplayedNames238(){
  const map=new Map();
  const cards=typeof W.allCards==='function'?W.allCards():[];
  for(const c of cards){
    const shown=displayName238(c);
    map.set(norm238(c.name),shown);
    if(c._localizedName)map.set(norm238(c._localizedName),shown);
  }
  D.querySelectorAll('.card-name').forEach(el=>{
    const k=norm238(el.textContent);if(map.has(k))el.textContent=map.get(k);
  });
  D.querySelectorAll('.combo-card-name').forEach(el=>{
    const k=norm238(el.textContent);if(map.has(k))el.textContent=map.get(k);
  });
  D.querySelectorAll('.hand-card b').forEach(el=>{
    const k=norm238(el.textContent);if(map.has(k))el.textContent=map.get(k);
  });
  D.querySelectorAll('.arch-suggest-row b').forEach(el=>{
    const k=norm238(el.textContent);if(map.has(k))el.textContent=map.get(k);
  });
  D.querySelectorAll('.arch-full-card b').forEach(el=>{
    const k=norm238(el.textContent);if(map.has(k))el.textContent=map.get(k);
  });
}
async function applyLanguage238(lang){
  setLangStorage238(lang);
  try{await localizeAll238()}catch(_){}
  refreshDisplayedNames238();
  const status=D.getElementById('archBuilderStatus');
  if(status)status.textContent=(status.textContent||'')+(lang==='es'?' · Presentación: español':' · Presentación: '+LANG238[lang].label);
  try{W.renderDeck?.()}catch(_){}
  try{W.renderComboDeckCards?.()}catch(_){}
  try{W.renderCatalog?.()}catch(_){}
  setTimeout(refreshDisplayedNames238,60);
  setTimeout(refreshDisplayedNames238,500);
}
W.setDeckLanguage238=applyLanguage238;

function ensureLanguageUI238(){
  const dd=D.getElementById('archetypeDropdown')||D.querySelector('#arch')?.closest('details');
  if(!dd||D.getElementById('archLanguageRow238'))return;
  const body=dd.querySelector('.dropdown-body')||dd;
  const row=D.createElement('div');row.id='archLanguageRow238';row.className='arch-lang-row';
  row.innerHTML='<label for="archLanguage238">IDIOMA DE LAS CARTAS:</label><select id="archLanguage238" aria-label="Idioma de las cartas">'+
    Object.entries(LANG238).map(([k,v])=>`<option value="${k}" ${k===currentLang238?'selected':''}>${v.label}</option>`).join('')+
    '</select>';
  const anchor=D.getElementById('archAutoMode');
  if(anchor?.parentElement)anchor.parentElement.insertAdjacentElement('beforebegin',row);else body.insertBefore(row,body.firstChild);
  row.querySelector('select').addEventListener('change',e=>applyLanguage238(e.target.value));
}

function setArchetypeOptions238(){
  const sel=D.getElementById('arch');if(!sel)return false;
  const list=Array.isArray(W.__YGO_ARCHETYPES238)&&W.__YGO_ARCHETYPES238.length?W.__YGO_ARCHETYPES238:ARCHES240;
  if(!list.length)return false;
  const old=sel.value;
  const frag=D.createDocumentFragment();
  const first=D.createElement('option');first.value='';first.textContent='Selecciona un arquetipo (opcional)';frag.appendChild(first);
  for(const n of list){const o=D.createElement('option');o.value=String(n);o.textContent=String(n);frag.appendChild(o)}
  const other=D.createElement('option');other.value='Otro';other.textContent='Otro';frag.appendChild(other);
  sel.replaceChildren(frag);
  if(old&&[...sel.options].some(o=>o.value===old))sel.value=old;
  sel.title=`Catálogo completo · ${list.length} arquetipos`;
  return true;
}
async function loadArchetypes238(){
  // Render a usable catalog immediately; replace it with the authoritative API list when available.
  let list=["ABC", "@Ignister", "Adamancipator", "Advanced Crystal Beast", "Abyss Actor", "Amazement", "Amazoness", "Ancient Gear", "Ancient Warriors", "Appliancer", "Arcana Force", "Archfiend", "Artifact", "Ashened", "Assault Blackwing", "Assault Mode", "Atlantean", "Azamina", "B.E.S.", "Bamboo Sword", "Battlin' Boxer", "Beetrooper", "Black Luster Soldier", "Blackwing", "Blue-Eyes", "Branded", "Bujin", "Burning Abyss", "Bystial", "Centur-Ion", "Chaos", "Charmer", "Code Talker", "Constellar", "Crusadia", "Crystal Beast", "Crystron", "Cyber Angel", "Cyber Dragon", "Cyberdark", "Dark Magician", "Dark World", "Darklord", "Danger!", "Despia", "Destiny HERO", "Diabellstar", "Dogmatika", "Dracoslayer", "Dragon Ruler", "Dragonmaid", "Dragunity", "Dream Mirror", "Drytron", "Dual Avatar", "Eldlich", "Elemental HERO", "Endymion", "Evil Eye", "Evil HERO", "Evil★Twin", "Exodia", "Exosister", "F.A.", "Fabled", "Fairy Tail", "Fiendsmith", "Fire Fist", "Fire King", "Firewall", "Floowandereeze", "Flower Cardian", "Fluffal", "Fur Hire", "Frightfur", "Gadget", "Galaxy", "Galaxy-Eyes", "Gate Guardian", "Geargia", "Generaider", "Genex", "Ghostrick", "Ghoti", "Gimmick Puppet", "Gishki", "Gladiator Beast", "Goblin", "Gold Pride", "Gouki", "Gravekeeper's", "Gunkan", "Gusto", "Harpie", "Horus", "Ice Barrier", "Icejade", "Igknight", "Infernity", "Infernoble Knight", "Infernoid", "Infinitrack", "Invoked", "Inzektor", "Jinzo", "Junk", "Kashtira", "Karakuri", "K9", "Kaiju", "Kozmo", "Krawler", "Kuriboh", "Labrynth", "Laval", "Libromancer", "Lightsworn", "Live★Twin", "Lunalight", "Lyrilusc", "Machina", "Madolche", "Magical Musket", "Magistus", "Majespecter", "Malefic", "Maliss", "Mannadium", "Marincess", "Mathmech", "Mayakashi", "Mecha Phantom Beast", "Megalith", "Mekk-Knight", "Meklord", "Melffy", "Melodious", "Memento", "Mermail", "Metalfoes", "Mikanko", "Mimighoul", "Monarch", "Morphtronic", "Myutant", "Naturia", "Nekroz", "Nemleria", "Ninja", "Noble Knight", "Numeron", "Odd-Eyes", "Ogdoadic", "Ojama", "Onomat", "Orcust", "P.U.N.K.", "Paleozoic", "Performapal", "Performage", "Phantom Knights", "Photon", "Plunder Patroll", "Prank-Kids", "Predaplant", "Purrely", "Qli", "Raidraptor", "Red-Eyes", "Regenesis", "Relinquished", "Rescue-ACE", "Rikka", "Ritual Beast", "Rokket", "Rose Dragon", "Runick", "S-Force", "Salamangreat", "Scareclaw", "Scrap", "Shaddoll", "Shark", "Shining Sarcophagus", "Shiranui", "Six Samurai", "Sky Striker", "Snake-Eye", "Solfachord", "Speedroid", "Spellbook", "Spright", "SPYRAL", "Stardust", "Subterror", "Sunavalon", "Superheavy Samurai", "Supreme King", "Swordsoul", "Sylvan", "Synchron", "T.G.", "Tearlaments", "Tenpai Dragon", "Tenyi", "The Agent", "The Weather", "Therion", "Thunder Dragon", "Time Thief", "Toon", "Traptrix", "Tri-Brigade", "Trickstar", "True Draco", "U.A.", "Unchained", "Ursarctic", "Utopia", "Vaalmonica", "Vanquish Soul", "Vaylantz", "Vendread", "Vernusylph", "Virtual World", "Voiceless Voice", "Volcanic", "War Rock", "Watt", "White Forest", "Wind-Up", "Windwitch", "Witchcrafter", "World Chalice", "World Legacy", "X-Saber", "Yang Zing", "Yosenju", "Yubel", "Yummy", "Zefra", "Zoodiac"];
  try{
    const raw=localStorage.getItem('ygo_archetypes_v7');
    if(raw){const j=JSON.parse(raw);if(Array.isArray(j?.d)&&j.d.length)list=j.d.map(x=>x.archetype_name||x).filter(Boolean)}
  }catch(_ ){}
  ARCHES240=[...new Map(list.map(n=>[norm238(n),String(n).trim()])).values()].sort((a,b)=>a.localeCompare(b,'en'));
  W.__YGO_ARCHETYPES238=ARCHES240; W.__setArchetypeOptions238=setArchetypeOptions238; setArchetypeOptions238();
  // Alpha595: el catálogo embebido/cache se usa en arranque; red sólo bajo demanda.
   if(W.__YGO_ARCHETYPE_REMOTE_ON_DEMAND!==true)return;
   try{
    const ac=new AbortController(),t=setTimeout(()=>ac.abort(),7000);
    const r=await fetch(API238+'archetypes.php',{cache:'no-store',signal:ac.signal});clearTimeout(t);
    if(!r.ok)throw Error('HTTP '+r.status);
    const j=await r.json(),remote=j.map(x=>x.archetype_name).filter(Boolean);
    if(remote.length){
      try{localStorage.setItem('ygo_archetypes_v7',JSON.stringify({t:Date.now(),d:j}))}catch(_ ){}
      ARCHES240=[...new Map(remote.map(n=>[norm238(n),String(n).trim()])).values()].sort((a,b)=>a.localeCompare(b,'en'));
      W.__YGO_ARCHETYPES238=ARCHES240; setArchetypeOptions238();
    }
  }catch(_ ){}
}
function cacheArchetypeCards238(cards,name){
  for(const c of cards||[])if(c?.name)ARCH_CARD_CACHE238.set(norm238(c.name),c);
  if(name)W.__YGO_ARCH_CARDS238=cards||[];
}
function getCard238(name){
  const k=norm238(name);
  const all=typeof W.allCards==='function'?W.allCards():[];
  return all.find(c=>norm238(c.name)===k)||ARCH_CARD_CACHE238.get(k)||null;
}
W.__YGO_GET_ARCH_CARD238=getCard238;

function cloneDeck238(){
  return {
    main:(W.deckState?.main||[]).map(c=>({...c})),
    extra:(W.deckState?.extra||[]).map(c=>({...c})),
    side:(W.deckState?.side||[]).map(c=>({...c}))
  };
}
function qty238(c){return Math.max(1,Number(c?.qty)||1)}
function total238(a){return (a||[]).reduce((n,c)=>n+qty238(c),0)}
function scoreFingerprint238(d){
  const z=k=>((d?.[k]||[]).map(c=>`${String(c.id||c.cardId||c.name)}:${qty238(c)}`).sort().join(','));
  return `M:${z('main')}|E:${z('extra')}|S:${z('side')}`;
}
const SCORE_CACHE238=new Map();
function scoreTotal238(d){
  try{
    const key=scoreFingerprint238(d),hit=SCORE_CACHE238.get(key);
    if(hit!=null)return hit;
    const v=Math.round((Number(W.scoreDeck?.(d)?.total)||0)*10)/10;
    if(SCORE_CACHE238.size>3500){const first=SCORE_CACHE238.keys().next().value;SCORE_CACHE238.delete(first)}
    SCORE_CACHE238.set(key,v);return v;
  }catch(_){return 0}
}
function addOne238(d,c,zone,amount=1){
  const arr=d[zone],k=norm238(c.name),found=arr.find(x=>norm238(x.name)===k);
  if(found){if(qty238(found)+amount>3)return false;found.qty=qty238(found)+amount}
  else {if(amount>3)return false;arr.push({...c,qty:amount})}
  return true;
}
function removeOne238(d,name,zone,amount=1){
  const arr=d[zone],i=arr.findIndex(x=>norm238(x.name)===norm238(name));if(i<0)return false;
  const q=qty238(arr[i]);if(q<=amount)arr.splice(i,1);else arr[i].qty=q-amount;return true;
}
function isExtraType238(c){return /Fusion|Synchro|XYZ|Xyz|Link Monster/i.test(String(c?.type||''))}
function cloneDeckForScore238(d){return {main:(d.main||[]).map(x=>({...x})),extra:(d.extra||[]).map(x=>({...x})),side:(d.side||[]).map(x=>({...x}))}}
function sameCard238(a,b){return norm238(a?.name)===norm238(b?.name)}
function roleWeight238(c){
  const t=String(c?.desc||'').toLowerCase(),roles=(c?.advancedRoles||[]).join(' ').toLowerCase();let w=0;
  if(/search|add .*from your deck|add 1 .*deck/.test(t))w+=5;
  if(/special summon/.test(t))w+=4;
  if(/draw|excavate/.test(t))w+=3;
  if(/negate|destroy|banish|return .*hand|send .*graveyard/.test(t))w+=3;
  if(/starter/.test(roles))w+=4;if(/extender/.test(roles))w+=3;if(/interacci/.test(roles))w+=3;
  return w;
}
function legalAddCapacity238(d,zone){return zone==='main'?total238(d.main)<60:d.extra.length<15}
function evaluateCandidate238(base,c,zone,amount){
  if(!legalAddCapacity238(base,zone)&&!(base[zone]||[]).some(x=>sameCard238(x,c)))return null;
  const d=cloneDeckForScore238(base);if(!addOne238(d,c,zone,amount))return null;
  return {deck:d,score:scoreTotal238(d),delta:scoreTotal238(d)-scoreTotal238(base)};
}
function candidateAnalysis238(cards){
  const base=cloneDeck238(),baseScore=scoreTotal238(base),rows=[];
  const mainFull=total238(base.main)>=60,extraFull=base.extra.length>=15;
  const currentByName=new Map([...base.main,...base.extra].map(c=>[norm238(c.name),c]));
  for(const c of cards){
    const zone=isExtraType238(c)?'extra':'main';
    if((zone==='main'&&mainFull&&!(currentByName.get(norm238(c.name))))||(zone==='extra'&&extraFull&&!(currentByName.get(norm238(c.name)))))continue;
    const cur= currentByName.get(norm238(c.name));
    const maxAdd=3-(cur?qty238(cur):0);
    if(maxAdd<=0)continue;
    const q1=evaluateCandidate238(base,c,zone,1);if(!q1)continue;
    let best=q1;
    const q2=maxAdd>=2?evaluateCandidate238(base,c,zone,2):null;
    const q3=maxAdd>=3?evaluateCandidate238(base,c,zone,3):null;
    if(q2&&q2.score>best.score)best=q2;if(q3&&q3.score>best.score)best=q3;
    rows.push({...c,_zone:zone,_delta:Math.round(best.delta*10)/10,_score:best.score,_bestQty:best===q3?3:best===q2?2:1,_q1:q1.delta,_q2:q2?.delta??null,_q3:q3?.delta??null,_roleWeight:roleWeight238(c)});
  }
  // When the Main/Extra is full, compare real one-for-one swaps instead of pretending a 61st card can be added.
  const swaps=[];
  for(const c of rows.slice().sort((a,b)=>b._delta-a._delta||b._roleWeight-a._roleWeight).slice(0,24)){
    const arr=base[c._zone];if(!arr)continue;
    for(const old of arr){
      if(sameCard238(old,c))continue;
      const d=cloneDeckForScore238(base);if(!removeOne238(d,old.name,c._zone,1))continue;
      if(!addOne238(d,c,c._zone,1))continue;
      const sc=scoreTotal238(d),delta=sc-baseScore;
      if(delta>0)swaps.push({...c,_swapOut:old.name,_swapDelta:Math.round(delta*10)/10,_swapScore:sc});
    }
  }
  swaps.sort((a,b)=>b._swapDelta-a._swapDelta||b._roleWeight-a._roleWeight);
  return {baseScore,rows,swaps};
}
function renderBuilder238(name,cards,mode){
  const host=D.getElementById('archBuilderSuggestions');if(!host)return;
  host.hidden=false;host.innerHTML='<div class="arch-suggest-box"><b>ANALIZANDO '+esc235(name)+'…</b><div class="arch-builder-note">Probando cantidades y sustituciones reales. La baraja no se modifica durante el análisis.</div></div>';
  setTimeout(()=>{
    const a=candidateAnalysis238(cards);
    const adds=a.rows.filter(x=>x._delta>0).sort((x,y)=>y._delta-x._delta||y._roleWeight-x._roleWeight).slice(0,15);
    const swaps=a.swaps.slice(0,12);
    const current=cloneDeck238(),archNames=new Set(cards.map(x=>norm238(x.name))),removes=[];
    for(const zone of ['main','extra'])for(const c of current[zone]){
      if(!archNames.has(norm238(c.name)))continue;
      const d=cloneDeckForScore238(current);if(!removeOne238(d,c.name,zone,1))continue;
      const sc=scoreTotal238(d),delta=sc-a.baseScore;
      removes.push({...c,_zone:zone,_delta:Math.round(delta*10)/10,_score:sc});
    }
    removes.sort((x,y)=>x._delta-y._delta);
    const cardImg=c=>c.card_images?.[0]?.image_url_small||c.card_images?.[0]?.image_url||'';
    const addHtml=adds.map(c=>`<div class="arch-suggest-row" data-score="up"><img loading="lazy" src="${esc235(cardImg(c))}" alt="${esc235(c.name)}"><div><b>${esc235(displayName238(c))}</b><small>${c._zone.toUpperCase()} · +${c._delta.toFixed(1)} · mejor ${c._bestQty} copia(s) · ${(c.advancedRoles||[]).join(' · ')||'Soporte'}</small></div><div class="arch-suggest-actions"><button class="adv-btn" type="button" onclick='window.archAddCard238(${JSON.stringify(c.name).replace(/'/g,'&#39;')},${JSON.stringify(c._zone).replace(/'/g,'&#39;')})'>AGREGAR</button></div></div>`).join('');
    const swapHtml=swaps.map(c=>`<div class="arch-suggest-row" data-score="up"><img loading="lazy" src="${esc235(cardImg(c))}" alt="${esc235(c.name)}"><div><b>${esc235(displayName238(c))}</b><small>${c._zone.toUpperCase()} · +${c._swapDelta.toFixed(1)} · reemplaza: ${esc235(c._swapOut)}</small></div><div class="arch-suggest-actions"><button class="adv-btn" type="button" onclick='window.archApplySwap238(${JSON.stringify(c.name).replace(/'/g,'&#39;')},${JSON.stringify(c._swapOut).replace(/'/g,'&#39;')},${JSON.stringify(c._zone).replace(/'/g,'&#39;')})'>CAMBIAR</button></div></div>`).join('');
    const remHtml=removes.slice(0,10).map(c=>`<div class="arch-suggest-row" data-score="down"><img loading="lazy" src="${esc235(cardImg(c))}" alt="${esc235(c.name)}"><div><b>${esc235(displayName238(c))}</b><small>${c._zone.toUpperCase()} · ${c._delta.toFixed(1)} si se elimina</small></div><div class="arch-suggest-actions"><button class="adv-btn" type="button" onclick='window.archRemoveCard238(${JSON.stringify(c.name).replace(/'/g,'&#39;')},${JSON.stringify(c._zone).replace(/'/g,'&#39;')})'>QUITAR</button></div></div>`).join('');
    host.innerHTML=`<div class="arch-suggest-box"><b>ANÁLISIS DE ${esc235(name)}</b><div class="arch-score-line"><span>Actual: <b>${a.baseScore.toFixed(1)}/100</b></span><span>${cards.length} cartas · ${adds.length} mejoras · ${swaps.length} cambios</span></div><div class="arch-builder-note">Se prueban 1–3 copias y, cuando la zona está llena, sustituciones 1 por 1. Las recomendaciones no alteran tu baraja hasta que las apliques.</div><div class="arch-suggest-grid"><div><span>AGREGAR</span><div class="arch-suggest-list">${addHtml||'<div>Sin aumento medido.</div>'}</div></div><div><span>CAMBIOS DE 1 POR 1</span><div class="arch-suggest-list">${swapHtml||'<div>No hay sustituciones con mejora medida.</div>'}</div></div></div><div class="arch-suggest-grid"><div><span>QUITAR / REVISAR</span><div class="arch-suggest-list">${remHtml||'<div>No hay cartas del arquetipo para revisar.</div>'}</div></div></div><div class="arch-builder-tools"><button class="adv-btn gold" type="button" onclick='window.archApplyBest238()'>APLICAR MEJORES MEJORAS</button></div></div>`;
    W.__YGO_LAST_BUILDER240={name,cards,adds,swaps,removes,base:a.baseScore};
  },20);
}
W.archAddCard238=async function(name,zone='main'){
  const c=getCard238(name);if(!c){W.toast?.('La carta todavía no está disponible en el catálogo interno.');return false}
  const arr=W.deckState?.[zone];if(!arr)return false;
  const found=arr.find(x=>norm238(x.name)===norm238(name));
  if(found){if(qty238(found)>=3){W.toast?.('Máximo 3 copias.');return false}found.qty=qty238(found)+1}
  else if((zone==='main'&&total238(arr)>=60)||(zone==='extra'&&arr.length>=15)){W.toast?.('La zona ya está llena; usa CAMBIAR para una sustitución.');return false}
  else arr.push({...c,qty:1});
  SCORE_CACHE238.clear();try{W.invalidateDeckAnalysis?.();W.renderDeck?.();W.recalcAll?.();W.renderYGODeckValidation?.()}catch(_){}refreshDisplayedNames238();W.toast?.(`${displayName238(c)} añadida.`);return true;
};
W.archRemoveCard238=function(name,zone='main'){
  const arr=W.deckState?.[zone];if(!arr)return false;const i=arr.findIndex(x=>norm238(x.name)===norm238(name));if(i<0)return false;
  if(qty238(arr[i])>1)arr[i].qty=qty238(arr[i])-1;else arr.splice(i,1);SCORE_CACHE238.clear();try{W.invalidateDeckAnalysis?.();W.renderDeck?.();W.recalcAll?.();W.renderYGODeckValidation?.()}catch(_){}refreshDisplayedNames238();W.toast?.(`${name} retirada.`);return true;
};
W.archApplySwap238=function(addName,removeName,zone='main'){
  const d=cloneDeck238();const addCard=getCard238(addName);if(!addCard||!removeOne238(d,removeName,zone,1)||!addOne238(d,addCard,zone,1)){W.toast?.('No se pudo aplicar el cambio.');return false}
  if(!W.deckState)return false;removeOne238(W.deckState,removeName,zone,1);addOne238(W.deckState,addCard,zone,1);SCORE_CACHE238.clear();try{W.invalidateDeckAnalysis?.();W.renderDeck?.();W.recalcAll?.();W.renderYGODeckValidation?.()}catch(_){}refreshDisplayedNames238();W.toast?.(`${addName} reemplazó a ${removeName}.`);return true;
};
W.archApplyBest238=function(){
  const x=W.__YGO_LAST_BUILDER240;if(!x)return 0;let applied=0;
  // Prefer swaps when Main/Extra is full; otherwise add only positive candidates, respecting 3-copy limits.
  for(const sw of (x.swaps||[]).slice(0,6)){if(sw._swapDelta<=0)continue;if(W.archApplySwap238(sw.name,sw._swapOut,sw._zone))applied++}
  for(const c of (x.adds||[]).filter(c=>c._delta>0).slice(0,8)){const arr=W.deckState?.[c._zone];if(!arr)continue;const cur=arr.find(v=>norm238(v.name)===norm238(c.name));const target=Math.min(3,c._bestQty||1);while((cur?qty238(cur):0)<target){if(!W.archAddCard238(c.name,c._zone))break;applied++}}
  W.toast?.(`${applied} mejora(s) aplicadas.`);return applied;
};
W.autoBuildArchetype=async function(){
  const name=D.getElementById('arch')?.value||'',status=D.getElementById('archBuilderStatus');if(!name||name==='Otro'){W.toast?.('Selecciona un arquetipo de la lista.');return false}
  if(status)status.textContent=`${name}: cargando cartas del arquetipo…`;
  let cards=[];try{const key='arch240_'+encodeURIComponent(name),raw=localStorage.getItem(key);if(raw){const j=JSON.parse(raw);if(Date.now()-j.t<172800000&&Array.isArray(j.d))cards=j.d}}catch(_){ }
  if(!cards.length)try{const ac=new AbortController(),t=setTimeout(()=>ac.abort(),8000),r=await fetch(API238+'cardinfo.php?archetype='+encodeURIComponent(name),{cache:'no-store',signal:ac.signal});clearTimeout(t);if(r.ok){const j=await r.json();cards=Array.isArray(j?.data)?j.data:[];try{localStorage.setItem('arch240_'+encodeURIComponent(name),JSON.stringify({t:Date.now(),d:cards}))}catch(_){}}}catch(_){ }
  if(!cards.length)cards=(Array.isArray(W.__YGO_ARCH_CARDS238)?W.__YGO_ARCH_CARDS238:[]).filter(c=>norm238(c.archetype||'')===norm238(name)||(c.archetypes||[]).some(a=>norm238(a)===norm238(name)));
  cards=cards.map(c=>({...c,qty:1}));cacheArchetypeCards238(cards,name);if(!cards.length){if(status)status.textContent=`No se encontraron cartas para ${name}.`;return false}
  const mode=D.getElementById('archAutoMode')?.value||'suggest';
  if(mode==='suggest'){renderBuilder238(name,cards,mode);if(status)status.textContent=`${name}: optimización calculada.`;return true}
  if(mode==='support'){const a=candidateAnalysis238(cards);let added=0;for(const c of a.rows.filter(x=>x._delta>0).sort((a,b)=>b._delta-a._delta).slice(0,8)){if(W.archAddCard238(c.name,c._zone))added++}if(status)status.textContent=`${name}: ${added} cartas de soporte con mejora medida.`;return true}
  // Replace mode: construct a legal 40-card starting shell, then fill remaining slots only with measured positives.
  const base={main:[],extra:[],side:[]};
  const ranked=candidateAnalysis238(cards).rows.sort((a,b)=>b._delta-a._delta||b._roleWeight-a._roleWeight);
  // First take measured improvements; if the archetype does not fill 40 cards, use the next-best measured cards instead of returning an invalid '40-card' claim.
  for(const c of ranked){const zone=c._zone;if(zone==='main'&&total238(base.main)<40){const room=40-total238(base.main);addOne238(base,c,zone,Math.min(3,c._bestQty||1,room))}else if(zone==='extra'&&base.extra.length<15)addOne238(base,c,zone,1);if(total238(base.main)>=40&&base.extra.length>=15)break}
  W.deckState.main=base.main;W.deckState.extra=base.extra;W.deckState.side=[];SCORE_CACHE238.clear();try{W.invalidateDeckAnalysis?.();W.renderDeck?.();W.recalcAll?.();W.renderYGODeckValidation?.()}catch(_){}refreshDisplayedNames238();if(status)status.textContent=`${name}: construcción inicial ${total238(base.main)>=40&&base.extra.length<=15?'legal':'incompleta'} generada (${total238(base.main)} MAIN / ${base.extra.length} EXTRA).`;return true;
};
W.handleArchetypeSelection=async function(){
  const n=D.getElementById('arch')?.value||'',status=D.getElementById('archBuilderStatus'),h=D.getElementById('archBuilderSuggestions');if(h)h.hidden=true;if(!n||n==='Otro'){if(status)status.textContent='Selecciona un arquetipo.';return}
  if(status)status.textContent=`${n}: cargando cartas del arquetipo…`;
  let cards=[];try{const key='arch240_'+encodeURIComponent(n),raw=localStorage.getItem(key);if(raw){const j=JSON.parse(raw);if(Date.now()-j.t<172800000&&Array.isArray(j.d))cards=j.d}}catch(_){ }
  if(!cards.length)try{const ac=new AbortController(),t=setTimeout(()=>ac.abort(),8000),r=await fetch(API238+'cardinfo.php?archetype='+encodeURIComponent(n),{cache:'no-store',signal:ac.signal});clearTimeout(t);if(r.ok){const j=await r.json();cards=Array.isArray(j?.data)?j.data:[];try{localStorage.setItem('arch240_'+encodeURIComponent(n),JSON.stringify({t:Date.now(),d:cards}))}catch(_){}}}catch(_){ }
  cacheArchetypeCards238(cards,n);const host=D.getElementById('archFullBrowser');
  if(host){const main=cards.filter(c=>!isExtraType238(c)),extra=cards.filter(c=>isExtraType238(c));host.innerHTML=`<details class="arch-full-browser" open><summary>▾ CARTAS DEL ARQUETIPO · ${esc235(n)}</summary><div class="arch-full-head"><span>${cards.length} cartas</span><span>MAIN ${main.length} · EXTRA ${extra.length}</span></div><div class="arch-full-grid">${cards.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name),'en')).map(c=>{const im=c.card_images?.[0]?.image_url_small||c.card_images?.[0]?.image_url||'';return `<div class="arch-full-card" title="${esc235(c.name)}" onclick='selectCardDetail(${JSON.stringify(c.name).replace(/'/g,'&#39;')})'>${im?`<img loading="lazy" src="${esc235(im)}" alt="${esc235(c.name)}">`:''}<b>${esc235(displayName238(c))}</b><small>${isExtraType238(c)?'EXTRA':'MAIN'}</small></div>`}).join('')||'<div class="arch-empty">No hay cartas disponibles.</div>'}</div></details>`}
  if(status)status.textContent=`${n}: ${cards.length} cartas cargadas.`;if(currentLang238!=='es')localizeAll238().then(refreshDisplayedNames238);
};

async function init238(){
  ensureLanguageUI238();
  // One authoritative loader owns the selector; no polling or competing renderers are needed.
  loadArchetypes238().catch(()=>{});
  if(currentLang238!=='es')await applyLanguage238(currentLang238);
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',init238,{once:true});else init238();
})();
