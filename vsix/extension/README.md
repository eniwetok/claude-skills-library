# Skills Library (Bob & Claude Code)

Installs a large skill library into **IBM Bob** and **Claude Code**, and lets you
switch skill **profiles** from the command palette so the agent's context stays small.

## Why profiles

Bob loads every installed skill's name + description at the start of a conversation.
The full library is ~67,000 tokens before you type anything. This extension keeps the
full library in a vault Bob does not read, and loads only a small task profile (~2k tokens).

## Commands (Cmd/Ctrl+Shift+P)

- **Skills Library: Install / Update Skills** — unpacks the library into Bob and/or Claude Code
- **Skills Library: Load Profile…** — pick code / data / pm / security / ui / research
- **Skills Library: Show Active Profile**

The status bar (bottom-left) shows the active profile; click it to switch.
After switching, **restart the Bob conversation** so it re-reads the skills.

## Target

Set `skillsLibrary.targets` to `both` (default), `bob`, or `claude`.

## Note

A VS Code extension cannot register agent skills directly — skills are files Bob and
Claude Code read from disk. This extension installs those files and controls the
profile system. Requires `unzip` (present on macOS/Linux). Tested against IBM Bob 2.0.1.
