# Claude Skills Library

Personal library of Claude Code skills, plugins, and resources — organized by upstream source.
**560 skills installed** across 9 groups. Full inventory: [catalog/CATALOG.md](catalog/CATALOG.md)

---

## Sources

| # | Origin | Author | URL |
|---|--------|--------|-----|
| 1 | **AgriciDaniel / claude-obsidian** (Karpathy pattern · kepano foundation) | Agrici Daniel | [github.com/AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) |
| 2 | **PM Skills Marketplace** | Paweł Huryn (Product Compass) | [github.com/phuryn/pm-skills](https://github.com/phuryn/pm-skills) |
| 3 | **Cowork Skills (YouTube)** | Brock | "15 Claude Cowork Skills I Can't Live Without" |
| 4 | **Official Anthropic Skills** | Anthropic | [github.com/anthropics/skills](https://github.com/anthropics/skills) |
| 5 | **Knowledge Work Plugins** | Anthropic | [github.com/anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) |
| 6 | **Custom / Personal** | @eniwetok | this repo |
| 7 | **obra/superpowers** | Jesse Vincent | [github.com/obra/superpowers](https://github.com/obra/superpowers) |
| 8 | **ruvnet/ruflo** | ruvnet | [github.com/ruvnet/ruflo](https://github.com/ruvnet/ruflo) |
| 9 | **nexu-io/open-design** | nexu-io | [github.com/nexu-io/open-design](https://github.com/nexu-io/open-design) |

---

## Group 1 — AgriciDaniel / claude-obsidian (Karpathy pattern)

> **Upstream:** [github.com/AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian)
> Karpathy's LLM wiki concept — compile knowledge once into interconnected markdown. Built on [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills).
> **Bundle:** [zips/claude-obsidian-skills.zip](zips/claude-obsidian-skills.zip) · Install: `claude plugin marketplace add AgriciDaniel/claude-obsidian`

| Skill | Description | Installed |
|-------|-------------|-----------|
| [wiki](skills/wiki/) | Core orchestrator — scaffolds vault, routes to sub-skills | ✅ |
| [wiki-ingest](skills/wiki-ingest/) | Read a source, extract entities/concepts, create/update pages | ✅ |
| [wiki-query](skills/wiki-query/) | Answer questions from vault; files good answers back | ✅ |
| [wiki-lint](skills/wiki-lint/) | Health check — orphans, dead links, frontmatter gaps | ✅ |
| [wiki-fold](skills/wiki-fold/) | Roll up log entries into extractive meta-pages (DragonScale) | ✅ |
| [save](skills/save/) | Save conversation/insight as a structured wiki note | ✅ |
| [canvas](skills/canvas/) | Visual layer — Obsidian canvas files with auto-positioning | ✅ |
| [autoresearch](skills/autoresearch/) | Autonomous research loop → files findings into wiki | ✅ |
| [obsidian-markdown](skills/obsidian-markdown/) | Reference for Obsidian Flavored Markdown syntax | ✅ |
| [obsidian-bases](skills/obsidian-bases/) | Create/edit .base files — dynamic tables, card views, filters | ✅ |
| [defuddle](skills/defuddle/) | Strip web page clutter before ingesting (saves 40-60% tokens) | ✅ |
| [think](skills/think/) | 10-principle reasoning loop: OBSERVE·LISTEN·THINK·CONNECT·FEEL·ACCEPT·CREATE·GROW | ✅ |
| [wiki-cli](skills/wiki-cli/) | Default vault-mutation transport (Obsidian CLI v1.12+); called by wiki internals | ✅ |
| [wiki-mode](skills/wiki-mode/) | Switch vault organizational methodology: LYT / PARA / Zettelkasten / Generic | ✅ |
| [wiki-retrieve](skills/wiki-retrieve/) | Hybrid retrieval primitive — replaces static hot→index→drill with contextual routing | ✅ |

✅ = active in `~/.claude/skills/`

---

## Group 2 — PM Skills Marketplace

> **Upstream:** [github.com/phuryn/pm-skills](https://github.com/phuryn/pm-skills) · Paweł Huryn · [productcompass.pm](https://www.productcompass.pm)
> 68 PM skills and 42 chained workflows across 9 plugins. Companion: [pm-brain](https://github.com/phuryn/pm-brain).
> **Package:** [packages/pm-skills-main/](packages/pm-skills-main/) · [zips/pm-skills-bundle.zip](zips/pm-skills-bundle.zip)
> Install: `claude plugin marketplace add phuryn/pm-skills`

| Plugin | Skills | Description | Installed |
|--------|--------|-------------|-----------|
| pm-product-discovery | 13 | Ideation, experiments, assumption testing, interview synthesis | ✅ |
| pm-product-strategy | 12 | Vision, lean canvas, SWOT, PESTLE, Ansoff, Porter's Five Forces | ✅ |
| pm-execution | 16 | PRDs, user stories, OKRs, sprint plans, roadmaps, retros | ✅ |
| pm-market-research | 7 | Competitor analysis, user personas, market sizing, sentiment | ✅ |
| pm-go-to-market | 6 | GTM strategy, ICP, competitive battlecard, growth loops | ✅ |
| pm-marketing-growth | 5 | North star metric, positioning, value props, product naming | ✅ |
| pm-data-analytics | 3 | A/B test analysis, cohort analysis, SQL query generation | ✅ |
| pm-toolkit | 4 | NDA drafting, privacy policy, grammar check, resume review | ✅ |
| pm-ai-shipping | 2 | Ship-check, security/perf audit for AI-built code | ✅ |

📦 = in package, not yet installed as plugin

---

## Group 3 — Cowork Skills (Brock / YouTube)

> **Source:** Brock's YouTube — *"15 Claude Cowork Skills I Can't Live Without"*
> **Package:** [packages/15-cowork-skills/](packages/15-cowork-skills/) · [zips/cowork-skills-bundle.zip](zips/cowork-skills-bundle.zip)
> Install: Cowork → Plugin icon → Upload zip

| Skill | Description |
|-------|-------------|
| Slide Deck Builder | Generate structured slide decks |
| Budget Dashboard | Create and track budgets |
| Email Drafter | Draft professional emails |
| Receipt Scanner | Extract data from receipts |
| Explainer Graphic | Generate explainer visuals |
| Visual Page Builder | Build visual web pages |
| Invoice Generator | Generate invoices |
| Contract Reviewer | Review and summarize contracts |
| Workflow Visualizer | Visualize process flows |
| Morning Briefing | Daily briefing summary |
| Quick Research | Fast single-topic research |
| Animated Website | Generate animated web pages |
| Learning Path Generator | Build personalized learning paths |
| Customize | Customize Claude's behavior |
| Difficult Conversation Prep | Prep for hard conversations |

---

## Group 4 — Official Anthropic Skills

> **Upstream:** [github.com/anthropics/skills](https://github.com/anthropics/skills)
> **Package:** [packages/anthropics-skills/](packages/anthropics-skills/)
> Install: `claude plugin marketplace add anthropics/skills`
> All 17 skills ✅ installed in `~/.claude/skills/`

| Skill | Description | Installed |
|-------|-------------|-----------|
| docx | Create/read/edit Word docs — tracked changes, comments, TOC, letterheads | ✅ |
| pdf | Read/extract/merge/split/OCR PDFs, fill forms, add watermarks | ✅ |
| pptx | Create/edit PowerPoint — layouts, templates, charts, speaker notes | ✅ |
| xlsx | Create/edit Excel — formulas, formatting, data analysis, CSV cleaning | ✅ |
| algorithmic-art | Generative art with p5.js, seeded randomness, flow fields, particle systems | ✅ |
| canvas-design | Visual art in .png/.pdf using design philosophy; outputs posters and static designs | ✅ |
| slack-gif-creator | Animated GIFs optimized for Slack size/color constraints with validation | ✅ |
| frontend-design | Distinctive, non-templated UI design for React/Tailwind — avoids AI-slop aesthetics | ✅ |
| web-artifacts-builder | Complex multi-component claude.ai HTML artifacts with React, Tailwind, shadcn/ui | ✅ |
| mcp-builder | Guide for building high-quality MCP servers in Python (FastMCP) or Node/TypeScript | ✅ |
| webapp-testing | Test local web apps with Playwright — UI behavior, screenshots, browser logs | ✅ |
| brand-guidelines | Apply Anthropic's official brand colors and typography to any artifact | ✅ |
| internal-comms | Write status reports, leadership updates, newsletters, FAQs, incident reports | ✅ |
| skill-creator | Create, edit, evaluate, and benchmark skills; includes variance analysis evals | ✅ |
| claude-api | Claude API reference — model IDs, pricing, streaming, tool use, MCP, caching | ✅ |
| doc-coauthoring | Structured co-authoring workflow — context gathering, refinement, reader testing | ✅ |
| theme-factory | Apply one of 10 preset themes (colors + fonts) to slides, docs, or HTML pages | ✅ |

---

## Group 5 — Knowledge Work Plugins (Anthropic)

> **Upstream:** [github.com/anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
> **Package:** [packages/knowledge-work-plugins/](packages/knowledge-work-plugins/)
> Install: `claude plugin marketplace add anthropics/knowledge-work-plugins`
> **127 skills across 17 plugins** — all ✅ installed. Full per-skill breakdown in [catalog/CATALOG.md](catalog/CATALOG.md).

| Plugin | Skills | Key capabilities | Installed |
|--------|--------|-----------------|-----------|
| engineering | 10 | code-review, debug, architecture, system-design, incident-response, tech-debt | ✅ |
| sales | 9 | account-research, call-prep, pipeline-review, forecast, draft-outreach, competitive-intelligence | ✅ |
| marketing | 8 | campaign-plan, seo-audit, email-sequence, brand-review, performance-report | ✅ |
| finance | 8 | financial-statements, reconciliation, variance-analysis, journal-entry, sox-testing | ✅ |
| legal | 9 | review-contract, triage-nda, compliance-check, legal-risk-assessment, signature-request | ✅ |
| human-resources | 9 | interview-prep, draft-offer, performance-review, comp-analysis, org-planning | ✅ |
| data | 10 | analyze, sql-queries, build-dashboard, statistical-analysis, explore-data, create-viz | ✅ |
| design | 7 | design-critique, accessibility-review, user-research, ux-copy, design-handoff | ✅ |
| bio-research | 6 | nextflow-development, scvi-tools, single-cell-rna-qc, instrument-data-to-allotrope | ✅ |
| operations | 9 | process-doc, risk-assessment, capacity-plan, runbook, compliance-tracking | ✅ |
| customer-support | 5 | ticket-triage, draft-response, kb-article, customer-escalation | ✅ |
| productivity | 5 | memory-management, task-management, update | ✅ |
| product-management | 8 | write-spec, sprint-planning, metrics-review, stakeholder-update, roadmap-update | ✅ |
| small-business | 31 | close-month, monday-brief, plan-payroll, quarterly-review, crm-cleanup, run-campaign | ✅ |
| enterprise-search | 5 | search, knowledge-synthesis, digest, source-management | ✅ |
| cowork-plugin-management | 2 | cowork-plugin-customizer, create-cowork-plugin | ✅ |
| pdf-viewer | 1 | view-pdf | ✅ |

---

## Group 7 — obra/superpowers

> **Upstream:** [github.com/obra/superpowers](https://github.com/obra/superpowers) · Jesse Vincent
> Engineering discipline skills — TDD, systematic debugging, parallel agents, git worktrees, code review, and verification. Designed to be invoked before acting, not after.
> **Package:** [packages/superpowers/](packages/superpowers/)
> Install: `cp -r packages/superpowers/skills/* ~/.claude/skills/`

| Skill | What it does | When to use |
|-------|-------------|-------------|
| [using-superpowers](packages/superpowers/skills/using-superpowers/) | Meta-skill — establishes how to find and invoke skills at conversation start | Start of any session |
| [brainstorming](packages/superpowers/skills/brainstorming/) | Explore user intent, requirements, and design before implementation | Before any feature/component work |
| [writing-plans](packages/superpowers/skills/writing-plans/) | Write a multi-step implementation plan from a spec or requirements | Before touching code |
| [executing-plans](packages/superpowers/skills/executing-plans/) | Execute a written plan in a separate session with review checkpoints | When you have a plan ready |
| [test-driven-development](packages/superpowers/skills/test-driven-development/) | Write failing tests before writing implementation code | Before any feature or bugfix |
| [systematic-debugging](packages/superpowers/skills/systematic-debugging/) | Structured diagnosis before proposing fixes | On any bug, test failure, or unexpected behavior |
| [verification-before-completion](packages/superpowers/skills/verification-before-completion/) | Run verification commands and confirm output before claiming work is done | Before committing or opening a PR |
| [requesting-code-review](packages/superpowers/skills/requesting-code-review/) | Verify work meets requirements before merging | After completing a feature |
| [receiving-code-review](packages/superpowers/skills/receiving-code-review/) | Process review feedback with rigor — verify before blindly implementing | When review feedback arrives |
| [using-git-worktrees](packages/superpowers/skills/using-git-worktrees/) | Set up isolated workspace via git worktree before feature work | Before starting isolated work |
| [dispatching-parallel-agents](packages/superpowers/skills/dispatching-parallel-agents/) | Fan out 2+ independent tasks to parallel agents | When tasks have no shared state |
| [subagent-driven-development](packages/superpowers/skills/subagent-driven-development/) | Execute implementation plans with independent tasks in current session | When running a plan with parallelizable steps |
| [finishing-a-development-branch](packages/superpowers/skills/finishing-a-development-branch/) | Decide how to integrate completed work — merge, PR, or cleanup | When implementation is done and tests pass |
| [writing-skills](packages/superpowers/skills/writing-skills/) | Create, edit, and verify skills before deployment | When building new skills |

All 14 skills ✅ installed in `~/.claude/skills/`

---

## Group 6 — Custom / Personal

> Skills built or adapted for this specific setup.

| Skill | Description | Trigger | Installed |
|-------|-------------|---------|-----------|
| [pm-agent](skills/pm-agent/) | Multi-product PM agent — orchestrates pm-skills, writes weekly reports across a portfolio | `/pm-agent`, `weekly PM run` | ✅ |
| pptx-from-template | Brand-faithful PowerPoint builder — edit from template, never regenerate from scratch | `from my template`, `match our deck` | ✅ local |
| update-skills-library | Sync this repo from all upstream sources, rebuild zips, push | `update skills library` | ✅ local |

*`pptx-from-template` and `update-skills-library` live in `~/.claude/skills/` locally but are not tracked in this repo's `skills/` folder.*

---

## Group 8 — ruvnet/ruflo (Multi-agent swarm)

> **Upstream:** [github.com/ruvnet/ruflo](https://github.com/ruvnet/ruflo)
> SPARC multi-agent coordination framework — 134 agent skills for swarm orchestration, distributed systems, GitHub automation, performance analysis, and neural coordination.
> **Package:** [packages/ruflo/](packages/ruflo/)
> Install: `cp -r packages/ruflo/.agents/skills/* ~/.claude/skills/`

| Category | Skills | What it covers |
|----------|--------|----------------|
| Agent orchestration | 90 | agent-*, coordinator, swarm, queen, worker, mesh, hive-mind |
| AgentDB | 5 | agentdb-advanced, agentdb-learning, agentdb-memory-patterns, agentdb-optimization, agentdb-vector-search |
| GitHub automation | 6 | github-automation, github-code-review, github-multi-repo, github-project-management, github-release-management, github-workflow-automation |
| SPARC methodology | 1 | sparc-methodology |
| Flow/Swarm | 9 | flow-nexus-*, swarm-advanced, swarm-orchestration, stream-chain, hive-mind, hive-mind-advanced |
| Other | 23 | security-audit, performance-analysis, embeddings, neural-training, pair-programming, etc. |

All 134 skills ✅ installed in `~/.claude/skills/`

---

## Group 9 — nexu-io/open-design (Design + templates)

> **Upstream:** [github.com/nexu-io/open-design](https://github.com/nexu-io/open-design)
> Massive design system — 155 design skills (FAL AI, Figma, GSAP, Venice, shadcn, frontend frameworks) + 109 HTML presentation templates in the zhangzara/orbit/taste series.
> **Package:** [packages/open-design/](packages/open-design/)
> Install: `cp -r packages/open-design/skills/* ~/.claude/skills/ && cp -r packages/open-design/design-templates/* ~/.claude/skills/`

| Category | Skills | What it covers |
|----------|--------|----------------|
| FAL AI | 12 | fal-generate, fal-image-edit, fal-upscale, fal-video-edit, fal-tryon, fal-3d, fal-realtime, fal-restore, fal-train, fal-kling-o3, fal-lip-sync, fal-vision |
| Figma | 7 | figma-use, figma-generate-design, figma-create-new-file, figma-generate-library, figma-implement-design, figma-code-connect-components, figma-create-design-system-rules |
| GSAP animation | 8 | gsap-core, gsap-react, gsap-scrolltrigger, gsap-plugins, gsap-timeline, gsap-utils, gsap-frameworks, gsap-performance |
| Venice AI | 5 | venice-image-generate, venice-image-edit, venice-audio-music, venice-audio-speech, venice-video |
| Frontend | 7 | frontend-design, frontend-dev, frontend-skill, frontend-slides, shadcn-ui, threejs, shader-dev |
| Presentation templates | 50+ | html-ppt-zhangzara-* series (30+ themes), orbit-*, html-ppt-pitch-deck, replit-deck, kami-deck, etc. |
| Design tools | 70+ | brandkit, design-brief, d3-visualization, remotion, imagegen, pptx-generator, social cards, etc. |

All 264 skills ✅ installed in `~/.claude/skills/`

---

## Quick Install Reference

```bash
# All groups from marketplace (preferred)
claude plugin marketplace add AgriciDaniel/claude-obsidian    # Group 1: 15 wiki skills
claude plugin marketplace add phuryn/pm-skills                 # Group 2: 68 PM skills
claude plugin marketplace add anthropics/skills                # Group 4: 17 official skills
claude plugin marketplace add anthropics/knowledge-work-plugins # Group 5: 127 skills

# Group 3 (15-cowork-skills): manual only
# Cowork → Plugin icon → Upload zips/cowork-skills-bundle.zip

# Group 6 (custom skills)
cp -r skills/pm-agent ~/.claude/skills/

# Single skill from source
cp -r skills/<name> ~/.claude/skills/
```

---

## Repository Structure

```
claude-skills-library/
├── README.md                     ← this file
├── CLAUDE.md                     ← repo conventions and maintenance guide
├── catalog/
│   ├── CATALOG.md                ← full inventory with install status
│   └── awesome-claude-skills.md  ← community curated index (travisvn)
├── skills/                       ← individual skills (Groups 1 & 6)
│   ├── wiki/                     ← G1: claude-obsidian core
│   ├── wiki-ingest/              ← G1
│   ├── wiki-query/               ← G1
│   ├── wiki-lint/                ← G1
│   ├── wiki-fold/                ← G1
│   ├── save/                     ← G1
│   ├── canvas/                   ← G1
│   ├── autoresearch/             ← G1
│   ├── obsidian-markdown/        ← G1
│   ├── obsidian-bases/           ← G1
│   ├── defuddle/                 ← G1
│   ├── think/                    ← G1 (not yet installed)
│   ├── wiki-cli/                 ← G1 (not yet installed)
│   ├── wiki-mode/                ← G1 (not yet installed)
│   ├── wiki-retrieve/            ← G1 (not yet installed)
│   └── pm-agent/                 ← G6: custom
├── packages/                     ← multi-skill bundles
│   ├── pm-skills-main/           ← G2: phuryn/pm-skills
│   ├── 15-cowork-skills/         ← G3: Brock/YouTube
│   ├── anthropics-skills/        ← G4: anthropics/skills
│   └── knowledge-work-plugins/   ← G5: anthropics/knowledge-work-plugins
└── zips/                         ← installable archives
    ├── claude-obsidian-skills.zip ← G1 bundle (11 core skills)
    ├── pm-skills-bundle.zip       ← G2 bundle
    ├── pm-skills-main.zip         ← G2 original
    ├── cowork-skills-bundle.zip   ← G3 bundle
    ├── 15-cowork-skills.zip       ← G3 original
    └── *.zip                      ← individual skill zips (G1)
```
