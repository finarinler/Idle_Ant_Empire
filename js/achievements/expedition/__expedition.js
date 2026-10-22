
/* =========================
    Loader: Expedition Achievements

    Lädt die Expeditions-Erfolge.
========================= */

const EXPEDITION_ACHIEVEMENT_MODULES = [
    "js/achievements/expedition/foundTenAnts.js",
    "js/achievements/expedition/expeditionVeteran.js",
    "js/achievements/expedition/criticalMastery.js",
    "js/achievements/expedition/speedExpeditions.js",
    "js/achievements/expedition/expeditionCommander.js"
];

async function loadExpeditionAchievements()
{
    await loadScripts(EXPEDITION_ACHIEVEMENT_MODULES);
}
