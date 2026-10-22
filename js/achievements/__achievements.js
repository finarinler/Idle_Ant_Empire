
/* =========================
    Loader: Erfolge

    Lädt zuerst den Core und danach
    alle Kategorie-Loader.
========================= */

const ACHIEVEMENT_MODULES = [
    // Core-Loader
    "js/achievements/core/__core.js",

    // Kategorie-Loader
    "js/achievements/basic/__basic.js",
    "js/achievements/collect/__collect.js",
    "js/achievements/build/__build.js",
    "js/achievements/expedition/__expedition.js",
    "js/achievements/research/__research.js"
];

async function loadAchievementModules()
{
    // 1. Alle Loader-Dateien laden
    await loadScripts(ACHIEVEMENT_MODULES);

    // 2. Core laden: Registry, Karten und Logik
    await loadAchievementCore();

    // 3. Alle Erfolge laden
    await loadBasicAchievements();
    await loadCollectAchievements();
    await loadBuildAchievements();
    await loadExpeditionAchievements();
    await loadResearchAchievements();
}
