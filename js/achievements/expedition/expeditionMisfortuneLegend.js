/* Erfolg: Unaufhaltsame Expedition */

registerAchievement({
    id: "expeditionMisfortuneLegend",
    order: 399,
    title: "Unglückliche Legende",
    locked: {
        description: "150 erfolglose Expeditionen erleben"
    },
    unlocked: {
        description: "150 erfolglose Expeditionen erlebt",
        reward: "Belohnung: Expeditionen scheitern nicht mehr und die Chance auf kritische Erfolge steigt um 50%"
    },
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 150
    })
});