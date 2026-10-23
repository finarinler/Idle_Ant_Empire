/* Erfolg: Pechvogel */

registerAchievement({
    id: "expeditionMisfortune",
    order: 205,
    title: "Pechvogel",
    locked: {
        description: "50 erfolglose Expeditionen erleben"
    },
    unlocked: {
        description: "50 erfolglose Expeditionen erlebt",
        reward: "Belohnung: Die Misserfolgswahrscheinlichkeit sinkt um 50 %"
    },
    getProgress: () => ({
        current: GameState.stats.failedExpeditionsCount,
        goal: 50
    })
});