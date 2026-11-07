# Google-Richtlinien für Affiliate-Seiten (Startdatei)

Stand: 2026-11-07 · Wissensstand der Fabrik, nicht automatisch gegen die Google-Seiten abgerufen. Vor wichtigen Entscheidungen die Originalquellen öffnen. Neue Erkenntnisse unten mit Datum und Quelle ergänzen.

## Quellen (maßgeblich)
- Spam-Richtlinien: https://developers.google.com/search/docs/essentials/spam-policies
- Hilfreiche, zuverlässige, nutzerorientierte Inhalte: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Produktbewertungen: https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews
- Links qualifizieren (`sponsored`, `nofollow`): https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
- KI-Funktionen in der Suche: https://developers.google.com/search/docs/appearance/ai-features

## Was für Affiliate-Seiten zählt
- **Mehrwert gegenüber Hersteller- und Shopseiten.** Dünne Affiliate-Seiten, die nur Produktdaten oder Texte anderer wiedergeben, sind ein klassisches Spam-Muster. Mehrwert der Fabrik: Einordnung nach Nutzertyp, offene Nachteile, „Nicht kaufen, wenn“, Datenabgleich mit Quellen.
- **Scaled Content Abuse:** Massenhaft erzeugte Inhalte ohne Mehrwert (auch mit KI) sind Spam. Jede Seite braucht eigene Recherche, eigene Texte, begrenzte Seitenzahl und tatsächlichen Nutzen. Keine Textbausteine zwischen Seiten teilen (auch `CLAUDE.md`-Regel).
- **Site Reputation Abuse / Expired Domain Abuse:** keine Inhalte auf fremden Domains „mitreiten“ lassen, keine abgelaufenen Domains für fremdes Thema kaufen.
- **Links:** Affiliate-Links mit `rel="sponsored"` kennzeichnen (Fabrik: `sponsored nofollow noopener`). Die Weiterleitung `/go/` ist per `robots.txt` gesperrt.
- **Zuverlässigkeit (E-E-A-T-Signale):** nachvollziehbare Autorenangabe, „Über uns“ mit tatsächlichem Vorgehen, Quellen und Prüfdaten, Impressum, Werbetransparenz.

## Zielkonflikt: Produkttests
Googles Hinweise zu Produktbewertungen empfehlen Belege dafür, dass man das Produkt tatsächlich genutzt hat (eigene Fotos, Messungen, Vergleich). **Die Fabrik testet nicht selbst und behauptet es nie.** Konsequenz: Seiten nicht als „Testbericht“, sondern als **Kaufberatung/Vergleich auf Basis von Herstellerangaben und Quellen** positionieren; Mehrwert über Datenabgleich, Einordnung und Transparenz. Das Ranking-Risiko ist höher als bei echten Tests. Wer später selbst testet, trägt das nachvollziehbar in `erfahrung/*.md` ein.

## KI-Funktionen der Suche
- Seiten erscheinen in KI-Übersichten nach denselben SEO-Grundlagen (indexierbar, hilfreich, zitierbar). Reine Informationsabfragen sind anfälliger für Klickverluste; kaufnahe Vergleichsanfragen mit konkreten Produkten sind tendenziell robuster. Das steht bewusst als Einschätzung da, nicht als Messwert.

## Technische Hygiene der Vorlage
Selbst gehostete Schriften, kein Tracking, `lang="de"`, canonical, strukturierte Daten (Article, BreadcrumbList, ItemList) **ohne** Review/Rating-Markup, saubere Überschriftenstruktur.

## Offene Punkte / Ergänzungen
<!-- Neue Einträge: `- JJJJ-MM-TT · Thema · Erkenntnis · Quelle` -->
- 2026-11-07 · Abruf · Die offiziellen Google-Seiten (developers.google.com) waren in der Entwicklungsumgebung nicht erreichbar; die Aussagen in dieser Datei sind noch nicht gegen die Originalquellen geprüft. Beim nächsten Lauf mit Internetzugang abgleichen und Datum eintragen.
- 2026-11-07 · Eine Händlerquelle je Produkt und keine eigene Erfahrung erhöhen die Gefahr, als dünne Affiliate-Seite zu gelten; Gegenmittel: mehrere Quellen, offene Nachteile, klare Einordnung (siehe Zielkonflikt oben).
