
/* =========================
    Loader: Build Achievements

    Lädt die Bau-Erfolge.
========================= */

const BUILD_ACHIEVEMENT_MODULES = [
    "achievements/js/build/smallColony.js",
    "achievements/js/build/buildColony.js",
    "achievements/js/build/mushroomFarmTen.js",
    "achievements/js/build/mushroomFarmTwentyFive.js",
    "achievements/js/build/mushroomFarmFifty.js",
    "achievements/js/build/mushroomFarmHundred.js",
    "achievements/js/build/mushroomFarmTwoFifty.js"
];

async function loadBuildAchievements()
{
    await loadScripts(BUILD_ACHIEVEMENT_MODULES);
}
