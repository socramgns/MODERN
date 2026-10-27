
(function(){
  'use strict';
  const W=window,D=document;
  const STORAGE='ygoDecksV2';
  const names=['CONSISTENCIA','POTENCIA OFENSIVA','RESILIENCIA','CONTROL DEL CAMPO','COMIENZO DEL DUELO','MITAD DEL DUELO','FINAL DEL DUELO','INTERACCIÓN','PODER DE ATRACCIÓN','VERSATILIDAD'];
  const getSaved=()=>{try{const rows=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(rows)?rows.filter(x=>x&&typeof x==='object'):[]}catch{return[]}};
  // Alpha 1119: sólo confirmar una mutación guardada si se puede releer íntegra.
  // Alpha 1123: comprobar que la biblioteca NO cambió entre la lectura y la confirmación.
  // Sólo confirmar una mutación si está basada en el estado que el usuario aprobó.
  function setSaved(a,expectedRaw){
    const before=localStorage.getItem(STORAGE);
    if(arguments.length>1&&before!==expectedRaw)
      throw Error('La biblioteca cambió durante la confirmación. Se canceló el cambio para no perder barajas; vuelve a intentarlo.');
    const after=JSON.stringify(a);
    let failure=null;
    try{
      localStorage.setItem(STORAGE,after);
      if(localStorage.getItem(STORAGE)!==after)throw Error('La escritura no se pudo verificar.');
      return true;
    }catch(e){failure=e}
    try{
      if(before===null)localStorage.removeItem(STORAGE);
      else localStorage.setItem(STORAGE,before);
      if(localStorage.getItem(STORAGE)!==before)
        throw Error('No fue posible restaurar la copia anterior; exporta la biblioteca antes de continuar.');
    }catch(restoreError){
      throw Error('Error al guardar y al recuperar los datos: '+String(restoreError?.message||restoreError));
    }
    throw Error('No se confirmó el cambio; se conservaron los datos anteriores. '+String(failure?.message||failure));
  }
  // Separar lectura de presentación (tolerante) de escritura (sin pérdida de datos).
  // Si el almacenamiento es ilegible o fue modificado, no se sobrescribe silenciosamente.
  // Alpha 1120: IDs históricos numéricos/texto no pueden identificar dos mazos a la vez.
  function savedIdConflicts1120(rows){
    const seen=new Set(), bad=[];
    (Array.isArray(rows)?rows:[]).forEach((d,i)=>{
      const raw=d?.id, id=raw===null||raw===undefined?'':String(raw).trim();
      if(!id||seen.has(id))bad.push(i);
      else seen.add(id);
    });
    return bad;
  }
  function assertSavedIdsUnique1120(rows){
    const bad=savedIdConflicts1120(rows);
    if(bad.length)throw Error('Hay '+bad.length+' identificador(es) ausentes o duplicados en la biblioteca. Usa REPARAR IDS antes de guardar, cargar o eliminar.');
    return rows;
  }
  // Reparación explícita: nunca elimina barajas ni cambia sus nombres o cartas.
  function repairSavedIds1120(){
    let rows;
    try{
      var raw=localStorage.getItem(STORAGE);
      rows=raw===null?[]:JSON.parse(raw);
      if(!Array.isArray(rows)||rows.some(x=>!x||typeof x!=='object'||Array.isArray(x)))throw Error('La biblioteca no es una lista válida.');
    }catch(e){toast('No se puede reparar sin una biblioteca válida: '+String(e?.message||e));return false}
    const bad=savedIdConflicts1120(rows);
    if(!bad.length){toast('Todos los identificadores de la biblioteca son únicos.');return true}
    if(!confirm('Hay '+bad.length+' identificadores ausentes o duplicados. ¿Asignar nuevos IDs solo a esos registros y conservar todas las barajas?'))return false;
    const copy=JSON.parse(JSON.stringify(rows)),used=new Set(copy.map(d=>d?.id===null||d?.id===undefined?'':String(d.id).trim()).filter(Boolean));
    for(const i of bad){
      let next;
      do{next='reparado-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,11)}while(used.has(next));
      copy[i].id=next;used.add(next);
    }
    try{assertSavedIdsUnique1120(copy);setSaved(copy,raw);renderSaved();toast('Identificadores reparados: '+bad.length+'. Se conservaron '+copy.length+' barajas.');return true}
    catch(e){toast('No fue posible reparar la biblioteca: '+String(e?.message||e));return false}
  }
  window.repairSavedIds1120=repairSavedIds1120;
  function validatedHistoricalTotal1120(d){
    const v=d?.v;
    if(!Array.isArray(v)||v.length!==10)return null;
    let sum=0;
    for(const x of v){const n=strictStat1122(x);if(n===null)return null;sum+=n;}
    const r=d?.score;
    const recorded=typeof r==='number'?r:typeof r==='string'&&/^(?:100|[1-9]?\d)$/.test(r.trim())?Number(r.trim()):NaN;
    return !Number.isInteger(recorded)||recorded!==sum?null:sum;
  }
  function readSavedForWrite1112(){
    const raw=localStorage.getItem(STORAGE);
    if(raw===null)return [];
    const value=JSON.parse(raw);
    if(!Array.isArray(value)||value.some(x=>!x||typeof x!=='object'||Array.isArray(x)))
      throw Error('La biblioteca guardada no tiene un formato válido. Conserva los datos para recuperarlos.');
    return assertSavedIdsUnique1120(value);
  }
  // Alpha 1122: todas las vías de persistencia comparten la misma definición
  // estricta de una categoría. No convertir null, booleanos, notación hex,
  // exponentes o valores ausentes en puntos válidos.
  function strictStat1122(x){
    const n=typeof x==='number'?x:typeof x==='string'&&/^(?:10|[0-9])$/.test(x.trim())?Number(x.trim()):NaN;
    return Number.isInteger(n)&&n>=0&&n<=10?n:null;
  }
  // La puntuación sólo puede guardarse para el contenido exacto de la baraja
  // que fue evaluado. Se integra con los repintados canónicos, sin recalcular
  // desde una heurística secundaria ni imponer observadores de toda la página.
  function savedScoreDeckKey(){
    const state=W.deckState;
    if(!state||!['main','extra','side'].every(z=>Array.isArray(state[z])))return null;
    const selected=D.querySelector('.fmt.active')?.getAttribute('data-f')||
      (typeof fmt!=='undefined'?String(fmt):'TCG');
    return JSON.stringify([String(selected).trim().toLowerCase(),...['main','extra','side'].map(z=>
      state[z].map(c=>[String(c?.id??c?.cardId??c?.name??'').trim(),String(c?.name??'').trim(),c?.qty??1])
        .sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))))]);
  }
  let observedScoreDeckKey=null;
  const scoreNode=D.getElementById('score');
  const statNodes=Array.from({length:10},(_,i)=>D.getElementById('sv'+i));
  if(scoreNode&&statNodes.every(Boolean)&&typeof MutationObserver==='function'){
    const watch=new MutationObserver(records=>{
      const touched=node=>records.some(r=>r.target===node||node.contains(r.target));
      if(!touched(scoreNode)||!statNodes.some(touched))return;
      const readTotal=/^(100|[1-9]?\d)\s*\/\s*100$/.exec(String(scoreNode.textContent||'').trim());
      const rows=statNodes.map(n=>/^(10|[0-9])\s*\/\s*10$/.exec(String(n.textContent||'').trim()));
      if(!readTotal||rows.some(x=>!x))return;
      if(rows.reduce((sum,x)=>sum+Number(x[1]),0)!==Number(readTotal[1]))return;
      observedScoreDeckKey=savedScoreDeckKey();
    });
    watch.observe(scoreNode,{childList:true,characterData:true,subtree:true});
    statNodes.forEach(node=>watch.observe(node,{childList:true,characterData:true,subtree:true}));
  }
  function snapshot(){
    const source=Array.isArray(v)?v:[];
    if(source.length!==10)throw Error('La puntuación debe contener exactamente diez estadísticas (0–10). Recalcula la baraja.');
    if(source.map(strictStat1122).some(n=>n===null))throw Error('Existen estadísticas internas ausentes, fraccionarias o fuera de 0–10. Recalcula antes de guardar.');
    // El importador canónico actualiza las 10 celdas y el resultado visible,
    // pero el arreglo histórico `v` puede conservar el mazo previo. No guardar
    // 0/100 cuando la pantalla muestra otro total: confirmar los diez valores
    // realmente presentados, y que el total visible coincide exactamente.
    const values=[];
    for(let i=0;i<10;i++){
      const shown=String(document.getElementById('sv'+i)?.textContent||'').trim();
      const match=/^(10|[0-9])\s*\/\s*10$/.exec(shown);
      if(!match)throw Error('La estadística '+(i+1)+' no tiene un resultado visible verificable. Recalcula.');
      const n=Number(match[1]);values.push(n);
      const control=String(document.getElementById('rv'+i)?.textContent||'').trim();
      if(control&&control!==shown)throw Error('La estadística '+(i+1)+' no coincide entre paneles. Recalcula.');
    }
    const totalMatch=/^(100|[1-9]?\d)\s*\/\s*100$/.exec(String(document.getElementById('score')?.textContent||'').trim());
    if(!totalMatch||Number(totalMatch[1])!==values.reduce((a,b)=>a+b,0))
      throw Error('Las diez estadísticas no coinciden con la puntuación final visible. Recalcula antes de guardar.');
    if(!observedScoreDeckKey||observedScoreDeckKey!==savedScoreDeckKey())
      throw Error('La baraja cambió desde su última evaluación. Pulsa CALCULAR para actualizar los puntos antes de guardar.');
    const d={name:document.getElementById('name')?.value||'Baraja sin nombre',fmt:document.querySelector('.fmt.active')?.dataset.f||(typeof fmt!=='undefined'?fmt:'TCG'),arch:document.getElementById('arch')?.value||'',date:document.getElementById('date')?.value||'',v:values,deckState:JSON.parse(JSON.stringify(deckState||{main:[],extra:[],side:[]}))};
    d.score=values.reduce((a,b)=>a+b,0);
    // Registrar procedencia verificable para NO comparar puntos calculados por
    // motores, catálogos o perfiles de regulación diferentes. Esta firma es
    // administrativa: no certifica reglas ni desempeño competitivo.
    const activeBanKey=String(W.__YGO_ACTIVE_BAN_KEY||'').trim();
    const activeBanProfile=W.BANLIST_PROFILES?.[activeBanKey];
    const uiEvaluation=W.YGOUIState?.getEvaluation?.()||null;
    d.evaluation={stats:[...values],total:d.score,tier:document.getElementById('tier')?.textContent||'SIN CLASIFICAR',
      authority:String(document.documentElement.dataset.scoreAuthority||'NO_EVALUADO'),
      legal:document.documentElement.dataset.scoreLegal==='1'?true:document.documentElement.dataset.scoreLegal==='0'?false:null,
      certified:document.documentElement.dataset.scoreCertified==='1',
      warnings:[document.getElementById('tierDesc')?.textContent||'',document.getElementById('mainYdkStatus')?.textContent||''].filter(Boolean),
      ...(uiEvaluation?{uiEvaluation}:{}),engine:'10-STATS-CANONICAL',
      scoreRevision:'1172-SCORE1048-STRUCTURAL',scoreBuild:String(W.__YGO_TARGET_BUILD||'').trim(),
      scoredFormat:String(d.fmt||'').trim().toUpperCase(),banlistKey:activeBanKey,
      banlistDate:String(activeBanProfile?.date||'').trim(),
      calculatedAt:new Date().toISOString(),databaseUpdatedAt:Math.max(...(window.YGO_DB_SOURCES||[]).map(x=>x.updatedAt||0),0)};
    d.id=Date.now().toString(36)+Math.random().toString(36).slice(2,7);return d;
  }
  function imgFor(c){
    const id=c?.id ?? c?.cardId;
    return id?`https://images.ygoprodeck.com/images/cards/${encodeURIComponent(id)}.jpg`:'';
  }
  function cardByName(name){
    try{return (typeof mergedCardDB==='function'?mergedCardDB():typeof allCards==='function'?allCards():[]).find(c=>c.name===name)}catch{return null}
  }
  function cardObj(c){
    if(Array.isArray(c)){const o=cardByName(c[0]);return o||{name:c[0],type:c[1],attribute:c[2],role:c[3]}}
    return c||{};
  }
  function thumb(c){const o=cardObj(c),url=imgFor(o),label=esc(o.name||'Carta');return url?`<img class="card-thumb" loading="lazy" src="${url}" alt="${label}" onerror="this.onerror=null;this.outerHTML='<div class=&quot;card-thumb-placeholder&quot;>SIN IMAGEN</div>'">`:`<div class="card-thumb-placeholder">${label}</div>`}
  function renderCatalogClean(){
    const host=document.getElementById('catalog');if(!host)return;
    const q=(document.getElementById('cardSearch')?.value||'').toLowerCase(),t=document.getElementById('cardType')?.value||'',r=document.getElementById('cardRole')?.value||'';
    const base=typeof mergedCardDB==='function'?mergedCardDB():typeof allCards==='function'?allCards():[];
    let a=base.filter(c=>(!q||[c.name,c.type,c.attribute,c.role,c.text,c.archetype].join(' ').toLowerCase().includes(q))&&(!t||c.type===t)&&(!r||c.role===r));
    if(!a.length)a=CARD_CATALOG.filter(c=>{const o=Array.isArray(c)?{name:c[0],type:c[1],attribute:c[2],role:c[3]}:c;return (!q||[o.name,o.type,o.attribute,o.role,o.desc].join(' ').toLowerCase().includes(q))&&(!t||o.type===t)&&(!r||o.role===r)}).map(c=>Array.isArray(c)?{name:c[0],type:c[1],attribute:c[2],role:c[3]}:c);
    const shown=a.slice(0,180).map(cardObj);
    host.innerHTML=shown.map(o=>`<div class="card-item catalog-draggable" draggable="true">${thumb(o)}<div class="card-info"><div class="card-name">${esc(o.name)}</div><div class="card-meta">${esc(o.type||'Carta')} · ${esc(o.attribute||'—')} · ${esc(o.role||'Utility')}</div></div><span class="qty">${typeof countCard==='function'?countCard(o.name):0}</span><button type="button" class="icon-btn ygo-catalog-add">＋</button></div>`).join('')||'<div class="tiny" style="padding:10px">No se encontraron cartas.</div>';
    host.querySelectorAll('.catalog-draggable').forEach((node,i)=>{
      const card=shown[i];
      node.addEventListener('click',ev=>{if(ev.target.closest('button'))return;selectCardDetail(card.name)});
      node.addEventListener('dragstart',ev=>{selectCardDetail(card.name);catalogDragStart(ev,card.name)});
      node.querySelector('.ygo-catalog-add')?.addEventListener('click',ev=>{ev.stopPropagation();addCardFromFinal(card.name)});
    });
  }
  let dragDeckCard=null,dragDropHandled=false;
  function removeOneCard(zone,index){invalidateDeckAnalysis();const z=deckState?.[zone]||[],c=z[index];if(!c)return;if((+c.qty||1)>1)c.qty--;else z.splice(index,1);(window.renderAllAdvanced?window.renderAllAdvanced():renderAllAdvanced())}
  function deckDragStart(ev,zone,index,copy){dragDeckCard={zone,index,copy};dragDropHandled=false;ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',JSON.stringify({kind:'deck-card',zone,index,copy}));ev.currentTarget.classList.add('dragging')}
  function deckDragEnd(ev){ev.currentTarget.classList.remove('dragging');if(!dragDeckCard)return;const host=document.getElementById('deckList'),r=host?.getBoundingClientRect(),inside=r&&ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom;if(!inside&&!dragDropHandled&&['main','extra','side'].includes(dragDeckCard.zone))removeOneCard(dragDeckCard.zone,dragDeckCard.index);dragDeckCard=null}
  function catalogDragStart(ev,name){dragDropHandled=false;ev.dataTransfer.effectAllowed='copy';ev.dataTransfer.setData('text/plain',JSON.stringify({kind:'catalog-card',name}))}
  function deckDragOver(ev){ev.preventDefault();ev.dataTransfer.dropEffect='move';ev.currentTarget.classList.add('drop-target')}
  function deckDragLeave(ev){ev.currentTarget.classList.remove('drop-target')}
  function deckDrop(ev){ev.preventDefault();ev.currentTarget.classList.remove('drop-target');let data={};try{data=JSON.parse(ev.dataTransfer.getData('text/plain')||'{}')}catch{}if(data.kind==='catalog-card'){dragDropHandled=true;if(typeof activeZone!=='undefined'){}addCardFromFinal(data.name)}else if(data.kind==='deck-card'){dragDropHandled=true}}
  function renderDeckClean(){
    const host=document.getElementById('deckList');if(!host)return;
    const zone=typeof activeZone!=='undefined'?activeZone:'main',z=deckState?.[zone]||[];
    const cards=[];
    z.forEach((c,i)=>{for(let copy=0;copy<Math.max(1,+c.qty||1);copy++)cards.push({c,i,copy})});
    host.classList.add('visual-card-panel');
    host.innerHTML=cards.map(({c,i,copy})=>`<div class="visual-card-wrap" data-ygo-card-id="${Number(c.id??c.cardId)||0}" draggable="true" title="Arrastra la carta fuera del panel para retirarla" ondragstart="deckDragStart(event,'${zone}',${i},${copy})" ondragend="deckDragEnd(event)">${thumb(c)}${typeof banBadgeForCard==='function'?banBadgeForCard(c):''}</div>`).join('')||'<div class="visual-empty">Arrastra cartas desde el catálogo hasta aquí.</div>';
    // Alpha 1109: no interpolar nombres de cartas dentro de atributos onclick.
    // Los nombres con comillas/apóstrofes eran truncados por el parser HTML.
    host.querySelectorAll('.visual-card-wrap').forEach((node,i)=>node.addEventListener('click',()=>selectCardDetail(cards[i].c.name)));
    host.ondragover=deckDragOver;host.ondragleave=deckDragLeave;host.ondrop=deckDrop;
    for(const [id,zname,max] of [['mainCount','main',60],['extraCount','extra',15],['sideCount','side',15]]){const el=document.getElementById(id);if(el)el.textContent=`${(deckState[zname]||[]).reduce((n,c)=>n+(+c.qty||0),0)}/${zname==='main'?'40–60':max}`}
    const zl=document.getElementById('zoneLabel');if(zl)zl.textContent=zone==='main'?'MAIN DECK':zone.toUpperCase();
  }
  window.addCardFromFinal=function(name){const o=cardByName(name)||CARD_CATALOG.find(c=>c[0]===name);if(!o){toast('No se encontró la carta.');return}const c=Array.isArray(o)?{name:o[0],type:o[1],attribute:o[2],role:o[3]}:{...o};selectCardDetail(name);addCard(c)};
  window.renderCatalog=renderCatalogClean;window.renderDeck=renderDeckClean;
  function hydrateCurrentDeck(){
    const byId=new Map(CARD_CATALOG.map(c=>[String(c.id),c])),byName=new Map(CARD_CATALOG.map(c=>[String(c.name).toLowerCase(),c]));
    for(const zone of ['main','extra','side'])for(const c of (deckState?.[zone]||[])){
      const db=byId.get(String(c.id))||byName.get(String(c.name||'').toLowerCase());if(!db)continue;
      const online=!!c.__ygoHydrated;
      c.id=db.id;if(!c.name)c.name=db.name;if(!c.desc)c.desc=db.desc;
      const fields=['type','frameType','typeBits','attribute','race','atk','def','level','rank','linkval','scaleL','scaleR','setcode','ot','alias','category','role','archetype','archetypes','sourceUpdatedAt','source'];
      for(const k of fields){const cur=c[k],next=db[k],missing=cur==null||cur===''||(typeof cur==='number'&&cur===0);if(!online||missing)c[k]=next;}
    }
  }
  window.hydrateCurrentDeck=hydrateCurrentDeck;
  function saveDeck(){
    let d;
    try{
      // El snapshot y la copia de la biblioteca deben completarse antes de escribir.
      d=snapshot();
      const libraryRaw=localStorage.getItem(STORAGE);
      const a=readSavedForWrite1112();
      const existing=a.findIndex(x=>String(x?.name||'').trim().toLowerCase()===String(d.name||'').trim().toLowerCase());
      if(existing>=0 && !confirm(`Ya existe “${d.name}”. ¿Quieres reemplazarla?`))return false;
      if(existing>=0){d.id=a[existing].id;a[existing]=d}
      else{
        // Incluso si el reloj/PRNG coincide, dos barajas no compartirán ID.
        const used=new Set(a.map(x=>String(x.id)));
        const seed=String(d.id);let id=seed,n=0;
        while(used.has(id))id=seed+'-'+(++n).toString(36);
        d.id=id;a.push(d);
      }
      setSaved(a,libraryRaw);
    }catch(error){
      toast('No se pudo guardar la baraja: '+String(error?.message||error));
      return false;
    }
    // Un fallo en la copia auxiliar de evaluación no invalida el guardado principal.
    try{saveDeckEvaluationDB(d)}catch(error){console.warn('Evaluación auxiliar no actualizada:',error)}
    try{renderSaved()}catch(error){console.warn('Biblioteca guardada, actualización visual pendiente:',error)}
    toast('Baraja guardada correctamente.');
    return true;
  }
  function normalizeLoadedCard(c){
    if(Array.isArray(c)){
      const id=c[0], name=c[1]||'';
      // Formatos históricos: la cantidad sólo se reconoce si existe una marca
      // explícita. Nunca se interpreta un timestamp/fecha como cantidad.
      let qty=1, role='';
      if(c.length>=8 && /^(qty|quantity|cantidad)$/i.test(String(c[7]||''))){
        const q=Number(c[8]); if(Number.isFinite(q)) qty=q;
      }
      if(c.length>=7 && typeof c[6]==='string' && !/^\d{8,}$/.test(c[6])) role=c[6];
      return {id,name,desc:c[2]||'',type:c[3]||'',attribute:c[4]||'',qty:Math.max(1,Math.min(3,Math.floor(qty||1))),role};
    }
    if(!c||typeof c!=='object')return null;
    const o={...c};
    const q=Number(o.qty); o.qty=Number.isFinite(q)?Math.max(1,Math.min(3,Math.floor(q))):1;
    return o;
  }
  function normalizeLoadedZone(list){
    const map=new Map();
    for(const raw of Array.isArray(list)?list:[]){const c=normalizeLoadedCard(raw);if(!c)continue;const key=String(c.id||c.name||'').toLowerCase();if(!key)continue;const prev=map.get(key);if(prev)prev.qty=Math.min(3,prev.qty+c.qty);else{c.qty=Math.min(3,c.qty);map.set(key,c)}}
    return [...map.values()];
  }
  // Alpha 1110: las barajas guardadas utilizan la misma transacción de
  // identidad, puntuación, vista y cancelación que las importaciones YDK.
  // No fiarse de una puntuación histórica ni mutar el mazo antes del commit.
  async function loadDeck(id){
    const matching=getSaved().filter(x=>String(x?.id)===String(id));
    if(matching.length!==1){toast(matching.length>1?'Hay IDs duplicados: repara la biblioteca antes de cargar.':'No se encontró la baraja guardada.');return false}
    const d=matching[0];
    try{
      const src=d.deckState||d.deck||{main:d.main,extra:d.extra,side:d.side};
      if(!src||['main','extra','side'].some(z=>!Array.isArray(src[z])))
        throw Error('La baraja guardada no contiene tres zonas válidas.');
      const known=Array.isArray(window.CARD_CATALOG)?window.CARD_CATALOG:[];
      const byName=new Map();
      for(const card of known){
        const name=String(card?.name||'').trim().toLowerCase(),cid=Number(card?.id);
        if(!name||!Number.isSafeInteger(cid)||cid<1)continue;
        if(!byName.has(name))byName.set(name,cid);
        else if(byName.get(name)!==cid)byName.set(name,null);
      }
      const lines={};
      for(const zone of ['main','extra','side']){
        lines[zone]=[];
        for(const item of src[zone]){
          if(!item||typeof item!=='object')throw Error('Entrada de carta dañada en '+zone+'.');
          const isLegacy=Array.isArray(item),key=isLegacy?item[0]:(item.id??item.cardId);
          const explicitId=!isLegacy&&(Object.prototype.hasOwnProperty.call(item,'id')||Object.prototype.hasOwnProperty.call(item,'cardId'));
          // Un registro con dos identificadores discordantes no puede recuperar
          // silenciosamente sólo el primero.
          if(!isLegacy&&item.id!=null&&item.cardId!=null){
            const a=String(item.id).trim(),b=String(item.cardId).trim();
            if(!/^\d{1,12}$/.test(a)||!/^\d{1,12}$/.test(b)||Number(a)!==Number(b))
              throw Error('Conflicto entre ID y cardId de una carta guardada en '+zone+'.');
          }
          // No convertir con Number() una identidad guardada ambigua: las cadenas
          // hexadecimales, exponenciales, decimales fraccionarias y signos podían
          // sustituir silenciosamente la carta original por otra.
          const rawKey=typeof key==='string'?key.trim():'';
          const literalId=(typeof key==='number'&&Number.isSafeInteger(key)&&key>0&&String(key).length<=12)||
             (typeof key==='string'&&/^\d{1,12}$/.test(rawKey)&&Number(rawKey)>0);
          const numericLookalike=typeof key==='string'&&/^[+-]?(?:0[xob][0-9a-f]+|\d+(?:\.\d*)?(?:e[+-]?\d+)?)$/i.test(rawKey);
          if(!literalId&&(numericLookalike||explicitId))
            throw Error('Identificador guardado ambiguo o inválido en '+zone+'. No se modificó la baraja actual.');
          let cid=literalId?Number(key):NaN;
          if(!literalId){
            // Sólo los arreglos históricos [nombre,tipo,...] sin ID pueden
            // resolver por nombre inequívoco; los IDs presentes deben ser decimales.
            const first=isLegacy?String(item[0]??'').trim():'';
            const label=String(isLegacy&&first&&!/^\d+$/.test(first)?first:(isLegacy?item[1]:(item.name||''))).trim().toLowerCase();
            cid=byName.get(label);
          }
          const qRaw=isLegacy&&/^(qty|quantity|cantidad)$/i.test(String(item[7]||''))?item[8]:
            (isLegacy?1:Object.prototype.hasOwnProperty.call(item,'qty')?item.qty:1);
          const qty=(typeof qRaw==='number'&&Number.isSafeInteger(qRaw))?qRaw:
            (typeof qRaw==='string'&&/^\d+$/.test(qRaw.trim()))?Number(qRaw.trim()):NaN;
          if(!Number.isSafeInteger(cid)||cid<=0||String(cid).length>12)
            throw Error('Una carta guardada no tiene identificador verificable en '+zone+'.');
          // Alpha 1123: un ID impreso no puede contradecir un nombre de carta
          // que el catálogo local identifique sin ambigüedad. No usar el nombre
          // como prueba universal si la traducción no está disponible.
          const storedName=String(isLegacy?(/^\d+$/.test(String(item[0]??'').trim())?item[1]??'':item[0]??''):item.name??'').trim().toLowerCase();
          if(storedName&&byName.has(storedName)){
            const nameId=byName.get(storedName);
            if(Number.isSafeInteger(nameId)&&nameId!==cid)
              throw Error('ID y nombre de una carta guardada no coinciden con el catálogo en '+zone+'.');
          }
          // Diagnostic decks are round-tripped exactly; the canonical importer
          // reports legal copy limits without destroying the saved state.
          if(!Number.isSafeInteger(qty)||qty<1||qty>60)
            throw Error('Cantidad inválida para una carta guardada en '+zone+'.');
          for(let i=0;i<qty;i++)lines[zone].push(String(cid));
        }
      }
      const parser=window.YGOApp?.ydk?.importText;
      if(typeof parser!=='function')throw Error('El importador canónico todavía no está disponible.');
      const ydk='#main\n'+lines.main.join('\n')+'\n#extra\n'+lines.extra.join('\n')+'\n!side\n'+lines.side.join('\n')+'\n';
      const previousFormat=document.querySelector('.fmt.active')?.dataset.f||'TCG';
      const savedFormat=String(d.fmt||previousFormat);
      const selectFormat=value=>{const button=[...document.querySelectorAll('.fmt')].find(el=>el.dataset.f===value);if(button)button.click();return !!button;};
      if(savedFormat!==previousFormat&&!selectFormat(savedFormat))throw Error('El formato guardado no está disponible: '+savedFormat);
      const result=await parser(ydk,String(d.name||'Baraja guardada'));
      if((!result||result.error||result.cancelled)&&savedFormat!==previousFormat)selectFormat(previousFormat);
      if(!result||result.error||result.cancelled){
        if(result?.cancelled)return false;
        throw Error(result?.error||'La importación guardada no fue confirmada.');
      }
      const archEl=document.getElementById('arch');if(archEl)archEl.value=d.arch||'';
      const dateEl=document.getElementById('date');if(dateEl)dateEl.value=d.date||'';
      // El formato y las estadísticas históricos no sustituyen al cálculo actual.
      // El motor canónico evalúa el mazo bajo las reglas vigentes seleccionadas.
      try{renderComboDeckCards?.()}catch(_){}
      toast(`“${d.name||'Baraja'}” cargada y recalculada correctamente.`);
      return true;
    }catch(error){
      toast('No se pudo cargar la baraja guardada: '+String(error?.message||error));
      return false;
    }
  }
  function deleteDeck(id){
    let before,libraryRaw;
    try{libraryRaw=localStorage.getItem(STORAGE);before=readSavedForWrite1112()}catch(error){toast('No se pudo leer la biblioteca: '+String(error?.message||error));return false}
    if(!before.some(x=>String(x.id)===String(id))){toast('No se encontró la baraja guardada.');return false}
    if(!confirm('¿Eliminar esta baraja guardada?'))return false;
    const after=before.filter(x=>String(x.id)!==String(id));
    try{setSaved(after,libraryRaw)}catch(error){toast('No se pudo eliminar la baraja: '+String(error?.message||error));return false}
    try{renderSaved()}catch(error){console.warn('Eliminación realizada, actualización visual pendiente:',error)}
    toast('Baraja eliminada.');return true;
  }
  window.loadDeck=loadDeck; window.saveDeck=saveDeck; window.deleteDeck=deleteDeck; window.fetchBanData=fetchBanData; window.checkBanDeck=checkBanDeck; window.banRuleForCard=banRuleForCard; window.banCopyLimitForName=banCopyLimitForName;
  // Una puntuación histórica puede ser aritméticamente correcta y aun así NO
  // ser comparable con otra si cambió el algoritmo, el catálogo o la regulación.
  // Los registros antiguos sin trazabilidad permanecen visibles, sin deltas.
  function savedEvaluationStamp1143(d){
    const e=d?.evaluation;
    if(!e||typeof e!=='object'||Array.isArray(e))return null;
    const fmt=String(d?.fmt??'').trim().toUpperCase();
    const scored=String(e.scoredFormat??'').trim().toUpperCase();
    const engine=typeof e.engine==='string'?e.engine.trim():'';
    const revision=typeof e.scoreRevision==='string'?e.scoreRevision.trim():'';
    const build=typeof e.scoreBuild==='string'?e.scoreBuild.trim():'';
    const banKey=typeof e.banlistKey==='string'?e.banlistKey.trim():'';
    const banDate=typeof e.banlistDate==='string'?e.banlistDate.trim():'';
    const catalog=e.databaseUpdatedAt;
    // Una fecha incompleta o un origen de banlist no documentado NO autoriza
    // declarar equivalencia entre las evaluaciones guardadas.
    if(!fmt||fmt!==scored||!engine||!revision||!build||!banKey||!banDate||
       !Number.isSafeInteger(catalog)||catalog<=0)return null;
    return JSON.stringify([fmt,engine,revision,build,banKey,banDate,catalog]);
  }
  // Comparar sólo evidencias históricas válidas; no inferir ceros de datos ausentes.
  function compareSaved(){
    const a=getSaved();
    if(a.length<2){toast('Guarda al menos dos barajas para compararlas.');return false}
    const A=String(document.getElementById('compareA')?.value||''), B=String(document.getElementById('compareB')?.value||'');
    if(!A||!B||A===B){toast('Selecciona dos barajas diferentes.');return false}
    if(savedIdConflicts1120(a).length){toast('Repara los identificadores de la biblioteca antes de comparar.');return false}
    const x=a.find(d=>String(d?.id)===A),y=a.find(d=>String(d?.id)===B);
    if(!x||!y){toast('No se encontraron las dos barajas guardadas.');return false}
    // Alpha 1121: no interpretar datos heredados desconocidos como puntuaciones reales.
    // Las celdas históricas pueden mostrarse para inspección, pero un total sólo se
    // presenta cuando coincide con diez categorías válidas y su total almacenado.
    const checked=d=>{
      const rows=Array.isArray(d?.v)?d.v:[];
      return Array.from({length:10},(_,i)=>{
        const n=strictStat1122(rows[i]);
        return i<rows.length?n:null;
      });
    };
    const vx=checked(x),vy=checked(y), complete=v=>v.every(n=>n!==null);
    // Comparar diferencias históricas sólo si las dos evaluaciones declaran
    // explícitamente el mismo formato. Nunca inferir TCG por defecto cuando
    // falta el formato de una baraja antigua.
    const formatX=String(x?.fmt??'').trim().toUpperCase();
    const formatY=String(y?.fmt??'').trim().toUpperCase();
    // No comparar por categoría un registro cuyo total no coincide con
    // sus diez estadísticas, aunque algunos valores individuales sean válidos.
    // Primero certificar la coherencia interna de AMBOS registros guardados.
    const tx=complete(vx)?validatedHistoricalTotal1120(x):null;
    const ty=complete(vy)?validatedHistoricalTotal1120(y):null;
    const comparableFormats=Boolean(formatX&&formatY&&formatX===formatY);
    const stampX=savedEvaluationStamp1143(x),stampY=savedEvaluationStamp1143(y);
    const comparableProvenance=Boolean(stampX&&stampY&&stampX===stampY);
    const comparableScores=comparableFormats&&comparableProvenance&&tx!==null&&ty!==null;
    const fmt=n=>n===null?'—':String(n);
    let rows='';
    for(let i=0;i<10;i++){
      const dx=vx[i],dy=vy[i],dif=comparableScores?dy-dx:null;
      rows+=`<tr><td>${names[i]}</td><td>${fmt(dx)}/10</td><td>${fmt(dy)}/10</td><td class="${dif===null?'diff-even':dif>0?'diff-up':dif<0?'diff-down':'diff-even'}">${dif===null?'—':(dif>0?'+':'')+dif}</td></tr>`;
    }
    const td=comparableScores?ty-tx:null;
    const unreliable=tx===null||ty===null;
    const host=document.getElementById('savedCompareResult');if(!host)return false;
    const formatNotice=comparableFormats?'':`⚠ No se calculan diferencias entre formatos distintos o desconocidos (${esc(formatX||'sin formato')} y ${esc(formatY||'sin formato')}). Las puntuaciones se muestran sólo como referencia histórica. `;
    const validationNotice=unreliable?'⚠ Se ocultan TODAS las diferencias porque al menos un total no coincide con diez categorías válidas. Carga y recalcula ambas barajas para compararlas. ':'';
    const provenanceNotice=comparableFormats&&!comparableProvenance?'⚠ No se calculan diferencias: falta trazabilidad de las evaluaciones o difieren el motor, su versión, el catálogo o el perfil de regulación. Carga y recalcula ambas barajas antes de comparar. ':'';
    host.innerHTML=`<table class="compare-table"><thead><tr><th>Categoría</th><th>${esc(x.name||'Baraja A')} · ${esc(formatX||'sin formato')}</th><th>${esc(y.name||'Baraja B')} · ${esc(formatY||'sin formato')}</th><th>Diferencia</th></tr></thead><tbody>${rows}</tbody></table><div class="tiny" style="margin-top:8px">Total de estadísticas históricas: <b>${fmt(tx)}/100</b> vs <b>${fmt(ty)}/100</b> · diferencia ${td===null?'—':(td>0?'+':'')+td}<div>${formatNotice}${validationNotice}${provenanceNotice}Estimaciones guardadas; para obtener datos vigentes, carga y vuelve a calcular cada baraja. El signo «—» significa dato ausente, inválido o no comparable.</div></div>`;
    return true;
  }
  function savedZoneCount1111(d,z){
    const state=d?.deckState||d?.deck||d||{};
    const cards=Array.isArray(state[z])?state[z]:[];
    return cards.reduce((n,c)=>{const q=Array.isArray(c)?(/^(qty|quantity|cantidad)$/i.test(String(c[7]||''))?Number(c[8]):1):Number(c?.qty??1);return n+(Number.isInteger(q)&&q>=1&&q<=3?q:0)},0);
  }
  function renderSaved(){
    const host=document.getElementById('savedDecks');if(!host)return;
    const a=getSaved(),bad=savedIdConflicts1120(a),conflicted=new Set(bad);
    for(let i=0;i<a.length;i++)if(a[i]?.id!==undefined&&a[i]?.id!==null){const k=String(a[i].id).trim();if(!k)continue;if(bad.some(j=>String(a[j]?.id??'').trim()===k))conflicted.add(i)}
    const warning=bad.length?`<div class="tiny" style="grid-column:1/-1" role="alert">⚠ ${bad.length} ID(s) inválidos o duplicados: las acciones de esas barajas se desactivaron para proteger tus datos. <button type="button" class="adv-btn" data-repair-saved="1">REPARAR IDS</button></div>`:'';
    host.innerHTML=a.length?`<div class="tiny" style="grid-column:1/-1;margin-bottom:2px">${a.length} baraja(s) guardada(s)</div>`+warning+a.map((d,i)=>{
      const total=validatedHistoricalTotal1120(d),id=d?.id===null||d?.id===undefined?'':String(d.id),blocked=conflicted.has(i);
      return `<div class="saved-deck-card"><b>${esc(d?.name||'Baraja sin nombre')}</b><div class="big" title="${total===null?'Puntuación histórica incompleta o inconsistente. Carga y recalcula.':'Puntuación histórica; carga para actualizar.'}">${total===null?'—':total}/100</div><div class="tiny">${savedZoneCount1111(d,'main')} Main · ${savedZoneCount1111(d,'extra')} Extra · ${savedZoneCount1111(d,'side')} Side</div><div class="saved-deck-actions"><button type="button" class="adv-btn green" data-load-saved="${esc(id)}" ${blocked?'disabled title="Identificador ambiguo"':''}>CARGAR</button><button type="button" class="adv-btn" data-delete-saved="${esc(id)}" ${blocked?'disabled title="Identificador ambiguo"':''}>ELIMINAR</button></div></div>`
    }).join(''):'<div class="tiny">No hay barajas guardadas todavía.</div>';
    const opts=a.filter((d,i)=>!conflicted.has(i)).map(d=>`<option value="${esc(String(d.id))}">${esc(d.name||'Baraja')} · ${validatedHistoricalTotal1120(d)??'—'}/100</option>`).join('');
    for(const id of ['compareA','compareB']){const e=document.getElementById(id);if(e)e.innerHTML=opts}
    bindSavedDeckButtons();
  }
  function bindSavedDeckButtons(){const host=document.getElementById('savedDecks');if(!host||host.__alpha245Bound)return;host.__alpha245Bound=true;host.addEventListener('click',e=>{const repair=e.target.closest('[data-repair-saved]');if(repair){e.preventDefault();repairSavedIds1120();return}const load=e.target.closest('[data-load-saved]');if(load){e.preventDefault();const id=load.getAttribute('data-load-saved');if(typeof loadSavedDeck==='function')loadSavedDeck(id);else if(typeof window.loadDeck==='function')window.loadDeck(id);return}const del=e.target.closest('[data-delete-saved]');if(del){e.preventDefault();const id=del.getAttribute('data-delete-saved');if(typeof deleteSavedDeck==='function')deleteSavedDeck(id);else if(typeof window.deleteDeck==='function')window.deleteDeck(id)}})}
  window.bindSavedDeckButtons=bindSavedDeckButtons;window.save=function(){saveDeck()};window.load=function(){document.getElementById('savedDeckPanel')?.scrollIntoView({behavior:'smooth',block:'center'})};window.compare=function(){document.getElementById('savedDeckPanel')?.scrollIntoView({behavior:'smooth',block:'center'});};window.loadSavedDeck=loadDeck;window.deleteSavedDeck=deleteDeck;window.compareSaved=compareSaved;
  const BABELCDB_API='https://api.github.com/repos/ProjectIgnis/BabelCDB/contents/';
  const BABELCDB_RAW='https://raw.githubusercontent.com/ProjectIgnis/BabelCDB/master/';
  let babelSyncPromise=null;
  function loadScriptOnce(src){return new Promise((resolve,reject)=>{const existing=[...document.scripts].find(x=>x.src===src);if(existing){if(window.initSqlJs)return resolve();existing.addEventListener('load',()=>resolve(),{once:true});existing.addEventListener('error',reject,{once:true});return}const s=document.createElement('script');s.src=src;s.async=true;s.onload=()=>resolve();s.onerror=reject;document.head.appendChild(s)})}
  async function getSqlJs(){if(window.initSqlJs)return window.initSqlJs;if(!window.__sqlJsPromise){window.__sqlJsPromise=loadScriptOnce('https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/sql-wasm.js').then(()=>window.initSqlJs)}return window.__sqlJsPromise}
  function remotePriority(file){const n=file.toLowerCase();if(n==='cards.cdb')return 100;if(n==='cards-unofficial.cdb')return 90;if(n==='cards-rush.cdb')return 80;if(n==='cards-skills.cdb')return 70;if(n==='cards-skills-unofficial.cdb')return 60;if(n.startsWith('release-'))return 50;if(n.startsWith('prerelease-'))return 40;if(n==='goat-entries.cdb')return 20;return 10}
  async function parseRemoteCDB(buffer,file){const init=await getSqlJs();const SQL=await init({locateFile:f=>'https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/'+f});const db=new SQL.Database(new Uint8Array(buffer));let rows=[];try{const q=db.exec("SELECT d.id,d.ot,d.alias,d.setcode,d.type,d.atk,d.def,d.level,d.race,d.attribute,d.category,t.name,t.desc FROM datas d JOIN texts t ON t.id=d.id");if(q[0]?.values)rows=q[0].values.map(r=>[r[0],r[11]||'',r[12]||'',r[4],r[9],Date.now(),file,r[8],r[5],r[6],r[7],r[3],r[1],r[2],r[10]])}finally{db.close()}return rows}
  async function syncBabelCDB(force=false){
    if(babelSyncPromise&&!force)return babelSyncPromise;
    babelSyncPromise=(async()=>{
      if(!navigator.onLine)return {updated:false,offline:true};
      try{
        const rr=await fetch(BABELCDB_API+'?ref=master&ts='+Date.now(),{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!rr.ok)throw Error('GitHub '+rr.status);
        const listing=await rr.json();const files=listing.filter(x=>x.type==='file'&&/\.cdb$/i.test(x.name)&&!/\.delta\.cdb$/i.test(x.name)&&x.name!=='goat-entries.cdb');
        if(!files.length)return {updated:false,empty:true};
        const db=await openYGOCardDB();
        let meta=await new Promise((res,rej)=>{const tx=db.transaction(YGO_DB_META,'readonly'),q=tx.objectStore(YGO_DB_META).get('babelcdb');q.onsuccess=()=>res(q.result||{});q.onerror=()=>rej(q.error)});
        const oldFiles=meta.files||{};const changed=force||files.some(f=>oldFiles[f.name]!==f.sha)||Object.keys(oldFiles).some(n=>!files.some(f=>f.name===n));
        if(!changed){return {updated:false,checked:true,count:CARD_CATALOG.length};}
        const sqlRows=[];for(const f of files){if(force||oldFiles[f.name]!==f.sha){const fr=await fetch(f.download_url||BABELCDB_RAW+encodeURIComponent(f.name),{cache:'no-store'});if(!fr.ok)throw Error(`${f.name}: HTTP ${fr.status}`);sqlRows.push(...await parseRemoteCDB(await fr.arrayBuffer(),f.name));}else{const existing=CARD_CATALOG.filter(c=>c.source===f.name);for(const c of existing)sqlRows.push([c.id,c.name,c.desc,(Number(c.typeBits)||({Monstruo:1,Mágica:2,Trampa:4}[c.type])||1),({TIERRA:1,AGUA:2,FUEGO:4,VIENTO:8,LUZ:16,OSCURIDAD:32,DIVINO:64}[c.attribute]||0),c.sourceUpdatedAt,c.source,c.race,c.atk,c.def,(Number(c.level)||Number(c.rank)||Number(c.linkval)||0),c.setcode,c.ot,c.alias,c.category])}}
        // Build a fresh remote catalog. Duplicates are resolved by source priority, then newest fetch timestamp.
        const byId=new Map();for(const x of sqlRows){const id=+x[0];if(!id)continue;const bits=Number(x[3])||0,type=decodeCDBType(bits),lv=decodeCDBLevel(x[10],bits);const rec={id,name:x[1]||'',desc:x[2]||'',type,frameType:type.toLowerCase().replace(/\s+/g,'-'),typeBits:bits,attribute:YGO_DB_ATTR[x[4]]||'—',race:+x[7]||0,atk:+x[8]||0,def:+x[9]||0,level:lv.level,rank:lv.rank,linkval:lv.linkval,scaleL:lv.scaleL,scaleR:lv.scaleR,setcode:String(x[11]||''),ot:+x[12]||0,alias:+x[13]||0,category:+x[14]||0,role:classifyDBCard(x[1]||'',x[2]||'',type),qty:1,sourceUpdatedAt:+x[5]||Date.now(),source:x[6]||''};const old=byId.get(id);const a=old?[remotePriority(old.source),old.sourceUpdatedAt]:[-1,-1],b=[remotePriority(rec.source),rec.sourceUpdatedAt];if(!old||b[0]>a[0]||(b[0]===a[0]&&b[1]>a[1]))byId.set(id,rec)}
        CARD_CATALOG=[...byId.values()].sort((a,b)=>a.name.localeCompare(b.name));
        try{if(window.YGOCanonicalMergeCatalog)CARD_CATALOG=window.YGOCanonicalMergeCatalog(CARD_CATALOG)}catch(e){console.warn('Alpha329 canonical merge BabelCDB',e)}
        window.CARD_CATALOG=CARD_CATALOG;CARD_DB_BY_NAME=new Map(CARD_CATALOG.map(c=>[c.name.toLowerCase(),c]));
        await new Promise((res,rej)=>{const tx=db.transaction(YGO_DB_STORE,'readwrite'),st=tx.objectStore(YGO_DB_STORE);st.clear();for(const c of CARD_CATALOG)st.put(c);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});
        const filesMeta={};files.forEach(f=>filesMeta[f.name]=f.sha);await new Promise((res,rej)=>{const tx=db.transaction(YGO_DB_META,'readwrite');tx.objectStore(YGO_DB_META).put({key:'babelcdb',files:filesMeta,updatedAt:Date.now(),source:'ProjectIgnis/BabelCDB',count:CARD_CATALOG.length});tx.objectStore(YGO_DB_META).put({key:'manifest',sources:files.map(f=>({file:f.name,updatedAt:Date.now(),sha:f.sha,source:'ProjectIgnis/BabelCDB'})),cardCount:CARD_CATALOG.length,updatedAt:Date.now(),source:'ProjectIgnis/BabelCDB'});tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});
        window.YGO_DB_SOURCES=files.map(f=>({file:f.name,updatedAt:Date.now(),sha:f.sha,source:'ProjectIgnis/BabelCDB'}));
        if(typeof renderCatalogClean==='function')renderCatalogClean();if(typeof renderDeckClean==='function')renderDeckClean();
        if(typeof deckCount==='function'&&deckCount('main')>=5){const r=window.YGOCanonical?.evaluate?.();if(r){window.YGOCanonical?.renderScoreCards?.();try{window.renderAllAdvanced?.()}catch{};try{window.YGOCanonical?.renderScoreCards?.()}catch{}}}
        return {updated:true,count:CARD_CATALOG.length,files:files.length};
      }catch(e){console.warn('BabelCDB online sync no disponible; se mantiene la base local.',e);return {updated:false,error:e};}
      finally{babelSyncPromise=null}
    })();return babelSyncPromise;
  }
  window.syncBabelCDB=syncBabelCDB;
  window.addEventListener('online',()=>{syncBabelCDB(false).catch(()=>{});});

  function renderDB(){const host=document.getElementById('dbResults');if(!host)return;const q=(document.getElementById('dbSearch')?.value||'').trim().toLowerCase(),role=document.getElementById('dbRole')?.value||'',arch=document.getElementById('dbArchetype')?.value||'',fn=document.getElementById('dbFunction')?.value||'';let rows=CARD_CATALOG.filter(c=>{const hay=[c.name,c.type,c.attribute,c.role,c.desc,c.archetype,(c.archetypes||[]).join(' '),(c.advancedRoles||[]).join(' ')].join(' ').toLowerCase();return(!q||hay.includes(q))&&(!role||c.role===role)&&(!arch||(c.archetypes||[]).includes(arch))&&(!fn||(c.advancedRoles||[]).includes(fn))});rows=rows.slice(0,500);host.innerHTML=rows.length?rows.map(c=>`<div class="db-card" role="button" tabindex="0" onclick='selectCardDetail(${JSON.stringify(c.name).replace(/'/g,'&#39;')})' onkeydown='if(event.key==="Enter"||event.key===" ")selectCardDetail(${JSON.stringify(c.name).replace(/'/g,'&#39;')})'><div class="db-card-name">${esc(c.name)}</div><div class="db-card-meta">${esc(c.type||'Carta')} · ${esc(c.attribute||'—')} · ${esc(c.archetype||'Sin arquetipo')}</div><div class="db-card-role">${esc((c.advancedRoles||[c.role||'Utility']).join(' · '))}</div><div class="db-card-text">${esc(c.desc||'')}</div></div>`).join(''):'<div class="result muted" style="grid-column:1/-1">No se encontraron cartas.</div>';const counter=document.getElementById('dbCount');if(counter)counter.textContent=`${rows.length} resultados mostrados · ${CARD_CATALOG.length} cartas catalogadas`;try{renderComboVisualTop5()}catch{}}
  /* ===== ARQUETIPOS / ROLES / SINERGIAS ===== */
  const ARCHETYPE_MAP_KEY='ygoArchetypeMapV1';
  let ARCHETYPE_MAP={}; let ARCHETYPE_READY=false; W.__YGO_ARCHETYPE_MAP=ARCHETYPE_MAP;
  function archPretty(v){return String(v||'').replace(/^SET_/,'').replace(/_R$/,'').replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase())}
  async function loadArchetypeMap(){
    if(ARCHETYPE_READY)return ARCHETYPE_MAP;
    try{const cached=JSON.parse(localStorage.getItem(ARCHETYPE_MAP_KEY)||'null');if(cached&&Object.keys(cached).length){ARCHETYPE_MAP=cached;ARCHETYPE_READY=true;return ARCHETYPE_MAP}}catch{}
    try{const r=await fetch('https://raw.githubusercontent.com/ProjectIgnis/CardScripts/master/archetype_setcode_constants.lua',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const txt=await r.text();const re=/SET_([A-Z0-9_]+)\s*=\s*(0x[0-9A-F]+)/g;let m;while((m=re.exec(txt)))ARCHETYPE_MAP[m[2].toLowerCase()]=archPretty(m[1]);if(Object.keys(ARCHETYPE_MAP).length)localStorage.setItem(ARCHETYPE_MAP_KEY,JSON.stringify(ARCHETYPE_MAP));ARCHETYPE_READY=true;return ARCHETYPE_MAP}catch(e){console.warn('No se pudo cargar el mapa de arquetipos',e);ARCHETYPE_READY=true;return ARCHETYPE_MAP}
  }
  function splitSetcodes(hex){const s=String(hex||'').replace(/[^0-9a-f]/gi,'').toLowerCase();const out=[];for(let i=0;i+4<=s.length;i+=4)out.push(s.slice(i,i+4));return [...new Set(out)]}
  function cardArchetypes(c){const codes=splitSetcodes(c?.setcode),names=codes.map(k=>ARCHETYPE_MAP['0x'+k]||ARCHETYPE_MAP[k]).filter(Boolean);return [...new Set(names)]}
  function normalizeArchetypeText(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[‐‑‒–—−]/g,'-').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}
  const ARCHETYPE_ALIASES={'Blue-Eyes':['blue eyes','blue-eyes','eyes of blue'],'Red-Eyes':['red eyes','red-eyes'],'Dark Magician':['dark magician'],'Dark Magician Girl':['dark magician girl'],'Harpie':['harpie'],'Toon':['toon'],'Exodia':['exodia'],'Elemental HERO':['elemental hero'],'Destiny HERO':['destiny hero'],'Vision HERO':['vision hero']};
  function explicitArchetypeMatches(c){const base=[...cardArchetypes(c)];const text=normalizeArchetypeText(String(c?.name||'')+' '+String(c?.desc||''));for(const raw of Object.values(ARCHETYPE_MAP||{})){const a=String(raw||'').trim();if(!a)continue;const n=normalizeArchetypeText(a);if(n.length>=4&&text.includes(n))base.push(a)}for(const [a,aliases] of Object.entries(ARCHETYPE_ALIASES)){if(aliases.some(x=>text.includes(normalizeArchetypeText(x))))base.push(a)}return [...new Set(base)]}
  function advancedCardRoles(c){
    const t=(String(c?.name||'')+' '+String(c?.desc||'')+' '+String(c?.role||'')).toLowerCase();
    const roles=new Set(),primary=String(c?.role||classifyDBCard(c?.name,c?.desc,c?.type)||'Utility');
    if(primary&&primary!=='Utility')roles.add(primary);
    if(/normal summon|if you control no monsters|starter|iniciador/.test(t))roles.add('Starter');
    if(/add .* from .*deck|add .*deck.*hand|search|busca|anade.*mazo|añade.*mazo/.test(t))roles.add('Buscador');
    if(/special summon|invoca.*especial/.test(t))roles.add('Extender');
    if(/negate|quick effect|during your opponent|opponent's turn|hand trap|cannot activate/.test(t))roles.add('Interrupción');
    if(/destroy|banish|return .*hand|return .*deck|shuffle .*deck|send .*graveyard|destruy|destierra|devuelve/.test(t))roles.add('Removal');
    if(/draw|roba/.test(t))roles.add('Robo');
    if(/graveyard.*add|add .*graveyard|recover|recycle|recupera|recicl/.test(t))roles.add('Reciclador');
    if(/cannot be destroyed|cannot be targeted|unaffected|protect|proteccion|protección/.test(t))roles.add('Protección');
    if(/fusion|synchro|xyz|link summon|ritual summon|material/.test(t))roles.add('Material');
    if(/otk|8000|double damage|direct attack/.test(t))roles.add('OTK');
    if(!roles.size)roles.add('Utility');
    return [...roles];
  }
  function assignCardArchetypes(){for(const c of CARD_CATALOG){const a=explicitArchetypeMatches(c);c.archetypes=a;c.archetype=a[0]||'';c.advancedRoles=advancedCardRoles(c)}hydrateCurrentDeck()}

  function archetypeUniverse(){
    const map=new Map();
    // Primero usamos todos los arquetipos declarados por Project Ignis, incluso si
    // en este momento no hay una carta cargada que los use. Después enriquecemos
    // con los arquetipos detectados en el catálogo local/online.
    for(const raw of Object.values(ARCHETYPE_MAP||{})){
      const name=String(raw||'').trim();
      if(name&&!map.has(name))map.set(name,{name,count:0,starter:0,search:0,extender:0,interaction:0,removal:0,extra:0,cards:[]});
    }
    for(const c of CARD_CATALOG){
      for(const a of (c.archetypes||[])){
        const name=String(a||'').trim(); if(!name)continue;
        const r=map.get(name)||{name,count:0,starter:0,search:0,extender:0,interaction:0,removal:0,extra:0,cards:[]};
        r.count++;
        const rs=c.advancedRoles||[];
        r.starter+=rs.includes('Starter')?1:0;
        r.search+=rs.includes('Buscador')?1:0;
        r.extender+=rs.includes('Extender')?1:0;
        r.interaction+=rs.includes('Interrupción')?1:0;
        r.removal+=rs.includes('Removal')?1:0;
        r.extra+=(c.type==='Monstruo'&&/fusion|synchro|xyz|link/i.test(c.desc||''))?1:0;
        r.cards.push(c); map.set(name,r);
      }
      // Compatibilidad con registros antiguos que ya traigan archetype pero no archetypes.
      const legacy=String(c.archetype||'').trim();
      if(legacy && !(c.archetypes||[]).length){
        const r=map.get(legacy)||{name:legacy,count:0,starter:0,search:0,extender:0,interaction:0,removal:0,extra:0,cards:[]};
        r.count++; r.cards.push(c); map.set(legacy,r);
      }
    }
    return [...map.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'es',{sensitivity:'base'}));
  }
  function renderArchetypeSelectors(){
    const sel=document.getElementById('arch'),db=document.getElementById('dbArchetype'); if(!sel)return;
    const uni=archetypeUniverse(),old=sel.value;
    const opts=uni.map(a=>`<option value="${esc(a.name)}">${esc(a.name)}${a.count?` · ${a.count} cartas`:' · catálogo'}</option>`).join('');
    sel.innerHTML='<option value="">Selecciona un arquetipo (opcional)</option>'+opts+'<option value="Otro">Otro</option>';
    if(old&&[...sel.options].some(o=>o.value===old))sel.value=old;
    if(db){const q=db.value;db.innerHTML='<option value="">Todos los arquetipos</option>'+uni.filter(a=>a.count>0).map(a=>`<option value="${esc(a.name)}">${esc(a.name)} (${a.count})</option>`).join('');if(q&&[...db.options].some(o=>o.value===q))db.value=q;}
  }
  const BANLIST_PROFILES={
    tcg:{name:'TCG Advanced',short:'TCG',date:'19/10/2026',kind:'FULL',source:'https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?request_locale=en',note:'Lista oficial TCG Advanced del 19/10/2026 (156 Prohibidas, 92 Limitadas, 7 Semi-Limitadas). Máximos compartidos entre Main, Extra y Side.',vector:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/tcg/current.vector.json'},
    tcgTraditional:{name:'TCG Traditional',short:'TCG TRAD.',date:'19/10/2026',kind:'FULL',source:'https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?request_locale=en',note:'Traditional derivado de la lista TCG vigente del 19/10/2026; las Forbidden de Advanced pasan a Limited.',derive:'tcgTraditional'},
    ocg:{name:'OCG Japón',short:'OCG',date:'01/07/2026',kind:'FULL',source:'https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action',note:'Regulación OCG japonesa completa.',vector:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/ocg/current.vector.json'},
    ocgAE:{name:'OCG Asian-English',short:'OCG AE',date:'01/07/2026',kind:'FULL',source:'https://www.yugioh-card.com/asia/play/forbidden-and-limited-card-list-ae/',note:'Regulación OCG Asian-English completa.',vector:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/ocg-ae/current.vector.json'},
    ocgCN:{name:'OCG China',short:'OCG CN',date:'2026',kind:'FULL',source:'https://www.yugioh-card-cn.com/simplifiedLimitRegulation',note:'Regulación OCG China separada.',vector:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/ocg-cn/current.vector.json'},
    master:{name:'Master Duel',short:'MASTER DUEL',date:'03/09/2026',kind:'DIGITAL',source:'https://www.masterduelmeta.com/forbidden-limited-list',note:'Regulación digital propia de Master Duel.',vector:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/master-duel/current.vector.json'},
    duelLinksSpeed:{name:'Duel Links · SPEED',short:'DL SPEED',date:'27/07/2026',kind:'DIGITAL',source:'https://www.duellinksmeta.com/forbidden-limited-list',note:'Forbidden + presupuestos compartidos Limit 1/2/3.',duelLinks:'speed'},
    duelLinksRush:{name:'Duel Links · RUSH',short:'DL RUSH',date:'2026',kind:'DIGITAL',source:'https://www.duellinksmeta.com/forbidden-limited-list',note:'Variante RUSH independiente.',duelLinks:'rush'},
    rush:{name:'Rush Duel',short:'RUSH DUEL',date:'01/07/2026',kind:'FULL',source:'https://www.konami.com/yugioh/rushduel/howto/limitregulation/',note:'Regulación oficial Rush Duel.',vector:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/rush/current.vector.json'},
    genesys:{name:'TCG Genesys',short:'GENESYS',date:'2026',kind:'POINTS',source:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/genesys/current.vector.json',note:'GenesYS usa puntos; no es una banlist tradicional.',vector:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/genesys/current.vector.json',points:true},
    genesysOCG:{name:'OCG Genesys',short:'OCG GENESYS',date:'2026',kind:'POINTS',source:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/ocg-genesys/current.vector.json',note:'OCG GenesYS usa puntos.',vector:'https://dawnbrandbots.github.io/yaml-yugi-limit-regulation/ocg-genesys/current.vector.json',points:true},
    speedDuel:{name:'Speed Duel · TCG',short:'SPEED DUEL',date:'VARIABLE',kind:'EVENT',source:'https://yugiohblog.konami.com/2026/ycs/ycs-cartagena-colombia-2026-public-events-information/',note:'Lista/reglas propias y potencialmente específicas de evento.',event:true},
    goat:{name:'GOAT Format',short:'GOAT',date:'01/04/2005',kind:'HISTÓRICO',source:'https://www.yugioh-card.com/en/play/organizedplay/time-wizard/',note:'Formato histórico con regulación de la época.',apiBan:'goat'},
    timeWizard:{name:'Time Wizard',short:'TIME WIZARD',date:'VARIABLE',kind:'HISTÓRICO',source:'https://www.yugioh-card.com/en/play/organizedplay/time-wizard/',note:'La regulación depende de la fecha histórica/evento.',event:true}
  };
  window.BANLIST_PROFILES=BANLIST_PROFILES;
  let banActive='tcg'; window.__YGO_ACTIVE_BAN_KEY='tcg';
  function banStatusLabel(s){return ({Forbidden:'PROHIBIDA',Limited:'LIMITADA','Semi-Limited':'SEMI-LIMITADA','Limited 1':'LIMIT 1','Limited 2':'LIMIT 2','Limited 3':'LIMIT 3',Legal:'LEGAL'})[s]||s}
  function banMaxForStatus(s){return ({Forbidden:0,Limited:1,'Semi-Limited':2,'Limited 1':1,'Limited 2':2,'Limited 3':3,Legal:3})[s]??3}
  function banNormalizeName(n){return String(n||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim()}
  function banBuildFromVector(json){const reg=json?.regulation||{};const db=(typeof mergedCardDB==='function'?mergedCardDB():(Array.isArray(window.CARD_CATALOG)?window.CARD_CATALOG:[]));const byId=new Map(db.map(x=>[String(Array.isArray(x)?x[0]:x?.id),Array.isArray(x)?{id:x[0],name:x[1],type:x[3]}:x]));return Object.entries(reg).map(([id,max])=>{const c=byId.get(String(id));const status=+max===0?'Forbidden':+max===1?'Limited':+max===2?'Semi-Limited':'Legal';return{name:c?.name||'Carta desconocida',id:+id,status,type:c?.type||'Carta',max:+max,unknown:!c}}).filter(x=>x.status!=='Legal')}
  function banBuildFromNames(obj){const rows=[];for(const [status,arr] of Object.entries(obj||{})){for(const name of arr||[])rows.push({name,id:null,status:status==='forbidden'?'Forbidden':status==='limited1'?'Limited 1':status==='limited2'?'Limited 2':'Limited 3',type:'Carta',max:status==='forbidden'?0:status==='limited1'?1:status==='limited2'?2:3})}return rows}
  async function fetchBanData(b){
    if(b.data?.length)return b.data;
    if(b.derive==='tcgTraditional'){const base=await fetchBanData(BANLIST_PROFILES.tcg);return b.data=base.map(x=>({...x,status:x.status==='Forbidden'?'Limited':x.status,max:x.status==='Forbidden'?1:x.max}));}
    if(b.points&&b.vector){const r=await fetch(b.vector,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const j=await r.json();if(j.date)b.date=String(j.date).split('-').reverse().join('/');const reg=j?.regulation||j?.points||{};const db=(typeof mergedCardDB==='function'?mergedCardDB():(Array.isArray(window.CARD_CATALOG)?window.CARD_CATALOG:[]));const byId=new Map(db.map(x=>[String(Array.isArray(x)?x[0]:x?.id),Array.isArray(x)?{id:x[0],name:x[1],type:x[3]}:x]));return b.data=Object.entries(reg).map(([id,pts])=>{const c=byId.get(String(id));const p=Number(pts);return{name:c?.name||'Carta desconocida',id:+id,status:'Points',type:c?.type||'Carta',points:Number.isFinite(p)?p:0,max:3,unknown:!c}}).filter(x=>x.points>0)}
    if(b.vector){const r=await fetch(b.vector,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const j=await r.json();if(j.date)b.date=String(j.date).split('-').reverse().join('/');return b.data=banBuildFromVector(j)}
    if(b.duelLinks){const r=await fetch('https://raw.githubusercontent.com/Sing-Jee-Tao/duel-links-deck-builder/main/data/banlist.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const j=await r.json();b.scrapedAt=j.scrapedAt||'';return b.data=banBuildFromNames(j)}
    if(b.apiBan){const r=await fetch('https://ygoprodeck.com/api/banlist/?list='+encodeURIComponent(b.apiBan==='goat'?'Goat':b.apiBan),{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const j=await r.json();const arr=Array.isArray(j)?j:(j.data||j.cards||[]);return b.data=arr.map(x=>({name:x.name||x.card_name||'',id:x.id||null,status:x.banlist_info?.ban_goat==='Forbidden'?'Forbidden':x.banlist_info?.ban_goat==='Limited'?'Limited':x.banlist_info?.ban_goat==='Semi-Limited'?'Semi-Limited':'Legal',type:x.type||'Carta',max:banMaxForStatus(x.banlist_info?.ban_goat||'Legal')})).filter(x=>x.status!=='Legal')}
    return b.data=[];
  }
  function banDeckRows(b){const byName=new Map((b.data||[]).map(x=>[banNormalizeName(x.name),x]));const byId=new Map((b.data||[]).filter(x=>x.id).map(x=>[String(x.id),x]));const rows=[];for(const zone of ['main','extra','side'])for(const c of (deckState[zone]||[])){const status=byName.get(banNormalizeName(c.name))||byId.get(String(c.id))||null;rows.push({zone,name:c.name,qty:+c.qty||1,status:status?.status||'Legal',max:status?.max??3})}return rows}
  function banRuleForCard(card){
    const b=BANLIST_PROFILES[banActive]||BANLIST_PROFILES.tcg;
    const row=(b.data||[]).find(x=>(x.id&&String(x.id)===String(card?.id))||banNormalizeName(x.name)===banNormalizeName(card?.name));
    return row||{status:'Legal',max:3};
  }
  function banBadgeForCard(card){
    const r=banRuleForCard(card); const cls=r.status==='Legal'?'legal':(r.status==='Forbidden'?'forbidden':'limited');
    return `<span class="deck-ban-badge ${cls}">${esc(banStatusLabel(r.status))}${r.status!=='Legal'?` · ${r.max}`:''}</span>`;
  }
  function banCopyLimitForName(name){
    const b=BANLIST_PROFILES[banActive]||BANLIST_PROFILES.tcg;
    const row=(b.data||[]).find(x=>banNormalizeName(x.name)===banNormalizeName(name));
    return row?.max??3;
  }
  function checkBanDeck(){
    const b=BANLIST_PROFILES[banActive],host=document.getElementById('banDeckCheck');
    if(!host)return;
    if(!b.data?.length){host.innerHTML='<div class="muted">Cargando la regulación completa para comprobar tu Deck…</div>';return}
    const rows=banDeckRows(b),violations=[];
    // Alpha 1223: max legal applies to combined Main + Extra + Side and all copies of the same official name.
    const combined=new Map();
    for(const r of rows){const key=banNormalizeName(r.name);const cur=combined.get(key)||{name:r.name,qty:0,max:r.max};cur.qty+=r.qty;cur.max=Math.min(cur.max,r.max);combined.set(key,cur)}
    for(const r of combined.values())if(r.qty>r.max)violations.push(`${r.name}: ${r.qty} copias (Main + Extra + Side) · máximo ${r.max}`);
    if(b.duelLinks){for(const group of [1,2,3]){const total=rows.filter(r=>r.status==='Limited '+group).reduce((n,r)=>n+r.qty,0);if(total>group)violations.push(`Duel Links Limit ${group}: ${total} cartas del grupo · máximo ${group}`)}}
    const legal=!violations.length;
    host.innerHTML=`<div class="ban-deck-summary"><span class="ban-pill ${legal?'ok':'bad'}">${legal?'✓ BARAJA LEGAL':'✕ BARAJA ILEGAL'}</span><span class="ban-pill">${rows.reduce((n,r)=>n+r.qty,0)} cartas comprobadas</span><span class="ban-pill">${violations.length} incidencias</span></div>${violations.length?'<div class="bad">'+violations.map(v=>'• '+esc(v)).join('<br>')+'</div>':'<div class="ok">✓ Todas las copias respetan la regulación seleccionada.</div>'}`;
    try{ if(window.renderDeck)window.renderDeck(); else if(window.renderDeckClean)window.renderDeckClean(); }catch(e){}
  }
  function renderBanFormats(){const h=document.getElementById('banFormats');if(!h)return;h.innerHTML=Object.entries(BANLIST_PROFILES).map(([id,b])=>`<button class="ban-format-card ${id===banActive?'active':''}" onclick="selectBanFormat('${id}')"><b>${esc(b.name)}</b><span>${esc(b.date)} · ${esc(b.kind)}</span></button>`).join('')}
  const banCardVisualCache=new Map();
  async function ensureBanCatalog(){
    try{
      if((!Array.isArray(window.CARD_CATALOG)||!window.CARD_CATALOG.length) && typeof window.getEmbeddedDB==='function'){
        const rows=await window.getEmbeddedDB();
        if(Array.isArray(rows)&&rows.length&&typeof window.rebuildCatalog==='function')window.rebuildCatalog(rows);
      }
    }catch(_){ }
  }
  async function enrichBanRows(rows){
    await ensureBanCatalog();
    const db=typeof window.mergedCardDB==='function'?window.mergedCardDB():(Array.isArray(window.CARD_CATALOG)?window.CARD_CATALOG:[]);
    const byId=new Map(db.map(c=>[String(c?.id??c?.[0]),c]));
    const byName=new Map(db.map(c=>[banNormalizeName(c?.name??c?.[1]),c]));
    for(const x of rows){
      const c=(x.id&&byId.get(String(x.id)))||byName.get(banNormalizeName(x.name));
      if(c){
        x.id=x.id??c.id??c[0]; x.name=(c.name??c[1]??x.name); x.type=(c.type??x.type??'Carta');
        if(x.id)x.image=x.image||`https://images.ygoprodeck.com/images/cards/${encodeURIComponent(x.id)}.jpg`;
      }
    }
    const targets=rows.filter(x=>x&&(x.id||x.name)&&(!x.image||!x.type||!x.name||x.unknown===true));
    for(let i=0;i<targets.length;i+=10){
      const batch=targets.slice(i,i+10);
      await Promise.all(batch.map(async x=>{
        const key=x.id?`id:${x.id}`:`name:${banNormalizeName(x.name)}`;
        if(banCardVisualCache.has(key)){Object.assign(x,banCardVisualCache.get(key));return}
        try{
          const param=x.id?`id=${encodeURIComponent(x.id)}`:`name=${encodeURIComponent(x.name)}`;
          const r=await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?'+param,{cache:'force-cache'}); if(!r.ok)throw Error('HTTP '+r.status);
          const c=(await r.json())?.data?.[0];
          if(c){const v={id:c.id||x.id,name:c.name||x.name,type:c.type||x.type||'Carta',image:c.card_images?.[0]?.image_url||`https://images.ygoprodeck.com/images/cards/${c.id}.jpg`};Object.assign(x,v);banCardVisualCache.set(key,v)}
        }catch(_){if(x.id)x.image=`https://images.ygoprodeck.com/images/cards/${encodeURIComponent(x.id)}.jpg`}
      }));
    }
    return rows;
  }
  async function renderBanlist(){const b=BANLIST_PROFILES[banActive]||BANLIST_PROFILES.tcg,host=document.getElementById('banResult');if(!host)return;renderBanFormats();await ensureBanCatalog();const label=document.getElementById('banUpdatedLabel');if(label)label.textContent=`${b.name} · ${b.date}`;const src=document.getElementById('banSource');if(src)src.innerHTML=`<b>${esc(b.note)}</b><br><a href="${b.source}" target="_blank" rel="noopener">Abrir fuente →</a>`;try{await (window.fetchBanData||fetchBanData)(b)}catch(e){host.innerHTML=`<div class="result muted" style="grid-column:1/-1"><b>No se pudo cargar la lista completa.</b><br>${esc(e.message||e)}<br><a href="${b.source}" target="_blank" rel="noopener">Consultar fuente →</a></div>`;checkBanDeck();return}if(label)label.textContent=`${b.name} · ${b.date}`;const q=(document.getElementById('banSearch')?.value||'').trim().toLowerCase(),filter=document.getElementById('banFilter')?.value||'';await enrichBanRows(b.data||[]);let rows=(b.data||[]).filter(x=>(!q||String(x.name||'').toLowerCase().includes(q))&&(!filter||x.status===filter));host.innerHTML=rows.length?rows.map(x=>`<div class="ban-card ${x.status.toLowerCase().replace(/[^a-z0-9]+/g,'-')}"><div class="ban-card-visual">${x.image?`<img loading="lazy" src="${x.image}" alt="${esc(x.name)}" onerror="this.style.opacity=.25">`:'<div class="card-thumb-placeholder">Sin imagen</div>'}</div><div class="ban-card-info"><b>${esc(x.name||'Carta desconocida')}</b><div class="ban-meta">${esc(x.type||'Carta')}</div><div class="ban-status">${esc(banStatusLabel(x.status))} · máx. ${x.max}</div></div></div>`).join(''):'<div class="result muted" style="grid-column:1/-1">No hay coincidencias. Las cartas no listadas se consideran LEGAL con máximo 3 copias, salvo reglas especiales.</div>';checkBanDeck()}
  async function selectBanFormat(id){banActive=BANLIST_PROFILES[id]?id:'tcg';window.__YGO_ACTIVE_BAN_KEY=banActive;try{if(window.renderDeck)window.renderDeck();}catch(e){}const q=document.getElementById('banSearch');if(q)q.value='';const f=document.getElementById('banFilter');if(f)f.value='';await renderBanlist();}
  window.renderBanlist=renderBanlist;window.selectBanFormat=selectBanFormat;window.checkBanDeck=checkBanDeck;window.loadBanProfileData=async function(id='tcg'){banActive=BANLIST_PROFILES[id]?id:'tcg';window.__YGO_ACTIVE_BAN_KEY=banActive;const b=BANLIST_PROFILES[banActive];try{await (window.fetchBanData||fetchBanData)(b);checkBanDeck();return b}catch(e){console.warn('Banlist data',e);return b}};

  function analyzeSavedDeckSynergy(){const decks=getSaved();const host=document.getElementById('savedArchetypeSynergy');if(!host)return;if(decks.length<2){host.innerHTML='Guarda al menos 2 barajas para evaluar conexiones.';return}const rows=[];for(let i=0;i<decks.length;i++)for(let j=i+1;j<decks.length;j++){const A=decks[i],B=decks[j],ac=rankDeckArchetypeSynergy(A.deckState?.main||[]),bc=rankDeckArchetypeSynergy(B.deckState?.main||[]);const common=ac.filter(x=>bc.some(y=>y.name===x.name)).reduce((n,x)=>n+x.score,0);const bridge=ac.slice(0,5).reduce((n,x)=>n+bc.slice(0,5).reduce((m,y)=>m+(x.name===y.name?30:0),0),0);const score=Math.min(100,Math.round(common*2+bridge));rows.push({a:A.name||'Baraja A',b:B.name||'Baraja B',score,common:[...new Set([...ac.slice(0,3),...bc.slice(0,3)].map(x=>x.name))]})}rows.sort((a,b)=>b.score-a.score);host.innerHTML=rows.slice(0,20).map((r,i)=>`<div class="synergy-row"><b>${i+1}. ${esc(r.a)} ↔ ${esc(r.b)}</b><span>${r.score}%</span><small>${esc(r.common.join(' · ')||'Arquetipos diferentes; sinergia basada en roles y funciones compartidas.')}</small></div>`).join('')}
  function ensureSavedPanel(){
    if(document.getElementById('savedDeckPanel'))return;
    const bottom=document.querySelector('.bottom');
    const fallback=document.getElementById('savedDecks')?.closest('.saved-load-body');
    if(!bottom&&!fallback)return;
    const sec=document.createElement(bottom?'section':'details');
    sec.id='savedDeckPanel';
    sec.className=bottom?'box':'alpha854-opponent-panel';
    const title=bottom?'<div class="boxTitle">▣ CARGAR Y COMPARAR</div>':'<summary>▣ COMPARAR BARAJAS GUARDADAS</summary>';
    sec.innerHTML=title+`<div class="${bottom?'pad':'alpha854-opponent-body'}"><div class="saved-compare-title">COMPARAR BARAJAS</div><div class="adv-row" style="margin-bottom:8px"><select class="adv-select" id="compareA"></select><select class="adv-select" id="compareB"></select><button type="button" class="adv-btn gold" onclick="compareSaved()">COMPARAR BARAJAS</button></div><div id="savedCompareResult" class="result" style="margin-top:9px"></div><div class="saved-compare-title" style="margin-top:12px">SINERGIA ENTRE BARAJAS</div><button type="button" class="adv-btn" onclick="analyzeSavedDeckSynergy()">♛ EVALUAR CONEXIONES</button><div id="savedArchetypeSynergy" class="result" style="margin-top:9px"></div></div>`;
    if(bottom)bottom.parentNode.insertBefore(sec,bottom.nextSibling);
    else { // Popover contraído fuera del flujo: conservar coordenadas de los paneles existentes.
      fallback.style.position='relative';
      sec.style.cssText='position:absolute;left:0;right:0;top:100%;z-index:30;box-sizing:border-box';
      fallback.appendChild(sec);
    }
  }
  async function hydrateCardOnline(card){
    if(!card||card.__ygoHydrated)return card;
    const id=card.id||card.passcode||card.cid;if(!id)return card;
    const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),1800);
    try{
      const r=await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${encodeURIComponent(id)}`,{cache:'force-cache',signal:ctl.signal});
      if(!r.ok)throw Error('HTTP '+r.status);
      const c=(await r.json())?.data?.[0];
      if(c){
        Object.assign(card,{id:c.id||card.id,name:c.name||card.name,desc:c.desc||card.desc,type:c.type||card.type,frameType:c.frameType||card.frameType,
          typeline:c.typeline||card.typeline,attribute:c.attribute||card.attribute,race:c.race||card.race,level:Number(c.level)||0,rank:Number(c.rank)||0,
          linkval:Number(c.linkval)||0,scale:Number(c.scale)||0,linkmarkers:c.linkmarkers||card.linkmarkers,atk:Number(c.atk)||0,def:Number(c.def)||0,
          archetype:c.archetype||card.archetype,archetypes:Array.isArray(c.archetypes)?c.archetypes:(card.archetypes||[]),card_images:c.card_images||card.card_images,__ygoHydrated:true});
        try{delete card.unknown}catch(_){card.unknown=false}
        const local=CARD_CATALOG.find(x=>String(x.id)===String(card.id));if(local)Object.assign(local,{...card,qty:1});
      }
    }catch(_){}finally{clearTimeout(timer)}
    return card;
  }
  async function hydrateDeckCards(state=deckState){
    const cards=['main','extra','side'].flatMap(z=>state?.[z]||[]);
    const unique=[...new Map(cards.map(c=>[String(c.id||c.name),c])).values()].filter(c=>c&&!c.__ygoHydrated&&(c.id||c.passcode));
    // Monstruos primero: sus Level/Rank/Link/ATK/DEF son los datos que más afectan materiales y End Boards.
    unique.sort((a,b)=>(/monster|monstruo/i.test(String(b.type||''))?1:0)-(/monster|monstruo/i.test(String(a.type||''))?1:0));
    for(let i=0;i<unique.length;i+=6){await Promise.all(unique.slice(i,i+6).map(hydrateCardOnline));if(i+6<unique.length)await new Promise(r=>setTimeout(r,350));}
    return state;
  }
  window.hydrateCardOnline=hydrateCardOnline;window.hydrateDeckCards=hydrateDeckCards;
  async function init(){
    ensureSavedPanel();renderSaved();
    renderDeckClean();checkBanDeck();try{const first=deckState.main?.[0];if(first)selectCardDetail(first.name)}catch{}
    let __alpha554CatalogWarmPromise=null;
    window.YGOAlpha554WarmCatalog=function(){
      if(__alpha554CatalogWarmPromise)return __alpha554CatalogWarmPromise;
      try{renderCatalogClean();renderDeckClean();renderComboDeckCards()}catch(e){console.warn('Catálogo inmediato',e)}
      __alpha554CatalogWarmPromise=Promise.resolve(true);
      const enrich=async()=>{
        try{if(!Array.isArray(CARD_CATALOG)||CARD_CATALOG.length<19000)await loadOfflineDB()}catch(e){console.warn('Base local',e)}
        try{await loadArchetypeMap();assignCardArchetypes();renderArchetypeSelectors();renderDB()}catch(e){console.warn('Arquetipos locales',e)}
        try{renderCatalogClean();renderDeckClean();renderComboDeckCards()}catch(_){}
      };
      if(typeof window.requestIdleCallback==='function')window.requestIdleCallback(()=>enrich(),{timeout:5000});else setTimeout(enrich,1200);
      return __alpha554CatalogWarmPromise;
    };

    /* Online enrichment is on-demand; never compete with deck loading/calculation. */
  }
  if(document.readyState==='complete')setTimeout(()=>{init().catch(e=>console.error('INIT',e));},50);else{const __ygoInitOnComplete=()=>{if(document.readyState==='complete'){document.removeEventListener('readystatechange',__ygoInitOnComplete);setTimeout(()=>{init().catch(e=>console.error('INIT',e));},50)}};document.addEventListener('readystatechange',__ygoInitOnComplete)};
  // Session persistence is owned by ui-state.js, also on normal edits and
  // visibility changes. Do not overwrite recoverable state with a stale score.
  window.addEventListener('beforeunload',()=>{try{W.YGOUIState?.saveSession?.()}catch{}});
})();

/* ================================================================
   YGO RULING ENGINE v4 · MOTOR DE ESTADOS + COMPILADOR PSCT
   ----------------------------------------------------------------
   El motor usa el texto de cada carta como fuente primaria y separa:
   condiciones -> activación/costes/objetivos -> resolución.
   Incluye un núcleo determinista de turnos, cadenas, SEGOC, Damage
   Step, materiales, efectos continuos y replacement hooks. Cuando una
   interacción depende de una excepción individual que no puede
   deducirse del texto/estado, se marca como NO DETERMINABLE en lugar
   de inventar un ruling.
   ================================================================ */
const YGORulingEngine=(()=>{
  'use strict';
  const ZONES=['deck','hand','monster','spelltrap','gy','banished','extra','overlay'];
  const SPEED={NORMAL:1,QUICK:2,COUNTER:3};
  const cardId=c=>String(c?.id||c?.passcode||c?.cid||c?.name||'');
  const PHASES=['DRAW','STANDBY','MAIN 1','BATTLE START','BATTLE STEP','DAMAGE STEP START','BEFORE DAMAGE CALCULATION','DAMAGE CALCULATION','AFTER DAMAGE CALCULATION','BATTLE END','MAIN 2','END'];
  const FAST_TIMINGS=['DRAW','STANDBY','MAIN 1','BATTLE STEP','DAMAGE STEP START','BEFORE DAMAGE CALCULATION','DAMAGE CALCULATION','AFTER DAMAGE CALCULATION','BATTLE END','MAIN 2','END'];
  const clone=o=>JSON.parse(JSON.stringify(o));
  const norm=s=>String(s??'').replace(/[“”]/g,'"').replace(/[’]/g,"'").replace(/\s+/g,' ').trim();
  const low=s=>norm(s).toLowerCase();
  const cardByName=name=>allCards().find(c=>String(c.name)===String(name))||CARD_CATALOG.find(c=>String(c.name)===String(name))||null;
  const cardText=c=>norm(c?.desc||c?.text||'');
  const cardType=c=>low(c?.type||'');
  const isMonster=c=>/monster|monstruo/.test(cardType(c));
  const isSpell=c=>/spell|mágica/.test(cardType(c));
  const isTrap=c=>/trap|trampa/.test(cardType(c));
  const isTuner=c=>{const t=cardType(c),bits=Number(c?.typeBits);return !/non[- ]?tuner|no afinador|no[- ]afinador/.test(t)&&(/\btuner\b|\bafinador\b/.test(t)||(Number.isSafeInteger(bits)&&(bits&4096)!==0));};
  const flatZone=z=>{const a=deckState?.[z]||[];return a.flatMap(c=>Array.from({length:Math.max(0,Number(c.qty||1))},()=>c));};
  const makeItem=(c,uid,owner)=>({uid,owner,controller:owner,card:clone(c),faceUp:false,position:'ATK',setTurn:null,previousZone:null,previousPosition:null,previousController:owner,previousFaceUp:false,materials:[],counters:{},negated:false,negatedActivation:false,negatedEffect:false,continuous:false,disabled:false,attachedTo:null,summonType:null,summonTurn:null,summonPlayer:null,wasSummoned:true,locationHistory:[],effectUses:{},flags:{}});
  function makeState(opts={}){
    const main=flatZone('main').map((c,i)=>makeItem(c,'D'+i,0));
    const extra=flatZone('extra').map((c,i)=>makeItem(c,'E'+i,0));
    const st={version:3,turn:Number(opts.turn)||1,activePlayer:Number(opts.activePlayer)||0,phase:opts.phase||'DRAW',priority:Number.isInteger(opts.priority)?opts.priority:0,
      lp:[8000,8000],normalSummonAvailable:[true,true],normalSummonCount:[0,0],turnFlags:[{},{}],
      zones:[{deck:main,hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra,overlay:[]},{deck:[],hand:[],monster:[],spelltrap:[],gy:[],banished:[],extra:[],overlay:[]}],
      chain:[],triggerQueue:[],continuousEffects:[],replacementEffects:[],oncePerTurn:{},oncePerDuel:{},events:[],log:[],lastEvent:null,
      pendingChoices:null,pendingTriggers:[],lastDamage:null,combat:null,window:{kind:'START',open:true},summonLocks:[],activationLocks:[],restrictionLocks:[],
      analysis:{actions:0,successfulActivations:0,successfulSummons:0,draws:0,searches:0,interactions:0,removals:0,recursions:0,negates:0,materialsUsed:0,resourcesSpent:0,illegalAttempts:0}
    };
    if(opts.lp)st.lp=[Number(opts.lp[0])||8000,Number(opts.lp[1])||8000];
    if(opts.openingHand!==false){for(let i=0;i<5;i++)draw(st,0,1,false);}
    rebuildContinuous(st); return st;
  }
  function locate(st,uid){for(let p=0;p<2;p++)for(const z of ZONES){const a=st.zones[p][z]||[];const i=a.findIndex(x=>x.uid===uid);if(i>=0)return{p,z,i,item:a[i]};}return null;}
  const zone=(st,p,z)=>st.zones[p]?.[z]||[];
  function log(st,msg){if(!st||typeof st!=='object')return;const a=Array.isArray(st.log)?st.log:(st.log=[]);a.push(`[T${st.turn??'?'} · ${st.phase??'?'} · P${(Number(st.priority)||0)+1}] ${msg}`);}
  function recordEvent(st,type,data={},cause=null){const e={id:st.events.length+1,type,data:clone(data),turn:st.turn,phase:st.phase,activePlayer:st.activePlayer,priority:st.priority,cause:cause?clone(cause):null,timestamp:Date.now()};st.lastEvent=e;st.events.push(e);queueTriggers(st,e);return e;}
  function remove(st,uid){const q=locate(st,uid);if(!q)return null;return zone(st,q.p,q.z).splice(q.i,1)[0]||null;}
  function move(st,uid,p,z,reason='MOVE',extra={}){
    const q=locate(st,uid); if(!q)return{ok:false,reason:'Carta no encontrada.'};
    const item=q.item; const from=q.z; const fromP=q.p; const fromFaceUp=item.faceUp!==false;
    const rep=applyReplacement(st,{type:reason,uid,item,from,to:z,player:p,...extra});
    if(!rep.ok)return rep;
    if(rep.cancel)return{ok:true,item,cancelled:true,replacedBy:rep.replacedBy};
    let destination=rep.replacedTo||z;
    if(['hand','deck'].includes(destination)&&/fusion|synchro|xyz|link|fusión|sincro|enlace/.test(cardType(item.card)))destination='extra';
    const linkedMaterials=from==='monster'&&destination!=='monster'&&Array.isArray(item.materials)?[...item.materials]:[];
    const checkpoint=linkedMaterials.length?snapshot(st):null;
    const controller=extra.controller!==undefined?extra.controller:item.controller;
    zone(st,fromP,from).splice(q.i,1); item.previousZone=from; item.previousPosition=item.position; item.previousController=item.controller;
    if(destination==='monster'&&isMonster(item.card))item.faceUp=true;
    if(destination==='spelltrap')item.faceUp=!!extra.faceUp;
    item.controller=destination==='gy'||destination==='banished'||destination==='deck'||destination==='hand'||destination==='extra'?item.owner:controller;
    const ownerZone=['gy','banished','deck','hand','extra','overlay'].includes(destination);
    const destinationPlayer=ownerZone&&(item.owner===0||item.owner===1)?item.owner:p;
    if(from==='overlay'&&destination!=='overlay')item.attachedTo=null;
    zone(st,destinationPlayer,destination).push(item);
    recordEvent(st,reason,{player:destinationPlayer,uid,item:item.card.name,from,fromPlayer:fromP,to:destination,reason,replacedBy:rep.replacedBy||null,effect:extra.effect===true,sourceUid:extra.sourceUid||null,sourcePlayer:extra.sourcePlayer??null,faceUpBefore:fromFaceUp});
    for(const materialUid of linkedMaterials){
      const attached=locate(st,materialUid);
      if(!attached||attached.z!=='overlay'||attached.item.attachedTo!==uid){restore(st,checkpoint);return{ok:false,reason:'Estado Xyz inconsistente.'};}
      const rr=move(st,materialUid,attached.p,'gy','XYZ_MATERIAL_SENT');
      if(!rr?.ok||rr.cancelled||rr.destination!=='gy'){restore(st,checkpoint);return{ok:false,reason:'No se pudo liberar un material Xyz.'};}
    }
    if(linkedMaterials.length)item.materials=[];
    if(reason==='DESTROY')log(st,`${item.card.name} es destruida y enviada a ${destination.toUpperCase()}.`); else if(reason==='SEND')log(st,`${item.card.name} es enviada a ${destination.toUpperCase()}.`); else log(st,`${item.card.name}: ${from.toUpperCase()} → ${destination.toUpperCase()}.`);
    return{ok:true,item,destination,replacedBy:rep.replacedBy||null};
  }
  function draw(st,p,n=1,write=true){for(let i=0;i<n;i++){const x=zone(st,p,'deck').shift();if(!x){if(write){log(st,'No se puede robar: Deck vacío.');recordEvent(st,'DECK_OUT',{player:p});}break;}zone(st,p,'hand').push(x);st.analysis.draws++;if(write)log(st,`${x.card.name} se añade a la mano por Robo.`);recordEvent(st,'DRAW',{player:p,uid:x.uid});}}

  /* ---------- PSCT compiler ---------- */
  function splitClauses(text){return norm(text).split(/(?<=[.!?])\s+/).map(norm).filter(Boolean);}
  function parseCosts(t){
    const s=norm(t),out=[];
    const add=(re,fn)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g';for(const m of s.matchAll(new RegExp(re.source,flags)))out.push({index:m.index,cost:fn(m)});};
    add(/pay\s+(\d[\d,]*)\s*LP/i,m=>({kind:'LP',amount:+m[1].replace(/,/g,'')}));
    add(/pay\s+(?:half|½)\s+(?:your )?LP/i,()=>({kind:'LP_HALF',amount:null}));
    add(/discard\s+(\d+)\s+cards?/i,m=>({kind:'DISCARD',amount:+m[1]}));
    add(/discard\s+(?:a|one)\s+card\b/i,()=>({kind:'DISCARD',amount:1}));
    add(/send\s+(this card|1 card|a card)\s+to\s+(?:the )?Graveyard/i,m=>({kind:'SEND_GY',amount:1,self: /^this card$/i.test(m[1])}));
    add(/banish\s+(this card|1 card|a card)(?:\s+from[^.;]*)?/i,m=>({kind:'BANISH',amount:1,self: /^this card$/i.test(m[1])}));
    add(/tribute\s+(?:this card|1 monster|a monster)/i,()=>({kind:'TRIBUTE',amount:1,self:true}));
    add(/detach\s+(?:1|a)\s+material/i,()=>({kind:'DETACH',amount:1}));
    add(/reveal\s+(?:1|a)\s+card/i,()=>({kind:'REVEAL',amount:1}));
    add(/shuffle\s+(?:1|a)\s+card/i,()=>({kind:'SHUFFLE',amount:1}));
    add(/destroy\s+(?:this card|1 card|a card)/i,()=>({kind:'DESTROY',amount:1,self:true}));
    return out.sort((a,b)=>a.index-b.index).map(x=>x.cost);
  }
  function parseTargets(t){const s=norm(t),out=[];if(!/\btarget\b|selecciona como objetivo|elige como objetivo/i.test(s))return out;let m;const re=/target\s+(\d+|a|an|one|up to \d+)\s+([^;]+)/ig;while((m=re.exec(s)))out.push({count:/up to/i.test(m[1])?{min:0,max:+m[1].match(/\d+/)[0]}:+(m[1].match(/\d+/)||[1])[0],description:norm(m[2])});if(!out.length)out.push({count:1,description:s});return out;}
  function parseRestrictions(t){const s=norm(t),l=low(s),r={oncePerTurn:/once per turn|una vez por turno/.test(l),oncePerChain:/once per chain|una vez por cadena/.test(l),oncePerDuel:/once per duel|una vez por duelo/.test(l),onlyOnce:/you can only use|solo puedes usar/.test(l),locations:[],summonLocks:[],typeLocks:[],phaseLocks:[]};
    ['your hand','your Deck','your Graveyard','your field','banished','Extra Deck','mano','deck','cementerio','campo','desterrad'].forEach(x=>{if(l.includes(x.toLowerCase()))r.locations.push(x)});
    const lm=s.match(/You can only Special Summon[^.]+/i)||s.match(/Solo puedes Invocar de Modo Especial[^.]+/i);if(lm)r.summonLocks.push(lm[0]);
    const tm=s.match(/You cannot Special Summon[^.]+/i)||s.match(/No puedes Invocar de Modo Especial[^.]+/i);if(tm)r.summonLocks.push(tm[0]);
    return r;
  }
  function parseTiming(t){const s=norm(t),l=low(s),lead=l.split(/[;:]/)[0];const trigger=/^(when|cuándo|cuando)\b/.test(lead)||(/^(if|si)\b/.test(lead)&&!/(if|si) you control|^(if|si) controlas/.test(lead)&&/this card|this monster|this spell|this trap|esta carta|este monstruo/.test(lead));return{quick:/quick effect|during either player's turn|during your opponent's turn|efecto rápido|durante el turno de cualquier jugador/.test(l),trigger,damageStep:/damage step|damage calculation|etapa de daño|cálculo de daño/.test(l),ignition:/once per turn.*you can|during your main phase/.test(l),phase:(s.match(/during (the )?(draw|standby|main|battle|end) phase/ig)||[])};}
  function parseSteps(t){
    const parts=norm(t).split(/\s+(then|also|and if you do|and only if|otherwise|but|also,? if you do|y si lo haces|después|entonces)\s+/i);const steps=[];
    if(parts.length===1)return[{text:parts[0],conjunction:'start',mandatory:true}];
    for(let i=0;i<parts.length;i+=2)steps.push({text:parts[i],conjunction:i?low(parts[i-1]):'start',mandatory:true});return steps;
  }
  function classifyEffect(t){const s=low(t);if(/special summon|invoca.*especial/.test(s))return'SPECIAL_SUMMON';if(/ritual summon|invoc.*ritual/.test(s))return'RITUAL_SUMMON';if(/fusion summon|fusion/.test(s)&&/extra deck/.test(s))return'FUSION_SUMMON';if(/synchro summon|sincro/.test(s))return'SYNCHRO_SUMMON';if(/xyz summon|exceed|overlay|rango/.test(s))return'XYZ_SUMMON';if(/link summon|enlace/.test(s))return'LINK_SUMMON';if(/destroy|destruye/.test(s))return'DESTROY';if(/banish|destierra/.test(s))return'BANISH';if(/draw|roba/.test(s))return'DRAW';if(/add .*deck.*hand|añade .*deck.*mano|add .*to your hand/.test(s))return'SEARCH';if(/return .*hand|devuelve .*mano/.test(s))return'RETURN';if(/send .*graveyard|manda .*cementerio/.test(s))return'SEND';if(/negate|niega/.test(s))return'NEGATE';if(/gain .*lp|gana .*lp/.test(s))return'GAIN_LP';if(/inflict .*damage|inflige .*daño/.test(s))return'BURN';if(/change.*atk|change.*def|cambia.*atk|cambia.*def/.test(s))return'MODIFY_STATS';if(/set .*card|coloca .*carta/.test(s))return'SET';return'OTHER';}
  function parsePSCT(text){const clauses=splitClauses(text),effects=[];for(const raw of clauses){const colon=raw.indexOf(':');let condition=colon>=0?norm(raw.slice(0,colon)):'';let rest=colon>=0?norm(raw.slice(colon+1)):raw;if(!condition){const cm=norm(raw).match(/^(?:if|when|si|cuando|cuándo)\b[^,;]+(?=,|;|$)/i);if(cm)condition=cm[0];}if(condition&&colon<0){rest=norm(raw).slice(condition.length).replace(/^\s*[,;:]\s*/,'')||raw;}const semi=rest.indexOf(';');const activation=semi>=0?norm(rest.slice(0,semi)):'';const resolution=semi>=0?norm(rest.slice(semi+1)):rest;const src=condition+' '+activation+' '+resolution;effects.push({id:effects.length+1,raw,condition,activation,resolution,costs:parseCosts(activation||rest),targets:parseTargets(activation||rest),restriction:parseRestrictions(src),timing:parseTiming(condition||src),steps:parseSteps(resolution),kind:classifyEffect(resolution),semantic:compileSemantic(resolution)});}return effects;}
  function compileSemantic(t){const s=low(t);return{draw:/\bdraw\b|\broba\b/.test(s),search:/add .*from .*deck|search|añade .*deck|busca/.test(s),summon:/summon|invoca/.test(s),special:/special summon|invoca.*especial/.test(s),destroy:/destroy|destruye/.test(s),banish:/banish|destierra/.test(s),send:/send .*graveyard|manda .*cementerio/.test(s),return:/return .*hand|devuelve .*mano/.test(s),negate:/negate|niega/.test(s),damage:/damage|daño/.test(s),target:/\btarget\b|objetivo/.test(s),continuous:/while|as long as|mientras|mientras esta carta esté/.test(s),replacement:/instead|en su lugar|would be destroyed/.test(s)};}
  function resolveCardData(c){
    if(!c)return c;
    const id=String(c?.id??'');
    if(!id)return c;
    try{
      const db=typeof W.mergedCardDB==='function'?W.mergedCardDB():(Array.isArray(W.CARD_CATALOG)?W.CARD_CATALOG:[]);
      const hit=(db||[]).find(x=>String(Array.isArray(x)?x[0]:x?.id)===id);
      if(!hit)return c;
      const h=Array.isArray(hit)?{id:hit[0],name:hit[1],type:hit[3],desc:hit[4],atk:hit[5],def:hit[6],level:hit[7],race:hit[8],attribute:hit[9],archetype:hit[10]}:hit;
      return {...h,...c,desc:c?.desc||c?.description||h?.desc||h?.description,text:c?.text||h?.text,archetype:c?.archetype||h?.archetype,archetypes:c?.archetypes||h?.archetypes,role:c?.role||h?.role,advancedRoles:c?.advancedRoles||h?.advancedRoles,atk:c?.atk??h?.atk,def:c?.def??h?.def,level:c?.level??h?.level,rank:c?.rank??h?.rank,linkval:c?.linkval??h?.linkval,linkRating:c?.linkRating??h?.linkRating};
    }catch(_){return c;}
  }
  function parseCard(c){const rc=resolveCardData(c),text=cardText(rc),effects=parsePSCT(text);if(/you can only use each effect(?: of [^.]*)? once per turn|you can only use each of the (?:following )?effects(?: of [^.]*)? once per turn|each effect(?: of [^.]*)? can only be used once per turn/i.test(text)){for(const e of effects){if(e&&!e.nonActivatable)e.restriction={...(e.restriction||{}),oncePerTurn:true,onlyOnce:true,alpha569CardWideEachEffect:true}}}return{card:rc,text,effects,metadata:{type:rc?.type||'',role:rc?.role||'',archetype:rc?.archetype||'',level:Number(rc?.level)||0,rank:Number(rc?.rank)||0,linkval:Number(rc?.linkval||rc?.linkRating)||0,atk:Number(rc?.atk)||0,def:Number(rc?.def)||0}};}

  /* ---------- exact-ish state / costs / targets ---------- */
  function conditionSatisfied(st,p,text,ctx={}){const s=low(text);if(!s)return true;const item=ctx.uid?locate(st,ctx.uid)?.item:null;if(/your opponent controls|tu adversario controla|opponent controls/.test(s)&&!zone(st,1-p,'monster').length&&!zone(st,1-p,'spelltrap').length)return false;if(/if you control no|si no controlas/.test(s)){if(zone(st,p,'monster').length+zone(st,p,'spelltrap').length)return false;}else if(/you control|tú controlas|controlas/.test(s)&&!zone(st,p,'monster').length&&!zone(st,p,'spelltrap').length)return false;if(/in your hand|en tu mano/.test(s)&&ctx.uid&&locate(st,ctx.uid)?.z!=='hand')return false;if(/in your graveyard|en tu cementerio/.test(s)&&ctx.uid&&locate(st,ctx.uid)?.z!=='gy')return false;if(/during your main phase|durante tu main phase/.test(s)&&!/^MAIN [12]$/.test(st.phase))return false;if(/during the damage step|durante el damage step/.test(s)&&!st.phase.includes('DAMAGE'))return false;if(/during either player's turn|during either player's turn/.test(s)===false&&/during your opponent's turn/.test(s)&&st.activePlayer===p)return false;if(/once per turn|una vez por turno/.test(s)&&st.oncePerTurn[`${p}|${ctx.card?.name||''}|${ctx.effectId||0}`])return false;if(/once per duel|una vez por duelo/.test(s)&&st.oncePerDuel[`${p}|${ctx.card?.name||''}|${ctx.effectId||0}`])return false;if(/if you control a monster|si controlas un monstruo/.test(s)&&!zone(st,p,'monster').length)return false;if(/if this card was special summoned|si esta carta fue invocada especialmente/.test(s)&&item?.summonType!=='SPECIAL_SUMMON')return false;return true;}
  function targetPool(st,p,description,sourceUid=null){const s=low(description),opponent=/opponent(?:'s)?|adversary|adversario|oponente/.test(s),own=/\byour\b|tú controlas|tu campo|tu mano|tu cementerio|tu deck|tu mazo/.test(s)&&!opponent,either=/\beither\b|cualquier cementerio|any gy|any graveyard|either gy|either graveyard|on the field|en el campo|any field|either field/.test(s);let players=either&&!own&&!opponent?[p,1-p]:[opponent?1-p:p],arr=[];
    const gather=z=>players.flatMap(pp=>zone(st,pp,z));
    if(/hand|mano/.test(s))arr=gather('hand');
    else if(/graveyard|\bgy\b|cementerio/.test(s))arr=gather('gy');
    else if(/banished|banishment|desterrad/.test(s))arr=gather('banished');
    else if(/extra deck|deck extra/.test(s))arr=gather('extra');
    else if(/\bdeck\b|mazo/.test(s))arr=gather('deck');
    else arr=players.flatMap(pp=>[...zone(st,pp,'monster'),...zone(st,pp,'spelltrap')]);
    const wantsSpell=/spell|mágica/.test(s),wantsTrap=/trap|trampa/.test(s);if(/monster|monstruo/.test(s))arr=arr.filter(x=>isMonster(x.card));if(wantsSpell&&wantsTrap)arr=arr.filter(x=>isSpell(x.card)||isTrap(x.card));else if(wantsSpell)arr=arr.filter(x=>isSpell(x.card));else if(wantsTrap)arr=arr.filter(x=>isTrap(x.card));
    if(/face-up|boca arriba/.test(s))arr=arr.filter(x=>x.faceUp);if(/face-down|boca abajo/.test(s))arr=arr.filter(x=>!x.faceUp);if(/defense position|posición de defensa|posicion de defensa/.test(s))arr=arr.filter(x=>String(x.position||'').toUpperCase().includes('DEF'));if(/attack position|posición de ataque|posicion de ataque/.test(s))arr=arr.filter(x=>!String(x.position||'ATK').toUpperCase().includes('DEF'));
    const quoted=[...String(description||'').matchAll(/["“]([^"”]+)["”]/g)].map(m=>low(m[1])).filter(Boolean);if(quoted.length===1){const q=quoted[0],familyRef=/["”]\s+(?:monster|spell|trap|card)s?\b/i.test(String(description||''));arr=arr.filter(x=>{const c=x?.card||x||{},n=low(c?.name),a=[low(c?.archetype),...((Array.isArray(c?.archetypes)?c.archetypes:[]).map(low))];return familyRef?(n===q||n.includes(q)||a.some(v=>v===q||v.includes(q))):n===q})}
    let lm=s.match(/level\s+(\d+)\s+or lower/);if(lm)arr=arr.filter(x=>(Number(x?.card?.level)||0)>0&&(Number(x?.card?.level)||0)<=Number(lm[1]));lm=s.match(/level\s+(\d+)\s+or higher/);if(lm)arr=arr.filter(x=>(Number(x?.card?.level)||0)>=Number(lm[1]));if((lm=s.match(/(?:^|\s)level\s+(\d+)(?!\s+or)/)))arr=arr.filter(x=>(Number(x?.card?.level)||0)===Number(lm[1]));
    for(const at of ['dark','light','earth','water','fire','wind','divine'])if(new RegExp(`(?:^|\\s)${at}(?:\\s|$)`).test(s))arr=arr.filter(x=>low(x?.card?.attribute)===at);
    for(const rc of ['warrior','spellcaster','fiend','fairy','machine','cyberse','beast','aqua','rock','plant','zombie','wyrm','illusion','fish','reptile','dragon','thunder','psychic','pyro','sea serpent','winged beast','insect','dinosaur'])if(new RegExp(`(?:^|\\s)${rc.replace(' ','\\s+')}(?:-type)?(?:\\s|$)`).test(s))arr=arr.filter(x=>low(x?.card?.race)===rc);
    if(/equip spell/.test(s))arr=arr.filter(x=>low(x?.card?.race)==='equip'||/equip/i.test(String(x?.card?.type||'')));if(/pendulum monster/.test(s))arr=arr.filter(x=>/pendulum/i.test(String(x?.card?.type||'')));if(/fusion(?:,|\s|\/)?.*monster/.test(s)&&!/synchro|xyz|link/.test(s))arr=arr.filter(x=>/fusion/i.test(String(x?.card?.type||'')));if(/synchro(?:,|\s|\/)?.*monster/.test(s)&&!/fusion|xyz|link/.test(s))arr=arr.filter(x=>/synchro/i.test(String(x?.card?.type||'')));if(/xyz(?:,|\s|\/)?.*monster/.test(s)&&!/fusion|synchro|link/.test(s))arr=arr.filter(x=>/xyz/i.test(String(x?.card?.type||'')));
    if(sourceUid&&/another|other than this card|otro|otra|distinta de esta carta/.test(s))arr=arr.filter(x=>String(x.uid)!==String(sourceUid));
    const seen=new Set();arr=arr.filter(x=>{const k=String(x?.uid);if(seen.has(k))return false;seen.add(k);return true});
    if(window.YGOAlpha313Core?.filterTargetPool)arr=window.YGOAlpha313Core.filterTargetPool(st,p,arr,{description:s,sourceUid});return arr;
  }
  function legalTargets(st,p,effect,chosen=[],sourceUid=null){return effect.targets.map(t=>{const pool=targetPool(st,p,t.description,sourceUid);const ids=new Set(chosen);return{pool:pool.filter(x=>!ids.has(x.uid)&&!x.negatedActivation),count:t.count,description:t.description};});}
  function ensureTargets(st,p,effect,chosen,sourceUid=null){
    const specs=Array.isArray(effect?.targets)?effect.targets:[],ids=Array.isArray(chosen)?chosen:[];
    if(!specs.length)return ids.length?{ok:false,reason:'El efecto no requiere objetivos.'}:{ok:true};
    if(new Set(ids.map(String)).size!==ids.length)return{ok:false,reason:'Un mismo objetivo fue seleccionado más de una vez.'};
    const rows=specs.map(t=>{const pool=new Set(targetPool(st,p,t.description,sourceUid).map(x=>String(x.uid))),c=t.count,min=typeof c==='number'?Math.max(0,c):Math.max(0,Number(c?.min)||0),max=typeof c==='number'?Math.max(0,c):Math.max(min,Number(c?.max??c?.min)||0);return{pool,min,max,description:t.description}});
    const minTotal=rows.reduce((n,x)=>n+x.min,0),maxTotal=rows.reduce((n,x)=>n+x.max,0);
    if(ids.length<minTotal)return{ok:false,reason:`Faltan objetivos legales: se requieren al menos ${minTotal}.`};
    if(ids.length>maxTotal)return{ok:false,reason:`Demasiados objetivos: el máximo legal es ${maxTotal}.`};
    const choices=ids.map(uid=>({uid:String(uid),groups:rows.map((r,i)=>r.pool.has(String(uid))?i:-1).filter(i=>i>=0)}));
    if(choices.some(x=>!x.groups.length))return{ok:false,reason:'Se seleccionó al menos un objetivo que no pertenece a ningún grupo legal.'};
    choices.sort((a,b)=>a.groups.length-b.groups.length);
    const counts=Array(rows.length).fill(0);let solved=false;
    function possible(from){for(let i=0;i<rows.length;i++){if(counts[i]>rows[i].max)return false;let avail=0;for(let j=from;j<choices.length;j++)if(choices[j].groups.includes(i))avail++;if(counts[i]+avail<rows[i].min)return false}return true}
    function dfs(pos){if(solved)return true;if(pos===choices.length){solved=rows.every((r,i)=>counts[i]>=r.min&&counts[i]<=r.max);return solved}if(!possible(pos))return false;for(const gi of choices[pos].groups){if(counts[gi]>=rows[gi].max)continue;counts[gi]++;if(dfs(pos+1))return true;counts[gi]--}return false}
    if(!dfs(0))return{ok:false,reason:'La selección no puede distribuirse legalmente entre los grupos de objetivos.',targetAssignmentFailed:true};
    return{ok:true,targetAssignment:true,counts:[...counts]};
  }
  function chooseCostItems(st,p,cost,ctx,choiceUids=[]){const selected=[];const get=uid=>{const q=locate(st,uid);return q&&q.p===p?q.item:null};if(cost.kind==='DISCARD'){const chosen=[...new Map(choiceUids.map(get).filter(x=>x&&locate(st,x.uid)?.z==='hand').map(x=>[String(x.uid),x])).values()];if(chosen.length>=cost.amount)return chosen.slice(0,cost.amount);if(choiceUids.length)return[];return zone(st,p,'hand').slice(0,cost.amount);}if(cost.kind==='TRIBUTE'){return choiceUids.map(get).filter(x=>x&&locate(st,x.uid)?.z==='monster').slice(0,cost.amount);}if(cost.kind==='DETACH'){const src=ctx.uid?locate(st,ctx.uid)?.item:null,materials=Array.isArray(src?.materials)?src.materials:[];if(choiceUids.length){const allowed=new Set(materials.map(String)),chosen=[...new Set(choiceUids.map(String))].filter(uid=>allowed.has(uid)).slice(0,cost.amount);return chosen.map(uid=>locate(st,uid)?.item).filter(Boolean)}return materials.map(uid=>locate(st,uid)?.item).filter(Boolean).slice(0,cost.amount);}if(cost.kind==='REVEAL')return choiceUids.map(get).filter(Boolean).slice(0,cost.amount);return selected;}
  function payCost(st,ctx,cost,choiceUids=[]){
    const p=ctx.player, amount=Number(cost?.amount);
    switch(cost?.kind){
      case 'LP':{
        if(!Number.isSafeInteger(amount)||amount<1)return{ok:false,reason:'Cantidad de LP del coste inválida.'};
        if(st.lp[p]<amount)return{ok:false,reason:'LP insuficientes.'};
        st.lp[p]-=amount;st.analysis.resourcesSpent+=amount;
        log(st,`Paga ${amount} LP como coste.`);return{ok:true};
      }
      case 'LP_HALF':{
        if(st.lp[p]<=0)return{ok:false,reason:'LP insuficientes.'};
        const n=Math.ceil(st.lp[p]/2);st.lp[p]-=n;st.analysis.resourcesSpent+=n;
        log(st,`Paga la mitad de sus LP (${n}) como coste.`);return{ok:true};
      }
      case 'DISCARD':{
        if(!Number.isSafeInteger(amount)||amount<1)return{ok:false,reason:'Cantidad de descartes inválida.'};
        const selected=chooseCostItems(st,p,cost,ctx,choiceUids);
        if(selected.length<amount)return{ok:false,reason:'No hay suficientes cartas para descartar.'};
        for(const item of selected){
          const r=move(st,item.uid,p,'gy','COST_DISCARD');
          if(!r?.ok||r.cancelled)return{ok:false,reason:'No pudo pagarse el descarte como coste.'};
        }
        return{ok:true};
      }
      case 'SEND_GY':{
        if(cost.self!==true)return{ok:false,partial:true,reason:'Enviar otra carta al Cementerio como coste requiere selección legal no implementada.'};
        const r=move(st,ctx.uid,p,'gy','COST_SEND');
        return r?.cancelled?{ok:false,reason:'No pudo enviarse la carta como coste.'}:r;
      }
      case 'BANISH':{
        if(cost.self!==true)return{ok:false,partial:true,reason:'Desterrar otra carta como coste requiere selección legal no implementada.'};
        const r=move(st,ctx.uid,p,'banished','COST_BANISH');
        return r?.cancelled?{ok:false,reason:'No pudo desterrarse la carta como coste.'}:r;
      }
      case 'TRIBUTE':{
        if(!Number.isSafeInteger(amount)||amount<1)return{ok:false,reason:'Cantidad de Tributos inválida.'};
        const selected=chooseCostItems(st,p,cost,ctx,choiceUids);
        if(selected.length<amount)return{ok:false,reason:'No hay suficientes monstruos para ofrecer como Tributo.'};
        for(const item of selected){
          const r=move(st,item.uid,p,'gy','COST_TRIBUTE');
          if(!r?.ok||r.cancelled)return{ok:false,reason:'No pudo pagarse el Tributo como coste.'};
        }
        return{ok:true};
      }
      case 'DETACH':{
        if(!Number.isSafeInteger(amount)||amount<1)return{ok:false,reason:'Cantidad de materiales inválida.'};
        const src=ctx.uid?locate(st,ctx.uid)?.item:null;
        if(!src||!Array.isArray(src.materials)||src.materials.length<amount)return{ok:false,reason:'No hay suficientes materiales para desacoplar.'};
        let chosen;
        if(choiceUids.length){
          const allowed=new Set(src.materials.map(String));
          chosen=[...new Set(choiceUids.map(String))].filter(uid=>allowed.has(uid)).slice(0,amount);
          if(chosen.length<amount)return{ok:false,reason:'La selección de materiales para desacoplar es incompleta o ilegal.'};
        }else chosen=src.materials.slice(0,amount).map(String);
        for(const suid of chosen){
          const i=src.materials.findIndex(x=>String(x)===String(suid));
          if(i<0)return{ok:false,reason:'Material seleccionado ya no está acoplado.'};
          const uid=src.materials.splice(i,1)[0],q=locate(st,uid);
          if(!q)return{ok:false,reason:'Material seleccionado no localizable.'};
          const r=move(st,uid,p,'gy','COST_DETACH');
          if(!r?.ok||r.cancelled)return{ok:false,reason:'No pudo pagarse el desacople como coste.'};
        }
        recordEvent(st,'DETACH',{player:p,source:ctx.uid,amount,materials:chosen});return{ok:true};
      }
      case 'DESTROY':
      case 'REVEAL':
      case 'SHUFFLE':
        // El parser detecta estos costes, pero todavía no interpreta todas sus
        // restricciones PSCT. No convertir una animación en un pago ficticio.
        return{ok:false,partial:true,reason:`Coste ${cost.kind} sin simulación verificable. No se acredita la activación.`};
      default:
        return{ok:false,partial:true,reason:`Tipo de coste no soportado: ${String(cost?.kind||'desconocido')}.`};
    }
  }

  function canUseRestriction(st,p,c,e,uid){const key=`${p}|${c.name}|${e.id}`;if(e.restriction.oncePerTurn&&st.oncePerTurn[key])return{ok:false,reason:'Una vez por turno ya utilizada.'};if(e.restriction.oncePerDuel&&st.oncePerDuel[key])return{ok:false,reason:'Una vez por Duelo ya utilizada.'};if(st.activationLocks.some(x=>x.player===p&&x.card===c.name))return{ok:false,reason:'Restricción de activación activa.'};return{ok:true};}
  function canActivate(st,p,c,uid,e,targets=[]){const q=locate(st,uid);if(!q||q.p!==p)return{ok:false,reason:'La carta no está bajo tu control.'};if(q.item.negatedActivation)return{ok:false,reason:'La activación de esta carta está negada.'};if(!conditionSatisfied(st,p,e.condition,{uid,card:c,effectId:e.id}))return{ok:false,reason:'La condición no se cumple.'};const rr=canUseRestriction(st,p,c,e,uid);if(!rr.ok)return rr;
    if(e.timing.damageStep&&!st.phase.includes('DAMAGE'))return{ok:false,reason:'Este efecto solo puede usarse durante Damage Step.'};
    if(!e.timing.quick&&st.phase!=='MAIN 1'&&st.phase!=='MAIN 2'&&e.timing.trigger===false)return{ok:false,reason:'No es una ventana legal de activación.'};
    const tr=ensureTargets(st,p,e,targets,uid);if(!tr.ok)return tr;return{ok:true};}
  function activate(st,p,c,uid,effectId,targets=[],costChoices=[]){
    const e=parseCard(c).effects.find(x=>x.id===effectId);
    if(!e)return{ok:false,reason:'Efecto no encontrado.'};
    const legal=canActivate(st,p,c,uid,e,targets);
    if(!legal.ok){st.analysis.illegalAttempts++;return legal;}
    // Pagar varios costes debe ser atómico: si alguno falla, no se pierden
    // LP, cartas, eventos, disparadores o restricciones del intento fallido.
    const checkpoint=snapshot(st);
    const groupedCosts=Array.isArray(costChoices)&&costChoices.some(Array.isArray);
    for(let ci=0;ci<e.costs.length;ci++){
      const cost=e.costs[ci];
      const choices=groupedCosts?(Array.isArray(costChoices[ci])?costChoices[ci]:[]):costChoices;
      let result;
      try{result=payCost(st,{player:p,uid,card:c,effectId,costIndex:ci},cost,choices);}
      catch(ex){result={ok:false,partial:true,reason:'Error al ejecutar el coste: '+String(ex?.message||ex)};}
      if(!result?.ok){
        restore(st,checkpoint);
        st.analysis.illegalAttempts++;
        return result||{ok:false,reason:'El coste no pudo ser pagado.'};
      }
    }
    const link={id:st.chain.length+1,player:p,uid,card:c.name,effectId,targetUids:[...targets],costsPaid:clone(e.costs),status:'CHAIN LINK',activatedAt:{turn:st.turn,phase:st.phase},spellSpeed:e.timing.quick?2:1};
    st.chain.push(link);st.priority=1-p;st.window={kind:'CHAIN',open:true};
    st.analysis.actions++;st.analysis.successfulActivations++;
    markUsed(st,p,c,e);
    recordEvent(st,'ACTIVATE',{player:p,uid,card:c.name,effectId,targets});
    log(st,`${c.name}: Efecto ${effectId} activado. Cadena ${link.id}.`);
    return{ok:true,link};
  }

  /* ---------- effect resolution ---------- */
  function resolveAction(st,link,text){const p=link.player,s=low(text),targets=link.targetUids||[];if((/draw/.test(s)||/roba/.test(s))&&st.__alpha638DeckOrderUnknown?.[p])return{ok:false,partial:true,reason:'El orden del Deck quedó indeterminado tras barajar; el Robo posterior no se inventa.'};if(/draw/.test(s)||/roba/.test(s)){const m=s.match(/(?:draw|roba)\s+(\d+|one|a|una)/);const n=m?(Number(m[1])||1):1;draw(st,p,n,true);return{ok:true};}
    if(/add .*from .*deck|add .*to your hand|search|añade .*deck|busca/.test(s)){const deck=zone(st,p,'deck');let wanted=null;const wantedArchetype=(s.match(/([a-z0-9' -]{3,30}) cards? from your deck/i)||[])[1]?.trim();if(wantedArchetype)wanted=deck.find(x=>low(x.card.archetype||'').includes(low(wantedArchetype))||low((x.card.archetypes||[]).join(' ')).includes(low(wantedArchetype)));if(!wanted&&/monster|monstruo/.test(s))wanted=deck.find(x=>isMonster(x.card));if(!wanted&&/spell|mágica/.test(s))wanted=deck.find(x=>isSpell(x.card));if(!wanted&&/trap|trampa/.test(s))wanted=deck.find(x=>isTrap(x.card));if(!wanted)wanted=deck[0];if(!wanted)return{ok:false,reason:'No hay carta legal que añadir.'};zone(st,p,'deck').splice(zone(st,p,'deck').indexOf(wanted),1);zone(st,p,'hand').push(wanted);st.analysis.searches++;recordEvent(st,'SEARCH',{player:p,uid:wanted.uid,source:link.uid});log(st,`${wanted.card.name} es añadida del Deck a la mano.`);return{ok:true};}
    if(/special summon|invoca.*especial/.test(s)){const pool=targets.map(id=>locate(st,id)?.item).filter(Boolean);let sourceZone=/from your deck|del deck|desde tu deck/.test(s)?'deck':/from your hand|de tu mano/.test(s)?'hand':/from (?:the )?graveyard|del cementerio|desde tu cementerio/.test(s)?'gy':/from the extra deck|del extra deck/.test(s)?'extra':'hand';let candidates=zone(st,p,sourceZone).filter(x=>isMonster(x.card));const lm=s.match(/level\s*(\d+)/i);if(lm)candidates=candidates.filter(x=>Number(x.card.level)===Number(lm[1]));if(/fiend|demonio/.test(s))candidates=candidates.filter(x=>/fiend|demonio/i.test(String(x.card.race||'')));if(/warrior|guerrero/.test(s))candidates=candidates.filter(x=>/warrior|guerrero/i.test(String(x.card.race||'')));const self=locate(st,link.uid)?.item;const selfLegal=/this card|esta carta/.test(s)&&self&&locate(st,self.uid)?.z===sourceZone;const src=selfLegal?self:(pool[0]||candidates[0]);if(!src)return{ok:false,reason:'No hay monstruo legal para Invocación Especial.'};const from=locate(st,src.uid)?.z;if(from==='extra'){const sc=summonCheck(st,p,src,'EXTRA');if(!sc.ok)return sc;}const r=move(st,src.uid,p,'monster','SPECIAL_SUMMON');if(r.ok){st.analysis.successfulSummons++;recordEvent(st,'SPECIAL_SUMMON',{player:p,uid:src.uid,method:'EFFECT'});return r;}return r;}
    if(/destroy|destruye/.test(s)){const pool=targets.map(id=>locate(st,id)?.item).filter(Boolean),xs=pool.length?pool:[targetPool(st,p,s,link.uid)[0]].filter(Boolean);if(!xs.length)return{ok:false,reason:'No hay objetivo legal para destruir.'};const moved=[];for(const x of xs){const q=locate(st,x.uid);if(!q)continue;const r=move(st,x.uid,q.p,'gy','DESTROY',{effect:true,sourceUid:link.uid,sourcePlayer:p,sourceCard:link.card});if(r.ok)moved.push(x.uid)}return moved.length?{ok:true,moved}:{ok:false,reason:'Ningún objetivo permanecía legal para destruir.'};}
    if(/banish|destierra/.test(s)){const pool=targets.map(id=>locate(st,id)?.item).filter(Boolean),xs=pool.length?pool:[targetPool(st,p,s,link.uid)[0]].filter(Boolean);if(!xs.length)return{ok:false,reason:'No hay objetivo legal para desterrar.'};const moved=[];for(const x of xs){const q=locate(st,x.uid);if(!q)continue;const r=move(st,x.uid,q.p,'banished','BANISH',{effect:true,sourceUid:link.uid,sourcePlayer:p,sourceCard:link.card});if(r.ok)moved.push(x.uid)}return moved.length?{ok:true,moved}:{ok:false,reason:'Ningún objetivo permanecía legal para desterrar.'};}
    if(/shuffle .*into .*deck|shuffle .*back .*deck|baraj.*(?:deck|mazo)/.test(s)&&targets.length){const xs=targets.map(id=>locate(st,id)?.item).filter(Boolean);if(!xs.length)return{ok:false,reason:'No hay objetivos explícitos para barajar.'};const moved=[];for(const x of xs){const q=locate(st,x.uid);if(!q)continue;const ty=low(x.card?.type||''),dest=/fusion|synchro|xyz|link/.test(ty)?'extra':'deck';const r=move(st,x.uid,q.p,dest,'RETURN',{effect:true,sourceUid:link.uid,sourcePlayer:p,sourceCard:link.card,shuffled:true});if(r.ok)moved.push({uid:x.uid,to:dest})}st.__alpha638DeckOrderUnknown=st.__alpha638DeckOrderUnknown||[false,false];for(const x of moved)if(x.to==='deck'){const q=locate(st,x.uid);st.__alpha638DeckOrderUnknown[q?.p??p]=true}return moved.length?{ok:true,moved,deckOrderUnknown:true}:{ok:false,reason:'No se pudo barajar ningún objetivo.'};}
    if(/return .*hand|devuelve .*mano/.test(s)){const pool=targets.map(id=>locate(st,id)?.item).filter(Boolean),xs=pool.length?pool:[targetPool(st,p,s,link.uid)[0]].filter(Boolean);if(!xs.length)return{ok:false,reason:'No hay objetivo legal para devolver.'};const moved=[];for(const x of xs){const q=locate(st,x.uid);if(!q)continue;const r=move(st,x.uid,q.p,'hand','RETURN',{effect:true,sourceUid:link.uid,sourcePlayer:p,sourceCard:link.card});if(r.ok)moved.push(x.uid)}return moved.length?{ok:true,moved}:{ok:false,reason:'Ningún objetivo permanecía legal para devolver.'};}
    if(/send .*graveyard|manda .*cementerio/.test(s)){const pool=targets.map(id=>locate(st,id)?.item).filter(Boolean),xs=pool.length?pool:[targetPool(st,p,s,link.uid)[0]].filter(Boolean);if(!xs.length)return{ok:false,reason:'No hay carta legal para enviar.'};const moved=[];for(const x of xs){const q=locate(st,x.uid);if(!q)continue;const r=move(st,x.uid,q.p,'gy','SEND',{effect:true,sourceUid:link.uid,sourcePlayer:p,sourceCard:link.card});if(r.ok)moved.push(x.uid)}return moved.length?{ok:true,moved}:{ok:false,reason:'Ningún objetivo permanecía legal para enviar.'};}
    if(/negate|niega/.test(s)){const xs=targets.map(id=>locate(st,id)?.item).filter(Boolean);if(!xs.length)return{ok:false,reason:'No hay objetivo representado para negar.'};const negated=[],unaffected=[];for(const x of xs){if(window.YGOAlpha313Core?.canAffect&&!window.YGOAlpha313Core.canAffect(st,x.uid,{sourceUid:link.uid,sourcePlayer:p,activated:true,kind:'NEGATE'})){unaffected.push(x.uid);continue}x.negatedEffect=true;st.analysis.negates++;recordEvent(st,'NEGATE',{player:p,target:x.uid,mode:'EFFECT'});log(st,`${x.card.name}: efecto negado.`);negated.push(x.uid)}return{ok:true,negated,unaffected};}
    if(/gain .*lp|gana .*lp/.test(s)){const m=s.match(/(\d[\d,]*)\s*LP/);const n=m?+m[1].replace(/,/g,''):0;st.lp[p]+=n;recordEvent(st,'GAIN_LP',{player:p,amount:n});return{ok:true};}
    if(/inflict .*damage|inflige .*daño/.test(s)){const m=s.match(/(\d[\d,]*)\s*(?:damage|daño)/);const n=m?+m[1].replace(/,/g,''):0;st.lp[1-p]=Math.max(0,st.lp[1-p]-n);st.lastDamage={player:1-p,amount:n,type:'EFFECT'};recordEvent(st,'DAMAGE',{player:1-p,amount:n,type:'EFFECT'});return{ok:true};}
    return{ok:false,partial:true,reason:'Efecto compilado pero su resolución requiere una excepción/card script específica; no se inventa el resultado.'};}
  window.__YGO638_MULTI_TARGET_RESOLVER=true;window.__YGO639_MULTI_TARGET_RESOLVER=true;window.__YGO640_MULTI_TARGET_RESOLVER=true;
  function resolveTop(st){if(!st.chain.length)return{ok:false,reason:'No hay Cadena.'};const link=st.chain[st.chain.length-1],c=cardByName(link.card);if(!c)return{ok:false,reason:'Carta ausente de la base.'};const e=parseCard(c).effects.find(x=>x.id===link.effectId);if(!e)return{ok:false,reason:'Efecto ausente.'};const tr=ensureTargets(st,link.player,e,link.targetUids||[]);if(!tr.ok&&e.targets.length){link.status='NO RESUELTA';st.chain.pop();log(st,`Cadena ${link.id}: no resuelve; objetivo(s) ilegal(es).`);recordEvent(st,'RESOLVE',{chainId:link.id,status:link.status});return{ok:false,reason:tr.reason};}
    if(locate(st,link.uid)?.item?.negatedActivation){link.status='NO RESUELTA · ACTIVACIÓN NEGADA';st.chain.pop();recordEvent(st,'RESOLVE',{chainId:link.id,status:link.status});return{ok:true,link};}
    let partial=false;for(const step of e.steps){const r=resolveAction(st,link,step.text);if(!r.ok){if(step.conjunction==='and if you do'||step.conjunction==='and only if'||step.conjunction==='otherwise')break;partial=!!r.partial;if(!r.partial){link.status='NO RESUELTA';st.chain.pop();log(st,`Cadena ${link.id}: ${r.reason||'no resuelve'}.`);return r;}}}
    link.status=partial?'RESUELTA · PARCIAL':'RESUELTA';st.chain.pop();st.priority=st.chain.length?1-st.chain[st.chain.length-1].player:1-link.player;recordEvent(st,'RESOLVE',{chainId:link.id,status:link.status});log(st,`Cadena ${link.id}: ${link.status}.`);return{ok:true,partial,link};}

  /* ---------- triggers / SEGOC / timing ---------- */
  function triggerMatches(e,ev,item,p){const s=low(e.condition+' '+e.raw);if(ev.type==='DESTROY'&&/destroy|destru/.test(s))return true;if(ev.type==='SPECIAL_SUMMON'&&/special summon|invoca.*especial/.test(s))return true;if(ev.type==='NORMAL_SUMMON'&&/normal summon|invoc.*normal/.test(s))return true;if(ev.type==='BANISH'&&/banish|desterr/.test(s))return true;if(ev.type==='DRAW'&&/draw|roba/.test(s))return true;if(ev.type==='DAMAGE'&&/damage|daño/.test(s))return true;if(ev.type==='SEND'&&/send|manda/.test(s))return true;return false;}
  function queueTriggers(st,ev){for(let p=0;p<2;p++)for(const z of ['monster','spelltrap','gy','banished','hand'])for(const item of zone(st,p,z)){if(item.negatedEffect||item.disabled)continue;for(const e of parseCard(item.card).effects){if(!e.timing.trigger)continue;if(triggerMatches(e,ev,item,p)){const mandatory=!/you can|puedes|puede activar|opcional|optional/.test(low(e.condition+' '+e.activation));st.triggerQueue.push({player:p,uid:item.uid,effectId:e.id,mandatory,createdEvent:ev.id,controller:p,sourceZone:z});}}}}
  function buildSEGOC(st){const tp=st.activePlayer,groups={turnMandatory:[],turnOptional:[],nonTurnMandatory:[],nonTurnOptional:[]};for(const x of st.triggerQueue){const key=(x.player===tp?'turn':'nonTurn')+(x.mandatory?'Mandatory':'Optional');groups[key].push(x);}st.triggerQueue=[];const order=[...groups.turnMandatory,...groups.nonTurnMandatory,...groups.turnOptional,...groups.nonTurnOptional];st.pendingTriggers=order;return{...groups,order};}
  function openTriggerWindow(st){const g=buildSEGOC(st);st.window={kind:'TRIGGER',open:g.order.length>0};return g;}
  function canRespond(st,linkEffect,opts={}){if(!linkEffect)return false;const speed=Number(opts.spellSpeed||2),current=Number(opts.currentSpeed||1);if(speed<current)return false;const text=low(linkEffect);if(st.phase.includes('DAMAGE')&&!/counter|negate attack|damage step|damage calculation|spell speed 3/.test(text))return false;return speed>=2&&(/quick effect|quick|counter trap|during either player's turn|during your opponent's turn|efecto rápido|durante el turno de cualquier jugador/.test(text));}
  function passPriority(st){if(st.chain.length){st.priority=1-st.priority;st.window={kind:'CHAIN',open:true};return st.priority;}st.priority=1-st.priority;return st.priority;}

  /* ---------- summon procedures / materials ---------- */
  function level(c){return Number(c?.level)||0} function rank(c){return Number(c?.rank)||0} function linkRating(c){return Number(c?.linkval||c?.linkRating)||0;}
  function materialText(c){return low(cardText(c));}
  function fusionMaterialLegal(m,target){const s=materialText(target);if(!isMonster(m.card))return false;if(/dragon|dragón/.test(s)&&!/dragon|dragón/.test(materialText(m.card)+' '+cardType(m.card)))return false;return true;}
  function synchroMaterials(st,p,target,chosen){
    const ids=Array.isArray(chosen)?chosen:[],mats=ids.map(uid=>locate(st,uid)?.item).filter(Boolean);
    if(ids.length<2||mats.length!==ids.length||new Set(ids.map(String)).size!==ids.length)
      return{ok:false,reason:'Los materiales de Sincronía deben ser al menos dos monstruos distintos.'};
    if(!mats.every(x=>{const q=locate(st,x.uid),t=cardType(x.card);return q?.p===p&&q.z==='monster'&&x.faceUp!==false&&isMonster(x.card)&&level(x.card)>0&&!/xyz|link|token|pendulum|péndulo|ficha/.test(t)}))
      return{ok:false,partial:true,reason:'Material de Sincronía no acreditado o no está boca arriba; fichas y Péndulos requieren reglas adicionales.'};
    const materialLine=cardText(target.card).split(/[.;]/)[0].trim();
    const recipe=materialLine.match(/^1\s+Tuner\s*\+\s*1(\+|\s+or\s+more)?\s+non[- ]Tuner\s+monsters?$/i);
    if(!recipe)return{ok:false,partial:true,reason:'Receta de Sincronía especial no acreditada.'};
    if(mats.filter(x=>isTuner(x.card)).length!==1||(!recipe[1]&&mats.length!==2))
      return{ok:false,reason:'Se requiere exactamente 1 Afinador y el número correcto de materiales.'};
    if(mats.reduce((sum,x)=>sum+level(x.card),0)!==level(target.card))
      return{ok:false,reason:'Suma de Niveles inválida para Sincronía.'};
    return{ok:true,materials:mats};
  }
  function xyzMaterials(st,p,target,chosen){
    const ids=Array.isArray(chosen)?chosen:[],mats=ids.map(uid=>locate(st,uid)?.item).filter(Boolean);
    if(ids.length<2||mats.length!==ids.length||new Set(ids.map(String)).size!==ids.length)
      return{ok:false,reason:'Se requieren al menos dos materiales Xyz distintos y localizables.'};
    if(!mats.every(x=>{const q=locate(st,x.uid);return q?.p===p&&q.z==='monster'&&x.faceUp!==false&&isMonster(x.card);}))
      return{ok:false,reason:'Los materiales Xyz deben ser monstruos boca arriba que controles.'};
    const r=rank(target.card);if(!r)return{ok:false,reason:'Rango Xyz no disponible.'};
    if(!mats.every(x=>level(x.card)===r))return{ok:false,reason:'Los materiales Xyz deben tener el Nivel requerido.'};
    // Una carta puede exigir 3+ materiales, no asumir siempre dos.
    const m=cardText(target.card).match(/\b(\d+)\s*\+?\s*Level\s*(\d+)\s*monsters?\b/i);
    if(!m||Number(m[2])!==r)return{ok:false,partial:true,reason:'No se acreditó la receta de materiales Xyz de esta carta.'};
    const req=Number(m[1]),isPlus=/\d+\s*\+\s*Level/i.test(m[0]);
    if(mats.length<req||(!isPlus&&mats.length!==req))return{ok:false,reason:'Cantidad de materiales distinta de la receta de la carta.'};
    return{ok:true,materials:mats};
  }
  function linkMaterials(st,p,target,chosen){const mats=chosen.map(uid=>locate(st,uid)?.item).filter(Boolean),req=linkRating(target.card);if(!req||mats.length<req)return{ok:false,reason:`Este Link requiere ${req||'los materiales indicados'} materiales.`};if(!mats.every(x=>locate(st,x.uid)?.p===p&&locate(st,x.uid)?.z==='monster'))return{ok:false,reason:'Los materiales Link deben estar en tu Campo.'};return{ok:true,materials:mats};}
  function fusionMaterials(st,p,target,chosen){const mats=chosen.map(uid=>locate(st,uid)?.item).filter(Boolean);if(mats.length<2)return{ok:false,reason:'Selecciona los materiales de Fusión.'};if(!mats.every(m=>fusionMaterialLegal(m,target.card)))return{ok:false,reason:'Los materiales seleccionados no cumplen la restricción textual detectada.'};return{ok:true,materials:mats};}
  function summonCheck(st,p,item,procedure,chosen=[]){const c=item.card,proc=String(procedure).toUpperCase();
    if(proc==='NORMAL'){
      const text=cardType(c)+' '+String(c?.frameType||'').toLowerCase();
      if(!isMonster(c)||/fusion|synchro|xyz|link|ritual|token|fusión|sincro|enlace|ficha/.test(text))
        return{ok:false,reason:'Esta carta no puede ser Invocada Normalmente.'};
      if(!Number.isInteger(level(c))||level(c)<1)return{ok:false,reason:'No se puede verificar el Nivel para Invocación Normal.'};
    }
    if(['XYZ','SYNCHRO','LINK','FUSION'].includes(proc)){const names={XYZ:/xyz/i,SYNCHRO:/synchro|sincro/i,LINK:/link|enlace/i,FUSION:/fusion|fusión/i};if(!names[proc].test(cardType(c)))return{ok:false,reason:'El tipo del monstruo no coincide con el método de Invocación.'};}
    if(st.summonLocks.some(x=>x.player===p&&x.type===proc))return{ok:false,reason:'Una restricción de Invocación impide esta Invocación.'};const a313=window.YGOAlpha313Core?.checkSummonMaterials?.(st,p,item,proc,chosen);if(a313&&!a313.ok)return a313;switch(proc){case'NORMAL':{const lv=level(c),tribute=lv>=7?2:lv>=5?1:0,available=zone(st,p,'monster').length;return{ok:available>=tribute,reason:available>=tribute?'':`Se requieren ${tribute} Tributo(s) para esta Invocación Normal.`,tribute};}case'SYNCHRO':return synchroMaterials(st,p,item,chosen);case'XYZ':return xyzMaterials(st,p,item,chosen);case'LINK':return{ok:false,partial:true,reason:'Enlace no acreditado: falta validar Extra Monster Zone, flechas y valores Link.'};case'FUSION':return{ok:false,partial:true,reason:'La Fusión necesita una activación o procedimiento de contacto documentado; el método genérico no acredita esa condición.'};case'RITUAL':return{ok:false,reason:'Ritual requiere procedimiento/materiales específicos de la carta.'};default:return{ok:false,partial:true,reason:'Procedimiento de Invocación no verificado: '+proc+'.'};}}
    function consumeMaterials(st,p,target,materials,procedure){
    for(const m of materials){
      const q=locate(st,m.uid);
      if(!q||q.p!==p||q.z!=='monster')return false;
      const src=q.item;
      if(procedure==='XYZ'){
        zone(st,q.p,q.z).splice(q.i,1);
        src.previousZone=q.z;src.previousController=src.controller;
        src.attachedTo=target.uid;src.faceUp=false;
        zone(st,src.owner,'overlay').push(src);
        target.materials.push(src.uid);
        recordEvent(st,'MATERIAL_USED',{player:p,material:src.uid,target:target.uid,from:q.z,method:procedure});
      }else if(procedure==='SYNCHRO'){
        const rr=move(st,src.uid,src.owner,'gy','SYNCHRO_MATERIAL');
        if(!rr?.ok||rr.cancelled||rr.destination!=='gy')return false;
      }else return false;
      st.analysis.materialsUsed++;
    }
    return true;
  }
  function autoResolveQueuedTriggers(st,p){const pending=buildSEGOC(st).order||[];for(const tr of pending){if(tr.player!==p)continue;const q=locate(st,tr.uid);if(!q)continue;const c=q.item.card,e=parseCard(c).effects.find(x=>x.id===tr.effectId);if(!e)continue;const targets=[];for(const t of e.targets||[]){const pool=targetPool(st,p,t.description,tr.uid),need=typeof t.count==='number'?t.count:(t.count?.min||0);targets.push(...pool.slice(0,need).map(x=>x.uid));}const a=activate(st,p,c,tr.uid,tr.effectId,targets,[]);if(a.ok)resolveTop(st);}}
  function performNormalSummon(st,p,uid,tributeUids=[]){
    if(p!==st.activePlayer||!['MAIN 1','MAIN 2'].includes(st.phase))return{ok:false,reason:'La Invocación Normal requiere la Main Phase del jugador activo.'};
    if(!st.normalSummonAvailable[p])return{ok:false,reason:'Ya se realizó la Invocación Normal este turno.'};
    const q=locate(st,uid);if(!q||q.p!==p||q.z!=='hand')return{ok:false,reason:'La carta no está en tu mano.'};
    const c=q.item.card,chk=summonCheck(st,p,q.item,'NORMAL',tributeUids);
    if(!chk.ok)return chk;
    const ids=Array.isArray(tributeUids)?tributeUids:[];
    if(ids.length!==chk.tribute||new Set(ids.map(String)).size!==ids.length)
      return{ok:false,reason:'Se requieren Tributos distintos y exactamente en la cantidad indicada.'};
    const trib=ids.map(x=>locate(st,x));
    if(trib.some(x=>!x||x.p!==p||x.z!=='monster'||!isMonster(x.item.card)))
      return{ok:false,reason:'Solo se pueden ofrecer como Tributo monstruos propios del Campo.'};
    if(zone(st,p,'monster').length-ids.length>=5)
      return{ok:false,reason:'No queda zona de Monstruos libre después de los Tributos.'};
    for(const m of trib){const tp=window.YGOAlpha313Core?.canTribute?.(st,m.item.uid,{player:p,reason:'NORMAL_SUMMON'});if(tp&&!tp.ok)return tp;}
    const before=snapshot(st);
    for(const m of trib){const r=move(st,m.item.uid,m.item.owner,'gy','TRIBUTE_SUMMON');
      if(!r?.ok||r.cancelled){restore(st,before);return{ok:false,reason:'No se pudo pagar uno de los Tributos.'};}}
    const r=move(st,uid,p,'monster','NORMAL_SUMMON',{faceUp:true});
    if(!r?.ok||r.cancelled){restore(st,before);return{ok:false,reason:r?.reason||'No se pudo Invocar Normalmente.'};}
    st.normalSummonAvailable[p]=false;st.normalSummonCount[p]++;st.analysis.successfulSummons++;
    recordEvent(st,'NORMAL_SUMMON',{player:p,uid,tributes:ids});log(st,`${c.name} es Invocado Normalmente.`);
    return r;
  }
  function performSpecialSummon(st,p,uid,procedure='EFFECT',chosen=[]){
    const q=locate(st,uid),proc=String(procedure).toUpperCase();
    if(!q||q.p!==p||!['hand','gy','banished','extra'].includes(q.z))return{ok:false,reason:'Ubicación ilegal para Invocación Especial genérica.'};
    if(!isMonster(q.item.card))return{ok:false,reason:'Solo un monstruo puede ser Invocado de Modo Especial.'};
    if(zone(st,p,'monster').length>=5)return{ok:false,reason:'No hay zonas de Monstruos disponibles.'};
    if(q.z!=='extra')return{ok:false,partial:true,reason:'La Invocación Especial desde esta zona requiere un efecto/procedimiento acreditado por una traza; no se permite la invocación gratuita.'};
    if(!['SYNCHRO','XYZ','LINK','FUSION'].includes(proc))
      return{ok:false,partial:true,reason:'Procedimiento de Extra Deck no acreditado.'};
    const item=q.item,check=summonCheck(st,p,item,proc,chosen);
    if(!check.ok)return check;
    const before=snapshot(st);
    if(check.materials?.length&&!consumeMaterials(st,p,item,check.materials,proc)){restore(st,before);return{ok:false,reason:'No pudieron acoplarse todos los materiales requeridos.'};}
    const r=move(st,uid,p,'monster','SPECIAL_SUMMON',{faceUp:true});
    if(!r?.ok||r.cancelled){restore(st,before);return{ok:false,reason:r?.reason||'La Invocación Especial falló.'};}
    st.analysis.successfulSummons++;recordEvent(st,'SPECIAL_SUMMON',{player:p,uid,method:proc,materials:chosen});
    log(st,`${item.card.name} es Invocado de Modo Especial (${proc}).`);return r;
  }

  /* ---------- continuous / replacement / layers ---------- */
  function rebuildContinuous(st){if(window.YGOAlpha313Core?.rebuildContinuous)return window.YGOAlpha313Core.rebuildContinuous(st);st.continuousEffects=[];st.replacementEffects=[];for(let p=0;p<2;p++)for(const z of ['monster','spelltrap'])for(const item of zone(st,p,z)){const s=low(cardText(item.card));if(/while|as long as|mientras/.test(s))st.continuousEffects.push({uid:item.uid,player:p,text:cardText(item.card),layer:/atk|def|attack|defensa/.test(s)?7:6});if(/instead|en su lugar|would be destroyed|sería destruida/.test(s))st.replacementEffects.push({uid:item.uid,player:p,text:cardText(item.card),type:'REPLACEMENT'});}}
  function registerContinuous(st){rebuildContinuous(st);return st.continuousEffects;}
  function applyReplacement(st,evt){if(window.YGOAlpha313Core?.applyReplacement)return window.YGOAlpha313Core.applyReplacement(st,evt);rebuildContinuous(st);for(const r of st.replacementEffects){const txt=low(r.text),item=locate(st,r.uid)?.item;if(!item||item.negatedEffect||item.disabled)continue;if(evt.type==='DESTROY'&&(/instead|en su lugar|would be destroyed|sería destruida/.test(txt))){const m=txt.match(/instead[^.]{0,120}(?:send|banish|destroy)|en su lugar[^.]{0,120}/i);if(/banish|desterr/.test(txt))return{ok:true,replacedBy:r.uid,replacedTo:'banished'};if(/send .*graveyard|manda .*cementerio/.test(txt))return{ok:true,replacedBy:r.uid,replacedTo:'gy'};if(/negate.*destruction|prev(?:ent|iene).*destroy/.test(txt))return{ok:true,replacedBy:r.uid,cancel:true};if(m)return{ok:true,replacedBy:r.uid};}}return{ok:true};}

  /* ---------- phases / damage step ---------- */
  function startPhase(st,phase){st.phase=phase;st.priority=st.activePlayer;st.window={kind:phase,open:true};if(phase==='DRAW')draw(st,st.activePlayer,1,true);if(phase==='STANDBY')rebuildContinuous(st);if(phase==='END'){/* Las restricciones del turno siguen activas hasta el siguiente turno. */}recordEvent(st,'PHASE_CHANGE',{phase});log(st,`Avanza a ${phase}.`);return openTriggerWindow(st);}
  function advance(st,next){
    const idx=PHASES.indexOf(st.phase);if(idx<0)return{ok:false,reason:'Fase actual no reconocida.'};
    let ni=next===undefined?idx+1:PHASES.indexOf(next);
    if(ni<0)return{ok:false,reason:'Fase de destino desconocida.'};
    const newTurn=ni>=PHASES.length||(idx===PHASES.length-1&&ni===0);
    if(!newTurn&&ni<=idx)return{ok:false,reason:'No se puede retroceder de fase ni repetirla.'};
    if(!newTurn&&st.turn===1&&ni>=PHASES.indexOf('BATTLE START')&&ni<=PHASES.indexOf('BATTLE END'))return{ok:false,reason:'No existe Battle Phase en el primer turno del duelo.'};
    if(newTurn){st.turn++;st.activePlayer=1-st.activePlayer;st.normalSummonAvailable[st.activePlayer]=true;
      st.normalSummonCount[st.activePlayer]=0;st.oncePerTurn={};st.turnFlags[st.activePlayer]={};ni=0;}
    return startPhase(st,PHASES[ni]);
  }
  function damageStep(st,attackerUid,defenderUid,damage=0){const a=locate(st,attackerUid)?.item,b=locate(st,defenderUid)?.item;if(!a||!b)return{ok:false,reason:'Combatientes no encontrados.'};if(a.controller!==st.activePlayer||b.controller===st.activePlayer)return{ok:false,reason:'Atacante/defensor ilegales para este Damage Step.'};st.combat={attackerUid,defenderUid};for(const ph of ['DAMAGE STEP START','BEFORE DAMAGE CALCULATION','DAMAGE CALCULATION'])startPhase(st,ph);const ast=window.YGOAlpha313Core?.effectiveStats?.(st,a.uid)||{atk:Number(a.card.atk)||0,def:Number(a.card.def)||0},bst=window.YGOAlpha313Core?.effectiveStats?.(st,b.uid)||{atk:Number(b.card.atk)||0,def:Number(b.card.def)||0};const atk=Number(ast.atk)||0,def=Number(b.position==='DEF'?bst.def:bst.atk)||0;const amount=Math.max(0,Number(damage)||Math.max(0,atk-def));if(amount){st.lp[1-st.activePlayer]=Math.max(0,st.lp[1-st.activePlayer]-amount);st.lastDamage={player:1-st.activePlayer,amount,type:'BATTLE'};recordEvent(st,'DAMAGE',{player:1-st.activePlayer,amount,type:'BATTLE',attacker:attackerUid,defender:defenderUid});}for(const ph of ['AFTER DAMAGE CALCULATION','BATTLE END'])startPhase(st,ph);return{ok:true,damage:amount};}
  function markUsed(st,p,c,e){const key=`${p}|${c.name}|${e.id}`;if(e.restriction.oncePerDuel)st.oncePerDuel[key]=true;if(e.restriction.oncePerTurn)st.oncePerTurn[key]=true;}
  function snapshot(st){const clean={...st};delete clean.__alpha313ContinuousCache;return clone(clean);}
  function restore(st,snap){Object.keys(st).forEach(k=>delete st[k]);Object.assign(st,clone(snap));return st;}

  /* ---------- combo bridge: real state transitions ---------- */
  function simulateLine(line,opts={}){const st=makeState({openingHand:false,phase:'MAIN 1'});st.zones[0].deck=[];for(const c of line||[]){const item=makeItem(c,'SIM-'+Math.random().toString(36).slice(2),0);st.zones[0].hand.push(item);}const executed=[];const maxSteps=Math.min(8,(line||[]).length);for(let step=0;step<maxSteps;step++){let progressed=false;for(const item of [...st.zones[0].hand]){const c=item.card;if(isMonster(c)&&st.normalSummonAvailable[0]&&level(c)<=4){const r=performNormalSummon(st,0,item.uid,[]);if(r.ok){executed.push(c.name);progressed=true;break;}}const effects=parseCard(c).effects||[];for(const e of effects){if(!(e.semantic?.special||e.semantic?.search||e.semantic?.draw||e.semantic?.interaction||e.semantic?.removal))continue;let targets=[];for(const t of e.targets||[]){const pool=targetPool(st,0,t.description);const need=typeof t.count==='number'?t.count:(t.count?.min||0);targets.push(...pool.slice(0,need).map(x=>x.uid));}const r=activate(st,0,c,item.uid,e.id,targets,[]);if(r.ok){const rr=resolveTop(st);if(rr.ok||rr.partial){executed.push(c.name);progressed=true;break;}}}if(progressed)break;}if(!progressed)break;}return{state:st,executed,legal:executed.length===(line||[]).length,finalBoard:{monsters:zone(st,0,'monster').map(x=>x.card.name),spelltrap:zone(st,0,'spelltrap').map(x=>x.card.name),gy:zone(st,0,'gy').map(x=>x.card.name),banished:zone(st,0,'banished').map(x=>x.card.name),hand:zone(st,0,'hand').map(x=>x.card.name)}};}
  function deterministicSeed(text){let h=2166136261>>>0;for(let i=0;i<String(text).length;i++){h^=String(text).charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h>>>0}
  function seededRng(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;s=Math.imul(s^(s>>>15),s|1);s^=s+Math.imul(s^(s>>>7),s|61);return((s^(s>>>14))>>>0)/4294967296}}
  function prepareOpeningState(sample){const st=makeState({openingHand:false,phase:'MAIN 1'});const seed=deterministicSeed((deckState?.main||[]).map(c=>`${c?.id??c?.name}:${c?.qty||1}`).join('|')+'#'+sample);const rnd=seededRng(seed);const a=st.zones[0].deck;for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}for(let i=0;i<5&&a.length;i++)draw(st,0,1,false);return st}
  function comboStateSnapshot(st){const card=x=>x?.card?{id:x.card.id||null,name:x.card.name||'Carta',type:x.card.type||'',atk:Number(x.card.atk)||0,def:Number(x.card.def)||0}:x;const z=(p,n)=>zone(st,p,n).map(card);return{hand:z(0,'hand'),monster:z(0,'monster'),spelltrap:z(0,'spelltrap'),gy:z(0,'gy'),banished:z(0,'banished'),deck:zone(st,0,'deck').length,extra:z(0,'extra'),opponentHand:z(1,'hand'),opponentMonster:z(1,'monster'),opponentSpelltrap:z(1,'spelltrap'),opponentGy:z(1,'gy'),opponentBanished:z(1,'banished'),opponentDeck:zone(st,1,'deck').length,opponentExtra:z(1,'extra'),lp:Array.isArray(st?.lp)?[Number(st.lp[0]??8000),Number(st.lp[1]??8000)]:[8000,8000],turn:Number(st?.turn)||1,phase:String(st?.phase||'MAIN 1'),chainDepth:Array.isArray(st?.chain)?st.chain.length:0,analysis:{...st.analysis}};}
  function comboActionRecord(st,before,card,effect,kind,result){const after=comboStateSnapshot(st);const last=st.events?.[st.events.length-1]||null;return{card:card?.name||'Carta',cardId:card?.id||null,effectId:effect?.id||null,actionType:kind||'EFECTO',effectText:effect?.raw||effect?.resolution||'',activationText:effect?.activation||'',conditionText:effect?.condition||'',costs:(effect?.costs||[]).map(x=>x.kind),targets:(effect?.targets||[]).map(x=>x.description),result:result?.reason||result?.status||(result?.ok?'RESUELTA':'NO RESUELTA'),event:last?.type||null,turn:st.turn,phase:st.phase,before,after};}
  function copiesInLine(line,name){const k=String(name||'').toLowerCase();return (line||[]).reduce((n,c)=>n+(String(c?.name||'').toLowerCase()===k?1:0),0);}
  function stateKey(st){return JSON.stringify({hand:zone(st,0,'hand').map(x=>x.card.id||x.card.name).sort(),monster:zone(st,0,'monster').map(x=>x.card.id||x.card.name).sort(),spelltrap:zone(st,0,'spelltrap').map(x=>x.card.id||x.card.name).sort(),gy:zone(st,0,'gy').map(x=>x.card.id||x.card.name).sort(),banished:zone(st,0,'banished').map(x=>x.card.id||x.card.name).sort(),normal:!!st.normalSummonAvailable[0],a:{...st.analysis}});}
  function dedupeStates(nodes,limit=12){const map=new Map();for(const n of nodes||[]){const k=stateKey(n.st);const old=map.get(k);if(!old||n.score>old.score)map.set(k,n);}return [...map.values()].sort((a,b)=>b.score-a.score).slice(0,Math.max(1,limit));}
  function searchOpeningLines(samples=18,maxDepth=7){
    const results=[];
    const sampleCount=Math.max(1,Math.min(24,Number(samples)||18));
    const depthLimit=Math.max(2,Math.min(7,Number(maxDepth)||7));
    for(let sample=0;sample<sampleCount;sample++){
      const base=prepareOpeningState(sample);
      let beam=[{st:base,line:[],actions:[],score:0}],bestNodes=[];
      for(let depth=0;depth<depthLimit;depth++){
        const next=[];
        for(const node of beam){
          const hand=[...zone(node.st,0,'hand')];
          for(const item of hand){
            const c=item.card;
            if(copiesInLine(node.line,c.name)>=3)continue;
            if(isMonster(c)&&node.st.normalSummonAvailable[0]&&level(c)<=4){
              const ns=clone(node.st),q=locate(ns,item.uid);
              if(q){
                const before=comboStateSnapshot(ns),r=performNormalSummon(ns,0,item.uid,[]);
                if(r.ok){
                  const action=comboActionRecord(ns,before,c,null,'NORMAL SUMMON',r);
                  next.push({st:ns,line:[...node.line,c],actions:[...node.actions,action],score:scoreState(ns)+6});
                }
              }
            }
            const effects=parseCard(c).effects||[];
            for(const e of effects){
              if(e.timing?.trigger)continue;
              if(!(e.semantic?.special||e.semantic?.search||e.semantic?.draw||e.semantic?.interaction||e.semantic?.removal||e.semantic?.send||e.semantic?.summon))continue;
              let targets=[];
              for(const t of e.targets||[]){
                const pool=targetPool(node.st,0,t.description);
                const need=typeof t.count==='number'?t.count:(t.count?.min||0);
                targets.push(...pool.slice(0,need).map(x=>x.uid));
              }
              const ns=clone(node.st),q=locate(ns,item.uid);if(!q)continue;
              const before=comboStateSnapshot(ns),r=activate(ns,0,c,item.uid,e.id,targets,[]);if(!r.ok)continue;
              const rr=resolveTop(ns);if(!rr.ok)continue;
              const gain=(e.semantic.search?7:0)+(e.semantic.interaction?8:0)+(e.semantic.draw?4:0)+(e.semantic.special?4:0)+(e.semantic.summon?3:0)+(e.semantic.send?2:0);
              const action=comboActionRecord(ns,before,c,e,'EFECTO',rr);
              next.push({st:ns,line:[...node.line,c],actions:[...node.actions,action],score:scoreState(ns)+gain});
            }
          }
        }
        next.sort((a,b)=>b.score-a.score);
        const depthCandidates=next.filter(n=>n.line.length>=2).slice(0,12);bestNodes.push(...depthCandidates);
        beam=dedupeStates(next,12);
        if(!beam.length)break;
      }
      const finalNodes=bestNodes.length?dedupeStates(bestNodes,24):beam;
      for(const n of finalNodes){
        if(n.line.length<2)continue;
        const finalBoard={
          monsters:zone(n.st,0,'monster').map(x=>({name:x.card.name,id:x.card.id||null,card:x.card})),
          spelltrap:zone(n.st,0,'spelltrap').map(x=>({name:x.card.name,id:x.card.id||null,card:x.card})),
          gy:zone(n.st,0,'gy').map(x=>({name:x.card.name,id:x.card.id||null,card:x.card})),
          banished:zone(n.st,0,'banished').map(x=>({name:x.card.name,id:x.card.id||null,card:x.card})),
          hand:zone(n.st,0,'hand').map(x=>({name:x.card.name,id:x.card.id||null,card:x.card})),
          extra:zone(n.st,0,'extra').map(x=>({name:x.card.name,id:x.card.id||null,card:x.card}))
        };
        const sim={state:n.st,openingHand:zone(base,0,'hand').map(x=>({name:x.card.name,id:x.card.id||null,card:x.card})),actions:n.actions,executed:n.actions.map(a=>a.card),legal:n.actions.length===n.line.length,finalBoard};
        const quality=Math.max(0,Math.min(100,Math.round(n.score)));
        results.push({line:n.line,actions:n.actions,score:quality,finalScore:quality,state:n.st,simulation:sim});
      }
    }
    results.sort((a,b)=>b.finalScore-a.finalScore||b.actions.length-a.actions.length);
    const out=[],seen=new Set();
    for(const r of results){const k=r.actions.map(a=>`${a.cardId||a.card}:${a.effectId||a.actionType}`).join('|');if(seen.has(k))continue;seen.add(k);out.push(r);if(out.length>=5)break}
    return out;
  }

  function scoreState(st){return st.analysis.successfulSummons*8+st.analysis.successfulActivations*5+st.analysis.searches*7+st.analysis.draws*4+st.analysis.negates*10+st.zones[0].monster.length*6+st.zones[0].spelltrap.length*3;}
  function analysisSnapshot(st){return{...clone(st.analysis),hand:st.zones[0].hand.length,fieldMonsters:st.zones[0].monster.length,fieldBackrow:st.zones[0].spelltrap.length,graveyard:st.zones[0].gy.length,banished:st.zones[0].banished.length,chainDepth:st.chain.length,events:st.events.length};}
  function evaluateOpeningSamples(cards,samples=12,maxDepth=4){
    const original=window.deckState; const temp={main:(cards||[]).map(c=>({...c})),extra:[],side:[]}; window.deckState=temp;
    let playable=0,totalActions=0,totalMonsters=0,totalBackrow=0,totalSearch=0,totalInter=0,totalResources=0,totalAtk=0,branching=0;
    try{
      for(let i=0;i<samples;i++){
        const st=prepareOpeningState(i); let beam=[{st,line:[],actions:[],score:0}]; let best=null;
        for(let d=0;d<maxDepth;d++){
          const next=[];
          for(const node of beam){
            for(const item of [...zone(node.st,0,'hand')]){
              const c=item.card;
              if(isMonster(c)&&node.st.normalSummonAvailable[0]&&level(c)<=4){const ns=clone(node.st);const q=locate(ns,item.uid);const r=q?performNormalSummon(ns,0,item.uid,[]):null;if(r?.ok)next.push({st:ns,line:[...node.line,c],actions:[...node.actions],score:scoreState(ns)});}
              for(const e of (parseCard(c).effects||[])){if(e.timing?.trigger)continue;if(!(e.semantic?.special||e.semantic?.search||e.semantic?.draw||e.semantic?.interaction||e.semantic?.removal||e.semantic?.send||e.semantic?.summon))continue;const ns=clone(node.st),q=locate(ns,item.uid);if(!q)continue;const targets=[];for(const t of e.targets||[]){const pool=targetPool(ns,0,t.description,item.uid),need=typeof t.count==='number'?t.count:(t.count?.min||0);targets.push(...pool.slice(0,need).map(x=>x.uid));}const r=activate(ns,0,c,item.uid,e.id,targets,[]);if(!r.ok)continue;const rr=resolveTop(ns);if(rr.ok)next.push({st:ns,line:[...node.line,c],actions:[...node.actions],score:scoreState(ns)});}
            }
          }
          beam=dedupeStates(next,10); if(beam.length)best=beam[0]; else break;
        }
        if(best){playable++;totalActions+=best.st.analysis.actions;totalMonsters+=zone(best.st,0,'monster').length;totalBackrow+=zone(best.st,0,'spelltrap').length;totalAtk+=zone(best.st,0,'monster').reduce((a,x)=>a+(Number(x.card.atk)||0),0);totalSearch+=best.st.analysis.searches;totalInter+=best.st.analysis.negates+best.st.analysis.removals;totalResources+=best.st.analysis.draws+best.st.analysis.searches;branching+=Math.max(0,beam.length-1)}
      }
    }finally{window.deckState=original}
    const n=Math.max(1,samples);return{samples,playable,playableRate:playable/n*100,resilienceRate:Math.min(100,(totalActions/n)*12),avgActions:totalActions/n,avgMonsters:totalMonsters/n,avgBackrow:totalBackrow/n,avgAtk:totalAtk/n,avgSearches:totalSearch/n,avgInteractions:totalInter/n,avgResources:totalResources/n,branching:branching/n};
  }
  function monteCarloOpening(cards,trials=300){const deck=[];for(const c of cards||[])for(let i=0;i<Math.max(0,Number(c.qty||1));i++)deck.push(c);if(!deck.length)return{trials:0,playableRate:0,starterRate:0,interactionRate:0,searchRate:0,drawRate:0,resilienceRate:0};let playable=0,starter=0,interaction=0,search=0,draw=0,resilience=0;const has=(c,re)=>re.test(low(cardText(c)+' '+String(c.role||'')));for(let t=0;t<trials;t++){const a=deck.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}const hand=a.slice(0,Math.min(5,a.length));const st=hand.some(c=>/starter|buscador/i.test(String(c.role||''))||has(c,/add .*from .*deck|search|añade .*deck|busca|special summon.*from .*deck|invoca.*especial.*deck/));const it=hand.some(c=>/hand trap|interrupción|interaction/i.test(String(c.role||''))||has(c,/negate|niega|destroy|banish|hand trap/));const se=hand.some(c=>has(c,/add .*from .*deck|search|añade .*deck|busca/));const dr=hand.some(c=>has(c,/draw|roba/));const ex=hand.some(c=>/extender/i.test(String(c.role||''))||has(c,/special summon.*from (?:hand|graveyard|banished)|invoca.*especial.*(?:mano|cementerio|desterrad)/));const sim=simulateLine(hand,{opening:true});if(st)starter++;if(it)interaction++;if(se)search++;if(dr)draw++;if(st||ex||sim.executed.length)playable++;if(sim.state.analysis.successfulSummons>1||sim.state.analysis.successfulActivations>1)resilience++;}return{trials,playableRate:playable/trials*100,starterRate:starter/trials*100,interactionRate:interaction/trials*100,searchRate:search/trials*100,drawRate:draw/trials*100,resilienceRate:resilience/trials*100};}

  return {makeState,parseCard,parsePSCT,activate,resolveTop,advance,locate,cardByName,legalTargets,buildSEGOC,openTriggerWindow,canRespond,summonCheck,performNormalSummon,performSpecialSummon,registerContinuous,applyReplacement,damageStep,passPriority,snapshot,restore,simulateLine,searchOpeningLines,evaluateOpeningSamples,analysisSnapshot,monteCarloOpening,markUsed,PHASES,FAST_TIMINGS,VERSION:'v5-rules-visual'};
})();
window.YGORulingEngine=YGORulingEngine;
function rulingEsc(s){return esc(String(s??''));}
function rulingSummary(st){return `Mano ${st.zones[0].hand.length} · Campo ${st.zones[0].monster.length+st.zones[0].spelltrap.length} · Cementerio ${st.zones[0].gy.length} · Desterradas ${st.zones[0].banished.length} · LP ${st.lp[0]}/${st.lp[1]} · Cadena ${st.chain.length} · ${st.phase}`;}
let __ygoRulingState=null,__ygoRulingCard=null,__ygoRulingUid=null,__ygoRulingEffect=1;
function rulingTargetChoices(st,e){const html=[];for(const t of e.targets){const pools=YGORulingEngine.legalTargets(st,0,e,[]);for(const x of pools.flatMap(p=>p.pool||[]))html.push(`<label class="ygo-ruling-target"><input type="checkbox" value="${rulingEsc(x.uid)}"> ${rulingEsc(x.card.name)}</label>`);}return html.join('')||'<span class="tiny muted">Este efecto no requiere selección de objetivos o no hay objetivos legales representados.</span>';}
function rulingRender(st,c){const host=document.getElementById('ygoRulingBody');if(!host)return;const parsed=YGORulingEngine.parseCard(c),effect=parsed.effects.find(x=>x.id===__ygoRulingEffect)||parsed.effects[0];if(effect)__ygoRulingEffect=effect.id;
 host.innerHTML=`<div class="ygo-ruling-grid"><div class="ygo-ruling-card"><b>ESTADO</b><span>${rulingEsc(rulingSummary(st))}</span></div><div class="ygo-ruling-card"><b>PSCT COMPILADO</b><span>${parsed.effects.length} efecto(s) · condiciones ${parsed.effects.filter(x=>x.condition).length} · costes ${parsed.effects.filter(x=>x.costs.length).length} · objetivos ${parsed.effects.filter(x=>x.targets.length).length}</span></div><div class="ygo-ruling-card"><b>EFECTO ACTUAL</b><span>${rulingEsc(effect?.kind||'OTHER')} · ${rulingEsc(effect?.timing?.quick?'FAST/QUICK':'STANDARD')}</span></div></div>
 <div class="ygo-ruling-card" style="margin-top:10px"><b>EFECTOS INDIVIDUALES DE LA CARTA</b><div class="ygo-ruling-effects">${parsed.effects.map(e=>`<button type="button" class="adv-btn" onclick="__ygoRulingEffect=${e.id};rulingRender(__ygoRulingState,__ygoRulingCard)">EFECTO ${e.id} · ${rulingEsc(e.kind)}</button>`).join('')}</div><div class="tiny" style="margin-top:7px">${rulingEsc(effect?.raw||'Sin texto')}</div></div>
 <div class="ygo-ruling-card" style="margin-top:10px"><b>COSTES SELECCIONABLES</b><div class="ygo-ruling-targets ygo-ruling-cost">${(effect?.costs||[]).flatMap(cost=>{if(cost.kind==='DISCARD')return zone(st,0,'hand').map(x=>`<label class=\"ygo-ruling-target\"><input type=\"checkbox\" value=\"${rulingEsc(x.uid)}\"> DESCARTAR · ${rulingEsc(x.card.name)}</label>`);if(cost.kind==='TRIBUTE')return zone(st,0,'monster').map(x=>`<label class=\"ygo-ruling-target\"><input type=\"checkbox\" value=\"${rulingEsc(x.uid)}\"> TRIBUTAR · ${rulingEsc(x.card.name)}</label>`);return [];}).join('')||'<span class=\"tiny muted\">No hay costes seleccionables representados para este efecto.</span>'}</div></div>
 <div class="ygo-ruling-card" style="margin-top:10px"><b>OBJETIVOS LEGALES REPRESENTADOS</b><div class="ygo-ruling-targets">${effect?rulingTargetChoices(st,effect):''}</div></div>
 <div class="ygo-ruling-actions"><button class="adv-btn" onclick="rulingNormalSummon()">INVOCAR NORMAL</button><button class="adv-btn" onclick="rulingActivateSelected()">ACTIVAR EFECTO</button><button class="adv-btn" onclick="rulingResolveTop()">RESOLVER CADENA</button><button class="adv-btn" onclick="rulingAdvancePhase()">AVANZAR FASE</button><button class="adv-btn" onclick="rulingReset()">REINICIAR ESTADO</button></div>
 <div class="ygo-ruling-card" style="margin-top:10px"><b>REGISTRO DETERMINISTA</b><div class="ygo-ruling-log">${rulingEsc(st.log.slice(-80).join('\n')||'Estado inicial creado.')}</div></div>`;
}
function openRulingSimulator(name){const c=YGORulingEngine.cardByName(name);if(!c)return;__ygoRulingCard=c;__ygoRulingState=YGORulingEngine.makeState();__ygoRulingEffect=1;let q=__ygoRulingState.zones[0].hand.find(x=>x.card.name===c.name);if(!q){q=__ygoRulingState.zones[0].deck.find(x=>x.card.name===c.name);if(q){__ygoRulingState.zones[0].deck.splice(__ygoRulingState.zones[0].deck.indexOf(q),1);__ygoRulingState.zones[0].hand.push(q);}}if(!q&&extraType(c)){q=makeItem(c,'SIM-'+Date.now(),0);__ygoRulingState.zones[0].hand.push(q);}__ygoRulingUid=q?.uid||null;let modal=document.getElementById('ygoRulingModal');if(!modal){const d=document.createElement('div');d.id='ygoRulingModal';d.className='ygo-ruling-modal';d.innerHTML=`<div class="ygo-ruling-dialog"><div class="ygo-ruling-head"><div><div class="boxTitle">⚖ SIMULADOR DE RULINGS · MOTOR DE ESTADOS</div><div class="tiny">PSCT · costes · objetivos · Cadena · SEGOC · Damage Step · materiales</div></div><button class="ygo-ruling-close adv-btn" onclick="closeRulingSimulator()">× CERRAR</button></div><div id="ygoRulingBody"></div></div>`;d.addEventListener('click',e=>{if(e.target===d)closeRulingSimulator()});document.body.appendChild(d);modal=d;}modal.classList.add('open');rulingRender(__ygoRulingState,c);}
function closeRulingSimulator(){document.getElementById('ygoRulingModal')?.classList.remove('open');}
function rulingNormalSummon(){if(!__ygoRulingState)return;const r=YGORulingEngine.performNormalSummon(__ygoRulingState,0,__ygoRulingUid);if(!r.ok)__ygoRulingState.log.push('NO INVOCADA: '+r.reason);rulingRender(__ygoRulingState,__ygoRulingCard);}
function rulingActivateSelected(){if(!__ygoRulingState||!__ygoRulingCard||!__ygoRulingUid)return;const effect=YGORulingEngine.parseCard(__ygoRulingCard).effects.find(e=>e.id===__ygoRulingEffect);const targets=[...document.querySelectorAll('.ygo-ruling-target input:checked')].map(x=>x.value);const costChoices=[...document.querySelectorAll('.ygo-ruling-cost input:checked')].map(x=>x.value);const r=YGORulingEngine.activate(__ygoRulingState,0,__ygoRulingCard,__ygoRulingUid,__ygoRulingEffect,targets,costChoices);if(!r.ok)__ygoRulingState.log.push('NO ACTIVADA: '+r.reason);else{const e=effect;if(e)YGORulingEngine.markUsed(__ygoRulingState,0,__ygoRulingCard,e);}rulingRender(__ygoRulingState,__ygoRulingCard);}
function rulingResolveTop(){if(!__ygoRulingState||!__ygoRulingCard)return;const r=YGORulingEngine.resolveTop(__ygoRulingState);if(!r.ok)__ygoRulingState.log.push('NO RESUELTA: '+r.reason);rulingRender(__ygoRulingState,__ygoRulingCard);}
function rulingAdvancePhase(){if(!__ygoRulingState||!__ygoRulingCard)return;YGORulingEngine.advance(__ygoRulingState);rulingRender(__ygoRulingState,__ygoRulingCard);}
function rulingReset(){if(__ygoRulingCard)openRulingSimulator(__ygoRulingCard.name);}

const __baseLoadDeck=loadDeck;loadDeck=function(id){try{consistencyCacheKey='';consistencyCache=null}catch(e){}return __baseLoadDeck(id)};
