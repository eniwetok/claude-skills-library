---
name: pm-agent
description: "Product-agnostic, multi-product PM agent. For each product in config, reads the product wiki + feedback-river slice tagged with that product, invokes report-kit recipes (composing pm-skills plugins), and writes per-product PM outputs (status reports, decisions, roadmap updates, feedback rollups) to pm-wiki. Run weekly on Monday for status reports, or on-demand for any recipe. Triggers on: /pm-agent, run pm agent, weekly PM run, produce PM reports, produce status report for <product>, pm agent weekly, run report-kit, generate weekly status."
---

# pm-agent: Multi-product PM agent

A product-agnostic agent that runs PM operations across an entire product portfolio. **One agent, N products.** Adding a product = adding a config entry, no new agent.

The agent's value is in *composition*: it doesn't reimplement PM methodology — it invokes the pm-skills marketplace via report-kit recipes and assembles the outputs into the pm-wiki at the right paths.

## When this skill triggers

- `/pm-agent` — explicit invocation
- "run pm agent" / "weekly PM run" / "produce PM reports"
- "produce status report for <product>" — runs the weekly-product-status recipe for one product
- "run report-kit <recipe-name>" — runs a specific recipe across all active products
- Scheduled invocation (when `/schedule` is wired up for this skill)

## Configuration

Config file: **`pm-wiki/_scripts/pm-agent-config.yaml`** (relative to the workspace root).

If not found, fall back to `~/.claude/skills/pm-agent/scripts/default-config.yaml` and emit a yellow warning that the project config is missing.

Config schema:

```yaml
workspace_root: /Users/felipecampo/Library/CloudStorage/OneDrive-IBM/ibm_github
pm_wiki: pm-wiki                         # relative to workspace_root
recipes_dir: pm-wiki/methods/report-kits
templates_dir: pm-wiki/methods/templates

products:
  - slug: cognos-agents                  # used as folder name and product_tag
    display_name: Cognos Reporting Agents
    active: true                         # skip if false
    wiki_read:                           # one or more paths to read product knowledge from
      - cognos-wiki/topics/reporting-agents
    pm_write: pm-wiki/products/cognos-agents
    cadence: weekly                      # weekly | biweekly | monthly | quarterly
    discovery_mode: new                  # "existing" or "new" — Torres distinction; routes which pm-product-discovery skills get used
    report_kits:                         # which recipes apply to this product
      - weekly-product-status
      - customer-feedback-rollup
    current_quarter: 2026-Q2             # set manually; used for OKR cadence
    okr_review_due: false                # set true at end of quarter
```

## High-level workflow

When triggered, follow this sequence:

1. **Read config** — `pm-wiki/_scripts/pm-agent-config.yaml`. Fall back to default if missing.
2. **Determine target products** — if the trigger mentioned a specific product, just that one; otherwise all `active: true` products.
3. **Determine target recipes** — if the trigger mentioned a specific recipe, just that one (across selected products); otherwise apply each product's `report_kits` list filtered by cadence-due (see "Cadence rules" below).
4. **For each (product, recipe) pair** — execute the recipe (see "Recipe execution" below). Track results.
5. **Compose final summary** — what got produced, what was skipped, what errored.
6. **Append session log** — `pm-wiki/_claude-log/YYYY-MM-DD_HHMM_pm-agent-<context>.md`.
7. **Notify** — if any output landed at health: red, push a notification.

## Cadence rules (which recipes run when)

| Recipe | When it runs |
|---|---|
| `weekly-product-status` | Every Monday for products with `cadence: weekly` |
| `customer-feedback-rollup` | Every Monday; embedded in weekly-product-status section 3 (the agent reuses the output, doesn't run twice) |
| `competitive-update` | Every Friday at portfolio level (not per-product) |
| `release-readiness` | Only on-demand, or when a release plan has a checkpoint due (T-14, T-7, T-1) |
| `quarterly-okr-review` | Last week of quarter (W13, W26, W39, W52) per product that has `okr_review_due: true` |

If today doesn't match a recipe's cadence trigger, **skip** it (unless explicit "/run report-kit" override).

## Recipe execution (the core loop, per product+recipe)

For each (product, recipe) pair:

### Step 1 — Read the recipe
Open `pm-wiki/methods/report-kits/<recipe>.md`. Parse the frontmatter (`composes_skills`, `output_location`, `cadence`, `template`) and the body (the per-section composition instructions).

### Step 2 — Read inputs the recipe specifies
For the target product and current week (or release, quarter, etc.):
- Product knowledge base (`wiki_read` from config)
- Prior output (if any — e.g., last week's status report)
- Feedback-river slice — `pm-wiki/inputs/feedback-river/*.md` filtered by `product_tags ∋ <product-slug>` and `valid_from` in period
- Decisions in period — `pm-wiki/products/<product>/decisions/*.md`
- Roadmap state — `pm-wiki/products/<product>/roadmap/*.md`
- Releases — `pm-wiki/products/<product>/releases/*.md`
- OKRs — `pm-wiki/products/<product>/okrs/<quarter>.md`

If a required input is empty (e.g., no feedback this week, no releases planned), emit a "no data" entry for that section — do NOT fabricate.

### Step 3 — Invoke composing skills in recipe order
For each section in the recipe's composition:
- If the section specifies a skill (e.g., `pm-execution.outcome-roadmap`), invoke that skill with the section's inputs.
- If the section is "direct listing" (no skill), do it directly.
- Capture each skill's output. Feed forward to next sections when the recipe says so.

### Step 4 — Apply template
Load `pm-wiki/methods/templates/<template>.md` (referenced by the recipe). Substitute composed outputs into template sections. Populate frontmatter per the template's contract.

### Step 5 — Run quality checks
Each recipe lists quality checks. Run them. If any fail, mark the output `draft: true` in frontmatter and surface the failures in the session log.

### Step 6 — Write output
Path: as specified by recipe's `output_location` with `{product}` and `{week}`/`{quarter}`/`{date}` substituted.

If the file already exists:
- If `regenerate: false` is set in frontmatter → skip, log "already exists, not regenerating"
- Otherwise → overwrite, but keep the old version as `<file>.<timestamp>.bak`

### Step 7 — Health computation (for weekly status)
Apply the deterministic health-color rules from the weekly template. Set `health:` in frontmatter. If you (human or the agent itself) want to override, write the override-reason to `health_note:`.

## Per-product output paths

| Output | Path pattern |
|---|---|
| Weekly status report | `pm-wiki/products/<product>/status/<week>.md` |
| Feedback rollup | `pm-wiki/products/<product>/feedback/<week>-rollup.md` |
| Competitive update (portfolio) | `pm-wiki/portfolio/competitive/<week>.md` |
| Release readiness | `pm-wiki/products/<product>/releases/<release>/readiness-<date>.md` |
| OKR review | `pm-wiki/products/<product>/okrs/<quarter>-review.md` |
| Decisions surfaced | `pm-wiki/products/<product>/decisions/<date>-<slug>.md` |
| New needs surfaced | `pm-wiki/needs/<slug>.md` |
| New ideas surfaced | `pm-wiki/ideas/<slug>.md` |

## Per-session logging

After each invocation, append a log entry to `pm-wiki/_claude-log/<date>_<time>_pm-agent-<context>.md`:

```markdown
---
title: pm-agent run — <context>
type: claude-log
tags: [claude-log, pm-agent]
session_start: <iso>
session_end: <iso>
duration_seconds: <n>
products_processed: [<slug>, ...]
recipes_run: [<recipe>, ...]
outputs_written: [<path>, ...]
outputs_skipped: [{path: ..., reason: ...}, ...]
quality_failures: [{path: ..., check: ..., detail: ...}, ...]
notifications_sent: <n>
errors: [...]
---

# pm-agent run — <context>

## Summary
...

## Per product
...

## What's open
...
```

## Quality checks (cross-recipe)

Before declaring an invocation successful:

- Every output has valid YAML frontmatter
- Every `[...](...)` link in outputs resolves to a real file (cross-checked)
- Every output's `last_updated:` is today
- No section is empty AND missing a "no data" marker (silent empty = bug)
- Health colors match the deterministic rules
- Feedback rollups have minimum-N source citations per theme

## Error handling

- **Skill invocation fails** → log the error, mark that section as "ERROR — skill <name> failed", continue with next sections (don't fail-fast for one section)
- **Required input missing** (e.g., no feedback at all when river is supposed to be hot) → emit yellow warning in output `health_note:` and log
- **Quality check fails** → set `draft: true`, surface in log, push notification
- **Recipe file missing** → fail-fast for that recipe but continue with other recipes
- **Config malformed** → fail-fast for the whole run, log the parse error

## Modes

| Mode | How invoked | Behavior |
|---|---|---|
| **scheduled-weekly** (default) | `/pm-agent` on Monday, or via `/schedule` | All active products, cadence-due recipes, write outputs |
| **on-demand single product** | `/pm-agent for cognos-agents` | One product, all cadence-due recipes |
| **on-demand single recipe** | `/run report-kit weekly-product-status` | All active products, one recipe |
| **dry-run** | `/pm-agent --dry-run` | Same as scheduled-weekly but write to `pm-wiki/_claude-log/dry-run/` instead of canonical paths |
| **catch-up** | `/pm-agent catch-up since <date>` | Backfill missed weekly runs from `<date>` to today |

## Out of scope for v1

- **Inbox triage** (email/Slack ingestion) — a separate agent (inbox-triage agent, planned). PM agent assumes `feedback-river/` is populated by that agent or hand-seeded.
- **Cross-product synthesis** beyond what `competitive-update` covers — that's the Librarian's job (separate agent, planned).
- **Meta-caretaking** (proposing changes to pm-skills or to the agent itself) — separate skill caretaker / agent caretaker (planned).

## Where things live (cheat sheet)

| Thing | Path |
|---|---|
| This skill | `~/.claude/skills/pm-agent/SKILL.md` |
| Config | `pm-wiki/_scripts/pm-agent-config.yaml` |
| Recipes | `pm-wiki/methods/report-kits/<recipe>.md` |
| Templates | `pm-wiki/methods/templates/<template>.md` |
| Inputs (read) | `pm-wiki/inputs/feedback-river/`, `inputs/<channel>/` |
| Per-product writes | `pm-wiki/products/<product>/{status,decisions,roadmap,feedback,releases,okrs}/` |
| Portfolio writes | `pm-wiki/portfolio/{strategy,okrs,prioritization,competitive}/` |
| Session logs | `pm-wiki/_claude-log/<date>_<time>_pm-agent-<context>.md` |
| Schedule (when set up) | via `/schedule` skill — points at `/pm-agent` |
