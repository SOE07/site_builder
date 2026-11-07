// Prüft verbotene Phrasen und Affiliate-Links ohne rel="sponsored nofollow noopener".
// Aufruf: node scripts/pruefe-inhalt.mjs [datei ...]   (ohne Argumente: src/ und erfahrung/-unabhängig alles Relevante)
import fs from 'node:fs';
import path from 'node:path';
import { pruefePhrasen, pruefeAffiliateLinks, alleDateien, TEXT_ENDUNGEN } from './regeln.mjs';

const args = process.argv.slice(2);
const dateien = args.length ? args : [...alleDateien('src'), ...alleDateien('erfahrung'), 'seite.config.json'].filter((p) => fs.existsSync(p));
let fehler = [];
for (const d of dateien) {
  if (!TEXT_ENDUNGEN.includes(path.extname(d).toLowerCase())) continue;
  if (/[\\/]theme[\\/]/.test(d)) continue;
  const inhalt = fs.readFileSync(d, 'utf8');
  fehler = fehler.concat(pruefePhrasen(d, inhalt), pruefeAffiliateLinks(d, inhalt));
}
if (fehler.length) {
  console.error('Inhaltsprüfung fehlgeschlagen:\n' + fehler.join('\n'));
  console.error('\nRegeln: siehe CLAUDE.md (Ehrlichkeit, Werbekennzeichnung). Eigene Erfahrung nur in erfahrung/*.md.');
  process.exit(1);
}
console.log(`Inhaltsprüfung ok (${dateien.length} Dateien).`);
