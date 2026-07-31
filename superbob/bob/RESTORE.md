# How to undo the Bob skills changes

Backups live in `~/Documents/Skills/backups/`.

## Put Bob back exactly as it was originally (only 5 skills)

```bash
rm -rf ~/.bob/skills
mkdir -p ~/.bob/skills
tar -xzf ~/Documents/Skills/backups/bob-ORIGINAL-5-skills_<STAMP>.tar.gz -C /tmp
cp -R /tmp/bob-skills-backup/. ~/.bob/skills/
rm -rf ~/.bob/skills-vault ~/.bob/profiles ~/.bob/bob-profile
```

## Restore Bob's skills to the full-library snapshot

```bash
rm -rf ~/.bob/skills
tar -xzf ~/Documents/Skills/backups/bob-skills_<STAMP>.tar.gz -C ~/.bob
```

## Settings files

`bob-settings_<STAMP>.json`  -> `~/.bob/settings.json`

## Nothing was deleted

The full library is in `~/.bob/skills-vault/` (1015 skills). Switching profiles only
changes `~/.bob/skills/`; the vault is never modified.
