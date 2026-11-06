/* Registered Azure-Eyes Synchro procedure and genuine revival qualification.
 * Printed data supplies reviewed levels and types, not executable card text.
 * The summon itself starts no chain; its mandatory protection is a new trigger. */
(()=>{'use strict';
const W=window,E=W.YGOComboEngine;if(!E?.registerHandler||!W.YGOBlueEyesDuel?.queueAzureProtection||!W.YGOBlueEyesDuel?.azureSummonDestinationSupported)throw Error('AZURE_SYNCHRO_BLUE_EYES_RULES_REQUIRED');
const H=E.helpers,C=x=>H.card(x),id=x=>H.baseId(x),arr=x=>Array.isArray(x)?x:[],AZURE=40908371,TYPE='SYNCHRO_AZURE_EYES_SILVER_DRAGON';
const tunerEffects=new Set([14558127,97268402,8240199,71039903,98159737]);
const knownFieldMonsters=new Set([14558127,97268402,24508238,94145021,86120751,20001443,93490856,8240199,71039903,87052196,98159737,23431858,24557335,26889158,52277807,34755994,75286621,69248256,96633955,70534340,44146295,59822133,83994433,32519092,78917791,5402805,14812471,68468459,AZURE,87871125,42097666,20001444]);
const knownFaceUpSpells=new Set([24382602,1295111,83764718,74063034,44362883,65124425,10045474,94192409,51339637,14934922]);
const attachmentKeys=['overlay','overlays','overlayUids','xyzMaterials','materials','materialUids','attachments','attachedUids','equips','equipUids','equippedCards','equippedTo','equipTargetUid'];
const levelKeys=['currentLevel','effectiveLevel','modifiedLevel','levelOverride','levelModification','levelModifiers','levelChange','levelChanges','originalLevelOverride'];
const restrictionKeys=['cannotBeSynchroMaterial','cannotBeMaterial','cannotBeUsedAsMaterial','synchroMaterialRestrictions','materialRestrictions'];
const meaningful=x=>x!==undefined&&x!==null&&x!==false&&(!Array.isArray(x)||x.length!==0),present=(x,keys)=>keys.some(key=>meaningful(x[key]));
const rows=(s,p,z)=>arr(s.zones[p]?.[z]),own=(s,z)=>rows(s,0,z),face=x=>x.faceUp===true,tuner=x=>!!(Number(C(x).typeBits)&0x1000),level=x=>Number(C(x).level);
function printedMain(x,max=8){const c=C(x),bits=Number(c.typeBits),printed=H.lookup(Number(c.id));return !!printed&&c.technicalSourceMatched===true&&c.statsKnown===true&&printed.technicalSourceMatched===true&&bits===Number(printed.typeBits)&&level(x)===Number(printed.level)&&Number.isInteger(level(x))&&level(x)>=1&&level(x)<=max&&(bits&1)!==0&&!(bits&(0x40|0x80|0x2000|0x4000|0x800000|0x1000000|0x4000000|0x8000000));}
function normal(x,max=8){return printedMain(x,max)&&(Number(C(x).typeBits)&17)===17&&!(Number(C(x).typeBits)&0x20);}
function realToken(s,x){const ledger=s.tokenLedger?.[x.uid],source=ledger?H.locate(s,ledger.sourceUid):null;return x.token===true&&x.ownerPlayer===0&&id(x)===20001444&&level(x)===4&&tuner(x)&&!!ledger&&ledger.uid===x.uid&&ledger.destroyed===false&&Number(ledger.cardId)===Number(C(x).id)&&x.generatedBy===ledger.sourceUid&&source&&[20001443,93490856].includes(id(source.item));}
function material(s,x){
 if(!face(x)||present(x,attachmentKeys)||present(x,levelKeys)||present(x,restrictionKeys)||x.leaveFieldRedirect||arr(x.temporaryModifiers).some(m=>!['ATK_GAIN','ATK_DEF_GAIN'].includes(m.kind)))return false;
 if(x.token)return realToken(s,x);
 if(!printedMain(x))return false;
 return tuner(x)?normal(x)||tunerEffects.has(id(x)):normal(x);
}
function reviewedField(s){return s.zones.every(z=>arr(z.monster).every(x=>!face(x)||normal(x,12)||knownFieldMonsters.has(id(x)))&&arr(z.spelltrap).every(x=>!face(x)||knownFaceUpSpells.has(id(x))));}
function liveLock(s,lock){if(lock.untilTurn!==undefined&&Number(lock.untilTurn)<s.turn)return false;const source=H.locate(s,lock.sourceUid),player=lock.appliesToPlayer??lock.player??source?.player??0;if(player!==0)return false;return lock.wholeTurn===true||!lock.sourceUid||source?.zone==='monster'&&face(source.item)&&source.item.effectsNegated!==true;}
function allowed(s,azure){
 if(!H.wolfNameAllowed(s,0,azure))return false;
 for(const lock of arr(s.locks).filter(l=>liveLock(s,l))){if(lock.kind==='FUSION_ONLY')return false;if(lock.kind==='WYRM_ONLY'&&Number(C(azure).race)!==0x800000)return false;}
 return H.spiritSpecialAllowed(s,0,azure);
}
function destinations(s,uids){const occupied=new Set(own(s,'monster').filter(x=>!uids.includes(x.uid)).map(x=>x.zoneIndex));return[0,1,2,3,4].filter(zone=>!occupied.has(zone)&&W.YGOBlueEyesDuel.azureSummonDestinationSupported(s,0,zone));}
function open(s){return s.context.duelMode===true&&!s.duelEnded&&s.activePlayer===0&&['MAIN 1','MAIN 2'].includes(s.phase)&&!arr(s.pendingTriggers).length&&!arr(s.chain).length&&reviewedField(s);}
function combinations(pool,target,start=0,selected=[]){const out=[];for(let i=start;i<pool.length;i++){const x=pool[i],remaining=target-level(x);if(remaining<0)continue;const next=[...selected,x];if(remaining===0)out.push(next);else out.push(...combinations(pool,remaining,i+1,next));}return out;}
function enumerate(s){
 if(!open(s))return[];const pool=own(s,'monster').filter(x=>material(s,x)).sort((a,b)=>a.uid.localeCompare(b.uid)),out=[];
 for(const azure of own(s,'extra').filter(x=>id(x)===AZURE&&Number(C(x).level)===9&&(Number(C(x).typeBits)&0x2000)&&allowed(s,x)))for(const t of pool.filter(tuner))for(const rest of combinations(pool.filter(x=>!tuner(x)&&normal(x)),9-level(t))){const materialUids=[t.uid,...rest.map(x=>x.uid)];for(const destination of destinations(s,materialUids))for(const position of ['ATTACK','DEFENSE'])out.push({type:TYPE,sourceUid:azure.uid,materialUids,destination,position});}
 return out;
}
E.registerHandler({type:TYPE,scope:'DUEL',nonTargeting:true,enumerate,apply:(s,a)=>{
 const paid=[],materials=[];
 for(const uid of a.materialUids){const hit=H.locate(s,uid),item=hit.item,record={kind:'SYNCHRO_MATERIAL',uid,from:hit.zone,fromPlayer:hit.player,ownerPlayer:item.ownerPlayer};H.move(s,uid,'gy');const after=H.locate(s,uid),to=after?.zone||'CEASES_TO_EXIST';paid.push({...record,to,...(after?{toPlayer:after.player}:{})});materials.push({uid,cardId:id(item),level:level(item),tuner:tuner(item),to,ownerPlayer:item.ownerPlayer});}
 const azure=H.move(s,a.sourceUid,'monster',{player:0,zoneIndex:a.destination,position:a.position,faceUp:true});azure.summonType='SYNCHRO';azure.properlySummoned=true;azure.properSummonType='SYNCHRO';s.extraHistory.push('SYNCHRO');const azureTrigger=W.YGOBlueEyesDuel.queueAzureProtection(s,0,azure.uid);
 return{paid,activationEvents:[{type:'SYNCHRO_SUMMON_PROCEDURE',uid:azure.uid,player:0,startsChain:false,materials:a.materialUids}],events:[{type:'SYNCHRO_SUMMON',uid:azure.uid,player:0,materials:a.materialUids,materialEvidence:materials,totalLevel:9,zoneIndex:a.destination,position:a.position,properlySummoned:true,properSummonType:'SYNCHRO'},...azureTrigger.events]};
}});
const capabilities=()=>({version:'registered-azure-synchro-v1',action:TYPE,cardId:AZURE,duelModeRequired:true,players:[0],phases:['MAIN 1','MAIN 2'],originZone:'extra',destinations:[0,1,2,3,4],positions:['ATTACK','DEFENSE'],startsChain:false,oncePerTurn:false,materialRequirement:{tuners:1,minimumNonTuners:1,nonTuners:'PRINTED_MAIN_DECK_NORMAL_MONSTERS_ONLY',totalPrintedLevels:9},tunerEffectMaterialCardIds:[...tunerEffects],normalMaterialProfile:'TECHNICALLY_MATCHED_KNOWN_LEVEL_MAIN_NORMAL_INCLUDING_NORMAL_TUNERS',tokenMaterialProfile:'LIVE_REGISTERED_SWORDSOUL_TUNER_TOKEN_ONLY',properSummonType:'SYNCHRO',mandatoryProtection:'AZURE_EYES_PROTECTION',enablesRegisteredMonsterReborn:true,certified:false,limitations:['Only reviewed face-up Main Deck Tuner profiles, Main Deck Normal non-Tuners and live registered Swordsoul Tuner Tokens are materials. Printed levels must sum to nine. Extra, Ritual, Pendulum, unknown material replacements, attachments and level changes remain excluded.','The procedure and Azure as a Monster Reborn target require duel mode so the mandatory protection has a supported resolution window. A declared initial field does not create a summon trigger or establish genuine proper history.','Main Monster Zones are checked after materials leave; no Link arrows are required and the Extra Monster Zone is not offered. A live eligible Sunlight Wolf pointing at the arrival zone excludes that combination until its simultaneous-trigger chain is registered.','Ancients retains the registered observed End Phase GY opportunity. Non-Tuner Effect Monsters, including Mo Ye and Longyuan, are not Azure materials; no effects are silently declined to admit them.','Fusion-only and Wyrm-only restrictions retain their real scope; a Synchro-only restriction permits this procedure. Shaman still governs effects according to the current summon origin.','When Shaman prohibits the newly summoned Extra monster from activating, the mandatory protection is explicitly suppressed without inventing a dead-end pending activation; a GY revival has its own current origin.','The procedure starts no effect chain; the subsequent mandatory protection is its own registered effect. General summon negation, priority and arbitrary simultaneous-trigger ordering are outside this subset.']});
W.YGOAzureSynchro=Object.freeze({version:'registered-azure-synchro-v1',capabilities});
})();
