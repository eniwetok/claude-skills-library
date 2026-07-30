---
description: Switch SuperBob skill mode — loads that mode's skills for this conversation
argument-hint: <mode> (e.g. super-code, super-data, super-security, auto — leave blank to list)
---
Switch SuperBob to the "$1" mode.

Follow these steps:

1. **If "$1" is empty**, do not load anything. List the available modes and ask which
   to load. The modes are the `.txt` files in `~/.bob/profiles/` (ignore `_core.txt`);
   their plain-English descriptions are in `~/.bob/profiles/_meta.json`. Show each mode
   name with its description.

2. **If "$1" is "auto" or "lean"**, tell the user Auto mode is on: only the two core
   skills stay loaded (using-superpowers, mission-control) and you pull in the right
   skills per task on demand. Stop here.

3. **Otherwise**, load the "$1" mode. Mode files are named with a `super-` prefix, but the
   user may type the name with or without it, so resolve the profile file like this:
   - Try `~/.bob/profiles/$1.txt` first; if it does not exist, try `~/.bob/profiles/super-$1.txt`
     (so "code" resolves to "super-code"). Use whichever exists.
   - Each non-empty line of that file is a skill name. For each, read
     `~/.bob/skills-vault/<skill>/SKILL.md` and apply it for the rest of this conversation.
   - If neither file exists, say so and list the available modes.

4. Confirm to the user which mode you loaded and list the skills it brought in.

The two core skills (using-superpowers, mission-control) are always active regardless of
mode — you never need to reload those.
