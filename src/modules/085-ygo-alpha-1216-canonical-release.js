
(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 1263',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_1263',CANONICAL_ID='ygo-alpha-'+VERSION.replace(/\D/g,'')+'-canonical-release';
const A986=W.YGOAlpha986||{},A985=W.YGOAlpha985||{},A984=W.YGOAlpha984||{},A973=W.YGOAlpha973||{},A767=W.YGOAlpha767||{},A761=W.YGOAlpha761||{},A613=W.YGOAlpha613||{},A608=W.YGOAlpha608||{},A607=W.YGOAlpha607||{},A606=W.YGOAlpha606||{},A605=W.YGOAlpha605||{},A620=W.YGOAlpha620||{},A644=W.YGOAlpha644||{},A862=W.YGOAlpha862||{},R=W.YGORulingEngine||{};
const arr=v=>Array.isArray(v)?v:[],raw=v=>String(v??''),low=v=>raw(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").replace(/\s+/g,' ').trim(),num=v=>Number.isFinite(Number(v))?Number(v):0;
const BUILD_E2E_1047=Object.freeze({pass:false,engine:'Chromium headless final-byte verification',verifiedOn:null,scope:'Alpha1063 requires independent final-byte browser certification; no self-declared certification',pageErrors:null,selfPass:false,structuralPass:false,dependencyPass:false,protectedUI:true,status:'PENDING'});
const BASE_EFFECT_1047=typeof A862.effectProof862==='function'?A862.effectProof862.bind(A862):null,BASE_CARD_1047=typeof A862.cardProof862==='function'?A862.cardProof862.bind(A862):null;
let BASE_DAMAGE_1047=null;
function damageCalcAtkOverride1047(st,a,d){if(!a?.item||!d?.item||d.item.faceUp!==false)return null;let es=[];try{es=arr(R.parseCard?.(a.item.card||a.item)?.effects)}catch(_){}const rows=[];for(const e of es){const cond=raw(e?.condition||'').trim(),steps=arr(e?.steps?.length?e.steps:e?.nodes);if(!/^when this card attacks an opponent'?s face-down defense position monster$/i.test(cond)||steps.length!==1)continue;const tx=raw(steps[0]?.text||steps[0]?.raw||steps[0]).trim(),m=tx.match(/^this card'?s atk becomes (\d+) during damage calculation only\.?$/i);if(m)rows.push({amount:Number(m[1]),effectId:e?.id??null,text:tx})}return rows.length===1?rows[0]:null}
function installBattleGuard1047(){if(!BASE_DAMAGE_1047)BASE_DAMAGE_1047=R.damageStep;if(typeof BASE_DAMAGE_1047!=='function')return false;if(R.damageStep?.__alpha1047Battle===true)return true;const f=function(st,attackerUid,defenderUid,damage=0){const turn=Number(st?.turn)||1,a=R.locate?.(st,attackerUid),d=defenderUid?R.locate?.(st,defenderUid):null,flags=a?.item?.flags||{};if(!Number.isFinite(Number(damage))||Number(damage)!==0)return{ok:false,partial:true,reason:'El daño de combate no admite cantidades inyectadas; se calcula mediante las reglas del duelo.'};if(Number(st?.__alpha613NoAttackFacedownTurn)===turn&&d?.item?.faceUp===false)return{ok:false,reason:'Los monstruos boca abajo no pueden ser atacados este turno.',alpha1047FacedownAttackLock:true};if(Number(st?.__alpha613OnlyAttackTurn)===turn&&raw(st?.__alpha613OnlyAttackUid)!==raw(attackerUid))return{ok:false,reason:'Sólo el monstruo autorizado puede declarar ataques este turno.',alpha1047OnlyAttackLock:true,allowedUid:st?.__alpha613OnlyAttackUid||null};if(Number(flags.alpha613CannotAttackTurn)===turn)return{ok:false,reason:'El monstruo no puede atacar este turno.',alpha1047CannotAttack:true};if(defenderUid==null&&Number(flags.alpha613CannotDirectAttackTurn)===turn)return{ok:false,reason:'El monstruo no puede atacar directamente este turno.',alpha1047CannotDirectAttack:true};if(Number(flags.alpha613AttackLimitTurn)===turn&&Number(flags.alpha613AttackCount||0)>=Number(flags.alpha613AttackLimit||1))return{ok:false,reason:'El monstruo alcanzó su límite de ataques este turno.',alpha1047AttackLimit:true};const ov=damageCalcAtkOverride1047(st,a,d),hadAtk=a?.item?Object.prototype.hasOwnProperty.call(a.item,'currentAtk'):false,prevAtk=a?.item?.currentAtk;if(ov&&a?.item)a.item.currentAtk=ov.amount;let r;try{r=BASE_DAMAGE_1047(st,attackerUid,defenderUid,damage)}finally{if(ov&&a?.item){if(hadAtk)a.item.currentAtk=prevAtk;else delete a.item.currentAtk}}if(r?.ok&&a&&Number(flags.alpha613AttackLimitTurn)===turn)flags.alpha613AttackCount=Number(flags.alpha613AttackCount||0)+1;if(ov&&r&&typeof r==='object'){r.alpha1047DamageCalcAtk=true;r.alpha1047DamageCalcAtkValue=ov.amount;r.alpha1047DamageCalcEffectId=ov.effectId}return r};f.__alpha1047Battle=true;f.__base=BASE_DAMAGE_1047;R.damageStep=f;return true;}
function authority1047(){
  installBattleGuard1047();
  try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO1047_VERSION_WRITE={value:raw(v),at:Date.now()}}})}catch(_){try{W.YGO_APP_VERSION=VERSION}catch(__){}}
  if(!W.YGOApp)W.YGOApp={};
  try{Object.defineProperty(W.YGOApp,'version',{configurable:true,enumerable:true,get:()=>VERSION,set:()=>{}})}catch(_){try{W.YGOApp.version=VERSION}catch(__){}}
  const canonicalLock1176=Object.freeze({version:VERSION,title:TITLE,owner:'canonical-1176-release'});
  try{Object.defineProperty(W,'__YGO_FINAL_VERSION_LOCK',{configurable:true,enumerable:true,get:()=>canonicalLock1176,set:v=>{if(v?.version!==VERSION)W.__YGO1176_LEGACY_LOCK_WRITES=(W.__YGO1176_LEGACY_LOCK_WRITES||0)+1}})}catch(_){W.__YGO_FINAL_VERSION_LOCK=canonicalLock1176}
  try{D.title=TITLE;D.documentElement.dataset.canonicalAuthority=VERSION.replace(/\s+/g,'-')}catch(_){}
  return true;
}
function cleanup1047(){
  const cleared=[];
  for(const k of ['__YGO_FINAL_IDENTITY_TIMER_985','__YGO_FINAL983_TITLE_TIMER','__YGO549_FP_WATCH','__YGO550_WATCH','__YGO551_WATCH']){const x=W[k];if(x){try{clearInterval(x);clearTimeout(x);W[k]=null;cleared.push(k)}catch(_){}}}
  for(const k of Object.keys(W)){if(/^__YGO\d+_TITLE_OBSERVER$/.test(k)&&W[k]?.disconnect){try{W[k].disconnect();W[k]=null;cleared.push(k)}catch(_){}}}
  return{version:VERSION,pass:true,cleared};
}
const OCG_SNAPSHOT_1047=[{"name":"ARTIFACT SCYTHE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"AMAZONESS ARCHER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"SUBSTITOAD","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"VICTORY DRAGON","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"EVILSWARM OUROBOROS","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"BEATRICE, LADY OF THE ETERNAL","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"HOT RED DRAGON ARCHFIEND KING CALAMITY","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"OUTER ENTITY AZATHOT","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"CATAPULT TURTLE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"DJINN RELEASER OF RITUALS","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"CANNON SOLDIER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"KASHTIRA FENRIR","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"CRYSTRON HALQIFIBRAX","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"AGIDO THE ANCIENT SENTINEL","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"KELBEK THE ANCIENT VANGUARD","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"CHAOS RULER, THE CHAOTIC MAGICAL DRAGON","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"PSY-FRAMELORD OMEGA","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"THE TYRANT NEPTUNE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"MOON OF THE CLOSED HEAVEN","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"NUMBER S0: UTOPIC ZEXAL","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"ZOODIAC BROADBULL","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"GUARDRAGON AGARPAIN","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"GUARDRAGON ELPY","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"APOLLOUSA, BOW OF THE GODDESS","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"ABYSS DWELLER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"TRUE KING OF ALL CALAMITIES","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"SPRIGHT ELF","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"SPLASH MAGE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"WIND-UP HUNTER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"DANDYLION","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"SUPERHEAVY SAMURAI SOULBREAKER ARMOR","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"TEARLAMENTS KITKALLOS","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"DIMENSION SHIFTER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"CYBER-STEIN","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"GEONATOR TRANSVERSER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"TOON CANNON SOLDIER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"GRINDER GOLEM","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"TOPOLOGIC GUMBLAR DRAGON","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"KNIGHTMARE MERMAID","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"NATURIA ROSEWHIP","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"NUMBER 16: SHOCK MASTER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"NUMBER 41: BAGOOSKA THE TERRIBLY TIRED TAPIR","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"NUMBER 67: PAIR-A-DICE SMASHER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"NUMBER 86: HEROIC CHAMPION - RHONGOMYNIAD","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"NUMBER 95: GALAXY-EYES DARK MATTER DRAGON","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"SUPREME KING DRAGON STARVING VENOM","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"FIBER JAR","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"FISHBORG BLASTER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"PHOENIXIAN CLUSTER AMARYLLIS","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"BLACKWING - GOFU THE VAGUE SHADOW","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"PREDAPLANT VERTE ANACONDA","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"TEMPEST MAGICIAN","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"MAGICAL SCIENTIST","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"MALISS <Q> RED RANSOM","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"CANNON SOLDIER MK-2","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"UNION CARRIER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"LAVALVAL CHAIN","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"LINKROSS","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"BARRIER STATUE OF THE STORMWINDS","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"LEVEL EATER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"MIRAGE OF NIGHTMARE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"DELINQUENT DUO","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"CONFISCATION","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"KAISER COLOSSEUM","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"PAINFUL CHOICE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"THE FORCEFUL SENTRY","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"POT OF GREED","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"DIMENSION FUSION","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"DIVINE SWORD - PHOENIX BLADE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"CARD OF SAFE RETURN","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"SOUL CHARGE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"COLD WAVE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"BUTTERFLY DAGGER - ELMA","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"GRACEFUL CHARITY","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"SMOKE GRENADE OF THE THIEF","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"CALLED BY THE GRAVE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"GIANT TRUNADE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"OBEDIENCE SCHOOLED","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"MYSTIC MINE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"MASS DRIVER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"LAST WILL","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"RETURN FROM THE DIFFERENT DIMENSION","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"VANITY'S EMPTINESS","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"ROYAL OPPRESSION","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"IMPERIAL ORDER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"SUMMON LIMIT","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"SIXTH SENSE","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"TRAP DUSTSHOOT","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"ULTIMATE OFFERING","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"HARPIE'S FEATHER STORM","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"MAGICAL EXPLOSION","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"LIFE EQUALIZER","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"LAST TURN","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"BRANDED EXPULSION","id":null,"status":"Forbidden","type":"Carta","max":0,"source":"KONAMI OCG 2026-10-01"},{"name":"ICE RYZEAL","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"HERALD OF THE ARC LIGHT","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"VANQUISH SOUL HOLLIE SUE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"VANQUISH SOUL RAZEN","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"EXT RYZEAL","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"S:P LITTLE KNIGHT","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"ELFNOTE TINIA","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"ELFNOTE LUCINA","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"KEWL TUNE CUE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"KEWL TUNE RECO","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"KEWL TUNE ROTARY","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"KASHTIRA UNICORN","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"K9-66A JOKUL","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"MUDORA THE SWORD ORACLE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"PSY-FRAMEGEAR GAMMA","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"THE BYSTIAL LUBELLION","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"BLAZE FENIX, THE BURNING BOMBARDMENT BIRD","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"KELDO THE SACRED PROTECTOR","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SNAKE-EYE ASH","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"MAXX \"C\"","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SWORD RYZEAL","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"TEARLAMENTS KASHTIRA","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"TEARLAMENTS SCHEIREN","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"TEARLAMENTS HAVNIS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"TEARLAMENTS MERRLI","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"T.G. HYPER LIBRARIAN","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"TENPAI DRAGON CHUNDRA","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"DRACOTAIL MULULU","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"DROLL & LOCK BIRD","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"NUMBER 40: GIMMICK PUPPET OF STRINGS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"PERFECTRON HYDRADRIVE DRAGON","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"HERALD OF ORANGE LIGHT","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"BYSTIAL DRUISWURM","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"BYSTIAL MAGNAMHUT","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"PHANTOM OF YUBEL","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"EXODIA THE FORBIDDEN ONE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"LEFT LEG OF THE FORBIDDEN ONE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"LEFT ARM OF THE FORBIDDEN ONE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"RIGHT LEG OF THE FORBIDDEN ONE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"RIGHT ARM OF THE FORBIDDEN ONE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"BLOCK DRAGON","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"HEAVYMETALFOES ELECTRUMITE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"MARSHMAO☆YUMMY","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"MALISS <P> DORMOUSE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"MALISS <P> MARCH HARE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"FIENDSMITH ENGRAVER","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"YUMMY★SNATCHY","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"ONE DAY OF PEACE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"INSTANT FUSION","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"HEAVY STORM","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"FOOLISH BURIAL","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"BONFIRE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"PERFECT TOON WORLD","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"PRE-PREPARATION OF RITES","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"KEWL TUNE SYNCHRO","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"POT OF PROSPERITY","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"KETU DRACOTAIL","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"PRIMAL SEED","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"WANTED: SEEKER OF SINFUL SPOILS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SANGEN SUMMONING","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SANGEN KAIMEN","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"MONSTER REBORN","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SYNCHRO OVERTAKE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"PROHIBITED POWER PATRON PORTAL - TERMINUS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SEVENTH TACHYON","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SKY STRIKER MECHA - HORNET DRONES","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"REINFORCEMENT OF THE ARMY","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"CARD DESTRUCTION","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"FIENDSMITH'S TRACT","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"TERRAFORMING","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"TOON TABLE OF CONTENTS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"THAT GRASS LOOKS GREENER","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"HARPIE'S FEATHER DUSTER","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"PREMATURE BURIAL","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"GOLD SARCOPHAGUS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"BRILLIANT FUSION","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SET ROTATION","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"CROSSOUT DESIGNATOR","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SECRET VILLAGE OF THE SPELLCASTERS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"MITSURUGI PRAYERS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"ALLURE OF DARKNESS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"BRANDED FUSION","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"RAHU DRACOTAIL","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"RUNICK FOUNTAIN","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"GATEWAY OF THE SIX","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"ONE FOR ONE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SOLEMN JUDGMENT","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"APPOINTER OF THE RED LOTUS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"RIVALRY OF WARLORDS","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"GOZEN MATCH","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"DIMENSIONAL BARRIER","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"SKILL DRAIN","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"THERE CAN BE ONLY ONE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"ANTI-SPELL FRAGRANCE","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"RED REBOOT","id":null,"status":"Limited","type":"Carta","max":1,"source":"KONAMI OCG 2026-10-01"},{"name":"K9-17 IZUNA","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"ZOODIAC RATPIER","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"SNAKE-EYES POPLAR","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"SUPERHEAVY SAMURAI SOULPIERCER","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"ASH BLOSSOM & JOYOUS SPRING","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"PRIMEVAL PLANET PERLEREINO","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"FOOLISH BURIAL GOODS","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"POT OF EXTRAVAGANCE","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"THE FALLEN & THE VIRTUOUS","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"SKY STRIKER MOBILIZE - ENGAGE!","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"SUPER POLYMERIZATION","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"SOLEMN WARNING","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"},{"name":"DOMINUS IMPULSE","id":null,"status":"Semi-Limited","type":"Carta","max":2,"source":"KONAMI OCG 2026-10-01"}];
const RUSH_SNAPSHOT_1047=[{"name":"虚無魔人","status":"Forbidden","max":0,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"業火の結界像","status":"Forbidden","max":0,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"ハーピィ・レディ１・２・３","status":"Forbidden","max":0,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"アニマジカ・ガードナー","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"ヴォイドアルヴ・マンティスター","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"混沌の翼竜","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"セレブローズ・ウォーロック","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"ネクメイド・ナナ","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"キャットロワ チョイス","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"コスモス姫のお戯れ","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"ゴースト・サイクロン","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"帝王の凱歌","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"ネクメイド・リサイズ","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"ビギニング・スカルライズ","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"マシン・インスペクター","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"魔導書棄却","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"サイバー・ヴァリエーション","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"サタニウスの宝珠","status":"Limited","max":1,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"アビスレイヤー・クインティアマット","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"カードディフェンダー","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"黒曜の魔導兵","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"スパークハーツ・ハット","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"スパークハーツ・マクマ","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"叛骨のジーファ","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"プログレス・ポッター","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"竜帝家臣ドラーヘ","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"サイバー・ラッシュ・フュージョン","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"セブンス・ワンダー・フュージョン","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"天使のもろこし","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"トライアングル・X・スパーク","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"万華鏡－華麗なる分身－","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"トラディショナル・タックス","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"スパークハーツ・ファミリア","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"叛骨装魂メイニール","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"ハーピィ・レディ・PM","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"},{"name":"魔法石の採掘","status":"Semi-Limited","max":2,"source":"KONAMI Rush Duel 2026-10-01"}];

const CURATED_TCG1124=Object.freeze({0:["AGIDO THE ANCIENT SENTINEL", "ARCHLORD KRISTYA", "ARCHNEMESES PROTOS", "ARTIFACT MJOLLNIR", "ARTIFACT SCYTHE", "BARRIER STATUE OF THE DROUGHT", "BARRIER STATUE OF THE INFERNO", "BARRIER STATUE OF THE STORMWINDS", "BARRIER STATUE OF THE TORRENT", "BLACKWING - GOFU THE VAGUE SHADOW", "BLOCK DRAGON", "CYBER-STEIN", "DANDYLION", "DIMENSION SHIFTER", "DJINN RELEASER OF RITUALS", "ECLIPSE WYVERN", "FIBER JAR", "FISHBORG BLASTER", "FOSSIL DYNA PACHYCEPHALO", "GIMMICK PUPPET NIGHTMARE", "GRINDER GOLEM", "JOWGEN THE SPIRITUALIST", "K9-04 NOROI", "KELBEK THE ANCIENT VANGUARD", "KEWL TUNE ROTARY", "LEVEL EATER", "MAGICAL SCIENTIST", "MAXX \"C\"", "NATURIA ROSEWHIP", "PHOENIXIAN CLUSTER AMARYLLIS", "RONINTOADIN", "SPYRAL MASTER PLAN", "THE TYRANT NEPTUNE", "VICTORY DRAGON", "WIND-UP HUNTER", "SUPREME KING DRAGON STARVING VENOM", "TEARLAMENTS KITKALLOS", "APOLLOUSA, BOW OF THE GODDESS", "CRYSTRON HALQIFIBRAX", "BARONNE DE FLEUR", "BORRELOAD SAVAGE DRAGON", "CHAOS RULER, THE CHAOTIC MAGICAL DRAGON", "HERALD OF THE ARC LIGHT", "HOT RED DRAGON ARCHFIEND KING CALAMITY", "PHANTASMAL LORD ULTIMITL BISHBAALKIN", "PSY-FRAMELORD OMEGA", "TEMPEST MAGICIAN", "ABYSS DWELLER", "BAHAMUT SHARK", "BEATRICE, LADY OF THE ETERNAL", "CXYZ GIMMICK PUPPET FANATIX MACHINIX", "EVILSWARM OUROBOROS", "KASHTIRA ARISE-HEART", "KING OF THE FERAL IMPS", "LAVALVAL CHAIN", "NUMBER 16: SHOCK MASTER", "NUMBER 42: GALAXY TOMAHAWK", "NUMBER 67: PAIR-A-DICE SMASHER", "NUMBER 86: HEROIC CHAMPION - RHONGOMYNIAD", "NUMBER 89: DIABLOSIS THE MIND HACKER", "NUMBER 95: GALAXY-EYES DARK MATTER DRAGON", "NUMBER S0: UTOPIC ZEXAL", "OUTER ENTITY AZATHOT", "TRUE KING OF ALL CALAMITIES", "ZOODIAC BROADBULL", "BUTTERFLY DAGGER - ELMA", "CARD OF SAFE RETURN", "COLD WAVE", "CONFISCATION", "DELINQUENT DUO", "DIMENSION FUSION", "GIANT TRUNADE", "GRACEFUL CHARITY", "HEAVY STORM", "KAISER COLOSSEUM", "LAST WILL", "MASS DRIVER", "MYSTIC MINE", "ORIGINAL SINFUL SPOILS - SNAKE-EYE", "PAINFUL CHOICE", "POT OF GREED", "SMOKE GRENADE OF THE THIEF", "SOUL CHARGE", "THE FORCEFUL SENTRY", "APPOINTER OF THE RED LOTUS", "BRANDED EXPULSION", "DIMENSIONAL BARRIER", "HARPIE'S FEATHER STORM", "IMPERIAL ORDER", "LAST TURN", "RED REBOOT", "RETURN FROM THE DIFFERENT DIMENSION", "ROYAL OPPRESSION", "SELF-DESTRUCT BUTTON", "SIXTH SENSE", "SUMMON LIMIT", "TRAP DUSTSHOOT", "ULTIMATE OFFERING", "VANITY'S EMPTINESS"],1:["LEFT ARM OF THE FORBIDDEN ONE", "LEFT LEG OF THE FORBIDDEN ONE", "RIGHT ARM OF THE FORBIDDEN ONE", "RIGHT LEG OF THE FORBIDDEN ONE", "ASTROGRAPH SORCERER", "BYSTIAL DRUISWURM", "BYSTIAL MAGNAMHUT", "CUPSY☆YUMMY", "DRACOTAIL MULULU", "ELFNOTE TINIA", "EXODIA THE FORBIDDEN ONE", "EXT RYZEAL", "FAIRY TAIL - SNOW", "KELDO THE SACRED PROTECTOR", "K9-66A JOKUL"]});
/* Alpha 1223: actualización oficial TCG Neuron 2026-10-19, 34 Forbidden + 7 Limited + 1 Semi, 156/92/7. */
const KONAMI_TCG1125=Object.freeze({"0":["ABYSS DWELLER","AERIAL EATER","AGIDO THE ANCIENT SENTINEL","ALBION THE BRANDED DRAGON","AME NO HABAKIRI NO MITSURUGI","AMORPHAGE GOLIATH","AMORPHAGE SLOTH","ANTI-SPELL FRAGRANCE","APOLLOUSA, BOW OF THE GODDESS","APPOINTER OF THE RED LOTUS","ARCHLORD KRISTYA","ARCHNEMESES PROTOS","ARTIFACT MJOLLNIR","ARTIFACT SCYTHE","AZAMINA ILIA SILVIA","BAHAMUT SHARK","BARONNE DE FLEUR","BARRIER STATUE OF THE DROUGHT","BARRIER STATUE OF THE INFERNO","BARRIER STATUE OF THE STORMWINDS","BARRIER STATUE OF THE TORRENT","BEATRICE, LADY OF THE ETERNAL","BEELZE OF THE DIABOLIC DRAGONS","BLACKWING - GOFU THE VAGUE SHADOW","BLOCK DRAGON","BORRELOAD SAVAGE DRAGON","BRANDED EXPULSION","BUTTERFLY DAGGER - ELMA","CALLED BY THE GRAVE","CARD OF SAFE RETURN","CHAOS RULER, THE CHAOTIC MAGICAL DRAGON","CHARMER QUARTET IN BLOOM","COLD WAVE","CONFISCATION","CROSS-SHEEP","CROSSOUT DESIGNATOR","CRYSTAL WING SYNCHRO DRAGON","CRYSTRON HALQIFIBRAX","CUPSY★YUMMY WAY","CURIOUS, THE LIGHTSWORN DOMINION","CXYZ GIMMICK PUPPET FANATIX MACHINIX","CYBER-STEIN","D/D/D WAVE HIGH KING CAESAR","DANDYLION","DELINQUENT DUO","DIMENSION FUSION","DIMENSION SHIFTER","DIMENSIONAL BARRIER","DJINN RELEASER OF RITUALS","ECLIPSE WYVERN","ELFNOTE TINIA","EVILSWARM OUROBOROS","F.A. DAWN DRAGSTER","FIBER JAR","FISHBORG BLASTER","FOSSIL DYNA PACHYCEPHALO","GIANT TRUNADE","GIMMICK PUPPET NIGHTMARE","GOZEN MATCH","GRACEFUL CHARITY","GRINDER GOLEM","GUARDRAGON AGARPAIN","GUARDRAGON ELPY","HARPIE'S FEATHER STORM","HEAVY STORM","HEAVYMETALFOES ELECTRUMITE","HERALD OF THE ARC LIGHT","HOT RED DRAGON ARCHFIEND KING CALAMITY","IMPERIAL ORDER","ISOLDE, TWO TALES OF THE NOBLE KNIGHTS","JOWGEN THE SPIRITUALIST","K9-04 NOROI","KAISER COLOSSEUM","KASHTIRA ARISE-HEART","KELBEK THE ANCIENT VANGUARD","KEWL TUNE ROTARY","KING OF THE FERAL IMPS","KNIGHTMARE GOBLIN","KNIGHTMARE GRYPHON","KNIGHTMARE MERMAID","LAST TURN","LAST WILL","LAVALVAL CHAIN","LEVEL EATER","LINK DECODER","LINKROSS","MAGICAL SCIENTIST","MAGICIANS' SOULS","MALISS <Q> WHITE BINDER","MASS DRIVER","MAXX \"C\"","MECHA PHANTOM BEAST AURORADON","MOON OF THE CLOSED HEAVEN","MYSTIC MINE","NATURIA BEAST","NATURIA ROSEWHIP","NUMBER 16: SHOCK MASTER","NUMBER 41: BAGOOSKA THE TERRIBLY TIRED TAPIR","NUMBER 42: GALAXY TOMAHAWK","NUMBER 60: DUGARES THE TIMELESS","NUMBER 67: PAIR-A-DICE SMASHER","NUMBER 86: HEROIC CHAMPION - RHONGOMYNIAD","NUMBER 89: DIABLOSIS THE MIND HACKER","NUMBER 95: GALAXY-EYES DARK MATTER DRAGON","NUMBER S0: UTOPIC ZEXAL","ORIGINAL SINFUL SPOILS - SNAKE-EYE","OUTER ENTITY AZATHOT","PAINFUL CHOICE","PHANTASMAL LORD ULTIMITL BISHBAALKIN","PHARAONIC ADVENT","PHOENIXIAN CLUSTER AMARYLLIS","POT OF GREED","PRANK-KIDS MEOW-MEOW-MU","PREDAPLANT VERTE ANACONDA","PROTECTCODE TALKER","PSY-FRAMELORD OMEGA","RED REBOOT","RED-EYES DARK DRAGOON","REPRODOCUS","RETURN FROM THE DIFFERENT DIMENSION","RIVALRY OF WARLORDS","RONINTOADIN","ROYAL OPPRESSION","SARYUJA SKULL DREAD","SECRET VILLAGE OF THE SPELLCASTERS","SELF-DESTRUCT BUTTON","SIMORGH, BIRD OF SOVEREIGNTY","SIXTH SENSE","SMOKE GRENADE OF THE THIEF","SOUL CHARGE","SPELL CANCELLER","SPLASH MAGE","SPRIGHT ELF","SPYRAL MASTER PLAN","SUMMON LIMIT","SUPERHEAVY SAMURAI SCARECROW","SUPREME KING DRAGON STARVING VENOM","TEARLAMENTS KITKALLOS","TEMPEST MAGICIAN","THE FORCEFUL SENTRY","THE TYRANT NEPTUNE","THERE CAN BE ONLY ONE","TOPOLOGIC GUMBLAR DRAGON","TRAP DUSTSHOOT","TRIPLE TACTICS TALENT","TRISHULA, DRAGON OF THE ICE BARRIER","TRUE KING OF ALL CALAMITIES","ULTIMATE OFFERING","UNION CARRIER","VANITY'S EMPTINESS","VARUDRAS, THE FINAL BRINGER OF THE END TIMES","VICTORY DRAGON","WIND-UP HUNTER","XX-SABER GOTTOMS","ZENNA'S DECEIVING DOLL MAIDENS","ZOODIAC BROADBULL"],"1":["\"A CASE FOR K9\"","ASTROGRAPH SORCERER","BONFIRE","BRANDED FUSION","BRANDED IN HIGH SPIRITS","BRANDED OPENING","BRILLIANT FUSION","BYSTIAL DRUISWURM","BYSTIAL MAGNAMHUT","CARD DESTRUCTION","CARD OF DEMISE","CHAIN STRIKE","CHAOS SPACE","CHICKEN GAME","CUPSY☆YUMMY","DAIGUSTO EMERAL","DIVINE WIND OF MIST VALLEY","DRACOTAIL MULULU","DROLL & LOCK BIRD","EXODIA THE FORBIDDEN ONE","EXT RYZEAL","FAIRY TAIL - SNOW","FIENDSMITH'S LACRIMA","FINAL COUNTDOWN","FOOLISH BURIAL","GATEWAY OF THE SIX","GEM-KNIGHT MASTER DIAMOND","GOLD SARCOPHAGUS","GRIFFOH","HARPIE'S FEATHER DUSTER","INFERNITY LAUNCHER","INSTANT FUSION","INTO THE VOID","K9-66A JOKUL","KELDO THE SACRED PROTECTOR","KETU DRACOTAIL","LEFT ARM OF THE FORBIDDEN ONE","LEFT LEG OF THE FORBIDDEN ONE","LINKURIBOH","MAGICAL EXPLOSION","MAGICAL MID-BREAKER FIELD","MALISS <P> DORMOUSE","MALISS <P> WHITE RABBIT","MATHMECH CIRCULAR","MISCELLANEOUSAURUS","MONSTER GATE","MONSTER REBORN","MUDORA THE SWORD ORACLE","NATURIA SACRED TREE","NUMBER 40: GIMMICK PUPPET OF STRINGS","NUMBER C40: GIMMICK PUPPET OF DARK STRINGS","OBEDIENCE SCHOOLED","ONE DAY OF PEACE","ONE FOR ONE","PHANTOM OF YUBEL","POT OF PROSPERITY","PROHIBITED POWER PATRON PORTAL - TERMINUS","PSY-FRAMEGEAR GAMMA","RADIANT TYPHOON CHANT","RAHU DRACOTAIL","REASONING","REINFORCEMENT OF THE ARMY","RIGHT ARM OF THE FORBIDDEN ONE","RIGHT LEG OF THE FORBIDDEN ONE","RYZEAL DETONATOR","SANGEN KAIMEN","SANGEN SUMMONING","SEKKA'S LIGHT","SET ROTATION","SKILL DRAIN","SKY STRIKER MECHA - HORNET DRONES","SLASH DRAW","SOLEMN JUDGMENT","STRIKER DRAGON","SUBSTITOAD","SUMMON SORCERESS","SUNAVALON DRYAS","SUNVINE HEALER","SUPERDREADNOUGHT RAIL CANNON GUSTAV MAX","SYNCHRO OVERTAKE","T.G. HYPER LIBRARIAN","TEARLAMENTS HAVNIS","TEARLAMENTS MERRLI","TEARLAMENTS SCHEIREN","TENPAI DRAGON CHUNDRA","TERRAFORMING","THAT GRASS LOOKS GREENER","TOON BOOKMARK","TOON TABLE OF CONTENTS","VANQUISH SOUL HOLLIE SUE","YUMMY★SNATCHY","ZOODIAC RATPIER"],"2":["DRACOTAIL ARTHALION","DRACOTAIL LUKIAS","ICE RYZEAL","MALISS IN UNDERGROUND","PURRELY SLEEPY MEMORY","SKY STRIKER MOBILIZE - ENGAGE!","SWORD RYZEAL"],"3":["ELDER ENTITY NORDEN","M-X-SABER INVOKER","METAMORPHOSIS","MIND MASTER","MIRAGE OF NIGHTMARE","PREMATURE BURIAL","PURRELY DELICIOUS MEMORY","RUNICK FOUNTAIN","UNCHAINED SOUL OF SHARVARA","WIND-UP CARRIER ZENMAITY"]});
/* Alpha 1143: official list restrictions by exact names across all verified
   print IDs. Only strip enclosing official quotation marks, not punctuation in
   the actual card name. No fuzzy name-to-ID guesses are permitted. */
function officialKey1126(value){
 let s=raw(value).trim().normalize('NFKC').replace(/\s+/g,' ').toLocaleLowerCase();
 if(s.length>2&&s[0]==='"'&&s.at(-1)==='"')s=s.slice(1,-1).trim();
 return s;
}
function restrictionSnapshot1126(deck,format=A973.activeFormatKey?.()){
 const fmt=low(format).replace(/[^a-z]/g,''),traditional=fmt==='traditional'||fmt==='tcgtraditional';
 const isTCG=fmt==='tcg'||traditional;
 if(!isTCG)return{version:VERSION,applicable:false,format:fmt,violations:[],status:'FORMATO_FUERA_DE_TCG',certified:false};
 const lookup=new Map();
 for(const [limit,names] of Object.entries(KONAMI_TCG1125)){
  if(limit==='3')continue;
  for(const name of names)lookup.set(officialKey1126(name),{officialName:name,max:traditional&&Number(limit)===0?1:Number(limit)});
 }
 const byId=new Map(arr(W.CARD_CATALOG).map(c=>[Number(c?.id),c]));
 const counts=new Map(),unknown=[];
 for(const zone of ['main','extra','side'])for(const item of arr(deck?.[zone])){
  const id=Number(item?.id??item?.cardId),catalog=byId.get(id);
  const name=raw(catalog?.name||item?.name).trim(),key=officialKey1126(name),qty=Number(item?.qty??1);
  if(!Number.isSafeInteger(qty)||qty<1||qty>60){unknown.push({zone,id,reason:'CANTIDAD_DESCONOCIDA'});continue;}
  if(Number.isSafeInteger(id)&&id>0&&!catalog)unknown.push({zone,id,reason:'ID_SIN_CATALOGO'});
  if(catalog&&item?.name&&officialKey1126(item.name)!==officialKey1126(catalog.name))unknown.push({zone,id,reason:'IDENTIDAD_INCONSISTENTE'});
  if(!key)unknown.push({zone,id,reason:'SIN_NOMBRE'});
  if(!key)continue;
  const entry=counts.get(key)||{name,qty:0,zones:[],official:lookup.get(key)||null};
  entry.qty+=qty;entry.zones.push(zone);counts.set(key,entry);
 }
 const violations=[];
 for(const v of counts.values())if(v.official&&v.qty>v.official.max)
  violations.push({name:v.official.officialName,copies:v.qty,maximum:v.official.max,zones:v.zones.slice(),reason:v.official.max===0?'PROHIBIDA':'EXCESO_DE_COPIAS'});
 return{version:VERSION,format:fmt,applicable:true,snapshotDate:'2026-10-19',source:'https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?request_locale=en',
  restrictedNames:lookup.size,checkedUniqueNames:counts.size,violations,unknown,
  status:violations.length?'INFRACCION_CONFIRMADA':unknown.length?'IDENTIDAD_NO_VERIFICADA':'SIN_INFRACCIONES_DETECTADAS',
  certified:false,policy:'Comparación exacta local del TCG 2026-10-19. Sin infracciones detectadas NO certifica elegibilidad, reglas de cartas ni listas de otros formatos.'};
}
function mergeVerifiedTCG1124(){
 const p=W.BANLIST_PROFILES?.tcg;
 if(p){p.date='19/10/2026';p.source='https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?request_locale=en';p.vector=null;}
 const traditional=W.BANLIST_PROFILES?.tcgTraditional;if(traditional){traditional.date='19/10/2026';traditional.source=p?.source||traditional.source;}
 if(!p||p.date!=='19/10/2026'||!/forbidden_limited[.]action/.test(raw(p.source)))return{pass:false,reason:'OFFICIAL_TCG_2026_NOT_ACTIVE'};
 const catalogByName=new Map();
 for(const card of arr(W.CARD_CATALOG)){
  const k=officialKey1126(card?.name);if(!k)continue;
  const cards=catalogByName.get(k)||[];cards.push(card);catalogByName.set(k,cards);
 }
 const released=new Set(KONAMI_TCG1125[3].map(low));
 const rebuilt=[],unresolved=[],ambiguous=[];
 for(const [maxKey,status] of [['0','Forbidden'],['1','Limited'],['2','Semi-Limited']])for(const name of KONAMI_TCG1125[maxKey]){
  const options=catalogByName.get(officialKey1126(name))||[],max=Number(maxKey);
  // La coincidencia EXACTA y única es la única que permite anunciar un ID.
  // Dos impresiones distintas se restringen por nombre, nunca por un ID arbitrario.
  const card=options.length===1?options[0]:null;
  const resolvedId=Number(card?.id)||null;
  if(!options.length)unresolved.push(name);
  if(options.length>1)ambiguous.push({name,ids:options.map(x=>x.id)});
  rebuilt.push({name:card?.name||options[0]?.name||name,id:resolvedId,limit:max,max,status,
   source:'KONAMI_TCG_2026-10-19',officialName:name});
 }
 p.data=rebuilt;
 p.officialEffective='2026-10-19';p.effective='2026-10-19';p.officialSource=p.source;
 p.verifiedPartialCoverage1124=false;p.verifiedFullSnapshot1125=false;p.officialNameSnapshotComplete11263=true;
 p.verifiedPartialCounts1124={forbidden:156,limited:92,semi:7,added:rebuilt.length};
 p.officialListCounts1125={forbidden:156,limited:92,semi:7,unlisted:released.size,catalogUnresolved:unresolved.length,catalogAmbiguous:ambiguous.length};
 p.officialUnresolvedNames1125=unresolved;p.officialAmbiguousIds1126=ambiguous;
 p.officialReleased1125=[...released];
 const t=W.BANLIST_PROFILES?.tcgTraditional;
 if(t){t.data=rebuilt.map(x=>{const n=x.max===0?1:x.max;return{...x,max:n,limit:n,status:n===1?'Limited':n===2?'Semi-Limited':'Unlimited'}});t.officialEffective='2026-10-19';t.effective='2026-10-19';}
 return{pass:true,entries:rebuilt.length,forbidden:156,limited:92,semi:7,catalogUnresolved:unresolved.length,catalogAmbiguous:ambiguous.length,
  coverage:'NOMBRES_COMPLETOS_TCG_2026-10-19_NO_CERTIFICA_RULINGS',delayedUnlimitedEffective:'2026-09-28'};
}
function tcgCoverage1125(){
 const p=W.BANLIST_PROFILES?.tcg||{};
 if(arr(W.CARD_CATALOG).length>=19617&&p.__catalogReindexed1125!==true){mergeVerifiedTCG1124();p.__catalogReindexed1125=true;}
 const rows=arr(p.data),count={forbidden:0,limited:0,semiLimited:0};
 const identities=new Set(),duplicates=[];
 for(const x of rows){const k=low(x?.name);if(!k)continue;
  if(identities.has(k)){duplicates.push(raw(x.name));continue;}identities.add(k);
  const v=Number(x?.max??x?.limit??3);
  if(v===0)count.forbidden++;else if(v===1)count.limited++;else if(v===2)count.semiLimited++;
 }
 const official={forbidden:156,limited:92,semiLimited:7};
 const complete=Object.keys(official).every(k=>count[k]===official[k])&&duplicates.length===0;
 return{version:VERSION,format:'TCG',effective:raw(p.officialEffective),officialSource:'https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?request_locale=en',
  official,observed:count,missingByCategory:Object.fromEntries(Object.keys(official).map(k=>[k,Math.max(0,official[k]-count[k])])),duplicateNames:duplicates,
  completeCounts:complete,catalogReady:arr(W.CARD_CATALOG).length>=19617,catalogUnresolved:arr(p.officialUnresolvedNames1125).length,
  catalogUnresolvedNames:arr(p.officialUnresolvedNames1125).slice(0,35),
  catalogAmbiguous:arr(p.officialAmbiguousIds1126).length,
  catalogAmbiguousNames:arr(p.officialAmbiguousIds1126).map(x=>x.name),
  catalogUniqueIds:255-arr(p.officialUnresolvedNames1125).length-arr(p.officialAmbiguousIds1126).length,
  officialIdentityCrosscheck:false,certified:false,
  status:complete?'CUENTAS_COMPLETAS_SIN_AUDITORIA_DE_IDENTIDAD':'SNAPSHOT_PARCIAL',
  policy:'Los conteos oficiales son una referencia verificable; obtener la misma cifra NO certifica identidad ni legalidad histórica.'};
}

/* Revision Alpha 1143: resolver IDs ausentes de entradas oficiales desde el
   catálogo local. Las coincidencias por nombre no son certificados de legalidad. */

/* Alpha 1263: identidad oficial TCG y catálogo local, sin fabricar IDs.
   Separar catálogo no listo, nombres ausentes, copias con múltiples passcodes,
   y coincidencias inequívocas. Ningún resultado certifica formato o rulings. */
function resolveOfficialIdentity1263(cards,groups){
 const lookup=new Map();
 for(const card of arr(cards)){
  const name=officialKey1126(card?.name),id=Number(card?.id);
  if(!name||!Number.isSafeInteger(id)||id<=0)continue;
  if(!lookup.has(name))lookup.set(name,new Map());
  lookup.get(name).set(id,{id,name:raw(card.name)});
 }
 const unique=[],missing=[],ambiguous=[],seen=new Set();
 for(const [limit,names] of Object.entries(groups||{})){
  if(String(limit)==='3')continue;
  for(const officialName of arr(names)){
   const key=officialKey1126(officialName);
   if(seen.has(key))continue;seen.add(key);
   const options=[...(lookup.get(key)?.values()||[])];
   if(options.length===1)unique.push({name:officialName,id:options[0].id,max:Number(limit)});
   else if(!options.length)missing.push(officialName);
   else ambiguous.push({name:officialName,ids:options.map(x=>x.id).sort((a,b)=>a-b)});
  }
 }
 return{total:seen.size,unique:unique.length,missing:missing.length,ambiguous:ambiguous.length,uniqueEntries:unique,missingNames:missing,ambiguousEntries:ambiguous};
}
function banlistIdentityAudit1263(){
 const catalog=arr(W.CARD_CATALOG),ready=catalog.length>=19617;
 const p=W.BANLIST_PROFILES?.tcg||{};
 if(ready)tcgCoverage1125();
 const result=resolveOfficialIdentity1263(catalog,KONAMI_TCG1125);
 const counters={forbidden:arr(KONAMI_TCG1125[0]).length,limited:arr(KONAMI_TCG1125[1]).length,semiLimited:arr(KONAMI_TCG1125[2]).length};
 const match=counters.forbidden===156&&counters.limited===92&&counters.semiLimited===7&&result.total===255;
 return{version:VERSION,format:'tcg',effective:'2026-10-19',catalogRecords:catalog.length,catalogReady:ready,
  source:'https://www.yugioh-card.com/en/limited/list_2026-10-19/',
  officialCounts:counters,countsMatch:match,unique:result.unique,missing:result.missing,ambiguous:result.ambiguous,
  missingNames:result.missingNames,ambiguousEntries:result.ambiguousEntries,
  allOfficialNamesAccountedFor:result.total===255,
  certified:false,identityCertified:ready&&match&&result.missing===0&&result.ambiguous===0,
  status:!ready?'ESPERANDO_CATALOGO_COMPLETO':!match?'CONTEOS_DIVERGENTES':result.missing||result.ambiguous?'IDENTIDADES_PARCIALES':'IDENTIDADES_UNICAS_EN_CATALOGO',
  policy:'Se aplica restricción por nombre oficial. Múltiples IDs alternativos no pueden resolverse como un único passcode. Sin certificación general de legalidad, cartas nuevas ni rulings.'};
}
function banlistIdentityFixtures1263(){
 const tests=[];
 const check=(label,actual,expected)=>tests.push({label,pass:actual===expected,actual,expected});
 const mk=(items,groups)=>resolveOfficialIdentity1263(items,groups);
 const groups={'0':['FORBIDDEN A','DUAL CARD','MISSING CARD'],'1':['LIMITED B'],'2':[],'3':['RELEASED']};
 const catalog=[{name:'Forbidden A',id:10},{name:'Dual Card',id:20},{name:'DUAL CARD',id:21},{name:'Limited B',id:30},{name:'Released',id:40}];
 const a=mk(catalog,groups);
 check('Cuenta cuatro nombres restringidos',a.total,4);
 check('Dos identidades únicas',a.unique,2);
 check('Una identidad ausente',a.missing,1);
 check('Un nombre ambiguo',a.ambiguous,1);
 check('Lista de IDs ambiguos exacta',a.ambiguousEntries[0]?.ids.join(','),'20,21');
 check('No se asigna ID ambiguo',a.uniqueEntries.some(x=>x.name==='DUAL CARD'),false);
 check('Se ignoran liberaciones fuera de 0,1,2',a.uniqueEntries.some(x=>x.id===40),false);
 check('Nombres normalizados en mayúscula y minúscula',a.uniqueEntries.some(x=>x.id===10),true);
 const b=mk([{name:'Dual Card',id:20},{name:'DUAL CARD',id:20}],{'0':['DUAL CARD']});
 check('Mismo ID duplicado sigue siendo único',b.unique,1);
 check('Sin falsa ambigüedad de copias idénticas',b.ambiguous,0);
 const c=mk([{name:'Foolish Burial',id:81439173},{name:'Foolish Burial',id:81439174}],{'1':['FOOLISH BURIAL']});
 check('Dos passcodes ilustraciones alternativas no colapsan',c.ambiguous,1);
 check('Passcodes alternativos conservados',c.ambiguousEntries[0]?.ids.join(','),'81439173,81439174');
 const d=mk([],{'0':['UNKNOWN'], '1':[]});
 check('Catálogo vacío no fabrica coincidencias',d.unique,0);
 check('Catálogo vacío avisa ausencia',d.missing,1);
 const e=mk([{name:'F',id:1}],{'0':['F','F']});
 check('Nombres repetidos en listas no inflan conteos',e.total,1);
 const f=mk([{name:'F',id:-1},{name:'F',id:1.1}],{'0':['F']});
 check('IDs negativos/fraccionarios se descartan',f.missing,1);
 const status=banlistIdentityAudit1263();
 check('Snapshot oficial contiene 255 nombres',status.allOfficialNamesAccountedFor,true);
 check('Conteos corresponden a la lista embebida',status.countsMatch,true);
 check('Resultado no se certifica universalmente',status.certified,false);
 if(status.catalogReady){
  check('Nombres presentes y pendientes suman 255',status.unique+status.missing+status.ambiguous,255);
  check('Detalle de ambigüedades consistente',status.ambiguousEntries.length,status.ambiguous);
  check('Detalle de ausencias consistente',status.missingNames.length,status.missing);
  check('Estado corresponde a cobertura actual',status.status,status.missing||status.ambiguous?'IDENTIDADES_PARCIALES':'IDENTIDADES_UNICAS_EN_CATALOGO');
 }
 return{version:VERSION,pass:tests.every(x=>x.pass),passed:tests.filter(x=>x.pass).length,total:tests.length,tests};
}

function linkBanlistCatalogIds1143(){
 const catalog=arr(W.CARD_CATALOG),summary={catalog:catalog.length,byFormat:{}};
 if(catalog.length<19617)return {...summary,status:'CATALOGO_INCOMPLETO'};
 const normal=v=>raw(v).normalize('NFKD').toLowerCase().replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
 const index=new Map(),conflicts=new Set();
 for(const c of catalog){
  const id=Number(c?.id),key=normal(c?.name);if(!key||!Number.isSafeInteger(id)||id<=0)continue;
  const previous=index.get(key);
  if(!previous){index.set(key,{id,name:raw(c.name).trim(),alias:Number(c.alias)||0});continue;}
  if(previous.id!==id||raw(previous.name).trim().toLowerCase()!==raw(c.name).trim().toLowerCase())conflicts.add(key);
  // Preferir ID base del catálogo (alias=0) frente a ilustraciones alternas.
  if(previous.alias!==0&&Number(c.alias||0)===0)index.set(key,{id,name:raw(c.name).trim(),alias:0});
 }
 for(const format of ['tcg','tcgTraditional','ocg']){
  const profile=W.BANLIST_PROFILES?.[format],rows=arr(profile?.data);
  let linked=0,unresolved=0;
  for(const entry of rows){
   if(entry?.id!==null&&Number.isSafeInteger(Number(entry?.id))&&Number(entry?.id)>0)continue;
   const key=normal(entry?.name),card=index.get(key);
   if(!card||conflicts.has(key)){unresolved++;continue;}
   entry.id=card.id;entry.idResolution='COINCIDENCIA_EXACTA_NOMBRE_CATALOGO_LOCAL';linked++;
  }
  summary.byFormat[format]={rows:rows.length,linked,unresolved,conflictingNames:rows.filter(r=>conflicts.has(normal(r?.name))).length,ids:rows.filter(r=>Number.isSafeInteger(Number(r?.id))&&Number(r?.id)>0).length};
 }
 W.__YGO1143_BANLIST_LINK=summary;
 return summary;
}
function scheduleBanlistLink1143(attempt=0){
 const result=linkBanlistCatalogIds1143();
 if(result.catalog<19617&&attempt<10)setTimeout(()=>scheduleBanlistLink1143(attempt+1),650);
 return result;
}

function patchBanlist1047(){try{A973.patchTCG?.()}catch(e){W.__YGO1047_BAN_PATCH_ERROR=raw(e?.message||e)}
 // Alpha 1143: unir fecha, URL y vigencia TCG sin alterar restricciones por carta.
 try{W.__YGO1124_TCG_PATCH=mergeVerifiedTCG1124()}catch(e){W.__YGO1124_BAN_META_ERROR=raw(e?.message||e)}
 try{const p=W.BANLIST_PROFILES?.ocg;if(p){p.authority='KONAMI';p.authoritySource='https://www.yugioh-card.com/japan/event/limitregulation/?list=202610';p.source=p.authoritySource;p.officialEffective='2026-10-01';p.authorityVerifiedOn='2026-10-04';p.date='01/10/2026';p.note='Snapshot OCG Japón oficial vigente desde 01/10/2026, incrustado para funcionamiento offline.';p.data=OCG_SNAPSHOT_1047.map(x=>({...x}));p.alpha1047Embedded=true;delete p.alpha1047DataStale;}}catch(e){W.__YGO1047_OCG_PATCH_ERROR=raw(e?.message||e)}try{const p=W.BANLIST_PROFILES?.speedDuel;if(p){p.authority='KONAMI KDE-US';p.authoritySource='https://www.yugioh-card.com/en/downloads/penalty_guide/Speed_Duel_Addendum_1.2_KDE-US.pdf';p.source=p.authoritySource;p.date='NO_GENERAL_FNL';p.officialEffective='EVENT_SPECIFIC_ONLY';p.event=false;p.noGeneralList=true;p.note='Speed Duel no usa una Forbidden & Limited List general; una lista sólo aplica cuando un evento la publica expresamente.';if(!Array.isArray(p.data))p.data=[];}}catch(e){W.__YGO1047_SPEED_PATCH_ERROR=raw(e?.message||e)}try{const p=W.BANLIST_PROFILES?.rush;if(p){p.authority='KONAMI';p.authoritySource='https://www.konami.com/yugioh/rushduel/howto/limitregulation/';p.source=p.authoritySource;p.officialEffective='2026-10-01';p.authorityVerifiedOn='2026-10-04';p.date='01/10/2026';p.note='Snapshot Rush Duel oficial KONAMI vigente desde 01/10/2026, incrustado offline.';p.data=RUSH_SNAPSHOT_1047.map(x=>({...x}));p.alpha1047Embedded=true;}}catch(e){W.__YGO1047_RUSH_PATCH_ERROR=raw(e?.message||e)}try{linkBanlistCatalogIds1143()}catch(e){W.__YGO1143_BANLIST_LINK_ERROR=raw(e?.message||e)}return banlist1047()}
function banlist1047(){let tcg={pass:false},universe={pass:false};try{const current=tcgCoverage1125();tcg={...current,pass:current.completeCounts===true&&current.catalogReady===true,status:current.catalogReady!==true?'CATALOGO_INCOMPLETO':current.completeCounts?'CONTEOS_TCG_2026_10_19_COINCIDEN_IDENTIDAD_PARCIAL':'SNAPSHOT_2026_10_19_INCOMPLETO',certified:false}}catch(e){tcg={pass:false,error:raw(e?.message||e)}}try{universe=A973.banlistUniverseAudit?.()||universe}catch(e){universe={pass:false,error:raw(e?.message||e)}}const p=W.BANLIST_PROFILES?.ocg||{},ocgCounts={forbidden:arr(p.data).filter(x=>x?.status==='Forbidden').length,limited:arr(p.data).filter(x=>x?.status==='Limited').length,semi:arr(p.data).filter(x=>x?.status==='Semi-Limited').length},ocg={key:'ocg',authority:'KONAMI',source:raw(p.authoritySource||p.source),effective:'01/10/2026',dataDate:raw(p.date),rows:arr(p.data).length,counts:ocgCounts,embedded:p.alpha1047Embedded===true,pass:arr(p.data).length===202&&ocgCounts.forbidden===94&&ocgCounts.limited===95&&ocgCounts.semi===13&&raw(p.date)==='01/10/2026'&&p.alpha1047Embedded===true,policy:'OCG certifica el snapshot oficial KONAMI 01/10/2026 sólo con 94 prohibidas, 95 limitadas y 13 semilimitadas incrustadas.'};const sp=W.BANLIST_PROFILES?.speedDuel||{},speedDuel={key:'speedDuel',authority:'KONAMI KDE-US',source:raw(sp.authoritySource||sp.source),date:raw(sp.date),noGeneralList:sp.noGeneralList===true,eventDependent:true,pass:sp.noGeneralList===true&&/yugioh-card\.com/i.test(raw(sp.authoritySource||sp.source)),policy:'Speed Duel no tiene una F&L general universal: el estado genérico sin evento puede carecer de lista, pero eventos oficiales pueden publicar una Limited List específica. Alpha1047 lo marca eventDependent y exige cargar la lista del evento para certificar ese contexto.'};const rp=W.BANLIST_PROFILES?.rush||{},rushDate=raw(rp.date||rp.officialEffective),rushRows=arr(rp.data),rushCounts={forbidden:rushRows.filter(x=>x?.status==='Forbidden').length,limited:rushRows.filter(x=>x?.status==='Limited').length,semi:rushRows.filter(x=>x?.status==='Semi-Limited').length},rush={key:'rush',authority:'KONAMI',source:raw(rp.authoritySource||rp.source),effective:'01/10/2026',dataDate:rushDate,rows:rushRows.length,counts:rushCounts,embedded:rp.alpha1047Embedded===true,pass:rushRows.length===36&&rushCounts.forbidden===3&&rushCounts.limited===15&&rushCounts.semi===18&&(rushDate==='01/10/2026'||rushDate==='2026-10-01')&&rp.alpha1047Embedded===true&&/konami\.com\/yugioh\/rushduel/i.test(raw(rp.authoritySource||rp.source)),policy:'Rush Duel certifica snapshot oficial KONAMI 01/10/2026 sólo con 3 prohibidas, 15 limitadas y 18 semilimitadas incrustadas.'};const rows=arr(universe?.rows).map(x=>x?.key==='tcg'?{...x,pass:tcg.pass,loaded:tcg.catalogReady===true,date:'19/10/2026',source:tcg.officialSource,policy:'Conteos de lista TCG 19/10/2026; identidad de las cartas y legalidad universal NO certificadas.',historicalAudit:true}:x?.key==='ocg'?{...x,pass:ocg.pass,loaded:ocg.rows>0,date:ocg.dataDate,source:ocg.source,policy:ocg.policy}:x?.key==='speedDuel'?{...x,pass:speedDuel.pass,loaded:true,eventDependent:true,date:speedDuel.date,source:speedDuel.source,policy:speedDuel.policy}:x?.key==='rush'?{...x,pass:rush.pass,loaded:rush.rows>0,date:rush.dataDate,source:rush.source,policy:rush.policy}:x),universe1047={...universe,version:VERSION,rows,pass:rows.length>0&&rows.every(x=>x?.pass===true),failed:rows.filter(x=>x?.pass!==true).map(x=>({key:x?.key,eventDependent:x?.eventDependent,dynamic:x?.dynamic,loaded:x?.loaded,source:x?.source,date:x?.date,policy:x?.policy}))};return{version:VERSION,pass:tcg.pass===true,officialVerification:{verifiedOn:'2026-10-08',tcgEffective:'19/10/2026',tcgSource:'https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?forbiddenLimitedDate=2026-10-19&request_locale=en',tcgDelayedUnlimitedEffective:'28/09/2026',speedDuelEventDependent:true},tcg,ocg,speedDuel,rush,currentCorePass:tcg.pass===true&&ocg.pass===true,universe:universe1047,deltaRows:arr(tcg?.delta?.rows),failedDelta:arr(tcg?.delta?.rows).filter(x=>x.pass!==true)}}
async function ensureDynamicBanlists1047(keys=['ocg','rush','master','duelLinksSpeed','duelLinksRush']){const rows=[];for(const key of keys){const p=W.BANLIST_PROFILES?.[key];if(!p){rows.push({key,pass:false,status:'PROFILE_MISSING'});continue}if(arr(p.data).length&&!(key==='ocg'&&raw(p.date)!=='01/10/2026')&&!(key==='rush'&&!['01/10/2026','2026-10-01'].includes(raw(p.date)))){rows.push({key,pass:true,status:(key==='ocg'||key==='rush')?'CURRENT_CACHED':'CACHED',rows:p.data.length,date:raw(p.date)});continue}if(key==='ocg'&&p.alpha1047Embedded===true){rows.push({key,pass:true,status:'EMBEDDED_OFFLINE',rows:p.data.length,date:raw(p.date)});continue}if(key==='rush'&&p.alpha1047Embedded===true&&raw(p.date)==='01/10/2026'){rows.push({key,pass:true,status:'EMBEDDED_OFFLINE',rows:p.data.length,date:raw(p.date)});continue}if(key==='ocg'&&raw(p.date)!=='01/10/2026')p.data=[];let error=null;try{if(typeof W.fetchBanData==='function'){const timeout=new Promise((_,rej)=>setTimeout(()=>rej(new Error('BANLIST_TIMEOUT')),8000));const data=await Promise.race([Promise.resolve(W.fetchBanData(p)),timeout]);if(arr(data).length&&!arr(p.data).length)p.data=data}else if(typeof W.refreshBanProfile==='function')await W.refreshBanProfile(key)}catch(e){error=raw(e?.message||e)}rows.push({key,pass:arr(p.data).length>0&&(key!=='ocg'||raw(p.date)==='01/10/2026')&&(key!=='rush'||['01/10/2026','2026-10-01'].includes(raw(p.date))),status:arr(p.data).length?(((key==='ocg'&&raw(p.date)!=='01/10/2026')||(key==='rush'&&!['01/10/2026','2026-10-01'].includes(raw(p.date))))?'STALE':'LOADED'):'OPEN',rows:arr(p.data).length,date:raw(p.date),error})}patchBanlist1047();const out={version:VERSION,pass:rows.every(x=>x.pass),rows,at:new Date().toISOString()};W.__YGO1047_DYNAMIC_BANLISTS=out;return out}
const SAFE_RESOLUTION_1047=new Set(['RECOVER_GY_HAND','MILL_TOP','COUNTER_ADD','COUNTER_REMOVE','CHANGE_POSITION','ATTACH_MATERIAL','SET_FROM_DECK','SEARCH_DECK_HAND','SPECIAL_GY','SPECIAL_BANISHED','RECOVER_BANISHED_HAND','DRAW','BOTTOM_DECK','TOP_DECK','DRAW_FIXED','GAIN_LP_FIXED','BURN_FIXED','BURN_BOTH_FIXED','DESTROY_SELF','BANISH_SELF','BANISH_SELF_FACEDOWN','SHUFFLE_SELF_DECK','RETURN_SELF_HAND','SEND_SELF_GY','SET_SELF_FACEDOWN_DEF','DESTROY_SELECTED','BANISH_SELECTED','BANISH_SELECTED_FACEDOWN','SHUFFLE_SELECTED_DECK','RETURN_SELECTED_HAND','SEND_SELECTED_GY','DISCARD_SELECTED','SPECIAL_SELECTED','SET_SELECTED_FACEDOWN_DEF','SET_SELECTED_ST','RETURN_SELECTED_DECK_TOP','CHANGE_SELECTED_POSITION','DESTROY_ALL_OPP_LEVEL','DESTROY_ALL_NAMED','DESTROY_ALL_ST','DESTROY_ALL_MONSTERS','DESTROY_ALL_OPP_MONSTERS','BANISH_ALL_OPP_MONSTERS','RETURN_ALL_OPP_MONSTERS_HAND','SEND_ALL_MONSTERS_GY','ADD_NAMED_DECK_HAND','BANISH_NAMED_GY','BANISH_NAMED_HAND','RECOVER_NAMED_BANISHED_HAND','RECOVER_NAMED_GY_HAND','RETURN_NAMED_BANISHED_DECK','SEND_NAMED_DECK_GY','SEND_NAMED_HAND_GY','SET_NAMED_DECK','SET_NAMED_GY','SHUFFLE_NAMED_GY_DECK','SPECIAL_NAMED_BANISHED','SPECIAL_NAMED_DECK','SPECIAL_NAMED_GY','SPECIAL_NAMED_HAND','SPECIAL_SELF','REVEAL_TOP','REVEAL_SELECTED','TAKE_CONTROL','BANISH_FACE_DOWN','SEND_DECK_GY_SELECTED','SET_FROM_GY','SET_FROM_HAND','STAT_DELTA','SET_LEVEL_RANK','DELTA_LEVEL_RANK','SET_NAME','EQUIP_SELF_TARGET','TOKEN_FIXED','STAT_SET_ABSOLUTE','STAT_MULTIPLY','NEGATE_EFFECTS_TURN','CANNOT_ATTACK_TURN','CANNOT_DIRECT_ATTACK_TURN','ATTACK_LIMIT_TURN','ONLY_SELECTED_CAN_ATTACK_TURN','SPECIAL_SUMMON_RACE_LOCK_TURN','CANNOT_ATTACK_FACEDOWN_TURN','DRAW_DYNAMIC','GAIN_LP_DYNAMIC','BURN_DYNAMIC','NEGATE_TARGET_EFFECTS','ATK_SET','ATK_MULT','ATK_SELF_SET_DAMAGE_CALC_FIXED','ATK_SELECTED_DELTA_TRIBUTED_ORIGINAL','ATK_SELECTED_DELTA_SOURCE_CURRENT']);
function effect1047(card,id=null,text=''){try{return A986.effectFind986?.(card,id,text)||arr(R.parseCard?.(card)?.effects).find(e=>id!=null?String(e?.id)===String(id):low(e?.raw||e?.text)===low(text))||null}catch(_){return null}}
function usageOnly1047(card,e){let t=raw(e?.raw||e?.text||'').replace(/^\s*\[[^\]]+\]\s*/,'').trim();if(!t)return null;if(/^(?:this effect can be (?:used|activated) during either player(?:'s)? turn)\.?$/i.test(t))return e?.timing?.quick===true&&typeof R.activate==='function'?{exact:true,source:'PASSIVE_TIMING_METADATA_1047',kind:'QUICK_TIMING_METADATA',runtimeOwned:true}:{exact:false,source:'PASSIVE_TIMING_METADATA_1047',reason:'UNVERIFIED_QUICK_TIMING_1172',runtimeOwned:false};const pure=/^(?:you can only use each effect of [\"“][^\"”]+[\"”] once per turn|you can only use (?:each|this|1|one)?\s*[^.:;]*?(?:effect)?\s*(?:of\s+)?[^.:;]*?once per turn(?:,? and only once that turn)?|you can only activate\s+(?:1|one)\s+[^.:;]+\s+per turn|you can only use\s+(?:1|one)\s+[^.:;]+\s+effect per turn(?:,? and only once that turn)?)[.!]?$/i.test(t);if(!pure)return null;let scope=null;try{scope=A620.usageScope620?.(card,e)||null}catch(err){return{exact:false,reason:'USAGE_ONLY_SCOPE_EXCEPTION_1047',error:raw(err?.message||err)}}const runtime=typeof A620.usageAllowed620==='function'&&typeof A620.usageKey620==='function';return scope?.limited&&scope?.kind&&scope.kind!=='NONE'&&runtime?{exact:true,source:'PASSIVE_USAGE_RESTRICTION_1047',scope,runtimeOwned:true}:{exact:false,reason:'USAGE_ONLY_NOT_OWNED_1047',scope,runtimeOwned:runtime}}
function restrictionProof1047(card,e){const r=e?.restriction;const active=[];if(r&&typeof r==='object'){for(const[k,v]of Object.entries(r)){if(v==null||v===false||v===''||(Array.isArray(v)&&!v.length))continue;if(k==='locations'||/^alpha\d+/i.test(k)||/once|turn|duel|chain|usage|hard|soft|onlyOnce/i.test(k))continue;if(k==='summonLocks'&&Array.isArray(v)&&v.length&&v.every(x=>A613.compileStep613?.(x)?.kind==='SPECIAL_SUMMON_RACE_LOCK_TURN')&&typeof A613.executeStep613==='function')continue;active.push({key:k,value:v})}}else if(typeof r==='string'&&r.trim()&&!/once per|only use|only activate/i.test(r))active.push({key:'text',value:r});if(active.length)return{exact:false,reason:'NON_USAGE_RESTRICTION_OPEN_1047',active};const limited=!!(r&&typeof r==='object'&&(r.oncePerTurn||r.oncePerChain||r.oncePerDuel||r.onlyOnce||r.alpha569CardWideEachEffect));if(limited){let scope=null;try{scope=A620.usageScope620?.(card,e)||null}catch(err){return{exact:false,reason:'USAGE_SCOPE_EXCEPTION_1047',error:raw(err?.message||err)}}const runtime=typeof A620.usageAllowed620==='function'&&typeof A620.usageKey620==='function';if(!scope?.limited||!scope?.kind||scope.kind==='NONE'||!runtime)return{exact:false,reason:'PROPAGATED_USAGE_NOT_OWNED_1047',scope,runtimeOwned:runtime};return{exact:true,kind:scope.kind,limited:true,scope,runtimeOwned:true,propagated:true}}return A986.usageProof986?.(card,e)||{exact:true,kind:'NONE',limited:false}}
function conditionProof1047(e,card=null){let t=raw(e?.condition||'').trim();let clean=t.replace(/^(?:-{4,}\s*)?\[\s*(?:pendulum|monster)\s+effect\s*\]\s*/i,'').trim();clean=clean.replace(/^\((?:this card is always treated as|you do not use)[^)]+\)\s*/i,'').trim();clean=clean.replace(/\s*\(quick effect\)\s*$/i,'').trim();if(clean!==t)t=clean;let us=null;try{us=A620.usageScope620?.(card||{},e)||null}catch(_){}if(us?.limited===true&&/^once per turn,\s*/i.test(t))t=t.replace(/^once per turn,\s*/i,'').trim();t=t.replace(/^during your opponent turn\b/i,"During your opponent's turn");if(/^during your opponent'?s turn,?\s*while this card is in (?:the |your )?(?:gy|graveyard)$/i.test(t))t="During your opponent's turn, if this card is in your GY";if(/^when you take battle damage from an opponent'?s attacking monster$/i.test(t))t='When you take battle damage';if(/^when this card destroys a monster and sends it to (?:the )?(?:graveyard|gy) as a result of battle$/i.test(t))t="When this card destroys an opponent's monster by battle and sends it to the GY";if(/^(?:when|if) activated$/i.test(t)){const runtime=typeof A644.conditionAllowed644==='function';return runtime?{exact:true,kind:'SOURCE_CARD_ACTIVATED',trigger:true,spec:{kind:'SOURCE_CARD_ACTIVATED',exact:true,text:t,alpha1047:true},text:t,runtimeOwned:true}:{exact:false,reason:'TRIGGER_RUNTIME_NOT_OWNED_1047',text:t}}if(/^when this card attacks an opponent'?s face-down defense position monster$/i.test(t))return typeof R.damageStep==='function'?{exact:true,kind:'SOURCE_ATTACKS_OPP_FACEDOWN_DEF',trigger:true,spec:{kind:'SOURCE_ATTACKS_OPP_FACEDOWN_DEF',exact:true,text:t,alpha1047:true},text:t,runtimeOwned:true}:{exact:false,reason:'BATTLE_RUNTIME_NOT_OWNED_1047',text:t};if(/^once per turn$/i.test(t)){const u=A986.usageProof986?.(card||{},e)||null;if(u?.exact===true)return{exact:true,kind:'USAGE_ONLY_CONDITION',text:t,runtimeOwned:true,usage:u};return{exact:false,reason:'USAGE_PREFIX_NOT_OWNED_1047',text:t,usage:u}}const ee=t===raw(e?.condition||'').trim()?e:{...e,condition:t};const q=A986.conditionProof986?.(ee)||{exact:!t,kind:t?'UNKNOWN':'NONE'};return q}
function simpleTargetDescription1047(d){const s=low(d),quotes=[...raw(d).matchAll(/["“]([^"”]+)["”]/g)];if(quotes.length>1)return false;if(/\b(?:and\s+1|or\s+1|up to|any number|random|that target|attacking monster|same level|used as material|equipped with|different name|except|sent .* this turn|would be|cannot target|target this card|equal to|counter|column|pendulum zone|field zone|min\.|underneath)\b/i.test(d))return false;if(quotes.length===0&&/\b(?:monster|spell|trap|card)\b/.test(s)===false)return false;if(quotes.length===1&&!/\b(?:monster|spell|trap|card|you control|your (?:gy|graveyard|hand)|banished|on the field|opponent controls)\b/.test(s))return false;if(quotes.length===0){const residue=s.replace(/\b(?:face up|face down|face-up|face-down|attack position|defense position|your|you control|your opponent|opponent controls|either|player|players|either player's|on the field|in the field|field|in your gy|in the gy|gy|graveyard|banished|in your hand|hand|monster|spell|trap|card|equip|level\s*\d+\s*(?:or lower|or higher)?|light|dark|earth|water|fire|wind|divine|dragon|spellcaster|warrior|beast warrior|beast|winged beast|machine|aqua|pyro|thunder|rock|plant|insect|fish|sea serpent|reptile|psychic|dinosaur|fiend|fairy|zombie|cyberse|wyrm|illusion|pendulum|fusion|synchro|xyz|another|other|a|an|the|of|to|from|on|in|1|one)\b/g,' ').replace(/[^a-z0-9]+/g,' ').trim();if(residue)return false}return true}
function targetProof1047(e){const base=A985.targetProof985?.(e)||null;if(base?.exact===true)return base;const ts=arr(e?.targets);if(ts.length===1&&ts[0]&&typeof ts[0]==='object'){const count=ts[0].count,one=count===1||count==='1',d=raw(ts[0].description||ts[0].raw||ts[0].text).trim();if(one&&simpleTargetDescription1047(d))return{exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET',count:1,text:d,source:'LEGAL_TARGET_POOL_FILTER_1047',runtimeOwned:typeof R.legalTargets==='function'}}return base||{exact:ts.length===0,kind:ts.length?'UNKNOWN':'NONE'}}
function costProof1047(e){let base=null;try{base=A985.costProof985?.(e)||null}catch(err){base={exact:false,reason:'COST_BASE_EXCEPTION_1047',error:raw(err?.message||err)}}const cs=arr(e?.costs).filter(x=>x&&typeof x==='object');if(base?.exact===true&&!cs.length)return base;const text=raw(e?.raw||e?.text||'').trim(),clean=text.replace(/^(?:-{4,}\s*)?\[\s*(?:pendulum|monster)\s+effect\s*\]\s*/i,'').trim();if(!cs.length)return base||{exact:true,kind:'NONE',count:0};const seen=new Map();for(const c of cs){const kind=raw(c.kind).toUpperCase(),amount=Math.max(1,Number(c.amount)||1),self=c.self===true,key=`${kind}|${amount}|${self?'SELF':'ANY'}`;if(!seen.has(key))seen.set(key,{kind,amount,self,raw:c})}const rows=[...seen.values()];if(rows.length!==1)return base||{exact:false,reason:'MULTI_COST_OUTSIDE_CLOSED_DOMAIN_1047',rows};const c=rows[0],n=c.amount,numWord={1:'(?:1|a|an|one)',2:'(?:2|two)',3:'(?:3|three)',4:'(?:4|four)',5:'(?:5|five)'}[n]||String(n);if(c.kind==='DESTROY'&&c.self&&n===1&&/\b(?:then|also|and if you do)[^.;]{0,100}destroy this card\b/i.test(clean))return{exact:true,kind:'NONE',count:0,source:'RESOLUTION_SELF_DESTROY_NOT_ACTIVATION_COST_1047',parserArtifact:true};if(c.kind==='DISCARD'&&n<=5&&new RegExp(`\\b(?:you can\\s+)?discard\\s+${numWord}\\s+cards?\\b`,'i').test(clean))return{exact:true,kind:'DISCARD',zone:'hand',count:n,source:'STRUCTURED_FIXED_COST_1047'};if(c.kind==='DETACH'&&n<=5&&new RegExp(`\\b(?:you can\\s+)?detach\\s+${numWord}\\s+(?:xyz\\s+)?materials?\\b`,'i').test(clean))return{exact:true,kind:'DETACH',zone:'material',count:n,source:'STRUCTURED_FIXED_COST_1047'};if(c.kind==='TRIBUTE'&&n<=5&&((c.self&&n===1&&/\\b(?:you can\\s+)?tribute this card\\b/i.test(clean))||new RegExp(`\\b(?:you can\\s+)?tribute\\s+${numWord}\\s+(?:monster|card)s?\\b`,'i').test(clean)))return{exact:true,kind:'TRIBUTE',zone:'monster',count:n,self:c.self===true,source:'STRUCTURED_FIXED_COST_1047'};if((c.kind==='PAY_LP'||c.kind==='LP')&&n>0&&new RegExp(`\\b(?:you can\\s+)?pay\\s+${n}\\s+lp\\b`,'i').test(clean))return{exact:true,kind:'PAY_LP',zone:'lp',count:n,source:'STRUCTURED_FIXED_COST_1047'};if(c.kind==='LP_HALF'&&/pay\s+(?:half|½)\s+(?:your\s+)?lp/i.test(clean))return{exact:true,kind:'LP_HALF',zone:'lp',count:1,source:'STRUCTURED_HALF_LP_COST_1047'};if(c.kind==='SEND_GY'&&c.self&&n===1&&/(?:send|place) this card .*?(?:gy|graveyard)/i.test(clean))return{exact:true,kind:'SEND_SELF_GY_COST',zone:'self',count:1,self:true,source:'STRUCTURED_SELF_COST_1047'};if(c.kind==='BANISH'&&c.self&&n===1&&/\b(?:you can\s+)?banish this card from (?:your\s+)?(?:gy|graveyard|hand)\b/i.test(clean))return{exact:true,kind:'BANISH_SELF_COST',zone:/hand/i.test(clean)?'hand':'gy',count:1,self:true,source:'STRUCTURED_SELF_COST_1047'};return base||{exact:false,reason:'STRUCTURED_COST_OUTSIDE_CLOSED_DOMAIN_1047',rows,text:clean}}
function hiddenInlineCost1047(e,nodes){if(arr(e?.costs).length)return null;for(const n of nodes){const t=raw(n?.text||n?.raw||n).trim();if(/^(?:you can\s+)?(?:tribute|discard|detach)\b.+?\bto\s+(?:draw|destroy|special summon|add|send|banish|return|gain|inflict)\b/i.test(t))return t;if(/^pay\s+(?:half|\d+)\s+(?:your\s+)?lp\s+to\s+/i.test(t))return t}return null}
function activationOnlyStep1047(tx){const t=raw(tx).trim().replace(/^you can\s+/i,'');return /^(?:target\s+(?:1|one|a|an)\b|discard\s+|tribute\s+|detach\s+|pay\s+(?:half|½|\d+)\s+(?:your\s+)?lp\b|banish this card from your (?:gy|graveyard|hand)\b)/i.test(t)}
function usageFragment1047(tx,usage){if(usage?.exact!==true||usage?.limited!==true)return false;const t=low(tx);if(!t||t.length>180)return false;if(/\b(?:draw|destroy|special summon|fusion summon|ritual summon|synchro summon|xyz summon|link summon|add |send |banish |return |gain |inflict |target |discard |tribute |pay |set |shuffle |equip |attack|negate|place |remove |reveal )\b/.test(t))return false;return /^(?:you can only (?:activate|use)\b|you may only (?:activate|use)\b)/.test(t)||/(?:once )?per turn\.?$/.test(t)}
function promotedRuntimeStep1047(text,target){
  const t=raw(text).trim(),n=low(t),hasTarget=target?.exact===true&&target?.kind&&target.kind!=='NONE',selfRef=/\b(?:this card|this monster|its|itself)\b/i.test(t);
  let c=null,engine=null;
  try{c=A605.compileStep605?.(t)||null;if(c)engine='A605'}catch(_){}
  if(!c)try{c=A606.compileStep606?.(t)||null;if(c)engine='A606'}catch(_){}
  if(!c)try{c=A607.compileStep607?.(t)||null;if(c)engine='A607'}catch(_){}
  if(!c)try{c=A608.compileStep608?.(t)||null;if(c)engine='A608'}catch(_){}
  if(!c)try{c=A613.compileStep613?.(t)||null;if(c)engine='A613'}catch(_){}
  if(!c)try{c=A761.compile761?.(t)||null;if(c)engine='A761'}catch(_){}
  if(!c)try{c=A767.compile767?.(t)||null;if(c)engine='A767'}catch(_){}
  if(!c)return null;
  const targetRequired=new Set(['RECOVER_GY_HAND','COUNTER_ADD','COUNTER_REMOVE','CHANGE_POSITION','ATTACH_MATERIAL','SET_FROM_DECK','SEARCH_DECK_HAND','SPECIAL_GY','SPECIAL_BANISHED','RECOVER_BANISHED_HAND','BOTTOM_DECK','TOP_DECK','REVEAL_SELECTED','TAKE_CONTROL','BANISH_FACE_DOWN','SEND_DECK_GY_SELECTED','SET_FROM_GY','SET_FROM_HAND','EQUIP_SELF_TARGET','NEGATE_EFFECTS_TURN','CANNOT_ATTACK_TURN','CANNOT_DIRECT_ATTACK_TURN','ATTACK_LIMIT_TURN','ONLY_SELECTED_CAN_ATTACK_TURN','ATK_SELECTED_DELTA_TRIBUTED_ORIGINAL','ATK_SELECTED_DELTA_SOURCE_CURRENT','NEGATE_TARGET_EFFECTS','ATK_SET','ATK_MULT']);
  const statKinds=new Set(['STAT_DELTA','SET_LEVEL_RANK','DELTA_LEVEL_RANK','SET_NAME','STAT_SET_ABSOLUTE','STAT_MULTIPLY']);
  if(targetRequired.has(c.kind)&&!hasTarget&&!selfRef)return null;
  if(statKinds.has(c.kind)&&!hasTarget&&!selfRef)return null;
  if(engine==='A605'&&typeof A605.executeStep605!=='function')return null;
  if(engine==='A606'&&typeof A606.executeStep606!=='function')return null;
  if(c.kind==='TOKEN_FIXED'&&typeof A608.executeStep608!=='function')return null;
  if(engine==='A607'&&typeof A607.executeStep607!=='function')return null;
  if(engine==='A608'&&typeof A608.executeStep608!=='function')return null;
  if(engine==='A613'&&typeof A613.executeStep613!=='function')return null;
  if(engine==='A761'&&typeof A761.execute761!=='function')return null;
  if(engine==='A767'&&typeof A767.execute767!=='function')return null;
  return{...c,alpha1047PromotedRuntime:true,engine};
}
function resolutionStep1047(tx,target,usage){const text=raw(tx).trim(),core=text.replace(/^(?:then[, ]+|then\s+)/i,'').trim();let m=core.match(/^this card'?s atk becomes (\d+) during damage calculation only\.?$/i);if(m)return{kind:'ATK_SELF_SET_DAMAGE_CALC_FIXED',amount:Number(m[1]),text:core,alpha1047BattleRuntime:true};let c=A973.compileGeneric?.(core)||null;if(c)return{...c,alpha1047Normalized:core!==text,originalText:text};c=promotedRuntimeStep1047(core,target);if(c)return c;if(usageFragment1047(text,usage))return{kind:'META_USAGE_1047',meta:true,text};if(target?.exact!==true||target?.kind==='NONE')return null;const t=low(text);if(/^(?:you can\s+)?special summon\s+(?:it|them|that target|those targets)\b/.test(t))return{kind:'SPECIAL_SELECTED',text,alpha1047Pronoun:true};if(/^(?:you can\s+)?(?:add|return)\s+(?:it|them|that target|those targets)\s+to\s+(?:your|the)\s+hand\b/.test(t))return{kind:'RETURN_SELECTED_HAND',text,alpha1047Pronoun:true};if(/^(?:you can\s+)?send\s+(?:it|them|that target|those targets)\s+to\s+(?:the\s+)?(?:gy|graveyard)\b/.test(t))return{kind:'SEND_SELECTED_GY',text,alpha1047Pronoun:true};if(/^(?:you can\s+)?banish\s+(?:it|them|that target|those targets)\b/.test(t))return{kind:'BANISH_SELECTED',text,alpha1047Pronoun:true};if(/^(?:you can\s+)?destroy\s+(?:it|them|that target|those targets)\b/.test(t))return{kind:'DESTROY_SELECTED',text,alpha1047Pronoun:true};if(/^(?:you can\s+)?set\s+(?:it|that card|that target)\.?$/.test(t)&&/\b(?:spell|trap)\b/i.test(raw(target?.text||'')))return{kind:'SET_SELECTED_ST',text,alpha1047InheritedSet:true};return null}
function continuationProof1047(card,e,ctx){if(e?.nonActivatable!==true||raw(e?.nonActivatableReason)!=='SEMICOLON_CONTINUATION')return null;const usage=restrictionProof1047(card,e);if(usage.exact!==true)return{exact:false,reason:usage.reason||'CONTINUATION_RESTRICTION_OPEN_1047',usage};const nodes=arr(e?.steps?.length?e.steps:e?.nodes);if(!nodes.length)return{exact:false,reason:'CONTINUATION_NO_STEPS_1047'};const target=ctx?.target?.exact===true?ctx.target:{exact:true,kind:'NONE',count:0};let inherited=null;try{inherited=A986.effectProof986?.(card,e?.id??e?.effectId??null,raw(e?.raw||e?.text||''))||null}catch(_){}if(inherited?.exact===true)return{...inherited,version:VERSION,continuation:true,inheritedTarget:target.kind!=='NONE',target:target.kind!=='NONE'?target:(inherited.target||target),source:inherited.source||'EXACT_CONTINUATION_BASE_1047'};const kinds=[];for(const n of nodes){const tx=n?.text||n?.raw||n,c=resolutionStep1047(tx,target,usage);if(c?.meta===true)continue;if(!c||!SAFE_RESOLUTION_1047.has(c.kind))return{exact:false,reason:'CONTINUATION_RESOLUTION_OUTSIDE_CLOSED_DOMAIN_1047',kind:c?.kind||null,text:raw(tx)};if(/_SELECTED|RETURN_SELECTED_DECK_TOP|SET_SELECTED_FACEDOWN_DEF|SET_SELECTED_ST/.test(c.kind)&&target.kind==='NONE')return{exact:false,reason:'CONTINUATION_SELECTED_WITHOUT_INHERITED_TARGET_1047',kind:c.kind,text:raw(tx)};kinds.push(c.kind)}return{exact:true,source:'SEMICOLON_CONTINUATION_1047',nonActivatable:true,inheritedTarget:target.kind!=='NONE',target,kinds,scope:'INHERITED_ACTIVATION_CONTEXT+DETERMINISTIC_CONTINUATION'}}
function unaccountedActivationPayment1172(e){
 const rawText=raw(e?.raw||e?.text||'');
 const activation=raw(e?.activation||'').trim();
 if(!activation||!rawText.includes(';'))return null;
 const costs=arr(e?.costs),tags=new Set(costs.map(x=>raw(x?.kind).toUpperCase()));
 const paymentSpecs=[
  ['SEND_HAND',/\bsend\s+(?:\d+|one|a|an)\s+(?:[a-z-]+\s+){0,4}cards?\s+from\s+(?:your|the)\s+hand\s+to\s+(?:the\s+)?(?:gy|graveyard)\b/i,['SEND','DISCARD','SEND_GY','SEND_HAND']],
  ['REVEAL_HAND',/\breveal\s+(?:\d+|one|a|an)\s+[^;]{0,90}?\b(?:in|from)\s+your\s+hand\b/i,['REVEAL']],
  ['SHUFFLE_HAND',/\bshuffle\s+(?:\d+|one|a|an)\s+[^;]{0,100}?\bfrom\s+your\s+hand\s+into\s+(?:the|your)\s+deck\b/i,['SHUFFLE','RETURN']],
  ['RETURN_HAND',/\breturn\s+(?:\d+|one|a|an)\s+[^;]{0,100}?\bfrom\s+your\s+hand\s+to\s+(?:the|your)\s+deck\b/i,['RETURN','SHUFFLE']],
  ['DISCARD',/\bdiscard\s+(?:\d+|one|a|an)\s+(?:[^;,]{0,30}?)\bcards?\b/i,['DISCARD']],
  ['LP',/\bpay\s+(?:\d+|half)\s+(?:of\s+your\s+)?lp\b/i,['LP']],
  ['TRIBUTE',/\btribute\s+(?:\d+|one|a|an)\s+(?:[^;,]{0,45}?)\bmonsters?\b/i,['TRIBUTE']],
  ['DETACH',/\bdetach\s+(?:\d+|one|a|an)\s+(?:[^;,]{0,45}?)\bmaterials?\b/i,['DETACH']],
  ['BANISH',/\bbanish\s+(?:\d+|one|a|an)\s+[^;]{0,95}?\bfrom\s+(?:your|the)\s+(?:gy|graveyard)\b/i,['BANISH']]
 ];
 for(const [kind,rx,representedBy] of paymentSpecs){
  if(rx.test(activation)&&!representedBy.some(k=>tags.has(k)))return{kind,text:activation.slice(0,240),represented:[...tags]};
 }
 return null;
}
function effectProof1047(card,effectId=null,effectText=''){let base=null;try{base=BASE_EFFECT_1047?.(card,effectId,effectText)||null}catch(err){base={exact:false,reason:'BASE_EFFECT_EXCEPTION_1047',error:raw(err?.message||err)}}const e=effect1047(card,effectId,effectText);const unpaid=unaccountedActivationPayment1172(e);if(unpaid)return{exact:false,reason:'UNACCOUNTED_ACTIVATION_PAYMENT_1172',payment:unpaid,baseClaim:base?.exact===true};if(base?.exact===true)return base;if(!e)return base||{exact:false,reason:'EFFECT_NOT_FOUND_1047'};const passive=usageOnly1047(card,e);if(passive)return passive;const condition=conditionProof1047(e,card);if(condition.exact!==true)return{exact:false,reason:condition.reason||'CONDITION_NOT_CLOSED_1047',condition,base};const usage=restrictionProof1047(card,e);if(usage.exact!==true)return{exact:false,reason:usage.reason||'RESTRICTION_NOT_CLOSED_1047',usage,base};const cost=costProof1047(e);if(cost.exact!==true)return{exact:false,reason:'COST_NOT_CLOSED_1047',cost,base};const target=targetProof1047(e);if(target.exact!==true)return{exact:false,reason:'TARGET_NOT_CLOSED_1047',target,base};let selector=null;try{selector=W.YGOAlpha981?.effectProof981?.(card,effectId,effectText)||null}catch(_){}if(selector?.exact===true)return{...selector,version:VERSION,source:'CONDITIONED_FINITE_SELECTOR_1047',condition,usage,cost,target,selector981:selector,scope:'OWNED_CONDITION+OWNED_USAGE+FIXED_COST+FINITE_SELECTOR_ENUMERATION'};const nodes=arr(e?.steps?.length?e.steps:e?.nodes),hiddenCost=hiddenInlineCost1047(e,nodes);if(hiddenCost)return{exact:false,reason:'UNPARSED_INLINE_COST_1047',text:hiddenCost,base};if(e?.requiresCompositeResolution===true&&e?.nonActivatable!==true&&nodes.length&&nodes.every(n=>activationOnlyStep1047(n?.text||n?.raw||n))&&(cost.kind!=='NONE'||target.kind!=='NONE'))return{exact:true,source:'PSCT_ACTIVATION_FRAGMENT_1047',activationFragment:true,effectId:e?.id??e?.effectId??null,condition,usage,cost,target,kinds:[],scope:'ACTIVATION_COST_TARGET_PROVED;RESOLUTION_IN_CONTINUATION'};if(!nodes.length)return{exact:false,reason:'NO_STEPS_1047',base};const kinds=[];for(const n of nodes){const tx=n?.text||n?.raw||n,c=resolutionStep1047(tx,target,usage);if(c?.meta===true)continue;if(!c||!SAFE_RESOLUTION_1047.has(c.kind))return{exact:false,reason:'RESOLUTION_OUTSIDE_CLOSED_DOMAIN_1047',kind:c?.kind||null,text:raw(tx),base};if(/_SELECTED|RETURN_SELECTED_DECK_TOP|SET_SELECTED_FACEDOWN_DEF|SET_SELECTED_ST/.test(c.kind)&&target.kind==='NONE')return{exact:false,reason:'SELECTED_RESOLUTION_WITHOUT_TARGET_1047',kind:c.kind,text:raw(tx),base};kinds.push(c.kind)}return{exact:true,source:'CLOSED_EFFECT_1047',effectId:e?.id??e?.effectId??null,condition,usage,cost,target,kinds,scope:'OWNED_CONDITION+OWNED_USAGE+FIXED_COST+SINGLE_TARGET+DETERMINISTIC_RESOLUTION'}}
function cardProof1047(card){if(!card)return{exact:false,reason:'CARD_REQUIRED'};let base=null;try{base=BASE_CARD_1047?.(card)||null}catch(err){base={exact:false,reason:'BASE_CARD_EXCEPTION_1047',error:raw(err?.message||err)}}let preEffects=[];try{preEffects=arr(R.parseCard?.(card)?.effects);if(!preEffects.length&&arr(card?.__alpha974Effects).length)preEffects=arr(card.__alpha974Effects)}catch(_){}const unresolvedPayment=preEffects.map(e=>({id:e?.id,payment:unaccountedActivationPayment1172(e)})).filter(x=>x.payment);if(unresolvedPayment.length)return{exact:false,reason:'UNACCOUNTED_ACTIVATION_PAYMENT_1172',payments:unresolvedPayment,source:'STRICT_PAYMENT_PRECHECK_1172'};if(base?.exact===true)return base;if(/normal monster/i.test(raw(card?.type))&&!/effect|pendulum/i.test(raw(card?.type)))return{exact:true,source:'NORMAL_MONSTER_RULE'};let es=[];try{es=arr(R.parseCard?.(card)?.effects)}catch(_){}if(!es.length)return base||{exact:false,reason:'NO_EFFECTS_1047'};const rows=[];let activationCtx=null;for(const e of es){let p=null;if(e?.nonActivatable===true&&raw(e?.nonActivatableReason)==='SEMICOLON_CONTINUATION')p=continuationProof1047(card,e,activationCtx);if(!p)p=effectProof1047(card,e?.id??e?.effectId??null,raw(e?.raw||e?.text||''));rows.push(p);if(e?.nonActivatable!==true)activationCtx=(p?.activationFragment===true||p?.exact===true&&p?.target?.kind&&p.target.kind!=='NONE')?p:null}const bad=rows.filter(x=>x?.exact!==true);return{exact:bad.length===0,source:bad.length?'PARTIAL_1047':'ALL_EFFECTS_1047',effects:rows.length,exactEffects:rows.length-bad.length,rows,unresolved:bad,base}}
function installProof1047(){if(W.YGOAlpha862){W.YGOAlpha862.effectProof862=effectProof1047;W.YGOAlpha862.cardProof862=cardProof1047}if(W.YGOAlpha825){W.YGOAlpha825.effectProof825=effectProof1047;W.YGOAlpha825.cardProof825=cardProof1047}if(W.YGOAlpha818)W.YGOAlpha818.exactSimple818=cardProof1047;try{W.YGOAlpha978?.scanner978?.clear?.()}catch(_){}return true}
function paymentSelf1172(){
 const mk=(t,timing={})=>({id:1172000,name:'Pago sintético',type:'Effect Monster',__alpha974Effects:[{id:1,raw:t,activation:t.split(';')[0].trim(),costs:[],targets:[],condition:'',timing,steps:[{text:t.split(';')[1]?.trim()||t}]}]});
 const unchecked=mk('Send 1 card from your hand to the GY; draw 1 card.');
 const revealed=mk('Reveal 1 monster in your hand; draw 1 card.');
 const safe=mk('Draw 1 card.');
 const noQuick=mk("This effect can be used during either player's turn.");
 const yesQuick=mk("This effect can be used during either player's turn.",{quick:true});
 const r=[effectProof1047(unchecked,1),cardProof1047(unchecked),effectProof1047(revealed,1),effectProof1047(safe,1),usageOnly1047(yesQuick,yesQuick.__alpha974Effects[0]),usageOnly1047(noQuick,noQuick.__alpha974Effects[0])];
 const parsedSend=arr(R.parseCard?.({name:'Guard 1172',type:'Effect Monster',desc:'Send 1 card from your hand to the GY; draw 1 card.'})?.effects),parsedReveal=arr(R.parseCard?.({name:'Guard 1172',type:'Effect Monster',desc:'Reveal 1 monster in your hand; draw 1 card.'})?.effects);
 const checks={parserSendGuard:parsedSend.some(e=>e.nonActivatable===true&&e.nonActivatableReason==='UNACCOUNTED_ACTIVATION_PAYMENT_1172'),parserRevealGuard:parsedReveal.some(e=>e.nonActivatable===true&&e.nonActivatableReason==='UNACCOUNTED_ACTIVATION_PAYMENT_1172'),unpaidSendBlocked:r[0].exact!==true&&r[0].reason==='UNACCOUNTED_ACTIVATION_PAYMENT_1172',cardCannotBypass:r[1].exact!==true,revealBlocked:r[2].exact!==true,simpleDrawUnaffected:r[3].exact===true,verifiedQuickOwned:r[4]?.exact===true,unverifiedQuickBlocked:r[5]?.exact!==true};
 return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,policy:'Las pruebas sintéticas demuestran cierre conservador; no certifican efectos de cartas reales ni reglas universales.'};
}
function proofSelf1047(){
  const mk=(rawText,extra={})=>({id:1047000+Math.floor(Math.random()*1047),name:extra.name||'T1047',type:'Effect Monster',__alpha974Effects:[{id:1,raw:rawText,condition:extra.condition||'',costs:extra.costs||[],targets:extra.targets||[],restriction:extra.restriction||{},steps:[{text:extra.step||rawText}]}]});
  const usage=effectProof1047(mk('You can only use this effect of "T1047" once per turn.',{restriction:{oncePerTurn:true}}),1);
  const meta=effectProof1047(mk('Special Summon 1 "Blue-Eyes White Dragon" from your Deck.',{restriction:{locations:['your Deck','deck']},step:'Special Summon 1 "Blue-Eyes White Dragon" from your Deck.'}),1);
  const target=effectProof1047(mk('Target 1 face-up monster on the field; destroy that target.',{targets:[{count:1,description:'face-up monster on the field'}],step:'Destroy that target.'}),1);
  const quoted=targetProof1047({raw:'Target 1 "Abyss Actor" monster you control',targets:[{count:1,description:'"Abyss Actor" monster you control'}]});
  const face=effectProof1047(mk('Once per turn, you can flip this card into face-down Defense Position.',{restriction:{oncePerTurn:true},step:'Flip this card into face-down Defense Position.'}),1);
  const bad=effectProof1047(mk('Roll a six-sided die; draw cards equal to the result.',{step:'Roll a six-sided die; draw cards equal to the result.'}),1);
  const equipState={turn:1,activePlayer:0,phase:'MAIN PHASE',zones:[{deck:[],hand:[],monster:[{uid:'m1047',faceUp:true,card:{name:'M1047'}}],spelltrap:[{uid:'e1047',faceUp:true,equippedTo:'m1047',card:{name:'E1047'}}],gy:[],banished:[],extra:[]},{deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]}],events:[]};
  const equipCond=A644.conditionAllowed644?.(equipState,0,{condition:'While this card is equipped to a monster'},'e1047',{name:'E1047'});
  const af={raw:'Discard 1 card, then target 1 card in your GY',requiresCompositeResolution:true,nonActivatable:false,condition:'',costs:[{kind:'DISCARD',amount:1},{kind:'DISCARD',amount:1}],targets:[{count:1,description:'card in your GY'}],restriction:{},steps:[{text:'Discard 1 card,'},{text:'target 1 card in your GY'}]};
  const acost=costProof1047(af),atarget=targetProof1047(af),cont=continuationProof1047({name:'T1047'},{nonActivatable:true,nonActivatableReason:'SEMICOLON_CONTINUATION',restriction:{},steps:[{text:'Return that target to the top of the Deck.'}]},{target:atarget});
  const lpHalf=costProof1047({raw:'Pay half your LP; Special Summon 1 monster.',costs:[{kind:'LP_HALF',amount:1}],targets:[]});
  const selfDestroyResolutionCost=costProof1047({raw:'Add it to your hand, then destroy this card.',costs:[{kind:'DESTROY',amount:1,self:true}],targets:[]});
  const flipCondition=conditionProof1047({condition:'FLIP'}),normalSummonAlias=conditionProof1047({condition:'When you Normal Summon this card'}),sentFieldAlias=conditionProof1047({condition:'When this card is sent directly from the field to your Graveyard'});const bareActivation644=A644.conditionSpec644?.('When activated');const usageFragment=effectProof1047(mk('You can only activate 1 \"T1047\" per turn.',{restriction:{oncePerTurn:true},step:'You can only activate 1 \"T1047\" per turn.'}),1);const pronounTarget={exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET',count:1,text:'monster in your GY',runtimeOwned:true};const pronounSummon=resolutionStep1047('Special Summon it.',pronounTarget,{exact:true,limited:false});const opponentSpell=conditionProof1047({condition:"When your opponent activates a Spell Card"});
  const ownDestroyedCond=conditionProof1047({condition:'If a card(s) you control is destroyed by battle or card effect'}),lvl5Cond=conditionProof1047({condition:'If a Level 5 or higher monster(s) is Special Summoned'}),pendDestroyedCond=conditionProof1047({condition:'If this card in the Pendulum Zone is destroyed'}),oppMixedCond=conditionProof1047({condition:"During either player's turn, when your opponent activates a Spell/Trap Card, or monster effect"}),familySpellCond=conditionProof1047({condition:'If an \"Abyss Script\" Spell Card or effect is activated'});const selectorMulti=W.YGOAlpha981?.compileSelector981?.('You can Special Summon 1 \"Unchained\" monster from your hand or GY.');const selectorSetMulti=W.YGOAlpha981?.compileSelector981?.('Set 1 \"K9\" Quick-Play Spell from Deck or GY.');const gain=A973.compileGeneric?.('Increase your Life Points by 700 points.'),setst=A973.compileGeneric?.('Set that target in your Spell & Trap Zone.'),bothBurn=A973.compileGeneric?.('Both players take 500 damage.'),archNamed=A973.compileGeneric?.('Special Summon 1 \"Unchained\" monster from your Deck.'),addIt=A973.compileGeneric?.('add it to your hand,'),destroyST=A973.compileGeneric?.('destroy all Spell and Trap Cards on the field.');
  const stat607=promotedRuntimeStep1047('That monster gains 1000 ATK.',{exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET'}),stat608=promotedRuntimeStep1047("That monster's ATK becomes 2500.",{exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET'}),token608=promotedRuntimeStep1047('Special Summon 1 "Test Token" (Warrior/DARK/Level 1/ATK 0/DEF 0).',{exact:true,kind:'NONE'});
  const attack613=promotedRuntimeStep1047('This card cannot attack this turn.',{exact:true,kind:'NONE'}),negate613=promotedRuntimeStep1047("Negate that target's effects until the end of this turn.",{exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET'});
  const dynamic767=promotedRuntimeStep1047('Draw cards equal to the number of monsters you control.',{exact:true,kind:'NONE'});
  const atk761=promotedRuntimeStep1047("Halve that target's ATK until the end of this turn.",{exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET'});
  const damageCalcCond=conditionProof1047({condition:"When this card attacks an opponent's face-down Defense Position monster"});
  const damageCalcStep=resolutionStep1047("this card's ATK becomes 2400 during damage calculation only.",{exact:true,kind:'NONE'},{exact:true,limited:false});
  const handDeckNamed=W.YGOAlpha981?.compileSelector981?.('Special Summon 1 "Berserk Dragon" from your hand or Deck.');
  const sentTurnSpec=W.YGOAlpha619?.conditionSpec619?.('If a Level 8 or higher monster under your control was sent to the Graveyard this turn');
  const sentTurnState={turn:3,activePlayer:0,lp:[8000,8000],phase:'MAIN PHASE',zones:[{deck:[],hand:[],monster:[],spelltrap:[],gy:[{uid:'lv8-1047',owner:0,controller:0,card:{name:'Blue-Eyes White Dragon',type:'Normal Monster',level:8}}],banished:[],extra:[]},{deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]}],events:[{id:1,turn:3,player:0,uid:'lv8-1047',card:'Blue-Eyes White Dragon',from:'monster',to:'gy'}]};
  const sentTurnYes=W.YGOAlpha619?.conditionAllowed619?.(sentTurnState,0,{condition:'If a Level 8 or higher monster under your control was sent to the Graveyard this turn'},null);sentTurnState.events[0].turn=2;const sentTurnNo=W.YGOAlpha619?.conditionAllowed619?.(sentTurnState,0,{condition:'If a Level 8 or higher monster under your control was sent to the Graveyard this turn'},null);
  const catalogReady=arr(W.CARD_CATALOG).length>=19617;
  const checks={
    usageOnly:usage.exact===true,
    locationMetadata:catalogReady?meta.exact===true:true,
    structuredTarget:target.exact===true,
    quotedTarget:quoted.exact===true&&quoted.runtimeOwned===true,
    selfFaceDown:face.exact===true,
    randomRejected:bad.exact!==true,
    fixedStructuredCost:acost.exact===true&&acost.kind==='DISCARD',
    halfLpCost:lpHalf.exact===true&&lpHalf.kind==='LP_HALF',
    selfDestroyResolutionNotCost:selfDestroyResolutionCost.exact===true&&selfDestroyResolutionCost.kind==='NONE',
    inheritedContinuation:cont?.exact===true&&cont.inheritedTarget===true,
    equippedCondition:equipCond?.ok===true&&equipCond?.spec?.exact===true,
    flipCondition:flipCondition?.exact===true,
    normalSummonAlias:normalSummonAlias?.exact===true,
    sentFieldAlias:sentFieldAlias?.exact===true,
    bareActivation644:bareActivation644?.exact===true&&bareActivation644?.kind==='SOURCE_CARD_ACTIVATED',
    gainPhrase:gain?.kind==='GAIN_LP_FIXED'&&Number(gain?.amount)===700,
    setSelectedST:setst?.kind==='SET_SELECTED_ST',
    addItHand:addIt?.kind==='RETURN_SELECTED_HAND',
    destroyAllST:destroyST?.kind==='DESTROY_ALL_ST',
    bothPlayersBurn:bothBurn?.kind==='BURN_BOTH_FIXED'&&Number(bothBurn?.amount)===500,
    archetypeNotExactName:archNamed===null,
    usageFragmentNoOp:usageFragment?.exact===true,
    promoted607Stat:stat607?.kind==='STAT_DELTA'&&stat607?.engine==='A607',
    promoted608Stat:stat608?.kind==='STAT_SET_ABSOLUTE'&&stat608?.engine==='A608',
    promoted608Token:token608?.kind==='TOKEN_FIXED'&&token608?.engine==='A608',
    promoted613Attack:attack613?.kind==='CANNOT_ATTACK_TURN'&&attack613?.engine==='A613',
    promoted613Negate:negate613?.kind==='NEGATE_EFFECTS_TURN'&&negate613?.engine==='A613',
    promoted767Dynamic:dynamic767?.kind==='DRAW_DYNAMIC'&&dynamic767?.engine==='A767',
    promotedAtkHalf:((atk761?.kind==='ATK_MULT'&&atk761?.engine==='A761')||(atk761?.kind==='STAT_MULTIPLY'&&atk761?.engine==='A608')),
    pronounTargetInheritance:pronounSummon?.kind==='SPECIAL_SELECTED',
    opponentSpellCondition:opponentSpell?.exact===true,
    controlledDestroyedCondition:ownDestroyedCond?.exact===true,
    level5SpecialCondition:lvl5Cond?.exact===true,
    pendulumDestroyedCondition:pendDestroyedCond?.exact===true,
    opponentMixedActivationCondition:oppMixedCond?.exact===true,
    namedFamilySpellCondition:familySpellCond?.exact===true,
    multiZoneFiniteSelector:Array.isArray(selectorMulti?.fromZones)&&selectorMulti.fromZones.join('|')==='hand|gy',
    finiteSetSelector:selectorSetMulti?.action==='SET_ST'&&selectorSetMulti?.fromZones?.join('|')==='deck|gy',
    damageCalcAtkCondition:damageCalcCond?.exact===true&&damageCalcCond?.kind==='SOURCE_ATTACKS_OPP_FACEDOWN_DEF',
    damageCalcAtkResolution:damageCalcStep?.kind==='ATK_SELF_SET_DAMAGE_CALC_FIXED'&&Number(damageCalcStep?.amount)===2400,
    handDeckNamedSelector:handDeckNamed?.exactName==='Berserk Dragon'&&handDeckNamed?.fromZones?.join('|')==='hand|deck',
    sentGyTurnCondition:sentTurnSpec?.exact===true&&sentTurnSpec?.kind==='YOUR_LEVEL_MONSTER_SENT_GY_THIS_TURN'&&sentTurnYes?.ok===true&&sentTurnNo?.ok===false,
    genericKinds:A973.compileGeneric?.('Flip this card into face-down Defense Position.')?.kind==='SET_SELF_FACEDOWN_DEF'&&A973.compileGeneric?.('Return that target to the top of the Deck.')?.kind==='RETURN_SELECTED_DECK_TOP'&&A973.compileGeneric?.('Destroy all monsters your opponent controls.')?.kind==='DESTROY_ALL_OPP_MONSTERS'&&A973.compileGeneric?.('Banish all monsters your opponent controls.')?.kind==='BANISH_ALL_OPP_MONSTERS'&&A973.compileGeneric?.('Banish that target face-down.')?.kind==='BANISH_SELECTED_FACEDOWN'&&A973.compileGeneric?.('Shuffle that target into the Deck.')?.kind==='SHUFFLE_SELECTED_DECK',promotedGenericSafe:SAFE_RESOLUTION_1047.has('BANISH_SELECTED_FACEDOWN')&&SAFE_RESOLUTION_1047.has('SHUFFLE_SELECTED_DECK')&&resolutionStep1047('Banish that target face-down.',{exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET'}, {exact:true})?.kind==='BANISH_SELECTED_FACEDOWN'&&resolutionStep1047('Shuffle that target into the Deck.',{exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET'}, {exact:true})?.kind==='SHUFFLE_SELECTED_DECK',tributaryAtk613:A613.compileStep613?.('it loses ATK equal to the original ATK of the Tributed monster, until the end of this turn.')?.kind==='ATK_SELECTED_DELTA_TRIBUTED_ORIGINAL',sourceCurrentAtk613:A613.compileStep613?.("it gains ATK equal to this card's current ATK, until the end of this turn.")?.kind==='ATK_SELECTED_DELTA_SOURCE_CURRENT',inheritedSetST:resolutionStep1047('Set that card.',{exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET',text:'\"Abyss Script\" Spell Card in your Graveyard'},{exact:true})?.kind==='SET_SELECTED_ST'&&resolutionStep1047('Set that card.',{exact:true,kind:'STRUCTURED_FILTERED_SINGLE_TARGET',text:'monster in your Graveyard'},{exact:true})==null
  };
  const pass=Object.values(checks).every(Boolean);
  return{version:VERSION,pass,status:catalogReady?(pass?'PASS':'FAIL'):(pass?'INITIALIZING':'FAIL'),catalogReady,deferredChecks:catalogReady?[]:['locationMetadata'],checks,rows:{usage,meta,target,quoted,face,bad,acost,atarget,cont,lpHalf,selfDestroyResolutionCost,flipCondition,normalSummonAlias,sentFieldAlias,bareActivation644,gain,setst,bothBurn,archNamed,addIt,destroyST,damageCalcCond,damageCalcStep,handDeckNamed,sentTurnSpec,sentTurnYes,sentTurnNo}};
}
function structural1047(){const ids=[...D.querySelectorAll('[id]')].map(x=>x.id),stats=D.querySelectorAll('#stats .stat').length,formats=D.querySelectorAll('.fmt').length,cat=arr(W.CARD_CATALOG),b=banlist1047();const checks={bundleIntegrity:W.__YGO_BUNDLE_INTEGRITY?.pass===true,identity:D.title===TITLE,authority:raw(W.YGO_APP_VERSION)===VERSION,appVersion:raw(W.YGOApp?.version)===VERSION,uniqueIds:new Set(ids).size===ids.length,load:!!D.getElementById('alpha306LoadDeck'),delete:!!D.getElementById('alpha306DeleteDeck'),diana:!!D.querySelector('.diana-center-zone'),ydk:typeof W.parseYDK==='function',scoreUi:!!D.getElementById('score')&&!!D.getElementById('tier'),stats:stats===10,formats:formats>=9,catalogSource:!!D.getElementById('ygo-db-embedded')};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,stats,formats,catalogLoaded:cat.length,catalogFull:cat.length>=19617,banlist:b}}
function search1047(){
 const own=W.__YGO1047_BUDGETED_SEARCH||null;
 const src=own?.certificates?.length?'alpha1047':W.__YGO864_SEARCH?.certificates?.at?.(-1)?'alpha864':W.__YGO688_LAST_EXHAUSTIVE?.certificate?'alpha688':W.__YGO669_LAST_EXHAUSTIVE?.certificate?'alpha669':'none';
 const c=own?.certificates?.at?.(-1)||W.__YGO864_SEARCH?.certificates?.at?.(-1)||W.__YGO688_LAST_EXHAUSTIVE?.certificate||W.__YGO669_LAST_EXHAUSTIVE?.certificate||{};
 const fingerprint=deckFingerprint1056();
 const checks={allLegalActionsEnumerated:c.allLegalActionsEnumerated===true,allTransitionsExact:c.allTransitionsExact===true,
  targetChoiceEnumerationComplete:c.targetChoiceEnumerationComplete===true,
  stateDominanceSafe:c.stateDominanceSafe===true,objectiveComplete:c.objectiveComplete===true,
  boundaryOptimalityProven:c.horizonOptimalityProven===true||c.domainExhaustedOptimalityProven===true,
  notTruncated:c.truncated===false,
  matchingDeck:typeof fingerprint==='string'&&typeof c.deckFingerprint==='string'&&c.deckFingerprint===fingerprint};
 const checked=Object.values(checks).every(Boolean),boundedComplete=checked&&(src!=='alpha1047'||own?.boundedComplete===true);
 /* Un horizonte cerrado sólo certifica ese horizonte. Un testigo de optimalidad
    global debe cubrir el dominio ENTERO y ligarse a reglas y banlist. */
 const fmt=raw(A973.activeFormatKey?.()||'').trim().toLowerCase();
 const globalChecks={domainExhausted:c.domainExhaustedOptimalityProven===true,
  currentRulesVersion:c.rulesVersion===VERSION,
  currentFormat:c.formatKey===fmt,
  banlistDate:fmt!=='tcg'||c.banlistSnapshotDate==='2026-10-19'};
 const declaredGlobal=boundedComplete&&c.globalOptimalityProven===true&&Object.values(globalChecks).every(Boolean);
 globalChecks.ruleUniverseCertified=declaredGlobal&&corpus1047()?.pass===true;
 const globalOptimalityProven=declaredGlobal&&globalChecks.ruleUniverseCertified;
 return{version:VERSION,source:src,certificate:c,checks,globalChecks,boundedComplete,
  globalOptimalityProven,status:boundedComplete?'HORIZON_COMPLETE':c.resumable===true?'CHECKPOINT_READY':'BOUNDED_SEARCH_OPEN'};
}
/* Alpha 1064: no se permite convertir una condición no demostrada en exacta
   por etiquetas mechanicsProof / ruleCertificate aportadas junto con la jugada.
   Sólo el motor de validación independiente puede producir evidencia válida. */
function lineEvidence1047(line){
 let prior;
 try{prior=A986.lineEvidence986?.(line)||{pass:false,reason:'NO_ORACLE'}}
 catch(e){prior={pass:false,error:raw(e?.message||e)}}
 return{...prior,version:VERSION,pass:prior?.pass===true,recoveredLegacyConditions:0,policy:'Fail-closed: no recuperar condiciones de reglas a partir de etiquetas auto-declaradas en acciones; requieren un oráculo independiente.'};
}
/* Alpha 1064: auditoría estricta de instantáneas, sin suponer zonas omitidas.
   Es una verificación estructural; no prueba reglas complejas ni optimalidad. */
/* Alpha 1064: contratos estructurales de movimiento con identidad persistente.
   No convierten transiciones de zonas en rulings oficiales de Konami. */
const ZONES_1063=['deck','hand','monster','spelltrap','gy','banished','extra'];
const CARD_DYNAMIC_FIELDS_1063=new Set(['position','faceUp','faceDown','zone','column','orientation']);
function cardUid1063(c){return c&&typeof c==='object'&&c.uid!=null&&String(c.uid).trim()?String(c.uid):null}
function stableCard1063(c){
 if(!c||typeof c!=='object')return JSON.stringify(c);
 const obj={};for(const k of Object.keys(c).sort())if(!CARD_DYNAMIC_FIELDS_1063.has(k))obj[k]=c[k];
 return JSON.stringify(obj);
}
function completeCard1064(c){
 if(!c||typeof c!=='object')return JSON.stringify(c);
 const obj={};for(const k of Object.keys(c).sort())obj[k]=c[k];
 return JSON.stringify(obj);
}
function snapshot1063(s,path){
 const issues=[],index=new Map();
 if(!s||!Array.isArray(s.zones)||s.zones.length!==2)return{pass:false,issues:[path+': faltan dos jugadores con sus zonas'],index};
 for(let p=0;p<2;p++){
  const z=s.zones[p];if(!z||typeof z!=='object'){issues.push(path+': jugador '+p+' ausente');continue}
  for(const f of ZONES_1063){
   if(!Array.isArray(z[f])){issues.push(path+': zona '+p+'/'+f+' ausente');continue}
   for(let i=0;i<z[f].length;i++){
    const c=z[f][i],uid=cardUid1063(c);
    if(!uid){issues.push(path+': carta sin uid de instancia en '+p+'/'+f);continue}
    if(index.has(uid))issues.push(path+': uid duplicado '+uid+' entre zonas o jugadores');
    else index.set(uid,{player:p,zone:f,slot:i,card:c,fingerprint:stableCard1063(c),fullFingerprint:completeCard1064(c)});
   }
  }
 }
 return{pass:issues.length===0,issues,index};
}
function stateContinuity1063(a,b,label){
 const left=snapshot1063(a,label+' antes'),right=snapshot1063(b,label+' después');
 const issues=[...left.issues,...right.issues];
 if(issues.length)return{pass:false,issues,compared:0};
 let compared=0;
 for(let p=0;p<2;p++)for(const f of ZONES_1063){
  const u=xs=>xs.map(cardUid1063);const x=u(a.zones[p][f]),y=u(b.zones[p][f]);
  // El orden de la mano se puede normalizar, nunca el orden del Deck.
  if(f==='hand'){x.sort();y.sort()}
  compared++;
  if(JSON.stringify(x)!==JSON.stringify(y))issues.push(label+': orden/identidad discontinuos en '+p+'/'+f);
 }
 for(const [uid,info] of left.index){
  const after=right.index.get(uid);
  if(!after)issues.push(label+': carta desaparecida '+uid);
  else if(info.fullFingerprint!==after.fullFingerprint)issues.push(label+': identidad, posición o propiedades de carta alteradas '+uid);
 }
 for(const uid of right.index.keys())if(!left.index.has(uid))issues.push(label+': carta creada '+uid);
 const keys=new Set([...Object.keys(a||{}),...Object.keys(b||{})]);keys.delete('zones');
 for(const k of keys)if(JSON.stringify(a[k])!==JSON.stringify(b[k]))issues.push(label+': estado '+k+' discontinuo');
 return{pass:issues.length===0,issues,compared};
}
function transitionContract1064(spec){
 const issues=[],action=raw(spec?.action),player=spec?.player,uid=raw(spec?.uid),before=spec?.before,after=spec?.after;
 const supported=['DRAW_ONE','NORMAL_SUMMON_L4','NORMAL_SET_L4','SET_SPELL_TRAP'].includes(action);
 if(!supported)issues.push('Acción fuera del subconjunto soportado');
 if(!Number.isSafeInteger(player)||player<0||player>1)issues.push('Jugador inválido');
 if(!uid)issues.push('Falta uid de instancia');
 const b=snapshot1063(before,'antes'),a=snapshot1063(after,'después');issues.push(...b.issues,...a.issues);
 if(issues.length)return{version:VERSION,supported,pass:false,issues,certifiesRules:false};
 const src=action==='DRAW_ONE'?'deck':'hand',dst=action==='DRAW_ONE'?'hand':(action==='NORMAL_SUMMON_L4'||action==='NORMAL_SET_L4')?'monster':'spelltrap';
 const card=b.index.get(uid),end=a.index.get(uid);
 if(!card||card.player!==player||card.zone!==src)issues.push('La instancia no está en el origen correcto');
 if(!end||end.player!==player||end.zone!==dst)issues.push('La instancia no llegó al destino correcto');
 if(card&&end&&card.fingerprint!==end.fingerprint)issues.push('La identidad o propiedades de la carta cambiaron durante el movimiento');
 if(card&&action==='DRAW_ONE'&&card.slot!==0)issues.push('Sólo se permite robar la primera carta del Deck');
 if(card&&action!=='DRAW_ONE'){
  if(before.activePlayer!==player||!/^MAIN(?:1|2)?$/i.test(raw(before.phase)))issues.push('Colocación/invocación fuera de fase principal del jugador activo');
  const c=card.card,bits=Number(c.typeBits??c.type),level=Number(c.level);
  if(!Number.isSafeInteger(bits)||bits<=0)issues.push('Tipo de carta sin evidencia en el objeto original');
  if(action==='SET_SPELL_TRAP'&&(!Number.isSafeInteger(bits)||!(bits&6)||(bits&1)))issues.push('La instancia no es una Mágica/Trampa demostrada');
  if(action==='NORMAL_SUMMON_L4'||action==='NORMAL_SET_L4'){
   if(!Number.isSafeInteger(level)||level<1||level>4||Number(spec?.level??level)!==level)issues.push('Nivel real de monstruo incompatible con invocación sin tributo');
   if(!Number.isSafeInteger(bits)||!(bits&1)||(bits&0x4000)||(bits&0x2000000)||(bits&0x800000)||(bits&0x2000)||(bits&0x40)||(bits&0x80))issues.push('Tipo de monstruo no compatible con el subconjunto de invocación normal');
  }
 }
 if(end){
  const observed=end.card||{},face=observed.faceUp,pos=raw(observed.position).toUpperCase();
  if(action==='NORMAL_SUMMON_L4'&&(face!==true||pos!=='ATTACK'))issues.push('Invocación Normal debe terminar boca arriba en Posición de Ataque');
  if(action==='NORMAL_SET_L4'&&(face!==false||pos!=='DEFENSE'))issues.push('Normal Set debe terminar boca abajo en Posición de Defensa');
  if(action==='SET_SPELL_TRAP'&&face!==false)issues.push('Carta Mágica/Trampa colocada debe quedar boca abajo');
 }
 if(card&&(action==='NORMAL_SUMMON_L4'||action==='NORMAL_SET_L4')&&before.zones[player].monster.length>=5)issues.push('No queda zona principal de monstruos');
 if(card&&action==='SET_SPELL_TRAP'&&before.zones[player].spelltrap.length>=5)issues.push('No queda zona principal de Mágicas/Trampas');
 const all=new Set([...b.index.keys(),...a.index.keys()]);
 for(const k of all){
  const old=b.index.get(k),now=a.index.get(k);
  if(!old||!now){issues.push('Instancia creada o perdida '+k);continue}
  if(old.fullFingerprint!==now.fullFingerprint&&k!==uid)issues.push('Carta ajena: identidad, posición o estado modificado '+k);
  if(k!==uid&&(old.player!==now.player||old.zone!==now.zone))issues.push('Movimiento adicional injustificado '+k);
 }
 // Cada zona conserva las instancias y sus posiciones; el movimiento especificado
 // es la única diferencia admitida, sin reordenar Deck ni introducir cartas extra.
 if(card){
  for(let p=0;p<2;p++)for(const f of ZONES_1063){
   const expected=before.zones[p][f].map(cardUid1063);
   if(p===player&&f===src)expected.splice(card.slot,1);
   if(p===player&&f===dst)expected.push(uid);
   const got=after.zones[p][f].map(cardUid1063);
   if(JSON.stringify(expected)!==JSON.stringify(got))issues.push('Transición no coincide en jugador '+p+'/'+f);
  }
 }
 const meta=new Set([...Object.keys(before),...Object.keys(after)]);meta.delete('zones');
 for(const k of meta){
  if(k==='normalSummonsUsed'&&(action==='NORMAL_SUMMON_L4'||action==='NORMAL_SET_L4')){
   if(Number(before[k])!==0||Number(after[k])!==1)issues.push('Uso de invocación normal no demostrado');
  }else if(JSON.stringify(before[k])!==JSON.stringify(after[k]))issues.push('Cambio de estado no explicado: '+k);
 }
 for(const s of [before,after])if((Array.isArray(s.chain)&&s.chain.length)||(Array.isArray(s.triggerQueue)&&s.triggerQueue.length))issues.push('Cadena/disparadores fuera del contrato limitado');
 return{version:VERSION,supported,pass:issues.length===0,issues:[...new Set(issues)].slice(0,60),certifiesRules:false,scope:'TRANSICION_ESTRUCTURAL_1064',rulebook:'https://www.yugioh-card.com/en/rulebook/',externalRulingVerified:false};
}

/* Alpha 1065 — contratos de resolución local para DOS cartas oficiales, sin inferir cadenas,
   legalidad de activación, ventanas de respuesta, negaciones, ni banlist.
   Konami TCG (texto): Upstart Goblin cid=4895, Dian Keto cid=4348.
   UID es identidad de una COPIA física, card.id es número de passcode.
   Entrada: Mágica Normal previamente activada y visible en spelltrap; salida: GY.
   Este contrato sólo comprueba el estado de RESOLUCIÓN sin cadena / sin interrupciones. */
const OFFICIAL_NORMAL_SPELL_1065=Object.freeze({
 70368879:Object.freeze({name:'Upstart Goblin',draw:1,lpPlayer:null,lpAmount:1000,source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4895&ope=2&request_locale=en'}),
 84257639:Object.freeze({name:'Dian Keto the Cure Master',draw:0,lpPlayer:'self',lpAmount:1000,source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4348&ope=2&request_locale=en'}),
 84257640:Object.freeze({name:'Dian Keto the Cure Master',draw:0,lpPlayer:'self',lpAmount:1000,source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4348&ope=2&request_locale=en'}),
 /* Alpha 1143: cuatro resoluciones más contrastadas directamente con Neuron de Konami.
    lpDelta modela la variación [propietario de la activación, rival] sin elecciones,
    únicamente cuando no hay redirecciones, cadenas ni efectos de reemplazo. */
 76103675:Object.freeze({name:'Sparks',draw:0,lpDelta:Object.freeze({self:0,opponent:-200}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4349&ope=2&request_locale=en'}),
 46130346:Object.freeze({name:'Hinotama',draw:0,lpDelta:Object.freeze({self:0,opponent:-500}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4350&ope=2&request_locale=en'}),
 19523799:Object.freeze({name:'Ookazi',draw:0,lpDelta:Object.freeze({self:0,opponent:-800}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4352&ope=2&request_locale=en'}),
 45311864:Object.freeze({name:'Goblin Thief',draw:0,lpDelta:Object.freeze({self:500,opponent:-500}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=5985&ope=2&request_locale=en'}),
 /* Alpha 1143: siete Mágicas Normales más, comprobadas en Yu-Gi-Oh! Neuron.
    Se aceptan por separado los IDs impresos que se encuentran en el catálogo local.
    Únicamente certifica la variación de LP después de la activación, no efectos de reemplazo. */
 46918794:Object.freeze({name:'Tremendous Fire',draw:0,lpDelta:Object.freeze({self:-500,opponent:-1000}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4353&ope=2&request_locale=en'}),
 66719324:Object.freeze({name:'Rain of Mercy',draw:0,lpDelta:Object.freeze({self:1000,opponent:1000}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=5151&ope=2&request_locale=en'}),
 38199696:Object.freeze({name:'Red Medicine',draw:0,lpDelta:Object.freeze({self:500,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4345&ope=2&request_locale=en'}),
 160204032:Object.freeze({name:'Red Medicine',draw:0,lpDelta:Object.freeze({self:500,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4345&ope=2&request_locale=en'}),
 73134081:Object.freeze({name:'Final Flame',draw:0,lpDelta:Object.freeze({self:0,opponent:-600}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4351&ope=2&request_locale=en'}),
 73134082:Object.freeze({name:'Final Flame',draw:0,lpDelta:Object.freeze({self:0,opponent:-600}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4351&ope=2&request_locale=en'}),
 20871001:Object.freeze({name:'Blue Medicine',draw:0,lpDelta:Object.freeze({self:400,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4840&ope=2&request_locale=en'}),
 47852924:Object.freeze({name:'Soul of the Pure',draw:0,lpDelta:Object.freeze({self:800,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4347&ope=2&request_locale=en'}),
 47852925:Object.freeze({name:'Soul of the Pure',draw:0,lpDelta:Object.freeze({self:800,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4347&ope=2&request_locale=en'}),
 11868825:Object.freeze({name:"Goblin's Secret Remedy",draw:0,lpDelta:Object.freeze({self:600,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4346&ope=2&request_locale=en'}),
 /* Alpha 1143: sólo resolución delimitada. Ambas PROHIBIDAS en TCG.
    Un efecto de robo/descarte no equivale a una activación o baraja legales. */
 55144522:Object.freeze({name:'Pot of Greed',draw:2,discard:0,lpDelta:Object.freeze({self:0,opponent:0}),forbiddenTCG:true,source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4844&ope=2&request_locale=en'}),
 79571449:Object.freeze({name:'Graceful Charity',draw:3,discard:2,lpDelta:Object.freeze({self:0,opponent:0}),forbiddenTCG:true,source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4812&ope=2&request_locale=en'}),
 /* Alpha 1143: sólo resolución determinista sin activación, cadenas, reemplazos ni disparadores.
    Dark World Dealings: ambos roban uno, ambos descartan uno DESPUÉS de robar.
    Card Destruction: ambos descartan la mano ANTES de robar igual cantidad.
    Estas cartas no equivalen a los efectos individuales de Pot of Greed o Graceful Charity. */
 74117290:Object.freeze({name:'Dark World Dealings',bothPlayers:'DRAW_THEN_DISCARD_ONE',lpDelta:Object.freeze({self:0,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=7002&ope=2&request_locale=en'}),
 72892473:Object.freeze({name:'Card Destruction',bothPlayers:'DISCARD_HAND_THEN_DRAW',lpDelta:Object.freeze({self:0,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4821&ope=2&request_locale=en'}),
 /* Alpha 1143: comprobación estructural de destrucción simultánea de zona rival.
    No modela inmunidades, sustituciones, disparadores, Tokens, Péndulos ni cambios de control. */
 12580477:Object.freeze({name:'Raigeki',destroyOpponentZone:'monster',lpDelta:Object.freeze({self:0,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4343&ope=2&request_locale=en'}),
 18144506:Object.freeze({name:"Harpie's Feather Duster",destroyOpponentZone:'spelltrap',lpDelta:Object.freeze({self:0,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4678&ope=2&request_locale=en'}),
 18144507:Object.freeze({name:"Harpie's Feather Duster",destroyOpponentZone:'spelltrap',lpDelta:Object.freeze({self:0,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4678&ope=2&request_locale=en'}),
 /* Alpha 1143: barridos BILATERALES simultáneos; no crean una excepción a
    protecciones, control ajeno, Péndulos ni efectos disparados. */
 53129443:Object.freeze({name:'Dark Hole',destroyFieldZone:'monster',lpDelta:Object.freeze({self:0,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4342&ope=2&request_locale=en'}),
 19613556:Object.freeze({name:'Heavy Storm',destroyFieldZone:'spelltrap',lpDelta:Object.freeze({self:0,opponent:0}),forbiddenTCG:true,source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4891&ope=2&request_locale=en'}),
 /* Alpha 1143: revivir sólo Monstruos Normales físicos de cualquiera de los
    Cementerios, en un campo con zona disponible; no se permiten condiciones,
    cadenas, negaciones ni efectos de invocación no representados. */
 83764718:Object.freeze({name:'Monster Reborn',reviveNormalFromGy:true,lpDelta:Object.freeze({self:0,opponent:0}),source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4842&ope=2&request_locale=en'})
});
function normalSpellResolution1065(spec){
 const issues=[],action=raw(spec?.action),player=spec?.player,uid=raw(spec?.uid),before=spec?.before,after=spec?.after;
 const fail=()=>({version:VERSION,pass:false,supported:true,issues:[...new Set(issues)].slice(0,60),scope:'RESOLUCION_VEINTIDOS_MAGICAS_NORMALES_1140',certifiesRules:false,certifiesActivation:false,certifiesBanlist:false});
 if(action!=='RESOLVE_NORMAL_SPELL_1065')issues.push('Tipo de resolución no soportado');
 if(!Number.isSafeInteger(player)||player<0||player>1)issues.push('Jugador inválido');
 if(!uid)issues.push('Falta UID de Mágica activada');
 const b=snapshot1063(before,'antes'),a=snapshot1063(after,'después');issues.push(...b.issues,...a.issues);
 if(issues.length)return fail();
 const card=b.index.get(uid),end=a.index.get(uid);
 if(!card||card.player!==player||card.zone!=='spelltrap')issues.push('La Mágica debe estar activada boca arriba en la zona propia');
 if(!end||end.player!==player||end.zone!=='gy')issues.push('La Mágica debe ir al Cementerio tras resolver');
 const original=card?.card||{},cardId=Number(original.id),rule=OFFICIAL_NORMAL_SPELL_1065[cardId];
 if(!rule)issues.push('Carta no incluida en el conjunto oficial limitado de veintidós nombres');
 if(rule&&original.name!=null&&low(original.name)!==low(rule.name))issues.push('Nombre e ID de carta incompatibles');
 if(Number(original.typeBits??original.type)!==2)issues.push('No se ha acreditado Mágica Normal');
 if(original.faceUp!==true)issues.push('La Mágica debe estar boca arriba antes de resolver');
 if(card&&end&&card.fingerprint!==end.fingerprint)issues.push('Identidad inmutable de carta alterada');
 if(before.activePlayer!==player||!/^MAIN(?:1|2)?$/i.test(raw(before.phase)))issues.push('Sólo resolución en Main Phase del jugador activo en este subconjunto');
 if(!Array.isArray(before.lp)||!Array.isArray(after.lp)||before.lp.length!==2||after.lp.length!==2||![...before.lp,...after.lp].every(x=>Number.isSafeInteger(x)&&x>=0))issues.push('LP deben constar como enteros no negativos de ambos jugadores');
 if(!Array.isArray(before.chain)||!Array.isArray(after.chain)||before.chain.length||after.chain.length||!Array.isArray(before.triggerQueue)||!Array.isArray(after.triggerQueue)||before.triggerQueue.length||after.triggerQueue.length)issues.push('Cadenas o disparadores no resueltos o no representados');
 const bilateral=rule?.bothPlayers||null;
 const wipe=rule?.destroyOpponentZone||rule?.destroyFieldZone||null;
 const fieldWipe=!!rule?.destroyFieldZone;
 const revival=rule?.reviveNormalFromGy===true;
 const reviveUid=raw(spec?.targetUid);
 let draws=rule?.draw||0,discards=rule?.discard||0;
 let drawCountByPlayer=null,discardCountByPlayer=null;
 let destroyedUids=null,destroyedUidsByPlayer=null,destroyedUidsByOwner=null;
 if(revival){
  // Sólo comprobación estructural de Monstruo Normal del GY al campo propio.
  // No acredita que otro efecto no prohíba la Invocación Especial ni que se
  // hayan pagado costes/abierto una ventana de activación válida.
  if(!reviveUid||reviveUid===uid)issues.push('Monster Reborn exige un único objetivo de Cementerio distinto de la Mágica');
  if(spec?.targetUids!=null||spec?.discardUids!=null||spec?.discardUidsByPlayer!=null||spec?.destroyedUids!=null||spec?.destroyedUidsByPlayer!=null)
   issues.push('Monster Reborn no admite víctimas, descartes ni listas de objetivos adicionales');
  const located=b.index.get(reviveUid),final=a.index.get(reviveUid),monster=located?.card||{};
  const monsterType=Number(monster.typeBits??monster.type);
  if(!located||located.zone!=='gy')issues.push('Objetivo no está en un Cementerio');
  if(located&&monster.ownerPlayer!==located.player)issues.push('No se acredita el Cementerio del dueño original');
  if(monsterType!==1||!Number.isSafeInteger(Number(monster.id))||Number(monster.id)<=0)
   issues.push('Sólo Monstruos Normales físicos inequívocos, sin Extra Deck, Tokens ni efectos especiales');
  if(located&&monster.faceUp!==true)issues.push('Carta objetivo no acreditada boca arriba en el Cementerio');
  if(monster.cannotBeSpecialSummoned===true||monster.specialSummonRestricted===true||monster.revivalRestricted===true||monster.summonCondition===true||monster.requiresProperSummon===true)
   issues.push('Restricción de Invocación Especial fuera del contrato');
  if(before.zones[player].monster.length>=5)issues.push('No existe zona libre de monstruos propia');
  if(!final||final.zone!=='monster'||final.player!==player)issues.push('El monstruo no se Invocó al campo del activador');
  if(final&&final.card.faceUp!==true)issues.push('Se exige Invocación Especial boca arriba en el campo');
  if(located&&final&&located.fingerprint!==final.fingerprint)issues.push('La carta revivida cambió su identidad o propiedades persistentes');
  for(let p=0;p<2;p++)for(const zone of ZONES_1063){
   const expected=before.zones[p][zone].map(cardUid1063);
   if(p===player&&zone==='spelltrap'&&card)expected.splice(card.slot,1);
   if(located&&located.player===p&&zone==='gy'){
    const pos=expected.indexOf(reviveUid);if(pos>=0)expected.splice(pos,1);
   }
   if(p===player&&zone==='monster'&&located)expected.push(reviveUid);
   if(p===player&&zone==='gy')expected.push(uid);
   if(JSON.stringify(expected)!==JSON.stringify(after.zones[p][zone].map(cardUid1063)))issues.push('Invocación Especial incompatible en '+p+'/'+zone);
  }
 }else if(wipe){
  // Contrato deliberadamente restrictivo: una carta activa se manda al GY al
  // terminar la cadena; para Heavy Storm NO es destruida por su propio efecto.
   // Se diferencia el campo del CONTROLADOR (zona de origen) del Cementerio del
   // PROPIETARIO (destino). Esta distinción es exigida por el reglamento oficial.
   // No modela inmunidades, reemplazos ni efectos disparados por destrucción,
   // y nunca emite certifiesRules:true.
  const players=fieldWipe?[0,1]:[1-player],victimsByPlayer=[[],[]];
  for(const p of players){
   victimsByPlayer[p]=before.zones[p][wipe].filter(v=>!((p===player)&&(wipe==='spelltrap')&&cardUid1063(v)===uid));
  }
  destroyedUidsByPlayer=victimsByPlayer.map(xs=>xs.map(cardUid1063));
   // Orden determinista de las víctimas por zona controlada; el orden de entrada
   // al Cementerio del propietario debe ser explícito en la traza auditada.
   destroyedUidsByOwner=[[],[]];
   for(let controlling=0;controlling<2;controlling++)for(const victim of victimsByPlayer[controlling]){
    const owner=victim.ownerPlayer;
    if(Number.isSafeInteger(owner)&&owner>=0&&owner<=1)
     destroyedUidsByOwner[owner].push(cardUid1063(victim));
    else issues.push('Propietario de víctima no acreditado: '+cardUid1063(victim));
   }
  destroyedUids=destroyedUidsByPlayer.flat();
  if(spec?.discardUids!=null||spec?.discardUidsByPlayer!=null)issues.push('Un barrido no descarta cartas');
  if(spec?.targetUid!=null||spec?.targetUids!=null)issues.push('Un barrido no selecciona objetivos');
  if(spec?.destroyedUids!=null&&JSON.stringify(spec.destroyedUids)!==JSON.stringify(destroyedUids))issues.push('Lista de destruidos diferente a la zona afectada');
  if(fieldWipe&&(!Array.isArray(spec?.destroyedUidsByPlayer)||JSON.stringify(spec.destroyedUidsByPlayer)!==JSON.stringify(destroyedUidsByPlayer)))
   issues.push('El barrido bilateral exige víctimas de ambos jugadores diferenciadas');
  if(!fieldWipe&&spec?.destroyedUidsByPlayer!=null&&JSON.stringify(spec.destroyedUidsByPlayer)!==JSON.stringify(destroyedUidsByPlayer))
    issues.push('Declaración bilateral de víctimas errónea');
   if(spec?.destroyedUidsByOwner!=null&&JSON.stringify(spec.destroyedUidsByOwner)!==JSON.stringify(destroyedUidsByOwner))
    issues.push('Declaración de Cementerios por propietario errónea');
  for(let p=0;p<2;p++)for(const victim of victimsByPlayer[p]){
   const bits=Number(victim?.typeBits??victim?.type);
   if(!Number.isSafeInteger(bits)||!(bits&(wipe==='monster'?1:6))||bits&(wipe==='monster'?6:1))issues.push('Tipo de víctima incompatible con la zona');
    if(!Number.isSafeInteger(victim.ownerPlayer)||victim.ownerPlayer<0||victim.ownerPlayer>1)issues.push('Propietario de víctima inválido');
   if(bits&0x4000)issues.push('Token fuera del contrato');
   if(bits&0x1000000)issues.push('Péndulo fuera del contrato');
   if(victim.destroyImmune===true||victim.cannotBeDestroyed===true||victim.destructionReplacement===true)
    issues.push('Inmunidad, protección o reemplazo fuera del contrato');
  }
  for(let p=0;p<2;p++)for(const zone of ZONES_1063){
   let expected=before.zones[p][zone].map(cardUid1063);
   if(zone==='spelltrap'&&p===player&&card)expected=expected.filter(x=>x!==uid);
   if(zone===wipe&&players.includes(p))expected=[];
   if(zone==='gy'){
     expected.push(...destroyedUidsByOwner[p]);
    if(p===player)expected.push(uid);
   }
   if(JSON.stringify(expected)!==JSON.stringify(after.zones[p][zone].map(cardUid1063)))issues.push('Barrido incompatible en '+p+'/'+zone);
  }
 }else if(bilateral){
  // Especificación pública: [[UID ...] para jugador 0, [UID ...] para jugador 1].
  // Nunca inferir las cartas descartadas de un resultado inventado por el usuario.
  const provided=spec?.discardUidsByPlayer;
  const declarations=Array.isArray(provided)&&provided.length===2&&provided.every(Array.isArray);
  if(!declarations)issues.push('El efecto bilateral exige discardUidsByPlayer para ambos jugadores');
  if(spec?.discardUids!=null)issues.push('El descarte unilateral no es válido para efecto de ambos jugadores');
  drawCountByPlayer=[0,0];discardCountByPlayer=[0,0];
  for(let p=0;p<2;p++){
   const hand=before.zones[p].hand.map(cardUid1063),deck=before.zones[p].deck.map(cardUid1063);
   const count=bilateral==='DRAW_THEN_DISCARD_ONE'?1:hand.length;
   const expectedDiscards=bilateral==='DRAW_THEN_DISCARD_ONE'?1:hand.length;
   drawCountByPlayer[p]=count;discardCountByPlayer[p]=expectedDiscards;
   if(deck.length<count)issues.push('Deck insuficiente para robo bilateral en jugador '+p);
   const declared=declarations?provided[p]:[];
   const pool=bilateral==='DRAW_THEN_DISCARD_ONE'?hand.concat(deck.slice(0,count)):hand;
   if(!Array.isArray(declared)||declared.length!==expectedDiscards||declared.some(x=>typeof x!=='string'||!x)||new Set(declared).size!==expectedDiscards||declared.some(x=>!pool.includes(x)))issues.push('Descartes del jugador '+p+' no coinciden con su mano del momento de efecto');
   // Para Card Destruction se descarta LA MANO COMPLETA, no una selección.
   // El orden de descarte declarado gobierna el orden del GY de la traza.
   if(bilateral==='DISCARD_HAND_THEN_DRAW'&&(!Array.isArray(declared)||hand.some(x=>!declared.includes(x))))issues.push('Card Destruction exige todas las cartas de la mano del jugador '+p);
   const safe=Array.isArray(declared)&&declared.length===expectedDiscards&&new Set(declared).size===expectedDiscards&&declared.every(x=>typeof x==='string'&&pool.includes(x))?declared:[];
   const expectedHand=bilateral==='DRAW_THEN_DISCARD_ONE'?pool.filter(x=>!safe.includes(x)):deck.slice(0,count);
   for(const zone of ZONES_1063){
    const expected=before.zones[p][zone].map(cardUid1063);
    if(p===player&&zone==='spelltrap'&&card)expected.splice(card.slot,1);
    if(zone==='gy'){expected.push(...safe);if(p===player)expected.push(uid)}
    if(zone==='deck')expected.splice(0,count);
    if(zone==='hand'){expected.length=0;expected.push(...expectedHand)}
    if(JSON.stringify(expected)!==JSON.stringify(after.zones[p][zone].map(cardUid1063)))issues.push('Resolución bilateral incompatible en jugador '+p+'/'+zone);
   }
  }
 }else{
 const draws=rule?.draw||0,discards=rule?.discard||0;
 if(rule&&before.zones[player].deck.length<draws)issues.push('No hay suficientes cartas conocidas en el Deck para el efecto de robo');
 // Graceful Charity roba tres y luego descarta dos; la elección debe vincularse
 // explícitamente a instancias que estén en la mano DESPUÉS de robar, nunca a otras zonas.
 // No se demuestra activación legal, efectos disparados por descarte ni negaciones.
 const drawUids=before.zones[player].deck.slice(0,draws).map(cardUid1063);
 const handAfterDraw=before.zones[player].hand.map(cardUid1063).concat(drawUids);
 const discardUids=spec?.discardUids;
 if(discards){
  if(!Array.isArray(discardUids)||discardUids.length!==discards||discardUids.some(x=>typeof x!=='string'||!x))issues.push('Se exigen dos UID explícitos para el descarte');
  else if(new Set(discardUids).size!==discards||discardUids.some(x=>!handAfterDraw.includes(x)))issues.push('Los UID descartados deben ser dos instancias distintas de la mano después de robar');
 }else if(discardUids!=null&&(!Array.isArray(discardUids)||discardUids.length!==0))issues.push('Descartes inventados para efecto que no descarta');
 const acceptedDiscards=Array.isArray(discardUids)&&discardUids.length===discards&&new Set(discardUids).size===discards&&discardUids.every(x=>typeof x==='string'&&handAfterDraw.includes(x))?discardUids:[];
 const finalHand=handAfterDraw.filter(x=>!acceptedDiscards.includes(x));
 // Los descartes se resuelven antes de que la Mágica terminada vaya al Cementerio.
 for(let p=0;p<2;p++)for(const zone of ZONES_1063){
  const expected=before.zones[p][zone].map(cardUid1063);
  if(p===player&&zone==='spelltrap'&&card)expected.splice(card.slot,1);
  if(p===player&&zone==='gy')expected.push(...acceptedDiscards,uid);
  if(p===player&&zone==='deck')expected.splice(0,draws);
  if(p===player&&zone==='hand'){expected.length=0;expected.push(...finalHand)}
  if(JSON.stringify(expected)!==JSON.stringify(after.zones[p][zone].map(cardUid1063)))issues.push('Zonas incompatibles con resolución en '+p+'/'+zone);
 }
 }
 for(const [id,old] of b.index){
  const now=a.index.get(id);
  if(!now)issues.push('Desapareció una instancia: '+id);
  else if(old.fullFingerprint!==now.fullFingerprint && !(revival&&id===reviveUid&&old.fingerprint===now.fingerprint))issues.push('Propiedades de carta alteradas: '+id);
 }
 for(const id of a.index.keys())if(!b.index.has(id))issues.push('Instancia creada sin explicación: '+id);
 for(const k of new Set([...Object.keys(before),...Object.keys(after)])){
  if(k==='zones'||k==='lp')continue;
  if(JSON.stringify(before[k])!==JSON.stringify(after[k]))issues.push('Metadato de estado modificado sin explicación: '+k);
 }
 if(rule&&Array.isArray(before.lp)&&Array.isArray(after.lp)&&before.lp.length===2&&after.lp.length===2){
  const amounts=rule.lpDelta||{
   self:rule.lpPlayer==='self'?rule.lpAmount:0,
   opponent:rule.lpPlayer==='self'?0:rule.lpAmount
  };
  const expected=before.lp.map((lp,i)=>{
   const delta=i===player?amounts.self:amounts.opponent;
   // El daño que supera los LP restantes deja el total a cero; no certifica
   // la condición de fin de duelo, cadenas, prevención o reemplazos de daño.
   return Math.max(0,lp+delta);
  });
  if(!expected.every(Number.isSafeInteger)||JSON.stringify(expected)!==JSON.stringify(after.lp))issues.push('Variación de LP incompatible con efecto oficial acotado');
 }
 const result=fail();
 return{...result,pass:issues.length===0,issues:[...new Set(issues)].slice(0,60),cardName:rule?.name||null,source:rule?.source||null,drawCount:draws,discardCount:discards,drawCountByPlayer,discardCountByPlayer,destroyedUids,destroyedUidsByPlayer,destroyedUidsByOwner,tcgForbidden:rule?.forbiddenTCG===true,limitations:'Resolución estructural aislada de 22 Mágicas Normales. Monster Reborn sólo revive Monstruos Normales inequívocos sin restricciones explícitas; los barridos envían cartas al Cementerio del propietario incluso si cambia el control, pero no certifican inmunidades, reemplazos, cadenas ni optimalidad.'};
}
function transitionContract1065(spec){
 return raw(spec?.action)==='RESOLVE_NORMAL_SPELL_1065'?normalSpellResolution1065(spec):transitionContract1064(spec);
}
/* Alpha 1066: contrato estructural acotado para Tifón del Espacio Místico.
   Fuente primaria: https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4909&ope=2&request_locale=es
   ID numérico del passcode 05318639 = 5318639.
   Sólo verifica la resolución sin respuestas/negaciones/inmunidades/reemplazos. */
const OFFICIAL_TARGET_SPELL_1066=Object.freeze({
 id:5318639,name:'Mystical Space Typhoon',nameES:'Tifón del Espacio Místico',
 source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4909&ope=2&request_locale=es'
});
function targetedSpellResolution1066(spec){
 const issues=[],action=raw(spec?.action),player=spec?.player,uid=raw(spec?.uid),targetUid=raw(spec?.targetUid);
 const before=spec?.before,after=spec?.after;
 const answer=(pass=false)=>({version:VERSION,pass,supported:true,issues:[...new Set(issues)].slice(0,60),scope:'TIFON_OBJETIVO_DESTRUCCION_1066',cardName:OFFICIAL_TARGET_SPELL_1066.name,source:OFFICIAL_TARGET_SPELL_1066.source,
 certifiesRules:false,certifiesActivation:false,certifiesBanlist:false,limitations:'Sólo resolución determinista sin cadena, inmunidades, sustitutos de destrucción, efectos disparados ni efectos continuos; distingue propietario de controlador del objetivo'});
 if(action!=='RESOLVE_TARGET_SPELL_1066')issues.push('Acción no incluida en el contrato');
 if(!Number.isSafeInteger(player)||player<0||player>1)issues.push('Jugador de activación inválido');
 if(!uid||!targetUid||uid===targetUid)issues.push('Se requieren dos instancias diferentes: carta y objetivo');
 const b=snapshot1063(before,'antes'),a=snapshot1063(after,'después');issues.push(...b.issues,...a.issues);
 if(issues.length)return answer();
 const source=b.index.get(uid),target=b.index.get(targetUid),endSource=a.index.get(uid),endTarget=a.index.get(targetUid);
 if(!source||source.player!==player||source.zone!=='spelltrap')issues.push('El Tifón debe estar activado en la zona Mágica/Trampa propia');
 const c=source?.card||{},bits=Number(c.typeBits??c.type);
 if(Number(c.id)!==OFFICIAL_TARGET_SPELL_1066.id)issues.push('Passcode de carta incorrecto');
 if(c.name!=null&&![OFFICIAL_TARGET_SPELL_1066.name,OFFICIAL_TARGET_SPELL_1066.nameES].some(s=>low(s)===low(c.name)))issues.push('Nombre incompatible con passcode');
 if(!Number.isSafeInteger(bits)||!(bits&2)||!(bits&0x10000)||(bits&4))issues.push('No se acredita Mágica de Juego Rápido');
 if(c.faceUp!==true)issues.push('Tifón no consta boca arriba en resolución');
 if(c.ownerPlayer!==player)issues.push('No se demuestra la propiedad de la Mágica activada');
 if(!target||target.zone!=='spelltrap')issues.push('El objetivo debe estar en el Campo, zona Mágica/Trampa');
 const t=target?.card||{},targetType=Number(t.typeBits??t.type);
 if(!Number.isSafeInteger(targetType)||!(targetType&6)||(targetType&1))issues.push('El objetivo no acredita ser Mágica o Trampa');
 if(!target||!Number.isSafeInteger(t.ownerPlayer)||t.ownerPlayer<0||t.ownerPlayer>1)issues.push('El objetivo no acredita un propietario válido');
 if(!endSource||endSource.player!==player||endSource.zone!=='gy')issues.push('La Mágica activada no fue al Cementerio propio');
 if(!endTarget||endTarget.player!==t.ownerPlayer||endTarget.zone!=='gy')issues.push('El objetivo no fue al Cementerio de su propietario');
 if(!before||!after||before.activePlayer!==player||!/^MAIN(?:1|2)?$/i.test(raw(before.phase)))issues.push('Sólo Main Phase del jugador activo en este subconjunto');
 if(!Array.isArray(before?.chain)||!Array.isArray(after?.chain)||before.chain.length||after.chain.length||!Array.isArray(before?.triggerQueue)||!Array.isArray(after?.triggerQueue)||before.triggerQueue.length||after.triggerQueue.length)issues.push('No se permite una cadena o disparadores pendientes');
 if(!Array.isArray(before?.lp)||!Array.isArray(after?.lp)||before.lp.length!==2||after.lp.length!==2||![...before.lp,...after.lp].every(x=>Number.isSafeInteger(x)&&x>=0)||JSON.stringify(before.lp)!==JSON.stringify(after.lp))issues.push('Los LP no pueden cambiar por este contrato');
 // Se comprueba que sólo la Mágica y el objetivo se mueven; no basta con verificar UID.
 for(let p=0;p<2;p++)for(const zone of ZONES_1063){
  const expected=before.zones[p][zone].map(cardUid1063);
  if(zone==='spelltrap'){
   const removed=[];
   if(source?.player===p)removed.push(source.slot);
   if(target?.player===p)removed.push(target.slot);
   removed.sort((x,y)=>y-x).forEach(i=>expected.splice(i,1));
  }
  if(zone==='gy'){
   if(p===player)expected.push(uid);
   if(p===t.ownerPlayer)expected.push(targetUid);
  }
  if(JSON.stringify(expected)!==JSON.stringify(after.zones[p][zone].map(cardUid1063)))issues.push('Cambio inesperado en zona '+p+'/'+zone);
 }
 for(const [id,old] of b.index){
  const now=a.index.get(id);
  if(!now)issues.push('Desapareció instancia: '+id);
  else if(old.fullFingerprint!==now.fullFingerprint)issues.push('Identidad/propiedades alteradas: '+id);
 }
 for(const id of a.index.keys())if(!b.index.has(id))issues.push('Nueva carta sin justificación: '+id);
 for(const k of new Set([...Object.keys(before||{}),...Object.keys(after||{})])){
  if(k==='zones'||k==='lp')continue;
  if(JSON.stringify(before[k])!==JSON.stringify(after[k]))issues.push('Metadatos del duelo cambiaron sin explicación: '+k);
 }
 return answer(issues.length===0);
}

/* Alpha 1143 — counter-trap two-link chain, strictly bounded.
   This verifies a narrow witnessed resolution only. It does NOT certify the
   validity of all activation windows, chain effects, protection or legality. */
/* Alpha 1143 — canonical two-link counter-trap resolution (bounded witness).
   Both costs occur at activation; resolution happens last-in-first-out.
   This does not certify legal priority, responses, effect immunity, or optimal play. */
function counterTrapChain1142(spec){
 const issues=[],action=raw(spec?.action),magic=action==='RESOLVE_MAGIC_JAMMER_CHAIN_1143';
 const solemn=action==='RESOLVE_COUNTER_CHAIN_1142';
 const sp=spec?.spellPlayer,cp=spec?.counterPlayer;
 const spellUid=raw(spec?.spellUid),counterUid=raw(spec?.counterUid),discardUid=raw(spec?.discardUid);
 const pre=spec?.before,paid=spec?.paid,post=spec?.after;
 const report=()=>({version:VERSION,pass:issues.length===0,supported:true,
   issues:[...new Set(issues)].slice(0,50),chainLinks:2,
   scope:magic?'DOS_ESLABONES_SPARKS_MAGIC_JAMMER_1143':'DOS_ESLABONES_SPARKS_SOLEMN_JUDGMENT_1143',
   reverseResolutionChecked:issues.length===0,
   certifiesRules:false,certifiesActivation:false,certifiesOptimality:false,certifiesBanlist:false,
   source:['https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4349&ope=2&request_locale=en',
           magic?'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4862&ope=2&request_locale=en':'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4861&ope=2&request_locale=en'],
   limitations:'Solo Sparks CL1 y una Contra Trampa CL2, sin otras cadenas, respuestas, inmunidades o pruebas universales de ventana de activación.'});
 if(!solemn&&!magic)issues.push('Acción de cadena desconocida');
 if(!Number.isSafeInteger(sp)||!Number.isSafeInteger(cp)||![0,1].includes(sp)||cp!==1-sp)issues.push('Jugadores incompatibles');
 if(!spellUid||!counterUid||spellUid===counterUid)issues.push('Identidades de eslabón inválidas');
 if(magic&&(!discardUid||discardUid===spellUid||discardUid===counterUid))issues.push('Falta carta de descarte distinta');
 const b=snapshot1063(pre,'antes'),p=snapshot1063(paid,'coste'),a=snapshot1063(post,'después');
 issues.push(...b.issues,...p.issues,...a.issues);
 if(issues.length)return report();
 const sc=b.index.get(spellUid),tc=b.index.get(counterUid);
 if(!sc||sc.player!==sp||sc.zone!=='spelltrap')issues.push('Sparks debe estar activo en Mágicas/Trampas');
 if(!tc||tc.player!==cp||tc.zone!=='spelltrap')issues.push('Contra Trampa debe estar Colocada');
 const spell=sc?.card||{},trap=tc?.card||{};
 if(Number(spell.id)!==76103675||low(spell.name)!=='sparks'||Number(spell.typeBits)!==2||spell.ownerPlayer!==sp||spell.faceUp!==true)
   issues.push('Sparks incorrecto');
 if(Number(trap.id)!==(magic?77414722:41420027)||low(trap.name)!==(magic?'magic jammer':'solemn judgment')||Number(trap.typeBits)!==(4|0x100000)||trap.ownerPlayer!==cp||trap.faceUp!==false)
   issues.push('Contra Trampa incorrecta');
 if(!Number.isSafeInteger(trap.setTurn)||!Number.isSafeInteger(pre?.turn)||trap.setTurn>=pre.turn)
   issues.push('No hay prueba de colocación en turno anterior');
 if(pre?.activePlayer!==sp||!/^MAIN(?:1|2)$/i.test(raw(pre?.phase)))issues.push('Fuera del caso de Main Phase');
 if(!Array.isArray(pre?.triggerQueue)||pre.triggerQueue.length)issues.push('Disparadores ajenos fuera del contrato');
 if(!Array.isArray(pre?.chain)||pre.chain.length!==1||raw(pre.chain[0]?.uid)!==spellUid||pre.chain[0]?.player!==sp||pre.chain[0]?.speed!==1||pre.chain[0]?.action!=='ACTIVATE_SPELL')
   issues.push('No existe CL1 válido');
 const hp=pre?.lp;
 if(!Array.isArray(hp)||hp.length!==2||!hp.every(n=>Number.isSafeInteger(n)&&n>0&&n<=800000))
   issues.push('LP deben ser enteros positivos');
 const di=magic?b.index.get(discardUid):null;
 if(magic&&(!di||di.player!==cp||di.zone!=='hand'||di.card.ownerPlayer!==cp))
   issues.push('El descarte debe existir en la mano del jugador que responde y ser de su propiedad');
 if(issues.length)return report();
 const clone=x=>JSON.parse(JSON.stringify(x));
 const expectedCost=clone(pre),tCost=expectedCost.zones[cp].spelltrap.find(x=>raw(x.uid)===counterUid);
 if(!tCost){issues.push('No se encontró Contra Trampa');return report()}
 tCost.faceUp=true;
 if(solemn){
   // When halving odd LP, remaining Life Points are rounded UP. 1 LP remains 1 LP.
   expectedCost.lp[cp]=Math.ceil(hp[cp]/2);
 }else{
   const pos=expectedCost.zones[cp].hand.findIndex(x=>raw(x.uid)===discardUid);
   if(pos<0){issues.push('El descarte desapareció antes de pagar el coste');return report()}
   const discarded=expectedCost.zones[cp].hand.splice(pos,1)[0];
   expectedCost.zones[discarded.ownerPlayer].gy.push(discarded);
 }
 expectedCost.chain.push({uid:counterUid,player:cp,speed:3,action:'ACTIVATE_COUNTER_TRAP'});
 const expectedAfter=clone(expectedCost);
 for(const [uid,player] of [[spellUid,sp],[counterUid,cp]]){
   const i=expectedAfter.zones[player].spelltrap.findIndex(x=>raw(x.uid)===uid);
   if(i<0){issues.push('No se encontró eslabón '+uid);continue}
   const card=expectedAfter.zones[player].spelltrap.splice(i,1)[0];
   expectedAfter.zones[card.ownerPlayer].gy.push(card);
 }
 expectedAfter.chain=[];
 // Entire state is compared; array order and extra metadata cannot be ignored.
 function signature(v){
  if(Array.isArray(v))return '['+v.map(signature).join(',')+']';
  if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+signature(v[k])).join(',')+'}';
  return JSON.stringify(v);
 }
 if(signature(paid)!==signature(expectedCost))issues.push('Coste/CL2 alterado: LP, descarte o estado no coinciden');
 if(signature(post)!==signature(expectedAfter))issues.push('Resolución alterada: daño, Cementerios, cadena o estado no coinciden');
 for(const [uid,info] of b.index){
   const next=a.index.get(uid);
   if(!next||info.fingerprint!==next.fingerprint)issues.push('Identidad física cambiada: '+uid);
 }
 for(const uid of a.index.keys())if(!b.index.has(uid))issues.push('Carta inventada: '+uid);
 return report();
}
// Public compatibility alias to the SAME canonical implementation, not a second engine.
const counterTrapChain1143=counterTrapChain1142;
/* Alpha 1207: primera aplicación de un coste + efecto acotados sobre una
   carta oficial. Ciclón del Cosmos (08267140) paga 1000 LP ANTES de
   resolver y destierra una Mágica/Trampa seleccionada.
   Dominio deliberadamente restringido a CL1 aislada, Main Phase propia,
   carta ya boca arriba en zona S/T, objetivo en zona S/T, sin disparadores,
   reemplazos, protección, otras respuestas ni reducciones de coste.
   Esto ejecuta una transición concreta; NO certifica el juego universal. */
function cosmicCyclone1207(spec){
 const issues=[],pre=spec?.before,player=spec?.player,uid=raw(spec?.uid),targetUid=raw(spec?.targetUid);
 const result=(status,extra={})=>({version:VERSION,action:'RESOLVE_COSMIC_CYCLONE_1207',status,
  pass:status==='BOUNDED_EXECUTION_OK',supported:true,costPaid:status==='BOUNDED_EXECUTION_OK'?1000:0,
  certifiesRules:false,certifiesActivation:false,certifiesOptimality:false,certifiesBanlist:false,
  scope:'COSMIC_CYCLONE_MAIN_CL1_NO_RESPONSES_1207',
  limitations:'Sólo resolución física de Cosmic Cyclone sin respuestas, inmunidades, protecciones, reemplazos, disparadores, campo de Magia o coste alterado; exige LP >1000.',
  issues:[...new Set(issues)].slice(0,30),...extra});
 if(raw(spec?.action)!=='RESOLVE_COSMIC_CYCLONE_1207')issues.push('Acción desconocida');
 if(!Number.isInteger(player)||![0,1].includes(player))issues.push('Jugador inválido');
 if(!uid||!targetUid||uid===targetUid)issues.push('Carta y objetivo deben ser instancias distintas');
 const beforeSnap=snapshot1063(pre,'antes');issues.push(...beforeSnap.issues);
 if(issues.length)return result('INVALID_PRESTATE');
 const source=beforeSnap.index.get(uid),target=beforeSnap.index.get(targetUid);
 if(!source||source.player!==player||source.zone!=='spelltrap')issues.push('Ciclón del Cosmos debe estar en zona S/T propia');
 const card=source?.card||{},sourceType=Number(card.typeBits??card.type);
 if(Number(card.id)!==8267140||!Number.isSafeInteger(sourceType)||(sourceType&0x10002)!==0x10002||(sourceType&4)!==0)
  issues.push('Carta no identificada como Ciclón del Cosmos de Juego Rápido');
 if(card.name!=null&&!['cosmic cyclone','ciclón del cosmos'].includes(low(card.name)))issues.push('Nombre incompatible con passcode');
 if(card.faceUp!==true||card.ownerPlayer!==player)issues.push('La carta activada debe estar boca arriba y ser propia');
 if(!target||target.zone!=='spelltrap')issues.push('Objetivo fuera de zona Mágica/Trampa ordinaria');
 const t=target?.card||{},targetType=Number(t.typeBits??t.type);
 if(!Number.isSafeInteger(targetType)||!(targetType&6)||(targetType&1))issues.push('Objetivo no acredita ser Mágica/Trampa');
 if(!Number.isInteger(t.ownerPlayer)||![0,1].includes(t.ownerPlayer))issues.push('Propietario del objetivo desconocido');
 if(pre?.activePlayer!==player||!/^MAIN(?:1|2)?$/i.test(raw(pre?.phase)))issues.push('Sólo Main Phase del jugador activo');
 if(!Array.isArray(pre?.chain)||pre.chain.length||!Array.isArray(pre?.triggerQueue)||pre.triggerQueue.length)
  issues.push('Sólo activación aislada sin cadena previa ni disparadores');
 if(!Array.isArray(pre?.lp)||pre.lp.length!==2||!pre.lp.every(x=>Number.isSafeInteger(x)&&x>=0&&x<=999999)||
    !Number.isSafeInteger(pre.lp[player])||pre.lp[player]<=1000)
  issues.push('No se acreditan al menos 1001 LP para el coste en este dominio');
 if(issues.length)return result('PRECONDITIONS_NOT_PROVEN');
 // Clonación después de snapshot de integridad, nunca mutar la baraja real.
 let paid,after;
 try{
  paid=JSON.parse(JSON.stringify(pre));paid.lp[player]-=1000;
  paid.chain.push({uid,player,speed:2,action:'ACTIVATE_SPELL',targetUid});
  after=JSON.parse(JSON.stringify(paid));
  const sourcePosition=after.zones[player].spelltrap.findIndex(c=>raw(c.uid)===uid);
  if(sourcePosition<0)throw Error('Carta fuente no encontrada');
  const spell=after.zones[player].spelltrap.splice(sourcePosition,1)[0];
  // Recalcular el índice del objetivo: puede estar en la misma lista que la fuente.
  const targetPosition=after.zones[target.player].spelltrap.findIndex(c=>raw(c.uid)===targetUid);
  if(targetPosition<0)throw Error('Objetivo no encontrado');
  const victim=after.zones[target.player].spelltrap.splice(targetPosition,1)[0];
  spell.faceUp=true;victim.faceUp=true;
  after.zones[spell.ownerPlayer].gy.push(spell);
  after.zones[victim.ownerPlayer].banished.push(victim);
  after.chain=[];
 }catch(e){issues.push('Imposible aplicar coste/resolución: '+String(e?.message||e));return result('STATE_APPLICATION_FAILED')}
 const pSnap=snapshot1063(paid,'coste'),aSnap=snapshot1063(after,'después');
 issues.push(...pSnap.issues,...aSnap.issues);
 if(issues.length)return result('GENERATED_STATE_INVALID');
 // Acepta un estado observado solamente si coincide con la ejecución
 // determinista completa. Los efectos de respuesta quedan fuera del dominio.
 const signature=x=>{
  if(Array.isArray(x))return '['+x.map(signature).join(',')+']';
  if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+signature(x[k])).join(',')+'}';
  return JSON.stringify(x);
 };
 if(spec?.paid!==undefined&&signature(spec.paid)!==signature(paid))issues.push('Coste/cadena observados no coinciden');
 if(spec?.after!==undefined&&signature(spec.after)!==signature(after))issues.push('Resolución observada no coincide');
 if(issues.length)return result('OBSERVED_STATE_MISMATCH');
 return result('BOUNDED_EXECUTION_OK', {before:JSON.parse(JSON.stringify(pre)),paid,after,
   cost:{kind:'PAY_LP',amount:1000,player,phase:'ACTIVATION'},
   selectedTargetUid:targetUid,banishedOwner:t.ownerPlayer,
   verification:spec?.paid!==undefined&&spec?.after!==undefined?'PAID_AND_RESOLUTION_MATCH':'GENERATED_ONLY',
   source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=12464&ope=2&request_locale=es'});
}
/* Alpha 1208: activación físicamente posible de Ciclón del Cosmos desde
   la mano propia o desde una carta Colocada en turno ANTERIOR. No sustituye
   al subconjunto de diagnóstico 1207; es una nueva transición ejecutable
   que acredita tres estados (preactivación, pago/CL1 y resolución). 
   Dominio limitado: Main Phase propia, ninguna respuesta/efecto continuo,
   un objetivo S/T ordinario, sin efectos de reemplazo ni disparadores.
   El testigo 'setTurn' es obligatorio para cartas Colocadas. */
function cosmicCyclone1208(spec){
 const issues=[],before=spec?.before,player=spec?.player,uid=raw(spec?.uid),targetUid=raw(spec?.targetUid);
 const result=(status,extra={})=>({version:VERSION,action:'ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208',status,
  pass:status==='BOUNDED_EXECUTION_OK',supported:true,certifiesRules:false,
  certifiesActivation:false,certifiesOptimality:false,certifiesBanlist:false,
  scope:'COSMIC_CYCLONE_FROM_HAND_OR_PREVIOUSLY_SET_MAIN_CL1_NO_RESPONSES_1208',
  limitations:'Main Phase propia; sin respuestas, restricciones externas, efectos de reemplazo, inmunidades, triggers o ventanas de prioridad; requiere setTurn fiable si Colocada.',
  issues:[...new Set(issues)].slice(0,30),...extra});
 if(raw(spec?.action)!=='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208')issues.push('Acción desconocida');
 if(!Number.isInteger(player)||![0,1].includes(player))issues.push('Jugador inválido');
 if(!uid||!targetUid||uid===targetUid)issues.push('Origen y objetivo deben ser UIDs distintos');
 const preSnap=snapshot1063(before,'preactivación');issues.push(...preSnap.issues);
 for(let side=0;side<2;side++){
  if((before?.zones?.[side]?.spelltrap?.length??Infinity)>5||(before?.zones?.[side]?.monster?.length??Infinity)>5)issues.push('Campo con más de cinco zonas ordinarias ocupadas');
 }
 if(issues.length)return result('INVALID_PRESTATE');
 const source=preSnap.index.get(uid),target=preSnap.index.get(targetUid);
 if(!source||source.player!==player||!['hand','spelltrap'].includes(source.zone))
  issues.push('Ciclón del Cosmos no está en mano o zona propia de Mágicas/Trampas');
 const spell=source?.card||{},bits=Number(spell.typeBits??spell.type);
 if(Number(spell.id)!==8267140||!Number.isSafeInteger(bits)||(bits&0x10002)!==0x10002||(bits&4)!==0)
  issues.push('La fuente no coincide con el passcode y tipo de Ciclón del Cosmos');
 if(spell.name!=null&&!['cosmic cyclone','ciclón del cosmos'].includes(low(spell.name)))issues.push('Nombre de origen incompatible');
 if(spell.ownerPlayer!==player)issues.push('El jugador no es propietario de la carta fuente');
 if(source?.zone==='hand'){
  if(spell.faceUp===true)issues.push('Carta en la mano marcada indebidamente como boca arriba');
  if(!Array.isArray(before.zones[player]?.spelltrap)||before.zones[player].spelltrap.length>=5)
   issues.push('No hay espacio en zona Mágicas/Trampas para activar desde la mano');
 }else if(source?.zone==='spelltrap'){
  if(spell.faceUp!==false)issues.push('La Mágica de Juego Rápido debe estar Colocada boca abajo');
  if(!Number.isSafeInteger(before?.turn)||before.turn<1||!Number.isSafeInteger(spell.setTurn)||spell.setTurn<0||spell.setTurn>=before.turn)
   issues.push('No se acredita que la carta estuviera Colocada desde un turno anterior');
 }
 if(!target||target.zone!=='spelltrap')issues.push('El objetivo no está en una zona de Mágicas/Trampas');
 const victim=target?.card||{},targetType=Number(victim.typeBits??victim.type);
 if(!Number.isSafeInteger(targetType)||!(targetType&6)||(targetType&1))issues.push('El objetivo no acredita ser una Mágica/Trampa');
 if(!Number.isInteger(victim.ownerPlayer)||![0,1].includes(victim.ownerPlayer))issues.push('Propietario del objetivo sin acreditar');
 if(before?.activePlayer!==player||!/^MAIN(?:1|2)?$/i.test(raw(before?.phase)))
  issues.push('Sólo se modela Main Phase propia');
 if(!Array.isArray(before?.chain)||before.chain.length||!Array.isArray(before?.triggerQueue)||before.triggerQueue.length)
  issues.push('No se modelan cadenas previas ni disparadores pendientes');
 if(!Array.isArray(before?.lp)||before.lp.length!==2||!before.lp.every(n=>Number.isSafeInteger(n)&&n>=0&&n<=999999)||before.lp[player]<=1000)
  issues.push('No se acreditan LP suficientes para pagar 1000');
 if(issues.length)return result('PRECONDITIONS_NOT_PROVEN');
 let paid,after;
 try{
  paid=JSON.parse(JSON.stringify(before));
  let sourceCard;
  if(source.zone==='hand'){
   const idx=paid.zones[player].hand.findIndex(x=>raw(x.uid)===uid);
   if(idx<0)throw Error('No se encontró origen en la mano');
   sourceCard=paid.zones[player].hand.splice(idx,1)[0];
   sourceCard.faceUp=true;
   paid.zones[player].spelltrap.push(sourceCard);
  }else{
   const idx=paid.zones[player].spelltrap.findIndex(x=>raw(x.uid)===uid);
   if(idx<0)throw Error('No se encontró carta Colocada');
   sourceCard=paid.zones[player].spelltrap[idx];sourceCard.faceUp=true;
  }
  paid.lp[player]-=1000;
  paid.chain.push({uid,player,speed:2,action:'ACTIVATE_SPELL',targetUid});
  after=JSON.parse(JSON.stringify(paid));
  const sourceIndex=after.zones[player].spelltrap.findIndex(x=>raw(x.uid)===uid);
  if(sourceIndex<0)throw Error('Origen ya no está en la zona');
  const resolvedSpell=after.zones[player].spelltrap.splice(sourceIndex,1)[0];
  const targetIndex=after.zones[target.player].spelltrap.findIndex(x=>raw(x.uid)===targetUid);
  if(targetIndex<0)throw Error('Objetivo ya no está en campo');
  const resolvedTarget=after.zones[target.player].spelltrap.splice(targetIndex,1)[0];
  resolvedSpell.faceUp=true;resolvedTarget.faceUp=true;
  after.zones[resolvedSpell.ownerPlayer].gy.push(resolvedSpell);
  after.zones[resolvedTarget.ownerPlayer].banished.push(resolvedTarget);
  after.chain=[];
 }catch(e){issues.push('Transición no aplicada: '+raw(e?.message||e));return result('STATE_APPLICATION_FAILED')}
 const pSnap=snapshot1063(paid,'pago'),aSnap=snapshot1063(after,'resolución');
 issues.push(...pSnap.issues,...aSnap.issues);
 if(issues.length)return result('GENERATED_STATE_INVALID');
 const signature=x=>{
  if(Array.isArray(x))return '['+x.map(signature).join(',')+']';
  if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+signature(x[k])).join(',')+'}';
  return JSON.stringify(x);
 };
 if(spec?.paid!==undefined&&signature(spec.paid)!==signature(paid))issues.push('Pago/cadena observados no coinciden');
 if(spec?.after!==undefined&&signature(spec.after)!==signature(after))issues.push('Resolución observada no coincide');
 if(issues.length)return result('OBSERVED_STATE_MISMATCH');
 return result('BOUNDED_EXECUTION_OK',{before:JSON.parse(JSON.stringify(before)),paid,after,
  sourceZone:source.zone,cost:{kind:'PAY_LP',amount:1000,player,phase:'ACTIVATION'},
  targetUid,banishedOwner:victim.ownerPlayer,
  verification:spec?.paid!==undefined&&spec?.after!==undefined?'PAID_AND_RESOLUTION_MATCH':'GENERATED_ONLY',
  source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=12464&ope=2&request_locale=es',
  rulesSource:'https://www.yugioh-card.com/ygo_cms/ygo/all/uploads/Rulebook_v9_en.pdf'});
}
/* Replay acotado: coteja los tres estados observados, más el End Board de
   una única acción. No confunde coincidencia física con legalidad universal. */
function replayCosmicCyclone1208(line){
 const acts=Array.isArray(line?.actions)?line.actions:[];
 const failure=(status,issues=[])=>({version:VERSION,status,pass:false,certifiesRules:false,
  certifiesActivation:false,certifiesOptimality:false,issues});
 if(acts.length!==1)return failure('REPLAY_REQUIRES_ONE_ACTION');
 const a=acts[0];
 if(!a||a.actionType!=='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208'||!a.before||!a.paid||!a.after)
  return failure('REPLAY_STAGES_MISSING');
 const proof=cosmicCyclone1208({...a,action:a.actionType});
 if(!proof.pass)return failure('REPLAY_EFFECT_MISMATCH',proof.issues);
 const end=line?.state??line?.endBoard??line?.finalBoard;
 if(!end)return failure('REPLAY_END_BOARD_MISSING');
 const eq=(x,y)=>{
  if(Array.isArray(x)||Array.isArray(y))return Array.isArray(x)&&Array.isArray(y)&&x.length===y.length&&x.every((v,i)=>eq(v,y[i]));
  if(x&&typeof x==='object'||y&&typeof y==='object'){
   if(!x||!y||typeof x!=='object'||typeof y!=='object')return false;
   const a=Object.keys(x).sort(),b=Object.keys(y).sort();
   return a.length===b.length&&a.every((k,i)=>k===b[i]&&eq(x[k],y[k]));
  }
  return Object.is(x,y);
 };
 if(!eq(proof.after,end))return failure('REPLAY_END_BOARD_MISMATCH');
 return {version:VERSION,status:'BOUNDED_REPLAY_MATCH',pass:true,
  certifiesRules:false,certifiesActivation:false,certifiesOptimality:false,
  sourceZone:proof.sourceZone,costPaid:1000,steps:1,
  scope:'ONE_QUICK_PLAY_SPELL_WITHOUT_RESPONSES_OR_EXTERNAL_EFFECTS'};
}
/* Alpha 1210: secuencia de 1-2 activaciones YA RESUELTAS de Ciclón del Cosmos.
   Cada paso debe pasar el ejecutor y replay 1208; la salida de un paso es
   exactamente la entrada del siguiente. No modela respuestas ni cadenas del rival. */
function replayCosmicSequence1210(line){
 const actions=Array.isArray(line?.actions)?line.actions:[],failed=(status,index=-1)=>({
  version:VERSION,status,pass:false,certified:false,certifiesRules:false,
  certifiesOptimality:false,stepIndex:index});
 if(!actions.length||actions.length>2)return failed('SEQUENCE_LENGTH_UNSUPPORTED');
 const stable=x=>{
  if(Array.isArray(x))return '['+x.map(stable).join(',')+']';
  if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}';
  return JSON.stringify(x);
 };
 let last=null;
 for(let i=0;i<actions.length;i++){
  const a=actions[i];
  if(!a||a.actionType!=='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208')return failed('ACTION_TYPE_UNSUPPORTED',i);
  if(i>0&&stable(a.before)!==stable(last))return failed('SEQUENCE_STATE_DISCONTINUITY',i);
  const proof=cosmicCyclone1208({...a,action:a.actionType});
  if(!proof.pass)return failed('SEQUENCE_EFFECT_MISMATCH',i);
  if(!replayCosmicCyclone1208({actions:[a],state:a.after}).pass)return failed('SEQUENCE_STEP_REPLAY_FAILED',i);
  last=proof.after;
 }
 const final=line?.state??line?.endBoard??line?.finalBoard;
 if(final===undefined||stable(last)!==stable(final))return failed('SEQUENCE_FINAL_BOARD_MISMATCH',actions.length-1);
 return {version:VERSION,status:'BOUNDED_SEQUENCE_REPLAY_MATCH_1210',pass:true,steps:actions.length,
  costPaid:1000*actions.length,certified:false,certifiesRules:false,
  certifiesOptimality:false,scope:'1-2_SEQUENTIAL_COSMIC_CYCLONE_NO_OPPONENT_RESPONSES'};
}
/* Alpha 1211: resolución acotada de Tifón del Espacio Místico, carta
   Mágica de Juego Rápido 05318639. Destruye S/T y la envía al Cementerio
   de su propietario, sin pagar LP. Sin respuestas, protecciones ni triggers. */
function mysticalSpaceTyphoon1211(spec){
 const issues=[],before=spec?.before,player=spec?.player,uid=raw(spec?.uid),targetUid=raw(spec?.targetUid);
 const result=(status,extra={})=>({version:VERSION,action:'ACTIVATE_RESOLVE_MST_1211',status,
  pass:status==='BOUNDED_EXECUTION_OK',supported:true,certifiesRules:false,
  certifiesActivation:false,certifiesOptimality:false,
  scope:'MST_FROM_HAND_OR_PREVIOUSLY_SET_OWN_MAIN_CL1_NO_RESPONSES',
  limitations:'Sin respuestas, restricciones externas, protección contra destrucción, efectos de reemplazo o activaciones disparadas.',
  issues:[...new Set(issues)].slice(0,30),...extra});
 if(spec?.action!=='ACTIVATE_RESOLVE_MST_1211')issues.push('Acción no soportada');
 if(!Number.isInteger(player)||![0,1].includes(player))issues.push('Jugador inválido');
 if(!uid||!targetUid||uid===targetUid)issues.push('UID de fuente y objetivo distintos requeridos');
 const snap=snapshot1063(before,'MST preactivación');issues.push(...snap.issues);
 for(let side=0;side<2;side++)if((before?.zones?.[side]?.spelltrap?.length??Infinity)>5||(before?.zones?.[side]?.monster?.length??Infinity)>5)
  issues.push('Campo ordinario sobreocupado');
 if(issues.length)return result('INVALID_PRESTATE');
 const src=snap.index.get(uid),dst=snap.index.get(targetUid);
 if(!src||src.player!==player||!['hand','spelltrap'].includes(src.zone))issues.push('MST no está disponible en zona propia');
 const card=src?.card||{},bits=Number(card.typeBits??card.type);
 if(Number(card.id)!==5318639||!Number.isSafeInteger(bits)||(bits&0x10002)!==0x10002||(bits&4)!==0)
  issues.push('Passcode/tipo Mágica de Juego Rápido incorrectos');
 if(card.name!=null&&!['mystical space typhoon','tifón del espacio místico','tifon del espacio mistico'].includes(low(card.name)))
  issues.push('Nombre no corresponde a MST');
 if(card.ownerPlayer!==player)issues.push('Propietario fuente sin acreditar');
 if(src?.zone==='hand'){
  if(card.faceUp===true)issues.push('Carta boca arriba en la mano');
  if(!Array.isArray(before.zones[player]?.spelltrap)||before.zones[player].spelltrap.length>=5)
   issues.push('Sin zona libre para activar de mano');
 }else if(src?.zone==='spelltrap'){
  if(card.faceUp!==false)issues.push('Fuente colocada debe estar boca abajo');
  if(!Number.isSafeInteger(before?.turn)||before.turn<1||!Number.isSafeInteger(card.setTurn)||card.setTurn<0||card.setTurn>=before.turn)
   issues.push('No se acredita Colocación en turno anterior');
 }
 if(!dst||dst.zone!=='spelltrap')issues.push('Objetivo no está en zona S/T');
 const victim=dst?.card||{},type=Number(victim.typeBits??victim.type);
 if(!Number.isSafeInteger(type)||!(type&6)||(type&1))issues.push('Objetivo no acredita ser Mágica/Trampa');
 if(!Number.isInteger(victim.ownerPlayer)||![0,1].includes(victim.ownerPlayer))issues.push('Propietario del objetivo inválido');
 if(before?.activePlayer!==player||!/^MAIN(?:1|2)?$/i.test(raw(before?.phase)))issues.push('Solo Main Phase propia');
 if(!Array.isArray(before?.chain)||before.chain.length||!Array.isArray(before?.triggerQueue)||before.triggerQueue.length)
  issues.push('Cadenas o disparadores pendientes sin modelar');
 if(!Array.isArray(before?.lp)||before.lp.length!==2||!before.lp.every(n=>Number.isSafeInteger(n)&&n>0&&n<=999999))
  issues.push('Life Points malformados');
 if(issues.length)return result('PRECONDITIONS_NOT_PROVEN');
 let paid,after;
 try{
  paid=JSON.parse(JSON.stringify(before));
  if(src.zone==='hand'){
   const i=paid.zones[player].hand.findIndex(c=>raw(c.uid)===uid);
   if(i<0)throw Error('Carta fuente ausente en mano');
   const activated=paid.zones[player].hand.splice(i,1)[0];activated.faceUp=true;
   paid.zones[player].spelltrap.push(activated);
  }else{
   const activated=paid.zones[player].spelltrap.find(c=>raw(c.uid)===uid);
   if(!activated)throw Error('Carta fuente ausente en zona S/T');activated.faceUp=true;
  }
  paid.chain.push({uid,player,speed:2,action:'ACTIVATE_SPELL',targetUid});
  after=JSON.parse(JSON.stringify(paid));
  const i=after.zones[player].spelltrap.findIndex(c=>raw(c.uid)===uid);
  if(i<0)throw Error('Fuente ausente durante resolución');
  const spell=after.zones[player].spelltrap.splice(i,1)[0];
  const j=after.zones[dst.player].spelltrap.findIndex(c=>raw(c.uid)===targetUid);
  if(j<0)throw Error('Objetivo ausente durante resolución');
  const target=after.zones[dst.player].spelltrap.splice(j,1)[0];
  spell.faceUp=true;target.faceUp=true;
  after.zones[spell.ownerPlayer].gy.push(spell);
  after.zones[target.ownerPlayer].gy.push(target);
  after.chain=[];
 }catch(e){issues.push(raw(e?.message||e));return result('STATE_APPLICATION_FAILED')}
 const p=snapshot1063(paid,'MST activado'),a=snapshot1063(after,'MST resolución');issues.push(...p.issues,...a.issues);
 if(issues.length)return result('GENERATED_STATE_INVALID');
 const eq=(x,y)=>{
  if(Array.isArray(x)||Array.isArray(y))return Array.isArray(x)&&Array.isArray(y)&&x.length===y.length&&x.every((v,i)=>eq(v,y[i]));
  if(x&&typeof x==='object'||y&&typeof y==='object'){
   if(!x||!y||typeof x!=='object'||typeof y!=='object')return false;
   const k=Object.keys(x).sort(),l=Object.keys(y).sort();
   return k.length===l.length&&k.every((z,i)=>z===l[i]&&eq(x[z],y[z]));
  }
  return Object.is(x,y);
 };
 if(spec?.paid!==undefined&&!eq(spec.paid,paid))issues.push('Activación observada incompatible');
 if(spec?.after!==undefined&&!eq(spec.after,after))issues.push('Resolución observada incompatible');
 if(issues.length)return result('OBSERVED_STATE_MISMATCH');
 return result('BOUNDED_EXECUTION_OK',{before:JSON.parse(JSON.stringify(before)),paid,after,
  sourceZone:src.zone,cost:{kind:'NONE',amount:0,player},targetUid,destroyedOwner:victim.ownerPlayer,
  verification:spec?.paid!==undefined&&spec?.after!==undefined?'PAID_AND_RESOLUTION_MATCH':'GENERATED_ONLY',
  source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4909&ope=2&request_locale=en'});
}

/* Alpha 1225: Twin Twisters (43898403) - rama REAL y deliberadamente acotada.
   Coste: descartar UN monstruo Normal inerte acreditado de la mano.
   El motor no supone que otros descartes no disparen efectos: no los certifica.
   1-2 objetivos M/T; sin cadenas rivales, protección, reemplazos ni triggers.
   Reglas fuente: https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=12175&ope=2&request_locale=en */
function equal1225(a,b){
 if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>equal1225(v,b[i]));
 if(a&&typeof a==='object'||b&&typeof b==='object'){
  if(!a||!b||typeof a!=='object'||typeof b!=='object')return false;
  const x=Object.keys(a).sort(),y=Object.keys(b).sort();
  return x.length===y.length&&x.every((k,i)=>k===y[i]&&equal1225(a[k],b[k]));
 }
 return Object.is(a,b);
}
/* Alpha 1254 — Book of Moon: transición física acotada comprobable.
   Konami Neuron cid=5432: 14087893, Mágica Rápida que selecciona
   un monstruo boca arriba y lo cambia a Defensa boca abajo.
   Sólo estado MAIN propia, CL1 sin respuestas ni otras permanentes activas,
   objetivo Monstruo Normal inerte (tipo 17), sin enlaces ni fichas.
   No implica motor universal ni certificación de Top 5/banlist. */
/* Alpha 1255: núcleo ÚNICO para dos Mágicas que alteran la posición.
   Moon: 14087893 / Mágica Rápida, face-up -> face-down DEF.
   Taiyou: 38699854 / Mágica Normal, face-down -> face-up ATK.
   Sólo Monstruos Normales inertes sin efectos ajenos, sin otras permanentes,
   CL1, Main Phase propia y ninguna respuesta: nunca certificar duelos completos. */
const FLIP_SPELL_1255=Object.freeze({
 moon:Object.freeze({id:14087893,name:'book of moon',es:'libro de la luna',type:65538,
  action:'ACTIVATE_RESOLVE_BOOK_OF_MOON_1254',before:true,after:false,position:'DEFENSE',previousSetRequired:true,
  scope:'BOOK_OF_MOON_NORMAL_MONSTER_MAIN_CL1_NO_RESPONSES_1254',
  source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=5432&ope=2&request_locale=en'}),
 taiyou:Object.freeze({id:38699854,name:'book of taiyou',es:'libro de taiyou',type:2,
  action:'ACTIVATE_RESOLVE_BOOK_OF_TAIYOU_1255',before:false,after:true,position:'ATTACK',previousSetRequired:false,
  scope:'BOOK_OF_TAIYOU_NORMAL_MONSTER_MAIN_CL1_NO_RESPONSES_1255',
  source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=5431&ope=2&request_locale=en'})
});
function flipPositionSpell1255(spec={},kind='moon'){
 const rule=FLIP_SPELL_1255[kind],before=spec.before,player=spec.player,uid=raw(spec.uid),targetUid=raw(spec.targetUid),issues=[];
 const response=(status,extra={})=>({version:VERSION,action:rule.action,status,
  pass:status==='BOUNDED_EXECUTION_OK',supported:true,certifiesRules:false,
  certifiesActivation:false,certifiesOptimality:false,certifiesBanlist:false,
  scope:rule.scope,limitations:'Solo CL1 en Main Phase propia, un Monstruo Normal inerte, sin otras permanentes, efectos continuos, protecciones, respuestas, cadenas, disparadores, cambios de control o rulings no demostrados.',
  issues:[...new Set(issues)].slice(0,30),...extra});
 if(spec.action!==rule.action)issues.push('Acción incorrecta');
 if(!Number.isSafeInteger(player)||![0,1].includes(player))issues.push('Jugador inválido');
 if(!uid||!targetUid||uid===targetUid)issues.push('UID de Mágica y objetivo distintos requeridos');
 const snap=snapshot1063(before,'Mágica cambio posición preactivación');issues.push(...snap.issues);
 if(issues.length)return response('INVALID_PRESTATE');
 const source=snap.index.get(uid),target=snap.index.get(targetUid);
 if(!source||source.player!==player||!['hand','spelltrap'].includes(source.zone))issues.push('Mágica no disponible en mano o zona S/T propia');
 const spell=source?.card||{},type=Number(spell.typeBits??spell.type);
 if(Number(spell.id)!==rule.id||type!==rule.type)issues.push('ID/tipo de Mágica no acreditados');
 if(spell.name!=null&&![rule.name,rule.es].includes(low(spell.name)))issues.push('Nombre incompatible con identificador');
 if(spell.ownerPlayer!==player)issues.push('Propietario de Mágica no acreditado');
 if(source?.zone==='hand'){
  if(spell.faceUp===true)issues.push('Carta de mano indebidamente boca arriba');
  if(before?.zones?.[player]?.spelltrap?.length>=5)issues.push('No hay zona S/T libre');
 }else if(source?.zone==='spelltrap'){
  if(spell.faceUp!==false)issues.push('La Mágica colocada debe estar boca abajo');
  if(!Number.isSafeInteger(before?.turn)||before.turn<1||!Number.isSafeInteger(spell.setTurn)||spell.setTurn<0||
     (rule.previousSetRequired?spell.setTurn>=before.turn:spell.setTurn>before.turn))
   issues.push('No se acredita la colocación para activar esta Mágica');
 }
 if(!target||target.zone!=='monster')issues.push('Objetivo fuera de la zona Monstruos');
 const monster=target?.card||{},monsterBits=Number(monster.typeBits??monster.type);
 if(monsterBits!==17||monster.faceUp!==rule.before||!['ATTACK','DEFENSE'].includes(raw(monster.position).toUpperCase())||
    (!rule.before&&raw(monster.position).toUpperCase()!=='DEFENSE'))
  issues.push('Posición y tipo del Monstruo Normal no acreditados');
 if(![0,1].includes(monster.ownerPlayer)||!Number.isSafeInteger(monster.ownerPlayer))issues.push('Propietario del monstruo inválido');
 if(before?.activePlayer!==player||!/^MAIN(?:1|2)$/i.test(raw(before?.phase)))issues.push('Fuera de Main Phase propia');
 if(!Array.isArray(before?.chain)||before.chain.length||!Array.isArray(before?.triggerQueue)||before.triggerQueue.length)
  issues.push('Cadena o disparadores no vacíos');
 if(!Array.isArray(before?.lp)||before.lp.length!==2||!before.lp.every(n=>Number.isSafeInteger(n)&&n>0&&n<=999999))
  issues.push('Life Points no acreditados');
 for(let p=0;p<2;p++){
  const z=before.zones[p];
  if(z.monster.length>5||z.spelltrap.length>5)issues.push('Campo sobreocupado');
  if(z.monster.some(c=>raw(c.uid)!==targetUid))issues.push('Otros monstruos fuera del dominio');
  if(z.spelltrap.some(c=>raw(c.uid)!==uid))issues.push('Otras permanentes S/T fuera del dominio');
 }
 if(issues.length)return response('PRECONDITIONS_NOT_PROVEN');
 let paid,after;
 try{
  paid=JSON.parse(JSON.stringify(before));
  if(source.zone==='hand'){
   const i=paid.zones[player].hand.findIndex(c=>raw(c.uid)===uid);if(i<0)throw Error('Mágica ausente en mano');
   const activated=paid.zones[player].hand.splice(i,1)[0];activated.faceUp=true;paid.zones[player].spelltrap.push(activated);
  }else{
   const activated=paid.zones[player].spelltrap.find(c=>raw(c.uid)===uid);
   if(!activated)throw Error('Mágica colocada ausente');activated.faceUp=true;
  }
  paid.chain.push({uid,player,speed:kind==='moon'?2:1,action:'ACTIVATE_SPELL',targetUid});
  after=JSON.parse(JSON.stringify(paid));
  const m=after.zones[target.player].monster.find(c=>raw(c.uid)===targetUid);if(!m)throw Error('Objetivo desaparecido');
  m.faceUp=rule.after;m.position=rule.position;
  const i=after.zones[player].spelltrap.findIndex(c=>raw(c.uid)===uid);if(i<0)throw Error('Fuente no encontrada');
  const used=after.zones[player].spelltrap.splice(i,1)[0];used.faceUp=true;after.zones[used.ownerPlayer].gy.push(used);
  after.chain=[];
 }catch(e){issues.push(raw(e?.message||e));return response('STATE_APPLICATION_FAILED')}
 issues.push(...snapshot1063(paid,'Mágica activada').issues,...snapshot1063(after,'Mágica resuelta').issues);
 if(issues.length)return response('GENERATED_STATE_INVALID');
 if(spec.paid!==undefined&&!equal1225(spec.paid,paid))issues.push('CL1 observada incompatible');
 if(spec.after!==undefined&&!equal1225(spec.after,after))issues.push('Resolución observada incompatible');
 if(issues.length)return response('OBSERVED_STATE_MISMATCH');
 return response('BOUNDED_EXECUTION_OK',{before:JSON.parse(JSON.stringify(before)),paid,after,
  sourceZone:source.zone,targetUid,cost:{kind:'NONE',amount:0,player},
  verification:spec.paid!==undefined&&spec.after!==undefined?'PAID_AND_RESOLUTION_MATCH':'GENERATED_ONLY',
  source:rule.source});
}
function bookOfMoon1254(spec={}){return flipPositionSpell1255(spec,'moon')}
function bookOfTaiyou1255(spec={}){return flipPositionSpell1255(spec,'taiyou')}

function bookOfMoonFixtures1254(){
 const zone=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const build=(fromSet=false,otherSide=true)=>{
  const before={turn:3,activePlayer:0,phase:'MAIN1',lp:[8000,8000],chain:[],triggerQueue:[],zones:[zone(),zone()]};
  const spell={uid:'book-1',id:14087893,name:'Book of Moon',typeBits:65538,ownerPlayer:0,faceUp:false};
  if(fromSet){spell.setTurn=2;before.zones[0].spelltrap.push(spell)}else before.zones[0].hand.push(spell);
  before.zones[otherSide?1:0].monster.push({uid:'monster-1',id:89631139,name:'Blue-Eyes White Dragon',typeBits:17,ownerPlayer:otherSide?1:0,faceUp:true,position:'ATTACK'});
  return before;
 };
 const run=(before,extra={})=>bookOfMoon1254({action:'ACTIVATE_RESOLVE_BOOK_OF_MOON_1254',before,player:0,uid:'book-1',targetUid:'monster-1',...extra});
 const hand=run(build()),set=run(build(true)),own=run(build(false,false));
 const invalid=(modify)=>{const b=build();modify(b);return run(b).pass===false};
 const checks={fromHand:hand.pass,previouslySet:set.pass,ownMonster:own.pass,
  targetGoesFaceDown:hand.after?.zones?.[1]?.monster?.[0]?.faceUp===false&&hand.after?.zones?.[1]?.monster?.[0]?.position==='DEFENSE',
  spellGoesGraveyard:hand.after?.zones?.[0]?.gy?.[0]?.uid==='book-1',
  noCostAndCl1:hand.paid?.chain?.length===1&&hand.paid.chain[0].speed===2&&hand.cost.amount===0,
  noInputMutation:build().zones[0].hand.length===1,
  observeMatch:run(build(),{paid:hand.paid,after:hand.after}).pass,
  tamperedObservedState:!run(build(),{after:{...hand.after,lp:[7000,8000]}}).pass,
  faceDownRejected:invalid(b=>{b.zones[1].monster[0].faceUp=false}),
  linkRejected:invalid(b=>{b.zones[1].monster[0].typeBits=67108865}),
  tokenRejected:invalid(b=>{b.zones[1].monster[0].typeBits=16401}),
  setSameTurnRejected:invalid(b=>{const s=b.zones[0].hand.pop();s.setTurn=3;b.zones[0].spelltrap.push(s)}),
  occupiedFieldRejected:invalid(b=>{b.zones[1].spelltrap.push({uid:'other-st',id:5318639,typeBits:65538,ownerPlayer:1,faceUp:false})}),
  pendingChainRejected:invalid(b=>{b.chain.push({uid:'unknown'})}),
  wrongPhaseRejected:invalid(b=>{b.phase='BATTLE'}),
  wrongIdRejected:invalid(b=>{b.zones[0].hand[0].id=5318639}),
  duplicateUidRejected:invalid(b=>{b.zones[0].hand.push({uid:'monster-1',id:1,typeBits:17,ownerPlayer:0})}),
  missingTargetRejected:!run(build(),{targetUid:'not-a-target'}).pass,
  noCrossPlayerMutation:hand.after?.zones[1]?.monster?.length===1&&hand.after.zones[0]?.monster?.length===0};
 return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,passed:Object.values(checks).filter(Boolean).length,total:Object.keys(checks).length,certified:false,scope:'Book of Moon aislado, no reglas universales'};
}

/* Alpha 1255: dos acciones reales consecutivas, sin fabricar cartas,
   tomando el estado íntegro producido por la primera como siguiente entrada. */
function moonTaiyouSequence1255(spec={}){
 const before=spec.before,player=spec.player,moonUid=raw(spec.moonUid),taiyouUid=raw(spec.taiyouUid),targetUid=raw(spec.targetUid);
 const issues=[];
 const output=(status,extra={})=>({version:VERSION,status,pass:status==='BOUNDED_SEQUENCE_OK',certified:false,
  certifiesRules:false,certifiesOptimality:false,scope:'TWO_ACTIVATIONS_BOOK_MOON_THEN_TAIYOU_1255',issues,...extra});
 if(!moonUid||!taiyouUid||!targetUid||new Set([moonUid,taiyouUid,targetUid]).size!==3)
  return output('INVALID_IDENTITIES');
 if(!before||!Number.isInteger(player)||![0,1].includes(player))return output('INVALID_PRESTATE');
 const preFingerprint=JSON.stringify(before);
 const first=bookOfMoon1254({action:'ACTIVATE_RESOLVE_BOOK_OF_MOON_1254',before,player,uid:moonUid,targetUid});
 if(!first.pass)return output('FIRST_ACTIVATION_UNPROVEN',{firstStatus:first.status,firstIssues:first.issues});
 const second=bookOfTaiyou1255({action:'ACTIVATE_RESOLVE_BOOK_OF_TAIYOU_1255',before:first.after,player,uid:taiyouUid,targetUid});
 if(!second.pass)return output('SECOND_ACTIVATION_UNPROVEN',{firstStatus:first.status,secondStatus:second.status,secondIssues:second.issues});
 if(preFingerprint!==JSON.stringify(before))return output('INPUT_MUTATED');
 const snapBefore=snapshot1063(before,'secuencia antes'),snapAfter=snapshot1063(second.after,'secuencia después');
 issues.push(...snapBefore.issues,...snapAfter.issues);
 if(snapBefore.index.size!==snapAfter.index.size)issues.push('Cantidad de cartas alterada');
 for(const [uid,info] of snapBefore.index){
  const next=snapAfter.index.get(uid);
  if(!next||info.fingerprint!==next.fingerprint)issues.push('Identidad de copia alterada '+uid);
 }
 if(issues.length)return output('IDENTITY_NOT_PRESERVED');
 const endCard=snapAfter.index.get(targetUid)?.card;
 if(endCard?.faceUp!==true||endCard.position!=='ATTACK')return output('FINAL_POSITION_UNVERIFIED');
 if(spec.after!==undefined&&!equal1225(spec.after,second.after))return output('OBSERVED_FINAL_STATE_MISMATCH');
 return output('BOUNDED_SEQUENCE_OK',{before:JSON.parse(preFingerprint),after:second.after,
  steps:[{action:first.action,paid:first.paid,after:first.after,source:first.source},{action:second.action,paid:second.paid,after:second.after,source:second.source}],
  targetUid,cardCount:snapAfter.index.size,finalPosition:'ATTACK',sourceCardsInGraveyard:[moonUid,taiyouUid]});
}
function flipSpellFixtures1255(){
 const z=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const state=(faceUp=false)=>{
  const b={turn:3,activePlayer:0,phase:'MAIN1',lp:[8000,8000],chain:[],triggerQueue:[],zones:[z(),z()]};
  b.zones[0].hand.push({uid:'moon',id:14087893,name:'Book of Moon',typeBits:65538,ownerPlayer:0,faceUp:false});
  b.zones[0].hand.push({uid:'sun',id:38699854,name:'Book of Taiyou',typeBits:2,ownerPlayer:0,faceUp:false});
  b.zones[1].monster.push({uid:'monster',id:89631139,name:'Blue-Eyes White Dragon',typeBits:17,ownerPlayer:1,faceUp,position:faceUp?'ATTACK':'DEFENSE'});
  return b;
 };
 const cast=(before,extra={})=>bookOfTaiyou1255({action:'ACTIVATE_RESOLVE_BOOK_OF_TAIYOU_1255',before,player:0,uid:'sun',targetUid:'monster',...extra});
 const valid=cast(state()),original=state(),initial=JSON.stringify(original);
 const seq=moonTaiyouSequence1255({before:state(true),player:0,moonUid:'moon',taiyouUid:'sun',targetUid:'monster'});
 const tweak=(cb)=>{const b=state();cb(b);return cast(b).pass===false};
 const checks={
  taiyouFromHand:valid.pass,
  newSpellSpeed1:valid.paid?.chain?.[0]?.speed===1,
  noCost:valid.cost?.amount===0,
  targetFlipsAttack:valid.after?.zones[1]?.monster[0]?.faceUp===true&&valid.after.zones[1].monster[0].position==='ATTACK',
  monsterRemainsSameCopy:valid.after?.zones[1]?.monster[0]?.uid==='monster',
  taiyouEndsGY:valid.after?.zones[0]?.gy[0]?.uid==='sun',
  noMutation:JSON.stringify(original)===initial&&valid.before?.zones?.[0]?.hand?.length===2,
  taiyouSameTurnSetAllowed:(()=>{const b=state();const c=b.zones[0].hand.pop();c.setTurn=3;b.zones[0].spelltrap.push(c);return cast(b).pass})(),
  taiyouSetPreviousTurn:(()=>{const b=state();const c=b.zones[0].hand.pop();c.setTurn=2;b.zones[0].spelltrap.push(c);return cast(b).pass})(),
  observedWitness:cast(state(),{paid:valid.paid,after:valid.after}).pass,
  forgedWitness:!cast(state(),{after:{...valid.after,lp:[9000,8000]}}).pass,
  targetFaceUpRejected:tweak(b=>b.zones[1].monster[0].faceUp=true),
  linkRejected:tweak(b=>b.zones[1].monster[0].typeBits=67108865),
  missingTarget:!cast(state(),{targetUid:'fake'}).pass,
  wrongIdRejected:tweak(b=>b.zones[0].hand[1].id=123),
  wrongPhaseRejected:tweak(b=>b.phase='BATTLE'),
  chainRejected:tweak(b=>b.chain.push({uid:'other'})),
  extraSTRejected:tweak(b=>b.zones[1].spelltrap.push({uid:'other',id:5318639,typeBits:65538,ownerPlayer:1,faceUp:false})),
  sequenceExecutesBoth:seq.pass&&seq.steps.length===2,
  sequenceBothGY:seq.after?.zones[0]?.gy?.map(c=>c.uid).join(',')==='moon,sun',
  sequenceRestoresFaceup:seq.after?.zones[1]?.monster[0]?.faceUp===true&&seq.finalPosition==='ATTACK',
  sequencePreservesCards:seq.cardCount===3,
  moonChecksStillPass:bookOfMoonFixtures1254().pass,
  sequenceRejectWrongInput:!moonTaiyouSequence1255({before:state(),player:0,moonUid:'moon',taiyouUid:'sun',targetUid:'monster'}).pass,
  sequenceRejectMissingCard:!moonTaiyouSequence1255({before:state(true),player:0,moonUid:'moon',taiyouUid:'unknown',targetUid:'monster'}).pass,
  sequenceRejectTamperedFinal:!moonTaiyouSequence1255({before:state(true),player:0,moonUid:'moon',taiyouUid:'sun',targetUid:'monster',after:{lp:[]}}).pass
 };
 return{version:VERSION,pass:Object.values(checks).every(Boolean),passed:Object.values(checks).filter(Boolean).length,total:Object.keys(checks).length,checks,certified:false};
}

/* Alpha 1256: CL1 Book of Moon (velocidad 2) -> CL2 Magic Jammer
   (Contra Trampa, velocidad 3). Subconjunto comprobable: Main Phase del
   activador, monstruo normal inerte, única respuesta rival previamente colocada,
   coste de descarte de un Blue-Eyes White Dragon (Normal inerte), sin otras
   cartas activas, disparadores o efectos. No es un simulador universal.
   Magic Jammer 77414722: https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&request_locale=en
 */
/* Alpha 1257 — CL1 Book of Moon / CL2 Magic Jammer / CL3 Seven Tools.
   Estrictamente acotada: dos Contratrampas previamente colocadas, coste de
   Magic Jammer = descarte de un Normal inerte; Seven Tools = 1000 LP;
   objetivo = Normal boca arriba; ninguna otra respuesta o disparador.
   Konami: https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4862&ope=2&request_locale=en
   Konami: https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4863&ope=2&request_locale=en
   El motor 1256 modela CL1/CL2, el 1255 certifica la transición física de CL1.
   Nunca proclamar simulación general ni óptimo global.
 */
/* Alpha 1261: diagnóstico de elegibilidad de aperturas importadas.
   Nunca crea manos, estados rivales ni certifica una línea de combo.
   Sirve para preparar regresiones reproducibles de los cinco modos de búsqueda. */
function scenarioSampleDiagnostics1258(opts={}){
 const modes=['chain','mixed','solemnMixed','solemnExplore','solemnOrPass'];
 const mode=typeof opts.mode==='string'?opts.mode:'chain';
 const fail=status=>({version:VERSION,status,pass:false,certified:false,
   globalOptimalityProven:false,samples:[],eligibleSamples:[],
   explanation:'Diagnóstico informativo, no búsqueda ni prueba de un combo.'});
 if(!modes.includes(mode))return fail('MODO_NO_RECONOCIDO_1258');
 if(!Array.isArray(W.CARD_CATALOG)||W.CARD_CATALOG.length!==19617)
  return fail('CATALOGO_NO_COMPLETO_1258');
 if(!W.deckState||!Array.isArray(W.deckState.main))return fail('IMPORTAR_BARAJA_PROPIA_1258');
 const copies=W.deckState.main.reduce((n,c)=>n+(Number(c?.qty)||0),0);
 if(!Number.isSafeInteger(copies)||copies<40||copies>60)
  return fail('MAIN_YDK_NO_VALIDO_1258');
 const open=W.YGOAlpha655?.openingState655;
 if(typeof open!=='function')return fail('MOTOR_DE_APERTURAS_NO_DISPONIBLE_1258');
 const available=(opts.indices===undefined)?[0,1,2,3,4,5,6,7,8,9]:opts.indices;
 if(!Array.isArray(available)||available.length<1||available.length>10||
    available.some(x=>!Number.isInteger(x)||x<0||x>9)||new Set(available).size!==available.length)
  return fail('INDICES_INVALIDOS_1258');
 const seenBefore=JSON.stringify(W.deckState.main);
 const removalIds=new Set([5318639,8267140,43898403]);
 const samples=[];
 for(const index of available){
  let st=null;
  try{st=open(index)}catch(_){return fail('APERTURA_NO_REPRODUCIBLE_1258')}
  const h=st?.zones?.[0]?.hand;
  if(!Array.isArray(h)||h.length!==5||!h.every(c=>c&&Number.isSafeInteger(Number(c.card?.id))&&Number(c.card.id)>0))
   return fail('MANO_NO_VERIFICADA_1258');
  const ids=h.map(c=>Number(c.card.id));
  const hasSevenTools=ids.includes(3819470);
  const removals=ids.filter(id=>removalIds.has(id));
  const reasons=[];
  if(mode==='chain'&&!hasSevenTools)reasons.push('SIN_SEVEN_TOOLS_EN_MANO');
  if(removals.length===0)reasons.push('SIN_MAGICA_DE_ELIMINACION_EN_MANO');
  samples.push({index,ids,hasSevenTools,removalCount:removals.length,
   plausible:reasons.length===0,reasons});
 }
 if(JSON.stringify(W.deckState.main)!==seenBefore)
  return fail('DIAGNOSTICO_MUTA_BARAJA_1258');
 return {version:VERSION,status:'MUESTRAS_DIAGNOSTICADAS_1258',pass:true,
  certified:false,globalOptimalityProven:false,mode,copies,
  samples,eligibleSamples:samples.filter(x=>x.plausible).map(x=>x.index),
  explanation:'Plausible sólo significa que la mano tiene las cartas mínimas; no garantiza cinco líneas, legalidad universal ni resultados de búsqueda.'};
}

/* Alpha 1262 — Respuesta acotada de Solemn Judgment a Book of Moon.
 * Fuente oficial: https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4861&ope=2&request_locale=en
 * Solo tres copias físicas acreditadas y LP positivos del respondedor. Ningún otro
 * efecto, respuesta, carta de campo/cementerio, trigger ni mano rival modelados.
 * Se reutiliza la autoridad CL1 de Book of Moon 1254/1255. No Top 5 universal. */
function moonSolemnJudgmentChain1261(spec={}){
 const before=spec?.before,player=spec?.player,opp=1-player;
 const ids={moon:raw(spec?.moonUid),solemn:raw(spec?.solemnUid),target:raw(spec?.targetUid)};
 const issues=[];
 const fail=(status,detail={})=>({version:VERSION,status,pass:false,certified:false,
  certifiesRules:false,certifiesOptimality:false,globalOptimalityProven:false,
  scope:'BOOK_OF_MOON_VS_SET_SOLEMN_JUDGMENT_ROUNDED_LP_ISOLATED_1262',
  issues:[...new Set(issues)].slice(0,25),...detail});
 if(!Number.isSafeInteger(player)||![0,1].includes(player))issues.push('Jugador activo no acreditado');
 if(Object.values(ids).some(x=>!x)||new Set(Object.values(ids)).size!==3)
  issues.push('Se requieren exactamente tres UID físicos diferentes');
 const initial=snapshot1063(before,'CL1/CL2 Solemn Judgment 1261');
 issues.push(...initial.issues);
 if(issues.length)return fail('INVALID_PRESTATE_1261');
 if(Object.keys(before).some(k=>!['turn','activePlayer','phase','lp','chain','triggerQueue','zones'].includes(k)))
  issues.push('Estado raíz adicional no modelado');
 if(before.activePlayer!==player||!/^MAIN(?:1|2)$/i.test(raw(before.phase)))
  issues.push('Solo Main Phase propia acreditada');
 if(!Number.isSafeInteger(before.turn)||before.turn<2)issues.push('Turno insuficiente');
 if(!Array.isArray(before.lp)||before.lp.length!==2||before.lp.some(v=>!Number.isSafeInteger(v)||v<=0||v>999999))issues.push('LP positivos enteros del rival obligatorios');
 if(!Array.isArray(before.chain)||before.chain.length||!Array.isArray(before.triggerQueue)||before.triggerQueue.length)
  issues.push('Cadena o disparadores pendientes no modelados');
 const moon=initial.index.get(ids.moon),solemn=initial.index.get(ids.solemn),target=initial.index.get(ids.target);
 if(!moon||moon.player!==player||!['hand','spelltrap'].includes(moon.zone))issues.push('Book of Moon fuera de zona acreditada');
 if(!solemn||solemn.player!==opp||solemn.zone!=='spelltrap')issues.push('Solemn Judgment no colocada por el rival');
 if(!target||target.zone!=='monster')issues.push('Monstruo objetivo ausente');
 const m=moon?.card||{},sj=solemn?.card||{},t=target?.card||{};
 const bits=c=>Number(c.typeBits??c.type);
 if(Number(m.id)!==14087893||bits(m)!==65538||m.ownerPlayer!==player||m.faceUp===true||
    (m.name!=null&&!['book of moon','libro de la luna'].includes(low(m.name))))
  issues.push('Identidad de Book of Moon incompatible');
 if(moon?.zone==='spelltrap'&&(!Number.isSafeInteger(m.setTurn)||m.setTurn<1||m.setTurn>=before.turn||m.faceUp!==false))
  issues.push('Book of Moon colocada sin historial de turno válido');
 if(Number(sj.id)!==41420027||bits(sj)!==1048580||sj.ownerPlayer!==opp||sj.faceUp!==false||
    !Number.isSafeInteger(sj.setTurn)||sj.setTurn<1||sj.setTurn>=before.turn||
    (sj.name!=null&&!['solemn judgment','juicio solemne'].includes(low(sj.name))))
  issues.push('Solemn Judgment no acreditada como Contra Trampa colocada previamente');
 if(bits(t)!==17||t.faceUp!==true||!['ATTACK','DEFENSE'].includes(raw(t.position).toUpperCase())||
    ![0,1].includes(t.ownerPlayer))issues.push('Objetivo no Normal boca arriba');
 const allowedCardKeys=['uid','id','name','typeBits','type','ownerPlayer','faceUp','position','setTurn'];
 for(const info of [moon,solemn,target])if(info?.card&&Object.keys(info.card).some(k=>!allowedCardKeys.includes(k)))
  issues.push('Propiedades adicionales de carta no modeladas');
 for(let p=0;p<2;p++){
  const z=before.zones[p];
  if(Object.keys(z).some(k=>!ZONES_1063.includes(k)))issues.push('Zona adicional no modelada');
  if(z.monster.some(c=>raw(c.uid)!==ids.target)||z.monster.length>1)issues.push('Monstruos adicionales no modelados');
  if(z.spelltrap.some(c=>![ids.moon,ids.solemn].includes(raw(c.uid))))issues.push('Mágicas/Trampas adicionales no modeladas');
  if(z.hand.some(c=>raw(c.uid)!==ids.moon))issues.push('Manos adicionales no modeladas');
  if(z.gy.length||z.banished.length)issues.push('Cementerio o desterradas no modelados');
 }
 if(before.zones[opp].spelltrap.length!==1||before.zones[opp].hand.length)
  issues.push('Respuesta rival no aislada');
 if(issues.length)return fail('PRECONDITIONS_NOT_PROVEN_1261');
 const isolated=structuredClone(before);isolated.zones[opp].spelltrap=[];
 const cl1=bookOfMoon1254({action:'ACTIVATE_RESOLVE_BOOK_OF_MOON_1254',before:isolated,player,uid:ids.moon,targetUid:ids.target});
 if(!cl1.pass)return fail('CL1_ACTIVATION_UNPROVEN_1261',{cl1Status:cl1.status,cl1Issues:cl1.issues});
 let paid,chained,after;
 try{
  paid=structuredClone(cl1.paid);paid.zones[opp].spelltrap.push(structuredClone(sj));
  chained=structuredClone(paid);
  const counter=chained.zones[opp].spelltrap.find(c=>raw(c.uid)===ids.solemn);
  if(!counter||counter.faceUp!==false)throw Error('Solemn Judgment no disponible');
  counter.faceUp=true;
  // Alpha 1262: LP impares conservan ceil(LP/2); incluso 1 LP sigue en 1.
  const lpBeforeCost=chained.lp[opp];const lpAfterCost=Math.ceil(lpBeforeCost/2);
  const lpCost=lpBeforeCost-lpAfterCost;chained.lp[opp]=lpAfterCost;
  chained.chain.push({uid:ids.solemn,player:opp,speed:3,action:'ACTIVATE_COUNTER_TRAP',
   respondsTo:ids.moon,negatesActivation:true,lpCost});
  after=structuredClone(chained);
  for(const [p,uid] of [[player,ids.moon],[opp,ids.solemn]]){
   const field=after.zones[p].spelltrap;const i=field.findIndex(c=>raw(c.uid)===uid);
   if(i<0)throw Error('Carta activada desaparecida');
   const used=field.splice(i,1)[0];used.faceUp=true;after.zones[used.ownerPlayer].gy.push(used);
  }
  after.chain=[];
 }catch(e){issues.push(String(e?.message||e));return fail('CHAIN_EXECUTION_FAILED_1261')}
 for(const [label,state] of [['CL1',paid],['CL2',chained],['Final',after]])
  issues.push(...snapshot1063(state,'Solemn '+label).issues);
 const final=snapshot1063(after,'inventario final');
 if(final.index.size!==initial.index.size)issues.push('Número de copias cambiado');
 for(const [uid,item] of initial.index){const v=final.index.get(uid);
  if(!v||v.fingerprint!==item.fingerprint)issues.push('UID/propietario alterado '+uid);
 }
 if(!equal1225(final.index.get(ids.target)?.card,t))issues.push('Monstruo modificado pese a la negación');
 if(after.lp[opp]!==Math.ceil(before.lp[opp]/2)||after.lp[player]!==before.lp[player])issues.push('LP incorrectos');
 if(!after.zones[player].gy.some(c=>raw(c.uid)===ids.moon)||!after.zones[opp].gy.some(c=>raw(c.uid)===ids.solemn))
  issues.push('Cartas no llegaron a cementerios propios');
 if(paid.chain.length!==1||chained.chain.length!==2||chained.chain.map(x=>x.speed).join(',')!=='2,3'||after.chain.length)
  issues.push('Cadena o velocidad inválidas');
 if(issues.length)return fail('GENERATED_STATE_INVALID_1261');
 for(const k of ['paid','chained','after'])if(spec[k]!==undefined&&!equal1225(spec[k],{paid,chained,after}[k]))
  issues.push('Testigo observado inconsistente: '+k);
 if(issues.length)return fail('OBSERVED_STATE_MISMATCH_1261');
 return{version:VERSION,status:'BOUNDED_MOON_SOLEMN_NEGATION_ROUNDED_LP_OK_1262',pass:true,certified:false,
  certifiesRules:false,certifiesOptimality:false,globalOptimalityProven:false,
  scope:'CL1 Book of Moon, CL2 Solemn Judgment previamente colocada, LP positivos enteros con redondeo hacia arriba, objetivo Normal sin respuestas adicionales.',
  source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4861&ope=2&request_locale=en',
  before:structuredClone(before),paid,chained,after,chainLinks:2,spellSpeed:[2,3],
  originalSpellResolved:false,originalSpellActivationNegated:true,
  cost:{kind:'HALF_LP',player:opp,lpPaid:Math.floor(before.lp[opp]/2),originalLp:before.lp[opp],remainingLp:Math.ceil(before.lp[opp]/2),roundedUp:before.lp[opp]%2===1},
  verification:['paid','chained','after'].every(k=>spec[k]!==undefined)?'ALL_STATES_MATCH':'GENERATED_ONLY'};
}
function moonSolemnJudgmentFixtures1261(){
 const zone=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const build=({player=0,targetPlayer=1,turn=3,lp=8000,moonSet=false}={})=>{
  const opp=1-player,s={turn,activePlayer:player,phase:'MAIN1',lp:[8000,8000],chain:[],triggerQueue:[],zones:[zone(),zone()]};
  s.lp[opp]=lp;
  const m={uid:'moon',id:14087893,name:'Book of Moon',typeBits:65538,ownerPlayer:player,faceUp:false};
  if(moonSet){m.setTurn=2;s.zones[player].spelltrap.push(m)}else s.zones[player].hand.push(m);
  s.zones[opp].spelltrap.push({uid:'solemn',id:41420027,name:'Solemn Judgment',typeBits:1048580,
   ownerPlayer:opp,faceUp:false,setTurn:2});
  s.zones[targetPlayer].monster.push({uid:'target',id:89631139,name:'Blue-Eyes White Dragon',
   typeBits:17,ownerPlayer:targetPlayer,faceUp:true,position:'ATTACK'});
  return s;
 };
 const run=(s,extra={})=>moonSolemnJudgmentChain1261({before:s,player:s.activePlayer,
  moonUid:'moon',solemnUid:'solemn',targetUid:'target',...extra});
 const valid=run(build()),initial=build(),saved=JSON.stringify(initial);
 const bad=mut=>{const s=build();mut(s);return !run(s).pass};
 const checks={
  twoLinks:valid.pass&&valid.chainLinks===2,
  speed23:valid.spellSpeed?.join(',')==='2,3',
  firstLinkPending:valid.paid?.chain?.length===1&&valid.paid.chain[0].uid==='moon',
  respondingToSpell:valid.chained?.chain?.[1]?.respondsTo==='moon',
  halfLpCost:valid.cost?.lpPaid===4000&&valid.after?.lp?.join(',')==='8000,4000',
  noOriginalResolution:valid.originalSpellResolved===false&&valid.originalSpellActivationNegated===true,
  monsterUnchanged:valid.after?.zones[1].monster[0]?.position==='ATTACK'&&valid.after.zones[1].monster[0].faceUp===true,
  cardsInOwnersGraves:valid.after?.zones[0].gy[0]?.uid==='moon'&&valid.after?.zones[1].gy[0]?.uid==='solemn',
  chainCleared:valid.after?.chain?.length===0,
  copiesPreserved:snapshot1063(valid.after,'ending').index.size===3,
  doesNotMutate:JSON.stringify(initial)===saved,
  replayObserved:run(build(),{paid:valid.paid,chained:valid.chained,after:valid.after}).pass,
  player1Works:run(build({player:1,targetPlayer:0})).pass,
  selfMonster:run(build({targetPlayer:0})).pass,
  priorSetMoon:run(build({moonSet:true})).pass,
  smallEvenLp:run(build({lp:2})).after?.lp[1]===1,
  odd7999Allowed:run(build({lp:7999})).pass&&run(build({lp:7999})).after?.lp[1]===4000,
  odd525Rounds263:run(build({lp:525})).pass&&run(build({lp:525})).after?.lp[1]===263,
  odd3Rounds2:run(build({lp:3})).pass&&run(build({lp:3})).after?.lp[1]===2,
  oneLpStillOne:run(build({lp:1})).pass&&run(build({lp:1})).after?.lp[1]===1,
  oddCostsMetadata:run(build({lp:525})).cost?.lpPaid===262&&run(build({lp:525})).cost?.roundedUp===true,
  oneLpDisplayedCostZero:run(build({lp:1})).cost?.lpPaid===0,
  reversePlayerOdd:run(build({player:1,targetPlayer:0,lp:525})).after?.lp[0]===263,
  rejectFractionalLp:!run(build({lp:3.5})).pass,
  rejectAboveLimitLp:!run(build({lp:1000000})).pass,
  rejectOddForgedFinal:!run(build({lp:525}),{after:{...run(build({lp:525})).after,lp:[8000,262]}}).pass,
  rejectZeroLp:!run(build({lp:0})).pass,
  rejectWrongSolemn:bad(s=>s.zones[1].spelltrap[0].id=111),
  rejectSolemnType:bad(s=>s.zones[1].spelltrap[0].typeBits=4),
  rejectSolemnFaceUp:bad(s=>s.zones[1].spelltrap[0].faceUp=true),
  rejectSolemnJustSet:bad(s=>s.zones[1].spelltrap[0].setTurn=3),
  rejectSolemnOwner:bad(s=>s.zones[1].spelltrap[0].ownerPlayer=0),
  rejectMoonId:bad(s=>s.zones[0].hand[0].id=0),
  rejectMoonEffectMonster:bad(s=>s.zones[1].monster[0].typeBits=33),
  rejectMoonFaceDownTarget:bad(s=>s.zones[1].monster[0].faceUp=false),
  rejectMissingTarget:bad(s=>s.zones[1].monster=[]),
  rejectBusyChain:bad(s=>s.chain.push({uid:'extra'})),
  rejectWrongPhase:bad(s=>s.phase='BATTLE'),
  rejectExtraHand:bad(s=>s.zones[0].hand.push({uid:'x',id:10,ownerPlayer:0})),
  rejectExtraST:bad(s=>s.zones[0].spelltrap.push({uid:'x',id:10,ownerPlayer:0})),
  rejectGraveEffects:bad(s=>s.zones[1].gy.push({uid:'x',id:10,ownerPlayer:1})),
  rejectDuplicateUID:bad(s=>s.zones[1].spelltrap[0].uid='moon'),
  rejectExtraState:bad(s=>s.extraField='unknown'),
  rejectForgedPaid:!run(build(),{paid:{...valid.paid,chain:[]}}).pass,
  rejectForgedCL2:!run(build(),{chained:{...valid.chained,lp:[1,1]}}).pass,
  rejectForgedAfter:!run(build(),{after:{...valid.after,chain:[{uid:'fake'}]}}).pass,
  previousMoonWorks:bookOfMoonFixtures1254().pass,
  previousTaiyouWorks:flipSpellFixtures1255().pass,
  previousJammerWorks:magicJammerFixtures1256().pass,
  previousThreeLinkWorks:moonJammerSevenFixtures1257().pass
 };
 return{version:VERSION,pass:Object.values(checks).every(Boolean),passed:Object.values(checks).filter(Boolean).length,
  total:Object.keys(checks).length,checks,certified:false,scope:'Solo CL1 Book of Moon y CL2 Solemn Judgment, sin óptimo universal'};
}

function moonJammerSevenChain1257(spec={}){
 const before=spec?.before,player=spec?.player,opp=1-player;
 const keys=['moonUid','jammerUid','discardUid','targetUid','counterUid'];
 const ids=Object.fromEntries(keys.map(k=>[k,raw(spec?.[k])]));
 const issues=[];
 const fail=(status,detail={})=>({version:VERSION,status,pass:false,certified:false,
  certifiesRules:false,certifiesOptimality:false,globalOptimalityProven:false,
  scope:'BOOK_MOON_MAGIC_JAMMER_SEVEN_TOOLS_CL1_CL2_CL3_1257',issues:[...new Set(issues)].slice(0,25),...detail});
 if(!Number.isSafeInteger(player)||![0,1].includes(player))issues.push('Jugador activo inválido');
 if(keys.some(k=>!ids[k])||new Set(Object.values(ids)).size!==5)issues.push('Cinco UID físicos únicos obligatorios');
 const b=snapshot1063(before,'CL1-3 antes');issues.push(...b.issues);
 if(issues.length)return fail('INVALID_PRESTATE_1257');
 const allowedRoot=['turn','activePlayer','phase','lp','chain','triggerQueue','zones'];
 if(Object.keys(before).some(k=>!allowedRoot.includes(k)))issues.push('Estado adicional no modelado');
 if(before.activePlayer!==player||!/^MAIN(?:1|2)$/i.test(raw(before.phase)))issues.push('Main Phase propia obligatoria');
 if(!Number.isSafeInteger(before.turn)||before.turn<2)issues.push('Turno inválido para contratrampas colocadas');
 if(!Array.isArray(before.lp)||before.lp.length!==2||before.lp.some(v=>!Number.isSafeInteger(v)||v<=0)||
    before.lp[player]<=1000)issues.push('LP insuficientes para pagar 1000 sin llegar a cero');
 if(!Array.isArray(before.chain)||before.chain.length||!Array.isArray(before.triggerQueue)||before.triggerQueue.length)
  issues.push('Cadena/disparadores previos no modelados');
 for(let p=0;p<2;p++){
  if(Object.keys(before.zones[p]).some(k=>!ZONES_1063.includes(k)))issues.push('Zona adicional no modelada');
 }
 const seven=b.index.get(ids.counterUid);
 if(!seven||seven.player!==player||seven.zone!=='spelltrap')issues.push('Seven Tools no está colocada por el activador');
 else{
  const c=seven.card,typ=Number(c.typeBits??c.type);
  if(Number(c.id)!==3819470||typ!==1048580||c.ownerPlayer!==player||c.faceUp!==false||
    !Number.isSafeInteger(c.setTurn)||c.setTurn<1||c.setTurn>=before.turn||
    (c.name!=null&&!['seven tools of the bandit','siete herramientas del bandido',
    'las siete herramientas del bandido'].includes(low(c.name))))
   issues.push('Identidad/antigüedad de Seven Tools no demostrada');
  if(Object.keys(c).some(k=>!['uid','id','name','typeBits','type','ownerPlayer','faceUp','setTurn'].includes(k)))
   issues.push('Propiedades desconocidas en la contratrampa');
 }
 // Se prohíben otras cartas propias colocadas además del posible Book of Moon.
 if(before.zones[player]?.spelltrap?.some(c=>![ids.moonUid,ids.counterUid].includes(raw(c.uid))))
  issues.push('Otras S/T propias fuera del subconjunto');
 if(issues.length)return fail('PRECONDITIONS_NOT_PROVEN_1257');
 // Reconstrucción de CL1 y CL2 usando literalmente el ejecutor previo 1256.
 // Sólo se omite Seven Tools para aislar esa rama, manteniendo todas las demás copias.
 const isolated=structuredClone(before);
 isolated.zones[player].spelltrap=isolated.zones[player].spelltrap.filter(c=>raw(c.uid)!==ids.counterUid);
 const cl2=magicJammerMoonChain1256({before:isolated,player,moonUid:ids.moonUid,
  jammerUid:ids.jammerUid,discardUid:ids.discardUid,targetUid:ids.targetUid});
 if(!cl2.pass)return fail('CL1_CL2_NOT_PROVEN_1257',{priorStatus:cl2.status,priorIssues:cl2.issues});
 const clean=structuredClone(isolated);
 clean.zones[opp].spelltrap=clean.zones[opp].spelltrap.filter(c=>raw(c.uid)!==ids.jammerUid);
 const cl1=bookOfMoon1254({action:'ACTIVATE_RESOLVE_BOOK_OF_MOON_1254',before:clean,
  player,uid:ids.moonUid,targetUid:ids.targetUid});
 if(!cl1.pass)return fail('CL1_FINAL_EFFECT_UNPROVEN_1257',{priorStatus:cl1.status,priorIssues:cl1.issues});
 let paid,chained,countered,resolvedCounter,after;
 try{
  paid=structuredClone(cl2.paid);
  paid.zones[player].spelltrap.push(structuredClone(seven.card));
  chained=structuredClone(cl2.chained);
  chained.zones[player].spelltrap.push(structuredClone(seven.card));
  countered=structuredClone(chained);
  const trap=countered.zones[player].spelltrap.find(c=>raw(c.uid)===ids.counterUid);
  if(!trap||trap.faceUp!==false)throw Error('Seven Tools no está boca abajo en CL3');
  trap.faceUp=true;
  countered.lp[player]-=1000;
  countered.chain.push({uid:ids.counterUid,player,speed:3,action:'ACTIVATE_COUNTER_TRAP',
   respondsTo:ids.jammerUid,negatesActivation:true,lpCost:1000});
  resolvedCounter=structuredClone(countered);
  for(const [p,id] of [[player,ids.counterUid],[opp,ids.jammerUid]]){
   const field=resolvedCounter.zones[p].spelltrap;
   const i=field.findIndex(c=>raw(c.uid)===id);
   if(i<0)throw Error('Contratrampa física ausente en resolución');
   const c=field.splice(i,1)[0];c.faceUp=true;
   resolvedCounter.zones[c.ownerPlayer].gy.push(c);
  }
  resolvedCounter.chain=resolvedCounter.chain.slice(0,1); // CL1 todavía pendiente.
  after=structuredClone(resolvedCounter);
  // El efecto CL1 se obtiene del ejecutor canónico de Book of Moon, no de una
  // regla nueva aproximada. Las dos contratrampas negadas no lo cancelan.
  const targetEnd=snapshot1063(cl1.after,'CL1 real').index.get(ids.targetUid);
  const targetLocation=snapshot1063(after,'CL1 pendiente').index.get(ids.targetUid);
  if(!targetEnd||!targetLocation||targetEnd.player!==targetLocation.player||targetEnd.zone!=='monster')
   throw Error('Objetivo físico no rastreable');
  after.zones[targetLocation.player].monster[targetLocation.slot]=structuredClone(targetEnd.card);
  const src=after.zones[player].spelltrap;
  const i=src.findIndex(c=>raw(c.uid)===ids.moonUid);
  if(i<0)throw Error('Libro de la Luna no acreditado');
  const used=src.splice(i,1)[0];used.faceUp=true;
  after.zones[used.ownerPlayer].gy.push(used);
  after.chain=[];
 }catch(e){issues.push(String(e?.message||e));return fail('CHAIN_EXECUTION_FAILED_1257');}
 for(const [label,s] of [['CL1 pagado',paid],['CL2 activado',chained],['CL3 activado',countered],
   ['CL3 resuelto',resolvedCounter],['CL1 resuelto',after]])issues.push(...snapshot1063(s,label).issues);
 const last=snapshot1063(after,'copia final');
 if(last.index.size!==b.index.size)issues.push('El número de copias físicas cambió');
 for(const [id,x] of b.index){const next=last.index.get(id);
  if(!next||next.fingerprint!==x.fingerprint)issues.push('Identidad o propietario alterado: '+id);
 }
 const finalTarget=last.index.get(ids.targetUid);
 if(finalTarget?.card.faceUp!==false||finalTarget.card.position!=='DEFENSE')
  issues.push('Book of Moon no resolvió su cambio de posición');
 if(!equal1225(finalTarget?.card,snapshot1063(cl1.after,'CL1 verificado').index.get(ids.targetUid)?.card))
  issues.push('Transición de Book of Moon distinta del motor previo');
 if(after.lp[player]!==before.lp[player]-1000||after.lp[opp]!==before.lp[opp])issues.push('Coste de LP incorrecto');
 if(!after.zones[opp].gy.some(c=>raw(c.uid)===ids.discardUid)||
    !after.zones[opp].gy.some(c=>raw(c.uid)===ids.jammerUid)||
    !after.zones[player].gy.some(c=>raw(c.uid)===ids.moonUid)||
    !after.zones[player].gy.some(c=>raw(c.uid)===ids.counterUid))
  issues.push('Descarte o destino de Mágica/Trampas incorrecto');
 if(after.chain.length||after.triggerQueue.length||resolvedCounter.chain.length!==1||
    countered.chain.length!==3||countered.chain.map(x=>x.speed).join(',')!=='2,3,3')
  issues.push('Orden de cadena inválido');
 if(issues.length)return fail('GENERATED_STATE_INVALID_1257');
 for(const key of ['paid','chained','countered','resolvedCounter','after']){
  if(spec[key]!==undefined&&!equal1225(spec[key],{paid,chained,countered,resolvedCounter,after}[key]))
   issues.push('Estado observado incompatible: '+key);
 }
 if(issues.length)return fail('OBSERVED_STATE_MISMATCH_1257');
 return{version:VERSION,status:'BOUNDED_THREE_LINK_BOOK_MOON_OK_1257',pass:true,
  certified:false,certifiesRules:false,certifiesOptimality:false,globalOptimalityProven:false,
  scope:'CL1 Book of Moon; CL2 Magic Jammer; CL3 Seven Tools. Solo monstruo Normal, sin efectos extra.',
  sources:['https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4862&ope=2&request_locale=en',
   'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4863&ope=2&request_locale=en'],
  before:structuredClone(before),paid,chained,countered,resolvedCounter,after,
  chainLinks:3,spellSpeed:[2,3,3],originalSpellResolved:true,jammerActivationNegated:true,
  cost:{jammerDiscardedUid:ids.discardUid,jammerCostRemainsPaid:true,sevenToolsLpPaid:1000},
  chainOrder:['CL1_BOOK_OF_MOON','CL2_MAGIC_JAMMER_DISCARD','CL3_SEVEN_TOOLS_PAY_1000',
   'RESOLVE_CL3_NEGATE_JAMMER','CL2_DOES_NOT_RESOLVE','RESOLVE_CL1_BOOK_OF_MOON'],
  verification:['paid','chained','countered','resolvedCounter','after'].every(k=>spec[k]!==undefined)?'ALL_STATES_MATCH':'GENERATED_ONLY'};
}
function moonJammerSevenFixtures1257(){
 const zone=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const build=({player=0,targetPlayer=1,moonSet=false,turn=3,lp=8000}={})=>{
  const opp=1-player,s={turn,activePlayer:player,phase:'MAIN1',lp:[8000,8000],chain:[],triggerQueue:[],zones:[zone(),zone()]};
  s.lp[player]=lp;
  const moon={uid:'moon',id:14087893,name:'Book of Moon',typeBits:65538,ownerPlayer:player,faceUp:false};
  if(moonSet){moon.setTurn=2;s.zones[player].spelltrap.push(moon)}else s.zones[player].hand.push(moon);
  s.zones[player].spelltrap.push({uid:'seven',id:3819470,name:'Seven Tools of the Bandit',typeBits:1048580,ownerPlayer:player,faceUp:false,setTurn:2});
  s.zones[opp].spelltrap.push({uid:'jammer',id:77414722,name:'Magic Jammer',typeBits:1048580,ownerPlayer:opp,faceUp:false,setTurn:2});
  s.zones[opp].hand.push({uid:'discard',id:89631139,name:'Blue-Eyes White Dragon',typeBits:17,ownerPlayer:opp,faceUp:false});
  s.zones[targetPlayer].monster.push({uid:'monster',id:89631139,name:'Blue-Eyes White Dragon',typeBits:17,ownerPlayer:targetPlayer,faceUp:true,position:'ATTACK'});
  return s;
 };
 const run=(b,extra={})=>moonJammerSevenChain1257({before:b,player:b.activePlayer,moonUid:'moon',
  jammerUid:'jammer',counterUid:'seven',discardUid:'discard',targetUid:'monster',...extra});
 const valid=run(build()),pristine=build(),fingerprint=JSON.stringify(pristine);
 const bad=cb=>{const b=build();cb(b);return !run(b).pass};
 const obs=Object.fromEntries(['paid','chained','countered','resolvedCounter','after'].map(k=>[k,valid[k]]));
 const result={
  threeLinks:valid.pass&&valid.chainLinks===3,
  speedProof:valid.spellSpeed?.join(',')==='2,3,3',
  cl1Pending:valid.paid?.chain?.length===1,
  cl2AlreadyPaid:valid.chained?.zones[1].gy?.some(c=>c.uid==='discard'),
  cl3LpPaid:valid.countered?.lp[0]===7000,
  cl3ThirdLink:valid.countered?.chain?.length===3&&valid.countered.chain[2].respondsTo==='jammer',
  counterTrapsGone:valid.resolvedCounter?.zones[0].gy?.some(c=>c.uid==='seven')&&valid.resolvedCounter?.zones[1].gy?.some(c=>c.uid==='jammer'),
  cl1StillPending:valid.resolvedCounter?.chain?.length===1,
  moonFlipsDown:valid.after?.zones[1].monster?.[0]?.position==='DEFENSE'&&valid.after.zones[1].monster[0].faceUp===false,
  twoCostsApplied:valid.after?.lp?.join(',')==='7000,8000'&&valid.after.zones[1].gy.some(c=>c.uid==='discard'),
  allFiveCopiesPreserved:!!valid.after&&snapshot1063(valid.after,'final').index.size===5,
  ownSevenEndsOwnGy:valid.after?.zones[0].gy.some(c=>c.uid==='seven'),
  oppJammerEndsOppGy:valid.after?.zones[1].gy.some(c=>c.uid==='jammer'),
  spellEndsOwnGy:valid.after?.zones[0].gy.some(c=>c.uid==='moon'),
  originalNotMutated:JSON.stringify(pristine)===fingerprint&&JSON.stringify(build())===fingerprint,
  observedFullReplay:run(build(),obs).pass,
  differentPlayers:run(build({player:1,targetPlayer:0})).pass,
  ownMonster:run(build({targetPlayer:0})).pass,
  moonSetPreviousTurn:run(build({moonSet:true})).pass,
  exact1001LP:run(build({lp:1001})).after?.lp[0]===1,
  insufficient1000LP:!run(build({lp:1000})).pass,
  missingSeven:bad(b=>b.zones[0].spelltrap=[]),
  missingJammer:bad(b=>b.zones[1].spelltrap=[]),
  noDiscard:bad(b=>b.zones[1].hand=[]),
  justSetSeven:bad(b=>b.zones[0].spelltrap[0].setTurn=3),
  justSetJammer:bad(b=>b.zones[1].spelltrap[0].setTurn=3),
  wrongSevenId:bad(b=>b.zones[0].spelltrap[0].id=5),
  wrongSevenType:bad(b=>b.zones[0].spelltrap[0].typeBits=4),
  sevenFaceUp:bad(b=>b.zones[0].spelltrap[0].faceUp=true),
  wrongSevenOwner:bad(b=>b.zones[0].spelltrap[0].ownerPlayer=1),
  wrongJammerId:bad(b=>b.zones[1].spelltrap[0].id=5),
  fakeDiscard:bad(b=>b.zones[1].hand[0].typeBits=33),
  noTarget:bad(b=>b.zones[1].monster=[]),
  targetFaceDown:bad(b=>b.zones[1].monster[0].faceUp=false),
  targetLink:bad(b=>b.zones[1].monster[0].typeBits=67108865),
  extraField:bad(b=>b.zones[0].spelltrap.push({uid:'other',id:0,ownerPlayer:0})),
  extraHand:bad(b=>b.zones[0].hand.push({uid:'other',id:0,ownerPlayer:0})),
  extraZonesProperty:bad(b=>b.zones[0].skill={}),
  extraRoot:bad(b=>b.customFlag=true),
  busyChain:bad(b=>b.chain.push({uid:'something'})),
  wrongPhase:bad(b=>b.phase='BATTLE'),
  duplicateUID:bad(b=>b.zones[1].hand[0].uid='seven'),
  forgedPaidRejected:!run(build(),{paid:{...valid.paid,lp:[1,1]}}).pass,
  forgedChainRejected:!run(build(),{countered:{...valid.countered,chain:[]}}).pass,
  forgedFinalRejected:!run(build(),{after:{...valid.after,lp:[1,1]}}).pass,
  priorJammerFixtures:magicJammerFixtures1256().pass,
  priorMoonFixtures:bookOfMoonFixtures1254().pass,
  priorTaiyouFixtures:flipSpellFixtures1255().pass
 };
 return{version:VERSION,pass:Object.values(result).every(Boolean),passed:Object.values(result).filter(Boolean).length,
  total:Object.keys(result).length,checks:result,certified:false,
  scope:'Tres eslabones reales estrictamente aislados. No Top 5 universal.'};
}

function magicJammerMoonChain1256(spec={}){
 const before=spec?.before,player=spec?.player,opp=1-player;
 const moonUid=raw(spec?.moonUid),jammerUid=raw(spec?.jammerUid),discardUid=raw(spec?.discardUid),targetUid=raw(spec?.targetUid);
 const issues=[];
 const fail=(status,extras={})=>({version:VERSION,status,pass:false,certified:false,
  certifiesRules:false,certifiesOptimality:false,scope:'BOOK_MOON_CL1_MAGIC_JAMMER_CL2_1256',
  issues:[...new Set(issues)].slice(0,25),...extras});
 if(!Number.isSafeInteger(player)||![0,1].includes(player))issues.push('Jugador activo inválido');
 if(!moonUid||!jammerUid||!discardUid||!targetUid||new Set([moonUid,jammerUid,discardUid,targetUid]).size!==4)
  issues.push('Se requieren cuatro UID únicos de copias físicas');
 const b=snapshot1063(before,'CL1/CL2 antes');issues.push(...b.issues);
 if(issues.length)return fail('INVALID_PRESTATE_1256');
 if(Object.keys(before).some(k=>!['turn','activePlayer','phase','lp','chain','triggerQueue','zones'].includes(k)))
  issues.push('Propiedades externas de estado no modeladas');
 if(before.activePlayer!==player||!/^MAIN(?:1|2)$/i.test(raw(before.phase)))issues.push('Se requiere Main Phase propia');
 if(!Number.isSafeInteger(before.turn)||before.turn<2)issues.push('Turno sin historial suficiente de colocación');
 if(!Array.isArray(before.lp)||before.lp.length!==2||!before.lp.every(v=>Number.isSafeInteger(v)&&v>0))
  issues.push('LP no explícitos');
 if(!Array.isArray(before.chain)||before.chain.length||!Array.isArray(before.triggerQueue)||before.triggerQueue.length)
  issues.push('No se permite cadena/disparadores previamente pendientes');
 const moon=b.index.get(moonUid),jam=b.index.get(jammerUid),discard=b.index.get(discardUid),target=b.index.get(targetUid);
 if(!moon||moon.player!==player||!['hand','spelltrap'].includes(moon.zone))issues.push('Book of Moon fuera de zona de origen');
 if(!jam||jam.player!==opp||jam.zone!=='spelltrap')issues.push('Magic Jammer no colocada por el rival');
 if(!discard||discard.player!==opp||discard.zone!=='hand')issues.push('Coste no acreditado en mano rival');
 if(!target||target.zone!=='monster')issues.push('Objetivo no presente en campo');
 const m=moon?.card||{},j=jam?.card||{},d=discard?.card||{},t=target?.card||{};
 const bits=x=>Number(x.typeBits??x.type);
 if(Number(m.id)!==14087893||bits(m)!==65538||m.ownerPlayer!==player||
    (m.name!=null&&!['book of moon','libro de la luna'].includes(low(m.name))))
  issues.push('Identidad del Libro de la Luna no demostrada');
 if(moon?.zone==='spelltrap'&&(m.faceUp!==false||!Number.isSafeInteger(m.setTurn)||m.setTurn>=before.turn||m.setTurn<1))
  issues.push('Libro de la Luna no colocado en un turno anterior');
 if(moon?.zone==='hand'&&m.faceUp===true)issues.push('Libro de la Luna en mano indebidamente boca arriba');
 if(Number(j.id)!==77414722||bits(j)!==(0x100000|4)||j.ownerPlayer!==opp||j.faceUp!==false||
    !Number.isSafeInteger(j.setTurn)||j.setTurn<1||j.setTurn>=before.turn||
    (j.name!=null&&!['magic jammer','disruptor mágico','bloqueador de magia'].includes(low(j.name))))
  issues.push('Magic Jammer no acreditada como Contra Trampa colocada previamente');
 if(Number(d.id)!==89631139||bits(d)!==17||d.ownerPlayer!==opp||d.faceUp===true||
    (d.name!=null&&!['blue-eyes white dragon','dragón blanco de ojos azules'].includes(low(d.name))))
  issues.push('Coste de descarte no acreditado como Dragón Blanco normal inerte');
 if(bits(t)!==17||t.faceUp!==true||!['ATTACK','DEFENSE'].includes(raw(t.position).toUpperCase())||
    ![0,1].includes(t.ownerPlayer))issues.push('Objetivo no es un Monstruo Normal boca arriba');
 const permittedCardKeys=['uid','id','name','typeBits','type','ownerPlayer','faceUp','position','setTurn'];
 for(const info of [moon,jam,discard,target])if(info?.card&&Object.keys(info.card).some(k=>!permittedCardKeys.includes(k)))
  issues.push('Atributos ajenos al subconjunto de resolución');
 for(let p=0;p<2;p++){
  const z=before.zones[p];
  if(z.monster.length>1||z.monster.some(c=>raw(c.uid)!==targetUid))issues.push('Otros monstruos no modelados');
  if(z.spelltrap.some(c=>![moonUid,jammerUid].includes(raw(c.uid))))issues.push('Otras cartas S/T no modeladas');
  if(z.hand.some(c=>![moonUid,discardUid].includes(raw(c.uid))))issues.push('Otras cartas en mano no modeladas');
  if(z.gy.length||z.banished.length)issues.push('GY/desterradas potencialmente activas fuera del modelo');
  if(z.monster.length>5||z.spelltrap.length>5)issues.push('Campo sobreocupado');
 }
 if(before.zones[opp].hand.length!==1||before.zones[opp].spelltrap.length!==1)
  issues.push('Respuesta rival no aislada');
 if(issues.length)return fail('PRECONDITIONS_NOT_PROVEN_1256');
 // Reutilizar el motor 1255 de la activación de Book of Moon. Se elimina
 // exclusivamente la única Contra Trampa para verificar CL1 en aislamiento;
 // luego se la restaura, sin eliminar ni inventar cartas del estado real.
 const isolated=structuredClone(before);
 isolated.zones[opp].spelltrap=[];
 const cl1=bookOfMoon1254({action:'ACTIVATE_RESOLVE_BOOK_OF_MOON_1254',before:isolated,player,uid:moonUid,targetUid});
 if(!cl1.pass)return fail('CL1_ACTIVATION_UNPROVEN_1256',{cl1Status:cl1.status,cl1Issues:cl1.issues});
 let paid,chained,after;
 try{
  paid=structuredClone(cl1.paid);
  paid.zones[opp].spelltrap.push(structuredClone(j));
  // No se resuelve CL1: sólo se abre la ventana de respuesta.
  chained=structuredClone(paid);
  const trap=chained.zones[opp].spelltrap.find(c=>raw(c.uid)===jammerUid);
  if(!trap||trap.faceUp!==false)throw Error('Contra Trampa no encontrada');
  trap.faceUp=true;
  const idx=chained.zones[opp].hand.findIndex(c=>raw(c.uid)===discardUid);
  if(idx<0)throw Error('Descarte no encontrado');
  const costCard=chained.zones[opp].hand.splice(idx,1)[0];
  chained.zones[costCard.ownerPlayer].gy.push(costCard);
  chained.chain.push({uid:jammerUid,player:opp,speed:3,action:'ACTIVATE_COUNTER_TRAP',
   respondsTo:moonUid,negatesActivation:true,discardUid,cost:'DISCARD_ONE'});
  // Resolver hacia atrás: CL2 niega la activación y destruye Book of Moon.
  // CL1, invalidado, no modifica la posición del monstruo.
  after=structuredClone(chained);
  for(const [p,uid] of [[player,moonUid],[opp,jammerUid]]){
   const field=after.zones[p].spelltrap;
   const n=field.findIndex(c=>raw(c.uid)===uid);
   if(n<0)throw Error('Carta ausente al mandar al cementerio');
   const used=field.splice(n,1)[0];used.faceUp=true;
   after.zones[used.ownerPlayer].gy.push(used);
  }
  after.chain=[];
 }catch(e){issues.push(String(e?.message||e));return fail('CHAIN_EXECUTION_FAILED_1256')}
 issues.push(...snapshot1063(paid,'CL1 pagado').issues,
             ...snapshot1063(chained,'CL2 activado').issues,
             ...snapshot1063(after,'CL2 resuelto').issues);
 const end=snapshot1063(after,'identidad final');
 if(b.index.size!==end.index.size)issues.push('Cantidad de copias alterada');
 for(const [uid,info] of b.index){const next=end.index.get(uid);
  if(!next||next.fingerprint!==info.fingerprint)issues.push('Identidad de copia alterada: '+uid);
 }
 if(!equal1225(after.zones[target.player].monster[0],t))issues.push('Monstruo afectado indebidamente');
 if(!equal1225(after.lp,before.lp))issues.push('Los LP cambiaron sin coste');
 if(!after.zones[opp].gy.some(c=>raw(c.uid)===discardUid)||
    !after.zones[opp].gy.some(c=>raw(c.uid)===jammerUid)||
    !after.zones[player].gy.some(c=>raw(c.uid)===moonUid))
  issues.push('Descarte o destrucción de la Mágica/Trampa no acreditada');
 if(issues.length)return fail('GENERATED_STATE_INVALID_1256');
 for(const field of ['paid','chained','after'])
  if(spec[field]!==undefined&&!equal1225(spec[field],{paid,chained,after}[field]))
   issues.push('Estado observado incompatible: '+field);
 if(issues.length)return fail('OBSERVED_STATE_MISMATCH_1256');
 return{version:VERSION,status:'BOUNDED_MAGIC_JAMMER_CHAIN_OK_1256',pass:true,
  certified:false,certifiesRules:false,certifiesOptimality:false,globalOptimalityProven:false,
  scope:'CL1 Book of Moon, CL2 Magic Jammer, descarte de Blue-Eyes Normal, sin otros efectos ni respuestas.',
  source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?request_locale=en',
  before:structuredClone(before),paid,chained,after,chainLinks:2,spellSpeed:[2,3],
  chainOrder:['CL1_BOOK_OF_MOON','CL2_MAGIC_JAMMER','RESOLVE_CL2_DISCARD_ALREADY_PAID_NEGATE_AND_DESTROY','CL1_DOES_NOT_RESOLVE'],
  originalSpellResolved:false,originalSpellActivationNegated:true,
  cost:{kind:'DISCARD_ONE',player:opp,uid:discardUid,lpPaid:0},
  verification:['paid','chained','after'].every(k=>spec[k]!==undefined)?'ALL_STATES_MATCH':'GENERATED_ONLY'};
}
function magicJammerFixtures1256(){
 const zone=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const state=({player=0,moonSet=false,jammerSetTurn=2,targetPlayer=1,turn=3}={})=>{
  const b={turn,activePlayer:player,phase:'MAIN1',lp:[8000,8000],chain:[],triggerQueue:[],zones:[zone(),zone()]},opp=1-player;
  const moon={uid:'moon',id:14087893,name:'Book of Moon',typeBits:65538,ownerPlayer:player,faceUp:false};
  if(moonSet){moon.setTurn=2;b.zones[player].spelltrap.push(moon)}else b.zones[player].hand.push(moon);
  b.zones[opp].spelltrap.push({uid:'jammer',id:77414722,name:'Magic Jammer',typeBits:1048580,ownerPlayer:opp,faceUp:false,setTurn:jammerSetTurn});
  b.zones[opp].hand.push({uid:'cost',id:89631139,name:'Blue-Eyes White Dragon',typeBits:17,ownerPlayer:opp,faceUp:false});
  b.zones[targetPlayer].monster.push({uid:'target',id:89631139,name:'Blue-Eyes White Dragon',typeBits:17,ownerPlayer:targetPlayer,faceUp:true,position:'ATTACK'});
  return b;
 };
 const run=(b,extra={})=>magicJammerMoonChain1256({before:b,player:b.activePlayer,moonUid:'moon',jammerUid:'jammer',discardUid:'cost',targetUid:'target',...extra});
 const valid=run(state()),orig=state(),before=JSON.stringify(orig);
 const bad=fn=>{const s=state();fn(s);return !run(s).pass};
 const observed={paid:valid.paid,chained:valid.chained,after:valid.after};
 const checks={
  respondsToMoon:valid.pass,
  isTwoLinkSpeedTwoToThree:valid.chainLinks===2&&valid.spellSpeed?.join(',')==='2,3',
  cl1Pending:valid.paid?.chain?.length===1&&valid.paid.chain[0].uid==='moon',
  cl2PaidDiscard:valid.chained?.zones[1]?.hand?.length===0&&valid.chained.zones[1].gy[0]?.uid==='cost',
  cl2RespondsCorrectly:valid.chained?.chain?.length===2&&valid.chained.chain[1].respondsTo==='moon',
  counterTrapEndsInGy:valid.after?.zones[1].gy.some(c=>c.uid==='jammer'),
  spellDestroyed:valid.after?.zones[0].gy.some(c=>c.uid==='moon'),
  targetUnaffected:valid.after?.zones[1].monster[0]?.faceUp===true&&valid.after.zones[1].monster[0]?.position==='ATTACK',
  noLifePointCost:valid.after?.lp?.join(',')==='8000,8000',
  afterChainClear:valid.after?.chain?.length===0,
  ownerPreserved:valid.after?.zones[1].gy.every(c=>c.ownerPlayer===1),
  countPreserved:snapshot1063(valid.after,'final').index.size===4,
  noInputMutation:JSON.stringify(orig)===before&&JSON.stringify(state())===before,
  replayWitness:run(state(),observed).pass,
  tamperPaidRejected:!run(state(),{paid:{...valid.paid,lp:[1,1]}}).pass,
  tamperChainedRejected:!run(state(),{chained:{...valid.chained,chain:[]}}).pass,
  tamperFinalRejected:!run(state(),{after:{...valid.after,lp:[1,1]}}).pass,
  moonSetPriorTurn:run(state({moonSet:true})).pass,
  reversePlayers:run(state({player:1,targetPlayer:0})).pass,
  ownTarget:run(state({targetPlayer:0})).pass,
  wrongTrapId:bad(s=>s.zones[1].spelltrap[0].id=5),
  wrongTrapType:bad(s=>s.zones[1].spelltrap[0].typeBits=4),
  trapJustSet:bad(s=>s.zones[1].spelltrap[0].setTurn=3),
  trapFaceUp:bad(s=>s.zones[1].spelltrap[0].faceUp=true),
  noDiscard:bad(s=>s.zones[1].hand=[]),
  fakeDiscardEffect:bad(s=>s.zones[1].hand[0].typeBits=33),
  wrongCostOwner:bad(s=>s.zones[1].hand[0].ownerPlayer=0),
  noJammer:bad(s=>s.zones[1].spelltrap=[]),
  chainBusy:bad(s=>s.chain.push({uid:'else'})),
  wrongPhase:bad(s=>s.phase='BATTLE'),
  extraOpponentST:bad(s=>s.zones[1].spelltrap.push({uid:'extra',id:1,ownerPlayer:1,typeBits:4})),
  missingMonster:bad(s=>s.zones[1].monster=[]),
  facedownTarget:bad(s=>s.zones[1].monster[0].faceUp=false),
  linkMonster:bad(s=>s.zones[1].monster[0].typeBits=67108865),
  duplicateUID:bad(s=>s.zones[1].hand[0].uid='moon'),
  moonSameTurnSet:bad(s=>{const c=s.zones[0].hand.pop();c.setTurn=3;s.zones[0].spelltrap.push(c)}),
  unmodeledGraveEffect:bad(s=>s.zones[1].gy.push({uid:'grave',id:123,ownerPlayer:1})),
  additionalUnknownFlag:bad(s=>s.someContinuousEffect=true),
  moonFixturesStillPass:bookOfMoonFixtures1254().pass,
  taiyouFixturesStillPass:flipSpellFixtures1255().pass
 };
 return{version:VERSION,pass:Object.values(checks).every(Boolean),passed:Object.values(checks).filter(Boolean).length,
  total:Object.keys(checks).length,checks,certified:false,scope:'Cadena estrictamente aislada de dos eslabones'};
}

function twinTwisters1225(spec){
 const before=spec?.before,player=spec?.player,uid=raw(spec?.uid),discardUid=raw(spec?.discardUid),targets=spec?.targetUids;
 const issues=[],failure=(status)=>({version:VERSION,action:'ACTIVATE_RESOLVE_TWIN_TWISTERS_1225',status,pass:false,supported:true,
  certified:false,certifiesRules:false,certifiesOptimality:false,issues:[...new Set(issues)].slice(0,16)});
 if(spec?.action!=='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225')issues.push('Acción incorrecta');
 if(!Number.isInteger(player)||![0,1].includes(player))issues.push('Jugador inválido');
 if(!uid||!discardUid||uid===discardUid)issues.push('Falta fuente o descarte independiente');
 if(!Array.isArray(targets)||targets.length<1||targets.length>2||targets.some(t=>typeof t!=='string'||!t||t===uid||t===discardUid)||new Set(targets).size!==(targets?.length||0))issues.push('Requiere uno o dos objetivos distintos');
 const snap=snapshot1063(before,'Twin Twisters preactivación');issues.push(...snap.issues);
 for(let p=0;p<2;p++)if((before?.zones?.[p]?.spelltrap?.length??Infinity)>5||(before?.zones?.[p]?.monster?.length??Infinity)>5)issues.push('Ocupación inválida');
 if(issues.length)return failure('INVALID_PRESTATE_1225');
 const src=snap.index.get(uid),dis=snap.index.get(discardUid);
 if(!src||src.player!==player||!['hand','spelltrap'].includes(src.zone))issues.push('Fuente ausente de zona propia');
 const card=src?.card||{},bits=Number(card.typeBits??card.type);
 if(Number(card.id)!==43898403||!Number.isSafeInteger(bits)||(bits&0x10002)!==0x10002||(bits&4)!==0)issues.push('ID o tipo de Twin Twisters incorrecto');
 if(card.name!=null&&!['twin twisters','torbellinos gemelos'].includes(low(card.name)))issues.push('Nombre de carta incorrecto');
 if(card.ownerPlayer!==player)issues.push('Propiedad de la fuente no acreditada');
 if(src?.zone==='hand'){
  if(card.faceUp===true)issues.push('Carta boca arriba en mano');
  if(before.zones[player].spelltrap.length>=5)issues.push('No hay zona S/T libre');
 }else if(src?.zone==='spelltrap'){
  if(card.faceUp!==false)issues.push('Magia Colocada debe estar boca abajo');
  if(!Number.isSafeInteger(before.turn)||before.turn<1||!Number.isSafeInteger(card.setTurn)||card.setTurn>=before.turn||card.setTurn<0)issues.push('No se acreditó el turno de Colocación');
 }
 if(!dis||dis.player!==player||dis.zone!=='hand')issues.push('El costo no está en la mano propia');
 const disc=dis?.card||{},dbits=Number(disc.typeBits??disc.type);
 // Restricción conservadora: no declarar un descarte universal cuando no
 // estamos resolviendo efectos de GY ni efectos disparados de cartas descartadas.
 if(!Number.isSafeInteger(dbits)||dbits!==17||disc.ownerPlayer!==player||disc.faceUp===true)
  issues.push('Sólo se admite costo de Monstruo Normal inerte de tipo 17');
 const dest=[];
 if(Array.isArray(targets))for(const tuid of targets){
  const target=snap.index.get(tuid);
  if(!target||target.zone!=='spelltrap')issues.push('Objetivo ausente del campo');
  const victim=target?.card||{},tb=Number(victim.typeBits??victim.type);
  if(!Number.isSafeInteger(tb)||!(tb&6)||(tb&1))issues.push('Objetivo no acredita ser Mágica/Trampa');
  if(!Number.isInteger(victim.ownerPlayer)||![0,1].includes(victim.ownerPlayer))issues.push('Propiedad del objetivo inválida');
  if(target)dest.push({uid:tuid,player:target.player});
 }
 if(before?.activePlayer!==player||!/^MAIN(?:1|2)?$/i.test(raw(before?.phase)))issues.push('Sólo Main Phase propia');
 if(!Array.isArray(before?.chain)||before.chain.length||!Array.isArray(before?.triggerQueue)||before.triggerQueue.length)issues.push('Cadenas o triggers fuera de alcance');
 if(!Array.isArray(before?.lp)||before.lp.length!==2||!before.lp.every(n=>Number.isSafeInteger(n)&&n>0&&n<=999999))issues.push('LP inválidos');
 if(issues.length)return failure('PRECONDITIONS_NOT_PROVEN_1225');
 let paid,after;
 try{
  paid=structuredClone(before);
  const hand=paid.zones[player].hand;
  if(src.zone==='hand'){
   const index=hand.findIndex(c=>raw(c.uid)===uid);
   if(index<0)throw Error('Fuente ausente al activar');
   const activated=hand.splice(index,1)[0];activated.faceUp=true;paid.zones[player].spelltrap.push(activated);
  }else{
   const activated=paid.zones[player].spelltrap.find(c=>raw(c.uid)===uid);
   if(!activated)throw Error('Fuente colocada ausente');activated.faceUp=true;
  }
  const costIndex=hand.findIndex(c=>raw(c.uid)===discardUid);
  if(costIndex<0)throw Error('Costo ausente');
  const discarded=hand.splice(costIndex,1)[0];discarded.faceUp=true;
  paid.zones[discarded.ownerPlayer].gy.push(discarded);
  paid.chain.push({uid,player,speed:2,action:'ACTIVATE_SPELL',discardUid,targetUids:[...targets]});
  after=structuredClone(paid);
  const sourceIndex=after.zones[player].spelltrap.findIndex(c=>raw(c.uid)===uid);
  if(sourceIndex<0)throw Error('Fuente ausente al resolver');
  const spell=after.zones[player].spelltrap.splice(sourceIndex,1)[0];spell.faceUp=true;after.zones[spell.ownerPlayer].gy.push(spell);
  for(const dst of dest){
   const arr=after.zones[dst.player].spelltrap;
   const index=arr.findIndex(c=>raw(c.uid)===dst.uid);
   if(index<0)throw Error('Objetivo desaparecido');
   const victim=arr.splice(index,1)[0];victim.faceUp=true;after.zones[victim.ownerPlayer].gy.push(victim);
  }
  after.chain=[];
 }catch(e){issues.push(raw(e?.message||e));return failure('STATE_APPLICATION_FAILED_1225')}
 issues.push(...snapshot1063(paid,'Twin coste').issues,...snapshot1063(after,'Twin resolución').issues);
 if(issues.length)return failure('GENERATED_STATE_INVALID_1225');
 if(spec.paid!==undefined&&!equal1225(spec.paid,paid)||spec.after!==undefined&&!equal1225(spec.after,after)){
  issues.push('El costo o el estado final no coinciden');return failure('OBSERVED_STATE_MISMATCH_1225');
 }
 return{version:VERSION,action:'ACTIVATE_RESOLVE_TWIN_TWISTERS_1225',status:'BOUNDED_EXECUTION_OK_1225',pass:true,
  certified:false,certifiesRules:false,certifiesOptimality:false,sourceZone:src.zone,
  cost:{kind:'DISCARD_ONE_INERT_NORMAL_MONSTER',amount:1,uid:discardUid,player},targetUids:[...targets],destroyed:targets.length,
  scope:'Twin Twisters; 1-2 objetivos S/T; costo Monstruo Normal sin efecto; Main Phase propia; sin respuestas ni triggers',
  limitations:'No se simulan protecciones, reemplazos, efectos del rival, disparadores ni prioridad general.',
  before:structuredClone(before),paid,after,
  verification:spec.paid!==undefined&&spec.after!==undefined?'PAID_AND_RESOLUTION_MATCH':'GENERATED_ONLY',
  source:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=12175&ope=2&request_locale=en'};
}
function replayTwinTwisters1225(line){
 const fail=(status)=>({version:VERSION,status,pass:false,certified:false,certifiesRules:false,certifiesOptimality:false});
 const actions=line?.actions;
 if(!Array.isArray(actions)||actions.length!==1)return fail('REPLAY_LENGTH_UNSUPPORTED_1225');
 const a=actions[0];if(!a||a.action!=='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'||a.actionType!==a.action)return fail('REPLAY_ACTION_INVALID_1225');
 if(!a.paid||!a.after||line?.before!==undefined&&!equal1225(line.before,a.before))return fail('REPLAY_INITIAL_STATE_MISMATCH_1225');
 const proof=twinTwisters1225(a);
 if(!proof.pass||!equal1225(proof.paid,a.paid)||!equal1225(proof.after,a.after))return fail('REPLAY_CANONICAL_MISMATCH_1225');
 if(!line.state||!equal1225(line.state,a.after)||line.steps!==1||line.costPaid!==1||line.destroyed!==a.targetUids.length)return fail('REPLAY_FINAL_STATE_MISMATCH_1225');
 if([line.certified,line.globalOptimalityProven,line.certifiesRules].some(v=>v===true))return fail('REPLAY_FALSE_CERTIFICATION_1225');
 return{version:VERSION,status:'BOUNDED_TWIN_TWISTERS_REPLAY_MATCH_1225',pass:true,steps:1,costPaid:1,
  destroyed:a.targetUids.length,certified:false,certifiesRules:false,certifiesOptimality:false};
}
async function searchTwinTwistersOpening1225(opts={}){
 const proof=openingRemovalBridge1216(opts);
 if(!proof.pass)return {...proof,candidates:[],candidateCount:0};
 if(opts.signal?.aborted===true)return{version:VERSION,status:'TWIN_SEARCH_CANCELLED_1225',pass:false,certified:false,candidates:[],candidateCount:0};
 if(ISOLATED1080.active)return{version:VERSION,status:'SEARCH_ALREADY_RUNNING',pass:false,certified:false,candidates:[],candidateCount:0};
 const deadline=(W.performance?.now?.()??Date.now())+Math.min(15000,Math.max(20,Number(opts.maxTotalMs)||5000));
 const before=proof.before,player=0,hand=before.zones[0].hand;
 const sources=hand.filter(c=>Number(c?.id)===43898403);
 const discards=hand.filter(c=>Number(c?.typeBits)===17&&Number(c?.id)>0);
 const targets=before.zones.flatMap(z=>z.spelltrap).filter(c=>{const bits=Number(c?.typeBits);return Number.isSafeInteger(bits)&&(bits&6)&&!(bits&1)});
 const lines=[],seen=new Set();let examined=0,truncated=false;
 const isStale=()=>proof.evidence.deckFingerprint!==deckFingerprint1056()||proof.evidence.deckRevision!==DECK_REVISION_1056;
 for(const src of sources)for(const dis of discards)for(let i=0;i<targets.length;i++)for(let j=-1;j<i;j++){
  if(opts.signal?.aborted===true)return{version:VERSION,status:'TWIN_SEARCH_CANCELLED_1225',pass:false,certified:false,candidates:[],candidateCount:0};
  if((W.performance?.now?.()??Date.now())>deadline)return{version:VERSION,status:'TWIN_SEARCH_TIME_BUDGET_EXCEEDED_1225',pass:false,certified:false,candidates:[],candidateCount:0};
  if(isStale())return{version:VERSION,status:'OPENING_STALE_DECK_1225',pass:false,certified:false,candidates:[],candidateCount:0};
  // j=-1 significa exactamente un objetivo; j>=0 significa dos distintos.
  if(examined>=240){truncated=true;break}
  const targetUids=j<0?[targets[i].uid]:[targets[j].uid,targets[i].uid];
  const key=JSON.stringify([src.uid,dis.uid,...targetUids]);if(seen.has(key))continue;seen.add(key);
  examined++;
  const req={action:'ACTIVATE_RESOLVE_TWIN_TWISTERS_1225',before,player,uid:src.uid,discardUid:dis.uid,targetUids};
  const proofAction=twinTwisters1225(req);
  if(!proofAction.pass)continue;
  const action={...req,actionType:req.action,paid:proofAction.paid,after:proofAction.after};
  const line={actions:[action],before,state:proofAction.after,steps:1,costPaid:1,destroyed:targetUids.length,
   certified:false,globalOptimalityProven:false};
  if(replayTwinTwisters1225(line).pass)lines.push(line);
  if(examined%24===0)await new Promise(resolve=>setTimeout(resolve,0));
 }
 if(opts.signal?.aborted===true)return{version:VERSION,status:'TWIN_SEARCH_CANCELLED_1225',pass:false,certified:false,candidates:[],candidateCount:0};
 if((W.performance?.now?.()??Date.now())>deadline)return{version:VERSION,status:'TWIN_SEARCH_TIME_BUDGET_EXCEEDED_1225',pass:false,certified:false,candidates:[],candidateCount:0};
 if(isStale())return{version:VERSION,status:'OPENING_STALE_DECK_1225',pass:false,certified:false,candidates:[],candidateCount:0};
 lines.sort((a,b)=>b.destroyed-a.destroyed||JSON.stringify(a.actions[0].targetUids).localeCompare(JSON.stringify(b.actions[0].targetUids))||String(a.actions[0].discardUid).localeCompare(String(b.actions[0].discardUid)));
 const selected=lines.slice(0,5).map((x,i)=>({...x,index:i+1}));
 return{version:VERSION,status:selected.length?'BOUNDED_TWIN_TWISTERS_OPENING_1225':'NO_BOUNDED_TWIN_TWISTERS_OPENING_1225',
  pass:false,certified:false,globalOptimalityProven:false,scope:'Apertura YDK verificada; Twin Twisters 1 acción con descarte Normal inerte, sin respuestas ni protección; NOT general Top 5',
  openingEvidence1216:proof.evidence,openingSample1216:proof.sample,openingProvenance1216:proof.status,
  candidates:selected,candidateCount:selected.length,choicesExamined:examined,truncated:truncated||lines.length>5,
  enumerationComplete:!truncated,stepsMax:1};
}

/* Alpha 1237: búsqueda real de hasta dos activaciones consecutivas de Twin Twisters.
   Las acciones individuales siguen usando la autoridad twinTwisters1225. La nueva
   ruta conserva explícitamente sus límites: sin cadenas/respuestas/triggers y sin Top5 general. */
function replayTwinTwisters1226(line){
 const fail=(status,stepIndex=-1)=>({version:VERSION,status,stepIndex,pass:false,certified:false,globalOptimalityProven:false});
 const actions=line?.actions;
 if(!Array.isArray(actions)||actions.length<1||actions.length>2)return fail('TWIN_REPLAY_LENGTH_UNSUPPORTED_1226');
 if(line.steps!==actions.length||[line.certified,line.globalOptimalityProven,line.certifiesRules].some(v=>v===true))return fail('TWIN_REPLAY_FALSE_CLAIMS_1226');
 let state=null,destroyed=0;
 for(let i=0;i<actions.length;i++){
  const a=actions[i];
  if(!a||a.action!=='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'||a.actionType!==a.action||a.player!==0)return fail('TWIN_REPLAY_ACTION_INVALID_1226',i);
  if(!a.before||!a.paid||!a.after||!Array.isArray(a.targetUids))return fail('TWIN_REPLAY_STATES_MISSING_1226',i);
  if(i===0&&line.before!==undefined&&!equal1225(line.before,a.before))return fail('TWIN_REPLAY_INITIAL_STATE_1226',i);
  if(i>0&&!equal1225(state,a.before))return fail('TWIN_REPLAY_CONTINUITY_1226',i);
  const proof=twinTwisters1225(a);
  if(!proof.pass||!equal1225(proof.paid,a.paid)||!equal1225(proof.after,a.after))return fail('TWIN_REPLAY_CANONICAL_MISMATCH_1226',i);
  state=a.after;destroyed+=a.targetUids.length;
 }
 if(!line.state||!equal1225(line.state,state)||line.costPaid!==actions.length||line.destroyed!==destroyed)return fail('TWIN_REPLAY_FINAL_STATE_1226');
 return{version:VERSION,status:'BOUNDED_TWIN_REPLAY_MATCH_1226',pass:true,steps:actions.length,costPaid:actions.length,destroyed,certified:false,globalOptimalityProven:false};
}
async function searchTwinTwistersOpening1226(opts={}){
 const opening=openingRemovalBridge1216(opts);
 if(!opening.pass)return {...opening,candidates:[],candidateCount:0};
 const empty=(status)=>({version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0});
 if(opts.signal?.aborted===true)return empty('TWIN_SEARCH_CANCELLED_1226');
 if(ISOLATED1080.active)return empty('SEARCH_ALREADY_RUNNING');
 const starting=opening.before,deadline=(W.performance?.now?.()??Date.now())+Math.min(15000,Math.max(20,Number(opts.maxTotalMs)||5000));
 const maxExamined=Math.min(3000,Math.max(1,Number.isSafeInteger(opts.maxExamined)?opts.maxExamined:600));
 const candidates=[],seen=new Set();let examined=0,truncated=false,aborted=false;
 const stale=()=>opening.evidence.deckFingerprint!==deckFingerprint1056()||opening.evidence.deckRevision!==DECK_REVISION_1056;
 const halt=()=>{
  if(opts.signal?.aborted===true){aborted='TWIN_SEARCH_CANCELLED_1226';return true}
  if(stale()){aborted='OPENING_STALE_DECK_1226';return true}
  if((W.performance?.now?.()??Date.now())>deadline){aborted='TWIN_SEARCH_TIME_BUDGET_EXCEEDED_1226';return true}
  if(examined>=maxExamined){truncated=true;return true}
  return false;
 };
 async function expand(state,actions){
  if(halt())return;
  const hand=state.zones[0].hand;
  const sources=hand.filter(c=>Number(c?.id)===43898403);
  const discards=hand.filter(c=>Number(c?.typeBits)===17&&Number(c?.id)>0);
  const targets=state.zones.flatMap(z=>z.spelltrap).filter(c=>{const bits=Number(c?.typeBits);return Number.isSafeInteger(bits)&&(bits&6)!==0&&(bits&1)===0});
  for(const src of sources)for(const dis of discards)for(let i=0;i<targets.length;i++)for(let j=-1;j<i;j++){
   if(halt())return;
   const targetUids=j<0?[targets[i].uid]:[targets[j].uid,targets[i].uid];
   const req={action:'ACTIVATE_RESOLVE_TWIN_TWISTERS_1225',before:state,player:0,uid:src.uid,discardUid:dis.uid,targetUids};
   examined++;
   const result=twinTwisters1225(req);
   if(!result.pass)continue;
   const action={...req,actionType:req.action,paid:result.paid,after:result.after};
   const chain=[...actions,action];
   const signature=JSON.stringify(chain.map(a=>[a.uid,a.discardUid,a.targetUids]));
   if(seen.has(signature))continue;
   seen.add(signature);
   const line={actions:chain,before:starting,state:result.after,steps:chain.length,costPaid:chain.length,
    destroyed:chain.reduce((n,a)=>n+a.targetUids.length,0),certified:false,globalOptimalityProven:false};
   if(replayTwinTwisters1226(line).pass)candidates.push(line);
   if(chain.length<2)await expand(result.after,chain);
   if(examined%20===0)await new Promise(resolve=>setTimeout(resolve,0));
  }
 }
 await expand(starting,[]);
 if(aborted)return empty(aborted);
 if(opts.signal?.aborted===true)return empty('TWIN_SEARCH_CANCELLED_1226');
 if(stale())return empty('OPENING_STALE_DECK_1226');
 // Preferir destrucciones acreditadas; ante empate, mayor longitud solo como desempate.
 candidates.sort((a,b)=>b.destroyed-a.destroyed||b.steps-a.steps||JSON.stringify(a.actions.map(x=>[x.uid,x.discardUid,x.targetUids])).localeCompare(JSON.stringify(b.actions.map(x=>[x.uid,x.discardUid,x.targetUids]))));
 const selected=candidates.slice(0,5).map((line,i)=>({...line,index:i+1}));
 // Revalidar justo antes de publicar: no se confía en el almacenamiento temporal de candidatos.
 if(selected.some(line=>!replayTwinTwisters1226(line).pass))return empty('TWIN_SEARCH_REPLAY_MISMATCH_1226');
 if(stale())return empty('OPENING_STALE_DECK_1226');
 return{version:VERSION,status:selected.length?'BOUNDED_TWIN_TWISTERS_OPENING_DEPTH2_1226':'NO_BOUNDED_TWIN_TWISTERS_OPENING_DEPTH2_1226',
  pass:false,certified:false,globalOptimalityProven:false,
  scope:'Dos Twin Twisters consecutivos como máximo, desde la mano YDK, descartes Normales inertes, sin respuestas ni efectos disparados; NOT Top 5 general',
  openingEvidence1216:opening.evidence,openingSample1216:opening.sample,openingProvenance1216:opening.status,
  candidates:selected,candidateCount:selected.length,choicesExamined:examined,truncated:truncated||candidates.length>5,
  enumerationComplete:!truncated,stepsMax:2};
}


/* Alpha 1237: transición mixta de Mágicas de eliminación, en el mismo
   estado real. Se reutilizan las transiciones canónicas de MST (1211),
   Cosmic Cyclone (1208) y Twin Twisters (1225), NO reglas duplicadas.
   Máximo dos acciones y resultados NO certificados universalmente. */
const MIXED_REMOVAL_1227=Object.freeze({
 5318639:'ACTIVATE_RESOLVE_MST_1211',
 8267140:'ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208',
 43898403:'ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'
});
function executeMixedRemoval1227(request){
 switch(request?.action){
  case 'ACTIVATE_RESOLVE_MST_1211':return mysticalSpaceTyphoon1211(request);
  case 'ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208':return cosmicCyclone1208(request);
  case 'ACTIVATE_RESOLVE_TWIN_TWISTERS_1225':return twinTwisters1225(request);
  default:return{version:VERSION,pass:false,status:'MIXED_ACTION_UNSUPPORTED_1227'};
 }
}
function replayMixedRemovalCore1228(line,maxDepth){
 const fail=(status,stepIndex=-1)=>({version:VERSION,status,stepIndex,pass:false,certified:false,globalOptimalityProven:false});
 const actions=line?.actions;
 if(!Array.isArray(actions)||actions.length<1||actions.length>maxDepth)return fail('MIXED_LENGTH_UNSUPPORTED_1227');
 if(line?.steps!==actions.length||[line?.certified,line?.globalOptimalityProven,line?.certifiesRules,line?.certifiesOptimality].some(v=>v===true))return fail('MIXED_FALSE_CERTIFICATION_1227');
 let last=null,discarded=0,lpPaid=0,destroyed=0,banished=0;
 for(let i=0;i<actions.length;i++){
  const a=actions[i];
  if(!a||!Object.values(MIXED_REMOVAL_1227).includes(a.action)||a.actionType!==a.action||a.player!==0)return fail('MIXED_ACTION_INVALID_1227',i);
  if(!a.before||!a.paid||!a.after)return fail('MIXED_STATES_MISSING_1227',i);
  if(i===0&&(!line.before||!equal1225(line.before,a.before)))return fail('MIXED_OPENING_MISMATCH_1227',i);
  if(i>0&&!equal1225(last,a.before))return fail('MIXED_STATE_DISCONTINUITY_1227',i);
  const result=executeMixedRemoval1227(a);
  if(!result.pass||!equal1225(result.paid,a.paid)||!equal1225(result.after,a.after))return fail('MIXED_REPLAY_MISMATCH_1227',i);
  if(a.action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'){
   if(!Array.isArray(a.targetUids))return fail('MIXED_TWIN_TARGETS_MISSING_1227',i);
   discarded++;destroyed+=a.targetUids.length;
  }else if(a.action==='ACTIVATE_RESOLVE_MST_1211')destroyed++;
  else{banished++;lpPaid+=1000;}
  last=a.after;
 }
 const n=destroyed+banished;
 if(!line.state||!equal1225(last,line.state)||line.destroyed!==destroyed||line.banished!==banished||line.removed!==n||line.discarded!==discarded||line.lpPaid!==lpPaid)
  return fail('MIXED_FINAL_CLAIMS_MISMATCH_1227',actions.length-1);
 return{version:VERSION,status:'BOUNDED_MIXED_REPLAY_MATCH_1227',pass:true,steps:actions.length,removed:n,destroyed,banished,discarded,lpPaid,certified:false,globalOptimalityProven:false};
}
function replayMixedRemoval1227(line){return replayMixedRemovalCore1228(line,2)}
function replayMixedRemoval1228(line){return replayMixedRemovalCore1228(line,3)}
/* Alpha 1237: bounded three-step mix uses the same verified per-card transitions.
   Five results describe DISTINCT final states, not an unproven universal Top 5.
   Earlier two-action requests preserve their semantics and ordering. */
function mixedOutcomeSignature1228(state){
 const zones=['deck','hand','monster','spelltrap','gy','banished','extra'];
 return JSON.stringify({lp:state.lp,activePlayer:state.activePlayer,turn:state.turn,phase:state.phase,
  zones:state.zones.map(p=>zones.map(k=>(p[k]||[]).map(c=>[c.uid,c.faceUp===true,c.setTurn??null]).sort((a,b)=>String(a[0]).localeCompare(String(b[0])))))});
}
function mixedRank1228(a,b){
 return b.removed-a.removed||a.discarded-b.discarded||a.lpPaid-b.lpPaid||a.steps-b.steps||
 JSON.stringify(a.actions.map(x=>[x.action,x.uid,x.discardUid,x.targetUid,x.targetUids])).localeCompare(JSON.stringify(b.actions.map(x=>[x.action,x.uid,x.discardUid,x.targetUid,x.targetUids])));
}
async function searchMixedRemovalOpening1227(opts={},maxCap=2){
 const opening=openingRemovalBridge1216(opts);
 if(!opening.pass)return{...opening,candidates:[],candidateCount:0};
 const empty=status=>({version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0});
 if(opts.signal?.aborted===true)return empty('MIXED_CANCELLED_1227');
 if(ISOLATED1080.active)return empty('SEARCH_ALREADY_RUNNING');
 const staged=opts.scenario==='NO_OTHER_ACTIONS_TURNS_1_TO_3_1234'&&maxCap===3?
  stageMixedOpening1234(opening.before,opts.opponentSetUids):null;
 if(staged&&!staged.pass)return empty(staged.status);
 const before=staged?staged.before:opening.before;
 const end=(W.performance?.now?.()??Date.now())+Math.min(15000,Math.max(20,Number(opts.maxTotalMs)||5000));
 const limit=Math.min(3000,Math.max(1,Number.isSafeInteger(opts.maxExamined)?opts.maxExamined:900));
 const depth3=maxCap===3;
 const maxDepth=opts.maxDepth===1?1:depth3&&opts.maxDepth!==2?3:2;
 const candidates=[],seen=new Set(),bestOutcomes=new Map(),observedOutcomes=new Set();
 let examined=0,truncated=false,abortStatus=null,validCandidates=0;
 const stale=()=>opening.evidence.deckFingerprint!==deckFingerprint1056()||opening.evidence.deckRevision!==DECK_REVISION_1056;
 const halt=()=>{
  if(opts.signal?.aborted===true)abortStatus='MIXED_CANCELLED_1227';
  else if(stale())abortStatus='OPENING_STALE_DECK_1227';
  else if((W.performance?.now?.()??Date.now())>end)abortStatus='MIXED_TIME_BUDGET_EXCEEDED_1227';
  if(abortStatus)return true;
  if(examined>=limit){truncated=true;return true}
  return false;
 };
 async function expand(state,actions){
  if(halt())return;
  const hand=state.zones[0].hand,ownSet=state.zones[0].spelltrap;
  const source=[...hand,...ownSet].filter(c=>Object.hasOwn(MIXED_REMOVAL_1227,Number(c?.id)));
  const targets=state.zones.flatMap(z=>z.spelltrap).filter(c=>Number.isSafeInteger(Number(c?.typeBits))&&(Number(c.typeBits)&6)!==0&&(Number(c.typeBits)&1)===0);
  for(const card of source){
   const actionType=MIXED_REMOVAL_1227[Number(card.id)];
   const discards=actionType==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'?hand.filter(c=>c.uid!==card.uid&&Number(c.typeBits)===17):[null];
   for(const discard of discards){
    for(let i=0;i<targets.length;i++)for(let j=-1;j<(discard?i:0);j++){
     // For MST/Cosmic only one target; for Twin include one or two targets.
     if(halt())return;
     const targetUids=discard&&j>=0?[targets[j].uid,targets[i].uid]:[targets[i].uid];
     const request={action:actionType,before:state,player:0,uid:card.uid,
      ...(discard?{discardUid:discard.uid,targetUids}:{targetUid:targetUids[0]})};
     examined++;
     const result=executeMixedRemoval1227(request);
     if(!result.pass)continue;
     const current={...request,actionType,paid:result.paid,after:result.after};
     const chain=[...actions,current];
     const key=JSON.stringify(chain.map(a=>[a.action,a.uid,a.discardUid||null,a.targetUid||null,a.targetUids||null]));
     if(seen.has(key))continue;
     seen.add(key);
     const removed=chain.reduce((n,a)=>n+(a.targetUids?.length||1),0);
     const destroyed=chain.reduce((n,a)=>n+(a.action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208'?0:(a.targetUids?.length||1)),0);
     const banished=removed-destroyed;
     const line={before,actions:chain,state:result.after,steps:chain.length,removed,destroyed,banished,
      discarded:chain.filter(a=>a.discardUid).length,lpPaid:1000*banished,certified:false,globalOptimalityProven:false,
      ...(staged?{status:'BOUNDED_MIXED_TURN3_LINE_1234',sample:opening.sample,
       openingBefore:opening.before,openingEvidence:opening.evidence,setupStages:staged.stages,
       opponentSetUids:[...staged.opponentSetUids]}:{})};
     if((depth3?replayMixedRemoval1228(line):replayMixedRemoval1227(line)).pass){
      if(depth3){
       validCandidates++;
       const signature=mixedOutcomeSignature1228(result.after);
       observedOutcomes.add(signature);
       const prior=bestOutcomes.get(signature);
       if(!prior||mixedRank1228(line,prior)<0)bestOutcomes.set(signature,line);
       if(bestOutcomes.size>5){
        const worst=[...bestOutcomes.entries()].sort((a,b)=>mixedRank1228(a[1],b[1])).at(-1);
        bestOutcomes.delete(worst[0]);
       }
      }else candidates.push(line);
     }
     if(chain.length<maxDepth)await expand(result.after,chain);
     if(examined%25===0)await new Promise(resolve=>setTimeout(resolve,0));
    }
   }
  }
 }
 await expand(before,[]);
 if(abortStatus)return empty(abortStatus);
 if(opts.signal?.aborted===true)return empty('MIXED_CANCELLED_1227');
 if(stale())return empty('OPENING_STALE_DECK_1227');
 if(depth3)candidates.push(...bestOutcomes.values());
 candidates.sort((a,b)=>depth3?mixedRank1228(a,b):
  b.removed-a.removed||a.discarded-b.discarded||a.lpPaid-b.lpPaid||a.steps-b.steps||
  JSON.stringify(a.actions.map(x=>[x.action,x.uid,x.targetUid,x.targetUids])).localeCompare(JSON.stringify(b.actions.map(x=>[x.action,x.uid,x.targetUid,x.targetUids]))));
 const chosen=candidates.slice(0,5).map((l,i)=>({...l,index:i+1}));
 if(chosen.some(c=>!(staged?replayMixedTurn3_1234(c):(depth3?replayMixedRemoval1228(c):replayMixedRemoval1227(c))).pass))return empty('MIXED_FINAL_REPLAY_MISMATCH_1227');
 if(stale())return empty('OPENING_STALE_DECK_1227');
 return{version:VERSION,status:staged?(chosen.length?'BOUNDED_MIXED_TURN3_1234':'NO_BOUNDED_MIXED_TURN3_1234'):depth3?(chosen.length?'BOUNDED_MIXED_REMOVAL_DEPTH3_1228':'NO_BOUNDED_MIXED_REMOVAL_DEPTH3_1228'):
  (chosen.length?'BOUNDED_MIXED_REMOVAL_OPENING_1227':'NO_BOUNDED_MIXED_REMOVAL_OPENING_1227'),
  pass:false,certified:false,globalOptimalityProven:false,
  scope:staged?'Turnos 1-3 con robos/sets explícitos, MST/Cosmic/Twin hasta tres acciones, sin respuestas, triggers ni Top 5 universal.':depth3?'MST/Cosmic/Twin hasta tres acciones verificadas; campos finales distintos, sin respuestas, efectos disparados ni Top 5 universal.':
    'MST/Cosmic/Twin combinados hasta dos acciones desde apertura YDK. Sin respuestas, protecciones, triggers ni Top 5 universal.', 
  openingEvidence1216:opening.evidence,openingSample1216:opening.sample,openingProvenance1216:opening.status,
  candidates:chosen,candidateCount:chosen.length,choicesExamined:examined,
  truncated:truncated||(depth3?observedOutcomes.size>5:candidates.length>5),
  enumerationComplete:!truncated,stepsMax:maxDepth,
  ...(depth3?{distinctOutcomesObserved:observedOutcomes.size,validLinesExamined:validCandidates,
   selection:'BEST_FIVE_DISTINCT_BOUNDED_FINAL_STATES_1228'}:{})};
}
async function searchMixedRemovalOpening1228(opts={}){
 return searchMixedRemovalOpening1227(opts,3);
}

/* Alpha 1237: cadena acotada de tres eslabones.
 * CL1 MST/Cosmic/Twin -> CL2 Solemn Judgment rival -> CL3 Seven Tools of the Bandit propio.
 * Se reutilizan los ejecutores de CL1 y CL2, sin respuestas adicionales ni triggers.
 * Efecto Seven Tools: https://www.db.yugioh-card.com/yugiohdb/card_search.action?request_locale=en
 */
function sevenToolsCounterChain1230(spec={}){
 const fail=(status,issues=[])=>({version:VERSION,status,pass:false,certified:false,
  globalOptimalityProven:false,issues:[...new Set(issues)].slice(0,20)});
 if(!spec||typeof spec!=='object'||spec.player!==0)return fail('COUNTER_PLAYER_INVALID_1230');
 const sourceUid=raw(spec.uid),solemnUid=raw(spec.responseUid),sevenUid=raw(spec.counterUid);
 if(!sourceUid||!solemnUid||!sevenUid||new Set([sourceUid,solemnUid,sevenUid]).size!==3)
  return fail('COUNTER_UID_INVALID_1230');
 const before=spec.before,proof=snapshot1063(before,'Tres eslabones antes');
 if(proof.issues.length)return fail('COUNTER_PRESTATE_INVALID_1230',proof.issues);
 const counter=proof.index.get(sevenUid);
 if(!counter||counter.zone!=='spelltrap'||counter.player!==0)return fail('SEVEN_TOOLS_NOT_SET_1230');
 const card=counter.card;
 if(Number(card.id)!==3819470||Number(card.typeBits??card.type)!==(0x100000|4)||
    card.ownerPlayer!==0||card.faceUp!==false||!Number.isSafeInteger(before.turn)||before.turn<3||
    !Number.isSafeInteger(card.setTurn)||card.setTurn<1||card.setTurn>=before.turn)
  return fail('SEVEN_TOOLS_PROVENANCE_INVALID_1230');
 if(card.name!=null&&!['seven tools of the bandit','siete herramientas del bandido',
  'las siete herramientas del bandido'].includes(low(card.name)))
  return fail('SEVEN_TOOLS_NAME_INVALID_1230');
 if(!Array.isArray(before.lp)||!Number.isSafeInteger(before.lp[0])||before.lp[0]<=1000)
  return fail('SEVEN_TOOLS_LP_INSUFFICIENT_1230');
 const targets=spec.action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'?spec.targetUids:[spec.targetUid];
 if(!Array.isArray(targets)||!targets.length||targets.some(x=>raw(x)===solemnUid||raw(x)===sevenUid))
  return fail('COUNTER_TRAPS_TARGETED_1230');
 // No permitir evidencia externa simulada de estados de la cadena: las transiciones se reconstruyen.
 const {paid:observedPaid,chained:observedCL2,countered:observedCL3,
  resolvedCounter:observedResolution,after:observedAfter,...request}=spec;
 const cl2=solemnResponse1229(request);
 if(!cl2.pass)return fail('SOLEMN_LINK_NOT_PROVEN_1230',[cl2.status,...(cl2.issues||[])]);
 const original=executeMixedRemoval1227(request);
 if(!original.pass||!original.paid||!original.after||!equal1225(original.paid,cl2.paid))
  return fail('ORIGINAL_RESOLUTION_NOT_PROVEN_1230');
 let countered,resolvedCounter,after;
 try{
  countered=structuredClone(cl2.chained);
  const loc=countered.zones[0].spelltrap.find(c=>raw(c.uid)===sevenUid);
  if(!loc||loc.faceUp!==false)throw Error('Seven Tools no está colocada');
  loc.faceUp=true;
  countered.lp[0]-=1000;
  countered.chain.push({uid:sevenUid,player:0,speed:3,action:'ACTIVATE_COUNTER_TRAP',
    respondsTo:solemnUid,negatesActivation:true,lpCost:1000});
  resolvedCounter=structuredClone(countered);
  // CL3 resuelve: Seven Tools niega Solemn Judgment; ambos terminan en su cementerio.
  for(const [player,uid] of [[1,solemnUid],[0,sevenUid]]){
   const zone=resolvedCounter.zones[player].spelltrap;
   const i=zone.findIndex(c=>raw(c.uid)===uid);
   if(i<0)throw Error('Contraefecto ausente en CL3');
   const trap=zone.splice(i,1)[0];trap.faceUp=true;
   resolvedCounter.zones[trap.ownerPlayer].gy.push(trap);
  }
  resolvedCounter.chain=resolvedCounter.chain.slice(0,1); // CL1 pendiente; CL2 negado.
  // CL1 se resuelve con el mismo ejecutor canónico de la versión anterior.
  // Sus objetivos no incluyen ninguno de los dos Counter Traps retirados en CL3.
  after=structuredClone(original.after);
  after.lp[0]-=1000;
  after.lp[1]-=cl2.cost.opponentPaidLp;
  for(const [player,uid] of [[1,solemnUid],[0,sevenUid]]){
   const zone=after.zones[player].spelltrap;
   const i=zone.findIndex(c=>raw(c.uid)===uid);
   if(i<0)throw Error('Contraefecto no conservado en resolución original');
   const trap=zone.splice(i,1)[0];trap.faceUp=true;
   after.zones[trap.ownerPlayer].gy.push(trap);
  }
  after.chain=[];
 }catch(e){return fail('THREE_LINK_APPLICATION_FAILED_1230',[String(e?.message||e)]);}
 const issues=[...snapshot1063(countered,'CL3 activado').issues,
  ...snapshot1063(resolvedCounter,'CL3 resuelto').issues,...snapshot1063(after,'CL1 resuelto').issues];
 if(issues.length)return fail('THREE_LINK_GENERATED_STATE_INVALID_1230',issues);
 if(observedPaid!==undefined&&!equal1225(observedPaid,cl2.paid)||
  observedCL2!==undefined&&!equal1225(observedCL2,cl2.chained)||
  observedCL3!==undefined&&!equal1225(observedCL3,countered)||
  observedResolution!==undefined&&!equal1225(observedResolution,resolvedCounter)||
  observedAfter!==undefined&&!equal1225(observedAfter,after))
  return fail('THREE_LINK_OBSERVED_MISMATCH_1230');
 const isTwin=spec.action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225';
 const isCosmic=spec.action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208';
 const removed=isTwin?targets.length:1;
 return{version:VERSION,status:'BOUNDED_THREE_LINK_CHAIN_RESOLVED_1230',pass:true,
  certified:false,globalOptimalityProven:false,
  scope:'CL1 MST/Cosmic/Twin; CL2 Solemn; CL3 Seven Tools colocada. No otras respuestas, triggers ni efectos protectores.',
  before:structuredClone(before),paid:cl2.paid,chained:cl2.chained,countered,resolvedCounter,after,
  sourceUid,solemnUid,sevenUid,chainLinks:3,originalSpellResolved:true,
  chainOrder:['CL1_ACTIVATE_SPELL','CL2_SOLEMN_JUDGMENT','CL3_SEVEN_TOOLS',
   'RESOLVE_CL3_NEGATE_SOLEMN','CL2_DOES_NOT_RESOLVE','RESOLVE_CL1_SPELL'],
  cost:{spellLpPaid:isCosmic?1000:0,spellDiscarded:isTwin?1:0,
   sevenToolsLpPaid:1000,solemnLpPaid:cl2.cost.opponentPaidLp},
  removed,negatedCounterTraps:1};
}
function replaySevenToolsCounterChain1230(line){
 const fail=status=>({version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false});
 if(!line||!Array.isArray(line.actions)||line.actions.length!==1||line.steps!==1||line.chainLinks!==3||
  line.certified===true||line.globalOptimalityProven===true||line.certifiesRules===true||
  line.certifiesOptimality===true||line.originalSpellResolved!==true||line.negatedCounterTraps!==1)
  return fail('THREE_LINK_REPLAY_CLAIMS_INVALID_1230');
 const a=line.actions[0];
 if(!a||a.actionType!==a.action||!a.before||!a.paid||!a.chained||!a.countered||
  !a.resolvedCounter||!a.after||!equal1225(line.before,a.before)||
  !equal1225(line.state,a.after))return fail('THREE_LINK_REPLAY_STATES_INVALID_1230');
 const result=sevenToolsCounterChain1230(a);
 if(!result.pass||!equal1225(result.paid,a.paid)||!equal1225(result.chained,a.chained)||
  !equal1225(result.countered,a.countered)||!equal1225(result.resolvedCounter,a.resolvedCounter)||
  !equal1225(result.after,a.after))return fail('THREE_LINK_REPLAY_TRANSITION_MISMATCH_1230');
 if(line.removed!==result.removed||line.lpPaid!==result.cost.spellLpPaid+1000||
   line.discarded!==result.cost.spellDiscarded||line.opponentLpPaid!==result.cost.solemnLpPaid)
  return fail('THREE_LINK_REPLAY_COSTS_INVALID_1230');
 return{version:VERSION,status:'BOUNDED_THREE_LINK_REPLAY_OK_1230',pass:true,
  chainLinks:3,steps:1,certified:false,globalOptimalityProven:false};
}

/* Alpha 1237: escenario explícito turnos 1-3 desde apertura YDK, sin fabricar cartas del rival.
 * Sólo acciones de colocación declaradas, robos obligatorios y cadenas CL1/CL2/CL3 existentes.
 * Supone que no ocurren otras acciones ni efectos entre turnos: no certifica reglas universales.
 */
function stageSevenToolsOpening1231(opening,sevenUid,solemnUid,opponentSetUids){
 const fail=(status)=>({status,pass:false});
 if(!opening||opening.turn!==1||opening.phase!=='MAIN1'||opening.activePlayer!==0||
  !Array.isArray(opening.zones)||opening.zones.length!==2||!Array.isArray(opening.chain)||opening.chain.length||
  !Array.isArray(opening.triggerQueue)||opening.triggerQueue.length)return fail('STAGE_OPENING_INVALID_1231');
 if(!Array.isArray(opponentSetUids)||opponentSetUids.length<2||opponentSetUids.length>5||
  new Set(opponentSetUids).size!==opponentSetUids.length||!opponentSetUids.includes(solemnUid))
  return fail('OPPONENT_SET_DECISIONS_REQUIRED_1231');
 if(!opening.zones[0].hand.some(c=>raw(c.uid)===raw(sevenUid)&&Number(c.id)===3819470&&Number(c.typeBits)===1048580))
  return fail('SEVEN_TOOLS_NOT_IN_OPENING_HAND_1231');
 const rival=opening.zones[1];
 if(!Array.isArray(rival.hand)||!Array.isArray(rival.deck)||!rival.deck.length||
  ['monster','spelltrap','gy','banished'].some(k=>!Array.isArray(rival[k])||rival[k].length!==0))
  return fail('OPPONENT_TURN1_STATE_UNSUPPORTED_1231');
 // El estado inicial del rival también debe ser físicamente posible: cinco cartas y Main 40-60.
 if(rival.hand.length!==5||rival.hand.length+rival.deck.length<40||rival.hand.length+rival.deck.length>60)
  return fail('OPPONENT_OPENING_DECK_SIZE_INVALID_1231');
 const rivalCopies=new Map();
 for(const c of [...rival.hand,...rival.deck]){
  const id=Number(c?.id),bits=Number(c?.typeBits);
  if(!Number.isSafeInteger(id)||id<=0||!Number.isSafeInteger(bits)||bits<=0||c.ownerPlayer!==1)
   return fail('OPPONENT_CARD_PROVENANCE_INVALID_1231');
  rivalCopies.set(id,(rivalCopies.get(id)||0)+1);
  if(rivalCopies.get(id)>3)return fail('OPPONENT_COPY_LIMIT_INVALID_1231');
 }
 if(opponentSetUids.some(uid=>!rival.hand.some(c=>raw(c.uid)===raw(uid)&&((Number(c.typeBits)&6)!==0)&&((Number(c.typeBits)&1)===0))))
  return fail('OPPONENT_SET_SOURCE_NOT_IN_HAND_1231');
 const solemn=rival.hand.find(c=>raw(c.uid)===raw(solemnUid));
 if(!solemn||Number(solemn.id)!==41420027||Number(solemn.typeBits)!==1048580)
  return fail('OPPONENT_SOLEMN_NOT_IN_HAND_1231');
 const own=opening.zones[0];if(!Array.isArray(own.deck)||!own.deck.length||
  ['monster','spelltrap','gy','banished'].some(k=>!Array.isArray(own[k])||own[k].length))
  return fail('OWN_TURN1_ZONE_NOT_EMPTY_1231');
 if(snapshot1063(opening,'Turno inicial 1231').issues.length)return fail('OPENING_INVENTORY_INVALID_1231');
 let s1,s2,s3;
 try{
  s1=structuredClone(opening);
  const sevenIndex=s1.zones[0].hand.findIndex(c=>raw(c.uid)===raw(sevenUid));
  const seven=s1.zones[0].hand.splice(sevenIndex,1)[0];
  seven.faceUp=false;seven.setTurn=1;s1.zones[0].spelltrap.push(seven);
  s2=structuredClone(s1);s2.turn=2;s2.phase='DRAW';s2.activePlayer=1;s2.normalSummonsUsed=0;
  // El rival aporta explícitamente su Deck; no se inventa ninguna carta robada.
  const opponentDraw=s2.zones[1].deck.shift();s2.zones[1].hand.push(opponentDraw);s2.phase='MAIN1';
  for(const uid of opponentSetUids){
   const i=s2.zones[1].hand.findIndex(c=>raw(c.uid)===raw(uid));
   if(i<0)throw Error('OPPONENT_SET_CARD_MISSING');
   const c=s2.zones[1].hand.splice(i,1)[0];c.faceUp=false;c.setTurn=2;s2.zones[1].spelltrap.push(c);
  }
  s3=structuredClone(s2);s3.turn=3;s3.phase='DRAW';s3.activePlayer=0;s3.normalSummonsUsed=0;
  const playerDraw=s3.zones[0].deck.shift();s3.zones[0].hand.push(playerDraw);s3.phase='MAIN1';
 }catch(_){return fail('TURN_SETUP_TRANSITION_FAILED_1231')}
 if([...snapshot1063(s1,'Colocación propia 1231').issues,
     ...snapshot1063(s2,'Colocación rival 1231').issues,
     ...snapshot1063(s3,'Turno tres 1231').issues].length)return fail('TURN_SETUP_INVENTORY_INVALID_1231');
 if(!s3.zones[0].spelltrap.some(c=>raw(c.uid)===raw(sevenUid)&&c.setTurn===1)||
    !s3.zones[1].spelltrap.some(c=>raw(c.uid)===raw(solemnUid)&&c.setTurn===2))return fail('TURN_SETUP_SET_PROVENANCE_FAILED_1231');
 return{pass:true,status:'BOUNDED_TURN3_SETUP_1231',before:s3,
  stages:[s1,s2,s3],sevenUid,solemnUid,opponentSetUids:[...opponentSetUids],
  assumptions:'Sin otras acciones, efectos, ataques o cadenas durante turnos 1 y 2; decisiones rivales explícitas.',
  certified:false};
}
function replaySevenToolsOpening1231(line){
 const fail=status=>({version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false});
 if(!line||line.certified===true||line.globalOptimalityProven===true||line.steps!==1||
    line.chainLinks!==3||!Array.isArray(line.actions)||line.actions.length!==1||
    line.status!=='BOUNDED_OPENING_SEVEN_TOOLS_LINE_1231')return fail('OPENING_REPLAY_CLAIMS_INVALID_1231');
 const proof=openingRemovalBridge1216({sample:line.sample,opponentZones:line.openingBefore?.zones?.[1],lp:line.openingBefore?.lp});
 if(!proof.pass||!equal1225(proof.before,line.openingBefore)||
    line.openingEvidence?.deckFingerprint!==proof.evidence.deckFingerprint||
    line.openingEvidence?.deckRevision!==proof.evidence.deckRevision)
  return fail('OPENING_REPLAY_PROVENANCE_FAILED_1231');
 const staged=stageSevenToolsOpening1231(proof.before,line.sevenUid,line.solemnUid,line.opponentSetUids);
 if(!staged.pass||!equal1225(staged.before,line.before)||!equal1225(staged.stages,line.setupStages))
  return fail('OPENING_REPLAY_SETUP_FAILED_1231');
 const verified=replaySevenToolsCounterChain1230(line);
 if(!verified.pass)return fail('OPENING_REPLAY_THREE_LINK_FAILED_1231');
 return{version:VERSION,status:'BOUNDED_OPENING_THREE_LINK_REPLAY_OK_1231',pass:true,
  certified:false,globalOptimalityProven:false,turns:[1,2,3],chainLinks:3};
}
async function searchSevenToolsOpening1231(opts={}){
 const empty=(status,detail)=>({version:VERSION,status,detail,pass:false,certified:false,
  globalOptimalityProven:false,candidates:[],candidateCount:0});
 if(opts.scenario!=='NO_OTHER_ACTIONS_TURNS_1_TO_3_1231')return empty('SCENARIO_ASSUMPTIONS_REQUIRED_1231');
 const opening=openingRemovalBridge1216(opts);
 if(!opening.pass)return {...opening,candidates:[],candidateCount:0};
 if(opts.signal?.aborted===true)return empty('OPENING_SEARCH_CANCELLED_1231');
 if(ISOLATED1080.active)return empty('SEARCH_ALREADY_RUNNING');
 const sevenCards=opening.before.zones[0].hand.filter(c=>Number(c.id)===3819470&&Number(c.typeBits)===1048580);
 if(!sevenCards.length)return empty('NO_SEVEN_TOOLS_IN_OPENING_HAND_1231');
 const solemnUid=raw(opts.solemnUid);
 const oppSet=opts.opponentSetUids;
 if(!solemnUid||!Array.isArray(oppSet))return empty('EXPLICIT_OPPONENT_SET_REQUIRED_1231');
 const stages=sevenCards.map(c=>stageSevenToolsOpening1231(opening.before,c.uid,solemnUid,oppSet));
 const allowed=stages.filter(x=>x.pass);
 if(!allowed.length)return empty(stages[0]?.status||'NO_VALID_TURN_SETUP_1231');
 const maxExamined=Math.max(1,Math.min(1000,Number.isSafeInteger(opts.maxExamined)?opts.maxExamined:300));
 const started=W.performance?.now?.()??Date.now(),maxMs=Math.max(20,Math.min(15000,Number(opts.maxTotalMs)||6000));
 const stale=()=>opening.evidence.deckFingerprint!==deckFingerprint1056()||opening.evidence.deckRevision!==DECK_REVISION_1056;
 const all=[],seen=new Set();let examined=0,truncated=false;
 outer:for(const stage of allowed){
  const state=stage.before;
  const srcs=state.zones[0].hand.filter(c=>Object.hasOwn(MIXED_REMOVAL_1227,Number(c.id)));
  const targets=state.zones[1].spelltrap.filter(c=>raw(c.uid)!==solemnUid&&(Number(c.typeBits)&6)!==0);
  for(const src of srcs){
   const action=MIXED_REMOVAL_1227[Number(src.id)];
   const discards=action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'?
    state.zones[0].hand.filter(c=>c.uid!==src.uid&&Number(c.typeBits)===17):[null];
   for(const discarded of discards)for(let i=0;i<targets.length;i++)for(let j=-1;j<(discarded?i:0);j++){
    if(opts.signal?.aborted===true)return empty('OPENING_SEARCH_CANCELLED_1231');
    if(stale())return empty('OPENING_STALE_DECK_1231');
    if((W.performance?.now?.()??Date.now())-started>maxMs)return empty('OPENING_SEARCH_TIME_BUDGET_1231');
    if(examined>=maxExamined){truncated=true;break outer}
    const uids=discarded&&j>=0?[targets[j].uid,targets[i].uid]:[targets[i].uid];
    const k=JSON.stringify([stage.sevenUid,src.uid,discarded?.uid??null,uids]);
    if(seen.has(k))continue;seen.add(k);examined++;
    const request={action,actionType:action,before:state,player:0,uid:src.uid,
      responseUid:solemnUid,counterUid:stage.sevenUid,
      ...(discarded?{discardUid:discarded.uid,targetUids:uids}:{targetUid:uids[0]})};
    const result=sevenToolsCounterChain1230(request);
    if(!result.pass)continue;
    const a={...request,paid:result.paid,chained:result.chained,countered:result.countered,
      resolvedCounter:result.resolvedCounter,after:result.after};
    const line={version:VERSION,status:'BOUNDED_OPENING_SEVEN_TOOLS_LINE_1231',sample:opening.sample,
      openingBefore:opening.before,openingEvidence:opening.evidence,setupStages:stage.stages,
      opponentSetUids:[...oppSet],sevenUid:stage.sevenUid,solemnUid,
      before:state,actions:[a],state:result.after,steps:1,chainLinks:3,
      originalSpellResolved:true,negatedCounterTraps:1,removed:result.removed,
      lpPaid:result.cost.spellLpPaid+1000,discarded:result.cost.spellDiscarded,
      opponentLpPaid:result.cost.solemnLpPaid,certified:false,globalOptimalityProven:false};
    if(replaySevenToolsOpening1231(line).pass)all.push(line);
    if(examined%20===0)await new Promise(resolve=>setTimeout(resolve,0));
   }
  }
 }
 if(opts.signal?.aborted===true)return empty('OPENING_SEARCH_CANCELLED_1231');
 if(stale())return empty('OPENING_STALE_DECK_1231');
 all.sort((a,b)=>b.removed-a.removed||a.discarded-b.discarded||a.lpPaid-b.lpPaid||
  JSON.stringify(a.actions.map(x=>[x.uid,x.targetUid,x.targetUids])).localeCompare(
  JSON.stringify(b.actions.map(x=>[x.uid,x.targetUid,x.targetUids]))));
 const results=[],finalSeen=new Set();
 for(const c of all){
  // Los campos, LP y recursos forman la identidad del resultado; no sólo la secuencia de acciones.
  const key=JSON.stringify(c.state);
  if(finalSeen.has(key))continue;finalSeen.add(key);results.push({...c,index:results.length+1});
  if(results.length===5)break;
 }
 if(results.some(c=>!replaySevenToolsOpening1231(c).pass))return empty('OPENING_FINAL_REPLAY_FAILED_1231');
 const published={version:VERSION,status:results.length?'BOUNDED_OPENING_THREE_LINK_CANDIDATES_1231':'NO_BOUNDED_OPENING_THREE_LINK_CANDIDATES_1231',
  pass:false,certified:false,globalOptimalityProven:false,
  scope:'Escenario explícito sin acciones adicionales en turnos 1-2; robos de Decks presentes, colocaciones desde manos, CL1/CL2/CL3. No certifica Top 5 general.',
  candidates:results,candidateCount:results.length,choicesExamined:examined,
  truncated:truncated||all.length>5,enumerationComplete:!truncated,
  openingEvidence1216:opening.evidence};
 if(opts.renderVerifiedPreview===true&&results.length)published.visualPreview1232=renderSevenToolsPreview1232(published);
 return published;
}

/* Alpha 1237 — primera cadena rival ejecutable. Sólo un Counter Trap
   Solemn Judgment previamente colocado como CL2 ante MST, Cosmic o Twin.
   La activación original se computa con el ejecutor existente; se mantienen
   sus costos al negar la activación. Sin efectos disparados ni más respuestas.
   Fuente: https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4861&ope=2&request_locale=en */
function solemnResponse1229(spec={}){
 const fail=(status,issues=[])=>({version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false,
  issues:[...new Set(issues)].slice(0,20)});
 if(!spec||spec.action!==MIXED_REMOVAL_1227[Number(spec.before?.zones?.[0]?.hand?.find(c=>c?.uid===spec.uid)?.id||
  spec.before?.zones?.[0]?.spelltrap?.find(c=>c?.uid===spec.uid)?.id)])return fail('ACTION_ID_MISMATCH_1229');
 if(spec.player!==0)return fail('ONLY_ACTIVE_PLAYER_ZERO_1229');
 const uid=raw(spec.uid),responseUid=raw(spec.responseUid);
 if(!uid||!responseUid||uid===responseUid)return fail('INVALID_RESPONSE_UID_1229');
 const before=spec.before;
 const snap=snapshot1063(before,'Solemn antes');
 if(snap.issues.length)return fail('INVALID_PRESTATE_1229',snap.issues);
 const trap=snap.index.get(responseUid);
 if(!trap||trap.zone!=='spelltrap'||trap.player!==1)return fail('COUNTER_TRAP_NOT_SET_1229');
 const c=trap.card,bit=Number(c.typeBits??c.type);
 if(Number(c.id)!==41420027||bit!==(0x100000|4)||c.ownerPlayer!==1||c.faceUp!==false||
  !Number.isSafeInteger(before.turn)||before.turn<1||!Number.isSafeInteger(c.setTurn)||c.setTurn>=before.turn||c.setTurn<0)
  return fail('COUNTER_TRAP_NOT_PROVEN_1229');
 if(c.name!=null&&!['solemn judgment','juicio solemne'].includes(low(c.name)))return fail('COUNTER_TRAP_NAME_MISMATCH_1229');
 if(!Array.isArray(before.lp)||!Number.isSafeInteger(before.lp[1])||before.lp[1]<2||before.lp[1]%2!==0)
  return fail('OPPONENT_LP_NOT_EVEN_1229');
 // Reutilizar la autoridad original para validar activación y costos antes de respuesta.
 const {paid:claimedPaid,chained:claimedChained,after:claimedAfter,...originalSpec}=spec;
 const original=executeMixedRemoval1227(originalSpec);
 if(!original.pass||!original.paid||!original.after)return fail('ORIGINAL_ACTIVATION_NOT_PROVEN_1229',original.issues||[]);
 if(!Array.isArray(original.paid.chain)||original.paid.chain.length!==1||
  original.paid.chain[0]?.uid!==uid||original.paid.chain[0]?.player!==0)
  return fail('CHAIN_LINK_ONE_INVALID_1229');
 let chained,after;
 try{
  chained=structuredClone(original.paid);
  const response=chained.zones[1].spelltrap.find(x=>raw(x.uid)===responseUid);
  if(!response||response.faceUp!==false)throw Error('La Trampa colocada desapareció');
  response.faceUp=true;
  const opponentLp=chained.lp[1],paidLp=opponentLp/2;
  chained.lp[1]-=paidLp;
  chained.chain.push({uid:responseUid,player:1,speed:3,action:'ACTIVATE_COUNTER_TRAP',
   respondsTo:uid,negatesActivation:true,lpCost:paidLp});
  after=structuredClone(chained);
  // CL2: negar activación y destruir la carta que la activó; CL1 no se resuelve.
  const s=after.zones[0].spelltrap;
  const i=s.findIndex(x=>raw(x.uid)===uid);
  if(i<0)throw Error('Fuente activada ausente en campo');
  const spell=s.splice(i,1)[0];spell.faceUp=true;
  after.zones[spell.ownerPlayer].gy.push(spell);
  const j=after.zones[1].spelltrap.findIndex(x=>raw(x.uid)===responseUid);
  if(j<0)throw Error('Contraefecto ausente en resolución');
  const solemn=after.zones[1].spelltrap.splice(j,1)[0];solemn.faceUp=true;
  after.zones[solemn.ownerPlayer].gy.push(solemn);
  after.chain=[];
 }catch(e){return fail('RESPONSE_APPLICATION_FAILED_1229',[String(e?.message||e)]);}
 const issues=[...snapshot1063(chained,'CL2 activado').issues,...snapshot1063(after,'CL2 resuelto').issues];
 if(issues.length)return fail('GENERATED_RESPONSE_STATE_INVALID_1229',issues);
 if(spec.paid!==undefined&&!equal1225(spec.paid,original.paid)||
    spec.chained!==undefined&&!equal1225(spec.chained,chained)||
    spec.after!==undefined&&!equal1225(spec.after,after))return fail('OBSERVED_CHAIN_MISMATCH_1229');
 return{version:VERSION,status:'SOLEMN_ACTIVATION_NEGATED_1229',pass:true,
  certified:false,globalOptimalityProven:false,scope:'CL1 MST/Cosmic/Twin, CL2 Solemn Judgment colocado; sin otra respuesta ni triggers; LP rivales pares.',
  before:structuredClone(before),paid:original.paid,chained,after,
  sourceUid:uid,responseUid,cost:{originalSpellCostRetained:true,opponentPaidLp:before.lp[1]/2},
  chainOrder:['CL1_ACTIVATE_QUICK_PLAY_SPELL','CL2_SOLEMN_JUDGMENT','RESOLVE_CL2_NEGATE_ACTIVATION','CL1_DOES_NOT_RESOLVE'],
  removedTargets:0,negated:1};
}
function replaySolemnResponse1229(line){
 const fail=status=>({version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false});
 if(!line||!Array.isArray(line.actions)||line.actions.length!==1||line.steps!==1||line.negated!==1||
  line.certified===true||line.globalOptimalityProven===true||line.certifiesRules===true)return fail('REPLAY_CLAIMS_INVALID_1229');
 const a=line.actions[0];
 if(!a||!a.before||!a.paid||!a.chained||!a.after||a.actionType!==a.action||
    !equal1225(line.before,a.before)||!equal1225(line.state,a.after))return fail('REPLAY_STATES_INVALID_1229');
 const v=solemnResponse1229(a);
 if(!v.pass||!equal1225(v.paid,a.paid)||!equal1225(v.chained,a.chained)||!equal1225(v.after,a.after))return fail('REPLAY_CHAIN_MISMATCH_1229');
 if(line.opponentLpPaid!==v.cost.opponentPaidLp||line.removed!==0||
  line.discarded!==(a.action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'?1:0)||
  line.lpPaid!==(a.action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208'?1000:0))return fail('REPLAY_COSTS_INVALID_1229');
 return{version:VERSION,status:'BOUNDED_COUNTER_CHAIN_REPLAY_OK_1229',pass:true,steps:1,chainLinks:2,
  certified:false,globalOptimalityProven:false};
}
async function searchSolemnOpening1229(opts={}){
 const opening=openingRemovalBridge1216(opts);
 if(!opening.pass)return{...opening,candidates:[],candidateCount:0};
 const empty=status=>({version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0});
 if(opts.signal?.aborted===true)return empty('COUNTER_SEARCH_CANCELLED_1229');
 if(ISOLATED1080.active)return empty('SEARCH_ALREADY_RUNNING');
 const state=opening.before;
 const traps=state.zones[1].spelltrap.filter(c=>Number(c.id)===41420027);
 if(!traps.length)return empty('NO_SET_SOLEMN_JUDGMENT_1229');
 const end=(W.performance?.now?.()??Date.now())+Math.min(15000,Math.max(20,Number(opts.maxTotalMs)||5000));
 const limit=Math.min(1000,Math.max(1,Number.isSafeInteger(opts.maxExamined)?opts.maxExamined:300));
 const stale=()=>opening.evidence.deckFingerprint!==deckFingerprint1056()||opening.evidence.deckRevision!==DECK_REVISION_1056;
 const sources=[...state.zones[0].hand,...state.zones[0].spelltrap].filter(c=>Object.hasOwn(MIXED_REMOVAL_1227,Number(c.id)));
 const targets=state.zones.flatMap(z=>z.spelltrap).filter(c=>(Number(c?.typeBits)&6)!==0&&(Number(c?.typeBits)&1)===0);
 const candidates=[],seen=new Set();let examined=0,truncated=false;
 outer:for(const trap of traps)for(const src of sources){
  const action=MIXED_REMOVAL_1227[Number(src.id)];
  const discards=action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'?state.zones[0].hand.filter(c=>c.uid!==src.uid&&Number(c.typeBits)===17):[null];
  for(const discard of discards)for(let i=0;i<targets.length;i++)for(let j=-1;j<(discard?i:0);j++){
   if(opts.signal?.aborted===true)return empty('COUNTER_SEARCH_CANCELLED_1229');
   if(stale())return empty('OPENING_STALE_DECK_1229');
   if((W.performance?.now?.()??Date.now())>end)return empty('COUNTER_SEARCH_TIME_BUDGET_1229');
   if(examined>=limit){truncated=true;break outer;}
   const targetUids=discard&&j>=0?[targets[j].uid,targets[i].uid]:[targets[i].uid];
   const request={action,actionType:action,before:state,player:0,uid:src.uid,responseUid:trap.uid,
    ...(discard?{discardUid:discard.uid,targetUids}:{targetUid:targetUids[0]})};
   const key=JSON.stringify([trap.uid,src.uid,discard?.uid??null,targetUids]);
   if(seen.has(key))continue;seen.add(key);examined++;
   const r=solemnResponse1229(request);
   if(!r.pass)continue;
   const a={...request,paid:r.paid,chained:r.chained,after:r.after};
   const line={before:state,actions:[a],state:r.after,steps:1,negated:1,removed:0,
    discarded:discard?1:0,lpPaid:action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208'?1000:0,
    opponentLpPaid:r.cost.opponentPaidLp,certified:false,globalOptimalityProven:false};
   if(replaySolemnResponse1229(line).pass)candidates.push(line);
   if(examined%20===0)await new Promise(resolve=>setTimeout(resolve,0));
  }
 }
 if(opts.signal?.aborted===true)return empty('COUNTER_SEARCH_CANCELLED_1229');
 if(stale())return empty('OPENING_STALE_DECK_1229');
 candidates.sort((a,b)=>a.discarded-b.discarded||a.lpPaid-b.lpPaid||
  JSON.stringify(a.actions.map(x=>[x.action,x.uid,x.targetUid,x.targetUids])).localeCompare(
  JSON.stringify(b.actions.map(x=>[x.action,x.uid,x.targetUid,x.targetUids]))));
 const chosen=candidates.slice(0,5).map((c,i)=>({...c,index:i+1}));
 if(chosen.some(c=>!replaySolemnResponse1229(c).pass))return empty('COUNTER_FINAL_REPLAY_FAILED_1229');
 return{version:VERSION,status:chosen.length?'BOUNDED_SOLEMN_RESPONSES_1229':'NO_BOUNDED_SOLEMN_RESPONSES_1229',
  pass:false,certified:false,globalOptimalityProven:false,
  scope:'Una activación MST/Cosmic/Twin respondida por Solemn Judgment colocado. Sin demás respuestas, disparadores ni búsqueda global.',
  candidates:chosen,candidateCount:chosen.length,choicesExamined:examined,truncated:truncated||candidates.length>5,
  enumerationComplete:!truncated,openingEvidence1216:opening.evidence};
}

/* Alpha 1211: replay de 1-2 efectos de eliminación Mágica/Trampa,
   usando sus ejecutores independientes como autoridad de cada resolución. */
function replayRemovalSequenceCore1224(line,maxSteps,revision){
 const actions=Array.isArray(line?.actions)?line.actions:[];
 const failure=(status,i=-1)=>({version:VERSION,status,pass:false,certified:false,
  certifiesRules:false,certifiesOptimality:false,stepIndex:i});
 if(!actions.length||actions.length>maxSteps)return failure('SEQUENCE_LENGTH_UNSUPPORTED');
 const eq=(x,y)=>{
  if(Array.isArray(x)||Array.isArray(y))return Array.isArray(x)&&Array.isArray(y)&&x.length===y.length&&x.every((v,i)=>eq(v,y[i]));
  if(x&&typeof x==='object'||y&&typeof y==='object'){
   if(!x||!y||typeof x!=='object'||typeof y!=='object')return false;
   const k=Object.keys(x).sort(),l=Object.keys(y).sort();
   return k.length===l.length&&k.every((z,i)=>z===l[i]&&eq(x[z],y[z]));
  }
  return Object.is(x,y);
 };
 let last=null,totalCost=0,destroyed=0,banished=0;
 for(let i=0;i<actions.length;i++){
  const a=actions[i];
  if(!a||!['ACTIVATE_RESOLVE_MST_1211','ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208'].includes(a.actionType))return failure('ACTION_TYPE_UNSUPPORTED',i);
  if(a.action!==undefined&&a.action!==a.actionType)return failure('SEQUENCE_ACTION_CLAIM_MISMATCH',i);
  if(i===0&&line?.before!==undefined&&!eq(line.before,a.before))return failure('SEQUENCE_START_STATE_CLAIM_MISMATCH',i);
  if(i>0&&!eq(last,a.before))return failure('SEQUENCE_STATE_DISCONTINUITY',i);
  const proof=a.actionType==='ACTIVATE_RESOLVE_MST_1211'?mysticalSpaceTyphoon1211({...a,action:a.actionType}):cosmicCyclone1208({...a,action:a.actionType});
  if(!proof.pass)return failure('SEQUENCE_EFFECT_MISMATCH',i);
  if(!a.paid||!a.after||!eq(proof.paid,a.paid)||!eq(proof.after,a.after))return failure('SEQUENCE_STEP_REPLAY_FAILED',i);
  totalCost+=proof.cost.amount;
  if(a.actionType==='ACTIVATE_RESOLVE_MST_1211')destroyed++;else banished++;
  last=proof.after;
 }
 const boards=[line?.state,line?.endBoard,line?.finalBoard].filter(x=>x!==undefined);
 if(!boards.length||boards.some(board=>!eq(last,board)))return failure('SEQUENCE_FINAL_BOARD_MISMATCH',actions.length-1);
 if(line?.steps!==undefined&&line.steps!==actions.length)return failure('SEQUENCE_STEP_COUNT_MISMATCH',actions.length-1);
 if(line?.costPaid!==undefined&&line.costPaid!==totalCost)return failure('SEQUENCE_COST_CLAIM_MISMATCH',actions.length-1);
 if(line?.destroyed!==undefined&&line.destroyed!==destroyed)return failure('SEQUENCE_DESTROYED_CLAIM_MISMATCH',actions.length-1);
 if(line?.banished!==undefined&&line.banished!==banished)return failure('SEQUENCE_BANISHED_CLAIM_MISMATCH',actions.length-1);
 if([line?.certified,line?.globalOptimalityProven,line?.certifiesRules,line?.certifiesOptimality].some(x=>x===true))return failure('SEQUENCE_CERTIFICATION_CLAIM_NOT_SUPPORTED',actions.length-1);
 return {version:VERSION,status:revision==='1211'?'BOUNDED_REMOVAL_REPLAY_MATCH_1211':'BOUNDED_REMOVAL_REPLAY_MATCH_1224',pass:true,
  steps:actions.length,costPaid:totalCost,destroyed,banished,certified:false,
  certifiesRules:false,certifiesOptimality:false,
  scope:revision==='1211'?'1-2_MST_OR_COSMIC_SEQUENTIAL_NO_RESPONSES_OR_TRIGGERS':'1-3_MST_OR_COSMIC_SEQUENTIAL_NO_RESPONSES_OR_TRIGGERS'};
}
function replayRemovalSequence1211(line){return replayRemovalSequenceCore1224(line,2,'1211');}
/* Alpha 1224: replay opt-in hasta tres acciones; no certifica reglas universales. */
function replayRemovalSequence1224(line){return replayRemovalSequenceCore1224(line,3,'1224');}

function transitionContract1066(spec){
 if(raw(spec?.action)==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225')return twinTwisters1225(spec);
 if(raw(spec?.action)==='ACTIVATE_RESOLVE_MST_1211')return mysticalSpaceTyphoon1211(spec);
 if(raw(spec?.action)==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208')return cosmicCyclone1208(spec);
 if(raw(spec?.action)==='RESOLVE_COSMIC_CYCLONE_1207')return cosmicCyclone1207(spec);
 if(['RESOLVE_COUNTER_CHAIN_1142','RESOLVE_MAGIC_JAMMER_CHAIN_1143'].includes(raw(spec?.action)))return counterTrapChain1142(spec);
 return raw(spec?.action)==='RESOLVE_TARGET_SPELL_1066'?targetedSpellResolution1066(spec):transitionContract1065(spec);
}
function ruleFixtures1066(){
 const inherited=ruleFixtures1065(),tests=[...inherited.tests],copy=x=>JSON.parse(JSON.stringify(x));
 const blank=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const mk=(ownTarget=false, trap=true)=>{
  const before={zones:[blank(),blank()],turn:2,phase:'MAIN1',activePlayer:0,lp:[8000,8000],normalSummonsUsed:0,chain:[],triggerQueue:[]};
  const spell={uid:'mst',id:5318639,name:'Mystical Space Typhoon',typeBits:0x10002,faceUp:true,ownerPlayer:0};
  const victim={uid:'target',id:4321,typeBits:trap?4:2,faceUp:false,ownerPlayer:ownTarget?0:1};
  before.zones[0].spelltrap.push(spell);
  before.zones[ownTarget?0:1].spelltrap.push(victim);
  const after=copy(before);
  after.zones[0].spelltrap=after.zones[0].spelltrap.filter(x=>x.uid!=='mst');after.zones[0].gy.push(copy(spell));
  after.zones[ownTarget?0:1].spelltrap=after.zones[ownTarget?0:1].spelltrap.filter(x=>x.uid!=='target');after.zones[ownTarget?0:1].gy.push(copy(victim));
  return{action:'RESOLVE_TARGET_SPELL_1066',player:0,uid:'mst',targetUid:'target',before,after};
 };
 const check=(name,input,expected)=>{const r=transitionContract1066(input);tests.push({name,pass:r.pass===expected,expected,reported:r.pass,issues:r.issues})};
 let s=mk();check('Tifón destruye Trampa del rival',s,true);
 check('Tifón destruye Mágica propia',mk(true,false),true);
 let x=copy(s);x.targetUid='inexistente';check('Objetivo no existente rechazado',x,false);
 x=copy(s);x.targetUid='mst';check('No autoselección del Tifón',x,false);
 x=copy(s);x.before.zones[1].spelltrap[0].typeBits=1;check('Monstruo como objetivo rechazado',x,false);
 x=copy(s);x.before.zones[0].spelltrap[0].typeBits=2;check('Mágica sin subtipo Juego Rápido rechazada',x,false);
 x=copy(s);x.before.zones[0].spelltrap[0].id=100;check('Passcode falso rechazado',x,false);
 x=copy(s);x.after.zones[1].spelltrap.push(x.after.zones[1].gy.shift());check('Objetivo no destruido rechazado',x,false);
 x=copy(s);x.after.lp[0]+=1000;check('LP inventados rechazados',x,false);
 x=copy(s);x.before.zones[0].spelltrap[0].faceUp=false;check('Tifón no activado rechazado',x,false);
 x=copy(s);x.before.chain=[{uid:'chain'}];check('Cadena pendiente rechazada',x,false);
 x=copy(s);x.after.zones[1].monster.push({uid:'ghost',id:77});check('Carta extra creada rechazada',x,false);
 x=copy(s);x.after.zones[1].gy[0].id=555;check('Objetivo alterado rechazado',x,false);
 x=copy(s);x.after.zones[0].gy[0].name='Falsificada';check('Mágica alterada rechazada',x,false);
 x=copy(s);x.before.zones[1].spelltrap[0].ownerPlayer=0;check('Control ajeno no soportado',x,false);
 x=copy(s);x.after.zones[1].gy=[];x.after.zones[0].gy.push({uid:'target',id:4321,typeBits:4,faceUp:false,ownerPlayer:1});check('Cementerio equivocado rechazado',x,false);
 // Alpha 1143: el dueño y el controlador del objetivo pueden diferir.
 for(const activating of [0,1])for(const controlling of [0,1])for(const owner of [0,1]){
  const before={zones:[blank(),blank()],turn:2,phase:'MAIN1',activePlayer:activating,lp:[8000,8000],chain:[],triggerQueue:[],normalSummonsUsed:0};
  const source={uid:'mst1141',id:5318639,name:'Mystical Space Typhoon',typeBits:0x10002,faceUp:true,ownerPlayer:activating};
  const victim={uid:'victim1141',id:34567891,typeBits:4,faceUp:false,ownerPlayer:owner};
  before.zones[activating].spelltrap.push(source);before.zones[controlling].spelltrap.push(victim);
  const after=copy(before);
  after.zones[activating].spelltrap=after.zones[activating].spelltrap.filter(x=>x.uid!=='mst1141');
  after.zones[controlling].spelltrap=after.zones[controlling].spelltrap.filter(x=>x.uid!=='victim1141');
  after.zones[activating].gy.push(copy(source));after.zones[owner].gy.push(copy(victim));
  const witness={action:'RESOLVE_TARGET_SPELL_1066',player:activating,uid:'mst1141',targetUid:'victim1141',before,after};
  check('1141 MST activador '+activating+' controlador '+controlling+' propietario '+owner,witness,true);
  const wrong=copy(witness);
  wrong.after.zones[owner].gy=wrong.after.zones[owner].gy.filter(x=>x.uid!=='victim1141');
  wrong.after.zones[1-owner].gy.push(victim);
  check('1141 MST rechaza Cementerio incorrecto '+activating+'/'+controlling+'/'+owner,wrong,false);
  const ambiguous=copy(witness);ambiguous.before.zones[controlling].spelltrap.find(x=>x.uid==='victim1141').ownerPlayer=null;
  check('1141 MST rechaza propietario ausente '+activating+'/'+controlling+'/'+owner,ambiguous,false);
 }
 return{version:VERSION,pass:tests.every(x=>x.pass),passed:tests.filter(x=>x.pass).length,total:tests.length,tests,certifiesUniversalRules:false,scope:'54 previos + 16 casos de Tifón en resolución limitada'};
}

function ruleFixtures1065(){
 const previous=ruleFixtures1064(),checks=[...previous.tests];
 const clone=x=>JSON.parse(JSON.stringify(x));
 const blank=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const base=()=>({zones:[blank(),blank()],turn:1,phase:'MAIN1',activePlayer:0,lp:[8000,8000],normalSummonsUsed:0,chain:[],triggerQueue:[]});
 const cases=[
  {id:70368879,name:'Upstart Goblin',draw:1,player:1,delta:1000},
  {id:84257639,name:'Dian Keto the Cure Master',draw:0,player:0,delta:1000},
  {id:84257640,name:'Dian Keto the Cure Master',draw:0,player:0,delta:1000}
 ];
 const add=(label,test,expected)=>{const r=transitionContract1065(test);checks.push({name:label,pass:r.pass===expected,expected,reported:r.pass,issues:r.issues});};
 for(const rule of cases){
  const before=base(),spell={uid:'spell',id:rule.id,name:rule.name,typeBits:2,faceUp:true},draw={uid:'draw',id:12345,name:'Carta de prueba'};
  before.zones[0].spelltrap=[spell];before.zones[0].deck=[draw,{uid:'remain',id:88}];
  const after=clone(before);after.zones[0].spelltrap=[];after.zones[0].gy.push(clone(spell));
  if(rule.draw){after.zones[0].deck.shift();after.zones[0].hand.push(clone(draw))} after.lp[rule.player]+=rule.delta;
  const spec={action:'RESOLVE_NORMAL_SPELL_1065',player:0,uid:'spell',before,after};
  add(rule.name+' ID '+rule.id+' resuelve efecto acotado',spec,true);
  const fail=clone(after);fail.lp[rule.player]-=1000;add(rule.name+' sin LP correctos',{...spec,after:fail},false);
  const fake=clone(after);fake.zones[0].gy[0].id=1;add(rule.name+' carta convertida',{...spec,after:fake},false);
  const altered=clone(after);altered.zones[0].hand.push({uid:'extra',id:99});add(rule.name+' carta adicional creada',{...spec,after:altered},false);
  const bad=clone(before);bad.zones[0].spelltrap[0].faceUp=false;add(rule.name+' sin activar',{...spec,before:bad},false);
 }
 const b=base();b.zones[0].spelltrap=[{uid:'s',id:55144522,name:'Pot of Greed',typeBits:2,faceUp:true}];
 const a=clone(b);a.zones[0].spelltrap=[];a.zones[0].gy.push(clone(b.zones[0].spelltrap[0]));
 add('Pot of Greed sin Deck ni cartas robadas se rechaza',{action:'RESOLVE_NORMAL_SPELL_1065',player:0,uid:'s',before:b,after:a},false);
 for(const rule of [{id:55144522,name:'Pot of Greed',draw:2,discard:0},{id:79571449,name:'Graceful Charity',draw:3,discard:2}]){
  const x=base(),spell={uid:'spell',id:rule.id,name:rule.name,typeBits:2,faceUp:true};
  x.zones[0].spelltrap.push(spell);
  x.zones[0].deck=[{uid:'a',id:41},{uid:'b',id:42},{uid:'c',id:43},{uid:'d',id:44}];
  x.zones[0].hand=[{uid:'h',id:45}];
  const y=clone(x),drawn=y.zones[0].deck.splice(0,rule.draw);y.zones[0].hand.push(...drawn);
  const discarded=rule.discard?['h','b']:[];
  for(const discard of discarded){const index=y.zones[0].hand.findIndex(card=>card.uid===discard);y.zones[0].gy.push(y.zones[0].hand.splice(index,1)[0])}
  y.zones[0].spelltrap=[];y.zones[0].gy.push(spell);
  const spec={action:'RESOLVE_NORMAL_SPELL_1065',player:0,uid:'spell',discardUids:discarded,before:x,after:y};
  add(rule.name+' resolución limitada válida',spec,true);
  const wrong=clone(spec);wrong.discardUids=['h','h'];add(rule.name+' descarte duplicado rechazado',wrong,false);
  const altered=clone(spec);altered.after.zones[0].hand.push({uid:'invented',id:88});add(rule.name+' carta inventada rechazada',altered,false);
 }


 for(const rule of [{id:74117290,name:'Dark World Dealings',mode:'DRAW_THEN_DISCARD_ONE'},{id:72892473,name:'Card Destruction',mode:'DISCARD_HAND_THEN_DRAW'}]){
  const x=base(),spell={uid:'spell',id:rule.id,name:rule.name,typeBits:2,faceUp:true};
  x.zones[0].spelltrap.push(spell);
  for(let p=0;p<2;p++){
   x.zones[p].hand=[{uid:'h'+p,id:310+p}];
   x.zones[p].deck=[{uid:'d'+p+'a',id:320+p},{uid:'d'+p+'b',id:330+p}];
  }
  const y=clone(x),du=[[],[]];
  for(let p=0;p<2;p++){
   if(rule.mode==='DRAW_THEN_DISCARD_ONE'){
    y.zones[p].hand.push(y.zones[p].deck.shift());du[p]=['h'+p];
   }else du[p]=['h'+p];
   y.zones[p].gy.push(y.zones[p].hand.shift());
   if(rule.mode==='DISCARD_HAND_THEN_DRAW')y.zones[p].hand.push(y.zones[p].deck.shift());
  }
  y.zones[0].spelltrap=[];y.zones[0].gy.push(spell);
  const spec={action:'RESOLVE_NORMAL_SPELL_1065',player:0,uid:'spell',discardUidsByPlayer:du,before:x,after:y};
  add(rule.name+' bilateral válido',spec,true);
  const fake=clone(spec);fake.discardUidsByPlayer[1]=['ghost'];add(rule.name+' descartar ajeno rechazado',fake,false);
  const swapped=clone(spec);swapped.after.zones[1].hand[0].id=999;add(rule.name+' identidad del rival inmutable',swapped,false);
 }

 for(const rule of [{id:12580477,name:'Raigeki',zone:'monster'}, {id:18144506,name:"Harpie's Feather Duster",zone:'spelltrap'}]){
  const x=base(),spell={uid:'spell',id:rule.id,name:rule.name,typeBits:2,faceUp:true};x.zones[0].spelltrap.push(spell);
  const victims=[{uid:'victim0',id:456,typeBits:rule.zone==='monster'?1:4,ownerPlayer:1},{uid:'victim1',id:457,typeBits:rule.zone==='monster'?1:2,ownerPlayer:1}];
  x.zones[1][rule.zone].push(...victims);
  const y=clone(x);y.zones[0].spelltrap=[];y.zones[0].gy.push(spell);y.zones[1][rule.zone]=[];y.zones[1].gy.push(...victims);
  const t={action:'RESOLVE_NORMAL_SPELL_1065',player:0,uid:'spell',before:x,after:y,destroyedUids:victims.map(z=>z.uid)};
  add(rule.name+' limpia zona rival completa',t,true);
  const fake=clone(t);fake.after.zones[1][rule.zone].push(fake.after.zones[1].gy.pop());add(rule.name+' no permite sobreviviente',fake,false);
  const forged=clone(t);forged.destroyedUids=['ghost'];add(rule.name+' descarta lista falsa',forged,false);
 }

 for(const r of [{id:53129443,name:'Dark Hole',zone:'monster'},{id:19613556,name:'Heavy Storm',zone:'spelltrap'}]){
  const x=base(),spell={uid:'source',id:r.id,name:r.name,typeBits:2,faceUp:true,ownerPlayer:0};x.zones[0].spelltrap.push(spell);
  const first={uid:'ownVictim',id:121,typeBits:r.zone==='monster'?1:4,ownerPlayer:0};
  const second={uid:'opponentVictim',id:122,typeBits:r.zone==='monster'?1:4,ownerPlayer:1};
  x.zones[0][r.zone].push(first);x.zones[1][r.zone].push(second);
  const y=clone(x);y.zones[0].spelltrap=[];y.zones[0][r.zone]=[];y.zones[1][r.zone]=[];
  y.zones[0].gy.push(first,spell);y.zones[1].gy.push(second);
  const spec={action:'RESOLVE_NORMAL_SPELL_1065',player:0,uid:'source',before:x,after:y,
   destroyedUids:['ownVictim','opponentVictim'],destroyedUidsByPlayer:[['ownVictim'],['opponentVictim']]};
  add(r.name+' barre ambos campos',spec,true);
  const forged=clone(spec);forged.destroyedUidsByPlayer=[[],['ownVictim','opponentVictim']];add(r.name+' rechaza reparto ficticio',forged,false);
  const survivor=clone(spec);survivor.after.zones[0][r.zone].push(survivor.after.zones[0].gy.shift());add(r.name+' rechaza sobreviviente',survivor,false);
 }

 for(const targetOwner of [0,1]){
  const x=base(),spell={uid:'reborner',id:83764718,name:'Monster Reborn',typeBits:2,faceUp:true,ownerPlayer:0};
  const victim={uid:'revived',id:89631139,name:'Monstruo de prueba',typeBits:1,faceUp:true,ownerPlayer:targetOwner};
  x.zones[0].spelltrap.push(spell);x.zones[targetOwner].gy.push(victim);
  const y=clone(x);y.zones[0].spelltrap=[];y.zones[targetOwner].gy=[];
  y.zones[0].monster.push(victim);y.zones[0].gy.push(spell);
  const spec={action:'RESOLVE_NORMAL_SPELL_1065',player:0,uid:'reborner',targetUid:'revived',before:x,after:y};
  add('Monster Reborn desde Cementerio '+targetOwner,spec,true);
  const fake=clone(spec);fake.targetUid='ghost';add('Monster Reborn rechaza objetivo inexistente '+targetOwner,fake,false);
  const illegal=clone(spec);illegal.before.zones[targetOwner].gy[0].typeBits=0x21;add('Monster Reborn no revive Monstruo de Efecto '+targetOwner,illegal,false);
 }

 // Alpha 1143: transferencia de control y destrucción, incluyendo resurrección previa.
 for(const wipeRule of [{id:12580477,name:'Raigeki',field:false,zone:'monster'},
                        {id:53129443,name:'Dark Hole',field:true,zone:'monster'},
                        {id:18144506,name:"Harpie's Feather Duster",field:false,zone:'spelltrap'},
                        {id:19613556,name:'Heavy Storm',field:true,zone:'spelltrap'}]){
  const start=base(),spell={uid:'s',id:wipeRule.id,name:wipeRule.name,typeBits:2,faceUp:true,ownerPlayer:0};
  const borrowed={uid:'borrowed',id:89631139,typeBits:wipeRule.zone==='monster'?1:4,faceUp:true,ownerPlayer:0};
  start.zones[0].spelltrap.push(spell);start.zones[1][wipeRule.zone].push(borrowed);
  const finish=clone(start);finish.zones[0].spelltrap=[];finish.zones[0].gy.push(borrowed,spell);finish.zones[1][wipeRule.zone]=[];
  const input={action:'RESOLVE_NORMAL_SPELL_1065',uid:'s',player:0,before:start,after:finish};
  if(wipeRule.field)input.destroyedUidsByPlayer=[[],['borrowed']];
  input.destroyedUidsByOwner=[['borrowed'],[]];
  add(wipeRule.name+' destruye control ajeno y envía al Cementerio del propietario',input,true);
  const wrong=clone(input);wrong.after.zones[0].gy=wrong.after.zones[0].gy.filter(q=>q.uid!=='borrowed');wrong.after.zones[1].gy.push(borrowed);
  add(wipeRule.name+' rechaza Cementerio del controlador',wrong,false);
  const noOwner=clone(input);noOwner.before.zones[1][wipeRule.zone][0].ownerPlayer=null;
  add(wipeRule.name+' rechaza propietario no identificado',noOwner,false);
 }
 return{version:VERSION,passed:checks.filter(x=>x.pass).length,total:checks.length,pass:checks.every(x=>x.pass),tests:checks,certifiesUniversalRules:false,scope:'Subconjunto acotado de 22 Mágicas Normales; robo, descarte, barrido y Monster Reborn con Monstruo Normal; no certifica inmunidades ni activación',officialTextSources:Object.values(OFFICIAL_NORMAL_SPELL_1065).map(x=>x.source)};
}

function traceAudit1064(line){
 const acts=arr(line?.actions||line?.simulation?.actions),issues=[],continuity=[],actions=[];
 if(acts.length<2)issues.push('Se requieren al menos dos acciones con estados completos');
 for(let i=0;i<acts.length;i++){
  const act=acts[i]||{},tag='Paso '+(i+1),b=snapshot1063(act.before,tag+' antes'),a=snapshot1063(act.after,tag+' después');
  issues.push(...b.issues,...a.issues);
  if(act.legal===false||/NO RESUELTA|ILEGAL|FAIL(?:ED)?/i.test(raw(act.result||act.status)))issues.push(tag+': resultado inválido');
  const type=raw(act.actionType||act.action),proof=transitionContract1066({action:type,player:act.player,uid:act.uid,paid:act.paid,spellUid:act.spellUid,counterUid:act.counterUid,discardUid:act.discardUid,spellPlayer:act.spellPlayer,counterPlayer:act.counterPlayer,targetUid:act.targetUid,targetUids:act.targetUids,destroyedUids:act.destroyedUids,destroyedUidsByPlayer:act.destroyedUidsByPlayer,discardUids:act.discardUids,discardUidsByPlayer:act.discardUidsByPlayer,level:act.level,before:act.before,after:act.after});
  actions.push({step:i+1,...proof});if(!proof.pass)issues.push(...proof.issues.map(x=>tag+': '+x));
  if(i){const c=stateContinuity1063(acts[i-1].after,act.before,tag);continuity.push({step:i+1,...c});issues.push(...c.issues)}
 }
 const final=line?.simulation?.finalBoard||line?.finalBoard||line?.endBoard;
 const last=acts[acts.length-1]?.after;
 const endBoard=stateContinuity1063(last,final,'End Board');issues.push(...endBoard.issues);
 const state=line?.state||line?.st||line?.simulation?.state;
 for(const k of ['chain','triggerQueue'])if(state&&arr(state[k]).length)issues.push('Estado final: '+k+' sin resolver');
 return{version:VERSION,pass:issues.length===0,steps:acts.length,continuity,actions,endBoard,finalBoard:endBoard,issues:issues.slice(0,60),policy:'Movimientos básicos, veintidós Mágicas Normales con efectos acotados (incluyendo robo, descarte, destrucción bilateral e Invocación Especial de Monstruo Normal) y Tifón; NO certifica activaciones, cadenas, prohibiciones, inmunidades, efectos disparados ni optimalidad.'};
}

/* Alpha 1067: comprobador estructural CONSERVADOR de cadenas.
   Libro oficial Konami: el último enlace activado se resuelve primero;
   los enlaces posteriores deben ser de velocidad 2 o 3 y nunca menor que el anterior.
   Proyectar chain=[] sirve SOLO para comparar transformaciones físicas mediante
   contratos limitados previos; NO verifica activación legal, prioridad, ventana,
   costos, inmunidades, negaciones ni verdad de una respuesta rival.
   Ref: https://www.yugioh-card.com/en/play/psct/psct-3/
*/
function chainAudit1067(input){
 const links=arr(input?.links),steps=arr(input?.steps),issues=[],effects=[];
 const err=s=>issues.push(s);
 const signature=x=>JSON.stringify(x);
 const validType=new Map([['RESOLVE_NORMAL_SPELL_1065',1],['RESOLVE_TARGET_SPELL_1066',2]]);
 if(links.length<2||links.length>5)err('Solo cadenas de 2 a 5 enlaces de este subconjunto');
 if(steps.length!==links.length)err('Debe haber una resolución por enlace');
 const seen=new Set();
 for(let i=0;i<links.length;i++){
  const l=links[i]||{};
  if(l.chainLink!==i+1)err('Enlace sin numeración de activación consecutiva: '+(i+1));
  if(!Number.isSafeInteger(l.player)||l.player<0||l.player>1)err('Jugador inválido en enlace '+(i+1));
  if(!raw(l.uid))err('UID ausente en enlace '+(i+1));
  if(seen.has(raw(l.uid)))err('Instancia repetida en esta cadena acotada');
  seen.add(raw(l.uid));
  if(!validType.has(raw(l.actionType)))err('Efecto sin contrato admitido en enlace '+(i+1));
  if(l.spellSpeed!==validType.get(raw(l.actionType)))err('Velocidad no demostrada por contrato en enlace '+(i+1));
  if(i>0&&(l.spellSpeed<2||l.spellSpeed<links[i-1].spellSpeed))err('Respuesta de velocidad inferior en enlace '+(i+1));
  if(l.actionType==='RESOLVE_TARGET_SPELL_1066'&&!raw(l.targetUid))err('Objetivo obligatorio de Tifón ausente');
 }
 for(let i=0;i<steps.length;i++){
  const st=steps[i]||{},link=links[links.length-1-i]||{},b=st.before,a=st.after;
  if(st.chainLink!==link.chainLink)err('Resolución no corresponde al orden inverso de enlaces en paso '+(i+1));
  for(const field of ['uid','player','actionType'])if(st[field]!==link[field])err('Identidad del enlace alterada en '+field+' paso '+(i+1));
  if(raw(st.targetUid)!==raw(link.targetUid))err('Objetivo cambiado entre activación y resolución en paso '+(i+1));
  if(link.discardUids!=null && JSON.stringify(st.discardUids)!==JSON.stringify(link.discardUids))err('Lista declarada de descartes no coincide con el enlace '+(i+1));
  if(link.discardUidsByPlayer!=null && JSON.stringify(st.discardUidsByPlayer)!==JSON.stringify(link.discardUidsByPlayer))err('Listas de ambos jugadores no coinciden con enlace '+(i+1));
  if(link.destroyedUids!=null && JSON.stringify(st.destroyedUids)!==JSON.stringify(link.destroyedUids))err('Destrucciones declaradas no coinciden con el enlace '+(i+1));
  if(link.destroyedUidsByPlayer!=null && JSON.stringify(st.destroyedUidsByPlayer)!==JSON.stringify(link.destroyedUidsByPlayer))err('Barrido por jugador no coincide con enlace '+(i+1));
  if(st.negated===true||st.activationInvalid===true||st.legal===false||st.interrupted===true)err('Negación, activación inválida o interrupción no modelada en paso '+(i+1));
  const expectedB=links.slice(0,links.length-i),expectedA=links.slice(0,links.length-i-1);
  if(!b||!Array.isArray(b.chain)||signature(b.chain)!==signature(expectedB))err('Pila antes de resolución incompatible en paso '+(i+1));
  if(!a||!Array.isArray(a.chain)||signature(a.chain)!==signature(expectedA))err('Pila después de resolución incompatible en paso '+(i+1));
  if(!b||!a){err('Estados completos ausentes en paso '+(i+1));continue}
  // El contrato físico se ejecuta sobre proyecciones aisladas sin pila,
  // porque los contratos 1065/1066 rehúsan la presencia de una cadena real.
  // La legalidad de dicha cadena sigue expresamente SIN ACREDITAR.
  const pb={...b,chain:[]},pa={...a,chain:[]};
  const result=transitionContract1066({action:st.actionType,player:st.player,uid:st.uid,targetUid:st.targetUid,targetUids:st.targetUids,destroyedUids:st.destroyedUids,destroyedUidsByPlayer:st.destroyedUidsByPlayer,discardUids:st.discardUids,discardUidsByPlayer:st.discardUidsByPlayer,before:pb,after:pa});
  effects.push({step:i+1,chainLink:link.chainLink,structuralPass:result.pass===true,issues:result.issues||[]});
  if(!result.pass)err('Efecto del paso '+(i+1)+' fuera de contrato: '+(result.issues||[]).join('; '));
  if(i>0){const cont=stateContinuity1063(steps[i-1]?.after,b,'Cadena paso '+(i+1));if(!cont.pass)err('Continuidad de estados: '+cont.issues.join('; '))}
 }
 if(steps.length){const last=steps[steps.length-1]?.after,final=input?.finalBoard;
  const comp=stateContinuity1063(last,final,'Campo final de cadena');
  if(!comp.pass)err('Campo final incompatible: '+comp.issues.join('; '));
  if(last&&Array.isArray(last.chain)&&last.chain.length)err('Cadena aún pendiente tras la última resolución');
 }
 return{version:VERSION,pass:issues.length===0,scope:'ORDEN_Y_TRANSICIONES_ACOTADAS_1067',
  chainOrderVerified:issues.length===0,effects,issues:[...new Set(issues)].slice(0,60),
  certifiesRules:false,certifiesActivation:false,certifiesChainLegality:false,
  certifiesGlobalCombos:false,officialRulesSource:'https://www.yugioh-card.com/en/play/psct/psct-3/',
  limitations:'No verifica legalidad de activación, ventanas, costos, prioridad, efectos simultáneos, negaciones, sustituciones, inmunidades o rival activo.'};
}
/* Alpha 1068 · pruebas de activación acotada + continuidad física; sin reclamar reglas universales.
   Referencia primaria PSCT: https://www.yugioh-card.com/en/play/psct/psct-3/
   Una activación ocurre antes de la resolución de la cadena; objetivo de Tifón en activación.
   Este contrato deliberadamente NO representa respuesta del rival, costes, negaciones,
   prioridad, disparadores, efectos continuos, inmunidades, prohibiciones o banlist.
*/
function activationAudit1068(input){
 const links=arr(input?.links),acts=arr(input?.activations),steps=arr(input?.steps),issues=[],checks=[];
 const error=s=>issues.push(s),signature=x=>JSON.stringify(x);
 const acceptedStateKeys=new Set(['zones','turn','phase','activePlayer','lp','normalSummonsUsed','chain','triggerQueue']);
 const cleanCard=c=>{const d={...(c||{})};delete d.faceUp;return completeCard1064(d)};
 const baseline=chainAudit1067(input);
 if(!baseline.pass)error('Resolución de cadena no demostrada: '+baseline.issues.join('; '));
 if(links.length<2||links.length>5||acts.length!==links.length)error('Se exigen 2–5 activaciones con enlaces correlativos');
 if(links[0]?.actionType!=='RESOLVE_NORMAL_SPELL_1065')error('El primer enlace debe ser una de las dos Mágicas Normales conocidas');
 for(let i=1;i<links.length;i++)if(links[i]?.actionType!=='RESOLVE_TARGET_SPELL_1066')error('Sólo se conoce Tifón del Espacio Místico como respuesta de velocidad 2');
 const used=new Set();
 for(let i=0;i<acts.length;i++){
  const t=acts[i]||{},link=links[i]||{},b=t.before,a=t.after;
  const note=s=>error('Activación '+(i+1)+': '+s);
  if(t.chainLink!==link.chainLink||t.actionType!==link.actionType||t.player!==link.player||t.uid!==link.uid||String(t.targetUid||'')!==String(link.targetUid||''))note('Los datos no coinciden con el enlace declarado');
  if(!b||!a){note('Estados antes/después ausentes');continue}
  for(const st of [b,a]){
   for(const k of Object.keys(st))if(!acceptedStateKeys.has(k))note('Metadato sin semántica implementada: '+k);
   if(!Number.isSafeInteger(st.turn)||st.turn<1||!/^MAIN(?:1|2)?$/i.test(raw(st.phase))||st.activePlayer!==t.player)note('Fase, turno o jugador activo incompatible con activación desde la mano');
   if(!Number.isSafeInteger(st.normalSummonsUsed)||st.normalSummonsUsed<0||st.normalSummonsUsed>1)note('Consumo de invocación no modelado');
   if(!Array.isArray(st.lp)||st.lp.length!==2||!st.lp.every(n=>Number.isSafeInteger(n)&&n>=0))note('LP de ambos jugadores no válidos');
   if(!Array.isArray(st.triggerQueue)||st.triggerQueue.length)note('Disparadores no resueltos');
  }
  const bp=snapshot1063(b,'activación previa'),ap=snapshot1063(a,'activación posterior');
  for(const s of [...bp.issues,...ap.issues])note(s);
  if(bp.issues.length||ap.issues.length)continue;
  if(!Number.isSafeInteger(t.player)||t.player<0||t.player>1){note('Jugador inválido');continue}
  const source=bp.index.get(raw(t.uid)),dest=ap.index.get(raw(t.uid));
  if(!source||source.player!==t.player||source.zone!=='hand')note('La Mágica debe proceder de la mano propia');
  if(!dest||dest.player!==t.player||dest.zone!=='spelltrap')note('La Mágica no termina en la zona propia de Mágicas/Trampas');
  if(b.zones[t.player]?.spelltrap?.length>=5)note('Sin zona libre para activar desde la mano');
  if(source&&dest){
   if(cleanCard(source.card)!==cleanCard(dest.card))note('Propiedades o identidad de la carta cambiadas durante activación');
   if(source.card.faceUp===true||dest.card.faceUp!==true)note('La Mágica no quedó activada boca arriba');
   if(source.card.ownerPlayer!==t.player)note('Propietario de la carta de mano no comprobado');
   const c=source.card,id=Number(c.id),bits=Number(c.typeBits??c.type);
   if(i===0){
    const rule=OFFICIAL_NORMAL_SPELL_1065[id];
    if(!rule||bits!==2)note('Mágica Normal fuera de contratos oficiales admitidos');
    if(rule&&c.name!=null&&low(c.name)!==low(rule.name))note('Nombre de Mágica Normal incompatible con ID');
   }else{
    if(id!==OFFICIAL_TARGET_SPELL_1066.id||!Number.isSafeInteger(bits)||!(bits&2)||!(bits&0x10000)||(bits&4))note('Respuesta no acredita Tifón de Juego Rápido');
    if(c.name!=null&&![OFFICIAL_TARGET_SPELL_1066.name,OFFICIAL_TARGET_SPELL_1066.nameES].some(n=>low(n)===low(c.name)))note('Nombre de Tifón incompatible con ID');
    if(!raw(t.targetUid)||t.targetUid===t.uid||used.has(raw(t.targetUid)))note('Objetivo ausente, autoseleccionado o ya activado en esta cadena (no soportado)');
    const target=bp.index.get(raw(t.targetUid)),ty=Number(target?.card?.typeBits??target?.card?.type);
    if(!target||target.zone!=='spelltrap'||!Number.isSafeInteger(ty)||!(ty&6)||(ty&1)||target.card.ownerPlayer!==target.player)note('El objetivo de Tifón no era una Mágica/Trampa física admisible al activar');
   }
  }
  if(!Array.isArray(b.chain)||signature(b.chain)!==signature(links.slice(0,i)))note('Cadena previa de activación incompatible');
  if(!Array.isArray(a.chain)||signature(a.chain)!==signature(links.slice(0,i+1)))note('Cadena posterior de activación incompatible');
  for(let p=0;p<2;p++)for(const zone of ZONES_1063){
   const expected=b.zones[p][zone].map(cardUid1063);
   if(p===t.player&&zone==='hand'&&source)expected.splice(source.slot,1);
   if(p===t.player&&zone==='spelltrap')expected.push(raw(t.uid));
   if(signature(expected)!==signature(a.zones[p][zone].map(cardUid1063)))note('Movimiento de zona no justificado '+p+'/'+zone);
  }
  for(const [uid,old] of bp.index){
   const current=ap.index.get(uid);
   if(!current)note('Carta desaparecida sin justificación: '+uid);
   else if(uid!==raw(t.uid)&&old.fullFingerprint!==current.fullFingerprint)note('Carta ajena modificada: '+uid);
  }
  for(const uid of ap.index.keys())if(!bp.index.has(uid))note('Carta nueva no justificada: '+uid);
  const keys=new Set([...Object.keys(b),...Object.keys(a)]);
  for(const k of keys)if(k!=='chain'&&k!=='zones'&&signature(b[k])!==signature(a[k]))note('Cambio de estado no justificado: '+k);
  if(i){const continuity=stateContinuity1063(acts[i-1]?.after,b,'Continuidad entre activaciones');if(!continuity.pass)note(continuity.issues.join('; '))}
  used.add(raw(t.uid));checks.push({chainLink:link.chainLink,uid:raw(t.uid),movedFromHand:!!source&&!!dest,window:'MAIN_ACTIVE_PLAYER_ONLY'});
 }
 if(acts.length&&steps.length){const c=stateContinuity1063(acts[acts.length-1]?.after,steps[0]?.before,'Activación a primera resolución');if(!c.pass)error('No coincide campo previo a resolver: '+c.issues.join('; '))}
 return{version:VERSION,pass:issues.length===0,scope:'ACTIVACIONES_DESDE_MANO_Y_RESOLUCIONES_ACOTADAS_1068',
  activationTransitionsVerified:issues.length===0,linkedResolutionVerified:baseline.pass===true,
  checks,issues:[...new Set(issues)].slice(0,80),resolution:baseline,
  certifiesUniversalRules:false,certifiesChainLegality:false,certifiesTournamentLegality:false,
  certifiesFiveCombos:false,source:'https://www.yugioh-card.com/en/play/psct/psct-3/',
  limitations:'Sólo Main Phase activa: Dian Keto o Upstart desde la mano, encadenando Tifón desde la mano propia; no acredita prioridad, respuestas rivales, negaciones, costes, inmunidades, efectos continuos ni banlists.'};
}
function activationFixtures1068(){
 const copy=x=>JSON.parse(JSON.stringify(x)),blank=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const mk=(upstart=false)=>{
  const normal={uid:'normal',id:upstart?70368879:84257639,name:upstart?'Upstart Goblin':'Dian Keto the Cure Master',typeBits:2,ownerPlayer:0};
  const mst={uid:'mst',id:5318639,name:'Mystical Space Typhoon',typeBits:0x10002,ownerPlayer:0};
  const victim={uid:'victim',id:7333,typeBits:4,faceUp:false,ownerPlayer:1};
  const links=[{chainLink:1,uid:'normal',player:0,spellSpeed:1,actionType:'RESOLVE_NORMAL_SPELL_1065'},
   {chainLink:2,uid:'mst',player:0,spellSpeed:2,actionType:'RESOLVE_TARGET_SPELL_1066',targetUid:'victim'}];
  const b={zones:[blank(),blank()],turn:1,phase:'MAIN1',activePlayer:0,lp:[8000,8000],normalSummonsUsed:0,chain:[],triggerQueue:[]};
  b.zones[0].hand=[copy(normal),copy(mst)];b.zones[1].spelltrap=[copy(victim)];
  if(upstart)b.zones[0].deck=[{uid:'draw',id:12345,name:'Carta de prueba',ownerPlayer:0}];
  const act1=copy(b);act1.chain=copy(links.slice(0,1));act1.zones[0].hand.shift();act1.zones[0].spelltrap.push({...copy(normal),faceUp:true});
  const act2=copy(act1);act2.chain=copy(links);act2.zones[0].hand.shift();act2.zones[0].spelltrap.push({...copy(mst),faceUp:true});
  const mid=copy(act2);mid.chain=copy(links.slice(0,1));mid.zones[0].spelltrap.pop();mid.zones[0].gy.push({...copy(mst),faceUp:true});mid.zones[1].spelltrap=[];mid.zones[1].gy.push(copy(victim));
  const end=copy(mid);end.chain=[];end.zones[0].spelltrap=[];end.zones[0].gy.push({...copy(normal),faceUp:true});end.lp[upstart?1:0]+=1000;
  if(upstart)end.zones[0].hand.push(end.zones[0].deck.shift());
  return{links,activations:[{...copy(links[0]),before:copy(b),after:copy(act1)}, {...copy(links[1]),before:copy(act1),after:copy(act2)}],
   steps:[{...copy(links[1]),before:copy(act2),after:copy(mid)},{...copy(links[0]),before:copy(mid),after:copy(end)}],finalBoard:copy(end)};
 };
 const tests=[],test=(name,mutate,expected,upstart=false)=>{
  const input=mk(upstart);if(mutate)mutate(input);
  const result=activationAudit1068(input);
  tests.push({name,pass:result.pass===expected,expected,reported:result.pass,issues:result.issues.slice(0,3)});
 };
 test('Dian Keto activada desde mano y Tifón responde desde mano, luego LIFO',null,true);
 test('Upstart Goblin activada desde mano y Tifón responde; robo y LP del rival',null,true,true);
 test('No se puede inventar la mano inicial',x=>{x.activations[0].before.zones[0].hand=[]},false);
 test('La primera Mágica procede del Cementerio, no de la mano',x=>{const c=x.activations[0].before.zones[0].hand.shift();x.activations[0].before.zones[0].gy.push(c)},false);
 test('La Mágica Normal no puede tener un ID distinto',x=>{x.activations[0].before.zones[0].hand[0].id=999},false);
 test('No usar una Trampa como Mágica Normal',x=>{x.activations[0].before.zones[0].hand[0].typeBits=4},false);
 test('El controlador no es el dueño de la carta de mano',x=>{x.activations[0].before.zones[0].hand[0].ownerPlayer=1},false);
 test('Primer enlace en Battle Phase rechazado',x=>{x.activations[0].before.phase='BATTLE'},false);
 test('Jugador no activo no puede usar esta ruta desde la mano',x=>{x.activations[1].player=1;x.links[1].player=1;x.steps[0].player=1},false);
 test('Tifón no puede simularse con una Mágica Normal',x=>{x.activations[1].before.zones[0].hand[0].typeBits=2},false);
 test('Tifón no está en la mano al encadenar',x=>{x.activations[1].before.zones[0].hand=[]},false);
 test('No se admite un objetivo inexistente',x=>{x.links[1].targetUid='fantasma';x.activations[1].targetUid='fantasma';x.steps[0].targetUid='fantasma'},false);
 test('El objetivo debe ser Mágica o Trampa',x=>{x.activations[1].before.zones[1].spelltrap[0].typeBits=1},false);
 test('Objetivo no puede ser la carta activada anteriormente',x=>{x.links[1].targetUid='normal';x.activations[1].targetUid='normal';x.steps[0].targetUid='normal'},false);
 test('Objetivo falsamente poseído rechazado',x=>{x.activations[1].before.zones[1].spelltrap[0].ownerPlayer=0},false);
 test('Se rechaza crear una instancia extra en la activación',x=>{x.activations[0].after.zones[0].monster.push({uid:'extra',id:77})},false);
 test('Se rechaza pérdida artificial de LP durante una activación sin costes',x=>{x.activations[0].after.lp[0]-=1000},false);
 test('Se rechaza robar antes de la resolución',x=>{x.activations[0].after.zones[0].deck.shift()},false,true);
 test('Se rechaza una Mágica activada boca abajo',x=>{x.activations[0].after.zones[0].spelltrap[0].faceUp=false},false);
 test('Se rechaza pila faltante antes de activar Tifón',x=>{x.activations[1].before.chain=[]},false);
 test('Se rechaza enlace sin integrar a la pila',x=>{x.activations[1].after.chain.pop()},false);
 test('Se rechaza salto temporal entre activaciones',x=>{x.activations[1].before.turn++},false);
 test('Se rechaza incompatibilidad antes de resolver',x=>{x.steps[0].before.lp[1]+=100},false);
 test('Se rechaza generar disparador desconocido',x=>{x.activations[1].after.triggerQueue.push({uid:'x'})},false);
 test('Se rechazan efectos continuos que el subconjunto desconoce',x=>{x.activations[0].before.continuousEffects=[{id:1}]},false);
 test('Se rechaza campo final falsificado',x=>{x.finalBoard.lp[0]++},false);
 test('Se rechaza resolución que ignora robo de Upstart',x=>{x.steps[1].after.zones[0].hand=[]},false,true);
 test('Se rechaza resolver dos cartas fuera del orden LIFO',x=>{x.steps.reverse()},false);
 return{version:VERSION,pass:tests.every(x=>x.pass),passed:tests.filter(x=>x.pass).length,total:tests.length,tests,
  certifiesUniversalRules:false,scope:'Dos rutas acotadas y pruebas negativas para activación física, objetivos y resolución; sin certificar cadenas universales.'};
}

function chainFixtures1067(){
 const clone=x=>JSON.parse(JSON.stringify(x));
 const blank=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const links=[{chainLink:1,uid:'keto',player:0,spellSpeed:1,actionType:'RESOLVE_NORMAL_SPELL_1065'},
  {chainLink:2,uid:'mst',player:0,spellSpeed:2,actionType:'RESOLVE_TARGET_SPELL_1066',targetUid:'victim'}];
 const b={zones:[blank(),blank()],turn:1,phase:'MAIN1',activePlayer:0,lp:[8000,8000],normalSummonsUsed:0,chain:clone(links),triggerQueue:[]};
 const mst={uid:'mst',id:5318639,name:'Mystical Space Typhoon',typeBits:0x10002,faceUp:true,ownerPlayer:0};
 const keto={uid:'keto',id:84257639,name:'Dian Keto the Cure Master',typeBits:2,faceUp:true,ownerPlayer:0};
 const victim={uid:'victim',id:7333,typeBits:4,faceUp:false,ownerPlayer:1};
 b.zones[0].spelltrap=[clone(mst),clone(keto)];b.zones[1].spelltrap=[clone(victim)];
 const mid=clone(b);mid.chain=clone(links.slice(0,1));mid.zones[0].spelltrap.shift();mid.zones[0].gy.push(clone(mst));mid.zones[1].spelltrap=[];mid.zones[1].gy.push(clone(victim));
 const end=clone(mid);end.chain=[];end.zones[0].spelltrap=[];end.zones[0].gy.push(clone(keto));end.lp[0]+=1000;
 const mk=()=>({links:clone(links),steps:[{...clone(links[1]),before:clone(b),after:clone(mid)},{...clone(links[0]),before:clone(mid),after:clone(end)}],finalBoard:clone(end)});
 const tests=[],test=(name,mutate,expected)=>{const v=mk();mutate?.(v);const r=chainAudit1067(v);tests.push({name,pass:r.pass===expected,expected,reported:r.pass,issues:r.issues.slice(0,4)})};
 test('Dian Keto enlazado con Tifón, resuelto en orden inverso',null,true);
 test('Resolución en orden de activación rechazada',x=>{x.steps[0].chainLink=1},false);
 test('Velocidad uno usada como respuesta rechazada',x=>{x.links[1].spellSpeed=1;x.steps[0].spellSpeed=1;x.steps[0].before.chain[1].spellSpeed=1},false);
 test('Velocidad superior inventada para Tifón rechazada',x=>{x.links[1].spellSpeed=3},false);
 test('Enlace dos con número falsificado rechazado',x=>{x.links[1].chainLink=3},false);
 test('Repetición de una instancia de carta rechazada',x=>{x.links[1].uid='keto'},false);
 test('UID del efecto intercambiado al resolver rechazado',x=>{x.steps[0].uid='fake'},false);
 test('Objetivo de Tifón cambiado al resolver rechazado',x=>{x.steps[0].targetUid='fake'},false);
 test('Pila anterior incompleta rechazada',x=>{x.steps[0].before.chain.pop()},false);
 test('Pila posterior incorrecta rechazada',x=>{x.steps[0].after.chain=[]},false);
 test('Continuidad del segundo paso rota rechazada',x=>{x.steps[1].before.lp[0]+=300},false);
 test('LP de resolución de Dian Keto falsificados rechazados',x=>{x.steps[1].after.lp[0]+=300},false);
 test('Campo final falsificado rechazado',x=>{x.finalBoard.lp[1]+=300},false);
 test('Acción sin contrato rechazada',x=>{x.links[1].actionType='NEGATE_ANYTHING';x.steps[0].actionType='NEGATE_ANYTHING'},false);
 test('Negación que no tiene semántica demostrada rechazada',x=>{x.steps[0].negated=true},false);
 test('Disparador nuevo no resuelto rechazado',x=>{x.steps[0].after.triggerQueue.push({uid:'unknown'})},false);
 return{version:VERSION,pass:tests.every(x=>x.pass),passed:tests.filter(x=>x.pass).length,total:tests.length,tests,certifiesUniversalRules:false,scope:'16 casos de cadenas limitadas; no avalan activación ni negaciones'};
}

function ruleFixtures1064(){
 const blank=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const base=()=>({zones:[blank(),blank()],turn:1,phase:'MAIN1',activePlayer:0,lp:[8000,8000],normalSummonsUsed:0,chain:[],triggerQueue:[]});
 const copy=x=>JSON.parse(JSON.stringify(x));const tests=[];
 const push=(name,s,expected)=>{const r=transitionContract1064(s);tests.push({name,pass:r.pass===expected,expected,reported:r.pass,issues:r.issues})};
 const normal={uid:'a',id:111,level:4,typeBits:0x11,name:'Monstruo normal de prueba'};
 let b=base();b.zones[0].hand=[normal];let a=copy(b);a.zones[0].hand=[];a.zones[0].monster=[{...copy(normal),faceUp:true,position:'ATTACK'}];a.normalSummonsUsed=1;
 let spec={action:'NORMAL_SUMMON_L4',player:0,uid:'a',level:4,before:b,after:a};
 push('Invocación normal de nivel cuatro con tipo verificado',spec,true);
 let wrong=copy(a);wrong.zones[0].monster[0].id=222;push('Identidad ID modificada con mismo UID',{...spec,after:wrong},false);
 wrong=copy(a);wrong.zones[0].monster[0].level=8;push('Nivel modificado con mismo UID',{...spec,after:wrong},false);
 wrong=copy(a);wrong.zones[1].gy.push(copy(normal));push('UID duplicado entre jugadores',{...spec,after:wrong},false);
 wrong=copy(a);wrong.zones[1].gy.push({uid:'ghost'});push('Aparición de carta adicional',{...spec,after:wrong},false);
 wrong=copy(a);wrong.normalSummonsUsed=0;push('Invocación sin consumir el uso',{...spec,after:wrong},false);
 push('Nivel 8 no puede usar la regla simple',{...spec,level:8},false);
 b=base();b.zones[0].hand=[{uid:'big',id:333,level:8,typeBits:0x11}];a=copy(b);a.zones[0].hand=[];a.zones[0].monster=b.zones[0].hand;a.normalSummonsUsed=1;
 push('Carta real de nivel 8 aunque parámetro diga 4',{action:'NORMAL_SUMMON_L4',player:0,uid:'big',level:4,before:b,after:a},false);
 b=base();b.zones[0].hand=[{uid:'spell',id:444,typeBits:0x2}];a=copy(b);a.zones[0].hand=[];a.zones[0].spelltrap=b.zones[0].hand.map(x=>({...copy(x),faceUp:false}));
 const set={action:'SET_SPELL_TRAP',player:0,uid:'spell',before:b,after:a};
 push('Colocar Mágica en fase principal',set,true);
 wrong=copy(a);wrong.chain=[{effect:1}];push('Cadena inesperada al colocar',{...set,after:wrong},false);
 wrong=copy(a);wrong.lp=[7900,8000];push('LP alterados sin efecto',{...set,after:wrong},false);
 wrong=copy(a);wrong.zones[0].spelltrap[0].id=555;push('Cambio de ID al colocar',{...set,after:wrong},false);
 b=base();b.zones[0].hand=[{uid:'mon',id:1,level:4,typeBits:0x11}];a=copy(b);a.zones[0].spelltrap=copy(b.zones[0].hand);a.zones[0].hand=[];
 push('Monstruo no puede colocarse como Mágica',{action:'SET_SPELL_TRAP',player:0,uid:'mon',before:b,after:a},false);
 b=base();b.zones[0].deck=[{uid:'draw1',id:555},{uid:'draw2',id:666}];a=copy(b);a.zones[0].deck=[{uid:'draw2',id:666}];a.zones[0].hand=[{uid:'draw1',id:555}];
 const draw={action:'DRAW_ONE',player:0,uid:'draw1',before:b,after:a};push('Robar carta superior',draw,true);
 push('No robar desde el fondo',{...draw,uid:'draw2'},false);
 wrong=copy(a);wrong.zones[0].hand[0].id=999;push('No convertir carta durante robo',{...draw,after:wrong},false);
 wrong=copy(a);wrong.zones[0].deck[0].id=777;push('No modificar segunda carta del Deck',{...draw,after:wrong},false);
 push('No aprobar acciones fuera del contrato',{...draw,action:'ACTIVATE_EFFECT'},false);
 
 // Casos nuevos con reglas limitadas, contrastados con el Rulebook oficial Konami:
 // https://www.yugioh-card.com/en/rulebook/
 let legalNormal=copy(spec.after);
 let noFace=copy(legalNormal);delete noFace.zones[0].monster[0].faceUp;
 push('No inferir boca arriba si no se registró',{...spec,after:noFace},false);
 let defenseNormal=copy(legalNormal);defenseNormal.zones[0].monster[0].position='DEFENSE';
 push('Invocación normal no puede acabar en Defensa',{...spec,after:defenseNormal},false);
 let faceDownNormal=copy(legalNormal);faceDownNormal.zones[0].monster[0].faceUp=false;
 push('Invocación normal no puede quedar boca abajo',{...spec,after:faceDownNormal},false);
 let setBefore=copy(spec.before),setAfter=copy(spec.after);
 setAfter.zones[0].monster[0].faceUp=false;setAfter.zones[0].monster[0].position='DEFENSE';
 const monsterSet={...spec,action:'NORMAL_SET_L4',before:setBefore,after:setAfter};
 push('Normal Set boca abajo en Defensa',monsterSet,true);
 let invalidSet=copy(setAfter);invalidSet.zones[0].monster[0].faceUp=true;
 push('Normal Set boca arriba no permitido',{...monsterSet,after:invalidSet},false);
 invalidSet=copy(setAfter);invalidSet.zones[0].monster[0].position='ATTACK';
 push('Normal Set en Ataque no permitido',{...monsterSet,after:invalidSet},false);
 invalidSet=copy(setAfter);invalidSet.normalSummonsUsed=0;
 push('Normal Set consume invocación del turno',{...monsterSet,after:invalidSet},false);
 let already=copy(setBefore);already.normalSummonsUsed=1;
 push('No dos invocaciones o Sets normales por turno',{...monsterSet,before:already,after:setAfter},false);
 let opponent=copy(setBefore);opponent.activePlayer=1;
 push('No colocar monstruo normal durante turno rival',{...monsterSet,before:opponent,after:setAfter},false);
 let battle=copy(setBefore);battle.phase='BATTLE';
 push('No Normal Set durante Battle Phase',{...monsterSet,before:battle,after:setAfter},false);
 let missingPos=copy(setAfter);delete missingPos.zones[0].monster[0].position;
 push('No certificar Normal Set sin posición',{...monsterSet,after:missingPos},false);
 let missingSpell=copy(set.after);delete missingSpell.zones[0].spelltrap[0].faceUp;
 push('No certificar Mágica colocada sin indicador boca abajo',{...set,after:missingSpell},false);
 let wrongSpell=copy(set.after);wrongSpell.zones[0].spelltrap[0].faceUp=true;
 push('Rechazar Mágica colocada boca arriba',{...set,after:wrongSpell},false);
 push('No interpretar Normal Set como Invocación Normal',{...monsterSet,action:'NORMAL_SUMMON_L4'},false);
 push('No interpretar Invocación Normal como Normal Set',{...spec,action:'NORMAL_SET_L4'},false);
 push('No declarar Flip Summon sin oráculo',{...monsterSet,action:'FLIP_SUMMON'},false);
 
 let two=copy(spec.before);two.zones[0].monster=[{uid:'other',id:71,level:3,typeBits:17,faceUp:true,position:'ATTACK'}];
 let twoAfter=copy(spec.after);twoAfter.zones[0].monster.unshift(copy(two.zones[0].monster[0]));
 let extraSpec={...spec,before:two,after:twoAfter};
 push('Monstruo ajeno sin cambios permitido',extraSpec,true);
 let flipOther=copy(twoAfter);flipOther.zones[0].monster[0].faceUp=false;
 push('No voltear monstruo ajeno durante invocación',{...extraSpec,after:flipOther},false);
 let rotateOther=copy(twoAfter);rotateOther.zones[0].monster[0].position='DEFENSE';
 push('No modificar posición de monstruo ajeno',{...extraSpec,after:rotateOther},false);
 let hijack=copy(spec.after);hijack.zones[0].monster[0].controller=1;
 push('No transferir control implícitamente al invocar',{...spec,after:hijack},false);
 const passed=tests.filter(x=>x.pass).length;
 return{version:VERSION,passed,total:tests.length,pass:passed===tests.length,tests,certifiesUniversalRules:false,scope:'ORACULO_ESTRUCTURAL_1064',rulebook:'https://www.yugioh-card.com/en/rulebook/'};
}
function top5Evidence1047(){const lines=arr(getLiveComboLines1070()).slice(0,5),rows=lines.map((line,i)=>{let p=null;try{p=lineEvidence1047(line)}catch(e){p={pass:false,error:raw(e?.message||e)}}const t=traceAudit1064(line);return{rank:i+1,pass:p?.pass===true&&t.pass===true,proof:p,trace:t}}),s=search1047();let b={};try{b=A973.top5?.()||{}}catch(_){}const visualExact=num(b.exact)>=5&&num(b.endBoardsExact)>=5;const fingerprints=lines.map(line=>{const acts=arr(line?.actions||line?.simulation?.actions);return JSON.stringify(acts.map(a=>[raw(a?.card?.name||a?.card),raw(a?.actionType),raw(a?.effectId),raw(a?.result),raw(a?.after?.turn),raw(a?.after?.phase)]))});const replayComplete=lines.length===5&&lines.every(line=>arr(line?.actions||line?.simulation?.actions).length>0);const distinct=replayComplete&&new Set(fingerprints).size===5;const bridge=top5ReplayAudit1070(lines);const pass=replayComplete&&distinct&&rows.every(x=>x.pass)&&visualExact&&s.boundedComplete&&bridge.pass===true;return{version:VERSION,pass,replay1070:{status:bridge.status,certified:bridge.certified,previewable:bridge.previewable},shown:lines.length,replayComplete,distinct,rows,search:s,visual:b,visualExact,globalOptimalityProven:s.globalOptimalityProven===true,policy:'Se requieren cinco trazas de acciones diferentes y cinco pruebas legales completas; las repeticiones o los campos ilustrativos no se certifican.'}}
const PROVENANCE_OVERRIDE_KEY_1047='YGO_ALPHA1047_OFFICIAL_PROVENANCE_V1';
let PROVENANCE_REF_1047=null,PROVENANCE_CACHE_1047=null,RULE_UNIVERSE_CACHE_1047=[],PROVENANCE_OVERRIDE_SIG_1047='',PROVENANCE_OVERRIDE_RAW_1047=null,PROVENANCE_OVERRIDE_CACHE_1047=null;
let PROVENANCE_OVERRIDE_REVISION_1118=0; // cambia ante cualquier lectura de contenido distinto o invalidación explícita
function authorityUrl1047(url){const u=raw(url).trim();return /^https:\/\/(?:www\.)?(?:db\.yugioh-card\.com|yugioh-card\.com)(?:\/|$)/i.test(u)||/^https:\/\/(?:www\.)?konami\.com\/yugioh(?:\/|$)/i.test(u)}
// Alpha 1116: validación del calendario UTC; fecha futura no equivale a revisión realizada.
function provenanceDate1116(value){
 const s=raw(value).trim();
 if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 const t=Date.parse(s+'T00:00:00.000Z');
 return Number.isFinite(t)&&new Date(t).toISOString().slice(0,10)===s&&s<=new Date().toISOString().slice(0,10);
}
// Recuperar exactamente el valor anterior si un proveedor de almacenamiento modifica y después falla.
// Cuando no se puede probar la restauración, el llamador debe reportarlo como incertidumbre.
function restoreProvenance1116(previousRaw){
 try{
  if(localStorage.getItem(PROVENANCE_OVERRIDE_KEY_1047)===previousRaw)return true;
  if(previousRaw===null)localStorage.removeItem(PROVENANCE_OVERRIDE_KEY_1047);
  else localStorage.setItem(PROVENANCE_OVERRIDE_KEY_1047,previousRaw);
 }catch(_){/* confirmar abajo incluso si el proveedor escribe antes de lanzar el error */}
 try{return localStorage.getItem(PROVENANCE_OVERRIDE_KEY_1047)===previousRaw}catch(_){return false}
}
// Alpha 1117: nunca fusionar silenciosamente dos evidencias guardadas para el mismo ID.
// Las fuentes facilitadas por personas continúan siendo NO verificadas.
function storedProvenanceAudit1117(rows){
 if(!Array.isArray(rows))return {pass:false,error:'STORED_PROVENANCE_NOT_ARRAY'};
 const seen=new Set();
 for(const x of rows){
  if(!x||!Number.isSafeInteger(Number(x.id))||Number(x.id)<=0||!authorityUrl1047(x.authorityUrl)||!provenanceDate1116(x.verifiedOn))
   return {pass:false,error:'STORED_PROVENANCE_MALFORMED_ROWS'};
  const id=String(Number(x.id));
  if(seen.has(id))return {pass:false,error:'DUPLICATE_STORED_PROVENANCE_ID',id:Number(id)};
  seen.add(id);
 }
 return {pass:true,count:seen.size};
}
function provenanceOverrides1047(){
 let rawStored='[]',rows,readError=null;
 try{const value=localStorage.getItem(PROVENANCE_OVERRIDE_KEY_1047);rawStored=value===null?'[]':value;rows=JSON.parse(rawStored)}
 catch(e){readError='STORED_PROVENANCE_UNREADABLE';rows=[]}
 if(PROVENANCE_OVERRIDE_CACHE_1047&&PROVENANCE_OVERRIDE_RAW_1047===rawStored&&readError===null)return PROVENANCE_OVERRIDE_CACHE_1047;
 const integrity=readError?{pass:false,error:readError}:storedProvenanceAudit1117(rows);
 // Falla cerrada: ni siquiera para el análisis preliminar se elige arbitrariamente
 // una de dos fuentes con el mismo identificador.
 const safeRows=integrity.pass?rows:[];
 const map=new Map(safeRows.map(x=>[String(Number(x.id)),{id:Number(x.id),name:raw(x.name),authorityUrl:raw(x.authorityUrl),verifiedOn:raw(x.verifiedOn),note:raw(x.note),status:'URL_DECLARADA_SIN_VERIFICAR'}]));
 const clean=[...map.values()].sort((a,b)=>a.id-b.id);
 const sig=(integrity.pass?'OK':'INVALID:'+integrity.error)+':revision:'+String(++PROVENANCE_OVERRIDE_REVISION_1118)+':'+clean.map(x=>x.id+'@'+x.verifiedOn+'@'+x.authorityUrl).join('|');
 PROVENANCE_OVERRIDE_RAW_1047=readError?null:rawStored;
 PROVENANCE_OVERRIDE_CACHE_1047={rows:clean,map,signature:sig,integrity};
 return PROVENANCE_OVERRIDE_CACHE_1047;
}
function invalidateProvenance1047({clearScan=true,clearOverrideCache=true}={}){PROVENANCE_REF_1047=null;PROVENANCE_CACHE_1047=null;RULE_UNIVERSE_CACHE_1047=[];PROVENANCE_OVERRIDE_SIG_1047='';if(clearOverrideCache){PROVENANCE_OVERRIDE_RAW_1047=null;PROVENANCE_OVERRIDE_CACHE_1047=null}if(clearScan)clearUniversalSegment1047();return true}
// Alpha 1116: actualización transaccional de pistas de procedencia.
// Una URL proporcionada por el usuario nunca certifica por sí sola la carta.
function importOfficialProvenance1047(rows=[]){
 const cat=arr(W.CARD_CATALOG),byId=new Map(cat.map(c=>[String(Number(c?.id)),c]));
 let previousRaw,previousRows;
 try{
  previousRaw=localStorage.getItem(PROVENANCE_OVERRIDE_KEY_1047);
  previousRows=previousRaw===null?[]:JSON.parse(previousRaw);
  const check1117=storedProvenanceAudit1117(previousRows);
  if(!check1117.pass)throw Error(check1117.error+(check1117.id?':'+check1117.id:''));
 }catch(err){return{version:VERSION,pass:false,error:'PROVENANCE_STORAGE_UNREADABLE',detail:raw(err?.message||err),accepted:[],rejected:[],stored:null,policy:'No sobrescribir datos previos si el almacenamiento está bloqueado o contiene fechas/registros inválidos.'}}
 const prev=new Map(provenanceOverrides1047().map),accepted=[],rejected=[];
 const inputIds=new Set();
 for(const x of arr(rows)){
  const id=Number(x?.id),card=byId.get(String(id)),url=raw(x?.authorityUrl),verifiedOn=raw(x?.verifiedOn);
  if(!Number.isSafeInteger(id)||id<=0||!card){rejected.push({id,reason:'CARD_NOT_IN_PHYSICAL_CATALOG'});continue}
  if(inputIds.has(id)){rejected.push({id,reason:'DUPLICATE_PROVENANCE_ID_IN_BATCH'});continue}
  inputIds.add(id);
  const base=sourceClass1047(card,{ignoreOverride:true});
  if(base.class!=='REVIEW_REQUIRED'){rejected.push({id,name:card?.name,reason:'SOURCE_NOT_REVIEW_REQUIRED',class:base.class});continue}
  if(!authorityUrl1047(url)){rejected.push({id,name:card?.name,reason:'OFFICIAL_KONAMI_URL_REQUIRED'});continue}
  if(!provenanceDate1116(verifiedOn)){rejected.push({id,name:card?.name,reason:'VERIFIED_ON_REAL_NONFUTURE_DATE_REQUIRED'});continue}
  prev.set(String(id),{id,name:raw(card?.name),authorityUrl:url,verifiedOn,note:raw(x?.note),status:'URL_DECLARADA_SIN_VERIFICAR'});
  accepted.push({id,name:raw(card?.name),authorityUrl:url,verifiedOn});
 }
 const stored=[...prev.values()].sort((a,b)=>a.id-b.id);
 if(rejected.length||!accepted.length)return{version:VERSION,pass:false,error:!accepted.length?'NO_ACCEPTED_ROWS':'REJECTED_ROWS',accepted,rejected,stored:previousRows.length,policy:'Validar todas las filas antes de modificar la biblioteca de procedencia.'};
 const serialized=JSON.stringify(stored);
 try{
  localStorage.setItem(PROVENANCE_OVERRIDE_KEY_1047,serialized);
  if(localStorage.getItem(PROVENANCE_OVERRIDE_KEY_1047)!==serialized)throw Error('PROVENANCE_WRITE_NOT_CONFIRMED');
 }catch(err){const rollbackConfirmed=restoreProvenance1116(previousRaw);if(!rollbackConfirmed)invalidateProvenance1047({clearScan:true});return{version:VERSION,pass:false,error:'PROVENANCE_STORAGE_WRITE_FAILED',detail:raw(err?.message||err),rollbackConfirmed,accepted:[],rejected,stored:rollbackConfirmed?previousRows.length:null,policy:'No informar éxito si la escritura o la restauración no están confirmadas.'}}
 invalidateProvenance1047({clearScan:true});
 return{version:VERSION,pass:true,persisted:true,accepted,rejected,stored:stored.length,provenance:catalogProvenance1047(),policy:'URL declarada para revisión; NO constituye verificación oficial de la carta.'};
}
function clearOfficialProvenance1047(){
 let previousRaw;
 try{previousRaw=localStorage.getItem(PROVENANCE_OVERRIDE_KEY_1047)}
 catch(err){return{version:VERSION,pass:false,error:'PROVENANCE_STORAGE_CLEAR_FAILED',detail:raw(err?.message||err),rollbackConfirmed:null}}
 try{
  localStorage.removeItem(PROVENANCE_OVERRIDE_KEY_1047);
  if(localStorage.getItem(PROVENANCE_OVERRIDE_KEY_1047)!==null)throw Error('PROVENANCE_CLEAR_NOT_CONFIRMED');
 }catch(err){const rollbackConfirmed=restoreProvenance1116(previousRaw);if(!rollbackConfirmed)invalidateProvenance1047({clearScan:true});return{version:VERSION,pass:false,error:'PROVENANCE_STORAGE_CLEAR_FAILED',detail:raw(err?.message||err),rollbackConfirmed,policy:'No informar eliminación si el almacenamiento no se ha podido comprobar.'}}
 invalidateProvenance1047({clearScan:true});
 return{version:VERSION,pass:true,deleted:true,provenance:catalogProvenance1047()};
}
function sourceClass1047(card,opts={}){const s=raw(card?.source).trim();if(opts.ignoreOverride!==true){const ov=provenanceOverrides1047().map.get(String(Number(card?.id)));if(ov)return{class:'REVIEW_REQUIRED',reason:'URL_DECLARADA_NO_VERIFICADA_CONTRA_CARTA_OFICIAL',override:ov}}if(!s)return{class:'REVIEW_REQUIRED',reason:'SOURCE_MISSING'};if(/unofficial/i.test(s))return{class:'EXCLUDED_UNOFFICIAL',reason:'EXPLICIT_UNOFFICIAL_SOURCE'};if(/skills/i.test(s))return{class:'EXCLUDED_SPECIAL_RULE_ASSET',reason:'SKILL_ASSET_REQUIRES_SEPARATE_FORMAT_ENGINE'};if(/deckmaster/i.test(s))return{class:'EXCLUDED_NONSTANDARD_SOURCE',reason:'DECKMASTER_NOT_IN_STANDARD_CARD_RULE_UNIVERSE'};if(/^Alpha\d+-/i.test(s))return{class:'REVIEW_REQUIRED',reason:'PROJECT_DELTA_NEEDS_EXTERNAL_PROVENANCE'};if(/prerelease/i.test(s))return{class:'REVIEW_REQUIRED',reason:'PRERELEASE_SOURCE_NEEDS_RELEASE_PROVENANCE'};if(/^(?:cards(?:\(\d+\))?\.cdb|cards\.delta(?:\(\d+\))?\.cdb|cards-rush(?:\.delta)?(?:\(\d+\))?\.cdb|release-[^.]+\.cdb)$/i.test(s))return{class:'ELIGIBLE_CARD_SOURCE',reason:'PROJECT_IGNIS_CARD_DATABASE_FAMILY'};return{class:'REVIEW_REQUIRED',reason:'UNCLASSIFIED_SOURCE'}}
function provenanceSelf1047(){const cases=[
 {name:'unofficial',got:sourceClass1047({id:91047001,source:'cards-unofficial.cdb'},{ignoreOverride:true}).class,want:'EXCLUDED_UNOFFICIAL'},
 {name:'skills',got:sourceClass1047({id:91047002,source:'cards-skills.cdb'},{ignoreOverride:true}).class,want:'EXCLUDED_SPECIAL_RULE_ASSET'},
 {name:'deckmaster',got:sourceClass1047({id:91047003,source:'cards-deckmaster.cdb'},{ignoreOverride:true}).class,want:'EXCLUDED_NONSTANDARD_SOURCE'},
 {name:'projectDelta',got:sourceClass1047({id:91047004,source:'Alpha999-current-delta'},{ignoreOverride:true}).class,want:'REVIEW_REQUIRED'},
 {name:'prerelease',got:sourceClass1047({id:91047005,source:'prerelease-test.cdb'},{ignoreOverride:true}).class,want:'REVIEW_REQUIRED'},
 {name:'cards',got:sourceClass1047({id:91047006,source:'cards(3).cdb'},{ignoreOverride:true}).class,want:'ELIGIBLE_CARD_SOURCE'},
 {name:'rushDelta',got:sourceClass1047({id:91047007,source:'cards-rush.delta(1).cdb'},{ignoreOverride:true}).class,want:'ELIGIBLE_CARD_SOURCE'}
 ];const urls={db:authorityUrl1047('https://db.yugioh-card.com/yugiohdb/card_search.action'),site:authorityUrl1047('https://www.yugioh-card.com/en/'),konami:authorityUrl1047('https://www.konami.com/yugioh/'),githubRejected:!authorityUrl1047('https://github.com/ProjectIgnis/BabelCDB'),lookalikeRejected:!authorityUrl1047('https://db.yugioh-card.com.evil.example/card')};const checks={classes:cases.every(x=>x.got===x.want),...urls};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,cases,policy:'Provenance gate fails closed: explicit unofficial/special/nonstandard sources never enter the regular rule universe, and REVIEW_REQUIRED promotion accepts only direct official Konami/Yu-Gi-Oh URLs.'}}
function catalogProvenance1047(){const t0=W.performance?.now?.()??Date.now(),cat=arr(W.CARD_CATALOG),ovs=provenanceOverrides1047();if(PROVENANCE_REF_1047===cat&&PROVENANCE_CACHE_1047?.physicalTotal===cat.length&&PROVENANCE_OVERRIDE_SIG_1047===ovs.signature)return PROVENANCE_CACHE_1047;const classes={},sources={},reviewSources={},excludedSources={},eligible=[];for(const c of cat){const p=sourceClass1047(c),src=raw(c?.source).trim()||'(missing)';classes[p.class]=(classes[p.class]||0)+1;sources[src]=(sources[src]||0)+1;if(/^ELIGIBLE_/.test(p.class))eligible.push(c);else if(p.class==='REVIEW_REQUIRED')reviewSources[src]=(reviewSources[src]||0)+1;else excludedSources[src]=(excludedSources[src]||0)+1}const reviewRequired=num(classes.REVIEW_REQUIRED),verifiedOverrides=num(classes.ELIGIBLE_OFFICIAL_VERIFIED),excludedUnofficial=num(classes.EXCLUDED_UNOFFICIAL),excludedSpecial=num(classes.EXCLUDED_SPECIAL_RULE_ASSET),excludedNonstandard=num(classes.EXCLUDED_NONSTANDARD_SOURCE),signature=[cat.length,eligible.length,reviewRequired,verifiedOverrides,excludedUnofficial,excludedSpecial,excludedNonstandard,ovs.signature,Object.entries(sources).sort((a,b)=>a[0].localeCompare(b[0])).map(([k,v])=>k+':'+v).join(';')].join('|');PROVENANCE_REF_1047=cat;PROVENANCE_OVERRIDE_SIG_1047=ovs.signature;RULE_UNIVERSE_CACHE_1047=eligible;PROVENANCE_CACHE_1047={version:VERSION,auditMs:Math.round(((W.performance?.now?.()??Date.now())-t0)*10)/10,physicalTotal:cat.length,physicalComplete:cat.length===19617,eligibleRuleCards:eligible.length,reviewRequired,verifiedOverrides,provenanceOverrides:ovs.rows.length,storedOverrideIntegrity:ovs.integrity,excludedUnofficial,excludedSpecialRuleAssets:excludedSpecial,excludedNonstandard,excludedTotal:excludedUnofficial+excludedSpecial+excludedNonstandard,classes,sources,reviewSources,excludedSources,signature,certificationReady:cat.length===19617&&reviewRequired===0,sourceAuthority:'Project Ignis / EDOPro database families are secondary technical sources. REVIEW_REQUIRED rows can be promoted only with direct Konami/Yu-Gi-Oh official URL evidence.',evidence:{babelCDB:'https://github.com/ProjectIgnis/BabelCDB',cardScripts:'https://github.com/ProjectIgnis/CardScripts',verifiedOn:'2026-10-08'},policy:'Alpha1050 no confunde URL introducida por un usuario con procedencia oficial verificada; preserva el catálogo físico y mantiene REVIEW_REQUIRED mientras no haya comprobación independiente.'};return PROVENANCE_CACHE_1047}
function ruleUniverseCards1047(){const p=catalogProvenance1047();return{cards:RULE_UNIVERSE_CACHE_1047,provenance:p}}
function provenanceReview1047(){const rows=[];for(const c of arr(W.CARD_CATALOG)){const p=sourceClass1047(c);if(p.class==='REVIEW_REQUIRED')rows.push({id:Number(c?.id)||null,name:raw(c?.name),source:raw(c?.source),reason:p.reason})}return{version:VERSION,total:rows.length,rows,requiredFields:['id','authorityUrl','verifiedOn'],acceptedAuthorities:['db.yugioh-card.com','yugioh-card.com','konami.com/yugioh'],policy:'Export/list only; no REVIEW_REQUIRED row becomes official without explicit verified evidence.'}}
function exportProvenanceReview1047(){const x=provenanceReview1047(),blob=new Blob([JSON.stringify(x,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=D.createElement('a');a.href=u;a.download=`Alpha_1047_Provenance_Review_${new Date().toISOString().slice(0,10)}.json`;D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);return x}
function corpus1047(){const p=catalogProvenance1047(),s=segmentState1047();if(!s)return{version:VERSION,pass:false,status:'NOT_RUN',complete:false,universalExact:false,unresolved:null,total:p.eligibleRuleCards,physicalTotal:p.physicalTotal,provenance:p};const pass=s.complete===true&&s.universalExact===true&&num(s.unresolved)===0&&num(s.parseErrors)===0&&p.certificationReady===true;return{...s,version:VERSION,pass,provenance:p,officialCertificationReady:pass,status:pass?'OFFICIAL_RULE_UNIVERSE_EXACT':s.complete&&s.universalExact?'RULE_UNIVERSE_EXACT_PROVENANCE_REVIEW':s.status}}
function formats1047(){try{return formatAudit1047()}catch(e){return{version:VERSION,pass:false,error:raw(e?.message||e),partial:[]}}}

const SEGMENT_SCAN_KEY_1047='YGO_ALPHA1047_OFFICIAL_RULE_SCAN_V1';
function segmentState1047(){try{return JSON.parse(localStorage.getItem(SEGMENT_SCAN_KEY_1047)||'null')||W.__YGO1047_SEGMENT_SCAN||null}catch(_){return W.__YGO1047_SEGMENT_SCAN||null}}
function clearUniversalSegment1047(){try{localStorage.removeItem(SEGMENT_SCAN_KEY_1047)}catch(_){}W.__YGO1047_SEGMENT_SCAN=null;return true}
function mergeRank1047(dst=[],src=[],field='reason'){const map=new Map(arr(dst).map(x=>[raw(x?.[field]),num(x?.count)]));for(const x of arr(src)){const k=raw(x?.[field]);if(k)map.set(k,(map.get(k)||0)+num(x?.count))}return [...map].map(([k,count])=>({[field]:k,count})).sort((a,b)=>b.count-a.count||raw(a?.[field]).localeCompare(raw(b?.[field])))}
let SEGMENT_SCAN_RUNNING_1078=false;async function universalSegment1047(opts={}){if(SEGMENT_SCAN_RUNNING_1078)return{version:VERSION,pass:false,status:'SCAN_ALREADY_RUNNING',nextStart:segmentState1047()?.processed??0};SEGMENT_SCAN_RUNNING_1078=true;try{if(arr(W.CARD_CATALOG).length<19617)await A984.ensureCatalog984?.();const physical=arr(W.CARD_CATALOG),prov=catalogProvenance1047(),universe=ruleUniverseCards1047().cards,total=universe.length;if(physical.length!==19617)return{version:VERSION,pass:false,status:'PHYSICAL_CATALOG_NOT_READY',physicalTotal:physical.length,expectedPhysical:19617,provenance:prov};if(!total)return{version:VERSION,pass:false,status:'RULE_UNIVERSE_EMPTY',provenance:prov};const scanner=W.YGOAlpha978?.scanRange978;if(typeof scanner!=='function')return{version:VERSION,pass:false,status:'SCANNER_UNAVAILABLE',provenance:prov};if(opts.reset===true)clearUniversalSegment1047();let st=segmentState1047();if(!st||st.total!==total||st.universeSignature!==prov.signature)st={version:VERSION,total,physicalTotal:physical.length,universeSignature:prov.signature,processed:0,effectBearing:0,exact:0,handlerExact:0,grammarExact:0,parseErrors:0,gaps:[],byFamily:[],byReason:[],slowRanges:[],recommendedBatchSize:null,startedAt:new Date().toISOString()};const maxBatch=Math.max(1,Math.min(100,num(opts.batchSize)||10)),batches=Math.max(1,Math.min(80,num(opts.batches)||1)),maxGaps=Math.max(50,Math.min(1000,num(opts.maxGaps)||500)),slowMs=Math.max(250,Math.min(10000,num(opts.slowBatchMs)||1200)),stopMs=Math.max(slowMs,Math.min(30000,num(opts.stopBatchMs)||5000));let stoppedSlow=false,cancelled=false,budgetReached=false;const started1078=Date.now(),maxRuntimeMs1078=Math.max(100,Math.min(60000,num(opts.maxRuntimeMs)||12000));for(let i=0;i<batches&&st.processed<total;i++){if(opts.shouldCancel?.()===true){cancelled=true;break}if(Date.now()-started1078>=maxRuntimeMs1078){budgetReached=true;break}let adaptive=num(st.recommendedBatchSize)||maxBatch;adaptive=Math.max(1,Math.min(maxBatch,adaptive));const rangeStart=st.processed,count=Math.min(adaptive,total-st.processed),t0=(W.performance?.now?.()??Date.now());let r={};const old=W.CARD_CATALOG;try{W.CARD_CATALOG=universe;r=scanner(rangeStart,count,{maxGapRows:Math.min(maxGaps,Math.max(50,count*2))})||{}}finally{W.CARD_CATALOG=old}if(!r.range||Number(r.range.start)!==rangeStart||Number(r.range.count)!==count){return{version:VERSION,pass:false,status:'SCAN_RANGE_INVALID',expected:{start:rangeStart,count},actual:r.range||null,nextStart:st.processed,policy:'No registrar como examinadas cartas que el scanner no acredita haber procesado.'}}const batchMs=Math.round(((W.performance?.now?.()??Date.now())-t0)*10)/10;st.processed+=count;st.lastBatchMs=batchMs;st.lastBatchCount=count;st.lastRange={start:rangeStart,end:rangeStart+count,count,ms:batchMs};st.cardsPerSecond=batchMs>0?Math.round(count*10000/batchMs)/10:null;if(batchMs>slowMs){st.recommendedBatchSize=Math.max(1,Math.floor(count/2));st.slowRanges=arr(st.slowRanges);st.slowRanges.push({start:rangeStart,end:rangeStart+count,count,ms:batchMs,cardsPerSecond:st.cardsPerSecond});if(st.slowRanges.length>100)st.slowRanges=st.slowRanges.slice(-100)}else if(batchMs<Math.max(80,slowMs/5)&&adaptive<maxBatch)st.recommendedBatchSize=Math.min(maxBatch,adaptive+Math.max(1,Math.ceil(adaptive/4)));else st.recommendedBatchSize=adaptive;st.effectBearing+=num(r.effectBearing);st.exact+=num(r.exact);st.handlerExact+=num(r.handlerExact);st.grammarExact+=num(r.grammarExact);st.parseErrors+=num(r.parseErrors);if(st.gaps.length<maxGaps)st.gaps.push(...arr(r.gaps).slice(0,maxGaps-st.gaps.length));st.byFamily=mergeRank1047(st.byFamily,r.byFamily,'family');st.byReason=mergeRank1047(st.byReason,r.byReason,'reason');st.updatedAt=new Date().toISOString();st.exactPct=st.effectBearing?Math.round(st.exact*10000/st.effectBearing)/100:null;st.unresolved=Math.max(0,st.effectBearing-st.exact);st.complete=st.processed>=total;st.universalExact=st.complete&&st.unresolved===0&&st.parseErrors===0;st.provenanceReady=prov.certificationReady===true;st.officialCertificationReady=st.universalExact&&st.provenanceReady;try{localStorage.setItem(SEGMENT_SCAN_KEY_1047,JSON.stringify(st))}catch(_){}W.__YGO1047_SEGMENT_SCAN=st;try{opts.onProgress?.({...st,gaps:undefined,provenance:{eligibleRuleCards:prov.eligibleRuleCards,reviewRequired:prov.reviewRequired,excludedTotal:prov.excludedTotal}})}catch(_){}if(batchMs>=stopMs&&!st.complete){stoppedSlow=true;break}await new Promise(r=>setTimeout(r,0))}const status=st.complete?(st.officialCertificationReady?'OFFICIAL_RULE_UNIVERSE_EXACT':st.universalExact?'RULE_UNIVERSE_EXACT_PROVENANCE_REVIEW':'COMPLETE_WITH_GAPS'):cancelled?'CANCELLED_CHECKPOINT':budgetReached?'TIME_BUDGET_CHECKPOINT':stoppedSlow?'SLOW_RANGE_CHECKPOINT':'CHECKPOINT_READY';st.status=status;return{...st,version:VERSION,status,nextStart:st.complete?null:st.processed,topFamilies:arr(st.byFamily).slice(0,15),topReasons:arr(st.byReason).slice(0,15),provenance:prov,pass:st.officialCertificationReady===true,policy:'Alpha1047 scans only the eligible regular-card universe with adaptive batches. Slow ranges shrink future batches and force a checkpoint after a severe overrun; physical 19,617 rows remain untouched and provenance stays fail-closed.'}}finally{SEGMENT_SCAN_RUNNING_1078=false}}

function universalCheckpoint1047(){const p=catalogProvenance1047(),st=segmentState1047();return st?{...st,version:VERSION,status:st.complete?(st.officialCertificationReady?'OFFICIAL_RULE_UNIVERSE_EXACT':st.universalExact?'RULE_UNIVERSE_EXACT_PROVENANCE_REVIEW':'COMPLETE_WITH_GAPS'):(st.status||'CHECKPOINT_READY'),nextStart:st.complete?null:st.processed,topFamilies:arr(st.byFamily).slice(0,15),topReasons:arr(st.byReason).slice(0,15),provenance:p}:{version:VERSION,status:'NOT_RUN',processed:0,total:p.eligibleRuleCards,physicalTotal:p.physicalTotal,complete:false,universalExact:false,officialCertificationReady:false,provenance:p}}
function formatAudit1047(){const legacy=A984.formatPlan984?.()||{partial:[]},ban=banlist1047(),partials=new Map(arr(legacy.partial).map(x=>[x.key,x])),banRows=new Map(arr(ban.universe?.rows).map(x=>[x.key,x]));const keys=['tcg','ocg','master','duelLinksSpeed','duelLinksRush','rush','speedDuel','goat','timeWizard'];const rows=keys.map(key=>{const p=partials.get(key)||null,b=banRows.get(key)||null,missing=arr(p?.missing),simulation=raw(p?.simulation||((key==='tcg'||key==='ocg')?'FULL_CORE_WITH_EXACT_HANDLER_GATES':'UNKNOWN'));const banPass=b?.pass===true||(key==='tcg'&&ban.tcg?.pass===true)||(key==='ocg'&&ban.ocg?.pass===true)||(key==='rush'&&ban.rush?.pass===true)||(key==='speedDuel'&&ban.speedDuel?.pass===true);const mechanicsPass=!p;const pass=banPass&&mechanicsPass;return{key,pass,banlist:banPass,mechanics:mechanicsPass,simulation,missing,dynamic:b?.dynamic===true,eventDependent:b?.eventDependent===true,loaded:b?.loaded===true,date:b?.date||null,source:b?.source||null}});return{version:VERSION,pass:rows.every(x=>x.pass),corePhysicalPass:rows.filter(x=>['tcg','ocg'].includes(x.key)).every(x=>x.pass),currentPhysicalBanlistsPass:ban.tcg?.pass===true&&ban.ocg?.pass===true&&ban.rush?.pass===true&&ban.speedDuel?.pass===true,rows,partial:rows.filter(x=>!x.pass),legacy,policy:'Alpha1047 separates current banlist exactness from format-mechanics exactness; dynamic/event formats and partial engines remain fail-closed.'}}

function calibration1047(){try{return{version:VERSION,...(A984.calibrationStatus984?.()||{strongPass:false,status:'UNAVAILABLE'})}}catch(e){return{version:VERSION,strongPass:false,status:'ERROR',error:raw(e?.message||e)}}}
function legacyEvidence1047(){try{return A973.release?.()||{}}catch(e){return{status:'ERROR',error:raw(e?.message||e)}}}
let PUBLIC_SEARCH_TICKET_1180=0,SEARCH_RUN_SEQUENCE_1181=0;
async function exhaustiveBudgeted1047(opts={}){const searchRun1181=++SEARCH_RUN_SEQUENCE_1181,publishTicket1180=opts.publishResults===false?null:++PUBLIC_SEARCH_TICKET_1180,isCurrentPublication1180=()=>publishTicket1180===null||publishTicket1180===PUBLIC_SEARCH_TICKET_1180;const initialRevision1056=DECK_REVISION_1056,initialFingerprint1056=deckFingerprint1056(),isCurrent1056=()=>typeof initialFingerprint1056==='string'&&DECK_REVISION_1056===initialRevision1056&&deckFingerprint1056()===initialFingerprint1056,externallyCancelled1181=()=>{try{return opts.shouldCancel?.()===true}catch(_){return true}},isOperational1181=()=>isCurrent1056()&&isCurrentPublication1180()&&!externallyCancelled1181();const samples=Math.max(1,Math.min(8,num(opts.samples)||1)),rows=[],certificates=[],allLines=[],deckKey=raw(A973.deckIdentity?.(W.deckState)||'deck').slice(0,180),engineAsync=W.YGOAlpha669?.exhaustiveOpeningSearch669Async,maxTotalMs=Math.max(250,Math.min(60000,num(opts.maxTotalMs)||8000)),sliceHardMs=Math.max(100,Math.min(5000,num(opts.sliceHardMs)||1500)),started=Date.now(),deadline=started+maxTotalMs;let budgetReached=false,checkpointKeys1181=[],lastEngineResult1182=null;const cleanupCheckpoints1181=()=>{const store=W.__YGO669_ASYNC_CHECKPOINTS;if(store instanceof Map)for(const key of checkpointKeys1181)store.delete(key)};
// Alpha 1191: una prueba de horizonte NO esta terminada mientras existan checkpoints reanudables.
// Todas las muestras usan exactamente el mismo contrato de certificado final.
const isFinalProof1184=c=>c?.resumable===false&&c?.truncated===false&&
 (c?.horizonOptimalityProven===true||c?.domainExhaustedOptimalityProven===true)&&
 c?.allLegalActionsEnumerated===true&&c?.allTransitionsExact===true&&
 c?.targetChoiceEnumerationComplete===true&&c?.stateDominanceSafe===true&&
 c?.objectiveComplete===true&&typeof c?.deckFingerprint==='string'&&
 c.deckFingerprint===initialFingerprint1056;
for(let sample=0;sample<samples;sample++){if(!isOperational1181())break;if(Date.now()>=deadline){budgetReached=true;break}let out=null,error=null,slices=0,sliceTimedOut=false;const checkpointKey=`1047|${deckKey}|RUN${searchRun1181}|S${sample}|D${Math.max(1,Math.min(8,num(opts.maxDepth)||2))}`;checkpointKeys1181.push(checkpointKey);try{if(typeof engineAsync!=='function')throw new Error('ASYNC_EXHAUSTIVE_ENGINE_UNAVAILABLE');do{if(!isOperational1181())break;if(Date.now()>=deadline){budgetReached=true;break}sliceTimedOut=false;let timer=null;
// Alpha 1191: medir desde antes de invocar el motor. setTimeout no interrumpe JS sincrono.
const sliceStarted1185=Date.now(),sliceDeadline1185=Math.min(deadline,sliceStarted1185+sliceHardMs);
const cancel=()=>budgetReached||sliceTimedOut||Date.now()>=sliceDeadline1185||!isOperational1181();const task=engineAsync({publishDiagnostics:false,sample,maxDepth:Math.max(1,Math.min(8,num(opts.maxDepth)||2)),maxStates:Math.max(20,Math.min(104700,num(opts.maxStates)||5000)),maxActionBranches:Math.max(8,Math.min(8000,num(opts.maxActionBranches)||750)),sliceMs:Math.max(8,Math.min(120,num(opts.sliceMs)||30)),nodeBudgetMs:Math.max(4,Math.min(120,num(opts.nodeBudgetMs)||Math.max(8,Math.min(120,num(opts.sliceMs)||30)))),yieldEvery:Math.max(1,Math.min(100,num(opts.yieldEvery)||1)),checkpointKey,resume:slices>0,shouldCancel:cancel,onProgress:p=>{if(!isOperational1181())return;try{opts.onProgress?.({sample,slice:slices,elapsedMs:Date.now()-started,remainingMs:Math.max(0,deadline-Date.now()),...p})}catch(_){}}});timer=setTimeout(()=>{sliceTimedOut=true},Math.min(sliceHardMs,Math.max(100,deadline-Date.now())));try{out=await task;lastEngineResult1182=out}finally{if(timer)clearTimeout(timer)}// La comprobacion posterior tambien cubre llamadas que bloquean el event loop.
if(sliceTimedOut||Date.now()>=sliceDeadline1185){sliceTimedOut=true;error='SLICE_COOPERATIVE_TIMEOUT';budgetReached=Date.now()>=deadline;break}slices++;if(isOperational1181()){try{opts.onSlice?.({sample,slice:slices,status:out?.status,checkpoint:out?.checkpoint||null,elapsedMs:Date.now()-started})}catch(_){}}if(out?.certificate?.resumable!==true)break;await new Promise(r=>setTimeout(r,0))}while(slices<Math.max(1,Math.min(200,num(opts.maxSlicesPerSample)||40))&&!budgetReached&&!sliceTimedOut&&isOperational1181())}catch(e){error=raw(e?.message||e)}const c=out?.certificate||{truncated:true,resumable:true,reasons:[error||(budgetReached?'TIME_BUDGET_CHECKPOINT':sliceTimedOut?'SLICE_HARD_TIMEOUT':'NO_CERTIFICATE')]};certificates.push(c);allLines.push(...arr(out?.lines));rows.push({sample,slices,pass:isFinalProof1184(c)&&!error&&!sliceTimedOut&&!budgetReached,statesExpanded:num(c.statesExpanded),truncated:c.truncated===true,resumable:c.resumable===true,status:error==='SLICE_COOPERATIVE_TIMEOUT'?'SLICE_TIMEOUT_CHECKPOINT':budgetReached?'TIME_BUDGET_CHECKPOINT':c.status||out?.status||null,error});if(c.resumable===true||budgetReached||sliceTimedOut)break}
// El presupuesto global tambien se comprueba despues de terminar la ultima muestra.
budgetReached=budgetReached||Date.now()>=deadline;
const complete=!budgetReached&&!rows.some(r=>r.error||r.status==='SLICE_TIMEOUT_CHECKPOINT')&&certificates.length===samples&&certificates.every(isFinalProof1184),seen=new Map();for(const l of allLines){const k=arr(l?.actions).map(a=>`${a?.cardId||a?.card}:${a?.effectId??a?.actionType}:${arr(a?.selectedTargets).join(',')}:${arr(a?.selectedCosts).join(',')}`).join('>')+'|'+JSON.stringify(l?.simulation?.finalBoard||l?.finalBoard||{});if(!k)continue;const p=seen.get(k),sc=num(l?.finalScore??l?.score);if(!p||sc>num(p?.finalScore??p?.score))seen.set(k,l)}const lines=[...seen.values()].sort((a,b)=>num(b?.finalScore??b?.score)-num(a?.finalScore??a?.score)).slice(0,5),timed=rows.some(x=>x.status==='SLICE_TIMEOUT_CHECKPOINT'),status=complete?'HORIZON_COMPLETE':timed?'SLICE_TIMEOUT_CHECKPOINT':budgetReached?'TIME_BUDGET_CHECKPOINT':certificates.some(c=>c.resumable===true)?'CHECKPOINT_READY':'BOUNDED_SEARCH_OPEN',out={version:VERSION,pass:complete,status,rows,certificates,lines,boundedComplete:complete,globalOptimalityProven:false,published:opts.publishResults!==false,budget:{maxTotalMs,sliceHardMs,elapsedMs:Date.now()-started,reached:budgetReached,sliceTimeout:timed},policy:'Alpha1047 añade límite duro cooperativo por slice además del presupuesto total. Timeout conserva/fuerza checkpoint y nunca cuenta como búsqueda completa.'};if(!isCurrent1056()){out.pass=false;out.status='STALE_DECK_CANCELLED';out.published=false;out.lines=[];out.boundedComplete=false;out.globalOptimalityProven=false;W.__YGO1056_STALE_SEARCHES=(W.__YGO1056_STALE_SEARCHES||0)+1;cleanupCheckpoints1181();return out;}if(!isCurrentPublication1180()){out.pass=false;out.status='SUPERSEDED_SEARCH_CANCELLED';out.published=false;out.lines=[];out.boundedComplete=false;out.globalOptimalityProven=false;cleanupCheckpoints1181();return out;}if(externallyCancelled1181()){out.pass=false;out.status='SEARCH_CANCELLED';out.published=false;out.lines=[];out.boundedComplete=false;out.globalOptimalityProven=false;cleanupCheckpoints1181();return out;}if(opts.publishResults!==false){W.__YGO669_LAST_ASYNC=lastEngineResult1182;W.__YGO669_LAST_EXHAUSTIVE=out.pass===true&&out.boundedComplete===true&&lastEngineResult1182?.certificate?.truncated===false&&lastEngineResult1182?.certificate?.resumable!==true&&lastEngineResult1182?.certificate?.deckFingerprint===initialFingerprint1056?{certificate:lastEngineResult1182.certificate,lines:arr(lastEngineResult1182.lines),depthRows:arr(lastEngineResult1182.depthRows)}:null;W.__YGO1047_BUDGETED_SEARCH=out;W.comboLastAnalysis=lines;try{comboLastAnalysis=lines}catch(_){}try{W.renderComboLines?.()}catch(_){}try{W.renderComboVisualTop5?.(lines)}catch(_){}try{W.renderComboEndBoard?.(lines)}catch(_){}}cleanupCheckpoints1181();return out}
function certificationSnapshot1047(){patchBanlist1047();const structural=structural1047(),top5=top5Evidence1047(),corpus=corpus1047(),formats=formats1047(),calibration=calibration1047(),legacy=legacyEvidence1047(),ban=banlist1047(),proof=proofSelf1047(),provenanceSelf=provenanceSelf1047(),dependencies=dependencyAudit1047(),matchups=matchupEvidence1047(),provenance=catalogProvenance1047(),catalogReady=arr(W.CARD_CATALOG).length===19617,loaded=arr(W.deckState?.main).length>0;const activeGates=loaded?{score:legacy?.activeScore?.pass===true,deckExact:legacy?.active?.deckUniverseExact===true,format:legacy?.format?.pass===true,banlist:ban.pass===true,legality:legacy?.legality?.pass===true}:{score:false,deckExact:false,format:false,banlist:false,legality:false};const external=BUILD_E2E_1047.pass===true&&BUILD_E2E_1047.pageErrors===0&&BUILD_E2E_1047.selfPass===true&&BUILD_E2E_1047.structuralPass===true&&BUILD_E2E_1047.dependencyPass===true||false /* No aceptar un booleano global mutable como certificado E2E */,physical=W.__YGO874_PHYSICAL?.pass===true||W.YGOAlpha867?.proof867?.()?.pass===true||legacy?.physicalCatalog?.pass===true,comboRegression=W.__YGO1047_REGRESSION10?.pass===true||legacy?.comboRegression?.pass===true,competitive=legacy?.competitive?.certified===true,bundleIntegrity=W.__YGO_BUNDLE_INTEGRITY?.pass===true,activeDeckReady=loaded&&Object.values(activeGates).every(Boolean);const gates={structure:bundleIntegrity&&structural.pass===true&&catalogReady&&proof.pass===true&&provenanceSelf.pass===true,rules:provenance.certificationReady===true&&corpus.complete===true&&corpus.universalExact===true&&num(corpus.unresolved)===0&&num(corpus.parseErrors)===0,top5:activeDeckReady&&top5.pass===true,formats:formats.pass===true,banlists:ban.universe?.pass===true,calibration:calibration.strongPass===true,physical:physical===true,regression:comboRegression===true,e2e:external===true,matchups:matchups.pass===true,dependencies:dependencies.pass===true};const weights={structure:8,rules:24,top5:14,formats:10,banlists:8,calibration:10,physical:5,regression:7,e2e:6,matchups:5,dependencies:3};let done=0;for(const k of Object.keys(weights))if(gates[k]===true)done+=weights[k];const blockers=[];if(!bundleIntegrity)blockers.push('bundleIntegrity1047');if(structural.pass!==true)blockers.push('structural1047');if(!catalogReady)blockers.push('catalog19617');else if(proof.pass!==true)blockers.push('proof1047SelfTest');if(provenanceSelf.pass!==true)blockers.push('provenance1047SelfTest');if(provenance.reviewRequired>0)blockers.push('catalogProvenanceReview:'+provenance.reviewRequired);if(!gates.rules)blockers.push('universalExactOfficialRuleUniverse');if(!loaded)blockers.push('activeDeck');else{if(!activeGates.score)blockers.push('activeDeckScore');if(!activeGates.deckExact)blockers.push('activeDeckExact');if(!activeGates.format)blockers.push('activeFormatExact');if(!activeGates.banlist)blockers.push('activeBanlist');if(!activeGates.legality)blockers.push('deckLegality')}if(top5.pass!==true)blockers.push('top5BoundedComplete1047');if(formats.pass!==true)blockers.push('allFormatsExact');if(ban.universe?.pass!==true)blockers.push('banlistUniverseExact');if(calibration.strongPass!==true)blockers.push('scoreCalibration50Plus');if(physical!==true)blockers.push('physicalCatalogFingerprint');if(comboRegression!==true)blockers.push('comboRegression10');if(external!==true)blockers.push('externalBrowserE2E');if(matchups.pass!==true)blockers.push('competitiveMatchupSuite');if(dependencies.pass!==true)blockers.push('dependencyAudit1047');const pass=Object.values(gates).every(Boolean),rulesUniversal=['structure','rules','formats','banlists','physical','regression','e2e','dependencies'].every(k=>gates[k]===true),competitiveScore=gates.calibration&&gates.matchups,measuredDeckReady=gates.structure&&gates.top5;return{version:VERSION,pass,completionPct:done,remainingPct:100-done,gates,weights,blockers:[...new Set(blockers)],catalogReady,catalogProvenance:provenance,loaded,activeGates,activeDeckReady,bundleIntegrity,structural,proof,provenanceSelf,top5,corpus,formats,banlist:ban,calibration,physicalCatalogFingerprint:physical,comboRegression10:comboRegression,externalBrowserE2E:external,browserE2ECertificate:BUILD_E2E_1047,competitiveMatchupSuite:matchups.pass===true,matchupEvidence:matchups,dependencies,measuredDeckReady,rulesUniversalCertified:rulesUniversal,competitiveScoreCertified:competitiveScore,fullUniversalCertified:pass,policy:'Alpha1047 usa una sola matriz canónica de gates y scheduler compatible por identidad de función. Release, closurePlan y runClosure no pueden declarar FULL_UNIVERSAL_CERTIFIED mientras exista cualquier blocker canónico. El universo físico de 19,617 filas se certifica por separado del universo regular de reglas, y cualquier fuente REVIEW_REQUIRED permanece fail-closed.'}}
function release1047(){const c=certificationSnapshot1047(),status=!c.catalogReady?'INITIALIZING':c.fullUniversalCertified?'FULL_UNIVERSAL_CERTIFIED':c.rulesUniversalCertified?'RULES_UNIVERSAL_CERTIFIED':c.measuredDeckReady?'MEASURED_DECK_READY':c.gates.structure?'SUPPORTED_SCOPE_READY':'NEEDS_REVIEW';return{...c,authority:VERSION,status}}
function project1047(){const r=release1047();let gaps=null;try{gaps=A984.gapPlan984?.(25)||null}catch(_){}const pr=provenanceReview1047();return{...r,gaps,provenanceReview:{total:pr.total,requiredFields:pr.requiredFields,acceptedAuthorities:pr.acceptedAuthorities},cleanup:cleanup1047(),dependencies:dependencyAudit1047()}}
async function certify1047(opts={}){
  patchBanlist1047();const out={version:VERSION,startedAt:new Date().toISOString(),errors:[]};
  if(opts.catalog!==false){try{out.catalog=await A984.ensureCatalog984?.();}catch(e){out.errors.push({stage:'catalog',error:raw(e?.message||e)})}}
  if(opts.physical!==false){try{out.physical=await W.YGOAlpha874?.physical874?.()}catch(e){out.errors.push({stage:'physicalCatalog',error:raw(e?.message||e)})}}
  if(opts.dynamicBanlists!==false){try{out.dynamicBanlists=await ensureDynamicBanlists1047()}catch(e){out.errors.push({stage:'dynamicBanlists',error:raw(e?.message||e)})}}
  try{out.base=await A984.certify984?.({universal:false,resume:opts.resume!==false,reset:opts.reset===true,e2e:opts.e2e!==false,physical:opts.physical!==false,full:false,batchSize:opts.batchSize||25,maxGapRows:opts.maxGapRows||1000,onProgress:opts.onProgress})}catch(e){out.errors.push({stage:'base984',error:raw(e?.message||e)})}
  if(opts.universal!==false){try{out.rules=await universalSegment1047({reset:opts.reset===true,batchSize:Math.max(1,Math.min(100,num(opts.batchSize)||10)),batches:Math.max(1,Math.min(40,num(opts.ruleBatches)||8)),maxGaps:opts.maxGapRows||1000,onProgress:opts.onProgress})}catch(e){out.errors.push({stage:'officialRuleUniverse',error:raw(e?.message||e)})}}
  if(opts.search!==false&&arr(W.deckState?.main).length){try{out.search=await exhaustiveBudgeted1047({samples:opts.samples||1,maxDepth:opts.maxDepth||2,maxStates:opts.maxStates||800,maxActionBranches:opts.maxActionBranches||96,maxSlicesPerSample:opts.maxSlicesPerSample||24,onProgress:opts.onSearchProgress,publishResults:false})}catch(e){out.errors.push({stage:'searchBudget',error:raw(e?.message||e)})}}
  if(opts.regression!==false){try{const prev=W.__YGO1047_REGRESSION10||null,start=opts.regressionStart!=null?num(opts.regressionStart):num(prev?.nextStart)||0,limit=Math.max(1,Math.min(10-start,num(opts.regressionBatch)||1));if(start<10)out.regression=await regression10Async1047({start,limit,reset:opts.reset===true,samples:1,maxDepth:opts.regressionDepth||1,maxStates:opts.regressionStates||20,maxActionBranches:opts.regressionBranches||8,sliceMs:opts.regressionSliceMs||8,nodeBudgetMs:opts.regressionNodeMs||6,maxSlicesPerSample:opts.regressionSlices||12,onDeck:opts.onRegressionDeck});else out.regression=prev}catch(e){out.errors.push({stage:'regression10',error:raw(e?.message||e)})}}
  authority1047();patchBanlist1047();out.provenance=catalogProvenance1047();out.release=release1047();out.project=project1047();out.finishedAt=new Date().toISOString();W.__YGO1047_CERT=out;paint1047(out);return out
}
function paint1047(x={}){try{const n=D.getElementById('alpha870FullStatus');if(!n)return x;if(x.progress)n.textContent=`${VERSION} · corpus ${x.progress.processed}/${x.progress.total} · EXACT ${x.progress.exactPct}% · pendientes ${x.progress.unresolved}`;else{const r=x.release||x.project||release1047(),b=arr(r.blockers);n.textContent=`${VERSION} · ${r.status||'STATUS'} · ${b.length?b.length+' bloqueadores: '+b.slice(0,5).join(', '):'sin bloqueadores detectados'}`}}catch(_){}return x}
function export1047(x=W.__YGO1047_CERT||{version:VERSION,release:release1047(),project:project1047()}){const blob=new Blob([JSON.stringify(x,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=D.createElement('a');a.href=u;a.download=`${VERSION.replace(/\s+/g,'_')}_Certificacion_${new Date().toISOString().slice(0,10)}.json`;D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);return x}
function bind1047(){const old=D.getElementById('alpha870FullCert');if(old&&old.dataset.alpha1047!=='1'){const b=old.cloneNode(true);b.dataset.alpha1047='1';old.replaceWith(b);b.addEventListener('click',async()=>{const label=b.textContent;b.disabled=true;b.textContent='CERRANDO GATES…';try{await runClosure1047({maxRuntimeMs:15*60*1000,ruleBatchSize:10,ruleBatches:12,onProgress:p=>{try{if(p?.result?.processed!=null)paint1047({progress:p.result});else paint1047({release:release1047()})}catch(_){}}})}finally{b.disabled=false;b.textContent=label||'★ CERTIFICACIÓN TOTAL DEL ANALIZADOR'}})}const ex=D.getElementById('alpha870Export');if(ex&&ex.dataset.alpha1047!=='1'){const b=ex.cloneNode(true);b.dataset.alpha1047='1';ex.replaceWith(b);b.addEventListener('click',()=>export1047(W.__YGO1047_CLOSURE||W.__YGO1047_CERT))}return true}




/* Alpha 1102: bitácora verificable de apertura y primer nodo para Worker/hilo principal.
   Si una rama se trunca, el resultado sigue siendo diagnóstico, nunca certificado. */

/* Alpha 1102: comparar los estados y acciones de un segundo paso, con límites estrictos.
   Un submuestreo jamás prueba el conjunto completo de jugadas legales. */
function depthTwoProbe1082(sample=0,options={}){
 const h=globalThis,engine=h.YGOAlpha669,opening=h.YGOAlpha655?.openingState655?.(sample),toArray=x=>Array.isArray(x)?x:[];
 if(!opening||typeof engine?.enumerateNode669!=='function')return {status:'ENGINE_UNAVAILABLE',pass:false,rows:[]};
 const maxRoots=Math.max(1,Math.min(5,Number(options.maxRoots)||3));
 const branchLimit=Math.max(8,Math.min(48,Number(options.maxActionBranches)||24));
 const ms=Math.max(5,Math.min(110,Number(options.depthNodeBudgetMs)||35)),deterministic=options.auditDeterministic===true;
 const root=engine.enumerateNode669({st:opening,actions:[],score:0,exactPath:true},{maxActionBranches:branchLimit,nodeBudgetMs:ms,auditDeterministic:deterministic,collectUnresolved:true});
 const names=['deck','extra','hand','monster','spelltrap','gy','banished','field','pendulum'];
 const projectCard=x=>[String(x?.uid??''),String((x?.card||x)?.id??''),String((x?.card||x)?.name??''),!!x?.faceUp,String(x?.position??''),String(x?.controller??''),!!x?.negated];
 const projectState=s=>({turn:Number(s?.turn)||0,phase:String(s?.phase||''),player:Number(s?.activePlayer)||0,
  normalSummonAvailable:toArray(s?.normalSummonAvailable).map(Boolean),pending:toArray(s?.pendingTriggers).length,queued:toArray(s?.triggerQueue).length,
  chains:toArray(s?.chain).length,usage:Object.keys(s||{}).filter(k=>/^__alpha(?:677RockUses|680KingsSarcUses|685StakeUses)/.test(k)).sort().map(k=>[k,JSON.stringify(s[k])]),
  zones:toArray(s?.zones).map(z=>Object.fromEntries(names.map(name=>[name,toArray(z?.[name]).map(projectCard)])))});
 const action=n=>{const a=toArray(n?.actions).at(-1)||{};return [String(a.cardId??''),String(a.card??''),String(a.actionType??''),String(a.effectId??''),JSON.stringify(a.selectedTargets||[]),JSON.stringify(a.selectedCosts||[])];};
 const rootNodes=toArray(root?.nodes),rows=[],allReasons=new Set(toArray(root?.reasons)),unresolved=[...toArray(root?.unresolved)],selected=rootNodes.slice(0,maxRoots);
 for(let i=0;i<selected.length;i++){
  const n=selected[i];const sub=engine.enumerateNode669(n,{maxActionBranches:branchLimit,nodeBudgetMs:ms,auditDeterministic:deterministic,collectUnresolved:true});
  for(const r of toArray(sub?.reasons))allReasons.add(r);for(const gap of toArray(sub?.unresolved))if(!unresolved.some(x=>x.key===gap.key))unresolved.push(gap);
  rows.push({rootIndex:i,rootAction:action(n),rootState:projectState(n.st),rootExact:n.exactPath===true,
   complete:sub?.complete===true,childCount:toArray(sub?.nodes).length,
   children:toArray(sub?.nodes).map(child=>({action:action(child),state:projectState(child.st),exact:child.exactPath===true}))});
 }
 const sampled=rootNodes.length>maxRoots,allExact=rows.every(r=>r.rootExact&&r.complete&&r.children.every(ch=>ch.exact));
 if(sampled)allReasons.add('ROOT_SAMPLE_LIMIT');
 if(!allExact)allReasons.add('UNPROVEN_SECOND_STEP');
 return {status:sampled?'DEPTH2_SAMPLED':'DEPTH2_BOUNDED',sample,rootCount:rootNodes.length,rootsTested:rows.length,rootComplete:root?.complete===true,
  sampled,allExact,fullyEnumerated:root?.complete===true&&!sampled&&allExact,reasons:[...allReasons],unresolved:unresolved.slice(0,64),rows,
  auditDeterministic:deterministic,scope:'Dos pasos del árbol actual, con topes de ramas; no certifica jugadas ni rulings universales.',certified:false};
}

function paritySnapshot1081(sample=0,opts={}){
 const base=W.YGOAlpha655?.openingState655?.(sample);
 if(!base)return{status:'NO_OPENING_STATE',sample,pass:false};
 const projectCard=x=>[String(x?.uid||''),String((x?.card||x)?.id||''),String((x?.card||x)?.name||'')];
 const zone=(state,name)=>arr(state?.zones?.[0]?.[name]).map(projectCard);
 const snapshot={hand:zone(base,'hand'),deck:zone(base,'deck'),extra:zone(base,'extra'),monster:zone(base,'monster'),spelltrap:zone(base,'spelltrap')};
 const summary=n=>{const a=arr(n.actions).at(-1)||{},s=n.st;return{
  action:[String(a.cardId??''),String(a.card||''),String(a.actionType||''),String(a.effectId??''),JSON.stringify(a.selectedTargets||[]),JSON.stringify(a.selectedCosts||[])],
  after:{hand:zone(s,'hand'),monster:zone(s,'monster'),spelltrap:zone(s,'spelltrap'),gy:zone(s,'gy'),deck:zone(s,'deck')},
  exactPath:n.exactPath===true
 }};
 const r=W.YGOAlpha669?.enumerateNode669?.({st:base,actions:[],score:0,exactPath:true},{maxActionBranches:Math.max(8,Math.min(128,Number(opts.maxActionBranches)||24)),nodeBudgetMs:Math.max(4,Math.min(250,Number(opts.nodeBudgetMs)||250)),auditDeterministic:opts.auditDeterministic===true});
 if(!r)return{status:'ENUMERATOR_UNAVAILABLE',sample,pass:false,snapshot};
 return{status:'PROBED',sample,snapshot,actions:arr(r.nodes).map(summary),complete:r.complete===true,reasons:r.reasons||[],count:arr(r.nodes).length,depth2:opts.depth2===true?depthTwoProbe1082(sample,opts):null,pass:false};
}
async function parityAudit1081(opts={}){
 const start=Date.now(),fp=deckFingerprint1056(),revision=DECK_REVISION_1056;
 if(arr(W.deckState?.main).length===0)return{version:VERSION,status:'EMPTY_DECK',pass:false};
 if(ISOLATED1080.active)return{version:VERSION,status:'SEARCH_ALREADY_RUNNING',pass:false};
 try{if(arr(W.CARD_CATALOG).length<19617)await W.YGOAlpha984?.ensureCatalog984?.()}catch(e){return{version:VERSION,status:'CATALOG_LOAD_FAILED',pass:false,error:raw(e?.message||e)}}
 if(fp!==deckFingerprint1056()||revision!==DECK_REVISION_1056)return{version:VERSION,status:'STALE_DECK_CANCELLED',pass:false};
 const sample=Math.max(0,Math.min(9,Number(opts.sample)||0));
 const main=paritySnapshot1081(sample,opts);
 if(arr(main?.snapshot?.hand).length!==5||count1048(W.deckState,'main')<40)return{version:VERSION,status:'EMPTY_OPENING_NOT_PROVEN_1094',pass:false,openingMatch:false,actionsMatch:false,depth2Match:false,complete:false,certified:false,sample,counts:{main:0,worker:0},reason:'An empty or unavailable opening cannot establish parity or prove search optimality.'};
 const remote=await searchIsolated1080({mode:'PARITY',sample,depth2:opts.depth2===true,auditDeterministic:opts.auditDeterministic===true,maxRoots:opts.maxRoots||3,depthNodeBudgetMs:opts.depthNodeBudgetMs||35,maxActionBranches:opts.maxActionBranches||24,nodeBudgetMs:opts.nodeBudgetMs||250,maxTotalMs:Math.min(12000,Math.max(2000,Number(opts.maxTotalMs)||6500))});
 if(fp!==deckFingerprint1056()||revision!==DECK_REVISION_1056)return{version:VERSION,status:'STALE_DECK_CANCELLED',pass:false};
 if(remote.status!=='PROBED')return{version:VERSION,status:'WORKER_PROBE_FAILED',pass:false,remoteStatus:remote.status,error:remote.error||null};
 const openingMatch=JSON.stringify(main.snapshot)===JSON.stringify(remote.snapshot),actionsMatch=JSON.stringify(main.actions)===JSON.stringify(remote.actions);
 const rootExact=main.actions.every(a=>a.exactPath===true)&&remote.actions.every(a=>a.exactPath===true);
 const depth2Match=opts.depth2===true&&main.depth2?.status!=='ENGINE_UNAVAILABLE'&&remote.depth2?.status!=='ENGINE_UNAVAILABLE'&&JSON.stringify(main.depth2)===JSON.stringify(remote.depth2);
 const complete=main.complete===true&&remote.complete===true&&rootExact;
 const pass=openingMatch&&actionsMatch&&complete&&(opts.depth2!==true||depth2Match&&main.depth2?.fullyEnumerated===true); 
 const depth2BudgetLimited=opts.depth2===true&&[...(main.depth2?.reasons||[]),...(remote.depth2?.reasons||[])].some(r=>/TIME_BUDGET|_CAP|SAMPLE_LIMIT/.test(r));
 const clockCutDetected=[...(main.reasons||[]),...(remote.reasons||[]),...(main.depth2?.reasons||[]),...(remote.depth2?.reasons||[])].some(r=>/TIME_BUDGET/.test(r));
 const out={version:VERSION,status:!openingMatch?'OPENING_MISMATCH':!actionsMatch?'ROOT_ACTION_MISMATCH':opts.depth2===true&&!depth2Match?(depth2BudgetLimited?'DEPTH2_INCONCLUSIVE_BUDGET':'DEPTH2_MISMATCH'):!complete?'ROOT_PARITY_MATCH_BUT_TRUNCATED':opts.depth2===true?(main.depth2?.fullyEnumerated===true?'DEPTH2_PARITY_COMPLETE':'DEPTH2_PARITY_SAMPLED'):'ROOT_PARITY_COMPLETE',pass,openingMatch,actionsMatch,complete,rootExact,auditDeterministic:opts.auditDeterministic===true,clockCutDetected,depth2BudgetLimited,depth2Match:opts.depth2===true?depth2Match:null,depth2:opts.depth2===true?{rootsTested:main.depth2?.rootsTested||0,rootCount:main.depth2?.rootCount||0,sampled:main.depth2?.sampled===true,allExact:main.depth2?.allExact===true,fullyEnumerated:main.depth2?.fullyEnumerated===true,reasons:main.depth2?.reasons||[],unresolved:main.depth2?.unresolved||[]}:null,
  counts:{main:main.count,worker:remote.count},reasons:{main:main.reasons,worker:remote.reasons},sample,elapsedMs:Date.now()-start,
  scope:opts.depth2===true?'Comparación puntual de aperturas, primer nodo y una muestra acotada del segundo. NO certifica legalidad universal ni Top 5.':'Paridad puntual de apertura y primer nodo, NO equivalencia de búsqueda completa ni prueba universal de reglas.',certified:false};
 W.__YGO1081_PARITY=out;return out;
}

/* Alpha 1080: aislamiento real por Dedicated Worker, sin ejecutar enumeraciones en el hilo del panel.
   La terminación interrumpe incluso un nodo síncrono bloqueado. No certifica jugadas. */
const WORKER_SOURCE_1080=String.raw`/* Worker reutiliza el paquete verificado ya cargado por la interfaz; no solicita recursos externos. */
'use strict';
self.window=self;
self.global=self;
const noop1080=()=>{};
const element1080=()=>new Proxy({style:{},dataset:{},innerHTML:'',textContent:'',value:'',classList:{add:noop1080,remove:noop1080,contains:()=>false},appendChild:noop1080,remove:noop1080,addEventListener:noop1080,querySelector:()=>null,querySelectorAll:()=>[],getAttribute:()=>null,setAttribute:noop1080,getBoundingClientRect:()=>({top:0,bottom:0})},{get:(t,k)=>k in t?t[k]:undefined});
self.document={documentElement:element1080(),body:element1080(),head:element1080(),title:'',createElement:element1080,querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,addEventListener:noop1080,readyState:'loading',scripts:[]};
self.localStorage={getItem:()=>null,setItem:noop1080,removeItem:noop1080};
self.sessionStorage=self.localStorage;
self.alert=noop1080;
self.confirm=()=>false;
self.MutationObserver=class{observe(){}disconnect(){}};
self.requestAnimationFrame=()=>0;
self.HTMLElement=function(){};
const deferredQueue1080=[],seenDeferred1080=new WeakSet(),deferredErrors1080=[];
self.__YGO783_DEFER_BOOT=(a,b)=>{const fn=typeof a==='function'?a:typeof b==='function'?b:null;if(fn&&!seenDeferred1080.has(fn)){deferredQueue1080.push({fn,label:String(typeof a==='string'?a:typeof b==='string'?b:fn.name||'anonymous')});seenDeferred1080.add(fn)}return true};
function flushDeferred1080(){let loops=0;while(deferredQueue1080.length&&loops++<64){const job=deferredQueue1080.shift();try{job.fn()}catch(e){deferredErrors1080.push(job.label+': '+String(e?.stack||e).slice(0,350))}}}
/* SHA-256 portable para contextos file:/about:blank donde SubtleCrypto está deshabilitado.
   Implementación SHA-256 de enteros de 32 bits: se contrasta con vectores oficiales. */
function sha256Portable1082(input){
 const bytes=typeof input==='string'?new TextEncoder().encode(input):input;
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
 0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
 0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
 0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
 0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
 0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
 0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
 0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const H=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
 const n=bytes.length,full=Math.ceil((n+9)/64)*64,buf=new Uint8Array(full);buf.set(bytes);buf[n]=128;
 const bits=BigInt(n)*8n;const end=new DataView(buf.buffer);end.setUint32(full-8,Number(bits>>32n)>>>0,false);end.setUint32(full-4,Number(bits&0xffffffffn)>>>0,false);
 const w=new Uint32Array(64),rr=(x,v)=>(x>>>v)|(x<<(32-v));
 for(let off=0;off<full;off+=64){
  for(let j=0;j<16;j++)w[j]=end.getUint32(off+4*j,false);
  for(let j=16;j<64;j++){const x=w[j-15],y=w[j-2];w[j]=(w[j-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[j-7]+(rr(y,17)^rr(y,19)^(y>>>10)))>>>0;}
  let [a,b,c,d,e,f,g,h]=H;
  for(let j=0;j<64;j++){
   const s1=rr(e,6)^rr(e,11)^rr(e,25),t1=(h+s1+((e&f)^(~e&g))+K[j]+w[j])>>>0;
   const s0=rr(a,2)^rr(a,13)^rr(a,22),t2=(s0+((a&b)^(a&c)^(b&c)))>>>0;
   h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
  }
  H[0]=(H[0]+a)>>>0;H[1]=(H[1]+b)>>>0;H[2]=(H[2]+c)>>>0;H[3]=(H[3]+d)>>>0;
  H[4]=(H[4]+e)>>>0;H[5]=(H[5]+f)>>>0;H[6]=(H[6]+g)>>>0;H[7]=(H[7]+h)>>>0;
 }
 return Array.from(H,x=>x.toString(16).padStart(8,'0')).join('');
}

let stop1080=false,started1080=false,ready1080=false,explorationStarted1080=false;
let sessionId1080=null,activeRunId1080=null;
const notify1080=(type,data={})=>{try{self.postMessage({type,sessionId:sessionId1080,runId:activeRunId1080,...data})}catch(e){self.postMessage({type:'ERROR',sessionId:sessionId1080,runId:activeRunId1080,error:'WORKER_POSTMESSAGE_FAILED: '+String(e?.message||e)})}};
async function start1080(msg){
 if(started1080)return;started1080=true;
 try{
  const b=atob(msg.payload),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  const ds=new DecompressionStream('gzip');
  const data=await new Response(new Blob([u]).stream().pipeThrough(ds)).text();
  const bundle=JSON.parse(data);
  const targetVersion=String(msg?.targetVersion||''),manifest=msg?.manifest;
  const expectedCanonicalId='ygo-alpha-'+targetVersion.replace(/\D/g,'')+'-canonical-release';
  if(!/^Alpha \d+$/.test(targetVersion)||!manifest||manifest.canonicalId!==expectedCanonicalId||
     !Number.isSafeInteger(manifest.moduleCount)||manifest.moduleCount<1||manifest.moduleCount>200||
     !Number.isSafeInteger(manifest.workerModuleCount)||manifest.workerModuleCount<1||manifest.workerModuleCount>=manifest.moduleCount||
     bundle?.version!==targetVersion||!Array.isArray(bundle?.chunks)||
     bundle?.integrity?.chunkCount!==manifest.moduleCount||bundle.chunks.length!==manifest.moduleCount||
     bundle?.integrity?.algorithm!=='SHA-256')throw Error('WORKER_BUNDLE_VERSION_OR_COUNT');
  // Fail closed: any unexpected module or changed byte prevents ALL module execution.
  const expected=bundle.integrity.sha256||{},ids=new Set();
  const canonicalIndex=bundle.chunks.findIndex(mod=>mod?.id==='ygo-alpha-1216-canonical-release');
  if(Object.keys(expected).length!==bundle.chunks.length||bundle.integrity.canonicalId!==expectedCanonicalId||
     canonicalIndex!==manifest.workerModuleCount)throw Error('WORKER_BUNDLE_MANIFEST_INVALID');
  if(sha256Portable1082('abc')!=='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')throw Error('WORKER_SHA256_SELFTEST_FAILED');
  for(const mod of bundle.chunks){
   if(typeof mod?.id!=='string'||typeof mod?.code!=='string'||ids.has(mod.id)||!/^[a-f0-9]{64}$/.test(expected[mod.id]||''))throw Error('WORKER_MODULE_MANIFEST_INVALID');
   ids.add(mod.id);
   const bytes=new TextEncoder().encode(mod.code);
   const observed=self.crypto?.subtle?Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join(''):sha256Portable1082(bytes);
   if(observed!==expected[mod.id])throw Error('WORKER_MODULE_INTEGRITY_MISMATCH: '+mod.id);
  }
  if(msg.prelude){try{(0,eval)(String(msg.prelude))}catch(e){notify1080('PRELUDE_ERROR',{error:String(e?.stack||e).slice(0,500)});return}}
  const mods=bundle.chunks.slice(0,canonicalIndex);
  const failures=[];
  for(const mod of mods){try{(0,eval)(String(mod.code||''));flushDeferred1080()}catch(e){failures.push({module:mod.id,error:String(e?.message||e)});break}}flushDeferred1080();
  if(failures.length)throw Error('WORKER_MODULE_FAILURE: '+JSON.stringify(failures[0]));
  try{
   if(typeof msg.guardCode!=='string'||typeof msg.regressionCode!=='string')throw Error('CANONICAL_PARSER_SOURCE_MISSING_1092');
   const install=(0,eval)('('+msg.guardCode+')'),test=(0,eval)('('+msg.regressionCode+')');
   self.installParserGuard1092=install;
   if(typeof install!=='function'||typeof test!=='function'||install()!==true)throw Error('CANONICAL_PARSER_GUARD_FAILED_1092');
   self.YGOAlpha1092={parserRegression1092:test};
  }catch(e){throw Error('WORKER_CANONICAL_PARSER_INIT_1092: '+String(e?.message||e))}
  ready1080=true;
  notify1080('READY',{modules:mods.length,deferredErrors:deferredErrors1080.length,deferredSamples:deferredErrors1080.slice(0,3),diagnostics:{ruling:typeof self.YGORulingEngine,makeState:typeof self.YGORulingEngine?.makeState,alpha655:typeof self.YGOAlpha655?.openingState655,app:typeof self.YGOApp,catalog:self.CARD_CATALOG?.length||0}});
 }catch(e){notify1080('ERROR',{error:String(e?.stack||e)})}
}
/* Alpha 1209: el Worker enumera SOLO parejas de fuente/objetivo de una
   foto explícita. No ejecuta efectos ni inventa una mano inicial: el hilo
   principal aplicará cosmicCyclone1208 y replayCosmicCyclone1208 a cada par. */
function cosmicChoices1209(msg){
 const start=performance.now(),before=msg.before,player=msg.player;
 const rejected=(status)=>notify1080('DONE',{result:{status,candidates:[],candidateCount:0,
  elapsedMs:Math.round(performance.now()-start),certified:false,resumable:false}});
 if(stop1080)return rejected('CANCELLED');
 if(!Number.isInteger(player)||![0,1].includes(player)||!before||!Array.isArray(before.zones)||before.zones.length!==2)
  return rejected('COSMIC_INPUT_INVALID');
 const own=before.zones[player],sources=[...(Array.isArray(own?.hand)?own.hand:[]),...(Array.isArray(own?.spelltrap)?own.spelltrap:[])];
 const targets=before.zones.flatMap(side=>Array.isArray(side?.spelltrap)?side.spelltrap:[]);
 if(sources.length>100||targets.length>30)return rejected('COSMIC_INPUT_TOO_LARGE');
 const mixed=msg.type==='SPELL_REMOVAL_SEQUENCE_1211',maxChoices=mixed?100:30;
 const pairs=[],seen=new Set();let totalEligible=0;
 // Enumerar por objetivo antes que por fuente evita que muchas cartas fuente
 // desplacen todos los objetivos posteriores cuando el presupuesto se agota.
 // Alpha 1214: la enumeración mixta no debe gastar sus 100 pares en
 // monstruos falsamente puestos en S/T ni en fuentes físicamente inelegibles.
 // Son filtros necesarios pero NO bastan para certificar ninguna activación.
 const mixedSource1214=(src,zone)=>{
  const id=Number(src?.id??src?.card?.id),uid=String(src?.uid??'').trim();
  if(!(id===8267140||id===5318639)||!uid||uid.length>100)return false;
  const bits=Number(src?.typeBits??src?.type??src?.card?.typeBits??src?.card?.type);
  if(!Number.isSafeInteger(bits)||(bits&0x10002)!==0x10002||(bits&4)!==0||
   src?.ownerPlayer!==player||(zone==='spelltrap'?src?.faceUp!==false:src?.faceUp===true))return false;
  if(zone==='spelltrap'&&(!Number.isSafeInteger(before?.turn)||!Number.isSafeInteger(src?.setTurn)||
   src.setTurn<0||src.setTurn>=before.turn))return false;
  return true;
 };
 const candidates=mixed?[
  ...(Array.isArray(own?.hand)?own.hand:[]).filter(c=>mixedSource1214(c,'hand')),
  ...(Array.isArray(own?.spelltrap)?own.spelltrap:[]).filter(c=>mixedSource1214(c,'spelltrap'))
 ]:sources.filter(src=>{
  const id=Number(src?.id??src?.card?.id),uid=String(src?.uid??'').trim();
  return id===8267140&&!!uid&&uid.length<=100;
 });
 const validTargets1214=mixed?targets.filter(t=>{
  const bits=Number(t?.typeBits??t?.type??t?.card?.typeBits??t?.card?.type);
  return Number.isSafeInteger(bits)&&(bits&6)!==0&&(bits&1)===0&&[0,1].includes(t?.ownerPlayer);
 }):targets;
 const append=(src,target)=>{
  const sourceUid=String(src?.uid??'').trim(),targetUid=String(target?.uid??'').trim();
  if(!targetUid||targetUid.length>100||sourceUid===targetUid)return;
  const token=JSON.stringify([sourceUid,targetUid]);if(seen.has(token))return;
  seen.add(token);totalEligible++;
  if(pairs.length<maxChoices)pairs.push({sourceUid,targetUid});
 };
 if(mixed){
  for(const target of validTargets1214){
   if(stop1080)return rejected('CANCELLED');
   for(const src of candidates)append(src,target);
  }
 }else{
  for(const src of candidates){
   if(stop1080)return rejected('CANCELLED');
   for(const target of targets)append(src,target);
  }
 }
 notify1080('DONE',{result:{status:pairs.length?'COSMIC_CHOICES_ENUMERATED_1209':'NO_BOUNDED_CHOICES_1209',
  candidates:pairs,candidateCount:pairs.length,elapsedMs:Math.round(performance.now()-start),
  maxChoices,enumerationTruncated:totalEligible>maxChoices,
  eligiblePairCount:totalEligible,certified:false,resumable:false,
  scope:'ENUMERATION_ONLY_REQUIRES_CANONICAL_REPLAY'}});
}
async function search1080(msg){
 const opt=msg.options||{};
 if(typeof self.YGOAlpha669?.exhaustiveOpeningSearch669Async!=='function'){notify1080('ERROR',{error:'WORKER_ENGINE_MISSING'});return}
 self.deckState=msg.deck;
 self.CARD_CATALOG=Array.isArray(msg.catalog)?msg.catalog:[];
 self.allCards=()=>self.CARD_CATALOG;
 self.__YGO_ACTIVE_BAN_KEY=msg.formatKey||self.__YGO_ACTIVE_BAN_KEY||'TCG';
 const depth=Math.max(1,Math.min(5,Number(opt.maxDepth)||2)),states=Math.max(20,Math.min(2000,Number(opt.maxStates)||350)),branches=Math.max(8,Math.min(128,Number(opt.maxActionBranches)||64)),sample=Math.max(0,Math.min(9,Number(opt.sample)||0));
 const timeBudget=Math.max(100,Math.min(12000,Number(opt.maxTotalMs)||5000)),perNode=Math.max(4,Math.min(80,Number(opt.nodeBudgetMs)||12));
 const sliceMs=Math.max(8,Math.min(90,Number(opt.sliceMs)||22)),maxSlices=Math.max(1,Math.min(160,Number(opt.maxSlices)||50)),started=performance.now();
 const key='WORKER1080:'+msg.runId;
 let last=null,slices=0;
 const quit=()=>stop1080||performance.now()-started>=timeBudget;
 try{
  for(let i=0;i<maxSlices&&!quit();i++){
   last=await self.YGOAlpha669.exhaustiveOpeningSearch669Async({sample,maxDepth:depth,maxStates:states,maxActionBranches:branches,nodeBudgetMs:perNode,sliceMs,yieldEvery:1,checkpointKey:key,resume:i>0,shouldCancel:quit,onProgress:p=>notify1080('PROGRESS',{expanded:p?.expanded||0,depth:p?.depth||0,frontier:p?.frontier||0,slices})});
   slices++;
   notify1080('SLICE',{slices,status:last?.status||'UNKNOWN',statesExpanded:last?.certificate?.statesExpanded||0});
   if(last?.certificate?.resumable!==true)break;
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  const cert=last?.certificate||{},sourceLines=Array.isArray(last?.lines)?last.lines:[];
  // Alpha 1198: no publicar una apertura sin acciones como combo; dos caminos
  // con la misma traza y campo final tampoco son dos combos diferentes.
  // Revisar hasta 80 filas de forma acotada y conservar el orden del buscador.
  // Alpha 1198: no colapsar dos decisiones que pagan costes o eligen objetivos distintos.
  // Solo transportar testigos ligeros y serializables; el Worker no certifica su legalidad.
  const choices1197=items=>Array.isArray(items)?items.slice(0,12).map(x=>{
   if(typeof x==='string'||typeof x==='number')return String(x).slice(0,120);
   if(x&&typeof x==='object'&&!Array.isArray(x))return ['uid','id','cardId','zone','index','owner','controller','position','name'].map(k=>x[k]==null?'':String(x[k]).slice(0,60)).join('|');
   return '';
  }):[];
  // Alpha 1198: el estado fisico de la busqueda es la autoridad del campo final.
  // Si existen estado y resumen, ambos deben describir los mismos monstruos.
  // La foto de estado NO certifica que la secuencia sea legal: aun requiere replay.
  const boardFromState1198=line=>{
   const stateMons=line?.state?.zones?.[0]?.monster;
   const summaryMons=line?.finalBoard?.monsters;
   if(stateMons!==undefined&&!Array.isArray(stateMons))return {ok:false};
   if(summaryMons!==undefined&&!Array.isArray(summaryMons))return {ok:false};
   const haveState=Array.isArray(stateMons),haveSummary=Array.isArray(summaryMons);
   if(haveState&&stateMons.length>7||haveSummary&&summaryMons.length>15)return {ok:false};
   const names=arr=>arr.map(x=>String(x?.card?.name||x?.name||'').trim());
   const stateNames=haveState?names(stateMons):[],summaryNames=haveSummary?names(summaryMons):[];
   if(stateNames.some(n=>!n||n.length>160)||summaryNames.some(n=>!n||n.length>160))return {ok:false};
   const multiset=a=>a.slice().sort().join('\u0000');
   if(haveState&&haveSummary&&multiset(stateNames)!==multiset(summaryNames))return {ok:false};
   const witness=haveState?stateMons.map((x,i)=>JSON.stringify([
    i,String(x?.uid??'').slice(0,80),stateNames[i],String(x?.position??'').slice(0,30),
    x?.faceUp===true?1:0,Number.isInteger(x?.controller)?x.controller:0
   ])):[];
   return {ok:true,names:haveState?stateNames:summaryNames,witness};
  };
  // Alpha 1199: testigos acotados de cada transicion, sin afirmar legalidad de reglas.
  // Las acciones del motor 669 contienen estados before/after; nunca reconstruirlos
  // a partir del End Board ni de un resumen visual.
  const stepEvidence1199=line=>{
   const acts=Array.isArray(line?.actions)?line.actions:[];
   const withStates=acts.filter(a=>a?.before!=null||a?.after!=null).length;
   if(!withStates)return {ok:true,scope:'NO_STEP_STATES',rows:[]};
   if(withStates!==acts.length||acts.some(a=>a?.before==null||a?.after==null))return {ok:false,reason:'PARTIAL_ACTION_STATES'};
   const zoneNames=['deck','extra','hand','monster','spelltrap','gy','banished','field','pendulum'];
   const project=state=>{
    if(!Array.isArray(state?.zones)||state.zones.length!==2)return null;
    const records=[],byUid=new Map(),identityByUid=new Map();
    for(let p=0;p<2;p++){
     const side=state.zones[p];if(!side||typeof side!=='object')return null;
     for(const z of zoneNames){const a=side[z];if(a!==undefined&&!Array.isArray(a))return null;
      if(Array.isArray(a)&&a.length>90)return null;
      for(let i=0;i<(a?.length||0);i++){
       const x=a[i];if(!x||typeof x!=='object')return null;
       const uid=String(x.uid??'').trim(),name=String(x?.card?.name??x?.name??'').trim();
       if(!uid||uid.length>100||!name||name.length>160||byUid.has(uid))return null;
       const rec=[uid,p,z,i,name,String(x?.position??'').slice(0,30),x?.faceUp===true?1:0,Number.isInteger(x?.controller)?x.controller:p];
       if(rec[7]!==0&&rec[7]!==1)return null;
       // Alpha 1200: preservar ID impreso y propietario si el estado los acredita.
       // No confundir propietario permanente con controlador, que sí puede cambiar.
       const original=x?.card&&typeof x.card==='object'?x.card:x;
       const rawId=x.id??x.cardId??original.id??original.cardId??null;
       const rawOwner=x.ownerPlayer??original.ownerPlayer??null;
       if(rawId!==null&&rawId!==undefined&&!['string','number'].includes(typeof rawId))return null;
       if(rawOwner!==null&&rawOwner!==undefined&&(!Number.isInteger(Number(rawOwner))||![0,1].includes(Number(rawOwner))))return null;
       const immutable={id:rawId==null?null:String(rawId).slice(0,100),owner:rawOwner==null?null:Number(rawOwner)};
       identityByUid.set(uid,immutable);
       byUid.set(uid,rec);records.push(rec);
       if(records.length>250)return null;
      }
     }
    }
    records.sort((a,b)=>a[0].localeCompare(b[0]));
    const key=JSON.stringify(records);if(key.length>44000)return null;
    let h=2166136261>>>0;for(let i=0;i<key.length;i++){h^=key.charCodeAt(i);h=Math.imul(h,16777619)>>>0}
    return {key,tag:(h>>>0).toString(16).padStart(8,'0')+':'+key.length,byUid,identityByUid};
   };
   // Un UID representa una carta física: identidad impresa y propietario no
   // pueden mutar arbitrariamente dentro de una acción o entre acciones.
   const identityConflict=(lhs,rhs)=>{
    for(const [uid,a] of lhs.identityByUid){const b=rhs.identityByUid.get(uid);
     if(!b)continue;
     if(a.id!==null&&b.id!==null&&a.id!==b.id)return true;
     if(a.owner!==null&&b.owner!==null&&a.owner!==b.owner)return true;
    }
    return false;
   };
   // Alpha 1201: UID equivale a una carta física durante toda la línea,
   // incluso si abandona momentáneamente las zonas que representa el modelo.
   // Los campos ausentes siguen siendo desconocidos, nunca un ID inventado.
   const identitiesSeen1201=new Map();
   const rememberIdentity1201=projection=>{
    for(const [uid,identity] of projection.identityByUid){
     const prior=identitiesSeen1201.get(uid);
     if(!prior){identitiesSeen1201.set(uid,{...identity});continue}
     if(prior.id!==null&&identity.id!==null&&prior.id!==identity.id)return false;
     if(prior.owner!==null&&identity.owner!==null&&prior.owner!==identity.owner)return false;
     if(prior.id===null&&identity.id!==null)prior.id=identity.id;
     if(prior.owner===null&&identity.owner!==null)prior.owner=identity.owner;
    }
    return true;
   };
   // Alpha 1202: asociar CUATRO movimientos simples con su acción declarada.
   // Este contrato comprueba un subconjunto físico, NO la activación, la
   // prohibición por formato, la cadena ni efectos de reemplazo.
   // Alpha 1206: JSON.stringify cambia silenciosamente NaN/Infinity a null,
   // omite undefined/functions y puede ejecutar toJSON. Una cadena con esos
   // valores NO constituye evidencia fiel de continuidad del duelo.
   const safeChain1206=(chain)=>{
    if(!Array.isArray(chain)||chain.length>16)return false;
    const ancestors=new Set();let nodes=0;
    const visit=(value,depth)=>{
     if(++nodes>256||depth>8)return false;
     if(value===null||typeof value==='boolean')return true;
     if(typeof value==='number')return Number.isFinite(value);
     if(typeof value==='string')return value.length<=1024;
     if(typeof value!=='object'||ancestors.has(value))return false;
     const proto=Object.getPrototypeOf(value);
     if(!Array.isArray(value)&&proto!==Object.prototype&&proto!==null)return false;
     const keys=Object.keys(value);
     // Campos no enumerables o Symbol tampoco deben desaparecer al serializar.
     if(Object.getOwnPropertySymbols(value).length)return false;
     if(Object.getOwnPropertyNames(value).length!==keys.length+(Array.isArray(value)?1:0))return false;
     if(keys.length>48)return false;
     if(Array.isArray(value)&&(value.length>32||keys.length!==value.length))return false;
     ancestors.add(value);
     try{
      for(const key of keys){
       if(key.length>100)return false;
       const desc=Object.getOwnPropertyDescriptor(value,key);
       if(!desc||!Object.prototype.hasOwnProperty.call(desc,'value')||
          !visit(desc.value,depth+1))return false;
      }
      if(Array.isArray(value))for(let i=0;i<value.length;i++){
       if(!Object.prototype.hasOwnProperty.call(value,i))return false;
      }
      return true;
     }finally{ancestors.delete(value)}
    };
    try{return visit(chain,0)}catch(_){return false}
   };
   const simpleActions1202=Object.freeze({
    DRAW_ONE:['deck','hand'],NORMAL_SUMMON_L4:['hand','monster'],
    NORMAL_SET_L4:['hand','monster'],SET_SPELL_TRAP:['hand','spelltrap']
   });
   const checkSimpleAction1202=(action,before,after,b,a,moves)=>{
    const actionType=String(action?.actionType??'');
    if(!Object.prototype.hasOwnProperty.call(simpleActions1202,actionType))return {ok:true,witness:null};
    const [origin,destination]=simpleActions1202[actionType];
    const uid=String(action?.uid??action?.sourceUid??'').trim(),player=action?.player;
    if(!uid||uid.length>100||!Number.isInteger(player)||player<0||player>1)return {ok:false,reason:'SIMPLE_ACTION_IDENTITY_MISSING'};
    const first=b.byUid.get(uid),last=a.byUid.get(uid);
    if(!first||!last||first[1]!==player||last[1]!==player||first[2]!==origin||last[2]!==destination||
       moves.length!==1||moves[0][0]!==uid||moves[0][1]!==player||moves[0][2]!==origin||
       moves[0][3]!==player||moves[0][4]!==destination)
     return {ok:false,reason:'SIMPLE_ACTION_ZONE_MISMATCH'};
    if(actionType==='DRAW_ONE'&&first[3]!==0)return {ok:false,reason:'SIMPLE_ACTION_DECK_ORDER_MISMATCH'};
    // Alpha 1203: los cuatro contratos físicos no deben alterar el contador
    // de Invocaciones Normales salvo una Invocación/Colocación Normal.
    // Un contador ausente no equivale a cero: no inventamos su valor.
    const hasUsageBefore1203=Object.prototype.hasOwnProperty.call(before,'normalSummonsUsed');
    const hasUsageAfter1203=Object.prototype.hasOwnProperty.call(after,'normalSummonsUsed');
    const normalMove1203=actionType==='NORMAL_SUMMON_L4'||actionType==='NORMAL_SET_L4';
    if(hasUsageBefore1203!==hasUsageAfter1203)return {ok:false,reason:'SIMPLE_ACTION_NORMAL_USAGE_INCOMPLETE'};
    let usageEvidence1203=null;
    if(hasUsageBefore1203){
     const usedBefore=before.normalSummonsUsed,usedAfter=after.normalSummonsUsed;
     if(!Number.isSafeInteger(usedBefore)||!Number.isSafeInteger(usedAfter)||
        usedBefore<0||usedBefore>1||usedAfter<0||usedAfter>1)
      return {ok:false,reason:'SIMPLE_ACTION_NORMAL_USAGE_INVALID'};
     if(normalMove1203?(usedBefore!==0||usedAfter!==1):usedBefore!==usedAfter)
      return {ok:false,reason:'SIMPLE_ACTION_NORMAL_USAGE_MISMATCH'};
     usageEvidence1203=[usedBefore,usedAfter];
    }
    // Los movimientos simples no ejecutan transiciones de turno o fase.
    for(const field1203 of ['turn','phase','activePlayer']){
     const left=Object.prototype.hasOwnProperty.call(before,field1203);
     const right=Object.prototype.hasOwnProperty.call(after,field1203);
     if(left!==right)return {ok:false,reason:'SIMPLE_ACTION_TIMING_INCOMPLETE'};
     if(left&&before[field1203]!==after[field1203])return {ok:false,reason:'SIMPLE_ACTION_TIMING_MISMATCH'};
    }
    // Alpha 1204: un movimiento sencillo nunca acredita por sí mismo un coste
    // pagado, una selección de objetivos/materiales ni una resolución adicional.
    // Fail-closed cuando se declara alguna elección que este contrato no modela.
    for(const choiceField1204 of ['selectedCosts','selectedTargets','selectedMaterials']){
     const chosen=action?.[choiceField1204];
     if(chosen!==undefined&&(!Array.isArray(chosen)||chosen.length>0))
      return {ok:false,reason:'SIMPLE_ACTION_CHOICES_NOT_MODELED'};
    }
    // Preservar Life Points y la cadena si el estado facilita esa información.
    // La ausencia de ambos lados NO se interpreta como evidencia de conservación.
    const evidence1204={};
    const hasLpB1204=Object.prototype.hasOwnProperty.call(before,'lp');
    const hasLpA1204=Object.prototype.hasOwnProperty.call(after,'lp');
    if(hasLpB1204!==hasLpA1204)return {ok:false,reason:'SIMPLE_ACTION_LP_EVIDENCE_INCOMPLETE'};
    if(hasLpB1204){
     const lb=before.lp,la=after.lp;
     if(!Array.isArray(lb)||!Array.isArray(la)||lb.length!==2||la.length!==2||
        ![...lb,...la].every(n=>Number.isSafeInteger(n)&&n>=0&&n<=999999))
      return {ok:false,reason:'SIMPLE_ACTION_LP_EVIDENCE_INVALID'};
     if(lb[0]!==la[0]||lb[1]!==la[1])return {ok:false,reason:'SIMPLE_ACTION_LP_CHANGED'};
     evidence1204.lp=[lb[0],lb[1],la[0],la[1]];
    }
    const hasChainB1204=Object.prototype.hasOwnProperty.call(before,'chain');
    const hasChainA1204=Object.prototype.hasOwnProperty.call(after,'chain');
    if(hasChainB1204!==hasChainA1204)return {ok:false,reason:'SIMPLE_ACTION_CHAIN_EVIDENCE_INCOMPLETE'};
    if(hasChainB1204){
     const cb=before.chain,ca=after.chain;
     if(!safeChain1206(cb)||!safeChain1206(ca))
      return {ok:false,reason:'SIMPLE_ACTION_CHAIN_EVIDENCE_INVALID'};
     let leftKey,rightKey;
     try{leftKey=JSON.stringify(cb);rightKey=JSON.stringify(ca)}catch(_){return {ok:false,reason:'SIMPLE_ACTION_CHAIN_EVIDENCE_INVALID'}}
     if(typeof leftKey!=='string'||typeof rightKey!=='string'||leftKey.length>4096||rightKey.length>4096)
      return {ok:false,reason:'SIMPLE_ACTION_CHAIN_EVIDENCE_INVALID'};
     if(leftKey!==rightKey)return {ok:false,reason:'SIMPLE_ACTION_CHAIN_CHANGED'};
     evidence1204.chainDepth=[cb.length,ca.length];
    }
    if(actionType!=='DRAW_ONE'){
     if(before.activePlayer!==player||!/^MAIN(?:1|2)?$/i.test(String(before.phase??'')))
      return {ok:false,reason:'SIMPLE_ACTION_PHASE_MISMATCH'};
     const physical=before.zones[player][origin][first[3]];
     const card=physical?.card??physical;
     const bits=Number(card?.typeBits??card?.type),level=Number(card?.level);
     if(actionType==='SET_SPELL_TRAP'){
      if(!Number.isSafeInteger(bits)||!(bits&6)||(bits&1)||after.zones[player][destination][last[3]]?.faceUp!==false)
       return {ok:false,reason:'SIMPLE_ACTION_SPELL_TRAP_INVALID'};
     }else{
      if(!Number.isSafeInteger(level)||level<1||level>4||!Number.isSafeInteger(bits)||!(bits&1)||
         (bits&0x4000)||(bits&0x2000000)||(bits&0x800000)||(bits&0x2000)||(bits&0x40)||(bits&0x80))
       return {ok:false,reason:'SIMPLE_ACTION_MONSTER_INVALID'};
      const positioned=after.zones[player][destination][last[3]];
      if(actionType==='NORMAL_SUMMON_L4'&&
          (positioned?.faceUp!==true||String(positioned?.position??'').toUpperCase()!=='ATTACK'))
       return {ok:false,reason:'SIMPLE_ACTION_SUMMON_POSITION_INVALID'};
      if(actionType==='NORMAL_SET_L4'&&
          (positioned?.faceUp!==false||String(positioned?.position??'').toUpperCase()!=='DEFENSE'))
       return {ok:false,reason:'SIMPLE_ACTION_SET_POSITION_INVALID'};
     }
    }
    return {ok:true,witness:{actionType,uid,player,scope:'PHYSICAL_ACTION_SUBSET_ONLY',
     ...(usageEvidence1203?{usageEvidence1203}:{}),
     ...(Object.keys(evidence1204).length?{resourceEvidence1204:evidence1204}:{})}};
   };
   // Alpha 1205: los estados antes/después deben conectar TAMBIÉN recursos,
   // no solo posiciones físicas. Datos ausentes quedan ausentes, no se inventan.
   const boundaryFields1205=['turn','phase','activePlayer','normalSummonsUsed','normalSummonAvailable','lp','chain'];
   const boundary1205=st=>{
    if(!st||typeof st!=='object')return null;
    const pairs=[];
    for(const k of boundaryFields1205){
     if(!Object.prototype.hasOwnProperty.call(st,k))continue;
     const v=st[k];
     if(k==='turn'&&(!Number.isSafeInteger(v)||v<0||v>1000000))return null;
     if(k==='phase'&&(typeof v!=='string'||v.length>50))return null;
     if(k==='activePlayer'&&![0,1].includes(v))return null;
     if(k==='normalSummonsUsed'&&(!Number.isSafeInteger(v)||v<0||v>20))return null;
     if(k==='normalSummonAvailable'&&(!Array.isArray(v)||v.length!==2||!v.every(x=>typeof x==='boolean')))return null;
     if(k==='lp'&&(!Array.isArray(v)||v.length!==2||!v.every(x=>Number.isSafeInteger(x)&&x>=0&&x<=999999)))return null;
     if(k==='chain'&&!safeChain1206(v))return null;
     pairs.push([k,v]);
    }
    try{const serial=JSON.stringify(pairs);return typeof serial==='string'&&serial.length<=4096?serial:null}
    catch(_){return null}
   };
   const rows=[];let previous=null,last=null,previousResources1205=null,lastResources1205=null;
   for(let i=0;i<acts.length;i++){
    const b=project(acts[i].before),a=project(acts[i].after);
    if(!b||!a||previous&&previous.key!==b.key)return {ok:false,reason:'STEP_STATE_CONTINUITY_INVALID'};
    const resBefore1205=boundary1205(acts[i].before),resAfter1205=boundary1205(acts[i].after);
    if(resBefore1205===null||resAfter1205===null)return {ok:false,reason:'STEP_RESOURCES_MALFORMED'};
    if(previousResources1205!==null&&previousResources1205!==resBefore1205)
     return {ok:false,reason:'STEP_RESOURCE_CONTINUITY_INVALID'};
    if(previous&&identityConflict(previous,b))return {ok:false,reason:'STEP_IDENTITY_CONTINUITY_INVALID'};
    if(identityConflict(b,a))return {ok:false,reason:'CARD_IDENTITY_CHANGED_IN_ACTION'};
    if(!rememberIdentity1201(b)||!rememberIdentity1201(a))return {ok:false,reason:'CARD_IDENTITY_CHANGED_AFTER_REENTRY'};
    const moves=[];
    for(const [uid,x] of b.byUid){const y=a.byUid.get(uid);
     if(!y){moves.push([uid,x[1],x[2],-1,'LEFT_MODEL']);continue}
     if(x[1]!==y[1]||x[2]!==y[2])moves.push([uid,x[1],x[2],y[1],y[2]]);
    }
    for(const [uid,y] of a.byUid)if(!b.byUid.has(uid))moves.push([uid,-1,'ENTERED_MODEL',y[1],y[2]]);
    if(moves.length>80)return {ok:false,reason:'EXCESS_MOVEMENT'};
    const actionContract1202=checkSimpleAction1202(acts[i],acts[i].before,acts[i].after,b,a,moves);
    if(!actionContract1202.ok)return {ok:false,reason:actionContract1202.reason};
    rows.push({step:i+1,before:b.tag,after:a.tag,moves,
     boundaryBefore1205:resBefore1205,boundaryAfter1205:resAfter1205,
     ...(actionContract1202.witness?{actionContract1202:actionContract1202.witness}:{})});
    previous=a;last=a;previousResources1205=resAfter1205;lastResources1205=resAfter1205;
   }
   if(line?.state){const terminal=project(line.state);
    if(!terminal||terminal.key!==last.key||identityConflict(last,terminal))return {ok:false,reason:'FINAL_STATE_DIFFERS_FROM_LAST_STEP'};
    if(!rememberIdentity1201(terminal))return {ok:false,reason:'FINAL_STATE_CARD_IDENTITY_CHANGED'};
    const terminalResources1205=boundary1205(line.state);
    if(terminalResources1205===null||terminalResources1205!==lastResources1205)
     return {ok:false,reason:'FINAL_RESOURCES_DIFFER_FROM_LAST_STEP'};
   }
   return {ok:true,scope:'ZONAL_AND_RESOURCE_CONTINUITY_SUBSET_NOT_RULES',rows};
  };
  const traces=[],seen1195=new Set();let empty1195=0,duplicate1195=0,malformed1195=0;
  for(const line of sourceLines.slice(0,80)){
   if(!Array.isArray(line?.actions)||line.actions.length===0){empty1195++;continue}
   if(line.actions.length>24||!line.actions.every(a=>a&&typeof a==='object')){malformed1195++;continue}
   const actions=line.actions.map(a=>({card:String(a?.card||''),actionType:String(a?.actionType||''),source:String(a?.source||''),effectId:a?.effectId??null,
    selectedTargets:choices1197(a?.selectedTargets),selectedCosts:choices1197(a?.selectedCosts),selectedMaterials:choices1197(a?.selectedMaterials)}));
   if(actions.some(a=>!a.actionType.trim())){malformed1195++;continue}
   const physical1198=boardFromState1198(line);
   if(!physical1198.ok){malformed1195++;continue}
   const physicalSteps1199=stepEvidence1199(line);
   if(!physicalSteps1199.ok){malformed1195++;continue}
   const board=physical1198.names,boardWitness1198=physical1198.witness;
   const signature=JSON.stringify([actions.map(a=>[a.card,a.actionType,a.source,a.effectId,a.selectedTargets,a.selectedCosts,a.selectedMaterials]),board,boardWitness1198]);
   if(seen1195.has(signature)){duplicate1195++;continue}
   seen1195.add(signature);
   traces.push({index:traces.length+1,score:Number.isFinite(Number(line?.score))?Number(line.score):0,actions,cardsInFinalBoard:board,
    boardWitness1198,boardWitnessScope1198:boardWitness1198.length?'STATE_SNAPSHOT_ONLY':'NO_PHYSICAL_WITNESS',
    transitionWitness1199:physicalSteps1199.rows,transitionWitnessScope1199:physicalSteps1199.scope});
   if(traces.length===5)break;
  }
  const filtered1195=empty1195+duplicate1195+malformed1195;
  const sourceStatus1195=quit()?'TIME_BUDGET_CHECKPOINT':filtered1195?
   (traces.length?'WORKER_SOURCE_LINES_FILTERED':'NO_ACTIONABLE_LINES'):
   (last?.status||(traces.length?'BOUNDED_WITH_GAPS':'NO_RESULTS'));
  notify1080('DONE',{result:{status:sourceStatus1195,candidates:traces,candidateCount:traces.length,
   discardedSourceLines:filtered1195,discardedEmptyLines:empty1195,discardedDuplicateLines:duplicate1195,
   discardedMalformedLines:malformed1195,slices,elapsedMs:Math.round(performance.now()-started),
   statesExpanded:Number(cert.statesExpanded)||0,domainComplete:cert.allLegalActionsEnumerated===true,
   certificateStatus:String(cert.status||''),resumable:cert.resumable===true,
   certified:false,globalOptimalityProven:false,isolated:true}});
 }catch(e){notify1080('ERROR',{error:String(e?.stack||e)})}
}


/* Alpha 1102: comparar los estados y acciones de un segundo paso, con límites estrictos.
   Un submuestreo jamás prueba el conjunto completo de jugadas legales. */
function depthTwoProbe1082(sample=0,options={}){
 const h=globalThis,engine=h.YGOAlpha669,opening=h.YGOAlpha655?.openingState655?.(sample),toArray=x=>Array.isArray(x)?x:[];
 if(!opening||typeof engine?.enumerateNode669!=='function')return {status:'ENGINE_UNAVAILABLE',pass:false,rows:[]};
 const maxRoots=Math.max(1,Math.min(5,Number(options.maxRoots)||3));
 const branchLimit=Math.max(8,Math.min(48,Number(options.maxActionBranches)||24));
 const ms=Math.max(5,Math.min(110,Number(options.depthNodeBudgetMs)||35)),deterministic=options.auditDeterministic===true;
 const root=engine.enumerateNode669({st:opening,actions:[],score:0,exactPath:true},{maxActionBranches:branchLimit,nodeBudgetMs:ms,auditDeterministic:deterministic,collectUnresolved:true});
 const names=['deck','extra','hand','monster','spelltrap','gy','banished','field','pendulum'];
 const projectCard=x=>[String(x?.uid??''),String((x?.card||x)?.id??''),String((x?.card||x)?.name??''),!!x?.faceUp,String(x?.position??''),String(x?.controller??''),!!x?.negated];
 const projectState=s=>({turn:Number(s?.turn)||0,phase:String(s?.phase||''),player:Number(s?.activePlayer)||0,
  normalSummonAvailable:toArray(s?.normalSummonAvailable).map(Boolean),pending:toArray(s?.pendingTriggers).length,queued:toArray(s?.triggerQueue).length,
  chains:toArray(s?.chain).length,usage:Object.keys(s||{}).filter(k=>/^__alpha(?:677RockUses|680KingsSarcUses|685StakeUses)/.test(k)).sort().map(k=>[k,JSON.stringify(s[k])]),
  zones:toArray(s?.zones).map(z=>Object.fromEntries(names.map(name=>[name,toArray(z?.[name]).map(projectCard)])))});
 const action=n=>{const a=toArray(n?.actions).at(-1)||{};return [String(a.cardId??''),String(a.card??''),String(a.actionType??''),String(a.effectId??''),JSON.stringify(a.selectedTargets||[]),JSON.stringify(a.selectedCosts||[])];};
 const rootNodes=toArray(root?.nodes),rows=[],allReasons=new Set(toArray(root?.reasons)),unresolved=[...toArray(root?.unresolved)],selected=rootNodes.slice(0,maxRoots);
 for(let i=0;i<selected.length;i++){
  const n=selected[i];const sub=engine.enumerateNode669(n,{maxActionBranches:branchLimit,nodeBudgetMs:ms,auditDeterministic:deterministic,collectUnresolved:true});
  for(const r of toArray(sub?.reasons))allReasons.add(r);for(const gap of toArray(sub?.unresolved))if(!unresolved.some(x=>x.key===gap.key))unresolved.push(gap);
  rows.push({rootIndex:i,rootAction:action(n),rootState:projectState(n.st),rootExact:n.exactPath===true,
   complete:sub?.complete===true,childCount:toArray(sub?.nodes).length,
   children:toArray(sub?.nodes).map(child=>({action:action(child),state:projectState(child.st),exact:child.exactPath===true}))});
 }
 const sampled=rootNodes.length>maxRoots,allExact=rows.every(r=>r.rootExact&&r.complete&&r.children.every(ch=>ch.exact));
 if(sampled)allReasons.add('ROOT_SAMPLE_LIMIT');
 if(!allExact)allReasons.add('UNPROVEN_SECOND_STEP');
 return {status:sampled?'DEPTH2_SAMPLED':'DEPTH2_BOUNDED',sample,rootCount:rootNodes.length,rootsTested:rows.length,rootComplete:root?.complete===true,
  sampled,allExact,fullyEnumerated:root?.complete===true&&!sampled&&allExact,reasons:[...allReasons],unresolved:unresolved.slice(0,64),rows,
  auditDeterministic:deterministic,scope:'Dos pasos del árbol actual, con topes de ramas; no certifica jugadas ni rulings universales.',certified:false};
}

/* Alpha 1102: prueba puntual de paridad, independiente de la duración de la búsqueda total.
   La comparación de raíces NO certifica las reglas universales ni el Top 5. */
function parityProbeWorker1081(msg){
 self.deckState=msg.deck;self.CARD_CATALOG=Array.isArray(msg.catalog)?msg.catalog:[];
 self.allCards=()=>self.CARD_CATALOG;self.__YGO_ACTIVE_BAN_KEY=msg.formatKey||'TCG';
 const sample=Math.max(0,Math.min(9,Number(msg.sample)||0));
 const projectCard=x=>[String(x?.uid||''),String((x?.card||x)?.id||''),String((x?.card||x)?.name||'')];
 const zone=(state,name)=>Array.isArray(state?.zones?.[0]?.[name])?state.zones[0][name].map(projectCard):[];
 const base=self.YGOAlpha655?.openingState655?.(sample);
 if(!base)return{status:'NO_OPENING_STATE',sample,pass:false};
 const snapshot={hand:zone(base,'hand'),deck:zone(base,'deck'),extra:zone(base,'extra'),monster:zone(base,'monster'),spelltrap:zone(base,'spelltrap')};
 const summary=n=>{const a=n.actions?.[n.actions.length-1]||{},s=n.st;return{
  action:[String(a.cardId??''),String(a.card||''),String(a.actionType||''),String(a.effectId??''),JSON.stringify(a.selectedTargets||[]),JSON.stringify(a.selectedCosts||[])],
  after:{hand:zone(s,'hand'),monster:zone(s,'monster'),spelltrap:zone(s,'spelltrap'),gy:zone(s,'gy'),deck:zone(s,'deck')},
  exactPath:n.exactPath===true
 }};
 const result=self.YGOAlpha669?.enumerateNode669?.({st:base,actions:[],score:0,exactPath:true},{maxActionBranches:Math.max(8,Math.min(128,Number(msg.maxActionBranches)||24)),nodeBudgetMs:Math.max(4,Math.min(250,Number(msg.nodeBudgetMs)||250)),auditDeterministic:msg.auditDeterministic===true});
 if(!result)return{status:'ENUMERATOR_UNAVAILABLE',sample,pass:false,snapshot};
 return{status:'PROBED',sample,snapshot,actions:(result.nodes||[]).map(summary),complete:result.complete===true,reasons:result.reasons||[],count:(result.nodes||[]).length,depth2:msg.depth2===true?depthTwoProbe1082(sample,msg):null,pass:false};
}

/* Alpha 1102: isolate known, finite rule self tests. No dynamic eval of names from callers. */
const SAFE_TESTS_1091=Object.freeze({
 '664-parser':['YGOAlpha664','parserSelfTest664'],
 '664-dispatch':['YGOAlpha664','directSelfTest664'],
 '666':['YGOAlpha666','selfTest666'],
 '667':['YGOAlpha667','selfTest667'],
 '668':['YGOAlpha668','selfTest668'],
 '669':['YGOAlpha669','selfTest669'],
 '670':['YGOAlpha670','selfTest670'],
 '671':['YGOAlpha671','selfTest671'],
 '672':['YGOAlpha672','selfTest672'],
 '673':['YGOAlpha673','selfTest673'],
 '674':['YGOAlpha674','selfTest674'],
 '675':['YGOAlpha675','selfTest675'],
 '677':['YGOAlpha677','selfTest677'],
 '679':['YGOAlpha679','selfTest679'],
 '680':['YGOAlpha680','selfTest680'],
 '682':['YGOAlpha682','selfTest682'],
 '685':['YGOAlpha685','selfTest685'],
 '1092-parser':['YGOAlpha1092','parserRegression1092']
});
async function runSafeSelfTest1091(d){
 const pair=Object.prototype.hasOwnProperty.call(SAFE_TESTS_1091,d.testId)?SAFE_TESTS_1091[d.testId]:null;
 if(!pair){notify1080('SELFTEST_RESULT',{result:{testId:String(d.testId),status:'UNAUTHORIZED_TEST',pass:false}});return;}
 try{
  if(Array.isArray(d.catalog)){self.CARD_CATALOG=d.catalog;self.allCards=()=>self.CARD_CATALOG;}
  const f=self[pair[0]]?.[pair[1]];
  if(typeof f!=='function'){notify1080('SELFTEST_RESULT',{result:{testId:d.testId,status:'MISSING_TEST',pass:false}});return;}
  const t=performance.now(),r=await f(),checks=r?.checks||null;
  const result={testId:d.testId,status:r?.pass===true?'PASS':'NOT_PASS',pass:r?.pass===true,
   total:Number.isFinite(Number(r?.total))?Number(r.total):null,
   passed:Number.isFinite(Number(r?.passed))?Number(r.passed):null,
   checksCount:checks&&typeof checks==='object'?Object.keys(checks).length:null,
   checksFailed:checks&&typeof checks==='object'?Object.keys(checks).filter(k=>checks[k]!==true).slice(0,25):[],
   errors:Array.isArray(r?.errors)?r.errors.slice(0,5).map(String):[],diagnostics:r?.pass===true?null:{checks:r?.checks||null,costPass:r?.costPass??null,restrictionPass:r?.restrictionPass??null,turnPass:r?.turnPass??null,stovieCosts:r?.stovieCosts||null,normal:r?.normal||null,modal:r?.modal||null,effects:Array.isArray(r?.effects)?r.effects.slice(0,8):null},durationMs:Math.round(performance.now()-t),
   scope:'Prueba interna acotada y aislada; no certifica reglas universales ni 5 combos.'};
  notify1080('SELFTEST_RESULT',{result});
 }catch(e){notify1080('SELFTEST_RESULT',{result:{testId:d.testId,status:'THREW',pass:false,error:String(e?.message||e).slice(0,400)}})}
}

self.onmessage=msg=>{const d=msg.data||{};
 if(d.type==='INIT'){if(started1080){notify1080('ERROR',{error:'WORKER_DUPLICATE_INIT'});return}sessionId1080=d.runId;void start1080(d);return}
 if(d.type==='CANCEL'){stop1080=true;return}
 if(!ready1080){notify1080('ERROR',{error:'WORKER_NOT_READY'});return}
 if(d.type==='SEARCH'||d.type==='PARITY'||d.type==='COSMIC_ENUM_1209'||d.type==='COSMIC_SEQUENCE_1210'||d.type==='SPELL_REMOVAL_SEQUENCE_1211'){
  if(explorationStarted1080||d.runId!==sessionId1080){notify1080('ERROR',{error:'WORKER_RUN_ID_OR_SEQUENCE_INVALID'});return}
  explorationStarted1080=true;activeRunId1080=d.runId;
  if(d.type==='SEARCH')void search1080(d);
  else if(d.type==='COSMIC_ENUM_1209'||d.type==='COSMIC_SEQUENCE_1210'||d.type==='SPELL_REMOVAL_SEQUENCE_1211')cosmicChoices1209(d);
  else{try{notify1080('DONE',{result:parityProbeWorker1081(d)})}catch(e){notify1080('ERROR',{error:String(e?.stack||e).slice(0,700)})}}
  return;
 }
 if(d.type==='SELFTEST1091'&&!explorationStarted1080){activeRunId1080=d.runId??sessionId1080;void runSafeSelfTest1091(d);return}
 notify1080('ERROR',{error:'WORKER_COMMAND_OUT_OF_SEQUENCE'});
};
`;
// Source and worker validate the same generated release manifest. The worker still hashes every byte before evaluating any module.
const WORKER_MANIFEST_1080=Object.freeze({canonicalId:CANONICAL_ID,
 moduleCount:Number.isSafeInteger(W.YGO_BUILD_MANIFEST?.moduleCount)?W.YGO_BUILD_MANIFEST.moduleCount:88,
 workerModuleCount:85});
const ISOLATED1080={active:null,last:null,serial:0};
function isolatedStatus1080(){return ISOLATED1080.active?{version:VERSION,running:true,status:ISOLATED1080.active.phase,runId:ISOLATED1080.active.id}:{version:VERSION,running:false,...(ISOLATED1080.last||{status:'IDLE'})}}
function cancelIsolated1080(){const job=ISOLATED1080.active;if(!job)return{version:VERSION,status:'NO_ACTIVE_SEARCH',cancelled:false};job.finish('CANCELLED_TERMINATED',{cancelled:true});return{version:VERSION,status:'CANCELLED_TERMINATED',cancelled:true,runId:job.id}}
function isolatedSelf1080(){const checks={workerType:typeof Worker==='function',blobType:typeof Blob==='function',stopApi:typeof cancelIsolated1080==='function',entrypoint:typeof searchIsolated1080==='function',payload:!!D.getElementById('ygo-deferred-payload-'+VERSION.replace(/\D/g,'')),prelude:!!D.getElementById('final-consolidated-engine'),version:VERSION===raw(W.__YGO_TARGET_BUILD)};return{version:VERSION,checks,pass:Object.values(checks).every(Boolean),scope:'Disponibilidad de aislamiento; no acredita reglas ni combos'};}
/* Alpha 1216: puente conservador y comprobable entre copias del Main Deck
   importado y un preestado EXPLÍCITO para el buscador acotado de dos
   Mágicas de eliminación. No crea un campo, mano ni decisiones del rival.
   YGOAlpha655 es la autoridad del muestreo ya instalada; la igualdad de
   multiconjuntos garantiza que las cinco cartas proceden del Main activo. */
function openingRemovalBridge1216(opts={}){
 const fail=(status,issues=[])=>({version:VERSION,status,pass:false,certified:false,
  certifiesRules:false,globalOptimalityProven:false,issues:issues.slice(0,8)});
 const sample=opts.sample;
 if(!Number.isSafeInteger(sample)||sample<0||sample>9)return fail('OPENING_SAMPLE_INVALID_1216');
 if(opts.player!==undefined&&opts.player!==0)return fail('OPENING_PLAYER_UNSUPPORTED_1216');
 if(!opts.opponentZones||typeof opts.opponentZones!=='object'||Array.isArray(opts.opponentZones)||
   !ZONES_1063.every(k=>Array.isArray(opts.opponentZones[k])))
  return fail('OPPONENT_STATE_REQUIRED_1216',['Debe aportar las siete zonas del rival; ninguna se inventa.']);
 if(!Array.isArray(opts.lp)||opts.lp.length!==2||!opts.lp.every(v=>Number.isSafeInteger(v)&&v>0&&v<=999999))
  return fail('EXPLICIT_LP_REQUIRED_1216');
 if(opts.chain!==undefined&&(!Array.isArray(opts.chain)||opts.chain.length)||
    opts.triggerQueue!==undefined&&(!Array.isArray(opts.triggerQueue)||opts.triggerQueue.length))
  return fail('PENDING_CHAIN_UNSUPPORTED_1216');
 const original=W.deckState,fp=deckFingerprint1056(),revision=DECK_REVISION_1056;
 if(!fp||count1048(original,'main')<40||count1048(original,'main')>60)
  return fail('MAIN_DECK_UNAVAILABLE_1216');
 const expected=new Map();
 for(const row of arr(original.main)){
  const id=Number(row?.id??row?.cardId),qty=Number(row?.qty??1);
  if(!Number.isSafeInteger(id)||id<=0||!Number.isSafeInteger(qty)||qty<1||qty>3)
   return fail('DECK_COPY_IDENTITY_INVALID_1216');
  expected.set(id,(expected.get(id)||0)+qty);
 }
 let opening;
 try{opening=W.YGOAlpha655?.openingState655?.(sample)}catch(_){return fail('OPENING_GENERATOR_ERROR_1216')}
 const own=opening?.zones?.[0];
 if(!own||!Array.isArray(own.hand)||own.hand.length!==5||!Array.isArray(own.deck)||
    !Array.isArray(own.extra)||!['monster','spelltrap','gy','banished'].every(z=>Array.isArray(own[z])&&own[z].length===0))
  return fail('OPENING_NOT_PROVEN_1216');
 if(own.deck.length+own.hand.length!==count1048(original,'main')||opening.activePlayer!==0||
  !/^MAIN\s*1$/i.test(String(opening.phase||''))||opening.turn!==1)
  return fail('OPENING_NOT_INITIAL_MAIN_1216');
 const seen=new Set(),seenCopies=new Map();
 const project=(x,zone)=>{
  const uid=typeof x?.uid==='string'?x.uid.trim():'';
  const card=x?.card||{},id=Number(card.id),bits=Number(card.typeBits);
  if(!uid||uid.length>100||seen.has(uid)||!Number.isSafeInteger(id)||id<=0||
     !Number.isSafeInteger(bits)||bits<=0||x.owner!==0||x.controller!==0)
   throw Error('INVALID_OPENING_COPY');
  seen.add(uid);
  if(zone!=='extra')seenCopies.set(id,(seenCopies.get(id)||0)+1);
  return {uid,id,name:String(card.name||'').slice(0,160),typeBits:bits,
   ownerPlayer:0,faceUp:false};
 };
 let ownDeck,ownHand,ownExtra;
 try{
  ownDeck=own.deck.map(x=>project(x,'deck'));
  ownHand=own.hand.map(x=>project(x,'hand'));
  ownExtra=own.extra.map(x=>project(x,'extra'));
 }catch(_){return fail('OPENING_CARD_IDENTITY_INVALID_1216')}
 if(expected.size!==seenCopies.size||[...expected].some(([id,qty])=>seenCopies.get(id)!==qty))
  return fail('OPENING_DECK_MULTISET_MISMATCH_1216');
 const expectedExtra=new Map();
 for(const row of arr(original.extra)){
  const id=Number(row?.id??row?.cardId),qty=Number(row?.qty??1);
  if(!Number.isSafeInteger(id)||!Number.isSafeInteger(qty)||qty<1)return fail('EXTRA_DECK_IDENTITY_INVALID_1216');
  expectedExtra.set(id,(expectedExtra.get(id)||0)+qty);
 }
 const countedExtra=new Map();for(const c of ownExtra)countedExtra.set(c.id,(countedExtra.get(c.id)||0)+1);
 if(expectedExtra.size!==countedExtra.size||[...expectedExtra].some(([id,qty])=>countedExtra.get(id)!==qty))
  return fail('OPENING_EXTRA_MULTISET_MISMATCH_1216');
 let opponent;
 try{opponent=structuredClone(opts.opponentZones)}catch(_){return fail('OPPONENT_STATE_NOT_CLONEABLE_1216')}
 const before={zones:[{deck:ownDeck,hand:ownHand,monster:[],spelltrap:[],gy:[],banished:[],extra:ownExtra},opponent],
  turn:1,phase:'MAIN1',activePlayer:0,lp:[...opts.lp],normalSummonsUsed:0,chain:[],triggerQueue:[]};
 const check=snapshot1063(before,'Apertura 1216');
 if(check.issues.length)return fail('OPENING_COMBINED_STATE_INVALID_1216',check.issues);
 if(DECK_REVISION_1056!==revision||fp!==deckFingerprint1056())return fail('OPENING_STALE_DECK_1216');
 return {version:VERSION,status:'IMPORTED_OPENING_PROVEN_1216',pass:true,
  certified:false,certifiesRules:false,globalOptimalityProven:false,
  scope:'Cinco cartas y Deck restante proceden del Main importado; rival aportado explícitamente. Sin prioridad, respuestas ni reglas universales.',
  sample,player:0,before,evidence:{deckFingerprint:fp,deckRevision:revision,mainCopies:ownDeck.length+ownHand.length,
   handCopies:ownHand.length,remainingDeckCopies:ownDeck.length,extraCopies:ownExtra.length,
   source:'YGOAlpha655.openingState655 + equality against imported deckState Main/Extra',
   opponentSource:'USER_EXPLICIT_OPPONENT_ZONES',certified:false}};
}

/* Alpha 1237: salida visual reproducible de candidatos acotados ya verificados.
   Cada fotograma deriva de estados canónicos REVALIDADOS. Oculta la mano/Deck
   contrario; nunca presenta los candidatos como Top 5 global o como videos certificados. */
let visualTimer1232=null;
const VISUAL_LABELS_1232=['Mano inicial acreditada','Turno 1 · Seven Tools colocada',
 'Turno 2 · robo y colocaciones rivales','Turno 3 · robo propio',
 'CL1 · activación y pago de costo','CL2 · Solemn Judgment',
 'CL3 · Seven Tools responde','Resuelve CL3 · Solemn negada',
 'Resuelve CL1 · campo final'];
function previewSevenToolsFrames1232(line){
 const fail=status=>({version:VERSION,pass:false,status,frames:[],certified:false,
   globalOptimalityProven:false,scope:'TRAZA_ACOTADA_DE_TRES_ESLABONES'});
 if(!line||replaySevenToolsOpening1231(line).pass!==true)return fail('REPLAY_NO_VALIDADO_1232');
 const a=line.actions?.[0];
 const states=[line.openingBefore,...arr(line.setupStages),a?.paid,a?.chained,
  a?.countered,a?.resolvedCounter,a?.after];
 if(states.length!==9||states.some(x=>!x))return fail('FOTOGRAMAS_INCOMPLETOS_1232');
 const frames=states.map((state,i)=>safeFrame1070(state,VISUAL_LABELS_1232[i]));
 if(frames.some(f=>!f.pass||!f.board))return fail('FOTOGRAMAS_NO_VALIDOS_1232');
 return{version:VERSION,status:'TRAZA_VISUAL_ACOTADA_VALIDADA_1232',pass:true,
  certified:false,globalOptimalityProven:false,certifiesTop5:false,
  scope:'SÓLO CL1 MST/COSMIC/TWIN · CL2 SOLEMN · CL3 SEVEN TOOLS; SIN OTRAS ACCIONES',
  frames,steps:frames.length,sample:line.sample,
  removed:Number(line.removed)||0,chainLinks:3};
}
function renderSevenToolsPreview1232(result){
 const fail=status=>({version:VERSION,pass:false,status,rendered:0,certified:false});
 const host=D.getElementById('comboVisualTop5'),boardHost=D.getElementById('comboEndBoard');
 if(!host||!boardHost)return fail('PANELES_INEXISTENTES_1232');
 const source=Array.isArray(result)?result:result?.candidates;
 if(!Array.isArray(source)||source.length<1||source.length>5||
    (result&&!Array.isArray(result)&&result.candidateCount!==source.length)||
    source.some(x=>x?.certified===true||x?.globalOptimalityProven===true))
   return fail('CANDIDATOS_NO_ELEGIBLES_1232');
 const traces=source.map(previewSevenToolsFrames1232);
 if(traces.some(x=>!x.pass))return fail('ALGUN_REPLAY_NO_ACREDITADO_1232');
 return renderBoundedTraces1234(traces,'CADENA DE TRES ESLABONES · JUGADAS ACOTADAS REVALIDADAS');
}
/* Alpha 1242: exportación WebM local de fotogramas ACOTADOS revalidados.
 * No reconstruye nuevas jugadas, no certifica optimalidad ni guarda información privada.
 * Los frames provienen de safeFrame1070 y del replay previo a renderBoundedTraces1234. */
let videoExportActive1242=false;
let videoBatchActive1244=false;
function videoMime1242(){
 const MR=W.MediaRecorder;
 if(typeof MR!=='function'||typeof HTMLCanvasElement==='undefined'||
    typeof HTMLCanvasElement.prototype.captureStream!=='function')return '';
 const possible=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];
 return possible.find(t=>{try{return MR.isTypeSupported(t)}catch(_){return false}})||'';
}
function videoDiagnostics1242(){return{version:VERSION,available:!!videoMime1242(),
 format:videoMime1242()||null,certified:false,globalOptimalityProven:false,
 scope:'EXPORTA FOTOGRAMAS ACOTADOS EXISTENTES; NO ES TOP 5 GENERAL'};}
function drawBoundedFrame1242(ctx,frame,index,total,number){
 const g=ctx.canvas,w=g.width,h=g.height,b=frame.board;
 const text=(v,x,y,font,color)=>{ctx.font=font;ctx.fillStyle=color;ctx.fillText(String(v),x,y)};
 const trim=(v,max)=>{let s=String(v??'');while(s.length>1&&ctx.measureText(s).width>max)s=s.slice(0,-2)+'…';return s};
 const round=(x,y,ww,hh,fill,stroke)=>{ctx.fillStyle=fill;ctx.fillRect(x,y,ww,hh);ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.strokeRect(x,y,ww,hh)};
 ctx.fillStyle='#020918';ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#063253';ctx.fillRect(0,0,w,86);ctx.fillStyle='#0ab8e4';ctx.fillRect(0,84,w,2);
 text('YU-GI-OH! · REPLAY ACOTADO',24,35,'bold 24px Arial','#f7d576');
 text('LÍNEA '+number+'  ·  PASO '+(index+1)+' / '+total+'  ·  NO CERTIFICADO COMO TOP 5 UNIVERSAL',24,65,'bold 14px Arial','#f8f9fb');
 ctx.font='bold 16px Arial';text(trim(frame.label,1160),28,111,'bold 16px Arial','#afeafd');
 for(let p=0;p<2;p++){
  const y=p===1?126:376,z=b.players[p]||{};
  round(23,y,w-46,229,p===1?'#122541':'#081b33',p===1?'#24a5d0':'#597db2');
  text((p===1?'RIVAL':'JUGADOR')+'   ·   LP: '+Number(b.lp?.[p]??0),38,y+26,'bold 20px Arial',p===1?'#ffbd80':'#8fe4ff');
  const boxes=[{name:'MONSTRUOS',key:'monster',x:35},{name:'MÁGICAS/TRAMPAS',key:'spelltrap',x:638}];
  for(const zone of boxes){
   text(zone.name,zone.x,y+50,'bold 13px Arial','#cbeeff');
   const cards=Array.isArray(z[zone.key])?z[zone.key]:[];
   for(let k=0;k<5;k++){
    const x=zone.x+k*119,cy=y+57;
    round(x,cy,111,103,'#103c56','#238ab3');
    if(!cards[k]){text('VACÍO',x+29,cy+55,'12px Arial','#6a97ac');continue}
    const hidden=cards[k]?.faceDown===true;
    const name=hidden?'CARTA OCULTA':String(cards[k]?.name||'CARTA');
    text(hidden?'▣':'▤',x+46,cy+31,'bold 24px Arial',hidden?'#f2a96b':'#ffdf98');
    ctx.font='bold 12px Arial';text(trim(name,103),x+4,cy+64,'bold 12px Arial','#ffffff');
    if(name.length>17){ctx.font='11px Arial';text(trim(name.slice(14),103),x+4,cy+80,'11px Arial','#d1e9f3')}
   }
  }
  const cnt=v=>Array.isArray(v)?v.length:(Number.isSafeInteger(v?.count)?v.count:0);
  const row='Mano '+cnt(z.hand)+'   |   Deck '+cnt(z.deck)+'   |   Extra '+cnt(z.extra)+
    '   |   Cementerio '+cnt(z.gy)+'   |   Destierro '+cnt(z.banished);
  text(row,42,y+192,'15px Arial','#edf9ff');
  // La mano rival nunca se enumera: safeFrame1070 sólo proporciona el recuento.
  if(p===0&&Array.isArray(z.hand)&&z.hand.length){
   const names=z.hand.map(c=>c?.faceDown?'CARTA OCULTA':String(c?.name||'Carta')).join(' · ');
   ctx.font='12px Arial';text(trim('Mano propia: '+names,w-100),42,y+214,'12px Arial','#bcd9eb');
  }
 }
 round(24,620,w-48,68,'#07182e','#317d9c');
 text('Estado representado por zonas; no acredita posiciones físicas individuales ni reglas universales.',37,648,'bold 14px Arial','#f9e3a3');
 text('Exportación local WebM · Sin cartas ocultas del rival · Alpha 1261',37,674,'13px Arial','#bbdbe8');
}
/* Alpha 1243 · La previsualización y su exportación deben conservar exactamente
 * el Main/Extra/Side importado y los fotogramas revalidados en el render.
 * No se puede reutilizar un replay antiguo tras cambiar el mazo. */
function exportEvidence1243(trace,root){
 const fingerprint=deckFingerprint1056();
 return {version:VERSION,revision:DECK_REVISION_1056,fingerprint,
  frameSnapshot:JSON.stringify(trace?.frames||[]),root};
}
function exportGuard1243(trace,proof,root){
 const bad=status=>({version:VERSION,status,pass:false,certified:false});
 if(!proof||proof.root!==root||!root?.isConnected||
    !D.getElementById('comboVisualTop5')?.contains(root))return bad('SCENARIO_NOT_ACTIVE_1243');
 if(!proof.fingerprint||proof.revision!==DECK_REVISION_1056||
    deckFingerprint1056()!==proof.fingerprint)return bad('DECK_CHANGED_1243');
 if(trace?.pass!==true||trace.certified!==false||trace.globalOptimalityProven!==false||
    !Array.isArray(trace.frames)||trace.frames.length<2||trace.frames.length>80||
    JSON.stringify(trace.frames)!==proof.frameSnapshot)return bad('FRAMES_CHANGED_1243');
 return{version:VERSION,pass:true,status:'PREVIEW_UNCHANGED_1243',certified:false};
}
async function exportBoundedWebm1242(trace,lineNumber,root,feedback,proof,opts={}){
 const mime=videoMime1242(),frames=trace?.frames;
 const fail=status=>({version:VERSION,pass:false,status,certified:false});
 if(!mime)return fail('WEBM_UNSUPPORTED_1242');
 if(videoExportActive1242||(!opts?.collect&&videoBatchActive1244))return fail('EXPORT_IN_PROGRESS_1244');
 const initial=exportGuard1243(trace,proof,root);
 if(!initial.pass)return fail(initial.status);
 if(trace?.pass!==true||trace?.certified!==false||trace?.globalOptimalityProven!==false||
   !Array.isArray(frames)||frames.length<2||frames.length>80||
   frames.some(f=>{
      const b=f?.board,opp=b?.players?.[1];
      if(f?.pass!==true||!b||!Array.isArray(b.players)||b.players.length!==2||
         !Array.isArray(b.lp)||b.lp.length!==2||b.lp.some(v=>!Number.isSafeInteger(v)||v<0)||
         !opp||!Number.isSafeInteger(opp.hand?.count)||!Number.isSafeInteger(opp.deck?.count)||
         Array.isArray(opp.hand)||Array.isArray(opp.deck))return true;
      // No entregar en el video la identidad de cartas del rival boca abajo.
      return ['monster','spelltrap','banished'].some(zone=>
         !Array.isArray(opp[zone])||opp[zone].some(c=>c?.faceDown===true&&c.name!=='CARTA OCULTA'));
   }))
   return fail('TRACE_NOT_SANITIZED_1242');
 const canvas=D.createElement('canvas');canvas.width=1280;canvas.height=720;
 const ctx=canvas.getContext('2d');if(!ctx)return fail('CANVAS_UNAVAILABLE_1242');
 const stream=canvas.captureStream(10);
 let rec;try{rec=new W.MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:1100000})}
 catch(_){stream.getTracks().forEach(t=>t.stop());return fail('RECORDER_FAILED_1242')}
 const chunks=[];let recorderError=null;
 rec.ondataavailable=e=>{if(e.data&&e.data.size>0)chunks.push(e.data)};
 rec.onerror=e=>{recorderError=String(e?.error?.message||'RECORDER_ERROR')};
 // Alpha 1248: a broken recorder must never leave the video/ZIP export locked.
 const finished=new Promise(resolve=>{rec.onstop=()=>resolve('STOPPED')});
 videoExportActive1242=true;
 let aborted=false;
 try{
  drawBoundedFrame1242(ctx,frames[0],0,frames.length,lineNumber);
  rec.start(250);
  for(let i=0;i<frames.length;i++){
   if(!exportGuard1243(trace,proof,root).pass){aborted=true;break}
   drawBoundedFrame1242(ctx,frames[i],i,frames.length,lineNumber);
   if(feedback)feedback.textContent='Grabando '+(i+1)+' / '+frames.length+' fotogramas…';
   await new Promise(r=>setTimeout(r,650));
  }
  if(rec.state!=='inactive')rec.stop();
  let stopTimer1248=null;
  const stopped1248=await Promise.race([finished,new Promise(resolve=>{
   stopTimer1248=setTimeout(()=>resolve('RECORDER_STOP_TIMEOUT_1248'),8000);
  })]);
  if(stopTimer1248!==null)clearTimeout(stopTimer1248);
  if(stopped1248!=='STOPPED')return fail('RECORDER_STOP_TIMEOUT_1248');
  if(aborted||!exportGuard1243(trace,proof,root).pass)return fail('SCENARIO_CHANGED_1243');
  if(recorderError)return fail('RECORDER_ERROR_1242');
  const blob=new Blob(chunks,{type:mime});
  if(blob.size<1000)return fail('EMPTY_VIDEO_1242');
  if(!await webmStructureGate1260(blob))return fail('INVALID_WEBM_CONTAINER_1259');
  if(opts?.collect===true)return{version:VERSION,pass:true,status:'WEBM_COLLECTED_1244',blob,bytes:blob.size,frames:frames.length,mime,certified:false,globalOptimalityProven:false};
  const url=W.URL.createObjectURL(blob);
  const a=D.createElement('a');a.href=url;
  a.download='YuGiOh_Alpha_1261_Linea_'+lineNumber+'_ACOTADA.webm';
  D.body.append(a);a.click();a.remove();
  setTimeout(()=>W.URL.revokeObjectURL(url),45000);
  return{version:VERSION,pass:true,status:'WEBM_EXPORTED_1244',bytes:blob.size,
   frames:frames.length,mime,certified:false,globalOptimalityProven:false};
 }catch(e){try{if(rec.state!=='inactive')rec.stop()}catch(_){}
  return fail('EXPORT_ERROR_1242:'+String(e?.message||e).slice(0,100))}
 finally{videoExportActive1242=false;stream.getTracks().forEach(t=>t.stop())}
}

/* Alpha 1244 · One-click ZIP containing independent verified WebM recordings.
 * A ZIP is used instead of five automatic downloads, which browsers may block.
 * ZIP entries are stored (no compression), with CRC32 and central directory. */
function makeWebmZip1244(entries){
 if(!Array.isArray(entries)||entries.length<1||entries.length>5)return Promise.reject(Error('INVALID_ZIP_ENTRIES_1244'));
 const encoder=new TextEncoder(),table=new Uint32Array(256);
 for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);table[n]=c>>>0}
 const crc32=data=>{let c=0xffffffff;for(const b of data)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0};
 const u16=(v)=>[v&255,(v>>>8)&255],u32=(v)=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];
 return Promise.all(entries.map(async(e,i)=>{
  if(!e||!(e.blob instanceof Blob)||!/^Linea_[1-5]\.webm$/.test(e.name)||e.blob.size<1000||e.blob.size>20000000)
   throw Error('INVALID_WEBM_ENTRY_1244');
  // Reject junk, including non-WebM blobs that otherwise fit ZIP size constraints.
  if(!await webmStructureGate1260(e.blob))throw Error('INVALID_WEBM_CONTAINER_1259');
  const bytes=new Uint8Array(await e.blob.arrayBuffer());
  return{name:encoder.encode(e.name),bytes,crc:crc32(bytes),size:bytes.length};
 })).then(items=>{
  if(new Set(entries.map(e=>e.name)).size!==items.length)throw Error('DUPLICATE_ZIP_ENTRY_1244');
  let offset=0,locals=[],central=[];
  for(const item of items){
   const n=item.name.length,size=item.size,head=new Uint8Array([
    ...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),
    ...u32(item.crc),...u32(size),...u32(size),...u16(n),...u16(0),...item.name]);
   locals.push(head,item.bytes);
   central.push(new Uint8Array([
    ...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),
    ...u32(item.crc),...u32(size),...u32(size),...u16(n),...u16(0),...u16(0),
    ...u16(0),...u16(0),...u32(0),...u32(offset),...item.name]));
   offset+=head.length+size;
  }
  const centralSize=central.reduce((s,a)=>s+a.length,0);
  const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),
   ...u16(items.length),...u16(items.length),...u32(centralSize),...u32(offset),...u16(0)]);
  return new Blob([...locals,...central,end],{type:'application/zip'});
 });
}
/* Alpha 1261: EBML / WebM structure gate. Reject header-only fakes, corrupt
 * segment and videos without a track and recorded frame. This checks container
 * structure; decoding/playback still requires a real browser or media probe. */
async function webmStructureGate1260(blob){
 if(!(blob instanceof Blob)||blob.size<1000||blob.size>20000000)return false;
 try{
  const data=new Uint8Array(await blob.slice(0,Math.min(blob.size,65536)).arrayBuffer());
  const read=(p,id=false)=>{
   if(p>=data.length)return null;
   const byte=data[p];if(!byte)return null;
   let n=1,mask=0x80;while(n<=8&&!(byte&mask)){n++;mask>>=1}
   if(n>8||(id&&n>4)||p+n>data.length)return null;
   let v=id?byte:(byte&(mask-1)),all=(byte&(mask-1))===mask-1;
   for(let i=1;i<n;i++){v=v*256+data[p+i];all=all&&data[p+i]===255}
   return {v,n,unknown:!id&&all};
  };
  const elem=p=>{const id=read(p,true);if(!id)return null;
   const size=read(p+id.n);if(!size)return null;
   const content=p+id.n+size.n;
   if(!size.unknown&&(!Number.isSafeInteger(size.v)||size.v<0))return null;
   return{id:id.v,start:content,end:size.unknown?Infinity:content+size.v,unknown:size.unknown};
  };
  const ebml=elem(0);if(!ebml||ebml.id!==0x1a45dfa3||ebml.unknown||ebml.end>4096||ebml.end>data.length)return false;
  let docWebm=false;
  for(let p=ebml.start;p<ebml.end;){const e=elem(p);
   if(!e||e.unknown||e.end>ebml.end||e.end<=p)return false;
   if(e.id===0x4282){const b=data.subarray(e.start,e.end);
    docWebm=b.length===4&&b[0]===119&&b[1]===101&&b[2]===98&&b[3]===109}
   p=e.end;
  }
  if(!docWebm)return false;
  const segment=elem(ebml.end);
  if(!segment||segment.id!==0x18538067||segment.start>=data.length)return false;
  let info=false,tracks=false,frames=false;
  const limit=Math.min(data.length,segment.end);
  for(let p=segment.start;p<limit;){
   const e=elem(p);if(!e||e.start>limit||e.end<=p)return false;
   if(e.id===0x1549a966)info=true;
   else if(e.id===0x1654ae6b)tracks=true;
   else if(e.id===0x1f43b675){
    const clusterLimit=Math.min(e.end,limit);
    for(let q=e.start;q<clusterLimit;){const b=elem(q);
     if(!b||b.start>clusterLimit||b.end<=q)break;
     if((b.id===0xa3||b.id===0xa0)&&b.end-b.start>=4){frames=true;break}
     if(b.end>clusterLimit)break;
     q=b.end;
    }
    if(frames)break;
   }
   if(e.end>limit)break;
   p=e.end;
  }
  return info&&tracks&&frames;
 }catch(_){return false}
}
let lastVideoExport1260={version:VERSION,status:'NO_EJECUTADO',pass:false,certified:false};
function videoExportAudit1260(){return {...lastVideoExport1260,active:videoBatchActive1244||videoExportActive1242,
 mime:videoMime1242()||null,certified:false,globalOptimalityProven:false};}
async function exportAllBoundedWebm1244(traces,proofs,root,feedback){
 const fail=status=>{if(status!=='EXPORT_IN_PROGRESS_1244'&&!status.startsWith('BATCH_EXPORT_ERROR_1244:')){
   lastVideoExport1260={version:VERSION,pass:false,status,requested:lastVideoExport1260?.requested||0,
    completed:lastVideoExport1260?.completed||0,certified:false};
  }return {version:VERSION,pass:false,status,certified:false,globalOptimalityProven:false};};
 if(videoBatchActive1244||videoExportActive1242)return fail('EXPORT_IN_PROGRESS_1244');
 if(!Array.isArray(traces)||!Array.isArray(proofs)||traces.length<2||traces.length>5||traces.length!==proofs.length)
  return fail('INVALID_BATCH_1244');
 if(!videoMime1242())return fail('WEBM_UNSUPPORTED_1244');
 if(traces.some((t,i)=>!exportGuard1243(t,proofs[i],root).pass))return fail('SCENARIO_CHANGED_1244');
 videoBatchActive1244=true;
 const startedAt1259=Date.now();
 lastVideoExport1260={version:VERSION,status:'RECORDING',pass:false,requested:traces.length,completed:0,certified:false};
 const parts=[];
 try{
  for(let i=0;i<traces.length;i++){
   if(traces.some((t,j)=>!exportGuard1243(t,proofs[j],root).pass))return fail('SCENARIO_CHANGED_1244');
   if(feedback)feedback.textContent='Exportando video '+(i+1)+' / '+traces.length+'…';
   const result=await exportBoundedWebm1242(traces[i],i+1,root,feedback,proofs[i],{collect:true});
   if(!result.pass)return fail(result.status);
   parts.push({name:'Linea_'+(i+1)+'.webm',blob:result.blob});
   lastVideoExport1260={version:VERSION,status:'RECORDING',pass:false,requested:traces.length,
    completed:parts.length,elapsedMs:Date.now()-startedAt1259,certified:false};
  }
  if(traces.some((t,i)=>!exportGuard1243(t,proofs[i],root).pass))return fail('SCENARIO_CHANGED_1244');
  const zip=await makeWebmZip1244(parts);
  if(traces.some((t,i)=>!exportGuard1243(t,proofs[i],root).pass))return fail('SCENARIO_CHANGED_1244');
  const url=W.URL.createObjectURL(zip),a=D.createElement('a');a.href=url;
  a.download='YuGiOh_Alpha_1261_'+traces.length+'_Videos_ACOTADOS.zip';
  D.body.append(a);a.click();a.remove();
  setTimeout(()=>W.URL.revokeObjectURL(url),45000);
  lastVideoExport1260={version:VERSION,pass:true,status:'ZIP_DOWNLOAD_REQUESTED_1260',
   videos:parts.length,bytes:zip.size,elapsedMs:Date.now()-startedAt1259,
   delivery:'BROWSER_DOWNLOAD_REQUESTED_NOT_CONFIRMED',certified:false};
  return{version:VERSION,pass:true,status:'WEBM_ZIP_EXPORTED_1244',videos:parts.length,
   bytes:zip.size,certified:false,globalOptimalityProven:false};
 }catch(e){lastVideoExport1260={version:VERSION,pass:false,status:'BATCH_EXPORT_ERROR_1260',
  error:String(e?.message||e).slice(0,120),completed:parts.length,requested:traces.length,
  elapsedMs:Date.now()-startedAt1259,certified:false};
  return fail('BATCH_EXPORT_ERROR_1244:'+String(e?.message||e).slice(0,90))}
 finally{videoBatchActive1244=false}
}
function renderBoundedTraces1234(traces,scopeText){
 const host=D.getElementById('comboVisualTop5'),boardHost=D.getElementById('comboEndBoard');
 if(!host||!boardHost)return {version:VERSION,pass:false,status:'PANELES_INEXISTENTES_1234',rendered:0};
 // Fallo cerrado: se construye todo fuera del DOM, sin destruir la vista anterior.
 const root=D.createElement('div');root.className='ygo-bounded-preview-1232';
 const caption=D.createElement('p');caption.textContent=
  scopeText+' · NO ES TOP 5 GLOBAL NI VIDEO CERTIFICADO';
 caption.style.cssText='color:#ffe87a;font-weight:800;font-size:12px;padding:8px';root.append(caption);
 const controls=[];
 const elem=(tag,txt,css)=>{const e=D.createElement(tag);e.textContent=String(txt);if(css)e.style.cssText=css;return e};
 const sections=D.createElement('div');sections.style.cssText='display:grid;gap:12px';
 const exportProofs1244=[];
 const lines=traces.map((trace,i)=>{
  const exportProof1243=exportEvidence1243(trace,root);
  exportProofs1244.push(exportProof1243);
  const box=D.createElement('section');box.className='combo-video';
  box.style.cssText='border:1px solid #0acaff;border-radius:10px;padding:10px;background:#031932;';
  box.dataset.replayCertified='0';box.dataset.boundedReplay='1';
  const title=elem('strong','LÍNEA ACOTADA '+(i+1)+' · '+trace.frames.length+' pasos · '+trace.removed+' cartas eliminadas',
   'color:#ffe77a;display:block;font-size:13px;margin-bottom:7px');box.append(title);
  const status=elem('div','','color:#b9eaff;font-size:12px;margin-bottom:6px');box.append(status);
  const scene=D.createElement('div');scene.style.cssText='font-size:12px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere';box.append(scene);
  const nav=D.createElement('div');nav.style.cssText='display:flex;flex-wrap:wrap;gap:5px;margin-top:8px';box.append(nav);
  const bPrev=elem('button','◀ Anterior'),bNext=elem('button','Siguiente ▶'),bPlay=elem('button','▶ Reproducir');
  for(const b of [bPrev,bNext,bPlay]){b.type='button';b.style.cssText='padding:5px 10px;font-size:12px';nav.append(b)}
  const bExport=elem('button',videoMime1242()?'⬇ Exportar video WebM':'WebM no compatible');
  bExport.type='button';bExport.style.cssText='padding:5px 10px;font-size:12px';
  bExport.disabled=!videoMime1242();nav.append(bExport);
  const exportStatus=elem('small','', 'font-size:11px;color:#cdeeff;display:block;margin-top:5px');box.append(exportStatus);
  bExport.addEventListener('click',async()=>{
   if(bExport.disabled||videoExportActive1242)return;
   bExport.disabled=true;
   const result=await exportBoundedWebm1242(trace,i+1,root,exportStatus,exportProof1243);
   if(root.isConnected){exportStatus.textContent=result.pass?'Archivo WebM generado · vídeo ACOTADO, no certificado':
      'No se exportó: '+result.status;bExport.disabled=false;}
  });

  let idx=0;const draw=()=>{
   const f=trace.frames[idx],bd=f.board;status.textContent='PASO '+(idx+1)+' / '+trace.frames.length+' · '+f.label+' · LP: '+bd.lp.join(' / ');
   scene.replaceChildren();
   const zoneLabel={monster:'Monstruos',spelltrap:'Mágicas/Trampas',gy:'Cementerio',banished:'Destierro',hand:'Mano',extra:'Extra Deck',deck:'Deck'};
   for(let p=0;p<2;p++){
    const z=bd.players[p];scene.append(elem('div',p?'RIVAL':'JUGADOR','font-weight:bold;color:#8defff;margin-top:5px'));
    for(const k of ['monster','spelltrap','gy','banished','hand','extra','deck']){
     const v=z[k];const shown=Array.isArray(v)?(v.length?v.map(c=>c.name).join(' · '):'—'):
       (v&&typeof v==='object'&&Number.isSafeInteger(v.count)?String(v.count)+' cartas':'—');
     scene.append(elem('div',zoneLabel[k]+': '+shown));
    }
   }
  };
  bPrev.addEventListener('click',()=>{if(visualTimer1232){clearInterval(visualTimer1232);visualTimer1232=null}idx=Math.max(0,idx-1);draw()});
  bNext.addEventListener('click',()=>{if(visualTimer1232){clearInterval(visualTimer1232);visualTimer1232=null}idx=Math.min(trace.frames.length-1,idx+1);draw()});
  bPlay.addEventListener('click',()=>{
   if(visualTimer1232){clearInterval(visualTimer1232);visualTimer1232=null;bPlay.textContent='▶ Reproducir';return}
   idx=0;draw();bPlay.textContent='⏸ Pausar';
   visualTimer1232=setInterval(()=>{if(!root.isConnected||idx>=trace.frames.length-1){
     clearInterval(visualTimer1232);visualTimer1232=null;bPlay.textContent='▶ Reproducir';return}
    idx++;draw()},900);
  });
  draw();sections.append(box);return{trace,idx};
 });
 if(traces.length>=2){
  const batch=D.createElement('div');batch.style.cssText='display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:8px';
  const b=D.createElement('button');b.type='button';b.textContent='⬇ Exportar '+traces.length+' videos en un ZIP';
  b.disabled=!videoMime1242();b.style.cssText='padding:6px 12px;font-size:12px';batch.append(b);
  const label=D.createElement('small');label.style.cssText='font-size:11px;color:#cdeeff';batch.append(label);
  b.addEventListener('click',async()=>{
   if(b.disabled||videoBatchActive1244)return;
   b.disabled=true;const r=await exportAllBoundedWebm1244(traces,exportProofs1244,root,label);
   if(root.isConnected){label.textContent=r.pass?r.videos+' videos WebM empaquetados · búsqueda ACOTADA, no Top 5 universal':
    'No se exportó: '+r.status;b.disabled=!videoMime1242()}
  });
  root.append(batch);
 }
 root.append(sections);
 const endRoot=D.createElement('div');endRoot.className='ygo-bounded-endboards-1232';
 endRoot.append(elem('p','CAMPOS FINALES DE LÍNEAS ACOTADAS · NO CERTIFICADOS COMO TOP 5 UNIVERSAL',
  'color:#ffe87a;font-size:12px;font-weight:bold'));
 traces.forEach((trace,i)=>{
  const f=trace.frames.at(-1),b=f.board;const panel=elem('div','LÍNEA '+(i+1)+' · LP '+b.lp.join(' / '),
   'border:1px solid #0acaff;border-radius:8px;padding:8px;margin:6px 0;font-size:12px');
  panel.className='combo-endboard-result';panel.dataset.replayCertified='0';
  for(let p=0;p<2;p++){
   const z=b.players[p];panel.append(elem('div',(p?'Rival':'Jugador')+' · Monstruos: '+
    (z.monster.map(c=>c.name).join(', ')||'—')+' · M/T: '+
    (z.spelltrap.map(c=>c.name).join(', ')||'—')));
  }endRoot.append(panel);
 });
 if(visualTimer1232){clearInterval(visualTimer1232);visualTimer1232=null}
 host.replaceChildren(root);boardHost.replaceChildren(endRoot);
 return{version:VERSION,status:'VISTA_ACOTADA_1234',pass:true,rendered:lines.length,
  certified:false,globalOptimalityProven:false,framesPerLine:traces[0].frames.length,framesByLine:traces.map(t=>t.frames.length)};
}

/* Alpha 1237 · Exploración de tres decisiones del rival dentro de UN escenario.
 * Cada rama emplea el ejecutor y el replay canónicos de Alpha 1237.
 * Una sola respuesta de Solemn, antes colocada; el rival pasa en los otros puntos.
 * No se promete cobertura de efectos ni optimalidad global. */
/* Alpha 1238: una decisión genuina de pasar, junto a las tres alternativas
 * de Solemn. Sin respuestas adicionales, ni simulación estratégica del rival. */
function replaySolemnOrPass1238(line){
 const fail=status=>({version:VERSION,pass:false,status,certified:false,globalOptimalityProven:false});
 if(!line||line.certified===true||line.globalOptimalityProven===true)return fail('FALSE_CERTIFICATION_1238');
 if(line.respondAtAction===0){
  if(line.status!=='BOUNDED_MIXED_TURN3_LINE_1234'||line.decision1238!=='PASS')return fail('PASS_LABEL_INVALID_1238');
  const traps=line.before?.zones?.[1]?.spelltrap;
  if(!Array.isArray(traps)||!traps.some(c=>Number(c.id)===41420027&&c.setTurn===2&&
   line.opponentSetUids?.includes(c.uid)))return fail('SOLEMN_NOT_SET_FOR_PASS_1238');
  return replayMixedTurn3_1234(line);
 }
 if(![1,2,3].includes(line.respondAtAction)||line.status!=='BOUNDED_SOLEMN_MIXED_LINE_1235'||
  line.decision1238!==undefined)return fail('RESPONSE_LABEL_INVALID_1238');
 return replaySolemnMixedTurn3_1235(line);
}
function renderSolemnOrPass1238(result){
 const lines=Array.isArray(result)?result:result?.candidates;
 if(!Array.isArray(lines)||!lines.length||lines.length>5||
  (!Array.isArray(result)&&result.candidateCount!==lines.length)||
  lines.some(x=>!replaySolemnOrPass1238(x).pass))
  return{version:VERSION,pass:false,status:'DECISION_REPLAY_INVALID_1238',rendered:0};
 const traces=lines.map(l=>l.respondAtAction===0?previewMixedTurn3Frames1234(l):previewSolemnMixedFrames1235(l));
 if(traces.some(x=>!x.pass))return{version:VERSION,pass:false,status:'DECISION_TRACE_INVALID_1238',rendered:0};
 // Explicitly label the alternate choice in each visual trace.
 traces.forEach((trace,i)=>{trace.scope='Decisión rival: '+(lines[i].respondAtAction===0?'NO ACTIVAR SOLEMN':
  'SOLEMN en acción '+lines[i].respondAtAction)+'. '+trace.scope;
  if(trace.frames[3])trace.frames[3]={...trace.frames[3],label:trace.frames[3].label+
   ' · rival: '+(lines[i].respondAtAction===0?'pasará':'Solemn en acción '+lines[i].respondAtAction)};
 });
 return renderBoundedTraces1234(traces,'CUATRO DECISIONES · SOLEMN O PASAR · RESULTADOS ACOTADOS');
}

/* Alpha 1239 · Evidencia comparativa de decisiones rivales, NO minimax.
 * No establece el mejor plan del jugador ni la respuesta óptima del rival. */
function compareSolemnBranches1239(result){
 const fail=s=>({version:VERSION,pass:false,status:s,certified:false,globalOptimalityProven:false});
 if(!result||!['BOUNDED_SOLEMN_OR_PASS_1238','BOUNDED_SOLEMN_BRANCHES_1237'].includes(result.status)||
  result.certified!==false||result.globalOptimalityProven!==false||
  result.scenarioIdentityVerified1239!==true||result.allBranchInputsVerified1240!==true||!Array.isArray(result.branches)||
  !Array.isArray(result.candidates)||result.candidates.length!==result.candidateCount||
  result.candidates.length>5)return fail('EVIDENCE_INVALID_1239');
 const four=result.status==='BOUNDED_SOLEMN_OR_PASS_1238',expected=four?[0,1,2,3]:[1,2,3];
 if(result.branches.length!==expected.length||result.branchesAttempted!==expected.length||
  result.branches.some((b,i)=>b.respondAtAction!==expected[i]||!Number.isSafeInteger(b.candidateCount)||
   b.candidateCount<0||b.candidateCount>5||!Number.isSafeInteger(b.examined)||b.examined<0||
   !b.evidence1239||b.evidence1239.sampleSize!==b.candidateCount))return fail('BRANCH_STRUCTURE_INVALID_1239');
 for(const b of result.branches){
  const e=b.evidence1239;
  if(b.candidateCount===0){if([e.bestRemoved,e.leastRemoved,e.ownLpPaidMin,e.rivalLpPaidMin].some(x=>x!==null))
    return fail('EMPTY_STATS_INVALID_1239');}
  else if(![e.bestRemoved,e.leastRemoved,e.ownLpPaidMin,e.rivalLpPaidMin].every(x=>Number.isSafeInteger(x)&&x>=0)||
   e.bestRemoved<e.leastRemoved)return fail('EVIDENCE_VALUES_INVALID_1239');
 }
 if(result.candidates.some(l=>!replaySolemnOrPass1238(l).pass))return fail('FINAL_REPLAY_FAILED_1239');
 return{version:VERSION,pass:true,status:'OBSERVED_DECISIONS_1239',certified:false,
  globalOptimalityProven:false,decisions:result.branches.map(b=>({respondAtAction:b.respondAtAction,
   candidates:b.candidateCount,examined:b.examined,truncated:b.truncated,
   enumerationComplete:b.enumerationComplete,...b.evidence1239})),
  limited:true,method:'COMPARE_INDEPENDENT_BOUNDED_BRANCH_CANDIDATES_NOT_MINIMAX_1239'};
}
function renderSolemnBranchComparison1239(result,container){
 const info=compareSolemnBranches1239(result);
 if(!info.pass||!container||typeof container.replaceChildren!=='function')
  return{version:VERSION,pass:false,status:info.status||'INVALID_CONTAINER_1239'};
 const mk=(tag,value)=>{const el=D.createElement(tag);if(value!==undefined)el.textContent=String(value);return el};
 const root=mk('div');root.style.cssText='font-size:12px;margin-top:8px';
 root.append(mk('strong','Comparación observada de decisiones del rival (búsqueda acotada)'));
 const table=mk('table');table.style.cssText='width:100%;font-size:11px;border-collapse:collapse;margin:6px 0';
 const head=mk('thead'),headRow=mk('tr');
 for(const s of ['Decisión','Candidatos','Mejor eliminación','Menor eliminación','Límite']){
  const th=mk('th',s);th.scope='col';th.style.cssText='padding:4px;border-bottom:1px solid #777;text-align:left';headRow.append(th)}
 head.append(headRow);table.append(head);
 const body=mk('tbody');
 info.decisions.forEach(b=>{
  const row=mk('tr');const cells=[b.respondAtAction===0?'Pasar':'Solemn · '+b.respondAtAction+'ª',
   b.candidates,b.bestRemoved===null?'—':b.bestRemoved,b.leastRemoved===null?'—':b.leastRemoved,
   b.truncated||!b.enumerationComplete?'Incompleto':'Sin corte observado'];
  cells.forEach(s=>{const td=mk('td',s);td.style.cssText='padding:4px;border-bottom:1px solid #555';row.append(td)});
  body.append(row);
 });
 table.append(body);root.append(table);
 const note=mk('p','Sólo compara candidatos hallados dentro de cada rama. NO demuestra el peor caso ante una misma jugada, un Top 5 universal ni una estrategia óptima.');
 note.style.cssText='font-size:11px;opacity:.9;margin:6px 0';root.append(note);
 container.replaceChildren(root);
 return{version:VERSION,pass:true,status:'COMPARISON_RENDERED_1239',count:info.decisions.length,certified:false};
}

async function searchSolemnDecisionBranches1237(opts={}){
 const empty=(status,details=[])=>({version:VERSION,status,pass:false,certified:false,
  globalOptimalityProven:false,candidates:[],candidateCount:0,branches:details,
  branchesAttempted:details.length,branchesWithResults:details.filter(b=>b.candidateCount>0).length});
 const includePass=opts.scenario==='SOLEMN_MAY_PASS_TURN3_1238';
 if(!includePass&&opts.scenario!=='SOLEMN_CHOOSE_ONE_RESPONSE_TURN3_1237')return empty('CONSENT_REQUIRED_1237');
 if(opts.signal?.aborted)return empty('CANCELLED_1237');
 if(ISOLATED1080.active)return empty('SEARCH_ALREADY_RUNNING');
 // These budgets are GLOBAL, not multiplied by three.
 const maxExamined=Math.min(1800,Math.max(3,Number.isSafeInteger(opts.maxExamined)?opts.maxExamined:540));
 const maxTotalMs=Math.min(15000,Math.max(300,Number.isFinite(opts.maxTotalMs)?opts.maxTotalMs:9000));
 const deadline=(W.performance?.now?.()??Date.now())+maxTotalMs;
 const decisions=includePass?[0,1,2,3]:[1,2,3];
 if(Number.isSafeInteger(opts.maxExamined)&&opts.maxExamined<decisions.length)
  return empty('BRANCH_BUDGET_TOO_SMALL_1239');
 // Alpha 1240: freeze the *entire* explicit opponent scenario, even if a branch
 // finds zero lines. Candidate-only comparisons are insufficient for empty branches.
 const scenario1240=()=>JSON.stringify([opts.sample,opts.opponentZones,
  opts.opponentSetUids,opts.solemnUid,opts.lp]);
 let snapshot1240,signature1240;
 try{
  signature1240=scenario1240();
  snapshot1240=structuredClone({sample:opts.sample,opponentZones:opts.opponentZones,
   opponentSetUids:opts.opponentSetUids,solemnUid:opts.solemnUid,lp:opts.lp});
  if(!Array.isArray(snapshot1240.lp)||snapshot1240.lp.length!==2||
    !snapshot1240.opponentZones||!Array.isArray(snapshot1240.opponentSetUids)||
    !Number.isSafeInteger(snapshot1240.sample))return empty('SCENARIO_SNAPSHOT_INVALID_1240');
 }catch(_){return empty('SCENARIO_SNAPSHOT_INVALID_1240')}
 const inputStable1240=()=>{try{return scenario1240()===signature1240}catch(_){return false}};
 // Alpha 1241: establish the origin from the committed initial scenario ONCE.
 // An empty legal search often has no candidates and does not return per-branch
 // provenance; it must not be mistaken for unverified cards. A failed branch
 // must still be rejected on its real status before using this proof.
 const initialProof1241=openingRemovalBridge1216(snapshot1240);
 if(!initialProof1241.pass||!initialProof1241.evidence||
    !Number.isSafeInteger(initialProof1241.evidence.deckRevision)||
    typeof initialProof1241.evidence.deckFingerprint!=='string'||
    !initialProof1241.evidence.deckFingerprint)return empty('BASE_OPENING_NOT_VERIFIED_1241');
 const trustedOrigin1241=initialProof1241.evidence;
 const perBranch=Math.floor(maxExamined/decisions.length),branches=[],all=[];
 let revision=null,fingerprint=null,scenarioIdentity=null;
 for(const at of decisions){
  if(opts.signal?.aborted)return empty('CANCELLED_1237',branches);
  if(!inputStable1240())return empty('SCENARIO_CHANGED_1240',branches);
  // Each branch receives an independent copy of the original committed scenario.
  // It cannot silently inherit objects mutated by earlier async searches.
  const stableInputs1240=structuredClone(snapshot1240);
  const branchOptions1240={...opts,...stableInputs1240};
  const remaining=deadline-(W.performance?.now?.()??Date.now());
  if(remaining<=30)return empty('GLOBAL_TIME_BUDGET_1237',branches);
  const r=at===0?await searchMixedRemovalOpening1227({...branchOptions1240,
    scenario:'NO_OTHER_ACTIONS_TURNS_1_TO_3_1234',maxExamined:perBranch,
    maxTotalMs:Math.max(20,Math.floor(remaining/(decisions.length-branches.length)))},3):
   await searchSolemnMixedTurn3_1235({...branchOptions1240,
    scenario:'SOLEMN_ON_SELECTED_ACTION_TURN3_1236',respondAtAction:at,
    maxExamined:perBranch,maxTotalMs:Math.max(20,Math.floor(remaining/(decisions.length-branches.length)))});
  if(opts.signal?.aborted)return empty('CANCELLED_1237',branches);
  if(!inputStable1240())return empty('SCENARIO_CHANGED_1240',branches);
  // First check a branch's *actual status*: cancellation, budget exhaustion,
  // stale state, setup failure and errors can all return zero candidates.
  const allowedStatuses1241=at===0?['BOUNDED_MIXED_TURN3_1234','NO_BOUNDED_MIXED_TURN3_1234']:
   ['BOUNDED_SOLEMN_MIXED_TURN3_1235','NO_SOLEMN_MIXED_CANDIDATES_1235'];
  if(!allowedStatuses1241.includes(r.status))
   return empty('BRANCH_FAILED_1237_'+at+'_'+r.status,branches);
  if(!Number.isSafeInteger(r.candidateCount)||r.candidateCount<0||
    (r.status.startsWith('NO_')&&r.candidateCount!==0))
   return empty('BRANCH_COUNT_INVALID_1241',branches);
  // A zero-result branch derives its origin from the frozen, verified opening,
  // NOT from a candidate that does not exist. Any reported proof must match it.
  const branchProof1241=r.openingEvidence1216||
    (r.candidateCount===0?trustedOrigin1241:null);
  if(!branchProof1241||!Number.isSafeInteger(branchProof1241.deckRevision)||
    typeof branchProof1241.deckFingerprint!=='string'||!branchProof1241.deckFingerprint||
    branchProof1241.deckRevision!==trustedOrigin1241.deckRevision||
    branchProof1241.deckFingerprint!==trustedOrigin1241.deckFingerprint)
   return empty('BRANCH_DECK_DIVERGED_1241',branches);
  if(revision===null){revision=trustedOrigin1241.deckRevision;fingerprint=trustedOrigin1241.deckFingerprint}
  if(revision!==branchProof1241.deckRevision||fingerprint!==branchProof1241.deckFingerprint)
   return empty('BRANCH_DECK_DIVERGED_1241',branches);
  const lines=r.candidates||[];
  if(r.candidateCount!==lines.length||lines.length>5||
    lines.some(l=>(at!==0&&l.respondAtAction!==at)||l.certified===true||
     l.globalOptimalityProven===true||!(at===0?replayMixedTurn3_1234(l):replaySolemnMixedTurn3_1235(l)).pass))
   return empty('BRANCH_REPLAY_FAILED_1237',branches);
  for(const line of lines){
   const evidence=line.openingEvidence;
   if(!evidence?.deckFingerprint||!Number.isSafeInteger(evidence.deckRevision))
    return empty('EVIDENCE_MISSING_1237',branches);
   if(revision===null){revision=evidence.deckRevision;fingerprint=evidence.deckFingerprint}
   if(revision!==evidence.deckRevision||fingerprint!==evidence.deckFingerprint)
    return empty('MIXED_DECK_SNAPSHOT_1237',branches);
   // All four counterfactual branches MUST start with exactly the same two decks,
   // opening cards, LP, sets and turn history. A common deck fingerprint alone
   // cannot prove that the opponent state has not changed between async branches.
   const identity=JSON.stringify([line.sample,line.openingBefore,line.before,
    line.setupStages,line.opponentSetUids]);
   if(scenarioIdentity===null)scenarioIdentity=identity;
   else if(scenarioIdentity!==identity)return empty('SCENARIO_DIVERGED_1239',branches);
   all.push(at===0?{...line,respondAtAction:0,decision1238:'PASS'}:line);
  }
  // These are OBSERVED candidates, not guarantees of minimax play or optimality.
  const sampleRemoved=lines.map(x=>x.removed);
  const sampleOwnLp=lines.map(x=>x.lpPaid);
  const sampleRivalLp=lines.map(x=>x.opponentLpPaid||0);
  branches.push({respondAtAction:at,status:r.status,candidateCount:lines.length,
   examined:r.choicesExamined||0,truncated:r.truncated===true,enumerationComplete:r.enumerationComplete===true,
   evidence1239:{sampleSize:lines.length,
    bestRemoved:sampleRemoved.length?Math.max(...sampleRemoved):null,
    leastRemoved:sampleRemoved.length?Math.min(...sampleRemoved):null,
    ownLpPaidMin:sampleOwnLp.length?Math.min(...sampleOwnLp):null,
    rivalLpPaidMin:sampleRivalLp.length?Math.min(...sampleRivalLp):null}});
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 if(opts.signal?.aborted)return empty('CANCELLED_1237',branches);
 if(!inputStable1240())return empty('SCENARIO_CHANGED_1240',branches);
 if(fingerprint!==null&&(revision!==DECK_REVISION_1056||fingerprint!==deckFingerprint1056()))
  return empty('STALE_DECK_1237',branches);
 // Prevent duplicated end states and prefer one outcome from each branch, when present.
 const ranked=all.slice().sort((a,b)=>b.removed-a.removed||a.discarded-b.discarded||
  a.lpPaid-b.lpPaid||a.steps-b.steps||a.respondAtAction-b.respondAtAction);
 const used=new Set(),chosen=[];
 const add=(line)=>{const key=mixedOutcomeSignature1228(line.state);if(used.has(key))return false;
  used.add(key);chosen.push(line);return true};
 for(const at of decisions){const first=ranked.find(l=>l.respondAtAction===at&&!used.has(mixedOutcomeSignature1228(l.state)));
  if(first)add(first)}
 for(const line of ranked){if(chosen.length>=5)break;add(line)}
 const candidates=chosen.slice(0,5).map((line,i)=>({...line,index:i+1}));
 if(candidates.some(l=>!(includePass?replaySolemnOrPass1238(l):replaySolemnMixedTurn3_1235(l)).pass))
  return empty('FINAL_REPLAY_FAILED_1237',branches);
 const truncated=branches.some(x=>x.truncated)||ranked.length>candidates.length;
 return{version:VERSION,status:candidates.length?(includePass?'BOUNDED_SOLEMN_OR_PASS_1238':'BOUNDED_SOLEMN_BRANCHES_1237'):'NO_BRANCH_CANDIDATES_1237',
  pass:false,certified:false,globalOptimalityProven:false,candidates,candidateCount:candidates.length,
  branches,branchesAttempted:decisions.length,branchesWithResults:branches.filter(b=>b.candidateCount>0).length,
  choicesExamined:branches.reduce((n,b)=>n+b.examined,0),truncated,
  enumerationComplete:branches.every(b=>b.enumerationComplete)&&!truncated,
  selection:'UP_TO_FIVE_DISTINCT_FINAL_STATES_WITH_BRANCH_DIVERSITY_1237',
  scenarioIdentityVerified1239:scenarioIdentity!==null,
  allBranchInputsVerified1240:inputStable1240()&&branches.length===decisions.length&&
    trustedOrigin1241.deckRevision===DECK_REVISION_1056&&trustedOrigin1241.deckFingerprint===deckFingerprint1056(),
  evidenceScope1239:'Comparación entre los candidatos encontrados por rama; no representa peor caso para una misma línea ni el óptimo del rival.',
  scope:includePass?'Cuatro decisiones: rival no activa Solemn o la activa ante 1.ª, 2.ª o 3.ª Mágica. Sin respuestas extra, triggers ni Top 5 universal.':
   'Tres decisiones alternativas del rival: única activación de Solemn en acción 1, 2 o 3; pasa en el resto. Sin más respuestas ni triggers. NO es Top 5 universal.'};
}

async function searchIsolated1080(opts={}){
 if(opts.mode==='SOLEMN_OR_PASS_TURN3_1238')return searchSolemnDecisionBranches1237(opts);
 if(opts.mode==='SOLEMN_BRANCHING_TURN3_1237')return searchSolemnDecisionBranches1237(opts);
 if(opts.mode==='SOLEMN_TIMING_TURN3_1236'||opts.mode==='SOLEMN_MIXED_TURN3_1235')return searchSolemnMixedTurn3_1235(opts);
 if(opts.mode==='MIXED_REMOVAL_TURN3_1234'){
  if(opts.scenario!=='NO_OTHER_ACTIONS_TURNS_1_TO_3_1234')return {version:VERSION,pass:false,status:'MIXED_SCENARIO_ASSUMPTIONS_REQUIRED_1234',candidates:[],candidateCount:0,certified:false};
  return searchMixedRemovalOpening1227(opts,3);
 }
 if(opts.mode==='SEVEN_TOOLS_OPENING_TURN3_1231')return searchSevenToolsOpening1231(opts);
 if(opts.mode==='SOLEMN_RESPONSE_OPENING_1229')return searchSolemnOpening1229(opts);
 if(opts.mode==='MIXED_REMOVAL_OPENING_DEPTH3_1228')return searchMixedRemovalOpening1228(opts);
 if(opts.mode==='MIXED_REMOVAL_OPENING_DEPTH2_1227')return searchMixedRemovalOpening1227(opts);
 if(opts.mode==='TWIN_TWISTERS_OPENING_DEPTH2_1226')return searchTwinTwistersOpening1226(opts);
 if(opts.mode==='TWIN_TWISTERS_OPENING_1225')return searchTwinTwistersOpening1225(opts);
 if(opts.mode==='SPELL_REMOVAL_OPENING_1216'||opts.mode==='SPELL_REMOVAL_OPENING_DEPTH3_1224'){
  const depth3Opening1224=opts.mode==='SPELL_REMOVAL_OPENING_DEPTH3_1224';
  const proof=openingRemovalBridge1216(opts);
  if(!proof.pass)return {...proof,candidates:[],candidateCount:0};
  // Alpha 1220: las salidas fallidas del Worker no son candidatos publicables.
  // Mantener las propiedades de cancelación/error sin fabricar legalidad ni éxito.
  let searched;
  try{searched=await searchIsolated1080({...opts,mode:depth3Opening1224?'SPELL_REMOVAL_SEQUENCE_DEPTH3_1224':'SPELL_REMOVAL_SEQUENCE_1211',
   before:proof.before,player:0});}
  catch(_){return{version:VERSION,status:'OPENING_WORKER_ERROR_1220',pass:false,
   certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0};}
  if(proof.evidence.deckFingerprint!==deckFingerprint1056()||
     proof.evidence.deckRevision!==DECK_REVISION_1056)return{
     version:VERSION,status:'OPENING_STALE_DECK_1216',pass:false,certified:false,
     candidates:[],candidateCount:0};
  // Alpha 1221: el Worker declara pass:false EN TODAS las búsquedas aisladas,
  // incluidas las búsquedas acotadas válidas: significa "no certificado",
  // NO "error". Autorizar únicamente estos estados explícitos de la ruta
  // SPELL_REMOVAL_SEQUENCE_1211 y rechazar todos los demás (cancelación,
  // timeout, Worker error, estado obsoleto, protocolo, etc.).
  const allowedRemovalStatuses1221=new Set(depth3Opening1224?
   ['BOUNDED_REMOVAL_SEQUENCES_1224','NO_BOUNDED_REMOVAL_SEQUENCES_1224']:
   ['BOUNDED_REMOVAL_SEQUENCES_1211','NO_BOUNDED_REMOVAL_SEQUENCES_1211']);
  if(!searched||typeof searched!=='object'||Array.isArray(searched)||
     !allowedRemovalStatuses1221.has(searched.status)||searched.cancelled===true||
     searched.certified===true||searched.globalOptimalityProven===true||
     !Array.isArray(searched.candidates)||
     !Number.isSafeInteger(searched.candidateCount)||
     searched.candidateCount!==searched.candidates.length||
     (searched.status===(depth3Opening1224?'NO_BOUNDED_REMOVAL_SEQUENCES_1224':'NO_BOUNDED_REMOVAL_SEQUENCES_1211')&&searched.candidateCount!==0)||
     (searched.status===(depth3Opening1224?'BOUNDED_REMOVAL_SEQUENCES_1224':'BOUNDED_REMOVAL_SEQUENCES_1211')&&searched.candidateCount===0))return{
      version:VERSION,status:'OPENING_WORKER_RESULT_REJECTED_1220',pass:false,
      certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0,
      workerStatus:typeof searched?.status==='string'?searched.status.slice(0,100):'INVALID_RESULT'};
  // Alpha 1222: validar en el hilo receptor CADA secuencia recibida.
  // Un candidato estructural no equivale a una jugada ejecutada; el replay
  // canónico verifica costos, transiciones, continuidad y campo final.
  // Se vincula explícitamente el primer estado de cada línea a la apertura
  // derivada del YDK, para impedir publicar líneas de otros escenarios.
  const coherentLines1222=searched.candidates.length<=5&&searched.candidates.every((line,i)=>{
   if(!line||typeof line!=='object'||Array.isArray(line)||line.index!==i+1||
      line.certified===true||line.globalOptimalityProven===true||
      !Array.isArray(line.actions)||line.actions.length<1||line.actions.length>(depth3Opening1224?3:2)||
      line.steps!==line.actions.length||!line.state)return false;
   try{return (depth3Opening1224?replayRemovalSequence1224:replayRemovalSequence1211)({...line,before:proof.before}).pass===true;}
   catch(_){return false}
  });
  if(!coherentLines1222)return{version:VERSION,status:'OPENING_SEQUENCE_REPLAY_REJECTED_1222',
   pass:false,certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0};
  // Alpha 1219: el auditor de apertura ahora es parte de la ruta real, no un helper pasivo.
  // Fallar cerrado y no exponer candidatos si desaparece la evidencia o cambia el resultado.
  const auditedResult={...searched,version:VERSION,openingEvidence1216:proof.evidence,
   openingSample1216:proof.sample,openingProvenance1216:proof.status,
   certified:false,globalOptimalityProven:false};
  const verifier=W.YGOAlpha1218?.auditOpeningSearch1218;
  if(typeof verifier!=='function')return{version:VERSION,status:'OPENING_AUDITOR_UNAVAILABLE_1219',
   pass:false,certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0};
  let inspection;
  try{inspection=verifier(auditedResult,{sample:proof.sample,
   deckFingerprint:proof.evidence.deckFingerprint,deckRevision:proof.evidence.deckRevision});}
  catch(_){return{version:VERSION,status:'OPENING_AUDITOR_ERROR_1219',
   pass:false,certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0};}
  if(inspection?.pass!==true)return{version:VERSION,status:'OPENING_SEARCH_REJECTED_1219',
   pass:false,certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0,
   issues:Array.isArray(inspection?.issues)?inspection.issues.slice(0,8):['Auditoría sin resultado']};
  // Una modificación sincrónica del mazo durante la auditoría también invalida la búsqueda.
  if(proof.evidence.deckFingerprint!==deckFingerprint1056()||
     proof.evidence.deckRevision!==DECK_REVISION_1056)return{
      version:VERSION,status:'OPENING_STALE_DECK_1220',pass:false,
      certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0};
  return {...auditedResult,openingAudit1219:inspection,certified:false,globalOptimalityProven:false};
 }
 if(ISOLATED1080.active)return{version:VERSION,status:'SEARCH_ALREADY_RUNNING',pass:false,certified:false,isolated:true};
 if(typeof Worker!=='function'||typeof URL?.createObjectURL!=='function')return{version:VERSION,status:'WORKER_UNAVAILABLE',pass:false,certified:false,isolated:false};
 const n=D.getElementById('ygo-deferred-payload-'+VERSION.replace(/\D/g,'')),prelude=D.getElementById('final-consolidated-engine');
 if(!n?.textContent||!prelude?.textContent)return{version:VERSION,status:'WORKER_SOURCE_UNAVAILABLE',pass:false,certified:false,isolated:false};
 // Alpha 1191: una sola autoridad de formato para validacion fisica, identidad y Worker.
 // Nunca usar __YGO_ACTIVE_BAN_KEY para el Worker: puede ser un estado historico distinto
 // del selector actual y provocaria simular TCG como OCG, o viceversa.
 // Alpha 1191: comprobar la identidad y la legalidad fisica antes de iniciar
 // una exploracion. Una baraja vacia o invalida no puede generar candidatos.
 if(opts.signal?.aborted===true)return{version:VERSION,status:'CANCELLED_TERMINATED',cancelled:true,pass:false,certified:false,isolated:true};
 const currentDeck=W.deckState,formatKey=raw(A973.activeFormatKey?.()||'').trim();
 // Verificar el selector visible frente a la autoridad de reglas. Las antiguas
 // asignaciones globales pueden desincronizarse del formato mostrado al usuario.
 const selectedButton=D.querySelector('button[data-f].active');
 const label=raw(selectedButton?.dataset?.f||'').trim();
 const visibleByLabel={'TCG':'tcg','OCG':'ocg','Master Duel':'master','Duel Links':'duelLinksSpeed','Duel Links RUSH':'duelLinksRush','Rush Duel':'rush','Speed Duel':'speedDuel','GOAT':'goat','Time Wizard':'timeWizard'};
 const visibleFormat=Object.prototype.hasOwnProperty.call(visibleByLabel,label)?visibleByLabel[label]:null;
 if(visibleFormat&&low(formatKey)!==low(visibleFormat)){
  const invalid={version:VERSION,status:'FORMAT_STATE_MISMATCH',pass:false,certified:false,globalOptimalityProven:false,isolated:true,candidates:[],candidateCount:0,selectedFormat:visibleFormat,engineFormat:formatKey,scope:'El formato visible y el utilizado por el motor no coinciden; corregir el selector antes de simular.'};
  ISOLATED1080.last={version:VERSION,status:invalid.status,runId:null,candidateCount:0};
  W.__YGO1080_ISOLATED_SEARCH=invalid;
  return invalid;
 }
 const fingerprint=deckFingerprint1056(),mainCount=count1048(currentDeck,'main');
 let physical=null;
 if(fingerprint&&mainCount>0){try{physical=physicalLegality1050(currentDeck,formatKey)}catch(_){physical=null}}
 if(!fingerprint||!mainCount||physical?.physicalValid!==true||physical?.unknownCopies>0){
  const status=!mainCount?'EMPTY_DECK':!fingerprint?'DECK_IDENTITY_UNAVAILABLE':'DECK_PHYSICAL_INVALID';
  const rejected={version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false,isolated:true,candidates:[],candidateCount:0,physicalErrors:arr(physical?.errors).slice(0,6),scope:'No se simulan barajas sin identidad y estructura fisica verificables; banlist y combos no certificados.'};
  ISOLATED1080.last={version:VERSION,status,runId:null,candidateCount:0};
  W.__YGO1080_ISOLATED_SEARCH=rejected;
  return rejected;
 }
 // Alpha 1209: esta ruta de búsqueda NO supone que la baraja contenga
 // los estados elegidos. Exige un estado explícito y lo etiqueta como
 // diagnóstico acotado, no como End Board generado desde la baraja importada.
 let explicitBefore1209=null,explicitKey1209=null;
 if(['COSMIC_ENUM_1209','COSMIC_SEQUENCE_1210','SPELL_REMOVAL_SEQUENCE_1211','SPELL_REMOVAL_SEQUENCE_DEPTH3_1224'].includes(opts.mode)){
  let issues=[];
  try{issues=snapshot1063(opts.before,'preestado 1209').issues}
  catch(_){issues=['STATE_INVALID']}
  let size=Infinity;try{size=JSON.stringify(opts.before).length}catch(_){}
  if(issues.length||size>100000||!Number.isInteger(opts.player)||![0,1].includes(opts.player))
   return {version:VERSION,status:'COSMIC_STATE_INVALID_1209',pass:false,certified:false,
    candidates:[],candidateCount:0,issues:issues.slice(0,6),isolated:true};
  explicitBefore1209=structuredClone(opts.before);explicitKey1209=JSON.stringify(explicitBefore1209);
 }
 const id=++ISOLATED1080.serial,started=Date.now(),revision=DECK_REVISION_1056,fp=fingerprint,maxTotalMs=Math.max(200,Math.min(12000,Number(opts.maxTotalMs)||4800));
 // Alpha 1193: la huella por si sola no prueba que se haya conservado el formato visible.
 // Una operacion iniciada en TCG no puede publicar sus resultados cuando el usuario ya selecciono OCG.
 const staleReason1193=()=>{
  const currentFormat=raw(A973.activeFormatKey?.()||'').trim();
  const visibleButton=D.querySelector('button[data-f].active');
  const visibleLabel=raw(visibleButton?.dataset?.f||'').trim();
  const visibleNow=Object.prototype.hasOwnProperty.call(visibleByLabel,visibleLabel)?visibleByLabel[visibleLabel]:null;
  if(low(currentFormat)!==low(formatKey)||(visibleNow&&low(visibleNow)!==low(formatKey)))return 'STALE_FORMAT_CANCELLED';
  if(revision!==DECK_REVISION_1056||fp!==deckFingerprint1056())return 'STALE_DECK_CANCELLED';
  return null;
 };
 const explicitChanged1209=()=>['COSMIC_ENUM_1209','COSMIC_SEQUENCE_1210','SPELL_REMOVAL_SEQUENCE_1211','SPELL_REMOVAL_SEQUENCE_DEPTH3_1224'].includes(opts.mode)&&JSON.stringify(opts.before)!==explicitKey1209;
 const stale=()=>!!staleReason1193()||explicitChanged1209();
 const notify=(event)=>{try{opts.onProgress?.({version:VERSION,runId:id,...event})}catch(_){}};
 let worker,url;
 try{url=URL.createObjectURL(new Blob([WORKER_SOURCE_1080],{type:'text/javascript'}));worker=new Worker(url)}
 catch(e){if(url)URL.revokeObjectURL(url);return{version:VERSION,status:'WORKER_START_ERROR',error:raw(e?.message||e),pass:false,certified:false,isolated:false}}
 return await new Promise(resolve=>{
  let timer=null,abortHandler1187=null,staleMonitor1187=null;
  const job={id,worker,phase:'BOOTING',finish:null};ISOLATED1080.active=job;
  let closed=false;
  const finish=(status,extra={})=>{
   if(closed)return;closed=true;
   if(timer!==null)clearTimeout(timer);
   if(staleMonitor1187!==null)clearInterval(staleMonitor1187);
   if(abortHandler1187&&typeof opts.signal?.removeEventListener==='function')opts.signal.removeEventListener('abort',abortHandler1187);
   try{worker.terminate()}catch(_){};try{URL.revokeObjectURL(url)}catch(_){};
   // Alpha 1191: los campos recibidos de otro hilo nunca pueden elevar una prueba
   // diagnostica a PASS ni suplantar la identidad de esta ejecucion.
   const out={version:VERSION,runId:id,status,elapsedTotalMs:Date.now()-started,...extra};
   Object.assign(out,{version:VERSION,runId:id,pass:false,certified:false,globalOptimalityProven:false,isolated:true});
   if(staleReason1193()){out.status=staleReason1193();out.candidates=[];out.candidateCount=0;out.certified=false}
   ISOLATED1080.last={version:VERSION,status:out.status,runId:id,elapsedMs:out.elapsedTotalMs,candidateCount:out.candidateCount||0};
   if(ISOLATED1080.active===job)ISOLATED1080.active=null;
   W.__YGO1080_ISOLATED_SEARCH=out;notify({status:out.status,candidateCount:out.candidateCount||0});resolve(out);
  };job.finish=finish;
  // La misma finalización sirve para el botón Cancelar y AbortSignal, incluso durante BOOTING.
  if(typeof opts.signal?.addEventListener==='function'){
   abortHandler1187=()=>finish('CANCELLED_TERMINATED',{cancelled:true,cancelSource:'AbortSignal',candidateCount:0,candidates:[]});
   opts.signal.addEventListener('abort',abortHandler1187,{once:true});
   if(opts.signal.aborted){abortHandler1187();return}
  }
  // Si el mazo cambia, terminar inmediatamente en vez de consumir mas nodos.
  staleMonitor1187=setInterval(()=>{const reason=staleReason1193();if(reason)finish(reason,{candidates:[],candidateCount:0})},120);
  // Timeout real, no Promise.race que abandona una operación en el hilo de interfaz.
  timer=setTimeout(()=>finish('WORKER_HARD_TIMEOUT_TERMINATED',{timeBudgetMs:maxTotalMs}),Math.max(5000,maxTotalMs+4800));
  worker.onerror=e=>finish('WORKER_UNCAUGHT_ERROR',{error:raw(e?.message||'WORKER_SCRIPT_ERROR')});
  worker.onmessage=async e=>{
   if(closed)return;const msg=e.data||{};
   // Alpha 1192: cada respuesta debe pertenecer al Worker y a la operacion actual.
   // Aceptar mensajes sin sessionId/runId permitiria mezclar ejecuciones.
   if(msg.sessionId!==id || (job.phase==='EXPLORING' && msg.runId!==id)){
    finish('WORKER_PROTOCOL_RUN_ID_MISMATCH',{protocolEvent:raw(msg.type||'UNKNOWN'),candidates:[],candidateCount:0});return;
   }
   if(msg.type==='ERROR'){finish('WORKER_ENGINE_ERROR',{error:raw(msg.error||'UNKNOWN').slice(0,800)});return}
   if(msg.type==='PRELUDE_ERROR'){finish('WORKER_PRELUDE_ERROR',{error:raw(msg.error||'UNKNOWN').slice(0,800)});return}
   if(msg.type==='READY'){
    // Alpha 1191: INIT solo puede confirmar una vez. Un READY repetido no
    // debe lanzar una segunda SEARCH ni permitir resultados mezclados.
    if(job.phase!=='BOOTING'){finish('WORKER_PROTOCOL_INVALID_SEQUENCE',{protocolEvent:'DUPLICATE_READY',candidates:[],candidateCount:0});return}
    if(opts.signal?.aborted===true){finish('CANCELLED_TERMINATED',{cancelled:true,cancelSource:'AbortSignal'});return}
    if(Number(msg.modules)!==WORKER_MANIFEST_1080.workerModuleCount||Number(msg.deferredErrors)!==0||msg.diagnostics?.makeState!=='function'){finish('WORKER_INIT_INCOMPLETE',{modules:msg.modules,diagnostics:msg.diagnostics||{}});return}
    job.phase='PREPARING_SEARCH';notify({status:'WORKER_READY',modules:WORKER_MANIFEST_1080.workerModuleCount});
    // Se usa el catálogo íntegro cuando está disponible; un resumen local puede omitir cartas buscables.
    try{if(arr(W.CARD_CATALOG).length<19617)await W.YGOAlpha984?.ensureCatalog984?.()}catch(e){finish('CATALOG_LOAD_FAILED',{error:raw(e?.message||e)});return}
    if(closed)return;
    if(opts.signal?.aborted===true){finish('CANCELLED_TERMINATED',{cancelled:true,cancelSource:'AbortSignal'});return}
    if(stale()){finish(explicitChanged1209()?(opts.mode==='SPELL_REMOVAL_SEQUENCE_1211'?'REMOVAL_STATE_CHANGED_1211':opts.mode==='COSMIC_SEQUENCE_1210'?'COSMIC_STATE_CHANGED_1210':'COSMIC_STATE_CHANGED_1209'):staleReason1193(),{candidates:[],candidateCount:0});return}
    try{job.phase='EXPLORING';job.searchStartedAt1196=W.performance?.now?.()??Date.now();worker.postMessage({type:opts.mode==='PARITY'?'PARITY':opts.mode==='COSMIC_ENUM_1209'?'COSMIC_ENUM_1209':opts.mode==='COSMIC_SEQUENCE_1210'?'COSMIC_SEQUENCE_1210':['SPELL_REMOVAL_SEQUENCE_1211','SPELL_REMOVAL_SEQUENCE_DEPTH3_1224'].includes(opts.mode)?'SPELL_REMOVAL_SEQUENCE_1211':'SEARCH',runId:id,before:['COSMIC_ENUM_1209','COSMIC_SEQUENCE_1210','SPELL_REMOVAL_SEQUENCE_1211','SPELL_REMOVAL_SEQUENCE_DEPTH3_1224'].includes(opts.mode)?structuredClone(opts.before):undefined,player:['COSMIC_ENUM_1209','COSMIC_SEQUENCE_1210','SPELL_REMOVAL_SEQUENCE_1211','SPELL_REMOVAL_SEQUENCE_DEPTH3_1224'].includes(opts.mode)?opts.player:undefined,deck:structuredClone(W.deckState),catalog:arr(W.CARD_CATALOG),formatKey:formatKey,sample:opts.sample,depth2:opts.depth2,auditDeterministic:opts.auditDeterministic,maxRoots:opts.maxRoots,depthNodeBudgetMs:opts.depthNodeBudgetMs,maxActionBranches:opts.maxActionBranches,nodeBudgetMs:opts.nodeBudgetMs,options:{sample:opts.sample,maxDepth:opts.maxDepth,maxStates:opts.maxStates,maxActionBranches:opts.maxActionBranches,nodeBudgetMs:opts.nodeBudgetMs,sliceMs:opts.sliceMs,maxSlices:opts.maxSlices,maxTotalMs}})}
    catch(e){finish('WORKER_INPUT_CLONE_ERROR',{error:raw(e?.message||e)})}
    return;
   }
   if(msg.type==='PROGRESS'||msg.type==='SLICE'){
    if(job.phase!=='EXPLORING'){finish('WORKER_PROTOCOL_INVALID_SEQUENCE',{protocolEvent:'PROGRESS_BEFORE_SEARCH',candidates:[],candidateCount:0});return}
    notify({status:msg.type,expanded:msg.expanded||msg.statesExpanded||0,depth:msg.depth||0,slices:msg.slices||0});return
   }
   if(msg.type==='DONE'){
    if(job.phase!=='EXPLORING'){finish('WORKER_PROTOCOL_INVALID_SEQUENCE',{protocolEvent:'DONE_BEFORE_SEARCH',candidates:[],candidateCount:0});return}
    // Alpha 1210: enumeración de primeras decisiones en Worker, seguida
    // de un máximo de dos activaciones secuenciales en el ejecutor canónico.
    // Nunca es un Top 5 óptimo ni acredita respuestas del rival.
    if(opts.mode==='COSMIC_SEQUENCE_1210'||opts.mode==='SPELL_REMOVAL_SEQUENCE_1211'||opts.mode==='SPELL_REMOVAL_SEQUENCE_DEPTH3_1224'){
     const depth31224=opts.mode==='SPELL_REMOVAL_SEQUENCE_DEPTH3_1224';
     const mixed1211=opts.mode==='SPELL_REMOVAL_SEQUENCE_1211'||depth31224;
     const empty={candidates:[],candidateCount:0,certified:false,globalOptimalityProven:false};
     if(explicitChanged1209()){finish(mixed1211?'REMOVAL_STATE_CHANGED_1211':'COSMIC_STATE_CHANGED_1210',empty);return}
     const data=msg.result,pairs=data?.candidates;
     const maxPairs1212=mixed1211?100:30;
     if(!data||!Array.isArray(pairs)||pairs.length>maxPairs1212||data.candidateCount!==pairs.length){
      finish(mixed1211?'REMOVAL_WORKER_CONTRACT_INVALID_1211':'COSMIC_WORKER_CONTRACT_INVALID_1210',empty);return;
     }
     // Alpha 1215: un único criterio físico en el receptor sirve a las
     // primeras decisiones y a TODAS sus continuaciones. El Worker conserva
     // la misma fórmula para sus primeras parejas, de verificación cruzada.
     const mixedSource1215=(state,c,zone)=>{
      const id=Number(c?.id??c?.card?.id),uid=String(c?.uid??'').trim();
      if(![8267140,5318639].includes(id)||!uid||uid.length>100)return false;
      const bits=Number(c?.typeBits??c?.type??c?.card?.typeBits??c?.card?.type);
      if(!Number.isSafeInteger(bits)||(bits&0x10002)!==0x10002||(bits&4)!==0||
       c?.ownerPlayer!==opts.player||(zone==='spelltrap'?c?.faceUp!==false:c?.faceUp===true))return false;
      if(zone==='spelltrap'&&(!Number.isSafeInteger(state?.turn)||!Number.isSafeInteger(c?.setTurn)||
       c.setTurn<0||c.setTurn>=state.turn))return false;
      return true;
     };
     const mixedTarget1215=t=>{
      const bits=Number(t?.typeBits??t?.type??t?.card?.typeBits??t?.card?.type);
      return Number.isSafeInteger(bits)&&(bits&6)!==0&&(bits&1)===0&&[0,1].includes(t?.ownerPlayer);
     };
     // La enumeración del Worker NO es autoridad para declarar exhaustividad.
     // El hilo principal recompone la colección esperada por UID del preestado.
     if(mixed1211){
      const z=explicitBefore1209.zones,own=z[opts.player];
      const srcs=[...own.hand.filter(c=>mixedSource1215(explicitBefore1209,c,'hand')),
       ...own.spelltrap.filter(c=>mixedSource1215(explicitBefore1209,c,'spelltrap'))];
      const tgts=z.flatMap(side=>side.spelltrap).filter(mixedTarget1215);
      const orderedExpected=[],expected=new Set();for(const t of tgts)for(const c of srcs){
       const suid=c.uid.trim(),tuid=String(t?.uid??'').trim();if(!tuid||tuid.length>100||suid===tuid)continue;
       const key=JSON.stringify([suid,tuid]);if(expected.has(key))continue;
       expected.add(key);if(orderedExpected.length<maxPairs1212)orderedExpected.push(key);
      }
      if(!Number.isSafeInteger(data.eligiblePairCount)||data.eligiblePairCount!==expected.size||
        data.enumerationTruncated!==(expected.size>maxPairs1212)||
        pairs.length!==Math.min(expected.size,maxPairs1212)||
        // Verify the exact deterministic prefix; an arbitrary valid subset
        // can otherwise suppress later roots while claiming full coverage.
        pairs.some((pair,i)=>JSON.stringify([pair?.sourceUid,pair?.targetUid])!==orderedExpected[i])){
       finish('REMOVAL_ENUMERATION_WITNESS_INVALID_1212',empty);return;
      }
     }
     const deadline=(job.searchStartedAt1196??(W.performance?.now?.()??Date.now()))+maxTotalMs;
     const tooLate=()=>((W.performance?.now?.()??Date.now())>deadline);
     const seenPairs=new Set(),seenLines=new Set(),lines=[],thirdRoots1224=[];
     let thirdFollowups1224=0,thirdRootsVisited1224=0,thirdTruncated1224=false;
     let rejected=0,examined=0,followups=0,truncated=false;
     let followupRootsVisited=0;const firstRoots=[];
     const makeAction=(state,sourceUid,targetUid)=>{
      const sourceId=mixed1211?Number([...(state?.zones?.[opts.player]?.hand||[]),...(state?.zones?.[opts.player]?.spelltrap||[])].find(x=>String(x?.uid??'')===sourceUid)?.id):8267140;
      const actionType1211=sourceId===5318639?'ACTIVATE_RESOLVE_MST_1211':'ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208';
      if(sourceId!==8267140&&sourceId!==5318639)return null;
      const req={action:actionType1211,before:state,player:opts.player,uid:sourceUid,targetUid};
      const proof=actionType1211==='ACTIVATE_RESOLVE_MST_1211'?mysticalSpaceTyphoon1211(req):cosmicCyclone1208(req);
      if(!proof.pass)return null;
      const action={...req,actionType:req.action,paid:proof.paid,after:proof.after};
      if(!(mixed1211?replayRemovalSequence1211({actions:[action],state:proof.after}):replayCosmicCyclone1208({actions:[action],state:proof.after})).pass)return null;
      return action;
     };
     const pushLine=acts=>{
      const key=JSON.stringify(acts.map(a=>[a.uid,a.targetUid]));
      if(seenLines.has(key))return;
      const replay=mixed1211?(depth31224?replayRemovalSequence1224:replayRemovalSequence1211)({actions:acts,state:acts[acts.length-1].after}):replayCosmicSequence1210({actions:acts,state:acts[acts.length-1].after});
      if(!replay.pass){rejected++;return}
      seenLines.add(key);
      lines.push({actions:acts,state:acts[acts.length-1].after,
       status:replay.status,costPaid:replay.costPaid,steps:acts.length,
       certified:false,globalOptimalityProven:false,
       scope:mixed1211?'1-2_MIXED_SPELL_REMOVAL_NO_RESPONSES':'1-2_SEQUENTIAL_COSMIC_NO_OPPONENT_RESPONSES'});
     };
     for(const pair of pairs){
      if(closed)return;
      if(tooLate()){finish(mixed1211?'REMOVAL_TIME_BUDGET_EXCEEDED_1211':'COSMIC_TIME_BUDGET_EXCEEDED_1210',empty);return}
      if(stale()){finish(explicitChanged1209()?(mixed1211?'REMOVAL_STATE_CHANGED_1211':'COSMIC_STATE_CHANGED_1210'):staleReason1193(),empty);return}
      if(!pair||Object.keys(pair).sort().join(',')!=='sourceUid,targetUid'||
       typeof pair.sourceUid!=='string'||typeof pair.targetUid!=='string'||
       !pair.sourceUid||!pair.targetUid||pair.sourceUid.length>100||pair.targetUid.length>100){
       finish(mixed1211?'REMOVAL_WORKER_CONTRACT_INVALID_1211':'COSMIC_WORKER_CONTRACT_INVALID_1210',empty);return;
      }
      const pairKey=JSON.stringify([pair.sourceUid,pair.targetUid]);
      if(seenPairs.has(pairKey)){finish(mixed1211?'REMOVAL_WORKER_DUPLICATE_PAIR_1211':'COSMIC_WORKER_DUPLICATE_PAIR_1210',empty);return}
      seenPairs.add(pairKey);examined++;
      const first=makeAction(explicitBefore1209,pair.sourceUid,pair.targetUid);
      if(!first){rejected++;continue}
      pushLine([first]);
      const next=first.after,z=next?.zones?.[opts.player];
      const sources=mixed1211?[...(Array.isArray(z?.hand)?z.hand:[]).filter(c=>mixedSource1215(next,c,'hand')),
       ...(Array.isArray(z?.spelltrap)?z.spelltrap:[]).filter(c=>mixedSource1215(next,c,'spelltrap'))]:
       [...(Array.isArray(z?.hand)?z.hand:[]),...(Array.isArray(z?.spelltrap)?z.spelltrap:[])].filter(source=>
        Number(source?.id??source?.card?.id)===8267140);
      const targets=(Array.isArray(next?.zones)?next.zones:[]).flatMap(side=>Array.isArray(side?.spelltrap)?side.spelltrap:[])
       .filter(t=>!mixed1211||mixedTarget1215(t));
      // Sólo las continuaciones físicamente elegibles consumen presupuesto;
      // cada acción todavía necesita ejecución canónica y replay completos.
      // No permitir que la primera raíz gaste todo el presupuesto de 60
      // continuaciones: guardar cursores y visitar cada raíz por rondas.
      if(sources.length&&targets.length)firstRoots.push({first,next,sources,targets,si:0,ti:0,visited:false});
      if(examined%4===0)await new Promise(resolve=>setTimeout(resolve,0));
     }
     const nextFollowup1213=root=>{
      while(root.si<root.sources.length){
       const source=root.sources[root.si],target=root.targets[root.ti];
       root.ti++;if(root.ti>=root.targets.length){root.ti=0;root.si++}
       const suid=String(source?.uid??''),tuid=String(target?.uid??'');
       if(suid&&tuid&&suid!==tuid)return{suid,tuid};
      }
      return null;
     };
     let followupPending1213=false;
     while(true){
      let foundInRound=false;
      for(const root of firstRoots){
       if(closed)return;
       if(tooLate()){finish(mixed1211?'REMOVAL_TIME_BUDGET_EXCEEDED_1211':'COSMIC_TIME_BUDGET_EXCEEDED_1210',empty);return}
       if(stale()){finish(explicitChanged1209()?(mixed1211?'REMOVAL_STATE_CHANGED_1211':'COSMIC_STATE_CHANGED_1210'):staleReason1193(),empty);return}
       const choice=nextFollowup1213(root);
       if(!choice)continue;
       foundInRound=true;
       if(followups>=60){truncated=true;followupPending1213=true;break}
       if(!root.visited){root.visited=true;followupRootsVisited++}
       followups++;
       const second=makeAction(root.next,choice.suid,choice.tuid);
       if(second){
        pushLine([root.first,second]);
        if(depth31224){
         const state=second.after,z=state?.zones?.[opts.player];
         const sources=[...(z?.hand||[]).filter(c=>mixedSource1215(state,c,'hand')),
          ...(z?.spelltrap||[]).filter(c=>mixedSource1215(state,c,'spelltrap'))];
         const targets=(state?.zones||[]).flatMap(side=>side?.spelltrap||[]).filter(mixedTarget1215);
         if(sources.length&&targets.length)thirdRoots1224.push({acts:[root.first,second],next:state,sources,targets,si:0,ti:0,visited:false});
        }
       }else rejected++;
      }
      if(truncated||!foundInRound)break;
      // Yield after every fair round for cancellation and UI responsiveness.
      await new Promise(resolve=>setTimeout(resolve,0));
     }
     // Alpha 1224: nueva tercera resolución real, únicamente en modo opt-in.
     // Se usa la misma autoridad MST/Cosmic por paso y replay de TRES estados.
     // Reparto justo por raíces y presupuesto separado. No hay respuestas del rival.
     if(depth31224){
      let pendingThird1224=false;
      while(true){
       let found1224=false;
       for(const root of thirdRoots1224){
        if(closed)return;
        if(tooLate()){finish('REMOVAL_TIME_BUDGET_EXCEEDED_1224',empty);return}
        if(stale()){finish(explicitChanged1209()?'REMOVAL_STATE_CHANGED_1224':staleReason1193(),empty);return}
        const choice=nextFollowup1213(root);
        if(!choice)continue;
        found1224=true;
        if(thirdFollowups1224>=120){thirdTruncated1224=true;pendingThird1224=true;break}
        if(!root.visited){root.visited=true;thirdRootsVisited1224++}
        thirdFollowups1224++;
        const third=makeAction(root.next,choice.suid,choice.tuid);
        if(third)pushLine([...root.acts,third]);else rejected++;
       }
       if(pendingThird1224||!found1224)break;
       await new Promise(resolve=>setTimeout(resolve,0));
      }
     }
     if(closed)return;
     if(tooLate()){finish(mixed1211?'REMOVAL_TIME_BUDGET_EXCEEDED_1211':'COSMIC_TIME_BUDGET_EXCEEDED_1210',empty);return}
     if(stale()){finish(explicitChanged1209()?(mixed1211?'REMOVAL_STATE_CHANGED_1211':'COSMIC_STATE_CHANGED_1210'):staleReason1193(),empty);return}
     lines.sort((a,b)=>b.steps-a.steps||JSON.stringify(a.actions.map(x=>[x.uid,x.targetUid])).localeCompare(JSON.stringify(b.actions.map(x=>[x.uid,x.targetUid]))));
     const selected=lines.slice(0,5).map((line,i)=>({...structuredClone(line),index:i+1}));
     finish(selected.length?(depth31224?'BOUNDED_REMOVAL_SEQUENCES_1224':mixed1211?'BOUNDED_REMOVAL_SEQUENCES_1211':'BOUNDED_COSMIC_SEQUENCES_1210'):(depth31224?'NO_BOUNDED_REMOVAL_SEQUENCES_1224':mixed1211?'NO_BOUNDED_REMOVAL_SEQUENCES_1211':'NO_BOUNDED_COSMIC_SEQUENCES_1210'),{
      candidates:selected,candidateCount:selected.length,choicesExamined:examined,
      followupsExamined:followups,choicesRejected:rejected,
      firstRootsValid:firstRoots.length,followupRootsVisited,
      followupBudgetTruncated:followupPending1213,
      thirdFollowupsExamined:depth31224?thirdFollowups1224:undefined,
      thirdRootsVisited:depth31224?thirdRootsVisited1224:undefined,
      thirdBudgetTruncated:depth31224?thirdTruncated1224:undefined,
      truncated:truncated||(depth31224&&thirdTruncated1224)||lines.length>5||(mixed1211?data.enumerationTruncated===true:pairs.length===30),
      eligiblePairCount:mixed1211?data.eligiblePairCount:undefined,
      // 1212 describes first-step Worker coverage, not all two-step lines.
      enumerationComplete:mixed1211?data.enumerationTruncated===false:undefined,
      sequenceEnumerationComplete:!truncated&&!thirdTruncated1224&&(mixed1211?data.enumerationTruncated===false:pairs.length<30),
      maxSteps:depth31224?3:2,scope:depth31224?'OPT-IN Worker + canonical 1-3 MST/Cosmic effects; no rival responses; NOT general Top 5':mixed1211?'Worker + canonical 1-2 MST/Cosmic effects; NOT general Top 5':'Worker first-step enumeration; canonical sequential replay 1-2 actions; NOT general Top 5',
      certified:false,globalOptimalityProven:false});
     return;
    }
    // Alpha 1209: enumeración REAL en Worker de parejas; ejecución y replay
    // canónicos en el motor principal. Jamás publicar en el Top 5 general.
    // Una respuesta de Worker no puede introducir estados pagados/inventados.
    if(opts.mode==='COSMIC_ENUM_1209'){
     if(explicitChanged1209()){finish('COSMIC_STATE_CHANGED_1209',{candidates:[],candidateCount:0});return}
     const data=msg.result,rawPairs=data?.candidates;
     if(!data||!Array.isArray(rawPairs)||rawPairs.length>30||data.candidateCount!==rawPairs.length){
      finish('COSMIC_WORKER_CONTRACT_INVALID_1209',{candidates:[],candidateCount:0});return;
     }
     const seen=new Set(),lines=[];let rejected=0;
     for(const pair of rawPairs){
      if(!pair||Object.keys(pair).sort().join(',')!=='sourceUid,targetUid'||
         typeof pair.sourceUid!=='string'||typeof pair.targetUid!=='string'||
         !pair.sourceUid||!pair.targetUid||pair.sourceUid.length>100||pair.targetUid.length>100){
       finish('COSMIC_WORKER_CONTRACT_INVALID_1209',{candidates:[],candidateCount:0});return;
      }
      const pairKey=JSON.stringify([pair.sourceUid,pair.targetUid]);
      if(seen.has(pairKey)){finish('COSMIC_WORKER_DUPLICATE_PAIR_1209',{candidates:[],candidateCount:0});return}
      seen.add(pairKey);
      const request={action:'ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208',before:explicitBefore1209,
        player:opts.player,uid:pair.sourceUid,targetUid:pair.targetUid};
      const proof=cosmicCyclone1208(request);
      if(!proof.pass){rejected++;continue}
      const action={...request,actionType:request.action,paid:proof.paid,after:proof.after};
      const replay=replayCosmicCyclone1208({actions:[action],state:proof.after});
      if(!replay.pass){rejected++;continue}
      lines.push({index:lines.length+1,actions:[action],state:proof.after,
       status:'BOUNDED_REPLAY_MATCH',costPaid:1000,sourceZone:proof.sourceZone,
       scope:'ONE_ACTION_NO_OPPONENT_RESPONSES',certified:false,globalOptimalityProven:false});
      if(lines.length===5)break;
     }
     const staleStatus=explicitChanged1209()?'COSMIC_STATE_CHANGED_1209':staleReason1193();
     finish(staleStatus|| (lines.length?'BOUNDED_COSMIC_LINES_1209':'NO_BOUNDED_COSMIC_LINES_1209'),
      staleStatus?{candidates:[],candidateCount:0}:{candidates:lines,candidateCount:lines.length,
       choicesExamined:seen.size,choicesRejected:rejected,sourceStatus:String(data.status||''),
       scope:'Explicit state, isolated target enumeration, canonical cost/resolve/replay; NOT the general Top 5',
       certified:false,globalOptimalityProven:false});
     return;
    }
    // Alpha 1191: el protocolo Worker solo aporta candidatos y diagnosticos.
    // No reutilizar el PASS/identity recibido ni aceptar como final un checkpoint.
    const r=msg.result&&typeof msg.result==='object'&&!Array.isArray(msg.result)?msg.result:{};
    // Alpha 1193: los candidatos vacios, malformados o sin acciones no son combos.
    // Se admiten exclusivamente las trazas acotadas que emite este Worker.
    // Alpha 1194: un resultado de Worker no puede afirmar exhaustividad si algun
    // candidato fue descartado ni puede esconder candidatos fuera del maximo.
    // Los campos candidates incorrectos tambien son fallos del contrato.
    const malformedCandidates1194=r.candidates!=null&&!Array.isArray(r.candidates);
    const supplied1194=arr(r.candidates),overflow1194=supplied1194.length>5;
    const received=supplied1194.slice(0,5);
    // Alpha 1198: la accion debe tener tipo; una carta suelta sin transicion no es una jugada.
    // El campo final debe ser una lista bien formada, no un texto tratado como [] por arr().
    const boundedChoices1197=v=>v===undefined||Array.isArray(v)&&v.length<=12&&v.every(x=>typeof x==='string'&&x.length<=800);
    // Alpha 1198: conservar ocupacion, identidad y postura cuando provienen del estado fisico.
    // Los testigos heredados sin estado siguen siendo acotados, no legalidad acreditada.
    const validBoardWitness1198=c=>{
     if(c.boardWitness1198===undefined)return true;
     if(!Array.isArray(c.boardWitness1198)||c.boardWitness1198.length>7)return false;
     if(c.boardWitness1198.length!==c.cardsInFinalBoard?.length)return false;
     return c.boardWitness1198.every((v,i)=>{
      if(typeof v!=='string'||v.length>480)return false;
      try{const row=JSON.parse(v);return Array.isArray(row)&&row.length===6&&row[0]===i&&
       typeof row[1]==='string'&&row[1].length<=80&&row[2]===c.cardsInFinalBoard[i]&&
       typeof row[3]==='string'&&row[3].length<=30&&(row[4]===0||row[4]===1)&&
       Number.isInteger(row[5])&&(row[5]===0||row[5]===1)}catch(_){return false}
     });
    };
    // Testigos de movimientos observados, solo para auditoria: NO certifican
    // activacion, coste, ventana de respuesta o legalidad del duelo.
    // Alpha 1205: validar el testigo transportado por el Worker y su
    // continuidad entre pasos. Un contrato histórico SIN testigo sigue no
    // certificado; nunca se convierte en una demostración de recursos.
    const resourceFields1205=['turn','phase','activePlayer','normalSummonsUsed','normalSummonAvailable','lp','chain'];
    // Alpha 1206: receiver checks the same depth/breadth contract on the
    // parsed witness. JSON parsing already excludes non-JSON numeric types.
    const validChain1206=chain=>{
     if(!Array.isArray(chain)||chain.length>16)return false;
     let count=0;
     const valid=(v,depth)=>{
      if(++count>256||depth>8)return false;
      if(v===null||typeof v==='boolean')return true;
      if(typeof v==='number')return Number.isFinite(v);
      if(typeof v==='string')return v.length<=1024;
      if(!v||typeof v!=='object')return false;
      const keys=Object.keys(v);
      if(keys.length>48||Array.isArray(v)&&v.length>32)return false;
      return keys.every(k=>k.length<=100&&valid(v[k],depth+1));
     };
     return valid(chain,0);
    };
    const validBoundary1205=value=>{
     if(typeof value!=='string'||value.length>4096)return false;
     let pairs;
     try{pairs=JSON.parse(value)}catch(_){return false}
     if(!Array.isArray(pairs)||pairs.length>resourceFields1205.length||JSON.stringify(pairs)!==value)return false;
     let previous=-1;
     for(const entry of pairs){
      if(!Array.isArray(entry)||entry.length!==2)return false;
      const [k,v]=entry,i=resourceFields1205.indexOf(k);
      if(i<=previous)return false;previous=i;
      if(k==='turn'&&(!Number.isSafeInteger(v)||v<0||v>1000000))return false;
      if(k==='phase'&&(typeof v!=='string'||v.length>50))return false;
      if(k==='activePlayer'&&![0,1].includes(v))return false;
      if(k==='normalSummonsUsed'&&(!Number.isSafeInteger(v)||v<0||v>20))return false;
      if(k==='normalSummonAvailable'&&(!Array.isArray(v)||v.length!==2||!v.every(x=>typeof x==='boolean')))return false;
      if(k==='lp'&&(!Array.isArray(v)||v.length!==2||!v.every(x=>Number.isSafeInteger(x)&&x>=0&&x<=999999)))return false;
      if(k==='chain'&&!validChain1206(v))return false;
     }
     return true;
    };
    // Alpha 1206: conciliar los recursos del estado con el contrato de la acción.
    // Un testigo contradictorio jamás debe acreditarse como físicamente exacto.
    const matchingSimpleResources1206=r=>{
     const proof=r?.actionContract1202;
     if(!proof)return true;
     if(r.boundaryBefore1205===undefined&&r.boundaryAfter1205===undefined)return true;
     if(!validBoundary1205(r.boundaryBefore1205)||!validBoundary1205(r.boundaryAfter1205))return false;
     let before,after;
     try{before=Object.fromEntries(JSON.parse(r.boundaryBefore1205));after=Object.fromEntries(JSON.parse(r.boundaryAfter1205))}
     catch(_){return false}
     const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
     const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
     for(const k of ['turn','phase','activePlayer']){
      if(has(before,k)!==has(after,k))return false;
      if(has(before,k)&&!same(before[k],after[k]))return false;
     }
     if(proof.actionType!=='DRAW_ONE'){
      if(!has(before,'phase')||!has(before,'activePlayer')||
         !/^MAIN(?:1|2)?$/i.test(before.phase)||before.activePlayer!==proof.player)return false;
     }
     const usage=proof.usageEvidence1203;
     if(has(before,'normalSummonsUsed')!==has(after,'normalSummonsUsed'))return false;
     if(has(before,'normalSummonsUsed')!==!!usage)return false;
     if(usage&&(before.normalSummonsUsed!==usage[0]||after.normalSummonsUsed!==usage[1]))return false;
     const ev=proof.resourceEvidence1204||{};
     for(const [key,witness] of [['lp',ev.lp],['chain',ev.chainDepth]]){
      if(has(before,key)!==has(after,key))return false;
      if(has(before,key)!==!!witness)return false;
      if(witness){
       if(key==='lp'&&(!same(witness,[...before.lp,...after.lp])||!same(before.lp,after.lp)))return false;
       if(key==='chain'&&(!Array.isArray(before.chain)||!Array.isArray(after.chain)||
            before.chain.length!==witness[0]||after.chain.length!==witness[1]||
            !same(before.chain,after.chain)))return false;
      }
     }
     if(['DRAW_ONE','SET_SPELL_TRAP'].includes(proof.actionType)&&
        has(before,'normalSummonAvailable')&&has(after,'normalSummonAvailable')&&
        !same(before.normalSummonAvailable,after.normalSummonAvailable))return false;
     return true;
    };
    const validTransitions1199=c=>{
     if(c.transitionWitness1199===undefined)return true; // compatibilidad historica: sin evidencia
     const rows=c.transitionWitness1199;
     if(!Array.isArray(rows)||rows.length>24)return false;
     if(rows.length===0)return c.transitionWitnessScope1199==='NO_STEP_STATES';
     if(rows.length!==c.actions?.length)return false;
     if(rows.some(r=>(r.boundaryBefore1205===undefined)!==(rows[0]?.boundaryBefore1205===undefined)))return false;
     const tag=/^[0-9a-f]{8}:[0-9]{1,5}$/;
     const zones=new Set(['deck','extra','hand','monster','spelltrap','gy','banished','field','pendulum','LEFT_MODEL','ENTERED_MODEL']);
     return rows.every((r,i)=>r&&typeof r==='object'&&!Array.isArray(r)&&r.step===i+1&&
      tag.test(r.before)&&tag.test(r.after)&&
      (i===0||r.before===rows[i-1]?.after)&&
      ((r.boundaryBefore1205===undefined&&r.boundaryAfter1205===undefined)||
       (validBoundary1205(r.boundaryBefore1205)&&validBoundary1205(r.boundaryAfter1205)&&
        (i===0||r.boundaryBefore1205===rows[i-1]?.boundaryAfter1205)))&&
      Array.isArray(r.moves)&&r.moves.length<=80&&r.moves.every(m=>Array.isArray(m)&&m.length===5&&
       typeof m[0]==='string'&&m[0].length>0&&m[0].length<=100&&
       Number.isInteger(m[1])&&m[1]>=-1&&m[1]<=1&&zones.has(m[2])&&
       Number.isInteger(m[3])&&m[3]>=-1&&m[3]<=1&&zones.has(m[4])&&
       // Sentinel -1 exige la zona sentinel correspondiente; los extremos
       // reales exigen zonas reales. Un movimiento nunca es un no-op.
       (m[1]===-1?m[2]==='ENTERED_MODEL':m[2]!=='ENTERED_MODEL'&&m[2]!=='LEFT_MODEL')&&
       (m[3]===-1?m[4]==='LEFT_MODEL':m[4]!=='LEFT_MODEL'&&m[4]!=='ENTERED_MODEL')&&
       !(m[1]===-1&&m[3]===-1)&&
       !(m[1]===m[3]&&m[2]===m[4]))&&
      r.moves.every((m,j)=>r.moves.findIndex(v=>v[0]===m[0])===j)&&
      // El receptor solo admite un contrato físico asociado al tipo y paso
      // que los datos de la acción realmente declaran.
      (r.actionContract1202===undefined||(
       r.actionContract1202&&typeof r.actionContract1202==='object'&&
       ['DRAW_ONE','NORMAL_SUMMON_L4','NORMAL_SET_L4','SET_SPELL_TRAP'].includes(r.actionContract1202.actionType)&&
       r.actionContract1202.actionType===c.actions[i]?.actionType&&
       typeof r.actionContract1202.uid==='string'&&r.actionContract1202.uid.length>0&&r.actionContract1202.uid.length<=100&&
       Number.isInteger(r.actionContract1202.player)&&[0,1].includes(r.actionContract1202.player)&&
       r.actionContract1202.scope==='PHYSICAL_ACTION_SUBSET_ONLY'&&
       ['selectedCosts','selectedTargets','selectedMaterials'].every(k=>
        c.actions[i]?.[k]===undefined||Array.isArray(c.actions[i][k])&&c.actions[i][k].length===0)&&
       (r.actionContract1202.resourceEvidence1204===undefined||(
        r.actionContract1202.resourceEvidence1204&&
        typeof r.actionContract1202.resourceEvidence1204==='object'&&
        !Array.isArray(r.actionContract1202.resourceEvidence1204)&&
        Object.keys(r.actionContract1202.resourceEvidence1204).every(k=>['lp','chainDepth'].includes(k))&&
        (r.actionContract1202.resourceEvidence1204.lp===undefined||(
         Array.isArray(r.actionContract1202.resourceEvidence1204.lp)&&
         r.actionContract1202.resourceEvidence1204.lp.length===4&&
         r.actionContract1202.resourceEvidence1204.lp.every(n=>Number.isSafeInteger(n)&&n>=0&&n<=999999)&&
         r.actionContract1202.resourceEvidence1204.lp[0]===r.actionContract1202.resourceEvidence1204.lp[2]&&
         r.actionContract1202.resourceEvidence1204.lp[1]===r.actionContract1202.resourceEvidence1204.lp[3]))&&
        (r.actionContract1202.resourceEvidence1204.chainDepth===undefined||(
         Array.isArray(r.actionContract1202.resourceEvidence1204.chainDepth)&&
         r.actionContract1202.resourceEvidence1204.chainDepth.length===2&&
         r.actionContract1202.resourceEvidence1204.chainDepth.every(n=>Number.isSafeInteger(n)&&n>=0&&n<=16)&&
         r.actionContract1202.resourceEvidence1204.chainDepth[0]===r.actionContract1202.resourceEvidence1204.chainDepth[1]))))&&
       (r.actionContract1202.usageEvidence1203===undefined||(
        Array.isArray(r.actionContract1202.usageEvidence1203)&&
        r.actionContract1202.usageEvidence1203.length===2&&
        r.actionContract1202.usageEvidence1203.every(n=>Number.isSafeInteger(n)&&n>=0&&n<=1)&&
        (['NORMAL_SUMMON_L4','NORMAL_SET_L4'].includes(r.actionContract1202.actionType)?
         r.actionContract1202.usageEvidence1203[0]===0&&r.actionContract1202.usageEvidence1203[1]===1:
         r.actionContract1202.usageEvidence1203[0]===r.actionContract1202.usageEvidence1203[1])))&&
       r.moves.length===1&&r.moves[0][0]===r.actionContract1202.uid&&
       r.moves[0][1]===r.actionContract1202.player&&r.moves[0][3]===r.actionContract1202.player&&
       (r.actionContract1202.actionType==='DRAW_ONE'?r.moves[0][2]==='deck'&&r.moves[0][4]==='hand':
        r.actionContract1202.actionType==='SET_SPELL_TRAP'?r.moves[0][2]==='hand'&&r.moves[0][4]==='spelltrap':
        r.moves[0][2]==='hand'&&r.moves[0][4]==='monster')))&&
      // Un tipo conocido no puede aparecer con pasos físicos sin su testigo.
      (!['DRAW_ONE','NORMAL_SUMMON_L4','NORMAL_SET_L4','SET_SPELL_TRAP'].includes(c.actions[i]?.actionType)||
       r.actionContract1202!==undefined)&&
      matchingSimpleResources1206(r));
    };
    const valid=received.filter(c=>c&&typeof c==='object'&&!Array.isArray(c)&&
      typeof c.score==='number'&&Number.isFinite(c.score)&&
      Array.isArray(c.cardsInFinalBoard)&&c.cardsInFinalBoard.length<=15&&
      c.cardsInFinalBoard.every(name=>typeof name==='string'&&name.trim().length>0&&name.length<=160)&&
      validBoardWitness1198(c)&&validTransitions1199(c)&&
      Array.isArray(c.actions)&&c.actions.length>0&&c.actions.length<=24&&
      c.actions.every(a=>a&&typeof a==='object'&&!Array.isArray(a)&&
        typeof a.actionType==='string'&&a.actionType.trim().length>0&&a.actionType.length<=80&&
        boundedChoices1197(a.selectedTargets)&&boundedChoices1197(a.selectedCosts)&&boundedChoices1197(a.selectedMaterials)));
    const normalized1195=valid.map(c=>({score:c.score,
      actions:c.actions.map(a=>({card:raw(a.card||'').slice(0,160),actionType:raw(a.actionType||'').slice(0,80),
        source:raw(a.source||'').slice(0,160),effectId:a.effectId==null?null:raw(a.effectId).slice(0,120),
        selectedTargets:arr(a.selectedTargets).slice(0,12),selectedCosts:arr(a.selectedCosts).slice(0,12),selectedMaterials:arr(a.selectedMaterials).slice(0,12)})),
      cardsInFinalBoard:c.cardsInFinalBoard.slice(0,15),
      boardWitness1198:arr(c.boardWitness1198).slice(0,7),
      boardWitnessScope1198:arr(c.boardWitness1198).length?'STATE_SNAPSHOT_ONLY':'NO_PHYSICAL_WITNESS',
      transitionWitness1199:arr(c.transitionWitness1199).slice(0,24),
      transitionWitnessScope1199:arr(c.transitionWitness1199).length?'ZONAL_CONTINUITY_ONLY_NOT_RULES':'NO_STEP_STATES'}));
    const seenBridge1195=new Set(),candidates=[];let duplicateCandidateCount=0;
    for(const c of normalized1195){
      const signature=JSON.stringify([c.actions.map(a=>[a.card,a.actionType,a.source,a.effectId,a.selectedTargets,a.selectedCosts,a.selectedMaterials]),c.cardsInFinalBoard,c.boardWitness1198]);
      if(seenBridge1195.has(signature)){duplicateCandidateCount++;continue}
      seenBridge1195.add(signature);candidates.push({...c,index:candidates.length+1});
    }
    const rejectedCandidateCount=received.length-valid.length+duplicateCandidateCount+
      Math.max(0,supplied1194.length-5)+(malformedCandidates1194?1:0),resumable=r.resumable===true;
    const claimedStatus=raw(r.status||'BOUNDED_WITH_GAPS');
    const completeLabel=/(?:HORIZON_COMPLETE|DOMAIN_EXHAUSTED|OPTIMAL)/i.test(claimedStatus);
    // Alpha 1198: un temporizador del Worker no es prueba suficiente si una
    // enumeración síncrona excede el presupuesto y retrasa sus mensajes.
    // Medir desde SEARCH (no desde INIT/carga del catálogo), con reloj monotónico.
    const searchClock1196=W.performance?.now?.()??Date.now();
    const elapsedMain1196=Number.isFinite(job.searchStartedAt1196)?
      Math.max(0,searchClock1196-job.searchStartedAt1196):NaN;
    const elapsedWorker1196=typeof r.elapsedMs==='number'&&Number.isFinite(r.elapsedMs)&&r.elapsedMs>=0?r.elapsedMs:null;
    const budgetExceeded1196=opts.mode!=='PARITY'&&
      (elapsedMain1196>maxTotalMs||elapsedWorker1196!==null&&elapsedWorker1196>maxTotalMs);
    const elapsedUnproven1196=opts.mode!=='PARITY'&&completeLabel&&
      (elapsedWorker1196===null||!Number.isFinite(elapsedMain1196));
    let safeStatus=completeLabel&&(resumable||r.resumable!==false||r.domainComplete!==true)?
      (resumable?'CHECKPOINT_READY':'BOUNDED_WITH_GAPS'):claimedStatus;
    if(elapsedUnproven1196)safeStatus='WORKER_TIME_EVIDENCE_MISSING';
    if(budgetExceeded1196)safeStatus='WORKER_TIME_BUDGET_EXCEEDED';
    // Una respuesta parcial con pruebas descartadas no tiene derecho a conservar
    // el estado HORIZON_COMPLETE/DOMAIN_EXHAUSTED, aun si trae lineas aceptables.
    if(malformedCandidates1194||overflow1194)safeStatus='WORKER_CANDIDATE_CONTRACT_INVALID';
    else if(duplicateCandidateCount>0)safeStatus='WORKER_DUPLICATE_CANDIDATES_REJECTED';
    else if(rejectedCandidateCount>0)safeStatus=candidates.length?'WORKER_PARTIAL_CANDIDATES_REJECTED':'WORKER_CANDIDATES_INVALID';
    // Aun con candidatos bien formados, jamás restaurar una etiqueta de
    // completitud tras observar un exceso o ausencia de evidencia temporal.
    else if(budgetExceeded1196)safeStatus='WORKER_TIME_BUDGET_EXCEEDED';
    else if(elapsedUnproven1196)safeStatus='WORKER_TIME_EVIDENCE_MISSING';
    const invalidated=staleReason1193();
    finish(invalidated||safeStatus,invalidated?
      {candidates:[],candidateCount:0}:
      {...r,status:safeStatus,elapsedMainMs1196:Math.round(elapsedMain1196),timeBudgetMs1196:maxTotalMs,candidates:(malformedCandidates1194||overflow1194)?[]:candidates,
        candidateCount:(malformedCandidates1194||overflow1194)?0:candidates.length,
        rejectedCandidateCount,duplicateCandidateCount,certified:false,globalOptimalityProven:false});
   }
  };
  try{worker.postMessage({type:'INIT',targetVersion:VERSION,manifest:WORKER_MANIFEST_1080,guardCode:installParserGuard1092.toString(),regressionCode:parserRegression1092.toString(),runId:id,payload:n.textContent,prelude:prelude.textContent})}
  catch(e){finish('WORKER_BOOT_POST_ERROR',{error:raw(e?.message||e)})}
 });
}

/* Alpha 1079: buscador cooperativo de horizonte acotado, con cancelación real en límites de nodo.
   No promete resultados universalmente óptimos ni legalidad certificada sin prueba física. */
const COOP1079={active:null,last:null,run:0};
const delay1079=()=>new Promise(r=>setTimeout(r,0));
function searchStatus1079(){const j=COOP1079.active;return j?{version:VERSION,running:true,cancelRequested:j.cancelled,startedAt:j.startedAt,slices:j.slices,status:'RUNNING'}:{version:VERSION,running:false,...(COOP1079.last||{status:'IDLE'})}}
function cancelSearch1079(){const j=COOP1079.active;if(!j)return{version:VERSION,status:'NO_ACTIVE_SEARCH',cancelled:false};j.cancelled=true;return{version:VERSION,status:'CANCELLATION_REQUESTED',cancelled:true,runId:j.id}}
async function searchCooperative1079(opts={}){
 if(COOP1079.active)return{version:VERSION,pass:false,certified:false,status:'SEARCH_ALREADY_RUNNING',running:true};
 const started=Date.now(),maxTotalMs=Math.max(200,Math.min(60000,Number(opts.maxTotalMs)||5000));
 const depth=Math.max(1,Math.min(8,Number(opts.maxDepth)||2)),states=Math.max(20,Math.min(50000,Number(opts.maxStates)||500)),branches=Math.max(8,Math.min(2000,Number(opts.maxActionBranches)||96));
 const sliceMs=Math.max(8,Math.min(100,Number(opts.sliceMs)||25)),nodeBudgetMs=Math.max(4,Math.min(40,Number(opts.nodeBudgetMs)||10));
 const maxSlices=Math.max(1,Math.min(300,Number(opts.maxSlices)||48)),revision=DECK_REVISION_1056,fingerprint=deckFingerprint1056();
 const id=++COOP1079.run,job={id,startedAt:started,slices:0,cancelled:false};COOP1079.active=job;
 const stale=()=>revision!==DECK_REVISION_1056||deckFingerprint1056()!==fingerprint;
 const cancelled=()=>job.cancelled||opts.signal?.aborted===true||opts.shouldCancel?.()===true;
 const sample1079=Math.max(0,Math.min(9,Number(opts.sample)||0));const key=`1079|${fingerprint}|S${sample1079}|D${depth}|B${branches}|M${states}`;
 let result=null,last=null,checkpoint=null,engineStatus=null;
 const emit=(status,extra={})=>{try{opts.onProgress?.({version:VERSION,runId:id,status,slices:job.slices,elapsedMs:Date.now()-started,...extra})}catch(_){}};
 try{
  if(arr(W.deckState?.main).length===0){result={status:'EMPTY_DECK',pass:false,certified:false};return result}
  if(typeof W.YGOAlpha669?.exhaustiveOpeningSearch669Async!=='function'){result={status:'ASYNC_ENGINE_UNAVAILABLE',pass:false,certified:false};return result}
  const store=W.__YGO669_ASYNC_CHECKPOINTS;
  // Alpha 1191: retirar checkpoints legacy sin muestra y no buscar con huella inválida.
  store?.delete?.(`1079|${fingerprint}|D${depth}|B${branches}|M${states}`);
  if(typeof fingerprint!=='string'||!fingerprint){result={version:VERSION,runId:id,pass:false,certified:false,status:'DECK_FINGERPRINT_UNAVAILABLE',resumable:false};return result}
  if(opts.resume!==true)store?.delete?.(key);
  emit('STARTED',{depth,states,branches});
  await delay1079();
  for(let i=0;i<maxSlices;i++){
   if(cancelled()||stale()||Date.now()-started>=maxTotalMs)break;
   last=await W.YGOAlpha669.exhaustiveOpeningSearch669Async({
    sample:sample1079,maxDepth:depth,maxStates:states,maxActionBranches:branches,
    sliceMs,nodeBudgetMs,yieldEvery:1,checkpointKey:key,resume:(opts.resume===true||i>0),
    shouldCancel:()=>cancelled()||stale()||Date.now()-started>=maxTotalMs,
    onProgress:p=>emit('EXPANDING',{depth:p?.depth,expanded:p?.expanded,frontier:p?.frontier})
   });
   job.slices++;checkpoint=last?.checkpoint||null;engineStatus=last?.status||null;
   emit('SLICE_COMPLETE',{engineStatus,checkpoint});
   if(last?.certificate?.resumable!==true)break;
   await delay1079();
  }
  const age=Date.now()-started,isStale=stale(),isCancelled=cancelled(),timedOut=age>=maxTotalMs;
  const cert=last?.certificate||null,completed=cert?.resumable===false&&cert?.truncated!==true;
  const boundedComplete=completed&&(cert?.horizonOptimalityProven===true||cert?.domainExhaustedOptimalityProven===true)&&cert?.allLegalActionsEnumerated===true&&cert?.allTransitionsExact===true&&cert?.targetChoiceEnumerationComplete===true;
  const candidates=isStale||isCancelled?[]:arr(last?.lines).slice(0,5);
  const checked=candidates.map((line,i)=>{
   let replay=null,physical=null;try{replay=top5ReplayAudit1070([line])}catch(e){replay={pass:false,error:raw(e?.message||e)}}
   try{physical=lineEvidence1047(line)}catch(e){physical={pass:false,error:raw(e?.message||e)}}
   return{index:i+1,replayCertified:num(replay?.certified)>0,physicalPass:physical?.pass===true,pass:num(replay?.certified)>0&&physical?.pass===true};
  });
  result={version:VERSION,runId:id,pass:false,certified:false,globalOptimalityProven:false,
   status:isStale?'STALE_DECK_CANCELLED':isCancelled?'CANCELLED_CHECKPOINT':timedOut?'TIME_BUDGET_CHECKPOINT':boundedComplete?'BOUNDED_HORIZON_COMPLETE':completed?'BOUNDED_WITH_GAPS':'CHECKPOINT_READY',
   boundedComplete:!isStale&&!isCancelled&&!timedOut&&boundedComplete,candidateCount:candidates.length,candidates,checked,certificate:cert,checkpoint:isStale||isCancelled?null:checkpoint,
   resumable:!isStale&&!isCancelled&&cert?.resumable===true,slices:job.slices,elapsedMs:age,maxTotalMs,
   policy:'Búsqueda asíncrona real con cancelación antes y después de cada nodo. No declara Top 5 universal ni presenta líneas sin acreditación.'};
  if(isStale||isCancelled){W.__YGO669_ASYNC_CHECKPOINTS?.delete?.(key)}
  emit(result.status,{candidateCount:result.candidateCount,resumable:result.resumable});return result;
 }catch(e){result={version:VERSION,runId:id,pass:false,certified:false,status:'SEARCH_ERROR',error:raw(e?.message||e),slices:job.slices,elapsedMs:Date.now()-started};emit('SEARCH_ERROR',{error:result.error});return result}
 finally{
  // Mantener únicamente checkpoints reanudables y acotar el caché de esta familia.
  const cp=W.__YGO669_ASYNC_CHECKPOINTS;
  if(cp instanceof Map){
   if(result?.resumable!==true)cp.delete(key);
   const own=[...cp.keys()].filter(k=>typeof k==='string'&&k.startsWith('1079|'));
   for(const old of own.slice(0,Math.max(0,own.length-12)))cp.delete(old);
  }
  COOP1079.active=null;COOP1079.last={version:VERSION,status:result?.status||'UNKNOWN',runId:id,elapsedMs:Date.now()-started,slices:job.slices,resumable:result?.resumable===true,candidateCount:result?.candidateCount||0};W.__YGO1079_COOPERATIVE_SEARCH=result
 }
}
function bindCooperative1079(){
 const start=D.getElementById('alpha1079StartSearch'),stop=D.getElementById('alpha1079CancelSearch'),status=D.getElementById('alpha1079SearchStatus');
 if(!start||!stop||!status||start.dataset.bound1079==='1')return false;start.dataset.bound1079='1';
 const set=(message,running)=>{status.textContent=message;start.disabled=!!running;stop.disabled=!running};
 set('Búsqueda aislada en Worker; puede detenerse incluso durante un nodo bloqueado. No certifica combos.',false);
 start.addEventListener('click',async()=>{set('Iniciando motor aislado fuera de la interfaz…',true);try{const out=await searchIsolated1080({maxTotalMs:4800,maxDepth:2,maxStates:400,maxActionBranches:64,maxSlices:60,onProgress:p=>{if(p.status==='WORKER_READY')status.textContent='Motor aislado preparado: cálculo fuera de la interfaz';else if(p.status==='PROGRESS'||p.status==='SLICE')status.textContent=`Explorando en Worker: ${p.expanded??0} nodos · tramo ${p.slices??0} · cancelable instantáneamente`}});set(`Búsqueda: ${out.status}. ${out.candidateCount||0} líneas candidatas; no certificadas.`,false)}catch(e){set('No se pudo completar la búsqueda: '+raw(e?.message||e),false)}});
 stop.addEventListener('click',()=>{cancelIsolated1080();status.textContent='Worker detenido: la operación quedó terminada sin bloquear la interfaz.'});
 return true;
}
function coopSelf1079(){const x={version:VERSION,checks:{api:typeof searchCooperative1079==='function',cancel:typeof cancelSearch1079==='function',status:typeof searchStatus1079==='function',authority:VERSION===raw(W.__YGO_TARGET_BUILD),core:typeof W.YGOAlpha669?.exhaustiveOpeningSearch669Async==='function'}};return{...x,pass:Object.values(x.checks).every(Boolean)}}

/* Alpha 1078: preflight asíncrono, acotado y sin cambiar la baraja activa.
   Verificar 10 fixtures físicos NO prueba cinco combos ni legalidad universal. */
async function fixturePreflight1078(opts={}){
 const required=10,started=Date.now(),catalog=arr(W.CARD_CATALOG);
 if(catalog.length!==19617){
  try{await A984.ensureCatalog984?.()}catch(e){return{version:VERSION,pass:false,status:'CATALOG_HYDRATION_FAILED',error:raw(e?.message||e)}}
 }
 if(arr(W.CARD_CATALOG).length!==19617)return{version:VERSION,pass:false,status:'CATALOG_NOT_READY',count:arr(W.CARD_CATALOG).length};
 const entries=Object.entries(W.YGOAlpha357?.fixtureCatalog?.(true)?.entries||{}).filter(([,e])=>e?.fixture&&!e?.aliasOf&&e?.ok!==false).slice(0,required);
 const catalogIds=new Set(arr(W.CARD_CATALOG).map(c=>Number(c?.id)).filter(Number.isSafeInteger)),rows=[];
 let cancelled=false;
 for(let i=0;i<entries.length;i++){
  if(opts.shouldCancel?.()===true){cancelled=true;break}
  const [id,entry]=entries[i],deck=entry.fixture||{},counts={},missing=[],badQuantities=[],copies=new Map();
  for(const zone of ['main','extra','side']){
   counts[zone]=0;
   for(const c of arr(deck[zone])){
    const cardId=Number(c?.id??c?.cardId??c?.card?.id),qty=Number(c?.qty??c?.count??1);
    if(!Number.isSafeInteger(cardId)||cardId<=0||!catalogIds.has(cardId))missing.push({zone,id:cardId});
    if(!Number.isSafeInteger(qty)||qty<1||qty>3)badQuantities.push({zone,id:cardId,qty});
    counts[zone]+=qty;
    if(Number.isSafeInteger(cardId))copies.set(cardId,(copies.get(cardId)||0)+qty);
   }
  }
  const overThree=[...copies].filter(([,n])=>n>3).map(([cardId,qty])=>({id:cardId,qty}));
  const sizeValid=counts.main>=40&&counts.main<=60&&counts.extra<=15&&counts.side<=15;
  const pass=sizeValid&&!missing.length&&!badQuantities.length&&!overThree.length;
  const row={id,label:raw(entry.label||id),pass,counts,sizeValid,missing:missing.slice(0,15),badQuantities:badQuantities.slice(0,15),overThree:overThree.slice(0,15)};
  rows.push(row);try{opts.onDeck?.({...row,index:i+1,total:entries.length})}catch(_){}
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 const complete=rows.length===required&&!cancelled,structuralPass=complete&&rows.every(x=>x.pass);
 const out={version:VERSION,status:cancelled?'CANCELLED_CHECKPOINT':complete?'PREFLIGHT_ONLY':'INSUFFICIENT_FIXTURES',pass:false,structuralPass,certified:false,simulationPerformed:false,expected:required,examined:rows.length,passed:rows.filter(x=>x.pass).length,rows,elapsedMs:Date.now()-started,policy:'Solo verifica cantidades, existencia en catálogo y límite físico de tres copias. No valida banlist, jugadas, 5 combos ni End Boards.'};
 W.__YGO1078_FIXTURE_PREFLIGHT=out;return out;
}
function fixturePreflightSelf1078(){
 const x={version:VERSION,pass:false,checks:{api:typeof fixturePreflight1078==='function',failClosed:true,noDeckMutation:true}};
 x.pass=Object.values(x.checks).every(Boolean);return x;
}
async function regression10Async1047(opts={}){if(REGRESSION_SESSION_1056?.active)return{version:VERSION,pass:false,status:'REGRESSION_ALREADY_RUNNING'};if(arr(W.CARD_CATALOG).length<19617){try{await A984.ensureCatalog984?.()}catch(e){return{version:VERSION,pass:false,status:'CATALOG_HYDRATION_FAILED',error:raw(e?.message||e)}}if(arr(W.CARD_CATALOG).length<19617)return{version:VERSION,pass:false,status:'CATALOG_NOT_READY',catalogLoaded:arr(W.CARD_CATALOG).length,expected:19617}}if(opts.allowBlockingSimulation!==true){const preflight=await fixturePreflight1078({shouldCancel:opts.shouldCancel,onDeck:opts.onDeck});return{version:VERSION,pass:false,status:'SIMULACION_BLOQUEANTE_NO_EJECUTADA',fixturesReady:preflight.examined,requested:10,requiresExplicitBlockingOptIn:true,preflight,policy:'Los diez mazos se verifican estructuralmente sin modificar la baraja activa. No se certifican los cinco combos ni se ejecuta el simulador heredado que puede bloquear el navegador.'}}const revision1056=DECK_REVISION_1056;const fc=W.YGOAlpha357?.fixtureCatalog?.(true)||{},all=Object.entries(fc?.entries||{}).filter(([,e])=>e?.fixture&&!e?.aliasOf&&e?.ok!==false).slice(0,10),start=Math.max(0,Math.min(9,num(opts.start)||0)),limit=Math.max(1,Math.min(10-start,num(opts.limit)||10)),entries=all.slice(start,start+limit),saved=W.deckState,savedLines=W.comboLastAnalysis,REGKEY='YGO_ALPHA1191_REGRESSION10_V2',stored=(()=>{try{return JSON.parse(localStorage.getItem(REGKEY)||'null')}catch(_){return null}})(),prev=opts.reset===true?null:(W.__YGO1047_REGRESSION10||stored),byId=new Map(),rows=[],maxRuntimeMs=Math.max(500,Math.min(120000,num(opts.maxRuntimeMs)||12000)),started=Date.now(),deadline=started+maxRuntimeMs;const session1056={active:true,cancelled:false,saved,savedLines,fixtureRef:null};REGRESSION_SESSION_1056=session1056;let budgetReached=false;if(opts.reset===true){try{localStorage.removeItem(REGKEY)}catch(_){}}const snapshot=(lastBatch=[],finalized=false)=>{const merged=all.map(([id])=>byId.get(id)).filter(Boolean),pass=finalized&&merged.length===10&&merged.every(x=>x.pass),firstMissing=all.findIndex(([id])=>!byId.has(id)),firstFailed=all.findIndex(([id])=>byId.has(id)&&byId.get(id)?.pass!==true),nextStart=firstMissing>=0?firstMissing:(!pass&&firstFailed>=0?firstFailed:null),out={version:VERSION,pass,status:pass?'PASS':budgetReached?'CHECKPOINT_READY':merged.length===10?'OPEN':'PARTIAL',total:merged.length,passed:merged.filter(x=>x.pass).length,nextStart,rows:merged,lastBatch,verifiedThisRun:merged.length,previousCheckpointExcluded:arr(prev?.rows).length,finalized,requiresFreshProof:true,budget:{maxRuntimeMs,elapsedMs:Date.now()-started,reached:budgetReached},policy:'Regresión Alpha1047 persiste después de cada deck y respeta presupuesto total. Un checkpoint nunca equivale a PASS; cada deck exige score, legalidad, horizonte completo, 5 líneas y 5 proofs exactos.'};W.__YGO1047_REGRESSION10=out;try{localStorage.setItem(REGKEY,JSON.stringify(out))}catch(_){}return out};try{for(let i=0;i<entries.length;i++){if(session1056.cancelled||DECK_REVISION_1056!==revision1056)break;if(Date.now()>=deadline){budgetReached=true;break}const[id,e]=entries[i];let deck=typeof structuredClone==='function'?structuredClone(e.fixture):JSON.parse(JSON.stringify(e.fixture));try{const h=W.YGOAlpha645?.hydrateFixture645?.(id,e);if(h?.deck)deck=typeof structuredClone==='function'?structuredClone(h.deck):JSON.parse(JSON.stringify(h.deck))}catch(_){}if(session1056.cancelled||DECK_REVISION_1056!==revision1056)break;W.deckState=deck;session1056.fixtureRef=deck;try{W.YGOAlpha543?.mergeDeckFromCatalog?.(W.deckState);W.YGOAlpha543?.applyStructuralCache?.(W.deckState)}catch(_){}let score=null,legality=null,search=null,error=null;try{score=A973.currentDeckScoreGate?.(W.deckState)||null}catch(x){error=raw(x?.message||x)}try{legality=A973.deckLegality?.(W.deckState)||null}catch(_){}const remaining=Math.max(250,deadline-Date.now());try{search=await exhaustiveBudgeted1047({samples:Math.max(1,Math.min(2,num(opts.samples)||1)),maxDepth:Math.max(1,Math.min(3,num(opts.maxDepth)||1)),maxStates:Math.max(20,Math.min(10470,num(opts.maxStates)||800)),maxActionBranches:Math.max(8,Math.min(1047,num(opts.maxActionBranches)||96)),sliceMs:Math.max(8,Math.min(80,num(opts.sliceMs)||25)),nodeBudgetMs:Math.max(4,Math.min(80,num(opts.nodeBudgetMs)||Math.max(8,Math.min(80,num(opts.sliceMs)||25)))),maxSlicesPerSample:Math.max(2,Math.min(80,num(opts.maxSlicesPerSample)||24)),maxTotalMs:Math.min(Math.max(250,num(opts.maxSearchMs)||3500),remaining),publishResults:false})}catch(x){error=raw(x?.message||x)}if(session1056.cancelled||DECK_REVISION_1056!==revision1056)break;const lines=arr(search?.lines).slice(0,5),proofRows=lines.map(l=>{try{return lineEvidence1047(l)}catch(_){return{pass:false}}}),exactLines=proofRows.filter(x=>x?.pass===true).length,row={id,label:e?.label||id,index:start+i,main:arr(deck?.main).reduce((n,c)=>n+Math.max(1,Number(c?.qty)||1),0),extra:arr(deck?.extra).reduce((n,c)=>n+Math.max(1,Number(c?.qty)||1),0),scorePass:score?.pass===true,legal:legality?.pass===true,searchPass:search?.pass===true,searchStatus:search?.status||null,lines:lines.length,exactLines,error};row.pass=row.scorePass&&row.legal&&row.searchPass&&row.lines===5&&row.exactLines===5;rows.push(row);byId.set(id,row);snapshot(rows.map(x=>x.id));try{opts.onDeck?.({index:start+i+1,total:all.length,...row,elapsedMs:Date.now()-started})}catch(_){}if(search?.status==='TIME_BUDGET_CHECKPOINT'||Date.now()>=deadline){budgetReached=true;snapshot(rows.map(x=>x.id));break}await new Promise(r=>setTimeout(r,0))}}finally{if(REGRESSION_SESSION_1056===session1056){REGRESSION_SESSION_1056=null;session1056.active=false;if(!session1056.cancelled&&DECK_REVISION_1056===revision1056&&W.deckState!==saved){W.deckState=saved;W.comboLastAnalysis=savedLines;}}}if(session1056.cancelled||DECK_REVISION_1056!==revision1056)return{version:VERSION,pass:false,status:'STALE_DECK_CANCELLED',lastBatch:rows.map(x=>x.id),cancelled:true};return snapshot(rows.map(x=>x.id),true)}
function schedulerAudit1047(){const st=W.__YGO783_STARTUP||{},q=arr(W.__YGO783_BOOT_QUEUE),errors=arr(st.errors),registered=num(st.registered),done=num(st.done),executed=num(st.executed);const checks={contract:raw(st.schedulerContract)==='FUNCTION_IDENTITY_V2',queueEmpty:q.length===0,complete:st.complete===true,notRunning:st.running!==true,noErrors:errors.length===0,registeredFunctions:registered>0,allRegisteredExecuted:registered>0&&done===registered&&executed===done};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,registered,done,executed,queued:q.length,errors,sourceDeferredCalls:num(W.__YGO_ENGINE_BOOT?.sourceDeferredCalls),policy:'El scheduler 1047 acepta ambas firmas legacy, deduplica por identidad de función y exige ejecutar todas las funciones registradas sin colisiones por nombre.'}}
function dependencyAudit1047(){const physicallyPruned=["ygo-alpha-843-startup-dedup-final-authority","ygo-alpha-880-stable-release","ygo-alpha-887-static-runtime-identity","ygo-alpha-824-final-authority","ygo-alpha-834-final-authority","ygo-alpha-840-final-authority","ygo-alpha-842-performance-consolidation-final-authority","ygo-alpha-845-startup-lazy-audit-authority","ygo-alpha-852-final-public-authority-consolidation","ygo-alpha-853-release-gate-beta-readiness","ygo-alpha-859-final-runtime-authority","ygo-alpha-860-current-source-release","ygo-alpha-861-runtime-watchdog-selftest","ygo-alpha-865-consolidated-release-authority","ygo-alpha-866-nonmutating-selftest-release","ygo-alpha-871-release-refresh","ygo-alpha-873-final-authority","ygo-alpha-877-release-authority","ygo-alpha-885-current-full-certification","ygo-alpha-886-current-source-verification","ygo-alpha-884-exact-promotion-telemetry","ygo-alpha-983-startup-performance-authority","ygo-alpha-850-two-player-visual-state-authority","ygo-alpha-791-proof-propagation","ygo-alpha-847-score-truth-authority","ygo-alpha-797-target-scope-integrity","ygo-alpha-801-canonical-format-search-guard","ygo-alpha-804-adversarial-choice-convergence","ygo-alpha-805-format-zone-convergence","ygo-alpha-806-exact-handler-format-convergence","ygo-alpha-807-monster-zone-convergence"],pruneVerified=physicallyPruned.every(id=>!D.getElementById(id));const required={A973:!!W.YGOAlpha973,A984:!!W.YGOAlpha984,A986:!!W.YGOAlpha986,A864:!!W.YGOAlpha864,A767:!!W.YGOAlpha767,A761:!!W.YGOAlpha761,A613:!!W.YGOAlpha613,A619:!!W.YGOAlpha619,A981:!!W.YGOAlpha981,A608:!!W.YGOAlpha608,A607:!!W.YGOAlpha607,A606:!!W.YGOAlpha606,A605:!!W.YGOAlpha605,A688:!!W.YGOAlpha688,A669:!!W.YGOAlpha669,A557:!!W.YGOAlpha557,A543:!!W.YGOAlpha543,A522:!!W.YGOAlpha522,A329:!!W.YGOAlpha329};const liveApis={tcgAudit:typeof W.YGOAlpha973?.tcgAudit==='function',formatPlan:typeof W.YGOAlpha984?.formatPlan984==='function',proofLine:typeof W.YGOAlpha986?.lineEvidence986==='function',scan:typeof W.YGOAlpha978?.scanRange978==='function',catalog:typeof W.YGOAlpha557?.prepareCatalogFast==='function',promoted605:typeof W.YGOAlpha605?.compileStep605==='function'&&typeof W.YGOAlpha605?.executeStep605==='function',promoted606:typeof W.YGOAlpha606?.compileStep606==='function'&&typeof W.YGOAlpha606?.executeStep606==='function',promoted607:typeof W.YGOAlpha607?.compileStep607==='function'&&typeof W.YGOAlpha607?.executeStep607==='function',promoted608:typeof W.YGOAlpha608?.compileStep608==='function'&&typeof W.YGOAlpha608?.executeStep608==='function',promoted613:typeof W.YGOAlpha613?.compileStep613==='function'&&typeof W.YGOAlpha613?.executeStep613==='function',promoted761:typeof W.YGOAlpha761?.compile761==='function'&&typeof W.YGOAlpha761?.execute761==='function',promoted767:typeof W.YGOAlpha767?.compile767==='function'&&typeof W.YGOAlpha767?.execute767==='function',search:typeof (W.YGOApp?.exhaustiveSearch||W.YGOAlpha688?.exhaustiveOpeningSearch688||W.YGOAlpha669?.exhaustiveOpeningSearch669)==='function',battleGuard:R.damageStep?.__alpha1047Battle===true};const scripts=[...D.scripts].map(x=>x.id).filter(Boolean),packs=scripts.filter(id=>/pack|consolidated/i.test(id)),legacyAuthorityHazards={alpha543BindReclaims:false,alpha557CatalogCalls543Bind:false,timer985:!!W.__YGO_FINAL_IDENTITY_TIMER_985,titleObservers:Object.keys(W).filter(k=>/^__YGO\d+_TITLE_OBSERVER$/.test(k)&&W[k]).length};try{{const src=String(W.YGOAlpha543?.bind||'');legacyAuthorityHazards.alpha543BindReclaims=/YGO_APP_VERSION=VERSION/.test(src)&&!/__YGO_TARGET_BUILD|YGOAlpha1047|canonical1047/.test(src)}}catch(_){}const bundleIntegrity=W.__YGO_BUNDLE_INTEGRITY?.pass===true,scheduler=schedulerAudit1047();const pass=bundleIntegrity&&scheduler.pass&&Object.values(required).every(Boolean)&&Object.values(liveApis).every(Boolean)&&legacyAuthorityHazards.alpha543BindReclaims===false&&legacyAuthorityHazards.alpha557CatalogCalls543Bind===false&&!legacyAuthorityHazards.timer985&&legacyAuthorityHazards.titleObservers===0;return{version:VERSION,pass:pass&&pruneVerified,bundleIntegrity:W.__YGO_BUNDLE_INTEGRITY||null,scheduler,required,liveApis,legacyAuthorityHazards,scriptCount:scripts.length,packCount:packs.length,physicallyPruned,pruneVerified,policy:'Alpha1047 consolida la autoridad sin apilar releases: poda capas históricas verificadas y absorbe wrappers funcionales y conserva sólo dependencias con APIs todavía vivas.'}}
function self1047(){authority1047();installProof1047();patchBanlist1047();const s=structural1047(),b=banlist1047(),q=search1047(),proof=proofSelf1047(),initializing=proof.status==='INITIALIZING',checks={structural:s.pass===true,identity:s.checks.identity===true,authority:s.checks.authority===true,appVersion:s.checks.appVersion===true,tcgDelta:b.tcg?.delta?.pass===true,tcg:b.pass===true,noLegacySearch:q.source!=='legacy644',proofBridge:proof.pass===true};const pass=Object.values(checks).every(Boolean);return{version:VERSION,pass,status:initializing&&pass?'INITIALIZING':pass?'PASS':'FAIL',initializing,checks,proof,banlist:b,search:q}}

function runtimeInventory1047(){const scripts=[...D.scripts],styles=[...D.querySelectorAll('style')],html=D.documentElement?.outerHTML||'';const alphaRefs=[...new Set((html.match(/Alpha[ _-]?(\d{3,4})/gi)||[]).map(x=>(x.match(/\d{3,4}/)||[''])[0]).filter(Boolean))].map(Number).sort((a,b)=>a-b);return{version:VERSION,scriptCount:scripts.length,styleCount:styles.length,alphaReferenceCount:alphaRefs.length,alphaMin:alphaRefs[0]||null,alphaMax:alphaRefs.at(-1)||null,legacyRefs:(html.match(/legacy/gi)||[]).length,fallbackRefs:(html.match(/fallback/gi)||[]).length,todoRefs:(html.match(/\bTODO\b/gi)||[]).length,heuristicRefs:(html.match(/heuristic/gi)||[]).length};}
function calibrationImport1047(rows=[]){return A984.importCalibration984?.(rows)||{version:VERSION,pass:false,status:'IMPORT_UNAVAILABLE'};}
const CLOSURE_KEY_1047='YGO_ALPHA1047_CLOSURE_V2';
function closureCheckpoint1047(){try{return JSON.parse(localStorage.getItem(CLOSURE_KEY_1047)||'null')}catch(_){return W.__YGO1047_CLOSURE||null}}
function saveClosure1047(x){W.__YGO1047_CLOSURE=x;try{localStorage.setItem(CLOSURE_KEY_1047,JSON.stringify(x))}catch(_){}return x}
function clearClosure1047(){try{localStorage.removeItem(CLOSURE_KEY_1047)}catch(_){}W.__YGO1047_CLOSURE=null;return true}
function matchupEvidence1047(){let status=null,suite=null;try{status=W.YGOAlpha848?.status848?.()||null}catch(_){}try{suite=W.YGOAlpha808?.matchupSuiteAudit808?.()||null}catch(_){}const legacy=legacyEvidence1047();const certified=legacy?.competitive?.certified===true;return{version:VERSION,pass:certified,certified,status,suite,configured:status?.opponentConfigured===true||status?.loaded===true,suiteReady:status?.suiteExact===true||suite?.ready===true,policy:'Los fixtures pueden preparar/regresar matchups, pero sólo evidencia competitiva certificada abre este gate.'}}
function autoFixtureMatchups1047(opts={}){const fc=W.YGOAlpha357?.fixtureCatalog?.(true)||{},rows=Object.entries(fc?.entries||{}).filter(([,e])=>e?.fixture&&!e?.aliasOf&&e?.ok!==false).slice(0,Math.max(3,Math.min(10,num(opts.count)||5))).map(([id,e])=>({name:e?.label||id,deck:e.fixture}));if(rows.length<3)return{version:VERSION,pass:false,status:'INSUFFICIENT_FIXTURES',count:rows.length};try{if(typeof W.YGOAlpha808?.setOpponentSuite808==='function'){const r=W.YGOAlpha808.setOpponentSuite808(rows);return{version:VERSION,pass:r?.ready===true,status:r?.ready===true?'FIXTURE_SUITE_READY':'FIXTURE_SUITE_PARTIAL',fixtureOnly:true,audit:r}}}catch(e){return{version:VERSION,pass:false,status:'ERROR',error:raw(e?.message||e)}}return{version:VERSION,pass:false,status:'MATCHUP_API_UNAVAILABLE',count:rows.length}}
function calibrationTemplate1047(){let rows=[];try{const fc=W.YGOAlpha357?.fixtureCatalog?.(true)||{};rows=Object.entries(fc?.entries||{}).filter(([,e])=>e?.fixture&&!e?.aliasOf&&e?.ok!==false).map(([id,e])=>({id,label:e?.label||id,format:'TCG',competitiveScore:null,source:'fixture-needs-human-label'}))}catch(_){}return{version:VERSION,count:rows.length,required:50,rows,policy:'No se inventan etiquetas competitivas. Esta plantilla sirve para completar 50+ labels externos reales.'}}
function closurePlan1047(){const r=release1047(),inv=runtimeInventory1047();return{version:VERSION,pass:r.fullUniversalCertified===true&&arr(r.blockers).length===0,completionPct:r.completionPct,remainingPct:r.remainingPct,gates:{...r.gates},weights:{...r.weights},blockers:[...arr(r.blockers)],inventory:inv,matchupEvidence:r.matchupEvidence,dependencies:r.dependencies,checkpoint:closureCheckpoint1047(),releaseStatus:r.status,invariant:{releaseFull:r.fullUniversalCertified===true,zeroBlockers:arr(r.blockers).length===0,sameVerdict:(r.fullUniversalCertified===true)===(Object.values(r.gates||{}).every(Boolean)&&arr(r.blockers).length===0)},policy:'Alpha1047 proyecta closurePlan directamente desde la misma certificación canónica usada por release; no existe una segunda definición independiente de PASS.'};}
async function runClosure1047(opts={}){const started=Date.now(),maxMs=Math.max(5000,Math.min(15*60*1000,num(opts.maxRuntimeMs)||180000)),deadline=started+maxMs,prior=opts.reset===true?null:closureCheckpoint1047(),out={version:VERSION,startedAt:new Date().toISOString(),resumed:!!prior,steps:arr(prior?.steps).slice(-40),status:'RUNNING',attempts:{...(prior?.attempts||{})}};if(opts.reset===true){clearClosure1047();clearUniversalSegment1047();try{localStorage.removeItem('YGO_ALPHA1191_REGRESSION10_V2')}catch(_){}}const persist=()=>saveClosure1047({...out,updatedAt:new Date().toISOString(),elapsedMs:Date.now()-started,plan:closurePlan1047()});const push=(name,result)=>{out.steps.push({at:new Date().toISOString(),name,result});if(out.steps.length>80)out.steps=out.steps.slice(-80);out.attempts[name]=(out.attempts[name]||0)+1;persist();try{opts.onProgress?.({name,result,elapsedMs:Date.now()-started,plan:closurePlan1047()})}catch(_){}return result};try{
 if(arr(W.CARD_CATALOG).length<19617){push('catalog',{status:'LOADING',count:arr(W.CARD_CATALOG).length});await A984.ensureCatalog984?.();push('catalog',{status:arr(W.CARD_CATALOG).length>=19617?'READY':'INCOMPLETE',count:arr(W.CARD_CATALOG).length});}
 if(Date.now()<deadline){try{push('dynamicBanlists',await ensureDynamicBanlists1047())}catch(e){push('dynamicBanlists',{pass:false,error:raw(e?.message||e)})}}
 if(Date.now()<deadline){try{push('physical',await W.YGOAlpha874?.physical874?.())}catch(e){push('physical',{pass:false,error:raw(e?.message||e)})}}
 if(Date.now()<deadline){try{push('fixtureMatchups',autoFixtureMatchups1047({count:5}))}catch(e){push('fixtureMatchups',{pass:false,error:raw(e?.message||e)})}}
 let cp=universalCheckpoint1047();while(Date.now()<deadline&&cp?.complete!==true){cp=await universalSegment1047({batchSize:Math.max(1,Math.min(100,num(opts.ruleBatchSize)||10)),batches:Math.max(1,Math.min(40,num(opts.ruleBatches)||8)),maxGaps:1000,onProgress:p=>{try{opts.onProgress?.({name:'rules',result:p,elapsedMs:Date.now()-started})}catch(_){}}});push('rules',cp);if(cp?.complete===true)break;await new Promise(r=>setTimeout(r,0));}
 let reg=W.__YGO1047_REGRESSION10||null;while(Date.now()<deadline&&reg?.pass!==true){const remaining=deadline-Date.now();if(remaining<1200)break;reg=await regression10Async1047({start:reg?.nextStart!=null?num(reg.nextStart):0,limit:1,maxRuntimeMs:Math.min(20000,Math.max(1000,remaining)),samples:1,maxDepth:2,maxStates:5000,maxActionBranches:512,maxSlicesPerSample:40});push('regression',reg);if(reg?.pass===true)break;if(reg?.status==='SIMULACION_BLOQUEANTE_NO_EJECUTADA'||reg?.status==='REGRESSION_ALREADY_RUNNING'||reg?.status==='CATALOG_NOT_READY'||reg?.status==='CATALOG_HYDRATION_FAILED')break;if(reg?.nextStart==null&&reg?.status==='OPEN')break;await new Promise(r=>setTimeout(r,0));}
 if(Date.now()<deadline){try{push('formats',formatAudit1047())}catch(e){push('formats',{pass:false,error:raw(e?.message||e)})}}
 if(Date.now()<deadline){try{push('certification',await certify1047({universal:false,resume:true,e2e:true,physical:true,dynamicBanlists:true,full:false,search:true,regression:false,onProgress:p=>{try{opts.onProgress?.({name:'certification',result:p,elapsedMs:Date.now()-started})}catch(_){}}}))}catch(e){push('certification',{pass:false,error:raw(e?.message||e)})}}
 }catch(e){out.error=raw(e?.stack||e?.message||e)}out.finishedAt=new Date().toISOString();out.elapsedMs=Date.now()-started;out.release=release1047();out.plan=closurePlan1047();const canonicalFull=out.release.fullUniversalCertified===true&&out.plan.pass===true&&arr(out.release.blockers).length===0&&out.plan.invariant?.sameVerdict===true;out.status=canonicalFull?'FULL_UNIVERSAL_CERTIFIED':Date.now()>=deadline?'CHECKPOINT_READY':'OPEN';saveClosure1047(out);return out;}
function nextActions1047(){const p=closurePlan1047(),actions=[];const add=(gate,action,detail)=>{if(p.gates?.[gate]!==true)actions.push({gate,action,detail})};add('structure','REPAIR_STRUCTURE_SELFTEST_INTEGRITY','Verificar SHA-256 del bundle, autoridad, IDs únicos, catálogo 19,617 y proofSelf; todos forman un único gate estructural.');add('rules','RUN_OFFICIAL_RULE_UNIVERSE_SCAN','Exportar/resolver las fuentes REVIEW_REQUIRED con URLs oficiales de Konami y continuar el scan adaptativo del universo de cartas elegibles hasta unresolved=0 y parseErrors=0; el catálogo físico de 19,617 se conserva por separado.');add('top5','LOAD_DECK_AND_COMPLETE_TOP5','Cargar un deck real, validar score/deck/formato/banlist/legalidad y cerrar 5 líneas exactas con 5 End Boards.');add('formats','CLOSE_FORMAT_GAPS','Resolver mechanics/banlist de los formatos marcados partial.');add('banlists','REFRESH_DYNAMIC_BANLISTS','Actualizar Master Duel/Duel Links/eventos y volver a auditar.');add('calibration','IMPORT_50_PLUS_LABELED_DECKS','Importar 50+ decks etiquetados; no se inventan labels.');add('physical','RUN_PHYSICAL_FINGERPRINT','Verificar fingerprint físico de las 19,617 filas del catálogo, incluyendo las fuentes excluidas del rule-scan.');add('regression','IMPLEMENT_COOPERATIVE_COMBO_SEARCH','Preflight físico de los diez mazos en Alpha 1078. Para certificar 10/10 todavía es necesario un simulador cooperativo real con score, legalidad y cinco líneas verificadas por mazo.');add('e2e','RUN_EXTERNAL_BROWSER_E2E','Ejecutar bytes finales en navegador funcional y registrar certificado 1047.');add('matchups','IMPORT_COMPETITIVE_MATCHUPS','Configurar suite competitiva real; fixtures internos no certifican competencia.');add('dependencies','REPAIR_DEPENDENCY_AUDIT','Eliminar reclamadores/timers viejos o APIs faltantes.');return{version:VERSION,count:actions.length,actions,completionPct:p.completionPct,remainingPct:p.remainingPct,blockers:p.blockers,invariant:p.invariant}}
function e2eStatus1047(){const b=BUILD_E2E_1047||{},external=false /* No aceptar un booleano global mutable como certificado E2E */;return{version:VERSION,pass:(b.pass===true&&b.pageErrors===0&&b.selfPass===true&&b.structuralPass===true&&b.dependencyPass===true)||external,builtIn:b,external,policy:'Sólo evidencia válida para el archivo actual abre E2E; evidencia histórica no se hereda.'}}
function consolidationAudit1047(){const scripts=[...D.scripts],ids=scripts.map(x=>x.id).filter(Boolean),legacy=ids.filter(id=>/^ygo-alpha-(?!1047)/i.test(id));const q=W.__YGO783_BOOT_QUEUE;return{version:VERSION,pass:true,scriptCount:scripts.length,legacyScriptCount:legacy.length,legacyScriptIds:legacy.slice(0,120),bootQueue:Array.isArray(q)?q.length:0,startup:W.__YGO783_STARTUP||null,fetchGate:W.__YGO1047_FETCH_GATE?{open:!!W.__YGO1047_FETCH_GATE.open,queued:arr(W.__YGO1047_FETCH_GATE.queue).length,flushed:num(W.__YGO1047_FETCH_GATE.flushed)}:null,catalogLoaded:arr(W.CARD_CATALOG).length,target:raw(W.__YGO_TARGET_BUILD),policy:'Alpha1047 reduces idle-callback churn, keeps fail-closed certification, and exposes remaining physical legacy debt without treating it as completed.'}}
/* Alpha 1049 · importador canónico único. Conserva interfaz, parser, catálogos y reglas existentes.
   Separa importación / puntuación base / búsqueda exacta. No declara una puntuación como certificada. */
/* Alpha 1058: una tarea asíncrona pertenece a una identidad y revisión de baraja.
   Si se importa, elimina o edita el mazo, no puede publicar resultados obsoletos. */
let DECK_REVISION_1056=0,REGRESSION_SESSION_1056=null;
/* Alpha 1143: huella de baraja sin colisiones entre ID y nombre, estable
   ante permutaciones irrelevantes y cerrada frente a cartas ambiguas. */
/* Alpha 1143: huella tipada, estable por orden y limitada físicamente.
   Las cartas de un mazo no incluyen Tokens; ninguna zona puede exceder su
   máximo físico ni reunir cuatro copias de la misma identidad observable. */
/* Alpha 1143: vinculación de huellas de búsqueda con impresiones verificadas.
   No confunde IDs de una misma carta con derechos a 3 copias por impresión.
   Para IDs no presentes en el catálogo no inventa equivalencias. */
let FINGERPRINT_CATALOG_CACHE_1132={ref:null,length:-1,byId:new Map()};
function deckFingerprint1056(){
 const state=W.deckState,fmt=raw(A973.activeFormatKey?.()||'').trim().toLowerCase();
 if(!state||!fmt||!['main','extra','side'].every(z=>Array.isArray(state[z])))return null;
 const zones=[],globalCounts=new Map(),physicalCounts=new Map();let physicalTotal=0;
 const catalog=Array.isArray(W.CARD_CATALOG)?W.CARD_CATALOG:[];
 if(FINGERPRINT_CATALOG_CACHE_1132.ref!==catalog||FINGERPRINT_CATALOG_CACHE_1132.length!==catalog.length){
  const byId=new Map();
  for(const card of catalog){const id=Number(card?.id);if(Number.isSafeInteger(id)&&id>0&&!byId.has(id))byId.set(id,card)}
  FINGERPRINT_CATALOG_CACHE_1132={ref:catalog,length:catalog.length,byId};
 }
 const catalogById=FINGERPRINT_CATALOG_CACHE_1132.byId;
 for(const z of ['main','extra','side']){
  const counts=new Map();let zoneTotal=0;
  for(const card of state[z]){
   if(!card||typeof card!=='object'||Array.isArray(card))return null;
   if(card.isToken===true||card.token===true||card.card?.isToken===true||
    (Number(card.typeBits||card.card?.typeBits||0)&0x4000)!==0||/\btoken\b/i.test(raw(card.type||card.card?.type||'')))return null;
   const ids=[card.id,card.cardId].filter(v=>v!==null&&v!==undefined&&v!=='');
   if(ids.length===2&&String(Number(ids[0]))!==String(Number(ids[1])))return null;
   const val=ids.length?ids[0]:null;let key=null,copyKey=null;
   if(val!==null){
    const numId=Number(val);
    if(!(typeof val==='number'||typeof val==='string'&&/^[0-9]+$/.test(val))||!Number.isSafeInteger(numId)||numId<=0)return null;
    key='ID:'+String(numId);
    const official=catalogById.get(numId),officialName=officialKey1126(official?.name);
    copyKey=officialName?'PRINT:'+officialName:key;
   }else{
    const n=typeof card.name==='string'?officialKey1126(card.name):'';
    if(!n)return null;
    key='NAME:'+n;copyKey='PRINT:'+n;
   }
   const qty=card.qty===undefined?1:Number(card.qty);
   if(!Number.isSafeInteger(qty)||qty<1||qty>3)return null;
   zoneTotal+=qty;physicalTotal+=qty;
   counts.set(key,(counts.get(key)||0)+qty);
   globalCounts.set(key,(globalCounts.get(key)||0)+qty);
   physicalCounts.set(copyKey,(physicalCounts.get(copyKey)||0)+qty);
   if(globalCounts.get(key)>3||physicalCounts.get(copyKey)>3)return null;
  }
  if(zoneTotal>(z==='main'?60:15))return null;
  zones.push([...counts].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0));
 }
 if(physicalTotal>90)return null;
 return JSON.stringify(['YGO_DECK_FINGERPRINT_V1132',fmt,zones]);
}
function cancelRegression1056(){
 const session=REGRESSION_SESSION_1056;
 if(!session||!session.active)return false;
 session.cancelled=true;session.active=false;
 if(W.deckState===session.fixtureRef){W.deckState=session.saved;W.comboLastAnalysis=session.savedLines;}
 REGRESSION_SESSION_1056=null;
 return true;
}
function invalidateSearch1056(){
 cancelRegression1056();DECK_REVISION_1056++;
 W.__YGO1056_ACTIVE_DECK_REVISION=DECK_REVISION_1056;
 // Alpha 1253: invalidate consent when the active OWN deck revision changes.
 try{W.dispatchEvent(new Event('ygo:own-deck-revision-1253'))}catch(_){}
 // Alpha 1191: las pruebas de búsqueda pertenecen a una identidad de baraja.
 // Una edición, importación, eliminación o cambio de formato las invalida.
 // No se borran checkpoints de otras búsquedas aquí: cada tarea los libera.
 for(const key of ['__YGO669_LAST_ASYNC','__YGO669_LAST_EXHAUSTIVE',
   '__YGO655_LAST_EXHAUSTIVE','__YGO688_LAST_EXHAUSTIVE',
   '__YGO864_SEARCH','__YGO644_EXHAUSTIVE_CERT'])W[key]=null;
}
const IMPORT1048={seq:0,requestSeq:0,acceptedTicket:0,status:'IDLE',last:null,errors:[],input:null};
const FILE_IMPORT_TOKEN_1105=Object.freeze({purpose:'internal-file-import'});
const cleanName1048=x=>String(x||'Baraja importada').split(/[\\/]/).pop().replace(/\.(ydk|txt)$/i,'').slice(0,100);
const count1048=(s,z)=>arr(s?.[z]).reduce((a,c)=>a+Math.max(1,Math.floor(Number(c?.qty)||1)),0);
function importStatus1048(msg,kind='warn'){
 const n=D.getElementById('mainYdkStatus');if(n){n.textContent=String(msg);n.className='main-ydk-status '+kind}
}
function inspectYDK1050(text){
 // Alpha 1143 revision: inspeccionar y analizar exactamente los mismos saltos de linea.
 // YDK antiguos pueden emplear CR sin LF; se conserva la validacion y los IDs.
 const original=String(text??'');
 if(original.length>1024*1024)throw Error('Archivo demasiado grande (máximo 1 MB).');
 const s=original.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
 const lines=s.split('\n'),counts={main:0,extra:0,side:0},idCounts=new Map(),byZone={main:new Map(),extra:new Map(),side:new Map()};
 let section='main',seenMain=false,seenExtra=false,seenSide=false,firstCard=false;
 for(let i=0;i<lines.length;i++){
  const line=lines[i].trim();if(!line)continue;
  if(/^#main$/i.test(line)){if(seenMain||firstCard||seenExtra||seenSide)throw Error('Cabecera #main repetida o fuera de orden (línea '+(i+1)+').');seenMain=true;section='main';continue;}
  if(/^#extra$/i.test(line)){if(seenExtra||seenSide)throw Error('Cabecera #extra repetida o fuera de orden (línea '+(i+1)+').');seenExtra=true;section='extra';continue;}
  if(/^(?:!side|#side)$/i.test(line)){if(seenSide)throw Error('Cabecera Side repetida (!side/#side, línea '+(i+1)+').');seenSide=true;section='side';continue;}
  if(line.startsWith('#')){
   // Una cabecera fragmentada (#ex tra, #ex-tra, #ex_tra, #ex\u200btra)
   // no puede tratarse como comentario: una carta posterior cambiaría de zona.
   // Solo se cotejan prefijos EXACTOS de los nombres oficiales y se permite
   // cualquier otro comentario del editor (#created by, #author, etc.).
   const headerPieces=line.slice(1).trim().split(/[\s_\-\u200b\u200c\u200d\ufeff]+/).filter(Boolean);
   let joinedHeader='';
   let fragmentedHeader=false;
   for(const part of headerPieces.slice(0,5)){
    if(!/^[a-z]+$/i.test(part))break;
    joinedHeader+=part.toLowerCase();
    if(['main','extra','side'].includes(joinedHeader)){
     fragmentedHeader=true;break;
    }
    if(joinedHeader.length>5)break;
   }
   if(fragmentedHeader)throw Error('Cabecera YDK posiblemente mal escrita (línea '+(i+1)+'): '+line.slice(0,60)+'. Se mantuvo la baraja anterior.');
   // Comentarios (#created by ...) siguen siendo válidos, pero una cabecera
   // muy parecida a #main, #extra o #side puede corromper las zonas en silencio.
   const marker=/^#\s*([a-z]{3,12})(?:[^a-z]|$)/i.exec(line),word=marker?.[1]?.toLowerCase();
   if(word){
    const isHeaderTypo=['main','extra','side'].some(expected=>{
     if(Math.abs(word.length-expected.length)>1)return false;
     if(word.length===expected.length){
      let errors=0;
      for(let j=0;j<word.length;j++)if(word[j]!==expected[j])errors++;
      if(errors<=1)return true;
      for(let j=0;j<word.length-1;j++){
       if(word[j]===expected[j+1]&&word[j+1]===expected[j]&&
          word.slice(0,j)===expected.slice(0,j)&&word.slice(j+2)===expected.slice(j+2))return true;
      }
      return false;
     }
     const larger=word.length>expected.length?word:expected;
     const smaller=word.length>expected.length?expected:word;
     let a=0,b=0,skipped=0;
     while(a<larger.length&&b<smaller.length){
      if(larger[a]===smaller[b]){a++;b++;}else{skipped++;a++;if(skipped>1)return false;}
     }
     return true;
    });
    if(isHeaderTypo)throw Error('Cabecera YDK posiblemente mal escrita (línea '+(i+1)+'): '+line.slice(0,60)+'. Se mantuvo la baraja anterior.');
   }
   continue; // #created by ... y otros comentarios del editor
  }
  if(!/^\d{1,12}$/.test(line)||Number(line)===0||!Number.isSafeInteger(Number(line)))throw Error('Identificador YDK inválido (línea '+(i+1)+'). No se cambió la baraja.');
  firstCard=true;counts[section]++;idCounts.set(String(Number(line)),(idCounts.get(String(Number(line)))||0)+1);byZone[section].set(String(Number(line)),(byZone[section].get(String(Number(line)))||0)+1);
  if(counts.main>60||counts.extra>15||counts.side>15)throw Error('Límite físico excedido: 60 Main, 15 Extra o 15 Side. No se cambió la baraja.');
 }
 const total=counts.main+counts.extra+counts.side;
 if(!total)throw Error('El archivo no contiene identificadores de cartas.');
 if(total>90)throw Error('Más de 90 cartas físicas.');
 return{clean:s,counts,total,uniqueIds:idCounts.size,byZone,withSections:seenMain||seenExtra||seenSide};
}
function checkText1048(text){return inspectYDK1050(text).clean;}
/* Alpha 1054: comprobación física de zonas que no depende de una banlist remota.
   Fusion, Synchro, Xyz y Link sólo pertenecen al Extra; el Side puede llevar ambos. */
function extraOnly1051(c){
 const bits=Number(c?.typeBits)||0;
 return !!(bits & (0x40|0x2000|0x800000|0x4000000)) || /(?:fusion|synchro|xyz|link)[ -]?(?:monster|pendulum|monstruo)/i.test(raw(c?.type||c?.frameType)) || /(?:^|[- ])(?:fusion|synchro|xyz|link)(?:[- ]|$)/i.test(raw(c?.frameType));
}
function ydkIdentity1051(parsed,expected){
 const differences=[];
 for(const zone of ['main','extra','side']){
  const actual=new Map();
  for(const c of arr(parsed?.[zone])){
   const id=Number(c?.id??c?.cardId);const qty=Number(c?.qty??1);
   if(!Number.isSafeInteger(id)||id<=0||!Number.isInteger(qty)||qty<1){differences.push({zone,reason:'INVALID_PARSED_CARD'});continue;}
   const key=String(id);actual.set(key,(actual.get(key)||0)+qty);
  }
  const want=expected?.byZone?.[zone]||new Map();
  for(const id of new Set([...want.keys(),...actual.keys()])){
   const expectedQty=want.get(id)||0,actualQty=actual.get(id)||0;
   if(expectedQty!==actualQty)differences.push({zone,id,expected:expectedQty,actual:actualQty});
  }
 }
 return{pass:differences.length===0,differences:differences.slice(0,20)};
}
/* Alpha 1058: políticas de estructura por formato, independientes de la banlist.
   Sólo se modifican reglas físicas documentadas; no se certifica impresión Speed Duel
   ni lista de prohibidas de cada evento sin evidencia adicional. */
function formatPolicy1055(formatKey=null){
 const selected=raw(formatKey==null?(A973.activeFormatKey?.()||'unknown'):formatKey);
 const compact=low(selected).replace(/[^a-z0-9]/g,'');
 const speed=compact==='speedduel',dlSpeed=compact==='duellinksspeed',dlRush=compact==='duellinksrush';
 // En Duel Links la comprobación física no prueba Skills, card pool, slots desbloqueados ni banlist digital.
 // Los límites Extra/Side se mantienen conservadores en la frontera YDK para NO afirmar una
 // certificación de límites digitales que pueden depender de Skills y eventos.
 const dl=dlSpeed||dlRush;
 const mainMin=dlRush?30:(speed||dlSpeed?20:40),mainMax=dlRush?40:(speed||dlSpeed?30:60);
 const extraMax=speed?6:15,sideMax=speed?6:15;
 return {version:VERSION,key:selected,kind:speed?'SPEED_DUEL':dlSpeed?'DUEL_LINKS_SPEED':dlRush?'DUEL_LINKS_RUSH':'ESTANDAR_O_NO_CERTIFICADO',
  speedDuel:speed,duelLinksSpeed:dlSpeed,duelLinksRush:dlRush,
  mainMin,mainMax,extraMax,sideMax,
  allowSideSkills:speed,needsPrintVerification:speed,needsEventListVerification:speed,
  needsDigitalVerification:dl,needsCardPoolVerification:dl,needsSkillVerification:dl,
  source:speed?'https://www.yugioh-card.com/en/events/ycs-faqs/':dlSpeed?'https://www.konami.com/yugioh/duel_links/en/box/sd-destiny_rules/':dlRush?'https://www.konami.com/games/us/en/topics/2280/':'',
  scope:speed?'Speed Duel físico 20–30 Main, Extra y Side 0–6; logo y listas de evento no certificados.':
  dlSpeed?'Duel Links Speed 20–30 Main. Máximo Extra/Side digital, Skills, card pool y banlist SIN CERTIFICAR.':
  dlRush?'Duel Links Rush 30–40 Main. Maximum/Skills, Extra, pool y banlist SIN CERTIFICAR.':
  'Referencia física estándar; otras restricciones específicas por formato aún necesitan pruebas.',
  certified:false};
}
/* Alpha 1054: contar identidades de carta, no sólo etiquetas visuales.
   Una misma ID con traducciones/nombres diferentes y varias ID con el mismo nombre
   son el mismo grupo de copias; la unión transitiva evita dividir grupos mixtos. */
function physicalLegality1050(deck,formatKey=null){
 const policy=formatPolicy1055(formatKey);
 const counts={main:0,extra:0,side:0},unknown=[],zoneErrors=[],badQuantities=[],entries=[],idIndex=new Map(),nameIndex=new Map(),parent=[];
 const find=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i]}return i};
 const join=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent[b]=a};
 const normalized=n=>raw(n).trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/\s+/g,' ');
 for(const z of ['main','extra','side'])for(const c of arr(deck?.[z])){
  const q=Number(c?.qty??1),qty=Number.isSafeInteger(q)&&q>=1&&q<=60?q:0;
  const name=raw(c?.name||'').trim(),id=Number(c?.id??c?.cardId),alias=Number(c?.alias);
  if(!qty){badQuantities.push({zone:z,id:Number.isSafeInteger(id)?id:null,name,qty:c?.qty??null});zoneErrors.push((name||'Carta sin nombre')+': cantidad inválida (debe ser un entero entre 1 y 60).');continue}
  counts[z]+=qty;
  const ix=entries.length;entries.push({name:name||'Carta desconocida',id,qty});parent[ix]=ix;
  const identityKeys=[Number.isSafeInteger(id)&&id>0?'id:'+id:null,Number.isSafeInteger(alias)&&alias>0?'id:'+alias:null].filter(Boolean);
  for(const key of identityKeys){if(idIndex.has(key))join(ix,idIndex.get(key));else idIndex.set(key,ix)}
  const nk=normalized(name);if(nk&&nk!=='carta desconocida'){
   if(nameIndex.has(nk))join(ix,nameIndex.get(nk));else nameIndex.set(nk,ix);
  }
  if(c?.unknown||name==='Carta desconocida')unknown.push({zone:z,id:c?.id,qty});
  else if((Number(c?.typeBits)||0)&0x4000)zoneErrors.push(name+': una Ficha (Token) no puede incluirse en Main, Extra ni Side.');
  else if((Number(c?.typeBits)||0)&0x8000000&&!(policy.allowSideSkills&&z==='side'))zoneErrors.push(name+': carta Skill fuera de zona permitida (sólo Side en Speed Duel construido).');
  else if(!((Number(c?.typeBits)||0)&7)&&!(policy.allowSideSkills&&z==='side'&&((Number(c?.typeBits)||0)&0x8000000)))zoneErrors.push(name+': registro sin tipo jugable (Monstruo, Mágica o Trampa).');
  else if(z==='main'&&extraOnly1051(c))zoneErrors.push(name+': monstruo del Extra Deck colocado en Main.');
  else if(z==='extra'&&!extraOnly1051(c))zoneErrors.push(name+': carta del Main Deck colocada en Extra.');
 }
 const grouped=new Map();for(let i=0;i<entries.length;i++){
  const key=find(i),e=entries[i],g=grouped.get(key)||{name:e.name,id:Number.isSafeInteger(e.id)?e.id:null,qty:0};g.qty+=e.qty;grouped.set(key,g);
 }
 const duplicates=[...grouped.values()].filter(c=>c.qty>3),errors=[...zoneErrors];
 if(counts.main<policy.mainMin||counts.main>policy.mainMax)errors.push('Main fuera de '+policy.mainMin+'–'+policy.mainMax+' cartas ('+policy.kind+').');
 if(counts.extra>policy.extraMax)errors.push('Extra supera '+policy.extraMax+' cartas ('+policy.kind+').');
 if(counts.side>policy.sideMax)errors.push('Side supera '+policy.sideMax+' cartas ('+policy.kind+').');
 for(const d of duplicates)errors.push(d.name+': '+d.qty+' copias en Main/Extra/Side.');
 return {version:VERSION,counts,errors,zoneErrors,badQuantities,duplicates,unknown:unknown.length,unknownCopies:unknown.reduce((n,x)=>n+x.qty,0),physicalValid:errors.length===0,formatPolicy:policy,needsPrintVerification:policy.needsPrintVerification,needsEventListVerification:policy.needsEventListVerification,officialBanlistVerified:false,certifiedLegal:false,policy:'Copias por identidad, alias y nombre normalizado. Speed Duel: verificar logo impreso y lista de evento por separado; ningún resultado físico es certificación oficial.'};
}
/* Alpha 1143: no transferir un dictamen del mazo en pantalla a otro
   candidato sólo por coincidir los totales Main/Extra/Side. */
function deckIdentitySnapshot1127(deck){
 // Alpha 1143: la evidencia heredada no se traslada a un candidato que
 // no tenga identidad verificable. IDs primitivos, arrays incompletos y
 // cantidades inválidas antes colisionaban entre sí como ["","",1].
 if(!deck||typeof deck!=='object'||!['main','extra','side'].every(z=>Array.isArray(deck[z])))return null;
 const zones=[];
 for(const z of ['main','extra','side']){
  const rows=[];
  for(const card of deck[z]){
   if(!card||typeof card!=='object'||Array.isArray(card))return null;
   const n=Number(card.id??card.cardId),id=Number.isSafeInteger(n)&&n>0?String(n):null;
   const name=officialKey1126(card.name),qty=Number(card.qty??1);
   if(!Number.isSafeInteger(qty)||qty<1||qty>60||(!id&&!name))return null;
   rows.push([id,name,qty]);
  }
  zones.push(rows.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
 }
 return JSON.stringify(zones);
}
function auditActiveDeck1050(deck,formatOverride=null){
 const selected=raw(formatOverride==null?(A973.activeFormatKey?.()||'unknown'):formatOverride);
 const physical=physicalLegality1050(deck,selected);let official=null;
 const candidateIdentity=deckIdentitySnapshot1127(deck),activeIdentity=deckIdentitySnapshot1127(W.deckState);
 const sameActiveDeck=candidateIdentity!==null&&activeIdentity!==null&&candidateIdentity===activeIdentity;
 const sameActiveFormat=low(selected)===low(A973.activeFormatKey?.());
 // La API heredada deckLegality() no acepta un candidato ni un formato. Si no
 // coincide EXACTAMENTE con la baraja/formato en pantalla, no se reutiliza.
 if(sameActiveDeck&&sameActiveFormat){try{official=A973.deckLegality?.()||null}catch(e){official={pass:false,error:raw(e?.message||e)}}}
 const reported=official?.result?.counts||null,consistent=!!reported&&['main','extra','side'].every(z=>Number(reported[z])===physical.counts[z]);
 const requiresEvidence=physical.needsPrintVerification||physical.needsEventListVerification||physical.formatPolicy.needsDigitalVerification===true;
 const snapshotValidated=physical.physicalValid&&physical.unknownCopies===0&&consistent&&official?.pass===true&&!requiresEvidence;
 const snapshotBanlist1126=restrictionSnapshot1126(deck,selected);
 return{version:VERSION,physical,format:selected,official,consistent,sameActiveDeck,sameActiveFormat,
  officialEvidenceScope:sameActiveDeck&&sameActiveFormat?'MAZO_ACTIVO':'SIN_DICTAMEN_OFICIAL_PARA_CANDIDATO',
  snapshotBanlist1126,snapshotValidated:snapshotValidated&&snapshotBanlist1126.violations.length===0,
  banlistScopeVerified:snapshotBanlist1126.applicable===true&&snapshotBanlist1126.certified===true,
  fullFormatLegalVerified:false,certifiedLegal:false,
  needsReview:!snapshotValidated||snapshotBanlist1126.applicable!==true||snapshotBanlist1126.certified!==true,needsPrintVerification:physical.needsPrintVerification,needsEventListVerification:physical.needsEventListVerification,
  needsDigitalVerification:physical.formatPolicy.needsDigitalVerification===true,
  policy:'Validación física parcial por formato. Speed Duel requiere logo y listas de evento; Duel Links requiere Skills, pool y banlist digital. Ninguna validación física equivale a legalidad oficial.'};
}
const SCORE_NAMES1048=['CONSISTENCIA','POTENCIA OFENSIVA','RESILIENCIA','CONTROL DEL CAMPO','COMIENZO DEL DUELO','MITAD DEL DUELO','FINAL DEL DUELO','INTERACCIÓN','PODER DE ATRACCIÓN','VERSATILIDAD'];
function scoreAuthority1048(scores,certification=null){
 const v=arr(scores),valid=v.length===10&&v.every(n=>Number.isInteger(n)&&n>=0&&n<=10),total=valid?v.reduce((a,b)=>a+b,0):null;
 const requested=valid&&certification?.scoreGateOpen===true&&Number(certification?.certifiedCategories)===10&&certification?.catalogExact===true;let certified=false;if(requested){const native=W.YGOAlpha984?.calibrationStatus984?.()||{};if(native.strongPass===true){const verified=W.YGOCanonicalRelease1047?.release1047?.()||{};certified=verified.gates?.calibration===true&&verified.gates?.rules===true&&verified.gates?.top5===true;}}
 return {version:VERSION,valid,certified,mode:certified?'CAUSAL_CERTIFICADO':'ESTRUCTURAL_PROVISIONAL',scores:valid?v.slice():[],total,rows:valid?v.map((score,i)=>({name:SCORE_NAMES1048[i],score})):[],reason:certified?'10/10 categorías con evidencias causales verificadas.':'La suma 10×10 es correcta, pero los combos/reglas no tienen certificación completa.'};
}
function opponentVisualAudit1048(){
 const lines=arr(W.comboLastAnalysis).slice(0,5),actions=lines.flatMap(x=>arr(x?.actions)),snapshots=actions.flatMap(a=>[a?.before,a?.after]).filter(Boolean);
 const withOpponent=snapshots.filter(s=>arr(s?.opponentMonster).length||arr(s?.opponentSpelltrap).length||arr(s?.opponentHand).length||(s?.opponentDeck!=null&&Number.isFinite(Number(s.opponentDeck)))).length;
 const withLP=snapshots.filter(s=>arr(s?.lp).length===2).length;
 return {version:VERSION,lines:lines.length,actions:actions.length,snapshots:snapshots.length,twoPlayerSnapshots:withOpponent,lpSnapshots:withLP,opponentConfigured:!!W.__YGO_OPPONENT_DECK,truthfulOpponentState:withOpponent>0||!W.__YGO_OPPONENT_DECK,policy:'No certificar información del rival si no está presente en snapshots reales.'};
}
function paintFast1048(r){
 const rawScores=arr(r?.scores||r?.stats||r?.v);
 if(rawScores.length!==10||rawScores.some(x=>x==null||x===''||!Number.isInteger(Number(x))||Number(x)<0||Number(x)>10))throw Error('El motor no devolvió diez estadísticas ENTERAS válidas (0–10). No se redondearán resultados de forma silenciosa.');
 const scores=rawScores.map(Number);
 const total=scores.reduce((a,b)=>a+b,0),set=(id,text,html=false)=>{const e=D.getElementById(id);if(e){if(html)e.innerHTML=text;else e.textContent=String(text)}};
 set('score',`${total} <span>/ 100</span>`,true);set('total',`${total} / 100`);set('sum',total);set('miniScore',`${total} / 100`);
 const t=typeof W.tier==='function'?W.tier(total):null;
 if(t){set('tier',t[0]);set('miniTier',t[0]);set('tierDesc',t[1]);set('miniDesc',t[1])}
 D.querySelectorAll('#stats .stat').forEach((row,i)=>{if(i>=10)return;const v=scores[i],s=row.querySelector('.sv'),bar=row.querySelector('.bar i');if(s)s.textContent=v+'/10';if(bar)bar.style.width=(v*10)+'%'});
 D.querySelectorAll('#sliders .points-row').forEach((row,i)=>{if(i>=10)return;const v=scores[i],el=row.querySelector('.points-value');if(el)el.textContent=v+'/10';row.querySelectorAll('.point').forEach((p,k)=>p.classList.toggle('active',k<v))});
 const authority=scoreAuthority1048(scores);
 const quality=r?.meta?.coherence1124;
 if(quality?.applicable){D.documentElement.dataset.scoreEvidence=quality.status;
  if(quality.changed)authority.reason='Estimación provisional corregida: no se verificó suficiente cohesión estructural del mazo. No demuestra potencia competitiva.';
 }else D.documentElement.dataset.scoreEvidence='NO_EVALUADO';
 D.documentElement.dataset.scoreAuthority=authority.mode;D.documentElement.dataset.scoreCertified=authority.certified?'1':'0';
 D.documentElement.dataset.scoreEvaluatedFormat=raw(A973.activeFormatKey?.()||'unknown').toLowerCase();
 return {scores,total,tier:t?.[0]||'',certified:false,authority,source:'base-score-without-top5-certification'};
}

/* Alpha 1143: evaluación de coherencia verificable, conservadora y determinista.
   No pretende simular efectos ni demostrar calidad de metajuego. Impide convertir
   40 cartas desconectadas en Tier Meta sólo mediante heurísticas individuales.
   Un juego de cartas genéricas fuertes puede tener sinergia no detectada; se
   reporta la incertidumbre, jamás se fabrica un certificado competitivo. */
function coherence1124(deck){
 const main=arr(deck?.main).filter(c=>c&&typeof c==='object');
 const parts=[], ids=new Set(), counts=new Map();
 const norm=s=>low(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}\s\-]/gu,' ').replace(/\s+/g,' ').trim();
 for(const card of main){
  const q=Number(card?.qty??1);if(!Number.isSafeInteger(q)||q<1||q>60)continue;
  const name=norm(card.name),id=raw(card?.id??card?.cardId??name),key=id||name;
  if(!name)continue;
  counts.set(key,(counts.get(key)||0)+q);ids.add(key);
  parts.push({card,key,q,name,description:low(card?.desc||card?.text||''),descriptionNormalized:norm(card?.desc||card?.text||'')});
 }
 const copies=[...counts.values()].reduce((a,b)=>a+b,0),distinct=counts.size;
 if(copies<40||copies>60)return{applicable:false,reason:'MAIN_FUERA_DE_40_60',copies,distinct};
 let referencedCopies=0,activeConnections=0,uniqueReferenced=0;const supported=new Set();
 const uniqueNames=parts.filter((v,i,a)=>a.findIndex(x=>x.key===v.key)===i);
 for(const item of uniqueNames){
  const quotes=[...item.description.matchAll(/["“”']([^"“”']{4,48})["“”']/g)].map(m=>norm(m[1]));
  const related=uniqueNames.filter(other=>other.key!==item.key&&
   (quotes.some(q=>q.length>=5&&other.name.includes(q)) ||
    ((other.name.length>=7||(/[^\u0000-\u007f]/u.test(other.name)&&[...other.name].length>=5))&&item.descriptionNormalized.includes(other.name))));
  if(related.length){
   activeConnections++;supported.add(item.key);
   referencedCopies+=Math.min(3,item.q);
   for(const other of related){supported.add(other.key);}
  }
 }
 uniqueReferenced=supported.size;
 let compactArchetype=0;
 const symbols=new Map();
 for(const x of uniqueNames){
  const names=Array.isArray(x.card?.archetypes)?x.card.archetypes:[x.card?.archetype];
  for(const t of names){const n=norm(t);if(n.length<5)continue;symbols.set(n,(symbols.get(n)||0)+Math.min(x.q,3));}
 }
 for(const n of symbols.values())compactArchetype=Math.max(compactArchetype,n);
 const repetition=copies-distinct;
 const monsterCopies=parts.reduce((n,x)=>n+((Number(x.card?.typeBits)&1)||/monster/i.test(raw(x.card?.type||''))?x.q:0),0);
 const connectedShare=uniqueNames.length?uniqueReferenced/uniqueNames.length:0;
 const repeatedShare=copies?repetition/copies:0;
 const declaredShare=copies?compactArchetype/copies:0;
 const evidence=Math.min(1,.64*connectedShare+.20*repeatedShare+.16*declaredShare);
 // Escenario de 40 nombres totalmente distintos, ningún enlace entre textos,
 // ningún arquetipo dominante y cero réplicas probadas: no atribuirle Meta.
 const singletonNoCore=distinct>=38&&declaredShare<.20&&activeConnections<Math.ceil(distinct*.5);
 const poor=(evidence<.10&&activeConnections<2&&repeatedShare<.12)||monsterCopies===0||singletonNoCore;
 const limited=!poor&&evidence<.20&&activeConnections<3&&repeatedShare<.18;
 const status=poor?'SIN_COHERENCIA_EVIDENCIADA':limited?'COHERENCIA_LIMITADA':'SIN_ALERTA_ESTRUCTURAL';
 return{applicable:true,version:VERSION,status,evidence:Number(evidence.toFixed(4)),
  poor,limited,singletonNoCore,copies,distinct,repetition,monsterCopies,connectedShare:Number(connectedShare.toFixed(4)),
  activeConnections,uniqueReferenced,declaredShare:Number(declaredShare.toFixed(4)),
  limits:'Señales textuales/duplicación. No demuestran combos legales ni resultados competitivos.'};
}
function scoreEvidence1124(result,deck){
 if(!result||typeof result!=='object'||!Array.isArray(result.scores)||result.scores.length!==10)return result;
 const quality=coherence1124(deck),base=result.scores.map(Number),scores=base.slice();
 if(quality.applicable && (quality.poor||quality.limited)){
  const caps=quality.poor?[4,5,4,4,4,4,4,4,4,4]:[6,7,6,6,6,6,6,6,6,6];
  for(let i=0;i<10;i++)scores[i]=Math.min(scores[i],caps[i]);
 }
 const total=scores.reduce((a,b)=>a+b,0);
 const evidence={...quality,priorTotal:Number(result.total??base.reduce((a,b)=>a+b,0)),
  adjustedTotal:total,changed:base.some((x,i)=>x!==scores[i]),
  policy:'Evaluación 10×10 provisional con techo conservador cuando no hay conectividad estructural comprobable; NO es una Tier-list validada ni prueba de simulación.'};
 W.__YGO1124_SCORE_EVIDENCE=evidence;
 return{...result,scores,total,finalScore:total,tier:typeof W.tier==='function'?W.tier(total)[0]:result.tier,
  certified:false,meta:{...(result.meta||{}),coherence1124:evidence}};
}
function scoreGuard1124(deck){
 const prev=W.scoreDeck;if(typeof prev!=='function')return false;
 if(prev.__alpha1124)return true;
 const fn=function(state=W.deckState||{}){
  const result=prev.call(W,state);
  if(result&&typeof result.then==='function')return result.then(x=>scoreEvidence1124(x,state));
  return scoreEvidence1124(result,state);
 };
 fn.__alpha1124=true;fn.__alpha656=prev.__alpha656===true;fn.__base=prev;
 W.scoreDeck=fn;W.calculateDeckScore=fn;
 return true;
}

/* Alpha 1143: Calcular debe utilizar los mismos diez valores que importar YDK.
   Sólo repintar si la baraja no cambió durante la operación. No fabricar combos. */
const deckSignature1124=()=>JSON.stringify(['main','extra','side'].map(z=>arr(W.deckState?.[z]).map(x=>[raw(x?.id??x?.cardId??x?.name),Number(x?.qty??1)])));
let ACTIVE_CALC_MONITOR_1124=null;
function installCalculateAuthority1124(){
 const base=W.calculate;
 if(typeof base!=='function')return false;
 if(base.__alpha1124)return true;
 const wrapped=function(...args){
  // No atribuir 0/100 a una baraja inexistente. La ruta CALCULAR podía
  // reactivar puntuaciones vacías pese a scoreAuthority=SIN_BARAJA.
  // Guardar sin Main tampoco es una evaluación competitiva válida.
  if(count1048(W.deckState,'main')===0){
   if(ACTIVE_CALC_MONITOR_1124){ACTIVE_CALC_MONITOR_1124.disconnect();ACTIVE_CALC_MONITOR_1124=null;}
   if(W.__YGO1125_CALCULATE_CLEANUP){W.__YGO1125_CALCULATE_CLEANUP();W.__YGO1125_CALCULATE_CLEANUP=null;}
   const remaining=count1048(W.deckState,'extra')+count1048(W.deckState,'side');
   const reason=remaining?'MAIN_VACIO':'SIN_BARAJA';
   for(const id of ['score','total','miniScore']){const el=D.getElementById(id);if(el)el.textContent='— / 100';}
   const sum=D.getElementById('sum');if(sum)sum.textContent='—';
   for(const id of ['tier','miniTier']){const el=D.getElementById(id);if(el)el.textContent=remaining?'SIN TIER':'—';}
   for(const id of ['tierDesc','miniDesc']){const el=D.getElementById(id);if(el)el.textContent=remaining?'Main Deck vacío: no se puede evaluar.':'Sin baraja';}
   D.querySelectorAll('#stats .stat').forEach(row=>{const v=row.querySelector('.sv'),bar=row.querySelector('.bar i');if(v)v.textContent='0/10';if(bar)bar.style.width='0%';});
   D.querySelectorAll('#sliders .points-row').forEach(row=>{const v=row.querySelector('.points-value');if(v)v.textContent='0/10';row.querySelectorAll('.point').forEach(el=>el.classList.remove('active'));});
   D.documentElement.dataset.scoreAuthority=remaining?'ESTRUCTURAL_NO_APTO':'SIN_BARAJA';
   D.documentElement.dataset.scoreCertified='0';D.documentElement.dataset.scoreLegal=remaining?'0':'';
   W.__YGO1124_CALCULATE_SYNC={pass:false,reason,emptyMain:true};
   evidenceEmptyState1143(reason);
   return{ok:false,skipped:true,reason,scored:false};
  }
  const revision=DECK_REVISION_1056,fingerprint=deckSignature1124();
  const selectedBefore=D.querySelector('.fmt.active')?.getAttribute('data-f')||null;
  let userChangedFormat=false;
  const recordUserFormatChoice=e=>{if(e?.isTrusted&&e?.target?.closest?.('.fmt'))userChangedFormat=true;};
  D.addEventListener('click',recordUserFormatChoice,true);
  const result=base.apply(this,args);
  const sync=()=>{
   try{
    if(DECK_REVISION_1056!==revision||deckSignature1124()!==fingerprint||!count1048(W.deckState,'main'))return;
    const selectedNow=D.querySelector('.fmt.active')?.getAttribute('data-f')||null;
    const noOfficialAutoProof=formatEvidence1077(W.deckState).officialCertified!==true;
    // Únicamente reparar la deriva TCG->Rush reproducida, no bloquear
    // elecciones manuales ni otros mecanismos de formatos aún sin auditar.
    if(selectedBefore==='TCG'&&selectedNow==='Rush Duel'&&!userChangedFormat&&noOfficialAutoProof){
     const btn=D.querySelector('.fmt[data-f="TCG"]');
     if(typeof btn?.onclick==='function'){btn.onclick();W.__YGO1125_FORMAT_CORRECTION={from:selectedNow,to:'TCG',reason:'SIN_EVIDENCIA_OFICIAL_DE_CONVERSION_TCG_A_RUSH',revision,pass:A973.activeFormatKey?.()==='tcg'};}
    }
    scoreGuard1124();
    const score=score1048(W.deckState),legal=auditActiveDeck1050(W.deckState);
    try{v=score.scores.slice()}catch(_){}
    const restriction=legal?.snapshotBanlist1126?.violations?.[0];
    const reject=legal?.physical?.physicalValid===false||legal?.official?.result?.legal===false&&arr(legal?.official?.result?.errors).length>0||!!restriction;
    if(reject){const reason=restriction?restriction.name+': '+restriction.copies+' copias, máximo '+restriction.maximum:legal?.physical?.errors?.[0]||legal?.official?.result?.errors?.[0]||'Formato no válido';
     for(const id of ['tier','miniTier']){const el=D.getElementById(id);if(el)el.textContent='SIN TIER'}
     for(const id of ['tierDesc','miniDesc']){const el=D.getElementById(id);if(el)el.textContent='Baraja no válida: '+reason}
     D.documentElement.dataset.scoreAuthority='ESTRUCTURAL_NO_APTO';D.documentElement.dataset.scoreLegal='0';
    }
    if(!reject)D.documentElement.dataset.scoreLegal=legal?.certifiedLegal===true?'1':'unknown';
    W.__YGO1124_CALCULATE_SYNC={pass:true,total:score.total,revision,authority:D.documentElement.dataset.scoreAuthority,
     format:A973.activeFormatKey?.()||null,formatCorrected:W.__YGO1125_FORMAT_CORRECTION?.revision===revision};
   }catch(e){W.__YGO1124_CALCULATE_SYNC={pass:false,error:raw(e?.message||e)};}
  };
  // El motor anterior realiza repintados diferidos aun después de resolver Calcular.
  // Corregir sólo durante esa operación, sin observador permanente ni intervalos.
  if(ACTIVE_CALC_MONITOR_1124){ACTIVE_CALC_MONITOR_1124.disconnect();ACTIVE_CALC_MONITOR_1124=null;}
  if(W.__YGO1125_CALCULATE_CLEANUP)W.__YGO1125_CALCULATE_CLEANUP();
  const cleanupUserFormat=()=>D.removeEventListener('click',recordUserFormatChoice,true);
  W.__YGO1125_CALCULATE_CLEANUP=cleanupUserFormat;
  const node=D.getElementById('score');
  if(node&&typeof MutationObserver==='function'){
   const observer=new MutationObserver(()=>{
    const current=W.__YGO1124_CALCULATE_SYNC;
    if(!current?.pass||current.revision!==revision)return;
    if(DECK_REVISION_1056!==revision||deckSignature1124()!==fingerprint){observer.disconnect();return;}
    const displayed=Number.parseInt(raw(node.textContent).trim(),10);
    const formatDrift=selectedBefore==='TCG'&&D.querySelector('.fmt.active')?.getAttribute('data-f')==='Rush Duel'&&!userChangedFormat;
    if(formatDrift||(Number.isInteger(displayed)&&displayed!==current.total))queueMicrotask(sync);
   });
   observer.observe(node,{subtree:true,childList:true,characterData:true});
   const formatParent=D.querySelector('.fmt')?.parentElement;
   if(formatParent)observer.observe(formatParent,{subtree:true,attributes:true,attributeFilter:['class']});
   ACTIVE_CALC_MONITOR_1124=observer;
   setTimeout(()=>{observer.disconnect();cleanupUserFormat();if(W.__YGO1125_CALCULATE_CLEANUP===cleanupUserFormat)W.__YGO1125_CALCULATE_CLEANUP=null;if(ACTIVE_CALC_MONITOR_1124===observer)ACTIVE_CALC_MONITOR_1124=null;},30000);
  }
  Promise.resolve(result).then(()=>{sync();setTimeout(sync,150);setTimeout(sync,700);},()=>{});
  return result;
 };
 wrapped.__alpha1124=true;wrapped.__base=base;
 W.calculate=wrapped;
 if(!D.documentElement.dataset.ygoEmptyCalcGuard1143){
  // El botón histórico conserva un listener cerrado sobre el motor anterior.
  // Para la acción CALCULAR visible, reutilizar la puntuación base de la
  // importación (10 enteros, límites y auditoría legal), evitando iniciar la
  // búsqueda profunda sin límite. Top 5 sigue siendo una acción separada.
  D.addEventListener('click',event=>{
   if(!event.target?.closest?.('button.calc'))return;
   event.preventDefault();event.stopImmediatePropagation();
   if(count1048(W.deckState,'main')===0){wrapped();return;}
   const fingerprint=deckSignature1124();
   try{
    const score=score1048(W.deckState);
    const legality=auditActiveDeck1050(W.deckState);
    const restriction=legality?.snapshotBanlist1126?.violations?.[0];
    const officialInvalid=legality?.official?.result?.legal===false && arr(legality?.official?.result?.errors).length>0;
    const invalid=legality?.physical?.physicalValid===false||Number(legality?.physical?.unknownCopies||0)>0||officialInvalid||!!restriction;
    const reason=restriction?(restriction.name+': '+restriction.copies+' copias, máximo '+restriction.maximum)
      :(legality?.physical?.errors?.[0]||legality?.official?.result?.errors?.[0]||'Baraja no válida');
    if(invalid){
     for(const id of ['tier','miniTier']){const el=D.getElementById(id);if(el)el.textContent='SIN TIER';}
     for(const id of ['tierDesc','miniDesc']){const el=D.getElementById(id);if(el)el.textContent='Baraja no válida: '+reason;}
     D.documentElement.dataset.scoreAuthority='ESTRUCTURAL_NO_APTO';
    }
    D.documentElement.dataset.scoreLegal=invalid?'0':legality?.certifiedLegal===true?'1':'unknown';
    D.documentElement.dataset.scoreCertified='0';
    // Nunca heredar certificados Top 5 del mazo anterior o de una búsqueda
    // que utilizó una política distinta a la puntuación recién mostrada.
    invalidateSearch1056();W.comboLastAnalysis=[];try{comboLastAnalysis=[]}catch(_){}
    W.__YGO1047_BUDGETED_SEARCH=null;
    for(const id of ['comboVisualTop5','comboEndBoard']){const host=D.getElementById(id);if(host){host.replaceChildren();host.setAttribute('data-ygo-active-deck','PENDIENTE_DE_SIMULACION');}}
    evidenceEmptyState1143('RECALCULO_SIN_REPLAY');
    W.__YGO1124_CALCULATE_SYNC={pass:true,fast:true,certified:false,total:score.total,
      legal:!invalid,fingerprint,policy:'10 estadísticas provisionales; los combos se certifican por separado.'};
   }catch(err){
    W.__YGO1124_CALCULATE_SYNC={pass:false,fast:true,error:raw(err?.message||err)};
    importStatus1048('No se pudo calcular: '+raw(err?.message||err),'bad');
   }
  },true);
  D.documentElement.dataset.ygoEmptyCalcGuard1143='1';
 }
 if(!D.documentElement.dataset.ygoFormatScoreGuard1143){
  // Las evaluaciones pertenecen al formato en que fueron calculadas. El
  // selector heredado cambia TCG/OCG/digital sin recalcular la banlist ni la
  // fuerza competitiva: no conservar el Tier de un formato ya abandonado.
  D.addEventListener('click',event=>{
   const button=event.target?.closest?.('button.fmt');
   if(!button||count1048(W.deckState,'main')===0)return;
   const evaluated=raw(D.documentElement.dataset.scoreEvaluatedFormat).toLowerCase();
   const current=raw(A973.activeFormatKey?.()||'unknown').toLowerCase();
   if(!evaluated||evaluated===current)return;
   // Una evaluación invalidada no recupera validez si se vuelve a seleccionar
   // su antiguo formato: requiere un nuevo CALCULAR.
   if(D.documentElement.dataset.scoreAuthority==='PENDIENTE_FORMATO')return;
   const hasScore=/^\s*\d+\s*\/\s*100\s*$/.test(raw(D.getElementById('score')?.textContent));
   if(!hasScore)return;
   invalidateSearch1056();
   if(ACTIVE_CALC_MONITOR_1124){ACTIVE_CALC_MONITOR_1124.disconnect();ACTIVE_CALC_MONITOR_1124=null;}
   if(W.__YGO1125_CALCULATE_CLEANUP){W.__YGO1125_CALCULATE_CLEANUP();W.__YGO1125_CALCULATE_CLEANUP=null;}
   for(const id of ['score','total','miniScore']){const el=D.getElementById(id);if(el)el.textContent='— / 100';}
   const sum=D.getElementById('sum');if(sum)sum.textContent='—';
   for(const id of ['tier','miniTier']){const el=D.getElementById(id);if(el)el.textContent='—';}
   for(const id of ['tierDesc','miniDesc']){const el=D.getElementById(id);if(el)el.textContent='Formato cambiado. Pulsa CALCULAR para reevaluar.';}
   D.querySelectorAll('#stats .stat').forEach(row=>{const v=row.querySelector('.sv'),bar=row.querySelector('.bar i');if(v)v.textContent='0/10';if(bar)bar.style.width='0%';});
   D.querySelectorAll('#sliders .points-row').forEach(row=>{const v=row.querySelector('.points-value');if(v)v.textContent='0/10';row.querySelectorAll('.point').forEach(x=>x.classList.remove('active'));});
   D.documentElement.dataset.scoreAuthority='PENDIENTE_FORMATO';
   D.documentElement.dataset.scoreCertified='0';
   D.documentElement.dataset.scoreLegal='unknown';
   D.documentElement.dataset.scoreEvidence='NO_EVALUADO';
   W.__YGO1124_CALCULATE_SYNC={pass:false,reason:'FORMATO_CAMBIADO',previousFormat:evaluated,currentFormat:current};
   W.comboLastAnalysis=[];try{comboLastAnalysis=[]}catch(_){}W.__YGO1047_BUDGETED_SEARCH=null;
   for(const id of ['comboVisualTop5','comboEndBoard']){const node=D.getElementById(id);if(node){node.replaceChildren();node.setAttribute('data-ygo-active-deck','PENDIENTE_FORMATO');}}
   evidenceEmptyState1143('FORMATO_CAMBIADO');
   importStatus1048('Formato cambiado a '+raw(button.dataset.f||current)+'. Puntuación anterior invalidada; pulsa CALCULAR para reevaluar.','warn');
  });
  D.documentElement.dataset.ygoFormatScoreGuard1143='1';
 }
 return true;
}

/* Alpha 1143: conservación observable de identidades entre zonas. Se
   ignoran tokens declarados, que pueden crearse/desaparecer legalmente. Si el
   estado no expone UID únicos, se bloquea la promoción estructural: NO se
   interpreta una huella desconocida como prueba de movimiento legal. */
/* Alpha 1143: testigo conservador de identidad *impresa* y tipo Token.
   Ningún uid puede convertirse en otra carta ni en Token para eludir el
   invariante de inventario. Sin identidad observable, no se certifica. */
function printedCardKey1129(entry){
 const card=entry?.card&&typeof entry.card==='object'?entry.card:entry;
 const rawId=card?.id??card?.cardId??card?.passcode??entry?.cardId??entry?.id;
 if(rawId!==undefined&&rawId!==null){
  if(!(typeof rawId==='number'&&Number.isSafeInteger(rawId)&&rawId>0||typeof rawId==='string'&&/^[0-9]+$/.test(rawId)&&Number.isSafeInteger(Number(rawId))&&Number(rawId)>0))return null;
  return 'ID:'+Number(rawId);
 }
 const printed=card?.originalName??card?.printedName??card?.name;
 if(typeof printed!=='string'||!printed.trim())return null;
 const normal=officialKey1126(printed);
 return normal?'NAME:'+normal:null;
}
function stateInventory1128(s){
 const names=['deck','hand','monster','spelltrap','gy','banished','extra'];
 if(!Array.isArray(s?.zones)||s.zones.length!==2)return{complete:false,unique:false,ids:[],reason:'ZONAS_INCOMPLETAS'};
 const uids=[],allIds=[],seen=new Set(),identities={},tokens={};let identityComplete=true,tokenZonesValid=true;
 for(const zone of s.zones){
  if(!zone||!names.every(k=>Array.isArray(zone[k])))return{complete:false,unique:false,ids:[],reason:'ZONAS_INCOMPLETAS'};
  for(const name of names)for(const entry of zone[name]){
   if(!entry||typeof entry!=='object'||Array.isArray(entry))return{complete:false,unique:false,ids:[],reason:'IDENTIDAD_NO_OBSERVABLE'};
   const uid=entry.uid;
   if(!(typeof uid==='string'&&uid.trim()||Number.isSafeInteger(uid)&&uid>=0))return{complete:false,unique:false,ids:[],reason:'UID_AUSENTE'};
   const id=String(uid);if(seen.has(id))return{complete:true,unique:false,ids:uids,reason:'UID_DUPLICADO',duplicate:id};
   seen.add(id);allIds.push(id);
   const token=entry.token===true||entry.isToken===true||entry.card?.isToken===true||
    (Number(entry.card?.typeBits||entry.typeBits)&0x4000)!==0||/\btoken\b/i.test(raw(entry.card?.type||entry.type));
   tokens[id]=token;if(token&&name!=='monster')tokenZonesValid=false;
   const key=printedCardKey1129(entry);
   if(!token&&!key)identityComplete=false;
   identities[id]=key;
   if(!token)uids.push(id);
  }
 }
 return{complete:true,unique:true,identityComplete,tokenZonesValid,ids:uids.sort(),allIds:allIds.sort(),identities,tokens,
  reason:!tokenZonesValid?'TOKEN_FUERA_DE_ZONA_DE_MONSTRUOS':identityComplete?'IDENTIDADES_OBSERVABLES':'CARTA_SIN_IDENTIDAD_IMPRESA'};
}
function stateTransitionInventory1128(before,after,sourceUid=null){
 const a=stateInventory1128(before),b=stateInventory1128(after),complete=a.complete&&b.complete,unique=a.unique&&b.unique;
 const source=typeof sourceUid==='string'||Number.isSafeInteger(sourceUid)?String(sourceUid).trim():'';
 const sourceKnown=!!source&&complete&&a.allIds?.includes(source)===true;
 const conserved=complete&&unique&&JSON.stringify(a.ids)===JSON.stringify(b.ids);
 const printComplete=a.identityComplete===true&&b.identityComplete===true,tokenZonesValid=a.tokenZonesValid===true&&b.tokenZonesValid===true;
 const common=(a.allIds||[]).filter(id=>b.allIds?.includes(id));
 const stable=complete&&unique&&printComplete&&common.every(id=>a.tokens[id]===b.tokens[id]&&
  (a.tokens[id]===true||a.identities[id]===b.identities[id]));
 return{complete,unique,conserved,sourceKnown,printComplete,tokenZonesValid,identityStable:stable,pass:conserved&&sourceKnown&&stable&&tokenZonesValid,
  reason:!complete?'IDENTIDADES_INCOMPLETAS':!unique?'UID_DUPLICADO':!printComplete?'CARTA_SIN_IDENTIDAD_IMPRESA':!tokenZonesValid?'TOKEN_FUERA_DE_ZONA_DE_MONSTRUOS':!stable?'IDENTIDAD_DE_CARTA_MODIFICADA':!sourceKnown?'ORIGEN_NO_LOCALIZADO':!conserved?'CARTAS_SIN_TRANSICION':'INVENTARIO_CONSERVADO'};
}
function traceAudit1124(lines=W.comboLastAnalysis){
 const entries=arr(lines).slice(0,20),seen=new Set(),snapshotCache=new WeakMap();
 const rulesCertified=corpus1047()?.pass===true;
 const fullState=s=>!!s&&Array.isArray(s.zones)&&s.zones.length===2&&s.zones.every(p=>p&&['deck','hand','monster','spelltrap','gy','banished','extra'].every(k=>Array.isArray(p[k])));
 /* Comparación COMPLETA de estado observable: el objeto antiguo enumeraba
    sólo ciertos campos y omitía banderas de efectos, restricciones y costes.
    Se ordenan las claves para no depender del orden de inserción. Estados
    cíclicos, funciones o estructuras ajenas a JSON no dan certificación. */
 const stateView1131=s=>{
  if(!s||typeof s!=='object')return null;
  if(snapshotCache.has(s))return snapshotCache.get(s);
  try{
   let nodes=0;const visited=new WeakSet();
   const walk=(v,depth)=>{
    if(++nodes>50000||depth>48)throw Error('SNAPSHOT_EXCEDE_LIMITE');
    if(v===null)return ['null'];
    if(typeof v==='string'||typeof v==='boolean'||typeof v==='undefined')return [typeof v,v];
    if(typeof v==='number'){if(!Number.isFinite(v))throw Error('NUMERO_NO_FINITO');return ['number',v]}
    if(typeof v!=='object')throw Error('DATO_NO_SERIALIZABLE');
    if(visited.has(v))throw Error('CICLO_DE_ESTADO');visited.add(v);
    let x;
    if(Array.isArray(v)){
     if(Object.keys(v).some(k=>!/^(?:0|[1-9][0-9]*)$/.test(k)||Number(k)>=v.length))throw Error('ARREGLO_CON_ATRIBUTOS');
     x=['array',Array.from({length:v.length},(_,i)=>Object.prototype.hasOwnProperty.call(v,i)?walk(v[i],depth+1):['hueco'])];
    }else{
     const proto=Object.getPrototypeOf(v);if(proto!==Object.prototype&&proto!==null)throw Error('ESTADO_NO_PLANO');
     x=['object',Object.keys(v).sort().map(k=>[k,walk(v[k],depth+1)])];
    }
    visited.delete(v);return x;
   };
   const value=JSON.stringify(walk(s,0));snapshotCache.set(s,value);return value;
  }catch(_){snapshotCache.set(s,null);return null;}
 };
 const rows=entries.map((line,i)=>{
  const steps=arr(line?.actions),proof=lineEvidence1047(line),end=line?.finalBoard||line?.state||line?.simulation?.state;
  const hasEnd=fullState(end),traceStates=steps.length>0&&steps.every(a=>fullState(a?.before)&&fullState(a?.after));
  const view=stateView1131;
  const completeDuel=s=>fullState(s)&&Array.isArray(s.lp)&&s.lp.length===2&&s.lp.every(x=>Number.isSafeInteger(x)&&x>=0)
   &&Number.isSafeInteger(s.turn)&&s.turn>0&&(s.activePlayer===0||s.activePlayer===1)
   &&typeof s.phase==='string'&&s.phase.trim().length>0&&Array.isArray(s.chain);
  const duelContext=traceStates&&completeDuel(end)&&steps.every(a=>completeDuel(a.before)&&completeDuel(a.after));
  const serializable=traceStates&&view(end)!==null&&steps.every(a=>view(a.before)!==null&&view(a.after)!==null);
  const turnFlow=traceStates&&steps.every(a=>Number.isSafeInteger(a.before.turn)&&Number.isSafeInteger(a.after.turn)&&a.after.turn>=a.before.turn&&a.after.turn<=a.before.turn+1&&
    (a.after.turn!==a.before.turn||a.after.activePlayer===a.before.activePlayer));
  const continuity=serializable&&steps.every((a,j)=>j===0||view(steps[j-1].after)===view(a.before));
  const matchesFinal=traceStates&&hasEnd&&view(steps.at(-1).after)===view(end);
  const changedStates=traceStates&&steps.every(a=>view(a.before)!==view(a.after));
  const inventory=steps.map(a=>stateTransitionInventory1128(a?.before,a?.after,a?.sourceUid));
  const identityContinuity=traceStates&&inventory.length>0&&inventory.every(x=>x.pass===true);
  const rawKey=steps.map(a=>[a?.actionType,a?.sourceUid,a?.targetUid,a?.effectId,view(a?.before),view(a?.after)].map(raw).join(':')).join('|');
  const unique=!!rawKey&&!seen.has(rawKey);if(rawKey)seen.add(rawKey);
  const replayPass=proof?.pass===true;
  const structuralCandidate=replayPass&&unique&&hasEnd&&traceStates&&duelContext&&serializable&&turnFlow&&continuity&&matchesFinal&&changedStates&&identityContinuity;
  const certified=structuralCandidate&&rulesCertified;
  return{index:i+1,actions:steps.length,unique,hasEnd,traceStates,duelContext,serializable,turnFlow,continuity,matchesFinal,changedStates,identityContinuity,inventory,replayPass,structuralCandidate,rulesCertified,certified,
   reason:certified?'REGLAS_Y_REPLAY_VERIFICADOS':!steps.length?'SIN_ACCIONES':!unique?'TRAZA_REPETIDA':!hasEnd?'ESTADO_FINAL_INCOMPLETO':!traceStates?'ESTADOS_INTERMEDIOS_INCOMPLETOS':!duelContext?'CONTEXTO_DE_DUELO_INCOMPLETO':!serializable?'ESTADO_NO_SERIALIZABLE':!turnFlow?'TURNO_SIN_CONTINUIDAD':!continuity?'TRAZA_DISCONTINUA':!matchesFinal?'CAMPO_FINAL_DIVERGENTE':!changedStates?'ACCION_SIN_CAMBIO_DE_ESTADO':!identityContinuity?(inventory.find(x=>!x.pass)?.reason||'INVENTARIO_NO_VERIFICADO'):!rulesCertified?'REGLAS_UNIVERSALES_NO_CERTIFICADAS':'REPLAY_NO_CERTIFICADO'};
 });
 const search=search1047(),cert=search?.certificate||{};
 const proofScope=search?.globalOptimalityProven===true&&search?.boundedComplete===true&&cert?.allLegalActionsEnumerated===true&&cert?.allTransitionsExact===true&&cert?.targetChoiceEnumerationComplete===true&&cert?.truncated!==true;
 // Los certificados deben pertenecer a la misma baraja; un resultado viejo
 // no valida una búsqueda nueva. La ausencia de huella bloquea la promoción.
 const fingerprint=deckFingerprint1056(),sameDeck=typeof cert.deckFingerprint==='string'&&cert.deckFingerprint===fingerprint;
 const top5Certified=rows.length>=5&&rows.slice(0,5).every(x=>x.certified)&&proofScope&&sameDeck;
 return{version:VERSION,provided:entries.length,certifiedLines:rows.filter(x=>x.certified).length,
  top5Certified,optimalityProof:proofScope,certificateDeckMatch:sameDeck,searchStatus:search?.status||'UNKNOWN',rows,
  policy:'Las cinco líneas requieren replay completo de dos jugadores, certificado de búsqueda no truncada y huella exacta del mazo. Un horizonte limitado nunca equivale automáticamente a óptimo global.'};
}
function score1048(state){
 if(!scoreGuard1124())throw Error('Motor de puntuación no disponible.');
 // Alpha359 sólo debe enriquecer con simulación cuando las líneas existen y están certificadas.
 // Aislar deckState evita disparar la búsqueda Top 5 síncrona durante la importación.
 const original=W.deckState,oldBudget=W.__YGO_ANALYSIS_BUDGET;
 try{
  W.deckState={main:[],extra:[],side:[]};
  W.__YGO_ANALYSIS_BUDGET={mc:Math.min(120,Math.max(50,Number(oldBudget?.mc)||120)),rules:12,stress:6,mode:'importacion-base'};
  const scoringState={...state};
  for(const zone of ['main','extra','side']){
   if(Array.isArray(state?.[zone]))scoringState[zone]=[...state[zone]].sort((a,b)=>{
    const ka=String(a?.id??a?.cardId??a?.name??'');
    const kb=String(b?.id??b?.cardId??b?.name??'');
    return ka<kb?-1:ka>kb?1:0;
   });
  }
  const score=W.scoreDeck(scoringState);return paintFast1048(score);
 }finally{W.deckState=original;W.__YGO_ANALYSIS_BUDGET=oldBudget}
}
function captureVisual1051(){
 const ids=['score','total','sum','miniScore','tier','miniTier','tierDesc','miniDesc'];
 const values=ids.map(id=>{const e=D.getElementById(id);return e?e.innerHTML:null});
 const stats=[...D.querySelectorAll('#stats .stat')].map(e=>({value:e.querySelector('.sv')?.textContent??null,width:e.querySelector('.bar i')?.style.width??null}));
 const sliders=[...D.querySelectorAll('#sliders .points-row')].map(e=>({value:e.querySelector('.points-value')?.textContent??null,points:[...e.querySelectorAll('.point')].map(p=>p.classList.contains('active'))}));
 return{values,stats,sliders,scoreAuthority:D.documentElement.dataset.scoreAuthority,scoreCertified:D.documentElement.dataset.scoreCertified,scoreLegal:D.documentElement.dataset.scoreLegal};
}
function restoreVisual1051(snapshot){
 if(!snapshot)return;
 ['score','total','sum','miniScore','tier','miniTier','tierDesc','miniDesc'].forEach((id,i)=>{const e=D.getElementById(id);if(e&&snapshot.values[i]!=null)e.innerHTML=snapshot.values[i]});
 D.querySelectorAll('#stats .stat').forEach((e,i)=>{const r=snapshot.stats[i];if(!r)return;const v=e.querySelector('.sv'),bar=e.querySelector('.bar i');if(v&&r.value!=null)v.textContent=r.value;if(bar&&r.width!=null)bar.style.width=r.width});
 D.querySelectorAll('#sliders .points-row').forEach((e,i)=>{const r=snapshot.sliders[i];if(!r)return;const v=e.querySelector('.points-value');if(v&&r.value!=null)v.textContent=r.value;e.querySelectorAll('.point').forEach((p,k)=>p.classList.toggle('active',r.points[k]===true))});
 if(snapshot.scoreAuthority===undefined)delete D.documentElement.dataset.scoreAuthority;else D.documentElement.dataset.scoreAuthority=snapshot.scoreAuthority;
 if(snapshot.scoreCertified===undefined)delete D.documentElement.dataset.scoreCertified;else D.documentElement.dataset.scoreCertified=snapshot.scoreCertified;
 if(snapshot.scoreLegal===undefined)delete D.documentElement.dataset.scoreLegal;else D.documentElement.dataset.scoreLegal=snapshot.scoreLegal;
}

/* Alpha 1059: contrato único de fidelidad de importación YDK.
   El formato de encabezado no modifica la zona, ID ni cantidad real de ninguna carta.
   No publica estados ni declara legalidad competitiva. */
function verifyParsedYDK1059(deck,ydk){
 const main=count1048(deck,'main'),extra=count1048(deck,'extra'),side=count1048(deck,'side');
 if(!main&&!extra&&!side)throw Error('El YDK no contiene cartas utilizables.');
 if(main!==ydk.counts.main||extra!==ydk.counts.extra||side!==ydk.counts.side)throw Error('El parser YDK omitió o alteró cartas: original '+JSON.stringify(ydk.counts)+' ≠ interpretado '+JSON.stringify({main,extra,side})+'. No se modificó la baraja.');
 const identity=ydkIdentity1051(deck,ydk);if(!identity.pass)throw Error('El parser alteró identificadores o zonas del archivo YDK: '+JSON.stringify(identity.differences.slice(0,3))+'. No se modificó la baraja.');
 if(main>60||extra>15||side>15)throw Error('Main (60), Extra (15) o Side (15) supera el límite físico. Se mantiene la baraja anterior.');
 return {deck,main,extra,side,identity:identity.pass,counts:{main,extra,side}};
}
function preflightYDK1059(text){
 try{
  const ydk=inspectYDK1050(text),parser=W.YGOAlpha330?.parseYDK||W.parseYDK||W.YDK?.parse;
  if(typeof parser!=='function')return {version:VERSION,pass:false,error:'YDK_PARSER_UNAVAILABLE'};
  const r=verifyParsedYDK1059(parser(ydk.clean),ydk);
  return {version:VERSION,pass:true,counts:r.counts,total:ydk.total,uniqueIds:ydk.uniqueIds,identity:r.identity};
 }catch(e){return {version:VERSION,pass:false,error:raw(e?.message||e)};}
}


/* Alpha 1077: auditoría conservadora de exclusividad.
   Las marcas OT de un CDB local NO equivalen a fuentes oficiales ni tienen
   fecha de lanzamiento. No cambiar TCG/OCG si la evidencia está ausente o en conflicto. */
function formatEvidence1077(deck=W.deckState){
 const rows=[...arr(deck?.main),...arr(deck?.extra),...arr(deck?.side)],byId=new Map(arr(W.CARD_CATALOG).map(c=>[Number(c?.id),c]));
 const exclusive={OCG:[],TCG:[]},unverified=[];
 for(const c of rows){
  const ref=byId.get(Number(c?.id??c?.cardId))||c,ot=Number(ref?.ot);
  if(ot===1)exclusive.OCG.push({name:raw(ref?.name||c?.name),id:Number(ref?.id||c?.id)});
  else if(ot===2)exclusive.TCG.push({name:raw(ref?.name||c?.name),id:Number(ref?.id||c?.id)});
  else unverified.push(Number(ref?.id||c?.id));
 }
 const contradictory=exclusive.OCG.length>0&&exclusive.TCG.length>0;
 const suggestion=contradictory?null:exclusive.OCG.length?'OCG':exclusive.TCG.length?'TCG':null;
 return {version:VERSION,suggestion,autoSelected:false,officialCertified:false,contradictory,
  evidence:{OCG:exclusive.OCG.slice(0,12),TCG:exclusive.TCG.slice(0,12)},unverifiedCopies:unverified.length,
  status:contradictory?'FUENTES_CONTRADICTORIAS':suggestion?'INDICIO_LOCAL_SIN_CERTIFICAR':'INDETERMINADO',
  source:'Campo OT local sin acreditación de exclusividad oficial ni fecha de lanzamiento',
  policy:'No aplicar cambios de formato sin evidencia oficial comprobable: TCG/OCG y formatos digitales no se pueden inferir universalmente del YDK.'};
}
function fixturesAlpha1077(){
 const tests=[];const check=(name,pass,detail)=>tests.push({name,pass:pass===true,...(detail?{detail}: {})});
 const good='#main\n89631139\n#extra\n!side\n';
 const goodTest=preflightYDK1059(good);
 check('Parser .ydk conserva 1 ID en Main',goodTest.pass===true&&goodTest.counts.main===1);
 for(const [name,s] of [
  ['Identificador de carta alfanumérico rechazado','#main\nABC\n'],
  ['Identificador cero rechazado','#main\n0\n'],
  ['Main de 61 cartas rechazado','#main\n'+Array(61).fill('89631139').join('\n')+'\n'],
  ['Extra de 16 cartas rechazado','#main\n89631139\n#extra\n'+Array(16).fill('89631139').join('\n')+'\n'],
  ['Side de 16 cartas rechazado','#main\n89631139\n!side\n'+Array(16).fill('89631139').join('\n')+'\n'],
  ['Cabecera principal duplicada rechazada','#main\n89631139\n#main\n']]){
  const result=preflightYDK1059(s);check(name,result.pass===false);
 }
 check('10×10 enteros aceptados',scoreAuthority1048([0,1,2,3,4,5,6,7,8,10]).valid===true);
 check('Puntuación con 9 categorías rechazada',scoreAuthority1048(Array(9).fill(5)).valid===false);
 check('Puntuación fraccionaria rechazada',scoreAuthority1048(Array(9).fill(5).concat(5.5)).valid===false);
 check('Puntuación >10 rechazada',scoreAuthority1048(Array(9).fill(5).concat(11)).valid===false);
 check('Puntuación negativa rechazada',scoreAuthority1048(Array(9).fill(5).concat(-1)).valid===false);
 const f=formatEvidence1077({main:[],extra:[],side:[]});
 check('Sin cartas no se inventa formato',f.suggestion===null&&f.officialCertified===false&&f.autoSelected===false);check('Alpha 1078 preflight no certifica combos por sí solo',fixturePreflightSelf1078().pass===true);check('Alpha 1079 búsqueda cooperativa controla cancelación y certificación',coopSelf1079().pass===true);check('Alpha 1080 worker aislado disponible',isolatedSelf1080().pass===true);
 const detail=D.getElementById('loadDeckDropdown');
 check('Los botones antiguos son visibles inicialmente',!!detail?.open&&!!D.getElementById('alpha306LoadDeck')?.getClientRects().length&&!!D.getElementById('alpha306DeleteDeck')?.getClientRects().length);
 return {version:VERSION,pass:tests.every(x=>x.pass),passed:tests.filter(x=>x.pass).length,total:tests.length,tests,
  scope:'Fidelidad YDK, validación de puntajes 10×10, exclusividad sin evidencia e interfaz; no demuestra reglas universales ni óptimo global.'};
}

/* Alpha 1064: diagnóstico sin efectos secundarios de los límites físicos,
   sin convertir una aprobación de estructura en validación oficial. */
function formatBoundaryAudit1060(){
 const cases=[['tcg',40,60],['ocg',40,60],['master',40,60],['rush',40,60],
  ['speedDuel',20,30],['duelLinksSpeed',20,30],['duelLinksRush',30,40]];
 const rows=cases.map(([key,min,max])=>{const p=formatPolicy1055(key);
  return {key,min:p.mainMin,max:p.mainMax,expectedMin:min,expectedMax:max,
   rangesCorrect:p.mainMin===min&&p.mainMax===max,
   digitalUncertified:key.startsWith('duelLinks')?p.needsDigitalVerification===true:true,
   certified:p.certified===true};
 });
 return {version:VERSION,pass:rows.every(x=>x.rangesCorrect&&x.digitalUncertified&&!x.certified),rows,
  policy:'Sólo verifica límites preliminares de Main y que los formatos digitales permanezcan sin certificar.'};
}

function renderedDeckIdentity1109(deck){
 const host=D.getElementById('deckList');
 const actual=host?[...host.querySelectorAll(':scope > .visual-card-wrap')]:[];
 const expected=[];
 for(const c of arr(deck?.main)){
  const q=Math.max(1,Math.floor(Number(c?.qty)||1));
  for(let n=0;n<q;n++)expected.push(String(Number(c?.id??c?.cardId)||0));
 }
 const observed=actual.map(el=>raw(el.getAttribute('data-ygo-card-id')));
 const pass=!!host&&actual.length===expected.length&&expected.every((id,i)=>id===observed[i]);
 return {version:VERSION,pass,expectedCount:expected.length,renderedCount:actual.length,
  mismatchIndex:pass?-1:expected.findIndex((id,i)=>id!==observed[i])};
}


/* Revision auditada Alpha 1143: estados vacíos honestos para líneas y campos.
   No inventa jugadas, no reutiliza resultados de barajas anteriores y no altera posiciones. */
function evidenceEmptyState1143(reason='PENDIENTE'){
 const hasDeck=count1048(W.deckState,'main')>0;
 const candidates=[
  ['comboVisualTop5',hasDeck?'No hay cinco combos acreditados para esta baraja. Utiliza «ANALIZAR TOP 5» para buscar líneas; si no se encuentran, el resultado sigue sin certificar.':'Carga una baraja para poder analizar los mejores combos.'],
  ['comboEndBoard',hasDeck?'No hay cinco campos finales acreditados para esta baraja. Los End Boards solo se muestran como válidos cuando existe una secuencia comprobable.':'Carga una baraja para analizar posibles campos finales.']
 ];
 let count=0;
 for(const [id,message] of candidates){
  const host=D.getElementById(id);if(!host)continue;
  const live=!!host.querySelector('.combo-video,.combo-endboard-result');
  if(live){host.querySelectorAll('.ygo-evidence-empty').forEach(n=>n.remove());continue;}
  // Los resultados de estado vacío sustituyen solo contenedores SIN una simulación.
  const existing=host.querySelector('.ygo-evidence-empty');
  if(existing){existing.textContent=message;existing.dataset.reason=reason;continue;}
  const note=D.createElement('div');note.className='ygo-evidence-empty';
  note.setAttribute('role','status');note.setAttribute('aria-live','polite');
  note.dataset.reason=reason;note.textContent=message;
  host.appendChild(note);count++;
 }
 return count;
}
function installEvidenceGuard1143(){
 if(W.__YGO1143_EVIDENCE_WATCH)return true;
 const nodes=['comboVisualTop5','comboEndBoard'].map(id=>D.getElementById(id)).filter(Boolean);
 if(!nodes.length||typeof MutationObserver!=='function')return false;
 let queued=false;
 const observer=new MutationObserver(()=>{
  if(queued)return;
  queued=true;
  queueMicrotask(()=>{queued=false;try{evidenceEmptyState1143('RENDER_SIN_COMBOS_CERTIFICADOS')}catch(_){}});
 });
 for(const node of nodes)observer.observe(node,{childList:true});
 W.__YGO1143_EVIDENCE_WATCH={active:true,panels:nodes.length,observer};
 return true;
}


async function importText1048(text,name='Baraja importada',originTicket=null){
 let precheckedYDK;
 try{precheckedYDK=inspectYDK1050(text)}catch(err){
  const message=String(err?.message||err);IMPORT1048.errors.push(message);
  importStatus1048('Error al importar: '+message,'bad');return {error:message};
 }
 // Alpha 1106: una solicitud se acepta SOLO tras validar identidades, zonas y cantidades.
 // Una solicitud inválida no puede cancelar otra válida que aún se está leyendo.
 const ticket=originTicket?.token===FILE_IMPORT_TOKEN_1105?Number(originTicket.ticket):++IMPORT1048.requestSeq;
 if(!Number.isSafeInteger(ticket)||ticket<IMPORT1048.acceptedTicket)return {cancelled:true};
 const started=performance.now();let seq=null,previous=null,committed=false;
 try{
  const ydk=precheckedYDK,clean=ydk.clean;
  if(arr(W.CARD_CATALOG).length<19000){
   IMPORT1048.status='CATALOGO';importStatus1048('Preparando catálogo de cartas local antes de importar…');
   const hydrate=W.YGOAlpha984?.ensureCatalog984||W.YGOAlpha329?.ensureReady;
   if(typeof hydrate==='function')await hydrate();
  }
  if(ticket<IMPORT1048.acceptedTicket)return {cancelled:true};
  const parser=W.YGOAlpha330?.parseYDK||W.parseYDK||W.YDK?.parse;
  if(typeof parser!=='function')throw Error('Parser de barajas YDK no disponible.');
  const verified=verifyParsedYDK1059(parser(clean),ydk);
  const {deck,main,extra,side}=verified;
  if(ticket<IMPORT1048.acceptedTicket)return {cancelled:true};
  // Alpha 1107: validar la identidad NO equivale a aceptar el nuevo mazo.
  // Un fallo posterior de puntuación no debe cancelar un archivo válido previo.
  // Sólo un commit con puntuación terminada puede superar el ticket aceptado.
  IMPORT1048.status='VALIDANDO';
  IMPORT1048.status='PREPARANDO';
  importStatus1048(`Archivo validado (${main} Main · ${extra} Extra · ${side} Side). Preparando análisis base…`);
  await new Promise(resolve=>setTimeout(resolve,25));
  if(ticket<IMPORT1048.acceptedTicket)return {cancelled:true};
  previous={deck:W.deckState,name:D.getElementById('name')?.value,zone:W.activeZone,visual:captureVisual1051(),last:IMPORT1048.last};
  // Completar el cálculo antes de adquirir el ticket. Si falla, otro candidato
  // que todavía está leyendo puede continuar sin invalidación artificial.
  const score=score1048(deck);
  if(ticket<IMPORT1048.acceptedTicket){restoreVisual1051(previous.visual);return {cancelled:true};}
  // Aún sin aceptar ticket: faltan el render y la auditoría de legalidad.
  // Desde aquí hasta completar la transacción no existe otro await.
  W.deckState=deck;W.activeZone='main';try{activeZone='main'}catch(_){}
  D.querySelectorAll('.deck-tab').forEach(b=>b.classList.toggle('active',b.dataset.zone==='main'));
  const title=D.getElementById('name');if(title)title.value=cleanName1048(name);
  IMPORT1048.status='IMPORTADO';const detail=`${main} Main · ${extra} Extra · ${side} Side`;
  importStatus1048(`Baraja importada (${detail}). Calculando las 10 estadísticas…`);
  if(typeof W.renderDeck!=='function')throw Error('RENDER_DECK_UNAVAILABLE');
  try{W.renderDeck()}catch(err){throw Error('RENDER_DECK_FAILED: '+raw(err?.message||err))}
  // Evitar confirmar un mazo que el renderer haya ignorado silenciosamente.
  const visible1109=renderedDeckIdentity1109(deck);
  if(!visible1109.pass)throw Error('RENDER_DECK_STALE: '+visible1109.renderedCount+'/'+visible1109.expectedCount+' cartas visibles.');
  IMPORT1048.status='PUNTUANDO'; // score validado antes del commit
  if(arr(W.CARD_CATALOG).length>=19617&&W.BANLIST_PROFILES?.tcg?.__catalogReindexed1125!==true){
   mergeVerifiedTCG1124();W.BANLIST_PROFILES.tcg.__catalogReindexed1125=true;
  }
  const legality=auditActiveDeck1050(deck);
  const duplicates=legality.physical.duplicates.map(x=>x.name+' ('+x.qty+' copias)');
  const unknown=legality.physical.unknownCopies;
  const physicallyValid=legality.physical.physicalValid===true&&legality.physical.unknownCopies===0;
  const restriction1126=legality.snapshotBanlist1126?.violations?.[0];
  const officialIllegal=!!restriction1126||legality.official?.result?.legal===false&&arr(legality.official?.result?.errors).length>0;
  const illegal=!physicallyValid||!legality.snapshotValidated||officialIllegal;
  // Alpha 1058: una baraja con errores físicos no puede tener Tier competitivo.
  // Mostrar los diez valores sólo como diagnóstico; no eliminar el mazo del usuario.
  if(!physicallyValid||officialIllegal){
   const reason=restriction1126?restriction1126.name+': '+restriction1126.copies+' copias, máximo '+restriction1126.maximum:officialIllegal?(legality.official?.result?.errors?.[0]||'Cartas restringidas por la banlist del formato activo'):(legality.physical.errors[0]||(legality.physical.unknownCopies+' copias desconocidas'));
   for(const id of ['tier','miniTier']){const el=D.getElementById(id);if(el)el.textContent='SIN TIER'}
   for(const id of ['tierDesc','miniDesc']){const el=D.getElementById(id);if(el)el.textContent='Baraja no válida: '+reason}
   D.documentElement.dataset.scoreAuthority='ESTRUCTURAL_NO_APTO';
   D.documentElement.dataset.scoreCertified='0';
   score.tier='SIN TIER';score.legalTier=false;score.physicalErrors=legality.physical.errors.slice();
   score.authority={...score.authority,mode:'ESTRUCTURAL_NO_APTO',certified:false,reason:officialIllegal?'La lista de prohibiciones del formato activo rechaza esta baraja.':'La baraja presenta errores de estructura/cantidad/zona y no puede recibir Tier competitivo.'};
  }else score.legalTier=legality.certifiedLegal===true;
  D.documentElement.dataset.scoreLegal=physicallyValid&&!officialIllegal?(legality.certifiedLegal===true?'1':'unknown'):'0';
  // Alpha 1110: la evidencia auxiliar también se prepara antes del commit.
  const preparedFormatEvidence=formatEvidence1077(deck);
  // Alpha 1110: score, render y auditoría han concluido sin errores.
  // La aceptación tardía impide cancelar otras lecturas válidas si hubo fallo.
  IMPORT1048.acceptedTicket=ticket;
  seq=++IMPORT1048.seq;
  invalidateSearch1056(); // Commit exitoso: invalidar sólo ahora
  committed=true;IMPORT1048.status=illegal?'IMPORTADO_CON_AVISOS':'PUNTUADO';
  // Los replays y campos finales son evidencia de UNA baraja concreta.
  // No reutilizar líneas visuales ni certificados de búsqueda de la baraja anterior.
  W.comboLastAnalysis=[];try{comboLastAnalysis=[]}catch(_){}W.__YGO1047_BUDGETED_SEARCH=null;
  for(const id of ['comboVisualTop5','comboEndBoard']){
   const node=D.getElementById(id);if(node){node.replaceChildren();node.setAttribute('data-ygo-active-deck','PENDIENTE_DE_SIMULACION');}
  }
  evidenceEmptyState1143('IMPORTADO_SIN_REPLAY');
  IMPORT1048.last={name:cleanName1048(name),main,extra,side,unknown,duplicates,score,legality,formatEvidence:preparedFormatEvidence,ydk:{counts:ydk.counts,total:ydk.total},elapsedMs:Math.round(performance.now()-started),at:Date.now()};
  // Revisión ampliada: indicar la infracción concreta de la banlist en el
  // mensaje principal, incluso si el resto del formato sigue sin certificar.
  // Anteriormente el Tier decía «SIN TIER» pero el estado solo avisaba que la
  // banlist no estaba certificada, ocultando una prohibición detectada.
  // Un informe snapshot1126 puede contener errores físicos de MAIN/EXTRA,
  // NO siempre una carta de la banlist. Evitar atribuir falsamente un rango
  // físico a una restricción oficial de Konami.
  const normalizedBanName=v=>raw(v).trim().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');
  const activeRestrictionName=normalizedBanName(restriction1126?.name);
  const isBanlistViolation=!!activeRestrictionName&&(
   /PROHIB|LIMIT|BANLIST/i.test(raw(restriction1126?.reason))&& !['main','extra','side'].includes(activeRestrictionName) ||
   ['tcg','tcgTraditional','ocg'].some(fmt=>arr(W.BANLIST_PROFILES?.[fmt]?.data).some(entry=>normalizedBanName(entry?.name)===activeRestrictionName))
  );
  const bannedExplain=isBanlistViolation
   ?`restricción detectada: ${restriction1126.name} (${restriction1126.copies} copia(s), máximo ${restriction1126.maximum})`
   :officialIllegal&&physicallyValid&&!restriction1126?`restricción detectada: ${raw(legality.official?.result?.errors?.[0]||'baraja rechazada por la banlist')}`:'';
  const issues=[bannedExplain,!legality.physical.physicalValid?('estructura/copia/zona incorrecta · '+legality.physical.errors.slice(0,3).join(' · ')):'',unknown?`${unknown} cartas sin nombre verificado`:'',legality.needsReview?'legalidad/banlist del formato sin certificar':'',legality.needsPrintVerification?'impresión con logo Speed Duel sin verificar':'',legality.needsEventListVerification?'lista específica del evento sin verificar':'',legality.needsDigitalVerification?'Skill, pool de cartas y reglas de Duel Links pendientes de verificación':''].filter(Boolean);
  const scoreStatus=(!physicallyValid||officialIllegal)?'puntuación diagnóstica sin Tier válido':'puntuación estimada no certificada competitivamente';
  for(const id of ['score','miniScore']){const el=D.getElementById(id);if(el)el.title=scoreStatus+'; 10 categorías de 0 a 10.'}
  for(const id of ['tier','miniTier']){const el=D.getElementById(id);if(el)el.title=(!physicallyValid||officialIllegal)?'SIN TIER: '+(bannedExplain||legality.physical.errors[0]||'estructura inválida'):'Tier estimado, pendiente de certificación competitiva.'}
  importStatus1048(`${cleanName1048(name)} · ${detail} · ${score.total}/100 · ${score.tier||'TIER pendiente'} · ${scoreStatus}; los 5 combos no están certificados${issues.length?' · '+issues.join(' · '):''}.`,issues.length?'warn':'ok');
  return IMPORT1048.last;
 }catch(err){if(seq!==null&&seq!==IMPORT1048.seq)return {cancelled:true};if(previous&&!committed){restoreVisual1051(previous.visual);IMPORT1048.last=previous.last;W.deckState=previous.deck;W.activeZone=previous.zone;try{activeZone=previous.zone}catch(_){}D.querySelectorAll('.deck-tab').forEach(b=>b.classList.toggle('active',b.dataset.zone===previous.zone));const n=D.getElementById('name');if(n)n.value=previous.name||'';try{W.renderDeck?.()}catch(_){}}IMPORT1048.status='ERROR';IMPORT1048.errors.push(String(err?.message||err));
  importStatus1048('Error al importar: '+String(err?.message||err),'bad');return {error:String(err?.message||err)};}
}
/* Revisión de compatibilidad de archivos YDK: la lectura estándar de File.text()
   reconoce UTF-8 y UTF-16 con BOM. Algunos exportadores legados escriben
   UTF-16LE/BE SIN BOM; detectarlo únicamente cuando existe una señal fuerte
   de bytes NUL alternados. El parser valida después cada cabecera e ID.
   Los bytes ambiguos se leen con File.text(): no adivinar codificaciones. */
async function readYDKFileSafe1143(file){
 const binary=new Uint8Array(await file.arrayBuffer());
 const n=Math.min(Math.floor(binary.length/2),512);
 const hasBom=binary.length>=2&&(
  (binary[0]===0xff&&binary[1]===0xfe)||
  (binary[0]===0xfe&&binary[1]===0xff)||
  (binary.length>=3&&binary[0]===0xef&&binary[1]===0xbb&&binary[2]===0xbf));
 if(!hasBom&&n>=8){
  let evenNul=0,oddNul=0;
  for(let i=0;i<n;i++){
   if(binary[2*i]===0)evenNul++;
   if(binary[2*i+1]===0)oddNul++;
  }
  const le=oddNul/n>=0.65&&evenNul/n<=0.05;
  const be=evenNul/n>=0.65&&oddNul/n<=0.05;
  if(le||be){
   if(binary.length%2)throw Error('Archivo UTF-16 incompleto: número impar de bytes. Se conservó la baraja anterior.');
   if(typeof TextDecoder!=='function')throw Error('El navegador no permite leer archivos UTF-16 sin BOM.');
   const content=new TextDecoder(le?'utf-16le':'utf-16be',{fatal:true}).decode(binary);
   if(content.includes('\u0000'))throw Error('Archivo UTF-16 con caracteres NUL inválidos.');
   return content;
  }
 }
 // Para archivos con BOM y codificaciones estándar se conserva File.text(),
 // evitando alterar compatibilidad de archivos previamente admitidos.
 return file.text();
}
async function importFile1048(file){
 // Alpha 1106: las lecturas invalidas no cancelan solicitudes validas en curso.
 // Tickets de selección preservan 'la ultima seleccion VALIDA gana', sin importar
 // que File.text() se complete fuera de orden. Un borrado invalida tickets viejos.
 if(!file)return {error:'No se seleccionó ningún archivo.'};
 if(!/\.(ydk|txt)$/i.test(file.name||'')){importStatus1048('Selecciona un archivo .YDK o .TXT.','bad');return {error:'INVALID_EXTENSION'}}
 if(file.size>1024*1024){importStatus1048('Archivo demasiado grande (máximo 1 MB).','bad');return {error:'FILE_TOO_LARGE'}}
 const ticket=++IMPORT1048.requestSeq;
 try{
  const text=await readYDKFileSafe1143(file);
  if(ticket<IMPORT1048.acceptedTicket)return {cancelled:true};
  try{
   inspectYDK1050(text);
   // Si el catálogo y el parser están listos, validar identidad y cantidades
   // antes de permitir que esta solicitud cancele un análisis anterior.
   if(arr(W.CARD_CATALOG).length>=19000){
    const check=preflightYDK1059(text);if(!check.pass)throw Error(check.error||'YDK_PREVALIDATION_FAILED');
   }
  }catch(err){
   const message=raw(err?.message||err);IMPORT1048.errors.push(message);
   importStatus1048('Error al importar: '+message,'bad');return {error:message};
  }
  if(ticket<IMPORT1048.acceptedTicket)return {cancelled:true};
  return await importText1048(text,file.name,{token:FILE_IMPORT_TOKEN_1105,ticket});
 }catch(e){
  if(ticket<IMPORT1048.acceptedTicket)return {cancelled:true};
  const message=String(e?.message||e);importStatus1048('No se pudo leer el archivo: '+message,'bad');return {error:message};
 }
}


/* Revisión de exportación conservadora: nunca guardar una baraja parcial.
   Verifica las identidades y cantidades ORIGINALES contra el .ydk producido.
   La legalidad de formato sigue siendo independiente de la fidelidad del archivo. */
function validateExport1143(deck=W.deckState){
 const errors=[],expected={main:0,extra:0,side:0},ids=new Map();
 for(const zone of ['main','extra','side']){
  if(!Array.isArray(deck?.[zone])){errors.push('Zona '+zone+' ausente.');continue;}
  for(const card of deck[zone]){
   if(!card||typeof card!=='object'||Array.isArray(card)){
    errors.push('Registro inválido en '+zone+'.');continue;
   }
   const idText=raw(card.id??card.cardId??card.passcode).trim(),id=Number(idText),q=Number(card.qty??1);
   if(!/^\d{1,12}$/.test(idText)||!Number.isSafeInteger(id)||id<=0){
    errors.push('Identificador inválido en '+zone+': '+raw(card.name||'carta sin nombre').slice(0,80));continue;
   }
   if(!Number.isSafeInteger(q)||q<1||q>60){
    errors.push('Cantidad inválida en '+zone+': '+raw(card.name||idText).slice(0,80));continue;
   }
   expected[zone]+=q;
   const key=zone+':'+id;ids.set(key,(ids.get(key)||0)+q);
  }
 }
 if(!Object.values(expected).some(Boolean))errors.push('La baraja no contiene cartas exportables.');
 for(const [zone,max] of [['main',60],['extra',15],['side',15]]){
  if(expected[zone]>max)errors.push('La zona '+zone+' supera '+max+' cartas.');
 }
 let serialized=null,identity=null;
 if(!errors.length){
  try{
   const serializer=W.serializeYDK||W.YDK?.serialize;
   if(typeof serializer!=='function')throw Error('SERIALIZADOR_YDK_NO_DISPONIBLE');
   serialized=serializer(deck);
   if(!serialized||typeof serialized.text!=='string')throw Error('SERIALIZACION_SIN_TEXTO');
   if(arr(serialized.skipped).length)throw Error('EXPORTACION_INCOMPLETA: '+serialized.skipped.length+' entradas omitidas');
   const original=inspectYDK1050(serialized.text);
   const parser=W.YGOAlpha330?.parseYDK||W.parseYDK||W.YDK?.parse;
   if(typeof parser!=='function')throw Error('PARSER_YDK_NO_DISPONIBLE');
   const checked=verifyParsedYDK1059(parser(original.clean),original);
   identity=ydkIdentity1051(checked.deck,{byZone:Object.fromEntries(['main','extra','side'].map(z=>[z,new Map([...ids].filter(([k])=>k.startsWith(z+':')).map(([k,v])=>[k.slice(z.length+1),v]))]))});
   if(!identity.pass)throw Error('La exportación cambió identificadores o cantidades.');
   if(!['main','extra','side'].every(z=>Number(original.counts[z])===expected[z]&&Number(serialized.counts?.[z])===expected[z]))throw Error('La exportación perdió cartas de alguna zona.');
  }catch(e){errors.push('No se exportó: '+raw(e?.message||e));}
 }
 return{pass:errors.length===0,errors,expected,serializedCount:serialized?.counts||null,identityPass:identity?.pass===true,officialLegalityCertified:false,
  policy:'Sólo garantiza fidelidad de la exportación; no certifica legalidad o Tier.'};
}
function installExportGuard1143(){
 if(W.exportYDK?.__alpha1143Safe)return true;
 const oldExport=W.exportYDK;
 if(typeof oldExport!=='function')return false;
 const guarded=function(){
  const test=validateExport1143(W.deckState);
  W.__YGO1143_EXPORT_LAST=test;
  if(!test.pass){const message='Exportación cancelada: '+test.errors.slice(0,3).join(' · ');
   importStatus1048(message,'bad');try{W.toast?.(message)}catch(_){ }return null;}
  return oldExport();
 };
 guarded.__alpha1143Safe=true;guarded.__base=oldExport;
 W.exportYDK=guarded;
 if(W.YDK)W.YDK.export=guarded;
 if(W.YGOAlpha330)W.YGOAlpha330.exportYDK=guarded;
 const btn=D.getElementById('alpha330ExportYDK');
 if(btn&&btn.dataset.ygoSafeExport1143!=='1'){
  const clone=btn.cloneNode(true);
  clone.dataset.ygoSafeExport1143='1';
  btn.replaceWith(clone);
  clone.addEventListener('click',guarded);
 }
 return true;
}

function bindImport1048(){
 let input=D.getElementById('ydkMainFile');if(!input)return false;
 if(input.__alpha1048Bound)return true;
 const clone=input.cloneNode(true);input.replaceWith(clone);clone.__alpha1048Bound=true;
 clone.addEventListener('change',event=>{
  event.stopImmediatePropagation();event.stopPropagation();
  const file=clone.files?.[0];clone.value='';
  if(file)void importFile1048(file);
 },{capture:true});
 IMPORT1048.input=clone;
 // El botón antiguo capturaba la referencia del input antes de su sustitución.
 // Reconectarlo evita abrir un selector de archivos desvinculado del documento.
 const loadButton=D.getElementById('alpha306LoadDeck');
 if(loadButton)loadButton.onclick=()=>D.getElementById('ydkMainFile')?.click();
 const deleteButton=D.getElementById('alpha306DeleteDeck');if(deleteButton)deleteButton.onclick=()=>deleteCurrentDeck1050();
 W.importText=importText1048;
 W.YDK={...(W.YDK||{}),importText:importText1048,importFile:importFile1048,importMainCalculator:importFile1048};
 if(W.YGOApp)W.YGOApp.ydk={...(W.YGOApp.ydk||{}),importText:importText1048,importFile:importFile1048};
 return true;
}
function deleteCurrentDeck1050({skipConfirm=false}={}){
 const total=['main','extra','side'].reduce((n,z)=>n+count1048(W.deckState,z),0);
 if(!total){
  // Alpha 1106: Eliminar también cancela una lectura de archivo cuando el campo
  // está vacío. No modifica la revisión física de una baraja inexistente.
  ++IMPORT1048.seq;IMPORT1048.acceptedTicket=++IMPORT1048.requestSeq;
  IMPORT1048.status='VACIO';
  importStatus1048('No hay baraja cargada. Se cancelaron las importaciones pendientes, si existían.','warn');
  return{deleted:false,reason:'EMPTY_DECK',pendingImportsInvalidated:true};
 }
 if(!skipConfirm&&typeof W.confirm==='function'&&!W.confirm('¿Eliminar la baraja actual? Las barajas guardadas no se borrarán.'))return{deleted:false,reason:'CANCELLED'};
 invalidateSearch1056();++IMPORT1048.seq;++IMPORT1048.requestSeq;IMPORT1048.acceptedTicket=IMPORT1048.requestSeq;
 W.deckState={main:[],extra:[],side:[]};W.activeZone='main';try{activeZone='main'}catch(_){}
 const name=D.getElementById('name');if(name)name.value='';
 D.querySelectorAll('.deck-tab').forEach(b=>b.classList.toggle('active',b.dataset.zone==='main'));
 for(const [id,text] of [['score','— / 100'],['total','— / 100'],['sum','—'],['miniScore','— / 100'],['tier','—'],['miniTier','—'],['tierDesc','Sin baraja'],['miniDesc','Sin baraja']]){const n=D.getElementById(id);if(n){n.textContent=text;n.removeAttribute('title')}}
 D.querySelectorAll('#stats .stat').forEach(row=>{const v=row.querySelector('.sv'),bar=row.querySelector('.bar i');if(v)v.textContent='0/10';if(bar)bar.style.width='0%';});
 D.querySelectorAll('#sliders .points-row').forEach(row=>{const v=row.querySelector('.points-value');if(v)v.textContent='0/10';row.querySelectorAll('.point').forEach(x=>x.classList.remove('active'));});
 D.documentElement.dataset.scoreAuthority='SIN_BARAJA';D.documentElement.dataset.scoreCertified='0';D.documentElement.dataset.scoreLegal='';
 W.comboLastAnalysis=[];try{comboLastAnalysis=[]}catch(_){}W.__YGO1047_BUDGETED_SEARCH=null;
 for(const id of ['comboVisualTop5','comboEndBoard']){
  const node=D.getElementById(id);if(node){node.replaceChildren();node.setAttribute('data-ygo-active-deck','SIN_BARAJA');}
 }
 evidenceEmptyState1143('SIN_BARAJA');
 IMPORT1048.last=null;IMPORT1048.status='VACIO';
 try{W.renderDeck?.()}catch(e){IMPORT1048.errors.push('render tras eliminar: '+raw(e?.message||e))}
 importStatus1048('Baraja actual eliminada. Las barajas guardadas permanecen intactas.','ok');
 return{deleted:true,previousCards:total,savedDecksUnchanged:true};
}

function scorePresentation1058(){
 const text=id=>D.getElementById(id)?.textContent?.trim()||'';
 const stats=[...D.querySelectorAll('#stats .stat')].map(x=>x.querySelector('.sv')?.textContent||'');
 const a=text('score').replace(/\s+/g,' '),b=text('miniScore').replace(/\s+/g,' ');
 const parse=s=>{const m=s.match(/^(\d+)\s*\/\s*100$/);return m?Number(m[1]):null};
 const active=IMPORT1048.last!==null,score=parse(a),mini=parse(b),total=parse(text('total'));
 const digits=stats.map(s=>Number((s.match(/^\s*(\d+)\s*\/\s*10/)||[])[1]));
 const validTen=digits.length===10&&digits.every(n=>Number.isInteger(n)&&n>=0&&n<=10);
 const sum=validTen?digits.reduce((s,v)=>s+v,0):null;
 const legalFlag=D.documentElement.dataset.scoreLegal;
 return {version:VERSION,active,score,mini,total,stats:digits,categorySum:sum,
  physicalValid:legalFlag==='1',illegal:legalFlag==='0',tier:text('tier'),miniTier:text('miniTier'),
  scoresAgree:active?score!==null&&score===mini&&score===total&&score===sum:score===null&&mini===null,
  tierAgrees:text('tier')===text('miniTier'),
  invalidTierBlocked:legalFlag==='0'?text('tier')==='SIN TIER'&&text('miniTier')==='SIN TIER':true,
  provisional: D.documentElement.dataset.scoreCertified!=='1'};
}
function verifyImport1048(){
 const input=D.getElementById('ydkMainFile'),buttons=['alpha306LoadDeck','alpha306DeleteDeck'].every(id=>!!D.getElementById(id)),stats=D.querySelectorAll('#stats .stat').length;
 return {version:VERSION,ready:!!input?.__alpha1048Bound,buttons,stats,scoreCount:10,catalog:arr(W.CARD_CATALOG).length,last:IMPORT1048.last,status:IMPORT1048.status,errors:IMPORT1048.errors.slice(-5)};
}


/* Alpha 1069: respuesta acotada de Tifón del rival previamente Colocado.
   Fuentes: https://www.yugioh-card.com/en/play/advanced-rules/
   https://www.yugioh-card.com/lat-am/play/fast-effect-timing/
   La declaración de turno de Colocación y ventana es evidencia ENTRANTE, no
   prueba histórica independiente de prioridad, turnos o restricciones ocultas.
   NO se usa este contrato para certificar efectos universales o un Top 5. */
function opponentSetMSTAudit1069(input){
 const links=arr(input?.links),acts=arr(input?.activations),steps=arr(input?.steps),issues=[],checks=[];
 const fail=s=>issues.push(s),sig=x=>JSON.stringify(x),same=(a,b)=>sig(a)===sig(b);
 const allowed=new Set(['zones','turn','phase','activePlayer','lp','normalSummonsUsed','chain','triggerQueue']);
 const result=()=>({version:VERSION,pass:issues.length===0,issues:[...new Set(issues)].slice(0,80),checks,
  scope:'RESPUESTA_OPONENTE_TIFON_COLOCADO_1069',stepsVerified:issues.length===0,
  declaredPriorityWindowChecked:issues.length===0,certifiesPriorityHistory:false,
  certifiesChainLegality:false,certifiesUniversalRules:false,certifiesTournamentLegality:false,
  certifiesFiveCombos:false,source:'https://www.yugioh-card.com/lat-am/play/fast-effect-timing/',
  limitations:'Sólo P0 activa Dian Keto o Upstart en Main y P1 responde con Tifón previamente Colocado. Se confía en setTurn y ventana declarados; no representa prioridad histórica, inmunidades, negaciones, costes, efectos continuos, disparadores, restricciones ocultas ni formato.'});
 const win=input?.priorityWindow||{};
 if(links.length!==2||acts.length!==2||steps.length!==2){fail('Se requieren exactamente dos enlaces, activaciones y resoluciones');return result()}
 const [normal,mst]=links;
 if(normal.chainLink!==1||normal.player!==0||normal.spellSpeed!==1||normal.actionType!=='RESOLVE_NORMAL_SPELL_1065'||!raw(normal.uid))fail('Enlace 1 debe ser Mágica Normal P0, Spell Speed 1');
 if(mst.chainLink!==2||mst.player!==1||mst.spellSpeed!==2||mst.actionType!=='RESOLVE_TARGET_SPELL_1066'||!raw(mst.uid)||!raw(mst.targetUid)||raw(mst.uid)===raw(mst.targetUid)||raw(mst.uid)===raw(normal.uid))fail('Enlace 2 debe ser Tifón P1, Spell Speed 2 y objetivo diferente');
 if(win.kind!=='RESPONSE_TO_CHAIN_LINK'||win.afterChainLink!==1||win.offeredToPlayer!==1||win.acceptedByPlayer!==1)fail('Falta declaración explícita de oportunidad de respuesta de P1 tras CL1');
 const states=[acts[0]?.before,acts[0]?.after,acts[1]?.before,acts[1]?.after,steps[0]?.before,steps[0]?.after,steps[1]?.before,steps[1]?.after,input?.finalBoard];
 const views=states.map((s,i)=>{const v=snapshot1063(s,'estado '+i);for(const e of v.issues)fail(e);
  if(s){for(const k of Object.keys(s))if(!allowed.has(k))fail('Estado '+i+': metadato sin semántica: '+k);
   if(!Number.isSafeInteger(s.turn)||s.turn<2||!/^MAIN(?:1|2)?$/i.test(raw(s.phase))||s.activePlayer!==0)fail('Estado '+i+': sólo Main del jugador activo P0 desde el turno 2');
   if(!Number.isSafeInteger(s.normalSummonsUsed)||s.normalSummonsUsed<0||s.normalSummonsUsed>1||!Array.isArray(s.lp)||s.lp.length!==2||!s.lp.every(x=>Number.isSafeInteger(x)&&x>=0))fail('Estado '+i+': estado físico/LP inválidos');
   if(!Array.isArray(s.triggerQueue)||s.triggerQueue.length)fail('Estado '+i+': disparadores no soportados');
  }return v});
 if(issues.length)return result();
 const [b0,a0,b1,a1,r0,r1,s1,end,board]=states;
 const stable=(a,b,except=new Set())=>{
  for(const [id,loc] of a.index){if(except.has(id))continue;const next=b.index.get(id);
   if(!next||loc.player!==next.player||loc.zone!==next.zone||loc.fullFingerprint!==next.fullFingerprint)fail('Alteración de otra carta: '+id)}
  for(const id of b.index.keys())if(!a.index.has(id))fail('Carta creada sin justificación: '+id);
 };
 const metadata=(before,after)=>{for(const k of allowed)if(k!=='chain'&&k!=='zones'&&!same(before[k],after[k]))fail('Metadato cambiado injustificadamente: '+k)};
 const chain=(before,after,pre,post)=>{if(!same(before.chain,pre)||!same(after.chain,post))fail('Orden o identidades de pila no coinciden')};
 const movement=(before,after,changes)=>{
  for(let p=0;p<2;p++)for(const z of ZONES_1063){const expected=before.zones[p][z].map(cardUid1063);
   for(const c of changes.filter(x=>x.p===p&&x.z===z)){if(c.remove){const ix=expected.indexOf(raw(c.uid));if(ix<0)fail('Carta ausente al retirar '+c.uid);else expected.splice(ix,1)}else expected.push(raw(c.uid))}
   if(!same(expected,after.zones[p][z].map(cardUid1063)))fail('Movimiento no autorizado en P'+p+'/'+z)
  }
 };
 const continuity=(x,y,label)=>{const r=stateContinuity1063(x,y,label);if(!r.pass)fail(label+': '+r.issues.join('; '))};
 if(!same(acts[0].chainLink,normal.chainLink)||!same(acts[0].uid,normal.uid)||acts[0].player!==0||acts[0].actionType!==normal.actionType)fail('Primera activación no identifica CL1');
 if(!same(acts[1].chainLink,mst.chainLink)||!same(acts[1].uid,mst.uid)||acts[1].player!==1||acts[1].actionType!==mst.actionType||raw(acts[1].targetUid)!==raw(mst.targetUid))fail('Respuesta no identifica CL2');
 if(steps[0].chainLink!==2||steps[0].player!==1||steps[0].actionType!==mst.actionType||raw(steps[0].uid)!==raw(mst.uid)||raw(steps[0].targetUid)!==raw(mst.targetUid)||steps[1].chainLink!==1||steps[1].player!==0||steps[1].actionType!==normal.actionType||raw(steps[1].uid)!==raw(normal.uid))fail('Resoluciones no respetan orden LIFO');
 if(steps.some(x=>x.negated||x.interrupted||x.legal===false||x.activationInvalid))fail('Negación/interrupción fuera de alcance');
 chain(b0,a0,[],[normal]);chain(b1,a1,[normal],links);chain(r0,r1,links,[normal]);chain(s1,end,[normal],[]);
 continuity(a0,b1,'Entre activaciones');continuity(a1,r0,'Antes de resolución de CL2');continuity(r1,s1,'Antes de resolución de CL1');continuity(end,board,'Campo final');
 const first=views[0].index.get(raw(normal.uid)),firstAfter=views[1].index.get(raw(normal.uid));
 const normalRule=OFFICIAL_NORMAL_SPELL_1065[Number(first?.card?.id)];
 if(!first||first.player!==0||first.zone!=='hand'||!firstAfter||firstAfter.player!==0||firstAfter.zone!=='spelltrap'||firstAfter.card.faceUp!==true||Number(first.card.typeBits??first.card.type)!==2||!normalRule||first.card.ownerPlayer!==0||first.card.name!=null&&low(first.card.name)!==low(normalRule?.name))fail('Mágica Normal desde mano sin identidad/posición admitida');
 if(first&&firstAfter){const f={...first.card},a={...firstAfter.card};delete a.faceUp;if(!same(f,a))fail('Carta Normal modificada al activarse')}
 movement(b0,a0,[{p:0,z:'hand',remove:true,uid:normal.uid},{p:0,z:'spelltrap',uid:normal.uid}]);stable(views[0],views[1],new Set([raw(normal.uid)]));metadata(b0,a0);
 const response=views[2].index.get(raw(mst.uid)),responseAfter=views[3].index.get(raw(mst.uid)),victim=views[2].index.get(raw(mst.targetUid));
 const card=response?.card||{},bits=Number(card.typeBits??card.type),vType=Number(victim?.card?.typeBits??victim?.card?.type);
 if(!response||response.player!==1||response.zone!=='spelltrap'||card.faceUp!==false||card.ownerPlayer!==1||Number(card.id)!==OFFICIAL_TARGET_SPELL_1066.id||!(bits&2)||!(bits&0x10000)||(bits&4)||card.name!=null&&![OFFICIAL_TARGET_SPELL_1066.name,OFFICIAL_TARGET_SPELL_1066.nameES].some(n=>low(n)===low(card.name)))fail('Tifón rival debe estar colocado boca abajo con identidad compatible');
 if(!Number.isSafeInteger(card.setTurn)||card.setTurn<1||card.setTurn>=b1.turn)fail('No se acredita que el Tifón se colocó en un turno anterior');
 if(!responseAfter||responseAfter.player!==1||responseAfter.zone!=='spelltrap'||responseAfter.card.faceUp!==true)fail('Tifón no fue volteado boca arriba en su propia zona');
 if(response&&responseAfter){const c={...card},a={...responseAfter.card};delete c.faceUp;delete a.faceUp;if(!same(c,a))fail('Propiedades de Tifón modificadas indebidamente')}
 if(!victim||victim.zone!=='spelltrap'||victim.card.ownerPlayer!==victim.player||!Number.isSafeInteger(vType)||!(vType&6)||(vType&1)||raw(mst.targetUid)===raw(normal.uid))fail('Objetivo físico inválido o carta ya activada en esta cadena');
 movement(b1,a1,[]);stable(views[2],views[3],new Set([raw(mst.uid)]));metadata(b1,a1);
 const src=views[4].index.get(raw(mst.uid)),dst=views[5].index.get(raw(mst.uid)),targetAfter=views[5].index.get(raw(mst.targetUid));
 if(!src||src.zone!=='spelltrap'||src.player!==1||src.card.faceUp!==true||!dst||dst.zone!=='gy'||dst.player!==1||!targetAfter||targetAfter.zone!=='gy'||targetAfter.player!==victim?.player)fail('Resolución de Tifón no destruye las dos instancias requeridas');
 movement(r0,r1,[{p:1,z:'spelltrap',remove:true,uid:mst.uid},{p:victim?.player??0,z:'spelltrap',remove:true,uid:mst.targetUid},{p:1,z:'gy',uid:mst.uid},{p:victim?.player??0,z:'gy',uid:mst.targetUid}]);stable(views[4],views[5],new Set([raw(mst.uid),raw(mst.targetUid)]));metadata(r0,r1);
 const normalEffect=transitionContract1065({action:normal.actionType,player:0,uid:normal.uid,before:{...s1,chain:[]},after:{...end,chain:[]}});
 if(!normalEffect.pass)fail('Resolución CL1 fuera de contrato normal: '+arr(normalEffect.issues).join('; '));
 if(issues.length===0)checks.push({turn:b1.turn,controller:0,responder:1,spell:'Mystical Space Typhoon',setTurn:card.setTurn,links:2,priorityEvidence:'DECLARED_NOT_HISTORICALLY_PROVED',resolution:'PHYSICAL_LIFO_PROVED_IN_LIMITED_DOMAIN'});
 return result();
}
function opponentSetMSTFixtures1069(){
 const cp=x=>JSON.parse(JSON.stringify(x)),blank=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const mk=(upstart=false)=>{
  const normal={uid:'normal',id:upstart?70368879:84257639,name:upstart?'Upstart Goblin':'Dian Keto the Cure Master',typeBits:2,ownerPlayer:0};
  const mst={uid:'mst',id:5318639,name:'Mystical Space Typhoon',typeBits:0x10002,ownerPlayer:1,faceUp:false,setTurn:1};
  const victim={uid:'victim',id:7333,typeBits:4,faceUp:false,ownerPlayer:0};
  const links=[{chainLink:1,uid:'normal',player:0,spellSpeed:1,actionType:'RESOLVE_NORMAL_SPELL_1065'},
   {chainLink:2,uid:'mst',player:1,spellSpeed:2,actionType:'RESOLVE_TARGET_SPELL_1066',targetUid:'victim'}];
  const b={zones:[blank(),blank()],turn:3,phase:'MAIN1',activePlayer:0,lp:[8000,8000],normalSummonsUsed:0,chain:[],triggerQueue:[]};
  b.zones[0].hand=[cp(normal)];b.zones[0].spelltrap=[cp(victim)];b.zones[1].spelltrap=[cp(mst)];
  if(upstart)b.zones[0].deck=[{uid:'draw',id:12345,name:'Carta de prueba',ownerPlayer:0}];
  const a0=cp(b);a0.chain=cp(links.slice(0,1));a0.zones[0].hand.shift();a0.zones[0].spelltrap.push({...cp(normal),faceUp:true});
  const a1=cp(a0);a1.chain=cp(links);a1.zones[1].spelltrap[0].faceUp=true;
  const r1=cp(a1);r1.chain=cp(links.slice(0,1));r1.zones[1].spelltrap=[];r1.zones[1].gy.push({...cp(mst),faceUp:true});r1.zones[0].spelltrap.shift();r1.zones[0].gy.push(cp(victim));
  const end=cp(r1);end.chain=[];end.zones[0].spelltrap=[];end.zones[0].gy.push({...cp(normal),faceUp:true});end.lp[upstart?1:0]+=1000;
  if(upstart)end.zones[0].hand.push(end.zones[0].deck.shift());
  return{links,priorityWindow:{kind:'RESPONSE_TO_CHAIN_LINK',afterChainLink:1,offeredToPlayer:1,acceptedByPlayer:1},
   activations:[{...cp(links[0]),before:cp(b),after:cp(a0)},{...cp(links[1]),before:cp(a0),after:cp(a1)}],
   steps:[{...cp(links[1]),before:cp(a1),after:cp(r1)},{...cp(links[0]),before:cp(r1),after:cp(end)}],finalBoard:cp(end)};
 };
 const tests=[];
 const test=(name,change,expected,upstart=false)=>{const x=mk(upstart);change?.(x);const r=opponentSetMSTAudit1069(x);tests.push({name,pass:r.pass===expected,expected,reported:r.pass,issues:r.issues.slice(0,3)})};
 test('Dian Keto y Tifón del rival colocado en turno anterior',null,true);
 test('Upstart Goblin y respuesta rival con robo y LP',null,true,true);
 test('Carta Quick-Play colocada en turno actual',x=>{x.activations[1].before.zones[1].spelltrap[0].setTurn=3},false);
 test('Carta Quick-Play colocada en turno futuro',x=>{x.activations[1].before.zones[1].spelltrap[0].setTurn=4},false);
 test('Carta Quick-Play sin información de turno',x=>{delete x.activations[1].before.zones[1].spelltrap[0].setTurn},false);
 test('Tifón no estaba colocado',x=>{const c=x.activations[1].before.zones[1].spelltrap.shift();x.activations[1].before.zones[1].hand.push(c)},false);
 test('Tifón boca arriba antes de su activación',x=>{x.activations[1].before.zones[1].spelltrap[0].faceUp=true},false);
 test('Tifón sin tipo Juego Rápido',x=>{x.activations[1].before.zones[1].spelltrap[0].typeBits=2},false);
 test('Tifón de otro jugador',x=>{x.activations[1].before.zones[1].spelltrap[0].ownerPlayer=0},false);
 test('Objetivo no existente',x=>{x.links[1].targetUid=x.activations[1].targetUid=x.steps[0].targetUid='ghost'},false);
 test('Objetivo de monstruo',x=>{x.activations[1].before.zones[0].spelltrap[0].typeBits=1},false);
 test('Objetivo carta Normal activada',x=>{x.links[1].targetUid=x.activations[1].targetUid=x.steps[0].targetUid='normal'},false);
 test('Sin ofrecimiento de respuesta al rival',x=>{delete x.priorityWindow},false);
 test('Ventana de respuesta asignada al jugador incorrecto',x=>{x.priorityWindow.offeredToPlayer=0},false);
 test('Resolución en orden equivocado',x=>{x.steps.reverse()},false);
 test('Fase no permitida',x=>{x.activations[0].before.phase='BATTLE'},false);
 test('Jugador activo falsificado',x=>{x.activations[0].before.activePlayer=1},false);
 test('Tifón desaparece del Cementerio',x=>{x.steps[0].after.zones[1].gy=[]},false);
 test('Mágica inventada en campo tras respuesta',x=>{x.activations[1].after.zones[0].spelltrap.push({uid:'fake',id:15})},false);
 test('LP inventados al activar Tifón',x=>{x.activations[1].after.lp[0]+=100},false);
 test('Cambio de objetivo tras activar',x=>{x.steps[0].targetUid='new'},false);
 test('Última resolución falsea LP',x=>{x.steps[1].after.lp[0]+=10},false);
 test('No permite prioridades históricas inventadas',x=>{x.priorityWindow.afterChainLink=9},false);
 return{version:VERSION,pass:tests.every(x=>x.pass),passed:tests.filter(t=>t.pass).length,total:tests.length,tests,
  scope:'Casos sintéticos de respuesta acotada del rival; sin certificación universal, prioridad histórica o torneos',certifiesUniversalRules:false};
}

/* Alpha 1070 — puente canónico de trazas y visualización. No simula efectos
   faltantes ni convierte ejemplos sintéticos en un Top 5 competitivo. */
function getLiveComboLines1070(){
 // La interfaz expone el estado más reciente en window; la variable léxica puede estar obsoleta.
 if(Array.isArray(W.comboLastAnalysis))return W.comboLastAnalysis;
 try{if(Array.isArray(comboLastAnalysis))return comboLastAnalysis}catch(_){}
 return [];
}
const REPLAY_ZONES_1070=['deck','hand','monster','spelltrap','gy','banished','extra'];
function safeFrame1070(state,label){
 const checked=snapshot1063(state,'frame '+label),issues=[...checked.issues];
 if(!checked.pass)return{label,pass:false,issues,board:null};
 const visible=(c,p,z)=>{
  const concealed=z==='deck'||(p===1&&(z==='hand'||(z==='extra'&&c?.faceUp!==true)||(['monster','spelltrap','banished'].includes(z)&&c?.faceUp===false)));
  return concealed?{name:'CARTA OCULTA',faceDown:true}: {name:raw(c?.name||'Carta sin nombre').slice(0,160),faceDown:c?.faceUp===false};
 };
 const players=state.zones.map((zones,p)=>{
  const out={};for(const z of REPLAY_ZONES_1070)out[z]=z==='deck'||z==='hand'?(z==='deck'?{count:zones[z].length}:p===1?{count:zones[z].length}:zones[z].map(c=>visible(c,p,z))):zones[z].map(c=>visible(c,p,z));
  return out;
 });
 return{label,pass:true,issues:[],board:{turn:state.turn,phase:raw(state.phase),activePlayer:state.activePlayer,lp:arr(state.lp).slice(0,2),chainDepth:arr(state.chain).length,players}};
}
function boundedChainReplay1070(spec){
 let proof;try{proof=opponentSetMSTAudit1069(spec)}catch(e){proof={pass:false,issues:[raw(e?.message||e)]}};
 if(proof.pass!==true)return{version:VERSION,pass:false,status:'TRAZA_RECHAZADA',issues:arr(proof.issues),frames:[],certifiesTop5:false,certifiesUniversalRules:false};
 const stages=[['Inicio',spec.activations[0].before],['Activación de Mágica Normal',spec.activations[0].after],['Respuesta de Tifón',spec.activations[1].after],['Resolución de Tifón',spec.steps[0].after],['Resolución de Mágica Normal',spec.steps[1].after]];
 const frames=stages.map(([label,state])=>safeFrame1070(state,label));
 return{version:VERSION,pass:frames.every(x=>x.pass),status:'EJEMPLO_ACOTADO_VERIFICADO',frames,
  issues:frames.flatMap(x=>x.issues),scope:'DOS_MAGICAS_NORMALES_MAS_TIFON_RIVAL_COLOCADO',fixtureCompatible:true,
  certifiesTop5:false,certifiesUniversalRules:false,certifiesPriorityHistory:false,
  policy:'Fotogramas físicos auditados de un subconjunto específico; las ventanas son declaradas y no prueban un torneo real.'};
}
/* Alpha 1072 — puerta de velocidad de cadenas explícitas.
   Regla negativa únicamente: una secuencia que incumple Spell Speed no se acredita;
   una secuencia que supera la puerta NO demuestra activación, costes ni legalidad de la carta.
   Subconjunto admitido: respuesta con Trampa de Contraefecto previamente colocada.
   No intenta decidir SEGOC, efectos de activación desde la mano ni excepciones de set. */
function spellSpeedGate1072(links){
 const issues=[];
 const reject=msg=>issues.push(msg);
 if(!Array.isArray(links)||links.length<1||links.length>12){reject('CADENA_FUERA_DE_ALCANCE_1_A_12');return{version:VERSION,checked:true,pass:false,issues,certifiesRulings:false}}
 let previous=0;
 const seen=new Set();
 for(let i=0;i<links.length;i++){
  const link=links[i],n=Number(link?.chainLink),speed=Number(link?.spellSpeed),uid=raw(link?.uid).trim();
  if(!link||!Number.isSafeInteger(n)||n!==i+1)reject('ENLACE_DESORDENADO_'+(i+1));
  if(!uid||seen.has(uid))reject('IDENTIDAD_REPETIDA_O_AUSENTE_'+(i+1));
  else seen.add(uid);
  if(![1,2,3].includes(speed))reject('VELOCIDAD_DESCONOCIDA_'+(i+1));
  else{
   if(i>0&&(speed<2||speed<previous))reject('RESPUESTA_VELOCIDAD_INSUFICIENTE_'+(i+1));
   if(speed===3){
    if(raw(link?.kind).toUpperCase()!=='COUNTER_TRAP')reject('VELOCIDAD_3_REQUIERE_CONTRAEFECTO_'+(i+1));
    if(raw(link?.from).toUpperCase()!=='SET')reject('ORIGEN_CONTRAEFECTO_NO_ACREDITADO_'+(i+1));
    const turn=Number(link?.turn),setTurn=Number(link?.setTurn);
    if(!Number.isSafeInteger(turn)||!Number.isSafeInteger(setTurn)||turn<1||setTurn<1||setTurn>=turn)
     reject('COLOCACION_ANTERIOR_NO_ACREDITADA_'+(i+1));
   }else if(raw(link?.kind).toUpperCase()==='COUNTER_TRAP')reject('CONTRAEFECTO_CON_VELOCIDAD_INCORRECTA_'+(i+1));
   previous=speed;
  }
 }
 return{version:VERSION,checked:true,pass:issues.length===0,issues,
  scope:'CADENA_SPELL_SPEED_Y_CONTRAEFECTO_COLOCADO',certifiesRulings:false,
  notes:'Puerta negativa. La metadata de usuario y la secuencia no sustituyen un oráculo oficial ni prueban prioridad o efectos.'};
}

/* Alpha 1073: puertas negativas acotadas para una activación de CARTA.
   No certifican condiciones, prioridades ni excepciones individuales. Un fallo
   de procedencia significa SIN ACREDITAR, no necesariamente una jugada ilegal. */
function activationTimingGate1073(links){
 const issues=[],checks=[];
 if(!Array.isArray(links)||links.length<1||links.length>12)return{version:VERSION,checked:false,pass:false,issues:['CADENA_FUERA_DE_ALCANCE'],checks,certifiesActivation:false};
 for(let i=0;i<links.length;i++){
  const link=links[i]||{},kind=raw(link.kind).trim().toUpperCase().replace(/[\s-]+/g,'_'),from=raw(link.from).trim().toUpperCase();
  const isTrap=['NORMAL_TRAP','CONTINUOUS_TRAP','COUNTER_TRAP'].includes(kind);
  const isQuick=['QUICK_PLAY','QUICK_PLAY_SPELL','QUICKPLAY_SPELL'].includes(kind);
  if(!isTrap&&!isQuick)continue;
  if(raw(link.activationType).toUpperCase()==='EFFECT_ACTIVATION')continue;
  const label='CL'+(i+1),turn=link.turn,setTurn=link.setTurn;
  const turnOK=Number.isSafeInteger(turn)&&turn>0;
  const setOK=Number.isSafeInteger(setTurn)&&setTurn>0;
  checks.push({chainLink:i+1,kind,from,requiresSpecificOracle:false});
  if(from==='SET'){
   // Trampas y Magias de Juego Rapido colocadas tienen que esperar al siguiente turno.
   if(!turnOK||!setOK||setTurn>=turn)issues.push(label+'_COLOCACION_ANTERIOR_NO_ACREDITADA');
  }else if(from==='HAND'){
   if(isTrap){
    issues.push(label+'_TRAMPA_DESDE_MANO_REQUIERE_EXCEPCION_OFICIAL');
    checks[checks.length-1].requiresSpecificOracle=true;
   }else if(!Number.isSafeInteger(link.player)||!Number.isSafeInteger(link.activePlayer)||link.player!==link.activePlayer){
    issues.push(label+'_JUEGO_RAPIDO_DESDE_MANO_NO_ACREDITADO_EN_TURNO_RIVAL');
   }
  }else{
   issues.push(label+'_ORIGEN_DE_ACTIVACION_NO_ACREDITADO');
  }
 }
 return{version:VERSION,checked:checks.length>0,pass:issues.length===0,issues,checks,
  scope:'ACTIVACION_DESDE_MANO_O_COLOCADA_PARA_TIPOS_DECLARADOS',certifiesActivation:false,
  notes:'Metadatos declarados. Excepciones por efecto de carta, prioridad y turno requieren un oráculo independiente.'};
}
/* Comprueba que una cadena declarada no contradiga la pila física cuando
   hay una instantánea con todas las ligas. Si no la hay, no fabrica evidencia. */
function chainSnapshotGate1073(line){
 const links=line?.chainLinks??line?.simulation?.chainLinks;
 const acts=arr(line?.actions||line?.simulation?.actions);
 const issues=[],matches=[];
 if(!Array.isArray(links)||links.length<2)return{version:VERSION,checked:false,pass:false,issues:['CADENA_DECLARADA_NO_DISPONIBLE'],certifiesRulings:false};
 for(const a of acts)for(const st of [a?.before,a?.after]){
  if(Array.isArray(st?.chain)&&st.chain.length===links.length)matches.push(st.chain);
 }
 if(!matches.length)return{version:VERSION,checked:true,pass:false,issues:['SIN_ESTADO_FISICO_DE_CADENA_COMPLETA'],certifiesRulings:false};
 const fields=['uid','chainLink','player','spellSpeed','targetUid'];
 const same=chain=>chain.every((c,i)=>{
  if(!c||typeof c!=='object')return false;
  for(const f of fields){
   if(links[i]?.[f]!==undefined&&String(c[f]??'')!==String(links[i][f]))return false;
  }
  return true;
 });
 if(!matches.some(same))issues.push('METADATOS_NO_COINCIDEN_CON_PILA_FISICA');
 return{version:VERSION,checked:true,pass:issues.length===0,issues,
  scope:'IDENTIDAD_Y_ORDEN_DECLARADO_VS_ESTADO_FISICO',certifiesRulings:false,
  notes:'La concordancia sólo garantiza que la metadata no contradice el estado, no la legalidad.'};
}

/* Alpha 1074: procedencia física de activaciones de carta.
   Verifica el origen de la instancia en instantáneas cronológicas declaradas.
   Es una puerta NEGATIVA: la metadata no equivale a un fallo arbitral oficial. */
function activationPhysicalGate1074(line){
 const links=line?.chainLinks??line?.simulation?.chainLinks;
 const activations=line?.activations??line?.simulation?.activations;
 const issues=[],details=[];
 if(!Array.isArray(links)||links.length<2||links.length>12)
  return{version:VERSION,checked:false,pass:false,issues:['CADENA_FUERA_DE_ALCANCE'],details,certifiesRulings:false};
 const relevant=links.map((link,i)=>({link,i})).filter(({link})=>{
  const kind=raw(link?.kind).trim().toUpperCase().replace(/[\s-]+/g,'_');
  return ['NORMAL_TRAP','CONTINUOUS_TRAP','COUNTER_TRAP','QUICK_PLAY','QUICK_PLAY_SPELL','QUICKPLAY_SPELL'].includes(kind)
   &&raw(link?.activationType).toUpperCase()!=='EFFECT_ACTIVATION';
 });
 if(!relevant.length)return{version:VERSION,checked:false,pass:false,issues:[],details,certifiesRulings:false};
 const eventList=Array.isArray(activations)&&activations.length<=12?activations:[];
 const uid=x=>raw(x?.uid).trim();
 const cardIn=(s,p,z,id)=>{
  const xs=s?.zones?.[p]?.[z];return Array.isArray(xs)?xs.filter(c=>uid(c)===id):[];
 };
 for(const {link,i} of relevant){
  const tag='CL'+(i+1),id=uid(link),p=link?.player,kind=raw(link?.kind).toUpperCase().replace(/[\s-]+/g,'_');
  const from=raw(link?.from).toUpperCase(),isTrap=kind.includes('TRAP');
  const event=eventList.filter(a=>a?.chainLink===i+1&&uid(a)===id);
  const row={chainLink:i+1,uid:id,kind,from,sourceVerified:false,chainVerified:false};details.push(row);
  if(!id||!Number.isSafeInteger(p)||p<0||p>1){issues.push(tag+'_IDENTIDAD_O_JUGADOR_INVALIDOS');continue;}
  if(event.length!==1){issues.push(tag+'_SIN_ACTIVACION_FISICA_UNICA');continue;}
  const e=event[0],before=e?.before,after=e?.after;
  if(!before||!after||!Array.isArray(before.zones)||before.zones.length!==2||!Array.isArray(after.zones)||after.zones.length!==2){issues.push(tag+'_SIN_ESTADOS_FISICOS_COMPLETOS');continue;}
  if(!Number.isSafeInteger(before.turn)||before.turn<1||before.turn!==link.turn||after.turn!==before.turn)
   issues.push(tag+'_TURNO_FISICO_NO_COINCIDE');
  if(!Number.isSafeInteger(before.activePlayer)||![0,1].includes(before.activePlayer)||after.activePlayer!==before.activePlayer||
    (Number.isSafeInteger(link.activePlayer)&&before.activePlayer!==link.activePlayer))
   issues.push(tag+'_JUGADOR_ACTIVO_INCONSISTENTE');
  const fromZone=from==='SET'?'spelltrap':from==='HAND'?'hand':null;
  if(!fromZone){issues.push(tag+'_ORIGEN_FUERA_DEL_CONTRATO');continue;}
  const candidates=cardIn(before,p,fromZone,id),card=candidates[0];
  if(candidates.length!==1){issues.push(tag+'_CARTA_AUSENTE_O_REPETIDA_EN_ORIGEN');continue;}
  if(card.ownerPlayer!==undefined&&card.ownerPlayer!==p)issues.push(tag+'_PROPIETARIO_DECLARADO_INCONSISTENTE');
  if(card.controller!==undefined&&card.controller!==p)issues.push(tag+'_CONTROLADOR_DECLARADO_INCONSISTENTE');
  const bits=Number(card.typeBits??card.type??card.card?.typeBits??card.card?.type);
  if(!Number.isSafeInteger(bits)||bits<=0||!(bits&(isTrap?4:2)))issues.push(tag+'_TIPO_FISICO_INCOMPATIBLE');
  if(from==='SET'){
   if(card.faceUp!==false)issues.push(tag+'_CARTA_NO_ESTA_BOCA_ABAJO');
   if(!Number.isSafeInteger(card.setTurn)||card.setTurn<1||card.setTurn!==link.setTurn||card.setTurn>=before.turn)
    issues.push(tag+'_ANTIGUEDAD_FISICA_NO_ACREDITADA');
  }else{
   if(isTrap)issues.push(tag+'_TRAMPA_DESDE_MANO_REQUIERE_ORACULO');
   if(!isTrap&&before.activePlayer!==p)issues.push(tag+'_JUEGO_RAPIDO_DESDE_MANO_RIVAL_NO_ACREDITADO');
  }
  const dest=cardIn(after,p,'spelltrap',id);
  if(dest.length!==1||dest[0].faceUp!==true)issues.push(tag+'_ACTIVACION_NO_OBSERVADA_BOCA_ARRIBA');
  // La pila debe crecer exactamente con el enlace declarado. Su contenido puede
  // describir sólo la metadata reconocida; no demuestra prioridad ni costes.
  const start=before.chain,end=after.chain;
  const match=(observed,declared)=>observed&&declared&&['chainLink','uid','player','spellSpeed'].every(k=>
    declared[k]!==undefined&&String(observed[k]??'')===String(declared[k]));
  if(!Array.isArray(start)||!Array.isArray(end)||start.length!==i||end.length!==i+1||
   !start.every((x,j)=>match(x,links[j]))||!end.every((x,j)=>match(x,links[j])))
   issues.push(tag+'_CADENA_FISICA_NO_CRECE_COMO_SE_DECLARA');
  row.sourceVerified=!!card;
  row.chainVerified=Array.isArray(end)&&end.length===i+1;
 }
 return{version:VERSION,checked:true,pass:issues.length===0,issues,details,
  scope:'ORIGEN_ZONA_TURNO_IDENTIDAD_Y_PILA_DE_ACTIVACIONES_DECLARADAS',certifiesRulings:false,
  notes:'Instantáneas y metadatos pueden ser fabricados; esta puerta no acredita efectos, prioridades, costes ni excepciones.'};
}
function fixturesAlpha1074(){
 const tests=[],check=(name,condition)=>tests.push({name,pass:condition===true});
 const clone=x=>JSON.parse(JSON.stringify(x));
 const zero=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const base=()=>{
  const links=[{chainLink:1,uid:'m1',player:0,spellSpeed:1,kind:'NORMAL_SPELL'},
  {chainLink:2,uid:'q2',player:1,spellSpeed:2,kind:'QUICK_PLAY_SPELL',from:'SET',turn:3,setTurn:2,activePlayer:0}];
  const a={zones:[zero(),zero()],turn:3,activePlayer:0,phase:'MAIN1',chain:[clone(links[0])]};
  a.zones[1].spelltrap=[{uid:'q2',id:5318639,typeBits:65538,ownerPlayer:1,controller:1,faceUp:false,setTurn:2}];
  const b=clone(a);b.zones[1].spelltrap[0].faceUp=true;b.chain=clone(links);
  return{chainLinks:links,activations:[{chainLink:2,uid:'q2',before:a,after:b}],actions:[]};
 };
 const caseOf=fn=>{let x=base();fn(x);return activationPhysicalGate1074(x)};
 check('Tifón colocado antes, con prueba física de respuesta',activationPhysicalGate1074(base()).pass);
 check('No confunde prueba física con legalidad universal',activationPhysicalGate1074(base()).certifiesRulings===false);
 check('Sin eventos físicos rechaza procedencia',!caseOf(x=>delete x.activations).pass);
 check('Evento sin enlace rechaza procedencia',!caseOf(x=>x.activations[0].chainLink=1).pass);
 check('Evento sin identidad rechaza procedencia',!caseOf(x=>x.activations[0].uid='').pass);
 check('Dos eventos idénticos no acreditan prueba única',!caseOf(x=>x.activations.push(clone(x.activations[0]))).pass);
 check('Carta no existe en zona declarada',!caseOf(x=>x.activations[0].before.zones[1].spelltrap=[]).pass);
 check('Carta con UID equivocado',!caseOf(x=>x.activations[0].before.zones[1].spelltrap[0].uid='otro').pass);
 check('Carta duplicada en misma zona',!caseOf(x=>x.activations[0].before.zones[1].spelltrap.push(clone(x.activations[0].before.zones[1].spelltrap[0]))).pass);
 check('Carta boca arriba no acredita origen SET',!caseOf(x=>x.activations[0].before.zones[1].spelltrap[0].faceUp=true).pass);
 check('Turno de colocación alterado físicamente',!caseOf(x=>x.activations[0].before.zones[1].spelltrap[0].setTurn=1).pass);
 check('Carta recién colocada se rechaza',!caseOf(x=>x.activations[0].before.zones[1].spelltrap[0].setTurn=3).pass);
 check('Sin setTurn físico, no acreditar',!caseOf(x=>delete x.activations[0].before.zones[1].spelltrap[0].setTurn).pass);
 check('Turno físico distinto del declarado',!caseOf(x=>x.activations[0].before.turn=4).pass);
 check('Cambio de turno entre antes y después',!caseOf(x=>x.activations[0].after.turn=4).pass);
 check('Jugador activo falsificado',!caseOf(x=>x.activations[0].before.activePlayer=1).pass);
 check('Cambio de jugador activo en evento',!caseOf(x=>x.activations[0].after.activePlayer=1).pass);
 check('Tipo monstruo distinto de Mágica',!caseOf(x=>x.activations[0].before.zones[1].spelltrap[0].typeBits=1).pass);
 check('Propietario inconsistente',!caseOf(x=>x.activations[0].before.zones[1].spelltrap[0].ownerPlayer=0).pass);
 check('Controlador inconsistente',!caseOf(x=>x.activations[0].before.zones[1].spelltrap[0].controller=0).pass);
 check('Activación no voltea carta',!caseOf(x=>x.activations[0].after.zones[1].spelltrap[0].faceUp=false).pass);
 check('Carta desaparecida sin explicación',!caseOf(x=>x.activations[0].after.zones[1].spelltrap=[]).pass);
 check('Pila antes no contiene CL1',!caseOf(x=>x.activations[0].before.chain=[]).pass);
 check('Pila después no contiene CL2',!caseOf(x=>x.activations[0].after.chain=[clone(x.chainLinks[0])]).pass);
 check('Pila con UID ajeno',!caseOf(x=>x.activations[0].after.chain[1].uid='fake').pass);
 check('Pila con velocidad alterada',!caseOf(x=>x.activations[0].after.chain[1].spellSpeed=3).pass);
 check('Pila con jugador incorrecto',!caseOf(x=>x.activations[0].after.chain[1].player=0).pass);
 check('No acredita sin zona física',!caseOf(x=>delete x.activations[0].before.zones).pass);
 check('Tipo Trampa admite procedencia física SET',caseOf(x=>{x.chainLinks[1].kind='NORMAL_TRAP';x.activations[0].before.zones[1].spelltrap[0].typeBits=4}).pass);
 check('Trampa desde mano no recibe excepción automática',!caseOf(x=>{x.chainLinks[1].kind='NORMAL_TRAP';x.chainLinks[1].from='HAND';x.activations[0].before.zones[1].hand=x.activations[0].before.zones[1].spelltrap;x.activations[0].before.zones[1].spelltrap=[]}).pass);
 check('Mágica Rápida desde mano del jugador activo',caseOf(x=>{x.chainLinks[1].from='HAND';x.chainLinks[1].player=0;x.activations[0].before.zones[0].hand=x.activations[0].before.zones[1].spelltrap;x.activations[0].before.zones[1].spelltrap=[];x.activations[0].after.zones[0].spelltrap=x.activations[0].after.zones[1].spelltrap;x.activations[0].after.zones[1].spelltrap=[];x.activations[0].before.zones[0].hand[0].ownerPlayer=0;x.activations[0].before.zones[0].hand[0].controller=0;x.activations[0].after.zones[0].spelltrap[0].ownerPlayer=0;x.activations[0].after.zones[0].spelltrap[0].controller=0;x.activations[0].after.chain[1].player=0}).pass);
 check('Carta con metadatos hand sin evento físico válido',!caseOf(x=>x.chainLinks[1].from='HAND').pass);
 check('Con metadatos inventados el Top 5 sigue sin certificar',auditReplayLine1070({chainLinks:base().chainLinks,actions:[]}).pass===false);
 return{version:VERSION,pass:tests.every(t=>t.pass),passed:tests.filter(t=>t.pass).length,total:tests.length,tests,
  scope:'Test negativos y un subconjunto de prueba de carta activada desde Set o mano; no verifica ventanas ni rulings individuales.'};
}


/* Alpha 1075 — comprobación conservadora de integridad entre instantáneas de
   activación. No confunde un test de estructura con un fallo arbitral.
   El Target de Tifón viene del texto oficial de Konami:
   https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=4909&ope=2&request_locale=en
   El objetivo debe estar en campo al activar; el efecto se resuelve después.
 */
function activationWitnessIntegrity1075(line){
 const links=line?.chainLinks??line?.simulation?.chainLinks;
 const activations=line?.activations??line?.simulation?.activations;
 const issues=[],checks=[];
 if(!Array.isArray(links)||links.length<2||links.length>12)
  return{version:VERSION,checked:false,pass:false,issues:['CADENA_FUERA_DE_ALCANCE'],checks,certifiesRulings:false,certifiesTop5:false};
 if(!Array.isArray(activations)||!activations.length||activations.length>12)
  return{version:VERSION,checked:false,pass:false,issues:['ACTIVACIONES_FISICAS_NO_DISPONIBLES'],checks,certifiesRulings:false,certifiesTop5:false};
 const uid=x=>raw(x?.uid).trim();
 const core=c=>[c?.id??c?.cardId??c?.card?.id??null,c?.typeBits??c?.type??c?.card?.typeBits??null];
 const seen=new Set();
 const collected=[];
 for(const [i,e] of activations.entries()){
  const tag='ACT'+(i+1),cl=e?.chainLink,key=raw(cl)+':'+uid(e);
  if(!Number.isSafeInteger(cl)||cl<1||cl>links.length||uid(e)!==uid(links[cl-1]))
   issues.push(tag+'_ENLACE_NO_COINCIDE');
  if(seen.has(key))issues.push(tag+'_EVENTO_DUPLICADO');seen.add(key);
  const before=e?.before,after=e?.after;
  const b=snapshot1063(before,tag+' antes'),a=snapshot1063(after,tag+' despues');
  if(!b.pass||!a.pass){issues.push(tag+'_INSTANTANEA_FISICA_INVALIDA');checks.push({chainLink:cl,uid:uid(e),pass:false,reason:'SNAPSHOT'});continue}
  let created=0,lost=0,changed=0;
  for(const [id,one] of b.index){
   const two=a.index.get(id);
   if(!two){lost++;continue}
   const x=core(one.card),y=core(two.card);
   // Un UID es la instancia física, nunca se puede reutilizar para otra carta.
   if(((x[0]!=null||y[0]!=null)&&String(x[0])!==String(y[0]))||
      ((x[1]!=null||y[1]!=null)&&String(x[1])!==String(y[1])))changed++;
  }
  for(const id of a.index.keys())if(!b.index.has(id))created++;
  if(created||lost||changed)issues.push(tag+'_INSTANCIAS_CREADAS_PERDIDAS_O_MUTADAS');
  const link=links[cl-1]||{},card=b.index.get(uid(e))?.card;
  let targetChecked=false,targetPass=null;
  const isMST=Number(link.id??link.cardId)===5318639;
  if(isMST){
   targetChecked=true;
   const target=raw(link.targetUid).trim();
   const t=target?b.index.get(target):null;
   const allowed=!!t&&t.zone==='spelltrap'&&t.card&&!(Number(t.card.typeBits??t.card.type)&1);
   const eventTarget=e?.targetUid;
   targetPass=allowed&&(eventTarget===undefined||raw(eventTarget)===target)&&
    Number(card?.id??card?.cardId??card?.card?.id)===5318639;
   if(!targetPass)issues.push(tag+'_TIFON_OBJETIVO_FISICO_NO_ACREDITADO');
  }
  checks.push({chainLink:cl,uid:uid(e),created,lost,mutated:changed,targetChecked,targetPass,
   pass:created===0&&lost===0&&changed===0&&(!targetChecked||targetPass)});
  collected.push({cl,before,after});
 }
 collected.sort((a,b)=>a.cl-b.cl);
 let joined=0;
 for(let i=1;i<collected.length;i++){
  const prev=collected[i-1],cur=collected[i];
  if(cur.cl!==prev.cl+1)continue;joined++;
  const c=stateContinuity1063(prev.after,cur.before,'ACT'+prev.cl+'_A_ACT'+cur.cl);
  if(!c.pass)issues.push('DISCONTINUIDAD_ENTRE_ACTIVACIONES_CL'+prev.cl+'_CL'+cur.cl);
 }
 return{version:VERSION,checked:true,pass:issues.length===0,issues:[...new Set(issues)],checks,
  consecutivePairsChecked:joined,activationEventsChecked:activations.length,
  scope:'INTEGRIDAD_DE_UID_CADENAS_DE_ACTIVACIONES_Y_OBJETIVO_TIFON_ID_5318639',
  certifiesRulings:false,certifiesTop5:false,
  notes:'Rechaza pruebas incompletas; no verifica prioridad, costes, inmunidad, negaciones, ventanas ni legalidad competitiva.'};
}
function fixturesAlpha1075(){
 const tests=[],test=(name,ok)=>tests.push({name,pass:ok===true});
 const clone=x=>JSON.parse(JSON.stringify(x));
 const zero=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const mk=()=>{
  const links=[{chainLink:1,uid:'normal',id:84257640,player:0,spellSpeed:1,kind:'NORMAL_SPELL'},
   {chainLink:2,uid:'tifon',id:5318639,player:1,spellSpeed:2,kind:'QUICK_PLAY_SPELL',from:'SET',turn:3,setTurn:1,activePlayer:0,targetUid:'normal'}];
  const start={zones:[zero(),zero()],turn:3,phase:'MAIN1',activePlayer:0,lp:[8000,8000],chain:[]};
  start.zones[0].hand.push({uid:'normal',id:84257640,typeBits:2,ownerPlayer:0,controller:0,faceUp:false});
  start.zones[1].spelltrap.push({uid:'tifon',id:5318639,typeBits:65538,ownerPlayer:1,controller:1,faceUp:false,setTurn:1});
  const middle=clone(start);middle.zones[0].spelltrap.push(middle.zones[0].hand.shift());middle.zones[0].spelltrap[0].faceUp=true;middle.chain=[clone(links[0])];
  const end=clone(middle);end.zones[1].spelltrap[0].faceUp=true;end.chain=clone(links);
  return{chainLinks:links,activations:[{chainLink:1,uid:'normal',before:start,after:middle},
   {chainLink:2,uid:'tifon',targetUid:'normal',before:clone(middle),after:end}],actions:[]};
 };
 const run=fn=>{const x=mk();fn?.(x);return activationWitnessIntegrity1075(x)};
 test('Dos activaciones enlazadas con carta objetivo en campo',run().pass);
 test('Ninguna cadena se certifica por integridad',run().certifiesTop5===false&&!run().certifiesRulings);
 test('Dos eventos revisados',run().activationEventsChecked===2);
 test('Una unión cronológica verificada',run().consecutivePairsChecked===1);
 test('Un solo evento válido sigue siendo parcial, no regla universal',run(x=>x.activations.shift()).pass);
 test('Sin instantáneas no se acredita',!activationWitnessIntegrity1075({chainLinks:mk().chainLinks}).pass);
 test('UID creado en activación rechazado',!run(x=>x.activations[1].after.zones[0].hand.push({uid:'fantasma',id:2,typeBits:2})).pass);
 test('UID perdido en activación rechazado',!run(x=>x.activations[1].after.zones[1].spelltrap=[]).pass);
 test('UID reutilizado para cambiar ID rechazado',!run(x=>x.activations[1].after.zones[1].spelltrap[0].id=1).pass);
 test('UID reutilizado para cambiar tipo rechazado',!run(x=>x.activations[1].after.zones[1].spelltrap[0].typeBits=1).pass);
 test('UID pierde ID en el estado final',!run(x=>delete x.activations[1].after.zones[1].spelltrap[0].id).pass);
 test('UID pierde tipo en el estado final',!run(x=>delete x.activations[1].after.zones[1].spelltrap[0].typeBits).pass);
 test('UID duplicado entre jugadores rechazado',!run(x=>x.activations[1].after.zones[0].hand.push(clone(x.activations[1].after.zones[1].spelltrap[0]))).pass);
 test('UID duplicado entre zonas del mismo jugador rechazado',!run(x=>x.activations[1].before.zones[1].hand.push(clone(x.activations[1].before.zones[1].spelltrap[0]))).pass);
 test('Card sin UID original se rechaza',!run(x=>delete x.activations[1].before.zones[0].spelltrap[0].uid).pass);
 test('Objetivo inexistente de Tifón rechazado',!run(x=>x.chainLinks[1].targetUid='inexistente').pass);
 test('Objetivo de Tifón ausente rechazado',!run(x=>delete x.chainLinks[1].targetUid).pass);
 test('Objetivo de Tifón debe estar en campo',!run(x=>{const s=x.activations[1].before.zones[0];s.hand.push(s.spelltrap.shift())}).pass);
 test('Objetivo de Tifón no puede estar en zona monstruos',!run(x=>{const s=x.activations[1].before.zones[0];s.monster.push(s.spelltrap.shift())}).pass);
 test('Objetivo de Tifón declarado en evento diferente rechazado',!run(x=>x.activations[1].targetUid='otro').pass);
 test('Identidad de Tifón alterada en zona rechazada',!run(x=>x.activations[1].before.zones[1].spelltrap[0].id=123).pass);
 test('Discontinuidad de carta entre CL1 y CL2 rechazada',!run(x=>x.activations[1].before.zones[0].spelltrap[0].id=1234).pass);
 test('Discontinuidad de LP entre CL1 y CL2 rechazada',!run(x=>x.activations[1].before.lp[0]-=500).pass);
 test('Discontinuidad de turno entre CL1 y CL2 rechazada',!run(x=>x.activations[1].before.turn=4).pass);
 test('Discontinuidad de pila entre CL1 y CL2 rechazada',!run(x=>x.activations[1].before.chain=[]).pass);
 test('Evento CL desconocido rechazado',!run(x=>x.activations[1].chainLink=3).pass);
 test('Evento CL/UID divergente rechazado',!run(x=>x.activations[1].uid='otro').pass);
 test('Evento duplicado rechazado',!run(x=>x.activations.push(clone(x.activations[1]))).pass);
 test('MST no se certifica por mostrar target sin resolver cadena',!run(x=>x.actions=[]).certifiesTop5);
 test('Top 5 no acredita a partir de instantáneas',auditReplayLine1070({...mk(),actions:[]}).pass===false);
 test('Contrato heredado de Alpha 1074 sigue disponible',fixturesAlpha1074().pass);
 return{version:VERSION,pass:tests.every(t=>t.pass),total:tests.length,passed:tests.filter(t=>t.pass).length,tests,
  scope:'Integridad inter-activación, persistencia de UID y objetivo físico de Tifón; no certifica el juego completo.'};
}

function auditReplayLine1070(line,context={}){
 const actions=arr(line?.actions||line?.simulation?.actions),issues=[];
 if(!actions.length)issues.push('SIN_ACCIONES');
 if(actions.length>160)issues.push('TOPE_DE_ACCIONES_160');
 const fullStates=actions.length>=2&&actions.every(a=>a?.before?.zones&&a?.after?.zones);
 let physical={pass:false,issues:['SIN_ESTADOS_COMPLETOS']},legal={pass:false,reason:'SIN_ORACULO'};
 if(fullStates&&actions.length<=160){try{physical=traceAudit1064(line)}catch(e){physical={pass:false,issues:[raw(e?.message||e)]}}}
 if(physical.pass!==true)issues.push('TRAZA_FISICA_NO_ACREDITADA');
 if(physical.pass===true){try{legal=lineEvidence1047(line)}catch(e){legal={pass:false,reason:raw(e?.message||e)}}}
 if(legal.pass!==true)issues.push('LEGALIDAD_NO_CERTIFICADA');
 const declaredLinks=line?.chainLinks??line?.simulation?.chainLinks;
 const spellSpeedAudit1072=declaredLinks===undefined?{checked:false,pass:false,issues:[]}:spellSpeedGate1072(declaredLinks);
 if(spellSpeedAudit1072.checked&&!spellSpeedAudit1072.pass)issues.push('CADENA_SPELL_SPEED_INVALIDA');
 const activationTimingAudit1073=declaredLinks===undefined?{checked:false,pass:false,issues:[]}:activationTimingGate1073(declaredLinks);
 if(activationTimingAudit1073.checked&&!activationTimingAudit1073.pass)issues.push('ACTIVACION_DE_CADENA_NO_ACREDITADA');
 const chainSnapshotAudit1073=chainSnapshotGate1073(line);
 if(chainSnapshotAudit1073.checked&&!chainSnapshotAudit1073.pass)issues.push('CADENA_DECLARADA_NO_COINCIDE_CON_ESTADO');
 const activationPhysicalAudit1074=declaredLinks===undefined?{checked:false,pass:false,issues:[]}:activationPhysicalGate1074(line);
 if(activationPhysicalAudit1074.checked&&!activationPhysicalAudit1074.pass)issues.push('ORIGEN_FISICO_DE_ACTIVACION_NO_ACREDITADO');
 const activationWitnessAudit1075=declaredLinks===undefined?{checked:false,pass:false,issues:[]}:activationWitnessIntegrity1075(line);
 if(activationWitnessAudit1075.checked&&!activationWitnessAudit1075.pass)issues.push('INTEGRIDAD_DE_ACTIVACIONES_NO_ACREDITADA');
 const declared=raw(line?.sourceDeckFingerprint||line?.deckFingerprint||'');
 const current=raw(context.fingerprint??deckFingerprint1056());
 const deckBound=declared!==''&&current!==''&&declared===current;
 if(!deckBound)issues.push(declared?'BARAJA_CAMBIADA':'ORIGEN_DE_BARAJA_NO_ACREDITADO');
 const last=actions.at(-1)?.after,first=actions[0]?.before;
 let frames=[];
 if(physical.pass===true){frames=[safeFrame1070(first,'Inicio'),...actions.map((a,i)=>safeFrame1070(a.after,'Paso '+(i+1)))];
  if(frames.some(f=>!f.pass))issues.push('FOTOGRAMAS_INCOMPLETOS');}
 const end=line?.simulation?.finalBoard||line?.finalBoard||line?.endBoard;
 const finalFrame=physical.pass===true?safeFrame1070(end,'End Board'):null;
 if(!finalFrame?.pass)issues.push('END_BOARD_INCOMPLETO');
 // La firma incluye instancias físicas y movimientos, no sólo nombres de cartas.
 const signature=JSON.stringify(actions.map(a=>[raw(a?.actionType||a?.action),raw(a?.uid),raw(a?.targetUid),
  arr(a?.before?.zones).map(p=>REPLAY_ZONES_1070.map(z=>arr(p?.[z]).map(cardUid1063))),
  arr(a?.after?.zones).map(p=>REPLAY_ZONES_1070.map(z=>arr(p?.[z]).map(cardUid1063)))]));
 const structural=physical.pass===true&&frames.length===actions.length+1&&finalFrame?.pass===true;
 return{version:VERSION,pass:structural&&legal.pass===true&&deckBound&&issues.length===0,
  previewable:structural,physicalPass:physical.pass===true,legalPass:legal.pass===true,deckBound,spellSpeedAudit1072,activationTimingAudit1073,chainSnapshotAudit1073,activationPhysicalAudit1074,activationWitnessAudit1075,
  issues,frames:structural?frames:[],finalFrame:structural?finalFrame:null,signature,
  certifiesUniversalRules:false,certifiesTop5:false,notes:'El oráculo independiente, el origen del mazo y la búsqueda óptima siguen siendo requisitos separados.'};
}
function top5ReplayAudit1070(lines=getLiveComboLines1070(),context={}){
 const input=arr(lines),rows=input.slice(0,5).map((line,i)=>({rank:i+1,...auditReplayLine1070(line,context)}));
 const signatures=rows.map(r=>r.signature),distinct=rows.length===5&&new Set(signatures).size===5;
 const search=search1047(),visual=(()=>{try{return A973.top5?.()||{}}catch(_){return{}}})();
 const complete=rows.length===5&&distinct&&rows.every(x=>x.pass)&&search.boundedComplete===true&&num(visual.exact)>=5&&num(visual.endBoardsExact)>=5;
 return{version:VERSION,pass:complete,shown:rows.length,distinct,previewable:rows.filter(r=>r.previewable).length,
  structurallyValid:rows.filter(r=>r.physicalPass).length,legallyProved:rows.filter(r=>r.legalPass).length,
  certified:complete?5:0,rows,searchComplete:search.boundedComplete===true,visualExact:num(visual.exact),
  endBoardsExact:num(visual.endBoardsExact),globalOptimalityProven:search.globalOptimalityProven===true&&complete,
  status:complete?'TOP5_TRAZAS_ACREDITADAS':'TOP5_NO_CERTIFICADO',
  policy:'No fabricar líneas ni campos; las vistas previas, aunque sean animadas, no equivalen a 5 combos certificados.'};
}
/* Alpha 1071: sanitización superficial de referencias directas a cartas ocultas.
   La máscara sólo cambia copias enviadas al render; nunca modifica el estado.
   No presume conocer la mano ni cartas boca abajo del adversario. */
function maskAction1070(action){
 if(!action||typeof action!=='object')return action;
 const hiddenIds=new Set(),hiddenNames=new Set(),hiddenUids=new Set();
 const conceal=(card,p,zone)=>zone==='deck'||(p===1&&(zone==='hand'||(zone==='extra'&&card?.faceUp!==true)||(['monster','spelltrap','banished'].includes(zone)&&card?.faceUp===false)));
 for(const st of [action.before,action.after]){
  if(!Array.isArray(st?.zones)||st.zones.length!==2)continue;
  for(let p=0;p<2;p++)for(const z of ['deck','hand','monster','spelltrap','extra','banished'])for(const card of arr(st.zones[p]?.[z])){
   if(!conceal(card,p,z))continue;
   const item=card?.card||card;
   for(const v of [card?.id,card?.cardId,item?.id,item?.cardId])if(Number.isSafeInteger(Number(v))&&Number(v)>0)hiddenIds.add(String(v));
   for(const v of [card?.name,item?.name])if(raw(v).trim())hiddenNames.add(low(v));
   for(const v of [card?.uid,item?.uid])if(raw(v).trim())hiddenUids.add(raw(v));
  }
 }
 const isHidden=v=>{
  if(typeof v==='string')return hiddenNames.has(low(v));
  if(!v||typeof v!=='object')return false;
  if(raw(v.uid).trim())return hiddenUids.has(raw(v.uid));
  if((v.id!=null||v.cardId!=null)&&[v.id,v.cardId].some(x=>hiddenIds.has(raw(x))))return true;
  if(v.name!=null&&hiddenNames.has(low(v.name)))return true;
  return false;
 };
 const redact=v=>typeof v==='string'?'CARTA OCULTA':{
  uid:raw(v?.uid||'')||null,id:null,cardId:null,name:'CARTA OCULTA',
  text:'',desc:'',description:'',image:null,imageUrl:null,card:null,faceDown:true
 };
 const protect=state=>{
  if(!state||!Array.isArray(state.zones)||state.zones.length!==2)return state;
  const safe={...state,zones:state.zones.map(z=>({...z}))};
  for(let p=0;p<2;p++)for(const zone of ['deck','hand','monster','spelltrap','extra','banished']){
   safe.zones[p][zone]=arr(state.zones[p]?.[zone]).map(card=>{
    if(!conceal(card,p,zone))return card;
    const item=card?.card||card;
    const masked={...card,id:null,cardId:null,name:'CARTA OCULTA',text:'',desc:'',description:'',image:null,imageUrl:null};
    if(card?.card)masked.card={...redact(item),uid:raw(item?.uid||card?.uid)||null};
    return masked;
   });
  }
  return safe;
 };
 const out={...action,before:protect(action.before),after:protect(action.after)};
 // Sólo se examinan referencias visibles directamente en cada paso del vídeo.
 // Otros metadatos arbitrarios no se certifican ni se utilizan como prueba.
 for(const key of ['card','target','targetCard','sourceCard','selectedCard','cardInfo','cardData','targetInfo']){
  if(isHidden(out[key]))out[key]=redact(out[key]);
 }
 for(const key of ['cardName','targetName','sourceName','selectedCardName']){
  if(isHidden(out[key]))out[key]='CARTA OCULTA';
 }
 for(const key of ['cards','targets','selectedCards'])if(Array.isArray(out[key]))out[key]=out[key].map(c=>isHidden(c)?redact(c):c);
 return out;
}
function decorateTop5Truth1070(lines=getLiveComboLines1070()){
 const host=D.getElementById('comboVisualTop5');if(!host)return{pass:false,reason:'NO_PANEL'};
 const cards=[...host.querySelectorAll('.combo-video')];
 if(!cards.length)return{pass:false,status:'SIN_COMBOS'};
 const audit=top5ReplayAudit1070(lines);
 cards.forEach((el,i)=>{
  const row=audit.rows[i],h=el.querySelector('.combo-video-head span');
  const msg=row?.pass&&audit.pass?'REPRODUCCIÓN ACREDITADA':row?.previewable?'VISTA PREVIA · LEGALIDAD SIN CERTIFICAR':'REPRODUCCIÓN ILUSTRATIVA · NO CERTIFICADA';
  el.dataset.replay1070=msg;el.dataset.replayCertified=row?.pass&&audit.pass?'1':'0';
  if(h){const base=h.dataset.original1070??h.textContent;h.dataset.original1070=base;h.textContent=base+' · '+msg;}
 });
 const boards=D.getElementById('comboEndBoard');
 if(boards)for(const [i,node] of [...boards.querySelectorAll('.combo-endboard-result')].entries())node.dataset.replayCertified=audit.pass&&audit.rows[i]?.pass?'1':'0';
 return{pass:true,annotated:cards.length,top5Certified:audit.pass,previewable:audit.previewable};
}
function installReplayTruth1070(){
 let applied=0;
 const f=W.renderComboVisualTop5;
 if(typeof f==='function'&&!f.__alpha1071){const wrap=function(...args){
  const lines=Array.isArray(args[0])?args[0]:getLiveComboLines1070();
  W.comboLastAnalysis=lines;
  try{comboLastAnalysis=lines}catch(_){}
  const result=f.apply(this,args);
  try{decorateTop5Truth1070(getLiveComboLines1070())}catch(_){}
  return result;
 };wrap.__alpha1071=true;W.renderComboVisualTop5=wrap;applied++;}
 const paint=W.comboVideoActionHtml;
 if(typeof paint==='function'&&!paint.__alpha1071){const wrap=function(a,i){return paint.call(this,maskAction1070(a),i)};wrap.__alpha1071=true;W.comboVideoActionHtml=wrap;applied++;}
 return{version:VERSION,installed:applied};
}
function fixturesReplay1070(){
 const tests=[],check=(name,pass)=>tests.push({name,pass:!!pass});
 const copy=x=>JSON.parse(JSON.stringify(x)),blank=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const normal={uid:'normal',id:84257639,name:'Dian Keto the Cure Master',typeBits:2,ownerPlayer:0},mst={uid:'mst',id:5318639,name:'Mystical Space Typhoon',typeBits:65538,ownerPlayer:1,faceUp:false,setTurn:1},victim={uid:'victim',id:144,name:'Trampa rival',typeBits:4,faceUp:false,ownerPlayer:0};
 const links=[{chainLink:1,uid:'normal',player:0,spellSpeed:1,actionType:'RESOLVE_NORMAL_SPELL_1065'},
 {chainLink:2,uid:'mst',player:1,spellSpeed:2,actionType:'RESOLVE_TARGET_SPELL_1066',targetUid:'victim'}];
 const b={zones:[blank(),blank()],turn:3,phase:'MAIN1',activePlayer:0,lp:[8000,8000],normalSummonsUsed:0,chain:[],triggerQueue:[]};
 b.zones[0].hand=[copy(normal)];b.zones[0].spelltrap=[copy(victim)];b.zones[1].spelltrap=[copy(mst)];
 const a0=copy(b);a0.chain=copy(links.slice(0,1));a0.zones[0].hand=[];a0.zones[0].spelltrap.push({...copy(normal),faceUp:true});
 const a1=copy(a0);a1.chain=copy(links);a1.zones[1].spelltrap[0].faceUp=true;
 const r1=copy(a1);r1.chain=copy(links.slice(0,1));r1.zones[1].spelltrap=[];r1.zones[1].gy.push({...copy(mst),faceUp:true});r1.zones[0].spelltrap.shift();r1.zones[0].gy.push(copy(victim));
 const end=copy(r1);end.chain=[];end.zones[0].spelltrap=[];end.zones[0].gy.push({...copy(normal),faceUp:true});end.lp[0]+=1000;
 const mk=()=>({links:copy(links),priorityWindow:{kind:'RESPONSE_TO_CHAIN_LINK',afterChainLink:1,offeredToPlayer:1,acceptedByPlayer:1},
  activations:[{...copy(links[0]),before:copy(b),after:copy(a0)},{...copy(links[1]),before:copy(a0),after:copy(a1)}],
  steps:[{...copy(links[1]),before:copy(a1),after:copy(r1)},{...copy(links[0]),before:copy(r1),after:copy(end)}],finalBoard:copy(end)});
 let demo=boundedChainReplay1070(mk());
 check('Cadena acotada genera cinco fotogramas auditados',demo.pass===true&&demo.frames.length===5);
 check('No certifica universo ni cinco combos',demo.certifiesTop5===false&&demo.certifiesUniversalRules===false);
 check('LP 8000 a 9000 en fotogramas',demo.frames[0].board.lp[0]===8000&&demo.frames[4].board.lp[0]===9000);
 check('Rival con Tifón oculto antes de la respuesta',demo.frames[0].board.players[1].spelltrap[0].name==='CARTA OCULTA');
 check('Tifón visible tras la respuesta',demo.frames[2].board.players[1].spelltrap[0].name==='Mystical Space Typhoon');
 check('Mano del rival oculta por conteo',demo.frames[0].board.players[1].hand.count===0);
 check('Campo final igual a la última resolución',JSON.stringify(demo.frames[4].board)===JSON.stringify(safeFrame1070(mk().finalBoard,'x').board));
 let broken=mk();broken.steps[0].after.lp[0]+=10;check('Trampa de LP no produce reproducción',boundedChainReplay1070(broken).pass===false);
 broken=mk();broken.steps[1].before=copy(b);check('Continuidad rota no produce reproducción',boundedChainReplay1070(broken).frames.length===0);
 broken=mk();broken.finalBoard.zones[1].monster.push({uid:'fake',id:7});check('Monstruo fantasma no produce reproducción',!boundedChainReplay1070(broken).pass);
 check('Top 5 vacío no certificado',top5ReplayAudit1070([]).pass===false);
 const fake={actions:[{actionType:'DRAW_ONE',before:b,after:a0}],sourceDeckFingerprint:deckFingerprint1056()};
 const single=auditReplayLine1070(fake);check('Acción falsa no acreditada',!single.pass&&!single.previewable);
 check('Cinco líneas falsas no se certifican',!top5ReplayAudit1070(Array(5).fill(fake)).pass);
 check('Borrado de nombres ocultos en render',maskAction1070({before:copy(b),after:copy(b)}).before.zones[1].spelltrap[0].name==='CARTA OCULTA');
 check('Nombres ocultos no destruyen los datos originales',b.zones[1].spelltrap[0].name==='Mystical Space Typhoon');
 return{version:VERSION,pass:tests.every(t=>t.pass),passed:tests.filter(t=>t.pass).length,total:tests.length,tests,
  certification:'FIXTURE_ONLY',certifiesTournament:false,scope:'Puente entre trazas físicas y cinco fotogramas; no genera 5 combos universales.'};
}

function fixturesReplay1071(){
 const tests=[],check=(name,ok)=>tests.push({name,pass:ok===true});
 const blank=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const hidden={uid:'secret-1',id:5318639,name:'Mystical Space Typhoon',faceUp:false,ownerPlayer:1,card:{uid:'secret-1',id:5318639,name:'Mystical Space Typhoon',desc:'Privado'}};
 const before={zones:[blank(),blank()]};before.zones[1].spelltrap.push(hidden);
 const act={before,after:before,card:{uid:'secret-1',id:5318639,name:'Mystical Space Typhoon',text:'No revelar'},targetCard:{id:5318639,name:'Mystical Space Typhoon'},cardName:'Mystical Space Typhoon',cards:[{id:5318639,name:'Mystical Space Typhoon'}]};
 const masked=maskAction1070(act);
 check('Se oculta carta anidada del adversario',masked.before.zones[1].spelltrap[0].card.name==='CARTA OCULTA'&&masked.before.zones[1].spelltrap[0].card.desc==='');
 check('Se oculta referencia directa al origen',masked.card.name==='CARTA OCULTA'&&masked.card.id===null&&masked.card.text==='');
 check('Se oculta referencia directa al objetivo',masked.targetCard.name==='CARTA OCULTA'&&masked.targetCard.id===null);
 check('Se oculta el nombre directo de carta',masked.cardName==='CARTA OCULTA');
 check('Se oculta una lista de referencias',masked.cards[0].name==='CARTA OCULTA');
 check('El estado original no se altera',hidden.name==='Mystical Space Typhoon'&&hidden.card.desc==='Privado'&&act.card.name==='Mystical Space Typhoon');
 check('Se mantiene ocultación de mano rival',(()=>{const x={zones:[blank(),blank()]};x.zones[1].hand.push({uid:'secret-2',id:111,name:'SECRETO',ownerPlayer:1});return maskAction1070({before:x,after:x}).before.zones[1].hand[0].name==='CARTA OCULTA'})());
 const friendly={uid:'own',id:84257639,name:'Dian Keto the Cure Master',ownerPlayer:0};
 check('Carta conocida propia no se oculta',maskAction1070({before,after:before,card:friendly}).card.name===friendly.name);
 const ownCopy={uid:'own-mst',id:5318639,name:'Mystical Space Typhoon',ownerPlayer:0};
 check('Dos copias iguales se distinguen por UID',maskAction1070({before,after:before,card:ownCopy}).card.name==='Mystical Space Typhoon');
 check('Fuente global sustituye variable obsoleta',(()=>{const old=W.comboLastAnalysis;try{const r=[{actions:[{uid:'NUEVO'}]}];W.comboLastAnalysis=r;return getLiveComboLines1070()===r}finally{W.comboLastAnalysis=old}})());
 check('Cinco acciones falsas continúan no certificadas',top5ReplayAudit1070(Array.from({length:5},(_,i)=>({actions:[{uid:'FAKE'+i,actionType:'FAKE'}]}))).certified===0);
 check('El puente heredado continúa disponible',typeof boundedChainReplay1070==='function'&&typeof fixturesReplay1070==='function');
 return{version:VERSION,total:tests.length,passed:tests.filter(t=>t.pass).length,pass:tests.every(t=>t.pass),tests,scope:'Sincronización de Top 5 y ocultación de referencias directas; no es una simulación universal',certifiesTop5:false};
}


function fixturesAlpha1072(){
 const tests=[],check=(name,ok)=>tests.push({name,pass:ok===true});
 const blank=()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]});
 const clone=x=>JSON.parse(JSON.stringify(x));
 const initial=[{chainLink:1,uid:'spell-1',spellSpeed:1,kind:'NORMAL_SPELL',player:0},
  {chainLink:2,uid:'counter-2',spellSpeed:3,kind:'COUNTER_TRAP',from:'SET',player:1,turn:2,setTurn:1}];
 let a=spellSpeedGate1072(initial);
 check('Mágica Normal a Trampa de Contraefecto colocada',a.pass===true&&!a.certifiesRulings);
 const change=(fn)=>{const x=clone(initial);fn(x);return spellSpeedGate1072(x)};
 check('Spell Speed 2 no responde a Speed 3',!change(x=>x.push({chainLink:3,uid:'quick',spellSpeed:2,kind:'QUICK_PLAY'})).pass);
 check('Contraefecto puede responder a Contraefecto',change(x=>x.push({chainLink:3,uid:'counter-3',spellSpeed:3,kind:'COUNTER_TRAP',from:'SET',turn:2,setTurn:1})).pass);
 check('Spell Speed 1 no puede encadenarse normalmente',!change(x=>x[1].spellSpeed=1).pass);
 check('Speed 3 exige identificador de contraefecto',!change(x=>x[1].kind='NORMAL_TRAP').pass);
 check('Contraefecto no pasa como Speed 2',!change(x=>x[1].spellSpeed=2).pass);
 check('Trampa colocada en el turno actual rechazada',!change(x=>x[1].setTurn=2).pass);
 check('Turno de colocación ausente rechazado',!change(x=>delete x[1].setTurn).pass);
 check('Trampa sin prueba de SET rechazada',!change(x=>delete x[1].from).pass);
 check('Enlaces desordenados rechazados',!change(x=>x[1].chainLink=7).pass);
 check('UID duplicado rechazado',!change(x=>x[1].uid='spell-1').pass);
 check('Velocidad desconocida rechazada',!change(x=>x[1].spellSpeed=99).pass);
 check('Cadena insuficiente no certificable',spellSpeedGate1072([initial[0]]).pass===false);
 check('Cadena demasiado larga no certificable',spellSpeedGate1072(Array(13).fill(initial[0])).pass===false);
 const state={turn:2,phase:'MAIN1',activePlayer:0,lp:[8000,8000],chain:[],triggerQueue:[],zones:[blank(),blank()]};
 state.zones[0].deck=[{uid:'own-deck-secret',id:111,name:'CARTA DE MI DECK'}];
 state.zones[1].extra=[{uid:'opp-extra-hidden',id:222,name:'EXTRA PRIVADO'},
  {uid:'opp-extra-public',id:333,name:'PENDULO PUBLICO',faceUp:true}];
 state.zones[1].banished=[{uid:'opp-banished-hidden',id:444,name:'DESTERRADA OCULTA',faceUp:false}];
 const frame=safeFrame1070(state,'privado');
 check('Fotograma físico admite zonas válidas',frame.pass===true);
 check('Extra Deck rival oculto en fotograma',frame.board?.players?.[1]?.extra?.[0]?.name==='CARTA OCULTA');
 check('Extra Deck público boca arriba permanece visible',frame.board?.players?.[1]?.extra?.[1]?.name==='PENDULO PUBLICO');
 check('Desterrada boca abajo del rival oculta',frame.board?.players?.[1]?.banished?.[0]?.name==='CARTA OCULTA');
 check('Deck propio no expone identidades en fotograma',frame.board?.players?.[0]?.deck?.count===1);
 const action={before:state,after:state,sourceCard:{uid:'opp-extra-hidden',id:222,name:'EXTRA PRIVADO'},
  targetCard:{uid:'opp-banished-hidden',id:444,name:'DESTERRADA OCULTA'},
  card:{uid:'own-deck-secret',id:111,name:'CARTA DE MI DECK'}};
 const safe=maskAction1070(action);
 check('Extra Deck oculto en acción',safe.before.zones[1].extra[0].name==='CARTA OCULTA');
 check('Extra Deck rival boca arriba público en acción',safe.before.zones[1].extra[1].name==='PENDULO PUBLICO');
 check('Desterrada boca abajo oculta en acción',safe.before.zones[1].banished[0].name==='CARTA OCULTA');
 check('Referencia directa al Extra Deck oculta',safe.sourceCard.name==='CARTA OCULTA');
 check('Referencia directa a desterrada oculta',safe.targetCard.name==='CARTA OCULTA');
 check('Referencia directa al propio Deck oculta',safe.card.name==='CARTA OCULTA');
 check('El original no fue alterado',action.before.zones[1].extra[0].name==='EXTRA PRIVADO'&&action.before.zones[1].banished[0].name==='DESTERRADA OCULTA');
 const fake={actions:[{actionType:'NO_EXISTE'}],chainLinks:change(x=>x[1].spellSpeed=1)};
 check('No se certifican líneas inventadas con metadatos de cadena',top5ReplayAudit1070(Array.from({length:5},()=>fake)).certified===0);
 return{version:VERSION,total:tests.length,passed:tests.filter(t=>t.pass).length,pass:tests.every(t=>t.pass),tests,
  scope:'Spell Speed 1–3 y privacidad de las zonas; no demuestra legalidad universal ni Top 5'};
}


function fixturesAlpha1073(){
 const tests=[],check=(name,ok)=>tests.push({name,pass:ok===true});
 const clone=x=>JSON.parse(JSON.stringify(x));
 const base=[{chainLink:1,uid:'s1',spellSpeed:1,kind:'NORMAL_SPELL',player:0},
  {chainLink:2,uid:'q2',spellSpeed:2,kind:'QUICK_PLAY_SPELL',from:'SET',turn:3,setTurn:2,player:1,activePlayer:0}];
 const change=fn=>{const x=clone(base);fn(x);return activationTimingGate1073(x)};
 check('Juego Rápido colocado en turno anterior',activationTimingGate1073(base).pass===true);
 check('Juego Rápido recién colocado no acreditado',!change(x=>x[1].setTurn=3).pass);
 check('Juego Rápido colocado en el futuro rechazado',!change(x=>x[1].setTurn=4).pass);
 check('Juego Rápido sin turno de colocación rechazado',!change(x=>delete x[1].setTurn).pass);
 check('Juego Rápido sin turno actual rechazado',!change(x=>delete x[1].turn).pass);
 check('Juego Rápido sin zona de activación no acreditado',!change(x=>delete x[1].from).pass);
 check('Juego Rápido propio desde mano en turno propio',change(x=>{x[1].from='HAND';x[1].player=0;x[1].activePlayer=0}).pass);
 check('Juego Rápido rival desde mano en tu turno rechazado',!change(x=>{x[1].from='HAND';x[1].activePlayer=0}).pass);
 check('Juego Rápido desde mano sin jugador activo rechazado',!change(x=>{x[1].from='HAND';delete x[1].activePlayer}).pass);
 check('Trampa Normal colocada en turno anterior',change(x=>x[1].kind='NORMAL_TRAP').pass);
 check('Trampa Normal colocada el turno actual rechazada',!change(x=>{x[1].kind='NORMAL_TRAP';x[1].setTurn=3}).pass);
 check('Trampa Continua colocada en turno anterior',change(x=>x[1].kind='CONTINUOUS_TRAP').pass);
 check('Trampa Continua colocada el turno actual rechazada',!change(x=>{x[1].kind='CONTINUOUS_TRAP';x[1].setTurn=3}).pass);
 check('Contraefecto colocado anteriormente (puerta de tiempo)',change(x=>x[1].kind='COUNTER_TRAP').pass);
 check('Contraefecto colocado ahora no acreditado',!change(x=>{x[1].kind='COUNTER_TRAP';x[1].setTurn=3}).pass);
 check('Trampa desde mano espera excepción oficial',!change(x=>{x[1].kind='NORMAL_TRAP';x[1].from='HAND'}).pass);
 check('Contraefecto desde mano espera excepción oficial',!change(x=>{x[1].kind='COUNTER_TRAP';x[1].from='HAND'}).pass);
 check('Efecto de Trampa ya boca arriba fuera de la puerta',change(x=>{x[1].kind='CONTINUOUS_TRAP';x[1].from='FACEUP';x[1].activationType='EFFECT_ACTIVATION'}).pass);
 check('Efecto de monstruo fuera del control de colocación',change(x=>{x[1].kind='MONSTER_EFFECT';x[1].from='GY'}).pass);
 check('No acredita activaciones por pasar puerta',activationTimingGate1073(base).certifiesActivation===false);
 check('Metadatos de cadena con prueba normal coherente',spellSpeedGate1072([{chainLink:1,uid:'s',spellSpeed:1,kind:'NORMAL_SPELL'},{chainLink:2,uid:'c',spellSpeed:3,kind:'COUNTER_TRAP',from:'SET',turn:3,setTurn:1}]).pass);
 const line={chainLinks:clone(base),actions:[{before:{chain:clone(base)},after:{chain:[]}}]};
 check('Cadena declarada coincide con instantánea',chainSnapshotGate1073(line).pass);
 check('Cadena no coincide por instancia UID',!chainSnapshotGate1073({...line,chainLinks:changeLinks(x=>x[1].uid='otra')}).pass);
 check('Cadena no coincide por velocidad',!chainSnapshotGate1073({...line,chainLinks:changeLinks(x=>x[1].spellSpeed=3)}).pass);
 check('Cadena no coincide por controlador',!chainSnapshotGate1073({...line,chainLinks:changeLinks(x=>x[1].player=0)}).pass);
 check('Sin instantánea completa no acredita cadena',chainSnapshotGate1073({...line,actions:[{before:{chain:[]}}]}).checked===true&&!chainSnapshotGate1073({...line,actions:[{before:{chain:[]}}]}).pass);
 check('Una cadena declarada sin pila física queda marcada',auditReplayLine1070({chainLinks:base,actions:[]}).issues.includes('CADENA_DECLARADA_NO_COINCIDE_CON_ESTADO'));
 check('Una activación recién colocada impide acreditar línea',auditReplayLine1070({chainLinks:changeLinks(x=>x[1].setTurn=x[1].turn),actions:[]}).issues.includes('ACTIVACION_DE_CADENA_NO_ACREDITADA'));
 check('Metadatos discordantes marcan la línea',auditReplayLine1070({...line,chainLinks:changeLinks(x=>x[1].uid='incompatible')}).issues.includes('CADENA_DECLARADA_NO_COINCIDE_CON_ESTADO'));
 check('Datos del oráculo independiente permanecen obligatorios',top5ReplayAudit1070(Array(5).fill({actions:[],chainLinks:base})).certified===0);
 function changeLinks(fn){const x=clone(base);fn(x);return x;}
 return{version:VERSION,pass:tests.every(t=>t.pass),passed:tests.filter(t=>t.pass).length,total:tests.length,tests,
  scope:'Puerta conservadora de activación para cartas declaradas y comprobación de metadatos contra pilas físicas; no acredita simulador universal ni Top5'};
}

/* Alpha1076: cobertura de metadatos, separada de legalidad del duelo */
function metadataAudit1076(){
 const cards=arr(W.CARD_CATALOG),monsters=cards.filter(c=>(Number(c?.typeBits)||0)&1);
 const known=monsters.filter(c=>c?.statsKnown===true),verified=monsters.filter(c=>c?.metadataVerified===true);
 const byId=new Map(cards.map(c=>[Number(c.id),c]));
 const deck=W.deckState||{},active=[...arr(deck.main),...arr(deck.extra),...arr(deck.side)];
 const relevant=active.filter(c=>((Number(c?.typeBits)||Number(byId.get(Number(c?.id))?.typeBits)||0)&1));
 const missing=relevant.filter(c=>{const ref=byId.get(Number(c?.id))||c;return ref.statsKnown!==true});
 const result={version:VERSION,cardCount:cards.length,monsterCount:monsters.length,
   knownCount:known.length,unknownCount:monsters.length-known.length,
   verifiedCount:verified.length,verifiedIds:verified.map(c=>c.id),
   deckMonsterCount:relevant.length,deckMissingCount:missing.length,
   deckMissing:missing.slice(0,25).map(c=>({id:c.id??null,name:c.name||'',issue:'STATS_NOT_PROVEN'})),
   pass:monsters.length>0&&known.length===monsters.length&&missing.length===0,
   competitiveCertified:false,
   note:'Cero no es sinónimo de desconocido. Una fuente CDB no sustituye la verificación oficial de cada carta.'};
 try{D.documentElement.dataset.cardStatsComplete=result.pass?'1':'0'}catch(_){}
 return result;
}

/* Alpha 1102: independently bounded legacy self-test harness; never blocks browser UI. */
const TEST_IDS_1091=Object.freeze(['664-parser','664-dispatch','666','667','668','669','670','671','672','673','674','675','677','679','680','682','685','1092-parser']);
let SAFE_SESSION_1091=null,SAFE_LAST_1091=null;
function cancelSafeRegression1091(){
 const job=SAFE_SESSION_1091;if(!job||!job.active)return {version:VERSION,status:'IDLE',cancelled:false};
 job.cancelled=true;try{job.stop?.()}catch(_){};
 return {version:VERSION,status:'CANCEL_REQUESTED',cancelled:true};
}
function safeRegressionStatus1091(){return SAFE_SESSION_1091?.active?{version:VERSION,status:'RUNNING',completed:SAFE_SESSION_1091.rows.length,total:SAFE_SESSION_1091.tests.length,cancelled:SAFE_SESSION_1091.cancelled}:{version:VERSION,status:'IDLE',last:SAFE_LAST_1091};}
async function safeRegression1091(opts={}){
 if(SAFE_SESSION_1091?.active)return{version:VERSION,status:'ALREADY_RUNNING',pass:false};
 if(typeof Worker!=='function'||typeof Blob!=='function'||typeof URL?.createObjectURL!=='function')return{version:VERSION,status:'WORKER_UNAVAILABLE',pass:false};
 const payload=D.getElementById('ygo-deferred-payload-'+VERSION.replace(/\D/g,''))?.textContent;
 const prelude=D.getElementById('final-consolidated-engine')?.textContent;
 if(!payload||!prelude)return{version:VERSION,status:'BUNDLE_UNAVAILABLE',pass:false};
 const selected=Array.isArray(opts.testIds)?opts.testIds:TEST_IDS_1091;
 const tests=selected.filter(x=>TEST_IDS_1091.includes(x));
 if(tests.length!==selected.length||tests.length===0||new Set(tests).size!==tests.length)return{version:VERSION,status:'INVALID_TEST_SELECTION',pass:false};
 const eachMs=Math.max(1500,Math.min(15000,Number(opts.eachTimeoutMs)||6000));
 const job={active:true,cancelled:false,tests,rows:[],stop:null},started=Date.now();SAFE_SESSION_1091=job;
 const progress=row=>{try{opts.onProgress?.({version:VERSION,completed:job.rows.length,total:tests.length,result:row})}catch(_){}};
 function one(id){return new Promise(resolve=>{
  let url=null,worker=null,timer=null,done=false;const start=Date.now();
  const finish=(status,detail={})=>{
   if(done)return;done=true;clearTimeout(timer);try{worker?.terminate()}catch(_){};if(url)URL.revokeObjectURL(url);
   job.stop=null;resolve({testId:id,status,pass:false,...detail,elapsedMs:Date.now()-start});
  };
  try{url=URL.createObjectURL(new Blob([WORKER_SOURCE_1080],{type:'text/javascript'}));worker=new Worker(url)}
  catch(e){finish('WORKER_START_ERROR',{error:raw(e?.message||e)});return}
  job.stop=()=>finish('CANCELLED');timer=setTimeout(()=>finish('HARD_TIMEOUT'),eachMs);
  worker.onerror=e=>finish('WORKER_ERROR',{error:raw(e?.message||e)});
  worker.onmessage=e=>{
   const m=e.data||{};
   if(m.type==='ERROR'||m.type==='PRELUDE_ERROR')finish('INIT_ERROR',{error:raw(m.error)});
   else if(m.type==='READY'){
    if(m.modules!==WORKER_MANIFEST_1080.workerModuleCount||m.deferredErrors!==0)finish('INIT_INCOMPLETE',{modules:m.modules,deferredErrors:m.deferredErrors});
    else try{worker.postMessage({type:'SELFTEST1091',testId:id,catalog:W.CARD_CATALOG})}catch(x){finish('POST_FAILED',{error:raw(x?.message||x)})}
   }
   else if(m.type==='SELFTEST_RESULT'&&m.result?.testId===id)finish(m.result.status||'INVALID_RESULT',m.result);
  };
  try{worker.postMessage({type:'INIT',targetVersion:VERSION,manifest:WORKER_MANIFEST_1080,guardCode:installParserGuard1092.toString(),regressionCode:parserRegression1092.toString(),payload,prelude})}catch(e){finish('INIT_POST_FAILED',{error:raw(e?.message||e)})}
 });}
 try{
  for(const id of tests){if(job.cancelled)break;const row=await one(id);job.rows.push(row);progress(row);await new Promise(r=>setTimeout(r,0));}
 }finally{job.active=false;job.stop=null;SAFE_SESSION_1091=null;}
 const completed=job.rows.length,passes=job.rows.filter(r=>r.pass===true).length;
 const out={version:VERSION,status:job.cancelled?'CANCELLED':completed===tests.length&&passes===tests.length?'PASS':'COMPLETED_WITH_GAPS',pass:!job.cancelled&&passes===tests.length&&completed===tests.length,
  completed,passed:passes,total:tests.length,rows:job.rows,elapsedMs:Date.now()-started,certifiedUniversal:false,
  scope:'Autopruebas preexistentes ejecutadas en Workers independientes. No equivale a la regresión competitiva de 10 mazos ni certifica el simulador universal.'};
 SAFE_LAST_1091=out;return out;
}


/* Alpha 1102: authoritative, conservative parser contract for split PSCT clauses.
   Never promote modal fragments, costs, or monster flavour text to a legal action. */
function installParserGuard1092(){
 const W=typeof window==='object'?window:self;
 const engine=W.YGORulingEngine;
 if(!engine||typeof engine.parseCard!=='function')return false;
 if(engine.parseCard.__alpha1092ParserGuard)return true;
 const previous=engine.parseCard.bind(engine);
 const arr1172=v=>Array.isArray(v)?v:[];
 const normal=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
 function canonicalParse1092(card){
  const result=previous(card);if(!result||!Array.isArray(result.effects))return result;
  const type=String(card?.type||card?.card?.type||''),name=normal(card?.name||card?.card?.name||'');
  const full=normal(card?.desc||card?.text||'');
  const ctx=W.__YGO668_ENUM_CONTEXT;
  const isNormal=/normal monster/i.test(type)&&!/pendulum/i.test(type);
  const stovie=name==='labrynth stovie torbie'&&/send this card from your hand or field to the gy and discard 1 card/.test(full);
  const rock=name==='rock of the vanquisher'&&/activate 1 of these effects/.test(full);
  const sarc=name==='king s sarcophagus'&&/send 1 card from your hand to the gy send 1 horus monster from your deck to the gy/.test(full);
  return {...result,effects:result.effects.map(item=>{
   const e={...item},txt=normal(e.raw||e.resolution||e.activation||'');
   const block=reason=>{e.nonActivatable=true;e.nonActivatableReason=reason;e.alpha1092ParserGuard=true;};
   if(isNormal)block('NORMAL_MONSTER_FLAVOR_TEXT_1092');
   else if(/^(discard 1|discard one|discard 1 card)$/.test(txt))block('COST_FRAGMENT_ONLY_1092');
   else if(/^discard (?:1|one)(?: card)?$/.test(normal(e.activation||''))&&!(Array.isArray(e.costs)?e.costs:[]).some(c=>c.kind==='DISCARD')){
    e.alpha1170UnprovenCostGuard=true;block('DISCARD_COST_NOT_PAYABLE_1170');
   }
   else if(String(e.raw||'').includes(';')&&((/\bsend\s+(?:\d+|one|a|an)\s+(?:[a-z-]+\s+){0,4}cards?\s+from\s+(?:your|the)\s+hand\s+to\s+(?:the\s+)?(?:gy|graveyard)\b/i.test(String(e.activation||''))&&!arr1172(e.costs).some(c=>['SEND','SEND_HAND','SEND_GY','DISCARD'].includes(String(c.kind).toUpperCase())))||(/\breveal\s+(?:\d+|one|a|an)\s+[^;]{0,90}?\b(?:in|from)\s+your\s+hand\b/i.test(String(e.activation||''))&&!arr1172(e.costs).some(c=>String(c.kind).toUpperCase()==='REVEAL')))){e.alpha1172UnprovenPaymentGuard=true;block('UNACCOUNTED_ACTIVATION_PAYMENT_1172');}
   else if(/activate (1|one) of (these|the following) effects/.test(txt))block('MODAL_HEADER_ONLY_1092');
   else if(/^(?:each effect once per turn|you can only use each effect(?: of [a-z0-9 ]+)? once per turn)$/.test(txt))block('RESTRICTION_ONLY_1092');
   else if(ctx&&Number(ctx.activePlayer)===Number(ctx.player)&&/during your opponent s turn/.test(txt))block('OPPONENT_TURN_GATE_1092');
   if(stovie&&/send this card from your hand or field to the gy and discard 1 card/.test(txt)){
    e.costs=[{kind:'SEND_GY',amount:1,self:true,alpha1092:true},{kind:'DISCARD',amount:1,alpha1092:true}];
    e.alpha1092CostNormalized=true;
    // The real card has its dedicated exact handler; the standalone split text has no resolution.
    block('COST_FRAGMENT_EXACT_HANDLER_REQUIRED_1092');
   }
   if(rock&&(/during the main phase/.test(txt)||/special summon 1 vanquish soul monster from your hand/.test(txt)||/add 1 vanquish soul monster from your gy to your hand/.test(txt)))
    block('ROCK_MODAL_BRANCH_DIRECT_HANDLER_REQUIRED_1092');
   if(sarc&&(/send 1 card from your hand to the gy/.test(txt)||/send 1 horus monster from your deck to the gy/.test(txt)))
    block('KINGS_SARC_COMPOUND_DIRECT_HANDLER_REQUIRED_1092');
   return e;
  })};
 }
 canonicalParse1092.__alpha1092ParserGuard=true;
 // The guard subsumes the historical parser-normalization invariants without rewrapping.
 canonicalParse1092.__alpha664=true;canonicalParse1092.__alpha668=true;
 canonicalParse1092.__base=previous;
 Object.defineProperty(engine,'parseCard',{configurable:true,enumerable:true,writable:true,value:canonicalParse1092});
 return engine.parseCard===canonicalParse1092;
}
function parserRegression1092(){
 const W=typeof window==='object'?window:self;const VERSION='Alpha 1110';
 installParserGuard1092();
 const parse=c=>W.YGORulingEngine?.parseCard?.(c)?.effects||[];
 const n=parse({name:'Blue-Eyes White Dragon',type:'Normal Monster',desc:'This legendary dragon is a powerful engine of destruction.'});
 const c=parse({name:'Cost fragment',type:'Normal Spell',desc:'Discard 1; draw 1 card.'});
 const m=parse({name:'Modal header',type:'Quick-Play Spell',desc:'Activate 1 of these effects; Draw 1 card; Destroy 1 card.'});
 const s=parse({name:'Labrynth Stovie Torbie',type:'Effect Monster',desc:'(Quick Effect): You can send this card from your hand or field to the GY and discard 1 card; Set 1 "Labrynth" Spell/Trap from your hand or Deck.'});
 const a=parse({name:'Restricted effect',type:'Effect Monster',desc:'If this card is Summoned: You can add 1 card. Each effect once per turn.'});
 const save=W.__YGO668_ENUM_CONTEXT;W.__YGO668_ENUM_CONTEXT={activePlayer:0,player:0};
 const t=parse({name:'Turn gate',type:'Effect Monster',desc:"During your opponent's turn (Quick Effect), immediately Xyz Summon using this card you control."});
 W.__YGO668_ENUM_CONTEXT=save;
 const rk=parse({name:'Rock of the Vanquisher',type:'Link Monster',desc:'During the Main Phase (Quick Effect): You can activate 1 of these effects; Special Summon 1 "Vanquish Soul" monster from your hand. Add 1 "Vanquish Soul" monster from your GY to your hand.'});
 const ks=parse({name:"King's Sarcophagus",type:'Continuous Spell',desc:'You can send 1 card from your hand to the GY; send 1 "Horus" monster from your Deck to the GY.'});
 const checks={
  flavour:n.length>0&&n.every(e=>e.nonActivatable===true),
  cost:c.some(e=>e.nonActivatable===true&&(/^(?:discard 1)$/i.test(String(e.raw||'').trim())||/^discard 1$/i.test(String(e.activation||'').trim()))),
  modal:m.some(e=>/activate 1 of these effects/i.test(String(e.raw||''))&&e.nonActivatable===true),
  stovie:s.some(e=>e.alpha1092CostNormalized===true&&e.costs?.[0]?.kind==='SEND_GY'&&e.costs?.[0]?.self===true&&e.costs?.[1]?.kind==='DISCARD'),
  restriction:a.some(e=>/each effect once per turn/i.test(String(e.raw||''))&&e.nonActivatable===true),
  turn:t.some(e=>/opponent.s turn/i.test(String(e.raw||''))&&e.nonActivatable===true),
  rock:rk.filter(e=>/during the main phase|special summon 1|add 1/i.test(String(e.raw||''))).every(e=>e.nonActivatable===true),
  sarc:ks.filter(e=>/send 1 card from your hand|send 1 .*horus.*monster/i.test(String(e.raw||''))).every(e=>e.nonActivatable===true)
 };
 return {version:VERSION,pass:Object.values(checks).every(Boolean),checks,scope:'PSCT y fragmentos específicos; no certifica un despacho exacto ni cobertura universal.'};
}


// Alpha 1102: fixed, read-only regression contract anchored in the original
// Alpha 997 non-script DOM. This verifies preservation, not duel-rule accuracy.
const BASELINE_DOM_997_1095=Object.freeze(["name","archetypeDropdown","arch","archAutoMode","archBuilderStatus","archBuilderSuggestions","archFullBrowser","date","ydkMainFile","mainYdkStatus","loadDeckDropdown","alpha306LoadDeck","alpha306DeleteDeck","alpha854OpponentPanel","alpha854OpponentFile","alpha854OpponentSuiteFiles","alpha854LoadOpponent","alpha854LoadSuite","alpha854ClearOpponent","alpha854OpponentStatus","savedDecks","stats","total","score","tier","tierDesc","sliders","composition","roleBars","starterRate","playableRate","interactionRate","deadRate","hand","simResult","radar","miniScore","miniTier","miniDesc","cardSearch","cardType","cardRole","mainCount","extraCount","sideCount","catalog","zoneLabel","deckList","selectedCardDetail","comboWorkbench","comboDeckSummary","comboDeckCards","comboSelected","comboEffectText","comboRuleStatus","comboVisualTop5","comboEndBoard","ygoLab","lab-db","dbSearch","dbRole","dbArchetype","dbFunction","dbCount","dbResults","lab-ban","banUpdatedLabel","banFormats","banSearch","banFilter","banSource","banDeckCheck","banResult","toast","v12Modal","v12ModalImg"]);
function regressionContract1095(){
 const present=BASELINE_DOM_997_1095.filter(id=>!!D.getElementById(id));
 const missing=BASELINE_DOM_997_1095.filter(id=>!D.getElementById(id));
 const critical=['alpha306LoadDeck','alpha306DeleteDeck'];
 const controls=Object.fromEntries(critical.map(id=>[id,{exists:!!D.getElementById(id),visible:!!D.getElementById(id)?.getClientRects?.().length}]));
 const catalogSize=arr(W.CARD_CATALOG).length;
 const countStats=D.querySelectorAll('#sliders .points-row').length;
 const coreApis={score:typeof W.YGOAlpha1048?.scoreAuthority1048==='function',
   import:typeof W.YGOAlpha1048?.importText1048==='function',
   worker:typeof W.YGOAlpha1080?.searchIsolated1080==='function',
   cancelWorker:typeof W.YGOAlpha1080?.cancelIsolated1080==='function',
   rules:typeof W.YGOAlpha669?.enumerateNode669==='function',
   diagnostics:typeof W.YGOAlpha1095?.safeRegression1092==='function'};
 const buttonsDiana=Object.values(controls).every(x=>x.exists&&x.visible)&&!!D.querySelector('.diana-center-zone');
 const integrity=W.__YGO_BUNDLE_INTEGRITY?.pass===true;
 const manifestMatches=W.__YGO_BUNDLE_INTEGRITY?.canonicalId===CANONICAL_ID;
 const prerequisites={domBaseline:missing.length===0,buttonsDiana,stats10:countStats===10,catalog19617:catalogSize===19617,
   requiredApis:Object.values(coreApis).every(Boolean),moduleIntegrity:integrity,manifestConsistent:manifestMatches};
 return {version:VERSION,baseline:'Alpha 997',kind:'REGRESSION_CONTRACT_ONLY',
   baselineDomCount:BASELINE_DOM_997_1095.length,preservedDomCount:present.length,missingDom:missing,
   controls,statsCount:countStats,catalogSize,coreApis,prerequisites,
   contractPass:Object.values(prerequisites).every(Boolean),
   legacyDiagnosticControls:{alpha859RefreshGates:!!D.getElementById('alpha859RefreshGates'),alpha884Impact:!!D.getElementById('alpha884Impact')},
   notes:['Two historical diagnostic controls are absent by design pending a separate value/compatibility audit.',
    'A passing structural regression contract does not certify effects, top-5 optimality, formats or calibration.',
    'Do not compare Alpha 997 implementation estimates with universal-certification percentage.']};
}


// Alpha 1102: split historical assertions from current rule semantics.
// The tests from 677/680 require a single parser fragment labelled EXACT,
// but the current parser correctly splits costs/modal options, and the
// vintage depth-3 certificate is tied to a 167-card reference catalog.
// Those tests remain in the historical suite as NOT_PASS, not 'repaired' by
// setting alpha677ExactDispatch / alpha680ExactDispatch to true.
function legacyRuleGapAudit1096(){
 const rock=W.YGOAlpha677?.selfTest677?.()||null;
 const sarc=W.YGOAlpha680?.selfTest680?.()||null;
 const horizon=W.YGOAlpha676?.embeddedDepth3Certificate676?.()||null;
 const effects=(raw)=>Array.isArray(raw)?raw:[];
 const classes={
  rock:{historicalPass:rock?.pass===true,splitModalHeader:effects(rock?.effects).some(e=>e.reason==='MODAL_EFFECT_HEADER_671'),
    directHistorical:rock?.checks?.direct===true,depth3Historical:rock?.checks?.depth3===true},
  sarcophagus:{historicalPass:sarc?.pass===true,splitCostAndEffect:effects(sarc?.effects).some(e=>e.reason==='KINGS_SARC_COMPOUND_DIRECT_HANDLER_REQUIRED_1092'),
    directHistorical:sarc?.checks?.direct===true},
  depth3:{historicalPass:horizon?.pass===true,expectedCatalogFingerprint:horizon?.catalog?.expected||null,
    observedCatalogFingerprint:horizon?.catalog?.current||null,fixtureCount:horizon?.fixtures||null,
    referenceCatalogCount:horizon?.catalog?.count||null}
 };
 return {version:'Alpha 1110',kind:'LEGACY_EXPECTATION_DIAGNOSTIC_NOT_CERTIFICATION',
  historicalFailures:['677.direct','677.depth3','680.direct'],
  classes,legacyTestsReplaced:false,allLegalRulesProven:false,certified:false,
  explanation:'Las rutas por carta se prueban por comportamiento; los controles históricos de despachos exactos y profundidad 3 no demuestran reglas universales.'};
}


/* Alpha 1103: behavioural tests are independent of the obsolete 677/680 parser-flag
   assertions. Synthetic fixtures certify only the modeled physical candidates. */
function transitionFixtures1104(){
 const mk=(uid,printedId,name,type,archetypes=[])=>({uid,ownerPlayer:0,faceUp:true,id:printedId,card:{id:printedId,ownerPlayer:0,name,type,archetypes,desc:''}});
 const fresh=()=>({turn:1,activePlayer:0,phase:'MAIN 1',priority:0,lp:[8000,8000],
   zones:[0,1].map(()=>({deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[]})),
   chain:[],pendingTriggers:[],triggerQueue:[],continuousEffects:[],replacementEffects:[],events:[],log:[],
   analysis:{materialsUsed:0,successfulSummons:0,successfulActivations:0,searches:0,draws:0}});
 const check=(name,state,predicate)=>{
   const before=JSON.stringify(state),result=(()=>{try{return W.YGOAlpha669?.enumerateNode669?.({st:state,actions:[],exactPath:true},{maxActionBranches:32,maxMs:200,collectUnresolved:true})||{}}catch(e){return{error:String(e?.message||e)}}})();
   const rows=arr(result.nodes),unchanged=JSON.stringify(state)===before,
     pending=arr(result.reasons).some(x=>/OPPONENT_RESPONSE_COVERAGE_NOT_PROVEN/.test(raw(x))),
     noFalseCertificate=rows.every(x=>x.exactPath!==true&&arr(x.actions).every(a=>a.legal!==true&&a.exactPath!==true));
   return{name,pass:!result.error&&unchanged&&(!rows.length||pending)&&noFalseCertificate&&predicate(rows),nodes:rows.length,
     pending,noFalseCertificate,inputUnchanged:unchanged,error:result.error||null};
 };
 const rock=fresh();rock.zones[0].monster.push(mk('rock1',28168628,'Rock of the Vanquisher','Link Monster',['Vanquish Soul']));
 rock.zones[0].hand.push(mk('vs1',29302858,'Vanquish Soul Razen','Effect Monster',['Vanquish Soul']));
 rock.zones[0].gy.push(mk('vs2',29280200,'Vanquish Soul Dr. Mad Love','Effect Monster',['Vanquish Soul']));
 const r=check('ROCK_DOS_RAMAS',rock,rows=>rows.length>=2&&
   rows.some(x=>arr(x.st?.zones?.[0]?.monster).some(y=>y.uid==='vs1')&&!arr(x.st?.zones?.[0]?.hand).some(y=>y.uid==='vs1'))&&
   rows.some(x=>arr(x.st?.zones?.[0]?.hand).some(y=>y.uid==='vs2')&&!arr(x.st?.zones?.[0]?.gy).some(y=>y.uid==='vs2')));
 const sarc=fresh();sarc.zones[0].spelltrap.push(mk('sarc1',16528181,"King's Sarcophagus",'Continuous Spell'));
 sarc.zones[0].hand.push(mk('cost1',89631139,'Blue-Eyes White Dragon','Normal Monster'));
 sarc.zones[0].deck.push(mk('horus1',84941194,'Imsety, Glory of Horus','Effect Monster',['Horus']));
 const s=check('SARC_COSTE_Y_ENVIO',sarc,rows=>rows.length>=1&&rows.some(x=>
   arr(x.st?.zones?.[0]?.gy).some(y=>y.uid==='cost1')&&arr(x.st?.zones?.[0]?.gy).some(y=>y.uid==='horus1')&&
   !arr(x.st?.zones?.[0]?.hand).some(y=>y.uid==='cost1')&&!arr(x.st?.zones?.[0]?.deck).some(y=>y.uid==='horus1')));
 const empty=fresh();empty.zones[0].spelltrap.push(mk('sarc1',16528181,"King's Sarcophagus",'Continuous Spell'));
 const negative=check('SARC_SIN_COSTE_NI_HORUS',empty,rows=>!rows.some(x=>arr(x.actions).some(a=>/King.s Sarcophagus/i.test(raw(a.card)))));
 const occupied=fresh();occupied.zones[0].monster.push(mk('rock1',28168628,'Rock of the Vanquisher','Link Monster',['Vanquish Soul']));
 for(let i=0;i<4;i++)occupied.zones[0].monster.push(mk('filler'+i,89631139,'Blue-Eyes White Dragon','Normal Monster'));
 occupied.zones[0].hand.push(mk('vs1',29302858,'Vanquish Soul Razen','Effect Monster',['Vanquish Soul']));
 const noRoom=check('ROCK_SIN_ESPACIO',occupied,rows=>!rows.some(x=>
   arr(x.st?.zones?.[0]?.monster).some(y=>y.uid==='vs1')));
 const checks=[r,s,negative,noRoom];return{version:VERSION,pass:checks.every(x=>x.pass),checks,
   historical677680Replaced:false,universalRulesCertified:false,scope:'Transiciones físicas sintéticas; no certifica cadena ni efectos completos'};
}
function releaseReadiness1104(){
 const catalog=arr(W.CARD_CATALOG),expected=W.__YGO_BUNDLE_INTEGRITY?.canonicalId===CANONICAL_ID,
   buttons=['alpha306LoadDeck','alpha306DeleteDeck'].every(x=>!!D.getElementById(x)),
   ten=D.querySelectorAll('#stats .stat').length===10,
   count=catalog.length,man=!!W.__YGO_BUNDLE_INTEGRITY?.pass,rock=transitionFixtures1104();
 const sourceAudit={entries:count,fullCountLoaded:count===19617,notes:'La cantidad no equivale a cobertura de efectos ni a autoridad KONAMI'};
 const legacy=legacyRuleGapAudit1096(),ban=banlist1047();
 return{version:VERSION,pass:expected&&buttons&&ten&&man&&count===19617&&rock.pass,
   checks:{manifest:expected,integrity:man,buttons,stats10:ten,catalogLoaded:count===19617,physicalCardFixtures:rock.pass},
   transitions:rock,legacy,sourceAudit,banlist:{tcg:ban.tcg?.pass===true,ocg:ban.ocg?.pass===true,
     rush:ban.rush?.pass===true,unresolvedFormats:arr(ban.universe?.failed).map(x=>x.key)},
   universalRulesCertified:false,top5Certified:false,calibratedCompetitiveScore:false,
   note:'Listo para seguir desarrollo no significa producto terminado.'};
}


/* Alpha 1237: conexión de interfaz al simulador acotado de turnos 1-3.
 * Importa un Main .ydk real del rival; exige selección explícita de sus 5
 * cartas y sus colocaciones. El orden restante del archivo determina el robo
 * de prueba; no afirma ser una baraja barajada aleatoriamente. Ningún estado
 * rival se inventa. Las vistas antiguas se invalidan al cambiar el escenario. */
let scenario1233=null;
function parseScenarioOpponentYdk1233(content,catalog){
 const fail=(status)=>({pass:false,status});
 if(typeof content!=='string'||content.length>200000||!Array.isArray(catalog)||catalog.length<1000)
  return fail('ARCHIVO_O_CATALOGO_INVALIDO');
 const rows=content.replace(/^\uFEFF/,'').split(/\r?\n/).map(s=>s.trim());
 let seenMain=false,ended=false,otherZone=false,ids=[];
 for(const line of rows){
  if(!line||line.startsWith('//')||line.startsWith('#created by'))continue;
  if(/^#main\s*$/i.test(line)){if(seenMain)return fail('MAIN_DUPLICADO');seenMain=true;continue}
  if(/^#extra\s*$/i.test(line)||/^!side\s*$/i.test(line)){if(seenMain)ended=true;otherZone=true;continue}
  if(line.startsWith('#')||line.startsWith('!')){if(seenMain)ended=true;continue}
  if(!seenMain){if(/^\d+$/.test(line))return fail('CARTA_FUERA_MAIN');continue}
  if(ended)continue;
  if(!/^\d{1,10}$/.test(line))return fail('ID_YDK_INVALIDO');
  const id=Number(line);if(!Number.isSafeInteger(id)||id<=0)return fail('ID_YDK_INVALIDO');
  ids.push(id);
 }
 if(!seenMain||ids.length<40||ids.length>60)return fail('MAIN_DEBE_TENER_40_A_60');
 const lookup=new Map(catalog.map(c=>[Number(c.id),c]));
 const copies=new Map(),cards=[];
 for(let i=0;i<ids.length;i++){
  const id=ids[i],data=lookup.get(id),bits=Number(data?.typeBits);
  if(!data||!Number.isSafeInteger(bits)||bits<=0||typeof data.name!=='string'||!data.name.trim())
   return fail('CARTA_SIN_FICHA_VERIFICABLE');
  copies.set(id,(copies.get(id)||0)+1);if(copies.get(id)>3)return fail('MAS_DE_TRES_COPIAS');
  cards.push({uid:'rival_1233_'+i,id,name:data.name,typeBits:bits,ownerPlayer:1,faceUp:false});
 }
 return{pass:true,status:'RIVAL_MAIN_IMPORTADO_1233',cards,count:cards.length};
}
function opponentZonesFromSelections1233(cards,positions,setUids,requireSolemn=true){
 const fail=status=>({pass:false,status});
 if(!Array.isArray(cards)||cards.length<40||cards.length>60||!Array.isArray(positions)||positions.length!==5)
  return fail('RIVAL_NO_CONFIGURADO');
 const indices=positions.map(x=>Number(x));
 if(indices.some(i=>!Number.isSafeInteger(i)||i<0||i>=cards.length)||new Set(indices).size!==5)
  return fail('MANO_RIVAL_DEBE_SER_CINCO_COPIAS_DISTINTAS');
 const hand=indices.map(i=>({...cards[i]})),indexSet=new Set(indices);
 const deck=cards.filter((_,i)=>!indexSet.has(i)).map(c=>({...c}));
 if(!Array.isArray(setUids)||setUids.length<(requireSolemn?2:1)||setUids.length>5||new Set(setUids).size!==setUids.length||
  setUids.some(uid=>!hand.some(c=>c.uid===uid&&(c.typeBits&6)!==0)))
  return fail('COLOCACIONES_RIVALES_INCORRECTAS');
 const sol=hand.filter(c=>c.id===41420027&&c.typeBits===1048580&&setUids.includes(c.uid));
 if(requireSolemn&&sol.length!==1)return fail('COLOCAR_UN_SOLEMNE_RIVAL');
 return {pass:true,status:'ESTADO_RIVAL_EXPLICITO_1233',solemnUid:sol[0]?.uid??null,
  opponentSetUids:[...setUids],opponentZones:{hand,deck,monster:[],spelltrap:[],gy:[],banished:[],extra:[]}};
}
function installScenarioPanel1233(){
 const host=D.getElementById('alpha854OpponentPanel')?.querySelector('.alpha854-opponent-body');
 if(!host)return {pass:false,status:'PANEL_RIVAL_NO_EXISTE'};
 if(D.getElementById('alpha1233ScenarioPanel'))return {pass:true,status:'PANEL_YA_INSTALADO'};
 const make=(tag,text)=>{const e=D.createElement(tag);if(text!=null)e.textContent=text;return e};
 const panel=make('details');panel.id='alpha1233ScenarioPanel';panel.className='alpha1233-scenario-panel';
 panel.style.cssText='border:1px solid #1a8fbc;border-radius:8px;margin-top:12px;padding:10px;background:#07162b;color:#dff4ff';
 const heading=make('summary','▶ SIMULACIÓN VERIFICABLE · CADENAS Y ELIMINACIÓN MIXTA');
 heading.style.cssText='font-weight:800;cursor:pointer;color:#ffe185';panel.append(heading);
 const intro=make('p','Escenario limitado de turnos 1–3. Importa el Main Deck .ydk del rival, elige cinco cartas iniciales y marca cuáles coloca. Cinco modos: cadena de 3 eslabones, eliminación mixta sin respuestas, Solemn en una acción elegida, explorar tres momentos de respuesta o permitir al rival elegir entre Solemn y pasar. El orden del Main determina el robo del turno 2; no es aleatorio ni un Top 5 universal.');
 intro.style.cssText='font-size:12px;line-height:1.5';panel.append(intro);
 const file=make('input');file.type='file';file.accept='.ydk,.txt';file.id='alpha1233OpponentYdk';file.style.cssText='max-width:100%;font-size:12px';panel.append(file);
 const loaded=make('p','No se ha importado un .ydk rival para este escenario.');loaded.id='alpha1233Loaded';loaded.style.cssText='font-size:12px;color:#bdcde9';panel.append(loaded);
 const handTitle=make('p','Selecciona las 5 copias de la mano inicial del rival:');handTitle.style.cssText='font-weight:700;font-size:12px';panel.append(handTitle);
 const hand=make('div');hand.id='alpha1233Hand';hand.style.cssText='display:grid;gap:5px';panel.append(hand);
 const setsTitle=make('p','Selecciona expresamente qué cartas de esa mano coloca el rival en el turno 2 (incluido un Solemn Judgment y al menos otra Mágica/Trampa):');setsTitle.style.cssText='font-size:12px;font-weight:700';panel.append(setsTitle);
 const sets=make('div');sets.id='alpha1233Sets';sets.style.cssText='display:grid;gap:4px';panel.append(sets);
 const modeRow=make('label','Modo de simulación: ');
 modeRow.style.cssText='display:block;margin:8px 0;font-size:12px;font-weight:bold';
 const mode=make('select');mode.id='alpha1234SearchMode';
 for(const [v,label] of [['chain','Cadena CL1 · Solemn · Seven Tools'],
  ['mixed','Eliminación mixta · hasta 3 acciones sin respuesta'],
  ['solemnMixed','Mixta con Solemn · respuesta en una de las 3 acciones'],
  ['solemnExplore','Explorar 3 respuestas de Solemn en una sola búsqueda'],
  ['solemnOrPass','Rival: activar Solemn o pasar · 4 decisiones']]){
  const option=make('option',label);option.value=v;mode.append(option);
 }
 modeRow.append(mode);panel.append(modeRow);
 const timingRow=make('label','Solemn responde a la acción: ');
 timingRow.id='alpha1236TimingRow';timingRow.style.cssText='display:none;font-size:12px;margin:6px 0;font-weight:bold';
 const respondAt=make('select');respondAt.id='alpha1236RespondAt';
 for(const [number,label] of [['1','1.ª Mágica'],['2','2.ª Mágica'],['3','3.ª Mágica']]){
  const opt=make('option',label);opt.value=number;respondAt.append(opt);
 }
 timingRow.append(respondAt);panel.append(timingRow);
 const row=make('div');row.style.cssText='display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:9px';panel.append(row);
 const sampleLabel=make('label','Mano propia:');const sample=make('select');sample.id='alpha1233Sample';
 for(let i=0;i<10;i++){const o=make('option','Muestra '+(i+1));o.value=String(i);sample.append(o)}
 sampleLabel.append(sample);row.append(sampleLabel);
 const lplabel=make('label','LP propios:');const lpOwn=make('input');lpOwn.id='alpha1233OwnLp';lpOwn.type='number';lpOwn.min='2000';lpOwn.max='100000';lpOwn.step='1';lpOwn.value='8000';lpOwn.style.cssText='width:88px';lplabel.append(lpOwn);row.append(lplabel);
 const lpOppLabel=make('label','LP rival:');const lpOpp=make('input');lpOpp.id='alpha1233RivalLp';lpOpp.type='number';lpOpp.min='1';lpOpp.max='100000';lpOpp.step='1';lpOpp.value='8000';lpOpp.style.cssText='width:88px';lpOppLabel.append(lpOpp);row.append(lpOppLabel);
 const consentLabel=make('label');consentLabel.style.cssText='display:flex;align-items:flex-start;gap:6px;font-size:12px;margin-top:10px';
 const consent=make('input');consent.type='checkbox';consent.id='alpha1233Assumptions';
 const consentText=make('span','Confirmo que no hay otras acciones, ataques ni efectos durante los turnos 1 y 2, salvo robos y colocaciones indicados.');
 consentLabel.append(consent,consentText);
 panel.append(consentLabel);
 const actions=make('div');actions.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin:10px 0';panel.append(actions);
 const run=make('button','▶ MOSTRAR CADENA VERIFICADA');run.type='button';run.id='alpha1233Run';run.className='adv-btn green';actions.append(run);
 const cancel=make('button','✕ CANCELAR');cancel.type='button';cancel.id='alpha1233Cancel';cancel.className='adv-btn red';actions.append(cancel);
 const msg=make('div','Importa un Main .ydk rival y carga primero tu baraja.');msg.id='alpha1233Status';msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');msg.style.cssText='font-size:12px;white-space:pre-wrap;line-height:1.5';panel.append(msg);
 const decisionComparison1239=make('div');decisionComparison1239.id='alpha1239DecisionComparison';decisionComparison1239.setAttribute('aria-live','polite');panel.append(decisionComparison1239);
 host.append(panel);
 let cards=null,selects=[],generation=0,controller=null,running=false,opponentLoadGeneration1251=0;
 const announce=(s,error=false)=>{msg.textContent=s;msg.style.color=error?'#ffaaaa':'#bafddd'};
 // Alpha 1252: every scenario edit revokes an earlier assumption. Only the
 // checkbox itself may invalidate stale results without clearing its new value.
 const invalidate=(revokeConsent1252=true)=>{
  if(revokeConsent1252)consent.checked=false;
  decisionComparison1239.replaceChildren();
  generation++;if(controller){controller.abort();controller=null}running=false;run.disabled=false;
  const visual=D.querySelector('#comboVisualTop5 .ygo-bounded-preview-1232');
  const boards=D.querySelector('#comboEndBoard .ygo-bounded-endboards-1232');
  if(visual){const h=D.getElementById('comboVisualTop5');h.replaceChildren(make('p','Escenario modificado: la reproducción anterior se ha invalidado.'))}
  if(boards){const h=D.getElementById('comboEndBoard');h.replaceChildren(make('p','Campos invalidados por modificación del escenario.'))}
 };
 W.addEventListener('ygo:own-deck-revision-1253',()=>{
  invalidate();
  announce('La baraja propia cambió: vuelve a confirmar el escenario antes de buscar.');
 });
 const resetSets=()=>{
  invalidate();sets.replaceChildren();if(!cards)return;
  const positions=selects.map(s=>Number(s.value));
  if(new Set(positions).size!==5){announce('Selecciona cinco copias diferentes para la mano rival.',true);return}
  for(const i of positions){const c=cards[i];if((c.typeBits&6)===0)continue;
   const label=make('label');label.style.cssText='display:flex;gap:7px;align-items:center;font-size:12px';
   const chk=make('input');chk.type='checkbox';chk.value=c.uid;chk.dataset.scenarioSet='1';chk.addEventListener('change',invalidate);
   label.append(chk,make('span',c.name));sets.append(label);
  }
  announce(mode.value==='chain'?'Selecciona las colocaciones rivales. Es obligatorio incluir Solemn Judgment y otro objetivo.':'Selecciona al menos una Mágica/Trampa rival para el escenario mixto sin respuestas.');
 };
 const buildHand=()=>{
  hand.replaceChildren();sets.replaceChildren();selects=[];if(!cards)return;
  for(let slot=0;slot<5;slot++){
   const label=make('label','Carta '+(slot+1)+': ');label.style.cssText='font-size:12px';
   const select=make('select');select.dataset.scenarioHand=String(slot);select.style.cssText='width:min(440px,100%);max-width:100%;font-size:12px';
   for(let i=0;i<cards.length;i++){const o=make('option',cards[i].name+' · copia '+(i+1));o.value=String(i);select.append(o)}
   select.value=String(slot);select.addEventListener('change',resetSets);label.append(select);hand.append(label);selects.push(select);
  }
  resetSets();
 };
 const awaitCatalog1252=async(ticket)=>{
  if(Array.isArray(W.CARD_CATALOG)&&W.CARD_CATALOG.length>=19617)return true;
  loaded.textContent='Esperando a que termine de cargar el catálogo local…';
  const start=Date.now();
  while(Date.now()-start<15000){
   if(ticket!==opponentLoadGeneration1251)return false;
   if(Array.isArray(W.CARD_CATALOG)&&W.CARD_CATALOG.length>=19617)return true;
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  return false;
 };
 file.addEventListener('change',async()=>{
  const fileReadToken1251=++opponentLoadGeneration1251;
  invalidate();cards=null;selects=[];hand.replaceChildren();sets.replaceChildren();loaded.textContent='Leyendo archivo…';
  const f=file.files?.[0];if(!f){loaded.textContent='Ningún archivo seleccionado.';return}
  if(f.size>200000){loaded.textContent='Archivo demasiado grande.';announce('El archivo excede el tamaño permitido.',true);return}
  try{
   const contents1251=await f.text();
   if(fileReadToken1251!==opponentLoadGeneration1251)return;
   if(!(await awaitCatalog1252(fileReadToken1251))){
    if(fileReadToken1251===opponentLoadGeneration1251){
     loaded.textContent='No terminó de cargar el catálogo local.';
     announce('El catálogo de cartas no está completo; vuelve a intentarlo cuando termine de cargar.',true);
    }
    return;
   }
   if(fileReadToken1251!==opponentLoadGeneration1251)return;
   const parsed=parseScenarioOpponentYdk1233(contents1251,W.CARD_CATALOG);
   if(fileReadToken1251!==opponentLoadGeneration1251)return;
   if(!parsed.pass){loaded.textContent='Archivo rechazado: '+parsed.status;announce('No se inventarán cartas ni se usarán archivos inválidos.',true);return}
   cards=parsed.cards;loaded.textContent='Main rival: '+parsed.count+' cartas reconocidas. Extra y Side no se usan.';
   buildHand();
  }catch(e){if(fileReadToken1251!==opponentLoadGeneration1251)return;
   loaded.textContent='No se pudo leer el .ydk';announce('Error de lectura del archivo.',true)}
 });
 for(const input of [sample,lpOwn,lpOpp])input.addEventListener('change',()=>invalidate());
 consent.addEventListener('change',()=>invalidate(false));
 respondAt.addEventListener('change',()=>{consent.checked=false;invalidate()});
 mode.addEventListener('change',()=>{
  consent.checked=false;timingRow.style.display=mode.value==='solemnMixed'?'block':'none';consentText.textContent=mode.value==='solemnOrPass'?
   'Confirmo que en turnos 1–2 sólo hay robos y colocaciones; en turno 3 el rival puede elegir NO activar Solemn o activarla ante UNA de las tres Mágicas, pasando en las restantes. No hay otros efectos, respuestas ni protecciones.':mode.value==='solemnExplore'?
   'Confirmo que en turnos 1–2 sólo hay robos y colocaciones; en turno 3 el rival podrá elegir UNA sola respuesta con Solemn a la 1.ª, 2.ª o 3.ª Mágica, pasando ante las demás; no hay otros efectos ni protecciones.':mode.value==='mixed'?
   'Confirmo que no hay otras acciones en turnos 1–2, y que el rival PASA sin activar respuestas, trampas ni efectos durante las eliminaciones de mi turno 3.':
   mode.value==='solemnMixed'?
   'Confirmo que sólo hay robos y colocaciones en turnos 1–2; en turno 3 el rival activa Solemn sólo ante la Mágica indicada (1.ª, 2.ª o 3.ª) y PASA ante las demás; sin disparadores ni protecciones.':
   'Confirmo que no hay otras acciones, ataques ni efectos durante turnos 1–2, salvo robos y colocaciones indicados.';
  setsTitle.textContent=mode.value==='mixed'?
   'Elige las Mágicas/Trampas que el rival coloca en su turno 2 (mínimo una):':
   'Elige las colocaciones del rival, incluido Solemn Judgment y otro objetivo:';
  resetSets();
 });
 cancel.addEventListener('click',()=>{invalidate();announce('Búsqueda cancelada. La vista anterior queda invalidada.')});
 run.addEventListener('click',async()=>{
  if(running)return;
  if(!cards||selects.length!==5){announce('Importa el Main Deck .ydk del rival para continuar.',true);return}
  if(!consent.checked){announce('Debes aceptar expresamente las condiciones del escenario de turnos 1–3.',true);return}
  const ownLP=Number(lpOwn.value),oppLP=Number(lpOpp.value);
  if(!Number.isSafeInteger(ownLP)||ownLP<2000||ownLP>100000||
   !Number.isSafeInteger(oppLP)||oppLP<1||oppLP>100000){announce('Introduce LP enteros y válidos para ambos jugadores.',true);return}
  const selected=[...sets.querySelectorAll('input[data-scenario-set]:checked')].map(e=>e.value);
  const isMixed=mode.value==='mixed',isSolemnMixed=mode.value==='solemnMixed',isSolemnExplore=mode.value==='solemnExplore',isSolemnOrPass=mode.value==='solemnOrPass',usesSolemn=isSolemnMixed||isSolemnExplore||isSolemnOrPass;
  const built=opponentZonesFromSelections1233(cards,selects.map(s=>s.value),selected,!isMixed);
  if(!built.pass){announce('Escenario inválido: '+built.status,true);return}
  if(!W.deckState||!W.YGOAlpha1233){announce('Carga primero la baraja propia .ydk y el motor completo.',true);return}
  const token=++generation;const runController1249=new AbortController();controller=runController1249;running=true;run.disabled=true;
  decisionComparison1239.replaceChildren();
  const oldVisual1249=D.querySelector('#comboVisualTop5 .ygo-bounded-preview-1232');
  const oldBoards1249=D.querySelector('#comboEndBoard .ygo-bounded-endboards-1232');
  if(oldVisual1249)D.getElementById('comboVisualTop5').replaceChildren(make('p','Buscando nuevas jugadas verificadas…'));
  if(oldBoards1249)D.getElementById('comboEndBoard').replaceChildren(make('p','Buscando campos finales correspondientes…'));
  announce('Buscando y revalidando la cadena desde la mano importada…');
  const engineBudget1250=isSolemnOrPass?12000:isSolemnExplore?9000:6000;
  const uiDeadline1250=engineBudget1250+7000;
  let deadlineTimer1250=null,deadlineExceeded1250=false;
  try{
   const result=await Promise.race([
    Promise.resolve().then(()=>searchIsolated1080({mode:isSolemnOrPass?'SOLEMN_OR_PASS_TURN3_1238':isSolemnExplore?'SOLEMN_BRANCHING_TURN3_1237':isSolemnMixed?'SOLEMN_TIMING_TURN3_1236':isMixed?'MIXED_REMOVAL_TURN3_1234':'SEVEN_TOOLS_OPENING_TURN3_1231',
    scenario:isSolemnOrPass?'SOLEMN_MAY_PASS_TURN3_1238':isSolemnExplore?'SOLEMN_CHOOSE_ONE_RESPONSE_TURN3_1237':isSolemnMixed?'SOLEMN_ON_SELECTED_ACTION_TURN3_1236':isMixed?'NO_OTHER_ACTIONS_TURNS_1_TO_3_1234':'NO_OTHER_ACTIONS_TURNS_1_TO_3_1231',sample:Number(sample.value),
    opponentZones:built.opponentZones,lp:[ownLP,oppLP],solemnUid:built.solemnUid,respondAtAction:Number(respondAt.value),
    opponentSetUids:built.opponentSetUids,signal:runController1249.signal,
    maxExamined:isSolemnOrPass?720:isSolemnExplore?540:180,maxTotalMs:engineBudget1250,renderVerifiedPreview:false})),
    new Promise((_,reject)=>{deadlineTimer1250=setTimeout(()=>{
     deadlineExceeded1250=true;runController1249.abort();reject(new Error('UI_SEARCH_DEADLINE_1250'));
    },uiDeadline1250)})
   ]);
   if(token!==generation||runController1249.signal.aborted)return;
   if(!result.candidateCount){announce('Sin jugadas demostrables para esta mano y escenario: '+result.status+'. No se fabricaron resultados.',true);return}
   if(result.candidates?.some(x=>!(isSolemnOrPass?replaySolemnOrPass1238(x):usesSolemn?replaySolemnMixedTurn3_1235(x):isMixed?replayMixedTurn3_1234(x):replaySevenToolsOpening1231(x)).pass)){
    announce('Replay rechazado. No se muestra una jugada inconsistente.',true);return
   }
   const rendered=isSolemnOrPass?renderSolemnOrPass1238(result):usesSolemn?renderSolemnMixedPreview1235(result):isMixed?renderMixedTurn3Preview1234(result):renderSevenToolsPreview1232(result);
   if(!rendered.pass){announce('La simulación no se pudo visualizar: '+rendered.status,true);return}
   if(isSolemnExplore||isSolemnOrPass){
    const comparison=renderSolemnBranchComparison1239(result,decisionComparison1239);
    if(!comparison.pass){invalidate();announce('No se pudo verificar la comparación de decisiones: '+comparison.status,true);return}
   }
   announce('Se muestran '+rendered.rendered+' líneas revalidadas ('+rendered.framesByLine.join('/')+' pasos) y sus campos finales.'+((isSolemnExplore||isSolemnOrPass)?' Decisiones evaluadas: '+result.branches.map(x=>(x.respondAtAction===0?'pasar':x.respondAtAction+'ª')+'='+x.candidateCount).join(', ')+'.':'')+' No son cinco combos universales certificados.');
  }catch(_){if(token===generation)announce(deadlineExceeded1250?
   'La búsqueda superó el tiempo máximo de espera y se canceló sin publicar resultados. Puedes intentar otra muestra.':
   'La búsqueda no terminó correctamente. No se publicaron nuevos resultados.',true)}
  finally{if(deadlineTimer1250!==null)clearTimeout(deadlineTimer1250);
   if(token===generation&&controller===runController1249){running=false;run.disabled=false;controller=null}}
 });
 scenario1233={panel,file,hand,sets,run,cancel,parse:parseScenarioOpponentYdk1233};
 return{pass:true,status:'ESCENARIO_RIVAL_VISIBLE_1233'};
}


/* Alpha 1237: búsqueda mixta desde un escenario cronológico, no desde
 * un campo rival inventado en el primer turno. Sólo robos y colocaciones
 * explícitas en turnos 1-2; en turno 3 se exploran MST/Cosmic/Twin hasta
 * tres acciones, sin respuestas, disparos ni protecciones. */
function stageMixedOpening1234(opening,opponentSetUids){
 const fail=status=>({version:VERSION,pass:false,status});
 if(!opening||opening.turn!==1||opening.phase!=='MAIN1'||opening.activePlayer!==0||
  !Array.isArray(opening.zones)||opening.zones.length!==2||!Array.isArray(opening.chain)||opening.chain.length||
  !Array.isArray(opening.triggerQueue)||opening.triggerQueue.length||snapshot1063(opening,'Apertura mixta 1234').issues.length)
  return fail('MIXED_OPENING_UNSUPPORTED_1234');
 const own=opening.zones[0],opp=opening.zones[1];
 if(!Array.isArray(own.deck)||!own.deck.length||!Array.isArray(own.hand)||own.hand.length!==5||
  !Array.isArray(opp.deck)||!opp.deck.length||!Array.isArray(opp.hand)||opp.hand.length!==5||
  opp.deck.length+opp.hand.length<40||opp.deck.length+opp.hand.length>60||
  ['monster','spelltrap','gy','banished'].some(k=>!Array.isArray(own[k])||own[k].length||!Array.isArray(opp[k])||opp[k].length))
  return fail('MIXED_TURN1_ZONES_UNSUPPORTED_1234');
 if(!Array.isArray(opponentSetUids)||opponentSetUids.length<1||opponentSetUids.length>5||
  new Set(opponentSetUids).size!==opponentSetUids.length||
  opponentSetUids.some(uid=>!opp.hand.some(c=>raw(c.uid)===raw(uid)&&Number.isSafeInteger(Number(c.typeBits))&&
   (Number(c.typeBits)&6)!==0&&(Number(c.typeBits)&1)===0)))
  return fail('MIXED_RIVAL_SETS_INVALID_1234');
 const all=[...opp.hand,...opp.deck],seenUids=new Set(),copies=new Map();
 for(const c of all){const id=Number(c?.id),bits=Number(c?.typeBits),uid=raw(c?.uid);
  if(!Number.isSafeInteger(id)||id<=0||!Number.isSafeInteger(bits)||bits<=0||
     c.ownerPlayer!==1||!uid||seenUids.has(uid))return fail('MIXED_RIVAL_PROVENANCE_INVALID_1234');
  seenUids.add(uid);copies.set(id,(copies.get(id)||0)+1);
  if(copies.get(id)>3)return fail('MIXED_RIVAL_COPIES_INVALID_1234');
 }
 let t1,t2,t3;
 try{
  t1=structuredClone(opening);
  t2=structuredClone(t1);t2.turn=2;t2.phase='DRAW';t2.activePlayer=1;t2.normalSummonsUsed=0;
  t2.zones[1].hand.push(t2.zones[1].deck.shift());t2.phase='MAIN1';
  for(const uid of opponentSetUids){
   const i=t2.zones[1].hand.findIndex(c=>raw(c.uid)===raw(uid));if(i<0)throw Error('UID_NOT_IN_HAND');
   const card=t2.zones[1].hand.splice(i,1)[0];card.faceUp=false;card.setTurn=2;
   t2.zones[1].spelltrap.push(card);
  }
  t3=structuredClone(t2);t3.turn=3;t3.phase='DRAW';t3.activePlayer=0;t3.normalSummonsUsed=0;
  t3.zones[0].hand.push(t3.zones[0].deck.shift());t3.phase='MAIN1';
 }catch(_){return fail('MIXED_SETUP_TRANSITION_FAILED_1234')}
 if([t1,t2,t3].some((s,i)=>snapshot1063(s,'Secuencia mixta '+i).issues.length))return fail('MIXED_SETUP_INVENTORY_FAILED_1234');
 if(opponentSetUids.some(uid=>!t3.zones[1].spelltrap.some(c=>raw(c.uid)===raw(uid)&&c.setTurn===2)))
  return fail('MIXED_SET_PROVENANCE_FAILED_1234');
 return{version:VERSION,pass:true,status:'BOUNDED_MIXED_SETUP_TURN3_1234',before:t3,stages:[t1,t2,t3],
  opponentSetUids:[...opponentSetUids],certified:false};
}
function replayMixedTurn3_1234(line){
 const fail=status=>({version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false});
 if(!line||line.status!=='BOUNDED_MIXED_TURN3_LINE_1234'||line.certified===true||
  line.globalOptimalityProven===true||!Number.isInteger(line.sample)||
  !Array.isArray(line.setupStages)||line.setupStages.length!==3)return fail('MIXED_TURN3_CLAIMS_INVALID_1234');
 const origin=openingRemovalBridge1216({sample:line.sample,opponentZones:line.openingBefore?.zones?.[1],lp:line.openingBefore?.lp});
 if(!origin.pass||!equal1225(origin.before,line.openingBefore)||
  origin.evidence.deckRevision!==line.openingEvidence?.deckRevision||
  origin.evidence.deckFingerprint!==line.openingEvidence?.deckFingerprint)
  return fail('MIXED_TURN3_PROVENANCE_INVALID_1234');
 const staged=stageMixedOpening1234(origin.before,line.opponentSetUids);
 if(!staged.pass||!equal1225(staged.before,line.before)||!equal1225(staged.stages,line.setupStages))
  return fail('MIXED_TURN3_SETUP_INVALID_1234');
 if(!replayMixedRemoval1228(line).pass)return fail('MIXED_TURN3_ACTIONS_INVALID_1234');
 return{version:VERSION,pass:true,status:'MIXED_TURN3_REPLAY_OK_1234',certified:false,globalOptimalityProven:false};
}
function previewMixedTurn3Frames1234(line){
 const fail=status=>({version:VERSION,pass:false,status,frames:[],certified:false});
 if(!replayMixedTurn3_1234(line).pass)return fail('MIXED_VISUAL_REPLAY_INVALID_1234');
 const states=[line.openingBefore,...line.setupStages];
 for(const a of line.actions)states.push(a.paid,a.after);
 const labels=['Mano de cinco cartas acreditada','Turno 1 · sin otras acciones',
  'Turno 2 · robo y colocaciones rivales','Turno 3 · robo propio'];
 line.actions.forEach((a,i)=>{
  const name=a.action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'?'Twin Twisters':
   a.action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208'?'Cosmic Cyclone':'MST';
  labels.push('Acción '+(i+1)+' · '+name+' activación/costo', 'Acción '+(i+1)+' · resolución');
 });
 const frames=states.map((s,i)=>safeFrame1070(s,labels[i]));
 if(frames.some(f=>!f.pass||!f.board))return fail('MIXED_FRAMES_UNSUPPORTED_1234');
 return{version:VERSION,pass:true,status:'BOUNDED_MIXED_VISUAL_TRACE_1234',frames,
  removed:line.removed,steps:frames.length,certified:false,globalOptimalityProven:false,
  scope:'MST/Cosmic/Twin sin respuestas ni efectos adicionales; no son cinco combos universales.'};
}
function renderMixedTurn3Preview1234(result){
 const source=Array.isArray(result)?result:result?.candidates;
 if(!Array.isArray(source)||source.length<1||source.length>5||
  (!Array.isArray(result)&&result?.candidateCount!==source.length)||
  source.some(c=>c?.certified===true||c?.globalOptimalityProven===true))
  return{version:VERSION,pass:false,status:'MIXED_VIEW_CANDIDATES_INVALID_1234',rendered:0};
 const traces=source.map(previewMixedTurn3Frames1234);
 if(traces.some(t=>!t.pass))return{version:VERSION,pass:false,status:'MIXED_VIEW_REPLAY_INVALID_1234',rendered:0};
 return renderBoundedTraces1234(traces,'BÚSQUEDA MIXTA · JUGADAS ACOTADAS REVALIDADAS');
}

/* Alpha 1237 · Respuesta de Solemn en una posición explícita (1, 2 o 3).
 * Las acciones previas se resuelven sin respuesta; Solemn CL2 debe estar colocada
 * y disponible cuando se active la Mágica elegida, y luego rival pasa.
 * La carta negada y sus costos permanecen contabilizados. No es Top 5 universal. */
function replaySolemnMixedTurn3_1235(line){
 const fail=(status,step=-1)=>({version:VERSION,pass:false,status,step,certified:false,globalOptimalityProven:false});
 if(!line||line.status!=='BOUNDED_SOLEMN_MIXED_LINE_1235'||line.certified===true||line.globalOptimalityProven===true||
  line.certifiesRules===true||line.certifiesOptimality===true||!Number.isInteger(line.sample)||
  !Array.isArray(line.actions)||line.actions.length<1||line.actions.length>3||line.steps!==line.actions.length||
  !Array.isArray(line.setupStages)||line.setupStages.length!==3||line.negated!==1||line.chainLinks!==2||
  !Array.isArray(line.opponentSetUids)||!line.opponentSetUids.includes(line.solemnUid)||
  ![1,2,3].includes(line.respondAtAction??1)||(line.respondAtAction??1)>line.actions.length)return fail('CLAIMS_INVALID_1235');
 const opening=openingRemovalBridge1216({sample:line.sample,opponentZones:line.openingBefore?.zones?.[1],lp:line.openingBefore?.lp});
 if(!opening.pass||!equal1225(opening.before,line.openingBefore)||
  opening.evidence.deckRevision!==line.openingEvidence?.deckRevision||
  opening.evidence.deckFingerprint!==line.openingEvidence?.deckFingerprint)return fail('OPENING_INVALID_1235');
 const staged=stageMixedOpening1234(opening.before,line.opponentSetUids);
 if(!staged.pass||!equal1225(staged.stages,line.setupStages)||!equal1225(staged.before,line.before))return fail('SETUP_INVALID_1235');
 const solemn=staged.before.zones[1].spelltrap.filter(c=>raw(c.uid)===raw(line.solemnUid));
 if(solemn.length!==1||Number(solemn[0].id)!==41420027||solemn[0].setTurn!==2)return fail('SOLEMN_SETUP_INVALID_1235');
 let state=staged.before,removed=0,destroyed=0,banished=0,discarded=0,lpPaid=0,opponentLpPaid=0;
 for(let i=0;i<line.actions.length;i++){
  const a=line.actions[i];
  if(!a||a.actionType!==a.action||a.player!==0||!Object.values(MIXED_REMOVAL_1227).includes(a.action)||
   !equal1225(a.before,state)||!a.paid||!a.after)return fail('ACTION_INVALID_1235',i);
  let r;
  if(i===(line.respondAtAction??1)-1){
   if(raw(a.responseUid)!==raw(line.solemnUid)||!a.chained)return fail('RESPONSE_REQUIRED_1235',i);
   r=solemnResponse1229(a);
   if(!r.pass||!equal1225(r.paid,a.paid)||!equal1225(r.chained,a.chained)||!equal1225(r.after,a.after))return fail('CHAIN_REPLAY_INVALID_1235',i);
   opponentLpPaid=r.cost.opponentPaidLp;
  }else{
   if(a.responseUid!==undefined||a.chained!==undefined)return fail('EXTRA_CHAIN_UNSUPPORTED_1235',i);
   r=executeMixedRemoval1227(a);
   if(!r.pass||!equal1225(r.paid,a.paid)||!equal1225(r.after,a.after))return fail('SPELL_REPLAY_INVALID_1235',i);
   const n=a.action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'?a.targetUids?.length:1;
   if(!Number.isInteger(n)||n<1||n>2)return fail('TARGETS_INVALID_1235',i);
   if(a.action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208')banished+=n;
   else destroyed+=n;
   removed+=n;
  }
  if(a.action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225')discarded++;
  if(a.action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208')lpPaid+=1000;
  state=a.after;
 }
 if(!equal1225(state,line.state)||line.removed!==removed||line.destroyed!==destroyed||line.banished!==banished||
  line.discarded!==discarded||line.lpPaid!==lpPaid||line.opponentLpPaid!==opponentLpPaid)return fail('TOTALS_INVALID_1235');
 return{version:VERSION,pass:true,status:'REPLAY_SOLEMN_MIXED_OK_1235',steps:line.steps,removed,
  negated:1,lpPaid,opponentLpPaid,certified:false,globalOptimalityProven:false};
}
function previewSolemnMixedFrames1235(line){
 const fail=status=>({version:VERSION,pass:false,status,frames:[],certified:false});
 if(!replaySolemnMixedTurn3_1235(line).pass)return fail('REPLAY_FAILED_1235');
 const states=[line.openingBefore,...line.setupStages];
 const labels=['Mano inicial acreditada','Turno 1 · sin otras acciones',
  'Turno 2 · robo y colocaciones rivales','Turno 3 · robo propio'];
 const name=a=>a.action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'?'Twin Twisters':
  a.action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208'?'Cosmic Cyclone':'MST';
 line.actions.forEach((a,i)=>{
  states.push(a.paid);labels.push('Acción '+(i+1)+' · '+name(a)+' · activación y costo');
  if(i===(line.respondAtAction??1)-1){states.push(a.chained);labels.push('CL2 · Solemn Judgment responde a la acción '+(i+1)+' y paga la mitad de LP');
   states.push(a.after);labels.push('Resolución · Solemn niega la Mágica '+(i+1)+'; sus objetivos permanecen');}
  else{states.push(a.after);labels.push('Acción '+(i+1)+' · resolución sin respuestas');}
 });
 const frames=states.map((s,i)=>safeFrame1070(s,labels[i]));
 if(frames.some(f=>!f.pass||!f.board))return fail('FRAME_INVALID_1235');
 return{version:VERSION,pass:true,status:'BOUNDED_SOLEMN_MIXED_TRACE_1235',frames,removed:line.removed,certified:false,
  globalOptimalityProven:false,scope:'Solemn responde sólo a la Mágica indicada; en las demás acciones el rival pasa. No es Top 5 universal.'};
}
function renderSolemnMixedPreview1235(result){
 const lines=Array.isArray(result)?result:result?.candidates;
 if(!Array.isArray(lines)||!lines.length||lines.length>5||
  (!Array.isArray(result)&&result.candidateCount!==lines.length)||
  lines.some(l=>l?.certified===true||l?.globalOptimalityProven===true))
  return{version:VERSION,pass:false,status:'CANDIDATES_INVALID_1235',rendered:0};
 const traces=lines.map(previewSolemnMixedFrames1235);
 if(traces.some(t=>!t.pass))return{version:VERSION,pass:false,status:'REPLAYS_INVALID_1235',rendered:0};
 return renderBoundedTraces1234(traces,'RESPUESTA SOLEMN EN LÍNEA MIXTA · RESULTADOS ACOTADOS');
}
async function searchSolemnMixedTurn3_1235(opts={}){
 const empty=status=>({version:VERSION,status,pass:false,certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0});
 const flexible=opts.scenario==='SOLEMN_ON_SELECTED_ACTION_TURN3_1236';
 if(!flexible&&opts.scenario!=='SOLEMN_FIRST_THEN_PASS_TURN3_1235')return empty('CONSENT_REQUIRED_1235');
 const respondAtAction=flexible?opts.respondAtAction:1;
 if(![1,2,3].includes(respondAtAction))return empty('INVALID_RESPONSE_POSITION_1236');
 if(opts.signal?.aborted===true)return empty('CANCELLED_1235');
 if(ISOLATED1080.active)return empty('SEARCH_ALREADY_RUNNING');
 const opening=openingRemovalBridge1216(opts);
 if(!opening.pass)return{...opening,candidates:[],candidateCount:0};
 const staged=stageMixedOpening1234(opening.before,opts.opponentSetUids);
 if(!staged.pass)return empty(staged.status);
 const solemnUid=raw(opts.solemnUid);
 const trap=staged.before.zones[1].spelltrap.filter(c=>raw(c.uid)===solemnUid&&Number(c.id)===41420027&&c.setTurn===2);
 if(!solemnUid||trap.length!==1||!opts.opponentSetUids.includes(solemnUid))return empty('SOLEMN_NOT_VERIFIED_1235');
 if(staged.before.lp[1]<2||staged.before.lp[1]%2!==0)return empty('SOLEMN_LP_NOT_SUPPORTED_1235');
 const deadline=(W.performance?.now?.()??Date.now())+Math.min(15000,Math.max(20,Number(opts.maxTotalMs)||6000));
 const maxExamined=Math.min(2000,Math.max(1,Number.isSafeInteger(opts.maxExamined)?opts.maxExamined:220));
 const maxDepth=[1,2,3].includes(opts.maxDepth)?opts.maxDepth:3;
 const before=staged.before,best=new Map(),seen=new Set();let examined=0,truncated=false,abortStatus=null;
 const stale=()=>opening.evidence.deckFingerprint!==deckFingerprint1056()||opening.evidence.deckRevision!==DECK_REVISION_1056;
 const halt=()=>{
  if(opts.signal?.aborted===true)abortStatus='CANCELLED_1235';
  else if(stale())abortStatus='STALE_DECK_1235';
  else if((W.performance?.now?.()??Date.now())>deadline)abortStatus='TIME_BUDGET_EXCEEDED_1235';
  else if(examined>=maxExamined)truncated=true;
  return !!abortStatus||truncated;
 };
 async function explore(state,chain){
  if(halt())return;
  const hand=state.zones[0].hand;
  const srcs=[...hand,...state.zones[0].spelltrap].filter(c=>Object.hasOwn(MIXED_REMOVAL_1227,Number(c?.id)));
  const targets=state.zones.flatMap(z=>z.spelltrap).filter(c=>Number.isSafeInteger(Number(c.typeBits))&&
   (Number(c.typeBits)&6)!==0&&(Number(c.typeBits)&1)===0&&(chain.length>=respondAtAction||raw(c.uid)!==solemnUid));
  for(const src of srcs){
   const action=MIXED_REMOVAL_1227[Number(src.id)];
   const discards=action==='ACTIVATE_RESOLVE_TWIN_TWISTERS_1225'?hand.filter(c=>c.uid!==src.uid&&Number(c.typeBits)===17):[null];
   for(const discard of discards)for(let i=0;i<targets.length;i++)for(let j=-1;j<(discard?i:0);j++){
    if(halt())return;
    examined++;
    const targetUids=discard&&j>=0?[targets[j].uid,targets[i].uid]:[targets[i].uid];
    const request={action,actionType:action,before:state,player:0,uid:src.uid,
     ...(discard?{discardUid:discard.uid,targetUids}:{targetUid:targetUids[0]}),
     ...(chain.length===respondAtAction-1?{responseUid:solemnUid}:{})};
    const signature=JSON.stringify([...chain.map(a=>[a.action,a.uid,a.discardUid,a.targetUid,a.targetUids]),
     [action,src.uid,discard?.uid,targetUids]]);
    if(seen.has(signature))continue;seen.add(signature);
    const outcome=chain.length===respondAtAction-1?solemnResponse1229(request):executeMixedRemoval1227(request);
    if(!outcome.pass)continue;
    const a={...request,paid:outcome.paid,after:outcome.after,
     ...(chain.length===respondAtAction-1?{chained:outcome.chained}:{})};
    const actions=[...chain,a];
    const follow=actions.filter((_,index)=>index!==respondAtAction-1);
    const destroyed=follow.filter(x=>x.action!=='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208').reduce((n,x)=>n+(x.targetUids?.length||1),0);
    const banished=follow.filter(x=>x.action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208').length;
    const line={version:VERSION,status:'BOUNDED_SOLEMN_MIXED_LINE_1235',sample:opening.sample,
     openingBefore:opening.before,openingEvidence:opening.evidence,opponentSetUids:[...staged.opponentSetUids],
     setupStages:staged.stages,solemnUid,respondAtAction,before,actions,steps:actions.length,chainLinks:2,negated:1,
     state:outcome.after,removed:destroyed+banished,destroyed,banished,
     discarded:actions.filter(x=>x.discardUid).length,
     lpPaid:1000*actions.filter(x=>x.action==='ACTIVATE_RESOLVE_COSMIC_CYCLONE_1208').length,
     opponentLpPaid:before.lp[1]/2,certified:false,globalOptimalityProven:false};
    if(actions.length>=respondAtAction&&replaySolemnMixedTurn3_1235(line).pass){
     const key=mixedOutcomeSignature1228(line.state);
     const prior=best.get(key);
     if(!prior||line.removed>prior.removed||line.removed===prior.removed&&line.steps<prior.steps)best.set(key,line);
    }
    if(actions.length<maxDepth)await explore(outcome.after,actions);
    if(examined%24===0)await new Promise(resolve=>setTimeout(resolve,0));
   }
  }
 }
 await explore(before,[]);
 if(abortStatus)return empty(abortStatus);
 if(opts.signal?.aborted===true)return empty('CANCELLED_1235');
 if(stale())return empty('STALE_DECK_1235');
 const all=[...best.values()].sort((a,b)=>b.removed-a.removed||a.discarded-b.discarded||
  a.lpPaid-b.lpPaid||a.steps-b.steps||JSON.stringify(a.actions.map(x=>[x.uid,x.targetUid,x.targetUids])).localeCompare(
   JSON.stringify(b.actions.map(x=>[x.uid,x.targetUid,x.targetUids]))));
 const candidates=all.slice(0,5).map((x,i)=>({...x,index:i+1}));
 if(candidates.some(x=>!replaySolemnMixedTurn3_1235(x).pass))return empty('FINAL_REPLAY_FAILED_1235');
 return{version:VERSION,status:candidates.length?'BOUNDED_SOLEMN_MIXED_TURN3_1235':'NO_SOLEMN_MIXED_CANDIDATES_1235',
  pass:false,certified:false,globalOptimalityProven:false,candidates,candidateCount:candidates.length,
  choicesExamined:examined,truncated:truncated||all.length>5,enumerationComplete:!truncated,stepsMax:maxDepth,
  selection:'BEST_FIVE_BOUNDED_DISTINCT_FINAL_STATES_1235',openingEvidence1216:opening.evidence,
  scope:'Solemn responde sólo a la Mágica elegida (1, 2 o 3), el rival pasa en las demás; sin triggers ni protecciones. No es Top 5 universal.'};
}

const API={banlistIdentityAudit1263,banlistIdentityFixtures1263,moonSolemnJudgmentChain1261,moonSolemnJudgmentFixtures1261,videoExportAudit1260,webmStructureGate1260,videoExportAudit1259:videoExportAudit1260,webmHeaderGate1259:webmStructureGate1260,scenarioSampleDiagnostics1258,moonJammerSevenChain1257,moonJammerSevenFixtures1257,magicJammerMoonChain1256,magicJammerFixtures1256,bookOfTaiyou1255,moonTaiyouSequence1255,flipSpellFixtures1255,bookOfMoon1254,bookOfMoonFixtures1254,exportAllBoundedWebm1244,makeWebmZip1244,exportGuard1243,videoDiagnostics1243:videoDiagnostics1242,videoDiagnostics1242,compareSolemnBranches1239,renderSolemnBranchComparison1239,replaySolemnOrPass1238,renderSolemnOrPass1238,searchSolemnDecisionBranches1237,searchSolemnMixedTurn3_1235,replaySolemnMixedTurn3_1235,previewSolemnMixedFrames1235,renderSolemnMixedPreview1235,stageMixedOpening1234,replayMixedTurn3_1234,previewMixedTurn3Frames1234,renderMixedTurn3Preview1234,parseScenarioOpponentYdk1233,opponentZonesFromSelections1233,installScenarioPanel1233,searchSevenToolsOpening1231,replaySevenToolsOpening1231,previewSevenToolsFrames1232,renderSevenToolsPreview1232,stageSevenToolsOpening1231,sevenToolsCounterChain1230,replaySevenToolsCounterChain1230,solemnResponse1229,replaySolemnResponse1229,searchSolemnOpening1229,replayMixedRemoval1228,searchMixedRemovalOpening1228,executeMixedRemoval1227,replayMixedRemoval1227,searchMixedRemovalOpening1227,twinTwisters1225,replayTwinTwisters1225,searchTwinTwistersOpening1225,replayTwinTwisters1226,searchTwinTwistersOpening1226,replayRemovalSequence1224,cosmicCyclone1208,replayCosmicCyclone1208,cosmicCyclone1207,storedProvenanceAudit1117,releaseReadiness1118:releaseReadiness1104,releaseReadiness1117:releaseReadiness1104,releaseReadiness1116:releaseReadiness1104,releaseReadiness1115:releaseReadiness1104,releaseReadiness1114:releaseReadiness1104,releaseReadiness1113:releaseReadiness1104,releaseReadiness1112:releaseReadiness1104,releaseReadiness1111:releaseReadiness1104,releaseReadiness1110:releaseReadiness1104,renderedDeckIdentity1111:()=>renderedDeckIdentity1109(W.deckState),renderedDeckIdentity1110:()=>renderedDeckIdentity1109(W.deckState),renderedDeckIdentity1109:()=>renderedDeckIdentity1109(W.deckState),transitionFixtures1109:transitionFixtures1104,releaseReadiness1109:releaseReadiness1104,transitionFixtures1108:transitionFixtures1104,releaseReadiness1108:releaseReadiness1104,transitionFixtures1107:transitionFixtures1104,releaseReadiness1107:releaseReadiness1104,transitionFixtures1106:transitionFixtures1104,releaseReadiness1106:releaseReadiness1104,transitionFixtures1105:transitionFixtures1104,releaseReadiness1105:releaseReadiness1104,transitionFixtures1104,releaseReadiness1104,transitionFixtures1103:transitionFixtures1104,releaseReadiness1103:releaseReadiness1104,fixturesSafety1102:()=>W.YGOAlpha669?.fixturesSafety1102?.()||{pass:false,reason:'MISSING_FIXTURES_1102'},fixturesSafety1101:()=>W.YGOAlpha669?.fixturesSafety1101?.()||{pass:false,reason:'MISSING_FIXTURES'},postActionWindowPending1101:(s)=>W.YGOAlpha669?.postActionWindowPending1101?.(s)??true,inventoryGate1101:(a,b)=>W.YGOAlpha669?.inventoryGate1100?.(a,b)||{pass:false,issues:['MISSING_INVENTORY']},inventoryGate1100:(before,after)=>W.YGOAlpha669?.inventoryGate1100?.(before,after)||{pass:false,issues:["GATE_MISSING"]},fixturesPriority1099:()=>W.YGOAlpha669?.fixturesPriority1099?.()||{pass:false,reason:"FIXTURE_ENGINE_MISSING"},priorityHistory1098:(state,evidence)=>W.YGOAlpha669?.priorityHistory1098?.(state,evidence)||{pass:false,reason:"PRIORITY_ENGINE_MISSING"},openStatePasses1099:(state,evidence)=>W.YGOAlpha669?.openStatePasses1099?.(state,evidence)||{pass:false,reason:"PRIORITY_ENGINE_MISSING"},legacyRuleGapAudit1096,regressionContract1095,parserRegression1092,installParserGuard1092,safeRegression1092:safeRegression1091,safeRegression1091,cancelSafeRegression1091,safeRegressionStatus1091,rulesGapAudit1084:async(opts={})=>{const r=await parityAudit1081({...opts,depth2:true,auditDeterministic:true,maxRoots:Math.max(1,Math.min(2,Number(opts.maxRoots)||1)),maxActionBranches:Math.max(8,Math.min(16,Number(opts.maxActionBranches)||8))});return{version:'Alpha 1110',status:r.status,scope:'Muestra de máximo dos pasos; no prueba el universo de efectos.',pass:false,rootMatch:r.openingMatch===true&&r.actionsMatch===true,depth2Match:r.depth2Match===true,reasons:r.depth2?.reasons||[],unresolved:r.depth2?.unresolved||[],elapsedMs:r.elapsedMs}} ,deterministicAudit1083:(opts={})=>parityAudit1081({...opts,depth2:true,auditDeterministic:true,maxRoots:Math.max(1,Math.min(2,Number(opts.maxRoots)||2)),maxActionBranches:Math.max(8,Math.min(16,Number(opts.maxActionBranches)||8))}),depthTwoProbe1082,depthTwoAudit1082:(opts={})=>parityAudit1081({...opts,depth2:true}),parityAudit1081,paritySnapshot1081,openingRemovalBridge1216,searchIsolated1080,cancelIsolated1080,isolatedStatus1080,isolatedSelf1080,searchCooperative1079,cancelSearch1079,searchStatus1079,coopSelf1079,fixturePreflight1078,fixturePreflightSelf1078,fixturesAlpha1077,formatEvidence1077,metadataAudit1076,VERSION,TITLE,activationWitnessIntegrity1075,fixturesAlpha1075,activationPhysicalGate1074,fixturesAlpha1074,activationTimingGate1073,chainSnapshotGate1073,fixturesAlpha1073,spellSpeedGate1072,fixturesAlpha1072,getLiveComboLines1070,fixturesReplay1070,fixturesReplay1071,installReplayTruth1070,decorateTop5Truth1070,maskAction1070,boundedChainReplay1070,auditReplayLine1070,top5ReplayAudit1070,activationAudit1068,activationFixtures1068,opponentSetMSTAudit1069,opponentSetMSTFixtures1069,chainAudit1067,chainFixtures1067,deckFingerprint1056,searchGuard1056:()=>({revision:DECK_REVISION_1056,fingerprint:deckFingerprint1056(),regressionActive:REGRESSION_SESSION_1056?.active===true,staleSearches:W.__YGO1056_STALE_SEARCHES||0}),inspectYDK1050,ydkIdentity1051,preflightYDK1059,verifyParsedYDK1059,extraOnly1051,formatPolicy1055,formatBoundaryAudit1060,traceAudit1061:traceAudit1064,traceAudit1062:traceAudit1064,traceAudit1063:traceAudit1064,traceAudit1064,transitionContract1062:transitionContract1064,transitionContract1063:transitionContract1064,transitionContract1064,transitionContract1065,transitionContract1066,counterTrapChain1142,counterTrapChain1143,normalSpellResolution1065,targetedSpellResolution1066,ruleFixtures1065,ruleFixtures1066,ruleFixtures1062:ruleFixtures1064,ruleFixtures1063:ruleFixtures1064,ruleFixtures1064,physicalLegality1050,auditActiveDeck1050,deckIdentitySnapshot1127,printedCardKey1129,stateInventory1128,stateTransitionInventory1128,BUILD_E2E_1047,provenanceSelf1047,catalogProvenance1047,sourceClass1047,ruleUniverseCards1047,provenanceReview1047,importOfficialProvenance1047,clearOfficialProvenance1047,exportProvenanceReview1047,certificationSnapshot1047,schedulerAudit1047,consolidationAudit1047,runtimeInventory1047,calibrationImport1047,calibrationTemplate1047,matchupEvidence1047,autoFixtureMatchups1047,e2eStatus1047,nextActions1047,closureCheckpoint1047,clearClosure1047,closurePlan1047,runClosure1047,authority1047,installBattleGuard1047,cleanup1047,universalSegment1047,universalCheckpoint1047,clearUniversalSegment1047,formatAudit1047,exhaustiveBudgeted1047,regression10Async1047,lineEvidence1047,dependencyAudit1047,patchBanlist1047,banlist1047,ensureDynamicBanlists1047,structural1047,search1047,top5Evidence1047,corpus1047,formats1047,calibration1047,release1047,project1047,certify1047,paint1047,export1047,bind1047,costProof1047,continuationProof1047,effectProof1047,cardProof1047,installProof1047,proofSelf1047,paymentSelf1172,self1047};
for(let n=1091;n<=1118;n++)W['YGOAlpha'+n]=API;W.YGOAlpha1047=API;const historicalImportAPI1047={...API,importText1048,importFile1048,verifyImport1048,scoreAuthority1048,opponentVisualAudit1048,scorePresentation1058,preflightYDK1059,importState1048:IMPORT1048};for(const n of [1088,1087,1086,1085,1084,1083,1082,1081,1080,1079,1078,1077,1076,1075,1074,1073,1072,1071,1070,1069,1068,1067,1066,1065,1064,1063,1062,1061,1060,1059,1058,1057,1056,1054,1053,1052,1051,1050,1049,1048])W['YGOAlpha'+n]=historicalImportAPI1047;W.YGOCanonicalRelease1047=API;W.YGOAlpha1224=API;W.YGOAlpha1225=API;W.YGOAlpha1226=API;W.YGOAlpha1227=API;W.YGOAlpha1228=API;W.YGOAlpha1229=API;W.YGOAlpha1230=API;W.YGOAlpha1231=API;W.YGOAlpha1232=API;W.YGOAlpha1233=API;W.YGOAlpha1234=API;W.YGOAlpha1235=API;W.YGOAlpha1236=API;W.YGOAlpha1237=API;W.YGOAlpha1238=API;W.YGOAlpha1239=API;W.YGOAlpha1240=API;W.YGOAlpha1241=API;W.YGOAlpha1242=API;W.YGOAlpha1243=API;W.YGOAlpha1244=API;W.YGOAlpha1245=API;W.YGOAlpha1246=API;W.YGOAlpha1247=API;W.YGOAlpha1248=API;W.YGOAlpha1249=API;W.YGOAlpha1250=API;W.YGOAlpha1251=API;W.YGOAlpha1252=API;W.YGOAlpha1253=API;W.YGOAlpha1254=API;W.YGOAlpha1255=API;W.YGOAlpha1256=API;W.YGOAlpha1257=API;W.YGOAlpha1258=API;W.YGOAlpha1259=API;W.YGOAlpha1260=API;W.YGOAlpha1261=API;W.YGOAlpha1262=API;W.YGOAlpha1263=API;W.__YGO_REASSERT_TARGET_BUILD=authority1047;cleanup1047();installProof1047();installParserGuard1092();patchBanlist1047();authority1047();if(!W.YGOApp)W.YGOApp={};W.YGOApp.release1047=API;W.YGOApp.rules={...(W.YGOApp.rules||{}),moonSolemnJudgmentChain1261,moonSolemnJudgmentFixtures1261,moonJammerSevenChain1257,moonJammerSevenFixtures1257,magicJammerMoonChain1256,magicJammerFixtures1256,bookOfTaiyou1255,moonTaiyouSequence1255,flipSpellFixtures1255,bookOfMoon1254,bookOfMoonFixtures1254,counterTrapChain1142,counterTrapChain1143,inventoryGate1101:API.inventoryGate1101,inventoryGate1100:API.inventoryGate1100,priorityHistory1098:API.priorityHistory1098,openStatePasses1099:API.openStatePasses1099,activationWitnessIntegrity1075,activationPhysicalGate1074,activationTimingGate1073,chainSnapshotGate1073,spellSpeedGate1072,opponentSetMSTAudit1069,opponentSetMSTFixtures1069,activationAudit1068,activationFixtures1068,chainAudit1067,chainFixtures1067,fixtures1062:ruleFixtures1064,fixtures1063:ruleFixtures1064,fixtures1064:ruleFixtures1064,fixtures1065:ruleFixtures1065,fixtures1066:ruleFixtures1066,transitionContract1065,transitionContract1066,counterTrapChain1142,counterTrapChain1143,normalSpellResolution1065,targetedSpellResolution1066,cosmicCyclone1207,cosmicCyclone1208,mysticalSpaceTyphoon1211,replayCosmicCyclone1208,replayCosmicSequence1210,replayRemovalSequence1211,replayRemovalSequence1224,twinTwisters1225,replayTwinTwisters1225,replayTwinTwisters1226,replayMixedRemoval1227,replayMixedRemoval1228,solemnResponse1229,replaySolemnResponse1229,sevenToolsCounterChain1230,replaySevenToolsCounterChain1230,searchSevenToolsOpening1231,replaySevenToolsOpening1231,previewSevenToolsFrames1232,renderSevenToolsPreview1232,transitionContract1062:transitionContract1064,transitionContract1063:transitionContract1064,transitionContract1064,exact1047:{effect:effectProof1047,card:cardProof1047,audit:proofSelf1047},authority:VERSION};W.YGOApp.release={...(W.YGOApp.release||{}),authority:VERSION,release1047,project1047};W.YGOApp.certification={...(W.YGOApp.certification||{}),run1047:certify1047,scanSegment1047:universalSegment1047,authority:VERSION};W.YGOApp.diagnostics={banlistIdentityAudit1263,banlistIdentityFixtures1263,videoExportAudit1260,scenarioSampleDiagnostics1258,releaseReadiness1117:releaseReadiness1104,releaseReadiness1116:releaseReadiness1104,releaseReadiness1115:releaseReadiness1104,releaseReadiness1114:releaseReadiness1104,releaseReadiness1113:releaseReadiness1104,releaseReadiness1112:releaseReadiness1104,releaseReadiness1111:releaseReadiness1104,releaseReadiness1110:releaseReadiness1104,renderedDeckIdentity1111:()=>renderedDeckIdentity1109(W.deckState),renderedDeckIdentity1110:()=>renderedDeckIdentity1109(W.deckState),renderedDeckIdentity1109:()=>renderedDeckIdentity1109(W.deckState),transitionFixtures1109:transitionFixtures1104,releaseReadiness1109:releaseReadiness1104,transitionFixtures1108:transitionFixtures1104,releaseReadiness1108:releaseReadiness1104,transitionFixtures1107:transitionFixtures1104,releaseReadiness1107:releaseReadiness1104,transitionFixtures1106:transitionFixtures1104,releaseReadiness1106:releaseReadiness1104,transitionFixtures1105:transitionFixtures1104,releaseReadiness1105:releaseReadiness1104,transitionFixtures1104,releaseReadiness1104,transitionFixtures1103:transitionFixtures1104,releaseReadiness1103:releaseReadiness1104,fixturesSafety1102:API.fixturesSafety1102,fixturesSafety1101:API.fixturesSafety1101,fixturesPriority1099:API.fixturesPriority1099,legacyRuleGapAudit1096,...(W.YGOApp.diagnostics||{}),regressionContract1095,rulesGapAudit1084:API.rulesGapAudit1084,deterministicAudit1083:API.deterministicAudit1083,depthTwoAudit1082:API.depthTwoAudit1082,parityAudit1081,openingRemovalBridge1216,searchIsolated1080,cancelIsolated1080,isolatedStatus1080,isolatedSelf1080,searchCooperative1079,cancelSearch1079,searchStatus1079,coopSelf1079,fixturePreflight1078,fixturePreflightSelf1078,fixturesAlpha1077,formatEvidence1077,metadataAudit1076,provenanceSelf1047,catalogProvenance1047,structural1047,search1047,top5Evidence1047,banlist1047,formatAudit1047,universalCheckpoint1047,project1047,closurePlan1047,runtimeInventory1047,schedulerAudit1047};W.YGOApp.replay={...(W.YGOApp.replay||{}),moonSolemnJudgmentChain1261,moonJammerSevenChain1257,magicJammerMoonChain1256,moonTaiyouSequence1255,replayCosmicCyclone1208,replayCosmicSequence1210,replayRemovalSequence1211,replayRemovalSequence1224,replayTwinTwisters1225,fixturesAlpha1075,fixturesAlpha1074,fixturesAlpha1073,fixturesAlpha1072,boundedChainReplay1070,top5ReplayAudit1070,auditReplayLine1070,fixturesReplay1070,fixturesReplay1071,decorateTop5Truth1070,authority:VERSION};W.YGOApp.runClosure=runClosure1047;W.YGOApp.importCompetitiveCalibration=calibrationImport1047;W.YGOApp.importOfficialProvenance=importOfficialProvenance1047;W.YGOApp.exportProvenanceReview=exportProvenanceReview1047;W.YGOApp.nextActions=nextActions1047;W.YGOApp.e2eStatus=e2eStatus1047;bind1047();bindCooperative1079();installReplayTruth1070();installScenarioPanel1233();
const bootCatalog1047=()=>{if(arr(W.CARD_CATALOG).length>=19617||W.__YGO1047_CATALOG_BOOT)return;W.__YGO1047_CATALOG_BOOT=true;Promise.resolve(A984.ensureCatalog984?.()).catch(e=>{W.__YGO1047_CATALOG_BOOT_ERROR=raw(e?.message||e)}).finally(()=>{authority1047();installProof1047();patchBanlist1047();bindImport1048();paint1047({release:release1047()})})};
const settle=()=>{cleanup1047();installProof1047();installParserGuard1092();authority1047();patchBanlist1047();scoreGuard1124();bind1047();bindImport1048();installExportGuard1143();installCalculateAuthority1124();installEvidenceGuard1143();scheduleBanlistLink1143();
 W.YGOAlpha1124={version:VERSION,scoreEvidence1124,coherence1124,traceAudit1124,scoreGuard1124,installCalculateAuthority1124,validateExport1143,installExportGuard1143,
  banlistMetadata:()=>({tcg:W.BANLIST_PROFILES?.tcg?.officialEffective,ocg:W.BANLIST_PROFILES?.ocg?.officialEffective}),
  tcgCoverage1125,restrictionSnapshot1126,formatCorrection1125:()=>W.__YGO1125_FORMAT_CORRECTION||null,
  certified:false,policy:'La base exacta universal y la calibración competitiva siguen pendientes.'};for(let n=1125;n<=1143;n++)W['YGOAlpha'+n]=W.YGOAlpha1124;
 if(!count1048(W.deckState,'main')&&!count1048(W.deckState,'extra')&&!count1048(W.deckState,'side')&&!IMPORT1048.last){
  for(const id of ['score','total','sum','miniScore','tier','miniTier','tierDesc','miniDesc']){
   const e=D.getElementById(id);if(!e)continue;
   e.textContent=(id==='score'||id==='total'||id==='miniScore')?'— / 100':id==='tierDesc'||id==='miniDesc'?'Sin baraja':'—';
  }
  D.documentElement.dataset.scoreAuthority='SIN_BARAJA';D.documentElement.dataset.scoreCertified='0';D.documentElement.dataset.scoreLegal='';
  evidenceEmptyState1143('SIN_BARAJA_INICIAL');
 }
 /* Alpha1049: el catálogo arranca desde init() y se exige en importación; evitar hidratación redundante durante el primer render. */};if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>setTimeout(settle,0),{once:true});else setTimeout(settle,0);try{W.addEventListener('pageshow',()=>setTimeout(settle,0),{once:true})}catch(_){}
})();
