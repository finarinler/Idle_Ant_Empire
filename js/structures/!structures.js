/* =========================
    Loader: Strukturen
========================= */

const STRUCTURE_MODULES = [
    // Basis-Strukturen
    "js/structures/basic/foodStorage.js",
    "js/structures/basic/larvaeStorage.js",
    "js/structures/basic/royalChamber.js"
];

async function loadStructureModules()
{
    await loadScripts(STRUCTURE_MODULES);
}
