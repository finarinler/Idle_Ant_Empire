/* Erfolg: Unaufhaltsame Expedition */

registerAchievement({
    id: "expeditionMisfortuneLegend",
    order: 399,
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 150
    })
});