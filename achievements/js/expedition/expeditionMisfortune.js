/* Erfolg: Pechvogel */

registerAchievement({
    category: "expedition",
    id: "expeditionMisfortune",
    order: 397,
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 50
    })
});