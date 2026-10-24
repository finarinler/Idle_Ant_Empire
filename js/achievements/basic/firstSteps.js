/* Erfolg: Erste Schritte */

registerAchievement({
    id: "firstSteps",
    order: 100,
    getProgress: () => ({
        current: GameState.stats.expeditionsCount,
        goal: 5
    }),
    onUnlock: () =>
    {
        if (DOM.achievementToggleBtn)
        {
            DOM.achievementToggleBtn.style.display = "";
            DOM.achievementToggleBtn.disabled = false;
            DOM.achievementToggleBtn.title = I18N.tPlain("ui.achievements");
        }
    }
});
