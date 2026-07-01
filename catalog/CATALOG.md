# Claude Resource Catalog

Complete inventory of Claude skills, plugins, and connectors in this library.
Last updated: 2026-06-29. **970 skills installed in `~/.claude/skills/`.** MCP: SocratiCode.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ installed | Active in `~/.claude/skills/` — available in every Claude Code session |
| 📦 in package | In `packages/`, not yet copied to `~/.claude/skills/` |
| 📁 in skills/ | In `skills/` folder here, not yet copied to `~/.claude/skills/` |
| 🔲 not downloaded | Known resource, not yet pulled into this repo |
| session only | Available in current session only, not persistently configured |

---

## Group 1 — AgriciDaniel/claude-obsidian (Karpathy wiki pattern)

**Source:** [github.com/AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian)
**Foundation:** [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)
**Pattern:** Andrej Karpathy's LLM wiki — compile knowledge once into interconnected markdown instead of re-asking Claude the same questions repeatedly.
**Install:** `claude plugin marketplace add AgriciDaniel/claude-obsidian`
**Bundle:** [zips/claude-obsidian-skills.zip](../zips/claude-obsidian-skills.zip)

| Skill | What it does | Triggers | Status |
|-------|-------------|----------|--------|
| **wiki** | Core orchestrator — scaffolds vault, routes all sub-skills | `set up wiki`, `wiki help` | ✅ installed |
| **wiki-ingest** | Read a source (file, URL, note), extract entities and concepts, create/update wiki pages | `ingest`, `add to wiki`, `save this to wiki` | ✅ installed |
| **wiki-query** | Answer questions from the vault; files good answers back as new pages | `what do you know about`, `query wiki`, `search wiki` | ✅ installed |
| **wiki-lint** | Health check — orphan pages, dead links, frontmatter gaps, naming inconsistencies | `lint wiki`, `wiki health check`, `audit wiki` | ✅ installed |
| **wiki-fold** | Roll up log entries into extractive meta-pages using the DragonScale memory algorithm | `fold log`, `wiki fold`, `summarize log` | ✅ installed |
| **save** | Save a conversation insight as a structured wiki note with backlinks | `save this`, `save to wiki`, `note this` | ✅ installed |
| **canvas** | Visual layer — create Obsidian canvas files with auto-positioned nodes for images, text, and wiki pages | `canvas`, `make a canvas`, `visualize in canvas` | ✅ installed |
| **autoresearch** | Autonomous multi-step research loop; files all findings directly into the wiki | `research`, `autoresearch`, `research and save` | ✅ installed |
| **obsidian-markdown** | Reference for Obsidian Flavored Markdown — wikilinks, callouts, embeds, properties, math, canvas syntax | Used as context by other wiki skills | ✅ installed |
| **obsidian-bases** | Create/edit `.base` files — Obsidian's native database layer for dynamic tables, card views, and filters | `create a base`, `make a database view`, `bases` | ✅ installed |
| **defuddle** | Strip ads, nav, headers, footers from web pages before ingesting — saves 40–60% tokens | Called by wiki-ingest automatically | ✅ installed |
| **think** | 10-principle structured reasoning loop: OBSERVE-OBSERVE-LISTEN-THINK-CONNECT-CONNECT-FEEL-ACCEPT-CREATE-GROW | `think through`, `apply thinking framework`, `reason about` | ✅ installed |
| **wiki-cli** | Default vault-mutation transport for claude-obsidian v1.7+ — wraps Obsidian CLI (v1.12+) as preferred write path | Called by wiki and wiki-ingest internally | ✅ installed |
| **wiki-mode** | Switch vault organizational methodology: LYT / PARA / Zettelkasten / Generic | `set wiki mode`, `switch to PARA`, `use Zettelkasten` | ✅ installed |
| **wiki-retrieve** | Hybrid retrieval primitive for the Compound Vault — replaces static hot→index→drill read order with contextual routing | Called by wiki-query internally | ✅ installed |

---

## Group 2 — phuryn/pm-skills (Paweł Huryn · Product Compass)

**Source:** [github.com/phuryn/pm-skills](https://github.com/phuryn/pm-skills) · v2.0.0
**Companion:** [pm-brain](https://github.com/phuryn/pm-brain) MCP
**Install:** `claude plugin marketplace add phuryn/pm-skills`
**Package:** [packages/pm-skills-main/](../packages/pm-skills-main/)

68 skills across 9 plugins with 42 chained workflows.

| Plugin | Skills (count) | What it covers | Status |
|--------|---------------|----------------|--------|
| **pm-product-discovery** | 13 | Ideation, assumption testing, discovery interviews, jobs-to-be-done, opportunity mapping, prioritization frameworks | ✅ installed |
| **pm-product-strategy** | 12 | Vision crafting, lean canvas, SWOT, PESTLE, Ansoff matrix, Porter's Five Forces, moat analysis | ✅ installed |
| **pm-execution** | 16 | PRDs, user stories, acceptance criteria, OKRs, sprint plans, retrospectives, roadmaps, release notes | ✅ installed |
| **pm-market-research** | 7 | Competitor analysis, user personas, market sizing, sentiment analysis, trend research | ✅ installed |
| **pm-go-to-market** | 6 | GTM strategy, ICP definition, competitive battlecard, growth loops, launch plan | ✅ installed |
| **pm-marketing-growth** | 5 | North star metric, positioning, value proposition, product naming, messaging frameworks | ✅ installed |
| **pm-data-analytics** | 3 | A/B test analysis, cohort analysis, SQL query generation for product data | ✅ installed |
| **pm-toolkit** | 4 | NDA drafting, privacy policy, grammar check, resume review | ✅ installed |
| **pm-ai-shipping** | 2 | Ship-check and security/performance audit for AI-built code | ✅ installed |

---

## Group 3 — 15-cowork-skills (Brock / YouTube)

**Source:** Brock's YouTube — *"15 Claude Cowork Skills I Can't Live Without"*
**Install:** Cowork → Plugin icon → Upload zip (cannot be installed via CLI)
**Package:** [packages/15-cowork-skills/](../packages/15-cowork-skills/)
**Bundle:** [zips/cowork-skills-bundle.zip](../zips/cowork-skills-bundle.zip)

| Skill | What it does | Triggers |
|-------|-------------|----------|
| **slide-deck-builder** | Generate visual slide decks with rich HTML components | `make a slide deck`, `create slides`, `build a presentation` |
| **budget-dashboard** | Interactive financial dashboard (Apple Swiss design) — sliders, donut chart, 12-month projection | `budget dashboard`, `financial dashboard`, `visualize my budget` |
| **email-drafter** | Write professional emails for any situation — outreach, follow-ups, negotiations | `draft an email`, `write an email`, `help me reply to` |
| **receipt-scanner** | Read PDF receipts/invoices, extract amounts, build expense report | `scan my receipts`, `expense report`, `process these receipts` |
| **explainer-graphic** | Create visual infographics using real-world analogies as self-contained HTML | `explainer graphic`, `make an infographic`, `explain this visually` |
| **visual-page-builder** | Generate beautiful self-contained HTML pages that explain any concept visually | `visual explanation`, `make a visual page`, `build an html explainer` |
| **invoice-generator** | Generate a professional PDF invoice from basic billing details | `create an invoice`, `invoice this client`, `generate invoice` |
| **contract-reviewer** | Review any contract in plain English — flag red flags, give sign/don't-sign recommendation | `review this contract`, `should I sign this`, `NDA review` |
| **workflow-visualizer** | Map any system or workflow as an interactive HTML diagram | `visualize this workflow`, `diagram my workflow`, `show how this works` |
| **morning-briefing** | Daily industry scan with top content opportunities and urgency levels | `morning briefing`, `daily briefing`, `start my day` |
| **quick-research** | Research any topic from multiple sources, deliver clean summary report | `research this`, `look into`, `what's the deal with` |
| **animated-website** | Turn any video into a luxury scroll-animated website with parallax effects | `animated website from this video`, `scroll-animated site` |
| **learning-path-generator** | Create structured learning plan for any skill or topic | `how do I learn`, `learning path`, `study plan for` |
| **customize** | Show how to customize these skills to your specific use case | `customize`, `how do I edit skills`, `personalize` |
| **difficult-conversation-prep** | Script, talking points, and likely pushback responses for tough conversations | `difficult conversation`, `how do I tell them`, `prep me for a confrontation` |

---

## Group 4 — anthropics/skills (Official Anthropic)

**Source:** [github.com/anthropics/skills](https://github.com/anthropics/skills)
**Install:** `claude plugin marketplace add anthropics/skills`
**Package:** [packages/anthropics-skills/](../packages/anthropics-skills/)

| Skill | What it does | Triggers | Status |
|-------|-------------|----------|--------|
| **docx** | Create, read, edit, or manipulate Word documents — tracked changes, comments, TOC, headings, letterheads | `Word doc`, `.docx`, `report as Word`, `memo`, `letter` | ✅ installed |
| **pdf** | Read/extract text+tables from PDFs, combine/split/rotate, add watermarks, fill forms, OCR scanned PDFs | `.pdf`, `PDF form`, `merge PDFs`, `extract from PDF` | ✅ installed |
| **pptx** | Create/edit PowerPoint — layouts, templates, charts, speaker notes | `deck`, `slides`, `presentation`, `.pptx` | ✅ installed |
| **xlsx** | Create/edit Excel — formulas, formatting, data analysis, charting, cleaning messy tabular files | `.xlsx`, `spreadsheet`, `Excel`, `clean this CSV` | ✅ installed |
| **algorithmic-art** | Generative art using p5.js with seeded randomness, flow fields, particle systems; outputs `.html` + `.js` + `.md` | `generative art`, `algorithmic art`, `flow field`, `particle system` | ✅ installed |
| **canvas-design** | Visual art in `.png` and `.pdf` using design philosophy; outputs aesthetic posters and static designs | `design a poster`, `piece of art`, `visual design` | ✅ installed |
| **slack-gif-creator** | Animated GIFs optimized for Slack size/color constraints with validation tools | `GIF for Slack`, `animated GIF`, `make me a GIF` | ✅ installed |
| **frontend-design** | Guidance for distinctive, non-templated visual design in React/Tailwind — avoids AI-slop aesthetics | `design this UI`, `make it look better`, `aesthetic direction` | ✅ installed |
| **web-artifacts-builder** | Complex multi-component claude.ai HTML artifacts with React, Tailwind, shadcn/ui, state management | `complex artifact`, `React artifact`, `shadcn component` | ✅ installed |
| **mcp-builder** | Guide for building high-quality MCP servers in Python (FastMCP) or Node/TypeScript | `build an MCP`, `MCP server`, `integrate external API via MCP` | ✅ installed |
| **webapp-testing** | Test local web apps with Playwright — verify frontend behavior, capture screenshots, view logs | `test this web app`, `Playwright`, `UI testing` | ✅ installed |
| **brand-guidelines** | Apply Anthropic's official brand colors and typography to any artifact | `Anthropic branding`, `brand colors`, `use brand guidelines` | ✅ installed |
| **internal-comms** | Write status reports, leadership updates, newsletters, FAQs, incident reports in company formats | `status report`, `leadership update`, `company newsletter` | ✅ installed |
| **skill-creator** | Interactive guided builder for creating, editing, and evaluating skills — includes variance analysis evals | `create a skill`, `improve this skill`, `run evals on skill` | ✅ installed |
| **claude-api** | Reference for Claude API — model IDs, pricing, streaming, tool use, MCP, agents, caching, token counting | Auto-triggers when working with Claude/Anthropic in code | ✅ installed |
| **doc-coauthoring** | Structured workflow for co-authoring docs — context gathering, refinement, reader testing | `write documentation`, `draft a proposal`, `help me write a spec` | ✅ installed |
| **theme-factory** | Apply one of 10 preset themes (colors + fonts) to any artifact — slides, docs, HTML pages | `apply a theme`, `style this`, `theme factory` | ✅ installed |

---

## Group 5 — anthropics/knowledge-work-plugins (127 skills across 17 plugins)

**Source:** [github.com/anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
**Install:** `claude plugin marketplace add anthropics/knowledge-work-plugins`
**Package:** [packages/knowledge-work-plugins/](../packages/knowledge-work-plugins/)

### Engineering (10 skills)

| Skill | What it does |
|-------|-------------|
| **architecture** | Create or evaluate an Architecture Decision Record (ADR); choose between technologies | ✅ |
| **code-review** | Review a PR or diff for security, performance, and correctness | ✅ |
| **debug** | Structured debugging — reproduce, isolate, diagnose, fix with a given error or stack trace | ✅ |
| **deploy-checklist** | Pre-deployment verification — migrations, rollback plan, monitoring | ✅ |
| **documentation** | Write technical docs, READMEs, API references, runbooks | ✅ |
| **incident-response** | Triage, communicate, and write postmortem for production incidents | ✅ |
| **standup** | Generate a standup update from recent commits and activity | ✅ |
| **system-design** | Design services and architectures with trade-off analysis | ✅ |
| **tech-debt** | Identify, categorize, and prioritize technical debt with remediation plan | ✅ |
| **testing-strategy** | Design test strategies — unit, integration, e2e, coverage targets | ✅ |

### Sales (9 skills)

| Skill | What it does |
|-------|-------------|
| **account-research** | Research a company or person for actionable sales intel | ✅ |
| **call-prep** | Prepare for a sales call — account context, attendee research, suggested agenda | ✅ |
| **call-summary** | Process call notes or transcript → action items + follow-up email + internal summary | ✅ |
| **competitive-intelligence** | Research competitors and build an interactive battlecard HTML artifact | ✅ |
| **create-an-asset** | Generate deal-specific assets — landing pages, one-pagers, workflow demos | ✅ |
| **daily-briefing** | Prioritized daily sales briefing — meetings, priorities, pipeline spotlight | ✅ |
| **draft-outreach** | Research a prospect then draft personalized outreach email | ✅ |
| **forecast** | Weighted sales forecast with best/likely/worst scenarios and gap analysis | ✅ |
| **pipeline-review** | Analyze pipeline health — prioritize deals, flag risks, weekly action plan | ✅ |

### Marketing (8 skills)

| Skill | What it does |
|-------|-------------|
| **brand-review** | Review content against brand voice and style guide, flag deviations by severity | ✅ |
| **campaign-plan** | Full campaign brief — objectives, audience, messaging, channel strategy, content calendar | ✅ |
| **competitive-brief** | Research competitors and produce positioning/messaging comparison with content gaps | ✅ |
| **content-creation** | Draft marketing content across channels — blog, social, email, landing pages, press releases | ✅ |
| **draft-content** | Draft blog posts, social media, newsletters, landing pages with channel-specific formatting | ✅ |
| **email-sequence** | Design and draft multi-email sequences — timing, branching logic, exit conditions | ✅ |
| **performance-report** | Marketing performance report — key metrics, trend analysis, wins, misses, optimizations | ✅ |
| **seo-audit** | Comprehensive SEO audit — keyword research, on-page analysis, content gaps, technical checks | ✅ |

### Finance (8 skills)

| Skill | What it does |
|-------|-------------|
| **audit-support** | SOX 404 compliance — control testing methodology, sample selection, documentation | ✅ |
| **close-management** | Month-end close process — task sequencing, dependencies, status tracking | ✅ |
| **financial-statements** | Generate income statement, balance sheet, cash flow with period-over-period comparison | ✅ |
| **journal-entry** | Prepare journal entries — debits, credits, supporting docs for month-end close | ✅ |
| **journal-entry-prep** | Same as journal-entry, alternative entry point | ✅ |
| **reconciliation** | Reconcile accounts — GL vs subledgers, bank statements, or third-party data | ✅ |
| **sox-testing** | SOX sample selections, testing workpapers, and control assessments for Q/annual compliance | ✅ |
| **variance-analysis** | Decompose financial variances into drivers with narrative and waterfall analysis | ✅ |

### Legal (9 skills)

| Skill | What it does |
|-------|-------------|
| **brief** | Generate contextual briefings for legal work — daily summary, topic research, incident response | ✅ |
| **compliance-check** | Check a proposed action or feature against applicable regulations, flag violations | ✅ |
| **legal-response** | Generate responses to common legal inquiries with escalation checks | ✅ |
| **legal-risk-assessment** | Assess legal risks using severity-by-likelihood framework | ✅ |
| **meeting-briefing** | Prepare structured briefings for meetings with legal relevance; track action items | ✅ |
| **review-contract** | Review contract in plain English — red flags with severity ratings, marked-up docx output | ✅ |
| **signature-request** | Prepare and route a document for e-signature — pre-sig checklist, signing order | ✅ |
| **triage-nda** | Rapidly classify NDAs: GREEN (standard), YELLOW (counsel review), RED (full legal review) | ✅ |
| **vendor-check** | Check vendor agreement status across CLM, CRM, email, and document storage | ✅ |

### Human Resources (9 skills)

| Skill | What it does |
|-------|-------------|
| **comp-analysis** | Compensation benchmarking, band placement, equity modeling | ✅ |
| **draft-offer** | Draft offer letter with comp details, total comp breakdown, and terms | ✅ |
| **interview-prep** | Create structured interview plans with competency-based questions and scorecards | ✅ |
| **onboarding** | Generate onboarding checklist and first-week plan for a new hire | ✅ |
| **org-planning** | Headcount planning, org design, team structure optimization | ✅ |
| **people-report** | Generate headcount, attrition, diversity, or org health reports | ✅ |
| **performance-review** | Structure performance review — self-assessment, manager template, calibration prep | ✅ |
| **policy-lookup** | Find and explain company policies in plain language | ✅ |
| **recruiting-pipeline** | Track and manage recruiting pipeline stages | ✅ |

### Data (10 skills)

| Skill | What it does |
|-------|-------------|
| **analyze** | Answer data questions — single metric lookup to full multi-step analysis | ✅ |
| **build-dashboard** | Build interactive HTML dashboard with charts, filters, and KPI tables | ✅ |
| **create-viz** | Create publication-quality visualizations with Python (matplotlib, seaborn, plotly) | ✅ |
| **data-context-extractor** | Extract structured context from unstructured data sources | ✅ |
| **data-visualization** | Choose the right chart type, build it in Python with best-practice formatting | ✅ |
| **explore-data** | Profile and explore a new dataset — shape, quality, patterns, anomalies | ✅ |
| **sql-queries** | Write correct, performant SQL across Snowflake, BigQuery, Databricks, PostgreSQL | ✅ |
| **statistical-analysis** | Descriptive stats, trend analysis, outlier detection, hypothesis testing | ✅ |
| **validate-data** | QA an analysis before sharing — methodology, accuracy, and bias checks | ✅ |
| **write-query** | Translate a natural-language data question into optimized SQL for your dialect | ✅ |

### Design (7 skills)

| Skill | What it does |
|-------|-------------|
| **accessibility-review** | WCAG 2.1 AA accessibility audit on a design or page | ✅ |
| **design-critique** | Structured feedback on usability, hierarchy, and consistency | ✅ |
| **design-handoff** | Generate developer handoff specs from a completed design | ✅ |
| **design-system** | Audit, document, or extend a design system — naming, tokens, components | ✅ |
| **research-synthesis** | Synthesize user research — interviews, surveys → themes, insights, recommendations | ✅ |
| **user-research** | Plan, conduct, and synthesize user research — interview guides, usability tests | ✅ |
| **ux-copy** | Write or review UX copy — microcopy, error messages, empty states, CTAs | ✅ |

### Bio-Research (6 skills)

| Skill | What it does |
|-------|-------------|
| **start** | Orient the bio-research environment and explore available tools | ✅ |
| **scientific-problem-selection** | Help scientists with research problem selection and project ideation | ✅ |
| **nextflow-development** | Run nf-core bioinformatics pipelines (rnaseq, sarek, atacseq) on sequencing data | ✅ |
| **scvi-tools** | Deep learning for single-cell analysis using scvi-tools — data integration, cell-type annotation | ✅ |
| **single-cell-rna-qc** | Quality control on single-cell RNA-seq data (.h5ad/.h5 files) using scverse best practices | ✅ |
| **instrument-data-to-allotrope** | Convert lab instrument output (PDF, CSV, Excel, TXT) to Allotrope Simple Model JSON | ✅ |

### Operations (9 skills)

| Skill | What it does |
|-------|-------------|
| **capacity-plan** | Plan resource capacity — workload analysis and utilization forecasting | ✅ |
| **change-request** | Create a change management request with impact analysis and rollback plan | ✅ |
| **compliance-tracking** | Track compliance requirements and audit readiness — SOC 2, ISO 27001, GDPR | ✅ |
| **process-doc** | Document a business process — flowcharts, RACI, SOPs | ✅ |
| **process-optimization** | Analyze and improve business processes — identify bottlenecks, waste | ✅ |
| **risk-assessment** | Identify, assess, and mitigate operational risks with a risk register | ✅ |
| **runbook** | Create or update an operational runbook for recurring tasks or on-call procedures | ✅ |
| **status-report** | Generate a status report with KPIs, risks, and action items for leadership | ✅ |
| **vendor-review** | Evaluate a vendor — cost analysis, risk assessment, recommendation | ✅ |

### Customer Support (5 skills)

| Skill | What it does |
|-------|-------------|
| **customer-escalation** | Package escalation for engineering/product/leadership with full context | ✅ |
| **customer-research** | Multi-source research on a customer question with source attribution | ✅ |
| **draft-response** | Draft professional customer-facing response tailored to situation and relationship | ✅ |
| **kb-article** | Draft a knowledge base article from a resolved issue or common question | ✅ |
| **ticket-triage** | Triage and prioritize a support ticket — categorize, assign, set SLA | ✅ |

### Productivity (5 skills)

| Skill | What it does |
|-------|-------------|
| **start** | Initialize productivity context for the session | ✅ |
| **memory-management** | Two-tier memory system — decodes shorthand, acronyms, maintains workplace context | ✅ |
| **task-management** | Simple task management using a shared TASKS.md file | ✅ |
| **update** | Sync tasks and refresh memory from current activity | ✅ |
| **dashboard** | Generate an HTML productivity dashboard | ✅ |

### Product Management (8 skills)

| Skill | What it does |
|-------|-------------|
| **competitive-brief** | Competitor positioning and messaging comparison | ✅ |
| **metrics-review** | Review product metrics — trends, anomalies, impact analysis | ✅ |
| **product-brainstorming** | Structured product ideation session | ✅ |
| **roadmap-update** | Update and communicate roadmap changes | ✅ |
| **sprint-planning** | Plan a sprint — capacity, story selection, risk flags | ✅ |
| **stakeholder-update** | Write stakeholder update with progress, risks, and asks | ✅ |
| **synthesize-research** | Synthesize customer/user research into product insights | ✅ |
| **write-spec** | Write a product spec or PRD from requirements | ✅ |

### Small Business (31 skills)

A comprehensive suite for small business owners. Highlights:

| Skill | What it does |
|-------|-------------|
| **close-month** | Reconcile QB vs payment processors, flag gaps, write P&L narrative, export close packet | ✅ |
| **monday-brief** | Monday morning briefing — cash, sales, pipeline, week ahead, top 3 to-dos | ✅ |
| **friday-brief** | Friday end-of-week pulse — revenue vs prior week, top sellers, wins and watches | ✅ |
| **month-heads-up** | Run on the 25th — 30-day cash-flow outlook and flags for month-end | ✅ |
| **plan-payroll** | Forecast cash, rank overdue invoices, stage reminders so owner can run payroll confidently | ✅ |
| **quarterly-review** | Full QBR narrative — revenue trend, margin trend, customer health, opportunities, risks | ✅ |
| **price-check** | Margin-by-product table and three pricing-scenario data views | ✅ |
| **crm-cleanup** | Scan HubSpot for stale deals, duplicate contacts, missing fields, fix with owner approval | ✅ |
| **run-campaign** | End-to-end marketing campaign — analysis, content brief, Canva assets, HubSpot send | ✅ |
| **cash-flow-snapshot** | Current cash position snapshot | ✅ |
| **business-pulse** | Overall business health pulse | ✅ |
| **tax-prep** | Quarterly estimated tax or year-end 1099 prep | ✅ |
| **sales-brief** | Top/bottom sellers, seasonality patterns, 2-week content brief | ✅ |
| **handle-complaint** | Customer complaint end-to-end — pull context, draft response, suggest operational fix | ✅ |
| + 17 more | invoice-chase, lead-triage, smb-router, smb-onboard, content-strategy, etc. | ✅ |

### Enterprise Search (5 skills)

| Skill | What it does |
|-------|-------------|
| **search** | Search across org knowledge sources | ✅ |
| **search-strategy** | Design a search strategy for a knowledge question | ✅ |
| **knowledge-synthesis** | Synthesize findings across multiple knowledge sources | ✅ |
| **digest** | Daily/weekly knowledge digest from monitored sources | ✅ |
| **source-management** | Manage and curate knowledge sources | ✅ |

### Cowork Plugin Management (2 skills)

| Skill | What it does |
|-------|-------------|
| **cowork-plugin-customizer** | Customize Cowork plugin behavior | ✅ |
| **create-cowork-plugin** | Scaffold a new Cowork plugin | ✅ |

### PDF Viewer (1 skill)

| Skill | What it does |
|-------|-------------|
| **view-pdf** | Read and annotate PDF files in the Cowork interface | ✅ |

---

## Group 8 — ruvnet/ruflo (134 skills · multi-agent swarm)

**Source:** [github.com/ruvnet/ruflo](https://github.com/ruvnet/ruflo)
**Pattern:** SPARC multi-agent framework — swarm coordination, distributed consensus (Raft/CRDT/Byzantine), GitHub automation, performance benchmarking, neural coordination.
**Install:** `cp -r packages/ruflo/.agents/skills/* ~/.claude/skills/`
**Package:** [packages/ruflo/](../packages/ruflo/)

All 134 skills ✅ installed. Key categories:

| Category | Skills |
|----------|--------|
| **Agent orchestration** | agent-agent, agent-orchestrator-task, agent-queen-coordinator, agent-mesh-coordinator, agent-hierarchical-coordinator, agent-swarm, agent-coordinator-swarm-init, agent-consensus-coordinator, agent-quorum-manager, agent-raft-manager, agent-byzantine-coordinator, agent-gossip-coordinator, agent-topology-optimizer, agent-sync-coordinator, agent-adaptive-coordinator, agent-collective-intelligence-coordinator, + more |
| **Specialists** | agent-coder, agent-tester, agent-reviewer, agent-researcher, agent-planner, agent-architecture, agent-authentication, agent-dev-backend-api, agent-security-manager, agent-performance-analyzer, agent-performance-optimizer, agent-repo-architect, agent-scout-explorer |
| **GitHub automation** | github-automation, github-code-review, github-multi-repo, github-project-management, github-release-management, github-workflow-automation, agent-github-modes, agent-github-pr-manager, agent-pr-manager, agent-release-manager, agent-release-swarm |
| **AgentDB / memory** | agentdb-advanced, agentdb-learning, agentdb-memory-patterns, agentdb-optimization, agentdb-vector-search, embeddings, neural-training, reasoningbank-agentdb, reasoningbank-intelligence |
| **SPARC / methodology** | sparc-methodology, agent-implementer-sparc-coder, agent-sparc-coordinator, agentic-jujutsu |
| **Hive / swarm** | hive-mind, hive-mind-advanced, swarm-advanced, swarm-orchestration, flow-nexus-neural, flow-nexus-platform, flow-nexus-swarm, stream-chain |
| **Engineering** | security-audit, performance-analysis, pair-programming, verification-quality, hooks-automation, worker-benchmarks, worker-integration |
| **v3 architecture** | v3-cli-modernization, v3-core-implementation, v3-ddd-architecture, v3-integration-deep, v3-mcp-optimization, v3-memory-unification, v3-performance-optimization, v3-security-overhaul, v3-swarm-coordination |

---

## Group 9 — nexu-io/open-design (264 skills · design + templates)

**Source:** [github.com/nexu-io/open-design](https://github.com/nexu-io/open-design)
**Pattern:** Full design system — AI image/video generation (FAL, Venice, Sora, Replicate), Figma workflows, GSAP animation, frontend design, and 100+ HTML presentation templates.
**Install:** `cp -r packages/open-design/skills/* ~/.claude/skills/ && cp -r packages/open-design/design-templates/* ~/.claude/skills/`
**Package:** [packages/open-design/](../packages/open-design/)

All 264 skills ✅ installed. Key categories:

| Category | Skills |
|----------|--------|
| **FAL AI** | fal-generate, fal-image-edit, fal-upscale, fal-video-edit, fal-tryon, fal-3d, fal-realtime, fal-restore, fal-train, fal-kling-o3, fal-lip-sync, fal-vision |
| **Figma** | figma-use, figma-generate-design, figma-create-new-file, figma-generate-library, figma-implement-design, figma-code-connect-components, figma-create-design-system-rules |
| **GSAP animation** | gsap-core, gsap-react, gsap-scrolltrigger, gsap-plugins, gsap-timeline, gsap-utils, gsap-frameworks, gsap-performance |
| **Venice AI** | venice-image-generate, venice-image-edit, venice-audio-music, venice-audio-speech, venice-video |
| **Video / motion** | remotion, sora, hyperframes, video-hyperframes, emilkowalski-motion, vfx-text-cursor, stitch-skill, stitch-loop, gif-sticker-maker |
| **Frontend** | frontend-dev, frontend-skill, frontend-slides, shadcn-ui, threejs, shader-dev, gsap-react, flutter-animating-apps, swiftui-design |
| **Image gen** | imagegen, imagegen-frontend-web, imagegen-frontend-mobile, imagen, image-enhancer, fal-generate, replicate, venice-image-generate |
| **Social cards** | card-twitter, card-xiaohongshu, social-spotify-card, social-reddit-card, social-x-post-card, social-carousel |
| **Presentation templates** | html-ppt-zhangzara-* (30+ themes), orbit-general, orbit-github, orbit-gmail, orbit-linear, orbit-notion, replit-deck, kami-deck, nanobanana-ppt, guizang-ppt, html-ppt-pitch-deck, html-ppt-product-launch, and 60+ more |
| **Design tools** | brandkit, design-brief, design-md, design-review, d3-visualization, color-expert, copywriting, creative-director, critique, enhance-prompt, resume-modern, pptx-generator, pptx-html-fidelity-audit |

---

## Group 7 — obra/superpowers (Jesse Vincent)

**Source:** [github.com/obra/superpowers](https://github.com/obra/superpowers)
**Pattern:** Engineering discipline skills designed to be invoked *before* acting — TDD, systematic debugging, verification-first, parallel agents, worktrees. Each skill is a guard or process gate.
**Install:** `cp -r packages/superpowers/skills/* ~/.claude/skills/`
**Package:** [packages/superpowers/](../packages/superpowers/)

| Skill | What it does | When to invoke |
|-------|-------------|----------------|
| **using-superpowers** | Meta-skill — establishes skill discovery and invocation protocol at session start | Start of any conversation |
| **brainstorming** | Explore user intent, requirements, and design *before* implementation | Before any feature, component, or behavior change |
| **writing-plans** | Write a structured multi-step implementation plan from a spec | Before touching code on a multi-step task |
| **executing-plans** | Execute a written plan in a separate session with review checkpoints | When a plan is ready to run |
| **test-driven-development** | Write failing tests before writing implementation code | Before any feature or bugfix implementation |
| **systematic-debugging** | Structured reproduce → isolate → diagnose → fix loop | On any bug, test failure, or unexpected behavior |
| **verification-before-completion** | Run verification commands and confirm output before claiming work is done | Before committing, before opening a PR |
| **requesting-code-review** | Verify work meets requirements and prepare review request | After completing implementation |
| **receiving-code-review** | Process review feedback with technical rigor — verify before implementing | When code review arrives |
| **using-git-worktrees** | Set up isolated workspace via git worktree before feature work | Before starting isolated feature work |
| **dispatching-parallel-agents** | Fan out 2+ independent tasks to parallel agents | When tasks have no shared state or sequential dependencies |
| **subagent-driven-development** | Execute implementation plans with independent tasks in the current session | When a plan has parallelizable steps |
| **finishing-a-development-branch** | Structured options for integrating completed work — merge, PR, or cleanup | When implementation is done and tests pass |
| **writing-skills** | Create, edit, and verify skills before deployment | When building or improving skills |

All 14 skills ✅ installed in `~/.claude/skills/`

---

## Group 6 — Custom / Personal (this repo)

**Source:** [github.com/eniwetok/claude-skills-library](https://github.com/eniwetok/claude-skills-library)

| Skill | What it does | Triggers | Status |
|-------|-------------|----------|--------|
| **pm-agent** | Multi-product PM agent — orchestrates pm-skills, generates weekly product reports across a portfolio | `/pm-agent`, `weekly PM run`, `pm report` | ✅ installed |
| **pptx-from-template** | Brand-faithful PowerPoint builder — unpack template → clone layouts → inject content → repack. Never regenerates from scratch. | `from my template`, `match our deck`, `use this pptx as template` | ✅ local only |
| **update-skills-library** | Sync this repo from all upstream sources — clone, diff, copy changes, rebuild zips, update README/CATALOG, push | `update skills library`, `sync skills from upstream` | ✅ local only |

*`pptx-from-template` and `update-skills-library` are in `~/.claude/skills/` locally but not tracked in this repo's `skills/` folder.*

---

## Group 10 — affaan-m/ECC (277 skills · Everything Claude Code)

**Source:** [github.com/affaan-m/ECC](https://github.com/affaan-m/ECC)
**Pattern:** "Agent harness performance optimization" — engineering stacks, agentic frameworks, cost-aware LLM pipelines, eval harnesses, healthcare, security, homelab, frontend/backend frameworks.
**Install:** `cp -r packages/affaan-ecc/skills/* ~/.claude/skills/`
**Package:** [packages/affaan-ecc/](../packages/affaan-ecc/)

All 277 skills ✅ installed. Key skills: `agentic-engineering`, `ai-first-engineering`, `autonomous-agent-harness`, `eval-harness`, `benchmark`, `benchmark-optimization-loop`, `cost-aware-llm-pipeline`, `agent-eval`, `agent-harness-construction`, `agent-introspection-debugging`, `agent-self-evaluation`, `karpathy-guidelines` (bundled), `django-patterns`, `fastapi-patterns`, `laravel-patterns`, `react-patterns`, `flutter-dart-code-review`, `kotlin-patterns`, `rust-patterns`, `golang-patterns`, `hipaa-compliance`, `healthcare-cdss-patterns`, `homelab-wireguard-vpn`, `hookify-rules`, `security-bounty-hunter`.

---

## Group 11 — zhangzhang-111-i/claude-skills (~180 skills · Enterprise role bundle)

**Source:** [github.com/zhangzhang-111-i/claude-skills](https://github.com/zhangzhang-111-i/claude-skills)
**Pattern:** Role-based advisor skills for enterprise. Category bundles (e.g., `engineering`) contain both a top-level router SKILL.md and individual sub-skills.
**Install:** copy category bundles + leaf skills (see README Group 11)
**Package:** [packages/zhangzhang-skills/](../packages/zhangzhang-skills/)

All ~180 skills ✅ installed. Key skills: `ceo-advisor`, `cto-advisor`, `ciso-advisor`, `cmo-advisor`, `cfo-advisor`, `cpo-advisor`, `coo-advisor`, `senior-architect`, `senior-backend`, `senior-frontend`, `senior-devops`, `senior-security`, `senior-pm`, `playwright-pro`, `agent-designer`, `agent-workflow-designer`, `mcp-server-builder`, `rag-architect`, `scrum-master`, `jira-expert`, `confluence-expert`, `atlassian-admin`, `gdpr-dsgvo-expert`, `fda-consultant-specialist`, `saas-scaffolder`, `saas-metrics-coach`, `marketing-skill` (bundle), `c-level-advisor` (bundle), `engineering` (bundle), `product-team` (bundle).

---

## Group 12 — n8n-io/skills (14 skills · n8n workflow automation)

**Source:** [github.com/n8n-io/skills](https://github.com/n8n-io/skills)
**Pattern:** Skills for building, debugging, and extending n8n automation workflows.
**Install:** `cp -r packages/n8n-skills/skills/* ~/.claude/skills/`
**Package:** [packages/n8n-skills/](../packages/n8n-skills/)

All 14 skills ✅ installed: `n8n-agents`, `n8n-binary-and-data`, `n8n-code-nodes`, `n8n-credentials-and-security`, `n8n-data-tables`, `n8n-debugging`, `n8n-error-handling`, `n8n-expressions`, `n8n-extending-mcp`, `n8n-loops`, `n8n-node-configuration`, `n8n-subworkflows`, `n8n-workflow-lifecycle`, `using-n8n-skills`.

---

## Group 13 — Community singles (3 skills)

Small single-skill repos from the community.

| Skill | Source | Description | Status |
|-------|--------|-------------|--------|
| `agent-council` | [team-attention/agent-council](https://github.com/team-attention/agent-council) | Multi-AI consensus — "summon the council" to get opinions from multiple models synthesized into one answer | ✅ installed |
| `obsidian-cli` | [pablo-mano/Obsidian-CLI-skill](https://github.com/pablo-mano/Obsidian-CLI-skill) | Read/write Obsidian vault notes via Obsidian CLI from Claude Code | ✅ installed |
| `karpathy-guidelines` | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | CLAUDE.md guidelines derived from Karpathy's LLM coding observations — research-first, minimal code | ✅ installed |

---

## Plugins (Cowork)

Marketplace plugins installed via `claude plugin marketplace add`. State stored in `~/.claude/plugins/`.

| Plugin | Upstream | Skills | Status |
|--------|----------|--------|--------|
| pm-product-discovery | phuryn/pm-skills | 13 | ✅ installed |
| pm-product-strategy | phuryn/pm-skills | 12 | ✅ installed |
| pm-execution | phuryn/pm-skills | 16 | ✅ installed |
| pm-market-research | phuryn/pm-skills | 7 | ✅ installed |
| pm-go-to-market | phuryn/pm-skills | 6 | ✅ installed |
| pm-marketing-growth | phuryn/pm-skills | 5 | ✅ installed |
| pm-data-analytics | phuryn/pm-skills | 3 | ✅ installed |
| pm-toolkit | phuryn/pm-skills | 4 | ✅ installed |
| pm-ai-shipping | phuryn/pm-skills | 2 | ✅ installed |
| knowledge-work-plugins | anthropics/knowledge-work-plugins | 127 | ✅ installed |
| learn-with-coursera | coursera/skills | 1 skill | ✅ installed |
| learning-output-style | anthropics/claude-plugins-public | hook-based | ✅ installed |

---

## Connectors (MCP)

MCP servers accessible in Claude Code sessions. None permanently installed in global settings — all session-based.

| Connector | What it provides | Status |
|-----------|----------------|--------|
| computer-use | Full desktop control (mouse, keyboard, screenshots) | session only |
| Claude in Chrome | Browser DOM interaction — click, fill, read, navigate | session only |
| Gmail | Read/draft/label/search email threads | session only |
| Gamma | AI presentation generation and theming | session only |
| Granola | Meeting transcript access and search | session only |
| Monday.com | Project management boards and items | session only |
| scheduled-tasks | Cron scheduler for Claude Code tasks | session only |
| mcp-registry | Discover and search MCP connectors | session only |
| ccd-session | Session management, memory, chapters, widgets | session only |

---

## Notable Community Resources (not yet downloaded)

| Resource | URL | What it has |
|----------|-----|-------------|
| ~~obra/superpowers~~ | ✅ installed as Group 7 | 14 skills: TDD, debugging, brainstorming, parallel agents, worktrees |
| daymade/claude-code-skills | https://github.com/daymade/claude-code-skills | 64+ skills: GitHub, audio, QA, DevOps |
| alirezarezvani/claude-skills | https://github.com/alirezarezvani/claude-skills | 345 skills across 17 domains |
| Trail of Bits Security Skills | https://github.com/trailofbits/skills | Security: CodeQL, Semgrep, auditing |
| shadcn/ui skill | https://ui.shadcn.com/docs/skills | shadcn component context |
| Expo skills | https://github.com/expo/skills | Official Expo dev skills |
| ios-simulator-skill | https://github.com/conorluddy/ios-simulator-skill | iOS app building/testing |
| TonsOfSkills | https://github.com/jeremylongshore/claude-code-plugins-plus-skills | 2810 skills, 425 plugins |
