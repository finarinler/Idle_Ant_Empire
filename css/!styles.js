/**
 * =========================
 * CSS-Loader
 * Wird direkt im <head> der index.html eingebunden,
 * damit die Styles vor dem ersten Rendern geladen sind.
 * Die Reihenfolge entspricht der Kaskade (spätere überschreiben frühere).
 * =========================
 */

const STYLE_MODULES = [
    "css/variables.css",
    "css/base.css",
    "css/header.css",
    "css/expedition.css",
    "css/categories.css",
    "css/cards.css",
    "css/achievements.css",
    "css/footer.css",
    "css/effects.css",
    "css/responsive.css"
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
