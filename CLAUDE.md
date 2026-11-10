# Affiliate-Fabrik

Dieses Repo baut deutschsprachige Affiliate-Nischenseiten. Alle Seiten entstehen aus
`vorlage/` und liegen in `seiten/<name>/`. Skills, Agents, Hooks und Einstellungen
liegen ausschließlich in `.claude/` dieses Repos. Geheimnisse werden nie committet
(`.env` ist gesperrt, Vorlagen stehen nur in `.env.example`).

## Markt und Sprache
- Zielmarkt Deutschland, Sprache Deutsch. Pro Seite wird Du oder Sie festgelegt und durchgehalten.
- Preise in €, deutsche Rechtslage (siehe `wissen/recht-de.md`).

## Ehrlichkeit (verbindlich)
- Der Betreiber nutzt und testet die Produkte NICHT selbst. Verboten sind Behauptungen eigener
  Erfahrung oder eigener Tests und Formulierungen wie „im Test“, „getestet“, „Testsieger“,
  „wir haben gespielt“, „unser Test“.
- Verboten: Bewertungssterne, Punktenoten, erfundene Zitate, erfundene Nutzerstimmen.
- Eigene Erfahrung steht nur auf der Seite, wenn sie in `seiten/<name>/erfahrung/*.md` eingetragen
  ist, und nur in dem Umfang, den die Datei hergibt.
- Tests Dritter nur mit Quelle und nur als Wiedergabe („laut …“).
- Jede Produktangabe (Gewicht, Preis, Material, Maße, …) steht in den Daten mit Quell-URL und
  Prüfdatum. Widersprechen sich Quellen, wird der Widerspruch auf der Seite offen genannt.
  Keine Angabe ohne Quelle.
- Keine Aussage über die eigene Arbeitsweise, die nicht stimmt (z. B. „wir werten Tests aus“,
  wenn das nicht geschehen ist, oder „von Herstellern unabhängig“, wenn es nicht belegt ist).
- Nichts erfinden: Lässt sich etwas nicht belegen, wird es weggelassen oder als offen markiert.

## Werbekennzeichnung
- Hinweis zu Werbelinks am Seitenanfang jeder Seite UND direkt an jedem Affiliate-Link
  (Sternchen plus Beschriftung „Werbelink“). Alle Affiliate-Links tragen
  `rel="sponsored nofollow noopener"`.
- Affiliate-Links laufen über `/go/[slug]`-Weiterleitungen. Die echte Ziel-URL steht nur im
  Produkt-Datensatz, nie verstreut in Texten.
- Pflichtseiten: Impressum, Datenschutz, Werbehinweis, Über uns. Platzhalter in eckigen Klammern
  müssen vor der Veröffentlichung ersetzt sein (`npm run check:release`).

## Eigenständigkeit der Seiten
- Keine Wiederverwendung von Textbausteinen, Designs oder Autorentexten zwischen verschiedenen
  Seiten. Jede Seite bekommt ein eigenes Theme, eigene Texte und eigene Autorenangaben.
  `referenz/` ist nur Beispiel für Qualität und Aufbau und wird nicht in andere Seiten kopiert.
- Jede Seite in `seiten/<name>/` ist ein eigenständiges Astro-Projekt und separat auf Netlify oder
  Vercel deploybar (Base Directory = `seiten/<name>`). Keine Importe aus anderen Seiten oder
  aus dem Repo-Root.

## SEO und Themenwahl
- Vorrang haben kaufnahe Keywords (Vergleich, „beste“, „für Anfänger“, Preisklassen).
- YMYL-Themen (Gesundheit, Finanzen, Recht) werden abgelehnt oder nur mit ausdrücklicher Warnung
  an den Betreiber und sichtbarem Hinweis auf der Seite bearbeitet.
- Strukturierte Daten ohne Review-Sterne. Selbst gehostete Schriften, kein Tracking.

## Mehrwert statt Masse (Pflicht)
- Vor jedem Artikel steht eine Mehrwert-These aus `serp-analyse` in `seiten/<name>/planung/serp/`:
  Was bietet der Artikel, das keiner der Top-10-Treffer hat? Ohne These wird nicht geschrieben.
- Fachaussagen stammen nur aus `seiten/<name>/wissen/fachwissen.md` (Primärquellen mit Abrufdatum,
  Skill `fachwissen-aufbauen`). Was dort „offen“ ist, wird nicht behauptet.
- Jede Seite hat eine eigene `stimme.md` (Persona, Ton, Tabus). Texte folgen ihr;
  `scripts/text-aehnlichkeit.mjs` darf keine geteilten Textbausteine zwischen Seiten finden.
- Information Gain kommt aus eigenen Daten und Werkzeugen: Datenabgleich zwischen Quellen,
  Preisverlauf aus eigenen Abrufen (nur anhängen, nie ändern), Vergleichsdiagramme aus den Fakten,
  eigene Werkzeuge mit offengelegter Methodik, eigene SVG-Grafiken statt fremder Bilder.
- Käuferhinweise nur wiederkehrend, sinngemäß, mit Quelle und Abrufdatum; keine Zitate, keine
  Namen, keine Übertreibung („mehrere Käufer berichten“, nicht „alle“).
- Inhalte werden als Themen-Cluster geplant (Hub plus Spokes, `themen` pflegen), nicht als Einzelartikel.
- Klicks werden nur über Sub-IDs der Partnernetzwerke ausgewertet (`subidParam`), nie mit eigenem
  Tracking. Empfehlungen richten sich nach Eignung, nie nach Provision.

## Agent-First (Pflicht für jede Seite)
- KI-Agents sollen alles lesen können. Jede Seite liefert deshalb neben dem HTML: `/llms.txt`,
  eine Markdown-Fassung jeder Seite (`/index.md`, `/ratgeber/<slug>.md`, `/ueber-uns.md`,
  `/werbehinweis.md`, `/impressum.md`, `/datenschutz.md`) und `/produkte.json` mit allen Produkten,
  Angaben, Quell-URLs, Prüfdaten, Widersprüchen und Vor- und Nachteilen. Die Dateien entstehen
  aus denselben Inhalten (`src/lib/agent.ts`); sie werden nie von Hand gepflegt und nie entfernt.
- Für Agents gelten dieselben Regeln wie für Menschen: Werbehinweis am Anfang jeder Markdown-Datei,
  jeder `/go/`-Link mit „Werbelink“ im Linktext und `werbung: true` im JSON, keine Bewertungen,
  keine Behauptung eigener Tests. `npm run check` prüft das im gebauten Ergebnis.
- Crawler (auch KI-Crawler) werden nicht ausgesperrt; gesperrt sind nur `/go/`, `/keystatic/`, `/api/`.
- Das Repo ist ebenfalls agent-first: alles liegt als Text, Markdown oder JSON vor, `AGENTS.md`
  gibt die Orientierung. Neue Inhalte gehören in Dateien, nicht nur in Oberflächen.
- Änderungen an `vorlage/` erreichen bestehende Seiten mit `node scripts/vorlage-sync.mjs <name>`
  (Inhalte, Theme und Konfiguration der Seite bleiben unberührt).

## Arbeitsweise
- Jede Aufgabe läuft auf einem eigenen Branch (`feature/…`, `seite/<name>/…`). Am Ende steht ein
  Pull Request gegen `main` mit kurzer Zusammenfassung. Nie direkt auf `main` arbeiten.
- Reihenfolge je Seite: nische-pruefen → seite-anlegen → fachwissen-aufbauen → themen-cluster →
  produkte-recherchieren → kaeuferstimmen-sammeln → je Artikel serp-analyse → artikel-schreiben
  (+ grafiken-erstellen, werkzeug-bauen) → qualitaet-pruefen. Alles in einem Lauf: `seite-komplett`.
  Nach dem Livegang: betrieb-einrichten (preise-aktualisieren, performance-review).
- Rollen: `rechercheur` sammelt Quellen, `autor` schreibt nur aus den vorhandenen Daten.
  `faktenpruefer`, `compliance` und `seo-pruefer` sind reine Leser und ändern nichts.
- Neue Erkenntnisse zu Recht, Google-Richtlinien oder Partnerprogrammen kommen mit Datum und
  Quelle in `wissen/*.md`.
- Hooks prüfen nach Inhaltsänderungen verbotene Phrasen und fehlendes `rel="sponsored"` und vor
  Commits Build und Link-Check. Hook-Meldungen werden behoben, nie umgangen.
- Hooks greifen nur bei Aktionen von Claude. Deshalb laufen dieselben Prüfungen in
  `npm run check` je Seite; vor jedem Pull Request ausführen.

## Befehle (je Seite, im Ordner `seiten/<name>/`)
- `npm install`, `npm run dev` (Keystatic lokal unter /keystatic), `npm run build`
- `npm run check` (Daten, Phrasen, Build, interne Links), `npm run check:release` (zusätzlich
  Platzhalter und Prüfdaten, strenger)
- Neue Seite: `node scripts/neue-seite.mjs <name> "<Anzeigename>"` (macht der Skill `seite-anlegen`)
- Vorlage in bestehende Seite übernehmen: `node scripts/vorlage-sync.mjs <name>`
- Im Repo-Root: `node scripts/text-aehnlichkeit.mjs [--seite <name>]`, `node scripts/theme-aehnlichkeit.mjs`,
  `node scripts/gsc-auswerten.mjs <name>`, `node scripts/netzwerk-auswerten.mjs <name>`

## Struktur
`.claude/` Skills, Agents, Hooks, Settings · `vorlage/` Astro-Keystatic-Starter · `seiten/` fertige
Seiten (je Seite: `stimme.md`, `wissen/fachwissen.md`, `planung/`, `src/werkzeuge/`, `src/grafiken/`; `daten/` für
Exporte, nicht im Git) · `scripts/` Werkzeuge · `wissen/` Recht, Google, Partnerprogramme · `recherche/` Berichte
von nische-pruefen · `referenz/` Beispielmaterial (Padelstart).
