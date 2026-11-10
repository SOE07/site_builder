---
name: betrieb-einrichten
description: Richtet den laufenden Betrieb einer veröffentlichten Seite mit geplanten Claude-Code-Aufgaben ein – monatlich Preise und Links, vierteljährlich Inhalte auffrischen und Performance auswerten. Jeder Lauf endet als Pull Request zur Freigabe.
argument-hint: "<seitenname>"
disable-model-invocation: true
allowed-tools: Read Write Edit Grep Glob
---

# Betrieb einrichten

## Voraussetzungen
- Seite ist veröffentlicht, `npm run check:release` grün.
- Die Umgebung der geplanten Aufgabe erreicht die Shop- und Herstellerseiten (Netzwerkfreigabe der Cloud-Umgebung prüfen; sonst schlagen Abrufe fehl).

## Arbeitsschritte
1. Geplante Aufgaben anlegen (Claude Code: geplante Aufgaben/Routinen, je eine frische Sitzung mit diesem Repo). Startzeiten außerhalb 6–9 Uhr Pazifikzeit wählen.
   - **Monatlich:** `/preise-aktualisieren <name>` (Preisverlauf ergänzen, tote Links, PR).
   - **Vierteljährlich:** `/performance-review <name>` (nur wenn Exporte in `daten/` liegen) und danach Auffrischen der drei schwächsten Inhalte nach `planung/performance-*.md`.
   - **Halbjährlich:** `/kaeuferstimmen-sammeln <name>` und `/qualitaet-pruefen <name>`.
2. Jede Aufgabe arbeitet auf eigenem Branch und endet mit einem Pull Request. Nie direkt auf `main`.
3. In `seiten/<name>/planung/betrieb.md` festhalten: welche Aufgaben, wann, letzte Läufe, offene PRs.
4. Exporte: Search-Console-CSV nach `daten/gsc/`, Netzwerkberichte nach `daten/netzwerk/` (nicht im Git, siehe `.gitignore`). Ohne Exporte entfällt die Auswertung.

## Ausgabeformat
`planung/betrieb.md` mit Aufgabenliste (Name · Rhythmus · Befehl · Umgebung) und Hinweisen.

## Ablageort
`seiten/<name>/planung/betrieb.md`
