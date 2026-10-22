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
        reward: "Belohnung: Kritische Erfolgschance verdoppelt (5 % → 10 %)"
    },
    getProgress: () => ({
        current: GameState.stats.expeditionsCount,
        goal: 250
    })
});
