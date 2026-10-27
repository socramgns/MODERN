#!/usr/bin/env python3
"""Rebuild and validate the standalone artifact. Starts its own private server."""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import argparse,functools,hashlib,json,subprocess,sys,threading,time
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--no-build',action='store_true');args=parser.parse_args()
 if not args.no_build:subprocess.run([sys.executable,'tools/build.py'],cwd=ROOT,check=True)
 build=json.loads((ROOT/'dist/build-manifest.json').read_text());started=time.time();rows=[]
 fingerprint=hashlib.sha256()
 for file in [ROOT/'manifest.json']+sorted((ROOT/'tools').rglob('*'))+sorted((ROOT/'src').rglob('*')):
  if file.is_file() and '__pycache__' not in file.parts:fingerprint.update(str(file.relative_to(ROOT)).encode()+b'\0'+file.read_bytes()+b'\0')
 if fingerprint.hexdigest()!=build['buildId']:raise RuntimeError('Rebuild the changed source before accepting delivered-byte tests')
 source=list((ROOT/'src/scripts').glob('*.js'))+list((ROOT/'src/modules').glob('*.js'))+list((ROOT/'src/app').glob('*.js'))
 for file in source:subprocess.run(['node','--check',str(file)],cwd=ROOT,capture_output=True,check=True)
 rows.append({'name':'source_syntax','pass':True,'files':len(source)})
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT/'dist')))
 thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
 url=f'http://127.0.0.1:{server.server_port}/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html'
 commands=[('release6_in_browser',[sys.executable,'tests/release6_browser.py','--url',url]),('laboratory_usability',[sys.executable,'tests/ux_revision6_browser.py','--url',url]),('local_file_delivery',[sys.executable,'tests/local_file_delivery.py','--engine','firefox']),('registered_response_chains',['node','tests/chain_responses.cjs']),('response_windows',['node','tests/response_windows.cjs']),('new_card_effects',['node','tests/new_card_effects.cjs']),('official_context_at_build',[sys.executable,'tests/official_context_build.py']),('search_horizons',['node','tests/search_limits.cjs']),('catalogue_expansion',[sys.executable,'tests/catalog_expansion.py']),('draw_uncertainty',['node','tests/draw_uncertainty.cjs']),('official_documents',[sys.executable,'tests/official_validation.py']),('duel_phases',['node','tests/duel_phases.cjs']),('physical_responses',['node','tests/responses.cjs']),('expanded_archetypes',['node','tests/archetypes_expanded.cjs']),('blue_eyes_duel',['node','tests/blue_eyes_duel.cjs']),('blue_eyes_protection_and_gy',['node','tests/blue_eyes_pending.cjs']),('mechaba_spell_activations',['node','tests/mechaba_expansion.cjs']),('mechaba_monster_zones',['node','tests/mechaba_monster_zones.cjs']),('mechaba_official_references',[sys.executable,'tests/mechaba_official_references.py']),('card_action_coverage',['node','tests/coverage.cjs']),('builtin_scenarios',['node','tests/scenario_examples.cjs']),('expanded_examples_in_browser',[sys.executable,'tests/expanded_examples_browser.py','--url',url]),('release5_in_browser',[sys.executable,'tests/release5_browser.py','--url',url]),('blue_eyes_in_browser',[sys.executable,'tests/blue_eyes_browser.py','--url',url]),('recommendations',['node','tests/recommendations.cjs']),('format_interface',[sys.executable,'tests/format_interface.py','--url',url]),('advanced_interface',[sys.executable,'tests/advanced_browser.py','--url',url]),('browser_compatibility',[sys.executable,'tests/compatibility_browser.py','--url',url]),('formats',['node','tests/formats.cjs']),('provenance',['node','tests/provenance.cjs']),('strategy',['node','tests/strategy.cjs']),('causal_core',['node','tests/combo_engine.cjs']),('archetype_rules',['node','tests/archetypes.cjs']),('causal_browser',[sys.executable,'tests/archetypes_browser.py','--url',url]),('catalogue',[sys.executable,'tests/catalog_probe.py']),('probability_and_calibration',['node','tests/probability_calibration.cjs']),('probability_in_browser',[sys.executable,'tests/probability_browser.py']),('ui_and_persistence',[sys.executable,'tests/ui_probe.py','--url',url]),('worker',[sys.executable,'tests/worker_probe.py',url,'tests/worker-results.json']),('supported_search',[sys.executable,'tests/supported_search_probe.py',url]),('delivered_bytes_e2e',[sys.executable,'tests/end_to_end.py','--url',url]),('context_in_browser',[sys.executable,'tests/context_browser.py','--url',url])]
 try:
  for name,command in commands:
   print('RUN',name,flush=True);t=time.time()
   try:result=subprocess.run(command,cwd=ROOT,capture_output=True,text=True,timeout=300)
   except subprocess.TimeoutExpired as error:
    value=lambda text:text.decode(errors='replace') if isinstance(text,bytes) else (text or '')
    result=subprocess.CompletedProcess(command,124,value(error.stdout),value(error.stderr)+'\nSuite exceeded its 300-second execution budget.')
   log=ROOT/'tests'/f'{name}.log';log.write_text(result.stdout+'\n'+result.stderr)
   rows.append({'name':name,'pass':result.returncode==0,'elapsedMs':round((time.time()-t)*1000),'log':str(log.relative_to(ROOT))})
   print(name,'PASS' if result.returncode==0 else 'FAIL',result.stdout[-2500:] if result.returncode else '',flush=True)
   if result.returncode:print(result.stderr[-4000:],flush=True)
 finally:server.shutdown();server.server_close()
 actual=hashlib.sha256((ROOT/build['output']).read_bytes()).hexdigest()
 rows.append({'name':'artifact_unchanged_during_tests','pass':actual==build['htmlSha256']})
 report={'schema':'ygo-validation-summary/v1','buildId':build['buildId'],'htmlSha256':actual,'pass':all(row['pass'] for row in rows),'suites':rows,'elapsedSeconds':round(time.time()-started,2),'limitations':['Registered TCG routes include six archetypes, declared physical fields, registered responses, phases and battle; unknown effects and post-shuffle draws remain outside verified transitions.','Competitive score remains provisional until external datasets are supplied.']}
 (ROOT/'dist/validation-summary.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False),flush=True)
 return 0 if report['pass'] else 1
if __name__=='__main__':raise SystemExit(main())
