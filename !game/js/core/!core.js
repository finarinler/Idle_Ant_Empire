/**
 * =========================
 * Loader: Core
 * Konfiguration, Kapazitäten, Produktion, Offline-Fortschritt, Game Loop
 * =========================
 */

const CORE_MODULES = [
    "!game/js/core/coreConfig.js",
    "!game/js/core/capacity.js",
    "!game/js/core/rates.js",
    "!game/js/core/production.js",
    "!game/js/core/offlineProgress.js",
    "!game/js/core/gameLoop.js"
];

async function loadCoreModules()
{
    await loadScripts(CORE_MODULES);
}
