/* =========================
    Loader: Einheiten
========================= */

const UNIT_MODULES = [
    // Basis-Einheiten
    "units/js/basic/ant.js",
    "units/js/basic/queen.js",
    "units/js/basic/scout.js",

    // Elite-Einheiten
    "units/js/elite/eliteRequirements.js",
    "units/js/elite/storageGuardian.js",
    "units/js/elite/grandNurse.js",
    "units/js/elite/broodExpert.js",
    "units/js/elite/soldier.js"
];

async function loadUnitModules()
{
    await loadScripts(UNIT_MODULES);
}
