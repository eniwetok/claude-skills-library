# pm-agent

Product-agnostic, multi-product PM agent. Defined in [`SKILL.md`](SKILL.md).

## What this is

A Claude Code skill that, when invoked, runs PM operations across a list of products defined in a YAML config. For each product, it reads the product wiki + feedback-river slice, invokes the pm-skills marketplace via report-kit recipes, and writes PM outputs (status reports, decisions, roadmap updates, feedback rollups) to a unified `pm-wiki/`.

One agent, N products. Adding a product is a config-file edit.

## Install / setup

This skill is already installed at `~/.claude/skills/pm-agent/`. It requires:

1. **pm-skills marketplace installed** — `claude plugin list` should show 8 `pm-*@pm-skills` plugins
2. **pm-wiki/ scaffolded** — at the workspace root, with `methods/report-kits/` populated with recipes and `methods/templates/` populated with at least the weekly-product-status template
3. **Config file present** — at `pm-wiki/_scripts/pm-agent-config.yaml` (see `scripts/default-config.yaml` for the schema)

## Invoking the agent

| To… | Say |
|---|---|
| Run the standard weekly cycle | `/pm-agent` or "run pm agent" |
| Run for one product | `/pm-agent for cognos-agents` |
| Run one specific recipe across all products | "run report-kit weekly-product-status" |
| Dry-run (write to `_claude-log/dry-run/` instead of canonical paths) | `/pm-agent --dry-run` |
| Catch up missed weeks | `/pm-agent catch-up since 2026-05-11` |

## Scheduling

Use the `/schedule` skill to set this up to run weekly. See the "Schedule PM agent" task and `~/.claude/skills/schedule/SKILL.md`.

## Architecture (per the monorepo)

The agent is the **Agent Layer** in the three-loop architecture documented in `pm-wiki/meta/applies-karpathy.md`:

```
PATTERN LOOP        Karpathy LLM-wiki + librarian-caretaker (slow)
METHODOLOGY LOOP    pm-skills + Reforge methodologies (medium)
CONTENT LOOP        pm-wiki + product wikis (fast)
                          ▲
                          │
                    [PM AGENT — this skill — bridges the three]
```

The agent reads PATTERN, follows METHODOLOGY recipes, writes CONTENT.

## What this skill does NOT do

- Email/Slack triage (separate `inbox-triage` agent, planned)
- Cross-vault dedup or routing (separate `librarian` agent, planned)
- Wiki content health (separate per-wiki `caretaker` agents, planned)
- Skill or agent self-improvement (separate `skill-caretaker` / `agent-caretaker`, planned)

## Logging

Every invocation appends an entry to `pm-wiki/_claude-log/<date>_<time>_pm-agent-<context>.md`. Read the most-recent entry to understand what the last run did.
