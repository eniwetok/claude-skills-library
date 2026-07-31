#!/usr/bin/env bash
# Install this skills package into IBM Bob and/or Claude Code.
#
#   ./install.sh              install into BOTH (default)
#   ./install.sh bob          Bob only
#   ./install.sh claude       Claude Code only
#   ./install.sh both --all   (Bob) load every skill instead of a small profile
#
# Tested against: IBM Bob 2.0.1
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${1:-both}"; FLAG="${2:-}"

backup() {  # $1 = dir to back up
  if [ -d "$1" ] && [ -n "$(ls -A "$1" 2>/dev/null)" ]; then
    local bk="$1-backup-$(date +%Y%m%d_%H%M%S)"; cp -R "$1" "$bk"
    echo "  backed up existing skills -> $bk"
  fi
}

install_bob() {
  echo "── IBM Bob ──"
  local VAULT="$HOME/.bob/skills-vault" ACTIVE="$HOME/.bob/skills" PROF="$HOME/.bob/profiles"
  backup "$ACTIVE"
  mkdir -p "$VAULT" "$PROF"
  rsync -a "$HERE/skills"/ "$VAULT"/
  # Bob gets the Bob-specific mission-control (explains Bob has no hooks)
  mkdir -p "$VAULT/mission-control"; cp "$HERE/meta/mission-control.bob.md" "$VAULT/mission-control/SKILL.md"
  cp "$HERE"/profiles/*.txt "$PROF"/
  cp "$HERE/bob-profile" "$HOME/.bob/bob-profile"; chmod +x "$HOME/.bob/bob-profile"
  echo "  vault: $(ls -1 "$VAULT" | wc -l | tr -d ' ') skills"
  if [ "$FLAG" = "--all" ]; then "$HOME/.bob/bob-profile" all
  else "$HOME/.bob/bob-profile" code >/dev/null 2>&1 || true; "$HOME/.bob/bob-profile" status; fi
}

install_claude() {
  echo "── Claude Code ──"
  local DEST="$HOME/.claude/skills"
  backup "$DEST"
  mkdir -p "$DEST"
  rsync -a "$HERE/skills"/ "$DEST"/
  # Claude Code gets the Claude mission-control (its hooks are real)
  mkdir -p "$DEST/mission-control"; cp "$HERE/meta/mission-control.claude.md" "$DEST/mission-control/SKILL.md"
  echo "  installed: $(ls -1 "$DEST" | wc -l | tr -d ' ') skills into ~/.claude/skills"
  echo "  note: Claude Code loads no profile system — it surfaces skills on demand."
}

case "$TARGET" in
  bob)    install_bob ;;
  claude) install_claude ;;
  both)   install_bob; echo; install_claude ;;
  *) echo "Usage: ./install.sh [bob|claude|both] [--all]"; exit 1 ;;
esac

echo ""
echo "Done. Restart Bob / start a new Claude Code session so skills load."
echo "Bob: switch context with  ~/.bob/bob-profile <code|data|pm|security|ui|research>"
