// Kleiner CSV-Leser für Exporte (Komma oder Semikolon, Anführungszeichen, deutsche Zahlen).
import fs from 'node:fs';
export function liesCsv(datei) {
  const t = fs.readFileSync(datei, 'utf8').replace(/^﻿/, '');
  const erste = t.split('\n')[0];
  const trenner = (erste.match(/;/g) || []).length > (erste.match(/,/g) || []).length ? ';' : (erste.includes('\t') ? '\t' : ',');
  const zeilen = []; let feld = '', zeile = [], q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"' && t[i + 1] === '"') { feld += '"'; i++; } else if (c === '"') q = false; else feld += c; continue; }
    if (c === '"') q = true; else if (c === trenner) { zeile.push(feld); feld = ''; }
    else if (c === '\n') { zeile.push(feld.replace(/\r$/, '')); zeilen.push(zeile); zeile = []; feld = ''; }
    else feld += c;
  }
  if (feld || zeile.length) { zeile.push(feld); zeilen.push(zeile); }
  const [kopf, ...rest] = zeilen.filter((z) => z.some((x) => x.trim()));
  return { kopf: kopf.map((k) => k.trim()), zeilen: rest };
}
export function zahl(s) {
  if (s == null) return NaN;
  let x = String(s).replace(/[%€\s]/g, '');
  if (/,\d{1,2}$/.test(x) || (/,/.test(x) && !/\./.test(x))) x = x.replace(/\./g, '').replace(',', '.');
  else x = x.replace(/,/g, '');
  return parseFloat(x);
}
export const spalte = (kopf, re) => kopf.findIndex((k) => re.test(k));
