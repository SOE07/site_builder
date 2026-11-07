#!/usr/bin/env node
// Vergleicht die Themes aller Seiten (seiten/*/src/theme/theme.json). Warnt/Fehler bei zu großer Ähnlichkeit.
// Aufruf: node scripts/theme-aehnlichkeit.mjs [--grenze 0.625]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { aehnlichkeit } from './lib/theme-generator.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gi = process.argv.indexOf('--grenze');
const grenze = gi > 0 ? parseFloat(process.argv[gi + 1]) : 0.625;
export function ladeThemes() {
  const dir = path.join(wurzel, 'seiten');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, datei: path.join(dir, e.name, 'src/theme/theme.json') }))
    .filter((x) => fs.existsSync(x.datei)).map((x) => ({ name: x.name, theme: JSON.parse(fs.readFileSync(x.datei, 'utf8')) }));
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const t = ladeThemes();
  let schlecht = 0;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) {
    const a = aehnlichkeit(t[i].theme, t[j].theme);
    const zu = a >= grenze; if (zu) schlecht++;
    console.log(`${zu ? 'ZU ÄHNLICH' : 'ok        '} ${t[i].name} ↔ ${t[j].name}: ${(a * 100).toFixed(0)} %`);
  }
  if (t.length < 2) console.log(`${t.length} Seite(n) mit Theme: nichts zu vergleichen.`);
  process.exit(schlecht ? 1 : 0);
}
