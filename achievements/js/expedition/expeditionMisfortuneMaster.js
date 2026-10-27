/* Erfolg: Meister des Unglücks */

registerAchievement({
    category: "expedition",
    id: "expeditionMisfortuneMaster",
    order: 398,
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 100
    })
});