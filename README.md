# Claude Skills Library

Personal library of Claude Code skills, plugins, and resources — organized by upstream source.
Full inventory with install status: [catalog/CATALOG.md](catalog/CATALOG.md)

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
| [think](skills/think/) | 10-principle structured reasoning framework | 📁 |
| [wiki-cli](skills/wiki-cli/) | Obsidian CLI interaction | 📁 |
| [wiki-mode](skills/wiki-mode/) | Switch vault modes (LYT / PARA / Zettelkasten) | 📁 |
| [wiki-retrieve](skills/wiki-retrieve/) | Hybrid retrieval from vault | 📁 |

✅ = active in `~/.claude/skills/` · 📁 = in `skills/` here, not yet installed

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
| pm-ai-shipping | 2 | Ship-check, security/perf audit for AI-built code | 📦 |

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

| Skill | Description |
|-------|-------------|
| docx | Create/edit/analyze Word docs — tracked changes, comments, formatting |
| pdf | Extract text/tables, create/merge/split PDFs, handle forms |
| pptx | Create/edit PowerPoint — layouts, templates, charts |
| xlsx | Create/edit Excel — formulas, formatting, data analysis |
| algorithmic-art | Generative art with p5.js, seeded randomness, flow fields |
| canvas-design | Visual art in .png/.pdf using design philosophy |
| slack-gif-creator | Animated GIFs optimized for Slack size constraints |
| frontend-design | Bold design decisions for React/Tailwind; avoids AI-slop |
| web-artifacts-builder | Complex claude.ai HTML artifacts with React/Tailwind/shadcn |
| mcp-builder | Guide for building high-quality MCP servers |
| webapp-testing | Test local web apps with Playwright |
| brand-guidelines | Apply official brand colors and typography |
| internal-comms | Write status reports, newsletters, FAQs |
| skill-creator | Interactive guided skill builder |
| claude-api | Claude API reference |
| doc-coauthoring | Document co-authoring workflows |
| theme-factory | Theme generation |

---

## Group 5 — Knowledge Work Plugins (Anthropic)

> **Upstream:** [github.com/anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
> **Package:** [packages/knowledge-work-plugins/](packages/knowledge-work-plugins/)
> Install: `claude plugin marketplace add anthropics/knowledge-work-plugins`

| Plugin | Description |
|--------|-------------|
| productivity | General productivity workflows |
| product-management | PM-focused skills (complements pm-skills) |
| sales | Sales workflows and CRM |
| marketing | Marketing campaign and copy skills |
| customer-support | Support ticket and response skills |
| engineering | Software engineering workflows |
| finance | Financial analysis and reporting |
| legal | Contract, policy, compliance skills |
| human-resources | HR workflows and templates |
| operations | Ops and process management |
| enterprise-search | Search across org knowledge |
| data | Data analysis and transformation |
| design | Design workflows |
| bio-research | Biomedical research skills |
| cowork-plugin-management | Manage Cowork plugins |
| small-business | SMB-focused skills |
| pdf-viewer | PDF reading and annotation |

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

## Quick Install Reference

```bash
# Single skill from source
cp -r skills/<name> ~/.claude/skills/

# Full wiki stack (Group 1, 11 core skills)
cp -r skills/wiki skills/wiki-ingest skills/wiki-query skills/wiki-lint \
  skills/wiki-fold skills/save skills/canvas skills/autoresearch \
  skills/obsidian-markdown skills/obsidian-bases skills/defuddle ~/.claude/skills/

# All 4 additional claude-obsidian skills
cp -r skills/think skills/wiki-cli skills/wiki-mode skills/wiki-retrieve ~/.claude/skills/

# From marketplace (preferred for Groups 1, 2, 4, 5)
claude plugin marketplace add AgriciDaniel/claude-obsidian
claude plugin marketplace add phuryn/pm-skills
claude plugin marketplace add anthropics/skills
claude plugin marketplace add anthropics/knowledge-work-plugins
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
