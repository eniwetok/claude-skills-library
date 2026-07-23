---
name: mission-control
description: >
  Master orchestrator for the full skill library installed in Bob. Invoke at the start
  of any significant task, or when unsure which skill to use. Classifies the task,
  picks the right skills in the right order, and resolves conflicts when skills overlap.
  Use when: "start working on", "help me build", "where do I start", "which skill should
  I use", "new project", or any task where the right skill is not obvious. Also use when
  skills seem to conflict. Note: Claude Code's automatic hooks do NOT run in Bob.
---

---

## LEAN MODE — you are the router (read this first)

**Only two skills are loaded right now: `mission-control` (this one) and
`using-superpowers`.** Everything else — ~1,000 skills — sits UNLOADED in a vault:

- IBM Bob: `~/.bob/skills-vault/<skill>/SKILL.md`
- VS Code: `~/.claude/skills-vault/<skill>/SKILL.md`

This keeps the starting context tiny (~500 tokens instead of ~67,000). The trade-off:
the agent cannot auto-activate a vault skill, because its description isn't loaded. So
**you** invoke them, deterministically, using the map below.

### How to invoke a skill on demand
1. Read the task and match it to an **intent** in the table below.
2. For each skill that intent needs, **read its file** from the vault
   (`~/.bob/skills-vault/<skill>/SKILL.md` or `~/.claude/skills-vault/<skill>/SKILL.md`)
   and follow it as if it were active.
3. Announce which skill you are applying and why.
4. Do not guess a skill's contents — read the file. Do not apply a skill the intent
   below does not call for.

### Intent → skills (hardcoded routing)

| If the task is… | Read & apply these vault skills |
|-----------------|--------------------------------|
| **Build a feature / write code** | `karpathy-guidelines`, `brainstorming` (if fuzzy) or `writing-plans`, the stack skill (`python-patterns`, `react-patterns`, …), `tdd-workflow`, `verification-before-completion` |
| **Fix a bug** | `systematic-debugging`, then `caveman-debug` if no debugger, then `verification-before-completion` |
| **Understand a codebase** | `codebase-exploration`, `karpathy-guidelines` |
| **Design a system / architecture** | `brainstorming`, `architecture-decision-records`, `system-design`, `agent-council` |
| **Evaluate an AI/data pipeline** (Cognos) | `error-analysis` first, then `write-judge-prompt` + `validate-evaluator`, `evaluate-rag`, `eval-audit` |
| **Write SQL / analytics** | `sql-queries`, `write-query`, `statistical-analysis` |
| **Security review / hunt** | `security-audit` (dev) or `bb-methodology` (engagement), the matching `hunt-*` skill |
| **Build or fix UI** | `frontend-design` (build) / `baseline-ui` + `fixing-accessibility` (fix), `improve-ui` |
| **Product work** | `create-prd`, `product-vision`, `outcome-roadmap`, `prioritization-frameworks` |
| **Research a topic** | `deep-research`, then `save` / `wiki-ingest` to keep findings |
| **Review quality before done** | `code-review`, `verification-before-completion`, `simplify` |
| **Make a new skill** | `skill-creator` |

If no intent matches, ask the user, or scan the vault directory listing for a skill
whose folder name fits, then read that skill's file.

### Loading a batch instead (optional)
For a long session on one kind of work, pre-load a whole profile so its skills
auto-activate normally:
`~/.bob/bob-profile <code|data|pm|security|ui|research>` (then restart the conversation).
Lean mode (this router) is the default and needs no reload.

---

# Mission Control — Skill Orchestrator

You have ~950 skills available in Bob (`~/.bob/skills/`), plus Bob's own built-in
git and pull-request skills. This skill tells you which to use, in what order, and
how to resolve conflicts when several overlap.

---

## Mission-Critical Mode (production / enterprise work)

**Routing is not enforcement.** This skill tells you WHICH skills to run. For
mission-critical software, being told is not enough — quality must be gated.

### IMPORTANT — what is DIFFERENT in Bob vs Claude Code

Claude Code enforces four automatic guardrails via hooks (branch-guard, design-gate,
format-on-save, dod-gate). **Those hooks DO NOT run in Bob.** Bob has no equivalent
hook system, so nothing here is automatically enforced.

That means in Bob the five pillars below are a **discipline you must follow**, not a
machine that stops you. Do not assume a gate fired — there is no gate. State explicitly
when a check has been done, and never claim work is verified unless you actually ran the
verification.

If a change is genuinely mission-critical, do the final verification in Claude Code
where the guardrails exist, or run the checks by hand and show the output.

### The Five Pillars — the checklist to hold yourself to

| Pillar | What must be TRUE before "done" | Skills |
|--------|--------------------------------|--------|
| **Design** | A written plan existed BEFORE any code. No code from a blank design. | `brainstorming`, `writing-plans`, `architecture-decision-records` |
| **Correctness** | Tests + typecheck + lint green. Every new behavior has a test. | `tdd-workflow`, `verification-before-completion` |
| **Evaluation** | AI-generated or heuristic logic has *evidence*, not vibes. | `error-analysis`, `write-judge-prompt`, `validate-evaluator`, `eval-harness` |
| **Usability** | User-facing paths handle errors; a11y where it applies. | `fixing-accessibility`, `frontend-a11y`, `error-handling` |
| **Maintainability** | Minimal diff, clear names, no dead code, docs updated. | `karpathy-guidelines`, `simplify`, `code-review` |

### The loop (wraps every workflow below)

```
PLAN  →  BUILD  →  CHECK  →  FINISH
```

Workflows A–M are the BUILD step only — always bracketed by a plan before and
verification after.

---

## Bob's own built-in skills — prefer these for git and pull requests

Bob ships these. They are Bob-native and know its UI. Use them instead of generic
git advice:

| Bob skill | Use for |
|-----------|---------|
| `commit` | Commit with a message matching the repo's existing style |
| `create-pr` / `create-draft-pr` | Open a pull request |
| `update-pr` | Update an existing pull request |
| `merge` | Merge a branch |
| `sync` / `sync-upstream` | Sync with upstream |
| `act-on-feedback` | Respond to review comments |
| `generate-run-commands` | Work out how to run the project |

**Routing rule:** anything about committing, PRs, merging, or syncing → use Bob's
built-in skill. For the *decision* of whether the work is ready to commit, still run
the Five Pillars checklist above first.

---

---

## Skill profiles — managing context (IMPORTANT in Bob)

Bob loads the `name` + `description` of **every** installed skill into context at the
start of a conversation. With the full library (~1015 skills) that is **~67,000 tokens
before you type anything**. So the library is NOT all loaded at once.

**How it works here:**
- `~/.bob/skills-vault/` — the full library. Bob does **not** read this.
- `~/.bob/skills/` — only the **active profile**. Bob **does** read this. (~2-3k tokens)

**Profiles** (each includes a small always-on core):

| Profile | For | Cost |
|---------|-----|------|
| `code` | Building/refactoring software, tests, APIs, infra | ~2.1k tokens |
| `data` | Evals, SQL, RAG, analytics — the Cognos work | ~2.2k tokens |
| `pm` | PRDs, roadmaps, strategy, user stories | ~2.1k tokens |
| `security` | Audits, vulnerability hunting | ~3.1k tokens |
| `ui` | Interfaces, accessibility, design | ~2.0k tokens |
| `research` | Wiki, notes, deep research | ~2.5k tokens |

**Switching (must be done in a terminal, then restart the conversation):**
```bash
~/.bob/bob-profile data          # load one
~/.bob/bob-profile code ui       # combine two
~/.bob/bob-profile status        # what is loaded now
~/.bob/bob-profile list          # all profiles
~/.bob/bob-profile all           # everything (~67k tokens - avoid)
```

### YOUR JOB when a needed skill is not loaded

You cannot load or unload skills yourself — you have no such ability. Skills are read
from disk when the conversation starts.

So if the right skill for the task is not in the active profile:
1. Say plainly which skill is needed and that it is not currently loaded.
2. Give the exact command: `~/.bob/bob-profile <name>`
3. Tell the user to **restart the conversation** afterwards.
4. Meanwhile, help as best you can with what IS loaded — do not pretend to have it.

Check the active profile with `~/.bob/bob-profile status` if unsure.

---

## Step 1 — Classify the Task

Read the user's request and identify the primary task type:

| Task type | Trigger phrases | Go to |
|-----------|----------------|-------|
| **New feature / greenfield** | "build", "add", "create", "implement", "new" | [Workflow A](#workflow-a--new-feature) |
| **Bug / broken / error** | "bug", "broken", "error", "failing", "not working", "unexpected" | [Workflow B](#workflow-b--debugging) |
| **Understand unfamiliar code** | "what does", "where is", "how does", "explain this codebase", "onboard" | [Workflow C](#workflow-c--codebase-intelligence) |
| **Complex system design** | "architect", "design system", "redesign", "scale", "complex implementation" | [Workflow D](#workflow-d--architecture--complex-systems) |
| **Security review / pen test** | "security", "vulnerabilities", "audit", "pen test", "red team", "hunt" | [Workflow E](#workflow-e--security) |
| **Code review / quality** | "review", "quality", "before merge", "is this ready", "check" | [Workflow F](#workflow-f--quality-gates) |
| **Critical decision / tradeoff** | "which approach", "pros and cons", "tradeoff", "what should I choose" | [Workflow G](#workflow-g--decisions) |
| **Parallel / multi-module work** | "simultaneously", "multiple parts", "parallelize", "multiple agents" | [Workflow H](#workflow-h--parallel-work) |
| **Create a skill** | "new skill", "create a skill", "add a skill" | [Workflow I](#workflow-i--skill-creation) |
| **Research / learn** | "research", "learn about", "find information on", "course", "study" | [Workflow J](#workflow-j--research--learning) |
| **Frontend / UI** | "UI", "component", "page", "design", "animation", "mobile" | [Workflow K](#workflow-k--frontend--design) |
| **Data / backend** | "API", "database", "backend", "service", "pipeline" | [Workflow L](#workflow-l--backend--data) |
| **DevOps / infra** | "deploy", "CI/CD", "kubernetes", "docker", "infrastructure" | [Workflow M](#workflow-m--devops--infrastructure) |

---

## Workflow A — New Feature

```
1. brainstorming          → design-first, explore requirements, get approval
2. writing-plans          → implementation plan from approved design
3. karpathy-guidelines    → apply behavioral principles throughout
4. [domain skill]         → react-patterns / django-patterns / etc.
5. tdd-workflow           → tests alongside implementation
6. verification-before-completion → final quality gate
7. finishing-a-development-branch → pre-merge checklist
```

**Overlap note:** If requirements are UNCLEAR → use `brainstorming` first.
If requirements are CLEAR and the implementation is COMPLEX → use `sparc-methodology` instead of `brainstorming` + `writing-plans` (SPARC includes its own planning).
Do NOT use both.

---

## Workflow B — Debugging

```
1. systematic-debugging   → root cause FIRST, never patch symptoms
2. caveman-debug          → when no debugger available: instrument with [CAVE] logs, run, read, strip
3. [domain skill]         → specific fix guidance once root cause found
4. verification-before-completion → confirm fix, no regressions
```

**Overlap note:** For AI agent failures specifically, use `agent-introspection-debugging` instead of `systematic-debugging`. For general code bugs, always `systematic-debugging`.

**caveman-debug vs systematic-debugging:** not a conflict — systematic-debugging is the methodology (think before acting); caveman-debug is the technique (print statements) used during step 2 when you need to observe live runtime state and no proper debugger is available. Use both together.

---

## Workflow C — Codebase Intelligence

```
1. codebase-exploration   → semantic search, dependency graph, call-flow (SocratiCode MCP)
2. karpathy-guidelines    → research-first, understand before changing
3. [domain skill]         → once oriented, apply relevant patterns
```

**Overlap resolution — Karpathy vs SocratiCode:**
These are NOT in conflict. They operate on different layers:
- `karpathy-guidelines` = **behavioral principles** (HOW to think: research-first, minimal changes, honest uncertainty, verifiable success criteria)
- `codebase-exploration` = **tooling layer** (WHAT to use: semantic search, dependency graphs, call-flow analysis via SocratiCode MCP)

Use both together. Karpathy shapes your mindset; SocratiCode gives you the tools to execute that mindset on a real codebase.

---

## Workflow D — Architecture / Complex Systems

```
1. agent-council          → get multi-AI perspectives on the approach (consensus)
2. sparc-methodology      → Spec → Pseudocode → Architecture → Refinement → Completion
3. codebase-exploration   → understand existing system before designing additions
4. karpathy-guidelines    → minimal, verifiable, no over-engineering
5. architecture-decision-records → document the decisions made
6. eval-harness           → validate the design before implementation
```

For role-specific perspective, add one of:
- `cto-advisor` — technical leadership lens
- `senior-architect` — system design depth
- `rag-architect` — if RAG/retrieval is involved
- `mcp-server-builder` — if building MCP integrations

---

## Workflow E — Security

Choose the right level:

**During development** (code review with security lens):
```
1. security-audit         → static code analysis, input validation, auth, SQL, etc.
2. hunt-[relevant class]  → deep dive into specific vuln class if needed
```

**Dedicated security engagement** (red team / pen test / bug bounty):
```
1. bb-methodology         → master orchestrator, routes to all hunt-* skills
2. web2-recon / osint-methodology → reconnaissance phase
3. hunt-[vuln class]      → targeted hunting by vulnerability type
4. redteam-mindset        → attacker psychology throughout
5. evidence-hygiene       → document findings correctly
6. report-writing / redteam-report-template → disclosure report
```

**Overlap resolution — security-audit vs bb-methodology vs bug-bounty:**
- `security-audit` = development-time static review (use DURING coding)
- `bb-methodology` = red-team orchestrator with non-linear 5-phase hunt (use for DEDICATED security work)
- `bug-bounty` = same scope as bb-methodology but more focused on submission workflow
- `security-bounty-hunter` (ECC) = similar but lighter; prefer `bb-methodology` for serious work
- `hunt-*` skills (71 total) = one per vulnerability class; invoked by `bb-methodology` or directly

**Platform-specific:**
- Enterprise identity: `m365-entra-attack`, `okta-attack`, `cloud-iam-deep`
- Mobile: `apk-redteam-pipeline`
- Cloud: `hunt-cloud-misconfig`, `hunt-k8s`, `cloud-iam-deep`
- AI/LLM: `hunt-llm-ai`
- Web3: `web3-audit`, `defi-amm-security`

---

## Workflow F — Quality Gates

**Pre-commit / task completion:**
```
1. verification-before-completion → checklist gate before calling anything done
2. code-review            → peer review simulation
```

**AI output quality:**
```
1. eval-harness           → systematic evaluation of AI-generated output
2. benchmark              → performance measurement
3. benchmark-optimization-loop → continuous improvement loop
```

**Evaluating an LLM PIPELINE's output** (Hamel Husain's method — the rigorous path):
```
0. eval-audit              → START HERE if evals exist but you don't trust them
1. error-analysis          → read real traces, build a vocabulary of failure modes
2. generate-synthetic-data → only if real traces are sparse (<100)
3. write-judge-prompt      → build a binary Pass/Fail LLM judge for subjective failures
4. validate-evaluator      → calibrate that judge against HUMAN labels (TPR/TNR)
5. build-review-interface  → annotation tool for human trace review
   evaluate-rag            → if it's a retrieval system: score retrieval and generation SEPARATELY
```

**The non-negotiable rule:** never trust a judge you have not calibrated against human
labels. `write-judge-prompt` without `validate-evaluator` is a vanity metric — it will
happily report a number that means nothing. This is the "independent inspector" principle
from Mission-Critical Mode, applied to AI output.

**Which eval family do I want?**
| Evaluating… | Use |
|-------------|-----|
| A coding agent's ability to complete tasks | `agent-eval` (head-to-head, pass rate, cost) |
| Code quality / correctness of a change | `verification-quality`, `eval-harness` |
| Speed and regressions | `benchmark` |
| **An LLM pipeline's OUTPUT quality** (answers, SQL, summaries) | **the Hamel stack above** |
| **A retrieval/RAG system** | **`evaluate-rag`** |

Start with `error-analysis` on real traces, not with metrics. Metrics chosen before you
have looked at failures are vanity metrics.

**Overlap resolution — quality gate skills:**
| Skill | When to use |
|-------|------------|
| `verification-before-completion` | Before closing ANY task — final gate |
| `verification-quality` | Mid-task quality checkpoint |
| `verification-loop` | Ongoing verification cycle (security contexts) |
| `eval-harness` | Evaluating AI-generated code or output quality |
| `benchmark` | Measuring performance numbers |
| `pr-feedback-quality-gate` | Before submitting a PR |
| `plankton-code-quality` | Automated code quality scoring |

---

## Workflow G — Decisions

```
1. agent-council          → query multiple AI models, synthesize consensus
2. brainstorming          → explore options if not yet converged
3. architecture-decision-records → document the chosen decision
```

For domain-specific strategic lens:
- `ceo-advisor` — business impact, strategy, stakeholder framing
- `cto-advisor` — technical strategy, build vs buy, team structure
- `ciso-advisor` — security risk, compliance implications
- `cfo-advisor` — cost, ROI, financial risk
- `senior-architect` — technical architecture depth

---

## Workflow H — Parallel Work

**Simple: independent tasks across modules:**
```
dispatching-parallel-agents → spawn sub-agents per module, synthesize
```

**Complex: multi-step coordinated swarm:**
```
swarm-orchestration → or hive-mind for consensus-driven swarms
```

**Overlap resolution — multi-agent skills:**
| Skill | Purpose |
|-------|---------|
| `agent-council` | Get OPINIONS from multiple models (consensus, not work) |
| `dispatching-parallel-agents` | Divide IMPLEMENTATION work across agents |
| `swarm-orchestration` | Complex coordinated multi-step swarms |
| `hive-mind` | Collective intelligence with shared memory |
| `hive-mind-advanced` | Large-scale hive with Byzantine fault tolerance |
| `team-agent-orchestration` | Team-level agent coordination |

---

## Workflow I — Skill Creation

```
1. skill-creator          → full loop: draft → eval → iterate (official Anthropic skill)
2. skill-builder          → quick scaffolding (ruflo)
```

---

## Workflow J — Research / Learning

**Deep multi-source research:**
```
deep-research             → 8-phase pipeline, cited report, adversarial verification
```

**Build a knowledge base:**
```
autoresearch → save → wiki  → files findings into Obsidian vault
```

**Learn a skill/topic:**
```
learn-with-coursera       → personalized learning path from Coursera catalog
```

**Overlap resolution — research skills:**
| Skill | When to use |
|-------|------------|
| `deep-research` | Comprehensive cited report on a topic |
| `autoresearch` | Autonomous research that files into your wiki vault |
| `search-first` | Quick lookup before implementing anything |
| `research-synthesis` | Synthesize existing research material |

---

## Workflow K — Frontend / Design

**Components / React:**
```
brainstorming → react-patterns → frontend-a11y → tdd-workflow
```

**Design system / UI:**
```
brainstorming → shadcn-ui / design-system → impeccable-design-polish
```

**Fixing UI that already exists** (ibelick's pack — these FIX, they don't build):
```
baseline-ui                → clean up AI-generated "slop": spacing, hierarchy, typography
fixing-accessibility       → plain HTML/WCAG: ARIA, keyboard, focus, contrast, forms
fixing-motion-performance  → animations stutter/jank: layout thrashing, compositor, blur
fixing-metadata            → page titles, Open Graph, Twitter cards, favicons, JSON-LD
improve-ui                 → READ-ONLY audit; writes a plan for ANOTHER agent to execute
```

**Build vs fix — pick the right one:**
| Need | Use |
|------|-----|
| Build new animations | `motion-ui` / `gsap-*` |
| Animations are janky | `fixing-motion-performance` |
| Build accessible React components | `frontend-a11y` |
| Audit/fix accessibility of existing HTML | `fixing-accessibility` |
| SEO strategy, keywords, competitors | `seo-audit` |
| The actual meta/OG/JSON-LD tags | `fixing-metadata` |
| Polish a page you just built | `impeccable-design-polish` |
| Audit someone else's surface without touching it | `improve-ui` |

**`improve-ui` is the Mission-Critical-Mode choice for UI**: it never edits product source — it writes an implementation plan for a separate agent. That is the "independent inspector / plan-before-code" pattern, applied to interfaces.

**Animation:**
```
gsap-core → gsap-scrolltrigger / gsap-react → gsap-performance
```

**AI-generated images/video:**
```
fal-generate / venice-image-generate / imagegen → (pick one AI provider)
```

**Presentations:**
```
html-ppt-[theme] → (50+ zhangzara themes) / html-ppt-pitch-deck / replit-deck
```

**Figma:**
```
figma-use → figma-generate-design → figma-implement-design
```

---

## Workflow L — Backend / Data

Pick the stack-specific pattern skill, then apply quality skills on top:

| Stack | Pattern skill | Security | Testing |
|-------|--------------|---------|---------|
| Python/Django | `django-patterns` + `django-security` | `django-tdd` | `python-testing` |
| Python/FastAPI | `fastapi-patterns` | `security-audit` | `python-testing` |
| Node.js/NestJS | `nestjs-patterns` | `hunt-nodejs` | — |
| Next.js | `nextjs-turbopack` | `hunt-nextjs` | `react-testing` |
| Laravel | `laravel-patterns` + `laravel-security` | `laravel-tdd` | — |
| Spring Boot | `springboot-patterns` + `springboot-security` | `springboot-tdd` | — |
| Go | `golang-patterns` | `security-audit` | `golang-testing` |
| Rust | `rust-patterns` | `security-audit` | `rust-testing` |
| Kotlin | `kotlin-patterns` + `kotlin-ktor-patterns` | `security-audit` | `kotlin-testing` |

**Databases:**
- PostgreSQL → `postgres-patterns`
- MySQL → `mysql-patterns`
- Redis → `redis-patterns`
- ClickHouse → `clickhouse-io`
- DB migrations → `database-migrations`

**AI/ML:**
- RAG → `rag-architect` + `iterative-retrieval`
- ML pipeline → `mle-workflow`
- Embeddings → `embeddings` + `agentdb-vector-search`
- Eval → `eval-harness` + `agent-eval`

---

## Workflow M — DevOps / Infrastructure

```
brainstorming → deployment-patterns → docker-patterns → kubernetes-patterns
→ security-audit → agent-ops-cicd-github
```

Homelab: `homelab-network-setup` → `homelab-wireguard-vpn` → `homelab-pihole-dns` → `homelab-vlan-segmentation`

---

## Global Rules (Always Active)

These apply across ALL workflows, not just specific ones:

1. **`karpathy-guidelines`** — behavioral principles that run alongside everything:
   - Research and read before writing
   - Make surgical minimal changes
   - Surface assumptions as explicit tests
   - Define verifiable success criteria before starting
   - Never over-engineer; three simple lines beat one abstraction

2. **`using-superpowers`** — the meta-protocol: invoke relevant skills before ANY action. This skill (mission-control) tells you WHICH skill to invoke; using-superpowers enforces THAT you invoke something.

3. **`agent-self-evaluation`** — run after completing any non-trivial task for a structured self-scorecard.

4. **`hookify-rules`** — for recurring rules ("always do X"). Note: hooks are a Claude Code
   feature; in Bob there is no hook system, so such rules must be followed by discipline.

5. **NO automatic gates exist in Bob.** Claude Code has hooks that actually block bad work
   (no edits on the main branch, no code before a plan, auto-formatting, refusing to finish
   while tests fail). **None of them run here. Nothing will stop you.**
   Therefore: run the checks yourself and state plainly which ones you ran. Never report
   work as verified unless you actually ran the verification and can show the output.
   For genuinely mission-critical changes, do the final verification pass in Claude Code
   where the guardrails exist.

6. **Close the loop — skill-coverage check after every task.** Answer the user FIRST, then ask:
   did this use case have a skill?

   ```
   already covered?          → say so, change nothing
   NEW reusable capability?  → skill-scout (confirm nothing exists) → skill-creator (create)
   extends existing skill?   → skill-creator (UPDATE it — never a near-duplicate)
   trivial one-off?          → skip; do not spam the library
   ```

   Use `skill-scout` BEFORE creating — it searches local + marketplace + GitHub so you don't rebuild
   what already exists. Use `skill-creator` for both create AND update (it explicitly covers "modify
   and improve existing skills"). End with a one-line `Skill check:` verdict.

   **Recurring behaviour is a hook, not a skill.** If the gap is *when* something should happen
   ("always / after every X"), the artifact is a hook (`update-config`, see rule 4), not a skill.
   Skills are capabilities you invoke; hooks are triggers that fire. Never model a trigger as a skill.

---

## Overlap Master Table

Complete disambiguation for skills that share similar descriptions:

| Pair | How they differ | Use A when | Use B when |
|------|----------------|-----------|-----------|
| `karpathy-guidelines` vs `codebase-exploration` | Mindset vs tooling | Need to set behavioral principles | Need to navigate actual code |
| `brainstorming` vs `sparc-methodology` | Exploratory vs structured | Requirements unclear, need discovery | Requirements clear, need structured methodology |
| `writing-plans` vs `sparc-methodology` | Plan doc vs full process | After brainstorming, need a plan doc | Starting complex work from scratch |
| `security-audit` vs `bb-methodology` | Dev-time vs red-team | Reviewing code you wrote | Running a dedicated security engagement |
| `bug-bounty` vs `bb-methodology` | Submission vs methodology | Focused on report submission | Focused on the hunt process |
| `verification-before-completion` vs `eval-harness` | Task gate vs quality measurement | Closing any task | Evaluating AI output quality specifically |
| `agent-council` vs `dispatching-parallel-agents` | Opinions vs implementation | Need perspectives / consensus | Need to divide work |
| `swarm-orchestration` vs `hive-mind` | Coordination vs collective | Linear multi-step flows | Emergent consensus / shared state |
| `systematic-debugging` vs `debug` | Methodology vs tool | Any bug (enforces root cause) | Quick debug for small issues |
| `deep-research` vs `autoresearch` | Report vs knowledge base | Need a cited deliverable | Need to build your wiki |
| `dispatching-parallel-agents` vs `hive-mind` | Work division vs consensus | Independent tasks | Tasks requiring shared state |
| `security-scan` vs `security-audit` | Automated scan vs manual review | Quick automated pass | Thorough manual code review |

---

## Installed Skill Groups (Quick Reference)

| Group | Source | Count | Best skills |
|-------|--------|-------|-------------|
| G1 | claude-obsidian | 15 | `wiki`, `save`, `autoresearch`, `canvas` |
| G2 | phuryn/pm-skills | 60+ | Full PM toolkit |
| G3 | Cowork | 15 | Workflow automation |
| G4 | anthropics/skills | 30+ | `skill-creator`, `code-review`, `system-design` |
| G5 | knowledge-work-plugins | 127 | `deep-research`, `brainstorming`, `docs-page` |
| G6 | custom | 4 | **`mission-control`**, **`caveman-debug`**, `pm-agent`, `pptx-from-template` |
| G7 | obra/superpowers | 14 | **`using-superpowers`**, `brainstorming`, `systematic-debugging`, `writing-plans` |
| G8 | ruvnet/ruflo | 134 | **`sparc-methodology`**, swarm, SPARC agents |
| G9 | nexu-io/open-design | 264 | FAL AI, Figma, GSAP, 50+ html-ppt themes |
| G10 | affaan-m/ECC | 277 | **`eval-harness`**, `agentic-engineering`, `hookify-rules`, 15+ stack patterns |
| G11 | zhangzhang-111-i | ~180 | `cto-advisor`, `senior-architect`, `playwright-pro`, `rag-architect` |
| G12 | n8n-io/skills | 14 | n8n workflow automation |
| G13 | team-attention | 1 | **`agent-council`** |
| G14 | pablo-mano | 1 | `obsidian-cli` |
| G15 | multica-ai | 1 | **`karpathy-guidelines`** |
| G16 | SocratiCode | 2+MCP | **`codebase-exploration`**, semantic search, dep graphs |
| G17 | Claude-BugHunter | 71+15cmd | **`bb-methodology`**, 71 `hunt-*` skills |
