# Affiliate-Fabrik

Wiederverwendbares Claude-Code-Setup, um deutschsprachige Affiliate-Nischenseiten zu bauen. Dieses Repo ist die einzige Ablage: Regeln (`CLAUDE.md`), Skills, Agents, Hooks (`.claude/`), die Seitenvorlage (`vorlage/`) und alle Seiten (`seiten/<name>/`).

## Einmalig pro MacBook
```bash
git clone https://github.com/SOE07/site_builder.git && cd site_builder
nvm install && nvm use          # liest .nvmrc (Node 26 LTS; Astro braucht mindestens 22.23.4)
```
Claude Code im Repo-Ordner starten (`claude`). Skills, Agents und Hooks aus `.claude/` gelten automatisch; beim ersten Start die Projekt-Einstellungen bestätigen. Nichts liegt in `~/.claude`.

## Neue Seite bauen
**Alles in einem Lauf:** `/seite-komplett <Thema>` führt alle Schritte unten aus und endet mit Qualitätsbericht und Pull Request. Mehrere Ideen vorab vergleichen: `/nische-pruefen Thema A; Thema B; Thema C` (Rangliste in `recherche/`).

Einzeln, in dieser Reihenfolge (jede Stufe auf eigenem Branch, am Ende Pull Request gegen `main`):

1. `/nische-pruefen <Thema>` → Bericht in `recherche/<thema>.md`, Punktzahl und Empfehlung
2. `/seite-anlegen <name> "<Anzeigename>"` → `seiten/<name>/` mit eigenem Theme und Pflichtseiten
3. `/fachwissen-aufbauen <name>` → `seiten/<name>/wissen/fachwissen.md` (belegtes Fachwissen statt eigener Expertise)
4. `/themen-cluster <name>` → `planung/cluster.md` (Hub, Spokes, Werkzeuge, Linkplan); optional vorher `/keyword-plan <name>`
5. `/produkte-recherchieren <name> <Produkte>` → Produktdaten mit Quelle, Prüfdatum und erstem Preisverlauf
6. `/kaeuferstimmen-sammeln <name>` → sinngemäße Käuferhinweise mit Quelle, `planung/kaeuferfragen.md`
7. Je Artikel `/serp-analyse <name> <Suchanfrage>` → Mehrwert-These in `planung/serp/`
8. `/artikel-schreiben <name> <Artikel>` → Ratgeber; dazu `/grafiken-erstellen` und `/werkzeug-bauen`
9. `/qualitaet-pruefen <name>` → `planung/qualitaetsbericht.md`; offene Punkte (Impressum, Partnerlinks, Prüfdaten) abarbeiten
10. Nach dem Livegang: `/betrieb-einrichten <name>` (geplante Aufgaben für Preise, Links, Auffrischung) und `/performance-review <name>` mit Exporten aus Search Console und Partnernetzwerk in `seiten/<name>/daten/`

Eigene Erfahrung mit einem Produkt darf nur auf die Seite, wenn du sie in `seiten/<name>/erfahrung/<produkt-slug>.md` einträgst.

## Seite lokal starten
```bash
cd seiten/<name>
npm install
npm run dev          # http://localhost:4321, Redaktion unter /keystatic (lokaler Modus)
```
Weitere Befehle: `npm run build`, `npm run check` (Daten, Phrasen, Build, Werbekennzeichnung, Links), `npm run check:release` (streng: keine Platzhalter, Prüfdaten Pflicht), `npm run links:extern` (externe Ziele prüfen).

## Seite auf Netlify oder Vercel deployen
Jede Seite ist ein eigenes Projekt. Neues Projekt aus diesem GitHub-Repo anlegen und einstellen:

| Einstellung | Wert |
|---|---|
| Base Directory / Root Directory | `seiten/<name>` |
| Build Command | `npm run build` |
| Output (Netlify: Publish Directory) | `dist` (bei Netlify mit Adapter wird er automatisch gesetzt) |
| Node-Version | 26 (oder mindestens 22.23.4) |

**Reine statische Seite (ohne Online-Redaktion):** keine Umgebungsvariablen nötig. Inhalte werden lokal bearbeitet und per Pull Request veröffentlicht.

**Mit Online-Redaktion (Keystatic im GitHub-Modus):** zusätzlich in Netlify/Vercel setzen (Werte nie ins Repo; Vorlage in `.env.example`):

| Variable | Wert |
|---|---|
| `DEPLOY_TARGET` | `netlify` oder `vercel` (schaltet Adapter und Keystatic-Routen ein) |
| `KEYSTATIC_STORAGE` | `github` |
| `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | aus einer eigenen GitHub-App je Seite (https://keystatic.com/docs/github-mode) |

Die Inhaltsseiten bleiben statisch; nur `/keystatic` und `/api/keystatic` laufen serverseitig. In `seiten/<name>/seite.config.json` müssen `domain` und `github` stimmen (Pfad `seiten/<name>` steht schon drin). Vor dem Livegang: `npm run check:release` grün, Impressum und Datenschutz ausgefüllt, Partnerlinks eingetragen.

## Agent-First
Jede Seite ist auch für KI-Agents gebaut: `/llms.txt`, eine Markdown-Fassung jeder Seite (`/index.md`, `/ratgeber/<slug>.md`, …) und `/produkte.json` mit allen Produktdaten samt Quelle, Prüfdatum und gekennzeichneten Affiliate-Links. Das entsteht automatisch beim Build aus den Inhalten. `npm run check` prüft, dass Werbekennzeichnung und Quellen auch dort stimmen. Das Repo selbst beschreibt `AGENTS.md` für Agents.

Änderungen an der Vorlage in eine bestehende Seite übernehmen:
```bash
node scripts/vorlage-sync.mjs <name>
```
Das kopiert nur Code (Seiten, Komponenten, Prüfskripte). Inhalte, Theme, Konfiguration und Schriftpakete der Seite bleiben unverändert.

## Was jede Seite unverwechselbar macht
- **Stimme:** `stimme.md` je Seite; `node scripts/text-aehnlichkeit.mjs` bricht ab, wenn Seiten Textbausteine teilen, und warnt vor Schablonen innerhalb einer Seite.
- **Eigene Daten:** Datenabgleich zwischen Quellen (eigene Tabelle im Ratgeber), Preisverlauf aus eigenen Abrufen, Vergleichsdiagramme aus den Fakten (`diagramme` im Ratgeber).
- **Eigene Werkzeuge:** `src/werkzeuge/<slug>.astro` plus Eintrag in `src/content/werkzeuge/`, Seite `/werkzeuge/<slug>` mit Methodik.
- **Eigene Grafiken:** SVG in `src/grafiken/`, eingebunden über `grafik` im Ratgeber-Abschnitt.
- **Cluster:** `themen` und `hub` im Ratgeber; der Block „Passend dazu“ verlinkt automatisch.

## Klicks auswerten ohne Tracking
Steht im Produkt `subidParam` (z. B. `clickref` bei Awin), hängt `/go/<produkt>/<platz>` automatisch `<seite>-<produkt>-<platz>` an (Platz: tabelle, finder, artikel, agent). Die Netzwerkberichte zeigen damit Klicks und Umsatz je Produkt und Platzierung, ohne Cookies oder eigene Zählung. Auswertung: Bericht als CSV nach `seiten/<name>/daten/netzwerk/`, dann `node scripts/netzwerk-auswerten.mjs <name>`. Search Console analog nach `daten/gsc/` und `node scripts/gsc-auswerten.mjs <name>`. Der Ordner `daten/` ist nicht im Git.

## Hooks und Prüfungen
- Nach jeder Änderung an Inhaltsdateien prüft ein Hook auf verbotene Phrasen („im Test“, „getestet“, „Testsieger“, „wir haben gespielt“, „unser Test“) und Affiliate-Links ohne `rel="sponsored nofollow noopener"`.
- Vor jedem `git commit` von Claude baut ein Hook die geänderten Seiten und führt den Link-Check aus.
- Hooks wirken nur bei Aktionen von Claude. Für manuelle Commits: `npm run check` im Seitenordner.

## Wissen
`wissen/recht-de.md`, `wissen/google-richtlinien.md` und `wissen/partnerprogramme.md` sind Startdateien (Stand und Grenzen stehen darin). Die Skills ergänzen neue Erkenntnisse mit Datum und Quelle.
