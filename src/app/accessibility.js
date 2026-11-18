/* Presentation-only keyboard and naming improvements. These checks do not
 * establish complete WCAG conformance or assistive-technology acceptance. */
(()=>{'use strict';
const W=window,D=document,MODALS='#v12Modal,#ygoRulingModal';
let installed=false,scheduled=false,activeModal=null,returnFocus=null,lastOutsideFocus=null;
const backgroundInert=new Map(),boundModals=new WeakSet();
const regions=new Set(['ygoCausalWorkbench','ygoAdvancedWorkbench','ygoCardCoverage','ygoFormatEditor','ygoDataQuality','ygoDrawContinuation','ygoManualEvidence']);
const disabledReasons=new Map(),reasonNodes=new Map(),PREFERENCE_KEY='ygo-accessibility-preferences-v1';
const MANUAL_SCHEMA='ygo-manual-device-accessibility/v1',FLOW_IDS=['open-import','play-save-resume','keyboard-assistive'];
const resultValues=new Set(['PASS','FAIL','BLOCKED','NOT_RUN']);
let contrastPreference=false,motionPreference=false,lastManualReview=null;
const visible=element=>element instanceof HTMLElement&&!element.hidden
 &&!element.closest('[inert]')&&element.getClientRects().length>0;
function focusable(modal){return[...modal.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')]
 .filter(element=>!element.disabled&&element.tabIndex>=0&&visible(element));}
function setAttribute(element,key,value){if(element&&element.getAttribute(key)!==value)element.setAttribute(key,value);}
function containBackground(modal){
 for(let ancestor=modal;ancestor&&ancestor!==D.body;ancestor=ancestor.parentElement){
  for(const sibling of ancestor.parentElement?.children||[]){
   if(sibling===ancestor||['SCRIPT','STYLE','LINK'].includes(sibling.tagName))continue;
   if(!backgroundInert.has(sibling))backgroundInert.set(sibling,sibling.inert);
   sibling.inert=true;
  }
 }
}
function restoreBackground(){for(const[element,value]of backgroundInert)element.inert=value;backgroundInert.clear();}
function closeModal(modal=activeModal){if(modal){modal.classList.remove('open');syncModals();}}
function firstFocus(modal){(focusable(modal)[0]||modal).focus({preventScroll:true});}
function enhanceModal(modal){
 setAttribute(modal,'role','dialog');setAttribute(modal,'aria-modal','true');
 if(!modal.hasAttribute('tabindex'))modal.tabIndex=-1;
 if(!modal.getAttribute('aria-labelledby')&&!modal.getAttribute('aria-label'))setAttribute(modal,'aria-label','Simulador de cartas');
 if(boundModals.has(modal))return;boundModals.add(modal);
 const close=modal.querySelector('.close,.ygo-ruling-close');
 if(close){setAttribute(close,'aria-label',modal.id==='v12Modal'?'Cerrar vista ampliada de la carta':'Cerrar simulador de cartas');
  close.addEventListener('click',()=>closeModal(modal));}
 modal.addEventListener('click',event=>{if(event.target===modal)closeModal(modal);});
}
function syncModals(){
 const modals=[...D.querySelectorAll(MODALS)];
 for(const modal of modals){enhanceModal(modal);const open=modal.classList.contains('open');
  setAttribute(modal,'aria-hidden',String(!open));modal.inert=!open;}
 const next=modals.find(modal=>modal.classList.contains('open'))||null;
 if(next===activeModal){if(next)containBackground(next);return;}
 const previous=activeModal;
 restoreBackground();activeModal=next;
 if(next){if(!previous)returnFocus=lastOutsideFocus||D.activeElement;
  containBackground(next);firstFocus(next);
 }else if(previous){const target=returnFocus;returnFocus=null;
  if(target?.isConnected&&visible(target)&&typeof target.focus==='function')target.focus({preventScroll:true});}
}
function pressed(selector){for(const button of D.querySelectorAll(selector))setAttribute(button,'aria-pressed',String(button.classList.contains('active')));}
function syncSelections(){
 pressed('.formats .fmt');pressed('.deck-tabs .deck-tab');pressed('.lab-tabs .lab-tab');
 for(const button of D.querySelectorAll('.deck-tabs .deck-tab'))setAttribute(button,'aria-controls','deckList');
 for(const[index,button]of [...D.querySelectorAll('.lab-tabs .lab-tab')].entries()){
  const target=['lab-db','lab-ban'][index];if(target&&D.getElementById(target))setAttribute(button,'aria-controls',target);}
}
function sync(){scheduled=false;syncSelections();syncModals();syncRegions();syncDisabledReasons();}
function schedule(){if(!scheduled){scheduled=true;W.requestAnimationFrame(sync);}}
function syncRegions(){for(const id of regions){const element=D.getElementById(id);if(element)setAttribute(element,'data-ygo-accessible-region','true');}}
function registerRegion(id){if(typeof id!=='string'||!/^[-\w:]{1,100}$/.test(id))throw Error('ACCESSIBILITY_REGION_ID_REQUIRED');regions.add(id);schedule();return id;}
function registerDisabledReason(id,reason){if(typeof id!=='string'||!/^[-\w:]{1,100}$/.test(id)||!(typeof reason==='string'||typeof reason==='function'))throw Error('ACCESSIBILITY_DISABLED_REASON_REQUIRED');disabledReasons.set(id,reason);schedule();return id;}
function syncDisabledReasons(){for(const[id,resolver]of disabledReasons){const control=D.getElementById(id);if(!control)continue;let node=reasonNodes.get(id);if(node&&!node.isConnected){reasonNodes.delete(id);node=null;}
 const active=control.disabled===true&&visible(control);let text='';if(active){try{text=String(typeof resolver==='function'?resolver(control):resolver).trim();}catch(_){text='Este control no está disponible en el estado actual.';}}
 if(active&&text&&!node){node=D.createElement('span');node.id='ygoA11yReason-'+id;while(D.getElementById(node.id))node.id+='-extra';node.className='ygo-a11y-disabled-reason';(control.closest('label')||control).insertAdjacentElement('afterend',node);reasonNodes.set(id,node);}
 if(!node)continue;if(node.textContent!==text)node.textContent=text;node.hidden=!active||!text;
 const described=new Set((control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean));if(active&&text)described.add(node.id);else described.delete(node.id);const value=[...described].join(' ');if(value)setAttribute(control,'aria-describedby',value);else control.removeAttribute('aria-describedby');}}
function announce(text){const target=D.getElementById('ygoAccessibilityAnnouncement');if(target)target.textContent=String(text||'').slice(0,1200);}
function preferences(){return{highContrast:contrastPreference,reducedMotion:motionPreference};}
function applyPreferences(value,{persist=true}={}){contrastPreference=value?.highContrast===true;motionPreference=value?.reducedMotion===true;
 D.documentElement.dataset.ygoContrast=contrastPreference?'more':'default';D.documentElement.dataset.ygoReducedMotion=motionPreference?'reduce':'default';
 const contrast=D.getElementById('ygoA11yHighContrast'),motion=D.getElementById('ygoA11yReduceMotion');if(contrast)contrast.checked=contrastPreference;if(motion)motion.checked=motionPreference;
 if(persist)try{W.localStorage.setItem(PREFERENCE_KEY,JSON.stringify(preferences()));}catch(_){}return preferences();}
function named(element){return!!(element.getAttribute('aria-label')?.trim()||(element.getAttribute('aria-labelledby')||'').split(/\s+/).some(id=>D.getElementById(id)?.textContent.trim())||[...element.labels||[]].some(label=>label.textContent.trim())||(['BUTTON','SUMMARY','A'].includes(element.tagName)&&element.textContent.trim())||(element.tagName==='INPUT'&&['button','submit','reset'].includes(element.type)&&element.value));}
function audit(){const issues=[],controls=[...new Set([...regions].flatMap(id=>[...D.getElementById(id)?.querySelectorAll('button,input,select,textarea,summary,a[href]')||[]]))].filter(visible);
 for(const element of controls){if(!named(element))issues.push({code:'CONTROL_WITHOUT_ACCESSIBLE_NAME',id:element.id||null,tag:element.tagName});for(const attribute of ['aria-labelledby','aria-describedby','aria-controls'])for(const id of (element.getAttribute(attribute)||'').split(/\s+/).filter(Boolean))if(!D.getElementById(id))issues.push({code:'ARIA_REFERENCE_MISSING',id:element.id||null,attribute,target:id});if(element.disabled&&disabledReasons.has(element.id)&&!element.getAttribute('aria-describedby'))issues.push({code:'REGISTERED_DISABLED_REASON_MISSING',id:element.id});}
 return{schema:'ygo-accessibility-structure-audit/v1',pass:issues.length===0,controlsChecked:controls.length,issues,scope:'VISIBLE_REGISTERED_CONTROLS_NAMES_AND_REFERENCES',contrastAudited:false,assistiveTechnologyTested:false,physicalDevicesTested:false,completeAccessibilityCertified:false};}
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value),text=value=>typeof value==='string'&&value.trim().length>0;
function validateManualEvidence(input,{buildId=W.YGO_BUILD_MANIFEST?.buildId||null,htmlSha256=null}={}){
 const issues=[],add=(code,message)=>issues.push({code,message});let source;try{const serialized=JSON.stringify(input);if(!serialized||serialized.length>256000)throw Error();source=JSON.parse(serialized);}catch(_){return{schema:'ygo-manual-evidence-review/v1',pass:false,inputValid:false,issues:[{code:'MANUAL_REPORT_OBJECT_REQUIRED',message:'El informe debe ser un objeto JSON de hasta 256 KB.'}],requiresHumanReview:true,completeAccessibilityCertified:false,physicalDevicesVerifiedByAgent:false};}
 if(!object(source)){add('MANUAL_REPORT_OBJECT_REQUIRED','El informe debe ser un objeto JSON.');source={};}
 if(source.schema!==MANUAL_SCHEMA)add('MANUAL_REPORT_SCHEMA_REQUIRED','El esquema del informe manual no está admitido.');
 if(!text(buildId)||source.buildId!==buildId)add('MANUAL_REPORT_BUILD_MISMATCH','La compilación del informe no coincide con este HTML.');
 if(!/^[a-f0-9]{64}$/.test(String(source.htmlSha256||'')))add('MANUAL_REPORT_HTML_HASH_REQUIRED','Registra el SHA-256 real del archivo HTML probado.');else if(htmlSha256!==null&&source.htmlSha256!==htmlSha256)add('MANUAL_REPORT_HTML_HASH_MISMATCH','El SHA-256 no coincide con el archivo esperado.');
 if(!text(source.testedAt)||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(source.testedAt)||!Number.isFinite(Date.parse(source.testedAt)))add('MANUAL_REPORT_TEST_DATE_REQUIRED','Registra la fecha y hora reales en formato ISO con zona horaria.');
 if(!text(source.testerAlias))add('MANUAL_REPORT_TESTER_REQUIRED','Indica un alias del evaluador; no es necesario incluir datos personales.');
 const environment=object(source.environment)?source.environment:{};for(const key of ['deviceModel','os','osVersion','browser','browserVersion'])if(!text(environment[key]))add('MANUAL_REPORT_ENVIRONMENT_'+key.toUpperCase(),'Falta el dato del equipo: '+key+'.');
 if(!['PHYSICAL','EMULATED','REMOTE_VIRTUAL'].includes(environment.deviceKind))add('MANUAL_REPORT_DEVICE_KIND_REQUIRED','Declara si el equipo es físico, emulado o virtual remoto.');
 if(typeof environment.physicalDeviceConfirmed!=='boolean'||typeof environment.emulationUsed!=='boolean')add('MANUAL_REPORT_DEVICE_DECLARATION_REQUIRED','Completa las declaraciones de equipo físico y emulación.');
 if(environment.deviceKind==='PHYSICAL'&&(environment.physicalDeviceConfirmed!==true||environment.emulationUsed!==false)||environment.deviceKind!=='PHYSICAL'&&environment.physicalDeviceConfirmed===true)add('MANUAL_REPORT_DEVICE_DECLARATION_CONFLICT','La declaración de equipo físico contradice el tipo de prueba.');
 const assistive=object(environment.assistiveTechnology)?environment.assistiveTechnology:{};if(!text(assistive.name)||typeof assistive.actualUse!=='boolean')add('MANUAL_REPORT_ASSISTIVE_DECLARATION_REQUIRED','Registra si se utilizó un lector de pantalla o tecnología de asistencia.');
 if(assistive.actualUse===true&&(!text(assistive.version)||assistive.name==='NONE'))add('MANUAL_REPORT_ASSISTIVE_DETAILS_REQUIRED','Registra el nombre y versión de la tecnología utilizada realmente.');
 if(assistive.name!=='NONE'&&assistive.actualUse===false)add('MANUAL_REPORT_ASSISTIVE_DECLARATION_CONFLICT','Un programa disponible no equivale a haberlo probado: usa NONE cuando no se utilizó.');
 const flows=Array.isArray(source.flows)?source.flows:[];if(flows.length!==FLOW_IDS.length||new Set(flows.map(row=>row?.id)).size!==FLOW_IDS.length||FLOW_IDS.some(id=>!flows.some(row=>row?.id===id)))add('MANUAL_REPORT_FLOW_INVENTORY_REQUIRED','El informe debe incluir exactamente los tres flujos del protocolo.');
 for(const row of flows){if(!object(row)||!resultValues.has(row.result))add('MANUAL_REPORT_FLOW_RESULT_REQUIRED','Cada flujo necesita un resultado PASS, FAIL, BLOCKED o NOT_RUN.');if(row?.result!=='NOT_RUN'&&!text(row?.observed))add('MANUAL_REPORT_FLOW_OBSERVATION_REQUIRED','Describe lo observado en cada flujo ejecutado o bloqueado.');}
 if(source.performedByReporter!==true)add('MANUAL_REPORT_ATTESTATION_REQUIRED','El evaluador debe confirmar que realizó personalmente las pruebas declaradas.');
 const passed=flows.filter(row=>row?.result==='PASS').length,notRun=flows.filter(row=>row?.result==='NOT_RUN').length;
 return{schema:'ygo-manual-evidence-review/v1',pass:issues.length===0,inputValid:issues.length===0,buildId:source.buildId||null,issues,flows:{total:flows.length,passed,notRun,reportedAllPassed:flows.length===3&&passed===3},physicalDeviceReported:environment.deviceKind==='PHYSICAL'&&environment.physicalDeviceConfirmed===true&&environment.emulationUsed===false,assistiveTechnologyReported:assistive.actualUse===true,htmlHashCompared:htmlSha256!==null,requiresHumanReview:true,provenance:'REPORTER_DECLARATION_NOT_AGENT_VERIFICATION',completeAccessibilityCertified:false,physicalDevicesVerifiedByAgent:false,competitiveCertified:false};
}
function manualTemplate(){const tasks={'open-import':['Abrir el HTML descargado e importar JSON o YDK.','Revisar Main, Extra y Side, nombres de controles y mensajes del selector de archivos.'],'play-save-resume':['Cargar un ejemplo físico, ejecutar sus pasos, comprobar objetivo y replay.','Deshacer, exportar y reanudar; rechazar un informe inválido conservando la partida.'],'keyboard-assistive':['Recorrer controles sin ratón; comprobar saltos, foco, selección y diálogos.','Si se usa un lector, registrar anuncios reales; probar contraste, movimiento y ampliación.']};return{schema:MANUAL_SCHEMA,buildId:W.YGO_BUILD_MANIFEST?.buildId||null,htmlSha256:null,testedAt:null,testerAlias:'',environment:{deviceKind:null,deviceModel:'',os:'',osVersion:'',browser:'',browserVersion:'',physicalDeviceConfirmed:false,emulationUsed:false,assistiveTechnology:{name:'NONE',version:null,actualUse:false}},performedByReporter:false,flows:FLOW_IDS.map(id=>({id,tasks:tasks[id],result:'NOT_RUN',observed:'',evidenceReference:''})),limitations:['Completa sólo pruebas realizadas; no conviertas emulación ni disponibilidad de software en evidencia de equipo físico o lector de pantalla.']};}
function downloadManualTemplate(){const url=URL.createObjectURL(new Blob([JSON.stringify(manualTemplate(),null,2)],{type:'application/json'})),link=D.createElement('a');link.href=url;link.download='Pruebas_manuales_equipo_accesibilidad.json';D.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function mountManualReview(){if(D.getElementById('ygoManualEvidence'))return;const panel=D.createElement('section');panel.id='ygoManualEvidence';panel.className='box';panel.setAttribute('aria-label','Preferencias y pruebas manuales de accesibilidad');
 panel.innerHTML='<h3>Accesibilidad y pruebas del equipo</h3><div class="ygo-a11y-preferences"><label><input id="ygoA11yHighContrast" type="checkbox"> Aumentar contraste de los paneles de trabajo</label><label><input id="ygoA11yReduceMotion" type="checkbox"> Reducir movimiento y transiciones</label></div><p id="ygoAccessibilityAnnouncement" role="status" aria-live="polite" aria-atomic="true"></p><details><summary>Revisar pruebas manuales de este equipo</summary><p>Descarga la plantilla y registra las tareas realizadas en tu equipo. Importar un informe revisa su estructura y compilación; la evidencia necesita revisión humana.</p><div class="ygo-a11y-manual-controls"><button type="button" id="ygoManualEvidenceTemplate">Descargar plantilla de pruebas</button><label>Informe de pruebas JSON <input type="file" id="ygoManualEvidenceFile" accept=".json,application/json" aria-describedby="ygoManualEvidenceLimit"></label></div><p id="ygoManualEvidenceLimit">El archivo se revisa en este navegador. No modifica tu baraja ni convierte una declaración en certificación de accesibilidad.</p><p id="ygoManualEvidenceStatus" role="status" aria-live="polite" aria-atomic="true"></p></details>';
 (D.getElementById('ygoStableRelease')||D.querySelector('.app')||D.body).append(panel);
 D.getElementById('ygoA11yHighContrast').addEventListener('change',event=>{applyPreferences({...preferences(),highContrast:event.target.checked});announce(event.target.checked?'Contraste aumentado activado.':'Contraste habitual activado.');});
 D.getElementById('ygoA11yReduceMotion').addEventListener('change',event=>{applyPreferences({...preferences(),reducedMotion:event.target.checked});announce(event.target.checked?'Movimiento reducido activado.':'Preferencia de movimiento habitual activada.');});
 D.getElementById('ygoManualEvidenceTemplate').addEventListener('click',downloadManualTemplate);
 D.getElementById('ygoManualEvidenceFile').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;const status=D.getElementById('ygoManualEvidenceStatus');try{if(file.size>256000)throw Error('El informe supera 256 KB.');const result=validateManualEvidence(JSON.parse(await file.text()));lastManualReview=result;status.textContent=result.inputValid?'Informe válido para revisión humana: '+result.flows.passed+' de '+result.flows.total+' flujos declarados aprobados. '+(result.physicalDeviceReported?'El evaluador declara un equipo físico. ':'')+'El SHA-256 declarado requiere contraste con el archivo probado.':'Informe pendiente de corregir: '+result.issues.map(issue=>issue.message).join(' ');}catch(error){lastManualReview=null;status.textContent='No se pudo revisar el informe: '+String(error.message||error);}event.target.value='';});
}
function presentationStyle(){const style=D.createElement('style');style.id='ygoAccessibilityR23Style';style.textContent=`
 #ygoManualEvidence{padding:14px;margin:12px 0;font:14px/1.5 Arial,sans-serif;max-width:100%;box-sizing:border-box;background:#071d39;color:#eaf7ff;border:1px solid #6c9eb9;border-radius:8px}#ygoManualEvidence h3{font-size:17px;color:#a7efff}#ygoManualEvidence summary{cursor:pointer;min-height:44px;padding:10px 0;box-sizing:border-box}.ygo-a11y-preferences{display:flex;flex-wrap:wrap;gap:10px}.ygo-a11y-preferences label{display:flex;align-items:center;gap:8px;min-height:44px;max-width:100%;overflow-wrap:anywhere}.ygo-a11y-preferences input{flex:0 0 24px;width:24px;height:24px;min-height:24px}.ygo-a11y-manual-controls{display:flex;flex-wrap:wrap;gap:10px}.ygo-a11y-manual-controls label{display:flex;flex-direction:column;min-width:0;max-width:100%}.ygo-a11y-manual-controls :is(button,input){min-height:44px;box-sizing:border-box;max-width:100%;color:#f8fbff;background:#102c4c;border:1px solid #b7d8f0;border-radius:5px;padding:8px;font:inherit}.ygo-a11y-disabled-reason{display:block;flex-basis:100%;font-size:12px;line-height:1.5;color:#d8e7f5;max-width:100%;overflow-wrap:anywhere}.ygo-a11y-disabled-reason[hidden]{display:none}
 html[data-ygo-contrast=more] [data-ygo-accessible-region]{color:#f8fbff!important;background:#071d39!important;border-color:#b7d8f0!important}html[data-ygo-contrast=more] [data-ygo-accessible-region] :is(p,label,legend,summary,td,th,li,small,span){color:inherit!important;opacity:1!important;text-shadow:none!important}html[data-ygo-contrast=more] [data-ygo-accessible-region] :is(input,select,textarea,button),html[data-ygo-contrast=more] [data-ygo-accessible-region] input::file-selector-button{color:#f8fbff!important;background:#102c4c!important;border:1px solid #b7d8f0!important;opacity:1!important;text-shadow:none!important}html[data-ygo-contrast=more] [data-ygo-accessible-region] :is(button,input,select,textarea):disabled{color:#dce6f0!important;background:#263647!important;border-style:dashed!important;cursor:not-allowed}html[data-ygo-contrast=more] [data-ygo-accessible-region] a[href]{color:#a7efff!important}html[data-ygo-contrast=more] [data-ygo-accessible-region] :focus-visible{outline:3px solid #ffdd70!important;outline-offset:3px!important}
 html[data-ygo-reduced-motion=reduce] *,html[data-ygo-reduced-motion=reduce] *::before,html[data-ygo-reduced-motion=reduce] *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}@media(max-width:600px){#ygoManualEvidence .ygo-a11y-manual-controls>label{width:100%}}
 `;D.head.append(style);}
function keydown(event){
 if(!activeModal)return;
 if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeModal();return;}
 if(event.key!=='Tab')return;
 const items=focusable(activeModal),first=items[0],last=items.at(-1),current=D.activeElement;
 if(!first){event.preventDefault();activeModal.focus({preventScroll:true});return;}
 if(!activeModal.contains(current)||event.shiftKey&&(current===first||current===activeModal)){
  event.preventDefault();(event.shiftKey?last:first).focus({preventScroll:true});
 }else if(!event.shiftKey&&current===last){event.preventDefault();first.focus({preventScroll:true});}
}
function install(){
 if(installed)return;installed=true;
 D.addEventListener('keydown',keydown,true);
 D.addEventListener('focusin',event=>{if(activeModal&&!activeModal.contains(event.target))firstFocus(activeModal);
  else if(!activeModal&&!event.target.closest?.(MODALS))lastOutsideFocus=event.target;},true);
 D.addEventListener('click',event=>{
  const link=event.target.closest?.('.ygo-skip-links a[href^="#"]');
  if(link){const target=D.getElementById(link.hash.slice(1));if(target){event.preventDefault();target.focus();target.scrollIntoView({block:'start',behavior:'instant'});}}
  if(event.target.closest?.('.fmt,.deck-tab,.lab-tab'))schedule();
 });
 for(const id of ['archBuilderStatus','alpha854OpponentStatus']){const element=D.getElementById(id);
  setAttribute(element,'role','status');setAttribute(element,'aria-live','polite');}
 for(const header of D.querySelectorAll('#ygoFormatEditor th'))setAttribute(header,'scope','col');
 presentationStyle();mountManualReview();
 const labReason=reason=>()=>W.YGOAdvancedWorkbench?.isBusy||W.YGOComboWorkbench?.isBusy?'Espera a que termine la exploración, comparación o carga actual.':reason;
 for(const[id,reason]of Object.entries({ygoDuelStep:labReason('No hay una acción seleccionable para este estado. Revisa el filtro y los efectos pendientes.'),ygoDuelActions:labReason('No hay acciones que coincidan con el estado y el filtro actuales.'),ygoDuelUndo:labReason('Aún no hay un paso que deshacer.'),ygoDuelActionPage:'Solo hay una página de acciones.',ygoCompareStop:'No hay una comparación en curso.',ygoCausalStop:'No hay una búsqueda en curso.',ygoDuelSetupSetTurn:labReason('Este dato se utiliza al preparar una Mágica o Trampa colocada.'),ygoDuelSetupProperSummon:labReason('La declaración de Invocación se aplica a un monstruo en el campo.'),ygoDuelSetupSummonType:labReason('Activa la declaración de Invocación previa para elegir su tipo.')}))registerDisabledReason(id,reason);
 let saved=null;try{saved=JSON.parse(W.localStorage.getItem(PREFERENCE_KEY)||'null');}catch(_){}applyPreferences(saved||{highContrast:W.matchMedia?.('(prefers-contrast: more)').matches,reducedMotion:W.matchMedia?.('(prefers-reduced-motion: reduce)').matches},{persist:false});
 new MutationObserver(schedule).observe(D.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','disabled','open']});
 sync();
}
W.YGOAccessibility=Object.freeze({version:'keyboard-presentation-v2',
 scope:'REGISTERED_KEYBOARD_AND_NAMING_IMPROVEMENTS',completeAccessibilityCertified:false,
 assistiveTechnologyTested:false,physicalDevicesTested:false,registerRegion,registerDisabledReason,announce,audit,preferences,applyPreferences,manualTemplate,validateManualEvidence,lastManualReview:()=>lastManualReview?structuredClone(lastManualReview):null});
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
