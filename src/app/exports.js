/* Exports use the current evaluated state; shared decks are re-evaluated. */
(()=>{'use strict';
const W=window,D=document;
const zones=['main','extra','side','skills'];
const notify=message=>W.toast?.(message);
function current(){const e=W.YGOUIState?.getEvaluation?.();if(!e)throw Error('Calcula la baraja actual antes de exportar su evaluación.');return e;}
function compact(){return{schema:'ygo-shared-deck-v1',name:D.getElementById('name')?.value||'Baraja compartida',fmt:D.querySelector('.fmt.active')?.dataset.f||'TCG',arch:D.getElementById('arch')?.value||'',date:D.getElementById('date')?.value||'',formatContext:W.YGOUIState.getFormatContext(),deckState:Object.fromEntries(zones.map(z=>[z,(W.deckState?.[z]||[]).map(c=>({id:Number(c.id??c.cardId),qty:Number(c.qty??1)}))]))};}
function encode(value){const bytes=new TextEncoder().encode(JSON.stringify(value));let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary);}
function decode(value){if(typeof value!=='string'||value.length>300000)throw Error('El enlace de baraja supera el límite admitido.');const bytes=Uint8Array.from(atob(value),c=>c.charCodeAt(0));return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}
async function importShared(value){
 const validated=W.YGOUIState.validateSession(value);
 if(W.YGOUIState.needsFormatAdapter(validated)){const result=await W.YGOUIState.applyDeckSnapshot(validated);notify('Baraja compartida recuperada con sus zonas y contexto; revisa los datos pendientes del formato.');return result;}
 const format=String(validated.fmt||'TCG'),button=[...D.querySelectorAll('.fmt')].find(b=>b.dataset.f===format);
 if(!button)throw Error('Formato compartido no reconocido.');
 const text=z=>validated.deckState[z].flatMap(c=>Array(Number(c.qty??1)).fill(String(c.id??c.cardId))).join('\n');
 const ydk='#main\n'+text('main')+'\n#extra\n'+text('extra')+'\n!side\n'+text('side')+'\n';
 // Preserve the existing local session before accepting an explicit shared deck.
 const previous=localStorage.getItem(W.YGOUIState.sessionKey);if(previous)localStorage.setItem('ygoDeckSessionPreviousV1',previous);
 const old=D.querySelector('.fmt.active'),oldContext=W.YGOUIState.getFormatContext();if(old!==button)button.click();if(validated.formatContext)W.YGOUIState.setFormatContext(validated.formatContext);
 const result=await W.YGOApp.ydk.importText(ydk,String(validated.name||'Baraja compartida'));
 if(result?.error||result?.cancelled){if(old&&old!==button)old.click();W.YGOUIState.setFormatContext(oldContext);throw Error(result?.error||'Importación no completada.');}
 W.YGOUIState.sync();notify('Baraja compartida importada y recalculada con los datos actuales.');return result;
}
async function share(){
 try{
  const payload=compact();W.YGOUIState.validateSession(payload);if(!payload.deckState.main.length)throw Error('Añade cartas antes de compartir la baraja.');
  const url=location.href.split('#')[0]+'#baraja='+encode(payload);history.replaceState(null,'',url);
  let copied=false;try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);copied=true}}catch(_){}
  notify(copied?(location.protocol==='file:'?'Baraja copiada. El destinatario debe tener esta calculadora para abrir el fragmento.':'Enlace de baraja copiado.'):'La baraja está en la dirección actual; puedes copiarla o exportarla en JSON.');return url;
 }catch(e){notify(String(e?.message||e));return null;}
}
function exportImage(){
 try{
  const e=current(),canvas=D.createElement('canvas');canvas.width=1200;canvas.height=900;const x=canvas.getContext('2d');
  x.fillStyle='#031020';x.fillRect(0,0,1200,900);x.strokeStyle='#00d2ff';x.lineWidth=3;x.strokeRect(20,20,1160,860);
  x.textAlign='center';x.fillStyle='#ffffff';x.font='bold 30px Arial';x.fillText('ANÁLISIS ESTRUCTURAL DE BARAJA',600,65);
  x.font='22px Arial';x.fillStyle='#ffe786';x.fillText((D.getElementById('name')?.value||'Baraja').slice(0,75),600,105);
  x.font='bold 60px Arial';x.fillStyle='#5de6ff';x.fillText(e.total+' / 100',600,180);
  x.font='bold 26px Arial';x.fillStyle='#ffffff';x.fillText(e.tier||'PROVISIONAL',600,225);
  x.font='18px Arial';x.fillStyle=e.legal===false?'#ffb0ad':'#e0eaff';x.fillText(e.legal===false?'Baraja no apta: puntuación diagnóstica.':'Puntuación provisional; no acredita un tier competitivo.',600,265);
  const names=['Consistencia','Potencia ofensiva','Resiliencia','Control del campo','Comienzo','Mitad','Final','Interacción','Acceso adicional','Versatilidad'];
  x.textAlign='left';names.forEach((name,i)=>{const y=325+i*43;x.font='bold 18px Arial';x.fillStyle='#ffffff';x.fillText(name,65,y);x.fillText(e.stats[i]+'/10',470,y);x.fillStyle='#102c46';x.fillRect(560,y-16,550,17);x.fillStyle='#20a4e0';x.fillRect(560,y-16,55*e.stats[i],17);});
  x.font='16px Arial';x.fillStyle='#c1d7ea';const ui=W.YGOUIState.last;x.fillText(`${ui.format} · ${ui.counts.main} Main · ${ui.counts.extra} Extra · ${ui.counts.side} Side`,65,810);
  x.fillText('Las probabilidades de acceso no prueban combos ni resultados de duelo.',65,840);
  const a=D.createElement('a');a.download='analisis-baraja.png';a.href=canvas.toDataURL('image/png');a.click();notify('Imagen exportada con la evaluación y avisos actuales.');return true;
 }catch(e){notify(String(e?.message||e));return false;}
}
W.YGOExports=Object.freeze({compact,encode,decode,importShared,share,exportImage});
async function install(){await W.__YGO_ENGINE_READY;await W.YGOUIState?.ready;W.share=share;W.exportImage=exportImage;
 const value=location.hash.startsWith('#baraja=')?location.hash.slice(8):location.hash.startsWith('#deck=')?location.hash.slice(6):null;
 if(value)try{await importShared(decode(value))}catch(e){notify('No se pudo abrir la baraja del enlace: '+String(e?.message||e));}
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>install().catch(e=>console.error('EXPORT_INIT',e)),{once:true});else install().catch(e=>console.error('EXPORT_INIT',e));
})();
