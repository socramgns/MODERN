/* Physical responses and declared quick-effect windows. No card-text eval.
 * A successful response is an executed transition, not a capacity estimate. */
(()=>{'use strict';
const W=window,E=W.YGOComboEngine;if(!E?.registerResponse)throw Error('RESPONSE_CORE_REQUIRED');
const H=E.helpers,I={VEILER:97268402,IMPERM:10045474,DROLL:94145021,CROW:24508238,MECHABA:75286621,CHIXIAO:69248256,MIRRORJADE:44146295,LUBELLION:70534340,CHENGYING:96633955,SPIRIT:59822133,SPARK:83994433,AZURE:40908371,ANCIENTS:71039903,BEWD:89631139};
const arr=x=>Array.isArray(x)?x:[],c=x=>H.card(x),id=x=>H.baseId(x),face=x=>x.faceUp===true;
const rows=(st,p,z,pred=()=>true)=>arr(st.zones[p]?.[z]).filter(pred);
const inMain=st=>['MAIN 1','MAIN 2'].includes(st.phase);
// These are between-action windows in the registered phase model. Resolving
// DUEL_ATTACK remains an atomic packet; no Damage Step priority is inferred.
const regularWindow=st=>['DRAW','STANDBY','MAIN 1','BATTLE','MAIN 2','END'].includes(st.phase)&&!st.duelEnded&&(st.phase!=='DRAW'||st.duel?.drawCompleted?.[st.turn]===true);
const open=st=>regularWindow(st)&&!arr(st.pendingTriggers).length&&!arr(st.chain).length;
const isNormal=x=>(Number(c(x).typeBits)&17)===17&&!(Number(c(x).typeBits)&0x1000000)&&!x.token;
const knownSafe=new Set([14558127,97268402,94145021,24508238,86120751,74063034,34755994,75286621,20001443,69248256,93490856,96633955,68468459,70534340,8240199,71039903,89631139,42097666,24382602,10045474,44362883,26889158,14812471,52277807,87871125,59822133,83994433,40908371,65124425]);
const safeZoneDeparture=x=>!x.token&&(isNormal(x)||knownSafe.has(id(x)));
const swordOrWyrm=x=>/swordsoul/i.test(String(c(x).name))||Number(c(x).race)===0x800000;
const usedKey=(name,p)=>p===0?name:name+':'+p;
const responseTypes=st=>arr(st.context?.responseTypes).map(x=>String(x).toUpperCase());
function enabled(st,type){return st.context?.opponentPolicy==='RESPONSES_EXPLICIT'&&responseTypes(st).includes(type);}
function actor(st,action){if(Number.isInteger(action?.player))return action.player;return H.locate(st,action?.sourceUid)?.player??0;}
const FIELD_EFFECTS=new Set(['ALEISTER_SEARCH','MOYE_TOKEN','CHIXIAO_SEARCH','CHIXIAO_CL1_MOYE_CL2','LUBELLION_FUSION_MIRRORJADE','SAGE_SEARCH_LIGHT_TUNER','SPIRIT_SEARCH_MAUSOLEUM','CHIXIAO_NEGATE','MIRRORJADE_BANISH','SALAMANGREAT_GAZELLE_SEND','SALAMANGREAT_BALELYNX_SEARCH']);
function fieldEffect(st,handler,action,targeting=true){
 if(!regularWindow(st)||!(FIELD_EFFECTS.has(handler.type)||handler.fieldMonsterEffect===true))return null;
 const source=H.locate(st,action.sourceUid),player=actor(st,action);
 if(source?.player!==player||source.zone!=='monster'||!face(source.item)||!(Number(c(source.item).typeBits)&0x20))return null;
 // These responses target after the activation cost has already been paid.
 // Mechaba negates an activation without targeting the activated monster.
 if(targeting&&(handler.sourceLeavesFieldAsCost===true||Number(source.item.effectTargetImmuneUntilTurn)>=st.turn))return null;
 return{source,player,responder:1-player};
}
function responseAction(action,type,uid,targetUid,player,extra={}){return{...action,response:{type,uid,targetUid,player,...extra}};}
function ensureResponse(action,type){if(action.response?.type!==type)throw Error('RESPONSE_TYPE_MISMATCH');return action.response;}
function setNegated(st,uid){const hit=H.locate(st,uid);if(hit?.zone!=='monster'||!face(hit.item))throw Error('FACE_UP_EFFECT_TARGET_REQUIRED');hit.item.effectsNegated=true;hit.item.negatedUntilTurn=st.turn;return hit;}

// A reviewed handler explicitly identifies one activated effect packet. The
// source location is read before that packet pays costs: discarding a hand
// effect never turns it into a Graveyard activation, while banishing a GY
// source as cost never changes where its effect was activated.
function graveyardActivation(st,handler,action){
 if(handler.gyActivationNegatable!==true||handler.activationPacket!=='SINGLE'||!['USE','ACTIVATION'].includes(handler.activationRestriction))return null;
 const source=H.locate(st,action.sourceUid);if(source?.zone!=='gy')return null;
 return{source,player:actor(st,action),restriction:handler.activationRestriction};
}
E.registerResponse({id:'SPIRIT',enumerate(st,handler,action){
 if(!enabled(st,'SPIRIT'))return[];const activation=graveyardActivation(st,handler,action);if(!activation)return[];
 // The adversarial FIRST_ELIGIBLE policy controls only the other player.
 // Explicit choice branches may also model the legal response to one's own
 // GY activation, without forcing that response in the opponent policy.
 const mode=st.context.responsePolicy||st.context.ashPolicy,players=mode==='CHOICE_BRANCHES'?[1-activation.player,activation.player]:[1-activation.player];
 return players.flatMap(player=>rows(st,player,'monster',x=>face(x)&&id(x)===I.SPIRIT&&!x.effectsNegated&&!H.isUsed(st,'SPIRIT_GY_NEGATE:'+x.uid)).map(source=>responseAction(action,'SPIRIT',source.uid,action.sourceUid,player,{activationZone:'gy',nonTargeting:true})));
},apply(st,action,handler){
 const r=ensureResponse(action,'SPIRIT'),source=H.locate(st,r.uid),activation=graveyardActivation(st,handler,action);
 if(!activation||r.targetUid!==action.sourceUid||r.activationZone!=='gy'||r.nonTargeting!==true||source?.player!==r.player||source.zone!=='monster'||!face(source.item)||id(source.item)!==I.SPIRIT||source.item.effectsNegated||H.isUsed(st,'SPIRIT_GY_NEGATE:'+r.uid))throw Error('SPIRIT_PHYSICAL_GY_ACTIVATION_REQUIRED');
 H.markUsed(st,'SPIRIT_GY_NEGATE:'+r.uid);
 return{negateEffect:true,negateActivation:true,paid:[],events:[{type:'SPIRIT_NEGATE_GY_ACTIVATION',player:r.player,uid:r.uid,activatedSourceUid:action.sourceUid,activationPlayer:activation.player,activationZone:'gy',restriction:activation.restriction,nonTargeting:true,negated:true,destroysSource:false}]};
}});

E.registerResponse({id:'VEILER',enumerate(st,handler,action){
 if(!enabled(st,'VEILER')||!inMain(st))return[];const hit=fieldEffect(st,handler,action);if(!hit||st.activePlayer!==hit.player)return[];
 return rows(st,hit.responder,'hand',x=>id(x)===I.VEILER).map(x=>responseAction(action,'VEILER',x.uid,action.sourceUid,hit.responder));
},apply(st,action){const r=ensureResponse(action,'VEILER'),hit=H.locate(st,r.uid);if(hit?.player!==r.player||hit.zone!=='hand'||id(hit.item)!==I.VEILER)throw Error('VEILER_PHYSICAL_COST_REQUIRED');H.move(st,r.uid,'gy');const target=setNegated(st,r.targetUid);
 return{negateEffect:true,events:[{type:'VEILER_NEGATE_EFFECT',player:r.player,uid:r.uid,targetUid:r.targetUid,targetPlayer:target.player,negated:true,untilTurn:st.turn}],paid:[{kind:'SEND_GY',uid:r.uid,player:r.player,from:'hand',to:'gy'}]};
}});

E.registerResponse({id:'IMPERM',enumerate(st,handler,action){
 if(!enabled(st,'IMPERM'))return[];const hit=fieldEffect(st,handler,action);if(!hit)return[];const options=[];
 const noCards=!rows(st,hit.responder,'monster').length&&!rows(st,hit.responder,'spelltrap').length;
 if(noCards)for(const x of rows(st,hit.responder,'hand',x=>id(x)===I.IMPERM))options.push(responseAction(action,'IMPERM',x.uid,action.sourceUid,hit.responder,{from:'hand'}));
 for(const x of rows(st,hit.responder,'spelltrap',x=>id(x)===I.IMPERM&&x.faceUp===false&&Number.isInteger(x.setTurn)&&x.setTurn<st.turn&&Number.isInteger(x.zoneIndex)&&x.zoneIndex>=0&&x.zoneIndex<=4))options.push(responseAction(action,'IMPERM',x.uid,action.sourceUid,hit.responder,{from:'spelltrap',column:x.zoneIndex}));
 return options;
},apply(st,action){const r=ensureResponse(action,'IMPERM'),hit=H.locate(st,r.uid);if(hit?.player!==r.player||hit.zone!==r.from||id(hit.item)!==I.IMPERM)throw Error('IMPERM_PHYSICAL_ACTIVATION_REQUIRED');
 if(r.from==='hand'&&(rows(st,r.player,'monster').length||rows(st,r.player,'spelltrap').length))throw Error('IMPERM_HAND_REQUIRES_NO_CARDS');
 if(r.from==='spelltrap'&&(!(hit.item.setTurn<st.turn)||hit.item.faceUp!==false||hit.item.zoneIndex!==r.column))throw Error('IMPERM_SET_TURN_OR_COLUMN_INVALID');
 const target=setNegated(st,r.targetUid),events=[{type:'IMPERM_TRAP_ACTIVATION',player:r.player,uid:r.uid,from:r.from},{type:'IMPERM_NEGATE_EFFECT',player:r.player,uid:r.uid,targetUid:r.targetUid,targetPlayer:target.player,negated:true,untilTurn:st.turn}];
 // The response packet resolves without another response to Impermanence.
 // The set card is still on the field at that modeled resolution.
 if(r.from==='spelltrap'){st.locks.push({kind:'IMPERM_COLUMN_NEGATED',wholeTurn:true,untilTurn:st.turn,column:r.player===0?r.column:4-r.column,sourceColumn:r.column,appliesToPlayers:[0,1],sourceUid:r.uid,description:'Se niegan otros efectos de Mágicas/Trampas en esta columna hasta el final del turno.'});events.push({type:'IMPERM_COLUMN_NEGATION_APPLIED',column:r.column,untilTurn:st.turn});}
 H.move(st,r.uid,'gy');return{negateEffect:true,events,paid:[]};
}});

E.registerResponse({id:'CHIXIAO',enumerate(st,handler,action){
 if(!enabled(st,'CHIXIAO'))return[];const hit=fieldEffect(st,handler,action);if(!hit||H.isUsed(st,usedKey('CHIXIAO_EFFECT',hit.responder)))return[];const out=[];
 for(const source of rows(st,hit.responder,'monster',x=>face(x)&&id(x)===I.CHIXIAO&&!x.effectsNegated))for(const cost of ['hand','gy'].flatMap(z=>rows(st,hit.responder,z,x=>swordOrWyrm(x)&&safeZoneDeparture(x))))out.push(responseAction(action,'CHIXIAO',source.uid,action.sourceUid,hit.responder,{costUid:cost.uid}));return out;
},apply(st,action){const r=ensureResponse(action,'CHIXIAO'),source=H.locate(st,r.uid),cost=H.locate(st,r.costUid);if(source?.player!==r.player||source.zone!=='monster'||!face(source.item)||id(source.item)!==I.CHIXIAO||source.item.effectsNegated||cost?.player!==r.player||!['hand','gy'].includes(cost.zone)||!swordOrWyrm(cost.item)||!safeZoneDeparture(cost.item))throw Error('CHIXIAO_PHYSICAL_PRECONDITIONS_REQUIRED');
 H.markUsed(st,usedKey('CHIXIAO_EFFECT',r.player));const origin=cost.zone;H.move(st,r.costUid,'banished');setNegated(st,r.targetUid);return{negateEffect:true,events:[{type:'CHIXIAO_NEGATE_EFFECT',player:r.player,uid:r.uid,targetUid:r.targetUid,negated:true,untilTurn:st.turn}],paid:[{kind:'BANISH',uid:r.costUid,player:r.player,from:origin,to:'banished'}]};
}});

// Registered packets distinguish Spell CARD activation from Spell/Trap
// EFFECT activation. In particular, Invocation/Roar GY effects are not valid
// Mechaba windows. Only the three reviewed Normal Spell card activations are
// staged by the core; Field Spell replacement and arbitrary chains remain out.
const normalSpellPackets=new Map([['INVOCATION_MECHABA',74063034],['BRANDED_FUSION_LUBELLION',44362883],['TENYI_VESSEL',65124425]]);
// Explicitly reviewed monster-effect packets, not every hand/GY action or
// catalogue identity. Summon procedures and Spell/Trap effects never enter here.
const nonFieldMonsterPackets=new Map([
 ['TENYI_HAND_SPECIAL',{ids:[87052196,98159737,23431858,24557335],zones:['hand'],restriction:'USE'}],
 ['TENYI_ASHUNA_DECK',{ids:[87052196],zones:['hand','gy'],restriction:'USE'}],
 ['TENYI_ADHARA_RECOVER',{ids:[98159737],zones:['hand','gy'],restriction:'USE'}],
 ['TENYI_VISHUDA_BOUNCE',{ids:[23431858],zones:['hand','gy'],restriction:'USE'}],
 ['SALAMANGREAT_GAZELLE_HAND',{ids:[26889158],zones:['hand'],restriction:'USE'}],
 ['SALAMANGREAT_SPINNY_DISCARD',{ids:[52277807],zones:['hand'],restriction:'USE'}],
 ['SALAMANGREAT_SPINNY_REVIVE',{ids:[52277807],zones:['gy'],restriction:'USE'}],
 ['MOYE_DRAW',{ids:[20001443],zones:['gy'],restriction:'USE'}],
 ['DUEL_ANCIENTS_END_SUMMON',{ids:[71039903],zones:['gy'],restriction:'ACTIVATION'}],
 ['ANCIENTS_RECOVER_BLUE_EYES',{ids:[71039903],zones:['gy'],restriction:'USE'}],
 ['TENYI_SHTHANA_REVIVE',{ids:[24557335],zones:['hand','gy'],restriction:'USE'}],
 ['LONGYUAN_SPECIAL',{ids:[93490856],zones:['hand'],restriction:'USE'}],
 ['LONGYUAN_BURN',{ids:[93490856],zones:['gy'],restriction:'USE'}]
]);
function nonFieldMonsterPacket(st,handler,action,executionContext){
 const definition=nonFieldMonsterPackets.get(handler.type),source=H.locate(st,action.sourceUid),player=actor(st,action);
 if(!definition||!regularWindow(st)||handler.monsterEffect!==true||handler.activationPacket!=='SINGLE'||handler.activationRestriction!==definition.restriction||source?.player!==player||!definition.zones.includes(source.zone)||!arr(handler.activationZones).includes(source.zone)||!definition.ids.includes(id(source.item))||(Number(c(source.item).typeBits)&33)!==33)return null;
 const origin=executionContext?.activationOrigin;
 if(executionContext&&(!origin||origin.sourceUid!==action.sourceUid||origin.player!==player||origin.zone!==source.zone||origin.handler!==handler.type||origin.packet!=='SINGLE'||origin.restriction!==definition.restriction))return null;
 return{source,player,responder:1-player,kind:'MONSTER_EFFECT',cardType:'MONSTER',originZone:source.zone,registeredMonsterPacket:handler.type,activationSourceCardId:id(source.item)};
}
function mechabaPacket(st,handler,action,executionContext){
 if(handler.type==='CHIXIAO_CL1_MOYE_CL2')return null;
 const nonField=nonFieldMonsterPacket(st,handler,action,executionContext);if(nonField)return nonField;
 const field=fieldEffect(st,handler,action,false);if(field&&safeZoneDeparture(field.source.item))return{...field,kind:'MONSTER_EFFECT',cardType:'MONSTER',originZone:'monster'};
 const expected=normalSpellPackets.get(handler.type),source=H.locate(st,action.sourceUid),player=actor(st,action),prepared=executionContext?.normalSpellActivation;
 if(!expected||handler.cardActivation!=='NORMAL_SPELL'||handler.activationPacket!=='SINGLE'||handler.activationCardId!==expected||source?.player!==player||id(source.item)!==expected||Number(c(source.item).typeBits)!==2)return null;
 if(prepared){if(prepared.kind!=='NORMAL_SPELL_CARD_ACTIVATION'||prepared.sourceUid!==action.sourceUid||prepared.player!==player||prepared.cardId!==expected||prepared.originZone!=='hand'||prepared.activationZone!=='spelltrap'||executionContext.activationOrigin?.zone!=='hand'||source.zone!=='spelltrap'||!face(source.item)||source.item.zoneIndex!==prepared.column)return null;}
 else if(source.zone!=='hand')return null;
 return{source,player,responder:1-player,kind:'SPELL_CARD_ACTIVATION',cardType:'SPELL',originZone:'hand'};
}
const matchingCost=(item,type)=>safeZoneDeparture(item)&&((type==='MONSTER'&&!!(Number(c(item).typeBits)&1))||(type==='SPELL'&&!!(Number(c(item).typeBits)&2))||(type==='TRAP'&&!!(Number(c(item).typeBits)&4)));
E.registerResponse({id:'MECHABA',modeledCardTypes:['MONSTER','SPELL'],costEligible:safeZoneDeparture,chainPacket(st,action){const r=action.response,source=H.locate(st,r?.uid);if(r?.type!=='MECHABA'||source?.player!==r.player||source.zone!=='monster'||!face(source.item)||id(source.item)!==I.MECHABA||source.item.effectsNegated)return null;return{providerId:'MECHABA',kind:'MONSTER_EFFECT',cardType:'MONSTER',spellSpeed:2,player:r.player,sourceUid:r.uid,sourceCardId:I.MECHABA,activationZone:'monster',activationNegatable:true};},enumerate(st,handler,action){
 if(!enabled(st,'MECHABA'))return[];const hit=mechabaPacket(st,handler,action);if(!hit)return[];const out=[];
 for(const source of rows(st,hit.responder,'monster',x=>face(x)&&id(x)===I.MECHABA&&!x.effectsNegated&&!H.isUsed(st,'MECHABA_NEGATE:'+x.uid)))for(const cost of rows(st,hit.responder,'hand',x=>matchingCost(x,hit.cardType)))out.push(responseAction(action,'MECHABA',source.uid,action.sourceUid,hit.responder,{costUid:cost.uid,activationZone:hit.originZone,activationKind:hit.kind,matchingCardType:hit.cardType,nonTargeting:true,...(hit.registeredMonsterPacket?{registeredMonsterPacket:hit.registeredMonsterPacket,activationSourceCardId:hit.activationSourceCardId}:{})}));return out;
},apply(st,action,handler,api,executionContext){const r=ensureResponse(action,'MECHABA'),source=H.locate(st,r.uid),cost=H.locate(st,r.costUid),packet=mechabaPacket(st,handler,action,executionContext);if(!packet||r.player!==packet.responder||r.targetUid!==action.sourceUid||r.activationZone!==packet.originZone||r.activationKind!==packet.kind||r.matchingCardType!==packet.cardType||r.nonTargeting!==true||packet.registeredMonsterPacket&&(r.registeredMonsterPacket!==packet.registeredMonsterPacket||r.activationSourceCardId!==packet.activationSourceCardId)||source?.player!==r.player||source.zone!=='monster'||!face(source.item)||id(source.item)!==I.MECHABA||source.item.effectsNegated||cost?.player!==r.player||cost.zone!=='hand'||!matchingCost(cost.item,packet.cardType)||H.isUsed(st,'MECHABA_NEGATE:'+r.uid))throw Error('MECHABA_PHYSICAL_PRECONDITIONS_REQUIRED');
 H.markUsed(st,'MECHABA_NEGATE:'+r.uid);H.move(st,r.costUid,'gy');return{negateEffect:true,negateActivation:true,events:[{type:'MECHABA_NEGATE_ACTIVATION',player:r.player,uid:r.uid,targetUid:r.targetUid,activationKind:packet.kind,matchingCardType:packet.cardType,nonTargeting:true,negated:true}],paid:[{kind:'SEND_GY',uid:r.costUid,player:r.player,from:'hand',to:'gy'}]};
},onActivationNegated(st,action){const r=ensureResponse(action,'MECHABA'),source=H.locate(st,r.uid);if(source?.player===r.player&&source.zone==='monster'&&face(source.item)&&id(source.item)===I.MECHABA&&H.isUsed(st,'MECHABA_NEGATE:'+r.uid)){delete st.used['MECHABA_NEGATE:'+r.uid];return{events:[{type:'MECHABA_ACTIVATION_LIMIT_RELEASED',uid:r.uid,player:r.player,reason:'ACTIVATION_NEGATED_WHILE_SAME_REGISTERED_FIELD_SOURCE_REMAINS',costRefunded:false}]};}return{events:[]};},postApply(st,action,handler,api,executionContext){const r=ensureResponse(action,'MECHABA'),target=H.locate(st,r.targetUid),normal=executionContext?.normalSpellActivation;
 if(r.activationKind==='SPELL_CARD_ACTIVATION'){
  if(!normal||normal.sourceUid!==r.targetUid||normal.cardId!==normalSpellPackets.get(handler.type)||target?.zone!=='spelltrap'||target.player!==normal.player||!face(target.item)||target.item.zoneIndex!==normal.column)throw Error('MECHABA_NORMAL_SPELL_ACTIVATION_LOCATION_LOST');
  H.move(st,r.targetUid,'banished');return{events:[{type:'MECHABA_BANISH_ACTIVATED_CARD',player:r.player,uid:r.uid,targetUid:r.targetUid,from:'spelltrap',activationKind:r.activationKind,banished:true}]};
 }
 if(r.registeredMonsterPacket){
  const definition=nonFieldMonsterPackets.get(handler.type),origin=executionContext?.activationOrigin;
  if(!definition||r.registeredMonsterPacket!==handler.type||!definition.ids.includes(r.activationSourceCardId)||!definition.zones.includes(r.activationZone)||origin?.sourceUid!==r.targetUid||origin.player!==1-r.player||origin.zone!==r.activationZone)throw Error('MECHABA_REGISTERED_MONSTER_ORIGIN_REQUIRED');
  // Official Japanese database FAQ 16041/22388/23949 explicitly distinguish
  // negating an activation from banishing a source that left its activation
  // location as cost. These registered packets never return that source to
  // the same zone before this resolution; no general instance rule is claimed.
  if(target?.player===origin.player&&target.zone===origin.zone&&id(target.item)===r.activationSourceCardId){H.move(st,r.targetUid,'banished');return{events:[{type:'MECHABA_BANISH_ACTIVATED_CARD',player:r.player,uid:r.uid,targetUid:r.targetUid,from:origin.zone,activationKind:r.activationKind,registeredMonsterPacket:r.registeredMonsterPacket,banished:true}]};}
  return{events:[{type:'MECHABA_BANISH_NOT_APPLIED',player:r.player,uid:r.uid,targetUid:r.targetUid,activationZone:origin.zone,currentZone:target?.zone||null,registeredMonsterPacket:r.registeredMonsterPacket,reason:'REGISTERED_SOURCE_LEFT_ACTIVATION_LOCATION',costsPreserved:true}]};
 }
 if(target?.zone==='monster'&&safeZoneDeparture(target.item)){H.move(st,r.targetUid,'banished');return{events:[{type:'MECHABA_BANISH_ACTIVATED_CARD',player:r.player,uid:r.uid,targetUid:r.targetUid,from:'monster',activationKind:r.activationKind,banished:true}]};}
 return{events:[{type:'MECHABA_BANISH_NOT_APPLIED',player:r.player,uid:r.uid,targetUid:r.targetUid,reason:'Source no longer in its activation location or unsupported leaving effect.'}]};
}});

function appendOptionalDeparture(st,events,target,player){
 if(id(target)===I.MIRRORJADE&&target.ownerPlayer!==player&&target.summonType==='FUSION'){
  st.delayedEffects=arr(st.delayedEffects);st.delayedEffects.push({kind:'MIRRORJADE_END_PHASE_DESTROY',player:target.ownerPlayer,sourceUid:target.uid,scheduledTurn:st.turn});events.push({type:'MIRRORJADE_LEAVING_TRIGGER_ACTIVATED',player:target.ownerPlayer,uid:target.uid,scheduledTurn:st.turn});
 }
}
E.registerHandler({type:'DD_CROW_BANISH',scope:'DUEL',enumerate:st=>open(st)?[0,1].flatMap(player=>rows(st,player,'hand',x=>id(x)===I.CROW).flatMap(source=>rows(st,1-player,'gy',safeZoneDeparture).map(target=>({type:'DD_CROW_BANISH',player,sourceUid:source.uid,targetUid:target.uid})))):[],apply:(st,a)=>{
 const source=H.locate(st,a.sourceUid),target=H.locate(st,a.targetUid);if(source?.player!==a.player||source.zone!=='hand'||id(source.item)!==I.CROW||target?.player!==1-a.player||target.zone!=='gy'||!safeZoneDeparture(target.item))throw Error('CROW_PHYSICAL_PRECONDITIONS_REQUIRED');H.move(st,a.sourceUid,'gy');
 if(a.effectNegated||a.ashNegated)return{paid:[{kind:'DISCARD',uid:a.sourceUid,player:a.player,from:'hand',to:'gy'}],events:[{type:'CROW_EFFECT_NEGATED',player:a.player,uid:a.sourceUid,targetUid:a.targetUid}]};
 H.move(st,a.targetUid,'banished');return{paid:[{kind:'DISCARD',uid:a.sourceUid,player:a.player,from:'hand',to:'gy'}],events:[{type:'TARGET',player:a.player,uid:a.targetUid,zone:'gy'},{type:'DD_CROW_BANISH',player:a.player,uid:a.sourceUid,targetUid:a.targetUid,banished:true}]};
}});

E.registerHandler({type:'CHIXIAO_NEGATE',scope:'DUEL',fieldMonsterEffect:true,enumerate:st=>open(st)?[0,1].flatMap(player=>!H.isUsed(st,usedKey('CHIXIAO_EFFECT',player))?rows(st,player,'monster',x=>face(x)&&id(x)===I.CHIXIAO).flatMap(source=>['hand','gy'].flatMap(z=>rows(st,player,z,x=>swordOrWyrm(x)&&safeZoneDeparture(x))).flatMap(cost=>[0,1].flatMap(targetPlayer=>rows(st,targetPlayer,'monster',x=>face(x)&&(Number(c(x).typeBits)&0x20)&&x.uid!==source.uid).map(target=>({type:'CHIXIAO_NEGATE',player,sourceUid:source.uid,costUid:cost.uid,targetUid:target.uid}))))):[]):[],apply:(st,a)=>{
 const source=H.locate(st,a.sourceUid),cost=H.locate(st,a.costUid);H.markUsed(st,usedKey('CHIXIAO_EFFECT',a.player));const origin=cost.zone;H.move(st,a.costUid,'banished');const paid=[{kind:'BANISH',uid:a.costUid,player:a.player,from:origin,to:'banished'}];
 if(a.effectNegated||a.ashNegated||source.item.effectsNegated)return{paid,events:[{type:'CHIXIAO_EFFECT_NEGATED',player:a.player,uid:a.sourceUid,targetUid:a.targetUid}]};
 setNegated(st,a.targetUid);return{paid,events:[{type:'TARGET',player:a.player,uid:a.targetUid,zone:'monster'},{type:'CHIXIAO_NEGATE_EFFECT',player:a.player,uid:a.sourceUid,targetUid:a.targetUid,negated:true,untilTurn:st.turn}]};
}});

E.registerHandler({type:'MIRRORJADE_BANISH',scope:'DUEL',fieldMonsterEffect:true,activationRestriction:'ACTIVATION',enumerate:st=>open(st)?[0,1].flatMap(player=>rows(st,player,'monster',x=>face(x)&&id(x)===I.MIRRORJADE&&!H.isUsed(st,'MIRRORJADE_BANISH:'+x.uid)&&x.mirrorjadeUnavailableTurn!==st.turn).flatMap(source=>rows(st,player,'extra',x=>id(x)===I.LUBELLION).flatMap(cost=>[0,1].flatMap(targetPlayer=>rows(st,targetPlayer,'monster',x=>face(x)&&(safeZoneDeparture(x)||id(x)===I.MIRRORJADE)).map(target=>({type:'MIRRORJADE_BANISH',player,sourceUid:source.uid,costUid:cost.uid,banishUid:target.uid})))))):[],apply:(st,a)=>{
 const source=H.locate(st,a.sourceUid),cost=H.locate(st,a.costUid);if(cost?.player!==a.player||cost.zone!=='extra'||id(cost.item)!==I.LUBELLION)throw Error('MIRRORJADE_EXTRA_FUSION_COST_REQUIRED');if(!a.activationNegated)H.markUsed(st,'MIRRORJADE_BANISH:'+a.sourceUid);H.move(st,a.costUid,'gy');const paid=[{kind:'SEND_GY',uid:a.costUid,player:a.player,from:'extra',to:'gy'}];
 if(a.effectNegated||a.activationNegated||a.ashNegated||source.item.effectsNegated)return{paid,events:[{type:'MIRRORJADE_EFFECT_NEGATED',player:a.player,uid:a.sourceUid,costUid:a.costUid}]};
 const target=H.locate(st,a.banishUid);if(target?.zone!=='monster'||!face(target.item))throw Error('MIRRORJADE_RESOLUTION_MONSTER_REQUIRED');const departed=structuredClone(target.item),events=[{type:'SELECT_AT_RESOLUTION',player:a.player,uid:a.banishUid,nonTargeting:true}];H.move(st,a.banishUid,'banished');const remaining=H.locate(st,a.sourceUid);if(remaining?.zone==='monster')remaining.item.mirrorjadeUnavailableTurn=st.turn+1;
 appendOptionalDeparture(st,events,departed,a.player);events.push({type:'MIRRORJADE_BANISH',player:a.player,uid:a.sourceUid,banishUid:a.banishUid,nonTargeting:true,banished:true,cannotUseTurn:st.turn+1});return{paid,events};
}});

E.registerHandler({type:'DROLL_LOCK',scope:'DUEL',enumerate:st=>open(st)&&!st.locks.some(l=>l.kind==='NO_DECK_TO_HAND'&&l.untilTurn>=st.turn)?arr(st.drollWindows).filter(w=>w.turn===st.turn).flatMap(w=>rows(st,1-w.player,'hand',x=>id(x)===I.DROLL).map(source=>({type:'DROLL_LOCK',player:1-w.player,sourceUid:source.uid,afterPlayer:w.player,eventIndex:w.eventIndex}))):[],apply:(st,a)=>{
 const source=H.locate(st,a.sourceUid);if(source?.player!==a.player||source.zone!=='hand'||id(source.item)!==I.DROLL)throw Error('DROLL_PHYSICAL_COST_REQUIRED');H.move(st,a.sourceUid,'gy');const paid=[{kind:'SEND_GY',uid:a.sourceUid,player:a.player,from:'hand',to:'gy'}];
 if(a.effectNegated||a.ashNegated)return{paid,events:[{type:'DROLL_EFFECT_NEGATED',player:a.player,uid:a.sourceUid}]};
 st.locks.push({kind:'NO_DECK_TO_HAND',wholeTurn:true,untilTurn:st.turn,appliesToPlayers:[0,1],sourceUid:a.sourceUid,description:'Ningún jugador puede añadir cartas del Main Deck a la mano durante el resto del turno.'});return{paid,events:[{type:'DROLL_LOCK_APPLIED',player:a.player,uid:a.sourceUid,affectedPlayers:[0,1],untilTurn:st.turn}]};
}});

// The separate GY recovery effect uses a hard once-per-turn USE restriction.
// This reviewed route admits Blue-Eyes White Dragon; other "Blue-Eyes"
// identities need an explicit departure/recovery profile before admission.
E.registerHandler({type:'ANCIENTS_RECOVER_BLUE_EYES',scope:'DUEL',monsterEffect:true,activationZones:['gy'],gyActivationNegatable:true,activationPacket:'SINGLE',activationRestriction:'USE',enumerate:st=>open(st)?[st.activePlayer].flatMap(player=>!H.isUsed(st,usedKey('ANCIENTS_RECOVER_BLUE_EYES',player))?rows(st,player,'gy',x=>id(x)===I.ANCIENTS).flatMap(source=>rows(st,player,'gy',x=>id(x)===I.BEWD).map(target=>({type:'ANCIENTS_RECOVER_BLUE_EYES',player,sourceUid:source.uid,targetUid:target.uid}))):[]):[],apply:(st,a)=>{
 const source=H.locate(st,a.sourceUid),target=H.locate(st,a.targetUid);if(source?.player!==a.player||source.zone!=='gy'||id(source.item)!==I.ANCIENTS||target?.player!==a.player||target.zone!=='gy'||id(target.item)!==I.BEWD)throw Error('ANCIENTS_RECOVERY_PHYSICAL_GY_REQUIRED');
 H.markUsed(st,usedKey('ANCIENTS_RECOVER_BLUE_EYES',a.player));H.move(st,a.sourceUid,'banished');
 const paid=[{kind:'BANISH',uid:a.sourceUid,player:a.player,from:'gy',to:'banished'}],activationEvents=[{type:'ACTIVATE_GY_EFFECT',effect:'ANCIENTS_RECOVER_BLUE_EYES',uid:a.sourceUid,player:a.player},{type:'TARGET',uid:a.targetUid,player:a.player,zone:'gy'}];
 if(a.ashNegated||a.effectNegated||a.activationNegated)return{paid,activationEvents,events:[{type:'ANCIENTS_RECOVERY_NEGATED',uid:a.sourceUid,targetUid:a.targetUid,player:a.player}]};
 H.move(st,a.targetUid,'hand');return{paid,activationEvents,events:[{type:'RECOVER_FROM_GY',uid:a.targetUid,sourceUid:a.sourceUid,player:a.player}]};
}});

E.registerLifecycle({id:'physical-responses-v1',initialize(st){st.responseEventCursor=arr(st.events).length;st.drollWindows=[];},refresh(st){
 const cursor=Number.isInteger(st.responseEventCursor)?st.responseEventCursor:0,events=arr(st.events).slice(cursor),windows=[];
 for(let n=0;n<events.length;n++){const event=events[n];let uid=null;
  if(event.type==='SEARCH'&&event.from==='deck'&&event.to==='hand')uid=event.uid;
  if(event.type==='MOYE_DRAW')uid=event.uid;
  if(event.type==='RESOLVE_CHAIN_LINK'&&event.effect==='MOYE_DRAW'&&event.drawnUid)uid=event.drawnUid;
  const hit=uid?H.locate(st,uid):null;if(hit?.zone==='hand'&&st.phase!=='DRAW')windows.push({player:hit.player,turn:st.turn,eventIndex:cursor+n});
 }
 st.drollWindows=windows;st.responseEventCursor=arr(st.events).length;
},validateTransition(before,after){
 const lock=arr(before.locks).find(l=>l.kind==='NO_DECK_TO_HAND'&&Number(l.untilTurn)>=before.turn);if(!lock||after.turn!==before.turn)return;
 for(const player of [0,1]){const original=new Set(rows(before,player,'deck').map(x=>x.uid));if(rows(after,player,'hand').some(x=>original.has(x.uid)))throw Error('DROLL_PREVENTS_DECK_TO_HAND');}
},witnesses(st){const interruptions=[];
 for(const player of [0,1])for(const x of rows(st,player,'monster',x=>face(x)&&!x.effectsNegated)){
  if(id(x)===I.SPIRIT)interruptions.push({uid:x.uid,player,kind:'GY_ACTIVATION_NEGATE',effectId:'SPIRIT_GY_NEGATE',available:!H.isUsed(st,'SPIRIT_GY_NEGATE:'+x.uid),requirementsMet:true,sourceZone:'monster',window:'REGISTERED_SINGLE_GY_EFFECT_ACTIVATION',capacityOnly:true,maximumUses:1,sharedBudgetKey:'SPIRIT_GY_NEGATE:'+x.uid,conditions:['Requires a registered single effect activated in the Graveyard before its costs are paid.','Negates the activation without targeting or destroying its source.']});
  if(id(x)===I.MIRRORJADE){const costs=rows(st,player,'extra',x=>id(x)===I.LUBELLION);interruptions.push({uid:x.uid,player,kind:'NON_TARGET_BANISH',effectId:'MIRRORJADE_BANISH',available:costs.length>0&&!H.isUsed(st,'MIRRORJADE_BANISH:'+x.uid)&&x.mirrorjadeUnavailableTurn!==st.turn,requirementsMet:costs.length>0,sourceZone:'monster',window:'OPEN_MAIN_PHASE_QUICK_EFFECT',capacityOnly:true,maximumUses:1,sharedBudgetKey:'MIRRORJADE_BANISH:'+x.uid,costWitnesses:costs.map(v=>v.uid),conditions:['Requires a monster at resolution and an admitted Extra Deck Fusion cost.']});}
 }
 return{interruptions};
}});
W.YGOResponses=Object.freeze({version:'physical-responses-v3',ids:Object.freeze(I),enabled,capabilities:()=>({responseTypes:['VEILER','IMPERM','CHIXIAO','MECHABA','SPIRIT'],quickEffects:['DD_CROW_BANISH','CHIXIAO_NEGATE','MIRRORJADE_BANISH','DROLL_LOCK'],graveyardEffects:['ANCIENTS_RECOVER_BLUE_EYES'],mechabaNormalSpellActivations:[...normalSpellPackets.keys()],mechabaNonFieldMonsterActivations:[...nonFieldMonsterPackets].map(([type,entry])=>({type,cardIds:[...entry.ids],activationZones:[...entry.zones],restriction:entry.restriction})),mechabaModeledCardTypes:['MONSTER','SPELL'],mechabaBanishScope:'SAME_REGISTERED_ACTIVATION_LOCATION_WITH_NO_SOURCE_RETURN_CYCLE',scope:'Physical costs and registered activation windows; explicit Mechaba/Roar counter packets use the bounded chain contract.',limitations:['Spirit negates only explicitly registered single GY-effect packets; compound trigger chains and unregistered counter-response packets are excluded. FIRST_ELIGIBLE uses opposing Spirits; responding to one\'s own GY effect requires CHOICE_BRANCHES.','Ancients recovery currently admits the reviewed Blue-Eyes White Dragon identity, not every Blue-Eyes card.','Mechaba covers single registered field-monster effects, the explicit hand/GY monster packet registry, and the Invocation, Branded Fusion and Vessel Normal Spell CARD activations. Spell/Trap GY effects, unregistered monster packets, Field Spell replacement, Trap Card activations and the joint Chixiao/Mo Ye chain remain excluded. A source that left its registered activation location is not banished again.','Droll windows cover modeled searches and Mo Ye effect draws; ordinary Draw Phase draws do not open a window.','Crow and Mirrorjade admit reviewed zone-departure profiles; unknown mandatory triggers are excluded.','Counter-responses require an explicitly registered packet contract; arbitrary chain priority remains outside scope.'],certified:false})});
})();
