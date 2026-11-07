# Qualitätsbericht Padelstart

Datum: 2026-11-07 · Ablauf: `qualitaet-pruefen` (Testlauf der Fabrik) · Stand: **nicht veröffentlichbar**

## Gesamturteil
Technisch sauber (Build, interne Links, Werbekennzeichnung, keine Review-Daten, kein Tracking, selbst gehostete Schriften). **Inhaltlich und rechtlich nicht veröffentlichungsreif**: Pflichtangaben sind Platzhalter, alle Produktangaben haben noch kein Prüfdatum, viele Wertungen sind nicht durch Quellen gedeckt.

## 1. Automatische Prüfung
| Prüfung | Ergebnis |
|---|---|
| `npm run check` (Daten, Phrasen, Build, Link-Check, Werbekennzeichnung im HTML) | bestanden, mit Warnungen: 21 Fakten ohne Prüfdatum |
| `npm run check:release` (streng) | **fehlgeschlagen**: Prüfdaten fehlen, Platzhalter offen (Name, Anschrift, Ort, E-Mail, Kontakt, Verantwortlicher, Autor, Stadt, Partnerprogramm) |
| Theme-Ähnlichkeit | nicht vergleichbar (erst eine Seite) |
| Externe Links | nicht geprüft: Shop-Domains sind in dieser Umgebung gesperrt |

## 2. Prüf-Agents
Hinweis: Die neuen Agents aus `.claude/agents/` sind in der laufenden Session nicht registriert. Die Rollenbeschreibungen wurden über `general-purpose` mit striktem Nur-Lesen-Auftrag ausgeführt. Externe Quellen (Shops, Google) waren per Netzwerkregel nicht abrufbar, deshalb ist **kein Produktwert gegen seine Quelle verifiziert**.

### Faktenprüfer (78 Aussagen geprüft, 57 beanstandet)
- Blocker: falsche Selbstaussagen (Tests von Fachportalen, Hersteller ohne Einfluss, „unabhängig“, Aktualisierung alle drei Monate), kein Prüfdatum bei allen 21 Fakten, Preis-Stand ohne Beleg.
- Wichtig (26): Superlative („beste“), Eigenschaften und Spielgefühl ohne Quelle (armschonend, wendig, verzeiht Fehler), Quellenzuschreibung („laut HEAD“, „laut Dunlop“, obwohl die Quelle ein Shop ist), uneinheitliche Preisspannen (60–105 €, 65–100 €, bis 125 €), Faustregel Gewicht ohne Quelle.
### Compliance
- Blocker: Impressum und Datenschutz nur Platzhalter, Autor-Platzhalter (auch im Article-JSON-LD), Werbehinweis nannte Amazon ohne Amazon-Link.
- Wichtig: kein belegtes Partnerprogramm je Händler (Ziele sind normale Produktseiten), Gesundheitsbezug („armschonend“, Ellbogen) ohne Warnhinweis, Quellenzuschreibung, dünne-Affiliate-Gefahr bei nur einer Händlerquelle je Produkt.
- Positiv bestätigt: Werbehinweis oben auf allen Seiten, alle `/go/`-Links mit `rel="sponsored nofollow noopener"` und „* Werbelink“, `/go/` in `robots.txt` gesperrt, keine Sterne/Noten/Nutzerstimmen, keine Fremd-Ressourcen.
### SEO-Prüfer
- Blocker: `planung/keywords.md` fehlt (Keyword-Plan nicht gelaufen), Autor-Platzhalter.
- Wichtig: Title zu lang, keine Überschrift über den Produktblöcken, kein Änderungsdatum, keine Sitemap, Zahlen widersprüchlich, Text warnt vor Carbon, empfiehlt aber Siux (Carbon).
- Hinweis: Startseite und Artikel überlappen thematisch (Kannibalisierungsrisiko), Hauptkeyword fehlt in der Startseiten-H1, „Über uns“ fehlte im Footer, FAQ kurz.
- Chancen: Keyword-Plan nachholen und Startseite/Artikel trennen; kaufnahe Cluster (Preisklassen, Schuhe, Starterset) mit interner Verlinkung; Autorangabe, Datum und Belege für Frische- und Vertrauenssignale.

## 3. Im Testlauf behoben
- „Testsieger-Listen“ → „Ranglisten“ (verbotene Phrase, schon beim Import).
- Falsche Selbstaussagen entfernt oder neutral gefasst: „unabhängig“, Auswertung von Fachportal-Tests, „Fachtests“ in der Autorenzeile, Aktualisierungsintervall, „mit mehreren Shops abgeglichen“, „mehrere Händler“ und „20–35 % unter UVP“, Stand-Datum im Tabellenhinweis.
- Amazon-Pflichtsatz aus dem Werbehinweis entfernt (kein Amazon-Programm belegt). Datenschutz-Platzhalter an die Technik der Seite angepasst (kein Consent-Tool, kein Analytics).
- Artikel-Title auf unter 60 Zeichen gekürzt, Überschrift „Die vier Schläger im Überblick“ eingefügt, „Über uns“ im Footer, Sitemap und `robots.txt` mit Sitemap-Zeile, Gesundheitshinweis beim Wilson.

## 4. Offen: Entscheidungen und Angaben vom Betreiber
1. **Pflichtangaben**: Name, ladungsfähige Anschrift (oder Impressumsdienst), E-Mail plus zweiter Kontaktweg, Verantwortlicher, Autorname und -bio, Stadt.
2. **Partnerprogramme**: Welche Programme/Netzwerke je Händler? Echte Affiliate-Links in `affiliateUrl` und `partnerprogramm` eintragen; Programmbedingungen zur `/go/`-Weiterleitung prüfen und in `wissen/partnerprogramme.md` vermerken.
3. **Quellen verifizieren** (`/produkte-recherchieren padelstart`): Herstellerseiten als Quelle, mindestens ein zweiter Händler, Prüfdatum je Fakt. Dort entscheidet sich, welche Wertungen bleiben.
4. **Unbelegte Wertungen** in Produkt- und Ratgeber-Texten (Superlative, Spielgefühl, Faustregeln, „Carbon macht schwerer“, Preisspannen) belegen oder streichen; Preisspannen aus den Fakten ableiten und vereinheitlichen.
5. **Aussagen zur Arbeitsweise bestätigen**: „Hersteller haben keinen Einfluss auf unsere Empfehlungen, und wir nehmen kein Geld für Platzierungen“ ist als Betreiberaussage stehen geblieben und nur wahr, wenn es stimmt. „Wir“ vs. Einzelperson konsistent halten.
6. **Keyword-Plan** (`/keyword-plan padelstart`), danach Startseite und Artikel inhaltlich trennen; Hauptkeyword in H1/Hero; Meta-Beschreibungen stärker unterscheiden.
7. **Domain** in `seite.config.json` (aktuell `padelstart.netlify.app`), `aktualisiert`-Datum im Ratgeber setzen.
8. `npm run check:release` muss grün sein, dazu `npm run links:extern` mit Internetzugang.

## 5. Ergänzungen in `wissen/`
Siehe Einträge vom 2026-11-07 in `recht-de.md`, `partnerprogramme.md`, `google-richtlinien.md`.
