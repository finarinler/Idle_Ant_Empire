
/* =========================
    Loader: Achievement Core

    Lädt die zentralen Module des Erfolgssystems
    in der erforderlichen Reihenfolge.
========================= */

const ACHIEVEMENT_CORE_MODULES = [
    // Registry muss vor den anderen Modulen geladen werden
    "achievements/js/core/achievementRegistry.js",

    // Darstellung der Erfolgskarten
    "achievements/js/core/achievementCard.js",

    // Prüfung, Freischaltung und Wiederherstellung
    "achievements/js/core/achievementLogic.js"
];

async function loadAchievementCore()
{
    await loadScripts(ACHIEVEMENT_CORE_MODULES);
}
