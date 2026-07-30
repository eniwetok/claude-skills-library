# SuperBob: get the most out of Bob, at every step

Your AI coding assistant can do far more than write code. It can design a system for production,
cover it with tests, check it for vulnerabilities, and review a change before it ships. SuperBob
brings that expertise to every stage of the work and applies it automatically.

So your team's best practices are built into how the assistant helps, for every developer and
every task. The work comes out strong and consistent, and you get the full value of the tool you
already have.

Those bundles of stage-specific skills are called **kits**. You load a kit for the task in front
of you, and it works on top of whatever Bob mode you're already in.

> **Credits and licensing.** SuperBob is an *aggregation*. It doesn't own these skills; each was
> written by someone else and keeps its author's license. SuperBob's own code is MIT, which
> doesn't cover the bundled skills. Full attribution: **[LICENSES.md](LICENSES.md)**.

---

## What you get

- **A kit for every stage of the lifecycle.** Plan, research, design, build, test, debug, secure, review, ship, operate, measure, document. Each kit is a curated set of skills for that stage.
- **Lean context by default.** The agent loads about 200 tokens of skills instead of 67,000, so it spends its attention on your task.
- **Auto mode.** Leave it on and SuperBob reads each task and loads the right skills itself. No setup for most work.
- **Layer onto any Bob mode.** One On/Off switch adds SuperBob's skills on top of Bob's Agent, Plan, Ask, or your own mode. Off runs plain Bob.
- **Switch three ways.** The sidebar panel, the `/superbob <kit>` chat command, or plain English ("use the test_engineering kit").
- **Build your own kits.** Name a set of skills for the work you do; one click loads it, and it gets its own `/superbob` command.
- **Your own skills stay untouched.** SuperBob only manages the skills it installed. Yours stay put through every kit switch and every on/off.
- **Pairs with a code map.** Add the optional code-review-graph tool so the agent also understands your codebase.

---

## Why it matters at scale

Write your best practices down once, and every developer gets them, everywhere they work.

- **Consistent quality for everyone.** Every developer gets the same expert practices, from their first week to their tenth year, and every change gets the same careful review.
- **Best practices, built in.** How your teams design, test, secure, and ship travels with the assistant, so it reaches the whole team automatically.
- **Productive from day one.** New hires get expert scaffolding for each stage of the lifecycle right away.
- **Full value from your tool.** The assistant helps across the whole lifecycle, not only the coding step.

### How it stays fast

Loading every skill at once would swamp the agent. It reads a one-line summary of every installed
skill before you type a word, about 67,000 tokens it will mostly ignore. SuperBob keeps the full
library in a vault the agent never reads and loads only the current kit's skills, about 200 to
2,000 tokens. Speed is a side effect of that, not the reason to use it.

---

## How it works

1. **Vault.** The full skill library sits on disk *unread*. It costs nothing until you load a kit.
2. **Kit.** A named set of skills for one kind of work (`software_development`, `test_engineering`, and so on). Loading a kit puts just those skills in front of the agent.
3. **Layering.** A kit loads on top of your current Bob mode. Stay in Bob's Agent or Plan mode, flip SuperBob on, and its skills join in. Flip it off to run plain Bob. Your own skills stay untouched either way.

The default is **Auto mode**: two small core skills stay loaded, and SuperBob reads each task and
loads the right skills as it goes. For most people that is the whole setup.

---

## A kit for each stage of the lifecycle

Each kit holds the skills for one stage of building software. Pick the stage you are in, and the
agent gets those skills and nothing else.

| Stage | Kit | What it's for | Representative skills |
|-------|-----|---------------|-----------------------|
| **Plan** | `product_management` | Shape what to build | create-prd, product-strategy, outcome-roadmap, prioritization-frameworks, user-stories |
| **Research** | `web_research` | Investigate before you commit | deep-research, research-synthesis, exa-search, search-first |
| **Design** | `production_engineering` | Architect for production | system-design, hexagonal-architecture, architecture-decision-records, api-design |
| **Build** | `software_development` | Write and change code | test-driven-development, stack patterns (Python/Go/Rust/React/FastAPI/Django), database-migrations, docker/kubernetes |
| **Build UI** | `frontend_design` | Interfaces that hold up | frontend-design, fixing-accessibility, motion-ui, design-system, design-review |
| **Test** | `test_engineering` | Prove it works | testing-strategy, e2e-testing, webapp-testing, ai-regression-testing, intended-vs-implemented |
| **Debug** | `bug_fixing` | Fix one bug, fast | systematic-debugging, caveman-debug, error-handling |
| **Secure** | `application_security` | Find and fix vulnerabilities | bb-methodology, the hunt-* skills (SQLi/XSS/SSRF/RCE), redteam-mindset, vibesec |
| **Review** | `release_review` | Check it before shipping | code-review, verification-before-completion, vibesec, ponytail-review |
| **Simplify** | `code_simplification` | Cut over-engineering | ponytail (audit/review/debt), karpathy-guidelines, code-review |
| **Operate** | *(in `production_engineering`)* | Run it in production | incident-response, runbook |
| **Measure** | `data_analysis` | Data and judging AI output | error-analysis, write-judge-prompt, validate-evaluator, evaluate-rag, sql-queries, statistical-analysis |
| **Measure retrieval** | `rag_evaluation` | Score a RAG or search system | evaluate-rag, write-judge-prompt, validate-evaluator, error-analysis |
| **Document** | `content_writing` | Write it up | no-ai-slop, documentation, doc-coauthoring, ux-copy, kb-article, article-writing |

Two **core** skills stay on under every kit: `mission-control` (routes each task to the right
skills) and `using-superpowers` (checks for a matching skill before acting).

> `release_review`, `rag_evaluation`, and `bug_fixing` are examples. Keep them, edit them, or
> delete them, and make your own for the work you actually do.

---

## Install

1. Download `super-bob-skills-<version>.vsix`.
2. In Bob or VS Code: **Extensions**, then the **`⋯`** menu, then **Install from VSIX…**, then pick the file. (Terminal alternative: `bobide --install-extension super-bob-skills-<version>.vsix`.)
3. **Reload the window.** Cmd/Ctrl+Shift+P, then *Developer: Reload Window*. Installing updates the files; the window reloads before Bob runs the new code.
4. Open the panel (below). On first run, choose **Install skills** if prompted. Your existing skills are backed up first.

Needs `unzip` (built in on macOS and Linux). Tested on IBM Bob 2.0.1.

---

## Getting started

1. Click the **SuperBob** icon in the left sidebar (the activity bar). The panel opens there, no terminal needed.
2. Leave **Auto mode** on. SuperBob picks skills per task. For most work, that is it.
3. **Start a new conversation.** Skills are read when a chat begins, so start fresh after any change.

Everything below is for when you want more control.

---

## Switching kits

**From the panel** *(most control).* Turn Auto off and click a kit's **Use**. Click **skills** to
see what's inside and what each costs. Click **Unload** to turn a kit off.

**Auto mode** *(simplest).* The top toggle. On means SuperBob picks per task. Off means you choose.

**From the chat** *(hands-free).* Type `/` and pick `/superbob`, then a kit:
- `/superbob software_development` loads that kit
- `/superbob` alone lists every kit with its description

Plain words work too: "use the test_engineering kit." After switching by any method, start a new
conversation so the agent re-reads its skills.

---

## The On/Off switch and layering

SuperBob layers on top of whatever Bob mode you're in. Turn it on and its skills load alongside
your current mode: Bob's Agent, Plan, Ask, or one of your own. Turn it off to run plain Bob.
Your own skills stay put in every case.

There's also a native **SuperBob** entry in Bob's mode selector. Use that when you want SuperBob to
be the driving role for the whole session. Use the toggle when you just want its skills on top of
another mode. Neither is required. Pick whichever fits.

---

## Build your own kit

A kit is a named set of skills you load together for one kind of work. The built-in kits cover
common stages. Make your own when your work has a recurring shape they don't match, such as
evaluating a SQL agent, reviewing Terraform changes, or triaging support tickets.

1. In the panel, click **+ Create your own kit**.
2. **Name it** in lowercase, for example `sql-evals`. That becomes the label and the `/superbob sql-evals` command.
3. Write a one-line **"what it's for"**, for example "Evaluating our SQL agent's answers." Describe the situation, not the skills. This is the cue Auto mode reads to know when to reach for it.
4. Optionally **start from** an existing kit to prefill skills, then check or uncheck. Each skill shows a short description and its token cost, so you see what a choice adds before you commit.
5. **Save.** It joins *Your kits* as a one-click kit, editable or removable anytime.

The panel ships with two sample kits under **Your kits**, `sample-rag-evals` and
`sample-content-writing`, so you can see what a small custom kit looks like. Edit them, delete
them, or copy one as a starting point.

**Keep kits lean.** The point is a small, focused context. Eight sharp skills beat thirty vague
ones. Start narrow, and add a skill when you miss it.

---

## Pair it with a code map (optional but recommended)

SuperBob loads *skills*, reusable expertise that travels across projects. By itself it doesn't know
*your* codebase. **code-review-graph** (a separate MCP tool) fills that gap. It builds a persistent
map of your repo, so the agent works from the few files a change touches instead of guessing.

The two work well together:

- **SuperBob skills** are *how* to do a kind of work (the discipline).
- **code-review-graph** is *what* your code is (the map).
- **A nested `AGENTS.md`** in a folder is *how to handle this area* (for example `reports/AGENTS.md`).

Install it from the palette: **"SuperBob: Install code-review-graph (MCP tool)"** (needs Python:
uv, pipx, or pip3), then restart Bob. It stays on once installed, independent of which kit is loaded.

---

## Command palette

`Cmd/Ctrl+Shift+P`:
- **SuperBob: Open Control Panel**
- **SuperBob: Load Kit…**
- **SuperBob: Install / Update Skills**
- **SuperBob: Show Active Kit**

The status-bar item (bottom-left) also shows the active kit. Click it to open the panel.

---

## Good to know

- **Start a new conversation after switching a kit.** Skills load at the start of a chat, so a mid-chat change waits for the next one.
- **Bob and VS Code both work.** SuperBob installs into IBM Bob (`~/.bob/skills`) and the agent in VS Code (`~/.claude/skills`). Choose targets in Settings, under `superBobSkills.targets`.
- **A VS Code extension can't register skills directly.** Skills are files the agent reads from disk. SuperBob installs those files and manages which are active.
- **Your own skills are never removed.** They stay through every kit switch and every on/off. SuperBob only manages the skills it installed.
- **SuperBob leaves your knowledge base alone.** It doesn't bundle Obsidian or personal-wiki skills. Manage those yourself.
