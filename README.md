# EVADE Research

A buildless research website for GitHub Pages. The editable website is in `dist/`.
Personal notes live in the browser; GitHub hosts the website files.

## Open EVADE

Website: https://isimpfornitr0-droid.github.io/evade-research/

Personal notebook: https://isimpfornitr0-droid.github.io/evade-research/my-research.html

To publish an agreed article through Codex, say **Publish this research to EVADE.**
The local `evade-publish` skill handles page creation, archive links, validation,
deployment and live-link verification. See [PUBLISHING.md](PUBLISHING.md).
The Microsoft/Oracle/Palantir comparison remains a private discussion draft.

## First upload

Use the prepared `evade-research-github-ready.zip`, extract it, and upload its
**contents** to a new repository on your own GitHub account. Include the hidden
`.github/workflows/pages.yml` file. Do not upload the parent MACRO WEBSITE project:
it contains local teaching material, transcripts and unpublished research.

1. Create a repository named `evade-research`, using `main` as its default branch.
2. Upload the extracted files (or publish that extracted folder with GitHub Desktop).
3. In Settings → Pages → Build and deployment, select **GitHub Actions**.
4. Run **Publish website to GitHub Pages** from Actions if the initial push ran
   before Pages was enabled. The successful deployment supplies the actual URL,
   normally `https://YOUR-USERNAME.github.io/evade-research/`.
5. Bookmark that URL in Chrome. An ordinary repository does not itself provide
   a website URL until Pages is enabled and deployment succeeds.

GitHub Free supports Pages from public repositories. A private repository may
require a paid plan, and repository privacy does not by itself make Pages private.
The exported website is public-facing: do not commit personal notes or secrets.

## Personal notes and backups

Open **My research**. Save an observation, supporting evidence, thesis-break
condition and review date. Existing published forecasts remain separate.

- Notes are saved in localStorage for this browser profile and website origin.
  They are not uploaded, synced through GitHub, or accessible to Codex remotely.
- Changing browser/device/domain, clearing site data, or using private browsing
  can leave notes unavailable. Export JSON regularly and before moving domains.
- Import validates the complete backup first, merges new entries and skips exact
  duplicates. Conflicting IDs are rejected; existing notes are not overwritten.
- All Pages repositories on the same `USERNAME.github.io` domain share an origin.
  The app namespaces its key by path, but this is not a security boundary against
  other scripts on that origin. Do not store passwords or brokerage credentials.
- This page has no live quotes, automatic research generation, background updates
  or reminders. Review dates are labels. Data and research retain their dates.

## Updating and local preview

Edit `dist/`, run the checks below, then push to `main` to publish a new version.
Stable-domain updates preserve browser notes. Codex can help prepare repository
updates when requested; a static page cannot run the local Python research bot.

```sh
python scripts/prepare_public.py
python scripts/validate_site.py _site
python -m http.server 8765 --bind 127.0.0.1 --directory _site
```

Open `http://127.0.0.1:8765/`. Do not rely on `file://` localStorage behavior.
No npm install, API key, server account or paid data feed is needed.

The public build strips former-host canonical tags and excludes `dist/project/`
course/business working documents and their navigation links. It does not copy
`.openai`, Git history, research-audit, transcripts, personal backups or bot files.
The November 1 Microsoft/Oracle/Palantir analysis remains outside this site pending
discussion. Existing dated site articles are preserved.

No new open-source license is granted for third-party material by this packaging.

References: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages),
[browser storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

