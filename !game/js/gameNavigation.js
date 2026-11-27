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
        const navToggle = document.getElementById("game-navigation-toggle");
        const navItems = document.getElementById("game-navigation-items");
        const gameShell = nav?.closest(".game-shell");
        const header = document.querySelector(".sticky-top");

        // Die Navigation bleibt direkt unter dem tatsächlich sichtbaren Header.
        // Ein fixer Pixelwert war wegen der variablen Statusmeldung zu ungenau.
        function syncNavigationOffset()
        {
            if (!header || !nav) return;
            const headerHeight = Math.ceil(header.getBoundingClientRect().height);
            nav.style.setProperty("--game-navigation-sticky-top", (headerHeight + 12) + "px");
        }

        syncNavigationOffset();
        if (header && nav && typeof ResizeObserver !== "undefined")
        {
            const headerResizeObserver = new ResizeObserver(syncNavigationOffset);
            headerResizeObserver.observe(header);
        }
        else
        {
            window.addEventListener("resize", syncNavigationOffset, { passive: true });
        }
        const navButtons = Array.from(document.querySelectorAll(".game-nav-button[data-game-view]"));
        const views = Array.from(document.querySelectorAll("[data-game-view-panel]"));
        const optionsPanel = document.getElementById("options-menu");
        const achievementPanel = document.getElementById("achievement-container");
        const logPanel = document.getElementById("log-container");

        // Auf Mobilgeräten startet das Menü standardmäßig geschlossen.
        // Die letzte Auswahl bleibt lokal erhalten.
        const navigationStorageKey = "idleAntEmpireNavigationCollapsed";
        function setNavigationCollapsed(collapsed, persist = true)
        {
            if (!nav || !navToggle || !navItems) return;
            nav.classList.toggle("is-collapsed", collapsed);
            if (gameShell) gameShell.classList.toggle("navigation-collapsed", collapsed);
            navItems.hidden = collapsed;
            navToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
            const icon = navToggle.querySelector(".game-navigation-toggle-icon");
            if (icon) icon.textContent = collapsed ? "⌄" : "⌃";
            if (persist)
            {
                try { localStorage.setItem(navigationStorageKey, collapsed ? "1" : "0"); }
                catch (error) { /* Navigation funktioniert auch ohne lokalen Speicher. */ }
            }
        }

        if (nav && navToggle && navItems)
        {
            let savedState = null;
            try { savedState = localStorage.getItem(navigationStorageKey); }
            catch (error) { /* Auf mobilen Browsern kann Speicher gesperrt sein. */ }
            const initiallyCollapsed = savedState === null
                ? window.matchMedia("(max-width: 800px)").matches
                : savedState === "1";
            setNavigationCollapsed(initiallyCollapsed, false);
            navToggle.addEventListener("click", () =>
            {
                setNavigationCollapsed(!nav.classList.contains("is-collapsed"));
            });
        }

        if (!nav || !navButtons.length || !views.length)
        {
            console.warn("[GameNavigation] Navigationselemente fehlen.");
            return;
        }

        function showView(name)
        {
            const target = views.find(view => view.dataset.gameViewPanel === name);
            const targetButton = navButtons.find(button => button.dataset.gameView === name);
            if (!target || targetButton && targetButton.getAttribute("aria-disabled") === "true") return;
            const viewChanged = !target.classList.contains("is-active");

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

            // Beim Wechsel des Spielbereichs zurück zum Seitenanfang scrollen.
            if (viewChanged) window.scrollTo({ top: 0, behavior: "smooth" });

            if (name === "military") updateMilitaryOverview();
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
                research: {
                    // Forschungsbereich bleibt bis zur vollständigen Implementierung dauerhaft gesperrt.
                    unlocked: false,
                    hint: I18N.t("nav.hint.comingSoon")
                },
                military: {
                    unlocked: Boolean((state.research && state.research.militaryUnlocked) || (state.unlocks && state.unlocks.military) || achievements.militaryUnlocked),
                    hint: I18N.t("nav.hint.comingSoon")
                },
                achievements: {
                    unlocked: Boolean(achievements.firstSteps),
                    hint: I18N.t("nav.hint.firstSteps")
                },
                statistics: {
                    unlocked: false,
                    hint: I18N.t("nav.hint.underRevision")
                }
            };

            Object.entries(gates).forEach(([name, gate]) =>
            {
                const button = navButtons.find(item => item.dataset.gameView === name);
                if (!button) return;

                // Alle Bereiche bleiben von Beginn an sichtbar. Gesperrte Bereiche
                // sind nur optisch deaktiviert und erklären ihre Freischaltung per Hover.
                button.hidden = false;
                button.classList.toggle("is-locked", !gate.unlocked);
                button.setAttribute("aria-disabled", gate.unlocked ? "false" : "true");
                if (gate.unlocked)
                {
                    button.removeAttribute("data-tooltip");
                    button.removeAttribute("aria-description");
                }
                else
                {
                    // Eigener Tooltip im Spiel-Design statt des nativen Browser-Titels.
                    button.dataset.tooltip = gate.hint;
                    button.setAttribute("aria-description", gate.hint);
                    button.removeAttribute("title");
                }

                const activeView = views.find(view => view.dataset.gameViewPanel === name);
                if (!gate.unlocked && activeView && !activeView.hidden) showView("units");
            });
        }

        const statusLogbookButton = document.getElementById("status-logbook-button");
        if (statusLogbookButton)
        {
            statusLogbookButton.addEventListener("click", () => showView("logbook"));
        }

        // Navigation bleibt eine Single-Page-Ansicht: kein Seitenwechsel,
        // kein Reload und keine Änderung der URL. Das funktioniert auch auf GitHub Pages.
        navButtons.forEach(button => button.addEventListener("click", () =>
        {
            if (button.getAttribute("aria-disabled") === "true") return;
            showView(button.dataset.gameView);
            if (window.matchMedia("(max-width: 800px)").matches) setNavigationCollapsed(true);
        }));

        document.querySelectorAll("[data-game-view-target]").forEach(button =>
        {
            button.addEventListener("click", () => showView(button.dataset.gameViewTarget));
        });

        // Erfolgssystem und andere Module können die Sichtbarkeit nach Freischaltungen aktualisieren.
        window.GameNavigation = Object.freeze({ showView, updateMilitaryOverview, refreshVisibility });
        // Von Erfolgen aufgerufen (achievementLogic.js)
        window.updateResearchButtonVisibility = refreshVisibility;
        window.updateGameNavigationVisibility = refreshVisibility;
        refreshVisibility();
        showView("expeditions");
        updateMilitaryOverview();
        console.info("[GameNavigation] Linke Hauptnavigation bereit.");
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGameNavigation, { once: true });
    else initGameNavigation();
})();
