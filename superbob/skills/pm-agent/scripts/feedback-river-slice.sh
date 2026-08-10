#!/usr/bin/env bash
# pm-agent — feedback-river slice helper
# Lists feedback-river entries for a given product slug and date range.
#
# Usage:
#   feedback-river-slice.sh <workspace-root> <product-slug> <period-start> <period-end>
# Example:
#   ./feedback-river-slice.sh /Users/felipecampo/.../ibm_github cognos-agents 2026-05-25 2026-05-31
#
# Output: one filepath per line, relative to workspace-root.
# Filter logic: file is in inputs/feedback-river/, frontmatter contains the product slug
# in product_tags AND valid_from falls in [period-start, period-end].

set -e

if [ $# -lt 4 ]; then
  echo "usage: $0 <workspace-root> <product-slug> <period-start> <period-end>" >&2
  exit 2
fi

WORKSPACE="$1"
PRODUCT="$2"
START="$3"
END="$4"

RIVER_DIR="$WORKSPACE/pm-wiki/inputs/feedback-river"

if [ ! -d "$RIVER_DIR" ]; then
  # No river yet — emit nothing, succeed silently
  exit 0
fi

# Scan all .md files in the river
find "$RIVER_DIR" -type f -name '*.md' | while IFS= read -r f; do
  # Skip if file is empty
  [ -s "$f" ] || continue
  # Skip README and other non-feedback files
  case "$(basename "$f")" in
    README.md|index.md|_*) continue ;;
  esac
  # Check product_tags contains the product slug
  # Look for the frontmatter line: product_tags: [..., <product>, ...]  OR  product_tags:\n  - <product>
  if ! grep -E "product_tags:.*\b${PRODUCT}\b|^[[:space:]]*-[[:space:]]+${PRODUCT}\$" "$f" > /dev/null 2>&1; then
    continue
  fi
  # Extract valid_from
  vf=$(grep -E "^valid_from:" "$f" | head -1 | sed -E 's/^valid_from:[[:space:]]*//; s/[[:space:]]*$//; s/"//g')
  [ -z "$vf" ] && continue
  # Compare lexicographically (works for ISO dates YYYY-MM-DD)
  if [[ "$vf" < "$START" ]] || [[ "$vf" > "$END" ]]; then
    continue
  fi
  # Emit relative path
  rel="${f#$WORKSPACE/}"
  echo "$rel"
done
