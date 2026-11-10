---
name: themen-cluster
description: Plant für eine Seite einen Themen-Cluster aus 15–30 Inhalten (Hub-Artikel, Vergleiche, Ratgeber, Werkzeuge) mit kaufnahen Suchanfragen zuerst, interner Verlinkung und Reihenfolge. Nutzen nach keyword-plan oder statt ihm bei neuen Seiten.
argument-hint: "<seitenname>"
allowed-tools: WebSearch WebFetch Read Write Edit Grep Glob
---

# Themen-Cluster

## Eingaben
- `<seitenname>`, `planung/keywords.md` (falls vorhanden), `wissen/fachwissen.md`, `recherche/<thema>.md`.

## Arbeitsschritte
1. Hub bestimmen: der breiteste kaufnahe Vergleich (z. B. „X für Anfänger“). Er bekommt `hub: true`.
2. Spokes ableiten: Preisklassen („unter 100 €“), Zielgruppen, Produkt-gegen-Produkt, Zubehör, Pflege, „worauf achten“, Werkzeuge. Jede Suchabsicht genau einmal (keine Kannibalisierung).
3. Pro Inhalt: Titel-Entwurf, Haupt-Suchanfrage, Absicht, Kaufnähe A/B/C, Typ (Ratgeber oder Werkzeug), benötigte Produkte und Daten, `themen`-Schlagworte, Links zu und von welchen Inhalten.
4. Reihenfolge: Hub zuerst, dann A-Anfragen, dann Werkzeuge, dann B/C. Pro Inhalt prüfen, ob eine Mehrwert-These realistisch ist (sonst streichen).
5. YMYL-Inhalte markieren und nicht einplanen.
6. Themen-Schlagworte so wählen, dass „Passend dazu“ sinnvolle Gruppen bildet (3–6 Schlagworte pro Seite, wiederverwendet).

## Ausgabeformat
Markdown: Hub · Tabelle aller Inhalte (Nr. · Titel · Suchanfrage · Kaufnähe · Typ · Themen · verlinkt mit) · Reihenfolge · Linkplan.

## Ablageort
`seiten/<name>/planung/cluster.md`
