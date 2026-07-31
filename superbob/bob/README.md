# IBM Bob setup

Bob loads the name + description of every installed skill at conversation start.
The full library (~1015 skills) costs **~67,000 tokens** before you type anything.
So the library is kept in a vault and only a small profile is loaded.

| Location | Read by Bob? | Contents |
|----------|--------------|----------|
| `~/.bob/skills-vault/` | No | Full library, 1015 skills |
| `~/.bob/skills/` | **Yes** | Active profile only (~2-3k tokens) |

## Install on another machine (or share with someone)

```bash
git clone https://github.com/eniwetok/claude-skills-library.git
cd claude-skills-library
./bob/install.sh
```

That builds `~/.bob/skills-vault` from this repo, installs the profile switcher,
and activates a small kit. It backs up any existing `~/.bob/skills` first, and
touches nothing outside `~/.bob`.

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

Bob has no hook system, so nothing blocks bad work: no guard on the main branch, no
code-before-a-plan check, no refusing to finish while tests fail. Bob's mission-control
says so explicitly. Run the verification yourself and show the output.

See RESTORE.md to undo everything.
