# Affiliate-Fabrik

Wiederverwendbares Claude-Code-Setup, um deutschsprachige Affiliate-Nischenseiten zu bauen. Dieses Repo ist die einzige Ablage: Regeln (`CLAUDE.md`), Skills, Agents, Hooks (`.claude/`), die Seitenvorlage (`vorlage/`) und alle Seiten (`seiten/<name>/`).

## Einmalig pro MacBook
```bash
git clone https://github.com/SOE07/site_builder.git && cd site_builder
nvm install && nvm use          # liest .nvmrc (Node 26 LTS; Astro braucht mindestens 22.23.4)
```
Claude Code im Repo-Ordner starten (`claude`). Skills, Agents und Hooks aus `.claude/` gelten automatisch; beim ersten Start die Projekt-Einstellungen bestätigen. Nichts liegt in `~/.claude`.

## Neue Seite bauen
In Claude Code, in dieser Reihenfolge (jede Stufe auf eigenem Branch, am Ende Pull Request gegen `main`):

1. `/nische-pruefen <Thema>` → Bericht in `recherche/<thema>.md`, Punktzahl und Empfehlung
2. `/seite-anlegen <name> "<Anzeigename>"` → `seiten/<name>/` mit eigenem Theme und Pflichtseiten
3. `/keyword-plan <name>` → `seiten/<name>/planung/keywords.md`
4. `/produkte-recherchieren <name> <Produkte>` → Produktdaten mit Quelle und Prüfdatum
5. `/artikel-schreiben <name> <Artikel>` → Ratgeber in `src/content/ratgeber/`
6. `/qualitaet-pruefen <name>` → `planung/qualitaetsbericht.md`; offene Punkte (Impressum, Partnerlinks, Prüfdaten) abarbeiten
7. Später regelmäßig `/preise-aktualisieren <name>`

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

## Hooks und Prüfungen
- Nach jeder Änderung an Inhaltsdateien prüft ein Hook auf verbotene Phrasen („im Test“, „getestet“, „Testsieger“, „wir haben gespielt“, „unser Test“) und Affiliate-Links ohne `rel="sponsored nofollow noopener"`.
- Vor jedem `git commit` von Claude baut ein Hook die geänderten Seiten und führt den Link-Check aus.
- Hooks wirken nur bei Aktionen von Claude. Für manuelle Commits: `npm run check` im Seitenordner.

## Wissen
`wissen/recht-de.md`, `wissen/google-richtlinien.md` und `wissen/partnerprogramme.md` sind Startdateien (Stand und Grenzen stehen darin). Die Skills ergänzen neue Erkenntnisse mit Datum und Quelle.
