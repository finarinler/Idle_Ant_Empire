/* Erfolg: Unaufhaltsame Expedition */

registerAchievement({
    category: "expedition",
    id: "expeditionMisfortuneLegend",
    order: 399,
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 150
    })
});