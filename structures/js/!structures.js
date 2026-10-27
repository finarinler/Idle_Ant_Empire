/* =========================
    Loader: Strukturen
========================= */

const STRUCTURE_MODULES = [
    // Basis-Strukturen
    "structures/js/basic/foodStorage.js",
    "structures/js/basic/larvaeStorage.js",
    "structures/js/basic/royalChamber.js"
];

async function loadStructureModules()
{
    await loadScripts(STRUCTURE_MODULES);
}
