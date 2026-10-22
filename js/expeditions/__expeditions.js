/* =========================
    Loader: Expeditionen
========================= */

const EXPEDITION_MODULES = [
    "js/expeditions/expeditionRewards.js",
    "js/expeditions/expeditionUI.js",
    "js/expeditions/expeditionControl.js",
    "js/expeditions/expeditionResult.js"
];

async function loadExpeditionModules()
{
    await loadScripts(EXPEDITION_MODULES);
}
