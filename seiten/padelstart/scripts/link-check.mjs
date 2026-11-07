// Link-Check auf dist/: interne Links und Anker. Mit --extern auch externe Ziele (HEAD/GET).
import fs from 'node:fs';
import path from 'node:path';
import { alleDateien } from './regeln.mjs';

const extern = process.argv.includes('--extern');
const dist = 'dist';
if (!fs.existsSync(dist)) { console.error('dist/ fehlt. Erst "npm run build".'); process.exit(1); }
const html = alleDateien(dist).filter((f) => f.endsWith('.html'));
const fehler = [];
const externe = new Map();
const ids = new Map();
const lesen = (f) => fs.readFileSync(f, 'utf8');
function seitenDatei(urlPfad) {
  const p = decodeURIComponent(urlPfad.replace(/\/+$/, ''));
  const kandidaten = [path.join(dist, p), path.join(dist, p + '.html'), path.join(dist, p, 'index.html')];
  return kandidaten.find((k) => fs.existsSync(k) && fs.statSync(k).isFile());
}
for (const f of html) ids.set(f, new Set([...lesen(f).matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1])));
for (const f of html) {
  const t = lesen(f);
  for (const m of t.matchAll(/<a\b[^>]*\shref=["']([^"']*)["']/gi)) {
    const href = m[1];
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    if (/^https?:\/\//i.test(href)) { externe.set(href, f); continue; }
    const [pfad, anker] = href.split('#');
    const ziel = pfad ? seitenDatei(pfad.startsWith('/') ? pfad : path.posix.join('/', path.relative(dist, path.dirname(f)).split(path.sep).join('/'), pfad)) : f;
    if (!ziel) { fehler.push(`${path.relative(dist, f)}: toter interner Link ${href}`); continue; }
    if (anker) {
      const set = ids.get(ziel) || (ziel.endsWith('.html') ? new Set([...lesen(ziel).matchAll(/\sid=["']([^"']+)["']/g)].map((x) => x[1])) : new Set());
      if (!set.has(decodeURIComponent(anker))) fehler.push(`${path.relative(dist, f)}: Anker #${anker} fehlt auf ${pfad || 'derselben Seite'}`);
    }
  }
}
if (extern) {
  // Weiterleitungen /go/* zeigen auf die echten Ziele: diese zusätzlich prüfen
  for (const f of html.filter((x) => x.includes(`${path.sep}go${path.sep}`))) {
    const u = /url=([^"'>]+)/i.exec(lesen(f))?.[1] || /<a href="([^"]+)"/.exec(lesen(f))?.[1];
    if (u && /^https?:/.test(u)) externe.set(u.replace(/&amp;/g, '&'), f);
  }
  for (const [url, wo] of externe) {
    try {
      let r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (link-check)' } });
      if (r.status === 405 || r.status === 403) r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (link-check)' } });
      if (r.status >= 400) fehler.push(`${url} → HTTP ${r.status} (gefunden in ${path.relative(dist, wo)})`);
    } catch (e) { fehler.push(`${url} → nicht erreichbar (${e.cause?.code || e.message}) (gefunden in ${path.relative(dist, wo)})`); }
  }
}
if (fehler.length) { console.error('Link-Check fehlgeschlagen:\n' + fehler.join('\n')); process.exit(1); }
console.log(`Link-Check ok (${html.length} Seiten${extern ? `, ${externe.size} externe Links` : ''}).`);
