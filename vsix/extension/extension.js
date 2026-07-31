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

// Lean mode: only these two skills stay loaded; mission-control routes to the rest
// from the vault on demand. Keeps starting context tiny (~200 tokens vs ~67,000).
const CORE = ['using-superpowers', 'mission-control']; // superpowers first, always check for a skill before acting
// Every shipped kit is a built-in "starter kit" (not deletable). "Your kits" is left for
// the user's own creations, seeded with a couple of clearly-labelled sample kits.
const BUILTIN = ['software_development', 'data_analysis', 'product_management', 'production_engineering', 'test_engineering', 'application_security', 'frontend_design', 'web_research', 'release_review', 'bug_fixing', 'code_simplification', 'rag_evaluation', 'content_writing'];

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
function listVaultSkills() {
  if (!fs.existsSync(BOB_VAULT)) return [];
  const profs = {};
  for (const p of profileNames()) profs[p] = new Set(readList(path.join(BOB_PROFILES, p + '.txt')));
  return fs.readdirSync(BOB_VAULT)
    .filter(n => !n.startsWith('.') && fs.existsSync(path.join(BOB_VAULT, n, 'SKILL.md')))
    .sort()
    .map(name => {
      const info = frontmatterTokens(path.join(BOB_VAULT, name));
      const inProfiles = Object.keys(profs).filter(p => profs[p].has(name));
      return { name, desc: info.desc, tokens: info.tokens, inProfiles, core: CORE.includes(name) };
    });
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
// A skill sitting in the active dir (~/.bob/skills) is "SuperBob-owned" ONLY if a
// skill of the same name exists in the vault. Anything else in the active dir is a
// skill the user installed themselves, SuperBob does not manage it and must never
// remove or disable it when switching modes. This one rule is what stops a mode
// switch from clobbering the user's own skills.
function isOwned(name) { return fs.existsSync(path.join(BOB_VAULT, name, 'SKILL.md')); }
function externalActiveSkills() { return activeSkillSet().filter(n => !isOwned(n)); }

// ---- power (SuperBob on/off) -----------------------------------------------
// Off = remove every SuperBob-owned skill from the active dir (including the two
// core skills), leaving only the user's own skills, Bob then runs normally. The
// user's own skills are never touched. On = restore lean (core only).
function isPoweredOff() { return activeProfile() === 'off'; }
function superbobOff() {
  if (fs.existsSync(BOB_ACTIVE)) {
    for (const name of activeSkillSet()) {
      if (isOwned(name)) fs.rmSync(path.join(BOB_ACTIVE, name), { recursive: true, force: true });
    }
  } else { fs.mkdirSync(BOB_ACTIVE, { recursive: true }); }
  fs.writeFileSync(path.join(BOB_ACTIVE, '.profile'), 'off');
  updateStatus();
  return true;
}

// ---- apply / save / delete -------------------------------------------------
function applySkillSet(skillNames, label) {
  if (!fs.existsSync(BOB_VAULT)) { vscode.window.showErrorMessage('SuperBob: not installed yet.'); return false; }
  const wanted = new Set(CORE);
  for (const n of skillNames) wanted.add(n);
  const staged = [...wanted].filter(s => fs.existsSync(path.join(BOB_VAULT, s)));
  if (staged.length < CORE.length) { vscode.window.showErrorMessage('SuperBob: nothing to load, aborted.'); return false; }
  fs.mkdirSync(BOB_ACTIVE, { recursive: true });
  // Remove ONLY owned skills the new set no longer wants. External (user-installed)
  // skills are left exactly as they are, they stay loaded through every mode switch.
  for (const name of activeSkillSet()) {
    if (isOwned(name) && !wanted.has(name)) fs.rmSync(path.join(BOB_ACTIVE, name), { recursive: true, force: true });
  }
  // Add or refresh the wanted skills from the vault (refresh picks up vault updates).
  for (const s of staged) {
    const dest = path.join(BOB_ACTIVE, s);
    fs.rmSync(dest, { recursive: true, force: true });
    copyDir(path.join(BOB_VAULT, s), dest);
  }
  fs.writeFileSync(path.join(BOB_ACTIVE, '.profile'), label);
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
function writeMeta(m) { try { fs.writeFileSync(META(), JSON.stringify(m, null, 2)); } catch (e) {} }

function saveCustomProfile(name, skills, desc) {
  const clean = name.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '');  // snake_case, matches the built-in kits
  if (!clean) return null;
  fs.mkdirSync(BOB_PROFILES, { recursive: true });
  const body = skills.filter(s => !CORE.includes(s)).join('\n') + '\n';
  fs.writeFileSync(path.join(BOB_PROFILES, clean + '.txt'), body);
  if (desc && desc.trim()) { const m = readMeta(); m[clean] = desc.trim(); writeMeta(m); }
  return clean;
}
function deleteCustomProfile(name) {
  if (BUILTIN.includes(name)) return false;   // never delete built-ins
  const f = path.join(BOB_PROFILES, name + '.txt');
  const m = readMeta(); if (m[name]) { delete m[name]; writeMeta(m); }
  if (fs.existsSync(f)) { fs.unlinkSync(f); return true; }
  return false;
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
    skills: listVaultSkills()
  };
}
function postState() { const msg = stateMessage(); webviews.forEach(w => { try { w.postMessage(msg); } catch (e) {} }); }

async function handleMessage(m, context) {
  if (m.type === 'ready') { postState(); return; }
  if (m.type === 'applyProfile') {
    if (applyProfile([m.name])) vscode.window.showInformationMessage('Loaded "' + m.name + '" kit. Start a new conversation to apply.');
    postState(); return;
  }
  if (m.type === 'applyLean') { applyProfile([]); vscode.window.showInformationMessage('Auto mode on. SuperBob picks skills per task. Start a new conversation.'); postState(); return; }
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
    const saved = saveCustomProfile(m.name, m.skills, m.desc);
    if (saved) vscode.window.showInformationMessage('Saved mode "' + saved + '".');
    else vscode.window.showErrorMessage('Give the mode a valid name.');
    postState(); return;
  }
  if (m.type === 'deleteMode') { deleteCustomProfile(m.name); postState(); return; }
  if (m.type === 'install') { await doInstall(context); postState(); return; }
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
  .active-card .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--vscode-charts-green,#3fb950);margin-right:7px}
  .active-card .now{font-weight:600;font-size:1rem}
  .active-card .skills{margin-top:7px;display:flex;flex-wrap:wrap;gap:5px}
  .pill{font-size:11px;background:var(--vscode-badge-background,#333);color:var(--vscode-badge-foreground,#ccc);border-radius:10px;padding:2px 9px}
  .sklist{margin-top:8px}
  .skrow{padding:6px 0;border-top:1px solid var(--vscode-widget-border,#2a2a2a)}
  .skrow:first-child{border-top:0}
  .skrow .sh{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
  .skrow .sn{font-weight:600}
  .skrow .sn .ao{font-size:9px;color:var(--vscode-charts-blue,#4aa8d8);border:1px solid currentColor;border-radius:7px;padding:0 5px;margin-left:5px;text-transform:uppercase}
  .skrow .stk{color:var(--vscode-descriptionForeground);font-size:11px;white-space:nowrap;font-variant-numeric:tabular-nums}
  .skrow .sd{color:var(--vscode-descriptionForeground);font-size:11.5px;margin-top:1px;line-height:1.4}
  .extnote{margin-top:10px;padding-top:9px;border-top:1px dashed var(--vscode-widget-border,#2a2a2a)}
  .exthd{font-size:11px;color:var(--vscode-charts-green,#89d185);margin-bottom:5px}
  .extlist{display:flex;flex-wrap:wrap;gap:4px}
  .extpill{font-size:11px;padding:1px 7px;border-radius:9px;background:var(--vscode-badge-background,#2a2d2e);color:var(--vscode-badge-foreground,#ccc)}
  .powerbar{display:flex;gap:10px;align-items:center;padding:9px 11px;margin:10px 0;border:1px solid var(--vscode-widget-border,#333);border-radius:8px}
  .pswitch{position:relative;width:34px;height:20px;flex:none;cursor:pointer;display:inline-block}
  .pswitch input{position:absolute;opacity:0;width:0;height:0}
  .pswitch .track{position:absolute;inset:0;border-radius:999px;background:var(--vscode-input-background,#3a3a3a);border:1px solid var(--vscode-widget-border,#555);transition:.15s}
  .pswitch .knob{position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--vscode-descriptionForeground,#aaa);transition:.15s}
  .pswitch input:checked ~ .track{background:var(--vscode-charts-green,#3fa76a);border-color:transparent}
  .pswitch input:checked ~ .knob{left:17px;background:#fff}
  .pswitch input:focus-visible ~ .track{outline:2px solid var(--vscode-focusBorder,#5a9);outline-offset:1px}
  .powerbar .t b{color:var(--vscode-charts-green,#89d185)}
  #main.off .powerbar .t b{color:var(--vscode-descriptionForeground)}
  #main.off .hideWhenOff{display:none !important}
  .offbanner{padding:9px 11px;margin:0 0 12px;border-radius:8px;font-size:12.5px;line-height:1.5;background:var(--vscode-inputValidation-warningBackground,#3b2e1e);border:1px solid var(--vscode-inputValidation-warningBorder,#6b5424)}
  .mode{border:1px solid var(--vscode-widget-border,#3c3c3c);border-radius:8px;padding:10px 12px;margin-bottom:7px}
  .mode.on{border-color:var(--vscode-focusBorder,#0e639c)}
  .mode-top{display:flex;align-items:center;gap:10px}
  .mode-name{font-weight:600}
  .mode-top .cnt{color:var(--vscode-descriptionForeground);font-size:12px}
  .mode-top .badge{font-size:10px;color:var(--vscode-charts-green,#3fb950);border:1px solid currentColor;border-radius:8px;padding:0 7px}
  .mode-top .sp{margin-left:auto}
  button{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:0;border-radius:5px;padding:5px 13px;cursor:pointer;font-size:12px}
  button.sec{background:var(--vscode-button-secondaryBackground);color:var(--vscode-button-secondaryForeground)}
  button:hover{filter:brightness(1.12)}
  .linkbtn{background:none;color:var(--vscode-textLink-foreground,#4aa8d8);padding:4px 6px}
  .del{background:none;color:var(--vscode-descriptionForeground);padding:4px 6px;font-size:13px}
  .del:hover{color:var(--vscode-errorForeground,#e05561)}
  .mode-skills{margin-top:8px;padding-top:8px;border-top:1px solid var(--vscode-widget-border,#2a2a2a);color:var(--vscode-descriptionForeground);font-size:12px;line-height:1.7}
  details.builtins{margin-top:4px}
  details.builtins summary{cursor:pointer;color:var(--vscode-descriptionForeground);font-size:12px;padding:4px 0}
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
  <div class="muted">Load just the skills each task needs, on top of your current Bob mode.</div>

  <div class="powerbar">
    <label class="pswitch"><input type="checkbox" id="powerToggle" checked/><span class="track"></span><span class="knob"></span></label>
    <span><span class="t">SuperBob is <b id="powerState">on</b>.</span> <span class="muted">Its skills layer onto whichever Bob mode you're in; off runs plain Bob. Your own skills always stay.</span></span>
  </div>
  <div id="offbanner" class="offbanner" style="display:none">
    SuperBob is <b>off</b>, Bob runs with only your own skills. Turn it on to layer SuperBob's skills onto your current Bob mode, then start a new conversation.
  </div>

  <div class="hideWhenOff">
  <label class="autobar"><input type="checkbox" id="autoToggle"/><span><span class="t">Auto mode</span> <span class="muted">(recommended). SuperBob picks the right skills for each task.</span></span></label>

  <div class="active-card">
    <div><span class="dot"></span><span class="now" id="activeNow"></span></div>
    <div id="activeDesc"></div>
    <div class="skills" id="activeSkills"></div>
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
    <input type="text" id="bname" placeholder="Name it, e.g. sql_evals"/>
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

  <details class="help">
    <summary>❔ How to use SuperBob</summary>
    <div class="helpbody">
      <p>Pick a <b>kit</b> for what you're doing. SuperBob loads just those skills so the agent stays fast.</p>
      <ol>
        <li>Leave <b>Auto mode</b> on and SuperBob picks the skills for each task. That's the whole setup.</li>
        <li>Or turn Auto off and click a kit's <b>Use</b> button. Click <b>skills</b> to see what's inside and what it costs.</li>
        <li>Or, in the Bob chat, type <code>/superbob software_development</code> (or any kit). <code>/superbob</code> alone lists them.</li>
        <li>After switching, <b>start a new conversation</b> so the skills load.</li>
        <li>Use <b>+ Create your own kit</b> to save your own set of skills.</li>
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
  function skillRows(names){
    const d=document.createElement('div'); d.className='sklist';
    names.forEach(n=>{ const s=skillInfo(n); const core=S.core.includes(n);
      const r=document.createElement('div'); r.className='skrow';
      const desc=SHORT[n]||s.desc;
      r.innerHTML='<div class="sh"><span class="sn">'+n+(core?'<span class="ao">always on</span>':'')+'</span><span class="stk">'+fmtTok(s.tokens)+'</span></div>'+(desc?'<div class="sd">'+desc+'</div>':'');
      d.appendChild(r); });
    return d;
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
    if(off) return;   // nothing else to render while off
    const am=activeMode();
    // active card
    document.getElementById('activeNow').textContent = 'Active: ' + (am==='__lean__'?'Auto mode': am==='__custom__'?'custom set': (am||', '));
    document.getElementById('autoToggle').checked = (am==='__lean__');
    document.getElementById('activeDesc').textContent = (am && am!=='__custom__') ? descFor(am) : (am==='__custom__'?'A custom set of skills you picked.':'');
    const ext=new Set(S.external||[]);
    const extras=S.activeSet.filter(n=>!S.core.includes(n) && !ext.has(n));   // the mode's own skills
    const ordered=[...S.core, ...extras];   // superpowers + mission-control first (always on)
    const cont=document.getElementById('activeSkills'); cont.innerHTML='';
    cont.appendChild(skillRows(ordered));
    // The user's own skills, SuperBob never removes these on a mode switch.
    if(ext.size){
      const note=document.createElement('div'); note.className='extnote';
      note.innerHTML='<div class="exthd">Your own skills, kept through every kit ('+ext.size+')</div>'+
        '<div class="extlist">'+[...ext].map(n=>'<span class="extpill">'+n+'</span>').join('')+'</div>';
      cont.appendChild(note);
    }

    // your kits = the user's own (non-builtin) kits. Lean is the Auto/base state,
    // controlled by the Auto toggle and shown in the active card, so it is not a card here.
    const your=document.getElementById('yourModes'); your.innerHTML='';
    const mine=Object.keys(S.profiles).filter(p=>!S.builtin.includes(p));
    if(!mine.length){ your.innerHTML='<div class="muted" style="font-size:12px;padding:6px 0">No kits yet.</div>'; }
    mine.forEach(p=>{ your.appendChild(modeCard(p, p, S.profiles[p], am===p, true)); });
    // built-in modes
    const bi=document.getElementById('builtinModes'); bi.innerHTML='';
    S.builtin.forEach(p=>{ if(S.profiles[p]) bi.appendChild(modeCard(p, p, S.profiles[p], am===p, false)); });
    document.getElementById('builtinSummary').textContent='Starter kits (built-in · '+S.builtin.filter(p=>S.profiles[p]).length+')';
    // builder start-from options
    const bs=document.getElementById('bstart'); if(bs && bs.options.length===0){
      bs.innerHTML='<option value="">(blank, pick your own)</option>'+Object.keys(S.profiles).map(p=>'<option value="'+p+'">'+p+'</option>').join('');
    }
  }

  function modeCard(id,label,skills,isActive,deletable){
    const d=document.createElement('div'); d.className='mode'+(isActive?' on':'');
    const top=document.createElement('div'); top.className='mode-top';
    const count = id==='__lean__' ? 'essentials only' : skills.length+' skills';
    top.innerHTML='<span class="mode-name">'+label+'</span> <span class="cnt">'+count+'</span>'+(isActive?' <span class="badge">active</span>':'');
    const sp=document.createElement('span'); sp.className='sp';
    // Active Lean needs no button: it's the base state, and the "active" badge already
    // shows it. A disabled "On" button just looks broken (you click it and nothing happens).
    if(isActive && id==='__lean__'){ /* badge only */ }
    else {
      const use=document.createElement('button');
      if(isActive){ use.textContent='Unload'; use.title='turn this kit off (back to Auto)'; use.onclick=()=>vscode.postMessage({type:'applyLean'}); }
      else { use.textContent='Use'; use.onclick=()=> vscode.postMessage(id==='__lean__'?{type:'applyLean'}:{type:'applyProfile',name:id}); }
      sp.appendChild(use);
    }
    if(id!=='__lean__'){ const sk=document.createElement('button'); sk.className='linkbtn'; sk.textContent='skills';
      sk.onclick=()=>{ const el=d.querySelector('.mode-skills'); el.style.display = el.style.display==='none'?'block':'none'; }; sp.appendChild(sk); }
    if(deletable){ const del=document.createElement('button'); del.className='del'; del.textContent='🗑'; del.title='delete this kit';
      del.onclick=()=> vscode.postMessage({type:'deleteMode',name:id}); sp.appendChild(del); }
    top.appendChild(sp); d.appendChild(top);
    const md=document.createElement('div'); md.className='mode-desc'; md.textContent=descFor(id); d.appendChild(md);
    if(id!=='__lean__'){ const s=document.createElement('div'); s.className='mode-skills'; s.style.display='none';
      s.appendChild(skillRows(skills)); d.appendChild(s); }
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
    if(e.target.id==='createBtn') openBuilder();
    if(e.target.id==='bcancel') closeBuilder();
    if(e.target.id==='installBtn') vscode.postMessage({type:'install'});
    if(e.target.id==='docsBtn') vscode.postMessage({type:'openDocs'});
    if(e.target.id==='bsave'){ const name=document.getElementById('bname').value; vscode.postMessage({type:'saveMode',name:name,desc:document.getElementById('bdesc').value,skills:[...sel]}); closeBuilder(); }
  });
  document.addEventListener('input',e=>{ if(e.target.id==='bsearch') renderBuilder(); });
  document.addEventListener('change',e=>{ if(e.target.id==='autoToggle'){ if(e.target.checked) vscode.postMessage({type:'applyLean'}); }
    if(e.target.id==='powerToggle'){ vscode.postMessage({type:'setPower', on:e.target.checked}); }
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
          applyProfile([]);
          if (bk) log('Bob skills backed up to ' + bk);
        }
      } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
    }
  );
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
    }),
    vscode.commands.registerCommand('superBobSkills.installCrg', () => {
      // code-review-graph is an MCP TOOL (not a skill). Run the bundled deploy
      // script in a terminal so the user sees the pip/uv install + MCP registration.
      const script = path.join(context.extensionPath, 'deploy-code-review-graph.sh');
      const term = vscode.window.createTerminal('SuperBob, code-review-graph');
      term.show();
      term.sendText('bash "' + script + '"');
      vscode.window.showInformationMessage('Installing code-review-graph, watch the terminal. Restart Bob when it finishes.');
    })
  );

  if (!fs.existsSync(BOB_VAULT)) {
    vscode.window.showInformationMessage('SuperBob is ready to install into Bob / VS Code.', 'Install now')
      .then(choice => { if (choice === 'Install now') doInstall(context); });
  }
}
function deactivate() {}
module.exports = { activate, deactivate };
