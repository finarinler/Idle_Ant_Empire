
/* =========================
    Loader: Expedition Achievements

    Lädt die Expeditions-Erfolge.
========================= */

const EXPEDITION_ACHIEVEMENT_MODULES = [
    "achievements/js/expedition/foundTenAnts.js",
    "achievements/js/expedition/expeditionVeteran.js",
    "achievements/js/expedition/criticalMastery.js",
    "achievements/js/expedition/speedExpeditions.js",
    "achievements/js/expedition/expeditionCommander.js",
    "achievements/js/expedition/expeditionMisfortune.js",
    "achievements/js/expedition/expeditionMisfortuneMaster.js",
    "achievements/js/expedition/expeditionMisfortuneLegend.js",
];

async function loadExpeditionAchievements()
{
    await loadScripts(EXPEDITION_ACHIEVEMENT_MODULES);
}
