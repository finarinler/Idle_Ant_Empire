
/* =========================
    Loader: Build Achievements

    Lädt die Bau-Erfolge.
========================= */

const BUILD_ACHIEVEMENT_MODULES = [
    "achievements/js/build/smallColony.js",
    "achievements/js/build/buildColony.js"
];

async function loadBuildAchievements()
{
    await loadScripts(BUILD_ACHIEVEMENT_MODULES);
}
