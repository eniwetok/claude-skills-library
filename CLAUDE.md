# CLAUDE.md — claude-skills-library

This repo is a personal library of Claude Code skills, organized by upstream source. Use this file to understand the structure, conventions, and how to add or update skills.

## What lives here

```
claude-skills-library/
├── CLAUDE.md          ← this file
├── README.md          ← human-facing index (grouped by origin)
├── skills/            ← individual skills, one subfolder per skill
├── packages/          ← multi-skill bundles from upstream repos
└── zips/              ← installable archives (one per skill or package)
```

## Skill groups and their upstreams

| Group | Upstream | Install command |
|-------|----------|-----------------|
| **1 — claude-obsidian** (wiki stack, Karpathy pattern) | [AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) | `claude plugin marketplace add AgriciDaniel/claude-obsidian` |
| **2 — pm-skills** | [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | `claude plugin marketplace add phuryn/pm-skills` |
| **3 — 15-cowork-skills** | Brock / YouTube | Upload zip via Cowork plugin UI |
| **4 — custom** | this repo | `cp -r skills/<name> ~/.claude/skills/` |

## How to add a new skill

1. Copy the skill folder into `skills/<name>/` (individual) or `packages/<bundle>/` (multi-skill bundle)
2. Create a zip: `cd ~/.claude/skills && zip -r ~/Documents/Skills/zips/<name>.zip <name>/`
3. Add a row to the correct group table in `README.md`
4. Update the Sources table at the top of `README.md` if it's a new upstream
5. Commit: `git add . && git commit -m "Add <name> skill from <source>"`
6. Push: `git push`

## How to update skills from upstream

Run the `/update-skills-library` skill from any Claude Code session in this directory. It fetches the latest from each upstream source, syncs local files, rebuilds zips, updates README, and pushes.

Or run the weekly scheduled task manually from the Claude Code sidebar → Scheduled → `skills-library-upstream-check` → Run now.

## Bundle format

Each zip in `zips/` unpacks to a folder containing:
- `skills/` — skill subfolders ready to copy into `~/.claude/skills/`
- `plugin.json` — metadata (name, version, author, upstream URL)
- `INSTALL.md` — install instructions

Quick install from any bundle:
```bash
cd ~/.claude/skills && unzip ~/Documents/Skills/zips/<bundle>.zip -d . && mv <bundle>/skills/* . && rm -rf <bundle>
```

## Scheduled maintenance

A weekly task (`skills-library-upstream-check`) runs every Monday at 9am. It:
1. Checks kepano/obsidian-skills and phuryn/pm-skills for new releases
2. Updates README if skill lists or versions changed
3. Commits and pushes automatically

Manage it: Claude Code sidebar → Scheduled.

## Local skills (not tracked here)

The following skills live in `~/.claude/skills/` locally but are NOT from any of the upstream groups:
- `pptx-from-template` — brand-faithful PowerPoint deck builder (custom, Group 4)
- `update-skills-library` — updates this repo from upstream sources (custom, Group 4)
