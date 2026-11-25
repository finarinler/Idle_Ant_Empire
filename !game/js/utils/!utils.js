/**
 * =========================
 * Loader: Utils
 * =========================
 */

const UTIL_MODULES = [
    "!game/js/utils/formatter.js",
    "!game/js/utils/antPool.js",
    "!game/js/utils/costs.js"
];

async function loadUtilModules()
{
    await loadScripts(UTIL_MODULES);
}
