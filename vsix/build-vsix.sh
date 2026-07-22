#!/usr/bin/env bash
# Build dist/skills-library-<ver>.vsix from the extension source + the skills package.
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VER="$(node -e "console.log(require('$REPO/vsix/extension/package.json').version)")"

# Ensure the payload exists (build it if missing)
[ -f "$REPO/dist/bob-skills-package.zip" ] || "$REPO/bob/build-package.sh"
cp "$REPO/dist/bob-skills-package.zip" "$REPO/vsix/extension/skills.zip"

cd "$REPO/vsix"
rm -f "$REPO/dist/skills-library-$VER.vsix"
zip -r -q -X "$REPO/dist/skills-library-$VER.vsix" \
  '[Content_Types].xml' extension.vsixmanifest extension -x '*.DS_Store'
echo "Built: dist/skills-library-$VER.vsix ($(du -h "$REPO/dist/skills-library-$VER.vsix" | cut -f1))"
