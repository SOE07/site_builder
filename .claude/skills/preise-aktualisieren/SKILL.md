---
name: preise-aktualisieren
description: Aktualisiert Preise und andere veränderliche Produktangaben einer Seite, findet tote Links und Partnerziele und liefert die Änderungen als Pull Request. Nutzen alle paar Wochen oder wenn Preise veraltet sind (Prüfdatum älter als 90 Tage).
argument-hint: "<seitenname>"
disable-model-invocation: true
allowed-tools: WebFetch WebSearch Read Edit Write Grep Glob Bash(npm run *) Bash(node scripts/*) Bash(git checkout -b *) Bash(git add *) Bash(git commit *)
---

# Preise aktualisieren

## Eingaben
- `<seitenname>`.

## Arbeitsschritte
1. Branch anlegen: `seite/<name>/preise-<JJJJ-MM>`.
2. Alle Produktdatensätze durchgehen und die Fakten mit `feld` Preis (sowie Verfügbarkeit, Modelljahr, Gewicht, falls sich Quellen geändert haben) erneut an der angegebenen Quell-URL abrufen. Bei Abweichung: neuen Wert, `geprueft_am` heute. Unverändert: nur `geprueft_am` setzen. Nicht abrufbar: nichts ändern, im Bericht als „nicht prüfbar“ führen. Preise nie schätzen.
2b. **Preisverlauf ergänzen:** Jeden neu abgerufenen Preis als neuen Eintrag in `preisverlauf` anhängen (Datum, Zahl, Händler, Quelle). Bestehende Einträge nie ändern oder löschen; die Seite zeigt daraus aktuellen, niedrigsten und höchsten erfassten Preis.
3. Bei Widersprüchen zwischen Quellen den Widerspruch im Datensatz aktualisieren.
4. `npm run links:extern` im Seitenordner: tote Links (HTTP ≥ 400, Weiterleitung auf Startseite, Produkt ausverkauft/eingestellt) und tote Partnerziele (`/go/…`-Ziele) auflisten. Kaputte Ziele ersetzen, wenn eine belegte Alternative existiert; sonst melden. Ausgelaufene Modelle: Hinweis an den Betreiber, keinen Ersatz erfinden.
5. Preisspanne in Tabellen-/Textfeldern ableiten (nur aus abgerufenen Werten) und das Prüfdatum im Hinweis unter der Tabelle (`tabellenHinweis`) aktualisieren.
6. `npm run check:release`.
7. Commit (Hook prüft), Pull Request gegen `main`.

## Ausgabeformat
Pull-Request-Beschreibung mit Tabelle: Produkt · Feld · alt → neu · Quelle · Datum, darunter „Tote Links“ und „Nicht prüfbar“.

## Ablageort
Änderungen in `seiten/<name>/src/content/produkte/*.json`; PR-Text im Pull Request.
