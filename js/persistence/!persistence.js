/* =========================
    Loader: Persistenz
========================= */

const PERSISTENCE_MODULES = [
    "js/persistence/saveGame.js",
    "js/persistence/loadGame.js",
    "js/persistence/resetGame.js"
];

async function loadPersistenceModules()
{
    await loadScripts(PERSISTENCE_MODULES);
}
