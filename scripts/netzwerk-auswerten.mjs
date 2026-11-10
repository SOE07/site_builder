#!/usr/bin/env node
// Wertet Berichte der Partnernetzwerke nach Sub-ID aus (<seite>-<produkt>-<platz>, von /go/ gesetzt).
// Ablage: seiten/<name>/daten/netzwerk/*.csv  ·  Bericht: seiten/<name>/planung/netzwerk-<datum>.md
// Aufruf: node scripts/netzwerk-auswerten.mjs <name>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { liesCsv, zahl } from './lib/csv.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
const dir = path.join(wurzel, 'seiten', name || '-', 'daten', 'netzwerk');
if (!name || !fs.existsSync(dir)) { console.error('Aufruf: node scripts/netzwerk-auswerten.mjs <name>  (Berichte nach seiten/<name>/daten/netzwerk/ legen)'); process.exit(1); }
const re = new RegExp(`^${name}-(.+)-(tabelle|finder|artikel|agent)$`);
const summe = { produkt: new Map(), platz: new Map() }; let werte = new Set();
for (const f of fs.readdirSync(dir).filter((x) => /\.csv$/i.test(x))) {
  const { kopf, zeilen } = liesCsv(path.join(dir, f));
  const iS = kopf.findIndex((_, i) => zeilen.some((z) => re.test((z[i] || '').trim())));
  if (iS < 0) { console.error(`${f}: keine Sub-ID-Spalte mit ${name}-<produkt>-<platz> gefunden`); continue; }
  const istDatum = (v) => /^\d{4}-\d{2}-\d{2}|^\d{1,2}\.\d{1,2}\.\d{2,4}/.test((v || '').trim());
  const zahlSpalten = kopf.map((k, i) => i).filter((i) => i !== iS && !/datum|date|zeit|time|id$/i.test(kopf[i]) && !zeilen.some((z) => istDatum(z[i])) && zeilen.filter((z) => !isNaN(zahl(z[i]))).length >= zeilen.length * 0.8);
  zahlSpalten.forEach((i) => werte.add(kopf[i]));
  for (const z of zeilen) {
    const m = re.exec((z[iS] || '').trim()); if (!m) continue;
    for (const [art, key] of [['produkt', m[1]], ['platz', m[2]]]) {
      const e = summe[art].get(key) || {}; for (const i of zahlSpalten) e[kopf[i]] = (e[kopf[i]] || 0) + (zahl(z[i]) || 0); summe[art].set(key, e);
    }
  }
}
werte = [...werte];
const tab = (titel, m) => [`## ${titel}`, '', `| ${titel} | ${werte.join(' | ')} |`, `|---|${werte.map(() => '---').join('|')}|`, ...[...m].map(([k, e]) => `| ${k} | ${werte.map((w) => +(e[w] || 0).toFixed(2)).join(' | ')} |`)].join('\n');
const heute = new Date().toISOString().slice(0, 10);
const bericht = `# Netzwerk-Auswertung ${name} · ${heute}\n\nQuelle: Berichte in \`daten/netzwerk/\`, gruppiert nach Sub-ID.\n\n${tab('Produkt', summe.produkt)}\n\n${tab('Platzierung', summe.platz)}\n`;
const ziel = path.join(wurzel, 'seiten', name, 'planung', `netzwerk-${heute}.md`);
fs.mkdirSync(path.dirname(ziel), { recursive: true }); fs.writeFileSync(ziel, bericht);
console.log(bericht); console.error(`Bericht: ${path.relative(wurzel, ziel)}`);
