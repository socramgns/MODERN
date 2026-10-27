/* Exact, declared-scope Branded and Blue-Eyes handlers. Card text is data;
 * no effect is created by evaluating it. Stops in Main Phase 1. */
(()=>{'use strict';
const W=window,E=W.YGOComboEngine;if(!E)throw Error('ARCHETYPE_CORE_REQUIRED');
const I={SAGE:8240199,SPIRIT:42097666,MAUSOLEUM:24382602,ANCIENTS:71039903,BEWD:89631139,SPIRIT_DRAGON:59822133,VEILER:97268402,
 BF:44362883,ALBAZ:68468459,LUBELLION:70534340,MIRRORJADE:44146295,ALEISTER:86120751,INVOCATION:74063034};
const H=E.helpers,arr=x=>Array.isArray(x)?x:[],c=x=>H.card(x),id=x=>H.baseId(x),own=(st,z,fn=()=>true)=>arr(st.zones[0][z]).filter(fn);
const idle=st=>!st.pendingTriggers.length,face=x=>x.faceUp===true;
const isLight=x=>Number(c(x).attribute)===16||['LIGHT','LUZ'].includes(String(c(x).attribute).toUpperCase());
const isDark=x=>Number(c(x).attribute)===32||['DARK','OSCURIDAD'].includes(String(c(x).attribute).toUpperCase());
const normal=x=>(Number(c(x).typeBits)&17)===17&&!(Number(c(x).typeBits)&0x1000000)&&!x.token;
const level=x=>Number(c(x).level),race=x=>Number(c(x).race);
const extraType=x=>!!(Number(c(x).typeBits)&(0x40|0x2000|0x800000|0x4000000));
const fieldSpells=st=>own(st,'spelltrap',x=>x.fieldSpell===true);
const inMonster=(st,uid)=>{const hit=H.locate(st,uid);return hit?.player===0&&hit.zone==='monster'&&face(hit.item)};
const knownGY=new Set([I.SAGE,I.ANCIENTS,I.ALBAZ,I.BF,I.MAUSOLEUM,I.ALEISTER,I.INVOCATION,I.VEILER]);
const safeDiscard=x=>normal(x)||knownGY.has(id(x));
const safeLinkMaterial=x=>normal(x)||[I.SAGE,I.ANCIENTS,I.VEILER,I.ALBAZ,I.ALEISTER].includes(id(x));
function isExtraAllowed(st,kind,target){return st.locks.every(lock=>{
 if(lock.kind==='FUSION_ONLY')return kind==='FUSION';
 if(lock.kind==='SYNCHRO_ONLY'&&H.locate(st,lock.sourceUid)?.zone==='monster')return kind==='SYNCHRO';
 if(lock.kind==='DRAGON_ONLY'&&H.locate(st,lock.sourceUid)?.zone==='monster')return race(target)===8192;
 return true;
});}
function sent(st,uid,zone,extra={}){const x=H.move(st,uid,zone,extra);if(zone==='gy')x.sentToGyTurn=st.turn;return x;}
function pending(st,kind){return st.pendingTriggers.filter(t=>t.kind===kind);}
function register(def){E.registerHandler(def);}
register({type:'BRANDED_NORMAL_SUMMON_ALBAZ',enumerate:st=>idle(st)&&st.normalSummonAvailable[0]&&H.mainRoom(st)?own(st,'hand',x=>id(x)===I.ALBAZ).map(x=>({type:'BRANDED_NORMAL_SUMMON_ALBAZ',sourceUid:x.uid})):[],apply:(st,a)=>{
 const x=H.move(st,a.sourceUid,'monster');x.summonType='NORMAL';st.normalSummonAvailable[0]=false;
 return{events:[{type:'NORMAL_SUMMON',uid:x.uid,player:0},{type:'OPTIONAL_EFFECT_DECLINED',uid:x.uid,effect:'ALBAZ_ON_SUMMON_FUSION',scope:'The Albaz summon effect is not resolved by this handler.'}]};
}});
register({type:'BRANDED_FUSION_LUBELLION',cardActivation:'NORMAL_SPELL',activationCardId:I.BF,activationPacket:'SINGLE',activationRestriction:'ACTIVATION',ashable:true,enumerate:st=>{
 if(!idle(st)||H.isUsed(st,'BRANDED_FUSION_ACTIVATED')||st.extraHistory.some(kind=>kind!=='FUSION'))return[];
 const out=[],pool=['deck','hand','monster'].flatMap(z=>own(st,z,x=>(Number(c(x).typeBits)&1)&&!x.token).map(x=>({x,z})));
 for(const spell of own(st,'hand',x=>id(x)===I.BF))for(const fusion of own(st,'extra',x=>id(x)===I.LUBELLION&&isExtraAllowed(st,'FUSION',x)))
  for(const albaz of pool.filter(p=>id(p.x)===I.ALBAZ))for(const dark of pool.filter(p=>isDark(p.x)&&(normal(p.x)||id(p.x)===I.ALBAZ)))
   if(albaz.x.uid!==dark.x.uid&&(H.mainRoom(st)||[albaz.x,dark.x].some(x=>H.locate(st,x.uid)?.zone==='monster'&&x.zoneIndex!==5)))out.push({type:'BRANDED_FUSION_LUBELLION',sourceUid:spell.uid,fusionUid:fusion.uid,materialUids:[albaz.x.uid,dark.x.uid]});
 return out;
},apply:(st,a)=>{
 if(!a.activationNegated){H.markUsed(st,'BRANDED_FUSION_ACTIVATED');st.locks.push({kind:'FUSION_ONLY',sourceUid:a.sourceUid,wholeTurn:true});}
 const activationEvents=[{type:'SPELL_ACTIVATION',uid:a.sourceUid,effect:'BRANDED_FUSION',activationCountConsumed:!a.activationNegated,wholeTurnFusionOnly:!a.activationNegated}];
 if(a.ashNegated||a.effectNegated||a.activationNegated)return{activationEvents,events:[{type:'BRANDED_FUSION_EFFECT_NEGATED',uid:a.sourceUid,materialsMoved:false}]};
 const materials=a.materialUids.map(uid=>{const hit=H.locate(st,uid);return{uid,from:hit.zone,to:'gy',kind:'FUSION_MATERIAL'}});
 for(const uid of a.materialUids)sent(st,uid,'gy');if(materials.some(m=>m.from==='deck'))H.shuffle(st);
 const fusion=H.move(st,a.fusionUid,'monster');fusion.summonType='FUSION';st.extraHistory.push('FUSION');H.queueTrigger(st,'LUBELLION_FUSION',fusion.uid);
 return{activationEvents,paid:materials,events:[{type:'FUSION_SUMMON',uid:fusion.uid,materials:a.materialUids,spellUid:a.sourceUid}]};
}});
register({type:'LUBELLION_FUSION_MIRRORJADE',enumerate:st=>{
 if(H.isUsed(st,'LUBELLION_FUSION')||own(st,'monster',x=>id(x)===I.MIRRORJADE).length)return[];
 const out=[],pool=['monster','gy','banished'].flatMap(z=>own(st,z,x=>!x.token&&x.faceDown!==true).map(x=>({x,z})));
 for(const t of pending(st,'LUBELLION_FUSION').filter(t=>inMonster(st,t.sourceUid)))for(const discard of own(st,'hand',safeDiscard))
  for(const fusion of own(st,'extra',x=>id(x)===I.MIRRORJADE&&level(x)<=8&&isExtraAllowed(st,'FUSION',x)))
   for(const albaz of pool.filter(p=>id(p.x)===I.ALBAZ))for(const extra of pool.filter(p=>extraType(p.x)))
    if(albaz.x.uid!==extra.x.uid&&(H.mainRoom(st)||[albaz.x,extra.x].some(x=>H.locate(st,x.uid)?.zone==='monster'&&x.zoneIndex!==5)))out.push({type:'LUBELLION_FUSION_MIRRORJADE',sourceUid:t.sourceUid,discardUid:discard.uid,fusionUid:fusion.uid,materialUids:[albaz.x.uid,extra.x.uid]});
 return out;
},apply:(st,a)=>{
 H.popTrigger(st,'LUBELLION_FUSION',a.sourceUid);H.markUsed(st,'LUBELLION_FUSION');
 const source=H.locate(st,a.sourceUid).item;source.cannotAttackTurn=st.turn;st.locks.push({kind:'FUSION_ONLY',sourceUid:a.sourceUid,wholeTurn:true});
 sent(st,a.discardUid,'gy');const paid=[{kind:'DISCARD',uid:a.discardUid,to:'gy'}],activationEvents=[{type:'ACTIVATE_TRIGGER_EFFECT',effect:'LUBELLION_FUSION',uid:a.sourceUid,costUid:a.discardUid}];if(a.effectNegated||a.activationNegated)return{paid,activationEvents,events:[{type:'LUBELLION_FUSION_NEGATED',uid:a.sourceUid}]};
 let mainShuffle=false;
 for(const uid of a.materialUids){const x=H.locate(st,uid).item,to=extraType(x)?'extra':'deck';H.move(st,uid,to);mainShuffle ||= to==='deck';paid.push({kind:'FUSION_MATERIAL_RETURN',uid,to});}
 if(mainShuffle)H.shuffle(st);
 const fusion=H.move(st,a.fusionUid,'monster');fusion.summonType='FUSION';st.extraHistory.push('FUSION');
 return{paid,activationEvents,events:[{type:'FUSION_SUMMON',uid:fusion.uid,materials:a.materialUids,effect:'LUBELLION_FUSION'}]};
}});
register({type:'BLUE_EYES_NORMAL_SUMMON_SAGE',enumerate:st=>idle(st)&&st.normalSummonAvailable[0]&&H.mainRoom(st)?own(st,'hand',x=>id(x)===I.SAGE).map(x=>({type:'BLUE_EYES_NORMAL_SUMMON_SAGE',sourceUid:x.uid})):[],apply:(st,a)=>{
 const x=H.move(st,a.sourceUid,'monster');x.summonType='NORMAL';st.normalSummonAvailable[0]=false;H.queueTrigger(st,'SAGE_SEARCH',x.uid);
 return{events:[{type:'NORMAL_SUMMON',uid:x.uid,player:0}]};
}});
register({type:'SAGE_SEARCH_LIGHT_TUNER',ashable:true,enumerate:st=>pending(st,'SAGE_SEARCH').flatMap(t=>own(st,'deck',x=>id(x)!==I.SAGE&&level(x)===1&&isLight(x)&&(Number(c(x).typeBits)&0x1000)).map(x=>({type:'SAGE_SEARCH_LIGHT_TUNER',sourceUid:t.sourceUid,selectionUid:x.uid}))),apply:(st,a)=>{
 H.popTrigger(st,'SAGE_SEARCH',a.sourceUid);
 if(a.ashNegated||a.effectNegated||a.activationNegated)return{events:[{type:'SAGE_SEARCH_NEGATED',uid:a.sourceUid}]};
 H.move(st,a.selectionUid,'hand');H.shuffle(st);
 return{events:[{type:'SEARCH',sourceUid:a.sourceUid,uid:a.selectionUid,from:'deck',to:'hand',restriction:'LEVEL_1_LIGHT_TUNER_EXCEPT_SAGE'}]};
}});
register({type:'LINK_SPIRIT_WITH_EYES_OF_BLUE',enumerate:st=>{
 if(!idle(st)||own(st,'monster',x=>x.zoneIndex===5).length)return[];
 return own(st,'extra',x=>id(x)===I.SPIRIT&&isExtraAllowed(st,'LINK',x)).flatMap(target=>own(st,'monster',x=>face(x)&&safeLinkMaterial(x)&&[2,8192].includes(race(x))&&level(x)>=1&&level(x)<=4).map(x=>({type:'LINK_SPIRIT_WITH_EYES_OF_BLUE',sourceUid:target.uid,materialUids:[x.uid]})));
},apply:(st,a)=>{
 for(const uid of a.materialUids)sent(st,uid,'gy');const x=H.move(st,a.sourceUid,'monster',{zoneIndex:5});x.summonType='LINK';st.extraHistory.push('LINK');st.locks.push({kind:'DRAGON_ONLY',sourceUid:x.uid});H.queueTrigger(st,'SPIRIT_MAUSOLEUM',x.uid);
 return{paid:a.materialUids.map(uid=>({kind:'LINK_MATERIAL',uid,to:'gy'})),events:[{type:'LINK_SUMMON',uid:x.uid,materials:a.materialUids}]};
}});
register({type:'SPIRIT_SEARCH_MAUSOLEUM',ashable:true,enumerate:st=>!H.isUsed(st,'SPIRIT_MAUSOLEUM')?pending(st,'SPIRIT_MAUSOLEUM').flatMap(t=>own(st,'deck',x=>id(x)===I.MAUSOLEUM).map(x=>({type:'SPIRIT_SEARCH_MAUSOLEUM',sourceUid:t.sourceUid,selectionUid:x.uid}))):[],apply:(st,a)=>{
 H.popTrigger(st,'SPIRIT_MAUSOLEUM',a.sourceUid);H.markUsed(st,'SPIRIT_MAUSOLEUM');
 if(a.ashNegated||a.effectNegated||a.activationNegated)return{events:[{type:'SPIRIT_SEARCH_NEGATED',uid:a.sourceUid}]};
 H.move(st,a.selectionUid,'hand');H.shuffle(st);return{events:[{type:'SEARCH',uid:a.selectionUid,sourceUid:a.sourceUid,from:'deck',to:'hand',mode:'ADD_TO_HAND'}]};
}});
register({type:'ACTIVATE_MAUSOLEUM_OF_WHITE',enumerate:st=>idle(st)?own(st,'hand',x=>id(x)===I.MAUSOLEUM).map(x=>({type:'ACTIVATE_MAUSOLEUM_OF_WHITE',sourceUid:x.uid})):[],apply:(st,a)=>{
 for(const old of fieldSpells(st))sent(st,old.uid,'gy');const field=H.move(st,a.sourceUid,'spelltrap',{faceUp:true});field.fieldSpell=true;
 return{events:[{type:'FIELD_SPELL_ACTIVATION',uid:field.uid}]};
}});
register({type:'MAUSOLEUM_ADDITIONAL_NORMAL_SUMMON',enumerate:st=>{
 if(!idle(st)||H.isUsed(st,'MAUSOLEUM_ADDITIONAL_NORMAL')||!H.mainRoom(st))return[];
 return fieldSpells(st).filter(x=>face(x)&&id(x)===I.MAUSOLEUM).flatMap(field=>own(st,'hand',x=>[I.SAGE,I.ANCIENTS,I.VEILER].includes(id(x))&&level(x)===1&&isLight(x)&&(Number(c(x).typeBits)&0x1000)).map(x=>({type:'MAUSOLEUM_ADDITIONAL_NORMAL_SUMMON',sourceUid:field.uid,summonUid:x.uid})));
},apply:(st,a)=>{
 H.markUsed(st,'MAUSOLEUM_ADDITIONAL_NORMAL');const x=H.move(st,a.summonUid,'monster');x.summonType='NORMAL';
 if(id(x)===I.SAGE)H.queueTrigger(st,'SAGE_SEARCH',x.uid);
 return{events:[{type:'ADDITIONAL_NORMAL_SUMMON',uid:x.uid,sourceUid:a.sourceUid,restriction:'ONE_LEVEL_1_LIGHT_TUNER_ADDITIONAL_NORMAL_PER_TURN'}]};
}});
register({type:'MAUSOLEUM_SEND_NORMAL_MONSTER',ashable:true,enumerate:st=>{
 if(!idle(st))return[];const out=[];
 for(const field of fieldSpells(st).filter(x=>face(x)&&id(x)===I.MAUSOLEUM&&!H.isUsed(st,'MAUSOLEUM_SEND:'+x.uid)))
  for(const target of own(st,'monster',face))for(const sentCard of ['hand','deck'].flatMap(z=>own(st,z,normal)))
   out.push({type:'MAUSOLEUM_SEND_NORMAL_MONSTER',sourceUid:field.uid,targetUid:target.uid,selectionUid:sentCard.uid});
 return out;
},apply:(st,a)=>{
 H.markUsed(st,'MAUSOLEUM_SEND:'+a.sourceUid);const activationEvents=[{type:'TARGET',sourceUid:a.sourceUid,uid:a.targetUid,zone:'monster'}];
 if(a.ashNegated||a.effectNegated||a.activationNegated)return{activationEvents,events:[{type:'MAUSOLEUM_EFFECT_NEGATED',uid:a.sourceUid,normalMonsterSent:false}]};
 const origin=H.locate(st,a.selectionUid).zone,monster=sent(st,a.selectionUid,'gy');if(origin==='deck')H.shuffle(st);
 const target=H.locate(st,a.targetUid).item,gain=level(monster)*100;
 target.currentAtk=Number(target.currentAtk??c(target).atk)+gain;target.currentDef=Number(target.currentDef??c(target).def)+gain;
 target.temporaryModifiers=[...arr(target.temporaryModifiers),{kind:'ATK_DEF_GAIN',amount:gain,untilTurn:st.turn,sourceUid:a.sourceUid}];
 return{activationEvents,events:[{type:'SEND_TO_GY_BY_EFFECT',uid:a.selectionUid,from:origin,to:'gy',sourceUid:a.sourceUid},{type:'TEMPORARY_ATK_DEF_GAIN',uid:a.targetUid,amount:gain,untilTurn:st.turn}]};
}});
register({type:'SPIRIT_TRIBUTE_BLUE_EYES',enumerate:st=>{
 if(!idle(st)||H.isUsed(st,'SPIRIT_TRIBUTE'))return[];const out=[];
 for(const spirit of own(st,'monster',x=>face(x)&&id(x)===I.SPIRIT)){
  if(!H.mainRoom(st)&&spirit.zoneIndex===5)continue;
  for(const target of ['hand','gy'].flatMap(z=>own(st,z,x=>id(x)===I.BEWD)))out.push({type:'SPIRIT_TRIBUTE_BLUE_EYES',sourceUid:spirit.uid,summonUid:target.uid});
 }
 return out;
},apply:(st,a)=>{
 H.markUsed(st,'SPIRIT_TRIBUTE');sent(st,a.sourceUid,'gy');if(a.effectNegated||a.activationNegated)return{paid:[{kind:'TRIBUTE',uid:a.sourceUid,to:'gy'}],events:[{type:'SPIRIT_TRIBUTE_EFFECT_NEGATED'}]};const x=H.move(st,a.summonUid,'monster');x.summonType='EFFECT_SPECIAL';
 return{paid:[{kind:'TRIBUTE',uid:a.sourceUid,to:'gy'}],activationEvents:[{type:'ACTIVATE_IGNITION_EFFECT',uid:a.sourceUid,costUid:a.sourceUid}],events:[{type:'SPECIAL_SUMMON_FROM_HAND_OR_GY',uid:x.uid,sourceUid:a.sourceUid}]};
}});
register({type:'SYNCHRO_BLUE_EYES_SPIRIT_DRAGON',enumerate:st=>{
 if(!idle(st))return[];
 return own(st,'extra',x=>id(x)===I.SPIRIT_DRAGON&&isExtraAllowed(st,'SYNCHRO',x)).flatMap(target=>own(st,'monster',x=>face(x)&&[I.ANCIENTS,I.SAGE,I.VEILER].includes(id(x))&&level(x)===1&&(Number(c(x).typeBits)&0x1000)).flatMap(tuner=>own(st,'monster',x=>face(x)&&id(x)===I.BEWD&&level(x)===8&&!(Number(c(x).typeBits)&0x1000)).map(blue=>({type:'SYNCHRO_BLUE_EYES_SPIRIT_DRAGON',sourceUid:target.uid,materialUids:[tuner.uid,blue.uid]}))));
},apply:(st,a)=>{
 for(const uid of a.materialUids)sent(st,uid,'gy');const x=H.move(st,a.sourceUid,'monster');x.summonType='SYNCHRO';st.extraHistory.push('SYNCHRO');
 return{paid:a.materialUids.map(uid=>({kind:'SYNCHRO_MATERIAL',uid,to:'gy'})),events:[{type:'SYNCHRO_SUMMON',uid:x.uid,materials:a.materialUids},{type:'MAIN_PHASE_STOP',note:'White Stone of Ancients End Phase effect is not resolved in this Main Phase analysis.'}]};
}});
W.YGOArchetypeRules=Object.freeze({revision:'branded-blue-eyes-v1',cards:Object.freeze(I),archetypes:['Branded','Blue-Eyes'],scope:'Exact registered transitions in Main Phase 1, explicit opponent policy; no universal rule certification.',limitations:['Branded DARK materials are Normal Monsters or Fallen of Albaz; other material triggers are not inferred.','Discard costs use known safe cards; unrelated graveyard triggers are not silently resolved.','End Phase, combat and Pendulum material replacement are outside these handlers.','Mausoleum extra Normal Summon supports Sage, Ancients and Effect Veiler.']});
})();
