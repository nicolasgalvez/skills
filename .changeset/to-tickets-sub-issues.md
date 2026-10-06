---
"mattpocock-skills": patch
---

`to-tickets` now attaches each ticket to the parent issue it was cut from as a native sub-issue, on trackers that have them. The GitHub tracker template that `setup-matt-pocock-skills` writes gains a concrete operation for it (`gh issue create --parent`, or `gh issue edit <parent> --add-sub-issue`, with a `gh api` fallback for `gh` older than 2.94), and `wayfinder`'s child tickets use the same one. The GitLab template gains its equivalent, a `Part of #<parent>` line. The ticket template's `## Blocked by` section is now omitted when blockers were set as native edges, so they aren't recorded twice. Re-run `/setup-matt-pocock-skills` to refresh your `docs/agents/issue-tracker.md`. Thanks @richardwhatever for the report (#554), and @adamslowe for spotting the duplicate blockers (#262).
