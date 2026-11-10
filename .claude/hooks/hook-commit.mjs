#!/usr/bin/env node
// PreToolUse (Bash, nur "git commit"): baut und prüft jede geänderte Seite (npm run check).
// Exit 2 blockiert den Commit, stderr geht an Claude. Fehlende Abhängigkeiten werden installiert.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
let roh = '';
for await (const c of process.stdin) roh += c;
// Der if-Filter in settings.json lässt den Hook auch bei Befehlen laufen, die Claude Code nicht auswerten
// kann (z. B. Heredocs). Deshalb hier selbst prüfen, ob wirklich "git commit" aufgerufen wird.
let befehl = '';
try { befehl = JSON.parse(roh).tool_input?.command || ''; } catch { process.exit(0); }
const ohneHeredocs = befehl.replace(/<<-?\s*['"]?(\w+)['"]?[\s\S]*?\n\1\b/g, '');
if (!/(^|[;&|(\n]\s*|\s)git(\s+-C\s+\S+)?\s+commit\b/.test(ohneHeredocs)) process.exit(0);
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
  if (r.status !== 0) {
    // Build-Fortschritt ausblenden, damit die eigentliche Fehlermeldung sichtbar bleibt
    const rauschen = /^\s*$|├─|\[build\]|\[vite\]|\[@astrojs|generating static routes|Completed in|^> |page\(s\) built/;
    const zeilen = ((r.stdout || '') + '\n' + (r.stderr || '')).split('\n').filter((l) => !rauschen.test(l));
    fehler.push(`${rel}: npm run check fehlgeschlagen\n${zeilen.slice(-40).join('\n')}`);
  }
}
// Keine Textbausteine zwischen Seiten (CLAUDE.md, Eigenständigkeit)
for (const rel of betroffen) {
  if (!rel.startsWith('seiten/') || !fs.existsSync(path.join(wurzel, rel))) continue;
  const t = spawnSync('node', [path.join(wurzel, 'scripts/text-aehnlichkeit.mjs'), '--seite', rel.split('/')[1]], { cwd: wurzel, encoding: 'utf8' });
  if (t.status !== 0) fehler.push(`${rel}: Textbausteine mit anderen Seiten geteilt\n${t.stdout}`);
}
if (fehler.length) {
  console.error('Commit blockiert: Build oder Prüfung fehlgeschlagen.\n\n' + fehler.join('\n\n') + '\n\nBitte beheben und den Commit wiederholen.');
  process.exit(2);
}
if (betroffen.size) console.error(`Build und Link-Check ok für: ${[...betroffen].join(', ')}`);
