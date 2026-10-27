
/* Alpha 258 · PSCT AST + interruption stress evaluator. Visual layout intentionally untouched. */
(function(){
'use strict';
const W=window,D=document,BASE=W.YGOExactRulesEngine,R=W.YGORulingEngine;
if(!BASE||!R)return;
const clamp=n=>Math.max(0,Math.min(1,Number(n)||0));
const norm=s=>String(s??'').replace(/\s+/g,' ').trim();
const low=s=>norm(s).toLowerCase();
function hash(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let x=seed>>>0||0x9e3779b9;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function qty(c){return Math.max(1,Math.floor(Number(c?.qty||c?.count||c?.quantity||1)))}
function expand(list){const out=[];for(const c of (Array.isArray(list)?list:[])){for(let i=0;i<qty(c);i++)out.push({...c,qty:1})}return out}
function cardText(c){return norm(c?.desc||c?.description||c?.text||'')}
function cardKey(c){return String(c?.id??c?.name??'')}

/* -------- Formalized PSCT AST (conservative: unsupported clauses stay explicit) -------- */
const CONJ=[
  {re:/\band if you do\b|\by si lo haces\b/i,type:'AND_IF_YOU_DO',relation:'simultaneous-dependent'},
  {re:/\bthen\b|\bdespu[eé]s\b|\bentonces\b/i,type:'THEN',relation:'sequential-dependent'},
  {re:/\balso\b|\btambi[eé]n\b/i,type:'ALSO',relation:'independent'},
  {re:/\band\b|\by\b/i,type:'AND',relation:'simultaneous'},
  {re:/\botherwise\b|\bde lo contrario\b/i,type:'OTHERWISE',relation:'conditional-alternative'}
];
function splitEffects(text){
  const t=norm(text); if(!t)return[];
  // A period normally closes an effect sentence. Preserve abbreviations/numbers conservatively.
  return t.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡0-9])/).map(norm).filter(Boolean);
}
function firstUnescaped(s,ch){return s.indexOf(ch)}
function parseLeadingCondition(s){
  const x=norm(s),m=x.match(/^(if|when|during|at the start of|at the end of|si|cuando|durante|al inicio de|al final de)\b[^:;]*(?=[:,;])/i);
  return m?norm(m[0]):'';
}
function splitResolution(text){
  const src=norm(text),hits=[];
  for(const c of CONJ){let re=new RegExp(c.re.source,'ig'),m;while((m=re.exec(src)))hits.push({i:m.index,len:m[0].length,type:c.type,relation:c.relation,raw:m[0]})}
  hits.sort((a,b)=>a.i-b.i||b.len-a.len);
  const filtered=[];let end=-1;for(const h of hits){if(h.i<end)continue;filtered.push(h);end=h.i+h.len}
  if(!filtered.length)return[{index:0,text:src,join:'START',relation:'start'}];
  const out=[];let pos=0,join='START',relation='start',idx=0;
  for(const h of filtered){const seg=norm(src.slice(pos,h.i));if(seg)out.push({index:idx++,text:seg,join,relation});join=h.type;relation=h.relation;pos=h.i+h.len}
  const tail=norm(src.slice(pos));if(tail)out.push({index:idx,text:tail,join,relation});
  return out;
}
function parseCostTokens(s){
  const x=norm(s),out=[];let m;
  const push=(kind,amount,raw,extra={})=>out.push({kind,amount,raw:norm(raw),...extra});
  const pats=[
    [/pay\s+(\d[\d,]*)\s*lp/ig,'LP',m=>+m[1].replace(/,/g,'')],
    [/pay\s+(?:half|½)\s+(?:your\s+)?lp/ig,'LP_HALF',()=>null],
    [/discard\s+(\d+|a|an|one)\s+cards?/ig,'DISCARD',m=>/^\d+$/.test(m[1])?+m[1]:1],
    [/tribute\s+(\d+|a|an|one)\s+monsters?/ig,'TRIBUTE',m=>/^\d+$/.test(m[1])?+m[1]:1],
    [/detach\s+(\d+|a|an|one)\s+materials?/ig,'DETACH',m=>/^\d+$/.test(m[1])?+m[1]:1],
    [/banish\s+(\d+|a|an|one)\s+cards?[^;:]*/ig,'BANISH',m=>/^\d+$/.test(m[1])?+m[1]:1],
    [/send\s+(\d+|a|an|one)\s+cards?[^;:]*graveyard/ig,'SEND_GY',m=>/^\d+$/.test(m[1])?+m[1]:1],
    [/reveal\s+(\d+|a|an|one)\s+cards?/ig,'REVEAL',m=>/^\d+$/.test(m[1])?+m[1]:1]
  ];
  for(const [re,k,amt] of pats){while((m=re.exec(x)))push(k,amt(m),m[0])}
  return out;
}
function parseTargetTokens(s){
  const x=norm(s),out=[];let m;
  const re=/(?:target|selecciona como objetivo|elige como objetivo)\s+(up to\s+)?(\d+|a|an|one)?\s*([^;:.]+)/ig;
  while((m=re.exec(x))){const n=m[2]&&/^\d+$/.test(m[2])?+m[2]:1;out.push({min:m[1]?0:n,max:n,description:norm(m[3]),raw:norm(m[0])})}
  return out;
}
function parseLimit(s){const l=low(s);return{
  oncePerTurn:/once per turn|una vez por turno/.test(l),
  hardOnce:/you can only use (?:this|each) effect|solo puedes usar (?:este|cada) efecto/.test(l),
  oncePerChain:/once per chain|una vez por cadena/.test(l),
  oncePerDuel:/once per duel|una vez por duelo/.test(l),
  activationOnce:/you can only activate|solo puedes activar/.test(l)
}}
function timingInfo(condition,all){const l=low(condition+' '+all);return{
  keyword:/^when\b|^cuando\b/.test(low(condition))?'WHEN':(/^if\b|^si\b/.test(low(condition))?'IF':'NONE'),
  optional:/\byou can\b|\bpuedes\b/.test(l),
  mandatory:!/\byou can\b|\bpuedes\b/.test(l),
  quick:/quick effect|efecto r[aá]pido|during either player'?s turn|durante el turno de cualquier jugador/.test(l),
  trigger:/^(when|if|cuando|si)\b/.test(low(condition)),
  damageStep:/damage step|damage calculation|etapa de da[ñn]o|c[aá]lculo de da[ñn]o/.test(l),
  phases:(l.match(/(?:draw|standby|main 1|main phase|battle|main 2|end) phase/g)||[])
}}
function actionTags(s){const l=low(s),a=[];const t=(re,v)=>{if(re.test(l))a.push(v)};
  t(/special summon|invoca.*especial/,'SPECIAL_SUMMON');t(/normal summon|invoca.*normal/,'NORMAL_SUMMON');t(/add .*deck.*hand|add .*to your hand|search|a[ñn]ade .*deck.*mano|busca/,'SEARCH');t(/\bdraw\b|\broba\b/,'DRAW');t(/negate|niega/,'NEGATE');t(/destroy|destruye/,'DESTROY');t(/banish|destierra/,'BANISH');t(/send .*graveyard|manda .*cementerio/,'SEND_GY');t(/return .*hand|devuelve .*mano/,'BOUNCE');t(/shuffle .*deck|baraja .*deck/,'SHUFFLE');t(/set .*spell|set .*trap|coloca .*m[aá]gica|coloca .*trampa/,'SET');t(/gain .*lp|gana .*lp/,'GAIN_LP');t(/inflict .*damage|inflige .*da[ñn]o/,'BURN');return a}
function parsePSCTv2(text){
  const effects=[];
  const sourceEffects=W.YGOProbability?.contextualEffects?.({desc:text});
  for(const sentence of (Array.isArray(sourceEffects)?sourceEffects.map(e=>e.raw):splitEffects(text))){
    let condition='',costTarget='',resolution=sentence;
    const colon=firstUnescaped(sentence,':'),semi=firstUnescaped(sentence,';');
    if(colon>=0){condition=norm(sentence.slice(0,colon));const tail=norm(sentence.slice(colon+1));const s2=tail.indexOf(';');if(s2>=0){costTarget=norm(tail.slice(0,s2));resolution=norm(tail.slice(s2+1))}else resolution=tail}
    else {condition=parseLeadingCondition(sentence);let tail=condition?norm(sentence.slice(condition.length).replace(/^\s*[,;:]\s*/,'')):sentence;const s2=tail.indexOf(';');if(s2>=0){costTarget=norm(tail.slice(0,s2));resolution=norm(tail.slice(s2+1))}else resolution=tail}
    const all=norm([condition,costTarget,resolution].join(' '));
    const nodes=splitResolution(resolution).map(n=>({...n,actions:actionTags(n.text)}));
    const costs=parseCostTokens(costTarget),targets=parseTargetTokens(costTarget);
    const unsupported=[];
    if(/choose|declare|excavate|equip|attach|place .* counter|coin|die|dice|column|zone/i.test(resolution))unsupported.push('SPECIAL_OPERATION');
    if(/instead|would be|replace|en su lugar/i.test(all))unsupported.push('REPLACEMENT_OR_PREVENTION');
    effects.push({
      id:effects.length+1,raw:sentence,condition,costTarget,resolution,
      costs,targets,nodes,limits:parseLimit(all),timing:timingInfo(condition,all),
      actions:[...new Set(nodes.flatMap(n=>n.actions))],unsupported,
      confidence:clamp(1-(unsupported.length*.18)-(resolution?0:.35))
    });
  }
  return {version:'psct-ast-2',effects,confidence:effects.length?effects.reduce((a,e)=>a+e.confidence,0)/effects.length:0};
}
function parseCardV2(c){return{card:c,text:cardText(c),ast:parsePSCTv2(cardText(c))}}

/* -------- Deterministic interruption stress tests -------- */
function roleValue(c){const s=BASE.semantic?.(c)||{};return (s.starter?5:0)+(s.search?4:0)+(s.extender?3:0)+(s.draw?2:0)+(s.interaction?1:0)}
function lineSuccess(hand){try{const z=R.simulateLine?.(hand,{deterministic:true});const executed=Number(z?.executed?.length||0),actions=Number(z?.state?.analysis?.actions||0),mon=Number(z?.finalBoard?.monsters?.length||0),back=Number(z?.finalBoard?.spelltrap?.length||0);return{ok:executed>0||actions>0,depth:Math.max(executed,actions),board:mon+back,raw:z}}catch(_){return{ok:false,depth:0,board:0,raw:null}}}
function interruptionStress(main,trials=360){
  const deck=expand(main);if(deck.length<5)return{trials:0,baselineRate:0,survivalRate:0,oneDisruptionSurvival:0,criticalDependencyRate:0,alternateLineRate:0,avgDepthAfter:0,ci95:0};
  const r=rng(hash(deck.map(cardKey).sort().join('|')+'|A258-INT'));
  let baseOK=0,survive=0,critical=0,alt=0,depthAfter=0;
  for(let i=0;i<trials;i++){
    const hand=shuffle(deck,r).slice(0,5),base=lineSuccess(hand);if(!base.ok)continue;baseOK++;
    // Stress class 1: remove the highest-leverage card from the opening hand (proxy for a negated/removed first access point).
    let idx=0,best=-1;for(let j=0;j<hand.length;j++){const v=roleValue(hand[j]);if(v>best){best=v;idx=j}}
    const reduced=hand.slice(0,idx).concat(hand.slice(idx+1));const after=lineSuccess(reduced);if(after.ok){survive++;depthAfter+=after.depth;alt++;}else critical++;
  }
  const n=Math.max(1,baseOK),p=survive/n,half=1.96*Math.sqrt(p*(1-p)/n);
  return{trials,baselineHands:baseOK,baselineRate:baseOK/trials,oneDisruptionSurvival:p,survivalRate:p,criticalDependencyRate:critical/n,alternateLineRate:alt/n,avgDepthAfter:survive?depthAfter/survive:0,ci95:half,method:'Deterministic card-removal sensitivity proxy. Removing a hand card is not an opponent response or a calibrated match winrate.',causalOpponentSimulation:false,certified:false};
}
function rulesCoverage(main){
  let effects=0,confidence=0,unsupported=0,whenOpt=0,ifTrig=0,quick=0,conj=0;
  for(const c of main){const ast=parsePSCTv2(cardText(c));for(const e of ast.effects){effects++;confidence+=e.confidence;unsupported+=e.unsupported.length;if(e.timing.keyword==='WHEN'&&e.timing.optional)whenOpt++;if(e.timing.keyword==='IF')ifTrig++;if(e.timing.quick)quick++;conj+=Math.max(0,e.nodes.length-1)}}
  return{effects,confidence:effects?confidence/effects:0,unsupported,unsupportedRate:effects?clamp(unsupported/effects):0,optionalWhen:whenOpt,ifTriggers:ifTrig,quickEffects:quick,conjunctions:conj};
}
function evaluate(input){
  const base=BASE.evaluate(input),d=input||W.deckState||{main:[],extra:[],side:[]},main=expand(d.main);
  if(!main.length)return{...base,meta:{...(base.meta||{}),engine:'Alpha 258 · Judge-oriented PSCT AST + interruption stress'}};
  const stress=interruptionStress(main,Math.max(16,Number(W.__YGO_ANALYSIS_BUDGET?.stress)||24)),coverage=rulesCoverage(main),scores=(base.scores||Array(10).fill(0)).slice(0,10);
  const cov=clamp(coverage.confidence*(1-.30*coverage.unsupportedRate));
  // Only categories directly supported by the new evidence are adjusted. Keep 0–10 integer contract.
  const blend=(old,evidence,w)=>Math.max(0,Math.min(10,Math.round((Number(old)||0)*(1-w)+clamp(evidence)*10*w)));
  scores[0]=blend(scores[0],clamp((base.meta?.derived?.playable||0)*.82+cov*.18),.18); // Consistencia
  scores[2]=blend(scores[2],clamp(stress.oneDisruptionSurvival*.78+(base.meta?.derived?.resilience||0)*.22),.42); // Resiliencia
  scores[3]=blend(scores[3],clamp((base.meta?.derived?.control||0)*.80+Math.min(1,coverage.quickEffects/Math.max(1,main.length))*.20),.16); // Control
  scores[7]=blend(scores[7],clamp((base.meta?.derived?.control||0)*.72+Math.min(1,(coverage.quickEffects+coverage.optionalWhen)/Math.max(1,main.length))*.28),.20); // Interacción
  scores[9]=blend(scores[9],clamp(stress.alternateLineRate*.62+(base.meta?.derived?.diversity||0)*.25+cov*.13),.30); // Versatilidad
  const total=scores.reduce((a,b)=>a+b,0);
  return{...base,scores,total,finalScore:total,meta:{...(base.meta||{}),engine:'Alpha 258 · Judge-oriented PSCT AST + interruption stress',rulesCoverage:coverage,interruptionStress:stress,psctASTVersion:'psct-ast-2',scoresBasis:(base.meta?.scoresBasis||'')+' + AST PSCT formalizado + prueba determinista de supervivencia a una interrupción de acceso.',uncertainty:{...(base.meta?.uncertainty||{}),interruptionStress95:stress.ci95,interruptionMethod:stress.method}}};
}
function paint(r){
  // Reuse the protected Alpha 257 renderer, then fix the CI text only.
  const out=BASE.paint(r),q=r?.meta?.probabilities||{},rt=r?.meta?.simulation||{},st=r?.meta?.interruptionStress||{};
  const e=D.getElementById('simResult');if(e)e.innerHTML=`<b>Evaluación:</b> starter ${((q.starter?.at5||0)*100).toFixed(1)}% exacto · línea jugable ${((rt.playableRate||0)*100).toFixed(1)}% ±${((rt.ci95?.playable||0)*100).toFixed(1)}% (95%) · resiliencia base ${((rt.resilienceRate||0)*100).toFixed(1)}% · sobrevive 1 interrupción ${((st.oneDisruptionSurvival||0)*100).toFixed(1)}% ±${((st.ci95||0)*100).toFixed(1)}% · interacción ${((q.interaction?.at5||0)*100).toFixed(1)}% exacto.`;
  W.__YGO258_RESULT={...out,...r,scores:r.scores,total:r.total,finalScore:r.finalScore};return W.__YGO258_RESULT;
}
let busy=false,last='';function fingerprint(d){return['main','extra','side'].map(z=>(Array.isArray(d?.[z])?d[z]:[]).map(c=>`${cardKey(c)}:${qty(c)}`).sort().join(',')).join('|')}
function compute(force=false){const d=W.deckState||{main:[],extra:[],side:[]},f=fingerprint(d);if(!force&&last===f&&W.__YGO258_RESULT)return W.__YGO258_RESULT;if(busy)return W.__YGO258_RESULT;busy=true;try{const r=evaluate(d);last=f;return paint(r)}finally{busy=false}}
function audit(){
  const checks=[];const ok=(name,v)=>checks.push({name,ok:!!v});
  const a=parsePSCTv2('If this card is Normal Summoned: You can discard 1 card; add 1 monster from your Deck to your hand, then draw 1 card.');
  ok('PSCT effect parsed',a.effects.length===1);ok('Condition IF',a.effects[0]?.timing?.keyword==='IF');ok('Cost parsed',a.effects[0]?.costs?.some(x=>x.kind==='DISCARD'));ok('THEN conjunction',a.effects[0]?.nodes?.some(x=>x.join==='THEN'));ok('SEARCH action',a.effects[0]?.actions?.includes('SEARCH'));ok('DRAW action',a.effects[0]?.actions?.includes('DRAW'));
  const b=parsePSCTv2('When a card or effect is activated (Quick Effect): You can pay 1000 LP; negate the activation, and if you do, destroy that card.');
  ok('WHEN timing',b.effects[0]?.timing?.keyword==='WHEN');ok('Quick timing',b.effects[0]?.timing?.quick);ok('LP cost',b.effects[0]?.costs?.some(x=>x.kind==='LP'&&x.amount===1000));ok('AND_IF_YOU_DO',b.effects[0]?.nodes?.some(x=>x.join==='AND_IF_YOU_DO'));ok('NEGATE action',b.effects[0]?.actions?.includes('NEGATE'));
  return{version:'Alpha 258',passed:checks.filter(x=>x.ok).length,total:checks.length,ok:checks.every(x=>x.ok),checks};
}
const API={...BASE,version:'Alpha 258',evaluate,compute,paint,parsePSCTv2,parseCardV2,interruptionStress,rulesCoverage,audit};
W.YGOExactRulesEngine=API;W.YGOJudgeEngine=API;W.scoreDeck=evaluate;W.calculateDeckScore=evaluate;W.evaluateDeckNow=()=>compute(true);W.recalcAll=()=>compute(true);W.calculate=()=>compute(true);W.__YGO258_EXACT=true;W.__YGO258_AUDIT=null;
})();
