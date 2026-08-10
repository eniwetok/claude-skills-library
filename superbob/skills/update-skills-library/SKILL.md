---
name: update-skills-library
description: >
  Sync the local claude-skills-library repo with upstream sources. Fetches latest releases
  from AgriciDaniel/claude-obsidian and phuryn/pm-skills, updates local skill files,
  rebuilds bundle zips, updates README.md with any new skills or version changes, and
  pushes to GitHub. Triggers on: "update skills library", "sync skills from upstream",
  "pull latest skills", "update my skills repo", "refresh skills", "/update-skills-library".
allowed-tools: Read Write Edit Bash Glob Grep WebFetch WebSearch
---

# update-skills-library: Sync Skills Repo from Upstream

Keep ~/Documents/Skills (github.com/eniwetok/claude-skills-library) current with its upstream sources.

## Repo layout

```
~/Documents/Skills/
├── CLAUDE.md
├── README.md
├── skills/        ← individual skill folders (Groups 1 & 4)
├── packages/      ← multi-skill bundles (Groups 2 & 3)
└── zips/          ← installable archives
```

## Upstream sources

| Group | Upstream | Local path |
|-------|----------|------------|
| 1 — wiki stack | github.com/AgriciDaniel/claude-obsidian | skills/{wiki,wiki-ingest,wiki-query,wiki-lint,wiki-fold,save,canvas,autoresearch,obsidian-markdown,obsidian-bases,defuddle}/ |
| 2 — pm-skills | github.com/phuryn/pm-skills | packages/pm-skills-main/ |
| 3 — cowork | Brock/YouTube (manual) | packages/15-cowork-skills/ |
| 4 — custom | this repo | skills/pm-agent/, skills/pptx-from-template/, skills/update-skills-library/ |

## Steps

### 1. Check upstream for changes

For each upstream repo, fetch its releases page and compare to what's in the README Sources table:
- `https://github.com/AgriciDaniel/claude-obsidian/releases`
- `https://github.com/phuryn/pm-skills/releases`

Note: new skills added, skills renamed or removed, version bumps.

### 2. Pull updated files from upstream

If Group 1 (claude-obsidian) has new skill files or changed SKILL.md content:
```bash
# Clone latest to a temp dir and diff
git clone --depth 1 https://github.com/AgriciDaniel/claude-obsidian.git /tmp/claude-obsidian-latest
# Compare and copy changed skill dirs
for skill in wiki wiki-ingest wiki-query wiki-lint wiki-fold save canvas autoresearch obsidian-markdown obsidian-bases defuddle; do
  diff -rq /tmp/claude-obsidian-latest/skills/$skill ~/Documents/Skills/skills/$skill 2>/dev/null && echo "$skill: unchanged" || {
    echo "$skill: UPDATED"
    cp -r /tmp/claude-obsidian-latest/skills/$skill ~/Documents/Skills/skills/
  }
done
```

If Group 2 (pm-skills) has changes:
```bash
git clone --depth 1 https://github.com/phuryn/pm-skills.git /tmp/pm-skills-latest
diff -rq /tmp/pm-skills-latest ~/Documents/Skills/packages/pm-skills-main/ --exclude=".git" 2>/dev/null
# Copy changed plugins only
```

### 3. Rebuild zips for any changed groups

After updating source files, rebuild the affected bundle zips:

**Group 1 bundle:**
```bash
cd /tmp && rm -rf claude-obsidian-bundle && mkdir -p claude-obsidian-bundle/skills
cp -r ~/Documents/Skills/skills/{wiki,wiki-ingest,wiki-query,wiki-lint,wiki-fold,save,canvas,autoresearch,obsidian-markdown,obsidian-bases,defuddle} claude-obsidian-bundle/skills/
cp ~/Documents/Skills/zips/claude-obsidian-skills.zip.plugin.json claude-obsidian-bundle/plugin.json 2>/dev/null || true
zip -r ~/Documents/Skills/zips/claude-obsidian-skills.zip claude-obsidian-bundle/
```

**Group 2 bundle:**
```bash
cd /tmp && rm -rf pm-skills-bundle && mkdir pm-skills-bundle
cp -r ~/Documents/Skills/packages/pm-skills-main pm-skills-bundle/
zip -r ~/Documents/Skills/zips/pm-skills-bundle.zip pm-skills-bundle/ -x "*.DS_Store" -x "*.git*"
```

Also rebuild individual skill zips for any changed skills:
```bash
cd ~/.claude/skills && zip -r ~/Documents/Skills/zips/<skill-name>.zip <skill-name>/
```

### 4. Update README.md

If any of these changed, update the relevant section of ~/Documents/Skills/README.md:
- New skills → add rows to the group's skill table
- Removed skills → remove rows and their zip references
- Version bumps → update the Sources table
- New upstream URL → update the group header

Keep the 4-group structure intact. Do not invent changes — only update what you observed from fetched pages.

### 5. Commit and push

```bash
cd ~/Documents/Skills
git add .
git commit -m "Sync upstream: <summary of what changed> $(date +%Y-%m-%d)"
git push
```

### 6. Report

Print a summary:
- Which upstreams were checked
- Which skills changed (or "no changes found")
- What was updated in the README
- Whether a push succeeded

## Constraints

- Never modify custom skills (Group 4: pm-agent, pptx-from-template, update-skills-library)
- Flag upstream breaking changes (removed skills, renamed skills) for manual review before deleting local files
- If a clone fails (network issue, auth), report it and skip that group
- Do not push if there are no actual changes
