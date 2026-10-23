/* Erfolg: Expeditionsveteran */

registerAchievement({
    id: "expeditionVeteran",
    order: 200,
    title: "Expeditionsveteran",
    locked: {
        description: "50 Expeditionen abschließen"
    },
    unlocked: {
        description: "50 Expeditionen abgeschlossen",
        reward: "Belohnung: Chance auf sehr erfolgreiche Expeditionen verdoppelt"
    },
    getProgress: () => ({
        current: GameState.stats.expeditionsCount,
        goal: 50
    })
});
