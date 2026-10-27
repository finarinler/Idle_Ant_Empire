/* =========================================================
   Statistik — persistente Kennzahlen des Ameisenreichs
   Der Zähler läuft nur während das Spiel geöffnet ist und wird
   regelmäßig zusammen mit dem regulären Spielstand gespeichert.
========================================================= */
(() => {
    "use strict";

    let initialized = false;
    let lastSavedSecond = 0;

    function valueText(value) {
        if (value === undefined || value === null) return "0";
        if (typeof value === "object" && typeof value.toString === "function") return value.toString();
        return String(value);
    }

    function integerText(value) {
        const number = Number(value) || 0;
        return Math.max(0, Math.floor(number)).toLocaleString(
            I18N && I18N.getLanguageInfo ? I18N.getLanguageInfo().localeTag : "de-DE"
        );
    }

    function formatDuration(seconds) {
        seconds = Math.max(0, Math.floor(Number(seconds) || 0));
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const u = key => I18N.tPlain("statistics.unit." + key);
        if (days) return `${days} ${u("day")} ${hours} ${u("hour")} ${minutes} ${u("minute")}`;
        if (hours) return `${hours} ${u("hour")} ${minutes} ${u("minute")}`;
        if (minutes) return `${minutes} ${u("minute")} ${secs} ${u("second")}`;
        return `${secs} ${u("second")}`;
    }

    function set(id, value) {
        const node = document.getElementById(id);
        if (node) node.textContent = value;
    }

    function updateStatistics() {
        if (typeof GameState === "undefined") return;
        const resources = GameState.resources || {};
        const stats = GameState.stats || {};
        const structures = GameState.structures || {};
        const elite = GameState.eliteUnits || {};
        const buildings = (Number(structures.storageCount) || 0) +
            (Number(structures.nurseryCount) || 0) +
            (Number(structures.otherBuildingCount) || 0);

        set("stat-playtime", formatDuration(stats.totalPlayTimeSeconds));
        set("stat-ants-current", valueText(resources.ants));
        set("stat-ants-found", valueText(resources.antsFound));
        set("stat-ants-bred", valueText(resources.bredAnts));
        set("stat-queens", valueText(resources.queens));
        set("stat-buildings", integerText(buildings));
        set("stat-expeditions", integerText(stats.expeditionsCount));
        set("stat-expedition-ants", valueText(stats.expeditionAntsFound));
        set("stat-critical-expeditions", integerText(stats.criticalExpeditionsCount));
        set("stat-failed-expeditions", integerText(stats.failedExpeditionsCount));

        // Auch nach einem Sprachwechsel werden Zahlen mit der aktuellen Locale formatiert.
        if (typeof I18N !== "undefined" && I18N.getLanguageInfo) {
            const locale = I18N.getLanguageInfo().localeTag;
            ["stat-ants-current", "stat-ants-found", "stat-ants-bred", "stat-queens", "stat-expedition-ants"].forEach(id => {
                const node = document.getElementById(id);
                if (!node) return;
                const raw = id === "stat-ants-current" ? resources.ants :
                    id === "stat-ants-found" ? resources.antsFound :
                    id === "stat-ants-bred" ? resources.bredAnts :
                    id === "stat-queens" ? resources.queens : stats.expeditionAntsFound;
                if (typeof raw === "number" && Number.isFinite(raw)) node.textContent = raw.toLocaleString(locale);
            });
        }
    }

    function initStatistics() {
        if (initialized || typeof GameState === "undefined") return;
        initialized = true;
        if (!GameState.stats || typeof GameState.stats !== "object") GameState.stats = {};
        if (!Number.isFinite(Number(GameState.stats.totalPlayTimeSeconds))) GameState.stats.totalPlayTimeSeconds = 0;

        updateStatistics();
        window.setInterval(() => {
            GameState.stats.totalPlayTimeSeconds = (Number(GameState.stats.totalPlayTimeSeconds) || 0) + 1;
            updateStatistics();
            const current = GameState.stats.totalPlayTimeSeconds;
            if (current - lastSavedSecond >= 15) {
                lastSavedSecond = current;
                if (typeof saveGame === "function") saveGame();
            }
        }, 1000);
        window.addEventListener("pagehide", () => {
            if (typeof saveGame === "function") saveGame();
        });
        window.addEventListener("beforeunload", () => {
            if (typeof saveGame === "function") saveGame();
        });
        if (typeof I18N !== "undefined" && typeof I18N.onChange === "function") {
            I18N.onChange(updateStatistics);
        }
        console.info("[Statistics] Statistik-Dashboard bereit.");
    }

    window.initStatistics = initStatistics;
    window.updateStatistics = updateStatistics;
})();
