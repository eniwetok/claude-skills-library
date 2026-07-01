# Claude Code Skills — Complete Reference Guide

How skills work, how to build them, and when to call each one.

---

## Table of Contents

1. [What a Skill Is](#1-what-a-skill-is)
2. [How the Runtime Invokes Skills](#2-how-the-runtime-invokes-skills)
3. [Anatomy of a SKILL.md File](#3-anatomy-of-a-skillmd-file)
4. [Skill Types — Know Which You're Writing](#4-skill-types)
5. [How to Create a New Skill](#5-how-to-create-a-new-skill)
6. [When to Call Each Key Skill](#6-when-to-call-each-key-skill)
7. [The Enterprise Workflow Stack](#7-the-enterprise-workflow-stack)
8. [Skill Invocation in Claude Code](#8-skill-invocation-in-claude-code)

---

## 1. What a Skill Is

A **skill** is a markdown file (`SKILL.md`) that lives in a named folder inside `~/.claude/skills/`. The folder name IS the skill name. When Claude Code recognizes that a task matches a skill's description, it reads the file and follows the instructions inside it.

```
~/.claude/skills/
├── systematic-debugging/
│   └── SKILL.md          ← the skill
├── sparc-methodology/
│   ├── SKILL.md
│   └── references/
│       └── examples.md   ← loaded lazily, only when SKILL.md requests it
└── using-superpowers/
    ├── SKILL.md
    └── references/
        ├── claude-code-tools.md
        └── gemini-tools.md
```

**Skills are not plugins.** Plugins are marketplace packages installed to `~/.claude/plugins/` — they bundle multiple skills, agents, and hooks. A skill is the atomic unit; a plugin is a distribution mechanism.

---

## 2. How the Runtime Invokes Skills

### Step 1 — Description matching

When a user sends a message, Claude reads the `description` field in every installed skill's frontmatter. If the description matches the task, Claude invokes the skill via the `Skill` tool.

```
User message
     │
     ▼
Claude scans all ~970 skill descriptions
     │
     ▼
Match found? ──yes──► Skill tool loads SKILL.md ──► Claude follows it
     │
    no
     │
     ▼
Claude responds from base knowledge
```

### Step 2 — Skill tool loads the file

In Claude Code, skills are invoked using the built-in `Skill` tool:

```
Skill({ skill: "systematic-debugging" })
```

This loads the full `SKILL.md` into context. Claude then follows the skill's instructions exactly.

### Step 3 — References loaded on demand

Heavy reference content (lookup tables, templates, tool mappings) lives in `references/` and is loaded only when the skill body explicitly requests it. This keeps context lean.

### The `using-superpowers` override

With `using-superpowers` installed, the invocation rule changes: Claude MUST check for applicable skills **before any response, including clarifying questions**. Even a 1% chance a skill applies triggers an invocation. This is enforced at the session level.

---

## 3. Anatomy of a SKILL.md File

```markdown
---
name: skill-name              ← must match folder name
description: >                ← THIS IS THE TRIGGER. Write it as
  Invoke when user says X,      natural language a matcher would
  Y, or Z. Also activate for    read. Include synonyms, phrasings,
  A, B, C scenarios.            and explicit when-to-use cases.
---

# Skill Title

## When to Use          ← explicit trigger list (reinforces description)
## When to Skip         ← prevents false positives

## [Process / Steps / Checklist]

[Body — the actual instructions Claude follows]
```

### The description field is the most important line you'll write

The description is what Claude reads to decide whether to load your skill. It's not documentation — it's a trigger condition. Write it to match real user language:

```yaml
# WEAK — too vague to match reliably
description: Help with debugging

# STRONG — matches actual user phrases and scenarios
description: >
  Use when encountering any bug, test failure, unexpected behavior,
  or error message, before proposing any fix. Also invoke for
  "why is this broken", "this isn't working", "tests are failing",
  or "something went wrong".
```

### Rigid vs Flexible body

Declare which type your skill is:

- **Rigid** — must be followed exactly. Use for methodology skills (TDD, SPARC, systematic-debugging). Add `<HARD-GATE>` blocks to prevent skipping steps.
- **Flexible** — adapt principles to context. Use for pattern/style skills (react-patterns, frontend-design).

```markdown
<HARD-GATE>
Do NOT write any code until step 3 is complete.
This applies regardless of how simple the task seems.
</HARD-GATE>
```

### Checklist pattern (creates tasks)

When a skill has a checklist, Claude creates a task per item and checks them off in order:

```markdown
## Checklist

1. **Reproduce** — confirm the bug is reliably reproducible
2. **Isolate** — narrow to the smallest failing case
3. **Root cause** — find the actual cause, not a symptom
4. **Fix** — implement the minimal change that addresses root cause
5. **Verify** — confirm fix works and no regressions
```

### References pattern (lazy loading)

```
skills/my-skill/
├── SKILL.md
└── references/
    ├── api-patterns.md     ← loaded when SKILL.md says "see references/api-patterns.md"
    └── error-codes.md
```

Reference files are NOT loaded automatically. Your SKILL.md must explicitly reference them.

### Sub-agents / dispatching

Skills can instruct Claude to spawn sub-agents for parallel work:

```markdown
## Implementation

Dispatch parallel sub-agents for independent modules:
- Agent A: implement authentication layer
- Agent B: implement data access layer
- Agent C: write integration tests

Synthesize results when all agents complete.
```

---

## 4. Skill Types

Understanding the taxonomy prevents misuse.

| Type | Purpose | Example skills | Rule |
|------|---------|----------------|------|
| **Meta / coordination** | Tell Claude HOW to use all other skills | `using-superpowers` | Invoke at session start — never skip |
| **Process / methodology** | Define the workflow BEFORE coding starts | `brainstorming`, `sparc-methodology`, `systematic-debugging`, `writing-plans` | Invoke FIRST, before domain skills |
| **Quality gate** | Enforce standards at completion | `verification-quality`, `verification-before-completion`, `eval-harness` | Invoke BEFORE declaring done |
| **Domain / implementation** | Guide how to do a specific type of work | `react-patterns`, `django-patterns`, `security-audit` | Invoke DURING implementation |
| **Intelligence / context** | Give Claude better understanding of environment | `codebase-exploration`, `codebase-management` (SocratiCode MCP) | Invoke when entering unfamiliar codebase |
| **Security** | Vulnerability-specific hunting and hardening | `hunt-sqli`, `hunt-ssrf`, `bb-methodology`, etc. | Invoke during security review phases |
| **Role advisor** | Adopt a specialized persona | `cto-advisor`, `senior-architect`, `ceo-advisor` | Invoke for strategic/architecture decisions |
| **Agent orchestration** | Multi-agent coordination | `agent-council`, `swarm-orchestration`, `dispatching-parallel-agents` | Invoke for parallel or consensus work |

---

## 5. How to Create a New Skill

### Quick path — use the `skill-creator` skill

In any Claude Code session:

```
Create a skill that [describes what you want]
```

Claude will invoke `skill-creator` and guide you through the full loop:
draft → test prompts → eval → revise → repeat.

### Manual path — step by step

**Step 1: Create the folder and file**

```bash
mkdir -p ~/.claude/skills/my-skill
touch ~/.claude/skills/my-skill/SKILL.md
```

**Step 2: Write the frontmatter**

```yaml
---
name: my-skill
description: >
  Use when [specific scenario A], [scenario B], or when user says
  "[phrase 1]" or "[phrase 2]". Also invoke for [edge case].
  Skip when [counter-scenario where this doesn't apply].
---
```

**Step 3: Write the body**

Structure:
1. One-line purpose statement
2. When to use / when to skip (explicit lists)
3. The actual process — steps, checklist, or freeform instructions
4. Hard gates where relevant

**Step 4: Test the trigger**

```
[Describe a scenario that should invoke your skill]
```

Check whether Claude invokes it. If it doesn't: rewrite the description to match the actual phrasing more closely.

**Step 5: Test the body**

Follow the skill yourself — does it lead to the right outcome? Iterate.

**Step 6: Save to the library**

```bash
# Copy to the skills library for version control
cp -r ~/.claude/skills/my-skill ~/Documents/Skills/skills/my-skill/

# Create a zip for sharing/upload
cd ~/.claude/skills && zip -r ~/Documents/Skills/zips/my-skill.zip my-skill/ -x "*.DS_Store"
```

**Step 7: Update the catalog**

Add a row to `catalog/CATALOG.md` and commit.

### Directory structure for a complete skill

```
my-skill/
├── SKILL.md              ← required
├── references/
│   ├── patterns.md       ← optional: heavy reference content
│   └── examples.md       ← optional: worked examples
└── scripts/
    └── helper.sh         ← optional: shell scripts the skill can call
```

---

## 6. When to Call Each Key Skill

### Decision tree

```
New session opened
  └─► using-superpowers        (always — establishes the protocol)

User message arrives
  │
  ├─ "build / add / create / implement" something new?
  │    └─► brainstorming        → writes-plans → implementation skills
  │
  ├─ "bug / broken / error / failing test / unexpected"?
  │    └─► systematic-debugging → domain skills for the fix
  │
  ├─ "complex feature / new architecture / system redesign"?
  │    └─► sparc-methodology    → (Spec → Pseudocode → Architecture → Refinement → Completion)
  │
  ├─ "review / audit / check quality / before merge"?
  │    └─► verification-quality → eval-harness → security-audit
  │
  ├─ "unfamiliar codebase / where is X / what calls Y"?
  │    └─► codebase-exploration (SocratiCode)
  │
  ├─ "critical decision / architecture choice / which approach"?
  │    └─► agent-council        → brainstorming (for the chosen path)
  │
  ├─ "security review / pen test / find vulnerabilities"?
  │    └─► bb-methodology → hunt-* (specific vuln class)
  │
  ├─ "parallel work / multiple independent modules"?
  │    └─► dispatching-parallel-agents → swarm-orchestration
  │
  └─ "done / finished / ready to ship"?
       └─► verification-before-completion → deploy-checklist
```

### Quick reference table — key skills

| Skill | Trigger phrase / scenario | What it does | Source |
|-------|--------------------------|--------------|--------|
| `using-superpowers` | Session start | Forces skill lookup before every action | G7 obra/superpowers |
| `brainstorming` | "build / add / create" new feature | Spec → design → approval before any code | G7 obra/superpowers |
| `sparc-methodology` | Complex implementation / unclear requirements | Spec → Pseudocode → Architecture → Refinement → Completion | G8 ruflo |
| `systematic-debugging` | Any bug / test failure / unexpected behavior | Root cause first, then fix — never patch symptoms | G7 obra/superpowers |
| `writing-plans` | After design approved, before coding | Creates step-by-step implementation plan | G7 obra/superpowers |
| `executing-plans` | Implementation phase | Follows the plan, checks off tasks | G7 obra/superpowers |
| `finishing-a-development-branch` | PR ready / branch complete | Pre-merge checklist | G7 obra/superpowers |
| `verification-before-completion` | Before declaring done | Quality gates before closing a task | G7 obra/superpowers |
| `codebase-exploration` | Unfamiliar repo / "where is X" | Semantic search, dependency graph, call-flow via SocratiCode MCP | G16 SocratiCode |
| `codebase-management` | Cross-cutting refactor / health check | Large-scale changes with impact analysis | G16 SocratiCode |
| `agent-council` | Critical decision needing multiple perspectives | Queries multiple AI models, synthesizes consensus | G13 team-attention |
| `karpathy-guidelines` | Any coding task | Research-first, minimal code, honest uncertainty | G15 multica-ai |
| `eval-harness` | Before shipping / quality gate | Systematic evaluation of output quality | G10 ECC |
| `agentic-engineering` | Building agent systems | Eval-first execution, cost-aware model routing | G10 ECC |
| `sparc-methodology` | New feature with clear scope | SPARC structured workflow | G8 ruflo |
| `hookify-rules` | Setting up enforcement / "always do X" | Creates hooks that enforce rules at runtime | G10 ECC |
| `bb-methodology` | Starting security review | Full bug bounty / pen test methodology | G17 BugHunter |
| `hunt-sqli` | SQL layer / ORM / raw queries in scope | SQL injection hunt: payloads, bypass, blind | G17 BugHunter |
| `hunt-xss` | Frontend / templates / user input in scope | XSS hunt: reflected, stored, DOM | G17 BugHunter |
| `hunt-ssrf` | Network calls / webhooks / URL params in scope | SSRF hunt: internal metadata, cloud endpoints | G17 BugHunter |
| `hunt-auth-bypass` | Auth / session / JWT in scope | Auth bypass: token manipulation, logic flaws | G17 BugHunter |
| `hunt-cicd` | CI/CD pipelines in scope | Pipeline injection, secrets in env, workflow abuse | G17 BugHunter |
| `hunt-llm-ai` | LLM features / AI chatbot in scope | Prompt injection, indirect injection, exfil channels | G17 BugHunter |
| `cloud-iam-deep` | AWS/Azure/GCP credentials found | IAM privilege escalation, AssumeRole chains | G17 BugHunter |
| `security-audit` | Code review for security | General security review of code | G8 ruflo |
| `dispatching-parallel-agents` | Multiple independent tasks | Spawns parallel sub-agents | G7 obra/superpowers |
| `ceo-advisor` | Strategic direction / board-level decisions | CEO-perspective strategic framing | G11 zhangzhang |
| `cto-advisor` | Technical architecture / engineering leadership | CTO-perspective on technical strategy | G11 zhangzhang |
| `ciso-advisor` | Security posture / compliance | CISO-perspective on security risk | G11 zhangzhang |
| `senior-architect` | System design / architecture review | Senior architect design review | G11 zhangzhang |
| `rag-architect` | Retrieval-augmented generation system | RAG system design patterns | G11 zhangzhang |
| `mcp-server-builder` | Building an MCP server | MCP server structure and patterns | G11 zhangzhang |
| `agent-designer` | Designing a multi-agent system | Agent system design patterns | G11 zhangzhang |
| `playwright-pro` | E2E test / browser automation | Playwright test writing and debugging | G11 zhangzhang |
| `scrum-master` | Sprint planning / agile process | Scrum facilitation and planning | G11 zhangzhang |
| `skill-creator` | "Create a new skill" | Full skill creation loop: draft → eval → iterate | Anthropic official |
| `skill-builder` | Build or improve a skill | Quick skill scaffolding | G8 ruflo |
| `update-skills-library` | Sync skills from upstream repos | Pulls latest from all 16 upstreams | G6 custom |

---

## 7. The Enterprise Workflow Stack

For enterprise-quality code, skills layer in this order:

```
1. SESSION START
   └─► using-superpowers
         Forces skill consultation before every action

2. UNDERSTAND THE CODEBASE
   └─► codebase-exploration (SocratiCode MCP)
         Semantic search, dependency graph, call-flow analysis
         Skip if you wrote the codebase yourself

3. PLAN BEFORE CODING
   ├─► brainstorming          (new feature — spec first)
   ├─► sparc-methodology      (complex system — full SPARC cycle)
   └─► writing-plans          (after design approved)

4. IMPLEMENT
   ├─► [domain skills]        (react-patterns, django-patterns, etc.)
   ├─► karpathy-guidelines    (research-first, minimal changes)
   └─► executing-plans        (follow the plan, check tasks off)

5. QUALITY GATES
   ├─► eval-harness           (measure quality before shipping)
   ├─► verification-quality   (checklist review)
   └─► security-audit         (or full bb-methodology for security focus)

6. CRITICAL DECISIONS (any phase)
   └─► agent-council          (multi-AI consensus — architecture, approach choices)

7. SHIP
   ├─► finishing-a-development-branch  (pre-merge checklist)
   └─► verification-before-completion  (final quality gate)
```

**Enforcement layer** (set once, runs automatically):
- `hookify-rules` — defines rules Claude must follow (enforced via Claude Code hooks, not memory)
- `hooks-automation` — builds the hook infrastructure

---

## 8. Skill Invocation in Claude Code

### Automatic (via description matching)

Claude reads descriptions and invokes matching skills automatically. If `using-superpowers` is active, this is enforced before every response.

### Explicit (you tell Claude)

```
Use the systematic-debugging skill to diagnose this
Run the agent-council skill — I need multiple perspectives on this architecture
```

### Via the Skill tool (Claude's internal mechanism)

Claude Code uses the `Skill` tool internally:

```
Skill({ skill: "systematic-debugging" })
Skill({ skill: "brainstorming" })
Skill({ skill: "sparc-methodology" })
```

You don't call this directly — Claude does when it decides a skill applies.

### Slash commands (BugHunter)

The BugHunter package installs slash commands to `~/.claude/commands/`:

| Command | What it does |
|---------|-------------|
| `/hunt` | Start a targeted vulnerability hunt |
| `/recon` | Run reconnaissance on a target |
| `/chain` | Chain vulnerabilities A→B→C |
| `/autopilot` | Autonomous end-to-end engagement |
| `/intel` | Threat intelligence gathering |
| `/report` | Write a disclosure report |
| `/surface` | Map attack surface |
| `/triage` | Validate and score a finding |
| `/validate` | Confirm a finding is exploitable |
| `/token-scan` | Scan for exposed tokens/secrets |
| `/pickup` | Resume a paused engagement |
| `/remember` | Save finding to engagement memory |
| `/recon` | Full target reconnaissance |

---

## Library Summary

| Group | Source | Skills | Highlights |
|-------|--------|--------|------------|
| G1 | AgriciDaniel/claude-obsidian | 15 | wiki, save, autoresearch, canvas |
| G2 | phuryn/pm-skills | 60+ | full PM toolkit |
| G3 | Cowork (YouTube) | 15 | workflow automation |
| G4 | anthropics/skills | 30+ | official Anthropic skills |
| G5 | anthropics/knowledge-work-plugins | 127 | docs, code, analysis |
| G6 | custom (@eniwetok) | 2 | pptx-from-template, update-skills-library |
| G7 | obra/superpowers | 14 | **using-superpowers**, brainstorming, systematic-debugging |
| G8 | ruvnet/ruflo | 134 | **sparc-methodology**, SPARC agents, swarm |
| G9 | nexu-io/open-design | 264 | FAL AI, Figma, GSAP, 50+ html-ppt themes |
| G10 | affaan-m/ECC | 277 | **eval-harness**, agentic-engineering, hookify-rules, 15+ stacks |
| G11 | zhangzhang-111-i/claude-skills | ~180 | CEO/CTO/CISO advisors, senior-architect, playwright-pro |
| G12 | n8n-io/skills | 14 | n8n workflow automation |
| G13 | team-attention/agent-council | 1 | **agent-council** — multi-AI consensus |
| G14 | pablo-mano/Obsidian-CLI-skill | 1 | obsidian-cli |
| G15 | multica-ai/andrej-karpathy-skills | 1 | **karpathy-guidelines** |
| G16 | giancarloerra/SocratiCode | 2 + MCP | **codebase-exploration**, semantic search, dep graphs |
| G17 | elementalsouls/Claude-BugHunter | 71 + 15 cmd | **bb-methodology**, 71 hunt-* skills, 15 slash commands |

**Total: ~970 skills, 15 slash commands, 1 MCP server (SocratiCode)**

Full catalog: [catalog/CATALOG.md](catalog/CATALOG.md)
