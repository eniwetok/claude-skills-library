# Inside `extension.js`

← [Wiki home](README.md)

One CommonJS file (~775 lines), no build step. Exports `activate` / `deactivate`. Structure,
top to bottom:

## 1. Constants & paths

`BOB_VAULT`, `BOB_ACTIVE`, `BOB_PROFILES`, `BOB_RULES` (all under `~/.bob/`), plus `CORE`
(the two always-on skills) and `BUILTIN` (the starter kits). The auto-rule text and the two
scope variants live here too.

## 2. Inventory & apply

- `listVaultSkills()` — reads every vault skill's frontmatter for its description and a token
  estimate (used by the panel).
- `applySkillSet()` / `applyProfile()` — the core "load these skills" operation
  ([architecture.md](architecture.md#applying-a-kit-applyskillset)).
- `saveCustomProfile()` / `deleteCustomProfile()` — user-created kits. The name is sanitized to
  **kebab-case** (`[^a-z0-9-] → -`), matching the built-in kits and the skills.

## 3. Ownership & power

`managedSet()` / `writeManaged()` (the `.superbob-managed` manifest), `superbobOff()`, and the
auto-rule writers `writeAutoRule()` / `removeAutoRule()` + scope `readScope()` / `writeScope()`.

## 4. Optional tools (currently empty)

`OPTIONAL_TOOLS = []`. A generic opt-in-tool mechanism (install a CLI + activate a skill) lives
here; it has no tools right now. The panel section hides itself when the list is empty. (OpenWiki
was removed — an IBM-gateway Bob exposes no model credential to the shell, so an external CLI has
nothing to authenticate with.)

## 5. The webview panel

One HTML string (`getWebviewHtml`) rendered in both the activity-bar view
(`SuperBobViewProvider`) and an optional editor tab. Plain inline CSS/JS, themed with
`var(--vscode-*)`. The client script sends typed messages; the extension replies with a `state`
message that the client renders.

### Message handlers (`handleMessage`)

| Message | Effect |
|---------|--------|
| `install` | Unpack the bundled `skills.zip` into the vault (`doInstall`) |
| `setPower {on}` | SuperBob on (lean) / off (`superbobOff`) |
| `applyProfile {name}` / `applyLean` | Load a kit / go back to auto |
| `applyCustom {skills}` | Load an ad-hoc set |
| `saveMode` / `deleteMode` | Create / remove a user kit |
| `setScope {scope}` | `all` vs `superbob-only`; rewrites the auto-rule |
| `toolToggle {tool,on}` | Enable/disable an optional tool (none today) |

Every handler ends by calling `postState()` so all open panels re-render.

## 6. Activation

`activate()` registers the view provider, the commands (`superBobSkills.*`), and a status-bar
item. `module.exports = { activate, deactivate }`.

## Reading order for a newcomer

1. The constants block (top) — the whole data model in ~40 lines.
2. `applySkillSet()` — the one operation everything else wraps.
3. `handleMessage()` — the list of everything the UI can do.
4. `getWebviewHtml()` — the panel, if you're touching UI.

Next: [architecture.md](architecture.md) · [kits.md](kits.md)
