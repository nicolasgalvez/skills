# What this fork changes

One thing: `disable-model-invocation: true` is deleted from every skill that upstream ships it
on — 23 of the 38. Nothing else differs, and `git diff upstream/main -- skills/` should show
that single line and no other content change.

## Why

That flag makes a skill user-invocable only. It never appears in an agent's skill list and an
agent cannot reach for it, so an unattended session can run at most the half of the flow those
skills describe — `triage`, `to-tickets`, `to-spec`, `wayfinder`, `implement` and the rest are
all gated upstream. Removing the line is enough on its own: a patched skill registers and
becomes invocable mid-session, with no restart.

Installing the skills as a plugin instead reintroduces the flag and cannot be patched.

## Maintaining it

A merge from upstream restores the line wherever upstream touched a skill's frontmatter, and a
re-gated skill fails by disappearing — the agent cannot see it and nothing reports why. So
after every merge:

```sh
git merge upstream/main
node checks/invocation-patch.mjs
```

The same check runs in CI on pull requests and on pushes to `main`, since a merge from upstream
can land on `main` without a PR.

`agents/openai.yaml` in 23 skills still carries `policy.allow_implicit_invocation: false`, the
equivalent gate on the Codex side. Those are left alone; Claude Code never reads them.

## Upstream

[`mattpocock/skills`](https://github.com/mattpocock/skills), MIT, © Matt Pocock. The contents of
`skills/` are his work, carried under that license.
