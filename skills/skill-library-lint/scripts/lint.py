#!/usr/bin/env python3
"""
skill-library-lint — integrity checker for a mode-based skill library (SuperBob).

The whole system rests on one assumption: when the agent runs "lean", it can only
see the core skills, so it depends on (a) the mode profiles and (b) the mission-control
router pointing at skills that ACTUALLY EXIST. A single dangling reference means the
agent walks into a dead end and silently improvises. This script proves that never
happens — and flags vendor lock-in / phone-home risks while it's in there.

Exit code is 0 only if every HARD check passes. Warnings never fail the build.
"""
import argparse
import os
import re
import sys

# --- What a reference is ALLOWED to point at besides a real vault skill ---
# These are legitimate non-vault names the router mentions on purpose.
BOB_BUILTINS = {
    "commit", "create-pr", "create-draft-pr", "update-pr", "merge",
    "sync", "sync-upstream", "act-on-feedback", "generate-run-commands",
}
NON_SKILL_TOKENS = {
    # MCP tools, mode names, and YAML frontmatter words that appear in backticks
    "code-review-graph", "update-config",
    "code", "data", "research", "security", "pm", "knowledge", "writing",
    "ui", "rag", "ship-it", "quick-fix", "declutter",
    "name", "description",
}

# --- Things a secured library should never DEPEND on (user requirement) ---
# Vendor products that phone home or lock you in, plus crypto-specific dead weight.
# CRITICAL distinction: we flag a DEPENDENCY, not a MENTION. A general testing skill
# that shows one example of mocking `window.ethereum` does not depend on Ethereum;
# a skill whose whole job is `npx @claude-flow/cli` does depend on claude-flow. So a
# token only counts when it appears in the skill's IDENTITY (frontmatter) or in an
# actual install/import line — never in an arbitrary code example or prose.
VENDOR_PATTERNS = [
    ("claude-flow", "ruflo / claude-flow product dependency"),
    ("agentic-flow", "ruflo / agentic-flow product dependency"),
    ("agentdb", "ruflo / AgentDB product dependency"),
    ("ecc-agentshield", "ECC AgentShield product dependency"),
    ("agentshield", "ECC AgentShield product dependency"),
    ("ethereum", "Ethereum-specific dependency"),
    ("keccak256", "Ethereum-specific dependency"),
    ("web3", "web3 / crypto dependency"),
    ("ethers", "web3 / crypto library dependency"),
]
# A line that actually pulls in a dependency (install or import). Only tokens found
# inside one of these count toward check [C].
DEP_CONTEXT_RE = re.compile(
    r"(?:npm\s+(?:install|i|add)|pnpm\s+add|yarn\s+add|npx|"
    r"pip3?\s+install|uv\s+(?:tool\s+)?install|brew\s+install|"
    r"require\(|import\s|from\s)[^\n]*",
    re.IGNORECASE,
)
# Egress = a skill that, in normal operation, sends the user's OWN data off-machine.
# Deliberately narrow: match the concrete signals a data-egress skill uses to describe
# itself, NOT words like "exfiltrate" that security skills use when describing attacks.
EGRESS_PATTERNS = ["off-machine", "--allow-egress", "sends wiki page", "send.*off-machine"]

# The router and the skill-finding protocol NAME other skills as their whole job, so
# scanning their prose for product/crypto tokens produces false positives (e.g. the
# router listing `web3-audit` as a routable security skill). Exclude them from the
# vendor-dependency scan — a router that mentions a skill is not a dependency on it.
ROUTER_SKILLS = {"mission-control", "using-superpowers"}


def first_paragraph_frontmatter(skill_md):
    """Return the (name+description) frontmatter block bytes — what the agent loads per skill."""
    try:
        with open(skill_md, "r", errors="ignore") as f:
            txt = f.read()
    except OSError:
        return ""
    m = re.match(r"^---\n(.*?)\n---", txt, re.DOTALL)
    return m.group(1) if m else ""


def read_profile(path):
    with open(path, "r", errors="ignore") as f:
        return [ln.strip() for ln in f if ln.strip()]


def resolve_dirs(args):
    """Pick the vault + profiles dirs, preferring explicit args, then Bob, then Claude."""
    vault = args.vault
    profiles = args.profiles
    if not vault:
        for c in (os.path.expanduser("~/.bob/skills-vault"),
                  os.path.expanduser("~/.claude/skills-vault")):
            if os.path.isdir(c):
                vault = c
                break
    if not profiles:
        for c in (os.path.expanduser("~/.bob/profiles"),):
            if os.path.isdir(c):
                profiles = c
                break
    return vault, profiles


def main():
    ap = argparse.ArgumentParser(description="Lint a mode-based skill library.")
    ap.add_argument("--vault", help="Path to the full skill vault (default: ~/.bob/skills-vault)")
    ap.add_argument("--profiles", help="Path to mode profiles dir of *.txt (default: ~/.bob/profiles)")
    ap.add_argument("--router", help="Path to mission-control SKILL.md (default: <vault>/mission-control/SKILL.md)")
    ap.add_argument("--max-mode-tokens", type=int, default=4000,
                    help="Warn if a mode's loaded name+description tokens exceed this (default 4000)")
    args = ap.parse_args()

    vault, profiles = resolve_dirs(args)
    if not vault or not os.path.isdir(vault):
        print("FATAL: could not find a skill vault. Pass --vault.")
        return 2
    if not profiles or not os.path.isdir(profiles):
        print("FATAL: could not find a profiles dir. Pass --profiles.")
        return 2
    router = args.router or os.path.join(vault, "mission-control", "SKILL.md")

    vault_skills = {d for d in os.listdir(vault)
                    if os.path.isdir(os.path.join(vault, d)) and not d.startswith(".")}
    profile_files = sorted(f for f in os.listdir(profiles) if f.endswith(".txt"))

    hard_fail = False
    print("=" * 64)
    print("  SKILL-LIBRARY-LINT")
    print(f"  vault:    {vault}  ({len(vault_skills)} skills)")
    print(f"  profiles: {profiles}  ({len(profile_files)} modes)")
    print("=" * 64)

    # --- CHECK A (HARD): every skill in every mode exists in the vault ---
    print("\n[A] Mode integrity — every mode skill exists in the vault")
    covered = set()
    a_broken = []
    for pf in profile_files:
        mode = pf[:-4]
        for s in read_profile(os.path.join(profiles, pf)):
            covered.add(s)
            if s not in vault_skills:
                a_broken.append((mode, s))
    if a_broken:
        hard_fail = True
        for mode, s in a_broken:
            print(f"    FAIL  {mode} -> {s}  (not in vault)")
    else:
        print(f"    PASS  all {len(covered)} referenced skills resolve")

    # --- CHECK B (HARD): every skill reference in the router resolves ---
    print("\n[B] Router integrity — every mission-control reference resolves")
    if not os.path.isfile(router):
        print(f"    SKIP  router not found at {router}")
    else:
        with open(router, "r", errors="ignore") as f:
            rtxt = f.read()
        refs = sorted(set(re.findall(r"`([a-z0-9][a-z0-9-]{2,})`", rtxt)))
        b_broken = []
        for r in refs:
            if r in vault_skills or r in BOB_BUILTINS or r in NON_SKILL_TOKENS:
                continue
            b_broken.append(r)
        if b_broken:
            hard_fail = True
            for r in b_broken:
                print(f"    FAIL  `{r}`  (phantom — not a vault skill, built-in, or known token)")
            print(f"          If one of these is a real Bob built-in or tool, add it to the")
            print(f"          allowlist near the top of this script.")
        else:
            print(f"    PASS  all {len(refs)} references resolve")

    # --- CHECK C (HARD): no vendor lock-in / crypto dependency in any mode skill ---
    print("\n[C] No external-product / crypto dependencies in mode skills")
    c_hits = []
    for s in sorted(covered):
        if s in ROUTER_SKILLS:
            continue  # routers name skills for a living; a mention is not a dependency
        sd = os.path.join(vault, s)
        if not os.path.isdir(sd):
            continue

        hit = None
        # (1) Identity: does the skill's own name+description declare the dependency?
        fm = first_paragraph_frontmatter(os.path.join(sd, "SKILL.md")).lower()
        for pat, why in VENDOR_PATTERNS:
            if pat in fm:
                hit = (s, why, "named in frontmatter")
                break
        # (2) Dependency lines: does any file actually install/import the product?
        if not hit:
            for root, _, files in os.walk(sd):
                if hit:
                    break
                for fn in files:
                    if not fn.endswith((".md", ".sh", ".py", ".js", ".ts", ".json")):
                        continue
                    try:
                        body = open(os.path.join(root, fn), "r", errors="ignore").read()
                    except OSError:
                        continue
                    for m in DEP_CONTEXT_RE.finditer(body):
                        line = m.group(0).lower()
                        for pat, why in VENDOR_PATTERNS:
                            if pat in line:
                                hit = (s, why, f"install/import in {fn}")
                                break
                        if hit:
                            break
                    if hit:
                        break
        if hit:
            c_hits.append(hit)

    if c_hits:
        hard_fail = True
        for s, why, where in c_hits:
            print(f"    FAIL  {s}  ({why}; {where})")
    else:
        print("    PASS  no vendor-product or crypto dependencies found")

    # --- CHECK D (WARN): token budget per mode ---
    print(f"\n[D] Token budget per mode  (warn > {args.max_mode_tokens})")
    for pf in profile_files:
        mode = pf[:-4]
        total = 0
        for s in read_profile(os.path.join(profiles, pf)):
            total += len(first_paragraph_frontmatter(os.path.join(vault, s, "SKILL.md")))
        tok = total // 4
        flag = "  <-- OVER BUDGET" if tok > args.max_mode_tokens else ""
        print(f"    {mode:<14} ~{tok:>5} tokens{flag}")

    # --- CHECK E (INFO): egress — skills that can send your data off-machine ---
    print("\n[E] Egress review — skills that can transmit your data (informational)")
    e_hits = []
    for s in sorted(covered):
        md = os.path.join(vault, s, "SKILL.md")
        if not os.path.isfile(md):
            continue
        body = open(md, "r", errors="ignore").read().lower()
        # Only flag skills whose OWN operation moves the user's data off-machine.
        if "off-machine" in body or "--allow-egress" in body:
            e_hits.append(s)
    if e_hits:
        for s in e_hits:
            print(f"    NOTE  {s}  — can egress data; confirm it is gated / off by default")
    else:
        print("    none flagged")

    # --- CHECK F (INFO): orphans ---
    orphans = vault_skills - covered
    print(f"\n[F] Coverage — {len(covered)} skills in a mode, {len(orphans)} orphaned (info only)")
    print("    Orphans stay reachable via the router's vault-scan fallback; not an error.")

    print("\n" + "=" * 64)
    if hard_fail:
        print("  RESULT: FAIL — hard checks [A/B/C] found problems above.")
        print("=" * 64)
        return 1
    print("  RESULT: PASS — library integrity is sound.")
    print("=" * 64)
    return 0


if __name__ == "__main__":
    sys.exit(main())
