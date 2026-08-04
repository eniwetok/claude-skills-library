#!/usr/bin/env python3
"""
scan_injection.py — prompt-injection / malicious-skill scanner for a skills library.

Motivated by Snyk's ToxicSkills research (prompt injection in ~36% of skills; "three lines of
markdown can grant shell access"). Skills are instructions an agent follows plus scripts it may
run, with no signing/review/sandbox — so we inspect both.

What it does: for every SKILL.md it finds, it scans that file AND the scripts bundled next to it
(.sh/.py/.js/.mjs/.ts/.rb in the same skill folder) for tiered red flags. It tags skills that are
security-education (attack patterns are their subject) so those hits can be read as expected.

Usage:  python3 scan_injection.py [LIBRARY_ROOT]   (default: 3 dirs up)
Exit:   2 if any CRITICAL, 1 if any HIGH (in non-security skills), else 0.
"""
import os, re, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SKILL_EXT = (".sh", ".py", ".js", ".mjs", ".ts", ".rb", ".bash", ".zsh")
# Skip vendored code AND mirror copies (.claude/.codex/.cursor/.agents duplicate each skill).
SKIP_DIRS = {"node_modules", ".git", "dist", "build", "__pycache__", ".next", "vendor",
             ".claude", ".codex", ".cursor", ".agents", ".github", "evals", "tests"}
SELF = os.path.basename(__file__)

# Security-education skills legitimately contain attack strings. Tag (don't hide) them.
SEC_HINTS = ("hunt-", "redteam", "red-team", "bug-bounty", "bugcrowd", "bughunter", "bounty", "vibesec", "security",
             "osint", "exploit", "apk-", "web2-recon", "web3-audit", "supply-chain-attack",
             "enterprise-vpn", "m365-", "okta-attack", "vmware-", "cloud-iam", "defi-", "evm-",
             "meme-coin", "recon", "attack", "pentl", "safety", "gateguard", "vulnerab")

def is_security(skill_path):
    p = skill_path.lower()
    return any(h in p for h in SEC_HINTS)

# ---- pattern sets -------------------------------------------------------------
# CRITICAL: a bundled SCRIPT that actually executes remote/obfuscated code or exfiltrates secrets.
SCRIPT_CRITICAL = [
    (r"curl[^\n|]*\|\s*(sudo\s+)?(ba)?sh", "pipe remote content to a shell (curl|bash)"),
    (r"wget[^\n|]*\|\s*(ba)?sh", "pipe remote content to a shell (wget|sh)"),
    (r"/dev/tcp/", "reverse-shell socket (/dev/tcp)"),
    (r"\bn(c|cat)\b[^\n]*\s-e\b", "netcat exec (reverse shell)"),
    (r"bash\s+-i\s*>&?\s*/dev/tcp", "interactive reverse shell"),
    (r"eval\(\s*(atob|base64|Buffer\.from)", "eval of decoded/obfuscated payload"),
    (r"exec\(\s*(base64|__import__\('base64')", "exec of decoded payload"),
    (r"(id_rsa|\.ssh/|\.aws/credentials|\.netrc|\.env)\b[^\n]{0,120}(curl|wget|requests\.|urllib|fetch\(|nc\b)", "reads secrets and sends them out"),
]
# HIGH: SKILL.md prose that injects instructions or asks to exfiltrate SECRETS. High-precision:
# generic "POST https://..." (API docs) and "silently" (prose) are deliberately NOT here.
PROSE_HIGH = [
    (r"ignore\s+(all\s+)?(the\s+)?(previous|prior|above|earlier)\s+instructions", "instruction override"),
    (r"disregard\s+(the\s+)?(system\s+prompt|previous\s+instructions|safety)", "instruction override"),
    (r"(new|updated|real)\s+system\s+prompt\s*:", "system-prompt override"),
    (r"(exfiltrate|steal)\b[^\n]{0,60}(key|token|password|credential|secret|\.env|data)", "exfiltration instruction"),
    (r"(send|upload|post|email)\b[^\n]{0,60}(api[_ -]?key|password|secret token|\.env\b|id_rsa|credentials)\b[^\n]{0,60}(https?://|to\s+\S+@|to\s+https?)", "sends secrets to a URL"),
    (r"\bsecretly\b[^\n]{0,40}(send|exfiltrate|run|exec|delete|read|upload)", "covert action"),
    (r"disable\s+(safety|guardrails?|the\s+sandbox|confirmations?\s+for\s+all)", "disable safety"),
]
# MEDIUM: obfuscation / hidden channels / broad tool asks.
MEDIUM = [
    (r"[​‌‍‎‏‪-‮⁠﻿]", "zero-width / bidi unicode (hidden text)"),
    (r"<!--[^>]{0,400}(ignore|system|instruction|do not|secret|run|exec)[^>]{0,400}-->", "instruction hidden in HTML comment"),
    (r"[A-Za-z0-9+/]{120,}={0,2}", "long base64-looking blob"),
]
FRONTMATTER_BASH = re.compile(r"allowed-tools:[^\n]*\b(Bash|Shell|Execute)\b", re.I)

def scan_text(text, patterns):
    out = []
    for rx, why in patterns:
        for m in re.finditer(rx, text, re.I):
            line = text.count("\n", 0, m.start()) + 1
            out.append((why, line, text[max(0, m.start()-20):m.start()+60].replace("\n", " ").strip()))
    return out

def find_skill_dirs(root):
    for dp, dns, fns in os.walk(root):
        dns[:] = [d for d in dns if d not in SKIP_DIRS]
        if "SKILL.md" in fns:
            yield dp

def main():
    crit, high, med = [], [], []
    sec_hits = 0
    n_skills = 0
    for sdir in find_skill_dirs(ROOT):
        n_skills += 1
        sec = is_security(sdir)
        rel = os.path.relpath(sdir, ROOT)
        # scan SKILL.md prose + frontmatter
        skill_md = os.path.join(sdir, "SKILL.md")
        try:
            md = open(skill_md, encoding="utf-8", errors="replace").read()
        except Exception:
            md = ""
        for why, ln, snip in scan_text(md, PROSE_HIGH):
            (sec_hits and sec) or high.append((rel + "/SKILL.md", ln, why, snip, sec))
            if sec: sec_hits += 1
        for why, ln, snip in scan_text(md, MEDIUM):
            med.append((rel + "/SKILL.md", ln, why, snip, sec))
        if FRONTMATTER_BASH.search(md):
            med.append((rel + "/SKILL.md", 1, "requests Bash in allowed-tools", "", sec))
        # scan bundled scripts (the real 'shell access' risk)
        for dp, dns, fns in os.walk(sdir):
            dns[:] = [d for d in dns if d not in SKIP_DIRS]
            for fn in fns:
                if fn == SELF:
                    continue   # don't flag this scanner's own pattern strings
                if fn.endswith(SKILL_EXT):
                    fp = os.path.join(dp, fn)
                    try:
                        code = open(fp, encoding="utf-8", errors="replace").read()
                    except Exception:
                        continue
                    for why, ln, snip in scan_text(code, SCRIPT_CRITICAL):
                        crit.append((os.path.relpath(fp, ROOT), ln, why, snip, sec))

    def show(title, items, limit=40):
        print(f"\n{'='*70}\n{title} — {len(items)} finding(s)\n{'='*70}")
        for f, ln, why, snip, sec in items[:limit]:
            tag = " [security-skill: likely expected]" if sec else ""
            print(f"  {f}:{ln}  {why}{tag}\n      … {snip[:90]}")
        if len(items) > limit:
            print(f"  … and {len(items)-limit} more")

    print(f"Scanned {n_skills} skills under {ROOT}")
    show("CRITICAL — bundled script executes remote/obfuscated code or exfiltrates secrets", crit)
    real_high = [h for h in high if not h[4]]
    show("HIGH — injection / exfiltration / safety-bypass in SKILL.md (non-security skills)", real_high)
    show("MEDIUM — obfuscation, hidden channels, broad tool asks", med, 25)
    print(f"\n{'='*70}\nSUMMARY: {len(crit)} critical · {len(real_high)} high (non-security) · {len(med)} medium")
    print("Security-education skills are tagged; their attack strings are usually subject matter, not injection.")
    print("="*70)
    sys.exit(2 if crit else (1 if real_high else 0))

if __name__ == "__main__":
    main()
