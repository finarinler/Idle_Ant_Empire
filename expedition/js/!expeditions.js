/* =========================
    Loader: Expeditionen
========================= */

const EXPEDITION_MODULES = [
    "expedition/js/expeditionRewards.js",
    "expedition/js/expeditionUI.js",
    "expedition/js/expeditionControl.js",
    "expedition/js/expeditionResult.js"
];

async function loadExpeditionModules()
{
    await loadScripts(EXPEDITION_MODULES);
}
