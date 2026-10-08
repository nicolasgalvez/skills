# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

## The rule: managed installs first

Lead with installs that **update themselves**: the user installs once, and later releases arrive with no action from them. Only where an agent has no such route do we fall back to skills.sh, which never updates on its own.

Every managed route below installs the same plugin through this repo's own marketplace (`.claude-plugin/marketplace.json` + `.claude-plugin/plugin.json`). Claude Code, Codex, Copilot and VS Code all read those two files, so the install is curated to the promoted set with no extra manifest.

A managed install picks up a new copy only when `.claude-plugin/plugin.json`'s `version` changes. `npm run version` (run by the Release workflow's changesets step) copies `package.json`'s version into it via `scripts/sync-plugin-version.mjs`, so users get each release when the "chore: version skills" PR merges, not on every commit to `main`.

Never promise "instant" updates, and never call a route managed unless the agent updates it with no user command. Where an agent needs a one-time opt-in to update itself, the block says so next to the install command.

| Agent         | Route                            | Updates itself?                                                        |
| ------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Claude Code   | `@mattpocock` marketplace        | Yes, at startup, after a one-time "Enable auto-update" toggle          |
| Codex         | `@mattpocock` marketplace        | Yes, at every startup; on by default                                   |
| Copilot CLI   | `@mattpocock` marketplace        | Yes, at session start, after a one-time `autoUpdate: true` in settings |
| VS Code       | Chat: Install Plugin From Source | Yes, daily; on by default (follows `extensions.autoUpdate`)            |
| Gemini CLI    | `gemini skills install` (copies) | **No**. A self-updating extension needs a flat `skills/<name>/` layout |
| Everyone else | skills.sh                        | **No**. `npx skills update` by hand; re-run `add` to get new skills    |

Sources, checked 2026-10-08: Claude Code [host-marketplace](https://code.claude.com/docs/en/plugins/host-marketplace#turn-on-auto-update); Codex `codex-rs/core-plugins/src/manager.rs` (background marketplace auto-upgrade, reinstalls on a `version` change); Copilot [cli-config-dir-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) (`extraKnownMarketplaces`, `autoUpdate`); VS Code `pluginMarketplaceService.ts` and `pluginAutoUpdate.ts`; Gemini `skillLoader.ts` (only globs `*/SKILL.md`).

Left out until someone runs them against this repo: Auggie (its marketplaces need `.augment-plugin/marketplace.json`), Droid (may find no skills under nested paths), Qwen and Goose (no documented command for this repo's layout). Their users take skills.sh.

## Claude Code

<canonical-block name="claude-code">

```bash
claude plugin marketplace add mattpocock/skills
claude plugin install mattpocock-skills@mattpocock
```

Then turn on auto-update, once: in a session, open `/plugin` → **Marketplaces** → `mattpocock` → **Enable auto-update**. Claude Code leaves it off for marketplaces outside Anthropic's; without it you update by hand with `claude plugin update mattpocock-skills@mattpocock`.

**Installed it from Anthropic's official marketplace?** (`claude plugin list` shows `@claude-plugins-official`.) That copy also updates itself, but only when Anthropic moves its pin, which can lag this repo by weeks. To switch, run `claude plugin uninstall mattpocock-skills@claude-plugins-official`, then the commands above.

</canonical-block>

The official listing (`claude plugins install mattpocock-skills`, no marketplace to add) is no longer the lead route. It pins this repo to a commit `sha` that Anthropic moves by hand, so its users trail releases (see ADR 0002's 2026-08-05 and 2026-10-08 updates). It appears only in the "Installed it from…" escape hatch.

## Codex

<canonical-block name="codex">

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

Codex updates it at every startup, with nothing to turn on.

</canonical-block>

## GitHub Copilot (CLI and VS Code)

Skip `copilot plugin install mattpocock/skills`: Copilot warns that direct repo installs are deprecated, and only marketplace installs can opt into auto-update. The `extraKnownMarketplaces` entry follows the documented schema (a required `source`, plus `autoUpdate`), but the opt-in itself has not been run.

<canonical-block name="copilot">

```bash
copilot plugin marketplace add mattpocock/skills
copilot plugin install mattpocock-skills@mattpocock
```

Then turn on auto-update, once, in `~/.copilot/settings.json`. Copilot only auto-updates its built-in marketplace unless you opt in:

```json
{
  "extraKnownMarketplaces": {
    "mattpocock": {
      "source": { "source": "github", "repo": "mattpocock/skills" },
      "autoUpdate": true
    }
  }
}
```

In VS Code, run **Chat: Install Plugin From Source** and enter `https://github.com/mattpocock/skills`. VS Code checks for updates daily, as long as extension auto-update is on (the default).

</canonical-block>

## Gemini CLI: copies, not managed

Gemini does not read `.claude-plugin`. A self-updating Gemini extension (`gemini extensions install --auto-update`) needs `skills/<name>/SKILL.md` at depth one, which the bucketed layout doesn't have, so the only working route is a copy. `--path` takes one bucket folder, so two commands install exactly the promoted set (verified 2026-10-07: 27 skills, nothing from the other buckets).

<canonical-block name="gemini">

```bash
gemini skills install https://github.com/mattpocock/skills.git --path skills/engineering
gemini skills install https://github.com/mattpocock/skills.git --path skills/productivity
```

These are copies, so they don't update themselves. Re-run both commands to pick up changes and new skills.

</canonical-block>

## Every other agent: skills.sh

Everywhere else, [skills.sh](https://skills.sh/mattpocock/skills) copies editable skill files into the project. `-a` preselects the agent; every flag below was run on 2026-10-07. Prefer it over an agent's own repo-level installer (`amp skill add`, `pi install git:…`): those scan `skills/` recursively and pull in `misc/` and `in-progress/`.

`npx skills update` re-fetches only the skills already in the user's lock file. It never runs in the background, and it doesn't pick up skills added to this repo since the user's `add`. The block has to say both.

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

**These don't update themselves.** Run `npx skills@latest update` to pull my changes to the skills you have. To get skills I've added since, run the `add` command again.

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
