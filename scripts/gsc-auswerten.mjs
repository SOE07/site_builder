#!/usr/bin/env node
// Wertet Search-Console-Exporte aus (Suchanfragen oder Seiten, CSV aus „Leistung → Exportieren“).
// Ablage der Exporte: seiten/<name>/daten/gsc/*.csv  ·  Bericht: seiten/<name>/planung/performance-<datum>.md
// Aufruf: node scripts/gsc-auswerten.mjs <name>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { liesCsv, zahl, spalte } from './lib/csv.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
const dir = path.join(wurzel, 'seiten', name || '-', 'daten', 'gsc');
if (!name || !fs.existsSync(dir)) { console.error(`Aufruf: node scripts/gsc-auswerten.mjs <name>  (Exporte nach seiten/<name>/daten/gsc/ legen)`); process.exit(1); }
const zeilen = [];
for (const f of fs.readdirSync(dir).filter((x) => /\.csv$/i.test(x))) {
  const { kopf, zeilen: z } = liesCsv(path.join(dir, f));
  const iQ = spalte(kopf, /suchanfrage|query|anfrage|seite|page|url/i), iK = spalte(kopf, /klick|click/i), iI = spalte(kopf, /impression/i), iC = spalte(kopf, /ctr|klickrate/i), iP = spalte(kopf, /position/i);
  if ([iQ, iK, iI, iP].some((x) => x < 0)) { console.error(`${f}: Spalten nicht erkannt (${kopf.join(', ')})`); continue; }
  for (const r of z) zeilen.push({ q: r[iQ], k: zahl(r[iK]) || 0, i: zahl(r[iI]) || 0, ctr: iC >= 0 ? zahl(r[iC]) : NaN, p: zahl(r[iP]), datei: f });
}
if (!zeilen.length) { console.error('Keine auswertbaren Zeilen gefunden.'); process.exit(1); }
for (const z of zeilen) if (isNaN(z.ctr)) z.ctr = z.i ? (z.k / z.i) * 100 : 0;
const tab = (l) => ['| Suchanfrage/Seite | Klicks | Impressionen | CTR | Position |', '|---|---|---|---|---|', ...l.map((z) => `| ${z.q.replace(/\|/g, '\\|')} | ${z.k} | ${z.i} | ${z.ctr.toFixed(1)} % | ${z.p.toFixed(1)} |`)].join('\n');
const knapp = zeilen.filter((z) => z.p >= 8 && z.p <= 20 && z.i >= 20).sort((a, b) => b.i - a.i).slice(0, 20);
const ctr = zeilen.filter((z) => z.p <= 7 && z.i >= 50 && z.ctr < 2).sort((a, b) => b.i - a.i).slice(0, 15);
const top = [...zeilen].sort((a, b) => b.k - a.k).slice(0, 10);
const heute = new Date().toISOString().slice(0, 10);
const bericht = `# Performance ${name} · ${heute}

Quelle: Search-Console-Exporte in \`daten/gsc/\` (${[...new Set(zeilen.map((z) => z.datei))].join(', ')}). Summe: ${zeilen.reduce((s, z) => s + z.k, 0)} Klicks, ${zeilen.reduce((s, z) => s + z.i, 0)} Impressionen.

## Kurz vor Seite 1 (Position 8–20, viele Impressionen)
Größter Hebel: Inhalt gezielt ausbauen (Mehrwert-These, fehlende Fragen, interne Links aus dem Cluster).

${knapp.length ? tab(knapp) : 'Keine.'}

## Gut platziert, aber kaum geklickt (Position ≤ 7, CTR < 2 %)
Title und Meta-Beschreibung schärfen, Suchabsicht prüfen.

${ctr.length ? tab(ctr) : 'Keine.'}

## Stärkste Anfragen
${tab(top)}
`;
fs.mkdirSync(path.join(wurzel, 'seiten', name, 'planung'), { recursive: true });
const ziel = path.join(wurzel, 'seiten', name, 'planung', `performance-${heute}.md`);
fs.writeFileSync(ziel, bericht);
console.log(bericht); console.error(`Bericht: ${path.relative(wurzel, ziel)}`);
