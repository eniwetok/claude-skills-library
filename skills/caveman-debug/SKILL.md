---
name: caveman-debug
description: >
  Primitive print-statement debugging — instrument code with strategic log
  statements to expose runtime state, then strip them after the bug is found.
  Use when: "caveman", "caveman debug", "caveman this", "add print statements",
  "log everything", "just add logs", "I can't attach a debugger",
  "print-driven debugging", or any situation where a proper debugger is
  unavailable or overkill.
---

# Caveman Debug

No debugger? No problem. We instrument, we observe, we remove.

## The Method

**Phase 1 — Identify the dark zones**

Before adding a single log, read the code and mark where state is unknown:
- Entry point of the suspected function
- Every branch (if/else/switch arm)
- Before and after each external call (DB, API, file I/O)
- Loop start, each iteration, and exit
- Return points and thrown exceptions

**Phase 2 — Instrument**

Add a `[CAVE]` prefix to every log statement so they're easy to grep and strip later.

| Language | Statement |
|----------|-----------|
| Python | `print(f"[CAVE] label: {value}")` |
| JavaScript / TS | `console.log('[CAVE] label:', value)` |
| Go | `fmt.Printf("[CAVE] label: %+v\n", value)` |
| Java / Kotlin | `System.err.println("[CAVE] label: " + value)` |
| Ruby | `$stderr.puts "[CAVE] label: #{value.inspect}"` |
| Rust | `eprintln!("[CAVE] label: {:?}", value)` |
| PHP | `error_log("[CAVE] label: " . print_r($value, true))` |
| Swift | `print("[CAVE] label: \(value)")` |
| C / C++ | `fprintf(stderr, "[CAVE] label: %s\n", value)` |
| Shell | `echo "[CAVE] label: $value" >&2` |

**What to log at each point:**
- Function entry: all arguments, any relevant global/env state
- Branch taken: which condition was true and the value that decided it
- Loop: iteration index + key variables each pass
- Before external call: the exact inputs being sent
- After external call: the raw response or error
- Return: the value being returned

**Phase 3 — Run and read**

Run the failing scenario. Read logs top-to-bottom. Find the first line where the value is wrong or missing — that's where the bug lives.

**Phase 4 — Strip**

Once the bug is fixed, remove every `[CAVE]` line:

```bash
# Preview what will be removed
grep -rn '\[CAVE\]' .

# Strip them (adjust file pattern as needed)
grep -rl '\[CAVE\]' . | xargs sed -i '' '/\[CAVE\]/d'
```

Or ask: "remove all caveman logs" and I'll strip them in one pass.

---

## Rules

1. **Log to stderr, not stdout** — keeps output parseable if the program pipes stdout
2. **Never log secrets** — mask tokens, passwords, PII before printing
3. **Include variable name in the label** — `[CAVE] user_id: 42` not `[CAVE] 42`
4. **Log before AND after suspicious calls** — if the after-log never prints, the call hung or crashed
5. **Always strip before committing** — `[CAVE]` lines are not for production

---

## Anti-patterns to avoid

- Adding logs in only one place and concluding too early
- Logging inside a tight loop without a counter (floods output, masks the signal)
- Forgetting to log the error object in catch blocks — log `err` not just `"error occurred"`
- Leaving `[CAVE]` logs in after the fix

---

## Quick invocations

- **"caveman this function"** → instrument the named function end-to-end
- **"caveman the whole file"** → instrument every function in the file
- **"caveman just the loop"** → add iteration-level logging inside the specified loop
- **"remove caveman logs"** → strip all `[CAVE]` lines from the codebase
