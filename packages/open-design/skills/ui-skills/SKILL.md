---
name: ui-skills
description: |
  Pointer skill. The real ibelick UI skills are ALREADY INSTALLED locally as five
  separate skills. Use this only to find the right one. Opinionated constraints for
  building and fixing interfaces.
triggers:
  - "ui constraints"
  - "ui guide"
  - "opinionated ui"
  - "ui rules"
  - "ui skills"
od:
  mode: design-system
  category: design-systems
  upstream: "https://github.com/ibelick/ui-skills"
---

# ui-skills — pointer only

> Curated from @ibelick. **The real skills are installed locally — do NOT fetch from upstream.**

## Read this first

This file used to say "go install the upstream bundle." That is now **out of date**.
As of Group 18, the actual ibelick skills are installed and available directly.
Invoke one of these five by name instead of this file:

| Use this skill | When |
|----------------|------|
| `baseline-ui` | Fast cleanup of AI-generated UI — spacing, hierarchy, typography, layout |
| `fixing-accessibility` | Audit/fix HTML accessibility — ARIA, keyboard, focus, contrast, forms |
| `fixing-motion-performance` | Animations stutter or jank — layout thrashing, compositor, blur |
| `fixing-metadata` | Page titles, Open Graph, Twitter cards, favicons, JSON-LD, robots |
| `improve-ui` | READ-ONLY audit of an existing surface; writes a plan for another agent |

## Build vs fix

These five **fix** interfaces that already exist. To **build** new ones, use
`frontend-design`, `shadcn-ui`, `design-system`, `motion-ui`, or the `gsap-*` skills.
`mission-control` (Workflow K) has the full routing table.

## Source

- Upstream: https://github.com/ibelick/ui-skills (MIT) — vendored at `packages/ui-skills-ibelick/`
- Category: `design-systems`
