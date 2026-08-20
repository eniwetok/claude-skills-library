#!/usr/bin/env bash
# Install this skills package into IBM Bob.
#
#   ./install.sh            install (loads a small default kit)
#   ./install.sh --all      load every skill instead of a small kit (heavy)
#
# Tested against: IBM Bob 2.0.1
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FLAG="${1:-}"

backup() {  # $1 = dir to back up
  if [ -d "$1" ] && [ -n "$(ls -A "$1" 2>/dev/null)" ]; then
    local bk="$1-backup-$(date +%Y%m%d_%H%M%S)"; cp -R "$1" "$bk"
    echo "  backed up existing skills -> $bk"
  fi
}

echo "── IBM Bob ──"
VAULT="$HOME/.bob/skills-vault"; ACTIVE="$HOME/.bob/skills"; PROF="$HOME/.bob/profiles"
backup "$ACTIVE"
mkdir -p "$VAULT" "$PROF"
rsync -a "$HERE/skills"/ "$VAULT"/
mkdir -p "$VAULT/mission-control"; cp "$HERE/meta/mission-control.bob.md" "$VAULT/mission-control/SKILL.md"
cp "$HERE"/profiles/*.txt "$PROF"/
cp "$HERE/bob-profile" "$HOME/.bob/bob-profile"; chmod +x "$HOME/.bob/bob-profile"
echo "  vault: $(ls -1 "$VAULT" | wc -l | tr -d ' ') skills"
if [ "$FLAG" = "--all" ]; then "$HOME/.bob/bob-profile" all
else "$HOME/.bob/bob-profile" software-development >/dev/null 2>&1 || true; "$HOME/.bob/bob-profile" status; fi

echo ""
echo "Done. Restart Bob so skills load."
echo "Switch kits with  ~/.bob/bob-profile <kit>   (or 'list' to see them all)."
