
(()=>{
'use strict';
const W=window,D=document,BASE=W.YGOExactRulesEngine||W.YGOJudgeEngine;
if(!BASE)return;
const R=W.YGORulingEngine;
const clamp=x=>Math.max(0,Math.min(1,Number(x)||0));
const norm=s=>String(s??'').replace(/[“”]/g,'"').replace(/[’]/g,"'").replace(/\s+/g,' ').trim();
const low=s=>norm(s).toLowerCase();
const arr=z=>Array.isArray(z)?z:[];
const qty=c=>Math.max(1,Number(c?.qty)||1);
const expand=z=>arr(z).flatMap(c=>Array.from({length:qty(c)},()=>({...c,qty:1})));
const hash=s=>{let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h>>>0};
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296};}
function shuffle(a,r){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function cardText(c){return norm(c?.desc||c?.text||c?.description||'')}
function ast(c){
  const parsed=R?.parseCard?.(c);
  if(!parsed)return{confidence:0,known:false,effects:[]};
  const text=cardText(parsed.card||c), l=low(text);
  const effects=arr(parsed.effects).map(e=>{
    const raw=norm(e.raw||e.resolution||text), el=low(raw);
    const chainStarts=/[:;]/.test(raw)||/^(activate|activa|you can|puedes)\b/i.test(raw);
    const conjunctions=arr(e.steps).map(x=>String(x.conjunction||'start').toLowerCase()).filter(x=>x!=='start');
    const timing=e.timing||{};
    const exactTarget=arr(e.targets).length>0;
    const costCount=arr(e.costs).length;
    const confidence=clamp((
      (e.condition?1:0)+(e.activation?1:0)+(e.resolution?1:0)+(chainStarts?1:0)+
      (exactTarget?1:0)+(costCount?1:0)+(timing?1:0)+(e.restriction?1:0)+
      (conjunctions.length?1:0)+(e.kind?1:0)
    )/10);
    return{
      id:e.id,raw,condition:e.condition||'',activation:e.activation||'',resolution:e.resolution||raw,
      costs:arr(e.costs),targets:arr(e.targets),restriction:e.restriction||{},timing,steps:arr(e.steps),kind:e.kind||'UNKNOWN',
      chainStarts,spellSpeed:timing.quick?2:1,conjunctions,confidence,
      mandatoryTrigger:/^(when|if|cuando|si)\b/i.test(norm(e.condition||''))&&!/you can|puedes/i.test(norm(e.condition||'')),
      optionalTrigger:/^(when|if|cuando|si)\b/i.test(norm(e.condition||''))&&/you can|puedes/i.test(raw),
      hardOnce:/you can only use|solo puedes usar/i.test(el)
    };
  });
  const supportedTokens=/(add|search|draw|special summon|normal summon|fusion summon|synchro summon|xyz summon|link summon|ritual summon|destroy|banish|send|return|negate|target|discard|tribute|detach|pay|damage|gain|lose|roba|añade|busca|invoca|destruye|destierra|manda|devuelve|niega|objetivo|descarta|tributa)/i;
  const confidence=effects.length?effects.reduce((a,e)=>a+e.confidence,0)/effects.length:(supportedTokens.test(text)?0.45:0);
  return{card:parsed.card||c,text,effects,confidence,known:effects.length>0,chainCount:effects.filter(e=>e.chainStarts).length,quickCount:effects.filter(e=>e.timing?.quick).length,triggerCount:effects.filter(e=>e.timing?.trigger).length,unknown:!effects.length&&!supportedTokens.test(text)};
}
const astCache=new Map();
function getAST(c){const k=String(c?.id??c?.name??'')+'|'+cardText(c);if(astCache.has(k))return astCache.get(k);const a=ast(c);astCache.set(k,a);return a;}
function semantic(c){
  const b=BASE.semantic?BASE.semantic(c):{},a=getAST(c);
  // Keep the shared context classifier authoritative: whole-text fallback here
  // used to turn Ash's conditional bullet list into its own summon/search.
  return{...b,ast:a,ruleConfidence:b.unknown?0:Math.min(.8,a.confidence),
    chainEffect:+!!a.effects.some(e=>e.chainStarts),
    classificationStatus:b.classificationStatus||'PROVISIONAL_CAPABILITIES'};
}
function roleStats(main){
  const keys=['starter','search','draw','extender','interaction','negate','remove','recover','protect','material','battle','chainEffect','quick','trigger','cost'];
  const out={cards:main.length,unique:0,unknown:0,confidence:0};const seen=new Set();for(const c of main){const x=semantic(c);for(const k of keys)out[k]=(out[k]||0)+(x[k]?1:0);out.unknown+=x.ruleConfidence<0.35?1:0;out.confidence+=x.ruleConfidence;const id=String(c?.id??c?.name);if(!seen.has(id)){seen.add(id);out.unique++}}out.confidence=main.length?out.confidence/main.length:0;return out;
}
function exact(K,N,H,r=1){if(N<=0||H<=0||H>N||K<=0)return 0;if(r>H||K<r)return 0;function lc(n,k){if(k<0||k>n)return-Infinity;k=Math.min(k,n-k);let z=0;for(let i=1;i<=k;i++)z+=Math.log(n-k+i)-Math.log(i);return z}let p=0;for(let x=r;x<=Math.min(K,H);x++)p+=Math.exp(lc(K,x)+lc(N-K,H-x)-lc(N,H));return clamp(p)}
function ci(h,n){if(!n)return 0;const p=h/n;return 1.96*Math.sqrt(p*(1-p)/n);}
function ruleTrials(main,trials=900){
  const deck=[];for(const c of main)for(let i=0;i<qty(c);i++)deck.push(c);if(deck.length<5)return{trials:0};
  const sig=main.map(c=>`${c.id||c.name}:${qty(c)}`).sort().join('|')+'|A257';const r=rng(hash(sig));
  let playable=0,full=0,actions=0,legal=0,resilient=0,alternate=0,board=0;
  for(let i=0;i<trials;i++){
    const hand=shuffle(deck,r).slice(0,5);
    let sim=null;try{sim=R?.simulateLine?.(hand,{deterministic:true})}catch(_){}
    const a=Number(sim?.state?.analysis?.actions||0),s=Number(sim?.executed?.length||0);
    const can=s>0||a>0;playable+=can;full+=s>=Math.min(3,hand.length);actions+=a;legal+=!!sim?.legal;board+=Number(sim?.finalBoard?.monsters?.length||0)+Number(sim?.finalBoard?.spelltrap?.length||0);
    let alt=false;
    if(can&&hand.length>1){for(let j=0;j<hand.length;j++){const reduced=hand.slice(0,j).concat(hand.slice(j+1));let z=null;try{z=R?.simulateLine?.(reduced,{deterministic:true})}catch(_){}if(Number(z?.executed?.length||0)>0||Number(z?.state?.analysis?.actions||0)>0){alt=true;break}}}
    if(alt){resilient++;alternate++}
  }
  const n=trials;return{trials:n,playableRate:playable/n,fullLineRate:full/n,resilienceRate:playable?resilient/playable:0,alternateLineRate:alternate/n,legalLineRate:legal/n,avgActions:actions/n,avgBoard:board/n,ci95:{playable:ci(playable,n),resilience:ci(resilient,n)}};
}
function evaluate(input){
  const d=input||W.deckState||{main:[],extra:[],side:[]}; const main=expand(d.main),extra=expand(d.extra),side=expand(d.side);
  if(!main.length)return{scores:Array(10).fill(0),total:0,finalScore:0,meta:{engine:'Alpha 257 · Judge-oriented rules + play-line evaluator',legal:false,issues:['Main Deck vacío']}};
  const L=BASE.legality(d),M=roleStats(main),E=roleStats(extra),S=roleStats(side),P=BASE.probabilityModel(main),MC=BASE.openingMonteCarlo(main,Math.max(200,Number(W.__YGO_ANALYSIS_BUDGET?.mc)||600)),RT=ruleTrials(main,Math.max(20,Number(W.__YGO_ANALYSIS_BUDGET?.rules)||40));
  const p=k=>Number(P?.[k]?.at5||0), mc=k=>Number(MC?.[k]?.pct||0)/100, rt=k=>Number(RT?.[k]||0);
  const playable=clamp(.60*rt('playableRate')+.40*mc('playable'));
  const resilience=clamp(.72*rt('resilienceRate')+.18*rt('alternateLineRate')+.10*mc('recover'));
  const control=clamp(.38*p('interaction')+.18*p('negate')+.16*p('remove')+.12*clamp(M.interaction/Math.max(1,M.cards))+.10*mc('interaction')+.06*clamp(E.interaction/Math.max(1,E.cards||1)));
  const resource=clamp(.28*p('search')+.18*p('draw')+.18*p('recover')+.14*mc('search')+.12*clamp(M.search/Math.max(1,M.cards))+.10*clamp(M.draw/Math.max(1,M.cards)));
  const offensive=clamp(.22*playable+.18*p('extender')+.15*clamp(M.battle/Math.max(1,M.cards))+.15*clamp(M.ss/Math.max(1,M.cards))+.15*clamp((E.material||0)/Math.max(1,E.cards||1))+.15*mc('draw'));
  const diversity=clamp((new Set(main.map(c=>String(c?.name||c?.id))).size)/Math.max(1,main.length));
  const extraUtility=clamp(((E.extender||0)+(E.interaction||0)+(E.material||0)+(E.protect||0))/Math.max(1,E.cards*1.5));
  const sideUtility=clamp(((S.interaction||0)+(S.negate||0)+(S.remove||0)+(S.protect||0))/Math.max(1,S.cards*1.5));
  const unknown=clamp(M.unknown/Math.max(1,M.cards));
  const ruleConfidence=clamp(M.confidence);
  const raw=[
    .44*playable+.20*p('starter')+.16*p('search')+.10*resource+.10*ruleConfidence,
    .36*offensive+.22*clamp(M.ss/Math.max(1,M.cards))+.16*p('extender')+.14*extraUtility+.12*mc('playable'),
    .48*resilience+.18*p('recover')+.14*rt('alternateLineRate')+.10*ruleConfidence+.10*extraUtility,
    .38*control+.18*p('interaction')+.14*p('negate')+.12*p('remove')+.10*extraUtility+.08*ruleConfidence,
    .52*playable+.22*p('starter')+.12*p('extender')+.08*p('search')+.06*rt('fullLineRate'),
    .26*resource+.20*control+.18*rt('fullLineRate')+.14*rt('alternateLineRate')+.12*mc('search')+.10*ruleConfidence,
    .28*resilience+.20*resource+.18*offensive+.14*extraUtility+.10*p('recover')+.10*ruleConfidence,
    .42*p('interaction')+.20*p('negate')+.16*p('remove')+.10*mc('interaction')+.06*sideUtility+.06*ruleConfidence,
    .42*resource+.20*p('search')+.16*p('draw')+.10*mc('search')+.06*p('extender')+.06*ruleConfidence,
    .24*diversity+.20*rt('alternateLineRate')+.18*extraUtility+.14*sideUtility+.12*control+.12*resource
  ];
  const legalFactor=L.legal?1:Math.max(.35,1-.07*L.issues.length),unknownFactor=1-.12*unknown,size=M.cards>=40&&M.cards<=60?1:.75,factor=clamp(legalFactor*unknownFactor*size);
  const scores=raw.map(v=>Math.max(0,Math.min(10,Math.round(clamp(v)*10*factor))));const total=scores.reduce((a,b)=>a+b,0);
  return{scores,total,finalScore:total,meta:{engine:'Alpha 257 · Judge-oriented rules + play-line evaluator',rules:'Konami Rulebook + PSCT + Advanced Rules + Fast Effect Timing',legal:L.legal,issues:L.issues,legality:L,main:M.cards,extra:E.cards,side:S.cards,probabilities:P,monteCarlo:MC,simulation:RT,profiles:{main:M,extra:E,side:S},derived:{playable,resilience,control,resource,offensive,diversity,ruleConfidence},uncertainty:{monteCarloTrials:MC.trials||0,playLineTrials:RT.trials||0,confidence95:'Las probabilidades hipergeométricas son exactas para los roles definidos; las métricas de simulación son estimaciones con IC 95%.',playable95:ci(RT.playableRate*RT.trials,RT.trials),resilience95:ci(RT.resilienceRate*RT.trials,RT.trials)},unknownCards:M.unknown||0,scoresBasis:'Acceso hipergeométrico + clasificación PSCT + simulación de líneas mediante el motor de estados existente; las interacciones no soportadas se tratan como incertidumbre.',sources:{rulebook:'https://www.yugioh-card.com/en/rulebook/',psct:'https://www.yugioh-card.com/en/play/psct/',advanced:'https://www.yugioh-card.com/en/play/advanced-rules/',timing:'https://www.yugioh-card.com/en/play/fast-effect-timing/',neuron:'https://www.db.yugioh-card.com/yugiohdb/'}}};
}
function paint(r){
  const scores=(r?.scores||Array(10).fill(0)).slice(0,10).map(v=>Math.max(0,Math.min(10,Math.round(Number(v)||0))));while(scores.length<10)scores.push(0);const total=scores.reduce((a,b)=>a+b,0);
  const set=(id,v,h=false)=>{const e=D.getElementById(id);if(e){if(h)e.innerHTML=v;else e.textContent=String(v)}};
  set('score',`${total} <span>/ 100</span>`,true);set('total',`${total} / 100`);set('sum',total);set('miniScore',`${total} / 100`);
  if(typeof W.tier==='function'){const t=W.tier(total)||['—','—'];set('tier',t[0]);set('miniTier',t[0]);set('tierDesc',t[1]);set('miniDesc',t[1]);}
  D.querySelectorAll('#stats .stat').forEach((row,i)=>{if(i>=10)return;const v=scores[i],sv=row.querySelector('.sv'),bar=row.querySelector('.bar i'),nm=row.querySelector('.nm'),ds=row.querySelector('.ds');if(sv)sv.textContent=v+'/10';if(bar)bar.style.width=v*10+'%';if(nm)nm.textContent=BASE.names[i]||nm.textContent;if(ds)ds.textContent=BASE.descriptions?.[i]||ds.textContent});
  D.querySelectorAll('#sliders .points-row').forEach((row,i)=>{if(i>=10)return;const v=scores[i],val=row.querySelector('.points-value');if(val)val.textContent=v+'/10';row.querySelectorAll('.point').forEach((p,k)=>p.classList.toggle('active',k<v));});
  W.v=scores.slice();W.finalScore=total;W.__YGO257_RESULT={...r,scores,total,finalScore:total};try{W.radar?.()}catch(_){}try{W.renderComposition?.()}catch(_){}
  const q=r?.meta?.probabilities||{},mc=r?.meta?.monteCarlo||{},rt=r?.meta?.simulation||{};
  if(D.getElementById('starterRate'))D.getElementById('starterRate').textContent=Math.round((q.starter?.at5||0)*1000)/10+'%';
  if(D.getElementById('playableRate'))D.getElementById('playableRate').textContent=Math.round((rt.playableRate||0)*1000)/10+'%';
  if(D.getElementById('interactionRate'))D.getElementById('interactionRate').textContent=Math.round((q.interaction?.at5||0)*1000)/10+'%';
  if(D.getElementById('deadRate'))D.getElementById('deadRate').textContent=Math.round((mc.deadCardRate||0)*10)/10+'%';
  if(D.getElementById('simResult'))D.getElementById('simResult').innerHTML=`<b>Evaluación:</b> starter ${(q.starter?.at5*100||0).toFixed(1)}% exacto · línea jugable ${(rt.playableRate*100||0).toFixed(1)}% ±${(rt.ci95?.playable*50*100||0).toFixed(1)}% (95%) · resiliencia ${(rt.resilienceRate*100||0).toFixed(1)}% ±${(rt.ci95?.resilience*50*100||0).toFixed(1)}% · interacción ${(q.interaction?.at5*100||0).toFixed(1)}% exacto.`;
  return W.__YGO257_RESULT;
}
let busy=false,last='';function fingerprint(d){return['main','extra','side'].map(z=>arr(d?.[z]).map(c=>`${c.id||c.name}:${qty(c)}`).sort().join(',')).join('|')}
function compute(force=false){const d=W.deckState||{main:[],extra:[],side:[]},f=fingerprint(d);if(!force&&last===f&&W.__YGO257_RESULT)return W.__YGO257_RESULT;if(busy)return W.__YGO257_RESULT;busy=true;try{const r=evaluate(d);last=f;return paint(r)}finally{busy=false}}
const API={version:'Alpha 257',names:BASE.names?.slice()||[],descriptions:BASE.descriptions?.slice()||[],evaluate,compute,paint,probabilityModel:BASE.probabilityModel,openingMonteCarlo:BASE.openingMonteCarlo,legality:BASE.legality,semantic,getAST,ruleTrials};
W.YGOExactRulesEngine=API;W.YGOJudgeEngine=API;W.scoreDeck=evaluate;W.calculateDeckScore=evaluate;W.evaluateDeckNow=()=>compute(true);W.recalcAll=()=>compute(true);W.calculate=()=>compute(true);W.__YGO257_EXACT=true;
})();
