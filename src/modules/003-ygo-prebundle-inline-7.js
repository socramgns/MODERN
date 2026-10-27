
(() => {
const W=window,D=document;
const N=['CONSISTENCIA','POTENCIA OFENSIVA','RESILIENCIA','CONTROL DEL CAMPO','COMIENZO DEL DUELO','MITAD DEL DUELO','FINAL DEL DUELO','INTERACCIÓN','PODER DE ATRACCIÓN','VERSATILIDAD'];
const DESC=['Capacidad de realizar la estrategia principal de forma estable.','Capacidad de generar presión, daño y condiciones de victoria.','Capacidad de recuperarse ante interrupciones y pérdida de recursos.','Capacidad de mantener y manipular el campo a tu favor.','Fuerza en los primeros turnos y capacidad de establecer la jugada inicial.','Capacidad de mantener ventaja, recursos y control durante la partida.','Capacidad de cerrar partidas o mantenerse fuerte en duelos largos.','Capacidad de responder al rival mediante interrupciones, negaciones y respuestas.','Capacidad de generar acceso adicional a cartas mediante robo, búsqueda y efectos que aumentan las opciones disponibles.','Capacidad de adaptarse a diferentes situaciones y líneas de juego.'];
const clamp=x=>Math.max(0,Math.min(1,Number.isFinite(+x)?+x:0));
const arr=x=>Array.isArray(x)?x:[];
const rawQty=c=>Math.max(0,Math.floor(Number(c?.qty)||1));
const total=z=>arr(z).reduce((n,c)=>n+rawQty(c),0);
const norm=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const txt=c=>`${c?.name||''} ${c?.type||''} ${c?.desc||c?.description||c?.text||''}`;
function data(c){
 if(!c)return {};
 const id=String(c.id??'');
 try{
  const db=typeof W.mergedCardDB==='function'?W.mergedCardDB():(Array.isArray(W.CARD_CATALOG)?W.CARD_CATALOG:[]);
  const h=id&&(db||[]).find(x=>String(Array.isArray(x)?x[0]:x?.id)===id);
  if(h){const x=Array.isArray(h)?{id:h[0],name:h[1],type:h[3],desc:h[4],atk:h[5],def:h[6],level:h[7],race:h[8],attribute:h[9],archetype:h[10],image:h[11]}:h;return {...x,...c,desc:c.desc||c.description||x.desc||x.description||''};}
 }catch(_){ }
 return c;
}
function expand(z){return arr(z).flatMap(c=>Array.from({length:rawQty(c)},()=>({...data(c),qty:1})));}
function parse(c){try{return W.YGORulingEngine?.parseCard?.(data(c))||null}catch(_){return null}}
// Contextual capability classification, shared by probabilities and scoring.
// It describes printed capabilities; a candidate starter is never a proven legal combo.
const CAPABILITY_KEYS=['effect','search','draw','ss','normal','negate','remove','destroy','banish','return','send','target','quick','trigger','protect','recover','burn','battle','material','field','hand','gy','deck','extra','continuous','cost','once','hardOnce','unknown','starter','extender','interaction'];
function contextualEffects1263(card){
 const source=String(card?.desc||card?.description||card?.text||'').replace(/[“”]/g,'"').replace(/[’]/g,"'");
 if(!source.trim())return [];
 // Bullets following "includes any of these effects" describe the activation condition,
 // not actions performed by this card (Ash Blossom is the regression case).
 const conditionList=/includes? (?:any|one|1) of (?:these|the following) effects?/i.test(source);
 const clean=conditionList?source.replace(/[●•]\s*[^\n]*(?:\n|$)/g,'\n'):source;
 const sentences=clean.split(/\r?\n|(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/u).map(s=>s.trim()).filter(Boolean);
 return sentences.map(raw=>{
  const colon=raw.indexOf(':'),semi=raw.indexOf(';');
  const condition=colon>=0?raw.slice(0,colon).trim():'';
  const activation=semi>=0?raw.slice(colon>=0?colon+1:0,semi).trim():'';
  const resolution=raw.slice(semi>=0?semi+1:colon>=0?colon+1:0).replace(/^[●•]\s*/,'').trim();
  const restriction=/^(?:you can only (?:use|activate)|you cannot|you can not|each effect|this effect can only|once per turn|solo puedes|no puedes)/i.test(resolution);
  const opponentResolution=/^(?:your opponent|each player|both players|el adversario|tu adversario)\b/i.test(resolution);
  return{raw,condition,activation,resolution,restriction,opponentResolution,
   conditional:!!condition||!!activation||/\b(?:if|unless|except|while|during your opponent|either|choose|activate 1 of)\b/i.test(raw),
   origin:conditionList?'CONDITION_LIST_EXCLUDED':'PRINTED_RESOLUTION'};
 });
}
function semantic(c){
 const x=data(c),type=String(x.type||x.frameType||''),bits=Number(x.typeBits)||0;
 const o=Object.fromEntries(CAPABILITY_KEYS.map(k=>[k,0]));
 const normalMonster=((bits&17)===17||/normal monster/i.test(type))&&!/pendulum/i.test(type);
 const effects=normalMonster?[]:contextualEffects1263(x),whole=String(x.desc||x.description||x.text||'');
 const evidence=[],requirements=new Set();let accessibleAccess=false,selfSummon=false;
 const isMonster=!!(bits&1)||/monster/i.test(type),isSpell=!!(bits&2)||/spell|magica/i.test(type),isTrap=!!(bits&4)||/trap|trampa/i.test(type);
 const level=Number(x.level),normalAccessible=isMonster&&Number.isFinite(level)&&level>=1&&level<=4&&!/fusion|synchro|xyz|link|ritual/i.test(type);
 const test=(re,t)=>re.test(t), positive=t=>t.replace(/\b(?:cannot|can not|neither player can|no player can)\b[^.;]*/gi,'');
 for(const e of effects){
  const t=positive(e.resolution.toLowerCase()),all=e.raw.toLowerCase();
  if(e.restriction)continue;
  o.effect++;
  if(e.conditional){requirements.add(e.condition||e.activation||'CHOICE_OR_STATE_REQUIRED');}
  if(e.activation)o.cost+=/discard|tribute|detach|pay|banish|send|reveal/i.test(e.activation)?1:0;
  o.quick=Math.max(o.quick,+/quick effect|quick-play/i.test(e.raw+' '+type));
  o.trigger=Math.max(o.trigger,+/^(?:if|when)\b/i.test(e.condition));
  o.target=Math.max(o.target,+/\btarget\b/i.test(e.activation));
  o.once=Math.max(o.once,+/once per turn/i.test(whole));
  o.hardOnce=Math.max(o.hardOnce,+/you can only (?:use|activate).*once per turn/i.test(whole));
  o.hand=Math.max(o.hand,+/\bhand\b/.test(all));o.gy=Math.max(o.gy,+/\bgy\b|graveyard/.test(all));
  o.deck=Math.max(o.deck,+/\bdeck\b/.test(all));o.extra=Math.max(o.extra,+/extra deck/.test(all));
  if(e.opponentResolution)continue;
  const hasSearch=test(/\badd\b[^.;]*\b(?:from (?:your |the )?deck|from deck)\b[^.;]*(?:to (?:your |the )?hand)?|\bsearch\b/,t);
  const hasDraw=test(/\b(?:you (?:can |may )?)?draw\s+(?:\d+|one|two|three|a)\b/,t);
  const hasSS=test(/\b(?:you (?:can |may )?)?special summon\b/,t);
  const hasNegate=test(/\bnegate\b/,t),hasDestroy=test(/\bdestroy\b/,t),hasBanish=test(/\bbanish\b/,t),hasReturn=test(/\breturn\b[^.;]*\b(?:hand|deck)\b/,t);
  for(const [key,val] of Object.entries({search:hasSearch,draw:hasDraw,ss:hasSS,negate:hasNegate,destroy:hasDestroy,banish:hasBanish,return:hasReturn,
   send:/\bsend\b[^.;]*\b(?:gy|graveyard)\b/.test(t),protect:/cannot be (?:destroyed|targeted)|unaffected by/.test(e.resolution.toLowerCase()),
   recover:/(?:special summon|return|add)\b[^.;]*\b(?:from (?:your |the )?(?:gy|graveyard)|in your gy)\b/.test(t),burn:/\binflict\b[^.;]*\bdamage\b/.test(t)}))if(val){o[key]=1;evidence.push({role:key,resolution:e.resolution,condition:e.condition,activation:e.activation,status:'PRINTED_CAPABILITY_PROVISIONAL'});}
  const fromHand=/special summon this card(?: from your hand)?|special summon [^.;]*from your hand/i.test(e.resolution);
  selfSummon=selfSummon||(hasSS&&fromHand);
  const opponentTrigger=/your opponent|opponent'?s|damage step|battle phase|sent to (?:the )?(?:gy|graveyard)|destroyed|banished/i.test(e.condition);
  const externalCost=!!e.activation&&/discard|tribute|detach|banish|send|reveal/i.test(e.activation);
  const summonTrigger=/this card is (?:normal(?: or special)?|normal or flip) summoned/i.test(e.condition);
  const simpleSpellAccess=isSpell&&!isTrap&&!e.condition&&!externalCost;
  const normalAccess=normalAccessible&&summonTrigger&&!opponentTrigger&&!externalCost;
  if((hasSearch||hasDraw)&&(simpleSpellAccess||normalAccess))accessibleAccess=true;
 }
 o.normal=+normalAccessible;
 o.remove=+!!(o.destroy||o.banish||o.return);
 o.interaction=+!!(o.negate||o.remove);
 o.starter=+accessibleAccess;
 o.extender=+selfSummon;
 o.material=+!!(isMonster&&/fusion|synchro|xyz|link|ritual|tuner/i.test(type+' '+whole));
 o.field=+!!(/field spell|continuous/i.test(type));o.continuous=+!!/continuous/i.test(type);
 o.battle=+!!(isMonster&&Number.isFinite(Number(x.atk))&&x.statsKnown!==false);
 o.unknown=+(!normalMonster&&(!whole.trim()||!effects.length));
 o.classificationVersion='contextual-resolution-v1';o.classificationStatus=o.unknown?'UNKNOWN':'PROVISIONAL_CAPABILITIES';
 o.starterStatus=o.starter?'CANDIDATE_ACCESS_NOT_COMBO_PROVEN':'NO_ACCESS_CANDIDATE_DETECTED';
 o.requirements=[...requirements];o.evidence=evidence;
 o.limitations='Printed capabilities and candidate access only. Targets, costs, locks, hand composition and legal resolution require a state replay.';
 return o;
}

const semCache=new Map();
function sem(c){const x=data(c),k=String(x.id??x.name??'');const key=k+'|'+norm(txt(x))+'|'+JSON.stringify([x.typeBits,x.level,x.frameType,x.statsKnown,x.metadataVersion]);if(semCache.has(key))return semCache.get(key);const v=semantic(x);semCache.set(key,v);return v;}
function aggregate(cards){const a={cards:cards.length,unique:0,starter:0,search:0,draw:0,ss:0,extender:0,interaction:0,negate:0,remove:0,destroy:0,banish:0,return:0,send:0,target:0,quick:0,trigger:0,protect:0,recover:0,burn:0,battle:0,material:0,field:0,cost:0,hardOnce:0,unknown:0,atk:0};const seen=new Set();for(const c of cards){const p=sem(c);for(const k of Object.keys(a))if(k in p&&k!=='cards'&&k!=='unique')a[k]+=Number(p[k])||0;a.atk+=Number(c.atk)||0;const id=String(c.id??c.name);if(!seen.has(id)){seen.add(id);a.unique++;}}a.diversity=['search','draw','ss','interaction','recover','protect','material','battle','field'].filter(k=>a[k]>0).length/9;return a;}
function logChoose(n,k){if(k<0||k>n)return -Infinity;k=Math.min(k,n-k);let s=0;for(let i=1;i<=k;i++)s+=Math.log(n-k+i)-Math.log(i);return s;}
function hyperExact(K,N,H=5,r=1){if(N<=0||K<=0||H<=0||H>N)return 0;if(K>=N&&r<=H)return 1;if(r<1||r>H)return 0;let p=0;for(let x=r;x<=Math.min(K,H);x++){const a=logChoose(K,x)+logChoose(N-K,H-x)-logChoose(N,H);p+=Math.exp(a);}return clamp(p);}
function pAtLeast(K,N,H=5){return hyperExact(K,N,H,1)}
function pct(x){return Math.round(clamp(x/100)*1000)/10;}
function seed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function rng(s){let a=s>>>0;return()=>{a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296};}
function shuffle(a,r){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
function ci95(hits,n){if(!n)return{low:null,high:null,se:null,method:'WILSON_95'};const p=hits/n,z=1.96,z2=z*z,den=1+z2/n,center=(p+z2/(2*n))/den,half=z*Math.sqrt(p*(1-p)/n+z2/(4*n*n))/den;return{low:Math.max(0,center-half),high:Math.min(1,center+half),se:Math.sqrt(p*(1-p)/n),method:'WILSON_95'};}
function openingMonteCarlo(main,trials=5000){
 const deck=[];for(const c of main)for(let i=0;i<rawQty(c);i++)deck.push(c);if(deck.length<5)return{trials:0};
 const sig=main.map(c=>`${c.id||c.name}:${rawQty(c)}`).sort().join('|'),r=rng(seed(sig+'|alpha256'));let starter=0,playable=0,interaction=0,draw=0,search=0,recover=0,deadCards=0,hand2=0,hand3=0;
 for(let t=0;t<trials;t++){const h=shuffle(deck,r).slice(0,5),ps=h.map(sem);const st=ps.some(x=>x.starter),ex=ps.some(x=>x.extender),it=ps.some(x=>x.interaction),dr=ps.some(x=>x.draw||x.search),se=ps.some(x=>x.search),rec=ps.some(x=>x.recover),live=ps.filter(x=>x.starter||x.extender||x.interaction||x.draw||x.search||x.recover).length;starter+=st;playable+=st||ex||se;interaction+=it;draw+=dr;search+=se;recover+=rec;deadCards+=5-live;hand2+=ps.filter(x=>x.interaction).length>=2;hand3+=ps.filter(x=>x.interaction).length>=3;}
 const n=trials;const metric=(hits)=>({pct:pct(hits/n*100),ci:ci95(hits,n)});
 return{trials,classification:'PROVISIONAL_CAPABILITIES',event:'ROLE_ACCESS_PROXY_NOT_LEGAL_COMBO_SUCCESS',playabilityProven:false,seed:seed(sig+'|alpha256'),handSize:5,accessCandidate:metric(playable),starter:metric(starter),playable:metric(playable),interaction:metric(interaction),draw:metric(draw),search:metric(search),recover:metric(recover),deadCardRate:pct(deadCards/(n*5)*100),twoInteractions:metric(hand2),threeInteractions:metric(hand3)};
}
function simEngine(main){try{const f=W.YGORulingEngine?.evaluateOpeningSamples;if(typeof f==='function')return f(main,72,6)||{};}catch(e){try{console.warn('Alpha256 rules simulation',e)}catch(_){} }return{};}
function legality(d){const m=total(d.main),e=total(d.extra),s=total(d.side),issues=[],counts=new Map();for(const z of [d.main,d.extra,d.side])for(const c of arr(z)){const k=norm(data(c).name||c.name||c.id);counts.set(k,(counts.get(k)||0)+rawQty(c));}if(m<40)issues.push('Main Deck menor a 40');if(m>60)issues.push('Main Deck mayor a 60');if(e>15)issues.push('Extra Deck mayor a 15');if(s>15)issues.push('Side Deck mayor a 15');for(const [k,n] of counts)if(n>3)issues.push(`Más de 3 copias: ${k} (${n})`);
 let banlist='not-loaded';let restricted=0;try{const bk=W.__YGO_ACTIVE_BAN_KEY||'tcg',b=W.BANLIST_PROFILES?.[bk]?.data;if(Array.isArray(b)&&b.length){banlist=bk;const by=new Map(b.map(x=>[norm(x.name),x]));for(const [k,n] of counts){const r=by.get(k);if(r){const max=Number(r.max??3);if(n>max){issues.push(`${r.name||k}: ${n} > ${max} por F&L TCG`);restricted++;}}}}}catch(_){ }
 return{main:m,extra:e,side:s,issues,legal:issues.length===0,restricted,banlist};}
function probabilityModel(main){main=expand(main);const N=main.length;const roleCount=pred=>main.reduce((n,c)=>n+(pred(sem(c))?1:0),0);const defs={starter:x=>x.starter,search:x=>x.search,draw:x=>x.draw,extender:x=>x.extender,interaction:x=>x.interaction,negate:x=>x.negate,remove:x=>x.remove,recover:x=>x.recover,protect:x=>x.protect};const p={};for(const [label,pred] of Object.entries(defs)){const K=Math.min(N,roleCount(pred));p[label]={cards:K,at5:pAtLeast(K,N,5),at6:pAtLeast(K,N,6),at7:pAtLeast(K,N,7)};}const live=Math.min(N,roleCount(x=>x.starter||x.extender||x.interaction||x.draw||x.search||x.recover));p.live={cards:live,at5:pAtLeast(live,N,5),at6:pAtLeast(live,N,6),at7:pAtLeast(live,N,7)};p.meta={version:'contextual-resolution-v1',deckCopies:N,model:'HYPERGEOMETRIC_WITHOUT_REPLACEMENT',classification:'PROVISIONAL_CAPABILITIES',handSizes:[5,6,7],starterEvent:'At least one candidate access card; not a proven playable hand',playabilityProven:false};return p;}
function evaluate(input){const d=input||W.deckState||{main:[],extra:[],side:[]};const main=expand(d.main),extra=expand(d.extra),side=expand(d.side);if(!main.length)return{scores:Array(10).fill(0),total:0,finalScore:0,meta:{engine:'Alpha 256 · Judge-oriented deterministic evaluator',legal:false,issues:['Main Deck vacío']}};
 const L=legality(d),M=aggregate(main),E=aggregate(extra),S=aggregate(side),P=probabilityModel(main),MC=openingMonteCarlo(main,5000),SIM=simEngine(main);
 const mc=x=>Number(MC?.[x]?.pct||0)/100, sim=x=>Number(SIM?.[x]||0)/100, p=x=>Number(P?.[x]?.at5||0);
 const pStarter=p('starter'),pSearch=p('search'),pDraw=p('draw'),pExt=p('extender'),pInt=p('interaction'),pRec=p('recover'),pProt=p('protect');
 const playable=mc('playable')||Number(SIM?.playableRate||0)/100, resilience=Number(SIM?.resilienceRate||0)/100||clamp(.35*pRec+.25*mc('recover')+.2*mc('playable')+.2*Number(P.live?.at6||0)), actions=clamp(Number(SIM?.avgActions||0)/6), mons=clamp(Number(SIM?.avgMonsters||0)/5), back=clamp(Number(SIM?.avgBackrow||0)/5), atk=clamp(Number(SIM?.avgAtk||0)/8000), searches=clamp(Number(SIM?.avgSearches||0)/3), interactions=clamp(Number(SIM?.avgInteractions||0)/3), resources=clamp(Number(SIM?.avgResources||0)/4), branching=clamp(Number(SIM?.branching||0)/6);
 const extraUtility=clamp((E.extender+E.interaction+E.material+E.protect+E.search)/Math.max(1,E.unique*2)),sideUtility=clamp((S.interaction+S.negate+S.remove+S.protect+S.search+S.draw)/Math.max(1,S.unique*2));
 const control=clamp(.34*pInt+.20*Number(P.negate?.at5||0)+.18*Number(P.remove?.at5||0)+.14*interactions+.08*back+.06*extraUtility);
 const resource=clamp(.30*pSearch+.18*pDraw+.16*searches+.14*resources+.12*pRec+.10*Number(P.live?.at6||0));
 const diversity=M.diversity, unknown=clamp(M.unknown/Math.max(1,M.cards));
 const raw=[
  .42*playable+.24*pStarter+.14*pSearch+.10*resource+.10*(1-clamp(Number(MC.deadCardRate||0)/100)),
  .28*atk+.18*mons+.16*actions+.14*extraUtility+.10*Number(P.extender?.at5||0)+.08*clamp(M.burn/Math.max(1,M.cards))+.06*playable,
  .30*resilience+.18*pRec+.16*pProt+.14*Number(MC.playable?.pct||0)/100+.12*branching+.10*extraUtility,
  .34*control+.18*pInt+.14*Number(P.negate?.at5||0)+.12*Number(P.remove?.at5||0)+.10*back+.06*mons+.06*extraUtility,
  .48*playable+.24*pStarter+.12*pExt+.10*pSearch+.06*actions,
  .25*resource+.20*interactions+.18*searches+.14*branching+.13*mons+.10*Number(P.live?.at6||0),
  .26*resilience+.20*resource+.18*branching+.14*atk+.10*extraUtility+.12*Number(P.recover?.at5||0),
  .38*pInt+.20*Number(P.negate?.at5||0)+.16*Number(P.remove?.at5||0)+.10*Number(P.protect?.at5||0)+.08*extraUtility+.08*interactions,
  .40*resource+.20*pSearch+.14*pDraw+.10*searches+.10*pExt+.06*diversity,
  .24*diversity+.18*branching+.16*extraUtility+.14*sideUtility+.12*control+.10*resource+.06*pExt
 ];
 const legalFactor=L.legal?1:Math.max(.35,1-.07*L.issues.length),unknownFactor=1-.12*unknown, sizeFactor=M.cards>=40&&M.cards<=60?1:Math.max(.75,1-Math.max(0,M.cards-60,M.cards<40?40-M.cards:0)/20);const factor=clamp(legalFactor*unknownFactor*sizeFactor);
 const scores=raw.map(v=>Math.max(0,Math.min(10,Math.round(clamp(v)*10*factor))));const totalScore=scores.reduce((a,b)=>a+b,0);
 return{scores,total:totalScore,finalScore:totalScore,meta:{engine:'Alpha 256 · Judge-oriented deterministic evaluator',rules:'Konami Rulebook + PSCT + Advanced Rules + Fast Effect Timing',legal:L.legal,issues:L.issues,legality:L,main:M.cards,extra:E.cards,side:S.cards,probabilities:P,monteCarlo:MC,simulation:SIM,scoresBasis:'Probabilidades hipergeométricas exactas para acceso por rol; Monte Carlo determinista para manos compuestas; simulador de estado para líneas cuando está disponible.',uncertainty:{monteCarloTrials:MC.trials||0,confidence95:'Las métricas Monte Carlo incluyen intervalo de confianza del 95%; las hipergeométricas no tienen error de muestreo.',rulesSimulationSamples:SIM.samples||0},unknownCards:M.unknown||0,profiles:{main:M,extra:E,side:S},derived:{playable,resilience,actions,mons,back,atk,searches,interactions,resources,branching,control,resource,diversity},sources:{rulebook:'https://www.yugioh-card.com/en/rulebook/',psct:'https://www.yugioh-card.com/en/play/psct/',advanced:'https://www.yugioh-card.com/en/play/advanced-rules/',timing:'https://www.yugioh-card.com/en/play/fast-effect-timing/',neuron:'https://www.db.yugioh-card.com/yugiohdb/'}}};
}
function paint(r){const scores=Array.isArray(r?.scores)?r.scores.slice(0,10).map(v=>Math.max(0,Math.min(10,Math.round(+v||0)))):Array(10).fill(0);while(scores.length<10)scores.push(0);const total=scores.reduce((a,b)=>a+b,0);const set=(id,v,html=false)=>{const e=D.getElementById(id);if(e){if(html)e.innerHTML=v;else e.textContent=String(v)}};set('score',`${total} <span>/ 100</span>`,true);set('total',`${total} / 100`);set('sum',total);set('miniScore',`${total} / 100`);if(typeof W.tier==='function'){const t=W.tier(total)||['—','—'];set('tier',t[0]);set('miniTier',t[0]);set('tierDesc',t[1]);set('miniDesc',t[1]);}
 const q=r?.meta?.probabilities||{},mc=r?.meta?.monteCarlo||{};set('starterRate',`${pct((q.starter?.at5||0)*100)}%`);set('playableRate',`${pct(mc.playable?.pct||0)}%`);set('interactionRate',`${pct((q.interaction?.at5||0)*100)}%`);set('deadRate',`${pct(mc.deadCardRate||0)}%`);
 D.querySelectorAll('#stats .stat').forEach((row,i)=>{if(i>=10)return;const v=scores[i],sv=row.querySelector('.sv'),bar=row.querySelector('.bar i'),nm=row.querySelector('.nm'),ds=row.querySelector('.ds');if(sv)sv.textContent=v+'/10';if(bar)bar.style.width=v*10+'%';if(nm)nm.textContent=N[i];if(ds)ds.textContent=DESC[i]});
 D.querySelectorAll('#sliders .points-row').forEach((row,i)=>{if(i>=10)return;const v=scores[i],val=row.querySelector('.points-value');if(val)val.textContent=v+'/10';row.querySelectorAll('.point').forEach((p,k)=>p.classList.toggle('active',k<v));});
 W.v=scores.slice();W.finalScore=total;W.__YGO256_RESULT={...r,scores,total,finalScore:total};try{W.radar?.()}catch(_){}try{W.renderComposition?.()}catch(_){};
 const sr=r?.meta?.monteCarlo?.starter,pr=r?.meta?.monteCarlo?.playable,ir=r?.meta?.monteCarlo?.interaction;if(D.getElementById('simResult'))D.getElementById('simResult').innerHTML=`<b>Porcentajes calculados:</b> starter ${pct((q.starter?.at5||0)*100)}% exacto · mano jugable ${pct(pr?.pct||0)}% ±${pct(((pr?.ci?.high||0)-(pr?.ci?.low||0))*50*100)}% (95%) · interacción ${pct((q.interaction?.at5||0)*100)}% exacto · cartas muertas ${pct(r?.meta?.monteCarlo?.deadCardRate||0)}%.`;
 return W.__YGO256_RESULT;}
let busy=false,last='';
function fp(d){return ['main','extra','side'].map(z=>arr(d?.[z]).map(c=>`${c.id||c.name}:${rawQty(c)}`).sort().join(',')).join('|');}
function compute(force=false){const d=W.deckState||{main:[],extra:[],side:[]},f=fp(d);if(!force&&last===f&&W.__YGO256_RESULT)return W.__YGO256_RESULT;if(busy)return W.__YGO256_RESULT;busy=true;try{const r=evaluate(d);last=f;return paint(r)}finally{busy=false}}
W.YGOProbability=Object.freeze({version:'contextual-resolution-v1',semantic,contextualEffects:contextualEffects1263,probabilityModel,openingMonteCarlo,hypergeometric:hyperExact,ci95,definitions:{starter:'Acceso a una carta candidata a iniciar recursos; no prueba combo',playable:'No disponible sin replay legal del estado de cada mano',interaction:'Acceso a capacidad de respuesta impresa, condicionada a objetivos y ventana',dead:'Sin capacidad detectada en este clasificador; no equivale a carta inútil'}});
W.YGOExactRulesEngine={version:'Alpha 256',names:N.slice(),descriptions:DESC.slice(),evaluate,compute,paint,probabilityModel,openingMonteCarlo,legality,semantic};W.YGOJudgeEngine=W.YGOExactRulesEngine;W.scoreDeck=evaluate;W.calculateDeckScore=evaluate;W.evaluateDeckNow=()=>compute(true);W.recalcAll=()=>compute(true);W.calculate=()=>compute(true);W.__YGO256_EXACT=true;
})();

