#!/usr/bin/env bash
# Build the Bob skills package (dist/bob-skills-package.zip) that the SuperBob .vsix ships.
# Reads the skills library (SB_LIBRARY) as input; writes into the extension (SB_ROOT).
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config.sh"
REPO="$SB_ROOT"          # SuperBob extension root (bob/, vsix/, dist/ live here)
LIB="$SB_LIBRARY"        # the skills library this extension packages
OUT="$SB_DIST"
STAGE="$(mktemp -d)/skills-package"

# GATE: refuse to build if the library has a broken reference. A mode or the
# router pointing at a missing skill silently breaks lean mode, so it must never ship.
LINT="$LIB/skills/skill-library-lint/scripts/lint.py"
if [ -f "$LINT" ]; then
  echo "Running skill-library-lint gate…"
  if ! python3 "$LINT"; then
    echo "ABORT: skill-library-lint failed — fix the broken references above before building." >&2
    exit 1
  fi
else
  echo "WARN: skill-library-lint not found; skipping integrity gate." >&2
fi
# EXCLUDED from the shareable package for licensing compliance:
#   AGPL (SocratiCode); source-available (Anthropic docx/pdf/pptx/xlsx);
#   unlicensed (15-cowork-skills, from a video); no formal license (pablo obsidian-cli).
#   mission-control is target-specific (shipped via meta/).
#   Obsidian / personal-knowledge-base skills are intentionally NOT shipped —
#   users manage their own Obsidian setup; SuperBob does not touch it.
EXCLUDE=(mission-control \
  codebase-exploration codebase-management \
  docx pdf pptx xlsx \
  wiki wiki-cli wiki-fold wiki-ingest wiki-lint wiki-mode wiki-query wiki-retrieve \
  obsidian-cli obsidian-markdown obsidian-bases \
  save autoresearch canvas defuddle think memory-gc \
  animated-website budget-dashboard contract-reviewer customize difficult-conversation-prep \
  email-drafter explainer-graphic invoice-generator learning-path-generator morning-briefing \
  quick-research receipt-scanner slide-deck-builder visual-page-builder workflow-visualizer)

mkdir -p "$STAGE/skills" "$STAGE/profiles" "$STAGE/meta" "$STAGE/commands" "$STAGE/agents" "$OUT"

while IFS= read -r f; do
  d="$(dirname "$f")"; name="$(basename "$d")"
  for x in "${EXCLUDE[@]}"; do [ "$name" = "$x" ] && continue 2; done
  rsync -a --exclude '.DS_Store' "$d"/ "$STAGE/skills/$name"/ 2>/dev/null || true
done < <(find "$LIB/packages" "$LIB/skills" -name SKILL.md 2>/dev/null)

cp "$REPO/bob/meta/mission-control.bob.md" "$STAGE/meta/"

cp "$REPO"/bob/profiles/*.txt "$STAGE/profiles/"
cp "$REPO"/bob/profiles/_meta.json "$STAGE/profiles/" 2>/dev/null || true
cp "$REPO"/bob/profiles/_guides.json "$STAGE/profiles/" 2>/dev/null || true
cp "$REPO"/bob/profiles/_prereqs.json "$STAGE/profiles/" 2>/dev/null || true
cp "$REPO"/bob/profiles/_resources.json "$STAGE/profiles/" 2>/dev/null || true
cp "$REPO"/bob/profiles/_agents.json "$STAGE/profiles/" 2>/dev/null || true
cp "$REPO"/bob/agents/*.md "$STAGE/agents/" 2>/dev/null || true
node "$REPO/bob/gen-provenance.js" "$LIB" "$STAGE/profiles/_provenance.json" 2>/dev/null || true
cp "$REPO"/bob/commands/*.md "$STAGE/commands/" 2>/dev/null || true
cp "$REPO/bob/bob-profile"          "$STAGE/bob-profile"
cp "$REPO/bob/package-install.sh"   "$STAGE/install.sh"
cp "$REPO/bob/BOB-INSTALL-INSTRUCTIONS.md" "$STAGE/README.md"
cp "$REPO/bob/LICENSES.md"          "$STAGE/LICENSES.md"
chmod +x "$STAGE/bob-profile" "$STAGE/install.sh"

cd "$(dirname "$STAGE")"
mv skills-package bob-skills-package
rm -f "$OUT/bob-skills-package.zip"
zip -r -q -X "$OUT/bob-skills-package.zip" bob-skills-package -x '*.DS_Store'
echo "Built: $OUT/bob-skills-package.zip ($(du -h "$OUT/bob-skills-package.zip" | cut -f1))"
echo "Skills: $(ls -1 bob-skills-package/skills | wc -l | tr -d ' ') (AGPL + mission-control excluded from skills/; meta variants shipped separately)"
rm -rf "$(dirname "$STAGE")"
