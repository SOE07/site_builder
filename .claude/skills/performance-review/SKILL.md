---
name: performance-review
description: Wertet Search-Console-Exporte und Partnernetzwerk-Berichte einer Seite aus und leitet konkrete Überarbeitungen ab (Inhalte kurz vor Seite 1, schwache Klickraten, Produkte und Platzierungen mit Umsatz). Nutzen vierteljährlich oder nach neuen Exporten.
argument-hint: "<seitenname>"
allowed-tools: Read Write Edit Grep Glob Bash(node scripts/*) Bash(npm run *)
---

# Performance-Review

## Eingaben
- `seiten/<name>/daten/gsc/*.csv` (Search Console → Leistung → Exportieren) und/oder `seiten/<name>/daten/netzwerk/*.csv` (Berichte mit Sub-ID-Spalte). Sub-IDs haben die Form `<seite>-<produkt>-<platz>` und entstehen automatisch, wenn im Produkt `subidParam` gesetzt ist.

## Arbeitsschritte
1. `node scripts/gsc-auswerten.mjs <name>` und `node scripts/netzwerk-auswerten.mjs <name>` (je nach vorhandenen Daten).
2. Für die Top-5-Chancen „kurz vor Seite 1“: `serp-analyse` erneut für die Anfrage, Lücke schließen (Abschnitt, Diagramm, Werkzeug, FAQ), interne Links aus dem Cluster ergänzen.
3. Für „gut platziert, kaum geklickt“: Title und Meta-Beschreibung schärfen (≤ 60 bzw. 120–155 Zeichen), Suchabsicht prüfen.
4. Netzwerk: Produkte ohne Klicks prüfen (veraltet? falsche Zielgruppe?), Platzierungen vergleichen (Tabelle, Finder, Artikel, Agent). Keine Änderungen, die Empfehlungen nach Provision statt nach Eignung sortieren.
5. Neue Suchanfragen ohne passenden Inhalt als Kandidaten in `planung/cluster.md` ergänzen.
6. Änderungen auf eigenem Branch, `npm run check`, Pull Request mit Vorher/Nachher.

## Ausgabeformat
`planung/performance-<datum>.md` und `planung/netzwerk-<datum>.md` (von den Skripten) plus Maßnahmenliste im Pull Request.

## Ablageort
`seiten/<name>/planung/`
