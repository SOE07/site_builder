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

export async function ladeWerkzeuge() {
  const alle = await reader.collections.werkzeuge.all();
  return alle.map((e) => ({ slug: e.slug, ...e.entry, titel: e.entry.titel as unknown as string }));
}

// Verwandte Inhalte im selben Themen-Cluster: Hub zuerst, dann nach Anzahl gemeinsamer Themen
export async function verwandte(themen: readonly string[], ausser: string) {
  const t = new Set(themen.map((x) => x.toLowerCase()));
  if (!t.size) return [];
  const r = (await ladeRatgeber()).map((x) => ({ typ: 'Ratgeber', pfad: `/ratgeber/${x.slug}`, titel: x.titel, text: x.listenText, themen: x.themen, hub: x.hub }));
  const w = (await ladeWerkzeuge()).map((x) => ({ typ: 'Werkzeug', pfad: `/werkzeuge/${x.slug}`, titel: x.titel, text: x.listenText, themen: x.themen, hub: false }));
  return [...r, ...w]
    .filter((x) => x.pfad !== ausser)
    .map((x) => ({ ...x, treffer: x.themen.filter((y) => t.has(y.toLowerCase())).length }))
    .filter((x) => x.treffer > 0)
    .sort((a, b) => Number(b.hub) - Number(a.hub) || b.treffer - a.treffer)
    .slice(0, 6);
}

// Preisverlauf: aktueller, niedrigster und höchster erfasster Preis
export function preisInfo(p: { preisverlauf: readonly { datum: string | null; preis: number | null; haendler: string; quelle_url: string }[] }) {
  const v = p.preisverlauf.filter((x) => x.datum && typeof x.preis === 'number').map((x) => ({ ...x, datum: x.datum!, preis: x.preis! })).sort((a, b) => a.datum.localeCompare(b.datum));
  if (!v.length) return null;
  const min = v.reduce((a, b) => (b.preis < a.preis ? b : a));
  const max = v.reduce((a, b) => (b.preis > a.preis ? b : a));
  return { verlauf: v, aktuell: v[v.length - 1], min, max };
}

// Erste Zahl bzw. Spanne aus einem Faktwert lesen („350 g ±10 g“ → 350, „65–90 €“ → 65..90)
export function zahlen(wert: string): { von: number; bis: number } | null {
  const m = /(\d+(?:[.,]\d+)?)(?:\s*[–-]\s*(\d+(?:[.,]\d+)?))?/.exec(wert || '');
  if (!m) return null;
  const a = parseFloat(m[1].replace(',', '.')); const b = m[2] ? parseFloat(m[2].replace(',', '.')) : a;
  return { von: Math.min(a, b), bis: Math.max(a, b) };
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
