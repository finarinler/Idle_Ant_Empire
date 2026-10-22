/* =========================
    App Module Loader
========================= */

const APP_MODULES = [
    { script: "js/core/!core.js", loader: "loadCoreModules" },
    { script: "js/state/gameState.js" },
    { script: "js/utils/!utils.js", loader: "loadUtilModules" },
    { script: "js/ui/!ui.js", loader: "loadUIModules" },
    { script: "js/persistence/!persistence.js", loader: "loadPersistenceModules" },
    { script: "js/achievements/!achievements.js", loader: "loadAchievementModules" },
    { script: "js/expeditions/!expeditions.js", loader: "loadExpeditionModules" },
    { script: "js/units/!units.js", loader: "loadUnitModules" },
    { script: "js/structures/!structures.js", loader: "loadStructureModules" },
    { script: "js/initialization/!initialization.js", loader: "loadInitializationModules" },
    { script: "js/research/!research.js" }
];


/* =========================
    Loading Screen
========================= */

const MIN_LOADING_TIME = 10000;

let loadingStartTime = 0;


/* =========================
    Loading Status
========================= */

function updateLoadingStatus(message) {
    const status = document.getElementById("loading-status");

    if (status) {
        status.textContent = message;
    }
}


/* =========================
    Loading Progress
========================= */

function updateLoadingProgress(percent) {
    const bar = document.querySelector(".loading-bar-fill");

    if (bar) {
        const progress = Math.max(0, Math.min(100, percent));
        bar.style.width = `${progress}%`;
    }
}


/* =========================
    Minimum Loading Time
========================= */

function waitForRemainingLoadingTime() {
    const elapsed = Date.now() - loadingStartTime;
    const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

    return new Promise(resolve => {
        window.setTimeout(resolve, remaining);
    });
}


/* =========================
    Hide Loading Screen
========================= */

function hideLoadingScreen() {
    const screen = document.getElementById("loading-screen");

    if (!screen) {
        return;
    }

    screen.classList.add("loading-hidden");

    window.setTimeout(() => {
        screen.remove();
    }, 500);
}


/* =========================
    Fatal Error
========================= */

function showFatalError(error) {
    console.error(error);

    updateLoadingStatus(
        "Das Laden ist fehlgeschlagen. Bitte überprüfe die Fehlermeldung."
    );

    const title = document.querySelector(".loading-title");

    if (title) {
        title.textContent = "Ups! Da ist etwas schiefgelaufen.";
    }

    const subtitle = document.querySelector(".loading-subtitle");

    if (subtitle) {
        subtitle.textContent =
            error.message || "Unbekannter Ladefehler.";
    }

    const bar = document.querySelector(".loading-bar");

    if (bar) {
        bar.style.display = "none";
    }
}


/* =========================
    Script Loader
========================= */

function loadScript(path) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = path;

        script.onload = resolve;

        script.onerror = () => {
            reject(
                new Error(`Fehler beim Laden von: ${path}`)
            );
        };

        document.head.appendChild(script);
    });
}


/* =========================
    Sequential Script Loader
========================= */

async function loadScripts(paths) {
    for (const path of paths) {
        await loadScript(path);
    }
}


/* =========================
    Load Game Modules
========================= */

async function loadModules() {
    loadingStartTime = Date.now();

    try {
        updateLoadingStatus(
            "Deine Ameisen werden versammelt ..."
        );

        updateLoadingProgress(0);

        for (let i = 0; i < APP_MODULES.length; i++) {
            const entry = APP_MODULES[i];

            updateLoadingStatus(
                `Lade Spielmodule ... (${i + 1}/${APP_MODULES.length})`
            );

            await loadScript(entry.script);

            if (entry.loader) {
                await window[entry.loader]();
            }

            // Ladefortschritt anhand der geladenen Module aktualisieren.
            // Die letzten 10 % bleiben für den Abschluss reserviert.
            const progress =
                ((i + 1) / APP_MODULES.length) * 90;

            updateLoadingProgress(progress);
        }

        updateLoadingStatus(
            "Deine Kolonie erwacht ..."
        );

        await initGame();

        // Sicherstellen, dass der Ladebildschirm
        // mindestens 10 Sekunden sichtbar bleibt.
        await waitForRemainingLoadingTime();

        updateLoadingProgress(100);

        updateLoadingStatus(
            "Deine Kolonie ist bereit!"
        );

        // Den vollständig gefüllten Balken kurz anzeigen.
        await new Promise(resolve => {
            window.setTimeout(resolve, 300);
        });

        hideLoadingScreen();

    } catch (error) {
        showFatalError(error);
    }
}


/* =========================
    Start Application
========================= */

window.addEventListener(
    "DOMContentLoaded",
    loadModules
);