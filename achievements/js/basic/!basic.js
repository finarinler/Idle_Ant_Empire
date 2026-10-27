
/* =========================
    Loader: Basic Achievements

    Lädt die grundlegenden Erfolge.
========================= */

const BASIC_ACHIEVEMENT_MODULES = [
    "achievements/js/basic/firstSteps.js"
];

async function loadBasicAchievements()
{
    await loadScripts(BASIC_ACHIEVEMENT_MODULES);
}
