# Build & release

← [Wiki home](README.md)

Three stages, each a shell script. The whole thing is driven by one config file.

## Stage 0 — `config.sh` (paths)

The single source of truth. Everything else sources it. It defines:

| Var | Meaning | Default |
|-----|---------|---------|
| `SB_ROOT` | This `superbob/` folder | resolved from the script location (zsh & bash safe) |
| `SB_LIBRARY` | The skills library to package | the parent repo (`..`) |
| `SB_DIST` | Build output dir | `$SB_ROOT/dist` |

**This is the seam that makes SuperBob liftable into its own repo.** To move it out, copy the
`superbob/` folder and point `SB_LIBRARY` at any skills-library checkout:

```bash
export SB_LIBRARY="$HOME/Documents/Skills"
superbob/vsix/build-vsix.sh
```

Nothing else changes.

## Stage 1 — `bob/build-package.sh` (skills payload)

Reads `SB_LIBRARY`, builds the skills payload that ships inside the `.vsix`.

1. **Runs the lint gate first** — `skills/skill-library-lint/scripts/lint.py`. If it fails, the
   build **aborts**. See [the gate](#the-lint-gate).
2. Finds every `SKILL.md` under `$SB_LIBRARY/packages` and `$SB_LIBRARY/skills`.
3. Skips anything in the **`EXCLUDE`** list (see below).
4. Copies profiles, `_meta.json`, the `mission-control` router (`meta/`), and the `/superbob`
   command into the staging dir.
5. Zips it to `dist/bob-skills-package.zip`.

### EXCLUDE — what never ships (and why)

- **Licensing:** `docx pdf pptx xlsx` (source-available), the cowork set (unlicensed),
  `obsidian-cli` (no license), AGPL items.
- **Personal knowledge base:** the Obsidian `wiki*` stack + `obsidian-*` + `save canvas` —
  SuperBob never touches your own Obsidian setup. (This is why the **wiki kit** documents a
  *codebase*, not personal notes — see [kits.md](kits.md).)
- **Target-specific:** `mission-control` (shipped separately via `meta/`).

## Stage 2 — `vsix/build-vsix.sh` (the .vsix)

1. **Always** rebuilds the skills payload (Stage 1) — it no longer reuses a cached zip, which
   once shipped stale skills and skipped the gate.
2. Copies `dist/bob-skills-package.zip` → `vsix/extension/skills.zip`.
3. Zips the extension source + `skills.zip` + manifest into `dist/super-bob-skills-<ver>.vsix`.

## The lint gate

`skill-library-lint` runs on every build and checks:

| Check | Hard/Info | What |
|-------|-----------|------|
| [A] Mode integrity | hard | every skill named in a kit exists in the vault |
| [B] Router integrity | hard | every `mission-control` reference resolves |
| [C] No vendor/crypto deps | hard | mode skills don't pull in a vendor product |
| [D] Token budget | warn | flags kits over ~4000 tokens |
| [E] Egress | info | flags skills that could send data off-machine |
| [F] Coverage | info | skills in a kit vs orphaned-but-reachable |

## Install into Bob

At install, the extension unpacks `skills.zip` into `~/.bob/skills-vault`. To install the built
`.vsix`:

```bash
bobide --install-extension superbob/dist/super-bob-skills-<ver>.vsix --force
```

`bobide` is at `/Applications/IBM Bob.app/Contents/Resources/app/bin/bobide`. **Reload the Bob
window** afterward so the new extension code loads.

Next: [extension.md](extension.md) · [architecture.md](architecture.md)
