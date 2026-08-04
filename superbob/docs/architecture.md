# Architecture (runtime model)

← [Wiki home](README.md)

A VS Code extension can't "register" agent skills — Bob reads skills as `SKILL.md` files from
disk. So SuperBob is an **installer + control panel**: it unpacks the library into Bob's folders
and controls *which* skills are active, to keep Bob's starting context small.

## The three folders (all under `~/.bob/`)

| Folder | Constant in `extension.js` | Bob reads it? | Holds |
|--------|---------------------------|---------------|-------|
| `skills-vault/` | `BOB_VAULT` | **No** | The full library, sitting unread. Costs nothing until loaded. |
| `skills/` | `BOB_ACTIVE` | **Yes** | Only the currently active skills. This is the small set Bob loads at chat start. |
| `profiles/` | `BOB_PROFILES` | n/a | The **kits** — one `<kit>.txt` per kit (each line a skill name) + `_meta.json`. |

**Lean idea:** by default only two `CORE` skills stay active —
`['using-superpowers', 'mission-control']` — ~200 tokens instead of ~67,000. `mission-control`
(the router) pulls the rest from the vault on demand.

## Applying a kit (`applySkillSet`)

Loading a kit copies the wanted skills from `skills-vault/` into `skills/`:

1. `wanted = CORE ∪ the kit's skills`.
2. Remove from `skills/` only the skills SuperBob itself placed that are no longer wanted.
3. Copy the wanted skills fresh from the vault (also picks up vault updates).
4. Write the profile label to `skills/.profile` and the manifest.

## Ownership — the manifest (critical)

SuperBob must never delete a skill the **user** installed themselves, even if it shares a name
with a vault skill. Ownership is **manifest-based**, not name-based:

- `~/.bob/skills/.superbob-managed` lists exactly what SuperBob placed.
- Anything in `skills/` **not** in that manifest is the user's own → never touched, never shown
  as "loaded by SuperBob", never removed on a kit switch.

This replaced an earlier name-match approach that wrongly claimed user skills.

## On / Off (power)

- **On** → lean (core only) or a chosen kit is in `skills/`.
- **Off** (`superbobOff`) → removes every *managed* skill from `skills/`, leaving only the user's
  own; writes `.profile = off` and an empty manifest. Bob then runs normally.

## Automatic routing (the rule)

So users don't have to type `/superbob`, SuperBob writes a **global rule** that Bob injects into
every conversation:

- File: `~/.bob/rules/superbob-auto.md` (Bob reads all of `~/.bob/rules/`).
- Written when SuperBob is on, removed when off (tracks the toggle).
- It tells Bob to check for a matching skill and route via `mission-control` automatically, and
  to show a short `▸ SuperBob → …` marker so it's visible it ran.

## Skill scope

A setting decides which skills the rule routes:

| Scope (`~/.bob/.superbob-scope`) | Behavior |
|----------------------------------|----------|
| `all` (default) | Routes the user's own skills **and** SuperBob's; the marker names the origin. |
| `superbob-only` | Routes only vault/kit skills; leaves the user's own skills to Bob. |

`writeAutoRule()` picks the matching rule text from the scope.

## Where things live (quick ref)

| Concept | On disk |
|---------|---------|
| Full library | `~/.bob/skills-vault/<skill>/SKILL.md` |
| Active skills | `~/.bob/skills/<skill>/SKILL.md` |
| Ownership manifest | `~/.bob/skills/.superbob-managed` |
| Active kit label | `~/.bob/skills/.profile` |
| Kits | `~/.bob/profiles/<kit>.txt` + `_meta.json` |
| Auto-route rule | `~/.bob/rules/superbob-auto.md` |
| Scope | `~/.bob/.superbob-scope` |

Next: [extension.md](extension.md) · [build-and-release.md](build-and-release.md)
