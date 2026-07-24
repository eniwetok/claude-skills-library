---
name: skill-library-lint
description: >-
  Integrity checker for a mode-based skill library (SuperBob / the ~/.bob or
  ~/.claude skill vault + mode profiles). Run this whenever you add, remove,
  rename, or move a skill between modes; edit a mode profile; edit the
  mission-control router; or right before rebuilding/committing the SuperBob
  package. Also use it when the user asks to "lint the skill library", "check
  the modes", "did I break a mode", "audit the skills", "are the modes still
  valid", or "make sure nothing points at a missing skill". It catches the one
  failure that silently breaks the whole system — a mode or the router pointing
  at a skill that no longer exists — plus vendor lock-in, crypto dependencies,
  data-egress risks, and per-mode token bloat. Prefer this over ad-hoc grepping
  whenever library structure changes.
---

# skill-library-lint

## Why this exists

The library runs "lean": at the start of a task only the two **core** skills load
(`using-superpowers` + `mission-control`). Everything else sits UNLOADED in the vault.
That keeps context small, but it means the agent can't see the other ~1,000 skills —
it depends entirely on two things staying honest:

1. **Mode profiles** (`~/.bob/profiles/*.txt`) — each line names a vault skill to load.
2. **The router** (`mission-control/SKILL.md`) — an intent→skill map the agent follows.

If either points at a skill that no longer exists (renamed, removed, moved), the agent
follows the pointer into nothing and **silently improvises instead of failing loudly**.
That is the exact rot this skill prevents. It also enforces the library's security rules:
no external-vendor products, no crypto dead weight, and a clear view of anything that can
send data off-machine.

## How to run it

The work is done by a bundled script — run it, don't reimplement it:

```bash
python3 scripts/lint.py
```

By default it auto-detects the live Bob library (`~/.bob/skills-vault` +
`~/.bob/profiles`), falling back to the Claude vault (`~/.claude/skills-vault`). Point it
somewhere else when linting the repo copy or a different install:

```bash
python3 scripts/lint.py \
  --vault    ~/Documents/Skills/some-vault \
  --profiles ~/Documents/Skills/bob/profiles \
  --router   ~/Documents/Skills/bob/meta/mission-control.bob.md
```

Useful flags: `--max-mode-tokens N` changes the per-mode budget warning (default 4000).

**Exit code is the contract:** `0` = clean, `1` = a hard check failed, `2` = misconfigured
(couldn't find the vault or profiles). Use it in a pre-commit / pre-build gate so broken
references can never ship:

```bash
python3 ~/.claude/skills/skill-library-lint/scripts/lint.py || { echo "library lint failed"; exit 1; }
```

## What it checks

**Hard checks** (any failure → exit 1, and you should fix before shipping):

- **[A] Mode integrity** — every skill named in every `*.txt` mode profile exists in the vault.
- **[B] Router integrity** — every backtick-quoted skill reference in `mission-control`
  resolves to a real vault skill, a known Bob built-in git skill, the code-review-graph MCP
  tool, a mode name, or a YAML frontmatter word. Anything else is a phantom reference.
- **[C] No external dependencies** — no mode skill depends on a vendor product
  (claude-flow / agentic-flow / AgentDB / ecc-agentshield) or crypto-specific code
  (Ethereum / keccak256 / web3). These are the lock-in and phone-home risks the library bans.

**Advisory checks** (never fail the build — they inform):

- **[D] Token budget** — the real name+description cost each mode loads, flagged if a mode
  goes over budget. This is the premise of the whole system; watch it doesn't creep.
- **[E] Egress review** — skills that can transmit your data off-machine, so you can confirm
  each is gated / off by default (e.g. `wiki-retrieve` behind `--allow-egress`).
- **[F] Coverage** — how many vault skills are in a mode vs orphaned. Orphans are fine —
  they stay reachable via the router's vault-scan fallback — this is just a health number.

## When a phantom reference is actually legitimate

If check [B] flags a name that really is a valid Bob built-in, a new MCP tool, or a new mode,
that's not a bug in the library — it's a gap in the linter's allowlist. Add the name to
`BOB_BUILTINS` or `NON_SKILL_TOKENS` near the top of `scripts/lint.py` and rerun. Keep the
allowlist tight: the point is that *unrecognized* names get caught, so only add things you've
verified are real.

## Fixing what it finds

- **[A]/[B] failure** — either the reference is a typo/rename (point it at the correct vault
  skill) or the skill was intentionally removed (update the mode/router to a real replacement,
  or drop the line). Never "fix" it by leaving a dead pointer.
- **[C] failure** — remove the vendor/crypto-dependent skill from the mode. It can stay in the
  vault for anyone who has that product installed; it just shouldn't be in a curated mode.
- Rerun until exit code is `0`, then rebuild/commit.
