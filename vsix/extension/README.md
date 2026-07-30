# SuperBob — best-in-class skills for every stage of your day

A developer's day is never one job. Before lunch you might design an API, fix a failing
test, review a teammate's pull request, and chase a production bug — four kinds of work,
four different disciplines. An AI agent that carries *every* skill at once is average at all
of them and slow to start. One that carries the *right handful* for the task in front of you
is sharp.

SuperBob is that switch. It installs a large library of best-practice skills — organized by
stage of the software lifecycle — and loads only the set your current task needs, on top of
whatever Bob mode you're already in. You stay in flow; the agent stays focused.

> **Credits & licensing.** SuperBob is an *aggregation*. It doesn't claim ownership of these
> skills — each was written by someone else and keeps its author's license. SuperBob's own
> code is MIT; that doesn't cover the bundled skills. Full attribution: **[LICENSES.md](LICENSES.md)**.

---

## What you get

- **A mode for every stage of the lifecycle** — plan, research, design, build, test, debug, secure, review, ship, operate, measure, document. Each is a hand-picked skill set, not a grab-bag.
- **Lean context by default** — the agent loads ~200 tokens of skills instead of ~67,000, so it spends its attention on *your task*, not a menu of a thousand skills.
- **Auto mode** — leave it on and SuperBob reads each task and pulls in the right skills itself. Zero configuration for most work.
- **Layer onto any Bob mode** — one On/Off switch adds SuperBob's skills on top of Bob's Code, Architect, Ask, or your own mode. Off = plain Bob.
- **Switch three ways** — the sidebar panel, the `/superbob <mode>` chat command, or plain English (*"use the test_engineering mode"*).
- **Build your own modes** — name a set of skills for the work you actually do; one click loads it, and it gets its own `/superbob` command.
- **Your own skills are never touched** — SuperBob only manages the skills it installed. Yours stay put through every mode switch and every on/off.
- **Pairs with a code map** — add the optional code-review-graph tool so the agent also understands *your* codebase, not just the craft.

---

## The problem

When a conversation starts, the agent loads a one-line summary of **every** installed skill.
With a full library that's roughly **67,000 tokens spent before you type a word** — context
the agent could have used to think, gone to a menu it will mostly ignore.

SuperBob keeps the full library in a **vault the agent never reads**, and loads only a small
**mode** for the job at hand — about **200–2,000 tokens**. Same skills available, ~97% less
wasted context, and the agent isn't distracted by nine hundred things you're not doing.

---

## Three ideas, and you've got it

1. **Vault** — the full skill library, sitting on disk *unread*. It costs nothing until you reach for it.
2. **Mode** — a named set of skills for one kind of work (`software_development`, `test_engineering`, …). Loading a mode puts just those skills in front of the agent.
3. **Layering** — a mode loads *on top of* your current Bob mode. Stay in Bob's Code or Architect mode and flip SuperBob on; its skills join in. Flip it off to run plain Bob. Your own skills are never touched, either way.

The default is **Auto mode**: only two tiny core skills stay loaded, and SuperBob reads each
task and pulls in the right skills on the fly. For most people that's the whole setup.

---

## Skills for each stage of the lifecycle

Each mode is a curated, best-in-class toolkit for one stage of building software. Pick the
stage you're in; the agent gets the discipline that stage demands and nothing else.

| Stage | Mode | What it's for | Representative skills |
|-------|------|---------------|-----------------------|
| **Plan** | `product_management` | Shape what to build | create-prd, product-strategy, outcome-roadmap, prioritization-frameworks, user-stories |
| **Research** | `web_research` | Investigate before you commit | deep-research, research-synthesis, exa-search, search-first |
| **Design** | `production_engineering` | Architect for production | system-design, hexagonal-architecture, architecture-decision-records, api-design |
| **Build** | `software_development` | Write and change code | test-driven-development, stack patterns (Python/Go/Rust/React/FastAPI/Django), database-migrations, docker/kubernetes |
| **Build UI** | `frontend_design` | Interfaces that hold up | frontend-design, fixing-accessibility, motion-ui, design-system, design-review |
| **Test** | `test_engineering` | Prove it works | testing-strategy, e2e-testing, webapp-testing, ai-regression-testing, intended-vs-implemented |
| **Debug** | `bug_fixing` | Fix one bug, fast | systematic-debugging, caveman-debug, error-handling |
| **Secure** | `application_security` | Find and fix vulnerabilities | bb-methodology, the hunt-* skills (SQLi/XSS/SSRF/RCE/…), redteam-mindset, vibesec |
| **Review** | `release_review` | The gate before shipping | code-review, verification-before-completion, vibesec, ponytail-review |
| **Simplify** | `code_simplification` | Cut over-engineering | ponytail (audit/review/debt), karpathy-guidelines, code-review |
| **Operate** | *(in `production_engineering`)* | Run it in production | incident-response, runbook |
| **Measure** | `data_analysis` | Data & judging AI output | error-analysis, write-judge-prompt, validate-evaluator, evaluate-rag, sql-queries, statistical-analysis |
| **Measure retrieval** | `rag_evaluation` | Score a RAG/search system | evaluate-rag, write-judge-prompt, validate-evaluator, error-analysis |
| **Document** | `content_writing` | Write it up | no-ai-slop, documentation, doc-coauthoring, ux-copy, kb-article, article-writing |

Two **core** skills are always on underneath any mode: `mission-control` (routes each task to
the right skills) and `using-superpowers` (checks for a matching skill before acting).

> `release_review`, `rag_evaluation`, and `bug_fixing` are examples — keep them, edit them, or
> delete them. Make your own for the shape of work you actually do (see *Build your own mode*).

---

## Install

1. Download **`super-bob-skills-<version>.vsix`**.
2. In Bob / VS Code: **Extensions** → **`⋯`** menu → **Install from VSIX…** → pick the file.
   *(Terminal alternative: `bobide --install-extension super-bob-skills-<version>.vsix`.)*
3. **Reload the window** — Cmd/Ctrl+Shift+P → *Developer: Reload Window*. (Installing updates
   the files; the window has to reload before Bob runs the new code.)
4. Open the panel (below); on first run, choose **Install skills** if prompted. Your existing
   skills are backed up first.

Needs `unzip` (built in on macOS and Linux). Tested on **IBM Bob 2.0.1**.

---

## Getting started (three steps)

1. Click the **SuperBob** icon in the left sidebar (the activity bar). The panel opens there — no terminal needed.
2. Leave **Auto mode** on. SuperBob picks skills per task. For most work, that's it.
3. **Start a new conversation.** Skills are read when a chat begins, so start fresh after any change.

Everything below is for when you want more control.

---

## Switching modes — three ways

**From the panel** *(most control).* Turn Auto off and click a mode's **Use**. Click **skills**
to see what's inside and what each costs. Click **Unload** to turn a mode off.

**Auto mode** *(simplest).* The top toggle. On = SuperBob picks per task. Off = you choose.

**From the chat** *(hands-free).* Type `/` and pick **`/superbob`**, then a mode:
- `/superbob software_development` — load that mode
- `/superbob` alone — list every mode with its description

Plain words work too: **"use the test_engineering mode."** After switching by any method,
**start a new conversation** so the agent re-reads its skills.

---

## The On/Off switch, and layering

SuperBob **layers on top of whatever Bob mode you're in**. Turn it on and its skills load
alongside your current mode — Bob's Code, Architect, Ask, or one of your own. Turn it off to
run plain Bob. **Your own skills stay put in every case.**

There's also a native **SuperBob** entry in Bob's mode selector. Use *that* when you want
SuperBob to be the driving role for the whole session; use the *toggle* when you just want its
skills on top of another mode. Neither is required — pick whichever fits the moment.

---

## Build your own mode

A **mode** is a named set of skills you load together for one kind of work. The built-ins
cover common stages; make your own when your work has a recurring shape they don't match —
*evaluating our SQL agent*, *reviewing Terraform changes*, *triaging support tickets*.

1. In the panel, click **+ Create your own mode**.
2. **Name it** in lowercase, e.g. `sql-evals`. That becomes the label and the `/superbob sql-evals` command.
3. Write a one-line **"what it's for"** — e.g. *Evaluating our SQL agent's answers*. Describe the *situation*, not the skills; this is the cue Auto mode reads to know when to reach for it.
4. Optionally **start from** an existing mode to prefill skills, then check or uncheck. Each skill shows a short description and its token cost, so you see what a choice adds before you commit.
5. **Save.** It joins *Your modes* as a one-click mode, editable or removable anytime.

**Keep modes lean.** The point is a small, focused context — eight sharp skills beat thirty
vague ones. Start narrow; add a skill when you actually miss it.

---

## Pair it with a code map (optional but recommended)

SuperBob loads *skills* — reusable expertise that travels across projects. It doesn't, by
itself, know *your* codebase. **code-review-graph** (a separate MCP tool) fills that gap: it
builds a persistent, incremental map of your repo, so the agent works from the few files a
change actually touches instead of guessing.

The two compose well. A rule of thumb:

- **SuperBob skills** = *how* to do a kind of work (the discipline).
- **code-review-graph** = *what* your code is (the map).
- **A nested `AGENTS.md`** in a folder = *how to handle this specific area* (e.g. `reports/AGENTS.md`).

Install it from the palette: **"SuperBob: Install code-review-graph (MCP tool)"** (needs
Python — uv, pipx, or pip3), then restart Bob. It's always-on once installed, independent of
mode.

---

## Command palette

`Cmd/Ctrl+Shift+P`:
- **SuperBob: Open Control Panel**
- **SuperBob: Load Profile…**
- **SuperBob: Install / Update Skills**
- **SuperBob: Show Active Profile**

The status-bar item (bottom-left) also shows the active mode; click it to open the panel.

---

## Good to know

- **Start a new conversation after switching a mode.** Skills load at the start of a chat, so a mid-chat change waits for the next one.
- **Bob and VS Code both work.** SuperBob installs into IBM Bob (`~/.bob/skills`) and the agent in VS Code (`~/.claude/skills`). Choose targets in Settings → `superBobSkills.targets`.
- **A VS Code extension can't register skills directly.** Skills are files the agent reads from disk; SuperBob installs those files and manages which are active.
- **Your own skills are never removed.** They stay through every mode switch and every on/off — SuperBob only manages the skills it installed.
- **SuperBob leaves your knowledge base alone.** It doesn't bundle Obsidian/personal-wiki skills; manage those yourself.
