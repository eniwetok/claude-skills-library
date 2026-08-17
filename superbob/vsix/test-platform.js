// Dynamic cross-platform test: actually RUN the platform-specific functions from
// extension.js under both win32 and darwin (via Node's path.win32/path.posix and a
// stubbed child_process) and assert each chooses the Windows-safe or POSIX command.
const fs = require('fs'), path = require('path'), os = require('os'), vm = require('vm');
const SRC = fs.readFileSync(path.join(__dirname, 'extension', 'extension.js'), 'utf8');

function fnBody(name) {
  const start = SRC.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('function not found: ' + name);
  let i = SRC.indexOf('{', start), depth = 0, j = i;
  for (; j < SRC.length; j++) { const c = SRC[j]; if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) { j++; break; } } }
  return SRC.slice(start, j);
}
// run `defs` (function definitions) then evaluate callExpr, under a chosen platform.
// cp calls are captured; commands in failCmds throw (to exercise fallbacks).
function run(defs, platform, pathMod, callExpr, failCmds) {
  const calls = [];
  const rec = (cmd) => { calls.push(String(cmd)); if ((failCmds || []).some(f => String(cmd).includes(f))) throw new Error('stub-fail'); return ''; };
  const cp = { execFileSync: (cmd, args) => rec(cmd + (args ? ' ' + args.join(' ') : '')), execSync: (cmd) => rec(cmd), exec: (cmd, o, cb) => { rec(cmd); cb && cb(null, '', ''); } };
  const ctx = { process: { platform }, cp, os, JSON, console, path: pathMod, fs: { mkdirSync() {}, existsSync() { return false; } }, result: undefined };
  vm.createContext(ctx);
  vm.runInContext(defs + '\n; result = (' + callExpr + ');', ctx, { timeout: 2000 });
  return { result: ctx.result, calls };
}

let pass = 0, fail = 0;
const P = (n, c, extra) => { c ? pass++ : fail++; console.log((c ? '  \u2705 ' : '  \u274c ') + n + (extra && !c ? '  -> ' + extra : '')); };
const some = (calls, s) => calls.some(c => c.includes(s));

// ---- loginShell ----
let r = run(fnBody('loginShell'), 'win32', path.win32, "loginShell('npm install -g x')");
P('loginShell(win32) runs raw command, no /bin/zsh', r.result === 'npm install -g x', r.result);
r = run(fnBody('loginShell'), 'darwin', path.posix, "loginShell('npm install -g x')");
P('loginShell(darwin) wraps in /bin/zsh -lc', /\/bin\/zsh -lc/.test(r.result), r.result);

// ---- unzip ----
r = run(fnBody('unzip'), 'win32', path.win32, "unzip('a.zip','out')");
P('unzip(win32) uses tar, never the POSIX unzip', some(r.calls, 'tar ') && !some(r.calls, 'unzip'), r.calls.join('|'));
r = run(fnBody('unzip'), 'win32', path.win32, "unzip('a.zip','out')", ['tar ']);
P('unzip(win32) falls back to PowerShell when tar missing', some(r.calls, 'powershell') && !some(r.calls, 'unzip'), r.calls.join('|'));
r = run(fnBody('unzip'), 'darwin', path.posix, "unzip('a.zip','out')");
P('unzip(darwin) uses unzip, not powershell/tar', some(r.calls, 'unzip') && !some(r.calls, 'powershell'), r.calls.join('|'));

// ---- cliInstalled ----
r = run(fnBody('loginShell') + fnBody('cliInstalled'), 'win32', path.win32, "cliInstalled('node')");
P('cliInstalled(win32) uses `where`', some(r.calls, 'where node'), r.calls.join('|'));
r = run(fnBody('loginShell') + fnBody('cliInstalled'), 'darwin', path.posix, "cliInstalled('node')");
P('cliInstalled(darwin) uses `command -v` via zsh', some(r.calls, 'command -v node') && some(r.calls, '/bin/zsh'), r.calls.join('|'));

// ---- agent-locations glob (forward slashes on every OS) ----
const winLoc = run('', 'win32', path.win32, "'C:\\\\Users\\\\x\\\\.bob\\\\subagents'.split(path.sep).join('/') + '/*.md'").result;
P('agent glob(win32) is forward-slash, no backslash', winLoc === 'C:/Users/x/.bob/subagents/*.md', winLoc);
const macLoc = run('', 'darwin', path.posix, "'/Users/x/.bob/subagents'.split(path.sep).join('/') + '/*.md'").result;
P('agent glob(darwin) is forward-slash', macLoc === '/Users/x/.bob/subagents/*.md', macLoc);

console.log('\n' + (fail ? 'FAILED: ' + fail + ' / ' + (pass + fail) : 'ALL ' + pass + ' CROSS-PLATFORM TESTS PASS'));
process.exit(fail ? 1 : 0);
