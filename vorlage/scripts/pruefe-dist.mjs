// Prüft das gebaute HTML auf Pflichtangaben: Werbehinweis oben, Kennzeichnung und rel an jedem Affiliate-Link,
// keine Bewertungssterne/Review-Daten, kein Tracking, keine Fremd-Schriften, verbotene Phrasen.
import fs from 'node:fs';
import path from 'node:path';
import { alleDateien, pruefePhrasen, pruefeAffiliateLinks } from './regeln.mjs';

const dist = 'dist';
if (!fs.existsSync(dist)) { console.error('dist/ fehlt. Erst "npm run build".'); process.exit(1); }
const fehler = [];
const html = alleDateien(dist).filter((f) => f.endsWith('.html'));
const TRACKER = /googletagmanager|google-analytics|gtag\(|fbq\(|connect\.facebook|hotjar|matomo|plausible\.io|umami|clarity\.ms|doubleclick/i;
for (const f of html) {
  const rel = path.relative(dist, f);
  const t = fs.readFileSync(f, 'utf8');
  const istWeiterleitung = /http-equiv=["']refresh["']/i.test(t) && t.length < 2500;
  if (istWeiterleitung) continue;
  if (!/data-werbehinweis-oben/.test(t)) fehler.push(`${rel}: Werbehinweis am Seitenanfang fehlt`);
  fehler.push(...pruefeAffiliateLinks(rel, t));
  for (const m of t.matchAll(/<a\b[^>]*href=["']\/go\/[^"']*["'][^>]*>[\s\S]*?<\/a>/gi)) {
    if (!/class=["'][^"']*werbe-marker/.test(m[0])) fehler.push(`${rel}: Affiliate-Link ohne Werbekennzeichnung (werbe-marker): ${m[0].slice(0, 80)}`);
  }
  if (/aggregateRating|"@type"\s*:\s*"Review"|"reviewRating"|ratingValue/i.test(t)) fehler.push(`${rel}: Review-/Rating-Daten gefunden (verboten)`);
  if (TRACKER.test(t)) fehler.push(`${rel}: Tracking-Code gefunden (verboten)`);
  if (/fonts\.(googleapis|gstatic)\.com/.test(t)) fehler.push(`${rel}: Fremd-Schriften eingebunden (Schriften müssen selbst gehostet sein)`);
  if (!/<title>[^<]{5,}/.test(t)) fehler.push(`${rel}: <title> fehlt oder zu kurz`);
  if (!/<meta name="description" content="[^"]{20,}/.test(t) && !/noindex/.test(t)) fehler.push(`${rel}: Meta-Beschreibung fehlt`);
  const sichtbar = t.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
  fehler.push(...pruefePhrasen(rel, sichtbar));
}
if (fehler.length) { console.error('Prüfung des Builds fehlgeschlagen:\n' + fehler.join('\n')); process.exit(1); }
console.log(`Build-Prüfung ok (${html.length} HTML-Dateien).`);
