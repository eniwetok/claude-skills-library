# Skills package for IBM Bob & Claude Code

**Tested against: IBM Bob 2.0.1** · works with Claude Code (any recent version).

A library of ~1,549 skills for IBM Bob, with a profile system that keeps them from
flooding Bob's context.

## Install

```bash
unzip bob-skills-package.zip
cd bob-skills-package
./install.sh            # installs into BOTH Bob and Claude Code
# or:  ./install.sh bob      (Bob only)
#      ./install.sh claude   (Claude Code only)
```

Then **restart Bob** and/or **start a new Claude Code session**. That's it.

The installer picks the right `mission-control` for each tool automatically — the Bob
copy explains Bob has no enforcement hooks; the Claude Code copy uses its real hooks.

## The problem this solves

Bob loads the name and description of **every** installed skill at the start of a
conversation. Installing all 1,549 at once costs roughly **67,000 tokens before you
type anything** — it crowds out the space Bob needs to actually work.

So the library is split in two:

| Folder | Bob reads it? | Contents |
|--------|---------------|----------|
| `~/.bob/skills-vault/` | No | The full library |
| `~/.bob/skills/` | **Yes** | Only the profile you've loaded (~2–3k tokens) |

You swap profiles depending on what you're doing. **97% less context.**

## Using it

```bash
~/.bob/bob-profile data       # load one profile
~/.bob/bob-profile code ui    # combine two
~/.bob/bob-profile status     # what's loaded right now
~/.bob/bob-profile list       # show all profiles
~/.bob/bob-profile all        # everything (~67k tokens — not recommended)
```

**Restart the Bob conversation after switching** — Bob reads skills when a
conversation starts, so a change mid-conversation has no effect.

| Profile | Use it for | Context cost |
|---------|-----------|--------------|
| `code` | Software, tests, APIs, infrastructure | ~2.1k tokens |
| `data` | Evaluations, SQL, retrieval, analytics | ~2.2k tokens |
| `pm` | PRDs, roadmaps, strategy, user stories | ~2.1k tokens |
| `security` | Audits, vulnerability hunting | ~3.1k tokens |
| `ui` | Interfaces, accessibility, design | ~2.0k tokens |
| `research` | Notes, wiki, deep research | ~2.5k tokens |

Every profile also includes a small always-on core: `mission-control`,
`karpathy-guidelines`, `brainstorming`, `writing-plans`, `systematic-debugging`,
`verification-before-completion`, `caveman-debug`, `code-review`.

## Start with mission control

`mission-control` is the skill that ties the rest together. Ask Bob:

> use mission control — I need to build a new feature

It works out what kind of task it is and lays out which skills to use, in what order.
If a skill it needs isn't loaded, it tells you the exact command to run.

## Customising

Profiles are plain text files at `~/.bob/profiles/` — one skill name per line.
Edit them, or add your own `myprofile.txt`, then `~/.bob/bob-profile myprofile`.

## Important: Bob has no automatic guardrails

Claude Code can enforce rules with hooks that genuinely block bad work (no editing the
main branch, no code before a plan, refusing to finish while tests fail). **Bob has no
hook system — none of that runs here.** Nothing will stop you.

The `mission-control` skill states this plainly. Treat its quality checklist as a
discipline you follow, not a machine that catches you.

## Undoing it

Your previous skills were copied to `~/.bob/skills-backup-<timestamp>/`. To go back:

```bash
rm -rf ~/.bob/skills
cp -R ~/.bob/skills-backup-<timestamp> ~/.bob/skills
rm -rf ~/.bob/skills-vault ~/.bob/profiles ~/.bob/bob-profile
```

Nothing outside `~/.bob/` is touched. Claude Code's own skills are left alone.

## Credits

These skills were collected from many open-source authors. See `LICENSES.md` for
attribution and licence terms for every source.
