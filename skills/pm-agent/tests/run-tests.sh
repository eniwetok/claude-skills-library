#!/usr/bin/env bash
# pm-agent test runner
# Stages the gold dataset, invokes the pm-agent in dry-run, runs structural test
# cases + agentic evals, restores the canonical state, reports.

set -e

WORKSPACE="/Users/felipecampo/Library/CloudStorage/OneDrive-IBM/ibm_github"
PM_WIKI="$WORKSPACE/pm-wiki"
GOLD="$PM_WIKI/_tests/gold"
SKILL_DIR="$HOME/.claude/skills/pm-agent"
TESTS_DIR="$SKILL_DIR/tests"
SNAPSHOT_DIR="/tmp/pm-agent-snapshot-$(date +%s)"
RUN_DATE=$(date -u +"%Y-%m-%d_%H%M")
RUN_LOG="$PM_WIKI/_claude-log/dry-run/${RUN_DATE}_test-run.md"

CASES_ONLY=false
KEEP_OUTPUT=false

for arg in "$@"; do
  case "$arg" in
    --cases-only) CASES_ONLY=true ;;
    --keep-output) KEEP_OUTPUT=true ;;
    -h|--help)
      grep '^# ' "$0" | sed 's/^# //'
      exit 0
      ;;
  esac
done

echo "==> pm-agent test runner"
echo "Snapshot dir: $SNAPSHOT_DIR"
echo "Run log: $RUN_LOG"
echo ""

# 1. Snapshot real state
echo "==> 1. Snapshotting canonical inputs..."
mkdir -p "$SNAPSHOT_DIR"
[ -d "$PM_WIKI/inputs" ] && cp -R "$PM_WIKI/inputs" "$SNAPSHOT_DIR/inputs.bak"
[ -d "$PM_WIKI/products/cognos-agents" ] && cp -R "$PM_WIKI/products/cognos-agents" "$SNAPSHOT_DIR/cognos-agents.bak"

restore() {
  echo ""
  echo "==> Restoring canonical state from $SNAPSHOT_DIR..."
  if [ -d "$SNAPSHOT_DIR/inputs.bak" ]; then
    rm -rf "$PM_WIKI/inputs"
    cp -R "$SNAPSHOT_DIR/inputs.bak" "$PM_WIKI/inputs"
  fi
  if [ -d "$SNAPSHOT_DIR/cognos-agents.bak" ]; then
    rm -rf "$PM_WIKI/products/cognos-agents"
    cp -R "$SNAPSHOT_DIR/cognos-agents.bak" "$PM_WIKI/products/cognos-agents"
  fi
  echo "   ✓ canonical restored"
  if [ "$KEEP_OUTPUT" = false ]; then
    rm -rf "$SNAPSHOT_DIR"
  else
    echo "   (snapshot kept at $SNAPSHOT_DIR per --keep-output)"
  fi
}
trap restore EXIT

# 2. Stage gold dataset
echo "==> 2. Staging gold dataset..."
mkdir -p "$PM_WIKI/inputs/feedback-river"
cp "$GOLD/inputs/feedback-river/"*.md "$PM_WIKI/inputs/feedback-river/" 2>/dev/null || true
mkdir -p "$PM_WIKI/products/cognos-agents/roadmap"
cp "$GOLD/inputs/products/cognos-agents/roadmap/"*.md "$PM_WIKI/products/cognos-agents/roadmap/" 2>/dev/null || true
mkdir -p "$PM_WIKI/products/cognos-agents/decisions"
cp "$GOLD/inputs/products/cognos-agents/decisions/"*.md "$PM_WIKI/products/cognos-agents/decisions/" 2>/dev/null || true
mkdir -p "$PM_WIKI/products/cognos-agents/releases/2026.2"
cp "$GOLD/inputs/products/cognos-agents/releases/2026.2/"*.md "$PM_WIKI/products/cognos-agents/releases/2026.2/" 2>/dev/null || true
mkdir -p "$PM_WIKI/products/cognos-agents/okrs"
cp "$GOLD/inputs/products/cognos-agents/okrs/"*.md "$PM_WIKI/products/cognos-agents/okrs/" 2>/dev/null || true
echo "   ✓ gold dataset staged"

# 3. Note: the actual pm-agent invocation must be done by Claude, since the skill
#    is invoked via the Skill tool. This runner prepares the env; the human (or
#    a wrapper agent) then invokes /pm-agent --dry-run --product cognos-agents
#    --recipe weekly-product-status from a Claude Code session.
#
#    For full automation, integrate with `claude` CLI in non-interactive mode
#    OR have a meta-skill that runs this script and then invokes pm-agent.

echo "==> 3. Gold dataset staged. Now invoke pm-agent in a Claude Code session:"
echo "      /pm-agent --dry-run --product cognos-agents --recipe weekly-product-status"
echo "   (the agent will see the gold inputs and produce output to pm-wiki/_claude-log/dry-run/)"
echo ""
echo "==> 4. After the agent run, evaluate:"
echo "   - Structural test cases: see $TESTS_DIR/cases.md"
echo "   - Agentic evals:        see $TESTS_DIR/evals.md"
echo "   - Expected output:      see $GOLD/expected/expected.md"
echo ""
echo "==> The trap will restore canonical state when this script exits."
echo "==> Press Ctrl+C now if you want to keep gold staged longer."
echo ""

# Pause so the user can run the agent invocation manually
read -p "Press Enter when the agent run is complete (to restore canonical and exit)... "

echo ""
echo "==> 5. Verify dry-run output exists:"
DRY_RUN_OUTPUT="$PM_WIKI/_claude-log/dry-run/2026-W22-cognos-agents-status.md"
if [ -f "$DRY_RUN_OUTPUT" ]; then
  echo "   ✓ $DRY_RUN_OUTPUT exists ($(wc -l < "$DRY_RUN_OUTPUT") lines)"
else
  echo "   ✗ $DRY_RUN_OUTPUT NOT FOUND — agent didn't run or wrote elsewhere"
fi

echo ""
echo "==> Done. See run log + dry-run outputs at $PM_WIKI/_claude-log/dry-run/"
