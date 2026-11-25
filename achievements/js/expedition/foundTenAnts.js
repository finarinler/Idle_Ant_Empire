/* Erfolg: Ameisenretter */

registerAchievement({
    category: "expedition",
    id: "foundTenAnts",
    order: 303,
    getProgress: () => ({
        current: GameState.stats.expeditionAntsFound,
        goal: 10
    })
});
