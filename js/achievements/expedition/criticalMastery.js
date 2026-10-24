/* Erfolg: Meister der Expedition */

registerAchievement({
    id: "criticalMastery",
    order: 304,
    getProgress: () => ({
        current: GameState.stats.criticalExpeditionsCount,
        goal: 250
    })
});
