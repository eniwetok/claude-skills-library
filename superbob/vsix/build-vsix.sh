#!/usr/bin/env bash
# Build dist/super-bob-skills-<ver>.vsix from the extension source + the skills package.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config.sh"
REPO="$SB_ROOT"          # SuperBob extension root
OUT="$SB_DIST"
VER="$(node -e "console.log(require('$REPO/vsix/extension/package.json').version)")"
NAME="$(node -e "console.log(require('$REPO/vsix/extension/package.json').name)")"

# GATE: every webview's emitted inline script must parse. A stray backtick or an
# apostrophe escaped as \' inside a template-literal HTML string blanks the whole
# panel at runtime (node --check passes it because the SOURCE is valid). This renders
# each *Html() function and syntax-checks the JS the browser will actually run.
echo "Validating webview scripts…"
if ! node "$REPO/vsix/validate-webviews.js"; then
  echo "ABORT: a webview inline script does not parse — fix before building (it would blank the panel)." >&2
  exit 1
fi
echo "Validating platform compatibility…"
if ! node "$REPO/vsix/validate-platform.js"; then
  echo "ABORT: a Windows-incompatible pattern was found — fix before building (it would break setup on Windows)." >&2
  exit 1
fi
echo "Running cross-platform tests (win32 + darwin)…"
if ! node "$REPO/vsix/test-platform.js"; then
  echo "ABORT: a cross-platform test failed — the extension would misbehave on Windows or macOS." >&2
  exit 1
fi
echo "Real extraction on this OS…"
if ! node "$REPO/vsix/test-extract-real.js"; then
  echo "ABORT: the installer's unzip() did not extract on this OS." >&2
  exit 1
fi

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
