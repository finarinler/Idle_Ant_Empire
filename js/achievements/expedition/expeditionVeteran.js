/* Erfolg: Expeditionsveteran */

registerAchievement({
    id: "expeditionVeteran",
    order: 4,
    title: "Expeditionsveteran",
    locked: {
        description: "250 Expeditionen abschließen"
    },
    unlocked: {
        description: "250 Expeditionen abgeschlossen",
        reward: "Belohnung: Chance auf sehr erfolgreiche Expeditionen verdoppelt"
    },
    getProgress: () => ({
        current: GameState.stats.expeditionsCount,
        goal: 250
    })
});
