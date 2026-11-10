---
name: kaeuferstimmen-sammeln
description: Sammelt aus öffentlichen Käuferberichten (Foren, Reddit, Gutefrage, Shop-Fragen, Rezensionen) wiederkehrende Fragen, Reue-Gründe und Probleme und legt sie sinngemäß mit Quelle ab. Speist FAQ, „Nicht kaufen, wenn“ und den Block „Was Käufer häufig berichten“. Keine Zitate, keine Namen, keine erfundenen Stimmen.
argument-hint: "<seitenname> [Produkte]"
allowed-tools: WebSearch WebFetch Read Write Edit Grep Glob
---

# Käuferstimmen sammeln

## Eingaben
- `<seitenname>`, optional einzelne Produkte; sonst alle Produkte und die Kategorie.

## Arbeitsschritte
1. Öffentliche Quellen durchsuchen: Foren der Nische, Reddit, Gutefrage, Fragen-und-Antworten-Bereiche von Shops, öffentlich sichtbare Rezensionen. Nur Seiten, die tatsächlich abgerufen wurden.
2. Nur **wiederkehrende** Punkte zählen (mindestens zwei unabhängige Berichte), Einzelmeinungen weglassen. Häufigkeit nicht übertreiben („mehrere Käufer berichten“, nicht „alle“).
3. **Sinngemäß** in eigenen Worten zusammenfassen. Keine Anführungszeichen, keine Zitate, keine Nutzernamen, keine Sterne oder Durchschnittsnoten übernehmen.
4. Gesundheits- oder Sicherheitsberichte (Verletzungen, Allergien) nur mit Hinweis weitergeben und den Betreiber informieren.
5. Pro Produkt in `src/content/produkte/<slug>.json` unter `kaeuferhinweise` eintragen: `text`, `quelle_url` (eine repräsentative Quelle), `abgerufen_am`. Höchstens fünf Hinweise pro Produkt.
6. Kategorieweite Fragen und Reue-Gründe in `planung/kaeuferfragen.md` sammeln (für FAQ und Abschnitte).
7. `npm run check:daten` im Seitenordner (prüft Quelle, Datum und Anführungszeichen).

## Ausgabeformat
Je Produkt bis zu fünf Hinweise im Datensatz; `planung/kaeuferfragen.md` mit Tabelle (Frage oder Problem · Häufigkeit grob · Quellen · Abrufdatum).

## Ablageort
`seiten/<name>/src/content/produkte/*.json` (Feld `kaeuferhinweise`) und `seiten/<name>/planung/kaeuferfragen.md`
