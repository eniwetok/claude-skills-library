---
title: pm-agent — structural test cases
type: meta
tags: [tests, cases, pm-agent]
summary: 46 structural test cases organized by category. Each marked runnable (🟢) / blocked-on-gold (🟡) / blocked-on-agent-feature (🟣). Suite covers every composing skill, every report section, every health-rule branch, every path-type in the report, all 4 secondary recipes, and multi-product loop.
gold_default: pm-wiki/_tests/gold/inputs/
gold_green: pm-wiki/_tests/gold/inputs-green/
gold_red: pm-wiki/_tests/gold/inputs-red/
gold_shared: pm-wiki/_tests/gold/shared/
expected_default: pm-wiki/_tests/gold/expected/expected.md
expected_green: pm-wiki/_tests/gold/expected/expected-green.md
expected_red: pm-wiki/_tests/gold/expected/expected-red.md
runnable_count: 35
blocked_on_gold_count: 8
blocked_on_agent_feature_count: 3
last_updated: 2026-05-26
---

# pm-agent — structural test cases

## Legend

- 🟢 **Runnable today** — gold data is in place
- 🟡 **Blocked on gold expansion** — needs a specific input we don't have yet
- 🟣 **Blocked on agent feature** — needs an agent capability not yet built (e.g., catch-up mode, regenerate-false handling)

## Coverage matrix

| Category | Cases | Covers |
|---|---|---|
| A. Foundation | 10 (FOUND-01..10) | config + context + recipe/template parsing + per-input-source scanning |
| B. Edge cases | 3 (EDGE-01..03) | empty / partial-empty / malformed inputs |
| C. Skill composition | 6 (SKILL-01..06) | each composing skill in weekly-product-status recipe |
| D. Section content | 9 (SECT-01..09) | each section of the report template, content-level |
| E. Health rule branches | 3 (HEALTH-01..03) | green / yellow / red triggers |
| F. Path resolution | 5 (PATH-01..05) | each output path type (roadmap, decision, feedback, release, OKR) |
| G. Cross-recipe | 4 (RECIPE-01..04) | the 4 non-primary recipes |
| H. Output discipline | 3 (OUT-01..03) | dry-run path, backup-and-overwrite, regenerate-false |
| I. Session logging | 2 (LOG-01..02) | log frontmatter, skill-list match |
| J. Multi-product | 1 (MULTI-01) | multi-product loop |

---

## A. Foundation

### FOUND-01 — config-loads 🟢
**Covers:** YAML parses + cognos-agents listed and active.
**Setup:** `pm-wiki/_scripts/pm-agent-config.yaml` present.
**Pass:** `python3 -c "import yaml; cfg=yaml.safe_load(open('…')); assert any(p['slug']=='cognos-agents' and p['active'] for p in cfg['products'])"` exits 0.
**Fail:** YAML syntax error OR missing keys.

### FOUND-02 — config-schema-valid 🟢
**Covers:** All required config keys present with correct types.
**Pass:** Config has `workspace_root: <str>`, `pm_wiki: <str>`, `products: <list>`, `defaults: <dict>`, `notifications: <dict>`, `output: <dict>`. Each product has `slug`, `display_name`, `active`, `wiki_read`, `pm_write`, `cadence`, `discovery_mode`, `report_kits`.
**Fail:** Missing top-level key OR product missing required field.

### FOUND-03 — context-resolves-week 🟢
**Covers:** Week helper returns correct ISO week.
**Pass:** `week.py current` returns `2026-W22` on 2026-05-26.
**Fail:** Wrong week OR helper path mismatch.

### FOUND-04 — context-resolves-period 🟢
**Covers:** Period helper returns Mon→Sun for given week.
**Pass:** `week.py period 2026-W22` returns `2026-05-25 2026-05-31`.
**Fail:** Wrong dates.

### FOUND-05 — context-cadence-helpers 🟢
**Covers:** is-monday, is-friday, is-quarter-end-week helpers run.
**Pass:** Each returns true|false (boolean string).
**Fail:** Returns empty OR error.

### FOUND-06 — recipe-parses 🟢
**Covers:** weekly-product-status recipe loads.
**Pass:** Frontmatter has `composes_skills`, `output_location`, `cadence`, `template`. `composes_skills` is non-empty list.
**Fail:** Frontmatter malformed OR keys missing.

### FOUND-07 — template-parses 🟢
**Covers:** Template loads and has all 9 sections.
**Pass:** Headers found: TL;DR, Roadmap progress, Decisions, New signal, Release status, Risks & blockers, Next week focus, OKR progress, Appendix.
**Fail:** Missing section.

### FOUND-08 — input-scanning-feedback-river 🟢
**Covers:** Slice helper filters by product + period.
**Setup:** Default gold staged (yellow scenario).
**Pass:** `feedback-river-slice.sh <ws> cognos-agents 2026-05-25 2026-05-31 | wc -l` is 6.
**Fail:** Wrong count → grep filter bug OR product_tags pattern issue.

### FOUND-09 — input-scanning-roadmap-decisions 🟢
**Covers:** Roadmap + decisions + releases + OKRs directories are scanned.
**Setup:** Default gold staged.
**Pass:** decisions ≥1, roadmap ≥2, releases/2026.2 ≥1, okrs ≥1.
**Fail:** Wrong count.

### FOUND-10 — input-scanning-prior-week 🟡 *(blocked: gold/shared/prior-status/2026-W21.md not in default gold)*
**Covers:** Agent reads prior week's status report for diff-mode operations.
**Setup:** Copy `gold/shared/prior-status/2026-W21.md` to `products/cognos-agents/status/2026-W21.md` before run.
**Pass:** Output references prior-week state for at least the Roadmap section.
**Fail:** Output ignores prior-week file or claims "first week of tracking" when prior is staged.

---

## B. Edge cases

### EDGE-01 — empty-inputs-no-fabrication 🟢
**Covers:** Agent doesn't invent data when every input source is empty.
**Setup:** Restore canonical (or use a fresh empty pm-wiki).
**Pass:** Output contains "no data" markers in feedback/decisions/roadmap/releases sections; `draft: true`; zero fabricated customer names / quotes / features.
**Fail:** Agent fabricated.

### EDGE-02 — partial-inputs-no-fabrication 🟡 *(blocked: gold partial subset)*
**Covers:** Agent handles mixed populated/empty correctly.
**Setup:** Stage only feedback-river (no roadmap, no decisions, no release).
**Pass:** "New signal" section populated; other sections have "no data" markers; no cross-fabrication.
**Fail:** Agent fabricates roadmap items by extrapolating from feedback.

### EDGE-03 — malformed-input-handling 🟡 *(blocked: gold/malformed/ subset)*
**Covers:** Agent skips entries with broken frontmatter and logs the skip.
**Setup:** Stage a feedback entry with malformed YAML.
**Pass:** Session log records "skipped: <path> — malformed frontmatter"; output proceeds without that entry.
**Fail:** Agent crashes OR includes the bad entry.

---

## C. Skill composition (one per skill in weekly-product-status recipe)

### SKILL-01 — outcome-roadmap-invoked 🟢
**Covers:** `pm-execution.outcome-roadmap` (diff mode) was called.
**Pass:** Session log lists `pm-execution.outcome-roadmap`; output Roadmap-progress section shows state-change table with both gold items.
**Fail:** Skill not invoked OR section "no data" when roadmap exists.

### SKILL-02 — analyze-feature-requests-invoked 🟢
**Covers:** `pm-product-discovery.analyze-feature-requests` was called.
**Pass:** Session log lists the skill; output "New signal" section has ≥3 coherent clusters from the 6 gold feedback entries.
**Fail:** Skill not invoked OR clusters garbled / missing dominant patterns.

### SKILL-03 — sentiment-analysis-invoked 🟢
**Covers:** `pm-market-research.sentiment-analysis` was called.
**Pass:** Each cluster in "New signal" has a sentiment value + supporting quote.
**Fail:** Sentiments missing OR not supported.

### SKILL-04 — identify-assumptions-existing-invoked 🟡 *(blocked: ideas/ folder + idea entries not yet in gold)*
**Covers:** `pm-product-discovery.identify-assumptions-existing` exercised against an idea in `validating` state.
**Setup:** Add an `ideas/<slug>.md` in `validating` state to gold.
**Pass:** Output Risks section includes assumption-test risks tied to that idea.
**Fail:** Section silent on assumptions.

### SKILL-05 — pre-mortem-invoked 🟢
**Covers:** `pm-execution.pre-mortem` (lightweight) was called.
**Pass:** Risks section has ≥3 risks; each has severity, likelihood, owner; tied to release plan or roadmap.
**Fail:** Risks section empty OR all generic.

### SKILL-06 — summarize-meeting-invoked 🟡 *(blocked: gold/shared/transcripts/ not in default scenario)*
**Covers:** `pm-execution.summarize-meeting` exercised against a raw transcript.
**Setup:** Stage `gold/shared/transcripts/<file>.md` into `inputs/customer-calls/`.
**Pass:** Output "New signal" references the meeting + key decisions extracted; session log invokes the skill.
**Fail:** Skill not invoked OR meeting content not surfaced.

---

## D. Section content (per-section assertions)

### SECT-01 — tldr-bullet-count-and-quality 🟢
**Covers:** TL;DR has 3-5 verb-led bullets.
**Pass:** Count `^- ` lines under `## TL;DR` is 3-5; each starts with a verb (heuristic: not "The…" / "A…" / "An…").
**Fail:** Wrong count OR generic bullets.

### SECT-02 — tldr-bullets-trace-to-body 🟢
**Covers:** Each TL;DR bullet has supporting content in a body section.
**Pass:** For each TL;DR keyword (e.g., "Globe", "Copilot", "NPS", "2026.2", "KR3"), the keyword appears in at least one body section.
**Fail:** TL;DR mentions something not in body.

### SECT-03 — roadmap-section-populated 🟢
**Covers:** Roadmap progress section has table with both gold items.
**Pass:** Section contains "reduce-time-to-first-report" and "improve-auth-reliability" as table rows.
**Fail:** Missing item OR "no data" when items exist.

### SECT-04 — decisions-section-populated 🟢
**Covers:** Decisions section lists the gold decision with date.
**Pass:** Section contains "Defer Power BI deep-link" + date "2026-05-26".
**Fail:** Missing.

### SECT-05 — new-signal-themes-have-quote 🟢
**Covers:** Every theme in "New signal" has at least one quote with citation back to inputs/feedback-river/.
**Pass:** For each `### <theme>` header, the body has `*"…"*` followed by a `[…](…/feedback-river/…)` link.
**Fail:** Theme without quote OR quote without citation.

### SECT-06 — release-status-at-risk 🟢
**Covers:** Release status section flags 2026.2 as at-risk with specific blocker.
**Pass:** Section contains "at-risk" + reference to either "auth implementation" OR "QA coverage".
**Fail:** Generic readiness OR missing.

### SECT-07 — risks-have-owners 🟢
**Covers:** Every risk in Risks & blockers section has a named mitigation owner.
**Pass:** Each table row has 4 cells (risk + severity + likelihood + owner/mitigation).
**Fail:** Missing owner column.

### SECT-08 — next-week-focus-specific 🟢
**Covers:** Next week focus bullets reference gold-specific topics (PBI/Copilot/auth/onboarding/pricing) — not generic.
**Pass:** ≥3 bullets explicitly mention gold-relevant topics.
**Fail:** Bullets are generic PM tasks ("review roadmap", "talk to customers").

### SECT-09 — okr-section-flags-kr3 🟢
**Covers:** OKR section is included AND flags KR3 deterioration.
**Pass:** Section contains "KR3" + word indicating concern ("behind", "deteriorating", "at-risk", "⚠️", "missing").
**Fail:** Section missing OR KR3 not surfaced.

---

## E. Health rule branches

### HEALTH-01 — green-triggers 🟡 *(blocked: green scenario gold)*
**Covers:** Health = green when all rules clean.
**Setup:** Stage `inputs-green/` scenario.
**Pass:** Frontmatter `health: green`; no `health_note` override needed.
**Fail:** Yellow or red emitted despite clean state.

### HEALTH-02 — yellow-triggers 🟢
**Covers:** Health = yellow when at-risk release + medium risks present.
**Setup:** Default gold staged.
**Pass:** Frontmatter `health: yellow`; `health_note` references the rule.
**Fail:** Green or red.

### HEALTH-03 — red-triggers 🟡 *(blocked: red scenario gold)*
**Covers:** Health = red when P1 release blocker present OR decision-debt >14 days OR high open risk with no mitigation.
**Setup:** Stage `inputs-red/` scenario.
**Pass:** Frontmatter `health: red`; `health_note` references the specific rule fired.
**Fail:** Yellow.

---

## F. Path resolution (per output path type)

### PATH-01 — roadmap-link-resolves 🟢
**Covers:** Roadmap-item links in output resolve to real files.
**Pass:** Every `[..](path)` with `roadmap/` in path resolves relative to output dir.
**Fail:** Broken path.

### PATH-02 — decision-link-resolves 🟢
**Covers:** Decision links resolve.
**Pass:** Every link with `decisions/` resolves.
**Fail:** Broken.

### PATH-03 — feedback-river-link-resolves 🟢
**Covers:** Feedback-river quote citations resolve.
**Pass:** Every `[..](…/feedback-river/…)` link resolves.
**Fail:** Broken.

### PATH-04 — release-plan-link-resolves 🟢
**Covers:** Release plan link resolves.
**Pass:** Link to `releases/<release>/plan.md` resolves.
**Fail:** Broken.

### PATH-05 — okr-link-resolves 🟡 *(blocked: agent currently doesn't link to OKR file from status report — would need template update)*
**Covers:** OKR section references the canonical OKR file.
**Setup:** Update template to require an `okrs/<quarter>.md` link.
**Pass:** OKR section has `[..](okrs/2026-Q2.md)` resolving.
**Fail:** No link OR broken.

---

## G. Cross-recipe coverage

### RECIPE-01 — customer-feedback-rollup-standalone 🟢
**Covers:** customer-feedback-rollup recipe runs as standalone (not embedded).
**Setup:** Invoke `/run report-kit customer-feedback-rollup`.
**Pass:** Output at `products/<product>/feedback/<week>-rollup.md`; themes match weekly-status section 3.
**Fail:** Output missing OR diverges materially from embedded version.

### RECIPE-02 — competitive-update-runs 🟡 *(blocked: gold portfolio inputs/competitive/ not yet populated)*
**Covers:** competitive-update recipe runs at portfolio level.
**Setup:** Stage portfolio-level competitive entries; invoke on Friday cadence.
**Pass:** Output at `portfolio/competitive/<week>.md`; references Five Forces deltas + per-product impact.
**Fail:** Output missing OR not portfolio-scoped.

### RECIPE-03 — release-readiness-runs 🟡 *(blocked: gold needs release approaching T-7)*
**Covers:** release-readiness recipe runs at a checkpoint.
**Setup:** Stage a release plan with `target_ship_date` 7 days out.
**Pass:** Output at `releases/<release>/readiness-<date>.md`; pre-mortem + test coverage + stakeholder readiness sections.
**Fail:** Output missing.

### RECIPE-04 — quarterly-okr-review-runs 🟣 *(blocked: requires last-week-of-quarter to trigger by default — workaround: explicit recipe invocation)*
**Covers:** quarterly-okr-review runs when triggered explicitly.
**Setup:** Invoke `/run report-kit quarterly-okr-review for cognos-agents`.
**Pass:** Output at `products/cognos-agents/okrs/2026-Q2-review.md`; pace assessment + retro + next-quarter draft.
**Fail:** Output missing.

---

## H. Output discipline

### OUT-01 — dry-run-discipline 🟢
**Covers:** Dry-run writes to `_claude-log/dry-run/`, canonical untouched.
**Pass:** Output at dry-run path; canonical `products/cognos-agents/status/<week>.md` byte-identical to pre-run (MD5 match).
**Fail:** Canonical modified.

### OUT-02 — backup-on-canonical-overwrite 🟣 *(blocked: agent currently doesn't implement backup-and-overwrite — would need code change)*
**Covers:** Non-dry-run overwriting a canonical file creates a `.bak` first.
**Setup:** Run non-dry with prior status file present.
**Pass:** Both new file and `<file>.<timestamp>.bak` exist after.
**Fail:** Prior overwritten without backup.

### OUT-03 — regenerate-false-respected 🟣 *(blocked: agent currently overwrites unconditionally — would need code change)*
**Covers:** Existing file with `regenerate: false` frontmatter is skipped.
**Setup:** Add `regenerate: false` to an existing status file.
**Pass:** Session log shows "skipped: regenerate=false"; file unchanged.
**Fail:** Agent overwrote.

---

## I. Session logging

### LOG-01 — frontmatter-complete 🟢
**Covers:** Session log has all required frontmatter keys.
**Pass:** Log frontmatter contains: session_start, session_end, mode, products_processed, recipes_run, outputs_written, quality_failures, errors.
**Fail:** Missing key.

### LOG-02 — skill-list-matches-invocations 🟢
**Covers:** Skills listed in log frontmatter match skills actually referenced in the output's appendix.
**Pass:** `skills_invoked` in log ⊇ skills referenced in output Appendix-execution-trace section.
**Fail:** Log undercount OR claims skill that didn't appear in output trace.

---

## J. Multi-product

### MULTI-01 — multi-product-loop 🟢
**Covers:** Agent iterates over multiple `active: true` products in config.
**Setup:** Default config has 7 active products.
**Pass:** Session log shows `products_processed:` length ≥ 2 when no `--product` filter is passed.
**Fail:** Agent only processes one product when no filter set.

---

## Suite execution

```bash
# Cases A-J that require default gold (yellow scenario):
#   stage default gold → invoke pm-agent → run cases → restore

# Cases requiring green scenario:
#   stage gold/inputs-green/ → invoke pm-agent → run HEALTH-01 → restore

# Cases requiring red scenario:
#   stage gold/inputs-red/ → invoke pm-agent → run HEALTH-03 → restore

# Cases requiring shared assets:
#   merge gold/shared/* with the scenario being run
```

## Pass criteria for the suite

- **All 🟢 cases must pass.** No exceptions.
- **🟡 cases pass when their gold expansion is added.** Until then they document the gap.
- **🟣 cases pass when the agent feature is implemented.** Until then they document the gap.

When all 35 🟢 cases pass on all 3 scenarios → ready for Gate 5 (schedule).
