# SuperBob must stay Windows + macOS (+ Linux) compatible

Users run Bob on all three. The extension is plain Node inside VS Code, so most code is
portable — but a few patterns break silently on Windows. This is the contract; the build
gates and CI enforce it.

## Rules (follow these in `vsix/extension/extension.js`)

1. **Paths:** always `path.join(...)` / `path.sep`. Never hardcode `/` or `\` in a filesystem
   path. Home is `os.homedir()`, temp is `os.tmpdir()` — never `/tmp`, `~`, `$HOME`, `%APPDATA%`.
2. **Shelling out:** Windows has no `/bin/zsh`, no `unzip`, no POSIX `command -v`. Route shell
   commands through `loginShell()` (raw on Windows, zsh elsewhere). Detect CLIs with
   `cliInstalled()` (`where` on Windows, `command -v` elsewhere). Unpack via `unzip()` (tar +
   PowerShell fallback on Windows, `unzip` elsewhere). Do not add a new bare `unzip`/shell call.
3. **Opening files/URLs:** use `vscode.env.openExternal(...)` or the `vscode.open` command.
   Never shell out to `open` (mac), `start` (Windows), `xdg-open`/`explorer` (Linux).
4. **Globs written into config** (e.g. `chat.agents.config.locations`): forward slashes only.
   `path.join(dir, '*.md')` yields backslashes on Windows and will not match — normalize with
   `dir.split(path.sep).join('/') + '/*.md'`.
5. **Webview inline scripts:** the HTML is a template literal; a stray backtick or an apostrophe
   escaped as `\'` inside a single-quoted string blanks the panel at runtime (it passes
   `node --check`). Keep the emitted scripts parseable.
6. **Every platform-touching change adds a test.** New shell-out / path / opener → add a case to
   `vsix/test-platform.js` (asserts branch selection under win32 **and** darwin).

## The gates that enforce this (run on every `build-vsix.sh`)

| Gate | Catches |
|------|---------|
| `vsix/validate-webviews.js` | a webview inline script that does not parse (blank panel) |
| `vsix/validate-platform.js` | static anti-patterns: unguarded `/bin/zsh`, bare `unzip`, `path.join` globs, `/Applications`, raw `/tmp`, OS-specific openers |
| `vsix/test-platform.js` | runs each platform branch under win32 **and** darwin, asserts the right command/path |
| `vsix/test-extract-real.js` | runs the real `unzip()` on the current OS against a fixture zip |

`build-vsix.sh` aborts if any gate fails.

## CI (the guarantee over time)

`.github/workflows/superbob-crossplatform.yml` runs all four checks on **real
windows-latest, macos-latest, and ubuntu-latest** for every push/PR that touches
`superbob/vsix/**`. Simulated tests prove branch selection on any host; CI proves the real
tools (tar/PowerShell/unzip) actually extract our zip on each OS. A change that breaks a
platform fails CI before anyone installs it.

## Quick local check

```bash
node superbob/vsix/validate-webviews.js && \
node superbob/vsix/validate-platform.js && \
node superbob/vsix/test-platform.js && \
node superbob/vsix/test-extract-real.js
```
