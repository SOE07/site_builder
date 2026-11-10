#!/usr/bin/env node
// Erzeugt seiten/<name>/ aus vorlage/ mit eigenem Theme und leeren Pflichtseiten.
// Aufruf: node scripts/neue-seite.mjs <name> "<Anzeigename>" [--domain https://…] [--anrede du|Sie]
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waehleTheme, themeDateien, aehnlichkeit } from './lib/theme-generator.mjs';
import { skeleton } from './lib/skeleton.mjs';
import { ladeThemes } from './theme-aehnlichkeit.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const domain = opt('--domain'); const anrede = opt('--anrede', 'du');
const [name, anzeige] = args;
if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name === 'vorlage') {
  console.error('Aufruf: node scripts/neue-seite.mjs <name-in-kleinbuchstaben> "<Anzeigename>" [--domain https://…] [--anrede du|Sie]'); process.exit(1);
}
const ziel = path.join(wurzel, 'seiten', name);
if (fs.existsSync(ziel)) { console.error(`seiten/${name} existiert bereits.`); process.exit(1); }
const anzeigename = anzeige || name;

const AUS = new Set(['node_modules', 'dist', '.astro', '.netlify', '.vercel', 'package-lock.json', '.env']);
function kopiere(von, nach, rel = '') {
  fs.mkdirSync(nach, { recursive: true });
  for (const e of fs.readdirSync(von, { withFileTypes: true })) {
    const r = path.posix.join(rel, e.name);
    if (AUS.has(e.name) || ['src/content', 'src/theme', 'src/werkzeuge', 'src/grafiken'].includes(r)) continue;
    const v = path.join(von, e.name), n = path.join(nach, e.name);
    if (e.isDirectory()) kopiere(v, n, r); else fs.copyFileSync(v, n);
  }
}
kopiere(path.join(wurzel, 'vorlage'), ziel);

// Eigenes Theme: Seed aus dem Namen, bei zu großer Ähnlichkeit zu anderen Seiten weiter würfeln
const andere = ladeThemes();
let theme, versuch = 0;
do { theme = waehleTheme(`${name}#${versuch++}`); }
while (versuch < 200 && andere.some((a) => aehnlichkeit(a.theme, theme) >= 0.625));
const { css, json, pakete } = themeDateien(theme);
fs.mkdirSync(path.join(ziel, 'src/theme'), { recursive: true });
fs.writeFileSync(path.join(ziel, 'src/theme/theme.css'), css);
fs.writeFileSync(path.join(ziel, 'src/theme/theme.json'), JSON.stringify(json, null, 2) + '\n');

// Inhalts-Skelett
for (const [datei, inhalt] of Object.entries(skeleton(name, anzeigename))) {
  const p = path.join(ziel, datei); fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(inhalt, null, 2) + '\n');
}
for (const d of ['src/content/produkte', 'src/content/ratgeber', 'src/content/werkzeuge', 'src/werkzeuge', 'src/grafiken', 'planung', 'wissen']) { fs.mkdirSync(path.join(ziel, d), { recursive: true }); fs.writeFileSync(path.join(ziel, d, '.gitkeep'), ''); }

// Stimme der Seite (Pflicht vor dem Schreiben; Skill seite-anlegen füllt sie)
fs.writeFileSync(path.join(ziel, 'stimme.md'), `# Stimme von ${anzeigename}

Wird von \`seite-anlegen\` gefüllt und von \`autor\` vor jedem Text gelesen. Muss sich von allen anderen Seiten unterscheiden.

## Persona und Haltung
[Wer spricht? Welche Haltung? z. B. nüchterner Datenvergleicher, pragmatische Einsteigerhilfe]

## Zielgruppe
[Wer liest, mit welchem Vorwissen und welcher Sorge?]

## Ton
- Anrede: ${anrede}
- [Satzlänge, Fachbegriffe ja/nein, Humor ja/nein]

## Eigene Wendungen und Gliederungsmuster
- [z. B. jede Empfehlung beginnt mit „Für wen“; Abschnitt „Die ehrliche Kurzfassung“]

## Verboten auf dieser Seite
- Floskeln wie „In der heutigen Zeit“, „Ultimativer Guide“, „Es kommt darauf an“ ohne Auflösung
- [weitere seiteneigene Tabus]

## Beispielsätze
- [drei Sätze, die genau so klingen, wie die Seite klingen soll]
`);

// Konfiguration und Pakete
const cfgP = path.join(ziel, 'seite.config.json');
const cfg = JSON.parse(fs.readFileSync(cfgP, 'utf8'));
Object.assign(cfg, { name, anzeigename, domain: domain || `https://${name}.netlify.app`, pfad: `seiten/${name}`, anrede, veroeffentlicht: false });
fs.writeFileSync(cfgP, JSON.stringify(cfg, null, 2) + '\n');
const pkgP = path.join(ziel, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgP, 'utf8'));
pkg.name = name;
for (const p of pakete) {
  let v = 'latest';
  try { v = '^' + execSync(`npm view ${p} version`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}
  pkg.dependencies[p] = v;
}
pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(pkgP, JSON.stringify(pkg, null, 2) + '\n');

console.log(`seiten/${name} angelegt. Theme: ${theme.schrift.display}/${theme.schrift.body}, Header ${theme.header}, Hero ${theme.hero}, Tabelle ${theme.table}, Ecken ${theme.radius}.`);
console.log(`Nächste Schritte: cd seiten/${name} && npm install`);
