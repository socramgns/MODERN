/* Versioned technical catalogue, alias identities and explicit format pools.
 * This layer does not certify official card text, rulings or digital releases. */
(() => {
  'use strict';
  const W = window;
  const manifest = W.YGO_CATALOG_MANIFEST || {};
  const expectedCount = Number(manifest.cardCount || W.YGO_BUILD_MANIFEST?.catalogCardCount || 0);
  const fingerprint = String(manifest.cardsSha256 || '');
  const matchedSources = new Set((manifest.sources || []).map(source => source.file));
  const sourceByFile = new Map((manifest.sources || []).map(source => [source.file, source]));
  const unknownSourceIds = new Set((manifest.unmatchedLegacyRows || []).map(row => Number(row.id)));
  const attributeNames = {1:'TIERRA',2:'AGUA',4:'FUEGO',8:'VIENTO',16:'LUZ',32:'OSCURIDAD',64:'DIVINO'};
  const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  let rawById = new Map(), byId = new Map(), byName = new Map(), appliedArray = null;
  let applying = false, readyResolve, readyReject, lastError = null;
  const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
  // The caller can inspect status even if an older catalogue cannot hydrate.
  ready.catch(() => {});

  function canonicalIdentity(input) {
    const id = Number(typeof input === 'object' ? input?.id ?? input?.cardId : input);
    if (!Number.isSafeInteger(id) || id <= 0) return {id:null, canonicalId:null, known:false, status:'INVALID_PASSCODE'};
    const seen = new Set(), chain = [], aliases = manifest.aliases || {};
    let current = id;
    while (Number.isSafeInteger(Number(aliases[current])) && Number(aliases[current]) > 0) {
      if (seen.has(current) || chain.length > 16) return {id, canonicalId:null, known:false, status:'ALIAS_CYCLE', chain};
      seen.add(current); chain.push(current); current = Number(aliases[current]);
    }
    return {id, canonicalId:current, chain, known:byId.has(id),
      status:byId.has(id) ? (current === id ? 'PASSCODE_SOURCE_MATCHED' : 'CDB_ALIAS_FAMILY') : 'UNKNOWN_PASSCODE',
      authority:'PROJECT_IGNIS_TECHNICAL_IDENTITY', officialIdentityCertified:false};
  }

  function indexNames() {
    byName = new Map();
    for (const card of byId.values()) {
      for (const name of [card.name, card.canonicalName, ...(card.legacyNames || [])]) {
        const key = normalize(name);
        if (!key) continue;
        if (!byName.has(key)) byName.set(key, new Set());
        byName.get(key).add(Number(card.id));
      }
    }
  }

  function resolveName(name, options = {}) {
    const ids = [...(byName.get(normalize(name)) || [])].filter(id =>
      !options.format || poolEvidence(byId.get(id), options.format).eligible === true);
    const families = [...new Set(ids.map(id => canonicalIdentity(id).canonicalId))];
    return {name:String(name || ''), ids, canonicalIds:families,
      status:ids.length === 0 ? 'UNKNOWN_NAME' : families.length === 1 ? 'RESOLVED_IDENTITY_FAMILY' : 'AMBIGUOUS_NAME',
      pass:ids.length > 0 && families.length === 1, officialIdentityCertified:false};
  }

  function enrich(card) {
    if (!card || typeof card !== 'object') return card;
    const id = Number(card.id ?? card.cardId), raw = rawById.get(id);
    const rename = manifest.canonicalNames?.[id];
    if (rename) {
      card.canonicalName = rename.canonicalName;
      card.legacyNames = [...new Set([...(card.legacyNames || []), ...rename.legacyNames, card.name].filter(Boolean))];
    } else card.canonicalName = card.canonicalName || card.name;
    const matched = !!raw && matchedSources.has(raw[6]) && !unknownSourceIds.has(id);
    card.technicalSourceMatched = matched;
    // Old booleans and URLs are retained as claims, never as certification.
    if(card.metadataVerified===true)card.legacyMetadataVerifiedClaim=true;
    card.metadataVerified=false;
    card.metadataEvidenceStatus=matched?'PINNED_TECHNICAL_SOURCE_ONLY':'LEGACY_SOURCE_UNRESOLVED';
    if (!matched) {
      card.catalogueSupport = 'LEGACY_SOURCE_UNRESOLVED';
      card.poolEvidenceStatus = 'UNKNOWN_SOURCE';
      return card;
    }
    const typeBits = Number(raw[3]), packed = Number(raw[10]);
    card.typeBits = typeBits;
    if (typeof W.decodeCDBType === 'function') card.type = W.decodeCDBType(typeBits);
    card.frameType = String(card.type || '').toLowerCase().replace(/\s+/g, '-');
    card.desc = raw[2];
    card.attribute = attributeNames[Number(raw[4])] || '—';
    card.race = Number(raw[7]);
    card.setcode = String(raw[11] ?? '');
    card.ot = Number(raw[12]);
    card.alias = Number(raw[13]);
    card.category = Number(raw[14]);
    card.source = raw[6];
    card.sourceUpdatedAt = Number(raw[5]);
    card.catalogueFingerprint = fingerprint;
    card.catalogueSupport = /unofficial|skills/.test(card.source) ? 'SEPARATE_FORMAT_ASSET' : 'TECHNICAL_SOURCE_MATCHED';
    card.poolEvidenceStatus = 'CDB_SCOPE_FLAGS_ONLY';
    card.metadataSource = sourceByFile.get(card.source)?.url || card.source;
    card.metadataSourceCommit = manifest.sourceCommit;
    card.statsApplicable = !!(typeBits & 1);
    if (typeBits & 1) {
      const hasStats = Number.isFinite(raw[8]) && Number.isFinite(raw[9]) && Number.isFinite(packed);
      card.statsKnown = hasStats;
      card.atk = hasStats ? Number(raw[8]) : null;
      card.def = hasStats && !(typeBits & 0x4000000) ? Number(raw[9]) : null;
      card.defApplicable = !(typeBits & 0x4000000);
      card.questionAtk = hasStats && Number(raw[8]) === -2;
      card.questionDef = hasStats && Number(raw[9]) === -2;
      card.printedAtk = card.questionAtk ? '?' : card.atk;
      card.printedDef = card.defApplicable ? (card.questionDef ? '?' : card.def) : null;
      card.linkMarkers = typeBits & 0x4000000 ? Number(raw[9]) : 0;
      card.level = hasStats ? ((typeBits & (0x800000 | 0x4000000)) ? 0 : packed & 0xff) : null;
      card.rank = hasStats ? ((typeBits & 0x800000) ? packed & 0xff : 0) : null;
      card.linkval = hasStats ? ((typeBits & 0x4000000) ? packed & 0xff : 0) : null;
      card.scaleL = hasStats ? (packed >>> 24) & 0xff : null;
      card.scaleR = hasStats ? (packed >>> 16) & 0xff : null;
      card.statsStatus = hasStats ? 'CDB_PINNED_TECHNICAL_SOURCE' : 'DATOS_DESCONOCIDOS';
    } else card.statsKnown = null;
    return card;
  }

  function poolEvidence(cardOrId, format = 'tcg', date = null) {
    const card = typeof cardOrId === 'object' ? cardOrId : byId.get(Number(cardOrId));
    const key = String(format).toLowerCase().replace(/[ _-]/g, '');
    if (!card) return {status:'UNKNOWN_CARD', eligible:null, reasons:['PASSCODE_NOT_IN_CATALOGUE'], date, certified:false};
    const source = String(card.source || ''), bits = Number(card.typeBits), ot = Number(card.ot);
    const reasons = [];
    if (!card.technicalSourceMatched) return {status:'UNKNOWN_SOURCE', eligible:null, reasons:['LEGACY_SOURCE_UNRESOLVED'], date, certified:false};
    if (/unofficial/.test(source) || (ot & (4|8|16|32))) reasons.push('UNOFFICIAL_OR_NONSTANDARD_POOL');
    if (/skills/.test(source) || bits === 0x8000000) reasons.push('SKILL_REQUIRES_SEPARATE_ENGINE');
    if (/^(tcg|tcgtraditional|ocg|goat|timewizard)$/.test(key)) {
      if (/rush/.test(source) || (ot & 512)) reasons.push('RUSH_CARD_IN_STANDARD_FORMAT');
      if (ot & 256) reasons.push('PRERELEASE_AVAILABILITY_NOT_CONFIRMED');
      const flag = key === 'ocg' ? 1 : 2;
      if (!(ot & flag)) reasons.push('NO_' + (flag === 1 ? 'OCG' : 'TCG') + '_SCOPE_FLAG');
      if (key === 'goat' || key === 'timewizard') return {status:'HISTORICAL_RELEASE_DATE_REQUIRED', eligible:reasons.length ? false : null, reasons:[...reasons,'HISTORICAL_POOL_NOT_PROVEN'], date, certified:false};
    } else if (key === 'rush' || key === 'rushduel') {
      if (!(ot & 512)) reasons.push('NO_RUSH_SCOPE_FLAG');
    } else if (key === 'speedduel') return {status:'EVENT_AND_PRINT_VERIFICATION_REQUIRED', eligible:reasons.length ? false : null, reasons:[...reasons,'SPEED_LOGO_AND_EVENT_LIST_REQUIRED'], date, certified:false};
    else return {status:'DIGITAL_POOL_NOT_VERIFIED', eligible:reasons.length ? false : null, reasons:[...reasons,'DIGITAL_AVAILABILITY_AND_SKILL_RULES_REQUIRED'], date, certified:false};
    return {status:reasons.length ? 'OUTSIDE_TECHNICAL_POOL' : 'TECHNICAL_POOL_MATCH', eligible:reasons.length === 0,
      reasons, date, releaseDateVerified:false, authority:'PROJECT_IGNIS_SCOPE_FLAGS', certified:false};
  }

  function auditDeck(deck, options = {}) {
    const errors = [], warnings = [], families = new Map(), counts = {main:0,extra:0,side:0};
    const format = options.format || 'tcg';
    for (const zone of Object.keys(counts)) {
      if (!Array.isArray(deck?.[zone])) { errors.push({zone,reason:'ZONE_NOT_ARRAY'}); continue; }
      for (const item of deck[zone]) {
        const id = Number(item?.id ?? item?.cardId), quantity = Number(item?.qty ?? 1);
        if (!Number.isSafeInteger(quantity) || quantity < 1) { errors.push({id,zone,reason:'INVALID_QUANTITY'}); continue; }
        counts[zone] += quantity;
        const identity = canonicalIdentity(id), card = byId.get(id);
        if (!card || identity.canonicalId == null) { errors.push({id,zone,reason:'UNKNOWN_IDENTITY'}); continue; }
        const key = identity.canonicalId;
        families.set(key, (families.get(key) || 0) + quantity);
        const extraOnly = !!(Number(card.typeBits) & (0x40|0x2000|0x800000|0x4000000));
        if ((zone === 'main' && extraOnly) || (zone === 'extra' && !extraOnly)) errors.push({id,zone,reason:'WRONG_DECK_ZONE'});
        const pool = poolEvidence(card, format, options.date || null);
        if (pool.eligible === false) errors.push({id,zone,reason:pool.status,details:pool.reasons});
        else if (pool.eligible == null) warnings.push({id,zone,reason:pool.status,details:pool.reasons});
      }
    }
    const digitalSmall = /duellinks|speedduel/i.test(String(format).replace(/[ _-]/g,''));
    const min = digitalSmall ? 20 : 40, max = digitalSmall ? 30 : 60;
    if (counts.main < min || counts.main > max) errors.push({zone:'main',reason:'MAIN_SIZE',min,max,actual:counts.main});
    if (counts.extra > (options.extraMax ?? (digitalSmall ? 8 : 15))) errors.push({zone:'extra',reason:'EXTRA_SIZE'});
    if (counts.side > 15) errors.push({zone:'side',reason:'SIDE_SIZE'});
    for (const [id, quantity] of families) if (quantity > 3) errors.push({id,quantity,reason:'ALIAS_FAMILY_OVER_THREE'});
    const regulation = Array.isArray(options.banlist) ? options.banlist : null;
    if (regulation) {
      for (const rule of regulation) {
        const maxCopies = Number(rule.max);
        if (!Number.isInteger(maxCopies) || maxCopies < 0 || maxCopies > 2) continue;
        const resolved = rule.id ? canonicalIdentity(rule.id) : null;
        const named = resolveName(rule.name, {format});
        const restrictedIds = new Set([...(resolved?.known ? [resolved.canonicalId] : []), ...named.canonicalIds]);
        if (!restrictedIds.size) { warnings.push({name:rule.name,reason:'RESTRICTED_IDENTITY_UNRESOLVED'}); continue; }
        const copies = [...restrictedIds].reduce((n,id) => n + (families.get(id) || 0), 0);
        if (copies > maxCopies) errors.push({name:rule.name,reason:'BANLIST_MAXIMUM',copies,maximum:maxCopies});
      }
    } else warnings.push({reason:'BANLIST_SNAPSHOT_NOT_SUPPLIED'});
    return {schemaVersion:1,counts,errors,warnings,physicalValid:!errors.some(e => /QUANTITY|SIZE|ZONE|OVER_THREE|IDENTITY/.test(e.reason)),
      pass:errors.length === 0,format,banlistDate:options.banlistDate || null,catalogueFingerprint:fingerprint,
      officialLegalityCertified:false,certified:false,scope:'CONSTRUCTION_TECHNICAL_POOL_AND_PROVIDED_SNAPSHOT_ONLY'};
  }

  function status() {
    const cards = [...byId.values()], monsters = cards.filter(card => Number(card.typeBits) & 1);
    return {schemaVersion:manifest.schemaVersion || null,sourceCommit:manifest.sourceCommit || null,
      cardsSha256:fingerprint,cardCount:cards.length,expectedCount,
      loaded:expectedCount > 0 && cards.length === expectedCount,
      sourceMatched:cards.filter(card => card.technicalSourceMatched).length,
      monsterCount:monsters.length,knownMonsterStats:monsters.filter(card => card.statsKnown === true).length,
      unknownMonsterStats:monsters.filter(card => card.statsKnown !== true).length,
      unresolvedLegacyRows:manifest.unmatchedLegacyRows || [],
      restrictedNamesNotInCatalogue:manifest.restrictedNamesNotInRetainedCatalogue || [],
      aliases:Object.keys(manifest.aliases || {}).length,error:lastError,officialMetadataCertified:false};
  }

  function apply() {
    if (applying) return status();
    const catalog = Array.isArray(W.CARD_CATALOG) ? W.CARD_CATALOG : [];
    if (!rawById.size || catalog.length !== expectedCount) return status();
    applying = true;
    const changed = appliedArray !== catalog;
    try {
      for (const card of catalog) enrich(card);
      byId = new Map(catalog.map(card => [Number(card.id),card]));
      indexNames();
      for (const zone of ['main','extra','side']) for (const card of W.deckState?.[zone] || []) enrich(card);
      appliedArray = catalog;
    } finally { applying = false; }
    if (changed) W.dispatchEvent(new CustomEvent('ygo-catalog-updated',{detail:status()}));
    return status();
  }

  let migration;
  async function migrateCache() {
    if (migration) return migration;
    migration = (async () => {
      if (!fingerprint || typeof W.openYGOCardDB !== 'function') return;
      const db = await W.openYGOCardDB();
      const previous = await new Promise((resolve,reject) => {
        const tx = db.transaction('meta','readonly'), request = tx.objectStore('meta').get('catalogue-build-hash');
        request.onsuccess = () => resolve(request.result?.value || null); request.onerror = () => reject(request.error);
      });
      if (previous !== fingerprint) await new Promise((resolve,reject) => {
        const tx = db.transaction(['cards','meta'],'readwrite');
        tx.objectStore('cards').clear();
        tx.objectStore('meta').put({key:'catalogue-build-hash',value:fingerprint,sourceCommit:manifest.sourceCommit});
        tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
      });
      // The saved-deck and evaluation stores are intentionally untouched.
      db.close();
    })();
    return migration;
  }

  const baseLoad = W.loadOfflineDB;
  if (typeof baseLoad === 'function') W.loadOfflineDB = async function(...args) {
    await migrateCache();
    const result = await baseLoad.apply(this,args);
    apply();
    return result;
  };
  W.YGODataCatalog = Object.freeze({ready,manifest,status,apply,canonicalIdentity,resolveName,poolEvidence,auditDeck,
    lookup:id => byId.get(Number(id)) || null,
    // Legacy renderers mutate shared objects (for example race becomes a label).
    // Rules consumers receive a fresh copy restored from the pinned raw row.
    rulesCard:id => {const c=byId.get(Number(id));return c?enrich(structuredClone(c)):null;},
    normalizeName:normalize});

  async function initialize() {
    try {
      await migrateCache();
      const rows = await W.getEmbeddedDB?.();
      if (!Array.isArray(rows) || rows.length !== expectedCount) throw new Error('CATALOGUE_MANIFEST_COUNT_MISMATCH');
      rawById = new Map(rows.map(row => [Number(row[0]),row]));
      if (W.__YGO_ENGINE_READY) await W.__YGO_ENGINE_READY;
      if (W.CARD_CATALOG?.length !== expectedCount) await (W.YGOAlpha984?.ensureCatalog984?.() || W.loadOfflineDB?.());
      const report = apply();
      if (!report.loaded) throw new Error('CATALOGUE_HYDRATION_INCOMPLETE');
      readyResolve(report);
    } catch (error) { lastError=String(error?.message || error); readyReject(error); }
  }
  initialize();
})();
