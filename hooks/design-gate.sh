#!/usr/bin/env bash
# Design gate — PreToolUse hook on Edit|Write.
# In a mission-critical repo (.claude/dod.json present), blocks the FIRST code edit
# until a written plan/ADR exists. Forces design-before-code. Stateless: once a plan
# artifact exists, it stops blocking. Overridable via "design_gate": false in dod.json.
set -euo pipefail

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try: print(json.load(sys.stdin).get('tool_input', {}).get('file_path', ''))
except Exception: print('')
" 2>/dev/null || echo "")
[ -z "$FILE_PATH" ] && exit 0

DIR=$(dirname "$FILE_PATH")
# New files may live in a not-yet-created dir; walk up to the nearest existing ancestor.
while [ ! -d "$DIR" ] && [ "$DIR" != "/" ] && [ -n "$DIR" ]; do DIR=$(dirname "$DIR"); done
ROOT=$(git -C "$DIR" rev-parse --show-toplevel 2>/dev/null || echo "")
[ -z "$ROOT" ] && exit 0

# Opt-in only.
DOD="$ROOT/.claude/dod.json"
[ -f "$DOD" ] || exit 0

# Respect per-repo override.
ENABLED=$(python3 -c "
import json
try: print(json.load(open('$DOD')).get('design_gate', True))
except Exception: print(True)
" 2>/dev/null || echo "True")
[ "$ENABLED" = "False" ] && exit 0

# Only gate code files. Docs/config are always allowed (you need them to write the plan).
EXT="${FILE_PATH##*.}"
case "$EXT" in
  js|jsx|ts|tsx|py|go|rs|java|kt|rb|php|c|cc|cpp|h|hpp|swift|cs|scala|ex|exs|vue|svelte|sql|sh) ;;
  *) exit 0 ;;
esac

# Look for a plan/ADR artifact anywhere reasonable.
shopt -s nullglob
FOUND=""
for p in \
  "$ROOT/PLAN.md" "$ROOT/DESIGN.md" "$ROOT/.claude/plan.md" "$ROOT/.claude/PLAN.md" \
  "$ROOT"/docs/adr/*.md "$ROOT"/docs/adrs/*.md "$ROOT"/doc/adr/*.md "$ROOT"/adr/*.md; do
  [ -f "$p" ] && FOUND="$p" && break
done

[ -n "$FOUND" ] && exit 0

echo "" >&2
echo "Design gate: no plan or ADR found in this mission-critical repo." >&2
echo "" >&2
echo "Write the design before the code. Create one of:" >&2
echo "  PLAN.md   |   DESIGN.md   |   docs/adr/NNN-title.md" >&2
echo "" >&2
echo "Use the brainstorming / writing-plans / architecture-decision-records skills," >&2
echo "then re-run your edit. (Set \"design_gate\": false in .claude/dod.json to disable.)" >&2
exit 2
