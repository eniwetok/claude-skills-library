#!/usr/bin/env bash
# Build the distributable Bob skills package (dist/bob-skills-package.zip).
# Excludes AGPL-licensed skills so the package is safe to hand to others.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$REPO/dist"
STAGE="$(mktemp -d)/bob-skills-package"
EXCLUDE_AGPL=(codebase-exploration codebase-management)   # SocratiCode, AGPL-3.0

mkdir -p "$STAGE/skills" "$STAGE/profiles" "$OUT"

while IFS= read -r f; do
  d="$(dirname "$f")"; name="$(basename "$d")"
  for x in "${EXCLUDE_AGPL[@]}"; do [ "$name" = "$x" ] && continue 2; done
  rsync -a --exclude '.DS_Store' "$d"/ "$STAGE/skills/$name"/ 2>/dev/null || true
done < <(find "$REPO/packages" "$REPO/skills" -name SKILL.md 2>/dev/null)

cp "$REPO"/bob/profiles/*.txt "$STAGE/profiles/"
cp "$REPO/bob/bob-profile" "$STAGE/bob-profile"
cp "$REPO/dist/BOB-INSTALL-INSTRUCTIONS.md" "$STAGE/README.md"
cp "$REPO/dist/LICENSES.md" "$STAGE/LICENSES.md"
cp "$REPO/bob/package-install.sh" "$STAGE/install.sh"
chmod +x "$STAGE/bob-profile" "$STAGE/install.sh"

cd "$(dirname "$STAGE")"
rm -f "$OUT/bob-skills-package.zip"
zip -r -q -X "$OUT/bob-skills-package.zip" bob-skills-package -x '*.DS_Store'
echo "Built: $OUT/bob-skills-package.zip ($(du -h "$OUT/bob-skills-package.zip" | cut -f1))"
echo "Skills: $(ls -1 "$STAGE/skills" | wc -l | tr -d ' ') (AGPL excluded)"
rm -rf "$(dirname "$STAGE")"
