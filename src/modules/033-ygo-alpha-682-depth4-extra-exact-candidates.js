
(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 682',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_682';
const A669=W.YGOAlpha669||{},A681=W.YGOAlpha681||{};
const arr=v=>Array.isArray(v)?v:[],raw=v=>String(v??''),clone=x=>structuredClone(x);
const typ=x=>raw(x?.card?.type||x?.type||x?.card?.frameType||x?.frameType).toLowerCase();
const lev=x=>Number(x?.card?.level??x?.level)||0;
const rank=x=>Number(x?.card?.rank??x?.rank)||0;
const linkv=x=>Number(x?.card?.linkval??x?.linkval??x?.card?.link??x?.link)||0;
const nameOf=x=>raw(x?.card?.name||x?.name||'');
function full(st){return typeof W.YGOAlpha604?.fullState604==='function'?W.YGOAlpha604.fullState604(st):clone(st)}
function score(st){const a=st?.analysis||{},z=st?.zones?.[0]||{};return(Number(a.successfulSummons)||0)*8+(Number(a.successfulActivations)||0)*5+(Number(a.searches)||0)*7+(Number(a.draws)||0)*4+(Number(a.negates)||0)*10+(Number(a.removals)||0)*7+arr(z.monster).length*6+arr(z.spelltrap).length*3}
function subsets(xs){const out=[];const n=xs.length;if(n>12)return out;for(let m=1;m<(1<<n);m++){const r=[];for(let i=0;i<n;i++)if(m>>i&1)r.push(xs[i]);out.push(r)}return out}
function linkValueOfMaterial(x){const t=typ(x);return /link/.test(t)?Math.max(1,linkv(x)):1}
function linkSums(ms,target){let sums=new Set([0]);for(const x of ms){const next=new Set(sums),v=linkValueOfMaterial(x);for(const s of sums){next.add(s+1);if(v>1)next.add(s+v)}sums=next}return sums.has(target)}
function candidates682(c,field){
 const t=typ(c),desc=raw(c?.card?.desc||c?.desc||c?.card?.text||c?.text),line=(desc.split(/\n/)[0]||'').trim(),all=subsets(field);
 if(/link/.test(t)){
   const L=linkv(c);let min=1;const mm=line.match(/^\s*(\d+)\+?\s+/);if(mm)min=Number(mm[1]);
   return all.filter(ms=>ms.length>=min&&(!L||linkSums(ms,L)));
 }
 if(/synchro/.test(t)){
   const L=lev(c);if(!L)return all;
   return all.filter(ms=>{if(ms.length<2)return false;let sum=0,tun=0;for(const x of ms){sum+=lev(x);if(/tuner|afinador/i.test(typ(x)+' '+raw(x?.card?.desc||x?.desc)))tun++}return sum===L&&tun>=1&&tun<ms.length});
 }
 if(/xyz/.test(t)){
   const m=line.match(/^\s*(\d+)\+?\s+Level\s+(\d+)/i);if(m){const need=Number(m[1]),lvl=Number(m[2]);return all.filter(ms=>ms.length>=need&&ms.every(x=>lev(x)===lvl))}
   const Rk=rank(c)||lev(c);if(!Rk)return all;return all.filter(ms=>ms.length>=2&&ms.every(x=>lev(x)===Rk));
 }
 return null;
}
function install682(){
 A681.install681?.();
 const A666=W.YGOAlpha666,R=W.YGORulingEngine;
 if(A666&&R&&typeof A666.extra666==='function'&&!A666.extra666.__alpha682ExactCandidates){
   const old=A666.extra666.bind(A666);
   const fn=function(node,maxBranches){
     const st=node?.st,z=st?.zones?.[0]||{},field=arr(z.monster).filter(x=>x?.faceUp!==false),out=[],reasons=[];let complete=true,branches=0;
     if(arr(z.monster).length>=Math.max(1,Number(W.YGOAlpha800?.contract800?.(st?.formatKey||W.__YGO_ACTIVE_BAN_KEY)?.monsterZones)||5))return{nodes:[],complete:true,reasons:[]};
     for(const it of arr(z.extra)){
       const c=it?.card||it,t=typ(c),desc=raw(c?.desc||c?.text),proc=/link/.test(t)?'LINK':/synchro/.test(t)?'SYNCHRO':/xyz/.test(t)?'XYZ':null;
       if(!proc){
         if(/fusion/.test(t)&&/must (?:first )?be special summoned[^.]{0,160}\bby\b|special summon this card[^.]{0,160}\bby\b/i.test(desc)){complete=false;reasons.push('CONTACT_FUSION_PROCEDURE_NOT_ENUMERATED')}
         continue;
       }
       const rows=candidates682(c,field);if(!rows)continue;
       for(const ms of rows){
         if(branches++>=maxBranches){complete=false;reasons.push('EXTRA_PROCEDURE_BRANCH_CAP');break}
         const mats=ms.map(x=>x.uid),ns=clone(st),rr=R.performSpecialSummon?.(ns,0,it.uid,proc,mats);if(!rr?.ok)continue;
         const action={card:nameOf(c)||'Carta',cardId:Number(c?.id)||null,effectId:null,sourceUid:it.uid,actionType:`${proc} SUMMON`,effectText:'',activationText:'',conditionText:'',selectedTargets:[],targets:[],selectedCosts:[],costs:[],materials:clone(mats),result:'RESUELTA',resolutionStatus:'RESOLVED',legal:true,mechanicsProof:{exact:true,source:'ALPHA682_EXTRA_CANDIDATE'},ruleCertificate:{exact:true,source:'ALPHA682_EXTRA_CANDIDATE'},before:full(st),after:full(ns),turn:ns?.turn,phase:ns?.phase};
         out.push({st:ns,actions:[...arr(node.actions),action],score:score(ns),exactPath:node.exactPath!==false});
       }
       if(branches>=maxBranches)break;
     }
     const pend=[...arr(z.hand),...arr(z.extra)].some(x=>/pendulum/i.test(typ(x))),scales=arr(z.spelltrap).filter(x=>x?.faceUp!==false&&/pendulum/i.test(typ(x))).length;
     if(pend&&scales>=2){complete=false;reasons.push('PENDULUM_SUMMON_ENUMERATION_NOT_PUBLIC')}
     return{nodes:out,complete,reasons:[...new Set(reasons)]};
   };
   fn.__alpha682ExactCandidates=true;fn.__base=old;A666.extra666=fn;
 }
 if(W.YGOAlpha655){W.YGOAlpha655.enumerateNode655=A669.enumerateNode669;W.YGOAlpha655.exhaustiveOpeningSearch655=A669.exhaustiveOpeningSearch669}
 if(W.YGOApp)W.YGOApp.exhaustiveSearch=A669.exhaustiveOpeningSearch669;
 return true;
}
function selfTest682(){install682();
 const st={activePlayer:0,phase:'MAIN 1'},card={name:'Yummyusment☆Mignon',type:'Field Spell',desc:'"Yummy" monsters you control gain 500 ATK for each LIGHT Beast monster on the field. You can only use each of the following effects of "Yummyusment☆Mignon" once per turn. If you control a Link-1 monster: You can target 1 Level 1 "Yummy" monster in your GY; Special Summon it. If this card is in your GY: You can target 2 "Yummy" monsters in your GY and/or banishment; place this card, and them, on the bottom of the Deck in any order.'};
 const p=A669.localParse669?.(card,st,0),es=arr(p?.effects),passive=es.find(e=>/gain 500 atk for each light beast monster/.test(raw(e.raw||e.resolution).toLowerCase()));
 const checks={mignonPassive:passive?.nonActivatable===true&&passive?.semantic?.continuous===true,extraPatched:W.YGOAlpha666?.extra666?.__alpha682ExactCandidates===true,search:typeof A669.exhaustiveOpeningSearch669==='function',catalog:arr(W.CARD_CATALOG).length>=19617};
 return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,passive:passive&&{raw:passive.raw,reason:passive.nonActivatableReason}};
}
function audit682(){const self=selfTest682(),checks={self:self.pass,catalog:arr(W.CARD_CATALOG).length>=19617,score10x10:W.YGOOfficialEvaluation?.pointsPerCategory===10&&W.YGOOfficialEvaluation?.max===100,ui:!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck')&&!!D.querySelector('.diana-center-zone')};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,self}}
function completionAudit682(){const audit=audit682(),last=W.__YGO669_LAST_EXHAUSTIVE?.certificate||null,external=W.__YGO620_EXTERNAL_BROWSER_CERT||{pass:false,status:'EXTERNAL_BROWSER_REQUIRED'};return{version:VERSION,internalPass:audit.pass,boundedOptimalityPass:last?.horizonOptimalityProven===true,globalOptimalityPass:false,universalPass:false,status:audit.pass?'CORE_682_YUMMY_PASSIVE_EXTRA_CANDIDATES_DEPTH4_REVALIDATION':'INTERNAL_GATES_OPEN',audit,boundedExhaustive:last,external,remaining:{depth4Matrix:true,depth5Matrix:true,fusionRitualPendulumExhaustive:true,battlePhaseExhaustive:true,globalOptimality:true,realBrowser:external.pass!==true,universalExactRules:true,partialFormats:true,scoringCausalComplete:false,legacyPhysicalPrune:true}}}
function claim(){try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO682_VERSION_WRITE={value:v,at:Date.now()}}})}catch(_){}try{D.title=TITLE}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}if(W.YGOApp)W.YGOApp.version=VERSION}
const API={VERSION,candidates682,install682,selfTest682,audit682,completionAudit682};W.YGOAlpha682=API;install682();claim();if(W.YGOApp){W.YGOApp.release682=API;W.YGOApp.runtimeAudit=API}D.documentElement.dataset.alpha682='yummy-passive-extra-exact-candidates';
})();
