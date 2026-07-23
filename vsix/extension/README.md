# SuperBob 🦸  —  Best-Practice Skills for Bob & VS Code

**SuperBob gives IBM Bob (and VS Code) its superpowers.** It installs a curated library
of **best-practice skills** — gathered from 19 open-source sources — and switches skill
**profiles** from the command palette so the agent only ever loads what the task at hand
needs.

---

> **Credits & licensing.** SuperBob is an **aggregation** — it does not claim ownership
> of these skills. Each was created by other people and remains under its author's own
> license. SuperBob's own code (installer, profile system, mission-control router) is
> MIT; that does **not** cover the bundled skills. Full attribution for all
> sources is in **[LICENSES.md](LICENSES.md)**.

## What this solves

An agent loads every installed skill's name and description at the start of a
conversation. The full library is about **67,000 tokens** before you type anything —
it crowds out the room the agent needs to think.

This extension keeps the full library in a vault the agent does not read, and loads
only a small **task profile** (about **2,000 tokens**). You pick a profile for the job
in front of you; everything else stays out of the way. **Roughly a 97% cut in context.**

## Commands  (Cmd / Ctrl + Shift + P)

- **SuperBob: Install / Update Skills** — puts the library in place
- **SuperBob: Load Profile…** — choose the task you're doing
- **SuperBob: Show Active Profile** — see what's loaded

A status-bar item (bottom-left) shows the active profile. Click it to switch. After
switching, **restart the conversation** so the agent re-reads its skills.

---

## The categories, and when to use each skill

Every profile also loads a small **Always-on core** (below). Counts show how many skills
each profile loads.

### Always on — loaded with every task
| Skill | Use it when |
|-------|-------------|
| **mission-control** | Starting any real task — it picks the right skills, in order |
| **using-superpowers** | Always: it forces a check for a relevant skill before acting |
| **karpathy-guidelines** | Writing any code — keeps changes minimal and honest |
| **brainstorming** | The requirements are still fuzzy and need exploring |
| **writing-plans** | You have a design and need a concrete plan before coding |
| **systematic-debugging** | Anything is broken — find the root cause before patching |
| **verification-before-completion** | Before calling any task "done" |
| **caveman-debug** | No debugger available — instrument with print statements |

### Build software  (24 skills)
> Features, tests, APIs, and infrastructure.

| Skill | Use it when |
|-------|-------------|
| **tdd-workflow** | Building a new behavior — write the test first |
| **codebase-exploration** | Landing in unfamiliar code and need the map |
| **architecture-decision-records** | You made a design decision worth recording |
| **error-handling** | Deciding how failures should surface and recover |
| **api-design / system-design** | Shaping a new service or endpoint |
| **hexagonal-architecture** | Keeping business logic independent of frameworks |
| **python / golang / rust / react / django / fastapi patterns** | Working in that stack |
| **postgres-patterns / database-migrations** | Touching the database or its schema |
| **docker / kubernetes / deployment patterns** | Packaging or shipping the app |
| **performance-analysis** | It works but it's slow |

### Data & evaluation  (21 skills)  — the Cognos work
> Evaluations, SQL, retrieval, and analytics.

| Skill | Use it when |
|-------|-------------|
| **error-analysis** | Starting any eval — read real traces, name the failure modes. Start here. |
| **eval-audit** | You inherited evals and don't trust them |
| **write-judge-prompt** | A failure needs judgment code can't check (tone, faithfulness) |
| **validate-evaluator** | Always after a judge — calibrate it against human labels |
| **generate-synthetic-data** | Real test data is too thin |
| **evaluate-rag** | Grading a retrieval system — score search and answer separately |
| **build-review-interface** | You need humans to label traces |
| **sql-queries / write-query** | Writing or reviewing SQL |
| **iterative-retrieval / embeddings / agentdb-vector-search** | Building retrieval |
| **mle-workflow** | Running an ML training/eval loop |
| **statistical-analysis / data-visualization / explore-data** | Making sense of a dataset |

### Product  (20 skills)
> PRDs, roadmaps, strategy, user stories.

| Skill | Use it when |
|-------|-------------|
| **create-prd** | Writing a product requirements doc |
| **product-vision / product-strategy** | Setting direction |
| **outcome-roadmap** | Planning what ships and in what order |
| **prioritization-frameworks** | Too many things to do, need to choose |
| **user-stories / job-stories** | Turning needs into buildable units |
| **opportunity-solution-tree** | Mapping problems to possible solutions |
| **competitor-analysis / market-sizing** | Researching the market |
| **user-personas** | Defining who you're building for |
| **lean-canvas / swot-analysis** | Framing a business or a bet |
| **gtm-strategy / north-star-metric** | Planning a launch and how you'll measure it |
| **stakeholder-map / summarize-meeting / retro / release-notes** | Running the process |

### Security  (17 skills)
> Audits and vulnerability hunting.

| Skill | Use it when |
|-------|-------------|
| **security-audit** | Reviewing your own code for weaknesses (during development) |
| **bb-methodology** | Running a dedicated security engagement (the orchestrator) |
| **redteam-mindset** | You need to think like an attacker |
| **hunt-sqli / xss / auth-bypass / idor / ssrf / rce** | Hunting that specific class of bug |
| **hunt-cloud-misconfig / hunt-k8s** | Auditing cloud or Kubernetes |
| **hunt-llm-ai** | Testing an AI/LLM feature for abuse |
| **evidence-hygiene / report-writing** | Documenting and disclosing findings |

### Interfaces  (14 skills)
> UI, accessibility, design, motion.

| Skill | Use it when |
|-------|-------------|
| **frontend-design** | Building a new interface from scratch |
| **baseline-ui** | Cleaning up rough, AI-generated UI |
| **fixing-accessibility** | Making an existing interface usable by everyone |
| **fixing-motion-performance** | Animations stutter or jank |
| **fixing-metadata** | Setting page titles and social-share previews |
| **improve-ui** | Auditing a UI without touching its code (writes a plan) |
| **shadcn-ui / design-system / frontend-patterns** | Working within a design system |
| **motion-ui** | Adding animations and transitions |
| **impeccable-design-polish** | Final polish pass before shipping a page |

### Research  (14 skills)
> Notes, wiki, deep research.

| Skill | Use it when |
|-------|-------------|
| **deep-research** | You need a thorough, cited answer on a topic |
| **wiki / wiki-ingest / wiki-query** | Building or querying a personal knowledge base |
| **autoresearch** | Research that files its findings automatically |
| **save** | Capturing an insight as a structured note |
| **research-synthesis** | Pulling many sources into one view |
| **defuddle** | Stripping a web page down before reading it |
| **think** | Working through a hard problem step by step |

---

## When to create a new skill

Not everything belongs in this library. Create a new skill when a task is **reusable**,
its steps are **non-obvious**, and nothing here already covers it. If an existing skill
almost fits, improve that one instead of making a near-duplicate. Trivial one-off tasks
don't need a skill at all.

## The 19 sources

Skills come from, among others: Anthropic (official + knowledge-work), Superpowers,
Open Design, Everything-Claude-Code, Bug Hunter (security), Hamel Husain's eval
methodology, ibelick's UI skills, ruflo, the PM Skills marketplace, an Obsidian wiki
stack, and Karpathy's guidelines. Full attribution and licences are in **LICENSES.md**.

---

## Good to know

- **A VS Code extension can't register agent skills directly.** Skills are files that
  Bob and the agent in VS Code read from disk. This extension installs those files and
  runs the profile system on top.
- Requires `unzip` (present on macOS and Linux).
- Tested against **IBM Bob 2.0.1**.
- Nothing is deleted — your previous skills are backed up first, and you can restore
  them anytime (see the repo's RESTORE.md).
