
(()=>{'use strict';
const W=window,D=document,A669=W.YGOAlpha669||{},A685=W.YGOAlpha685||{},VERSION='Alpha 686',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_688';
const raw=v=>String(v??'');
const BASE_SEARCH=typeof A669.exhaustiveOpeningSearch669==='function'?A669.exhaustiveOpeningSearch669.bind(A669):null;
function exhaustiveOpeningSearch686(opts={}){
  if(typeof BASE_SEARCH!=='function')return{version:VERSION,pass:false,status:'BASE_EXHAUSTIVE_UNAVAILABLE'};
  const oldNow=Date.now;
  let out;
  try{
    // Los timestamps de eventos son metadatos de observabilidad. El motor no los lee
    // para legalidad, timing, causalidad, locks ni OPT; IDs/orden/cause se preservan.
    Date.now=()=>0;
    out=BASE_SEARCH(opts);
  }finally{Date.now=oldNow}
  if(out?.certificate){
    out.certificate={...out.certificate,version:VERSION,eventTimestampCanonicalization:true,timestampPolicy:'Durante búsqueda exhaustiva, timestamp=0; IDs, orden, cause, turn, phase y event data permanecen intactos.',globalOptimalityProven:false};
  }
  out.version=VERSION;
  W.__YGO686_LAST_EXHAUSTIVE=out;
  return out;
}
function selfTest686(){
  const oldNow=Date.now; let restored=false,constant=false;
  try{Date.now=()=>0;constant=Date.now()===0}finally{Date.now=oldNow;restored=Date.now===oldNow}
  const checks={base:typeof BASE_SEARCH==='function',constant,restored,catalog:(W.CARD_CATALOG?.length||0)>=19617,score10x10:W.YGOOfficialEvaluation?.pointsPerCategory===10&&W.YGOOfficialEvaluation?.max===100};
  return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,policy:'Normaliza únicamente el reloj de eventos durante exhaustive search; ninguna regla lee timestamp.'};
}
function install686(){
  if(W.YGOAlpha669)W.YGOAlpha669.exhaustiveOpeningSearch669=exhaustiveOpeningSearch686;
  if(W.YGOAlpha655)W.YGOAlpha655.exhaustiveOpeningSearch655=exhaustiveOpeningSearch686;
  if(W.YGOApp)W.YGOApp.exhaustiveSearch=exhaustiveOpeningSearch686;
  return true;
}
function audit686(){install686();const self=selfTest686(),oldDepth4=W.YGOAlpha684?.embeddedDepth4Certificate684?.()||{pass:false};const checks={self:self.pass,installed:W.YGOAlpha669?.exhaustiveOpeningSearch669===exhaustiveOpeningSearch686,catalog:(W.CARD_CATALOG?.length||0)>=19617,ui:!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck')&&!!D.querySelector('.diana-center-zone'),oldDepth4Invalidated:oldDepth4.pass===false};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,self,previousDepth4Certificate:oldDepth4}}
function completionAudit686(){const audit=audit686(),last=W.__YGO686_LAST_EXHAUSTIVE?.certificate||null,external=W.__YGO620_EXTERNAL_BROWSER_CERT||{pass:false,status:'EXTERNAL_BROWSER_REQUIRED'};return{version:VERSION,internalPass:audit.pass,depth5CurrentPass:last?.horizonOptimalityProven===true||last?.domainExhaustedOptimalityProven===true,globalOptimalityPass:false,universalPass:false,status:audit.pass?'CORE_686_TIMESTAMP_CANONICAL_EXHAUSTIVE_DEPTH5_OPEN':'INTERNAL_GATES_OPEN',audit,boundedExhaustive:last,external,remaining:{depth4Revalidation:true,depth5Matrix:true,fusionRitualPendulumExhaustive:true,battlePhaseExhaustive:true,globalOptimality:true,realBrowser:external.pass!==true,universalExactRules:true,partialFormats:true,scoringCausalComplete:false,legacyPhysicalPrune:true}}}
function claim(){try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO686_VERSION_WRITE={value:raw(v),at:(globalThis.Date?.now?.()||0)}}})}catch(_){}try{D.title=TITLE}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}if(W.YGOApp)W.YGOApp.version=VERSION}
const API={VERSION,exhaustiveOpeningSearch686,selfTest686,install686,audit686,completionAudit686};W.YGOAlpha686=API;install686();claim();if(W.YGOApp){W.YGOApp.release686=API;W.YGOApp.runtimeAudit=API}D.documentElement.dataset.alpha686='timestamp-canonical-exhaustive';
})();

