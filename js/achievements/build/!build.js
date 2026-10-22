
/* =========================
    Loader: Build Achievements

    Lädt die Bau-Erfolge.
========================= */

const BUILD_ACHIEVEMENT_MODULES = [
    "js/achievements/build/smallColony.js",
    "js/achievements/build/buildColony.js"
];

async function loadBuildAchievements()
{
    await loadScripts(BUILD_ACHIEVEMENT_MODULES);
}
