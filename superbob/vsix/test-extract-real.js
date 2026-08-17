// Real-OS extraction test: run the ACTUAL unzip() code from extension.js on THIS
// operating system against a committed fixture zip, and assert the file comes out.
// Simulated tests prove branch selection; only this proves that the chosen tool
// (tar/PowerShell on Windows, unzip on macOS/Linux) really extracts our zip.
const fs = require('fs'), path = require('path'), os = require('os'), vm = require('vm'), cp = require('child_process');
const SRC = fs.readFileSync(path.join(__dirname, 'extension', 'extension.js'), 'utf8');
function fnBody(name) {
  const start = SRC.indexOf('function ' + name + '(');
  let i = SRC.indexOf('{', start), depth = 0, j = i;
  for (; j < SRC.length; j++) { const c = SRC[j]; if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) { j++; break; } } }
  return SRC.slice(start, j);
}
const fixture = path.join(__dirname, 'test-fixtures', 'tiny.zip');
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-extract-'));
try {
  const ctx = { process, cp, fs, os, path, JSON, console };
  vm.createContext(ctx);
  vm.runInContext(fnBody('unzip') + '\n; unzip(' + JSON.stringify(fixture) + ', ' + JSON.stringify(out) + ');', ctx, { timeout: 60000 });
  const got = path.join(out, 'hello.txt');
  const ok = fs.existsSync(got) && fs.readFileSync(got, 'utf8').trim() === 'superbob-crossplatform-ok';
  console.log((ok ? '✅ REAL EXTRACT OK' : '❌ REAL EXTRACT FAILED') + ' on ' + process.platform);
  process.exit(ok ? 0 : 1);
} finally { try { fs.rmSync(out, { recursive: true, force: true }); } catch (e) {} }
