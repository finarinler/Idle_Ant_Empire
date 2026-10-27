/* =========================
    Loader: Gebäude
========================= */

const STRUCTURE_MODULES = [
    "structures/js/structures.js",
    "structures/js/structureCatalog.js"
];

async function loadStructureModules()
{
    await loadScripts(STRUCTURE_MODULES);
}
