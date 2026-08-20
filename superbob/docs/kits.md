# Kits

← [Wiki home](README.md)

A **kit** is a named set of skills you load together for one kind of work. It's just a text file.

## Anatomy

| File | Role |
|------|------|
| `bob/profiles/<kit>.txt` | One skill name per line — the kit's contents |
| `bob/profiles/_meta.json` | `"<kit>": "one-line plain-English description"` — the cue Auto mode reads |
| `BUILTIN` array in `extension.js` | Lists the built-in "starter" kits (non-deletable) |

Names are **kebab-case**, matching the skills (e.g. `software-development`, `wiki`). The two
`CORE` skills (`using-superpowers`, `mission-control`) are always on and never listed in a kit.

## The built-in kits

`software-development`, `data-analysis`, `product-management`, `production-engineering`,
`test-engineering`, `application-security`, `frontend-design`, `web-research`, `release-review`,
`bug-fixing`, `code-simplification`, `rag-evaluation`, `content-writing`, `wiki` — plus two
`sample-*` kits under "Your kits" as examples.

### The `wiki` kit

Documents and onboards a **codebase** (not personal notes — the Obsidian stack is excluded, see
[build-and-release.md](build-and-release.md#exclude--what-never-ships-and-why)):

```
codebase-onboarding   code-tour            repo-scan
documentation         docs-page            documentation-lookup
architecture          architecture-decision-records
system-design         knowledge-ops
```

~831 tokens. Use it with `/superbob wiki` or the panel, then say "onboard this codebase."

## How to add a kit

1. **Write the profile** in both places (shipped source + your live Bob):
   ```bash
   printf '%s\n' skill-a skill-b skill-c > superbob/bob/profiles/<kit>.txt
   printf '%s\n' skill-a skill-b skill-c > ~/.bob/profiles/<kit>.txt
   ```
2. **Add a description** to both `_meta.json` files under the key `<kit>`.
3. **Register it** (if it should be a built-in) by adding `<kit>` to the `BUILTIN` array in
   `extension.js`. User-created kits skip this — the panel's *Create your own kit* writes the
   profile + meta for you (via `saveCustomProfile`).
4. **Verify** every listed skill exists in the vault (the lint gate's check [A] enforces this).
5. **Rebuild + install** — see [build-and-release.md](build-and-release.md).

**Keep kits lean.** Eight sharp skills beat thirty vague ones; the whole point is a small context.

Next: [architecture.md](architecture.md) · [extension.md](extension.md)
