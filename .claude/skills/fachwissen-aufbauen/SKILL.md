---
name: fachwissen-aufbauen
description: Baut für eine Nische, die der Betreiber nicht kennt, eine belegte Fachwissen-Basis auf (Kaufkriterien und warum sie zählen, Glossar, typische Irrtümer, Normen, Sicherheit). Der Autor schreibt Fachaussagen nur aus dieser Datei. Nutzen direkt nach seite-anlegen.
argument-hint: "<seitenname>"
allowed-tools: WebSearch WebFetch Read Write Edit Grep Glob
---

# Fachwissen aufbauen

Ersatz für eigene Expertise: Nicht der Autor „weiß“ etwas, sondern jede Fachaussage steht mit Quelle in einer Datei, die der Faktenprüfer gegenprüft.

## Eingaben
- `<seitenname>`, Bericht `recherche/<thema>.md`.

## Arbeitsschritte
1. Quellen nach Rang sammeln: (a) Normen, Behörden, Verbände, Fachgesellschaften; (b) Hersteller-Dokumentation, technische Datenblätter, Bedienungsanleitungen; (c) Fachbücher und Studien; (d) Fachhandel-Ratgeber nur ergänzend. Foren und Magazine sind keine Quelle für Fachaussagen.
2. Pro Kaufkriterium: Was ist es, wie wird es gemessen, warum ist es für welche Käufergruppe wichtig, welche Werte sind üblich, wo übertreiben Hersteller oder Shops. Jede Aussage mit Quell-URL und Abrufdatum.
3. Glossar der Fachbegriffe (kurz, verständlich, mit Quelle).
4. Typische Irrtümer und Marketing-Begriffe ohne Normbezug („Profi“, „Testsieger-Technologie“) benennen.
5. Sicherheits-, Gesundheits- oder Rechtsbezug markieren. Liegt einer vor: Hinweis für die Seite formulieren und in `CLAUDE.md`-Sinn auf YMYL prüfen.
6. Widersprüche zwischen Quellen offen notieren.
7. Offene Fragen, die sich nicht belegen lassen, als „offen“ führen; der Autor darf sie nicht beantworten.

## Ausgabeformat
Markdown mit Abschnitten: Überblick · Kaufkriterien (je Kriterium: Erklärung, Messgröße, übliche Werte, für wen wichtig, Quellen) · Glossar · Irrtümer und Marketing-Begriffe · Sicherheit/Gesundheit/Recht · Widersprüche · Offene Fragen · Quellenliste mit Abrufdatum.

## Ablageort
`seiten/<name>/wissen/fachwissen.md`
