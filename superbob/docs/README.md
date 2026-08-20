# SuperBob — codebase wiki

Onboarding wiki for the SuperBob extension, generated with the `codebase-onboarding` skill
from the **wiki** kit. Start here, then follow the links.

## What SuperBob is

A VS Code / IBM Bob extension that packages a large skills library into a `.vsix` and lets you
load small, focused **kits** of skills per task — instead of Bob loading every skill at once.
It only ever manages `~/.bob/skills`; it touches nothing else.

```
skills library  ──input──▶  superbob/  ──builds──▶  super-bob-skills-<ver>.vsix  ──▶  IBM Bob
(../skills, ../packages)    (this project)          (dist/, git-ignored)
```

## Tech stack

| Layer | Choice |
|-------|--------|
| Extension | Plain CommonJS (`vsix/extension/extension.js`, ~775 lines, no transpile step) |
| Host API | VS Code `^1.75.0` (Bob is a Roo/Cline-family fork) |
| UI | A single webview panel (inline HTML/CSS/JS, no framework) |
| Build | POSIX shell (`config.sh` + `bob/build-package.sh` + `vsix/build-vsix.sh`) |
| Packaging | `zip` into a `.vsix`; `unzip` at install time |
| Gate | `skill-library-lint` (Python) runs on every build |

## Directory map

| Path | Purpose |
|------|---------|
| `config.sh` | Single source of truth for paths (`SB_ROOT`, `SB_LIBRARY`, `SB_DIST`) — see [build-and-release](build-and-release.md) |
| `vsix/extension/` | The extension: `extension.js`, `package.json`, `README.md`, icons — see [extension](extension.md) |
| `vsix/build-vsix.sh` | Wraps the extension + skills payload into the `.vsix` |
| `bob/build-package.sh` | Reads the library, runs the lint gate, builds the skills payload |
| `bob/profiles/` | The **kits** (one `.txt` each) + `_meta.json` descriptions — see [kits](kits.md) |
| `bob/meta/mission-control.bob.md` | The router skill shipped into the vault |
| `bob/commands/superbob.md` | The `/superbob` chat command |
| `bob/bob-native/custom_modes.yaml` | The native "SuperBob" Bob mode |
| `dist/` | Build outputs (`.vsix`, package). Git-ignored. |

## The pages

- **[architecture.md](architecture.md)** — how it works at runtime: the vault/active/profiles model, ownership, the auto-run rule, and skill scope.
- **[build-and-release.md](build-and-release.md)** — the three-stage build chain, the lint gate, and how to install.
- **[extension.md](extension.md)** — inside `extension.js`: the panel, the message handlers, and how a kit is applied.
- **[kits.md](kits.md)** — what a kit is and how to add one.

## Common tasks

| I want to... | Do this |
|--------------|---------|
| Build the `.vsix` | `superbob/vsix/build-vsix.sh` |
| Install it into Bob | `bobide --install-extension dist/super-bob-skills-<ver>.vsix --force` |
| Add a kit | See [kits.md](kits.md) |
| Change the runtime model | Edit `vsix/extension/extension.js` — [extension.md](extension.md) |
| Move SuperBob to its own repo | Set `SB_LIBRARY` to a skills-library checkout — [build-and-release.md](build-and-release.md) |
