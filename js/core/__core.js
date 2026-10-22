/**
 * =========================
 * Loader: Core
 * Konfiguration, Kapazitäten, Produktion, Offline-Fortschritt, Game Loop
 * =========================
 */

const CORE_MODULES = [
    "js/core/coreConfig.js",
    "js/core/capacity.js",
    "js/core/rates.js",
    "js/core/production.js",
    "js/core/offlineProgress.js",
    "js/core/gameLoop.js"
];

async function loadCoreModules()
{
    await loadScripts(CORE_MODULES);
}
