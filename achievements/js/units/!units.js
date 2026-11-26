/* =========================
    Loader: Unit Achievements

    Lädt die Erfolge rund um Einheiten.
========================= */

const UNIT_ACHIEVEMENT_MODULES = [
    "achievements/js/build/queenColonyTwentyFive.js",
    "achievements/js/build/queenColonyHundred.js"
];

async function loadUnitAchievements()
{
    await loadScripts(UNIT_ACHIEVEMENT_MODULES);
}
