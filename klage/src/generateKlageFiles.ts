import * as fs from 'fs';
import * as path from 'path';

interface KlageEintrag {
    id: string;
    klage: string;
    erwiderung: string;
    replik: string;
    gutachten: string;
}

const outputFolder = 'Klageverfahren_Export_TS';

// Die Daten aus der Tabelle
const daten: KlageEintrag[] = [
    { id: "a", klage: "(Dach, Brandschutz) Entgegen den Anforderungen nach § 30 Abs. 5 und 7 sowie § 32 Abs. 5 BauO NW", erwiderung: "", replik: "", gutachten: "" },
    { id: "a_aa", klage: "Brandwand zum östlichen Nachbarn hofseitig nur 25 cm (statt 30 cm) über Dach hoch geführt.", erwiderung: "Brandwand erhöht im Juni 2020", replik: "Erhöhung durch Betonlage ohne feste Verbindung laut Sachverständigem unzulässig.", gutachten: "Höhe von 30 cm erreicht, aber Hohlräume/Fehlstellen nicht gefüllt und brennbare PU-Dämmung vorhanden. Entspricht nicht § 30 Abs. 5/7." },
    { id: "a_bb", klage: "Brennbare Baustoffe für die über Dach geführten Brandwände verwendet.", erwiderung: "Erhöhung auf nicht brennbarem Material (Beton).", replik: "Nicht fachkundig.", gutachten: "Gummigranulatmatten oder PU-Hartschaumdämmung verwendet. Diese sind brennbar." },
    { id: "a_cc", klage: "Hohlräume in den über Dach geführten Brandwänden.", erwiderung: "Keine Hohlblockräume mehr vorhanden.", replik: "Vermutlich verschlossen, aber nicht fachkundig.", gutachten: "Hohlräume/Lunker nicht mit nicht brennbaren Materialien verschlossen. Ausführung nicht fachgerecht." },
    { id: "a_dd", klage: "Dachflächenfenster und Dachgauben Abstände/Überragung.", erwiderung: "Brandwand überragt Fenster/Gauben um 30 cm.", replik: "", gutachten: "Abstände entsprechen Anforderungen, da Brandwände 30 cm überragen." },
    { id: "a_ee", klage: "Mauerkrone westlicher Nachbar zu niedrig/brennbar.", erwiderung: "Mauerkrone mit nicht brennbaren Materialien erhöht.", replik: "", gutachten: "Höhe von 33 cm ausreichend. Aber brennbare Baustoffe eingebaut (Verstoß § 30 Abs. 7)." },
    { id: "b", klage: "(Dach mit Gauben, Anschlüsse und Einfassungen, u. a.)", erwiderung: "Mängel vollständig und fachgerecht beseitigt (Anlage B 2).", replik: "Nicht vom unabhängigen Gutachter geprüft, viele Mängel nicht behoben.", gutachten: "" },
    { id: "b_aa", klage: "Überdeckung Dachziegel Anschlussblech < 100 mm.", erwiderung: "", replik: "", gutachten: "Überdeckung weniger als 100 mm." },
    { id: "b_bb", klage: "Seitliche Anschlüsse: Profilierte Dachziegel Überlappung unzureichend.", erwiderung: "", replik: "", gutachten: "Überdecken die Hochpunkte der Dachziegel nicht ausreichend." },
    { id: "b_cc", klage: "Seitliche Anschlüsse: Schichtstücke aus Blei Überlappung < 100 mm.", erwiderung: "", replik: "", gutachten: "Überlappung nicht mindestens 100 mm." },
    { id: "b_dd", klage: "Schadstellen in den Metallanschlüssen.", erwiderung: "", replik: "", gutachten: "Schadstelle am südlichen Anschluss, Wasser kann in Bausubstanz gelangen." },
    { id: "b_ee", klage: "Anschluss Kamin durch nicht geregelte Baustoffe.", erwiderung: "", replik: "", gutachten: "Verwendete Klebebänder ungeeignet." },
    { id: "b_ff", klage: "Selbstklebendes Anschlussband nicht geregelt / löst sich ab.", erwiderung: "", replik: "", gutachten: "Klebebänder ungeeignet und lösen sich vom Untergrund." },
    { id: "b_gg", klage: "Überdeckung Aufkantung Flachdachabdichtung < 100 mm.", erwiderung: "", replik: "", gutachten: "Straßenseitig ca. 7 cm (zu wenig), hofseitig ca. 19 cm (okay)." },
    { id: "b_hh", klage: "Beschädigte Dachziegel eingebaut.", erwiderung: "", replik: "Vielzahl beschädigt und nicht ausgetauscht.", gutachten: "Teilweise beschädigte Dachziegel eingebaut." },
    { id: "b_jj", klage: "Unterdeckbahn Hinterlaufung / Wassersäcke / Bauschutt.", erwiderung: "", replik: "", gutachten: "Hinterläuft Abdichtung, Wassersäcke vorhanden, Bauschutt im Traufbereich." },
    { id: "b_kk", klage: "Dampfbremsfolie ohne lineare Anpressung.", erwiderung: "", replik: "", gutachten: "Folie liegt lose an, keine Anpresslatte." },
    { id: "b_ll", "klage": "Windsogbefestigung fehlt.", erwiderung: "", replik: "", gutachten: "Windsogbefestigung nicht vorhanden." },
    { id: "b_mm", klage: "Flachdachabdichtung nicht vollflächig verklebt.", erwiderung: "", replik: "", gutachten: "Obere/untere Lagen lassen sich abheben (Gauben/Terrasse Whg 4)." },
    { id: "b_nn", klage: "Strukturschäden Bitumenabdichtung / Trägereinlage offen.", erwiderung: "", replik: "", gutachten: "Schäden durch Mechanik/Temperatur, Trägereinlage an einer Stelle sichtbar." },
    { id: "c", klage: "(Flachdach oberste Dachterrasse)", erwiderung: "wie vor", replik: "", gutachten: "" },
    { id: "c_aa", klage: "Nahtfügebreiten Schweißnähte < 20 mm.", erwiderung: "", replik: "", gutachten: "Können nicht zuverlässig abgelesen werden." },
    { id: "c_bb", klage: "Unterkonstruktion / Abdichtung / Beläge ohne Gefälle.", erwiderung: "", replik: "Kein Gefälle an Terrassen Whg 2, 4 und 5.", gutachten: "Gefällelos ausgeführt." },
    { id: "c_cc", klage: "Geländerfüße Abdichtungswerkstoffwechsel / Trägervlies fehlt.", erwiderung: "", replik: "", gutachten: "Wechsel auf Flüssigkunststoff unzureichend geführt, Trägervlies fehlt teilweise." },
    { id: "d", klage: "(Flachdach, Abdichtungsbahn) Nicht mechanisch fixiert.", erwiderung: "wie vor", replik: "", gutachten: "Nicht mechanisch fixiert gegen Windsog, Auflast reicht nicht aus." },
    { id: "e", klage: "(Übrige Flachdächer, Terrassen)", erwiderung: "", replik: "", gutachten: "" },
    { id: "e_aa", klage: "Kaltselbstklebende Polymerbitumenbahn statt Schweißbahn.", erwiderung: "", replik: "", gutachten: "Teilweise Folienbahn statt geforderter Schweißbahn." },
    { id: "e_bb", klage: "Abdichtungshochführung < 15 cm / Randabschluss fehlt.", erwiderung: "", replik: "Nicht behoben an Terrasse Whg 2,3,4.", gutachten: "An keiner Stelle bis 15 cm geführt." },
    { id: "e_cc", klage: "Terrassentüren: Abdichtungshochführung < 5 cm.", erwiderung: "", replik: "Nicht behoben an Terrasse Whg 2,3,4.", gutachten: "Endet unterhalb des Belags oder zu niedrig (4-5 cm)." },
    { id: "e_dd", klage: "Unterkonstruktion / Beläge ohne Gefälle.", erwiderung: "", replik: "Nicht behoben an Terrasse Whg 2, 3, 4 und 5.", gutachten: "Gefällelos ausgeführt." },
    { id: "f", klage: "(Dachrinnen) Verstöße gegen a.a.R.d.T.", erwiderung: "Bestreitung durch Beklagte.", replik: "", gutachten: "" },
    { id: "f_aa", klage: "Weichlotbreiten zu gering.", erwiderung: "", replik: "", gutachten: "Lötnähte zu schmal, verringerte Festigkeit." },
    { id: "f_bb", klage: "Rohrschellen / Abrutschsicherung Fallrohre.", erwiderung: "", replik: "", gutachten: "Fast keines der Rohre wirksam gegen Abrutschen gesichert." },
    { id: "f_cc", klage: "Vorderkante Dachrinne höher als Hinterkante.", erwiderung: "Nicht substantiiert.", replik: "Wasser läuft an Gebäude, Ablagerungen/Verstopfungen.", gutachten: "Vorderkanten liegen höher als hintere Kanten." },
    { id: "f_dd", klage: "Abdichtung gegen Hinterlaufen an Rinne Nachbar.", erwiderung: "", replik: "", gutachten: "Nicht ausreichend sicher herangeführt." },
    { id: "f_ee", klage: "Querschnitte Dachrinnen zu klein.", erwiderung: "Nicht nachvollziehbar.", replik: "Rückstaugefahr.", gutachten: "Querschnitte sind ausreichend groß." },
    { id: "f_ff", klage: "Korrosionsschutz Zinkblech fehlt.", erwiderung: "", replik: "", gutachten: "Lückenhaft oder gar nicht beschichtet." },
    { id: "f_gg", klage: "Knicke und Dellen in den Dachrinnen.", erwiderung: "", replik: "", gutachten: "3 von 13 Rinnen weisen Knicke/Dellen auf." },
    { id: "g", klage: "(Dachentwässerung) Kaskaden / Glatteisgefahr.", erwiderung: "Soll behoben sein.", replik: "Wasser fließt auf Innenhof, keine Entwässerungsanlage.", gutachten: "Feuchtebelastungen im Hof, Rutschgefahr durch Glatteisbildung." },
    { id: "h", klage: "Sockel Innenhof Feuchtigkeitsschutz.", erwiderung: "", replik: "Mangel nicht behoben.", gutachten: "" },
    { id: "i", klage: "(Metallarbeiten Dachgauben) Mängel.", erwiderung: "", replik: "", gutachten: "" },
    { id: "i_aa", klage: "Anschlussbleche Laibungen Dellen.", erwiderung: "", replik: "Mangel nicht behoben.", gutachten: "" },
    { id: "i_bb", klage: "Fensterbänke kein Gefälle.", erwiderung: "", replik: "Mangel nicht behoben.", gutachten: "" },
    { id: "i_cc", klage: "Anschluss Fensterbänke wasserhinterläufig.", erwiderung: "", replik: "", gutachten: "" },
    { id: "j", klage: "Dachrandabdeckungen von oben verschraubt.", erwiderung: "", replik: "", gutachten: "" },
    { id: "k", klage: "Parkettboden / Estrich im Außenbereich / Luftdichtheit.", erwiderung: "Bestritten.", replik: "Estrich/Holzträger unverändert.", gutachten: "Fußbodenheizung/Trockenestrich verlaufen bis in den Außenbereich." },
    { id: "l", klage: "Hofseitige Dachgaube Standsicherheit / Holzschäden.", erwiderung: "Neu eingekleidet.", replik: "Einkleidung behebt Holzschaden nicht.", gutachten: "Aus geschädigten Hölzern errichtet, Gebrauchstauglichkeit eingeschränkt." },
    { id: "m", klage: "Straßenseitige Terrasse: Ungeeignete Schrauben.", erwiderung: "Soll behoben sein.", replik: "Trockenbauschrauben noch vorhanden.", gutachten: "Schrauben für Außenbereich ungeeignet." },
    { id: "n", klage: "Wärmedämmung / Feuchtigkeitsschäden / Gipskarton.", erwiderung: "Sollte beseitigt werden.", replik: "Termine nicht durchführbar.", gutachten: "Wärmedämmung unzureichend, Verfärbungen durch Feuchte, Gipskarton direkt auf Sparren." },
    { id: "o", klage: "WPC-Dielen gefällelos / verformt / korrodierte Schrauben.", erwiderung: "Kein Gefälle geschuldet.", replik: "Dielen verformt/lösen sich.", gutachten: "Nicht fachgerecht (gefällelos), Schrauben korrodiert, Dielen verformt." },
    { id: "p", klage: "Terrassengeländer instabil / korrodiert.", erwiderung: "Behoben.", replik: "Nicht behoben an Whg 2/4.", gutachten: "Teils instabil ('wackelig'), Klemmhalter korrodiert." },
    { id: "q", klage: "Brandschutzmanschetten fehlen.", erwiderung: "Nicht erforderlich.", replik: "Zwingend erforderlich bei Decken mit Brandschutzfunktion.", gutachten: "" },
    { id: "r", klage: "Bodentiefe Fenster (Whg 2) nicht fachgerecht.", erwiderung: "Bestritten.", replik: "Keine Beseitigung.", gutachten: "Entwässerung verschlossen, Anschlusshöhe zu gering." },
    { id: "s", klage: "Anschluss Nachbarhaus (Bauschaum).", erwiderung: "Soll beseitigt sein.", replik: "Keine Beseitigung.", gutachten: "Aufgrund Fotoqualität im Gutachten Krämer nicht eindeutig lokalisierbar." }
];

function generateFiles() {
    // Ordner erstellen
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    // Einzeldateien generieren
    daten.forEach(punkt => {
        const fileName = `${punkt.id}.md`;
        const filePath = path.join(outputFolder, fileName);
        
        const content = `
# Klagepunkt: ${punkt.id.toUpperCase().replace('_', ' ')}

## Klage
${punkt.klage}

## Klage erwiderung
${punkt.erwiderung || '*Kein Inhalt*'}

## Bemerkungen / Replik
${punkt.replik || '*Kein Inhalt*'}

## Ergebnis Gutachten Romstedt
${punkt.gutachten || '*Kein Inhalt*'}
`.trim();

        fs.writeFileSync(filePath, content, 'utf8');
    });

    // Uebersicht.md generieren
    const overviewPath = path.join(outputFolder, 'Uebersicht.md');
    let overviewContent = '# Verfahrensübersicht\n\n| Klage | Detail-Link |\n| :--- | :--- |\n';

    daten.forEach(punkt => {
        const shortKlage = punkt.klage.length > 80 ? punkt.klage.substring(0, 77) + '...' : punkt.klage;
        overviewContent += `| ${shortKlage} | [${punkt.id}.md](${punkt.id}.md) |\n`;
    });

    fs.writeFileSync(overviewPath, overviewContent, 'utf8');

    console.log(`Erfolg! ${daten.length} Dateien und die Uebersicht.md wurden im Ordner '${outputFolder}' erstellt.`);
}

generateFiles();
