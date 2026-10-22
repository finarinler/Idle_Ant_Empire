
/* =========================
    Loader: Basic Achievements

    Lädt die grundlegenden Erfolge.
========================= */

const BASIC_ACHIEVEMENT_MODULES = [
    "js/achievements/basic/firstSteps.js"
];

async function loadBasicAchievements()
{
    await loadScripts(BASIC_ACHIEVEMENT_MODULES);
}
