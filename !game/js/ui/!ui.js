/* =========================
    Loader: UI
========================= */

const UI_MODULES = [
    "!game/js/ui/domCache.js",
    "!game/js/ui/statusBar.js",
    "log/js/log.js",
    "!game/js/ui/panels.js",
    "!game/js/ui/categories.js",
    "!game/js/ui/cardBuilder.js",
    "!game/js/ui/visualEffects.js",
    "!game/js/ui/resourceUI.js",
    "!game/js/ui/languageUI.js",
    "options/js/optionsMenu.js"
];

async function loadUIModules()
{
    await loadScripts(UI_MODULES);
}
