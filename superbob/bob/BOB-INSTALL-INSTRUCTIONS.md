# Skills package for IBM Bob

**Tested against: IBM Bob 2.0.1.**

A library of expert skills for IBM Bob, grouped into **kits** so they don't flood Bob's
context. (Most people install this through the SuperBob extension; this is the manual path.)

## Install

```bash
unzip bob-skills-package.zip
cd bob-skills-package
./install.sh            # loads a small default kit
# or:  ./install.sh --all   (load every skill, heavy)
```

Then **restart Bob**. That's it. Nothing outside `~/.bob/` is touched.

## The problem this solves

Bob loads the name and description of **every** installed skill at the start of a
conversation. Installing the whole library at once costs roughly **67,000 tokens before you
type anything**, crowding out the space Bob needs to work.

So the library is split in two:

| Folder | Bob reads it? | Contents |
|--------|---------------|----------|
| `~/.bob/skills-vault/` | No | The full library |
| `~/.bob/skills/` | **Yes** | Only the kit you've loaded (~200 to 2,000 tokens) |

You swap kits depending on what you're doing.

## Using it

```bash
~/.bob/bob-profile software_development   # load one kit
~/.bob/bob-profile test_engineering ui    # combine two
~/.bob/bob-profile status                 # what's loaded right now
~/.bob/bob-profile list                   # show all kits
~/.bob/bob-profile all                    # everything (~67k tokens, not recommended)
```

**Restart the Bob conversation after switching.** Bob reads skills when a conversation
starts, so a change mid-conversation has no effect.

The kits, by kind of work: `software_development`, `production_engineering`,
`test_engineering`, `bug_fixing`, `application_security`, `release_review`,
`code_simplification`, `frontend_design`, `product_management`, `web_research`,
`data_analysis`, `rag_evaluation`, `content_writing`.

Two core skills stay on under every kit: `mission-control` (picks the right skills for a
task) and `using-superpowers` (checks for a matching skill before acting).

## Start with mission control

`mission-control` ties the rest together. Ask Bob:

> use mission control, I need to build a new feature

It works out what kind of task it is and lays out which skills to use, in what order. If a
skill it needs isn't loaded, it tells you the exact command to run.

## Customising

Kit files are plain text at `~/.bob/profiles/`, one skill name per line. Edit them, or add
your own `my_kit.txt`, then `~/.bob/bob-profile my_kit`.

## Important: Bob has no automatic guardrails

Bob has no hook system, so nothing stops you from shipping bad work: no block on editing the
main branch, no code-before-a-plan check, no refusing to finish while tests fail. The
`mission-control` skill states this plainly. Treat its quality checklist as a discipline you
follow, not a machine that catches you.

## Undoing it

Your previous skills were copied to `~/.bob/skills-backup-<timestamp>/`. To go back:

```bash
rm -rf ~/.bob/skills
cp -R ~/.bob/skills-backup-<timestamp> ~/.bob/skills
rm -rf ~/.bob/skills-vault ~/.bob/profiles ~/.bob/bob-profile
```

## Credits

These skills were collected from many open-source authors. See `LICENSES.md` for
attribution and licence terms for every source.
