---
"mattpocock-skills": patch
---

The GitHub issue tracker template that `setup-matt-pocock-skills` writes now lists external PRs for triage with `gh api 'repos/{owner}/{repo}/pulls?state=open'`, because `gh pr list --json` has no `authorAssociation` field and the old command always failed. It also drops `OWNER`/`MEMBER`/`COLLABORATOR` PRs instead of allow-listing first-contribution values, so `FIRST_TIMER` authors are no longer filtered out. Re-run `/setup-matt-pocock-skills` to refresh your `docs/agents/issue-tracker.md`. Thanks @lofi-coding for the report (#468).
