/* Separate inspection of weighted hypothetical continuations. No laboratory
 * action, observed draw or deck-order change is performed by this panel. */
(()=>{'use strict';
const W=window,D=document,X=W.YGODrawContinuation,A=W.YGOAdvancedWorkbench;
if(!X?.analyze||!A?.report)throw Error('DRAW_CONTINUATION_WORKBENCH_DEPENDENCIES_REQUIRED');
const clone=x=>structuredClone(x),stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const S={result:null,binding:null,busy:false,controller:null,generation:0};
const $=id=>D.getElementById(id),node=(tag,text)=>{const e=D.createElement(tag);if(text!==undefined)e.textContent=String(text);return e;};
let resolveReady;const ready=new Promise(resolve=>resolveReady=resolve);
const source=()=>A.report();
const binding=raw=>stable({buildId:raw.buildId,context:raw.context,goal:raw.goal,initial:raw.initial,current:raw.current,scenario:raw.scenario});
function message(text){if($('ygoDrawContinuationStatus'))$('ygoDrawContinuationStatus').textContent=text;}
function busy(value){S.busy=value;const host=$('ygoDrawContinuation');if(!host)return;host.setAttribute('aria-busy',String(value));for(const e of host.querySelectorAll('input,button'))e.disabled=value;$('ygoDrawContinuationCancel').disabled=!value;$('ygoDrawContinuationExport').disabled=value||!S.result;}
function mutable(){if(S.busy||A.isBusy||W.YGOComboWorkbench?.isBusy)throw Error('Espera a que termine o cancela el análisis actual.');}
function explain(error){const value=String(error?.message||error);if(/SIZE|too large/i.test(value))return'El informe supera el tamaño admitido.';if(/CANCEL/.test(value))return'Análisis cancelado. La partida no ha cambiado.';if(/STALE|CONTEXT|MISMATCH/.test(value))return'El informe no corresponde a la partida, el objetivo o los datos actuales.';if(/LIMIT/.test(value))return'Revisa los límites de exploración y tiempo.';return'Este análisis requiere tu Draw Phase después de un barajado verificado, con el rival pasando y sin un robo real ejecutable. Completa la guía «Después de barajar».';}
function invalidate(){if(S.binding===null)return;let next;try{next=binding(source());}catch(_){next=null;}if(next===S.binding)return;S.controller?.abort();S.generation++;S.result=null;S.binding=null;render();message('Análisis descartado: cambió la partida, el objetivo o el contexto. Vuelve a analizar el estado actual.');}
function fraction(value){return value.numerator+'/'+value.denominator;}
const percent=value=>(100*value).toLocaleString('es',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
function actionLabel(action){
 const state=action.before,E=W.YGOComboEngine,uid=action.sourceUid||action.attackerUid;
 const item=uid&&E.helpers.locate(state,uid)?.item,card=item&&E.helpers.card(item),name=card?.name||'';
 if(action.type==='DUEL_ADVANCE_PHASE')return'Pasar a '+({STANDBY:'Standby Phase','MAIN 1':'Main Phase 1',BATTLE:'Battle Phase','MAIN 2':'Main Phase 2',END:'End Phase'}[action.toPhase]||'la fase indicada');
 if(['NORMAL_SUMMON','DUEL_NORMAL_SUMMON_OR_SET'].includes(action.type))return(action.position==='SET'?'Colocar ':'Invocar normalmente ')+name;
 if(action.type==='DUEL_SET_SPELL_TRAP')return'Colocar '+name;
 if(action.type==='DUEL_ATTACK')return'Atacar con '+name;
 if(action.type==='DECLINE_OPTIONAL_TRIGGER')return'Declinar el efecto opcional de '+name;
 const labels={ALEISTER_SEARCH:'Buscar Invocation con Aleister',MOYE_TOKEN:'Crear el Token de Mo Ye',MOYE_DRAW:'Resolver el robo de Mo Ye',CHIXIAO_SEARCH:'Buscar con Chixiao',SYNCHRO_CHIXIAO:'Invocar a Chixiao por Synchro',SYNCHRO_CHENGYING:'Invocar a Chengying por Synchro',ACTIVATE_COMPULSORY_EVACUATION_DEVICE:'Activar Compulsory Evacuation Device',ACTIVATE_INFINITE_IMPERMANENCE:'Activar Infinite Impermanence'};
 return labels[action.type]||(name?'Resolver la acción registrada de '+name:'Resolver la acción registrada indicada');
}
function render(){const host=$('ygoDrawContinuationResults');if(!host)return;host.replaceChildren();$('ygoDrawContinuationExport').disabled=S.busy||!S.result;if(!S.result)return;
 const r=S.result,s=r.summary;const summary=node('p',`Objetivo verificado: ${fraction(s.successWeight)} (${percent(s.identificationInterval.low)}). Masa desconocida: ${fraction(s.unknownWeight)}. Intervalo del objetivo: ${percent(s.identificationInterval.low)}–${percent(s.identificationInterval.high)}.`);summary.id='ygoDrawContinuationSummary';host.append(summary,node('p','Cada copia restante pesa 1/'+s.remainingCopies+'. El rival pasa sin responder. Las posibilidades sin testigo permanecen desconocidas; este intervalo no es una tasa de victoria.'));
 const list=node('ul');list.id='ygoDrawContinuationBranches';
 for(const branch of r.branches){const row=node('li');row.style.overflowWrap='anywhere';row.append(node('p',`${branch.name} · ${fraction(branch.weight)} · ${branch.status==='GOAL_WITNESS'?'objetivo verificado en esta hipótesis':'continuación desconocida'}`));
  if(branch.witness){const details=node('details');details.append(node('summary','Ver continuación hipotética'));details.append(node('p','Supuesto: esta copia se roba de un Deck barajado uniformemente. No se ha robado en la partida.'));
   if(!branch.witness.actions.length)details.append(node('p','El objetivo se cumple con este robo hipotético, sin acciones posteriores.'));
   else{const steps=node('ol');for(const action of branch.witness.actions)steps.append(node('li',actionLabel(action)));details.append(steps);}
   details.append(node('p','Continuación verificada de nuevo desde la partida de origen y el supuesto de robo. El resto del Deck conserva orden desconocido.'));row.append(details);
  }else row.append(node('p','No se ha verificado una continuación dentro de los límites declarados. No significa derrota.'));
  list.append(row);
 }
 host.append(list);}
function values(){return{maxDepth:Number($('ygoDrawContinuationDepth').value),maxStates:Number($('ygoDrawContinuationStates').value),maxMs:Math.round(Number($('ygoDrawContinuationSeconds').value)*1000)};}
async function analyze(options={}){await ready;mutable();const raw=source();let normalized;try{normalized=X.validateSource(raw);}catch(error){message(explain(error));return{pass:false,status:'SOURCE_NOT_ELIGIBLE'};}
 S.binding=binding(raw);S.result=null;S.controller=new AbortController();const generation=++S.generation;busy(true);render();message('Analizando posibilidades bajo barajado uniforme. La partida se conserva.');
 try{const limits={...values(),...Object.fromEntries(Object.entries(options).filter(([key])=>['maxDepth','maxStates','maxMs','maxStatesPerBranch','maxBranches'].includes(key)))};
  const result=await X.analyze(normalized,{...limits,signal:S.controller.signal,onProgress:p=>{if(generation===S.generation)message(`Analizando la posibilidad ${p.currentBranch} de ${p.totalBranches}.`);}});
  if(generation!==S.generation||binding(source())!==S.binding){return{pass:false,status:'STALE_SOURCE_CANCELLED'};}
  if(!result.pass){message(explain(result.status));return clone(result);}
  const checked=X.verify(result,{source:raw});if(!checked.pass)throw Error('DRAW_CONTINUATION_CONTEXT_MISMATCH');S.result=checked.report;render();message('Análisis hipotético terminado. La partida y el orden desconocido no han cambiado.');return clone(S.result);
 }catch(error){if(generation===S.generation)message(explain(error));return{pass:false,status:'HYPOTHETICAL_ANALYSIS_REJECTED'};}
 finally{S.controller=null;busy(false);}
}
function cancel(){S.controller?.abort();message('Cancelando el análisis. La partida no cambia.');}
async function loadReport(value){await ready;mutable();try{const raw=source(),checked=X.verify(value,{source:raw});if(!checked.pass){message('No importado: el informe no supera la verificación de la partida, sus pesos y sus continuaciones.');return{pass:false,status:checked.status};}S.result=checked.report;S.binding=binding(raw);render();message('Informe hipotético verificado. La partida real no ha cambiado.');return{pass:true,status:checked.status,report:clone(S.result)};}catch(error){message('No importado: '+explain(error));return{pass:false,status:'HYPOTHETICAL_REPORT_REJECTED'};}}
function downloadReport(){mutable();invalidate();if(!S.result)throw Error('Analiza o verifica un informe antes de guardarlo.');const checked=X.verify(S.result,{source:source()});if(!checked.pass)throw Error('DRAW_CONTINUATION_CONTEXT_MISMATCH');const url=URL.createObjectURL(new Blob([JSON.stringify(checked.report)],{type:'application/json'})),a=node('a');a.href=url;a.download='Continuaciones_hipoteticas_YuGiOh.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return clone(checked.report);}
function mount(){const host=$('ygoAdvancedWorkbench');if(!host||$('ygoDrawContinuation'))return;const panel=node('details');panel.id='ygoDrawContinuation';panel.append(node('summary','Continuaciones hipotéticas después de barajar'),node('p','Analiza un próximo robo de tu turno después de barajar, con el rival pasando. Cada posibilidad usa una copia física del Deck y conserva su peso. Este panel no ejecuta robos en la partida.'));
 const controls=node('div');controls.className='ygo-advanced-controls';
 for(const [id,label,min,max,step,value]of [['ygoDrawContinuationDepth','Máximo de acciones después del robo ',0,12,1,4],['ygoDrawContinuationStates','Límite de estados explorados ',1,5000,1,1200],['ygoDrawContinuationSeconds','Tiempo máximo en segundos ',0.05,30,0.05,6]]){const l=node('label',label),input=node('input');input.id=id;input.type='number';input.min=String(min);input.max=String(max);input.step=String(step);input.value=String(value);l.append(input);controls.append(l);}
 const run=node('button','Analizar continuaciones');run.id='ygoDrawContinuationAnalyze';run.type='button';run.onclick=()=>analyze().catch(error=>message(explain(error)));
 const stop=node('button','Cancelar análisis');stop.id='ygoDrawContinuationCancel';stop.type='button';stop.disabled=true;stop.onclick=cancel;
 const save=node('button','Guardar informe hipotético');save.id='ygoDrawContinuationExport';save.type='button';save.disabled=true;save.onclick=()=>{try{downloadReport();}catch(error){message(explain(error));}};
 const label=node('label','Verificar informe hipotético '),file=node('input');file.id='ygoDrawContinuationImport';file.type='file';file.accept='.json,application/json';label.append(file);file.onchange=async()=>{const selected=file.files?.[0];if(!selected)return;try{if(selected.size>8*1024*1024)throw Error('REPORT_SIZE_LIMIT');await loadReport(await selected.text());}catch(error){message('No importado: '+explain(error));}finally{file.value='';}};
 controls.append(run,stop,save,label);const status=node('p','Completa la guía «Después de barajar» para llegar a tu próximo robo desconocido.');status.id='ygoDrawContinuationStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');const results=node('div');results.id='ygoDrawContinuationResults';panel.append(controls,status,results);host.append(panel);
 for(const event of ['ygo-advanced-workbench-updated','ygo-combo-workbench-updated','ygo-combo-goal-updated','ygo-combo-scenario-updated','ygo-ui-state-updated'])W.addEventListener(event,invalidate);
}
W.YGODrawContinuationWorkbench=Object.freeze({ready,analyze,cancel,loadReport,downloadReport,report:()=>S.result?clone(S.result):null,get isBusy(){return S.busy;}});
Promise.resolve(W.__YGO_ENGINE_READY).then(async()=>{await A.ready;mount();resolveReady(true);}).catch(error=>{console.error('DRAW_CONTINUATION_WORKBENCH_INIT',error);resolveReady(false);});
})();
