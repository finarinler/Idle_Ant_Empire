/**
 * =========================
 * Ant Empire Idle - Kern
 * Zentraler Loader für alle Module.
 * Die Styles werden separat über css/__styles.js im <head> geladen.
 *
 * Jeder Ordner mit mehreren Dateien hat eine Loader-Datei (__name.js),
 * die ihre Dateien in der richtigen Reihenfolge lädt.
 * =========================
 */

// script = Datei, loader = Name der Funktion, die der Loader nach dem Laden anbietet
const APP_MODULES = [
    { script: "js/core/!core.js",                     loader: "loadCoreModules" },
    { script: "js/state/gameState.js" },
    { script: "js/utils/!utils.js",                   loader: "loadUtilModules" },
    { script: "js/ui/!ui.js",                         loader: "loadUIModules" },
    { script: "js/persistence/!persistence.js",       loader: "loadPersistenceModules" },
    { script: "js/achievements/!achievements.js",     loader: "loadAchievementModules" },
    { script: "js/expeditions/!expeditions.js",       loader: "loadExpeditionModules" },
    { script: "js/units/!units.js",                   loader: "loadUnitModules" },
    { script: "js/structures/!structures.js",         loader: "loadStructureModules" },
    { script: "js/initialization/!initialization.js", loader: "loadInitializationModules" },
    { script: "js/research/!research.js" }             // Vorbereitung, noch leer
];

/* =========================
    Script-Helfer (auch von den Loader-Dateien genutzt)
========================= */

function loadScript(path)
{
    return new Promise((resolve, reject) =>
    {
        const script = document.createElement("script");

        script.src = path;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Fehler beim Laden von: ${path}`));

        document.head.appendChild(script);
    });
}

async function loadScripts(paths)
{
    for (const path of paths)
    {
        await loadScript(path);
    }
}

/* =========================
    Fehleranzeige
    Statt einer leeren Seite wird ein Ladefehler sichtbar angezeigt.
========================= */

function showFatalError(error)
{
    console.error(error);

    const box = document.createElement("div");
    box.style.cssText =
        "position:fixed;top:0;left:0;right:0;z-index:100000;padding:12px 16px;" +
        "background:#b71c1c;color:#fff;font:14px Consolas,monospace;";
    box.textContent = `Idle Ant Empire konnte nicht starten: ${error.message}`;

    document.body.appendChild(box);
}

/* =========================
    Start
========================= */

async function loadModules()
{
    try
    {
        for (const entry of APP_MODULES)
        {
            await loadScript(entry.script);

            if (entry.loader)
            {
                await window[entry.loader]();
            }
        }

        initGame();
    }
    catch (error)
    {
        showFatalError(error);
    }
}

window.addEventListener("DOMContentLoaded", loadModules);
