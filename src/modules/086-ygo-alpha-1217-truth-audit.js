(()=>{'use strict';
/* Alpha 1217: auditoría conservadora de resultados, sin reclamar cobertura universal.
   No altera la disposición visual ni la ruta de simulación existente. */
const W=window, V='Alpha 1217';
const isInt=n=>Number.isSafeInteger(n), arr=v=>Array.isArray(v)?v:[];
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const FAIL=(status,issues)=>({version:V,status,pass:false,certified:false,globalOptimalityProven:false,issues});
function auditScore1217(result){
 const issues=[];
 if(!result||typeof result!=='object')return FAIL('SCORE_MISSING_1217',['No hay resultado evaluable']);
 if(!Array.isArray(result.scores)||result.scores.length!==10)issues.push('Se requieren exactamente diez categorías');
 else if(!result.scores.every(n=>isInt(n)&&n>=0&&n<=10))issues.push('Cada categoría debe ser un entero de 0 a 10');
 const sum=arr(result.scores).reduce((a,n)=>a+(isInt(n)?n:0),0);
 if(!isInt(result.total)||result.total!==sum)issues.push('Total inconsistente con la suma');
 if(own(result,'finalScore')&&result.finalScore!==sum)issues.push('Puntuación final inconsistente');
 return {version:V,status:issues.length?'SCORE_UNVERIFIED_1217':'SCORE_ARITHMETIC_VALID_1217',pass:!issues.length,certified:false,competitiveCalibrationProven:false,total:sum,issues};
}
function auditSearch1217(result){
 const issues=[];
 if(!result||typeof result!=='object')return FAIL('SEARCH_MISSING_1217',['Falta la respuesta']);
 if(result.certified===true)issues.push('Una búsqueda aislada no demuestra certificación universal');
 if(result.globalOptimalityProven===true)issues.push('No hay prueba de optimalidad global');
 if(!Array.isArray(result.candidates))issues.push('Falta el arreglo de candidatos');
 if(own(result,'candidateCount')&&(!isInt(result.candidateCount)||result.candidateCount<0))issues.push('candidateCount inválido');
 if(Array.isArray(result.candidates)&&own(result,'candidateCount')&&result.candidateCount!==result.candidates.length)issues.push('La cantidad declarada no coincide con candidatos');
 if(result.openingSample1216!==undefined&&(!isInt(result.openingSample1216)||result.openingSample1216<0||result.openingSample1216>9))issues.push('Muestra inicial fuera de 0–9');
 return {version:V,status:issues.length?'SEARCH_UNVERIFIED_1217':'SEARCH_SHAPE_VALID_1217',pass:!issues.length,certified:false,globalOptimalityProven:false,candidateCount:arr(result.candidates).length,issues};
}
function auditDeck1217(deck=W.deckState){
 const issues=[], zones=['main','extra','side'];
 if(!deck||typeof deck!=='object')return FAIL('DECK_MISSING_1217',['Baraja ausente']);
 const counts={};
 for(const z of zones){const cards=deck[z]; if(!Array.isArray(cards)){issues.push(z+' no es una lista');counts[z]=null;continue;}
  counts[z]=cards.length;
  if(cards.some(c=>c===null||c===undefined))issues.push(z+' contiene cartas vacías');
 }
 if(counts.main!==null&&(counts.main<40||counts.main>60))issues.push('Main Deck fuera de 40–60 cartas');
 if(counts.extra!==null&&counts.extra>15)issues.push('Extra Deck supera 15 cartas');
 if(counts.side!==null&&counts.side>15)issues.push('Side Deck supera 15 cartas');
 return {version:V,status:issues.length?'DECK_UNVERIFIED_1217':'DECK_COUNTS_VALID_1217',pass:!issues.length,certified:false,counts,issues,
  limitations:'No prueba identidad oficial de cartas, legalidad de formato ni restricciones por nombre.'};
}
function auditTop5Claim1217(lines){
 if(!Array.isArray(lines))return FAIL('TOP5_MISSING_1217',['No existe una lista de combos']);
 const issues=[];if(lines.length!==5)issues.push('No hay exactamente cinco líneas');
 for(let i=0;i<lines.length;i++){const x=lines[i];if(!x||typeof x!=='object'||x.certified!==true||x.globalOptimalityProven!==true)issues.push('Línea '+(i+1)+' sin certificación de legalidad y optimalidad global');}
 return {version:V,status:issues.length?'TOP5_NOT_PROVEN_1217':'TOP5_CLAIMS_PRESENT_UNVERIFIED_1217',pass:false,certified:false,globalOptimalityProven:false,issues,
  limitations:'Las banderas proporcionadas por líneas no constituyen pruebas independientes.'};
}
W.YGOAlpha1217=Object.freeze({version:V,auditScore1217,auditSearch1217,auditDeck1217,auditTop5Claim1217,certified:false,
 policy:'Auditoría estructural conservadora. No certifica simulador universal, ranking competitivo ni Top 5.'});
})();