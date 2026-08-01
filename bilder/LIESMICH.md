# Bilder für das Quiz

Bilder einfach in diesen Ordner legen. Die Endung ist egal – die App probiert der
Reihe nach `.jpg`, `.jpeg`, `.png`, `.webp` und `.svg`. Es zählt nur der Name vor
dem Punkt.

Umbenennen, fertig. Kein Zuschneiden nötig, die App schneidet auf 4:3 zu.
**Am besten Querformate verwenden:** bei Hochformaten bliebe nach dem Beschnitt
nur die Bildmitte übrig.

| Dateiname | Was aufs Bild gehört | Status |
|---|---|---|
| `kirche-a` | Kirche in **Hülsenbusch** (Gummersbach) | **Foto vorhanden** (Wikimedia) |
| `kirche-b` | Kirche in **Gimborn** (Marienheide) | **Foto vorhanden** (eigenes Foto, als `kirche-b.webp`) |
| `kirche-c` | Kirche in **Lindlar**, St. Severin | **Foto vorhanden** (eigenes Foto) |
| `kirche-d` | Kirche in **Frielingsdorf** (Lindlar) | **Foto vorhanden** (Wikimedia) |
| `hecke-a` | Hecke A auf Walks Grundstück | fehlt – nur als eigenes Foto möglich |
| `hecke-b` | Hecke B | fehlt – nur als eigenes Foto möglich |
| `hecke-c` | Hecke C – **das ist die richtige Antwort** (Rotbuche) | fehlt – nur als eigenes Foto möglich |
| `hecke-d` | Hecke D | fehlt – nur als eigenes Foto möglich |
| `baguette` | Baguette auf einem Tisch | **Foto vorhanden** (Wikimedia) |
| `lavendel` | sechs Blütenstiele nebeneinander: links Lavandin, rechts echter Lavendel | **Foto vorhanden** (eigenes Foto) |
| `bauwerk` | Kathedrale von Santiago de Compostela | **Foto vorhanden** (Wikimedia) |

Gimborn, Lindlar und der Lavendel sind durch eigene Fotos ersetzt. Es fehlen
nur noch die vier Heckenfotos.

## Bildnachweise (Wikimedia Commons)

Die Fotos stammen von Wikimedia Commons und stehen unter freien Lizenzen.
Bei Weitergabe gehört der Nachweis dazu; für den privaten Quizabend genügt diese Liste.

| Datei | Quelle (Commons) | Autor | Lizenz |
|---|---|---|---|
| `kirche-a.jpg` | [Ev Kirche Huelsenbusch.jpg](https://commons.wikimedia.org/wiki/File:Ev_Kirche_Huelsenbusch.jpg) | Sebastian Hirsch | CC BY-SA 3.0 |
| `kirche-d.jpg` | [Lindlar Frielingsdorf - Sankt Apollinaris 01 ies.jpg](https://commons.wikimedia.org/wiki/File:Lindlar_Frielingsdorf_-_Sankt_Apollinaris_01_ies.jpg) | Frank Vincentz | CC BY-SA 3.0 |
| `bauwerk.jpg` | [Santiago Compostela Cathedral 2023 – View from Alameda Park.jpg](https://commons.wikimedia.org/wiki/File:Santiago_Compostela_Cathedral_2023_-_View_from_Alameda_Park.jpg) | Fernando Pascullo | CC BY-SA 4.0 |
| `baguette.jpg` | [Baguette de pain, WikiCheese Lausanne.jpg](https://commons.wikimedia.org/wiki/File:Baguette_de_pain,_WikiCheese_Lausanne.jpg) | Yann Forget | CC BY-SA 4.0 |

`kirche-b.webp` (Gimborn), `kirche-c.jpg` (St. Severin in Lindlar) und
`lavendel.jpg` sind eigene Fotos und brauchen keinen Nachweis.

## Zum Lavendelfoto

`lavendel.jpg` zeigt sechs Blütenstiele nebeneinander auf einem Holzbrett. Die Frage
lautet „Welche Seite zeigt den echten Lavendel?" – die Antwort ist **rechts**.

| | links – Lavandin (*Lavandula × intermedia*) | rechts – echter Lavendel (*Lavandula angustifolia*) |
|---|---|---|
| Ähre | lang und locker, wirkt unterbrochen | kurz, dicht und kompakt |
| Blütenquirle | mit deutlichen Abständen übereinander, der Stiel schaut durch | fast lückenlos übereinander |
| Farbe | blasser, mit grünen Spitzen | tief violett |

Wird das Foto einmal ausgetauscht, muss auch `correct` in der Frage geprüft werden:
Aktuell ist Option 1 richtig („Die drei rechten"). Steht der echte Lavendel auf dem
neuen Bild links, gehört `correct:0` gesetzt – und die Auflösungsgrafik `lavendel`
in `renderViz()` vertauscht die Beschriftungen „links" und „rechts" entsprechend.

## Achtung bei den vier Kirchen

Die Dateinamen sind bewusst neutral. Würde die Datei `kirche-huelsenbusch.jpg`
heißen, stünde die Lösung während des Ratens auf der Leinwand: Solange ein Bild
fehlt, zeigt der Platzhalter den Dateinamen an.

Welches Bild zu welchem Ort gehört, steht deshalb nur in dieser Tabelle –
und in der Auflösung der Frage.
