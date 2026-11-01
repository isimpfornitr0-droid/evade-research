"""Prepare the static public site; never copy local research or hosting identity."""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'dist'
DEST = ROOT / '_site'

def prepare():
    # Fixed workspace child only; refuse symlinks before replacing generated output.
    if DEST.is_symlink() or DEST.resolve().parent != ROOT.resolve():
        raise ValueError('Unsafe output directory')
    if DEST.exists():
        shutil.rmtree(DEST)
    for src in SOURCE.rglob('*'):
        relative = src.relative_to(SOURCE)
        if 'project' in relative.parts or src.is_symlink() or not src.is_file():
            continue
        target = DEST / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if src.suffix == '.html':
            content = src.read_text(encoding='utf-8')
            content = re.sub(r'<link\b[^>]*rel=["\']canonical["\'][^>]*>', '', content, flags=re.I)
            content = re.sub(r'<a\b[^>]*href=["\'](?:\./)?project/[^"\']*["\'][^>]*>.*?</a>', '', content, flags=re.I | re.S)
            target.write_text(content, encoding='utf-8')
        else:
            shutil.copy2(src, target)
    (DEST / '.nojekyll').touch()
    print(f'Prepared {sum(p.is_file() for p in DEST.rglob("*"))} public files in {DEST}')

if __name__ == '__main__':
    prepare()

