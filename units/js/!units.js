/* =========================
    Loader: Einheiten
    Logik zuerst, danach der Katalog (Daten + Darstellung der Karten).
========================= */

const UNIT_MODULES = [
    "units/js/basic/ant.js",
    "units/js/basic/queen.js",
    "units/js/basic/scout.js",
    "units/js/elite/eliteUnits.js",
    "units/js/elite/broodExpert.js",
    "units/js/unitCatalog.js"
];

async function loadUnitModules()
{
    await loadScripts(UNIT_MODULES);
}
