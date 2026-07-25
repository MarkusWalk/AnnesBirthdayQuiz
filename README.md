# 🌴 Annes Birthday Quiz

Ein Pubquiz für Annes Geburtstag im mallorquinischen Design – als einzelne HTML-Datei,
komplett offline lauffähig, ohne Installation und ohne Internetverbindung.

**Starten:** `index.html` doppelklicken (Chrome, Firefox, Safari oder Edge).

---

## Ablauf für den Quizmaster

1. **Startseite:** Gruppennamen eintragen (2–8 Gruppen). Optional
   „🖨️ Antwortzettel drucken“ – druckt für **jede Gruppe einen eigenen Zettel** mit allen
   Fragen und Antwortmöglichkeiten (ohne Lösungen).
2. **„🎉 Quiz starten“** – die erste Frage erscheint und **der Timer startet automatisch**.
3. **Letzte 5 Sekunden:** Der Timer wackelt, färbt sich rot und piept jede Sekunde eine Stufe
   höher. Bei 0 ertönt ein Gong und „⏰ Zeit um – Stifte weg!“ erscheint.
   **Der Timer deckt nichts auf.**
4. **„🔓 Antwort aufdecken“** klicken – erst dann kommt die Auflösung, mit einer zum Fragetyp
   passenden Animation.
5. Punkte vergeben: Der Punktestand liegt in einer **ein- und ausklappbaren Seitenleiste**.
   Auf- und zuklappen über den Knopf **🏆 Punkte** in der Kopfzeile oder mit der Taste `S`;
   dann `+` / `−` pro Gruppe. Ob die Leiste offen ist, merkt sich die App.
6. Am Ende „🏁 Endstand“ → Siegertreppchen mit Konfetti.

Punktestand, Fortschritt und der Zustand der Punkteleiste werden im Browser gespeichert –
ein versehentliches Neuladen kostet also keine Punkte.

### Layout

Die Anwendung ist auf **eine Bildschirmhöhe ohne Scrollen** ausgelegt: Start-, Quiz- und
Endbildschirm passen jeweils komplett ins Fenster. Ab 1920×1080 liegen alle 27 Fragen
samt Auflösung auf einem Bild; bei 1440×900 scrollen zwei besonders dichte Fragen
(die Reihenfolge- und die Heckenfrage) noch um wenige Zentimeter innerhalb der Karte –
die Seite selbst bleibt immer stehen.

Damit das aufgeht, passiert beim Aufdecken zweierlei: die Fotos schrumpfen auf
Briefmarkengröße und die verworfenen Antwortoptionen klappen zusammen. Die richtige
Antwort bleibt groß.

### Tastenkürzel

| Taste | Funktion |
|---|---|
| `→` / `←` | nächste / vorherige Frage |
| `Leertaste` | Antwort aufdecken |
| `P` | Timer pausieren / fortsetzen |
| `R` | Timer neu starten |
| `S` | Punkteleiste ein-/ausklappen |
| `F` | Vollbild an/aus |

---

## Fotos einfügen

Elf Fragen arbeiten mit Fotos. Solange kein Bild vorhanden ist, zeigt die App einen
Platzhalter mit dem erwarteten Dateinamen. Lege die Bilder einfach in einen Ordner
`bilder/` neben `index.html` – sie erscheinen dann automatisch:

| Datei | Motiv |
|---|---|
| `bilder/kirche-huelsenbusch.jpg` | Ev. Kirche Hülsenbusch |
| `bilder/schloss-gimborn.jpg` | Schloss Gimborn |
| `bilder/stadtwerke-bensberg.jpg` | Stadtwerke Bensberg |
| `bilder/hecke-a.jpg` · `hecke-b.jpg` · `hecke-c.jpg` | die drei Hecken zur Auswahl |
| `bilder/lavendel-a.jpg` | Lavandula angustifolia (echter Lavendel) |
| `bilder/lavendel-b.jpg` | Lavandula intermedia (Lavandin) |
| `bilder/kathedrale-santiago.jpg` | Kathedrale von Santiago de Compostela |

---

## Fragen anpassen

Alle Fragen stehen gebündelt im `QUESTIONS`-Array am Anfang des `<script>`-Blocks in
`index.html`. Jede Frage hat einen `type`, der die Auflösungs-Animation bestimmt:

| `type` | Animation beim Aufdecken |
|---|---|
| `single` | richtige Option leuchtet golden auf, Strahlenkranz |
| `truefalse` | Gummistempel „WAHR“/„FALSCH“ schlägt ein |
| `estimate` | Zahl zählt als Odometer hoch |
| `photo` | Kartennadel fällt, Ortsname tippt sich Buchstabe für Buchstabe |
| `order` | Balkendiagramm sortiert sich der Größe nach |
| `math` | Rechenweg erscheint Zeile für Zeile |
| `open` | keine richtige Antwort – Live-Auszählung mit Zählbalken |

`time` legt die Sekunden für den Timer fest, `answer` die Überschrift der Auflösung und
`fact` den Hintergrundtext.

> **Hinweis zur Hecken-Frage:** Welche Hecke wirklich auf Walks Grundstück wächst, weiß nur
> die Familie. Aktuell ist die Rotbuchenhecke als richtig hinterlegt (`correct: 2`) – bei
> Bedarf einfach den Index anpassen.

---

## Runden

1. **Oberberg & Heimat** – Kreisname, drei Fotorätsel, Einwohner-Reihenfolge, Hecken
2. **Bonjour la France** – Mont Blanc, Grenzen, Eiffelturm, Baguette, Lavendel, Valensole
3. **Buen Camino** – Jakobsweg-Mythen, längste Route, Kathedrale
4. **¡Viva Mallorca!** – Balearen, Ensaïmada, Hierbas, Puig Major, La Seu
5. **Schätzen & Knobeln** – Geburtsmonate, Hirsche, Wein & Oliven, Schritte, Pommes vs. Pizza
6. **Das Geburtstagskind** – der 12.08.1966

27 Fragen insgesamt.
