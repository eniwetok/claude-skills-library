#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('tool_input', {}).get('file_path', ''))
" 2>/dev/null || echo "")

DIR="${FILE_PATH:+$(dirname "$FILE_PATH")}"
DIR="${DIR:-.}"

BRANCH=$(git -C "$DIR" branch --show-current 2>/dev/null || echo "")
[ -z "$BRANCH" ] && exit 0

# Allow if already in a linked worktree (not the main working tree)
GIT_DIR=$(git -C "$DIR" rev-parse --git-dir 2>/dev/null || echo "")
[[ "$GIT_DIR" != ".git" && "$GIT_DIR" != *"/.git" ]] && exit 0

if [[ "$BRANCH" =~ ^(main|master|trunk|develop)$ ]]; then
  echo "" >&2
  echo "Branch guard: you're on '$BRANCH' in the main worktree." >&2
  echo "" >&2
  echo "Create a worktree for this feature:" >&2
  echo "  git worktree add ../my-feature -b feature/my-feature" >&2
  echo "" >&2
  echo "Then open that folder in a new Claude Code session." >&2
  exit 2
fi

exit 0
