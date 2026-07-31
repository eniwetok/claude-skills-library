# SuperBob (IBM Bob extension)

**SuperBob is a way to use your [skills library](../README.md) inside IBM Bob.**

It is a standalone extension project. It does **not** own or maintain the skills. It *packages*
the library's skills into a `.vsix` you install in Bob, and it adds the Bob-side machinery
(kits, the `/superbob` command, the on/off panel, a native SuperBob mode) that lets you load a
small, focused set of those skills per task.

```
skills library         ── input ──▶   superbob/  ── builds ──▶  super-bob-skills-<ver>.vsix
(skills/, packages/)                   (this project)             (installs into IBM Bob)
```

The extension only ever manages `~/.bob/skills`. It touches nothing outside `~/.bob`.

---

## Layout

```
superbob/
├── config.sh          Single source of truth for paths. SB_LIBRARY points at the
│                       skills library (defaults to the parent repo for now).
├── vsix/
│   ├── extension/      The VS Code / Bob extension source (extension.js, package.json, icons, README).
│   ├── build-vsix.sh   Builds the .vsix.
│   ├── [Content_Types].xml, extension.vsixmanifest
│   └── assets/         Logo sources, sidebar icons.
├── bob/
│   ├── build-package.sh   Reads the library (SB_LIBRARY) and builds the skills payload.
│   ├── profiles/          The kits (one .txt per kit) + _meta.json descriptions.
│   ├── meta/              mission-control router variants.
│   ├── commands/          The /superbob chat command.
│   ├── bob-native/        The native SuperBob Bob mode (custom_modes.yaml).
│   ├── bob-profile        CLI kit loader.
│   └── BOB-INSTALL-INSTRUCTIONS.md, LICENSES.md
├── tools/             deploy-code-review-graph.sh (optional code-map MCP helper).
└── dist/              Build outputs (.vsix, skills package). Not committed.
```

## Build

```bash
superbob/vsix/build-vsix.sh
```

That runs `superbob/bob/build-package.sh` first (reads the library, runs the `skill-library-lint`
gate, produces the skills package), then wraps it with the extension source into the `.vsix`
under `superbob/dist/`. Install it with:

```bash
bobide --install-extension superbob/dist/super-bob-skills-<ver>.vsix --force
```

## Relationship to the library

The build reads the library from `SB_LIBRARY` (see `config.sh`). Right now SuperBob lives as a
subfolder of the library repo, so `SB_LIBRARY` defaults to the parent directory. **To move
SuperBob into its own repo later**, copy this `superbob/` folder out, then point it at a skills-library checkout:

```bash
export SB_LIBRARY="$HOME/Documents/Skills"   # a skills-library checkout
superbob/vsix/build-vsix.sh
```

Nothing else changes. That is the whole point of `config.sh`.
