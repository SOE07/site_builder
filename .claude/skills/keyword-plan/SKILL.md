---
name: keyword-plan
description: Erstellt einen Keyword- und Artikelplan für eine Seite mit Vorrang für kaufnahe Suchanfragen (Vergleich, beste, für Anfänger, Preisklassen) auf Deutsch. Nutzen nach seite-anlegen und vor dem Schreiben.
argument-hint: "<seitenname>"
allowed-tools: WebSearch WebFetch Read Write Grep Glob
---

# Keyword-Plan

## Eingaben
- `<seitenname>` (Ordner in `seiten/`) und der Bericht `recherche/<thema>.md`.

## Arbeitsschritte
1. Sammle Suchanfragen auf Deutsch aus: Google-Vorschlägen und „Ähnliche Fragen“ (abgerufen, nicht erfunden), den Überschriften der Top-Treffer, Händler-Kategorien, Foren. Keine Suchvolumen-Zahlen nennen, die nicht aus einer genannten Quelle stammen. Fehlen Zahlen, steht „Volumen unbekannt“.
2. Sortiere nach Kaufnähe: A = kaufbereit („beste X 2026“, „X Vergleich“, „X unter 100 €“, „X für Anfänger“, „X vs Y“), B = Vorentscheidung („welcher X“, „worauf achten“), C = reine Information (nachrangig). A kommt zuerst.
3. Gruppiere zu Artikeln: pro Artikel eine Haupt-Suchanfrage plus Nebenanfragen. Gleiche Absicht = gleicher Artikel (keine Kannibalisierung).
4. Plane je Artikel: Titel-Entwurf (mit Haupt-Keyword), Absicht, benötigte Produkte, nötige Daten, FAQ-Fragen aus „Ähnliche Fragen“.
5. YMYL-Anfragen markieren und nicht einplanen (siehe `CLAUDE.md`).
6. Reihenfolge: zuerst Hauptvergleich (A), dann Spezialvergleiche, dann Ratgeber.

## Ausgabeformat
Markdown mit Tabelle (Artikel · Haupt-Keyword · Nebenanfragen · Kaufnähe A/B/C · Produkte · Quelle der Anfrage) und einer nummerierten Umsetzungsreihenfolge.

## Weiter
Für neue Seiten danach `themen-cluster` (baut aus dem Plan einen Cluster mit Hub und Verlinkung).

## Ablageort
`seiten/<name>/planung/keywords.md`
