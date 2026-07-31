# SuperBob: expert skills for Bob, loaded per task

Bob is a capable coding assistant. SuperBob makes it sharper at each specific job by giving it a
library of expert skills and loading the right ones for whatever you're working on.

Instead of generic help, Bob works with focused expertise: the skill for writing a feature
test-first, the skill for reviewing a change for security, the skill for shaping a PRD. You pick
the set you need, or let SuperBob pick, and Bob loads just those skills on top of your current
Bob mode.

Each set of skills is a **kit**. Kits cover the whole software lifecycle, so whether you're a
developer, a product manager, or anywhere in between, Bob brings the right know-how to the task
and your work comes out sharper and more consistent. That's the idea behind the name: Bob, plus
the right expert skill for the moment.

> **Credits and licensing.** SuperBob is an *aggregation*. It doesn't own these skills; each was
> written by someone else and keeps its author's license. SuperBob's own code is MIT, which
> doesn't cover the bundled skills. Full attribution: **[LICENSES.md](LICENSES.md)**.

---

## What you get

- **A kit for each kind of work.** Coding, testing, debugging, security, review, product, research, writing, and more. Each kit is a focused set of skills.
- **Lean by default.** Bob loads about 200 tokens of skills instead of 67,000, so it stays fast and keeps its attention on your task.
- **Auto mode.** Leave it on and SuperBob picks the right kit for each task. No setup for most work.
- **Layers on your Bob mode.** One On/Off switch adds a kit's skills on top of Bob's Agent, Plan, or Ask mode. Off runs plain Bob.
- **Switch three ways.** The sidebar panel, the `/superbob <kit>` command, or plain English ("use the test_engineering kit").
- **Build your own kits.** Group the skills you use for a recurring job; one click loads them.
- **Your own skills stay untouched.** SuperBob only manages the skills it installed.

---

## Why it matters at scale

Write your best practices down once, and every developer gets them, everywhere they work.

- **Consistent quality for everyone.** Every developer gets the same expert skills, from their first week to their tenth year, and every change gets the same careful review.
- **Best practices, built in.** How your teams design, test, secure, and ship travels with the assistant, so it reaches the whole team automatically.
- **Productive from day one.** New hires get expert scaffolding for each kind of work right away.
- **Full value from your tool.** Bob helps across the whole lifecycle, not only the coding step.

### How it stays fast

Bob normally loads a one-line summary of every installed skill before you type a word, about
67,000 tokens with a full library. SuperBob keeps the library in a vault Bob never reads and
loads only the current kit's skills, about 200 to 2,000 tokens.

---

## How it works

1. **Vault.** The full skill library sits on disk, unread. It costs nothing until you load a kit.
2. **Kit.** A named set of skills for one kind of work. Loading a kit puts just those skills in front of Bob.
3. **Layering.** A kit loads on top of your current Bob mode. Stay in Bob's Agent or Plan mode, flip SuperBob on, and its skills join in. Flip it off to run plain Bob. Your own skills stay untouched either way.

The default is **Auto mode**: two small core skills stay loaded, and SuperBob picks the right kit
as you work. For most people that is the whole setup.

---

## The kits, across the lifecycle

Kits cover the whole software lifecycle. Reach for the ones that match the phase you're in.

**Plan and research**
- `product_management`: PRDs, roadmaps, prioritization, and go-to-market
- `web_research`: research a topic and synthesize an answer

**Design and build**
- `production_engineering`: design and ship production-grade systems, including deploy and operate
- `software_development`: write and change code, test-first, across your stack
- `frontend_design`: build and polish web interfaces

**Test and review**
- `test_engineering`: unit, end-to-end, and regression tests
- `bug_fixing`: find and fix a specific bug, fast
- `application_security`: find and fix vulnerabilities, and write secure code
- `release_review`: review a change before it ships
- `code_simplification`: cut over-engineering

**Analyze and document**
- `data_analysis`: SQL, statistics, and judging AI output
- `rag_evaluation`: score a RAG or search system
- `content_writing`: write and edit docs and copy

Two **core** skills stay on under every kit: `mission-control` (picks the right skills for a task)
and `using-superpowers` (checks for a matching skill before acting).

---

## Install

1. Download `super-bob-skills-<version>.vsix`.
2. In Bob: **Extensions**, then the **`⋯`** menu, then **Install from VSIX…**, then pick the file. (Terminal alternative: `bobide --install-extension super-bob-skills-<version>.vsix`.)
3. **Reload the window.** Cmd/Ctrl+Shift+P, then *Developer: Reload Window*. Installing updates the files; the window reloads before Bob runs the new code.
4. Open the panel (below). On first run, choose **Install skills** if prompted. Your existing skills are backed up first.

Needs `unzip` (built in on macOS and Linux). Tested on IBM Bob 2.0.1.

---

## Getting started

1. Click the **SuperBob** icon in the left sidebar (the activity bar). The panel opens there, no terminal needed.
2. Leave **Auto mode** on. SuperBob picks the right kit per task. For most work, that is it.
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
conversation so Bob re-reads its skills.

---

## The On/Off switch and layering

SuperBob layers on top of whatever Bob mode you're in. Turn it on and a kit's skills load
alongside your current mode: Bob's Agent, Plan, Ask, or one of your own. Turn it off to run plain
Bob. Your own skills stay put in every case.

There's also a native **SuperBob** entry in Bob's mode selector. Use that when you want SuperBob to
be the driving role for the whole session. Use the toggle when you just want a kit's skills on top
of another mode. Neither is required. Pick whichever fits.

---

## Build your own kit

A kit is a named set of skills you load together for one kind of work. The built-in kits cover
common jobs. Make your own when your work has a recurring shape they don't match, such as
evaluating a SQL agent, reviewing Terraform changes, or triaging support tickets.

1. In the panel, click **+ Create your own kit**.
2. **Name it** in lowercase, for example `sql_evals`. That becomes the label and the `/superbob sql_evals` command.
3. Write a one-line **"what it's for"**, for example "Evaluating our SQL agent's answers." Describe the situation, not the skills. This is the cue Auto mode reads to know when to reach for it.
4. Optionally **start from** an existing kit to prefill skills, then check or uncheck. Each skill shows a short description and its token cost.
5. **Save.** It joins *Your kits* as a one-click kit, editable or removable anytime.

The panel ships with two sample kits under **Your kits**, `sample_rag_evals` and
`sample_content_writing`, so you can see what a small custom kit looks like. Edit them, delete
them, or copy one as a starting point.

**Keep kits lean.** The point is a small, focused context. Eight sharp skills beat thirty vague
ones. Start narrow, and add a skill when you miss it.

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
- **Bob reads skills as files.** Bob looks for `SKILL.md` files in `~/.bob/skills`. SuperBob installs those files into `~/.bob/skills` and controls which are active. It only touches Bob's own skills directory.
- **Your own skills are never removed.** They stay through every kit switch and every on/off. SuperBob only manages the skills it installed.
- **SuperBob leaves your knowledge base alone.** It doesn't bundle Obsidian or personal-wiki skills. Manage those yourself.

---

## Where the skills come from

SuperBob doesn't write these skills. It bundles open-source skills from the authors below, and
each stays under its own license. SuperBob's own code (the installer, kit system, and
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

Full attribution and license terms: [LICENSES.md](LICENSES.md).
