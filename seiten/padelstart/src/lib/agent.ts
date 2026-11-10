// Agent-First: Markdown-Fassungen, llms.txt und Produkt-JSON aus denselben Inhalten wie die HTML-Seiten.
// Regeln wie überall: Werbelinks gekennzeichnet, Quellen und Prüfdaten sichtbar, keine Bewertungen.
import { seiteConfig, fakt, erfahrung, ladeSeite, ladeProdukte, ladeRatgeber, ladeFinder, ladeRecht, ladeUeberUns, ladeWerkzeuge, preisInfo, type Produkt } from './inhalt';
import { nurText, datumDe } from './text';

export const abs = (p: string) => new URL(p, seiteConfig.domain).toString();
const links = (s: string | null | undefined) => String(s ?? '').replace(/\]\((\/[^)\s]*)\)/g, (_, p) => `](${abs(p)})`);
const zelle = (s: unknown) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const liste = (a: readonly string[]) => a.map((x) => `- ${nurText(x)}`).join('\n');
export const werbeLinkMd = (slug: string, label = 'Zum Angebot') => `[${label} (Werbelink)](${abs(`/go/${slug}/agent`)})`;
const kopf = (seite: { werbehinweis: string }, htmlPfad: string) =>
  `> Werbehinweis: ${nurText(seite.werbehinweis)}\n> HTML-Fassung: ${abs(htmlPfad)} · Alle Seiten: ${abs('/llms.txt')}\n`;

function preisMd(p: Produkt): string {
  const pi = preisInfo(p);
  if (!pi) return '';
  return `**Preisverlauf (eigene Abrufe):** zuletzt ${pi.aktuell.preis} € bei ${pi.aktuell.haendler} (${datumDe(pi.aktuell.datum)}); niedrigster erfasster Preis ${pi.min.preis} € (${datumDe(pi.min.datum)}), höchster ${pi.max.preis} € (${datumDe(pi.max.datum)}), ${pi.verlauf.length} Abrufe.`;
}

export async function werkzeugMd(slug: string): Promise<string> {
  const seite = await ladeSeite(); const w = (await ladeWerkzeuge()).find((x) => x.slug === slug)!;
  return [kopf(seite, `/werkzeuge/${slug}`), `# ${nurText(w.titel)}`, links(w.einleitung), `Interaktives Werkzeug: ${abs(`/werkzeuge/${slug}`)}`,
    '## So rechnet das Werkzeug', links(w.methodik), w.quellen.length ? `## Quellen\n${w.quellen.map((q) => `- [${q.text}](${q.url})`).join('\n')}` : ''].filter(Boolean).join('\n\n') + '\n';
}

export function produktMd(p: Produkt): string {
  const ex = erfahrung(p.slug);
  const tabelle = ['| Angabe | Wert | Quelle | Geprüft am |', '|---|---|---|---|']
    .concat(p.fakten.map((f) => `| ${zelle(f.feld)} | ${zelle(f.wert)} | ${f.quelle_url} | ${f.geprueft_am ? datumDe(f.geprueft_am) : 'offen'} |`)).join('\n');
  const wid = p.fakten.filter((f) => f.widerspruch).map((f) => `**Abweichende Angaben (${f.feld}):** ${f.widerspruch}`).join('\n\n');
  return [
    `### ${p.name}: ${nurText(p.untertitel)}`,
    `Typ: ${p.typ} · Am besten für: ${nurText(p.geeignetFuer)}`,
    links(p.beschreibung),
    tabelle,
    `**Das spricht dafür**\n${liste(p.pro)}`,
    `**Das spricht dagegen**\n${liste(p.contra)}`,
    p.nichtKaufenWenn ? `**Nicht kaufen, wenn** ${nurText(p.nichtKaufenWenn)}` : '',
    p.hinweis ? links(p.hinweis) : '',
    wid,
    preisMd(p),
    p.kaeuferhinweise.length ? `**Was Käufer häufig berichten** (sinngemäß, mit Quelle)\n${p.kaeuferhinweise.map((k) => `- ${k.text} (Quelle: ${k.quelle_url}${k.abgerufen_am ? `, abgerufen ${datumDe(k.abgerufen_am)}` : ''})`).join('\n')}` : '',
    ex ? `**Eigene Erfahrung**\n\n${ex}` : '',
    `${werbeLinkMd(p.slug)}: bezahlter Affiliate-Link (rel="sponsored nofollow noopener").`,
  ].filter(Boolean).join('\n\n');
}

export async function startMd(): Promise<string> {
  const seite = await ladeSeite(); const produkte = await ladeProdukte(); const ratgeber = await ladeRatgeber(); const finder = await ladeFinder();
  const sp = seite.tabellenSpalten;
  const tab = [`| Produkt | Typ | Am besten für | ${sp.join(' | ')} |`, `|---|---|---|${sp.map(() => '---').join('|')}|`]
    .concat(produkte.map((p) => `| ${zelle(p.name)} | ${zelle(p.typ)} | ${zelle(nurText(p.geeignetFuer))} | ${sp.map((s) => zelle(fakt(p, s)?.wert ?? '–')).join(' | ')} |`)).join('\n');
  const fin = finder?.aktiv && finder.fragen.length
    ? `## ${finder.titel}\nAuswahlhilfe mit ${finder.fragen.length} Fragen (Punkte je Antwort stehen in ${abs('/produkte.json')}).\n\n${finder.fragen.map((f, i) => `${i + 1}. ${f.frage} (${f.antworten.map((a) => a.text).join(' / ')})`).join('\n')}`
    : '';
  return [
    kopf(seite, '/'), `# ${nurText(seite.heroTitel)}`, links(seite.heroText), liste(seite.heroPunkte),
    `## ${nurText(seite.empfehlungenTitel)}`, links(seite.empfehlungenText), tab, links(seite.tabellenHinweis), fin,
    `## ${nurText(seite.ratgeberTitel)}`, ratgeber.map((r) => `- [${nurText(r.titel)}](${abs(`/ratgeber/${r.slug}.md`)}): ${nurText(r.listenText)}`).join('\n'),
  ].filter(Boolean).join('\n\n') + '\n';
}

export async function ratgeberMd(slug: string): Promise<string> {
  const seite = await ladeSeite(); const alle = await ladeProdukte(); const r = (await ladeRatgeber()).find((x) => x.slug === slug)!;
  const produkte = r.produkte.map((s) => alle.find((p) => p.slug === s)).filter((p): p is Produkt => Boolean(p));
  const sp = seite.tabellenSpalten;
  const tab = [`| Produkt | Am besten für | ${sp.join(' | ')} |`, `|---|---|${sp.map(() => '---').join('|')}|`]
    .concat(produkte.map((p) => `| ${zelle(p.name)} | ${zelle(nurText(p.geeignetFuer))} | ${sp.map((s) => zelle(fakt(p, s)?.wert ?? '–')).join(' | ')} |`)).join('\n');
  return [
    kopf(seite, `/ratgeber/${slug}`), `# ${nurText(r.titel)}`,
    `${nurText(r.autorZeile)}${r.aktualisiert ? ` Zuletzt aktualisiert: ${datumDe(r.aktualisiert)}.` : ''}`,
    links(r.kurzeAntwort), tab,
    r.schnellwahl.length ? `## ${nurText(r.schnellwahlTitel)}\n\n${r.schnellwahl.map((q, i) => `${i + 1}. ${links(q)}`).join('\n')}` : '',
    ...r.abschnitteVor.map((a) => `## ${nurText(a.titel)}\n\n${links(a.text)}${a.grafikText ? `\n\nGrafik: ${a.grafikText}` : ''}`),
    produkte.length ? `## ${nurText(r.produkteTitel || 'Die Empfehlungen im Detail')}` : '',
    ...produkte.map(produktMd),
    ...(() => { const w = produkte.flatMap((p) => p.fakten.filter((f) => f.widerspruch).map((f) => `| ${zelle(p.name)} | ${zelle(f.feld)} | ${zelle(f.widerspruch)} |`)); return w.length ? [`## Datenabgleich: Wo sich die Quellen widersprechen\n\n| Produkt | Angabe | Was die Quellen sagen |\n|---|---|---|\n${w.join('\n')}`] : []; })(),
    ...r.abschnitteNach.map((a) => `## ${nurText(a.titel)}\n\n${links(a.text)}${a.grafikText ? `\n\nGrafik: ${a.grafikText}` : ''}`),
    r.faq.length ? `## Häufige Fragen\n\n${r.faq.map((f) => `**${nurText(f.q)}**\n${links(f.a)}`).join('\n\n')}` : '',
    `---\n${nurText(r.autorName)}: ${nurText(r.autorBio)} Mehr zur Arbeitsweise: ${abs('/ueber-uns.md')}`,
  ].filter(Boolean).join('\n\n') + '\n';
}

export const SEITEN_MD = ['index', 'ueber-uns', 'werbehinweis', 'impressum', 'datenschutz'] as const;
export async function seiteMd(name: (typeof SEITEN_MD)[number]): Promise<string> {
  const seite = await ladeSeite();
  if (name === 'index') return startMd();
  if (name === 'ueber-uns') {
    const b = await ladeUeberUns();
    return [kopf(seite, '/ueber-uns'), `# ${nurText(b.titel)}`, links(b.intro), `## ${nurText(b.schritteTitel)}`, b.schritte.map((s, i) => `${i + 1}. ${nurText(s)}`).join('\n'), `## ${nurText(b.geldTitel)}`, links(b.geld)].join('\n\n') + '\n';
  }
  const r = await ladeRecht();
  if (name === 'werbehinweis') return [kopf(seite, '/werbehinweis'), '# Werbehinweis', links(r.werbehinweis)].join('\n\n') + '\n';
  if (name === 'datenschutz') return [kopf(seite, '/datenschutz'), '# Datenschutzerklärung', links(r.datenschutz)].join('\n\n') + '\n';
  return [kopf(seite, '/impressum'), '# Impressum', `Angaben gemäß § 5 DDG: ${r.impressumName}, ${r.impressumAnschrift}, ${r.impressumOrt}`, `Kontakt: ${r.impressumEmail}, ${r.impressumKontakt2}`, `Verantwortlich nach § 18 Abs. 2 MStV: ${r.impressumVerantwortlich}`].join('\n\n') + '\n';
}

export async function llmsTxt(): Promise<string> {
  const seite = await ladeSeite(); const ratgeber = await ladeRatgeber(); const werkzeuge = await ladeWerkzeuge();
  return [
    `# ${seite.name}`,
    `> ${nurText(seite.metaBeschreibung)}`,
    `Werbehinweis: ${nurText(seite.werbehinweis)}`,
    `## Inhalte (Markdown)`,
    `- [Startseite](${abs('/index.md')}): Überblick, Vergleichstabelle, Auswahlhilfe`,
    ...ratgeber.map((r) => `- [${nurText(r.titel)}](${abs(`/ratgeber/${r.slug}.md`)}): ${nurText(r.listenText)}`),
    ...(werkzeuge.length ? [`## Werkzeuge`, ...werkzeuge.map((w) => `- [${nurText(w.titel)}](${abs(`/werkzeuge/${w.slug}.md`)}): ${nurText(w.listenText)}`)] : []),
    `## Daten`,
    `- [Produktdaten (JSON)](${abs('/produkte.json')}): alle Produkte mit Angaben, Quell-URL, Prüfdatum, Widersprüchen, Vor- und Nachteilen, Auswahlhilfe-Punkten und gekennzeichneten Affiliate-Links`,
    `## Über die Seite und Rechtliches`,
    `- [Über uns und Arbeitsweise](${abs('/ueber-uns.md')})`,
    `- [Werbehinweis](${abs('/werbehinweis.md')})`,
    `- [Impressum](${abs('/impressum.md')})`,
    `- [Datenschutz](${abs('/datenschutz.md')})`,
    `## Hinweise für KI-Agenten`,
    `- Jede Produktangabe hat eine Quell-URL und ein Prüfdatum. Ein leeres Prüfdatum (null, „offen“) bedeutet: noch nicht geprüft.`,
    `- Links unter ${abs('/go/')} sind bezahlte Affiliate-Links (rel="sponsored"). Sie sind keine neutrale Empfehlung und tragen in allen Fassungen die Kennzeichnung „Werbelink“.`,
    `- Eigene Erfahrung steht nur in Abschnitten mit der Überschrift „Eigene Erfahrung“. Alles andere beruht auf Hersteller- und Händlerangaben mit Quelle.`,
    `- Die HTML-Seiten enthalten JSON-LD (Article, BreadcrumbList, ItemList) ohne Bewertungen.`,
  ].join('\n') + '\n';
}

export async function produkteJson() {
  const seite = await ladeSeite(); const produkte = await ladeProdukte(); const ratgeber = await ladeRatgeber(); const finder = await ladeFinder();
  const ratgeberFuer: Record<string, string> = {};
  for (const r of ratgeber) for (const s of r.produkte) if (s && !ratgeberFuer[s]) ratgeberFuer[s] = r.slug;
  const daten = produkte.flatMap((p) => p.fakten.map((f) => f.geprueft_am)).filter(Boolean) as string[];
  return {
    seite: { name: seite.name, url: abs('/'), sprache: 'de-DE' },
    werbehinweis: nurText(seite.werbehinweis),
    hinweise: [
      'Links unter /go/ sind bezahlte Affiliate-Links (werbung: true).',
      'geprueft_am = null bedeutet: noch nicht geprüft.',
      'Widerspruch zwischen Quellen steht im Feld widerspruch.',
    ],
    inhalte: ratgeber.map((r) => ({ titel: nurText(r.titel), html: abs(`/ratgeber/${r.slug}`), markdown: abs(`/ratgeber/${r.slug}.md`), themen: r.themen, hub: r.hub })),
    neuestes_pruefdatum: daten.length ? daten.sort().at(-1) : null,
    produkte: produkte.map((p) => ({
      id: p.slug, name: p.name, typ: p.typ, am_besten_fuer: nurText(p.geeignetFuer),
      seite: ratgeberFuer[p.slug] ? abs(`/ratgeber/${ratgeberFuer[p.slug]}#p-${p.slug}`) : abs('/'),
      kauflink: { url: abs(`/go/${p.slug}/agent`), werbung: true, rel: 'sponsored nofollow noopener', partnerprogramm: p.partnerprogramm || null },
      angaben: p.fakten.map((f) => ({ feld: f.feld, wert: f.wert, quelle_url: f.quelle_url, geprueft_am: f.geprueft_am || null, widerspruch: f.widerspruch || null })),
      untertitel: nurText(p.untertitel), beschreibung: nurText(p.beschreibung),
      pro: p.pro.map(nurText), contra: p.contra.map(nurText), nicht_kaufen_wenn: nurText(p.nichtKaufenWenn),
      finder_begruendung: nurText(p.finderBegruendung), eigene_erfahrung: erfahrung(p.slug),
      preisverlauf: p.preisverlauf.filter((v) => v.datum && typeof v.preis === 'number').map((v) => ({ datum: v.datum, preis_eur: v.preis, haendler: v.haendler, quelle_url: v.quelle_url })),
      kaeuferhinweise: p.kaeuferhinweise.map((k) => ({ text: k.text, quelle_url: k.quelle_url, abgerufen_am: k.abgerufen_am })),
    })),
    auswahlhilfe: finder?.aktiv ? {
      titel: finder.titel,
      regel: 'Punkte je Antwort addieren; das Produkt mit der höchsten Summe gewinnt, bei Gleichstand das erste in der Reihenfolge.',
      fragen: finder.fragen.map((f) => ({ frage: f.frage, antworten: f.antworten.map((a) => ({ text: a.text, punkte: a.punkte.filter((x) => x.produkt).map((x) => ({ produkt: x.produkt, punkte: x.punkte })) })) })),
    } : null,
  };
}
