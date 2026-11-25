/* =========================
    Loader: Gebäude
    Jedes Gebäude hat seine eigene Definitionsdatei (structures/js/definitions).
========================= */

const STRUCTURE_MODULES = [
    "structures/js/definitions/housing-chamber.js",
    "structures/js/definitions/mushroom-farm.js",
    "structures/js/definitions/storage-room.js",
    "structures/js/definitions/brood-chamber.js",
    "structures/js/definitions/construction-chamber.js",
    "structures/js/definitions/queen-chamber.js",
    "structures/js/structureActions.js",
    "structures/js/structureCatalog.js"
];

async function loadStructureModules()
{
    await loadScripts(STRUCTURE_MODULES);
}
