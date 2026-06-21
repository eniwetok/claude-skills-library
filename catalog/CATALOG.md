# Claude Resource Catalog

Complete inventory of known Claude skills, plugins, connectors, and resources.
Last updated: 2026-06-20. Status column reflects what's in this repo.

---

## Skills

### Official — anthropics/skills
Source: https://github.com/anthropics/skills
Local copy: `packages/anthropics-skills/`
Install: `claude plugin marketplace add anthropics/skills`

| Skill | Description | Status |
|-------|-------------|--------|
| docx | Create/edit/analyze Word docs, tracked changes, comments | 📦 in package |
| pdf | Extract text/tables, create/merge/split PDFs, forms | 📦 in package |
| pptx | Create/edit PowerPoint; layouts, templates, charts | 📦 in package (also: local pptx-from-template) |
| xlsx | Create/edit Excel; formulas, formatting, data viz | 📦 in package |
| algorithmic-art | Generative art with p5.js, seeded randomness, flow fields | 📦 in package |
| canvas-design | Visual art in .png and .pdf using design philosophy | 📦 in package |
| slack-gif-creator | Animated GIFs optimized for Slack size constraints | 📦 in package |
| frontend-design | Avoid AI-slop aesthetics; bold design for React/Tailwind | 📦 in package |
| web-artifacts-builder | Complex claude.ai HTML artifacts with React/Tailwind/shadcn | 📦 in package |
| mcp-builder | Guide for building high-quality MCP servers | 📦 in package |
| webapp-testing | Test web apps using Playwright | 📦 in package |
| brand-guidelines | Apply official brand colors and typography | 📦 in package |
| internal-comms | Write status reports, newsletters, FAQs | 📦 in package |
| skill-creator | Interactive guided skill builder | 📦 in package |
| claude-api | Claude API reference | 📦 in package |
| doc-coauthoring | Document co-authoring workflows | 📦 in package |
| theme-factory | Theme generation | 📦 in package |

---

### Group 1 — AgriciDaniel/claude-obsidian (Karpathy pattern)
Source: https://github.com/AgriciDaniel/claude-obsidian
Local copy: `skills/` (individual) + `zips/claude-obsidian-skills.zip`
Install: `claude plugin marketplace add AgriciDaniel/claude-obsidian`

| Skill | Description | Status |
|-------|-------------|--------|
| wiki | Core orchestrator — scaffolds vault, routes sub-skills | ✅ installed + in skills/ |
| wiki-ingest | Read a source, extract entities, create/update pages | ✅ installed + in skills/ |
| wiki-query | Answer questions from vault; files good answers back | ✅ installed + in skills/ |
| wiki-lint | Health check — orphans, dead links, frontmatter gaps | ✅ installed + in skills/ |
| wiki-fold | Roll up log entries into extractive meta-pages (DragonScale) | ✅ installed + in skills/ |
| save | Save conversation/insight as structured wiki note | ✅ installed + in skills/ |
| canvas | Visual layer — Obsidian canvas files | ✅ installed + in skills/ |
| autoresearch | Autonomous research loop → wiki | ✅ installed + in skills/ |
| obsidian-markdown | Reference for Obsidian Flavored Markdown syntax | ✅ installed + in skills/ |
| obsidian-bases | Create/edit .base files — dynamic tables, card views | ✅ installed + in skills/ |
| defuddle | Strip web page clutter before ingesting | ✅ installed + in skills/ |
| think | 10-principle reasoning framework | 📁 in skills/ (not installed) |
| wiki-cli | Obsidian CLI interaction | 📁 in skills/ (not installed) |
| wiki-mode | Switch between wiki modes (LYT/PARA/Zettelkasten) | 📁 in skills/ (not installed) |
| wiki-retrieve | Hybrid retrieval from vault | 📁 in skills/ (not installed) |

---

### Group 2 — phuryn/pm-skills (Paweł Huryn)
Source: https://github.com/phuryn/pm-skills
Local copy: `packages/pm-skills-main/` + `zips/pm-skills-bundle.zip`
Install: `claude plugin marketplace add phuryn/pm-skills`

| Plugin | Skills | Status |
|--------|--------|--------|
| pm-product-discovery | 13 skills | ✅ installed plugin |
| pm-product-strategy | 12 skills | ✅ installed plugin |
| pm-execution | 16 skills | ✅ installed plugin |
| pm-market-research | 7 skills | ✅ installed plugin |
| pm-go-to-market | 6 skills | ✅ installed plugin |
| pm-marketing-growth | 5 skills | ✅ installed plugin |
| pm-data-analytics | 3 skills | ✅ installed plugin |
| pm-toolkit | 4 skills | ✅ installed plugin |
| pm-ai-shipping | 2 skills | 📦 in package (not yet installed) |

---

### Group 3 — 15-cowork-skills (Brock/YouTube)
Source: YouTube — "15 Claude Cowork Skills I Can't Live Without"
Local copy: `packages/15-cowork-skills/` + `zips/cowork-skills-bundle.zip`
Install: Cowork UI → Plugin icon → Upload zip

| Skill | Status |
|-------|--------|
| Slide Deck Builder | 📦 in package |
| Budget Dashboard | 📦 in package |
| Email Drafter | 📦 in package |
| Receipt Scanner | 📦 in package |
| Explainer Graphic | 📦 in package |
| Visual Page Builder | 📦 in package |
| Invoice Generator | 📦 in package |
| Contract Reviewer | 📦 in package |
| Workflow Visualizer | 📦 in package |
| Morning Briefing | 📦 in package |
| Quick Research | 📦 in package |
| Animated Website | 📦 in package |
| Learning Path Generator | 📦 in package |
| Customize | 📦 in package |
| Difficult Conversation Prep | 📦 in package |

---

### Group 4 — anthropics/knowledge-work-plugins
Source: https://github.com/anthropics/knowledge-work-plugins
Local copy: `packages/knowledge-work-plugins/`
Install: `claude plugin marketplace add anthropics/knowledge-work-plugins`

| Plugin | Description | Status |
|--------|-------------|--------|
| productivity | General productivity workflows | 📦 in package |
| product-management | PM-focused skills (companion to pm-skills) | 📦 in package |
| sales | Sales workflows and CRM | 📦 in package |
| marketing | Marketing campaign and copy skills | 📦 in package |
| customer-support | Support ticket and response skills | 📦 in package |
| engineering | Software engineering workflows | 📦 in package |
| finance | Financial analysis and reporting | 📦 in package |
| legal | Contract, policy, compliance skills | 📦 in package |
| human-resources | HR workflows and templates | 📦 in package |
| operations | Ops and process management | 📦 in package |
| enterprise-search | Search across org knowledge | 📦 in package |
| data | Data analysis and transformation | 📦 in package |
| design | Design workflows | 📦 in package |
| bio-research | Biomedical research skills | 📦 in package |
| cowork-plugin-management | Manage Cowork plugins | 📦 in package |
| small-business | SMB-focused skills | 📦 in package |
| pdf-viewer | PDF reading and annotation | 📦 in package |

---

### Group 5 — Custom / Personal
Source: this repo (eniwetok/claude-skills-library)

| Skill | Description | Status |
|-------|-------------|--------|
| pm-agent | Multi-product PM agent (wraps pm-skills) | ✅ installed + in skills/ |
| pptx-from-template | Brand-faithful PowerPoint builder | ✅ installed locally |
| update-skills-library | Sync this repo from upstream | ✅ installed locally |

---

## Plugins (Cowork)

Installed via Cowork UI. `~/.claude/plugins/`

| Plugin | Marketplace | Version | Status |
|--------|-------------|---------|--------|
| pm-product-discovery | phuryn/pm-skills | 1.0.1 | ✅ installed |
| pm-product-strategy | phuryn/pm-skills | 1.0.1 | ✅ installed |
| pm-execution | phuryn/pm-skills | 1.0.1 | ✅ installed |
| pm-market-research | phuryn/pm-skills | 1.0.1 | ✅ installed |
| pm-go-to-market | phuryn/pm-skills | 1.0.1 | ✅ installed |
| pm-marketing-growth | phuryn/pm-skills | 1.0.1 | ✅ installed |
| pm-data-analytics | phuryn/pm-skills | 1.0.1 | ✅ installed |
| pm-toolkit | phuryn/pm-skills | 1.0.1 | ✅ installed |

---

## Connectors (MCP)

MCP servers accessible in Claude Code this session. None installed globally (settings.json mcpServers: {}).
Session connectors seen: Gmail, Gamma, Granola, Monday.com, computer-use, Claude Preview, Claude in Chrome, ccd-session, ccd-directory, scheduled-tasks, mcp-registry.

| Connector | Type | Status |
|-----------|------|--------|
| computer-use | Desktop control | session only |
| Claude in Chrome | Browser control | session only |
| Gmail (0844d5fd) | Email read/draft/label | session only |
| Gamma (46b4b535) | Presentation generation | session only |
| Granola (d1fcce25) | Meeting transcripts | session only |
| Monday.com | Project management | session only |
| scheduled-tasks | Cron scheduler | session only |
| mcp-registry | Connector discovery | session only |
| ccd-session | Session management | session only |

---

## Notable Community Resources (not yet downloaded)

| Resource | URL | What it has |
|----------|-----|-------------|
| obra/superpowers | https://github.com/obra/superpowers | 20+ skills: TDD, debugging, /brainstorm, /write-plan |
| daymade/claude-code-skills | https://github.com/daymade/claude-code-skills | 64+ skills: GitHub, audio, QA, DevOps |
| alirezarezvani/claude-skills | https://github.com/alirezarezvani/claude-skills | 345 skills across 17 domains |
| Trail of Bits Security Skills | https://github.com/trailofbits/skills | Security: CodeQL, Semgrep, auditing |
| shadcn/ui skill | https://ui.shadcn.com/docs/skills | shadcn component context |
| Expo skills | https://github.com/expo/skills | Official Expo dev skills |
| ios-simulator-skill | https://github.com/conorluddy/ios-simulator-skill | iOS app building/testing |
| TonsOfSkills | https://github.com/jeremylongshore/claude-code-plugins-plus-skills | 2810 skills, 425 plugins |

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ installed | In `~/.claude/skills/` or `~/.claude/plugins/`, active in Claude Code |
| 📦 in package | In `packages/` folder, not yet installed |
| 📁 in skills/ | In `skills/` folder in this repo, not yet copied to `~/.claude/skills/` |
| session only | Available in current Claude Code session, not persistently configured |
