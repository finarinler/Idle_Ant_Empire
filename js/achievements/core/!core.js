
/* =========================
    Loader: Achievement Core

    Lädt die zentralen Module des Erfolgssystems
    in der erforderlichen Reihenfolge.
========================= */

const ACHIEVEMENT_CORE_MODULES = [
    // Registry muss vor den anderen Modulen geladen werden
    "js/achievements/core/achievementRegistry.js",

    // Darstellung der Erfolgskarten
    "js/achievements/core/achievementCard.js",

    // Prüfung, Freischaltung und Wiederherstellung
    "js/achievements/core/achievementLogic.js"
];

async function loadAchievementCore()
{
    await loadScripts(ACHIEVEMENT_CORE_MODULES);
}
