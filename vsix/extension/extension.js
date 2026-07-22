// SuperBob — installs best-practice skills into VS Code-compatible IDEs (IBM Bob, VS Code).
//
// A VS Code extension cannot "register" agent skills — skills are SKILL.md files that
// Bob and Claude Code read from disk folders (~/.bob/skills, ~/.claude/skills). So this
// extension is an INSTALLER + CONTROL PANEL: it unpacks the bundled library into those
// folders and swaps skill profiles from the command palette to keep context small.

const vscode = require('vscode');
const cp = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const HOME = os.homedir();
const BOB_VAULT = path.join(HOME, '.bob', 'skills-vault');
const BOB_ACTIVE = path.join(HOME, '.bob', 'skills');
const BOB_PROFILES = path.join(HOME, '.bob', 'profiles');
const CLAUDE_SKILLS = path.join(HOME, '.claude', 'skills');

let statusItem;

function log(msg) { console.log('[skills-library] ' + msg); }

function unzip(zipPath, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  // macOS/Linux ship `unzip`. Keeps the extension dependency-free.
  cp.execFileSync('unzip', ['-o', '-q', zipPath, '-d', destDir], { stdio: 'ignore' });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function backupIfPresent(dir) {
  if (fs.existsSync(dir) && fs.readdirSync(dir).length > 0) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const bk = dir + '-backup-' + stamp;
    fs.cpSync(dir, bk, { recursive: true });
    return bk;
  }
  return null;
}

function profileNames() {
  if (!fs.existsSync(BOB_PROFILES)) return [];
  return fs.readdirSync(BOB_PROFILES)
    .filter(f => f.endsWith('.txt') && f !== '_core.txt')
    .map(f => f.replace(/\.txt$/, ''));
}

function readList(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
}

// Copy the given profile(s) + always-on core from the vault into the active dir.
function applyProfile(names) {
  if (!fs.existsSync(BOB_VAULT)) {
    vscode.window.showErrorMessage('SuperBob: not installed yet. Run "Install / Update Skills" first.');
    return false;
  }
  const wanted = new Set(readList(path.join(BOB_PROFILES, '_core.txt')));
  for (const n of names) readList(path.join(BOB_PROFILES, n + '.txt')).forEach(s => wanted.add(s));

  const staged = [];
  for (const skill of wanted) {
    const src = path.join(BOB_VAULT, skill);
    if (fs.existsSync(src)) staged.push(skill);
  }
  if (staged.length < 5) {
    vscode.window.showErrorMessage('SuperBob: only ' + staged.length + ' skills resolved — aborting, nothing changed.');
    return false;
  }
  fs.rmSync(BOB_ACTIVE, { recursive: true, force: true });
  fs.mkdirSync(BOB_ACTIVE, { recursive: true });
  for (const skill of staged) copyDir(path.join(BOB_VAULT, skill), path.join(BOB_ACTIVE, skill));
  fs.writeFileSync(path.join(BOB_ACTIVE, '.profile'), 'core + ' + names.join(' '));
  updateStatus();
  return true;
}

function activeProfile() {
  const f = path.join(BOB_ACTIVE, '.profile');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim() : null;
}

function updateStatus() {
  if (!statusItem) return;
  const p = activeProfile();
  if (p) { statusItem.text = '$(list-unordered) SuperBob: ' + p; statusItem.show(); }
  else { statusItem.text = '$(list-unordered) SuperBob: not installed'; statusItem.show(); }
}

async function doInstall(context) {
  const target = vscode.workspace.getConfiguration('skillsLibrary').get('targets', 'both');
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
          for (const f of fs.readdirSync(path.join(pkg, 'profiles'))) {
            fs.copyFileSync(path.join(pkg, 'profiles', f), path.join(BOB_PROFILES, f));
          }
          applyProfile(['code']);
          if (bk) log('Bob skills backed up to ' + bk);
        }

        if (target === 'both' || target === 'claude') {
          progress.report({ message: 'VS Code (~/.claude/skills)' });
          backupIfPresent(CLAUDE_SKILLS);
          fs.mkdirSync(CLAUDE_SKILLS, { recursive: true });
          fs.cpSync(skillsSrc, CLAUDE_SKILLS, { recursive: true });
          fs.mkdirSync(path.join(CLAUDE_SKILLS, 'mission-control'), { recursive: true });
          fs.copyFileSync(claudeMeta, path.join(CLAUDE_SKILLS, 'mission-control', 'SKILL.md'));
        }
      } finally {
        fs.rmSync(tmp, { recursive: true, force: true });
      }
    }
  );
  updateStatus();
  vscode.window.showInformationMessage(
    'SuperBob installed (' + target + '). Restart Bob / start a new VS Code session so skills load.'
  );
}

async function doLoadProfile() {
  const names = profileNames();
  if (names.length === 0) {
    vscode.window.showErrorMessage('SuperBob: no profiles found. Run "Install / Update Skills" first.');
    return;
  }
  const pick = await vscode.window.showQuickPick(names, { placeHolder: 'Load which skill profile? (keeps Bob context small)' });
  if (!pick) return;
  if (applyProfile([pick])) {
    vscode.window.showInformationMessage(
      'Loaded profile "' + pick + '". Restart the Bob conversation for it to take effect.'
    );
  }
}

function activate(context) {
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusItem.command = 'skillsLibrary.loadProfile';
  statusItem.tooltip = 'SuperBob — click to switch profile';
  context.subscriptions.push(statusItem);
  updateStatus();

  context.subscriptions.push(
    vscode.commands.registerCommand('skillsLibrary.install', () => doInstall(context)),
    vscode.commands.registerCommand('skillsLibrary.loadProfile', () => doLoadProfile()),
    vscode.commands.registerCommand('skillsLibrary.status', () => {
      const p = activeProfile();
      vscode.window.showInformationMessage(p ? 'Active Bob profile: ' + p : 'SuperBob not installed yet.');
    })
  );

  // First run: offer to install if nothing is there yet.
  if (!fs.existsSync(BOB_VAULT) && !fs.existsSync(CLAUDE_SKILLS)) {
    vscode.window.showInformationMessage(
      'SuperBob is ready to install into Bob / VS Code.',
      'Install now'
    ).then(choice => { if (choice === 'Install now') doInstall(context); });
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
