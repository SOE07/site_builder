import { defineConfig } from 'astro/config';
import fs from 'node:fs';

const cfg = JSON.parse(fs.readFileSync(new URL('./seite.config.json', import.meta.url), 'utf8'));
const ziel = process.env.DEPLOY_TARGET; // "netlify" | "vercel" | leer
const istDev = process.argv.includes('dev');
// Keystatic braucht serverseitige Routen (/keystatic, /api/keystatic). Alle Inhaltsseiten bleiben statisch.
const mitKeystatic = istDev || Boolean(ziel);

// /go/<slug> -> Ziel aus dem Produkt-Datensatz (302). Ohne Adapter erzeugt Astro statische Weiterleitungsseiten.
const redirects = {};
const dir = new URL('./src/content/produkte/', import.meta.url);
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    try {
      const p = JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8'));
      if (/^https?:\/\//.test(p.affiliateUrl || '')) redirects['/go/' + f.replace(/\.json$/, '')] = { status: 302, destination: p.affiliateUrl };
    } catch {}
  }
}

const integrations = [];
if (mitKeystatic) {
  const react = (await import('@astrojs/react')).default;
  const keystatic = (await import('@keystatic/astro')).default;
  integrations.push(react(), keystatic());
}
let adapter;
if (ziel === 'netlify') adapter = (await import('@astrojs/netlify')).default();
else if (ziel === 'vercel') adapter = (await import('@astrojs/vercel')).default();
else if (ziel) throw new Error('DEPLOY_TARGET muss "netlify" oder "vercel" sein.');

export default defineConfig({
  site: cfg.domain,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations,
  adapter,
  redirects,
});
