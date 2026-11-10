#!/usr/bin/env node
// Prüft, ob Seiten Textbausteine teilen (verboten laut CLAUDE.md) und ob sich innerhalb einer Seite
// Schablonen wiederholen. Vergleicht 7-Wort-Folgen aus src/content (ohne recht.json).
// Aufruf: node scripts/text-aehnlichkeit.mjs [--seite <name>]   Exit 1 bei Verstoß.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const i = process.argv.indexOf('--seite'); const nur = i > 0 ? process.argv[i + 1] : null;
const N = 7, FEHLER_AB = 0.04, WARN_AB = 0.015;

function texte(o, out = []) {
  if (typeof o === 'string') { if (!/^https?:\/\//.test(o) && !/^<svg/.test(o) && o.split(/\s+/).length >= N) out.push(o); }
  else if (Array.isArray(o)) o.forEach((x) => texte(x, out));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) if (!['quelle_url', 'affiliateUrl', 'symbolSvg', 'url'].includes(k)) texte(v, out);
  return out;
}
function folgen(s) {
  const w = s.toLowerCase().replace(/\*\*|\[[^\]]*\]\([^)]*\)/g, ' ').replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
  const r = new Set(); for (let k = 0; k + N <= w.length; k++) r.add(w.slice(k, k + N).join(' ')); return r;
}
function dateien(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) dateien(p, out); else if (e.name.endsWith('.json') && e.name !== 'recht.json') out.push(p); }
  return out;
}
const seiten = fs.readdirSync(path.join(wurzel, 'seiten'), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const daten = {};
for (const s of seiten) {
  const alle = new Set(); const proDatei = [];
  for (const d of dateien(path.join(wurzel, 'seiten', s, 'src/content'))) {
    const f = new Set(); for (const t of texte(JSON.parse(fs.readFileSync(d, 'utf8')))) for (const x of folgen(t)) { f.add(x); alle.add(x); }
    proDatei.push({ d: path.relative(wurzel, d), f });
  }
  daten[s] = { alle, proDatei };
}
let fehler = 0;
// 1) zwischen Seiten
for (let a = 0; a < seiten.length; a++) for (let b = a + 1; b < seiten.length; b++) {
  const A = seiten[a], B = seiten[b]; if (nur && nur !== A && nur !== B) continue;
  const x = daten[A].alle, y = daten[B].alle; if (!x.size || !y.size) continue;
  const gemeinsam = [...x].filter((s) => y.has(s)); const q = gemeinsam.length / Math.min(x.size, y.size);
  const stufe = q >= FEHLER_AB ? 'FEHLER' : q >= WARN_AB ? 'WARNUNG' : 'ok';
  if (stufe === 'FEHLER') fehler++;
  console.log(`${stufe.padEnd(7)} ${A} ↔ ${B}: ${(q * 100).toFixed(1)} % gemeinsame Wortfolgen`);
  if (stufe !== 'ok') gemeinsam.slice(0, 6).forEach((g) => console.log(`        „${g}“`));
}
// 2) Schablonen innerhalb einer Seite: dieselbe Wortfolge in 3+ Dateien
for (const s of seiten) {
  if (nur && nur !== s) continue;
  const zaehler = new Map();
  for (const { f } of daten[s].proDatei) for (const x of f) zaehler.set(x, (zaehler.get(x) || 0) + 1);
  const schablonen = [...zaehler].filter(([, n]) => n >= 3).sort((p, q) => q[1] - p[1]);
  if (schablonen.length) { console.log(`WARNUNG ${s}: ${schablonen.length} Wortfolgen wiederholen sich in 3+ Dateien (Schablonen-Gefahr):`); schablonen.slice(0, 5).forEach(([g, n]) => console.log(`        ${n}× „${g}“`)); }
}
if (seiten.length < 2 && !fehler) console.log('Hinweis: Vergleich zwischen Seiten braucht mindestens zwei Seiten.');
process.exit(fehler ? 1 : 0);
