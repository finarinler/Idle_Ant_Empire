/* Erfolg: Erste Schritte */

registerAchievement({
    id: "firstSteps",
    order: 1,
    title: "Erste Schritte",
    locked: {
        description: "5 Expeditionen abgeschlossen"
    },
    unlocked: {
        description: "5 Expeditionen abgeschlossen",
        reward: "Belohnung: Erfolgsmenü freigeschaltet"
    },
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
            DOM.achievementToggleBtn.title = "Erfolge";
        }
    }
});
