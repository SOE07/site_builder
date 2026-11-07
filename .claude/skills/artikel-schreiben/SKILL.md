---
name: artikel-schreiben
description: Schreibt einen Ratgeber- oder Vergleichsartikel für eine Seite aus den vorhandenen Produktdaten und dem Keyword-Plan, ehrlich und ohne Behauptung eigener Tests oder Erfahrung. Nutzen nach produkte-recherchieren.
argument-hint: "<seitenname> <Artikel aus dem Keyword-Plan>"
allowed-tools: Read Write Edit Grep Glob
---

# Artikel schreiben

Die Aufgabe wird vom Subagenten `autor` ausgeführt; Fakten prüft danach `faktenpruefer`.

## Eingaben
- `<seitenname>`, der Artikel aus `planung/keywords.md`, vorhandene Produktdatensätze.
- Optional: `erfahrung/*.md` des Betreibers.

## Arbeitsschritte
1. Lies `CLAUDE.md`, den Keyword-Plan und alle benötigten Produktdatensätze. Schreibe **nur aus diesen Daten**. Fehlt eine Angabe, geht es zurück zu `produkte-recherchieren`.
2. Aufbau: Titel mit Haupt-Keyword · kurze Antwort (Empfehlung nach Nutzertyp) · Vergleichstabelle (kommt aus den Produktdaten) · Schnellauswahl · Grundlagen („Worauf achten“) · je Produkt: Beschreibung, Dafür/Dagegen, **„Nicht kaufen, wenn …“**, Widersprüche offen benennen, Datenquellen · häufige Fehler · FAQ aus „Ähnliche Fragen“.
3. Stil: eigene Formulierungen, keine Textbausteine aus anderen Seiten, keine Floskeln. Du/Sie wie in `seite.config.json`. Konkret statt blumig. Empfehlungen nach Spielertyp oder Anwendung, nicht als Rangliste mit Noten.
4. Verboten (Hook prüft): „im Test“, „getestet“, „Testsieger“, „wir haben gespielt“, „unser Test“, Sterne, Noten, erfundene Zitate und Nutzerstimmen. Aussagen über die Arbeitsweise nur, wenn sie stimmen. Eigene Erfahrung nur aus `erfahrung/<slug>.md`.
5. Wertende Aussagen („besonders armschonend“) nur, wenn eine Quelle sie trägt; sonst als Herstellerangabe formulieren („laut Hersteller …“) oder streichen.
6. Affiliate-Links ausschließlich über `/go/<slug>` (Komponente `AffiliateLink`). Keine Ziel-URLs im Fließtext.
7. Title (≤ 60 Zeichen), Meta-Beschreibung (120–155 Zeichen), eine H1, sinnvolle H2.
8. Artikel in `src/content/ratgeber/<slug>.json` schreiben, `npm run check` im Seitenordner ausführen, danach `qualitaet-pruefen`.

## Ausgabeformat
Ratgeber-Datensatz (JSON nach `keystatic.config.ts`) und eine kurze Liste „Behauptungen und ihre Quelle“ (Satz → Produktfeld/URL).

## Ablageort
`seiten/<name>/src/content/ratgeber/<slug>.json`
