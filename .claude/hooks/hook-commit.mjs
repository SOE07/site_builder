#!/usr/bin/env node
// PreToolUse (Bash, nur "git commit"): baut und prüft jede geänderte Seite (npm run check).
// Exit 2 blockiert den Commit, stderr geht an Claude. Fehlende Abhängigkeiten werden installiert.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
for await (const _ of process.stdin) { /* stdin leeren */ }
let status = '';
try { status = execFileSync('git', ['status', '--porcelain', '-uall'], { cwd: wurzel, encoding: 'utf8' }); } catch { process.exit(0); }
const betroffen = new Set();
for (const z of status.split('\n')) {
  const p = z.slice(3).replace(/^"|"$/g, '').split(' -> ').pop();
  const m = /^(seiten\/[^/]+|vorlage)\//.exec(p || '');
  if (m) betroffen.add(m[1]);
}
const fehler = [];
for (const rel of betroffen) {
  const dir = path.join(wurzel, rel);
  if (!fs.existsSync(path.join(dir, 'package.json'))) continue; // Seite wurde gelöscht
  if (!fs.existsSync(path.join(dir, 'node_modules'))) {
    const i = spawnSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: dir, encoding: 'utf8' });
    if (i.status !== 0) { fehler.push(`${rel}: npm install fehlgeschlagen\n${(i.stderr || i.stdout).slice(-1500)}`); continue; }
  }
  const r = spawnSync('npm', ['run', 'check'], { cwd: dir, encoding: 'utf8', env: { ...process.env, DEPLOY_TARGET: '' } });
  if (r.status !== 0) fehler.push(`${rel}: npm run check fehlgeschlagen\n${((r.stderr || '') + (r.stdout || '')).split('\n').filter((l) => !/^\s*$/.test(l)).slice(-25).join('\n')}`);
}
if (fehler.length) {
  console.error('Commit blockiert: Build oder Prüfung fehlgeschlagen.\n\n' + fehler.join('\n\n') + '\n\nBitte beheben und den Commit wiederholen.');
  process.exit(2);
}
if (betroffen.size) console.error(`Build und Link-Check ok für: ${[...betroffen].join(', ')}`);
