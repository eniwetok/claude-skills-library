#!/usr/bin/env bash
# Format on save — PostToolUse hook on Edit|Write.
# In a mission-critical repo (.claude/dod.json present), formats the file that was
# just written so maintainability never drifts. Best-effort: never blocks (always
# exits 0). Uses dod.json "format" template if set ({file} = path), else auto-detects.
set -euo pipefail

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try: print(json.load(sys.stdin).get('tool_input', {}).get('file_path', ''))
except Exception: print('')
" 2>/dev/null || echo "")
[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

DIR=$(dirname "$FILE_PATH")
ROOT=$(git -C "$DIR" rev-parse --show-toplevel 2>/dev/null || echo "")
[ -z "$ROOT" ] && exit 0

DOD="$ROOT/.claude/dod.json"
[ -f "$DOD" ] || exit 0

have() { command -v "$1" >/dev/null 2>&1; }

# Custom format template wins if provided: e.g. "prettier --write {file}"
TMPL=$(python3 -c "
import json
try: print(json.load(open('$DOD')).get('format',''))
except Exception: print('')
" 2>/dev/null || echo "")

if [ -n "$TMPL" ]; then
  CMD="${TMPL//\{file\}/$FILE_PATH}"
  (cd "$ROOT" && eval "$CMD") >/dev/null 2>&1 || true
  exit 0
fi

# Auto-detect by extension, only if the formatter is installed.
EXT="${FILE_PATH##*.}"
case "$EXT" in
  js|jsx|ts|tsx|json|css|scss|html|md|yaml|yml)
    have prettier && prettier --write "$FILE_PATH" >/dev/null 2>&1 || \
    have npx && npx --no-install prettier --write "$FILE_PATH" >/dev/null 2>&1 || true ;;
  py)
    have ruff && ruff format "$FILE_PATH" >/dev/null 2>&1 || \
    have black && black -q "$FILE_PATH" >/dev/null 2>&1 || true ;;
  go)
    have gofmt && gofmt -w "$FILE_PATH" >/dev/null 2>&1 || true ;;
  rs)
    have rustfmt && rustfmt "$FILE_PATH" >/dev/null 2>&1 || true ;;
  sh)
    have shfmt && shfmt -w "$FILE_PATH" >/dev/null 2>&1 || true ;;
  *) : ;;
esac

exit 0
