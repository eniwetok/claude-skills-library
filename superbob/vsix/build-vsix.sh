#!/usr/bin/env bash
# Build dist/super-bob-skills-<ver>.vsix from the extension source + the skills package.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config.sh"
REPO="$SB_ROOT"          # SuperBob extension root
OUT="$SB_DIST"
VER="$(node -e "console.log(require('$REPO/vsix/extension/package.json').version)")"
NAME="$(node -e "console.log(require('$REPO/vsix/extension/package.json').name)")"

# Always rebuild the payload from the library so the .vsix never ships a stale package
# and the skill-library-lint gate always runs. (A cached zip previously shipped skills
# that no longer matched the library and silently skipped the gate.)
"$REPO/bob/build-package.sh"
cp "$OUT/bob-skills-package.zip" "$REPO/vsix/extension/skills.zip"

cd "$REPO/vsix"
rm -f "$OUT/$NAME-$VER.vsix"
zip -r -q -X "$OUT/$NAME-$VER.vsix" \
  '[Content_Types].xml' extension.vsixmanifest extension -x '*.DS_Store'
echo "Built: $OUT/$NAME-$VER.vsix ($(du -h "$OUT/$NAME-$VER.vsix" | cut -f1))"
