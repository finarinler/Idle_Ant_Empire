/* Erfolg: Ameisenretter */

registerAchievement({
    id: "foundTenAnts",
    order: 303,
    getProgress: () => ({
        current: GameState.stats.expeditionAntsFound,
        goal: 10
    })
});
