/* =========================
    Loader: Initialisierung
========================= */

const INITIALIZATION_MODULES = [
    "js/initialization/eventListeners.js",
    "js/initialization/initGame.js"
];

async function loadInitializationModules()
{
    await loadScripts(INITIALIZATION_MODULES);
}
