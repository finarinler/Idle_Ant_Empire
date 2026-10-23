/* Erfolg: Unaufhaltsame Expedition */

registerAchievement({
    id: "expeditionMisfortuneLegend",
    order: 8,
    title: "Unaufhaltsame Expedition",
    locked: {
        description: "150 erfolglose Expeditionen erleben"
    },
    unlocked: {
        description: "150 erfolglose Expeditionen erlebt",
        reward: "Belohnung: Expeditionen scheitern nicht mehr und die Chance auf kritische Erfolge steigt auf 15 %"
    },
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 150
    })
});