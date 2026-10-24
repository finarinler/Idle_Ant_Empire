/* Erfolg: Meister des Unglücks */

registerAchievement({
    id: "expeditionMisfortuneMaster",
    order: 398,
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 100
    })
});