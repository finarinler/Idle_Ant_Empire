/* =========================================================
   Idle Ant Empire — Freischaltung der Forschungsnavigation

   Forschung ist ein normaler Bereich in game.html.
   Die eigentliche Oberfläche wird in research/research.html
   innerhalb der zentralen Inhaltsfläche angezeigt.
========================================================= */

(() =>
{
    "use strict";

    function updateResearchButtonVisibility()
    {
        const researchButton = document.getElementById("game-nav-research");
        const militaryButton = document.getElementById("game-nav-military");
        const achievementsButton = document.getElementById("game-nav-achievements");

        const achievements = typeof GameState !== "undefined" && GameState.achievements
            ? GameState.achievements
            : {};

        const state = typeof GameState !== "undefined" ? GameState : {};
        const researchUnlocked = Boolean(achievements.knowledgeIsPower);
        const militaryUnlocked = Boolean(
            (state.research && state.research.militaryUnlocked)
            || (state.unlocks && state.unlocks.military)
            || achievements.militaryUnlocked
        );
        const achievementsUnlocked = Boolean(achievements.firstSteps);

        if (researchButton) researchButton.hidden = !researchUnlocked;
        if (militaryButton) militaryButton.hidden = !militaryUnlocked;
        if (achievementsButton) achievementsButton.hidden = !achievementsUnlocked;

        if (window.GameNavigation && typeof window.GameNavigation.refreshVisibility === "function")
        {
            window.GameNavigation.refreshVisibility();
        }
    }

    window.updateResearchButtonVisibility = updateResearchButtonVisibility;
    window.updateGameNavigationVisibility = updateResearchButtonVisibility;

    if (document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", updateResearchButtonVisibility, { once: true });
    }
    else
    {
        updateResearchButtonVisibility();
    }
})();
