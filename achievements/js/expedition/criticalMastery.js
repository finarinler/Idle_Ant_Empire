/* Erfolg: Meister der Expedition */

registerAchievement({
    category: "expedition",
    id: "criticalMastery",
    order: 304,
    getProgress: () => ({
        current: GameState.stats.criticalExpeditionsCount,
        goal: 250
    })
});
