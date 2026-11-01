# EVADE Research website

This repository publishes to https://isimpfornitr0-droid.github.io/evade-research/
from `main` using `.github/workflows/pages.yml`. Editable static files are in
`dist/`; the generated `_site/` directory is ignored.

Read `PUBLISHING.md` before publishing. The user's short instruction is
"Publish this research to EVADE." It authorizes completing that identified
article's routine publishing workflow; do not make the user perform uploads.
Keep other drafts unpublished unless the user asks to publish them. The
Microsoft/Oracle/Palantir comparison is held for discussion as of November 1, 2026.

Keep dated sources, uncertainty, factual claims and analyst assumptions visible.
Preserve published forecast originals; append reviews/corrections. Preserve
browser notebook storage keys/schema and do not include personal backups in Git.

Validation:
```
python scripts/prepare_public.py
python scripts/validate_site.py _site
node scripts/test_notebook.cjs
```

Use a current remote parent and a normal fast-forward update. Verify deployment
completion and the live article after pushing. Never force-push over other work.
