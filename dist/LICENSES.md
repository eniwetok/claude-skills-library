# Credits & Licensing

**SuperBob is an aggregation.** It does not claim ownership of the skills it installs.
Each skill was created by other people and remains under its original author's license.
This file records who made what and under what terms.

**SuperBob's own code** — the installer, the profile system, the `bob-profile` script,
and the `mission-control` router — is licensed **MIT** by the project maintainer. That
MIT license covers only that original code, **not** the bundled third-party skills.

---

## Sources included in the shareable package (confirmed permissive licenses)

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
| [anthropics/skills](https://github.com/anthropics/skills) | Anthropic | Apache 2.0 * |
| [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | Anthropic | Apache 2.0 |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | nexu-io | Apache 2.0 |
| [n8n-io/skills](https://github.com/n8n-io/skills) | n8n-io | Apache 2.0 |

\* Anthropic's `docx`, `pdf`, `pptx`, `xlsx` skills are **source-available, not open
source**, so they are **excluded** from this package (see below).

## Deliberately EXCLUDED from the shareable package

To stay legally clean when redistributing, the following are **not** bundled:

| Excluded | Source | Why |
|----------|--------|-----|
| `codebase-exploration`, `codebase-management` | [SocratiCode](https://github.com/giancarloerra/SocratiCode) | **AGPL-3.0** — strong copyleft obligations on redistribution |
| `docx`, `pdf`, `pptx`, `xlsx` | anthropics/skills | **Source-available, not open source** — restricted terms |
| 15 Cowork skills (`email-drafter`, `slide-deck-builder`, …) | Brock (YouTube) | **No license** — unlicensed content |
| `obsidian-cli` | pablo-mano/Obsidian-CLI-skill | **No formal license** ("provided as-is") |

If you want any of these, install them yourself from the original source and follow
that source's terms.

## The skills written for this project

`mission-control`, `caveman-debug`, `cowork-package`, `pm-agent`,
`pptx-from-template`, and `update-skills-library` were written for this library and
are MIT. Source: https://github.com/eniwetok/claude-skills-library
