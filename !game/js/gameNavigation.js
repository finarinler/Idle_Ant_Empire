/* =========================================================
   Idle Ant Empire — linke Hauptnavigation
   Schaltet zentrale Spielbereiche um, ohne Spiel-DOM zu entfernen.
========================================================= */

(() =>
{
    "use strict";

    function initGameNavigation()
    {
        const nav = document.querySelector(".game-navigation");
        const navButtons = Array.from(document.querySelectorAll(".game-nav-button[data-game-view]"));
        const views = Array.from(document.querySelectorAll("[data-game-view-panel]"));
        const optionsPanel = document.getElementById("options-menu");
        const achievementPanel = document.getElementById("achievement-container");
        const logPanel = document.getElementById("log-container");

        if (!nav || !navButtons.length || !views.length)
        {
            console.warn("[GameNavigation] Navigationselemente fehlen.");
            return;
        }

        function showView(name)
        {
            const target = views.find(view => view.dataset.gameViewPanel === name);
            if (!target || target.hidden && navButtons.some(button => button.dataset.gameView === name && button.hidden)) return;

            views.forEach(view =>
            {
                const active = view === target;
                view.hidden = !active;
                view.classList.toggle("is-active", active);
            });

            navButtons.forEach(button =>
            {
                const active = button.dataset.gameView === name;
                button.classList.toggle("is-active", active);
                if (active) button.setAttribute("aria-current", "page");
                else button.removeAttribute("aria-current");
            });

            if (optionsPanel) optionsPanel.hidden = name !== "options";
            if (achievementPanel) achievementPanel.classList.toggle("collapsed", name !== "achievements");
            if (logPanel) logPanel.classList.toggle("collapsed", name !== "logbook");

            if (name === "military") updateMilitaryOverview();
            if (name === "research")
            {
                const frame = document.getElementById("research-frame");
                if (frame && !frame.dataset.loaded) frame.dataset.loaded = "true";
            }
        }

        function updateMilitaryOverview()
        {
            const source = document.getElementById("soldier-count");
            const target = document.getElementById("military-soldier-count");
            if (source && target) target.textContent = source.textContent || "0";
        }

        function refreshVisibility()
        {
            const achievements = typeof GameState !== "undefined" && GameState.achievements ? GameState.achievements : {};
            const state = typeof GameState !== "undefined" ? GameState : {};
            const gates = {
                research: Boolean(achievements.knowledgeIsPower),
                military: Boolean((state.research && state.research.militaryUnlocked) || (state.unlocks && state.unlocks.military) || achievements.militaryUnlocked),
                achievements: Boolean(achievements.firstSteps)
            };
            Object.entries(gates).forEach(([name, unlocked]) =>
            {
                const button = navButtons.find(item => item.dataset.gameView === name);
                if (button) button.hidden = !unlocked;
                const activeView = views.find(view => view.dataset.gameViewPanel === name);
                if (!unlocked && activeView && !activeView.hidden) showView("units");
            });
        }

        // Navigation bleibt eine Single-Page-Ansicht: kein Seitenwechsel,
        // kein Reload und keine Änderung der URL. Das funktioniert auch auf GitHub Pages.
        navButtons.forEach(button => button.addEventListener("click", () =>
        {
            showView(button.dataset.gameView);
        }));

        document.querySelectorAll("[data-game-view-target]").forEach(button =>
        {
            button.addEventListener("click", () => showView(button.dataset.gameViewTarget));
        });

        const soldierCount = document.getElementById("soldier-count");
        if (soldierCount && typeof MutationObserver !== "undefined")
        {
            new MutationObserver(updateMilitaryOverview).observe(soldierCount, { childList: true, characterData: true, subtree: true });
        }

        // Erfolgssystem und andere Module können die Sichtbarkeit nach Freischaltungen aktualisieren.
        window.GameNavigation = Object.freeze({ showView, updateMilitaryOverview, refreshVisibility });
        refreshVisibility();
        showView("expeditions");
        updateMilitaryOverview();
        console.info("[GameNavigation] Linke Hauptnavigation bereit.");
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGameNavigation, { once: true });
    else initGameNavigation();
})();
