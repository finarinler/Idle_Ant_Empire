/**
 * =========================
 * Ant Empire Idle - Kern
 * Zentraler Loader für Module & Styles
 * =========================
 */

const APP_MODULES = [
    "js/core.js",
    "js/gameState.js",
    "js/formatter.js",
    "js/DOMCache.js",
    "js/persistenceLogic.js",
    "js/visualEffects.js",
    "js/uiLogic.js",
    "js/achievementLogic.js",
    "js/expeditionLogic.js",
    "js/basicUnits.js",
    "js/basicStructures.js",
    "js/production.js",
    "js/coreGameLoop.js",
    "js/initialization.js"
];

const APP_STYLES = [
    "style.css"
];

function loadStyles() {
    APP_STYLES.forEach(stylePath => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = stylePath;
        document.head.appendChild(link);
    });
}

async function loadModules() {
    for (const modulePath of APP_MODULES) {
        try {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = modulePath;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Fehler beim Laden von: ${modulePath}`));
                document.head.appendChild(script);
            });
        } catch (error) {
            console.error(error);
            break;
        }
    }
    
    if (typeof initGame === 'function') {
        initGame();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadStyles();
    loadModules();
});