/* =========================
    Loader: Einheiten
========================= */

const UNIT_MODULES = [
    // Basis-Einheiten
    "js/units/basic/ant.js",
    "js/units/basic/queen.js",
    "js/units/basic/scout.js",

    // Elite-Einheiten
    "js/units/elite/eliteRequirements.js",
    "js/units/elite/storageGuardian.js",
    "js/units/elite/grandNurse.js",
    "js/units/elite/broodExpert.js",
    "js/units/elite/soldier.js"
];

async function loadUnitModules()
{
    await loadScripts(UNIT_MODULES);
}
