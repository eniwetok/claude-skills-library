---
title: pm-agent — agentic evals (semantic quality)
type: meta
tags: [tests, evals, agentic, pm-agent]
summary: 8 agentic evals — LLM judges output quality dimensions that structural tests can't catch. Each eval has a judge prompt, scoring rubric, pass threshold, and how-to-invoke.
gold_inputs: pm-wiki/_tests/gold/inputs/
expected: pm-wiki/_tests/gold/expected/expected.md
target_output: pm-wiki/_claude-log/dry-run/2026-W22-cognos-agents-status.md
last_updated: 2026-05-26
---

# pm-agent — agentic evals

8 LLM-judge evals covering semantic quality dimensions that structural tests can't catch. Each eval:
- Takes the agent's output + the gold inputs + the expected criteria
- Renders a 1–5 score with a brief explanation
- Passes if score ≥ 4 (single-eval minimum: 3)
- Suite passes if avg ≥ 4.0 across all 8

**How to run any eval:** open a fresh Claude Code session and paste the judge prompt with the output + gold context. Capture the score + explanation. Append to `pm-wiki/_claude-log/dry-run/eval-results-<date>.md`.

---

## Eval 1 — tldr-accuracy

**Dimension:** Does the TL;DR accurately summarize the body?

**Judge prompt:**
> You are an impartial QA reviewer for a PM weekly status report. Read the TL;DR section, then read the body sections (Roadmap progress, Decisions, New signal, Release status, Risks & blockers, Next week focus, OKR progress). Score on a 1–5 scale: does each TL;DR bullet correspond to substantive content in the body? Are there any TL;DR claims unsupported by the body? Are there any major body findings missing from the TL;DR?
>
> Output: `score: X/5` + 2-3 sentence justification + list any specific bullets that are unsupported.

**Pass: ≥ 4**

---

## Eval 2 — theme-clustering-quality

**Dimension:** Are themes in the "New signal" section coherent and non-overlapping?

**Judge prompt:**
> Given the 6 feedback-river entries in the gold dataset (read them at `pm-wiki/_tests/gold/inputs/feedback-river/`) and the "New signal" section of the agent's output, evaluate the themes. Score 1–5:
> - 5: themes are coherent, non-overlapping, capture the dominant patterns (pricing, competitive, onboarding, reliability, integration); minor themes don't pollute the top
> - 3: themes are reasonable but one is mis-labeled OR two themes overlap meaningfully
> - 1: themes are garbled, missing obvious patterns, or invented patterns not in the data
>
> Output: `score: X/5` + list each theme + your verdict on each (coherent / overlapping / mislabeled / missing).

**Pass: ≥ 4**

---

## Eval 3 — sentiment-coherence

**Dimension:** Are sentiment scores supported by the quoted evidence?

**Judge prompt:**
> For each theme in the "New signal" section that has a sentiment score, check whether the quoted evidence (and any inline quotes pulled from the gold feedback) actually supports that score. Score 1–5:
> - 5: every sentiment matches the tone of its supporting quotes
> - 3: most match, 1-2 mismatches
> - 1: many sentiment scores contradict their quotes (e.g., "positive" when quotes are negative)
>
> Output: `score: X/5` + list each theme with verdict (matches / mismatch — why).

**Pass: ≥ 4**

---

## Eval 4 — risk-specificity

**Dimension:** Are risks in the "Risks & blockers" section specific to the gold context, not generic?

**Judge prompt:**
> Read the "Risks & blockers" section of the agent's output. For each risk:
> - Is it tied to a specific input from the gold dataset (auth bug, Copilot competitive move, KR3 deterioration, release slip, pricing-model gap)?
> - Does it have a named mitigation OR action OR owner?
> - Is it free of generic phrasing ("project might have issues", "watch carefully")?
>
> Score 1–5: 5 if every risk is specific AND owned; 3 if some are generic; 1 if all are generic boilerplate.
>
> Output: `score: X/5` + per-risk verdict.

**Pass: ≥ 4**

---

## Eval 5 — roadmap-diff-correctness

**Dimension:** Does the "Roadmap progress" section correctly reflect the state of the gold roadmap items?

**Judge prompt:**
> Compare the agent's "Roadmap progress" section to the gold roadmap items at `pm-wiki/_tests/gold/inputs/products/cognos-agents/roadmap/`. Verify:
> - Both items mentioned (`reduce-time-to-first-report` validating; `improve-auth-reliability` committed-to-roadmap)
> - Current state correct
> - Since this is week 1, no diff is expected; output should note "first week of tracking" or equivalent
> - No invented roadmap items
>
> Score 1–5: 5 if exact, 3 if one item is wrong/missing, 1 if both are wrong or fabricated items present.
>
> Output: `score: X/5` + verdict per roadmap item.

**Pass: ≥ 4**

---

## Eval 6 — health-rule-application

**Dimension:** Is the computed health color justified by the rules + the gold scenario?

**Judge prompt:**
> The deterministic health-color rules are at `pm-wiki/methods/templates/weekly-product-status-template.md`. The gold scenario has:
> - 2026.2 release at-risk (auth implementation + QA coverage)
> - 2 medium open risks
> - KR3 (conversion intent) behind and deteriorating
> - Globe Corp loss (deal lost to Copilot)
> - 0 P1 release-blockers (auth bug is roadmap-targeted, not blocking ship)
>
> What's the correct health color per the rules? What did the agent output? Are they consistent?
> Score 1–5: 5 if matches expectation (yellow most likely, red defensible); 3 if defensible but odd; 1 if green (which would be wrong).
>
> Output: `score: X/5` + the agent's health value + your reasoning.

**Pass: ≥ 4**

---

## Eval 7 — reproducibility

**Dimension:** Do two runs on identical inputs produce near-identical output?

**Setup:** Run the agent twice on the same gold dataset.

**Judge prompt:**
> Compare run 1 output to run 2 output. Both ran on identical gold inputs. Evaluate:
> - Frontmatter identical (week, period, paths)
> - Section structure identical (same section headers)
> - Counts identical (N decisions listed, N themes, N risks)
> - Synthesis text similar in substance (paraphrasing OK; new facts NOT OK)
> - Health color identical (deterministic — required)
>
> Score 1–5: 5 if substance identical and only paraphrasing varies; 3 if one or two facts differ; 1 if structure or counts differ.
>
> Output: `score: X/5` + list any divergences with severity.

**Pass: ≥ 4**

---

## Eval 8 — overall-pm-usefulness

**Dimension:** Would a real PM find this report useful enough to keep automated?

**Judge prompt:**
> You are a senior product manager reading this weekly status report on a Monday morning. Score the report 1–5 on **usefulness**:
> - 5: I'd skim this in 60 seconds and walk away with the 3 most important things this week; saves me time vs. writing it myself
> - 4: useful but I'd edit 1-2 sections before sharing with stakeholders
> - 3: roughly right structure but I'd rewrite half of it
> - 2: I'd ignore most of it and rewrite from scratch
> - 1: actively misleading — I'd unsubscribe
>
> Output: `score: X/5` + the 1 thing the report did best + the 1 thing that most needs improvement.

**Pass: ≥ 4**

---

## Aggregate

Each eval scores 1–5. Suite passes when:
- Average score ≥ **4.0**
- No single eval below **3**
- Reproducibility eval (eval 7) ≥ **4** (deterministic outputs are non-negotiable)

If aggregate fails, the corrective action is upstream (recipe, template, or skill — not the agent itself). Iterate, re-run, re-eval.

## Logging eval results

Append outcomes to `pm-wiki/_claude-log/dry-run/eval-results-<date>.md`:

```yaml
---
title: pm-agent eval run — <date>
type: claude-log
tags: [claude-log, pm-agent, evals]
target_output: <path>
gold_dataset: pm-wiki/_tests/gold/
total_evals: 8
passing: <n>
failing: <n>
average_score: <x.x>
verdict: pass | fail
---

| Eval | Score | Verdict | Notes |
|---|---|---|---|
| tldr-accuracy | x/5 | pass/fail | … |
| theme-clustering-quality | x/5 | pass/fail | … |
| sentiment-coherence | x/5 | pass/fail | … |
| risk-specificity | x/5 | pass/fail | … |
| roadmap-diff-correctness | x/5 | pass/fail | … |
| health-rule-application | x/5 | pass/fail | … |
| reproducibility | x/5 | pass/fail | … |
| overall-pm-usefulness | x/5 | pass/fail | … |
```
