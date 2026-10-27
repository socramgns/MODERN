/* Construction rules and versioned restriction snapshots. This is not a duel
 * simulator or a claim that a declared list is independently official. */
(()=>{'use strict';
const W=typeof window==='object'?window:globalThis;
const arr=x=>Array.isArray(x)?x:[],own=(x,k)=>Object.prototype.hasOwnProperty.call(x||{},k);
const clone=x=>typeof structuredClone==='function'?structuredClone(x):JSON.parse(JSON.stringify(x));
const freeze=x=>{if(x&&typeof x==='object'){Object.freeze(x);for(const y of Object.values(x))if(y&&typeof y==='object'&&!Object.isFrozen(y))freeze(y)}return x};
const normalize=x=>String(x??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const aliases={tcg:'tcg',tcgadvanced:'tcg',tcgtraditional:'tcgTraditional',ocg:'ocg',master:'master',masterduel:'master',duellinks:'duelLinksSpeed',duellinksspeed:'duelLinksSpeed',duellinksrush:'duelLinksRush',rush:'rush',rushduel:'rush',speedduel:'speedDuel',goat:'goat',goatformat:'goat',timewizard:'timeWizard'};
const keyOf=x=>aliases[normalize(x)]||null;
const policies=freeze({
 tcg:{mainMin:40,mainMax:60,extraMax:15,sideMax:15,skills:0,restrictionMode:'PER_IDENTITY',pool:'TCG'},
 tcgTraditional:{mainMin:40,mainMax:60,extraMax:15,sideMax:15,skills:0,restrictionMode:'PER_IDENTITY',pool:'TCG'},
 ocg:{mainMin:40,mainMax:60,extraMax:15,sideMax:15,skills:0,restrictionMode:'PER_IDENTITY',pool:'OCG'},
 master:{mainMin:40,mainMax:60,extraMax:15,sideMax:0,skills:0,restrictionMode:'PER_IDENTITY',pool:'DIGITAL_VERSIONED'},
 duelLinksSpeed:{mainMin:20,mainMax:30,extraMax:null,extraSafetyMax:15,sideMax:0,skills:1,restrictionMode:'SHARED_LIMIT_GROUPS',pool:'DIGITAL_VERSIONED',extraLimitRequiresContext:true,skillMayChangeConstruction:true},
 duelLinksRush:{mainMin:30,mainMax:40,extraMax:null,extraSafetyMax:15,sideMax:0,skills:1,restrictionMode:'SHARED_LIMIT_GROUPS',pool:'DIGITAL_VERSIONED',extraLimitRequiresContext:true,skillMayChangeConstruction:true,legend:true},
 rush:{mainMin:40,mainMax:60,extraMax:15,sideMax:15,skills:0,restrictionMode:'PER_IDENTITY',pool:'RUSH',legend:true},
 speedDuel:{mainMin:20,mainMax:30,extraMax:6,sideMax:6,skills:1,restrictionMode:'SHARED_LIMIT_GROUPS',pool:'SPEED_PRINT_AND_EVENT',sideSkills:true,eventContext:true},
 goat:{mainMin:40,mainMax:60,extraMax:null,extraUnlimited:true,sideMax:15,skills:0,restrictionMode:'PER_IDENTITY',pool:'HISTORICAL_VERSIONED',defaultHistoricalDate:'2005-04-01',fusionOnly:true},
 timeWizard:{mainMin:40,mainMax:60,extraMax:null,sideMax:15,skills:0,restrictionMode:'PER_IDENTITY',pool:'HISTORICAL_VERSIONED',historicalRulesRequireContext:true}
});
const references=freeze({
 standard:'https://www.yugioh-card.com/en/rulebook/',
 speed:'https://www.yugioh-card.com/en/play/speed-duel/',
 digital:'https://www.konami.com/yugioh/duel_links/en/',
 historical:'https://www.yugioh-card.com/en/play/organizedplay/time-wizard/',
 rush:'https://www.konami.com/yugioh/rushduel/howto/'
});
function date(value){
 const s=String(value||'').trim(),m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/),iso=m?`${m[3]}-${m[2]}-${m[1]}`:s;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return null;
 const n=Date.parse(iso+'T00:00:00Z');return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===iso?iso:null;
}
function group(rule){const explicit=rule?.sharedGroup??rule?.limitGroup;if(Number.isInteger(explicit)&&explicit>=1&&explicit<=3)return explicit;const m=String(rule?.status||rule?.limitGroup||'').match(/^(?:limited|limit)\s*([123])$/i);return m?Number(m[1]):null;}
function ruleMaximum(rule){if(/^(forbidden|prohibida)$/i.test(String(rule?.status)))return 0;if(group(rule))return group(rule);if(rule?.max!==null&&rule?.max!==''&&Number.isInteger(Number(rule?.max))&&Number(rule.max)>=0&&Number(rule.max)<=3)return Number(rule.max);return({limited:1,'semi-limited':2,legal:3})[String(rule?.status||'').toLowerCase()]??null;}
function normalizeSnapshot(input,format){
 const source=Array.isArray(input)?{data:input}:input||{},rows=arr(source.data??source.rows??source.regulation),issues=[],out=[];
 if(!Array.isArray(source.data??source.rows??source.regulation))issues.push('RESTRICTION_ROWS_REQUIRED');
 const effective=date(source.effectiveDate||source.officialEffective||source.date),version=String(source.version||source.revision||effective||'').trim();
 if(!effective&&!source.noGeneralList)issues.push('RESTRICTION_DATE_REQUIRED');
 if(!version&&!source.noGeneralList)issues.push('RESTRICTION_VERSION_REQUIRED');
 if(!/^https:\/\//i.test(String(source.source||source.authoritySource||source.url||'')))issues.push('RESTRICTION_SOURCE_REQUIRED');
 const seen=new Map();
 for(const row of rows){
  const id=Number(row?.id),name=String(row?.name||'').trim(),max=ruleMaximum(row),identity=Number.isSafeInteger(id)&&id>0?'id:'+id:name?'name:'+normalize(name):null;
  if(!identity||max===null){issues.push('INVALID_RESTRICTION_ROW');continue}
  const statusMaximum=group(row)??({forbidden:0,limited:1,'semi-limited':2,legal:3})[String(row.status||'').toLowerCase()];
  if(statusMaximum!==undefined&&row.max!==undefined&&Number(row.max)!==statusMaximum){issues.push('RESTRICTION_STATUS_MAXIMUM_MISMATCH');continue}
  const normalized={id:Number.isSafeInteger(id)&&id>0?id:null,name,max,status:String(row.status||''),sharedGroup:group(row)};
  if(seen.has(identity)){const previous=seen.get(identity);if(previous.max!==max||previous.sharedGroup!==normalized.sharedGroup)issues.push('CONFLICTING_RESTRICTION_ROWS');continue}
  seen.set(identity,normalized);out.push(normalized);
 }
 if(!rows.length&&source.complete!==true&&!source.noGeneralList)issues.push('EMPTY_LIST_NOT_DECLARED_COMPLETE');
 if(source.format&&keyOf(source.format)!==format)issues.push('RESTRICTION_FORMAT_MISMATCH');
 return{format,version:version||(source.noGeneralList?'NO_GENERAL_LIST':null),effectiveDate:effective,source:String(source.source||source.authoritySource||source.url||''),data:out,noGeneralList:source.noGeneralList===true,complete:source.complete!==false&&issues.length===0,issues};
}
function snapshotIdentity(snapshot,format){
 const key=keyOf(format||snapshot?.format),normalized=normalizeSnapshot(snapshot,key);
 const rows=normalized.data.map(r=>[r.id,normalize(r.name),r.max,r.sharedGroup]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
 // A canonical serialization avoids treating a short, mutable hash as proof.
 return JSON.stringify({format:key,version:normalized.version,date:normalized.effectiveDate,source:normalized.source,rows});
}
const snapshots=new Map(),refreshes=new Map();
function seedSnapshots(){for(const [key,profile] of Object.entries(W.BANLIST_PROFILES||{})){const format=keyOf(key);if(!format||snapshots.has(format)||!Array.isArray(profile?.data))continue;const value=normalizeSnapshot({...profile,format},format);if(value.complete)snapshots.set(format,{...value,identity:snapshotIdentity(value,format)})}}
function recordSnapshot(format,input){const key=keyOf(format);if(!key)return{pass:false,status:'UNKNOWN_FORMAT'};const candidate=normalizeSnapshot(input,key);if(!candidate.complete)return{pass:false,status:'INVALID_SNAPSHOT',issues:candidate.issues,previousPreserved:true};const value={...candidate,identity:snapshotIdentity(candidate,key)};snapshots.set(key,value);return{pass:true,status:'SNAPSHOT_STORED',snapshot:clone(value),officialSourceCertified:false};}
function selectedSnapshot(key,context){
 if(own(context,'snapshot'))return normalizeSnapshot(context.snapshot,key);
 seedSnapshots();const retained=snapshots.get(key);if(retained)return clone(retained);
 const profile=W.BANLIST_PROFILES?.[key];return normalizeSnapshot(profile?{...profile,format:key}:null,key);
}
function identity(card){
 const data=W.YGODataCatalog?.canonicalIdentity?.(card);if(data?.canonicalId!=null)return String(data.canonicalId);
 let id=Number(card?.id??card?.cardId),alias=Number(card?.alias);if(Number.isSafeInteger(alias)&&alias>0)id=alias;
 return Number.isSafeInteger(id)&&id>0?String(id):null;
}
function availability(card,context={}){
 const format=keyOf(context.format||'tcg'),policy=policies[format];if(!policy)return{eligible:null,status:'UNKNOWN_FORMAT'};
 const id=Number(card?.id??card?.cardId),when=date(context.historicalDate||context.date||policy.defaultHistoricalDate);
 const pool=context.poolSnapshot;
 if(pool){
  const poolFormat=keyOf(pool.format),dated=date(pool.effectiveDate||pool.date),valid=poolFormat===format&&!!String(pool.version||'').trim()&&!!dated&&/^https:\/\//i.test(String(pool.source||''))&&pool.complete===true&&Array.isArray(pool.ids);
  if(valid){if(when&&dated>when)return{eligible:null,status:'POOL_SNAPSHOT_AFTER_SELECTED_DATE'};return{eligible:pool.ids.some(x=>Number(x)===id),status:pool.ids.some(x=>Number(x)===id)?'PROVIDED_POOL_MATCH':'OUTSIDE_PROVIDED_POOL',snapshotDate:dated,source:pool.source,officiallyCertified:false}}
  return{eligible:null,status:'POOL_SNAPSHOT_INCOMPLETE'};
 }
 if(policy.pool==='DIGITAL_VERSIONED')return{eligible:null,status:'DIGITAL_POOL_SNAPSHOT_REQUIRED'};
 if(policy.pool==='HISTORICAL_VERSIONED'){
  const released=date(card?.releaseDates?.tcg||card?.tcgReleaseDate);
  if(when&&released&&released>when)return{eligible:false,status:'CARD_RELEASED_AFTER_HISTORICAL_DATE',released,selectedDate:when};
  return{eligible:null,status:'HISTORICAL_POOL_SNAPSHOT_REQUIRED',selectedDate:when};
 }
 if(policy.pool==='SPEED_PRINT_AND_EVENT'){
  if(card?.speedDuelPrintVerified===false)return{eligible:false,status:'SPEED_DUEL_PRINT_INELIGIBLE'};
  return card?.speedDuelPrintVerified===true?{eligible:true,status:'DECLARED_SPEED_PRINT_VERIFICATION',officiallyCertified:false}:{eligible:null,status:'SPEED_DUEL_PRINT_VERIFICATION_REQUIRED'};
 }
 if(typeof W.YGODataCatalog?.poolEvidence==='function')return W.YGODataCatalog.poolEvidence(card,format,when);
 const ot=Number(card?.ot),source=String(card?.source||'');
 if(/unofficial|skills|deckmaster/i.test(source)||(ot&(4|8|16|32)))return{eligible:false,status:'UNOFFICIAL_OR_NONSTANDARD_POOL'};
 if(!Number.isSafeInteger(ot))return{eligible:null,status:'TECHNICAL_POOL_METADATA_REQUIRED'};
 const rush=/rush/i.test(source)||!!(ot&512);
 if(format==='rush')return{eligible:rush,status:rush?'TECHNICAL_POOL_MATCH':'NOT_A_RUSH_CARD',officiallyCertified:false};
 if(rush)return{eligible:false,status:'RUSH_CARD_IN_STANDARD_FORMAT'};
 if(ot&256)return{eligible:null,status:'PRERELEASE_AVAILABILITY_NOT_CONFIRMED'};
 const bit=format==='ocg'?1:2;return{eligible:!!(ot&bit),status:(ot&bit)?'TECHNICAL_POOL_MATCH':'NO_REGIONAL_SCOPE_FLAG',officiallyCertified:false};
}
function validateDeck(deck,context={}){
 const format=keyOf(context.format||W.__YGO_ACTIVE_BAN_KEY||'tcg'),policy=policies[format];
 if(!policy)return{schema:'ygo-format-validation/v1',format,pass:false,constructionValid:false,errors:[{reason:'UNKNOWN_FORMAT'}],pending:[],certified:false};
 const errors=[],pending=[],warnings=[],counts={main:0,extra:0,side:0,skills:0},families=new Map(),entries=[];
 const addPending=(reason,detail={})=>{if(!pending.some(x=>x.reason===reason))pending.push({reason,...detail})};
 const historicalDate=date(context.historicalDate||context.date||policy.defaultHistoricalDate);
 if(policy.historicalRulesRequireContext&&!historicalDate)addPending('HISTORICAL_DATE_REQUIRED');
 if(policy.historicalRulesRequireContext&&!Number.isSafeInteger(context.extraDeckLimit))addPending('HISTORICAL_EXTRA_RULE_REQUIRED');
 let extraMax=policy.extraMax;
 if(Number.isSafeInteger(context.extraDeckLimit)&&context.extraDeckLimit>=0&&context.extraDeckLimit<=10000)extraMax=context.extraDeckLimit;
 else if(policy.extraLimitRequiresContext){extraMax=policy.extraSafetyMax;}
 let sideMax=policy.sideMax;
 if(context.event&&Number.isSafeInteger(context.event.sideMax)&&context.event.sideMax>=0&&context.event.sideMax<=15)sideMax=context.event.sideMax;
 let activeSkills=0,sideSkills=0;
 for(const zone of ['main','extra','side','skills']){
  const cards=deck?.[zone];if(zone==='skills'&&cards===undefined)continue;
  if(!Array.isArray(cards)){errors.push({zone,reason:'ZONE_NOT_ARRAY'});continue}
  for(const card of cards){
   const q=Number(card?.qty??1),id=identity(card),bits=Number(card?.typeBits),skill=!!(bits&0x8000000)||/skill/i.test(String(card?.type||''));
   if(!Number.isSafeInteger(q)||q<1||q>60){errors.push({zone,reason:'INVALID_QUANTITY',id:card?.id});continue}
   counts[zone]+=q;
   if(skill){
    if(zone==='skills'){activeSkills+=q;if(!policy.skills)errors.push({zone,reason:'SKILLS_NOT_ALLOWED'})}
    else if(zone==='side'&&policy.sideSkills)sideSkills+=q;
    else errors.push({zone,reason:'SKILL_IN_CARD_DECK'});
    continue;
   }
   if(zone==='skills'){errors.push({zone,reason:'NON_SKILL_IN_SKILL_ZONE'});continue}
   if(id===null||typeof W.YGODataCatalog?.lookup==='function'&&!W.YGODataCatalog.lookup(Number(card?.id??card?.cardId))){errors.push({zone,reason:'UNKNOWN_IDENTITY',id:card?.id});continue}
   families.set(id,(families.get(id)||0)+q);entries.push({card,q,zone,id});
   if(bits&0x4000)errors.push({id,zone,reason:'TOKEN_NOT_IN_DECK'});
   const knownType=Number.isSafeInteger(bits)&&bits>0,extraOnly=!!(bits&(0x40|0x2000|0x800000|0x4000000));
   if(!knownType)addPending('CARD_TYPE_METADATA_REQUIRED',{id});
   if(knownType&&(zone==='main'&&extraOnly||zone==='extra'&&!extraOnly))errors.push({id,zone,reason:'WRONG_DECK_ZONE'});
   if(knownType&&policy.fusionOnly&&zone==='extra'&&!(bits&0x40))errors.push({id,zone,reason:'HISTORICAL_FUSION_DECK_ONLY'});
   const pool=availability(card,{...context,format,historicalDate});
   if(pool.eligible===false)errors.push({id,zone,reason:pool.status});
   else if(pool.eligible!==true)addPending(pool.status,{id});
  }
 }
 if(policy.extraLimitRequiresContext&&counts.extra>0&&!Number.isSafeInteger(context.extraDeckLimit))addPending('EXTRA_UNLOCK_OR_SKILL_LIMIT_REQUIRED');
 if(activeSkills>policy.skills)errors.push({reason:'TOO_MANY_ACTIVE_SKILLS',maximum:policy.skills,actual:activeSkills});
 if(counts.main<policy.mainMin||counts.main>policy.mainMax)errors.push({reason:'MAIN_SIZE',minimum:policy.mainMin,maximum:policy.mainMax,actual:counts.main});
 if(extraMax!==null&&counts.extra>extraMax)errors.push({reason:'EXTRA_SIZE',maximum:extraMax,actual:counts.extra});
 if(counts.side>sideMax)errors.push({reason:'SIDE_SIZE',maximum:sideMax,actual:counts.side});
 for(const [id,q] of families)if(q>3)errors.push({reason:'ALIAS_FAMILY_OVER_THREE',id,actual:q});
 if(policy.skillMayChangeConstruction&&(activeSkills>0||context.skill!=null)&&context.skillConstructionVerified!==true)addPending('SKILL_CONSTRUCTION_EFFECTS_REQUIRE_CONTEXT');
 if(policy.eventContext&&!context.event?.id)addPending('EVENT_CONTEXT_REQUIRED');
 if(policy.legend){
  const legends={monster:0,spell:0,trap:0};let unknown=0;
  for(const {card,q,zone} of entries){if(zone==='side')continue;const value=typeof card.legend==='boolean'?card.legend:typeof card.isLegend==='boolean'?card.isLegend:null;if(value===null||card.legendMetadataVerified!==true){unknown++;continue}if(!value)continue;const bits=Number(card.typeBits),type=bits&1?'monster':bits&2?'spell':bits&4?'trap':null;if(type)legends[type]+=q;else errors.push({reason:'LEGEND_TYPE_UNKNOWN',id:card.id});}
  if(unknown)addPending('LEGEND_METADATA_REQUIRED',{unknownCards:unknown});
  for(const [category,n] of Object.entries(legends))if(n>1)errors.push({reason:'LEGEND_CATEGORY_LIMIT',category,maximum:1,actual:n});
  if(historicalDate&&historicalDate<'2023-01-01')addPending('HISTORICAL_LEGEND_RULES_REQUIRED');
 }
 const snapshot=selectedSnapshot(format,context),snapshotId=snapshotIdentity(snapshot,format);
 if(!snapshot.complete)for(const reason of snapshot.issues)addPending(reason);
 const requestedVersion=context.banlistVersion||context.snapshotVersion;
 if(requestedVersion&&String(requestedVersion)!==snapshot.version)addPending('SNAPSHOT_VERSION_MISMATCH');
 if(historicalDate&&snapshot.effectiveDate&&snapshot.effectiveDate>historicalDate)addPending('SNAPSHOT_AFTER_SELECTED_DATE');
 const asOf=date(context.asOfDate)||new Date().toISOString().slice(0,10);
 if(!historicalDate&&snapshot.effectiveDate&&snapshot.effectiveDate>asOf)addPending('SNAPSHOT_NOT_YET_EFFECTIVE',{effectiveDate:snapshot.effectiveDate,asOfDate:asOf});
 const shared=new Map([[1,{copies:0,ids:new Set()}],[2,{copies:0,ids:new Set()}],[3,{copies:0,ids:new Set()}]]);
 const matched=new Set();
 if(snapshot.complete)for(const restriction of snapshot.data){
  const ids=new Set();if(restriction.id){const id=identity({id:restriction.id,alias:W.YGODataCatalog?.lookup?.(restriction.id)?.alias});if(id)ids.add(id)}
  if(restriction.name){for(const entry of entries){const names=[entry.card.name,entry.card.canonicalName,...arr(entry.card.legacyNames)];if(names.some(n=>normalize(n)===normalize(restriction.name)))ids.add(entry.id)}
   const resolved=W.YGODataCatalog?.resolveName?.(restriction.name,{format});for(const id of resolved?.canonicalIds||[])if(id!=null)ids.add(String(id));}
  const copies=[...ids].reduce((n,id)=>n+(families.get(id)||0),0);
  if(policy.restrictionMode==='SHARED_LIMIT_GROUPS'&&restriction.sharedGroup){const target=shared.get(restriction.sharedGroup);for(const id of ids){if(!target.ids.has(id)){target.ids.add(id);target.copies+=families.get(id)||0}}}
  else if(copies>restriction.max)errors.push({reason:'BANLIST_MAXIMUM',name:restriction.name,id:restriction.id,maximum:restriction.max,actual:copies});
  if(copies)for(const id of ids)matched.add(id);
 }
 for(const [limit,entry] of shared)if(entry.copies>limit)errors.push({reason:'SHARED_LIMIT_BUDGET_EXCEEDED',group:limit,maximum:limit,actual:entry.copies});
 if(snapshot.noGeneralList&&policy.eventContext&&context.event?.requiresBanlist!==false)addPending('EVENT_RESTRICTION_SNAPSHOT_REQUIRED');
 warnings.push({reason:'PROVIDED_SNAPSHOT_AND_TECHNICAL_POOL_ARE_NOT_OFFICIAL_CERTIFICATION'});
 return{schema:'ygo-format-validation/v1',format,policy,counts,activeSkills,sideSkills,extraLimit:extraMax,sideLimit:sideMax,errors,pending,warnings,
  pass:errors.length===0&&pending.length===0,constructionValid:errors.length===0,complete:pending.length===0,legality:errors.length?false:null,
  snapshot:{version:snapshot.version,effectiveDate:snapshot.effectiveDate,source:snapshot.source,identity:snapshotId,complete:snapshot.complete},
  sharedBudgets:Object.fromEntries([...shared].map(([n,v])=>[n,{maximum:n,copies:v.copies}])),historicalDate,scope:'MODELED_CONSTRUCTION_AND_PROVIDED_RESTRICTIONS',certified:false,officialLegalityCertified:false};
}
async function refreshSnapshot(format,loader){
 const key=keyOf(format);if(!key)return{pass:false,status:'UNKNOWN_FORMAT'};
 if(refreshes.has(key))return refreshes.get(key);
 seedSnapshots();const previous=snapshots.get(key),profile=W.BANLIST_PROFILES?.[key],previousProfile=profile?clone(profile):null;
 const job=(async()=>{try{
  const staged=clone(profile||{format:key});delete staged.data;
  const load=loader||W.__YGO_FORMAT_BASE_FETCH;if(typeof load!=='function')throw Error('SNAPSHOT_LOADER_UNAVAILABLE');
  const loaded=await load(staged),candidate=Array.isArray(loaded)?{...staged,data:loaded,format:key}:{...staged,...loaded,format:key};
  const stored=recordSnapshot(key,candidate);if(!stored.pass)throw Error(stored.issues?.join(', ')||stored.status);
  if(profile){profile.data=clone(candidate.data);for(const field of ['date','officialEffective','source','version','revision'])if(candidate[field]!==undefined)profile[field]=candidate[field];}
  return{pass:true,status:'SNAPSHOT_REFRESHED',snapshot:stored.snapshot,previousPreserved:false};
 }catch(error){
  if(profile){const fallback=previous||previousProfile;if(fallback){profile.data=clone(fallback.data||[]);if(previousProfile)for(const field of ['date','officialEffective','source','version','revision']){if(own(previousProfile,field))profile[field]=previousProfile[field];else delete profile[field]}}}
  return{pass:false,status:previous?'REFRESH_FAILED_USING_PREVIOUS_SNAPSHOT':'REFRESH_FAILED_NO_USABLE_SNAPSHOT',error:String(error?.message||error),previousPreserved:!!previous,snapshot:previous?clone(previous):null};
 }finally{refreshes.delete(key)}})();refreshes.set(key,job);return job;
}
function installSnapshotGuard(){
 seedSnapshots();const base=W.fetchBanData;if(typeof base!=='function'||base.__ygoFormatsGuard)return false;
 W.__YGO_FORMAT_BASE_FETCH=base;
 const guard=async function(profile){const pair=Object.entries(W.BANLIST_PROFILES||{}).find(([,value])=>value===profile),key=keyOf(pair?.[0]);if(!key)return base.call(this,profile);
  const cached=normalizeSnapshot({...profile,format:key},key);if(cached.complete){recordSnapshot(key,cached);return profile.data;}
  const result=await refreshSnapshot(key,stage=>base.call(this,stage));if(!result.pass){const error=Error(result.error);error.previousSnapshotPreserved=result.previousPreserved;throw error}return profile.data;};
 guard.__ygoFormatsGuard=true;W.fetchBanData=guard;return true;
}
W.YGOFormats=Object.freeze({version:'construction-formats-v1',policies,references,keyOf,normalizeDate:date,validateDeck,snapshotIdentity,recordSnapshot,refreshSnapshot,availability,installSnapshotGuard,getSnapshot:format=>{seedSnapshots();const value=snapshots.get(keyOf(format));return value?clone(value):null}});
Promise.resolve(W.__YGO_ENGINE_READY).then(()=>{installSnapshotGuard();if(typeof W.dispatchEvent==='function'&&typeof W.CustomEvent==='function')W.dispatchEvent(new W.CustomEvent('ygo-formats-ready'))}).catch(()=>{});
})();
