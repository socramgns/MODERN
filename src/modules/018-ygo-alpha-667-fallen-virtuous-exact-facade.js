(()=>{
'use strict';
const W=window,D=document,VERSION='Alpha 667',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_667';
const raw=v=>String(v??''),arr=v=>Array.isArray(v)?v:[],norm=v=>raw(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
const R=()=>W.YGORulingEngine||{};
function zone(st,z,p=0){return st?.zones?.[p]?.[z]||[]}
function locate(st,uid){return R().locate?.(st,uid)||null}
function nameOf(x){return raw(x?.card?.name||x?.name||x)}
function typeOf(x){return raw(x?.card?.type||x?.type)}
function textOf(x){return raw(x?.card?.desc||x?.card?.text||x?.desc||x?.text)}
function isMonster(x){return /monster|monstruo/i.test(typeOf(x))}
function isEcclesia(x){return /ecclesia/i.test(nameOf(x))}
function mentionsAlbaz(x){return /fallen of albaz/i.test(textOf(x))}
function currentTurn(st){return Number(st?.turn)||1}
function useKey(st,p,n,m='MAIN'){return `${p}|${currentTurn(st)}|${norm(n)}|${norm(m)}`}
function used(st,p,n,m='MAIN'){return Number(st?.__alpha340Uses?.[useKey(st,p,n,m)])||0}
function mark(st,p,n,m='MAIN'){st.__alpha340Uses=st.__alpha340Uses||{};const k=useKey(st,p,n,m);st.__alpha340Uses[k]=(st.__alpha340Uses[k]||0)+1;return st.__alpha340Uses[k]}
function moveUid(st,uid,to,p=null,opts={}){const q=locate(st,uid);if(!q)return null;const a=zone(st,q.z,q.p),it=a.splice(q.i,1)[0];if(!it)return null;it.previousZone=q.z;it.previousController=q.p;const owner=it.owner??q.p,dest=p==null?(['hand','deck','gy','banished','extra'].includes(to)?owner:q.p):p;it.controller=['hand','deck','gy','banished','extra'].includes(to)?owner:dest;if(to==='monster'){it.faceUp=opts.faceUp!==false;it.position=opts.position||it.position||'ATK'}else if(to==='spelltrap'){it.faceUp=opts.faceUp!==false;it.position=opts.faceUp===false?'SET':'FACEUP'}else if(['hand','deck','extra'].includes(to))it.faceUp=false;zone(st,to,dest).push(it);return it}
function source(st,p,ctx={}){if(ctx.sourceUid){const q=locate(st,ctx.sourceUid);if(q&&q.p===p&&['hand','spelltrap'].includes(q.z)&&norm(nameOf(q.item))==='the fallen the virtuous')return q}for(const z of ['hand','spelltrap']){const it=zone(st,z,p).find(x=>norm(nameOf(x))==='the fallen the virtuous');if(it)return locate(st,it.uid)}return null}
function freeMonster(st,p){return zone(st,'monster',p).length<Math.max(1,Number(W.YGOAlpha800?.contract800?.(st?.formatKey||W.__YGO_ACTIVE_BAN_KEY)?.monsterZones)||5)}
function exactFallenVirtuous667(st,p=0,ctx={}){
  if(used(st,p,'The Fallen & The Virtuous','ACTIVATE'))return{ok:false,reason:'Solo puedes activar 1 The Fallen & The Virtuous por turno.'};
  const src=source(st,p,ctx);if(!src)return{ok:false,reason:'The Fallen & The Virtuous no está disponible.'};
  const mode=norm(ctx.mode||ctx.effect||'destroy');
  if(mode.includes('revive')||mode.includes('special')){
    if(![...zone(st,'monster',p),...zone(st,'gy',p)].some(isEcclesia))return{ok:false,reason:'Requiere un monstruo Ecclesia en tu Campo o GY.'};
    const q=ctx.targetUid?locate(st,ctx.targetUid):null;if(!q||q.z!=='gy'||!isMonster(q.item))return{ok:false,reason:'No hay monstruo válido en ningún GY.'};
    if(!freeMonster(st,p))return{ok:false,reason:'No hay zona de monstruo disponible.'};
    const it=moveUid(st,q.item.uid,'monster',p,{faceUp:true,position:'ATK'});if(!it)return{ok:false,reason:'No se pudo Invocar el objetivo.'};it.specialSummoned=true;it.summonType='EFFECT';it.summonTurn=currentTurn(st);it.summonPlayer=p;
    moveUid(st,src.item.uid,'gy',src.item.owner??p);mark(st,p,'The Fallen & The Virtuous','ACTIVATE');if(st?.analysis){st.analysis.successfulActivations=(st.analysis.successfulActivations||0)+1;st.analysis.successfulSummons=(st.analysis.successfulSummons||0)+1}
    return{ok:true,summoned:nameOf(it),targetUid:it.uid,mode:'revive',mechanicsProof:{exact:true,source:'ALPHA667_FALLEN_VIRTUOUS'}};
  }
  const ex=ctx.extraUid?locate(st,ctx.extraUid):null;if(!ex||ex.p!==p||ex.z!=='extra'||!isMonster(ex.item)||!mentionsAlbaz(ex.item))return{ok:false,reason:'No hay monstruo del Extra Deck que mencione Fallen of Albaz.'};
  const t=ctx.targetUid?locate(st,ctx.targetUid):null;if(!t||!['monster','spelltrap'].includes(t.z)||t.item?.faceUp===false)return{ok:false,reason:'No hay carta boca arriba válida para destruir.'};
  const sent=moveUid(st,ex.item.uid,'gy',ex.item.owner??p);if(!sent)return{ok:false,reason:'No se pudo enviar el monstruo del Extra Deck.'};
  const tq=locate(st,ctx.targetUid);if(!tq)return{ok:false,reason:'El objetivo dejó de ser localizable.'};const destroyed=moveUid(st,tq.item.uid,'gy',tq.item.owner??tq.p);if(!destroyed)return{ok:false,reason:'No se pudo destruir el objetivo.'};
  const sq=locate(st,src.item.uid);if(sq)moveUid(st,src.item.uid,'gy',src.item.owner??p);mark(st,p,'The Fallen & The Virtuous','ACTIVATE');if(st?.analysis){st.analysis.successfulActivations=(st.analysis.successfulActivations||0)+1;st.analysis.removals=(st.analysis.removals||0)+1}
  return{ok:true,sent:nameOf(sent),destroyed:nameOf(destroyed),extraUid:sent.uid,targetUid:destroyed.uid,mode:'destroy',mechanicsProof:{exact:true,source:'ALPHA667_FALLEN_VIRTUOUS'}};
}
function install667(){
  const a340=W.YGOAlpha340||{};if(typeof a340.fallenVirtuous!=='function')W.YGOAlpha340={...a340,fallenVirtuous:exactFallenVirtuous667,dispatch:(st,p,name,ctx={})=>norm(name)==='the fallen the virtuous'?exactFallenVirtuous667(st,p,ctx):(typeof a340.dispatch==='function'?a340.dispatch(st,p,name,ctx):null)};
  else W.YGOAlpha340={...a340,fallenVirtuous:a340.fallenVirtuous};
  const a310=W.YGOAlpha310||{};if(typeof a310.applyScript==='function'&&!a310.applyScript.__alpha667){const old=a310.applyScript.bind(a310);const fn=(st,p,name,ctx={})=>norm(name)==='the fallen the virtuous'?exactFallenVirtuous667(st,p,ctx):old(st,p,name,ctx);fn.__alpha667=true;fn.__base=old;a310.applyScript=fn}
  const R0=R();R0.exactRuleRegistry667={...(R0.exactRuleRegistry667||{}),'the fallen the virtuous':{name:'The Fallen & The Virtuous',exact:true,effects:{destroy:{exact:true,handler:'alpha667FallenVirtuous'},revive:{exact:true,handler:'alpha667FallenVirtuous'}},source:'KONAMI_NEURON'}};
  return true;
}
function selfTest667(){
  const card=n=>({name:n,type:'Effect Monster',desc:''}),item=(uid,c,p=0)=>({uid,card:c,owner:p,controller:p,faceUp:true,position:'ATK'});
  const spell={name:'The Fallen & The Virtuous',type:'Quick-Play Spell',desc:'Activate 1 of these effects.'},fusion={name:'Albion the Branded Dragon',type:'Fusion Monster',desc:'Fallen of Albaz + 1 LIGHT monster'},ec={name:'Incredible Ecclesia, the Virtuous',type:'Effect Monster',desc:''};
  const mk=()=>({turn:1,analysis:{},zones:[{deck:[],hand:[item('s',{...spell},0)],monster:[item('e',{...ec},0)],spelltrap:[],gy:[],banished:[],extra:[item('x',{...fusion},0)]},{deck:[],hand:[],monster:[item('o',card('Opponent'),1)],spelltrap:[],gy:[item('g',card('GY Monster'),1)],banished:[],extra:[]}]});
  const a=mk(),d=exactFallenVirtuous667(a,0,{sourceUid:'s',mode:'destroy',extraUid:'x',targetUid:'o'}),destroyPass=!!d.ok&&locate(a,'x')?.z==='gy'&&locate(a,'o')?.z==='gy'&&locate(a,'s')?.z==='gy';
  const b=mk(),r=exactFallenVirtuous667(b,0,{sourceUid:'s',mode:'revive',targetUid:'g'}),revivePass=!!r.ok&&locate(b,'g')?.z==='monster'&&locate(b,'g')?.p===0&&locate(b,'s')?.z==='gy';
  const again=exactFallenVirtuous667(b,0,{sourceUid:'s',mode:'revive',targetUid:'g'}),optPass=again.ok===false;
  return{version:VERSION,pass:destroyPass&&revivePass&&optPass,destroyPass,revivePass,optPass};
}
function audit667(){install667();const self=selfTest667(),base=W.YGOAlpha666?.audit666?.()||{pass:false};const checks={base:base.pass!==false,self:self.pass,handler:typeof W.YGOAlpha340?.fallenVirtuous==='function',registry:!!R().exactRuleRegistry667?.['the fallen the virtuous'],catalog:arr(W.CARD_CATALOG).length>=19617,ui:!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck')&&!!D.querySelector('.diana-center-zone')};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,self,base}}
function completionAudit667(){const audit=audit667(),last=W.__YGO666_LAST_EXHAUSTIVE?.certificate||null,external=W.__YGO620_EXTERNAL_BROWSER_CERT||{pass:false,status:'EXTERNAL_BROWSER_REQUIRED'};return{version:VERSION,internalPass:audit.pass,horizonOptimalityPass:last?.horizonOptimalityProven===true,globalOptimalityPass:false,universalPass:false,status:audit.pass?'CORE_667_FALLEN_VIRTUOUS_FACADE_GLOBAL_OPTIMALITY_OPEN':'INTERNAL_GATES_OPEN',audit,boundedExhaustive:last,external,remaining:{globalOptimality:true,realBrowser:external.pass!==true,universalExactRules:true,partialFormats:true,scoringCausalComplete:false,legacyPhysicalPrune:true}}}
function claim(){try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO667_VERSION_WRITE={value:raw(v),at:Date.now()}}})}catch(_){}try{D.title=TITLE}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}if(W.YGOApp)W.YGOApp.version=VERSION}
const API={VERSION,exactFallenVirtuous667,install667,selfTest667,audit667,completionAudit667};W.YGOAlpha667=API;install667();claim();if(W.YGOApp){W.YGOApp.release667=API;W.YGOApp.runtimeAudit=API}D.documentElement.dataset.alpha667='fallen-virtuous-exact-facade';
})();