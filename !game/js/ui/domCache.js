/* =========================
    DOM Cache
    Zentrale Elemente der Oberfläche. Einheiten und Strukturen
    holen sich ihre eigenen Elemente in ihrer jeweiligen Datei (getEl).
========================= */

const DOM = {};

// Schlüssel im DOM-Objekt -> ID im HTML
const DOM_IDS = {
    // Ressourcen
    foodCount: "food-count",
    foodMax: "food-max",
    foodRate: "food-rate",
    larvaeCount: "larvae-count",
    larvaeMax: "larvae-max",
    larvaeRate: "larvae-rate",

    // Expedition
    expeditionBtn: "expedition-btn",
    expeditionProgress: "expedition-progress",
    expeditionText: "expedition-text",

    // Overlays
    flashOverlay: "flash-overlay",
    trophyOverlay: "achievement-trophy-overlay",

    // Logbuch und Erfolge
    logContainer: "log-container",
    logContent: "log-content",
    logResetBtn: "log-reset-btn",
    gameResetBtn: "game-reset-btn",
    achievementContainer: "achievement-container",
    achievementList: "achievement-list",
    noAchievementsMsg: "no-achievements-msg",
    statusText: "status-text",

    // Kategorien / Karten, die freigeschaltet werden
    catBasisStructures: "cat-basis-structures",
    catEliteUnits: "cat-elite-units",
    cardScout: "card-scout"
};

/**
 * Holt ein Element per ID und warnt in der Konsole, wenn es im HTML fehlt.
 * Fängt Tippfehler / vergessene IDs nach Umbauten sofort ab.
 */
function getEl(id)
{
    const element = document.getElementById(id);

    if (!element)
    {
        console.warn(`[DOM] Element mit der ID "${id}" wurde im HTML nicht gefunden.`);
    }

    return element;
}

/**
 * Führt fn aus, sobald das DOM bereit ist (oder sofort, falls es das schon ist).
 */
function onDOMReady(fn)
{
    if (document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", fn);
    }
    else
    {
        fn();
    }
}

function initDOM()
{
    Object.keys(DOM_IDS).forEach(key =>
    {
        DOM[key] = getEl(DOM_IDS[key]);
    });

    DOM.versionTag = document.querySelector(".version-tag");
}
