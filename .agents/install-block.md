# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

## The rule: managed installs first

Lead with installs that **update themselves**; fall back to skills.sh, labelled "manual updates", only where an agent has none. Call a route managed only if it updates with no user command, put any one-time opt-in beside its install command, and never promise "instant".

Every managed route installs the plugin from this repo's own marketplace (`.claude-plugin/marketplace.json` + `plugin.json`). It reinstalls only when `plugin.json`'s `version` changes, which `npm run version` (Release workflow) syncs from `package.json`: users get a release when the "chore: version skills" PR merges.

| Agent         | Route                            | Updates itself?                                       |
| ------------- | -------------------------------- | ----------------------------------------------------- |
| Claude Code   | `@mattpocock` marketplace        | Yes, after a one-time "Enable auto-update" toggle     |
| Codex         | `@mattpocock` marketplace        | Yes, at startup, by default                           |
| Copilot CLI   | `@mattpocock` marketplace        | Yes, after a one-time `autoUpdate: true`              |
| VS Code       | Chat: Install Plugin From Source | Yes, daily, by default                                |
| Gemini CLI    | `gemini skills install` (copies) | No: an extension needs a flat `skills/<name>/` layout |
| Everyone else | skills.sh                        | No: `npx skills update`; re-run `add` for new skills  |

Sources (2026-10-08): Claude Code [host-marketplace](https://code.claude.com/docs/en/plugins/host-marketplace#turn-on-auto-update); Codex `core-plugins/src/manager.rs`; Copilot [cli-config-dir-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference); VS Code `pluginAutoUpdate.ts`; Gemini `skillLoader.ts`.

Unverified against this repo, so skills.sh until someone runs them: Auggie, Droid, Qwen, Goose.

## Claude Code

The official listing (`@claude-plugins-official`) pins a `sha` Anthropic moves by hand, so it appears only in the switch-over line (ADR 0002).

<canonical-block name="claude-code">

```bash
claude plugin marketplace add mattpocock/skills
claude plugin install mattpocock-skills@mattpocock
```

Then, once: `/plugin` → **Marketplaces** → `mattpocock` → **Enable auto-update**. On `@claude-plugins-official` (it lags)? Run `claude plugin uninstall mattpocock-skills@claude-plugins-official` first.

</canonical-block>

## Codex

<canonical-block name="codex">

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

Updates itself at startup.

</canonical-block>

## GitHub Copilot (CLI and VS Code)

Use the marketplace, not `copilot plugin install mattpocock/skills`: direct repo installs are deprecated and can't auto-update. The `extraKnownMarketplaces` entry follows the documented schema but is unexercised.

<canonical-block name="copilot">

```bash
copilot plugin marketplace add mattpocock/skills
copilot plugin install mattpocock-skills@mattpocock
```

Then, once, add to `~/.copilot/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "mattpocock": { "source": { "source": "github", "repo": "mattpocock/skills" }, "autoUpdate": true }
  }
}
```

VS Code: **Chat: Install Plugin From Source** → `https://github.com/mattpocock/skills` (updates daily).

</canonical-block>

## Gemini CLI

Gemini doesn't read `.claude-plugin`, and `--path` takes one bucket, so two copies install exactly the promoted set (27 skills, verified 2026-10-07).

<canonical-block name="gemini">

```bash
gemini skills install https://github.com/mattpocock/skills.git --path skills/engineering
gemini skills install https://github.com/mattpocock/skills.git --path skills/productivity
```

Re-run to update.

</canonical-block>

## Every other agent, or editable files: skills.sh

`-a` preselects the agent (each run 2026-10-07). Prefer it to an agent's own repo installer (`amp skill add`, `pi install git:…`), which pulls in `misc/` and `in-progress/`. `npx skills update` skips skills added since `add`, so the block says to re-run `add`.

<canonical-block name="other-agents">

```bash
npx skills@latest add mattpocock/skills -a <agent>  # cursor, opencode, devin, windsurf, amp, pi; omit -a to choose
```

Pick `setup-matt-pocock-skills` among the skills. Manual updates: `npx skills@latest update`; re-run `add` for new skills.

</canonical-block>

Use the single-skill form wherever one skill is named on its own. **`docs/` pages are not a consumer of this block**: ai-hero renders the install widget above the body. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

```bash
npx skills@latest update <name>
```

</canonical-block>

`skills@latest` is the pinned spelling everywhere.

## The two routes are exclusive

The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice: always say "pick one".
