---
name: seite-komplett
description: Baut eine neue Affiliate-Seite von der Nischenidee bis zur prüfbereiten Seite in einem Durchlauf, indem alle Fabrik-Skills in der richtigen Reihenfolge ausgeführt werden. Für den Ausbau vieler Seiten ohne eigenes Fachwissen. Endet mit Qualitätsbericht und Pull Request.
argument-hint: "<Thema> [Kurzname] [Anzahl erster Artikel, Standard 3]"
disable-model-invocation: true
allowed-tools: WebSearch WebFetch Read Write Edit Grep Glob Agent Bash(node scripts/*) Bash(npm *) Bash(git checkout -b *) Bash(git add *) Bash(git commit *)
---

# Seite komplett bauen

Orchestriert die Fabrik. Jede Stufe hat ein festes Ergebnis; scheitert eine Stufe, wird abgebrochen und berichtet, statt Lücken zu füllen.

## Ablauf
1. **Branch:** `seite/<name>/aufbau`.
2. **nische-pruefen** → `recherche/<thema>.md`. Bei No-Go oder YMYL: Abbruch mit Begründung.
3. **seite-anlegen** → `seiten/<name>/`, eigenes Theme, `stimme.md` ausgefüllt.
4. **fachwissen-aufbauen** → `wissen/fachwissen.md`.
5. **themen-cluster** → `planung/cluster.md`; die ersten N Inhalte (Hub zuerst) auswählen.
6. **produkte-recherchieren** für alle Produkte der ersten Inhalte (mit erstem Preisverlauf-Eintrag).
7. **kaeuferstimmen-sammeln** → Käuferhinweise und `planung/kaeuferfragen.md`.
8. Je Inhalt: **serp-analyse** → Mehrwert-These; ohne These Inhalt überspringen.
9. Je Inhalt: **artikel-schreiben** (Agent `autor`), dazu **grafiken-erstellen** und, wenn die These es verlangt, **werkzeug-bauen**.
10. **Finder** auf der Startseite einrichten, wenn ≥ 3 Produkte mit unterschiedlichen Zielgruppen da sind.
11. **qualitaet-pruefen** → Bericht; klar korrigierbare Blocker beheben, Prüfung wiederholen.
12. `node scripts/text-aehnlichkeit.mjs --seite <name>` und `node scripts/theme-aehnlichkeit.mjs` müssen ohne Fehler sein.
13. Commit je Stufe, Pull Request gegen `main` mit Zusammenfassung, Mehrwert-Thesen und offenen Punkten.

## Grenzen
- Angaben, die nur der Betreiber machen kann (Impressum, Partnerkonten und Affiliate-Links, Domain), bleiben Platzhalter und stehen im Bericht unter „Offen“.
- Keine Veröffentlichung: Live geht die Seite erst nach `check:release` und Freigabe des Pull Requests.

## Ausgabeformat
Pull Request plus `seiten/<name>/planung/aufbau.md` (Stufen, Ergebnisse, Abbrüche, offene Punkte).

## Ablageort
`seiten/<name>/` und `recherche/<thema>.md`
