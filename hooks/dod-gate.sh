#!/usr/bin/env bash
# Definition-of-Done gate — Stop hook.
# In any repo that opts in via .claude/dod.json, the session cannot end while
# the configured `verify` command (lint + typecheck + tests) is failing.
# Inert (exit 0) in every repo that has NOT opted in.
set -euo pipefail

INPUT=$(cat)

# Avoid infinite loops: if we are already inside a stop-hook continuation, don't re-block.
STOP_ACTIVE=$(echo "$INPUT" | python3 -c "
import sys, json
try: print(json.load(sys.stdin).get('stop_hook_active', False))
except Exception: print(False)
" 2>/dev/null || echo "False")
[ "$STOP_ACTIVE" = "True" ] && exit 0

# Must be in a git repo.
ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
[ -z "$ROOT" ] && exit 0

# Opt-in only: no dod.json → this hook does nothing.
DOD="$ROOT/.claude/dod.json"
[ -f "$DOD" ] || exit 0

# Only enforce when there are uncommitted changes to non-doc files.
CHANGES=$(git -C "$ROOT" status --porcelain 2>/dev/null | grep -vE '\.(md|txt|rst|adoc)$' || true)
[ -z "$CHANGES" ] && exit 0

# Read the verify command.
VERIFY=$(python3 -c "
import json
try: print(json.load(open('$DOD')).get('verify',''))
except Exception: print('')
" 2>/dev/null || echo "")
[ -z "$VERIFY" ] && exit 0

# Run it. Red verify blocks completion.
if ! OUTPUT=$(cd "$ROOT" && eval "$VERIFY" 2>&1); then
  echo "" >&2
  echo "Definition-of-Done gate FAILED — mission-critical work cannot close with a red verify." >&2
  echo "  verify: $VERIFY" >&2
  echo "" >&2
  echo "$OUTPUT" | tail -40 >&2
  echo "" >&2
  echo "Fix the failures above, then finish. (Docs-only changes are exempt.)" >&2
  exit 2
fi

exit 0
