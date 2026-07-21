#!/usr/bin/env bash
# Install this skills package into IBM Bob.
# Usage:  ./install.sh            (recommended: small profile loaded)
#         ./install.sh --all      (load every skill — heavy, ~67k tokens)
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT="$HOME/.bob/skills-vault"
ACTIVE="$HOME/.bob/skills"
PROF="$HOME/.bob/profiles"

echo "Installing Bob skills..."

# 1. Back up whatever is already installed
if [ -d "$ACTIVE" ] && [ -n "$(ls -A "$ACTIVE" 2>/dev/null)" ]; then
  BK="$HOME/.bob/skills-backup-$(date +%Y%m%d_%H%M%S)"
  cp -R "$ACTIVE" "$BK"
  echo "  Existing skills backed up to: $BK"
fi

# 2. Store the full library in a vault Bob does NOT read
mkdir -p "$VAULT" "$PROF"
rsync -a "$HERE/skills"/ "$VAULT"/
echo "  Library stored: $(ls -1 "$VAULT" | wc -l | tr -d ' ') skills"

# 3. Install profiles + switcher
cp "$HERE"/profiles/*.txt "$PROF"/
cp "$HERE/bob-profile" "$HOME/.bob/bob-profile"
chmod +x "$HOME/.bob/bob-profile"
echo "  Profile switcher installed"

# 4. Activate
if [ "${1:-}" = "--all" ]; then
  "$HOME/.bob/bob-profile" all
else
  "$HOME/.bob/bob-profile" code >/dev/null 2>&1 || true
  echo ""
  echo "Done. Started you on the 'code' profile to keep context small."
  "$HOME/.bob/bob-profile" status
fi

echo ""
echo "Next:"
echo "  1. Restart IBM Bob (or start a new conversation)"
echo "  2. Ask Bob: \"use mission control\" to see how it routes tasks"
echo "  3. Switch profiles anytime:  ~/.bob/bob-profile data"
echo ""
echo "Profiles: code | data | pm | security | ui | research"
