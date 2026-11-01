"""Check local links/assets and repo-subpath portability without dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()
errors = []
class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ('src', 'href', 'poster') or not value:
                continue
            url = urlsplit(value)
            if url.scheme or url.netloc or not url.path:
                continue
            if url.path.startswith('/'):
                errors.append(f'{page.name}: absolute path {value}')
                continue
            target = (page.parent / unquote(url.path)).resolve()
            if not target.is_relative_to(root) or not target.exists():
                errors.append(f'{page.relative_to(root)}: missing/unsafe {value}')
for page in root.rglob('*.html'):
    Links().feed(page.read_text(encoding='utf-8'))
if not (root / 'index.html').is_file():
    errors.append('index.html missing')
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'PASS: {len(list(root.rglob("*.html")))} HTML pages; local links and assets resolve under a repository subpath.')

