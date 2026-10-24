/* Erfolg: Pechvogel */

registerAchievement({
    id: "expeditionMisfortune",
    order: 397,
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 50
    })
});