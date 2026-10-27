
(()=>{'use strict';
const D=document,W=window,EXPECTED_VERSION='Alpha 1263',EXPECTED_FORMAT='ygo-deferred-bundle-v22',PAYLOAD_ID='ygo-deferred-payload-'+EXPECTED_VERSION.replace(/\D/g,'');
let resolveReady;W.__YGO_ENGINE_READY=new Promise(r=>resolveReady=r);
W.__YGO_ENGINE_BOOT={version:EXPECTED_VERSION,bundle:EXPECTED_FORMAT,total:0,done:0,status:'QUEUED',startedAt:null,finishedAt:null,errors:[],current:null,payloadCompressedBytes:0,payloadDecodedBytes:0,moduleTimings:[],evalMs:0,slowModules:[]};
W.__YGO783_BOOT_QUEUE=W.__YGO783_BOOT_QUEUE||[];
W.__YGO785_EXECUTED=W.__YGO785_EXECUTED||new Set();
const __ygo783ExecutedFns=new WeakSet(),__ygo783QueuedFns=new WeakSet();let __ygo783Seq=0;
W.__YGO783_STARTUP={version:EXPECTED_VERSION,queued:W.__YGO783_BOOT_QUEUE.length,done:0,registered:0,skippedDuplicates:0,errors:[],running:false,complete:false,executed:W.__YGO785_EXECUTED.size,absorbedBy:EXPECTED_VERSION+' loader',schedulerContract:'FUNCTION_IDENTITY_V2'};
const sync783=()=>{const q=W.__YGO783_BOOT_QUEUE||[];W.__YGO783_STARTUP={...(W.__YGO783_STARTUP||{}),version:EXPECTED_VERSION,queued:q.length,complete:q.length===0,executed:W.__YGO785_EXECUTED?.size||0,absorbedBy:EXPECTED_VERSION+' loader',schedulerContract:'FUNCTION_IDENTITY_V2'};return W.__YGO783_STARTUP};
W.__YGO783_DEFER_BOOT=(a,b)=>{const fn=typeof a==='function'?a:typeof b==='function'?b:null,label=String(typeof a==='string'?a:typeof b==='string'?b:(fn?.name||'job'));if(!fn)return false;if(__ygo783ExecutedFns.has(fn)||__ygo783QueuedFns.has(fn)){W.__YGO783_STARTUP.skippedDuplicates=(W.__YGO783_STARTUP.skippedDuplicates||0)+1;sync783();return false}const id=label+'#'+(++__ygo783Seq);__ygo783QueuedFns.add(fn);W.__YGO783_STARTUP.registered=(W.__YGO783_STARTUP.registered||0)+1;W.__YGO783_BOOT_QUEUE.push({id,name:label,fn});sync783();return true};
W.__YGO785_FLUSH_STARTUP=()=>{const q=W.__YGO783_BOOT_QUEUE||[];let done=0;W.__YGO783_STARTUP.running=true;while(q.length&&done<64){const j=q.shift();if(!j||typeof j.fn!=='function')continue;__ygo783QueuedFns.delete(j.fn);if(__ygo783ExecutedFns.has(j.fn))continue;__ygo783ExecutedFns.add(j.fn);W.__YGO785_EXECUTED.add(j.id);try{j.fn()}catch(e){(W.__YGO783_STARTUP.errors||(W.__YGO783_STARTUP.errors=[])).push({name:j.name,id:j.id,error:String(e?.message||e)})}done++}W.__YGO783_STARTUP.running=false;W.__YGO783_STARTUP.done=(W.__YGO783_STARTUP.done||0)+done;sync783();if(q.length&&!W.__YGO783_RESUME_PENDING){W.__YGO783_RESUME_PENDING=true;setTimeout(()=>{W.__YGO783_RESUME_PENDING=false;W.__YGO785_FLUSH_STARTUP?.()},0)}return W.__YGO783_STARTUP};

const idle=fn=>setTimeout(()=>fn({didTimeout:true,timeRemaining:()=>0}),0);

// Alpha 1246: diagnostics are available even when startup never reaches READY.
// Read-only public snapshot; it does not change game state, CSS or the loader schedule.
W.__YGO_ENGINE_BOOT.lastProgressAt=Date.now();
W.__YGO_ENGINE_BOOT.lastProgressOrder=0;W.__YGO_ENGINE_BOOT.scheduler='COOPERATIVE_TASK_SLICES_1250';
W.__YGO_BOOT_HEALTH_1263=()=>{
 const b=W.__YGO_ENGINE_BOOT||{}, integrity=W.__YGO_BUNDLE_INTEGRITY||{}, now=Date.now();
 const catalog=Array.isArray(W.CARD_CATALOG)?W.CARD_CATALOG.length:0;
 const appVersion=String(W.YGOAlpha1263?.VERSION||W.YGOApp?.version||'');
 const terminal=['READY','READY_WITH_ERRORS','BUNDLE_ERROR','BUNDLE_INTEGRITY_ERROR'].includes(b.status);
 const waitMs=Math.max(0,now-Number(b.lastProgressAt||b.startedAt||now));
 return {version:EXPECTED_VERSION,status:String(b.status||'UNINITIALIZED'),phase:String(b.current?.phase||b.current?.id||b.status||''),
  total:Number(b.total||0),done:Number(b.done||0),lastProgressOrder:Number(b.lastProgressOrder||0),
  elapsedMs:b.startedAt?Math.max(0,now-b.startedAt):0,waitingMs:waitMs,
  slowLoading:!terminal&&b.startedAt!=null&&waitMs>25000,
  hashesVerified:integrity.pass===true,hashesChecked:Number(b.hashesChecked||integrity.checked||0),hashesTotal:Number(b.hashesTotal||integrity.total||0),hashMode:b.hashMode||'UNKNOWN',
  catalogCount:catalog,catalogReady:catalog>0,apiVersion:appVersion,
  scenarioPanelPresent:!!D.getElementById('alpha1233ScenarioPanel'),
  videoPanelPresent:!!D.getElementById('comboVisualTop5'),
  supportsMediaRecorder:typeof W.MediaRecorder==='function',
  zipExportAvailable:typeof W.YGOAlpha1261?.exportAllBoundedWebm1244==='function',
  bootErrors:(Array.isArray(b.errors)?b.errors:[]).slice(0,4).map(e=>String(e.error||e).slice(0,240)),
  startupQueued:Array.isArray(W.__YGO783_BOOT_QUEUE)?W.__YGO783_BOOT_QUEUE.length:0,
  ready: b.status==='READY'&&integrity.pass===true&&b.done===b.total&&catalog>0&&appVersion===EXPECTED_VERSION};
};
W.__YGO_ENGINE_BOOT_DIAGNOSTICS=W.__YGO_BOOT_HEALTH_1263;

function sha256Local1049(bytes){
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
 const n=bytes.length,full=(n+9+63)&~63,pad=new Uint8Array(full);pad.set(bytes);pad[n]=128;const high=Math.floor(n*8/4294967296),low=(n*8)>>>0;for(let i=0;i<4;i++){pad[full-8+i]=(high>>>(24-i*8))&255;pad[full-4+i]=(low>>>(24-i*8))&255;}
 const w=new Int32Array(64),rotr=(x,n)=>(x>>>n)|(x<<(32-n));
 for(let pos=0;pos<full;pos+=64){for(let i=0;i<16;i++){const j=pos+i*4;w[i]=(pad[j]<<24)|(pad[j+1]<<16)|(pad[j+2]<<8)|pad[j+3]}
  for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(rotr(a,7)^rotr(a,18)^(a>>>3))+w[i-7]+(rotr(b,17)^rotr(b,19)^(b>>>10)))|0}
  let [a,b,c,d,e,f,g,q]=h;
  for(let i=0;i<64;i++){const t1=(q+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[i]+w[i])|0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b)^(a&c)^(b&c)))|0;q=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}
  h=[(h[0]+a)|0,(h[1]+b)|0,(h[2]+c)|0,(h[3]+d)|0,(h[4]+e)|0,(h[5]+f)|0,(h[6]+g)|0,(h[7]+q)|0];
 }
 return h.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');
}
async function sha256Hex1047(text){if(typeof TextEncoder!=='function')throw new Error('BUNDLE_INTEGRITY_TEXT_ENCODER_UNAVAILABLE');const data=new TextEncoder().encode(String(text||''));if(W.crypto?.subtle?.digest){const buf=await W.crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}return sha256Local1049(data)}
async function decodeBundle(){
 const n=D.getElementById(PAYLOAD_ID);if(!n)throw new Error('YGO_DEFERRED_PAYLOAD_MISSING');
 const b64=String(n.textContent||'').replace(/\s+/g,'');W.__YGO_ENGINE_BOOT.payloadCompressedBytes=Math.floor(b64.length*3/4);
 const bin=atob(b64),u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
 if(typeof DecompressionStream!=='function')throw new Error('DECOMPRESSIONSTREAM_UNAVAILABLE');
 const ds=new DecompressionStream('gzip'),stream=new Blob([u8]).stream().pipeThrough(ds);
 const txt=await new Response(stream).text();W.__YGO_ENGINE_BOOT.payloadDecodedBytes=txt.length;
 const pack=JSON.parse(txt);if(pack?.version!==EXPECTED_VERSION||pack?.format!==EXPECTED_FORMAT||!Array.isArray(pack?.chunks))throw new Error('INVALID_YGO_BUNDLE_VERSION_FORMAT');
 const integ=pack?.integrity||{},table=integ?.sha256||{};if(integ.chunkCount!==pack.chunks.length||integ.canonicalId!==('ygo-alpha-'+EXPECTED_VERSION.replace(/\D/g,'')+'-canonical-release')||integ.algorithm!=='SHA-256'||Object.keys(table).length!==pack.chunks.length)throw new Error('INVALID_YGO_BUNDLE_INTEGRITY_HEADER');
 W.__YGO_ENGINE_BOOT.sourceDeferredCalls=pack.chunks.reduce((n,c)=>n+(String(c?.code||'').match(/__YGO783_DEFER_BOOT\s*\(/g)||[]).length,0);const rows=[];
 // Alpha 1247: cooperative integrity preflight. In insecure origins crypto.subtle
 // is unavailable, so a synchronous SHA fallback cannot monopolize the UI for 88 modules.
 const bootHealth=W.__YGO_ENGINE_BOOT;
 bootHealth.status='VERIFYING';bootHealth.hashesTotal=pack.chunks.length;bootHealth.hashesChecked=0;
 bootHealth.hashMode=W.crypto?.subtle?.digest?'WEBCRYPTO':'SHA256_JS_FALLBACK';
 let checkedAt=performance.now();
 for(const c of pack.chunks){const expected=String(table[c.id]||'').toLowerCase();if(!/^[0-9a-f]{64}$/.test(expected))throw new Error('BUNDLE_INTEGRITY_HASH_MISSING:'+String(c.id));const actual=await sha256Hex1047(c.code);const pass=actual===expected;rows.push({id:c.id,order:c.order,pass,expected,actual});
 bootHealth.hashesChecked=rows.length;bootHealth.lastProgressAt=Date.now();
 bootHealth.current={phase:'VERIFYING',order:c.order,id:c.id||null};
 // setTimeout yields an actual macrotask (awaiting a resolved hash promise doesn't).
 // Yield at least every four modules, or after a long hash operation.
 if(!pass){W.__YGO_BUNDLE_INTEGRITY={version:EXPECTED_VERSION,pass:false,status:'HASH_MISMATCH',checked:rows.length,total:pack.chunks.length,rows};throw new Error('BUNDLE_INTEGRITY_HASH_MISMATCH:'+String(c.id))}
 if(rows.length%4===0||performance.now()-checkedAt>14){
   await new Promise(resolve=>setTimeout(resolve,0));checkedAt=performance.now();
 }
 }
 W.__YGO_BUNDLE_INTEGRITY={version:EXPECTED_VERSION,pass:true,status:'PASS',algorithm:'SHA-256',checked:rows.length,total:pack.chunks.length,canonicalId:integ.canonicalId,rows};W.__YGO_ENGINE_BOOT.integrity=W.__YGO_BUNDLE_INTEGRITY;
 return pack.chunks.slice().sort((a,b)=>Number(a.order)-Number(b.order));
}
async function boot(){
 if(W.__YGO_ENGINE_BOOT.startedAt)return;
 W.__YGO_ENGINE_BOOT.startedAt=Date.now();W.__YGO_ENGINE_BOOT.status='DECODING';
 let chunks;try{chunks=await decodeBundle()}catch(e){W.__YGO_ENGINE_BOOT.status=/INTEGRITY|HASH|CRYPTO/.test(String(e?.message||e))?'BUNDLE_INTEGRITY_ERROR':'BUNDLE_ERROR';W.__YGO_ENGINE_BOOT.errors.push({stage:'decode',error:String(e&&e.stack||e)});W.__YGO_ENGINE_BOOT.finishedAt=Date.now();const el=D.getElementById('mainYdkStatus');if(el){el.textContent='No se pudo iniciar el motor: '+String(e?.message||e)+'. Comprueba que el navegador admite JavaScript y descompresión gzip.';el.className='main-ydk-status bad'}resolveReady(W.__YGO_ENGINE_BOOT);return}
 W.__YGO_ENGINE_BOOT.total=chunks.length;W.__YGO_ENGINE_BOOT.preflight={pass:W.__YGO_BUNDLE_INTEGRITY?.pass===true,version:EXPECTED_VERSION,format:EXPECTED_FORMAT,chunkCount:chunks.length,canonicalId:W.__YGO_BUNDLE_INTEGRITY?.canonicalId||null,integrity:W.__YGO_BUNDLE_INTEGRITY};let i=0;
 const finish=()=>{W.__YGO_ENGINE_BOOT.status=W.__YGO_ENGINE_BOOT.errors.length?'READY_WITH_ERRORS':'READY';W.__YGO_ENGINE_BOOT.finishedAt=Date.now();W.__YGO_ENGINE_BOOT.lastProgressAt=Date.now();W.__YGO_ENGINE_BOOT.current=null;D.title='Calculadora_de_Barajas_YuGiOh_Alpha_1263';W.__YGO_ENGINE_BOOT.slowModules=(W.__YGO_ENGINE_BOOT.slowModules||[]).sort((a,b)=>b.ms-a.ms);W.__YGO_ENGINE_AUDIT=()=>({version:EXPECTED_VERSION,status:W.__YGO_ENGINE_BOOT.status,total:W.__YGO_ENGINE_BOOT.total,done:W.__YGO_ENGINE_BOOT.done,evalMs:W.__YGO_ENGINE_BOOT.evalMs,slowModules:(W.__YGO_ENGINE_BOOT.slowModules||[]).slice(0,20),errors:[...(W.__YGO_ENGINE_BOOT.errors||[])],timings:[...(W.__YGO_ENGINE_BOOT.moduleTimings||[])],preflight:W.__YGO_ENGINE_BOOT.preflight});resolveReady(W.__YGO_ENGINE_BOOT);try{W.dispatchEvent(new CustomEvent('ygo-engine-ready',{detail:W.__YGO_ENGINE_BOOT}))}catch(_){}};
 const executeChunk=c=>{W.__YGO_ENGINE_BOOT.status='LOADING';W.__YGO_ENGINE_BOOT.current={order:c.order,id:c.id||null};try{const t0=(W.performance?.now?.()??Date.now()),before=new Set(Object.getOwnPropertyNames(W));(0,eval)(String(c.code||'')+'\n//# sourceURL=ygo-bundle-'+(c.id||c.order)+'.js');const ms=Math.round(((W.performance?.now?.()??Date.now())-t0)*100)/100,added=Object.getOwnPropertyNames(W).filter(k=>!before.has(k)).slice(0,80);W.__YGO_ENGINE_BOOT.evalMs=Math.round((Number(W.__YGO_ENGINE_BOOT.evalMs||0)+ms)*100)/100;W.__YGO_ENGINE_BOOT.moduleTimings.push({order:c.order,id:c.id||null,ms,addedGlobals:added});if(ms>=25)W.__YGO_ENGINE_BOOT.slowModules.push({order:c.order,id:c.id||null,ms});}catch(e){W.__YGO_ENGINE_BOOT.errors.push({order:c.order,id:c.id||null,error:String(e&&e.stack||e)});}W.__YGO_ENGINE_BOOT.done=i;W.__YGO_ENGINE_BOOT.lastProgressOrder=i;W.__YGO_ENGINE_BOOT.lastProgressAt=Date.now();try{W.__YGO785_FLUSH_STARTUP?.()}catch(e){W.__YGO_ENGINE_BOOT.errors.push({stage:'compat783',error:String(e&&e.stack||e)})}};
 const runSlice=deadline=>{if(i>=chunks.length){finish();return}let ran=0;const hasBudget=()=>!deadline||typeof deadline.timeRemaining!=='function'||deadline.timeRemaining()>4;while(i<chunks.length&&ran<4&&(ran===0||hasBudget())){const c=chunks[i++];executeChunk(c);ran++}if(i>=chunks.length){finish();return}idle(runSlice)};
 idle(runSlice);
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>idle(boot),{once:true});else idle(boot);
})();
