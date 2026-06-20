# Claude Skills Library

A personal collection of Claude Code skills for evaluation and use. Each skill is available as raw source files (for browsing and customization) and as a `.zip` (for quick install).

## Skills

| Skill | Description | Trigger |
|-------|-------------|---------|
| [autoresearch](skills/autoresearch/) | Autonomous iterative research loop — runs web searches, fetches sources, synthesizes findings, and files everything into the wiki | `/autoresearch`, `research [topic]`, `deep dive into [topic]` |
| [canvas](skills/canvas/) | Visual layer of the wiki — add images, text cards, PDFs, and notes to Obsidian canvas files | `/canvas`, `canvas new`, `add to canvas` |
| [defuddle](skills/defuddle/) | Strip clutter from web pages before ingesting — removes ads, nav, footers, saves 40-60% tokens | `defuddle`, `clean this page`, `strip this url` |
| [obsidian-bases](skills/obsidian-bases/) | Create and edit Obsidian Bases (.base files) — dynamic tables, card views, filters, and formulas over vault notes | `create a base`, `obsidian bases`, `database view` |
| [obsidian-markdown](skills/obsidian-markdown/) | Write correct Obsidian Flavored Markdown — wikilinks, embeds, callouts, properties, tags | `write obsidian note`, `obsidian syntax`, `wikilink` |
| [pm-agent](skills/pm-agent/) | Multi-product PM agent — runs PM operations across a portfolio, writes status reports, roadmap updates, and feedback rollups | `/pm-agent`, `weekly PM run`, `produce PM reports` |
| [save](skills/save/) | Save the current conversation or insight into the Obsidian wiki as a structured note | `save this`, `/save`, `file this`, `save to wiki` |
| [wiki](skills/wiki/) | Claude + Obsidian knowledge companion — sets up a persistent wiki vault and routes to sub-skills | `set up wiki`, `/wiki`, `scaffold vault`, `knowledge base` |
| [wiki-fold](skills/wiki-fold/) | Roll up wiki log entries into meta-pages (extractive summaries, no invention) | `fold the log`, `run wiki-fold`, `log rollup` |
| [wiki-ingest](skills/wiki-ingest/) | Ingest sources into the wiki — reads a source, extracts entities and concepts, creates or updates pages | `ingest`, `add this to the wiki`, `ingest this url` |
| [wiki-lint](skills/wiki-lint/) | Health check the wiki — finds orphan pages, dead wikilinks, frontmatter gaps, and empty sections | `lint`, `health check`, `wiki audit` |
| [wiki-query](skills/wiki-query/) | Answer questions using the wiki — reads hot cache, index, then pages; files good answers back | `what do you know about`, `query:`, `search the wiki` |

## Multi-skill Packages

Larger bundles of skills installed as a unit:

| Package | Description |
|---------|-------------|
| [15-cowork-skills](packages/15-cowork-skills/) | 15 Cowork skills: Slide Deck Builder, Budget Dashboard, Email Drafter, Receipt Scanner, and more |
| [pm-skills-main](packages/pm-skills-main/) | PM Skills Marketplace — 68 PM skills and 42 chained workflows across 9 plugins (discovery, strategy, execution, launch, growth) |

## Repository Structure

```
claude-skills-library/
├── README.md
├── skills/               # Individual skills — browse, customize, then install
│   ├── autoresearch/
│   ├── canvas/
│   ├── defuddle/
│   ├── obsidian-bases/
│   ├── obsidian-markdown/
│   ├── pm-agent/
│   ├── save/
│   ├── wiki/
│   ├── wiki-fold/
│   ├── wiki-ingest/
│   ├── wiki-lint/
│   └── wiki-query/
├── packages/             # Multi-skill bundles
│   ├── 15-cowork-skills/
│   └── pm-skills-main/
└── zips/                 # Pre-packaged archives for quick install
    ├── autoresearch.zip
    ├── canvas.zip
    ├── defuddle.zip
    ├── obsidian-bases.zip
    ├── obsidian-markdown.zip
    ├── pm-agent.zip
    ├── save.zip
    ├── wiki.zip
    ├── wiki-fold.zip
    ├── wiki-ingest.zip
    ├── wiki-lint.zip
    ├── wiki-query.zip
    ├── 15-cowork-skills.zip
    └── pm-skills-main.zip
```

## Installing a Skill

### Option A — From zip (quick)

```bash
cd ~/.claude/skills
unzip ~/path/to/zips/<skill-name>.zip
```

### Option B — From source (recommended for customization)

```bash
cp -r skills/<skill-name> ~/.claude/skills/
```

After installing, Claude Code will detect the skill automatically on the next session start. Verify it's active by checking the skill list in your session.

### Install all skills at once

```bash
# From zips
cd ~/.claude/skills && for z in ~/path/to/zips/*.zip; do unzip "$z"; done

# From source
cp -r skills/* ~/.claude/skills/
```

## Notes

- Skills live in `~/.claude/skills/` — each subfolder is one skill
- Each skill is a `SKILL.md` file (the instruction prompt) plus optional `references/` and `scripts/`
- The `pm-agent` skill has the most dependencies — see [skills/pm-agent/README.md](skills/pm-agent/README.md) for setup
- `wiki`, `wiki-ingest`, `wiki-query`, `wiki-lint`, `wiki-fold`, `save`, `canvas`, and `autoresearch` form a cohesive **wiki stack** that works best together
