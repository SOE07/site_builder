---
name: nische-pruefen
description: Prüft vor dem Bau, ob sich eine deutsche Affiliate-Nische lohnt (Konkurrenz in der deutschen SERP, Partnerprogramme und Provisionen, Risiko durch KI-Antworten, YMYL-Nähe) und gibt eine Punktzahl mit klarer Empfehlung. Nutzen, wenn eine neue Themenidee geprüft werden soll.
argument-hint: "<Thema oder Nische>"
allowed-tools: WebSearch WebFetch Read Write Grep Glob
---

# Nische prüfen

Bewertet ein Thema, bevor Zeit in eine Seite fließt. Ergebnis ist ein Bericht mit Punktzahl und Empfehlung (Go / Bedingt / No-Go).

## Eingaben
- Thema oder Nische (Pflicht), z. B. „Padelschläger für Anfänger“.
- Optional: Budget-Rahmen, Wunsch-Partnerprogramme.

## Arbeitsschritte
1. **YMYL zuerst prüfen.** Berührt das Thema Gesundheit, Finanzen oder Recht (auch indirekt: Nahrungsergänzung, Kredite, Versicherungen, Medikamente, Rechtsberatung)? Dann: Empfehlung No-Go, oder nur mit ausdrücklicher Warnung an den Betreiber und sichtbarem Hinweis auf der Seite. Die Punktzahl ist dann höchstens 49.
2. **Konkurrenz in der deutschen SERP.** Rufe 5–8 kaufnahe Suchanfragen ab („beste X“, „X Vergleich“, „X für Anfänger“, „X kaufen“). Notiere für die Top 10: Wer rankt (Hersteller, Shops, Magazine, große Vergleichsportale, Foren, kleine Nischenseiten)? Wie gut sind die Inhalte? Gibt es schwache oder veraltete Treffer, Foren oder kleine Seiten in den Top 5 (Chance)?
3. **Partnerprogramme und Provisionen.** Suche Programme in `wissen/partnerprogramme.md` und im Netz (Awin, Amazon PartnerNet, Impact, Tradedoubler, Hersteller- und Shop-Programme). Notiere pro Programm: Provision (nur mit Quelle), Cookie-Dauer, Besonderheiten (Preisangabe-Regeln, Kennzeichnungspflichten). Keine Provisionssätze aus dem Gedächtnis nennen.
4. **Risiko durch KI-Antworten.** Prüfe, ob Google für die Suchanfragen KI-Übersichten oder Antwortboxen zeigt und ob die Anfragen eher informativ (hohes Risiko) oder kaufnah mit Produktvergleich (geringeres Risiko) sind. Notiere, was du gesehen hast, ohne Behauptungen über Klickraten zu erfinden.
5. **Machbarkeit.** Gibt es genug Produktdaten mit prüfbaren Quellen? Können wir ohne eigene Tests ehrlich beraten (nach `CLAUDE.md`)? Gibt es mindestens 3–5 relevante Produkte mit Partnerlink?
6. **Punktzahl (0–100):** kaufnahes Suchpotenzial 20, Schwäche der Konkurrenz 20, Provision und Programme 20, geringes KI-Risiko 15, YMYL-Abstand 15, Machbarkeit ohne Eigentest 10. Jede Teilnote mit einem Satz Begründung und Quelle.
7. **Empfehlung:** ab 70 Go, 50–69 Bedingt (mit Bedingungen), unter 50 oder YMYL No-Go. Nenne Namensvorschlag (Kurzname für `seiten/<name>/`) und die ersten drei Artikelideen.

## Ausgabeformat
Markdown-Bericht mit: Kurzfazit (Empfehlung und Punktzahl) · YMYL-Prüfung · SERP-Tabelle (Suchanfrage, Top-Treffer, Einschätzung) · Partnerprogramme (Tabelle mit Quell-URL) · KI-Risiko · Machbarkeit · Punktetabelle · nächste Schritte. Jede Tatsache mit Quell-URL und Abrufdatum.

## Ablageort
`recherche/<thema>.md` (Kleinbuchstaben, Bindestriche). Neue Erkenntnisse zu Programmen oder Regeln zusätzlich in `wissen/partnerprogramme.md` bzw. `wissen/google-richtlinien.md` eintragen (mit Datum).
