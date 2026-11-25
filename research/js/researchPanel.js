/* =========================================================
   Idle Ant Empire — Forschungszentrum
   Karten-Daten der Wissenschaftskette (Schule → Universität → Labor).
   Die Oberfläche steht in research/research.html, die Karten erzeugt der
   gemeinsame CardBuilder. Bau- und Ausbildungsfunktionen folgen später;
   bis dahin zeigen die Karten ehrlich „Noch nicht verfügbar“.
========================================================= */

(() =>
{
    "use strict";

    const SOON = "missing"; // Karte normal dargestellt, Button deaktiviert

    function building(id, icon, tier, name, desc, max, productionLabel, production, capacityLabel, capacityNoun)
    {
        return {
            id: `science-${id}`,
            icon,
            type: `Gebäude · Stufe ${tier}`,
            name,
            desc,
            count: { value: "0", max },
            stats: [
                { label: productionLabel, value: production },
                { label: "Kapazität", value: `0 ${capacityNoun}` }
            ],
            costLabel: "Baukosten",
            cost: "Noch nicht verfügbar",
            action: { label: `${name} bauen`, keepLabel: true },
            status: () => ({ state: SOON, hint: "Baufunktion folgt..." })
        };
    }

    function scientist(id, icon, tier, name, desc, perUnitLabel, perUnit, cost, action, hint)
    {
        return {
            id: `science-${id}`,
            icon,
            symbolClass: "is-scientist",
            type: `Einheit · Stufe ${tier}`,
            name,
            desc,
            count: { value: "0", max: "0" },
            stats: [
                { label: perUnitLabel, value: perUnit, tone: "positive" },
                { label: "Freie Plätze", value: "0", tone: "positive" }
            ],
            costLabel: "Ausbildungskosten",
            cost,
            action: { label: action, keepLabel: true },
            status: () => ({ state: SOON, hint })
        };
    }

    CardBuilder.register("research-science", [
        building("school", "⌂", "I", "Schule", "Bildet neue Schüler aus und schafft Ausbildungsplätze.", "20", "FP-Produktion", "0 FP/s", "", "Schülerplätze"),
        building("university", "⌂", "II", "Universität", "Produziert Forschungspunkte und bildet Studenten aus.", "10", "Gebäudeproduktion", "+0,1 FP/s", "", "Studentenplätze"),
        building("lab", "⚗", "III", "Labor", "Ein spezialisiertes Gebäude für die höchste Ausbildungsstufe.", "5", "Gebäudeproduktion", "+0,3 FP/s", "", "Professorenplätze"),
        scientist("pupil", "♙", "I", "Schüler", "Deine erste direkte Quelle für Forschungspunkte.", "Produktion pro Schüler", "+0,1 FP/s", "Ameisen · Nahrung", "Schüler ausbilden", "Benötigt einen freien Platz in einer Schule."),
        scientist("student", "♟", "II", "Studenten", "Vertiefen das Wissen und steigern die FP-Produktion.", "Produktion pro Student", "+0,2 FP/s", "FP · Nahrung · Schüler", "Studenten ausbilden", "Benötigt freie Plätze an einer Universität."),
        scientist("professor", "♜", "III", "Professoren", "Die erfahrensten Köpfe deines Ameisenreichs.", "Produktion pro Professor", "+0,5 FP/s", "FP · Nahrung · Studenten", "Professoren ausbilden", "Benötigt freie Plätze in einem Labor.")
    ]);

    // Die Bereichsnavigation innerhalb der Forschungsseite scrollt nur, ohne die URL zu ändern.
    document.addEventListener("click", event =>
    {
        const link = event.target.closest(".research-view .research-nav-item");

        if (!link)
        {
            return;
        }

        event.preventDefault();

        const target = document.getElementById((link.getAttribute("href") || "").slice(1));

        if (target)
        {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
})();
