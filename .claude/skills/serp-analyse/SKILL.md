---
name: serp-analyse
description: Analysiert vor jedem Artikel die deutschen Top-10-Treffer zur Hauptsuchanfrage und formuliert eine Mehrwert-These – was dieser Artikel bietet, das keiner der rankenden Treffer hat. Ohne diese These startet artikel-schreiben nicht.
argument-hint: "<seitenname> <Haupt-Suchanfrage>"
allowed-tools: WebSearch WebFetch Read Write Grep Glob
---

# SERP-Analyse und Mehrwert-These

## Eingaben
- `<seitenname>`, Haupt-Suchanfrage aus `planung/keywords.md` bzw. `planung/cluster.md`.
- Vorhandene Daten: `src/content/produkte/`, `wissen/fachwissen.md`, `planung/kaeuferfragen.md`.

## Arbeitsschritte
1. Deutsche Top 10 zur Suchanfrage abrufen (Suche, dann die Treffer selbst mit WebFetch öffnen). Was nicht abrufbar ist, als „nicht abrufbar“ vermerken, nicht raten.
2. Je Treffer festhalten: Typ (Shop, Magazin, Vergleichsportal, Forum, Hersteller), Aufbau, genannte Produkte, Datenlage (Quellen? Datum?), Stärken, Lücken, Fehler oder Widersprüche zu Hersteller-Angaben, Behauptungen von Tests ohne Beleg.
3. Suchabsicht bestimmen: Was will die Person nach dem Lesen tun? Welche Fragen stellt Google unter „Ähnliche Fragen“?
4. **Lücken finden:** Fragen, die keiner beantwortet; Daten, die keiner abgleicht; Käufergruppen, die keiner anspricht; Entscheidungshilfen (Rechner, Finder, Diagramme), die fehlen; veraltete Modelle oder Preise bei der Konkurrenz.
5. **Mehrwert-These** formulieren: höchstens drei Sätze, konkret und prüfbar („Als einziger Artikel gleichen wir Gewicht und Balance von Hersteller und drei Shops ab und zeigen die Widersprüche“). Dazu die Bausteine, die sie einlösen (Diagramm, Datenabgleich, Werkzeug, Käuferhinweise, Cluster-Links).
6. Ist keine glaubwürdige These möglich, steht das im Bericht mit der Empfehlung, den Artikel nicht zu schreiben oder anders zuzuschneiden.

## Ausgabeformat
Markdown: Suchabsicht · Tabelle der Top 10 (Rang, URL, Typ, Stärken, Lücken) · Lückenliste · **Mehrwert-These** · Pflicht-Bausteine für den Artikel · Fragen für die FAQ (aus „Ähnliche Fragen“, mit Abrufdatum).

## Ablageort
`seiten/<name>/planung/serp/<artikel-slug>.md`
