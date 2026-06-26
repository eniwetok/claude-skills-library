# CLAUDE.md — claude-skills-library

Personal library of Claude Code skills, plugins, and resources at `~/Documents/Skills` (GitHub: `eniwetok/claude-skills-library`).
Full catalog with install status: [catalog/CATALOG.md](catalog/CATALOG.md)

---

## Structure

```
claude-skills-library/
├── CLAUDE.md                     ← this file (repo conventions)
├── README.md                     ← human-facing index grouped by origin
├── catalog/
│   ├── CATALOG.md                ← full inventory: all skills, plugins, connectors, status
│   └── awesome-claude-skills.md  ← community curated index for reference (travisvn)
├── skills/                       ← individual skills, one subfolder per skill
├── packages/                     ← multi-skill bundles from upstream repos
└── zips/                         ← installable archives (one per skill or package)
```

---

## Skill groups and their upstreams

| Group | Upstream | Local path | Install command |
|-------|----------|------------|-----------------|
| **1 — claude-obsidian** (wiki stack) | [AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) | `skills/wiki*`, `skills/save`, `skills/canvas`, etc. | `claude plugin marketplace add AgriciDaniel/claude-obsidian` |
| **2 — pm-skills** | [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | `packages/pm-skills-main/` | `claude plugin marketplace add phuryn/pm-skills` |
| **3 — 15-cowork-skills** | Brock / YouTube | `packages/15-cowork-skills/` | Cowork UI → Upload zip |
| **4 — anthropics/skills** | [anthropics/skills](https://github.com/anthropics/skills) | `packages/anthropics-skills/` | `claude plugin marketplace add anthropics/skills` |
| **5 — knowledge-work-plugins** | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | `packages/knowledge-work-plugins/` | `claude plugin marketplace add anthropics/knowledge-work-plugins` |
| **6 — custom** | this repo | `skills/pm-agent/` | `cp -r skills/<name> ~/.claude/skills/` |
| **7 — superpowers** | [obra/superpowers](https://github.com/obra/superpowers) | `packages/superpowers/` | `cp -r packages/superpowers/skills/* ~/.claude/skills/` |
| **8 — ruflo** | [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | `packages/ruflo/` | `cp -r packages/ruflo/.agents/skills/* ~/.claude/skills/` |
| **9 — open-design** | [nexu-io/open-design](https://github.com/nexu-io/open-design) | `packages/open-design/` | `cp -r packages/open-design/skills/* ~/.claude/skills/ && cp -r packages/open-design/design-templates/* ~/.claude/skills/` |

---

## How to add a new skill

1. Copy the skill folder into `skills/<name>/` (individual) or `packages/<bundle>/` (multi-skill bundle)
2. Create a zip: `cd ~/.claude/skills && zip -r ~/Documents/Skills/zips/<name>.zip <name>/`
3. Add a row to the correct group in `README.md`
4. Add an entry to `catalog/CATALOG.md` with status
5. Update the Sources table in `README.md` if it's a new upstream
6. Commit and push: `git add . && git commit -m "Add <name> from <source>" && git push`

---

## How to update skills from upstream

Run `/update-skills-library` from any Claude Code session in this directory. It:
1. Clones each upstream repo to `/tmp`
2. Diffs against local copies
3. Updates changed skill files
4. Rebuilds affected zips
5. Updates README and CATALOG
6. Commits and pushes

Or trigger the weekly scheduled task: Claude Code sidebar → Scheduled → `skills-library-upstream-check` → Run now.

Upstreams to check:
- `https://github.com/AgriciDaniel/claude-obsidian`
- `https://github.com/phuryn/pm-skills`
- `https://github.com/anthropics/skills`
- `https://github.com/anthropics/knowledge-work-plugins`
- `https://github.com/obra/superpowers`
- `https://github.com/ruvnet/ruflo`
- `https://github.com/nexu-io/open-design`

---

## Bundle format

Each zip in `zips/` unpacks to a folder with:
- `skills/` — skill subfolders ready to copy into `~/.claude/skills/`
- `plugin.json` — metadata (name, version, author, upstream URL)
- `INSTALL.md` — install instructions

Quick install from any bundle:
```bash
cd ~/.claude/skills && unzip ~/Documents/Skills/zips/<bundle>.zip -d . && mv <bundle>/skills/* . && rm -rf <bundle>
```

---

## Scheduled maintenance

Weekly task `skills-library-upstream-check` runs every Monday at 9am:
1. Checks Groups 1, 2, 4, 5 for new releases or added skills
2. Updates README and CATALOG if anything changed
3. Commits and pushes automatically

Manage: Claude Code sidebar → Scheduled.

---

## Local-only skills (in `~/.claude/skills/` but not in `skills/` folder here)

| Skill | Description | Group |
|-------|-------------|-------|
| `pptx-from-template` | Brand-faithful PowerPoint builder from existing template | 6 (custom) |
| `update-skills-library` | Syncs this repo from all upstream sources | 6 (custom) |

---

## Status legend (used in CATALOG.md)

| Symbol | Meaning |
|--------|---------|
| ✅ installed | Active in `~/.claude/skills/` or `~/.claude/plugins/` |
| 📦 in package | In `packages/`, not yet installed |
| 📁 in skills/ | In `skills/` here, not yet copied to `~/.claude/skills/` |
| session only | Available in current session, not persistently configured |
| 🔲 not downloaded | Known resource, not yet pulled into this repo |
