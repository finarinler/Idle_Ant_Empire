/* Erfolg: Expeditionsveteran */

registerAchievement({
    category: "expedition",
    id: "expeditionVeteran",
    order: 300,
    getProgress: () => ({
        current: GameState.stats.expeditionsCount,
        goal: 50
    })
});
