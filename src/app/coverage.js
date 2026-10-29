/* An inventory of explicitly registered card actions, not a rules-completeness
 * score. Technical card data, summons, effects and responses stay separate. */
(()=>{'use strict';
const W=window,D=typeof document==='object'?document:null,VERSION='registered-card-actions-v1';
const ZONES=['main','extra','side','skills'],arr=x=>Array.isArray(x)?x:[],clone=x=>structuredClone(x);
const action=(kind,id,label,registration='HANDLER')=>({kind,id,label,registration});
const effect=(id,label)=>action('EFFECT',id,label),summon=(id,label)=>action('SUMMON',id,label),response=(id,label)=>action('RESPONSE',id,label,'RESPONSE_PROVIDER');
// Each entry names an actual source action. Being material, a search target,
// a reviewed departure cost or a CDB match does not add an effect to this map.
const definitions=[
 {id:86120751,actions:[summon('NORMAL_SUMMON','Invocación Normal registrada'),effect('ALEISTER_SEARCH','Buscar Invocation')]},
 {id:34755994,actions:[summon('LINK_ARTEMIS','Invocación Link de Artemis')]},
 {id:74063034,actions:[effect('INVOCATION_MECHABA','Fusión de Mechaba con materiales admitidos'),effect('INVOCATION_RECYCLE','Recuperación de Invocation y Aleister')]},
 {id:75286621,actions:[response('MECHABA','Negación de Mechaba en ventanas admitidas')]},
 {id:14558127,actions:[action('RESPONSE','ASH_EXPLICIT','Respuesta física de Ash Blossom','NATIVE_POLICY')]},
 {id:20001443,actions:[summon('NORMAL_SUMMON','Invocación Normal registrada'),effect('MOYE_TOKEN','Revelar y crear Token'),effect('MOYE_DRAW','Robo de Mo Ye')]},
 {id:69248256,actions:[summon('SYNCHRO_CHIXIAO','Invocación Synchro de Chixiao'),effect('CHIXIAO_SEARCH','Búsqueda de Chixiao'),effect('CHIXIAO_CL1_MOYE_CL2','Paquete conjunto Chixiao/Mo Ye'),effect('CHIXIAO_NEGATE','Negación con coste físico'),response('CHIXIAO','Respuesta física de Chixiao')]},
 {id:93490856,actions:[effect('LONGYUAN_SPECIAL','Descartar e invocar Longyuan'),effect('LONGYUAN_BURN','Daño de Longyuan')]},
 {id:96633955,actions:[summon('SYNCHRO_CHENGYING','Invocación Synchro de Chengying')],notes:['Sus estadísticas continuas se modelan; este inventario no acredita todos sus efectos ni su reemplazo de destrucción.']},
 {id:68468459,actions:[summon('BRANDED_NORMAL_SUMMON_ALBAZ','Invocación Normal de Albaz')],notes:['La Fusión al invocarse de Albaz se declina en esta ruta; no está implementada por su invocación Normal.']},
 {id:44362883,actions:[effect('BRANDED_FUSION_LUBELLION','Branded Fusion hacia Lubellion')]},
 {id:70534340,actions:[effect('LUBELLION_FUSION_MIRRORJADE','Fusión de Mirrorjade con descarte')]},
 {id:44146295,actions:[effect('MIRRORJADE_BANISH','Destierro registrado de Mirrorjade'),effect('DUEL_RESOLVE_MIRRORJADE_END_DESTRUCTION','Destrucción diferida registrada')]},
 {id:8240199,actions:[summon('BLUE_EYES_NORMAL_SUMMON_SAGE','Invocación Normal de Sage'),effect('SAGE_SEARCH_LIGHT_TUNER','Buscar un Cantante LIGHT nivel 1')]},
 {id:42097666,actions:[summon('LINK_SPIRIT_WITH_EYES_OF_BLUE','Invocación Link de Spirit with Eyes of Blue'),effect('SPIRIT_SEARCH_MAUSOLEUM','Buscar Mausoleum'),effect('SPIRIT_TRIBUTE_BLUE_EYES','Tributo para invocar Blue-Eyes')]},
 {id:24382602,actions:[effect('ACTIVATE_MAUSOLEUM_OF_WHITE','Activación de Mausoleum'),effect('MAUSOLEUM_ADDITIONAL_NORMAL_SUMMON','Normal adicional admitida'),effect('MAUSOLEUM_SEND_NORMAL_MONSTER','Envío de Normal y ganancia temporal')]},
 {id:71039903,actions:[effect('DUEL_ANCIENTS_END_SUMMON','Invocación registrada en End Phase'),effect('ANCIENTS_RECOVER_BLUE_EYES','Recuperación admitida de Blue-Eyes')]},
 {id:59822133,actions:[summon('SYNCHRO_BLUE_EYES_SPIRIT_DRAGON','Invocación Synchro de Spirit Dragon'),effect('SPIRIT_DRAGON_TRIBUTE_SYNCHRO','Tributo para Azure-Eyes o Spark'),response('SPIRIT','Negar activación GY registrada')]},
 {id:40908371,actions:[effect('AZURE_EYES_PROTECTION','Protección registrada de Azure-Eyes'),effect('AZURE_EYES_STANDBY_REVIVE','Revivir un Normal en Standby')]},
 {id:83994433,actions:[effect('STARDUST_SPARK_PROTECTION','Protección de una destrucción de Spark')],notes:['No se acumulan protecciones Spark aún sin consumir ni se infiere la prioridad general del Damage Step.']},
 {id:97268402,actions:[response('VEILER','Respuesta física de Effect Veiler')]},
 {id:10045474,actions:[effect('ACTIVATE_INFINITE_IMPERMANENCE','Activar Infinite Impermanence'),response('IMPERM','Respuesta física de Infinite Impermanence')]},
 {id:94192409,actions:[effect('ACTIVATE_COMPULSORY_EVACUATION_DEVICE','Activación registrada de Compulsory Evacuation Device desde colocada')]},
 {id:24508238,actions:[effect('DD_CROW_BANISH','Destierro registrado de D.D. Crow')]},
 {id:94145021,actions:[effect('DROLL_LOCK','Ventana y bloqueo registrados de Droll')]},
 {id:87052196,actions:[effect('TENYI_HAND_SPECIAL','Invocación desde mano de Ashuna'),effect('TENYI_ASHUNA_DECK','Invocación registrada desde Deck')]},
 {id:98159737,actions:[summon('TENYI_NORMAL_SUMMON','Invocación Normal de Adhara'),effect('TENYI_HAND_SPECIAL','Invocación desde mano de Adhara'),effect('TENYI_ADHARA_RECOVER','Recuperar Wyrm desterrado')]},
 {id:23431858,actions:[effect('TENYI_HAND_SPECIAL','Invocación desde mano de Vishuda'),effect('TENYI_VISHUDA_BOUNCE','Devolución de objetivo admitido')]},
 {id:24557335,actions:[summon('TENYI_NORMAL_SUMMON','Invocación Normal de Shthana'),effect('TENYI_HAND_SPECIAL','Invocación desde mano de Shthana'),effect('TENYI_SHTHANA_REVIVE','Revivir un no-Efecto destruido y destruir opcionalmente un monstruo')],notes:['El disparo exige una destrucción registrada y un objetivo físico que siga en el Cementerio.']},
 {id:32519092,actions:[summon('TENYI_LINK_MONK','Invocación Link de Monk')]},
 {id:78917791,actions:[summon('TENYI_LINK_SHAMAN','Invocación Link de Shaman'),effect('TENYI_SHAMAN_REVIVE','Resurrección registrada con descarte')]},
 {id:5402805,actions:[summon('TENYI_LINK_BERSERKER','Invocación Link de Berserker')]},
 {id:65124425,actions:[effect('TENYI_VESSEL','Envío y búsqueda admitidos de Vessel')]},
 {id:26889158,actions:[summon('SALAMANGREAT_NORMAL_SUMMON','Invocación Normal de Gazelle'),effect('SALAMANGREAT_GAZELLE_SEND','Envío registrado de Gazelle'),effect('SALAMANGREAT_GAZELLE_HAND','Invocación Especial desde mano por un envío real al Cementerio')],notes:['Su disparo desde mano no está disponible durante el Damage Step.']},
 {id:52277807,actions:[summon('SALAMANGREAT_NORMAL_SUMMON','Invocación Normal de Spinny'),effect('SALAMANGREAT_SPINNY_DISCARD','Descarte y ganancia de ATK'),effect('SALAMANGREAT_SPINNY_REVIVE','Resurrección de Spinny')]},
 {id:14812471,actions:[summon('SALAMANGREAT_LINK_BALELYNX','Invocación Link de Balelynx'),effect('SALAMANGREAT_BALELYNX_SEARCH','Buscar Sanctuary'),action('EFFECT','SALAMANGREAT_BALELYNX','Reemplazar destrucción desterrando Balelynx del Cementerio','DESTRUCTION_REPLACEMENT')],notes:['La protección desde GY reemplaza una destrucción registrada; se muestra entre las variantes de esa destrucción y no inicia una cadena.']},
 {id:1295111,actions:[effect('SALAMANGREAT_ACTIVATE_SANCTUARY','Activación registrada de Sanctuary')],notes:['La reincarnación de Wolf requiere el escenario y las condiciones registrados.']},
 {id:87871125,actions:[summon('SALAMANGREAT_LINK_WOLF','Invocación Link de Sunlight Wolf'),summon('SALAMANGREAT_REINCARNATE_WOLF','Reincarnación de Sunlight Wolf'),effect('SALAMANGREAT_WOLF_RECOVER_ST','Recuperar Mágica/Trampa admitida'),effect('SALAMANGREAT_WOLF_RECOVER_FIRE','Recuperar FIRE admitido')]},
 {id:51339637,actions:[effect('SALAMANGREAT_ROAR_SET_FROM_GY','Colocar Roar desde GY'),response('ROAR','Counter Trap: negar y destruir una activación admitida')],notes:['Comparte el límite de uso con su efecto GY y exige una colocación de un turno anterior.']}
];
const byId=new Map(definitions.map(row=>[row.id,row]));
const labels={main:'Main',extra:'Extra',side:'Side',skills:'Skills'};
const statusLabels={PARTIAL_REGISTERED_ACTIONS:'Acciones específicas parciales',REGISTERED_SUMMON_ONLY:'Solo invocación registrada',BASIC_NORMAL_ACTIONS_ONLY:'Solo acciones básicas de Normal',NO_REGISTERED_CARD_ACTIONS:'Sin acciones específicas registradas',SKILL_OUTSIDE_CAUSAL_ENGINE:'Skill fuera del motor causal'};
const dataLabels={TECHNICAL_SOURCE_MATCHED:'Datos técnicos cotejados',LEGACY_SOURCE_UNRESOLVED:'Fuente técnica sin resolver',UNKNOWN_PASSCODE:'Passcode desconocido',INVALID_PASSCODE:'Passcode inválido'};
const positive=(value,max)=>{if(typeof value!=='number'&&!(typeof value==='string'&&/^\d{1,16}$/.test(value)))return null;const n=Number(value);return Number.isSafeInteger(n)&&n>0&&n<=max?n:null;};
const plainObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const snapshot=x=>{try{return clone(x)}catch(_){return null}};
const format=()=>String(W.YGOAlpha973?.activeFormatKey?.()||W.YGOUIState?.getFormatContext?.()?.format||W.__YGO_ACTIVE_BAN_KEY||'tcg').trim().toLowerCase();
function capabilities(){const value=W.YGOComboEngine?.capabilities?.()||{};return{handlers:new Set(arr(value.handlers)),responses:new Set(arr(value.responseProviders)),replacements:new Set(arr(value.duelPhases?.destructionReplacementProviders)),policies:new Set(arr(value.opponentPolicies)),available:typeof W.YGOComboEngine?.capabilities==='function'};}
function registered(action,caps){return action.registration==='HANDLER'?caps.handlers.has(action.id):action.registration==='RESPONSE_PROVIDER'?caps.responses.has(action.id):action.registration==='DESTRUCTION_REPLACEMENT'?caps.replacements.has(action.id):action.registration==='NATIVE_POLICY'&&caps.policies.has(action.id);}
function genericNormal(card,caps,zone,pool){const bits=Number(card?.typeBits),level=Number(card?.level),excluded=0x40|0x2000|0x800000|0x4000000|0x4000|0x8000000|0x1000000;
 if(!['main','side'].includes(zone)||card?.technicalSourceMatched!==true||card?.statsKnown!==true||pool?.eligible!==true||(bits&17)!==17||(bits&excluded)||!Number.isInteger(level)||level<1||level>12||!Number.isFinite(card.atk)||card.atk<0||!Number.isFinite(card.def)||card.def<0)return[];const out=[];
 if(level<=4&&caps.handlers.has('NORMAL_SUMMON'))out.push(action('BASIC_NORMAL','NORMAL_SUMMON','Invocación Normal básica en Main Phase 1'));
 if(caps.handlers.has('DUEL_NORMAL_SUMMON_OR_SET'))out.push(action('BASIC_NORMAL','DUEL_NORMAL_SUMMON_OR_SET','Invocación/Colocación con tributos y escenario admitido'));
 return out;
}
function report(deck=W.deckState||{},options={}){
 const issues=[],entries=[],caps=capabilities(),validDeck=plainObject(deck),opts=plainObject(options)?options:{};
 if(!validDeck)issues.push({code:'DECK_OBJECT_REQUIRED'});
 const activeFormat=String(opts.format??format()).trim().toLowerCase(),currentContext=opts.formatContext??W.YGOUIState?.getFormatContext?.()??{format:activeFormat},context=snapshot(currentContext);
 if(context===null&&currentContext!==null)issues.push({code:'FORMAT_CONTEXT_NOT_CLONEABLE'});
 const counts={entries:0,validEntries:0,totalCopies:0,uniqueIds:0,aliasFamilies:0,technicalMatchedCopies:0,unresolvedTechnicalCopies:0,specificActionCopies:0,summonOnlyCopies:0,basicOnlyCopies:0,noRegisteredActionCopies:0,skillsCopies:0,invalidEntries:0},zones=Object.fromEntries(ZONES.map(z=>[z,{entries:0,copies:0,specificActionCopies:0}]));
 const ids=new Set(),families=new Set(),duplicates=new Set();let partial=false,expectedEntries=0;
 for(const zone of ZONES){const rows=validDeck?deck[zone]:undefined;if(rows!==undefined&&!Array.isArray(rows)){issues.push({code:'ZONE_NOT_ARRAY',zone});continue;}expectedEntries+=arr(rows).length;
  for(const [index,input]of arr(rows).entries()){
   if(entries.length>=1000){partial=true;continue;}
   const rowIssues=[],source=plainObject(input)?input:{},id=positive(source.id??source.cardId,Number.MAX_SAFE_INTEGER),quantity=positive(source.qty??(source.qty===undefined?1:source.qty),1000);
   if(!plainObject(input))rowIssues.push('ENTRY_NOT_OBJECT');if(id===null)rowIssues.push('INVALID_PASSCODE');if(quantity===null)rowIssues.push('INVALID_QUANTITY');
   let card=null,identity=null;try{if(id!==null){card=W.YGODataCatalog?.rulesCard?.(id)||W.YGODataCatalog?.lookup?.(id)||null;identity=W.YGODataCatalog?.canonicalIdentity?.(id)||null;}}catch(_){rowIssues.push('CATALOGUE_LOOKUP_FAILED');}
   const canonicalId=card?(positive(identity?.canonicalId,Number.MAX_SAFE_INTEGER)||positive(card.alias,Number.MAX_SAFE_INTEGER)||id):null;
   const matched=card?.technicalSourceMatched===true,technicalStatus=id===null?'INVALID_PASSCODE':!card?'UNKNOWN_PASSCODE':matched?'TECHNICAL_SOURCE_MATCHED':'LEGACY_SOURCE_UNRESOLVED';
   if(id!==null&&!card)rowIssues.push('UNKNOWN_PASSCODE');
   const definition=canonicalId!==null?byId.get(canonicalId):null,isSkill=zone==='skills'||!!(Number(card?.typeBits)&0x8000000)||/skills/i.test(String(card?.source||''));
   let pool=null;try{if(card)pool=W.YGODataCatalog?.poolEvidence?.(card,'tcg')||null;}catch(_){rowIssues.push('TECHNICAL_POOL_LOOKUP_FAILED');}
   if(isSkill&&zone!=='skills')rowIssues.push('SKILL_OUTSIDE_SKILLS_ZONE');
   const specific=isSkill?[]:arr(definition?.actions).filter(a=>registered(a,caps)).map(a=>({...a})),basic=isSkill?[]:genericNormal(card,caps,zone,pool);
   const actions=[...specific,...basic],hasEffects=specific.some(a=>a.kind==='EFFECT'||a.kind==='RESPONSE'),hasSummons=specific.some(a=>a.kind==='SUMMON');
   const actionCoverage=isSkill?'SKILL_OUTSIDE_CAUSAL_ENGINE':hasEffects?'PARTIAL_REGISTERED_ACTIONS':hasSummons?'REGISTERED_SUMMON_ONLY':basic.length?'BASIC_NORMAL_ACTIONS_ONLY':'NO_REGISTERED_CARD_ACTIONS';
   const valid=id!==null&&quantity!==null&&plainObject(input),duplicateKey=zone+':'+id;if(valid&&duplicates.has(duplicateKey))rowIssues.push('DUPLICATE_ID_ROW');if(valid)duplicates.add(duplicateKey);
   const entry={zone,index,id,canonicalId,name:String(card?.name||card?.canonicalName||(id===null?'Identidad inválida':'Passcode '+id)),quantity,knownIdentity:!!card,technicalData:{status:technicalStatus,sourceMatched:matched,statisticsKnown:(Number(card?.typeBits)&1)?card?.statsKnown===true:null,sourceCommit:card?.metadataSourceCommit||null},technicalPoolEligibility:pool?.eligible??null,actionCoverage,actions,applicableInCurrentFormat:activeFormat==='tcg'&&!isSkill&&pool?.eligible===true,isCurrentLegalMove:false,completeCardRules:false,notes:[...arr(definition?.notes),'La presencia de una acción registrada no demuestra que sea legal con la mano o el campo actuales.'],issues:rowIssues};
   entries.push(entry);counts.entries++;zones[zone].entries++;
   if(valid){counts.validEntries++;counts.totalCopies+=quantity;zones[zone].copies+=quantity;ids.add(id);if(canonicalId!==null)families.add(canonicalId);if(matched)counts.technicalMatchedCopies+=quantity;else counts.unresolvedTechnicalCopies+=quantity;
    if(isSkill)counts.skillsCopies+=quantity;else if(hasEffects){counts.specificActionCopies+=quantity;zones[zone].specificActionCopies+=quantity;}else if(hasSummons)counts.summonOnlyCopies+=quantity;else if(basic.length)counts.basicOnlyCopies+=quantity;else counts.noRegisteredActionCopies+=quantity;
   }else counts.invalidEntries++;
   for(const code of rowIssues)issues.push({code,zone,index,id});
  }
 }
 if(partial)issues.push({code:'DECK_ENTRY_LIMIT',maximum:1000,expectedEntries});counts.uniqueIds=ids.size;counts.aliasFamilies=families.size;
 return{schema:'ygo-card-action-coverage/v1',version:VERSION,pass:validDeck&&!partial,inputValid:issues.length===0,partial,expectedEntries,buildId:W.YGO_BUILD_MANIFEST?.buildId||null,revision:W.YGO_BUILD_MANIFEST?.revision||null,catalogSha256:W.YGO_BUILD_MANIFEST?.catalogSha256||W.YGODataCatalog?.status?.()?.cardsSha256||null,format:activeFormat,formatContextVersion:W.YGOUIState?.contextVersion??null,formatContext:context,applicableInCurrentFormat:activeFormat==='tcg',engineAvailable:caps.available,scope:'REGISTERED_CARD_ACTION_INVENTORY_NOT_CURRENT_LEGAL_MOVES',counts,zones,entries,issues,completeCardRules:false,certified:false,competitiveCertified:false,limitations:['El registro es parcial y se contrasta con los handlers y proveedores cargados; no certifica todos los efectos de una carta.','Los datos técnicos de catálogo no equivalen a reglas implementadas ni a una publicación oficial autenticada.','Las acciones genéricas de monstruos Normales se cuentan aparte de los efectos y respuestas específicos.','El motor causal registrado se limita a TCG; Side y Skills no se convierten en cartas activas del escenario.','No se calcula un porcentaje de terminación del proyecto, una tasa de victoria ni una nota competitiva.']};
}
let mounted=false,summary,body,filter,zoneFilter,message,resolveReady;
const ready=new Promise(resolve=>resolveReady=resolve),node=(tag,text)=>{const el=D.createElement(tag);if(text!==undefined)el.textContent=String(text);return el};
function paint(){if(!mounted)return;const data=report(),c=data.counts;summary.textContent=`${c.totalCopies} copias en todas las zonas · ${c.specificActionCopies} con acciones específicas parciales · ${c.summonOnlyCopies} solo con invocación registrada · ${c.basicOnlyCopies} solo con acciones básicas de Normal · ${c.noRegisteredActionCopies} sin acciones específicas · ${c.skillsCopies} Skills. ${data.applicableInCurrentFormat?'Ámbito causal TCG.':'El formato actual queda fuera del motor causal TCG.'}`;
 const query=filter.value.trim().toLocaleLowerCase(),selected=zoneFilter.value,rows=data.entries.filter(x=>(selected==='all'||x.zone===selected)&&(!query||[x.name,x.id,x.canonicalId,...x.actions.map(a=>a.label)].join(' ').toLocaleLowerCase().includes(query)));
 body.replaceChildren();for(const row of rows.slice(0,150)){const tr=node('tr');for(const text of [row.name+' ('+(row.id??'inválido')+')',labels[row.zone],row.quantity??'inválida',dataLabels[row.technicalData.status],row.actions.map(a=>a.label).join(' · ')||'Ninguna registrada',statusLabels[row.actionCoverage]])tr.append(node('td',text));body.append(tr);}
 message.textContent=`Mostrando ${Math.min(rows.length,150)} de ${rows.length} entradas filtradas. ${data.issues.length?data.issues.length+' incidencias de identidad, cantidad o estructura; revisa el informe. ':''}El JSON exporta todas las entradas procesadas y su contexto.`;
}
function download(){const data=report(),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=node('a');a.href=url;a.download='Cobertura_Acciones_Baraja.json';D.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return data;}
function mount(){if(mounted)return;const section=node('section');section.id='ygoCardCoverage';section.className='box';section.setAttribute('aria-label','Cobertura parcial de acciones de la baraja');section.append(node('h3','Acciones registradas de esta baraja'),node('p','Consulta qué acciones concretas reconoce el motor para cada carta. Tener datos técnicos o participar como material no acredita todos sus efectos. Los conteos no garantizan una jugada legal ni una mano jugable.'));
 summary=node('p');summary.id='ygoCardCoverageSummary';summary.setAttribute('role','status');summary.setAttribute('aria-live','polite');section.append(summary);
 const details=node('details'),title=node('summary','Revisar cartas y exportar el registro');details.append(title);const controls=node('div');controls.className='ygo-coverage-controls';
 const searchLabel=node('label','Buscar carta o acción ');filter=node('input');filter.id='ygoCardCoverageFilter';filter.type='search';filter.placeholder='Nombre o passcode';filter.setAttribute('aria-label','Buscar en acciones registradas');searchLabel.append(filter);controls.append(searchLabel);
 const zoneLabel=node('label','Zona ');zoneFilter=node('select');zoneFilter.id='ygoCardCoverageZone';for(const [value,label]of [['all','Todas las zonas'],...Object.entries(labels)]){const option=node('option',label);option.value=value;zoneFilter.append(option);}zoneLabel.append(zoneFilter);controls.append(zoneLabel);
 const exportButton=node('button','Exportar acciones registradas JSON');exportButton.type='button';exportButton.id='ygoCardCoverageExport';exportButton.onclick=download;controls.append(exportButton);details.append(controls);
 const container=node('div');container.className='ygo-coverage-table';const table=node('table'),thead=node('thead'),tr=node('tr');for(const value of ['Carta','Zona','Copias','Datos técnicos','Acciones registradas','Alcance parcial'])tr.append(node('th',value));thead.append(tr);body=node('tbody');body.id='ygoCardCoverageRows';table.append(thead,body);container.append(table);details.append(container);message=node('p');message.id='ygoCardCoverageStatus';details.append(message,node('p','Las acciones están sujetas a ventanas, costes, usos y perfiles revisados. Side y Skills se muestran como inventario; reanudar un escenario exige su propia validación. La puntuación competitiva sigue provisional.'));section.append(details);
 const style=node('style');style.textContent='#ygoCardCoverage{padding:14px;margin:12px 0;font-size:13px;line-height:1.5}#ygoCardCoverage h3{color:#7ee7ff;font-size:17px}.ygo-coverage-controls{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0}.ygo-coverage-controls label{display:flex;flex-direction:column;gap:3px}.ygo-coverage-controls input,.ygo-coverage-controls select,.ygo-coverage-controls button{min-height:32px;max-width:100%;padding:5px;color:#eaf7ff;background:#071d39;border:1px solid #376786;border-radius:5px}.ygo-coverage-table{max-width:100%;overflow:auto}#ygoCardCoverage table{width:100%;border-collapse:collapse;text-align:left}#ygoCardCoverage th,#ygoCardCoverage td{padding:7px;border-bottom:1px solid #31516e;vertical-align:top;overflow-wrap:anywhere}#ygoCardCoverage summary{cursor:pointer}';D.head.append(style);
 const existing=D.getElementById('ygoFormatEditor')||D.getElementById('ygoStableRelease');if(existing)existing.after(section);else(D.querySelector('.app')||D.body).prepend(section);
 filter.addEventListener('input',paint);zoneFilter.addEventListener('change',paint);W.addEventListener('ygo-ui-state-updated',paint);W.addEventListener('ygo-catalog-updated',paint);mounted=true;paint();
}
W.YGOCardCoverage=Object.freeze({version:VERSION,ready,report,exportReport:report,downloadReport:download,registry:()=>clone(definitions),refresh:paint});
async function initialize(){try{await W.__YGO_ENGINE_READY;await W.YGODataCatalog?.ready;await W.YGOUIState?.ready;if(D)mount();resolveReady(true);}catch(error){if(D)console.error('CARD_ACTION_COVERAGE_INIT',error);resolveReady(false);}}
if(D&&D.readyState==='loading')D.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
})();
