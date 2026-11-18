/* Visible controls for the optional registered rule engines and draw trees. */
(()=>{'use strict';
const W=window,D=document,A=W.YGOAdvancedWorkbench,C=W.YGOComboWorkbench,E=W.YGOComboEngine;
if(!A?.ready||!C?.loadScenario)throw Error('RULES_WORKBENCH_REQUIRES_LAB');
const copy=x=>structuredClone(x),arr=x=>Array.isArray(x)?x:[],state={last:null,stamp:null,busy:false,controller:null};
let resolveReady;const ready=new Promise(resolve=>resolveReady=resolve),$=id=>D.getElementById(id);
const node=(tag,text)=>{const n=D.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;};
const stamp=r=>JSON.stringify({build:r.buildId,current:r.current,goal:r.goal});
const percent=n=>Number.isFinite(Number(n))?(100*Number(n)).toLocaleString('es',{maximumFractionDigits:3})+' %':'sin dato';
const fraction=x=>x&&x.numerator!==undefined?String(x.numerator)+'/'+String(x.denominator):'sin dato';
function message(text){$('ygoRulesStatus').textContent=text;W.YGOAccessibility?.announce?.(text);}
function safe(fn){return()=>Promise.resolve().then(fn).catch(error=>{message(String(error?.message||error));$('ygoRulesStatus').focus({preventScroll:true});});}
function download(value,name){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=node('a');a.href=url;a.download=name;D.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function selectedModes(){const priorityMode=$('ygoRulesPriority').checked,triggerOrderMode=$('ygoRulesTriggers').checked,damageStepMode=$('ygoRulesDamage').checked;if((triggerOrderMode||damageStepMode)&&!priorityMode||damageStepMode&&!triggerOrderMode)throw Error('Activa prioridad y efectos simultáneos para usar los pasos de daño.');return{priorityMode,triggerOrderMode,damageStepMode};}
async function applyModes(){
 if(state.busy||A.isBusy||C.isBusy)throw Error('Espera a que termine el análisis actual.');
 const current=A.report(),initial=current.initial,spec=initial?{...copy(initial.provenance),context:copy(initial.context)}:C.input(),modes=selectedModes(),goal=current.goal||C.report().goal;
 for(const key of Object.keys(modes)){delete spec.context[key];if(modes[key])spec.context[key]=true;}
 spec.goal=copy(goal);await C.loadScenario(spec);await A.initialize({spec,goal});invalidate();paint();message('Escenario reiniciado con las reglas seleccionadas. Los pasos anteriores pertenecían al escenario anterior.');
}
function changedMode(event){if(event.target.id==='ygoRulesPriority'&&!event.target.checked){$('ygoRulesTriggers').checked=false;$('ygoRulesDamage').checked=false;}if($('ygoRulesDamage').checked){$('ygoRulesTriggers').checked=true;$('ygoRulesPriority').checked=true;}if($('ygoRulesTriggers').checked)$('ygoRulesPriority').checked=true;}
function invalidate(){state.last=null;state.stamp=null;if($('ygoSequenceResults'))$('ygoSequenceResults').replaceChildren(node('p','Todavía no hay un análisis vigente.'));if($('ygoSequenceExport'))$('ygoSequenceExport').disabled=true;}
function paint(){
 if(!$('ygoRulesStatus'))return;const r=A.snapshot(),ctx=r.current?.context||C.report().scenarioContext||{};
 if(!state.busy){$('ygoRulesPriority').checked=ctx.priorityMode===true;$('ygoRulesTriggers').checked=ctx.triggerOrderMode===true;$('ygoRulesDamage').checked=ctx.damageStepMode===true;}
 if(state.last&&stamp(r)!==state.stamp){invalidate();message('El escenario o su objetivo cambió. Repite el análisis de robos para este estado.');}
 const status=W.YGOPriorityChain?.status?.(r.current),pieces=[];
 if(r.current){pieces.push('Turno '+r.current.turn+', jugador activo '+(r.current.activePlayer+1)+'.');if(status?.enabled)pieces.push(status.open?'Debe actuar el jugador '+(status.decisionPlayer+1)+' en la ventana de respuestas.':'Prioridad explícita activa.');if(r.current.duel?.triggerOrder)pieces.push('Hay efectos simultáneos por ordenar.');if(r.current.duel?.damageStep)pieces.push('Hay un combate con pasos pendientes.');}
 $('ygoRulesCurrent').textContent=pieces.join(' ')||'Carga un ejemplo o inicia el laboratorio.';
 const policy=$('ygoCausalPolicy');if(policy){policy.disabled=ctx.priorityMode===true||C.isBusy;W.YGOAccessibility?.registerDisabledReason?.('ygoCausalPolicy',()=>ctx.priorityMode===true?'En este modo, ambos jugadores eligen sus respuestas en el laboratorio.':'Espera a que termine la tarea actual.');}
 $('ygoRulesApply').disabled=state.busy||A.isBusy||C.isBusy;
 $('ygoSequenceStart').disabled=state.busy||A.isBusy||C.isBusy||!r.current||!W.YGODrawSequences;
 $('ygoSequenceStop').disabled=!state.busy;$('ygoSequenceFile').disabled=state.busy||A.isBusy||C.isBusy;
 renderPendulum(r.current);
}
function renderAnalysis(result){
 const host=$('ygoSequenceResults');host.replaceChildren();if(result?.pass!==true){host.append(node('p','Análisis no completado: '+String(result?.status||'sin resultado')));for(const issue of arr(result?.issues))host.append(node('p',issue));return;}
 const metrics=result.summary||result.metrics||result,range=metrics.identificationInterval||result.identificationInterval||result.interval||{};host.append(node('p','Intervalo de cumplimiento del objetivo: '+percent(range.low)+' a '+percent(range.high)+'.'));
 host.append(node('p','Masa con objetivo cumplido: '+fraction(metrics.successWeight)+' · sin cumplir: '+fraction(metrics.failureWeight)+' · desconocida: '+fraction(metrics.unknownWeight)+'.'));
 host.append(node('p','Nodos examinados: '+String(metrics.nodes??result.nodes??'consulta el informe')+' · decisiones propias: '+String(metrics.ownDecisionNodes??result.ownDecisionNodes??0)+' · decisiones rivales: '+String(metrics.opponentDecisionNodes??result.opponentDecisionNodes??0)+'.'));
 host.append(node('p','Los robos son hipotéticos y se revelan cuando corresponde cada evento. El intervalo usa el escenario declarado y las decisiones registradas; conserva los resultados desconocidos.'));
 host.append(node('p',result.limits?.actionTypes?'Este cálculo restringe las decisiones al avance de fases y robos; no incluye activaciones ni ataques.':'Se consideran las acciones registradas dentro de los límites de exploración.'));
 const details=node('details'),summary=node('summary','Supuestos y límites de este análisis');details.append(summary);for(const line of arr(result.limitations))details.append(node('p',line));host.append(details);
}
async function analyze(){
 if(!W.YGODrawSequences||state.busy)throw Error('El análisis de secuencias no está disponible o sigue en curso.');
 const draws=Number($('ygoSequenceDraws').value),maxNodes=Number($('ygoSequenceNodes').value),maxDepth=Number($('ygoSequenceDepth').value),source=A.report();if(!source.current)throw Error('Inicia un escenario antes de analizar sus robos.');
 invalidate();state.busy=true;state.stamp=stamp(source);paint();message('Analizando robos cronológicos y decisiones registradas…');
 try{const domain=$('ygoSequenceDomain').value,options={draws,maxNodes,maxDepth,maxActionsPerNode:domain==='PHASES_AND_DRAWS'?20:32,maxChanceBranches:60,maxMs:10000,...(domain==='PHASES_AND_DRAWS'?{actionTypes:['DUEL_ADVANCE_PHASE','DUEL_NEXT_TURN','DUEL_DRAW_FOR_TURN','PRIORITY_PASS','PRIORITY_RESOLVE'],phaseTargets:['STANDBY','MAIN 1','END']}:{}),onProgress:p=>{message('Analizando… '+String(p.nodes??p.expanded??p.visited??0)+' nodos.');}};
  const result=await A.analyzeSnapshot(W.YGODrawSequences.analyze,options);if(stamp(A.report())!==state.stamp){invalidate();message('Análisis descartado: cambió el escenario.');return result;}
  state.last=result?.pass===true?copy(result):null;renderAnalysis(result);$('ygoSequenceExport').disabled=!state.last;message(result?.pass===true?'Análisis terminado. Revisa el intervalo y la masa desconocida.':'Análisis interrumpido o fuera del alcance registrado.');return result;
 }finally{state.busy=false;paint();}
}
async function verifyFile(){
 if(state.busy||A.isBusy||C.isBusy)throw Error('Espera a que termine el análisis actual.');
 const file=$('ygoSequenceFile').files[0];if(!file)return;state.busy=true;paint();
 try{const result=await A.analyzeSnapshot(async(source,options)=>{if(file.size>8*1024*1024)throw Error('El informe supera 8 MB.');const value=JSON.parse(await file.text());if(options.signal.aborted)return{pass:false,status:'CANCELLED'};const checked=await W.YGODrawSequences.verifyAsync(value,{...options,source,onProgress:p=>message('Verificando… '+String(p.visited??p.nodes??0)+' nodos.')});return{...checked,report:checked.report||value};});
  if(result?.pass!==true)throw Error('El informe no coincide con el escenario o su evidencia.');state.last=copy(result.report);state.stamp=stamp(A.report());renderAnalysis(state.last);$('ygoSequenceExport').disabled=false;message('Informe verificado contra el escenario actual. La hipótesis permanece separada de la partida observada.');
 }finally{state.busy=false;$('ygoSequenceFile').value='';paint();}
}
function renderPendulum(st){
 const host=$('ygoPendulumGroup');if(!host||!st){host?.replaceChildren();return;}const P=W.YGOPendulumSummon;
 if(!P?.candidates){host.replaceChildren(node('p','Las invocaciones Péndulo registradas también aparecen en el selector de acciones del laboratorio.'));return;}
 const candidates=arr(P.candidates(st,st.activePlayer));host.replaceChildren();if(!candidates.length){host.append(node('p','No hay un grupo Péndulo disponible con las escalas, cartas y espacios actuales.'));return;}
 for(const entry of candidates){const item=entry.item||E.helpers.locate(st,entry.uid)?.item,uid=entry.uid||item?.uid;if(!uid)continue;const destinations=arr(entry.destinations);if(!destinations.length){host.append(node('p',String(entry.name||entry.cardId||uid)+': no hay una zona de destino legal disponible.'));continue;}const row=node('div');row.className='ygo-pendulum-row';row.dataset.uid=uid;
  const label=node('label'),check=node('input');check.type='checkbox';check.dataset.pendulumPick='';label.append(check,D.createTextNode(' '+String(item?.card?.name||entry.name||entry.cardId||uid)));row.append(label);
  const zoneLabel=node('label','Destino '),zone=node('select');zone.dataset.pendulumZone='';zone.setAttribute('aria-label','Destino de '+String(item?.card?.name||entry.name||uid));for(const destination of destinations){const option=node('option',destination===5?'Zona de Monstruos Extra':'Zona principal '+(destination+1));option.value=String(destination);zone.append(option);}zoneLabel.append(zone);row.append(zoneLabel);
  const positionLabel=node('label','Posición '),position=node('select');position.dataset.pendulumPosition='';position.setAttribute('aria-label','Posición de '+String(item?.card?.name||entry.name||uid));for(const [value,text]of [['ATTACK','Ataque'],['DEFENSE','Defensa']]){const option=node('option',text);option.value=value;position.append(option);}positionLabel.append(position);row.append(positionLabel);host.append(row);
 }
}
async function summonPendulum(){const report=A.report();if(!report.current)throw Error('Inicia el laboratorio.');const summons=[...$('ygoPendulumGroup').querySelectorAll('[data-uid]')].filter(row=>row.querySelector('[data-pendulum-pick]').checked).map(row=>({uid:row.dataset.uid,destination:Number(row.querySelector('[data-pendulum-zone]').value),position:row.querySelector('[data-pendulum-position]').value}));if(!summons.length)throw Error('Selecciona al menos una copia física.');const action={type:'DUEL_PENDULUM_SUMMON',player:report.current.activePlayer,summons},result=await A.step(action);if(!result.pass)throw Error('El grupo no cumple las escalas, espacios o restricciones actuales.');message('Grupo invocado por Péndulo y registrado en el historial.');return result;}
function mount(){
 const host=$('ygoAdvancedWorkbench');if(!host)throw Error('RULES_LAB_NOT_MOUNTED');const panel=node('details');panel.id='ygoRulesWorkbench';panel.append(node('summary','Reglas ampliadas y secuencias de robos'));
 panel.append(node('p','Activa prioridad explícita para elegir las respuestas de ambos jugadores. Los efectos simultáneos y pasos de daño utilizan esa prioridad. Aplicar estas opciones reinicia el escenario desde su preparación inicial.'));
 const modes=node('fieldset');modes.append(node('legend','Reglas del escenario'));for(const [id,text]of [['ygoRulesPriority','Prioridad y cadenas explícitas'],['ygoRulesTriggers','Ordenar efectos simultáneos'],['ygoRulesDamage','Resolver los pasos de daño']]){const label=node('label'),input=node('input');input.id=id;input.type='checkbox';input.dataset.labMutation='';input.addEventListener('change',changedMode);label.append(input,D.createTextNode(' '+text));modes.append(label);}
 const apply=node('button','Aplicar reglas y reiniciar escenario');apply.type='button';apply.id='ygoRulesApply';apply.dataset.labMutation='';apply.onclick=safe(applyModes);modes.append(apply);panel.append(modes);const current=node('p');current.id='ygoRulesCurrent';current.setAttribute('role','status');current.setAttribute('aria-live','polite');panel.append(current);
 const pend=node('details');pend.append(node('summary','Elegir un grupo de Invocación por Péndulo'));const group=node('div');group.id='ygoPendulumGroup';pend.append(group);const summon=node('button','Invocar el grupo seleccionado');summon.type='button';summon.id='ygoPendulumSummonGroup';summon.dataset.labMutation='';summon.onclick=safe(summonPendulum);pend.append(summon);panel.append(pend);
 const probability=node('fieldset');probability.append(node('legend','Varios robos inciertos'));probability.append(node('p','El análisis cuenta eventos de robo de turno desconocidos de ambos jugadores en orden cronológico y evalúa el objetivo después del número elegido. Usa manos y campos declarados; no predice las cartas futuras.'));
 const domainLabel=node('label','Acciones consideradas '),domain=node('select');domain.id='ygoSequenceDomain';for(const[value,text]of [['ALL_REGISTERED','Acciones y respuestas registradas'],['PHASES_AND_DRAWS','Sólo avance de fases y robos']]){const option=node('option',text);option.value=value;domain.append(option);}domainLabel.append(domain);probability.append(domainLabel);
 for(const [id,text,min,max,value]of [['ygoSequenceDraws','Eventos de robo',1,3,2],['ygoSequenceNodes','Máximo de nodos',1,5000,1200],['ygoSequenceDepth','Máximo de pasos',1,90,72]]){const label=node('label',text+' '),input=node('input');input.id=id;input.type='number';input.min=String(min);input.max=String(max);input.value=String(value);label.append(input);probability.append(label);}
 for(const [id,text,fn]of [['ygoSequenceStart','Analizar secuencia',analyze],['ygoSequenceStop','Detener análisis',()=>A.cancel()],['ygoSequenceExport','Exportar análisis JSON',()=>{if(state.last)download(state.last,'Analisis_Secuencias_Robos.json');}]]){const button=node('button',text);button.type='button';button.id=id;button.disabled=id!=='ygoSequenceStart';button.onclick=safe(fn);probability.append(button);}
 const fileLabel=node('label','Verificar informe JSON '),file=node('input');file.id='ygoSequenceFile';file.type='file';file.accept='.json,application/json';file.onchange=safe(verifyFile);fileLabel.append(file);probability.append(fileLabel);const results=node('div');results.id='ygoSequenceResults';results.setAttribute('aria-live','polite');probability.append(results);panel.append(probability);
 const status=node('p');status.id='ygoRulesStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.tabIndex=-1;panel.append(status);host.append(panel);
 const style=node('style');style.textContent='#ygoRulesWorkbench{margin:12px 0;line-height:1.5}#ygoRulesWorkbench fieldset{min-width:0;border:1px solid #6c9eb9;padding:10px;margin:10px 0}#ygoRulesWorkbench label{display:inline-flex;align-items:center;flex-wrap:wrap;gap:7px;max-width:100%;margin:6px}#ygoRulesWorkbench button,#ygoRulesWorkbench input:not([type=checkbox]),#ygoRulesWorkbench select{min-height:44px;max-width:100%;box-sizing:border-box}#ygoRulesWorkbench input[type=number]{width:105px}.ygo-pendulum-row{display:flex;flex-wrap:wrap;border-bottom:1px solid #376786;padding:6px}#ygoRulesWorkbench p{overflow-wrap:anywhere}#ygoRulesWorkbench summary{cursor:pointer}';D.head.append(style);
 W.YGOAccessibility?.registerDisabledReason?.('ygoSequenceStart',()=>!A.report().current?'Inicia un escenario para analizar sus robos.':'Espera a que termine la tarea actual.');W.YGOAccessibility?.registerDisabledReason?.('ygoSequenceStop','No hay un análisis de secuencias en curso.');W.YGOAccessibility?.registerDisabledReason?.('ygoSequenceExport','Primero completa o verifica un análisis del escenario actual.');
 W.addEventListener('ygo-advanced-workbench-updated',paint);W.addEventListener('ygo-ui-state-updated',paint);W.addEventListener('ygo-combo-workbench-updated',paint);invalidate();paint();
}
W.YGORulesWorkbench=Object.freeze({ready,analyze,applyModes,verifyFile,refresh:paint,get lastReport(){return state.last?copy(state.last):null;},get isBusy(){return state.busy;}});
async function initialize(){try{await A.ready;await C.ready;mount();resolveReady(true);}catch(error){console.error('RULES_WORKBENCH_INIT',error);resolveReady(false);}}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
})();
