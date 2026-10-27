(()=>{
'use strict';
const W=window,D=document,VERSION='Alpha 669',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_669';
const A604=W.YGOAlpha604||{},A644=W.YGOAlpha644||{},A654=W.YGOAlpha654||{},A655=W.YGOAlpha655||{},A656=W.YGOAlpha656||{},A666=W.YGOAlpha666||{},A667=W.YGOAlpha667||{};
const arr=v=>Array.isArray(v)?v:[],raw=v=>String(v??''),norm=v=>raw(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").replace(/[^a-z0-9]+/g,' ').trim(),clone=v=>{try{return structuredClone(v)}catch(_){try{return JSON.parse(JSON.stringify(v))}catch(__){return v}}};
const R=()=>W.YGORulingEngine||{};
function name669(c){return raw(c?.name||c?.card?.name)}
function type669(c){return raw(c?.type||c?.card?.type||c?.frameType)}
function isMonster669(c){return /monster|monstruo/i.test(type669(c))}
function isVS677(x){const c=x?.card||x,n=norm(name669(c));return /(?:^| )vanquish soul(?: |$)/.test(n)||arr(c?.archetypes).some(a=>/vanquish soul/i.test(raw(a)))}
// Alpha 1088: deterministic, auditable sampling of the mandatory Main Deck shuffle.
// One replayable permutation, NOT an enumeration of all possible orders.
function shuffleMainSample1088(st, player, sourceUid, reason){
 const z=st?.zones?.[player], deck=z?.deck;
 if(!Array.isArray(deck))return {ok:false,error:'NO_MAIN_DECK'};
 const n=Number(st.__alpha1088ShuffleCount||0)+1;
 const before=deck.map(x=>raw(x?.uid));
 const salt=`${player}|${sourceUid}|${reason}|${n}|${raw(st?.__alpha1088Seed||'')}|${before.join(',')}`;
 let seed=2166136261>>>0;
 for(let i=0;i<salt.length;i++){seed^=salt.charCodeAt(i);seed=Math.imul(seed,16777619)>>>0}
 if(!seed)seed=0x9e3779b9;
 let value=seed;
 const rand=()=>{value^=value<<13;value^=value>>>17;value^=value<<5;value>>>=0;return value};
 for(let i=deck.length-1;i>0;i--){const j=rand()%(i+1);const tmp=deck[i];deck[i]=deck[j];deck[j]=tmp}
 const after=deck.map(x=>raw(x?.uid));
 // Record permutation so a replay auditor can verify the exact sampled post-shuffle Deck.
 st.__alpha1088ShuffleCount=n;
 st.events=arr(st.events);
 const checksum=xs=>{let h=2166136261>>>0;for(const uid of xs){for(let j=0;j<uid.length;j++){h^=uid.charCodeAt(j);h=Math.imul(h,16777619)>>>0}h^=124;h=Math.imul(h,16777619)>>>0}return h.toString(16).padStart(8,'0')};
 const entry={type:'DECK_SHUFFLED_SAMPLE',player,sourceUid,reason,seed,sequence:n,algorithm:'FNV1A_XORSHIFT32_FISHER_YATES',cardCount:deck.length,beforeChecksum:checksum(before),afterChecksum:checksum(after),certifiesDistribution:false};
 // Full UID arrays are retained only for explicit trace audits; ordinary search stays compact.
 if(st.__alpha1088AuditDetail===true){entry.beforeUids=before;entry.afterUids=after}
 st.events.push(entry);
 return {ok:true,seed,sequence:n,before,after,certifiesDistribution:false};
}
function isHorus680(x){const c=x?.card||x,n=norm(name669(c));return /(?:^| )horus(?: |$)/.test(n)||arr(c?.archetypes).some(a=>/^horus$/i.test(raw(a)))}
// Alpha1113: un nombre aportado por un estado de simulación NO prueba la identidad impresa.
// Contrastar ID y nombre con el catálogo íntegro antes de ofrecer ramas especiales.
let catalogIdentitySource1113=null, catalogIdentityLength1113=-1, catalogIdentityIndex1113=null;
function officialCard1113(item){
 const card=item?.card||item, id=Number(card?.id), catalog=arr(W.CARD_CATALOG);
 if(item?.card){
  if(item.id!==undefined&&item.id!==null&&Number(item.id)!==id)return null;
  if(item.ownerPlayer!==undefined&&item.card.ownerPlayer!==undefined&&Number(item.ownerPlayer)!==Number(item.card.ownerPlayer))return null;
 }
 if(!Number.isSafeInteger(id)||id<=0||catalog.length<19000)return null;
 if(catalogIdentitySource1113!==catalog||catalogIdentityLength1113!==catalog.length){
  const index=new Map();for(const known of catalog){const k=Number(known?.id);if(Number.isSafeInteger(k)&&k>0){
   if(index.has(k)&&norm(name669(index.get(k)))!==norm(name669(known)))index.set(k,null);
   else if(!index.has(k))index.set(k,known);
  }}
  catalogIdentitySource1113=catalog;catalogIdentityLength1113=catalog.length;catalogIdentityIndex1113=index;
 }
 const official=catalogIdentityIndex1113.get(id);
 if(!official||norm(name669(card))!==norm(name669(official)))return null;
 const type=norm(type669(card)),knownType=norm(type669(official));
 if(type&&knownType&&type!==knownType)return null;
 return official;
}
function printedCard1113(item,id){const official=officialCard1113(item);return official&&Number(official.id)===id?official:null;}

const PARSE_CACHE_678=new Map();
function localParse669(card,st,player=0){const cacheKey=`${raw(card?.id)}|${norm(name669(card))}|${norm(type669(card))}|${Number(st?.activePlayer)===Number(player)?'OWN':'OPP'}|${raw(st?.phase).toUpperCase()}|${raw(card?.desc||card?.text||'')}`;if(PARSE_CACHE_678.has(cacheKey))return clone(PARSE_CACHE_678.get(cacheKey));let p=null;try{p=R().parseCard?.(card)||null}catch(_){};if(!p)return p;const cardName=norm(name669(card)),cardType=norm(type669(card));const out={...p,effects:arr(p.effects).map(e=>{const x={...e},txt=norm(x.raw||x.resolution||x.activation||'');
 if(/normal monster/.test(cardType)&&!/pendulum/.test(cardType)){x.nonActivatable=true;x.nonActivatableReason='NORMAL_MONSTER_FLAVOR_TEXT_671';x.alpha671Passive=true}
 if(/^(?:discard 1|discard one|discard 1 card)$/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='PURE_COST_FRAGMENT_671';x.alpha671Passive=true}
 if(/activate (?:1|one) of (?:these|the following) effects/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='MODAL_EFFECT_HEADER_671';x.alpha671Passive=true}
 if(cardName==='mulcharmy fuwalos'){x.nonActivatable=true;x.nonActivatableReason='EXACT_HANDLER_FUWALOS_671';x.alpha671ExactDispatch=true}
 if(cardName==='the fallen the virtuous'){x.nonActivatable=true;x.nonActivatableReason='EXACT_HANDLER_FALLEN_VIRTUOUS_671';x.alpha671ExactDispatch=true}
 if(/^each effect(?: of [^.]*)? once per turn\.?$/.test(txt)||/^you can only use each effect(?: of [^.]*)? once per turn\.?$/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='RESTRICTION_ONLY_669';x.alpha669Passive=true}
 if(/an xyz monster that has this card as material gains/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='MATERIAL_GRANT_PASSIVE_669';x.alpha669Passive=true}
 if(/^this token s atk def become the combined original atk def of the tributed monsters/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='TOKEN_STAT_CONTINUATION_670';x.alpha669Passive=true;x.alpha670Passive=true}
 if(/send this card from (?:your )?hand or field to the gy and discard (?:1|one) card/.test(txt)||/send this card from (?:your )?hand or field to the graveyard and discard (?:1|one) card/.test(txt)){x.costs=[{kind:'SEND_GY',amount:1,self:true,alpha669:true},{kind:'DISCARD',amount:1,alpha669:true}];x.alpha669CostNormalized=true}
 if(Number(st?.activePlayer)===Number(player)&&/during your opponent(?: s)? turn/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='OPPONENT_TURN_ONLY_669';x.alpha669TurnGate=true}
 // Alpha672: los requisitos de Material del Extra Deck describen procedimientos, no efectos activables.
 const extraRecipe=/fusion|synchro|xyz|link|ritual/.test(cardType)&&/^\d+\+?\s+/.test(txt)&&!/(?:you can|if |when |during |once per|quick effect)/.test(txt);
 if(extraRecipe){x.nonActivatable=true;x.nonActivatableReason='EXTRA_DECK_MATERIAL_RECIPE_672';x.alpha672Passive=true}
 // Los efectos de reemplazo sólo existen en la ventana del evento que reemplazan; no son acciones libres.
 if(x?.semantic?.replacement===true||/would be destroyed[^.]{0,180}instead/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='REPLACEMENT_WINDOW_ONLY_672';x.alpha672Passive=true}
 if(cardName==='blue eyes spirit dragon'&&/tribute this synchro summoned card/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='EXACT_DIRECT_SPIRIT_TAGOUT_672';x.alpha672ExactDispatch=true}
 if(cardName==='dracotail urgula'&&/(?:in your gy|from gy)[^.]{0,220}(?:bottom of your deck|recycle itself)/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='EXACT_DIRECT_URGULA_GY_672';x.alpha672ExactDispatch=true}
 // El delta antiguo de Requiem era resumido; Alpha672 modela los dos efectos oficiales directamente.
 if(cardName==='fiendsmith s requiem'){x.nonActivatable=true;x.nonActivatableReason='EXACT_DIRECT_REQUIEM_672';x.alpha672ExactDispatch=true}
 // Alpha674: el exhaustivo actual modela apertura/Main Phase; las ventanas de batalla no son acciones libres.
 if(/(?:when an attack is declared|when an attack is declared involving|at the start of the damage step|during damage calculation|after damage calculation|if this card battles|when this card battles)/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='BATTLE_WINDOW_ONLY_674';x.alpha674BattleGate=true}
 if(/^once per turn restrictions?(?:\s|$)/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='SUMMARY_RESTRICTION_ONLY_675';x.alpha675Passive=true;x.alpha674BattleGate=false}
 // Alpha1114: reconocer la cabecera modal dividida por el parser sin habilitarla en el resolvedor genérico.
 if(cardName==='rock of the vanquisher'&&/during the main phase/.test(txt)&&/activate 1 of these effects/.test(txt)){
  x.nonActivatable=true;x.nonActivatableReason='ROCK_MODAL_DIRECT_HANDLER_1114';x.alpha677ExactDispatch=true;
 }
 // El coste separado de la resolución pertenece al manejador directo 680.
 if(cardName==='king s sarcophagus'&&/you can send 1 card from your hand to (?:the )?gy/.test(txt)){
  x.nonActivatable=true;x.nonActivatableReason='KINGS_SARC_DIRECT_HANDLER_1114';x.alpha680ExactDispatch=true;
 }
 if(cardName==='rock of the vanquisher'&&/cannot be used as link material/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='LINK_MATERIAL_RESTRICTION_PASSIVE_677';x.alpha677Passive=true}
 if(cardName==='rock of the vanquisher'&&/opponent s monsters can only (?:target|attack)/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='ATTACK_TARGET_RESTRICTION_PASSIVE_677';x.alpha677Passive=true}
 if(cardName==='rock of the vanquisher'&&/during the main phase/.test(txt)&&/(?:special summon 1 vanquish soul monster from (?:your )?hand|add 1 vanquish soul monster from (?:your )?gy)/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='EXACT_DIRECT_ROCK_677';x.alpha677ExactDispatch=true}
 if(cardName==='king s sarcophagus'&&/send 1 card from (?:your )?hand to (?:the )?gy/.test(txt)&&/send (?:1|a|an) horus monster from (?:your )?deck to (?:the )?gy/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='EXACT_DIRECT_KINGS_SARC_680';x.alpha680ExactDispatch=true}
 if(cardName==='king s sarcophagus'&&/horus monsters you control cannot be destroyed/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='CONTINUOUS_PROTECTION_PASSIVE_680';x.alpha680Passive=true}
 if(cardName==='yummyusment mignon'&&/yummy monsters you control gain 500 atk for each light beast monster on the field/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='CONTINUOUS_FIELD_ATK_MODIFIER_682';x.alpha682Passive=true;x.semantic={...(x.semantic||{}),continuous:true}}
 if(cardName==='stake your soul'){x.nonActivatable=true;x.nonActivatableReason='EXACT_DIRECT_STAKE_SOUL_685';x.alpha685ExactDispatch=true}
 if(Number(card?.id)===25789292&&/target 1 face up monster on the field/.test(txt)&&/^(?:target 1 face up monster on the field)/.test(txt)){x.nonActivatable=true;x.nonActivatableReason='EXACT_DIRECT_FORBIDDEN_CHALICE_1084';x.alpha1084ExactDispatch=true}
 // Solo se activan cuando suceso oficial correspondiente fue reconocido.
 // La enumeración libre del Main Phase no prueba destrucción por MST ni salida del campo por efecto rival.
 if(([67115133,20508881].includes(Number(card?.id))&&/if destroyed by mystical space typhoon/.test(txt))||
    (Number(card?.id)===84941194&&/if another card you control leaves by an opponent effect/.test(txt))){
   x.nonActivatable=true;x.nonActivatableReason='EVENT_ONLY_TRIGGER_UNPROVEN_1085';x.alpha1085MissingEvent=true;
 }
 if(Number(card?.id)===74018812&&[1,2].includes(Number(x.id))&&/send this card from your hand or field to the gy and discard 1 card/i.test(raw(card?.desc||card?.text))){
    x.nonActivatable=true;x.nonActivatableReason='EXACT_DIRECT_STOVIE_TORBIE_1085';x.alpha1085ExactDispatch=true;
 }
 if(Number(card?.id)===93156774&&Number(x.id)===1&&/reveal 1 other vanquish soul monster in your hand/.test(txt)){
   x.nonActivatable=true;x.nonActivatableReason='EXACT_DIRECT_HOLLIE_SUE_1085';x.alpha1085ExactDispatch=true;
 }


 // Alpha 1086: no present a Quick Effect that requires an opponent's previous
 // hand/GY activation without a verified event log. Its other clauses are not free actions.
 if(Number(card?.id)===91025875&&Number(x.id)===2&&/opponent (?:has )?activated a monster effect in (?:the )?hand or gy this turn/.test(txt)){
   x.nonActivatable=true;x.nonActivatableReason='OPPONENT_HAND_GY_EVENT_UNPROVEN_1086';x.alpha1086EventGate=true;
 }
 if(Number(card?.id)===91025875&&Number(x.id)===1&&/xyz monster that has this card as material gains/.test(txt)){
   x.nonActivatable=true;x.nonActivatableReason='MATERIAL_GRANT_PASSIVE_1086';
 }
 // Mementotlan Akihiron: all three clauses are triggered events, not free Main Phase effects.
 if(Number(card?.id)===54207171&&[1,2,3].includes(Number(x.id))&&
    (/on normal special summon/.test(txt)||/if destroyed by card effect/.test(txt)||/if a memento in hand field is destroyed/.test(txt))){
   x.nonActivatable=true;x.nonActivatableReason='AKIHIRO_EVENT_WINDOW_NOT_MODELED_1086';x.alpha1086EventGate=true;
 }
 // Borger's two modal outcomes are not a single unqualified generic draw action.
 if(Number(card?.id)===92895501&&Number(x.id)===2&&/reveal dark to draw 1 card/.test(txt)){
   x.nonActivatable=true;x.nonActivatableReason='BORGER_MODAL_EXACT_DARK_ONLY_1086';x.alpha1086ExactDispatch=true;
 }

 // Engraver effects 1/2/3 are resolved by explicit location-and-cost handlers only.
 // Suppress the generic parser: it cannot validate equip targets or the GY recycle cost.
 if(Number(card?.id)===60764609&&[1,2,3].includes(Number(x.id))){
   x.nonActivatable=true;x.nonActivatableReason='FIENDSMITH_ENGRAVER_DIRECT_1087';x.alpha1087ExactDispatch=true;
 }
 // Borger's modal quick effects cannot use the generic resolver.
 if(Number(card?.id)===92895501&&Number(x.id)===2){
   x.nonActivatable=true;x.nonActivatableReason='BORGER_TWO_MODES_DIRECT_1087';x.alpha1087ExactDispatch=true;
 }
 return x})};PARSE_CACHE_678.set(cacheKey,clone(out));if(PARSE_CACHE_678.size>4096)PARSE_CACHE_678.delete(PARSE_CACHE_678.keys().next().value);return clone(out)}
function full669(st){return typeof A604.fullState604==='function'?A604.fullState604(st):clone(st)}
function score669(st){const a=st?.analysis||{},z=st?.zones?.[0]||{};return(Number(a.successfulSummons)||0)*8+(Number(a.successfulActivations)||0)*5+(Number(a.searches)||0)*7+(Number(a.draws)||0)*4+(Number(a.negates)||0)*10+(Number(a.removals)||0)*7+arr(z.monster).length*6+arr(z.spelltrap).length*3}
/* Alpha 1100: cross-action card-identity conservation audit. It does not decide
 * whether an effect is legal; it prevents a physically inconsistent transition
 * from being labelled exact. Token creation/removal is intentionally reported as
 * NOT_PROVEN until a card-specific token oracle witnesses it. */
function inventoryGate1100(before,after){
 const fields=['deck','hand','monster','spelltrap','gy','extra','banished'];
 function snapshot(s){
  const problems=[],ids=[],byUid=new Map();let completePrintedIdentity=true,completeOwnership=true;
  if(!Array.isArray(s?.zones)||s.zones.length!==2)return {ok:false,problems:['ZONES_UNAVAILABLE'],ids:[],byUid};
  for(let p=0;p<2;p++){
   const part=s.zones[p];if(!part||typeof part!=='object'){problems.push('PLAYER_ZONE_MISSING');continue}
   for(const z of fields){
    if(!Array.isArray(part[z])){problems.push('ZONE_NOT_ARRAY_'+p+'_'+z);continue}
    for(const item of part[z]){
     const uid=item?.uid;
     if((typeof uid!=='string'&&typeof uid!=='number')||String(uid).trim()===''){
      problems.push('CARD_UID_MISSING_'+p+'_'+z);continue;
     }
     const key=String(uid);
     if(key!==key.trim())problems.push('CARD_UID_NONCANONICAL_'+p+'_'+z);
     ids.push(key);
     // Alpha 1101: same physical UID must not silently turn into another printed card.
     // A monster changing controller may change zones, not its owner or printed ID.
     // Check both representations: nested/flat metadata must agree BEFORE
     // comparing the same physical instance across two states.
     const field=v=>v==null||String(v).trim()===''?null:String(v).trim();
     const flatId=field(item?.id),nestedId=field(item?.card?.id);
     if(flatId!==null&&nestedId!==null&&flatId!==nestedId)problems.push('INTRINSIC_PRINTED_ID_CONFLICT:'+key);
     const printed=nestedId??flatId;
     const flatOwner=field(item?.ownerPlayer),nestedOwner=field(item?.card?.ownerPlayer);
     if(flatOwner!==null&&nestedOwner!==null&&flatOwner!==nestedOwner)problems.push('INTRINSIC_OWNER_CONFLICT:'+key);
     const owner=flatOwner??nestedOwner;
     if(printed===null)completePrintedIdentity=false;
     if(owner===null)completeOwnership=false;
     if(!byUid.has(key))byUid.set(key,{printed,owner});
    }
   }
  }
  ids.sort();
  for(let i=1;i<ids.length;i++)if(ids[i]===ids[i-1]){
   problems.push('DUPLICATE_PHYSICAL_UID');break;
  }
  return {ok:problems.length===0,problems,ids,byUid,completePrintedIdentity,completeOwnership};
 }
 const a=snapshot(before),b=snapshot(after),issues=[...a.problems.map(x=>'BEFORE_'+x),...b.problems.map(x=>'AFTER_'+x)];
 let printedCardIdentityVerified=true;
 if(a.ok&&b.ok){
  if(a.ids.length!==b.ids.length)issues.push('CARD_COUNT_CHANGED');
  if(a.ids.length===b.ids.length&&a.ids.some((id,i)=>id!==b.ids[i]))issues.push('CARD_INSTANCE_SET_CHANGED');
  for(const [uid,previous] of a.byUid){
   const next=b.byUid.get(uid);if(!next)continue;
   if(previous.printed!==null&&next.printed!==null&&previous.printed!==next.printed)issues.push('PRINTED_CARD_ID_CHANGED:'+uid);
   else if((previous.printed===null)!==(next.printed===null))issues.push('PRINTED_CARD_ID_METADATA_CHANGED:'+uid);
   if(previous.printed===null||next.printed===null)printedCardIdentityVerified=false;
   if(previous.owner!==null&&next.owner!==null&&previous.owner!==next.owner)issues.push('CARD_OWNER_CHANGED:'+uid);
   else if((previous.owner===null)!==(next.owner===null))issues.push('CARD_OWNER_METADATA_CHANGED:'+uid);
  }
 }
 return {version:'Alpha 1102',pass:issues.length===0,issues,
  beforeCount:a.ids.length,afterCount:b.ids.length,
  printedCardIdentityVerified:printedCardIdentityVerified&&a.completePrintedIdentity&&b.completePrintedIdentity,
  ownershipVerified:a.completeOwnership&&b.completeOwnership,
  scope:'Conservación de instancias, coherencia de identificadores y propietarios; no prueba cadenas ni legalidad',
  certifiesEffect:false,certifiesChain:false,certifiesTokenCreation:false};
}
function fixturesSafety1102(){
 const old=fixturesSafety1101();
 const blank=()=>({zones:[{deck:[],hand:[],monster:[],spelltrap:[],gy:[],extra:[],banished:[]},
  {deck:[],hand:[],monster:[],spelltrap:[],gy:[],extra:[],banished:[]}]});
 const base=blank();base.zones[0].hand.push({uid:'c1',id:111,card:{id:111,ownerPlayer:0},ownerPlayer:0});
 const cp=x=>JSON.parse(JSON.stringify(x));
 const candidate=(change)=>{const b=cp(base);change(b);return inventoryGate1100(base,b)};
 const conflictingPrinted=candidate(b=>b.zones[0].hand[0].id=999);
 const conflictingOwner=candidate(b=>b.zones[0].hand[0].card.ownerPlayer=1);
 const missingOwners=candidate(b=>{delete b.zones[0].hand[0].ownerPlayer;delete b.zones[0].hand[0].card.ownerPlayer});
 const missingBothOwners=cp(base);delete missingBothOwners.zones[0].hand[0].ownerPlayer;delete missingBothOwners.zones[0].hand[0].card.ownerPlayer;
 const whitespaceUid=candidate(b=>b.zones[0].hand[0].uid=' c1');
 const normalMove=candidate(b=>b.zones[0].gy.push(b.zones[0].hand.pop()));
 const oldResult=inventoryGate1100(missingBothOwners,missingBothOwners);
 const checks={...old.checks,
  detectsInternalPrintedConflict:conflictingPrinted.issues.some(s=>s.includes('INTRINSIC_PRINTED_ID_CONFLICT')),
  detectsInternalOwnerConflict:conflictingOwner.issues.some(s=>s.includes('INTRINSIC_OWNER_CONFLICT')),
  detectsMissingOwnerMetadata:missingOwners.issues.some(s=>s.includes('CARD_OWNER_METADATA_CHANGED')),
  missingOwnerNeverCertified:oldResult.ownershipVerified===false,
  detectsNoncanonicalUid:whitespaceUid.issues.some(s=>s.includes('CARD_UID_NONCANONICAL')),
  ordinaryMoveAllowed:normalMove.pass===true&&normalMove.ownershipVerified===true&&normalMove.printedCardIdentityVerified===true,
  incompleteEvidenceNoExactCertificate:(()=>{const out=[],before=cp(base),after=cp(base);after.zones[0].gy.push(after.zones[0].hand.pop());add669(out,{st:before,actions:[],exactPath:true},after,{id:111,name:'Prueba'},null,'TEST',{ok:true,partial:false},[],[],true,'c1','LOCAL_PHYSICAL_ONLY');return out.length===1&&out[0].actions[0].legal===false&&out[0].actions[0].physicalConservationVerified===true&&out[0].exactPath===false})()
 };
 return{version:'Alpha 1102',pass:Object.values(checks).every(Boolean),checks,count:Object.keys(checks).length,
  scope:'Integridad física y prevención de falsos certificados; no demuestra efectos universales'};
}
function add669(out,node,st,card,e,kind,result,targets=[],costs=[],exact=true,uid=null,source='ALPHA669'){
 if(!result?.ok||result?.partial)return;
 // This is a negative gate, not an independent rules certification.
 const integrity=exact===true?inventoryGate1100(node.st,st):null;
 const physicallySupported=exact===true&&integrity?.pass===true&&
  integrity.printedCardIdentityVerified===true&&integrity.ownershipVerified===true;
 // Physical conservation is not evidence that both players received their
 // legal response windows. This enumerator has no independently verified
 // response history for these local transitions. Keep them as candidates.
 const chainAndResponseProven=false;
 const fullyCertified=physicallySupported&&chainAndResponseProven;
 const a={card:name669(card)||'Carta',cardId:Number(card?.id)||null,
  effectId:e?.id??null,sourceUid:uid,actionType:kind,
  effectText:e?.raw||e?.resolution||'',activationText:e?.activation||'',
  conditionText:e?.condition||'',selectedTargets:clone(targets),targets:clone(targets),
  selectedCosts:clone(costs),costs:clone(e?.costs||costs),
  materials:clone(result?.materials||result?.materialUids||[]),
  result:fullyCertified?'RESUELTA_CERTIFICADA':'RESUELTA_NO_CERTIFICADA',
  resolutionStatus:fullyCertified?'CERTIFIED':'RULE_RESPONSE_WINDOW_NOT_PROVEN',
  legal:fullyCertified,certified:fullyCertified,physicalConservationVerified:physicallySupported,
  mechanicsProof:{exact:fullyCertified,source,
   physicalConservationVerified:physicallySupported,responseWindowProven:chainAndResponseProven,
   cardInventoryVerified:integrity?.pass===true,
   inventoryIssues:integrity?.issues||[],
   note:'Conservación física no prueba reglas, costes ni respuestas del rival'},
  ruleCertificate:{exact:fullyCertified,source,
   physicalInventoryGate:integrity?.pass??null},
  before:full669(node.st),after:full669(st),turn:st?.turn,phase:st?.phase};
 out.push({st,actions:[...arr(node.actions),a],score:score669(st),
  exactPath:node.exactPath!==false&&fullyCertified});
}
// Alpha 1089: transaction boundary for Engraver's two targeted cards.
// Uses a private copy and rejects failed/redirected moves; neither a sequential
// relocation nor a shared batch record proves SEGOC or Chain responses.
// Alpha 1090: validate all targets first and simulate both physical move orders.
// Agreement proves order-invariance in the modelled state only, NOT chain/SEGOC legality.
function moveEngraverTwo1089(state,equipUid,monsterUid,sourceUid){
 const core=R(),a=core.alpha314||{},id1=raw(equipUid),id2=raw(monsterUid);
 if(!id1||!id2||id1===id2)return {ok:false,reason:'DISTINCT_TARGETS_REQUIRED'};
 const trial=clone(state),e=core.locate?.(trial,id1),m=core.locate?.(trial,id2),src=core.locate?.(trial,sourceUid);
 if(!e||e.p!==0||e.z!=='spelltrap'||e.item?.faceUp===false||!m||m.z!=='monster'||!src||src.z!=='monster')return{ok:false,reason:'PRE_RESOLUTION_TARGET_INVALID'};
 const ec=e.item?.card||e.item,mc=m.item?.card||m.item;
 if(!/fiendsmith/i.test(name669(ec))||!(/equip/i.test(type669(ec))||e.item.attachedTo||e.item.equipTo||e.item.equippedTo||e.item?.flags?.equipTargetUid))return{ok:false,reason:'NOT_FIENDSMITH_EQUIP'};
 if(!isMonster669(mc))return{ok:false,reason:'MONSTER_REQUIRED'};
 if(arr(trial.replacementEffects).length)return{ok:false,reason:'REPLACEMENT_STATE_UNRESOLVED'};
 if(arr(trial.pendingTriggers).length||arr(trial.triggerQueue).length||arr(trial.chain).length)return{ok:false,reason:'PENDING_CHAIN_OR_TRIGGER_WINDOW'};
 const context={sourceUid,sourcePlayer:0,activated:true,kind:'SEND_GY'};
 for(const uid of [id1,id2]){
  if(typeof a.canTarget==='function'&&!a.canTarget(trial,uid,context))return{ok:false,reason:'TARGETING_PROTECTION',uid};
  if(typeof a.canAffect==='function'&&!a.canAffect(trial,uid,context))return{ok:false,reason:'UNAFFECTED_BY_EFFECT',uid};
 }
 if(/pendulum/i.test(type669(mc))||/pendulum/i.test(type669(ec)))return{ok:false,reason:'PENDULUM_REPLACEMENT_UNMODELED'};
 if(typeof a.replacementCandidates==='function')for(const q of [e,m]){
  if(arr(a.replacementCandidates(trial,{uid:q.item.uid,item:q.item,from:q.z,to:'gy',type:'SEND_GY',effect:true,sourceUid,sourcePlayer:0})).length)
   return{ok:false,reason:'REPLACEMENT_CHOICE_UNMODELED',uid:q.item.uid};
 }
 // Each order operates on an entirely separate state. A divergent physical state
 // means sequential processing affected the result; refuse to invent simultaneity.
 const moveOrder=(order)=>{
  const copy=clone(trial),before=arr(copy.events).length;
  for(const uid of order){
   const r=core.alpha314Relocate?.(copy,uid,'gy',{type:'SEND_GY',effect:true,sourcePlayer:0,sourceUid});
   if(!r?.ok||r.cancelled||core.locate?.(copy,uid)?.z!=='gy')return{ok:false,reason:'MOVE_FAILED',uid};
  }
  return {ok:true,st:copy,before};
 };
 const first=moveOrder([id1,id2]);if(!first.ok)return first;
 const reverse=moveOrder([id2,id1]);if(!reverse.ok)return{ok:false,reason:'REVERSE_ORDER_MOVE_FAILED',uid:reverse.uid};
 // Compare all major non-event mutable state, with GY order deliberately normalized.
 // Graveyard physical order does not establish a card's activation or a trigger order.
 function normalizedPhysical(st){
  const stable=v=>Array.isArray(v)?v.map(stable):(v&&typeof v==='object')?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
  const zones=clone(st.zones);
  for(const p of arr(zones))if(Array.isArray(p?.gy))p.gy.sort((u,v)=>raw(u?.uid).localeCompare(raw(v?.uid)));
  // Compare the full physical zones and the windows/resources that may alter legality.
  // Derived protection caches and event counters depend on inspection order and are
  // deliberately not used as proof of simultaneous effect resolution.
  const keys=['lp','chain','triggerQueue','pendingTriggers','replacementEffects','continuousEffects',
   'normalSummonAvailable','normalSummonCount','summonLocks','activationLocks','restrictionLocks'];
  const critical={zones};for(const key of keys)if(st[key]!==undefined)critical[key]=st[key];
  const ev=arr(st.events).map(x=>{
   const e=clone(x);delete e.id;delete e.timestamp;return JSON.stringify(stable(e));
  }).sort();
  critical.events=ev;
  return JSON.stringify(stable(critical));
 }
 if(normalizedPhysical(first.st)!==normalizedPhysical(reverse.st))return{ok:false,reason:'MOVE_ORDER_STATE_DIVERGENCE'};
 const result=first.st,sequence=Number(result.__alpha1089BatchSequence||0)+1;
 result.__alpha1089BatchSequence=sequence;
 const batch={id:`ENGRAVER_TWO_SEND_${sequence}`,effectId:2,sourceUid:raw(sourceUid),targets:[id1,id2],from:['spelltrap','monster'],to:['gy','gy'],
  linkedEventIndices:[first.before,first.before+1],physicalCommitted:true,orderInvariantPhysical:true,atomicRulesVerified:false,
  unresolved:['SIMULTANEOUS_TRIGGER_WINDOW','CHAIN_RESPONSE_WINDOW','EQUIP_LEAVE_FIELD_INTERACTIONS'],turn:result.turn,phase:result.phase};
 result.__alpha1089Batches=arr(result.__alpha1089Batches);result.__alpha1089Batches.push(batch);
 arr(result.events).slice(first.before,first.before+2).forEach((ev,i)=>{ev.alpha1089BatchId=batch.id;ev.alpha1089Part=i+1});
 return{ok:true,st:result,batch,exact:false};
}

/* Alpha 1097 — resolución ACOTADA de cadenas previamente cerradas.
 * No genera respuestas ni prioridad por su cuenta, y NO certifica cartas.
 * Exige evidencia explícita de oportunidad de respuesta y dos pases,
 * verificaciones negativas de velocidad/activación y una pila consistente.
 * El resultado es siempre candidato no certificado, incluso con efectos completos.
 */
function resolveClosedChain1097(node,evidence={},opts={}){
 const denied=(reason)=>({ok:false,reason,certified:false,sourceUnchanged:true,status:'CHAIN_NOT_PROVEN_1097'});
 const state=node?.st,stack=arr(state?.chain),links=arr(evidence.links),passes=arr(evidence.passes);
 if(!state||stack.length<1||stack.length>12||links.length!==stack.length)return denied('CHAIN_LINK_COUNT_OR_SNAPSHOT_MISSING');
 if(arr(state.pendingTriggers).length||arr(state.triggerQueue).length)return denied('TRIGGER_WINDOW_UNRESOLVED');
 if(passes.length!==2||passes.some(x=>!Number.isSafeInteger(x?.player)||![0,1].includes(x.player)||x?.atChainLength!==stack.length))return denied('TWO_PASSES_NOT_ESTABLISHED');
 const hasPriorityLedger=Array.isArray(evidence?.priorityEvents1098);
 if(opts.requirePriorityHistory1098===true&&!hasPriorityLedger)return denied('PRIORITY_LEDGER_REQUIRED_1098');
 const priorityResult=hasPriorityLedger?priorityHistory1098(state,evidence):null;
 if(hasPriorityLedger&&priorityResult.pass!==true)return denied('PRIORITY_LEDGER_REJECTED_1098:'+priorityResult.reason);
 const lastPlayer=Number(links.at(-1)?.player);
 if(![0,1].includes(lastPlayer)||passes[0].player!==1-lastPlayer||passes[1].player!==lastPlayer)return denied('RESPONSE_PRIORITY_ORDER_UNPROVEN');
 if(evidence?.closed!==true||evidence?.noNewLinksAfterPasses!==true)return denied('CHAIN_CLOSURE_NOT_EVIDENCED');
 for(let i=0;i<stack.length;i++){
  const a=stack[i],b=links[i];
  if(!a||!b||String(a.uid)!==String(b.uid)||Number(a.player)!==Number(b.player)||
     (a.effectId!=null&&b.effectId!=null&&String(a.effectId)!==String(b.effectId))||
     Number(b.chainLink)!==i+1)return denied('CHAIN_DECLARATION_SNAPSHOT_MISMATCH');
 }
 const gates=W.YGOAlpha1096||W.YGOAlpha1095||{};
 if(gates.spellSpeedGate1072?.(links)?.pass!==true)return denied('SPELL_SPEED_UNVERIFIED');
 if(gates.activationTimingGate1073?.(links)?.pass!==true)return denied('ACTIVATION_WINDOW_UNVERIFIED');
 const cp=clone(state),trace=[],engine=R(),limit=stack.length;
 if(typeof engine.resolveTop!=='function')return denied('RESOLVER_UNAVAILABLE');
 const inventory=st=>{
  const result=[];
  for(let p=0;p<2;p++)for(const zone of ['deck','hand','monster','spelltrap','gy','extra','banished'])
   for(const item of arr(st?.zones?.[p]?.[zone]))result.push(`${p}:${String(item.uid)}`);
  return result.sort().join('|');
 };
 const beforeInventory=inventory(cp);
 for(let k=0;k<limit;k++){
  if(opts.shouldCancel?.()===true)return denied('RESOLUTION_CANCELLED');
  const expected=links[limit-k-1],top=arr(cp.chain).at(-1);
  if(!top||String(top.uid)!==String(expected.uid)||Number(top.player)!==Number(expected.player))return denied('RESOLUTION_ORDER_DIVERGED');
  let rr;try{rr=engine.resolveTop(cp)}catch(_){return denied('RESOLUTION_EXCEPTION')}
  if(rr?.ok!==true||rr.partial===true||arr(cp.chain).length!==limit-k-1)return denied('RESOLUTION_PARTIAL_OR_STACK_STALLED');
  trace.push({chainLink:limit-k,uid:String(expected.uid),player:expected.player,handler:String(rr.handler||''),completeWithinModel:true});
  if(arr(cp.pendingTriggers).length||arr(cp.triggerQueue).length)return denied('POST_RESOLUTION_TRIGGER_WINDOW_UNPROVEN');
 }
 if(arr(cp.chain).length||inventory(cp)!==beforeInventory)return denied('PHYSICAL_CARD_INVENTORY_UNPROVEN');
 return {ok:true,status:'BOUNDED_CHAIN_CANDIDATE_1097',certified:false,
   rulesUniversallyProven:false,priorityHistoryProven:false,priorityLedgerConsistent:priorityResult?.pass===true,chainWindowVerified:false,
   physicalWithinModel:true,sourceUnchanged:true,state:cp,trace,
   reasons:['CARD_SPECIFIC_EFFECTS_NOT_INDEPENDENTLY_CERTIFIED','RESPONSE_OPTIONS_NOT_EXHAUSTIVELY_ENUMERATED']};
}

/* Alpha 1099: single-link chains and non-turn-player first Fast Effect.
  The ledger is supplied evidence, not an independent oracle of card legality.
  Source: Konami Fast Effect Timing, v8 rulebook chain resolution. */
function priorityHistory1098(state,evidence={}){
 const fail=reason=>({version:'Alpha 1099',pass:false,closed:false,reason,certified:false});
 const chain=arr(state?.chain),events=arr(evidence?.priorityEvents1098);
 if(chain.length<1||chain.length>12||events.length<chain.length+2||events.length>36)return fail('PRIORITY_LEDGER_SIZE_INVALID');
 if(arr(state?.triggerQueue).length||arr(state?.pendingTriggers).length)return fail('TRIGGERS_NOT_RESOLVED');
 const turnPlayer=state?.activePlayer;
 if(!Number.isSafeInteger(turnPlayer)||![0,1].includes(turnPlayer))return fail('TURN_PLAYER_UNKNOWN');
 const phase=raw(state?.phase).trim().toUpperCase();if(!phase)return fail('PHASE_UNKNOWN');
 let links=[],turn=turnPlayer,passes=[],closed=false,openingPasses=0;
 for(const entry of events){
  if(closed)return fail('EVENT_AFTER_CHAIN_CLOSURE');
  const type=raw(entry?.type).toUpperCase(),player=entry?.player;
  if(!Number.isSafeInteger(player)||![0,1].includes(player)||player!==turn)return fail('PRIORITY_OWNER_MISMATCH');
  if(type==='ACTIVATE'){
   const speed=entry?.spellSpeed,count=links.length;
   if(!Number.isSafeInteger(speed)||![1,2,3].includes(speed)||
     (count>0&&(speed<2||speed<links[count-1].spellSpeed)))return fail('INVALID_RESPONSE_SPELL_SPEED');
   // A player who is NOT the turn player can initiate a Chain only using a Fast Effect
   // after the turn player has offered them priority by passing.
   if(count===0&&player!==turnPlayer&&(openingPasses!==1||speed<2))return fail('OPPONENT_OPENING_FAST_EFFECT_REQUIRED');
   if(count===0&&player===turnPlayer&&openingPasses!==0)return fail('OPENING_TURN_PRIORITY_UNPROVEN');
   if(count>=12||entry.chainLink!==count+1||!raw(entry.uid).trim())return fail('INVALID_CHAIN_LINK');
   if(links.some(x=>x.uid===raw(entry.uid)))return fail('DUPLICATE_CHAIN_SOURCE_NOT_SUPPORTED');
   const link={uid:raw(entry.uid),player,spellSpeed:speed,chainLink:count+1};
   if(entry.effectId!==undefined)link.effectId=raw(entry.effectId);
   links.push(link);passes=[];turn=1-player;
  }else if(type==='PASS'){
   if(!links.length){
    if(++openingPasses>=2)return fail('OPEN_STATE_REOPENED_WITHOUT_CHAIN');
    turn=1-player;continue;
   }
   passes.push({player,atChainLength:links.length});turn=1-player;
   if(passes.length===2)closed=true;
  }else return fail('UNKNOWN_PRIORITY_EVENT');
 }
 if(!closed||passes.length!==2)return fail('TWO_CONSECUTIVE_PASSES_NOT_PROVEN');
 if(links.length!==chain.length)return fail('CHAIN_LENGTH_MISMATCH');
 for(let i=0;i<chain.length;i++){
  const a=chain[i],b=links[i];
  if(!a||raw(a.uid)!==b.uid||a.player!==b.player||
     (a.spellSpeed!==undefined&&a.spellSpeed!==b.spellSpeed)||
     (a.chainLink!==undefined&&a.chainLink!==b.chainLink)||
     (a.effectId!==undefined||b.effectId!==undefined)&&raw(a.effectId)!==raw(b.effectId))return fail('CHAIN_SNAPSHOT_MISMATCH');
 }
 const supplied=arr(evidence?.passes);
 if(supplied.length!==2||supplied.some((p,i)=>!p||!Number.isSafeInteger(p.player)||
    p.player!==passes[i].player||p.atChainLength!==passes[i].atChainLength))return fail('DECLARED_PASSES_DIVERGE');
 return {version:'Alpha 1099',pass:true,closed:true,certified:false,modelledPriorityOnly:true,
  links,passes,openingPasses,reason:'PRIORITY_SEQUENCE_CONSISTENT_WITH_DECLARED_HISTORY',
  limitations:['NO_CARD_ACTIVATION_OR_COST_PROOF','NO_OPPONENT_OPTIONS_ENUMERATION','NO_CARD_EFFECT_RESOLUTION_PROOF']};
}

/* An open game state is NOT a resolved Chain: when both players pass
   without starting a chain, Main Phase decisions may resume. This helper
   only validates a supplied ledger, it never grants game-action certification. */
function openStatePasses1099(state,evidence={}){
 const events=arr(evidence?.priorityEvents1098),t=state?.activePlayer;
 const valid=Array.isArray(state?.chain)&&state.chain.length===0&&
  arr(state?.pendingTriggers).length===0&&arr(state?.triggerQueue).length===0&&
  Number.isSafeInteger(t)&&[0,1].includes(t)&&raw(state.phase).trim()!==''&&
  events.length===2&&events[0]?.type==='PASS'&&events[0]?.player===t&&
  events[1]?.type==='PASS'&&events[1]?.player===1-t;
 return {version:'Alpha 1099',pass:valid,open:valid,certified:false,
  reason:valid?'OPEN_STATE_RESTORED_AFTER_TWO_PASSES':'OPEN_STATE_PASSES_NOT_PROVEN'};
}

function postActionWindowPending1101(state){
 const marker=state?.__alpha1098FastWindow;
 return Boolean(marker)&&!(marker.status==='RESOLVED'&&marker.priorityVerified===true&&marker.noPendingChain===true);
}
function fixturesSafety1101(){
 const empty=()=>({zones:[{deck:[],hand:[],monster:[],spelltrap:[],gy:[],extra:[],banished:[]},{deck:[],hand:[],monster:[],spelltrap:[],gy:[],extra:[],banished:[]}]});
 const a=empty();a.zones[0].hand.push({uid:'fixed-1',card:{id:101},ownerPlayer:0});
 const copy=x=>JSON.parse(JSON.stringify(x));
 const move=copy(a);move.zones[0].gy.push(move.zones[0].hand.pop());
 const swap=copy(a);swap.zones[0].hand[0].card.id=202;
 const stolen=copy(a);stolen.zones[0].hand[0].ownerPlayer=1;
 const duplicated=copy(a);duplicated.zones[0].deck.push({...duplicated.zones[0].hand[0]});
 const missing=copy(a);missing.zones[0].hand.length=0;
 const missingMeta=copy(a);delete missingMeta.zones[0].hand[0].card.id;
 const checks={
  validMove:inventoryGate1100(a,move).pass===true,
  changedPrintedIdRejected:inventoryGate1100(a,swap).issues.some(x=>x.startsWith('PRINTED_CARD_ID_CHANGED')),
  ownershipChangeRejected:inventoryGate1100(a,stolen).issues.some(x=>x.startsWith('CARD_OWNER_CHANGED')),
  duplicateRejected:inventoryGate1100(a,duplicated).pass===false,
  vanishedRejected:inventoryGate1100(a,missing).pass===false,
  droppedIdentityMetadataRejected:inventoryGate1100(a,missingMeta).pass===false,
  openPending:postActionWindowPending1101({__alpha1098FastWindow:{status:'OPEN'}})===true,
  awaitingPending:postActionWindowPending1101({__alpha1098FastWindow:{status:'AWAITING_RESPONSE'}})===true,
  closedWithoutProofPending:postActionWindowPending1101({__alpha1098FastWindow:{status:'CLOSED'}})===true,
  resolvedWithoutProofPending:postActionWindowPending1101({__alpha1098FastWindow:{status:'RESOLVED',priorityVerified:false,noPendingChain:true}})===true,
  resolvedWithProofAllowed:postActionWindowPending1101({__alpha1098FastWindow:{status:'RESOLVED',priorityVerified:true,noPendingChain:true}})===false,
  absentWindowAllowed:postActionWindowPending1101({})===false
 };
 return {version:'Alpha 1101',pass:Object.values(checks).every(Boolean),checks,count:Object.keys(checks).length,
  certifiesUniversalRules:false,scope:'Pruebas negativas de conservación física y de ventanas rápidas; no certifican combos'};
}
function enumerateNode669(node,opts={}){
 const R0=R(),auditDeterministic=opts.auditDeterministic===true,maxBranches=Math.max(8,Number(opts.maxActionBranches)||4096),nodeBudgetMs=Math.max(4,Math.min(250,Number(opts.nodeBudgetMs)||35)),nodeStarted=performance.now?.()||Date.now(),nodeExpired=()=>opts.shouldCancel?.()===true||(!auditDeterministic&&((performance.now?.()||Date.now())-nodeStarted)>=nodeBudgetMs);
 // Alpha 1094: do not enumerate free Main Phase actions while a Chain or SEGOC
 // trigger window is awaiting its own rule-correct resolver. A legacy fallback
 // may simulate some cases, but it has not established universal turn/priority
 // windows and cannot award an 'exact' line by silently ignoring this window.
 const explicitFastWindow=node?.st?.__alpha1098FastWindow;
 // Alpha 1099: OPEN means the opponent still has priority, not that Main Phase actions are free.
 // A terminal marker is usable only with explicit proof that the response opportunity is exhausted.
  const fastWindowUnresolved=postActionWindowPending1101(node?.st);
 const unresolvedWindow=fastWindowUnresolved?'FAST_EFFECT_RESPONSE_WINDOW_PENDING_1098':
  arr(node?.st?.chain).length?'CHAIN_WINDOW_UNRESOLVED_1094':
   (arr(node?.st?.pendingTriggers).length||arr(node?.st?.triggerQueue).length)?'TRIGGER_WINDOW_UNRESOLVED_1094':null;
 if(unresolvedWindow==='CHAIN_WINDOW_UNRESOLVED_1094'&&opts.chainEvidence1097){
  // The enumerator must never resume a closed Chain from user-declared passes alone.
  // Require the independently checked declared priority sequence as well.
  const closed=resolveClosedChain1097(node,opts.chainEvidence1097,{...opts,requirePriorityHistory1098:true});
  if(closed.ok===true){
   const candidate={...node,st:closed.state,exactPath:false,actions:[...arr(node.actions),{
    actionType:'RESOLVE_CLOSED_CHAIN_1097',legal:false,certified:false,
    result:'CADENA_REPRODUCIDA_NO_CERTIFICADA',resolutionStatus:closed.status,
    chainTrace:closed.trace,mechanicsProof:{exact:false,chainWindowVerified:false}}]};
   return {nodes:[candidate],complete:false,certified:false,
    reasons:closed.reasons,unresolved:[],nodeElapsedMs:0,nodeBudgetMs,maxBranches,auditDeterministic};
  }
  return {nodes:[],complete:false,certified:false,reasons:[closed.reason],
   unresolved:opts.collectUnresolved===true?[{reason:closed.reason,officialEvidence:'CLOSED_CHAIN_NOT_PROVEN'}]:[],
   nodeElapsedMs:0,nodeBudgetMs,maxBranches,auditDeterministic};
 }
 if(unresolvedWindow)return {nodes:[],complete:false,reasons:[unresolvedWindow],
   unresolved:opts.collectUnresolved===true?[{reason:unresolvedWindow,sourceUid:null,officialEvidence:'RULE_WINDOW_NOT_MODELED'}]:[],
   nodeElapsedMs:0,nodeBudgetMs,maxBranches,auditDeterministic,certified:false};
 // Alpha 1096: fail closed on turns/phases for which the single-player
 // Main Phase action generator cannot prove priority. Previously the generic
 // normal-summon / Set / search enumerators could run on the opponent's turn
 // or in the Draw/Standby/End Phase. Rock of the Vanquisher has a Quick Effect
 // on either player's Main Phase; its opponent-turn timing is NOT supported
 // here, so report the coverage gap instead of simulating illegal summons.
 const activePlayer=Number(node?.st?.activePlayer);
 const phase=raw(node?.st?.phase).trim().toUpperCase();
 if(activePlayer!==0 || !/^MAIN(?:\s*[12])?$/.test(phase)){
  const reason=activePlayer!==0?'OPPONENT_TURN_PRIORITY_NOT_MODELED_1096':'NON_MAIN_PHASE_RULE_WINDOW_NOT_MODELED_1096';
  return {nodes:[],complete:false,certified:false,reasons:[reason],
   unresolved:opts.collectUnresolved===true?[{reason,sourceUid:null,officialEvidence:'SINGLE_PLAYER_MAIN_PHASE_ONLY'}]:[],
   nodeElapsedMs:0,nodeBudgetMs,maxBranches,auditDeterministic};
 }
 const st=node.st,z=st?.zones?.[0]||{},out=[],reasons=[],unresolved=[];let complete=true;const markGap=(reason,card,e,uid,targets=[],costs=[],result=null)=>{if(opts.collectUnresolved!==true||unresolved.length>=32)return;const key=[reason,Number(card?.id)||'',Number(e?.id)||'',String(uid??'')].join('|');if(unresolved.some(x=>x.key===key))return;unresolved.push({key,reason,cardId:Number(card?.id)||null,card:name669(card),effectId:e?.id??null,sourceUid:String(uid??''),targets:clone(targets),costs:clone(costs),effectText:String(e?.raw||e?.resolution||'').slice(0,350),resolutionStatus:String(result?.link?.status||result?.status||''),officialEvidence:reason==='PARTIAL_RESOLUTION'?'NOT_YET_VERIFIED':null})};const remainingBranches=()=>Math.max(0,maxBranches-out.length),budgetStop=()=>{if(out.length>=maxBranches){complete=false;reasons.push('ACTION_GLOBAL_BRANCH_CAP');return true}if(nodeExpired()){complete=false;reasons.push(opts.shouldCancel?.()===true?'NODE_CANCELLED':'NODE_TIME_BUDGET');return true}return false};
 for(const item of arr(z.hand)){if(out.length>=maxBranches){complete=false;reasons.push('ACTION_GLOBAL_BRANCH_CAP');break}if(nodeExpired()){complete=false;reasons.push('NODE_TIME_BUDGET');break}const c=item?.card||item;if(!isMonster669(c)||!st?.normalSummonAvailable?.[0])continue;const lev=Number(c?.level)||0,need=lev>=7?2:lev>=5?1:0,cc=A655.combinations655?.(arr(z.monster).map(x=>x.uid),need,maxBranches)||{rows:[[]],truncated:false};if(cc.truncated){complete=false;reasons.push('NORMAL_TRIBUTE_BRANCH_CAP')}for(const trib of cc.rows){if(budgetStop())break;const ns=clone(st),r=R0.performNormalSummon?.(ns,0,item.uid,trib);if(r?.ok)add669(out,node,ns,c,null,'NORMAL SUMMON',r,[],trib,true,item.uid,'CORE_NORMAL_SUMMON_669')}}
 for(const fn of [A666.sets666,A666.extra666,A666.direct666]){if(budgetStop())break;if(typeof fn!=='function')continue;const remaining=Math.max(1,remainingBranches()),part=fn(node,remaining,{deadline:auditDeterministic?Infinity:nodeStarted+nodeBudgetMs});if(!part)continue;const pn=arr(part.nodes);out.push(...pn.slice(0,remaining));if(pn.length>remaining){complete=false;reasons.push('ACTION_GLOBAL_BRANCH_CAP')}if(!part.complete){complete=false;reasons.push(...arr(part.reasons))}}
 const sources=[...arr(z.hand),...arr(z.monster),...arr(z.spelltrap),...arr(z.gy).filter(x=>Number((x?.card||x)?.id)===60764609)];
 for(const item of sources){if(budgetStop())break;const q0=R0.locate?.(st,item.uid);if(!q0||(q0.z==='monster'&&q0.item?.faceUp===false))continue;const c=q0.item?.card||item.card||item;
  if(norm(name669(c))==='rock of the vanquisher'&&!printedCard1113(q0.item,28168628)){complete=false;reasons.push('ROCK_PRINTED_IDENTITY_UNVERIFIED_1113')}
  if(norm(name669(c))==='rock of the vanquisher'&&printedCard1113(q0.item,28168628)&&q0.z==='monster'&&q0.item?.faceUp!==false&&Number(st?.activePlayer)===0&&/^MAIN/.test(raw(st?.phase).toUpperCase())&&arr(st?.chain).length===0&&arr(st?.pendingTriggers).length===0&&arr(st?.triggerQueue).length===0){
   const useKey=`0|rock of the vanquisher|${Number(st?.turn)||1}`,used=!!st?.__alpha677RockUses?.[useKey];
   if(!used){const choices=[];for(const x of arr(z.hand)){if(isVS677(x)&&!officialCard1113(x)){complete=false;reasons.push('ROCK_HAND_TARGET_UNVERIFIED_1113')}else if(officialCard1113(x)&&isVS677(officialCard1113(x)))choices.push({kind:'SUMMON',uid:x.uid})}for(const x of arr(z.gy)){if(isVS677(x)&&!officialCard1113(x)){complete=false;reasons.push('ROCK_GY_TARGET_UNVERIFIED_1113')}else if(officialCard1113(x)&&isVS677(officialCard1113(x)))choices.push({kind:'RECOVER',uid:x.uid})}let n=0;for(const ch of choices){if(budgetStop()){reasons.push('ROCK_677_BRANCH_CAP');break}if(n++>=remainingBranches()){complete=false;reasons.push('ROCK_677_BRANCH_CAP');break}const ns=clone(st),src=R0.locate?.(ns,item.uid),t=R0.locate?.(ns,ch.uid);if(!src||src.z!=='monster'||!t)continue;let rr=null;if(ch.kind==='SUMMON'&&t.z==='hand'){
       // Alpha 1170: performSpecialSummon refuses ALL hand invocations by design;
       // Rock's printed, modal Quick Effect is the bounded authorization.
       // A plain relocation without these checks would enable free summoning.
       const limit=Math.max(1,Number(W.YGOAlpha800?.contract800?.(ns.formatKey||W.__YGO_ACTIVE_BAN_KEY)?.monsterZones)||5);
       const locks=arr(ns.summonLocks);
       const locked=locks.some(v=>Number(v?.player)===0&&/^(?:SPECIAL|EFFECT|ALL)$/i.test(raw(v?.type)));
       const printed=officialCard1113(t.item);
       const canMove=Number.isInteger(limit)&&arr(ns.zones?.[0]?.monster).length<limit&&!locked&&
         !!printed&&isVS677(printed)&&/monster/i.test(raw(printed?.type))&&
         q0.item?.faceUp!==false&&R0.locate?.(ns,item.uid)?.z==='monster';
       if(canMove){
         const r=R0.alpha314Relocate?.(ns,t.item.uid,'monster',
           {type:'SPECIAL_SUMMON',effect:true,sourcePlayer:0,sourceUid:item.uid,toPlayer:0,faceUp:true});
         const arrived=R0.locate?.(ns,t.item.uid);
         if(r?.ok&&!r.cancelled&&r.destination==='monster'&&arrived?.z==='monster'&&arrived.p===0){
           ns.analysis=ns.analysis||{};ns.analysis.successfulSummons=(Number(ns.analysis.successfulSummons)||0)+1;
           rr={ok:true,partial:false,handler:'alpha677Rock',branch:'SPECIAL_SUMMON',targetUid:t.item.uid};
         }
       }
     }else if(ch.kind==='RECOVER'&&t.z==='gy'){const r=R0.alpha314Relocate?.(ns,t.item.uid,'hand',{type:'RECOVER',sourcePlayer:0,sourceUid:item.uid});if(r?.ok&&!r?.cancelled)rr={ok:true,partial:false,handler:'alpha677Rock',branch:'RECOVER_GY',targetUid:t.item.uid}}if(!rr)continue;ns.__alpha677RockUses=ns.__alpha677RockUses||{};ns.__alpha677RockUses[useKey]=true;const e={id:4,raw:'During the Main Phase (Quick Effect): Special Summon 1 Vanquish Soul monster from your hand, or add 1 Vanquish Soul monster from your GY to your hand.',resolution:ch.kind==='SUMMON'?'Special Summon 1 Vanquish Soul monster from your hand.':'Add 1 Vanquish Soul monster from your GY to your hand.'};add669(out,node,ns,c,e,'EFECTO',{...rr,nonTargeting:true,choiceUid:ch.uid,activationChainVerified:false},[],[],false,item.uid,'ROCK_MODAL_OUTCOME_BOUNDED_1093')}}
  }
  if(norm(name669(c))==='king s sarcophagus'&&!printedCard1113(q0.item,16528181)){complete=false;reasons.push('SARC_PRINTED_IDENTITY_UNVERIFIED_1113')}
  if(norm(name669(c))==='king s sarcophagus'&&printedCard1113(q0.item,16528181)&&q0.z==='spelltrap'&&q0.item?.faceUp!==false&&Number(st?.activePlayer)===0&&/^MAIN/.test(raw(st?.phase).toUpperCase())&&arr(st?.chain).length===0&&arr(st?.pendingTriggers).length===0&&arr(st?.triggerQueue).length===0){
   const key=`0|king s sarcophagus|${Number(st?.turn)||1}`,used=Number(st?.__alpha680KingsSarcUses?.[key]||0);if(used<4){const hand=arr(z.hand).filter(x=>{if(officialCard1113(x))return true;complete=false;reasons.push('SARC_HAND_COST_UNVERIFIED_1113');return false}),horus=arr(z.deck).filter(x=>{if(!isHorus680(x))return false;const known=officialCard1113(x);if(known&&isHorus680(known))return true;complete=false;reasons.push('SARC_DECK_TARGET_UNVERIFIED_1113');return false});let n=0;for(const cost of hand){if(budgetStop())break;for(const target of horus){if(budgetStop()){reasons.push('KINGS_SARC_680_BRANCH_CAP');break}if(n++>=Math.max(1,remainingBranches())){complete=false;reasons.push('KINGS_SARC_680_BRANCH_CAP');break}if(String(cost.uid)===String(target.uid))continue;const ns=clone(st),src=R0.locate?.(ns,item.uid),cq=R0.locate?.(ns,cost.uid),tq=R0.locate?.(ns,target.uid);if(!src||src.z!=='spelltrap'||!cq||cq.z!=='hand'||!tq||tq.z!=='deck'||!isHorus680(tq.item))continue;const c1=R0.alpha314Relocate?.(ns,cq.item.uid,'gy',{type:'COST_SEND_GY',sourcePlayer:0,sourceUid:item.uid});if(!c1?.ok||c1?.cancelled)continue;const r1=R0.alpha314Relocate?.(ns,tq.item.uid,'gy',{type:'SEND_GY',effect:true,sourcePlayer:0,sourceUid:item.uid});if(!r1?.ok||r1?.cancelled||R0.locate?.(ns,cost.uid)?.z!=='gy'||R0.locate?.(ns,target.uid)?.z!=='gy')continue;const permutation=shuffleMainSample1088(ns,0,item.uid,'KINGS_SARC_SEND_HORUS_1093');if(!permutation.ok)continue;ns.__alpha680KingsSarcUses=ns.__alpha680KingsSarcUses||{};ns.__alpha680KingsSarcUses[key]=used+1;const e={id:2,raw:'You can send 1 card from your hand to the GY; send 1 Horus monster from your Deck to the GY.',activation:'Send 1 card from your hand to the GY',resolution:'Send 1 Horus monster from your Deck to the GY.'},rr={ok:true,partial:false,handler:'alpha680KingsSarcophagus',costUid:cost.uid,targetUid:target.uid,use:used+1};add669(out,node,ns,c,e,'EFECTO',{...rr,shuffleSequence:permutation.sequence,shuffleDistributionCertified:false,activationChainVerified:false},[],[cost.uid],false,item.uid,'KINGS_SARC_COST_SEND_SHUFFLE_BOUNDED_1093')}if(out.length>=maxBranches||nodeExpired())break}}
  }
  if(norm(name669(c))==='stake your soul'&&/^MAIN/.test(raw(st?.phase).toUpperCase())&&(q0.z==='hand'||q0.z==='spelltrap')){
   const key=`0|stake your soul|${Number(st?.turn)||1}`,used=!!st?.__alpha685StakeUses?.[key];
   if(!used){const reveals=arr(z.hand).filter(x=>isMonster669(x?.card||x)),targets=arr(z.deck).filter(x=>isVS677(x));let n=0;
    for(const rv of reveals){if(budgetStop())break;const rc=rv?.card||rv,rattr=raw(rc?.attribute).toUpperCase();if(!rattr)continue;for(const tg0 of targets){if(budgetStop()){reasons.push('STAKE_SOUL_685_BRANCH_CAP');break}const tc=tg0?.card||tg0;if(raw(tc?.attribute).toUpperCase()!==rattr||norm(name669(tc))===norm(name669(rc)))continue;if(n++>=Math.max(1,remainingBranches())){complete=false;reasons.push('STAKE_SOUL_685_BRANCH_CAP');break}
      const ns=clone(st),src=R0.locate?.(ns,item.uid),reveal=R0.locate?.(ns,rv.uid),tg=R0.locate?.(ns,tg0.uid);if(!src||!reveal||reveal.z!=='hand'||!tg||tg.z!=='deck')continue;
      let activation={ok:true};try{activation=R0.activate?.(ns,0,src.item.card||c,item.uid,1,[],[rv.uid])||{ok:false}}catch(_){activation={ok:false}}if(!activation.ok)continue;
      if(arr(ns.chain).length){const top=ns.chain[ns.chain.length-1];if(String(top?.uid)===String(item.uid))ns.chain.pop()}
      const ss=R0.performSpecialSummon?.(ns,0,tg.item.uid,'EFFECT',[]);if(!ss?.ok)continue;const summoned=R0.locate?.(ns,tg.item.uid);if(summoned?.item)summoned.item.__alpha685ReturnEndPhase=true;
      const srcAfter=R0.locate?.(ns,item.uid);if(srcAfter&&srcAfter.z!=='gy'){const mv=R0.alpha314Relocate?.(ns,item.uid,'gy',{type:'SPELL_RESOLUTION',effect:true,sourcePlayer:0,sourceUid:item.uid});if(mv&&mv.ok===false)continue}
      ns.__alpha685StakeUses=ns.__alpha685StakeUses||{};ns.__alpha685StakeUses[key]=true;const e685={id:1,raw:'Reveal 1 monster in your hand; Special Summon 1 Vanquish Soul monster with the same Attribute, but a different name, from your Deck.',activation:'Reveal 1 monster in your hand',resolution:'Special Summon 1 Vanquish Soul monster with the same Attribute, but a different name, from your Deck.'},rr={ok:true,partial:false,handler:'alpha685StakeYourSoul',revealedUid:rv.uid,summonedUid:tg0.uid,returnEndPhase:true};add669(out,node,ns,c,e685,'ACTIVATE',rr,[],[rv.uid],false,item.uid,'ALPHA685_STAKE_YOUR_SOUL_EXACT');
    }if(out.length>=maxBranches||nodeExpired())break}}
   }
  // Konami TCG cid=21433: Hollie Sue, main-phase quick effect (first effect only).
  // Strict sample scope: open Main Phase, hand source, no unresolved Chain; reveal a DIFFERENT
  // Vanquish Soul monster without discarding it, then Special Summon with zone legality checked.
  if(Number(c?.id)===93156774&&q0.z==='hand'&&/^MAIN/.test(raw(st?.phase).toUpperCase())&&Number(st?.activePlayer)===0&&
     arr(st?.chain).length===0&&/reveal 1 other \"vanquish soul\" monster in your hand/i.test(raw(c?.desc||c?.text))){
   const useKey=`0|93156774|1|${Number(st?.turn)||1}`;
   if(!st?.__alpha1085HollieSueUses?.[useKey]){
    for(const reveal of arr(z.hand)){
     if(budgetStop())break;
     if(String(reveal?.uid)===String(item.uid)||!isMonster669(reveal?.card||reveal)||!isVS677(reveal))continue;
     const ns=clone(st),src=R0.locate?.(ns,item.uid),rv=R0.locate?.(ns,reveal.uid);
     if(!src||src.z!=='hand'||!rv||rv.z!=='hand'||String(src.item.uid)===String(rv.item.uid))continue;
     if(!isVS677(rv.item)||!isMonster669(rv.item.card||rv.item))continue;
     let summoned;try{summoned=R0.performSpecialSummon?.(ns,0,src.item.uid,'EFFECT',[])}catch(_){summoned={ok:false}}
     if(!summoned?.ok)continue;
     const found=R0.locate?.(ns,item.uid);
     if(!found||found.z!=='monster'||R0.locate?.(ns,reveal.uid)?.z!=='hand')continue;
     ns.__alpha1085HollieSueUses=ns.__alpha1085HollieSueUses||{};
     ns.__alpha1085HollieSueUses[useKey]=true;
     const e={id:1,raw:'During the Main Phase (Quick Effect): You can reveal 1 other "Vanquish Soul" monster in your hand; Special Summon this card from your hand.',activation:'Reveal 1 other "Vanquish Soul" monster in your hand.',resolution:'Special Summon this card from your hand.'};
     add669(out,node,ns,c,e,'EFECTO',{ok:true,partial:false,handler:'HOLLIE_SUE_1085',revealedUid:reveal.uid},[],[reveal.uid],false,item.uid,'KONAMI_TCG_CID_21433_EFFECT_1_1085');
    }
   }
  }


  // Fiendsmith Engraver: three separate once-per-turn effects, checked at their source zones.
  // Only activate in an open own Main Phase; unmodeled opponent responses remain outside certification.
  if(Number(c?.id)===60764609&&Number(st?.activePlayer)===0&&/^MAIN/.test(raw(st?.phase).toUpperCase())&&arr(st?.chain).length===0){
    const sourceName=norm(name669(c)),turn=Number(st?.turn)||1,used=st.__alpha1087EngraverUses||{},
      use=e=>`0|60764609|${e}|${turn}`,mkUse=(ns,e)=>{ns.__alpha1087EngraverUses=ns.__alpha1087EngraverUses||{};ns.__alpha1087EngraverUses[use(e)]=true};
    // 1: discard this card as COST; add Fiendsmith Spell/Trap from Deck (then shuffle deck).
    if(q0.z==='hand'&&!used[use(1)]){
      for(const target of arr(z.deck)){
        if(budgetStop())break;
        const tc=target?.card||target;
        if(!/fiendsmith/i.test(name669(tc))||!/spell|trap/i.test(type669(tc)))continue;
        const ns=clone(st);
        const beforeSrc=R0.locate?.(ns,item.uid),beforeT=R0.locate?.(ns,target.uid);
        if(beforeSrc?.z!=='hand'||beforeT?.z!=='deck')continue;
        const discard=R0.alpha314Relocate?.(ns,item.uid,'gy',{type:'DISCARD_COST',sourcePlayer:0,sourceUid:item.uid});
        if(!discard?.ok||discard?.cancelled||R0.locate?.(ns,item.uid)?.z!=='gy')continue;
        const retrieve=R0.alpha314Relocate?.(ns,target.uid,'hand',{type:'SEARCH',effect:true,sourcePlayer:0,sourceUid:item.uid});
        if(!retrieve?.ok||retrieve?.cancelled||R0.locate?.(ns,target.uid)?.z!=='hand')continue;
        // Apply a recorded, reproducible permutation after the search. Not a universal random-outcome certificate.
        if(!shuffleMainSample1088(ns,0,item.uid,'ENGRAVER_SEARCH_1088').ok)continue;
        mkUse(ns,1);if(ns.analysis)ns.analysis.searches=(Number(ns.analysis.searches)||0)+1;
        const e={id:1,raw:'Discard this card; add 1 Fiendsmith Spell/Trap from your Deck to your hand.',activation:'Discard this card.',resolution:'Add 1 Fiendsmith Spell/Trap to hand.'};
        add669(out,node,ns,c,e,'EFECTO',{ok:true,partial:false,handler:'ENGRAVER_SEARCH_1087'},[target.uid],[item.uid],false,item.uid,'OFFICIAL_FIENDSMITH_SEARCH_BOUNDED_1087');
      }
    }
    // 2: target a controlled Fiendsmith Equip Card and a monster anywhere on field; send both to GY.
    if(q0.z==='monster'&&q0.item?.faceUp!==false&&!used[use(2)]){
      for(const equip of arr(z.spelltrap)){
        if(budgetStop())break;
        const ec=equip?.card||equip;
        if(equip?.faceUp===false||!/fiendsmith/i.test(name669(ec))||!(/equip/i.test(type669(ec))||equip.attachedTo||equip.equipTo||equip.equippedTo||equip?.flags?.equipTargetUid))continue;
        for(const m of [...arr(z.monster),...arr(st.zones?.[1]?.monster)]){
          if(budgetStop())break;
          if(!isMonster669(m?.card||m))continue;
          const transaction=moveEngraverTwo1089(st,equip.uid,m.uid,item.uid);
          if(!transaction.ok)continue;
          const ns=transaction.st;
          mkUse(ns,2);if(ns.analysis)ns.analysis.removals=(Number(ns.analysis.removals)||0)+2;
          const e={id:2,raw:'Target 1 Fiendsmith Equip Card you control and 1 monster on the field; send them to the GY.'};
          add669(out,node,ns,c,e,'EFECTO',{ok:true,partial:false,handler:'ENGRAVER_TWO_TARGET_TRANSACTION_1089',unverifiedAtomicMovement:true,batch:transaction.batch},[equip.uid,m.uid],[],false,item.uid,'OFFICIAL_FIENDSMITH_TWO_TARGETS_BOUNDED_1089');
        }
      }
    }
    // 3: shuffle OTHER LIGHT Fiend monster from your GY into its home Deck/Extra, then Special Summon Engraver.
    if(q0.z==='gy'&&!used[use(3)]&&arr(z.monster).length<5){
      for(const cost of arr(z.gy)){
        if(budgetStop())break;
        const cc=cost?.card||cost;
        if(cost.uid===item.uid||String(cost.uid)===String(item.uid)||!isMonster669(cc)||raw(cc.attribute).toUpperCase()!=='LIGHT'||!/fiend/i.test(raw(cc.race)))continue;
        const ns=clone(st),cm=R0.locate?.(ns,cost.uid),self=R0.locate?.(ns,item.uid);
        if(cm?.z!=='gy'||self?.z!=='gy')continue;
        const extra=/fusion|synchro|xyz|link/i.test(type669(cm.item.card||cm.item)),home=extra?'extra':'deck';
        const shuffle=R0.alpha314Relocate?.(ns,cost.uid,home,{type:'SHUFFLE_INTO_DECK_COST',sourcePlayer:0,sourceUid:item.uid});
        if(!shuffle?.ok||shuffle.cancelled||R0.locate?.(ns,cost.uid)?.z!==home)continue;
        const summoned=R0.performSpecialSummon?.(ns,0,item.uid,'EFFECT',[]);
        if(!summoned?.ok||R0.locate?.(ns,item.uid)?.z!=='monster')continue;
        mkUse(ns,3);if(home==='deck'&&!shuffleMainSample1088(ns,0,item.uid,'ENGRAVER_GY_RECYCLE_1088').ok)continue;
        if(home==='extra'){ns.events=arr(ns.events);ns.events.push({type:'EXTRA_DECK_RETURN',sourceUid:item.uid,costUid:cost.uid,player:0,distributionCertified:false});}
        const e={id:3,raw:'Shuffle 1 other LIGHT Fiend monster from your GY into Deck/Extra Deck; Special Summon this card.'};
        add669(out,node,ns,c,e,'EFECTO',{ok:true,partial:false,handler:'ENGRAVER_GY_REVIVE_1087'},[item.uid],[cost.uid],false,item.uid,'OFFICIAL_FIENDSMITH_GY_BOUNDED_1087');
      }
    }
  }
  // Konami TCG: Vanquish Soul Heavy Borger, DARK reveal -> draw one.
  // Scope deliberately limited to open Main Phase, no active Chain and a face-up Borger.
  // EARTH + FIRE damage and chain interactions are not certified by this handler.
  if(Number(c?.id)===92895501&&q0.z==='monster'&&q0.item?.faceUp!==false&&
     Number(st?.activePlayer)===0&&/^MAIN/.test(raw(st?.phase).toUpperCase())&&
     arr(st?.chain).length===0&&/reveal dark to draw 1 card/i.test(raw(c?.desc||c?.text))){
    const useKey=`0|92895501|2|${Number(st?.turn)||1}`;
    if(!st?.__alpha1086BorgerUses?.[useKey]&&arr(z.deck).length){
      for(const reveal of arr(z.hand)){
        if(budgetStop())break;
        if(!isMonster669(reveal?.card||reveal)||raw((reveal?.card||reveal).attribute).toUpperCase()!=='DARK')continue;
        const ns=clone(st),r0=R0.locate?.(ns,reveal.uid),src=R0.locate?.(ns,item.uid),top=arr(ns.zones?.[0]?.deck)[0];
        if(!r0||r0.z!=='hand'||!src||src.z!=='monster'||src.item.faceUp===false||!top)continue;
        let draw;try{draw=R0.alpha314Relocate?.(ns,top.uid,'hand',{type:'DRAW',effect:true,sourcePlayer:0,sourceUid:item.uid})}catch(_){draw={ok:false}}
        if(!draw?.ok||draw.cancelled||R0.locate?.(ns,top.uid)?.z!=='hand'||R0.locate?.(ns,reveal.uid)?.z!=='hand')continue;
        ns.__alpha1086BorgerUses=ns.__alpha1086BorgerUses||{};ns.__alpha1086BorgerUses[useKey]=true;
        if(ns.analysis)ns.analysis.draws=(Number(ns.analysis.draws)||0)+1;
        const e={id:2,raw:'(Quick Effect): Reveal 1 DARK monster in your hand; draw 1 card.',activation:'Reveal 1 DARK monster in your hand.',resolution:'Draw 1 card.'};
        add669(out,node,ns,c,e,'EFECTO',{ok:true,partial:false,handler:'BORGER_DARK_DRAW_1086',revealedUid:reveal.uid,drawnUid:top.uid},[top.uid],[reveal.uid],false,item.uid,'KONAMI_TCG_BORGER_DARK_1086');
      }
    }
  }

  // Heavy Borger alternative: reveal one EARTH + one FIRE monster, deal 1500 LP damage.
  if(Number(c?.id)===92895501&&q0.z==='monster'&&q0.item?.faceUp!==false&&
     Number(st?.activePlayer)===0&&/^MAIN/.test(raw(st?.phase).toUpperCase())&&arr(st?.chain).length===0){
    const useKey=`0|92895501|2|${Number(st?.turn)||1}`;
    if(!st?.__alpha1086BorgerUses?.[useKey]){
      const earth=arr(z.hand).filter(x=>isMonster669(x?.card||x)&&raw((x?.card||x).attribute).toUpperCase()==='EARTH');
      const fire=arr(z.hand).filter(x=>isMonster669(x?.card||x)&&raw((x?.card||x).attribute).toUpperCase()==='FIRE');
      for(const ev of earth){
        if(budgetStop())break;
        for(const fv of fire){
          if(budgetStop())break;
          if(String(ev.uid)===String(fv.uid))continue;
          const ns=clone(st),source=R0.locate?.(ns,item.uid),e=R0.locate?.(ns,ev.uid),f=R0.locate?.(ns,fv.uid);
          if(source?.z!=='monster'||source.item.faceUp===false||e?.z!=='hand'||f?.z!=='hand'||!Array.isArray(ns.lp)||!Number.isFinite(Number(ns.lp[1])))continue;
          const lp0=Number(ns.lp[1]);ns.lp[1]=Math.max(0,lp0-1500);
          ns.__alpha1086BorgerUses=ns.__alpha1086BorgerUses||{};ns.__alpha1086BorgerUses[useKey]=true;
          ns.lastDamage={sourceUid:item.uid,player:1,amount:1500,type:'EFFECT_DAMAGE'};
          ns.events=arr(ns.events);ns.events.push({type:'EFFECT_DAMAGE',sourceUid:item.uid,targetPlayer:1,amount:1500});
          const efx={id:2,raw:'Reveal 1 EARTH and 1 FIRE monster in your hand; inflict 1500 damage to your opponent.'};
          add669(out,node,ns,c,efx,'EFECTO',{ok:true,partial:false,handler:'BORGER_EARTH_FIRE_1087'},[],[ev.uid,fv.uid],false,item.uid,'OFFICIAL_BORGER_EARTH_FIRE_1087');
        }
      }
    }
  }
  // Konami TCG cid=17365: first Quick Effect of Labrynth Stovie Torbie.
  // Explicit send-this-card plus one OTHER discard as COST; only then set a Labrynth Spell/Trap.
  // Open Main Phase only: this local line does not attempt unmodeled chain responses.
  if(Number(c?.id)===74018812&&(q0.z==='hand'||q0.z==='monster')&&/^MAIN/.test(raw(st?.phase).toUpperCase())&&Number(st?.activePlayer)===0&&
     arr(st?.chain).length===0&&/send this card from your hand or field to the gy and discard 1 card/i.test(raw(c?.desc||c?.text))){
   const key=`0|74018812|1|${Number(st?.turn)||1}`;
   if(!st?.__alpha1085StovieUses?.[key]&&arr(z.spelltrap).length<5){
    const handCosts=arr(z.hand).filter(x=>String(x?.uid)!==String(item.uid));
    const setChoices=[...arr(z.hand),...arr(z.deck)].filter(x=>/spell|trap/i.test(type669(x?.card||x))&&/labrynth/i.test(name669(x?.card||x)));
    for(const cost of handCosts){if(budgetStop())break;
     for(const chosen of setChoices){if(budgetStop())break;
      if(String(chosen.uid)===String(cost.uid)||String(chosen.uid)===String(item.uid))continue;
      const ns=clone(st),source=R0.locate?.(ns,item.uid),costNow=R0.locate?.(ns,cost.uid),target=R0.locate?.(ns,chosen.uid);
      if(!source||!['hand','monster'].includes(source.z)||!costNow||costNow.z!=='hand'||!target||!['hand','deck'].includes(target.z))continue;
      if(!/spell|trap/i.test(type669(target.item))||!/labrynth/i.test(name669(target.item)))continue;
      if(arr(ns?.zones?.[0]?.spelltrap).length>=5)continue;
      let send,discard,set;try{
       send=R0.alpha314Relocate?.(ns,item.uid,'gy',{type:'COST_SEND_GY',sourcePlayer:0,sourceUid:item.uid});
       if(!send?.ok||send.cancelled)continue;
       discard=R0.alpha314Relocate?.(ns,cost.uid,'gy',{type:'COST_DISCARD',sourcePlayer:0,sourceUid:item.uid});
       if(!discard?.ok||discard.cancelled)continue;
       set=R0.alpha314Relocate?.(ns,chosen.uid,'spelltrap',{type:'SET_BY_EFFECT',effect:true,sourcePlayer:0,sourceUid:item.uid});
      }catch(_){continue}
      if(!set?.ok||set.cancelled)continue;
      const moved=R0.locate?.(ns,chosen.uid);
      if(R0.locate?.(ns,item.uid)?.z!=='gy'||R0.locate?.(ns,cost.uid)?.z!=='gy'||moved?.z!=='spelltrap')continue;
      moved.item.faceUp=false;
      moved.item.position='SET';
      moved.item.setTurn=Number(ns.turn)||1;
      ns.__alpha1085StovieUses=ns.__alpha1085StovieUses||{};
      ns.__alpha1085StovieUses[key]=true;
      const e={id:1,raw:'(Quick Effect): You can send this card from your hand or field to the GY and discard 1 card; Set 1 "Labrynth" Spell/Trap from your hand or Deck.',activation:'Send this card to GY and discard 1 card.',resolution:'Set 1 Labrynth Spell/Trap from hand or Deck.'};
      add669(out,node,ns,c,e,'EFECTO',{ok:true,partial:false,handler:'STOVIE_1085',setUid:chosen.uid},[chosen.uid],[item.uid,cost.uid],false,item.uid,'KONAMI_TCG_CID_17365_EFFECT_1_1085');
     }
    }
   }
  }
  // Forbidden Chalice (Konami TCG cid 8213). Only an exact card ID/text is eligible.
  if(Number(c?.id)===25789292&&/target 1 face-up monster on the field/i.test(raw(c?.desc||c?.text))&&/gains 400 atk, but its effects are negated/i.test(raw(c?.desc||c?.text))&&/^MAIN/.test(raw(st?.phase).toUpperCase())&&(q0.z==='hand'||q0.z==='spelltrap')){
   for(const side of arr(st.zones)){for(const target0 of arr(side.monster)){
    if(budgetStop())break;
    if(target0?.faceUp===false||!isMonster669(target0?.card||target0))continue;
    const ns=clone(st),before=R0.locate?.(ns,target0.uid),srcBefore=R0.locate?.(ns,item.uid);
    if(!before||before.z!=='monster'||before.item?.faceUp===false||!srcBefore)continue;
    const existing=Number(before.item.currentAtk??before.item.card?.atk??before.item.atk);
    if(!Number.isFinite(existing))continue;
    // Do not allow activating a just-set Quick-Play Spell.
    if(srcBefore.z==='spelltrap'&&Number(srcBefore.item?.setTurn)===Number(ns.turn))continue;
    let activation;try{activation=R0.activate?.(ns,0,srcBefore.item.card||c,item.uid,1,[target0.uid],[])}catch(_){activation={ok:false}}
    if(!activation?.ok)continue;
    let effectResult=R0.resolveTop?.(ns),safety=0;while(effectResult?.ok&&arr(ns.chain).length&&safety++<32)effectResult=R0.resolveTop?.(ns);
    if(!effectResult?.ok||effectResult?.partial!==true)continue;
    const target=R0.locate?.(ns,target0.uid),src=R0.locate?.(ns,item.uid);
    if(!target||target.z!=='monster'||target.item?.faceUp===false||!src||src.z!=='gy')continue;
    if(arr(ns.chain).length)continue; // Cannot certify an unresolved Chain Link.
    const mod=ns.__alpha613StatMods||(ns.__alpha613StatMods=[]);
    if(!mod.some(m=>String(m?.uid)===String(target0.uid)&&Number(m?.turn)===Number(ns.turn)))mod.push({uid:target0.uid,turn:ns.turn,hadCurrentAtk:Object.prototype.hasOwnProperty.call(target.item,'currentAtk'),baseCurrentAtk:target.item.currentAtk});
    target.item.currentAtk=Math.max(0,existing+400);
    target.item.flags=target.item.flags&&typeof target.item.flags==='object'?target.item.flags:{};
    if(target.item.flags.alpha613NegatedPrev==null)target.item.flags.alpha613NegatedPrev=!!target.item.negatedEffect;
    target.item.flags.alpha613NegatedExpiresTurn=Number(ns.turn)||1;
    target.item.negatedEffect=true;
    const e={id:1,raw:'Target 1 face-up monster on the field; until the end of this turn, that target gains 400 ATK, but its effects are negated.',resolution:'Target gains 400 ATK; negate its effects until end of turn.'};
    add669(out,node,ns,c,e,'EFECTO',{ok:true,partial:false,alpha1084Exact:true},[target0.uid],[],false,item.uid,'KONAMI_TCG_CID_8213_1084');
   }}
  }
  const effects=arr(localParse669(c,st,0)?.effects);for(const e of effects){if(budgetStop())break;if(e?.semantic?.continuous||e?.nonActivatable||e?.timing?.trigger)continue;const remaining=Math.max(1,remainingBranches()),tg=A666.targets666?.(st,e,remaining,0)||{rows:[[]],complete:true,reasons:[]},targetRows=arr(tg.rows),costBudget=Math.max(1,Math.floor(remaining/Math.max(1,targetRows.length))),cg=A666.costs666?.(st,e,costBudget,0)||{rows:[[]],complete:true,reasons:[]};if(!tg.complete||!cg.complete){complete=false;reasons.push(...arr(tg.reasons),...arr(cg.reasons))}let branch=0;for(const targets of arr(tg.rows)){if(budgetStop())break;for(const costs of arr(cg.rows)){if(budgetStop()){reasons.push('ACTION_CROSS_PRODUCT_CAP');break}if(branch++>=remaining){complete=false;reasons.push('ACTION_CROSS_PRODUCT_CAP');break}const ns=clone(st),q=R0.locate?.(ns,item.uid);if(!q)continue;const activation=R0.activate?.(ns,0,q.item.card||c,item.uid,e.id,targets,costs);if(!activation?.ok)continue;let rr=R0.resolveTop?.(ns),guard=0;while(rr?.ok&&arr(ns.chain).length&&guard++<32)rr=R0.resolveTop?.(ns);if(!rr?.ok||rr?.partial){if(rr?.partial){complete=false;reasons.push('PARTIAL_RESOLUTION');markGap('PARTIAL_RESOLUTION',c,e,item.uid,targets,costs,rr)}continue}const exact=A666.exact666?.(c,e.id)===true;if(!exact){complete=false;reasons.push('UNPROVEN_EFFECT_TRANSITION');markGap('UNPROVEN_EFFECT_TRANSITION',c,e,item.uid,targets,costs,rr)}add669(out,node,ns,q.item.card||c,e,'EFECTO',rr,targets,costs,exact,item.uid,'EXACT_RULE_REGISTRY_669')}if(branch>=remaining||out.length>=maxBranches||nodeExpired())break}}
 }
 // An activation may legally create pending Chain Links / trigger events.
 // The subsequent window must be resolved before this transition can be used
 // as an EXACT proof, even if its provisional physical movements appear right.
 for(const branch of out){
  const bs=branch?.st;
   const hasOpenWindow=arr(bs?.chain).length||arr(bs?.pendingTriggers).length||arr(bs?.triggerQueue).length||postActionWindowPending1101(bs);
  if(!hasOpenWindow)continue;
  branch.exactPath=false;
  const action=arr(branch.actions).at(-1);
  if(action){action.legal=false;action.result='RESUELTA_NO_CERTIFICADA';action.resolutionStatus='UNVERIFIED_RULE_WINDOW';
   action.mechanicsProof={...(action.mechanicsProof||{}),exact:false,chainWindowVerified:false};
   action.ruleCertificate={...(action.ruleCertificate||{}),exact:false,reason:'POST_ACTION_WINDOW_UNRESOLVED_1094'};}
  complete=false;reasons.push('POST_ACTION_WINDOW_UNRESOLVED_1094');
 }
 // Alpha 1102: all candidate branches require real opponent response/trigger
 // coverage to claim complete line legality. The single-player opening enumerator
 // has no such proof, including for helper-generated SET/Extra/direct nodes.
 for(const branch of out){
  const action=arr(branch?.actions).at(-1);
  if(!action)continue;
  if(branch.exactPath!==false&&action.legal!==true&&action.ruleCertificate?.exact!==true)continue;
  branch.exactPath=false;
  action.legal=false;action.certified=false;
  action.result='RESUELTA_NO_CERTIFICADA';
  action.resolutionStatus='OPPONENT_RESPONSE_NOT_PROVEN';
  action.mechanicsProof={...(action.mechanicsProof||{}),exact:false,responseWindowProven:false};
  action.ruleCertificate={...(action.ruleCertificate||{}),exact:false,reason:'OPPONENT_RESPONSE_COVERAGE_NOT_PROVEN_1102'};
  complete=false;
  reasons.push('OPPONENT_RESPONSE_COVERAGE_NOT_PROVEN_1102');
 }
 const seen=new Map();for(const n of out.slice(0,maxBranches)){let k;try{k=JSON.stringify(n.st)+'|'+arr(n.actions).map(a=>`${a.card}:${a.effectId??a.actionType}:${arr(a.selectedTargets).join(',')}`).join('>')}catch(_){k=String(seen.size)}if(!seen.has(k)||Number(n.score)>Number(seen.get(k)?.score))seen.set(k,n)}return{nodes:[...seen.values()].slice(0,maxBranches),complete:complete&&out.length<=maxBranches&&!nodeExpired(),reasons:[...new Set(reasons)],unresolved:opts.collectUnresolved===true?unresolved:[],nodeElapsedMs:Math.round(((performance.now?.()||Date.now())-nodeStarted)*10)/10,nodeBudgetMs,maxBranches,auditDeterministic}
}
function sig669(n){try{return JSON.stringify(n.st)+'|'+arr(n.actions).map(a=>`${a.card}:${a.effectId??a.actionType}:${arr(a.selectedTargets).join(',')}:${arr(a.selectedCosts).join(',')}`).join('>')}catch(_){return raw(Math.random())}}
function board669(st){const z=st?.zones?.[0]||{},cp=k=>clone(arr(z[k]));return{monsters:cp('monster'),spelltrap:cp('spelltrap'),gy:cp('gy'),banished:cp('banished'),hand:cp('hand'),extra:cp('extra')}}
function line669(n,opening){const finalBoard=board669(n.st),v=Math.max(0,Math.min(100,Math.round(n.score))),l={actions:n.actions,score:v,finalScore:v,state:n.st,finalBoard,simulation:{state:n.st,openingHand:clone(opening),actions:n.actions,executed:n.actions.map(a=>a.card),legal:n.exactPath===true,finalBoard}};try{l.alpha651Proof=W.YGOAlpha651?.proof651?.(l)||null}catch(_){}return l}
function exhaustiveOpeningSearch669(opts={}){A667.install667?.();W.YGOAlpha672?.install672?.();const sample=Math.max(0,Number(opts.sample)||0),maxDepth=Math.max(1,Math.min(10,Number(opts.maxDepth)||4)),maxStates=Math.max(20,Math.min(500000,Number(opts.maxStates)||25000)),maxActionBranches=Math.max(8,Math.min(30000,Number(opts.maxActionBranches)||4096)),nodeBudgetMs=Math.max(4,Math.min(250,Number(opts.nodeBudgetMs)||35)),base=A655.openingState655?.(sample);if(!base)return{version:VERSION,pass:false,status:'NO_OPENING_STATE'};const opening=arr(base.zones?.[0]?.hand).map(x=>({name:x?.card?.name,id:x?.card?.id||null,card:clone(x?.card)}));let frontier=[{st:base,actions:[],score:score669(base),exactPath:true}],finals=[],expanded=0,truncated=false,domainComplete=true,dedupRemoved=0;const reasons=[],depthRows=[];const hash679=s=>{let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(16)};const stateJSON=n=>{if(n.__alpha679StateJSON)return n.__alpha679StateJSON;let x;try{x=JSON.stringify(n.st)}catch(_){x=sig669(n)};try{Object.defineProperty(n,'__alpha679StateJSON',{value:x,writable:true,configurable:true,enumerable:false})}catch(_){n.__alpha679StateJSON=x}return x};for(let depth=0;depth<maxDepth;depth++){const next=[];let generated=0;for(const node of frontier){if(expanded++>=maxStates){truncated=true;reasons.push('STATE_CAP');break}const r=enumerateNode669(node,{maxActionBranches,nodeBudgetMs});domainComplete=domainComplete&&r.complete!==false;reasons.push(...arr(r.reasons));generated+=arr(r.nodes).length;if(!arr(r.nodes).length)finals.push(node);else next.push(...r.nodes)}const m=new Map();for(const n of next){const js=stateJSON(n),h=hash679(js);let bucket=m.get(h);if(!bucket){bucket=[];m.set(h,bucket)}let ent=bucket.find(x=>x.json===js);if(!ent)bucket.push({json:js,node:n});else{const old=ent.node;if(Number(n.score)>Number(old.score)||(Number(n.score)===Number(old.score)&&arr(n.actions).length<arr(old.actions).length))ent.node=n}}const uniqueNext=[...m.values()].flatMap(b=>b.map(x=>x.node));dedupRemoved+=Math.max(0,next.length-uniqueNext.length);depthRows.push({depth,frontier:frontier.length,generated,uniqueGenerated:uniqueNext.length,dedupRemoved:next.length-uniqueNext.length,totalExpanded:expanded});if(truncated){frontier=uniqueNext;break}frontier=uniqueNext;if(!frontier.length)break}finals.push(...frontier);const uniq=new Map();for(const n of finals){const js=stateJSON(n),acts=arr(n.actions).map(a=>`${a.card}:${a.effectId??a.actionType}:${arr(a.selectedTargets).join(',')}:${arr(a.selectedCosts).join(',')}`).join('>'),full=js+'|'+acts,h=hash679(full);let bucket=uniq.get(h);if(!bucket){bucket=[];uniq.set(h,bucket)}let ent=bucket.find(x=>x.full===full);if(!ent)bucket.push({full,node:n});else if(Number(n.score)>Number(ent.node.score))ent.node=n}const ranked=[...uniq.values()].flatMap(b=>b.map(x=>x.node)).sort((a,b)=>b.score-a.score||arr(b.actions).length-arr(a.actions).length),lines=ranked.slice(0,5).map(n=>line669(n,opening)),allExact=ranked.every(n=>n.exactPath!==false),horizonReached=!truncated&&depthRows.length===maxDepth,domainExhaustedOptimalityProven=!truncated&&opening.length>0&&frontier.length===0&&domainComplete&&allExact,horizonOptimalityProven=opening.length>0&&(horizonReached||domainExhaustedOptimalityProven)&&domainComplete&&allExact,cert={version:'Alpha 677',sample,maxDepth,maxStates,maxActionBranches,statesExpanded:expanded,terminalOrHorizonStates:ranked.length,frontierExhausted:!truncated&&frontier.length===0,horizonReached,mainPhaseExhausted:!truncated&&frontier.length===0,domainExhaustedOptimalityProven,allLegalActionsEnumerated:domainComplete,allTransitionsExact:allExact,stateDominanceSafe:true,stateDominanceUsed:dedupRemoved>0,exactStateDedup:true,dedupRemoved,objective:'Alpha604 score-state objective over exact state',objectiveComplete:true,targetChoiceEnumerationComplete:!reasons.some(x=>/TARGET_.*CAP|DIRECT_EXACT_BRANCH_CAP/.test(x)),horizonOptimalityProven,globalOptimalityProven:false,status:horizonOptimalityProven?'HORIZON_OPTIMAL_PROVEN':'BOUNDED_EXHAUSTIVE_INCOMPLETE',truncated,reasons:[...new Set(reasons)],policy:'Optimalidad demostrada sólo dentro de la mano, dominio enumerado y profundidad indicada. Deduplicación únicamente de estados completos idénticos; nunca implica optimalidad global.'};W.__YGO669_LAST_EXHAUSTIVE={certificate:cert,lines,depthRows};W.__YGO655_LAST_EXHAUSTIVE=W.__YGO669_LAST_EXHAUSTIVE;return{version:'Alpha 677',pass:horizonOptimalityProven,certificate:cert,lines,depthRows}}
async function exhaustiveOpeningSearch669Async(opts={}){
 const publishDiagnostics1182=opts.publishDiagnostics!==false;
 A667.install667?.();W.YGOAlpha672?.install672?.();
 const sample=Math.max(0,Number(opts.sample)||0),maxDepth=Math.max(1,Math.min(10,Number(opts.maxDepth)||4)),maxStates=Math.max(20,Math.min(500000,Number(opts.maxStates)||25000)),maxActionBranches=Math.max(8,Math.min(30000,Number(opts.maxActionBranches)||4096)),sliceMs=Math.max(8,Math.min(250,Number(opts.sliceMs)||35)),nodeBudgetMs=Math.max(4,Math.min(250,Number(opts.nodeBudgetMs)||sliceMs)),yieldEvery=Math.max(1,Math.min(250,Number(opts.yieldEvery)||16)),key=raw(opts.checkpointKey||`S${sample}|D${maxDepth}|B${maxActionBranches}`),store=W.__YGO669_ASYNC_CHECKPOINTS||(W.__YGO669_ASYNC_CHECKPOINTS=new Map());
 let j=opts.resume===true?store.get(key):null;
 if(!j){const base=A655.openingState655?.(sample);if(!base)return{version:VERSION,pass:false,status:'NO_OPENING_STATE',lines:[],certificate:{truncated:true,reasons:['NO_OPENING_STATE']}};const opening=arr(base.zones?.[0]?.hand).map(x=>({name:x?.card?.name,id:x?.card?.id||null,card:clone(x?.card)}));j={sample,maxDepth,maxActionBranches,opening,frontier:[{st:base,actions:[],score:score669(base),exactPath:true}],finals:[],expanded:0,domainComplete:true,dedupRemoved:0,reasons:[],depthRows:[],depth:0,nodeIndex:0,next:[],generated:0,slices:0}}
 const hash=s=>{let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(16)},stateJSON=n=>{if(n.__alpha679StateJSON)return n.__alpha679StateJSON;let x;try{x=JSON.stringify(n.st)}catch(_){x=sig669(n)};try{Object.defineProperty(n,'__alpha679StateJSON',{value:x,writable:true,configurable:true,enumerable:false})}catch(_){n.__alpha679StateJSON=x}return x},yield0=()=>new Promise(r=>setTimeout(r,0));
 const started=performance.now(),partial=(reason)=>{j.slices++;store.set(key,j);const cert={version:VERSION,sample,maxDepth,maxStates,maxActionBranches,statesExpanded:j.expanded,frontierExhausted:false,horizonReached:false,domainExhaustedOptimalityProven:false,allLegalActionsEnumerated:j.domainComplete,allTransitionsExact:false,stateDominanceSafe:true,objectiveComplete:true,targetChoiceEnumerationComplete:!j.reasons.some(x=>/(?:TARGET|COST|ACTION|SET|EXTRA|ROCK|KINGS|STAKE)_.*CAP|DIRECT_EXACT_BRANCH_CAP|TIME_BUDGET/.test(x)),horizonOptimalityProven:false,globalOptimalityProven:false,truncated:true,resumable:true,checkpointKey:key,status:'PAUSED_CHECKPOINT',reasons:[...new Set([...j.reasons,reason])],policy:'Checkpoint en memoria; fail-closed hasta agotar el horizonte.'};const out={version:VERSION,pass:false,status:'PAUSED_CHECKPOINT',certificate:cert,lines:[],depthRows:j.depthRows,checkpoint:{key,depth:j.depth,nodeIndex:j.nodeIndex,frontier:j.frontier.length,expanded:j.expanded,slices:j.slices}};if(publishDiagnostics1182)W.__YGO669_LAST_ASYNC=out;return out};
 while(j.depth<maxDepth){
  while(j.nodeIndex<j.frontier.length){
   if(opts.shouldCancel?.()===true)return partial('CANCELLED_CHECKPOINT');
   if(performance.now()-started>=sliceMs)return partial('TIME_SLICE_CHECKPOINT');
   if(j.expanded>=maxStates){j.reasons.push('STATE_CAP');store.delete(key);const cert={version:VERSION,sample,maxDepth,maxStates,maxActionBranches,statesExpanded:j.expanded,frontierExhausted:false,horizonReached:false,domainExhaustedOptimalityProven:false,allLegalActionsEnumerated:j.domainComplete,allTransitionsExact:false,stateDominanceSafe:true,objectiveComplete:true,targetChoiceEnumerationComplete:!j.reasons.some(x=>/(?:TARGET|COST|ACTION|SET|EXTRA|ROCK|KINGS|STAKE)_.*CAP|DIRECT_EXACT_BRANCH_CAP|TIME_BUDGET/.test(x)),horizonOptimalityProven:false,globalOptimalityProven:false,truncated:true,resumable:false,status:'BOUNDED_EXHAUSTIVE_INCOMPLETE',reasons:[...new Set(j.reasons)],policy:'Se alcanzó maxStates; aumente el presupuesto para continuar con prueba exacta.'};const out={version:VERSION,pass:false,status:cert.status,certificate:cert,lines:[],depthRows:j.depthRows};if(publishDiagnostics1182)W.__YGO669_LAST_ASYNC=out;return out}
   const node=j.frontier[j.nodeIndex++],r=enumerateNode669(node,{maxActionBranches,nodeBudgetMs,shouldCancel:opts.shouldCancel});if(opts.shouldCancel?.()===true){j.nodeIndex--;return partial('CANCELLED_CHECKPOINT')}j.expanded++;j.domainComplete=j.domainComplete&&r.complete!==false;j.reasons.push(...arr(r.reasons));j.generated+=arr(r.nodes).length;if(!arr(r.nodes).length)j.finals.push(node);else j.next.push(...r.nodes);
   if(j.expanded%yieldEvery===0){try{opts.onProgress?.({sample,depth:j.depth,nodeIndex:j.nodeIndex,frontier:j.frontier.length,expanded:j.expanded})}catch(_){}await yield0();if(typeof opts.shouldCancel==='function'&&opts.shouldCancel())return partial('CANCELLED_CHECKPOINT');if(performance.now()-started>=sliceMs)return partial('TIME_SLICE_CHECKPOINT')}
  }
  const m=new Map();for(const n of j.next){const js=stateJSON(n),h=hash(js);let bucket=m.get(h);if(!bucket){bucket=[];m.set(h,bucket)}let ent=bucket.find(x=>x.json===js);if(!ent)bucket.push({json:js,node:n});else{const old=ent.node;if(Number(n.score)>Number(old.score)||(Number(n.score)===Number(old.score)&&arr(n.actions).length<arr(old.actions).length))ent.node=n}}
  const uniqueNext=[...m.values()].flatMap(b=>b.map(x=>x.node));j.dedupRemoved+=Math.max(0,j.next.length-uniqueNext.length);j.depthRows.push({depth:j.depth,frontier:j.frontier.length,generated:j.generated,uniqueGenerated:uniqueNext.length,dedupRemoved:j.next.length-uniqueNext.length,totalExpanded:j.expanded});j.frontier=uniqueNext;j.next=[];j.generated=0;j.nodeIndex=0;j.depth++;try{opts.onProgress?.({sample,depth:j.depth,frontier:j.frontier.length,expanded:j.expanded,depthComplete:true})}catch(_){}await yield0();if(opts.shouldCancel?.()===true)return partial('CANCELLED_CHECKPOINT');if(performance.now()-started>=sliceMs&&j.depth<maxDepth)return partial('TIME_SLICE_CHECKPOINT');if(!j.frontier.length)break;
 }
 j.finals.push(...j.frontier);const uniq=new Map();for(const n of j.finals){const js=stateJSON(n),acts=arr(n.actions).map(a=>`${a.card}:${a.effectId??a.actionType}:${arr(a.selectedTargets).join(',')}:${arr(a.selectedCosts).join(',')}`).join('>'),full=js+'|'+acts,h=hash(full);let bucket=uniq.get(h);if(!bucket){bucket=[];uniq.set(h,bucket)}let ent=bucket.find(x=>x.full===full);if(!ent)bucket.push({full,node:n});else if(Number(n.score)>Number(ent.node.score))ent.node=n}
 const ranked=[...uniq.values()].flatMap(b=>b.map(x=>x.node)).sort((a,b)=>b.score-a.score||arr(b.actions).length-arr(a.actions).length),lines=ranked.slice(0,5).map(n=>line669(n,j.opening)),allExact=ranked.every(n=>n.exactPath!==false),horizonReached=j.depth>=maxDepth,domainExhaustedOptimalityProven=j.opening.length>0&&j.frontier.length===0&&j.domainComplete&&allExact,horizonOptimalityProven=j.opening.length>0&&(horizonReached||domainExhaustedOptimalityProven)&&j.domainComplete&&allExact,cert={version:VERSION,sample,maxDepth,maxStates,maxActionBranches,statesExpanded:j.expanded,terminalOrHorizonStates:ranked.length,frontierExhausted:j.frontier.length===0,horizonReached,domainExhaustedOptimalityProven,allLegalActionsEnumerated:j.domainComplete,allTransitionsExact:allExact,stateDominanceSafe:true,stateDominanceUsed:j.dedupRemoved>0,exactStateDedup:true,dedupRemoved:j.dedupRemoved,objective:'Alpha604 score-state objective over exact state',objectiveComplete:true,targetChoiceEnumerationComplete:!j.reasons.some(x=>/(?:TARGET|COST|ACTION|SET|EXTRA|ROCK|KINGS|STAKE)_.*CAP|DIRECT_EXACT_BRANCH_CAP|TIME_BUDGET/.test(x)),horizonOptimalityProven,globalOptimalityProven:false,status:horizonOptimalityProven?'HORIZON_OPTIMAL_PROVEN':'BOUNDED_EXHAUSTIVE_INCOMPLETE',truncated:false,resumable:false,checkpointKey:key,reasons:[...new Set(j.reasons)],policy:'Búsqueda asíncrona time-sliced; optimalidad sólo dentro del horizonte/dominio enumerado.'};store.delete(key);const out={version:VERSION,pass:horizonOptimalityProven,certificate:cert,lines,depthRows:j.depthRows};if(publishDiagnostics1182)W.__YGO669_LAST_ASYNC=out;if(publishDiagnostics1182)W.__YGO669_LAST_EXHAUSTIVE={certificate:cert,lines,depthRows:j.depthRows};return out;
}
function selfTest669(){const st={activePlayer:0},s={name:'Labrynth Stovie Torbie',type:'Effect Monster',desc:'(Quick Effect): You can send this card from your hand or field to the GY and discard 1 card; Set 1 card.'},a={name:'Mitsurugi no Mikoto, Aramasa',type:'Effect Monster',desc:'Effect text. Each effect once per turn.'},l={name:'K9-ØØ Lupis',type:'Effect Monster',desc:"During your opponent's turn (Quick Effect), immediately Xyz Summon using this card you control."};const ps=localParse669(s,st),pa=localParse669(a,st),pl=localParse669(l,st),se=arr(ps?.effects).find(e=>/send this card/i.test(raw(e.raw))),ae=arr(pa?.effects).find(e=>/^each effect/i.test(raw(e.raw))),le=arr(pl?.effects).find(e=>/opponent'?s turn/i.test(raw(e.raw)));const checks={cost:arr(se?.costs).length===2&&se.costs[0]?.kind==='SEND_GY'&&se.costs[1]?.kind==='DISCARD',restriction:ae?.nonActivatable===true,turn:le?.nonActivatable===true,base:typeof A666.targets666==='function'&&typeof A666.costs666==='function',catalog:arr(W.CARD_CATALOG).length>=19617};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,stovieCosts:se?.costs,restrictionReason:ae?.nonActivatableReason,turnReason:le?.nonActivatableReason}}
function install669(){A667.install667?.();if(W.YGOAlpha655){W.YGOAlpha655.enumerateNode655=enumerateNode669;W.YGOAlpha655.exhaustiveOpeningSearch655=exhaustiveOpeningSearch669}if(W.YGOApp)W.YGOApp.exhaustiveSearch=exhaustiveOpeningSearch669;return true}
function audit669(){install669();const self=selfTest669(),fixture=A654.embeddedCorpusCertificate654?.()||{pass:false},rules=A644.rulesAudit644?.()||{pass:false},score=A656.scoreContract656?.({main:[],extra:[],side:[]})||{pass:false};const checks={self:self.pass,fixture:fixture.pass===true,rules:rules.pass===true&&Number(rules.total)>=40,score:score.pass===true,catalog:arr(W.CARD_CATALOG).length>=19617,ui:!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck')&&!!D.querySelector('.diana-center-zone')};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,self,fixture,rules,score}}
function completionAudit669(){const audit=audit669(),last=W.__YGO669_LAST_EXHAUSTIVE?.certificate||null,external=W.__YGO620_EXTERNAL_BROWSER_CERT||{pass:false,status:'EXTERNAL_BROWSER_REQUIRED'};return{version:VERSION,internalPass:audit.pass,horizonOptimalityPass:last?.horizonOptimalityProven===true,globalOptimalityPass:false,universalPass:false,status:audit.pass?'CORE_669_SELF_CONTAINED_EXHAUSTIVE_GLOBAL_OPTIMALITY_OPEN':'INTERNAL_GATES_OPEN',audit,boundedExhaustive:last,external,remaining:{globalOptimality:true,realBrowser:external.pass!==true,universalExactRules:true,partialFormats:true,scoringCausalComplete:false,legacyPhysicalPrune:true}}}
function claim(){try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO669_VERSION_WRITE={value:raw(v),at:Date.now()}}})}catch(_){}try{D.title=TITLE}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}if(W.YGOApp)W.YGOApp.version=VERSION}
/* Alpha 1099: adversarial fixtures for fast-effect windows and declared Chain closures.
   These tests check safe refusal and state immutability, not full effect simulation. */
function fixturesPriority1099(){
 const makeState=()=>({activePlayer:0,phase:'MAIN1',zones:[{hand:[],deck:[],monster:[],spelltrap:[],gy:[],extra:[],banished:[]},{hand:[],deck:[],monster:[],spelltrap:[],gy:[],extra:[],banished:[]}],chain:[],pendingTriggers:[],triggerQueue:[]});
 const results={};
 const probe=(name,st,expected,opts={})=>{
  const before=JSON.stringify(st);
  let got;try{got=enumerateNode669({st,actions:[],exactPath:true}, {maxActionBranches:8,...opts});}
  catch(e){results[name]={pass:false,exception:raw(e?.message||e)};return}
  const reason=arr(got?.reasons)[0];
  results[name]={pass:reason===expected&&arr(got?.nodes).length===0&&JSON.stringify(st)===before,reason,expected};
 };
 const a=makeState();a.__alpha1098FastWindow={status:'OPEN',offeredToPlayer:1};
 probe('openPriorityOpp',a,'FAST_EFFECT_RESPONSE_WINDOW_PENDING_1098');
 const b=makeState();b.__alpha1098FastWindow={status:'AWAITING_RESPONSE',offeredToPlayer:1};
 probe('awaitingResponse',b,'FAST_EFFECT_RESPONSE_WINDOW_PENDING_1098');
 const c=makeState();c.__alpha1098FastWindow={status:'CLOSED',priorityVerified:false};
 probe('closedWithoutProof',c,'FAST_EFFECT_RESPONSE_WINDOW_PENDING_1098');
 const d=makeState();d.__alpha1098FastWindow={status:'RESOLVED',priorityVerified:false,noPendingChain:true};
 probe('resolvedWithoutProof',d,'FAST_EFFECT_RESPONSE_WINDOW_PENDING_1098');
 const e=makeState();e.chain=[{uid:'l1',player:0,chainLink:1,spellSpeed:1},{uid:'l2',player:1,chainLink:2,spellSpeed:2}];
 const evidence={links:e.chain.map(x=>({...x})),closed:true,noNewLinksAfterPasses:true,passes:[{player:0,atChainLength:2},{player:1,atChainLength:2}]};
 probe('passesWithoutLedger',e,'PRIORITY_LEDGER_REQUIRED_1098',{chainEvidence1097:evidence});
 const f=makeState();f.chain=e.chain.map(x=>({...x}));
 const falseHistory={...evidence,priorityEvents1098:[{type:'ACTIVATE',player:0,uid:'l1',chainLink:1,spellSpeed:1},{type:'ACTIVATE',player:1,uid:'l2',chainLink:2,spellSpeed:1},{type:'PASS',player:0},{type:'PASS',player:1}]};
 probe('invalidLedger',f,'PRIORITY_LEDGER_REJECTED_1098:INVALID_RESPONSE_SPELL_SPEED',{chainEvidence1097:falseHistory});
 const terminal=makeState();terminal.__alpha1098FastWindow={status:'RESOLVED',priorityVerified:true,noPendingChain:true};
 const terminalResult=enumerateNode669({st:terminal,actions:[],exactPath:true},{maxActionBranches:8,collectUnresolved:true});
 results.verifiedTerminalPasses={pass:!arr(terminalResult.reasons).includes('FAST_EFFECT_RESPONSE_WINDOW_PENDING_1098')&&arr(terminalResult.nodes).length===0};
 const pass=Object.values(results).every(x=>x.pass===true);
 return {version:'Alpha 1099',pass,checks:results,count:Object.keys(results).length,certifiesUniversalRules:false};
}
const API={VERSION,localParse669,enumerateNode669,fixturesSafety1102,exhaustiveOpeningSearch669,exhaustiveOpeningSearch669Async,moveEngraverTwo1089,inventoryGate1100,postActionWindowPending1101,fixturesSafety1101,resolveClosedChain1097,priorityHistory1098,openStatePasses1099,fixturesPriority1099,selfTest669,install669,audit669,completionAudit669};W.YGOAlpha669=API;install669();claim();if(W.YGOApp){W.YGOApp.release669=API;W.YGOApp.runtimeAudit=API}D.documentElement.dataset.alpha669='self-contained-exhaustive-parser';
})();