# Publishing research to EVADE

Say to Codex: **Publish this research to EVADE.**

For a specific article: **Publish our agreed [topic] research to EVADE.**
For a preview without publication: **Prepare [topic] for EVADE as a draft.**

The publishing workflow uses the agreed text from the conversation, creates an
article consistent with the existing layout, adds it to the research archive,
checks links and presentation, then updates `main`. GitHub Actions prepares the
static site and deploys it. The assistant returns the verified live article URL.

The request to publish is the instruction to deploy that identified content;
routine uploads and deployment steps do not require the user to do them manually.
An ambiguous article or an explicit content hold must be resolved before publishing.
The November 1 Microsoft/Oracle/Palantir comparison remains held for discussion.

## Repository and addresses

- Repository: https://github.com/isimpfornitr0-droid/evade-research
- Website: https://isimpfornitr0-droid.github.io/evade-research/
- Notebook: https://isimpfornitr0-droid.github.io/evade-research/my-research.html
- Deployment status: https://github.com/isimpfornitr0-droid/evade-research/actions
- Branch: `main`; publication source: GitHub Actions; files: `dist/`.

## Update procedure

Fetch the current remote head and preserve unrelated edits. Create or revise the
intended page; include an evidence cutoff and sources, then update `research.html`
and any appropriate featured links. Run the checks in `AGENTS.md` and inspect the
changed page. Commit only the relevant files and push without force. Connected
GitHub tools can perform the commit/ref update if local Git lacks authentication.
Wait for the workflow's result and open the actual deployed page before reporting
success. A failed deployment is a failed publication even if a commit exists.

If using GitHub's Git Data API: create blobs/tree, create a commit with the observed
current parent SHA, and update `main` with that SHA as the expected previous head.
Do not retry a rejected head lease without reading and incorporating the new head.

## Data boundaries

Research pages are public website files. Personal notebook entries remain in the
browser. Stable-domain site updates retain them; clearing browser storage or
changing device/domain can make them unavailable. Use Export backup regularly.
Do not commit backups, credentials, teaching recordings/transcripts or local bot
state. The static site does not run scheduled research or live quote refreshes.
