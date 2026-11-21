/* Reviewed priority adapters for the existing Invocation/Branded routes.
 * A Fusion card and its physical materials are chosen during resolution.
 * No legacy atomic handler is called, and materials are never paid as costs.
 */
(()=>{'use strict';
const W=window,E=W.YGOComboEngine,H=E?.helpers,P=W.YGOPriorityChain;
if(!P?.registerEffect||!E?.registerLifecycle)throw Error('PRIORITY_FUSIONS_CORE_REQUIRED');
const arr=x=>Array.isArray(x)?x:[],C=x=>H.card(x),id=x=>H.baseId(x),rows=(s,p,z)=>arr(s.zones[p]?.[z]);
const I={INVOCATION:74063034,ALEISTER:86120751,MECHABA:75286621,BRANDED:44362883,ALBAZ:68468459,LUBELLION:70534340,MIRRORJADE:44146295};
const key=(name,p)=>p===0?name:name+':'+p,enabled=s=>s.context?.duelMode===true&&s.context.priorityMode===true;
const extra=x=>!!(Number(C(x)?.typeBits)&(0x40|0x2000|0x800000|0x4000000));
const attribute=x=>({EARTH:1,TIERRA:1,WATER:2,AGUA:2,FIRE:4,FUEGO:4,WIND:8,VIENTO:8,LIGHT:16,LUZ:16,DARK:32,OSCURIDAD:32,DIVINE:64,DIVINA:64}[String(C(x)?.attribute).toUpperCase()]??Number(C(x)?.attribute));
const attached=['overlay','overlays','overlayUids','xyzMaterials','materials','materialUids','attachments','attachedUids','equips','equipUids','equippedCards','equippedTo','equipTargetUid'];
const restricted=['cannotBeFusionMaterial','cannotBeMaterial','cannotBeUsedAsMaterial','fusionMaterialRestrictions','materialRestrictions'];
const meaningful=x=>x!==undefined&&x!==null&&x!==false&&(!Array.isArray(x)||x.length>0),present=(x,ks)=>ks.some(k=>meaningful(x[k]));
function printed(x){const c=C(x),p=H.lookup(Number(c?.id));return!!p&&c.technicalSourceMatched===true&&p.technicalSourceMatched===true&&Number(c.typeBits)===Number(p.typeBits)&&(!(Number(c.typeBits)&1)||attribute(c)===attribute(p)&&Number(c.race)===Number(p.race));}
function normal(x){const b=Number(C(x)?.typeBits);return printed(x)&&(b&17)===17&&!(b&(0x40|0x80|0x2000|0x4000|0x800000|0x1000000|0x4000000|0x8000000));}
function clean(x){return!!x&&!x.token&&!x.leaveFieldRedirect&&!present(x,attached)&&!present(x,restricted)&&printed(x);}
const invokedCards=new Set([I.ALEISTER,34755994,20001443,69248256,93490856,8240199,97268402,I.ALBAZ,71039903,42097666]);
const discardCards=new Set([14558127,97268402,94145021,24508238,I.ALEISTER,I.INVOCATION,20001443,93490856,I.ALBAZ,8240199,71039903,24382602,10045474,94192409,I.BRANDED,26889158,52277807,87052196,98159737,23431858,24557335,65124425,1295111,51339637,14934922,83764718]);
const shuffleExtraCards=new Set([34755994,I.MECHABA,69248256,96633955,I.LUBELLION,59822133,83994433,40908371,42097666,32519092,78917791,5402805,14812471,87871125]);
const invokedMaterial=x=>clean(x)&&(normal(x)||invokedCards.has(id(x)));
const brandedMaterial=x=>clean(x)&&(normal(x)||id(x)===I.ALBAZ);
const safeDiscard=x=>clean(x)&&!extra(x)&&(normal(x)||discardCards.has(id(x)));
const shuffleMaterial=x=>clean(x)&&x.faceDown!==true&&(normal(x)||discardCards.has(id(x))||shuffleExtraCards.has(id(x)));
const invocationRecipes=new Map([[I.MECHABA,{cardId:I.MECHABA,invoked:true,note:'Exact Aleister and LIGHT with the printed Invoked material expansion.'}]]);
function registerInvocationRecipe(def){const cardId=Number(def?.cardId),ids=arr(def?.materialCardIds).map(Number),card=H.lookup(cardId);if(!card||!(Number(card.typeBits)&0x40)||invocationRecipes.has(cardId)||ids.length!==2||ids.some(n=>!Number.isSafeInteger(n)||!H.lookup(n)||(Number(H.lookup(n).typeBits)&1)!==1||extra(H.lookup(n)))||typeof def.note!=='string'||!def.note.trim())throw Error('PRIORITY_EXACT_INVOCATION_RECIPE_REQUIRED');invocationRecipes.set(cardId,{cardId,materialCardIds:ids,invoked:false,note:def.note});return true;}
function liveLock(s,l,p){const source=H.locate(s,l.sourceUid);return(l.appliesToPlayer??l.player??source?.player??0)===p&&(l.untilTurn===undefined||Number(l.untilTurn)>=s.turn)&&(l.wholeTurn===true||!l.sourceUid||source?.zone==='monster'&&source.item.faceUp===true&&source.item.effectsNegated!==true);}
function allowedFusion(s,p,x){return H.spiritSpecialAllowed(s,p,x)&&H.wolfNameAllowed(s,p,x)&&!arr(s.locks).some(l=>liveLock(s,l,p)&&(l.kind==='SYNCHRO_ONLY'||l.kind==='WYRM_ONLY'&&Number(C(x).race)!==0x800000||l.kind==='DRAGON_ONLY'&&Number(C(x).race)!==8192));}
function destinationSupported(s,p,d,materials){const fn=W.YGOExpandedArchetypes?.wolfSummonDestinationSupported;return typeof fn!=='function'||fn(s,p,d,{departingUids:materials});}
function destinations(s,p,materials){const occupied=new Set(rows(s,p,'monster').filter(x=>!materials.includes(x.uid)).map(x=>x.zoneIndex));return[0,1,2,3,4].filter(d=>!occupied.has(d)&&destinationSupported(s,p,d,materials));}
function pool(s,p,zones,predicate){return zones.flatMap(z=>rows(s,p,z).filter(x=>predicate(x)&&(z!=='monster'||x.faceUp===true)).map(x=>({x,z,p})));}
function plans(s,p,mode){
 const targetId=mode==='BRANDED'?I.LUBELLION:I.MIRRORJADE,out=[];
 if(s.duelEnded||mode==='LUBELLION'&&rows(s,p,'monster').some(x=>x.faceUp===true&&id(x)===I.MIRRORJADE))return out;
 for(const target of rows(s,p,'extra').filter(x=>x.ownerPlayer===p&&(mode==='INVOCATION'?invocationRecipes.has(id(x)):id(x)===targetId)&&clean(x)&&allowedFusion(s,p,x)&&(mode!=='LUBELLION'||Number(C(x).level)<=8))){
  const recipe=mode==='INVOCATION'?invocationRecipes.get(id(target)):null;
  const materials=mode==='INVOCATION'?(recipe.invoked?[...pool(s,p,['hand','monster','gy'],invokedMaterial),...pool(s,1-p,['gy'],invokedMaterial)]:pool(s,p,['hand'],x=>clean(x)&&recipe.materialCardIds.includes(id(x)))):mode==='BRANDED'?pool(s,p,['deck','hand','monster'],brandedMaterial):pool(s,p,['monster','gy','banished'],shuffleMaterial);
  for(const a of materials.filter(m=>id(m.x)===(mode==='INVOCATION'?(recipe.invoked?I.ALEISTER:recipe.materialCardIds[0]):I.ALBAZ)))
   for(const b of materials.filter(m=>mode==='LUBELLION'?extra(m.x):mode==='INVOCATION'&&!recipe.invoked?id(m.x)===recipe.materialCardIds[1]:attribute(m.x)===(mode==='INVOCATION'?16:32))){
    if(a.x.uid===b.x.uid)continue;
    const materialUids=[a.x.uid,b.x.uid];
    for(const destination of destinations(s,p,materialUids))for(const position of ['ATTACK','DEFENSE'])out.push({fusionUid:target.uid,materialUids,destination,position});
   }
 }
 return out;
}
function mainActor(s,p){return s.activePlayer===p&&['MAIN 1','MAIN 2'].includes(s.phase);}
function columns(s,p){const used=new Set(rows(s,p,'spelltrap').filter(x=>!x.fieldSpell).map(x=>x.zoneIndex));return[0,1,2,3,4].filter(c=>!used.has(c));}
function spellSources(s,p,cardId){return[...rows(s,p,'hand').filter(x=>id(x)===cardId&&clean(x)).flatMap(x=>columns(s,p).map(column=>({sourceUid:x.uid,column,fromSet:false}))),...rows(s,p,'spelltrap').filter(x=>id(x)===cardId&&clean(x)&&x.faceUp!==true&&!x.fieldSpell).map(x=>({sourceUid:x.uid,column:x.zoneIndex,fromSet:true}))];}
function columnNegated(s,p,column){return arr(s.locks).some(l=>l.kind==='IMPERM_COLUMN_NEGATED'&&Number(l.untilTurn)>=s.turn&&l.column===(p===0?column:4-column));}
function prepareSpell(s,a){if(a.fromSet)H.locate(s,a.sourceUid).item.faceUp=true;else H.move(s,a.sourceUid,'spelltrap',{player:a.player,zoneIndex:a.column,faceUp:true});return{activatedStay:P.sourceStay(s,a.sourceUid),column:a.column,spellNegatedAtActivation:columnNegated(s,a.player,a.column)};}
function cleanupSpell(s,l){const source=H.locate(s,l.sourceUid);if(source?.zone==='spelltrap'&&source.item.priorityActivationPending===l.linkId&&P.sameStay(s,l.prepared.activatedStay)){H.move(s,l.sourceUid,'gy',{activationNegated:l.activationNegated});return{events:[{type:'PRIORITY_CARD_ACTIVATION_CLEANUP',uid:l.sourceUid,linkId:l.linkId,activationNegated:l.activationNegated}]};}return{events:[]};}
function fusionResolution(s,l,ctx,mode){
 const a=ctx.resolutionChoice||{};
 if(!a.fusionUid)return{events:[{type:'PRIORITY_FUSION_NO_LEGAL_MATERIALS',sourceUid:l.sourceUid,player:l.player,effect:l.effectId,materialsMoved:false}]};
 const current=plans(s,l.player,mode).find(x=>JSON.stringify(x)===JSON.stringify(a));if(!current)throw Error('PRIORITY_FUSION_RESOLUTION_SELECTION_INVALID');
 const materialEvidence=[];let shuffled=false;
 for(const uid of a.materialUids){const hit=H.locate(s,uid),to=mode==='INVOCATION'?(hit.zone==='hand'?'gy':'banished'):mode==='BRANDED'?'gy':extra(hit.item)?'extra':'deck';const record={kind:mode==='LUBELLION'?'FUSION_MATERIAL_RETURN':'FUSION_MATERIAL',uid,from:hit.zone,fromPlayer:hit.player,ownerPlayer:hit.item.ownerPlayer};H.move(s,uid,to);const moved=H.locate(s,uid);materialEvidence.push({...record,to:moved?.zone,toPlayer:moved?.player});if(mode==='BRANDED'&&record.from==='deck'||mode==='LUBELLION'&&to==='deck')shuffled=true;}
 if(shuffled)H.shuffle(s,l.player);
 const x=H.move(s,a.fusionUid,'monster',{player:l.player,zoneIndex:a.destination,position:a.position,faceUp:true});x.summonType='FUSION';x.properlySummoned=true;x.properSummonType='FUSION';s.extraHistory.push('FUSION');
 if(id(x)===I.LUBELLION&&!H.isUsed(s,key('LUBELLION_FUSION',l.player)))H.queueTrigger(s,'LUBELLION_FUSION',x.uid,{player:l.player});
 return{paid:materialEvidence,events:[...materialEvidence.map(m=>({type:m.to==='gy'?'SENT_TO_GY_AS_FUSION_MATERIAL':m.to==='banished'?'BANISHED_AS_FUSION_MATERIAL':'RETURNED_AS_FUSION_MATERIAL',...m,sourceUid:l.sourceUid,player:l.player,at:'RESOLUTION'})),{type:'FUSION_SUMMON',uid:x.uid,player:l.player,sourceUid:l.sourceUid,spellUid:mode==='LUBELLION'?undefined:l.sourceUid,effect:l.effectId,materials:a.materialUids,materialEvidence,zoneIndex:a.destination,position:a.position,properlySummoned:true,properSummonType:'FUSION',nonTargeting:true,at:'RESOLUTION'}]};
}
const resolutionPlans=(s,l,mode)=>{const choices=plans(s,l.player,mode);return choices.length?choices:[{}];};
function lubellionCosts(s,p){return rows(s,p,'hand').filter(safeDiscard).filter(x=>{const view=structuredClone(s);H.move(view,x.uid,'gy');return plans(view,p,'LUBELLION').length>0;}).map(x=>({discardUid:x.uid}));}
P.registerEffect({id:'INVOCATION_MECHABA',cardId:I.INVOCATION,kind:'SPELL_CARD_ACTIVATION',spellSpeed:1,activationZones:['hand','spelltrap'],damageStepCategories:[],sourceDepartureSafe:true,
 enumerate(s,{priorityPlayer:p}){return mainActor(s,p)&&plans(s,p,'INVOCATION').length?spellSources(s,p,I.INVOCATION).map(a=>({...a,player:p})):[];},
 prepare(s,a){return{packet:prepareSpell(s,a),paid:[],events:[{type:'SPELL_ACTIVATION',uid:a.sourceUid,player:a.player,effect:'INVOCATION',nonTargeting:true,materialsChosenAt:'RESOLUTION'}]};},
 enumerateResolution:(s,l)=>resolutionPlans(s,l,'INVOCATION'),resolve:(s,l,ctx)=>fusionResolution(s,l,ctx,'INVOCATION'),cleanup:cleanupSpell});
function installRestriction(s,a,linkId,kind,budget){s.locks.push({kind:'FUSION_ONLY',sourceUid:a.sourceUid,wholeTurn:true,appliesToPlayer:a.player,createdTurn:s.turn,untilTurn:s.turn,priorityFusionRestriction:kind,priorityLinkId:linkId});return{activationLimitKey:budget,restrictionLinkId:linkId};}
function releaseNegatedRestriction(s,l){
 if(!l.activationNegated||l.effectId!=='BRANDED_FUSION_LUBELLION')return[];
 const mine=x=>x.priorityLinkId===l.linkId&&x.priorityFusionRestriction;
 const had=s.locks.some(mine);s.locks=s.locks.filter(x=>!mine(x));
 if(l.effectId==='BRANDED_FUSION_LUBELLION'&&had)delete s.used[l.prepared.activationLimitKey];
 return had?[{type:'PRIORITY_FUSION_ACTIVATION_RESTRICTION_RELEASED',sourceUid:l.sourceUid,player:l.player,linkId:l.linkId,activationBudgetReleased:l.effectId==='BRANDED_FUSION_LUBELLION',namedUseRetained:l.effectId!=='BRANDED_FUSION_LUBELLION'}]:[];
}
function nonFusionThisTurn(s,p){const ledger=arr(s.duel?.priorityExtraSummons);return ledger.some(x=>x.turn===s.turn&&x.player===p&&x.kind!=='FUSION');}
P.registerEffect({id:'BRANDED_FUSION_LUBELLION',cardId:I.BRANDED,kind:'SPELL_CARD_ACTIVATION',spellSpeed:1,activationZones:['hand','spelltrap'],damageStepCategories:[],ashCategories:['deck-to-graveyard'],sourceDepartureSafe:true,
 enumerate(s,{priorityPlayer:p}){return mainActor(s,p)&&!H.isUsed(s,key('BRANDED_FUSION_ACTIVATED',p))&&!nonFusionThisTurn(s,p)&&plans(s,p,'BRANDED').length?spellSources(s,p,I.BRANDED).map(a=>({...a,player:p})):[];},
 prepare(s,a,ctx){const budget=key('BRANDED_FUSION_ACTIVATED',a.player);H.markUsed(s,budget);return{packet:{...prepareSpell(s,a),...installRestriction(s,a,ctx.linkId,'BRANDED',budget)},paid:[],events:[{type:'SPELL_ACTIVATION',uid:a.sourceUid,player:a.player,effect:'BRANDED_FUSION',activationCountConsumed:true,wholeTurnFusionOnly:true,nonTargeting:true,materialsChosenAt:'RESOLUTION'}]};},
 enumerateResolution:(s,l)=>resolutionPlans(s,l,'BRANDED'),resolve:(s,l,ctx)=>fusionResolution(s,l,ctx,'BRANDED'),cleanup(s,l){return{events:[...releaseNegatedRestriction(s,l),...cleanupSpell(s,l).events]};}});
P.registerEffect({id:'INVOCATION_RECYCLE',cardId:I.INVOCATION,kind:'SPELL_EFFECT',spellSpeed:1,activationZones:['gy'],damageStepCategories:[],
 enumerate(s,{priorityPlayer:p}){return mainActor(s,p)&&!H.isUsed(s,key('INVOCATION_RECYCLE',p))?rows(s,p,'gy').filter(x=>id(x)===I.INVOCATION&&clean(x)).flatMap(source=>rows(s,p,'banished').filter(x=>id(x)===I.ALEISTER&&x.faceDown!==true&&clean(x)).map(target=>({player:p,sourceUid:source.uid,targetUid:target.uid}))):[];},
 prepare(s,a){H.markUsed(s,key('INVOCATION_RECYCLE',a.player));return{packet:{targetStay:P.sourceStay(s,a.targetUid),activationLimitKey:key('INVOCATION_RECYCLE',a.player)},paid:[],events:[{type:'TARGET',uid:a.targetUid,sourceUid:a.sourceUid,player:a.player,zone:'banished',at:'ACTIVATION'}]};},
 resolve(s,l){if(!P.sameStay(s,l.activationOrigin))return{events:[{type:'INVOCATION_RECYCLE_SOURCE_UNAVAILABLE',sourceUid:l.sourceUid,targetUid:l.choice.targetUid,player:l.player}]};H.move(s,l.sourceUid,'deck');H.shuffle(s,l.player);const events=[{type:'INVOCATION_SHUFFLED_INTO_DECK',uid:l.sourceUid,player:l.player,at:'RESOLUTION'}],target=H.locate(s,l.choice.targetUid);if(P.sameStay(s,l.prepared.targetStay)&&target?.zone==='banished'&&target.item.faceDown!==true){H.move(s,target.item.uid,'hand');events.push({type:'RECOVER',uid:target.item.uid,sourceUid:l.sourceUid,player:l.player,from:'banished',to:'hand',at:'RESOLUTION'});}else events.push({type:'INVOCATION_RECYCLE_TARGET_UNAVAILABLE',sourceUid:l.sourceUid,targetUid:l.choice.targetUid,player:l.player});return{events};}});
// Trigger registration is separate so embedding order can remain explicit.
let triggersInstalled=false;
function installTriggers(){if(triggersInstalled||!W.YGOTriggerOrder?.registerTriggerProfile)return false;
 W.YGOTriggerOrder.registerTriggerProfile({kind:'LUBELLION_FUSION',effectId:'PRIORITY_LUBELLION_FUSION_MIRRORJADE',cardId:I.LUBELLION,mandatory:false,activationZones:['monster'],provenance:(s,t)=>s.events.some(e=>e.type==='FUSION_SUMMON'&&e.uid===t.sourceUid),enumerate(s,t){const source=H.locate(s,t.sourceUid);return source?.zone==='monster'&&source.item.faceUp===true&&!H.isUsed(s,key('LUBELLION_FUSION',t.player))?lubellionCosts(s,t.player):[];}});
 P.registerEffect({id:'PRIORITY_LUBELLION_FUSION_MIRRORJADE',cardId:I.LUBELLION,kind:'MONSTER_EFFECT',spellSpeed:1,activationZones:['monster'],triggerOnly:true,damageStepCategories:['TRIGGER'],enumerate:()=>[],
 prepare(s,a){const source=H.locate(s,a.sourceUid),cost=H.locate(s,a.discardUid);if(!source||!cost||cost.player!==a.player||cost.zone!=='hand'||!safeDiscard(cost.item))throw Error('PRIORITY_LUBELLION_DISCARD_REQUIRED');const budget=key('LUBELLION_FUSION',a.player);H.markUsed(s,budget);H.move(s,a.discardUid,'gy');return{packet:{activationLimitKey:budget},paid:[{kind:'DISCARD',uid:a.discardUid,player:a.player,from:'hand',to:'gy'}],events:[{type:'ACTIVATE_TRIGGER_EFFECT',uid:a.sourceUid,player:a.player,effect:'LUBELLION_FUSION',costUid:a.discardUid,nonTargeting:true,materialsChosenAt:'RESOLUTION'}]};},
 enumerateResolution:(s,l)=>resolutionPlans(s,l,'LUBELLION'),resolve(s,l,ctx){const result=fusionResolution(s,l,ctx,'LUBELLION'),source=H.locate(s,l.sourceUid),attackRestrictionApplied=P.sameStay(s,l.activationOrigin)&&source?.zone==='monster';if(attackRestrictionApplied)source.item.cannotAttackTurn=s.turn;installRestriction(s,{sourceUid:l.sourceUid,player:l.player},l.linkId,'LUBELLION',l.prepared.activationLimitKey);s.locks.at(-1).restrictionPeriod='REST_OF_THIS_TURN';s.locks.at(-1).appliedAt='RESOLUTION';return{...result,events:[...arr(result.events),{type:'LUBELLION_REST_OF_TURN_RESTRICTIONS_APPLIED',sourceUid:l.sourceUid,player:l.player,linkId:l.linkId,untilTurn:s.turn,attackRestrictionApplied,extraFusionOnly:true,at:'RESOLUTION'}]};}});triggersInstalled=true;return true;
}
installTriggers();Promise.resolve(W.YGODataCatalog?.ready).then(installTriggers).catch(e=>console.error('PRIORITY_FUSION_TRIGGERS',e));
function fusionLock(s,p){return arr(s.locks).some(l=>l.priorityFusionRestriction&&liveLock(s,l,p));}
E.registerLifecycle({id:'priority-fusion-physical-restrictions-v1',initialize(s){if(enabled(s)){W.YGODuelPhases.ensureDuel(s);s.duel.priorityExtraSummons=[];}},
 validate(s){if(!enabled(s))return;const ledger=arr(s.duel?.priorityExtraSummons),events=s.events.filter(e=>e.type==='PRIORITY_EXTRA_DECK_SUMMON_OBSERVED'&&e.turn===s.turn).map(({turn,player,uid,kind})=>({turn,player,uid,kind}));if(JSON.stringify(ledger)!==JSON.stringify(events))throw Error('PRIORITY_EXTRA_DECK_SUMMON_LEDGER_INVALID');},
 validateChoice(s,a){if(!enabled(s))return;for(const x of H.registeredSummonArrivals(s,a)){const hit=H.locate(s,x.uid);if(hit?.zone==='extra'&&fusionLock(s,x.player)&&!(Number(C(hit.item).typeBits)&0x40))throw Error('PRIORITY_FUSION_ONLY_EXTRA_RESTRICTION');}},
 beforeMove(s,r){if(!enabled(s)||r.fromZone!=='extra'||r.toZone!=='monster')return;const p=r.options.player??r.fromPlayer,x=H.locate(s,r.uid)?.item;if(fusionLock(s,p)&&!(Number(C(x).typeBits)&0x40))throw Error('PRIORITY_FUSION_ONLY_EXTRA_RESTRICTION');},
 afterMove(s,r){if(!enabled(s)||r.from!=='extra'||r.to!=='monster'||s.provenance?.setup&&!s.duel?.priorityExtraSummons)return;if(!s.duel)s.duel={};if(!s.duel.priorityExtraSummons)s.duel.priorityExtraSummons=[];const x=H.locate(s,r.uid)?.item,b=Number(C(x).typeBits),kind=b&0x40?'FUSION':b&0x2000?'SYNCHRO':b&0x800000?'XYZ':b&0x4000000?'LINK':'OTHER',entry={turn:s.turn,player:r.player,uid:r.uid,kind};s.duel.priorityExtraSummons.push(entry);s.events.push({type:'PRIORITY_EXTRA_DECK_SUMMON_OBSERVED',...entry});},
 validateTransition(before,after){if(!enabled(after))return;for(const l of arr(after.duel?.priorityChain?.links))after.events.push(...releaseNegatedRestriction(after,l));if(before.turn!==after.turn&&after.duel)after.duel.priorityExtraSummons=[];}
});
let departuresInstalled=false;function installDepartures(){if(departuresInstalled||![I.INVOCATION,I.BRANDED].every(n=>H.lookup(n)))return;for(const cardId of [I.INVOCATION,I.BRANDED])P.registerDepartureProfile(cardId,{banish:true,returnToOwner:true,cost:true,note:'Reviewed Normal Fusion Spell; moving the card does not undo its independent priority link.'});departuresInstalled=true;}installDepartures();Promise.resolve(W.YGODataCatalog?.ready).then(installDepartures).catch(e=>console.error('PRIORITY_FUSION_DEPARTURES',e));
function capabilities(){return{version:'priority-fusions-v1',optIn:'context.duelMode && context.priorityMode',players:[0,1],effects:['INVOCATION_MECHABA','BRANDED_FUSION_LUBELLION','INVOCATION_RECYCLE',...(triggersInstalled?['PRIORITY_LUBELLION_FUSION_MIRRORJADE']:[])],fusionChoicesAt:'RESOLUTION',fusionMaterialsAreCosts:false,fusionDestinations:[0,1,2,3,4],fusionPositions:['ATTACK','DEFENSE'],invocation:{fusion:I.MECHABA,recipes:[...invocationRecipes.values()].map(x=>structuredClone(x)),materials:'Exact Aleister plus reviewed LIGHT; own hand/face-up field or either GY',handTo:'gy',fieldAndGyTo:'banished',recycleTargetAt:'ACTIVATION',recycleUse:'NAME_PER_PLAYER_PER_TURN'},branded:{fusion:I.LUBELLION,materials:'Exact Albaz plus DARK Main Normal or another Albaz; own hand/deck/face-up field',limit:'ACTIVATE_NAME_PER_PLAYER_PER_TURN',activationNegationReleasesLimit:true,extraRestriction:'ENTIRE_TURN_FUSION_ONLY_PER_ACTOR'},lubellion:{installed:triggersInstalled,fusion:I.MIRRORJADE,costAt:'ACTIVATION',materialsAt:'RESOLUTION',use:'NAME_PER_PLAYER_PER_TURN_RETAINED_ON_ACTIVATION_NEGATION',restrictionAt:'UNNEGATED_RESOLUTION_EVEN_WITHOUT_FUSION',restrictionPeriod:'REST_OF_THIS_TURN',priorNonFusionOrAttackDoesNotPreventActivation:true},generalCardRulesComplete:false,certified:false,limitations:['Default routes are Invocation to Mechaba, Branded to Lubellion, and Lubellion to Mirrorjade. Additional explicitly registered exact two-card Invocation recipes use own hand only. Substitutes, tokens, facedown field materials, Xyz/Pendulum materials, attachments, redirects and unreviewed departure triggers are excluded.','Fusion destinations are free Main Monster Zones after the selected materials depart; Extra Monster Zone destinations are not offered by this bounded profile.','Lubellion requires triggerOrderMode and the registered trigger-order module. The separate Albaz on-summon Fusion effect is not installed by this module.','The per-player Extra ledger observes actual transitions after this module is loaded; declared starting fields are not prior summon histories.','Only registered effects/procedures run. No card text or external card script is evaluated.']};}
W.YGOPriorityFusions=Object.freeze({cards:Object.freeze(I),capabilities,installTriggers,registerInvocationRecipe});
})();
