# Claude Skills Library

Personal collection of Claude Code skills, organized by origin. Each skill is available as raw source (for browsing and customization) and as a `.zip` (for quick install).

---

## Sources

| # | Origin | Author | URL | Skills / Packages |
|---|--------|--------|-----|-------------------|
| 1 | **AgriciDaniel / claude-obsidian** (Karpathy pattern · kepano foundation) | Agrici Daniel · pattern by Andrej Karpathy · foundation by kepano | [github.com/AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) · foundation: [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) | wiki, wiki-ingest, wiki-query, wiki-lint, wiki-fold, save, canvas, autoresearch, obsidian-markdown, obsidian-bases, defuddle |
| 2 | **PM Skills Marketplace** | Paweł Huryn (Product Compass) | [github.com/phuryn/pm-skills](https://github.com/phuryn/pm-skills) | pm-skills-main (68 skills, 9 plugins) |
| 3 | **Cowork Skills (YouTube)** | Brock | ["15 Claude Cowork Skills I Can't Live Without"](https://www.youtube.com/@brock) | 15-cowork-skills (15 skills) |
| 4 | **Custom / Personal** | @eniwetok | this repo | pm-agent |

---

## Group 1 — AgriciDaniel / claude-obsidian (Karpathy pattern)

> **Upstream:** [github.com/AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian)
> Pattern originated by Andrej Karpathy's LLM wiki concept — compile knowledge once into interconnected markdown instead of re-asking the same questions. Packaged as Claude Code skills by Agrici Daniel. Low-level Obsidian skills (obsidian-markdown, obsidian-bases, defuddle) draw from [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills).
> **Bundle:** [zips/claude-obsidian-skills.zip](zips/claude-obsidian-skills.zip) — installs all 11 skills at once.
> These skills form a cohesive **wiki stack** — they work best installed together.

| Skill | Description | Trigger |
|-------|-------------|---------|
| [wiki](skills/wiki/) | Core setup skill — scaffolds vault structure, routes to sub-skills | `/wiki`, `set up wiki`, `knowledge base` |
| [wiki-ingest](skills/wiki-ingest/) | Read a source (file or URL), extract entities and concepts, create/update wiki pages | `ingest`, `add this to the wiki`, `ingest this url` |
| [wiki-query](skills/wiki-query/) | Answer questions from the wiki; files good answers back as pages | `what do you know about`, `query:`, `search the wiki` |
| [wiki-lint](skills/wiki-lint/) | Health check — orphan pages, dead wikilinks, frontmatter gaps, empty sections | `lint`, `health check`, `wiki audit` |
| [wiki-fold](skills/wiki-fold/) | Roll up wiki log entries into extractive meta-pages | `fold the log`, `run wiki-fold`, `log rollup` |
| [save](skills/save/) | Save the current conversation or insight as a structured wiki note | `save this`, `/save`, `file this` |
| [canvas](skills/canvas/) | Visual layer — add images, text cards, PDFs, and notes to Obsidian canvas files | `/canvas`, `canvas new`, `add to canvas` |
| [autoresearch](skills/autoresearch/) | Autonomous iterative research loop; runs web searches and files findings into the wiki | `/autoresearch`, `research [topic]`, `deep dive into [topic]` |
| [obsidian-markdown](skills/obsidian-markdown/) | Reference for correct Obsidian Flavored Markdown syntax | `write obsidian note`, `obsidian syntax`, `wikilink` |
| [obsidian-bases](skills/obsidian-bases/) | Create and edit Obsidian Bases (.base files) — dynamic tables, card views, filters | `create a base`, `obsidian bases`, `database view` |
| [defuddle](skills/defuddle/) | Strip clutter from web pages before ingesting — saves 40-60% tokens | `defuddle`, `clean this page`, `strip this url` |

**Install all 11 skills at once (from bundle):**
```bash
cd ~/.claude/skills && unzip ~/Documents/Skills/zips/claude-obsidian-skills.zip -d . && mv claude-obsidian-bundle/skills/* . && rm -rf claude-obsidian-bundle
```

**Or install from upstream:**
```bash
claude plugin marketplace add AgriciDaniel/claude-obsidian
```

---

## Group 2 — PM Skills Marketplace

> **Upstream:** [github.com/phuryn/pm-skills](https://github.com/phuryn/pm-skills)
> Author: Paweł Huryn · [productcompass.pm](https://www.productcompass.pm)
> 68 PM skills and 42 chained workflows across 9 plugins. Companion project: [pm-brain](https://github.com/phuryn/pm-brain).

| Plugin | Skills | Description |
|--------|--------|-------------|
| pm-product-discovery | 13 skills | Ideation, experiments, assumption testing, feature prioritization, interview synthesis |
| pm-product-strategy | 12 skills | Vision, strategy canvas, lean canvas, SWOT, PESTLE, Ansoff Matrix, Porter's Five Forces, monetization |
| pm-execution | 16 skills | PRDs, user stories, OKRs, sprint plans, roadmaps, retros, stakeholder maps |
| pm-market-research | 7 skills | Competitor analysis, customer journeys, user personas, market sizing, sentiment analysis |
| pm-go-to-market | 6 skills | GTM strategy, ICP, competitive battlecard, growth loops, beachhead segment |
| pm-marketing-growth | 5 skills | North star metric, positioning, value props, product naming, marketing ideas |
| pm-data-analytics | 3 skills | A/B test analysis, cohort analysis, SQL query generation |
| pm-toolkit | 4 skills | NDA drafting, privacy policy, grammar check, resume review |
| pm-ai-shipping | 2 skills | Ship-check, security/perf audit for AI-built code |

**Source package:** [packages/pm-skills-main/](packages/pm-skills-main/) · [zips/pm-skills-main.zip](zips/pm-skills-main.zip)

**Install via Claude Code marketplace:**
```bash
claude plugin marketplace add phuryn/pm-skills
```

---

## Group 3 — Cowork Skills (Brock / YouTube)

> **Source:** Brock's YouTube video — *"15 Claude Cowork Skills I Can't Live Without... (steal them)"*
> Distributed as a Cowork `.plugin` file. Install via Cowork's plugin interface (not Claude Code CLI).

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

**Source package:** [packages/15-cowork-skills/](packages/15-cowork-skills/) · [zips/15-cowork-skills.zip](zips/15-cowork-skills.zip)

**Install:** Open Cowork → Plugin icon → Upload `.plugin` file from `zips/15-cowork-skills.zip`.

---

## Group 4 — Custom / Personal

> Skills built or adapted specifically for this setup. Source: this repo.

| Skill | Description | Trigger |
|-------|-------------|---------|
| [pm-agent](skills/pm-agent/) | Multi-product PM agent — orchestrates pm-skills plugins, writes weekly status reports and feedback rollups across a product portfolio | `/pm-agent`, `weekly PM run`, `produce status report for <product>` |

**Depends on:** pm-skills-main (Group 2) must be installed first.

**Install:**
```bash
cp -r skills/pm-agent ~/.claude/skills/
```

---

## Quick Install Reference

### Install a single skill (from source)
```bash
cp -r skills/<skill-name> ~/.claude/skills/
```

### Install a single skill (from zip)
```bash
cd ~/.claude/skills && unzip ~/Documents/Skills/zips/<skill-name>.zip
```

### Install the full wiki stack
```bash
cp -r skills/wiki skills/wiki-ingest skills/wiki-query skills/wiki-lint \
  skills/wiki-fold skills/save skills/canvas skills/autoresearch \
  skills/obsidian-markdown skills/obsidian-bases skills/defuddle ~/.claude/skills/
```

### Install everything (all individual skills)
```bash
cp -r skills/* ~/.claude/skills/
```

---

## Repository Structure

```
claude-skills-library/
├── README.md
├── skills/               # Individual skills — browse, customize, install
│   ├── autoresearch/     ← Group 1 (kepano/Karpathy)
│   ├── canvas/           ← Group 1
│   ├── defuddle/         ← Group 1
│   ├── obsidian-bases/   ← Group 1
│   ├── obsidian-markdown/← Group 1
│   ├── save/             ← Group 1
│   ├── wiki/             ← Group 1
│   ├── wiki-fold/        ← Group 1
│   ├── wiki-ingest/      ← Group 1
│   ├── wiki-lint/        ← Group 1
│   ├── wiki-query/       ← Group 1
│   └── pm-agent/         ← Group 4 (custom)
├── packages/             # Multi-skill bundles
│   ├── pm-skills-main/   ← Group 2 (phuryn/pm-skills)
│   └── 15-cowork-skills/ ← Group 3 (Brock/YouTube)
└── zips/                 # Archives for quick install
    ├── *.zip             # Individual skills (Groups 1 & 4)
    ├── pm-skills-main.zip# Group 2
    └── 15-cowork-skills.zip # Group 3
```
