# Annes Birthday Quiz

Ein Pubquiz zum Geburtstag – als einzelne HTML-Datei, komplett offline lauffähig,
ohne Installation und ohne Internetverbindung.

**Starten:** `index.html` doppelklicken (Chrome, Firefox, Safari oder Edge).

Es gibt zwei Betriebsarten. Die erste ist die von jeher: **der Beamer**, eine Datei,
kein Internet, alles auf einer Bildschirmhöhe. Die zweite kommt hinzu, wenn das Quiz
gehostet läuft: **Mitlesen auf dem Handy** – die Gäste sehen live dieselbe Frage,
dieselben Antwortmöglichkeiten und dieselbe Uhr, und die Auflösung genau in dem
Moment, in dem der Quizmaster sie aufdeckt. Geantwortet wird weiterhin auf dem Zettel.
Der ganze Abschnitt [Mitlesen auf dem Handy](#mitlesen-auf-dem-handy) beschreibt das.

---

## Ablauf für den Quizmaster

1. **Startseite:** Gruppennamen eintragen (2 bis 8 Gruppen). Über „Antwortzettel drucken“
   bekommt jede Gruppe einen eigenen Zettel mit allen Fragen und Antwortmöglichkeiten –
   ohne Lösungen.
2. **„Quiz starten“** – vor jeder Runde erscheint eine Rundentafel mit Titel und Einleitung.
   Weiter mit „Runde beginnen“.
3. **Frage:** Die Uhr startet automatisch. In den letzten fünf Sekunden wackelt sie,
   färbt sich golden und piept jede Sekunde eine Stufe höher. Bei null ertönt ein Gong
   und „Zeit um – Stifte weg“ erscheint. **Die Uhr deckt nichts auf.**
4. **„Antwort aufdecken“** klicken – erst dann kommt die Auflösung, mit einer zum
   Fragetyp passenden Darstellung.
5. **Punkte:** Der Punktestand liegt in einer ein- und ausklappbaren Seitenleiste.
   Auf- und zuklappen über den Knopf **Punktestand** in der Kopfzeile oder mit der Taste `S`;
   dann `+` / `−` pro Gruppe. Ob die Leiste offen ist, merkt sich die App.
6. Am Ende „Endstand“ → Siegertreppchen mit Konfetti.

Punktestand, Fortschritt und der Zustand der Punkteleiste werden im Browser gespeichert –
ein versehentliches Neuladen kostet also keine Punkte.

### Layout

Die Anwendung ist auf **eine Bildschirmhöhe ohne Scrollen** ausgelegt. Die Seite selbst
scrollt nie – auf keiner geprüften Auflösung, auch nicht mit acht Gruppen und
aufgedeckter Antwort. Gemessen mit offener Punkteleiste:

| Auflösung | Ergebnis |
|---|---|
| 1920 × 1080 | alle 25 Fragen vollständig im Bild |
| 1600 × 1000 | alle 25 Fragen vollständig im Bild |
| 1440 × 900 | vollständig; nur die Heckenfrage braucht 15 px innerhalb der Karte – mit geschlossener Punkteleiste auch das nicht |
| 1280 × 800 | die dichtesten Fragen scrollen bis zu 117 px innerhalb der Karte |

Für den Beamer ist also alles ab 1440 × 900 sauber. Gescrollt wird im Zweifel nur
innerhalb der Fragenkarte, nie die Seite.

Damit das aufgeht, passiert beim Aufdecken zweierlei: die Fotos schrumpfen auf
Briefmarkengröße und die verworfenen Antwortoptionen klappen zusammen. Die richtige
Antwort bleibt groß.

### Tastenkürzel

| Taste | Funktion |
|---|---|
| `→` / `←` | vor / zurück |
| `Leertaste` | Antwort aufdecken |
| `P` | Uhr pausieren / fortsetzen |
| `R` | Uhr neu starten |
| `S` | Punkteleiste ein-/ausklappen |
| `F` | Vollbild an/aus |

Die Tastenkürzel gelten nur am Beamer – die Mitlesefassung bedient nichts.

---

## Mitlesen auf dem Handy

Die zweite Betriebsart. Sie ist **standardmäßig aus** – ohne sie verhält sich das Quiz
Zeile für Zeile wie zuvor.

### Für den Quizmaster

1. Auf der Startseite die Karte **„Mitlesen auf dem Handy“** aufklappen und den
   Schalter auf *Aktiv* stellen.
2. Es erscheinen ein **Raumcode**, eine kurze **Adresse** und ein **QR-Code**.
   Den QR-Code herumzeigen oder die Adresse ansagen – mehr braucht es nicht.
3. Die Statuszeile darunter meldet, wie viele Geräte gerade mitlesen.
4. Der Rest bleibt, wie er war: weiterklicken, aufdecken, Punkte vergeben.
   Jeder Schritt geht von selbst an alle Handys.

Der Raumcode bleibt über Neuladen und Schließen hinweg derselbe. **Neuer Code** zieht
einen frischen – nützlich, wenn nach dem Abend niemand mehr mitlesen soll.

### Für die Gäste

QR-Code scannen, fertig. Kein Name, keine Anmeldung, keine App. Wer später dazukommt,
landet sofort auf der laufenden Frage statt vor einer leeren Seite; ebenso nach einem
Funkloch oder einem Bildschirm, der zwischendurch ausgegangen ist.

### Was die Handys zeigen – und was nicht

| Auf dem Handy | Nur am Beamer |
|---|---|
| Frage, Hinweis, Antwortmöglichkeiten | Punktestand und Punktevergabe |
| Fotos zur Frage | Rundentafeln |
| die laufende Uhr | Siegertreppchen und Konfetti |
| die Auflösung samt Grafik, sobald aufgedeckt | sämtliche Bedienung |

Bei Rundentafeln und beim Endstand zeigen die Handys eine ruhige Zwischentafel –
die großen Momente gehören der Leinwand.

**Die Handys bleiben stumm.** Zwanzig Geräte, die gegeneinander die letzten fünf
Sekunden piepen, will niemand; der Ton kommt weiter allein vom Beamer.

### Einrichten auf Vercel

1. Repo in Vercel importieren. Es braucht keinen Build – `index.html` wird direkt
   ausgeliefert, die beiden Dateien in `api/` werden zu Edge Functions.
2. Im Projekt unter **Storage** eine **Upstash-Redis**-Datenbank anlegen und mit dem
   Projekt verbinden. Der kostenlose Tarif reicht für einen Quizabend bequem.
3. Einmal neu ausrollen, damit die Zugangsdaten ankommen.

Erkannt werden beide gängigen Namenspaare, je nach Integration:
`KV_REST_API_URL` / `KV_REST_API_TOKEN` oder
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.

Fehlt der Speicher, sagt die Karte auf der Startseite das klar – und das Quiz läuft
am Beamer trotzdem ganz normal weiter.

### Wie es technisch läuft

Der Beamer ist die einzige Quelle der Wahrheit. Bei jedem Wechsel schickt er einen
kleinen Zustand an `api/state` – welcher Schritt, ob aufgedeckt, wie die Uhr steht.
Der Zustand wird abgelegt (für Nachzügler) und über einen Redis-Kanal verteilt. Die
Handys hängen über `api/stream` an einer offenen Leitung und bauen daraus dieselbe
Ansicht auf. Dazwischen liegen typischerweise gut hundert Millisekunden.

Ein paar Entscheidungen, die den Abend robust machen:

* **Die Uhr läuft auf jedem Gerät selbst.** Übertragen wird nur der Stand bei jedem
  Wechsel, dazu alle 15 Sekunden ein ruhiger Herzschlag. So bleibt es synchron,
  ohne die Leitung vollzuschreiben.
* **Die Verbindung endet nach vier Minuten von selbst** und wird sofort neu
  aufgebaut. Das hält alles innerhalb der Laufzeitgrenzen der Plattform, ohne dass
  jemand etwas merkt.
* **Bekommt ein Handy den Kanal nicht,** fragt es stattdessen alle drei Sekunden
  nach. Langsamer, aber es läuft.
* **Offline bleibt offline.** Solange der Schalter aus ist, geht kein einziger
  Netzaufruf hinaus. Als lokal geöffnete Datei ist der Schalter gesperrt und die
  Karte erklärt, warum.

Der QR-Code wird in der Seite selbst erzeugt (Byte-Modus, Fehlerkorrektur M) –
keine fremde Bibliothek, kein Aufruf nach draußen.

**Eine Einschränkung der Ehrlichkeit halber:** Die Mitlesefassung ist dieselbe Datei
wie die Beamerfassung und trägt den Fragenkatalog mitsamt Lösungen bei sich – sie
zeigt nur nichts davon, bevor der Quizmaster aufdeckt. Wer auf dem Handy die
Entwicklerwerkzeuge öffnet, kommt also an die Antworten. Für einen Geburtstagsabend
mit Antwortzetteln ist das kein Problem, sollte aber gesagt sein.

---

## Fotos einfügen

Zwölf Bilder gehören ins Quiz; **acht liegen bereits als echte Fotos im Repo**
(vier Kirchen, Santiago-Kathedrale, zwei Lavendelarten, Baguette – bis auf Gimborn
und Lindlar alle von Wikimedia Commons, Nachweise in `bilder/LIESMICH.md`). Es
fehlen nur noch die vier Heckenfotos – Motive, die es nur als eigenes Foto gibt.
Solange eines fehlt, zeigt die App einen Platzhalter mit dem erwarteten Dateinamen.
Lege die Bilder in den Ordner `bilder/` neben `index.html` – sie erscheinen dann
automatisch, am besten im Querformat (die App schneidet auf 4:3 zu).

**Die Endung ist egal.** Die App probiert nacheinander `.jpg`, `.jpeg`, `.png`, `.webp`
und `.svg`; es zählt nur der Name vor dem Punkt. Zuschneiden ist auch nicht nötig,
die App schneidet selbst auf 4:3.

Die Dateinamen sind bewusst neutral gehalten, damit der Platzhalter während des Spiels
nichts verrät. Was auf welches Bild gehört, steht nur hier und in `bilder/LIESMICH.md`:

| Datei | Motiv | Status |
|---|---|---|
| `bilder/kirche-a.jpg` | Kirche in Hülsenbusch | liegt bei (Wikimedia) |
| `bilder/kirche-b.webp` | Kirche in Gimborn | liegt bei (eigenes Foto) |
| `bilder/kirche-c.jpg` | Kirche in Lindlar, St. Severin | liegt bei (eigenes Foto) |
| `bilder/kirche-d.jpg` | Kirche in Frielingsdorf | liegt bei (Wikimedia) |
| `bilder/hecke-a.jpg` … `hecke-d.jpg` | die vier Hecken zur Auswahl | **fehlen** – eigene Fotos nötig |
| `bilder/baguette.jpg` | Baguette auf einem Tisch | liegt bei (Wikimedia) |
| `bilder/lavendel-a.jpg` | echter Lavendel (Lavandula angustifolia) | liegt bei – **Nahaufnahme gewünscht** |
| `bilder/lavendel-b.jpg` | Lavandin (Lavandula × intermedia) | liegt bei – **Nahaufnahme gewünscht** |
| `bilder/bauwerk.jpg` | Kathedrale von Santiago de Compostela | liegt bei (Wikimedia) |

Die Herkunfts- und Lizenzangaben zu den acht Wikimedia-Fotos stehen in
`bilder/LIESMICH.md`.

---

## Die sechs Runden

| Runde | Titel | Fragen |
|---|---|---|
| I | Oberberg und das Bergische Land | 4 |
| II | Frankreich | 7 |
| III | Der Jakobsweg | 3 |
| IV | Mallorca | 2 |
| V | Schätzen und Knobeln | 5 |
| VI | Der 12. August 1966 | 1 |

22 Fragen insgesamt. Jede Frage hat mindestens 60 Sekunden Zeit; die
Vier-Kirchen-Frage 120, die Reihenfolge-Frage 75.

---

## Fragen anpassen

Runden stehen im `ROUNDS`-Array, alle Fragen im `QUESTIONS`-Array am Anfang des
`<script>`-Blocks in `index.html`. Jede Frage hat einen `type`, der die Darstellung der
Auflösung bestimmt:

| `type` | Auflösung |
|---|---|
| `single` | die richtige Option leuchtet auf, die übrigen klappen zusammen; Siegel mit Strahlenkranz |
| `truefalse` | Stempel „Wahr“ oder „Falsch“ schlägt ein – funktioniert, wird derzeit von keiner Frage genutzt |
| `estimate` | die Zahl zählt hoch – und wird bewusst nur dort genannt |
| `photo` | ein Bild, ein Ort |
| `places` | mehrere Bilder, je ein Ort, nacheinander eingeblendet |
| `order` | Balkendiagramm sortiert sich der Größe nach |
| `math` | Rechenweg Zeile für Zeile |
| `open` | keine richtige Antwort – Live-Auszählung mit Zählbalken |

`time` legt die Sekunden für die Uhr fest, `answer` die Überschrift der Auflösung,
`fact` den Hintergrundtext. `correctImg` hebt beim Aufdecken zusätzlich das richtige
Foto hervor. `sheetLines` erzeugt auf dem Antwortzettel mehrere beschriftete Zeilen
statt einer.

Fast jede Frage trägt zusätzlich ein `viz`-Feld: eine animierte Grafik in der
Auflösung. Verfügbare Arten:

| `kind` | Darstellung |
|---|---|
| `bars` | waagerechte Balken, die richtige Antwort in Gold |
| `columns` | Säulenreihe, etwa die zwölf Monate |
| `wordsplit` | ein Wort in seine Bestandteile zerlegt |
| `merge` | zwei Kästen, ein Pfeil mit Jahreszahl, ein Ergebnis – derzeit ungenutzt |
| `flow` | Erzählkette aus mehreren Stationen |
| `mythcheck` | Aussagenliste mit Haken und Kreuzen |
| `hexmap` | Frankreich als Sechseck mit seinen Nachbarn |
| `obermap` | Ortskarte mit einfallenden Pins |
| `islands` | Inseln als Flächenkreise, geografisch angeordnet |
| `timeline` | Zeitstrahl mit Ereignissen ober- und unterhalb |
| `leafyear` | Laubkalender über zwölf Monate |
| `thermo` | Temperaturskala mit Markierungen |
| `gauge` | Skala mit Schwellenwerten |
| `areacomp` | zwei Flächen als Kreise im Größenvergleich |
| `persec` | mitlaufender Sekundenzähler |
| `rosette` | rotierende Fensterrose |
| `herbs` | Zutatenwolke mit Sortenkarten – derzeit ungenutzt |
| `botafumeiro` | schwingendes Pendel mit Kennzahlen |
| `lavendel` | botanischer Vergleich der beiden Lavendelarten |
| `birthday` | Geburtstagskarte zum Finale, mit Konfetti |

Bei Schätzfragen erscheint die Grafik erst, nachdem die Zahl hochgezählt hat –
sonst stünde die Lösung schon vorher da.

> **Zur Heckenfrage:** Welche Hecke wirklich auf Walks Grundstück wächst, weiß nur die
> Familie. Hinterlegt ist derzeit Hecke C (`correct: 2`, `correctImg: 2`). Zum Ändern
> beide Werte auf denselben Index setzen – A ist 0, D ist 3.

> **Zur Jakobsweg-Frage:** Als wahre Aussage ist die Hundert-Kilometer-Regel für die
> Compostela hinterlegt; sie ist über das Pilgerbüro in Santiago belegt. Die früher
> naheliegende Antwort „im Grab liegt der Apostel Jakobus“ ist bewusst nicht die Lösung –
> das ist Überlieferung, kein gesicherter Befund, und steht so auch im Erklärtext.
