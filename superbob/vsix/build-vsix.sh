#!/usr/bin/env bash
# Build dist/super-bob-skills-<ver>.vsix from the extension source + the skills package.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config.sh"
REPO="$SB_ROOT"          # SuperBob extension root
OUT="$SB_DIST"
VER="$(node -e "console.log(require('$REPO/vsix/extension/package.json').version)")"
NAME="$(node -e "console.log(require('$REPO/vsix/extension/package.json').name)")"

# Ensure the payload exists (build it from the library if missing)
[ -f "$OUT/bob-skills-package.zip" ] || "$REPO/bob/build-package.sh"
cp "$OUT/bob-skills-package.zip" "$REPO/vsix/extension/skills.zip"

cd "$REPO/vsix"
rm -f "$OUT/$NAME-$VER.vsix"
zip -r -q -X "$OUT/$NAME-$VER.vsix" \
  '[Content_Types].xml' extension.vsixmanifest extension -x '*.DS_Store'
echo "Built: $OUT/$NAME-$VER.vsix ($(du -h "$OUT/$NAME-$VER.vsix" | cut -f1))"
