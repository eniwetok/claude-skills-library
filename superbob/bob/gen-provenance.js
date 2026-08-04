#!/usr/bin/env node
// Generate _provenance.json: skill name -> human-readable source (author / repo).
// Lets the SuperBob panel show where each skill in a kit comes from (trust / provenance).
// Usage: node gen-provenance.js <LIBRARY_ROOT> <OUT_FILE>
const fs = require('fs'), path = require('path');
const LIB = process.argv[2], OUT = process.argv[3];

// packages/<dir> -> friendly source label. Keep in sync with README/LICENSES sources.
const LABELS = {
  'pm-skills-main': 'Paweł Huryn · pm-skills',
  'anthropics-skills': 'Anthropic',
  'knowledge-work-plugins': 'Anthropic',
  'superpowers': 'Jesse Vincent · superpowers',
  'ruflo': 'ruvnet · ruflo',
  'open-design': 'nexu-io · open-design',
  'affaan-ecc': 'affaan-m · ECC',
  'zhangzhang-skills': 'zhangzhang-111-i',
  'n8n-skills': 'n8n-io',
  'agent-council': 'team-attention',
  'pablo-obsidian': 'pablo-mano',
  'multica-karpathy': 'multica-ai · Karpathy',
  'ui-skills-ibelick': 'ibelick · ui-skills',
  'evals-skills-hamel': 'Hamel Husain · evals',
  'ponytail': 'dietrichgebert · ponytail',
  'no-ai-slop': 'Peter Yang · no-ai-slop',
  'vibesec': 'BehiSecc · VibeSec',
  'bughunter': 'elementalsouls · BugHunter',
  'i-have-adhd': 'ayghri · i-have-adhd',
  'product-on-purpose-pm': 'Product on Purpose · pm-skills',
  '15-cowork-skills': 'cowork'
};
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', '.next', '.claude', '.codex', '.cursor', '.agents']);
const prov = {};

function findSkills(root, label) {
  let stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { continue; }
    if (ents.some(e => e.isFile() && e.name === 'SKILL.md')) {
      const name = path.basename(dir);
      if (!prov[name]) prov[name] = label;   // first source wins; keeps it stable
    }
    for (const e of ents) if (e.isDirectory() && !SKIP.has(e.name)) stack.push(path.join(dir, e.name));
  }
}

// packages (labelled by source)
const pkgRoot = path.join(LIB, 'packages');
try { for (const pkg of fs.readdirSync(pkgRoot)) findSkills(path.join(pkgRoot, pkg), LABELS[pkg] || pkg); } catch (e) {}
// individual skills in this repo
findSkills(path.join(LIB, 'skills'), 'This library · custom');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(prov));
console.log('provenance: ' + Object.keys(prov).length + ' skills mapped -> ' + OUT);
