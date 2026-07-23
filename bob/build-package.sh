#!/usr/bin/env bash
# Build dist/bob-skills-package.zip — installs into IBM Bob and/or Claude Code.
# Excludes AGPL skills. Ships both mission-control variants (Bob vs Claude Code).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$REPO/dist"
STAGE="$(mktemp -d)/skills-package"
# EXCLUDED from the shareable package for licensing compliance:
#   AGPL (SocratiCode); source-available (Anthropic docx/pdf/pptx/xlsx);
#   unlicensed (15-cowork-skills, from a video); no formal license (pablo obsidian-cli).
#   mission-control is target-specific (shipped via meta/).
EXCLUDE=(mission-control \
  codebase-exploration codebase-management \
  docx pdf pptx xlsx \
  obsidian-cli \
  animated-website budget-dashboard contract-reviewer customize difficult-conversation-prep \
  email-drafter explainer-graphic invoice-generator learning-path-generator morning-briefing \
  quick-research receipt-scanner slide-deck-builder visual-page-builder workflow-visualizer)

mkdir -p "$STAGE/skills" "$STAGE/profiles" "$STAGE/meta" "$STAGE/commands" "$OUT"

while IFS= read -r f; do
  d="$(dirname "$f")"; name="$(basename "$d")"
  for x in "${EXCLUDE[@]}"; do [ "$name" = "$x" ] && continue 2; done
  rsync -a --exclude '.DS_Store' "$d"/ "$STAGE/skills/$name"/ 2>/dev/null || true
done < <(find "$REPO/packages" "$REPO/skills" -name SKILL.md 2>/dev/null)

# target-specific meta skill, chosen at install time
cp "$REPO/bob/meta/mission-control.bob.md"    "$STAGE/meta/"
cp "$REPO/bob/meta/mission-control.claude.md" "$STAGE/meta/"

cp "$REPO"/bob/profiles/*.txt "$STAGE/profiles/"
cp "$REPO"/bob/profiles/_meta.json "$STAGE/profiles/" 2>/dev/null || true
cp "$REPO"/bob/commands/*.md "$STAGE/commands/" 2>/dev/null || true
cp "$REPO/bob/bob-profile"          "$STAGE/bob-profile"
cp "$REPO/bob/package-install.sh"   "$STAGE/install.sh"
cp "$REPO/dist/BOB-INSTALL-INSTRUCTIONS.md" "$STAGE/README.md"
cp "$REPO/dist/LICENSES.md"         "$STAGE/LICENSES.md"
chmod +x "$STAGE/bob-profile" "$STAGE/install.sh"

cd "$(dirname "$STAGE")"
mv skills-package bob-skills-package
rm -f "$OUT/bob-skills-package.zip"
zip -r -q -X "$OUT/bob-skills-package.zip" bob-skills-package -x '*.DS_Store'
echo "Built: $OUT/bob-skills-package.zip ($(du -h "$OUT/bob-skills-package.zip" | cut -f1))"
echo "Skills: $(ls -1 bob-skills-package/skills | wc -l | tr -d ' ') (AGPL + mission-control excluded from skills/; meta variants shipped separately)"
rm -rf "$(dirname "$STAGE")"
