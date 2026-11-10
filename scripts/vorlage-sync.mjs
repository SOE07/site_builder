#!/usr/bin/env node
// Überträgt Code-Änderungen der vorlage/ in eine bestehende Seite. Inhalte, Theme, Konfiguration,
// Erfahrung, Planung und Schriftpakete der Seite bleiben unangetastet.
// Aufruf: node scripts/vorlage-sync.mjs <name> [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dry = process.argv.includes('--dry');
const name = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!name || name === 'vorlage' || !fs.existsSync(path.join(wurzel, 'seiten', name))) {
  console.error('Aufruf: node scripts/vorlage-sync.mjs <seitenname> [--dry]'); process.exit(1);
}
const von = path.join(wurzel, 'vorlage'); const nach = path.join(wurzel, 'seiten', name);
const AUS_DIR = new Set(['node_modules', 'dist', '.astro', '.netlify', '.vercel', 'erfahrung', 'planung', 'public']);
const AUS_REL = ['src/content', 'src/theme'];
const AUS_DATEI = new Set(['package.json', 'package-lock.json', 'seite.config.json', '.env']);
const geaendert = [];
(function kopiere(rel) {
  for (const e of fs.readdirSync(path.join(von, rel), { withFileTypes: true })) {
    const r = path.posix.join(rel, e.name);
    if (e.isDirectory()) { if (AUS_DIR.has(e.name) || AUS_REL.includes(r)) continue; kopiere(r); continue; }
    if (AUS_DATEI.has(e.name)) continue;
    const v = path.join(von, r), n = path.join(nach, r);
    if (fs.existsSync(n) && fs.readFileSync(v).equals(fs.readFileSync(n))) continue;
    geaendert.push(`${fs.existsSync(n) ? 'geändert' : 'neu     '} ${r}`);
    if (!dry) { fs.mkdirSync(path.dirname(n), { recursive: true }); fs.copyFileSync(v, n); }
  }
})('');
// package.json: Skripte komplett, Abhängigkeiten außer @fontsource übernehmen
const pv = JSON.parse(fs.readFileSync(path.join(von, 'package.json'), 'utf8'));
const pnPfad = path.join(nach, 'package.json'); const pn = JSON.parse(fs.readFileSync(pnPfad, 'utf8'));
let pkgNeu = false;
if (JSON.stringify(pn.scripts) !== JSON.stringify(pv.scripts)) { pn.scripts = pv.scripts; pkgNeu = true; }
for (const [k, v] of Object.entries(pv.dependencies)) if (!k.startsWith('@fontsource/') && pn.dependencies[k] !== v) { pn.dependencies[k] = v; pkgNeu = true; }
if (pkgNeu) { geaendert.push('geändert package.json (Skripte/Abhängigkeiten) → danach npm install'); if (!dry) fs.writeFileSync(pnPfad, JSON.stringify(pn, null, 2) + '\n'); }
console.log(geaendert.length ? `${dry ? 'Würde ändern' : 'Geändert'} in seiten/${name}:\n  ${geaendert.join('\n  ')}` : `seiten/${name} ist auf dem Stand der Vorlage.`);
