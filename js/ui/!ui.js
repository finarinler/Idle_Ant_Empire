/* =========================
    Loader: UI
========================= */

const UI_MODULES = [
    "js/ui/domCache.js",
    "js/ui/statusBar.js",
    "js/ui/log.js",
    "js/ui/panels.js",
    "js/ui/categories.js",
    "js/ui/unitButton.js",
    "js/ui/visualEffects.js",
    "js/ui/resourceUI.js",
    "js/ui/languageUI.js",
    "js/ui/optionsMenu.js"
];

async function loadUIModules()
{
    await loadScripts(UI_MODULES);
}
