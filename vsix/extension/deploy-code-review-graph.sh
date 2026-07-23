#!/usr/bin/env bash
# Deploy the code-review-graph MCP tool into Bob and/or Claude Code.
# Installs the tool if missing, then registers it as an MCP server in each.
# Idempotent — safe to run again. Requires Python (uv, pipx, or pip3).
set -euo pipefail

echo "Deploying code-review-graph (code-review MCP tool)…"

# 1. Install the tool if it isn't already on PATH.
if ! command -v code-review-graph >/dev/null 2>&1; then
  echo "  installing code-review-graph…"
  if   command -v uv    >/dev/null 2>&1; then uv tool install code-review-graph
  elif command -v pipx  >/dev/null 2>&1; then pipx install code-review-graph
  elif command -v pip3  >/dev/null 2>&1; then pip3 install --user code-review-graph
  else
    echo "  ERROR: need Python with uv, pipx, or pip3. Install one, then re-run." >&2
    exit 1
  fi
fi
CRG="$(command -v code-review-graph || echo "$HOME/.local/bin/code-review-graph")"
echo "  tool: $CRG"

# 2. Register it as an MCP server in each agent's config (merges, never clobbers).
python3 - "$CRG" << 'PY'
import json, os, sys
crg = sys.argv[1]
entry = {"command": crg, "args": ["serve"]}
targets = {
    "Claude Code": os.path.expanduser("~/.claude.json"),
    "Bob":         os.path.expanduser("~/.bob/settings/mcp_settings.json"),
}
for label, p in targets.items():
    if not os.path.isdir(os.path.dirname(p)):
        print(f"  skip {label} (not installed here)"); continue
    try:
        d = json.load(open(p))
    except Exception:
        d = {}
    d.setdefault("mcpServers", {})["code-review-graph"] = entry
    json.dump(d, open(p, "w"), indent=2)
    print(f"  registered in {label}")
PY

echo ""
echo "Done. Restart Bob / start a new Claude Code session to load it."
echo "First use in a repo builds its code map (a few seconds); incremental after that."
