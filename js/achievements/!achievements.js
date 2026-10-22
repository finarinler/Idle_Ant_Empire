
/* =========================
    Loader: Erfolge

    Lädt zuerst den Core und danach
    alle Kategorie-Loader.
========================= */

const ACHIEVEMENT_MODULES = [
    // Core-Loader
    "js/achievements/core/!core.js",

    // Kategorie-Loader
    "js/achievements/basic/!basic.js",
    "js/achievements/collect/!collect.js",
    "js/achievements/build/!build.js",
    "js/achievements/expedition/!expedition.js",
    "js/achievements/research/!research.js"
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
