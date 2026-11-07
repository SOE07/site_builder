import fs from 'node:fs';
import path from 'node:path';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import cfg from '../../seite.config.json';

export const seiteConfig = cfg;
const reader = createReader(process.cwd(), keystaticConfig);

export type Fakt = { feld: string; wert: string; quelle_url: string; geprueft_am: string | null; widerspruch: string };
export type Produkt = Awaited<ReturnType<typeof ladeProdukte>>[number];

export async function ladeSeite() { return (await reader.singletons.seite.read()) ?? leer('seite'); }
export async function ladeUeberUns() { return (await reader.singletons.ueberUns.read()) ?? leer('ueber-uns'); }
export async function ladeRecht() { return (await reader.singletons.recht.read()) ?? leer('recht'); }
export async function ladeFinder() { return await reader.singletons.finder.read(); }

function leer(n: string): never { throw new Error(`Inhalt src/content/${n}.json fehlt.`); }

export async function ladeProdukte() {
  const alle = await reader.collections.produkte.all();
  return alle
    .map((e) => ({ slug: e.slug, ...e.entry, name: e.entry.name as unknown as string }))
    .sort((a, b) => a.reihenfolge - b.reihenfolge || a.slug.localeCompare(b.slug));
}

export async function ladeRatgeber() {
  const alle = await reader.collections.ratgeber.all();
  return alle.map((e) => ({ slug: e.slug, ...e.entry, titel: e.entry.titel as unknown as string }));
}

export function fakt(p: { fakten: readonly Fakt[] }, feld: string): Fakt | undefined {
  return p.fakten.find((f) => f.feld.toLowerCase() === feld.toLowerCase());
}

// Eigene Erfahrung: nur aus erfahrung/<slug>.md
export function erfahrung(slug: string): string | null {
  const f = path.join(process.cwd(), 'erfahrung', `${slug}.md`);
  if (!fs.existsSync(f)) return null;
  const t = fs.readFileSync(f, 'utf8').trim();
  return t || null;
}

export function url(pfad: string) { return new URL(pfad, cfg.domain).toString(); }
