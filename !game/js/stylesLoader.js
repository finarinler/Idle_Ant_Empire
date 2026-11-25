/**
 * =========================
 * CSS-Loader
 * Wird direkt im <head> der index.html eingebunden,
 * damit die Styles vor dem ersten Rendern geladen sind.
 * Die Reihenfolge entspricht der Kaskade (spätere überschreiben frühere).
 * =========================
 */

const STYLE_MODULES = [
    "!game/css/core/variables.css",
    "!game/css/core/base.css",
    "!game/css/layout/header.css",
    "!game/css/layout/gameLayout.css",
    "!game/css/layout/gameNavigation.css",
    "expedition/css/expedition.css",
    "!game/css/components/categories.css",
    "!game/css/components/cards.css",
    "achievements/css/achievements.css",
    "statistics/css/statistics.css",
    "!game/css/layout/footer.css",
    "research/css/research.css",
    "!game/css/components/musicPlayer.css",
    "!game/css/core/effects.css",
    "!game/css/core/responsive.css"
];

function loadStyleModules()
{
    STYLE_MODULES.forEach(href =>
    {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    });
}

loadStyleModules();
