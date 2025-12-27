import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

interface KlageEintrag {
  id: string;
  klage: string;
  erwiderung: string;
  replik: string;
  gutachten: string;
}

const outputDir = "klage_export";

// Daten aus der Tabelle extrahiert und bereinigt
const daten: KlageEintrag[] = [
  { id: "a", klage: "(Dach, Brandschutz) Entgegen den Anforderungen nach § 30 Abs. 5 und 7 sowie § 32 Abs. 5 BauO NW", erwiderung: "", replik: "", gutachten: "" },
  { id: "a_aa", klage: "Brandwand zum östlichen Nachbarn hofseitig nur 25 cm (statt 30 cm) über Dach hoch geführt.", erwiderung: "Brandwand erhöht im Juni 2020", replik: "Erhöhung durch Betonlage ohne feste Verbindung laut Sachverständigem unzulässig.", gutachten: "Die Brandwand entspricht nicht den Forderungen gem. § 30 (5), weil Hohlräume und Fehlstellen nicht mit nicht brennbaren Stoffen gefüllt sind. Zudem brennbare PU-Hartschaumplatten als Wärmedämmung vorhanden." },
  { id: "a_bb", klage: "Brennbare Baustoffe für die über Dach geführten Brandwände verwendet.", erwiderung: "Erhöhung auf nicht brennbarem Material (Beton)", replik: "Nicht fachkundig.", gutachten: "Gummigranulatmatten oder PU-Hartschaumdämmung verwendet. Diese Baustoffe sind brennbar." },
  { id: "a_cc", klage: "Hohlräume in den über Dach geführten Brandwänden.", erwiderung: "Danach keine Hohlblockräume mehr vorhanden.", replik: "Hohlräume vermutlich verschlossen, aber nicht fachkundig.", gutachten: "Entspricht nicht § 30 Abs. 5, da Hohlräume/Fehlstellen nicht mit nicht brennbaren Materialien verschlossen sind. Ausführung nicht fachgerecht." },
  { id: "a_dd", klage: "Dachflächenfenster und Dachgauben Mindestabstände.", erwiderung: "Wegen Erhöhung überragt Brandwand Fenster/Gauben um 30 cm.", replik: "", gutachten: "Abstände entsprechen Anforderungen gem. BauO NRW § 32 Abs. 5." },
  { id: "a_ee", klage: "Mauerkrone westlicher Nachbar zu niedrig/brennbar.", erwiderung: "Mauerkrone mit nicht brennbaren Materialien erhöht.", replik: "", gutachten: "Höhe von 33 cm ausreichend. Aber entgegen § 30 (7) brennbare Baustoffe eingebaut." },
  { id: "b", klage: "(Dach mit Gauben, Anschlüsse und Einfassungen, u. a.)", erwiderung: "Mängel vollständig und fachgerecht gemäß Anlage B 2 beseitigt.", replik: "Nicht vom unabhängigen Gutachter geprüft, viele Mängel nicht behoben.", gutachten: "" },
  { id: "b_aa", klage: "Überdeckung Dachziegel Anschlussblech < 100 mm.", erwiderung: "", replik: "", gutachten: "Überdeckung der Dachziegel durch Metallanschlüsse weniger als 100 mm." },
  { id: "b_bb", klage: "Seitliche Anschlüsse: Profilierte Dachziegel Überlappung unzureichend.", erwiderung: "", replik: "", gutachten: "Überdecken die Hochpunkte der Dachziegel nicht ausreichend." },
  { id: "b_cc", klage: "Seitliche Anschlüsse: Schichtstücke aus Blei Überlappung < 100 mm.", erwiderung: "", replik: "", gutachten: "Nicht mindestens 100 mm." },
  { id: "b_dd", klage: "Schadstellen in den Metallanschlüssen.", erwiderung: "", replik: "", gutachten: "Schadstelle vorhanden, durch die Wasser in die Bausubstanz gelangen kann." },
  { id: "b_ee", klage: "Anschluss Kamin durch nicht geregelte Baustoffe.", erwiderung: "", replik: "", gutachten: "Verwendete Klebebänder für solche Zwecke ungeeignet." },
  { id: "b_ff", klage: "Selbstklebendes Anschlussband nicht geregelt / löst sich ab.", erwiderung: "", replik: "", gutachten: "Klebebänder ungeeignet und lösen sich vom Untergrund." },
  { id: "b_gg", klage: "Überdeckung Aufkantung Flachdachabdichtung < 100 mm.", erwiderung: "", replik: "", gutachten: "Straßenseitig ca. 7 cm (zu wenig), hofseitig ca. 19 cm (okay)." },
  { id: "b_hh", klage: "Beschädigte Dachziegel eingebaut.", erwiderung: "", replik: "Vielzahl von Dachziegeln beschädigt und nicht ausgetauscht.", gutachten: "Teilweise beschädigte Dachziegel eingebaut." },
  { id: "b_jj", klage: "Unterdeckbahn Hinterlaufung / Wassersäcke / Bauschutt.", erwiderung: "", replik: "", gutachten: "Hinterläuft Abdichtung, Wassersäcke vorhanden, Bauschutt im Traufbereich." },
  { id: "b_kk", klage: "Dampfbremsfolie ohne lineare Anpressung.", erwiderung: "", replik: "", gutachten: "Folie liegt lose an, wird nicht mit Anpresslatte gehalten." },
  { id: "b_ll", klage: "Windsogbefestigung fehlt.", erwiderung: "", replik: "", gutachten: "Windsogbefestigung der Dachziegel nicht vorhanden." },
  { id: "b_mm", klage: "Flachdachabdichtung nicht vollflächig verklebt.", erwiderung: "", replik: "", gutachten: "Obere und untere Abdichtungslagen nicht vollflächig miteinander verklebt." },
  { id: "b_nn", klage: "Strukturschäden Bitumenabdichtung / Trägereinlage offen.", erwiderung: "", replik: "", gutachten: "Schäden durch mechanische/thermische Einwirkung, Trägereinlage partiell sichtbar." },
  { id: "c", klage: "(Flachdach oberste Dachterrasse)", erwiderung: "wie vor", replik: "", gutachten: "" },
  { id: "c_aa", klage: "Nahtfügebreiten Schweißnähte < 20 mm.", erwiderung: "", replik: "", gutachten: "Nicht zuverlässig ablesbar." },
  { id: "c_bb", klage: "Gefälle oberste Dachterrasse fehlt.", erwiderung: "", replik: "Kein Gefälle an Terrassen Whg 2, 4 und 5.", gutachten: "Gefällelos ausgeführt." },
  { id: "c_cc", klage: "Geländerfüße Abdichtungswerkstoffwechsel / Trägervlies fehlt.", erwiderung: "", replik: "", gutachten: "Wechsel auf Flüssigkunststoff unzureichend, Trägervlies fehlt teilweise." },
  { id: "d", klage: "(Flachdach, Abdichtungsbahn) Nicht mechanisch fixiert.", erwiderung: "wie vor", replik: "", gutachten: "Nicht mechanisch fixiert gegen Windsog, Auflast reicht nicht aus." },
  { id: "e", klage: "(Übrige Flachdächer, Terrassen)", erwiderung: "", replik: "", gutachten: "" },
  { id: "e_aa", klage: "Kaltselbstklebende Polymerbitumenbahn statt Schweißbahn.", erwiderung: "", replik: "", gutachten: "Teilweise Folienbahn statt Schweißbahn eingebaut." },
  { id: "e_bb", klage: "Abdichtungshochführung < 15 cm / Randabschluss fehlt.", erwiderung: "", replik: "Nicht behoben an Terrasse Whg 2,3,4.", gutachten: "An keiner Stelle bis 15 cm geführt." },
  { id: "e_cc", klage: "Terrassentüren: Abdichtungshochführung < 5 cm.", erwiderung: "", replik: "Nicht behoben an Terrasse Whg 2,3,4.", gutachten: "Endet unterhalb des Belags oder zu niedrig." },
  { id: "e_dd", klage: "Unterkonstruktion / Beläge ohne Gefälle.", erwiderung: "", replik: "Nicht behoben an Terrasse Whg 2, 3, 4 und 5.", gutachten: "Gefällelos ausgeführt." },
  { id: "f", klage: "(Dachrinnen) Verstöße gegen a.a.R.d.T.", erwiderung: "Bestreitung durch Beklagte.", replik: "", gutachten: "" },
  { id: "f_aa", klage: "Weichlotbreiten zu gering.", erwiderung: "", replik: "", gutachten: "Geringere Breite als zulässig verringert Festigkeit." },
  { id: "f_bb", klage: "Rohrschellen / Abrutschsicherung Fallrohre.", erwiderung: "", replik: "", gutachten: "Rohre nicht wirksam gegen Abrutschen gesichert." },
  { id: "f_cc", klage: "Vorderkante Dachrinne höher als Hinterkante.", erwiderung: "Nicht substantiiert.", replik: "Wasser läuft an Gebäude, Ablagerungen/Verstopfungen.", gutachten: "Rinnenvorderkanten liegen höher als hintere Kanten." },
  { id: "f_dd", klage: "Abdichtung gegen Hinterlaufen an Rinne Nachbar.", erwiderung: "", replik: "", gutachten: "Nicht ausreichend sicher herangeführt." },
  { id: "f_ee", klage: "Querschnitte Dachrinnen zu klein.", erwiderung: "Nicht nachvollziehbar.", replik: "Rückstaugefahr.", gutachten: "Nenngrößen sind ausreichend groß." },
  { id: "f_ff", klage: "Korrosionsschutz Zinkblech fehlt.", erwiderung: "", replik: "", gutachten: "Lückenhaft oder gar nicht beschichtet." },
  { id: "f_gg", klage: "Knicke und Dellen in den Dachrinnen.", erwiderung: "", replik: "", gutachten: "3 von 13 Dachrinnen weisen Knicke/Dellen auf." },
  { id: "g", klage: "(Dachentwässerung) Kaskaden / Glatteisgefahr.", erwiderung: "Soll behoben sein.", replik: "Wasser fließt auf Innenhof, keine Entwässerungsanlage.", gutachten: "Feuchtebelastungen im Hof, Rutschgefahr durch Glatteisbildung." },
  { id: "h", klage: "Sockel Innenhof Feuchtigkeitsschutz.", erwiderung: "", replik: "Mangel nicht behoben.", gutachten: "" },
  { id: "i", klage: "(Metallarbeiten Dachgauben) Mängel.", erwiderung: "", replik: "", gutachten: "" },
  { id: "i_aa", klage: "Anschlussbleche Laibungen Dellen.", erwiderung: "", replik: "Mangel nicht behoben.", gutachten: "" },
  { id: "i_bb", klage: "Fensterbänke kein Gefälle.", erwiderung: "", replik: "Mangel nicht behoben.", gutachten: "" },
  { id: "i_cc", klage: "Anschluss Fensterbänke wasserhinterläufig.", erwiderung: "", replik: "", gutachten: "" },
  { id: "j", klage: "Dachrandabdeckungen von oben verschraubt.", erwiderung: "", replik: "", gutachten: "" },
  { id: "k", klage: "Parkettboden / Estrich im Außenbereich / Luftdichtheit.", erwiderung: "Bestritten.", replik: "Estrich/Holzträger unverändert.", gutachten: "Fußbodenheizung/Estrich verlaufen bis in den Außenbereich." },
  { id: "l", klage: "Hofseitige Dachgaube Standsicherheit / Holzschäden.", erwiderung: "Neu eingekleidet.", replik: "Einkleidung behebt Holzschaden nicht.", gutachten: "Aus geschädigten Hölzern errichtet, Gebrauchstauglichkeit eingeschränkt." },
  { id: "m", klage: "Straßenseitige Terrasse: Ungeeignete Schrauben.", erwiderung: "Soll behoben sein.", replik: "Trockenbauschrauben noch vorhanden.", gutachten: "Schrauben für Außenbereich ungeeignet." },
  { id: "n", klage: "Wärmedämmung / Feuchtigkeitsschäden / Gipskarton.", erwiderung: "Sollte beseitigt werden.", replik: "Termine nicht durchführbar.", gutachten: "Wärmedämmung unzureichend, Verfärbungen durch Feuchte, Gipskarton direkt auf Sparren." },
  { id: "o", klage: "WPC-Dielen gefällelos / verformt / korrodierte Schrauben.", erwiderung: "Kein Gefälle geschuldet.", replik: "Dielen verformt/lösen sich.", gutachten: "Nicht fachgerecht (gefällelos), Schrauben korrodiert, Dielen verformt." },
  { id: "p", klage: "Terrassengeländer instabil / korrodiert.", erwiderung: "Behoben.", replik: "Nicht behoben an Whg 2/4.", gutachten: "Teils instabil ('wackelig'), Klemmhalter korrodiert." },
  { id: "q", klage: "Brandschutzmanschetten fehlen.", erwiderung: "Nicht erforderlich.", replik: "Zwingend erforderlich bei Decken mit Brandschutzfunktion.", gutachten: "" },
  { id: "r", klage: "Bodentiefe Fenster (Whg 2) nicht fachgerecht.", erwiderung: "Bestritten.", replik: "Keine Beseitigung.", gutachten: "Entwässerung verschlossen, Anschlusshöhe zu gering." },
  { id: "s", klage: "Anschluss Nachbarhaus (Bauschaum).", erwiderung: "Soll beseitigt sein.", replik: "Keine Beseitigung.", gutachten: "Stelle im Gutachten nicht eindeutig lokalisierbar." }
];

async function run() {
  // Ordner erstellen
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  // Einzeldateien schreiben
  for (const eintrag of daten) {
    const fileName = `${eintrag.id}.md`;
    const content = `
# Klagepunkt: ${eintrag.id.toUpperCase().replace('_', ' ')}

## Klage
${eintrag.klage}

## Klageerwiderung
${eintrag.erwiderung || "*Kein Inhalt*"}

## Bemerkungen / Replik
${eintrag.replik || "*Kein Inhalt*"}

## Ergebnis Gutachten Romstedt
${eintrag.gutachten || "*Kein Inhalt*"}
`.trim();

    await Bun.write(join(outputDir, fileName), content);
  }

  // Uebersicht.md schreiben
  let overview = "# Verfahrensübersicht\n\n| Klagepunkt | Kurzfassung |\n| :--- | :--- |\n";
  for (const eintrag of daten) {
    const shortKlage = eintrag.klage.length > 80 ? eintrag.klage.slice(0, 77) + "..." : eintrag.klage;
    overview += ` [${eintrag.id}.md](${eintrag.id}.md)| ${shortKlage} |  |\n`;
  }

  await Bun.write(join(outputDir, "Uebersicht.md"), overview);

  console.log(`✅ Fertig! ${daten.length} Dateien wurden im Ordner '${outputDir}' erstellt.`);
}

run();
