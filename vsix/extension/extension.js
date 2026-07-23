// SuperBob — installs best-practice skills into VS Code-compatible IDEs (IBM Bob, VS Code).
//
// A VS Code extension cannot "register" agent skills — skills are SKILL.md files that
// the agent reads from disk folders (~/.bob/skills, ~/.claude/skills). So this extension
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
const CLAUDE_VAULT = path.join(HOME, '.claude', 'skills-vault');
const CLAUDE_SKILLS = path.join(HOME, '.claude', 'skills');

// Lean mode: only these two skills stay loaded; mission-control routes to the rest
// from the vault on demand. Keeps starting context tiny (~200 tokens vs ~67,000).
const CORE = ['mission-control', 'using-superpowers'];
const BUILTIN = ['code', 'data', 'pm', 'security', 'ui', 'research'];

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

// ---- apply / save / delete -------------------------------------------------
function applySkillSet(skillNames, label) {
  if (!fs.existsSync(BOB_VAULT)) { vscode.window.showErrorMessage('SuperBob: not installed yet.'); return false; }
  const wanted = new Set(CORE);
  for (const n of skillNames) wanted.add(n);
  const staged = [...wanted].filter(s => fs.existsSync(path.join(BOB_VAULT, s)));
  if (staged.length < CORE.length) { vscode.window.showErrorMessage('SuperBob: nothing to load — aborted.'); return false; }
  fs.rmSync(BOB_ACTIVE, { recursive: true, force: true });
  fs.mkdirSync(BOB_ACTIVE, { recursive: true });
  for (const s of staged) copyDir(path.join(BOB_VAULT, s), path.join(BOB_ACTIVE, s));
  fs.writeFileSync(path.join(BOB_ACTIVE, '.profile'), label);
  updateStatus();
  return true;
}
function applyProfile(names) {
  const skills = [];
  for (const n of names) readList(path.join(BOB_PROFILES, n + '.txt')).forEach(s => skills.push(s));
  return applySkillSet(skills, names.length ? 'core + ' + names.join(' ') : 'lean (core only)');
}
function saveCustomProfile(name, skills) {
  const clean = name.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  if (!clean) return null;
  fs.mkdirSync(BOB_PROFILES, { recursive: true });
  const body = skills.filter(s => !CORE.includes(s)).join('\n') + '\n';
  fs.writeFileSync(path.join(BOB_PROFILES, clean + '.txt'), body);
  return clean;
}
function deleteCustomProfile(name) {
  if (BUILTIN.includes(name)) return false;   // never delete built-ins
  const f = path.join(BOB_PROFILES, name + '.txt');
  if (fs.existsSync(f)) { fs.unlinkSync(f); return true; }
  return false;
}

function updateStatus() {
  if (!statusItem) return;
  const p = activeProfile();
  statusItem.text = '$(rocket) SuperBob: ' + (p || 'not installed');
  statusItem.show();
  if (panel) postState();
}

// ---- the control panel (webview) ------------------------------------------
function postState() {
  if (!panel) return;
  const skills = listVaultSkills();
  const profs = {};
  for (const p of profileNames()) profs[p] = readList(path.join(BOB_PROFILES, p + '.txt'));
  panel.webview.postMessage({
    type: 'state',
    installed: fs.existsSync(BOB_VAULT),
    active: activeProfile(),
    activeSet: activeSkillSet(),
    core: CORE,
    builtin: BUILTIN,
    profiles: profs,
    skills
  });
}
function openPanel(context) {
  if (panel) { panel.reveal(); return; }
  panel = vscode.window.createWebviewPanel('superbob', 'SuperBob — Skills', vscode.ViewColumn.One, { enableScripts: true, retainContextWhenHidden: true });
  panel.onDidDispose(() => { panel = null; }, null, context.subscriptions);
  panel.webview.html = getWebviewHtml();
  panel.webview.onDidReceiveMessage(async (m) => {
    if (m.type === 'ready') { postState(); return; }
    if (m.type === 'applyProfile') {
      if (applyProfile([m.name])) vscode.window.showInformationMessage('Loaded "' + m.name + '". Restart the conversation to apply.');
      postState(); return;
    }
    if (m.type === 'applyLean') { applyProfile([]); vscode.window.showInformationMessage('Lean mode loaded (core only). Restart the conversation.'); postState(); return; }
    if (m.type === 'applyCustom') {
      if (applySkillSet(m.skills, 'custom (' + m.skills.length + ' skills)')) vscode.window.showInformationMessage('Custom set applied (' + (m.skills.length + CORE.length) + ' skills). Restart the conversation.');
      postState(); return;
    }
    if (m.type === 'saveMode') {
      const saved = saveCustomProfile(m.name, m.skills);
      if (saved) vscode.window.showInformationMessage('Saved mode "' + saved + '". It is now in your mode list.');
      else vscode.window.showErrorMessage('Give the mode a valid name.');
      postState(); return;
    }
    if (m.type === 'deleteMode') { deleteCustomProfile(m.name); postState(); return; }
    if (m.type === 'install') { await doInstall(context); postState(); return; }
  }, null, context.subscriptions);
}

function getWebviewHtml() {
  const nonce = 'sb' + Date.now();
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';"/>
<style>
  body{font-family:var(--vscode-font-family);color:var(--vscode-foreground);padding:14px 18px;font-size:13px}
  h2{font-size:1.05rem;margin:18px 0 6px}
  .muted{color:var(--vscode-descriptionForeground)}
  .meter{display:flex;align-items:center;gap:10px;margin:2px 0 14px}
  .bar{flex:0 0 200px;height:7px;border-radius:4px;background:var(--vscode-editorWidget-background);overflow:hidden}
  .fill{height:100%;background:var(--vscode-charts-green,#3fb950);width:0%}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 4px}
  .chip{border:1px solid var(--vscode-widget-border,#3c3c3c);background:var(--vscode-button-secondaryBackground,#33333a);color:var(--vscode-button-secondaryForeground,#ccc);border-radius:14px;padding:5px 12px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:6px}
  .chip:hover{filter:brightness(1.15)}
  .chip.active{background:var(--vscode-button-background,#0e639c);color:var(--vscode-button-foreground,#fff);border-color:transparent}
  .chip .x{opacity:.7;font-weight:700}
  .chip .x:hover{opacity:1}
  .toolbar{display:flex;gap:8px;align-items:center;margin:8px 0;flex-wrap:wrap}
  input[type=text]{background:var(--vscode-input-background);color:var(--vscode-input-foreground);border:1px solid var(--vscode-input-border,#3c3c3c);border-radius:4px;padding:6px 9px;font-size:13px}
  select{background:var(--vscode-dropdown-background);color:var(--vscode-dropdown-foreground);border:1px solid var(--vscode-dropdown-border,#3c3c3c);border-radius:4px;padding:6px 8px;font-size:12px}
  #search{flex:1;min-width:180px}
  button.act{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:0;border-radius:4px;padding:6px 14px;cursor:pointer;font-size:13px}
  button.act.sec{background:var(--vscode-button-secondaryBackground);color:var(--vscode-button-secondaryForeground)}
  button.act:hover{filter:brightness(1.1)}
  .list{border:1px solid var(--vscode-widget-border,#3c3c3c);border-radius:6px;max-height:46vh;overflow:auto;margin-top:8px}
  .row{display:flex;gap:10px;align-items:flex-start;padding:7px 11px;border-bottom:1px solid var(--vscode-widget-border,#2a2a2a)}
  .row:last-child{border-bottom:0}
  .row:hover{background:var(--vscode-list-hoverBackground)}
  .row.locked{opacity:.8}
  .row input{margin-top:2px}
  .nm{font-weight:600}
  .nm .core{font-size:10px;color:var(--vscode-charts-blue,#4aa8d8);border:1px solid currentColor;border-radius:8px;padding:0 6px;margin-left:6px}
  .dsc{color:var(--vscode-descriptionForeground);font-size:12px;margin-top:1px}
  .tags{margin-top:3px}
  .tag{font-size:10px;color:var(--vscode-descriptionForeground);border:1px solid var(--vscode-widget-border,#3c3c3c);border-radius:8px;padding:0 6px;margin-right:4px}
  .tok{margin-left:auto;color:var(--vscode-descriptionForeground);font-variant-numeric:tabular-nums;font-size:11px;white-space:nowrap}
  .empty{padding:22px;text-align:center}
</style></head><body>
<div id="app">
  <div id="notinstalled" class="empty" style="display:none">
    <p>SuperBob isn't installed yet.</p>
    <button class="act" id="installBtn">Install skills</button>
  </div>
  <div id="main" style="display:none">
    <h2>Mode</h2>
    <div class="muted" id="activeLine">—</div>
    <div class="meter"><span class="muted">context</span><div class="bar"><div class="fill" id="fill"></div></div><span id="tok" class="muted"></span></div>
    <div class="chips" id="modeChips"></div>

    <h2>Build / adjust a mode</h2>
    <div class="muted">Tick skills to activate them. The two core skills are always on. Apply now, or save your selection as a reusable mode.</div>
    <div class="toolbar">
      <input type="text" id="search" placeholder="Filter skills…"/>
      <select id="sort" title="Sort skills">
        <option value="cost">Context: heaviest first</option>
        <option value="cost-asc">Context: lightest first</option>
        <option value="name">Name (A–Z)</option>
      </select>
      <span class="muted" id="selCount"></span>
    </div>
    <div class="toolbar">
      <button class="act" id="applyBtn">Apply selection now</button>
      <button class="act sec" id="saveBtn">Save as mode…</button>
      <input type="text" id="modeName" placeholder="new mode name" style="max-width:150px"/>
      <button class="act sec" id="clearBtn">Clear</button>
    </div>
    <div class="list" id="list"></div>
    <p class="muted">After applying, <b>restart the Bob / VS Code conversation</b> so it re-reads the skills. Changes apply to your IBM Bob skill set.</p>
  </div>
</div>
<script nonce="${nonce}">
  const vscode = acquireVsCodeApi();
  let S = null, selected = new Set();
  vscode.postMessage({type:'ready'});
  window.addEventListener('message', e => { if (e.data.type==='state'){ S=e.data; render(); }});

  const TOK={}; // name -> tokens, rebuilt on each state
  function fmt(t){ return t>=1000 ? '~'+(t/1000).toFixed(1)+'k' : '~'+t+'t'; }
  function tokOf(n){ return TOK[n]||60; }
  function coreCost(){ return S.core.reduce((a,n)=>a+tokOf(n),0); }
  function modeCost(skills){ return coreCost() + skills.filter(n=>!S.core.includes(n)).reduce((a,n)=>a+tokOf(n),0); }
  function estTotal(){ let t=coreCost(); selected.forEach(n=>{ if(!S.core.includes(n)) t+=tokOf(n); }); return t; }
  function render(){
    document.getElementById('notinstalled').style.display = S.installed?'none':'block';
    document.getElementById('main').style.display = S.installed?'block':'none';
    if(!S.installed) return;
    S.skills.forEach(s=>TOK[s.name]=s.tokens);
    document.getElementById('activeLine').textContent = 'Active: ' + (S.active||'—');
    // seed selection from active set on first load
    if(selected.size===0 && S.activeSet.length) S.activeSet.forEach(n=>{ if(!S.core.includes(n)) selected.add(n); });
    // mode chips — each shows the context cost it brings
    const chips = document.getElementById('modeChips'); chips.innerHTML='';
    const mk=(label,onclick,extra)=>{const c=document.createElement('span');c.className='chip'+(extra||'');c.onclick=onclick;c.innerHTML=label;return c;};
    chips.appendChild(mk('⚡ Lean <span class="muted">'+fmt(coreCost())+'</span>', ()=>vscode.postMessage({type:'applyLean'})));
    Object.keys(S.profiles).forEach(p=>{
      const isB = S.builtin.includes(p);
      const c = mk(p+' <span class="muted">('+S.profiles[p].length+' · '+fmt(modeCost(S.profiles[p]))+')</span>', ()=>vscode.postMessage({type:'applyProfile',name:p}));
      if(!isB){ const x=document.createElement('span'); x.className='x'; x.textContent='✕'; x.title='delete mode';
        x.onclick=(ev)=>{ev.stopPropagation(); vscode.postMessage({type:'deleteMode',name:p});}; c.appendChild(x); }
      chips.appendChild(c);
    });
    renderList(); updateMeter();
  }
  function renderList(){
    const q=(document.getElementById('search').value||'').toLowerCase();
    const sort=document.getElementById('sort').value;
    const list=document.getElementById('list'); list.innerHTML='';
    const rows=S.skills.slice();
    if(sort==='cost') rows.sort((a,b)=>b.tokens-a.tokens || a.name.localeCompare(b.name));
    else if(sort==='cost-asc') rows.sort((a,b)=>a.tokens-b.tokens || a.name.localeCompare(b.name));
    else rows.sort((a,b)=>a.name.localeCompare(b.name));
    rows.forEach(s=>{
      if(q && !(s.name.toLowerCase().includes(q)||(s.desc||'').toLowerCase().includes(q))) return;
      const row=document.createElement('div'); row.className='row'+(s.core?' locked':'');
      const cb=document.createElement('input'); cb.type='checkbox';
      cb.checked = s.core || selected.has(s.name); cb.disabled = s.core;
      cb.onchange=()=>{ if(cb.checked) selected.add(s.name); else selected.delete(s.name); updateMeter(); };
      const mid=document.createElement('div'); mid.style.flex='1';
      mid.innerHTML='<div class="nm">'+s.name+(s.core?'<span class="core">always on</span>':'')+'</div>'+
                    (s.desc?'<div class="dsc">'+s.desc+'</div>':'')+
                    (s.inProfiles&&s.inProfiles.length?'<div class="tags">'+s.inProfiles.map(p=>'<span class="tag">'+p+'</span>').join('')+'</div>':'');
      const tok=document.createElement('div'); tok.className='tok'; tok.textContent=fmt(s.tokens);
      row.appendChild(cb); row.appendChild(mid); row.appendChild(tok); list.appendChild(row);
    });
  }
  function updateMeter(){
    const t=estTotal(); const pct=Math.min(100,(t/67000*100));
    document.getElementById('fill').style.width=pct.toFixed(1)+'%';
    document.getElementById('tok').textContent='~'+t.toLocaleString()+' / 67,000 tokens';
    document.getElementById('selCount').textContent=(selected.size+S.core.length)+' skills selected';
  }
  document.getElementById('search').addEventListener('input', renderList);
  document.getElementById('sort').addEventListener('change', renderList);
  document.getElementById('applyBtn').onclick=()=>vscode.postMessage({type:'applyCustom',skills:[...selected]});
  document.getElementById('saveBtn').onclick=()=>{const n=document.getElementById('modeName').value; vscode.postMessage({type:'saveMode',name:n,skills:[...selected]});};
  document.getElementById('clearBtn').onclick=()=>{selected.clear(); renderList(); updateMeter();};
  const ib=document.getElementById('installBtn'); if(ib) ib.onclick=()=>vscode.postMessage({type:'install'});
</script></body></html>`;
}

// ---- install (unchanged behaviour) ----------------------------------------
async function doInstall(context) {
  const target = vscode.workspace.getConfiguration('superBobSkills').get('targets', 'both');
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
        const claudeMeta = path.join(pkg, 'meta', 'mission-control.claude.md');
        if (target === 'both' || target === 'bob') {
          progress.report({ message: 'IBM Bob' });
          const bk = backupIfPresent(BOB_ACTIVE);
          fs.mkdirSync(BOB_VAULT, { recursive: true });
          fs.cpSync(skillsSrc, BOB_VAULT, { recursive: true });
          fs.mkdirSync(path.join(BOB_VAULT, 'mission-control'), { recursive: true });
          fs.copyFileSync(bobMeta, path.join(BOB_VAULT, 'mission-control', 'SKILL.md'));
          fs.mkdirSync(BOB_PROFILES, { recursive: true });
          for (const f of fs.readdirSync(path.join(pkg, 'profiles'))) fs.copyFileSync(path.join(pkg, 'profiles', f), path.join(BOB_PROFILES, f));
          applyProfile([]);
          if (bk) log('Bob skills backed up to ' + bk);
        }
        if (target === 'both' || target === 'claude') {
          progress.report({ message: 'VS Code (~/.claude/skills)' });
          const bk = backupIfPresent(CLAUDE_SKILLS);
          fs.rmSync(CLAUDE_VAULT, { recursive: true, force: true });
          fs.mkdirSync(CLAUDE_VAULT, { recursive: true });
          fs.cpSync(skillsSrc, CLAUDE_VAULT, { recursive: true });
          fs.mkdirSync(path.join(CLAUDE_VAULT, 'mission-control'), { recursive: true });
          fs.copyFileSync(claudeMeta, path.join(CLAUDE_VAULT, 'mission-control', 'SKILL.md'));
          fs.rmSync(CLAUDE_SKILLS, { recursive: true, force: true });
          fs.mkdirSync(CLAUDE_SKILLS, { recursive: true });
          for (const skill of CORE) { const src = path.join(CLAUDE_VAULT, skill); if (fs.existsSync(src)) copyDir(src, path.join(CLAUDE_SKILLS, skill)); }
          if (bk) log('VS Code skills backed up to ' + bk);
        }
      } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
    }
  );
  updateStatus();
  vscode.window.showInformationMessage('SuperBob installed (' + target + '). Restart Bob / start a new VS Code session so skills load.');
}

async function doLoadProfile() {
  const names = profileNames();
  if (!names.length) { vscode.window.showErrorMessage('SuperBob: no profiles found. Run "Install / Update Skills" first.'); return; }
  const pick = await vscode.window.showQuickPick(['lean (core only)', ...names], { placeHolder: 'Load which mode?' });
  if (!pick) return;
  const ok = pick.startsWith('lean') ? applyProfile([]) : applyProfile([pick]);
  if (ok) vscode.window.showInformationMessage('Loaded "' + pick + '". Restart the conversation to apply.');
}

function activate(context) {
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusItem.command = 'superBobSkills.openPanel';
  statusItem.tooltip = 'SuperBob — open the skills control panel';
  context.subscriptions.push(statusItem);
  updateStatus();

  context.subscriptions.push(
    vscode.commands.registerCommand('superBobSkills.openPanel', () => openPanel(context)),
    vscode.commands.registerCommand('superBobSkills.install', () => doInstall(context)),
    vscode.commands.registerCommand('superBobSkills.loadProfile', () => doLoadProfile()),
    vscode.commands.registerCommand('superBobSkills.status', () => {
      const p = activeProfile();
      vscode.window.showInformationMessage(p ? 'Active mode: ' + p : 'SuperBob not installed yet.');
    })
  );

  if (!fs.existsSync(BOB_VAULT) && !fs.existsSync(CLAUDE_SKILLS)) {
    vscode.window.showInformationMessage('SuperBob is ready to install into Bob / VS Code.', 'Install now')
      .then(choice => { if (choice === 'Install now') doInstall(context); });
  }
}
function deactivate() {}
module.exports = { activate, deactivate };
