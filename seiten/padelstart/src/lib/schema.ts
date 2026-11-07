// Strukturierte Daten ohne Bewertungen: Article, BreadcrumbList, ItemList, WebSite. Kein Review/AggregateRating.
import { seiteConfig, url } from './inhalt';
import { nurText } from './text';

export function webseite(name: string) {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name, url: url('/'), inLanguage: 'de-DE' };
}
export function brotkrumen(items: { name: string; pfad: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: url(x.pfad) })),
  };
}
export function artikel(o: { titel: string; beschreibung: string; pfad: string; autor: string; datum?: string | null; seitenName: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: nurText(o.titel), description: nurText(o.beschreibung), inLanguage: 'de-DE',
    mainEntityOfPage: url(o.pfad),
    ...(o.datum ? { dateModified: o.datum } : {}),
    author: { '@type': 'Person', name: o.autor },
    publisher: { '@type': 'Organization', name: o.seitenName },
  };
}
export function liste(items: { name: string; pfad: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, url: url(x.pfad) })),
  };
}
export function json(o: unknown) { return JSON.stringify(o).replace(/</g, '\\u003c'); }
export { seiteConfig };
