#!/usr/bin/env node
// PostToolUse (Edit|Write): prüft die geänderte Inhaltsdatei auf verbotene Phrasen und
// Affiliate-Links ohne rel="sponsored nofollow noopener". Exit 2 = Rückmeldung an Claude (stderr).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pruefePhrasen, pruefeAffiliateLinks, TEXT_ENDUNGEN, istErfahrungsDatei } from '../../vorlage/scripts/regeln.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
let roh = '';
for await (const c of process.stdin) roh += c;
let datei = '';
try { datei = JSON.parse(roh).tool_input?.file_path || ''; } catch { process.exit(0); }
if (!datei) process.exit(0);
const rel = path.relative(wurzel, path.resolve(datei)).split(path.sep).join('/');
const inScope = /^seiten\/[^/]+\//.test(rel) || /^vorlage\/src\//.test(rel);
if (!inScope || rel.includes('/theme/') || rel.includes('/node_modules/') || rel.includes('/dist/')) process.exit(0);
if (istErfahrungsDatei(rel) || !TEXT_ENDUNGEN.includes(path.extname(rel).toLowerCase()) || !fs.existsSync(datei)) process.exit(0);
const inhalt = fs.readFileSync(datei, 'utf8');
const fehler = [...pruefePhrasen(rel, inhalt), ...pruefeAffiliateLinks(rel, inhalt)];
if (fehler.length) {
  console.error('Inhaltsprüfung (CLAUDE.md, Ehrlichkeit und Werbekennzeichnung):\n' + fehler.join('\n') +
    '\nBitte beheben: Keine Aussagen über eigene Tests oder Erfahrung (nur in erfahrung/*.md). Affiliate-Links nur über die Komponente AffiliateLink bzw. mit rel="sponsored nofollow noopener".');
  process.exit(2);
}
