---
name: mission-control
description: >
  Master orchestrator for all 934 installed skills. Invoke at session start,
  when starting any new task, or when you're unsure which skill to use.
  Classifies the task, selects the right skills in the right order, and resolves
  conflicts when multiple skills overlap. Use when: "start working on", "help me build",
  "let's begin", "where do I start", "which skill should I use for", "new session",
  "new project", or any task where the right skill isn't obvious.
  Also invoke when skills seem to conflict or give contradictory guidance.
---

# Mission Control — Skill Orchestrator

You have 934 skills installed across 17 groups. This skill tells you which ones
to use, in what order, and how to resolve conflicts between overlapping skills.

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
2. [domain skill]         → specific fix guidance once root cause found
3. verification-before-completion → confirm fix, no regressions
```

**Overlap note:** For AI agent failures specifically, use `agent-introspection-debugging` instead of `systematic-debugging`. For general code bugs, always `systematic-debugging`.

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

See [SKILLS-GUIDE.md](../../Documents/Skills/SKILLS-GUIDE.md) for the full creation process.

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

4. **`hookify-rules`** — for recurring rules ("always do X"), encode them as hooks, not memory. Memory is lossy; hooks are deterministic.

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
| G6 | custom | 2 | `pptx-from-template`, `update-skills-library` |
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

Full catalog: see `catalog/CATALOG.md` in the skills library repo.
