// Gemeinsame Regeln. Wird von den Seiten-Skripten UND von den Hooks im Repo-Root genutzt.
import fs from 'node:fs';
import path from 'node:path';

// Verbotene Phrasen (siehe CLAUDE.md, Abschnitt "Ehrlichkeit"). Groß-/Kleinschreibung egal.
export const VERBOTEN = [
  { re: /\bim\s+test\b/i, name: 'im Test' },
  { re: /\bgetestet\b/i, name: 'getestet' },
  { re: /\btestsieger\w*/i, name: 'Testsieger' },
  { re: /\bwir\s+haben\s+gespielt\b/i, name: 'wir haben gespielt' },
  { re: /\bunser(?:e[nrms]?)?\s+test\w*/i, name: 'unser Test' },
];

// Dateien, in denen eigene Erfahrung stehen darf (vom Betreiber selbst eingetragen).
export function istErfahrungsDatei(p) {
  return /(^|[\\/])erfahrung[\\/][^\\/]+\.md$/i.test(p);
}

export const TEXT_ENDUNGEN = ['.json', '.md', '.mdx', '.astro', '.html', '.txt', '.ts', '.tsx', '.mjs'];

export function pruefePhrasen(dateiPfad, inhalt) {
  const fehler = [];
  if (istErfahrungsDatei(dateiPfad)) return fehler;
  const zeilen = inhalt.split('\n');
  zeilen.forEach((z, i) => {
    for (const v of VERBOTEN) {
      if (v.re.test(z)) fehler.push(`${dateiPfad}:${i + 1}: verbotene Phrase „${v.name}“ → ${z.trim().slice(0, 140)}`);
    }
  });
  return fehler;
}

// <a ...href="/go/..."> ohne rel mit sponsored, nofollow, noopener
export function pruefeAffiliateLinks(dateiPfad, inhalt) {
  const fehler = [];
  const re = /<a\b[^>]*>/gi;
  let m;
  while ((m = re.exec(inhalt))) {
    const tag = m[0];
    const href = /href\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1] || '';
    if (!/^\/go\//.test(href)) continue;
    const rel = /rel\s*=\s*["']([^"']*)["']/i.exec(tag)?.[1] || '';
    for (const w of ['sponsored', 'nofollow', 'noopener']) {
      if (!rel.split(/\s+/).includes(w)) {
        const zeile = inhalt.slice(0, m.index).split('\n').length;
        fehler.push(`${dateiPfad}:${zeile}: Affiliate-Link ${href} ohne rel="${w}" (erwartet: sponsored nofollow noopener)`);
      }
    }
  }
  return fehler;
}

export function alleDateien(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.astro', '.git', '.netlify', '.vercel'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) alleDateien(p, out);
    else out.push(p);
  }
  return out;
}

export function lies(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}
