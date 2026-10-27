
/* === Alpha 644 · stable exact-script facade runtime === */
(()=>{'use strict';
const W=window,D=document,R=W.YGORulingEngine||{},A620=W.YGOAlpha620||{};
const VERSION='Alpha 644',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_653';
const arr=x=>Array.isArray(x)?x:[],raw=x=>String(x??''),low=x=>raw(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g,' ').trim();
const clone=x=>{try{return structuredClone(x)}catch(_){try{return JSON.parse(JSON.stringify(x))}catch(__){return x}}};
const obj=x=>x?.card||x||{},isMonster=x=>/monster|monstruo/.test(low(obj(x)?.type||''));
const field=(st,p)=>[...arr(st?.zones?.[p]?.monster),...arr(st?.zones?.[p]?.spelltrap)];
function claimIdentity644(){if(W.__YGO_TARGET_BUILD&&W.__YGO_TARGET_BUILD!==VERSION)return W.__YGO_TARGET_BUILD;try{D.title=TITLE}catch(_){}try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:()=>{}})}catch(_){try{W.YGO_APP_VERSION=VERSION}catch(__){}}if(!W.YGOApp)W.YGOApp={};W.YGOApp.version=VERSION;W.YGOApp.runtime=W.YGOAlpha644||W.YGOApp.runtime;try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}return VERSION}
function effect644(c,eid){try{return arr(R.parseCard?.(c)?.effects).find(x=>Number(x?.id)===Number(eid))||null}catch(_){return null}}

/* ---------- unified exact condition compiler ---------- */
function quoteProtect644(s){const q=[];return{value:s.replace(/"[^"]*"/g,m=>{q.push(m);return`__Q${q.length-1}__`}),restore:x=>x.replace(/__q(\d+)__/gi,(_,i)=>q[Number(i)]||'')}}
function normalizeAtom644(s){s=raw(s).trim().replace(/^[,;:]+|[,;:]+$/g,'').trim();s=s.replace(/^(?:-{4,}\s*)?\[\s*(?:pendulum|monster)\s+effect\s*\]\s*/i,'').trim();s=s.replace(/\s*\(quick effect\)\s*$/i,'').trim();if(/^once per turn\s*,/i.test(s))s=s.replace(/^once per turn\s*,\s*/i,'').trim();if(!s)return'';if(/^(?:if|when|during|at the |at )\b/i.test(s))return s;if(/^you\s+(?:have|control)\b/i.test(s)||/^your\s+(?:opponent|lp|gy|graveyard|hand)\b/i.test(s)||/^this card\b/i.test(s))return'if '+s;if(/^have\b/i.test(s)||/^control\b/i.test(s))return'if you '+s;if(/^opponent\b/i.test(s))return'if your '+s;return s}
function atomSpec644(text){const t=normalizeAtom644(text),s=low(t);if(!s)return null;let m,q;
 // Alpha1007: bare PSCT activation header (e.g. `When activated:`) is the source card activation event.
 if(/^(?:when|if) activated$/.test(s))return{kind:'SOURCE_CARD_ACTIVATED',exact:true,text:t,alpha644:true,alpha1007:true};
 // Alpha992: exact aliases/state predicates measured from the live unresolved corpus.
 if(/^flip$/.test(s))return{kind:'SOURCE_FLIPPED_FACEUP',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) you normal summon this card$/.test(s))return{kind:'SOURCE_NORMAL_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this face-up card is destroyed by card effect$/.test(s))return{kind:'SOURCE_DESTROYED_EFFECT',exact:true,text:t,alpha644:true};
 if(/^if this set card is destroyed by card effect$/.test(s))return{kind:'SOURCE_SET_DESTROYED_EFFECT',exact:true,text:t,alpha644:true};
 if(/^when an attack is declared involving 2 monsters$/.test(s))return{kind:'ATTACK_DECLARE_TWO_MONSTERS',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is sent directly from the field to (?:your )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_SENT_FIELD_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card on the field is destroyed and sent to (?:your |the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_DESTROYED_SENT_GY',exact:true,text:t,alpha644:true};
 if(/^if you control no face-up monsters$/.test(s))return{kind:'YOU_NO_FACEUP_MONSTERS',exact:true,text:t,alpha644:true};
 m=t.match(/^Once per turn,?\s*(if .+)$/i);if(m){const z=atomSpec644(m[1]);if(z?.exact)return{...z,text:t,alpha644:true,usagePrefix:'ONCE_PER_TURN'};}
 m=t.match(/^(?:If|When) there are (\d+) face-up ["“]([^"”]+)["”] cards? on your (?:side of the field|field)$/i);if(m)return{kind:'CONTROL_FACEUP_NAMED_COUNT',n:Number(m[1]),value:low(m[2]),exact:true,text:t,alpha644:true};
 m=t.match(/^If ["“]([^"”]+)["”] is not in the Field Zone$/i);if(m)return{kind:'YOUR_FIELD_ZONE_NAME_ABSENT',value:low(m[1]),exact:true,text:t,alpha644:true};
 m=t.match(/^If there is no ["“]([^"”]+)["”] on the field$/i);if(m)return{kind:'EXACT_NAME_NOT_ON_FIELD',value:low(m[1]),exact:true,text:t,alpha644:true};
 m=t.match(/^If ["“]([^"”]+)["”] is in your Field Zone$/i);if(m)return{kind:'YOUR_FIELD_ZONE_EXACT_NAME',value:low(m[1]),exact:true,text:t,alpha644:true};
 if(/^if this face-up card is destroyed in a monster zone$/.test(s))return{kind:'SOURCE_DESTROYED_MONSTER_ZONE',exact:true,text:t,alpha644:true};
 // High-frequency exact timing/context predicates (Alpha629 family).
 if(/^once per turn$/.test(s))return{kind:'CONTEXT_EITHER_TURN',usageOnly:true,exact:true,text:t,alpha644:true};
 if(/^at the start of your main phase 1$/.test(s))return{kind:'CONTEXT_START_YOUR_MAIN_PHASE_1',exact:true,text:t,alpha644:true};
 if(/^during your main phase$/.test(s))return{kind:'CONTEXT_YOUR_MAIN_PHASE',exact:true,text:t,alpha644:true};
 if(/^during (?:the )?main phase$/.test(s))return{kind:'CONTEXT_MAIN_PHASE',exact:true,text:t,alpha644:true};
 if(/^during your standby phase$/.test(s))return{kind:'CONTEXT_YOUR_STANDBY_PHASE',exact:true,text:t,alpha644:true};
 if(/^during your opponent'?s standby phase$/.test(s))return{kind:'CONTEXT_OPP_STANDBY_PHASE',exact:true,text:t,alpha644:true};
 if(/^during (?:the )?standby phase$/.test(s))return{kind:'CONTEXT_STANDBY_PHASE',exact:true,text:t,alpha644:true};
 if(/^during your end phase$/.test(s))return{kind:'CONTEXT_YOUR_END_PHASE',exact:true,text:t,alpha644:true};
 if(/^during (?:the )?end phase$/.test(s))return{kind:'CONTEXT_END_PHASE',exact:true,text:t,alpha644:true};
 if(/^during your battle phase$/.test(s))return{kind:'CONTEXT_YOUR_BATTLE_PHASE',exact:true,text:t,alpha644:true};
 if(/^during your opponent'?s battle phase$/.test(s))return{kind:'CONTEXT_OPP_BATTLE_PHASE',exact:true,text:t,alpha644:true};
 if(/^during (?:the )?battle phase$/.test(s))return{kind:'CONTEXT_BATTLE_PHASE',exact:true,text:t,alpha644:true};
 if(/^during your opponent'?s turn$/.test(s))return{kind:'CONTEXT_OPP_TURN',exact:true,text:t,alpha644:true};
 if(/^during your turn$/.test(s))return{kind:'CONTEXT_YOUR_TURN',exact:true,text:t,alpha644:true};
 if(/^during either player'?s turn$/.test(s))return{kind:'CONTEXT_EITHER_TURN',exact:true,text:t,alpha644:true};
 if(/^at the start of (?:the )?battle phase$/.test(s))return{kind:'CONTEXT_BATTLE_START',exact:true,text:t,alpha644:true};
 if(/^at the end of (?:the )?battle phase$/.test(s))return{kind:'CONTEXT_BATTLE_END',exact:true,text:t,alpha644:true};
 if(/^at the end of (?:the )?damage step$/.test(s))return{kind:'CONTEXT_END_DAMAGE_STEP',exact:true,text:t,alpha644:true};
 if(/^after damage calculation$/.test(s))return{kind:'CONTEXT_AFTER_DAMAGE_CALC',exact:true,text:t,alpha644:true};
 if(/^before damage calculation$/.test(s))return{kind:'CONTEXT_BEFORE_DAMAGE_CALC',exact:true,text:t,alpha644:true};
 if(/^during damage calculation$/.test(s))return{kind:'CONTEXT_DAMAGE_CALC',exact:true,text:t,alpha644:true};
 // Phase + source-history composites that occur frequently in PSCT.
 if(/^during your main phase,? except the turn this card was sent to (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_YOUR_MAIN_PHASE',exact:true,text:'During your Main Phase',alpha644:true},{kind:'SOURCE_NOT_SENT_GY_THIS_TURN',exact:true,text:'Except the turn this card was sent to the GY',alpha644:true}]};
 if(/^at the end of (?:the )?damage step,? if this card battled an opponent'?s monster$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_END_DAMAGE_STEP',exact:true,text:'At the end of the Damage Step',alpha644:true},{kind:'SOURCE_BATTLED_OPPONENT_MONSTER',exact:true,text:'If this card battled an opponent monster',alpha644:true}]};
 if(/^at the end of (?:the )?battle phase,? if this card battled$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_BATTLE_END',exact:true,text:'At the end of the Battle Phase',alpha644:true},{kind:'SOURCE_BATTLED',exact:true,text:'If this card battled',alpha644:true}]};
 // Canonical activation-event predicates (Alpha630 family).
 if(/^(?:if|when) this card is activated$/.test(s)||/^(?:if|when) you activate this card$/.test(s))return{kind:'SOURCE_CARD_ACTIVATED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) your opponent activates a monster effect$/.test(s))return{kind:'OPPONENT_MONSTER_EFFECT_ACTIVATED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) a monster effect is activated$/.test(s))return{kind:'MONSTER_EFFECT_ACTIVATED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) a card or effect is activated$/.test(s))return{kind:'CARD_OR_EFFECT_ACTIVATED',exact:true,text:t,alpha644:true};
 // High-frequency generic battle predicates (Alpha644 family).
 if(/^(?:if|when) a monster declares an attack$/.test(s))return{kind:'ANY_MONSTER_DECLARES_ATTACK',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is targeted for an attack$/.test(s)||/^(?:if|when) this card is selected as an attack target$/.test(s))return{kind:'SOURCE_TARGETED_FOR_ATTACK',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) a monster you control is targeted for an attack$/.test(s)||/^(?:if|when) a monster you control is selected as an attack target$/.test(s))return{kind:'CONTROLLED_MONSTER_TARGETED_FOR_ATTACK',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card destroys an opponent'?s monster by battle$/.test(s))return{kind:'SOURCE_DESTROYS_OPPONENT_BY_BATTLE',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card destroys an opponent'?s monster by battle and sends it to (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_DESTROYS_OPPONENT_BY_BATTLE_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) you take battle damage$/.test(s))return{kind:'YOU_TAKE_BATTLE_DAMAGE',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is flipped face-up$/.test(s))return{kind:'SOURCE_FLIPPED_FACEUP',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is normal summoned or flipped face-up$/.test(s))return{kind:'SOURCE_NORMAL_OR_FLIPPED_FACEUP',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) you draw this card$/.test(s))return{kind:'SOURCE_DRAWN',exact:true,text:t,alpha644:true};
 if(/^if this card is in your hand or (?:gy|graveyard)$/.test(s))return{kind:'ANY',exact:true,text:t,alpha644:true,items:[{kind:'SOURCE_ZONE_STATE',zone:'hand',exact:true,text:'If this card is in your hand',alpha644:true},{kind:'SOURCE_ZONE_STATE',zone:'gy',exact:true,text:'If this card is in your GY',alpha644:true}]};
 if(/^if this card is pendulum summoned from the extra deck$/.test(s))return{kind:'SOURCE_PENDULUM_FROM_EXTRA',exact:true,text:t,alpha644:true};
 if(/^if this card is tributed for a tribute summon$/.test(s))return{kind:'SOURCE_TRIBUTED_FOR_TRIBUTE_SUMMON',exact:true,text:t,alpha644:true};
 if(/^at the end of (?:the )?damage step,? if this card battled$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_END_DAMAGE_STEP',exact:true,text:'At the end of the Damage Step',alpha644:true},{kind:'SOURCE_BATTLED',exact:true,text:'If this card battled',alpha644:true}]};
 if(/^during your standby phase,? if this card is in (?:your )?(?:gy|graveyard)$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_YOUR_STANDBY_PHASE',exact:true,text:'During your Standby Phase',alpha644:true},{kind:'SOURCE_ZONE_STATE',zone:'gy',exact:true,text:'If this card is in your GY',alpha644:true}]};
 if(/^during the end phase,? if this card is in (?:the )?(?:gy|graveyard) because it was sent there this turn$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_END_PHASE',exact:true,text:'During the End Phase',alpha644:true},{kind:'SOURCE_SENT_GY_THIS_TURN',exact:true,text:'If this card is in the GY because it was sent there this turn',alpha644:true}]};
 if(/^during your end phase,? if this card is in (?:the )?(?:gy|graveyard) because it was sent there this turn$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_YOUR_END_PHASE',exact:true,text:'During your End Phase',alpha644:true},{kind:'SOURCE_SENT_GY_THIS_TURN',exact:true,text:'If this card is in the GY because it was sent there this turn',alpha644:true}]};
 if(/^during the end phase,? if this card is in (?:the )?(?:gy|graveyard) because it was destroyed on the field by battle or card effect and sent there this turn$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_END_PHASE',exact:true,text:'During the End Phase',alpha644:true},{kind:'SOURCE_DESTROYED_SENT_GY_THIS_TURN',exact:true,text:'If this card was destroyed on the field by battle or card effect and sent to the GY this turn',alpha644:true}]};
 if(/^during the end phase of the turn this card is normal summoned or flipped face-up$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_END_PHASE',exact:true,text:'During the End Phase',alpha644:true},{kind:'SOURCE_NORMAL_OR_FLIPPED_THIS_TURN',exact:true,text:'If this card was Normal Summoned or flipped face-up this turn',alpha644:true}]};
 // High-impact condition variants measured from the embedded 19,456-card corpus (Alpha644).
 if(/^during your main phase 1$/.test(s))return{kind:'CONTEXT_YOUR_MAIN_PHASE_1',exact:true,text:t,alpha644:true};
 if(/^during your opponent'?s main phase$/.test(s))return{kind:'CONTEXT_OPP_MAIN_PHASE',exact:true,text:t,alpha644:true};
 if(/^during your opponent'?s end phase$/.test(s))return{kind:'CONTEXT_OPP_END_PHASE',exact:true,text:t,alpha644:true};
 if(/^during each of your standby phases$/.test(s))return{kind:'CONTEXT_YOUR_STANDBY_PHASE',exact:true,text:t,alpha644:true};
 if(/^during each of your end phases$/.test(s))return{kind:'CONTEXT_YOUR_END_PHASE',exact:true,text:t,alpha644:true};
 if(/^at the start of your battle phase$/.test(s))return{kind:'CONTEXT_YOUR_BATTLE_START',exact:true,text:t,alpha644:true};
 if(/^at the start of your opponent'?s battle phase$/.test(s))return{kind:'CONTEXT_OPP_BATTLE_START',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is in (?:your )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_ZONE_STATE',zone:'gy',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is in your hand$/.test(s))return{kind:'SOURCE_ZONE_STATE',zone:'hand',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is in your banished zone$/.test(s))return{kind:'SOURCE_ZONE_STATE',zone:'banished',exact:true,text:t,alpha644:true};
 if(/^while this card is equipped to (?:a|an) monster$/.test(s))return{kind:'SOURCE_EQUIPPED_TO_MONSTER',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card leaves the field$/.test(s)||/^(?:if|when) this card on the field leaves the field$/.test(s))return{kind:'SOURCE_LEAVES_FIELD',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card(?: in the monster zone| on the field) is destroyed$/.test(s))return{kind:'SOURCE_DESTROYED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card(?: on the field)? is destroyed and sent to (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_DESTROYED_SENT_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is destroyed by battle or card effect and sent to (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_DESTROYED_BATTLE_OR_EFFECT_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card destroys (?:a|an) monster by battle$/.test(s))return{kind:'SOURCE_DESTROYS_MONSTER_BY_BATTLE',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card destroys (?:a|an) monster by battle and sends it to (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_DESTROYS_MONSTER_BY_BATTLE_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is discarded$/.test(s))return{kind:'SOURCE_DISCARDED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is discarded to (?:the )?(?:gy|graveyard) by (?:a )?card effect$/.test(s))return{kind:'SOURCE_DISCARDED_BY_EFFECT',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is sent from the spell & trap zone to (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_SENT_ST_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is special summoned from the spell & trap zone$/.test(s))return{kind:'SOURCE_SPECIAL_FROM',zone:'spelltrap',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is special summoned during your opponent'?s turn$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'SOURCE_SPECIAL_SUMMONED',exact:true,text:'If this card is Special Summoned',alpha644:true},{kind:'CONTEXT_OPP_TURN',exact:true,text:"During your opponent's turn",alpha644:true}]};
 if(/^if you control no spell\/trap cards$/.test(s))return{kind:'YOU_NO_SPELLTRAPS',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) your opponent activates a card or effect$/.test(s))return{kind:'OPPONENT_CARD_OR_EFFECT_ACTIVATED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) your opponent activates a trap card$/.test(s))return{kind:'OPPONENT_TRAP_ACTIVATED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) your opponent activates a spell card$/.test(s))return{kind:'OPPONENT_SPELL_ACTIVATED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card attacks an opponent'?s face-down defense position monster$/.test(s))return{kind:'SOURCE_ATTACKS_FACEDOWN_DEFENSE',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) you pendulum summon a monster$/.test(s))return{kind:'YOU_PENDULUM_SUMMON',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) a pendulum monster\(s\) you control is destroyed$/.test(s)||/^(?:if|when) a pendulum monster you control is destroyed$/.test(s))return{kind:'CONTROLLED_PENDULUM_DESTROYED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) battle damage is inflicted$/.test(s))return{kind:'BATTLE_DAMAGE_INFLICTED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) a card\(s\) you control is destroyed by battle or card effect$/.test(s)||/^(?:if|when) a card you control is destroyed by battle or card effect$/.test(s))return{kind:'CONTROLLED_CARD_DESTROYED_BATTLE_OR_EFFECT',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) a level 5 or higher monster\(s\) is special summoned$/.test(s)||/^(?:if|when) a level 5 or higher monster is special summoned$/.test(s))return{kind:'LEVEL5PLUS_SPECIAL_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^if this card in the pendulum zone is destroyed$/.test(s))return{kind:'SOURCE_DESTROYED_PENDULUM_ZONE',exact:true,text:t,alpha644:true};
 if(/^during either player'?s turn,? when your opponent activates a spell\/trap card,? or monster effect$/.test(s))return{kind:'OPPONENT_SPELL_TRAP_OR_MONSTER_EFFECT_ACTIVATED',exact:true,text:t,alpha644:true};
 m=t.match(/^(?:If|When) an ["“]([^"”]+)["”] Spell Card or effect is activated(?: this turn)?$/i);if(m)return{kind:'NAMED_FAMILY_SPELL_OR_EFFECT_ACTIVATED',value:low(m[1]),exact:true,text:t,alpha644:true};
 if(/^at the start of (?:the )?damage step,? if this card battles an opponent'?s monster$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_DAMAGE_STEP_START',exact:true,text:'At the start of the Damage Step',alpha644:true},{kind:'SOURCE_INVOLVED_ATTACK',exact:true,text:'If an attack is declared involving this card',alpha644:true}]};
 if(/^at the end of (?:the )?battle phase,? if this card attacked or was attacked$/.test(s))return{kind:'ALL',exact:true,text:t,alpha644:true,items:[{kind:'CONTEXT_BATTLE_END',exact:true,text:'At the end of the Battle Phase',alpha644:true},{kind:'SOURCE_BATTLED',exact:true,text:'If this card battled',alpha644:true}]};
 // Turn/history + source-cause predicates (Alpha624 family).
 if(/^if this card was normal or special summoned this turn$/.test(s))return{kind:'SOURCE_SUMMONED_THIS_TURN',methods:['NORMAL_SUMMON','SPECIAL_SUMMON'],exact:true,text:t,alpha644:true};
 if(/^if this card was special summoned this turn$/.test(s))return{kind:'SOURCE_SUMMONED_THIS_TURN',methods:['SPECIAL_SUMMON'],exact:true,text:t,alpha644:true};
 if(/^if this card was normal summoned this turn$/.test(s))return{kind:'SOURCE_SUMMONED_THIS_TURN',methods:['NORMAL_SUMMON'],exact:true,text:t,alpha644:true};
 if(/^if this card was special summoned$/.test(s))return{kind:'SOURCE_WAS_SPECIAL_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^if this card is in (?:your )?(?:gy|graveyard) because it was sent there this turn$/.test(s))return{kind:'SOURCE_SENT_GY_THIS_TURN',exact:true,text:t,alpha644:true};
 m=t.match(/^If this card is Special Summoned by the effect of a ["“]([^"”]+)["”] monster$/i);if(m)return{kind:'SOURCE_SPECIAL_BY_NAMED_FAMILY',value:low(m[1]),exact:true,text:t,alpha644:true};
 if(/^if this card in its owner's possession is destroyed by an opponent's card$/.test(s))return{kind:'SOURCE_DESTROYED_BY_OPPONENT_CARD',exact:true,text:t,alpha644:true};
 if(/^if this face-up card in its owner's control leaves the field because of an opponent's card effect$/.test(s))return{kind:'SOURCE_LEAVES_BY_OPPONENT_EFFECT',exact:true,text:t,alpha644:true};
 // Destruction/battle/event-cause predicates (Alpha623 family).
 if(/^(?:if|when) this card is destroyed$/.test(s))return{kind:'SOURCE_DESTROYED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is destroyed by battle$/.test(s))return{kind:'SOURCE_DESTROYED_BATTLE',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card (?:on the field |in the monster zone )?is destroyed by battle or card effect$/.test(s))return{kind:'SOURCE_DESTROYED_BATTLE_OR_EFFECT',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is destroyed by card effect$/.test(s))return{kind:'SOURCE_DESTROYED_EFFECT',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is destroyed and sent to (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_DESTROYED_SENT_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is destroyed by battle and sent to (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_DESTROYED_BATTLE_SENT_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is sent to (?:the )?(?:gy|graveyard) by (?:a )?card effect$/.test(s))return{kind:'SOURCE_SENT_GY_BY_EFFECT',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is tributed$/.test(s))return{kind:'SOURCE_TRIBUTED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card inflicts battle damage to your opponent$/.test(s))return{kind:'SOURCE_INFLICTS_BATTLE_DAMAGE',exact:true,text:t,alpha644:true};
 // Direct source event predicates (Alpha622 family).
 if(/^(?:if|when) this card is normal or special summoned$/.test(s))return{kind:'SOURCE_NORMAL_OR_SPECIAL_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is normal summoned$/.test(s))return{kind:'SOURCE_NORMAL_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is special summoned$/.test(s))return{kind:'SOURCE_SPECIAL_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is summoned$/.test(s))return{kind:'SOURCE_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is link summoned$/.test(s))return{kind:'SOURCE_EXTRA_SUMMONED',method:'LINK',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is synchro summoned$/.test(s))return{kind:'SOURCE_EXTRA_SUMMONED',method:'SYNCHRO',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is xyz summoned$/.test(s))return{kind:'SOURCE_EXTRA_SUMMONED',method:'XYZ',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is fusion summoned$/.test(s))return{kind:'SOURCE_EXTRA_SUMMONED',method:'FUSION',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is ritual summoned$/.test(s))return{kind:'SOURCE_EXTRA_SUMMONED',method:'RITUAL',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is tribute summoned$/.test(s))return{kind:'SOURCE_TRIBUTE_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is sent (?:to the gy|to the graveyard)$/.test(s))return{kind:'SOURCE_SENT_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is sent from the field (?:to the gy|to the graveyard)$/.test(s))return{kind:'SOURCE_SENT_FIELD_GY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is destroyed and sent to (?:the )?(?:gy|graveyard) by battle$/.test(s))return{kind:'SOURCE_DESTROYED_BATTLE',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is banished$/.test(s))return{kind:'SOURCE_BANISHED_EVENT',exact:true,text:t,alpha644:true};
 if(/^if this face-up card leaves the field$/.test(s))return{kind:'SOURCE_LEAVES_FIELD',exact:true,text:t,alpha644:true};
 if(/^if this card is special summoned from the hand$/.test(s))return{kind:'SOURCE_SPECIAL_FROM',zone:'hand',exact:true,text:t,alpha644:true};
 if(/^if this card is special summoned from (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_SPECIAL_FROM',zone:'gy',exact:true,text:t,alpha644:true};
 // Exact material / detach predicates (Alpha644).
 if(/^(?:if|when) this card is used as link material$/.test(s))return{kind:'SOURCE_USED_AS_MATERIAL',method:'LINK',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is used as synchro material$/.test(s))return{kind:'SOURCE_USED_AS_MATERIAL',method:'SYNCHRO',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is used as xyz material$/.test(s))return{kind:'SOURCE_USED_AS_MATERIAL',method:'XYZ',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is used as fusion material$/.test(s))return{kind:'SOURCE_USED_AS_MATERIAL',method:'FUSION',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is sent to (?:the )?(?:gy|graveyard) as link material$/.test(s))return{kind:'SOURCE_SENT_GY_AS_MATERIAL',method:'LINK',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is sent to (?:the )?(?:gy|graveyard) as synchro material$/.test(s))return{kind:'SOURCE_SENT_GY_AS_MATERIAL',method:'SYNCHRO',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is sent to (?:the )?(?:gy|graveyard) as fusion material$/.test(s)||/^(?:if|when) this card is sent to (?:the )?(?:gy|graveyard) for a fusion summon$/.test(s))return{kind:'SOURCE_SENT_GY_AS_MATERIAL',method:'FUSION',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is detached from an xyz monster$/.test(s))return{kind:'SOURCE_DETACHED_XYZ',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is detached from an xyz monster and sent to (?:the )?(?:gy|graveyard)$/.test(s))return{kind:'SOURCE_DETACHED_XYZ_GY',exact:true,text:t,alpha644:true};
 // Canonical attack-declaration predicates (Alpha644).
 if(/^(?:if|when) this card declares an attack$/.test(s))return{kind:'SOURCE_DECLARES_ATTACK',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) an attack is declared involving this card$/.test(s))return{kind:'SOURCE_INVOLVED_ATTACK',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) (?:an |your )?opponent(?:'s)? monster declares an attack$/.test(s))return{kind:'OPPONENT_DECLARES_ATTACK',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) your opponent declares a direct attack$/.test(s)||/^(?:if|when) (?:an |your )?opponent(?:'s)? monster declares a direct attack$/.test(s))return{kind:'OPPONENT_DIRECT_ATTACK',exact:true,text:t,alpha644:true};
 // Opponent/field predicates (Alpha623 family).
 if(/^if your opponent controls more monsters than you do$/.test(s))return{kind:'OPP_MORE_MONSTERS',exact:true,text:t,alpha644:true};
 if(/^if your opponent controls (?:a|an|1) monster$/.test(s))return{kind:'OPP_HAS_MONSTER',exact:true,text:t,alpha644:true};
 m=t.match(/^If there is no ["“]([^"”]+)["”] monster on the field$/i);if(m)return{kind:'NO_NAMED_FAMILY_MONSTER_FIELD',value:low(m[1]),exact:true,text:t,alpha644:true};
 m=t.match(/^If ["“]([^"”]+)["”] is on the field$/i);if(m)return{kind:'EXACT_NAME_ON_FIELD',value:low(m[1]),exact:true,text:t,alpha644:true};
 m=t.match(/^If ["“]([^"”]+)["”] is not face-up on the field$/i);if(m)return{kind:'EXACT_NAME_NOT_FACEUP_FIELD',value:low(m[1]),exact:true,text:t,alpha644:true};
 // Extended state predicates (Alpha621 family).
 // Alpha644 parser cleanup + high-frequency legacy predicates.
 if(/^you can either$/.test(s))return{kind:'USAGE_CHOICE_ONLY',usageOnly:true,exact:true,text:t,alpha644:true};
 if(/^(?:if|when) you do$/.test(s))return{kind:'RESOLUTION_CONTINUATION',resolutionOnly:true,exact:true,text:t,alpha644:true};
 if(/^during your main phase,? you can$/.test(s))return{kind:'CONTEXT_YOUR_MAIN_PHASE',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is normal or flip summoned$/.test(s))return{kind:'SOURCE_NORMAL_OR_FLIP_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card is flip summoned$/.test(s))return{kind:'SOURCE_FLIP_SUMMONED',exact:true,text:t,alpha644:true};
 if(/^if it is xyz summoned$/.test(s))return{kind:'SOURCE_EXTRA_SUMMONED',method:'XYZ',exact:true,text:t,alpha644:true};
 if(/^if this card is in (?:the )?graveyard$/.test(s))return{kind:'SOURCE_ZONE_STATE',zone:'gy',exact:true,text:t,alpha644:true};
 if(/^if you control no monsters in your main monster zone$/.test(s))return{kind:'MAIN_MONSTER_ZONE_EMPTY',exact:true,text:t,alpha644:true};
 if(/^(?:if|when) this card inflicts battle damage to your opponent by a direct attack$/.test(s))return{kind:'SOURCE_INFLICTS_DIRECT_BATTLE_DAMAGE',exact:true,text:t,alpha644:true};
 if(/^if this card is destroyed by battle,? or if this card in its owner'?s possession is destroyed by an opponent'?s card effect$/.test(s))return{kind:'ANY',exact:true,text:t,alpha644:true,items:[{kind:'SOURCE_DESTROYED_BATTLE',exact:true,text:'If this card is destroyed by battle',alpha644:true},{kind:'SOURCE_DESTROYED_BY_OPPONENT_CARD',exact:true,text:"If this card in its owner's possession is destroyed by an opponent's card effect",alpha644:true}]};
 if(/^if this card in its owner'?s spell\s*&\s*trap zone is destroyed by an opponent'?s card effect$/.test(s))return{kind:'SOURCE_ST_DESTROYED_BY_OPPONENT_EFFECT',exact:true,text:t,alpha644:true};

 q=raw(t).match(/if you control (?:a|an|1)?\s*["“]([^"”]+)["”]\s+monster/i);if(q)return{kind:'CONTROL_NAMED_FAMILY_MONSTER',value:low(q[1]),exact:true,text:t,alpha644:true};
 q=raw(t).match(/if your opponent controls (?:a|an|1)?\s*["“]([^"”]+)["”]\s+monster/i);if(q)return{kind:'OPP_CONTROL_NAMED_FAMILY_MONSTER',value:low(q[1]),exact:true,text:t,alpha644:true};
 q=raw(t).match(/if you control ["“]([^"”]+)["”](?!\s+monster)/i);if(q)return{kind:'CONTROL_EXACT_NAME',value:low(q[1]),exact:true,text:t,alpha644:true};
 q=raw(t).match(/if your opponent controls ["“]([^"”]+)["”](?!\s+monster)/i);if(q)return{kind:'OPP_CONTROL_EXACT_NAME',value:low(q[1]),exact:true,text:t,alpha644:true};
 if(/^if only your opponent controls (?:a|an|1) monster$/i.test(t))return{kind:'ALL',exact:true,alpha644:true,text:t,items:[{kind:'OPP_MONSTERS_GE',n:1,exact:true,text:'If your opponent controls 1 or more monsters',alpha644:false},{kind:'YOU_NO_MONSTERS',exact:true,text:'If you control no monsters',alpha644:true}]};
 const b=A620.conditionSpec620?.(t);if(b?.exact===true)return{...b,text:t,alpha644:false};
 if(/^if you control no monsters$/.test(s))return{kind:'YOU_NO_MONSTERS',exact:true,text:t,alpha644:true};
 if(/^if you control no cards$/.test(s))return{kind:'YOU_NO_CARDS',exact:true,text:t,alpha644:true};
 if(/if your opponent controls a monster/.test(s))return{kind:'OPP_MONSTERS_GE',n:1,exact:true,text:'If your opponent controls 1 or more monsters',alpha644:false};
 if(/if you control a monster/.test(s))return{kind:'YOU_MONSTERS_GE',n:1,exact:true,text:'If you control 1 or more monsters',alpha644:false};
 if((m=s.match(/if you control (\d+) or fewer monsters/)))return{kind:'YOU_MONSTERS_LE',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if((m=s.match(/if your opponent controls (\d+) or fewer monsters/)))return{kind:'OPP_MONSTERS_LE',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if((m=s.match(/if you control (\d+) or more cards/)))return{kind:'YOU_FIELD_GE',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if((m=s.match(/if your opponent controls (\d+) or more cards/)))return{kind:'OPP_FIELD_GE',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if((m=s.match(/if you control (\d+) or fewer cards/)))return{kind:'YOU_FIELD_LE',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if((m=s.match(/if your opponent controls (\d+) or fewer cards/)))return{kind:'OPP_FIELD_LE',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if(/if you have no cards in your hand|if your hand is empty/.test(s))return{kind:'HAND_EMPTY',exact:true,text:t,alpha644:true};
 if((m=s.match(/if you have exactly (\d+) cards? in your hand/)))return{kind:'HAND_EQ',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if((m=s.match(/if you have (\d+) or fewer (?:cards|monsters) in your gy/)))return{kind:/monsters/.test(m[0])?'GY_MONSTERS_LE':'GY_CARDS_LE',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if((m=s.match(/if you have (\d+) or more banished cards/)))return{kind:'BANISHED_GE',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if((m=s.match(/if you have (\d+) or fewer banished cards/)))return{kind:'BANISHED_LE',n:Number(m[1]),exact:true,text:t,alpha644:true};
 if((m=s.match(/if you control (?:a|an|1) (dark|light|earth|water|fire|wind|divine) monster/)))return{kind:'CONTROL_ATTRIBUTE',value:m[1],exact:true,text:t,alpha644:true};
 if((m=s.match(/if your opponent controls (?:a|an|1) (dark|light|earth|water|fire|wind|divine) monster/)))return{kind:'OPP_CONTROL_ATTRIBUTE',value:m[1],exact:true,text:t,alpha644:true};
 if((m=s.match(/if you control (?:a|an|1) ([a-z -]+) monster/))&&!/dark|light|earth|water|fire|wind|divine/.test(m[1]))return{kind:'CONTROL_RACE',value:m[1].trim(),exact:true,text:t,alpha644:true};
 if((m=s.match(/if your opponent controls (?:a|an|1) ([a-z -]+) monster/))&&!/dark|light|earth|water|fire|wind|divine/.test(m[1]))return{kind:'OPP_CONTROL_RACE',value:m[1].trim(),exact:true,text:t,alpha644:true};
 return null}
function parseLogic644(text){const qp=quoteProtect644(raw(text)),tokens=[];let s=low(qp.value);s=s.replace(/\b(\d+|one)\s+or\s+more\b/g,(_,n)=>{const k=`__NUM${tokens.length}__`;tokens.push(`${n} or more`);return k}).replace(/\b(\d+|one)\s+or\s+(fewer|less)\b/g,(_,n,w)=>{const k=`__NUM${tokens.length}__`;tokens.push(`${n} or ${w}`);return k});const restore=x=>qp.restore(x.replace(/__num(\d+)__/gi,(_,i)=>tokens[Number(i)]||''));const orParts=s.split(/\s+or\s+/).map(x=>x.trim()).filter(Boolean),groups=[];for(const op of orParts){const andParts=op.split(/\s+and\s+/).map(restore).map(x=>x.trim()).filter(Boolean),atoms=[];for(const a of andParts){const sp=atomSpec644(a);if(!sp)return null;atoms.push(sp)}groups.push(atoms.length===1?atoms[0]:{kind:'ALL',exact:true,items:atoms,text:raw(text),alpha644:true})}if(!groups.length)return null;return groups.length===1?groups[0]:{kind:'ANY',exact:true,items:groups,text:raw(text),alpha644:true}}
function conditionSpec644(text){if(!raw(text).trim())return null;const whole=atomSpec644(text);if(whole)return whole;const p=parseLogic644(text);if(p)return p;const b=A620.conditionSpec620?.(text);return b?.exact===true?{...b,text:raw(text),alpha644:false}:(b||{kind:'UNSUPPORTED_CONDITION',exact:false,text:raw(text),alpha644:true})}

/* ---------- unified condition evaluator ---------- */
function scanZones644(st,uid){for(let p=0;p<2;p++)for(const z of ['deck','hand','monster','spelltrap','gy','banished','extra'])for(const x of arr(st?.zones?.[p]?.[z]))if(String(x?.uid||'')===String(uid))return{p,z,item:x};return null}
function evData644(e){return e?.data||e||{}}
function evUid644(e){const d=evData644(e);return raw(d.uid||e?.uid)}
function evName644(e){const d=evData644(e),v=d.card||d.item||e?.card;if(typeof v==='string')return low(v);return low(v?.card?.name||v?.name||'')}
function recentEvents644(st){const a=arr(st?.events).slice(-16).reverse();if(st?.lastEvent&&!a.includes(st.lastEvent))a.unshift(st.lastEvent);if(st?.__alpha644SyntheticEvent)a.unshift(st.__alpha644SyntheticEvent);return a}
function sourceMatch644(e,uid,c,st){const u=raw(uid),eu=evUid644(e);if(u&&eu)return u===eu;const cn=low(c?.name||''),en=evName644(e);return !!(st?.__alpha644SourceUnique&&cn&&en&&cn===en)}
function effectCause644(e){const d=evData644(e),cause=e?.cause||{};if(d.effect===true||cause.effect===true)return true;if(/CARD_EFFECT|EFFECT/.test(raw(d.cause||d.reasonType||cause.type).toUpperCase()))return true;return false}
function sourceFamily644(e,v){const d=evData644(e);return[d.source,d.sourceCard,d.sourceName,e?.source,e?.cause?.card,e?.cause?.source].some(x=>low(x).includes(v))}
function sourcePlayer644(e){const d=evData644(e),v=d.sourcePlayer??e?.sourcePlayer??e?.cause?.player;return Number.isInteger(Number(v))?Number(v):null}
function isDestroy644(e){return/^(DESTROY|BATTLE_DESTROY)$/.test(raw(e?.type))}
function materialSourceMatch644(e,uid,c,st){const d=evData644(e),u=raw(uid),eu=raw(d.material||d.uid||e?.uid);if(u&&eu)return u===eu;const cn=low(c?.name||''),en=low(d.materialName||d.cardName||evName644(e));return !!(st?.__alpha644SourceUnique&&cn&&en&&cn===en)}
function materialMethod644(e,st){const d=evData644(e),t=raw(e?.type).toUpperCase(),m=raw(d.method||d.procedure||d.summonType).toUpperCase();for(const x of ['LINK','SYNCHRO','XYZ','FUSION','RITUAL'])if(m.includes(x)||t.includes(x+'_MATERIAL'))return x;if(t==='MATERIAL_USED'&&d.target){const q=R.locate?.(st,d.target),ty=low(q?.item?.card?.type||'');if(/link/.test(ty))return'LINK';if(/synchro/.test(ty))return'SYNCHRO';if(/xyz/.test(ty))return'XYZ';if(/fusion/.test(ty))return'FUSION';if(/ritual/.test(ty))return'RITUAL'}return''}
function materialToGy644(e,uid,st){const d=evData644(e),t=raw(e?.type).toUpperCase();if(low(d.to)==='gy'||/TO_GY|COST_DETACH/.test(t))return true;const u=raw(uid),q=u?R.locate?.(st,u):null;return !!q&&q.z==='gy'&&(/MATERIAL/.test(t)||t==='MATERIAL_USED')}
function eventAllowed644(st,p,spec,uid,c){const all=recentEvents644(st),match=all.filter(e=>sourceMatch644(e,uid,c,st)),turn=Number(st?.turn)||1,loc=uid?scanZones644(st,uid):null,any=fn=>match.some(fn);let ok=false,unverified=false,reason='';
 if(spec.kind==='SOURCE_USED_AS_MATERIAL'||spec.kind==='SOURCE_SENT_GY_AS_MATERIAL'||spec.kind==='SOURCE_DETACHED_XYZ'||spec.kind==='SOURCE_DETACHED_XYZ_GY'){
  const evs=all.filter(e=>materialSourceMatch644(e,uid,c,st));let candidates=[];
  if(spec.kind==='SOURCE_DETACHED_XYZ'||spec.kind==='SOURCE_DETACHED_XYZ_GY')candidates=evs.filter(e=>/DETACH/.test(raw(e?.type).toUpperCase()));
  else candidates=evs.filter(e=>/MATERIAL/.test(raw(e?.type).toUpperCase()));
  if(spec.kind==='SOURCE_USED_AS_MATERIAL')ok=candidates.some(e=>materialMethod644(e,st)===spec.method);
  else if(spec.kind==='SOURCE_SENT_GY_AS_MATERIAL')ok=candidates.some(e=>materialMethod644(e,st)===spec.method&&materialToGy644(e,uid,st));
  else if(spec.kind==='SOURCE_DETACHED_XYZ')ok=candidates.length>0;
  else ok=candidates.some(e=>materialToGy644(e,uid,st));
  unverified=!ok&&!uid&&!st?.__alpha644SourceUnique;reason=spec.kind==='SOURCE_USED_AS_MATERIAL'?`La carta debe haber sido usada como Material ${spec.method}.`:spec.kind==='SOURCE_SENT_GY_AS_MATERIAL'?`La carta debe haber sido enviada al GY como Material ${spec.method}.`:spec.kind==='SOURCE_DETACHED_XYZ'?'La carta debe haber sido desacoplada de un Monstruo Xyz.':'La carta debe haber sido desacoplada de un Monstruo Xyz y enviada al GY.';return{ok,unverified,reason,spec}
 }
 if(spec.kind==='SOURCE_EQUIPPED_TO_MONSTER'){let q=uid?scanZones644(st,uid):null;if(!q&&!uid&&st?.__alpha644SourceUnique){const cn=low(c?.name||'');for(const x of arr(st?.zones?.[p]?.spelltrap)){if(low(obj(x)?.name)===cn){q={p:Number(p),z:'spelltrap',item:x};break}}}if(!q)return{ok:false,unverified:!uid&&!st?.__alpha644SourceUnique,reason:'Falta identidad física para verificar la relación de Equipo.',spec};const targetUid=raw(q.item?.equippedTo||q.item?.equipTargetUid||q.item?.equippedToUid),tg=targetUid?scanZones644(st,targetUid):null;return{ok:q.p===Number(p)&&q.z==='spelltrap'&&!!tg&&tg.z==='monster'&&tg.item?.faceUp!==false,unverified:false,reason:'La carta fuente debe estar equipada a un monstruo boca arriba.',spec}}
 if(spec.kind==='SOURCE_ZONE_STATE'){const q=uid?scanZones644(st,uid):null;if(q)return{ok:q.p===Number(p)&&q.z===spec.zone,unverified:false,reason:`La carta fuente debe estar en ${spec.zone}.`,spec};if(!uid&&st?.__alpha644SourceUnique){const zones=arr(st?.zones?.[p]?.[spec.zone]);const cn=low(c?.name||'');return{ok:zones.some(x=>low(obj(x)?.name)===cn),unverified:false,reason:`La carta fuente debe estar en ${spec.zone}.`,spec}}return{ok:false,unverified:true,reason:'Falta identidad física para verificar la zona de la carta fuente.',spec}}
 if(spec.kind==='SOURCE_DRAWN'){const evs=all.filter(e=>raw(e?.type)==='DRAW'),u=raw(uid),cn=low(c?.name||'');let uncertain=false;ok=evs.some(e=>{const d=evData644(e),eu=raw(d.uid);if(u&&eu)return u===eu;if(!u&&st?.__alpha644SourceUnique&&cn){const q=eu?scanZones644(st,eu):null;return q&&low(obj(q.item)?.name)===cn}if(!u)uncertain=true;return false});return{ok,unverified:!ok&&uncertain,reason:'La carta fuente debe haber sido robada.',spec}}
 if(spec.kind==='SOURCE_PENDULUM_FROM_EXTRA'){const evs=all.filter(e=>raw(e?.type)==='PENDULUM_SUMMON'),u=raw(uid),cn=low(c?.name||'');let uncertain=false;ok=evs.some(e=>arr(evData644(e).moved).some(x=>{const xu=raw(x?.uid);if(u&&xu)return u===xu&&low(x?.from)==='extra';if(!u&&st?.__alpha644SourceUnique&&cn)return low(x?.name||'')===cn&&low(x?.from)==='extra';if(!u)uncertain=true;return false}));return{ok,unverified:!ok&&uncertain,reason:'La carta fuente debe haber sido Invocada por Péndulo desde el Extra Deck.',spec}}
 if(spec.kind==='SOURCE_TRIBUTED_FOR_TRIBUTE_SUMMON'){const evs=all.filter(e=>raw(e?.type)==='TRIBUTE_SUMMON'),u=raw(uid),cn=low(c?.name||'');let uncertain=false;ok=evs.some(e=>{const d=evData644(e),eu=raw(d.uid);if(u&&eu)return u===eu;if(!u&&st?.__alpha644SourceUnique&&cn)return low(d.item||d.card||'')===cn;if(!u)uncertain=true;return false});return{ok,unverified:!ok&&uncertain,reason:'La carta fuente debe haber sido Sacrificada para una Invocación por Tributo.',spec}}
 if(spec.kind==='SOURCE_NORMAL_OR_FLIPPED_FACEUP'){const u=raw(uid),cn=low(c?.name||'');let uncertain=false;const same=(e,key='uid')=>{const d=evData644(e),eu=raw(d[key]);if(u&&eu)return u===eu;if(!u&&st?.__alpha644SourceUnique&&cn)return low(d.card||d.item||d.uidName||'')===cn;if(!u)uncertain=true;return false};ok=all.some(e=>raw(e?.type)==='NORMAL_SUMMON'&&same(e))||all.some(e=>raw(e?.type)==='FLIP_FACE_UP_CANON'&&same(e));return{ok,unverified:!ok&&uncertain,reason:'La carta debe haber sido Invocada Normalmente o volteada boca arriba.',spec}}
 if(spec.kind==='SOURCE_NORMAL_OR_FLIPPED_THIS_TURN'){const u=raw(uid),cn=low(c?.name||''),turn=Number(st?.turn)||1;let uncertain=false;const same=(e,key='uid')=>{const d=evData644(e),eu=raw(d[key]);if(u&&eu)return u===eu;if(!u&&st?.__alpha644SourceUnique&&cn)return low(d.card||d.item||d.uidName||'')===cn;if(!u)uncertain=true;return false};ok=all.some(e=>Number(e?.turn??turn)===turn&&((raw(e?.type)==='NORMAL_SUMMON'&&same(e))||(raw(e?.type)==='FLIP_FACE_UP_CANON'&&same(e))));return{ok,unverified:!ok&&uncertain,reason:'La carta debe haber sido Invocada Normalmente o volteada boca arriba este turno.',spec}}
 if(spec.kind==='SOURCE_DESTROYED_MONSTER_ZONE'){const ds=match.filter(isDestroy644);ok=ds.some(e=>low(evData644(e).from)==='monster');unverified=!ok&&ds.some(e=>!evData644(e).from);return{ok,unverified,reason:'La carta fuente debe haber sido destruida mientras estaba en una Zona de Monstruos.',spec}}
 if(spec.kind==='SOURCE_DESTROYED_SENT_GY_THIS_TURN'){const q=uid?scanZones644(st,uid):null,turn=Number(st?.turn)||1;const ds=match.filter(e=>Number(e?.turn??turn)===turn&&isDestroy644(e));ok=(!q||q.z==='gy')&&ds.some(e=>(raw(e?.type)==='BATTLE_DESTROY'||effectCause644(e))&&(low(evData644(e).to)==='gy'||raw(e?.type)==='BATTLE_DESTROY'));unverified=!ok&&ds.some(e=>raw(e?.type)==='DESTROY'&&!('effect' in evData644(e))&&!e?.cause);return{ok,unverified,reason:'La carta debe estar en el GY tras ser destruida en el Campo por batalla o efecto este turno.',spec}}
 if(spec.kind==='SOURCE_DISCARDED'||spec.kind==='SOURCE_DISCARDED_BY_EFFECT'||spec.kind==='SOURCE_SENT_ST_GY'){const evs=match.filter(e=>{const t=raw(e?.type).toUpperCase(),d=evData644(e);if(spec.kind==='SOURCE_SENT_ST_GY')return low(d.from)==='spelltrap'&&low(d.to)==='gy';return t.includes('DISCARD')||low(d.reason).includes('discard')});ok=evs.some(e=>spec.kind!=='SOURCE_DISCARDED_BY_EFFECT'||effectCause644(e));unverified=!ok&&spec.kind==='SOURCE_DISCARDED_BY_EFFECT'&&evs.some(e=>!('effect' in evData644(e))&&!e?.cause);return{ok,unverified,reason:spec.kind==='SOURCE_SENT_ST_GY'?'La carta debe haber sido enviada de la Zona de Mágicas y Trampas al GY.':spec.kind==='SOURCE_DISCARDED_BY_EFFECT'?'La carta debe haber sido descartada al GY por un efecto de carta.':'La carta debe haber sido descartada.',spec}}
 if(spec.kind==='OPPONENT_CARD_OR_EFFECT_ACTIVATED'||spec.kind==='OPPONENT_TRAP_ACTIVATED'||spec.kind==='OPPONENT_SPELL_ACTIVATED'){const acts=all.filter(e=>raw(e?.type)==='ACTIVATE'&&Number(evData644(e).player)===1-Number(p));let uncertain=false;ok=acts.some(e=>{if(spec.kind==='OPPONENT_CARD_OR_EFFECT_ACTIVATED')return true;const d=evData644(e),cc=(d.card&&typeof d.card==='object'?d.card:null)||R.cardByName?.(raw(d.card))||R.locate?.(st,d.uid)?.item?.card;if(!cc){uncertain=true;return false}const ty=low(cc?.type||'');return spec.kind==='OPPONENT_TRAP_ACTIVATED'?/trap|trampa/.test(ty):/spell|magica|mágica/.test(ty)});return{ok,unverified:!ok&&uncertain,reason:spec.kind==='OPPONENT_TRAP_ACTIVATED'?'El adversario debe haber activado una Carta de Trampa.':spec.kind==='OPPONENT_SPELL_ACTIVATED'?'El adversario debe haber activado una Carta Mágica.':'El adversario debe haber activado una carta o efecto.',spec}}
 if(spec.kind==='SOURCE_DESTROYED_BATTLE_OR_EFFECT_GY'){const ds=match.filter(isDestroy644);ok=ds.some(e=>(raw(e?.type)==='BATTLE_DESTROY'||effectCause644(e))&&(low(evData644(e).to)==='gy'||raw(e?.type)==='BATTLE_DESTROY'));unverified=!ok&&ds.some(e=>raw(e?.type)==='DESTROY'&&!('effect' in evData644(e))&&!e?.cause);return{ok,unverified,reason:'La carta debe haber sido destruida por batalla o efecto y enviada al GY.',spec}}
 if(spec.kind==='SOURCE_DESTROYS_MONSTER_BY_BATTLE'||spec.kind==='SOURCE_DESTROYS_MONSTER_BY_BATTLE_GY'){const u=raw(uid),cn=low(c?.name||'');let uncertain=false,same=(e,key)=>{const d=evData644(e),eu=raw(d[key]);if(u&&eu)return u===eu;if(!u&&st?.__alpha644SourceUnique&&cn)return low(d[key+'Name']||'')===cn;if(!u)uncertain=true;return false};const br=all.filter(e=>raw(e?.type)==='BATTLE_RESULT_CANON');ok=br.some(e=>same(e,'attacker')&&evData644(e).defenderDestroyed===true&&(spec.kind!=='SOURCE_DESTROYS_MONSTER_BY_BATTLE_GY'||low(evData644(e).defenderTo)==='gy'));return{ok,unverified:!ok&&uncertain,reason:'La carta fuente debe haber destruido un monstruo por batalla.',spec}}
 if(spec.kind==='SOURCE_NOT_SENT_GY_THIS_TURN'){const hit=match.some(e=>(low(evData644(e).to)==='gy'||/^(SEND|DESTROY|BATTLE_DESTROY|COST_SEND|COST_DISCARD|COST_TRIBUTE)$/.test(raw(e?.type)))&&Number(e?.turn??turn)===turn);return{ok:!hit,unverified:!uid&&!st?.__alpha644SourceUnique,reason:hit?'La carta fue enviada al GY este turno.':'La carta no fue enviada al GY este turno.',spec}}
 if(spec.kind==='SOURCE_CARD_ACTIVATED'){const evs=all.filter(e=>raw(e?.type)==='CARD_ACTIVATED_CANON'),u=raw(uid),cn=low(c?.name||'');let uncertain=false;ok=evs.some(e=>{const d=evData644(e),eu=raw(d.uid);if(u&&eu)return u===eu;if(!u&&st?.__alpha644SourceUnique&&cn)return low(d.card||'')===cn;uncertain=true;return false});return{ok,unverified:!ok&&uncertain,reason:'La carta fuente debe haber sido activada como carta.',spec}}
 if(spec.kind==='OPPONENT_MONSTER_EFFECT_ACTIVATED'||spec.kind==='MONSTER_EFFECT_ACTIVATED'||spec.kind==='CARD_OR_EFFECT_ACTIVATED'){const acts=all.filter(e=>raw(e?.type)==='ACTIVATE');let uncertain=false;ok=acts.some(e=>{const d=evData644(e);if(spec.kind==='OPPONENT_MONSTER_EFFECT_ACTIVATED'&&Number(d.player)!==1-Number(p))return false;if(spec.kind==='CARD_OR_EFFECT_ACTIVATED')return true;const cc=(d.card&&typeof d.card==='object'?d.card:null)||R.cardByName?.(raw(d.card))||R.locate?.(st,d.uid)?.item?.card;if(!cc){uncertain=true;return false}return isMonster(cc)});return{ok,unverified:!ok&&uncertain,reason:spec.kind==='OPPONENT_MONSTER_EFFECT_ACTIVATED'?'El adversario debe haber activado un efecto de Monstruo.':spec.kind==='MONSTER_EFFECT_ACTIVATED'?'Debe haberse activado un efecto de Monstruo.':'Debe haberse activado una carta o efecto.',spec}}
 if(spec.kind==='CONTROLLED_CARD_DESTROYED_BATTLE_OR_EFFECT'){let uncertain=false;ok=all.some(e=>{if(!isDestroy644(e))return false;const d=evData644(e),owner=Number(d.player??d.fromPlayer??d.controller);if(Number.isInteger(owner)&&owner!==Number(p))return false;if(!Number.isInteger(owner)){const eu=raw(d.uid||e?.uid),q=eu?R.locate?.(st,eu):null;if(q&&q.p!==Number(p))return false;if(!q)uncertain=true}return raw(e?.type)==='BATTLE_DESTROY'||effectCause644(e)});return{ok,unverified:!ok&&uncertain,reason:'Una carta que controlas debe haber sido destruida por batalla o efecto.',spec}}
 if(spec.kind==='LEVEL5PLUS_SPECIAL_SUMMONED'){let uncertain=false;ok=all.some(e=>{if(raw(e?.type)!=='SPECIAL_SUMMON')return false;const d=evData644(e),cc=(d.card&&typeof d.card==='object'?d.card:null)||R.cardByName?.(raw(d.card))||R.locate?.(st,d.uid)?.item?.card;if(!cc){uncertain=true;return false}return Number(cc?.level)>=5});return{ok,unverified:!ok&&uncertain,reason:'Debe haberse Invocado de Modo Especial un monstruo de Nivel 5 o mayor.',spec}}
 if(spec.kind==='SOURCE_DESTROYED_PENDULUM_ZONE'){const ds=match.filter(isDestroy644);ok=ds.some(e=>low(evData644(e).from)==='spelltrap'&&(raw(e?.type)==='BATTLE_DESTROY'||effectCause644(e)||raw(e?.type)==='DESTROY'));unverified=!ok&&ds.some(e=>!evData644(e).from);return{ok,unverified,reason:'La carta fuente debe haber sido destruida desde una Zona de Péndulo.',spec}}
 if(spec.kind==='OPPONENT_SPELL_TRAP_OR_MONSTER_EFFECT_ACTIVATED'){const acts=all.filter(e=>raw(e?.type)==='ACTIVATE'&&Number(evData644(e).player)===1-Number(p));let uncertain=false;ok=acts.some(e=>{const d=evData644(e),cc=(d.card&&typeof d.card==='object'?d.card:null)||R.cardByName?.(raw(d.card))||R.locate?.(st,d.uid)?.item?.card;if(!cc){uncertain=true;return false}const ty=low(cc?.type||'');return /spell|magica|mágica|trap|trampa|monster|monstruo/.test(ty)});return{ok,unverified:!ok&&uncertain,reason:'El adversario debe haber activado una Mágica/Trampa o un efecto de Monstruo.',spec}}
 if(spec.kind==='NAMED_FAMILY_SPELL_OR_EFFECT_ACTIVATED'){const acts=all.filter(e=>raw(e?.type)==='ACTIVATE');let uncertain=false;ok=acts.some(e=>{const d=evData644(e),cc=(d.card&&typeof d.card==='object'?d.card:null)||R.cardByName?.(raw(d.card))||R.locate?.(st,d.uid)?.item?.card;if(!cc){uncertain=true;return false}const nm=low(cc?.name||''),ty=low(cc?.type||'');return nm.includes(spec.value)&&/spell|magica|mágica/.test(ty)});return{ok,unverified:!ok&&uncertain,reason:`Debe haberse activado una Mágica de la familia ${spec.value}.`,spec}}
 if(spec.kind==='SOURCE_ATTACKS_FACEDOWN_DEFENSE'){const attacks=all.filter(e=>raw(e?.type)==='ATTACK_DECLARE'),u=raw(uid),cn=low(c?.name||'');let uncertain=false;ok=attacks.some(e=>{const d=evData644(e),au=raw(d.attacker),same=u&&au?u===au:(!u&&st?.__alpha644SourceUnique&&cn&&low(d.attackerName||'')===cn);if(!same){if(!u)uncertain=true;return false}return d.defender!=null&&d.defenderFaceUp===false&&/^DEF/i.test(raw(d.defenderPosition||''))});return{ok,unverified:!ok&&uncertain,reason:'La carta fuente debe haber atacado a un monstruo adversario boca abajo en Posición de Defensa.',spec}}
 if(spec.kind==='YOU_PENDULUM_SUMMON'){ok=all.some(e=>raw(e?.type)==='PENDULUM_SUMMON'&&Number(evData644(e).player)===Number(p));return{ok,unverified:false,reason:'Debes haber realizado una Invocación por Péndulo.',spec}}
 if(spec.kind==='CONTROLLED_PENDULUM_DESTROYED'){let uncertain=false;ok=all.some(e=>{if(!isDestroy644(e))return false;const d=evData644(e),pl=Number(d.player??d.fromPlayer);if(Number.isInteger(pl)&&pl!==Number(p))return false;const eu=raw(d.uid||e?.uid),q=eu?R.locate?.(st,eu):null,cc=(d.card&&typeof d.card==='object'?d.card:null)||q?.item?.card||R.cardByName?.(raw(d.card));if(!cc){uncertain=true;return false}return /pendulum/i.test(low(cc?.type||''))});return{ok,unverified:!ok&&uncertain,reason:'Un Monstruo Péndulo que controlas debe haber sido destruido.',spec}}
 if(spec.kind==='BATTLE_DAMAGE_INFLICTED'){ok=all.some(e=>raw(e?.type)==='DAMAGE'&&low(evData644(e).type||evData644(e).damageType)==='battle');return{ok,unverified:false,reason:'Debe haberse infligido daño de batalla.',spec}}
 if(spec.kind==='ANY_MONSTER_DECLARES_ATTACK'||spec.kind==='SOURCE_TARGETED_FOR_ATTACK'||spec.kind==='CONTROLLED_MONSTER_TARGETED_FOR_ATTACK'){const attacks=all.filter(e=>raw(e?.type)==='ATTACK_DECLARE'),u=raw(uid),cn=low(c?.name||'');let uncertain=false;if(spec.kind==='ANY_MONSTER_DECLARES_ATTACK'){ok=attacks.length>0;reason='Debe haberse declarado un ataque.'}else if(spec.kind==='SOURCE_TARGETED_FOR_ATTACK'){ok=attacks.some(e=>{const d=evData644(e),du=raw(d.defender);if(u&&du)return u===du;if(!u&&st?.__alpha644SourceUnique&&cn)return low(d.defenderName||'')===cn;if(!u)uncertain=true;return false});reason='La carta fuente debe haber sido objetivo del ataque.'}else{ok=attacks.some(e=>Number(evData644(e).defenderController)===Number(p));reason='Un monstruo que controlas debe haber sido objetivo del ataque.'}return{ok,unverified:!ok&&uncertain,reason,spec}}
 if(spec.kind==='SOURCE_DESTROYS_OPPONENT_BY_BATTLE'||spec.kind==='SOURCE_DESTROYS_OPPONENT_BY_BATTLE_GY'||spec.kind==='SOURCE_BATTLED'||spec.kind==='SOURCE_BATTLED_OPPONENT_MONSTER'||spec.kind==='SOURCE_FLIPPED_FACEUP'||spec.kind==='YOU_TAKE_BATTLE_DAMAGE'){
  if(spec.kind==='YOU_TAKE_BATTLE_DAMAGE'){ok=all.some(e=>raw(e?.type)==='DAMAGE'&&low(evData644(e).type||evData644(e).damageType)==='battle'&&Number(evData644(e).player)===Number(p));return{ok,unverified:false,reason:'Debes haber recibido daño de batalla.',spec}}
  const u=raw(uid),cn=low(c?.name||'');let uncertain=false,same=(e,key)=>{const d=evData644(e),eu=raw(d[key]);if(u&&eu)return u===eu;if(!u&&st?.__alpha644SourceUnique&&cn)return low(d[key+'Name']||'')===cn;if(!u)uncertain=true;return false};
  if(spec.kind==='SOURCE_FLIPPED_FACEUP'){ok=all.some(e=>raw(e?.type)==='FLIP_FACE_UP_CANON'&&same(e,'uid'));reason='La carta fuente debe haber sido volteada boca arriba.'}
  else{const br=all.filter(e=>raw(e?.type)==='BATTLE_RESULT_CANON');if(spec.kind==='SOURCE_DESTROYS_OPPONENT_BY_BATTLE'||spec.kind==='SOURCE_DESTROYS_OPPONENT_BY_BATTLE_GY'){ok=br.some(e=>same(e,'attacker')&&evData644(e).defenderDestroyed===true&&(spec.kind!=='SOURCE_DESTROYS_OPPONENT_BY_BATTLE_GY'||low(evData644(e).defenderTo)==='gy'));reason='La carta fuente debe haber destruido al monstruo adversario por batalla.'}else{ok=br.some(e=>same(e,'attacker')||same(e,'defender'));reason='La carta fuente debe haber batallado con un monstruo adversario.'}}
  return{ok,unverified:!ok&&uncertain,reason,spec}
 }
 if(spec.kind==='SOURCE_NORMAL_OR_FLIP_SUMMONED'||spec.kind==='SOURCE_FLIP_SUMMONED'){const u=raw(uid),cn=low(c?.name||'');let uncertain=false;const same=e=>{const d=evData644(e),eu=raw(d.uid||e?.uid);if(u&&eu)return u===eu;if(!u&&st?.__alpha644SourceUnique&&cn)return low(d.card||d.item||'')===cn;if(!u)uncertain=true;return false};const types=spec.kind==='SOURCE_FLIP_SUMMONED'?['FLIP_SUMMON']:['NORMAL_SUMMON','FLIP_SUMMON'];ok=all.some(e=>types.includes(raw(e?.type))&&same(e));return{ok,unverified:!ok&&uncertain,reason:spec.kind==='SOURCE_FLIP_SUMMONED'?'La carta debe haber sido Invocada por Volteo.':'La carta debe haber sido Invocada Normalmente o por Volteo.',spec}}
 if(spec.kind==='SOURCE_INFLICTS_DIRECT_BATTLE_DAMAGE'){const u=raw(uid),cn=low(c?.name||'');let uncertain=false;for(const e of all){if(raw(e?.type)!=='DAMAGE')continue;const d=evData644(e);if(low(d.type||d.damageType)!=='battle'||d.direct!==true||Number(d.player)!==1-Number(p))continue;const au=raw(d.attacker);if(u&&au===u)return{ok:true,unverified:false,reason:'La carta infligió daño de batalla mediante ataque directo.',spec};if(!u&&st?.__alpha644SourceUnique&&cn&&low(d.attackerName||'')===cn)return{ok:true,unverified:false,reason:'La carta infligió daño de batalla mediante ataque directo.',spec};if(!u)uncertain=true}return{ok:false,unverified:uncertain||!u,reason:'No existe un evento demostrable de daño de batalla por ataque directo de la carta fuente.',spec}}
 if(spec.kind==='SOURCE_ST_DESTROYED_BY_OPPONENT_EFFECT'){let uncertain=false;for(const e of all){if(raw(e?.type)!=='DESTROY'||!sourceMatch644(e,uid,c,st))continue;const d=evData644(e),sp=sourcePlayer644(e),from=low(d.from),fp=Number(d.fromPlayer);if(from==='spelltrap'&&fp===Number(p)&&sp===1-Number(p)&&effectCause644(e))return{ok:true,unverified:false,reason:'La carta fue destruida desde su Zona de Mágicas y Trampas por efecto del adversario.',spec};if(sp===null||d.effect===undefined)uncertain=true}return{ok:false,unverified:uncertain,reason:'No se demuestra destrucción por efecto del adversario desde la Zona de Mágicas y Trampas del dueño.',spec}}
 if(spec.kind==='SOURCE_INFLICTS_BATTLE_DAMAGE'){const u=raw(uid),cn=low(c?.name||'');let uncertain=false;for(const e of all){if(raw(e?.type)!=='DAMAGE')continue;const d=evData644(e);if(low(d.type||d.damageType)!=='battle')continue;const au=raw(d.attacker);if(u&&au===u&&Number(d.player)===1-Number(p))return{ok:true,unverified:false,reason:'La carta infligió daño de batalla al adversario.',spec};if(!u&&st?.__alpha644SourceUnique&&cn&&low(d.attackerName||'')===cn&&Number(d.player)===1-Number(p))return{ok:true,unverified:false,reason:'La carta infligió daño de batalla al adversario.',spec};if(!u)uncertain=true}return{ok:false,unverified:uncertain||!u,reason:'No existe un evento demostrable de daño de batalla infligido por la carta fuente.',spec}}
 if(spec.kind==='SOURCE_DECLARES_ATTACK'||spec.kind==='SOURCE_INVOLVED_ATTACK'||spec.kind==='OPPONENT_DECLARES_ATTACK'||spec.kind==='OPPONENT_DIRECT_ATTACK'){
  const attacks=all.filter(e=>raw(e?.type)==='ATTACK_DECLARE'),u=raw(uid),cn=low(c?.name||'');let uncertain=false;
  const same=(e,key)=>{const d=evData644(e),eu=raw(d[key]);if(u&&eu)return u===eu;if(!u&&st?.__alpha644SourceUnique&&cn){const en=low(d[key+'Name']||'');return !!en&&en===cn}if(!u)uncertain=true;return false};
  if(spec.kind==='SOURCE_DECLARES_ATTACK'){ok=attacks.some(e=>same(e,'attacker'));reason='La carta fuente debe haber declarado el ataque.'}
  else if(spec.kind==='SOURCE_INVOLVED_ATTACK'){ok=attacks.some(e=>same(e,'attacker')||same(e,'defender'));reason='La carta fuente debe estar involucrada en el ataque declarado.'}
  else if(spec.kind==='OPPONENT_DECLARES_ATTACK'){ok=attacks.some(e=>Number(evData644(e).player)===1-Number(p));reason='Un monstruo del adversario debe haber declarado un ataque.'}
  else {ok=attacks.some(e=>Number(evData644(e).player)===1-Number(p)&&evData644(e).direct===true);reason='El adversario debe haber declarado un ataque directo.'}
  return{ok,unverified:!ok&&uncertain,reason,spec};
 }
 if(!match.length)return{ok:false,unverified:!(uid||st?.__alpha644SourceUnique),reason:(uid||st?.__alpha644SourceUnique)?'No existe un evento fuente compatible para esta condición.':'Falta identidad física de la carta fuente para verificar el disparo.',spec};
 if(spec.kind==='SOURCE_NORMAL_OR_SPECIAL_SUMMONED'){ok=any(e=>/^(NORMAL_SUMMON|SPECIAL_SUMMON)$/.test(raw(e?.type)));reason='La carta debe haber sido Invocada Normal o Especialmente.'}
 else if(spec.kind==='SOURCE_NORMAL_SUMMONED'){ok=any(e=>raw(e?.type)==='NORMAL_SUMMON');reason='La carta debe haber sido Invocada Normalmente.'}
 else if(spec.kind==='SOURCE_SPECIAL_SUMMONED'){ok=any(e=>raw(e?.type)==='SPECIAL_SUMMON');reason='La carta debe haber sido Invocada de Modo Especial.'}
 else if(spec.kind==='SOURCE_SUMMONED'){ok=any(e=>/SUMMON$/.test(raw(e?.type)));reason='La carta debe haber sido Invocada.'}
 else if(spec.kind==='SOURCE_EXTRA_SUMMONED'){ok=any(e=>raw(e?.type)==='SPECIAL_SUMMON'&&low(e?.data?.method)===low(spec.method));reason=`La carta debe haber sido Invocada por ${spec.method}.`}
 else if(spec.kind==='SOURCE_TRIBUTE_SUMMONED'){ok=any(e=>raw(e?.type)==='NORMAL_SUMMON'&&arr(e?.data?.tributes).length>0);reason='La carta debe haber sido Invocada por Tributo.'}
 else if(spec.kind==='SOURCE_SENT_GY'){ok=any(e=>low(evData644(e).to)==='gy'||/^(SEND|COST_SEND|COST_DISCARD|COST_TRIBUTE|TRIBUTE_SUMMON)$/.test(raw(e?.type)));reason='La carta debe haber sido enviada al GY.'}
 else if(spec.kind==='SOURCE_SENT_FIELD_GY'){ok=any(e=>['monster','spelltrap'].includes(low(evData644(e).from))&&low(evData644(e).to)==='gy');reason='La carta debe haber sido enviada del Campo al GY.'}
 else if(spec.kind==='SOURCE_BANISHED_EVENT'){ok=any(e=>low(evData644(e).to)==='banished'||/BANISH/.test(raw(e?.type)));reason='La carta debe haber sido desterrada.'}
 else if(spec.kind==='SOURCE_LEAVES_FIELD'){ok=any(e=>['monster','spelltrap'].includes(low(evData644(e).from))&&!['monster','spelltrap'].includes(low(evData644(e).to)));reason='La carta boca arriba debe haber dejado el Campo.'}
 else if(spec.kind==='SOURCE_SPECIAL_FROM'){ok=any(e=>raw(e?.type)==='SPECIAL_SUMMON'&&low(evData644(e).from)===spec.zone);reason=`La carta debe haber sido Invocada Especialmente desde ${spec.zone}.`}
 else if(spec.kind==='SOURCE_DESTROYED'){ok=match.some(isDestroy644);reason='La carta debe haber sido destruida.'}
 else if(spec.kind==='SOURCE_DESTROYED_BATTLE'){ok=match.some(e=>raw(e?.type)==='BATTLE_DESTROY');reason='La carta debe haber sido destruida en batalla.'}
 else if(spec.kind==='SOURCE_DESTROYED_EFFECT'){const ds=match.filter(isDestroy644);ok=ds.some(effectCause644);unverified=!ok&&ds.some(e=>raw(e?.type)==='DESTROY'&&!('effect' in evData644(e))&&!e?.cause);reason='La carta debe haber sido destruida por efecto de carta.'}
 else if(spec.kind==='SOURCE_SET_DESTROYED_EFFECT'){const ds=match.filter(isDestroy644);ok=ds.some(e=>effectCause644(e)&&low(evData644(e).from)==='spelltrap'&&evData644(e).faceUpBefore===false);unverified=!ok&&ds.some(e=>effectCause644(e)&&low(evData644(e).from)==='spelltrap'&&evData644(e).faceUpBefore===undefined);reason='La carta Colocada debe haber sido destruida por efecto de carta.'}
 else if(spec.kind==='ATTACK_DECLARE_TWO_MONSTERS'){const es=all.filter(e=>raw(e?.type)==='ATTACK_DECLARE');ok=es.some(e=>!!evData644(e).attacker&&!!evData644(e).defender);reason='Debe haberse declarado un ataque entre dos monstruos.'}
 else if(spec.kind==='SOURCE_DESTROYED_BATTLE_OR_EFFECT'){const ds=match.filter(isDestroy644);ok=ds.some(e=>raw(e?.type)==='BATTLE_DESTROY'||effectCause644(e));unverified=!ok&&ds.some(e=>raw(e?.type)==='DESTROY'&&!('effect' in evData644(e))&&!e?.cause);reason='La carta debe haber sido destruida por batalla o efecto de carta.'}
 else if(spec.kind==='SOURCE_DESTROYED_SENT_GY'){ok=match.some(e=>isDestroy644(e)&&(low(evData644(e).to)==='gy'||raw(e?.type)==='BATTLE_DESTROY'));reason='La carta debe haber sido destruida y enviada al GY.'}
 else if(spec.kind==='SOURCE_DESTROYED_BATTLE_SENT_GY'){ok=match.some(e=>raw(e?.type)==='BATTLE_DESTROY'&&(low(evData644(e).to)==='gy'||!evData644(e).to));reason='La carta debe haber sido destruida en batalla y enviada al GY.'}
 else if(spec.kind==='SOURCE_SENT_GY_BY_EFFECT'){const gs=match.filter(e=>low(evData644(e).to)==='gy'||/^(SEND|DESTROY)$/.test(raw(e?.type)));ok=gs.some(effectCause644);unverified=!ok&&gs.some(e=>!('effect' in evData644(e))&&!e?.cause);reason='La carta debe haber sido enviada al GY por efecto de carta.'}
 else if(spec.kind==='SOURCE_TRIBUTED'){ok=match.some(e=>/TRIBUTE/.test(raw(e?.type))||/TRIBUTE/.test(raw(evData644(e).reason).toUpperCase()));reason='La carta debe haber sido Sacrificada.'}
 else if(spec.kind==='SOURCE_SUMMONED_THIS_TURN'){ok=match.some(e=>spec.methods.includes(raw(e?.type))&&Number(e?.turn??turn)===turn);reason='La carta debe haber sido Invocada por el método requerido este turno.'}
 else if(spec.kind==='SOURCE_WAS_SPECIAL_SUMMONED'){ok=match.some(e=>raw(e?.type)==='SPECIAL_SUMMON');reason='La carta debe haber sido Invocada de Modo Especial.'}
 else if(spec.kind==='SOURCE_SENT_GY_THIS_TURN'){const inGy=loc?loc.z==='gy':true,hit=match.some(e=>(low(evData644(e).to)==='gy'||/^(SEND|DESTROY|BATTLE_DESTROY|COST_SEND|COST_DISCARD|COST_TRIBUTE)$/.test(raw(e?.type)))&&Number(e?.turn??turn)===turn);ok=inGy&&hit;unverified=!uid&&!st?.__alpha644SourceUnique;reason='La carta debe estar en el GY por haber sido enviada allí este turno.'}
 else if(spec.kind==='SOURCE_SPECIAL_BY_NAMED_FAMILY'){const ss=match.filter(e=>raw(e?.type)==='SPECIAL_SUMMON');ok=ss.some(e=>sourceFamily644(e,spec.value));unverified=!ok&&ss.some(e=>![evData644(e).source,evData644(e).sourceCard,evData644(e).sourceName,e?.source,e?.cause?.card,e?.cause?.source].some(Boolean));reason=`La Invocación Especial debe provenir del efecto de un monstruo de la familia "${spec.value}".`}
 else if(spec.kind==='SOURCE_DESTROYED_BY_OPPONENT_CARD'){const ds=match.filter(e=>/^(DESTROY|BATTLE_DESTROY)$/.test(raw(e?.type)));for(const e of ds){const sp=sourcePlayer644(e);if(sp===1-Number(p)){ok=true;break}if(sp===null)unverified=true}reason='La carta en posesión de su dueño debe haber sido destruida por una carta del adversario.'}
 else if(spec.kind==='SOURCE_LEAVES_BY_OPPONENT_EFFECT'){const ls=match.filter(e=>['monster','spelltrap'].includes(low(evData644(e).from))&&!['monster','spelltrap'].includes(low(evData644(e).to)));for(const e of ls){const sp=sourcePlayer644(e),eff=evData644(e).effect===true||e?.cause?.effect===true;if(sp===1-Number(p)&&eff){ok=true;break}if(sp===null||evData644(e).effect===undefined)unverified=true}reason='La carta boca arriba debe haber dejado el Campo por efecto de una carta del adversario.'}
 else return{ok:false,unverified:true,reason:'Condición de evento sin evaluador exacto en Alpha644.',spec};
 return{ok,unverified:!ok&&unverified,reason,spec}}
function family644(x,v){const o=obj(x),n=low(o?.name),a=low(o?.archetype),as=arr(o?.archetypes).map(low);return n.includes(v)||a.includes(v)||as.some(z=>z.includes(v))}
function stateAllowed644(st,p,spec){const mineM=arr(st?.zones?.[p]?.monster),oppM=arr(st?.zones?.[1-p]?.monster),mineF=field(st,p),oppF=field(st,1-p),both=[...field(st,0),...field(st,1)],hand=arr(st?.zones?.[p]?.hand),gy=arr(st?.zones?.[p]?.gy),ban=arr(st?.zones?.[p]?.banished);if(spec.kind==='USAGE_CHOICE_ONLY'||spec.kind==='RESOLUTION_CONTINUATION')return{ok:true,unverified:false,reason:'Fragmento de uso/resolución; no añade una condición de activación independiente.',spec};if(spec.kind==='MAIN_MONSTER_ZONE_EMPTY'){const slots=mineM.map(x=>raw(x?.__alpha307Slot??x?.slot??x?.fieldSlot??''));if(slots.some(x=>!x))return{ok:false,unverified:true,reason:'Falta metadato de zona para distinguir Main Monster Zone de Extra Monster Zone.',spec};const main=slots.filter(x=>!/EMZ|EXTRA/i.test(x));return{ok:main.length===0,unverified:false,reason:'No debes controlar monstruos en tus Main Monster Zones.',spec}}let ok=false,reason='';
 const ph=raw(st?.phase).toUpperCase(),active=Number(st?.activePlayer);
 if(spec.kind==='CONTEXT_START_YOUR_MAIN_PHASE_1'){const open=st?.__alpha644Main1StartOpen===true||(st?.__alpha644Main1StartOpen==null&&Number(st?.analysis?.actions||0)===0);ok=ph==='MAIN 1'&&active===Number(p)&&open;reason='Debe ser el inicio exacto de tu Main Phase 1, antes de realizar otra acción.'}
 else if(spec.kind==='CONTEXT_YOUR_MAIN_PHASE_1'){ok=ph==='MAIN 1'&&active===Number(p);reason='Debe ser tu Main Phase 1.'}
 else if(spec.kind==='CONTEXT_OPP_MAIN_PHASE'){ok=/^MAIN(?:\s|$)/.test(ph)&&active===1-Number(p);reason='Debe ser la Main Phase del adversario.'}
 else if(spec.kind==='CONTEXT_OPP_END_PHASE'){ok=(ph==='END'||ph==='END PHASE')&&active===1-Number(p);reason='Debe ser la End Phase del adversario.'}
 else if(spec.kind==='CONTEXT_YOUR_BATTLE_START'){ok=ph==='BATTLE START'&&active===Number(p);reason='Debe ser el inicio de tu Battle Phase.'}
 else if(spec.kind==='CONTEXT_OPP_BATTLE_START'){ok=ph==='BATTLE START'&&active===1-Number(p);reason='Debe ser el inicio de la Battle Phase del adversario.'}
 else if(spec.kind==='CONTEXT_DAMAGE_STEP_START'){ok=ph==='DAMAGE STEP START';reason='Debe ser el inicio del Damage Step.'}
 else if(spec.kind==='YOU_NO_SPELLTRAPS'){ok=arr(st?.zones?.[p]?.spelltrap).length===0;reason='No debes controlar Cartas Mágicas/de Trampa.'}
 else if(spec.kind==='CONTEXT_YOUR_MAIN_PHASE'){ok=/^MAIN(?:\s|$)/.test(ph)&&active===Number(p);reason='Debe ser tu Main Phase.'}
 else if(spec.kind==='CONTEXT_MAIN_PHASE'){ok=/^MAIN(?:\s|$)/.test(ph);reason='Debe ser una Main Phase.'}
 else if(spec.kind==='CONTEXT_YOUR_STANDBY_PHASE'){ok=ph==='STANDBY'&&active===Number(p);reason='Debe ser tu Standby Phase.'}
 else if(spec.kind==='CONTEXT_OPP_STANDBY_PHASE'){ok=ph==='STANDBY'&&active===1-Number(p);reason='Debe ser la Standby Phase del adversario.'}
 else if(spec.kind==='CONTEXT_STANDBY_PHASE'){ok=ph==='STANDBY';reason='Debe ser la Standby Phase.'}
 else if(spec.kind==='CONTEXT_YOUR_END_PHASE'){ok=(ph==='END'||ph==='END PHASE')&&active===Number(p);reason='Debe ser tu End Phase.'}
 else if(spec.kind==='CONTEXT_END_PHASE'){ok=ph==='END'||ph==='END PHASE';reason='Debe ser la End Phase.'}
 else if(spec.kind==='CONTEXT_YOUR_BATTLE_PHASE'){ok=/^(?:BATTLE|DAMAGE|BEFORE DAMAGE|AFTER DAMAGE|END OF DAMAGE)/.test(ph)&&active===Number(p);reason='Debe ser tu Battle Phase.'}
 else if(spec.kind==='CONTEXT_OPP_BATTLE_PHASE'){ok=/^(?:BATTLE|DAMAGE|BEFORE DAMAGE|AFTER DAMAGE|END OF DAMAGE)/.test(ph)&&active===1-Number(p);reason='Debe ser la Battle Phase del adversario.'}
 else if(spec.kind==='CONTEXT_BATTLE_PHASE'){ok=/^(?:BATTLE|DAMAGE|BEFORE DAMAGE|AFTER DAMAGE|END OF DAMAGE)/.test(ph);reason='Debe ser la Battle Phase.'}
 else if(spec.kind==='CONTEXT_OPP_TURN'){ok=active===1-Number(p);reason='Debe ser el turno del adversario.'}
 else if(spec.kind==='CONTEXT_YOUR_TURN'){ok=active===Number(p);reason='Debe ser tu turno.'}
 else if(spec.kind==='CONTEXT_EITHER_TURN'){ok=active===0||active===1;reason='Debe existir un turno activo.'}
 else if(spec.kind==='CONTEXT_BATTLE_START'){ok=ph==='BATTLE START';reason='Debe ser el inicio de la Battle Phase.'}
 else if(spec.kind==='CONTEXT_BATTLE_END'){ok=ph==='BATTLE END';reason='Debe ser el final de la Battle Phase.'}
 else if(spec.kind==='CONTEXT_END_DAMAGE_STEP'){ok=ph==='END OF DAMAGE STEP';reason='Debe ser el final del Damage Step.'}
 else if(spec.kind==='CONTEXT_AFTER_DAMAGE_CALC'){ok=ph==='AFTER DAMAGE CALCULATION';reason='Debe ser después del cálculo de daño.'}
 else if(spec.kind==='CONTEXT_BEFORE_DAMAGE_CALC'){ok=ph==='BEFORE DAMAGE CALCULATION';reason='Debe ser antes del cálculo de daño.'}
 else if(spec.kind==='CONTEXT_DAMAGE_CALC'){ok=ph==='DAMAGE CALCULATION';reason='Debe ser durante el cálculo de daño.'}
 else if(spec.kind==='YOU_NO_MONSTERS'){ok=mineM.length===0;reason='No debes controlar monstruos.'}
 else if(spec.kind==='YOU_NO_FACEUP_MONSTERS'){ok=mineM.filter(x=>x?.faceUp!==false).length===0;reason='No debes controlar monstruos boca arriba.'}
 else if(spec.kind==='CONTROL_FACEUP_NAMED_COUNT'){ok=mineF.filter(x=>x?.faceUp!==false&&(low(obj(x)?.name)===spec.value||family644(x,spec.value))).length===Number(spec.n);reason=`Debes controlar exactamente ${spec.n} carta(s) boca arriba de la familia/nombre "${spec.value}".`}
 else if(spec.kind==='EXACT_NAME_NOT_ON_FIELD'){ok=!both.some(x=>low(obj(x)?.name)===spec.value);reason=`"${spec.value}" no debe estar en el Campo.`}
 else if(spec.kind==='YOUR_FIELD_ZONE_NAME_ABSENT'||spec.kind==='YOUR_FIELD_ZONE_EXACT_NAME'){const fs=arr(st?.zones?.[p]?.spelltrap).filter(x=>x?.flags?.fieldZone===true||x?.fieldZone===true||low(obj(x)?.race)==='field'||/field spell/.test(low(obj(x)?.type)));const hit=fs.some(x=>low(obj(x)?.name)===spec.value);ok=spec.kind==='YOUR_FIELD_ZONE_EXACT_NAME'?hit:!hit;reason=spec.kind==='YOUR_FIELD_ZONE_EXACT_NAME'?`"${spec.value}" debe estar en tu Zona del Campo.`:`"${spec.value}" no debe estar en tu Zona del Campo.`}
 else if(spec.kind==='YOU_NO_CARDS'){ok=mineF.length===0;reason='No debes controlar cartas.'}
 else if(spec.kind==='YOU_MONSTERS_LE'){ok=mineM.length<=spec.n;reason=`Debes controlar ${spec.n} o menos monstruos.`}
 else if(spec.kind==='OPP_MONSTERS_LE'){ok=oppM.length<=spec.n;reason=`El adversario debe controlar ${spec.n} o menos monstruos.`}
 else if(spec.kind==='YOU_FIELD_GE'){ok=mineF.length>=spec.n;reason=`Debes controlar ${spec.n} o más cartas.`}
 else if(spec.kind==='OPP_FIELD_GE'){ok=oppF.length>=spec.n;reason=`El adversario debe controlar ${spec.n} o más cartas.`}
 else if(spec.kind==='YOU_FIELD_LE'){ok=mineF.length<=spec.n;reason=`Debes controlar ${spec.n} o menos cartas.`}
 else if(spec.kind==='OPP_FIELD_LE'){ok=oppF.length<=spec.n;reason=`El adversario debe controlar ${spec.n} o menos cartas.`}
 else if(spec.kind==='HAND_EMPTY'){ok=hand.length===0;reason='Tu mano debe estar vacía.'}
 else if(spec.kind==='HAND_EQ'){ok=hand.length===spec.n;reason=`Debes tener exactamente ${spec.n} cartas en la mano.`}
 else if(spec.kind==='GY_CARDS_LE'){ok=gy.length<=spec.n;reason=`Debes tener ${spec.n} o menos cartas en el GY.`}
 else if(spec.kind==='GY_MONSTERS_LE'){ok=gy.filter(isMonster).length<=spec.n;reason=`Debes tener ${spec.n} o menos monstruos en el GY.`}
 else if(spec.kind==='BANISHED_GE'){ok=ban.length>=spec.n;reason=`Debes tener ${spec.n} o más cartas desterradas.`}
 else if(spec.kind==='BANISHED_LE'){ok=ban.length<=spec.n;reason=`Debes tener ${spec.n} o menos cartas desterradas.`}
 else if(spec.kind==='CONTROL_EXACT_NAME'){ok=mineF.some(x=>low(obj(x)?.name)===spec.value);reason=`Debes controlar "${spec.value}".`}
 else if(spec.kind==='OPP_CONTROL_EXACT_NAME'){ok=oppF.some(x=>low(obj(x)?.name)===spec.value);reason=`El adversario debe controlar "${spec.value}".`}
 else if(spec.kind==='CONTROL_NAMED_FAMILY_MONSTER'){ok=mineM.some(x=>family644(x,spec.value));reason=`Debes controlar un monstruo de la familia "${spec.value}".`}
 else if(spec.kind==='OPP_CONTROL_NAMED_FAMILY_MONSTER'){ok=oppM.some(x=>family644(x,spec.value));reason=`El adversario debe controlar un monstruo de la familia "${spec.value}".`}
 else if(spec.kind==='CONTROL_ATTRIBUTE'){ok=mineM.some(x=>low(obj(x)?.attribute)===spec.value);reason=`Debes controlar un monstruo ${spec.value.toUpperCase()}.`}
 else if(spec.kind==='OPP_CONTROL_ATTRIBUTE'){ok=oppM.some(x=>low(obj(x)?.attribute)===spec.value);reason=`El adversario debe controlar un monstruo ${spec.value.toUpperCase()}.`}
 else if(spec.kind==='CONTROL_RACE'){ok=mineM.some(x=>low(obj(x)?.race)===spec.value);reason=`Debes controlar un monstruo ${spec.value}.`}
 else if(spec.kind==='OPP_CONTROL_RACE'){ok=oppM.some(x=>low(obj(x)?.race)===spec.value);reason=`El adversario debe controlar un monstruo ${spec.value}.`}
 else if(spec.kind==='OPP_MORE_MONSTERS'){ok=oppM.length>mineM.length;reason='El adversario debe controlar más monstruos que tú.'}
 else if(spec.kind==='OPP_HAS_MONSTER'){ok=oppM.length>0;reason='El adversario debe controlar al menos 1 monstruo.'}
 else if(spec.kind==='NO_NAMED_FAMILY_MONSTER_FIELD'){ok=![...arr(st?.zones?.[0]?.monster),...arr(st?.zones?.[1]?.monster)].some(x=>family644(x,spec.value));reason=`No debe haber un monstruo de la familia "${spec.value}" en el Campo.`}
 else if(spec.kind==='EXACT_NAME_ON_FIELD'){ok=both.some(x=>low(obj(x)?.name)===spec.value);reason=`"${spec.value}" debe estar en el Campo.`}
 else if(spec.kind==='EXACT_NAME_NOT_FACEUP_FIELD'){ok=!both.some(x=>low(obj(x)?.name)===spec.value&&x?.faceUp!==false);reason=`"${spec.value}" no debe estar boca arriba en el Campo.`}
 else return{ok:false,unverified:true,reason:'Condición de estado sin evaluador exacto en Alpha644.',spec};
 return{ok,unverified:false,reason,spec}}
function evalConditionSpec644(st,p,spec,uid,c){if(!spec)return{ok:true,unverified:false,spec:null};if(!spec.exact)return{ok:false,unverified:true,reason:'Condición no representada exactamente por Alpha644.',spec};if(spec.kind==='ALL'){const parts=spec.items.map(x=>evalConditionSpec644(st,p,x,uid,c)),bad=parts.find(x=>!x.ok);return bad?{...bad,spec}:{ok:true,unverified:false,reason:'Todas las condiciones compuestas se cumplen.',spec,parts}}if(spec.kind==='ANY'){const parts=spec.items.map(x=>evalConditionSpec644(st,p,x,uid,c)),ok=parts.find(x=>x.ok);if(ok)return{ok:true,unverified:false,reason:'Al menos una condición alternativa se cumple.',spec,parts};const unv=parts.some(x=>x.unverified);return{ok:false,unverified:unv,reason:unv?'Alguna rama OR no es verificable exactamente.':'Ninguna condición alternativa se cumple.',spec,parts}}if(!spec.alpha644&&typeof A620.conditionAllowed620==='function')return A620.conditionAllowed620(st,p,{condition:spec.text||''},uid,c);if(/^SOURCE_/.test(spec.kind||'')||/^(OPPONENT_DECLARES_ATTACK|OPPONENT_DIRECT_ATTACK|OPPONENT_MONSTER_EFFECT_ACTIVATED|MONSTER_EFFECT_ACTIVATED|CARD_OR_EFFECT_ACTIVATED|ANY_MONSTER_DECLARES_ATTACK|CONTROLLED_MONSTER_TARGETED_FOR_ATTACK|YOU_TAKE_BATTLE_DAMAGE|OPPONENT_CARD_OR_EFFECT_ACTIVATED|OPPONENT_TRAP_ACTIVATED|OPPONENT_SPELL_ACTIVATED|SOURCE_ATTACKS_FACEDOWN_DEFENSE|YOU_PENDULUM_SUMMON|CONTROLLED_PENDULUM_DESTROYED|BATTLE_DAMAGE_INFLICTED|CONTROLLED_CARD_DESTROYED_BATTLE_OR_EFFECT|LEVEL5PLUS_SPECIAL_SUMMONED|SOURCE_DESTROYED_PENDULUM_ZONE|OPPONENT_SPELL_TRAP_OR_MONSTER_EFFECT_ACTIVATED|NAMED_FAMILY_SPELL_OR_EFFECT_ACTIVATED)$/.test(spec.kind||''))return eventAllowed644(st,p,spec,uid,c);return stateAllowed644(st,p,spec)}
function conditionAllowed644(st,p,e,uid,c){const text=e?.condition||'';if(!raw(text).trim())return A620.conditionAllowed620?.(st,p,e,uid,c)||{ok:true,spec:null};return evalConditionSpec644(st,p,conditionSpec644(text),uid,c)}

/* ---------- canonical attack declaration / battle window ---------- */
let BASE_DAMAGE_644=null;
function nextEventId644(st){return Math.max(0,...arr(st?.events).map(e=>Number(e?.id)||0))+1}
function pushCanonicalEvent644(st,type,data={},phase=null){const ev={id:nextEventId644(st),type,data:{...data},turn:Number(st?.turn)||1,phase:phase||raw(st?.phase),activePlayer:Number(st?.activePlayer)||0,priority:Number(st?.priority??st?.activePlayer)||0,alpha644:true};st.events=arr(st?.events);st.events.push(ev);st.lastEvent=ev;return ev}
function pushAttackEvent644(st,data){return pushCanonicalEvent644(st,'ATTACK_DECLARE',data,'BATTLE STEP')}
function attackText644(e){return low(`${e?.condition||''} ${e?.activation||''} ${e?.raw||''}`)}
function attackTrigger644(e){const s=attackText644(e);return /declares? an attack|attack is declared|declared an attack|direct attack/.test(s)}
function queueAttackTriggers644(st,ev){const added=[];st.triggerQueue=arr(st?.triggerQueue);for(let p=0;p<2;p++)for(const z of ['monster','spelltrap','gy','banished','hand'])for(const item of arr(st?.zones?.[p]?.[z])){if(item?.negatedEffect||item?.disabled)continue;let parsed=null;try{parsed=R.parseCard?.(item?.card)||null}catch(_){}for(const e of arr(parsed?.effects)){if(exactBattleIndestructible1165(item)==='BATTLE_INDESTRUCTIBLE_23205979'&&/this card inflicts battle damage/i.test(attackText644(e)))continue;if(!attackTrigger644(e))continue;if(!e?.timing?.trigger&&!/^\s*(?:if|when)\b/.test(low(e?.condition||'')))continue;const key=`${item?.uid}|${e?.id}|${ev.id}`;if(st.triggerQueue.some(x=>`${x?.uid}|${x?.effectId}|${x?.createdEvent}`===key))continue;const mandatory=!/you can|puedes|optional|opcional/.test(attackText644(e));const tr={player:p,uid:item?.uid,effectId:e?.id,mandatory,createdEvent:ev.id,controller:p,sourceZone:z,alpha644:true};st.triggerQueue.push(tr);added.push(tr)}}return added}
function cardText644(x){const c=obj(x);return low(`${c?.name||''} ${c?.desc||c?.description||c?.text||''}`)}
function effectiveAtk644(st,item){try{const v=W.YGOAlpha313Core?.effectiveStats?.(st,item?.uid);if(v&&Number.isFinite(Number(v.atk)))return Math.max(0,Number(v.atk)||0)}catch(_){}return Math.max(0,Number(item?.card?.atk)||0)}
function attackCountState644(st,uid){st.__alpha644AttackCounts=st.__alpha644AttackCounts&&typeof st.__alpha644AttackCounts==='object'?st.__alpha644AttackCounts:{};const turn=Number(st?.turn)||1,k=raw(uid),cur=st.__alpha644AttackCounts[k];if(!cur||Number(cur.turn)!==turn)st.__alpha644AttackCounts[k]={turn,count:0};return st.__alpha644AttackCounts[k]}
function attackLimit644(st,item){const turn=Number(st?.turn)||1,f=item?.flags||{};if(Number(f.alpha613AttackLimitTurn)===turn)return Math.max(1,Number(f.alpha613AttackLimit)||1);return 1}
function directPermission644(st,a){const ap=Number(st?.activePlayer)||0,opp=arr(st?.zones?.[1-ap]?.monster);if(!opp.length)return{ok:true,natural:true};const t=cardText644(a?.item);if(!/can attack (?:your )?opponent directly|can attack directly/.test(t))return{ok:false,reason:'No se puede declarar un ataque directo mientras el adversario controla monstruos.'};const sentence=t.split(/[.!?]/).find(x=>/can attack (?:your )?opponent directly|can attack directly/.test(x))||'';if(/\bif\b|\bwhile\b|\bonly if\b|\bunless\b|\bas long as\b/.test(sentence))return{ok:false,unverified:true,reason:'La capacidad de ataque directo depende de una condición que requiere handler exacto.'};return{ok:false,unverified:true,reason:'El permiso de atacar directamente con monstruos rivales depende de un efecto de carta todavía no acreditado por el motor.',alpha1149Bounded:true}}
function targetPermission644(st,a,d){const ap=Number(st?.activePlayer)||0,opp=1-ap,dt=cardText644(d?.item);if(/cannot be targeted for attacks|cannot be selected as an attack target/.test(dt))return{ok:false,reason:'El monstruo defensor no puede ser seleccionado como objetivo de ataque.'};const enemyField=[...arr(st?.zones?.[opp]?.monster),...arr(st?.zones?.[opp]?.spelltrap)];const highestRule=enemyField.some(x=>x?.faceUp!==false&&/opponent(?:'s)? monsters can only attack your monsters with the highest atk|monsters your opponent controls can only attack your monsters with the highest atk/.test(cardText644(x)));if(highestRule){const mons=arr(st?.zones?.[opp]?.monster).filter(x=>x?.faceUp!==false),max=Math.max(0,...mons.map(x=>effectiveAtk644(st,x)));if(effectiveAtk644(st,d?.item)!==max)return{ok:false,reason:'Un efecto continuo obliga a atacar un monstruo con el ATK más alto.'}}return{ok:true}}
// Alpha 1167: 0 LP ends this bounded duel at the instant damage is applied.
// No After Damage Calculation effect may activate after lethal battle damage.
function finishDuelOnLethal1167(st,dec,details){
 if(!Array.isArray(st?.lp)||st.lp.length!==2||!st.lp.some(v=>v===0))return null;
 const winner=st.lp[0]===0?(st.lp[1]===0?null:1):0;
 const loser=winner===null?null:1-winner;
 const ap=Number(st.activePlayer)||0;
 const effectDamage=details.effectDamage||0;
 st.phase='DUEL END';st.window={kind:'DUEL END',open:false,alpha1167:true};st.priority=ap;
 const result={attacker:dec.attackerUid,attackerName:details.attackerName||'',attackerController:ap,
  defender:dec.defenderUid||null,defenderName:details.defenderName||'',
  defenderController:dec.defenderUid?1-ap:null,direct:!!details.direct,
  attackerDestroyed:false,defenderDestroyed:false,attackerTo:'monster',
  defenderTo:dec.defenderUid?'monster':null,damage:details.damage||0,
  damagedPlayer:details.damagedPlayer??null,
  ...(effectDamage?{effectDamage,effectDamagedPlayer:details.effectDamagedPlayer}:{}),
  endedDuel:true,winner,alpha1167:true};
 pushCanonicalEvent644(st,'BATTLE_RESULT_CANON',result,'DUEL END');
 pushCanonicalEvent644(st,'DUEL_END_CANON',{winner,loser,
  reason:'LP_ZERO',sourceDamageType:effectDamage?'EFFECT':'BATTLE',
  lp:[...st.lp],alpha1167:true},'DUEL END');
 st.__alpha1167DuelEnded={winner,loser,reason:'LP_ZERO',turn:st.turn};
 dec.consumed=true;delete st.__alpha644AttackDeclaration;
 st.combat={...(st.combat||{}),attackerUid:dec.attackerUid,defenderUid:dec.defenderUid||null,stage:'DUEL_ENDED'};
 return{ok:true,complete:true,phase:'DUEL END',endedDuel:true,winner,
  damage:details.damage||0,damagedPlayer:details.damagedPlayer??null,
  effectDamage,effectDamagedPlayer:effectDamage?details.effectDamagedPlayer:null,
  destroyed:[],direct:!!details.direct,alpha1167:true};
}
// Alpha 1168: terminal-duel invariant on exposed core transition entrypoints.
// This is deliberately scoped to the canonical action paths; it is not a
// blanket certificate for all third-party / older effect-specific handlers.
function terminalActionGate1168(st){
 if(!st||typeof st!=='object')return null;
 if(st.__alpha1167DuelEnded||raw(st.phase).toUpperCase()==='DUEL END'||
    Array.isArray(st.lp)&&st.lp.length===2&&st.lp.some(v=>v===0))
  return{ok:false,endedDuel:true,alpha1168:true,reason:'El duelo ha terminado: no se pueden ejecutar más acciones.'};
 return null;
}
function positiveLifePoints1168(st){
 return Array.isArray(st?.lp)&&st.lp.length===2&&st.lp.every(v=>typeof v==='number'&&Number.isSafeInteger(v)&&v>0);
}
function attackEligibility644(st,attackerUid,defenderUid=null){
 const terminal1168=terminalActionGate1168(st);if(terminal1168)return terminal1168;
 if(!positiveLifePoints1168(st))return{ok:false,unverified:true,alpha1168:true,reason:'LP inválidos: no se consume un ataque sin acreditar primero los Life Points.'};
 if(st?.__alpha1167DuelEnded||Array.isArray(st?.lp)&&st.lp.some(v=>v===0))
  return{ok:false,endedDuel:true,reason:'El duelo ha terminado porque un jugador tiene 0 LP.'};const a=R.locate?.(st,attackerUid);if(!a||a.z!=='monster')return{ok:false,reason:'El atacante no está en una Zona de Monstruos.'};const ap=Number(st?.activePlayer)||0,ctrl=Number(a?.item?.controller??a?.p),turn=Number(st?.turn)||1,f=a?.item?.flags||{};if(ctrl!==ap)return{ok:false,reason:'Sólo el jugador de turno puede declarar este ataque.'};const ph=raw(st?.phase).toUpperCase();
if(turn===1)return{ok:false,reason:'No existe Battle Phase en el primer turno del duelo.'};
if(ph!=='BATTLE STEP')return{ok:false,reason:'La declaración de ataque requiere exactamente BATTLE STEP.'};
if(a?.item?.faceUp===false)return{ok:false,reason:'Un monstruo boca abajo no puede declarar ataques.'};
if(arr(st?.chain).length||arr(st?.triggerQueue).length||arr(st?.pendingTriggers).length)return{ok:false,pending:true,reason:'Hay cadenas o disparadores pendientes antes de declarar un ataque.'};if(String(a?.item?.position||'ATK').toUpperCase().includes('DEF'))return{ok:false,reason:'Un monstruo en Posición de Defensa no puede declarar un ataque.'};if(a?.item?.cannotAttack===true||f.cannotAttack===true||Number(f.alpha613CannotAttackTurn)===turn)return{ok:false,reason:'El estado registra que el monstruo no puede atacar este turno.'};const count=attackCountState644(st,attackerUid),limit=attackLimit644(st,a.item);if(Number(count.count||0)>=limit)return{ok:false,reason:`El monstruo ya alcanzó su límite de ${limit} ataque(s) este turno.`,alpha644AttackLimit:true};if(defenderUid){const d=R.locate?.(st,defenderUid);if(!d||d.z!=='monster'||Number(d?.item?.controller??d?.p)===ap)return{ok:false,reason:'El objetivo de ataque debe ser un monstruo adversario válido.'};const tp=targetPermission644(st,a,d);if(!tp.ok)return tp;return{ok:true,attacker:a,defender:d,limit,count:Number(count.count||0)}}if(Number(f.alpha613CannotDirectAttackTurn)===turn)return{ok:false,reason:'El monstruo no puede atacar directamente este turno.',alpha613DirectAttackLock:true};const dp=directPermission644(st,a);if(!dp.ok)return dp;return{ok:true,attacker:a,defender:null,direct:true,limit,count:Number(count.count||0),directPermission:dp}}
function markAttackDeclaration644(st,uid){const c=attackCountState644(st,uid);c.count=Number(c.count||0)+1;c.lastEventId=Number(st?.lastEvent?.id)||null;return c.count}
function declareAttack644(st,attackerUid,defenderUid=null){const v=attackEligibility644(st,attackerUid,defenderUid);if(!v.ok)return v;if(st?.__alpha644AttackDeclaration&&!st.__alpha644AttackDeclaration.consumed)return{ok:false,reason:'Ya existe una declaración de ataque pendiente.',pending:true};const a=v.attacker?.item,d=v.defender?.item||null,ev=pushAttackEvent644(st,{player:Number(st.activePlayer)||0,attacker:raw(attackerUid),attackerName:raw(a?.card?.name||''),defender:defenderUid?raw(defenderUid):null,defenderName:raw(d?.card?.name||''),attackerController:Number(a?.controller??st.activePlayer),defenderController:defenderUid?Number(d?.controller??(1-Number(st.activePlayer))):null,defenderFaceUp:defenderUid?(d?.faceUp!==false):null,defenderPosition:defenderUid?raw(d?.position||'ATK'):null,direct:!defenderUid});markAttackDeclaration644(st,attackerUid);const queued=queueAttackTriggers644(st,ev);st.combat={...(st.combat||{}),attackerUid:raw(attackerUid),defenderUid:defenderUid?raw(defenderUid):null,declarationEventId:ev.id,declared:true,stage:-1};st.phase='BATTLE STEP';st.priority=1-(Number(st.activePlayer)||0);st.window={kind:'ATTACK DECLARATION',open:true,alpha644:true,eventId:ev.id};let segoc=null;if(queued.length&&typeof R.openTriggerWindow==='function'){try{segoc=R.openTriggerWindow(st)}catch(_){}}st.__alpha644AttackDeclaration={eventId:ev.id,attackerUid:raw(attackerUid),defenderUid:defenderUid?raw(defenderUid):null,direct:!defenderUid,queued:queued.length,consumed:false,turnAtDeclaration:Number(st.turn),playerAtDeclaration:Number(st.activePlayer),opponentMonsterIdsAtDeclaration:arr(st.zones?.[1-Number(st.activePlayer)]?.monster).map(x=>raw(x?.uid))};bindAttackPhysical1154(st.__alpha644AttackDeclaration,a,d);return{ok:true,pending:true,event:ev,queued,segoc,window:st.window,direct:!defenderUid}}
function attackResponsesPending644(st){return arr(st?.chain).length>0||arr(st?.triggerQueue).length>0||arr(st?.pendingTriggers).length>0}
function effectiveAtk644(st,item){try{const x=W.YGOAlpha313Core?.effectiveStats?.(st,item?.uid);if(Number.isFinite(Number(x?.atk)))return Math.max(0,Number(x.atk))}catch(_){}const n=Number(item?.card?.atk);return Number.isFinite(n)?Math.max(0,n):null}
function damageRisk644(st){const risky=[];for(let p=0;p<2;p++)for(const z of ['hand','monster','spelltrap','gy','banished'])for(const item of arr(st?.zones?.[p]?.[z])){let pc=null;try{pc=R.parseCard?.(item?.card)||null}catch(_){}const text=low(`${item?.card?.desc||item?.card?.description||''} ${arr(pc?.effects).map(e=>`${e?.condition||''} ${e?.activation||''} ${e?.resolution||''} ${e?.raw||''}`).join(' ')}`);if(/battle damage[^.]{0,90}(?:becomes|is 0|zero|half|halved|double|instead|no battle damage|reduce|increase)|(?:halve|double|prevent|reduce|no) [^.]{0,60}battle damage|damage you take[^.]{0,90}(?:0|half|halved|double|instead|reduce)/.test(text))risky.push({p,z,uid:item?.uid,reason:'BATTLE_DAMAGE_MODIFIER'});for(const e of arr(pc?.effects)){if(e?.timing?.quick&&/(damage step|damage calculation|battle phase|battle step)/i.test(`${e?.condition||''} ${e?.activation||''} ${e?.raw||''}`))risky.push({p,z,uid:item?.uid,reason:'DAMAGE_STEP_QUICK_EFFECT'})}if(p===1-Number(st?.activePlayer)&&z==='spelltrap'&&item?.faceUp===false)risky.push({p,z,uid:item?.uid,reason:'SET_SPELL_TRAP_UNKNOWN_RESPONSE'})}return risky}
function queueExactTriggers644(st,ev){const added=[];st.triggerQueue=arr(st?.triggerQueue);for(let p=0;p<2;p++)for(const z of ['monster','spelltrap','gy','banished','hand'])for(const item of arr(st?.zones?.[p]?.[z])){if(item?.negatedEffect||item?.disabled)continue;let pc=null;try{pc=R.parseCard?.(item?.card)||null}catch(_){}for(const e of arr(pc?.effects)){if(!e?.timing?.trigger&&!/^\s*(?:if|when)\b/i.test(raw(e?.condition||'')))continue;let ca=null;try{ca=conditionAllowed644(st,p,e,item?.uid,item?.card)}catch(_){}if(!ca?.ok)continue;const k=`${item?.uid}|${e?.id}|${ev?.id}`;if(st.triggerQueue.some(x=>`${x?.uid}|${x?.effectId}|${x?.createdEvent}`===k)||arr(st?.pendingTriggers).some(x=>`${x?.uid}|${x?.effectId}|${x?.createdEvent}`===k))continue;const mandatory=!/you can|puedes|optional|opcional/i.test(`${e?.condition||''} ${e?.activation||''} ${e?.raw||''}`);const tr={player:p,uid:item?.uid,effectId:e?.id,mandatory,createdEvent:ev?.id,controller:p,sourceZone:z,alpha644:true};st.triggerQueue.push(tr);added.push(tr)}}return added}
// Alpha 1149: preflight para ataques directos con un único monstruo Normal.
// El cambio del campo rival después de declarar requiere Replay; no infligir daño ficticio.
// Alpha 1150: allow inert Normal Monsters in the GY, but never claim
// compatibility with cards that have GY effects or unverified flags.
function passiveGraveyard1150(st){
 for(let p=0;p<2;p++)for(const c of arr(st?.zones?.[p]?.gy)){
  if(raw(c?.card?.type||'').trim().toLowerCase()!=='normal monster'||
    Object.keys(c?.flags||{}).length||Object.keys(c?.counters||{}).length||
    arr(c?.materials).length||c?.disabled||c?.negatedEffect||
    Object.prototype.hasOwnProperty.call(c,'currentAtk')||
    Object.prototype.hasOwnProperty.call(c,'currentDef'))return false;
 }
 return true;
}
// Alpha 1151: el replay con segundo atacante solo acepta monstruos normales sin efectos ni estado especial.
function inertMonster1151(x){return x&&raw(x?.card?.type||'').trim().toLowerCase()==='normal monster'&&
 x.faceUp===true&&raw(x.position||'').toUpperCase()==='ATK'&&
 !Object.keys(x.flags||{}).length&&!Object.keys(x.counters||{}).length&&!arr(x.materials).length&&
 !x.negatedEffect&&!x.disabled&&!x.cannotAttack&&!x.__alpha644EndTurnModifier&&
 !Object.prototype.hasOwnProperty.call(x,'currentAtk')&&!Object.prototype.hasOwnProperty.call(x,'currentDef')&&
 !/[;:]|\b(?:once per turn|quick effect|you can|activate|when this card|if this card)\b/i.test(raw(x?.card?.desc||x?.card?.description||''));}
function replayOwnField1151(st,dec,p,attacker){
 const own=arr(st.zones?.[p]?.monster);
 return dec?.alpha1151Alternate===true&&own.length===2&&own.includes(attacker)&&
  own.every(x=>inertMonster1151(x));
}
// Alpha 1155: certificacion temporal de las etapas de dano directo.
// El estado del usuario es editable/serializable; los testigos viven solo en
// WeakMap y nacen cuando el motor aplica realmente los LP de batalla.
// Alpha 1156: testigo fisico y de eventos ligado a un solo estado de duelo.
// Ninguna etapa valida puede reutilizarse desde otra copia del estado.
const DIRECT_TRANSITION_PROOF_1156=new WeakMap();
const DIRECT_ZONES_1156=['monster','spelltrap','hand','gy','banished','deck','extra'];
function captureDirectZones1156(st){
 try{
  return [0,1].map(p=>DIRECT_ZONES_1156.map(z=>{
   const rows=st?.zones?.[p]?.[z];
   if(rows==null)return null;
   if(!Array.isArray(rows))throw Error('invalid zone');
   return{ref:rows,entries:rows.map(item=>({ref:item,stamp:JSON.stringify(item)}))};
  }));
 }catch(_){return null}
}
function directZonesUnchanged1156(st,snapshot){
 if(!Array.isArray(snapshot)||snapshot.length!==2)return false;
 try{return snapshot.every((group,p)=>group.every((proof,i)=>{
  const rows=st?.zones?.[p]?.[DIRECT_ZONES_1156[i]];
  if(proof===null)return rows==null;
  return rows===proof.ref&&rows.length===proof.entries.length&&
   proof.entries.every((item,k)=>rows[k]===item.ref&&JSON.stringify(rows[k])===item.stamp);
 }))}catch(_){return false}
}
// Alpha 1157: instantánea del historial de daño y sus metadatos.
// Solo se admite reanudar exactamente el estado que produjo el daño.
function captureDirectAudit1157(st){
 try{
  if(!Array.isArray(st?.events))return null;
  const keep=obj=>({ref:obj??null,stamp:JSON.stringify(obj??null)});
  return{
   eventList:st.events,
   events:st.events.map(keep),
   lastDamage:keep(st.lastDamage),
   window:keep(st.window),
   combat:keep(st.combat),
   turn:st.turn,
   activePlayer:st.activePlayer,
   phase:st.phase
  };
 }catch(_){return null}
}
function directAuditUnchanged1157(st,proof){
 if(!proof||st?.events!==proof.eventList||!Array.isArray(st.events)||
   st.events.length!==proof.events.length||st.turn!==proof.turn||
   st.activePlayer!==proof.activePlayer||st.phase!==proof.phase)return false;
 try{
  const match=(obj,stamp)=>obj===(stamp?.ref??null)&&JSON.stringify(obj??null)===stamp?.stamp;
  return proof.events.every((row,i)=>match(st.events[i],row))&&
   match(st.lastDamage,proof.lastDamage)&&match(st.window,proof.window)&&
   match(st.combat,proof.combat);
 }catch(_){return false}
}
function newDirectWitness1156(st,dec,damage,player,target,attacker,damageEvent){
 const zones=captureDirectZones1156(st);
 if(!zones)return null;
 return{state:st,stage:'AFTER_DAMAGE',damage,target,targetLpAfter:st.lp[target],
  ownLpAfter:st.lp[player],activePlayer:player,attacker,zones,
  damageEvent:damageEvent||null,damageEventStamp:damageEvent?JSON.stringify(damageEvent):null,
  battleEvent:null,battleEventStamp:null,traceAudit:captureDirectAudit1157(st)};
}

function directTransitionGuard1156(st,dec){
 const reject=reason=>({ok:false,partial:true,unverified:true,alpha1155Bounded:true,reason});
 const witness=dec&&DIRECT_TRANSITION_PROOF_1156.get(dec);
 if(!witness||!['AFTER_DAMAGE','END_DAMAGE'].includes(witness.stage)||
    raw(dec?.directStage)!==witness.stage||
    !Number.isSafeInteger(witness.damage)||
    !Number.isSafeInteger(dec?.directDamage)||dec.directDamage!==witness.damage)
  return reject('La etapa de dano directo o su importe no proceden de una transicion acreditada.');
 const identity=physicalAttackGuard1154(st,dec);
 if(!identity.ok)return identity;
 const ap=Number(st?.activePlayer),bp=1-ap,loc=R.locate?.(st,dec.attackerUid);
 if(witness.state!==st||st?.__alpha644AttackDeclaration!==dec||
    !directZonesUnchanged1156(st,witness.zones)||
    !directAuditUnchanged1157(st,witness.traceAudit)||
    !Array.isArray(st?.events)||
    (witness.damageEvent&&!st.events.includes(witness.damageEvent))||
    (witness.damageEvent&&JSON.stringify(witness.damageEvent)!==witness.damageEventStamp)||
    (witness.damage>0&&!witness.damageEvent)||
    (witness.stage==='END_DAMAGE'&&(!witness.battleEvent||
      !st.events.includes(witness.battleEvent)||
      JSON.stringify(witness.battleEvent)!==witness.battleEventStamp))||
    !Array.isArray(st?.lp)||st.lp[ap]!==witness.ownLpAfter||
    ap!==witness.activePlayer||bp!==witness.target||
    !loc||loc.z!=='monster'||loc.p!==ap||
    loc.item?.controller!==ap||loc.item!==witness.attacker||
    loc.item?.faceUp!==true||raw(loc.item?.position||'').toUpperCase()!=='ATK'||
    !Array.isArray(st?.lp)||st.lp.length!==2||
    !Number.isSafeInteger(st.lp[bp])||st.lp[bp]!==witness.targetLpAfter||
    !Array.isArray(st?.zones?.[bp]?.monster)||st.zones[bp].monster.length!==0)
  return reject('La identidad, campo o LP del dano directo ya no coinciden con el resultado acreditado.');
 return{ok:true,witness};
}
// Alpha 1169: exact mandatory Spirit Reaper direct-attack discard.
// Random hand-card selection uses crypto.getRandomValues; no guessed effects,
// no discard if battle damage has already ended the duel.
function verifiedDirectReaper1169(item){
 return exactBattleIndestructible1165(item)==='BATTLE_INDESTRUCTIBLE_23205979';
}
function inertDiscardHand1169(st,p){
 const hand=st?.zones?.[p]?.hand;
 if(!Array.isArray(hand))return false;
 return hand.every(x=>x&&typeof x.uid==='string'&&x.uid.length>0&&
  x.owner===p&&x.controller===p&&verifiedNormalLore1164(x.card)&&
  Object.keys(x.flags||{}).length===0&&Object.keys(x.counters||{}).length===0&&
  arr(x.materials).length===0&&!x.negatedEffect&&!x.disabled&&
  !Object.prototype.hasOwnProperty.call(x,'currentAtk')&&
  !Object.prototype.hasOwnProperty.call(x,'currentDef')&&
  ![x.card?.id,x.card?.cardId].some(id=>id!=null&&[
   '52077741','36472900','79870141','46272804','59793705',
   '65287621','63695531','11125718','7576264','31305911','23205979'
  ].includes(String(id)))&&
  !['Obnoxious Celtic Guard','Sonic Chick','Mad Sword Beast',
    'Lancer Lindwurm','Elemental HERO Bladedge','Dark Driceratops',
    "Gravekeeper's Spear Soldier",'Lancer Dragonute','Phantom Beast Wild-Horn',
    'Marshmallon','Spirit Reaper'].includes(raw(x.card?.name||'').trim()));
}
function randomDiscardIndex1169(n){
 if(n===1)return 0;
 if(!Number.isSafeInteger(n)||n<1||n>60||
    !W.crypto||typeof W.crypto.getRandomValues!=='function')return null;
 const num=new Uint32Array(1),range=4294967296;
 const cutoff=Math.floor(range/n)*n;
 for(let tries=0;tries<64;tries++){
  W.crypto.getRandomValues(num);
  if(num[0]<cutoff)return num[0]%n;
 }
 return null;
}
function beginDirectBattle644(st,dec){
 const reject=(reason,extra={})=>({ok:false,unverified:true,partial:true,alpha1149Bounded:true,reason,...extra});
 const ap=Number(st?.activePlayer),bp=1-ap,q=R.locate?.(st,dec.attackerUid);
 if(![0,1].includes(ap)||!q||q.z!=='monster'||q.p!==ap||q.item?.controller!==ap)
  return reject('El atacante directo ya no ocupa una zona válida bajo el jugador activo.');
 if(raw(st?.phase).toUpperCase()!=='BATTLE STEP')return reject('No se puede resolver un ataque directo fuera del Battle Step.');
 const a=q.item;
 if(a.faceUp!==true||raw(a.position||'').toUpperCase()!=='ATK')return reject('El atacante debe seguir boca arriba en Posición de Ataque.');
 if(!st.zones||!st.zones[ap]||!st.zones[bp])return reject('El estado físico de las zonas es incompleto.');
 if(arr(st.zones[bp].monster).length>0)
  return reject('REPLAY_REQUIRED: el campo adversario cambió antes del Damage Step; selecciona una nueva acción de ataque.',{pending:true,replay:true});
 const reaper1169=verifiedDirectReaper1169(a);
 if(!reaper1169&&raw(a.card?.type||'').toLowerCase().trim()!=='normal monster')
  return reject('Monstruo con efectos/procedimiento de ataque directo no acreditados.');
 if(!Number.isInteger(a.owner)||![0,1].includes(a.owner))
  return reject('El propietario físico del atacante directo no está verificado.');
 if(!reaper1169&&!verifiedNormalLore1164(a.card))
  return reject('Monstruo Normal con efecto de ataque no acreditado.');
 if(Object.keys(a.flags||{}).length||Object.keys(a.counters||{}).length||arr(a.materials).length||
   Object.prototype.hasOwnProperty.call(a,'currentAtk')||Object.prototype.hasOwnProperty.call(a,'currentDef')||
   a.negatedEffect||a.disabled||a.cannotAttack||a.__alpha644EndTurnModifier)
  return reject('Existen modificadores o restricciones de ataque que requieren un handler reglamentario.');
 if(!reaper1169&&/\b(?:once per turn|quick effect|you can|activate|target 1|when this card|if this card|gain \d+ lp|inflict \d+ damage)\b|[;:]/i.test(raw(a.card?.desc||a.card?.description||a.card?.text||'')))
  return reject('Hay textos de efectos de ataque o daño no certificados.');
 if(!Array.isArray(st.lp)||st.lp.length!==2||!st.lp.every(x=>Number.isSafeInteger(x)&&x>=0))
  return reject('Los Life Points deben ser enteros válidos antes de infligir daño.');
 for(let p=0;p<2;p++){
  const z=st.zones[p];
  if(!Array.isArray(z.monster)||!Array.isArray(z.gy)||!Array.isArray(z.hand)||!Array.isArray(z.spelltrap)||!Array.isArray(z.banished))
   return reject('Una o más zonas físicas no pueden verificarse.');
  if((p===ap&&z.monster.length!==1&&!replayOwnField1151(st,dec,ap,a))||
     (reaper1169?(p===bp?!inertDiscardHand1169(st,bp):arr(z.hand).length>0):arr(z.hand).length>0)||
     arr(z.spelltrap).length||arr(z.banished).length||!passiveGraveyard1150(st))
   return reject('Hay cartas adicionales cuyos efectos/respuestas no se han certificado.');
 }
 if(attackResponsesPending644(st)||damageRisk644(st).length)return reject('Existen respuestas y efectos de batalla pendientes.');
 if(!arr(st.zones[ap].monster).includes(a))return reject('La identidad del atacante cambió durante el ataque.');
 const atk=a.card?.atk;
 if(!Number.isSafeInteger(atk)||atk<0||atk>999999)return reject('El ATK impreso del monstruo no está acreditado.');
 // Alpha 1169: discard target preselected, but no visible state mutation yet.
 const discardIndex1169=reaper1169&&st.zones[bp].hand.length?
   randomDiscardIndex1169(st.zones[bp].hand.length):null;
 if(reaper1169&&st.zones[bp].hand.length&&discardIndex1169===null)
  return reject('No se puede verificar un descarte aleatorio seguro.');
 // Todos los chequeos anteriores son inmutables: desde aquí se puede aplicar el daño.
 const target=bp;
 for(const phase of ['DAMAGE STEP START','BEFORE DAMAGE CALCULATION','DAMAGE CALCULATION']){
  st.phase=phase;st.priority=ap;st.window={kind:phase,open:true,alpha644:true};pushCanonicalEvent644(st,'A644_WINDOW',{phase},phase)
 }
 st.lp[target]=Math.max(0,st.lp[target]-atk);
 if(atk>0)st.lastDamage={player:target,amount:atk,type:'BATTLE',direct:true,attacker:dec.attackerUid};
 const dev=atk>0?pushCanonicalEvent644(st,'DAMAGE',{player:target,amount:atk,type:'BATTLE',attacker:dec.attackerUid,attackerName:raw(a.card?.name||''),defender:null,direct:true},'DAMAGE CALCULATION'):null;
 const terminal1167=finishDuelOnLethal1167(st,dec,{attackerName:raw(a.card?.name||''),direct:true,damage:atk,damagedPlayer:target});
 if(terminal1167)return terminal1167;
 st.phase='AFTER DAMAGE CALCULATION';st.window={kind:st.phase,open:true,alpha644:true};
 let effectDiscard1169=null;
 if(reaper1169&&atk>0){
  pushCanonicalEvent644(st,'EFFECT_TRIGGER_CANON',
   {uid:a.uid,controller:ap,cardId:23205979,mandatory:true,condition:'DIRECT_BATTLE_DAMAGE',alpha1169:true},st.phase);
  pushCanonicalEvent644(st,'EFFECT_ACTIVATED_CANON',
   {uid:a.uid,controller:ap,cardId:23205979,alpha1169:true},st.phase);
  if(discardIndex1169!==null){
   const x=st.zones[bp].hand.splice(discardIndex1169,1)[0];
   x.previousZone='hand';x.previousController=bp;x.controller=x.owner;x.faceUp=true;
   st.zones[x.owner].gy.push(x);effectDiscard1169=x.uid;
   pushCanonicalEvent644(st,'CARD_DISCARDED_CANON',
    {uid:x.uid,owner:x.owner,player:bp,sourceUid:a.uid,sourceCardId:23205979,
     reason:'RANDOM_DISCARD',alpha1169:true},st.phase);
  }
  pushCanonicalEvent644(st,'EFFECT_RESOLVED_CANON',
   {uid:a.uid,controller:ap,cardId:23205979,discardedUid:effectDiscard1169,alpha1169:true},st.phase);
 }
 dec.directStage='AFTER_DAMAGE';dec.directDamage=atk;dec.directSpiritReaper1169=reaper1169;
 DIRECT_TRANSITION_PROOF_1156.set(dec,newDirectWitness1156(st,dec,atk,ap,bp,a,dev));
 const queued=dev&&!reaper1169?queueExactTriggers644(st,dev):[];
 if(queued.length&&typeof R.openTriggerWindow==='function'){try{R.openTriggerWindow(st)}catch(_){}}
 if(attackResponsesPending644(st))return{ok:true,pending:true,direct:true,damage:atk,phase:st.phase,queued};
 const finished=finishDirectBattle644(st,dec);if(finished?.ok)finished.alpha1149Bounded=true;return finished;
}
function finishDirectBattle644(st,dec){const verified=directTransitionGuard1156(st,dec);if(!verified.ok)return verified;if(dec.directStage==='AFTER_DAMAGE'){st.phase='END OF DAMAGE STEP';st.window={kind:st.phase,open:true,alpha644:true};const bev=pushCanonicalEvent644(st,'BATTLE_RESULT_CANON',{attacker:dec.attackerUid,attackerName:raw(R.locate?.(st,dec.attackerUid)?.item?.card?.name||''),attackerController:Number(st.activePlayer)||0,defender:null,direct:true,defenderDestroyed:false,attackerDestroyed:false,damage:Number(dec.directDamage)||0},st.phase);dec.directStage='END_DAMAGE';verified.witness.stage='END_DAMAGE';verified.witness.battleEvent=bev;verified.witness.battleEventStamp=JSON.stringify(bev);verified.witness.traceAudit=captureDirectAudit1157(st);const queued=dec.directSpiritReaper1169?[]:queueExactTriggers644(st,bev);if(queued.length&&typeof R.openTriggerWindow==='function'){try{R.openTriggerWindow(st)}catch(_){}}if(attackResponsesPending644(st))return{ok:true,pending:true,direct:true,damage:dec.directDamage,phase:st.phase,queued}}if(dec.directStage==='END_DAMAGE'){dec.consumed=true;st.phase='BATTLE STEP';st.window={kind:'BATTLE STEP',open:true,alpha644:true};const dmg=Number(dec.directDamage)||0;delete st.__alpha644AttackDeclaration;return{ok:true,direct:true,damage:dmg,complete:true,phase:st.phase}}return{ok:false,unverified:true,reason:'Estado de ataque directo no reconocido.'}}
// Alpha 1148: un único resolvedor acotado para combates entre monstruos Normales.
// Rechaza estados sin evidencia antes de modificar LP, zonas o la bandera consumida.
// Alpha 1158: dos efectos continuos exactos corroborados en base oficial de Konami.
// No se extrapolan reglas a cartas desconocidas ni a efectos adicionales.
// Alpha 1163: verificación uniforme de identidad y metadatos de efectos
// impresos. Múltiples alias presentes deben ser compatibles entre sí;
// nunca se admiten ATK/DEF expresados como cadenas numéricas.
function verifiedPrintedEffect1163(x,rule){
 if(!x||raw(x.type||'').trim().toLowerCase()!=='effect monster'||
    raw(x.name||'').trim()!==rule.name||
    !Number.isSafeInteger(x.atk)||!Number.isSafeInteger(x.def)||
    x.atk!==rule.atk||x.def!==rule.def)return false;
 const accepted=[rule.desc,...(rule.alternates||[])];
 const fields=['desc','description','text'].filter(k=>x[k]!==undefined&&x[k]!==null);
 return fields.length>0&&fields.every(k=>accepted.includes(raw(x[k]).trim()));
}
function exactBattleGuard1158(item){
 const x=item?.card,id=String(x?.id??x?.cardId??'');
 const cards={
  '52077741':{name:'Obnoxious Celtic Guard',atk:1400,def:1200,proof:'OBNOXIOUS_CELTIC_GUARD'},
  '36472900':{name:'Sonic Chick',atk:300,def:300,proof:'SONIC_CHICK'}
 };
 const rule=cards[id];
 if(x?.id!=null&&x?.cardId!=null&&String(x.id)!==String(x.cardId))return null;
 if(!rule||!verifiedPrintedEffect1163(x,{...rule,
   desc:'Cannot be destroyed by battle with a monster that has 1900 or more ATK.'}))return null;
 return rule.proof;
}
// Alpha 1161: familia acotada de penetración, basada en identidad, stats y PSCT
// impresos de tres cartas Konami. No extrapolar a cartas, cartas adicionales ni
// otros efectos desconocidos; no confiar en un simple regex de texto arbitrario.
function exactPiercing1161(item){
 const x=item?.card;
 if(!x||x.id!=null&&x.cardId!=null&&String(x.id)!==String(x.cardId))return null;
 const rules={
  '79870141':{name:'Mad Sword Beast',atk:1400,def:1200,
   desc:'If this card attacks a Defense Position monster, inflict piercing battle damage.'},
  '46272804':{name:'Lancer Lindwurm',atk:1800,def:1200,
   desc:'If this card attacks a Defense Position monster, inflict piercing battle damage to your opponent.'},
  '59793705':{name:'Elemental HERO Bladedge',atk:2600,def:1800,
   // El catálogo local posee otra redacción; ambas variantes son conocidas.
   desc:'If this card attacks a Defense Position monster, inflict piercing battle damage.',
   alternates:['If this card attacks a Defense Position monster, inflict piercing battle damage to your opponent.']},
  '65287621':{name:'Dark Driceratops',atk:2400,def:1500,
   desc:'If this card attacks a Defense Position monster, inflict piercing battle damage.'},
  '63695531':{name:"Gravekeeper's Spear Soldier",atk:1500,def:1000,
   desc:'If this card attacks a Defense Position monster, inflict piercing battle damage to your opponent.'},
  '11125718':{name:'Lancer Dragonute',atk:1500,def:1800,
   desc:'If this card attacks a Defense Position monster, inflict piercing battle damage to your opponent.'},
  '7576264':{name:'Phantom Beast Wild-Horn',atk:1700,def:0,
   desc:'If this card attacks a Defense Position monster, inflict piercing battle damage.'}
 };
 const id=String(x.id??x.cardId??''),rule=rules[id];
 if(!rule||!verifiedPrintedEffect1163(x,rule))return null;
 return 'PIERCING_'+id;
}
// Alpha 1165: protección incondicional acotada y validada con Konami.
// Los efectos adicionales siguen sin certificación fuera del duelo físico aislado.
function exactBattleIndestructible1165(item){
 const x=item?.card;
 if(!x||x.id!=null&&x.cardId!=null&&String(x.id)!==String(x.cardId))return null;
 const rules={
  '31305911':{name:'Marshmallon',atk:300,def:500,
   desc:'Cannot be destroyed by battle. After damage calculation, if this card was attacked, and was face-down at the start of the Damage Step: The attacking player takes 1000 damage.'},
  '23205979':{name:'Spirit Reaper',atk:300,def:200,
   desc:'Cannot be destroyed by battle. After resolving a card effect that targets this face-up card, destroy this card. If this card inflicts battle damage to your opponent by a direct attack: Discard 1 random card from their hand.',
   alternates:['Cannot be destroyed by battle. After resolving a card effect that targets this face-up card, destroy this card. When this card inflicts battle damage to your opponent by a direct attack: Discard 1 random card from their hand.']}
 };
 const rule=rules[String(x.id??x.cardId??'')];
 if(!rule||!verifiedPrintedEffect1163(x,rule))return null;
 return 'BATTLE_INDESTRUCTIBLE_'+String(x.id??x.cardId);
}
// Alpha 1164: un Monstruo Normal no lleva efectos de duelo impresos.
// Fail-closed ante alias de descripción incompatibles, texto ejecutable y
// metadatos cardId/id discordantes. Mantiene texto de ambientación legítimo.
function verifiedNormalLore1164(x){
 if(!x||raw(x.type||'').trim().toLowerCase()!=='normal monster')return false;
 if(x.id!=null&&x.cardId!=null&&String(x.id)!==String(x.cardId))return false;
 const fields=['desc','description','text'].filter(k=>x[k]!==undefined&&x[k]!==null);
 if(fields.some(k=>typeof x[k]!=='string'))return false;
 const texts=fields.map(k=>x[k].replace(/\s+/g,' ').trim());
 if(texts.some(t=>t!==texts[0]))return false;
 const t=texts[0]||'';
 // Estos patrones implican una condición/operación de reglas, no simple lore.
 const operations=/(?:\bonce per turn\b|\bquick effect\b|\bpiercing battle damage\b|\b(?:cannot|can't|can|may|must)\s+(?:be destroyed|be targeted|attack|activate|inflict|special summon|summon|draw|banish|target|destroy)\b|\b(?:unaffected by|you take no battle damage|take no battle damage|your opponent cannot|this card can|this monster can|this card cannot|when this card|if this card)\b|\b(?:gains?|loses?)\s+\d+\s+(?:ATK|DEF)\b|\binflict\b.{0,65}\bdamage\b)/i;
 return !operations.test(t);
}
function vanillaOutcome1148(st,dec,a0,d0){
 const a=a0?.item,b=d0?.item,ap=Number(st?.activePlayer),bp=1-ap;
 if(!a||!b||a0.z!=='monster'||d0.z!=='monster'||(ap!==0&&ap!==1))return null;
 if(Number(a.controller??a0.p)!==ap||Number(b.controller??d0.p)!==bp)return null;
 const normal=x=>raw(x?.card?.type||'').trim().toLowerCase()==='normal monster';
 const protectedProof=exactBattleGuard1158(b),protectedDefender=!!protectedProof;
 const protectedAttackerProof=exactBattleGuard1158(a),protectedAttacker=!!protectedAttackerProof;
 const piercingAttackerProof=exactPiercing1161(a),piercingAttacker=!!piercingAttackerProof;
 const indestructibleAttackerProof=exactBattleIndestructible1165(a),indestructibleAttacker=!!indestructibleAttackerProof;
 const indestructibleDefenderProof=exactBattleIndestructible1165(b),indestructibleDefender=!!indestructibleDefenderProof;
 if((!normal(a)&&!protectedAttacker&&!piercingAttacker&&!indestructibleAttacker)||(!normal(b)&&!protectedDefender&&!indestructibleDefender))return null;
 const deny=reason=>({ok:false,partial:true,unverified:true,reason,alpha1148Bounded:true});
 // Alpha 1166: ventana acotada del trigger obligatorio de Marshmallon.
 const marshFaceDown1166=indestructibleDefenderProof==='BATTLE_INDESTRUCTIBLE_31305911'&&b.faceUp===false;
 if(indestructibleDefender&&b.faceUp===false&&!marshFaceDown1166)return deny('Carta indestructible boca abajo: requiere disparadores y efectos completos.');
 if([a,b].some(x=>normal(x)&&!verifiedNormalLore1164(x.card)))
  return deny('Monstruo Normal con texto de Efecto, alias incompatibles o identidad física discordante.');
 const protectedIds1163=['52077741','36472900','79870141','46272804','59793705','65287621','63695531','11125718','7576264','31305911','23205979'];
 const protectedNames1163=['Obnoxious Celtic Guard','Sonic Chick','Mad Sword Beast','Lancer Lindwurm',
   'Elemental HERO Bladedge','Dark Driceratops',"Gravekeeper's Spear Soldier",'Lancer Dragonute','Phantom Beast Wild-Horn','Marshmallon','Spirit Reaper'];
 if([a,b].some(x=>normal(x)&&(
  [x.card?.id,x.card?.cardId].some(id=>id!=null&&protectedIds1163.includes(String(id)))||
  protectedNames1163.includes(raw(x.card?.name||'').trim()))))
  return deny('La identidad de un Monstruo de Efecto está falsificada como Normal.');
 const guarded=(x,certifiedText=false)=>Object.prototype.hasOwnProperty.call(x,'currentAtk')||Object.prototype.hasOwnProperty.call(x,'currentDef')||
  Object.keys(x.flags||{}).length>0||Object.keys(x.counters||{}).length>0||
  !!x.negatedEffect||!!x.disabled||!!x.__alpha644EndTurnModifier||
  (!certifiedText&&/\b(?:once per turn|quick effect|you can|activate|target 1|when this card|if this card|gain \d+ lp|inflict \d+ damage)\b|[;:]/i.test(raw(x.card?.desc||x.card?.description||x.card?.text||'')));
 const posA=raw(a.position||'ATK').toUpperCase(),posB=raw(b.position||'ATK').toUpperCase();
 if(posA!=='ATK'||!['ATK','DEF'].includes(posB)||a.faceUp!==true||
   (b.faceUp!==true&&(b.faceUp!==false||posB!=='DEF')))
  return deny('La posición de combate no está acreditada para el resolvedor físico.');
 if(guarded(a,piercingAttacker||indestructibleAttacker)||guarded(b,indestructibleDefender))return deny('Estadísticas, restricciones o efectos de batalla necesitan resolución de reglas específicas.');
 const atk=Number(a.card?.atk),bAtk=Number(b.card?.atk),bDef=Number(b.card?.def);
 if(![atk,bAtk,bDef].every(n=>Number.isSafeInteger(n)&&n>=0&&n<=999999))return deny('ATK/DEF deben ser enteros físicos verificables.');
 for(let p=0;p<2;p++){
  const z=st?.zones?.[p];if(!z||(arr(z.monster).length!==1&&!(p===ap&&replayOwnField1151(st,dec,ap,a)))||
   (['hand','banished','spelltrap'].some(key=>arr(z[key]).length>0)||!passiveGraveyard1150(st)))
   return deny('Hay otras cartas que requieren verificar posibles respuestas o efectos.');
 }
 if(attackResponsesPending644(st)||damageRisk644(st).length)return deny('Existen respuestas o modificadores de batalla pendientes.');
 if(!Array.isArray(st.lp)||st.lp.length!==2||!st.lp.every(n=>Number.isSafeInteger(n)&&n>=0))
  return deny('LP no verificables.');
 const targetStat=posB==='DEF'?bDef:bAtk,loss=posB==='DEF'?Math.max(0,targetStat-atk):Math.abs(atk-targetStat);
 let destroyed=posB==='DEF'?(atk>targetStat?['defender']:[]):
  (atk===targetStat?(atk===0?[]:['attacker','defender']):(atk>targetStat?['defender']:['attacker']));
 // La protección no niega ni reduce daño de batalla: solo evita destrucción.
 if(protectedDefender&&atk>=1900)destroyed=destroyed.filter(side=>side!=='defender');
 // Si una de las dos cartas oficiales declara el ataque, la protección también
 // evita SU destrucción al combatir con un monstruo de 1900 o más ATK.
 if(protectedAttacker&&bAtk>=1900)destroyed=destroyed.filter(side=>side!=='attacker');
 // Protección continua sin umbral: daño de batalla sí se aplica.
 if(indestructibleDefender)destroyed=destroyed.filter(side=>side!=='defender');
 if(indestructibleAttacker)destroyed=destroyed.filter(side=>side!=='attacker');
 const damagePlayer=posB==='DEF'?(atk<targetStat?ap:(piercingAttacker&&atk>targetStat?bp:null)):(atk>targetStat?bp:atk<targetStat?ap:null);
 const dealt=posB==='DEF'&&piercingAttacker&&atk>targetStat?atk-targetStat:(damagePlayer===null?0:loss);
 // Alpha 1160: el propietario NO puede inferirse del controlador ni convertir
 // null, strings o valores fuera de rango en un propietario legítimo.
 // La propiedad importa también si la carta NO es destruida en esta batalla.
 const ownerOk=x=>typeof x?.owner==='number'&&Number.isInteger(x.owner)&&(x.owner===0||x.owner===1);
 if(!ownerOk(a)||!ownerOk(b))return deny('Propietario físico ausente o no verificable: no se acredita el combate.');
 const ownerOf=x=>x.owner;
 // El preflight garantiza las dos ubicaciones y destinos antes de cualquier escritura.
 if(!st.zones[ap].monster.includes(a)||st.zones[bp].monster[0]!==b||
   !Array.isArray(st.zones[ownerOf(a)].gy)||!Array.isArray(st.zones[ownerOf(b)].gy))return deny('Ubicaciones físicas no coherentes.');
 for(const phase of ['DAMAGE STEP START','BEFORE DAMAGE CALCULATION']){
  st.phase=phase;st.priority=ap;st.window={kind:phase,open:true,alpha644:true};
  pushCanonicalEvent644(st,'A644_WINDOW',{phase},phase);
 }
 if(b.faceUp===false){b.faceUp=true;pushCanonicalEvent644(st,'FLIP_FACE_UP_CANON',{uid:b.uid,uidName:raw(b.card?.name||''),card:raw(b.card?.name||''),player:bp},'BEFORE DAMAGE CALCULATION');}
 st.phase='DAMAGE CALCULATION';st.window={kind:st.phase,open:true,alpha644:true};
 pushCanonicalEvent644(st,'A644_WINDOW',{phase:st.phase},st.phase);
 if(dealt>0){st.lp[damagePlayer]=Math.max(0,st.lp[damagePlayer]-dealt);
  st.lastDamage={player:damagePlayer,amount:dealt,type:'BATTLE',direct:false,attacker:dec.attackerUid,defender:dec.defenderUid};
  pushCanonicalEvent644(st,'DAMAGE',{player:damagePlayer,amount:dealt,type:'BATTLE',attacker:dec.attackerUid,defender:dec.defenderUid},'DAMAGE CALCULATION');}
 const battleLethal1167=finishDuelOnLethal1167(st,dec,{attackerName:raw(a.card?.name||''),defenderName:raw(b.card?.name||''),damage:dealt,damagedPlayer:damagePlayer});
 if(battleLethal1167)return battleLethal1167;
 st.phase='AFTER DAMAGE CALCULATION';st.window={kind:st.phase,open:true,alpha644:true};
 pushCanonicalEvent644(st,'A644_WINDOW',{phase:st.phase},st.phase);
 // El efecto obligatorio de Marshmallon comienza tras el cálculo de daño.
 // Esta ruta solo se alcanza si el preflight descartó otras cadenas,
 // disparadores, zonas con cartas adicionales o respuestas desconocidas.
 // El daño de efecto es distinto de cualquier daño de batalla/penetración.
 const marshEffectDamage1166=marshFaceDown1166?1000:0;
 if(marshEffectDamage1166){
  pushCanonicalEvent644(st,'EFFECT_TRIGGER_CANON',{uid:b.uid,cardId:31305911,controller:bp,mandatory:true,condition:'FACE_DOWN_AT_DAMAGE_STEP_START',alpha1166:true},'AFTER DAMAGE CALCULATION');
  pushCanonicalEvent644(st,'EFFECT_ACTIVATED_CANON',{uid:b.uid,controller:bp,cardId:31305911,alpha1166:true},'AFTER DAMAGE CALCULATION');
  st.lp[ap]=Math.max(0,st.lp[ap]-marshEffectDamage1166);
  st.lastDamage={player:ap,amount:marshEffectDamage1166,type:'EFFECT',sourceUid:b.uid,sourceCardId:31305911,alpha1166:true};
  pushCanonicalEvent644(st,'DAMAGE',{player:ap,amount:marshEffectDamage1166,type:'EFFECT',sourceUid:b.uid,sourceCardId:31305911,alpha1166:true},'AFTER DAMAGE CALCULATION');
  pushCanonicalEvent644(st,'EFFECT_RESOLVED_CANON',{uid:b.uid,controller:bp,cardId:31305911,damage:marshEffectDamage1166,damagedPlayer:ap,alpha1166:true},'AFTER DAMAGE CALCULATION');
 }
 const effectLethal1167=finishDuelOnLethal1167(st,dec,{attackerName:raw(a.card?.name||''),defenderName:raw(b.card?.name||''),damage:dealt,damagedPlayer:damagePlayer,effectDamage:marshEffectDamage1166,effectDamagedPlayer:ap});
 if(effectLethal1167)return effectLethal1167;

 st.phase='END OF DAMAGE STEP';st.window={kind:st.phase,open:true,alpha644:true};
 for(const side of destroyed){
  const x=side==='attacker'?a:b,p=side==='attacker'?ap:bp,owner=ownerOf(x);
  st.zones[p].monster.splice(st.zones[p].monster.indexOf(x),1);x.previousZone='monster';x.previousController=p;
  x.controller=owner;x.faceUp=true;st.zones[owner].gy.push(x);
  pushCanonicalEvent644(st,'BATTLE_DESTROYED',{uid:x.uid,player:p,owner,to:'gy',reason:'BATTLE',alpha1148:true},'END OF DAMAGE STEP');
 }
 pushCanonicalEvent644(st,'BATTLE_RESULT_CANON',{
  attacker:dec.attackerUid,attackerName:raw(a.card?.name||''),attackerController:ap,
  defender:dec.defenderUid,defenderName:raw(b.card?.name||''),defenderController:bp,
  defenderDestroyed:destroyed.includes('defender'),attackerDestroyed:destroyed.includes('attacker'),
  defenderTo:destroyed.includes('defender')?'gy':'monster',attackerTo:destroyed.includes('attacker')?'gy':'monster',
  damage:dealt,damagedPlayer:damagePlayer,...(marshEffectDamage1166?{effectDamage:marshEffectDamage1166,effectDamagedPlayer:ap}:{}),alpha1148Vanilla:!piercingAttacker&&!indestructibleDefender&&!indestructibleAttacker,
  alpha1158ExactEffect:protectedProof||null,
  alpha1159ExactEffect:protectedAttackerProof||protectedProof||null,
  ...(piercingAttackerProof?{alpha1161ExactEffect:piercingAttackerProof}:{}),
  ...(indestructibleDefenderProof||indestructibleAttackerProof?{alpha1165ExactEffect:indestructibleDefenderProof||indestructibleAttackerProof}:{})
 },'END OF DAMAGE STEP');
 dec.consumed=true;delete st.__alpha644AttackDeclaration;
 st.phase='BATTLE STEP';st.priority=ap;st.window={kind:'BATTLE STEP',open:true,alpha644:true};
 st.combat={...st.combat,attackerUid:dec.attackerUid,defenderUid:dec.defenderUid,stage:'COMPLETE'};
 return{ok:true,damage:dealt,damagedPlayer:damagePlayer,effectDamage:marshEffectDamage1166,effectDamagedPlayer:marshEffectDamage1166?ap:null,destroyed,complete:true,phase:st.phase,alpha1148Vanilla:!piercingAttacker&&!indestructibleDefender&&!indestructibleAttacker,
  alpha1158ExactEffect:protectedProof||null,
  alpha1159ExactEffect:protectedAttackerProof||protectedProof||null,
  ...(piercingAttackerProof?{alpha1161ExactEffect:piercingAttackerProof}:{}),
  ...(indestructibleDefenderProof||indestructibleAttackerProof?{alpha1165ExactEffect:indestructibleDefenderProof||indestructibleAttackerProof}:{}),
  outcome:posB==='DEF'?(atk<targetStat?'DEF_SUPERIOR':atk===targetStat?'DEF_EQUAL':((protectedDefender&&atk>=1900)||indestructibleDefender)?'DEF_PROTECTED':piercingAttacker?'DEF_PIERCE':'DEF_DESTROY'):
   (atk>targetStat?((protectedDefender&&atk>=1900)||indestructibleDefender?'ATK_WIN_PROTECTED':'ATK_WIN'):
    atk<targetStat?((protectedAttacker&&bAtk>=1900)||indestructibleAttacker?'ATK_LOSE_PROTECTED':'ATK_LOSE'):
    atk===0?'ATK_ZERO_TIE':(indestructibleDefender||indestructibleAttacker?'ATK_TIE_PROTECTED':'ATK_TIE'))};
}
// Alpha 1149: Replay acotado cuando aparece exactamente un monstruo Normal rival.
// No se declara un segundo ataque; el contador de ataques queda consumido al cancelar.
// Alpha 1150: replay acotado para ataques directos O a monstruos.
// Cambiar a otro atacante aún requiere un motor de prioridad/ataques más completo.
// Alpha 1152: temporalidad certificable de una única declaración de ataque.
// No se presume legalidad si la declaración viene de una instantánea histórica sin contexto.
// Alpha 1154: vinculacion efimera por referencia fisica + datos impresos.
// WeakMap evita guardar referencias circulares o certificados en barajas exportadas.
const DECLARED_PHYSICAL_1154=new WeakMap();
function physicalCardSig1154(it){
 if(!it||!it.card||!raw(it.uid))return null;
 const c=it.card;
 return JSON.stringify([raw(it.uid),raw(it.owner),raw(c.id),raw(c.cardId),
  raw(c.name),raw(c.type),raw(c.atk),raw(c.def),
  raw(c.desc??c.description??c.text??'')]);
}
function bindAttackPhysical1154(dec,a,d){
 if(!dec||!a||!physicalCardSig1154(a))return false;
 DECLARED_PHYSICAL_1154.set(dec,{attacker:a,attackerSig:physicalCardSig1154(a),
  defender:d||null,defenderSig:d?physicalCardSig1154(d):null});
 return true;
}
function physicalAttackGuard1154(st,dec,{defender=true}={}){
 const fail=reason=>({ok:false,partial:true,unverified:true,alpha1154Bounded:true,reason});
 const bound=dec&&DECLARED_PHYSICAL_1154.get(dec);
 if(!bound)return fail('La declaracion no tiene identidad fisica trazable (estado recreado u obsoleto).');
 const a=R.locate?.(st,dec.attackerUid);
 if(!a||a.z!=='monster'||a.item!==bound.attacker||
    physicalCardSig1154(a.item)!==bound.attackerSig)
  return fail('El atacante fue sustituido o alterado sin una transicion legal verificable.');
 if(defender&&dec.defenderUid){
  const d=R.locate?.(st,dec.defenderUid);
  // Una desaparicion autentica de objetivo se trata como replay, no como dano.
  if(d&&d.z==='monster'&&(d.item!==bound.defender||
     physicalCardSig1154(d.item)!==bound.defenderSig))
   return fail('El objetivo fue sustituido o alterado conservando su UID.');
 }
 return{ok:true};
}
function attackTemporalGuard1152(st,dec){
 const turn=Number(st?.turn),player=Number(st?.activePlayer),phase=raw(st?.phase).toUpperCase();
 if(!Number.isSafeInteger(turn)||turn<2||![0,1].includes(player)||
    !Number.isSafeInteger(dec?.turnAtDeclaration)||dec.turnAtDeclaration!==turn||
    ![0,1].includes(dec?.playerAtDeclaration)||dec.playerAtDeclaration!==player)
  return{ok:false,partial:true,unverified:true,alpha1152Bounded:true,
   reason:'La declaración corresponde a otro turno/jugador o carece de contexto temporal verificable.'};
 const stage=raw(dec?.directStage||'');
 const expected=stage==='AFTER_DAMAGE'?'AFTER DAMAGE CALCULATION':
   stage==='END_DAMAGE'?'END OF DAMAGE STEP':'BATTLE STEP';
 if(phase!==expected)
  return{ok:false,partial:true,unverified:true,alpha1152Bounded:true,
   reason:'El ataque no puede continuar fuera de su fase o subfase de batalla verificable.'};
 return{ok:true};
}
function replayAttack1151(st,targetUid=null,alternateAttackerUid=null){const terminal1168=terminalActionGate1168(st);if(terminal1168)return terminal1168;
 const deny=(reason,extra={})=>({ok:false,partial:true,unverified:true,alpha1150Bounded:true,reason,...extra});
 const dec=st?.__alpha644AttackDeclaration,ap=Number(st?.activePlayer),bp=1-ap;
 if(!dec||dec.consumed||dec.directStage||![0,1].includes(ap))return deny('No hay una declaración válida pendiente de replay.');
 const temporal=attackTemporalGuard1152(st,dec);if(!temporal.ok)return temporal;
 const identity=physicalAttackGuard1154(st,dec);if(!identity.ok)return identity;
 if(raw(st?.phase).toUpperCase()!=='BATTLE STEP'||attackResponsesPending644(st))
  return deny('El replay no puede resolverse con otra fase, cadenas o disparadores pendientes.');
 const previous=dec.opponentMonsterIdsAtDeclaration;
 if(!Array.isArray(previous))return deny('No existe un registro verificable del campo adversario cuando se declaró el ataque.');
 const current=arr(st?.zones?.[bp]?.monster).map(x=>raw(x?.uid));
 if(previous.length===current.length&&previous.every((id,i)=>id===current[i]))
  return deny('El conjunto de monstruos adversarios no ha cambiado; no hay replay acreditado.');
 if(current.length>1)return deny('El replay solo admite cero o un monstruo adversario en esta revisión.');
 const a=R.locate?.(st,dec.attackerUid);
 if(!a||a.z!=='monster'||Number(a.item?.controller??a.p)!==ap||a.item?.faceUp!==true||raw(a.item?.position||'').toUpperCase()!=='ATK')
  return deny('El monstruo que declaró el ataque ya no puede continuar.');
 if(targetUid==null){
  if(alternateAttackerUid!=null)return deny('Cancelar un replay no permite seleccionar otro atacante al mismo tiempo.');
  dec.consumed=true;delete st.__alpha644AttackDeclaration;
  st.window={kind:'BATTLE STEP',open:true,alpha644:true};
  st.combat={...st.combat,stage:'REPLAY_CANCELLED'};
  return{ok:true,complete:true,replay:true,cancelled:true,damage:0,alpha1150Bounded:true};
 }
 // En el reglamento, otro atacante puede intervenir en el replay, pero ambos consumen un ataque.
 // Se acreditan exclusivamente 2 monstruos Normales inertes propios contra hasta 1 Normal enemigo.
 if(alternateAttackerUid!=null){
  const altId=raw(alternateAttackerUid),oldId=raw(dec.attackerUid);
  if(!altId||altId===oldId)return deny('El atacante alternativo debe ser distinto del atacante original.');
  const alt=R.locate?.(st,altId);
  if(!alt||alt.z!=='monster'||Number(alt.item?.controller??alt.p)!==ap||
     !inertMonster1151(alt.item)||!inertMonster1151(a.item)||
     !Array.isArray(st?.zones?.[ap]?.monster)||st.zones[ap].monster.length!==2||
     !st.zones[ap].monster.includes(a.item)||!st.zones[ap].monster.includes(alt.item))
   return deny('El cambio de atacante solo admite dos monstruos Normales inertes y físicamente verificables.');
  for(let p=0;p<2;p++){
   const z=st.zones?.[p];
   if(!z||!['hand','spelltrap','banished','gy'].every(k=>Array.isArray(z[k]))||
      arr(z.hand).length||arr(z.spelltrap).length||arr(z.banished).length||!passiveGraveyard1150(st))
    return deny('Cartas o zonas adicionales impiden certificar el cambio de atacante.');
  }
  if(current.length===1){
   const d=R.locate?.(st,targetUid);
   if(!d||d.z!=='monster'||Number(d.item?.controller??d.p)!==bp||!inertMonster1151(d.item)||
      !targetPermission644(st,alt,d)?.ok)
    return deny('El monstruo de destino alternativo no es verificable.');
  }else if(targetUid!=='DIRECT')return deny('Sin un monstruo adversario, el ataque alternativo debe ser directo.');
  if(!Array.isArray(st.lp)||st.lp.length!==2||!st.lp.every(v=>Number.isSafeInteger(v)&&v>=0))
   return deny('Los Life Points no se pueden verificar.');
  const eligibility=attackEligibility644(st,altId,targetUid==='DIRECT'?null:targetUid);
  if(!eligibility.ok)return deny(eligibility.reason||'El nuevo atacante no puede atacar.');
  // No se crea una segunda declaración para el original. El alternativo recibe
  // su única declaración propia, antes de resolver Damage Step.
  const ev=pushAttackEvent644(st,{player:ap,attacker:altId,attackerName:raw(alt.item.card?.name||''),
   defender:targetUid==='DIRECT'?null:raw(targetUid),defenderName:targetUid==='DIRECT'?'':raw(R.locate(st,targetUid)?.item?.card?.name||''),
   attackerController:ap,defenderController:targetUid==='DIRECT'?null:bp,direct:targetUid==='DIRECT',replay:true,alpha1151:true});
  markAttackDeclaration644(st,altId);
  dec.originalAttackerUid=oldId;dec.attackerUid=altId;dec.defenderUid=targetUid==='DIRECT'?null:raw(targetUid);
  dec.direct=targetUid==='DIRECT';dec.alpha1151Alternate=true;dec.eventId=ev.id;
  dec.opponentMonsterIdsAtDeclaration=[...current];
  bindAttackPhysical1154(dec,alt.item,targetUid==='DIRECT'?null:R.locate?.(st,targetUid)?.item);
  st.combat={...st.combat,attackerUid:altId,defenderUid:dec.defenderUid,declared:true,stage:'REPLAY_ALTERNATE_PENDING'};
  st.window={kind:'ATTACK DECLARATION REPLAY',open:true,alpha1151:true,eventId:ev.id};
  return{ok:true,pending:true,replay:true,alternate:true,originalAttackerUid:oldId,
   attackerUid:altId,targetUid:dec.defenderUid,alpha1151Bounded:true};
 }
 const original={direct:dec.direct,defenderUid:dec.defenderUid};
 if(targetUid==='DIRECT'){
  if(current.length!==0)return deny('No se permite ataque directo con monstruos adversarios en el campo.');
  const oldBinding=DECLARED_PHYSICAL_1154.get(dec);
  dec.direct=true;dec.defenderUid=null;
  bindAttackPhysical1154(dec,a.item,null);
  const candidate=beginDirectBattle644(st,dec);
  if(candidate?.ok!==true){DECLARED_PHYSICAL_1154.set(dec,oldBinding);dec.direct=original.direct;dec.defenderUid=original.defenderUid;
   return{...candidate,replay:true,alpha1150Bounded:true};}
  st.combat={...st.combat,defenderUid:null,declared:true};
  return{...candidate,replay:true,alpha1150Bounded:true};
 }
 if(current.length!==1)return deny('No hay un monstruo adversario para volver a seleccionar.');
 const d=R.locate?.(st,targetUid);
 if(!d||d.z!=='monster'||Number(d.item?.controller??d.p)!==bp)
  return deny('El nuevo objetivo no está en el campo rival.');
 const tp=targetPermission644(st,a,d);if(!tp.ok)return deny(tp.reason||'Objetivo de ataque no verificable.');
 const oldBinding=DECLARED_PHYSICAL_1154.get(dec);
  dec.defenderUid=raw(targetUid);dec.direct=false;bindAttackPhysical1154(dec,a.item,d.item);
  const candidate=vanillaOutcome1148(st,dec,a,d);
  if(candidate?.ok!==true){DECLARED_PHYSICAL_1154.set(dec,oldBinding);dec.defenderUid=original.defenderUid;dec.direct=original.direct;
  return candidate?{...candidate,replay:true,alpha1150Bounded:true}:deny('La batalla seleccionada requiere reglas especiales todavía sin verificar.');}
 st.combat={...st.combat,defenderUid:raw(targetUid),declared:true};
 return{...candidate,replay:true,alpha1150Bounded:true};
}
function continueAttack644(st){const dec=st?.__alpha644AttackDeclaration;if(!dec||dec.consumed)return{ok:false,reason:'No existe una declaración de ataque pendiente.'};
 const temporal=attackTemporalGuard1152(st,dec);if(!temporal.ok)return temporal;
 const identity=physicalAttackGuard1154(st,dec);if(!identity.ok)return identity;
 if(!dec.directStage){
  const prev=dec.opponentMonsterIdsAtDeclaration,opp=1-Number(st?.activePlayer);
  if(!Array.isArray(prev)||![0,1].includes(opp)||!Array.isArray(st?.zones?.[opp]?.monster))
   return{ok:false,partial:true,unverified:true,reason:'No se puede verificar el campo adversario de la declaración.',alpha1151Bounded:true};
  const now=st.zones[opp].monster.map(x=>raw(x?.uid));
  if(prev.length!==now.length||prev.some((uid,i)=>uid!==now[i]))
   return{ok:false,pending:true,replay:true,partial:true,unverified:true,reason:'REPLAY_REQUIRED: cambió el conjunto de monstruos adversarios antes del Damage Step.',alpha1151Bounded:true};
 }
 if(attackResponsesPending644(st))return{ok:false,pending:true,reason:'La ventana de declaración de ataque todavía tiene respuestas o Triggers pendientes.'};if(dec.direct){if(!dec.directStage)return beginDirectBattle644(st,dec);return finishDirectBattle644(st,dec)}if(typeof BASE_DAMAGE_644!=='function')return{ok:false,reason:'Damage Step base no disponible.'};const a0=R.locate?.(st,dec.attackerUid),d0=R.locate?.(st,dec.defenderUid);
if(!a0||a0.z!=='monster'||Number(a0.item?.controller??a0.p)!==Number(st.activePlayer))return{ok:false,unverified:true,partial:true,reason:'El atacante cambió de zona/control; no se acredita daño posterior.',alpha1149Bounded:true};
if(!d0||d0.z!=='monster'||Number(d0.item?.controller??d0.p)===Number(st.activePlayer))return{ok:false,unverified:true,partial:true,pending:true,replay:true,reason:'REPLAY_REQUIRED: el objetivo original ya no es válido; es necesario seleccionar otra acción.',alpha1149Bounded:true};
const candidate1148=vanillaOutcome1148(st,dec,a0,d0);if(candidate1148!==null)return candidate1148;
// Alpha 1153: ningún efecto de batalla sin prueba específica puede pasar al
// resolvedor histórico. Esta ruta aprobaba daño o destrucción incompatibles
// con el texto de cartas de Efecto. Mantener el estado original sin mutaciones.
return{ok:false,partial:true,unverified:true,alpha1153Bounded:true,
 reason:'Combate con efectos o condiciones físicas fuera de la cobertura verificada: no se aplica daño ni destrucción.'};
}
function damage644(st,attackerUid,defenderUid){const dec=st?.__alpha644AttackDeclaration;if(dec&&!dec.consumed){if(raw(dec.attackerUid)!==raw(attackerUid)||raw(dec.defenderUid)!==raw(defenderUid||''))return{ok:false,reason:'La llamada no coincide con la declaración de ataque pendiente.'};return continueAttack644(st)}const d=declareAttack644(st,attackerUid,defenderUid);if(!d.ok)return d;if(st?.__alpha644AutoBattle===true&&!attackResponsesPending644(st)&&!d.direct)return continueAttack644(st);return d}
function installBattle644(){if(R.damageStep?.__alpha644&&R.declareAttack?.__alpha644)return true;if(!BASE_DAMAGE_644)BASE_DAMAGE_644=R.damageStep;if(typeof BASE_DAMAGE_644!=='function')return false;damage644.__alpha644=true;damage644.__base=BASE_DAMAGE_644;declareAttack644.__alpha644=true;continueAttack644.__alpha644=true;R.damageStep=damage644;R.declareAttack=declareAttack644;R.continueAttack=continueAttack644;R.replayAttack=replayAttack1151;R.attackEligibility=attackEligibility644;return true}

/* ---------- single canonical activation wrapper ---------- */

let BASE_MAKE_644=typeof R.makeState==='function'?R.makeState:null,BASE_ADVANCE_PHASE_644=typeof R.advance==='function'?R.advance:null,BASE_NORMAL_644=typeof R.performNormalSummon==='function'?R.performNormalSummon:null,BASE_SPECIAL_644=typeof R.performSpecialSummon==='function'?R.performSpecialSummon:null,BASE_RESOLVE_644=typeof R.resolveTop==='function'?R.resolveTop:null;
function setMain1Start644(st){if(!st)return st;st.__alpha644Main1StartOpen=raw(st.phase).toUpperCase()==='MAIN 1';return st}
function consumeMain1Start644(st,p){if(st&&raw(st.phase).toUpperCase()==='MAIN 1'&&Number(st.activePlayer)===Number(p))st.__alpha644Main1StartOpen=false;return st}
function makeState644(opts={}){const st=BASE_MAKE_644?BASE_MAKE_644(opts):null;return setMain1Start644(st)}
function expireTurnModifiers644(st,endedTurn){for(let p=0;p<2;p++)for(const z of ['monster','spelltrap'])for(const it of arr(st?.zones?.[p]?.[z])){const m=it?.__alpha644EndTurnModifier;if(!m||Number(m.turn)!==Number(endedTurn))continue;if(m.hadCurrentAtk)it.currentAtk=m.baseCurrentAtk;else try{delete it.currentAtk}catch(_){it.currentAtk=Number(it?.card?.atk)||0}it.negatedEffect=!!m.prevNegatedEffect;it.disabled=!!m.prevDisabled;try{delete it.__alpha644EndTurnModifier}catch(_){it.__alpha644EndTurnModifier=null}}}
function advancePhase644(st,next){if(st?.__alpha1167DuelEnded||Array.isArray(st?.lp)&&st.lp.some(v=>v===0))return{ok:false,endedDuel:true,reason:'El duelo ha terminado: no se puede avanzar de fase.'};const beforeTurn=Number(st?.turn)||1,beforePhase=raw(st?.phase).toUpperCase(),r=BASE_ADVANCE_PHASE_644?BASE_ADVANCE_PHASE_644(st,next):{ok:false,reason:'Motor de fases no disponible.'};
 if(st?.__alpha644AttackDeclaration&&(Number(st?.turn)!==beforeTurn||raw(st?.phase).toUpperCase()!==beforePhase)){
  st.__alpha644AttackDeclaration.consumed=true;
  delete st.__alpha644AttackDeclaration;
  st.combat={...st.combat,stage:'ATTACK_CANCELLED_PHASE_CHANGE_1152'};
 }
 if(st&&Number(st?.turn)!==beforeTurn)expireTurnModifiers644(st,beforeTurn);if(st)st.__alpha644Main1StartOpen=raw(st.phase).toUpperCase()==='MAIN 1';return r}
function normal644(st,p,uid,tributes=[]){const terminal1168=terminalActionGate1168(st);if(terminal1168)return terminal1168;const r=BASE_NORMAL_644?BASE_NORMAL_644(st,p,uid,tributes):{ok:false,reason:'Motor de Invocación Normal no disponible.'};if(r?.ok)consumeMain1Start644(st,p);return r}
function special644(st,p,uid,procedure='EFFECT',chosen=[]){const terminal1168=terminalActionGate1168(st);if(terminal1168)return terminal1168;const r=BASE_SPECIAL_644?BASE_SPECIAL_644(st,p,uid,procedure,chosen):{ok:false,reason:'Motor de Invocación Especial no disponible.'};if(r?.ok)consumeMain1Start644(st,p);return r}
function randomExtraSpec644(c,e){const parsed=R.parseCard?.(c)||{},all=raw(parsed?.text||c?.desc||c?.text||'');const eff=raw(e?.raw||e?.resolution||'');let m=eff.match(/banish\s+(\d+)\s+or\s+(\d+)\s+random(?:ly)?\s+face-down cards? from your extra deck,?\s*face-down/i)||eff.match(/banish\s+(\d+)\s+or\s+(\d+)\s+random(?:ly)?[^.;]{0,30}cards? from your extra deck/i);if(!m)return null;const choices=[Number(m[1]),Number(m[2])].filter(n=>Number.isInteger(n)&&n>0).sort((a,b)=>a-b);if(!choices.length)return null;let dm=all.match(/draw\s+(\d+|one|a)\s+cards?\s+for every\s+(\d+)\s+cards? banished/i),drawPer=0,drawUnit=0;if(dm){drawPer=Number(dm[1])||1;drawUnit=Number(dm[2])||0}const lock=/cannot draw any cards by card effects/i.test(all);return{choices,drawPer,drawUnit,drawLock:lock,text:all}}
function pushEvent644(st,type,data={}){st.events=arr(st.events);const ev={id:st.events.length+1,type,data:clone(data),turn:Number(st.turn)||1,phase:raw(st.phase),activePlayer:Number(st.activePlayer)||0,priority:Number(st.priority)||0,alpha644:true,timestamp:Date.now()};st.events.push(ev);st.lastEvent=ev;return ev}
function moveDirect644(st,item,fromP,fromZ,toP,toZ,{faceUp=item?.faceUp}={}){const a=st?.zones?.[fromP]?.[fromZ],b=st?.zones?.[toP]?.[toZ];if(!Array.isArray(a)||!Array.isArray(b)||!item)return false;const i=a.findIndex(x=>x===item||raw(x?.uid)===raw(item?.uid));if(i<0)return false;a.splice(i,1);item.previousZone=fromZ;item.previousController=item.controller;item.controller=['deck','hand','gy','banished','extra'].includes(toZ)?(item.owner??toP):toP;item.faceUp=faceUp;b.push(item);return true}
function cleanupSpellTrap644(st,link,c){const q=R.locate?.(st,link?.uid);if(!q)return;const ty=low(c?.type||'');if((/spell|trap|magica|trampa/.test(ty))&&q.z==='spelltrap'&&!/continuous|field|equip|pendulum/.test(ty)){moveDirect644(st,q.item,q.p,q.z,q.item.owner??q.p,'gy',{faceUp:true});pushEvent644(st,'SEND',{player:q.item.owner??q.p,uid:q.item.uid,item:q.item.card?.name||link.card,from:'spelltrap',to:'gy',reason:'RESOLVE_SPELL_TRAP'})}}
function resolveRandomExtra644(st,link,c,e,spec){const p=Number(link.player)||0,extra=arr(st?.zones?.[p]?.extra),valid=spec.choices.filter(n=>extra.length>=n);if(!valid.length){st.chain.pop();return{ok:false,reason:`Se requieren al menos ${Math.min(...spec.choices)} cartas en el Extra Deck para resolver este efecto.`,alpha644:true}}const n=valid[0],chosen=extra.slice(0,n),moved=[];for(const item of chosen){if(moveDirect644(st,item,p,'extra',p,'banished',{faceUp:false})){item.__alpha644FaceDownBanished=true;moved.push(item.uid);pushEvent644(st,'BANISH',{player:p,uid:item.uid,item:item.card?.name||'',from:'extra',to:'banished',faceDown:true,random:true,sourceUid:link.uid,sourceCard:link.card})}}const draws=spec.drawUnit>0?Math.floor(moved.length/spec.drawUnit)*Math.max(1,spec.drawPer):0,drawn=[];for(let i=0;i<draws;i++){const it=arr(st?.zones?.[p]?.deck).shift();if(!it)break;st.zones[p].hand.push(it);if(st.analysis)st.analysis.draws=Number(st.analysis.draws||0)+1;drawn.push(it.uid);pushEvent644(st,'DRAW',{player:p,uid:it.uid,source:link.uid,effect:true})}if(spec.drawLock){st.__alpha644NoEffectDrawTurn=st.__alpha644NoEffectDrawTurn||{};st.__alpha644NoEffectDrawTurn[p]=Number(st.turn)||1}st.__alpha644RandomExtra=arr(st.__alpha644RandomExtra);st.__alpha644RandomExtra.push({turn:Number(st.turn)||1,player:p,card:link.card,effectId:link.effectId,count:n,choices:spec.choices.slice(),uids:moved.slice(),representative:true,identityUnknown:true,drawn:drawn.slice()});cleanupSpellTrap644(st,link,c);link.status='RESUELTA · EXACT644 STOCHASTIC';st.chain.pop();st.priority=st.chain.length?1-Number(st.chain.at(-1)?.player||0):1-p;pushEvent644(st,'RESOLVE',{chainId:link.id,status:link.status,randomExtra:true,count:n,identityUnknown:true});return{ok:true,partial:false,link,alpha644Exact:true,alpha644RandomExtra:true,randomExtraCount:n,randomExtraChoices:spec.choices.slice(),identityUnknown:true,drawn:drawn.length}}
function tempNegateAtkSpec644(c,e){const t=raw(c?.desc||c?.description||c?.text||'').replace(/\s+/g,' '),m=t.match(/Target 1 face-up monster on the field;\s*until the end of this turn, that target gains (\d+) ATK, but its effects are negated/i);if(!m)return null;return{atk:Number(m[1])||0,exact:true,text:m[0]}}
function resolveTempNegateAtk644(st,link,c,e,spec){const p=Number(link?.player)||0,uid=raw(arr(link?.targetUids)[0]);const q=uid?R.locate?.(st,uid):null;if(!q||q.z!=='monster'||q.item?.faceUp===false){st.chain.pop();return{ok:false,reason:'El objetivo debe ser 1 monstruo boca arriba en el Campo.',alpha644:true}}const it=q.item;if(it.__alpha644EndTurnModifier)return{ok:false,partial:true,reason:'Hay un modificador temporal previo sobre el objetivo que requiere composición exacta.',alpha644:true};const had=Object.prototype.hasOwnProperty.call(it,'currentAtk'),base=had?Number(it.currentAtk):(Number(it?.card?.atk)||0);it.__alpha644EndTurnModifier={turn:Number(st?.turn)||1,baseCurrentAtk:base,hadCurrentAtk:had,prevNegatedEffect:!!it.negatedEffect,prevDisabled:!!it.disabled,atkDelta:spec.atk};it.currentAtk=base+spec.atk;it.negatedEffect=true;it.disabled=true;if(st.analysis)st.analysis.negates=Number(st.analysis.negates||0)+1;cleanupSpellTrap644(st,link,c);link.status='RESUELTA · EXACT644 TEMP';st.chain.pop();st.priority=st.chain.length?1-Number(st.chain.at(-1)?.player||0):1-p;pushEvent644(st,'NEGATE',{player:p,targetUid:uid,target:q.item?.card?.name||'',sourceUid:link.uid,sourceCard:link.card,effect:true,untilEndTurn:true,atkDelta:spec.atk});pushEvent644(st,'RESOLVE',{chainId:link.id,status:link.status,tempNegateAtk:true});return{ok:true,partial:false,link,alpha644Exact:true,alpha644TempNegateAtk:true,targetUid:uid,atk:q.item.currentAtk,negated:true,expiresTurn:Number(st.turn)||1}}
function exactRuleEntry644(name){const k=low(name).replace(/[^a-z0-9]+/g,' ').trim();let hit=null;for(const rk of Object.keys(R))if(/^exactRuleRegistry\d+$/.test(rk)){const row=R[rk]?.[k];if(row?.exact===true)hit=row}const cr=R.cardScriptRegistry?.[k];if(cr?.exact===true)hit=cr;return hit}
function exactDispatch644(st,link,c,e){const rule=exactRuleEntry644(c?.name);if(!rule?.exact||!rule?.handler)return null;const m=raw(rule.handler).match(/alpha(\d+)/i),api=m?W['YGOAlpha'+m[1]]:null,dispatch=api?.dispatch;if(typeof dispatch!=='function')return null;const p=Number(link?.player)||0,targets=arr(link?.targetUids),ctx={sourceUid:link?.uid,effectId:link?.effectId,targetUid:targets[0]||null,targetUids:targets.slice(),mode:raw(e?.raw||e?.resolution||e?.activation||''),effect:raw(e?.raw||e?.resolution||''),startOfMain1:raw(st?.phase).toUpperCase()==='MAIN 1'&&st?.__alpha644Main1StartOpen===true};let r=null;try{r=dispatch(st,p,c?.name,ctx)}catch(err){return{ok:false,reason:`Handler exacto ${rule.handler} lanzó error: ${raw(err?.message||err)}`,alpha644ExactDispatch:true,error:true}}if(r==null)return null;if(!r?.ok)return{...r,alpha644ExactDispatch:true,handler:rule.handler};cleanupSpellTrap644(st,link,c);link.status=`RESUELTA · EXACT644 ${rule.handler}`;st.chain.pop();st.priority=st.chain.length?1-Number(st.chain.at(-1)?.player||0):1-p;pushEvent644(st,'RESOLVE',{chainId:link.id,status:link.status,exactHandler:rule.handler});return{...r,ok:true,partial:false,link,alpha644Exact:true,alpha644ExactDispatch:true,handler:rule.handler}}

function directKnownExact644(st,link,c,e){const n=low(link?.card||c?.name);if(!['sage with eyes of blue','branded fusion'].includes(n))return null;const apply=W.YGOAlpha310?.applyScript;if(typeof apply!=='function')return null;const p=Number(link?.player)||0,targets=arr(link?.targetUids),ctx={sourceUid:link?.uid,effectId:link?.effectId,targetUid:targets[0]||null,targetUids:targets.slice(),controlTargetUid:targets[0]||null,mode:raw(e?.raw||e?.resolution||e?.activation||''),effect:raw(e?.raw||e?.resolution||''),startOfMain1:raw(st?.phase).toUpperCase()==='MAIN 1'&&st?.__alpha644Main1StartOpen===true};let r=null;try{r=apply(st,p,c?.name||link?.card,ctx)}catch(err){return{ok:false,reason:`Fachada exacta applyScript lanzó error: ${raw(err?.message||err)}`,alpha644DirectExact:true,error:true}}if(r==null)return null;if(!r?.ok)return{...r,alpha644DirectExact:true};cleanupSpellTrap644(st,link,c);link.status=`RESUELTA · EXACT644 SCRIPT`;st.chain.pop();st.priority=st.chain.length?1-Number(st.chain.at(-1)?.player||0):1-p;pushEvent644(st,'RESOLVE',{chainId:link.id,status:link.status,directExact:true});return{...r,ok:true,partial:false,link,alpha644Exact:true,alpha644DirectExact:true}}
function resolveTop644(st){const terminal1168=terminalActionGate1168(st);if(terminal1168)return terminal1168;const link=arr(st?.chain).at(-1);if(link){const c=R.cardByName?.(link.card),e=c?effect644(c,link.effectId):null;const dk=c&&e?directKnownExact644(st,link,c,e):null;if(dk)return dk;const spec=e?randomExtraSpec644(c,e):null;if(spec)return resolveRandomExtra644(st,link,c,e,spec);const ts=e?tempNegateAtkSpec644(c,e):null;if(ts)return resolveTempNegateAtk644(st,link,c,e,ts);const ex=e?exactDispatch644(st,link,c,e):null;if(ex)return ex}return BASE_RESOLVE_644?BASE_RESOLVE_644(st):{ok:false,reason:'Motor de resolución no disponible.'}}
function exactRandomExtraAction644(a){return !!randomExtraSpec644(R.cardByName?.(a?.card)||{name:a?.card,desc:a?.effectText}, {raw:a?.effectText,resolution:a?.effectText})}
function randomExtraLaterDependency644(line,index){const acts=arr(line?.actions||line?.simulation?.actions);for(let i=index+1;i<acts.length;i++){const a=acts[i],t=low(`${a?.actionType||''} ${a?.effectText||''}`);if(/fusion summon|synchro summon|xyz summon|link summon|pendulum summon|from (?:your )?extra deck|extra deck/.test(t))return{dependent:true,step:i+1,card:raw(a?.card)}}return{dependent:false}}
function registerRandomExact644(c,e){if(!randomExtraSpec644(c,e))return false;R.exactRuleRegistry644=R.exactRuleRegistry644||{};R.exactRuleRegistry644[low(c?.name||'')]={exact:true,handler:'Alpha644 RANDOM_EXTRA_COMPOSITE_ABSTRACTION',source:'PSCT pattern + canonical state transition',stochastic:true};return true}

let BASE_ACTIVATE_644=null;
function bypassCondition644(c,eid,fn){const orig=R.parseCard;if(typeof orig!=='function')return fn();const key=low(c?.name||c?.id||'');R.parseCard=function(card){const out=orig.call(R,card);if(!out||low(card?.name||card?.id||'')!==key)return out;return{...out,effects:arr(out.effects).map(e=>Number(e?.id)===Number(eid)?{...e,condition:'If you have 0 or more cards in your hand',alpha644OriginalCondition:e.condition}:e)}};try{return fn()}finally{R.parseCard=orig}}
function activationSourceGate644(st,p,c,e,uid){const q=R.locate?.(st,uid),z=low(q?.z||''),t=low(`${e?.condition||''} ${e?.activation||''} ${e?.raw||e?.resolution||''}`);let allowed=null,reason='';if(/special summon this card\s*\(from your hand\)|special summon this card from your hand/.test(t)){allowed=['hand'];reason='Este efecto sólo puede Invocar esta carta desde la mano.'}else if(/banish this card from your hand or field/.test(t)){allowed=['hand','monster','spelltrap'];reason='Este efecto sólo puede activarse desde la mano o el Campo.'}else if(/banish this card from your hand/.test(t)){allowed=['hand'];reason='Este efecto requiere desterrar esta carta desde la mano.'}else if(/banish this card from your (?:gy|graveyard)/.test(t)){allowed=['gy'];reason='Este efecto requiere desterrar esta carta desde el GY.'}else if(/send this card from your hand to the (?:gy|graveyard)/.test(t)||/discard this card(?:;|,| to)/.test(t)){allowed=['hand'];reason='Este efecto requiere que esta carta esté en la mano.'}else if(/return this card from your (?:gy|graveyard) to/.test(t)){allowed=['gy'];reason='Este efecto requiere que esta carta esté en el GY.'}if(allowed&&!allowed.includes(z))return{ok:false,unverified:false,reason,sourceZone:z,allowed};if(/to your zone a link monster points to/.test(t)){const links=arr(st?.zones?.[p]?.monster).filter(x=>/link/i.test(raw(x?.card?.type||'')));if(!links.length)return{ok:false,unverified:false,reason:'Debes controlar un Link Monster que apunte a una zona disponible para esta Invocación.',sourceZone:z,allowed};const explicit=links.some(x=>arr(x?.linkedZones||x?.flags?.linkedZones||x?.pointsToZones).length>0);if(!explicit)return{ok:false,unverified:true,reason:'Hay un Link Monster, pero el estado no conserva todavía las zonas exactas a las que apunta; la Invocación queda fail-closed.',sourceZone:z,allowed}}return{ok:true,unverified:false,sourceZone:z,allowed}}
function activate644(st,p,c,uid,effectId,targets=[],costChoices=[]){const terminal1168=terminalActionGate1168(st);if(terminal1168)return terminal1168;const e=effect644(c,effectId);if(!e)return BASE_ACTIVATE_644?BASE_ACTIVATE_644(st,p,c,uid,effectId,targets,costChoices):{ok:false,reason:'Efecto no encontrado.'};const sg=activationSourceGate644(st,p,c,e,uid);if(!sg.ok)return{ok:false,reason:sg.reason,unverified:!!sg.unverified,alpha644SourceGate:true,sourceGate:sg};if(st?.__alpha644NoEffectDrawTurn?.[p]===Number(st?.turn||1)&&e?.semantic?.draw)return{ok:false,reason:'No puedes robar cartas por efectos durante el resto de este turno.',alpha644DrawLock:true};registerRandomExact644(c,e);const before=R.locate?.(st,uid),isST=/spell|trap|magica|trampa/.test(low(c?.type||'')),cardActivation=isST&&(before?.z==='hand'||(before?.z==='spelltrap'&&before?.item?.faceUp===false));const run=()=>{const spec=conditionSpec644(e?.condition||'');if(spec?.alpha644||spec?.kind==='ALL'||spec?.kind==='ANY'){const ca=conditionAllowed644(st,p,e,uid,c);if(!ca.ok)return{ok:false,reason:ca.reason,unverified:!!ca.unverified,alpha644Condition:true,spec:ca.spec};return bypassCondition644(c,effectId,()=>BASE_ACTIVATE_644?BASE_ACTIVATE_644(st,p,c,uid,effectId,targets,costChoices):{ok:false,reason:'Motor base no disponible.'})}return BASE_ACTIVATE_644?BASE_ACTIVATE_644(st,p,c,uid,effectId,targets,costChoices):{ok:false,reason:'Motor base no disponible.'}};const r=run();if(r?.ok){consumeMain1Start644(st,p);if(cardActivation)pushCanonicalEvent644(st,'CARD_ACTIVATED_CANON',{player:Number(p),uid:raw(uid),card:raw(c?.name||''),effectId,from:before?.z||'',type:raw(c?.type||'')})}return r}
function forceRule644(name,fn){try{Object.defineProperty(R,name,{configurable:true,enumerable:true,writable:true,value:fn});return R[name]===fn}catch(_){try{R[name]=fn;return R[name]===fn}catch(__){return false}}}
function installRules644(){let ok=true;if(!BASE_MAKE_644&&typeof R.makeState==='function')BASE_MAKE_644=R.makeState;if(!BASE_ADVANCE_PHASE_644&&typeof R.advance==='function')BASE_ADVANCE_PHASE_644=R.advance;if(!BASE_NORMAL_644&&typeof R.performNormalSummon==='function')BASE_NORMAL_644=R.performNormalSummon;if(!BASE_SPECIAL_644&&typeof R.performSpecialSummon==='function')BASE_SPECIAL_644=R.performSpecialSummon;if(!BASE_RESOLVE_644&&typeof R.resolveTop==='function')BASE_RESOLVE_644=R.resolveTop;if(!BASE_ACTIVATE_644&&typeof R.activate==='function')BASE_ACTIVATE_644=R.activate;if(typeof BASE_MAKE_644==='function'){makeState644.__alpha644=true;makeState644.__base=BASE_MAKE_644;ok=forceRule644('makeState',makeState644)&&ok}else ok=false;if(typeof BASE_ADVANCE_PHASE_644==='function'){advancePhase644.__alpha644Phase=true;advancePhase644.__base=BASE_ADVANCE_PHASE_644;ok=forceRule644('advance',advancePhase644)&&ok}else ok=false;if(typeof BASE_NORMAL_644==='function'){normal644.__alpha644=true;normal644.__base=BASE_NORMAL_644;ok=forceRule644('performNormalSummon',normal644)&&ok}else ok=false;if(typeof BASE_SPECIAL_644==='function'){special644.__alpha644=true;special644.__base=BASE_SPECIAL_644;ok=forceRule644('performSpecialSummon',special644)&&ok}else ok=false;if(typeof BASE_RESOLVE_644==='function'){resolveTop644.__alpha644=true;resolveTop644.__base=BASE_RESOLVE_644;ok=forceRule644('resolveTop',resolveTop644)&&ok}else ok=false;if(typeof BASE_ACTIVATE_644==='function'){activate644.__alpha644=true;activate644.__alpha620=true;activate644.__base=BASE_ACTIVATE_644;ok=forceRule644('activate',activate644)&&ok}else ok=false;if(!installBattle644())ok=false;W.YGORulingEngine=R;return ok}

/* ---------- proof reconstruction + exact top5 ---------- */
function snapshotZones644(s,p=0){if(s?.zones?.[p])return s.zones[p];if(Array.isArray(s?.players)){const q=s.players[p]||{};return{hand:arr(q.hand),monster:arr(q.monster),spelltrap:arr(q.spelltrap),gy:arr(q.gy),banished:arr(q.banished),extra:arr(q.extra),pendulum:arr(q.pendulum),field:arr(q.field),deck:p===0?arr(s?.deck):arr(q.deck)}}return{hand:arr(s?.hand),monster:arr(s?.monster),spelltrap:arr(s?.spelltrap),gy:arr(s?.gy),banished:arr(s?.banished),extra:arr(s?.extra),pendulum:arr(s?.pendulum),field:arr(s?.field),deck:arr(s?.deck)}}
function replayState644(s){if(!s||typeof s!=='object')return s;const z0=snapshotZones644(s,0),z1=snapshotZones644(s,1),active=Number(s?.activePlayer??s?.turnPlayer??0),out={...s,zones:[z0,z1],activePlayer:active,priority:Number(s?.priority??active),phase:raw(s?.phase||'MAIN 1'),turn:Number(s?.turn)||1,lp:clone(s?.lp||[8000,8000]),chain:clone(s?.chain||[]),analysis:clone(s?.analysis||{}),normalSummonAvailable:Array.isArray(s?.normalSummonAvailable)?clone(s.normalSummonAvailable):[!s?.normalSummonUsed,true],oncePerTurn:clone(s?.oncePerTurn||s?.usage?.oncePerTurn||{}),oncePerDuel:clone(s?.oncePerDuel||s?.usage?.oncePerDuel||{}),turnFlags:clone(s?.turnFlags||s?.usage?.turnFlags||[]),summonLocks:clone(s?.summonLocks||s?.restrictions?.summonLocks||[]),activationLocks:clone(s?.activationLocks||s?.restrictions?.activationLocks||[]),restrictionLocks:clone(s?.restrictionLocks||s?.restrictions?.restrictionLocks||[]),window:clone(s?.window||s?.restrictions?.window||null)};if(out.__alpha644Main1StartOpen==null&&raw(out.phase).toUpperCase()==='MAIN 1')out.__alpha644Main1StartOpen=Number(out?.analysis?.actions||0)===0;return out}
function countName644(s,name){const n=low(name),zs=['hand','monster','spelltrap','gy','banished','extra'];let sum=0;for(let p=0;p<2;p++){const q=snapshotZones644(s,p);for(const z of zs)sum+=arr(q?.[z]).filter(x=>low(x?.name||x?.card?.name||x)===n).length}return sum}
function transition644(a,name){const zs=['hand','monster','spelltrap','gy','banished','extra'],n=low(name),from=[],to=[];for(let p=0;p<2;p++){const bq=snapshotZones644(a?.before,p),aq=snapshotZones644(a?.after,p);for(const z of zs){const b=arr(bq?.[z]).filter(x=>low(x?.name||x?.card?.name||x)===n).length,c=arr(aq?.[z]).filter(x=>low(x?.name||x?.card?.name||x)===n).length;if(c<b)from.push(z);if(c>b)to.push(z)}}return{from:[...new Set(from)],to:[...new Set(to)]}}
function syntheticEvent644(acts,i,a){const nm=raw(a?.card),auid=raw(a?.uid||a?.sourceUid||a?.cardUid||''),unique=countName644(a?.before,nm)===1;for(let j=i-1;j>=0&&j>=i-8;j--){const x=acts[j],same=low(x?.card)===low(nm),type=raw(x?.actionType).toUpperCase(),mats=arr(x?.materials).map(v=>raw(typeof v==='object'?(v.uid||v.id||v.name):v));if(auid&&mats.includes(auid)){let method='';for(const m of ['LINK','SYNCHRO','XYZ','FUSION','RITUAL'])if(type.includes(m))method=m;return{event:{type:method?method+'_MATERIAL':'MATERIAL_USED',turn:Number(x?.turn||a?.before?.turn||1),data:{material:auid,materialName:nm,method,target:raw(x?.uid||x?.sourceUid||''),to:/XYZ/.test(method)?'overlay':'gy'}},unique}}if(same&&/NORMAL SUMMON/.test(type))return{event:{type:'NORMAL_SUMMON',turn:Number(x?.turn||a?.before?.turn||1),data:{card:nm,item:nm,uid:raw(x?.uid||x?.sourceUid||''),tributes:arr(x?.materials)}},unique};if(same&&/(SPECIAL|LINK|SYNCHRO|XYZ|FUSION|RITUAL).*SUMMON/.test(type)){let method='EFFECT';for(const m of ['LINK','SYNCHRO','XYZ','FUSION','RITUAL'])if(type.includes(m))method=m;return{event:{type:'SPECIAL_SUMMON',turn:Number(x?.turn||a?.before?.turn||1),data:{card:nm,item:nm,uid:raw(x?.uid||x?.sourceUid||''),method,from:low(x?.from||'')}},unique}}const tr=transition644(x,nm);if(tr.from.length&&tr.to.length){const from=tr.from[0],to=tr.to[0];return{event:{type:to==='banished'?'BANISH':'MOVE',turn:Number(x?.turn||a?.before?.turn||1),data:{card:nm,item:nm,uid:raw(x?.uid||x?.sourceUid||''),from,to}},unique}}}return{event:null,unique}}
function conditionAudit644(line){const acts=arr(line?.actions||line?.simulation?.actions),gaps=[];for(let i=0;i<acts.length;i++){const a=acts[i],c=R.cardByName?.(a?.card),e=c?effect644(c,a?.effectId):null;if(!e||!raw(e?.condition).trim())continue;if(!a?.before){gaps.push({step:i+1,card:raw(a?.card),reason:'STATE_BEFORE_MISSING_644'});continue}const syn=syntheticEvent644(acts,i,a),st={...replayState644(a.before),__alpha644SyntheticEvent:syn.event,__alpha644SourceUnique:syn.unique},ca=conditionAllowed644(st,Number(a?.player??st?.activePlayer??0)||0,e,raw(a?.uid||a?.sourceUid||a?.cardUid||''),c);if(ca.unverified)gaps.push({step:i+1,card:raw(a?.card),reason:'CONDITION_UNVERIFIED_644'});else if(!ca.ok)gaps.push({step:i+1,card:raw(a?.card),reason:'CONDITION_FALSE_644'})}return{pass:gaps.length===0,gaps}}
/* ---------- explicit selection / transition proof ---------- */
const HIGH_RISK_REASON_644='HIGH_RISK_EFFECT_REQUIRES_EXACT_HANDLER_613';
function detailedZones644(s){return s?.zonesDetailed&&typeof s.zonesDetailed==='object'?s.zonesDetailed:null}
function detailedLocate644(s,uid){const z=detailedZones644(s),k=raw(uid);if(!z||!k)return null;for(const [zone,rows] of Object.entries(z))for(const x of arr(rows))if(raw(x?.uid)===k)return{zone,item:x};return null}
function choiceBounds644(text){const s=low(text),m=s.match(/up to\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)/),words={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};if(m)return{kind:'UP_TO',min:1,max:Number(m[1])||words[m[1]]||0};if(/\bany number\b/.test(s))return{kind:'ANY_NUMBER',min:1,max:99};return null}
function transitionKind644(a,uid){const b=detailedLocate644(a?.before,uid),c=detailedLocate644(a?.after,uid);if(!b&&!c)return{ok:false,before:null,after:null};return{ok:true,before:b?.zone||null,after:c?.zone||null,beforeItem:b?.item||null,afterItem:c?.item||null}}
function operationTransition644(text,tr){const s=low(text),from=tr?.before,to=tr?.after;if(!tr?.ok)return false;
 if(/destroy|destruy/.test(s))return ['monster','spelltrap'].includes(from)&&!['monster','spelltrap'].includes(to);
 if(/banish|desterr/.test(s))return to==='banished';
 if(/return .*hand|devuelve .*mano/.test(s))return to==='hand';
 if(/return .*deck|shuffle .*deck|baraj.*deck|baraj.*mazo|shuffle .*into .*deck/.test(s))return to==='deck'||to==='extra';
 if(/send .*graveyard|send .*gy|manda .*cementerio|env[ií]a .*cementerio/.test(s))return to==='gy';
 if(/special summon|invoca.*especial/.test(s))return to==='monster'&&from!=='monster';
 if(/set .*spell|set .*trap|coloca .*m[aá]gica|coloca .*trampa/.test(s))return to==='spelltrap';
 if(/negate|niega/.test(s))return !!tr.afterItem?.negatedEffect||!!tr.afterItem?.disabled;
 return from!==to;
}
function laterOrderSensitive644(actions,index){for(let i=index+1;i<actions.length;i++){const s=low(`${actions[i]?.effectText||''} ${actions[i]?.result||''}`);if(/\bdraw\b|\broba\b|excavat|top of (?:your |the )?deck|parte superior del mazo|reveal the top|muestra la carta de la parte superior/.test(s))return true}return false}
function explicitSelectionProof644(line,index){const acts=arr(line?.actions||line?.simulation?.actions),a=acts[index],text=raw(a?.effectText||a?.resolutionText||''),bounds=choiceBounds644(text),ids=[...new Set(arr(a?.selectedTargets||a?.targetUids||a?.targets).map(x=>raw(typeof x==='object'?(x.uid||x.id):x)).filter(Boolean))];
 if(!bounds)return{exact:false,reason:'NO_EXPLICIT_CARDINALITY'};
 if(ids.length<bounds.min||ids.length>bounds.max)return{exact:false,reason:'CHOICE_CARDINALITY_INVALID',chosen:ids.length,bounds};
 if(!detailedZones644(a?.before)||!detailedZones644(a?.after))return{exact:false,reason:'DETAILED_UID_SNAPSHOT_MISSING',chosen:ids.length,bounds};
 const transitions=ids.map(uid=>({uid,...transitionKind644(a,uid)}));if(transitions.some(x=>!x.ok||!operationTransition644(text,x)))return{exact:false,reason:'TARGET_TRANSITION_UNPROVEN',chosen:ids.length,bounds,transitions};
 const shuffles=/shuffle|baraj/.test(low(text));if(shuffles&&laterOrderSensitive644(acts,index))return{exact:false,reason:'SHUFFLE_ORDER_LATER_OBSERVED',chosen:ids.length,bounds,transitions};
 return{exact:true,kind:bounds.kind,chosen:ids.length,bounds,transitions,deckOrderAbstracted:shuffles};
}
function choiceBranchProof644(a){const text=low(a?.effectText||a?.resolutionText||'');if(!/choose (?:1|one) of (?:these|the following) effects|elige (?:1|uno) de (?:estos|los siguientes) efectos/.test(text))return{exact:false,reason:'NO_CHOICE_BRANCH'};const v=a?.choiceIndex??a?.selectedChoice??a?.choice??a?.branch;if(v===undefined||v===null||v==='')return{exact:false,reason:'CHOICE_BRANCH_NOT_RECORDED'};return{exact:true,choice:v}}
function highRiskProof644(line,index){const a=arr(line?.actions||line?.simulation?.actions)[index];if(!a)return{exact:false,reason:'ACTION_MISSING'};const s=low(a?.effectText||a?.resolutionText||'');if(exactRandomExtraAction644(a)){const dep=randomExtraLaterDependency644(line,index);return dep.dependent?{exact:false,reason:'RANDOM_EXTRA_IDENTITY_LATER_OBSERVED_644',...dep}:{exact:true,reason:'RANDOM_EXTRA_RULE_EXACT_IDENTITY_ABSTRACTED_644',stochastic:true}};if(/up to\s+(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)|\bany number\b/.test(s))return explicitSelectionProof644(line,index);if(/choose (?:1|one) of (?:these|the following) effects|elige (?:1|uno) de (?:estos|los siguientes) efectos/.test(s))return choiceBranchProof644(a);return{exact:false,reason:'HIGH_RISK_FAMILY_NOT_CLOSED'} }
function highRiskAudit644(line){const acts=arr(line?.actions||line?.simulation?.actions),rows=[];for(let i=0;i<acts.length;i++){const s=low(acts[i]?.effectText||acts[i]?.resolutionText||'');if(/up to\s+(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)|\bany number\b|choose (?:1|one) of (?:these|the following) effects|elige (?:1|uno) de (?:estos|los siguientes) efectos/.test(s))rows.push({step:i+1,card:raw(acts[i]?.card),...highRiskProof644(line,i)})}return{version:VERSION,pass:rows.every(x=>x.exact),rows}}


/* ---------- Alpha644 · exact transition certificates for fixture-critical resolutions ---------- */
function snapItems644(s,z){return arr(s?.[z]||s?.zones?.[0]?.[z])}
function snapUid644(x){return raw(x?.uid||x?.id||'')}
function snapName644(x){return raw(x?.card?.name||x?.name||'')}
function snapType644(x){return raw(x?.card?.type||x?.type||'')}
function snapDesc644(x){return raw(x?.card?.desc||x?.desc||'')}
function snapMap644(s,z){return new Map(snapItems644(s,z).map(x=>[snapUid644(x),x]).filter(x=>x[0]))}
function moved644(before,after,from,to,pred=()=>true){const a=snapMap644(before,from),b=snapMap644(after,to),out=[];for(const [uid,x] of a)if(!snapMap644(after,from).has(uid)&&b.has(uid)&&pred(x,b.get(uid)))out.push({uid,before:x,after:b.get(uid)});return out}
function sageTransition644(a){if(low(a?.card)!=='sage with eyes of blue'||Number(a?.effectId)!==2)return null;const b=a?.before,f=a?.after;if(!b||!f)return{exact:false,reason:'SAGE_STATE_MISSING_644'};const source=moved644(b,f,'hand','gy',x=>low(snapName644(x))==='sage with eyes of blue');const sent=moved644(b,f,'monster','gy',x=>/effect monster|tuner effect|effect/i.test(low(snapType644(x))));const summoned=moved644(b,f,'deck','monster',x=>/blue-eyes/i.test(snapName644(x))&&/monster/i.test(low(snapType644(x))));if(!source.length)return{exact:false,reason:'SAGE_DISCARD_NOT_PROVEN_644'};if(!sent.length)return{exact:false,reason:'SAGE_TARGET_SEND_GY_NOT_PROVEN_644'};if(!summoned.length)return{exact:false,reason:'SAGE_BLUE_EYES_DECK_SUMMON_NOT_PROVEN_644'};return{exact:true,handler:'TRANSITION_SAGE_EFFECT2_644',source:source[0].uid,target:sent[0].uid,summoned:summoned[0].uid}}
function brandedFusionTransition644(a){if(low(a?.card)!=='branded fusion'||Number(a?.effectId)!==1)return null;const b=a?.before,f=a?.after;if(!b||!f)return{exact:false,reason:'BRANDED_FUSION_STATE_MISSING_644'};const spell=[...moved644(b,f,'hand','gy',x=>low(snapName644(x))==='branded fusion'),...moved644(b,f,'spelltrap','gy',x=>low(snapName644(x))==='branded fusion')];const fusion=moved644(b,f,'extra','monster',x=>/fusion/i.test(low(snapType644(x)))&&/fallen of albaz/i.test(snapDesc644(x)));const mat=[];for(const z of ['hand','deck','monster'])for(const x of moved644(b,f,z,'gy',q=>/monster/i.test(low(snapType644(q)))))mat.push({...x,from:z});const uniq=[...new Map(mat.map(x=>[x.uid,x])).values()];if(!spell.length)return{exact:false,reason:'BRANDED_FUSION_SPELL_GY_NOT_PROVEN_644'};if(fusion.length!==1)return{exact:false,reason:'BRANDED_FUSION_TARGET_NOT_PROVEN_644',fusionCount:fusion.length};if(uniq.length<2)return{exact:false,reason:'BRANDED_FUSION_MATERIALS_NOT_PROVEN_644',materials:uniq.length};if(!uniq.some(x=>low(snapName644(x.before))==='fallen of albaz'))return{exact:false,reason:'BRANDED_FUSION_ALBAZ_MATERIAL_NOT_PROVEN_644'};return{exact:true,handler:'TRANSITION_BRANDED_FUSION_644',fusion:fusion[0].uid,materials:uniq.slice(0,2).map(x=>x.uid),lock:'EXTRA_FUSION_ONLY'}}
function exactTransitionProof644(a){return sageTransition644(a)||brandedFusionTransition644(a)||null}
function allActionsExactByTransition644(acts,replay){const levels=arr(replay?.levels),rows=acts.map((a,i)=>{const tp=exactTransitionProof644(a);if(tp?.exact)return{exact:true,via:'TRANSITION',proof:tp};const lv=raw(levels[i]);if(/^(?:CORE|EXACT)/i.test(lv))return{exact:true,via:lv};if(a?.alpha644MechanicsProof?.exact===true||a?.mechanicsProof?.exact===true)return{exact:true,via:'MECHANICS_PROOF'};return{exact:false,via:lv||'UNPROVEN'}});return{pass:rows.length===acts.length&&rows.every(x=>x.exact),rows}}

function proof644(line){const base=A620.proof620?.(line)||{pass:false,replayPass:false,stateVerified:false,board:!!(line?.simulation?.finalBoard||line?.finalBoard),gaps:[]},acts=arr(line?.actions||line?.simulation?.actions);let replay=null;try{replay=W.YGOAlpha603?.replayCertificate603?.(line)||line?.alpha603Replay||line?.simulation?.replayCertificate||null}catch(_){}const gaps=arr(base.gaps).filter(g=>{const reason=raw(g?.reason);if(/ACTIVATION_CONDITION_(?:UNVERIFIED|FALSE)_(?:619|620)|STATE_BEFORE_MISSING_(?:619|620)/.test(reason))return false;if(reason===HIGH_RISK_REASON_644){const idx=Math.max(0,Number(g?.step||1)-1),hp=highRiskProof644(line,idx);if(hp.exact){if(acts[idx])acts[idx].alpha644MechanicsProof=hp;return false}}if(reason==='RESOLUTION_NOT_EXACT'){const idx=Math.max(0,Number(g?.step||1)-1),tp=exactTransitionProof644(acts[idx]);if(tp?.exact){if(acts[idx])acts[idx].alpha644TransitionProof=tp;return false}}return true}),ca=conditionAudit644(line);gaps.push(...ca.gaps);for(let i=0;i<acts.length;i++){if(exactRandomExtraAction644(acts[i])){const dep=randomExtraLaterDependency644(line,i);if(dep.dependent)gaps.push({step:i+1,card:raw(acts[i]?.card),reason:'RANDOM_EXTRA_IDENTITY_LATER_OBSERVED_644',dependentStep:dep.step,dependentCard:dep.card})}}const seen=new Set(),ded=[];for(const g of gaps){const k=JSON.stringify(g);if(!seen.has(k)){seen.add(k);ded.push(g)}}const transitionCert=allActionsExactByTransition644(acts,replay),transitionReplayPass=transitionCert.pass&&replay?.coreContinuity===true&&replay?.fullContinuity===true&&replay?.completeSnapshots===true&&replay?.boardAligned!==false&&Number(replay?.stateFidelity||0)>=100,legacyReplayPass=replay?.pass===true,replayPass=legacyReplayPass||transitionReplayPass,stateVerified=replay?.executionVerified===true||transitionReplayPass,authoritativeState=replay?.authoritativeState===true||transitionReplayPass,board=replay?replay.boardAligned!==false:base.board!==false;if(replay){line.alpha644Replay=replay;line.alpha603Replay=replay;line.simulation=line.simulation||{};line.simulation.replayCertificate=replay}return{...base,version:VERSION,gaps:ded,highRisk:highRiskAudit644(line),replay,transitionCert,board,stateVerified,authoritativeState,pass:ded.length===0&&board,replayPass:replayPass&&ded.length===0}}
/* ---------- catalog provenance / format-scope gate ---------- */
function sourceScope644(card){const c=card?.card||card||{},src=low(c?.source||''),type=low(c?.type||''),name=low(c?.name||'');let scope='MASTER',risk='NORMAL',reason='';
 if(/cards-rush|rush duel/.test(src)||/\brush\b/.test(type)){scope='RUSH';reason='Fuente/pool Rush Duel.'}
 else if(/cards-skills|skill card/.test(src)||/\bskill\b/.test(type)){scope='SKILL';reason='Skill Card / pool Speed-Duel Links.'}
 else if(/deckmaster/.test(src)||/deck master/.test(type)||/deck master functions/.test(name)){scope='DECKMASTER';reason='Contenido Deck Master no perteneciente al pool Master Duel estándar.'}
 if(/skills-unofficial|rush-prerelease|unofficial-new/.test(src))risk='EXPERIMENTAL';else if(/prerelease/.test(src))risk='PRERELEASE';else if(/unofficial/.test(src))risk='COMMUNITY_MIRROR';
 return{scope,risk,source:raw(c?.source||''),reason}}
function scopeCompatible644(scope,key){key=low(key);if(scope==='MASTER')return true;if(scope==='RUSH')return /rush/.test(key);if(scope==='SKILL')return /speed|duellinks/.test(key);if(scope==='DECKMASTER')return /deckmaster/.test(key);return false}
function provenanceAudit644(deck=W.deckState||{},key=W.__YGO_ACTIVE_BAN_KEY||'tcg'){const rows=[],seen=new Set();for(const z of ['main','extra','side'])for(const x of arr(deck?.[z])){const c=x?.card||x,k=raw(c?.id||c?.name);if(seen.has(k))continue;seen.add(k);const p=sourceScope644(c),compatible=scopeCompatible644(p.scope,key);rows.push({id:c?.id??null,name:raw(c?.name||k),zone:z,...p,compatible})}const incompatible=rows.filter(x=>!x.compatible),experimental=rows.filter(x=>x.risk==='EXPERIMENTAL'),prerelease=rows.filter(x=>x.risk==='PRERELEASE');return{version:VERSION,key:raw(key),pass:incompatible.length===0,unique:rows.length,incompatible,experimental,prerelease,communityMirror:rows.filter(x=>x.risk==='COMMUNITY_MIRROR').length,rows,policy:'La procedencia del proveedor no determina por sí sola legalidad. Sólo pools claramente incompatibles bloquean la certificación exacta; mirrors comunitarios se registran sin declarar ilegal la carta.'}}

function formatGate644(key=W.__YGO_ACTIVE_BAN_KEY||'tcg'){key=raw(key);const caps=W.YGOFormatCapabilities610||W.YGOFormatCapabilities609||W.YGOFormatCapabilities605||W.YGOFormatCapabilities604||{},c=caps[key]||null,master=/^(tcg|ocg)$/i.test(key),baseCertified=master||c?.certifiedCore===true,provenance=provenanceAudit644(W.deckState||{},key),certified=baseCertified&&provenance.pass;return{version:VERSION,key,certifiedExactSimulation:certified,capability:c,provenance,status:certified?'EXACT_CORE_ALLOWED':!baseCertified?'PARTIAL_FORMAT_FAIL_CLOSED':'INCOMPATIBLE_CARD_POOL_FAIL_CLOSED',reason:certified?'Formato y pool de cartas habilitados para prueba estricta.':!baseCertified?'El formato no tiene simulación completa certificada; no se publican combos exactos.':`El Deck contiene ${provenance.incompatible.length} carta(s) de un pool incompatible con ${key.toUpperCase()}; no se certifican combos exactos.`}}
/* ---------- global optimality certificate gate ---------- */
function optimalityAudit644(lines=W.comboLastAnalysis){const exact=arr(lines).slice(0,5),legacy=W.__YGO444_SEARCH||{},deep=W.__YGO365_SEARCH||{},diag=W.__YGO471_TOP5||W.__YGO644_EXHAUSTIVE_CERT||{},cert=W.__YGO644_EXHAUSTIVE_CERT||{};const frontier=cert.frontierExhausted===true,allActions=cert.allLegalActionsEnumerated===true,dominance=cert.stateDominanceSafe===true,objective=cert.objectiveComplete===true,top5=exact.length===5,globalOptimalityProven=frontier&&allActions&&dominance&&objective&&top5;const boundedStable=legacy.converged===true||deep.stable===true||diag.stable===true;return{version:VERSION,pass:globalOptimalityProven,globalOptimalityProven,frontierExhausted:frontier,allLegalActionsEnumerated:allActions,stateDominanceSafe:dominance,objectiveComplete:objective,top5Present:top5,boundedStable,legacyClaim:legacy.globalOptimalityClaim===true,certificate:cert,status:globalOptimalityProven?'GLOBAL_TOP5_OPTIMALITY_PROVEN':boundedStable?'BOUNDED_SEARCH_STABLE_NOT_GLOBAL':'GLOBAL_OPTIMALITY_UNPROVEN',policy:'Cinco líneas exactas no demuestran que sean las cinco mejores globales. Sólo un frontier exhaustivo con enumeración completa, poda dominante segura y función objetivo completa puede certificar optimalidad global.'}}

function top5Audit644(lines=W.comboLastAnalysis){const gate=formatGate644(),rows=arr(lines).slice(0,5).map((x,i)=>({rank:i+1,...proof644(x)})),exact=rows.filter(x=>x.pass&&x.replayPass&&x.stateVerified!==false&&x.board!==false).length,optimality=optimalityAudit644(lines);return{version:VERSION,pass:gate.certifiedExactSimulation&&rows.length>0&&rows.every(x=>x.pass),exactPass:gate.certifiedExactSimulation&&rows.length===5&&exact===5,globallyOptimal:optimality.pass,shown:rows.length,exact,rows,formatGate:gate,optimality,status:!gate.certifiedExactSimulation?'FORMAT_PARTIAL_NO_EXACT_TOP5':rows.length<5?'TOP5_EXACT_INCOMPLETE':exact===5?(optimality.pass?'TOP5_EXACT_GLOBAL_OPTIMAL':'TOP5_EXACT_BEST_FOUND'):'TOP5_GAPS_644'}}
let BASE_COMBO_644=null;
function rank644(lines){const gate=formatGate644();if(!gate.certifiedExactSimulation){W.comboLastAnalysis=[];try{W.renderComboVisualTop5?.([]);W.renderComboEndBoard?.([])}catch(_){}W.__YGO644_TOP5={version:VERSION,generated:arr(lines).length,shown:0,exact:0,status:'FORMAT_PARTIAL_NO_EXACT_COMBOS',formatGate:gate};return[]}const rows=arr(lines).map((line,index)=>{const p=proof644(line),score=Number(line?.finalScore??line?.score)||0;line.alpha644Proof=p;return{line,index,p,score}});rows.sort((a,b)=>Number(b.p.pass&&b.p.replayPass)-Number(a.p.pass&&a.p.replayPass)||Number(b.p.stateVerified)-Number(a.p.stateVerified)||b.score-a.score||a.index-b.index);const exact=rows.filter(x=>x.p.pass&&x.p.replayPass&&x.p.stateVerified!==false&&x.p.board!==false).slice(0,5).map(x=>x.line);W.comboLastAnalysis=exact;try{W.renderComboVisualTop5?.(exact);W.renderComboEndBoard?.(exact)}catch(_){}W.__YGO644_TOP5={version:VERSION,generated:rows.length,shown:exact.length,exact:exact.length,status:exact.length===5?'TOP5_EXACT':'TOP5_EXACT_INCOMPLETE',rejected:rows.length-exact.length,formatGate:gate};return exact}
function combo644(...args){if(typeof BASE_COMBO_644!=='function')return[];const r=BASE_COMBO_644.apply(this,args);return r&&typeof r.then==='function'?r.then(rank644):rank644(r)}
function installCombo644(){if(W.comboBuildCandidates?.__alpha644)return true;if(!BASE_COMBO_644)BASE_COMBO_644=W.comboBuildCandidates;if(typeof BASE_COMBO_644!=='function')return false;combo644.__alpha644=true;combo644.__alpha620=true;combo644.__alpha603Canonical=true;combo644.__base=BASE_COMBO_644;W.comboBuildCandidates=combo644;W.autoAnalyzeAllCombos=combo644;return true}

/* ---------- confidence/coverage, preserving the 10×10 score ---------- */
function coverage644(deck=W.deckState||{}){const cards=arr(deck?.main),seen=new Set();let unique=0,parsed=0,effects=0,conditions=0,exactConditions=0;for(const x of cards){const c=x?.card||x,k=raw(c?.id||c?.name);if(seen.has(k))continue;seen.add(k);unique++;let p=null;try{p=R.parseCard?.(c)||null}catch(_){}if(p)parsed++;for(const e of arr(p?.effects)){effects++;if(raw(e?.condition).trim()){conditions++;if(conditionSpec644(e.condition)?.exact)exactConditions++}}}const unknownConditions=Math.max(0,conditions-exactConditions),top=W.__YGO644_TOP5||{},gate=formatGate644(),parsedRate=unique?parsed/unique:0,condRate=conditions?exactConditions/conditions:1,topRate=Math.min(1,Number(top.exact||0)/5),formatRate=gate.certifiedExactSimulation?1:0,confidence=Math.max(0,Math.min(96,Math.round((parsedRate*.20+condRate*.45+topRate*.25+formatRate*.10)*100))),limitations=[];if(parsedRate<1)limitations.push('Hay cartas sin parseo estructurado.');if(unknownConditions)limitations.push(`${unknownConditions} condición(es) todavía no son exactas.`);if(topRate<1)limitations.push(`Top 5 exacto incompleto: ${Number(top.exact||0)}/5.`);if(!gate.certifiedExactSimulation)limitations.push(gate.reason);if(gate.provenance?.experimental?.length)limitations.push(`${gate.provenance.experimental.length} carta(s) provienen de una fuente experimental y requieren verificación de identidad/formato.`);return{version:VERSION,confidence,uniqueCards:unique,parsedCards:parsed,parsedRate,effects,conditions,exactConditions,unknownConditions,conditionCoverage:condRate,top5Exact:Number(top.exact||0),top5Coverage:topRate,formatGate:gate,limitations,policy:'La confianza mide cobertura demostrada; nunca aumenta la fuerza 10×10 del mazo.'}}
let BASE_SCORE_644=null;
const SCORE_KEYS_644=['consistency','offense','resilience','control','early','mid','late','interaction','attraction','versatility'];
const SCORE_EVIDENCE_CAP_644=[.72,.78,.82,.82,.72,.82,.82,.86,.68,.82];
function clamp644(x,a=0,b=1){x=Number(x);return Number.isFinite(x)?Math.max(a,Math.min(b,x)):a}
function certifiedSignals644(out){const s=out?.meta?.simulationCertified||{},signals=s?.signals||{};const valid=SCORE_KEYS_644.every(k=>Number.isFinite(Number(signals?.[k])));return{available:s?.available===true&&valid,confidence:clamp644(s?.confidence||0),signals,metrics:s?.metrics||{},sourceVersion:s?.version||null}}
function evidenceBlend644(out,cov){const base=arr(out?.scores).slice(0,10).map(v=>Math.max(0,Math.min(10,Math.round(Number(v)||0))));while(base.length<10)base.push(0);const sim=certifiedSignals644(out),topRate=clamp644(cov?.top5Coverage||0),conditionRate=clamp644(cov?.conditionCoverage??1),parsedRate=clamp644(cov?.parsedRate??1),formatRate=cov?.formatGate?.certifiedExactSimulation===false?0:1;
 const evidenceQuality=sim.available?clamp644(sim.confidence*(.55+.45*topRate)*(.72+.18*conditionRate+.10*parsedRate)*(.75+.25*formatRate)):0;
 if(!sim.available||evidenceQuality<=0)return{scores:base,baseScores:base.slice(),evidenceScores:null,evidenceQuality:0,dominance:0,deltas:Array(10).fill(0),sim,policy:'Sin señales certificadas suficientes, Alpha644 conserva la puntuación base; nunca inventa evidencia.'};
 const evidence=SCORE_KEYS_644.map(k=>Math.max(0,Math.min(10,Math.round(clamp644(sim.signals[k])*10))));
 const fullProof=topRate===1&&conditionRate>=.95&&formatRate===1,deltaCap=fullProof?4:topRate>=.6?3:2,scores=base.map((b,i)=>{const w=SCORE_EVIDENCE_CAP_644[i]*evidenceQuality,target=Math.round(b*(1-w)+evidence[i]*w),lo=Math.max(0,b-deltaCap),hi=Math.min(10,b+deltaCap);return Math.max(lo,Math.min(hi,target))});
 const dominance=Math.round((SCORE_EVIDENCE_CAP_644.reduce((a,b)=>a+b,0)/SCORE_EVIDENCE_CAP_644.length)*evidenceQuality*1000)/10;
 return{scores,baseScores:base,evidenceScores:evidence,evidenceQuality:Math.round(evidenceQuality*1000)/1000,dominance,deltas:scores.map((v,i)=>v-base[i]),sim,deltaCap,policy:'Scoring v2: señales de líneas certificadas dominan sólo en proporción a prueba Top 5, cobertura de condiciones, parseo y formato. La cobertura modula confianza/peso; nunca suma fuerza por sí sola.'}}
function enrichScore644(r,deck){const out=r&&typeof r==='object'?r:{scores:Array(10).fill(0),total:0,finalScore:0},cov=coverage644(deck),blend=evidenceBlend644(out,cov),scores=blend.scores,total=scores.reduce((a,b)=>a+b,0),enriched={...out,scores,total,finalScore:total,meta:{...(out.meta||{}),engine:'Alpha 644 · evidence-first certified 10×10 evaluator',alpha644Coverage:cov,confidence:cov.confidence,confidencePolicy:cov.policy,alpha644EvidenceScoring:blend}};W.__YGO644_SCORE_CONFIDENCE=cov;W.__YGO644_SCORE_EVIDENCE=blend;return enriched}
function score644(deck=W.deckState||{}){if(typeof BASE_SCORE_644!=='function')return enrichScore644({},deck);const r=BASE_SCORE_644(deck);return r&&typeof r.then==='function'?r.then(x=>enrichScore644(x,deck)):enrichScore644(r,deck)}
function installScore644(){if(W.scoreDeck?.__alpha644)return true;if(!BASE_SCORE_644)BASE_SCORE_644=typeof W.scoreDeck==='function'?W.scoreDeck.bind(W):null;if(!BASE_SCORE_644)return false;score644.__alpha644=true;score644.__base=BASE_SCORE_644;W.scoreDeck=score644;return true}
function scoreContract644(deck=W.deckState||{}){try{const r=W.scoreDeck?.(clone(deck)),s=arr(r?.scores).slice(0,10).map(Number),t=Number(r?.total??r?.finalScore),ev=r?.meta?.alpha644EvidenceScoring||null;return{pass:s.length===10&&s.every(x=>Number.isInteger(x)&&x>=0&&x<=10)&&t===s.reduce((a,b)=>a+b,0)&&(!ev||arr(ev.deltas).every(x=>Number.isInteger(Number(x))&&Math.abs(Number(x))<=4)),scores:s,total:t,coverage:r?.meta?.alpha644Coverage||null,evidence:ev}}catch(e){return{pass:false,error:raw(e?.message||e)}}}

/* ---------- consolidated audits / fixture corpus ---------- */
function rulesAudit644(){const c={name:'Example'},base={turn:3,activePlayer:0,phase:'BATTLE STEP',priority:0,chain:[],triggerQueue:[],pendingTriggers:[],lp:[4000,8000],zones:[{monster:[{uid:'u',controller:0,position:'ATK',card:c},{uid:'ally',controller:0,card:{name:'Light and Darkness Dragon',type:'Effect Monster',attribute:'LIGHT',race:'Dragon'}}],spelltrap:[],hand:[1,2,3],gy:[{card:{type:'Effect Monster'}},{card:{type:'Effect Monster'}},{card:{type:'Spell'}}],banished:[],extra:[],deck:[]},{monster:[{uid:'opp',controller:1,position:'ATK',card:{name:'Opp',type:'Effect Monster',atk:1000,attribute:'DARK',race:'Fiend'}},{uid:'opp2',controller:1,position:'ATK',card:{name:'Opp2',type:'Effect Monster',atk:2000}}],spelltrap:[],hand:[],gy:[],banished:[],extra:[],deck:[]}],events:[]},mk=(type,data={},turn=3)=>({type,data,turn}),chk=(cond,events=[],uid='u')=>conditionAllowed644({...base,events,lastEvent:events.at(-1)},0,{condition:cond},uid,c);const atk=mk('ATTACK_DECLARE',{player:0,attacker:'u',defender:'opp',direct:false}),oppAtk=mk('ATTACK_DECLARE',{player:1,attacker:'opp',defender:'u',direct:false}),locked=clone(base);locked.zones[0].monster[0].flags={alpha613CannotAttackTurn:3};const twice=clone(base);twice.zones[0].monster[0].flags={alpha613AttackLimitTurn:3,alpha613AttackLimit:2};const checks={andState:chk('If you control 2 or more monsters and have 3 or more cards in your GY').ok===true,numericOr:conditionSpec644('If you control 2 or more monsters')?.kind==='YOU_MONSTERS_GE',event:chk('If this card is Special Summoned',[mk('SPECIAL_SUMMON',{uid:'u'})]).ok===true,compositeEventState:chk('If this card is Special Summoned and you control 2 or more monsters',[mk('SPECIAL_SUMMON',{uid:'u'})]).ok===true,destroyEffect:chk('If this card is destroyed by card effect',[mk('DESTROY',{uid:'u',to:'gy',effect:true})]).ok===true,destroyUnknownClosed:chk('If this card is destroyed by card effect',[mk('DESTROY',{uid:'u',to:'gy'})]).unverified===true,history:chk('If this card was Special Summoned this turn',[mk('SPECIAL_SUMMON',{uid:'u'},3)]).ok===true,historyOldFalse:chk('If this card was Special Summoned this turn',[mk('SPECIAL_SUMMON',{uid:'u'},2)]).ok===false,namedSource:chk('If this card is Special Summoned by the effect of a "Blue-Eyes" monster',[mk('SPECIAL_SUMMON',{uid:'u',source:'Blue-Eyes White Dragon'})]).ok===true,oppMore:conditionAllowed644(base,0,{condition:'If your opponent controls more monsters than you do'},'',c).ok===false,declaresAttack:chk('When this card declares an attack',[atk]).ok===true,involvedAttack:chk('When an attack is declared involving this card',[oppAtk]).ok===true,opponentAttack:chk("When an opponent's monster declares an attack",[oppAtk]).ok===true,attackLock:attackEligibility644(locked,'u','opp').ok===false,defaultLimit:attackLimit644(base,base.zones[0].monster[0])===1,extraAttackLimit:attackLimit644(twice,twice.zones[0].monster[0])===2,directBlockedWithMonster:attackEligibility644(base,'u',null).ok===false,linkMaterial:chk('If this card is used as Link Material',[mk('LINK_MATERIAL',{material:'u',method:'LINK',to:'gy'})]).ok===true,synchroMaterialGy:chk('If this card is sent to the GY as Synchro Material',[mk('SYNCHRO_MATERIAL',{material:'u',method:'SYNCHRO',to:'gy'})]).ok===true,detachGy:chk('If this card is detached from an Xyz Monster and sent to the GY',[mk('COST_DETACH',{uid:'u',to:'gy'})]).ok===true,whenSummoned:chk('When this card is Special Summoned',[mk('SPECIAL_SUMMON',{uid:'u'})]).ok===true,mainPhase:conditionAllowed644({...base,phase:'MAIN 1'},0,{condition:'During your Main Phase'},'u',c).ok===true,oppTurn:conditionAllowed644({...base,activePlayer:1},0,{condition:"During your opponent's turn (Quick Effect)"},'u',c).ok===true,anyAttack:chk('When a monster declares an attack',[atk]).ok===true,targetedAttack:chk('When this card is targeted for an attack',[oppAtk]).ok===true,takeBattleDamage:chk('When you take battle damage',[mk('DAMAGE',{player:0,type:'BATTLE',amount:500})]).ok===true,opponentMonsterActivation:chk("When your opponent activates a monster effect (Quick Effect)",[mk('ACTIVATE',{player:1,card:{name:'Example',type:'Effect Monster'}})]).ok===true,directAttackVariant:chk("When an opponent's monster declares a direct attack",[mk('ATTACK_DECLARE',{player:1,attacker:'opp',defender:null,direct:true})]).ok===true,main1:conditionAllowed644({...base,phase:'MAIN 1'},0,{condition:'During your Main Phase 1'},'u',c).ok===true,oppEnd:conditionAllowed644({...base,phase:'END',activePlayer:1},0,{condition:"During your opponent's End Phase"},'u',c).ok===true,zoneGy:conditionAllowed644({...base,zones:[{...base.zones[0],gy:[...base.zones[0].gy,{uid:'u',card:c}],monster:base.zones[0].monster.filter(x=>x.uid!=='u')},base.zones[1]]},0,{condition:'If this card is in your Graveyard'},'u',c).ok===true,drawn:chk('When you draw this card',[mk('DRAW',{uid:'u'})]).ok===true,handOrGy:conditionAllowed644({...base,zones:[{...base.zones[0],hand:[{uid:'u',card:c}],monster:base.zones[0].monster.filter(x=>x.uid!=='u')},base.zones[1]]},0,{condition:'If this card is in your hand or GY'},'u',c).ok===true,pendExtra:chk('If this card is Pendulum Summoned from the Extra Deck',[mk('PENDULUM_SUMMON',{moved:[{uid:'u',name:'Example',from:'extra'}]})]).ok===true,tributeForSummon:chk('If this card is Tributed for a Tribute Summon',[mk('TRIBUTE_SUMMON',{uid:'u',item:'Example',from:'monster',to:'gy'})]).ok===true,endDamageBattled:conditionAllowed644({...base,phase:'END OF DAMAGE STEP',events:[mk('BATTLE_RESULT_CANON',{attacker:'u',attackerName:'Example',defender:'opp',defenderName:'Opp'})]},0,{condition:'At the end of the Damage Step, if this card battled'},'u',c).ok===true,normalOrFlip:chk('When this card is Normal or Flip Summoned',[mk('NORMAL_SUMMON',{uid:'u'})]).ok===true,flipOnly:chk('If this card is Flip Summoned',[mk('FLIP_SUMMON',{uid:'u'})]).ok===true,xyzAlias:chk('If it is Xyz Summoned',[mk('SPECIAL_SUMMON',{uid:'u',method:'XYZ'})]).ok===true,directBattleDamage:chk('When this card inflicts battle damage to your opponent by a direct attack',[mk('DAMAGE',{player:1,type:'BATTLE',amount:500,attacker:'u',direct:true})]).ok===true,usageChoice:conditionAllowed644(base,0,{condition:'Once per turn, you can either'},'u',c).ok===true,resolutionContinuation:conditionAllowed644(base,0,{condition:'If you do'},'u',c).ok===true};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,total:Object.keys(checks).length}}
function alpha644Audit(){const c={name:'Pot Pattern',type:'Normal Spell',desc:'At the start of your Main Phase 1: Banish 3 or 6 random face-down cards from your Extra Deck, face-down; draw 1 card for every 3 cards banished. For the rest of this turn after this card resolves, you cannot draw any cards by card effects.'},st={turn:1,activePlayer:0,phase:'MAIN 1',analysis:{actions:0},__alpha644Main1StartOpen:true,zones:[{monster:[],spelltrap:[],hand:[],gy:[],banished:[],extra:[],deck:[]},{monster:[],spelltrap:[],hand:[],gy:[],banished:[],extra:[],deck:[]}]},e={id:1,condition:'At the start of your Main Phase 1',raw:'Banish 3 or 6 random face-down cards from your Extra Deck, face-down',semantic:{banish:true}};const startOpen=conditionAllowed644(st,0,e,'x',c).ok===true;st.__alpha644Main1StartOpen=false;const startClosed=conditionAllowed644(st,0,e,'x',c).ok===false;const spec=randomExtraSpec644(c,e);return{version:VERSION,pass:startOpen&&startClosed&&spec?.choices?.join(',')==='3,6'&&spec.drawLock===true,checks:{startOpen,startClosed,spec:!!spec,choices:spec?.choices,drawLock:spec?.drawLock}}}
function architecture644(){const checks={load:!!D.getElementById('alpha306LoadDeck'),delete:!!D.getElementById('alpha306DeleteDeck'),diana:!!D.querySelector('.diana-center-zone'),statsHost:!!D.getElementById('stats'),slidersHost:!!D.getElementById('sliders'),archetype:!!D.querySelector('#archetypeDropdown,#dbArchetype,#archetypeSelect,#archetype,.archetype-select,[data-archetype-select]'),top5:!!D.getElementById('comboVisualTop5'),endBoard:!!D.getElementById('comboEndBoard'),activate:R.activate?.__alpha644===true,combo:W.comboBuildCandidates?.__alpha644===true,score:W.scoreDeck?.__alpha644===true,battle:R.damageStep?.__alpha644===true,declareAttack:R.declareAttack?.__alpha644===true,multiTargetResolver:W.__YGO644_MULTI_TARGET_RESOLVER===true,makeState:R.makeState?.__alpha644===true,resolve:R.resolveTop?.__alpha644===true,normal:R.performNormalSummon?.__alpha644===true};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,scripts:D.scripts?.length||0,styles:D.querySelectorAll?.('style').length||0}}
async function fixtureCorpus644({limit=20,samples=12,depth=6}={}){const saved=clone(W.deckState),savedTop=clone(W.comboLastAnalysis),rows=[];let error=null;try{const fc=W.YGOAlpha357?.fixtureCatalog?.(true),entries=Object.entries(fc?.entries||{}).filter(([,e])=>!e?.aliasOf&&e?.fixture).slice(0,Math.max(1,Number(limit)||20));for(const[id,e]of entries){W.deckState=clone(e.fixture);installRules644();let rawLines=[];try{rawLines=typeof W.YGOAlpha604?.searchOpeningLines604==='function'?arr(W.YGOAlpha604.searchOpeningLines604(Number(samples)||12,Number(depth)||6)):arr(W.YGOAlpha306?.strictSearch?.(Math.min(4,Number(samples)||4),Math.min(5,Number(depth)||5)))}catch(ex){rows.push({id,label:e?.label||id,pass:false,error:raw(ex?.message||ex)});continue}const lines=rank644(rawLines),a=top5Audit644(lines),sc=scoreContract644(W.deckState);rows.push({id,label:e?.label||id,generated:rawLines.length,shown:a.shown,exact:a.exact,top5Exact:a.exactPass===true,scorePass:sc.pass,confidence:sc.coverage?.confidence??null,gaps:a.rows?.flatMap(x=>arr(x.gaps)).slice(0,20)||[],pass:a.exactPass===true&&sc.pass})}}catch(e){error=raw(e?.message||e)}finally{W.deckState=saved;W.comboLastAnalysis=savedTop;installRules644();installScore644();installCombo644()}const out={version:VERSION,pass:!error&&rows.length>0&&rows.every(x=>x.pass),exactPass:!error&&rows.length>=10&&rows.every(x=>x.top5Exact),fixtures:rows.length,exactFixtures:rows.filter(x=>x.top5Exact).length,error,rows,boundedSearch:true,samples:Number(samples)||12,depth:Number(depth)||6,policy:'Corpus Alpha644 usa búsqueda canónica acotada Alpha604 que respeta samples/depth; exige 5/5 líneas exactas y contrato 10×10. La aleatoriedad del Extra Deck conserva identidad abstracta y falla cerrado si una acción posterior depende de esa identidad.'};W.__YGO644_FIXTURE_CORPUS=out;return out}
function completionAudit644(){const base=A620.completionAudit620?.()||{},rules=rulesAudit644(),architecture=architecture644(),top5=top5Audit644(),optimality=top5.optimality||optimalityAudit644(),score=arr(W.deckState?.main).length?scoreContract644():{pass:true,status:'NO_DECK'},external=W.__YGO644_EXTERNAL_BROWSER_CERT||W.__YGO620_EXTERNAL_BROWSER_CERT||base.external||{pass:false,status:'EXTERNAL_BROWSER_REQUIRED'},universal=W.__YGO608_UNIVERSAL_CATALOG||base.universal||{},corpus=W.__YGO644_FIXTURE_CORPUS||W.__YGO620_FIXTURE_CORPUS||{pass:null,exactPass:null,status:'NOT_RUN'};const internalPass=rules.pass&&architecture.pass&&score.pass!==false,corePass=internalPass&&top5.pass!==false,universalPass=corePass&&top5.exactPass===true&&optimality.pass===true&&corpus.exactPass===true&&(universal.universalExact===true||universal.universalPass===true)&&external.pass===true;return{version:VERSION,internalPass,corePass,universalPass,status:universalPass?'UNIVERSAL_RELEASE_CERTIFIED':corePass?'CORE_644_OPTIMALITY_GATE_ADDED':'INTERNAL_GATES_OPEN',base,rules,architecture,score,top5,optimality,corpus,external,universal,remaining:{realBrowser:external.pass!==true,universalExactRules:!(universal.universalExact===true||universal.universalPass===true),top5Exact:top5.exactPass!==true,globalTop5Optimality:optimality.pass!==true,fixtureCorpus5of5:corpus.exactPass!==true,partialFormats:base?.remaining?.partialFormats||['Speed Duel skills/event list','Duel Links Speed','Duel Links Rush','Rush Duel advanced mechanics','GOAT/Time Wizard']}}}
async function runBrowserE2E644(opts={}){claimIdentity644();installRules644();installScore644();installCombo644();const base=await A620.runBrowserE2E620?.({...opts,corpus:false}),rules=rulesAudit644(),architecture=architecture644(),corpus=opts.corpus===false?{pass:null,status:'SKIPPED'}:await fixtureCorpus644({limit:opts.fixtureLimit||10,samples:opts.samples||12,depth:opts.depth||6}),top5=top5Audit644(),pass=base?.pass===true&&rules.pass&&architecture.pass&&(corpus.pass!==false);const out={version:VERSION,pass,status:pass?'BROWSER_E2E_644_PASS':'BROWSER_E2E_644_FAIL',base,rules,architecture,corpus,top5,ranAt:new Date().toISOString(),environment:{userAgent:raw(navigator?.userAgent),href:raw(location?.href)}};W.__YGO644_EXTERNAL_BROWSER_CERT=out;return out}
async function certify644(opts={}){claimIdentity644();installRules644();installScore644();installCombo644();if(opts.corpus===true)W.__YGO644_FIXTURE_CORPUS=await fixtureCorpus644({limit:opts.fixtureLimit||20,samples:opts.samples||12,depth:opts.depth||6});const completion=completionAudit644(),external=opts.runBrowserE2E===true?await runBrowserE2E644(opts):(W.__YGO644_EXTERNAL_BROWSER_CERT||W.__YGO620_EXTERNAL_BROWSER_CERT||{pass:false,status:'EXTERNAL_BROWSER_REQUIRED'}),universalPass=completion.corePass&&completion.top5.exactPass===true&&completion.optimality?.pass===true&&completion.corpus.exactPass===true&&(completion.universal?.universalExact===true||completion.universal?.universalPass===true)&&external.pass===true;const out={version:VERSION,pass:universalPass,corePass:completion.corePass,universalPass,status:universalPass?'UNIVERSAL_RELEASE_CERTIFIED':completion.corePass?'CORE_644_CERTIFIED_UNIVERSAL_GATES_REMAIN':'GATES_OPEN',completion,external,runtimeOwnership:{activate644:R.activate?.__alpha644===true,combo644:W.comboBuildCandidates?.__alpha644===true,score644:W.scoreDeck?.__alpha644===true},consolidatedFrom:['Alpha 621','Alpha 622','Alpha 623','Alpha 624','Alpha 625']};W.__YGO644_CERT=out;return out}
const API={...A620,VERSION,terminalActionGate1168,positiveLifePoints1168,claimIdentity644,conditionSpec644,conditionAllowed644,activationSourceGate644,directKnownExact644,materialMethod644,materialSourceMatch644,attackEligibility644,attackLimit644,directPermission644,targetPermission644,declareAttack644,continueAttack644,installBattle644,installRules644,snapshotZones644,replayState644,conditionAudit644,exactTransitionProof644,sageTransition644,brandedFusionTransition644,proof644,formatGate644,top5Audit644,installCombo644,coverage644,certifiedSignals644,evidenceBlend644,choiceBounds644,explicitSelectionProof644,choiceBranchProof644,highRiskProof644,highRiskAudit644,randomExtraSpec644,randomExtraLaterDependency644,exactRuleEntry644,exactDispatch644,tempNegateAtkSpec644,expireTurnModifiers644,alpha644Audit,runtimeDebug644:()=>({same:R===W.YGORulingEngine,make:R.makeState?.name,resolve:R.resolveTop?.name,activate:R.activate?.name,bases:{make:BASE_MAKE_644?.name,resolve:BASE_RESOLVE_644?.name,activate:BASE_ACTIVATE_644?.name}}),sourceScope644,provenanceAudit644,optimalityAudit644,installScore644,scoreContract644,rulesAudit644,architecture644,completionAudit644,fixtureCorpus644,runBrowserE2E644,certify644};
W.YGOAlpha644=API;installRules644();installScore644();installCombo644();claimIdentity644();if(W.YGOApp){W.YGOApp.release644=API;W.YGOApp.runtime=API;W.YGOApp.canonical=API}D.documentElement.dataset.alpha644='bounded-corpus-start-main1-random-extra-composite-runtime';
let __boot644Done=false;const boot=()=>{if(__boot644Done)return;__boot644Done=true;installRules644();installScore644();installCombo644();claimIdentity644()};if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();/* Alpha988 cleanup: redundant identity microtask 644 removed */
})();

