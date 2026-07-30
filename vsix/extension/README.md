# SuperBob 🦸 — Best-Practice Skills for Bob & VS Code

**SuperBob gives IBM Bob (and VS Code) its superpowers.** It installs a big library of
best-practice skills and lets you load only the ones a task needs — so the agent stays
fast and focused instead of drowning in a thousand skills at once.

> **Credits & licensing.** SuperBob is an **aggregation** — it does not claim ownership of
> these skills. Each was created by other people and remains under its author's own
> license. SuperBob's own code is MIT; that does not cover the bundled skills. Full
> attribution is in **[LICENSES.md](LICENSES.md)**.

---

## Why it exists (30-second version)

An AI agent loads a one-line summary of **every** installed skill when a conversation
starts. With ~1,500 skills that's about **67,000 tokens before you type a word** — it
crowds out the space the agent needs to think.

SuperBob fixes this. It keeps the full library in a **vault** the agent doesn't read, and
loads only a small **mode** for the job in front of you (about **200–2,000 tokens**).
**Roughly a 97% cut in wasted context.**

---

## Install

1. Download **`super-bob-skills-<version>.vsix`**.
2. In Bob / VS Code: **Extensions** panel → **`⋯`** menu → **Install from VSIX…** → pick the file.
   *(Or in a terminal: `bobide --install-extension super-bob-skills-<version>.vsix`.)*
3. **Reload the window** (Cmd/Ctrl+Shift+P → *Developer: Reload Window*).
4. Open the panel (below) and, on first run, choose **Install skills** if prompted — that
   unpacks the library into place. Your previous skills are backed up first.

Requires `unzip` (built in on macOS and Linux). Tested on **IBM Bob 2.0.1**.

---

## Getting started (the whole thing in 3 steps)

1. **Click the SuperBob robot icon** in the **left sidebar** (the activity bar). The Skills
   panel opens there — no terminal needed.
2. **Leave "Auto mode" on** (it's on by default). SuperBob reads each task and pulls in the
   right skills automatically. For most people, that's the entire setup.
3. **Start a new conversation.** Skills load when a conversation begins, so after any change
   start a fresh chat.

That's it. Everything below is for when you want more control.

---

## Three ways to switch modes

**1. From the sidebar panel** *(most control)*
Turn Auto off and click a mode's **Use** button. Click **skills** to see exactly what a
mode includes and what each skill costs. Click **Unload** on an active mode to turn it off.

**2. Auto mode** *(simplest)*
The toggle at the top. On = SuperBob picks skills per task. Off = you choose a mode.

**3. From the Bob chat** *(hands-free)*
Type **`/`** in the chat and choose **`/superbob`**, then a mode:
- `/superbob super-rag` — load the super-rag mode
- `/superbob super-code`, `/superbob super-data`, `/superbob auto`, … — any mode
- `/superbob` alone — lists every mode with its description

You can also just type in plain words: **"use the super-rag mode"** (the `super-` prefix is optional — "use the rag mode" works too).

> After switching by any method, **start a new conversation** so the agent re-reads its skills.

---

## The sidebar panel, part by part

- **Auto mode toggle** — let SuperBob choose per task (recommended default).
- **Active card** — shows what's loaded right now, including the two always-on core skills
  (`using-superpowers`, `mission-control`), each with a short description and token cost.
- **Your modes** — Lean plus any modes you've made. Each has **Use** / **Unload**, a
  **skills** link (name + description + tokens for every skill), and 🗑 to delete.
- **Starter modes (built-in)** — a collapsed section with 8 ready-made modes.
- **+ Create your own mode** — see below.

---

## The modes

Each mode loads a focused set of skills. The two **core** skills are always on.

| Mode | Use it for | Key skills |
|------|-----------|-----------|
| **Auto / Lean** | Mixed work — SuperBob picks per task | *(core only, ~200 tokens)* |
| **super-code** | Building or changing software | tdd-workflow, codebase-exploration, api/system-design, stack patterns, docker/kubernetes |
| **super-data** | Data & judging AI output | error-analysis, write-judge-prompt, validate-evaluator, evaluate-rag, SQL, embeddings, statistics |
| **super-rag** | Evaluating a RAG / retrieval agent | evaluate-rag, error-analysis, LLM judges, SQL checks, statistics |
| **super-security** | Audits & vulnerability hunting | bb-methodology, security-audit, hunt-* skills, redteam-mindset |
| **super-ui** | Interfaces & design | frontend-design, fixing-accessibility, motion, design systems, improve-ui |
| **super-pm** | Product planning | create-prd, product-vision, roadmaps, prioritization, user stories |
| **super-dev** | Production-grade engineering (full lifecycle) | system-design, hexagonal-architecture, test-driven-development, docker/kubernetes/deployment, vibesec, compliance-check, incident-response |
| **super-qa** | Quality assurance & testing | testing-strategy, e2e-testing, webapp-testing, browser-qa, ai-regression-testing, systematic-debugging, intended-vs-implemented, pr-feedback-quality-gate |
| **super-research** | Investigate a topic (one-off answer) | deep-research, research-synthesis, exa-search, x-research, search-first |
| **super-ship-it** | Quality gate before shipping | code-review, verification-before-completion, vibesec, tests |
| **super-quick-fix** | Fast debugging | systematic-debugging, caveman-debug, error-handling |

*(rag, ship-it and quick-fix are examples you can keep, tweak, or delete.)*

> **Note:** SuperBob does not bundle Obsidian / personal-wiki skills — you manage
> your own knowledge-base setup, and SuperBob leaves it untouched.

---

## Build your own mode

1. In the panel, click **+ Create your own mode**.
2. **Name it** (e.g. `my-evals`) and add a short **"what it's for"** description — this is
   what tells you (and SuperBob) when to use it.
3. Optionally **start from** an existing mode, then tick or untick skills. The list shows a
   short description for each skill so you know what you're adding.
4. Click **Save mode**. It appears as a one-click mode you can **Use** anytime — or delete
   with 🗑.

---

## Command palette (optional)

`Cmd/Ctrl+Shift+P`:
- **SuperBob: Open Control Panel**
- **SuperBob: Load Profile…**
- **SuperBob: Install / Update Skills**
- **SuperBob: Show Active Profile**

The status-bar item (bottom-left) also shows the active mode; click it to open the panel.

---

## Optional: code-review-graph (code-map MCP tool)

SuperBob loads *skills*. **code-review-graph** is a separate *tool* (an MCP server) that
builds a map of your codebase so the agent reviews only the files a change affects — it
pairs well with the `super-code`, `super-ship-it`, and `super-declutter` modes. To deploy it into Bob and
Claude Code, run the command **"SuperBob: Install code-review-graph (MCP tool)"** from the
palette (needs Python: uv, pipx, or pip3). Then restart Bob. It's optional and always-on
once installed, independent of which mode you're in.

## Good to know

- **Always start a new conversation after switching a mode** — skills are read at the start
  of a chat, so a mid-chat change doesn't take effect until the next one.
- **Bob vs VS Code.** SuperBob installs into IBM Bob (`~/.bob/skills`) and the agent in VS
  Code (`~/.claude/skills`). Choose which in Settings → `superBobSkills.targets`.
- **A VS Code extension can't register agent skills directly.** Skills are files the agent
  reads from disk; SuperBob installs those files and manages which are loaded.
- **Nothing is deleted.** Your existing skills are backed up before install.
