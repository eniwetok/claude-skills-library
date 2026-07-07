# How It All Works — Your Skills Library in Plain English

A guide you can read without any technical background. It explains what you have,
how the pieces fit together, and — most importantly — the ideas worth remembering.

There's a matching visual version here:
https://claude.ai/code/artifact/8ef227ce-ade8-4caf-b56d-9ef6e1234df0

---

## The one-paragraph version

Think of the whole thing as a **kitchen**. The **ingredients** are 936 ready-made
skills you gathered from around the internet. Your **pantry** is one folder on your
computer that keeps them all, backed up online so nothing is ever lost. The **head
chef** is a skill called *mission control* — it reads what you asked for and decides
which skills to use, in what order. And the **health inspector** is a set of four
automatic checks that won't let sloppy work leave the kitchen.

Here are the numbers at a glance:

- **936** skills ready to use
- **17** different places they came from
- **15** bundles stored in your pantry
- **18** quick commands
- **4** automatic guardrails

---

## Part 1 — How the pieces fit together

Read this top to bottom. Each part hands off to the next.

**1. Where skills come from.**
Other people publish skills online. You collected them from 17 different sources —
things like Anthropic's official skills, a set called Superpowers, a design pack,
and a security pack called Bug Hunter. Each source updates on its own schedule.

**2. The pantry (your copy).**
You copy all those skills into one folder on your computer. That folder also holds
your own custom skills, the four guardrail scripts, and a written catalog of what
everything does. The whole folder is saved to GitHub, so you can never lose it and
can set it up again on any computer.

**3. What Claude loads each session.**
When you open Claude, it reads all the installed skills, your quick commands, and
one connected tool that helps it understand large codebases.

**4. The part that picks which skills to use.**
With 936 skills, the hard part is *choosing*. This is the head chef — the *mission
control* skill. It reads your request and lays out the right skills in the right
order. A second skill quietly makes sure Claude always checks for a useful skill
before just diving in.

**5. The guardrails that can stop bad work.**
Everything above is *advice* — Claude can still ignore it. The guardrails are
different: they run automatically and can actually **block** an action. This is the
part that makes the whole system reliable instead of just well-intentioned.

---

## Part 2 — The four steps every important task goes through

For serious work, mission control wraps the job in four steps. You can't start
building without a plan, and you can't finish while things are still broken.

1. **Plan** *(must pass)* — Write down what you're going to build and why, before
   touching any code. If there's no plan, the first code change is blocked.
2. **Build** — Do the actual work, using the skills mission control picked.
3. **Check** *(must pass)* — Does it work? Is there proof? Are errors handled?
4. **Finish** *(final sign-off)* — The session won't close while tests or checks are
   failing. Green means done.

The **Build** step is where the specific skills run — but it's always sandwiched
between a checkpoint before and after.

### The five things the "Check" step looks at

1. **A good plan** — the work matches a written plan; no building blind.
2. **It actually works** — tests pass, and every new behavior has a test.
3. **Proof, not vibes** — anything AI-generated has evidence it's correct.
4. **Easy to use** — screens make sense; errors are handled clearly.
5. **Easy to change later** — small clean edits, clear names, no leftover junk.

---

## Part 3 — The 13 kinds of jobs it knows

Mission control listens for what you're asking, matches it to one of these jobs,
and runs that job's recipe of skills.

1. **Build a new feature** — explore the idea, write a plan, build with tests, confirm it works.
2. **Fix a bug** — find the real cause first, add print statements if needed, confirm the fix.
3. **Understand some code** — map out the code, then read carefully before changing anything.
4. **Design a whole system** — gather opinions, follow a step-by-step method, write decisions down.
5. **Check for security holes** — run the security playbook and hunt for specific weaknesses.
6. **Review quality** — a final once-over before calling anything finished.
7. **Make a hard decision** — get several viewpoints, then record which option you chose and why.
8. **Do lots of work at once** — split the job across several helpers working in parallel.
9. **Create a new skill** — draft it, test it, refine it until it's good.
10. **Research a topic** — dig deep across sources and save the findings to your notes.
11. **Build a user interface** — use proven patterns, make it accessible, then polish.
12. **Build the back end** — follow patterns for your tech stack, add security, add tests.
13. **Deploy and set up servers** — package it, run it reliably, automate the release.

---

## Part 4 — The four guardrails, and when each one fires

These are small scripts that run by themselves at set moments. Unlike skills, they
don't rely on Claude remembering — they just happen. One runs on every project; the
other three only switch on for projects you mark as important (by adding one small
settings file).

| Guardrail | When it runs | What it does | Where |
|-----------|-------------|--------------|-------|
| **Branch guard** | Right before a file changes | Stops you editing the main copy of a project; nudges you to make a safe side-copy first | Always on |
| **Plan check** | Right before a file changes | Won't let the first line of code be written until a written plan exists | Important projects only |
| **Auto-tidy** | Right after a file is saved | Automatically formats the file so spacing and style stay neat; never blocks | Important projects only |
| **Finish check** | When Claude tries to finish | Runs your tests and checks; refuses to end the session if anything is failing | Important projects only |

To switch the three "important" guardrails on for a project, you drop in one small
settings file. No file, no guardrails — so they never get in the way on quick work.

---

## Part 5 — Everything you collected, by source

The counts add up to more than 936 because a few overlap — after removing duplicates,
936 are actually installed. The "standout" is the single most useful skill from each.

| Source | Skills | Good for | Standout |
|--------|-------:|----------|----------|
| Obsidian wiki | 15 | Building a personal knowledge base | wiki, save, research |
| PM skills | 60+ | Product management work | the full PM kit |
| Cowork | 15 | Everyday work automation | workflow helpers |
| Anthropic official | 30+ | Core, well-tested basics | skill maker, code review |
| Knowledge-work pack | 127 | Research, writing, thinking | deep research, brainstorming |
| Your own custom | 4 | Made by you, for you | mission control, caveman debug |
| Superpowers | 14 | Good engineering habits | always-check-first, careful debugging |
| Ruflo | 134 | Structured step-by-step methods | step-by-step build method |
| Open Design | 264 | Design, images, slides, animation | AI images, Figma, 50+ slide themes |
| Everything-Claude pack | 277 | Big grab-bag of coding tools | quality scoring, tech-stack patterns |
| Advisor pack | ~180 | Expert "advisor" roles & testing | CTO advisor, architect, testing |
| n8n | 14 | Connecting apps & automations | n8n automation |
| Agent council | 1 | Asking several AIs at once | the council |
| Obsidian command tool | 1 | Controlling notes from the terminal | notes command tool |
| Karpathy guidelines | 1 | How to think while coding | good-habits guide |
| Code-search tool | 2 | Understanding big codebases | code explorer |
| Bug Hunter | 71 | Finding security vulnerabilities | security playbook + 71 hunters |

---

## The idea worth remembering

The 936 skills are **advice** — Claude can follow them or skip them. The four
guardrails are the opposite: they run on their own and can actually stop an action.

So if you ever want reliable behavior, don't write it as a suggestion Claude might
remember. Wire it as a guardrail that fires automatically. **Suggestions get
forgotten; guardrails don't.** That's the single most useful lesson from how this
was built.
