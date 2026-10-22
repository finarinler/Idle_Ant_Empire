
/* =========================
    Loader: Collect Achievements

    Lädt die Sammel-Erfolge.
========================= */

const COLLECT_ACHIEVEMENT_MODULES = [
    "js/achievements/collect/smallCollector.js"
];

async function loadCollectAchievements()
{
    await loadScripts(COLLECT_ACHIEVEMENT_MODULES);
}
