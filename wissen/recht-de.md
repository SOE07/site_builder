# Recht für deutsche Affiliate-Seiten (Startdatei)

Stand: 2026-11-07 · Aus dem Wissensstand der Fabrik zusammengestellt, **nicht** automatisch gegen die Gesetzestexte geprüft und **keine Rechtsberatung**. Vor Veröffentlichung einer Seite die Punkte gegen aktuelle Gesetzestexte prüfen (gesetze-im-internet.de) oder Fachleute fragen. Neue Erkenntnisse mit Datum und Quelle unten anhängen (macht `seite-anlegen` und `qualitaet-pruefen`).

## Impressum
- Geschäftsmäßige Telemedien brauchen ein Impressum: **§ 5 DDG** (Digitale-Dienste-Gesetz, ersetzt seit Mai 2024 das TMG). Angaben: Name, ladungsfähige Anschrift (kein bloßes Postfach), E-Mail **und eine zweite schnelle, unmittelbare Kontaktmöglichkeit** (z. B. Telefon oder Kontaktformular), ggf. USt-IdNr.
- Redaktionell verantwortlich nach **§ 18 Abs. 2 MStV**, wenn journalistisch-redaktionelle Inhalte angeboten werden (Ratgeber gelten häufig als solche): Name und Anschrift.
- Impressum muss von jeder Seite aus leicht erreichbar sein (Footer), unmittelbar erreichbar und ständig verfügbar.
- Wer die Privatanschrift nicht veröffentlichen will, braucht eine ladungsfähige Anschrift über einen Impressumsdienst o. Ä. Die Anschrift muss tatsächlich erreichbar sein.

## Werbekennzeichnung
- Kommerzielle Zwecke müssen erkennbar sein: **§ 5a Abs. 4 UWG**. Verdeckte Werbung ist unlauter.
- Praxis der Fabrik: Hinweis am Seitenanfang jeder Seite **und** Kennzeichnung direkt am Link („* Werbelink“). Zusätzlich eine eigene Seite „Werbehinweis“. Ein nacktes Sternchen allein gilt unter Juristen als riskant; die Beschriftung „Werbelink“ am Link ist die sicherere Variante.
- Google verlangt für bezahlte/Affiliate-Links `rel="sponsored"` (zusätzlich `nofollow noopener` laut Projektregel).
- Programmbedingungen können eigene Pflichttexte vorschreiben (siehe `partnerprogramme.md`).

## Datenschutz (DSGVO, TDDDG)
- Datenschutzerklärung nach **Art. 13 DSGVO** ist Pflicht. Inhalt muss zur tatsächlichen Technik passen. Nicht „frei erfinden“: einen Generator nutzen und die Technik der Seite abgleichen.
- **§ 25 TDDDG**: Speichern von oder Zugriff auf Informationen im Endgerät (Cookies, Local Storage, Tracker) braucht Einwilligung, außer unbedingt erforderlich. Fabrik-Standard: **kein Tracking, keine Cookies, keine Drittanbieter-Einbindungen** → kein Cookie-Banner nötig.
- Schriften werden **selbst gehostet** (kein Abruf bei Google Fonts); der Abruf externer Schriften überträgt IP-Adressen und führte zu Abmahnungen und Urteilen.
- Server-Logfiles des Hosters (Netlify/Vercel) gehören in die Erklärung; mit dem Hoster einen Auftragsverarbeitungsvertrag abschließen, soweit nötig.
- Affiliate-Klick: Die Weiterleitung `/go/<slug>` speichert nichts. Der Händler/das Netzwerk setzt nach dem Klick auf seiner Seite ggf. Cookies; das in der Datenschutzerklärung erwähnen.

## Preise und Produktangaben
- Preisangaben sind Momentaufnahmen. Immer mit Datum („Stand …“) und Hinweis, dass der Preis beim Händler maßgeblich ist. Preise inklusive Umsatzsteuer; Versandkosten nicht verschweigen, wenn der Preis als Endpreis wirkt (Bezug: Preisangabenverordnung, im Zweifel prüfen).
- Amazon verbietet statische Preisanzeigen ohne aktuelle API-Daten (siehe `partnerprogramme.md`).
- Produktbilder, Herstellertexte und Datenblätter sind urheberrechtlich geschützt: nur mit Lizenz oder gemäß Programmbedingungen verwenden. Fabrik-Standard: eigene Texte, keine fremden Bilder.

## Bewertungen und Irreführung
- Gefälschte oder erfundene Bewertungen, Sterne, Testsiegel und „Testsieger“-Behauptungen sind unlauter (**UWG**, u. a. Anhang Nr. 23b zu § 3 Abs. 3). Fabrik-Regel: keine Sterne, keine Noten, keine Nutzerstimmen, keine Behauptung eigener Tests.
- Aussagen über die eigene Arbeitsweise („wir werten aus“, „unabhängig“) müssen stimmen.
- Markennamen dürfen zur Bezeichnung des Produkts genannt werden. Keine Logos oder Markenbilder ohne Erlaubnis.

## YMYL-nahe Themen
- Gesundheit: Heilversprechen sind nach HWG und UWG stark eingeschränkt. Finanzen/Versicherungen und Rechtsberatung: Erlaubnispflichten (z. B. Vermittler-/Beratungsrecht). Die Fabrik lehnt solche Nischen ab oder arbeitet nur mit ausdrücklicher Warnung (siehe `CLAUDE.md`).

## Barrierefreiheit
- Das BFSG gilt seit 28.06.2025 für bestimmte Verbraucherprodukte und -dienstleistungen (u. a. Onlinehandel). Reine Ratgeberseiten sind in der Regel nicht betroffen; bei eigenem Shop prüfen. Unabhängig davon: Kontraste, Tastaturbedienung, Alternativtexte (Vorlage berücksichtigt das).

## Offene Punkte / Ergänzungen
<!-- Neue Einträge: `- JJJJ-MM-TT · Thema · Erkenntnis · Quelle` -->
- 2026-11-07 · Selbstaussagen · Aussagen über die eigene Arbeitsweise („unabhängig“, „wir werten Tests aus“, Aktualisierungsintervalle) müssen stimmen und belegbar sein; im Padelstart-Testlauf mehrfach aus dem Ausgangsmaterial entfernt (§ 5 UWG-Bezug, Prüfung `qualitaet-pruefen`).
- 2026-11-07 · Gesundheitsbezug · Aussagen wie „armschonend“ oder „nimmt Belastung von Ellbogen“ sind gesundheitsnah: nur mit Quelle und mit Hinweis „keine medizinische Beratung“.
