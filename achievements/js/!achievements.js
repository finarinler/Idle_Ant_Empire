
/* =========================
    Loader: Erfolge

    Lädt zuerst den Core und danach
    alle Kategorie-Loader.
========================= */

const ACHIEVEMENT_MODULES = [
    // Core-Loader
    "achievements/js/core/!core.js",

    // Kategorie-Loader
    "achievements/js/basic/!basic.js",
    "achievements/js/collect/!collect.js",
    "achievements/js/build/!build.js",
    "achievements/js/expedition/!expedition.js",
    "achievements/js/research/!research.js"
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

    // Alle Erfolge direkt beim Start darstellen – nicht erst nach dem ersten Ressourcen-Tick.
    // Bereits erfüllte, aber noch nicht gespeicherte Erfolge werden regulär freigeschaltet.
    if (typeof checkAchievements === "function") {
        checkAchievements();
    }
}
