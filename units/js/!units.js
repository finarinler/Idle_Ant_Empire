/* =========================
    Loader: Einheiten
    Jede Einheit hat ihre eigene Definitionsdatei (units/js/definitions).
    Danach folgen die Aktionen (UI-Anbindung an die zentrale Wirtschaft) und der Katalog.
========================= */

const UNIT_MODULES = [
    "units/js/definitions/normal-ant.js",
    "units/js/definitions/queen.js",
    "units/js/definitions/collector.js",
    "units/js/definitions/scout.js",
    "units/js/definitions/brood-expert.js",
    "units/js/definitions/builder.js",
    "units/js/definitions/storage-keeper.js",
    "units/js/definitions/grand-nurse.js",
    "units/js/unitActions.js",
    "units/js/unitCatalog.js"
];

async function loadUnitModules()
{
    await loadScripts(UNIT_MODULES);
}
