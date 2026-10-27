(()=>{'use strict';
const W=window;
const arr=v=>Array.isArray(v)?v:[];
function probabilityReport(deck=W.deckState,options={}){
 const engine=W.YGOProbability;if(!engine)return{status:'ENGINE_NOT_READY',pass:false};
 const main=arr(deck?.main),copies=main.reduce((n,c)=>n+Math.max(0,Number(c.qty??1)||0),0);
 if(copies<5)return{status:'INSUFFICIENT_MAIN_COPIES',pass:false,copies,definitions:engine.definitions};
 const trials=Math.max(100,Math.min(10000,Number(options.trials)||1500));
 const events=engine.probabilityModel(main),sampling=engine.openingMonteCarlo(main,trials);
 const rows=main.map(c=>{const s=engine.semantic(c);return{id:c.id,name:c.name,qty:c.qty??1,classification:s.classificationStatus,
  roles:Object.fromEntries(['starter','extender','interaction','search','draw','recover'].map(k=>[k,s[k]===1])),
  starterStatus:s.starterStatus,requirements:s.requirements,evidence:s.evidence,limitations:s.limitations}});
 return{schema:'ygo-probability-report-v1',status:'PROVISIONAL_ROLE_ACCESS',pass:true,
  certified:false,comboSuccessMeasured:false,copies,physicalCountValid:copies>=40&&copies<=60,
  definitions:engine.definitions,events,sampling,rows,
  context:{format:String(W.__YGO_ACTIVE_BAN_KEY||'tcg'),model:engine.version,draws:[5,6,7]},
  limitations:['Role access is not legal combo completion.','Candidate opening access is a structural classification, conditioned on the actual deck.','The Monte Carlo event is a role-access proxy. Opponent responses and complete duel outcomes are not measured.']};
}
function exportProbabilityReport(options={}){
 const report=probabilityReport(W.deckState,options),blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='YuGiOh_Probabilidades_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return report;
}
W.YGOEvaluation=Object.freeze({revision:'2026.10-stable.1',probabilityReport,exportProbabilityReport,
 calibrationTemplate:()=>W.YGOAlpha984?.calibrationTemplate984?.(),
 calibrationStatus:()=>W.YGOAlpha984?.calibrationStatus984?.(),
 importCalibration:(rows,opts)=>W.YGOAlpha984?.importCalibration984?.(rows,opts)});
})();
