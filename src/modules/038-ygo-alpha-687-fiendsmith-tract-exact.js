
(()=>{'use strict';
const W=window,D=document,A686=W.YGOAlpha686||{},A666=W.YGOAlpha666||{},A336=W.YGOAlpha336||{},A604=W.YGOAlpha604||{},VERSION='Alpha 687',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_688';
const arr=v=>Array.isArray(v)?v:[],raw=v=>String(v??''),clone=x=>{try{return structuredClone(x)}catch(_){try{return JSON.parse(JSON.stringify(x))}catch(__){return x}}};
const norm=s=>raw(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").replace(/[“”]/g,'"').replace(/[^a-z0-9]+/g,' ').trim();
const nameOf=x=>raw(x?.card?.name||x?.name||x), cardOf=x=>x?.card||x;
const R=()=>W.YGORulingEngine||{};
const BASE_SEARCH=typeof A686.exhaustiveOpeningSearch686==='function'?A686.exhaustiveOpeningSearch686.bind(A686):null;
const BASE_DIRECT=typeof A666.direct666==='function'?A666.direct666.bind(A666):null;
function score687(st){const a=st?.analysis||{},z=st?.zones?.[0]||{};return(Number(a.successfulSummons)||0)*8+(Number(a.successfulActivations)||0)*5+(Number(a.searches)||0)*7+(Number(a.draws)||0)*4+(Number(a.negates)||0)*10+(Number(a.removals)||0)*7+arr(z.monster).length*6+arr(z.spelltrap).length*3}
function full687(st){return typeof A604.fullState604==='function'?A604.fullState604(st):clone(st)}
function add687(out,node,st,card,e,result,discardUid,targetUid,sourceUid){const action={card:nameOf(card),cardId:Number(card?.id)||null,effectId:1,sourceUid,actionType:'ACTIVATE',effectText:e.raw,activationText:'',conditionText:'',selectedTargets:[targetUid],targets:[targetUid],selectedCosts:[discardUid],costs:[],materials:[],result:'RESUELTA',resolutionStatus:'RESOLVED',legal:true,mechanicsProof:{exact:true,source:'ALPHA336_TRACT_EXACT'},ruleCertificate:{exact:true,source:'ALPHA336_TRACT_EXACT'},before:full687(node.st),after:full687(st),turn:st?.turn,phase:st?.phase};out.push({st,actions:[...arr(node.actions),action],score:score687(st),exactPath:node.exactPath!==false})}
function isLightFiend(x){const c=cardOf(x);return raw(c?.attribute).toUpperCase()==='LIGHT'&&/fiend/i.test(raw(c?.race||c?.type))}
function direct687(node,maxBranches=4096){const base=BASE_DIRECT?BASE_DIRECT(node,maxBranches):{nodes:[],complete:true,reasons:[]},out=[...arr(base?.nodes)],reasons=[...arr(base?.reasons)];let complete=base?.complete!==false,branches=0;const st=node?.st,z=st?.zones?.[0]||{},handler=A336.tract;if(typeof handler!=='function'){return{nodes:out,complete:false,reasons:[...new Set([...reasons,'EXACT_HANDLER_UNAVAILABLE_FIENDSMITH_TRACT'])]}}
 for(const src of arr(z.hand).filter(x=>norm(nameOf(x))==='fiendsmith s tract')){
   const targets=arr(z.deck).filter(isLightFiend);
   for(const tg of targets){
     // "then discard 1 card": después de añadir, puede descartarse cualquier carta restante en mano o la carta añadida.
     const discardUids=[...arr(z.hand).filter(x=>String(x.uid)!==String(src.uid)).map(x=>x.uid),tg.uid];
     for(const duid of [...new Set(discardUids.map(String))]){
       if(branches++>=maxBranches){complete=false;reasons.push('FIENDSMITH_TRACT_687_BRANCH_CAP');break}
       const ns=clone(st),RR=R(),sq=RR.locate?.(ns,src.uid);if(!sq||sq.z!=='hand')continue;
       // Simula la colocación/activación de la Normal Spell antes de resolver su handler exacto.
       const moved=RR.alpha314Relocate?.(ns,src.uid,'spelltrap',{type:'SPELL_ACTIVATE',sourcePlayer:0,sourceUid:src.uid});
       if(!moved?.ok||moved?.cancelled)continue;
       const rr=handler(ns,0,{mode:'search',sourceUid:src.uid,targetUid:tg.uid,discardUid:duid});
       if(!rr?.ok)continue;
       add687(out,node,ns,cardOf(src),{raw:'Add 1 LIGHT Fiend monster from your Deck to your hand, then discard 1 card.'},rr,duid,tg.uid,src.uid);
     }
     if(branches>=maxBranches)break;
   }
   if(branches>=maxBranches)break;
 }
 return{nodes:out,complete,reasons:[...new Set(reasons)]};
}
function markTractDeck687(){const changed=[];for(const zone of ['main','extra','side'])for(const row of arr(W.deckState?.[zone])){if(norm(nameOf(row))!=='fiendsmith s tract')continue;const c=row?.card||row;if(!c)continue;changed.push({c,desc:c.desc,text:c.text});if(typeof c.desc==='string')c.desc=c.desc+'\n[ALPHA687_EXACT_TRACT_ROUTING]';else if(typeof c.text==='string')c.text=c.text+'\n[ALPHA687_EXACT_TRACT_ROUTING]';}return()=>{for(const x of changed){if(x.desc!==undefined)x.c.desc=x.desc;if(x.text!==undefined)x.c.text=x.text}}}
function exhaustiveOpeningSearch687(opts={}){if(typeof BASE_SEARCH!=='function')return{version:VERSION,pass:false,status:'BASE_EXHAUSTIVE_UNAVAILABLE'};const RR=R(),oldDirect=A666.direct666,desc=Object.getOwnPropertyDescriptor(RR,'parseCard'),restoreDeck=markTractDeck687();let oldParse=null;try{oldParse=RR.parseCard}catch(_){}
 try{
   A666.direct666=direct687;
   if(desc?.configurable&&typeof oldParse==='function')Object.defineProperty(RR,'parseCard',{configurable:true,enumerable:desc.enumerable!==false,writable:true,value:function(card,...args){const p=oldParse.call(RR,card,...args);if(norm(nameOf(card))!=='fiendsmith s tract'||!p)return p;return{...p,effects:arr(p.effects).map(e=>({...e,nonActivatable:true,nonActivatableReason:'EXACT_DIRECT_FIENDSMITH_TRACT_687',alpha687ExactDispatch:true}))}}});
   const out=BASE_SEARCH(opts);if(out?.certificate){out.certificate={...out.certificate,version:VERSION,fiendsmithTractExact:true,globalOptimalityProven:false};}out.version=VERSION;W.__YGO687_LAST_EXHAUSTIVE=out;return out;
 }finally{A666.direct666=oldDirect;restoreDeck();try{if(desc)Object.defineProperty(RR,'parseCard',desc)}catch(_){}}
}
function selfTest687(){const checks={base:typeof BASE_SEARCH==='function',direct:typeof direct687==='function',handler:typeof A336.tract==='function',parserConfigurable:Object.getOwnPropertyDescriptor(R(),'parseCard')?.configurable===true,catalog:(W.CARD_CATALOG?.length||0)>=19617};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks}}
function install687(){if(W.YGOAlpha669)W.YGOAlpha669.exhaustiveOpeningSearch669=exhaustiveOpeningSearch687;if(W.YGOAlpha655)W.YGOAlpha655.exhaustiveOpeningSearch655=exhaustiveOpeningSearch687;if(W.YGOApp)W.YGOApp.exhaustiveSearch=exhaustiveOpeningSearch687;return true}
function audit687(){install687();const self=selfTest687();return{version:VERSION,pass:self.pass,self,ui:!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck')&&!!D.querySelector('.diana-center-zone'),score10x10:W.YGOOfficialEvaluation?.pointsPerCategory===10&&W.YGOOfficialEvaluation?.max===100}}
function completionAudit687(){const audit=audit687(),last=W.__YGO687_LAST_EXHAUSTIVE?.certificate||null,external=W.__YGO620_EXTERNAL_BROWSER_CERT||{pass:false,status:'EXTERNAL_BROWSER_REQUIRED'};return{version:VERSION,internalPass:audit.pass,depth5CurrentPass:last?.horizonOptimalityProven===true||last?.domainExhaustedOptimalityProven===true,globalOptimalityPass:false,universalPass:false,status:audit.pass?'CORE_687_TRACT_EXACT_DEPTH5_OPEN':'INTERNAL_GATES_OPEN',audit,boundedExhaustive:last,external,remaining:{depth4Revalidation:true,depth5Matrix:true,fusionRitualPendulumExhaustive:true,battlePhaseExhaustive:true,globalOptimality:true,realBrowser:external.pass!==true,universalExactRules:true,partialFormats:true,scoringCausalComplete:false,legacyPhysicalPrune:true}}}
function claim(){try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO687_VERSION_WRITE={value:raw(v),at:(globalThis.Date?.now?.()||0)}}})}catch(_){}try{D.title=TITLE}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}if(W.YGOApp)W.YGOApp.version=VERSION}
const API={VERSION,direct687,exhaustiveOpeningSearch687,selfTest687,install687,audit687,completionAudit687};W.YGOAlpha687=API;install687();claim();if(W.YGOApp){W.YGOApp.release687=API;W.YGOApp.runtimeAudit=API}D.documentElement.dataset.alpha687='fiendsmith-tract-exact-depth5';
})();

