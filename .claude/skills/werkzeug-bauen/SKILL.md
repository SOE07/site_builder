---
name: werkzeug-bauen
description: Baut für eine Seite ein eigenes interaktives Werkzeug (Rechner, Größenberater, Kostenvergleich, Checkliste) als Astro-Komponente mit offengelegter Methodik. Werkzeuge sind Information Gain, ranken eigenständig und werden verlinkt.
argument-hint: "<seitenname> <Werkzeug-Idee>"
allowed-tools: Read Write Edit Grep Glob Bash(npm run *)
---

# Werkzeug bauen

## Eingaben
- `<seitenname>`, Idee (aus `planung/serp/*.md` oder `planung/cluster.md`), `wissen/fachwissen.md`.

## Arbeitsschritte
1. Nutzen klären: Welche Entscheidung erleichtert das Werkzeug? Welche Eingaben kennt die Person wirklich?
2. Formel und Annahmen festlegen. Jede Annahme mit Quelle aus `wissen/fachwissen.md` oder als „Annahme, frei änderbar“ kennzeichnen. Keine Gesundheits-, Finanz- oder Rechtsberatung (YMYL).
3. Komponente `src/werkzeuge/<slug>.astro` schreiben: reines HTML-Formular plus kleines Skript, keine externen Bibliotheken, kein Speichern, kein Tracking, funktioniert ohne Login; ohne JavaScript erklärt ein Hinweis die Formel. Klassen `rechner`, Eingaben mit `label`, Ergebnis in `<output aria-live="polite">`.
4. Eintrag `src/content/werkzeuge/<slug>.json`: Titel, Meta, Kurztext, `komponente`, Einleitung, **Methodik** (Formel, Annahmen, Grenzen), Quellen, `themen` (Cluster).
5. Werkzeug im passenden Ratgeber verlinken (Text-Link, interner Pfad `/werkzeuge/<slug>`), Themen gleich setzen, damit „Passend dazu“ greift.
6. `npm run check` im Seitenordner; Rechnung mit drei Beispielwerten von Hand nachprüfen und im Commit nennen.

## Ausgabeformat
Komponente, Datensatz, Verlinkung; Prüfprotokoll (Eingaben → erwartetes Ergebnis → Ergebnis).

## Ablageort
`seiten/<name>/src/werkzeuge/<slug>.astro` und `seiten/<name>/src/content/werkzeuge/<slug>.json`
