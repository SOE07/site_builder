// Leere Inhalts-Startdateien für eine neue Seite. Alle [Platzhalter] müssen vor der Veröffentlichung ersetzt werden.
export function skeleton(name, anzeigename) {
  return {
    'src/content/seite.json': {
      name: anzeigename,
      metaTitel: `[Browser-Titel] | ${anzeigename}`,
      metaBeschreibung: '[Meta-Beschreibung, 120–155 Zeichen, mit Haupt-Keyword]',
      werbehinweis: '[Werbehinweis für den Seitenanfang in eigenen Worten: Links mit * sind Werbelinks, Provision, Preis ändert sich nicht]',
      heroTitel: '[Überschrift der Startseite]',
      heroText: '[Einleitung in ein bis zwei Sätzen]',
      heroPunkte: ['[Stichpunkt 1]', '[Stichpunkt 2]'],
      empfehlungenTitel: '[Überschrift Empfehlungen]',
      empfehlungenText: '[Text zu den Empfehlungen]',
      tabellenSpalten: ['Preis'],
      tabellenHinweis: '[Hinweis unter der Tabelle in eigenen Worten: Quellen, Prüfdatum, Preis beim Händler maßgeblich]',
      ratgeberTitel: 'Ratgeber',
      geplant: [],
      fussText: `© ${new Date().getFullYear()} ${anzeigename}. [Kurzer Zusatz zur Seite]`,
    },
    'src/content/ueber-uns.json': {
      titel: '[Überschrift Über uns]',
      intro: `${anzeigename} ist [Beschreibung der Seite]. Hinter der Seite steht [Name] aus [Stadt]. Wir nutzen die Produkte nicht selbst, sondern recherchieren und bereiten die Kaufentscheidung auf.`,
      schritteTitel: '[Überschrift Vorgehen]',
      schritte: ['[Tatsächliches Vorgehen beschreiben, nur was wirklich geschieht]'],
      geldTitel: '[Überschrift Geld]',
      geld: '[Wie die Seite Geld verdient, in eigenen Worten]',
    },
    'src/content/recht.json': {
      impressumName: '[Vor- und Nachname]',
      impressumAnschrift: '[Ladungsfähige Anschrift]',
      impressumOrt: '[PLZ Ort]',
      impressumEmail: '[E-Mail-Adresse]',
      impressumKontakt2: '[Telefon oder Kontaktformular]',
      impressumVerantwortlich: '[Vor- und Nachname, Anschrift wie oben]',
      werbehinweis: 'Mit * gekennzeichnete Links sind Werbe- bzw. Affiliate-Links. Klickst du auf einen solchen Link und kaufst etwas, erhalten wir eine Provision vom Händler. Für dich ändert sich der Preis nicht.\n\nWir nehmen am Partnerprogramm von [Partnerprogramm/Netzwerk] teil.',
      datenschutz: '[Vor Veröffentlichung mit einem Datenschutz-Generator erstellen. Aufzunehmen sind mindestens Hosting, Affiliate-Weiterleitungen, eingebundene Schriften (selbst gehostet), Server-Logfiles und gegebenenfalls weitere Dienste.]',
    },
    'src/content/finder.json': { aktiv: false, titel: 'Finder', fragen: [] },
  };
}
