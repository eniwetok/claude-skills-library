---
name: cowork-package
description: >
  Package installed Claude Code skills into Cowork-ready zips. Cowork accepts only
  ONE skill per zip — a multi-skill bundle is rejected. Use when: "install X into
  Cowork", "register skill in Cowork", "add these skills to Cowork", "package for
  Cowork", "make a Cowork zip", or when a Cowork upload fails with a SKILL.md error.
---

# Package Skills for Cowork

Cowork does not install skills from a folder the way Claude Code does. It only accepts
a **zip uploaded through its own screen**, and the zip must contain **exactly one
`SKILL.md`**.

## The rule that breaks people

> `Zip must contain exactly one SKILL.md file. Currently there are 68.`

This is the error you get from an all-in-one bundle. **Cowork is one-skill-per-zip.**
A `skills/` folder with many skills — the Claude Code plugin/bundle layout — is rejected.
Do not try to be clever and bundle; make N zips.

## Required zip shape

```
<skill-name>/
  SKILL.md          ← exactly one, at the top of the skill folder
  references/...    ← optional support files are fine
  agents/...        ← optional
```

The skill **folder** sits at the zip root. Support files do not count against the
one-SKILL.md rule — only `SKILL.md` files do.

## Steps

1. **Pick the skills.** If asked for a large pack, recommend a curated shortlist
   (~12 max) rather than all of them — every skill is a separate manual upload, and
   most packs have a long tail the user will never touch.

2. **Build one zip per skill**, verifying each:

```bash
OUT=~/Documents/Skills/zips/<group>-cowork
mkdir -p "$OUT"; STAGE=$(mktemp -d)

for s in <skill-1> <skill-2> ...; do
  cp -R ~/.claude/skills/$s "$STAGE/$s"
  find "$STAGE/$s" -name '.DS_Store' -delete
  (cd "$STAGE" && zip -r -q -X "$OUT/$s.zip" "$s")
  c=$(unzip -l "$OUT/$s.zip" | grep -c "SKILL.md")
  [ "$c" -eq 1 ] && echo "  ✓ $s.zip" || echo "  ✗ $s.zip — $c SKILL.md files"
done
rm -rf "$STAGE"
```

3. **Verify every zip has exactly one `SKILL.md`** before handing them over. Never
   report success without this check — a bad zip only fails later, in Cowork's UI,
   where the user has to discover it.

4. **Skip skills that make no sense in Cowork:**
   - *Signpost/pointer skills* (files that just say "go fetch the real thing upstream")
   - *Router skills* (Cowork has no need for a second orchestrator)
   - Anything depending on local hooks, MCP servers, or the filesystem

5. **Save to the library** under `zips/<group>-cowork/`, commit, and push.

6. **Open the folder** so the user can upload:
   ```bash
   open ~/Documents/Skills/zips/<group>-cowork/
   ```

## The upload itself is manual

Cowork installs through its own screen — there is no command-line path. Give the user
the folder and a numbered list of the files, each with a plain-English line on what it
does.

Driving the upload with desktop control needs macOS **Screen Recording** permission
granted to Claude. Without it, screen tools fail outright. Even with it, N repetitive
file-dialog uploads are slow and fragile — for a handful of files, tell the user
honestly that doing it by hand is usually faster.

## Done already

| Group | Folder | Count |
|-------|--------|-------|
| PM skills | `zips/pm-cowork/` | 68 (12 shortlisted) |
| ibelick UI skills | `zips/ui-cowork/` | 5 |
