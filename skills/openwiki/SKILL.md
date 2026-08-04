---
name: openwiki
version: "1.0.0"
description: >
  Use this skill whenever the user wants to generate, update, or explore an
  auto-maintained wiki with the OpenWiki CLI (langchain-ai/openwiki) — building
  linked-Markdown documentation for a code repository ("document this repo",
  "generate a code wiki", "keep the docs in sync with the code"), or building a
  personal knowledge wiki from connected sources like Notion, Slack, Gmail, or X
  ("ingest my Notion into a wiki", "build a personal knowledge base"). Also trigger
  for updating an existing OpenWiki wiki, launching its node-graph visualizer, or
  wiring OpenWiki into CI. This skill wraps the external `openwiki` npm CLI: it tells
  Claude how and when to run it — the CLI does the actual generation. Skip for pure
  Markdown editing, for Obsidian vault operations (use obsidian-cli), or for
  in-session repo summaries that do not need a persisted, self-updating wiki.
triggers:
  - "openwiki"
  - "open wiki"
  - "generate a code wiki"
  - "document this repo"
  - "auto-update the docs"
  - "personal knowledge wiki"
  - "wiki from Notion / Slack / Gmail"
metadata:
  upstream: https://github.com/langchain-ai/openwiki
  license: MIT
  kind: cli-wrapper
  network: yes
---

# OpenWiki CLI

Wraps [langchain-ai/openwiki](https://github.com/langchain-ai/openwiki) (MIT), an
AI CLI that generates and keeps a linked-Markdown wiki in sync — for a **code
repository** or a **personal knowledge base**. Output follows the Open Knowledge
Format (OKF v0.1): plain Markdown with optional Mermaid diagrams, so any agent can
read it as memory.

> **This skill is guidance, not the tool.** OpenWiki is a separate npm program.
> This skill tells Claude/Bob when to reach for it and how to invoke it correctly.

## Runs inside Bob — how it's set up

This is a **Bob tool.** It is enabled from the **SuperBob sidebar → Optional tools →
OpenWiki** toggle. Turning that toggle on:

1. installs the `openwiki` CLI (through Bob's login shell, so it uses Bob's env), and
2. activates this skill.

So by the time this skill is loaded, **the CLI is installed and you run it as
`openwiki …` inside Bob's terminal** — no `npx`, no separate setup. If the toggle is off,
the CLI is not present and this skill should not be driving anything.

## ⚠️ Network and privacy (surface before the first run)

OpenWiki is a **networked tool** and deliberately lives *outside* SuperBob's egress-free
kits, as an opt-in tool:

- **It calls a model.** It reads a key from Bob's environment — `ANTHROPIC_API_KEY`,
  `OPENAI_API_KEY`, or `GEMINI_API_KEY`. Assume Bob's env provides it. If none is set,
  add one to `~/.bob/.env` (the sidebar warns when it's missing). Your code/notes are
  sent to that provider.
- **Connectors read external accounts.** Personal mode can pull from Notion, Slack,
  Gmail, and X. Only authenticate the connectors the user explicitly asks for.
- **Telemetry is on by default.** Set `OPENWIKI_TELEMETRY_DISABLED=1` in Bob's env to
  turn it off — do this unless the user says otherwise.

The only hard prerequisites are **Node.js** and a **model key in Bob's env** — no
packaging trick removes those, because it's a networked CLI.

## Code mode — document a repository (default)

Run from the repo root. Output is written to `openwiki/` in the repo.

```bash
openwiki --init        # build the code wiki for the first time
openwiki --update      # refresh it after code changes
```

- Exclude paths with a gitignore-style **`.openwikiignore`** at the repo root.
- Add repo-specific guidance in **`openwiki/INSTRUCTIONS.md`** (user-authored) to
  steer what the wiki emphasizes.
- `-p` / `--print` does a one-shot, non-interactive run that prints the result and
  exits — use this in scripts/CI.
- `--language <locale>` generates the wiki in another language.

## Personal mode — knowledge base from connected sources

Output is written to `~/.openwiki/wiki`.

```bash
openwiki auth <provider>     # slack | gmail | x | notion  (only what's asked for)
openwiki ingest <source>     # 'all' or a specific connector
openwiki personal --init     # build the personal wiki
openwiki personal --update   # refresh it
```

## Explore the wiki

```bash
openwiki visualize                 # interactive node-graph explorer
openwiki visualize --port 4000     # pick a port
openwiki visualize --no-open       # don't auto-open a browser
```

## Keep it fresh (CI)

For a self-updating wiki, run `openwiki --update -p` on a schedule (GitHub
Actions, GitLab CI, Bitbucket Pipelines). The `-p` flag keeps it non-interactive. The API
key must be available as a CI secret — never commit it. (A global install is also fine in
CI if you prefer a pinned version.)

## How this fits the rest of the library

- **`wiki` / `wiki-ingest` / `wiki-query` / `wiki-cli`** — in-Claude Obsidian-style
  knowledge base. Use these when you want the wiki *inside* the session/vault instead
  of a separate on-disk tool.
- **`codebase-onboarding` / `code-tour` / `code-review-graph`** — repo understanding
  without installing an external CLI.
- Reach for **OpenWiki** specifically when the user wants a **persisted, self-updating,
  visualizable** wiki on disk (OKF/Markdown) that CI keeps current — that is the gap it
  fills over the in-session skills.
