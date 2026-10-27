/* =========================
    Loader: Persistenz
========================= */

const PERSISTENCE_MODULES = [
    "!game/js/persistence/saveGame.js",
    "!game/js/persistence/loadGame.js",
    "!game/js/persistence/resetGame.js"
];

async function loadPersistenceModules()
{
    await loadScripts(PERSISTENCE_MODULES);
}
