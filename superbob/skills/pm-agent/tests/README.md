# pm-agent tests

Test suite for the pm-agent skill. Two layers:

| Layer | What it tests | How |
|---|---|---|
| **Test cases** (`cases.md`) | Structural / mechanical correctness — files exist, frontmatter valid, links resolve, dry-run discipline held, sections present | bash assertions + grep |
| **Agentic evals** (`evals.md`) | Semantic quality — TL;DR matches body, themes clustered well, risks are specific, output is useful to a PM | Claude as LLM judge |

Plus a **gold dataset** at `pm-wiki/_tests/gold/` — synthetic but realistic-shape inputs.

## Quick start

```bash
~/.claude/skills/pm-agent/tests/run-tests.sh                # full suite
~/.claude/skills/pm-agent/tests/run-tests.sh --cases-only   # skip agentic evals
~/.claude/skills/pm-agent/tests/run-tests.sh --keep-output  # don't restore canonical after
```

## How the runner works

1. **Snapshot** the real `pm-wiki/inputs/` and `pm-wiki/products/cognos-agents/` content to `/tmp/pm-agent-snapshot/`
2. **Stage** the gold dataset into those paths (overlay, not destroy)
3. **Invoke** the pm-agent in dry-run mode for cognos-agents
4. **Run programmatic test cases** against the output (each case is a bash assertion)
5. **Run agentic evals** — for each eval, format the judge prompt with output + expected criteria + invoke a fresh Claude session to render verdict
6. **Restore** the snapshotted content
7. **Report** pass/fail per case and per eval, plus a summary

## Pass / fail thresholds

- **Test cases** — all must pass. Any failure → no schedule yet.
- **Agentic evals** — each scored 1–5. Must average ≥4.0 across all evals. Single-eval minimum: ≥3.

## Test case categories (in cases.md)

```
config-loads           — config file readable, schema valid
context-resolves       — week, period, target product resolved correctly
recipe-parses          — recipe frontmatter + body parseable
template-parses        — template frontmatter + body parseable
input-scanning         — each input source scanned (feedback, decisions, roadmap, releases, OKRs)
empty-inputs-handled   — no fabrication when input empty
skill-composition      — each composing skill invoked with valid input
template-application   — sections substituted into template correctly
health-computation     — health color matches deterministic rules
quality-checks-fire    — every recipe quality check evaluated
output-dry-run         — dry-run output lands at dry-run/ path, canonical untouched
session-logging        — log file created with required frontmatter
link-resolution        — every [..](..) in output resolves to a real file
```

## Eval categories (in evals.md)

```
tldr-accuracy             — does the TL;DR accurately reflect the body?
theme-clustering-quality  — are clusters from analyze-feature-requests coherent?
sentiment-coherence       — are sentiment scores supported by their quotes?
risk-specificity          — are risks specific to the input data, not generic?
roadmap-diff-correctness  — does the diff actually capture the state change?
health-rule-application   — does health match the rules given the inputs?
reproducibility           — do two runs on the same input produce near-identical output?
overall-pm-usefulness     — would a PM find this report useful?
```

## Failure mode → diagnosis cheat sheet

| Failure | Most likely cause |
|---|---|
| `config-loads` fails | YAML syntax in `pm-wiki/_scripts/pm-agent-config.yaml`. Validate with `python3 -c "import yaml; yaml.safe_load(open('…'))"` |
| `input-scanning` fails | Helper script path or feedback-river-slice.sh logic bug |
| `skill-composition` fails | A pm-skills plugin missing or the skill name mismatches what's installed |
| `health-computation` fails | Rules in template don't match what the agent computes — either rule prose or implementation drifted |
| `link-resolution` fails | Agent inserted a `[..](path)` that doesn't exist — usually a sign of fabrication |
| `tldr-accuracy` eval fails | TL;DR was composed first instead of last, or skipped composing-from-body |
| `risk-specificity` eval fails | Pre-mortem skill got generic input, producing generic output |
| `reproducibility` eval fails | LLM nondeterminism too high — tighten the recipe's composition prompts |

## Adding new tests

When a new failure mode is discovered in production:
1. Add a case to `cases.md` (structural) or an eval to `evals.md` (semantic)
2. If it requires new gold input, add to `pm-wiki/_tests/gold/inputs/`
3. Update the expected assertions in `pm-wiki/_tests/gold/expected/expected.md`
4. Re-run `run-tests.sh` — the new test must fail without the fix, pass with it (red→green TDD)
