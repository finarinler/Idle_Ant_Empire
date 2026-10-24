/* Erfolg: Expeditionsveteran */

registerAchievement({
    id: "expeditionVeteran",
    order: 300,
    getProgress: () => ({
        current: GameState.stats.expeditionsCount,
        goal: 50
    })
});
