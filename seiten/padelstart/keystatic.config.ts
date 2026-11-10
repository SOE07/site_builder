import { config, collection, singleton, fields } from '@keystatic/core';
import cfg from './seite.config.json';

// Lokal: Inhalte werden direkt in die Dateien geschrieben (npm run dev -> /keystatic).
// Produktion: GitHub-Modus mit Pfad seiten/<name> (Umgebungsvariablen siehe .env.example).
const storage =
  process.env.KEYSTATIC_STORAGE === 'github'
    ? ({
        kind: 'github',
        repo: { owner: cfg.github.owner, name: cfg.github.repo },
        pathPrefix: cfg.pfad,
      } as const)
    : ({ kind: 'local' } as const);

const liste = (label: string, itemLabel?: string) =>
  fields.array(fields.text({ label: itemLabel ?? 'Eintrag', multiline: true }), {
    label,
    itemLabel: (p) => (p.value || '').slice(0, 60) || 'Neuer Eintrag',
  });

const paare = (label: string, a: string, b: string) =>
  fields.array(
    fields.object({
      titel: fields.text({ label: a }),
      text: fields.text({ label: b, multiline: true }),
    }),
    { label, itemLabel: (p) => p.fields.titel.value || 'Neuer Eintrag' },
  );

const abschnitte = (label: string) =>
  fields.array(
    fields.object({
      titel: fields.text({ label: 'Überschrift' }),
      text: fields.text({ label: 'Text', multiline: true }),
      grafik: fields.text({ label: 'Grafik (optional): Dateiname in src/grafiken/, z. B. formen.svg' }),
      grafikText: fields.text({ label: 'Grafik: Beschreibung (Alternativtext und Bildunterschrift)' }),
    }),
    { label, itemLabel: (p) => p.fields.titel.value || 'Neuer Abschnitt' },
  );

const themen = () =>
  fields.array(fields.text({ label: 'Thema' }), { label: 'Themen-Cluster (gleiche Themen werden untereinander verlinkt)', itemLabel: (p) => p.value || 'Thema' });

export default config({
  storage,
  ui: { brand: { name: cfg.anzeigename } },
  singletons: {
    seite: singleton({
      label: 'Startseite und Grunddaten',
      path: 'src/content/seite',
      format: 'json',
      schema: {
        name: fields.text({ label: 'Name der Seite' }),
        metaTitel: fields.text({ label: 'Browser-Titel (SEO)' }),
        metaBeschreibung: fields.text({ label: 'Meta-Beschreibung (SEO)', multiline: true }),
        werbehinweis: fields.text({ label: 'Werbehinweis am Seitenanfang', multiline: true }),
        heroTitel: fields.text({ label: 'Überschrift' }),
        heroText: fields.text({ label: 'Einleitung', multiline: true }),
        heroPunkte: liste('Stichpunkte', 'Stichpunkt'),
        empfehlungenTitel: fields.text({ label: 'Überschrift Empfehlungen' }),
        empfehlungenText: fields.text({ label: 'Text Empfehlungen', multiline: true }),
        tabellenSpalten: fields.array(fields.text({ label: 'Feldname' }), {
          label: 'Spalten der Vergleichstabelle (Feldnamen aus den Produkt-Fakten, z. B. Gewicht, Preis)',
          itemLabel: (p) => p.value || 'Spalte',
        }),
        tabellenHinweis: fields.text({ label: 'Hinweis unter der Tabelle', multiline: true }),
        ratgeberTitel: fields.text({ label: 'Überschrift Ratgeber-Liste' }),
        geplant: paare('Geplante Ratgeber (optional, „erscheint in Kürze“)', 'Titel', 'Kurztext'),
        fussText: fields.text({ label: 'Fußzeile' }),
      },
    }),
    ueberUns: singleton({
      label: 'Über uns',
      path: 'src/content/ueber-uns',
      format: 'json',
      schema: {
        titel: fields.text({ label: 'Überschrift' }),
        intro: fields.text({ label: 'Einleitung', multiline: true }),
        schritteTitel: fields.text({ label: 'Überschrift Vorgehen' }),
        schritte: liste('Schritte', 'Schritt'),
        geldTitel: fields.text({ label: 'Überschrift Geld' }),
        geld: fields.text({ label: 'Text Geld', multiline: true }),
      },
    }),
    recht: singleton({
      label: 'Rechtliches',
      path: 'src/content/recht',
      format: 'json',
      schema: {
        impressumName: fields.text({ label: 'Impressum: Name' }),
        impressumAnschrift: fields.text({ label: 'Impressum: Anschrift' }),
        impressumOrt: fields.text({ label: 'Impressum: PLZ und Ort' }),
        impressumEmail: fields.text({ label: 'Impressum: E-Mail' }),
        impressumKontakt2: fields.text({ label: 'Impressum: zweite schnelle Kontaktmöglichkeit (Telefon oder Link zum Kontaktformular)' }),
        impressumVerantwortlich: fields.text({ label: 'Verantwortlich nach § 18 Abs. 2 MStV' }),
        werbehinweis: fields.text({ label: 'Werbehinweis (Absätze durch Leerzeile)', multiline: true }),
        datenschutz: fields.text({ label: 'Datenschutzerklärung (Absätze durch Leerzeile)', multiline: true }),
      },
    }),
    finder: singleton({
      label: 'Produkt-Finder (optional)',
      path: 'src/content/finder',
      format: 'json',
      schema: {
        aktiv: fields.checkbox({ label: 'Finder auf der Startseite anzeigen', defaultValue: false }),
        titel: fields.text({ label: 'Titel' }),
        fragen: fields.array(
          fields.object({
            frage: fields.text({ label: 'Frage' }),
            antworten: fields.array(
              fields.object({
                text: fields.text({ label: 'Antworttext' }),
                punkte: fields.array(
                  fields.object({
                    produkt: fields.relationship({ label: 'Produkt', collection: 'produkte' }),
                    punkte: fields.integer({ label: 'Punkte', defaultValue: 1 }),
                  }),
                  { label: 'Punkte je Produkt (höchste Summe gewinnt, bei Gleichstand das erste Produkt)', itemLabel: (p) => `${p.fields.produkt.value ?? '?'}: ${p.fields.punkte.value}` },
                ),
              }),
              { label: 'Antworten', itemLabel: (p) => p.fields.text.value || 'Antwort' },
            ),
          }),
          { label: 'Fragen', itemLabel: (p) => p.fields.frage.value || 'Frage' },
        ),
      },
    }),
  },
  collections: {
    produkte: collection({
      label: 'Produkte',
      path: 'src/content/produkte/*',
      slugField: 'name',
      format: 'json',
      schema: {
        name: fields.slug({ name: { label: 'Produktname' } }),
        reihenfolge: fields.integer({ label: 'Reihenfolge', defaultValue: 1 }),
        typ: fields.text({ label: 'Typ / Kategorie (Kurztext, z. B. „Tropfen“)' }),
        geeignetFuer: fields.text({ label: 'Am besten für' }),
        affiliateUrl: fields.text({ label: 'Ziel-Link (Affiliate-Link, läuft über /go/<slug>)' }),
        partnerprogramm: fields.text({ label: 'Partnerprogramm (z. B. Awin, Amazon)' }),
        subidParam: fields.text({ label: 'Sub-ID-Parameter des Netzwerks (z. B. clickref bei Awin, ascsubtag bei Amazon; leer = keiner)' }),
        symbolSvg: fields.text({ label: 'Symbol als Inline-SVG (optional, selbst erstellt)', multiline: true }),
        fakten: fields.array(
          fields.object({
            feld: fields.text({ label: 'Angabe (z. B. Gewicht, Preis, Material)' }),
            wert: fields.text({ label: 'Wert' }),
            quelle_url: fields.text({ label: 'Quell-URL' }),
            geprueft_am: fields.date({ label: 'Geprüft am' }),
            widerspruch: fields.text({ label: 'Widerspruch zwischen Quellen (offen benennen, sonst leer)', multiline: true }),
          }),
          { label: 'Produktangaben mit Quelle', itemLabel: (p) => `${p.fields.feld.value}: ${p.fields.wert.value}` },
        ),
        untertitel: fields.text({ label: 'Untertitel im Ratgeber' }),
        beschreibung: fields.text({ label: 'Beschreibung (nur belegte Aussagen)', multiline: true }),
        hinweis: fields.text({ label: 'Zusatzhinweis (optional)', multiline: true }),
        pro: liste('Das spricht dafür', 'Punkt'),
        contra: liste('Das spricht dagegen', 'Punkt'),
        nichtKaufenWenn: fields.text({ label: '„Nicht kaufen, wenn …“' }),
        finderBegruendung: fields.text({ label: 'Begründung im Finder', multiline: true }),
        preisverlauf: fields.array(
          fields.object({
            datum: fields.date({ label: 'Datum des Abrufs' }),
            preis: fields.number({ label: 'Preis in € (Zahl)' }),
            haendler: fields.text({ label: 'Händler' }),
            quelle_url: fields.text({ label: 'Quell-URL' }),
          }),
          { label: 'Preisverlauf (wird von preise-aktualisieren ergänzt, nie überschrieben)', itemLabel: (p) => `${p.fields.datum.value ?? '?'}: ${p.fields.preis.value ?? '?'} € (${p.fields.haendler.value})` },
        ),
        kaeuferhinweise: fields.array(
          fields.object({
            text: fields.text({ label: 'Hinweis sinngemäß zusammengefasst (kein Zitat, keine Namen)', multiline: true }),
            quelle_url: fields.text({ label: 'Quell-URL (Forum, Shop-Fragen, Reddit …)' }),
            abgerufen_am: fields.date({ label: 'Abgerufen am' }),
          }),
          { label: 'Was Käufer berichten (nur mit Quelle)', itemLabel: (p) => (p.fields.text.value || '').slice(0, 60) || 'Hinweis' },
        ),
      },
    }),
    werkzeuge: collection({
      label: 'Werkzeuge und Rechner',
      path: 'src/content/werkzeuge/*',
      slugField: 'titel',
      format: 'json',
      schema: {
        titel: fields.slug({ name: { label: 'Titel' } }),
        metaTitel: fields.text({ label: 'Browser-Titel (SEO)' }),
        metaBeschreibung: fields.text({ label: 'Meta-Beschreibung (SEO)', multiline: true }),
        listenText: fields.text({ label: 'Kurztext in Listen' }),
        komponente: fields.text({ label: 'Komponente: Dateiname in src/werkzeuge/ ohne .astro' }),
        einleitung: fields.text({ label: 'Einleitung', multiline: true }),
        methodik: fields.text({ label: 'So rechnet das Werkzeug (Formel, Annahmen, Grenzen)', multiline: true }),
        quellen: fields.array(fields.object({ text: fields.text({ label: 'Beschreibung' }), url: fields.text({ label: 'URL' }) }), { label: 'Quellen für Annahmen', itemLabel: (p) => p.fields.text.value || 'Quelle' }),
        themen: themen(),
      },
    }),
    ratgeber: collection({
      label: 'Ratgeber',
      path: 'src/content/ratgeber/*',
      slugField: 'titel',
      format: 'json',
      schema: {
        titel: fields.slug({ name: { label: 'Überschrift' } }),
        metaTitel: fields.text({ label: 'Browser-Titel (SEO)' }),
        metaBeschreibung: fields.text({ label: 'Meta-Beschreibung (SEO)', multiline: true }),
        listenText: fields.text({ label: 'Kurztext in der Ratgeber-Liste' }),
        autorZeile: fields.text({ label: 'Autorenzeile' }),
        aktualisiert: fields.date({ label: 'Zuletzt aktualisiert' }),
        kurzeAntwort: fields.text({ label: 'Kurze Antwort', multiline: true }),
        schnellwahlTitel: fields.text({ label: 'Überschrift Schnellauswahl' }),
        schnellwahl: liste('Schnellauswahl', 'Punkt'),
        themen: themen(),
        hub: fields.checkbox({ label: 'Hub-Artikel dieses Themen-Clusters (wird zuerst verlinkt)', defaultValue: false }),
        diagramme: fields.array(
          fields.object({
            feld: fields.text({ label: 'Angabe aus den Produkt-Fakten (z. B. Gewicht, Preis)' }),
            titel: fields.text({ label: 'Titel des Diagramms' }),
            einheit: fields.text({ label: 'Einheit (z. B. g, €)' }),
          }),
          { label: 'Vergleichsdiagramme (werden aus den Fakten erzeugt)', itemLabel: (p) => p.fields.titel.value || p.fields.feld.value || 'Diagramm' },
        ),
        abschnitteVor: abschnitte('Abschnitte vor den Produkten'),
        produkteTitel: fields.text({ label: 'Überschrift über den Produkten (z. B. „Die vier Schläger im Überblick“)' }),
        produkte: fields.array(fields.relationship({ label: 'Produkt', collection: 'produkte' }), {
          label: 'Produkte in diesem Ratgeber (Reihenfolge)',
          itemLabel: (p) => p.value ?? 'Produkt',
        }),
        abschnitteNach: abschnitte('Abschnitte nach den Produkten'),
        faq: fields.array(
          fields.object({ q: fields.text({ label: 'Frage' }), a: fields.text({ label: 'Antwort', multiline: true }) }),
          { label: 'Häufige Fragen', itemLabel: (p) => p.fields.q.value || 'Frage' },
        ),
        autorName: fields.text({ label: 'Autor' }),
        autorBio: fields.text({ label: 'Autor-Beschreibung', multiline: true }),
      },
    }),
  },
});
