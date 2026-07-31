#!/usr/bin/env bash
# Set up IBM Bob's skills from this repo.
#
#   git clone https://github.com/eniwetok/claude-skills-library.git
#   cd claude-skills-library && ./bob/install.sh
#
# Builds ~/.bob/skills-vault (full library, NOT loaded by Bob), installs the
# profile switcher, and activates a small profile so context stays small.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAULT="$HOME/.bob/skills-vault"
ACTIVE="$HOME/.bob/skills"
PROF="$HOME/.bob/profiles"

echo "Installing Bob skills from: $REPO"

# Back up anything already there
if [ -d "$ACTIVE" ] && [ -n "$(ls -A "$ACTIVE" 2>/dev/null)" ]; then
  BK="$HOME/.bob/skills-backup-$(date +%Y%m%d_%H%M%S)"
  cp -R "$ACTIVE" "$BK"
  echo "  existing skills backed up -> $BK"
fi

mkdir -p "$VAULT" "$PROF"

# Collect every skill in the repo into the vault (last write wins on duplicates)
n=0
while IFS= read -r f; do
  d="$(dirname "$f")"; name="$(basename "$d")"
  rsync -a --exclude '.DS_Store' "$d"/ "$VAULT/$name"/ 2>/dev/null && n=$((n+1)) || true
done < <(find "$REPO/packages" "$REPO/skills" -name SKILL.md 2>/dev/null)

echo "  vault built: $(ls -1 "$VAULT" | wc -l | tr -d ' ') skills ($(du -sh "$VAULT" | cut -f1))"

# Profile definitions + switcher
cp "$REPO"/bob/profiles/*.txt "$PROF"/
cp "$REPO/bob/bob-profile" "$HOME/.bob/bob-profile"
chmod +x "$HOME/.bob/bob-profile"
echo "  profiles installed: $(ls -1 "$PROF"/*.txt | wc -l | tr -d ' ')"

# Activate a small default so Bob doesn't load ~67k tokens of descriptions
"$HOME/.bob/bob-profile" code >/dev/null 2>&1 || true

echo ""
echo "Done."
"$HOME/.bob/bob-profile" status
echo ""
echo "Switch profiles:  ~/.bob/bob-profile <code|data|pm|security|ui|research>"
echo "Restart your Bob conversation after switching."
