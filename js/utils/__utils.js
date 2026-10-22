/**
 * =========================
 * Loader: Utils
 * =========================
 */

const UTIL_MODULES = [
    "js/utils/formatter.js",
    "js/utils/antPool.js",
    "js/utils/costs.js"
];

async function loadUtilModules()
{
    await loadScripts(UTIL_MODULES);
}
