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

---

## Where the skills come from

SuperBob doesn't write these skills — it bundles open-source skills from the authors below,
each under its own license. This is the subset of the root library that SuperBob actually
ships (the excluded sources are not listed). SuperBob's own code (installer, kit system,
`mission-control` router) is MIT.

| Source | Author | License |
|--------|--------|---------|
| [obra/superpowers](https://github.com/obra/superpowers) | Jesse Vincent | MIT |
| [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | Paweł Huryn | MIT |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | affaan-m | MIT |
| [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | ruvnet | MIT |
| [zhangzhang-111-i/claude-skills](https://github.com/zhangzhang-111-i/claude-skills) | zhangzhang-111-i | MIT |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | elementalsouls | MIT |
| [ibelick/ui-skills](https://github.com/ibelick/ui-skills) | ibelick | MIT |
| [hamelsmu/evals-skills](https://github.com/hamelsmu/evals-skills) | Hamel Husain | MIT |
| [team-attention/agent-council](https://github.com/team-attention/agent-council) | team-attention | MIT |
| [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | multica-ai | MIT |
| [dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) | Dietrich Gebert | MIT |
| [petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) | Peter Yang | MIT |
| [anthropics/skills](https://github.com/anthropics/skills) | Anthropic | Apache 2.0 |
| [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | Anthropic | Apache 2.0 |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | nexu-io | Apache 2.0 |
| [n8n-io/skills](https://github.com/n8n-io/skills) | n8n-io | Apache 2.0 |
| [BehiSecc/VibeSec-Skill](https://github.com/BehiSecc/VibeSec-Skill) | BehiSecc | Apache 2.0 |

Full attribution and license terms: [bob/LICENSES.md](bob/LICENSES.md). The user-facing copy
shipped in the extension lives in [vsix/extension/README.md](vsix/extension/README.md).
