/* An explicit Stardust Spark Dragon Synchro procedure. Printed card data is
 * evidence for the reviewed profiles, never executable rules or a declaration
 * of past summoning history. This procedure does not start an effect chain. */
(()=>{'use strict';
const W=window,E=W.YGOComboEngine;if(!E?.registerHandler)throw Error('STARDUST_SYNCHRO_CORE_REQUIRED');
const H=E.helpers,C=x=>H.card(x),id=x=>H.baseId(x),arr=x=>Array.isArray(x)?x:[],SPARK=83994433,TYPE='SYNCHRO_STARDUST_SPARK_DRAGON';
const mainEffects=new Set([14558127,97268402,24508238,94145021,86120751,20001443,93490856,8240199,71039903,87052196,98159737,23431858,24557335,26889158,52277807]);
const knownFieldMonsters=new Set([...mainEffects,34755994,75286621,69248256,96633955,70534340,44146295,59822133,SPARK,32519092,78917791,5402805,14812471,68468459,40908371,87871125,42097666,20001444]);
const knownFaceUpSpells=new Set([24382602,1295111,83764718,74063034,44362883,65124425,10045474,94192409,51339637,14934922]);
const attachmentKeys=['overlay','overlays','overlayUids','xyzMaterials','materials','materialUids','attachments','attachedUids','equips','equipUids','equippedCards','equippedTo','equipTargetUid'];
const levelKeys=['currentLevel','effectiveLevel','modifiedLevel','levelOverride','levelModification','levelModifiers','levelChange','levelChanges','originalLevelOverride'];
const restrictionKeys=['cannotBeSynchroMaterial','cannotBeMaterial','cannotBeUsedAsMaterial','synchroMaterialRestrictions','materialRestrictions'];
const meaningful=x=>x!==undefined&&x!==null&&x!==false&&(!Array.isArray(x)||x.length!==0);
const present=(x,keys)=>keys.some(key=>meaningful(x[key]));
const rows=(s,p,z)=>arr(s.zones[p]?.[z]),own=(s,z)=>rows(s,0,z),face=x=>x.faceUp===true,tuner=x=>!!(Number(C(x).typeBits)&0x1000),level=x=>Number(C(x).level);
function printedMain(x,max=8){
 const c=C(x),bits=Number(c.typeBits),printed=H.lookup(Number(c.id));
 return !!printed&&c.technicalSourceMatched===true&&c.statsKnown===true&&printed.technicalSourceMatched===true&&Number(c.typeBits)===Number(printed.typeBits)&&level(x)===Number(printed.level)&&Number.isInteger(level(x))&&level(x)>=1&&level(x)<=max&&(bits&1)!==0&&!(bits&(0x40|0x80|0x2000|0x4000|0x800000|0x1000000|0x4000000|0x8000000));
}
function normal(x,max=8){return printedMain(x,max)&&(Number(C(x).typeBits)&17)===17&&!(Number(C(x).typeBits)&0x20);}
function realToken(s,x){
 const ledger=s.tokenLedger?.[x.uid],source=ledger?H.locate(s,ledger.sourceUid):null;
 return x.token===true&&x.ownerPlayer===0&&id(x)===20001444&&level(x)===4&&tuner(x)&&!!ledger&&ledger.uid===x.uid&&ledger.destroyed===false&&Number(ledger.cardId)===Number(C(x).id)&&x.generatedBy===ledger.sourceUid&&source&&[20001443,93490856].includes(id(source.item));
}
function material(s,x){
 if(!face(x)||present(x,attachmentKeys)||present(x,levelKeys)||present(x,restrictionKeys)||arr(x.temporaryModifiers).some(m=>!['ATK_GAIN','ATK_DEF_GAIN'].includes(m.kind)))return false;
 if(x.token)return realToken(s,x)&&!x.leaveFieldRedirect;
 if(!printedMain(x)||!normal(x)&&!mainEffects.has(id(x)))return false;
 // Spinny's own reviewed revival redirects it to banishment when it leaves
 // the field. Unreviewed replacements and opponent-only GY triggers stay out.
 if(x.leaveFieldRedirect&&!(id(x)===52277807&&x.leaveFieldRedirect==='banished'))return false;
 if([20001443,93490856].includes(id(x))&&(x.ownerPlayer!==0||x.leaveFieldRedirect))return false;
 return true;
}
function reviewedField(s){return s.zones.every(z=>arr(z.monster).every(x=>!face(x)||normal(x,12)||knownFieldMonsters.has(id(x)))&&arr(z.spelltrap).every(x=>!face(x)||knownFaceUpSpells.has(id(x))));}
function liveLock(s,lock){
 if(lock.untilTurn!==undefined&&Number(lock.untilTurn)<s.turn)return false;
 const source=H.locate(s,lock.sourceUid),player=lock.appliesToPlayer??lock.player??source?.player??0;if(player!==0)return false;
 return lock.wholeTurn===true||!lock.sourceUid||source?.zone==='monster'&&face(source.item)&&source.item.effectsNegated!==true;
}
function allowed(s,spark){
 for(const lock of arr(s.locks).filter(l=>liveLock(s,l))){
  if(lock.kind==='FUSION_ONLY')return false;
  if(lock.kind==='WYRM_ONLY'&&Number(C(spark).race)!==0x800000)return false;
  if(lock.kind==='DRAGON_ONLY'&&Number(C(spark).race)!==8192)return false;
  if(lock.kind==='SALAMANGREAT_WOLF_NAME_LOCK'&&Number(lock.cardId)===id(spark))return false;
 }
 // SYNCHRO_ONLY permits this procedure. Spirit with Eyes of Blue can also
 // exist in a declared field before its live Dragon lock was installed.
 return !own(s,'monster').some(x=>face(x)&&id(x)===42097666&&!x.effectsNegated)||Number(C(spark).race)===8192;
}
function destinations(s,uids){const occupied=new Set(own(s,'monster').filter(x=>!uids.includes(x.uid)).map(x=>x.zoneIndex));return[0,1,2,3,4].filter(zone=>!occupied.has(zone));}
function open(s){return !s.duelEnded&&s.activePlayer===0&&['MAIN 1','MAIN 2'].includes(s.phase)&&!arr(s.pendingTriggers).length&&!arr(s.chain).length&&reviewedField(s);}
function combinations(pool,target,start=0,selected=[]){
 const out=[];for(let i=start;i<pool.length;i++){const x=pool[i],remaining=target-level(x);if(remaining<0)continue;const next=[...selected,x];if(remaining===0)out.push(next);else out.push(...combinations(pool,remaining,i+1,next));}return out;
}
function enumerate(s){
 if(!open(s))return[];const materials=own(s,'monster').filter(x=>material(s,x)).sort((a,b)=>a.uid.localeCompare(b.uid)),out=[];
 for(const spark of own(s,'extra').filter(x=>id(x)===SPARK&&Number(C(x).level)===8&&(Number(C(x).typeBits)&0x2000)&&allowed(s,x)))for(const t of materials.filter(tuner))for(const rest of combinations(materials.filter(x=>!tuner(x)),8-level(t))){
  const materialUids=[t.uid,...rest.map(x=>x.uid)];for(const destination of destinations(s,materialUids))for(const position of ['ATTACK','DEFENSE'])out.push({type:TYPE,sourceUid:spark.uid,materialUids,destination,position});
 }
 return out;
}
function queueMaterialTrigger(s,item,destination){
 if(destination!=='gy'||item.ownerPlayer!==0)return;
 const kind=id(item)===20001443?'MOYE_DRAW':id(item)===93490856?'LONGYUAN_BURN':null;
 if(kind&&!H.isUsed(s,kind)&&!s.pendingTriggers.some(t=>t.kind===kind&&t.sourceUid===item.uid))H.queueTrigger(s,kind,item.uid);
}
E.registerHandler({type:TYPE,nonTargeting:true,enumerate,apply:(s,a)=>{
 const paid=[],materials=[];
 for(const uid of a.materialUids){const hit=H.locate(s,uid),item=hit.item,record={kind:'SYNCHRO_MATERIAL',uid,from:hit.zone,fromPlayer:hit.player,ownerPlayer:item.ownerPlayer};H.move(s,uid,'gy');const after=H.locate(s,uid),to=after?.zone||'CEASES_TO_EXIST';paid.push({...record,to,...(after?{toPlayer:after.player}:{})});materials.push({uid,cardId:id(item),level:level(item),tuner:tuner(item),to,ownerPlayer:item.ownerPlayer});queueMaterialTrigger(s,item,to);}
 const spark=H.move(s,a.sourceUid,'monster',{player:0,zoneIndex:a.destination,position:a.position,faceUp:true});spark.summonType='SYNCHRO';spark.properlySummoned=true;spark.properSummonType='SYNCHRO';s.extraHistory.push('SYNCHRO');
 if(a.destination===1&&!H.isUsed(s,'SALAMANGREAT_WOLF_FIRE'))for(const wolf of own(s,'monster').filter(x=>face(x)&&id(x)===87871125&&x.zoneIndex===5&&!x.effectsNegated))if(!s.pendingTriggers.some(t=>t.kind==='SALAMANGREAT_WOLF_FIRE'&&t.sourceUid===wolf.uid))H.queueTrigger(s,'SALAMANGREAT_WOLF_FIRE',wolf.uid,{summonedUid:spark.uid,from:'extra'});
 return{paid,activationEvents:[{type:'SYNCHRO_SUMMON_PROCEDURE',uid:spark.uid,player:0,startsChain:false,materials:a.materialUids}],events:[{type:'SYNCHRO_SUMMON',uid:spark.uid,player:0,materials:a.materialUids,materialEvidence:materials,totalLevel:8,zoneIndex:a.destination,position:a.position,properlySummoned:true,properSummonType:'SYNCHRO'}]};
}});
const capabilities=()=>({version:'registered-stardust-synchro-v1',action:TYPE,cardId:SPARK,players:[0],phases:['MAIN 1','MAIN 2'],originZone:'extra',destinations:[0,1,2,3,4],positions:['ATTACK','DEFENSE'],startsChain:false,oncePerTurn:false,materialRequirement:{tuners:1,minimumNonTuners:1,totalPrintedLevels:8},mainEffectMaterialCardIds:[...mainEffects],normalMaterialProfile:'TECHNICALLY_MATCHED_KNOWN_LEVEL_MAIN_NORMAL_INCLUDING_NORMAL_TUNERS',tokenMaterialProfile:'LIVE_REGISTERED_SWORDSOUL_TUNER_TOKEN_ONLY',properSummonType:'SYNCHRO',enablesRegisteredMonsterReborn:true,certified:false,limitations:['Only reviewed face-up Main Deck monsters and live registered Swordsoul Tokens are materials; printed levels must sum to eight. Xyz, Link, Fusion, Synchro, Ritual, Pendulum, unreviewed replacements, attachments and level changes remain outside this material subset.','Main Monster Zones are checked after the actual materials leave. This procedure does not require Link arrows and does not offer an Extra Monster Zone destination.','Mo Ye and Longyuan material triggers are registered for owner zero only; copies owned by the opponent are excluded for these two profiles. Ancients and Gazelle retain existing observed-transition windows.','Spinny uses its reviewed banishment redirect. Sunlight Wolf uses only the existing EMZ-to-Main-zone-one arrow geometry.','Fusion-only and Wyrm-only restrictions retain their actual scope. A Synchro-only restriction permits the procedure; Shaman effect restrictions still govern subsequent Spark effect activations.','The procedure starts no effect chain and does not claim general summon-negation, priority or simultaneous-trigger sequencing.']});
W.YGOStardustSynchro=Object.freeze({version:'registered-stardust-synchro-v1',capabilities});
})();
