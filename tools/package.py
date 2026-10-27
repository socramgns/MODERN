#!/usr/bin/env python3
"""Package source and evidence only after the tested artifact is consistent."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'dist/Analizador_YuGiOh_Fuente_y_Pruebas.zip'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def package():
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    source = hashlib.sha256()
    sources = [ROOT / 'manifest.json'] + sorted((ROOT / 'tools').rglob('*')) + sorted((ROOT / 'src').rglob('*'))
    for path in sources:
        if path.is_file() and '__pycache__' not in path.parts:
            source.update(str(path.relative_to(ROOT)).encode() + b'\0' + path.read_bytes() + b'\0')
    assert source.hexdigest() == build['buildId'], 'Rebuild and test the changed source before packaging'
    actual = sha((ROOT / build['output']).read_bytes())
    assert actual == build['htmlSha256'], 'The artifact differs from its manifest'
    for name in ['dist/validation-summary.json', 'dist/test-evidence.json',
                 'tests/archetypes-browser-results.json']:
        report = json.loads((ROOT / name).read_text())
        assert report['pass'], f'Validation failed: {name}'
        assert report['buildId'] == build['buildId'], f'Stale source report: {name}'
        assert report['htmlSha256'] == actual, f'Stale HTML report: {name}'
    files = [ROOT / name for name in ['manifest.json', 'README.md', 'CAMBIOS.md',
                                     'requirements-dev.txt', '.gitignore', '.gitattributes']]
    for folder in ['src', 'tools', 'tests', 'examples', 'docs', 'dist', '.github']:
        files.extend(p for p in (ROOT / folder).rglob('*')
                     if p.is_file() and '__pycache__' not in p.parts
                     and p.suffix not in ['.pyc', '.zip', '.tmp']
                     and p.name != 'package-manifest.json')
    files = sorted(set(files))
    temporary = OUTPUT.with_suffix('.zip.tmp')
    with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED,
                         compresslevel=9) as archive:
        for path in files:
            entry = zipfile.ZipInfo('Analizador_YuGiOh/' + str(path.relative_to(ROOT)),
                                    date_time=(1980, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, path.read_bytes())
    temporary.replace(OUTPUT)
    report = {'schema': 'ygo-delivery-package/v1', 'buildId': build['buildId'],
              'htmlSha256': actual, 'zipSha256': sha(OUTPUT.read_bytes()),
              'zip': str(OUTPUT.relative_to(ROOT)), 'bytes': OUTPUT.stat().st_size,
              'fileCount': len(files), 'members': [str(p.relative_to(ROOT)) for p in files],
              'pass': True}
    (ROOT / 'dist/package-manifest.json').write_text(json.dumps(report, indent=2))
    print(json.dumps({key: value for key, value in report.items() if key != 'members'}))
    return report


if __name__ == '__main__':
    package()
