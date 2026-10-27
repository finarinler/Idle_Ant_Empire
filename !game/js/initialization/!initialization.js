/* =========================
    Loader: Initialisierung
========================= */

const INITIALIZATION_MODULES = [
    "!game/js/initialization/eventListeners.js",
    "!game/js/initialization/initGame.js"
];

async function loadInitializationModules()
{
    await loadScripts(INITIALIZATION_MODULES);
}
