
(()=>{
'use strict';
const W=window,D=document;
const A604=W.YGOAlpha604||{},A644=W.YGOAlpha644||{},A654=W.YGOAlpha654||{},A655=W.YGOAlpha655||{},A656=W.YGOAlpha656||{};
const VERSION='Alpha 666',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_666';
const arr=v=>Array.isArray(v)?v:[];
const raw=v=>String(v??'');
const norm=v=>raw(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
const clone=v=>{try{return structuredClone(v)}catch(_){try{return JSON.parse(JSON.stringify(v))}catch(__){return v}}};
const E=()=>W.YGORulingEngine||{};

function name666(c){return raw(c?.name||c?.card?.name)}
function type666(c){return raw(c?.type||c?.card?.type||c?.frameType)}
function isMonster666(c){return /monster|monstruo/i.test(type666(c))}
function isSpellTrap666(c){return /spell|trap|magica|mágica|trampa/i.test(type666(c))&&!isMonster666(c)}

function safeParse666(card){
  let parsed=null;
  try{parsed=E().parseCard?.(card)||null}catch(_){}
  const out=clone(parsed)||{card,effects:[]};
  const n=norm(name666(card)),t=type666(card);
  out.effects=arr(out.effects).map(e=>{
    const x={...e};
    if(x.nonActivatable)return x;
    const txt=norm(x.raw||x.resolution||x.activation||'');
    let reason=null;
    if(/normal monster/i.test(t)&&!/pendulum/i.test(t)) reason='NORMAL_MONSTER_FLAVOR_TEXT';
    else if(/^(?:discard 1|discard one|discard 1 card)$/.test(txt)) reason='PURE_COST_FRAGMENT';
    else if(/activate (?:1|one) of (?:these|the following) effects/.test(txt)) reason='MODAL_EFFECT_HEADER';
    else if(n==='mulcharmy fuwalos') reason='EXACT_HANDLER_666_FUWALOS';
    else if(n==='the fallen the virtuous') reason='EXACT_HANDLER_666_FALLEN_VIRTUOUS';
    if(reason){x.nonActivatable=true;x.nonActivatableReason=reason;x.alpha666NonActivatable=true}
    return x;
  });
  return out;
}

function full666(st){return typeof A604.fullState604==='function'?A604.fullState604(st):clone(st)}
function score666(st){
  const a=st?.analysis||{},z=st?.zones?.[0]||{};
  return (Number(a.successfulSummons)||0)*8+(Number(a.successfulActivations)||0)*5+(Number(a.searches)||0)*7+(Number(a.draws)||0)*4+(Number(a.negates)||0)*10+(Number(a.removals)||0)*7+arr(z.monster).length*6+arr(z.spelltrap).length*3;
}
function combos666(xs,k,limit=4096){
  if(typeof A655.combinations655==='function')return A655.combinations655(xs,k,limit);
  const out=[];let truncated=false;
  function rec(start,pick){
    if(out.length>=limit){truncated=true;return}
    if(pick.length===k){out.push(pick.slice());return}
    for(let i=start;i<xs.length;i++){
      pick.push(xs[i]);rec(i+1,pick);pick.pop();
      if(truncated)return;
    }
  }
  if(k===0)out.push([]);else rec(0,[]);
  return{rows:out,truncated};
}
function range666(c,poolLen){
  if(typeof c==='number')return[Math.max(0,c),Math.max(0,c)];
  const min=Math.max(0,Number(c?.min)||0),maxRaw=Number(c?.max),max=Number.isFinite(maxRaw)?Math.max(min,maxRaw):min;
  return[min,Math.min(poolLen,max)];
}
function targets666(st,e,maxBranches=4096,p=0,sourceUid=null){
  const R=E(),specs=arr(e?.targets);
  if(!specs.length)return{rows:[[]],complete:true,reasons:[]};
  let rows=[[]],complete=true;const reasons=[];
  for(let i=0;i<specs.length;i++){
    const next=[];
    for(const chosen of rows){
      const legal=R.legalTargets?.(st,p,e,chosen),row=arr(legal)[i],pool=arr(row?.pool).filter(x=>!chosen.includes(x.uid));
      const [min,max]=range666(specs[i]?.count,pool.length);
      if(pool.length<min)continue;
      for(let n=min;n<=max;n++){
        const cc=combos666(pool.map(x=>x.uid),n,Math.max(1,maxBranches-next.length));
        if(cc.truncated){complete=false;reasons.push('TARGET_COMBINATION_CAP')}
        for(const pick of cc.rows){
          next.push([...chosen,...pick]);
          if(next.length>=maxBranches){complete=false;reasons.push('TARGET_BRANCH_CAP');break}
        }
        if(next.length>=maxBranches)break;
      }
      if(next.length>=maxBranches)break;
    }
    rows=next;
    if(!rows.length)break;
  }
  return{rows,complete,reasons:[...new Set(reasons)]};
}
function costs666(st,e,maxBranches=4096,p=0,sourceUid=null){
  const costs=arr(e?.costs),select=costs.map((c,i)=>({c,i})).filter(x=>['DISCARD','TRIBUTE','REVEAL','DETACH'].includes(raw(x.c?.kind).toUpperCase())),reasons=[];
  for(const c of costs){const k=raw(c?.kind).toUpperCase();if(!['LP','LP_HALF','SEND_GY','BANISH','DETACH','SHUFFLE','DISCARD','TRIBUTE','REVEAL'].includes(k))reasons.push('UNKNOWN_COST_'+k)}
  const empty=()=>Array.from({length:costs.length},()=>[]);if(!select.length)return{rows:[empty()],complete:reasons.length===0,reasons:[...new Set(reasons)]};
  const z=st?.zones?.[p]||{},src=sourceUid?E().locate?.(st,sourceUid)?.item:null;let paths=[{groups:empty(),consumed:[]}],complete=true;
  for(const {c,i} of select){const k=raw(c?.kind).toUpperCase(),n=Math.max(0,Number(c?.amount)||1);let pool=[];if(k==='DISCARD'||k==='REVEAL')pool=arr(z.hand).map(x=>x?.uid);else if(k==='TRIBUTE')pool=arr(z.monster).map(x=>x?.uid);else if(k==='DETACH')pool=arr(src?.materials);pool=pool.filter(x=>x!=null);const next=[];
    if(k==='DETACH'&&!sourceUid){complete=false;reasons.push('DETACH_SOURCE_NOT_PUBLIC');paths=[];break}
    for(const path of paths){const used=new Set(path.consumed.map(String)),consumptive=k==='DISCARD'||k==='TRIBUTE'||k==='DETACH',available=consumptive?pool.filter(uid=>!used.has(String(uid))):pool,cc=combos666(available,n,Math.max(1,maxBranches-next.length));if(cc.truncated){complete=false;reasons.push('COST_BRANCH_CAP')}
      for(const row of cc.rows){if(next.length>=maxBranches){complete=false;reasons.push('COST_BRANCH_CAP');break}const groups=path.groups.map(x=>[...x]);groups[i]=[...row];next.push({groups,consumed:[...path.consumed,...(consumptive?row:[])]})}if(next.length>=maxBranches)break}
    paths=next;if(!paths.length){complete=false;reasons.push(k==='DETACH'?'INSUFFICIENT_DETACH_MATERIALS':'INSUFFICIENT_SELECTABLE_COST_RESOURCES');break}}
  return{rows:paths.map(x=>x.groups),complete:complete&&reasons.length===0,reasons:[...new Set(reasons)],multiSelectable:select.length>1,grouped:true,detachEnumerated:select.some(x=>raw(x.c?.kind).toUpperCase()==='DETACH')};
}
function exact666(card,eid){
  const R=E(),key=norm(name666(card));let found=false;
  for(const rk of Object.keys(R)){
    if(!/^exactRuleRegistry\d+$/.test(rk))continue;
    const row=R[rk]?.[key];
    if(row?.exact===true||row?.effects?.[eid]?.exact===true||row?.effects?.[String(eid)]?.exact===true)found=true;
  }
  const cr=R.cardScriptRegistry?.[key];
  let exact=found||cr?.exact===true||cr?.effects?.[eid]?.exact===true;
  try{const pe=arr(R.parseCard?.(card)?.effects).find(x=>Number(x?.id)===Number(eid)),txt=raw(pe?.raw||pe?.resolution||'');if(/\bshuffle\b[^.]{0,160}\b(?:deck|decks)\b/i.test(txt)&&pe?.alpha799ShuffleOrderExact!==true)exact=false}catch(_){}
  return exact;
}
function move666(st,uid,to,p=0,patch={}){
  const R=E(),q=R.locate?.(st,uid);if(!q)return null;
  const [it]=st.zones[q.p][q.z].splice(q.i,1);it.previousZone=q.z;it.previousController=q.p;it.controller=p;Object.assign(it,patch);st.zones[p][to].push(it);return it;
}
function record666(st,before,card,e,kind,result,targets=[],costs=[],exact=true,sourceUid=null,source='ALPHA666'){
  return{card:name666(card)||'Carta',cardId:Number(card?.id)||null,effectId:e?.id??null,sourceUid,actionType:kind,effectText:e?.raw||e?.resolution||'',activationText:e?.activation||'',conditionText:e?.condition||'',selectedTargets:clone(targets),targets:clone(targets),selectedCosts:clone(costs),costs:clone(e?.costs||costs),materials:clone(result?.materials||result?.materialUids||[]),result:result?.ok===true&&!result?.partial?'RESUELTA':raw(result?.reason||result?.status||'NO RESUELTA'),resolutionStatus:result?.ok===true&&!result?.partial?'RESOLVED':result?.partial?'PARTIAL':'FAILED',legal:result?.ok===true,mechanicsProof:{exact:exact===true,source},ruleCertificate:{exact:exact===true,source},before,after:full666(st),turn:st?.turn,phase:st?.phase};
}
function add666(out,node,st,card,e,kind,result,targets=[],costs=[],exact=true,uid=null,source='ALPHA666'){
  if(!result?.ok||result?.partial)return;
  const a=record666(st,full666(node.st),card,e,kind,result,targets,costs,exact,uid,source);
  out.push({st,actions:[...arr(node.actions),a],score:score666(st),exactPath:node.exactPath!==false&&exact===true});
}
function proc666(c){const t=type666(c).toLowerCase();if(/synchro|sincro/.test(t))return'SYNCHRO';if(/xyz/.test(t))return'XYZ';if(/link|enlace/.test(t))return'LINK';return null}

function sets666(node,maxBranches,opts={}){
  const R=E(),st=node.st,z=st?.zones?.[0]||{},out=[],reasons=[],deadline=Number(opts.deadline)||Infinity,expired=()=>((performance.now?.()||Date.now())>=deadline);let complete=true,branches=0;
  if(arr(z.spelltrap).length<Math.max(1,Number(W.YGOAlpha800?.contract800?.(st?.formatKey||W.__YGO_ACTIVE_BAN_KEY)?.spellTrapZones)||5)){
    for(const it of arr(z.hand)){
      if(expired()){complete=false;reasons.push('SET_TIME_BUDGET');break}const c=it?.card||it;if(!isSpellTrap666(c))continue;
      if(branches++>=maxBranches){complete=false;reasons.push('SET_BRANCH_CAP');break}
      const ns=clone(st),m=move666(ns,it.uid,'spelltrap',0,{faceUp:false,position:'SET',setTurn:Number(ns.turn)||1});
      if(m)add666(out,node,ns,c,null,'SET SPELL/TRAP',{ok:true,status:'SET'},[],[],true,it.uid,'CORE_SET_666');
    }
  }
  if(st?.normalSummonAvailable?.[0]&&arr(z.monster).length<Math.max(1,Number(W.YGOAlpha800?.contract800?.(st?.formatKey||W.__YGO_ACTIVE_BAN_KEY)?.monsterZones)||5)){
    for(const it of arr(z.hand)){
      if(expired()){complete=false;reasons.push('SET_TIME_BUDGET');break}const c=it?.card||it;
      if(!isMonster666(c)||/cannot be normal summoned\/set|cannot be normal summoned or set|cannot be normal summoned|cannot be set/i.test(raw(c?.desc||c?.text||'')))continue;
      const lev=Number(c?.level)||0,need=lev>=7?2:lev>=5?1:0,cc=combos666(arr(z.monster).map(x=>x.uid),need,maxBranches);
      if(cc.truncated){complete=false;reasons.push('MONSTER_SET_TRIBUTE_CAP')}
      for(const trib of cc.rows){
        if(expired()){complete=false;reasons.push('SET_TIME_BUDGET');break}if(branches++>=maxBranches){complete=false;reasons.push('SET_BRANCH_CAP');break}
        const ns=clone(st),q=R.locate?.(ns,it.uid);if(!q)continue;
        const chk=R.summonCheck?.(ns,0,q.item,'NORMAL',trib)||{ok:true,tribute:need};if(!chk.ok||Number(chk.tribute??need)!==trib.length)continue;
        let legal=true;
        for(const u of trib){const tq=R.locate?.(ns,u);if(!tq||tq.z!=='monster'){legal=false;break}move666(ns,u,'gy',tq.item?.owner??0,{faceUp:true})}
        if(!legal)continue;
        const m=move666(ns,it.uid,'monster',0,{faceUp:false,position:'DEF',setTurn:Number(ns.turn)||1,summonType:'NORMAL_SET',summonTurn:Number(ns.turn)||1,summonPlayer:0,wasSummoned:false});if(!m)continue;
        ns.normalSummonAvailable=arr(ns.normalSummonAvailable).length?ns.normalSummonAvailable:[true,true];ns.normalSummonCount=arr(ns.normalSummonCount).length?ns.normalSummonCount:[0,0];const unlimitedNormal=!!W.YGOAlpha800?.contract800?.(ns?.formatKey||W.__YGO_ACTIVE_BAN_KEY)?.unlimitedNormal;ns.normalSummonAvailable[0]=unlimitedNormal?true:false;ns.normalSummonCount[0]=(Number(ns.normalSummonCount[0])||0)+1;
        add666(out,node,ns,c,null,'NORMAL SET',{ok:true,status:'NORMAL_SET',materials:trib},[],trib,true,it.uid,'CORE_NORMAL_SET_666');
      }
      if(branches>=maxBranches)break;
    }
  }
  return{nodes:out,complete,reasons:[...new Set(reasons)]};
}
function extra666(node,maxBranches,opts={}){
  const R=E(),st=node.st,z=st?.zones?.[0]||{},field=arr(z.monster).filter(x=>x?.faceUp!==false),out=[],reasons=[],deadline=Number(opts.deadline)||Infinity,expired=()=>((performance.now?.()||Date.now())>=deadline);let complete=true,branches=0;
  if(arr(z.monster).length>=Math.max(1,Number(W.YGOAlpha800?.contract800?.(st?.formatKey||W.__YGO_ACTIVE_BAN_KEY)?.monsterZones)||5))return{nodes:[],complete:true,reasons:[]};
  for(const it of arr(z.extra)){
    if(expired()){complete=false;reasons.push('EXTRA_TIME_BUDGET');break}const c=it?.card||it,proc=proc666(c);
    if(!proc){
      const t=type666(c),d=raw(c?.desc||c?.text||'');
      if(/fusion/i.test(t)&&/must (?:first )?be special summoned[^.]{0,160}\bby\b|special summon this card[^.]{0,160}\bby\b/i.test(d)){complete=false;reasons.push('CONTACT_FUSION_PROCEDURE_NOT_ENUMERATED')}
      continue;
    }
    for(let k=1;k<=field.length;k++){
      if(expired()){complete=false;reasons.push('EXTRA_TIME_BUDGET');break}const cc=combos666(field.map(x=>x.uid),k,Math.max(1,maxBranches-branches));if(cc.truncated){complete=false;reasons.push('EXTRA_MATERIAL_COMBINATION_CAP')}
      for(const mats of cc.rows){
        if(expired()){complete=false;reasons.push('EXTRA_TIME_BUDGET');break}if(branches++>=maxBranches){complete=false;reasons.push('EXTRA_PROCEDURE_BRANCH_CAP');break}
        const ns=clone(st),r=R.performSpecialSummon?.(ns,0,it.uid,proc,mats);
        if(r?.ok)add666(out,node,ns,c,null,`${proc} SUMMON`,{...r,materials:mats},[],[],true,it.uid,'CORE_EXTRA_PROCEDURE_666');
      }
      if(branches>=maxBranches)break;
    }
    if(branches>=maxBranches)break;
  }
  const pend=[...arr(z.hand),...arr(z.extra)].some(x=>/pendulum/i.test(type666(x?.card||x))),scales=arr(z.spelltrap).filter(x=>x?.faceUp!==false&&/pendulum/i.test(type666(x?.card||x))).length;
  if(pend&&scales>=2){complete=false;reasons.push('PENDULUM_SUMMON_ENUMERATION_NOT_PUBLIC')}
  return{nodes:out,complete,reasons:[...new Set(reasons)]};
}
function direct666(node,maxBranches,opts={}){
  const R=E(),st=node.st,z=st?.zones?.[0]||{},out=[],reasons=[],deadline=Number(opts.deadline)||Infinity,expired=()=>((performance.now?.()||Date.now())>=deadline);let complete=true,branches=0;
  for(const it of arr(z.hand)){
    if(expired()){complete=false;reasons.push('DIRECT_TIME_BUDGET');break}if(norm(name666(it?.card||it))!=='mulcharmy fuwalos')continue;
    const fn=R.alpha335ApplyFuwalos||W.YGOAlpha322?.applyFuwalos;
    if(typeof fn!=='function'){complete=false;reasons.push('EXACT_HANDLER_UNAVAILABLE_FUWALOS');continue}
    if(branches++>=maxBranches){complete=false;reasons.push('DIRECT_EXACT_BRANCH_CAP');break}
    const ns=clone(st),r=fn(ns,0);
    if(r?.ok)add666(out,node,ns,it.card||it,{id:1,raw:'If you control no cards (Quick Effect): You can discard this card.'},'EFECTO',r,[],[],true,it.uid,'ALPHA335_FUWALOS');
  }
  const fallen=[...arr(z.hand),...arr(z.spelltrap)].filter(x=>norm(name666(x?.card||x))==='the fallen the virtuous'),handler=W.YGOAlpha340?.fallenVirtuous;
  if(fallen.length&&typeof handler!=='function'){complete=false;reasons.push('EXACT_HANDLER_UNAVAILABLE_FALLEN_VIRTUOUS')}
  if(typeof handler==='function'){
    for(const src of fallen){
      if(expired()){complete=false;reasons.push('DIRECT_TIME_BUDGET');break}const extra=arr(z.extra).filter(x=>/fallen of albaz/i.test(raw(x?.card?.desc||x?.desc||''))),field=[];
      for(let p=0;p<2;p++)for(const zone of ['monster','spelltrap'])for(const x of arr(st.zones?.[p]?.[zone]))if(x?.faceUp!==false)field.push(x);
      for(const ex of extra){
        if(expired()){complete=false;reasons.push('DIRECT_TIME_BUDGET');break}for(const tg of field){
          if(expired()){complete=false;reasons.push('DIRECT_TIME_BUDGET');break}if(branches++>=maxBranches){complete=false;reasons.push('DIRECT_EXACT_BRANCH_CAP');break}
          const ns=clone(st),r=handler(ns,0,{sourceUid:src.uid,mode:'destroy',extraUid:ex.uid,targetUid:tg.uid});
          if(r?.ok)add666(out,node,ns,src.card||src,{id:'destroy',raw:'Activate 1 of these effects'},'ACTIVATE',r,[ex.uid,tg.uid],[],true,src.uid,'ALPHA340_FALLEN_VIRTUOUS_DESTROY');
        }
        if(branches>=maxBranches)break;
      }
      if(branches>=maxBranches)break;
      const gy=[];for(let p=0;p<2;p++)for(const x of arr(st.zones?.[p]?.gy))if(isMonster666(x?.card||x))gy.push(x);
      for(const tg of gy){
        if(expired()){complete=false;reasons.push('DIRECT_TIME_BUDGET');break}if(branches++>=maxBranches){complete=false;reasons.push('DIRECT_EXACT_BRANCH_CAP');break}
        const ns=clone(st),r=handler(ns,0,{sourceUid:src.uid,mode:'revive',targetUid:tg.uid});
        if(r?.ok)add666(out,node,ns,src.card||src,{id:'revive',raw:'Activate 1 of these effects'},'ACTIVATE',r,[tg.uid],[],true,src.uid,'ALPHA340_FALLEN_VIRTUOUS_REVIVE');
      }
      if(branches>=maxBranches)break;
    }
  }
  return{nodes:out,complete,reasons:[...new Set(reasons)]};
}

function enumerateNode666(node,opts={}){
  const R=E(),maxBranches=Math.max(8,Number(opts.maxActionBranches)||4096),nodeBudgetMs=Math.max(4,Math.min(250,Number(opts.nodeBudgetMs)||35)),nodeStarted=performance.now?.()||Date.now(),nodeExpired=()=>((performance.now?.()||Date.now())-nodeStarted)>=nodeBudgetMs;
  const pending=arr(node?.st?.pendingTriggers).length+arr(node?.st?.triggerQueue).length;
  if(pending){
    const base=A655.__alpha664BaseEnumerate||A655.__alpha666TriggerBase;
    if(typeof base==='function')return base(node,{maxActionBranches:maxBranches});
    return{nodes:[],complete:false,reasons:['TRIGGER_ENUMERATOR_UNAVAILABLE']};
  }
  const st=node.st,z=st?.zones?.[0]||{},out=[],reasons=[];let complete=true;const remainingBranches=()=>Math.max(0,maxBranches-out.length),budgetStop=()=>{if(out.length>=maxBranches){complete=false;reasons.push('ACTION_GLOBAL_BRANCH_CAP');return true}if(nodeExpired()){complete=false;reasons.push('NODE_TIME_BUDGET');return true}return false};
  for(const item of arr(z.hand)){
    const c=item?.card||item;if(!isMonster666(c)||!st?.normalSummonAvailable?.[0])continue;
    const lev=Number(c?.level)||0,need=lev>=7?2:lev>=5?1:0,cc=combos666(arr(z.monster).map(x=>x.uid),need,maxBranches);
    if(cc.truncated){complete=false;reasons.push('NORMAL_TRIBUTE_BRANCH_CAP')}
    for(const trib of cc.rows){if(budgetStop())break;const ns=clone(st),r=R.performNormalSummon?.(ns,0,item.uid,trib);if(r?.ok)add666(out,node,ns,c,null,'NORMAL SUMMON',r,[],trib,true,item.uid,'CORE_NORMAL_SUMMON_666')}
  }
  for(const fn of [sets666,extra666,direct666]){if(budgetStop())break;const remaining=Math.max(1,remainingBranches()),part=fn(node,remaining,{deadline:nodeStarted+nodeBudgetMs});if(!part)continue;out.push(...arr(part.nodes).slice(0,remaining));if(arr(part.nodes).length>remaining){complete=false;reasons.push('ACTION_GLOBAL_BRANCH_CAP')}if(!part.complete){complete=false;reasons.push(...arr(part.reasons))}}
  const sources=[...arr(z.hand),...arr(z.monster),...arr(z.spelltrap)];
  for(const item of sources){
    if(budgetStop())break;const q0=R.locate?.(st,item.uid);if(!q0||(q0.z==='monster'&&q0.item?.faceUp===false))continue;
    const c=q0.item?.card||item.card||item,effects=arr(safeParse666(c)?.effects);
    for(const e of effects){
      if(budgetStop())break;if(e?.semantic?.continuous||e?.nonActivatable||e?.timing?.trigger)continue;
      const remaining=Math.max(1,remainingBranches()),tg=targets666(st,e,remaining,0,item.uid),targetRows=arr(tg.rows),costBudget=Math.max(1,Math.floor(remaining/Math.max(1,targetRows.length))),cg=costs666(st,e,costBudget,0,item.uid);
      if(!tg.complete||!cg.complete){complete=false;reasons.push(...tg.reasons,...cg.reasons)}
      let branch=0;
      for(const targets of tg.rows){
        if(budgetStop())break;for(const costs of cg.rows){
          if(budgetStop()){reasons.push('ACTION_CROSS_PRODUCT_CAP');break}if(branch++>=remaining){complete=false;reasons.push('ACTION_CROSS_PRODUCT_CAP');break}
          const ns=clone(st),q=R.locate?.(ns,item.uid);if(!q)continue;
          const activation=R.activate?.(ns,0,q.item.card||c,item.uid,e.id,targets,costs);if(!activation?.ok)continue;
          let rr=R.resolveTop?.(ns),guard=0;while(rr?.ok&&arr(ns.chain).length&&guard++<32)rr=R.resolveTop?.(ns);
          if(!rr?.ok||rr?.partial){if(rr?.partial){complete=false;reasons.push('PARTIAL_RESOLUTION')}continue}
          const exact=exact666(c,e.id);if(!exact){complete=false;reasons.push('UNPROVEN_EFFECT_TRANSITION')}
          add666(out,node,ns,q.item.card||c,e,'EFECTO',rr,targets,costs,exact,item.uid,'EXACT_RULE_REGISTRY_666');
        }
        if(branch>=remaining||out.length>=maxBranches||nodeExpired())break;
      }
    }
  }
  const seen=new Map();
  for(const n of out){let k;try{k=JSON.stringify(n.st)+'|'+arr(n.actions).map(a=>`${a.card}:${a.effectId??a.actionType}:${arr(a.selectedTargets).join(',')}`).join('>')}catch(_){k=String(seen.size)}if(!seen.has(k)||Number(n.score)>Number(seen.get(k)?.score))seen.set(k,n)}
  let finalNodes=[...seen.values()];
  try{if(typeof W.YGOAlpha800?.stateWithin800==='function'){const beforeN=finalNodes.length;finalNodes=finalNodes.filter(n=>W.YGOAlpha800.stateWithin800(n?.st).pass!==false);if(finalNodes.length<beforeN){complete=false;reasons.push('FORMAT_ZONE_LIMIT_FILTERED_CANONICAL')}}}catch(_){}
  if(finalNodes.length>maxBranches){complete=false;reasons.push('ACTION_GLOBAL_BRANCH_CAP');finalNodes=finalNodes.slice(0,maxBranches)}if(nodeExpired()){complete=false;reasons.push('NODE_TIME_BUDGET')}return{nodes:finalNodes,complete,reasons:[...new Set(reasons)],nodeElapsedMs:Math.round(((performance.now?.()||Date.now())-nodeStarted)*10)/10,nodeBudgetMs,maxBranches};
}
function sig666(n){try{return JSON.stringify(n.st)+'|'+arr(n.actions).map(a=>`${a.card}:${a.effectId??a.actionType}:${arr(a.selectedTargets).join(',')}:${arr(a.selectedCosts).join(',')}`).join('>')}catch(_){return raw(Math.random())}}
function board666(st){const z=st?.zones?.[0]||{},cp=k=>clone(arr(z[k]));return{monsters:cp('monster'),spelltrap:cp('spelltrap'),gy:cp('gy'),banished:cp('banished'),hand:cp('hand'),extra:cp('extra')}}
function line666(n,opening){const finalBoard=board666(n.st),v=Math.max(0,Math.min(100,Math.round(n.score))),l={actions:n.actions,score:v,finalScore:v,state:n.st,finalBoard,simulation:{state:n.st,openingHand:clone(opening),actions:n.actions,executed:n.actions.map(a=>a.card),legal:true,finalBoard}};try{l.alpha651Proof=W.YGOAlpha651?.proof651?.(l)||null}catch(_){}return l}
function exhaustiveOpeningSearch666(opts={}){
  const sample=Math.max(0,Number(opts.sample)||0),maxDepth=Math.max(1,Math.min(10,Number(opts.maxDepth)||4)),maxStates=Math.max(100,Math.min(250000,Number(opts.maxStates)||25000)),maxActionBranches=Math.max(32,Math.min(20000,Number(opts.maxActionBranches)||4096)),base=A655.openingState655?.(sample);
  if(!base)return{version:VERSION,pass:false,status:'NO_OPENING_STATE'};
  const opening=arr(base.zones?.[0]?.hand).map(x=>({name:x?.card?.name,id:x?.card?.id||null,card:clone(x?.card)}));
  let frontier=[{st:base,actions:[],score:score666(base),exactPath:true}],finals=[],expanded=0,truncated=false,domainComplete=true;const reasons=[],depthRows=[];
  for(let depth=0;depth<maxDepth;depth++){
    const next=[];let generated=0;
    for(const node of frontier){
      if(expanded++>=maxStates){truncated=true;reasons.push('STATE_CAP');break}
      const r=enumerateNode666(node,{maxActionBranches});domainComplete=domainComplete&&r.complete!==false;reasons.push(...r.reasons);generated+=r.nodes.length;
      if(!r.nodes.length)finals.push(node);else next.push(...r.nodes);
    }
    depthRows.push({depth,frontier:frontier.length,generated,totalExpanded:expanded});
    if(truncated){frontier=next;break}
    frontier=next;if(!frontier.length)break;
  }
  finals.push(...frontier);
  const uniq=new Map();for(const n of finals){const k=sig666(n);if(!uniq.has(k)||n.score>uniq.get(k).score)uniq.set(k,n)}
  const ranked=[...uniq.values()].sort((a,b)=>b.score-a.score||arr(b.actions).length-arr(a.actions).length),lines=ranked.slice(0,5).map(n=>line666(n,opening)),allExact=ranked.every(n=>n.exactPath!==false),frontierExhausted=!truncated&&frontier.length===0,horizonReached=!truncated&&depthRows.length===maxDepth,domainExhaustedOptimalityProven=frontierExhausted&&domainComplete&&allExact,horizonOptimalityProven=horizonReached&&domainComplete&&allExact;
  const cert={version:VERSION,sample,maxDepth,maxStates,maxActionBranches,statesExpanded:expanded,terminalOrHorizonStates:ranked.length,frontierExhausted,horizonReached,mainPhaseExhausted:frontierExhausted,domainExhaustedOptimalityProven,allLegalActionsEnumerated:domainComplete,allTransitionsExact:allExact,stateDominanceSafe:true,stateDominanceUsed:false,objective:'Alpha604 score-state objective over exact state',objectiveComplete:true,targetChoiceEnumerationComplete:!reasons.some(x=>/TARGET_.*CAP|DIRECT_EXACT_BRANCH_CAP/.test(x)),horizonOptimalityProven,globalOptimalityProven:false,status:horizonOptimalityProven?'HORIZON_OPTIMAL_PROVEN':'BOUNDED_EXHAUSTIVE_INCOMPLETE',truncated,reasons:[...new Set(reasons)],policy:'Optimalidad demostrada sólo dentro de la mano, dominio enumerado y profundidad indicada. Nunca implica optimalidad global.'};
  W.__YGO666_LAST_EXHAUSTIVE={certificate:cert,lines,depthRows};W.__YGO655_LAST_EXHAUSTIVE=W.__YGO666_LAST_EXHAUSTIVE;return{version:VERSION,pass:horizonOptimalityProven,certificate:cert,lines,depthRows};
}
function selfTest666(){
  const R=E(),normal=safeParse666({name:'Blue-Eyes White Dragon',type:'Normal Monster',desc:'This legendary dragon is a powerful engine of destruction.'}),cost=safeParse666({name:'Test',type:'Normal Spell',desc:'Discard 1; draw 1 card.'}),modal=safeParse666({name:'Modal',type:'Quick-Play Spell',desc:'Activate 1 of these effects; ● Draw 1 card; ● Destroy 1 card.'});
  const checks={normal:arr(normal.effects).every(e=>e.nonActivatable===true),cost:arr(cost.effects).some(e=>norm(e.activation)==='discard 1'&&/\bdraw\b/i.test(raw(e.resolution))&&e.nonActivatable===true&&/COST|DISCARD/.test(raw(e.nonActivatableReason))&&arr(e.costs).every(x=>x.kind!=='DISCARD')),modal:arr(modal.effects).some(e=>/activate 1 of these effects/i.test(raw(e.raw||e.resolution))&&e.nonActivatable),engine:typeof R.activate==='function'&&typeof R.resolveTop==='function',catalog:arr(W.CARD_CATALOG).length>=19617};
  return{version:VERSION,pass:Object.values(checks).every(Boolean),checks};
}
function install666(){if(!A655.__alpha666TriggerBase)A655.__alpha666TriggerBase=A655.__alpha664BaseEnumerate||A655.enumerateNode655;A655.enumerateNode655=enumerateNode666;A655.exhaustiveOpeningSearch655=exhaustiveOpeningSearch666;if(W.YGOApp)W.YGOApp.exhaustiveSearch=exhaustiveOpeningSearch666;return true}
function audit666(){install666();const self=selfTest666(),fixture=A654.embeddedCorpusCertificate654?.()||{pass:false},rules=A644.rulesAudit644?.()||{pass:false},score=A656.scoreContract656?.({main:[],extra:[],side:[]})||{pass:false};const checks={self:self.pass,fixture:fixture.pass===true,rules:rules.pass===true&&Number(rules.total)>=40,score:score.pass===true,catalog:arr(W.CARD_CATALOG).length>=19617,ui:!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck')&&!!D.querySelector('.diana-center-zone')};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,self,fixture,rules,score}}
function completionAudit666(){const audit=audit666(),last=W.__YGO666_LAST_EXHAUSTIVE?.certificate||null,external=W.__YGO620_EXTERNAL_BROWSER_CERT||{pass:false,status:'EXTERNAL_BROWSER_REQUIRED'};return{version:VERSION,internalPass:audit.pass,horizonOptimalityPass:last?.horizonOptimalityProven===true,globalOptimalityPass:false,universalPass:false,status:audit.pass?'CORE_666_DYNAMIC_ENGINE_EXHAUSTIVE_GLOBAL_OPTIMALITY_OPEN':'INTERNAL_GATES_OPEN',audit,boundedExhaustive:last,external,remaining:{globalOptimality:true,realBrowser:external.pass!==true,universalExactRules:true,partialFormats:true,scoringCausalComplete:false,legacyPhysicalPrune:true}}}
function claim(){try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO666_VERSION_WRITE={value:raw(v),at:Date.now()}}})}catch(_){}try{D.title=TITLE}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}if(W.YGOApp)W.YGOApp.version=VERSION}
const API={VERSION,safeParse666,targets666,costs666,exact666,sets666,extra666,direct666,enumerateNode666,exhaustiveOpeningSearch666,selfTest666,install666,audit666,completionAudit666};
W.YGOAlpha666=API;install666();claim();if(W.YGOApp){W.YGOApp.release666=API;W.YGOApp.runtimeAudit=API}D.documentElement.dataset.alpha666='dynamic-engine-exhaustive-enumerator';
})();

