/**
 * =========================
 * Loader: Core
 * Konfiguration, zentrale Wirtschaft, Offline-Fortschritt, Game Loop
 * =========================
 */

const CORE_MODULES = [
    "!game/js/core/coreConfig.js",
    "!game/js/core/economy/balanceConfig.js",
    "!game/js/core/economy/resourceDefinitions.js",
    "!game/js/core/economy/registries.js",
    "!game/js/core/economy/economyState.js",
    "!game/js/core/economy/economyFlows.js",
    "!game/js/core/economy/economyAdvance.js",
    "!game/js/core/economy/economyActions.js",
    "!game/js/core/offlineProgress.js",
    "!game/js/core/gameLoop.js"
];

async function loadCoreModules()
{
    await loadScripts(CORE_MODULES);
}
