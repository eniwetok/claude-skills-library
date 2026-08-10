---
name: pptx-from-template
description: >
  Build brand-faithful PowerPoint decks from an existing .pptx template or reference deck.
  Preserves slide master, layouts, theme colors, and fonts exactly. Use whenever creating
  or updating a .pptx while maintaining brand styling. Triggers on: "from my template",
  "match our deck", "use this presentation's style", "use this pptx as the template",
  "keep the branding", "same style as", "build slides from template", "add slides to my deck",
  "create slides using this format", "update slides to match", "template-based slide generation",
  "use our brand deck", "follow our slide format", "make it look like this presentation".
allowed-tools: Read Write Edit Bash Glob Grep
---

# pptx-from-template: Brand-Faithful PowerPoint Builder

The template .pptx is the single source of truth for all visual styling. Never regenerate from scratch — always edit from the template.

**Dependencies (required):** python-pptx · Pillow
**Dependencies (optional):** LibreOffice (soffice) · poppler (pdftoppm) — only for visual QA if asked

---

## Core rule

Edit from the template. Always. The slide master, slide layouts, theme colors, and fonts live in the template file. Overwriting them destroys brand consistency. Use the unpack → clone layout → inject content → pack flow.

---

## Workflow

### Step 1 — Analyze the template

```bash
python scripts/thumbnail.py <template>.pptx
```

Read the thumbnail grid to understand: how many layouts exist, what placeholders each layout has, which layouts to clone for each content type.

Also extract text to see placeholder labels:
```bash
extract-text <template>.pptx
```

### Step 2 — Unpack

```bash
python scripts/office/unpack.py <template>.pptx unpacked/
```

Work inside `unpacked/ppt/slides/`. Each slide is an XML file. Slide layouts are in `unpacked/ppt/slideLayouts/`. The master is in `unpacked/ppt/slideMasters/`. **Do not modify the master or layouts.**

### Step 3 — Clone layouts and inject content

For each new slide:
1. Copy the appropriate layout's slide XML as the starting point
2. Replace placeholder text with user-provided content only
3. Preserve all shape IDs, positions, and style attributes
4. Remove or hide placeholders for sections the user did not provide content for — do not invent content

### Step 4 — Strip leftover placeholders

Before packing, grep for any unfilled placeholder text:
```bash
grep -r "xxx\|lorem\|ipsum\|TODO\|\[insert\|this slide layout" unpacked/ppt/slides/ -i
```
Fix every hit. Missing user content → flag it explicitly in your response rather than leaving a placeholder in the deck.

### Step 5 — Pack

```bash
python scripts/office/pack.py unpacked/ output.pptx
```

### Step 6 — Content QA

```bash
extract-text output.pptx | grep -iE "\bx{3,}\b|lorem|ipsum|\bTODO|\[insert|this.*(page|slide).*layout"
```

No results = clean. Any hit = fix before declaring done.

### Step 7 — Visual QA (only if explicitly requested)

Visual QA requires LibreOffice and poppler. Check before attempting:
```bash
which soffice 2>/dev/null && echo "soffice: available" || echo "soffice: not installed — skip visual QA"
which pdftoppm 2>/dev/null && echo "pdftoppm: available" || echo "pdftoppm: not installed — skip visual QA"
```

If both are available and the user asks for visual QA:
```bash
python scripts/office/soffice.py --headless --convert-to pdf output.pptx
rm -f slide-*.jpg && pdftoppm -jpeg -r 150 output.pdf slide
ls -1 "$PWD"/slide-*.jpg
```

Then inspect the images for overlaps, overflow, missing content, and placeholder text.

Final review is in PowerPoint (Microsoft Office is installed). Open the output file there for a final check. Do not iterate endlessly on sub-pixel positioning — fix real defects only.

---

## What NOT to do

- Do not regenerate the deck from scratch using pptxgenjs or python-pptx from blank slides
- Do not modify the slide master or slide layouts
- Do not call any remote slide generation service
- Do not invent content for sections the user did not provide
- Do not leave placeholder text in the output
- Do not open LibreOffice for QA unless the user explicitly asks

---

## Invocation examples

- "Create a 5-slide deck from my template.pptx with this content: …"
- "Add 3 slides to our company-deck.pptx matching the existing style"
- "Update slides 4–6 in brand-deck.pptx with the new Q3 numbers"
- "Build a pitch deck from this reference presentation"
