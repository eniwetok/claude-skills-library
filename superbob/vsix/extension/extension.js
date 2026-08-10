// SuperBob, installs best-practice skills into IBM Bob.
//
// A VS Code extension cannot "register" agent skills, skills are SKILL.md files that
// the agent reads from disk folders (~/.bob/skills). So this extension
// is an INSTALLER + CONTROL PANEL: it unpacks the bundled library into those folders and
// controls which skills are loaded, to keep the agent's context small.

const vscode = require('vscode');
const cp = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const HOME = os.homedir();
const BOB_VAULT = path.join(HOME, '.bob', 'skills-vault');
const BOB_ACTIVE = path.join(HOME, '.bob', 'skills');
const BOB_PROFILES = path.join(HOME, '.bob', 'profiles');
const BOB_RULES = path.join(HOME, '.bob', 'rules');   // Bob's global custom-rules dir (all modes)

// A global rule that makes SuperBob automatic: Bob injects every file in ~/.bob/rules into
// each conversation, so this removes the need to type /superbob to "run" SuperBob. It is
// written whenever SuperBob is on and removed when it's switched off, so it tracks the toggle.
const AUTO_RULE_FILE = () => path.join(BOB_RULES, 'superbob-auto.md');
const AUTO_RULE_ALL = `# SuperBob, automatic skill routing (managed by the SuperBob extension; do not edit by hand)

SuperBob is ON. Do this at the start of EVERY task, in every mode, automatically, without
being asked and without needing the \`/superbob\` command.

**First line of your reply, always**, show a short marker so it's visible SuperBob ran, and
say where the skill comes from:
- a skill from a SuperBob kit or the vault → \`▸ SuperBob → from kit: <skill-name>\`
- one of the user's own already-installed skills → \`▸ SuperBob → your own skill: <skill-name>\`
- nothing fits → \`▸ SuperBob → no specific skill needed\`

Then:

1. **Check for a skill (using-superpowers).** Look for a relevant skill in \`~/.bob/skills\`
   (already active, including the user's own) and in \`~/.bob/skills-vault\` (loaded on demand).
   Read the matching \`SKILL.md\` and follow it. Use whichever fits best, but label its origin
   in the marker above, and never imply SuperBob owns a skill the user installed themselves.
2. **Route with mission-control.** When no active skill clearly fits, read
   \`~/.bob/skills/mission-control/SKILL.md\` and use it to pull the right skill from the vault.
3. **Don't over-claim.** Never say work is verified unless you actually ran the check.

**Honor active add-ons.** If an optional add-on skill is active in \`~/.bob/skills\` (for example an output-style skill like \`i-have-adhd\`), follow it on every response for the whole session, regardless of its own invocation setting.

Loading a specific kit with \`/superbob <kit>\` or the SuperBob sidebar is optional, the routing
above is automatic. If SuperBob is switched **off** in the sidebar, this file is removed and Bob
behaves normally.
`;
// Scope variant: SuperBob routes ONLY its own vault/kit skills and leaves the user's own alone.
const AUTO_RULE_SUPERBOB_ONLY = `# SuperBob, automatic skill routing (managed by the SuperBob extension; do not edit by hand)

SuperBob is ON, scoped to its OWN skills only. Do this at the start of EVERY task, in every
mode, automatically, without being asked and without needing the \`/superbob\` command.

**First line of your reply, always**, show a short marker so it's visible SuperBob ran:
- a skill from a SuperBob kit or the vault → \`▸ SuperBob → from kit: <skill-name>\`
- nothing in SuperBob fits → \`▸ SuperBob → no matching skill (using Bob normally)\`

Then:

1. **Check SuperBob's skills only (using-superpowers).** Look in \`~/.bob/skills-vault\` and the
   active core skills. If one fits, read its \`SKILL.md\` and follow it.
2. **Route with mission-control** when unsure which SuperBob skill applies.
3. **Leave the user's own skills to Bob.** Do NOT reach for, apply, or manage skills the user
   installed themselves, those are outside SuperBob's scope in this mode.
4. **Don't over-claim.** Never say work is verified unless you actually ran the check.

**Honor active add-ons.** If an optional add-on skill is active in \`~/.bob/skills\` (for example an output-style skill like \`i-have-adhd\`), follow it on every response for the whole session, regardless of its own invocation setting.

Switch back to "All skills" in the SuperBob panel to let it route your own skills too. If SuperBob
is switched **off**, this file is removed and Bob behaves normally.
`;
// Which skills SuperBob routes: 'all' (yours + SuperBob, default) or 'superbob-only'.
const SCOPE_FILE = () => path.join(HOME, '.bob', '.superbob-scope');
function readScope() { try { return fs.readFileSync(SCOPE_FILE(), 'utf8').trim() === 'superbob-only' ? 'superbob-only' : 'all'; } catch (e) { return 'all'; } }
function writeScope(s) { try { fs.writeFileSync(SCOPE_FILE(), (s === 'superbob-only' ? 'superbob-only' : 'all') + '\n'); } catch (e) {} }
// Auto-routing on/off (independent of kits). ON = mission-control auto-picks per task, scoped to
// the loaded kits (or the whole vault when no kit is loaded). OFF = no auto-routing (manual).
const AUTO_FILE = () => path.join(HOME, '.bob', '.superbob-auto');
function readAuto() { try { return fs.readFileSync(AUTO_FILE(), 'utf8').trim() !== 'off'; } catch (e) { return true; } }
function writeAuto(on) { try { fs.writeFileSync(AUTO_FILE(), (on ? 'on' : 'off') + '\n'); } catch (e) {} }
// The kits currently loaded, parsed from the '.profile' label ('core + kitA kitB').
function activeKitNames() { const p = activeProfile(); if (!p || p.indexOf('core + ') !== 0) return []; return p.slice(7).split(' ').filter(k => k && fs.existsSync(path.join(BOB_PROFILES, k + '.txt'))); }
function writeAutoRule() {
  try {
    if (!readAuto()) { removeAutoRule(); return; }   // auto off: no auto-routing rule
    fs.mkdirSync(BOB_RULES, { recursive: true });
    let text = readScope() === 'superbob-only' ? AUTO_RULE_SUPERBOB_ONLY : AUTO_RULE_ALL;
    const kits = activeKitNames();
    if (kits.length) {   // scope auto-routing to the loaded kits
      text += '\n## Scope: stay within the loaded kit' + (kits.length > 1 ? 's' : '') + '\n\n' +
        kits.length + ' kit' + (kits.length > 1 ? 's are' : ' is') + ' loaded (' + kits.join(', ') + '). Their skills are in `~/.bob/skills`. For each task, prefer a skill from these loaded kits. Only reach into the wider `~/.bob/skills-vault` if none of the loaded skills fits, and say so when you do.\n';
    }
    fs.writeFileSync(AUTO_RULE_FILE(), text);
  } catch (e) {}
}
function removeAutoRule() { try { fs.rmSync(AUTO_RULE_FILE(), { force: true }); } catch (e) {} }

// ---- per-kit settings: rulesync generation targets (agentic-authoring) -----
// A kit can expose settings its skills read at run time. The first instance:
// which tools the agentic-authoring kit generates for. Stored per kit in
// ~/.bob/.superbob-kit-settings.json = { "<kit>": { targets: [<id>...] } }.
const KIT_SETTINGS_FILE = () => path.join(HOME, '.bob', '.superbob-kit-settings.json');
function readKitSettings() { try { return JSON.parse(fs.readFileSync(KIT_SETTINGS_FILE(), 'utf8')); } catch (e) { return {}; } }
function writeKitSettings(o) { try { fs.writeFileSync(KIT_SETTINGS_FILE(), JSON.stringify(o, null, 2) + '\n'); } catch (e) {} }
// rulesync target ids, labelled for the UI. Default (nothing saved) = all on.
const RULESYNC_TARGETS = [
  { id: 'agentsmd', label: 'AGENTS.md (portable standard)' },
  { id: 'claudecode', label: 'Claude Code' },
  { id: 'roo', label: 'Bob / Roo' },
  { id: 'codexcli', label: 'Codex' },
  { id: 'cursor', label: 'Cursor' }
];
function kitTargets(kit) {
  const s = readKitSettings()[kit];
  if (s && Array.isArray(s.targets) && s.targets.length) return s.targets;
  return RULESYNC_TARGETS.map(t => t.id);   // default: every target
}
function setKitTarget(kit, target, on) {
  const all = readKitSettings();
  const cur = new Set(kitTargets(kit));
  if (on) cur.add(target); else cur.delete(target);
  let arr = RULESYNC_TARGETS.map(t => t.id).filter(id => cur.has(id));
  if (!arr.length) arr = ['agentsmd'];   // never empty: keep the portable standard
  all[kit] = { targets: arr };
  writeKitSettings(all);
  return arr;
}
// A rule Bob reads globally so it honours the chosen targets when it runs rulesync.
// Present only while the agentic-authoring kit is loaded; self-removes otherwise.
const TARGETS_RULE_FILE = () => path.join(BOB_RULES, 'superbob-rulesync-targets.md');
function writeTargetsRule() {
  try {
    if (!activeKitNames().includes('agentic-authoring')) { removeTargetsRule(); return; }
    const ids = kitTargets('agentic-authoring');
    const labels = ids.map(id => (RULESYNC_TARGETS.find(t => t.id === id) || {}).label || id).join(', ');
    fs.mkdirSync(BOB_RULES, { recursive: true });
    fs.writeFileSync(TARGETS_RULE_FILE(),
      '# SuperBob, agent-generation targets (managed by the SuperBob extension; do not edit by hand)\n\n' +
      'When you generate agent artifacts with rulesync in this workspace, generate for these targets only: ' + labels + '.\n' +
      'Run: `npx rulesync generate --targets "' + ids.join(',') + '" --features "*"`\n' +
      'Do not add other targets unless the user asks.\n');
  } catch (e) {}
}
function removeTargetsRule() { try { fs.rmSync(TARGETS_RULE_FILE(), { force: true }); } catch (e) {} }

// ---- agents: a kit installs SUBAGENTS the SuperBob mode can delegate to ------
// Definitions ship at ~/.bob/agents/<name>.md. On kit load we write each active
// agent as a SUBAGENT file (name/description/model + role) into ~/.claude/agents/,
// which Bob reads as a delegatable subagent (confirmed: Bob's subagent config
// locations include .claude/agents) and Claude Code reads too. Agents are NOT
// custom modes: they never appear in Bob's mode selector; the one SuperBob mode
// orchestrates them. Load a kit -> its subagents appear; unload -> they vanish.
const BOB_AGENTS = path.join(HOME, '.bob', 'agents');                          // bundled agent defs (installed)
const BOB_MODES = path.join(HOME, '.bob', 'settings', 'custom_modes.yaml');    // Bob's shared modes file (only ever CLEANED, never written to)
const CLAUDE_AGENTS = path.join(HOME, '.claude', 'agents');                    // subagent dir Bob + Claude both read
const AGENTS_FILE = () => path.join(BOB_PROFILES, '_agents.json');
const AGENTS_MANIFEST = () => path.join(HOME, '.bob', '.superbob-agents.json');
// Legacy markers: earlier builds wrongly spliced agents into custom_modes.yaml as
// modes. We keep the markers only to STRIP that pollution from existing installs.
const LEGACY_AGENT_BEGIN = '# >>> superbob-managed agents (do not edit by hand)';
const LEGACY_AGENT_END = '# <<< superbob-managed agents';
function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function readAgentsMap() { try { return JSON.parse(fs.readFileSync(AGENTS_FILE(), 'utf8')); } catch (e) { return {}; } }
function readAgentDef(name) {
  try {
    const raw = fs.readFileSync(path.join(BOB_AGENTS, name + '.md'), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    const fm = m ? m[1] : ''; const body = (m ? m[2] : raw).trim();
    const get = k => { const r = fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')); return r ? r[1].trim() : ''; };
    return { name: get('name') || name, description: get('description'), whenToUse: get('whenToUse'), body };
  } catch (e) { return null; }
}
function kitAgents(kit) { return (readAgentsMap()[kit] || []).map(readAgentDef).filter(Boolean); }
function kitAgentsMap() { const all = readAgentsMap(); const out = {}; for (const k of Object.keys(all)) out[k] = kitAgents(k).map(a => ({ name: a.name, description: a.description })); return out; }
function activeAgents() {
  const seen = new Set(); const out = [];
  for (const k of activeKitNames()) for (const a of kitAgents(k)) if (!seen.has(a.name)) { seen.add(a.name); out.push(a); }
  return out;
}
function toSubagent(a) {
  // A subagent file: description drives when the orchestrator delegates to it.
  const desc = (a.description || '') + (a.whenToUse ? ' ' + a.whenToUse : '');
  return '---\nname: ' + a.name + '\ndescription: ' + JSON.stringify(desc.replace(/\s+/g, ' ').trim()) + '\nmodel: inherit\n---\n' + a.body + '\n';
}
function readAgentsManifest() { try { return JSON.parse(fs.readFileSync(AGENTS_MANIFEST(), 'utf8')); } catch (e) { return { subagents: [] }; } }
function removeSubagentFiles() {
  try { const m = readAgentsManifest(); for (const f of [].concat(m.subagents || [], m.claude || [])) fs.rmSync(path.join(CLAUDE_AGENTS, f), { force: true }); } catch (e) {}
}
// One-time healing: strip any agent block(s) an earlier build wrote into the shared
// custom_modes.yaml, so agents stop showing up as modes. Leaves every real mode
// (superbob, winning-products, the user's own) exactly as it was.
function cleanupLegacyAgentModes() {
  try {
    if (!fs.existsSync(BOB_MODES)) return;
    const text = fs.readFileSync(BOB_MODES, 'utf8');
    if (text.indexOf(LEGACY_AGENT_BEGIN) < 0) return;
    const re = new RegExp('\\n?[ \\t]*' + escRe(LEGACY_AGENT_BEGIN) + '[\\s\\S]*?' + escRe(LEGACY_AGENT_END) + '\\n?', 'g');
    fs.writeFileSync(BOB_MODES, text.replace(re, '\n').replace(/\n{3,}/g, '\n\n').replace(/\n*$/, '\n'));
  } catch (e) {}
}
// Refresh the managed subagents to match the loaded kits (idempotent).
function writeAgents() {
  try {
    cleanupLegacyAgentModes();      // heal any old mode pollution first
    removeSubagentFiles();          // drop previously-placed subagents
    const agents = activeAgents();
    const manifest = { subagents: [] };
    if (agents.length) {
      fs.mkdirSync(CLAUDE_AGENTS, { recursive: true });
      for (const a of agents) { fs.writeFileSync(path.join(CLAUDE_AGENTS, a.name + '.md'), toSubagent(a)); manifest.subagents.push(a.name + '.md'); }
    }
    fs.writeFileSync(AGENTS_MANIFEST(), JSON.stringify(manifest, null, 2) + '\n');
  } catch (e) {}
}
function removeAgents() {
  try {
    cleanupLegacyAgentModes();
    removeSubagentFiles();
    fs.rmSync(AGENTS_MANIFEST(), { force: true });
  } catch (e) {}
}

// Lean mode: only these two skills stay loaded; mission-control routes to the rest
// from the vault on demand. Keeps starting context tiny (~200 tokens vs ~67,000).
const CORE = ['using-superpowers', 'mission-control']; // superpowers first, always check for a skill before acting
// Every shipped kit is a built-in "starter kit" (not deletable). "Your kits" is left for
// the user's own creations, seeded with a couple of clearly-labelled sample kits.
const BUILTIN = ['software-development', 'data-analysis', 'product-management', 'production-engineering', 'test-engineering', 'application-security', 'frontend-design', 'web-research', 'release-review', 'bug-fixing', 'code-simplification', 'rag-evaluation', 'content-writing', 'wiki', 'product-frameworks', 'pm-methodology', 'agentic-authoring'];

// Optional always-on add-ons: skills that layer on EVERY kit (like CORE) but can be toggled.
// Unlike CORE (mandatory), these are preferences the user turns on/off. They persist across
// kit switches and are removed when SuperBob is off. Enabled set lives in ~/.bob/.superbob-addons.
const ADDONS = [{
  name: 'i-have-adhd',
  title: 'ADHD mode (concise output)',
  desc: "Concise, action-first replies. Off = verbose."
}];
const ADDON_FILE = () => path.join(HOME, '.bob', '.superbob-addons');
function readAddons() { try { return new Set(fs.readFileSync(ADDON_FILE(), 'utf8').split('\n').map(s => s.trim()).filter(Boolean)); } catch (e) { return new Set(); } }
function writeAddons(set) { try { fs.writeFileSync(ADDON_FILE(), [...set].join('\n') + '\n'); } catch (e) {} }
function enabledAddons() { const en = readAddons(); return ADDONS.filter(a => en.has(a.name) && fs.existsSync(path.join(BOB_VAULT, a.name))).map(a => a.name); }
function addonStates() { const en = readAddons(); return ADDONS.filter(a => fs.existsSync(path.join(BOB_VAULT, a.name))).map(a => ({ name: a.name, title: a.title, desc: a.desc, on: en.has(a.name) })); }

let statusItem;
let panel;

function log(msg) { console.log('[super-bob-skills] ' + msg); }

function unzip(zipPath, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  cp.execFileSync('unzip', ['-o', '-q', zipPath, '-d', destDir], { stdio: 'ignore' });
}
function copyDir(src, dest) { fs.mkdirSync(dest, { recursive: true }); fs.cpSync(src, dest, { recursive: true }); }
function backupIfPresent(dir) {
  if (fs.existsSync(dir) && fs.readdirSync(dir).length > 0) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const bk = dir + '-backup-' + stamp; fs.cpSync(dir, bk, { recursive: true }); return bk;
  }
  return null;
}
function readList(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
}
function profileNames() {
  if (!fs.existsSync(BOB_PROFILES)) return [];
  return fs.readdirSync(BOB_PROFILES).filter(f => f.endsWith('.txt') && f !== '_core.txt').map(f => f.replace(/\.txt$/, ''));
}

// ---- skill/token inventory -------------------------------------------------
function frontmatterTokens(skillDir) {
  try {
    const t = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
    const m = t.match(/^---\s*\n([\s\S]*?)\n---/);
    const fm = m ? m[1] : t.slice(0, 400);
    const desc = (fm.match(/description:\s*([\s\S]*?)(?:\n\w+:|$)/) || [, ''])[1];
    return { desc: desc.replace(/^[>|]\s*/, '').replace(/^["']|["']$/g, '').replace(/\s+/g, ' ').trim().slice(0, 160), tokens: Math.ceil(fm.length / 4) };
  } catch (e) { return { desc: '', tokens: 60 }; }
}
// The vault holds ~1500+ skills. Reading every SKILL.md on each state refresh blocks the
// extension host long enough that Bob can flag it unresponsive and restart it, and that teardown
// trips a SQLite-on-cleanup crash in Bob itself. So cache the per-skill frontmatter (the only
// part that touches disk) and only rebuild it when the vault actually changes (on install).
let _skillMetaCache = null;
function invalidateVaultCache() { _skillMetaCache = null; }
function skillMetaMap() {
  if (_skillMetaCache) return _skillMetaCache;
  const m = {};
  if (fs.existsSync(BOB_VAULT)) {
    for (const name of fs.readdirSync(BOB_VAULT)) {
      if (name.startsWith('.')) continue;
      const dir = path.join(BOB_VAULT, name);
      if (!fs.existsSync(path.join(dir, 'SKILL.md'))) continue;
      m[name] = frontmatterTokens(dir);   // the only disk read, now done once and cached
    }
  }
  _skillMetaCache = m;
  return m;
}
function listVaultSkills() {
  const meta = skillMetaMap();   // cached
  const profs = {};
  for (const p of profileNames()) profs[p] = new Set(readList(path.join(BOB_PROFILES, p + '.txt')));   // cheap: a few small .txt files
  return Object.keys(meta).sort().map(name => ({
    name, desc: meta[name].desc, tokens: meta[name].tokens,
    inProfiles: Object.keys(profs).filter(p => profs[p].has(name)), core: CORE.includes(name)
  }));
}
function activeSkillSet() {
  if (!fs.existsSync(BOB_ACTIVE)) return [];
  return fs.readdirSync(BOB_ACTIVE).filter(n => !n.startsWith('.') && fs.existsSync(path.join(BOB_ACTIVE, n, 'SKILL.md')));
}
function activeProfile() {
  const f = path.join(BOB_ACTIVE, '.profile');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim() : null;
}

// ---- ownership boundary ----------------------------------------------------
// SuperBob owns ONLY the skills it itself placed in the active dir. It records them in a
// manifest (~/.bob/skills/.superbob-managed) written on every apply. Ownership is NOT decided
// by name-match with the vault: a user's own skill (say their own `docx`) that happens to
// share a name with a vault skill must never be treated as SuperBob's, shown as loaded, or
// removed on a switch. Anything in the active dir that is NOT in the manifest is the user's own.
const MANAGED_FILE = () => path.join(BOB_ACTIVE, '.superbob-managed');
function managedSet() {
  try { return new Set(fs.readFileSync(MANAGED_FILE(), 'utf8').split('\n').map(s => s.trim()).filter(Boolean)); }
  catch (e) { return new Set(CORE); }   // no manifest yet: treat only the core as ours
}
function writeManaged(names) { try { fs.writeFileSync(MANAGED_FILE(), [...names].join('\n') + '\n'); } catch (e) {} }
function externalActiveSkills() { const m = managedSet(); return activeSkillSet().filter(n => !m.has(n)); }

// ---- power (SuperBob on/off) -----------------------------------------------
// Off = remove every SuperBob-owned skill from the active dir (including the two
// core skills), leaving only the user's own skills, Bob then runs normally. The
// user's own skills are never touched. On = restore lean (core only).
function isPoweredOff() { return activeProfile() === 'off'; }
function superbobOff() {
  if (fs.existsSync(BOB_ACTIVE)) {
    const managed = managedSet();
    for (const name of activeSkillSet()) {
      if (managed.has(name)) fs.rmSync(path.join(BOB_ACTIVE, name), { recursive: true, force: true });
    }
  } else { fs.mkdirSync(BOB_ACTIVE, { recursive: true }); }
  writeManaged([]);   // SuperBob manages nothing while off
  removeAutoRule();   // stop auto-routing: Bob behaves normally when off
  removeTargetsRule();   // and stop steering rulesync targets
  removeAgents();   // and remove any installed agents (managed block + Claude files)
  fs.writeFileSync(path.join(BOB_ACTIVE, '.profile'), 'off');
  updateStatus();
  return true;
}

// ---- apply / save / delete -------------------------------------------------
function applySkillSet(skillNames, label) {
  if (!fs.existsSync(BOB_VAULT)) { vscode.window.showErrorMessage('SuperBob: not installed yet.'); return false; }
  const wanted = new Set(CORE);
  for (const a of enabledAddons()) wanted.add(a);   // toggled always-on add-ons layer on every kit
  for (const n of skillNames) wanted.add(n);
  const staged = [...wanted].filter(s => fs.existsSync(path.join(BOB_VAULT, s)));
  if (staged.length < CORE.length) { vscode.window.showErrorMessage('SuperBob: nothing to load, aborted.'); return false; }
  fs.mkdirSync(BOB_ACTIVE, { recursive: true });
  const managed = managedSet();
  // Remove ONLY skills SuperBob itself placed that the new set no longer wants. The user's
  // own skills (not in the manifest) are left exactly as they are, even if a name collides.
  for (const name of activeSkillSet()) {
    if (managed.has(name) && !wanted.has(name)) fs.rmSync(path.join(BOB_ACTIVE, name), { recursive: true, force: true });
  }
  // Add or refresh the wanted skills from the vault (refresh picks up vault updates).
  for (const s of staged) {
    const dest = path.join(BOB_ACTIVE, s);
    fs.rmSync(dest, { recursive: true, force: true });
    copyDir(path.join(BOB_VAULT, s), dest);
  }
  fs.writeFileSync(path.join(BOB_ACTIVE, '.profile'), label);
  writeManaged(staged);   // the manifest is exactly what SuperBob just placed
  writeAutoRule();        // SuperBob is on → make routing automatic (no /superbob needed)
  writeTargetsRule();     // refresh the agent-generation targets rule for the loaded kits
  writeAgents();          // install/refresh the loaded kits' agents as Bob modes + Claude subagents
  const kept = externalActiveSkills().length;
  if (kept) vscode.window.setStatusBarMessage('SuperBob kept ' + kept + ' of your own skill(s) untouched', 4000);
  updateStatus();
  return true;
}
function applyProfile(names) {
  const skills = [];
  for (const n of names) readList(path.join(BOB_PROFILES, n + '.txt')).forEach(s => skills.push(s));
  return applySkillSet(skills, names.length ? 'core + ' + names.join(' ') : 'lean (core only)');
}
const META = () => path.join(BOB_PROFILES, '_meta.json');
function readMeta() { try { return JSON.parse(fs.readFileSync(META(), 'utf8')); } catch (e) { return {}; } }
const PROV = () => path.join(BOB_PROFILES, '_provenance.json');
function readProvenance() { try { return JSON.parse(fs.readFileSync(PROV(), 'utf8')); } catch (e) { return {}; } }

// ---- per-kit prerequisites (data-driven) ----------------------------------
// A kit can require a Bob plugin/tool before it can be enabled. Config lives in
// ~/.bob/profiles/_prereqs.json: { "<kit>": { label, check } }. Detectors below resolve `check`.
const PREREQ_FILE = () => path.join(BOB_PROFILES, '_prereqs.json');
function readPrereqs() { try { return JSON.parse(fs.readFileSync(PREREQ_FILE(), 'utf8')); } catch (e) { return {}; } }
const PREREQ_DETECTORS = {
  propel: () => fs.existsSync(path.join(HOME, '.bob', 'propel')) || fs.existsSync(path.join(HOME, '.bob', '.propel-analytics.json'))
};
function prereqMet(kit) {
  const p = readPrereqs()[kit];
  if (!p) return true;
  const det = PREREQ_DETECTORS[p.check];
  return det ? det() : true;   // unknown detector → don't block
}
function kitPrereqStates() {
  const out = {}; const all = readPrereqs();
  for (const k of Object.keys(all)) out[k] = { label: all[k].label || 'a required plugin', met: prereqMet(k) };
  return out;
}

// ---- per-skill resources (data-driven, Propel-style) ----------------------
// A skill can declare resources it needs: a tool/CLI, an MCP connection, or a
// script. Config lives in ~/.bob/profiles/_resources.json:
//   { "<skill>": [ { id, type, label, check, setup } ] }
// Unlike prereqs (which hard-block a kit), resources are informational: the kit
// still loads, but the card and guide show "requires setup" until satisfied.
// This mirrors Propel's convention (a skill declares what it needs; the user
// sets it up; nothing runs on its own).
const RESOURCE_FILE = () => path.join(BOB_PROFILES, '_resources.json');
function readResources() { try { return JSON.parse(fs.readFileSync(RESOURCE_FILE(), 'utf8')); } catch (e) { return {}; } }
let _resDetectorCache = {};
function invalidateResourceCache() { _resDetectorCache = {}; }
const RESOURCE_DETECTORS = {
  node: () => cliInstalled('node'),
  npx: () => cliInstalled('npx'),
  propel: PREREQ_DETECTORS.propel
};
function resourceMet(check) {
  if (!check) return true;
  if (check.indexOf('conn:') === 0) {   // a saved connection (never cached: changes on save)
    const c = readConnections()[check.slice(5)];
    return !!(c && Object.keys(c).some(k => k !== 'savedAt' && c[k]));
  }
  if (check in _resDetectorCache) return _resDetectorCache[check];
  const det = RESOURCE_DETECTORS[check];
  const met = det ? !!det() : true;   // unknown detector → assume met (don't nag)
  _resDetectorCache[check] = met; return met;
}
function kitResources(kit) {
  const res = readResources(); const items = []; const seen = new Set();
  for (const skill of readList(path.join(BOB_PROFILES, kit + '.txt'))) {
    for (const r of (res[skill] || [])) {
      if (seen.has(r.id)) continue; seen.add(r.id);
      items.push({ id: r.id, type: r.type || 'tool', label: r.label || r.id, setup: r.setup || '', met: resourceMet(r.check), skill, extId: r.extId || '', open: r.open || '', tool: r.tool || '', config: r.config || null });
    }
  }
  return items;
}
function kitResourceStates() {
  const out = {};
  for (const kit of profileNames()) { const items = kitResources(kit); if (items.length) out[kit] = { items, needsSetup: items.some(i => !i.met) }; }
  return out;
}

// ---- actionable setup (Propel-style: act in place, inside Bob) --------------
// Unifies prereqs (kit-level, hard gate) + resources (skill-level, soft) into one
// list of setup items, each with an action the user can run from the guide:
//   install-extension | open (deep-link) | install-tool | save-connection | recheck
// Everything happens inside Bob; credentials are only ever typed by the user.
const CONNECTIONS_FILE = () => path.join(HOME, '.bob', '.superbob-connections.json');
function readConnections() { try { return JSON.parse(fs.readFileSync(CONNECTIONS_FILE(), 'utf8')); } catch (e) { return {}; } }
function saveConnection(id, values) {
  const all = readConnections();
  all[id] = Object.assign({}, all[id], values, { savedAt: true });
  try { fs.mkdirSync(path.dirname(CONNECTIONS_FILE()), { recursive: true }); fs.writeFileSync(CONNECTIONS_FILE(), JSON.stringify(all, null, 2) + '\n'); } catch (e) {}
}
// Derive the actionable control from a declaration (prereq or resource).
function actionFor(spec) {
  if (spec.extId) return { verb: 'install-extension', extId: spec.extId, open: spec.open || '' };
  if (spec.open) return { verb: 'open', command: spec.open };
  if (spec.tool) return { verb: 'install-tool', tool: spec.tool };
  if (spec.config) return { verb: 'save-connection', fields: spec.config };
  return { verb: 'recheck' };
}
function kitSetupStates() {
  const out = {}; const prereqs = readPrereqs();
  for (const kit of profileNames()) {
    const items = [];
    const p = prereqs[kit];
    if (p) items.push({ id: 'prereq:' + (p.check || kit), kind: p.kind || 'plugin', label: p.label || 'a required plugin', setup: p.setup || '', met: prereqMet(kit), action: actionFor(p), hard: true });
    for (const r of kitResources(kit)) items.push({ id: 'res:' + r.id, kind: r.type === 'connection' ? 'connection' : 'tool', label: r.label + (r.skill ? ' (for ' + r.skill + ')' : ''), setup: r.setup || '', met: r.met, action: actionFor(r), hard: false });
    if (items.length) out[kit] = { items, needsSetup: items.some(i => !i.met) };
  }
  return out;
}
function writeMeta(m) { try { fs.writeFileSync(META(), JSON.stringify(m, null, 2)); } catch (e) {} }

function saveCustomProfile(name, skills, desc) {
  const clean = name.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');  // kebab-case, matches the built-in kits and the skills
  if (!clean) return null;
  fs.mkdirSync(BOB_PROFILES, { recursive: true });
  const body = skills.filter(s => !CORE.includes(s)).join('\n') + '\n';
  fs.writeFileSync(path.join(BOB_PROFILES, clean + '.txt'), body);
  if (desc && desc.trim()) { const m = readMeta(); m[clean] = desc.trim(); writeMeta(m); }
  return clean;
}
// Save a custom kit WITH its reference/augmentation info: the profile + meta (what Auto mode reads
// to pick it) + an authored "How to use" guide (tagline/when/example/tips), first-class, not an
// afterthought. The tagline and when-to-use are what let SuperBob route to this kit correctly.
function saveCustomKit(name, skills, desc, when, example, tips) {
  const clean = saveCustomProfile(name, skills, desc);   // writes profile + meta[name]=desc
  if (!clean) return null;
  const ex = (example || []).map(s => (s + '').trim()).filter(Boolean);
  const tp = (tips || []).map(s => (s + '').trim()).filter(Boolean);
  const w = (when || '').trim();
  if (desc || w || ex.length || tp.length) {
    try {
      const gp = path.join(BOB_PROFILES, '_guides.json');
      let g = {}; try { g = JSON.parse(fs.readFileSync(gp, 'utf8')); } catch (e) {}
      g[clean] = { tagline: (desc || '').trim(), when: w, example: ex, tips: tp };
      fs.writeFileSync(gp, JSON.stringify(g, null, 2) + '\n');
    } catch (e) {}
  }
  return clean;
}
function deleteCustomProfile(name) {
  if (BUILTIN.includes(name)) return false;   // never delete built-ins
  const f = path.join(BOB_PROFILES, name + '.txt');
  const m = readMeta(); if (m[name]) { delete m[name]; writeMeta(m); }
  if (fs.existsSync(f)) { fs.unlinkSync(f); return true; }
  return false;
}

// ---- optional external tools (opt-in, install + network) -------------------
// Some skills wrap a real CLI that must be installed and calls out to the network.
// They are NOT part of the lean/egress-free kits. They live here as opt-in toggles:
// turning one ON installs the CLI (through Bob's login shell, so it uses Bob's env)
// and activates the skill; OFF deactivates it. The skill is activated as a user-owned
// skill (never written to the managed manifest), so kit switches never touch it.
// No optional external tools. (OpenWiki was removed: on an IBM-gateway Bob the shell
// carries no model credential, so a third-party CLI has nothing to authenticate with.
// Use Bob's own model-backed wiki skills, codebase-onboarding / wiki, instead.)
const OPTIONAL_TOOLS = [];
function toolByName(n) { return OPTIONAL_TOOLS.find(t => t.name === n); }
// Run through a login shell so we pick up Bob's / the user's real PATH and env
// (GUI-launched apps otherwise miss node/npm and shell exports).
function loginShell(cmd) { return '/bin/zsh -lc ' + JSON.stringify(cmd); }
function cliInstalled(bin) { try { cp.execSync(loginShell('command -v ' + bin), { stdio: 'ignore' }); return true; } catch (e) { return false; } }
function toolActive(name) { return fs.existsSync(path.join(BOB_ACTIVE, name, 'SKILL.md')); }
function bobEnvHasKey(vars) {
  const files = [path.join(HOME, '.bob', '.env')];
  const blob = files.map(f => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } }).join('\n');
  return vars.some(v => process.env[v] || new RegExp('^' + v + '=', 'm').test(blob));
}
function toolState(t) { return { name: t.name, title: t.title, desc: t.desc, pkg: t.pkg, installed: cliInstalled(t.bin), active: toolActive(t.name), hasKey: bobEnvHasKey(t.keyVars) }; }
function activateTool(name) {
  const src = path.join(BOB_VAULT, name);
  if (!fs.existsSync(src)) return false;
  const dest = path.join(BOB_ACTIVE, name);
  fs.rmSync(dest, { recursive: true, force: true });
  copyDir(src, dest);   // NOT added to the managed manifest → treated as the user's own skill, preserved across kit switches
  return true;
}
function deactivateTool(name) { fs.rmSync(path.join(BOB_ACTIVE, name), { recursive: true, force: true }); return true; }
function execAsync(cmd) { return new Promise(res => cp.exec(cmd, { maxBuffer: 1024 * 1024 * 16 }, (err, so, se) => res({ err, stdout: so, stderr: se }))); }
async function installTool(t) {
  return await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: 'Installing ' + t.title + ' (' + t.pkg + ')…', cancellable: false },
    async () => { const r = await execAsync(loginShell('npm install -g ' + t.pkg)); return r.err ? { ok: false, err: ((r.stderr || r.err.message || '') + '').slice(-400) } : { ok: true }; }
  );
}

// Run one actionable setup step, all inside Bob. Each is user-initiated (a click).
async function runSetupAction(m) {
  try {
    if (m.verb === 'install-extension' && m.extId) {
      try {
        await vscode.commands.executeCommand('workbench.extensions.installExtension', m.extId);
        vscode.window.showInformationMessage('Installing ' + m.extId + ' in Bob. When it finishes, click Recheck.');
      } catch (e) {
        try { await vscode.commands.executeCommand('workbench.extensions.search', m.extId); } catch (_) {}
        vscode.window.showWarningMessage('Opened the Extensions view for ' + m.extId + '. Install it there, then click Recheck.');
      }
    } else if (m.verb === 'open' && m.command) {
      try { await vscode.commands.executeCommand(m.command); }
      catch (e) { vscode.window.showWarningMessage('Could not open "' + m.command + '". Make sure the plugin is installed, then retry.'); }
    } else if (m.verb === 'install-tool' && m.tool) {
      const t = toolByName(m.tool);
      if (t && !cliInstalled(t.bin)) {
        const r = await installTool(t);
        if (!r.ok) vscode.window.showErrorMessage(t.title + ": couldn't install " + t.pkg + (r.err ? ('  ·  ' + r.err) : ''));
        else vscode.window.showInformationMessage(t.title + ' installed.');
      } else if (t) { vscode.window.showInformationMessage(t.title + ' is already installed.'); }
    }
    // 'recheck' and every other verb fall through to the cache-invalidate the caller does.
  } catch (e) {}
}

function updateStatus() {
  if (!statusItem) return;
  const p = activeProfile();
  statusItem.text = '$(rocket) SuperBob: ' + (p || 'not installed');
  statusItem.show();
  postState();
}

// ---- the control panel (webview) ------------------------------------------
// Two surfaces share one webview UI: the sidebar view (activity bar) and an
// optional editor-tab panel. Both get the same HTML and the same messages.
const webviews = new Set();
function stateMessage() {
  const profs = {};
  for (const p of profileNames()) profs[p] = readList(path.join(BOB_PROFILES, p + '.txt'));
  return {
    type: 'state',
    installed: fs.existsSync(BOB_VAULT),
    active: activeProfile(),
    activeSet: activeSkillSet(),
    external: externalActiveSkills(),
    poweredOff: isPoweredOff(),
    core: CORE,
    builtin: BUILTIN,
    profiles: profs,
    meta: readMeta(),
    skills: listVaultSkills(),
    tools: OPTIONAL_TOOLS.map(toolState),
    scope: readScope(),
    addons: addonStates(),
    provenance: readProvenance(),
    prereqs: kitPrereqStates(),
    resources: kitResourceStates(),
    setup: kitSetupStates(),
    agentsByKit: kitAgentsMap(),
    auto: readAuto()
  };
}
function postState() { const msg = stateMessage(); webviews.forEach(w => { try { w.postMessage(msg); } catch (e) {} }); }

async function handleMessage(m, context) {
  if (m.type === 'ready') { postState(); return; }
  if (m.type === 'applyProfile') {
    const names = Array.isArray(m.names) ? m.names : [m.name];   // one or several kits (stacked)
    const blocked = names.find(n => !prereqMet(n));   // gate: any kit that needs a missing plugin
    if (blocked) {
      const p = readPrereqs()[blocked];
      vscode.window.showWarningMessage('The "' + blocked + '" kit needs ' + (p && p.label || 'a required plugin') + '. Install/enable it in Bob first, then try again.');
      postState(); return;
    }
    if (applyProfile(names)) vscode.window.showInformationMessage(names.length > 1 ? ('Loaded ' + names.length + ' kits (' + names.join(' + ') + '). Start a new conversation.') : ('Loaded "' + names[0] + '" kit. Start a new conversation to apply.'));
    postState(); return;
  }
  if (m.type === 'applyLean') { applyProfile([]); vscode.window.showInformationMessage('Cleared kits. SuperBob picks from all skills. Start a new conversation.'); postState(); return; }
  if (m.type === 'setAuto') {
    writeAuto(m.on);
    if (!isPoweredOff()) writeAutoRule();   // rewrite/remove the routing rule to match
    const kits = activeKitNames();
    vscode.window.showInformationMessage(m.on
      ? ('Auto mode on. SuperBob picks skills per task' + (kits.length ? ', scoped to your ' + kits.length + ' loaded kit' + (kits.length > 1 ? 's' : '') : ' from all skills') + '. Start a new conversation.')
      : 'Auto mode off. SuperBob will not auto-pick; invoke skills yourself. Start a new conversation.');
    postState(); return;
  }
  if (m.type === 'setPower') {
    if (m.on) { applyProfile([]); vscode.window.showInformationMessage('SuperBob on. Auto mode. Start a new conversation.'); }
    else { superbobOff(); vscode.window.showInformationMessage('SuperBob off. Bob runs normally, your own skills kept. Start a new conversation.'); }
    postState(); return;
  }
  if (m.type === 'applyCustom') {
    if (applySkillSet(m.skills, 'custom (' + m.skills.length + ' skills)')) vscode.window.showInformationMessage('Custom set applied. Start a new conversation.');
    postState(); return;
  }
  if (m.type === 'saveMode') {
    const saved = saveCustomKit(m.name, m.skills, m.desc, m.when, m.example, m.tips);
    if (saved) { vscode.window.showInformationMessage('Saved kit "' + saved + '". It\'s under Your kits with a How-to-use page.'); if (builderPanel) builderPanel.dispose(); }
    else vscode.window.showErrorMessage('Give the kit a valid lowercase name.');
    postState(); return;
  }
  if (m.type === 'openBuilder') { openBuilderPanel(context); return; }
  if (m.type === 'closeBuilder') { if (builderPanel) builderPanel.dispose(); return; }
  if (m.type === 'deleteMode') { deleteCustomProfile(m.name); postState(); return; }
  if (m.type === 'openGuide') { openGuidePanel(m.kit, context); return; }
  if (m.type === 'setupAction') {
    await runSetupAction(m);
    invalidateResourceCache();
    if (guidePanel && m.kit) guidePanel.webview.html = guideHtml(guideFor(m.kit));   // reflect new setup state
    postState(); return;
  }
  if (m.type === 'saveConnection') {
    saveConnection(m.id, m.values || {});
    vscode.window.showInformationMessage('Saved. Rechecking…');
    if (guidePanel && m.kit) guidePanel.webview.html = guideHtml(guideFor(m.kit));
    postState(); return;
  }
  if (m.type === 'setKitTarget') {
    const arr = setKitTarget(m.kit, m.target, m.on);
    if (!isPoweredOff()) writeTargetsRule();   // refresh the live rule if the kit is loaded
    if (guidePanel) guidePanel.webview.html = guideHtml(guideFor(m.kit));   // reflect the new state
    const active = activeKitNames().includes(m.kit);
    vscode.window.showInformationMessage('Agent generation set to: ' + arr.join(', ') + (active ? '. Applies now.' : '. Load the ' + m.kit + ' kit to apply.'));
    postState(); return;
  }
  if (m.type === 'setAddon') {
    const a = ADDONS.find(x => x.name === m.name); if (!a) { postState(); return; }
    const en = readAddons(); if (m.on) en.add(a.name); else en.delete(a.name); writeAddons(en);
    // reflect immediately in the active dir + manifest (unless SuperBob is off)
    if (!isPoweredOff()) {
      const managed = managedSet();
      const dest = path.join(BOB_ACTIVE, a.name);
      if (m.on && fs.existsSync(path.join(BOB_VAULT, a.name))) { fs.rmSync(dest, { recursive: true, force: true }); copyDir(path.join(BOB_VAULT, a.name), dest); managed.add(a.name); }
      else if (!m.on) { fs.rmSync(dest, { recursive: true, force: true }); managed.delete(a.name); }
      writeManaged([...managed]);
      writeAutoRule();   // refresh the rule so Bob honors (or stops honoring) the add-on
    }
    vscode.window.showInformationMessage(a.title + (m.on ? ' on' : ' off') + '. Start a new conversation to apply.');
    postState(); return;
  }
  if (m.type === 'install') { await doInstall(context); postState(); return; }
  if (m.type === 'toolToggle') {
    const t = toolByName(m.tool); if (!t) { postState(); return; }
    if (m.on) {
      // 1) Install the CLI (with explicit consent) if it isn't already present.
      if (!cliInstalled(t.bin)) {
        const choice = await vscode.window.showWarningMessage(
          t.title + ' needs to install its command-line tool (`npm install -g ' + t.pkg + '`). This downloads from the network and runs inside Bob using Bob\'s environment. Install it now?',
          { modal: true, detail: 'Nothing is installed until you confirm. You can disable ' + t.title + ' any time.' },
          'Install'
        );
        if (choice !== 'Install') { postState(); return; }   // cancelled → stay off, UI reverts via postState
        const r = await installTool(t);
        if (!r.ok) {
          vscode.window.showErrorMessage(t.title + ": couldn't install " + t.pkg + ". Run it yourself in Bob's terminal: npm install -g " + t.pkg + (r.err ? ('  ·  ' + r.err) : ''));
          postState(); return;
        }
      }
      // 2) Activate the skill, then report clearly.
      activateTool(t.name);
      const st = toolState(t);
      if (!st.hasKey && t.keyVars && t.keyVars.length) {
        vscode.window.showWarningMessage(t.title + ' is installed and on, but no model key is set in Bob\'s environment. Add one to ~/.bob/.env, then start a new conversation.');
      } else {
        vscode.window.showInformationMessage(t.title + ' installed and enabled. Start a new conversation to use it.');
      }
    } else {
      deactivateTool(t.name);
      vscode.window.showInformationMessage(t.title + ' disabled.');
    }
    postState(); return;
  }
  if (m.type === 'setScope') {
    writeScope(m.scope);
    if (!isPoweredOff()) writeAutoRule();   // rewrite the live rule to match the new scope
    vscode.window.showInformationMessage(readScope() === 'superbob-only'
      ? 'SuperBob will route only its own skills and leave your own skills alone. Start a new conversation.'
      : 'SuperBob will route all skills, yours and its own. Start a new conversation.');
    postState(); return;
  }
  if (m.type === 'openDocs') {
    try { await vscode.commands.executeCommand('extension.open', 'felipe-campo.super-bob-skills'); }
    catch (e) { vscode.commands.executeCommand('workbench.extensions.search', 'SuperBob'); }
    return;
  }
}

// Sidebar view in the activity bar (the leftmost strip).
class SuperBobViewProvider {
  constructor(context) { this.context = context; }
  resolveWebviewView(view) {
    view.webview.options = { enableScripts: true };
    view.webview.html = getWebviewHtml();
    webviews.add(view.webview);
    view.webview.onDidReceiveMessage(m => handleMessage(m, this.context));
    view.onDidDispose(() => webviews.delete(view.webview));
  }
}

// Optional: also open the panel as a full editor tab.
function openPanel(context) {
  if (panel) { panel.reveal(); return; }
  panel = vscode.window.createWebviewPanel('superbob', 'SuperBob Skills', vscode.ViewColumn.One, { enableScripts: true, retainContextWhenHidden: true });
  panel.webview.html = getWebviewHtml();
  webviews.add(panel.webview);
  panel.webview.onDidReceiveMessage(m => handleMessage(m, context));
  panel.onDidDispose(() => { webviews.delete(panel.webview); panel = null; }, null, context.subscriptions);
}

// ---- per-kit "How to use" guide -------------------------------------------
// An authored guide (bob/profiles/_guides.json) explains the synergy; when a kit has none,
// we auto-generate a usable page from its skills + their descriptions. Every kit has a page.
function readGuides() { try { return JSON.parse(fs.readFileSync(path.join(BOB_PROFILES, '_guides.json'), 'utf8')); } catch (e) { return {}; } }
function guideFor(kit) {
  const meta = readMeta(), g = readGuides()[kit] || {}, prov = readProvenance();
  const skills = readList(path.join(BOB_PROFILES, kit + '.txt'))
    .map(s => ({ name: s, desc: frontmatterTokens(path.join(BOB_VAULT, s)).desc, origin: prov[s] || '' }));
  const examples = g.examples || g.example || [];
  const out = {
    kit,
    tagline: g.tagline || meta[kit] || ('Skills for ' + kit.replace(/-/g, ' ') + '.'),
    jtbd: g.jtbd || '',
    description: g.description || '',
    when: g.when || '',
    outline: g.outline || [],
    skills,
    examples,
    tips: g.tips || [],
    authored: !!examples.length
  };
  // agentic-authoring exposes a per-kit setting: which tools rulesync generates for.
  if (kit === 'agentic-authoring') {
    const on = new Set(kitTargets(kit));
    out.targets = RULESYNC_TARGETS.map(t => ({ id: t.id, label: t.label, on: on.has(t.id) }));
  }
  // actionable setup items (prereqs + resources) — resolved in place, inside Bob
  const su = kitSetupStates()[kit];
  if (su) out.setup = su.items;
  // agents this kit installs as Bob modes + Claude subagents
  out.agents = kitAgents(kit).map(a => ({ name: a.name, description: a.description }));
  return out;
}
function esc(s) { return String(s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function guideHtml(g) {
  const skillRows = g.skills.map(s => '<div class="s"><div class="sn">' + esc(s.name) + '</div>' + (s.desc ? '<div class="sd">' + esc(s.desc) + '</div>' : '') + (s.origin ? '<div class="sorc">from ' + esc(s.origin) + '</div>' : '') + '</div>').join('');
  const jtbd = g.jtbd ? '<p class="jtbd"><b>The job:</b> ' + esc(g.jtbd) + '</p>' : '';
  const desc = g.description ? '<p class="desc">' + esc(g.description) + '</p>' : '';
  const when = g.when ? '<p class="when"><b>When to reach for it:</b> ' + esc(g.when) + '</p>' : '';
  const outline = g.outline.length ? '<h2>How it flows</h2><ol class="outline">' + g.outline.map(o => '<li>' + esc(o) + '</li>').join('') + '</ol>' : '';
  const examples = g.examples.length ? '<h2>How to use it</h2><p class="usehint">Load the kit, start a new chat, then say what you need in plain language. It picks the right skills. For example:</p><ol class="uses">' + g.examples.map(e => '<li>' + esc(e) + '</li>').join('') + '</ol>' : '';
  const tips = g.tips.length ? '<h2>Tips</h2><ul>' + g.tips.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>' : '';
  const targets = (g.targets && g.targets.length) ? (
    '<h2>Generate for</h2>' +
    '<p class="usehint">Pick which tools rulesync generates when you author an agent in this kit. Applies while the kit is loaded; the portable AGENTS.md always stays available.</p>' +
    '<div class="targets">' + g.targets.map(t =>
      '<label class="tgt"><input type="checkbox" data-id="' + esc(t.id) + '"' + (t.on ? ' checked' : '') + '/> ' + esc(t.label) + '</label>'
    ).join('') + '</div>'
  ) : '';
  // Actionable setup: prereqs + resources, each resolvable in place (inside Bob).
  const setup = (g.setup && g.setup.length) ? (
    '<h2>Requirements &amp; setup</h2>' +
    '<p class="usehint">Set these up here, inside Bob. Nothing installs or runs until you click.</p>' +
    '<div class="setuplist">' + g.setup.map(it => {
      const a = it.action || { verb: 'recheck' }; const K = esc(g.kit), ID = esc(it.id);
      let ctrl = '';
      if (!it.met) {
        if (a.verb === 'install-extension') ctrl += '<button class="setupbtn" data-verb="install-extension" data-ext="' + esc(a.extId) + '" data-kit="' + K + '" data-id="' + ID + '">Install</button>';
        if (a.open || a.verb === 'open') ctrl += '<button class="setupbtn" data-verb="open" data-cmd="' + esc(a.command || a.open) + '" data-kit="' + K + '" data-id="' + ID + '">Open setup</button>';
        if (a.verb === 'install-tool') ctrl += '<button class="setupbtn" data-verb="install-tool" data-tool="' + esc(a.tool) + '" data-kit="' + K + '" data-id="' + ID + '">Install</button>';
        if (a.verb === 'save-connection') {
          const fields = (a.fields || []).map(f => '<label class="cfield"><span>' + esc(f.label || f.key) + '</span><input data-key="' + esc(f.key) + '" type="' + (f.secret ? 'password' : 'text') + '" placeholder="' + esc(f.placeholder || '') + '"/></label>').join('');
          ctrl += '<div class="cform">' + fields + '<button class="setupbtn" data-verb="save-connection" data-kit="' + K + '" data-id="' + ID + '">Save and connect</button></div>';
        }
        ctrl += '<button class="setupbtn ghost" data-verb="recheck" data-kit="' + K + '" data-id="' + ID + '">Recheck</button>';
      }
      return '<div class="setupitem ' + (it.met ? 'ok' : 'need') + '"><div class="simark">' + (it.met ? '&#10003;' : '!') + '</div>' +
        '<div class="sibody"><div class="silabel">' + esc(it.label) + (it.met ? ' <span class="siok">ready</span>' : ' <span class="sineed">needs setup</span>') + '</div>' +
        (it.setup ? '<div class="sisetup">' + esc(it.setup) + '</div>' : '') + (ctrl ? '<div class="siactions">' + ctrl + '</div>' : '') + '</div></div>';
    }).join('') + '</div>'
  ) : '';
  const agents = (g.agents && g.agents.length) ? (
    '<h2>Agents this kit installs</h2>' +
    '<p class="usehint">Loading the kit adds these as subagents (not modes, so your mode picker stays clean). The SuperBob mode can hand a specific subtask to one. Unload the kit to remove them.</p>' +
    g.agents.map(a => '<div class="s"><div class="sn">' + esc(a.name) + '</div>' + (a.description ? '<div class="sd">' + esc(a.description) + '</div>' : '') + '</div>').join('')
  ) : '';
  const uiScript = '<script>(function(){var v=acquireVsCodeApi();' +
    'document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".setupbtn");if(!b)return;' +
    'var verb=b.dataset.verb;var msg={type:(verb==="save-connection"?"saveConnection":"setupAction"),kit:b.dataset.kit,id:b.dataset.id,verb:verb};' +
    'if(b.dataset.ext)msg.extId=b.dataset.ext;if(b.dataset.cmd)msg.command=b.dataset.cmd;if(b.dataset.tool)msg.tool=b.dataset.tool;' +
    'if(verb==="save-connection"){var box=b.closest(".setupitem");var vals={};box.querySelectorAll("input[data-key]").forEach(function(i){vals[i.dataset.key]=i.value;});msg.values=vals;}' +
    'v.postMessage(msg);});' +
    'document.querySelectorAll(".tgt input").forEach(function(cb){cb.addEventListener("change",function(){v.postMessage({type:"setKitTarget",kit:' + JSON.stringify(g.kit) + ',target:cb.dataset.id,on:cb.checked});});});' +
    '})();</script>';
  const note = g.authored ? '' : '<p class="muted auto">Generated from the kit\'s skills. A fuller walkthrough is coming.</p>';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    body{font-family:var(--vscode-font-family);color:var(--vscode-foreground);max-width:720px;margin:0 auto;padding:28px 32px;line-height:1.6;font-size:14px}
    h1{font-size:1.5rem;margin:0 0 4px} .tag{font-size:1.05rem;color:var(--vscode-descriptionForeground);margin:0 0 14px}
    h2{font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--vscode-descriptionForeground);margin:24px 0 10px;border-top:1px solid var(--vscode-widget-border,#333);padding-top:14px}
    .jtbd{background:var(--vscode-editorWidget-background);border-left:3px solid var(--vscode-charts-blue,#3794ff);border-radius:0 6px 6px 0;padding:9px 13px;margin:0 0 12px}
    .desc{margin:0 0 12px} .when{color:var(--vscode-descriptionForeground);margin:0 0 4px}
    .s{padding:8px 0;border-top:1px solid var(--vscode-widget-border,#2a2a2a)} .s:first-child{border-top:0}
    .sn{font-weight:600} .sd{color:var(--vscode-descriptionForeground);font-size:13px;margin-top:2px}
    .sorc{color:var(--vscode-descriptionForeground);font-size:12px;opacity:.8;font-style:italic;margin-top:1px}
    ol,ul{padding-left:22px;margin:0} li{margin:7px 0} .outline li{margin:4px 0}
    .usehint{color:var(--vscode-descriptionForeground);font-size:13px;margin:0 0 10px} .uses li{margin:9px 0}
    .muted{color:var(--vscode-descriptionForeground)} .auto{font-size:12px;font-style:italic;margin-top:6px}
    .foot{margin-top:26px;border-top:1px solid var(--vscode-widget-border,#333);padding-top:12px;color:var(--vscode-descriptionForeground);font-size:13px}
    code{background:var(--vscode-textCodeBlock-background,#222);padding:1px 5px;border-radius:4px}
    .targets{display:flex;flex-direction:column;gap:8px;margin:2px 0} .tgt{display:flex;align-items:center;gap:9px;cursor:pointer} .tgt input{margin:0;cursor:pointer}
    .reqs{display:flex;flex-direction:column;gap:10px} .req{display:flex;gap:10px;align-items:flex-start}
    .rmark{flex:none;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-top:2px}
    .req.ok .rmark{background:var(--vscode-charts-green,#3fb950);color:#04260f} .req.need .rmark{background:var(--vscode-charts-yellow,#d29922);color:#3a2c00}
    .rlabel{font-weight:600} .rfor{font-weight:400;color:var(--vscode-descriptionForeground);font-size:12px}
    .rneed{color:var(--vscode-charts-yellow,#d29922);font-weight:600;font-size:12px} .rsetup{color:var(--vscode-descriptionForeground);font-size:13px;margin-top:2px}
    .setuplist{display:flex;flex-direction:column;gap:14px} .setupitem{display:flex;gap:10px;align-items:flex-start}
    .simark{flex:none;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-top:2px}
    .setupitem.ok .simark{background:var(--vscode-charts-green,#3fb950);color:#04260f} .setupitem.need .simark{background:var(--vscode-charts-yellow,#d29922);color:#3a2c00}
    .sibody{flex:1} .silabel{font-weight:600} .siok{color:var(--vscode-charts-green,#3fb950);font-weight:600;font-size:12px} .sineed{color:var(--vscode-charts-yellow,#d29922);font-weight:600;font-size:12px}
    .sisetup{color:var(--vscode-descriptionForeground);font-size:13px;margin:2px 0 6px} .siactions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:4px}
    .setupbtn{font:inherit;font-size:13px;padding:4px 12px;border-radius:5px;border:0;cursor:pointer;background:var(--vscode-button-background);color:var(--vscode-button-foreground)}
    .setupbtn.ghost{background:transparent;color:var(--vscode-foreground);border:1px solid var(--vscode-widget-border,#444)}
    .cform{display:flex;flex-direction:column;gap:6px;width:100%;margin:2px 0} .cfield{display:flex;flex-direction:column;gap:3px;font-size:12px;color:var(--vscode-descriptionForeground)}
    .cfield input{font:inherit;padding:5px 8px;border-radius:5px;border:1px solid var(--vscode-widget-border,#444);background:var(--vscode-input-background);color:var(--vscode-input-foreground)}
  </style></head><body>
    <h1>${esc(g.kit)} kit</h1>
    <p class="tag">${esc(g.tagline)}</p>
    ${jtbd}${desc}${when}${note}
    ${outline}
    ${setup}
    ${targets}
    ${examples}
    ${tips}
    ${agents}
    <h2>What's inside (${g.skills.length} skills)</h2>${skillRows}
    <div class="foot">Load this kit from the SuperBob panel, or type <code>/superbob ${esc(g.kit)}</code> in chat. Then start a new conversation so the skills come online. The two core skills (using-superpowers and mission-control) are always on.</div>
    ${uiScript}
  </body></html>`;
}
let guidePanel;
function openGuidePanel(kit, context) {
  const g = guideFor(kit);
  if (guidePanel) { guidePanel.title = 'How to use: ' + kit; guidePanel.webview.html = guideHtml(g); guidePanel.reveal(vscode.ViewColumn.Active); return; }
  guidePanel = vscode.window.createWebviewPanel('superbobGuide', 'How to use: ' + kit, vscode.ViewColumn.Active, { enableScripts: true });
  guidePanel.webview.html = guideHtml(g);
  guidePanel.webview.onDidReceiveMessage(m => handleMessage(m, context));
  guidePanel.onDidDispose(() => { guidePanel = null; }, null, context.subscriptions);
}

// ---- kit builder (its own page) -------------------------------------------
let builderPanel;
function openBuilderPanel(context) {
  if (builderPanel) { builderPanel.reveal(vscode.ViewColumn.Active); return; }
  builderPanel = vscode.window.createWebviewPanel('superbobBuilder', 'Create a SuperBob kit', vscode.ViewColumn.Active, { enableScripts: true, retainContextWhenHidden: true });
  builderPanel.webview.html = builderHtml(listVaultSkills());
  builderPanel.webview.onDidReceiveMessage(m => handleMessage(m, context));
  builderPanel.onDidDispose(() => { builderPanel = null; }, null, context.subscriptions);
}
function builderHtml(vault) {
  const nonce = 'sbb' + Date.now();
  const data = JSON.stringify(vault.filter(s => !CORE.includes(s.name)).map(s => ({ n: s.name, d: s.desc, t: s.tokens })));
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';"/>
<style>
  body{font-family:var(--vscode-font-family);color:var(--vscode-foreground);max-width:640px;margin:0 auto;padding:24px 28px;font-size:13px;line-height:1.5}
  h1{font-size:1.35rem;margin:0 0 4px} .muted{color:var(--vscode-descriptionForeground)} .sub{margin:0 0 18px}
  label{display:block;font-weight:600;margin:16px 0 5px} label .muted{font-weight:400;font-size:12px}
  input,textarea{width:100%;box-sizing:border-box;background:var(--vscode-input-background);color:var(--vscode-input-foreground);border:1px solid var(--vscode-input-border,#555);border-radius:6px;padding:7px 9px;font-family:inherit;font-size:13px}
  textarea{resize:vertical}
  .list{max-height:230px;overflow:auto;border:1px solid var(--vscode-widget-border,#333);border-radius:6px;margin-top:6px}
  .row{display:flex;gap:8px;padding:7px 9px;border-top:1px solid var(--vscode-widget-border,#2a2a2a);cursor:pointer;align-items:flex-start}
  .row:first-child{border-top:0} .row input{width:auto;margin-top:2px}
  .row .n{font-weight:600} .row .d{color:var(--vscode-descriptionForeground);font-size:12px}
  .actions{display:flex;gap:8px;margin-top:20px}
  button{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:0;border-radius:6px;padding:8px 16px;cursor:pointer;font-size:13px}
  button.sec{background:var(--vscode-button-secondaryBackground,#3a3a3a);color:var(--vscode-button-secondaryForeground,#ccc)}
  .hint{background:var(--vscode-editorWidget-background);border-radius:6px;padding:8px 11px;font-size:12px;margin-top:4px}
</style></head><body>
  <h1>Create a SuperBob kit</h1>
  <p class="sub muted">A kit is a set of skills you load together for one kind of work, plus the context that tells <b>you</b> and SuperBob's <b>Auto mode</b> when to reach for it. Fill the context in here; it powers routing and the "How to use" page.</p>

  <label>Name <span class="muted">(lowercase, e.g. sql-evals)</span></label>
  <input id="name" placeholder="sql-evals"/>

  <label>What it's for <span class="muted">, Auto mode reads this to pick the kit</span></label>
  <input id="tagline" placeholder="Evaluating our SQL agent's answers"/>
  <div class="hint muted">Describe the <b>situation</b>, not the skills. This is the cue Auto mode matches a task against.</div>

  <label>When to reach for it <span class="muted">(optional)</span></label>
  <textarea id="when" rows="2" placeholder="You're checking whether the SQL agent's answers are correct and safe before shipping."></textarea>

  <label>Skills <span class="muted" id="cnt"></span></label>
  <input id="search" placeholder="Search skills…"/>
  <div class="list" id="list"></div>

  <label>Worked example <span class="muted">(one step per line, optional; shows in "How to use")</span></label>
  <textarea id="example" rows="4" placeholder="Load the kit and start a new chat.&#10;Paste the question and the agent's answer.&#10;Score retrieval and answer quality separately."></textarea>

  <label>Tips <span class="muted">(one per line, optional)</span></label>
  <textarea id="tips" rows="3" placeholder="Keep it lean, 8 sharp skills beat 30 vague ones.&#10;Start a new chat after loading so the skills come online."></textarea>

  <div class="actions"><button id="save">Save kit</button><button class="sec" id="cancel">Cancel</button></div>

<script nonce="${nonce}">
  const vscode=acquireVsCodeApi(); const SK=${data}; const sel=new Set();
  const list=document.getElementById('list');
  function count(){ document.getElementById('cnt').textContent='· '+(sel.size+2)+' skills (incl. 2 core)'; }
  function render(){ const q=(document.getElementById('search').value||'').toLowerCase(); list.innerHTML='';
    SK.forEach(s=>{ if(q && !(s.n.includes(q)||(s.d||'').toLowerCase().includes(q))) return;
      const row=document.createElement('label'); row.className='row';
      const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=sel.has(s.n);
      cb.onchange=()=>{ cb.checked?sel.add(s.n):sel.delete(s.n); count(); };
      const mid=document.createElement('div'); mid.innerHTML='<div class="n">'+s.n+'</div>'+(s.d?'<div class="d">'+s.d+'</div>':'');
      row.appendChild(cb); row.appendChild(mid); list.appendChild(row); });
  }
  document.getElementById('search').addEventListener('input',render);
  document.getElementById('cancel').onclick=()=>vscode.postMessage({type:'closeBuilder'});
  document.getElementById('save').onclick=()=>{
    const lines=id=>document.getElementById(id).value.split('\\n').map(x=>x.trim()).filter(Boolean);
    vscode.postMessage({type:'saveMode',
      name:document.getElementById('name').value, desc:document.getElementById('tagline').value,
      when:document.getElementById('when').value, skills:[...sel],
      example:lines('example'), tips:lines('tips')});
  };
  render(); count();
</script></body></html>`;
}

function getWebviewHtml() {
  const nonce = 'sb' + Date.now();
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';"/>
<style>
  body{font-family:var(--vscode-font-family);color:var(--vscode-foreground);padding:16px 20px;font-size:13px;line-height:1.5}
  h1{font-size:1.1rem;margin:0 0 2px;font-weight:600}
  h2{font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--vscode-descriptionForeground);margin:22px 0 8px;font-weight:600}
  .muted{color:var(--vscode-descriptionForeground)}
  .active-card{border:1px solid var(--vscode-focusBorder,#0e639c);background:var(--vscode-editorWidget-background);border-radius:8px;padding:12px 14px;margin:12px 0 4px}
  #activeKits{margin-top:8px} #activeKits .mode{background:var(--vscode-editor-background,rgba(0,0,0,.15))}
  .active-card .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--vscode-charts-green,#3fb950);margin-right:7px}
  .active-card .now{font-weight:600;font-size:1rem}
  .active-card .skills{margin-top:7px;display:flex;flex-wrap:wrap;gap:5px}
  .pill{font-size:11px;background:var(--vscode-badge-background,#333);color:var(--vscode-badge-foreground,#ccc);border-radius:10px;padding:2px 9px}
  .sklist{margin-top:4px}
  .skrow{padding:6px 0;border-top:1px solid var(--vscode-widget-border,#2a2a2a)}
  .skrow:first-child{border-top:0}
  .skgroup{margin-top:8px}
  .skgroup-h{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--vscode-descriptionForeground);font-weight:600}
  .dup{font-size:10px;color:var(--vscode-charts-blue,#3794ff);border:1px solid currentColor;border-radius:8px;padding:0 6px;margin-left:6px;white-space:nowrap}
  .skrow .sh{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
  .skrow .sn{font-weight:600}
  .skrow .sn .ao{font-size:9px;color:var(--vscode-charts-blue,#4aa8d8);border:1px solid currentColor;border-radius:7px;padding:0 5px;margin-left:5px;text-transform:uppercase}
  .skrow .stk{color:var(--vscode-descriptionForeground);font-size:11px;white-space:nowrap;font-variant-numeric:tabular-nums}
  .skrow .sd{color:var(--vscode-descriptionForeground);font-size:11.5px;margin-top:1px;line-height:1.4}
  .powerbar{display:flex;gap:10px;align-items:center;padding:9px 11px;margin:10px 0;border:1px solid var(--vscode-widget-border,#333);border-radius:8px}
  .pswitch{position:relative;width:34px;height:20px;flex:none;cursor:pointer;display:inline-block}
  .pswitch input{position:absolute;opacity:0;width:0;height:0}
  .pswitch .track{position:absolute;inset:0;border-radius:999px;background:var(--vscode-input-background,#3a3a3a);border:1px solid var(--vscode-widget-border,#555);transition:.15s}
  .pswitch .knob{position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--vscode-descriptionForeground,#aaa);transition:.15s}
  .pswitch input:checked ~ .track{background:var(--vscode-charts-green,#3fa76a);border-color:transparent}
  .pswitch.blue input:checked ~ .track{background:var(--vscode-charts-blue,#3794ff);border-color:transparent}
  .sorc{color:var(--vscode-descriptionForeground);font-size:11px;opacity:.85;margin-top:2px;font-style:italic}
  .pswitch input:checked ~ .knob{left:17px;background:#fff}
  .pswitch input:focus-visible ~ .track{outline:2px solid var(--vscode-focusBorder,#5a9);outline-offset:1px}
  .powerbar .t b{color:var(--vscode-charts-green,#89d185)}
  #main.off .powerbar .t b{color:var(--vscode-descriptionForeground)}
  #main.off .hideWhenOff{display:none !important}
  .offbanner{padding:9px 11px;margin:0 0 12px;border-radius:8px;font-size:12.5px;line-height:1.5;background:var(--vscode-inputValidation-warningBackground,#3b2e1e);border:1px solid var(--vscode-inputValidation-warningBorder,#6b5424)}
  .mode{border:1px solid var(--vscode-widget-border,#3c3c3c);border-radius:8px;padding:10px 12px;margin-bottom:7px}
  .mode.on{border-color:var(--vscode-focusBorder,#0e639c)}
  .mode-top{display:flex;align-items:center;gap:8px}
  .mode-namewrap{flex:1;min-width:0}
  .mode-icons{margin-left:auto;display:flex;gap:1px;flex-shrink:0}
  .iconbtn{background:none;border:0;cursor:pointer;color:var(--vscode-textLink-foreground,#4aa8d8);font-size:14px;line-height:1;padding:3px 6px;border-radius:5px}
  .iconbtn:hover{background:var(--vscode-toolbar-hoverBackground,#2a2a2a)}
  .iconbtn.del{color:var(--vscode-descriptionForeground);font-size:13px}
  .mode-name{font-weight:600}
  .mode-top .cnt{color:var(--vscode-descriptionForeground);font-size:12px}
  .mode-top .badge{font-size:10px;color:var(--vscode-charts-green,#3fb950);border:1px solid currentColor;border-radius:8px;padding:0 7px;white-space:nowrap}
  .lockbadge{font-size:10px;color:var(--vscode-descriptionForeground);border:1px solid currentColor;border-radius:8px;padding:0 7px;white-space:nowrap}
  .setupbadge{font-size:10px;color:var(--vscode-charts-yellow,#d29922);border:1px solid currentColor;border-radius:8px;padding:0 7px;white-space:nowrap;cursor:help}
  .agentbadge{font-size:10px;color:var(--vscode-charts-purple,#b180d7);border:1px solid currentColor;border-radius:8px;padding:0 7px;white-space:nowrap}
  .pswitch input:disabled ~ .track{opacity:.4} .pswitch input:disabled ~ .knob{opacity:.4}
  .mode-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:8px}
  button{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:0;border-radius:5px;padding:5px 13px;cursor:pointer;font-size:12px}
  button.sec{background:var(--vscode-button-secondaryBackground);color:var(--vscode-button-secondaryForeground)}
  button:hover{filter:brightness(1.12)}
  .linkbtn{background:none;color:var(--vscode-textLink-foreground,#4aa8d8);padding:4px 6px}
  .del{background:none;color:var(--vscode-descriptionForeground);padding:4px 6px;font-size:13px}
  .del:hover{color:var(--vscode-errorForeground,#e05561)}
  .mode-skills{margin-top:8px;padding-top:8px;border-top:1px solid var(--vscode-widget-border,#2a2a2a);color:var(--vscode-descriptionForeground);font-size:12px;line-height:1.7}
  details.builtins{margin-top:4px}
  details.builtins summary{cursor:pointer;color:var(--vscode-descriptionForeground);font-size:12px;padding:4px 0}
  details.active-skills{margin-top:8px}
  details.active-skills summary{cursor:pointer;color:var(--vscode-textLink-foreground,#4aa8d8);font-size:12px;padding:3px 0}
  details.active-skills[open] summary{color:var(--vscode-descriptionForeground)}
  details.help{border:1px solid var(--vscode-widget-border,#3c3c3c);border-radius:8px;padding:8px 12px;margin:12px 0}
  details.help summary{cursor:pointer;font-weight:600}
  .helpbody{margin-top:8px;color:var(--vscode-descriptionForeground);font-size:12.5px}
  .helpbody ol{margin:6px 0;padding-left:18px}
  .helpbody li{margin:4px 0}
  .helpbody b{color:var(--vscode-foreground)}
  .helpbody code{background:var(--vscode-textCodeBlock-background,#2a2a2a);padding:0 5px;border-radius:4px}
  #createBtn{margin-top:14px}
  #builder{border:1px solid var(--vscode-widget-border,#3c3c3c);border-radius:8px;padding:14px;margin-top:12px}
  input[type=text]{background:var(--vscode-input-background);color:var(--vscode-input-foreground);border:1px solid var(--vscode-input-border,#3c3c3c);border-radius:5px;padding:7px 10px;font-size:13px;width:100%;box-sizing:border-box;margin-bottom:8px}
  .blist{border:1px solid var(--vscode-widget-border,#3c3c3c);border-radius:6px;max-height:38vh;overflow:auto}
  .brow{display:flex;gap:9px;align-items:baseline;padding:6px 10px;border-bottom:1px solid var(--vscode-widget-border,#2a2a2a)}
  .brow:last-child{border-bottom:0}
  .brow:hover{background:var(--vscode-list-hoverBackground)}
  .brow .bn{font-weight:600}
  .brow .bd{color:var(--vscode-descriptionForeground);font-size:12px}
  .brow-actions{display:flex;gap:8px;margin-top:10px}
  .foot{margin-top:18px;color:var(--vscode-descriptionForeground);font-size:12px;border-top:1px solid var(--vscode-widget-border,#2a2a2a);padding-top:10px}
  .empty{padding:24px;text-align:center}
  .autobar{display:flex;align-items:center;gap:9px;border:1px solid var(--vscode-focusBorder,#0e639c);border-radius:8px;padding:11px 13px;margin:14px 0 6px;cursor:pointer}
  .autobar input{width:auto;margin:0}
  .autobar .t{font-weight:600}
  .mode-desc{color:var(--vscode-descriptionForeground);font-size:12px;margin-top:4px}
  #activeDesc{color:var(--vscode-descriptionForeground);font-size:12px;margin-top:4px}
</style></head><body>
<div id="notinstalled" class="empty" style="display:none">
  <p>SuperBob isn't set up yet.</p><button id="installBtn">Set up skills</button>
</div>
<div id="main" style="display:none">
  <h1>SuperBob</h1>
  <div class="muted">Expert skill <b>kits</b> for Bob, the right skills load per task, automatically. Leave <b>Auto</b> on, or flip a kit's blue toggle. Each kit has a <b>Learn more</b> guide with a worked example.</div>

  <div class="powerbar">
    <label class="pswitch"><input type="checkbox" id="powerToggle" checked/><span class="track"></span><span class="knob"></span></label>
    <span><span class="t">SuperBob is <b id="powerState">on</b>.</span> <span class="muted">Its skills layer onto whichever Bob mode you're in; off runs plain Bob. Your own skills always stay.</span></span>
  </div>
  <div id="offbanner" class="offbanner" style="display:none">
    SuperBob is <b>off</b>, Bob runs with only your own skills. Turn it on to layer SuperBob's skills onto your current Bob mode, then start a new conversation.
  </div>

  <div class="hideWhenOff">
  <label class="autobar"><input type="checkbox" id="autoToggle"/><span><span class="t">Auto mode</span> <span class="muted">(recommended). SuperBob picks skills per task. It stays within the kits you select below, or uses all skills when none are selected.</span></span></label>

  <div class="scopebar" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:2px 0 8px;font-size:12px">
    <span class="muted">SuperBob handles:</span>
    <label style="display:inline-flex;align-items:center;gap:5px;cursor:pointer"><input type="radio" name="scope" value="all" style="width:auto;margin:0"/> All skills <span class="muted">(yours + SuperBob)</span></label>
    <label style="display:inline-flex;align-items:center;gap:5px;cursor:pointer"><input type="radio" name="scope" value="superbob-only" style="width:auto;margin:0"/> SuperBob only</label>
  </div>

  <div class="active-card">
    <div><span class="dot"></span><span class="now" id="activeNow"></span></div>
    <div id="activeDesc"></div>
    <div id="activeKits"></div>
    <details class="active-skills">
      <summary id="activeSkillsSummary">Loaded skills</summary>
      <div class="skills" id="activeSkills"></div>
    </details>
    <div id="addonsWrap" style="display:none;margin-top:9px;border-top:1px solid var(--vscode-widget-border,#2a2a2a);padding-top:9px">
      <div class="muted" style="font-size:11px;margin-bottom:7px">Optional, always on when enabled:</div>
      <div id="addons"></div>
    </div>
  </div>

  <h2>Your kits</h2>
  <div class="muted" style="margin:-6px 0 8px;font-size:12px">Kits you create. Use <b>+ Create your own kit</b> to make one.</div>
  <div id="yourModes"></div>

  <details class="builtins" open>
    <summary id="builtinSummary">Starter kits (built-in)</summary>
    <div id="builtinModes" style="margin-top:8px"></div>
  </details>

  <button id="createBtn">+ Create your own kit</button>

  <div id="builder" style="display:none">
    <div style="font-weight:600;margin-bottom:4px">Create your own kit</div>
    <div class="muted" style="margin-bottom:8px">A kit is a named set of skills you load together for one kind of work.</div>
    <input type="text" id="bname" placeholder="Name it, e.g. sql-evals"/>
    <input type="text" id="bdesc" placeholder="What's it for?, e.g. Evaluating our SQL agent's answers"/>
    <div class="muted" style="margin-bottom:6px">Optional, start from an existing mode, then check the skills to include:</div>
    <select id="bstart"></select>
    <input type="text" id="bsearch" placeholder="Search skills…" style="margin-top:8px"/>
    <div class="blist" id="blist"></div>
    <div class="muted" style="margin-top:6px" id="bcount"></div>
    <div class="brow-actions">
      <button id="bsave">Save mode</button>
      <button class="sec" id="bcancel">Cancel</button>
    </div>
  </div>
  </div><!-- /hideWhenOff -->

  <div id="toolsSection" style="display:none">
    <h2>Optional tools</h2>
    <div class="muted" style="margin:-6px 0 8px;font-size:12px">External CLIs that run inside Bob. Off by default.</div>
    <div id="tools"></div>
  </div>

  <details class="help">
    <summary>❔ How to use SuperBob</summary>
    <div class="helpbody">
      <p>A <b>kit</b> is a set of expert skills for one kind of work. SuperBob loads only the current kit, so Bob stays fast and focused.</p>
      <ol>
        <li>Leave <b>Auto mode</b> on and SuperBob picks the skills for each task. For most work, that's the whole setup.</li>
        <li>Or flip a kit's <b>blue toggle</b> on to load it, <b>stack several</b> and their skills combine. Click <b>Learn more</b> for its pitch and a worked example; <b>skills</b> shows what's inside and where each comes from.</li>
        <li>Or, in the Bob chat, type <code>/superbob software-development</code> (or any kit). <code>/superbob</code> alone lists them.</li>
        <li>After switching, <b>start a new conversation</b> so the skills load.</li>
        <li>Use <b>+ Create your own kit</b> to build one, with its own guide.</li>
      </ol>
      <button class="sec" id="docsBtn">Open full guide ↗</button>
    </div>
  </details>

  <div class="foot">The 2 core skills are always on. After switching a kit, <b>start a new conversation</b> so it loads.</div>
</div>
<script nonce="${nonce}">
  const vscode = acquireVsCodeApi();
  let S=null; let sel=new Set();
  vscode.postMessage({type:'ready'});
  window.addEventListener('message', e=>{ if(e.data.type==='state'){ S=e.data; render(); }});

  function activeMode(){ if(!S.active) return null; if(S.active.indexOf('lean')===0) return '__lean__';
    if(S.active.indexOf('core + ')===0) return S.active.slice(7).split(' ')[0]; return '__custom__'; }
  // All active kits (multiple can be loaded at once). Parsed from the 'core + kitA kitB' label.
  function activeKits(){ if(!S.active || S.active.indexOf('core + ')!==0) return []; return S.active.slice(7).split(' ').filter(k=>k && (S.profiles[k]!==undefined)); }
  function curated(){ const set=new Set(); Object.values(S.profiles).forEach(a=>a.forEach(n=>set.add(n))); S.core.forEach(n=>set.delete(n)); return [...set].sort(); }
  function descOf(n){ const s=S.skills.find(x=>x.name===n); return s?s.desc:''; }
  const DESCR={
    __lean__:'Just the two core skills. SuperBob reads each task and pulls in the rest as needed, the safe default for mixed work.',
    code:'Writing or changing software. Includes tests-first (tdd-workflow), codebase-exploration, API & system design, your stack patterns (python/react/…), and docker/kubernetes. Pick this when building or refactoring a feature.',
    data:'Working with data and judging AI output. Includes error-analysis, LLM-as-judge (write-judge-prompt + validate-evaluator), evaluate-rag, SQL, embeddings and statistics. Pick this for analytics or measuring how good an AI pipeline is.',
    pm:'Product management. Includes PRDs (create-prd), product-vision, outcome roadmaps, prioritization frameworks and user stories. Pick this for planning and strategy, not coding.',
    security:'Finding and fixing security problems. Includes the bb-methodology playbook, security-audit, the hunt-* vulnerability skills, redteam-mindset and reporting. Pick this for an audit or a pen-test.',
    ui:'Building and polishing interfaces. Includes frontend-design, fixing-accessibility, motion, design systems and read-only improve-ui audits. Pick this for anything users see on screen.',
    research:'Digging into a topic and keeping what you learn. Includes deep-research, the wiki knowledge base, autoresearch and note-taking. Pick this for investigation and knowledge work.',
    rag:'Evaluating a RAG or retrieval agent. Includes evaluate-rag (scores search and answer separately), error-analysis, LLM judges (write-judge-prompt + validate-evaluator), SQL checks and statistics. Pick this to measure and improve a retrieval agent.',
    'ship-it':'A quality gate to run before shipping. Includes code-review, verification-before-completion, security-audit, tests and clean-code habits (karpathy-guidelines). Pick this right before you merge or release.',
    'quick-fix':'Fast, focused debugging. Includes systematic-debugging (find the root cause first), caveman-debug (print statements) and error-handling. Pick this when something is broken and you need it fixed.'
  };
  function descFor(id){ return (S.meta&&S.meta[id]) || DESCR[id] || 'Custom kit.'; }
  function skillInfo(n){ return S.skills.find(x=>x.name===n) || {name:n,tokens:60,desc:''}; }
  function fmtTok(t){ return t>=1000?'~'+(t/1000).toFixed(1)+'k tokens':'~'+t+' tokens'; }
  // Short, hand-written labels for the two always-on skills, their own frontmatter
  // descriptions are long and wrap badly in a narrow panel.
  const SHORT={ 'using-superpowers':'Checks for a matching skill before acting.', 'mission-control':'Routes each task to the right skills.' };
  function skillRows(names, shared){
    const d=document.createElement('div'); d.className='sklist';
    names.forEach(n=>{ const s=skillInfo(n); const core=S.core.includes(n);
      const r=document.createElement('div'); r.className='skrow';
      const desc=SHORT[n]||s.desc;
      const origin=(S.provenance&&S.provenance[n])||'';
      const dup = shared && shared[n] && shared[n].length>1;   // skill is in more than one active kit
      const dupBadge = dup ? '<span class="dup" title="in: '+shared[n].join(', ')+', loaded once">shared · once</span>' : '';
      r.innerHTML='<div class="sh"><span class="sn">'+n+(core?'<span class="ao">always on</span>':'')+dupBadge+'</span><span class="stk">'+fmtTok(s.tokens)+'</span></div>'+(desc?'<div class="sd">'+desc+'</div>':'')+(origin?'<div class="sorc">from '+origin+'</div>':'');
      d.appendChild(r); });
    return d;
  }

  function renderAddons(){
    const wrap=document.getElementById('addonsWrap'); const c=document.getElementById('addons');
    if(!wrap||!c) return;
    const list=S.addons||[];
    wrap.style.display=list.length?'block':'none'; c.innerHTML='';
    list.forEach(a=>{
      const row=document.createElement('div'); row.style.display='flex'; row.style.alignItems='center'; row.style.gap='9px'; row.style.margin='5px 0';
      row.innerHTML='<label class="pswitch"><input type="checkbox" class="addonsw" data-addon="'+a.name+'" '+(a.on?'checked':'')+'/><span class="track"></span><span class="knob"></span></label>'+
        '<span style="font-size:12px"><span style="font-weight:600">'+a.title+'</span> <span class="muted">'+a.desc+'</span></span>';
      c.appendChild(row);
    });
  }

  function renderTools(){
    const sec=document.getElementById('toolsSection'); if(sec) sec.style.display=(S.tools&&S.tools.length)?'block':'none';
    const c=document.getElementById('tools'); if(!c) return; c.innerHTML='';
    (S.tools||[]).forEach(t=>{
      const status = t.active ? (t.hasKey?'Enabled':'Enabled, add a model key to Bob’s env') : (t.installed?'Installed, off':'Not installed');
      const row=document.createElement('div'); row.className='mode'+(t.active?' on':'');
      const top=document.createElement('div'); top.className='mode-top'; top.style.display='flex'; top.style.alignItems='center'; top.style.justifyContent='space-between';
      top.innerHTML='<span class="mode-name">'+t.title+'</span>'+
        '<label class="pswitch"><input type="checkbox" class="toolsw" data-tool="'+t.name+'" '+(t.active?'checked':'')+'/><span class="track"></span><span class="knob"></span></label>';
      const md=document.createElement('div'); md.className='mode-desc'; md.textContent=t.desc;
      const st=document.createElement('div'); st.className='muted'; st.style.fontSize='12px'; st.style.marginTop='4px'; st.textContent=status;
      row.appendChild(top); row.appendChild(md); row.appendChild(st); c.appendChild(row);
    });
  }

  function render(){
    document.getElementById('notinstalled').style.display=S.installed?'none':'block';
    document.getElementById('main').style.display=S.installed?'block':'none';
    if(!S.installed) return;
    // power (on/off)
    const off=!!S.poweredOff;
    document.getElementById('main').classList.toggle('off', off);
    document.getElementById('powerToggle').checked=!off;
    document.getElementById('powerState').textContent=off?'off':'on';
    document.getElementById('offbanner').style.display=off?'block':'none';
    renderTools();   // optional tools are independent of SuperBob on/off
    if(off) return;   // nothing else to render while off
    const am=activeMode();
    const AK=activeKits();   // the set of active kits (0, 1, or many)
    // active card title: Auto / one or more kit names / custom
    const autoOn=!!S.auto;
    document.getElementById('activeNow').textContent = AK.length ? ('Active kits ('+AK.length+')') : (am==='__custom__'?'Custom set' : (autoOn?'Auto mode: all skills':'Manual mode'));
    document.getElementById('autoToggle').checked = !!S.auto;
    { const sc=(S.scope==='superbob-only')?'superbob-only':'all'; document.querySelectorAll('input[name=scope]').forEach(r=>{ r.checked=(r.value===sc); }); }
    // Description only for Auto/custom; when kits are on we render their cards below instead.
    document.getElementById('activeDesc').textContent = AK.length ? (autoOn?'Auto picks within these kits per task.':'Manual: these kits are loaded; invoke skills yourself.') : (am==='__custom__'?'A custom set of skills you picked.' : (autoOn?descFor('__lean__'):'Auto is off. SuperBob will not auto-pick; invoke skills yourself.'));
    // The enabled kits, as the same cards used below, so you can see and toggle them off here.
    const akEl=document.getElementById('activeKits'); akEl.innerHTML='';
    AK.forEach(k=>{ if(S.profiles[k]) akEl.appendChild(modeCard(k, k, S.profiles[k], true, !S.builtin.includes(k))); });
    // Show only what SuperBob loaded (core + the kits' skills). The user's own skills are kept untouched, not listed.
    const ext=new Set(S.external||[]);
    const addonNames=new Set((S.addons||[]).map(a=>a.name));
    const extras=S.activeSet.filter(n=>!S.core.includes(n) && !ext.has(n) && !addonNames.has(n));
    const cont=document.getElementById('activeSkills'); cont.innerHTML='';
    // Group by what loaded each skill: core, then one group PER active kit (a skill in two kits
    // shows under each). That's the kit-level provenance; each row still shows its author origin.
    // which active kits contain each loaded skill → a skill in >1 kit is "shared, loaded once"
    const sharedMap={}; extras.forEach(n=>{ sharedMap[n]=AK.filter(k=>(S.profiles[k]||[]).includes(n)); });
    const dupCount=Object.values(sharedMap).filter(ks=>ks.length>1).length;
    function group(title, names){ if(!names.length) return; const g=document.createElement('div'); g.className='skgroup';
      const h=document.createElement('div'); h.className='skgroup-h'; h.textContent=title; g.appendChild(h); g.appendChild(skillRows(names, sharedMap)); cont.appendChild(g); }
    group('Always on · core', S.core);
    const grouped=new Set();
    AK.forEach(k=>{ const ks=(S.profiles[k]||[]).filter(n=>extras.includes(n)); ks.forEach(n=>grouped.add(n)); group('From kit · '+k, ks); });
    const ungrouped=extras.filter(n=>!grouped.has(n));   // custom / leftover skills not in any active kit
    group(AK.length?'Also loaded':'From your custom set', ungrouped);
    // one-line summary; stable height (no dashes)
    const total=S.core.length+extras.length;
    document.getElementById('activeSkillsSummary').textContent =
      total + ' skills loaded: ' + S.core.length + ' core' + (extras.length? (' + ' + extras.length + ' from ' + (AK.length||1) + ' kit' + ((AK.length||1)>1?'s':'')) : '') + (dupCount? (', ' + dupCount + ' shared (loaded once)') : '') + ' · view';
    renderAddons();

    // your kits = the user's own (non-builtin) kits. Lean is the Auto/base state,
    // controlled by the Auto toggle and shown in the active card, so it is not a card here.
    // The lists below show only kits that are NOT active (active ones live in the active card).
    const your=document.getElementById('yourModes'); your.innerHTML='';
    const mine=Object.keys(S.profiles).filter(p=>!S.builtin.includes(p) && !AK.includes(p));
    if(!Object.keys(S.profiles).filter(p=>!S.builtin.includes(p)).length){ your.innerHTML='<div class="muted" style="font-size:12px;padding:6px 0">No kits yet.</div>'; }
    else if(!mine.length){ your.innerHTML='<div class="muted" style="font-size:12px;padding:6px 0">All your kits are active.</div>'; }
    mine.forEach(p=>{ your.appendChild(modeCard(p, p, S.profiles[p], false, true)); });
    // built-in modes (excluding active ones, which show in the active card)
    const bi=document.getElementById('builtinModes'); bi.innerHTML='';
    const biList=S.builtin.filter(p=>S.profiles[p] && !AK.includes(p));
    biList.forEach(p=>{ bi.appendChild(modeCard(p, p, S.profiles[p], false, false)); });
    document.getElementById('builtinSummary').textContent='Starter kits (built-in · '+biList.length+' available)';
    // builder start-from options
    const bs=document.getElementById('bstart'); if(bs && bs.options.length===0){
      bs.innerHTML='<option value="">(blank, pick your own)</option>'+Object.keys(S.profiles).map(p=>'<option value="'+p+'">'+p+'</option>').join('');
    }
  }

  function modeCard(id,label,skills,isActive,deletable){
    const d=document.createElement('div'); d.className='mode'+(isActive?' on':'');
    const count = id==='__lean__' ? 'essentials only' : skills.length+' skills';
    // Row 1: a BLUE load/unload toggle on the left (kits differ from the green power/add-on
    // toggles), then the name + count + active badge. Stable regardless of state.
    const pre=(S.prereqs||{})[id]; const locked=pre && !pre.met;   // kit needs a plugin that isn't installed
    const rs=(S.setup||{})[id]; const needSetup=rs && rs.needsSetup;   // a kit item needs setup (soft, not a lock)
    const nAgents=((S.agentsByKit||{})[id]||[]).length;   // agents this kit installs
    const top=document.createElement('div'); top.className='mode-top';
    const tog=document.createElement('label'); tog.className='pswitch blue'; tog.title=locked?('needs '+pre.label):(isActive?'unload this kit (back to Auto)':'load this kit');
    tog.innerHTML='<input type="checkbox" class="kitsw" data-kit="'+id+'" '+(isActive?'checked':'')+(locked?' disabled':'')+'/><span class="track"></span><span class="knob"></span>';
    top.appendChild(tog);
    const nm=document.createElement('span'); nm.className='mode-namewrap';
    nm.innerHTML='<span class="mode-name">'+label+'</span> <span class="cnt">'+count+'</span>'+(nAgents?' <span class="agentbadge">+'+nAgents+' agent'+(nAgents>1?'s':'')+'</span>':'')+(isActive?' <span class="badge">active</span>':'')+(locked?' <span class="lockbadge">🔒 needs '+pre.label.replace(/^the /,'')+'</span>':'')+((needSetup&&!locked)?' <span class="setupbadge" title="'+(rs.items.filter(i=>!i.met).map(i=>i.label).join(', '))+' — see Learn more">requires setup</span>':'');
    top.appendChild(nm);
    // Top-right icons: Learn more (ⓘ, opens the guide with pitch + example + skills) and delete.
    const acts=document.createElement('span'); acts.className='mode-icons';
    const how=document.createElement('button'); how.className='iconbtn'; how.textContent='ⓘ';
    how.title='Learn more: the pitch, a worked example, and the skills inside'; how.onclick=()=> vscode.postMessage({type:'openGuide',kit:id}); acts.appendChild(how);
    if(deletable){ const del=document.createElement('button'); del.className='iconbtn del'; del.textContent='🗑'; del.title='delete this kit';
      del.onclick=()=> vscode.postMessage({type:'deleteMode',name:id}); acts.appendChild(del); }
    top.appendChild(acts);
    d.appendChild(top);
    const md=document.createElement('div'); md.className='mode-desc'; md.textContent=descFor(id); d.appendChild(md);
    return d;
  }

  // ---- builder ----
  function openBuilder(){ document.getElementById('builder').style.display='block'; document.getElementById('createBtn').style.display='none'; sel=new Set(); renderBuilder(); }
  function closeBuilder(){ document.getElementById('builder').style.display='none'; document.getElementById('createBtn').style.display='inline-block'; }
  function renderBuilder(){
    const q=(document.getElementById('bsearch').value||'').toLowerCase();
    const list=document.getElementById('blist'); list.innerHTML='';
    curated().forEach(n=>{
      if(q && !(n.toLowerCase().includes(q)||(descOf(n)||'').toLowerCase().includes(q))) return;
      const row=document.createElement('label'); row.className='brow';
      const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=sel.has(n);
      cb.onchange=()=>{ cb.checked?sel.add(n):sel.delete(n); document.getElementById('bcount').textContent=(sel.size+2)+' skills (incl. 2 core)'; };
      const mid=document.createElement('div'); mid.innerHTML='<div class="bn">'+n+'</div>'+(descOf(n)?'<div class="bd">'+descOf(n)+'</div>':'');
      row.appendChild(cb); row.appendChild(mid); list.appendChild(row);
    });
    document.getElementById('bcount').textContent=(sel.size+2)+' skills (incl. 2 core)';
  }
  document.addEventListener('click',e=>{
    if(e.target.id==='createBtn') vscode.postMessage({type:'openBuilder'});
    if(e.target.id==='bcancel') closeBuilder();
    if(e.target.id==='installBtn') vscode.postMessage({type:'install'});
    if(e.target.id==='docsBtn') vscode.postMessage({type:'openDocs'});
    if(e.target.id==='bsave'){ const name=document.getElementById('bname').value; vscode.postMessage({type:'saveMode',name:name,desc:document.getElementById('bdesc').value,skills:[...sel]}); closeBuilder(); }
  });
  document.addEventListener('input',e=>{ if(e.target.id==='bsearch') renderBuilder(); });
  document.addEventListener('change',e=>{ if(e.target.id==='autoToggle'){ vscode.postMessage({type:'setAuto', on:e.target.checked}); }
    if(e.target.id==='powerToggle'){ vscode.postMessage({type:'setPower', on:e.target.checked}); }
    if(e.target.name==='scope' && e.target.checked){ vscode.postMessage({type:'setScope', scope:e.target.value}); }
    if(e.target.classList && e.target.classList.contains('toolsw')){ vscode.postMessage({type:'toolToggle', tool:e.target.dataset.tool, on:e.target.checked}); }
    if(e.target.classList && e.target.classList.contains('addonsw')){ vscode.postMessage({type:'setAddon', name:e.target.dataset.addon, on:e.target.checked}); }
    if(e.target.classList && e.target.classList.contains('kitsw')){
      const kit=e.target.dataset.kit; const cur=activeKits();
      const next = e.target.checked ? [...new Set([...cur, kit])] : cur.filter(k=>k!==kit);
      vscode.postMessage(next.length ? {type:'applyProfile', names:next} : {type:'applyLean'});
    }
    if(e.target.id==='bstart'){ const p=e.target.value; sel=new Set(p&&S.profiles[p]?S.profiles[p].filter(n=>!S.core.includes(n)):[]); renderBuilder(); } });
</script></body></html>`;
}


// ---- install (unchanged behaviour) ----------------------------------------
async function doInstall(context) {
  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: 'SuperBob: installing…', cancellable: false },
    async (progress) => {
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-'));
      try {
        progress.report({ message: 'unpacking library' });
        unzip(path.join(context.extensionPath, 'skills.zip'), tmp);
        const pkg = path.join(tmp, 'bob-skills-package');
        const skillsSrc = path.join(pkg, 'skills');
        const bobMeta = path.join(pkg, 'meta', 'mission-control.bob.md');
        {
          progress.report({ message: 'installing skills' });
          const bk = backupIfPresent(BOB_ACTIVE);
          fs.mkdirSync(BOB_VAULT, { recursive: true });
          fs.cpSync(skillsSrc, BOB_VAULT, { recursive: true });
          fs.mkdirSync(path.join(BOB_VAULT, 'mission-control'), { recursive: true });
          fs.copyFileSync(bobMeta, path.join(BOB_VAULT, 'mission-control', 'SKILL.md'));
          fs.mkdirSync(BOB_PROFILES, { recursive: true });
          for (const f of fs.readdirSync(path.join(pkg, 'profiles'))) fs.copyFileSync(path.join(pkg, 'profiles', f), path.join(BOB_PROFILES, f));
          // Bob chat slash commands (e.g. /superbob) go in ~/.bob/commands/
          const cmdSrc = path.join(pkg, 'commands');
          if (fs.existsSync(cmdSrc)) {
            const cmdDest = path.join(HOME, '.bob', 'commands');
            fs.mkdirSync(cmdDest, { recursive: true });
            for (const f of fs.readdirSync(cmdSrc)) fs.copyFileSync(path.join(cmdSrc, f), path.join(cmdDest, f));
          }
          // Bundled agent definitions (kits materialize these into Bob modes + Claude subagents)
          const agentsSrc = path.join(pkg, 'agents');
          if (fs.existsSync(agentsSrc)) {
            fs.mkdirSync(BOB_AGENTS, { recursive: true });
            for (const f of fs.readdirSync(agentsSrc)) fs.copyFileSync(path.join(agentsSrc, f), path.join(BOB_AGENTS, f));
          }
          applyProfile([]);
          if (bk) log('Bob skills backed up to ' + bk);
        }
      } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
    }
  );
  invalidateVaultCache();   // the vault just changed; drop the cached skill metadata
  invalidateResourceCache();   // re-detect resource availability after an install
  updateStatus();
  vscode.window.showInformationMessage('SuperBob installed (' + target + '). Restart Bob / start a new VS Code session so skills load.');
}

async function doLoadProfile() {
  const names = profileNames();
  if (!names.length) { vscode.window.showErrorMessage('SuperBob: no kits found. Run "Install / Update Skills" first.'); return; }
  const pick = await vscode.window.showQuickPick(['lean (core only)', ...names], { placeHolder: 'Load which kit?' });
  if (!pick) return;
  const ok = pick.startsWith('lean') ? applyProfile([]) : applyProfile([pick]);
  if (ok) vscode.window.showInformationMessage('Loaded "' + pick + '". Restart the conversation to apply.');
}

function activate(context) {
  cleanupLegacyAgentModes();   // heal any custom_modes.yaml pollution from an earlier build
  if (!isPoweredOff()) writeAgents();   // reconcile subagents to the currently loaded kits
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusItem.command = 'superBobSkills.openPanel';
  statusItem.tooltip = 'SuperBob, open the skills control panel';
  context.subscriptions.push(statusItem);
  updateStatus();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('superbob.panel', new SuperBobViewProvider(context), { webviewOptions: { retainContextWhenHidden: true } }),
    vscode.commands.registerCommand('superBobSkills.openPanel', () => openPanel(context)),
    vscode.commands.registerCommand('superBobSkills.install', () => doInstall(context)),
    vscode.commands.registerCommand('superBobSkills.loadProfile', () => doLoadProfile()),
    vscode.commands.registerCommand('superBobSkills.status', () => {
      const p = activeProfile();
      vscode.window.showInformationMessage(p ? 'Active kit: ' + p : 'SuperBob not installed yet.');
    })
  );

  if (!fs.existsSync(BOB_VAULT)) {
    vscode.window.showInformationMessage('SuperBob is ready to install into Bob / VS Code.', 'Install now')
      .then(choice => { if (choice === 'Install now') doInstall(context); });
  }
  // Warm the skill-metadata cache in the background so the first drawer open never blocks on a
  // full vault scan (which could make Bob restart the extension host and hit its SQLite crash).
  setTimeout(() => { try { skillMetaMap(); } catch (e) {} }, 1500);
}
function deactivate() {}
module.exports = { activate, deactivate };
