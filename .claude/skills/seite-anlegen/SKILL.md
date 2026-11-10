---
name: seite-anlegen
description: Legt eine neue Affiliate-Seite als eigenständiges Astro-Projekt unter seiten/<name>/ aus vorlage/ an, erzeugt ein eigenes, zur Nische passendes Theme und füllt die Pflichtseiten. Nur nach einer positiven nische-pruefen-Empfehlung nutzen.
argument-hint: "<name> \"<Anzeigename>\" [Domain]"
disable-model-invocation: true
allowed-tools: Read Write Edit Bash(node scripts/*) Bash(npm *) Bash(git checkout -b *) Grep Glob
---

# Seite anlegen

## Eingaben
- `<name>`: Kurzname in Kleinbuchstaben und Bindestrichen (wird Ordnername).
- Anzeigename der Seite, optional Domain und Anrede (du/Sie).
- Der Bericht `recherche/<thema>.md` aus `nische-pruefen` (Empfehlung Go oder Bedingt).

## Arbeitsschritte
1. Branch anlegen: `seite/<name>/anlegen` (siehe `CLAUDE.md`).
2. `node scripts/neue-seite.mjs <name> "<Anzeigename>" --domain <url> --anrede <du|Sie>` ausführen. Das Skript kopiert `vorlage/` (ohne Demo-Inhalte), erzeugt ein Theme aus Farben, Schriftpaar und Layout-Varianten und legt leere Pflichtseiten an. Es würfelt neu, wenn das Theme einer anderen Seite zu ähnlich ist.
3. **Eigenes Design für die Nische entwerfen.** Öffne `seiten/<name>/src/theme/theme.css` und `theme.json` und passe an: Farbwelt zur Nische (nicht die der anderen Seiten), Überschriften-Stil, Tabellen- und Kartenlook, Kopfbereich. Das gesamte Design steckt in dieser Datei plus `theme.json`. Keine Fremd-Schriften einbinden; neue Schriften nur als `@fontsource/*`-Pakete (`npm install`).
4. **Pflichtseiten füllen**: Impressum, Datenschutz, Werbehinweis und Über uns stehen in `src/content/recht.json` und `ueber-uns.json`. Werbehinweis-Text und „Über uns“ in eigenen Worten für diese Seite formulieren (keine Kopie aus anderen Seiten). Persönliche Angaben (Name, Anschrift, E-Mail, Programm) bleiben als `[Platzhalter]`, bis der Betreiber sie liefert. Nichts erfinden. Die Datenschutzerklärung nicht „frei erfinden“: Platzhalter lassen und auf einen Generator verweisen, siehe `wissen/recht-de.md`.
5. `cd seiten/<name> && npm install && npm run build` ausführen und `node scripts/theme-aehnlichkeit.mjs` im Repo-Root: keine Meldung „ZU ÄHNLICH“.
6. Prüfen, dass der Build `llms.txt`, `produkte.json` und die Markdown-Fassungen (`index.md`, …) im Ordner `dist/` erzeugt (Agent-First, siehe `CLAUDE.md`).
7. `wissen/recht-de.md` und `wissen/partnerprogramme.md` um neue Erkenntnisse ergänzen (mit Datum).
8. Committen (Hook baut und prüft), Pull Request gegen `main`.

## Ausgabeformat
Kurze Zusammenfassung: Ordner, Theme-Merkmale (Schriften, Farben, Layout), offene Platzhalter, nächster Schritt (`keyword-plan`).

## Ablageort
`seiten/<name>/` (eigenständiges Astro-Projekt, Base Directory beim Deployment = `seiten/<name>`).
