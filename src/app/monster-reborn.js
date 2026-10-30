/* Monster Reborn is an explicit, bounded Normal Spell packet. Eligibility
 * comes from reviewed summon profiles and physical history, never card text
 * evaluation or a declared starting-field claim. */
(()=>{'use strict';
const W=window,E=W.YGOComboEngine;if(!E?.registerHandler)throw Error('MONSTER_REBORN_CORE_REQUIRED');
const H=E.helpers,arr=x=>Array.isArray(x)?x:[],C=x=>H.card(x),id=x=>H.baseId(x),REBORN=83764718,TYPE='ACTIVATE_MONSTER_REBORN';
const mainEffects=new Set([14558127,97268402,24508238,94145021,86120751,20001443,93490856,8240199,71039903,87052196,98159737,23431858,24557335,26889158,52277807]);
const extraProfiles=new Map([[34755994,'LINK'],[75286621,'FUSION'],[69248256,'SYNCHRO'],[96633955,'SYNCHRO'],[70534340,'FUSION'],[44146295,'FUSION'],[59822133,'SYNCHRO'],[83994433,'SYNCHRO'],[32519092,'LINK'],[78917791,'LINK'],[5402805,'LINK'],[14812471,'LINK']]);
const excludedProfiles=[{id:68468459,reason:'ALBAZ_ON_SPECIAL_SUMMON_FUSION_OUTSIDE_THIS_PACKET'},{id:40908371,reason:'AZURE_MANDATORY_SPECIAL_SUMMON_TRIGGER_AND_PROPER_SUMMON_ROUTE_NOT_REGISTERED'},{id:87871125,reason:'REVIVED_MAIN_ZONE_WOLF_LINK_GEOMETRY_NOT_REGISTERED'},{id:42097666,reason:'REVIVED_SPIRIT_CONTINUOUS_RESTRICTION_PROFILE_NOT_REGISTERED'}];
const knownFieldMonsters=new Set([...mainEffects,...extraProfiles.keys(),68468459,40908371,87871125,42097666,20001444]);
const attachedKeys=['overlay','overlays','overlayUids','xyzMaterials','materials','materialUids','attachments','attachedUids','equips','equipUids','equippedCards','equippedTo','equipTargetUid'];
const rows=(s,p,z)=>arr(s.zones[p]?.[z]),face=x=>x.faceUp===true,link=x=>!!(Number(C(x).typeBits)&0x4000000);
function mainNormal(x){const c=C(x),bits=Number(c.typeBits);return(bits&17)===17&&!(bits&(0x40|0x80|0x2000|0x4000|0x800000|0x1000000|0x4000000|0x8000000))&&c.technicalSourceMatched===true&&c.statsKnown===true&&Number.isInteger(Number(c.level))&&Number(c.level)>=1&&Number(c.level)<=12&&Number.isFinite(c.atk)&&c.atk>=0&&Number.isFinite(c.def)&&c.def>=0;}
function reviewedTarget(x){
 const bits=Number(C(x).typeBits);if(!(bits&1)||x.token||bits&(0x80|0x4000|0x800000|0x1000000|0x8000000)||x.leaveFieldRedirect||attachedKeys.some(key=>x[key]!==undefined&&x[key]!==null&&x[key]!==false&&(!Array.isArray(x[key])||x[key].length)))return false;
 const proper=extraProfiles.get(id(x));if(proper)return x.properlySummoned===true&&x.properSummonType===proper&&!!(bits&({FUSION:0x40,SYNCHRO:0x2000,LINK:0x4000000}[proper]));
 return !(bits&(0x40|0x2000|0x4000000))&&(mainNormal(x)||mainEffects.has(id(x)));
}
// Unknown face-up continuous effects may forbid a summon or GY access. A
// facedown card does not contribute an unannounced continuous restriction.
function reviewedField(s){return s.zones.every(z=>arr(z.monster).every(x=>!face(x)||mainNormal(x)||knownFieldMonsters.has(id(x)))&&arr(z.spelltrap).every(x=>!face(x)||[24382602,1295111,REBORN,74063034,44362883,65124425,10045474,94192409,51339637,14934922].includes(id(x))));}
function freeMain(s){const occupied=new Set(rows(s,0,'monster').map(x=>x.zoneIndex));return[0,1,2,3,4].filter(zone=>!occupied.has(zone));}
function allowedSpecial(s,x){
 if(id(x)===34755994&&H.isUsed(s,'ARTEMIS_SPECIAL_SUMMON'))return false;
 for(const lock of arr(s.locks)){
  const source=H.locate(s,lock.sourceUid),player=lock.appliesToPlayer??lock.player??source?.player??0;if(player!==0||lock.untilTurn!==undefined&&lock.untilTurn<s.turn)continue;
  if(!lock.wholeTurn&&lock.sourceUid&&(source?.zone!=='monster'||!face(source.item)||source.item.effectsNegated===true))continue;
  if(lock.kind==='WYRM_ONLY'&&Number(C(x).race)!==0x800000||lock.kind==='DRAGON_ONLY'&&Number(C(x).race)!==8192||lock.kind==='SALAMANGREAT_WOLF_NAME_LOCK'&&lock.cardId===id(x))return false;
  // Branded/Lubellion FUSION_ONLY and Token SYNCHRO_ONLY restrict the Extra
  // Deck. This target is in a GY and does not use Extra Deck summon space.
 }
 // Spirit with Eyes of Blue is continuous, including a declared copy whose
 // starting scenario has no dynamically installed lock record.
 if(rows(s,0,'monster').some(m=>face(m)&&id(m)===42097666&&!m.effectsNegated)&&Number(C(x).race)!==8192)return false;
 if(id(x)===44146295&&rows(s,0,'monster').some(m=>face(m)&&id(m)===44146295))return false;
 return true;
}
function target(s,uid){const hit=H.locate(s,uid);return hit?.zone==='gy'&&[0,1].includes(hit.player)&&[0,1].includes(hit.item.ownerPlayer)&&reviewedTarget(hit.item)&&allowedSpecial(s,hit.item)?hit:null;}
function open(s){return !s.duelEnded&&s.activePlayer===0&&['MAIN 1','MAIN 2'].includes(s.phase)&&!arr(s.pendingTriggers).length&&!arr(s.chain).length&&reviewedField(s);}
function queueSummonTriggers(s,x,destination){
 if(id(x)===20001443&&!H.isUsed(s,'MOYE_TOKEN'))H.queueTrigger(s,'MOYE_TOKEN',x.uid);
 if(id(x)===26889158&&!H.isUsed(s,'SALAMANGREAT_GAZELLE_SEND'))H.queueTrigger(s,'SALAMANGREAT_GAZELLE_SEND',x.uid,{player:0});
 // This is the existing reviewed EMZ Wolf geometry. Revived Wolf itself is
 // excluded above, so no Main Zone arrow relationships are invented.
 if(destination===1&&!H.isUsed(s,'SALAMANGREAT_WOLF_FIRE'))for(const wolf of rows(s,0,'monster').filter(m=>face(m)&&id(m)===87871125&&m.zoneIndex===5&&!m.effectsNegated))if(!s.pendingTriggers.some(t=>t.kind==='SALAMANGREAT_WOLF_FIRE'&&t.sourceUid===wolf.uid))H.queueTrigger(s,'SALAMANGREAT_WOLF_FIRE',wolf.uid,{summonedUid:x.uid,from:'gy'});
}
E.registerHandler({type:TYPE,cardActivation:'NORMAL_SPELL',activationCardId:REBORN,activationZones:['hand'],activationPacket:'SINGLE',activationRestriction:'NONE',spellSpeed:1,enumerate:s=>open(s)?rows(s,0,'hand').filter(x=>id(x)===REBORN).flatMap(source=>s.zones.flatMap(z=>arr(z.gy)).filter(x=>target(s,x.uid)).flatMap(x=>freeMain(s).flatMap(destination=>(link(x)?['ATTACK']:['ATTACK','DEFENSE']).map(position=>({type:TYPE,sourceUid:source.uid,targetUid:x.uid,destination,position}))))):[],apply:(s,a)=>{
 const activationEvents=[{type:'TARGET',sourceUid:a.sourceUid,uid:a.targetUid,zone:'gy',targetPlayer:H.locate(s,a.targetUid)?.player??null}];
 if(a.ashNegated||a.effectNegated||a.activationNegated)return{activationEvents,events:[{type:'MONSTER_REBORN_NEGATED',uid:a.sourceUid,targetUid:a.targetUid,activationNegated:!!a.activationNegated}]};
 const source=H.locate(s,a.sourceUid);if(source?.player!==0||source.zone!=='spelltrap'||id(source.item)!==REBORN||!face(source.item)||source.item.fieldSpell===true)throw Error('MONSTER_REBORN_NORMAL_SPELL_STAGE_REQUIRED');
 const hit=target(s,a.targetUid);if(!hit||!reviewedField(s)||!freeMain(s).includes(a.destination)||!['ATTACK','DEFENSE'].includes(a.position)||link(hit.item)&&a.position!=='ATTACK')return{activationEvents,events:[{type:'MONSTER_REBORN_TARGET_UNAVAILABLE',uid:a.sourceUid,targetUid:a.targetUid,summoned:false}]};
 const targetPlayer=hit.player,ownerPlayer=hit.item.ownerPlayer,x=H.move(s,a.targetUid,'monster',{player:0,zoneIndex:a.destination,position:a.position,faceUp:true});
 // Revival starts a new field instance. Retain genuine proper-summon history
 // for future revivals, but do not make this a new Fusion/Synchro/Link Summon.
 for(const key of ['declaredSummonType','currentAtk','currentDef','temporaryModifiers','continuousStatsApplied','effectsNegated','effectsNegatedUntilTurn','negatedUntilTurn','negationUntilTurn','cannotAttackTurn','lastPositionChangeTurn','destroyAtEndPhaseTurn','destroyEffectOwner','destroyEffectSource','reincarnated','mirrorjadeUnavailableTurn','effectTargetImmuneUntilTurn','effectDestructionImmuneUntilTurn','sparkProtection','sentToGyTurn'])delete x[key];
 x.summonType='SPECIAL';if(id(x)===34755994)H.markUsed(s,'ARTEMIS_SPECIAL_SUMMON');queueSummonTriggers(s,x,a.destination);
 return{activationEvents,events:[{type:'SPECIAL_SUMMON_FROM_GY',uid:x.uid,sourceUid:a.sourceUid,from:'gy',fromPlayer:targetPlayer,player:0,ownerPlayer,zoneIndex:a.destination,position:a.position,summonType:'SPECIAL',properSummonType:x.properSummonType??null,newProperSummon:false}]};
}});
const capabilities=()=>({version:'registered-monster-reborn-v1',action:TYPE,cardId:REBORN,activationZone:'hand',activationPacket:'SINGLE',spellSpeed:1,activationRestriction:'NONE',players:[0],phases:['MAIN 1','MAIN 2'],targetZones:['OWN_GY','OPPONENT_GY'],destinations:[0,1,2,3,4],positions:['ATTACK','DEFENSE'],linkPositions:['ATTACK'],mainNormalProfile:'TECHNICALLY_MATCHED_KNOWN_STATS_MAIN_NORMAL',mainEffectCardIds:[...mainEffects],extraProfiles:[...extraProfiles].map(([cardId,properSummonType])=>({cardId,properSummonType,requiresRegisteredProperSummon:true})),excludedProfiles:excludedProfiles.map(x=>({...x})),preservesOwnership:true,summonType:'SPECIAL',oncePerTurn:false,certified:false,limitations:['Reviewed summon profiles only; Xyz, Pendulum, Tokens, unreviewed summon conditions, attachments and leave-field redirects are excluded.','Extra targets require a genuine registered proper summon, not a declared setup flag or direct Extra-to-GY placement. Spark remains unavailable without a registered proper Synchro route.','Unknown face-up monster or Spell/Trap continuous effects exclude this packet. Optional responses are limited to the existing explicit registered policies.','Mo Ye and Gazelle keep their registered Special Summon triggers. Only the existing EMZ Sunlight Wolf geometry is modeled.','Artemis shares its printed once-per-turn Special Summon limit with its registered Link Summon; Monster Reborn itself has no once-per-turn limit.','A target is fixed by physical UID at activation and must remain eligible in a GY at resolution. No arbitrary chain priority is inferred.']});
W.YGOMonsterReborn=Object.freeze({version:'registered-monster-reborn-v1',capabilities});
Promise.resolve(W.YGODataCatalog?.ready).then(()=>{W.YGODuelPhases?.registerProfile(REBORN,{endPhaseSafe:true,note:'Registered Monster Reborn Normal Spell; no mandatory End Phase or continuous effect.'});}).catch(error=>console.error('MONSTER_REBORN_DUEL_PROFILE',error));
})();
