(()=>{'use strict';
/* Alpha 1218: comprobación cruzada de la procedencia de apertura 1216 y salida de búsqueda; auditoría, no sustitución de reglas. */
const V='Alpha 1218',W=window, own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const integer=x=>Number.isSafeInteger(x);
function fail(code,issues){return {version:V,status:code,pass:false,certified:false,globalOptimalityProven:false,issues};}
function auditOpeningSearch1218(result, expected={}){
 if(!result||typeof result!=='object'||Array.isArray(result))return fail('OPENING_RESULT_MISSING_1218',['Resultado ausente']);
 if(!expected||typeof expected!=='object'||Array.isArray(expected))return fail('EXPECTED_INPUT_INVALID_1218',['Parámetros esperados inválidos']);
 const problems=[],e=result.openingEvidence1216;
 if(!e||typeof e!=='object'||Array.isArray(e))problems.push('Sin evidencia de apertura 1216');
 if(result.openingProvenance1216!=='IMPORTED_OPENING_PROVEN_1216')problems.push('Procedencia de apertura no confirmada');
 if(!integer(result.openingSample1216)||result.openingSample1216<0||result.openingSample1216>9)problems.push('Índice de mano inválido');
 if(own(expected,'sample')&&result.openingSample1216!==expected.sample)problems.push('Muestra no coincide con la solicitada');
 if(e){
  if(!integer(e.mainCopies)||e.mainCopies<40||e.mainCopies>60)problems.push('Main Deck fuera de rango');
  if(e.handCopies!==5)problems.push('La apertura no tiene cinco cartas');
  if(!integer(e.remainingDeckCopies)||e.remainingDeckCopies!==e.mainCopies-5)problems.push('Conservación de copias del Main incumplida');
  if(!integer(e.extraCopies)||e.extraCopies<0||e.extraCopies>15)problems.push('Extra Deck fuera de rango');
  if(typeof e.deckFingerprint!=='string'||!e.deckFingerprint)problems.push('Huella de baraja ausente');
  if(!integer(e.deckRevision)||e.deckRevision<0)problems.push('Revisión inválida');
  if(e.source!=='YGOAlpha655.openingState655 + equality against imported deckState Main/Extra')problems.push('Origen de mano inesperado');
  if(e.opponentSource!=='USER_EXPLICIT_OPPONENT_ZONES')problems.push('No hay rival explícito');
  if(e.certified!==false)problems.push('Evidencia con certificación indebida');
  if(own(expected,'deckFingerprint')&&e.deckFingerprint!==expected.deckFingerprint)problems.push('La baraja cambió');
  if(own(expected,'deckRevision')&&e.deckRevision!==expected.deckRevision)problems.push('La revisión de baraja cambió');
 }
 if(result.certified===true||result.globalOptimalityProven===true)problems.push('Reclamación de certificación u optimalidad universal sin prueba');
 if(!Array.isArray(result.candidates))problems.push('Candidatos ausentes');
 if(own(result,'candidateCount')&&(!integer(result.candidateCount)||!Array.isArray(result.candidates)||result.candidateCount!==result.candidates.length))problems.push('candidateCount inconsistente');
 if(Array.isArray(result.candidates)&&result.candidates.some(c=>!c||typeof c!=='object'||Array.isArray(c)))problems.push('Candidato no estructurado');
 return {version:V,status:problems.length?'OPENING_SEARCH_EVIDENCE_INVALID_1218':'OPENING_SEARCH_EVIDENCE_CONSISTENT_1218',pass:!problems.length,certified:false,globalOptimalityProven:false,issues:problems,candidateCount:Array.isArray(result.candidates)?result.candidates.length:0,
 limitations:'Consistencia y procedencia declarada solamente; no certifica legalidad de efectos ni optimalidad de combos.'};
}
W.YGOAlpha1218=Object.freeze({version:V,auditOpeningSearch1218,certified:false});
})();