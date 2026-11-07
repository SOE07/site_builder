// Prüft Produktdaten: jede Angabe braucht Quell-URL und Prüfdatum.
// Normal: fehlendes Prüfdatum = Warnung. --streng (Release): Fehler, plus Platzhalter und Affiliate-Links.
import fs from 'node:fs';
import path from 'node:path';
import { alleDateien, lies } from './regeln.mjs';

const streng = process.argv.includes('--streng');
const fehler = [];
const warnungen = [];
const dir = 'src/content/produkte';
const dateien = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
if (!dateien.length) warnungen.push('Keine Produkte in src/content/produkte.');

const heute = new Date().toISOString().slice(0, 10);
for (const f of dateien) {
  const p = lies(path.join(dir, f));
  const slug = f.replace(/\.json$/, '');
  if (!p) { fehler.push(`${f}: kein gültiges JSON`); continue; }
  if (!Array.isArray(p.fakten) || !p.fakten.length) fehler.push(`${slug}: keine Fakten (Gewicht, Preis, …) hinterlegt`);
  for (const k of p.fakten || []) {
    const wo = `${slug} / ${k.feld || '(ohne Feldname)'}`;
    if (!k.feld || !k.wert) fehler.push(`${wo}: Feld oder Wert fehlt`);
    if (!/^https?:\/\//.test(k.quelle_url || '')) fehler.push(`${wo}: Quell-URL fehlt`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k.geprueft_am || '')) (streng ? fehler : warnungen).push(`${wo}: Prüfdatum fehlt`);
    else if (k.geprueft_am > heute) fehler.push(`${wo}: Prüfdatum liegt in der Zukunft`);
    else if (streng && (Date.parse(heute) - Date.parse(k.geprueft_am)) / 864e5 > 90) warnungen.push(`${wo}: Prüfdatum älter als 90 Tage (preise-aktualisieren)`);
  }
  if (!p.affiliateUrl) warnungen.push(`${slug}: kein Affiliate-/Ziel-Link hinterlegt`);
  else if (!/^https?:\/\//.test(p.affiliateUrl)) fehler.push(`${slug}: affiliateUrl ist keine http(s)-URL`);
}

if (streng) {
  for (const d of [...alleDateien('src/content'), 'seite.config.json'].filter((x) => fs.existsSync(x))) {
    const t = fs.readFileSync(d, 'utf8');
    const m = t.match(/\[[A-ZÄÖÜ][^\]\n"]{2,}\]/g);
    if (m) fehler.push(`${d}: Platzhalter offen: ${[...new Set(m)].slice(0, 12).join(' | ')}`);
  }
}

warnungen.forEach((w) => console.warn('Warnung: ' + w));
if (fehler.length) { console.error('Datenprüfung fehlgeschlagen:\n' + fehler.join('\n')); process.exit(1); }
console.log(`Datenprüfung ok (${dateien.length} Produkte${streng ? ', streng' : ''}).`);
