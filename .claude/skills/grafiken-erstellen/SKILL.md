---
name: grafiken-erstellen
description: Erstellt eigene, rechtssichere SVG-Grafiken und Vergleichsdiagramme für eine Seite (Formen, Größen, Aufbau, Entscheidungsbäume) im Stil des Seiten-Themes und bindet sie in Ratgeber-Abschnitte ein. Keine fremden Bilder, keine Produktfotos.
argument-hint: "<seitenname> <Ratgeber>"
allowed-tools: Read Write Edit Grep Glob Bash(npm run *)
---

# Grafiken erstellen

## Eingaben
- `<seitenname>`, Ratgeber, `wissen/fachwissen.md`, Produktdaten, Theme (`src/theme/theme.css`).

## Arbeitsschritte
1. **Automatische Diagramme:** Für zahlenbasierte Angaben (Gewicht, Preis, Maße) im Ratgeber unter `diagramme` eintragen (`feld`, `titel`, `einheit`). Die Seite zeichnet sie selbst aus den Fakten, inklusive Spannen und Prüfdatum.
2. **Erklärgrafiken als SVG** für das, was Text schlecht erklärt: Formvergleiche, Größen, Aufbau/Schichten, Entscheidungsbaum, Ablauf. Jede Grafik stützt sich auf `wissen/fachwissen.md` oder Produktdaten; Maße nur, wenn belegt, sonst schematisch und als „schematisch“ beschriftet.
3. SVG-Regeln: `viewBox` setzen, keine festen Breiten, Farben über `currentColor` oder `var(--primary)`, `var(--ink)`, `var(--line)`, Schrift erbt von der Seite, keine eingebetteten Bilder oder Fonts, keine Skripte, Texte auf Deutsch, lesbar bei 360 px Breite.
4. Datei nach `src/grafiken/<name>.svg`; im Ratgeber-Abschnitt `grafik` (Dateiname) und `grafikText` (Beschreibung, auch Alternativtext) setzen.
5. Stil passend zur Seite und anders als auf anderen Seiten (Strichstärke, Ecken, Beschriftungsstil aus `stimme.md`/Theme ableiten).
6. `npm run build` im Seitenordner; Grafik im Browser auf Desktop und Handy prüfen.

## Ausgabeformat
SVG-Dateien plus Einträge im Ratgeber-JSON; kurze Liste: Datei · Aussage · Datenquelle.

## Ablageort
`seiten/<name>/src/grafiken/*.svg`
