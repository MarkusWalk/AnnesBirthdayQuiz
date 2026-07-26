# Annes Birthday Quiz

Ein Pubquiz zum Geburtstag – als einzelne HTML-Datei, komplett offline lauffähig,
ohne Installation und ohne Internetverbindung.

**Starten:** `index.html` doppelklicken (Chrome, Firefox, Safari oder Edge).

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

---

## Fotos einfügen

Dreizehn Bilder gehören ins Quiz; **acht liegen bereits als echte Fotos im Repo**
(vier Kirchen, Santiago-Kathedrale, zwei Lavendelarten, Baguette – alle von
Wikimedia Commons, Nachweise in `bilder/LIESMICH.md`). Es fehlen nur noch die vier
Heckenfotos und die Stadtwerke Bensberg – Motive, die es nur als eigenes Foto gibt.
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
| `bilder/kirche-b.jpg` | Kirche in Gimborn | liegt bei (Wikimedia) |
| `bilder/kirche-c.jpg` | Kirche in Lindlar | liegt bei (Wikimedia) |
| `bilder/kirche-d.jpg` | Kirche in Frielingsdorf | liegt bei (Wikimedia) |
| `bilder/gebaeude.jpg` | Stadtwerke Bensberg | **fehlt** – eigenes Foto nötig |
| `bilder/hecke-a.jpg` … `hecke-d.jpg` | die vier Hecken zur Auswahl | **fehlen** – eigene Fotos nötig |
| `bilder/baguette.jpg` | Baguette auf einem Tisch | liegt bei (Wikimedia) |
| `bilder/lavendel-a.jpg` | echter Lavendel (Lavandula angustifolia) | liegt bei (Wikimedia) |
| `bilder/lavendel-b.jpg` | Lavandin (Lavandula × intermedia) | liegt bei (Wikimedia) |
| `bilder/bauwerk.jpg` | Kathedrale von Santiago de Compostela | liegt bei (Wikimedia) |

Die Herkunfts- und Lizenzangaben zu den acht Wikimedia-Fotos stehen in
`bilder/LIESMICH.md`.

---

## Die sechs Runden

| Runde | Titel | Fragen |
|---|---|---|
| I | Oberberg und das Bergische Land | 5 |
| II | Frankreich | 7 |
| III | Der Jakobsweg | 3 |
| IV | Mallorca | 4 |
| V | Schätzen und Knobeln | 5 |
| VI | Der 12. August 1966 | 1 |

25 Fragen insgesamt.

---

## Fragen anpassen

Runden stehen im `ROUNDS`-Array, alle Fragen im `QUESTIONS`-Array am Anfang des
`<script>`-Blocks in `index.html`. Jede Frage hat einen `type`, der die Darstellung der
Auflösung bestimmt:

| `type` | Auflösung |
|---|---|
| `single` | die richtige Option leuchtet auf, die übrigen klappen zusammen; Siegel mit Strahlenkranz |
| `truefalse` | Stempel „Wahr“ oder „Falsch“ schlägt ein |
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
| `merge` | zwei Kästen, ein Pfeil mit Jahreszahl, ein Ergebnis |
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
| `herbs` | Zutatenwolke mit Sortenkarten |
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
