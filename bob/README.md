# IBM Bob setup

Bob loads the name + description of every installed skill at conversation start.
The full library (~1015 skills) costs **~67,000 tokens** before you type anything.
So the library is kept in a vault and only a small profile is loaded.

| Location | Read by Bob? | Contents |
|----------|--------------|----------|
| `~/.bob/skills-vault/` | No | Full library, 1015 skills |
| `~/.bob/skills/` | **Yes** | Active profile only (~2-3k tokens) |

## Commands

```bash
~/.bob/bob-profile data      # load a profile
~/.bob/bob-profile code ui   # combine profiles
~/.bob/bob-profile status    # what's loaded
~/.bob/bob-profile list      # available profiles
~/.bob/bob-profile all       # everything (~67k tokens — avoid)
```

Restart the Bob conversation after switching.

## Profiles

| Profile | For | Cost |
|---------|-----|------|
| code | Software, tests, APIs, infra | ~2.1k |
| data | Evals, SQL, RAG, analytics (Cognos) | ~2.2k |
| pm | PRDs, roadmaps, strategy | ~2.1k |
| security | Audits, vulnerability hunting | ~3.1k |
| ui | Interfaces, accessibility, design | ~2.0k |
| research | Wiki, notes, deep research | ~2.5k |

Every profile includes a small always-on core (mission-control, karpathy-guidelines,
brainstorming, writing-plans, systematic-debugging, verification-before-completion,
caveman-debug, code-review).

Edit `profiles/*.txt` to change membership — one skill name per line.

## Important: Bob has no hooks

Claude Code's four guardrails (branch-guard, design-gate, format-on-save, dod-gate)
**do not run in Bob**. Nothing blocks bad work there. Bob's mission-control says so
explicitly. Do final verification of mission-critical changes in Claude Code.

See RESTORE.md to undo everything.
