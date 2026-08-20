// Platform-compatibility gate: the extension must run on Windows as well as macOS/Linux.
// Bob's shell has no /bin/zsh on Windows, no `unzip`, and its glob matcher wants forward
// slashes. This scans extension.js for the known anti-patterns and fails the build if any
// reappear. Runs on macOS in CI, but validates the Windows code paths statically.
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'extension', 'extension.js'), 'utf8');
const lines = src.split('\n');
const fails = [];

// helper: extract a top-level function body by brace matching
function fnBody(name) {
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) return '';
  let i = src.indexOf('{', start), depth = 0, j = i;
  for (; j < src.length; j++) { const c = src[j]; if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) { j++; break; } } }
  return src.slice(start, j);
}

// 1) any line using /bin/zsh must also branch on process.platform
lines.forEach((l, i) => { if (l.includes('/bin/zsh') && !l.includes('process.platform')) fails.push((i + 1) + ': /bin/zsh not guarded by a process.platform check'); });

// 2) unzip() must have a win32 branch (so bare `unzip` only runs off-Windows)
if (/execFileSync\('unzip'/.test(src)) {
  if (!/win32/.test(fnBody('unzip'))) fails.push("unzip(): calls the POSIX `unzip` command with no win32 branch");
}

// 3) cliInstalled() must detect CLIs the Windows way (where) too
if (!/win32/.test(fnBody('cliInstalled'))) fails.push("cliInstalled(): no Windows (`where`) detection branch");

// 4) the agent-locations glob written into Bob's settings must be forward-slash (path.join gives backslashes on Windows)
if (/OUR_AGENT_LOC\s*=\s*path\.join\([^)]*\*/.test(src)) fails.push("OUR_AGENT_LOC: built with path.join+glob -> backslashes on Windows; normalize to '/'");

// 5) any /Applications existsSync must be guarded to darwin
lines.forEach((l, i) => { if (/fs\.existsSync\('\/Applications/.test(l) && !/darwin/.test(l)) fails.push((i + 1) + ': /Applications path not guarded to darwin'); });

// 6) no raw /tmp (must use os.tmpdir())
lines.forEach((l, i) => { if (/['"`]\/tmp[\/'"`]/.test(l) && !l.trim().startsWith('//')) fails.push((i + 1) + ': raw /tmp path (use os.tmpdir())'); });

// 7) no OS-specific file/URL openers shelled out (macOS `open`, Linux `xdg-open`, Windows `start`/`explorer`).
//    Use vscode.env.openExternal or the `vscode.open` command instead.
lines.forEach((l, i) => { if (/cp\.(exec|execSync|execFile|execFileSync)\(\s*['"`](open|start|xdg-open|explorer)['"` ]/.test(l)) fails.push((i + 1) + ': OS-specific opener shelled out (use vscode.env.openExternal / the vscode.open command)'); });

if (fails.length) { console.log('PLATFORM CHECK FAILED:'); fails.forEach(f => console.log('  ❌ ' + f)); process.exit(1); }
console.log('PLATFORM CHECKS PASS (Windows/macOS/Linux safe)');
