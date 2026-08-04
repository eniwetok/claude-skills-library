# Claude Skills Library

Personal library of Claude Code skills, plugins, and resources — organized by upstream source.
**954 skills installed** across 21 groups (+ code-review-graph MCP + rtk output compressor). MCP servers: code-review-graph (codebase intelligence). Full inventory: [catalog/CATALOG.md](catalog/CATALOG.md)

---

## Sources

| # | Origin | Author | URL |
|---|--------|--------|-----|
| 1 | **AgriciDaniel / claude-obsidian** (Karpathy pattern · kepano foundation) | Agrici Daniel | [github.com/AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) |
| 2 | **PM Skills Marketplace** (v2.1.0) | Paweł Huryn (Product Compass) | [github.com/phuryn/pm-skills](https://github.com/phuryn/pm-skills) |
| 3 | **Cowork Skills (YouTube)** | Brock | "15 Claude Cowork Skills I Can't Live Without" |
| 4 | **Official Anthropic Skills** | Anthropic | [github.com/anthropics/skills](https://github.com/anthropics/skills) |
| 5 | **Knowledge Work Plugins** | Anthropic | [github.com/anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) |
| 6 | **Custom / Personal** | @eniwetok | this repo |
| 7 | **obra/superpowers** | Jesse Vincent | [github.com/obra/superpowers](https://github.com/obra/superpowers) |
| 8 | **ruvnet/ruflo** | ruvnet | [github.com/ruvnet/ruflo](https://github.com/ruvnet/ruflo) |
| 9 | **nexu-io/open-design** | nexu-io | [github.com/nexu-io/open-design](https://github.com/nexu-io/open-design) |
| 10 | **affaan-m/ECC** (Everything Claude Code) | affaan-m | [github.com/affaan-m/ECC](https://github.com/affaan-m/ECC) |
| 11 | **zhangzhang-111-i/claude-skills** | zhangzhang-111-i | [github.com/zhangzhang-111-i/claude-skills](https://github.com/zhangzhang-111-i/claude-skills) |
| 12 | **n8n-io/skills** | n8n-io | [github.com/n8n-io/skills](https://github.com/n8n-io/skills) |
| 13 | **team-attention/agent-council** | team-attention | [github.com/team-attention/agent-council](https://github.com/team-attention/agent-council) |
| 14 | **pablo-mano/Obsidian-CLI-skill** | pablo-mano | [github.com/pablo-mano/Obsidian-CLI-skill](https://github.com/pablo-mano/Obsidian-CLI-skill) |
| 15 | **multica-ai/andrej-karpathy-skills** | multica-ai | [github.com/multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) |
| 16 | **tirth8205/code-review-graph** (MCP · code intelligence, not skills) | tirth8205 | [github.com/tirth8205/code-review-graph](https://github.com/tirth8205/code-review-graph) |
| 17 | **elementalsouls/Claude-BugHunter** | elementalsouls | [github.com/elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) |
| 18 | **ibelick/ui-skills** (Skills for Design Engineers) | ibelick | [github.com/ibelick/ui-skills](https://github.com/ibelick/ui-skills) |
| 19 | **hamelsmu/evals-skills** (LLM eval methodology) | Hamel Husain | [github.com/hamelsmu/evals-skills](https://github.com/hamelsmu/evals-skills) |
| 20 | **dietrichgebert/ponytail** ("lazy senior engineer") | Dietrich Gebert | [github.com/dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) |
| 21 | **BehiSecc/VibeSec** (proactive secure coding) | BehiSecc | [github.com/BehiSecc/VibeSec-Skill](https://github.com/BehiSecc/VibeSec-Skill) |
| 22 | **petergyang/no-ai-slop** (sharper, more human writing) | Peter Yang | [github.com/petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) |

---

## Group 1 — AgriciDaniel / claude-obsidian (Karpathy pattern)

> **⚠️ Not bundled in SuperBob.** These Obsidian / personal-wiki skills are kept here for reference only — the SuperBob distributable **excludes** them so it never touches your own Obsidian setup. Install them yourself if you want them.
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
> **Latest upstream release: v2.1.0** (2026-07-03) — hardened the two pm-ai-shipping audit skills (security + performance checks for AI-built code); no new skills or plugins added.
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
| [cowork-package](skills/cowork-package/) | Package skills into Cowork-ready zips — one skill per zip, verified | `install X into cowork`, `package for cowork` | ✅ |
| [mission-control](skills/mission-control/) | **Master orchestrator** — classifies task type, routes to the right skills in order, resolves all overlap conflicts across G1–G17 | `start working on`, `which skill`, `new session` | ✅ |
| [pm-agent](skills/pm-agent/) | Multi-product PM agent — orchestrates pm-skills, writes weekly reports across a portfolio | `/pm-agent`, `weekly PM run` | ✅ |
| [skill-library-lint](skills/skill-library-lint/) | Integrity gate for the mode library — fails if any mode or the router points at a missing skill, or a mode pulls in a vendor/crypto dependency | `lint the skill library`, `did I break a mode`, `check the modes` | ✅ |
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

## Group 10 — affaan-m/ECC (277 skills · Everything Claude Code)

> **Upstream:** [github.com/affaan-m/ECC](https://github.com/affaan-m/ECC)
> "The agent harness performance optimization system" — engineering patterns, AI agent frameworks, healthcare, security, homelab, frontend/backend stacks (Django, FastAPI, Laravel, Spring, React, Flutter, etc.), agentic loops, cost-aware LLM pipelines.
> **Package:** [packages/affaan-ecc/](packages/affaan-ecc/)
> Install: `cp -r packages/affaan-ecc/skills/* ~/.claude/skills/`

Key categories: `agentic-engineering`, `ai-first-engineering`, `autonomous-agent-harness`, `eval-harness`, `benchmark`, cost-tracking, django/laravel/spring/react/flutter patterns, healthcare (HIPAA, CDSS), security, kubernetes, homelab.

All 277 skills ✅ installed.

---

## Group 11 — zhangzhang-111-i/claude-skills (180+ skills · Enterprise roles)

> **Upstream:** [github.com/zhangzhang-111-i/claude-skills](https://github.com/zhangzhang-111-i/claude-skills)
> Production-ready role-based skills for enterprise teams — C-suite advisors (CEO/CFO/CTO/CMO/CISO/CPO), engineering teams, marketing, product, QA/regulatory, project management.
> **Package:** [packages/zhangzhang-skills/](packages/zhangzhang-skills/)
> Install: (copy category bundles + individual leaf skills from engineering/marketing/product/c-level etc.)

Key skills: `ceo-advisor`, `cto-advisor`, `ciso-advisor`, `senior-architect`, `senior-backend`, `senior-frontend`, `playwright-pro`, `agent-designer`, `agent-workflow-designer`, `mcp-server-builder`, `rag-architect`, `saas-scaffolder`, `scrum-master`, `jira-expert`, `gdpr-dsgvo-expert`, `fda-consultant-specialist`.

All ~180 skills ✅ installed.

---

## Group 12 — n8n-io/skills (14 skills · n8n workflow automation)

> **Upstream:** [github.com/n8n-io/skills](https://github.com/n8n-io/skills)
> Skills for building and debugging n8n workflows — code nodes, expressions, subworkflows, error handling, credentials, MCP extending, loops, data tables.
> **Package:** [packages/n8n-skills/](packages/n8n-skills/)
> Install: `cp -r packages/n8n-skills/skills/* ~/.claude/skills/`

Skills: `n8n-agents`, `n8n-binary-and-data`, `n8n-code-nodes`, `n8n-credentials-and-security`, `n8n-data-tables`, `n8n-debugging`, `n8n-error-handling`, `n8n-expressions`, `n8n-extending-mcp`, `n8n-loops`, `n8n-node-configuration`, `n8n-subworkflows`, `n8n-workflow-lifecycle`, `using-n8n-skills`.

All 14 skills ✅ installed.

---

## Group 13 — team-attention/agent-council (1 skill)

> **Upstream:** [github.com/team-attention/agent-council](https://github.com/team-attention/agent-council)
> Summons multiple AI agents in parallel and synthesizes their answers into a consensus response. Invoke with "summon the council" or "ask other AIs".
> **Package:** [packages/agent-council/](packages/agent-council/)
> Install: `cp -r packages/agent-council/skills/agent-council ~/.claude/skills/`

`agent-council` ✅ installed.

---

## Group 14 — pablo-mano/Obsidian-CLI-skill (1 skill)

> **Upstream:** [github.com/pablo-mano/Obsidian-CLI-skill](https://github.com/pablo-mano/Obsidian-CLI-skill)
> Obsidian CLI integration skill — read and write Obsidian vault notes directly from Claude Code via the Obsidian CLI tool.
> **Package:** [packages/pablo-obsidian/](packages/pablo-obsidian/)
> Install: `cp -r packages/pablo-obsidian/skills/obsidian-cli ~/.claude/skills/`

`obsidian-cli` ✅ installed.

---

## Group 15 — multica-ai/andrej-karpathy-skills (1 skill)

> **Upstream:** [github.com/multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)
> CLAUDE.md-style behavioral guidelines derived from Andrej Karpathy's observations on LLM coding pitfalls — research-first, minimal code, honest uncertainty.
> **Package:** [packages/multica-karpathy/](packages/multica-karpathy/)
> Install: `cp -r packages/multica-karpathy/skills/karpathy-guidelines ~/.claude/skills/`

`karpathy-guidelines` ✅ installed.

---

## Group 16 — code-review-graph (2 skills + MCP server · codebase intelligence)

> **Upstream:** [github.com/tirth8205/code-review-graph](https://github.com/tirth8205/code-review-graph) · 3,062 ⭐
> Enterprise-grade codebase intelligence for 40M+ LOC repos. Hybrid semantic search, polyglot dependency graphs, symbol-level call-flow analysis, cross-project and branch-aware search. 61% fewer tokens, 84% fewer tool calls, 37× faster navigation.
> **MCP:** `npx -y code-review-graph` (added to user config via `claude mcp add`)
> **Package:** [packages/code-review-graph/](packages/code-review-graph/)

| Component | What it does |
|-----------|-------------|
| MCP server | Semantic search, dependency graphs, call-flow, cross-repo search |
| `code-review-graph` (MCP) skill | Guides structured exploration of unfamiliar codebases |
| `codebase-management` skill | Manages codebase health, refactoring, cross-cutting changes |

✅ MCP server added. ✅ 2 skills installed.

---

## Group 17 — Claude-BugHunter (71 skills + 15 commands · security)

> **Upstream:** [github.com/elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) · 2,806 ⭐
> Enterprise security skill bundle — 681 disclosed vulnerability report patterns across 24 vulnerability classes (OWASP, CVE patterns), enterprise identity attack matrices, infrastructure attack matrices, bug bounty methodology.
> **Package:** [packages/bughunter/](packages/bughunter/)
> Install: `cp -r packages/bughunter/skills/* ~/.claude/skills/ && cp packages/bughunter/commands/* ~/.claude/commands/`

Key skills: `hunt-sqli`, `hunt-xss`, `hunt-ato`, `hunt-api-misconfig`, `hunt-auth-bypass`, `hunt-cicd`, `hunt-cloud-misconfig`, `hunt-cors`, `hunt-csrf`, `hunt-deserialization`, `hunt-ssrf`, `hunt-xxe`, `cloud-iam-deep`, `enterprise-vpn-attack`, `bb-methodology`.
Slash commands: `/hunt`, `/recon`, `/chain`, `/autopilot`, `/intel`, `/report`, `/surface`.

All 71 skills + 15 commands ✅ installed.

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
├── superbob/                     ← SEPARATE PROJECT: the IBM Bob extension.
│   │                               A consumer of this library, not part of it.
│   │                               Packages the library into a .vsix for Bob.
│   │                               See superbob/README.md. Liftable to its own
│   │                               repo (superbob/config.sh → SB_LIBRARY).
│   ├── vsix/                     ← extension source + build-vsix.sh
│   ├── bob/                      ← kits, /superbob command, native mode, build-package.sh
│   └── config.sh                ← declares the library dependency
└── zips/                         ← installable archives
    ├── claude-obsidian-skills.zip ← G1 bundle (11 core skills)
    ├── pm-skills-bundle.zip       ← G2 bundle
    ├── pm-skills-main.zip         ← G2 original
    ├── cowork-skills-bundle.zip   ← G3 bundle
    ├── 15-cowork-skills.zip       ← G3 original
    └── *.zip                      ← individual skill zips (G1)
```


---

## Group 18 — ibelick/ui-skills (Skills for Design Engineers)

> Fix-oriented UI skills from [@ibelick](https://github.com/ibelick) — these **fix existing interfaces**,
> where most of the Open Design pack **builds** new ones. MIT licensed.

**Source:** [github.com/ibelick/ui-skills](https://github.com/ibelick/ui-skills) · 4.5k stars
**Install:** `cp -r packages/ui-skills-ibelick/skills/<name> ~/.claude/skills/`

| Skill | Description | Installed |
|-------|-------------|-----------|
| baseline-ui | Deslop AI-generated UI — spacing, hierarchy, typography, layout | ✅ |
| fixing-accessibility | Audit/fix plain HTML accessibility — ARIA, keyboard, focus, contrast | ✅ |
| fixing-metadata | Page titles, Open Graph, Twitter cards, favicons, JSON-LD, robots | ✅ |
| fixing-motion-performance | Fix janky animations — layout thrashing, compositor, blur | ✅ |
| improve-ui | Read-only UI audit; writes an implementation plan for another agent | ✅ |
| ui-skills-root | Upstream CLI router — **not installed** (mission-control already routes) | ⬜ by design |

*Note: the pre-existing `ui-skills` skill (Open Design) is only a signpost to this repo, not the content.*


---

## Group 19 — hamelsmu/evals-skills (LLM Evaluation Methodology)

> Hamel Husain's eval methodology as skills. These evaluate **an LLM pipeline's output
> quality** — a different problem from `agent-eval` (which compares coding agents) or
> `verification-quality` (which checks code). MIT licensed.
> Post: [hamel.dev/blog/posts/evals-skills](https://hamel.dev/blog/posts/evals-skills/)

**Source:** [github.com/hamelsmu/evals-skills](https://github.com/hamelsmu/evals-skills)
**Install:** `cp -r packages/evals-skills-hamel/skills/<name> ~/.claude/skills/`

| Skill | Description | Installed |
|-------|-------------|-----------|
| eval-audit | Audit an existing eval pipeline — missing error analysis, unvalidated judges, vanity metrics | ✅ |
| error-analysis | Read real traces, categorize failures into a failure-mode vocabulary. **Start here.** | ✅ |
| generate-synthetic-data | Create varied test inputs when real data is sparse (<100 traces) | ✅ |
| write-judge-prompt | Design binary Pass/Fail LLM-as-Judge evaluators for subjective criteria | ✅ |
| validate-evaluator | Calibrate a judge against human labels (TPR/TNR, bias correction) | ✅ |
| evaluate-rag | Score retrieval quality and generation quality as **separate** concerns | ✅ |
| build-review-interface | Generate a browser annotation tool for human trace review | ✅ |

**The rule that matters:** never trust a judge you haven't calibrated against human labels.
`write-judge-prompt` without `validate-evaluator` produces a number that means nothing.

---

## Group 20 — dietrichgebert/ponytail (6 skills · "lazy senior engineer")

> Biases the agent toward minimal code — "the best code is the code you don't write."
> Complements `karpathy-guidelines` with an aggressive delete/YAGNI instinct.
> **Upstream:** [github.com/dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) — MIT
> **Install:** `cp -r packages/ponytail/skills/* ~/.claude/skills/`

| Skill | Description | Installed |
|-------|-------------|-----------|
| [ponytail](packages/ponytail/) | Forces the laziest working solution — YAGNI, stdlib before custom (levels: lite/full/ultra) | ✅ |
| ponytail-review | Reviews a diff only for over-engineering — what to delete | ✅ |
| ponytail-audit | Whole-repo bloat audit — ranked list of what to cut | ✅ |
| ponytail-debt | Harvests `ponytail:` shortcut comments into a debt ledger | ✅ |
| ponytail-gain | Scoreboard of ponytail's measured impact | ✅ |
| ponytail-help | Quick-reference card for the ponytail skills | ✅ |

---

## Group 21 — BehiSecc/VibeSec (1 skill · proactive secure coding)

> Write secure web code proactively (bug-hunter mindset). Complements BugHunter (which
> *hunts* existing vulns) — vibesec *prevents* them at write time.
> **Upstream:** [github.com/BehiSecc/VibeSec-Skill](https://github.com/BehiSecc/VibeSec-Skill) — Apache 2.0
> **Install:** `cp -r packages/vibesec/skills/* ~/.claude/skills/`

| Skill | Description | Installed |
|-------|-------------|-----------|
| [vibesec](packages/vibesec/) | Secure-by-default web code: access control, XSS/CSRF, SQLi/SSRF, auth, API security | ✅ |

---

## Group 22 — petergyang/no-ai-slop (1 skill · sharper, more human writing)

> Strips 20+ AI-slop patterns from a draft while keeping the writer's voice, or detects them
> (names each pattern, no rewrite). Distinct from the generate/style writing skills.
> **Upstream:** [github.com/petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) — MIT
> **Install:** `cp -r packages/no-ai-slop/skills/* ~/.claude/skills/`

| Skill | Description | Installed |
|-------|-------------|-----------|
| [no-ai-slop](packages/no-ai-slop/) | Edit drafts to remove AI-slop patterns while keeping voice; or detect-only | ✅ |
