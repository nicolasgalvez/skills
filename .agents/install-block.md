# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

`mattpocock-skills` is listed in **Claude Code's official marketplace** (configured name `claude-plugins-official`, source repo `anthropics/claude-plugins-official`), which every Claude Code install has out of the box. There is no marketplace to add first. Official Anthropic marketplaces have auto-update enabled by default ([discover-plugins](https://code.claude.com/docs/en/discover-plugins)), but the listing pins this repo to a commit `sha` that Anthropic moves by hand, so installed users only see a release once that pin moves (see ADR 0002's 2026-08-05 update). Never promise that updates arrive automatically or immediately; the block below says when they arrive and how to track the repo directly instead.

## Claude Code: the plugin

<canonical-block name="claude-code">

```bash
claude plugins install mattpocock-skills
```

Or, from inside a session:

```
/plugin install mattpocock-skills
```

It's in Claude Code's official marketplace, so there's nothing to add first. Updates reach you when Anthropic's marketplace moves its pin to a new release, which can lag behind this repo by days or weeks.

**Stuck on an old version?** `claude plugin list` shows what you have, and [CHANGELOG.md](../CHANGELOG.md) shows the latest release. To track this repo directly instead, switch to its own marketplace and turn on auto-update for it under `/plugin` → Marketplaces (it's off by default for marketplaces outside Anthropic's):

```bash
claude plugin uninstall mattpocock-skills@claude-plugins-official
claude plugin marketplace add mattpocock/skills
claude plugin install mattpocock-skills@mattpocock
```

</canonical-block>

## Copilot and Codex: the same plugin, via this repo's marketplace

Copilot and Codex both read `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json`, so the Claude plugin installs on them as-is, curated to the promoted set. Neither has an official listing, so the repo's own marketplace is their primary route. Verified 2026-10-07: Copilot CLI reports "Installed 27 skills"; Codex 0.161.0 loads the promoted skills and none from `misc/` or `in-progress/`. VS Code's command is doc-sourced ([agent-plugins](https://code.visualstudio.com/docs/copilot/customization/agent-plugins)). Skip `copilot plugin install mattpocock/skills`: Copilot warns that direct repo installs are deprecated.

<canonical-block name="copilot">

```bash
copilot plugin marketplace add mattpocock/skills
copilot plugin install mattpocock-skills@mattpocock
```

In VS Code, run **Chat: Install Plugin From Source** and enter `https://github.com/mattpocock/skills`.

</canonical-block>

<canonical-block name="codex">

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

</canonical-block>

## Gemini CLI: one install per promoted bucket

Gemini does not read `.claude-plugin`. `--path` takes one bucket folder, so two commands install exactly the promoted set (verified 2026-10-07: 27 skills, nothing from the other buckets). These are copies, not a managed plugin.

<canonical-block name="gemini">

```bash
gemini skills install https://github.com/mattpocock/skills.git --path skills/engineering
gemini skills install https://github.com/mattpocock/skills.git --path skills/productivity
```

</canonical-block>

## Every other agent: skills.sh

Everywhere else, [skills.sh](https://skills.sh/mattpocock/skills) copies editable skill files into the project. `-a` preselects the agent; every flag below was run on 2026-10-07. Prefer it over an agent's own repo-level installer (`amp skill add`, `pi install git:…`): those scan `skills/` recursively and pull in `misc/` and `in-progress/`.

<canonical-block name="other-agents">

| Agent         | Command                                               |
| ------------- | ----------------------------------------------------- |
| Cursor        | `npx skills@latest add mattpocock/skills -a cursor`   |
| OpenCode      | `npx skills@latest add mattpocock/skills -a opencode` |
| Devin         | `npx skills@latest add mattpocock/skills -a devin`    |
| Windsurf      | `npx skills@latest add mattpocock/skills -a windsurf` |
| Amp           | `npx skills@latest add mattpocock/skills -a amp`      |
| pi            | `npx skills@latest add mattpocock/skills -a pi`       |
| Anything else | `npx skills@latest add mattpocock/skills`             |

Pick the skills you want, and which coding agents to install them on. **The installer lets you choose which skills to take, so make sure `setup-matt-pocock-skills` is one of them.**

</canonical-block>

Use the single-skill form wherever one skill is named on its own. Note that **`docs/` pages are not a consumer of this block**: ai-hero renders the install widget above the body, so a page that writes the commands out duplicates it. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

```bash
npx skills@latest update <name>
```

</canonical-block>

`skills@latest` is the pinned spelling everywhere. The pages under `docs/` used to carry their own copy of these commands; those blocks are now deleted rather than corrected, because the site renders the install commands itself.

## The two routes are exclusive

The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice: always say "pick one".

## The repo's own marketplace

`.claude-plugin/marketplace.json` makes the repo its own single-plugin marketplace (`/plugin marketplace add mattpocock/skills`, then `/plugin install mattpocock-skills@mattpocock`). For Claude Code, the official listing supersedes it: users see it in exactly one place, the "Stuck on an old version?" escape hatch in the `claude-code` block, for when the official pin lags. For Copilot and Codex it is the primary route (the `copilot` and `codex` blocks), because neither has an official listing.
