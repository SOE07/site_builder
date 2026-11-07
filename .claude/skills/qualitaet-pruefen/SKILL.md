---
name: qualitaet-pruefen
description: Prüft eine Seite vor der Veröffentlichung: automatische Skripte (Daten, Phrasen, Build, Links) plus die drei Prüf-Agents faktenpruefer, compliance und seo-pruefer. Erzeugt einen Bericht mit Fehlern, Warnungen und offenen Punkten und ergänzt neue Erkenntnisse in wissen/. Nutzen nach artikel-schreiben und vor jedem Pull Request.
argument-hint: "<seitenname>"
allowed-tools: Read Write Edit Grep Glob Bash(npm run *) Bash(node scripts/*) Agent
---

# Qualität prüfen

## Eingaben
- `<seitenname>` (Ordner in `seiten/`).

## Arbeitsschritte
1. **Automatik:** im Seitenordner `npm run check:release` ausführen (strenge Datenprüfung inkl. Platzhalter und Prüfdaten, Phrasen-Prüfung, Build, Werbekennzeichnung im HTML, Link-Check intern). Im Repo-Root `node scripts/theme-aehnlichkeit.mjs`. Optional `npm run links:extern` (externe und Partner-Ziele; braucht Internet).
2. **Agents parallel starten** (jeweils mit Seitenname):
   - `faktenpruefer`: jede Tatsachenaussage gegen Produktdaten und Quellen.
   - `compliance`: Impressum, Werbekennzeichnung, DSGVO, UWG, Googles Spam- und Qualitätsrichtlinien.
   - `seo-pruefer`: Titel, Meta, Überschriften, interne Links, strukturierte Daten, Kaufnähe.
3. Ergebnisse zusammenführen und nach Schwere sortieren: **Blocker** (darf so nicht online), **Wichtig**, **Hinweis**. Doppelte Befunde zusammenfassen. Nichts beschönigen und keine Befunde erfinden.
4. Blocker, die klar korrigierbar sind (z. B. verbotene Phrase, fehlende Kennzeichnung), im Branch beheben und die Prüfung wiederholen. Inhaltliche Entscheidungen (Fakten ohne Quelle, fehlende Betreiberdaten) nicht selbst erfinden, sondern als offene Punkte an den Betreiber melden.
5. Neue Erkenntnisse zu Recht, Google oder Programmen mit Datum und Quelle in `wissen/recht-de.md`, `wissen/google-richtlinien.md`, `wissen/partnerprogramme.md` eintragen.
6. Bericht schreiben.

## Ausgabeformat
Markdown: Gesamturteil (veröffentlichbar ja/nein) · Ergebnis der Skripte · Befunde je Agent mit Datei und Zeile bzw. Feld · behobene Punkte · offene Punkte für den Betreiber (mit konkreter Frage) · Ergänzungen in `wissen/`.

## Ablageort
`seiten/<name>/planung/qualitaetsbericht.md`
