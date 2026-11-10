---
name: produkte-recherchieren
description: Recherchiert Produkte für eine Seite und legt sie als Produktdatensätze an. Jede Angabe (Gewicht, Preis, Material, Maße, …) bekommt Quell-URL und Prüfdatum, Widersprüche zwischen Quellen werden offen vermerkt. Nutzen vor artikel-schreiben und bei neuen Produkten.
argument-hint: "<seitenname> <Produkte oder Kategorie>"
allowed-tools: WebSearch WebFetch Read Write Edit Grep Glob
---

# Produkte recherchieren

## Eingaben
- `<seitenname>`; Produktliste oder Kategorie; `planung/keywords.md` für den Zweck.

## Arbeitsschritte
1. Für jedes Produkt mindestens **zwei unabhängige Quellen** suchen: Herstellerseite zuerst (maßgeblich), dazu mindestens einen Händler. Erst abrufen, dann eintragen. Was nicht abrufbar war, wird nicht eingetragen.
2. Pro Angabe einen Fakt anlegen: `feld`, `wert`, `quelle_url`, `geprueft_am` (heutiges Datum, `YYYY-MM-DD`), `widerspruch`. Preise sind Zeitangaben: Händler und Datum immer festhalten, Preisspanne nur aus abgerufenen Werten.
3. **Widersprüche**: Weichen Quellen ab (z. B. 340–360 g vs. 355–375 g), den abweichenden Wert und beide Quellen im Feld `widerspruch` benennen. Im Wert selbst die Spanne oder „Angaben schwanken“ angeben. Die Herstellerangabe hat Vorrang und wird als solche benannt.
4. **Keine Bewertung durch eigene Erfahrung.** Vor- und Nachteile nur aus den Quellen ableiten (Herstellerangaben, Händlerbeschreibungen, ausdrücklich zitierte Tests Dritter mit URL). Jede Wertung muss auf eine Quelle zurückführbar sein, sonst weglassen.
4b. **Preisverlauf starten:** Für jeden abgerufenen Händlerpreis einen Eintrag in `preisverlauf` anlegen (`datum` heute, `preis` als Zahl, `haendler`, `quelle_url`). Nie Einträge löschen oder ändern.
5. Partnerlink: Ziel-URL des Partnerprogramms nur eintragen, wenn der Betreiber sie geliefert hat. Sonst die Produktseite des Händlers als vorläufiges Ziel und in der Zusammenfassung als „Affiliate-Link fehlt“ melden. Unterstützt das Netzwerk Sub-IDs, `subidParam` setzen (z. B. `clickref` bei Awin, `ascsubtag` bei Amazon; laut Programmbedingungen prüfen und in `wissen/partnerprogramme.md` vermerken).
6. Datensatz in `src/content/produkte/<slug>.json` schreiben (Felder siehe `keystatic.config.ts`), Reihenfolge festlegen, danach `npm run check:daten` im Seitenordner.
7. Rechercheprotokoll ergänzen: was abgerufen wurde, was nicht erreichbar war, welche Fragen offen sind.

## Ausgabeformat
Produktdatensätze (JSON) plus Zusammenfassungstabelle: Produkt · Anzahl Fakten · Widersprüche · offene Punkte.

## Ablageort
`seiten/<name>/src/content/produkte/<slug>.json`; Protokoll in `seiten/<name>/planung/quellen.md`.
