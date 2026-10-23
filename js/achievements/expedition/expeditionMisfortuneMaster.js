/* Erfolg: Meister des Unglücks */

registerAchievement({
    id: "expeditionMisfortuneMaster",
    order: 398,
    title: "Meister des Unglücks",
    locked: {
        description: "100 erfolglose Expeditionen erleben"
    },
    unlocked: {
        description: "100 erfolglose Expeditionen erlebt",
        reward: "Belohnung: Die Misserfolgswahrscheinlichkeit sinkt weiter"
    },
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 100
    })
});